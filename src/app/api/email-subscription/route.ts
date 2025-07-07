import { NextRequest, NextResponse } from 'next/server';
import EmailSubscriptionService from '@/lib/services/emailSubscriptionService';
import { validateInput } from '@/lib/validation';

export const runtime = 'nodejs';

const emailSubscriptionService = EmailSubscriptionService.getInstance();

// POST /api/email-subscription - Subscribe to email list
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateInput(body, {
      email: { required: true, type: 'email' },
      subscriptionType: { required: true, type: 'string' },
      source: { required: true, type: 'string' },
      name: { required: false, type: 'string' },
      preferences: { required: false, type: 'object' },
      metadata: { required: false, type: 'object' }
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      );
    }

    const { email, subscriptionType, source, name, preferences, metadata } = body;

    // Validate subscription type
    const validTypes = ['newsletter', 'updates', 'current-affairs', 'press', 'status'];
    if (!validTypes.includes(subscriptionType)) {
      return NextResponse.json(
        { error: 'Invalid subscription type' },
        { status: 400 }
      );
    }

    // Default preferences
    const defaultPreferences = {
      frequency: 'weekly',
      topics: [],
      format: 'html'
    };

    // Get client metadata
    const clientMetadata = {
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      referrer: request.headers.get('referer') || 'direct',
      ...metadata
    };

    const subscriber = await emailSubscriptionService.addSubscriber({
      email,
      name,
      subscriptionType,
      source,
      status: 'active',
      preferences: { ...defaultPreferences, ...preferences },
      metadata: clientMetadata
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to email list',
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        subscriptionType: subscriber.subscriptionType,
        subscribedAt: subscriber.subscribedAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Email subscription error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Email already subscribed') {
        return NextResponse.json({
          error: 'This email is already subscribed to our list'
        }, { status: 409 });
      }
      
      return NextResponse.json({
        error: error.message
      }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/email-subscription - Get subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const subscribers = await emailSubscriptionService.getAllSubscribers();
    const subscriber = subscribers.find(s => s.email === email);

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Email not found in subscription list' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        subscriptionType: subscriber.subscriptionType,
        status: subscriber.status,
        subscribedAt: subscriber.subscribedAt,
        preferences: subscriber.preferences
      }
    });

  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/email-subscription - Unsubscribe from email list
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const success = await emailSubscriptionService.unsubscribeEmail(email);

    if (!success) {
      return NextResponse.json(
        { error: 'Email not found in subscription list' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from email list'
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/email-subscription - Update subscription preferences
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateInput(body, {
      email: { required: true, type: 'email' },
      preferences: { required: true, type: 'object' }
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      );
    }

    const { email, preferences } = body;

    const success = await emailSubscriptionService.updateSubscriberPreferences(email, preferences);

    if (!success) {
      return NextResponse.json(
        { error: 'Email not found in subscription list' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription preferences updated successfully'
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
