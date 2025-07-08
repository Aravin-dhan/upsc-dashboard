'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import GlobalSidebar from './GlobalSidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Define public routes that don't need sidebar
  const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset-password', '/privacy', '/terms', '/contact', '/about'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Show sidebar only for authenticated users on protected routes
  const showSidebar = !isLoading && isAuthenticated && !isPublicRoute;

  // For public routes, use full-width layout
  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {children}
      </div>
    );
  }

  // For protected routes, use sidebar layout
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {showSidebar && <GlobalSidebar />}

      {/* Main Content Area - adjusted for GlobalSidebar */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${showSidebar ? 'lg:ml-64' : ''}`}>
        {/* Mobile Header Space - only show if sidebar is present */}
        {showSidebar && (
          <div className="lg:hidden h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700" />
        )}

        {/* Main Content */}
        <main className={`
          flex-1 overflow-y-auto
          ${showSidebar
            ? isMobile
              ? 'px-4 py-4 pb-20' // Mobile: smaller padding, space for bottom nav
              : 'p-6 lg:p-8'      // Desktop: larger padding
            : 'p-0'               // Full width for public routes
          }
        `}>
          <div className={`
            ${showSidebar
              ? `max-w-full mx-auto ${isMobile ? 'space-y-4' : 'space-y-6'}`
              : 'w-full'
            }
          `}>
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation - Coming Soon */}
      {/* {isMobile && showSidebar && <MobileBottomNav />} */}
    </div>
  );
}
