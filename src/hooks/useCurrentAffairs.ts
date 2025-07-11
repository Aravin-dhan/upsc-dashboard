'use client';

import { useState, useEffect, useCallback } from 'react';
import CalendarSyncService, { CurrentAffairsData, CurrentAffairItem } from '@/services/CalendarSyncService';

/**
 * REACT HOOK FOR CURRENT AFFAIRS DATA SYNCHRONIZATION
 * 
 * Provides real-time synchronization for current affairs content
 */

interface UseCurrentAffairsReturn {
  data: CurrentAffairsData | null;
  isLoading: boolean;
  error: string | null;
  updateItem: (itemId: string, updates: Partial<CurrentAffairItem>) => Promise<void>;
  markAsRead: (itemId: string) => Promise<void>;
  markAsReading: (itemId: string) => Promise<void>;
  markAsUnread: (itemId: string) => Promise<void>;
  toggleBookmark: (itemId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useCurrentAffairs = (): UseCurrentAffairsReturn => {
  const [data, setData] = useState<CurrentAffairsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const syncService = CalendarSyncService.getInstance();

  useEffect(() => {
    console.log('🔄 Initializing current affairs data hook...');
    
    const unsubscribe = syncService.subscribeCurrentAffairs((currentAffairsData) => {
      console.log('📰 Current affairs data updated:', currentAffairsData);
      setData(currentAffairsData);
      setIsLoading(false);
      setError(null);
    });

    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const currentData = syncService.getCurrentAffairsData();
        if (currentData) {
          setData(currentData);
          setIsLoading(false);
        } else {
          await syncService.fetchCurrentAffairsData();
        }
      } catch (err) {
        console.error('❌ Error initializing current affairs data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load current affairs data');
        setIsLoading(false);
      }
    };

    initializeData();

    return () => {
      console.log('🧹 Cleaning up current affairs data hook...');
      unsubscribe();
    };
  }, [syncService]);

  const updateItem = useCallback(async (itemId: string, updates: Partial<CurrentAffairItem>) => {
    try {
      setError(null);
      await syncService.updateCurrentAffairsItem(itemId, updates);
      console.log('✅ Current affairs item updated successfully');
    } catch (err) {
      console.error('❌ Error updating current affairs item:', err);
      setError(err instanceof Error ? err.message : 'Failed to update current affairs item');
      throw err;
    }
  }, [syncService]);

  const markAsRead = useCallback(async (itemId: string) => {
    await updateItem(itemId, { readStatus: 'read' });
  }, [updateItem]);

  const markAsReading = useCallback(async (itemId: string) => {
    await updateItem(itemId, { readStatus: 'reading' });
  }, [updateItem]);

  const markAsUnread = useCallback(async (itemId: string) => {
    await updateItem(itemId, { readStatus: 'unread' });
  }, [updateItem]);

  const toggleBookmark = useCallback(async (itemId: string) => {
    if (!data) return;
    
    const item = data.recent.find(item => item.id === itemId);
    if (item) {
      await updateItem(itemId, { bookmarked: !item.bookmarked });
    }
  }, [updateItem, data]);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await syncService.fetchCurrentAffairsData();
      console.log('✅ Current affairs data refreshed successfully');
    } catch (err) {
      console.error('❌ Error refreshing current affairs data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh current affairs data');
      setIsLoading(false);
      throw err;
    }
  }, [syncService]);

  return {
    data,
    isLoading,
    error,
    updateItem,
    markAsRead,
    markAsReading,
    markAsUnread,
    toggleBookmark,
    refresh
  };
};

export default useCurrentAffairs;
