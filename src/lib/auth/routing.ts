/**
 * Centralized Authentication Routing Service
 * Handles role-based redirects and route protection
 */

import { User, canAccessRoute, getDefaultRoute } from './rbac';

export interface RouteConfig {
  path: string;
  requiresAuth: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
  isPublic?: boolean;
}

// Define route configurations
export const ROUTE_CONFIG: Record<string, RouteConfig> = {
  // Public routes
  '/': { path: '/', requiresAuth: false, isPublic: true },
  '/login': { path: '/login', requiresAuth: false, isPublic: true },
  '/signup': { path: '/signup', requiresAuth: false, isPublic: true },
  '/pricing': { path: '/pricing', requiresAuth: false, isPublic: true },
  '/features': { path: '/features', requiresAuth: false, isPublic: true },
  '/about': { path: '/about', requiresAuth: false, isPublic: true },
  '/contact': { path: '/contact', requiresAuth: false, isPublic: true },
  '/privacy': { path: '/privacy', requiresAuth: false, isPublic: true },
  '/terms': { path: '/terms', requiresAuth: false, isPublic: true },
  
  // Protected routes - Dashboard
  '/dashboard': { 
    path: '/dashboard', 
    requiresAuth: true, 
    allowedRoles: ['student', 'teacher', 'tenant_admin', 'admin', 'super_admin'] 
  },
  '/profile': { 
    path: '/profile', 
    requiresAuth: true, 
    allowedRoles: ['student', 'teacher', 'tenant_admin', 'admin', 'super_admin'] 
  },
  '/settings': { 
    path: '/settings', 
    requiresAuth: true, 
    allowedRoles: ['student', 'teacher', 'tenant_admin', 'admin', 'super_admin'] 
  },
  
  // Student/Teacher routes
  '/practice': { 
    path: '/practice', 
    requiresAuth: true, 
    allowedRoles: ['student', 'teacher', 'tenant_admin', 'admin', 'super_admin'] 
  },
  '/analytics': { 
    path: '/analytics', 
    requiresAuth: true, 
    allowedRoles: ['student', 'teacher', 'tenant_admin', 'admin', 'super_admin'] 
  },
  '/ai-assistant': { 
    path: '/ai-assistant', 
    requiresAuth: true, 
    allowedRoles: ['student', 'teacher', 'tenant_admin', 'admin', 'super_admin'] 
  },
  '/learning': { 
    path: '/learning', 
    requiresAuth: true, 
    allowedRoles: ['student', 'teacher', 'tenant_admin', 'admin', 'super_admin'] 
  },
  '/maps': { 
    path: '/maps', 
    requiresAuth: true, 
    allowedRoles: ['student', 'teacher', 'tenant_admin', 'admin', 'super_admin'] 
  },
  '/current-affairs': { 
    path: '/current-affairs', 
    requiresAuth: true, 
    allowedRoles: ['student', 'teacher', 'tenant_admin', 'admin', 'super_admin'] 
  },
  
  // Admin routes
  '/admin': { 
    path: '/admin', 
    requiresAuth: true, 
    allowedRoles: ['admin', 'super_admin', 'tenant_admin'] 
  },
  '/admin/users': { 
    path: '/admin/users', 
    requiresAuth: true, 
    allowedRoles: ['admin', 'super_admin', 'tenant_admin'] 
  },
  '/admin/analytics': { 
    path: '/admin/analytics', 
    requiresAuth: true, 
    allowedRoles: ['admin', 'super_admin', 'tenant_admin'] 
  },
  '/admin/content': { 
    path: '/admin/content', 
    requiresAuth: true, 
    allowedRoles: ['admin', 'super_admin', 'tenant_admin'] 
  },
  '/admin/coupons': { 
    path: '/admin/coupons', 
    requiresAuth: true, 
    allowedRoles: ['admin', 'super_admin'] 
  }
};

/**
 * Get role-based redirect destination after login
 */
export function getRoleBasedRedirect(user: User, intendedDestination?: string): string {
  if (!user || !user.isActive) {
    return '/login';
  }

  // If there's an intended destination and user can access it, go there
  if (intendedDestination && canUserAccessRoute(user, intendedDestination)) {
    return intendedDestination;
  }

  // Otherwise, redirect to default route for user's role
  return getDefaultRoute(user);
}

/**
 * Check if user can access a specific route
 */
export function canUserAccessRoute(user: User, route: string): boolean {
  if (!user) return false;

  const config = ROUTE_CONFIG[route];
  
  // If route is not configured, allow access (assume public)
  if (!config) return true;
  
  // If route is public, allow access
  if (config.isPublic) return true;
  
  // If route doesn't require auth, allow access
  if (!config.requiresAuth) return true;
  
  // If user is not active, deny access
  if (!user.isActive) return false;
  
  // If no specific roles are required, allow any authenticated user
  if (!config.allowedRoles || config.allowedRoles.length === 0) return true;
  
  // Check if user's role is in allowed roles
  return config.allowedRoles.includes(user.role);
}

/**
 * Get redirect destination for unauthorized access
 */
export function getUnauthorizedRedirect(user: User | null, attemptedRoute: string): string {
  // If user is not authenticated, redirect to login with return URL
  if (!user) {
    const returnUrl = encodeURIComponent(attemptedRoute);
    return `/login?redirect=${returnUrl}`;
  }

  // If user is authenticated but doesn't have permission, redirect to their default route
  return getDefaultRoute(user);
}

/**
 * Validate route transition
 */
export function validateRouteTransition(
  user: User | null,
  fromRoute: string,
  toRoute: string
): { allowed: boolean; redirectTo?: string; reason?: string } {
  // Allow navigation from any route to public routes
  const toConfig = ROUTE_CONFIG[toRoute];
  if (toConfig?.isPublic || !toConfig?.requiresAuth) {
    return { allowed: true };
  }

  // Check authentication
  if (!user) {
    return {
      allowed: false,
      redirectTo: `/login?redirect=${encodeURIComponent(toRoute)}`,
      reason: 'Authentication required'
    };
  }

  // Check if user is active
  if (!user.isActive) {
    return {
      allowed: false,
      redirectTo: '/login',
      reason: 'Account inactive'
    };
  }

  // Check route permissions
  if (!canUserAccessRoute(user, toRoute)) {
    return {
      allowed: false,
      redirectTo: getDefaultRoute(user),
      reason: 'Insufficient permissions'
    };
  }

  return { allowed: true };
}

/**
 * Get navigation menu items based on user role
 */
export function getNavigationItems(user: User | null): Array<{
  label: string;
  path: string;
  icon?: string;
  children?: Array<{ label: string; path: string; icon?: string }>;
}> {
  if (!user) {
    return [
      { label: 'Home', path: '/' },
      { label: 'Features', path: '/features' },
      { label: 'Pricing', path: '/pricing' },
      { label: 'About', path: '/about' },
      { label: 'Contact', path: '/contact' }
    ];
  }

  const baseItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'Home' },
    { label: 'Practice', path: '/practice', icon: 'BookOpen' },
    { label: 'Learning', path: '/learning', icon: 'GraduationCap' },
    { label: 'Analytics', path: '/analytics', icon: 'BarChart3' },
    { label: 'AI Assistant', path: '/ai-assistant', icon: 'Bot' },
    { label: 'Maps', path: '/maps', icon: 'Map' },
    { label: 'Current Affairs', path: '/current-affairs', icon: 'Newspaper' }
  ];

  const adminItems = [
    {
      label: 'Admin',
      path: '/admin',
      icon: 'Shield',
      children: [
        { label: 'Dashboard', path: '/admin', icon: 'LayoutDashboard' },
        { label: 'Users', path: '/admin/users', icon: 'Users' },
        { label: 'Analytics', path: '/admin/analytics', icon: 'TrendingUp' },
        { label: 'Content', path: '/admin/content', icon: 'FileText' },
        { label: 'Coupons', path: '/admin/coupons', icon: 'Ticket' }
      ]
    }
  ];

  // Filter items based on user permissions
  const allowedItems = baseItems.filter(item => canUserAccessRoute(user, item.path));

  // Add admin items for admin users
  if (user.role === 'admin' || user.role === 'super_admin' || user.role === 'tenant_admin') {
    const allowedAdminChildren = adminItems[0].children?.filter(child => 
      canUserAccessRoute(user, child.path)
    ) || [];
    
    if (allowedAdminChildren.length > 0) {
      allowedItems.push({
        ...adminItems[0],
        children: allowedAdminChildren
      });
    }
  }

  return allowedItems;
}

/**
 * Get breadcrumb navigation for current route
 */
export function getBreadcrumbs(currentRoute: string): Array<{ label: string; path?: string }> {
  const segments = currentRoute.split('/').filter(Boolean);
  const breadcrumbs: Array<{ label: string; path?: string }> = [
    { label: 'Home', path: '/' }
  ];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    
    // Convert segment to readable label
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    breadcrumbs.push({
      label,
      path: currentPath === currentRoute ? undefined : currentPath
    });
  }

  return breadcrumbs;
}

/**
 * Check if route requires specific tenant context
 */
export function requiresTenantContext(route: string): boolean {
  const tenantRoutes = ['/admin', '/dashboard'];
  return tenantRoutes.some(tenantRoute => route.startsWith(tenantRoute));
}
