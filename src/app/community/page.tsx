'use client';

import { useState } from 'react';
import { 
  Users, MessageSquare, TrendingUp, Award, Clock, Eye,
  ThumbsUp, MessageCircle, Search, Filter, Plus, Star,
  BookOpen, Target, Calendar, User, ArrowRight
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Discussions', count: 1250 },
    { id: 'general', name: 'General Discussion', count: 420 },
    { id: 'study-tips', name: 'Study Tips', count: 380 },
    { id: 'current-affairs', name: 'Current Affairs', count: 290 },
    { id: 'doubt-clearing', name: 'Doubt Clearing', count: 160 }
  ];

  const discussions = [
    {
      id: 1,
      title: 'Best strategy for Prelims 2024 preparation',
      author: 'Priya Sharma',
      authorRank: 'AIR 45 (2023)',
      category: 'study-tips',
      replies: 24,
      views: 1250,
      likes: 89,
      lastActivity: '2 hours ago',
      isPinned: true,
      tags: ['Prelims', 'Strategy', 'Time Management']
    },
    {
      id: 2,
      title: 'Current Affairs compilation for January 2024',
      author: 'Rahul Kumar',
      authorRank: 'Mentor',
      category: 'current-affairs',
      replies: 15,
      views: 890,
      likes: 67,
      lastActivity: '4 hours ago',
      isPinned: false,
      tags: ['Current Affairs', 'Monthly', 'Compilation']
    },
    {
      id: 3,
      title: 'How to improve answer writing for Mains?',
      author: 'Sneha Patel',
      authorRank: 'AIR 12 (2022)',
      category: 'study-tips',
      replies: 32,
      views: 1580,
      likes: 124,
      lastActivity: '6 hours ago',
      isPinned: false,
      tags: ['Mains', 'Answer Writing', 'Practice']
    },
    {
      id: 4,
      title: 'Doubt: Constitutional provisions related to emergency',
      author: 'Amit Singh',
      authorRank: 'Student',
      category: 'doubt-clearing',
      replies: 8,
      views: 340,
      likes: 23,
      lastActivity: '1 day ago',
      isPinned: false,
      tags: ['Constitution', 'Emergency', 'Polity']
    }
  ];

  const topContributors = [
    {
      name: 'Dr. Rajesh Kumar',
      rank: 'AIR 1 (2021)',
      posts: 156,
      helpfulAnswers: 89,
      reputation: 2450,
      avatar: '👨‍🏫'
    },
    {
      name: 'Priya Sharma',
      rank: 'AIR 45 (2023)',
      posts: 124,
      helpfulAnswers: 76,
      reputation: 1890,
      avatar: '👩‍💼'
    },
    {
      name: 'Vikram Joshi',
      rank: 'AIR 23 (2022)',
      posts: 98,
      helpfulAnswers: 65,
      reputation: 1650,
      avatar: '👨‍💻'
    }
  ];

  const communityStats = [
    { label: 'Active Members', value: '15,000+' },
    { label: 'Discussions', value: '1,250' },
    { label: 'Questions Answered', value: '8,500+' },
    { label: 'Success Stories', value: '450+' }
  ];

  const filteredDiscussions = discussions.filter(discussion => 
    (selectedCategory === 'all' || discussion.category === selectedCategory) &&
    (searchQuery === '' || discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              UPSC Community
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Connect with fellow UPSC aspirants, share knowledge, get your doubts cleared, 
              and learn from successful candidates and mentors.
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {communityStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search discussions, topics, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Start Discussion
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Discussions List */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recent Discussions
              </h2>
              
              {filteredDiscussions.map((discussion) => (
                <div key={discussion.id} className="bg-white dark:bg-gray-900 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {discussion.isPinned && (
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 px-2 py-1 rounded">
                          Pinned
                        </span>
                      )}
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-600 px-2 py-1 rounded">
                        {categories.find(c => c.id === discussion.category)?.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{discussion.lastActivity}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-purple-600 cursor-pointer">
                    {discussion.title}
                  </h3>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {discussion.author}
                      </span>
                      <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 px-2 py-1 rounded">
                        {discussion.authorRank}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {discussion.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{discussion.replies} replies</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{discussion.views} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{discussion.likes} likes</span>
                      </div>
                    </div>
                    <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center">
                      Join Discussion
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredDiscussions.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No discussions found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Try adjusting your search or browse different categories.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Top Contributors */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Award className="mr-2 h-5 w-5 text-purple-600" />
                  Top Contributors
                </h3>
                <div className="space-y-4">
                  {topContributors.map((contributor, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="text-2xl">{contributor.avatar}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {contributor.name}
                        </h4>
                        <p className="text-xs text-green-600">{contributor.rank}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{contributor.posts} posts</span>
                          <span>•</span>
                          <span>{contributor.helpfulAnswers} helpful</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-purple-600">
                          {contributor.reputation}
                        </div>
                        <div className="text-xs text-gray-500">reputation</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Guidelines */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Community Guidelines
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Be respectful and supportive to fellow aspirants</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Share accurate information and cite sources</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Use clear titles and relevant tags</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Search before posting to avoid duplicates</span>
                  </li>
                </ul>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                    Ask a Question
                  </button>
                  <button className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">
                    Share Study Material
                  </button>
                  <button className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium">
                    Join Study Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Connect with 15,000+ UPSC aspirants and learn from successful candidates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Join Community
            </a>
            <a 
              href="/chat" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-colors"
            >
              Start Chatting
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
