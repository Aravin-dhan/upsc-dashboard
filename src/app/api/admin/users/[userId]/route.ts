import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
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

    const { userId } = params;

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
    // In a real implementation, you would:
    // 1. Check if user exists
    // 2. Delete from database
    // 3. Handle any related data cleanup
    
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
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

    const { userId } = params;
    const { name, email, role, planType, isActive } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

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

    // Prevent self-demotion
    if (userId === session.user.id && role !== 'admin') {
      validationErrors.role = 'You cannot change your own admin role';
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

    // Check for email uniqueness (mock check - exclude current user)
    const normalizedEmail = email.trim().toLowerCase();
    // In a real implementation, you would check the database here
    if ((normalizedEmail === 'admin@upsc.local' || normalizedEmail === 'test@example.com') && userId !== '1') {
      return NextResponse.json(
        {
          error: 'Email address is already in use',
          field: 'email'
        },
        { status: 409 }
      );
    }

    // Mock user update (replace with actual database call)
    const updatedUser = {
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      role: role || 'student',
      planType: planType || 'free',
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date().toISOString(),
      tenantId: session.user.tenantId || 'default',
      tenantRole: role || 'student',
      subscriptionStatus: planType === 'pro' ? 'active' : planType === 'trial' ? 'trial' : 'free',
      lastLogin: userId === '1' ? new Date().toISOString() : null,
      hasActivity: userId === '1',
      accountAge: Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24))
    };

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
