'use client';

import { useState } from 'react';
import { 
  BookOpen, Download, Star, Filter, Search, Grid, List,
  Clock, Users, Tag, ChevronDown, ExternalLink, Eye
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function StudyMaterialsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const subjects = [
    'History', 'Geography', 'Polity', 'Economics', 'Science & Technology',
    'Environment', 'Ethics', 'International Relations', 'Internal Security'
  ];

  const materialTypes = [
    'NCERT Books', 'Reference Books', 'Notes', 'Mind Maps', 
    'Infographics', 'Video Lectures', 'Audio Notes', 'Flashcards'
  ];

  const materials = [
    {
      id: 1,
      title: 'Complete NCERT History Collection',
      description: 'All NCERT History books from Class 6-12 with chapter summaries and important points',
      subject: 'History',
      type: 'NCERT Books',
      author: 'NCERT',
      pages: 1250,
      downloads: 25400,
      rating: 4.9,
      reviews: 1200,
      updated: '2 days ago',
      isPremium: false,
      tags: ['Ancient History', 'Medieval History', 'Modern History', 'Foundation'],
      thumbnail: '/images/ncert-history.jpg',
      fileSize: '45 MB'
    },
    {
      id: 2,
      title: 'Indian Geography Atlas & Maps',
      description: 'Comprehensive collection of maps, diagrams, and geographical data for UPSC preparation',
      subject: 'Geography',
      type: 'Reference Books',
      author: 'Dr. Khullar',
      pages: 850,
      downloads: 18700,
      rating: 4.8,
      reviews: 890,
      updated: '1 week ago',
      isPremium: true,
      tags: ['Physical Geography', 'Human Geography', 'Economic Geography', 'Maps'],
      thumbnail: '/images/geography-atlas.jpg',
      fileSize: '120 MB'
    },
    {
      id: 3,
      title: 'Polity Notes by Laxmikanth',
      description: 'Detailed notes covering Indian Constitution, governance, and political system',
      subject: 'Polity',
      type: 'Notes',
      author: 'M. Laxmikanth',
      pages: 650,
      downloads: 32100,
      rating: 4.9,
      reviews: 1500,
      updated: '3 days ago',
      isPremium: false,
      tags: ['Constitution', 'Governance', 'Parliament', 'Judiciary'],
      thumbnail: '/images/polity-notes.jpg',
      fileSize: '25 MB'
    },
    {
      id: 4,
      title: 'Economics Mind Maps Collection',
      description: 'Visual mind maps covering micro and macro economics concepts for quick revision',
      subject: 'Economics',
      type: 'Mind Maps',
      author: 'EconoMind Team',
      pages: 200,
      downloads: 15300,
      rating: 4.7,
      reviews: 650,
      updated: '5 days ago',
      isPremium: true,
      tags: ['Microeconomics', 'Macroeconomics', 'Indian Economy', 'Visual Learning'],
      thumbnail: '/images/economics-mindmaps.jpg',
      fileSize: '15 MB'
    },
    {
      id: 5,
      title: 'Science & Technology Compilation',
      description: 'Latest developments in science and technology with UPSC relevance analysis',
      subject: 'Science & Technology',
      type: 'Notes',
      author: 'TechPrep Team',
      pages: 400,
      downloads: 22800,
      rating: 4.6,
      reviews: 780,
      updated: '1 week ago',
      isPremium: false,
      tags: ['Space Technology', 'Biotechnology', 'IT', 'Defense Technology'],
      thumbnail: '/images/science-tech.jpg',
      fileSize: '30 MB'
    },
    {
      id: 6,
      title: 'Environment & Ecology Infographics',
      description: 'Visual representation of environmental concepts, biodiversity, and climate change',
      subject: 'Environment',
      type: 'Infographics',
      author: 'EcoVision',
      pages: 150,
      downloads: 12900,
      rating: 4.8,
      reviews: 420,
      updated: '4 days ago',
      isPremium: true,
      tags: ['Biodiversity', 'Climate Change', 'Conservation', 'Pollution'],
      thumbnail: '/images/environment-infographics.jpg',
      fileSize: '50 MB'
    }
  ];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject;
    const matchesType = selectedType === 'all' || material.type === selectedType;
    
    return matchesSearch && matchesSubject && matchesType;
  });

  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'recent':
        return new Date(b.updated).getTime() - new Date(a.updated).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Study Materials
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Access comprehensive study materials including NCERT books, reference materials, 
              notes, and visual aids for all UPSC subjects.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search materials, topics, or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Subject Filter */}
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                {materialTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Sort and View Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {sortedMaterials.length} materials found
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-900 dark:text-white"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="recent">Recently Updated</option>
                  <option value="title">Alphabetical</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Materials Grid/List */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedMaterials.map((material) => (
                <div key={material.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Thumbnail */}
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 px-2 py-1 rounded">
                          {material.subject}
                        </span>
                        {material.isPremium && (
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 px-2 py-1 rounded">
                            Premium
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{material.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {material.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                      {material.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {material.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {material.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{material.tags.length - 3}</span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>{material.downloads.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{material.updated}</span>
                        </div>
                      </div>
                      <span className="text-xs">{material.fileSize}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        {material.isPremium ? 'Upgrade to Access' : 'Download Free'}
                      </button>
                      <button className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedMaterials.map((material) => (
                <div key={material.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-6">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 px-2 py-1 rounded">
                              {material.subject}
                            </span>
                            <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                              {material.type}
                            </span>
                            {material.isPremium && (
                              <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 px-2 py-1 rounded">
                                Premium
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                            {material.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-2">
                            {material.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            By {material.author} • {material.pages} pages • {material.fileSize}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{material.rating}</span>
                          <span className="text-sm text-gray-500">({material.reviews})</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Download className="h-4 w-4" />
                            <span>{material.downloads.toLocaleString()} downloads</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>Updated {material.updated}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            {material.isPremium ? 'Upgrade to Access' : 'Download Free'}
                          </button>
                          <button className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {sortedMaterials.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No materials found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
