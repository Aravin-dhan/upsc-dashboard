'use client';

import { useState, useEffect } from 'react';
import {
  FolderOpen, FileText, Plus, Search, Filter, Grid, List,
  BookOpen, Brain, Edit, Trash2, Download, Upload, Share2,
  Folder, File, Map, Code, Eye, Save, X, ChevronRight,
  ChevronDown, Star, Clock, Tag, Users, Settings, GraduationCap,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useListKeyboardNavigation, useModalKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import MindmapViewer from '@/components/mindmap/MindmapViewer';

interface LearningItem {
  id: string;
  name: string;
  type: 'folder' | 'note' | 'mindmap' | 'document' | 'quiz' | 'video' | 'audio' | 'module';
  parentId?: string;
  content?: string;
  tags: string[];
  createdAt: string;
  lastModified: string;
  isFavorite: boolean;
  isShared: boolean;
  size?: number; // in bytes
  collaborators?: string[];
  // Enhanced properties
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  subject?: string;
  topic?: string;
  estimatedTime?: number; // in minutes
  completionStatus?: 'not_started' | 'in_progress' | 'completed';
  progress?: number; // 0-100
  lastAccessed?: string;
  studyStreak?: number;
  rating?: number; // 1-5 stars
  notes?: string;
  prerequisites?: string[];
  learningObjectives?: string[];
  resources?: Array<{
    type: 'link' | 'file' | 'video' | 'book';
    title: string;
    url?: string;
    description?: string;
  }>;
  analytics?: {
    timeSpent: number;
    accessCount: number;
    lastScore?: number;
    averageScore?: number;
    completionDate?: string;
  };
}

interface FolderStructure {
  [key: string]: LearningItem[];
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  lessons: LearningItem[];
  totalDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  learningPath: string[];
  completionCriteria: {
    minimumScore: number;
    requiredLessons: string[];
    timeRequirement?: number;
  };
}

interface StudySession {
  id: string;
  itemId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  progress: number;
  notes?: string;
  score?: number;
}

interface LearningAnalytics {
  totalStudyTime: number;
  completedItems: number;
  averageScore: number;
  streakDays: number;
  subjectProgress: Record<string, number>;
  weeklyGoals: {
    target: number;
    achieved: number;
  };
  recommendations: Array<{
    type: 'review' | 'new_topic' | 'practice';
    itemId: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export default function LearningPage() {
  const [items, setItems] = useState<LearningItem[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [folderPath, setFolderPath] = useState<string[]>(['Home']);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'modules'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'folder' | 'note' | 'mindmap' | 'quiz' | 'module'>('note');
  const [editingItem, setEditingItem] = useState<LearningItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Enhanced state
  const [currentModule, setCurrentModule] = useState<LearningModule | null>(null);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [analytics, setAnalytics] = useState<LearningAnalytics | null>(null);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [learningPath, setLearningPath] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<LearningAnalytics['recommendations']>([]);
  const [studyGoals, setStudyGoals] = useState({
    dailyMinutes: 120,
    weeklyItems: 5,
    monthlyModules: 2
  });
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [completionFilter, setCompletionFilter] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // Advanced features state
  const [previewItem, setPreviewItem] = useState<LearningItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [savedFilters, setSavedFilters] = useState<Array<{
    id: string;
    name: string;
    filters: {
      type: string;
      subject: string;
      difficulty: string;
      completion: string;
      search: string;
    };
  }>>([]);
  const [showSaveFilterModal, setShowSaveFilterModal] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [collaborators, setCollaborators] = useState<Array<{
    id: string;
    name: string;
    email: string;
    role: 'viewer' | 'editor' | 'admin';
    avatar?: string;
  }>>([]);
  const [bulkActions, setBulkActions] = useState(false);
  const [selectedItemsForBulk, setSelectedItemsForBulk] = useState<string[]>([]);

  // Utility function for file size formatting
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Load data on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upsc-learning-items');
      const savedSessions = localStorage.getItem('upsc-study-sessions');
      const savedAnalytics = localStorage.getItem('upsc-learning-analytics');

      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading learning items:', error);
          setItems(getDefaultItems());
        }
      } else {
        setItems(getDefaultItems());
      }

      if (savedSessions) {
        try {
          setStudySessions(JSON.parse(savedSessions));
        } catch (error) {
          console.error('Error loading study sessions:', error);
        }
      }

      if (savedAnalytics) {
        try {
          setAnalytics(JSON.parse(savedAnalytics));
        } catch (error) {
          console.error('Error loading analytics:', error);
          setAnalytics(getDefaultAnalytics());
        }
      } else {
        setAnalytics(getDefaultAnalytics());
      }

      // Load saved filters
      const savedFiltersData = localStorage.getItem('upsc-learning-saved-filters');
      if (savedFiltersData) {
        try {
          setSavedFilters(JSON.parse(savedFiltersData));
        } catch (error) {
          console.error('Error loading saved filters:', error);
        }
      }

      setIsLoaded(true);
    }
  }, []);

  // Generate recommendations based on user progress
  useEffect(() => {
    if (analytics && items.length > 0) {
      generateRecommendations();
    }
  }, [analytics, items]);

  // Save data to localStorage
  const saveData = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-learning-items', JSON.stringify(items));
      localStorage.setItem('upsc-study-sessions', JSON.stringify(studySessions));
      localStorage.setItem('upsc-learning-analytics', JSON.stringify(analytics));
    }
  };

  // Get default analytics
  const getDefaultAnalytics = (): LearningAnalytics => ({
    totalStudyTime: 0,
    completedItems: 0,
    averageScore: 0,
    streakDays: 0,
    subjectProgress: {},
    weeklyGoals: {
      target: studyGoals.weeklyItems,
      achieved: 0
    },
    recommendations: []
  });

  // Generate personalized recommendations
  const generateRecommendations = () => {
    if (!analytics) return;

    const newRecommendations: LearningAnalytics['recommendations'] = [];

    // Find items that need review (low scores or not accessed recently)
    items.forEach(item => {
      if (item.analytics?.lastScore && item.analytics.lastScore < 70) {
        newRecommendations.push({
          type: 'review',
          itemId: item.id,
          reason: `Low score (${item.analytics.lastScore}%) - needs review`,
          priority: 'high'
        });
      }

      if (item.lastAccessed) {
        const daysSinceAccess = Math.floor(
          (Date.now() - new Date(item.lastAccessed).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceAccess > 7 && item.completionStatus === 'in_progress') {
          newRecommendations.push({
            type: 'review',
            itemId: item.id,
            reason: `Not accessed for ${daysSinceAccess} days`,
            priority: 'medium'
          });
        }
      }
    });

    // Suggest new topics based on completed prerequisites
    items.forEach(item => {
      if (item.prerequisites && item.completionStatus === 'not_started') {
        const prerequisitesMet = item.prerequisites.every(prereqId =>
          items.find(i => i.id === prereqId)?.completionStatus === 'completed'
        );
        if (prerequisitesMet) {
          newRecommendations.push({
            type: 'new_topic',
            itemId: item.id,
            reason: 'Prerequisites completed - ready to start',
            priority: 'medium'
          });
        }
      }
    });

    setRecommendations(newRecommendations.slice(0, 5)); // Limit to 5 recommendations
  };

  // Start a study session
  const startStudySession = (itemId: string) => {
    const newSession: StudySession = {
      id: Date.now().toString(),
      itemId,
      startTime: new Date().toISOString(),
      duration: 0,
      progress: 0
    };

    setActiveSession(newSession);
    setStudySessions(prev => [...prev, newSession]);

    // Update item last accessed
    setItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, lastAccessed: new Date().toISOString() }
        : item
    ));

    toast.success('Study session started!');
  };

  // End a study session
  const endStudySession = (progress: number, score?: number, notes?: string) => {
    if (!activeSession) return;

    const endTime = new Date().toISOString();
    const duration = Math.floor(
      (new Date(endTime).getTime() - new Date(activeSession.startTime).getTime()) / 1000 / 60
    );

    const completedSession: StudySession = {
      ...activeSession,
      endTime,
      duration,
      progress,
      score,
      notes
    };

    // Update study sessions
    setStudySessions(prev =>
      prev.map(session =>
        session.id === activeSession.id ? completedSession : session
      )
    );

    // Update item progress and analytics
    setItems(prev => prev.map(item => {
      if (item.id === activeSession.itemId) {
        const newAnalytics = {
          ...item.analytics,
          timeSpent: (item.analytics?.timeSpent || 0) + duration,
          accessCount: (item.analytics?.accessCount || 0) + 1,
          lastScore: score,
          averageScore: score ?
            ((item.analytics?.averageScore || 0) + score) / 2 :
            item.analytics?.averageScore
        };

        return {
          ...item,
          progress: Math.max(item.progress || 0, progress),
          completionStatus: progress >= 100 ? 'completed' : 'in_progress',
          analytics: newAnalytics
        };
      }
      return item;
    }));

    // Update global analytics
    if (analytics) {
      setAnalytics(prev => prev ? {
        ...prev,
        totalStudyTime: prev.totalStudyTime + duration,
        completedItems: progress >= 100 ? prev.completedItems + 1 : prev.completedItems,
        averageScore: score ?
          ((prev.averageScore + score) / 2) :
          prev.averageScore
      } : null);
    }

    setActiveSession(null);
    toast.success(`Study session completed! ${duration} minutes studied.`);
  };

  // Advanced analytics calculations
  const getDetailedAnalytics = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyProgress = last7Days.map(date => {
      const dayStudyTime = studySessions
        .filter(session => session.startTime.split('T')[0] === date)
        .reduce((total, session) => total + session.duration, 0);

      const dayCompletions = items.filter(item =>
        item.completionStatus === 'completed' &&
        item.lastModified.split('T')[0] === date
      ).length;

      return {
        date,
        studyTime: dayStudyTime,
        completions: dayCompletions
      };
    });

    const subjectPerformance = Object.keys(analytics?.subjectProgress || {}).map(subject => {
      const subjectItems = items.filter(item => item.subject === subject);
      const completedSubjectItems = subjectItems.filter(item => item.completionStatus === 'completed');
      const subjectSessions = studySessions.filter(session => {
        const item = items.find(i => i.id === session.itemId);
        return item?.subject === subject;
      });

      const avgScore = subjectSessions
        .filter(session => session.score !== undefined)
        .reduce((sum, session, _, arr) => sum + (session.score || 0) / arr.length, 0);

      return {
        subject,
        totalItems: subjectItems.length,
        completedItems: completedSubjectItems.length,
        completionRate: subjectItems.length > 0 ? (completedSubjectItems.length / subjectItems.length) * 100 : 0,
        averageScore: avgScore || 0,
        totalTime: subjectSessions.reduce((total, session) => total + session.duration, 0)
      };
    });

    const learningVelocity = {
      itemsPerWeek: getWeeklyProgress(),
      minutesPerDay: (analytics?.totalStudyTime || 0) / 7,
      streakDays: analytics?.streakDays || 0,
      consistency: calculateConsistency()
    };

    return {
      dailyProgress,
      subjectPerformance,
      learningVelocity
    };
  };

  const calculateConsistency = (): number => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const activeDays = last30Days.filter(date =>
      studySessions.some(session => session.startTime.split('T')[0] === date)
    ).length;

    return (activeDays / 30) * 100;
  };

  const getWeeklyProgress = (): number => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return items.filter(item =>
      item.completionStatus === 'completed' &&
      new Date(item.analytics?.completionDate || item.lastModified) > oneWeekAgo
    ).length;
  };

  // Personalized learning path generation
  const generateLearningPath = (targetSubject?: string): string[] => {
    const availableItems = items.filter(item =>
      item.completionStatus === 'not_started' &&
      (!targetSubject || item.subject === targetSubject)
    );

    // Sort by prerequisites and difficulty
    const sortedItems = availableItems.sort((a, b) => {
      // Items with no prerequisites come first
      const aPrereqsMet = !a.prerequisites || a.prerequisites.every(prereqId =>
        items.find(i => i.id === prereqId)?.completionStatus === 'completed'
      );
      const bPrereqsMet = !b.prerequisites || b.prerequisites.every(prereqId =>
        items.find(i => i.id === prereqId)?.completionStatus === 'completed'
      );

      if (aPrereqsMet && !bPrereqsMet) return -1;
      if (!aPrereqsMet && bPrereqsMet) return 1;

      // Then sort by difficulty
      const difficultyOrder = { 'beginner': 0, 'intermediate': 1, 'advanced': 2 };
      return (difficultyOrder[a.difficulty || 'beginner'] || 0) - (difficultyOrder[b.difficulty || 'beginner'] || 0);
    });

    return sortedItems.slice(0, 10).map(item => item.id);
  };

  // Advanced filter management
  const saveCurrentFilter = () => {
    if (!filterName.trim()) {
      toast.error('Please enter a filter name');
      return;
    }

    const newFilter = {
      id: Date.now().toString(),
      name: filterName,
      filters: {
        type: selectedFilter,
        subject: selectedSubject,
        difficulty: difficultyFilter,
        completion: completionFilter,
        search: searchTerm
      }
    };

    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    localStorage.setItem('upsc-learning-saved-filters', JSON.stringify(updatedFilters));

    setFilterName('');
    setShowSaveFilterModal(false);
    toast.success(`Filter "${newFilter.name}" saved successfully!`);
  };

  const applySavedFilter = (filter: typeof savedFilters[0]) => {
    setSelectedFilter(filter.filters.type);
    setSelectedSubject(filter.filters.subject);
    setDifficultyFilter(filter.filters.difficulty);
    setCompletionFilter(filter.filters.completion);
    setSearchTerm(filter.filters.search);
    toast.success(`Applied filter: ${filter.name}`);
  };

  const deleteSavedFilter = (filterId: string) => {
    const updatedFilters = savedFilters.filter(f => f.id !== filterId);
    setSavedFilters(updatedFilters);
    localStorage.setItem('upsc-learning-saved-filters', JSON.stringify(updatedFilters));
    toast.success('Filter deleted');
  };

  // Content preview functionality
  const openPreview = (item: LearningItem) => {
    setPreviewItem(item);
    setShowPreview(true);

    // Update analytics
    const updatedItems = items.map(i =>
      i.id === item.id
        ? {
            ...i,
            lastAccessed: new Date().toISOString(),
            analytics: {
              timeSpent: i.analytics?.timeSpent || 0,
              accessCount: (i.analytics?.accessCount || 0) + 1,
              lastScore: i.analytics?.lastScore,
              averageScore: i.analytics?.averageScore,
              completionDate: i.analytics?.completionDate
            }
          }
        : i
    );
    setItems(updatedItems);
  };

  // Bulk actions functionality
  const handleBulkAction = (action: 'delete' | 'favorite' | 'share' | 'move') => {
    if (selectedItemsForBulk.length === 0) {
      toast.error('No items selected');
      return;
    }

    switch (action) {
      case 'delete':
        const updatedItems = items.filter(item => !selectedItemsForBulk.includes(item.id));
        setItems(updatedItems);
        toast.success(`Deleted ${selectedItemsForBulk.length} items`);
        break;
      case 'favorite':
        setItems(items.map(item =>
          selectedItemsForBulk.includes(item.id)
            ? { ...item, isFavorite: !item.isFavorite }
            : item
        ));
        toast.success(`Updated favorites for ${selectedItemsForBulk.length} items`);
        break;
      case 'share':
        setItems(items.map(item =>
          selectedItemsForBulk.includes(item.id)
            ? { ...item, isShared: !item.isShared }
            : item
        ));
        toast.success(`Updated sharing for ${selectedItemsForBulk.length} items`);
        break;
    }

    setSelectedItemsForBulk([]);
    setBulkActions(false);
  };

  useEffect(() => {
    if (isLoaded) {
      saveData();
    }
  }, [items, isLoaded]);

  const getDefaultItems = (): LearningItem[] => {
    // Production: Load user's learning materials from database
    // For now, return empty array to remove mock data
    return [];
  };

  // Initialize with empty data for production
  useEffect(() => {
    setItems(getDefaultItems());
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Learning Materials
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Your personalized study materials and notes will appear here.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-blue-800 dark:text-blue-200">
              Coming Soon: Upload and organize your study materials, create mind maps, and collaborate with other students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
