'use client';

import { useAuth, withAuth } from '@/contexts/AuthContext';
import CouponManagement from '@/components/admin/CouponManagement';

function CouponManagementPage() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">Admin access required</p>
        </div>
      </div>
    );
  }

  return <CouponManagement />;
}

export default withAuth(CouponManagementPage, 'admin');
