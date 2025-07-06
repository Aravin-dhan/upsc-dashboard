'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Tenant } from '@/lib/auth';
import { TenantStorageService, LEGACY_STORAGE_KEYS } from '@/services/TenantStorageService';

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
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
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
      } else {
        setUser(null);
        setTenant(null);
        setStorageService(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, tenantId }),
        credentials: 'include',
      });

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
        console.error('Login failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };
  
  const register = async (registerData: RegisterData): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUser(data.user);
        return true;
      } else {
        console.error('Registration failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
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
    await checkAuth();
  };

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
