import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/auth/rbac';
import EmailSubscriptionService from '@/lib/services/emailSubscriptionService';

export const runtime = 'nodejs';

const emailSubscriptionService = EmailSubscriptionService.getInstance();

// GET /api/admin/email-subscriptions/analytics - Get email subscription analytics (admin only)
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

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let dateRange;
    if (startDate && endDate) {
      dateRange = { start: startDate, end: endDate };
    }

    const analytics = await emailSubscriptionService.getSubscriptionAnalytics(dateRange);

    // Additional computed metrics
    const computedMetrics = {
      conversionRate: analytics.totalSubscribers > 0 ? 
        (analytics.activeSubscribers / analytics.totalSubscribers) * 100 : 0,
      churnRate: analytics.totalSubscribers > 0 ? 
        (analytics.unsubscribedCount / analytics.totalSubscribers) * 100 : 0,
      bounceRate: analytics.totalSubscribers > 0 ? 
        (analytics.bouncedCount / analytics.totalSubscribers) * 100 : 0,
      healthScore: calculateHealthScore(analytics)
    };

    // Subscription trends (last 30 days)
    const subscribers = await emailSubscriptionService.getAllSubscribers();
    const trends = calculateSubscriptionTrends(subscribers);

    return NextResponse.json({
      success: true,
      analytics: {
        ...analytics,
        computedMetrics,
        trends
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get email subscription analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateHealthScore(analytics: any): number {
  // Health score based on various factors (0-100)
  let score = 100;
  
  // Penalize high unsubscribe rate
  const unsubscribeRate = analytics.totalSubscribers > 0 ? 
    (analytics.unsubscribedCount / analytics.totalSubscribers) * 100 : 0;
  if (unsubscribeRate > 10) score -= 20;
  else if (unsubscribeRate > 5) score -= 10;
  
  // Penalize high bounce rate
  const bounceRate = analytics.totalSubscribers > 0 ? 
    (analytics.bouncedCount / analytics.totalSubscribers) * 100 : 0;
  if (bounceRate > 5) score -= 15;
  else if (bounceRate > 2) score -= 8;
  
  // Reward good engagement
  if (analytics.engagementMetrics.averageOpenRate > 25) score += 10;
  if (analytics.engagementMetrics.averageClickRate > 5) score += 10;
  
  // Reward growth
  if (analytics.growthRate.monthly > 50) score += 15;
  else if (analytics.growthRate.monthly > 20) score += 10;
  else if (analytics.growthRate.monthly > 10) score += 5;
  
  return Math.max(0, Math.min(100, score));
}

function calculateSubscriptionTrends(subscribers: any[]): any {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Daily subscriptions for the last 30 days
  const dailyData = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    const daySubscriptions = subscribers.filter(s => {
      const subDate = new Date(s.subscribedAt);
      return subDate.toISOString().split('T')[0] === dateStr;
    }).length;
    
    const dayUnsubscriptions = subscribers.filter(s => {
      if (!s.unsubscribedAt) return false;
      const unsubDate = new Date(s.unsubscribedAt);
      return unsubDate.toISOString().split('T')[0] === dateStr;
    }).length;
    
    dailyData.push({
      date: dateStr,
      subscriptions: daySubscriptions,
      unsubscriptions: dayUnsubscriptions,
      net: daySubscriptions - dayUnsubscriptions
    });
  }
  
  // Weekly aggregation
  const weeklyData = [];
  for (let i = 0; i < 4; i++) {
    const weekStart = i * 7;
    const weekEnd = weekStart + 7;
    const weekData = dailyData.slice(weekStart, weekEnd);
    
    const weekSubscriptions = weekData.reduce((sum, day) => sum + day.subscriptions, 0);
    const weekUnsubscriptions = weekData.reduce((sum, day) => sum + day.unsubscriptions, 0);
    
    weeklyData.push({
      week: `Week ${4 - i}`,
      subscriptions: weekSubscriptions,
      unsubscriptions: weekUnsubscriptions,
      net: weekSubscriptions - weekUnsubscriptions
    });
  }
  
  return {
    daily: dailyData,
    weekly: weeklyData.reverse()
  };
}
