'use client';

import React, { useState } from 'react';
import { 
  Brain, Calendar, BookOpen, TrendingUp, Map, Users, 
  MessageSquare, Target, Clock, Award, Zap, Shield,
  ChevronRight, Play, CheckCircle, Star
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function FeaturesPage() {
  const [activeDemo, setActiveDemo] = useState('ai-assistant');

  const mainFeatures = [
    {
      id: 'practice-tests',
      icon: BookOpen,
      title: 'Comprehensive Practice Tests',
      description: 'Master UPSC with extensive mock tests, previous year questions, and detailed performance analysis.',
      benefits: ['420+ parsed questions', 'Year-wise categorization', 'Detailed solutions', 'Performance tracking'],
      demo: 'Take practice tests with instant feedback and analysis'
    },
    {
      id: 'current-affairs',
      icon: MessageSquare,
      title: 'Current Affairs Hub',
      description: 'Stay updated with curated current affairs from trusted sources with UPSC relevance scoring.',
      benefits: ['Daily updates', 'Source verification', 'UPSC relevance scoring', 'Topic categorization'],
      demo: 'Live current affairs feed with filtering options'
    },
    {
      id: 'interactive-maps',
      icon: Map,
      title: 'Interactive Geography Maps',
      description: 'Master geography with detailed interactive maps covering all UPSC-relevant locations and topics.',
      benefits: ['20+ educational locations', 'Historical significance', 'Current affairs integration', 'Visual learning'],
      demo: 'Explore India map with clickable states and districts'
    },
    {
      id: 'smart-calendar',
      icon: Calendar,
      title: 'Smart Study Calendar',
      description: 'Intelligent scheduling that adapts to your pace and optimizes your preparation timeline.',
      benefits: ['Adaptive scheduling', 'Goal tracking', 'Revision reminders', 'Progress milestones'],
      demo: 'Dynamic calendar with AI-optimized study sessions'
    },
    {
      id: 'performance-analytics',
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Comprehensive performance tracking with detailed insights and improvement suggestions.',
      benefits: ['Subject-wise analysis', 'Weakness identification', 'Progress visualization', 'Comparative metrics'],
      demo: 'Real-time performance dashboard with charts'
    },
    {
      id: 'question-bank',
      icon: BookOpen,
      title: 'Comprehensive Question Bank',
      description: 'Access thousands of previous year questions with detailed solutions and explanations.',
      benefits: ['420+ parsed questions', 'Year-wise categorization', 'Detailed solutions', 'Topic-wise practice'],
      demo: 'Browse questions by year, subject, and difficulty'
    },
    {
      id: 'current-affairs',
      icon: MessageSquare,
      title: 'Current Affairs Hub',
      description: 'Stay updated with curated current affairs from trusted sources with UPSC relevance.',
      benefits: ['Daily updates', 'Source verification', 'UPSC relevance scoring', 'Topic categorization'],
      demo: 'Live current affairs feed with filtering options'
    }
  ];

  const additionalFeatures = [
    { icon: Target, title: 'Goal Setting & Tracking', description: 'Set SMART goals and track progress with visual indicators' },
    { icon: Clock, title: 'Time Management Tools', description: 'Pomodoro timers, study session tracking, and productivity insights' },
    { icon: Award, title: 'Achievement System', description: 'Gamified learning with badges, streaks, and milestone rewards' },
    { icon: Users, title: 'Community Features', description: 'Connect with fellow aspirants, share resources, and collaborate' },
    { icon: Brain, title: 'AI Study Assistant', description: 'Get quick answers and navigation help - a helpful supplementary tool for your preparation' },
    { icon: Zap, title: 'Quick Actions', description: 'Voice commands, keyboard shortcuts, and rapid navigation' },
    { icon: Shield, title: 'Data Security', description: 'Enterprise-grade security with encrypted data and privacy protection' }
  ];

  const testimonialStats = [
    { value: '2,500+', label: 'Active Users' },
    { value: '85%', label: 'Success Rate' },
    { value: '4.9/5', label: 'User Rating' },
    { value: '50+', label: 'States Covered' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Complete UPSC Preparation
              <span className="text-blue-600 dark:text-blue-400"> Platform</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Master UPSC with our comprehensive platform featuring practice tests, current affairs,
              study materials, progress tracking, and interactive learning tools designed for success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/signup" 
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Free Trial
                <ChevronRight className="ml-2 h-5 w-5" />
              </a>
              <button 
                onClick={() => setActiveDemo('ai-assistant')}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonialStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Core Features That Make the Difference
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Each feature is designed specifically for UPSC aspirants, backed by research and proven methodologies.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Feature List */}
            <div className="space-y-6">
              {mainFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className={`p-6 rounded-lg cursor-pointer transition-all ${
                    activeDemo === feature.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700'
                      : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-700'
                  }`}
                  onClick={() => setActiveDemo(feature.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      activeDemo === feature.id ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-600'
                    }`}>
                      <feature.icon className={`h-6 w-6 ${
                        activeDemo === feature.id ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {feature.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {feature.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Demo Area */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Interactive Demo
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {mainFeatures.find(f => f.id === activeDemo)?.demo}
                  </p>
                </div>
                
                {/* Demo Content */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      {React.createElement(mainFeatures.find(f => f.id === activeDemo)?.icon || Brain, {
                        className: "h-8 w-8 text-blue-600"
                      })}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {mainFeatures.find(f => f.id === activeDemo)?.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Interactive demo coming soon! Sign up to experience the full feature.
                    </p>
                    <a 
                      href="/signup"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Try It Now
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Additional Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              More tools to enhance your preparation experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful UPSC aspirants who are already using our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Your Free Trial
            </a>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
