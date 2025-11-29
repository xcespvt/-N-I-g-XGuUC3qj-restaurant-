'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Public routes that do not require authentication
const PUBLIC_PATHS = new Set<string>(['/', '/login', '/register', '/employee-login', '/favicon.ico']);

export default function AuthGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Skip guard for public routes
    if (PUBLIC_PATHS.has(pathname) || pathname.startsWith('/api')) {
      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        // Call backend to verify token. Cookie is sent automatically via credentials: 'include'.
        const res = await apiClient<{ success: boolean; message?: string }>(
          `${API_BASE_URL}/api/auth/verify-token`,
          { method: 'POST' }
        );

        if (!cancelled && !res.success) {
          router.replace('/'); // redirect to login page
        }
      } catch (err) {
        // On network or server error, treat as unauthenticated
        if (!cancelled) {
          router.replace('/');
        }
      }
    }

    verify();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return null;
}