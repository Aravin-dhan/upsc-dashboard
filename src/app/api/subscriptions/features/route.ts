import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { SubscriptionService } from '@/lib/services/subscriptionService';
import { PlanFeatures } from '@/lib/types/coupon';

export const runtime = 'nodejs';

const subscriptionService = SubscriptionService.getInstance();

// GET /api/subscriptions/features - Get user's plan features and access
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const feature = searchParams.get('feature');

    if (feature) {
      // Check specific feature access
      const hasAccess = await subscriptionService.hasFeatureAccess(
        session.user.id, 
        feature as keyof PlanFeatures
      );
      
      return NextResponse.json({
        success: true,
        feature,
        hasAccess
      });
    } else {
      // Get all features
      const planFeatures = await subscriptionService.getUserPlanFeatures(session.user.id);
      const planType = await subscriptionService.getUserPlanType(session.user.id);
      
      return NextResponse.json({
        success: true,
        planType,
        features: planFeatures
      });
    }
    
  } catch (error) {
    console.error('Get features error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/subscriptions/features/check - Batch check multiple features
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { features } = await request.json();

    if (!features || !Array.isArray(features)) {
      return NextResponse.json(
        { error: 'Features array is required' },
        { status: 400 }
      );
    }

    const featureAccess: Record<string, boolean> = {};
    
    for (const feature of features) {
      try {
        featureAccess[feature] = await subscriptionService.hasFeatureAccess(
          session.user.id, 
          feature as keyof PlanFeatures
        );
      } catch (error) {
        console.error(`Error checking feature ${feature}:`, error);
        featureAccess[feature] = false;
      }
    }

    const planType = await subscriptionService.getUserPlanType(session.user.id);
    
    return NextResponse.json({
      success: true,
      planType,
      featureAccess
    });
    
  } catch (error) {
    console.error('Batch feature check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
