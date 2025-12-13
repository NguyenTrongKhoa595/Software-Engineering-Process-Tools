import LandlordNavbar from './LandlordNavbar';
import TenantNavbar from './TenantNavbar';

export function RoleNavbar() {
  if (typeof window === "undefined") return null;

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return null;

  return user.role === "LANDLORD"
    ? <LandlordNavbar />
    : <TenantNavbar />;
}
