import { useState, useEffect } from "react";
import LandlordNavbar from "./LandlordNavbar";
import TenantNavbar from "./TenantNavbar";

export function RoleNavbar() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // safety

    const stored = window.localStorage.getItem("user");
    if (!stored) return;

    try {
      const user = JSON.parse(stored);
      if (user?.role) {
        setUserRole(user.role); // "LANDLORD" | "TENANT" etc.
      }
    } catch (e) {
      console.warn("Invalid user JSON in localStorage", e);
    }
  }, []);

  // Server + first client render: same HTML (nothing or a placeholder)
  if (userRole === null) return null;

  return userRole === "LANDLORD" || userRole === "PROPERTY_MANAGER" ? <LandlordNavbar role={userRole} /> : <TenantNavbar />;
}
