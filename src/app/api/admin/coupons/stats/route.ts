import { NextRequest, NextResponse } from 'next/server';
import { getSession, hasPermission } from '@/lib/auth';

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

    // Mock coupon statistics (replace with actual database queries)
    const now = new Date();
    
    const stats = {
      total: 15,
      active: 8,
      expired: 4,
      totalSavings: 12450, // Total amount saved by users using coupons
      totalUsage: 234 // Total number of times coupons have been used
    };

    return NextResponse.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('Get coupon stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
