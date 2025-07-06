import { AIContext } from './AIContextService';

export interface Recommendation {
  id: string;
  type: 'study_plan' | 'practice' | 'revision' | 'current_affairs' | 'wellness' | 'time_management';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  reasoning: string;
  actionable: boolean;
  estimatedTime?: number; // in minutes
  actions?: Array<{
    type: string;
    payload: any;
    label: string;
  }>;
  metadata?: {
    subject?: string;
    difficulty?: string;
    category?: string;
    deadline?: string;
  };
}

export interface UserPattern {
  studyTimePreference: 'morning' | 'afternoon' | 'evening' | 'night';
  averageSessionDuration: number;
  preferredSubjects: string[];
  weakAreas: string[];
  strongAreas: string[];
  practiceFrequency: number;
  revisionConsistency: number;
  currentAffairsEngagement: number;
}

class AIRecommendationEngine {
  private static instance: AIRecommendationEngine;

  private constructor() {}

  static getInstance(): AIRecommendationEngine {
    if (!AIRecommendationEngine.instance) {
      AIRecommendationEngine.instance = new AIRecommendationEngine();
    }
    return AIRecommendationEngine.instance;
  }

  generateRecommendations(context: AIContext): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const userPattern = this.analyzeUserPattern(context);

    // Performance-based recommendations
    recommendations.push(...this.generatePerformanceRecommendations(context, userPattern));
    
    // Time-based recommendations
    recommendations.push(...this.generateTimeBasedRecommendations(context, userPattern));
    
    // Content-based recommendations
    recommendations.push(...this.generateContentRecommendations(context, userPattern));
    
    // Wellness recommendations
    recommendations.push(...this.generateWellnessRecommendations(context, userPattern));
    
    // Study strategy recommendations
    recommendations.push(...this.generateStudyStrategyRecommendations(context, userPattern));

    // Sort by priority and relevance
    return this.prioritizeRecommendations(recommendations, context);
  }

  private analyzeUserPattern(context: AIContext): UserPattern {
    const stats = context.userStats;
    const preferences = context.preferences;
    const recentActivity = context.recentActivity;

    // Analyze study time preferences
    const studyTimePreference = preferences.preferredStudyTime || 'morning';
    
    // Calculate average session duration
    const averageSessionDuration = stats.totalStudyTime && stats.practiceSessionsCompleted 
      ? (stats.totalStudyTime / stats.practiceSessionsCompleted) 
      : 60;

    // Identify weak and strong areas
    const subjectProgress = stats.subjectWiseProgress || {};
    const weakAreas = Object.entries(subjectProgress)
      .filter(([_, score]) => (score as number) < 60)
      .map(([subject, _]) => subject)
      .slice(0, 3);
    
    const strongAreas = Object.entries(subjectProgress)
      .filter(([_, score]) => (score as number) >= 80)
      .map(([subject, _]) => subject)
      .slice(0, 3);

    return {
      studyTimePreference: studyTimePreference as any,
      averageSessionDuration,
      preferredSubjects: strongAreas,
      weakAreas,
      strongAreas,
      practiceFrequency: stats.practiceSessionsCompleted || 0,
      revisionConsistency: this.calculateRevisionConsistency(context),
      currentAffairsEngagement: this.calculateCurrentAffairsEngagement(context)
    };
  }

  private generatePerformanceRecommendations(context: AIContext, pattern: UserPattern): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const stats = context.userStats;

    // Low performance recommendations
    if (stats.averageScore && stats.averageScore < 50) {
      recommendations.push({
        id: 'perf_low_score',
        type: 'study_plan',
        priority: 'high',
        title: 'Focus on Fundamentals',
        description: 'Your average score suggests focusing on basic concepts before advancing.',
        reasoning: `Average score of ${stats.averageScore}% indicates need for foundational strengthening`,
        actionable: true,
        estimatedTime: 120,
        actions: [
          {
            type: 'create_study_plan',
            payload: { difficulty: 'beginner', duration: 21 },
            label: 'Create 21-day Foundation Plan'
          }
        ],
        metadata: { difficulty: 'beginner' }
      });
    }

    // Weak area recommendations
    pattern.weakAreas.forEach(subject => {
      recommendations.push({
        id: `weak_${subject.toLowerCase()}`,
        type: 'practice',
        priority: 'high',
        title: `Strengthen ${subject}`,
        description: `Focus on ${subject} practice to improve your weak area.`,
        reasoning: `${subject} shows below 60% performance in recent practice`,
        actionable: true,
        estimatedTime: 90,
        actions: [
          {
            type: 'start_practice_session',
            payload: { subject, difficulty: 'medium' },
            label: `Practice ${subject}`
          }
        ],
        metadata: { subject, difficulty: 'medium' }
      });
    });

    // Streak maintenance
    if (stats.streakDays && stats.streakDays >= 7) {
      recommendations.push({
        id: 'maintain_streak',
        type: 'wellness',
        priority: 'medium',
        title: 'Maintain Your Streak!',
        description: `You're on a ${stats.streakDays}-day streak. Keep the momentum going!`,
        reasoning: 'Consistent study habits lead to better retention and performance',
        actionable: true,
        estimatedTime: 30,
        actions: [
          {
            type: 'start_practice_session',
            payload: { type: 'daily' },
            label: 'Continue Daily Practice'
          }
        ]
      });
    }

    return recommendations;
  }

  private generateTimeBasedRecommendations(context: AIContext, pattern: UserPattern): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const currentHour = new Date().getHours();
    const currentDay = new Date().getDay();

    // Morning recommendations (6-10 AM)
    if (currentHour >= 6 && currentHour <= 10) {
      recommendations.push({
        id: 'morning_fresh_start',
        type: 'practice',
        priority: 'high',
        title: 'Morning Practice Session',
        description: 'Start your day with a focused practice session when your mind is fresh.',
        reasoning: 'Morning hours are optimal for complex problem-solving and new learning',
        actionable: true,
        estimatedTime: 60,
        actions: [
          {
            type: 'start_practice_session',
            payload: { type: 'daily', difficulty: 'medium' },
            label: 'Start Morning Practice'
          }
        ]
      });
    }

    // Evening recommendations (6-9 PM)
    if (currentHour >= 18 && currentHour <= 21) {
      recommendations.push({
        id: 'evening_revision',
        type: 'revision',
        priority: 'medium',
        title: 'Evening Revision',
        description: 'Perfect time for revision and consolidating what you learned today.',
        reasoning: 'Evening revision helps consolidate daily learning and improves retention',
        actionable: true,
        estimatedTime: 45,
        actions: [
          {
            type: 'start_revision',
            payload: { filter: 'due' },
            label: 'Start Revision Session'
          }
        ]
      });
    }

    // Weekend recommendations
    if (currentDay === 0 || currentDay === 6) {
      recommendations.push({
        id: 'weekend_mock_test',
        type: 'practice',
        priority: 'medium',
        title: 'Weekend Mock Test',
        description: 'Take a comprehensive mock test to assess your preparation level.',
        reasoning: 'Weekends provide longer time slots ideal for full-length mock tests',
        actionable: true,
        estimatedTime: 180,
        actions: [
          {
            type: 'start_practice_session',
            payload: { type: 'mock' },
            label: 'Take Mock Test'
          }
        ]
      });
    }

    return recommendations;
  }

  private generateContentRecommendations(context: AIContext, pattern: UserPattern): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const availableData = context.availableData;

    // Current affairs recommendations
    if (availableData.newsArticles && availableData.newsArticles.length > 0) {
      const unreadCount = availableData.newsArticles.filter((article: any) => !article.isRead).length;
      
      if (unreadCount > 5) {
        recommendations.push({
          id: 'current_affairs_backlog',
          type: 'current_affairs',
          priority: 'medium',
          title: 'Clear Current Affairs Backlog',
          description: `You have ${unreadCount} unread articles. Stay updated with current events.`,
          reasoning: 'Current affairs are crucial for both Prelims and Mains preparation',
          actionable: true,
          estimatedTime: 30,
          actions: [
            {
              type: 'navigate_to_page',
              payload: { page: '/current-affairs' },
              label: 'Read Current Affairs'
            }
          ]
        });
      }
    }

    // Revision due recommendations
    if (availableData.revisionItems) {
      const dueItems = availableData.revisionItems.filter((item: any) => 
        new Date(item.nextReview) <= new Date()
      );
      
      if (dueItems.length > 0) {
        recommendations.push({
          id: 'revision_due',
          type: 'revision',
          priority: 'high',
          title: 'Pending Revisions',
          description: `${dueItems.length} items are due for revision. Don't let them pile up!`,
          reasoning: 'Timely revision is crucial for long-term retention using spaced repetition',
          actionable: true,
          estimatedTime: dueItems.length * 5,
          actions: [
            {
              type: 'start_revision',
              payload: { filter: 'due' },
              label: 'Start Revision'
            }
          ]
        });
      }
    }

    return recommendations;
  }

  private generateWellnessRecommendations(context: AIContext, pattern: UserPattern): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const currentHour = new Date().getHours();

    // Study break recommendations
    if (pattern.averageSessionDuration > 120) {
      recommendations.push({
        id: 'take_breaks',
        type: 'wellness',
        priority: 'medium',
        title: 'Take Regular Breaks',
        description: 'Your study sessions are quite long. Consider taking breaks every 90 minutes.',
        reasoning: 'Regular breaks improve focus and prevent mental fatigue',
        actionable: true,
        estimatedTime: 15,
        actions: [
          {
            type: 'navigate_to_page',
            payload: { page: '/wellness' },
            label: 'Start Wellness Break'
          }
        ]
      });
    }

    // Late night study warning
    if (currentHour >= 23 || currentHour <= 5) {
      recommendations.push({
        id: 'sleep_schedule',
        type: 'wellness',
        priority: 'high',
        title: 'Maintain Sleep Schedule',
        description: 'Late night studying can affect your performance. Consider adjusting your schedule.',
        reasoning: 'Adequate sleep is crucial for memory consolidation and cognitive performance',
        actionable: true,
        estimatedTime: 0,
        actions: [
          {
            type: 'set_reminder',
            payload: { message: 'Time to sleep', time: '22:00' },
            label: 'Set Sleep Reminder'
          }
        ]
      });
    }

    return recommendations;
  }

  private generateStudyStrategyRecommendations(context: AIContext, pattern: UserPattern): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Spaced repetition optimization
    if (pattern.revisionConsistency < 0.7) {
      recommendations.push({
        id: 'improve_revision',
        type: 'revision',
        priority: 'medium',
        title: 'Optimize Revision Strategy',
        description: 'Your revision consistency can be improved. Try spaced repetition for better retention.',
        reasoning: 'Consistent revision using spaced repetition significantly improves long-term retention',
        actionable: true,
        estimatedTime: 30,
        actions: [
          {
            type: 'optimize_revision_schedule',
            payload: {},
            label: 'Optimize Revision Schedule'
          }
        ]
      });
    }

    // Diversify practice
    if (pattern.preferredSubjects.length < 3) {
      recommendations.push({
        id: 'diversify_practice',
        type: 'practice',
        priority: 'medium',
        title: 'Diversify Your Practice',
        description: 'Try practicing different subjects to maintain a balanced preparation.',
        reasoning: 'Balanced practice across subjects prevents knowledge gaps and improves overall performance',
        actionable: true,
        estimatedTime: 60,
        actions: [
          {
            type: 'generate_custom_quiz',
            payload: { subject: 'mixed', questionCount: 20 },
            label: 'Take Mixed Subject Quiz'
          }
        ]
      });
    }

    return recommendations;
  }

  private prioritizeRecommendations(recommendations: Recommendation[], context: AIContext): Recommendation[] {
    // Sort by priority and relevance
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    
    return recommendations
      .sort((a, b) => {
        // First by priority
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        
        // Then by actionability
        if (a.actionable !== b.actionable) return a.actionable ? -1 : 1;
        
        // Then by estimated time (shorter first for quick wins)
        return (a.estimatedTime || 0) - (b.estimatedTime || 0);
      })
      .slice(0, 8); // Limit to top 8 recommendations
  }

  private calculateRevisionConsistency(context: AIContext): number {
    const revisionItems = context.availableData.revisionItems || [];
    if (revisionItems.length === 0) return 0;

    const reviewedOnTime = revisionItems.filter((item: any) => {
      if (!item.lastReviewed || !item.nextReview) return false;
      const lastReviewed = new Date(item.lastReviewed);
      const nextReview = new Date(item.nextReview);
      return lastReviewed <= nextReview;
    });

    return reviewedOnTime.length / revisionItems.length;
  }

  private calculateCurrentAffairsEngagement(context: AIContext): number {
    const newsArticles = context.availableData.newsArticles || [];
    if (newsArticles.length === 0) return 0;

    const readArticles = newsArticles.filter((article: any) => article.isRead);
    return readArticles.length / newsArticles.length;
  }
}

export default AIRecommendationEngine;
