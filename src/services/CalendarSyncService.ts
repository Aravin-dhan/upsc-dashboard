'use client';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  duration?: number; // in minutes
  type: 'study' | 'exam' | 'revision' | 'break' | 'other';
  priority: 'low' | 'medium' | 'high';
  completed?: boolean;
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly';
    endDate?: string;
  };
  reminders?: number[]; // minutes before event
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleBlock {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  date: string;
  type: 'study' | 'practice' | 'revision' | 'break';
  priority: 'low' | 'medium' | 'high';
  completed?: boolean;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Today's Schedule specific interface for dashboard widget
export interface TodayScheduleItem {
  id: string;
  time: string;
  subject: string;
  status: 'pending' | 'in-progress' | 'completed';
  color: string;
  duration: number;
  topics: string[];
  date: string;
}

export interface TodayScheduleData {
  date: string;
  schedule: TodayScheduleItem[];
  stats: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    completionRate: number;
  };
  totalStudyTime: number;
  completedStudyTime: number;
}

// Performance Overview interfaces
export interface PerformanceMetric {
  id: string;
  subject: string;
  score: number;
  maxScore: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export interface PerformanceData {
  overall: {
    averageScore: number;
    totalTests: number;
    improvement: number;
    rank: number;
  };
  subjects: PerformanceMetric[];
  recentTests: {
    id: string;
    name: string;
    score: number;
    maxScore: number;
    date: string;
    subject: string;
  }[];
  weeklyProgress: {
    week: string;
    score: number;
  }[];
}

// Syllabus Progress interfaces
export interface SyllabusItem {
  id: string;
  subject: string;
  topic: string;
  subtopics: string[];
  status: 'not-started' | 'in-progress' | 'completed' | 'revision';
  priority: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedHours: number;
  completedHours: number;
  lastStudied: string;
  notes: string;
  resources: string[];
}

export interface SyllabusData {
  subjects: {
    name: string;
    totalTopics: number;
    completedTopics: number;
    inProgressTopics: number;
    completionPercentage: number;
    items: SyllabusItem[];
  }[];
  overall: {
    totalTopics: number;
    completedTopics: number;
    completionPercentage: number;
    totalHours: number;
    completedHours: number;
  };
}

// Revision Engine interfaces
export interface RevisionItem {
  id: string;
  topic: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  lastRevised: string;
  nextRevision: string;
  revisionCount: number;
  confidence: number;
  notes: string;
  tags: string[];
  status: 'pending' | 'in-progress' | 'completed';
}

export interface RevisionData {
  todayRevisions: RevisionItem[];
  upcomingRevisions: RevisionItem[];
  overdueRevisions: RevisionItem[];
  stats: {
    totalItems: number;
    completedToday: number;
    pendingToday: number;
    overdueCount: number;
    averageConfidence: number;
  };
}

// Current Affairs interfaces
export interface CurrentAffairItem {
  id: string;
  title: string;
  category: string;
  date: string;
  content: string;
  importance: 'low' | 'medium' | 'high';
  readStatus: 'unread' | 'reading' | 'read';
  bookmarked: boolean;
  tags: string[];
  source: string;
  relatedTopics: string[];
}

export interface CurrentAffairsData {
  recent: CurrentAffairItem[];
  categories: {
    name: string;
    count: number;
    unreadCount: number;
  }[];
  stats: {
    totalItems: number;
    readItems: number;
    unreadItems: number;
    bookmarkedItems: number;
    readingProgress: number;
  };
}

// Knowledge Base interfaces
export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lastAccessed: string;
  accessCount: number;
  isFavorite: boolean;
  relatedItems: string[];
  attachments: string[];
}

export interface KnowledgeData {
  items: KnowledgeItem[];
  categories: {
    name: string;
    count: number;
    recentlyAdded: number;
  }[];
  stats: {
    totalItems: number;
    favoriteItems: number;
    recentlyAccessed: number;
    totalAccesses: number;
  };
  recentlyAccessed: KnowledgeItem[];
}

// Wellness Corner interfaces
export interface WellnessEntry {
  id: string;
  date: string;
  mood: 'excellent' | 'good' | 'neutral' | 'poor' | 'terrible';
  energy: number; // 1-10
  stress: number; // 1-10
  sleep: number; // hours
  exercise: number; // minutes
  studyHours: number;
  notes: string;
  activities: string[];
}

export interface WellnessData {
  todayEntry: WellnessEntry | null;
  weeklyData: WellnessEntry[];
  stats: {
    averageMood: number;
    averageEnergy: number;
    averageStress: number;
    averageSleep: number;
    totalExercise: number;
    wellnessScore: number;
  };
  recommendations: string[];
}

// AI Insights interfaces
export interface AIInsight {
  id: string;
  type: 'performance' | 'study-plan' | 'wellness' | 'motivation' | 'strategy';
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  confidence: number;
  actionable: boolean;
  implemented: boolean;
  createdAt: string;
  expiresAt: string;
  relatedData: any;
}

export interface AIInsightsData {
  insights: AIInsight[];
  personalizedRecommendations: {
    studyPlan: string[];
    focusAreas: string[];
    improvementSuggestions: string[];
    motivationalTips: string[];
  };
  behaviorAnalysis: {
    studyPatterns: any;
    performanceTrends: any;
    wellnessCorrelations: any;
  };
  stats: {
    totalInsights: number;
    implementedInsights: number;
    averageConfidence: number;
    lastUpdated: string;
  };
}

type SyncListener = (data: CalendarEvent[] | ScheduleBlock[]) => void;
type TodayScheduleListener = (data: TodayScheduleData) => void;
type PerformanceListener = (data: PerformanceData) => void;
type SyllabusListener = (data: SyllabusData) => void;
type RevisionListener = (data: RevisionData) => void;
type CurrentAffairsListener = (data: CurrentAffairsData) => void;
type KnowledgeListener = (data: KnowledgeData) => void;
type WellnessListener = (data: WellnessData) => void;
type AIInsightsListener = (data: AIInsightsData) => void;

class CalendarSyncService {
  private static instance: CalendarSyncService;

  // Original listeners
  private calendarListeners: Set<SyncListener> = new Set();
  private scheduleListeners: Set<SyncListener> = new Set();

  // Widget-specific listeners
  private todayScheduleListeners: Set<TodayScheduleListener> = new Set();
  private performanceListeners: Set<PerformanceListener> = new Set();
  private syllabusListeners: Set<SyllabusListener> = new Set();
  private revisionListeners: Set<RevisionListener> = new Set();
  private currentAffairsListeners: Set<CurrentAffairsListener> = new Set();
  private knowledgeListeners: Set<KnowledgeListener> = new Set();
  private wellnessListeners: Set<WellnessListener> = new Set();
  private aiInsightsListeners: Set<AIInsightsListener> = new Set();

  // Original data
  private calendarEvents: CalendarEvent[] = [];
  private scheduleBlocks: ScheduleBlock[] = [];

  // Widget-specific data
  private todayScheduleData: TodayScheduleData | null = null;
  private performanceData: PerformanceData | null = null;
  private syllabusData: SyllabusData | null = null;
  private revisionData: RevisionData | null = null;
  private currentAffairsData: CurrentAffairsData | null = null;
  private knowledgeData: KnowledgeData | null = null;
  private wellnessData: WellnessData | null = null;
  private aiInsightsData: AIInsightsData | null = null;

  // Loading states
  private isLoadingTodaySchedule = false;
  private isLoadingPerformance = false;
  private isLoadingSyllabus = false;
  private isLoadingRevision = false;
  private isLoadingCurrentAffairs = false;
  private isLoadingKnowledge = false;
  private isLoadingWellness = false;
  private isLoadingAIInsights = false;

  // Error states
  private todayScheduleError: string | null = null;
  private performanceError: string | null = null;
  private syllabusError: string | null = null;
  private revisionError: string | null = null;
  private currentAffairsError: string | null = null;
  private knowledgeError: string | null = null;
  private wellnessError: string | null = null;
  private aiInsightsError: string | null = null;

  private constructor() {
    this.loadData();
    this.setupStorageListener();
  }

  static getInstance(): CalendarSyncService {
    if (!CalendarSyncService.instance) {
      CalendarSyncService.instance = new CalendarSyncService();
    }
    return CalendarSyncService.instance;
  }

  // Load data from localStorage
  private loadData() {
    if (typeof window === 'undefined') return;

    try {
      const calendarData = localStorage.getItem('upsc-calendar-events');
      const scheduleData = localStorage.getItem('upsc-schedule-blocks');

      this.calendarEvents = calendarData ? JSON.parse(calendarData) : [];
      this.scheduleBlocks = scheduleData ? JSON.parse(scheduleData) : [];
    } catch (error) {
      console.error('Error loading calendar/schedule data:', error);
      this.calendarEvents = [];
      this.scheduleBlocks = [];
    }
  }

  // Save data to localStorage
  private saveData() {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('upsc-calendar-events', JSON.stringify(this.calendarEvents));
      localStorage.setItem('upsc-schedule-blocks', JSON.stringify(this.scheduleBlocks));
    } catch (error) {
      console.error('Error saving calendar/schedule data:', error);
    }
  }

  // Setup storage event listener for cross-tab synchronization
  private setupStorageListener() {
    if (typeof window === 'undefined') return;

    window.addEventListener('storage', (event) => {
      if (event.key === 'upsc-calendar-events') {
        this.calendarEvents = event.newValue ? JSON.parse(event.newValue) : [];
        this.notifyCalendarListeners();
      } else if (event.key === 'upsc-schedule-blocks') {
        this.scheduleBlocks = event.newValue ? JSON.parse(event.newValue) : [];
        this.notifyScheduleListeners();
      }
    });
  }

  // Notify all calendar listeners
  private notifyCalendarListeners() {
    this.calendarListeners.forEach(listener => {
      try {
        listener(this.calendarEvents);
      } catch (error) {
        console.error('Error notifying calendar listener:', error);
      }
    });
  }

  // Notify all schedule listeners
  private notifyScheduleListeners() {
    this.scheduleListeners.forEach(listener => {
      try {
        listener(this.scheduleBlocks);
      } catch (error) {
        console.error('Error notifying schedule listener:', error);
      }
    });
  }

  // Calendar Events Management
  getCalendarEvents(): CalendarEvent[] {
    return [...this.calendarEvents];
  }

  addCalendarEvent(event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): CalendarEvent {
    const newEvent: CalendarEvent = {
      ...event,
      id: `cal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.calendarEvents.push(newEvent);
    this.saveData();
    this.notifyCalendarListeners();
    return newEvent;
  }

  updateCalendarEvent(id: string, updates: Partial<CalendarEvent>): CalendarEvent | null {
    const index = this.calendarEvents.findIndex(event => event.id === id);
    if (index === -1) return null;

    this.calendarEvents[index] = {
      ...this.calendarEvents[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveData();
    this.notifyCalendarListeners();
    return this.calendarEvents[index];
  }

  deleteCalendarEvent(id: string): boolean {
    const index = this.calendarEvents.findIndex(event => event.id === id);
    if (index === -1) return false;

    this.calendarEvents.splice(index, 1);
    this.saveData();
    this.notifyCalendarListeners();
    return true;
  }

  // Schedule Blocks Management
  getScheduleBlocks(): ScheduleBlock[] {
    return [...this.scheduleBlocks];
  }

  addScheduleBlock(block: Omit<ScheduleBlock, 'id' | 'createdAt' | 'updatedAt'>): ScheduleBlock {
    const newBlock: ScheduleBlock = {
      ...block,
      id: `sch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.scheduleBlocks.push(newBlock);
    this.saveData();
    this.notifyScheduleListeners();
    return newBlock;
  }

  updateScheduleBlock(id: string, updates: Partial<ScheduleBlock>): ScheduleBlock | null {
    const index = this.scheduleBlocks.findIndex(block => block.id === id);
    if (index === -1) return null;

    this.scheduleBlocks[index] = {
      ...this.scheduleBlocks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveData();
    this.notifyScheduleListeners();
    return this.scheduleBlocks[index];
  }

  deleteScheduleBlock(id: string): boolean {
    const index = this.scheduleBlocks.findIndex(block => block.id === id);
    if (index === -1) return false;

    this.scheduleBlocks.splice(index, 1);
    this.saveData();
    this.notifyScheduleListeners();
    return true;
  }

  // Subscription Management
  subscribeToCalendar(listener: SyncListener): () => void {
    this.calendarListeners.add(listener);
    // Immediately call with current data
    listener(this.calendarEvents);
    
    return () => {
      this.calendarListeners.delete(listener);
    };
  }

  subscribeToSchedule(listener: SyncListener): () => void {
    this.scheduleListeners.add(listener);
    // Immediately call with current data
    listener(this.scheduleBlocks);
    
    return () => {
      this.scheduleListeners.delete(listener);
    };
  }

  // Utility Methods
  getEventsForDate(date: string): CalendarEvent[] {
    return this.calendarEvents.filter(event => event.date === date);
  }

  getScheduleForDate(date: string): ScheduleBlock[] {
    return this.scheduleBlocks.filter(block => block.date === date);
  }

  getTodaysEvents(): CalendarEvent[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getEventsForDate(today);
  }

  getTodaysSchedule(): ScheduleBlock[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getScheduleForDate(today);
  }

  // Sync with external calendar (future enhancement)
  async syncWithExternalCalendar(provider: 'google' | 'outlook'): Promise<void> {
    // Placeholder for future implementation
    console.log(`Syncing with ${provider} calendar...`);
  }

  // Export/Import functionality
  exportData(): { calendar: CalendarEvent[], schedule: ScheduleBlock[] } {
    return {
      calendar: this.calendarEvents,
      schedule: this.scheduleBlocks
    };
  }

  importData(data: { calendar?: CalendarEvent[], schedule?: ScheduleBlock[] }): void {
    if (data.calendar) {
      this.calendarEvents = data.calendar;
    }
    if (data.schedule) {
      this.scheduleBlocks = data.schedule;
    }
    
    this.saveData();
    this.notifyCalendarListeners();
    this.notifyScheduleListeners();
  }

  // Clear all data
  clearAllData(): void {
    this.calendarEvents = [];
    this.scheduleBlocks = [];
    this.saveData();
    this.notifyCalendarListeners();
    this.notifyScheduleListeners();
  }

  // TODAY'S SCHEDULE SYNCHRONIZATION METHODS

  // Subscribe to today's schedule changes
  subscribeTodaySchedule(listener: TodayScheduleListener): () => void {
    this.todayScheduleListeners.add(listener);

    // Immediately provide current data if available
    if (this.todayScheduleData) {
      listener(this.todayScheduleData);
    }

    // Return unsubscribe function
    return () => {
      this.todayScheduleListeners.delete(listener);
    };
  }

  // Notify all today's schedule listeners
  private notifyTodayScheduleListeners(): void {
    if (this.todayScheduleData) {
      this.todayScheduleListeners.forEach(listener => {
        try {
          listener(this.todayScheduleData!);
        } catch (error) {
          console.error('Error in today schedule listener:', error);
        }
      });
    }
  }

  // Fetch today's schedule from API
  async fetchTodaySchedule(): Promise<TodayScheduleData> {
    try {
      this.isLoadingTodaySchedule = true;
      this.todayScheduleError = null;

      console.log('🔄 Fetching today\'s schedule...');

      const response = await fetch('/api/calendar/today', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Calendar API error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch today\'s schedule');
      }

      const todayScheduleData: TodayScheduleData = {
        date: result.data.date,
        schedule: result.data.schedule.map((item: any, index: number) => ({
          id: item.id || `schedule-${index}`,
          time: item.time,
          subject: item.subject,
          status: item.status,
          color: item.color,
          duration: item.duration || 60,
          topics: item.topics || [],
          date: result.data.date
        })),
        stats: result.data.stats,
        totalStudyTime: result.data.totalStudyTime,
        completedStudyTime: result.data.completedStudyTime
      };

      console.log('✅ Today\'s schedule fetched successfully:', todayScheduleData);

      this.todayScheduleData = todayScheduleData;
      this.notifyTodayScheduleListeners();

      return todayScheduleData;
    } catch (error) {
      console.error('❌ Error fetching today\'s schedule:', error);
      this.todayScheduleError = error instanceof Error ? error.message : 'Failed to fetch today\'s schedule';

      // Return fallback data to prevent UI breaks
      const fallbackData = this.getTodayScheduleFallbackData();
      this.todayScheduleData = fallbackData;
      this.notifyTodayScheduleListeners();

      throw error;
    } finally {
      this.isLoadingTodaySchedule = false;
    }
  }

  // Update schedule item status
  async updateTodayScheduleItem(itemId: string, updates: Partial<TodayScheduleItem>): Promise<void> {
    try {
      console.log('🔄 Updating today\'s schedule item:', itemId, updates);

      const response = await fetch('/api/calendar/today', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          itemId,
          updates
        }),
      });

      if (!response.ok) {
        throw new Error(`Update failed: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to update schedule item');
      }

      console.log('✅ Today\'s schedule item updated successfully');

      // Refresh data to get latest state
      await this.fetchTodaySchedule();

    } catch (error) {
      console.error('❌ Error updating today\'s schedule item:', error);
      throw error;
    }
  }

  // Get current today's schedule data
  getTodayScheduleData(): TodayScheduleData | null {
    return this.todayScheduleData;
  }

  // Get today's schedule loading state
  getTodayScheduleLoadingState(): boolean {
    return this.isLoadingTodaySchedule;
  }

  // Get today's schedule error state
  getTodayScheduleError(): string | null {
    return this.todayScheduleError;
  }

  // Get fallback data for today's schedule
  private getTodayScheduleFallbackData(): TodayScheduleData {
    const today = new Date().toISOString().split('T')[0];
    return {
      date: today,
      schedule: [
        {
          id: 'fallback-1',
          time: '9:00 AM',
          subject: 'History - Ancient India',
          status: 'pending',
          color: 'blue',
          duration: 120,
          topics: ['Indus Valley Civilization'],
          date: today
        },
        {
          id: 'fallback-2',
          time: '11:00 AM',
          subject: 'Polity - Constitutional Law',
          status: 'pending',
          color: 'green',
          duration: 90,
          topics: ['Fundamental Rights'],
          date: today
        }
      ],
      stats: {
        total: 2,
        completed: 0,
        pending: 2,
        inProgress: 0,
        completionRate: 0
      },
      totalStudyTime: 210,
      completedStudyTime: 0
    };
  }

  // Force refresh today's schedule
  async refreshTodaySchedule(): Promise<void> {
    await this.fetchTodaySchedule();
  }

  // PERFORMANCE OVERVIEW SYNCHRONIZATION METHODS

  // Subscribe to performance data changes
  subscribePerformance(listener: PerformanceListener): () => void {
    this.performanceListeners.add(listener);
    if (this.performanceData) {
      listener(this.performanceData);
    }
    return () => this.performanceListeners.delete(listener);
  }

  // Notify performance listeners
  private notifyPerformanceListeners(): void {
    if (this.performanceData) {
      this.performanceListeners.forEach(listener => {
        try {
          listener(this.performanceData!);
        } catch (error) {
          console.error('Error in performance listener:', error);
        }
      });
    }
  }

  // Fetch performance data
  async fetchPerformanceData(): Promise<PerformanceData> {
    try {
      this.isLoadingPerformance = true;
      this.performanceError = null;

      const response = await fetch('/api/performance/overview');
      if (!response.ok) throw new Error(`Performance API error: ${response.status}`);

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to fetch performance data');

      this.performanceData = result.data;
      this.notifyPerformanceListeners();
      return this.performanceData;
    } catch (error) {
      this.performanceError = error instanceof Error ? error.message : 'Failed to fetch performance data';
      const fallbackData = this.getPerformanceFallbackData();
      this.performanceData = fallbackData;
      this.notifyPerformanceListeners();
      throw error;
    } finally {
      this.isLoadingPerformance = false;
    }
  }

  // Get performance data
  getPerformanceData(): PerformanceData | null {
    return this.performanceData;
  }

  // Get performance loading state
  getPerformanceLoadingState(): boolean {
    return this.isLoadingPerformance;
  }

  // Get performance error
  getPerformanceError(): string | null {
    return this.performanceError;
  }

  // Performance fallback data
  private getPerformanceFallbackData(): PerformanceData {
    return {
      overall: {
        averageScore: 75,
        totalTests: 12,
        improvement: 8.5,
        rank: 245
      },
      subjects: [
        {
          id: 'history',
          subject: 'History',
          score: 78,
          maxScore: 100,
          percentage: 78,
          trend: 'up',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'polity',
          subject: 'Polity',
          score: 82,
          maxScore: 100,
          percentage: 82,
          trend: 'up',
          lastUpdated: new Date().toISOString()
        }
      ],
      recentTests: [
        {
          id: 'test-1',
          name: 'Mock Test 15',
          score: 85,
          maxScore: 100,
          date: new Date().toISOString(),
          subject: 'General Studies'
        }
      ],
      weeklyProgress: [
        { week: 'Week 1', score: 70 },
        { week: 'Week 2', score: 75 },
        { week: 'Week 3', score: 78 },
        { week: 'Week 4', score: 82 }
      ]
    };
  }

  // SYLLABUS PROGRESS SYNCHRONIZATION METHODS

  // Subscribe to syllabus data changes
  subscribeSyllabus(listener: SyllabusListener): () => void {
    this.syllabusListeners.add(listener);
    if (this.syllabusData) {
      listener(this.syllabusData);
    }
    return () => this.syllabusListeners.delete(listener);
  }

  // Notify syllabus listeners
  private notifySyllabusListeners(): void {
    if (this.syllabusData) {
      this.syllabusListeners.forEach(listener => {
        try {
          listener(this.syllabusData!);
        } catch (error) {
          console.error('Error in syllabus listener:', error);
        }
      });
    }
  }

  // Fetch syllabus data
  async fetchSyllabusData(): Promise<SyllabusData> {
    try {
      this.isLoadingSyllabus = true;
      this.syllabusError = null;

      const response = await fetch('/api/syllabus/progress');
      if (!response.ok) throw new Error(`Syllabus API error: ${response.status}`);

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to fetch syllabus data');

      this.syllabusData = result.data;
      this.notifySyllabusListeners();
      return this.syllabusData;
    } catch (error) {
      this.syllabusError = error instanceof Error ? error.message : 'Failed to fetch syllabus data';
      const fallbackData = this.getSyllabusFallbackData();
      this.syllabusData = fallbackData;
      this.notifySyllabusListeners();
      throw error;
    } finally {
      this.isLoadingSyllabus = false;
    }
  }

  // Update syllabus item
  async updateSyllabusItem(itemId: string, updates: Partial<SyllabusItem>): Promise<void> {
    try {
      const response = await fetch('/api/syllabus/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', itemId, updates })
      });

      if (!response.ok) throw new Error(`Update failed: ${response.status}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to update syllabus item');

      await this.fetchSyllabusData();
    } catch (error) {
      console.error('❌ Error updating syllabus item:', error);
      throw error;
    }
  }

  // Get syllabus data
  getSyllabusData(): SyllabusData | null {
    return this.syllabusData;
  }

  // Get syllabus loading state
  getSyllabusLoadingState(): boolean {
    return this.isLoadingSyllabus;
  }

  // Get syllabus error
  getSyllabusError(): string | null {
    return this.syllabusError;
  }

  // Syllabus fallback data
  private getSyllabusFallbackData(): SyllabusData {
    return {
      subjects: [
        {
          name: 'History',
          totalTopics: 25,
          completedTopics: 18,
          inProgressTopics: 4,
          completionPercentage: 72,
          items: [
            {
              id: 'history-1',
              subject: 'History',
              topic: 'Ancient India',
              subtopics: ['Indus Valley Civilization', 'Vedic Period'],
              status: 'completed',
              priority: 'high',
              difficulty: 'medium',
              estimatedHours: 8,
              completedHours: 8,
              lastStudied: new Date().toISOString(),
              notes: 'Completed with good understanding',
              resources: ['NCERT Class 11', 'Spectrum Modern History']
            }
          ]
        }
      ],
      overall: {
        totalTopics: 150,
        completedTopics: 95,
        completionPercentage: 63,
        totalHours: 500,
        completedHours: 315
      }
    };
  }

  // REVISION ENGINE SYNCHRONIZATION METHODS

  // Subscribe to revision data changes
  subscribeRevision(listener: RevisionListener): () => void {
    this.revisionListeners.add(listener);
    if (this.revisionData) {
      listener(this.revisionData);
    }
    return () => this.revisionListeners.delete(listener);
  }

  // Notify revision listeners
  private notifyRevisionListeners(): void {
    if (this.revisionData) {
      this.revisionListeners.forEach(listener => {
        try {
          listener(this.revisionData!);
        } catch (error) {
          console.error('Error in revision listener:', error);
        }
      });
    }
  }

  // Fetch revision data
  async fetchRevisionData(): Promise<RevisionData> {
    try {
      this.isLoadingRevision = true;
      this.revisionError = null;

      const response = await fetch('/api/revision/engine');
      if (!response.ok) throw new Error(`Revision API error: ${response.status}`);

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to fetch revision data');

      this.revisionData = result.data;
      this.notifyRevisionListeners();
      return this.revisionData;
    } catch (error) {
      this.revisionError = error instanceof Error ? error.message : 'Failed to fetch revision data';
      const fallbackData = this.getRevisionFallbackData();
      this.revisionData = fallbackData;
      this.notifyRevisionListeners();
      throw error;
    } finally {
      this.isLoadingRevision = false;
    }
  }

  // Update revision item
  async updateRevisionItem(itemId: string, updates: Partial<RevisionItem>): Promise<void> {
    try {
      const response = await fetch('/api/revision/engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', itemId, updates })
      });

      if (!response.ok) throw new Error(`Update failed: ${response.status}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to update revision item');

      await this.fetchRevisionData();
    } catch (error) {
      console.error('❌ Error updating revision item:', error);
      throw error;
    }
  }

  // Get revision data
  getRevisionData(): RevisionData | null {
    return this.revisionData;
  }

  // Get revision loading state
  getRevisionLoadingState(): boolean {
    return this.isLoadingRevision;
  }

  // Get revision error
  getRevisionError(): string | null {
    return this.revisionError;
  }

  // Revision fallback data
  private getRevisionFallbackData(): RevisionData {
    const today = new Date().toISOString();
    return {
      todayRevisions: [
        {
          id: 'rev-1',
          topic: 'Constitutional Amendments',
          subject: 'Polity',
          priority: 'high',
          difficulty: 'medium',
          lastRevised: today,
          nextRevision: today,
          revisionCount: 3,
          confidence: 7,
          notes: 'Focus on recent amendments',
          tags: ['constitution', 'amendments'],
          status: 'pending'
        }
      ],
      upcomingRevisions: [],
      overdueRevisions: [],
      stats: {
        totalItems: 45,
        completedToday: 3,
        pendingToday: 8,
        overdueCount: 2,
        averageConfidence: 7.2
      }
    };
  }

  // CURRENT AFFAIRS SYNCHRONIZATION METHODS

  // Subscribe to current affairs data changes
  subscribeCurrentAffairs(listener: CurrentAffairsListener): () => void {
    this.currentAffairsListeners.add(listener);
    if (this.currentAffairsData) {
      listener(this.currentAffairsData);
    }
    return () => this.currentAffairsListeners.delete(listener);
  }

  // Notify current affairs listeners
  private notifyCurrentAffairsListeners(): void {
    if (this.currentAffairsData) {
      this.currentAffairsListeners.forEach(listener => {
        try {
          listener(this.currentAffairsData!);
        } catch (error) {
          console.error('Error in current affairs listener:', error);
        }
      });
    }
  }

  // Fetch current affairs data
  async fetchCurrentAffairsData(): Promise<CurrentAffairsData> {
    try {
      this.isLoadingCurrentAffairs = true;
      this.currentAffairsError = null;

      const response = await fetch('/api/current-affairs');
      if (!response.ok) throw new Error(`Current Affairs API error: ${response.status}`);

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to fetch current affairs data');

      this.currentAffairsData = result.data;
      this.notifyCurrentAffairsListeners();
      return this.currentAffairsData;
    } catch (error) {
      this.currentAffairsError = error instanceof Error ? error.message : 'Failed to fetch current affairs data';
      const fallbackData = this.getCurrentAffairsFallbackData();
      this.currentAffairsData = fallbackData;
      this.notifyCurrentAffairsListeners();
      throw error;
    } finally {
      this.isLoadingCurrentAffairs = false;
    }
  }

  // Update current affairs item
  async updateCurrentAffairsItem(itemId: string, updates: Partial<CurrentAffairItem>): Promise<void> {
    try {
      const response = await fetch('/api/current-affairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', itemId, updates })
      });

      if (!response.ok) throw new Error(`Update failed: ${response.status}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to update current affairs item');

      await this.fetchCurrentAffairsData();
    } catch (error) {
      console.error('❌ Error updating current affairs item:', error);
      throw error;
    }
  }

  // Get current affairs data
  getCurrentAffairsData(): CurrentAffairsData | null {
    return this.currentAffairsData;
  }

  // Get current affairs loading state
  getCurrentAffairsLoadingState(): boolean {
    return this.isLoadingCurrentAffairs;
  }

  // Get current affairs error
  getCurrentAffairsError(): string | null {
    return this.currentAffairsError;
  }

  // Current affairs fallback data
  private getCurrentAffairsFallbackData(): CurrentAffairsData {
    return {
      recent: [
        {
          id: 'ca-1',
          title: 'Union Budget 2024-25 Highlights',
          category: 'Economy',
          date: new Date().toISOString(),
          content: 'Key highlights from the Union Budget...',
          importance: 'high',
          readStatus: 'unread',
          bookmarked: false,
          tags: ['budget', 'economy', 'finance'],
          source: 'PIB',
          relatedTopics: ['Economic Survey', 'Fiscal Policy']
        }
      ],
      categories: [
        { name: 'Economy', count: 25, unreadCount: 8 },
        { name: 'Polity', count: 18, unreadCount: 5 },
        { name: 'International Relations', count: 22, unreadCount: 12 }
      ],
      stats: {
        totalItems: 150,
        readItems: 95,
        unreadItems: 55,
        bookmarkedItems: 25,
        readingProgress: 63
      }
    };
  }

  // KNOWLEDGE BASE SYNCHRONIZATION METHODS

  // Subscribe to knowledge data changes
  subscribeKnowledge(listener: KnowledgeListener): () => void {
    this.knowledgeListeners.add(listener);
    if (this.knowledgeData) {
      listener(this.knowledgeData);
    }
    return () => this.knowledgeListeners.delete(listener);
  }

  // Notify knowledge listeners
  private notifyKnowledgeListeners(): void {
    if (this.knowledgeData) {
      this.knowledgeListeners.forEach(listener => {
        try {
          listener(this.knowledgeData!);
        } catch (error) {
          console.error('Error in knowledge listener:', error);
        }
      });
    }
  }

  // Fetch knowledge data
  async fetchKnowledgeData(): Promise<KnowledgeData> {
    try {
      this.isLoadingKnowledge = true;
      this.knowledgeError = null;

      const response = await fetch('/api/knowledge-base');
      if (!response.ok) throw new Error(`Knowledge API error: ${response.status}`);

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to fetch knowledge data');

      this.knowledgeData = result.data;
      this.notifyKnowledgeListeners();
      return this.knowledgeData;
    } catch (error) {
      this.knowledgeError = error instanceof Error ? error.message : 'Failed to fetch knowledge data';
      const fallbackData = this.getKnowledgeFallbackData();
      this.knowledgeData = fallbackData;
      this.notifyKnowledgeListeners();
      throw error;
    } finally {
      this.isLoadingKnowledge = false;
    }
  }

  // Update knowledge item
  async updateKnowledgeItem(itemId: string, updates: Partial<KnowledgeItem>): Promise<void> {
    try {
      const response = await fetch('/api/knowledge-base', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', itemId, updates })
      });

      if (!response.ok) throw new Error(`Update failed: ${response.status}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to update knowledge item');

      await this.fetchKnowledgeData();
    } catch (error) {
      console.error('❌ Error updating knowledge item:', error);
      throw error;
    }
  }

  // Get knowledge data
  getKnowledgeData(): KnowledgeData | null {
    return this.knowledgeData;
  }

  // Get knowledge loading state
  getKnowledgeLoadingState(): boolean {
    return this.isLoadingKnowledge;
  }

  // Get knowledge error
  getKnowledgeError(): string | null {
    return this.knowledgeError;
  }

  // Knowledge fallback data
  private getKnowledgeFallbackData(): KnowledgeData {
    return {
      items: [
        {
          id: 'kb-1',
          title: 'Constitutional Framework of India',
          content: 'Comprehensive notes on Indian Constitution...',
          category: 'Polity',
          tags: ['constitution', 'fundamental rights', 'dpsp'],
          difficulty: 'intermediate',
          lastAccessed: new Date().toISOString(),
          accessCount: 15,
          isFavorite: true,
          relatedItems: ['kb-2', 'kb-3'],
          attachments: []
        }
      ],
      categories: [
        { name: 'Polity', count: 45, recentlyAdded: 3 },
        { name: 'History', count: 38, recentlyAdded: 2 },
        { name: 'Geography', count: 32, recentlyAdded: 1 }
      ],
      stats: {
        totalItems: 250,
        favoriteItems: 35,
        recentlyAccessed: 12,
        totalAccesses: 1250
      },
      recentlyAccessed: []
    };
  }

  // WELLNESS CORNER SYNCHRONIZATION METHODS

  // Subscribe to wellness data changes
  subscribeWellness(listener: WellnessListener): () => void {
    this.wellnessListeners.add(listener);
    if (this.wellnessData) {
      listener(this.wellnessData);
    }
    return () => this.wellnessListeners.delete(listener);
  }

  // Notify wellness listeners
  private notifyWellnessListeners(): void {
    if (this.wellnessData) {
      this.wellnessListeners.forEach(listener => {
        try {
          listener(this.wellnessData!);
        } catch (error) {
          console.error('Error in wellness listener:', error);
        }
      });
    }
  }

  // Fetch wellness data
  async fetchWellnessData(): Promise<WellnessData> {
    try {
      this.isLoadingWellness = true;
      this.wellnessError = null;

      const response = await fetch('/api/wellness');
      if (!response.ok) throw new Error(`Wellness API error: ${response.status}`);

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to fetch wellness data');

      this.wellnessData = result.data;
      this.notifyWellnessListeners();
      return this.wellnessData;
    } catch (error) {
      this.wellnessError = error instanceof Error ? error.message : 'Failed to fetch wellness data';
      const fallbackData = this.getWellnessFallbackData();
      this.wellnessData = fallbackData;
      this.notifyWellnessListeners();
      throw error;
    } finally {
      this.isLoadingWellness = false;
    }
  }

  // Update wellness entry
  async updateWellnessEntry(entryId: string, updates: Partial<WellnessEntry>): Promise<void> {
    try {
      const response = await fetch('/api/wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', entryId, updates })
      });

      if (!response.ok) throw new Error(`Update failed: ${response.status}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to update wellness entry');

      await this.fetchWellnessData();
    } catch (error) {
      console.error('❌ Error updating wellness entry:', error);
      throw error;
    }
  }

  // Get wellness data
  getWellnessData(): WellnessData | null {
    return this.wellnessData;
  }

  // Get wellness loading state
  getWellnessLoadingState(): boolean {
    return this.isLoadingWellness;
  }

  // Get wellness error
  getWellnessError(): string | null {
    return this.wellnessError;
  }

  // Wellness fallback data
  private getWellnessFallbackData(): WellnessData {
    const today = new Date().toISOString().split('T')[0];
    return {
      todayEntry: {
        id: 'wellness-today',
        date: today,
        mood: 'good',
        energy: 7,
        stress: 4,
        sleep: 7.5,
        exercise: 30,
        studyHours: 6,
        notes: 'Feeling productive today',
        activities: ['meditation', 'reading', 'exercise']
      },
      weeklyData: [],
      stats: {
        averageMood: 3.8,
        averageEnergy: 7.2,
        averageStress: 4.1,
        averageSleep: 7.3,
        totalExercise: 180,
        wellnessScore: 78
      },
      recommendations: [
        'Try to maintain consistent sleep schedule',
        'Consider adding more physical activity',
        'Practice stress management techniques'
      ]
    };
  }

  // AI INSIGHTS SYNCHRONIZATION METHODS

  // Subscribe to AI insights data changes
  subscribeAIInsights(listener: AIInsightsListener): () => void {
    this.aiInsightsListeners.add(listener);
    if (this.aiInsightsData) {
      listener(this.aiInsightsData);
    }
    return () => this.aiInsightsListeners.delete(listener);
  }

  // Notify AI insights listeners
  private notifyAIInsightsListeners(): void {
    if (this.aiInsightsData) {
      this.aiInsightsListeners.forEach(listener => {
        try {
          listener(this.aiInsightsData!);
        } catch (error) {
          console.error('Error in AI insights listener:', error);
        }
      });
    }
  }

  // Fetch AI insights data
  async fetchAIInsightsData(): Promise<AIInsightsData> {
    try {
      this.isLoadingAIInsights = true;
      this.aiInsightsError = null;

      const response = await fetch('/api/ai-insights');
      if (!response.ok) throw new Error(`AI Insights API error: ${response.status}`);

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to fetch AI insights data');

      this.aiInsightsData = result.data;
      this.notifyAIInsightsListeners();
      return this.aiInsightsData;
    } catch (error) {
      this.aiInsightsError = error instanceof Error ? error.message : 'Failed to fetch AI insights data';
      const fallbackData = this.getAIInsightsFallbackData();
      this.aiInsightsData = fallbackData;
      this.notifyAIInsightsListeners();
      throw error;
    } finally {
      this.isLoadingAIInsights = false;
    }
  }

  // Update AI insight
  async updateAIInsight(insightId: string, updates: Partial<AIInsight>): Promise<void> {
    try {
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', insightId, updates })
      });

      if (!response.ok) throw new Error(`Update failed: ${response.status}`);
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to update AI insight');

      await this.fetchAIInsightsData();
    } catch (error) {
      console.error('❌ Error updating AI insight:', error);
      throw error;
    }
  }

  // Get AI insights data
  getAIInsightsData(): AIInsightsData | null {
    return this.aiInsightsData;
  }

  // Get AI insights loading state
  getAIInsightsLoadingState(): boolean {
    return this.isLoadingAIInsights;
  }

  // Get AI insights error
  getAIInsightsError(): string | null {
    return this.aiInsightsError;
  }

  // AI insights fallback data
  private getAIInsightsFallbackData(): AIInsightsData {
    const now = new Date().toISOString();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    return {
      insights: [
        {
          id: 'ai-1',
          type: 'performance',
          title: 'Focus on Polity Weak Areas',
          content: 'Your recent performance shows room for improvement in Constitutional Law topics. Consider dedicating 2 extra hours this week.',
          priority: 'high',
          confidence: 0.85,
          actionable: true,
          implemented: false,
          createdAt: now,
          expiresAt: tomorrow,
          relatedData: { subject: 'Polity', topics: ['Constitutional Law'] }
        }
      ],
      personalizedRecommendations: {
        studyPlan: [
          'Increase Polity study time by 20%',
          'Add more mock tests for Current Affairs'
        ],
        focusAreas: ['Constitutional Law', 'International Relations'],
        improvementSuggestions: [
          'Practice more MCQs for better speed',
          'Create mind maps for complex topics'
        ],
        motivationalTips: [
          'You\'ve improved 15% this month - keep it up!',
          'Consistency is key - maintain your study routine'
        ]
      },
      behaviorAnalysis: {
        studyPatterns: { peakHours: ['9-11 AM', '7-9 PM'], averageDaily: 6.5 },
        performanceTrends: { overall: 'improving' },
        wellnessCorrelations: { mood: 'positive', stress: 'manageable' }
      },
      stats: {
        totalInsights: 25,
        implementedInsights: 18,
        averageConfidence: 0.82,
        lastUpdated: now
      }
    };
  }

  // UNIVERSAL REFRESH METHOD
  async refreshAllData(): Promise<void> {
    const refreshPromises = [
      this.fetchTodaySchedule().catch(console.error),
      this.fetchPerformanceData().catch(console.error),
      this.fetchSyllabusData().catch(console.error),
      this.fetchRevisionData().catch(console.error),
      this.fetchCurrentAffairsData().catch(console.error),
      this.fetchKnowledgeData().catch(console.error),
      this.fetchWellnessData().catch(console.error),
      this.fetchAIInsightsData().catch(console.error)
    ];

    await Promise.allSettled(refreshPromises);
    console.log('✅ All widget data refreshed');
  }

  // CLEANUP METHOD
  destroy(): void {
    // Clear all listeners
    this.todayScheduleListeners.clear();
    this.performanceListeners.clear();
    this.syllabusListeners.clear();
    this.revisionListeners.clear();
    this.currentAffairsListeners.clear();
    this.knowledgeListeners.clear();
    this.wellnessListeners.clear();
    this.aiInsightsListeners.clear();

    // Clear all data
    this.todayScheduleData = null;
    this.performanceData = null;
    this.syllabusData = null;
    this.revisionData = null;
    this.currentAffairsData = null;
    this.knowledgeData = null;
    this.wellnessData = null;
    this.aiInsightsData = null;

    console.log('🧹 CalendarSyncService destroyed');
  }
}

export default CalendarSyncService;
