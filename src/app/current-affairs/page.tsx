'use client';

import { useState, useEffect } from 'react';
import {
  Newspaper, ExternalLink, Search, Filter, Calendar,
  Tag, Star, Clock, TrendingUp, Globe,
  RefreshCw, Eye, Share2, Download, Bookmark
} from 'lucide-react';
import BookmarkButton from '@/components/ui/BookmarkButton';
import BookmarkService from '@/services/BookmarkService';
import toast from 'react-hot-toast';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  tags: string[];
  isBookmarked: boolean;
  isRead: boolean;
  upscRelevance: 'high' | 'medium' | 'low';
  syllabusTopics: string[];
}

interface Editorial {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  category: string;
  tags: string[];
  isBookmarked: boolean;
  isRead: boolean;
}

export default function CurrentAffairsPage() {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [editorials, setEditorials] = useState<Editorial[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'news' | 'editorials'>('news');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'relevance' | 'source'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [customRSSFeeds, setCustomRSSFeeds] = useState<string[]>([]);
  const [showAddRSSModal, setShowAddRSSModal] = useState(false);
  const [newRSSUrl, setNewRSSUrl] = useState('');

  const bookmarkService = BookmarkService.getInstance();

  // Load data on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedNews = localStorage.getItem('upsc-current-affairs-news');
      const savedEditorials = localStorage.getItem('upsc-current-affairs-editorials');
      const savedLastUpdated = localStorage.getItem('upsc-current-affairs-last-updated');

      if (savedNews) {
        try {
          setNewsArticles(JSON.parse(savedNews));
        } catch (error) {
          console.error('Error loading news:', error);
          setNewsArticles(getDefaultNews());
        }
      } else {
        setNewsArticles(getDefaultNews());
      }

      if (savedEditorials) {
        try {
          setEditorials(JSON.parse(savedEditorials));
        } catch (error) {
          console.error('Error loading editorials:', error);
          setEditorials(getDefaultEditorials());
        }
      } else {
        setEditorials(getDefaultEditorials());
      }

      if (savedLastUpdated) {
        setLastUpdated(savedLastUpdated);
      } else {
        setLastUpdated(new Date().toISOString());
      }
    }
  }, []);

  const getDefaultNews = (): NewsArticle[] => [];

  const getDefaultEditorials = (): Editorial[] => [];

  const saveData = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-current-affairs-news', JSON.stringify(newsArticles));
      localStorage.setItem('upsc-current-affairs-editorials', JSON.stringify(editorials));
      localStorage.setItem('upsc-current-affairs-last-updated', new Date().toISOString());
    }
  };

  // Save data whenever articles or editorials change
  useEffect(() => {
    if (newsArticles.length > 0 || editorials.length > 0) {
      saveData();
    }
  }, [newsArticles, editorials]);

  const toggleBookmark = (id: string, type: 'news' | 'editorial') => {
    if (type === 'news') {
      const updated = newsArticles.map(article =>
        article.id === id ? { ...article, isBookmarked: !article.isBookmarked } : article
      );
      setNewsArticles(updated);

      // Show feedback
      const article = updated.find(a => a.id === id);
      if (article) {
        toast.success(article.isBookmarked ? 'Article bookmarked!' : 'Bookmark removed');
      }
    } else {
      const updated = editorials.map(editorial =>
        editorial.id === id ? { ...editorial, isBookmarked: !editorial.isBookmarked } : editorial
      );
      setEditorials(updated);

      // Show feedback
      const editorial = updated.find(e => e.id === id);
      if (editorial) {
        toast.success(editorial.isBookmarked ? 'Editorial bookmarked!' : 'Bookmark removed');
      }
    }
  };

  const markAsRead = (id: string, type: 'news' | 'editorial') => {
    if (type === 'news') {
      const updated = newsArticles.map(article =>
        article.id === id ? { ...article, isRead: true } : article
      );
      setNewsArticles(updated);
    } else {
      const updated = editorials.map(editorial =>
        editorial.id === id ? { ...editorial, isRead: true } : editorial
      );
      setEditorials(updated);
    }
  };

  const addCustomRSSFeed = async () => {
    if (!newRSSUrl.trim()) {
      toast.error('Please enter a valid RSS URL');
      return;
    }

    try {
      // Validate URL format
      new URL(newRSSUrl);

      if (customRSSFeeds.includes(newRSSUrl)) {
        toast.error('This RSS feed is already added');
        return;
      }

      const updatedFeeds = [...customRSSFeeds, newRSSUrl];
      setCustomRSSFeeds(updatedFeeds);
      localStorage.setItem('upsc-custom-rss-feeds', JSON.stringify(updatedFeeds));

      setNewRSSUrl('');
      setShowAddRSSModal(false);
      toast.success('RSS feed added successfully!');

      // Optionally fetch articles from the new RSS feed
      // await fetchRSSFeed(newRSSUrl);
    } catch (error) {
      toast.error('Please enter a valid URL');
    }
  };

  const removeCustomRSSFeed = (feedUrl: string) => {
    const updatedFeeds = customRSSFeeds.filter(feed => feed !== feedUrl);
    setCustomRSSFeeds(updatedFeeds);
    localStorage.setItem('upsc-custom-rss-feeds', JSON.stringify(updatedFeeds));
    toast.success('RSS feed removed');
  };

  const deduplicateArticles = (articles: NewsArticle[]) => {
    const seen = new Set();
    return articles.filter(article => {
      // Create a unique key based on title and URL
      const key = `${article.title.toLowerCase().trim()}-${article.url}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  const fetchNewsData = async () => {
    try {
      const response = await fetch('/api/news/hindu-rss');
      const data = await response.json();

      if (data.success) {
        const deduplicatedArticles = deduplicateArticles(data.articles);
        setNewsArticles(deduplicatedArticles);
        return deduplicatedArticles;
      } else {
        throw new Error(data.error || 'Failed to fetch news');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to fetch news articles');
      return [];
    }
  };

  const deduplicateEditorials = (editorials: Editorial[]) => {
    const seen = new Set();
    return editorials.filter(editorial => {
      // Create a unique key based on title and URL
      const key = `${editorial.title.toLowerCase().trim()}-${editorial.url}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  const fetchEditorialData = async () => {
    try {
      const response = await fetch('/api/news/drishti-editorials');
      const data = await response.json();

      if (data.success) {
        const deduplicatedEditorials = deduplicateEditorials(data.editorials);
        setEditorials(deduplicatedEditorials);
        return deduplicatedEditorials;
      } else {
        throw new Error(data.error || 'Failed to fetch editorials');
      }
    } catch (error) {
      console.error('Error fetching editorials:', error);
      toast.error('Failed to fetch DrishtiIAS editorials');
      return [];
    }
  };

  const refreshContent = async () => {
    setIsLoading(true);
    try {
      const [newsData, editorialData] = await Promise.all([
        fetchNewsData(),
        fetchEditorialData()
      ]);

      setLastUpdated(new Date().toISOString());
      saveData();
      toast.success(`Content refreshed! Loaded ${newsData.length} articles and ${editorialData.length} editorials.`);
    } catch (error) {
      console.error('Error refreshing content:', error);
      toast.error('Failed to refresh content');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch data on component mount
  useEffect(() => {
    if (typeof window !== 'undefined' && newsArticles.length === 0 && editorials.length === 0) {
      refreshContent();
    }
  }, [newsArticles.length, editorials.length]);

  const categories = Array.from(new Set([
    ...newsArticles.map(article => article.category),
    ...editorials.map(editorial => editorial.category)
  ]));

  const sources = Array.from(new Set(newsArticles.map(article => article.source)));

  const filteredNews = newsArticles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesSource = selectedSource === 'all' || article.source === selectedSource;

      // Check if article is bookmarked using centralized service
      const isBookmarked = showBookmarked ?
        bookmarkService.getAllBookmarks().some(b => b.title === article.title && b.url === article.url) :
        true;

      return matchesSearch && matchesCategory && matchesSource && isBookmarked;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
          break;
        case 'relevance':
          // Calculate relevance score based on multiple factors
          const getRelevanceScore = (article: NewsArticle) => {
            let score = 0;

            // Base relevance score
            const relevanceOrder = { high: 100, medium: 50, low: 25 };
            score += relevanceOrder[article.upscRelevance];

            // Boost score for syllabus topics
            score += article.syllabusTopics.length * 10;

            // Boost score for important tags
            const importantTags = ['constitution', 'governance', 'economy', 'international', 'environment'];
            const tagBoost = article.tags.filter(tag =>
              importantTags.some(important => tag.toLowerCase().includes(important))
            ).length * 5;
            score += tagBoost;

            // Boost score for recent articles
            const daysSincePublished = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
            if (daysSincePublished <= 1) score += 20;
            else if (daysSincePublished <= 7) score += 10;

            return score;
          };

          comparison = getRelevanceScore(a) - getRelevanceScore(b);
          break;
        case 'source':
          comparison = a.source.localeCompare(b.source);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const filteredEditorials = editorials.filter(editorial => {
    const matchesSearch = editorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         editorial.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         editorial.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || editorial.category === selectedCategory;

    // Check if editorial is bookmarked using centralized service
    const isBookmarked = showBookmarked ?
      bookmarkService.getAllBookmarks().some(b => b.title === editorial.title && b.url === editorial.url) :
      true;

    return matchesSearch && matchesCategory && isBookmarked;
  });

  const getRelevanceColor = (relevance: 'high' | 'medium' | 'low') => {
    switch (relevance) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getDrishtiTodayURL = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    return `https://www.drishtiias.com/current-affairs-news-analysis-editorials/news-analysis/${day}-${month}-${year}`;
  };

  const getTheHinduEpaperURL = () => {
    return 'https://epaper.thehindu.com/reader';
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Current Affairs</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Stay updated with the latest news and DrishtiIAS editorials relevant to UPSC preparation.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </div>
            <button
              onClick={refreshContent}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'news'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center justify-center">
              <Newspaper className="h-4 w-4 mr-2" />
              News Articles ({filteredNews.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('editorials')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'editorials'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center justify-center">
              <Globe className="h-4 w-4 mr-2" />
              DrishtiIAS Editorials ({filteredEditorials.length})
            </div>
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles and editorials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map((category, index) => (
                  <option key={`category-${category}-${index}`} value={category}>{category}</option>
                ))}
              </select>
              {activeTab === 'news' && (
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Sources</option>
                  {sources.map((source, index) => (
                    <option key={`source-${source}-${index}`} value={source}>{source}</option>
                  ))}
                </select>
              )}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'relevance' | 'source')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="date">Sort by Date</option>
                <option value="relevance">Sort by Relevance</option>
                <option value="source">Sort by Source</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors dark:bg-gray-700 dark:text-white"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>

              <button
                onClick={() => setShowBookmarked(!showBookmarked)}
                className={`flex items-center px-3 py-2 rounded-md border transition-colors ${
                  showBookmarked
                    ? 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200'
                    : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                }`}
              >
                <Bookmark className="h-4 w-4 mr-1" />
                Bookmarked
              </button>

              <button
                onClick={() => setShowAddRSSModal(true)}
                className="flex items-center px-3 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors border border-green-300 dark:border-green-700"
              >
                <Globe className="h-4 w-4 mr-1" />
                Add RSS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {isLoading && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Fetching latest news and editorials...
                  </p>
                </div>
              </div>
            </div>
          )}
          {!isLoading && activeTab === 'news' ? (
            <div className="space-y-4">
              {filteredNews.map((article) => (
                <div key={article.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(article.upscRelevance)}`}>
                          {article.upscRelevance.toUpperCase()} RELEVANCE
                        </span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {article.source}
                        </span>
                      </div>
                      <h3 className={`text-lg font-medium mb-2 ${article.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                        {article.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {article.summary}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {getTimeAgo(article.publishedAt)}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Tag className="h-3 w-3" />
                          <span>Syllabus: {article.syllabusTopics.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <BookmarkButton
                        title={article.title}
                        url={article.url}
                        description={article.summary}
                        type="article"
                        source="current-affairs"
                        category={article.category}
                        tags={article.tags}
                        metadata={{
                          author: article.source,
                          publishedDate: article.publishedAt,
                          syllabusTopics: article.syllabusTopics
                        }}
                        variant="ghost"
                        size="md"
                      />
                      <button
                        onClick={() => markAsRead(article.id, 'news')}
                        className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => markAsRead(article.id, 'news')}
                        className="p-2 rounded-full text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map((tag, index) => (
                      <span key={`article-tag-${article.id}-${tag}-${index}`} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {filteredNews.length === 0 && (
                <div className="text-center py-12">
                  <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No articles found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm ? 'Try adjusting your search terms or filters' : 'Check back later for new articles'}
                  </p>
                </div>
              )}
            </div>
          ) : !isLoading ? (
            <div className="space-y-4">
              {filteredEditorials.map((editorial) => (
                <div key={editorial.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                          DRISHTI EDITORIAL
                        </span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                          {editorial.category}
                        </span>
                      </div>
                      <h3 className={`text-lg font-medium mb-2 ${editorial.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                        {editorial.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {editorial.summary}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {getTimeAgo(editorial.publishedAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <BookmarkButton
                        title={editorial.title}
                        url={editorial.url}
                        description={editorial.summary}
                        type="editorial"
                        source="current-affairs"
                        category={editorial.category}
                        tags={editorial.tags}
                        metadata={{
                          publishedDate: editorial.publishedAt
                        }}
                        variant="ghost"
                        size="md"
                      />
                      <button
                        onClick={() => markAsRead(editorial.id, 'editorial')}
                        className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <a
                        href={editorial.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => markAsRead(editorial.id, 'editorial')}
                        className="p-2 rounded-full text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {editorial.tags.map((tag, index) => (
                      <span key={`editorial-tag-${editorial.id}-${tag}-${index}`} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {filteredEditorials.length === 0 && (
                <div className="text-center py-12">
                  <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No editorials found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm ? 'Try adjusting your search terms or filters' : 'Check back later for new editorials'}
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Articles</span>
                <span className="font-medium text-gray-900 dark:text-white">{newsArticles.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Editorials</span>
                <span className="font-medium text-purple-600">{editorials.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Bookmarked</span>
                <span className="font-medium text-yellow-600">
                  {bookmarkService.searchBookmarks('', { source: 'current-affairs' }).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Read Today</span>
                <span className="font-medium text-green-600">
                  {newsArticles.filter(a => a.isRead).length + editorials.filter(e => e.isRead).length}
                </span>
              </div>
            </div>
          </div>

          {/* Sources */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">News Sources</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 dark:text-white">The Hindu</span>
                  <a
                    href={getTheHinduEpaperURL()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <span className="text-sm text-green-600">Live RSS</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 dark:text-white">DrishtiIAS</span>
                  <a
                    href={getDrishtiTodayURL()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <span className="text-sm text-green-600">Today's Analysis</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white">PIB</span>
                <span className="text-sm text-yellow-600">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white">Indian Express</span>
                <span className="text-sm text-green-600">Live RSS</span>
              </div>
            </div>

            {/* Quick Access Links */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Quick Access</h4>
              <div className="space-y-2">
                <a
                  href={getDrishtiTodayURL()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-3 py-2 text-sm bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <span>Today's DrishtiIAS</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href={getTheHinduEpaperURL()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <span>The Hindu E-Paper</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Trending Topics</h3>
            <div className="space-y-2">
              {Array.from(new Set([...newsArticles.flatMap(a => a.tags), ...editorials.flatMap(e => e.tags)]))
                .slice(0, 8)
                .map((tag, index) => (
                  <button
                    key={`trending-tag-${tag}-${index}`}
                    onClick={() => setSearchTerm(tag)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add RSS Feed Modal */}
      {showAddRSSModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Add Custom RSS Feed
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    RSS Feed URL
                  </label>
                  <input
                    type="url"
                    value={newRSSUrl}
                    onChange={(e) => setNewRSSUrl(e.target.value)}
                    placeholder="https://example.com/rss.xml"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {customRSSFeeds.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current RSS Feeds
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {customRSSFeeds.map((feed, index) => (
                        <div key={`rss-feed-${feed}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <span className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
                            {feed}
                          </span>
                          <button
                            onClick={() => removeCustomRSSFeed(feed)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddRSSModal(false);
                    setNewRSSUrl('');
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={addCustomRSSFeed}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Feed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
