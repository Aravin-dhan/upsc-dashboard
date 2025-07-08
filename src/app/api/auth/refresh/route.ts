import { NextRequest, NextResponse } from 'next/server';
import { getSession, createSession } from '@/lib/auth';
import { UserDatabase, TenantDatabase } from '@/lib/database';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

// Add GET method for compatibility
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Use POST method for session refresh' },
    { status: 405 }
  );
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Session refresh requested');
    
    // Get current session
    const session = await getSession(request);
    
    if (!session) {
      console.log('❌ No valid session found for refresh');
      return NextResponse.json(
        { 
          error: 'No valid session to refresh',
          code: 'NO_SESSION',
          requiresLogin: true
        },
        { status: 401 }
      );
    }

    // Check if session is about to expire (within 2 hours)
    const now = new Date();
    const expiresAt = new Date(session.expires);
    const twoHours = 2 * 60 * 60 * 1000;
    const isExpiringSoon = (expiresAt.getTime() - now.getTime()) < twoHours;

    if (!isExpiringSoon) {
      console.log('✅ Session is still valid, no refresh needed');
      return NextResponse.json({
        success: true,
        message: 'Session is still valid',
        user: session.user,
        tenant: session.tenant,
        expires: session.expires
      });
    }

    console.log('🔄 Refreshing expiring session for user:', session.user.email);

    // Get fresh user data from database
    const user = await UserDatabase.findById(session.user.id);
    if (!user) {
      console.log('❌ User not found during refresh');
      return NextResponse.json(
        { 
          error: 'User not found',
          code: 'USER_NOT_FOUND',
          requiresLogin: true
        },
        { status: 401 }
      );
    }

    // Check if user is still active
    if (!user.isActive) {
      console.log('❌ User account deactivated during refresh');
      return NextResponse.json(
        { 
          error: 'Account has been deactivated',
          code: 'ACCOUNT_DEACTIVATED',
          requiresLogin: true
        },
        { status: 401 }
      );
    }

    // Get tenant data
    const tenant = await TenantDatabase.findById(user.tenantId);

    // Create new session with extended expiration
    // Use 30 days for refresh (assuming user wants extended session)
    const extendedDuration = 30 * 24 * 60 * 60 * 1000; // 30 days
    const newSessionToken = await createSession(
      user,
      tenant || undefined,
      request,
      extendedDuration
    );

    // Update cookie with new token
    const cookieStore = await cookies();
    const maxAge = 30 * 24 * 60 * 60; // 30 days
    
    cookieStore.set('upsc-auth-token', newSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/',
      expires: new Date(Date.now() + maxAge * 1000),
      priority: 'high'
    });

    console.log('✅ Session refreshed successfully for user:', user.email);

    return NextResponse.json({
      success: true,
      message: 'Session refreshed successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
        tenantRole: user.tenantRole,
        tenants: user.tenants,
        isActive: user.isActive,
        preferences: user.preferences
      },
      tenant: tenant,
      expires: new Date(Date.now() + extendedDuration).toISOString(),
      refreshed: true
    });

  } catch (error) {
    console.error('💥 Session refresh error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to refresh session',
        code: 'REFRESH_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
