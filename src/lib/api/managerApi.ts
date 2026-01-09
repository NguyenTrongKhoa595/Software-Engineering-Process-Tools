import { api } from "./client";
import { API_BASE_URL, API_ENDPOINTS } from "./config";
import propertyApi, { PropertySummaryDTO, PropertyResponseDTO } from "./propertyApi";
import { leaseApplicationApi, LeaseApplicationResponseDTO } from "./leaseApplicationApi";
import { LeaseResponseDTO, leaseApi } from "./leaseApi";
import { MaintenanceListItem, getMaintenanceForLandlord } from "./maintenanceApi";

export interface ManagerDashboardStats {
  managedPropertiesCount: number;
  pendingApplicationsCount: number;
  activeLeasesCount: number;
  openMaintenanceCount: number;
}

export const managerApi = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<ManagerDashboardStats> => {
    return api.get<ManagerDashboardStats>(API_ENDPOINTS.MANAGER_STATS);
  },

  // Get properties managed by the current user
  getManagedProperties: async (): Promise<PropertySummaryDTO[]> => {
    return propertyApi.getMyProperties();
  },

  // Get applications for managed properties
  getManagedApplications: async (): Promise<LeaseApplicationResponseDTO[]> => {
    return leaseApplicationApi.getApplicationsForManager();
  },

  // Get leases for managed properties
  getManagedLeases: async (): Promise<LeaseResponseDTO[]> => {
    // Using existing landlord endpoint which supports managers
    return leaseApi.getLeasesForLandlord();
  },

  // Get maintenance requests for managed properties
  getManagedMaintenance: async (): Promise<MaintenanceListItem[]> => {
    const response = await getMaintenanceForLandlord();
    return response.content;
  },
};
