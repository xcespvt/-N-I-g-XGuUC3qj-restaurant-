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

    const isLogin = LOGIN_PATHS.has(pathname);
    const isPublic = PUBLIC_PATHS.has(pathname) || isLogin;

    // Do not perform token verification on public pages like /register
    // Still allow login pages to verify so we can redirect authenticated users
    if (isPublic && !isLogin) {
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
        if (res.success && isLogin) {
          router.replace('/dashboard');
          return;
        }

        // For protected routes, redirect unauthenticated users to login
        if (!res.success && !isPublic) {
          router.replace('/');
        }
      } catch (err) {
        // On network or server error, only redirect on protected routes
        if (!cancelled && !isPublic) {
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
