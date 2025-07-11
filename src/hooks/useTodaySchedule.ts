'use client';

import { useState, useEffect, useCallback } from 'react';
import CalendarSyncService, { TodayScheduleData, TodayScheduleItem } from '@/services/CalendarSyncService';

/**
 * REACT HOOK FOR TODAY'S SCHEDULE SYNCHRONIZATION
 * 
 * Provides real-time synchronization between dashboard widget and calendar page
 * Ensures data consistency across all schedule-related views
 */

interface UseTodayScheduleReturn {
  data: TodayScheduleData | null;
  isLoading: boolean;
  error: string | null;
  updateItem: (itemId: string, updates: Partial<TodayScheduleItem>) => Promise<void>;
  refresh: () => Promise<void>;
  markAsCompleted: (itemId: string) => Promise<void>;
  markAsInProgress: (itemId: string) => Promise<void>;
  markAsPending: (itemId: string) => Promise<void>;
}

export const useTodaySchedule = (): UseTodayScheduleReturn => {
  const [data, setData] = useState<TodayScheduleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calendarService = CalendarSyncService.getInstance();

  // Initialize data and subscribe to changes
  useEffect(() => {
    console.log('🔄 Initializing today\'s schedule hook...');
    
    // Subscribe to calendar service updates
    const unsubscribe = calendarService.subscribeTodaySchedule((scheduleData) => {
      console.log('📅 Today\'s schedule data updated:', scheduleData);
      setData(scheduleData);
      setIsLoading(false);
      setError(null);
    });

    // Initial data fetch
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if we already have data
        const currentData = calendarService.getTodayScheduleData();
        if (currentData) {
          setData(currentData);
          setIsLoading(false);
        } else {
          // Fetch fresh data
          await calendarService.fetchTodaySchedule();
        }
      } catch (err) {
        console.error('❌ Error initializing today\'s schedule:', err);
        setError(err instanceof Error ? err.message : 'Failed to load today\'s schedule');
        setIsLoading(false);
      }
    };

    initializeData();

    // Cleanup subscription on unmount
    return () => {
      console.log('🧹 Cleaning up today\'s schedule hook...');
      unsubscribe();
    };
  }, [calendarService]);

  // Update schedule item
  const updateItem = useCallback(async (itemId: string, updates: Partial<TodayScheduleItem>) => {
    try {
      setError(null);
      await calendarService.updateTodayScheduleItem(itemId, updates);
      console.log('✅ Schedule item updated successfully');
    } catch (err) {
      console.error('❌ Error updating schedule item:', err);
      setError(err instanceof Error ? err.message : 'Failed to update schedule item');
      throw err;
    }
  }, [calendarService]);

  // Refresh data
  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await calendarService.refreshTodaySchedule();
      console.log('✅ Today\'s schedule refreshed successfully');
    } catch (err) {
      console.error('❌ Error refreshing today\'s schedule:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh today\'s schedule');
      setIsLoading(false);
      throw err;
    }
  }, [calendarService]);

  // Convenience methods for status updates
  const markAsCompleted = useCallback(async (itemId: string) => {
    await updateItem(itemId, { status: 'completed' });
  }, [updateItem]);

  const markAsInProgress = useCallback(async (itemId: string) => {
    await updateItem(itemId, { status: 'in-progress' });
  }, [updateItem]);

  const markAsPending = useCallback(async (itemId: string) => {
    await updateItem(itemId, { status: 'pending' });
  }, [updateItem]);

  return {
    data,
    isLoading,
    error,
    updateItem,
    refresh,
    markAsCompleted,
    markAsInProgress,
    markAsPending
  };
};

export default useTodaySchedule;
