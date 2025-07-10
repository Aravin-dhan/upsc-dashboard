'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Globe,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Tag,
  Calendar,
  BarChart3,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RSSFeed {
  id: string;
  name: string;
  url: string;
  category: string;
  isActive: boolean;
  lastFetched?: string;
  articleCount: number;
  errorCount: number;
  tags: string[];
  description?: string;
  fetchInterval: number; // in minutes
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

interface RSSFeedManagerProps {
  onFeedUpdate?: (feeds: RSSFeed[]) => void;
}

export default function RSSFeedManager({ onFeedUpdate }: RSSFeedManagerProps) {
  const [feeds, setFeeds] = useState<RSSFeed[]>([]);
  const [filteredFeeds, setFilteredFeeds] = useState<RSSFeed[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFeed, setEditingFeed] = useState<RSSFeed | null>(null);
  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [newFeed, setNewFeed] = useState({
    name: '',
    url: '',
    category: 'General',
    description: '',
    tags: '',
    fetchInterval: 60,
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const categories = [
    'General', 'National', 'International', 'Editorial', 'Opinion',
    'Business', 'Science & Technology', 'Environment', 'Sports',
    'Culture', 'Government Schemes', 'Economy', 'Defense', 'Custom'
  ];

  useEffect(() => {
    loadFeeds();
  }, []);

  useEffect(() => {
    filterFeeds();
  }, [feeds, searchTerm, categoryFilter, statusFilter]);

  const loadFeeds = () => {
    try {
      const savedFeeds = localStorage.getItem('upsc-rss-feeds');
      if (savedFeeds) {
        const parsedFeeds = JSON.parse(savedFeeds);
        setFeeds(parsedFeeds);
      } else {
        // Initialize with default feeds
        const defaultFeeds = getDefaultFeeds();
        setFeeds(defaultFeeds);
        saveFeeds(defaultFeeds);
      }
    } catch (error) {
      console.error('Error loading RSS feeds:', error);
      toast.error('Failed to load RSS feeds');
    }
  };

  const saveFeeds = (feedsToSave: RSSFeed[]) => {
    try {
      localStorage.setItem('upsc-rss-feeds', JSON.stringify(feedsToSave));
      if (onFeedUpdate) {
        onFeedUpdate(feedsToSave);
      }
    } catch (error) {
      console.error('Error saving RSS feeds:', error);
      toast.error('Failed to save RSS feeds');
    }
  };

  const getDefaultFeeds = (): RSSFeed[] => {
    return [
      {
        id: 'hindu-general',
        name: 'The Hindu - General',
        url: 'https://www.thehindu.com/feeder/default.rss',
        category: 'General',
        isActive: true,
        articleCount: 0,
        errorCount: 0,
        tags: ['news', 'general', 'upsc'],
        description: 'General news from The Hindu',
        fetchInterval: 30,
        priority: 'high',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'hindu-national',
        name: 'The Hindu - National',
        url: 'https://www.thehindu.com/news/national/feeder/default.rss',
        category: 'National',
        isActive: true,
        articleCount: 0,
        errorCount: 0,
        tags: ['national', 'india', 'upsc'],
        description: 'National news from The Hindu',
        fetchInterval: 30,
        priority: 'high',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'hindu-editorial',
        name: 'The Hindu - Editorial',
        url: 'https://www.thehindu.com/opinion/editorial/feeder/default.rss',
        category: 'Editorial',
        isActive: true,
        articleCount: 0,
        errorCount: 0,
        tags: ['editorial', 'opinion', 'analysis'],
        description: 'Editorial content from The Hindu',
        fetchInterval: 60,
        priority: 'high',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  };

  const filterFeeds = () => {
    let filtered = feeds;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(feed =>
        feed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feed.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feed.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feed.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(feed => feed.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(feed => feed.isActive);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(feed => !feed.isActive);
      } else if (statusFilter === 'error') {
        filtered = filtered.filter(feed => feed.errorCount > 0);
      }
    }

    setFilteredFeeds(filtered);
  };

  const addFeed = () => {
    if (!newFeed.name.trim() || !newFeed.url.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      new URL(newFeed.url); // Validate URL
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    const feed: RSSFeed = {
      id: `feed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newFeed.name,
      url: newFeed.url,
      category: newFeed.category,
      isActive: true,
      articleCount: 0,
      errorCount: 0,
      tags: newFeed.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      description: newFeed.description,
      fetchInterval: newFeed.fetchInterval,
      priority: newFeed.priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedFeeds = [...feeds, feed];
    setFeeds(updatedFeeds);
    saveFeeds(updatedFeeds);

    setNewFeed({
      name: '',
      url: '',
      category: 'General',
      description: '',
      tags: '',
      fetchInterval: 60,
      priority: 'medium'
    });
    setShowAddForm(false);
    toast.success('RSS feed added successfully!');
  };

  const updateFeed = (feedId: string, updates: Partial<RSSFeed>) => {
    const updatedFeeds = feeds.map(feed =>
      feed.id === feedId
        ? { ...feed, ...updates, updatedAt: new Date().toISOString() }
        : feed
    );
    setFeeds(updatedFeeds);
    saveFeeds(updatedFeeds);
    toast.success('Feed updated successfully!');
  };

  const deleteFeed = (feedId: string) => {
    if (!confirm('Are you sure you want to delete this RSS feed?')) {
      return;
    }

    const updatedFeeds = feeds.filter(feed => feed.id !== feedId);
    setFeeds(updatedFeeds);
    saveFeeds(updatedFeeds);
    toast.success('RSS feed deleted successfully!');
  };

  const toggleFeedStatus = (feedId: string) => {
    const feed = feeds.find(f => f.id === feedId);
    if (feed) {
      updateFeed(feedId, { isActive: !feed.isActive });
    }
  };

  const handleSelectFeed = (feedId: string) => {
    setSelectedFeeds(prev =>
      prev.includes(feedId)
        ? prev.filter(id => id !== feedId)
        : [...prev, feedId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFeeds.length === filteredFeeds.length) {
      setSelectedFeeds([]);
    } else {
      setSelectedFeeds(filteredFeeds.map(feed => feed.id));
    }
  };

  const bulkToggleStatus = (active: boolean) => {
    if (selectedFeeds.length === 0) return;

    const updatedFeeds = feeds.map(feed =>
      selectedFeeds.includes(feed.id)
        ? { ...feed, isActive: active, updatedAt: new Date().toISOString() }
        : feed
    );

    setFeeds(updatedFeeds);
    saveFeeds(updatedFeeds);
    setSelectedFeeds([]);
    toast.success(`${selectedFeeds.length} feeds ${active ? 'activated' : 'deactivated'}`);
  };

  const bulkDelete = () => {
    if (selectedFeeds.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedFeeds.length} RSS feeds?`)) {
      return;
    }

    const updatedFeeds = feeds.filter(feed => !selectedFeeds.includes(feed.id));
    setFeeds(updatedFeeds);
    saveFeeds(updatedFeeds);
    setSelectedFeeds([]);
    toast.success(`${selectedFeeds.length} feeds deleted`);
  };

  const exportFeeds = () => {
    const dataStr = JSON.stringify(feeds, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rss-feeds-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('RSS feeds exported successfully!');
  };

  const importFeeds = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedFeeds = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedFeeds)) {
          const mergedFeeds = [...feeds, ...importedFeeds];
          setFeeds(mergedFeeds);
          saveFeeds(mergedFeeds);
          toast.success(`${importedFeeds.length} feeds imported successfully!`);
        } else {
          toast.error('Invalid file format');
        }
      } catch (error) {
        toast.error('Failed to import feeds');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">RSS Feed Manager</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage RSS feeds for current affairs and news aggregation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept=".json"
            onChange={importFeeds}
            className="hidden"
            id="import-feeds"
          />
          <label
            htmlFor="import-feeds"
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </label>
          <button
            onClick={exportFeeds}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Feed
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search feeds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="error">Has Errors</option>
          </select>

          {/* Bulk Actions */}
          {selectedFeeds.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => bulkToggleStatus(true)}
                className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                Activate ({selectedFeeds.length})
              </button>
              <button
                onClick={() => bulkToggleStatus(false)}
                className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
              >
                Deactivate
              </button>
              <button
                onClick={bulkDelete}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}