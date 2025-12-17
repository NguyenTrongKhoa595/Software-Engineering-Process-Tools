// src/hooks/useRequireAuth.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../store/authStore';

// Simple auth guard for Pages Router pages
// Usage in a page component:
//   const canRender = useRequireAuth();
//   if (!canRender) return null;
export default function useRequireAuth() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    // If store already knows, use it immediately
    if (isAuthenticated) {
      setCanRender(true);
      return;
    }

    // Fallback: check localStorage token
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token) {
        setCanRender(true);
      } else {
        setCanRender(false);
        router.replace('/login');
      }
    } catch (e) {
      setCanRender(false);
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return canRender;
}

