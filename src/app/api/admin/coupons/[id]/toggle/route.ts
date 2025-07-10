import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { UserDatabase } from '@/lib/database';

export const runtime = 'nodejs';

// PATCH /api/admin/coupons/[id]/toggle - Toggle coupon active status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request);
    
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const couponId = params.id;
    if (!couponId) {
      return NextResponse.json(
        { error: 'Coupon ID is required' },
        { status: 400 }
      );
    }

    const adminUser = await UserDatabase.findById(session.user.id);
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      );
    }

    const existingCoupons = adminUser.preferences?.coupons || [];
    const couponIndex = existingCoupons.findIndex((coupon: any) => coupon.id === couponId);

    if (couponIndex === -1) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    // Toggle the active status
    const updatedCoupon = {
      ...existingCoupons[couponIndex],
      isActive: !existingCoupons[couponIndex].isActive,
      updatedAt: new Date().toISOString()
    };

    const updatedCoupons = [...existingCoupons];
    updatedCoupons[couponIndex] = updatedCoupon;

    const updatedUser = await UserDatabase.updateUser(session.user.id, {
      preferences: {
        ...adminUser.preferences,
        coupons: updatedCoupons,
        updatedAt: new Date().toISOString()
      }
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to toggle coupon status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Coupon ${updatedCoupon.isActive ? 'activated' : 'deactivated'} successfully`,
      coupon: updatedCoupon
    });

  } catch (error) {
    console.error('Toggle coupon status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
