'use client';

import { useState } from 'react';
import { 
  GraduationCap, Download, Calendar, FileText, Search,
  Filter, Star, Clock, Users, TrendingUp, Award,
  Eye, Play, BookOpen
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function PreviousPapersPage() {
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedExam, setSelectedExam] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const years = ['2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];
  const examTypes = ['Prelims', 'Mains', 'Interview'];
  const subjects = ['GS Paper 1', 'GS Paper 2', 'GS Paper 3', 'GS Paper 4', 'CSAT', 'Optional'];

  const papers = [
    {
      id: 1,
      title: 'UPSC Prelims 2023 - General Studies Paper 1',
      year: '2023',
      exam: 'Prelims',
      subject: 'GS Paper 1',
      date: '2023-05-28',
      questions: 100,
      duration: 120,
      downloads: 45200,
      rating: 4.9,
      hasAnswerKey: true,
      hasSolutions: true,
      isPremium: false,
      difficulty: 'Medium',
      tags: ['Latest', 'Complete Solutions', 'Answer Key']
    },
    {
      id: 2,
      title: 'UPSC Mains 2023 - General Studies Paper 1',
      year: '2023',
      exam: 'Mains',
      subject: 'GS Paper 1',
      date: '2023-09-15',
      questions: 20,
      duration: 180,
      downloads: 32100,
      rating: 4.8,
      hasAnswerKey: false,
      hasSolutions: true,
      isPremium: true,
      difficulty: 'Hard',
      tags: ['Mains', 'Model Answers', 'Expert Analysis']
    },
    {
      id: 3,
      title: 'UPSC Prelims 2022 - CSAT Paper 2',
      year: '2022',
      exam: 'Prelims',
      subject: 'CSAT',
      date: '2022-06-05',
      questions: 80,
      duration: 120,
      downloads: 28750,
      rating: 4.7,
      hasAnswerKey: true,
      hasSolutions: true,
      isPremium: false,
      difficulty: 'Medium',
      tags: ['CSAT', 'Quantitative', 'Reasoning']
    }
  ];

  const stats = [
    { label: 'Question Papers', value: '85+' },
    { label: 'Years Covered', value: '15+' },
    { label: 'Total Downloads', value: '2.5M+' },
    { label: 'Success Rate', value: '78%' }
  ];

  const features = [
    {
      icon: FileText,
      title: 'Original Papers',
      description: 'Authentic question papers exactly as they appeared in the actual UPSC examinations.'
    },
    {
      icon: BookOpen,
      title: 'Detailed Solutions',
      description: 'Comprehensive solutions with explanations for better understanding and learning.'
    },
    {
      icon: TrendingUp,
      title: 'Trend Analysis',
      description: 'Identify patterns and frequently asked topics across different years and papers.'
    },
    {
      icon: Award,
      title: 'Expert Commentary',
      description: 'Insights from toppers and subject experts on approach and strategy for each paper.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Previous Year Papers
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Access authentic UPSC question papers from previous years with detailed solutions, 
              answer keys, and expert analysis to understand exam patterns.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search papers..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              <option value="all">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              <option value="all">All Exams</option>
              {examTypes.map((exam) => (
                <option key={exam} value={exam}>{exam}</option>
              ))}
            </select>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              <option value="all">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Papers Grid */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Question Papers ({papers.length})
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
              <select className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm">
                <option>Latest First</option>
                <option>Most Downloaded</option>
                <option>Highest Rated</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper) => (
              <div key={paper.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-600 px-2 py-1 rounded">
                      {paper.year}
                    </span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 px-2 py-1 rounded">
                      {paper.exam}
                    </span>
                    {paper.isPremium && (
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 px-2 py-1 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{paper.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {paper.title}
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{paper.questions}</div>
                    <div className="text-xs text-gray-500">Questions</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{paper.duration}</div>
                    <div className="text-xs text-gray-500">Minutes</div>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {paper.hasAnswerKey && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 px-2 py-1 rounded">
                      Answer Key
                    </span>
                  )}
                  {paper.hasSolutions && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 px-2 py-1 rounded">
                      Solutions
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded ${
                    paper.difficulty === 'Easy' ? 'bg-green-100 text-green-600' :
                    paper.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {paper.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(paper.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span>{paper.downloads.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                    {paper.isPremium ? 'Upgrade to Access' : 'Download Free'}
                  </button>
                  <button className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  {paper.hasSolutions && (
                    <button className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                      <Play className="h-4 w-4" />
                    </button>
                  )}
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
            Why Practice with Previous Papers?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-purple-600" />
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

      {/* Year-wise Analysis */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Year-wise Analysis
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                2023 Trends
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Increased focus on current affairs</li>
                <li>• More application-based questions</li>
                <li>• Technology and governance emphasis</li>
                <li>• Environmental issues prominence</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                2022 Patterns
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• International relations focus</li>
                <li>• Economic survey questions</li>
                <li>• Science & technology updates</li>
                <li>• Art and culture emphasis</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Overall Trends
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Consistent NCERT importance</li>
                <li>• Current affairs integration</li>
                <li>• Analytical thinking required</li>
                <li>• Multi-dimensional questions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Master the UPSC Pattern
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Practice with authentic previous year papers and understand the exam pattern better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Practicing
            </a>
            <a 
              href="/pricing" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-colors"
            >
              Get Premium Access
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
