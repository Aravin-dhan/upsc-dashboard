'use client';

import { useState, useEffect } from 'react';
import {
  RefreshCw, Plus, Calendar, Clock, Target, CheckCircle,
  AlertCircle, Settings, Play, Pause, SkipForward,
  RotateCcw, BookOpen, Brain, TrendingUp, Filter, X, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RevisionItem {
  id: string;
  title: string;
  topic: string;
  subject: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  lastReviewed: string | null;
  nextReview: string;
  reviewCount: number;
  interval: number; // days
  easeFactor: number;
  isActive: boolean;
}

interface RevisionSettings {
  intervals: number[];
  dailyTarget: number;
  autoAdvance: boolean;
  showAnswers: boolean;
  shuffleOrder: boolean;
}

export default function RevisionPage() {
  const [revisionItems, setRevisionItems] = useState<RevisionItem[]>([]);
  const [revisionSettings, setRevisionSettings] = useState<RevisionSettings>({
    intervals: [1, 3, 7, 14, 30, 90],
    dailyTarget: 20,
    autoAdvance: false,
    showAnswers: false,
    shuffleOrder: true
  });
  const [currentItem, setCurrentItem] = useState<RevisionItem | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('due');
  const [showSettings, setShowSettings] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedItems = localStorage.getItem('upsc-revision-items');
      const savedSettings = localStorage.getItem('upsc-revision-settings');

      if (savedItems) {
        try {
          setRevisionItems(JSON.parse(savedItems));
        } catch (error) {
          console.error('Error loading revision items:', error);
          setRevisionItems(getDefaultItems());
        }
      } else {
        setRevisionItems(getDefaultItems());
      }

      if (savedSettings) {
        try {
          setRevisionSettings(JSON.parse(savedSettings));
        } catch (error) {
          console.error('Error loading revision settings:', error);
        }
      }

      setIsLoaded(true);
    }
  }, []);

  const getDefaultItems = (): RevisionItem[] => [
    {
      id: '1',
      title: 'Mauryan Administration System',
      topic: 'Ancient History',
      subject: 'History',
      content: 'The Mauryan Empire had a highly centralized administrative system with the king at the apex...',
      difficulty: 'medium',
      priority: 'high',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      lastReviewed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      nextReview: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      reviewCount: 3,
      interval: 7,
      easeFactor: 2.5,
      isActive: true
    },
    {
      id: '2',
      title: 'Indian Monsoon System',
      topic: 'Climate',
      subject: 'Geography',
      content: 'The Indian monsoon is a seasonal wind pattern that brings rainfall to the Indian subcontinent...',
      difficulty: 'easy',
      priority: 'medium',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastReviewed: null,
      nextReview: new Date().toISOString(),
      reviewCount: 0,
      interval: 1,
      easeFactor: 2.5,
      isActive: true
    },
    {
      id: '3',
      title: 'Fundamental Rights vs Directive Principles',
      topic: 'Constitutional Law',
      subject: 'Polity',
      content: 'Fundamental Rights are justiciable while Directive Principles are non-justiciable...',
      difficulty: 'hard',
      priority: 'high',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastReviewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      nextReview: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      reviewCount: 1,
      interval: 3,
      easeFactor: 2.5,
      isActive: true
    }
  ];

  const saveData = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-revision-items', JSON.stringify(revisionItems));
      localStorage.setItem('upsc-revision-settings', JSON.stringify(revisionSettings));
    }
  };

  const getDueItems = () => {
    const now = new Date();
    return revisionItems.filter(item =>
      item.isActive && new Date(item.nextReview) <= now
    ).sort((a, b) => {
      // Sort by priority first, then by due date
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime();
    });
  };

  const getUpcomingItems = () => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return revisionItems.filter(item =>
      item.isActive &&
      new Date(item.nextReview) > now &&
      new Date(item.nextReview) <= nextWeek
    ).sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime());
  };

  const getFilteredItems = () => {
    switch (selectedFilter) {
      case 'due':
        return getDueItems();
      case 'upcoming':
        return getUpcomingItems();
      case 'all':
        return revisionItems.filter(item => item.isActive);
      case 'completed':
        return revisionItems.filter(item => item.reviewCount > 0);
      default:
        return getDueItems();
    }
  };

  const startRevision = () => {
    const dueItems = getDueItems();
    if (dueItems.length === 0) {
      toast.error('No items due for revision!');
      return;
    }

    const items = revisionSettings.shuffleOrder
      ? [...dueItems].sort(() => Math.random() - 0.5)
      : dueItems;

    setCurrentItem(items[0]);
    setIsReviewing(true);
    setShowAnswer(false);
  };

  const calculateNextReview = (item: RevisionItem, quality: number) => {
    // SM-2 algorithm for spaced repetition
    let { interval, easeFactor, reviewCount } = item;

    if (quality >= 3) {
      if (reviewCount === 0) {
        interval = 1;
      } else if (reviewCount === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      reviewCount += 1;
    } else {
      reviewCount = 0;
      interval = 1;
    }

    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    return {
      interval,
      easeFactor,
      reviewCount,
      nextReview: nextReview.toISOString(),
      lastReviewed: new Date().toISOString()
    };
  };

  const reviewItem = (quality: number) => {
    if (!currentItem) return;

    const updates = calculateNextReview(currentItem, quality);
    const updatedItems = revisionItems.map(item =>
      item.id === currentItem.id
        ? { ...item, ...updates }
        : item
    );

    setRevisionItems(updatedItems);
    saveData();

    // Move to next item
    const dueItems = getDueItems();
    const currentIndex = dueItems.findIndex(item => item.id === currentItem.id);
    const nextIndex = currentIndex + 1;

    if (nextIndex < dueItems.length) {
      setCurrentItem(dueItems[nextIndex]);
      setShowAnswer(false);
    } else {
      setIsReviewing(false);
      setCurrentItem(null);
      toast.success('Revision session completed!');
    }
  };

  const addRevisionItem = (itemData: Omit<RevisionItem, 'id' | 'createdAt' | 'lastReviewed' | 'nextReview' | 'reviewCount' | 'interval' | 'easeFactor'>) => {
    const now = new Date();
    const newItem: RevisionItem = {
      ...itemData,
      id: Date.now().toString(),
      createdAt: now.toISOString(),
      lastReviewed: null,
      nextReview: now.toISOString(),
      reviewCount: 0,
      interval: 1,
      easeFactor: 2.5
    };

    const updatedItems = [...revisionItems, newItem];
    setRevisionItems(updatedItems);
    saveData();
    setShowAddForm(false);
    toast.success('Revision item added successfully!');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTimeUntilDue = (nextReview: string) => {
    const now = new Date();
    const due = new Date(nextReview);
    const diffInHours = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 0) return 'Overdue';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  // Show loading state until data is loaded
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading revision system...</p>
        </div>
      </div>
    );
  }

  const dueItems = getDueItems();
  const upcomingItems = getUpcomingItems();
  const filteredItems = getFilteredItems();

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Revision</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Automated spaced repetition system to ensure you never forget what you've learned.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </button>
            <button
              onClick={startRevision}
              disabled={dueItems.length === 0}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Revision ({dueItems.length})
            </button>
          </div>
        </div>
      </div>

      {/* Revision Session */}
      {isReviewing && currentItem && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentItem.difficulty)}`}>
                  {currentItem.difficulty.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(currentItem.priority)}`}>
                  {currentItem.priority.toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Review #{currentItem.reviewCount + 1}
              </span>
            </div>
            <button
              onClick={() => setIsReviewing(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {currentItem.title}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  {currentItem.subject}
                </span>
                <span>{currentItem.topic}</span>
              </div>
            </div>

            {showAnswer && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {currentItem.content}
                  </p>
                </div>
              </div>
            )}

            {showAnswer && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  How well did you remember this?
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { quality: 1, label: 'Again', color: 'bg-red-600 hover:bg-red-700', description: 'Complete blackout' },
                    { quality: 2, label: 'Hard', color: 'bg-orange-600 hover:bg-orange-700', description: 'Incorrect response' },
                    { quality: 3, label: 'Good', color: 'bg-yellow-600 hover:bg-yellow-700', description: 'Correct with effort' },
                    { quality: 4, label: 'Easy', color: 'bg-green-600 hover:bg-green-700', description: 'Perfect response' }
                  ].map(({ quality, label, color, description }) => (
                    <button
                      key={quality}
                      onClick={() => reviewItem(quality)}
                      className={`flex flex-col items-center p-4 rounded-lg text-white transition-colors ${color}`}
                    >
                      <span className="font-medium">{label}</span>
                      <span className="text-xs opacity-90 text-center">{description}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!showAnswer && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowAnswer(true)}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Show Answer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isReviewing && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Items List */}
          <div className="lg:col-span-3">
            {/* Filter Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {[
                  { key: 'due', label: `Due (${dueItems.length})`, icon: AlertCircle },
                  { key: 'upcoming', label: `Upcoming (${upcomingItems.length})`, icon: Calendar },
                  { key: 'all', label: `All (${revisionItems.filter(i => i.isActive).length})`, icon: BookOpen },
                  { key: 'completed', label: `Completed (${revisionItems.filter(i => i.reviewCount > 0).length})`, icon: CheckCircle }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFilter(key)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                      selectedFilter === key
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <Icon className="h-4 w-4 mr-2" />
                      {label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                          {item.subject}
                        </span>
                        <span>{item.topic}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(item.difficulty)}`}>
                          {item.difficulty}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {getTimeUntilDue(item.nextReview)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Reviews: {item.reviewCount}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                    {item.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Interval: {item.interval}d</span>
                    <span>Ease: {item.easeFactor.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {selectedFilter === 'due' ? 'No items due for revision' : 'No items found'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {selectedFilter === 'due'
                    ? 'Great job! Check back later or add new items to review.'
                    : 'Start by adding some revision items to build your knowledge base.'
                  }
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mx-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Revision Item
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Revision Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Due Today</span>
                  <span className="font-medium text-red-600">{dueItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">This Week</span>
                  <span className="font-medium text-yellow-600">{upcomingItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Items</span>
                  <span className="font-medium text-blue-600">{revisionItems.filter(i => i.isActive).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="font-medium text-green-600">{revisionItems.filter(i => i.reviewCount > 0).length}</span>
                </div>
              </div>
            </div>

            {/* Daily Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Daily Progress</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Target</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{revisionSettings.dailyTarget}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (revisionItems.filter(i =>
                        i.lastReviewed &&
                        new Date(i.lastReviewed).toDateString() === new Date().toDateString()
                      ).length / revisionSettings.dailyTarget) * 100)}%`
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {revisionItems.filter(i =>
                    i.lastReviewed &&
                    new Date(i.lastReviewed).toDateString() === new Date().toDateString()
                  ).length} / {revisionSettings.dailyTarget} completed today
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={startRevision}
                  disabled={dueItems.length === 0}
                  className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Revision
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add Revision Item</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const title = formData.get('title') as string;
              const content = formData.get('content') as string;
              const subject = formData.get('subject') as string;
              const topic = formData.get('topic') as string;
              const difficulty = formData.get('difficulty') as 'easy' | 'medium' | 'hard';
              const priority = formData.get('priority') as 'low' | 'medium' | 'high';

              if (!title || !content || !subject) {
                toast.error('Please fill in all required fields');
                return;
              }

              const newItem: RevisionItem = {
                id: Date.now().toString(),
                title,
                content,
                subject,
                topic: topic || 'General',
                difficulty,
                priority,
                interval: 1,
                easeFactor: 2.5,
                reviewCount: 0,
                nextReview: new Date().toISOString(),
                lastReviewed: null,
                isActive: true,
                createdAt: new Date().toISOString()
              };

              const updatedItems = [...revisionItems, newItem];
              setRevisionItems(updatedItems);
              saveData();
              setShowAddForm(false);
              toast.success('Revision item added successfully!');
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter the title of the concept"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content *
                </label>
                <textarea
                  name="content"
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter the detailed content to remember"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Subject</option>
                    <option value="History">History</option>
                    <option value="Geography">Geography</option>
                    <option value="Polity">Polity</option>
                    <option value="Economics">Economics</option>
                    <option value="Environment">Environment</option>
                    <option value="Science & Technology">Science & Technology</option>
                    <option value="Current Affairs">Current Affairs</option>
                    <option value="Ethics">Ethics</option>
                    <option value="General Studies">General Studies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Topic
                  </label>
                  <input
                    type="text"
                    name="topic"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Specific topic (optional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    defaultValue="medium"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    defaultValue="medium"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Revision Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Daily Target
                </label>
                <input
                  type="number"
                  value={revisionSettings.dailyTarget}
                  onChange={(e) => setRevisionSettings({
                    ...revisionSettings,
                    dailyTarget: parseInt(e.target.value) || 20
                  })}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Auto Advance
                </label>
                <button
                  onClick={() => setRevisionSettings({
                    ...revisionSettings,
                    autoAdvance: !revisionSettings.autoAdvance
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    revisionSettings.autoAdvance ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      revisionSettings.autoAdvance ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Show Answers
                </label>
                <button
                  onClick={() => setRevisionSettings({
                    ...revisionSettings,
                    showAnswers: !revisionSettings.showAnswers
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    revisionSettings.showAnswers ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      revisionSettings.showAnswers ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Shuffle Order
                </label>
                <button
                  onClick={() => setRevisionSettings({
                    ...revisionSettings,
                    shuffleOrder: !revisionSettings.shuffleOrder
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    revisionSettings.shuffleOrder ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      revisionSettings.shuffleOrder ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => {
                  saveData();
                  setShowSettings(false);
                  toast.success('Settings saved successfully!');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
