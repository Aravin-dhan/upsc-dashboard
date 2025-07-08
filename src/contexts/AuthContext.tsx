'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Tenant } from '@/lib/auth';
import { TenantStorageService, LEGACY_STORAGE_KEYS } from '@/services/TenantStorageService';
import { hasPermission, getUserPermissions } from '@/lib/auth/rbac';
import { logAuthEvent, AUDIT_ACTIONS } from '@/lib/auth/audit';

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  availableTenants: Tenant[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, tenantId?: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  switchTenant: (tenantId: string) => Promise<boolean>;
  createTenant: (data: CreateTenantData) => Promise<boolean>;
  storageService: TenantStorageService | null;
  // New RBAC methods
  hasPermission: (resource: string, action: string, context?: Record<string, any>) => boolean;
  getUserPermissions: () => Array<{ resource: string; action: string; conditions?: Record<string, any> }>;
  canAccessRoute: (route: string) => boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'teacher' | 'student';
  tenantId?: string;
  tenantName?: string;
  organizationType?: 'individual' | 'school' | 'coaching' | 'government';
}

interface CreateTenantData {
  name: string;
  displayName: string;
  organizationType?: 'individual' | 'school' | 'coaching' | 'government';
  settings?: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageService, setStorageService] = useState<TenantStorageService | null>(null);

  const isAuthenticated = !!user;
  
  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    try {
      console.log('🔍 Checking authentication status...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Session restored successfully:', {
          user: data.user.email,
          role: data.user.role,
          expires: data.expires,
          isExpiringSoon: data.isExpiringSoon
        });

        setUser(data.user);
        setTenant(data.tenant);

        // Initialize tenant storage service
        if (data.user && data.tenant) {
          const storage = TenantStorageService.getInstance({
            tenantId: data.tenant.id,
            userId: data.user.id,
            useAPI: false
          });
          setStorageService(storage);

          // Migrate legacy data on first login
          storage.migrateLegacyData(LEGACY_STORAGE_KEYS);
        }

        // Load available tenants
        await loadAvailableTenants();

        // Log session expiry warning if applicable
        if (data.isExpiringSoon) {
          console.warn('⚠️ Session expires soon:', data.expires);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));

        // Enhanced error logging for session validation failures
        console.warn('❌ Session validation failed:', {
          error: errorData.error,
          code: errorData.code,
          details: errorData.details,
          status: response.status,
          requiresLogin: errorData.requiresLogin
        });

        setUser(null);
        setTenant(null);
        setStorageService(null);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('⏱️ Session check timeout:', error);
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('🌐 Network error during session check:', error);
      } else {
        console.error('💥 Unexpected auth check error:', error);
      }

      setUser(null);
      setTenant(null);
      setStorageService(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableTenants = async () => {
    try {
      const response = await fetch('/api/tenants', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableTenants(data.tenants || []);
      }
    } catch (error) {
      console.error('Failed to load tenants:', error);
    }
  };

  const login = async (email: string, password: string, tenantId?: string): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          tenantId
        }),
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setTenant(data.tenant);

        // Initialize tenant storage service
        if (data.user && data.tenant) {
          const storage = TenantStorageService.getInstance({
            tenantId: data.tenant.id,
            userId: data.user.id,
            useAPI: false
          });
          setStorageService(storage);

          // Migrate legacy data on first login
          storage.migrateLegacyData(LEGACY_STORAGE_KEYS);
        }

        // Load available tenants
        await loadAvailableTenants();
        return true;
      } else {
        // Enhanced error logging with structured error information
        console.error('Login failed:', {
          error: data.error,
          code: data.code,
          details: data.details,
          status: response.status
        });
        return false;
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('Login timeout:', error);
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Network error during login:', error);
      } else {
        console.error('Unexpected login error:', error);
      }
      return false;
    }
  };
  
  const register = async (registerData: RegisterData): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for registration

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...registerData,
          email: registerData.email.trim(),
          name: registerData.name.trim()
        }),
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setTenant(data.tenant);

        // Initialize tenant storage service if tenant data is available
        if (data.user && data.tenant) {
          const storage = TenantStorageService.getInstance({
            tenantId: data.tenant.id,
            userId: data.user.id,
            useAPI: false
          });
          setStorageService(storage);
        }

        // Load available tenants
        await loadAvailableTenants();
        return true;
      } else {
        // Enhanced error logging with structured error information
        console.error('Registration failed:', {
          error: data.error,
          code: data.code,
          details: data.details,
          status: response.status
        });
        return false;
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('Registration timeout:', error);
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Network error during registration:', error);
      } else {
        console.error('Unexpected registration error:', error);
      }
      return false;
    }
  };
  
  const logout = async (): Promise<void> => {
    try {
      // Clear tenant data before logout
      if (storageService) {
        storageService.clearTenantData();
      }

      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setTenant(null);
      setAvailableTenants([]);
      setStorageService(null);
      // Redirect to login page
      window.location.href = '/login';
    }
  };
  
  const refreshUser = async (): Promise<void> => {
    console.log('🔄 Refreshing user session...');
    await checkAuth();
  };

  // Auto-refresh session when it's about to expire
  useEffect(() => {
    if (!user) return;

    const refreshSession = async () => {
      try {
        console.log('🔄 Attempting session refresh...');
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Cache-Control': 'no-cache' }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.refreshed) {
            console.log('✅ Session refreshed successfully');
            setUser(data.user);
            setTenant(data.tenant);
          }
        } else {
          console.log('❌ Session refresh failed, user may need to re-login');
        }
      } catch (error) {
        console.error('Failed to refresh session:', error);
      }
    };

    const checkSessionExpiry = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
          headers: { 'Cache-Control': 'no-cache' }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.isExpiringSoon) {
            console.log('⚠️ Session expiring soon, refreshing...');
            await refreshSession();
          }
        }
      } catch (error) {
        console.error('Failed to check session expiry:', error);
      }
    };

    // Check session expiry every 30 minutes
    const interval = setInterval(checkSessionExpiry, 30 * 60 * 1000);

    // Also check immediately if session is expiring soon
    checkSessionExpiry();

    return () => clearInterval(interval);
  }, [user]);

  const switchTenant = async (tenantId: string): Promise<boolean> => {
    try {
      if (!user) return false;

      // Check if user has access to this tenant
      const hasAccess = user.tenants?.includes(tenantId) ||
                       user.tenantId === tenantId ||
                       availableTenants.some(t => t.id === tenantId);

      if (!hasAccess) {
        console.error('No access to tenant:', tenantId);
        return false;
      }

      // Find the tenant
      const newTenant = availableTenants.find(t => t.id === tenantId);
      if (!newTenant) {
        console.error('Tenant not found:', tenantId);
        return false;
      }

      // Clear current tenant data
      if (storageService) {
        storageService.clearTenantData();
      }

      // Update tenant context
      setTenant(newTenant);

      // Initialize new storage service
      const newStorage = TenantStorageService.getInstance({
        tenantId: newTenant.id,
        userId: user.id,
        useAPI: false
      });
      setStorageService(newStorage);

      // Update user's current tenant
      const updatedUser = { ...user, tenantId: newTenant.id };
      setUser(updatedUser);

      return true;
    } catch (error) {
      console.error('Tenant switch error:', error);
      return false;
    }
  };

  const createTenant = async (data: CreateTenantData): Promise<boolean> => {
    try {
      const response = await fetch('/api/tenants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (response.ok) {
        // Reload available tenants
        await loadAvailableTenants();
        return true;
      } else {
        const error = await response.json();
        console.error('Tenant creation failed:', error.error);
        return false;
      }
    } catch (error) {
      console.error('Tenant creation error:', error);
      return false;
    }
  };

  // RBAC helper functions
  const checkPermission = (resource: string, action: string, context?: Record<string, any>): boolean => {
    if (!user) return false;
    return hasPermission(user, resource, action, context);
  };

  const getUserPermissionsList = () => {
    if (!user) return [];
    return getUserPermissions(user);
  };

  const canAccessRoute = (route: string): boolean => {
    if (!user) return false;
    // Import canUserAccessRoute from routing module
    const { canUserAccessRoute } = require('@/lib/auth/routing');
    return canUserAccessRoute(user, route);
  };

  const value: AuthContextType = {
    user,
    tenant,
    availableTenants,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    switchTenant,
    createTenant,
    storageService,
    // RBAC methods
    hasPermission: checkPermission,
    getUserPermissions: getUserPermissionsList,
    canAccessRoute,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: string
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading, isAuthenticated } = useAuth();
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }
    
    if (requiredRole && user) {
      const roleHierarchy = {
        'admin': 3,
        'teacher': 2,
        'student': 1
      };
      
      const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
      const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
      
      if (userLevel < requiredLevel) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Access Denied
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                You don't have permission to access this page.
              </p>
            </div>
          </div>
        );
      }
    }
    
    return <Component {...props} />;
  };
}

// Hook for role-based access control
export function usePermissions() {
  const { user } = useAuth();
  
  const hasRole = (role: string): boolean => {
    if (!user) return false;
    
    const roleHierarchy = {
      'admin': 3,
      'teacher': 2,
      'student': 1
    };
    
    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[role as keyof typeof roleHierarchy] || 0;
    
    return userLevel >= requiredLevel;
  };
  
  const isAdmin = (): boolean => hasRole('admin');
  const isTeacher = (): boolean => hasRole('teacher');
  const isStudent = (): boolean => hasRole('student');
  
  return {
    hasRole,
    isAdmin,
    isTeacher,
    isStudent,
    userRole: user?.role,
    tenantId: user?.tenantId,
  };
}
