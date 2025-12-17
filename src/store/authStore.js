// src/store/authStore.js
// Requires: npm install zustand
import { create } from 'zustand';

function deriveRole(user) {
  if (!user) return null;
  return (
    user.role || user.app_role || user.user_role || user.roleName || null
  );
}

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    // Persist for compatibility with existing code
    if (typeof window !== 'undefined') {
      try {
        if (token) localStorage.setItem('accessToken', token);
        if (user) localStorage.setItem('user', JSON.stringify(user));
        const role = deriveRole(user);
        if (role) localStorage.setItem('role', role);
      } catch (_) {}
    }
    set({ user, token: token || null, isAuthenticated: !!token });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
      } catch (_) {}
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  hydrate: () => {
    if (typeof window === 'undefined') return;
    try {
      const token = localStorage.getItem('accessToken') || null;
      const rawUser = localStorage.getItem('user');
      const user = rawUser ? JSON.parse(rawUser) : null;
      set({ user, token, isAuthenticated: !!token });
    } catch (e) {
      // If corrupted, clear
      try {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      } catch (_) {}
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
}));

