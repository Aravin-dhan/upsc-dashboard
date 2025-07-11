'use client';

import { useState, useEffect, useCallback } from 'react';
import CalendarSyncService, { SyllabusData, SyllabusItem } from '@/services/CalendarSyncService';

/**
 * REACT HOOK FOR SYLLABUS DATA SYNCHRONIZATION
 * 
 * Provides real-time synchronization for syllabus progress tracking
 */

interface UseSyllabusDataReturn {
  data: SyllabusData | null;
  isLoading: boolean;
  error: string | null;
  updateItem: (itemId: string, updates: Partial<SyllabusItem>) => Promise<void>;
  markAsCompleted: (itemId: string) => Promise<void>;
  markAsInProgress: (itemId: string) => Promise<void>;
  markAsNotStarted: (itemId: string) => Promise<void>;
  markForRevision: (itemId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useSyllabusData = (): UseSyllabusDataReturn => {
  const [data, setData] = useState<SyllabusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const syncService = CalendarSyncService.getInstance();

  useEffect(() => {
    console.log('🔄 Initializing syllabus data hook...');
    
    const unsubscribe = syncService.subscribeSyllabus((syllabusData) => {
      console.log('📚 Syllabus data updated:', syllabusData);
      setData(syllabusData);
      setIsLoading(false);
      setError(null);
    });

    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const currentData = syncService.getSyllabusData();
        if (currentData) {
          setData(currentData);
          setIsLoading(false);
        } else {
          await syncService.fetchSyllabusData();
        }
      } catch (err) {
        console.error('❌ Error initializing syllabus data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load syllabus data');
        setIsLoading(false);
      }
    };

    initializeData();

    return () => {
      console.log('🧹 Cleaning up syllabus data hook...');
      unsubscribe();
    };
  }, [syncService]);

  const updateItem = useCallback(async (itemId: string, updates: Partial<SyllabusItem>) => {
    try {
      setError(null);
      await syncService.updateSyllabusItem(itemId, updates);
      console.log('✅ Syllabus item updated successfully');
    } catch (err) {
      console.error('❌ Error updating syllabus item:', err);
      setError(err instanceof Error ? err.message : 'Failed to update syllabus item');
      throw err;
    }
  }, [syncService]);

  const markAsCompleted = useCallback(async (itemId: string) => {
    await updateItem(itemId, { status: 'completed' });
  }, [updateItem]);

  const markAsInProgress = useCallback(async (itemId: string) => {
    await updateItem(itemId, { status: 'in-progress' });
  }, [updateItem]);

  const markAsNotStarted = useCallback(async (itemId: string) => {
    await updateItem(itemId, { status: 'not-started' });
  }, [updateItem]);

  const markForRevision = useCallback(async (itemId: string) => {
    await updateItem(itemId, { status: 'revision' });
  }, [updateItem]);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await syncService.fetchSyllabusData();
      console.log('✅ Syllabus data refreshed successfully');
    } catch (err) {
      console.error('❌ Error refreshing syllabus data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh syllabus data');
      setIsLoading(false);
      throw err;
    }
  }, [syncService]);

  return {
    data,
    isLoading,
    error,
    updateItem,
    markAsCompleted,
    markAsInProgress,
    markAsNotStarted,
    markForRevision,
    refresh
  };
};

export default useSyllabusData;
