import { promises as fs } from 'fs';
import path from 'path';

export interface EmailSubscriber {
  id: string;
  email: string;
  name?: string;
  subscriptionType: 'newsletter' | 'updates' | 'current-affairs' | 'press' | 'status';
  status: 'active' | 'unsubscribed' | 'bounced';
  source: string; // Which page/form they subscribed from
  subscribedAt: string;
  unsubscribedAt?: string;
  preferences: {
    frequency: 'daily' | 'weekly' | 'monthly';
    topics: string[];
    format: 'html' | 'text';
  };
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'newsletter' | 'announcement' | 'current-affairs' | 'promotional';
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  scheduledAt?: string;
  sentAt?: string;
  targetAudience: {
    subscriptionTypes: string[];
    preferences?: Partial<EmailSubscriber['preferences']>;
    tags?: string[];
  };
  analytics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionAnalytics {
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribedCount: number;
  bouncedCount: number;
  subscriptionsByType: Record<string, number>;
  subscriptionsBySource: Record<string, number>;
  growthRate: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  engagementMetrics: {
    averageOpenRate: number;
    averageClickRate: number;
    unsubscribeRate: number;
  };
  recentSubscribers: EmailSubscriber[];
  topSources: Array<{ source: string; count: number }>;
}

class EmailSubscriptionService {
  private static instance: EmailSubscriptionService;
  private dataDir: string;
  private subscribersFile: string;
  private campaignsFile: string;

  private constructor() {
    // Use /tmp directory in Vercel serverless environment
    this.dataDir = process.env.VERCEL ? '/tmp/data' : path.join(process.cwd(), 'data');
    this.subscribersFile = path.join(this.dataDir, 'email-subscribers.json');
    this.campaignsFile = path.join(this.dataDir, 'email-campaigns.json');
    this.ensureDataDirectory();
  }

  public static getInstance(): EmailSubscriptionService {
    if (!EmailSubscriptionService.instance) {
      EmailSubscriptionService.instance = new EmailSubscriptionService();
    }
    return EmailSubscriptionService.instance;
  }

  private async ensureDataDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      
      // Initialize files if they don't exist
      try {
        await fs.access(this.subscribersFile);
      } catch {
        await fs.writeFile(this.subscribersFile, JSON.stringify([], null, 2));
      }

      try {
        await fs.access(this.campaignsFile);
      } catch {
        await fs.writeFile(this.campaignsFile, JSON.stringify([], null, 2));
      }
    } catch (error) {
      console.error('Error ensuring data directory:', error);
    }
  }

  // Subscriber Management
  async getAllSubscribers(): Promise<EmailSubscriber[]> {
    try {
      await this.ensureDataDirectory();
      const data = await fs.readFile(this.subscribersFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading subscribers:', error);
      return [];
    }
  }

  async addSubscriber(subscriberData: Omit<EmailSubscriber, 'id' | 'subscribedAt'>): Promise<EmailSubscriber> {
    try {
      const subscribers = await this.getAllSubscribers();
      
      // Check if email already exists
      const existingSubscriber = subscribers.find(s => s.email === subscriberData.email);
      if (existingSubscriber) {
        if (existingSubscriber.status === 'unsubscribed') {
          // Reactivate subscription
          existingSubscriber.status = 'active';
          existingSubscriber.subscribedAt = new Date().toISOString();
          existingSubscriber.unsubscribedAt = undefined;
          existingSubscriber.subscriptionType = subscriberData.subscriptionType;
          existingSubscriber.source = subscriberData.source;
          existingSubscriber.preferences = { ...existingSubscriber.preferences, ...subscriberData.preferences };
          
          await this.saveSubscribers(subscribers);
          return existingSubscriber;
        } else {
          throw new Error('Email already subscribed');
        }
      }

      const newSubscriber: EmailSubscriber = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...subscriberData,
        subscribedAt: new Date().toISOString(),
        status: 'active'
      };

      subscribers.push(newSubscriber);
      await this.saveSubscribers(subscribers);
      
      // Export to Google Sheets (if configured)
      await this.exportToGoogleSheets(newSubscriber);
      
      return newSubscriber;
    } catch (error) {
      console.error('Error adding subscriber:', error);
      throw error;
    }
  }

  async unsubscribeEmail(email: string): Promise<boolean> {
    try {
      const subscribers = await this.getAllSubscribers();
      const subscriber = subscribers.find(s => s.email === email);
      
      if (!subscriber) {
        return false;
      }

      subscriber.status = 'unsubscribed';
      subscriber.unsubscribedAt = new Date().toISOString();
      
      await this.saveSubscribers(subscribers);
      return true;
    } catch (error) {
      console.error('Error unsubscribing email:', error);
      return false;
    }
  }

  async updateSubscriberPreferences(email: string, preferences: Partial<EmailSubscriber['preferences']>): Promise<boolean> {
    try {
      const subscribers = await this.getAllSubscribers();
      const subscriber = subscribers.find(s => s.email === email);
      
      if (!subscriber) {
        return false;
      }

      subscriber.preferences = { ...subscriber.preferences, ...preferences };
      
      await this.saveSubscribers(subscribers);
      return true;
    } catch (error) {
      console.error('Error updating subscriber preferences:', error);
      return false;
    }
  }

  private async saveSubscribers(subscribers: EmailSubscriber[]): Promise<void> {
    try {
      await this.ensureDataDirectory();
      await fs.writeFile(this.subscribersFile, JSON.stringify(subscribers, null, 2));
    } catch (error) {
      console.error('Error saving subscribers:', error);
      throw error;
    }
  }

  // Google Sheets Integration
  private async exportToGoogleSheets(subscriber: EmailSubscriber): Promise<void> {
    try {
      // This would integrate with Google Sheets API
      // For now, we'll create a CSV export functionality
      const csvData = this.formatSubscriberForCSV(subscriber);
      console.log('Subscriber data for Google Sheets export:', csvData);

      // In a real implementation, you would:
      // 1. Use Google Sheets API with service account credentials
      // 2. Append the subscriber data to a specific spreadsheet
      // 3. Handle authentication and error cases
    } catch (error) {
      console.error('Error exporting to Google Sheets:', error);
    }
  }

  async exportAllToCSV(): Promise<string> {
    try {
      const subscribers = await this.getAllSubscribers();
      const headers = [
        'Email',
        'Name',
        'Subscription Type',
        'Status',
        'Source',
        'Subscribed At',
        'Frequency',
        'Topics',
        'UTM Source',
        'UTM Medium',
        'UTM Campaign'
      ].join(',');

      const rows = subscribers.map(subscriber => this.formatSubscriberForCSV(subscriber));

      return [headers, ...rows].join('\n');
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  }

  private formatSubscriberForCSV(subscriber: EmailSubscriber): string {
    return [
      subscriber.email,
      subscriber.name || '',
      subscriber.subscriptionType,
      subscriber.status,
      subscriber.source,
      subscriber.subscribedAt,
      subscriber.preferences.frequency,
      subscriber.preferences.topics.join(';'),
      subscriber.metadata.utmSource || '',
      subscriber.metadata.utmMedium || '',
      subscriber.metadata.utmCampaign || ''
    ].join(',');
  }

  // Analytics
  async getSubscriptionAnalytics(dateRange?: { start: string; end: string }): Promise<SubscriptionAnalytics> {
    try {
      const subscribers = await this.getAllSubscribers();
      const campaigns = await this.getAllCampaigns();
      
      const activeSubscribers = subscribers.filter(s => s.status === 'active');
      const unsubscribedCount = subscribers.filter(s => s.status === 'unsubscribed').length;
      const bouncedCount = subscribers.filter(s => s.status === 'bounced').length;
      
      // Calculate subscription types
      const subscriptionsByType = activeSubscribers.reduce((acc, sub) => {
        acc[sub.subscriptionType] = (acc[sub.subscriptionType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Calculate sources
      const subscriptionsBySource = activeSubscribers.reduce((acc, sub) => {
        acc[sub.source] = (acc[sub.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Calculate growth rates (simplified)
      const now = new Date();
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const dailyGrowth = subscribers.filter(s => new Date(s.subscribedAt) > dayAgo).length;
      const weeklyGrowth = subscribers.filter(s => new Date(s.subscribedAt) > weekAgo).length;
      const monthlyGrowth = subscribers.filter(s => new Date(s.subscribedAt) > monthAgo).length;
      
      // Calculate engagement metrics from campaigns
      const sentCampaigns = campaigns.filter(c => c.status === 'sent');
      const totalSent = sentCampaigns.reduce((sum, c) => sum + c.analytics.sent, 0);
      const totalOpened = sentCampaigns.reduce((sum, c) => sum + c.analytics.opened, 0);
      const totalClicked = sentCampaigns.reduce((sum, c) => sum + c.analytics.clicked, 0);
      const totalUnsubscribed = sentCampaigns.reduce((sum, c) => sum + c.analytics.unsubscribed, 0);
      
      const averageOpenRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
      const averageClickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;
      const unsubscribeRate = totalSent > 0 ? (totalUnsubscribed / totalSent) * 100 : 0;
      
      // Recent subscribers
      const recentSubscribers = subscribers
        .filter(s => s.status === 'active')
        .sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime())
        .slice(0, 10);
      
      // Top sources
      const topSources = Object.entries(subscriptionsBySource)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      return {
        totalSubscribers: subscribers.length,
        activeSubscribers: activeSubscribers.length,
        unsubscribedCount,
        bouncedCount,
        subscriptionsByType,
        subscriptionsBySource,
        growthRate: {
          daily: dailyGrowth,
          weekly: weeklyGrowth,
          monthly: monthlyGrowth
        },
        engagementMetrics: {
          averageOpenRate,
          averageClickRate,
          unsubscribeRate
        },
        recentSubscribers,
        topSources
      };
    } catch (error) {
      console.error('Error getting subscription analytics:', error);
      throw error;
    }
  }

  // Campaign Management
  async getAllCampaigns(): Promise<EmailCampaign[]> {
    try {
      await this.ensureDataDirectory();
      const data = await fs.readFile(this.campaignsFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading campaigns:', error);
      return [];
    }
  }

  async createCampaign(campaignData: Omit<EmailCampaign, 'id' | 'createdAt' | 'updatedAt' | 'analytics'>): Promise<EmailCampaign> {
    try {
      const campaigns = await this.getAllCampaigns();
      
      const newCampaign: EmailCampaign = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...campaignData,
        analytics: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          bounced: 0,
          unsubscribed: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      campaigns.push(newCampaign);
      await this.saveCampaigns(campaigns);
      
      return newCampaign;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  private async saveCampaigns(campaigns: EmailCampaign[]): Promise<void> {
    try {
      await this.ensureDataDirectory();
      await fs.writeFile(this.campaignsFile, JSON.stringify(campaigns, null, 2));
    } catch (error) {
      console.error('Error saving campaigns:', error);
      throw error;
    }
  }
}

export default EmailSubscriptionService;
