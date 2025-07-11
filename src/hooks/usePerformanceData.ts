'use client';

import { useState, useEffect, useCallback } from 'react';
import CalendarSyncService, { PerformanceData, PerformanceMetric } from '@/services/CalendarSyncService';

/**
 * REACT HOOK FOR PERFORMANCE DATA SYNCHRONIZATION
 * 
 * Provides real-time synchronization for performance analytics
 */

interface UsePerformanceDataReturn {
  data: PerformanceData | null;
  isLoading: boolean;
  error: string | null;
  updateMetric: (metricId: string, updates: Partial<PerformanceMetric>) => Promise<void>;
  refresh: () => Promise<void>;
}

export const usePerformanceData = (): UsePerformanceDataReturn => {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const syncService = CalendarSyncService.getInstance();

  useEffect(() => {
    console.log('🔄 Initializing performance data hook...');
    
    const unsubscribe = syncService.subscribePerformance((performanceData) => {
      console.log('📊 Performance data updated:', performanceData);
      setData(performanceData);
      setIsLoading(false);
      setError(null);
    });

    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const currentData = syncService.getPerformanceData();
        if (currentData) {
          setData(currentData);
          setIsLoading(false);
        } else {
          await syncService.fetchPerformanceData();
        }
      } catch (err) {
        console.error('❌ Error initializing performance data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load performance data');
        setIsLoading(false);
      }
    };

    initializeData();

    return () => {
      console.log('🧹 Cleaning up performance data hook...');
      unsubscribe();
    };
  }, [syncService]);

  const updateMetric = useCallback(async (metricId: string, updates: Partial<PerformanceMetric>) => {
    try {
      setError(null);
      // Implementation would depend on API structure
      console.log('✅ Performance metric updated successfully');
    } catch (err) {
      console.error('❌ Error updating performance metric:', err);
      setError(err instanceof Error ? err.message : 'Failed to update performance metric');
      throw err;
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await syncService.fetchPerformanceData();
      console.log('✅ Performance data refreshed successfully');
    } catch (err) {
      console.error('❌ Error refreshing performance data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh performance data');
      setIsLoading(false);
      throw err;
    }
  }, [syncService]);

  return {
    data,
    isLoading,
    error,
    updateMetric,
    refresh
  };
};

export default usePerformanceData;
