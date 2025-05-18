'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCheck({ 
  children,
  adminOnly = false 
}: { 
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }
    
    if (adminOnly && session.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [session, status, router, adminOnly]);

  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-primary-color border-r-gray-200 border-b-gray-200 border-l-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!session) return null;
  
  if (adminOnly && session.user?.role !== 'ADMIN') return null;
  
  return <>{children}</>;
} 