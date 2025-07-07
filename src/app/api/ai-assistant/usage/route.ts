import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getDataPath, readJSONFile, writeJSONFile } from '@/lib/utils/fileSystem';

export const runtime = 'nodejs';

interface AIUsageRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  queryCount: number;
  lastUsed: string; // ISO timestamp
  features: {
    chatQueries: number;
    analysisRequests: number;
    studyPlanGeneration: number;
    questionAnalysis: number;
  };
}

const USAGE_FILE = 'ai-usage.json';

class AIUsageService {
  private usagePath: string;

  constructor() {
    this.usagePath = getDataPath(USAGE_FILE);
  }

  private async getUsageData(): Promise<AIUsageRecord[]> {
    try {
      return await readJSONFile<AIUsageRecord[]>(this.usagePath) || [];
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error reading usage data:', error);
      }
      return [];
    }
  }

  private async saveUsageData(data: AIUsageRecord[]): Promise<void> {
    try {
      await writeJSONFile(this.usagePath, data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error saving usage data:', error);
      }
      throw new Error('Failed to save usage data');
    }
  }

  private getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  public async getUserDailyUsage(userId: string, date?: string): Promise<AIUsageRecord | null> {
    const targetDate = date || this.getTodayString();
    const usageData = await this.getUsageData();

    return usageData.find(record =>
      record.userId === userId && record.date === targetDate
    ) || null;
  }

  public async incrementUsage(
    userId: string,
    feature: keyof AIUsageRecord['features'] = 'chatQueries'
  ): Promise<AIUsageRecord> {
    const today = this.getTodayString();
    const usageData = await this.getUsageData();

    let userRecord = usageData.find(record =>
      record.userId === userId && record.date === today
    );

    if (!userRecord) {
      userRecord = {
        id: `${userId}-${today}`,
        userId,
        date: today,
        queryCount: 0,
        lastUsed: new Date().toISOString(),
        features: {
          chatQueries: 0,
          analysisRequests: 0,
          studyPlanGeneration: 0,
          questionAnalysis: 0
        }
      };
      usageData.push(userRecord);
    }

    // Increment counters
    userRecord.queryCount++;
    userRecord.features[feature]++;
    userRecord.lastUsed = new Date().toISOString();

    await this.saveUsageData(usageData);
    return userRecord;
  }

  public async getUserUsageHistory(userId: string, days: number = 30): Promise<AIUsageRecord[]> {
    const usageData = await this.getUsageData();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffString = cutoffDate.toISOString().split('T')[0];

    return usageData
      .filter(record => record.userId === userId && record.date >= cutoffString)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  public async getUsageStats(userId: string): Promise<{
    today: number;
    thisWeek: number;
    thisMonth: number;
    totalQueries: number;
    averageDaily: number;
    featureBreakdown: AIUsageRecord['features'];
  }> {
    const history = await this.getUserUsageHistory(userId, 30);
    const today = this.getTodayString();

    const todayRecord = history.find(record => record.date === today);
    const todayUsage = todayRecord?.queryCount || 0;

    // Calculate week usage (last 7 days)
    const weekCutoff = new Date();
    weekCutoff.setDate(weekCutoff.getDate() - 7);
    const weekCutoffString = weekCutoff.toISOString().split('T')[0];
    const weekUsage = history
      .filter(record => record.date >= weekCutoffString)
      .reduce((sum, record) => sum + record.queryCount, 0);

    // Calculate month usage
    const monthUsage = history.reduce((sum, record) => sum + record.queryCount, 0);

    // Calculate total and average
    const totalQueries = monthUsage;
    const averageDaily = history.length > 0 ? monthUsage / history.length : 0;

    // Feature breakdown (last 30 days)
    const featureBreakdown = history.reduce((acc, record) => {
      acc.chatQueries += record.features.chatQueries;
      acc.analysisRequests += record.features.analysisRequests;
      acc.studyPlanGeneration += record.features.studyPlanGeneration;
      acc.questionAnalysis += record.features.questionAnalysis;
      return acc;
    }, {
      chatQueries: 0,
      analysisRequests: 0,
      studyPlanGeneration: 0,
      questionAnalysis: 0
    });

    return {
      today: todayUsage,
      thisWeek: weekUsage,
      thisMonth: monthUsage,
      totalQueries,
      averageDaily: Math.round(averageDaily * 100) / 100,
      featureBreakdown
    };
  }
}

const usageService = new AIUsageService();

// GET: Get current user's AI usage
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'daily';
    const days = parseInt(searchParams.get('days') || '30');

    switch (type) {
      case 'daily':
        const dailyUsage = await usageService.getUserDailyUsage(session.user.id);
        return NextResponse.json({
          success: true,
          dailyUsage: dailyUsage?.queryCount || 0,
          features: dailyUsage?.features || {
            chatQueries: 0,
            analysisRequests: 0,
            studyPlanGeneration: 0,
            questionAnalysis: 0
          },
          lastUsed: dailyUsage?.lastUsed
        });

      case 'history':
        const history = await usageService.getUserUsageHistory(session.user.id, days);
        return NextResponse.json({
          success: true,
          history: history.map(record => ({
            date: record.date,
            queryCount: record.queryCount,
            features: record.features
          }))
        });

      case 'stats':
        const stats = await usageService.getUsageStats(session.user.id);
        return NextResponse.json({
          success: true,
          stats
        });

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('AI usage GET error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Increment AI usage
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { feature } = await request.json();

    // Validate feature type
    const validFeatures = ['chatQueries', 'analysisRequests', 'studyPlanGeneration', 'questionAnalysis'];
    if (feature && !validFeatures.includes(feature)) {
      return NextResponse.json(
        { error: 'Invalid feature type' },
        { status: 400 }
      );
    }

    const updatedRecord = await usageService.incrementUsage(
      session.user.id,
      feature || 'chatQueries'
    );

    return NextResponse.json({
      success: true,
      usage: {
        dailyTotal: updatedRecord.queryCount,
        features: updatedRecord.features,
        lastUsed: updatedRecord.lastUsed
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('AI usage POST error:', error);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
