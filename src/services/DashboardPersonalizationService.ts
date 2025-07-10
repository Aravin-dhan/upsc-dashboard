'use client';

import { AIMemoryService } from './AIMemoryService';

export interface PersonalizationInsight {
  id: string;
  type: 'layout' | 'widget' | 'content' | 'timing' | 'priority';
  title: string;
  description: string;
  confidence: number; // 0-1
  action: {
    type: 'suggest_layout' | 'recommend_widget' | 'adjust_priority' | 'schedule_reminder' | 'customize_content';
    payload: any;
  };
  reasoning: string;
  createdAt: string;
}

export interface UserBehaviorPattern {
  pattern: string;
  frequency: number;
  timeOfDay?: number;
  dayOfWeek?: number;
  context?: string;
  confidence: number;
}

export interface DashboardRecommendation {
  id: string;
  type: 'layout_change' | 'widget_addition' | 'widget_removal' | 'widget_resize' | 'content_update';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  reasoning: string;
  previewData?: any;
  autoApply: boolean;
}

export class DashboardPersonalizationService {
  private static instance: DashboardPersonalizationService;
  private aiMemoryService: AIMemoryService;
  private behaviorPatterns: UserBehaviorPattern[] = [];
  private insights: PersonalizationInsight[] = [];
  private recommendations: DashboardRecommendation[] = [];

  private constructor() {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      try {
        this.aiMemoryService = AIMemoryService.getInstance();
        this.loadStoredData();
        this.startBehaviorAnalysis();
      } catch (error) {
        console.warn('Failed to initialize DashboardPersonalizationService:', error);
      }
    }
  }

  static getInstance(): DashboardPersonalizationService {
    if (!DashboardPersonalizationService.instance) {
      DashboardPersonalizationService.instance = new DashboardPersonalizationService();
    }
    return DashboardPersonalizationService.instance;
  }

  private loadStoredData(): void {
    if (typeof window === 'undefined') return;

    try {
      const storedPatterns = localStorage.getItem('upsc-behavior-patterns');
      if (storedPatterns) {
        this.behaviorPatterns = JSON.parse(storedPatterns);
      }

      const storedInsights = localStorage.getItem('upsc-personalization-insights');
      if (storedInsights) {
        this.insights = JSON.parse(storedInsights);
      }

      const storedRecommendations = localStorage.getItem('upsc-dashboard-recommendations');
      if (storedRecommendations) {
        this.recommendations = JSON.parse(storedRecommendations);
      }
    } catch (error) {
      console.error('Error loading personalization data:', error);
    }
  }

  private saveData(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('upsc-behavior-patterns', JSON.stringify(this.behaviorPatterns));
      localStorage.setItem('upsc-personalization-insights', JSON.stringify(this.insights));
      localStorage.setItem('upsc-dashboard-recommendations', JSON.stringify(this.recommendations));
    } catch (error) {
      console.error('Error saving personalization data:', error);
    }
  }

  private startBehaviorAnalysis(): void {
    // Analyze behavior patterns every 5 minutes
    setInterval(() => {
      this.analyzeBehaviorPatterns();
      this.generatePersonalizationInsights();
      this.generateDashboardRecommendations();
    }, 5 * 60 * 1000);

    // Initial analysis
    setTimeout(() => {
      this.analyzeBehaviorPatterns();
      this.generatePersonalizationInsights();
      this.generateDashboardRecommendations();
    }, 2000);
  }

  // Track user behavior
  trackBehavior(action: string, context: any): void {
    this.aiMemoryService.learnFromBehavior(action, context);
    
    // Update behavior patterns
    this.updateBehaviorPattern(action, context);
  }

  private updateBehaviorPattern(action: string, context: any): void {
    const now = new Date();
    const timeOfDay = now.getHours();
    const dayOfWeek = now.getDay();

    const existingPattern = this.behaviorPatterns.find(p => 
      p.pattern === action && 
      p.timeOfDay === timeOfDay && 
      p.dayOfWeek === dayOfWeek
    );

    if (existingPattern) {
      existingPattern.frequency += 1;
      existingPattern.confidence = Math.min(1, existingPattern.confidence + 0.1);
    } else {
      this.behaviorPatterns.push({
        pattern: action,
        frequency: 1,
        timeOfDay,
        dayOfWeek,
        context: JSON.stringify(context),
        confidence: 0.1
      });
    }

    this.saveData();
  }

  private analyzeBehaviorPatterns(): void {
    // Clean up old patterns with low confidence
    this.behaviorPatterns = this.behaviorPatterns.filter(p => p.confidence > 0.05);

    // Identify strong patterns
    const strongPatterns = this.behaviorPatterns.filter(p => 
      p.frequency >= 3 && p.confidence > 0.5
    );

    // Generate insights from strong patterns
    strongPatterns.forEach(pattern => {
      this.generateInsightFromPattern(pattern);
    });
  }

  private generateInsightFromPattern(pattern: UserBehaviorPattern): void {
    const existingInsight = this.insights.find(i => 
      i.type === 'timing' && i.description.includes(pattern.pattern)
    );

    if (existingInsight) return; // Don't duplicate insights

    let insight: PersonalizationInsight | null = null;

    // Dashboard access patterns
    if (pattern.pattern === 'dashboard-accessed') {
      insight = {
        id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'timing',
        title: 'Optimal Dashboard Time',
        description: `You frequently access the dashboard at ${pattern.timeOfDay}:00. Consider scheduling important reminders around this time.`,
        confidence: pattern.confidence,
        action: {
          type: 'schedule_reminder',
          payload: { preferredTime: pattern.timeOfDay }
        },
        reasoning: `Based on ${pattern.frequency} accesses with ${Math.round(pattern.confidence * 100)}% confidence`,
        createdAt: new Date().toISOString()
      };
    }

    // Widget interaction patterns
    if (pattern.pattern.includes('widget-') && pattern.frequency > 5) {
      const widgetType = pattern.pattern.replace('widget-', '').replace('-accessed', '');
      insight = {
        id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'widget',
        title: 'Frequently Used Widget',
        description: `You use the ${widgetType} widget frequently. Consider making it more prominent in your layout.`,
        confidence: pattern.confidence,
        action: {
          type: 'adjust_priority',
          payload: { widgetType, action: 'promote' }
        },
        reasoning: `Used ${pattern.frequency} times with high engagement`,
        createdAt: new Date().toISOString()
      };
    }

    if (insight) {
      this.insights.push(insight);
      this.saveData();
    }
  }

  private generatePersonalizationInsights(): void {
    const memoryContext = this.aiMemoryService.generateContextForAI();
    
    // Study pattern insights
    if (memoryContext.studyPatterns.length > 0) {
      const recentPattern = memoryContext.studyPatterns[0];
      
      const insight: PersonalizationInsight = {
        id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'content',
        title: 'Study Pattern Optimization',
        description: `Your study sessions average ${recentPattern.duration} minutes. Consider adjusting your dashboard widgets to support this pattern.`,
        confidence: 0.8,
        action: {
          type: 'customize_content',
          payload: { 
            studyDuration: recentPattern.duration,
            preferredTime: recentPattern.timeOfDay
          }
        },
        reasoning: 'Based on consistent study session patterns',
        createdAt: new Date().toISOString()
      };

      // Only add if not already exists
      const exists = this.insights.some(i => i.title === insight.title);
      if (!exists) {
        this.insights.push(insight);
        this.saveData();
      }
    }
  }

  private generateDashboardRecommendations(): void {
    const dashboardPrefs = this.aiMemoryService.getDashboardPreferences();
    const currentHour = new Date().getHours();

    // Layout optimization recommendations
    if (dashboardPrefs.preferredLayout) {
      const recommendation: DashboardRecommendation = {
        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'layout_change',
        title: 'Optimize Widget Layout',
        description: 'Based on your usage patterns, I can suggest a more efficient widget arrangement.',
        impact: 'medium',
        effort: 'low',
        reasoning: 'Frequently accessed widgets should be more prominent',
        autoApply: false
      };

      // Only add if not already exists
      const exists = this.recommendations.some(r => r.title === recommendation.title);
      if (!exists) {
        this.recommendations.push(recommendation);
        this.saveData();
      }
    }

    // Time-based recommendations
    if (currentHour >= 9 && currentHour <= 17) {
      const recommendation: DashboardRecommendation = {
        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'widget_addition',
        title: 'Add Focus Timer',
        description: 'During study hours, a focus timer widget could help maintain concentration.',
        impact: 'high',
        effort: 'low',
        reasoning: 'Current time suggests active study period',
        autoApply: false
      };

      const exists = this.recommendations.some(r => r.title === recommendation.title);
      if (!exists) {
        this.recommendations.push(recommendation);
        this.saveData();
      }
    }
  }

  // Public methods
  getPersonalizationInsights(): PersonalizationInsight[] {
    return this.insights.slice(0, 5); // Return top 5 insights
  }

  getDashboardRecommendations(): DashboardRecommendation[] {
    return this.recommendations.slice(0, 3); // Return top 3 recommendations
  }

  getBehaviorPatterns(): UserBehaviorPattern[] {
    return this.behaviorPatterns
      .filter(p => p.confidence > 0.3)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10);
  }

  applyRecommendation(recommendationId: string): boolean {
    const recommendation = this.recommendations.find(r => r.id === recommendationId);
    if (!recommendation) return false;

    // Mark as applied
    recommendation.autoApply = true;
    this.saveData();

    // Trigger dashboard update event
    const event = new CustomEvent('dashboardRecommendationApplied', {
      detail: recommendation
    });
    window.dispatchEvent(event);

    return true;
  }

  dismissInsight(insightId: string): void {
    this.insights = this.insights.filter(i => i.id !== insightId);
    this.saveData();
  }

  dismissRecommendation(recommendationId: string): void {
    this.recommendations = this.recommendations.filter(r => r.id !== recommendationId);
    this.saveData();
  }

  // Generate personalized dashboard layout
  generatePersonalizedLayout(): any {
    const patterns = this.getBehaviorPatterns();
    const insights = this.getPersonalizationInsights();
    
    // Analyze most used widgets
    const widgetUsage = patterns
      .filter(p => p.pattern.includes('widget-'))
      .reduce((acc, p) => {
        const widget = p.pattern.replace('widget-', '').replace('-accessed', '');
        acc[widget] = (acc[widget] || 0) + p.frequency;
        return acc;
      }, {} as Record<string, number>);

    // Sort widgets by usage
    const sortedWidgets = Object.entries(widgetUsage)
      .sort(([,a], [,b]) => b - a)
      .map(([widget]) => widget);

    return {
      recommendedOrder: sortedWidgets,
      insights: insights,
      confidence: patterns.length > 0 ? 0.8 : 0.3
    };
  }
}
