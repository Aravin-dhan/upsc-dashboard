'use client';

import { ReactNode, useState, useEffect } from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header Space */}
        <div className="lg:hidden h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700" />

        {/* Main Content */}
        <main className={`
          flex-1 overflow-y-auto
          ${isMobile
            ? 'px-4 py-4 pb-20' // Mobile: smaller padding, space for bottom nav
            : 'p-6 lg:p-8'      // Desktop: larger padding
          }
        `}>
          <div className={`
            max-w-full mx-auto
            ${isMobile
              ? 'space-y-4'     // Mobile: tighter spacing
              : 'space-y-6'     // Desktop: more generous spacing
            }
          `}>
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation - Coming Soon */}
      {/* {isMobile && <MobileBottomNav />} */}
    </div>
  );
}
