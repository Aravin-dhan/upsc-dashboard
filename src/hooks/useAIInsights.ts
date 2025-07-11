'use client';

import { useState, useEffect, useCallback } from 'react';
import CalendarSyncService, { AIInsightsData, AIInsight } from '@/services/CalendarSyncService';

/**
 * REACT HOOK FOR AI INSIGHTS DATA SYNCHRONIZATION
 * 
 * Provides real-time synchronization for AI-generated insights and recommendations
 */

interface UseAIInsightsReturn {
  data: AIInsightsData | null;
  isLoading: boolean;
  error: string | null;
  updateInsight: (insightId: string, updates: Partial<AIInsight>) => Promise<void>;
  markAsImplemented: (insightId: string) => Promise<void>;
  markAsNotImplemented: (insightId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useAIInsights = (): UseAIInsightsReturn => {
  const [data, setData] = useState<AIInsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const syncService = CalendarSyncService.getInstance();

  useEffect(() => {
    console.log('🔄 Initializing AI insights data hook...');
    
    const unsubscribe = syncService.subscribeAIInsights((aiInsightsData) => {
      console.log('🤖 AI insights data updated:', aiInsightsData);
      setData(aiInsightsData);
      setIsLoading(false);
      setError(null);
    });

    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const currentData = syncService.getAIInsightsData();
        if (currentData) {
          setData(currentData);
          setIsLoading(false);
        } else {
          await syncService.fetchAIInsightsData();
        }
      } catch (err) {
        console.error('❌ Error initializing AI insights data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load AI insights data');
        setIsLoading(false);
      }
    };

    initializeData();

    return () => {
      console.log('🧹 Cleaning up AI insights data hook...');
      unsubscribe();
    };
  }, [syncService]);

  const updateInsight = useCallback(async (insightId: string, updates: Partial<AIInsight>) => {
    try {
      setError(null);
      await syncService.updateAIInsight(insightId, updates);
      console.log('✅ AI insight updated successfully');
    } catch (err) {
      console.error('❌ Error updating AI insight:', err);
      setError(err instanceof Error ? err.message : 'Failed to update AI insight');
      throw err;
    }
  }, [syncService]);

  const markAsImplemented = useCallback(async (insightId: string) => {
    await updateInsight(insightId, { implemented: true });
  }, [updateInsight]);

  const markAsNotImplemented = useCallback(async (insightId: string) => {
    await updateInsight(insightId, { implemented: false });
  }, [updateInsight]);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await syncService.fetchAIInsightsData();
      console.log('✅ AI insights data refreshed successfully');
    } catch (err) {
      console.error('❌ Error refreshing AI insights data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh AI insights data');
      setIsLoading(false);
      throw err;
    }
  }, [syncService]);

  return {
    data,
    isLoading,
    error,
    updateInsight,
    markAsImplemented,
    markAsNotImplemented,
    refresh
  };
};

export default useAIInsights;
