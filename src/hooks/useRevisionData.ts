'use client';

import { useState, useEffect, useCallback } from 'react';
import CalendarSyncService, { RevisionData, RevisionItem } from '@/services/CalendarSyncService';

/**
 * REACT HOOK FOR REVISION DATA SYNCHRONIZATION
 * 
 * Provides real-time synchronization for revision engine
 */

interface UseRevisionDataReturn {
  data: RevisionData | null;
  isLoading: boolean;
  error: string | null;
  updateItem: (itemId: string, updates: Partial<RevisionItem>) => Promise<void>;
  markAsCompleted: (itemId: string) => Promise<void>;
  markAsInProgress: (itemId: string) => Promise<void>;
  markAsPending: (itemId: string) => Promise<void>;
  updateConfidence: (itemId: string, confidence: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useRevisionData = (): UseRevisionDataReturn => {
  const [data, setData] = useState<RevisionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const syncService = CalendarSyncService.getInstance();

  useEffect(() => {
    console.log('🔄 Initializing revision data hook...');
    
    const unsubscribe = syncService.subscribeRevision((revisionData) => {
      console.log('🔄 Revision data updated:', revisionData);
      setData(revisionData);
      setIsLoading(false);
      setError(null);
    });

    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const currentData = syncService.getRevisionData();
        if (currentData) {
          setData(currentData);
          setIsLoading(false);
        } else {
          await syncService.fetchRevisionData();
        }
      } catch (err) {
        console.error('❌ Error initializing revision data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load revision data');
        setIsLoading(false);
      }
    };

    initializeData();

    return () => {
      console.log('🧹 Cleaning up revision data hook...');
      unsubscribe();
    };
  }, [syncService]);

  const updateItem = useCallback(async (itemId: string, updates: Partial<RevisionItem>) => {
    try {
      setError(null);
      await syncService.updateRevisionItem(itemId, updates);
      console.log('✅ Revision item updated successfully');
    } catch (err) {
      console.error('❌ Error updating revision item:', err);
      setError(err instanceof Error ? err.message : 'Failed to update revision item');
      throw err;
    }
  }, [syncService]);

  const markAsCompleted = useCallback(async (itemId: string) => {
    await updateItem(itemId, { status: 'completed' });
  }, [updateItem]);

  const markAsInProgress = useCallback(async (itemId: string) => {
    await updateItem(itemId, { status: 'in-progress' });
  }, [updateItem]);

  const markAsPending = useCallback(async (itemId: string) => {
    await updateItem(itemId, { status: 'pending' });
  }, [updateItem]);

  const updateConfidence = useCallback(async (itemId: string, confidence: number) => {
    await updateItem(itemId, { confidence });
  }, [updateItem]);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await syncService.fetchRevisionData();
      console.log('✅ Revision data refreshed successfully');
    } catch (err) {
      console.error('❌ Error refreshing revision data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh revision data');
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
    markAsPending,
    updateConfidence,
    refresh
  };
};

export default useRevisionData;
