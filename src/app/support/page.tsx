'use client';

import { useState } from 'react';
import { 
  HelpCircle, Search, Book, MessageCircle, Phone, Mail,
  Clock, CheckCircle, ArrowRight, Users, Zap, Shield,
  FileText, Video, Download, ExternalLink, Star
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: HelpCircle },
    { id: 'getting-started', name: 'Getting Started', icon: Zap },
    { id: 'account', name: 'Account & Billing', icon: Users },
    { id: 'features', name: 'Features', icon: Star },
    { id: 'technical', name: 'Technical Issues', icon: Shield },
    { id: 'study-tips', name: 'Study Tips', icon: Book }
  ];

  const popularArticles = [
    {
      id: 1,
      title: 'How to Get Started with UPSC Dashboard',
      category: 'getting-started',
      views: 15420,
      helpful: 142,
      readTime: 5,
      description: 'Complete guide to setting up your account and navigating the dashboard for the first time.'
    },
    {
      id: 2,
      title: 'Using the AI Study Assistant Effectively',
      category: 'features',
      views: 12350,
      helpful: 128,
      readTime: 8,
      description: 'Learn how to maximize your learning with our AI-powered study assistant and get personalized recommendations.'
    },
    {
      id: 3,
      title: 'Troubleshooting Login Issues',
      category: 'technical',
      views: 9870,
      helpful: 95,
      readTime: 3,
      description: 'Step-by-step solutions for common login problems and account access issues.'
    },
    {
      id: 4,
      title: 'Upgrading to Premium Plan',
      category: 'account',
      views: 8640,
      helpful: 87,
      readTime: 4,
      description: 'Everything you need to know about premium features, billing, and subscription management.'
    }
  ];

  const quickActions = [
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: MessageCircle,
      href: '/contact',
      color: 'blue'
    },
    {
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      icon: Phone,
      href: '/chat',
      color: 'green'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other students',
      icon: Users,
      href: '/community',
      color: 'purple'
    },
    {
      title: 'System Status',
      description: 'Check service availability',
      icon: Shield,
      href: '/status',
      color: 'orange'
    }
  ];

  const supportStats = [
    { label: 'Articles', value: '150+' },
    { label: 'Avg Response Time', value: '< 2 hrs' },
    { label: 'Satisfaction Rate', value: '98%' },
    { label: 'Issues Resolved', value: '25k+' }
  ];

  const filteredArticles = popularArticles.filter(article => 
    (selectedCategory === 'all' || article.category === selectedCategory) &&
    (searchQuery === '' || article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     article.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How can we help you?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Find answers to your questions, get support, and learn how to make the most of your UPSC preparation journey.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for help articles, guides, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-lg shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {supportStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Quick Actions
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:shadow-lg transition-all group bg-gray-50 dark:bg-gray-800"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <action.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {action.description}
                </p>
                <ArrowRight className="h-4 w-4 text-gray-400 mt-2 group-hover:text-blue-600 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Categories and Articles */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Browse Help Topics
          </h2>
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div key={article.id} className="bg-white dark:bg-gray-900 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 px-2 py-1 rounded">
                    {categories.find(c => c.id === article.category)?.name}
                  </span>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{article.readTime} min</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {article.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <span>{article.views.toLocaleString()} views</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{article.helpful} helpful</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Read Article
                </button>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search or browse different categories.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Still need help?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Our support team is here to help you succeed in your UPSC preparation journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contact Support
            </a>
            <a 
              href="/chat" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Start Live Chat
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
