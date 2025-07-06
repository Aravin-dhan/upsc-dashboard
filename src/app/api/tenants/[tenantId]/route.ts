import { NextRequest, NextResponse } from 'next/server';
import { TenantDatabase, UserDatabase } from '@/lib/database';
import { getSession, hasPermission, hasMultiTenantAccess } from '@/lib/auth';

export const runtime = 'nodejs';

// GET /api/tenants/[tenantId] - Get specific tenant details
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { tenantId } = params;

    // Check if user has access to this tenant
    if (!hasMultiTenantAccess(session.user, tenantId)) {
      return NextResponse.json(
        { error: 'Access denied to this organization' },
        { status: 403 }
      );
    }

    const tenant = await TenantDatabase.findById(tenantId);
    if (!tenant) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Get tenant statistics
    const userStats = await UserDatabase.getUserStats(tenantId);

    return NextResponse.json({
      success: true,
      tenant,
      stats: userStats
    });

  } catch (error) {
    console.error('Get tenant error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/tenants/[tenantId] - Update tenant
export async function PUT(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { tenantId } = params;

    // Check if user has access to this tenant
    if (!hasMultiTenantAccess(session.user, tenantId)) {
      return NextResponse.json(
        { error: 'Access denied to this organization' },
        { status: 403 }
      );
    }

    const tenant = await TenantDatabase.findById(tenantId);
    if (!tenant) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Check if user can modify this tenant (owner, admin, or global admin)
    const canModify = session.user.role === 'admin' || 
                     tenant.ownerId === session.user.id ||
                     session.user.tenantRole === 'admin';

    if (!canModify) {
      return NextResponse.json(
        { error: 'Insufficient permissions to modify this organization' },
        { status: 403 }
      );
    }

    const updates = await request.json();
    
    // Prevent changing critical fields
    delete updates.id;
    delete updates.ownerId;
    delete updates.createdAt;

    const updatedTenant = await TenantDatabase.updateTenant(tenantId, updates);

    return NextResponse.json({
      success: true,
      tenant: updatedTenant,
      message: 'Organization updated successfully'
    });

  } catch (error) {
    console.error('Update tenant error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/tenants/[tenantId] - Delete tenant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { tenantId } = params;

    if (tenantId === 'default') {
      return NextResponse.json(
        { error: 'Cannot delete default organization' },
        { status: 400 }
      );
    }

    const tenant = await TenantDatabase.findById(tenantId);
    if (!tenant) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Only tenant owner or global admin can delete
    const canDelete = session.user.role === 'admin' || 
                     tenant.ownerId === session.user.id;

    if (!canDelete) {
      return NextResponse.json(
        { error: 'Only organization owner or admin can delete' },
        { status: 403 }
      );
    }

    const deleted = await TenantDatabase.deleteTenant(tenantId);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete organization' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Organization deleted successfully'
    });

  } catch (error) {
    console.error('Delete tenant error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
