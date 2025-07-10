'use client';

export interface UserPreference {
  id: string;
  category: 'study' | 'interface' | 'ai' | 'wellness' | 'general';
  key: string;
  value: any;
  lastUpdated: string;
  source: 'user-input' | 'ai-learned' | 'behavior-analysis';
}

export interface ConversationMemory {
  id: string;
  timestamp: string;
  userMessage: string;
  aiResponse: string;
  context: {
    topic?: string;
    intent?: string;
    entities?: string[];
    sentiment?: 'positive' | 'neutral' | 'negative';
  };
  actionsTaken?: {
    type: 'bookmark-added' | 'layout-changed' | 'widget-suggested' | 'reminder-set';
    details: any;
  }[];
}

export interface StudyPattern {
  id: string;
  date: string;
  studyHours: number;
  subjects: string[];
  timeSlots: { start: string; end: string; subject: string }[];
  productivity: number; // 1-10 scale
  mood: 'excellent' | 'good' | 'average' | 'poor';
  notes?: string;
}

export interface AIPersonality {
  tone: 'formal' | 'casual' | 'friendly' | 'professional';
  detailLevel: 'brief' | 'moderate' | 'detailed';
  focusAreas: string[];
  responseStyle: 'direct' | 'encouraging' | 'analytical' | 'supportive';
  learningPreferences: {
    visualAids: boolean;
    examples: boolean;
    stepByStep: boolean;
    mnemonics: boolean;
  };
}

class AIMemoryService {
  private static instance: AIMemoryService;
  private userPreferences: UserPreference[] = [];
  private conversationHistory: ConversationMemory[] = [];
  private studyPatterns: StudyPattern[] = [];
  private aiPersonality: AIPersonality;
  private readonly MAX_CONVERSATIONS = 1000;
  private readonly MAX_STUDY_PATTERNS = 365; // 1 year

  private constructor() {
    this.aiPersonality = this.getDefaultPersonality();
    this.loadData();
  }

  static getInstance(): AIMemoryService {
    if (!AIMemoryService.instance) {
      AIMemoryService.instance = new AIMemoryService();
    }
    return AIMemoryService.instance;
  }

  private getDefaultPersonality(): AIPersonality {
    return {
      tone: 'friendly',
      detailLevel: 'moderate',
      focusAreas: ['upsc-preparation', 'time-management', 'study-techniques'],
      responseStyle: 'encouraging',
      learningPreferences: {
        visualAids: true,
        examples: true,
        stepByStep: true,
        mnemonics: false
      }
    };
  }

  // Load all data from localStorage
  private loadData(): void {
    if (typeof window === 'undefined') return;

    try {
      // Load user preferences
      const preferences = localStorage.getItem('upsc-ai-preferences');
      if (preferences) {
        this.userPreferences = JSON.parse(preferences);
      }

      // Load conversation history
      const conversations = localStorage.getItem('upsc-ai-conversations');
      if (conversations) {
        this.conversationHistory = JSON.parse(conversations);
      }

      // Load study patterns
      const patterns = localStorage.getItem('upsc-study-patterns');
      if (patterns) {
        this.studyPatterns = JSON.parse(patterns);
      }

      // Load AI personality
      const personality = localStorage.getItem('upsc-ai-personality');
      if (personality) {
        this.aiPersonality = { ...this.getDefaultPersonality(), ...JSON.parse(personality) };
      }
    } catch (error) {
      console.error('Error loading AI memory data:', error);
    }
  }

  // Save data to localStorage
  private saveData(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('upsc-ai-preferences', JSON.stringify(this.userPreferences));
      localStorage.setItem('upsc-ai-conversations', JSON.stringify(this.conversationHistory));
      localStorage.setItem('upsc-study-patterns', JSON.stringify(this.studyPatterns));
      localStorage.setItem('upsc-ai-personality', JSON.stringify(this.aiPersonality));
    } catch (error) {
      console.error('Error saving AI memory data:', error);
    }
  }

  // User Preferences Management
  setUserPreference(category: UserPreference['category'], key: string, value: any, source: UserPreference['source'] = 'user-input'): void {
    const existingIndex = this.userPreferences.findIndex(p => p.category === category && p.key === key);
    
    const preference: UserPreference = {
      id: existingIndex >= 0 ? this.userPreferences[existingIndex].id : `pref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      category,
      key,
      value,
      lastUpdated: new Date().toISOString(),
      source
    };

    if (existingIndex >= 0) {
      this.userPreferences[existingIndex] = preference;
    } else {
      this.userPreferences.push(preference);
    }

    this.saveData();
  }

  getUserPreference(category: UserPreference['category'], key: string): any {
    const preference = this.userPreferences.find(p => p.category === category && p.key === key);
    return preference?.value;
  }

  getUserPreferences(category?: UserPreference['category']): UserPreference[] {
    if (category) {
      return this.userPreferences.filter(p => p.category === category);
    }
    return [...this.userPreferences];
  }

  // Conversation Memory Management
  addConversation(userMessage: string, aiResponse: string, context?: ConversationMemory['context'], actions?: ConversationMemory['actionsTaken']): void {
    const conversation: ConversationMemory = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userMessage,
      aiResponse,
      context: context || {},
      actionsTaken: actions || []
    };

    this.conversationHistory.unshift(conversation);

    // Keep only the most recent conversations
    if (this.conversationHistory.length > this.MAX_CONVERSATIONS) {
      this.conversationHistory = this.conversationHistory.slice(0, this.MAX_CONVERSATIONS);
    }

    this.saveData();
  }

  getRecentConversations(limit: number = 10): ConversationMemory[] {
    return this.conversationHistory.slice(0, limit);
  }

  searchConversations(query: string, limit: number = 20): ConversationMemory[] {
    const queryLower = query.toLowerCase();
    return this.conversationHistory
      .filter(conv => 
        conv.userMessage.toLowerCase().includes(queryLower) ||
        conv.aiResponse.toLowerCase().includes(queryLower) ||
        conv.context.topic?.toLowerCase().includes(queryLower)
      )
      .slice(0, limit);
  }

  // Study Pattern Management
  addStudyPattern(pattern: Omit<StudyPattern, 'id'>): void {
    const studyPattern: StudyPattern = {
      ...pattern,
      id: `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Remove existing pattern for the same date
    this.studyPatterns = this.studyPatterns.filter(p => p.date !== pattern.date);
    this.studyPatterns.unshift(studyPattern);

    // Keep only recent patterns
    if (this.studyPatterns.length > this.MAX_STUDY_PATTERNS) {
      this.studyPatterns = this.studyPatterns.slice(0, this.MAX_STUDY_PATTERNS);
    }

    this.saveData();
  }

  getStudyPatterns(days: number = 30): StudyPattern[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.studyPatterns.filter(pattern => {
      const patternDate = new Date(pattern.date);
      return patternDate >= cutoffDate;
    });
  }

  // AI Personality Management
  updateAIPersonality(updates: Partial<AIPersonality>): void {
    this.aiPersonality = { ...this.aiPersonality, ...updates };
    this.saveData();
  }

  getAIPersonality(): AIPersonality {
    return { ...this.aiPersonality };
  }

  // Context Generation for AI
  generateContextForAI(): {
    preferences: UserPreference[];
    recentConversations: ConversationMemory[];
    studyPatterns: StudyPattern[];
    personality: AIPersonality;
    insights: string[];
  } {
    const recentConversations = this.getRecentConversations(5);
    const recentPatterns = this.getStudyPatterns(7);
    
    // Generate insights based on data
    const insights = this.generateInsights(recentPatterns, recentConversations);

    return {
      preferences: this.userPreferences,
      recentConversations,
      studyPatterns: recentPatterns,
      personality: this.aiPersonality,
      insights
    };
  }

  // Generate insights from user data
  private generateInsights(patterns: StudyPattern[], conversations: ConversationMemory[]): string[] {
    const insights: string[] = [];

    // Study pattern insights
    if (patterns.length > 0) {
      const avgHours = patterns.reduce((sum, p) => sum + p.studyHours, 0) / patterns.length;
      const avgProductivity = patterns.reduce((sum, p) => sum + p.productivity, 0) / patterns.length;
      
      insights.push(`Average study hours: ${avgHours.toFixed(1)} hours/day`);
      insights.push(`Average productivity: ${avgProductivity.toFixed(1)}/10`);

      // Most studied subjects
      const subjectCounts: Record<string, number> = {};
      patterns.forEach(p => {
        p.subjects.forEach(subject => {
          subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
        });
      });
      
      const topSubjects = Object.entries(subjectCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([subject]) => subject);
      
      if (topSubjects.length > 0) {
        insights.push(`Most studied subjects: ${topSubjects.join(', ')}`);
      }
    }

    // Conversation insights
    if (conversations.length > 0) {
      const topics = conversations
        .map(c => c.context.topic)
        .filter(Boolean)
        .slice(0, 3);
      
      if (topics.length > 0) {
        insights.push(`Recent discussion topics: ${topics.join(', ')}`);
      }
    }

    return insights;
  }

  // Learn from user behavior
  learnFromBehavior(action: string, context: any): void {
    // Example: Learn preferred study times
    if (action === 'study-session-started') {
      const hour = new Date().getHours();
      this.setUserPreference('study', 'preferred-study-hour', hour, 'behavior-analysis');
    }

    // Example: Learn preferred subjects
    if (action === 'subject-accessed' && context.subject) {
      const currentCount = this.getUserPreference('study', `subject-access-${context.subject}`) || 0;
      this.setUserPreference('study', `subject-access-${context.subject}`, currentCount + 1, 'behavior-analysis');
    }

    // Learn dashboard preferences
    if (action === 'dashboard-widget-moved' && context.widgetId) {
      this.setUserPreference('dashboard', `widget-${context.widgetId}-position`, context.position, 'user-action');
    }

    if (action === 'dashboard-widget-resized' && context.widgetId) {
      this.setUserPreference('dashboard', `widget-${context.widgetId}-size`, context.size, 'user-action');
    }

    if (action === 'dashboard-layout-changed') {
      this.setUserPreference('dashboard', 'preferred-layout', context.layout, 'user-action');
    }

    // Learn bookmark patterns
    if (action === 'bookmark-added' && context.category) {
      const currentCount = this.getUserPreference('bookmarks', `category-${context.category}`) || 0;
      this.setUserPreference('bookmarks', `category-${context.category}`, currentCount + 1, 'behavior-analysis');
    }
  }

  // Dashboard management methods
  getDashboardPreferences(): any {
    return {
      preferredLayout: this.getUserPreference('dashboard', 'preferred-layout'),
      widgetPositions: this.userPreferences
        .filter(p => p.category === 'dashboard' && p.key.includes('position'))
        .reduce((acc, p) => {
          const widgetId = p.key.replace('widget-', '').replace('-position', '');
          acc[widgetId] = p.value;
          return acc;
        }, {} as Record<string, any>),
      widgetSizes: this.userPreferences
        .filter(p => p.category === 'dashboard' && p.key.includes('size'))
        .reduce((acc, p) => {
          const widgetId = p.key.replace('widget-', '').replace('-size', '');
          acc[widgetId] = p.value;
          return acc;
        }, {} as Record<string, any>)
    };
  }

  // Bookmark integration methods
  getBookmarkInsights(): any {
    const bookmarkPrefs = this.userPreferences.filter(p => p.category === 'bookmarks');
    const categoryStats = bookmarkPrefs.reduce((acc, p) => {
      if (p.key.startsWith('category-')) {
        const category = p.key.replace('category-', '');
        acc[category] = p.value;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      favoriteCategories: Object.entries(categoryStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([category]) => category),
      totalBookmarks: Object.values(categoryStats).reduce((sum, count) => sum + count, 0),
      categoryDistribution: categoryStats
    };
  }

  // Clear all data (for privacy/reset)
  clearAllData(): void {
    this.userPreferences = [];
    this.conversationHistory = [];
    this.studyPatterns = [];
    this.aiPersonality = this.getDefaultPersonality();
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('upsc-ai-preferences');
      localStorage.removeItem('upsc-ai-conversations');
      localStorage.removeItem('upsc-study-patterns');
      localStorage.removeItem('upsc-ai-personality');
    }
  }

  // Export data for backup
  exportData(): string {
    return JSON.stringify({
      preferences: this.userPreferences,
      conversations: this.conversationHistory,
      patterns: this.studyPatterns,
      personality: this.aiPersonality,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  // Import data from backup
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.preferences) this.userPreferences = data.preferences;
      if (data.conversations) this.conversationHistory = data.conversations;
      if (data.patterns) this.studyPatterns = data.patterns;
      if (data.personality) this.aiPersonality = { ...this.getDefaultPersonality(), ...data.personality };
      
      this.saveData();
      return true;
    } catch (error) {
      console.error('Error importing AI memory data:', error);
      return false;
    }
  }
}

export default AIMemoryService;
