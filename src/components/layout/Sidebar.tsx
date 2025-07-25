'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../ui/ThemeToggle';
import {
  Home,
  BookOpen,
  Calendar,
  BarChart3,
  RefreshCw,
  Newspaper,
  FileText,
  Heart,
  Settings,
  User,
  MessageCircle,
  Menu,
  X,
  ExternalLink,
  Target,
  Bookmark,
  Map,
  GraduationCap,
  Languages,
  Shield,
  Users,
  Mail,
  Ticket,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';


const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Learning Center', href: '/learning', icon: GraduationCap },
  { name: 'Syllabus', href: '/syllabus', icon: BookOpen },
  { name: 'Dictionary', href: '/dictionary', icon: Languages },
  // { name: 'Interactive Maps', href: '/maps', icon: Map }, // Removed for SSR compatibility
  { name: 'Schedule & Calendar', href: '/schedule', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Revision', href: '/revision', icon: RefreshCw },
  { name: 'Current Affairs', href: '/current-affairs', icon: Newspaper },
  { name: 'Knowledge Base', href: '/knowledge-base', icon: FileText },
  { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
  { name: 'Answer Analysis', href: '/answer-analysis', icon: MessageCircle },
  { name: 'Practice Arena', href: '/practice', icon: Target },
  { name: 'Wellness', href: '/wellness', icon: Heart },
  { name: 'Quick Links', href: '/quick-links', icon: ExternalLink },
  { name: 'AI Assistant', href: '/ai-assistant', icon: MessageCircle },
];

// Admin-specific navigation items
const adminNavigation = [
  { name: 'Admin Dashboard', href: '/admin', icon: Shield },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Content Management', href: '/admin/content', icon: FileText },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Coupon Management', href: '/admin/coupons', icon: Ticket },
  { name: 'Email Subscriptions', href: '/admin/subscriptions', icon: Mail },
  { name: 'Security Center', href: '/admin/security', icon: Shield },
  { name: 'System Settings', href: '/admin/settings', icon: Settings },
];

const bottomNavigation = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarError, setSidebarError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Enhanced error handling and recovery
  useEffect(() => {
    const handleSidebarError = (error: Error) => {
      console.error('Sidebar error:', error);
      setSidebarError(error.message);

      // Auto-retry up to 3 times
      if (retryCount < 3) {
        setTimeout(() => {
          setSidebarError(null);
          setRetryCount(prev => prev + 1);
        }, 2000);
      }
    };

    // Add global error listener for sidebar
    const errorHandler = (event: ErrorEvent) => {
      if (event.filename?.includes('Sidebar') || event.message?.includes('sidebar')) {
        handleSidebarError(new Error(event.message));
      }
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, [retryCount]);

  // Persist mobile menu state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('upsc-mobile-menu-state');
      if (savedState === 'true') {
        setIsMobileMenuOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-mobile-menu-state', isMobileMenuOpen.toString());
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Emergency navigation fallback
  if (sidebarError && retryCount >= 3) {
    return (
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-red-50 dark:bg-red-900/20 border-r border-red-200 dark:border-red-800">
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-sm font-medium text-red-800 dark:text-red-200">
              Navigation Error
            </span>
          </div>
          <div className="space-y-2">
            <Link href="/" className="block p-2 text-sm text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/30 rounded">
              Dashboard
            </Link>
            <Link href="/learning" className="block p-2 text-sm text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/30 rounded">
              Learning
            </Link>
            <Link href="/schedule" className="block p-2 text-sm text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/30 rounded">
              Schedule
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="w-full p-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between h-full px-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            UPSC Dashboard
          </h1>

          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 sm:w-72 lg:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
        transform transition-all duration-300 ease-in-out shadow-xl lg:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
                UPSC Dashboard
              </span>
            </div>
            <ThemeToggle />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {/* Main Navigation */}
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95
                    ${isActive
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <item.icon className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'}
                  `} />
                  {item.name}
                </Link>
              );
            })}

            {/* Admin Navigation Section - Only visible to admin users */}
            {user?.role === 'admin' && (
              <>
                <div className="pt-4 pb-2">
                  <div className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Administration
                  </div>
                </div>
                {adminNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95
                        ${isActive
                          ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300'
                        }
                      `}
                    >
                      <item.icon className={`
                        mr-3 h-5 w-5 flex-shrink-0
                        ${isActive ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'}
                      `} />
                      {item.name}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* Bottom navigation */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 space-y-1">
            {bottomNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95
                    ${isActive
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <item.icon className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'}
                  `} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* User info */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || 'UPSC Aspirant'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role ? `Role: ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}` : 'Target: 2027'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
