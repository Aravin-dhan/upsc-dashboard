import { useState, useEffect, useCallback } from 'react';
import dataSyncService from '@/services/DataSyncService';

type DataType = 'practice' | 'notes' | 'currentAffairs' | 'revision' | 'analytics' | 'goals';

interface DataChangeEvent {
  type: DataType;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
}

// Hook for subscribing to data changes
export function useDataSync(type: DataType) {
  const [data, setData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    // Load initial data
    const initialData = dataSyncService.getCachedData(type);
    setData(initialData);

    // Subscribe to changes
    const unsubscribe = dataSyncService.subscribe(type, (event: DataChangeEvent) => {
      setData(dataSyncService.getCachedData(type));
      setLastUpdate(event.timestamp);
    });

    return unsubscribe;
  }, [type]);

  const updateData = useCallback((action: 'create' | 'update' | 'delete', newData: any) => {
    dataSyncService.emit(type, action, newData);
  }, [type]);

  return {
    data,
    lastUpdate,
    updateData
  };
}

// Hook for practice statistics
export function usePracticeStats() {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    recentSessions: []
  });

  useEffect(() => {
    // Load initial stats
    setStats(dataSyncService.getPracticeStats());

    // Subscribe to practice data changes
    const unsubscribe = dataSyncService.subscribe('practice', () => {
      setStats(dataSyncService.getPracticeStats());
    });

    return unsubscribe;
  }, []);

  return stats;
}

// Hook for notes statistics
export function useNotesStats() {
  const [stats, setStats] = useState({
    totalNotes: 0,
    favoriteNotes: 0,
    recentNotes: []
  });

  useEffect(() => {
    // Load initial stats
    setStats(dataSyncService.getNotesStats());

    // Subscribe to notes data changes
    const unsubscribe = dataSyncService.subscribe('notes', () => {
      setStats(dataSyncService.getNotesStats());
    });

    return unsubscribe;
  }, []);

  return stats;
}

// Hook for current affairs statistics
export function useCurrentAffairsStats() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    readArticles: 0,
    bookmarkedArticles: 0,
    readingProgress: 0
  });

  useEffect(() => {
    // Load initial stats
    setStats(dataSyncService.getCurrentAffairsStats());

    // Subscribe to current affairs data changes
    const unsubscribe = dataSyncService.subscribe('currentAffairs', () => {
      setStats(dataSyncService.getCurrentAffairsStats());
    });

    return unsubscribe;
  }, []);

  return stats;
}

// Hook for revision statistics
export function useRevisionStats() {
  const [stats, setStats] = useState({
    totalTopics: 0,
    completedTopics: 0,
    completionRate: 0,
    upcomingRevisions: []
  });

  useEffect(() => {
    // Load initial stats
    setStats(dataSyncService.getRevisionStats());

    // Subscribe to revision data changes
    const unsubscribe = dataSyncService.subscribe('revision', () => {
      setStats(dataSyncService.getRevisionStats());
    });

    return unsubscribe;
  }, []);

  return stats;
}

// Hook for daily goals
export function useDailyGoals() {
  const [goals, setGoals] = useState({
    goals: [],
    completed: 0,
    total: 0,
    progress: 0
  });

  useEffect(() => {
    // Load initial goals
    setGoals(dataSyncService.getDailyGoals());

    // Subscribe to goals data changes
    const unsubscribe = dataSyncService.subscribe('goals', () => {
      setGoals(dataSyncService.getDailyGoals());
    });

    return unsubscribe;
  }, []);

  const updateGoal = useCallback((goalId: string, completed: boolean) => {
    dataSyncService.updateDailyGoal(goalId, completed);
  }, []);

  const addGoal = useCallback((text: string) => {
    return dataSyncService.addDailyGoal(text);
  }, []);

  return {
    ...goals,
    updateGoal,
    addGoal
  };
}

// Hook for real-time dashboard data
export function useDashboardData() {
  const practiceStats = usePracticeStats();
  const notesStats = useNotesStats();
  const currentAffairsStats = useCurrentAffairsStats();
  const revisionStats = useRevisionStats();
  const dailyGoals = useDailyGoals();

  return {
    practice: practiceStats,
    notes: notesStats,
    currentAffairs: currentAffairsStats,
    revision: revisionStats,
    goals: dailyGoals
  };
}

// Hook for performance analytics
export function usePerformanceAnalytics() {
  const [analytics, setAnalytics] = useState({
    weeklyProgress: [] as any[],
    subjectPerformance: [] as any[],
    studyTime: 0,
    streakDays: 0
  });

  useEffect(() => {
    // Calculate analytics from all data sources
    const practiceStats = dataSyncService.getPracticeStats();
    const notesStats = dataSyncService.getNotesStats();
    const revisionStats = dataSyncService.getRevisionStats();

    // Calculate weekly progress
    const weeklyProgress = calculateWeeklyProgress();
    
    // Calculate subject performance
    const subjectPerformance = calculateSubjectPerformance(practiceStats);
    
    // Calculate study time (mock calculation)
    const studyTime = calculateStudyTime();
    
    // Calculate streak days
    const streakDays = calculateStreakDays();

    setAnalytics({
      weeklyProgress,
      subjectPerformance,
      studyTime,
      streakDays
    });

    // Subscribe to all relevant data changes
    const unsubscribers = [
      dataSyncService.subscribe('practice', updateAnalytics),
      dataSyncService.subscribe('notes', updateAnalytics),
      dataSyncService.subscribe('revision', updateAnalytics),
      dataSyncService.subscribe('goals', updateAnalytics)
    ];

    function updateAnalytics() {
      // Recalculate analytics when data changes
      const newWeeklyProgress = calculateWeeklyProgress();
      const newSubjectPerformance = calculateSubjectPerformance(dataSyncService.getPracticeStats());
      const newStudyTime = calculateStudyTime();
      const newStreakDays = calculateStreakDays();

      setAnalytics({
        weeklyProgress: newWeeklyProgress,
        subjectPerformance: newSubjectPerformance,
        studyTime: newStudyTime,
        streakDays: newStreakDays
      });
    }

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  return analytics;
}

// Helper functions for analytics calculations
function calculateWeeklyProgress() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    practice: Math.floor(Math.random() * 100),
    notes: Math.floor(Math.random() * 50),
    revision: Math.floor(Math.random() * 30)
  }));
}

function calculateSubjectPerformance(practiceStats: any) {
  const subjects = ['History', 'Geography', 'Polity', 'Economics', 'Environment', 'Science'];
  return subjects.map(subject => ({
    subject,
    accuracy: Math.floor(Math.random() * 40) + 60, // 60-100%
    questions: Math.floor(Math.random() * 50) + 10
  }));
}

function calculateStudyTime() {
  // Mock calculation - in real app, this would track actual study time
  return Math.floor(Math.random() * 8) + 2; // 2-10 hours
}

function calculateStreakDays() {
  // Mock calculation - in real app, this would track consecutive study days
  return Math.floor(Math.random() * 30) + 1; // 1-30 days
}

export default useDataSync;
