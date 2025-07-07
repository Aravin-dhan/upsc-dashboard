import { NextRequest, NextResponse } from 'next/server';
import { getSession, hasPermission } from '@/lib/auth';
import { CouponService } from '@/lib/services/couponService';
import { CouponFormData } from '@/lib/types/coupon';

export const runtime = 'nodejs';

const couponService = CouponService.getInstance();

// GET /api/admin/coupons/[id] - Get specific coupon
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const coupon = await couponService.getCouponById(params.id);
    
    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon
    });
    
  } catch (error) {
    console.error('Get coupon error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/coupons/[id] - Update specific coupon
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Prepare update data
    const updateData: Partial<CouponFormData> = {};
    
    if (body.code !== undefined) updateData.code = body.code;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.value !== undefined) updateData.value = parseFloat(body.value);
    if (body.minAmount !== undefined) updateData.minAmount = body.minAmount ? parseFloat(body.minAmount) : undefined;
    if (body.maxDiscount !== undefined) updateData.maxDiscount = body.maxDiscount ? parseFloat(body.maxDiscount) : undefined;
    if (body.usageLimit !== undefined) updateData.usageLimit = body.usageLimit ? parseInt(body.usageLimit) : undefined;
    if (body.userUsageLimit !== undefined) updateData.userUsageLimit = body.userUsageLimit ? parseInt(body.userUsageLimit) : undefined;
    if (body.validFrom !== undefined) updateData.validFrom = body.validFrom;
    if (body.validUntil !== undefined) updateData.validUntil = body.validUntil;
    if (body.eligibleRoles !== undefined) updateData.eligibleRoles = body.eligibleRoles;
    if (body.eligiblePlans !== undefined) updateData.eligiblePlans = body.eligiblePlans;
    if (body.metadata !== undefined) updateData.metadata = body.metadata;

    const updatedCoupon = await couponService.updateCoupon(params.id, updateData);

    return NextResponse.json({
      success: true,
      coupon: updatedCoupon,
      message: 'Coupon updated successfully'
    });
    
  } catch (error) {
    console.error('Update coupon error:', error);
    
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

// DELETE /api/admin/coupons/[id] - Delete specific coupon
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const deleted = await couponService.deleteCoupon(params.id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete coupon error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/coupons/[id] - Toggle coupon status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    if (body.action === 'toggle') {
      const updatedCoupon = await couponService.toggleCouponStatus(params.id);
      
      return NextResponse.json({
        success: true,
        coupon: updatedCoupon,
        message: `Coupon ${updatedCoupon.isActive ? 'activated' : 'deactivated'} successfully`
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Toggle coupon status error:', error);
    
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
