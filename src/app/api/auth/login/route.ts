import { NextRequest, NextResponse } from 'next/server';
import { UserDatabase, SessionDatabase, TenantDatabase } from '@/lib/database';
import { verifyPassword, createSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = await UserDatabase.findByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValidPassword = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
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
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
