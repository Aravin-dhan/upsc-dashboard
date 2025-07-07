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
            analytics: {
              ...i.analytics,
              accessCount: (i.analytics?.accessCount || 0) + 1,
              lastAccessed: new Date().toISOString()
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

  const getDefaultItems = (): LearningItem[] => [
    {
      id: '1',
      name: 'History Notes',
      type: 'folder',
      parentId: 'root',
      tags: ['history', 'ancient', 'medieval', 'modern'],
      createdAt: '2025-01-10T10:00:00Z',
      lastModified: '2025-01-10T10:00:00Z',
      isFavorite: true,
      isShared: false
    },
    {
      id: '2',
      name: 'Mauryan Empire',
      type: 'note',
      parentId: '1',
      content: '# Mauryan Empire\n\n## Introduction\nThe Mauryan Empire was the first pan-Indian empire...',
      tags: ['mauryan', 'ancient-history', 'chandragupta'],
      createdAt: '2025-01-10T10:30:00Z',
      lastModified: '2025-01-10T11:00:00Z',
      isFavorite: false,
      isShared: false,
      size: 1024
    },
    {
      id: '3',
      name: 'Indian Constitution Mindmap',
      type: 'mindmap',
      parentId: 'root',
      content: '{"nodes": [{"id": "1", "text": "Indian Constitution", "x": 400, "y": 300}]}',
      tags: ['constitution', 'polity', 'mindmap'],
      createdAt: '2025-01-09T15:00:00Z',
      lastModified: '2025-01-09T16:30:00Z',
      isFavorite: true,
      isShared: true,
      size: 2048,
      collaborators: ['user1', 'user2']
    },
    {
      id: '4',
      name: 'Geography',
      type: 'folder',
      parentId: 'root',
      tags: ['geography', 'physical', 'human'],
      createdAt: '2025-01-08T09:00:00Z',
      lastModified: '2025-01-08T09:00:00Z',
      isFavorite: false,
      isShared: false
    }
  ];

  // Advanced fuzzy search function
  const fuzzySearch = (text: string, query: string): number => {
    if (!query) return 1;

    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();

    // Exact match gets highest score
    if (textLower.includes(queryLower)) {
      return textLower === queryLower ? 1 : 0.8;
    }

    // Fuzzy matching - calculate similarity
    let score = 0;
    let queryIndex = 0;

    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        score += 1;
        queryIndex++;
      }
    }

    return queryIndex === queryLower.length ? score / queryLower.length * 0.6 : 0;
  };

  // Enhanced filtering logic with fuzzy search and relevance scoring
  const filteredItems = items.filter(item => {
    const matchesFolder = item.parentId === currentFolder;

    // Advanced search with fuzzy matching and relevance scoring
    let searchScore = 0;
    if (searchTerm) {
      const nameScore = fuzzySearch(item.name, searchTerm) * 3; // Name matches are most important
      const tagScore = Math.max(...item.tags.map(tag => fuzzySearch(tag, searchTerm))) * 2;
      const contentScore = item.content ? fuzzySearch(item.content, searchTerm) * 1 : 0;
      const subjectScore = item.subject ? fuzzySearch(item.subject, searchTerm) * 1.5 : 0;

      searchScore = Math.max(nameScore, tagScore, contentScore, subjectScore);

      // Also check for acronym matches (e.g., "IAS" matches "Indian Administrative Service")
      const words = item.name.split(' ');
      const acronym = words.map(word => word[0]).join('').toLowerCase();
      if (acronym.includes(searchTerm.toLowerCase())) {
        searchScore = Math.max(searchScore, 0.7);
      }
    }

    const matchesSearch = !searchTerm || searchScore > 0.3;

    const matchesTypeFilter = selectedFilter === 'all' ||
                             (selectedFilter === 'favorites' && item.isFavorite) ||
                             (selectedFilter === 'shared' && item.isShared) ||
                             item.type === selectedFilter;

    const matchesSubjectFilter = selectedSubject === 'all' || item.subject === selectedSubject;

    const matchesDifficultyFilter = difficultyFilter === 'all' || item.difficulty === difficultyFilter;

    const matchesCompletionFilter = completionFilter === 'all' ||
                                   item.completionStatus === completionFilter ||
                                   (completionFilter === 'not_started' && !item.completionStatus);

    // Store search score for sorting
    (item as any).searchScore = searchScore;

    return matchesFolder && matchesSearch && matchesTypeFilter &&
           matchesSubjectFilter && matchesDifficultyFilter && matchesCompletionFilter;
  }).sort((a, b) => {
    // Sort by search relevance if searching, otherwise by name
    if (searchTerm) {
      return ((b as any).searchScore || 0) - ((a as any).searchScore || 0);
    }
    return a.name.localeCompare(b.name);
  });

  // Keyboard navigation
  useListKeyboardNavigation(
    filteredItems,
    0,
    () => {},
    (item) => {
      if (item.type === 'folder') {
        openFolder(item);
      } else {
        setEditingItem(item);
      }
    },
    () => {
      setShowCreateModal(false);
      setEditingItem(null);
    },
    true
  );

  // Modal keyboard navigation
  useModalKeyboardNavigation(
    !!(showCreateModal || editingItem),
    () => {
      setShowCreateModal(false);
      setEditingItem(null);
    },
    undefined,
    true
  );

  const openFolder = (folder: LearningItem) => {
    setCurrentFolder(folder.id);
    setFolderPath([...folderPath, folder.name]);
  };

  const navigateUp = () => {
    if (folderPath.length > 1) {
      const newPath = folderPath.slice(0, -1);
      setFolderPath(newPath);

      // Find parent folder
      const parentName = newPath[newPath.length - 1];
      if (parentName === 'Home') {
        setCurrentFolder('root');
      } else {
        const parentFolder = items.find(item => item.name === parentName && item.type === 'folder');
        if (parentFolder) {
          setCurrentFolder(parentFolder.id);
        }
      }
    }
  };

  const saveItems = (newItems: LearningItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-learning-items', JSON.stringify(newItems));
    }
  };

  // File upload functionality
  const handleFileUpload = async (files: FileList | File[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    const fileArray = Array.from(files);
    const newItems: LearningItem[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      setUploadProgress((i / fileArray.length) * 100);

      try {
        const content = await processFile(file);
        const fileType = getFileType(file.name, file.type);

        const newItem: LearningItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: fileType,
          parentId: currentFolder,
          content: content,
          tags: generateTags(file.name, content),
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          isFavorite: false,
          isShared: false,
          size: file.size
        };

        newItems.push(newItem);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (newItems.length > 0) {
      const updatedItems = [...items, ...newItems];
      setItems(updatedItems);
      saveItems(updatedItems);
      toast.success(`Successfully uploaded ${newItems.length} file(s)`);
    }

    setIsUploading(false);
    setUploadProgress(0);
  };

  // Enhanced file processing with multi-media support
  const processFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const result = e.target?.result;

        if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
          resolve(result as string);
        } else if (file.type === 'application/pdf') {
          // For PDF files, create a preview description
          resolve(`📄 PDF Document: ${file.name}\n\nSize: ${formatFileSize(file.size)}\nPages: Estimated ${Math.ceil(file.size / 50000)}\nUploaded: ${new Date().toLocaleString()}\n\n[PDF content will be processed for text extraction]`);
        } else if (file.type.startsWith('image/')) {
          // For images, create a preview with metadata
          resolve(`🖼️ Image: ${file.name}\n\nType: ${file.type}\nSize: ${formatFileSize(file.size)}\nUploaded: ${new Date().toLocaleString()}\n\n[Image preview available in viewer]`);
        } else if (file.type.startsWith('video/')) {
          // For videos, create metadata description
          resolve(`🎥 Video: ${file.name}\n\nType: ${file.type}\nSize: ${formatFileSize(file.size)}\nEstimated Duration: ${Math.floor(file.size / (1024 * 1024))} minutes\nUploaded: ${new Date().toLocaleString()}\n\n[Video player available in viewer]`);
        } else if (file.type.startsWith('audio/')) {
          // For audio files, create metadata description
          resolve(`🎵 Audio: ${file.name}\n\nType: ${file.type}\nSize: ${formatFileSize(file.size)}\nEstimated Duration: ${Math.floor(file.size / (1024 * 128))} minutes\nUploaded: ${new Date().toLocaleString()}\n\n[Audio player available in viewer]`);
        } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
          // For Word documents, create preview
          resolve(`📝 Document: ${file.name}\n\nType: Microsoft Word\nSize: ${formatFileSize(file.size)}\nPages: Estimated ${Math.ceil(file.size / 25000)}\nUploaded: ${new Date().toLocaleString()}\n\n[Document content will be processed for text extraction]`);
        } else if (file.name.endsWith('.pptx') || file.name.endsWith('.ppt')) {
          // For PowerPoint files
          resolve(`📊 Presentation: ${file.name}\n\nType: Microsoft PowerPoint\nSize: ${formatFileSize(file.size)}\nSlides: Estimated ${Math.ceil(file.size / 100000)}\nUploaded: ${new Date().toLocaleString()}\n\n[Presentation viewer available]`);
        } else {
          // For other file types, create generic description
          resolve(`📎 File: ${file.name}\n\nType: ${file.type || 'Unknown'}\nSize: ${formatFileSize(file.size)}\nUploaded: ${new Date().toLocaleString()}\n\n[File available for download]`);
        }
      };

      reader.onerror = () => reject(reader.error);

      // For text files, read as text; for others, we don't need to read the content
      if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        reader.readAsText(file);
      } else {
        // For non-text files, we'll just trigger the onload with a placeholder
        setTimeout(() => {
          reader.onload?.({ target: { result: '' } } as any);
        }, 10);
      }
    });
  };

  const getFileType = (fileName: string, mimeType: string): LearningItem['type'] => {
    const extension = fileName.toLowerCase().split('.').pop();

    if (mimeType.startsWith('image/')) return 'note'; // Treat images as notes for now
    if (mimeType === 'application/pdf') return 'note';
    if (extension === 'docx' || extension === 'doc') return 'note';
    if (extension === 'md' || mimeType.startsWith('text/')) return 'note';
    if (extension === 'json' && fileName.includes('mindmap')) return 'mindmap';

    return 'note'; // Default to note
  };

  const generateTags = (fileName: string, content: string): string[] => {
    const tags: string[] = [];
    const extension = fileName.toLowerCase().split('.').pop();

    // Add file type tag
    if (extension) tags.push(extension);

    // Add content-based tags (simple keyword extraction)
    const keywords = ['constitution', 'geography', 'history', 'economy', 'polity', 'environment', 'science', 'technology'];
    const lowerContent = content.toLowerCase();
    const lowerFileName = fileName.toLowerCase();

    keywords.forEach(keyword => {
      if (lowerContent.includes(keyword) || lowerFileName.includes(keyword)) {
        tags.push(keyword);
      }
    });

    return tags;
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const createItem = (name: string, type: 'folder' | 'note' | 'mindmap' | 'quiz' | 'module', options?: {
    subject?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime?: number;
  }) => {
    const getDefaultContent = (type: string, name: string) => {
      switch (type) {
        case 'note':
          return `# ${name}\n\nStart writing your notes here...\n\n## Key Points\n- \n\n## Summary\n`;
        case 'mindmap':
          return JSON.stringify({
            title: name,
            nodes: [
              { id: "1", text: name, x: 400, y: 300, level: 0, children: [], color: "#3B82F6", shape: "circle", fontSize: 18, width: 120, height: 60, collapsed: false }
            ],
            connections: [],
            theme: "default"
          });
        case 'quiz':
          return JSON.stringify({
            title: name,
            questions: [
              {
                id: "1",
                question: "Sample question",
                options: ["Option A", "Option B", "Option C", "Option D"],
                correctAnswer: 0,
                explanation: "Explanation for the correct answer"
              }
            ],
            timeLimit: 30,
            passingScore: 70
          });
        case 'module':
          return JSON.stringify({
            title: name,
            description: "Module description",
            lessons: [],
            totalDuration: options?.estimatedTime || 60,
            difficulty: options?.difficulty || 'beginner',
            prerequisites: [],
            learningObjectives: []
          });
        default:
          return undefined;
      }
    };

    const newItem: LearningItem = {
      id: Date.now().toString(),
      name,
      type,
      parentId: currentFolder,
      content: getDefaultContent(type, name),
      tags: [],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isFavorite: false,
      isShared: false,
      size: type === 'folder' ? undefined : 100,
      // Enhanced properties
      subject: options?.subject || 'general',
      difficulty: options?.difficulty || 'beginner',
      estimatedTime: options?.estimatedTime || (type === 'quiz' ? 30 : type === 'module' ? 120 : 60),
      completionStatus: 'not_started',
      progress: 0,
      studyStreak: 0,
      prerequisites: [],
      learningObjectives: [],
      resources: [],
      analytics: {
        timeSpent: 0,
        accessCount: 0
      }
    };

    const newItems = [...items, newItem];
    setItems(newItems);
    saveData();
    setShowCreateModal(false);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`);
  };

  const updateItem = (id: string, updates: Partial<LearningItem>) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, ...updates, lastModified: new Date().toISOString() }
        : item
    ));
  };

  const deleteItem = (id: string) => {
    // Also delete all children if it's a folder
    const itemsToDelete = [id];
    const findChildren = (parentId: string) => {
      items.forEach(item => {
        if (item.parentId === parentId) {
          itemsToDelete.push(item.id);
          if (item.type === 'folder') {
            findChildren(item.id);
          }
        }
      });
    };

    const itemToDelete = items.find(item => item.id === id);
    if (itemToDelete?.type === 'folder') {
      findChildren(id);
    }

    setItems(items.filter(item => !itemsToDelete.includes(item.id)));
    toast.success('Item deleted successfully!');
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'folder': return <Folder className="h-5 w-5 text-blue-500" />;
      case 'note': return <FileText className="h-5 w-5 text-green-500" />;
      case 'mindmap': return <Brain className="h-5 w-5 text-purple-500" />;
      case 'quiz': return <BookOpen className="h-5 w-5 text-orange-500" />;
      case 'module': return <GraduationCap className="h-5 w-5 text-indigo-500" />;
      case 'video': return <FileText className="h-5 w-5 text-red-500" />;
      case 'audio': return <FileText className="h-5 w-5 text-pink-500" />;
      default: return <File className="h-5 w-5 text-gray-500" />;
    }
  };



  const toggleFavorite = (id: string) => {
    setItems(items.map(item =>
      item.id === id
        ? { ...item, isFavorite: !item.isFavorite, lastModified: new Date().toISOString() }
        : item
    ));
    const item = items.find(i => i.id === id);
    toast.success(item?.isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading learning center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learning Center</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Advanced learning platform with progress tracking, analytics, and personalized recommendations.
            </p>
          </div>

          {/* Quick Stats */}
          {analytics && (
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.floor(analytics.totalStudyTime / 60)}h {analytics.totalStudyTime % 60}m
                </div>
                <div className="text-xs text-gray-500">Study Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {analytics.completedItems}
                </div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {analytics.streakDays}
                </div>
                <div className="text-xs text-gray-500">Day Streak</div>
              </div>
            </div>
          )}
        </div>

        {/* Active Study Session */}
        {activeSession && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-green-800 dark:text-green-200">
                  Study session active
                </span>
                <span className="text-sm text-green-600 dark:text-green-400">
                  {items.find(i => i.id === activeSession.itemId)?.name}
                </span>
              </div>
              <button
                onClick={() => endStudySession(50)} // Default 50% progress
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                End Session
              </button>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              📚 Recommended for you
            </h3>
            <div className="space-y-2">
              {recommendations.slice(0, 3).map(rec => {
                const item = items.find(i => i.id === rec.itemId);
                return item ? (
                  <div key={rec.itemId} className="flex items-center justify-between text-sm">
                    <span className="text-yellow-700 dark:text-yellow-300">
                      {item.name} - {rec.reason}
                    </span>
                    <button
                      onClick={() => {
                        const item = items.find(i => i.id === rec.itemId);
                        if (item) setEditingItem(item);
                      }}
                      className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
                    >
                      Start →
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-xs text-blue-700 dark:text-blue-300 flex flex-wrap gap-4">
            <span>↑↓ Navigate items</span>
            <span>Enter Open/Edit</span>
            <span>Esc Close</span>
            <span>Ctrl+N New item</span>
            <span>Del Delete</span>
            <span>Space Start session</span>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setCurrentFolder('root');
                setFolderPath(['Home']);
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Home
            </button>
            {folderPath.slice(1).map((folder, index) => (
              <div key={index} className="flex items-center space-x-2">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">{folder}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </button>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.gif"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileUpload(e.target.files);
                }
              }}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-1" />
              Upload
            </label>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              New
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            >
              <option value="all">All Types</option>
              <option value="folder">Folders</option>
              <option value="note">Notes</option>
              <option value="mindmap">Mindmaps</option>
              <option value="quiz">Quizzes</option>
              <option value="module">Modules</option>
              <option value="favorites">Favorites</option>
              <option value="shared">Shared</option>
            </select>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            >
              <option value="all">All Subjects</option>
              <option value="history">History</option>
              <option value="geography">Geography</option>
              <option value="polity">Polity</option>
              <option value="economics">Economics</option>
              <option value="science">Science & Technology</option>
              <option value="environment">Environment</option>
              <option value="current-affairs">Current Affairs</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={completionFilter}
              onChange={(e) => setCompletionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
            >
              📊 Analytics
            </button>

            <button
              onClick={() => setShowProgressTracker(!showProgressTracker)}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              📈 Progress
            </button>

            <button
              onClick={() => setShowSaveFilterModal(true)}
              className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
            >
              💾 Save Filter
            </button>

            <button
              onClick={() => setBulkActions(!bulkActions)}
              className={`flex items-center px-3 py-2 rounded-md transition-colors text-sm ${
                bulkActions
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
              }`}
            >
              ✅ Bulk Actions
            </button>
          </div>
        </div>

        {/* Saved Filters */}
        {savedFilters.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Saved Filters</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">{savedFilters.length} saved</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {savedFilters.map((filter) => (
                <div key={filter.id} className="flex items-center bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-1">
                  <button
                    onClick={() => applySavedFilter(filter)}
                    className="text-sm text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 mr-2"
                  >
                    {filter.name}
                  </button>
                  <button
                    onClick={() => deleteSavedFilter(filter.id)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                Found {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for "{searchTerm}"
              </span>
              {filteredItems.length > 0 && (
                <span className="text-xs">
                  Sorted by relevance
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions Toolbar */}
      {bulkActions && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Bulk Actions Mode - {selectedItemsForBulk.length} item{selectedItemsForBulk.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => {
                  const allItemIds = filteredItems.map(item => item.id);
                  setSelectedItemsForBulk(
                    selectedItemsForBulk.length === allItemIds.length ? [] : allItemIds
                  );
                }}
                className="text-sm text-orange-700 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-200 underline"
              >
                {selectedItemsForBulk.length === filteredItems.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('favorite')}
                disabled={selectedItemsForBulk.length === 0}
                className="flex items-center px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Star className="h-4 w-4 mr-1" />
                Toggle Favorites
              </button>
              <button
                onClick={() => handleBulkAction('share')}
                disabled={selectedItemsForBulk.length === 0}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Users className="h-4 w-4 mr-1" />
                Toggle Share
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                disabled={selectedItemsForBulk.length === 0}
                className="flex items-center px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
              <button
                onClick={() => {
                  setBulkActions(false);
                  setSelectedItemsForBulk([]);
                }}
                className="flex items-center px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading files...</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Analytics Dashboard */}
      {showAnalytics && analytics && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Learning Analytics</h2>
            <button
              onClick={() => setShowAnalytics(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {(() => {
            const detailedAnalytics = getDetailedAnalytics();
            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Overview Stats */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Study Overview</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Study Time</span>
                      <span className="font-medium">{Math.floor(analytics.totalStudyTime / 60)}h {analytics.totalStudyTime % 60}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Items Completed</span>
                      <span className="font-medium">{analytics.completedItems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Average Score</span>
                      <span className="font-medium">{analytics.averageScore.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Current Streak</span>
                      <span className="font-medium">{analytics.streakDays} days</span>
                    </div>
                  </div>
                </div>

                {/* Learning Velocity */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Learning Velocity</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Items/Week</span>
                      <span className="font-medium">{detailedAnalytics.learningVelocity.itemsPerWeek}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Minutes/Day</span>
                      <span className="font-medium">{detailedAnalytics.learningVelocity.minutesPerDay.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Consistency</span>
                      <span className="font-medium">{detailedAnalytics.learningVelocity.consistency.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Weekly Goals */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Weekly Goals</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Items Completed</span>
                        <span className="font-medium">{analytics.weeklyGoals.achieved}/{analytics.weeklyGoals.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((analytics.weeklyGoals.achieved / analytics.weeklyGoals.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subject Performance */}
                <div className="lg:col-span-2 xl:col-span-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Subject Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {detailedAnalytics.subjectPerformance.map(subject => (
                      <div key={subject.subject} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white capitalize mb-2">{subject.subject}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Completion</span>
                            <span className="font-medium">{subject.completionRate.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Avg Score</span>
                            <span className="font-medium">{subject.averageScore.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Time Spent</span>
                            <span className="font-medium">{Math.floor(subject.totalTime / 60)}h {subject.totalTime % 60}m</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily Progress Chart */}
                <div className="lg:col-span-2 xl:col-span-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">7-Day Progress</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-end justify-between h-32 space-x-2">
                      {detailedAnalytics.dailyProgress.map((day, index) => (
                        <div key={day.date} className="flex-1 flex flex-col items-center">
                          <div className="flex-1 flex flex-col justify-end mb-2">
                            <div
                              className="bg-blue-500 rounded-t"
                              style={{ height: `${Math.max((day.studyTime / 120) * 100, 5)}%` }}
                              title={`${day.studyTime} minutes`}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Content Area */}
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${
          dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Drag Overlay */}
        {dragActive && (
          <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-blue-700 dark:text-blue-300">Drop files here to upload</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Supports PDF, Word, Text, Images, and more</p>
            </div>
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No items found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'This folder is empty'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Item
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`group relative p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer ${
                  selectedItemsForBulk.includes(item.id)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600'
                }`}
                onClick={(e) => {
                  if (bulkActions) {
                    e.preventDefault();
                    if (selectedItemsForBulk.includes(item.id)) {
                      setSelectedItemsForBulk(prev => prev.filter(id => id !== item.id));
                    } else {
                      setSelectedItemsForBulk(prev => [...prev, item.id]);
                    }
                  } else if (item.type === 'folder') {
                    openFolder(item);
                  } else {
                    setEditingItem(item);
                  }
                }}
              >
                {/* Bulk Selection Checkbox */}
                {bulkActions && (
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedItemsForBulk.includes(item.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) {
                          setSelectedItemsForBulk(prev => [...prev, item.id]);
                        } else {
                          setSelectedItemsForBulk(prev => prev.filter(id => id !== item.id));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getItemIcon(item.type)}
                    <span className="font-medium text-gray-900 dark:text-white truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Preview Button */}
                    {item.type !== 'folder' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openPreview(item);
                        }}
                        className="p-1 rounded text-gray-400 hover:text-blue-500"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      className={`p-1 rounded ${item.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                      title="Toggle Favorite"
                    >
                      <Star className={`h-4 w-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(item.id);
                      }}
                      className="p-1 rounded text-gray-400 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Enhanced metadata */}
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <div>Modified: {new Date(item.lastModified).toLocaleDateString()}</div>
                  {item.size && <div>Size: {formatFileSize(item.size)}</div>}
                  {item.subject && item.subject !== 'general' && (
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                      {item.subject}
                    </div>
                  )}
                  {item.difficulty && (
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-1 ${
                        item.difficulty === 'beginner' ? 'bg-green-500' :
                        item.difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></span>
                      {item.difficulty}
                    </div>
                  )}
                  {item.estimatedTime && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {item.estimatedTime}min
                    </div>
                  )}
                  {item.isShared && (
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      Shared
                    </div>
                  )}
                  {item.analytics?.accessCount && (
                    <div className="flex items-center">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      {item.analytics.accessCount} views
                    </div>
                  )}
                </div>

                {/* Progress bar for learning items */}
                {item.progress !== undefined && item.progress > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-green-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{item.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  if (item.type === 'folder') {
                    openFolder(item);
                  } else {
                    setEditingItem(item);
                  }
                }}
              >
                <div className="flex items-center space-x-3 flex-1">
                  {getItemIcon(item.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </span>
                      {item.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      {item.isShared && <Users className="h-4 w-4 text-blue-500" />}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Modified: {new Date(item.lastModified).toLocaleDateString()}
                      {item.size && ` • ${formatFileSize(item.size)}`}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className={`p-1 rounded ${item.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                  >
                    <Star className={`h-4 w-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(item.id);
                    }}
                    className="p-1 rounded text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Dashboard */}
      {showAnalytics && analytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Analytics</h2>
              <button
                onClick={() => setShowAnalytics(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.floor(analytics.totalStudyTime / 60)}h {analytics.totalStudyTime % 60}m
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Total Study Time</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {analytics.completedItems}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">Items Completed</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {analytics.averageScore.toFixed(1)}%
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">Average Score</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {analytics.streakDays}
                  </div>
                  <div className="text-sm text-orange-700 dark:text-orange-300">Day Streak</div>
                </div>
              </div>

              {/* Subject Progress */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject Progress</h3>
                <div className="space-y-3">
                  {Object.entries(analytics.subjectProgress).map(([subject, progress]) => (
                    <div key={subject} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {subject}
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                          {progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Goals */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Goals</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Items Completed This Week
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {analytics.weeklyGoals.achieved} / {analytics.weeklyGoals.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (analytics.weeklyGoals.achieved / analytics.weeklyGoals.target) * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Recent Study Sessions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Study Sessions</h3>
                <div className="space-y-2">
                  {studySessions.slice(-5).reverse().map((session) => {
                    const item = items.find(i => i.id === session.itemId);
                    return (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {item?.name || 'Unknown Item'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(session.startTime).toLocaleDateString()} • {session.duration} minutes
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {session.progress}% completed
                          </div>
                          {session.score && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Score: {session.score}%
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {studySessions.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No study sessions yet. Start studying to see your progress!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Tracker */}
      {showProgressTracker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Progress Tracker</h2>
              <button
                onClick={() => setShowProgressTracker(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Study Goals */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Study Goals</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Daily Study Time</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Target: {studyGoals.dailyMinutes} minutes</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {/* Calculate today's study time from sessions */}
                        {studySessions
                          .filter(s => s.startTime.startsWith(new Date().toISOString().split('T')[0]))
                          .reduce((total, s) => total + s.duration, 0)} min
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Weekly Items</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Target: {studyGoals.weeklyItems} items</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {analytics?.weeklyGoals.achieved || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Path Progress */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Learning Path Progress</h3>
                <div className="space-y-3">
                  {items
                    .filter(item => item.completionStatus && item.completionStatus !== 'not_started')
                    .slice(0, 10)
                    .map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getItemIcon(item.type)}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {item.subject} • {item.difficulty}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                item.completionStatus === 'completed' ? 'bg-green-600' :
                                item.completionStatus === 'in_progress' ? 'bg-blue-600' : 'bg-gray-400'
                              }`}
                              style={{ width: `${item.progress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                            {item.progress || 0}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateItemModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createItem}
          type={createType}
          setType={setCreateType}
        />
      )}

      {/* Editor Modal */}
      {editingItem && (
        <EditorModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(updates) => {
            updateItem(editingItem.id, updates);
            setEditingItem(null);
          }}
        />
      )}

      {/* Save Filter Modal */}
      {showSaveFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Save Current Filter</h3>
              <button
                onClick={() => setShowSaveFilterModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter Name
                </label>
                <input
                  type="text"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="Enter a name for this filter..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  autoFocus
                />
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium mb-2">Current Filter Settings:</p>
                <ul className="space-y-1">
                  <li>• Type: {selectedFilter === 'all' ? 'All Types' : selectedFilter}</li>
                  <li>• Subject: {selectedSubject === 'all' ? 'All Subjects' : selectedSubject}</li>
                  <li>• Difficulty: {difficultyFilter === 'all' ? 'All Levels' : difficultyFilter}</li>
                  <li>• Status: {completionFilter === 'all' ? 'All Status' : completionFilter}</li>
                  {searchTerm && <li>• Search: "{searchTerm}"</li>}
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSaveFilterModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveCurrentFilter}
                disabled={!filterName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Preview Modal */}
      {showPreview && previewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {previewItem.type === 'folder' ? '📁' :
                   previewItem.type === 'note' ? '📄' :
                   previewItem.type === 'mindmap' ? '🧠' :
                   previewItem.type === 'quiz' ? '❓' :
                   previewItem.type === 'module' ? '📚' : '📎'}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{previewItem.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {previewItem.subject} • {previewItem.difficulty} • {previewItem.estimatedTime}min
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {previewItem.type === 'note' ? (
                <div className="prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: previewItem.content?.replace(/\n/g, '<br>') || 'No content available' }} />
                </div>
              ) : previewItem.type === 'mindmap' ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🧠</div>
                  <p className="text-gray-600 dark:text-gray-400">Mindmap preview - Click "Edit" to view full mindmap</p>
                </div>
              ) : previewItem.type === 'quiz' ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">❓</div>
                  <p className="text-gray-600 dark:text-gray-400">Quiz preview - Click "Edit" to take the quiz</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📎</div>
                  <p className="text-gray-600 dark:text-gray-400">File preview not available</p>
                </div>
              )}

              {previewItem.tags.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {previewItem.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setEditingItem(previewItem);
                  setShowPreview(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Create Item Modal Component
function CreateItemModal({
  onClose,
  onCreate,
  type,
  setType
}: {
  onClose: () => void;
  onCreate: (name: string, type: 'folder' | 'note' | 'mindmap' | 'quiz' | 'module', options?: any) => void;
  type: 'folder' | 'note' | 'mindmap' | 'quiz' | 'module';
  setType: (type: 'folder' | 'note' | 'mindmap' | 'quiz' | 'module') => void;
}) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('general');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [estimatedTime, setEstimatedTime] = useState(60);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), type, {
        subject: subject !== 'general' ? subject : undefined,
        difficulty,
        estimatedTime
      });
      setName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Create New Item
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['folder', 'note', 'mindmap'] as const).map((itemType) => (
                  <button
                    key={itemType}
                    type="button"
                    onClick={() => setType(itemType)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      type === itemType
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      {itemType === 'folder' && <Folder className="h-5 w-5" />}
                      {itemType === 'note' && <FileText className="h-5 w-5" />}
                      {itemType === 'mindmap' && <Brain className="h-5 w-5" />}
                      <span className="text-xs capitalize">{itemType}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                {(['quiz', 'module'] as const).map((itemType) => (
                  <button
                    key={itemType}
                    type="button"
                    onClick={() => setType(itemType)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      type === itemType
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      {itemType === 'quiz' && <BookOpen className="h-5 w-5" />}
                      {itemType === 'module' && <GraduationCap className="h-5 w-5" />}
                      <span className="text-xs capitalize">{itemType}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`Enter ${type} name...`}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                autoFocus
              />
            </div>

            {/* Additional options for content items */}
            {type !== 'folder' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="general">General</option>
                      <option value="history">History</option>
                      <option value="geography">Geography</option>
                      <option value="polity">Polity</option>
                      <option value="economics">Economics</option>
                      <option value="environment">Environment</option>
                      <option value="current-affairs">Current Affairs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estimated Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 60)}
                    min="5"
                    max="480"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Editor Modal Component
function EditorModal({
  item,
  onClose,
  onSave
}: {
  item: LearningItem;
  onClose: () => void;
  onSave: (updates: Partial<LearningItem>) => void;
}) {
  const [content, setContent] = useState(item.content || '');
  const [name, setName] = useState(item.name);
  const [tags, setTags] = useState(item.tags.join(', '));
  const [isPreview, setIsPreview] = useState(false);

  const handleSave = () => {
    onSave({
      name,
      content,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      size: content.length
    });
    toast.success('Item saved successfully!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            {item.type === 'note' && <FileText className="h-5 w-5 text-green-500" />}
            {item.type === 'mindmap' && <Brain className="h-5 w-5 text-purple-500" />}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            {item.type === 'note' && (
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  isPreview
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {isPreview ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {isPreview ? 'Edit' : 'Preview'}
              </button>
            )}
            <button
              onClick={handleSave}
              className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>

          <div className="flex-1 p-4">
            {item.type === 'note' ? (
              isPreview ? (
                <div className="prose dark:prose-invert max-w-none h-full overflow-auto break-words">
                  <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your notes here..."
                  className="w-full h-full resize-none border-none focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-white font-mono text-sm"
                />
              )
            ) : item.type === 'mindmap' ? (
              <div className="h-full">
                <MindmapViewer
                  data={(() => {
                    try {
                      return JSON.parse(content || '{}');
                    } catch {
                      return undefined;
                    }
                  })()}
                  width={800}
                  height={500}
                  editable={true}
                  onSave={(data) => {
                    setContent(JSON.stringify(data, null, 2));
                  }}
                  onExport={(format) => {
                    if (process.env.NODE_ENV === 'development') {
                      console.log(`Exporting mindmap as ${format}`);
                    }
                  }}
                />

                {/* Raw JSON editor for advanced users */}
                <details className="mt-4">
                  <summary className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200">
                    Advanced: Edit Raw JSON Data
                  </summary>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-2 w-full h-32 p-2 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono dark:bg-gray-800 dark:text-white"
                    placeholder="Mindmap JSON data..."
                  />
                </details>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
