import { NextRequest, NextResponse } from 'next/server';
import { getSession, hasPermission } from '@/lib/auth';
import { SubscriptionService } from '@/lib/services/subscriptionService';

export const runtime = 'nodejs';

const subscriptionService = SubscriptionService.getInstance();

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

    const stats = await subscriptionService.getSubscriptionStats();

    return NextResponse.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('Get subscription stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
