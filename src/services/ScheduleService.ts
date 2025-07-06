export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  type: 'study' | 'revision' | 'practice' | 'break' | 'exam' | 'other';
  subject?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  reminders?: {
    enabled: boolean;
    minutes: number; // minutes before event
  };
  recurring?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate?: string;
  };
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleStats {
  totalEvents: number;
  todayEvents: number;
  completedToday: number;
  upcomingToday: number;
  weeklyHours: number;
  monthlyHours: number;
}

class ScheduleService {
  private static instance: ScheduleService;
  private storageKey = 'upsc-schedule-events';
  private listeners: Set<(events: ScheduleEvent[]) => void> = new Set();

  static getInstance(): ScheduleService {
    if (!ScheduleService.instance) {
      ScheduleService.instance = new ScheduleService();
    }
    return ScheduleService.instance;
  }

  // Event listener management for real-time updates
  subscribe(callback: (events: ScheduleEvent[]) => void): () => void {
    this.listeners.add(callback);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(events: ScheduleEvent[]): void {
    this.listeners.forEach(callback => {
      try {
        callback(events);
      } catch (error) {
        console.error('Error in schedule listener:', error);
      }
    });
  }

  // Core data operations
  getAllEvents(): ScheduleEvent[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      
      const events = JSON.parse(data);
      if (!Array.isArray(events)) {
        console.warn('Schedule data is not an array, resetting...');
        this.saveEvents([]);
        return [];
      }
      
      return events.map(event => this.validateEvent(event)).filter(Boolean) as ScheduleEvent[];
    } catch (error) {
      console.error('Error loading schedule events:', error);
      this.saveEvents([]); // Reset corrupted data
      return [];
    }
  }

  private validateEvent(event: any): ScheduleEvent | null {
    try {
      // Ensure required fields exist
      if (!event.id || !event.title || !event.startTime || !event.endTime) {
        console.warn('Invalid event missing required fields:', event);
        return null;
      }

      // Validate dates
      const startDate = new Date(event.startTime);
      const endDate = new Date(event.endTime);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.warn('Invalid event dates:', event);
        return null;
      }

      // Return validated event with defaults
      return {
        id: event.id,
        title: event.title,
        description: event.description || '',
        startTime: event.startTime,
        endTime: event.endTime,
        type: event.type || 'other',
        subject: event.subject || '',
        priority: event.priority || 'medium',
        status: event.status || 'scheduled',
        reminders: event.reminders || { enabled: false, minutes: 15 },
        recurring: event.recurring || { enabled: false, frequency: 'daily' },
        tags: event.tags || [],
        notes: event.notes || '',
        createdAt: event.createdAt || new Date().toISOString(),
        updatedAt: event.updatedAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error validating event:', error);
      return null;
    }
  }

  private saveEvents(events: ScheduleEvent[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(events));
      this.notifyListeners(events);
    } catch (error) {
      console.error('Error saving schedule events:', error);
      throw new Error('Failed to save schedule events');
    }
  }

  // CRUD operations
  addEvent(eventData: Omit<ScheduleEvent, 'id' | 'createdAt' | 'updatedAt'>): ScheduleEvent {
    const newEvent: ScheduleEvent = {
      ...eventData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const events = this.getAllEvents();
    events.push(newEvent);
    this.saveEvents(events);
    
    return newEvent;
  }

  updateEvent(id: string, updates: Partial<ScheduleEvent>): ScheduleEvent | null {
    const events = this.getAllEvents();
    const eventIndex = events.findIndex(event => event.id === id);
    
    if (eventIndex === -1) {
      console.warn('Event not found for update:', id);
      return null;
    }

    const updatedEvent = {
      ...events[eventIndex],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    events[eventIndex] = updatedEvent;
    this.saveEvents(events);
    
    return updatedEvent;
  }

  deleteEvent(id: string): boolean {
    const events = this.getAllEvents();
    const initialLength = events.length;
    const filteredEvents = events.filter(event => event.id !== id);
    
    if (filteredEvents.length === initialLength) {
      console.warn('Event not found for deletion:', id);
      return false;
    }

    this.saveEvents(filteredEvents);
    return true;
  }

  // Query operations
  getTodayEvents(): ScheduleEvent[] {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    return this.getAllEvents().filter(event => {
      const eventStart = new Date(event.startTime);
      return eventStart >= todayStart && eventStart < todayEnd;
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  getEventsForDate(date: Date): ScheduleEvent[] {
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    return this.getAllEvents().filter(event => {
      const eventStart = new Date(event.startTime);
      return eventStart >= dayStart && eventStart < dayEnd;
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  getEventsForDateRange(startDate: Date, endDate: Date): ScheduleEvent[] {
    return this.getAllEvents().filter(event => {
      const eventStart = new Date(event.startTime);
      return eventStart >= startDate && eventStart <= endDate;
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  getUpcomingEvents(limit: number = 5): ScheduleEvent[] {
    const now = new Date();
    return this.getAllEvents()
      .filter(event => new Date(event.startTime) > now && event.status !== 'cancelled')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, limit);
  }

  // Statistics
  getScheduleStats(): ScheduleStats {
    const allEvents = this.getAllEvents();
    const todayEvents = this.getTodayEvents();
    
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const weekEvents = this.getEventsForDateRange(weekStart, now);
    const monthEvents = this.getEventsForDateRange(monthStart, now);

    const calculateHours = (events: ScheduleEvent[]): number => {
      return events.reduce((total, event) => {
        const start = new Date(event.startTime);
        const end = new Date(event.endTime);
        return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }, 0);
    };

    return {
      totalEvents: allEvents.length,
      todayEvents: todayEvents.length,
      completedToday: todayEvents.filter(e => e.status === 'completed').length,
      upcomingToday: todayEvents.filter(e => e.status === 'scheduled' && new Date(e.startTime) > now).length,
      weeklyHours: calculateHours(weekEvents),
      monthlyHours: calculateHours(monthEvents)
    };
  }

  // Utility methods
  markEventComplete(id: string): ScheduleEvent | null {
    return this.updateEvent(id, { status: 'completed' });
  }

  markEventInProgress(id: string): ScheduleEvent | null {
    return this.updateEvent(id, { status: 'in-progress' });
  }

  rescheduleEvent(id: string, newStartTime: string, newEndTime: string): ScheduleEvent | null {
    return this.updateEvent(id, { 
      startTime: newStartTime, 
      endTime: newEndTime,
      status: 'scheduled' // Reset status when rescheduling
    });
  }

  // Bulk operations
  bulkUpdateEvents(updates: { id: string; updates: Partial<ScheduleEvent> }[]): ScheduleEvent[] {
    const events = this.getAllEvents();
    const updatedEvents: ScheduleEvent[] = [];

    updates.forEach(({ id, updates: eventUpdates }) => {
      const eventIndex = events.findIndex(event => event.id === id);
      if (eventIndex !== -1) {
        events[eventIndex] = {
          ...events[eventIndex],
          ...eventUpdates,
          id, // Ensure ID doesn't change
          updatedAt: new Date().toISOString()
        };
        updatedEvents.push(events[eventIndex]);
      }
    });

    this.saveEvents(events);
    return updatedEvents;
  }

  // Data management
  exportEvents(): string {
    return JSON.stringify(this.getAllEvents(), null, 2);
  }

  importEvents(jsonData: string): boolean {
    try {
      const events = JSON.parse(jsonData);
      if (!Array.isArray(events)) {
        throw new Error('Invalid data format');
      }

      const validatedEvents = events.map(event => this.validateEvent(event)).filter(Boolean) as ScheduleEvent[];
      this.saveEvents(validatedEvents);
      return true;
    } catch (error) {
      console.error('Error importing events:', error);
      return false;
    }
  }

  clearAllEvents(): void {
    this.saveEvents([]);
  }
}

export default ScheduleService;
