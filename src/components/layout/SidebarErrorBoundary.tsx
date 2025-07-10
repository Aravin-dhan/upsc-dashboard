'use client';

import React, { Component, ReactNode } from 'react';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  Settings, 
  AlertTriangle, 
  RefreshCw,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

// Emergency navigation items - comprehensive but functional
const emergencyNavItems = [
  { name: 'Dashboard', href: '/', icon: Home, priority: 1 },
  { name: 'Learning', href: '/learning', icon: BookOpen, priority: 2 },
  { name: 'Schedule', href: '/schedule', icon: Calendar, priority: 3 },
  { name: 'Analytics', href: '/analytics', icon: ChevronRight, priority: 4 },
  { name: 'Current Affairs', href: '/current-affairs', icon: ChevronRight, priority: 5 },
  { name: 'Settings', href: '/settings', icon: Settings, priority: 6 },
];

// Emergency actions for recovery
const emergencyActions = [
  {
    name: 'Reload Page',
    action: () => window.location.reload(),
    icon: RefreshCw,
    description: 'Refresh the entire page'
  },
  {
    name: 'Clear Cache',
    action: () => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    },
    icon: X,
    description: 'Clear all cached data and reload'
  },
  {
    name: 'Safe Mode',
    action: () => {
      localStorage.setItem('upsc-safe-mode', 'true');
      window.location.href = '/?safe=true';
    },
    icon: AlertTriangle,
    description: 'Load in safe mode with minimal features'
  }
];

// Emergency Navigation Component
function EmergencyNavigation() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Emergency Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-red-50 dark:bg-red-900/20 backdrop-blur-lg border-b border-red-200 dark:border-red-800">
        <div className="flex items-center justify-between h-full px-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            {isOpen ? (
              <X className="h-5 w-5 text-red-600 dark:text-red-300" />
            ) : (
              <Menu className="h-5 w-5 text-red-600 dark:text-red-300" />
            )}
          </button>

          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-red-800 dark:text-red-200">
              Emergency Navigation
            </span>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="p-2 rounded-lg bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
            title="Reload page"
          >
            <RefreshCw className="h-4 w-4 text-red-600 dark:text-red-300" />
          </button>
        </div>
      </div>

      {/* Emergency Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-red-50 dark:bg-red-900/20 border-r border-red-200 dark:border-red-800
        transform transition-all duration-300 ease-in-out shadow-xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Emergency Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-red-200 dark:border-red-800">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-lg font-semibold text-red-800 dark:text-red-200">
                  Emergency Mode
                </span>
                <p className="text-xs text-red-600 dark:text-red-400">
                  Sidebar failed to load
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-800/30 rounded-lg">
              <p className="text-xs text-red-700 dark:text-red-300 mb-3">
                The main navigation encountered an error. Use these emergency options:
              </p>

              {/* Emergency Actions */}
              <div className="space-y-2">
                {emergencyActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.name}
                      onClick={action.action}
                      className="w-full flex items-center px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                      title={action.description}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {action.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {emergencyNavItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
                    ${isActive
                      ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                      : 'text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/50'
                    }
                  `}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                  <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                </Link>
              );
            })}
          </nav>

          {/* Emergency Footer */}
          <div className="border-t border-red-200 dark:border-red-800 px-4 py-4">
            <div className="text-xs text-red-600 dark:text-red-400 text-center">
              <p>Navigation system is in emergency mode.</p>
              <p>Please refresh the page to restore full functionality.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export class SidebarErrorBoundary extends Component<Props, State> {
  private retryTimeout?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Sidebar Error Boundary caught an error:', error);
    console.error('Error info:', errorInfo);
    
    // Show user-friendly error message
    toast.error('Navigation sidebar encountered an error. Emergency navigation is now active.', {
      duration: 5000,
      icon: '⚠️'
    });

    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Add your error logging service here
      console.error('Sidebar error logged for monitoring:', {
        error: error.message,
        stack: error.stack,
        errorInfo,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < 3) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        retryCount: prevState.retryCount + 1
      }));

      toast.success('Attempting to restore navigation...', {
        icon: '🔄'
      });

      // Auto-retry after a delay if it fails again
      this.retryTimeout = setTimeout(() => {
        if (this.state.hasError && this.state.retryCount < 3) {
          this.handleRetry();
        }
      }, 2000);
    } else {
      toast.error('Maximum retry attempts reached. Please refresh the page.', {
        duration: 8000,
        icon: '❌'
      });
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use emergency navigation
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <EmergencyNavigation />;
    }

    return this.props.children;
  }
}

// Higher-order component for easy wrapping
export function withSidebarErrorBoundary<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WrappedComponent(props: P) {
    return (
      <SidebarErrorBoundary>
        <Component {...props} />
      </SidebarErrorBoundary>
    );
  };
}

export default SidebarErrorBoundary;
