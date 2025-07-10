'use client';

import { useState, useEffect, useCallback } from 'react';
import CalendarSyncService, { CalendarEvent, ScheduleBlock } from '@/services/CalendarSyncService';
import toast from 'react-hot-toast';

// Hook for calendar events
export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calendarService = CalendarSyncService.getInstance();

  useEffect(() => {
    setIsLoading(true);
    
    const unsubscribe = calendarService.subscribeToCalendar((newEvents) => {
      setEvents(newEvents as CalendarEvent[]);
      setIsLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [calendarService]);

  const addEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newEvent = calendarService.addCalendarEvent(eventData);
      toast.success('Event added successfully!');
      return newEvent;
    } catch (error) {
      const errorMessage = 'Failed to add event';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  }, [calendarService]);

  const updateEvent = useCallback(async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      const updatedEvent = calendarService.updateCalendarEvent(id, updates);
      if (updatedEvent) {
        toast.success('Event updated successfully!');
        return updatedEvent;
      } else {
        throw new Error('Event not found');
      }
    } catch (error) {
      const errorMessage = 'Failed to update event';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  }, [calendarService]);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      const success = calendarService.deleteCalendarEvent(id);
      if (success) {
        toast.success('Event deleted successfully!');
        return true;
      } else {
        throw new Error('Event not found');
      }
    } catch (error) {
      const errorMessage = 'Failed to delete event';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  }, [calendarService]);

  const getEventsForDate = useCallback((date: string) => {
    return calendarService.getEventsForDate(date);
  }, [calendarService]);

  const getTodaysEvents = useCallback(() => {
    return calendarService.getTodaysEvents();
  }, [calendarService]);

  return {
    events,
    isLoading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    getTodaysEvents
  };
}

// Hook for schedule blocks
export function useScheduleBlocks() {
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calendarService = CalendarSyncService.getInstance();

  useEffect(() => {
    setIsLoading(true);
    
    const unsubscribe = calendarService.subscribeToSchedule((newBlocks) => {
      setBlocks(newBlocks as ScheduleBlock[]);
      setIsLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [calendarService]);

  const addBlock = useCallback(async (blockData: Omit<ScheduleBlock, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newBlock = calendarService.addScheduleBlock(blockData);
      toast.success('Schedule block added successfully!');
      return newBlock;
    } catch (error) {
      const errorMessage = 'Failed to add schedule block';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  }, [calendarService]);

  const updateBlock = useCallback(async (id: string, updates: Partial<ScheduleBlock>) => {
    try {
      const updatedBlock = calendarService.updateScheduleBlock(id, updates);
      if (updatedBlock) {
        toast.success('Schedule block updated successfully!');
        return updatedBlock;
      } else {
        throw new Error('Schedule block not found');
      }
    } catch (error) {
      const errorMessage = 'Failed to update schedule block';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  }, [calendarService]);

  const deleteBlock = useCallback(async (id: string) => {
    try {
      const success = calendarService.deleteScheduleBlock(id);
      if (success) {
        toast.success('Schedule block deleted successfully!');
        return true;
      } else {
        throw new Error('Schedule block not found');
      }
    } catch (error) {
      const errorMessage = 'Failed to delete schedule block';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  }, [calendarService]);

  const getScheduleForDate = useCallback((date: string) => {
    return calendarService.getScheduleForDate(date);
  }, [calendarService]);

  const getTodaysSchedule = useCallback(() => {
    return calendarService.getTodaysSchedule();
  }, [calendarService]);

  return {
    blocks,
    isLoading,
    error,
    addBlock,
    updateBlock,
    deleteBlock,
    getScheduleForDate,
    getTodaysSchedule
  };
}

// Combined hook for both calendar and schedule
export function useCalendarAndSchedule() {
  const calendarHook = useCalendarEvents();
  const scheduleHook = useScheduleBlocks();

  const isLoading = calendarHook.isLoading || scheduleHook.isLoading;
  const error = calendarHook.error || scheduleHook.error;

  const getTodaysData = useCallback(() => {
    return {
      events: calendarHook.getTodaysEvents(),
      schedule: scheduleHook.getTodaysSchedule()
    };
  }, [calendarHook.getTodaysEvents, scheduleHook.getTodaysSchedule]);

  const getDataForDate = useCallback((date: string) => {
    return {
      events: calendarHook.getEventsForDate(date),
      schedule: scheduleHook.getScheduleForDate(date)
    };
  }, [calendarHook.getEventsForDate, scheduleHook.getScheduleForDate]);

  return {
    // Calendar
    events: calendarHook.events,
    addEvent: calendarHook.addEvent,
    updateEvent: calendarHook.updateEvent,
    deleteEvent: calendarHook.deleteEvent,
    
    // Schedule
    blocks: scheduleHook.blocks,
    addBlock: scheduleHook.addBlock,
    updateBlock: scheduleHook.updateBlock,
    deleteBlock: scheduleHook.deleteBlock,
    
    // Combined
    isLoading,
    error,
    getTodaysData,
    getDataForDate
  };
}

// Hook for dashboard widgets (simplified data)
export function useDashboardCalendarData() {
  const { events, blocks, isLoading, error, getTodaysData } = useCalendarAndSchedule();

  const [todaysData, setTodaysData] = useState<{
    upcomingEvents: CalendarEvent[];
    todaysSchedule: ScheduleBlock[];
    completedTasks: number;
    totalTasks: number;
  }>({
    upcomingEvents: [],
    todaysSchedule: [],
    completedTasks: 0,
    totalTasks: 0
  });

  useEffect(() => {
    const today = getTodaysData();
    const upcomingEvents = today.events
      .filter(event => !event.completed)
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
      .slice(0, 5); // Show only next 5 events

    const todaysSchedule = today.schedule
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .slice(0, 5); // Show only next 5 schedule blocks

    const allTasks = [...today.events, ...today.schedule];
    const completedTasks = allTasks.filter(task => task.completed).length;

    setTodaysData({
      upcomingEvents,
      todaysSchedule,
      completedTasks,
      totalTasks: allTasks.length
    });
  }, [events, blocks, getTodaysData]);

  return {
    ...todaysData,
    isLoading,
    error,
    refreshData: getTodaysData
  };
}

export default {
  useCalendarEvents,
  useScheduleBlocks,
  useCalendarAndSchedule,
  useDashboardCalendarData
};
