/**
 * Audit Logging System
 * Tracks user actions and system events for security and compliance
 */

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  tenantId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  success: boolean;
  errorMessage?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface AuditFilter {
  userId?: string;
  tenantId?: string;
  action?: string;
  resource?: string;
  startDate?: string;
  endDate?: string;
  severity?: string;
  success?: boolean;
  limit?: number;
  offset?: number;
}

// Audit action types
export const AUDIT_ACTIONS = {
  // Authentication
  LOGIN: 'login',
  LOGOUT: 'logout',
  LOGIN_FAILED: 'login_failed',
  PASSWORD_CHANGE: 'password_change',
  PASSWORD_RESET: 'password_reset',
  SESSION_EXPIRED: 'session_expired',
  
  // User Management
  USER_CREATE: 'user_create',
  USER_UPDATE: 'user_update',
  USER_DELETE: 'user_delete',
  USER_ACTIVATE: 'user_activate',
  USER_DEACTIVATE: 'user_deactivate',
  ROLE_CHANGE: 'role_change',
  
  // Content Management
  CONTENT_CREATE: 'content_create',
  CONTENT_UPDATE: 'content_update',
  CONTENT_DELETE: 'content_delete',
  CONTENT_PUBLISH: 'content_publish',
  
  // System Administration
  SYSTEM_CONFIG_CHANGE: 'system_config_change',
  BACKUP_CREATE: 'backup_create',
  BACKUP_RESTORE: 'backup_restore',
  
  // Data Access
  DATA_EXPORT: 'data_export',
  DATA_IMPORT: 'data_import',
  SENSITIVE_DATA_ACCESS: 'sensitive_data_access',
  
  // Security Events
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
  PERMISSION_DENIED: 'permission_denied',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  
  // Tenant Management
  TENANT_CREATE: 'tenant_create',
  TENANT_UPDATE: 'tenant_update',
  TENANT_DELETE: 'tenant_delete'
} as const;

// Audit resources
export const AUDIT_RESOURCES = {
  USER: 'user',
  TENANT: 'tenant',
  CONTENT: 'content',
  SYSTEM: 'system',
  SESSION: 'session',
  ADMIN_PANEL: 'admin_panel',
  API: 'api',
  DATABASE: 'database'
} as const;

/**
 * Create audit event
 */
export function createAuditEvent(
  action: string,
  resource: string,
  options: Partial<AuditEvent> = {}
): AuditEvent {
  return {
    id: generateAuditId(),
    timestamp: new Date().toISOString(),
    action,
    resource,
    success: true,
    severity: 'low',
    ...options
  };
}

/**
 * Log audit event
 */
export async function logAuditEvent(event: AuditEvent): Promise<void> {
  try {
    // In a real implementation, this would write to a database or external service
    // For now, we'll use file-based logging
    await writeAuditLog(event);
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Audit Event:', {
        action: event.action,
        resource: event.resource,
        user: event.userEmail,
        success: event.success,
        severity: event.severity
      });
    }
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}

/**
 * Log authentication event
 */
export async function logAuthEvent(
  action: string,
  userId?: string,
  userEmail?: string,
  success: boolean = true,
  details?: Record<string, any>,
  request?: any
): Promise<void> {
  const severity = success ? 'low' : 'medium';
  const event = createAuditEvent(action, AUDIT_RESOURCES.SESSION, {
    userId,
    userEmail,
    success,
    severity,
    details,
    ipAddress: getClientIP(request),
    userAgent: request?.headers?.['user-agent']
  });
  
  await logAuditEvent(event);
}

/**
 * Log user management event
 */
export async function logUserEvent(
  action: string,
  targetUserId: string,
  targetUserEmail: string,
  performedBy?: { id: string; email: string; role: string },
  details?: Record<string, any>
): Promise<void> {
  const severity = getSeverityForUserAction(action);
  const event = createAuditEvent(action, AUDIT_RESOURCES.USER, {
    userId: performedBy?.id,
    userEmail: performedBy?.email,
    userRole: performedBy?.role,
    resourceId: targetUserId,
    severity,
    details: {
      targetUserEmail,
      ...details
    }
  });
  
  await logAuditEvent(event);
}

/**
 * Log admin action
 */
export async function logAdminEvent(
  action: string,
  resource: string,
  resourceId?: string,
  performedBy?: { id: string; email: string; role: string },
  details?: Record<string, any>
): Promise<void> {
  const event = createAuditEvent(action, resource, {
    userId: performedBy?.id,
    userEmail: performedBy?.email,
    userRole: performedBy?.role,
    resourceId,
    severity: 'medium',
    details
  });
  
  await logAuditEvent(event);
}

/**
 * Log security event
 */
export async function logSecurityEvent(
  action: string,
  details: Record<string, any>,
  request?: any,
  userId?: string,
  userEmail?: string
): Promise<void> {
  const event = createAuditEvent(action, AUDIT_RESOURCES.SYSTEM, {
    userId,
    userEmail,
    success: false,
    severity: 'high',
    details,
    ipAddress: getClientIP(request),
    userAgent: request?.headers?.['user-agent']
  });
  
  await logAuditEvent(event);
}

/**
 * Get audit events with filtering
 */
export async function getAuditEvents(filter: AuditFilter = {}): Promise<{
  events: AuditEvent[];
  total: number;
  hasMore: boolean;
}> {
  try {
    // In a real implementation, this would query a database
    const events = await readAuditLogs(filter);
    const total = events.length;
    const limit = filter.limit || 50;
    const offset = filter.offset || 0;
    
    const paginatedEvents = events.slice(offset, offset + limit);
    const hasMore = offset + limit < total;
    
    return {
      events: paginatedEvents,
      total,
      hasMore
    };
  } catch (error) {
    console.error('Failed to get audit events:', error);
    return { events: [], total: 0, hasMore: false };
  }
}

/**
 * Generate unique audit ID
 */
function generateAuditId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get severity level for user actions
 */
function getSeverityForUserAction(action: string): 'low' | 'medium' | 'high' | 'critical' {
  const highSeverityActions = [
    AUDIT_ACTIONS.USER_DELETE,
    AUDIT_ACTIONS.ROLE_CHANGE,
    AUDIT_ACTIONS.USER_DEACTIVATE
  ];
  
  const mediumSeverityActions = [
    AUDIT_ACTIONS.USER_CREATE,
    AUDIT_ACTIONS.USER_UPDATE,
    AUDIT_ACTIONS.USER_ACTIVATE
  ];
  
  if (highSeverityActions.includes(action as any)) return 'high';
  if (mediumSeverityActions.includes(action as any)) return 'medium';
  return 'low';
}

/**
 * Extract client IP address from request
 */
function getClientIP(request?: any): string | undefined {
  if (!request) return undefined;
  
  return (
    request.headers?.['x-forwarded-for']?.split(',')[0] ||
    request.headers?.['x-real-ip'] ||
    request.connection?.remoteAddress ||
    request.socket?.remoteAddress ||
    undefined
  );
}

/**
 * Write audit log to storage
 */
async function writeAuditLog(event: AuditEvent): Promise<void> {
  // In a real implementation, this would write to a database or external service
  // For now, we'll simulate with a simple file-based approach
  
  if (typeof window === 'undefined') {
    // Server-side: write to file or database
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const logDir = path.join(process.cwd(), 'data', 'audit');
    const logFile = path.join(logDir, `audit-${new Date().toISOString().split('T')[0]}.json`);
    
    try {
      await fs.mkdir(logDir, { recursive: true });
      
      let logs: AuditEvent[] = [];
      try {
        const existingData = await fs.readFile(logFile, 'utf-8');
        logs = JSON.parse(existingData);
      } catch {
        // File doesn't exist or is empty
      }
      
      logs.push(event);
      await fs.writeFile(logFile, JSON.stringify(logs, null, 2));
    } catch (error) {
      console.error('Failed to write audit log:', error);
    }
  }
}

/**
 * Read audit logs from storage
 */
async function readAuditLogs(filter: AuditFilter): Promise<AuditEvent[]> {
  // In a real implementation, this would query a database
  // For now, we'll simulate with file-based approach
  
  if (typeof window !== 'undefined') {
    return []; // Client-side: return empty array
  }
  
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const logDir = path.join(process.cwd(), 'data', 'audit');
    const files = await fs.readdir(logDir).catch(() => []);
    
    let allEvents: AuditEvent[] = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(logDir, file);
          const data = await fs.readFile(filePath, 'utf-8');
          const events = JSON.parse(data);
          allEvents = [...allEvents, ...events];
        } catch (error) {
          console.error(`Failed to read audit log file ${file}:`, error);
        }
      }
    }
    
    // Apply filters
    return allEvents.filter(event => {
      if (filter.userId && event.userId !== filter.userId) return false;
      if (filter.tenantId && event.tenantId !== filter.tenantId) return false;
      if (filter.action && event.action !== filter.action) return false;
      if (filter.resource && event.resource !== filter.resource) return false;
      if (filter.severity && event.severity !== filter.severity) return false;
      if (filter.success !== undefined && event.success !== filter.success) return false;
      if (filter.startDate && event.timestamp < filter.startDate) return false;
      if (filter.endDate && event.timestamp > filter.endDate) return false;
      return true;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Failed to read audit logs:', error);
    return [];
  }
}
