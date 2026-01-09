# Backend API Requirements for Landlord Dashboard (Professional Tier)

This document outlines the API endpoints required to support the "Professional" Landlord Dashboard features.
**Current Status:** The frontend currently emulates these by fetching ALL leases and ALL rent schedules (O(N^2) complexity), which is not scalable.
**Priority:** High

## 1. Rent Roll & Tenant Payment History (CRITICAL)
**Endpoint:** `GET /api/reports/landlord/rent-roll`
**Description:** Returns a joined view of Active Leases + Aggregated Payment History.
**Why needed?**
1.  **Avoid N+1 Problem:** Currently, we must fetch `GET /leases` (N items) then `GET /rent-schedule/{id}` (N times). This endpoint replaces N+1 calls with 1 call.
2.  **Context Missing:** Existing `RentScheduleItemDTO` does not include `propertyTitle` or `tenantName`, making it impossible to display a "Global Key Dates" list without fetching the parent lease.
3.  **Aggregation:** Calculating "Total Paid YTD" vs "Total Due YTD" requires iterating the entire history. This should be done via SQL `SUM()` on the backend.

**Required Response Structure:**
```json
[
  {
    "leaseId": 101,
    "propertyId": 55,
    "propertyTitle": "Sunset Apartments #4B",
    "propertyAddress": "123 Main St, Apt 4B",
    "tenantName": "Nguyen Van A",
    "tenantAvatarUrl": "https://...",
    "rentAmount": 1200.00,
    "financials": {
      "totalPaidYTD": 14400.00,      // SQL SUM(amountPaid) where leaseId = X
      "totalDueYTD": 14400.00,       // SQL SUM(amountDue) where leaseId = X
      "lastPaymentDate": "2024-10-01",
      "lastPaymentAmount": 1200.00,
      "nextDueDate": "2024-11-01",
      "nextDueAmount": 1200.00,
      "daysUntilDue": 15
    },
    "status": "ON_TIME" // Derived from looking at nextDue vs current date
  }
]
```

## 2. Financial Metrics Summary
**Endpoint:** `GET /api/reports/landlord/financial-summary`
**Description:** Aggregated financial data for the dashboard header.
**Query Parameters:** `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` (CRITICAL for date filtering)
**Why needed?**
-   **Performance:** Backend can run a single optimized query (e.g., `SELECT SUM(...)`) instead of sending megabytes of JSON to the client to sum up in JavaScript.

**Required Response Structure:**
```json
{
  "currency": "USD",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "summary": {
    "totalRevenue": 50000.00,    // Actual collected
    "pendingRevenue": 5000.00,   // Due but not paid in current month
    "expenses": 1200.00,         // Maintenance costs (Future)
    "netIncome": 43800.00
  }
}
```

## 3. Global Overdue Payments
**Endpoint:** `GET /api/reports/landlord/overdue-payments`
**Description:** A flat list of specific overdue schedules containing Lease/Property context.
**Why needed?**
-   The existing `RENT_SCHEDULE_UPCOMING` endpoint does not return the `propertyTitle` or `tenantName`, so it cannot be used to show a "Dashboard Alert".

**Required Response Structure:**
```json
[
  {
    "leaseId": 101,
    "tenantName": "Le Thi B",
    "propertyTitle": "Ocean View Villa",
    "dueDate": "2024-10-01",
    "daysOverdue": 15,
    "amountDue": 1200.00,
    "amountPaid": 0.00
  }
]
```
