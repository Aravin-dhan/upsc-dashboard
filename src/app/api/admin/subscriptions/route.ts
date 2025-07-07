import { NextRequest, NextResponse } from 'next/server';
import { getSession, hasPermission } from '@/lib/auth';
import { SubscriptionService } from '@/lib/services/subscriptionService';

export const runtime = 'nodejs';

const subscriptionService = SubscriptionService.getInstance();

// GET /api/admin/subscriptions - Get all subscriptions (admin only)
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
    const status = searchParams.get('status');
    const planType = searchParams.get('planType');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let subscriptions = await subscriptionService.getAllSubscriptions();

    // Apply filters
    if (status) {
      subscriptions = subscriptions.filter(sub => sub.status === status);
    }

    if (planType) {
      subscriptions = subscriptions.filter(sub => sub.planType === planType);
    }

    // Sort by creation date (newest first)
    subscriptions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply pagination
    const total = subscriptions.length;
    const paginatedSubscriptions = subscriptions.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      subscriptions: paginatedSubscriptions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
    
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/subscriptions - Create subscription for user (admin only)
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
    
    if (!hasPermission(session.user.role, 'admin')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { userId, planType, couponCode, discountApplied } = await request.json();

    // Validate input
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!planType || !['trial', 'pro'].includes(planType)) {
      return NextResponse.json(
        { error: 'Valid plan type is required (trial, pro)' },
        { status: 400 }
      );
    }

    const subscription = await subscriptionService.createSubscription(
      userId,
      planType,
      couponCode,
      discountApplied
    );

    return NextResponse.json({
      success: true,
      subscription,
      message: 'Subscription created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create subscription error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: error.message 
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
