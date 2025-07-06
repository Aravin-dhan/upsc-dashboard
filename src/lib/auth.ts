import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// Multi-tenant types
export interface Tenant {
  id: string;
  name: string;
  displayName: string;
  domain?: string;
  settings: {
    allowSelfRegistration: boolean;
    defaultRole: 'teacher' | 'student';
    maxUsers?: number;
    features: string[];
    branding?: {
      logo?: string;
      primaryColor?: string;
      secondaryColor?: string;
    };
  };
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
  tenantId: string;
  tenantRole?: 'owner' | 'admin' | 'member'; // Role within the tenant
  tenants?: string[]; // Multiple tenant memberships
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  preferences?: {
    defaultTenant?: string;
    theme?: string;
    language?: string;
  };
}

export interface UserWithPassword extends User {
  passwordHash: string;
  salt: string;
}

export interface AuthSession {
  user: User;
  tenant: Tenant;
  expires: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  tenantId?: string; // Optional tenant selection during login
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role?: 'teacher' | 'student';
  tenantId?: string;
  tenantName?: string; // For creating new tenant during registration
  organizationType?: 'individual' | 'school' | 'coaching' | 'government';
}

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_ALGORITHM = 'HS256';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const COOKIE_NAME = 'upsc-auth-token';

// JWT utilities
const secret = new TextEncoder().encode(JWT_SECRET);

export async function createJWT(payload: any): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyJWT(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Password utilities
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(32).toString('hex');
  const hash = createHash('sha256')
    .update(password + salt)
    .digest('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const expectedHash = createHash('sha256')
    .update(password + salt)
    .digest('hex');
  
  // Use timing-safe comparison to prevent timing attacks
  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  const actualBuffer = Buffer.from(hash, 'hex');
  
  return expectedBuffer.length === actualBuffer.length && 
         timingSafeEqual(expectedBuffer, actualBuffer);
}

// Session management
export async function createSession(user: User, tenant?: Tenant): Promise<string> {
  const sessionData = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    tenantId: user.tenantId,
    tenantRole: user.tenantRole,
    tenants: user.tenants,
    tenant: tenant ? {
      id: tenant.id,
      name: tenant.name,
      displayName: tenant.displayName,
      settings: tenant.settings
    } : undefined,
    exp: Math.floor((Date.now() + SESSION_DURATION) / 1000)
  };

  return await createJWT(sessionData);
}

export async function getSession(request?: NextRequest): Promise<AuthSession | null> {
  try {
    let token: string | undefined;

    if (request) {
      // Server-side: get from request cookies
      token = request.cookies.get(COOKIE_NAME)?.value;
    } else {
      // Server component: get from cookies()
      const cookieStore = await cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    }

    if (!token) {
      return null;
    }

    const payload = await verifyJWT(token);

    // Check if token is expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    const user: User = {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      tenantId: payload.tenantId,
      tenantRole: payload.tenantRole,
      tenants: payload.tenants,
      createdAt: '', // Will be filled from database if needed
      isActive: true,
      preferences: payload.preferences
    };

    const tenant: Tenant = payload.tenant || {
      id: payload.tenantId,
      name: 'default',
      displayName: 'Default Organization',
      settings: {
        allowSelfRegistration: false,
        defaultRole: 'student',
        features: ['dashboard', 'learning', 'calendar', 'progress', 'ai-assistant']
      },
      ownerId: payload.userId,
      isActive: true,
      createdAt: '',
      updatedAt: ''
    };

    return {
      user,
      tenant,
      expires: new Date(payload.exp * 1000).toISOString()
    };
  } catch (error) {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Role-based access control
export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    'admin': 3,
    'teacher': 2,
    'student': 1
  };
  
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
  
  return userLevel >= requiredLevel;
}

export function requireAuth(requiredRole?: string) {
  return async function(request: NextRequest) {
    const session = await getSession(request);
    
    if (!session) {
      return { error: 'Authentication required', status: 401 };
    }
    
    if (requiredRole && !hasPermission(session.user.role, requiredRole)) {
      return { error: 'Insufficient permissions', status: 403 };
    }
    
    return { session };
  };
}

// Tenant management utilities
export function generateTenantId(): string {
  return 'tenant_' + randomBytes(16).toString('hex');
}

export function createDefaultTenant(ownerId: string, name: string, organizationType: string = 'individual'): Tenant {
  return {
    id: generateTenantId(),
    name: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    displayName: name,
    settings: {
      allowSelfRegistration: organizationType === 'individual' ? false : true,
      defaultRole: 'student',
      maxUsers: organizationType === 'individual' ? 1 : undefined,
      features: ['dashboard', 'learning', 'calendar', 'progress', 'ai-assistant'],
      branding: {
        primaryColor: '#3b82f6',
        secondaryColor: '#1e40af'
      }
    },
    ownerId,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// Tenant isolation utilities
export function filterByTenant<T extends { tenantId: string }>(
  data: T[],
  userTenantId: string
): T[] {
  return data.filter(item => item.tenantId === userTenantId);
}



export function hasMultiTenantAccess(user: User, targetTenantId: string): boolean {
  // Check if user has access to the target tenant
  if (user.tenantId === targetTenantId) return true;
  if (user.tenants && user.tenants.includes(targetTenantId)) return true;
  if (user.role === 'admin') return true; // Global admin access
  return false;
}

export function getTenantScopedKey(key: string, tenantId: string): string {
  return `${tenantId}:${key}`;
}

export function parseTenantScopedKey(scopedKey: string): { tenantId: string; key: string } | null {
  const parts = scopedKey.split(':');
  if (parts.length < 2) return null;
  return {
    tenantId: parts[0],
    key: parts.slice(1).join(':')
  };
}

export function validateTenantAccess(requestedTenantId: string, userTenantId: string): boolean {
  // Users can always access their own tenant
  if (requestedTenantId === userTenantId) return true;

  // Default tenant is accessible to all authenticated users
  if (requestedTenantId === 'default') return true;

  // Additional validation logic can be added here
  // For now, deny access to other tenants unless explicitly allowed
  return false;
}

// Generate secure IDs
export function generateId(): string {
  return randomBytes(16).toString('hex');
}
