// NavbarTabs.js
export const landlordTabs = [
  { label: "Employees", path: "/landlord/employees" },
  { label: "Tenants", path: "/landlord/tenants" },
  {
    label: "Properties",
    children: [
      { label: "View Requests", path: "/landlord/propertyLandlordView" },
      { label: "Create Request", path: "/landlord/propertyCreate" },
    ],
  },
  { label: "Documents", path: "/landlord/documents" },
  { label: "Payments", path: "/landlord/payments" },
  { label: "Communication", path: "/messages" },
  { label: "Maintenance", path: "/maintenance" },
];

export const tenantTabs = [
  { label: "My Rental", path: "/tenant/properties" },
  { label: "Payments", path: "/tenant/payments" },
  {
    label: "Request Maintenance",
    children: [
      { label: "View Requests", path: "/maintenance" },
      { label: "Create Request", path: "/maintenance/createRequest" },
    ],
  },
  { label: "Messages", path: "/messages" },
  { label: "My Documents", path: "/tenant/documents" }
];
