// hooks/useAuth.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export function useAuth(requiredRole) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("access_token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      router.replace("/");
      return;
    }

    const user = JSON.parse(userRaw);

    if (requiredRole && user.role !== requiredRole) {
      router.replace(`/${user.role.toLowerCase()}`);
    }
  }, [requiredRole, router]);
}
