import { NextRequest, NextResponse } from 'next/server';
import { getSession, hasPermission } from '@/lib/auth';
import { UserDatabase } from '@/lib/database';

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

    // Get user statistics
    const users = await UserDatabase.getAllUsers();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const userStats = {
      total: users.length,
      active: users.filter(user => user.isActive).length,
      newThisMonth: users.filter(user => {
        const createdDate = new Date(user.createdAt);
        return createdDate.getMonth() === currentMonth && 
               createdDate.getFullYear() === currentYear;
      }).length,
      byRole: users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    // Mock content statistics (replace with actual CMS data)
    const contentStats = {
      totalPages: 45,
      publishedPages: 42,
      draftPages: 3,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    // Mock analytics data (replace with actual analytics service)
    const analyticsStats = {
      totalSessions: 12450,
      avgSessionDuration: 285, // seconds
      bounceRate: 32.5,
      topPages: [
        { path: '/dashboard', views: 3420 },
        { path: '/practice', views: 2890 },
        { path: '/current-affairs', views: 2156 },
        { path: '/maps', views: 1987 },
        { path: '/learning', views: 1654 }
      ]
    };

    // Mock system health data (replace with actual monitoring)
    const systemStats = {
      uptime: 2592000, // 30 days in seconds
      responseTime: 145,
      errorRate: 0.8,
      lastBackup: new Date(Date.now() - 86400000).toISOString().split('T')[0] // Yesterday
    };

    // Mock subscription data (replace with actual payment service)
    const subscriptionStats = {
      total: users.filter(user => user.role !== 'admin').length,
      active: users.filter(user => user.isActive && user.role !== 'admin').length,
      revenue: 45600, // INR
      churnRate: 5.2
    };

    const stats = {
      users: userStats,
      content: contentStats,
      analytics: analyticsStats,
      system: systemStats,
      subscriptions: subscriptionStats
    };

    return NextResponse.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('Get admin dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
