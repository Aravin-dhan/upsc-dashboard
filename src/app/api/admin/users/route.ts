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
    
    // Mock users data (replace with actual database call)
    const mockUsers = [
      {
        id: '1',
        email: 'admin@upsc.local',
        name: 'Admin User',
        role: 'admin',
        tenantId: 'default',
        tenantRole: 'admin',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: new Date().toISOString(),
        planType: 'pro'
      },
      {
        id: '2',
        email: 'teacher@upsc.local',
        name: 'Teacher User',
        role: 'teacher',
        tenantId: 'default',
        tenantRole: 'teacher',
        isActive: true,
        createdAt: '2024-02-01T00:00:00Z',
        lastLogin: new Date(Date.now() - 86400000).toISOString(),
        planType: 'pro'
      },
      {
        id: '3',
        email: 'student@upsc.local',
        name: 'Student User',
        role: 'student',
        tenantId: 'default',
        tenantRole: 'student',
        isActive: true,
        createdAt: '2024-03-01T00:00:00Z',
        lastLogin: new Date(Date.now() - 3600000).toISOString(),
        planType: 'free'
      }
    ];

    // Remove sensitive information but keep essential admin data
    const safeUsers = mockUsers.map(user => ({
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

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Validate role
    const validRoles = ['admin', 'teacher', 'student'];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      );
    }
    
    // Mock user creation (replace with actual database call)
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role: role || 'student',
      planType: planType || 'free',
      tenantId: session.user.tenantId || 'default',
      tenantRole: role || 'student',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      hasActivity: false,
      accountAge: 0
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
