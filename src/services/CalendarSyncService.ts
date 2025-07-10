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

type SyncListener = (data: CalendarEvent[] | ScheduleBlock[]) => void;

class CalendarSyncService {
  private static instance: CalendarSyncService;
  private calendarListeners: Set<SyncListener> = new Set();
  private scheduleListeners: Set<SyncListener> = new Set();
  private calendarEvents: CalendarEvent[] = [];
  private scheduleBlocks: ScheduleBlock[] = [];

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
}

export default CalendarSyncService;
