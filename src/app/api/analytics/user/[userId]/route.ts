import { NextRequest, NextResponse } from 'next/server';
import { getSession, hasPermission } from '@/lib/auth';
import { analyticsService } from '@/lib/services/analyticsService';

export const runtime = 'nodejs';

// GET: Get analytics for a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { userId } = params;
    
    // Check if user can access this data (admin or own data)
    const isAdmin = hasPermission(session.user.role, 'admin');
    const isOwnData = session.user.id === userId;
    
    if (!isAdmin && !isOwnData) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const userAnalytics = await analyticsService.getUserAnalytics(userId);

    return NextResponse.json({
      success: true,
      analytics: userAnalytics
    });
    
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Get user analytics error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
