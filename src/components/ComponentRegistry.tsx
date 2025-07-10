'use client';

import React from 'react';
import { Calendar, BookOpen, TrendingUp, Target, Brain, Heart, Star, Users, FileText, Zap, BarChart3, Clock } from 'lucide-react';

/**
 * REVOLUTIONARY COMPONENT REGISTRY SYSTEM
 * 
 * This completely eliminates lazy loading and dynamic imports by pre-defining
 * all components as simple, reliable React components that ALWAYS work.
 */

// Simple, bulletproof widget components
const CommandCenterWidget = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-4">
      <Zap className="h-6 w-6 text-blue-600 mr-3" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Command Center</h2>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Study Streak</span>
        <span className="font-semibold text-green-600">7 days</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Today's Goal</span>
        <span className="font-semibold text-blue-600">6/8 hours</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Progress</span>
        <span className="font-semibold text-purple-600">75%</span>
      </div>
      <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
        View Details
      </button>
    </div>
  </div>
);

const TodaysScheduleWidget = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-4">
      <Calendar className="h-6 w-6 text-green-600 mr-3" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Today's Schedule</h2>
    </div>
    <div className="space-y-3">
      <div className="flex items-center">
        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
        <span className="text-gray-700 dark:text-gray-300">9:00 AM - History</span>
      </div>
      <div className="flex items-center">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
        <span className="text-gray-700 dark:text-gray-300">11:00 AM - Polity</span>
      </div>
      <div className="flex items-center">
        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
        <span className="text-gray-700 dark:text-gray-300">2:00 PM - Current Affairs</span>
      </div>
      <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
        Manage Schedule
      </button>
    </div>
  </div>
);

const PerformanceOverviewWidget = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-4">
      <TrendingUp className="h-6 w-6 text-purple-600 mr-3" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Performance Overview</h2>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Mock Tests</span>
        <span className="font-semibold text-blue-600">12 completed</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Average Score</span>
        <span className="font-semibold text-green-600">78%</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Rank</span>
        <span className="font-semibold text-purple-600">#245</span>
      </div>
      <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
        View Analytics
      </button>
    </div>
  </div>
);

const SyllabusTrackerWidget = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-4">
      <Target className="h-6 w-6 text-red-600 mr-3" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Syllabus Progress</h2>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">History</span>
        <span className="font-semibold text-green-600">85%</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Geography</span>
        <span className="font-semibold text-blue-600">72%</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Polity</span>
        <span className="font-semibold text-yellow-600">68%</span>
      </div>
      <button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
        Update Progress
      </button>
    </div>
  </div>
);

const PerformanceAnalyticsWidget = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-4">
      <BarChart3 className="h-6 w-6 text-indigo-600 mr-3" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Performance Analytics</h2>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Weekly Progress</span>
        <span className="font-semibold text-green-600">+12%</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Strong Areas</span>
        <span className="font-semibold text-blue-600">History, Polity</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Focus Areas</span>
        <span className="font-semibold text-orange-600">Economics</span>
      </div>
      <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
        Detailed Report
      </button>
    </div>
  </div>
);

const RevisionEngineWidget = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-4">
      <Clock className="h-6 w-6 text-orange-600 mr-3" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Revision Engine</h2>
    </div>
    <div className="space-y-3">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Smart revision scheduling based on forgetting curve
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Due Today</span>
        <span className="font-semibold text-red-600">5 topics</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">This Week</span>
        <span className="font-semibold text-blue-600">23 topics</span>
      </div>
      <button className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
        Start Revision
      </button>
    </div>
  </div>
);

const CurrentAffairsWidget = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-4">
      <FileText className="h-6 w-6 text-cyan-600 mr-3" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Current Affairs</h2>
    </div>
    <div className="space-y-3">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Latest updates from reliable sources
      </div>
      <div className="flex items-center">
        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
        <span className="text-gray-700 dark:text-gray-300 text-sm">Economic Survey 2024</span>
      </div>
      <div className="flex items-center">
        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
        <span className="text-gray-700 dark:text-gray-300 text-sm">New Policy Updates</span>
      </div>
      <button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
        Read More
      </button>
    </div>
  </div>
);

const KnowledgeBaseWidget = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-4">
      <BookOpen className="h-6 w-6 text-emerald-600 mr-3" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Knowledge Base</h2>
    </div>
    <div className="space-y-3">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Your personal study notes and resources
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Notes</span>
        <span className="font-semibold text-blue-600">156 items</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Bookmarks</span>
        <span className="font-semibold text-green-600">89 items</span>
      </div>
      <button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
        Browse Knowledge
      </button>
    </div>
  </div>
);

const WellnessCornerWidget = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-4">
      <Heart className="h-6 w-6 text-pink-600 mr-3" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Wellness Corner</h2>
    </div>
    <div className="space-y-3">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Take care of your mental and physical health
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Stress Level</span>
        <span className="font-semibold text-green-600">Low</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Sleep</span>
        <span className="font-semibold text-blue-600">7.5 hrs</span>
      </div>
      <button className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
        Wellness Check
      </button>
    </div>
  </div>
);

const MotivationalPosterWidget = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-4">
      <Star className="h-6 w-6 text-yellow-600 mr-3" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Daily Motivation</h2>
    </div>
    <div className="space-y-3">
      <div className="text-sm text-gray-700 dark:text-gray-300 italic">
        "Success is not final, failure is not fatal: it is the courage to continue that counts."
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-500">
        - Winston Churchill
      </div>
      <button className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
        New Quote
      </button>
    </div>
  </div>
);

const PersonalizationInsightsWidget = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-4">
      <Brain className="h-6 w-6 text-violet-600 mr-3" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Insights</h2>
    </div>
    <div className="space-y-3">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Your personal AI study companion
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
        <div className="text-sm text-blue-800 dark:text-blue-200">
          💡 Focus more on Economics this week for better balance
        </div>
      </div>
      <button className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
        Get More Insights
      </button>
    </div>
  </div>
);

// COMPONENT REGISTRY - Pre-loaded, guaranteed to work
export const COMPONENT_REGISTRY = {
  'command-center': CommandCenterWidget,
  'todays-schedule': TodaysScheduleWidget,
  'performance-widget': PerformanceOverviewWidget,
  'syllabus-tracker': SyllabusTrackerWidget,
  'performance-analytics': PerformanceAnalyticsWidget,
  'revision-engine': RevisionEngineWidget,
  'current-affairs': CurrentAffairsWidget,
  'knowledge-base': KnowledgeBaseWidget,
  'wellness-corner': WellnessCornerWidget,
  'motivational-poster': MotivationalPosterWidget,
  'personalization-insights': PersonalizationInsightsWidget,
};

export type ComponentId = keyof typeof COMPONENT_REGISTRY;

// Widget metadata
export const WIDGET_METADATA = {
  'command-center': { name: 'Command Center', size: 'large' as const, order: 0 },
  'todays-schedule': { name: "Today's Schedule", size: 'medium' as const, order: 1 },
  'performance-widget': { name: 'Performance Overview', size: 'medium' as const, order: 2 },
  'syllabus-tracker': { name: 'Syllabus Progress', size: 'medium' as const, order: 3 },
  'performance-analytics': { name: 'Performance Analytics', size: 'large' as const, order: 4 },
  'revision-engine': { name: 'Revision Engine', size: 'medium' as const, order: 5 },
  'current-affairs': { name: 'Current Affairs', size: 'medium' as const, order: 6 },
  'knowledge-base': { name: 'Knowledge Base', size: 'medium' as const, order: 7 },
  'wellness-corner': { name: 'Wellness Corner', size: 'small' as const, order: 8 },
  'motivational-poster': { name: 'Daily Motivation', size: 'small' as const, order: 9 },
  'personalization-insights': { name: 'AI Insights', size: 'medium' as const, order: 10 },
};

export default COMPONENT_REGISTRY;
