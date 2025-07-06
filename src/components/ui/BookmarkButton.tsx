'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import BookmarkService, { Bookmark as BookmarkType } from '@/services/BookmarkService';
import toast from 'react-hot-toast';

interface BookmarkButtonProps {
  title: string;
  url?: string;
  content?: string;
  description?: string;
  type: 'article' | 'editorial' | 'note' | 'link' | 'question' | 'answer';
  source: string;
  category?: string;
  tags?: string[];
  metadata?: BookmarkType['metadata'];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
}

export default function BookmarkButton({
  title,
  url,
  content,
  description,
  type,
  source,
  category = 'General',
  tags = [],
  metadata,
  className = '',
  size = 'md',
  showText = false,
  variant = 'default'
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const bookmarkService = BookmarkService.getInstance();

  useEffect(() => {
    checkIfBookmarked();
  }, [title, url]);

  const checkIfBookmarked = () => {
    const bookmarks = bookmarkService.getAllBookmarks();
    const existing = bookmarks.find(b => 
      b.title === title && (url ? b.url === url : true)
    );
    
    if (existing) {
      setIsBookmarked(true);
      setBookmarkId(existing.id);
    } else {
      setIsBookmarked(false);
      setBookmarkId(null);
    }
  };

  const handleToggleBookmark = async () => {
    setIsLoading(true);
    
    try {
      if (isBookmarked && bookmarkId) {
        // Remove bookmark
        if (bookmarkService.deleteBookmark(bookmarkId)) {
          setIsBookmarked(false);
          setBookmarkId(null);
          toast.success('Bookmark removed');
        } else {
          toast.error('Failed to remove bookmark');
        }
      } else {
        // Add bookmark
        const newBookmark = bookmarkService.addBookmark({
          title,
          url,
          content,
          description,
          type,
          source,
          category,
          tags,
          isFavorite: false,
          isArchived: false,
          metadata
        });
        
        setIsBookmarked(true);
        setBookmarkId(newBookmark.id);
        toast.success('Bookmark added');
      }
    } catch (error) {
      toast.error('Failed to update bookmark');
      console.error('Bookmark error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-6 w-6';
      default:
        return 'h-5 w-5';
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    let sizeClasses = '';
    switch (size) {
      case 'sm':
        sizeClasses = showText ? 'px-2 py-1 text-xs' : 'p-1';
        break;
      case 'lg':
        sizeClasses = showText ? 'px-4 py-2 text-base' : 'p-3';
        break;
      default:
        sizeClasses = showText ? 'px-3 py-2 text-sm' : 'p-2';
    }

    let variantClasses = '';
    switch (variant) {
      case 'outline':
        variantClasses = isBookmarked
          ? 'border border-blue-600 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30'
          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700';
        break;
      case 'ghost':
        variantClasses = isBookmarked
          ? 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20'
          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700';
        break;
      default:
        variantClasses = isBookmarked
          ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
          : 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500';
    }

    return `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;
  };

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={getButtonClasses()}
      title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {isLoading ? (
        <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${getSizeClasses()}`} />
      ) : (
        <>
          {isBookmarked ? (
            <BookmarkCheck className={getSizeClasses()} />
          ) : (
            <Bookmark className={getSizeClasses()} />
          )}
          {showText && (
            <span className="ml-2">
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </span>
          )}
        </>
      )}
    </button>
  );
}

// Quick bookmark hook for easy integration
export function useBookmark(
  title: string,
  url?: string,
  content?: string,
  description?: string,
  type: BookmarkType['type'] = 'article',
  source: string = 'unknown',
  category: string = 'General',
  tags: string[] = [],
  metadata?: BookmarkType['metadata']
) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  
  const bookmarkService = BookmarkService.getInstance();

  useEffect(() => {
    const bookmarks = bookmarkService.getAllBookmarks();
    const existing = bookmarks.find(b => 
      b.title === title && (url ? b.url === url : true)
    );
    
    if (existing) {
      setIsBookmarked(true);
      setBookmarkId(existing.id);
    } else {
      setIsBookmarked(false);
      setBookmarkId(null);
    }
  }, [title, url]);

  const toggleBookmark = () => {
    if (isBookmarked && bookmarkId) {
      if (bookmarkService.deleteBookmark(bookmarkId)) {
        setIsBookmarked(false);
        setBookmarkId(null);
        return { success: true, action: 'removed' };
      }
    } else {
      const newBookmark = bookmarkService.addBookmark({
        title,
        url,
        content,
        description,
        type,
        source,
        category,
        tags,
        isFavorite: false,
        isArchived: false,
        metadata
      });
      
      setIsBookmarked(true);
      setBookmarkId(newBookmark.id);
      return { success: true, action: 'added' };
    }
    
    return { success: false, action: 'error' };
  };

  return {
    isBookmarked,
    bookmarkId,
    toggleBookmark
  };
}
