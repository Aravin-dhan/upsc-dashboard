import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { analyticsService } from '@/lib/services/analyticsService';

export const runtime = 'nodejs';

// POST: Track a user event
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { userId, sessionId, eventType, eventData, page } = await request.json();
    
    // Validate input
    if (!userId || !sessionId || !eventType || !page) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate event type
    const validEventTypes = ['click', 'scroll', 'form_submit', 'search', 'download', 'ai_query', 'feature_use'];
    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    await analyticsService.trackEvent(
      userId,
      sessionId,
      eventType,
      eventData || {},
      page
    );

    return NextResponse.json({
      success: true
    });
    
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Track event error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
