// Error monitoring and logging utilities for production readiness

interface ErrorLog {
  timestamp: string;
  error: string;
  stack?: string;
  url: string;
  userAgent: string;
  userId?: string;
  tenantId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

class ErrorMonitor {
  private errors: ErrorLog[] = [];
  private maxErrors = 100; // Keep last 100 errors in memory
  private isProduction = process.env.NODE_ENV === 'production';

  constructor() {
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        this.logError({
          error: `Unhandled Promise Rejection: ${event.reason}`,
          severity: 'high',
          context: { type: 'unhandledrejection', reason: event.reason }
        });
      });

      // Handle global JavaScript errors
      window.addEventListener('error', (event) => {
        this.logError({
          error: `Global Error: ${event.message}`,
          stack: event.error?.stack,
          severity: 'high',
          context: { 
            type: 'global_error',
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          }
        });
      });

      // Handle React error boundary errors
      window.addEventListener('react-error', (event: any) => {
        this.logError({
          error: `React Error: ${event.detail.error.message}`,
          stack: event.detail.error.stack,
          severity: 'high',
          context: { 
            type: 'react_error',
            componentStack: event.detail.errorInfo?.componentStack
          }
        });
      });
    }
  }

  logError(params: {
    error: string;
    stack?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    context?: Record<string, any>;
    userId?: string;
    tenantId?: string;
  }) {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      error: params.error,
      stack: params.stack,
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      userId: params.userId,
      tenantId: params.tenantId,
      severity: params.severity || 'medium',
      context: params.context
    };

    // Add to memory store
    this.errors.push(errorLog);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift(); // Remove oldest error
    }

    // Log to console in development
    if (!this.isProduction) {
      console.error('Error Monitor:', errorLog);
    }

    // In production, you would send this to your error reporting service
    if (this.isProduction && params.severity === 'critical') {
      this.sendToErrorService(errorLog);
    }

    // Store in localStorage for debugging
    if (typeof window !== 'undefined') {
      try {
        const storedErrors = JSON.parse(localStorage.getItem('upsc_error_logs') || '[]');
        storedErrors.push(errorLog);
        // Keep only last 50 errors in localStorage
        if (storedErrors.length > 50) {
          storedErrors.splice(0, storedErrors.length - 50);
        }
        localStorage.setItem('upsc_error_logs', JSON.stringify(storedErrors));
      } catch (e) {
        console.warn('Failed to store error log in localStorage:', e);
      }
    }
  }

  private async sendToErrorService(errorLog: ErrorLog) {
    try {
      // In a real application, you would send this to your error reporting service
      // For now, we'll just log it
      console.error('Critical Error:', errorLog);
      
      // Example: Send to a hypothetical error service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorLog)
      // });
    } catch (e) {
      console.error('Failed to send error to service:', e);
    }
  }

  getErrors(): ErrorLog[] {
    return [...this.errors];
  }

  getErrorsByType(type: string): ErrorLog[] {
    return this.errors.filter(error => error.context?.type === type);
  }

  getErrorsBySeverity(severity: 'low' | 'medium' | 'high' | 'critical'): ErrorLog[] {
    return this.errors.filter(error => error.severity === severity);
  }

  clearErrors() {
    this.errors = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('upsc_error_logs');
    }
  }

  getErrorStats() {
    const stats = {
      total: this.errors.length,
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
      byType: {} as Record<string, number>
    };

    this.errors.forEach(error => {
      stats[error.severity]++;
      const type = error.context?.type || 'unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    return stats;
  }
}

// Create singleton instance
export const errorMonitor = new ErrorMonitor();

// Utility functions for common error scenarios
export function logAPIError(endpoint: string, error: any, context?: Record<string, any>) {
  errorMonitor.logError({
    error: `API Error: ${endpoint} - ${error.message || error}`,
    stack: error.stack,
    severity: 'medium',
    context: { type: 'api_error', endpoint, ...context }
  });
}

export function logComponentError(componentName: string, error: any, context?: Record<string, any>) {
  errorMonitor.logError({
    error: `Component Error: ${componentName} - ${error.message || error}`,
    stack: error.stack,
    severity: 'medium',
    context: { type: 'component_error', component: componentName, ...context }
  });
}

export function logAuthError(action: string, error: any, context?: Record<string, any>) {
  errorMonitor.logError({
    error: `Auth Error: ${action} - ${error.message || error}`,
    stack: error.stack,
    severity: 'high',
    context: { type: 'auth_error', action, ...context }
  });
}

export function logDataError(operation: string, error: any, context?: Record<string, any>) {
  errorMonitor.logError({
    error: `Data Error: ${operation} - ${error.message || error}`,
    stack: error.stack,
    severity: 'medium',
    context: { type: 'data_error', operation, ...context }
  });
}

export function logCriticalError(error: any, context?: Record<string, any>) {
  errorMonitor.logError({
    error: `Critical Error: ${error.message || error}`,
    stack: error.stack,
    severity: 'critical',
    context: { type: 'critical_error', ...context }
  });
}

// Development helper to check for errors
export function getErrorReport() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const stats = errorMonitor.getErrorStats();
  const recentErrors = errorMonitor.getErrors().slice(-10);

  return {
    stats,
    recentErrors,
    criticalErrors: errorMonitor.getErrorsBySeverity('critical'),
    highSeverityErrors: errorMonitor.getErrorsBySeverity('high')
  };
}

export default errorMonitor;
