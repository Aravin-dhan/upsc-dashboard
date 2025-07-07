import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT_SET',
      nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
      cookieInfo: null,
      sessionInfo: null,
      errors: []
    };

    // Test cookie reading
    try {
      const cookieStore = await cookies();
      const authCookie = cookieStore.get('upsc-auth-token');
      diagnostics.cookieInfo = {
        exists: !!authCookie,
        hasValue: !!authCookie?.value,
        valueLength: authCookie?.value?.length || 0,
        cookieName: 'upsc-auth-token'
      };
    } catch (error: any) {
      diagnostics.cookieInfo = { error: error.message };
      diagnostics.errors.push(`Cookie test error: ${error.message}`);
    }

    // Test session validation
    try {
      const session = await getSession(request);
      diagnostics.sessionInfo = {
        exists: !!session,
        hasUser: !!session?.user,
        userEmail: session?.user?.email,
        userRole: session?.user?.role,
        hasTenant: !!session?.tenant,
        tenantId: session?.tenant?.id,
        expires: session?.expires
      };
    } catch (error: any) {
      diagnostics.sessionInfo = { error: error.message };
      diagnostics.errors.push(`Session test error: ${error.message}`);
    }

    // Test JWT secret functionality
    try {
      const { SignJWT } = await import('jose');
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback');
      const jwt = await new SignJWT({ test: true })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secret);
      diagnostics.jwtTest = 'SUCCESS';
    } catch (error: any) {
      diagnostics.jwtTest = `FAILED: ${error.message}`;
      diagnostics.errors.push(`JWT test error: ${error.message}`);
    }

    return NextResponse.json(diagnostics);

  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Debug endpoint failed',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
