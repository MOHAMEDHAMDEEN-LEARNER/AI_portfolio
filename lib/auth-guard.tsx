'use client';

import { useAuth } from './auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/login',
  fallback 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login with current page as redirect parameter
      const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
    }
  }, [user, loading, router, redirectTo, pathname]);

  // Show loading state
  if (loading) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!user) {
    return null;
  }

  // User is authenticated, show the protected content
  return <>{children}</>;
}

// Hook to check if user should have access to a route
export function useAuthGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const requireAuth = (redirectTo = '/login') => {
    useEffect(() => {
      if (!loading && !user) {
        const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(pathname)}`;
        router.push(loginUrl);
      }
    }, [user, loading, router, redirectTo, pathname]);

    return { user, loading, isAuthenticated: !!user };
  };

  const requireGuest = (redirectTo = '/generate') => {
    useEffect(() => {
      if (!loading && user) {
        router.push(redirectTo);
      }
    }, [user, loading, router, redirectTo]);

    return { user, loading, isGuest: !user };
  };

  return { requireAuth, requireGuest };
}
