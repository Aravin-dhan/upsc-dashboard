import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { CouponService } from '@/lib/services/couponService';
import { SubscriptionService } from '@/lib/services/subscriptionService';
import { PLAN_PRICING } from '@/lib/types/coupon';

export const runtime = 'nodejs';

const couponService = CouponService.getInstance();
const subscriptionService = SubscriptionService.getInstance();

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

    const { code, planType, billingCycle, paymentMethod } = await request.json();

    // Validate input
    if (!code) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    if (!planType || !['pro'].includes(planType)) {
      return NextResponse.json(
        { error: 'Valid plan type is required (pro)' },
        { status: 400 }
      );
    }

    if (!billingCycle || !['monthly', 'yearly'].includes(billingCycle)) {
      return NextResponse.json(
        { error: 'Valid billing cycle is required (monthly, yearly)' },
        { status: 400 }
      );
    }

    // Get original amount based on plan and billing cycle
    const originalAmount = PLAN_PRICING[planType as keyof typeof PLAN_PRICING][billingCycle as keyof typeof PLAN_PRICING.pro];

    // Validate coupon first
    const validationResult = await couponService.validateCoupon(
      code,
      session.user.id,
      session.user.role,
      planType,
      originalAmount
    );

    if (!validationResult.isValid) {
      return NextResponse.json({
        success: false,
        error: validationResult.error
      }, { status: 400 });
    }

    const coupon = validationResult.coupon!;
    const discountAmount = validationResult.discountAmount!;
    const finalAmount = validationResult.finalAmount!;

    // Get client IP and user agent for tracking
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Record coupon usage
    const usage = await couponService.recordCouponUsage(
      coupon,
      session.user.id,
      session.user.email,
      discountAmount,
      originalAmount,
      finalAmount,
      planType,
      clientIP,
      userAgent
    );

    // Handle different coupon types
    let subscriptionResult;
    
    switch (coupon.type) {
      case 'trial_extension':
        // Extend existing trial or create new trial
        try {
          const currentSubscription = await subscriptionService.getActiveUserSubscription(session.user.id);
          if (currentSubscription && currentSubscription.planType === 'trial') {
            subscriptionResult = await subscriptionService.extendTrial(session.user.id, coupon.value);
          } else {
            // Create new trial subscription
            subscriptionResult = await subscriptionService.createSubscription(
              session.user.id,
              'trial',
              coupon.code,
              discountAmount
            );
          }
        } catch (error) {
          console.error('Trial extension error:', error);
          return NextResponse.json({
            success: false,
            error: 'Failed to extend trial period'
          }, { status: 500 });
        }
        break;

      case 'percentage':
      case 'fixed':
      case 'upgrade_promo':
        // Create or upgrade to pro subscription
        try {
          subscriptionResult = await subscriptionService.upgradePlan(
            session.user.id,
            'pro',
            coupon.code,
            discountAmount
          );
        } catch (error) {
          console.error('Subscription upgrade error:', error);
          return NextResponse.json({
            success: false,
            error: 'Failed to upgrade subscription'
          }, { status: 500 });
        }
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Unsupported coupon type'
        }, { status: 400 });
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Coupon redeemed successfully',
      redemption: {
        couponCode: coupon.code,
        discountAmount,
        originalAmount,
        finalAmount,
        savings: discountAmount,
        planType,
        billingCycle,
        redeemedAt: usage.usedAt
      },
      subscription: {
        id: subscriptionResult.id,
        planType: subscriptionResult.planType,
        status: subscriptionResult.status,
        startDate: subscriptionResult.startDate,
        endDate: subscriptionResult.endDate,
        trialEndDate: subscriptionResult.trialEndDate
      }
    });
    
  } catch (error) {
    console.error('Coupon redemption error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check redemption history for current user
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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get user's coupon usage history
    const usageHistory = await couponService.getCouponUsageHistory(undefined, session.user.id);
    
    // Apply pagination
    const total = usageHistory.length;
    const paginatedHistory = usageHistory.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      history: paginatedHistory.map(usage => ({
        id: usage.id,
        couponCode: usage.couponCode,
        discountAmount: usage.discountAmount,
        originalAmount: usage.originalAmount,
        finalAmount: usage.finalAmount,
        planType: usage.planType,
        usedAt: usage.usedAt
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
    
  } catch (error) {
    console.error('Get redemption history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
