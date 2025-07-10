'use client';

import React from 'react';
import { Calendar, BookOpen, TrendingUp, Target, Brain, Heart, Star, Users, FileText, Zap } from 'lucide-react';

/**
 * EMERGENCY DASHBOARD - BULLETPROOF FALLBACK
 * 
 * This is a completely self-contained dashboard that works without any external dependencies,
 * lazy loading, or complex validation. It's designed to ALWAYS work.
 */

const EmergencyDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            UPSC Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your comprehensive UPSC preparation platform
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Command Center */}
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
            </div>
          </div>

          {/* Today's Schedule */}
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
            </div>
          </div>

          {/* Performance Overview */}
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
            </div>
          </div>

          {/* Syllabus Progress */}
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
            </div>
          </div>

          {/* Current Affairs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-orange-600 mr-3" />
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
            </div>
          </div>

          {/* Knowledge Base */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <BookOpen className="h-6 w-6 text-indigo-600 mr-3" />
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
            </div>
          </div>

          {/* Wellness Corner */}
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
            </div>
          </div>

          {/* Daily Motivation */}
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
            </div>
          </div>

          {/* AI Assistant */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Brain className="h-6 w-6 text-cyan-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Assistant</h2>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Your personal AI study companion
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
                Start Conversation
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Emergency Dashboard Mode - All systems operational
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDashboard;
