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

    // Mock content statistics (replace with actual database queries)
    const stats = {
      total: 45,
      published: 38,
      drafts: 5,
      archived: 2,
      byType: {
        page: 25,
        blog: 8,
        resource: 10,
        announcement: 2
      }
    };

    return NextResponse.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('Get content stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
