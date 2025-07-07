'use client';

import { useState } from 'react';
import { 
  Book, Search, ChevronRight, ChevronDown, ExternalLink,
  Rocket, Settings, Users, BarChart, Map, Calendar,
  MessageSquare, Shield, Zap, HelpCircle, FileText
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);

  const docSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Rocket,
      description: 'Quick start guide and basic setup',
      articles: [
        { title: 'Account Setup', slug: 'account-setup', description: 'Create and configure your account' },
        { title: 'First Steps', slug: 'first-steps', description: 'Navigate the dashboard and key features' },
        { title: 'Study Plan Creation', slug: 'study-plan', description: 'Set up your personalized study plan' },
        { title: 'Mobile App Setup', slug: 'mobile-setup', description: 'Download and configure mobile apps' }
      ]
    },
    {
      id: 'features',
      title: 'Core Features',
      icon: Zap,
      description: 'Detailed guides for all platform features',
      articles: [
        { title: 'AI Study Assistant', slug: 'ai-assistant', description: 'How to use the AI for study guidance' },
        { title: 'Interactive Maps', slug: 'interactive-maps', description: 'Navigate and learn with geography maps' },
        { title: 'Smart Calendar', slug: 'smart-calendar', description: 'Schedule and track your study sessions' },
        { title: 'Question Bank', slug: 'question-bank', description: 'Practice with 420+ parsed questions' },
        { title: 'Current Affairs', slug: 'current-affairs', description: 'Stay updated with relevant news' },
        { title: 'Performance Analytics', slug: 'analytics', description: 'Track progress and identify improvements' }
      ]
    },
    {
      id: 'study-tools',
      title: 'Study Tools',
      icon: Book,
      description: 'Advanced tools for effective preparation',
      articles: [
        { title: 'Note Taking', slug: 'note-taking', description: 'Create and organize study notes' },
        { title: 'Bookmarks', slug: 'bookmarks', description: 'Save and categorize important content' },
        { title: 'Progress Tracking', slug: 'progress-tracking', description: 'Monitor your preparation journey' },
        { title: 'Goal Setting', slug: 'goal-setting', description: 'Set and achieve study milestones' },
        { title: 'Time Management', slug: 'time-management', description: 'Optimize your study schedule' }
      ]
    },
    {
      id: 'account-settings',
      title: 'Account & Settings',
      icon: Settings,
      description: 'Manage your account and preferences',
      articles: [
        { title: 'Profile Management', slug: 'profile', description: 'Update personal information and preferences' },
        { title: 'Subscription Plans', slug: 'subscription', description: 'Manage billing and plan changes' },
        { title: 'Privacy Settings', slug: 'privacy', description: 'Control data sharing and privacy options' },
        { title: 'Notification Preferences', slug: 'notifications', description: 'Customize alerts and reminders' }
      ]
    },
    {
      id: 'collaboration',
      title: 'Collaboration',
      icon: Users,
      description: 'Work with study groups and mentors',
      articles: [
        { title: 'Study Groups', slug: 'study-groups', description: 'Join and create study communities' },
        { title: 'Mentor Connect', slug: 'mentors', description: 'Connect with experienced guides' },
        { title: 'Resource Sharing', slug: 'sharing', description: 'Share notes and materials with others' },
        { title: 'Discussion Forums', slug: 'forums', description: 'Participate in topic discussions' }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: HelpCircle,
      description: 'Common issues and solutions',
      articles: [
        { title: 'Login Issues', slug: 'login-issues', description: 'Resolve authentication problems' },
        { title: 'Performance Problems', slug: 'performance', description: 'Fix slow loading and crashes' },
        { title: 'Mobile App Issues', slug: 'mobile-issues', description: 'Troubleshoot app-specific problems' },
        { title: 'Data Sync Problems', slug: 'sync-issues', description: 'Fix synchronization issues' }
      ]
    }
  ];

  const popularArticles = [
    { title: 'How to Use AI Assistant Effectively', views: '15.2k', category: 'Features' },
    { title: 'Creating Your First Study Plan', views: '12.8k', category: 'Getting Started' },
    { title: 'Understanding Performance Analytics', views: '9.4k', category: 'Features' },
    { title: 'Mobile App Complete Guide', views: '8.7k', category: 'Getting Started' },
    { title: 'Troubleshooting Common Issues', views: '7.3k', category: 'Troubleshooting' }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const filteredSections = docSections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.articles.length > 0 || searchQuery === '');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Documentation &
            <span className="text-blue-600 dark:text-blue-400"> Guides</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Everything you need to know to master the UPSC Dashboard platform 
            and accelerate your preparation.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Documentation
              </h3>
              <nav className="space-y-2">
                {filteredSections.map((section) => (
                  <div key={section.id}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <section.icon className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {section.title}
                        </span>
                      </div>
                      {expandedSections.includes(section.id) ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedSections.includes(section.id) && (
                      <div className="mt-2 ml-8 space-y-1">
                        {section.articles.map((article) => (
                          <a
                            key={article.slug}
                            href={`/docs/${section.id}/${article.slug}`}
                            className="block p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
                          >
                            {article.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {searchQuery ? (
              /* Search Results */
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Search Results for "{searchQuery}"
                </h2>
                <div className="space-y-6">
                  {filteredSections.map((section) => (
                    section.articles.length > 0 && (
                      <div key={section.id}>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          {section.title}
                        </h3>
                        <div className="grid gap-4">
                          {section.articles.map((article) => (
                            <a
                              key={article.slug}
                              href={`/docs/${section.id}/${article.slug}`}
                              className="block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                {article.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {article.description}
                              </p>
                            </a>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ) : (
              /* Default Content */
              <div>
                {/* Quick Start */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Quick Start Guide
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <a
                      href="/docs/getting-started/account-setup"
                      className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">1</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Set Up Your Account
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        Create your account and configure basic settings to get started.
                      </p>
                    </a>

                    <a
                      href="/docs/getting-started/first-steps"
                      className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">2</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Explore the Dashboard
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        Navigate the interface and discover key features and tools.
                      </p>
                    </a>

                    <a
                      href="/docs/getting-started/study-plan"
                      className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">3</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Create Study Plan
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        Set up your personalized study schedule and goals.
                      </p>
                    </a>

                    <a
                      href="/docs/features/ai-assistant"
                      className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">4</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Use AI Assistant
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        Learn how to effectively use the AI for study guidance.
                      </p>
                    </a>
                  </div>
                </div>

                {/* Popular Articles */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Popular Articles
                  </h2>
                  <div className="space-y-4">
                    {popularArticles.map((article, index) => (
                      <a
                        key={index}
                        href="#"
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {article.title}
                            </h3>
                            <span className="text-sm text-gray-500">{article.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">{article.views} views</span>
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* All Sections */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    All Documentation
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {docSections.map((section) => (
                      <div key={section.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <section.icon className="h-6 w-6 text-blue-600" />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {section.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {section.description}
                        </p>
                        <div className="space-y-2">
                          {section.articles.slice(0, 3).map((article) => (
                            <a
                              key={article.slug}
                              href={`/docs/${section.id}/${article.slug}`}
                              className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {article.title}
                            </a>
                          ))}
                          {section.articles.length > 3 && (
                            <button
                              onClick={() => toggleSection(section.id)}
                              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                              +{section.articles.length - 3} more articles
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
