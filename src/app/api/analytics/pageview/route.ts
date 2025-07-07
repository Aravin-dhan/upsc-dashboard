import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { analyticsService } from '@/lib/services/analyticsService';

export const runtime = 'nodejs';

// POST: Track a page view
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { sessionId, userId, path, title, loadTime } = await request.json();
    
    // Validate input
    if (!sessionId || !userId || !path || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const pageViewId = await analyticsService.trackPageView(
      sessionId,
      userId,
      path,
      title,
      loadTime
    );

    return NextResponse.json({
      success: true,
      pageViewId
    });
    
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Track page view error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
