import { useState, useEffect, useCallback } from 'react';
import PerformanceService, { PerformanceMetric, PerformanceAnalytics, SubjectProgress } from '@/services/PerformanceService';
import toast from 'react-hot-toast';

interface UsePerformanceReturn {
  // Data
  analytics: PerformanceAnalytics | null;
  metrics: PerformanceMetric[];
  recentSessions: PerformanceMetric[];
  subjectProgress: SubjectProgress[];
  
  // Loading states
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  addMetric: (metricData: Omit<PerformanceMetric, 'id' | 'createdAt' | 'updatedAt'>) => Promise<PerformanceMetric>;
  updateMetric: (id: string, updates: Partial<PerformanceMetric>) => Promise<PerformanceMetric | null>;
  deleteMetric: (id: string) => Promise<boolean>;
  
  // Quick actions
  recordStudySession: (sessionData: {
    subject: string;
    topic?: string;
    timeSpent: number;
    type: PerformanceMetric['type'];
    difficulty?: PerformanceMetric['difficulty'];
    notes?: string;
  }) => Promise<void>;
  
  recordPracticeSession: (sessionData: {
    subject: string;
    topic?: string;
    questionsAttempted: number;
    questionsCorrect: number;
    timeSpent: number;
    difficulty?: PerformanceMetric['difficulty'];
    mistakeTypes?: string[];
  }) => Promise<void>;
  
  // Analytics operations
  refreshAnalytics: () => void;
  getSubjectAnalytics: (subject: string) => SubjectProgress | null;
  getPerformanceTrend: (days: number) => { date: string; accuracy: number; studyTime: number }[];
  
  // Query operations
  getMetricsForDateRange: (startDate: string, endDate: string) => PerformanceMetric[];
  getMetricsBySubject: (subject: string) => PerformanceMetric[];
  
  // Utility
  exportData: () => string;
  importData: (jsonData: string) => Promise<boolean>;
  clearAllData: () => Promise<void>;
}

export function usePerformance(): UsePerformanceReturn {
  const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const performanceService = PerformanceService.getInstance();

  // Load initial data and subscribe to changes
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        setError(null);
        
        const allMetrics = performanceService.getAllMetrics();
        const analyticsData = performanceService.getAnalytics();
        
        setMetrics(allMetrics);
        setAnalytics(analyticsData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load performance data';
        setError(errorMessage);
        console.error('Error loading performance data:', err);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    loadData();

    // Subscribe to real-time updates
    const unsubscribe = performanceService.subscribe((updatedAnalytics) => {
      setAnalytics(updatedAnalytics);
      setMetrics(performanceService.getAllMetrics());
      setError(null);
    });

    return unsubscribe;
  }, [performanceService]);

  // Derived data
  const recentSessions = analytics?.recentSessions || [];
  const subjectProgress = analytics?.subjectProgress || [];

  // CRUD operations with error handling
  const addMetric = useCallback(async (metricData: Omit<PerformanceMetric, 'id' | 'createdAt' | 'updatedAt'>): Promise<PerformanceMetric> => {
    try {
      setError(null);
      const newMetric = performanceService.addMetric(metricData);
      toast.success('Performance data recorded successfully');
      return newMetric;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add performance metric';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, [performanceService]);

  const updateMetric = useCallback(async (id: string, updates: Partial<PerformanceMetric>): Promise<PerformanceMetric | null> => {
    try {
      setError(null);
      const updatedMetric = performanceService.updateMetric(id, updates);
      if (updatedMetric) {
        toast.success('Performance data updated successfully');
      } else {
        toast.error('Performance metric not found');
      }
      return updatedMetric;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update performance metric';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, [performanceService]);

  const deleteMetric = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = performanceService.deleteMetric(id);
      if (success) {
        toast.success('Performance data deleted successfully');
      } else {
        toast.error('Performance metric not found');
      }
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete performance metric';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, [performanceService]);

  // Quick action methods
  const recordStudySession = useCallback(async (sessionData: {
    subject: string;
    topic?: string;
    timeSpent: number;
    type: PerformanceMetric['type'];
    difficulty?: PerformanceMetric['difficulty'];
    notes?: string;
  }): Promise<void> => {
    try {
      const now = new Date();
      const startTime = new Date(now.getTime() - sessionData.timeSpent * 60000);
      
      await addMetric({
        date: now.toISOString().split('T')[0],
        type: sessionData.type,
        subject: sessionData.subject,
        topic: sessionData.topic,
        timeSpent: sessionData.timeSpent,
        difficulty: sessionData.difficulty || 'medium',
        startTime: startTime.toISOString(),
        endTime: now.toISOString(),
        notes: sessionData.notes,
        focusScore: 7, // Default focus score
        confidenceLevel: 6 // Default confidence
      });
      
      toast.success(`Study session recorded: ${sessionData.timeSpent} minutes on ${sessionData.subject}`);
    } catch (err) {
      console.error('Error recording study session:', err);
    }
  }, [addMetric]);

  const recordPracticeSession = useCallback(async (sessionData: {
    subject: string;
    topic?: string;
    questionsAttempted: number;
    questionsCorrect: number;
    timeSpent: number;
    difficulty?: PerformanceMetric['difficulty'];
    mistakeTypes?: string[];
  }): Promise<void> => {
    try {
      const now = new Date();
      const startTime = new Date(now.getTime() - sessionData.timeSpent * 60000);
      const accuracy = sessionData.questionsAttempted > 0 
        ? (sessionData.questionsCorrect / sessionData.questionsAttempted) * 100 
        : 0;
      const speed = sessionData.timeSpent > 0 
        ? sessionData.questionsAttempted / sessionData.timeSpent 
        : 0;
      
      await addMetric({
        date: now.toISOString().split('T')[0],
        type: 'practice',
        subject: sessionData.subject,
        topic: sessionData.topic,
        questionsAttempted: sessionData.questionsAttempted,
        questionsCorrect: sessionData.questionsCorrect,
        timeSpent: sessionData.timeSpent,
        accuracy,
        speed,
        difficulty: sessionData.difficulty || 'medium',
        mistakeTypes: sessionData.mistakeTypes || [],
        startTime: startTime.toISOString(),
        endTime: now.toISOString(),
        focusScore: 8, // Higher focus for practice
        confidenceLevel: accuracy > 70 ? 8 : 5
      });
      
      toast.success(`Practice session recorded: ${accuracy.toFixed(1)}% accuracy (${sessionData.questionsCorrect}/${sessionData.questionsAttempted})`);
    } catch (err) {
      console.error('Error recording practice session:', err);
    }
  }, [addMetric]);

  // Analytics operations
  const refreshAnalytics = useCallback(() => {
    try {
      setError(null);
      const updatedAnalytics = performanceService.refreshAnalytics();
      setAnalytics(updatedAnalytics);
      setMetrics(performanceService.getAllMetrics());
      toast.success('Performance analytics refreshed');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh analytics';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [performanceService]);

  const getSubjectAnalytics = useCallback((subject: string): SubjectProgress | null => {
    return subjectProgress.find(progress => progress.subject === subject) || null;
  }, [subjectProgress]);

  const getPerformanceTrend = useCallback((days: number): { date: string; accuracy: number; studyTime: number }[] => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    const relevantMetrics = performanceService.getMetricsForDateRange(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
    
    // Group by date
    const dateMap = new Map<string, PerformanceMetric[]>();
    relevantMetrics.forEach(metric => {
      if (!dateMap.has(metric.date)) {
        dateMap.set(metric.date, []);
      }
      dateMap.get(metric.date)!.push(metric);
    });
    
    // Calculate daily averages
    return Array.from(dateMap.entries()).map(([date, dayMetrics]) => {
      const totalTime = dayMetrics.reduce((sum, m) => sum + m.timeSpent, 0);
      const totalQuestions = dayMetrics.reduce((sum, m) => sum + (m.questionsAttempted || 0), 0);
      const totalCorrect = dayMetrics.reduce((sum, m) => sum + (m.questionsCorrect || 0), 0);
      const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
      
      return {
        date,
        accuracy,
        studyTime: totalTime
      };
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [performanceService]);

  // Query operations
  const getMetricsForDateRange = useCallback((startDate: string, endDate: string): PerformanceMetric[] => {
    return performanceService.getMetricsForDateRange(startDate, endDate);
  }, [performanceService]);

  const getMetricsBySubject = useCallback((subject: string): PerformanceMetric[] => {
    return performanceService.getMetricsBySubject(subject);
  }, [performanceService]);

  // Utility functions
  const exportData = useCallback((): string => {
    try {
      const data = performanceService.exportData();
      toast.success('Performance data exported');
      return data;
    } catch (err) {
      toast.error('Failed to export data');
      return '{}';
    }
  }, [performanceService]);

  const importData = useCallback(async (jsonData: string): Promise<boolean> => {
    try {
      setError(null);
      const success = performanceService.importData(jsonData);
      if (success) {
        toast.success('Performance data imported successfully');
        refreshAnalytics();
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
  }, [performanceService, refreshAnalytics]);

  const clearAllData = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      performanceService.clearAllData();
      toast.success('All performance data cleared');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear data';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [performanceService]);

  return {
    // Data
    analytics,
    metrics,
    recentSessions,
    subjectProgress,
    
    // Loading states
    loading,
    error,
    
    // CRUD operations
    addMetric,
    updateMetric,
    deleteMetric,
    
    // Quick actions
    recordStudySession,
    recordPracticeSession,
    
    // Analytics operations
    refreshAnalytics,
    getSubjectAnalytics,
    getPerformanceTrend,
    
    // Query operations
    getMetricsForDateRange,
    getMetricsBySubject,
    
    // Utility
    exportData,
    importData,
    clearAllData
  };
}

export default usePerformance;
