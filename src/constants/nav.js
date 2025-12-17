// src/constants/nav.js
// Centralized role-based navigation items for top navs

export const NAV_ITEMS = {
  TENANT: [
    { label: 'Properties', href: '/properties' },
    { label: 'Documents', href: '/properties/select?returnTo=properties' },
    { label: 'Messages', href: '/messages' },
    { label: 'Payments', href: '/payments' },
    { label: 'Requests', href: '/dashboard/requests' },
  ],
  LANDLORD: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Employees', href: '/dashboard/employees' },
    { label: 'Properties', href: '/properties' },
    { label: 'Messages', href: '/messages' },
  ],
  PROPERTY_MANAGER: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Properties', href: '/properties' },
    { label: 'Messages', href: '/messages' },
  ],
};

export function getNavItems(role) {
  if (!role) return NAV_ITEMS.TENANT; // sensible default
  return NAV_ITEMS[role] || NAV_ITEMS.TENANT;
}

