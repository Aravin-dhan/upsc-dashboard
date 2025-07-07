import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { hasPermission } from '@/lib/auth/rbac';
import EmailSubscriptionService from '@/lib/services/emailSubscriptionService';

export const runtime = 'nodejs';

const emailSubscriptionService = EmailSubscriptionService.getInstance();

// GET /api/admin/email-subscriptions/export - Export subscribers to CSV (admin only)
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
    const format = searchParams.get('format') || 'csv';
    const status = searchParams.get('status');
    const subscriptionType = searchParams.get('subscriptionType');
    const source = searchParams.get('source');

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

    if (format === 'csv') {
      // Generate CSV content
      const headers = [
        'Email',
        'Name',
        'Subscription Type',
        'Status',
        'Source',
        'Subscribed At',
        'Unsubscribed At',
        'Frequency',
        'Topics',
        'Format',
        'UTM Source',
        'UTM Medium',
        'UTM Campaign',
        'IP Address',
        'User Agent',
        'Referrer'
      ].join(',');

      const rows = subscribers.map(subscriber => [
        subscriber.email,
        subscriber.name || '',
        subscriber.subscriptionType,
        subscriber.status,
        subscriber.source,
        subscriber.subscribedAt,
        subscriber.unsubscribedAt || '',
        subscriber.preferences.frequency,
        subscriber.preferences.topics.join(';'),
        subscriber.preferences.format,
        subscriber.metadata.utmSource || '',
        subscriber.metadata.utmMedium || '',
        subscriber.metadata.utmCampaign || '',
        subscriber.metadata.ipAddress || '',
        subscriber.metadata.userAgent || '',
        subscriber.metadata.referrer || ''
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));

      const csvContent = [headers, ...rows].join('\n');

      // Return CSV file
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="email-subscribers-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    if (format === 'json') {
      // Return JSON format
      return NextResponse.json({
        success: true,
        data: subscribers,
        exportedAt: new Date().toISOString(),
        totalRecords: subscribers.length,
        filters: {
          status,
          subscriptionType,
          source
        }
      });
    }

    if (format === 'google-sheets') {
      // Generate Google Sheets compatible format
      const sheetsData = {
        values: [
          [
            'Email',
            'Name',
            'Subscription Type',
            'Status',
            'Source',
            'Subscribed At',
            'Unsubscribed At',
            'Frequency',
            'Topics',
            'Format',
            'UTM Source',
            'UTM Medium',
            'UTM Campaign'
          ],
          ...subscribers.map(subscriber => [
            subscriber.email,
            subscriber.name || '',
            subscriber.subscriptionType,
            subscriber.status,
            subscriber.source,
            subscriber.subscribedAt,
            subscriber.unsubscribedAt || '',
            subscriber.preferences.frequency,
            subscriber.preferences.topics.join(';'),
            subscriber.preferences.format,
            subscriber.metadata.utmSource || '',
            subscriber.metadata.utmMedium || '',
            subscriber.metadata.utmCampaign || ''
          ])
        ]
      };

      return NextResponse.json({
        success: true,
        googleSheetsData: sheetsData,
        instructions: {
          step1: 'Copy the googleSheetsData.values array',
          step2: 'Open Google Sheets and create a new spreadsheet',
          step3: 'Select cell A1 and paste the data',
          step4: 'Use Data > Split text to columns if needed'
        },
        exportedAt: new Date().toISOString(),
        totalRecords: subscribers.length
      });
    }

    return NextResponse.json(
      { error: 'Invalid format. Supported formats: csv, json, google-sheets' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Export subscribers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
