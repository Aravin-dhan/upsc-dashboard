'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only redirect after component is mounted and authentication is complete
    if (mounted && !isLoading && user && user.role !== 'admin') {
      console.log('Non-admin user attempting to access admin area, redirecting...');
      router.push('/dashboard');
    }
  }, [mounted, user, isLoading, router]);

  // Show loading state while checking authentication or during SSR
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Show access denied for non-admin users (only after mounting and auth check)
  if (mounted && !isLoading && (!user || user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have permission to access the admin panel.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render admin content with error boundary (sidebar is handled globally)
  return (
    <AdminErrorBoundary>
      {children}
    </AdminErrorBoundary>
  );
}
