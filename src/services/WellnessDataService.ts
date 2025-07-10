'use client';

export interface WellnessEntry {
  id: string;
  date: string;
  studyHours: number;
  breakHours: number;
  sleepHours: number;
  exerciseMinutes: number;
  stressLevel: 1 | 2 | 3 | 4 | 5; // 1 = very low, 5 = very high
  mood: 'excellent' | 'good' | 'average' | 'poor' | 'terrible';
  energyLevel: 1 | 2 | 3 | 4 | 5; // 1 = very low, 5 = very high
  focusQuality: 1 | 2 | 3 | 4 | 5; // 1 = very poor, 5 = excellent
  hydrationGlasses: number;
  mealsQuality: 'excellent' | 'good' | 'average' | 'poor';
  screenTimeHours: number;
  socialInteractionHours: number;
  notes?: string;
  symptoms?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WellnessGoal {
  id: string;
  category: 'sleep' | 'exercise' | 'study' | 'stress' | 'nutrition' | 'screen-time';
  target: number;
  unit: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface WellnessInsight {
  id: string;
  type: 'warning' | 'recommendation' | 'achievement' | 'trend';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  actionable: boolean;
  suggestions?: string[];
  generatedAt: string;
}

export interface WellnessStats {
  averageStress: number;
  averageMood: number;
  averageEnergy: number;
  averageFocus: number;
  totalStudyHours: number;
  totalExerciseMinutes: number;
  averageSleepHours: number;
  streaks: {
    currentStudyStreak: number;
    currentExerciseStreak: number;
    currentSleepStreak: number;
  };
  trends: {
    stressTrend: 'improving' | 'stable' | 'declining';
    moodTrend: 'improving' | 'stable' | 'declining';
    energyTrend: 'improving' | 'stable' | 'declining';
  };
}

class WellnessDataService {
  private static instance: WellnessDataService;
  private wellnessEntries: WellnessEntry[] = [];
  private wellnessGoals: WellnessGoal[] = [];
  private wellnessInsights: WellnessInsight[] = [];
  private readonly STORAGE_KEY_ENTRIES = 'upsc-wellness-entries';
  private readonly STORAGE_KEY_GOALS = 'upsc-wellness-goals';
  private readonly STORAGE_KEY_INSIGHTS = 'upsc-wellness-insights';

  private constructor() {
    this.loadData();
    this.initializeDefaultGoals();
  }

  static getInstance(): WellnessDataService {
    if (!WellnessDataService.instance) {
      WellnessDataService.instance = new WellnessDataService();
    }
    return WellnessDataService.instance;
  }

  // Load data from localStorage
  private loadData(): void {
    if (typeof window === 'undefined') return;

    try {
      const entries = localStorage.getItem(this.STORAGE_KEY_ENTRIES);
      if (entries) {
        this.wellnessEntries = JSON.parse(entries);
      }

      const goals = localStorage.getItem(this.STORAGE_KEY_GOALS);
      if (goals) {
        this.wellnessGoals = JSON.parse(goals);
      }

      const insights = localStorage.getItem(this.STORAGE_KEY_INSIGHTS);
      if (insights) {
        this.wellnessInsights = JSON.parse(insights);
      }
    } catch (error) {
      console.error('Error loading wellness data:', error);
    }
  }

  // Save data to localStorage
  private saveData(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.STORAGE_KEY_ENTRIES, JSON.stringify(this.wellnessEntries));
      localStorage.setItem(this.STORAGE_KEY_GOALS, JSON.stringify(this.wellnessGoals));
      localStorage.setItem(this.STORAGE_KEY_INSIGHTS, JSON.stringify(this.wellnessInsights));
    } catch (error) {
      console.error('Error saving wellness data:', error);
    }
  }

  // Initialize default wellness goals
  private initializeDefaultGoals(): void {
    if (this.wellnessGoals.length === 0) {
      const defaultGoals: Omit<WellnessGoal, 'id' | 'createdAt'>[] = [
        {
          category: 'sleep',
          target: 7,
          unit: 'hours',
          description: 'Get at least 7 hours of sleep daily',
          isActive: true
        },
        {
          category: 'exercise',
          target: 30,
          unit: 'minutes',
          description: 'Exercise for at least 30 minutes daily',
          isActive: true
        },
        {
          category: 'study',
          target: 6,
          unit: 'hours',
          description: 'Study for 6 hours daily',
          isActive: true
        },
        {
          category: 'stress',
          target: 3,
          unit: 'level',
          description: 'Keep stress level below 3',
          isActive: true
        }
      ];

      defaultGoals.forEach(goal => this.addGoal(goal));
    }
  }

  // Wellness Entry Management
  addWellnessEntry(entry: Omit<WellnessEntry, 'id' | 'createdAt' | 'updatedAt'>): WellnessEntry {
    const now = new Date().toISOString();
    const wellnessEntry: WellnessEntry = {
      ...entry,
      id: `wellness_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now
    };

    // Remove existing entry for the same date
    this.wellnessEntries = this.wellnessEntries.filter(e => e.date !== entry.date);
    this.wellnessEntries.unshift(wellnessEntry);

    this.saveData();
    this.generateInsights();
    return wellnessEntry;
  }

  updateWellnessEntry(id: string, updates: Partial<WellnessEntry>): WellnessEntry | null {
    const index = this.wellnessEntries.findIndex(e => e.id === id);
    if (index === -1) return null;

    this.wellnessEntries[index] = {
      ...this.wellnessEntries[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveData();
    this.generateInsights();
    return this.wellnessEntries[index];
  }

  getWellnessEntry(date: string): WellnessEntry | null {
    return this.wellnessEntries.find(e => e.date === date) || null;
  }

  getWellnessEntries(days: number = 30): WellnessEntry[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.wellnessEntries
      .filter(entry => new Date(entry.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Wellness Goals Management
  addGoal(goal: Omit<WellnessGoal, 'id' | 'createdAt'>): WellnessGoal {
    const wellnessGoal: WellnessGoal = {
      ...goal,
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };

    this.wellnessGoals.push(wellnessGoal);
    this.saveData();
    return wellnessGoal;
  }

  updateGoal(id: string, updates: Partial<WellnessGoal>): WellnessGoal | null {
    const index = this.wellnessGoals.findIndex(g => g.id === id);
    if (index === -1) return null;

    this.wellnessGoals[index] = { ...this.wellnessGoals[index], ...updates };
    this.saveData();
    return this.wellnessGoals[index];
  }

  getActiveGoals(): WellnessGoal[] {
    return this.wellnessGoals.filter(g => g.isActive);
  }

  // Wellness Statistics
  getWellnessStats(days: number = 30): WellnessStats {
    const entries = this.getWellnessEntries(days);
    
    if (entries.length === 0) {
      return {
        averageStress: 0,
        averageMood: 0,
        averageEnergy: 0,
        averageFocus: 0,
        totalStudyHours: 0,
        totalExerciseMinutes: 0,
        averageSleepHours: 0,
        streaks: {
          currentStudyStreak: 0,
          currentExerciseStreak: 0,
          currentSleepStreak: 0
        },
        trends: {
          stressTrend: 'stable',
          moodTrend: 'stable',
          energyTrend: 'stable'
        }
      };
    }

    // Calculate averages
    const averageStress = entries.reduce((sum, e) => sum + e.stressLevel, 0) / entries.length;
    const averageEnergy = entries.reduce((sum, e) => sum + e.energyLevel, 0) / entries.length;
    const averageFocus = entries.reduce((sum, e) => sum + e.focusQuality, 0) / entries.length;
    const totalStudyHours = entries.reduce((sum, e) => sum + e.studyHours, 0);
    const totalExerciseMinutes = entries.reduce((sum, e) => sum + e.exerciseMinutes, 0);
    const averageSleepHours = entries.reduce((sum, e) => sum + e.sleepHours, 0) / entries.length;

    // Convert mood to numeric for averaging
    const moodValues = { terrible: 1, poor: 2, average: 3, good: 4, excellent: 5 };
    const averageMood = entries.reduce((sum, e) => sum + moodValues[e.mood], 0) / entries.length;

    // Calculate streaks
    const streaks = this.calculateStreaks(entries);

    // Calculate trends
    const trends = this.calculateTrends(entries);

    return {
      averageStress,
      averageMood,
      averageEnergy,
      averageFocus,
      totalStudyHours,
      totalExerciseMinutes,
      averageSleepHours,
      streaks,
      trends
    };
  }

  // Calculate current streaks
  private calculateStreaks(entries: WellnessEntry[]): WellnessStats['streaks'] {
    const sortedEntries = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let studyStreak = 0;
    let exerciseStreak = 0;
    let sleepStreak = 0;

    for (const entry of sortedEntries) {
      if (entry.studyHours >= 4) studyStreak++;
      else break;
    }

    for (const entry of sortedEntries) {
      if (entry.exerciseMinutes >= 30) exerciseStreak++;
      else break;
    }

    for (const entry of sortedEntries) {
      if (entry.sleepHours >= 7) sleepStreak++;
      else break;
    }

    return {
      currentStudyStreak: studyStreak,
      currentExerciseStreak: exerciseStreak,
      currentSleepStreak: sleepStreak
    };
  }

  // Calculate trends
  private calculateTrends(entries: WellnessEntry[]): WellnessStats['trends'] {
    if (entries.length < 7) {
      return {
        stressTrend: 'stable',
        moodTrend: 'stable',
        energyTrend: 'stable'
      };
    }

    const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const recentEntries = sortedEntries.slice(-7);
    const olderEntries = sortedEntries.slice(-14, -7);

    const moodValues = { terrible: 1, poor: 2, average: 3, good: 4, excellent: 5 };

    const recentStress = recentEntries.reduce((sum, e) => sum + e.stressLevel, 0) / recentEntries.length;
    const olderStress = olderEntries.reduce((sum, e) => sum + e.stressLevel, 0) / olderEntries.length;

    const recentMood = recentEntries.reduce((sum, e) => sum + moodValues[e.mood], 0) / recentEntries.length;
    const olderMood = olderEntries.reduce((sum, e) => sum + moodValues[e.mood], 0) / olderEntries.length;

    const recentEnergy = recentEntries.reduce((sum, e) => sum + e.energyLevel, 0) / recentEntries.length;
    const olderEnergy = olderEntries.reduce((sum, e) => sum + e.energyLevel, 0) / olderEntries.length;

    const getTrend = (recent: number, older: number): 'improving' | 'stable' | 'declining' => {
      const diff = recent - older;
      if (Math.abs(diff) < 0.3) return 'stable';
      return diff > 0 ? 'improving' : 'declining';
    };

    return {
      stressTrend: getTrend(olderStress, recentStress), // Lower stress is better
      moodTrend: getTrend(recentMood, olderMood),
      energyTrend: getTrend(recentEnergy, olderEnergy)
    };
  }

  // Generate wellness insights
  private generateInsights(): void {
    const entries = this.getWellnessEntries(7);
    const stats = this.getWellnessStats(7);
    const newInsights: WellnessInsight[] = [];

    // Stress level warnings
    if (stats.averageStress >= 4) {
      newInsights.push({
        id: `insight_stress_${Date.now()}`,
        type: 'warning',
        title: 'High Stress Levels Detected',
        description: 'Your stress levels have been consistently high this week.',
        severity: 'high',
        actionable: true,
        suggestions: [
          'Take regular breaks during study sessions',
          'Practice meditation or deep breathing exercises',
          'Consider reducing study load temporarily',
          'Ensure adequate sleep and exercise'
        ],
        generatedAt: new Date().toISOString()
      });
    }

    // Sleep recommendations
    if (stats.averageSleepHours < 6) {
      newInsights.push({
        id: `insight_sleep_${Date.now()}`,
        type: 'recommendation',
        title: 'Insufficient Sleep Detected',
        description: 'You\'re getting less than 6 hours of sleep on average.',
        severity: 'medium',
        actionable: true,
        suggestions: [
          'Set a consistent bedtime routine',
          'Avoid screens 1 hour before bed',
          'Create a comfortable sleep environment',
          'Limit caffeine intake after 2 PM'
        ],
        generatedAt: new Date().toISOString()
      });
    }

    // Exercise achievements
    if (stats.streaks.currentExerciseStreak >= 7) {
      newInsights.push({
        id: `insight_exercise_${Date.now()}`,
        type: 'achievement',
        title: 'Exercise Streak Achievement!',
        description: `Congratulations! You've maintained your exercise routine for ${stats.streaks.currentExerciseStreak} days.`,
        severity: 'low',
        actionable: false,
        generatedAt: new Date().toISOString()
      });
    }

    // Replace old insights with new ones
    this.wellnessInsights = newInsights;
    this.saveData();
  }

  // Get wellness insights
  getWellnessInsights(): WellnessInsight[] {
    return [...this.wellnessInsights];
  }

  // Clear old insights
  clearOldInsights(days: number = 7): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    this.wellnessInsights = this.wellnessInsights.filter(insight => {
      const insightDate = new Date(insight.generatedAt);
      return insightDate >= cutoffDate;
    });

    this.saveData();
  }

  // Export wellness data
  exportWellnessData(): string {
    return JSON.stringify({
      entries: this.wellnessEntries,
      goals: this.wellnessGoals,
      insights: this.wellnessInsights,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  // Import wellness data
  importWellnessData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.entries) this.wellnessEntries = data.entries;
      if (data.goals) this.wellnessGoals = data.goals;
      if (data.insights) this.wellnessInsights = data.insights;
      
      this.saveData();
      return true;
    } catch (error) {
      console.error('Error importing wellness data:', error);
      return false;
    }
  }
}

export default WellnessDataService;
