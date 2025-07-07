import { NextRequest, NextResponse } from 'next/server';
import { getSession, hasPermission } from '@/lib/auth';
import { analyticsService } from '@/lib/services/analyticsService';

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

    // Get real-time metrics (last 5 minutes)
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - (5 * 60 * 1000));
    
    // Mock real-time data for now - in production, this would query recent analytics data
    const metrics = {
      activeUsers: Math.floor(Math.random() * 50) + 10,
      currentPageViews: Math.floor(Math.random() * 200) + 50,
      avgSessionDuration: Math.floor(Math.random() * 300) + 180, // 3-8 minutes
      topPages: [
        {
          path: '/dashboard',
          activeUsers: Math.floor(Math.random() * 15) + 5,
          views: Math.floor(Math.random() * 50) + 20
        },
        {
          path: '/practice',
          activeUsers: Math.floor(Math.random() * 12) + 3,
          views: Math.floor(Math.random() * 40) + 15
        },
        {
          path: '/current-affairs',
          activeUsers: Math.floor(Math.random() * 10) + 2,
          views: Math.floor(Math.random() * 35) + 10
        },
        {
          path: '/maps',
          activeUsers: Math.floor(Math.random() * 8) + 1,
          views: Math.floor(Math.random() * 25) + 8
        },
        {
          path: '/learning',
          activeUsers: Math.floor(Math.random() * 6) + 1,
          views: Math.floor(Math.random() * 20) + 5
        }
      ],
      recentEvents: [
        {
          id: `event_${Date.now()}_1`,
          userId: 'user_123',
          eventType: 'feature_use',
          page: '/dashboard',
          timestamp: new Date(now.getTime() - Math.random() * 300000).toISOString(),
          eventData: { feature: 'AI Assistant' }
        },
        {
          id: `event_${Date.now()}_2`,
          userId: 'user_456',
          eventType: 'ai_query',
          page: '/dashboard',
          timestamp: new Date(now.getTime() - Math.random() * 300000).toISOString(),
          eventData: { feature: 'AI Query', query: 'Current affairs question' }
        },
        {
          id: `event_${Date.now()}_3`,
          userId: 'user_789',
          eventType: 'search',
          page: '/practice',
          timestamp: new Date(now.getTime() - Math.random() * 300000).toISOString(),
          eventData: { feature: 'Practice Search', searchTerm: 'polity' }
        },
        {
          id: `event_${Date.now()}_4`,
          userId: 'user_101',
          eventType: 'form_submit',
          page: '/practice',
          timestamp: new Date(now.getTime() - Math.random() * 300000).toISOString(),
          eventData: { feature: 'Mock Test', formName: 'test_submission' }
        },
        {
          id: `event_${Date.now()}_5`,
          userId: 'user_202',
          eventType: 'feature_use',
          page: '/maps',
          timestamp: new Date(now.getTime() - Math.random() * 300000).toISOString(),
          eventData: { feature: 'Interactive Maps' }
        },
        {
          id: `event_${Date.now()}_6`,
          userId: 'user_303',
          eventType: 'download',
          page: '/learning',
          timestamp: new Date(now.getTime() - Math.random() * 300000).toISOString(),
          eventData: { feature: 'Study Material', fileName: 'history_notes.pdf' }
        },
        {
          id: `event_${Date.now()}_7`,
          userId: 'user_404',
          eventType: 'feature_use',
          page: '/current-affairs',
          timestamp: new Date(now.getTime() - Math.random() * 300000).toISOString(),
          eventData: { feature: 'Current Affairs' }
        },
        {
          id: `event_${Date.now()}_8`,
          userId: 'user_505',
          eventType: 'click',
          page: '/wellness',
          timestamp: new Date(now.getTime() - Math.random() * 300000).toISOString(),
          eventData: { feature: 'Wellness Tracker', action: 'meditation_start' }
        }
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      systemHealth: {
        status: Math.random() > 0.1 ? 'healthy' : Math.random() > 0.05 ? 'warning' : 'error',
        responseTime: Math.floor(Math.random() * 200) + 50, // 50-250ms
        errorRate: Math.random() * 2, // 0-2%
        uptime: 99.5 + Math.random() * 0.5 // 99.5-100%
      }
    };

    return NextResponse.json({
      success: true,
      metrics,
      timestamp: now.toISOString()
    });
    
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Get real-time analytics error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
