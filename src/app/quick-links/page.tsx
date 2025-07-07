'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, BookOpen, FileText, Video, Globe, Users, Calendar, TrendingUp, Search, Star, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface QuickLink {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  icon: string;
  isOfficial?: boolean;
  isFavorite?: boolean;
}

export default function QuickLinksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const getDefaultQuickLinks = (): QuickLink[] => [
    // Official UPSC Resources
    {
      id: '1',
      title: 'UPSC Official Website',
      description: 'Official UPSC portal for notifications, syllabus, and exam updates',
      url: 'https://www.upsc.gov.in',
      category: 'Official',
      icon: 'globe',
      isOfficial: true
    },
    {
      id: '2',
      title: 'UPSC Syllabus',
      description: 'Complete official syllabus for Prelims and Mains',
      url: 'https://www.upsc.gov.in/examinations/syllabus',
      category: 'Official',
      icon: 'fileText',
      isOfficial: true
    },
    {
      id: '3',
      title: 'Previous Year Papers',
      description: 'Download previous year question papers',
      url: 'https://www.upsc.gov.in/examinations/previous-question-papers',
      category: 'Official',
      icon: 'fileText',
      isOfficial: true
    },

    // Study Materials
    {
      id: '4',
      title: 'NCERT Books Online',
      description: 'Free NCERT textbooks for all classes',
      url: 'https://ncert.nic.in/textbook.php',
      category: 'Study Materials',
      icon: 'bookOpen'
    },
    {
      id: '5',
      title: 'PIB (Press Information Bureau)',
      description: 'Government press releases and current affairs',
      url: 'https://pib.gov.in',
      category: 'Current Affairs',
      icon: 'globe'
    },
    {
      id: '6',
      title: 'PRS Legislative Research',
      description: 'Policy analysis and legislative updates',
      url: 'https://prsindia.org',
      category: 'Current Affairs',
      icon: 'fileText'
    },

    // News Sources
    {
      id: '7',
      title: 'The Hindu',
      description: 'Daily newspaper for current affairs',
      url: 'https://www.thehindu.com',
      category: 'News',
      icon: 'globe'
    },
    {
      id: '8',
      title: 'Indian Express',
      description: 'National daily newspaper',
      url: 'https://indianexpress.com',
      category: 'News',
      icon: 'globe'
    },
    {
      id: '9',
      title: 'Rajya Sabha TV',
      description: 'Educational programs and debates',
      url: 'https://www.youtube.com/user/rajyasabhatv',
      category: 'Video Resources',
      icon: 'video'
    },

    // Government Portals
    {
      id: '10',
      title: 'India.gov.in',
      description: 'National portal of India',
      url: 'https://www.india.gov.in',
      category: 'Government',
      icon: 'globe'
    },
    {
      id: '11',
      title: 'Economic Survey',
      description: 'Annual economic survey reports',
      url: 'https://www.indiabudget.gov.in/economicsurvey/',
      category: 'Government',
      icon: 'trendingUp'
    },
    {
      id: '12',
      title: 'Census of India',
      description: 'Demographic data and statistics',
      url: 'https://censusindia.gov.in',
      category: 'Government',
      icon: 'users'
    },

    // Online Learning
    {
      id: '13',
      title: 'SWAYAM',
      description: 'Government of India study platform',
      url: 'https://swayam.gov.in',
      category: 'Online Learning',
      icon: 'video'
    },
    {
      id: '14',
      title: 'DIKSHA',
      description: 'Digital learning platform',
      url: 'https://diksha.gov.in',
      category: 'Online Learning',
      icon: 'video'
    },

    // Test Series & Practice
    {
      id: '15',
      title: 'UPSC Mock Tests',
      description: 'Free mock tests and practice papers',
      url: 'https://www.freejobalert.com/upsc-mock-test/',
      category: 'Test Series',
      icon: 'fileText'
    },

    // Maps & Geography
    {
      id: '16',
      title: 'Survey of India Maps',
      description: 'Official maps and geographical data',
      url: 'https://www.surveyofindia.gov.in',
      category: 'Geography',
      icon: 'globe'
    },

    // Science & Technology
    {
      id: '17',
      title: 'ISRO',
      description: 'Indian Space Research Organisation',
      url: 'https://www.isro.gov.in',
      category: 'Science & Technology',
      icon: 'globe'
    },
    {
      id: '18',
      title: 'DST',
      description: 'Department of Science & Technology',
      url: 'https://dst.gov.in',
      category: 'Science & Technology',
      icon: 'globe'
    }
  ];

  // Load data on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLinks = localStorage.getItem('upsc-quick-links');
      const savedFavorites = localStorage.getItem('upsc-quick-links-favorites');

      if (savedLinks) {
        try {
          setQuickLinks(JSON.parse(savedLinks));
        } catch (error) {
          console.error('Error loading quick links:', error);
          setQuickLinks(getDefaultQuickLinks());
        }
      } else {
        setQuickLinks(getDefaultQuickLinks());
      }

      if (savedFavorites) {
        try {
          setFavorites(new Set(JSON.parse(savedFavorites)));
        } catch (error) {
          console.error('Error loading favorites:', error);
        }
      }

      setIsLoaded(true);
    }
  }, []);

  const saveQuickLinks = (links: QuickLink[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-quick-links', JSON.stringify(links));
    }
  };

  const saveFavorites = (favs: Set<string>) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-quick-links-favorites', JSON.stringify(Array.from(favs)));
    }
  };

  const categories = ['All', ...Array.from(new Set(quickLinks.map(link => link.category)))];

  const filteredLinks = quickLinks.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || link.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const addQuickLink = (newLink: Omit<QuickLink, 'id'>) => {
    const link: QuickLink = {
      ...newLink,
      id: Date.now().toString(),
    };
    const updatedLinks = [...quickLinks, link];
    setQuickLinks(updatedLinks);
    saveQuickLinks(updatedLinks);
    setShowAddForm(false);
    toast.success('Quick link added successfully!');
  };

  const updateQuickLink = (updatedLink: QuickLink | Omit<QuickLink, 'id'>) => {
    // If it's a partial link (missing id), it means we're editing an existing link
    const fullLink = 'id' in updatedLink ? updatedLink : { ...editingLink!, ...updatedLink };

    const updatedLinks = quickLinks.map(link =>
      link.id === fullLink.id ? fullLink : link
    );
    setQuickLinks(updatedLinks);
    saveQuickLinks(updatedLinks);
    setEditingLink(null);
    toast.success('Quick link updated successfully!');
  };

  const deleteQuickLink = (id: string) => {
    const updatedLinks = quickLinks.filter(link => link.id !== id);
    setQuickLinks(updatedLinks);
    saveQuickLinks(updatedLinks);

    // Remove from favorites if it exists
    const newFavorites = new Set(favorites);
    newFavorites.delete(id);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);

    toast.success('Quick link deleted successfully!');
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'bookOpen': return <BookOpen className="h-5 w-5" />;
      case 'fileText': return <FileText className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'globe': return <Globe className="h-5 w-5" />;
      case 'users': return <Users className="h-5 w-5" />;
      case 'calendar': return <Calendar className="h-5 w-5" />;
      case 'trendingUp': return <TrendingUp className="h-5 w-5" />;
      default: return <ExternalLink className="h-5 w-5" />;
    }
  };

  const iconOptions = [
    { value: 'globe', label: 'Globe' },
    { value: 'bookOpen', label: 'Book' },
    { value: 'fileText', label: 'Document' },
    { value: 'video', label: 'Video' },
    { value: 'users', label: 'Users' },
    { value: 'calendar', label: 'Calendar' },
    { value: 'trendingUp', label: 'Trending' },
    { value: 'externalLink', label: 'Link' }
  ];

  const QuickLinkForm = ({
    link,
    onSave,
    onCancel
  }: {
    link?: QuickLink;
    onSave: (link: Omit<QuickLink, 'id'> | QuickLink) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      title: link?.title || '',
      description: link?.description || '',
      url: link?.url || '',
      category: link?.category || 'Custom',
      icon: link?.icon || 'globe',
      isOfficial: link?.isOfficial || false
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.title || !formData.url) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (link) {
        onSave({ ...link, ...formData });
      } else {
        onSave(formData);
      }
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {link ? 'Edit Quick Link' : 'Add New Quick Link'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL *
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter category"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {iconOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder="Enter description"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isOfficial"
              checked={formData.isOfficial}
              onChange={(e) => setFormData({ ...formData, isOfficial: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isOfficial" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Mark as official resource
            </label>
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {link ? 'Update' : 'Add'} Link
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Show loading state until data is loaded
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading quick links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quick Links</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Essential resources and websites for UPSC preparation - all in one place.
        </p>
      </div>

      {/* Search, Filter, and Add Button */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingLink) && (
        <QuickLinkForm
          link={editingLink || undefined}
          onSave={editingLink ? updateQuickLink : addQuickLink}
          onCancel={() => {
            setShowAddForm(false);
            setEditingLink(null);
          }}
        />
      )}

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLinks.map((link) => (
          <div key={link.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  link.isOfficial 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                }`}>
                  {getIcon(link.icon)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    {link.title}
                    {link.isOfficial && (
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full dark:bg-green-900/20 dark:text-green-400">
                        Official
                      </span>
                    )}
                  </h3>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => toggleFavorite(link.id)}
                  className={`p-1 rounded transition-colors ${
                    favorites.has(link.id)
                      ? 'text-yellow-500'
                      : 'text-gray-400 hover:text-yellow-500'
                  }`}
                >
                  <Star className={`h-4 w-4 ${favorites.has(link.id) ? 'fill-current' : ''}`} />
                </button>
                {!link.isOfficial && (
                  <>
                    <button
                      onClick={() => setEditingLink(link)}
                      className="p-1 rounded transition-colors text-gray-400 hover:text-blue-500"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteQuickLink(link.id)}
                      className="p-1 rounded transition-colors text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {link.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded dark:bg-gray-700 dark:text-gray-400">
                {link.category}
              </span>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Visit
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredLinks.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No resources found matching your search criteria.
        </div>
      )}
    </div>
  );
}
