'use client';

import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Clock, RotateCcw, Plus, Search, Star, TrendingUp, Filter, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { prelimsSyllabus } from '@/data/comprehensiveUPSCSyllabus';
import { completeMains } from '@/data/mainsSyllabusNew';

interface SyllabusProgress {
  status: 'not_started' | 'in_progress' | 'first_reading_done' | 'revised_once' | 'mastered';
  progress: number;
  timeSpent: number;
  lastStudied?: string;
  notes?: string;
}

export default function SyllabusPage() {
  const [syllabusProgress, setSyllabusProgress] = useState<{ [key: string]: SyllabusProgress }>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExamType, setSelectedExamType] = useState<'prelims' | 'mains' | 'all'>('prelims');
  const [selectedWeightage, setSelectedWeightage] = useState('All');
  const [showSubTopics, setShowSubTopics] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const getCurrentSyllabus = () => {
    if (selectedExamType === 'prelims') return prelimsSyllabus;
    if (selectedExamType === 'mains') return completeMains;
    return [...prelimsSyllabus, ...completeMains];
  };

  const getDefaultProgress = (): { [key: string]: SyllabusProgress } => {
    const progress: { [key: string]: SyllabusProgress } = {};
    const currentSyllabus = getCurrentSyllabus();

    currentSyllabus.forEach(subject => {
      subject.papers.forEach(paper => {
        paper.sections.forEach(section => {
          section.items.forEach(item => {
            progress[item.id] = {
              status: 'not_started',
              progress: 0,
              timeSpent: 0,
              lastStudied: undefined,
              notes: ''
            };
          });
        });
      });
    });
    return progress;
  };

  const getSyllabusStats = (progress: { [key: string]: SyllabusProgress }) => {
    let totalItems = 0;
    let completedItems = 0;
    let totalTimeSpent = 0;
    let totalEstimatedHours = 0;

    prelimsSyllabus.forEach(subject => {
      subject.papers.forEach(paper => {
        paper.sections.forEach(section => {
          section.items.forEach(item => {
            totalItems++;
            totalEstimatedHours += item.estimatedHours;
            const itemProgress = progress[item.id];
            if (itemProgress) {
              if (itemProgress.status === 'mastered') completedItems++;
              totalTimeSpent += itemProgress.timeSpent;
            }
          });
        });
      });
    });

    return {
      totalItems,
      completedItems,
      totalTimeSpent,
      totalEstimatedHours,
      completionPercentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    };
  };

  // Load data on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upsc-syllabus-progress');
      if (saved) {
        try {
          setSyllabusProgress(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading syllabus progress:', error);
          setSyllabusProgress(getDefaultProgress());
        }
      } else {
        setSyllabusProgress(getDefaultProgress());
      }
      setIsLoaded(true);
    }
  }, []);

  const saveProgress = (newProgress: { [key: string]: SyllabusProgress }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-syllabus-progress', JSON.stringify(newProgress));
    }
  };

  const updateTopicStatus = (id: string, newStatus: SyllabusProgress['status']) => {
    const progressMap = {
      'not_started': 0,
      'in_progress': 25,
      'first_reading_done': 50,
      'revised_once': 75,
      'mastered': 100
    };

    const updatedProgress = {
      ...syllabusProgress,
      [id]: {
        ...syllabusProgress[id],
        status: newStatus,
        progress: progressMap[newStatus],
        lastUpdated: new Date().toISOString()
      }
    };

    setSyllabusProgress(updatedProgress);
    saveProgress(updatedProgress);

    // Find the topic name from the syllabus structure
    let topicName = 'Topic';
    prelimsSyllabus.forEach(subject => {
      subject.papers.forEach(paper => {
        paper.sections.forEach(section => {
          const item = section.items.find(item => item.id === id);
          if (item) topicName = item.title;
        });
      });
    });
    toast.success(`${topicName} status updated to ${newStatus.replace('_', ' ')}`);
  };

  const toggleTopicExpansion = (id: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedTopics(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
      case 'in_progress': return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'first_reading_done': return 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'revised_once': return 'bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'mastered': return 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not_started': return <Clock className="h-3 w-3" />;
      case 'in_progress': return <BookOpen className="h-3 w-3" />;
      case 'first_reading_done': return <CheckCircle className="h-3 w-3" />;
      case 'revised_once': return <RotateCcw className="h-3 w-3" />;
      case 'mastered': return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getWeightageIcon = (weightage: string) => {
    switch (weightage) {
      case 'high': return <Star className="h-3 w-3 text-red-500" />;
      case 'medium': return <Star className="h-3 w-3 text-yellow-500" />;
      case 'low': return <Star className="h-3 w-3 text-gray-400" />;
      default: return null;
    }
  };

  // Flatten the syllabus structure for easier filtering
  const flattenedSyllabus = getCurrentSyllabus().flatMap(subject =>
    subject.papers.flatMap(paper =>
      paper.sections.flatMap(section =>
        section.items.map(item => ({
          ...item,
          category: section.name,
          examType: subject.examType,
          weightage: item.importance
        }))
      )
    )
  );

  const categories = ['All', ...Array.from(new Set(flattenedSyllabus.map(item => item.category)))];
  const examTypes = ['All', 'prelims', 'mains', 'both'];
  const weightages = ['All', 'high', 'medium', 'low'];

  const filteredTopics = flattenedSyllabus.filter(item => {
    const progress = syllabusProgress[item.id];
    if (!progress) return false; // Skip if no progress data

    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesExamType = selectedExamType === 'all' || item.examType === selectedExamType;
    const matchesWeightage = selectedWeightage === 'All' || item.weightage === selectedWeightage;
    const shouldShow = true; // Show all items for now

    return matchesSearch && matchesCategory && matchesExamType && matchesWeightage && shouldShow;
  });

  const stats = getSyllabusStats(syllabusProgress);

  // Show loading state until data is loaded
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading syllabus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Syllabus Tracker</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track your progress across the entire UPSC syllabus with detailed topic-wise breakdown.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col gap-4">
          {/* Exam Type Selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(['prelims', 'mains', 'all'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedExamType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedExamType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {type === 'all' ? 'All Exams' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics and descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value as 'prelims' | 'mains' | 'all')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Exam Types</option>
              {examTypes.slice(1).map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>

            <select
              value={selectedWeightage}
              onChange={(e) => setSelectedWeightage(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="All">All Weightages</option>
              {weightages.slice(1).map(weight => (
                <option key={weight} value={weight}>{weight.charAt(0).toUpperCase() + weight.slice(1)} Priority</option>
              ))}
            </select>

            <button
              onClick={() => setShowSubTopics(!showSubTopics)}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                showSubTopics
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {showSubTopics ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              Sub-topics
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topics List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredTopics.map((item) => {
            const progress = syllabusProgress[item.id];
            const hasChildren = false; // SyllabusItem doesn't have children property
            const isExpanded = expandedTopics.has(item.id);

            return (
              <div key={item.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {hasChildren && (
                        <button
                          onClick={() => toggleTopicExpansion(item.id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <TrendingUp className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                      )}
                      <h3 className={`font-medium text-gray-900 dark:text-white text-lg`}>
                        {item.title}
                      </h3>
                      {getWeightageIcon(item.weightage)}
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{item.category}</span>
                      <span className={`px-2 py-1 rounded ${
                        item.examType === 'both' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        item.examType === 'prelims' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {item.examType === 'both' ? 'Prelims + Mains' : item.examType.charAt(0).toUpperCase() + item.examType.slice(1)}
                      </span>

                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {item.estimatedHours}h
                      </span>
                    </div>

                    {item.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{item.description}</p>
                    )}
                  </div>

                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(progress?.status || 'not_started')}`}>
                    {getStatusIcon(progress?.status || 'not_started')}
                    <span className="ml-1 capitalize">{(progress?.status || 'not_started').replace('_', ' ')}</span>
                  </span>
                </div>

                <div className="mb-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress?.progress || 0}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">{progress?.progress || 0}%</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['not_started', 'in_progress', 'first_reading_done', 'revised_once', 'mastered'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateTopicStatus(item.id, status as SyllabusProgress['status'])}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
                        (progress?.status || 'not_started') === status
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Show child topics if expanded */}
                {hasChildren && isExpanded && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sub-topics:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {item.subtopics?.map((subtopic, index) => (
                        <div key={index} className="text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 dark:text-gray-300">{subtopic}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredTopics.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No topics found matching your filters. Try adjusting your search criteria.
            </div>
          )}
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Progress Overview</h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.completionPercentage}%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Overall Progress</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Topics</span>
                  <span className="font-medium text-gray-900 dark:text-white">{stats.totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="font-medium text-green-600">{stats.completedItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                  <span className="font-medium text-yellow-600">{stats.totalItems - stats.completedItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time Spent</span>
                  <span className="font-medium text-gray-600">{stats.totalTimeSpent}h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">By Category</h4>
            <div className="space-y-3">
              {categories.slice(1).map(category => {
                const categoryItems = flattenedSyllabus.filter(item => item.category === category);
                const categoryProgress = categoryItems.length > 0 ? Math.round(
                  categoryItems.reduce((sum, item) => sum + (syllabusProgress[item.id]?.progress || 0), 0) / categoryItems.length
                ) : 0;

                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{category}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{categoryProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${categoryProgress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Exam Type Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">By Exam Type</h4>
            <div className="space-y-3">
              {['prelims', 'mains', 'both'].map(examType => {
                const examItems = flattenedSyllabus.filter(item => item.examType === examType);
                const examProgress = examItems.length > 0 ? Math.round(
                  examItems.reduce((sum, item) => sum + (syllabusProgress[item.id]?.progress || 0), 0) / examItems.length
                ) : 0;

                return (
                  <div key={examType} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">
                        {examType === 'both' ? 'Prelims + Mains' : examType}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">{examProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full transition-all duration-300 ${
                          examType === 'prelims' ? 'bg-blue-600' :
                          examType === 'mains' ? 'bg-green-600' : 'bg-purple-600'
                        }`}
                        style={{ width: `${examProgress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Study Time Estimate */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Study Time</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total Estimated</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {flattenedSyllabus.reduce((sum, item) => sum + item.estimatedHours, 0)}h
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                <span className="font-medium text-orange-600">
                  {Math.round(flattenedSyllabus.reduce((sum, item) => {
                    const progress = syllabusProgress[item.id];
                    return sum + (item.estimatedHours * (100 - (progress?.progress || 0)) / 100);
                  }, 0))}h
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
