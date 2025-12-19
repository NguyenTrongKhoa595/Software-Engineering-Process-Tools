// NavbarTabs.js
export const landlordTabs = [
  { label: "Employees", path: "/landlord/employees" },
  {
    label: "Properties",
    children: [
      { label: "View Requests", path: "/landlord/propertyLandlordView" },
      { label: "Create Request", path: "/landlord/propertyCreate" },
    ],
  },
  { label: "Documents", path: "/property/select" },
  { label: "Payments", path: "/payment/paymentsView" },
  { label: "Communication", path: "/messages" },
  { label: "Maintenance", path: "/maintenance" },
];

export const tenantTabs = [
  { label: "Payments", path: "/payment/paymentsView" },
  {
    label: "Request Maintenance",
    children: [
      { label: "View Requests", path: "/maintenance" },
      { label: "Create Request", path: "/maintenance/createRequest" },
    ],
  },
  { label: "Messages", path: "/messages" },
  { label: "My Documents", path: `/property/select` }
];
