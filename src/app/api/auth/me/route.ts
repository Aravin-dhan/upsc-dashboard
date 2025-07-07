import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

// Enhanced error types for session validation
interface SessionError {
  code: string;
  message: string;
  userMessage: string;
  status: number;
}

const SESSION_ERRORS: Record<string, SessionError> = {
  NOT_AUTHENTICATED: {
    code: 'NOT_AUTHENTICATED',
    message: 'No valid session found',
    userMessage: 'Your session has expired. Please sign in again.',
    status: 401
  },
  INVALID_TOKEN: {
    code: 'INVALID_TOKEN',
    message: 'Invalid or malformed token',
    userMessage: 'Your session is invalid. Please sign in again.',
    status: 401
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    message: 'Session token has expired',
    userMessage: 'Your session has expired. Please sign in again.',
    status: 401
  },
  SERVER_ERROR: {
    code: 'SERVER_ERROR',
    message: 'Internal server error during session validation',
    userMessage: 'Unable to verify your session. Please try refreshing the page.',
    status: 500
  }
};

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      const error = SESSION_ERRORS.NOT_AUTHENTICATED;
      return NextResponse.json(
        {
          error: error.userMessage,
          code: error.code,
          details: error.message,
          requiresLogin: true
        },
        { status: error.status }
      );
    }

    // Check if session is about to expire (within 1 hour)
    const now = new Date();
    const expiresAt = new Date(session.expires);
    const oneHour = 60 * 60 * 1000;
    const isExpiringSoon = (expiresAt.getTime() - now.getTime()) < oneHour;

    return NextResponse.json({
      success: true,
      user: session.user,
      tenant: session.tenant,
      expires: session.expires,
      isExpiringSoon,
      timestamp: now.toISOString()
    });

  } catch (error) {
    console.error('Session check error:', error);

    // Handle specific JWT/token errors
    if (error instanceof Error) {
      if (error.message.includes('jwt expired') || error.message.includes('token expired')) {
        const tokenError = SESSION_ERRORS.TOKEN_EXPIRED;
        return NextResponse.json(
          {
            error: tokenError.userMessage,
            code: tokenError.code,
            details: tokenError.message,
            requiresLogin: true
          },
          { status: tokenError.status }
        );
      }

      if (error.message.includes('jwt malformed') || error.message.includes('invalid token')) {
        const tokenError = SESSION_ERRORS.INVALID_TOKEN;
        return NextResponse.json(
          {
            error: tokenError.userMessage,
            code: tokenError.code,
            details: tokenError.message,
            requiresLogin: true
          },
          { status: tokenError.status }
        );
      }
    }

    const serverError = SESSION_ERRORS.SERVER_ERROR;
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
