'use client';

import { useState } from 'react';
import { 
  Map, Compass, Target, BookOpen, Users, Star,
  Clock, Download, Search, Filter, TrendingUp,
  Award, Lightbulb, CheckCircle, ArrowRight
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function StudyGuidesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const categories = [
    'Strategy', 'Subject-wise', 'Time Management', 'Answer Writing', 
    'Interview Preparation', 'Revision Techniques', 'Motivation'
  ];

  const guides = [
    {
      id: 1,
      title: 'Complete UPSC Preparation Strategy 2024',
      description: 'Comprehensive guide covering all stages of UPSC preparation from beginner to advanced level',
      category: 'Strategy',
      level: 'Beginner',
      author: 'Dr. Rajesh Kumar (IAS)',
      readTime: 45,
      downloads: 28500,
      rating: 4.9,
      chapters: 12,
      isPremium: false,
      tags: ['Complete Guide', 'Strategy', 'Beginner Friendly'],
      highlights: [
        'Step-by-step preparation roadmap',
        'Subject-wise study plan',
        'Time management techniques',
        'Resource recommendations'
      ]
    },
    {
      id: 2,
      title: 'Mains Answer Writing Masterclass',
      description: 'Expert techniques for writing high-scoring answers in UPSC Mains examination',
      category: 'Answer Writing',
      level: 'Intermediate',
      author: 'Priya Sharma (IAS Rank 12)',
      readTime: 30,
      downloads: 22100,
      rating: 4.8,
      chapters: 8,
      isPremium: true,
      tags: ['Mains', 'Answer Writing', 'Scoring Techniques'],
      highlights: [
        'Answer structure templates',
        'Keyword integration methods',
        'Diagram and flowchart usage',
        'Time management in exam'
      ]
    },
    {
      id: 3,
      title: 'Interview Preparation Complete Guide',
      description: 'Comprehensive preparation strategy for UPSC personality test with mock interview tips',
      category: 'Interview Preparation',
      level: 'Advanced',
      author: 'Amit Singh (IAS Rank 5)',
      readTime: 25,
      downloads: 15750,
      rating: 4.7,
      chapters: 6,
      isPremium: true,
      tags: ['Interview', 'Personality Test', 'Communication'],
      highlights: [
        'Common interview questions',
        'Body language tips',
        'Current affairs discussion',
        'Mock interview strategies'
      ]
    },
    {
      id: 4,
      title: 'Effective Revision Techniques',
      description: 'Proven methods for quick and effective revision during the final months of preparation',
      category: 'Revision Techniques',
      level: 'Intermediate',
      author: 'Study Team',
      readTime: 20,
      downloads: 19200,
      rating: 4.6,
      chapters: 5,
      isPremium: false,
      tags: ['Revision', 'Quick Review', 'Memory Techniques'],
      highlights: [
        'Active recall methods',
        'Spaced repetition system',
        'Mind mapping techniques',
        'Last-minute preparation'
      ]
    }
  ];

  const successStories = [
    {
      name: 'Rahul Verma',
      rank: 'AIR 15',
      year: '2023',
      quote: 'The strategy guides helped me structure my preparation effectively. The time management techniques were game-changers.',
      guide: 'Complete UPSC Preparation Strategy'
    },
    {
      name: 'Sneha Patel',
      rank: 'AIR 42',
      year: '2023',
      quote: 'Answer writing guide transformed my Mains performance. Scored 140+ in all GS papers using these techniques.',
      guide: 'Mains Answer Writing Masterclass'
    }
  ];

  const features = [
    {
      icon: Target,
      title: 'Goal-Oriented Approach',
      description: 'Each guide is designed with specific learning objectives and measurable outcomes.'
    },
    {
      icon: Users,
      title: 'Expert Authors',
      description: 'Written by successful IAS officers and experienced mentors with proven track records.'
    },
    {
      icon: TrendingUp,
      title: 'Updated Content',
      description: 'Regularly updated to reflect latest exam patterns and UPSC requirements.'
    },
    {
      icon: Award,
      title: 'Proven Results',
      description: 'Thousands of successful candidates have used these guides to clear UPSC.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Study Guides & Strategy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Expert-crafted study guides, preparation strategies, and proven techniques 
              from successful UPSC candidates and experienced mentors.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">75+</div>
              <div className="text-gray-600 dark:text-gray-400">Study Guides</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400">Success Stories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">4.8★</div>
              <div className="text-gray-600 dark:text-gray-400">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">85%</div>
              <div className="text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search guides, strategies, or topics..."
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

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </section>

      {/* Study Guides Grid */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {guides.map((guide) => (
              <div key={guide.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-600 px-2 py-1 rounded">
                      {guide.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      guide.level === 'Beginner' ? 'bg-green-100 text-green-600' :
                      guide.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {guide.level}
                    </span>
                    {guide.isPremium && (
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 px-2 py-1 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{guide.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {guide.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {guide.description}
                </p>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Key Highlights:</h4>
                  <ul className="space-y-1">
                    {guide.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{guide.chapters}</div>
                    <div className="text-xs text-gray-500">Chapters</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{guide.readTime}</div>
                    <div className="text-xs text-gray-500">Min Read</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{guide.downloads.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Downloads</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>By {guide.author}</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Updated recently</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                    {guide.isPremium ? 'Upgrade to Access' : 'Read Guide'}
                  </button>
                  <button className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Success Stories
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mr-4">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{story.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{story.rank} - {story.year}</p>
                  </div>
                </div>
                <blockquote className="text-gray-600 dark:text-gray-300 italic mb-4">
                  "{story.quote}"
                </blockquote>
                <p className="text-sm text-orange-600 font-medium">
                  Used: {story.guide}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Why Choose Our Study Guides?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-orange-600" />
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

      {/* Quick Tips Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Quick Preparation Tips
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Lightbulb className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Start Early</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Begin your preparation at least 12-15 months before the exam. Consistent daily study is more effective than intensive last-minute preparation.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Target className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Set Clear Goals</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Define specific, measurable goals for each subject and track your progress regularly. Break down the syllabus into manageable chunks.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <BookOpen className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Quality Resources</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Focus on quality over quantity. Stick to standard books and reliable sources. Avoid information overload from too many resources.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Clock className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Regular Revision</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Implement a systematic revision schedule. Review previously studied topics regularly to ensure long-term retention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-amber-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Start Your Success Journey Today
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Access expert study guides and proven strategies used by thousands of successful UPSC candidates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Free Guides
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a 
              href="/pricing" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-orange-600 transition-colors"
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
