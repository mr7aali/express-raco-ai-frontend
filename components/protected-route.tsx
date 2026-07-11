'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'CUSTOMER' | 'ADMIN';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.push('/');
      return;
    }
  }, [user, requiredRole, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <div>Access Denied</div>;
  }

  return children;
}
