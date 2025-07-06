'use client';

import React, { useState, Suspense, lazy } from 'react';
import { usePerformance } from '@/hooks/usePerformance';
import { generateSamplePerformanceData } from '@/utils/samplePerformanceData';
import toast from 'react-hot-toast';
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown, Activity, BookOpen, Target } from 'lucide-react';

// Lazy load heavy icon components to reduce initial bundle size
const Icons = lazy(() => import('@/components/icons/AnalyticsIcons'));

// Loading component for icons
const IconLoader = ({ name, className }: { name: string; className?: string }) => (
  <Suspense fallback={<div className={`animate-pulse bg-gray-300 rounded ${className || 'h-8 w-8'}`} />}>
    <Icons name={name} className={className} />
  </Suspense>
);

export default function AnalyticsPage() {
  const {
    analytics,
    subjectProgress,
    loading,
    error,
    refreshAnalytics,
    recordStudySession,
    recordPracticeSession,
    deleteMetric,
    exportData,
    importData,
    getPerformanceTrend
  } = usePerformance();

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview', 'subjects']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `upsc-performance-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Performance data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonData = e.target?.result as string;
        const success = await importData(jsonData);
        if (success) {
          toast.success('Performance data imported successfully');
        }
      } catch (error) {
        toast.error('Failed to import data');
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <IconLoader name="Activity" className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Performance Analytics</h1>
          <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
          <button
            onClick={refreshAnalytics}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <IconLoader name="BarChart3" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Performance Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start studying to see your performance analytics
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => recordStudySession({
                subject: 'General Studies',
                timeSpent: 60,
                type: 'study'
              })}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Record Study Session
            </button>
            <button
              onClick={() => recordPracticeSession({
                subject: 'General Studies',
                questionsAttempted: 10,
                questionsCorrect: 7,
                timeSpent: 30
              })}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Record Practice Session
            </button>
            <button
              onClick={() => {
                generateSamplePerformanceData();
                setTimeout(() => refreshAnalytics(), 500);
                toast.success('Sample performance data generated!');
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Generate Sample Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    totalStudyTime = 0,
    totalQuestionsAttempted = 0,
    totalQuestionsCorrect = 0,
    overallAccuracy = 0,
    studyStreak = { currentStreak: 0, longestStreak: 0, lastStudyDate: '', streakStartDate: '' },
    consistencyScore = 0,
    insights = [],
    recentSessions = []
  } = analytics || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Performance Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive analysis of your UPSC preparation progress
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={refreshAnalytics}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            title="Refresh analytics"
          >
            <IconLoader name="RefreshCw" className="h-5 w-5" />
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <IconLoader name="Download" className="h-4 w-4" />
            <span>Export</span>
          </button>
          <label className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
            <IconLoader name="Upload" className="h-4 w-4" />
            <span>Import</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Overview Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div
          className="flex items-center justify-between p-6 cursor-pointer"
          onClick={() => toggleSection('overview')}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Overview</h2>
          {expandedSections.has('overview') ? (
            <IconLoader name="ChevronUp" className="h-5 w-5 text-gray-400" />
          ) : (
            <IconLoader name="ChevronDown" className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        {expandedSections.has('overview') && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Study Time */}
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <IconLoader name="Clock" className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Study Time</p>
              </div>

              {/* Overall Accuracy */}
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <IconLoader name="Target" className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(overallAccuracy || 0).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Accuracy</p>
              </div>

              {/* Study Streak */}
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <IconLoader name="Calendar" className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {studyStreak.currentStreak}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
              </div>

              {/* Consistency Score */}
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <IconLoader name="Zap" className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(consistencyScore || 0).toFixed(1)}/10
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Consistency</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Questions Attempted</span>
                <span className="font-semibold text-gray-900 dark:text-white">{totalQuestionsAttempted}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Questions Correct</span>
                <span className="font-semibold text-gray-900 dark:text-white">{totalQuestionsCorrect}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</span>
                <span className="font-semibold text-gray-900 dark:text-white">{studyStreak.longestStreak} days</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subject Progress Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div
          className="flex items-center justify-between p-6 cursor-pointer"
          onClick={() => toggleSection('subjects')}
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Subject Progress</h2>
          {expandedSections.has('subjects') ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        {expandedSections.has('subjects') && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(subjectProgress || []).map((subject) => (
                <div key={subject.subject} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">{subject.subject}</h3>
                    <div className={`flex items-center space-x-1 ${
                      subject.trend === 'improving' ? 'text-green-500' :
                      subject.trend === 'declining' ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {subject.trend === 'improving' && <TrendingUp className="h-4 w-4" />}
                      {subject.trend === 'declining' && <TrendingDown className="h-4 w-4" />}
                      {subject.trend === 'stable' && <Activity className="h-4 w-4" />}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Accuracy</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {(subject.accuracy || 0).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${subject.accuracy || 0}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Study Time</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {Math.floor((subject.totalTime || 0) / 60)}h {(subject.totalTime || 0) % 60}m
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Topics Completed</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {subject.topicsCompleted}/{subject.totalTopics}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Insights Section */}
      {insights.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div
            className="flex items-center justify-between p-6 cursor-pointer"
            onClick={() => toggleSection('insights')}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">UPSC Coaching Insights</h2>
            {expandedSections.has('insights') ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>

          {expandedSections.has('insights') && (
            <div className="px-6 pb-6 space-y-6">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg border-l-4 ${
                    insight.type === 'strength'
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                      : insight.type === 'weakness'
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                      : insight.type === 'coaching'
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                      : insight.type === 'strategy'
                      ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500'
                      : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          insight.type === 'strength' ? 'bg-green-100 dark:bg-green-900/30' :
                          insight.type === 'weakness' ? 'bg-red-100 dark:bg-red-900/30' :
                          insight.type === 'coaching' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          insight.type === 'strategy' ? 'bg-purple-100 dark:bg-purple-900/30' :
                          'bg-yellow-100 dark:bg-yellow-900/30'
                        }`}>
                          {insight.type === 'strength' && <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />}
                          {insight.type === 'weakness' && <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />}
                          {insight.type === 'coaching' && <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                          {insight.type === 'strategy' && <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                          {(insight.type === 'improvement' || insight.type === 'recommendation') && <Activity className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {insight.message}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              insight.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                              insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {insight.priority} priority
                            </span>
                            {insight.upscSpecific && (
                              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded-full">
                                UPSC Specific
                              </span>
                            )}
                            {insight.examRelevance && insight.examRelevance !== 'all' && (
                              <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full">
                                {insight.examRelevance.charAt(0).toUpperCase() + insight.examRelevance.slice(1)}
                              </span>
                            )}
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                              {insight.category?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Analysis */}
                    {insight.detailedAnalysis && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">📊 Detailed Analysis</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {insight.detailedAnalysis}
                        </p>
                      </div>
                    )}

                    {/* Coaching Advice */}
                    {insight.coachingAdvice && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">🎯 Expert Coaching Advice</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {insight.coachingAdvice}
                        </p>
                      </div>
                    )}

                    {/* Action Steps */}
                    {insight.actionSteps && insight.actionSteps.length > 0 && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">✅ Action Steps</h4>
                        <ul className="space-y-2">
                          {insight.actionSteps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start space-x-2">
                              <span className="flex-shrink-0 w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                                {stepIndex + 1}
                              </span>
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {step}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
