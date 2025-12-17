// src/constants/nav.js
// Centralized role-based navigation items for top navs

export const NAV_ITEMS = {
  TENANT: [
    { label: 'Properties', href: '/properties' },
    { label: 'Documents', href: '/property/select?returnTo=documents-tenant' },
    { label: 'Messages', href: '/messages' },
    { label: 'Payments', href: '/payments' },
    { label: 'Requests', href: '/requests' },
  ],
  LANDLORD: [
    { label: 'Employees', href: '/employees' },
    { label: 'Properties', href: '/properties' },
    { label: 'Documents', href: '/property/select?returnTo=documents' },
    { label: 'Messages', href: '/messages' },
    { label: 'Payments', href: '/payments' },
  ],
  PROPERTY_MANAGER: [
    { label: 'Properties', href: '/properties' },
    { label: 'Documents', href: '/property/select?returnTo=documents' },
    { label: 'Messages', href: '/messages' },
    { label: 'Payments', href: '/payments' },
  ],
};

export function getNavItems(role) {
  if (!role) return NAV_ITEMS.TENANT; // sensible default
  return NAV_ITEMS[role] || NAV_ITEMS.TENANT;
}

