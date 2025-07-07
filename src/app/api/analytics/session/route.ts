import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { analyticsService } from '@/lib/services/analyticsService';

export const runtime = 'nodejs';

// POST: Start a new analytics session
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { userId, userAgent, referrer } = await request.json();
    
    // Validate input
    if (!userId || !userAgent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0] : 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    const sessionId = await analyticsService.startSession(
      userId,
      userAgent,
      ipAddress,
      referrer
    );

    return NextResponse.json({
      success: true,
      sessionId
    });
    
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Start session error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
