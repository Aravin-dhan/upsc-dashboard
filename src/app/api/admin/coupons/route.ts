import { NextRequest, NextResponse } from 'next/server';
import { getSession, hasPermission } from '@/lib/auth';
import { CouponService } from '@/lib/services/couponService';
import { CouponFormData } from '@/lib/types/coupon';

export const runtime = 'nodejs';

const couponService = CouponService.getInstance();

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

    // Get query parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let coupons = await couponService.getAllCoupons();

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      coupons = coupons.filter(coupon =>
        coupon.code.toLowerCase().includes(searchLower) ||
        coupon.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (status === 'active') {
      coupons = await couponService.getActiveCoupons();
    } else if (status === 'expired') {
      coupons = await couponService.getExpiredCoupons();
    } else if (status === 'inactive') {
      coupons = coupons.filter(c => !c.isActive);
    }

    // Apply pagination
    const total = coupons.length;
    const paginatedCoupons = coupons.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      coupons: paginatedCoupons,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error('Get coupons error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['code', 'description', 'type', 'value', 'validFrom', 'validUntil'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({
          error: `Missing required field: ${field}`
        }, { status: 400 });
      }
    }

    const couponData: CouponFormData = {
      code: body.code,
      description: body.description,
      type: body.type,
      value: parseFloat(body.value),
      minAmount: body.minAmount ? parseFloat(body.minAmount) : undefined,
      maxDiscount: body.maxDiscount ? parseFloat(body.maxDiscount) : undefined,
      usageLimit: body.usageLimit ? parseInt(body.usageLimit) : undefined,
      userUsageLimit: body.userUsageLimit ? parseInt(body.userUsageLimit) : undefined,
      validFrom: body.validFrom,
      validUntil: body.validUntil,
      eligibleRoles: body.eligibleRoles,
      eligiblePlans: body.eligiblePlans,
      metadata: body.metadata
    };

    const newCoupon = await couponService.createCoupon(couponData, session.user.id);

    return NextResponse.json({
      success: true,
      coupon: newCoupon,
      message: 'Coupon created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Create coupon error:', error);

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
