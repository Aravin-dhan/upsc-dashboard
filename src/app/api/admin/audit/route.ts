import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAuditEvents, AuditFilter } from '@/lib/auth/audit';
import { hasPermission } from '@/lib/auth/rbac';
import { RESOURCES, ACTIONS } from '@/lib/auth/rbac';

export async function GET(request: NextRequest) {
  try {
    // Get session and verify admin access
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if user has permission to view audit logs
    if (!hasPermission(session.user, RESOURCES.ANALYTICS, ACTIONS.VIEW)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const filter: AuditFilter = {
      userId: searchParams.get('userId') || undefined,
      tenantId: searchParams.get('tenantId') || undefined,
      action: searchParams.get('action') || undefined,
      resource: searchParams.get('resource') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      severity: searchParams.get('severity') || undefined,
      success: searchParams.get('success') ? searchParams.get('success') === 'true' : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    };

    // Get audit events
    const result = await getAuditEvents(filter);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching audit events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get session and verify admin access
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if user has permission to manage audit logs
    if (!hasPermission(session.user, RESOURCES.SYSTEM, ACTIONS.MANAGE)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { action, filters } = body;

    switch (action) {
      case 'export':
        // Export audit logs (implement based on requirements)
        const exportResult = await exportAuditLogs(filters);
        return NextResponse.json({
          success: true,
          data: exportResult
        });

      case 'cleanup':
        // Cleanup old audit logs (implement based on requirements)
        const cleanupResult = await cleanupAuditLogs(filters);
        return NextResponse.json({
          success: true,
          data: cleanupResult
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error processing audit action:', error);
    return NextResponse.json(
      { error: 'Failed to process audit action' },
      { status: 500 }
    );
  }
}

// Helper functions for audit log management
async function exportAuditLogs(filters: AuditFilter) {
  // Implementation for exporting audit logs
  // This could generate CSV, JSON, or other formats
  const events = await getAuditEvents(filters);
  
  return {
    format: 'json',
    filename: `audit-logs-${new Date().toISOString().split('T')[0]}.json`,
    data: events.events,
    total: events.total
  };
}

async function cleanupAuditLogs(filters: { olderThan?: string; severity?: string }) {
  // Implementation for cleaning up old audit logs
  // This would typically remove logs older than a certain date
  
  // For now, return a mock result
  return {
    deletedCount: 0,
    message: 'Audit log cleanup not implemented yet'
  };
}
