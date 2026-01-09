import { api } from "./client";
import { API_ENDPOINTS } from "./config";
import { leaseApi } from "./leaseApi";
import { paymentApi } from "./paymentApi";
import { isAfter, isBefore, parseISO, differenceInDays, format, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

// Financial Summary
export interface FinancialSummaryDTO {
  currency: string;
  startDate: string;
  endDate: string;
  summary: {
    totalRevenue: number;
    pendingRevenue: number;
    expenses: number;
    netIncome: number;
  };
}

// Rent Roll
export interface RentRollItemDTO {
  leaseId: number;
  propertyId: number;
  propertyTitle: string;
  propertyAddress: string;
  tenantName: string;
  tenantAvatarUrl: string | null;
  rentAmount: number;
  financials: {
    totalPaidYTD: number;
    totalDueYTD: number;
    lastPaymentDate: string | null;
    lastPaymentAmount: number;
    nextDueDate: string | null;
    nextDueAmount: number;
    daysUntilDue: number;
  };
  status: 'ON_TIME' | 'OVERDUE' | 'LATE' | 'PAID_AHEAD';
}

// Financial Trends
export interface FinancialTrendItemDTO {
  label: string; // "Jan 2024" or "01 Jan"
  date: string;  // ISO Date for sorting
  revenue: number;
  expenses: number;
}

// Overdue Payments
export interface OverduePaymentItemDTO {
  leaseId: number;
  tenantName: string;
  propertyTitle: string;
  dueDate: string;
  daysOverdue: number;
  amountDue: number;
  amountPaid: number;
}

// Expiring Leases
export interface ExpiringLeaseItemDTO {
  leaseId: number;
  propertyTitle: string;
  tenantName: string;
  endDate: string;
  daysRemaining: number;
}

export const reportApi = {
  // Get Rent Roll (Advanced Tenant Payment History)
  getRentRoll: async (): Promise<RentRollItemDTO[]> => {
    try {
      // 1. Fetch all leases for the current landlord
      const leases = await leaseApi.getLeasesForLandlord();
      
      // 2. Fetch Rent Schedule for EACH lease (Parallel Request)
      const rentRollPromises = leases.map(async (lease) => {
        try {
          // Fetch full schedule
          const scheduleData = await paymentApi.getRentSchedule(lease.id);
          const scheduleItems = scheduleData.schedule;

          // Compute Financials
          const totalPaidYTD = scheduleItems.reduce((sum, item) => sum + (item.amountPaid || 0), 0);
          const totalDueYTD = scheduleItems.reduce((sum, item) => sum + (item.amountDue || 0), 0);
          
          // Find last payment
          const paidItems = scheduleItems.filter(i => i.amountPaid > 0 && i.paidAt).sort((a, b) => new Date(b.paidAt!).getTime() - new Date(a.paidAt!).getTime());
          const lastPayment = paidItems.length > 0 ? paidItems[0] : null;

          // Find next due
          // Sort by due date ascending, filter for future or unpaid
          const upcomingItems = scheduleItems
            .filter(i => i.status !== 'PAID' && i.status !== 'WAIVED')
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
          const nextDue = upcomingItems.length > 0 ? upcomingItems[0] : null;

          // Determine Status
          let status: 'ON_TIME' | 'OVERDUE' | 'LATE' | 'PAID_AHEAD' = 'ON_TIME';
          if (nextDue && isBefore(parseISO(nextDue.dueDate), new Date()) && nextDue.status === 'OVERDUE') {
            status = 'OVERDUE';
          } else if (nextDue && nextDue.status === 'LATE') {
            status = 'LATE'; // Backend might mark it late even if not deeply overdue
          }

          return {
            leaseId: lease.id,
            propertyId: lease.propertyId,
            propertyTitle: lease.propertyTitle,
            propertyAddress: lease.propertyAddress,
            tenantName: lease.tenantName,
            tenantAvatarUrl: lease.tenantAvatarUrl,
            rentAmount: lease.rentAmount,
            financials: {
              totalPaidYTD,
              totalDueYTD,
              lastPaymentDate: lastPayment?.paidAt || null,
              lastPaymentAmount: lastPayment?.amountPaid || 0,
              nextDueDate: nextDue?.dueDate || null,
              nextDueAmount: nextDue?.amountDue || 0,
              daysUntilDue: nextDue ? differenceInDays(parseISO(nextDue.dueDate), new Date()) : 0
            },
            status
          };
        } catch (err) {
          console.error(`Failed to fetch schedule for lease ${lease.id}`, err);
          return null;
        }
      });

      const results = await Promise.all(rentRollPromises);
      return results.filter((item): item is RentRollItemDTO => item !== null);

    } catch (error) {
      console.error("Rent Roll Aggregation failed", error);
      return [];
    }
  },

  // Get Financial Summary (Aggregated from Real Data)
  getFinancialSummary: async (startDateStr: string, endDateStr: string): Promise<FinancialSummaryDTO> => {
    try {
      const startDate = parseISO(startDateStr);
      const endDate = parseISO(endDateStr);

      const leases = await leaseApi.getLeasesForLandlord();
      const schedules = await Promise.all(leases.map(l => paymentApi.getRentSchedule(l.id).catch(() => null)));

      let totalRevenue = 0;
      let pendingRevenue = 0;
      // We don't have real expenses API yet, so we'll keep that 0 or estimate
      let expenses = 0; 

      schedules.forEach(scheduleData => {
        if (!scheduleData) return;
        scheduleData.schedule.forEach(item => {
          const dueDate = parseISO(item.dueDate);
          // Check if item falls within the requested date range
          if (isWithinInterval(dueDate, { start: startDate, end: endDate })) {
             totalRevenue += item.amountPaid || 0;
             if (item.status === 'DUE' || item.status === 'OVERDUE') {
                pendingRevenue += (item.amountDue - item.amountPaid);
             }
          }
        });
      });

      return {
        currency: "USD",
        startDate: startDateStr,
        endDate: endDateStr,
        summary: {
          totalRevenue,
          pendingRevenue,
          expenses,
          netIncome: totalRevenue - expenses
        }
      };
    } catch (error) {
      console.error("Financial Summary Aggregation failed", error);
       return {
        currency: "USD",
        startDate: startDateStr,
        endDate: endDateStr,
        summary: { totalRevenue: 0, pendingRevenue: 0, expenses: 0, netIncome: 0 }
      };
    }
  },

  // Get Financial Trends (Chart Data from Real Data)
  getFinancialTrends: async (startDateStr: string, endDateStr: string, interval: 'day' | 'month' = 'month'): Promise<FinancialTrendItemDTO[]> => {
    try {
      // 1. Get raw data similar to summary
      const startDate = parseISO(startDateStr);
      const endDate = parseISO(endDateStr);
      const leases = await leaseApi.getLeasesForLandlord();
      const schedules = await Promise.all(leases.map(l => paymentApi.getRentSchedule(l.id).catch(() => null)));

      // 2. Bucket data by Month
      const monthlyData: Record<string, { revenue: number, expenses: number }> = {};

      schedules.forEach(scheduleData => {
        if (!scheduleData) return;
        scheduleData.schedule.forEach(item => {
           if (item.amountPaid > 0 && item.paidAt) {
             const paidDate = parseISO(item.paidAt);
             if (isWithinInterval(paidDate, { start: startDate, end: endDate })) {
               const monthKey = format(paidDate, 'MMM yyyy'); // e.g. "Oct 2024"
               if (!monthlyData[monthKey]) monthlyData[monthKey] = { revenue: 0, expenses: 0 };
               monthlyData[monthKey].revenue += item.amountPaid;
             }
           }
        });
      });

      // 3. Convert to Array and Sort
      return Object.entries(monthlyData).map(([label, data]) => ({
        label,
        date: label, // Using label as date for now, ideally strictly ISO
        revenue: data.revenue,
        expenses: data.expenses
      }));

    } catch (error) {
       console.error("Financial Trends Aggregation failed", error);
       return [];
    }
  },

  // Get Global Overdue Payments
  getOverduePayments: async (): Promise<OverduePaymentItemDTO[]> => {
    try {
      const leases = await leaseApi.getLeasesForLandlord();
      const schedules = await Promise.all(leases.map(l => paymentApi.getRentSchedule(l.id).then(res => ({ lease: l, schedule: res.schedule })).catch(() => null) ));

      const overdueItems: OverduePaymentItemDTO[] = [];

      schedules.forEach(data => {
        if (!data) return;
        const { lease, schedule } = data;
        
        schedule.filter(item => item.status === 'OVERDUE').forEach(item => {
            overdueItems.push({
                leaseId: lease.id,
                tenantName: lease.tenantName,
                propertyTitle: lease.propertyTitle,
                dueDate: item.dueDate,
                daysOverdue: differenceInDays(new Date(), parseISO(item.dueDate)),
                amountDue: item.amountDue,
                amountPaid: item.amountPaid
            });
        });
      });

      return overdueItems;
    } catch (error) {
      console.error("Overdue Payments Aggregation failed", error);
      return [];
    }
  },

  // Get Expiring Leases
  getExpiringLeases: async (days: number = 60): Promise<ExpiringLeaseItemDTO[]> => {
    try {
      const leases = await leaseApi.getLeasesForLandlord();
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);

      return leases
        .filter(l => l.status === 'ACTIVE' && isBefore(parseISO(l.endDate), targetDate))
        .map(l => ({
            leaseId: l.id,
            propertyTitle: l.propertyTitle,
            tenantName: l.tenantName,
            endDate: l.endDate,
            daysRemaining: differenceInDays(parseISO(l.endDate), new Date())
        }));

    } catch (error) {
      console.error("Expiring Leases Aggregation failed", error);
      return [];
    }
  },
};
