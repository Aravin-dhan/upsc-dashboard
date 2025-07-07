import { NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
  details?: any;
  timestamp: string;
  path?: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, AppError);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 409, 'CONFLICT_ERROR', details);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR', details);
    this.name = 'ExternalServiceError';
  }
}

// Error logging function
export function logError(error: Error, context?: any) {
  const errorData = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString(),
    context,
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorData);
  } else {
    // In production, send to monitoring service
    console.error('Production error:', {
      message: error.message,
      name: error.name,
      timestamp: errorData.timestamp,
      context,
    });
  }
}

// Main error handler for API routes
export function handleApiError(error: unknown, path?: string): NextResponse {
  let apiError: ApiError;

  if (error instanceof AppError) {
    apiError = {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
      timestamp: new Date().toISOString(),
      path,
    };
  } else if (error instanceof Error) {
    // Log unexpected errors
    logError(error, { path });
    
    apiError = {
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path,
    };
  } else {
    // Handle non-Error objects
    logError(new Error('Unknown error type'), { error, path });
    
    apiError = {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  return NextResponse.json(
    {
      error: apiError,
      success: false,
    },
    { status: apiError.statusCode }
  );
}

// Async error wrapper for API routes
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

// Validation helper
export function validateRequired(data: any, fields: string[]): void {
  const missing = fields.filter(field => {
    const value = data[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missing.join(', ')}`,
      { missingFields: missing }
    );
  }
}

// Type validation helper
export function validateTypes(data: any, schema: Record<string, string>): void {
  const errors: string[] = [];

  Object.entries(schema).forEach(([field, expectedType]) => {
    const value = data[field];
    if (value !== undefined && value !== null) {
      const actualType = typeof value;
      if (actualType !== expectedType) {
        errors.push(`Field '${field}' should be ${expectedType}, got ${actualType}`);
      }
    }
  });

  if (errors.length > 0) {
    throw new ValidationError(
      'Type validation failed',
      { typeErrors: errors }
    );
  }
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Rate limiting helper
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  const current = rateLimitMap.get(identifier);

  if (!current || current.resetTime < windowStart) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;
  return true;
}

// Sanitize user input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

// Safe JSON parsing
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}
