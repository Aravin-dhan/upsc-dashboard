import { NextRequest, NextResponse } from 'next/server';
import { UserDatabase } from '@/lib/database';
import { createSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

// Enhanced error types for registration
interface RegistrationError {
  code: string;
  message: string;
  userMessage: string;
  status: number;
}

const REGISTRATION_ERRORS: Record<string, RegistrationError> = {
  MISSING_FIELDS: {
    code: 'MISSING_FIELDS',
    message: 'Required fields missing',
    userMessage: 'Please fill in all required fields: name, email, and password.',
    status: 400
  },
  INVALID_EMAIL: {
    code: 'INVALID_EMAIL',
    message: 'Invalid email format',
    userMessage: 'Please enter a valid email address.',
    status: 400
  },
  WEAK_PASSWORD: {
    code: 'WEAK_PASSWORD',
    message: 'Password does not meet requirements',
    userMessage: 'Password must be at least 6 characters long and contain a mix of letters and numbers.',
    status: 400
  },
  EMAIL_EXISTS: {
    code: 'EMAIL_EXISTS',
    message: 'Email already registered',
    userMessage: 'An account with this email already exists. Please use a different email or try signing in.',
    status: 409
  },
  INVALID_NAME: {
    code: 'INVALID_NAME',
    message: 'Invalid name format',
    userMessage: 'Please enter a valid name (2-50 characters, letters and spaces only).',
    status: 400
  },
  SERVER_ERROR: {
    code: 'SERVER_ERROR',
    message: 'Internal server error',
    userMessage: 'Something went wrong while creating your account. Please try again.',
    status: 500
  }
};

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 /api/auth/register - Starting registration process');
    const body = await request.json().catch((err) => {
      console.error('❌ Failed to parse request body:', err);
      return null;
    });

    if (!body) {
      console.log('❌ No request body provided');
      const error = REGISTRATION_ERRORS.MISSING_FIELDS;
      return NextResponse.json(
        {
          error: error.userMessage,
          code: error.code,
          details: error.message
        },
        { status: error.status }
      );
    }

    console.log('📋 Registration request body keys:', Object.keys(body));

    const { email, password, name, role, tenantId, tenantName, organizationType } = body;

    // Validate required fields
    console.log('🔍 Validating required fields:', { email: !!email, password: !!password, name: !!name });
    if (!email || !password || !name) {
      console.log('❌ Missing required fields');
      const error = REGISTRATION_ERRORS.MISSING_FIELDS;
      return NextResponse.json(
        {
          error: error.userMessage,
          code: error.code,
          details: error.message
        },
        { status: error.status }
      );
    }

    // Validate name format
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(name.trim())) {
      const error = REGISTRATION_ERRORS.INVALID_NAME;
      return NextResponse.json(
        {
          error: error.userMessage,
          code: error.code,
          details: error.message
        },
        { status: error.status }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      const error = REGISTRATION_ERRORS.INVALID_EMAIL;
      return NextResponse.json(
        {
          error: error.userMessage,
          code: error.code,
          details: error.message
        },
        { status: error.status }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      const error = REGISTRATION_ERRORS.WEAK_PASSWORD;
      return NextResponse.json(
        {
          error: error.userMessage,
          code: error.code,
          details: error.message
        },
        { status: error.status }
      );
    }

    // Additional password strength check
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!hasLetter || !hasNumber) {
      const error = REGISTRATION_ERRORS.WEAK_PASSWORD;
      return NextResponse.json(
        {
          error: error.userMessage,
          code: error.code,
          details: error.message
        },
        { status: error.status }
      );
    }
    
    // Validate role
    const validRoles = ['admin', 'teacher', 'student'];
    if (role && !validRoles.includes(role)) {
      const error = REGISTRATION_ERRORS.MISSING_FIELDS;
      return NextResponse.json(
        {
          error: 'Please select a valid role.',
          code: 'INVALID_ROLE',
          details: 'Invalid role specified'
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await UserDatabase.findByEmail(email.trim().toLowerCase());
    if (existingUser) {
      const error = REGISTRATION_ERRORS.EMAIL_EXISTS;
      return NextResponse.json(
        {
          error: error.userMessage,
          code: error.code,
          details: error.message
        },
        { status: error.status }
      );
    }

    try {
      // Create user (with potential tenant creation)
      const newUser = await UserDatabase.createUser({
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
        role: role || 'student',
        tenantId,
        tenantName,
        organizationType
      });

      // Create session for auto-login
      const sessionToken = await createSession(newUser);

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
        user: newUser,
        message: 'Welcome to UPSC Dashboard! Your account has been created successfully.',
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error('User creation error:', error);

      if (error.message === 'Email already exists') {
        const emailError = REGISTRATION_ERRORS.EMAIL_EXISTS;
        return NextResponse.json(
          {
            error: emailError.userMessage,
            code: emailError.code,
            details: emailError.message
          },
          { status: emailError.status }
        );
      }

      // Handle database constraint errors
      if (error.message.includes('constraint') || error.message.includes('duplicate')) {
        const emailError = REGISTRATION_ERRORS.EMAIL_EXISTS;
        return NextResponse.json(
          {
            error: emailError.userMessage,
            code: emailError.code,
            details: emailError.message
          },
          { status: emailError.status }
        );
      }

      throw error;
    }

  } catch (error) {
    console.error('Registration error:', error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('connection') || error.message.includes('timeout')) {
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

    const serverError = REGISTRATION_ERRORS.SERVER_ERROR;
    return NextResponse.json(
      {
        error: serverError.userMessage,
        code: serverError.code,
        details: serverError.message
      },
      { status: serverError.status }
    );
  }
}
