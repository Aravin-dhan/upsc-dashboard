'use client';

import { useState, useEffect, useCallback } from 'react';
import CalendarSyncService, { WellnessData, WellnessEntry } from '@/services/CalendarSyncService';

/**
 * REACT HOOK FOR WELLNESS DATA SYNCHRONIZATION
 * 
 * Provides real-time synchronization for wellness tracking
 */

interface UseWellnessDataReturn {
  data: WellnessData | null;
  isLoading: boolean;
  error: string | null;
  updateEntry: (entryId: string, updates: Partial<WellnessEntry>) => Promise<void>;
  updateMood: (entryId: string, mood: WellnessEntry['mood']) => Promise<void>;
  updateEnergy: (entryId: string, energy: number) => Promise<void>;
  updateStress: (entryId: string, stress: number) => Promise<void>;
  updateSleep: (entryId: string, sleep: number) => Promise<void>;
  updateExercise: (entryId: string, exercise: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useWellnessData = (): UseWellnessDataReturn => {
  const [data, setData] = useState<WellnessData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const syncService = CalendarSyncService.getInstance();

  useEffect(() => {
    console.log('🔄 Initializing wellness data hook...');
    
    const unsubscribe = syncService.subscribeWellness((wellnessData) => {
      console.log('💚 Wellness data updated:', wellnessData);
      setData(wellnessData);
      setIsLoading(false);
      setError(null);
    });

    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const currentData = syncService.getWellnessData();
        if (currentData) {
          setData(currentData);
          setIsLoading(false);
        } else {
          await syncService.fetchWellnessData();
        }
      } catch (err) {
        console.error('❌ Error initializing wellness data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load wellness data');
        setIsLoading(false);
      }
    };

    initializeData();

    return () => {
      console.log('🧹 Cleaning up wellness data hook...');
      unsubscribe();
    };
  }, [syncService]);

  const updateEntry = useCallback(async (entryId: string, updates: Partial<WellnessEntry>) => {
    try {
      setError(null);
      await syncService.updateWellnessEntry(entryId, updates);
      console.log('✅ Wellness entry updated successfully');
    } catch (err) {
      console.error('❌ Error updating wellness entry:', err);
      setError(err instanceof Error ? err.message : 'Failed to update wellness entry');
      throw err;
    }
  }, [syncService]);

  const updateMood = useCallback(async (entryId: string, mood: WellnessEntry['mood']) => {
    await updateEntry(entryId, { mood });
  }, [updateEntry]);

  const updateEnergy = useCallback(async (entryId: string, energy: number) => {
    await updateEntry(entryId, { energy });
  }, [updateEntry]);

  const updateStress = useCallback(async (entryId: string, stress: number) => {
    await updateEntry(entryId, { stress });
  }, [updateEntry]);

  const updateSleep = useCallback(async (entryId: string, sleep: number) => {
    await updateEntry(entryId, { sleep });
  }, [updateEntry]);

  const updateExercise = useCallback(async (entryId: string, exercise: number) => {
    await updateEntry(entryId, { exercise });
  }, [updateEntry]);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await syncService.fetchWellnessData();
      console.log('✅ Wellness data refreshed successfully');
    } catch (err) {
      console.error('❌ Error refreshing wellness data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh wellness data');
      setIsLoading(false);
      throw err;
    }
  }, [syncService]);

  return {
    data,
    isLoading,
    error,
    updateEntry,
    updateMood,
    updateEnergy,
    updateStress,
    updateSleep,
    updateExercise,
    refresh
  };
};

export default useWellnessData;
