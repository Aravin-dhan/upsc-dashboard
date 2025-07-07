import { getDataPath, readJSONFile, writeJSONFile } from '@/lib/utils/fileSystem';

export interface UserSession {
  id: string;
  userId: string;
  sessionStart: string;
  sessionEnd?: string;
  duration?: number;
  pageViews: PageView[];
  userAgent: string;
  ipAddress: string;
  referrer?: string;
  exitPage?: string;
}

export interface PageView {
  id: string;
  sessionId: string;
  userId: string;
  path: string;
  title: string;
  timestamp: string;
  loadTime?: number;
  timeOnPage?: number;
  interactions: number;
  scrollDepth: number;
}

export interface UserEvent {
  id: string;
  userId: string;
  sessionId: string;
  eventType: 'click' | 'scroll' | 'form_submit' | 'search' | 'download' | 'ai_query' | 'feature_use';
  eventData: Record<string, any>;
  timestamp: string;
  page: string;
}

export interface AnalyticsData {
  sessions: UserSession[];
  pageViews: PageView[];
  events: UserEvent[];
  lastUpdated: string;
}

const ANALYTICS_FILE = 'analytics.json';

class AnalyticsService {
  private analyticsPath: string;

  constructor() {
    this.analyticsPath = getDataPath(ANALYTICS_FILE);
  }

  private async getAnalyticsData(): Promise<AnalyticsData> {
    try {
      const data = await readJSONFile<AnalyticsData>(this.analyticsPath);
      return data || {
        sessions: [],
        pageViews: [],
        events: [],
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error reading analytics data:', error);
      }
      return {
        sessions: [],
        pageViews: [],
        events: [],
        lastUpdated: new Date().toISOString()
      };
    }
  }

  private async saveAnalyticsData(data: AnalyticsData): Promise<void> {
    try {
      data.lastUpdated = new Date().toISOString();
      await writeJSONFile(this.analyticsPath, data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error saving analytics data:', error);
      }
      throw new Error('Failed to save analytics data');
    }
  }

  public async startSession(userId: string, userAgent: string, ipAddress: string, referrer?: string): Promise<string> {
    const data = await this.getAnalyticsData();
    
    const sessionId = `session_${userId}_${Date.now()}`;
    const session: UserSession = {
      id: sessionId,
      userId,
      sessionStart: new Date().toISOString(),
      pageViews: [],
      userAgent,
      ipAddress,
      referrer
    };

    data.sessions.push(session);
    await this.saveAnalyticsData(data);
    
    return sessionId;
  }

  public async endSession(sessionId: string, exitPage?: string): Promise<void> {
    const data = await this.getAnalyticsData();
    
    const session = data.sessions.find(s => s.id === sessionId);
    if (session) {
      session.sessionEnd = new Date().toISOString();
      session.exitPage = exitPage;
      
      if (session.sessionStart) {
        const start = new Date(session.sessionStart);
        const end = new Date(session.sessionEnd);
        session.duration = Math.floor((end.getTime() - start.getTime()) / 1000);
      }
      
      await this.saveAnalyticsData(data);
    }
  }

  public async trackPageView(
    sessionId: string,
    userId: string,
    path: string,
    title: string,
    loadTime?: number
  ): Promise<string> {
    const data = await this.getAnalyticsData();
    
    const pageViewId = `pv_${sessionId}_${Date.now()}`;
    const pageView: PageView = {
      id: pageViewId,
      sessionId,
      userId,
      path,
      title,
      timestamp: new Date().toISOString(),
      loadTime,
      interactions: 0,
      scrollDepth: 0
    };

    data.pageViews.push(pageView);
    
    // Update session with page view
    const session = data.sessions.find(s => s.id === sessionId);
    if (session) {
      session.pageViews.push(pageView);
    }
    
    await this.saveAnalyticsData(data);
    return pageViewId;
  }

  public async updatePageView(
    pageViewId: string,
    updates: Partial<Pick<PageView, 'timeOnPage' | 'interactions' | 'scrollDepth'>>
  ): Promise<void> {
    const data = await this.getAnalyticsData();
    
    const pageView = data.pageViews.find(pv => pv.id === pageViewId);
    if (pageView) {
      Object.assign(pageView, updates);
      await this.saveAnalyticsData(data);
    }
  }

  public async trackEvent(
    userId: string,
    sessionId: string,
    eventType: UserEvent['eventType'],
    eventData: Record<string, any>,
    page: string
  ): Promise<void> {
    const data = await this.getAnalyticsData();
    
    const event: UserEvent = {
      id: `event_${sessionId}_${Date.now()}`,
      userId,
      sessionId,
      eventType,
      eventData,
      timestamp: new Date().toISOString(),
      page
    };

    data.events.push(event);
    await this.saveAnalyticsData(data);
  }

  public async getAnalyticsSummary(dateRange: string = '7d'): Promise<{
    overview: any;
    traffic: any;
    engagement: any;
    performance: any;
  }> {
    const data = await this.getAnalyticsData();
    
    // Calculate date range
    const now = new Date();
    const daysBack = dateRange === '1d' ? 1 : dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    // Filter data by date range
    const filteredSessions = data.sessions.filter(s => new Date(s.sessionStart) >= startDate);
    const filteredPageViews = data.pageViews.filter(pv => new Date(pv.timestamp) >= startDate);
    const filteredEvents = data.events.filter(e => new Date(e.timestamp) >= startDate);

    // Calculate overview metrics
    const totalUsers = new Set(filteredSessions.map(s => s.userId)).size;
    const activeUsers = new Set(
      filteredSessions
        .filter(s => new Date(s.sessionStart) >= new Date(now.getTime() - (24 * 60 * 60 * 1000)))
        .map(s => s.userId)
    ).size;
    const pageViews = filteredPageViews.length;
    const avgSessionDuration = filteredSessions
      .filter(s => s.duration)
      .reduce((sum, s) => sum + (s.duration || 0), 0) / filteredSessions.length || 0;

    // Calculate bounce rate (sessions with only 1 page view)
    const bounceRate = (filteredSessions.filter(s => s.pageViews.length === 1).length / filteredSessions.length) * 100 || 0;

    // Calculate top pages
    const pageViewCounts = filteredPageViews.reduce((acc, pv) => {
      acc[pv.path] = (acc[pv.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPages = Object.entries(pageViewCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([path, views]) => ({
        path,
        views,
        uniqueViews: new Set(filteredPageViews.filter(pv => pv.path === path).map(pv => pv.userId)).size
      }));

    // Calculate feature usage
    const featureEvents = filteredEvents.filter(e => e.eventType === 'feature_use');
    const featureUsage = featureEvents.reduce((acc, event) => {
      const feature = event.eventData.feature || 'Unknown';
      acc[feature] = (acc[feature] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const featureUsageArray = Object.entries(featureUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([feature, usage]) => ({
        feature,
        usage,
        growth: Math.random() * 20 - 5 // Mock growth for now
      }));

    // Calculate performance metrics
    const loadTimes = filteredPageViews
      .filter(pv => pv.loadTime)
      .reduce((acc, pv) => {
        if (!acc[pv.path]) {
          acc[pv.path] = [];
        }
        acc[pv.path].push(pv.loadTime!);
        return acc;
      }, {} as Record<string, number[]>);

    const performanceData = Object.entries(loadTimes)
      .map(([page, times]) => ({
        page,
        avgTime: Math.round(times.reduce((sum, time) => sum + time, 0) / times.length),
        p95Time: Math.round(times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)] || 0)
      }))
      .slice(0, 8);

    return {
      overview: {
        totalUsers,
        activeUsers,
        pageViews,
        avgSessionDuration: Math.round(avgSessionDuration),
        bounceRate: Math.round(bounceRate * 100) / 100,
        conversionRate: Math.random() * 10 + 5 // Mock conversion rate
      },
      traffic: {
        sources: [
          { name: 'Direct', visitors: Math.floor(totalUsers * 0.4), percentage: 40 },
          { name: 'Google Search', visitors: Math.floor(totalUsers * 0.3), percentage: 30 },
          { name: 'Social Media', visitors: Math.floor(totalUsers * 0.2), percentage: 20 },
          { name: 'Referral', visitors: Math.floor(totalUsers * 0.1), percentage: 10 }
        ],
        devices: [
          { name: 'Desktop', visitors: Math.floor(totalUsers * 0.6), percentage: 60 },
          { name: 'Mobile', visitors: Math.floor(totalUsers * 0.4), percentage: 40 }
        ],
        topPages
      },
      engagement: {
        dailyActiveUsers: this.generateDailyData(daysBack, 'users'),
        sessionDuration: this.generateDailyData(daysBack, 'duration'),
        featureUsage: featureUsageArray
      },
      performance: {
        loadTimes: performanceData,
        errorRates: performanceData.map(p => ({
          page: p.page,
          errors: Math.floor(Math.random() * 20),
          rate: Math.random() * 3
        }))
      }
    };
  }

  private generateDailyData(days: number, type: 'users' | 'duration'): Array<{date: string, users?: number, duration?: number}> {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (type === 'users') {
        data.push({
          date: dateStr,
          users: Math.floor(Math.random() * 100) + 150
        });
      } else {
        data.push({
          date: dateStr,
          duration: Math.floor(Math.random() * 100) + 250
        });
      }
    }
    return data;
  }

  public async getUserAnalytics(userId: string): Promise<{
    totalSessions: number;
    totalPageViews: number;
    avgSessionDuration: number;
    favoritePages: string[];
    lastActive: string;
    totalEvents: number;
  }> {
    const data = await this.getAnalyticsData();
    
    const userSessions = data.sessions.filter(s => s.userId === userId);
    const userPageViews = data.pageViews.filter(pv => pv.userId === userId);
    const userEvents = data.events.filter(e => e.userId === userId);
    
    const avgSessionDuration = userSessions
      .filter(s => s.duration)
      .reduce((sum, s) => sum + (s.duration || 0), 0) / userSessions.length || 0;
    
    const pageViewCounts = userPageViews.reduce((acc, pv) => {
      acc[pv.path] = (acc[pv.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const favoritePages = Object.entries(pageViewCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([path]) => path);
    
    const lastActive = userSessions.length > 0 
      ? userSessions.sort((a, b) => new Date(b.sessionStart).getTime() - new Date(a.sessionStart).getTime())[0].sessionStart
      : '';

    return {
      totalSessions: userSessions.length,
      totalPageViews: userPageViews.length,
      avgSessionDuration: Math.round(avgSessionDuration),
      favoritePages,
      lastActive,
      totalEvents: userEvents.length
    };
  }
}

export const analyticsService = new AnalyticsService();
