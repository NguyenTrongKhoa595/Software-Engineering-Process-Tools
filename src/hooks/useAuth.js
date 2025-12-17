// src/hooks/useAuth.js
import { useMemo } from 'react';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAuth = useAuthStore((s) => s.setAuth);
  const storeLogout = useAuthStore((s) => s.logout);

  const role = useMemo(() => {
    if (!user) return null;
    return (
      user.role || user.app_role || user.user_role || user.roleName || null
    );
  }, [user]);

  const logout = () => {
    storeLogout();
  };

  return {
    user,
    token,
    role,
    isAuthenticated,
    setAuth,
    logout,
  };
}

