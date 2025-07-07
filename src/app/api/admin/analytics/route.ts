import { NextRequest, NextResponse } from 'next/server';
import { getSession, hasPermission } from '@/lib/auth';

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
    
    if (!hasPermission(session.user.role, 'admin')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Mock analytics data (replace with actual analytics service)
    const analytics = {
      overview: {
        totalUsers: 2847,
        activeUsers: 1923,
        pageViews: 45672,
        avgSessionDuration: 285, // seconds
        bounceRate: 32.5,
        conversionRate: 8.7
      },
      traffic: {
        sources: [
          { name: 'Direct', visitors: 1245, percentage: 43.7 },
          { name: 'Google Search', visitors: 892, percentage: 31.3 },
          { name: 'Social Media', visitors: 456, percentage: 16.0 },
          { name: 'Referral', visitors: 254, percentage: 8.9 }
        ],
        devices: [
          { name: 'Desktop', visitors: 1678, percentage: 58.9 },
          { name: 'Mobile', visitors: 1169, percentage: 41.1 }
        ],
        topPages: [
          { path: '/dashboard', views: 12450, uniqueViews: 8934 },
          { path: '/practice', views: 9876, uniqueViews: 7234 },
          { path: '/current-affairs', views: 8765, uniqueViews: 6543 },
          { path: '/maps', views: 7654, uniqueViews: 5432 },
          { path: '/learning', views: 6543, uniqueViews: 4321 },
          { path: '/analytics', views: 5432, uniqueViews: 3210 },
          { path: '/wellness', views: 4321, uniqueViews: 2109 },
          { path: '/dictionary', views: 3210, uniqueViews: 1987 }
        ]
      },
      engagement: {
        dailyActiveUsers: [
          { date: '2024-01-15', users: 234 },
          { date: '2024-01-14', users: 267 },
          { date: '2024-01-13', users: 198 },
          { date: '2024-01-12', users: 289 },
          { date: '2024-01-11', users: 245 },
          { date: '2024-01-10', users: 312 },
          { date: '2024-01-09', users: 278 }
        ],
        sessionDuration: [
          { date: '2024-01-15', duration: 285 },
          { date: '2024-01-14', duration: 298 },
          { date: '2024-01-13', duration: 267 },
          { date: '2024-01-12', duration: 312 },
          { date: '2024-01-11', duration: 289 },
          { date: '2024-01-10', duration: 334 },
          { date: '2024-01-09', duration: 301 }
        ],
        featureUsage: [
          { feature: 'AI Assistant', usage: 15678, growth: 12.5 },
          { feature: 'Practice Tests', usage: 12345, growth: 8.3 },
          { feature: 'Current Affairs', usage: 9876, growth: 15.7 },
          { feature: 'Interactive Maps', usage: 8765, growth: 6.2 },
          { feature: 'Learning Center', usage: 7654, growth: 22.1 },
          { feature: 'Analytics Dashboard', usage: 5432, growth: -2.3 },
          { feature: 'Wellness Tracker', usage: 4321, growth: 18.9 },
          { feature: 'Dictionary', usage: 3210, growth: 4.6 }
        ]
      },
      performance: {
        loadTimes: [
          { page: '/dashboard', avgTime: 1245, p95Time: 2890 },
          { page: '/practice', avgTime: 987, p95Time: 2156 },
          { page: '/current-affairs', avgTime: 1156, p95Time: 2567 },
          { page: '/maps', avgTime: 2345, p95Time: 4567 },
          { page: '/learning', avgTime: 1567, p95Time: 3234 },
          { page: '/analytics', avgTime: 1890, p95Time: 3456 },
          { page: '/wellness', avgTime: 1234, p95Time: 2345 },
          { page: '/dictionary', avgTime: 890, p95Time: 1567 }
        ],
        errorRates: [
          { page: '/dashboard', errors: 12, rate: 0.8 },
          { page: '/practice', errors: 8, rate: 0.5 },
          { page: '/current-affairs', errors: 15, rate: 1.2 },
          { page: '/maps', errors: 23, rate: 2.1 },
          { page: '/learning', errors: 6, rate: 0.4 },
          { page: '/analytics', errors: 9, rate: 0.7 },
          { page: '/wellness', errors: 4, rate: 0.3 },
          { page: '/dictionary', errors: 2, rate: 0.1 }
        ]
      }
    };

    // Adjust data based on date range
    if (range === '1d') {
      analytics.overview.totalUsers = Math.floor(analytics.overview.totalUsers * 0.1);
      analytics.overview.activeUsers = Math.floor(analytics.overview.activeUsers * 0.1);
      analytics.overview.pageViews = Math.floor(analytics.overview.pageViews * 0.1);
    } else if (range === '30d') {
      analytics.overview.totalUsers = Math.floor(analytics.overview.totalUsers * 4);
      analytics.overview.activeUsers = Math.floor(analytics.overview.activeUsers * 4);
      analytics.overview.pageViews = Math.floor(analytics.overview.pageViews * 4);
    } else if (range === '90d') {
      analytics.overview.totalUsers = Math.floor(analytics.overview.totalUsers * 12);
      analytics.overview.activeUsers = Math.floor(analytics.overview.activeUsers * 12);
      analytics.overview.pageViews = Math.floor(analytics.overview.pageViews * 12);
    }

    return NextResponse.json({
      success: true,
      analytics,
      range
    });
    
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
