import { useState, useEffect, useCallback } from 'react';
import ScheduleService, { ScheduleEvent, ScheduleStats } from '@/services/ScheduleService';
import toast from 'react-hot-toast';

interface UseScheduleReturn {
  // Data
  events: ScheduleEvent[];
  todayEvents: ScheduleEvent[];
  upcomingEvents: ScheduleEvent[];
  stats: ScheduleStats;
  
  // Loading states
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  addEvent: (eventData: Omit<ScheduleEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ScheduleEvent>;
  updateEvent: (id: string, updates: Partial<ScheduleEvent>) => Promise<ScheduleEvent | null>;
  deleteEvent: (id: string) => Promise<boolean>;
  
  // Quick actions
  markComplete: (id: string) => Promise<void>;
  markInProgress: (id: string) => Promise<void>;
  reschedule: (id: string, newStartTime: string, newEndTime: string) => Promise<void>;
  
  // Query operations
  getEventsForDate: (date: Date) => ScheduleEvent[];
  getEventsForDateRange: (startDate: Date, endDate: Date) => ScheduleEvent[];
  
  // Utility
  refreshData: () => void;
  exportData: () => string;
  importData: (jsonData: string) => Promise<boolean>;
}

export function useSchedule(): UseScheduleReturn {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scheduleService = ScheduleService.getInstance();

  // Load initial data and subscribe to changes
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        setError(null);
        const allEvents = scheduleService.getAllEvents();
        setEvents(allEvents);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load schedule data';
        setError(errorMessage);
        console.error('Error loading schedule data:', err);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    loadData();

    // Subscribe to real-time updates
    const unsubscribe = scheduleService.subscribe((updatedEvents) => {
      setEvents(updatedEvents);
      setError(null);
    });

    return unsubscribe;
  }, [scheduleService]);

  // Derived data
  const todayEvents = events.filter(event => {
    const today = new Date();
    const eventDate = new Date(event.startTime);
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    );
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const upcomingEvents = events
    .filter(event => new Date(event.startTime) > new Date() && event.status !== 'cancelled')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5);

  const stats: ScheduleStats = {
    totalEvents: events.length,
    todayEvents: todayEvents.length,
    completedToday: todayEvents.filter(e => e.status === 'completed').length,
    upcomingToday: todayEvents.filter(e => e.status === 'scheduled' && new Date(e.startTime) > new Date()).length,
    weeklyHours: 0, // Will be calculated by service
    monthlyHours: 0  // Will be calculated by service
  };

  // CRUD operations with error handling
  const addEvent = useCallback(async (eventData: Omit<ScheduleEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScheduleEvent> => {
    try {
      setError(null);
      const newEvent = scheduleService.addEvent(eventData);
      toast.success(`Event "${newEvent.title}" added successfully`);
      return newEvent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add event';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, [scheduleService]);

  const updateEvent = useCallback(async (id: string, updates: Partial<ScheduleEvent>): Promise<ScheduleEvent | null> => {
    try {
      setError(null);
      const updatedEvent = scheduleService.updateEvent(id, updates);
      if (updatedEvent) {
        toast.success(`Event "${updatedEvent.title}" updated successfully`);
      } else {
        toast.error('Event not found');
      }
      return updatedEvent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, [scheduleService]);

  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = scheduleService.deleteEvent(id);
      if (success) {
        toast.success('Event deleted successfully');
      } else {
        toast.error('Event not found');
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, [scheduleService]);

  // Quick actions
  const markComplete = useCallback(async (id: string): Promise<void> => {
    try {
      const event = events.find(e => e.id === id);
      if (!event) {
        toast.error('Event not found');
        return;
      }
      
      await updateEvent(id, { status: 'completed' });
      toast.success(`"${event.title}" marked as completed! 🎉`);
    } catch (err) {
      console.error('Error marking event complete:', err);
    }
  }, [events, updateEvent]);

  const markInProgress = useCallback(async (id: string): Promise<void> => {
    try {
      const event = events.find(e => e.id === id);
      if (!event) {
        toast.error('Event not found');
        return;
      }
      
      await updateEvent(id, { status: 'in-progress' });
      toast.success(`Started "${event.title}"`);
    } catch (err) {
      console.error('Error marking event in progress:', err);
    }
  }, [events, updateEvent]);

  const reschedule = useCallback(async (id: string, newStartTime: string, newEndTime: string): Promise<void> => {
    try {
      const event = events.find(e => e.id === id);
      if (!event) {
        toast.error('Event not found');
        return;
      }
      
      await updateEvent(id, { 
        startTime: newStartTime, 
        endTime: newEndTime,
        status: 'scheduled'
      });
      toast.success(`"${event.title}" rescheduled successfully`);
    } catch (err) {
      console.error('Error rescheduling event:', err);
    }
  }, [events, updateEvent]);

  // Query operations
  const getEventsForDate = useCallback((date: Date): ScheduleEvent[] => {
    return scheduleService.getEventsForDate(date);
  }, [scheduleService]);

  const getEventsForDateRange = useCallback((startDate: Date, endDate: Date): ScheduleEvent[] => {
    return scheduleService.getEventsForDateRange(startDate, endDate);
  }, [scheduleService]);

  // Utility functions
  const refreshData = useCallback(() => {
    try {
      setError(null);
      const allEvents = scheduleService.getAllEvents();
      setEvents(allEvents);
      toast.success('Schedule data refreshed');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh data';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [scheduleService]);

  const exportData = useCallback((): string => {
    try {
      const data = scheduleService.exportEvents();
      toast.success('Schedule data exported');
      return data;
    } catch (err) {
      toast.error('Failed to export data');
      return '[]';
    }
  }, [scheduleService]);

  const importData = useCallback(async (jsonData: string): Promise<boolean> => {
    try {
      setError(null);
      const success = scheduleService.importEvents(jsonData);
      if (success) {
        toast.success('Schedule data imported successfully');
        refreshData();
      } else {
        toast.error('Failed to import data - invalid format');
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import data';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, [scheduleService, refreshData]);

  return {
    // Data
    events,
    todayEvents,
    upcomingEvents,
    stats,
    
    // Loading states
    loading,
    error,
    
    // CRUD operations
    addEvent,
    updateEvent,
    deleteEvent,
    
    // Quick actions
    markComplete,
    markInProgress,
    reschedule,
    
    // Query operations
    getEventsForDate,
    getEventsForDateRange,
    
    // Utility
    refreshData,
    exportData,
    importData
  };
}

export default useSchedule;
