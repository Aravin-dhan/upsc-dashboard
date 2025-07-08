'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Settings,
  Shield,
  BarChart3,
  FileText,
  Mail,
  CreditCard,
  Database,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Calendar,
  Target,
  TrendingUp,
  MessageSquare,
  Bookmark,
  Brain,
  Map,
  Clock,
  Award,
  HelpCircle
} from 'lucide-react';

interface GlobalSidebarProps {
  className?: string;
}

// Navigation items based on original Sidebar.tsx structure
const getNavigationItems = (userRole: string) => {
  const baseItems = [
    {
      title: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      description: 'Overview and progress',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'Learning Center',
      href: '/learning',
      icon: BookOpen,
      description: 'Study materials and courses',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'Syllabus',
      href: '/syllabus',
      icon: FileText,
      description: 'Complete UPSC syllabus',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'Dictionary',
      href: '/dictionary',
      icon: HelpCircle,
      description: 'Terms and definitions',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'Schedule & Calendar',
      href: '/schedule',
      icon: Calendar,
      description: 'Study schedule and events',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      description: 'Performance insights',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'Revision',
      href: '/revision',
      icon: Clock,
      description: 'Revision materials',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'Current Affairs',
      href: '/current-affairs',
      icon: FileText,
      description: 'Latest news and updates',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'Knowledge Base',
      href: '/knowledge-base',
      icon: Database,
      description: 'Study resources',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'Bookmarks',
      href: '/bookmarks',
      icon: Bookmark,
      description: 'Saved content',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'Answer Analysis',
      href: '/answer-analysis',
      icon: MessageSquare,
      description: 'Answer evaluation',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'Practice Arena',
      href: '/practice',
      icon: Target,
      description: 'Mock tests and practice',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'Wellness',
      href: '/wellness',
      icon: Award,
      description: 'Mental health and wellness',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'Quick Links',
      href: '/quick-links',
      icon: Map,
      description: 'External resources',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'AI Assistant',
      href: '/ai-assistant',
      icon: Brain,
      description: 'AI-powered help',
      roles: ['student', 'teacher', 'admin']
    }
  ];

  const teacherItems = [
    {
      title: 'Student Management',
      href: '/teacher/students',
      icon: Users,
      description: 'Manage your students',
      roles: ['teacher', 'admin']
    },
    {
      title: 'Content Creation',
      href: '/teacher/content',
      icon: FileText,
      description: 'Create study materials',
      roles: ['teacher', 'admin']
    }
  ];

  const adminItems = [
    {
      title: 'Admin Dashboard',
      href: '/admin',
      icon: Shield,
      description: 'Admin overview',
      roles: ['admin']
    },
    {
      title: 'User Management',
      href: '/admin/users',
      icon: Users,
      description: 'Manage all users',
      roles: ['admin']
    },
    {
      title: 'Content Management',
      href: '/admin/content',
      icon: FileText,
      description: 'Manage platform content',
      roles: ['admin']
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      description: 'System-wide analytics',
      roles: ['admin']
    },
    {
      title: 'Coupon Management',
      href: '/admin/coupons',
      icon: CreditCard,
      description: 'Coupon management',
      roles: ['admin']
    },
    {
      title: 'Email Subscriptions',
      href: '/admin/subscriptions',
      icon: Mail,
      description: 'Email marketing',
      roles: ['admin']
    },
    {
      title: 'Security Center',
      href: '/admin/security',
      icon: Shield,
      description: 'Security monitoring',
      roles: ['admin']
    },
    {
      title: 'System Settings',
      href: '/admin/settings',
      icon: Settings,
      description: 'Platform configuration',
      roles: ['admin']
    }
  ];

  const bottomItems = [
    {
      title: 'Profile',
      href: '/profile',
      icon: Users,
      description: 'User profile',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'User settings',
      roles: ['student', 'teacher', 'admin']
    }
  ];

  let mainItems = [...baseItems];
  let adminSection = [];
  let bottomSection = [...bottomItems];

  if (userRole === 'teacher' || userRole === 'admin') {
    mainItems = [...mainItems, ...teacherItems];
  }

  if (userRole === 'admin') {
    adminSection = [...adminItems];
  }

  return {
    main: mainItems.filter(item => item.roles.includes(userRole)),
    admin: adminSection.filter(item => item.roles.includes(userRole)),
    bottom: bottomSection.filter(item => item.roles.includes(userRole))
  };
};

export default function GlobalSidebar({ className }: GlobalSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  // Fix visibility issue - ensure component mounts properly
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted and user is loaded
  if (!mounted || isLoading || !user) {
    return null;
  }

  const navigationSections = getNavigationItems(user.role);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'teacher': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'student': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getAccentColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 dark:text-red-400';
      case 'teacher': return 'text-blue-600 dark:text-blue-400';
      case 'student': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {isMobileOpen ? (
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40',
          isCollapsed ? 'w-16' : 'w-80 sm:w-72 lg:w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'shadow-xl lg:shadow-none',
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            {!isCollapsed && (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">U</span>
                </div>
                <span className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
                  UPSC Dashboard
                </span>
              </div>
            )}

            {/* Collapse button - desktop only */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>

          {/* Navigation - Scrollable */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {/* Main Navigation */}
            {navigationSections.main.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95',
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
                    isCollapsed && 'justify-center px-2'
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className={cn(
                    'h-5 w-5 flex-shrink-0',
                    isCollapsed ? 'mr-0' : 'mr-3',
                    isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                  )} />
                  {!isCollapsed && item.title}
                </Link>
              );
            })}

            {/* Admin Navigation Section - Only visible to admin users */}
            {user.role === 'admin' && navigationSections.admin.length > 0 && (
              <>
                <div className="pt-4 pb-2">
                  {!isCollapsed && (
                    <div className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Administration
                    </div>
                  )}
                </div>
                {navigationSections.admin.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95',
                        isActive
                          ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300',
                        isCollapsed && 'justify-center px-2'
                      )}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <Icon className={cn(
                        'h-5 w-5 flex-shrink-0',
                        isCollapsed ? 'mr-0' : 'mr-3',
                        isActive ? 'text-red-500' : 'text-gray-400 group-hover:text-red-500'
                      )} />
                      {!isCollapsed && item.title}
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* Bottom navigation - Fixed */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 space-y-1 flex-shrink-0">
            {navigationSections.bottom.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95',
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
                    isCollapsed && 'justify-center px-2'
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className={cn(
                    'h-5 w-5 flex-shrink-0',
                    isCollapsed ? 'mr-0' : 'mr-3',
                    isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                  )} />
                  {!isCollapsed && item.title}
                </Link>
              );
            })}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className={cn(
                'group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? 'Logout' : undefined}
            >
              <LogOut className={cn(
                'h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
                isCollapsed ? 'mr-0' : 'mr-3'
              )} />
              {!isCollapsed && 'Logout'}
            </button>
          </div>

          {/* User info - Fixed */}
          {!isCollapsed && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 flex-shrink-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name || 'UPSC Aspirant'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.role ? `Role: ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}` : 'Target: 2027'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
