/**
 * Role-Based Access Control (RBAC) System
 * Centralized permission management for scalable authentication
 */

export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface Role {
  name: string;
  level: number;
  permissions: Permission[];
  inherits?: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
  tenantRole?: string;
  permissions?: Permission[];
  isActive: boolean;
}

// Define system roles with hierarchical permissions
export const SYSTEM_ROLES: Record<string, Role> = {
  'super_admin': {
    name: 'Super Admin',
    level: 5,
    permissions: [
      { resource: '*', action: '*' }, // Full system access
      { resource: 'system', action: 'manage' },
      { resource: 'tenants', action: 'create' },
      { resource: 'tenants', action: 'delete' },
      { resource: 'users', action: 'manage_all' },
      { resource: 'analytics', action: 'view_global' }
    ]
  },
  'admin': {
    name: 'Admin',
    level: 4,
    permissions: [
      { resource: 'admin', action: 'access' },
      { resource: 'users', action: 'manage' },
      { resource: 'content', action: 'manage' },
      { resource: 'analytics', action: 'view' },
      { resource: 'coupons', action: 'manage' },
      { resource: 'subscriptions', action: 'view' }
    ]
  },
  'tenant_admin': {
    name: 'Tenant Admin',
    level: 3,
    permissions: [
      { resource: 'tenant', action: 'manage', conditions: { own_tenant: true } },
      { resource: 'users', action: 'manage', conditions: { same_tenant: true } },
      { resource: 'content', action: 'edit', conditions: { tenant_scoped: true } },
      { resource: 'analytics', action: 'view', conditions: { tenant_scoped: true } }
    ]
  },
  'teacher': {
    name: 'Teacher',
    level: 2,
    permissions: [
      { resource: 'dashboard', action: 'access' },
      { resource: 'students', action: 'view', conditions: { same_tenant: true } },
      { resource: 'content', action: 'create' },
      { resource: 'assessments', action: 'manage' },
      { resource: 'progress', action: 'view_students' }
    ]
  },
  'student': {
    name: 'Student',
    level: 1,
    permissions: [
      { resource: 'dashboard', action: 'access' },
      { resource: 'content', action: 'view' },
      { resource: 'assessments', action: 'take' },
      { resource: 'progress', action: 'view_own' },
      { resource: 'ai_assistant', action: 'use' }
    ]
  },
  'trial_user': {
    name: 'Trial User',
    level: 0,
    permissions: [
      { resource: 'dashboard', action: 'access' },
      { resource: 'content', action: 'view', conditions: { limited: true } },
      { resource: 'assessments', action: 'take', conditions: { limited: true } },
      { resource: 'ai_assistant', action: 'use', conditions: { limited: true } }
    ]
  }
};

// Resource definitions for permission checking
export const RESOURCES = {
  SYSTEM: 'system',
  ADMIN: 'admin',
  DASHBOARD: 'dashboard',
  USERS: 'users',
  TENANTS: 'tenants',
  CONTENT: 'content',
  ANALYTICS: 'analytics',
  COUPONS: 'coupons',
  SUBSCRIPTIONS: 'subscriptions',
  AI_ASSISTANT: 'ai_assistant',
  ASSESSMENTS: 'assessments',
  PROGRESS: 'progress'
} as const;

export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
  ACCESS: 'access',
  VIEW: 'view',
  USE: 'use'
} as const;

/**
 * Check if user has permission for a specific resource and action
 */
export function hasPermission(
  user: User,
  resource: string,
  action: string,
  context?: Record<string, any>
): boolean {
  if (!user || !user.isActive) return false;

  const role = SYSTEM_ROLES[user.role];
  if (!role) return false;

  // Check direct permissions
  for (const permission of role.permissions) {
    if (matchesPermission(permission, resource, action, user, context)) {
      return true;
    }
  }

  // Check inherited permissions
  if (role.inherits) {
    for (const inheritedRole of role.inherits) {
      const inheritedRoleObj = SYSTEM_ROLES[inheritedRole];
      if (inheritedRoleObj) {
        for (const permission of inheritedRoleObj.permissions) {
          if (matchesPermission(permission, resource, action, user, context)) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

/**
 * Check if permission matches the requested resource and action
 */
function matchesPermission(
  permission: Permission,
  resource: string,
  action: string,
  user: User,
  context?: Record<string, any>
): boolean {
  // Check wildcard permissions
  if (permission.resource === '*' && permission.action === '*') {
    return true;
  }

  // Check resource match
  const resourceMatch = permission.resource === '*' || permission.resource === resource;
  if (!resourceMatch) return false;

  // Check action match
  const actionMatch = permission.action === '*' || permission.action === action;
  if (!actionMatch) return false;

  // Check conditions
  if (permission.conditions) {
    return evaluateConditions(permission.conditions, user, context);
  }

  return true;
}

/**
 * Evaluate permission conditions
 */
function evaluateConditions(
  conditions: Record<string, any>,
  user: User,
  context?: Record<string, any>
): boolean {
  for (const [key, value] of Object.entries(conditions)) {
    switch (key) {
      case 'own_tenant':
        if (value && context?.tenantId && context.tenantId !== user.tenantId) {
          return false;
        }
        break;
      case 'same_tenant':
        if (value && context?.tenantId && context.tenantId !== user.tenantId) {
          return false;
        }
        break;
      case 'tenant_scoped':
        if (value && context?.tenantId && context.tenantId !== user.tenantId) {
          return false;
        }
        break;
      case 'limited':
        // Implement trial user limitations
        if (value && user.role === 'trial_user') {
          // Add specific limitations for trial users
          return context?.allowTrial === true;
        }
        break;
      default:
        // Custom condition evaluation
        if (context && context[key] !== value) {
          return false;
        }
    }
  }
  return true;
}

/**
 * Get user's effective permissions
 */
export function getUserPermissions(user: User): Permission[] {
  if (!user || !user.isActive) return [];

  const role = SYSTEM_ROLES[user.role];
  if (!role) return [];

  let permissions = [...role.permissions];

  // Add inherited permissions
  if (role.inherits) {
    for (const inheritedRole of role.inherits) {
      const inheritedRoleObj = SYSTEM_ROLES[inheritedRole];
      if (inheritedRoleObj) {
        permissions = [...permissions, ...inheritedRoleObj.permissions];
      }
    }
  }

  return permissions;
}

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(user: User, route: string): boolean {
  const routePermissions: Record<string, { resource: string; action: string }> = {
    '/admin': { resource: RESOURCES.ADMIN, action: ACTIONS.ACCESS },
    '/admin/users': { resource: RESOURCES.USERS, action: ACTIONS.MANAGE },
    '/admin/analytics': { resource: RESOURCES.ANALYTICS, action: ACTIONS.VIEW },
    '/admin/content': { resource: RESOURCES.CONTENT, action: ACTIONS.MANAGE },
    '/admin/coupons': { resource: RESOURCES.COUPONS, action: ACTIONS.MANAGE },
    '/dashboard': { resource: RESOURCES.DASHBOARD, action: ACTIONS.ACCESS }
  };

  const permission = routePermissions[route];
  if (!permission) return true; // Allow access to unprotected routes

  return hasPermission(user, permission.resource, permission.action);
}

/**
 * Get appropriate redirect route based on user role
 */
export function getDefaultRoute(user: User): string {
  if (!user || !user.isActive) return '/login';

  switch (user.role) {
    case 'super_admin':
    case 'admin':
      return '/admin';
    case 'tenant_admin':
      return '/admin';
    case 'teacher':
    case 'student':
    case 'trial_user':
      return '/dashboard';
    default:
      return '/dashboard';
  }
}

/**
 * Validate role hierarchy for role changes
 */
export function canChangeRole(currentUserRole: string, targetRole: string): boolean {
  const currentLevel = SYSTEM_ROLES[currentUserRole]?.level || 0;
  const targetLevel = SYSTEM_ROLES[targetRole]?.level || 0;

  // Users can only assign roles at their level or below
  return currentLevel >= targetLevel;
}
