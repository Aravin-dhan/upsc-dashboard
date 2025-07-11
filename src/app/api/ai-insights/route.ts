import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// In-memory storage for demo
let aiInsightsStorage: { [key: string]: any } = {};

export async function GET(request: NextRequest) {
  try {
    let userId = 'default';
    try {
      const session = await getSession(request);
      userId = session?.user?.id || 'default';
    } catch (authError) {
      console.log('Auth not available, using default user');
    }

    const storageKey = `ai-insights-${userId}`;
    let aiInsightsData = aiInsightsStorage[storageKey];

    if (!aiInsightsData) {
      const now = new Date().toISOString();
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      aiInsightsData = {
        insights: [
          {
            id: 'ai-1',
            type: 'performance',
            title: 'Focus on Polity Weak Areas',
            content: 'Your recent performance analysis shows room for improvement in Constitutional Law topics. Consider dedicating 2 extra hours this week to strengthen these concepts.',
            priority: 'high',
            confidence: 0.85,
            actionable: true,
            implemented: false,
            createdAt: now,
            expiresAt: tomorrow,
            relatedData: { subject: 'Polity', topics: ['Constitutional Law'], weakAreas: ['Fundamental Rights', 'DPSP'] }
          },
          {
            id: 'ai-2',
            type: 'study-plan',
            title: 'Optimize Study Schedule',
            content: 'Based on your productivity patterns, you perform best between 9-11 AM and 7-9 PM. Consider scheduling difficult topics during these peak hours.',
            priority: 'medium',
            confidence: 0.78,
            actionable: true,
            implemented: false,
            createdAt: now,
            expiresAt: tomorrow,
            relatedData: { timeSlots: ['9-11 AM', '7-9 PM'], productivity: 'high' }
          },
          {
            id: 'ai-3',
            type: 'wellness',
            title: 'Stress Management Recommendation',
            content: 'Your stress levels have been slightly elevated this week. Consider incorporating 15-minute meditation sessions and regular breaks to maintain optimal performance.',
            priority: 'medium',
            confidence: 0.72,
            actionable: true,
            implemented: true,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            expiresAt: tomorrow,
            relatedData: { stressLevel: 6.2, recommendation: 'meditation' }
          },
          {
            id: 'ai-4',
            type: 'strategy',
            title: 'Current Affairs Reading Pattern',
            content: 'You tend to skip International Relations articles. This subject has high weightage in both Prelims and Mains. Allocate dedicated time for IR current affairs.',
            priority: 'high',
            confidence: 0.88,
            actionable: true,
            implemented: false,
            createdAt: now,
            expiresAt: tomorrow,
            relatedData: { subject: 'International Relations', readingGap: 'high' }
          }
        ],
        personalizedRecommendations: {
          studyPlan: [
            'Increase Polity study time by 20% focusing on Constitutional Law',
            'Add more mock tests for Current Affairs to improve speed',
            'Dedicate 1 hour daily to International Relations current affairs',
            'Schedule revision sessions for completed History topics'
          ],
          focusAreas: [
            'Constitutional Law and Fundamental Rights',
            'International Relations and Foreign Policy',
            'Economic Geography and Resource Distribution',
            'Modern Indian History post-1857'
          ],
          improvementSuggestions: [
            'Practice more MCQs to improve speed and accuracy',
            'Create mind maps for complex topics like Constitutional Articles',
            'Join online discussion groups for current affairs analysis',
            'Use spaced repetition technique for better retention'
          ],
          motivationalTips: [
            'You\'ve improved 15% this month - consistency is paying off!',
            'Your strong performance in History shows your analytical skills',
            'Taking regular breaks is helping maintain your focus',
            'Your dedication to daily study routine is commendable'
          ]
        },
        behaviorAnalysis: {
          studyPatterns: {
            peakHours: ['9-11 AM', '7-9 PM'],
            averageDaily: 6.5,
            preferredSubjects: ['History', 'Current Affairs'],
            avoidedSubjects: ['Economics', 'International Relations'],
            breakFrequency: 'every 90 minutes'
          },
          performanceTrends: {
            overall: 'improving',
            subjects: {
              polity: 'stable',
              history: 'improving',
              geography: 'stable',
              economics: 'declining',
              currentAffairs: 'improving'
            },
            testScores: 'upward trend',
            consistency: 'high'
          },
          wellnessCorrelations: {
            mood: 'positive correlation with performance',
            stress: 'manageable levels',
            sleep: 'adequate but could be more consistent',
            exercise: 'positive impact on focus'
          }
        },
        stats: {
          totalInsights: 28,
          implementedInsights: 19,
          averageConfidence: 0.81,
          lastUpdated: now
        }
      };
      aiInsightsStorage[storageKey] = aiInsightsData;
    }

    return NextResponse.json({ success: true, data: aiInsightsData });
  } catch (error) {
    console.error('❌ Error fetching AI insights data:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch AI insights data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    let userId = 'default';
    try {
      const session = await getSession(request);
      userId = session?.user?.id || 'default';
    } catch (authError) {
      console.log('Auth not available, using default user');
    }

    const body = await request.json();
    const { action, insightId, updates } = body;
    const storageKey = `ai-insights-${userId}`;
    let aiInsightsData = aiInsightsStorage[storageKey] || { insights: [], personalizedRecommendations: {}, behaviorAnalysis: {}, stats: {} };

    if (action === 'update' && insightId && updates) {
      const insightIndex = aiInsightsData.insights.findIndex((insight: any) => insight.id === insightId);
      if (insightIndex !== -1) {
        aiInsightsData.insights[insightIndex] = { ...aiInsightsData.insights[insightIndex], ...updates };
        
        // Update stats if implementation status changed
        if (updates.implemented !== undefined) {
          const implementedCount = aiInsightsData.insights.filter((insight: any) => insight.implemented).length;
          aiInsightsData.stats.implementedInsights = implementedCount;
        }
        
        aiInsightsStorage[storageKey] = aiInsightsData;
        return NextResponse.json({ success: true, message: 'AI insight updated successfully' });
      } else {
        return NextResponse.json({ success: false, error: 'AI insight not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid action or missing parameters' }, { status: 400 });
  } catch (error) {
    console.error('❌ Error updating AI insights data:', error);
    return NextResponse.json({ success: false, error: 'Failed to update AI insights data' }, { status: 500 });
  }
}
