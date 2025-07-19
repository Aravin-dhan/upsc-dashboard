'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  Target,
  BarChart3,
  MessageCircle,
  Calendar,
  Newspaper,
  Map
} from 'lucide-react';

const bottomNavItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Practice', href: '/practice', icon: Target },
  { name: 'Study', href: '/learning', icon: BookOpen },
  { name: 'News', href: '/current-affairs', icon: Newspaper },
  { name: 'AI', href: '/ai-assistant', icon: MessageCircle },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Background with blur effect */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-5 h-16 safe-area-inset-bottom">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center space-y-1 transition-all duration-200
                  min-h-[44px] min-w-[44px] touch-target relative
                  ${isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }
                `}
                role="button"
                aria-label={`Navigate to ${item.name}`}
              >
                <div className={`
                  p-2 rounded-lg transition-all duration-200 relative
                  ${isActive
                    ? 'bg-blue-100 dark:bg-blue-900/30 scale-110' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`
                  text-xs font-medium transition-all duration-200
                  ${isActive ? 'scale-105' : ''}
                `}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
        
        {/* Safe area for devices with home indicator */}
        <div className="h-safe-area-inset-bottom" />
      </div>
    </div>
  );
}
