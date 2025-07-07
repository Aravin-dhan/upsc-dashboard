'use client';

import { useState } from 'react';
import { 
  FileText, Clock, Users, Target, Play, Download,
  Star, Filter, Search, Calendar, Award, TrendingUp
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function MockTestsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const testCategories = [
    { id: 'prelims', name: 'Prelims', count: 45 },
    { id: 'mains', name: 'Mains', count: 25 },
    { id: 'sectional', name: 'Sectional', count: 30 },
    { id: 'full-length', name: 'Full Length', count: 20 }
  ];

  const mockTests = [
    {
      id: 1,
      title: 'UPSC Prelims Mock Test 2024 - Set 1',
      description: 'Comprehensive test covering all GS papers with detailed solutions',
      category: 'Prelims',
      difficulty: 'Medium',
      questions: 100,
      duration: 120,
      attempts: 15420,
      rating: 4.8,
      isPremium: false,
      tags: ['Current Affairs', 'History', 'Geography', 'Polity']
    },
    {
      id: 2,
      title: 'Mains Answer Writing Practice - Ethics',
      description: 'Practice questions for Ethics paper with model answers',
      category: 'Mains',
      difficulty: 'Hard',
      questions: 10,
      duration: 180,
      attempts: 8750,
      rating: 4.9,
      isPremium: true,
      tags: ['Ethics', 'Case Studies', 'Answer Writing']
    },
    {
      id: 3,
      title: 'Geography Sectional Test',
      description: 'Focused test on Indian and World Geography topics',
      category: 'Sectional',
      difficulty: 'Easy',
      questions: 50,
      duration: 60,
      attempts: 12300,
      rating: 4.6,
      isPremium: false,
      tags: ['Physical Geography', 'Human Geography', 'Economic Geography']
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Mock Tests & Practice
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Test your preparation with comprehensive mock tests, sectional tests, 
              and previous year question papers with detailed analysis.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">120+</div>
              <div className="text-gray-600 dark:text-gray-400">Mock Tests</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">50k+</div>
              <div className="text-gray-600 dark:text-gray-400">Test Attempts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">4.8★</div>
              <div className="text-gray-600 dark:text-gray-400">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">85%</div>
              <div className="text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Categories */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Test Categories
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {testCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-lg border-2 text-center transition-all ${
                  selectedCategory === category.id
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                }`}
              >
                <FileText className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.count} tests available
                </p>
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search tests..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Mock Tests Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTests.map((test) => (
              <div key={test.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 px-2 py-1 rounded">
                      {test.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      test.difficulty === 'Easy' ? 'bg-blue-100 text-blue-600' :
                      test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {test.difficulty}
                    </span>
                    {test.isPremium && (
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 px-2 py-1 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{test.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {test.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {test.description}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{test.questions}</div>
                    <div className="text-xs text-gray-500">Questions</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{test.duration}</div>
                    <div className="text-xs text-gray-500">Minutes</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{test.attempts.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Attempts</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {test.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center">
                    <Play className="h-4 w-4 mr-2" />
                    {test.isPremium ? 'Upgrade to Take' : 'Start Test'}
                  </button>
                  <button className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <Download className="h-4 w-4" />
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
            Test Features
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Detailed Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get comprehensive performance analysis with subject-wise breakdown and improvement suggestions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Timed Practice
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Practice under real exam conditions with accurate timing and instant feedback.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                All India Ranking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Compare your performance with thousands of other aspirants across the country.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Test Your Preparation?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Start with our free mock tests and upgrade for advanced analytics and premium content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Free Tests
            </a>
            <a 
              href="/pricing" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
            >
              View Premium Plans
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
