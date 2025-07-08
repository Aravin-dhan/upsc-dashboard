import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { UserDatabase } from '@/lib/database';

export const runtime = 'nodejs';

// POST /api/user/preferences/dashboard - Save dashboard layout
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { dashboardLayout } = body;

    if (!dashboardLayout || typeof dashboardLayout !== 'object') {
      return NextResponse.json(
        { error: 'Invalid dashboard layout data' },
        { status: 400 }
      );
    }

    // Validate dashboard layout structure
    if (!dashboardLayout.columns || !Array.isArray(dashboardLayout.widgets)) {
      return NextResponse.json(
        { error: 'Invalid dashboard layout structure' },
        { status: 400 }
      );
    }

    const user = await UserDatabase.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update dashboard layout in user preferences
    const updatedUser = await UserDatabase.updateUser(session.user.id, {
      preferences: {
        ...user.preferences,
        dashboardLayout,
        updatedAt: new Date().toISOString()
      }
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to save dashboard layout' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Dashboard layout saved successfully',
      dashboardLayout: updatedUser.preferences?.dashboardLayout
    });

  } catch (error) {
    console.error('Save dashboard layout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
