import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin permissions
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    // Get real users from database
    const users = await UserDatabase.getAllUsers();

    // Remove sensitive information but keep essential admin data
    const safeUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
      tenantRole: user.tenantRole,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      planType: user.planType,
      // Admin can see user activity but not personal data
      hasActivity: !!user.lastLogin,
      accountAge: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    }));

    return NextResponse.json({
      success: true,
      users: safeUsers,
      total: safeUsers.length,
      stats: {
        active: safeUsers.filter(u => u.isActive).length,
        inactive: safeUsers.filter(u => !u.isActive).length,
        admins: safeUsers.filter(u => u.role === 'admin').length,
        teachers: safeUsers.filter(u => u.role === 'teacher').length,
        students: safeUsers.filter(u => u.role === 'student').length
      }
    });
    
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin permissions
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    const { name, email, role, planType } = await request.json();

    // Comprehensive validation
    const validationErrors: Record<string, string> = {};

    // Name validation
    if (!name?.trim()) {
      validationErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      validationErrors.name = 'Name must be at least 2 characters';
    } else if (name.trim().length > 100) {
      validationErrors.name = 'Name must be less than 100 characters';
    }

    // Email validation
    if (!email?.trim()) {
      validationErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        validationErrors.email = 'Please enter a valid email address';
      } else if (email.trim().length > 255) {
        validationErrors.email = 'Email must be less than 255 characters';
      }
    }

    // Role validation
    const validRoles = ['admin', 'teacher', 'student'];
    if (role && !validRoles.includes(role)) {
      validationErrors.role = 'Please select a valid role';
    }

    // Plan type validation
    const validPlanTypes = ['free', 'trial', 'pro'];
    if (planType && !validPlanTypes.includes(planType)) {
      validationErrors.planType = 'Please select a valid plan type';
    }

    // Return validation errors if any
    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.entries(validationErrors)[0];
      return NextResponse.json(
        {
          error: firstError[1],
          field: firstError[0],
          validationErrors
        },
        { status: 400 }
      );
    }

    // Check for email uniqueness (mock check)
    const normalizedEmail = email.trim().toLowerCase();
    // In a real implementation, you would check the database here
    if (normalizedEmail === 'admin@upsc.local' || normalizedEmail === 'test@example.com') {
      return NextResponse.json(
        {
          error: 'Email address is already in use',
          field: 'email'
        },
        { status: 409 }
      );
    }
    
    // Mock user creation (replace with actual database call)
    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: normalizedEmail,
      role: role || 'student',
      planType: planType || 'free',
      tenantId: session.user.tenantId || 'default',
      tenantRole: role || 'student',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      hasActivity: false,
      accountAge: 0,
      subscriptionStatus: planType === 'pro' ? 'active' : planType === 'trial' ? 'trial' : 'free'
    };

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'User created successfully'
    });
    
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication and admin permissions
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Prevent admin from deleting themselves
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Mock user deletion (replace with actual database call)
    // In a real implementation, you would check if user exists and delete from database
    return NextResponse.json({
      success: true,
      message: `User with ID ${userId} has been deleted successfully`,
      deletedUser: {
        id: userId
      }
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
