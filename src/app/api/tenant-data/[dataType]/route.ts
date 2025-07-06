import { NextRequest, NextResponse } from 'next/server';
import { TenantDataManager } from '@/lib/database';
import { getSession, validateTenantAccess } from '@/lib/auth';

export const runtime = 'nodejs';

// Allowed data types for tenant-scoped storage
const ALLOWED_DATA_TYPES = [
  'notes',
  'calendar-events',
  'study-sessions',
  'progress-tracking',
  'bookmarks',
  'practice-history',
  'learning-items',
  'user-preferences',
  'daily-goals',
  'revision-items',
  'current-affairs',
  'mindmaps',
  'flashcards'
];

// GET /api/tenant-data/[dataType] - Get tenant-scoped data
export async function GET(
  request: NextRequest,
  { params }: { params: { dataType: string } }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { dataType } = params;
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId') || session.user.tenantId;
    const userId = searchParams.get('userId');

    // Validate data type
    if (!ALLOWED_DATA_TYPES.includes(dataType)) {
      return NextResponse.json(
        { error: 'Invalid data type' },
        { status: 400 }
      );
    }

    // Validate tenant access
    if (!validateTenantAccess(tenantId, session.user.tenantId)) {
      return NextResponse.json(
        { error: 'Access denied to this organization data' },
        { status: 403 }
      );
    }

    let data;
    if (userId) {
      // Get data for specific user (admin/teacher access)
      if (session.user.role === 'student' && userId !== session.user.id) {
        return NextResponse.json(
          { error: 'Cannot access other users data' },
          { status: 403 }
        );
      }
      data = await TenantDataManager.getUserDataInTenant(tenantId, dataType, userId);
    } else {
      // Get user's own data
      data = await TenantDataManager.getUserDataInTenant(tenantId, dataType, session.user.id);
    }

    return NextResponse.json({
      success: true,
      data,
      tenantId,
      dataType
    });

  } catch (error) {
    console.error('Get tenant data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/tenant-data/[dataType] - Create new tenant-scoped data
export async function POST(
  request: NextRequest,
  { params }: { params: { dataType: string } }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { dataType } = params;
    const requestData = await request.json();
    const tenantId = requestData.tenantId || session.user.tenantId;

    // Validate data type
    if (!ALLOWED_DATA_TYPES.includes(dataType)) {
      return NextResponse.json(
        { error: 'Invalid data type' },
        { status: 400 }
      );
    }

    // Validate tenant access
    if (!validateTenantAccess(tenantId, session.user.tenantId)) {
      return NextResponse.json(
        { error: 'Access denied to this organization data' },
        { status: 403 }
      );
    }

    // Ensure data belongs to current user (unless admin)
    const itemData = {
      ...requestData,
      userId: session.user.id,
      tenantId,
      id: requestData.id || `${dataType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const createdItem = await TenantDataManager.addTenantData(tenantId, dataType, itemData);

    return NextResponse.json({
      success: true,
      data: createdItem,
      message: 'Data created successfully'
    });

  } catch (error) {
    console.error('Create tenant data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/tenant-data/[dataType] - Update tenant-scoped data
export async function PUT(
  request: NextRequest,
  { params }: { params: { dataType: string } }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { dataType } = params;
    const requestData = await request.json();
    const { id, tenantId: requestTenantId, ...updates } = requestData;
    const tenantId = requestTenantId || session.user.tenantId;

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    // Validate data type
    if (!ALLOWED_DATA_TYPES.includes(dataType)) {
      return NextResponse.json(
        { error: 'Invalid data type' },
        { status: 400 }
      );
    }

    // Validate tenant access
    if (!validateTenantAccess(tenantId, session.user.tenantId)) {
      return NextResponse.json(
        { error: 'Access denied to this organization data' },
        { status: 403 }
      );
    }

    // Add update timestamp
    updates.updatedAt = new Date().toISOString();

    const updatedItem = await TenantDataManager.updateTenantData(tenantId, dataType, id, updates);

    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedItem,
      message: 'Data updated successfully'
    });

  } catch (error) {
    console.error('Update tenant data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/tenant-data/[dataType] - Delete tenant-scoped data
export async function DELETE(
  request: NextRequest,
  { params }: { params: { dataType: string } }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { dataType } = params;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const tenantId = searchParams.get('tenantId') || session.user.tenantId;

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    // Validate data type
    if (!ALLOWED_DATA_TYPES.includes(dataType)) {
      return NextResponse.json(
        { error: 'Invalid data type' },
        { status: 400 }
      );
    }

    // Validate tenant access
    if (!validateTenantAccess(tenantId, session.user.tenantId)) {
      return NextResponse.json(
        { error: 'Access denied to this organization data' },
        { status: 403 }
      );
    }

    const deleted = await TenantDataManager.deleteTenantData(tenantId, dataType, id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Data deleted successfully'
    });

  } catch (error) {
    console.error('Delete tenant data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
