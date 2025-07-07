import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/auth/rbac';
import EmailSubscriptionService from '@/lib/services/emailSubscriptionService';
import { validateInput } from '@/lib/validation';

export const runtime = 'nodejs';

const emailSubscriptionService = EmailSubscriptionService.getInstance();

// GET /api/admin/email-campaigns - Get all email campaigns (admin only)
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
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let campaigns = await emailSubscriptionService.getAllCampaigns();

    // Apply filters
    if (status) {
      campaigns = campaigns.filter(c => c.status === status);
    }
    
    if (type) {
      campaigns = campaigns.filter(c => c.type === type);
    }

    // Sort by most recent first
    campaigns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Pagination
    const total = campaigns.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCampaigns = campaigns.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      campaigns: paginatedCampaigns,
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
        type
      }
    });

  } catch (error) {
    console.error('Get email campaigns error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/email-campaigns - Create new email campaign (admin only)
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
    
    // Validate input
    const validation = validateInput(body, {
      name: { required: true, type: 'string' },
      subject: { required: true, type: 'string' },
      content: { required: true, type: 'string' },
      type: { required: true, type: 'string' },
      targetAudience: { required: true, type: 'object' },
      status: { required: false, type: 'string' },
      scheduledAt: { required: false, type: 'string' }
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.errors },
        { status: 400 }
      );
    }

    const { name, subject, content, type, targetAudience, status = 'draft', scheduledAt } = body;

    // Validate campaign type
    const validTypes = ['newsletter', 'announcement', 'current-affairs', 'promotional'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid campaign type' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['draft', 'scheduled', 'sent', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid campaign status' },
        { status: 400 }
      );
    }

    // Validate target audience
    if (!targetAudience.subscriptionTypes || !Array.isArray(targetAudience.subscriptionTypes)) {
      return NextResponse.json(
        { error: 'Target audience must include subscription types array' },
        { status: 400 }
      );
    }

    const campaign = await emailSubscriptionService.createCampaign({
      name,
      subject,
      content,
      type,
      status,
      scheduledAt,
      targetAudience
    });

    return NextResponse.json({
      success: true,
      message: 'Email campaign created successfully',
      campaign: {
        id: campaign.id,
        name: campaign.name,
        subject: campaign.subject,
        type: campaign.type,
        status: campaign.status,
        targetAudience: campaign.targetAudience,
        createdAt: campaign.createdAt,
        scheduledAt: campaign.scheduledAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create email campaign error:', error);
    
    if (error instanceof Error) {
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

// PATCH /api/admin/email-campaigns - Update campaign status (admin only)
export async function PATCH(request: NextRequest) {
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
    const { campaignId, status, analytics } = body;

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    const campaigns = await emailSubscriptionService.getAllCampaigns();
    const campaignIndex = campaigns.findIndex(c => c.id === campaignId);

    if (campaignIndex === -1) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    const campaign = campaigns[campaignIndex];

    // Update status if provided
    if (status) {
      const validStatuses = ['draft', 'scheduled', 'sent', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid campaign status' },
          { status: 400 }
        );
      }
      
      campaign.status = status;
      
      if (status === 'sent' && !campaign.sentAt) {
        campaign.sentAt = new Date().toISOString();
      }
    }

    // Update analytics if provided
    if (analytics) {
      campaign.analytics = { ...campaign.analytics, ...analytics };
    }

    campaign.updatedAt = new Date().toISOString();

    // Save updated campaigns (this would be implemented in the service)
    // For now, we'll simulate the update
    console.log('Campaign updated:', campaign);

    return NextResponse.json({
      success: true,
      message: 'Campaign updated successfully',
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        analytics: campaign.analytics,
        updatedAt: campaign.updatedAt
      }
    });

  } catch (error) {
    console.error('Update email campaign error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
