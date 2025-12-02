'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/apiClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Public routes
const LOGIN_PATHS = new Set<string>(['/', '/login']);
const PUBLIC_PATHS = new Set<string>(['/register', '/employee-login']);
const EXCLUDED_PATHS = new Set<string>(['/favicon.ico']);

export default function AuthGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Skip assets and internal API
    if (EXCLUDED_PATHS.has(pathname) || pathname.startsWith('/api')) {
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

        if (cancelled) return;

        // If user is visiting login while authenticated, redirect to dashboard
        if (res.success && LOGIN_PATHS.has(pathname)) {
          router.replace('/dashboard');
          return;
        }

        // For protected routes, redirect unauthenticated users to login
        const isPublic = PUBLIC_PATHS.has(pathname) || LOGIN_PATHS.has(pathname);
        if (!res.success && !isPublic) {
          router.replace('/');
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