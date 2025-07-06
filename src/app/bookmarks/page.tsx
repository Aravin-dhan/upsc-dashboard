'use client';

import { useState, useEffect } from 'react';
import {
  Bookmark, Search, Filter, Star, Archive, Trash2, ExternalLink,
  Plus, Download, Upload, Grid, List, Tag, Calendar, Clock,
  Eye, Edit, Copy, Share, FolderPlus, Folder, Settings,
  BookOpen, FileText, Link, HelpCircle, BarChart3
} from 'lucide-react';
import BookmarkService, { Bookmark as BookmarkType, BookmarkCollection } from '@/services/BookmarkService';
import toast from 'react-hot-toast';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [collections, setCollections] = useState<BookmarkCollection[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<BookmarkType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showArchivedOnly, setShowArchivedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBookmarks, setSelectedBookmarks] = useState<Set<string>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const bookmarkService = BookmarkService.getInstance();

  useEffect(() => {
    loadData();
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    filterBookmarks();
  }, [bookmarks, searchTerm, selectedType, selectedSource, selectedCategory, showFavoritesOnly, showArchivedOnly]);

  const loadData = () => {
    setBookmarks(bookmarkService.getAllBookmarks());
    setCollections(bookmarkService.getCollections());
  };

  const filterBookmarks = () => {
    let filtered = bookmarks;

    // Apply filters
    if (searchTerm) {
      filtered = bookmarkService.searchBookmarks(searchTerm);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(b => b.type === selectedType);
    }

    if (selectedSource !== 'all') {
      filtered = filtered.filter(b => b.source === selectedSource);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(b => b.category === selectedCategory);
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter(b => b.isFavorite);
    }

    if (showArchivedOnly) {
      filtered = filtered.filter(b => b.isArchived);
    } else {
      filtered = filtered.filter(b => !b.isArchived);
    }

    setFilteredBookmarks(filtered);
  };

  const handleToggleFavorite = (id: string) => {
    if (bookmarkService.toggleFavorite(id)) {
      loadData();
      toast.success('Bookmark updated');
    }
  };

  const handleToggleArchive = (id: string) => {
    if (bookmarkService.toggleArchive(id)) {
      loadData();
      toast.success('Bookmark updated');
    }
  };

  const handleDeleteBookmark = (id: string) => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      if (bookmarkService.deleteBookmark(id)) {
        loadData();
        toast.success('Bookmark deleted');
      }
    }
  };

  const handleBulkAction = (action: 'favorite' | 'archive' | 'delete') => {
    if (selectedBookmarks.size === 0) {
      toast.error('No bookmarks selected');
      return;
    }

    const confirmMessage = action === 'delete' 
      ? `Are you sure you want to delete ${selectedBookmarks.size} bookmarks?`
      : `Are you sure you want to ${action} ${selectedBookmarks.size} bookmarks?`;

    if (confirm(confirmMessage)) {
      selectedBookmarks.forEach(id => {
        switch (action) {
          case 'favorite':
            bookmarkService.toggleFavorite(id);
            break;
          case 'archive':
            bookmarkService.toggleArchive(id);
            break;
          case 'delete':
            bookmarkService.deleteBookmark(id);
            break;
        }
      });

      loadData();
      setSelectedBookmarks(new Set());
      toast.success(`${selectedBookmarks.size} bookmarks ${action}d`);
    }
  };

  const handleExport = () => {
    const data = bookmarkService.exportBookmarks();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `upsc-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Bookmarks exported successfully');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = bookmarkService.importBookmarks(content);
      
      if (result.success) {
        loadData();
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    };
    reader.readAsText(file);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="h-4 w-4" />;
      case 'editorial': return <BookOpen className="h-4 w-4" />;
      case 'note': return <Edit className="h-4 w-4" />;
      case 'link': return <Link className="h-4 w-4" />;
      case 'question': return <HelpCircle className="h-4 w-4" />;
      case 'answer': return <FileText className="h-4 w-4" />;
      default: return <Bookmark className="h-4 w-4" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'current-affairs': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'knowledge-base': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'quick-links': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'practice': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUniqueValues = (key: keyof BookmarkType) => {
    return Array.from(new Set(bookmarks.map(b => b[key] as string))).filter(Boolean);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bookmarks</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Organize and manage all your saved content in one place.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {(() => {
          const stats = bookmarkService.getStats();
          return (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <Bookmark className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <Star className="h-8 w-8 text-yellow-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Favorites</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.favorites}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <Archive className="h-8 w-8 text-gray-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Archived</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.archived}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center">
                  <Folder className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Collections</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.collections}</p>
                  </div>
                </div>
              </div>
            </>
          );
        })()}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Types</option>
              {getUniqueValues('type').map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>

            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Sources</option>
              {getUniqueValues('source').map(source => (
                <option key={source} value={source}>{source.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
              ))}
            </select>

            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-3 py-2 rounded-md transition-colors ${
                showFavoritesOnly
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Star className="h-4 w-4" />
            </button>

            <button
              onClick={() => setShowArchivedOnly(!showArchivedOnly)}
              className={`px-3 py-2 rounded-md transition-colors ${
                showArchivedOnly
                  ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Archive className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4 mr-2" /> : <Grid className="h-4 w-4 mr-2" />}
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>

            {selectedBookmarks.size > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedBookmarks.size} selected
                </span>
                <button
                  onClick={() => handleBulkAction('favorite')}
                  className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-md transition-colors"
                  title="Toggle Favorite"
                >
                  <Star className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleBulkAction('archive')}
                  className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                  title="Toggle Archive"
                >
                  <Archive className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  title="Delete Selected"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Bookmark
            </button>
            <button
              onClick={() => setShowCollectionForm(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Collection
            </button>
            <button
              onClick={() => setShowImportExport(true)}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Import/Export
            </button>
          </div>
        </div>
      </div>

      {/* Bookmarks Display */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No bookmarks found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || selectedType !== 'all' || selectedSource !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first bookmark'
              }
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Bookmark
            </button>
          </div>
        ) : (
          <div className={`p-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}`}>
            {filteredBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className={`border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-all ${
                  selectedBookmarks.has(bookmark.id) ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-700'
                } ${viewMode === 'list' ? 'flex items-start space-x-4' : ''}`}
              >
                <div className={`flex items-start ${viewMode === 'list' ? 'flex-1' : 'justify-between mb-3'}`}>
                  <div className={`flex items-start space-x-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <input
                      type="checkbox"
                      checked={selectedBookmarks.has(bookmark.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedBookmarks);
                        if (e.target.checked) {
                          newSelected.add(bookmark.id);
                        } else {
                          newSelected.delete(bookmark.id);
                        }
                        setSelectedBookmarks(newSelected);
                      }}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />

                    <div className={`flex-1 ${viewMode === 'grid' ? 'min-w-0' : ''}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {getTypeIcon(bookmark.type)}
                        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                          {bookmark.title}
                        </h3>
                        {bookmark.isFavorite && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>

                      {bookmark.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {bookmark.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getSourceColor(bookmark.source)}`}>
                          {bookmark.source.replace('-', ' ')}
                        </span>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300 rounded-full">
                          {bookmark.category}
                        </span>
                        {bookmark.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 text-xs bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {bookmark.tags.length > 2 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{bookmark.tags.length - 2} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(bookmark.createdAt)}
                        </div>
                        {bookmark.lastAccessed && (
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {formatDate(bookmark.lastAccessed)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center space-x-1 ${viewMode === 'list' ? 'ml-4' : 'mt-2'}`}>
                    <button
                      onClick={() => handleToggleFavorite(bookmark.id)}
                      className={`p-2 rounded-full transition-colors ${
                        bookmark.isFavorite
                          ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900'
                          : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900'
                      }`}
                      title="Toggle Favorite"
                    >
                      <Star className="h-4 w-4" />
                    </button>

                    {bookmark.url && (
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          bookmarkService.markAsAccessed(bookmark.id);
                          loadData();
                        }}
                        className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                        title="Open Link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}

                    <button
                      onClick={() => handleToggleArchive(bookmark.id)}
                      className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title="Toggle Archive"
                    >
                      <Archive className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteBookmark(bookmark.id)}
                      className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
