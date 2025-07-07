import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/lib/services/analyticsService';

export const runtime = 'nodejs';

// POST: End an analytics session
export async function POST(request: NextRequest) {
  try {
    const { sessionId, exitPage } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    await analyticsService.endSession(sessionId, exitPage);

    return NextResponse.json({
      success: true
    });
    
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('End session error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
