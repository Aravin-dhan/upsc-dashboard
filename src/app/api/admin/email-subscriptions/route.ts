import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/auth/rbac';
import EmailSubscriptionService from '@/lib/services/emailSubscriptionService';

export const runtime = 'nodejs';

const emailSubscriptionService = EmailSubscriptionService.getInstance();

// GET /api/admin/email-subscriptions - Get all email subscribers (admin only)
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const subscriptionType = searchParams.get('subscriptionType');
    const source = searchParams.get('source');
    const search = searchParams.get('search');

    let subscribers = await emailSubscriptionService.getAllSubscribers();

    // Apply filters
    if (status) {
      subscribers = subscribers.filter(s => s.status === status);
    }
    
    if (subscriptionType) {
      subscribers = subscribers.filter(s => s.subscriptionType === subscriptionType);
    }
    
    if (source) {
      subscribers = subscribers.filter(s => s.source === source);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      subscribers = subscribers.filter(s => 
        s.email.toLowerCase().includes(searchLower) ||
        (s.name && s.name.toLowerCase().includes(searchLower))
      );
    }

    // Sort by most recent first
    subscribers.sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime());

    // Pagination
    const total = subscribers.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSubscribers = subscribers.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      subscribers: paginatedSubscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: endIndex < total,
        hasPrev: page > 1
      },
      filters: {
        status,
        subscriptionType,
        source,
        search
      }
    });

  } catch (error) {
    console.error('Get email subscriptions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/email-subscriptions - Manually add subscriber (admin only)
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { email, name, subscriptionType, preferences, metadata } = body;

    // Validate required fields
    if (!email || !subscriptionType) {
      return NextResponse.json(
        { error: 'Email and subscription type are required' },
        { status: 400 }
      );
    }

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

    const subscriber = await emailSubscriptionService.addSubscriber({
      email,
      name,
      subscriptionType,
      source: 'admin-manual',
      status: 'active',
      preferences: { ...defaultPreferences, ...preferences },
      metadata: {
        addedBy: session.user.email,
        addedByAdmin: true,
        ...metadata
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Subscriber added successfully',
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        name: subscriber.name,
        subscriptionType: subscriber.subscriptionType,
        status: subscriber.status,
        subscribedAt: subscriber.subscribedAt,
        preferences: subscriber.preferences
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Add subscriber error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Email already subscribed') {
        return NextResponse.json({
          error: 'This email is already subscribed'
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

// DELETE /api/admin/email-subscriptions - Bulk delete subscribers (admin only)
export async function DELETE(request: NextRequest) {
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

    const body = await request.json();
    const { emails } = body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Array of emails is required' },
        { status: 400 }
      );
    }

    let successCount = 0;
    let errorCount = 0;
    const results = [];

    for (const email of emails) {
      try {
        const success = await emailSubscriptionService.unsubscribeEmail(email);
        if (success) {
          successCount++;
          results.push({ email, status: 'unsubscribed' });
        } else {
          errorCount++;
          results.push({ email, status: 'not_found' });
        }
      } catch (error) {
        errorCount++;
        results.push({ email, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${emails.length} emails: ${successCount} unsubscribed, ${errorCount} errors`,
      results,
      summary: {
        total: emails.length,
        successful: successCount,
        errors: errorCount
      }
    });

  } catch (error) {
    console.error('Bulk unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
