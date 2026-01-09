import { api } from "./client";
import { API_ENDPOINTS } from "./config";

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
  getRentRoll: (): Promise<RentRollItemDTO[]> => {
    return api.get<RentRollItemDTO[]>(API_ENDPOINTS.REPORTS_LANDLORD_RENT_ROLL);
  },

  // Get Financial Summary (Aggregated)
  getFinancialSummary: (startDate: string, endDate: string): Promise<FinancialSummaryDTO> => {
    const query = new URLSearchParams({ startDate, endDate }).toString();
    return api.get<FinancialSummaryDTO>(`${API_ENDPOINTS.REPORTS_LANDLORD_FINANCIAL_SUMMARY}?${query}`);
  },

  // Get Financial Trends (Chart Data)
  getFinancialTrends: (startDate: string, endDate: string, interval: 'day' | 'month' = 'month'): Promise<FinancialTrendItemDTO[]> => {
    const query = new URLSearchParams({ startDate, endDate, interval }).toString();
    return api.get<FinancialTrendItemDTO[]>(`${API_ENDPOINTS.REPORTS_LANDLORD_FINANCIAL_TRENDS}?${query}`);
  },

  // Get Global Overdue Payments
  getOverduePayments: (): Promise<OverduePaymentItemDTO[]> => {
    return api.get<OverduePaymentItemDTO[]>(API_ENDPOINTS.REPORTS_LANDLORD_OVERDUE_PAYMENTS);
  },

  // Get Expiring Leases
  getExpiringLeases: (days: number = 60): Promise<ExpiringLeaseItemDTO[]> => {
    return api.get<ExpiringLeaseItemDTO[]>(`${API_ENDPOINTS.REPORTS_LANDLORD_EXPIRING_LEASES}?days=${days}`);
  },
};
