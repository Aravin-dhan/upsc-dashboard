import { NextRequest, NextResponse } from 'next/server';
import { TenantDatabase } from '@/lib/database';
import { getSession, hasPermission, createDefaultTenant, generateTenantId } from '@/lib/auth';

export const runtime = 'nodejs';

// GET /api/tenants - Get tenants for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    let tenants;
    
    if (session.user.role === 'admin') {
      // Global admin can see all tenants
      tenants = await TenantDatabase.getAllTenants();
    } else {
      // Regular users see only their tenants
      tenants = await TenantDatabase.getTenantsForUser(session.user.id);
    }

    return NextResponse.json({
      success: true,
      tenants
    });

  } catch (error) {
    console.error('Get tenants error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/tenants - Create new tenant
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { name, displayName, organizationType, settings } = await request.json();

    // Validate input
    if (!name || !displayName) {
      return NextResponse.json(
        { error: 'Name and display name are required' },
        { status: 400 }
      );
    }

    // Check if user can create tenants (admin or if they don't have a tenant yet)
    if (session.user.role !== 'admin' && session.user.tenantId !== 'default') {
      return NextResponse.json(
        { error: 'You can only create one organization' },
        { status: 403 }
      );
    }

    try {
      // Create new tenant
      const newTenant = createDefaultTenant(
        session.user.id,
        displayName,
        organizationType || 'individual'
      );

      // Override name if provided
      newTenant.name = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      // Merge custom settings
      if (settings) {
        newTenant.settings = { ...newTenant.settings, ...settings };
      }

      const createdTenant = await TenantDatabase.createTenant(newTenant);

      return NextResponse.json({
        success: true,
        tenant: createdTenant,
        message: 'Tenant created successfully'
      });

    } catch (error: any) {
      if (error.message === 'Tenant name already exists') {
        return NextResponse.json(
          { error: 'Organization name already exists' },
          { status: 409 }
        );
      }
      throw error;
    }

  } catch (error) {
    console.error('Create tenant error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
