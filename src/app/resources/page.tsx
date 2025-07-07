'use client';

import { useState } from 'react';
import { 
  BookOpen, FileText, Newspaper, GraduationCap, Map,
  Search, Filter, Download, Star, Clock, Users,
  ChevronRight, ExternalLink, Tag, Calendar
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const resourceCategories = [
    {
      id: 'materials',
      title: 'Study Materials',
      description: 'Comprehensive notes, books, and reference materials for all UPSC subjects',
      icon: BookOpen,
      color: 'blue',
      count: 450,
      href: '/resources/materials'
    },
    {
      id: 'tests',
      title: 'Mock Tests',
      description: 'Practice tests, previous year papers, and assessment tools',
      icon: FileText,
      color: 'green',
      count: 120,
      href: '/resources/tests'
    },
    {
      id: 'current-affairs',
      title: 'Current Affairs',
      description: 'Daily updates, monthly compilations, and analysis of current events',
      icon: Newspaper,
      color: 'red',
      count: 365,
      href: '/resources/current-affairs'
    },
    {
      id: 'papers',
      title: 'Previous Papers',
      description: 'Solved question papers from past UPSC examinations',
      icon: GraduationCap,
      color: 'purple',
      count: 85,
      href: '/resources/papers'
    },
    {
      id: 'guides',
      title: 'Study Guides',
      description: 'Strategy guides, preparation tips, and expert advice',
      icon: Map,
      color: 'orange',
      count: 75,
      href: '/resources/guides'
    }
  ];

  const featuredResources = [
    {
      title: 'Complete NCERT Collection',
      description: 'All NCERT books from Class 6-12 with chapter-wise notes and summaries',
      category: 'Study Materials',
      subject: 'General Studies',
      downloads: '25.4k',
      rating: 4.9,
      updated: '2 days ago',
      isPremium: false,
      tags: ['NCERT', 'Foundation', 'Complete']
    },
    {
      title: 'Prelims 2024 Mock Test Series',
      description: '50 full-length mock tests with detailed solutions and performance analysis',
      category: 'Mock Tests',
      subject: 'Prelims',
      downloads: '18.7k',
      rating: 4.8,
      updated: '1 week ago',
      isPremium: true,
      tags: ['Prelims', 'Mock Tests', '2024']
    },
    {
      title: 'Current Affairs January 2024',
      description: 'Monthly compilation with UPSC relevance analysis and practice questions',
      category: 'Current Affairs',
      subject: 'General Studies',
      downloads: '32.1k',
      rating: 4.7,
      updated: '3 days ago',
      isPremium: false,
      tags: ['Monthly', 'Analysis', 'Questions']
    },
    {
      title: 'Mains Answer Writing Guide',
      description: 'Comprehensive guide with sample answers and evaluation criteria',
      category: 'Study Guides',
      subject: 'Mains',
      downloads: '15.3k',
      rating: 4.9,
      updated: '1 week ago',
      isPremium: true,
      tags: ['Mains', 'Writing', 'Strategy']
    },
    {
      title: 'Geography Atlas & Maps',
      description: 'Interactive maps and geographical data for UPSC preparation',
      category: 'Study Materials',
      subject: 'Geography',
      downloads: '22.8k',
      rating: 4.6,
      updated: '5 days ago',
      isPremium: false,
      tags: ['Geography', 'Maps', 'Visual']
    },
    {
      title: 'Ethics Case Studies Collection',
      description: '100+ case studies with model answers for Ethics paper',
      category: 'Study Materials',
      subject: 'Ethics',
      downloads: '12.9k',
      rating: 4.8,
      updated: '1 week ago',
      isPremium: true,
      tags: ['Ethics', 'Case Studies', 'Mains']
    }
  ];

  const subjects = [
    'General Studies', 'History', 'Geography', 'Polity', 'Economics',
    'Science & Technology', 'Environment', 'Ethics', 'Prelims', 'Mains'
  ];

  const stats = [
    { label: 'Total Resources', value: '1,095' },
    { label: 'Downloads This Month', value: '156k' },
    { label: 'Active Contributors', value: '2,400' },
    { label: 'Success Stories', value: '850+' }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-600',
      green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-600',
      red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-600',
      purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-600',
      orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            UPSC Study
            <span className="text-blue-600 dark:text-blue-400"> Resources</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Access thousands of curated study materials, mock tests, current affairs, 
            and expert guides to accelerate your UPSC preparation.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search resources, topics, or subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All Resources
            </button>
            {resourceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
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

      {/* Resource Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Find exactly what you need for your preparation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourceCategories.map((category) => (
              <a
                key={category.id}
                href={category.href}
                className={`p-6 rounded-lg border-2 hover:shadow-lg transition-all ${getColorClasses(category.color)}`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`p-3 rounded-lg bg-white dark:bg-gray-800`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {category.title}
                    </h3>
                    <span className="text-sm text-gray-500">{category.count} resources</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Explore Collection</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Resources
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Most popular and highly-rated study materials
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredResources.map((resource, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 px-2 py-1 rounded">
                      {resource.category}
                    </span>
                    {resource.isPremium && (
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 px-2 py-1 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{resource.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {resource.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>{resource.downloads}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{resource.updated}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    {resource.isPremium ? 'Upgrade to Access' : 'Download Free'}
                  </button>
                  <button className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/resources/materials"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Resources
              <ChevronRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Access Premium Resources
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Unlock exclusive study materials, detailed solutions, and expert guidance with our Pro plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup?plan=pro" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Upgrade to Pro
            </a>
            <a 
              href="/pricing" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
