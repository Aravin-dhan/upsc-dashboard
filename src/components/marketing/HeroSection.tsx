'use client';

import Link from 'next/link';
import { ArrowRight, Play, CheckCircle, Users, TrendingUp, Brain, X } from 'lucide-react';
import { useState } from 'react';

export default function HeroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Students' },
    { icon: TrendingUp, value: '85%', label: 'Success Rate' },
    { icon: Brain, value: '50+', label: 'AI Features' },
  ];

  const features = [
    'AI-Powered Study Assistant',
    'Interactive India Map with UPSC Locations',
    'Comprehensive Progress Analytics',
    'Smart Study Schedule Planner',
    'Real-time Performance Tracking'
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
              #1 AI-Powered UPSC Platform
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Master UPSC with
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> AI Intelligence</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Transform your UPSC preparation with our comprehensive AI-powered platform. 
                Get personalized study plans, real-time analytics, and interactive learning tools 
                designed by successful IAS officers.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/signup" 
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={() => setIsVideoPlaying(true)}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-200"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Dashboard Preview */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Browser Header */}
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 flex items-center space-x-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 bg-white dark:bg-gray-600 rounded px-3 py-1 text-xs text-gray-600 dark:text-gray-300">
                  upsc-dashboard.com/dashboard
                </div>
              </div>
              
              {/* Dashboard Content Preview */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Study Progress</h3>
                  <div className="text-sm text-green-600 dark:text-green-400">85% Complete</div>
                </div>
                
                {/* Progress Bars */}
                <div className="space-y-3">
                  {['History', 'Geography', 'Polity', 'Economics'].map((subject, index) => (
                    <div key={subject} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{subject}</span>
                        <span className="text-gray-500 dark:text-gray-400">{85 - index * 10}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${85 - index * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Assistant Preview */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        "Based on your progress, I recommend focusing on Modern History this week. 
                        You're 15% behind your target schedule."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full">
            <button 
              onClick={() => setIsVideoPlaying(false)}
              className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Demo video coming soon!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
