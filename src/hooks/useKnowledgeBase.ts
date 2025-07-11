'use client';

import { useState, useEffect, useCallback } from 'react';
import CalendarSyncService, { KnowledgeData, KnowledgeItem } from '@/services/CalendarSyncService';

/**
 * REACT HOOK FOR KNOWLEDGE BASE DATA SYNCHRONIZATION
 * 
 * Provides real-time synchronization for knowledge base content
 */

interface UseKnowledgeBaseReturn {
  data: KnowledgeData | null;
  isLoading: boolean;
  error: string | null;
  updateItem: (itemId: string, updates: Partial<KnowledgeItem>) => Promise<void>;
  toggleFavorite: (itemId: string) => Promise<void>;
  incrementAccess: (itemId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useKnowledgeBase = (): UseKnowledgeBaseReturn => {
  const [data, setData] = useState<KnowledgeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const syncService = CalendarSyncService.getInstance();

  useEffect(() => {
    console.log('🔄 Initializing knowledge base data hook...');
    
    const unsubscribe = syncService.subscribeKnowledge((knowledgeData) => {
      console.log('📚 Knowledge base data updated:', knowledgeData);
      setData(knowledgeData);
      setIsLoading(false);
      setError(null);
    });

    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const currentData = syncService.getKnowledgeData();
        if (currentData) {
          setData(currentData);
          setIsLoading(false);
        } else {
          await syncService.fetchKnowledgeData();
        }
      } catch (err) {
        console.error('❌ Error initializing knowledge base data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load knowledge base data');
        setIsLoading(false);
      }
    };

    initializeData();

    return () => {
      console.log('🧹 Cleaning up knowledge base data hook...');
      unsubscribe();
    };
  }, [syncService]);

  const updateItem = useCallback(async (itemId: string, updates: Partial<KnowledgeItem>) => {
    try {
      setError(null);
      await syncService.updateKnowledgeItem(itemId, updates);
      console.log('✅ Knowledge base item updated successfully');
    } catch (err) {
      console.error('❌ Error updating knowledge base item:', err);
      setError(err instanceof Error ? err.message : 'Failed to update knowledge base item');
      throw err;
    }
  }, [syncService]);

  const toggleFavorite = useCallback(async (itemId: string) => {
    if (!data) return;
    
    const item = data.items.find(item => item.id === itemId);
    if (item) {
      await updateItem(itemId, { isFavorite: !item.isFavorite });
    }
  }, [updateItem, data]);

  const incrementAccess = useCallback(async (itemId: string) => {
    if (!data) return;
    
    const item = data.items.find(item => item.id === itemId);
    if (item) {
      await updateItem(itemId, { 
        accessCount: item.accessCount + 1,
        lastAccessed: new Date().toISOString()
      });
    }
  }, [updateItem, data]);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await syncService.fetchKnowledgeData();
      console.log('✅ Knowledge base data refreshed successfully');
    } catch (err) {
      console.error('❌ Error refreshing knowledge base data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh knowledge base data');
      setIsLoading(false);
      throw err;
    }
  }, [syncService]);

  return {
    data,
    isLoading,
    error,
    updateItem,
    toggleFavorite,
    incrementAccess,
    refresh
  };
};

export default useKnowledgeBase;
