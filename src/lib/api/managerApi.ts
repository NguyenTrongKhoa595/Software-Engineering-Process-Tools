import { api } from "./client";
import { API_BASE_URL } from "./config";
import { PropertySummaryDTO, PropertyResponseDTO } from "./propertyApi";
import { LeaseApplicationResponseDTO } from "./leaseApplicationApi";
import { LeaseResponseDTO } from "./leaseApi";
import { MaintenanceListItem } from "./maintenanceApi";

export const managerApi = {
  // Get properties managed by the current user
  getManagedProperties: async (): Promise<PropertySummaryDTO[]> => {
    return api.get<PropertySummaryDTO[]>(`${API_BASE_URL}/api/manager/properties`);
  },

  // Get applications for managed properties
  getManagedApplications: async (): Promise<LeaseApplicationResponseDTO[]> => {
    return api.get<LeaseApplicationResponseDTO[]>(`${API_BASE_URL}/api/manager/applications`);
  },

  // Get leases for managed properties
  getManagedLeases: async (): Promise<LeaseResponseDTO[]> => {
    return api.get<LeaseResponseDTO[]>(`${API_BASE_URL}/api/manager/leases`);
  },

  // Get maintenance requests for managed properties
  getManagedMaintenance: async (): Promise<MaintenanceListItem[]> => {
    return api.get<MaintenanceListItem[]>(`${API_BASE_URL}/api/manager/maintenance`);
  },
};
