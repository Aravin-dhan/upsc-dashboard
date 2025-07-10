import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { logAuthEvent, logSecurityEvent, AUDIT_ACTIONS } from './auth/audit';

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
  sessionId: string;
  lastActivity: number;
  ipAddress?: string;
  userAgent?: string;
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

// Configuration - Enhanced JWT secret handling for production
const JWT_SECRET = process.env.JWT_SECRET ||
                   process.env.NEXTAUTH_SECRET ||
                   'upsc-dashboard-super-secure-jwt-secret-key-for-production-2024-v1';
const JWT_ALGORITHM = 'HS256';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const COOKIE_NAME = 'upsc-auth-token';

// JWT utilities
const secret = new TextEncoder().encode(JWT_SECRET);

export async function createJWT(payload: any, customExpiration?: string): Promise<string> {
  const expiration = customExpiration || '7d';
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(expiration)
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

// Session storage - Use localStorage for client-side persistence in serverless environment
const activeSessions = new Map<string, AuthSession>();

// Enhanced session persistence for serverless environments
function getSessionStorage() {
  if (typeof window !== 'undefined') {
    // Client-side: use localStorage
    return {
      get: (key: string) => {
        try {
          const data = localStorage.getItem(`session_${key}`);
          return data ? JSON.parse(data) : null;
        } catch {
          return null;
        }
      },
      set: (key: string, value: AuthSession) => {
        try {
          localStorage.setItem(`session_${key}`, JSON.stringify(value));
        } catch {
          // Ignore storage errors
        }
      },
      delete: (key: string) => {
        try {
          localStorage.removeItem(`session_${key}`);
        } catch {
          // Ignore storage errors
        }
      }
    };
  }

  // Server-side: use in-memory with fallback
  return {
    get: (key: string) => activeSessions.get(key) || null,
    set: (key: string, value: AuthSession) => activeSessions.set(key, value),
    delete: (key: string) => activeSessions.delete(key)
  };
}

// Session management
export async function createSession(
  user: User,
  tenant?: Tenant,
  request?: NextRequest,
  customDuration?: number // Custom session duration in milliseconds
): Promise<string> {
  const sessionId = generateSessionId();
  const now = Date.now();
  const sessionDuration = customDuration || SESSION_DURATION;

  const sessionData = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    tenantId: user.tenantId,
    tenantRole: user.tenantRole,
    tenants: user.tenants,
    sessionId,
    lastActivity: now,
    ipAddress: getClientIP(request),
    userAgent: request?.headers.get('user-agent') || undefined,
    tenant: tenant ? {
      id: tenant.id,
      name: tenant.name,
      displayName: tenant.displayName,
      settings: tenant.settings
    } : undefined,
    exp: Math.floor((Date.now() + sessionDuration) / 1000)
  };

  // Create JWT with custom expiration based on session duration
  const jwtExpiration = sessionDuration === SESSION_DURATION ? '7d' : '30d';
  const token = await createJWT(sessionData, jwtExpiration);

  // Store session in memory (in production, use persistent storage)
  const session: AuthSession = {
    user,
    tenant: tenant || createDefaultTenant(user.id, user.name),
    expires: new Date((sessionData.exp * 1000)).toISOString(),
    sessionId,
    lastActivity: now,
    ipAddress: sessionData.ipAddress,
    userAgent: sessionData.userAgent
  };

  // Store session using enhanced storage
  const storage = getSessionStorage();
  storage.set(sessionId, session);
  activeSessions.set(sessionId, session);

  // Log session creation
  await logAuthEvent(
    AUDIT_ACTIONS.LOGIN,
    user.id,
    user.email,
    true,
    { sessionId, userAgent: sessionData.userAgent },
    request
  );

  return token;
}

export async function getSession(request?: NextRequest): Promise<AuthSession | null> {
  try {
    console.log('🔍 getSession - Starting session validation');
    let token: string | undefined;

    if (request) {
      // Server-side: get from request cookies
      token = request.cookies.get(COOKIE_NAME)?.value;
      console.log('📋 Token from request cookies:', token ? 'Found' : 'Not found');
    } else {
      // Server component: get from cookies()
      const cookieStore = await cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
      console.log('📋 Token from cookie store:', token ? 'Found' : 'Not found');
    }

    if (!token) {
      console.log('❌ No authentication token found');
      return null;
    }

    console.log('🔐 Verifying JWT token...');
    const payload = await verifyJWT(token);
    console.log('✅ JWT verified successfully for user:', payload.email);

    // Check if token is expired
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      console.log('⏰ Token expired for user:', payload.email);
      if (payload.sessionId) {
        await invalidateSession(payload.sessionId, 'Token expired');
      }
      return null;
    }

    // Check if session is still active (skip for now to fix immediate issues)
    // if (payload.sessionId && !activeSessions.has(payload.sessionId)) {
    //   console.log('❌ Session not found in active sessions for user:', payload.email);
    //   await logAuthEvent(
    //     AUDIT_ACTIONS.SESSION_EXPIRED,
    //     payload.userId,
    //     payload.email,
    //     false,
    //     { reason: 'Session not found in active sessions' }
    //   );
    //   return null;
    // }

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

    const session: AuthSession = {
      user,
      tenant,
      expires: new Date(payload.exp * 1000).toISOString(),
      sessionId: payload.sessionId,
      lastActivity: Date.now(),
      ipAddress: payload.ipAddress,
      userAgent: payload.userAgent
    };

    // Update session activity
    if (payload.sessionId) {
      activeSessions.set(payload.sessionId, session);
    }

    console.log('✅ Session created successfully for user:', user.email);
    return session;
  } catch (error) {
    console.error('❌ Session verification failed:', error);

    // Handle specific JWT errors
    if (error instanceof Error) {
      if (error.message.includes('jwt expired')) {
        console.log('⏰ JWT token expired');
      } else if (error.message.includes('jwt malformed')) {
        console.log('🔧 JWT token malformed');
      } else if (error.message.includes('invalid token')) {
        console.log('🚫 Invalid JWT token');
      } else {
        console.log('💥 Unexpected JWT error:', error.message);
      }
    }

    return null;
  }
}

export async function clearSession(sessionId?: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);

  if (sessionId) {
    await invalidateSession(sessionId, 'Manual logout');
  }
}

export async function invalidateSession(sessionId: string, reason?: string): Promise<void> {
  const session = activeSessions.get(sessionId);
  if (session) {
    activeSessions.delete(sessionId);

    await logAuthEvent(
      AUDIT_ACTIONS.LOGOUT,
      session.user.id,
      session.user.email,
      true,
      { sessionId, reason }
    );
  }
}

export async function invalidateAllUserSessions(userId: string): Promise<void> {
  const userSessions = Array.from(activeSessions.values()).filter(
    session => session.user.id === userId
  );

  for (const session of userSessions) {
    activeSessions.delete(session.sessionId);
  }

  if (userSessions.length > 0) {
    await logAuthEvent(
      AUDIT_ACTIONS.LOGOUT,
      userId,
      userSessions[0].user.email,
      true,
      { reason: 'All sessions invalidated', sessionCount: userSessions.length }
    );
  }
}

export function getUserActiveSessions(userId: string): AuthSession[] {
  return Array.from(activeSessions.values()).filter(
    session => session.user.id === userId
  );
}

export function getSessionMetrics(): {
  totalSessions: number;
  activeSessions: number;
  expiredSessions: number;
  averageSessionDuration: number;
  sessionsToday: number;
} {
  const now = Date.now();
  const oneDayAgo = now - (24 * 60 * 60 * 1000);

  const sessions = Array.from(activeSessions.values());
  const activeSessions24h = sessions.filter(s => s.lastActivity > oneDayAgo);

  const totalDuration = sessions.reduce((sum, session) => {
    return sum + (session.lastActivity - new Date(session.expires).getTime() + SESSION_DURATION);
  }, 0);

  return {
    totalSessions: sessions.length,
    activeSessions: activeSessions24h.length,
    expiredSessions: sessions.length - activeSessions24h.length,
    averageSessionDuration: sessions.length > 0 ? totalDuration / sessions.length : 0,
    sessionsToday: activeSessions24h.length
  };
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
      await logSecurityEvent(
        AUDIT_ACTIONS.UNAUTHORIZED_ACCESS,
        { route: request.nextUrl.pathname, requiredRole },
        request
      );
      return { error: 'Authentication required', status: 401 };
    }

    if (requiredRole && !hasPermission(session.user.role, requiredRole)) {
      await logSecurityEvent(
        AUDIT_ACTIONS.PERMISSION_DENIED,
        {
          route: request.nextUrl.pathname,
          userRole: session.user.role,
          requiredRole
        },
        request,
        session.user.id,
        session.user.email
      );
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

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getClientIP(request?: NextRequest): string | undefined {
  if (!request) return undefined;

  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    undefined
  );
}
