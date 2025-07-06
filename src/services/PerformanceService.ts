export interface PerformanceMetric {
  id: string;
  userId?: string;
  date: string; // ISO date string
  type: 'practice' | 'study' | 'revision' | 'mock_test' | 'answer_writing' | 'reading';
  subject: string;
  topic?: string;
  subtopic?: string;
  
  // Performance data
  questionsAttempted?: number;
  questionsCorrect?: number;
  timeSpent: number; // in minutes
  accuracy?: number; // percentage
  speed?: number; // questions per minute
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Detailed metrics
  conceptsLearned?: string[];
  weakAreas?: string[];
  strongAreas?: string[];
  mistakeTypes?: string[];
  improvementAreas?: string[];
  
  // Session details
  sessionId?: string;
  startTime: string;
  endTime: string;
  breaks?: number;
  focusScore?: number; // 1-10 scale
  confidenceLevel?: number; // 1-10 scale
  
  // Metadata
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  streakStartDate: string;
}

export interface SubjectProgress {
  subject: string;
  totalTime: number; // minutes
  questionsAttempted: number;
  questionsCorrect: number;
  accuracy: number;
  averageSpeed: number;
  topicsCompleted: number;
  totalTopics: number;
  completionPercentage: number;
  lastStudied: string;
  weakAreas: string[];
  strongAreas: string[];
  trend: 'improving' | 'declining' | 'stable';
}

export interface PerformanceAnalytics {
  // Overall metrics
  totalStudyTime: number; // minutes
  totalQuestionsAttempted: number;
  totalQuestionsCorrect: number;
  overallAccuracy: number;
  averageSessionTime: number;
  
  // Streaks and consistency
  studyStreak: StudyStreak;
  studyDaysThisWeek: number;
  studyDaysThisMonth: number;
  consistencyScore: number; // 1-10 scale
  
  // Subject-wise performance
  subjectProgress: SubjectProgress[];
  
  // Time-based analytics
  dailyAverages: {
    studyTime: number;
    accuracy: number;
    questionsAttempted: number;
  };
  weeklyTrends: {
    week: string;
    studyTime: number;
    accuracy: number;
    improvement: number;
  }[];
  monthlyProgress: {
    month: string;
    studyTime: number;
    accuracy: number;
    topicsCompleted: number;
  }[];
  
  // Performance insights
  insights: {
    type: 'strength' | 'weakness' | 'improvement' | 'recommendation' | 'coaching' | 'strategy';
    category: 'answer_writing' | 'time_management' | 'content_knowledge' | 'exam_strategy' | 'study_habits' | 'revision' | 'mock_tests';
    message: string;
    detailedAnalysis: string;
    coachingAdvice: string;
    actionSteps: string[];
    priority: 'high' | 'medium' | 'low';
    actionable: boolean;
    upscSpecific: boolean;
    examRelevance: 'prelims' | 'mains' | 'interview' | 'all';
  }[];
  
  // Goals and targets
  goals: {
    dailyStudyTime: number;
    weeklyAccuracy: number;
    monthlyTopics: number;
    targetExamDate?: string;
  };
  
  // Recent performance
  recentSessions: PerformanceMetric[];
  lastUpdated: string;
}

class PerformanceService {
  private static instance: PerformanceService;
  private storageKey = 'upsc-performance-metrics';
  private analyticsKey = 'upsc-performance-analytics';
  private listeners: Set<(analytics: PerformanceAnalytics) => void> = new Set();

  static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService();
    }
    return PerformanceService.instance;
  }

  // Event listener management for real-time updates
  subscribe(callback: (analytics: PerformanceAnalytics) => void): () => void {
    this.listeners.add(callback);
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(analytics: PerformanceAnalytics): void {
    this.listeners.forEach(callback => {
      try {
        callback(analytics);
      } catch (error) {
        console.error('Error in performance analytics listener:', error);
      }
    });
  }

  // Core data operations
  getAllMetrics(): PerformanceMetric[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];
      
      const metrics = JSON.parse(data);
      if (!Array.isArray(metrics)) {
        console.warn('Performance metrics data is not an array, resetting...');
        this.saveMetrics([]);
        return [];
      }
      
      return metrics.map(metric => this.validateMetric(metric)).filter(Boolean) as PerformanceMetric[];
    } catch (error) {
      console.error('Error loading performance metrics:', error);
      this.saveMetrics([]); // Reset corrupted data
      return [];
    }
  }

  private validateMetric(metric: any): PerformanceMetric | null {
    try {
      // Ensure required fields exist
      if (!metric.id || !metric.date || !metric.type || !metric.timeSpent) {
        console.warn('Invalid metric missing required fields:', metric);
        return null;
      }

      // Validate dates
      const startDate = new Date(metric.startTime);
      const endDate = new Date(metric.endTime);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.warn('Invalid metric dates:', metric);
        return null;
      }

      // Return validated metric with defaults
      return {
        id: metric.id,
        date: metric.date,
        type: metric.type,
        subject: metric.subject || 'General',
        topic: metric.topic,
        subtopic: metric.subtopic,
        questionsAttempted: metric.questionsAttempted || 0,
        questionsCorrect: metric.questionsCorrect || 0,
        timeSpent: metric.timeSpent,
        accuracy: metric.accuracy || 0,
        speed: metric.speed || 0,
        difficulty: metric.difficulty || 'medium',
        conceptsLearned: metric.conceptsLearned || [],
        weakAreas: metric.weakAreas || [],
        strongAreas: metric.strongAreas || [],
        mistakeTypes: metric.mistakeTypes || [],
        improvementAreas: metric.improvementAreas || [],
        sessionId: metric.sessionId,
        startTime: metric.startTime,
        endTime: metric.endTime,
        breaks: metric.breaks || 0,
        focusScore: metric.focusScore || 5,
        confidenceLevel: metric.confidenceLevel || 5,
        tags: metric.tags || [],
        notes: metric.notes || '',
        createdAt: metric.createdAt || new Date().toISOString(),
        updatedAt: metric.updatedAt || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error validating metric:', error);
      return null;
    }
  }

  private saveMetrics(metrics: PerformanceMetric[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(metrics));
      // Recalculate analytics and notify listeners
      const analytics = this.calculateAnalytics(metrics);
      this.saveAnalytics(analytics);
      this.notifyListeners(analytics);
    } catch (error) {
      console.error('Error saving performance metrics:', error);
      throw new Error('Failed to save performance metrics');
    }
  }

  private saveAnalytics(analytics: PerformanceAnalytics): void {
    try {
      localStorage.setItem(this.analyticsKey, JSON.stringify(analytics));
    } catch (error) {
      console.error('Error saving analytics:', error);
    }
  }

  // CRUD operations
  addMetric(metricData: Omit<PerformanceMetric, 'id' | 'createdAt' | 'updatedAt'>): PerformanceMetric {
    const newMetric: PerformanceMetric = {
      ...metricData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const metrics = this.getAllMetrics();
    metrics.push(newMetric);
    this.saveMetrics(metrics);
    
    return newMetric;
  }

  updateMetric(id: string, updates: Partial<PerformanceMetric>): PerformanceMetric | null {
    const metrics = this.getAllMetrics();
    const metricIndex = metrics.findIndex(metric => metric.id === id);
    
    if (metricIndex === -1) {
      console.warn('Metric not found for update:', id);
      return null;
    }

    const updatedMetric = {
      ...metrics[metricIndex],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    metrics[metricIndex] = updatedMetric;
    this.saveMetrics(metrics);
    
    return updatedMetric;
  }

  deleteMetric(id: string): boolean {
    const metrics = this.getAllMetrics();
    const initialLength = metrics.length;
    const filteredMetrics = metrics.filter(metric => metric.id !== id);
    
    if (filteredMetrics.length === initialLength) {
      console.warn('Metric not found for deletion:', id);
      return false;
    }

    this.saveMetrics(filteredMetrics);
    return true;
  }

  // Analytics calculation
  calculateAnalytics(metrics?: PerformanceMetric[]): PerformanceAnalytics {
    const allMetrics = metrics || this.getAllMetrics();
    const now = new Date();

    // Handle empty metrics case
    if (allMetrics.length === 0) {
      return {
        totalStudyTime: 0,
        averageAccuracy: 0,
        questionsAttempted: 0,
        questionsCorrect: 0,
        studyStreak: { currentStreak: 0, longestStreak: 0, lastStudyDate: '', streakStartDate: '' },
        subjectProgress: [],
        insights: [],
        trends: { studyTime: 0, accuracy: 0, questionsAttempted: 0 },
        weeklyGoalProgress: 0,
        monthlyGoalProgress: 0,
        lastUpdated: now.toISOString()
      };
    }

    // Calculate overall metrics
    const totalStudyTime = allMetrics.reduce((sum, m) => sum + m.timeSpent, 0);
    const totalQuestionsAttempted = allMetrics.reduce((sum, m) => sum + (m.questionsAttempted || 0), 0);
    const totalQuestionsCorrect = allMetrics.reduce((sum, m) => sum + (m.questionsCorrect || 0), 0);
    const overallAccuracy = totalQuestionsAttempted > 0 ? (totalQuestionsCorrect / totalQuestionsAttempted) * 100 : 0;
    
    // Calculate study streak
    const studyStreak = this.calculateStudyStreak(allMetrics);
    
    // Calculate subject progress
    const subjectProgress = this.calculateSubjectProgress(allMetrics);
    
    // Generate insights
    const insights = this.generateInsights(allMetrics, subjectProgress);
    
    // Calculate trends
    const weeklyTrends = this.calculateWeeklyTrends(allMetrics);
    const monthlyProgress = this.calculateMonthlyProgress(allMetrics);
    
    return {
      totalStudyTime,
      totalQuestionsAttempted,
      totalQuestionsCorrect,
      overallAccuracy,
      averageSessionTime: allMetrics.length > 0 ? totalStudyTime / allMetrics.length : 0,
      studyStreak,
      studyDaysThisWeek: this.getStudyDaysInPeriod(allMetrics, 'week'),
      studyDaysThisMonth: this.getStudyDaysInPeriod(allMetrics, 'month'),
      consistencyScore: this.calculateConsistencyScore(allMetrics),
      subjectProgress,
      dailyAverages: this.calculateDailyAverages(allMetrics),
      weeklyTrends,
      monthlyProgress,
      insights,
      goals: {
        dailyStudyTime: 240, // 4 hours default
        weeklyAccuracy: 75,
        monthlyTopics: 20
      },
      recentSessions: allMetrics.slice(-10).reverse(),
      lastUpdated: new Date().toISOString()
    };
  }

  private calculateStudyStreak(metrics: PerformanceMetric[]): StudyStreak {
    const studyDates = [...new Set(metrics.map(m => m.date))].sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date().toISOString().split('T')[0];
    let lastDate = '';
    
    for (let i = studyDates.length - 1; i >= 0; i--) {
      const date = studyDates[i];
      if (i === studyDates.length - 1) {
        tempStreak = 1;
        lastDate = date;
      } else {
        const prevDate = new Date(lastDate);
        const currentDate = new Date(date);
        const diffDays = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          if (currentStreak === 0 && lastDate === today) {
            currentStreak = tempStreak;
          }
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
        lastDate = date;
      }
    }
    
    if (currentStreak === 0 && studyDates[studyDates.length - 1] === today) {
      currentStreak = tempStreak;
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return {
      currentStreak,
      longestStreak,
      lastStudyDate: studyDates[studyDates.length - 1] || '',
      streakStartDate: studyDates[studyDates.length - currentStreak] || ''
    };
  }

  private calculateSubjectProgress(metrics: PerformanceMetric[]): SubjectProgress[] {
    const subjectMap = new Map<string, PerformanceMetric[]>();
    
    metrics.forEach(metric => {
      if (!subjectMap.has(metric.subject)) {
        subjectMap.set(metric.subject, []);
      }
      subjectMap.get(metric.subject)!.push(metric);
    });
    
    return Array.from(subjectMap.entries()).map(([subject, subjectMetrics]) => {
      const totalTime = subjectMetrics.reduce((sum, m) => sum + m.timeSpent, 0);
      const questionsAttempted = subjectMetrics.reduce((sum, m) => sum + (m.questionsAttempted || 0), 0);
      const questionsCorrect = subjectMetrics.reduce((sum, m) => sum + (m.questionsCorrect || 0), 0);
      const accuracy = questionsAttempted > 0 ? (questionsCorrect / questionsAttempted) * 100 : 0;
      
      const uniqueTopics = new Set(subjectMetrics.map(m => m.topic).filter(Boolean));
      const weakAreas = [...new Set(subjectMetrics.flatMap(m => m.weakAreas || []))];
      const strongAreas = [...new Set(subjectMetrics.flatMap(m => m.strongAreas || []))];
      
      return {
        subject,
        totalTime,
        questionsAttempted,
        questionsCorrect,
        accuracy,
        averageSpeed: subjectMetrics.reduce((sum, m) => sum + (m.speed || 0), 0) / subjectMetrics.length,
        topicsCompleted: uniqueTopics.size,
        totalTopics: 50, // This would come from syllabus data
        completionPercentage: (uniqueTopics.size / 50) * 100,
        lastStudied: subjectMetrics[subjectMetrics.length - 1]?.date || '',
        weakAreas: weakAreas.slice(0, 5),
        strongAreas: strongAreas.slice(0, 5),
        trend: this.calculateTrend(subjectMetrics) as 'improving' | 'declining' | 'stable'
      };
    });
  }

  private calculateTrend(metrics: PerformanceMetric[]): string {
    if (metrics.length < 3) return 'stable';
    
    const recent = metrics.slice(-3);
    const accuracies = recent.map(m => m.accuracy || 0);
    
    const trend = accuracies[2] - accuracies[0];
    if (trend > 5) return 'improving';
    if (trend < -5) return 'declining';
    return 'stable';
  }

  private generateInsights(metrics: PerformanceMetric[], subjectProgress: SubjectProgress[]): any[] {
    const insights = [];

    // Early return if no metrics
    if (!metrics || metrics.length === 0) {
      console.log('generateInsights: No metrics provided, returning empty insights');
      return insights;
    }

    try {
      // Calculate comprehensive metrics for analysis
      const overallAccuracy = metrics.reduce((sum, m) => sum + (m.accuracy || 0), 0) / metrics.length;
      const totalStudyTime = metrics.reduce((sum, m) => sum + m.timeSpent, 0);
      const answerWritingSessions = metrics.filter(m => m.type === 'answer_writing');
      const mockTestSessions = metrics.filter(m => m.type === 'mock_test');
      const practiceMetrics = metrics.filter(m => m.type === 'practice');
      const practiceAccuracy = practiceMetrics.length > 0 ? practiceMetrics.reduce((sum, m) => sum + (m.accuracy || 0), 0) / practiceMetrics.length : 0;

    // UPSC-Specific Answer Writing Analysis
    if (answerWritingSessions.length > 0) {
      const avgAnswerWritingTime = answerWritingSessions.reduce((sum, m) => sum + m.timeSpent, 0) / answerWritingSessions.length;
      const answerWritingAccuracy = answerWritingSessions.reduce((sum, m) => sum + (m.accuracy || 0), 0) / answerWritingSessions.length;

      if (avgAnswerWritingTime < 45) {
        insights.push({
          type: 'coaching',
          category: 'answer_writing',
          message: 'Your answer writing sessions are too short for effective UPSC Mains preparation.',
          detailedAnalysis: `Average answer writing time: ${avgAnswerWritingTime} minutes. For UPSC Mains, you need sustained practice sessions of 60-90 minutes to simulate exam conditions. Short sessions don't allow for proper question analysis, structure planning, and comprehensive writing.`,
          coachingAdvice: `As your UPSC coach, I recommend: 1) Each answer writing session should be minimum 60 minutes, 2) Practice writing 2-3 answers in one sitting, 3) Focus on question interpretation for first 5 minutes, 4) Allocate 15-20 minutes per answer for 10-mark questions, 5) Reserve last 5 minutes for review and improvement.`,
          actionSteps: [
            'Schedule 90-minute answer writing blocks',
            'Practice previous year questions in timed conditions',
            'Develop a standard answer structure (Introduction-Body-Conclusion)',
            'Focus on keyword integration and examples',
            'Get your answers evaluated by mentors or peers'
          ],
          priority: 'high',
          actionable: true,
          upscSpecific: true,
          examRelevance: 'mains'
        });
      }

      if (answerWritingAccuracy < 65) {
        insights.push({
          type: 'coaching',
          category: 'answer_writing',
          message: 'Your answer writing quality needs significant improvement for UPSC Mains success.',
          detailedAnalysis: `Current answer writing accuracy: ${answerWritingAccuracy.toFixed(1)}%. UPSC Mains requires precision, structure, and comprehensive coverage. Low accuracy indicates issues with content organization, keyword usage, or understanding of question demands.`,
          coachingAdvice: `Key areas to focus on: 1) Question Analysis - Spend 2-3 minutes understanding what exactly is being asked, 2) Structure - Use clear introduction, 2-3 body paragraphs with subheadings, and conclusion, 3) Content - Include relevant examples, case studies, and current affairs, 4) Language - Use simple, clear language with appropriate terminology, 5) Presentation - Maintain neat handwriting and proper spacing.`,
          actionSteps: [
            'Practice question analysis techniques',
            'Create answer templates for different question types',
            'Build a repository of examples and case studies',
            'Focus on keyword-based writing',
            'Regular self-evaluation using UPSC marking criteria'
          ],
          priority: 'high',
          actionable: true,
          upscSpecific: true,
          examRelevance: 'mains'
        });
      }
    }

    // Mock Test Performance Analysis
    if (mockTestSessions.length > 0) {
      const mockTestAccuracy = mockTestSessions.reduce((sum, m) => sum + (m.accuracy || 0), 0) / mockTestSessions.length;
      const avgMockTestTime = mockTestSessions.reduce((sum, m) => sum + m.timeSpent, 0) / mockTestSessions.length;

      if (mockTestAccuracy < 55) {
        insights.push({
          type: 'strategy',
          category: 'mock_tests',
          message: 'Mock test performance indicates need for strategic improvement in exam approach.',
          detailedAnalysis: `Mock test accuracy: ${mockTestAccuracy.toFixed(1)}%. This suggests either knowledge gaps or poor exam strategy. UPSC Prelims requires 33% to qualify, but competitive scores need 55-60%+ accuracy.`,
          coachingAdvice: `Strategic approach needed: 1) Attempt questions you're confident about first, 2) Use elimination technique for uncertain answers, 3) Don't spend more than 1.2 minutes per question, 4) Mark difficult questions for later review, 5) Focus on high-weightage topics like Polity, Geography, and Current Affairs.`,
          actionSteps: [
            'Analyze mock test performance topic-wise',
            'Identify and strengthen weak areas',
            'Practice time management with sectional tests',
            'Develop question selection strategy',
            'Regular revision of high-yield topics'
          ],
          priority: 'high',
          actionable: true,
          upscSpecific: true,
          examRelevance: 'prelims'
        });
      }
    }

    // Subject-wise Detailed Analysis
    if (subjectProgress.length > 0) {
      const weakestSubject = subjectProgress.reduce((min, subject) =>
        subject.accuracy < min.accuracy ? subject : min
      );

      if (weakestSubject && weakestSubject.accuracy < 50) {
      const subjectSpecificAdvice = this.getSubjectSpecificCoaching(weakestSubject.subject, weakestSubject.accuracy);
      insights.push({
        type: 'coaching',
        category: 'content_knowledge',
        message: `${weakestSubject.subject} requires immediate and focused attention for UPSC success.`,
        detailedAnalysis: `${weakestSubject.subject} accuracy: ${weakestSubject.accuracy.toFixed(1)}%. This subject is critical for UPSC and needs systematic improvement. ${subjectSpecificAdvice.analysis}`,
        coachingAdvice: subjectSpecificAdvice.coaching,
        actionSteps: subjectSpecificAdvice.actionSteps,
        priority: 'high',
        actionable: true,
        upscSpecific: true,
        examRelevance: 'all'
      });
      }
    }

    // Time Management Analysis
    const avgSessionTime = totalStudyTime / metrics.length;
    if (avgSessionTime < 90) {
      insights.push({
        type: 'coaching',
        category: 'study_habits',
        message: 'Study session duration is insufficient for deep UPSC preparation.',
        detailedAnalysis: `Average study session: ${avgSessionTime.toFixed(0)} minutes. UPSC requires deep, focused study sessions. Short sessions lead to superficial learning and poor retention.`,
        coachingAdvice: `Optimal study sessions for UPSC: 1) 2-3 hour focused blocks with 10-minute breaks every hour, 2) Deep reading and note-making, 3) Active recall and self-testing, 4) Integration of current affairs with static topics.`,
        actionSteps: [
          'Plan 2-3 hour study blocks',
          'Use Pomodoro technique (50 min study + 10 min break)',
          'Focus on one subject per session',
          'Include active recall in every session',
          'End each session with quick revision'
        ],
        priority: 'medium',
        actionable: true,
        upscSpecific: true,
        examRelevance: 'all'
      });
    }

    // Consistency Analysis
    const recentDays = 7;
    const recentMetrics = metrics.filter(m => {
      const metricDate = new Date(m.date);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - recentDays);
      return metricDate >= cutoff;
    });

    if (recentMetrics.length < 5) {
      insights.push({
        type: 'coaching',
        category: 'study_habits',
        message: 'Study consistency is crucial for UPSC success - current pattern is insufficient.',
        detailedAnalysis: `Study days in last week: ${recentMetrics.length}/7. UPSC requires consistent daily preparation over 12-18 months. Irregular study patterns lead to knowledge gaps and poor retention.`,
        coachingAdvice: `Consistency strategy: 1) Study minimum 6 days a week, 2) Maintain same study hours daily, 3) Create a realistic timetable and stick to it, 4) Use Sunday for weekly revision and planning, 5) Track daily progress to maintain motivation.`,
        actionSteps: [
          'Create a weekly study timetable',
          'Set minimum daily study hours (4-6 hours)',
          'Use habit tracking apps or journals',
          'Plan weekly revision sessions',
          'Reward yourself for maintaining consistency'
        ],
        priority: 'high',
        actionable: true,
        upscSpecific: true,
        examRelevance: 'all'
      });
    }

    // Positive Reinforcement for Good Performance
    if (overallAccuracy > 75) {
      insights.push({
        type: 'strength',
        category: 'exam_strategy',
        message: 'Excellent accuracy indicates strong conceptual understanding.',
        detailedAnalysis: `Overall accuracy: ${overallAccuracy.toFixed(1)}%. This is excellent for UPSC standards and shows good preparation quality.`,
        coachingAdvice: `Maintain this momentum: 1) Continue current study methods, 2) Focus on speed improvement, 3) Attempt more challenging questions, 4) Help others to reinforce your learning.`,
        actionSteps: [
          'Maintain current study routine',
          'Practice advanced level questions',
          'Focus on time management',
          'Start teaching/mentoring others',
          'Prepare for interview stage'
        ],
        priority: 'low',
        actionable: true,
        upscSpecific: true,
        examRelevance: 'all'
      });
    }

    return insights;
    } catch (error) {
      console.error('Error in generateInsights:', error);
      console.log('Metrics length:', metrics?.length || 0);
      console.log('SubjectProgress length:', subjectProgress?.length || 0);
      return [];
    }
  }

  private getSubjectSpecificCoaching(subject: string, accuracy: number): { analysis: string; coaching: string; actionSteps: string[] } {
    const subjectAdvice: { [key: string]: { analysis: string; coaching: string; actionSteps: string[] } } = {
      'History': {
        analysis: 'History requires chronological understanding, cause-effect relationships, and factual accuracy. Low scores indicate gaps in timeline understanding or insufficient practice.',
        coaching: 'History strategy: 1) Create chronological charts for each period, 2) Focus on cause-effect relationships, 3) Connect historical events with current affairs, 4) Use mnemonics for dates and facts, 5) Practice map-based questions regularly.',
        actionSteps: ['Create period-wise timeline charts', 'Practice previous year questions', 'Read NCERT 6-12 thoroughly', 'Make factual notes with dates', 'Connect history with geography and culture']
      },
      'Geography': {
        analysis: 'Geography demands map skills, conceptual clarity, and current affairs integration. Poor performance suggests weak map knowledge or insufficient diagram practice.',
        coaching: 'Geography mastery: 1) Daily map practice is non-negotiable, 2) Understand concepts through diagrams, 3) Link physical and human geography, 4) Integrate current affairs (disasters, projects), 5) Practice map-based questions daily.',
        actionSteps: ['Daily 30-minute map practice', 'Create concept diagrams', 'Read Geography NCERTs with atlas', 'Practice map marking', 'Link current affairs with geographical concepts']
      },
      'Polity': {
        analysis: 'Polity requires constitutional understanding, current developments awareness, and analytical thinking. Low scores indicate insufficient current affairs integration or weak constitutional knowledge.',
        coaching: 'Polity excellence: 1) Read Constitution articles directly, 2) Follow Supreme Court judgments, 3) Understand federal structure clearly, 4) Connect theory with current political developments, 5) Practice case study questions.',
        actionSteps: ['Read Laxmikanth thoroughly', 'Follow constitutional amendments', 'Analyze recent SC judgments', 'Practice current affairs integration', 'Understand federal relations']
      },
      'Economics': {
        analysis: 'Economics needs conceptual clarity, data interpretation skills, and policy understanding. Poor performance indicates weak fundamentals or insufficient current economic affairs.',
        coaching: 'Economics strategy: 1) Strengthen microeconomics basics, 2) Understand economic indicators clearly, 3) Follow budget and economic survey, 4) Practice data interpretation, 5) Connect theory with current policies.',
        actionSteps: ['Master basic economic concepts', 'Read Economic Survey annually', 'Practice graph interpretation', 'Follow RBI and budget updates', 'Understand government schemes']
      },
      'Environment': {
        analysis: 'Environment requires scientific understanding, current affairs integration, and policy awareness. Low scores suggest insufficient current affairs or weak scientific concepts.',
        coaching: 'Environment mastery: 1) Understand ecological concepts clearly, 2) Follow environmental current affairs daily, 3) Know international conventions, 4) Understand climate change science, 5) Practice diagram-based questions.',
        actionSteps: ['Read environment current affairs daily', 'Understand climate science', 'Know international environmental agreements', 'Practice ecology diagrams', 'Follow environmental policies']
      },
      'Science & Technology': {
        analysis: 'Science & Technology demands current awareness, basic scientific understanding, and application knowledge. Poor performance indicates insufficient current affairs or weak scientific foundation.',
        coaching: 'Science & Tech strategy: 1) Follow science current affairs daily, 2) Understand basic scientific principles, 3) Know space and defense developments, 4) Understand emerging technologies, 5) Connect science with society.',
        actionSteps: ['Daily science current affairs', 'Understand basic scientific concepts', 'Follow ISRO and DRDO developments', 'Know emerging technologies', 'Practice application-based questions']
      }
    };

    return subjectAdvice[subject] || {
      analysis: 'This subject requires focused attention and systematic preparation.',
      coaching: 'Follow standard preparation strategy with emphasis on current affairs integration.',
      actionSteps: ['Read standard books', 'Practice previous year questions', 'Follow current affairs', 'Make comprehensive notes', 'Regular revision']
    };
  }

  private calculateWeeklyTrends(metrics: PerformanceMetric[]): any[] {
    // Implementation for weekly trends calculation
    return [];
  }

  private calculateMonthlyProgress(metrics: PerformanceMetric[]): any[] {
    // Implementation for monthly progress calculation
    return [];
  }

  private getStudyDaysInPeriod(metrics: PerformanceMetric[], period: 'week' | 'month'): number {
    const now = new Date();
    const cutoff = new Date();
    
    if (period === 'week') {
      cutoff.setDate(now.getDate() - 7);
    } else {
      cutoff.setMonth(now.getMonth() - 1);
    }
    
    const uniqueDates = new Set(
      metrics
        .filter(m => new Date(m.date) >= cutoff)
        .map(m => m.date)
    );
    
    return uniqueDates.size;
  }

  private calculateConsistencyScore(metrics: PerformanceMetric[]): number {
    // Calculate consistency based on study frequency and regularity
    const last30Days = metrics.filter(m => {
      const metricDate = new Date(m.date);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      return metricDate >= cutoff;
    });
    
    const uniqueDays = new Set(last30Days.map(m => m.date)).size;
    return Math.min(10, (uniqueDays / 30) * 10);
  }

  private calculateDailyAverages(metrics: PerformanceMetric[]): any {
    const last30Days = metrics.filter(m => {
      const metricDate = new Date(m.date);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      return metricDate >= cutoff;
    });
    
    if (last30Days.length === 0) {
      return { studyTime: 0, accuracy: 0, questionsAttempted: 0 };
    }
    
    const uniqueDays = new Set(last30Days.map(m => m.date)).size;
    
    return {
      studyTime: last30Days.reduce((sum, m) => sum + m.timeSpent, 0) / uniqueDays,
      accuracy: last30Days.reduce((sum, m) => sum + (m.accuracy || 0), 0) / last30Days.length,
      questionsAttempted: last30Days.reduce((sum, m) => sum + (m.questionsAttempted || 0), 0) / uniqueDays
    };
  }

  // Public API methods
  getAnalytics(): PerformanceAnalytics {
    try {
      const cached = localStorage.getItem(this.analyticsKey);
      if (cached) {
        const analytics = JSON.parse(cached);
        // Check if cache is recent (within 1 hour)
        const lastUpdated = new Date(analytics.lastUpdated);
        const now = new Date();
        if (now.getTime() - lastUpdated.getTime() < 3600000) {
          return analytics;
        }
      }
      
      // Recalculate if cache is stale or missing
      const result = this.calculateAnalytics();
      console.log('Analytics calculated successfully');
      return result;
    } catch (error) {
      console.error('Error getting analytics:', error);
      console.error('Stack trace:', error.stack);
      // Return a safe default instead of calling calculateAnalytics again
      return {
        totalStudyTime: 0,
        averageAccuracy: 0,
        questionsAttempted: 0,
        questionsCorrect: 0,
        studyStreak: { currentStreak: 0, longestStreak: 0, lastStudyDate: '', streakStartDate: '' },
        subjectProgress: [],
        insights: [],
        trends: { studyTime: 0, accuracy: 0, questionsAttempted: 0 },
        weeklyGoalProgress: 0,
        monthlyGoalProgress: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  refreshAnalytics(): PerformanceAnalytics {
    const analytics = this.calculateAnalytics();
    this.notifyListeners(analytics);
    return analytics;
  }

  // Query methods
  getMetricsForDateRange(startDate: string, endDate: string): PerformanceMetric[] {
    return this.getAllMetrics().filter(metric => {
      const metricDate = metric.date;
      return metricDate >= startDate && metricDate <= endDate;
    });
  }

  getMetricsBySubject(subject: string): PerformanceMetric[] {
    return this.getAllMetrics().filter(metric => metric.subject === subject);
  }

  getRecentMetrics(limit: number = 10): PerformanceMetric[] {
    return this.getAllMetrics()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // Data management
  exportData(): string {
    return JSON.stringify({
      metrics: this.getAllMetrics(),
      analytics: this.getAnalytics()
    }, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.metrics && Array.isArray(data.metrics)) {
        const validatedMetrics = data.metrics.map(metric => this.validateMetric(metric)).filter(Boolean) as PerformanceMetric[];
        this.saveMetrics(validatedMetrics);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  clearAllData(): void {
    this.saveMetrics([]);
  }
}

export default PerformanceService;
