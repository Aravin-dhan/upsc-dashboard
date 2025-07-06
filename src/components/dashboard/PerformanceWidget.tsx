'use client';

import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Target, Clock, BookOpen, Award,
  BarChart3, Activity, Zap, Calendar, ArrowRight, RefreshCw
} from 'lucide-react';
import { usePerformance } from '@/hooks/usePerformance';
import { generateSamplePerformanceData, addRecentSampleSessions } from '@/utils/samplePerformanceData';
import toast from 'react-hot-toast';

interface PerformanceWidgetProps {
  className?: string;
}

export default function PerformanceWidget({ className = '' }: PerformanceWidgetProps) {
  const {
    analytics,
    loading,
    error,
    refreshAnalytics,
    recordStudySession,
    recordPracticeSession
  } = usePerformance();

  // Safe destructuring with defaults
  const {
    recentSessions = [],
    subjectProgress = [],
    insights = [],
    totalStudyTime = 0,
    overallAccuracy = 0,
    questionsAttempted = 0,
    questionsCorrect = 0,
    totalQuestionsAttempted = 0,
    totalQuestionsCorrect = 0,
    averageSessionTime = 0,
    studyStreak = { currentStreak: 0, longestStreak: 0, lastStudyDate: '', streakStartDate: '' },
    studyDaysThisWeek = 0,
    studyDaysThisMonth = 0,
    consistencyScore = 0,
    dailyAverages = { studyTime: 0, accuracy: 0, questionsAttempted: 0 },
    weeklyTrends = [],
    monthlyProgress = { current: 0, target: 0, improvement: 0 },
    goals = { dailyStudyTime: 240, weeklyAccuracy: 75, monthlyTopics: 20 },
    trends = { studyTime: 0, accuracy: 0, questionsAttempted: 0 },
    weeklyGoalProgress = 0,
    monthlyGoalProgress = 0
  } = analytics || {};

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    refreshAnalytics();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="text-center">
          <Activity className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Performance Analytics</h3>
          <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Performance Analytics</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Start studying to see your performance analytics
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={() => recordStudySession({
                subject: 'General Studies',
                timeSpent: 60,
                type: 'study'
              })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Record Practice
            </button>
            <button
              onClick={() => {
                generateSamplePerformanceData();
                setTimeout(() => refreshAnalytics(), 500);
                toast.success('Sample performance data generated!');
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Generate Sample Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Analytics data is already destructured above with safe defaults

  // Calculate today's study time
  const today = new Date().toISOString().split('T')[0];
  const todaysSessions = (recentSessions || []).filter(session => session.date === today);
  const todaysStudyTime = todaysSessions.reduce((sum, session) => sum + session.timeSpent, 0);

  // Get top performing subject
  const topSubject = subjectProgress.reduce((best, subject) => 
    subject.accuracy > best.accuracy ? subject : best, 
    subjectProgress[0] || { subject: 'None', accuracy: 0 }
  );

  // Get most recent insight
  const latestInsight = insights.find(insight => insight.priority === 'high') || insights[0];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header - Mobile Optimized */}
      <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Activity className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
                Performance Analytics
              </h3>
              <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                Your study progress overview
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            title="Refresh analytics"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Key Metrics - Mobile Optimized */}
      <div className="p-4 lg:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
          {/* Study Streak */}
          <div className="text-center p-3 lg:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5 text-orange-500 mr-1" />
              <span className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                {studyStreak.currentStreak}
              </span>
            </div>
            <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 font-medium">Day Streak</p>
          </div>

          {/* Today's Study Time */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.floor(todaysStudyTime / 60)}h {todaysStudyTime % 60}m
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Today</p>
          </div>

          {/* Overall Accuracy */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {(overallAccuracy || 0).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Accuracy</p>
          </div>

          {/* Consistency Score */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-4 w-4 text-purple-500 mr-1" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {(consistencyScore || 0).toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Consistency</p>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">This Week</h4>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {studyDaysThisWeek}/7 days
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(studyDaysThisWeek / 7) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Top Subject */}
        {topSubject.subject !== 'None' && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Top Performing Subject</h4>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{topSubject.subject}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {(topSubject.accuracy || 0).toFixed(1)}% accuracy
                  </p>
                </div>
              </div>
              <Award className="h-5 w-5 text-green-500" />
            </div>
          </div>
        )}

        {/* Latest Insight */}
        {latestInsight && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Latest Insight</h4>
            <div className={`p-3 rounded-lg border-l-4 ${
              latestInsight.type === 'strength' 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                : latestInsight.type === 'weakness'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                : latestInsight.type === 'improvement'
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
            }`}>
              <div className="flex items-start space-x-2">
                {latestInsight.type === 'strength' && <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />}
                {latestInsight.type === 'weakness' && <TrendingDown className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />}
                {latestInsight.type === 'improvement' && <Activity className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />}
                {latestInsight.type === 'recommendation' && <Target className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />}
                <p className="text-sm text-gray-700 dark:text-gray-300">{latestInsight.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Quick Actions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => recordStudySession({
                subject: 'General Studies',
                timeSpent: 60,
                type: 'study'
              })}
              className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Record Study</span>
              </div>
              <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => recordPracticeSession({
                subject: 'General Studies',
                questionsAttempted: 10,
                questionsCorrect: 7,
                timeSpent: 30
              })}
              className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
            >
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Record Practice</span>
              </div>
              <ArrowRight className="h-4 w-4 text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Total study time: {Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m
          </p>
          <a
            href="/analytics"
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            View detailed analytics →
          </a>
        </div>
      </div>
    </div>
  );
}
