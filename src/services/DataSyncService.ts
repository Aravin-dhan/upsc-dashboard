// Data Synchronization Service for Dashboard Widgets
// Ensures real-time updates across all components

type DataType = 'practice' | 'notes' | 'currentAffairs' | 'revision' | 'analytics' | 'goals';

interface DataChangeEvent {
  type: DataType;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
}

class DataSyncService {
  private listeners: Map<DataType, Set<(event: DataChangeEvent) => void>> = new Map();
  private cache: Map<string, any> = new Map();

  constructor() {
    // Initialize listeners for each data type
    const dataTypes: DataType[] = ['practice', 'notes', 'currentAffairs', 'revision', 'analytics', 'goals'];
    dataTypes.forEach(type => {
      this.listeners.set(type, new Set());
    });

    // Load cached data from localStorage
    this.loadCachedData();
  }

  // Subscribe to data changes
  subscribe(type: DataType, callback: (event: DataChangeEvent) => void): () => void {
    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.add(callback);
    }

    // Return unsubscribe function
    return () => {
      const typeListeners = this.listeners.get(type);
      if (typeListeners) {
        typeListeners.delete(callback);
      }
    };
  }

  // Emit data change event
  emit(type: DataType, action: 'create' | 'update' | 'delete', data: any) {
    const event: DataChangeEvent = {
      type,
      action,
      data,
      timestamp: new Date().toISOString()
    };

    // Update cache
    this.updateCache(type, action, data);

    // Notify all listeners
    const typeListeners = this.listeners.get(type);
    if (typeListeners) {
      typeListeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Error in data sync listener:', error);
        }
      });
    }

    // Persist to localStorage
    this.persistData(type, data);
  }

  // Get cached data
  getCachedData(type: DataType, key?: string): any {
    const cacheKey = key ? `${type}-${key}` : type;
    return this.cache.get(cacheKey);
  }

  // Update cache
  private updateCache(type: DataType, action: string, data: any) {
    const cacheKey = data.id ? `${type}-${data.id}` : type;
    
    switch (action) {
      case 'create':
      case 'update':
        this.cache.set(cacheKey, data);
        break;
      case 'delete':
        this.cache.delete(cacheKey);
        break;
    }

    // Update type-level cache
    const typeData = this.cache.get(type) || [];
    if (Array.isArray(typeData)) {
      switch (action) {
        case 'create':
          typeData.push(data);
          break;
        case 'update':
          const updateIndex = typeData.findIndex((item: any) => item.id === data.id);
          if (updateIndex !== -1) {
            typeData[updateIndex] = data;
          }
          break;
        case 'delete':
          const deleteIndex = typeData.findIndex((item: any) => item.id === data.id);
          if (deleteIndex !== -1) {
            typeData.splice(deleteIndex, 1);
          }
          break;
      }
      this.cache.set(type, typeData);
    }
  }

  // Load cached data from localStorage
  private loadCachedData() {
    if (typeof window === 'undefined') return;

    const dataTypes: DataType[] = ['practice', 'notes', 'currentAffairs', 'revision', 'analytics', 'goals'];
    
    dataTypes.forEach(type => {
      try {
        const stored = localStorage.getItem(`upsc-${type}-data`);
        if (stored) {
          const data = JSON.parse(stored);
          this.cache.set(type, data);
        }
      } catch (error) {
        console.error(`Error loading cached data for ${type}:`, error);
      }
    });
  }

  // Persist data to localStorage
  private persistData(type: DataType, data: any) {
    if (typeof window === 'undefined') return;

    try {
      const typeData = this.cache.get(type);
      if (typeData) {
        localStorage.setItem(`upsc-${type}-data`, JSON.stringify(typeData));
      }
    } catch (error) {
      console.error(`Error persisting data for ${type}:`, error);
    }
  }

  // Get practice statistics
  getPracticeStats() {
    const practiceData = this.getCachedData('practice') || [];
    const totalQuestions = practiceData.length;
    const correctAnswers = practiceData.filter((q: any) => q.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    
    return {
      totalQuestions,
      correctAnswers,
      accuracy: Math.round(accuracy * 10) / 10,
      recentSessions: practiceData.slice(-5)
    };
  }

  // Get notes statistics
  getNotesStats() {
    const notesData = this.getCachedData('notes') || [];
    const totalNotes = notesData.length;
    const favoriteNotes = notesData.filter((note: any) => note.isFavorite).length;
    const recentNotes = notesData
      .sort((a: any, b: any) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
      .slice(0, 5);
    
    return {
      totalNotes,
      favoriteNotes,
      recentNotes
    };
  }

  // Get current affairs statistics
  getCurrentAffairsStats() {
    const currentAffairsData = this.getCachedData('currentAffairs') || [];
    const totalArticles = currentAffairsData.length;
    const readArticles = currentAffairsData.filter((article: any) => article.isRead).length;
    const bookmarkedArticles = currentAffairsData.filter((article: any) => article.isBookmarked).length;
    
    return {
      totalArticles,
      readArticles,
      bookmarkedArticles,
      readingProgress: totalArticles > 0 ? (readArticles / totalArticles) * 100 : 0
    };
  }

  // Get revision statistics
  getRevisionStats() {
    const revisionData = this.getCachedData('revision') || [];
    const totalTopics = revisionData.length;
    const completedTopics = revisionData.filter((topic: any) => topic.isCompleted).length;
    const upcomingRevisions = revisionData
      .filter((topic: any) => !topic.isCompleted)
      .sort((a: any, b: any) => new Date(a.nextRevision).getTime() - new Date(b.nextRevision).getTime())
      .slice(0, 5);
    
    return {
      totalTopics,
      completedTopics,
      completionRate: totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0,
      upcomingRevisions
    };
  }

  // Get daily goals
  getDailyGoals() {
    const goalsData = this.getCachedData('goals') || [];
    const today = new Date().toDateString();
    let todayGoals = goalsData.filter((goal: any) =>
      new Date(goal.date).toDateString() === today
    );

    // Add default goals if none exist for today
    if (todayGoals.length === 0) {
      const defaultGoals = [
        {
          id: 'default-1',
          text: 'Complete Modern History Chapter 5',
          completed: false,
          date: new Date().toISOString(),
          createdAt: new Date().toISOString()
        },
        {
          id: 'default-2',
          text: 'Practice 20 MCQs',
          completed: false,
          date: new Date().toISOString(),
          createdAt: new Date().toISOString()
        },
        {
          id: 'default-3',
          text: 'Read today\'s current affairs',
          completed: false,
          date: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
      ];

      // Add default goals to cache
      const updatedGoalsData = [...goalsData, ...defaultGoals];
      this.cache.set('goals', updatedGoalsData);
      this.persistData('goals', updatedGoalsData);
      todayGoals = defaultGoals;
    }

    const completedGoals = todayGoals.filter((goal: any) => goal.completed).length;
    const totalGoals = todayGoals.length;

    return {
      goals: todayGoals,
      completed: completedGoals,
      total: totalGoals,
      progress: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0
    };
  }

  // Update daily goal
  updateDailyGoal(goalId: string, completed: boolean) {
    const goalsData = this.getCachedData('goals') || [];
    const updatedGoals = goalsData.map((goal: any) => 
      goal.id === goalId ? { ...goal, completed } : goal
    );
    
    this.emit('goals', 'update', { id: goalId, completed });
  }

  // Add daily goal
  addDailyGoal(text: string) {
    const newGoal = {
      id: Date.now().toString(),
      text,
      completed: false,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    this.emit('goals', 'create', newGoal);
    return newGoal;
  }

  // Clear old data (cleanup)
  clearOldData(daysToKeep: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    const dataTypes: DataType[] = ['practice', 'notes', 'currentAffairs', 'revision', 'analytics', 'goals'];
    
    dataTypes.forEach(type => {
      const data = this.getCachedData(type) || [];
      if (Array.isArray(data)) {
        const filteredData = data.filter((item: any) => {
          const itemDate = new Date(item.createdAt || item.date || item.lastModified);
          return itemDate >= cutoffDate;
        });
        
        if (filteredData.length !== data.length) {
          this.cache.set(type, filteredData);
          this.persistData(type, filteredData);
        }
      }
    });
  }
}

// Create singleton instance
const dataSyncService = new DataSyncService();

export default dataSyncService;
