'use client';

import { useState } from 'react';
import { 
  Newspaper, Calendar, Globe, TrendingUp, Download,
  Star, Filter, Search, Clock, Tag, ExternalLink,
  Play, BookOpen, Users, Award
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function CurrentAffairsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'National', 'International', 'Economy', 'Science & Tech', 
    'Environment', 'Sports', 'Awards', 'Government Schemes'
  ];

  const currentAffairs = [
    {
      id: 1,
      title: 'Current Affairs - January 2024',
      description: 'Comprehensive monthly compilation with UPSC relevance analysis and practice questions',
      period: 'Monthly',
      category: 'Complete Coverage',
      date: '2024-01-31',
      downloads: 32100,
      rating: 4.8,
      pages: 120,
      questions: 150,
      isPremium: false,
      tags: ['Monthly', 'Complete', 'Analysis', 'Questions'],
      highlights: ['Budget 2024 Analysis', 'Republic Day Special', 'International Relations Updates']
    },
    {
      id: 2,
      title: 'Weekly Current Affairs - Week 4 January',
      description: 'Important events and developments from the last week with quick revision notes',
      period: 'Weekly',
      category: 'National',
      date: '2024-01-28',
      downloads: 18750,
      rating: 4.7,
      pages: 45,
      questions: 50,
      isPremium: false,
      tags: ['Weekly', 'Quick Revision', 'National'],
      highlights: ['Parliament Session Updates', 'State Elections', 'Policy Changes']
    },
    {
      id: 3,
      title: 'Daily Current Affairs - January 30, 2024',
      description: 'Today\'s important news with UPSC perspective and potential question areas',
      period: 'Daily',
      category: 'International',
      date: '2024-01-30',
      downloads: 8900,
      rating: 4.6,
      pages: 12,
      questions: 15,
      isPremium: true,
      tags: ['Daily', 'International', 'Analysis'],
      highlights: ['UN Security Council Updates', 'Trade Agreements', 'Diplomatic Relations']
    }
  ];

  const features = [
    {
      icon: Globe,
      title: 'UPSC Relevance Analysis',
      description: 'Every news item analyzed for UPSC exam relevance with potential question areas highlighted.'
    },
    {
      icon: BookOpen,
      title: 'Practice Questions',
      description: 'MCQs and descriptive questions based on current events for effective preparation.'
    },
    {
      icon: TrendingUp,
      title: 'Trend Analysis',
      description: 'Identify important trends and recurring themes that frequently appear in UPSC exams.'
    },
    {
      icon: Award,
      title: 'Expert Commentary',
      description: 'Insights and analysis from subject matter experts and successful UPSC candidates.'
    }
  ];

  const stats = [
    { label: 'Daily Updates', value: '365+' },
    { label: 'Monthly Compilations', value: '12' },
    { label: 'Practice Questions', value: '2,500+' },
    { label: 'Success Stories', value: '450+' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Current Affairs Hub
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Stay updated with daily, weekly, and monthly current affairs compilations 
              specifically curated for UPSC preparation with detailed analysis.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Period Filters */}
          <div className="flex justify-center space-x-4">
            {['daily', 'weekly', 'monthly'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-red-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search current affairs topics..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Current Affairs Grid */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentAffairs.map((item) => (
              <div key={item.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-red-100 dark:bg-red-900/20 text-red-600 px-2 py-1 rounded">
                      {item.period}
                    </span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 px-2 py-1 rounded">
                      {item.category}
                    </span>
                    {item.isPremium && (
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 px-2 py-1 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {item.description}
                </p>

                {/* Highlights */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Key Highlights:</h4>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    {item.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{item.pages}</div>
                    <div className="text-xs text-gray-500">Pages</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{item.questions}</div>
                    <div className="text-xs text-gray-500">Questions</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{item.downloads.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Downloads</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Updated today</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                    {item.isPremium ? 'Upgrade to Access' : 'Download Free'}
                  </button>
                  <button className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Why Our Current Affairs?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Never Miss Important Updates
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Get daily current affairs delivered to your inbox with UPSC relevance analysis.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
              Subscribe
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Join 50,000+ aspirants who trust our daily updates. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Stay Ahead with Current Affairs
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Access comprehensive current affairs coverage with expert analysis and practice questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Free Access
            </a>
            <a 
              href="/pricing" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition-colors"
            >
              Upgrade to Premium
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
