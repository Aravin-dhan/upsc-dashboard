import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Mock analytics data (replace with actual database queries)
    const analytics = {
      users: {
        total: 1247,
        active: 892,
        new: 45,
        growth: 12.5
      },
      engagement: {
        dailyActiveUsers: 234,
        averageSessionTime: 28.5,
        pageViews: 15678,
        bounceRate: 23.4
      },
      content: {
        totalPages: 156,
        mostViewed: [
          { title: 'UPSC Syllabus', views: 2341 },
          { title: 'Current Affairs', views: 1876 },
          { title: 'Mock Tests', views: 1654 }
        ]
      },
      performance: {
        averageLoadTime: 1.2,
        uptime: 99.8,
        errorRate: 0.1
      },
      revenue: {
        total: 45600,
        monthly: 12800,
        subscriptions: {
          free: 1089,
          trial: 98,
          pro: 60
        }
      }
    };


    return NextResponse.json({
      success: true,
      analytics,
      range
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Get analytics error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
