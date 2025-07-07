import { NextRequest, NextResponse } from 'next/server';
import { analyticsService } from '@/lib/services/analyticsService';

export const runtime = 'nodejs';

// PATCH: Update page view metrics
export async function PATCH(request: NextRequest) {
  try {
    const { pageViewId, timeOnPage, interactions, scrollDepth } = await request.json();
    
    if (!pageViewId) {
      return NextResponse.json(
        { error: 'Page view ID required' },
        { status: 400 }
      );
    }

    await analyticsService.updatePageView(pageViewId, {
      timeOnPage,
      interactions,
      scrollDepth
    });

    return NextResponse.json({
      success: true
    });
    
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Update page view error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
