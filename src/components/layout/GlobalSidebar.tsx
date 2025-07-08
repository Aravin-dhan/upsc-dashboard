'use client';

import { useState } from 'react';
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

// Navigation items for different user roles
const getNavigationItems = (userRole: string) => {
  const baseItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Overview and progress',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'Learning',
      href: '/learning',
      icon: BookOpen,
      description: 'Study materials and courses',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'Practice',
      href: '/practice',
      icon: Target,
      description: 'Mock tests and practice',
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
      title: 'Calendar',
      href: '/calendar',
      icon: Calendar,
      description: 'Schedule and events',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'Analytics',
      href: '/analytics',
      icon: TrendingUp,
      description: 'Performance insights',
      roles: ['student', 'teacher', 'admin']
    },
    {
      title: 'AI Assistant',
      href: '/ai-assistant',
      icon: Brain,
      description: 'AI-powered help',
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
      title: 'Chat',
      href: '/chat',
      icon: MessageSquare,
      description: 'Community discussions',
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
      title: 'User Management',
      href: '/admin/users',
      icon: Users,
      description: 'Manage all users',
      roles: ['admin']
    },
    {
      title: 'System Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      description: 'System-wide analytics',
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
      title: 'Subscriptions',
      href: '/admin/subscriptions',
      icon: CreditCard,
      description: 'Subscription management',
      roles: ['admin']
    },
    {
      title: 'Coupons',
      href: '/admin/coupons',
      icon: Database,
      description: 'Coupon management',
      roles: ['admin']
    },
    {
      title: 'Email Campaigns',
      href: '/admin/email-subscriptions',
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

  let allItems = [...baseItems];
  
  if (userRole === 'teacher' || userRole === 'admin') {
    allItems = [...allItems, ...teacherItems];
  }
  
  if (userRole === 'admin') {
    allItems = [...allItems, ...adminItems];
  }

  return allItems.filter(item => item.roles.includes(userRole));
};

export default function GlobalSidebar({ className }: GlobalSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) {
    return null; // Don't show sidebar for unauthenticated users
  }

  const navigationItems = getNavigationItems(user.role);

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
          isCollapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", 
                user.role === 'admin' ? 'bg-red-600' : 
                user.role === 'teacher' ? 'bg-blue-600' : 'bg-green-600')}>
                <span className="text-white font-bold text-sm">
                  {user.role === 'admin' ? 'A' : user.role === 'teacher' ? 'T' : 'S'}
                </span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">UPSC Dashboard</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role} Panel</p>
              </div>
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

        {/* User info */}
        {!isCollapsed && user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center",
                user.role === 'admin' ? 'bg-red-100 dark:bg-red-900' :
                user.role === 'teacher' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900')}>
                <span className={cn("font-semibold text-sm", getAccentColor(user.role))}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
                <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", getRoleColor(user.role))}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            const accentColor = getAccentColor(user.role);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors group',
                  isActive
                    ? `${user.role === 'admin' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300' :
                        user.role === 'teacher' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' :
                        'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'}`
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                  isCollapsed && 'justify-center px-2'
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? accentColor : '')} />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {item.description}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors',
              isCollapsed && 'justify-center px-2'
            )}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
