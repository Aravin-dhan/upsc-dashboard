import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { CouponService } from '@/lib/services/couponService';
import { PLAN_PRICING } from '@/lib/types/coupon';

export const runtime = 'nodejs';

const couponService = CouponService.getInstance();

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

    const { code, planType, billingCycle } = await request.json();

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

    // Validate coupon
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
        error: validationResult.error,
        isValid: false
      }, { status: 400 });
    }

    // Return validation result with pricing information
    return NextResponse.json({
      success: true,
      isValid: true,
      coupon: {
        code: validationResult.coupon!.code,
        description: validationResult.coupon!.description,
        type: validationResult.coupon!.type,
        value: validationResult.coupon!.value
      },
      pricing: {
        originalAmount,
        discountAmount: validationResult.discountAmount!,
        finalAmount: validationResult.finalAmount!,
        savings: validationResult.discountAmount!,
        currency: 'INR'
      },
      warnings: validationResult.warnings
    });
    
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for checking coupon existence (without full validation)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    const coupon = await couponService.getCouponByCode(code);
    
    if (!coupon) {
      return NextResponse.json({
        success: false,
        exists: false,
        error: 'Coupon code not found'
      }, { status: 404 });
    }

    // Check basic validity (active status and dates)
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    const isActive = coupon.isActive;
    const isInDateRange = now >= validFrom && now <= validUntil;
    const hasUsageLeft = !coupon.usageLimit || coupon.usedCount < coupon.usageLimit;

    return NextResponse.json({
      success: true,
      exists: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        isActive,
        isInDateRange,
        hasUsageLeft,
        validFrom: coupon.validFrom,
        validUntil: coupon.validUntil,
        usedCount: coupon.usedCount,
        usageLimit: coupon.usageLimit
      }
    });
    
  } catch (error) {
    console.error('Coupon check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
