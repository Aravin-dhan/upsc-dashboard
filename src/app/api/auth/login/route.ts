import { NextRequest, NextResponse } from 'next/server';
import { UserDatabase, SessionDatabase, TenantDatabase } from '@/lib/database';
import { verifyPassword, createSession } from '@/lib/auth';
import { cookies } from 'next/headers';
import { validateSchema, createValidationErrorResponse, COMMON_SCHEMAS } from '@/lib/validation';

export const runtime = 'nodejs';

// Enhanced error types for better user feedback
interface AuthError {
  code: string;
  message: string;
  userMessage: string;
  status: number;
}

const AUTH_ERRORS: Record<string, AuthError> = {
  MISSING_FIELDS: {
    code: 'MISSING_FIELDS',
    message: 'Email and password are required',
    userMessage: 'Please enter both email and password.',
    status: 400
  },
  INVALID_EMAIL_FORMAT: {
    code: 'INVALID_EMAIL_FORMAT',
    message: 'Invalid email format',
    userMessage: 'Please enter a valid email address.',
    status: 400
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid email or password',
    userMessage: 'Invalid email or password. Please check your credentials and try again.',
    status: 401
  },
  ACCOUNT_DEACTIVATED: {
    code: 'ACCOUNT_DEACTIVATED',
    message: 'Account is deactivated',
    userMessage: 'Your account has been deactivated. Please contact support for assistance.',
    status: 401
  },
  RATE_LIMITED: {
    code: 'RATE_LIMITED',
    message: 'Too many login attempts',
    userMessage: 'Too many failed login attempts. Please wait a few minutes before trying again.',
    status: 429
  },
  SERVER_ERROR: {
    code: 'SERVER_ERROR',
    message: 'Internal server error',
    userMessage: 'Something went wrong on our end. Please try again in a moment.',
    status: 500
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      const error = AUTH_ERRORS.MISSING_FIELDS;
      return NextResponse.json(
        {
          error: error.userMessage,
          code: error.code,
          details: error.message
        },
        { status: error.status }
      );
    }

    // Validate and sanitize input
    const validation = validateSchema(body, COMMON_SCHEMAS.login);
    if (!validation.isValid) {
      return createValidationErrorResponse(validation.errors);
    }

    const { email, password } = validation.sanitizedData!;

    // Email format is already validated by the schema

    // Find user by email (case-insensitive)
    const user = await UserDatabase.findByEmail(email.trim().toLowerCase());
    if (!user) {
      const error = AUTH_ERRORS.INVALID_CREDENTIALS;
      return NextResponse.json(
        {
          error: error.userMessage,
          code: error.code,
          details: error.message
        },
        { status: error.status }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      const error = AUTH_ERRORS.ACCOUNT_DEACTIVATED;
      return NextResponse.json(
        {
          error: error.userMessage,
          code: error.code,
          details: error.message
        },
        { status: error.status }
      );
    }

    // Verify password
    const isValidPassword = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValidPassword) {
      const error = AUTH_ERRORS.INVALID_CREDENTIALS;
      return NextResponse.json(
        {
          error: error.userMessage,
          code: error.code,
          details: error.message
        },
        { status: error.status }
      );
    }

    // Update last login
    const { passwordHash, salt, ...userWithoutPassword } = user;
    await UserDatabase.updateUser(user.id, {
      lastLogin: new Date().toISOString()
    });

    // Get tenant information
    const tenant = await TenantDatabase.findById(userWithoutPassword.tenantId);

    // Create session with tenant info
    const sessionToken = await createSession(userWithoutPassword, tenant || undefined);

    // Log session for tracking
    await SessionDatabase.logSession(user.id, {
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('upsc-auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      tenant: tenant,
      message: 'Welcome back! Login successful.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Login error:', error);

    // Check for specific database errors
    if (error instanceof Error) {
      if (error.message.includes('connection') || error.message.includes('timeout')) {
        const dbError = AUTH_ERRORS.SERVER_ERROR;
        return NextResponse.json(
          {
            error: 'Unable to connect to our servers. Please check your internet connection and try again.',
            code: 'CONNECTION_ERROR',
            details: 'Database connection failed'
          },
          { status: 503 }
        );
      }
    }

    const error_response = AUTH_ERRORS.SERVER_ERROR;
    return NextResponse.json(
      {
        error: error_response.userMessage,
        code: error_response.code,
        details: error_response.message
      },
      { status: error_response.status }
    );
  }
}
