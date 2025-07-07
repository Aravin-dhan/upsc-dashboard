import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { SubscriptionService } from '@/lib/services/subscriptionService';

export const runtime = 'nodejs';

const subscriptionService = SubscriptionService.getInstance();

// GET /api/subscriptions - Get current user's subscription
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const subscription = await subscriptionService.getActiveUserSubscription(session.user.id);
    const planFeatures = await subscriptionService.getUserPlanFeatures(session.user.id);
    const planType = await subscriptionService.getUserPlanType(session.user.id);

    return NextResponse.json({
      success: true,
      subscription: subscription ? {
        id: subscription.id,
        planType: subscription.planType,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        trialEndDate: subscription.trialEndDate,
        nextBillingDate: subscription.nextBillingDate,
        couponUsed: subscription.couponUsed,
        discountApplied: subscription.discountApplied
      } : null,
      planType,
      features: planFeatures
    });
    
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/subscriptions - Create new subscription
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { planType, couponCode, discountApplied } = await request.json();

    // Validate input
    if (!planType || !['trial', 'pro'].includes(planType)) {
      return NextResponse.json(
        { error: 'Valid plan type is required (trial, pro)' },
        { status: 400 }
      );
    }

    const subscription = await subscriptionService.createSubscription(
      session.user.id,
      planType,
      couponCode,
      discountApplied
    );

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        planType: subscription.planType,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        trialEndDate: subscription.trialEndDate,
        nextBillingDate: subscription.nextBillingDate,
        couponUsed: subscription.couponUsed,
        discountApplied: subscription.discountApplied
      },
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
