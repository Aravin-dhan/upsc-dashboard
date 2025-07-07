import { NextRequest, NextResponse } from 'next/server';
import { getSession, hasPermission } from '@/lib/auth';

export const runtime = 'nodejs';

// Mock coupon data (replace with actual database)
const mockCoupons = [
  {
    id: '1',
    code: 'WELCOME20',
    description: 'Welcome discount for new users',
    type: 'percentage',
    value: 20,
    minAmount: 100,
    maxDiscount: 50,
    usageLimit: 100,
    usedCount: 23,
    isActive: true,
    validFrom: '2024-01-01T00:00:00Z',
    validUntil: '2024-12-31T23:59:59Z',
    createdBy: 'Admin User',
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    code: 'STUDENT50',
    description: 'Special discount for students',
    type: 'fixed',
    value: 50,
    minAmount: 200,
    usageLimit: 50,
    usedCount: 12,
    isActive: true,
    validFrom: '2024-01-15T00:00:00Z',
    validUntil: '2024-06-30T23:59:59Z',
    createdBy: 'Admin User',
    createdAt: '2024-01-15T14:30:00Z'
  },
  {
    id: '3',
    code: 'EARLYBIRD',
    description: 'Early bird special offer',
    type: 'percentage',
    value: 30,
    minAmount: 150,
    maxDiscount: 100,
    usageLimit: 25,
    usedCount: 25,
    isActive: false,
    validFrom: '2024-01-01T00:00:00Z',
    validUntil: '2024-01-31T23:59:59Z',
    createdBy: 'Marketing Team',
    createdAt: '2023-12-20T09:15:00Z'
  },
  {
    id: '4',
    code: 'FLASH25',
    description: 'Flash sale discount',
    type: 'percentage',
    value: 25,
    minAmount: 100,
    maxDiscount: 75,
    usageLimit: 200,
    usedCount: 156,
    isActive: true,
    validFrom: '2024-01-10T00:00:00Z',
    validUntil: '2024-02-10T23:59:59Z',
    createdBy: 'Sales Team',
    createdAt: '2024-01-08T16:45:00Z'
  },
  {
    id: '5',
    code: 'PREMIUM100',
    description: 'Premium user exclusive discount',
    type: 'fixed',
    value: 100,
    minAmount: 500,
    usageLimit: 10,
    usedCount: 3,
    isActive: true,
    validFrom: '2024-01-01T00:00:00Z',
    validUntil: '2024-03-31T23:59:59Z',
    createdBy: 'Admin User',
    createdAt: '2024-01-01T12:00:00Z'
  }
];

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

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    let filteredCoupons = [...mockCoupons];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCoupons = filteredCoupons.filter(coupon => 
        coupon.code.toLowerCase().includes(searchLower) ||
        coupon.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (status === 'active') {
      filteredCoupons = filteredCoupons.filter(coupon => coupon.isActive);
    } else if (status === 'inactive') {
      filteredCoupons = filteredCoupons.filter(coupon => !coupon.isActive);
    } else if (status === 'expired') {
      const now = new Date();
      filteredCoupons = filteredCoupons.filter(coupon => new Date(coupon.validUntil) < now);
    }

    return NextResponse.json({
      success: true,
      coupons: filteredCoupons
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

    const { 
      code, 
      description, 
      type, 
      value, 
      minAmount, 
      maxDiscount, 
      usageLimit, 
      validFrom, 
      validUntil 
    } = await request.json();

    // Validate input
    if (!code || !description || !type || !value || !validFrom || !validUntil) {
      return NextResponse.json(
        { error: 'Code, description, type, value, validFrom, and validUntil are required' },
        { status: 400 }
      );
    }

    // Check if coupon code already exists
    const existingCoupon = mockCoupons.find(coupon => 
      coupon.code.toLowerCase() === code.toLowerCase()
    );
    
    if (existingCoupon) {
      return NextResponse.json(
        { error: 'Coupon code already exists' },
        { status: 400 }
      );
    }

    // Create new coupon
    const newCoupon = {
      id: Date.now().toString(),
      code: code.toUpperCase(),
      description,
      type,
      value: Number(value),
      minAmount: minAmount ? Number(minAmount) : 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : 0,
      usageLimit: usageLimit ? Number(usageLimit) : 0,
      usedCount: 0,
      isActive: true,
      validFrom,
      validUntil,
      createdBy: session.user.name,
      createdAt: new Date().toISOString()
    };

    // In a real implementation, save to database
    mockCoupons.push(newCoupon);

    return NextResponse.json({
      success: true,
      coupon: newCoupon,
      message: 'Coupon created successfully'
    });
    
  } catch (error) {
    console.error('Create coupon error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
