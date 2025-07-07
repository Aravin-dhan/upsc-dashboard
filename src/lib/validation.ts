/**
 * Input Validation and Sanitization Library
 * Provides comprehensive validation for API endpoints
 */

import { NextResponse } from 'next/server';

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  sanitizedData?: any;
}

// Common validation patterns
const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  phoneNumber: /^\+?[\d\s\-\(\)]{10,}$/,
  url: /^https?:\/\/.+/,
  mongoId: /^[0-9a-fA-F]{24}$/,
  tenantId: /^[a-zA-Z0-9_-]{3,50}$/
};

// Sanitization functions
export function sanitizeString(input: any, maxLength = 1000): string {
  if (typeof input !== 'string') {
    return String(input || '').slice(0, maxLength);
  }
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, maxLength);
}

export function sanitizeEmail(email: any): string {
  return sanitizeString(email, 254).toLowerCase();
}

export function sanitizeNumber(input: any, min?: number, max?: number): number | null {
  const num = Number(input);
  if (isNaN(num)) return null;
  
  if (min !== undefined && num < min) return min;
  if (max !== undefined && num > max) return max;
  
  return num;
}

export function sanitizeBoolean(input: any): boolean {
  if (typeof input === 'boolean') return input;
  if (typeof input === 'string') {
    return input.toLowerCase() === 'true' || input === '1';
  }
  return Boolean(input);
}

export function sanitizeArray(input: any, maxLength = 100): any[] {
  if (!Array.isArray(input)) return [];
  return input.slice(0, maxLength);
}

// Validation functions
export function validateRequired(value: any, fieldName: string): ValidationError | null {
  if (value === undefined || value === null || value === '') {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
      code: 'REQUIRED'
    };
  }
  return null;
}

export function validateEmail(email: string, fieldName = 'email'): ValidationError | null {
  if (!PATTERNS.email.test(email)) {
    return {
      field: fieldName,
      message: 'Invalid email format',
      code: 'INVALID_EMAIL'
    };
  }
  return null;
}

export function validatePassword(password: string, fieldName = 'password'): ValidationError | null {
  if (password.length < 8) {
    return {
      field: fieldName,
      message: 'Password must be at least 8 characters long',
      code: 'PASSWORD_TOO_SHORT'
    };
  }
  
  if (!PATTERNS.password.test(password)) {
    return {
      field: fieldName,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      code: 'PASSWORD_WEAK'
    };
  }
  
  return null;
}

export function validateLength(value: string, min: number, max: number, fieldName: string): ValidationError | null {
  if (value.length < min) {
    return {
      field: fieldName,
      message: `${fieldName} must be at least ${min} characters long`,
      code: 'TOO_SHORT'
    };
  }
  
  if (value.length > max) {
    return {
      field: fieldName,
      message: `${fieldName} must be no more than ${max} characters long`,
      code: 'TOO_LONG'
    };
  }
  
  return null;
}

export function validatePattern(value: string, pattern: RegExp, fieldName: string, message?: string): ValidationError | null {
  if (!pattern.test(value)) {
    return {
      field: fieldName,
      message: message || `${fieldName} format is invalid`,
      code: 'INVALID_FORMAT'
    };
  }
  return null;
}

export function validateEnum(value: any, allowedValues: any[], fieldName: string): ValidationError | null {
  if (!allowedValues.includes(value)) {
    return {
      field: fieldName,
      message: `${fieldName} must be one of: ${allowedValues.join(', ')}`,
      code: 'INVALID_ENUM'
    };
  }
  return null;
}

export function validateRange(value: number, min: number, max: number, fieldName: string): ValidationError | null {
  if (value < min || value > max) {
    return {
      field: fieldName,
      message: `${fieldName} must be between ${min} and ${max}`,
      code: 'OUT_OF_RANGE'
    };
  }
  return null;
}

// Schema-based validation
export interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum?: any[];
    custom?: (value: any) => ValidationError | null;
    sanitize?: (value: any) => any;
  };
}

export function validateSchema(data: any, schema: ValidationSchema): ValidationResult {
  const errors: ValidationError[] = [];
  const sanitizedData: any = {};

  for (const [field, rules] of Object.entries(schema)) {
    let value = data[field];

    // Check required
    if (rules.required) {
      const requiredError = validateRequired(value, field);
      if (requiredError) {
        errors.push(requiredError);
        continue;
      }
    }

    // Skip validation if value is not provided and not required
    if (value === undefined || value === null) {
      continue;
    }

    // Sanitize value
    if (rules.sanitize) {
      value = rules.sanitize(value);
    } else {
      // Default sanitization based on type
      switch (rules.type) {
        case 'string':
          value = sanitizeString(value, rules.maxLength);
          break;
        case 'number':
          value = sanitizeNumber(value, rules.min, rules.max);
          if (value === null) {
            errors.push({
              field,
              message: `${field} must be a valid number`,
              code: 'INVALID_NUMBER'
            });
            continue;
          }
          break;
        case 'boolean':
          value = sanitizeBoolean(value);
          break;
        case 'array':
          value = sanitizeArray(value);
          break;
      }
    }

    // Type validation
    if (rules.type) {
      const expectedType = rules.type === 'array' ? 'object' : rules.type;
      if (rules.type === 'array' && !Array.isArray(value)) {
        errors.push({
          field,
          message: `${field} must be an array`,
          code: 'INVALID_TYPE'
        });
        continue;
      } else if (rules.type !== 'array' && typeof value !== expectedType) {
        errors.push({
          field,
          message: `${field} must be of type ${rules.type}`,
          code: 'INVALID_TYPE'
        });
        continue;
      }
    }

    // Length validation for strings
    if (rules.type === 'string' && (rules.minLength || rules.maxLength)) {
      const lengthError = validateLength(
        value,
        rules.minLength || 0,
        rules.maxLength || Infinity,
        field
      );
      if (lengthError) {
        errors.push(lengthError);
        continue;
      }
    }

    // Range validation for numbers
    if (rules.type === 'number' && (rules.min !== undefined || rules.max !== undefined)) {
      const rangeError = validateRange(
        value,
        rules.min || -Infinity,
        rules.max || Infinity,
        field
      );
      if (rangeError) {
        errors.push(rangeError);
        continue;
      }
    }

    // Pattern validation
    if (rules.pattern && rules.type === 'string') {
      const patternError = validatePattern(value, rules.pattern, field);
      if (patternError) {
        errors.push(patternError);
        continue;
      }
    }

    // Enum validation
    if (rules.enum) {
      const enumError = validateEnum(value, rules.enum, field);
      if (enumError) {
        errors.push(enumError);
        continue;
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        errors.push(customError);
        continue;
      }
    }

    sanitizedData[field] = value;
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: errors.length === 0 ? sanitizedData : undefined
  };
}

// Helper function to create validation error response
export function createValidationErrorResponse(errors: ValidationError[]): NextResponse {
  return NextResponse.json(
    {
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors,
      message: `Validation failed for: ${errors.map(e => e.field).join(', ')}`
    },
    { status: 400 }
  );
}

// Common validation schemas
export const COMMON_SCHEMAS = {
  login: {
    email: {
      required: true,
      type: 'string' as const,
      pattern: PATTERNS.email,
      sanitize: sanitizeEmail
    },
    password: {
      required: true,
      type: 'string' as const,
      minLength: 1
    }
  },
  
  register: {
    email: {
      required: true,
      type: 'string' as const,
      pattern: PATTERNS.email,
      sanitize: sanitizeEmail
    },
    password: {
      required: true,
      type: 'string' as const,
      custom: (value: string) => validatePassword(value)
    },
    name: {
      required: true,
      type: 'string' as const,
      minLength: 2,
      maxLength: 100
    },
    role: {
      type: 'string' as const,
      enum: ['student', 'teacher', 'admin']
    }
  },

  tenantId: {
    tenantId: {
      required: true,
      type: 'string' as const,
      pattern: PATTERNS.tenantId
    }
  }
};
