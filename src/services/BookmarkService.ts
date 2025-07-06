export interface Bookmark {
  id: string;
  title: string;
  url?: string;
  content?: string;
  description?: string;
  type: 'article' | 'editorial' | 'note' | 'link' | 'question' | 'answer';
  source: string; // 'current-affairs', 'knowledge-base', 'quick-links', etc.
  category: string;
  tags: string[];
  createdAt: string;
  lastAccessed?: string;
  isFavorite: boolean;
  isArchived: boolean;
  metadata?: {
    author?: string;
    publishedDate?: string;
    syllabusTopics?: string[];
    difficulty?: string;
    wordCount?: number;
    readingTime?: number;
  };
}

export interface BookmarkCollection {
  id: string;
  name: string;
  description?: string;
  bookmarkIds: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

class BookmarkService {
  private static instance: BookmarkService;
  private bookmarks: Bookmark[] = [];
  private collections: BookmarkCollection[] = [];
  private storageKey = 'upsc-bookmarks';
  private collectionsKey = 'upsc-bookmark-collections';

  private constructor() {
    this.loadBookmarks();
    this.loadCollections();
  }

  static getInstance(): BookmarkService {
    if (!BookmarkService.instance) {
      BookmarkService.instance = new BookmarkService();
    }
    return BookmarkService.instance;
  }

  private loadBookmarks(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        try {
          this.bookmarks = JSON.parse(saved);
        } catch (error) {
          console.error('Error loading bookmarks:', error);
          this.bookmarks = [];
        }
      } else {
        // Add default bookmarks for demonstration
        this.bookmarks = this.getDefaultBookmarks();
        this.saveBookmarks();
      }
    }
  }

  private getDefaultBookmarks(): Bookmark[] {
    return [
      {
        id: 'default-1',
        title: 'UPSC Official Website',
        url: 'https://www.upsc.gov.in',
        description: 'Official UPSC website for notifications, syllabus, and exam updates',
        type: 'link',
        source: 'quick-links',
        category: 'Official',
        tags: ['upsc', 'official', 'notifications'],
        createdAt: new Date().toISOString(),
        isFavorite: true,
        isArchived: false,
        metadata: {
          syllabusTopics: ['General Studies']
        }
      },
      {
        id: 'default-2',
        title: 'The Hindu Editorial',
        url: 'https://www.thehindu.com/opinion/editorial/',
        description: 'Daily editorials for current affairs preparation',
        type: 'editorial',
        source: 'current-affairs',
        category: 'Current Affairs',
        tags: ['editorial', 'current-affairs', 'the-hindu'],
        createdAt: new Date().toISOString(),
        isFavorite: true,
        isArchived: false,
        metadata: {
          syllabusTopics: ['Current Events']
        }
      },
      {
        id: 'default-3',
        title: 'Indian Constitution - Article 370',
        content: 'Notes on Article 370 and its historical significance...',
        description: 'Comprehensive notes on Article 370 of the Indian Constitution',
        type: 'note',
        source: 'knowledge-base',
        category: 'Polity',
        tags: ['constitution', 'article-370', 'polity'],
        createdAt: new Date().toISOString(),
        isFavorite: false,
        isArchived: false,
        metadata: {
          syllabusTopics: ['Indian Polity and Governance'],
          wordCount: 1500,
          readingTime: 6
        }
      }
    ];
  }

  private loadCollections(): void {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.collectionsKey);
      if (saved) {
        try {
          this.collections = JSON.parse(saved);
        } catch (error) {
          console.error('Error loading bookmark collections:', error);
          this.collections = [];
        }
      }
    }
  }

  private saveBookmarks(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(this.bookmarks));
    }
  }

  private saveCollections(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.collectionsKey, JSON.stringify(this.collections));
    }
  }

  // Bookmark CRUD operations
  addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    this.bookmarks.push(newBookmark);
    this.saveBookmarks();
    return newBookmark;
  }

  updateBookmark(id: string, updates: Partial<Bookmark>): boolean {
    const index = this.bookmarks.findIndex(b => b.id === id);
    if (index === -1) return false;

    this.bookmarks[index] = { ...this.bookmarks[index], ...updates };
    this.saveBookmarks();
    return true;
  }

  deleteBookmark(id: string): boolean {
    const index = this.bookmarks.findIndex(b => b.id === id);
    if (index === -1) return false;

    this.bookmarks.splice(index, 1);
    this.saveBookmarks();
    
    // Remove from collections
    this.collections.forEach(collection => {
      const bookmarkIndex = collection.bookmarkIds.indexOf(id);
      if (bookmarkIndex > -1) {
        collection.bookmarkIds.splice(bookmarkIndex, 1);
      }
    });
    this.saveCollections();
    
    return true;
  }

  getBookmark(id: string): Bookmark | undefined {
    return this.bookmarks.find(b => b.id === id);
  }

  getAllBookmarks(): Bookmark[] {
    return [...this.bookmarks];
  }

  // Search and filter operations
  searchBookmarks(query: string, filters?: {
    type?: string;
    source?: string;
    category?: string;
    tags?: string[];
    isFavorite?: boolean;
    isArchived?: boolean;
  }): Bookmark[] {
    let results = this.bookmarks;

    // Text search
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      results = results.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchTerm) ||
        bookmark.description?.toLowerCase().includes(searchTerm) ||
        bookmark.content?.toLowerCase().includes(searchTerm) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply filters
    if (filters) {
      if (filters.type) {
        results = results.filter(b => b.type === filters.type);
      }
      if (filters.source) {
        results = results.filter(b => b.source === filters.source);
      }
      if (filters.category) {
        results = results.filter(b => b.category === filters.category);
      }
      if (filters.tags && filters.tags.length > 0) {
        results = results.filter(b => 
          filters.tags!.some(tag => b.tags.includes(tag))
        );
      }
      if (filters.isFavorite !== undefined) {
        results = results.filter(b => b.isFavorite === filters.isFavorite);
      }
      if (filters.isArchived !== undefined) {
        results = results.filter(b => b.isArchived === filters.isArchived);
      }
    }

    return results;
  }

  // Collection operations
  createCollection(name: string, description?: string): BookmarkCollection {
    const collection: BookmarkCollection = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      description,
      bookmarkIds: [],
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.collections.push(collection);
    this.saveCollections();
    return collection;
  }

  addToCollection(collectionId: string, bookmarkId: string): boolean {
    const collection = this.collections.find(c => c.id === collectionId);
    if (!collection || collection.bookmarkIds.includes(bookmarkId)) return false;

    collection.bookmarkIds.push(bookmarkId);
    collection.updatedAt = new Date().toISOString();
    this.saveCollections();
    return true;
  }

  removeFromCollection(collectionId: string, bookmarkId: string): boolean {
    const collection = this.collections.find(c => c.id === collectionId);
    if (!collection) return false;

    const index = collection.bookmarkIds.indexOf(bookmarkId);
    if (index === -1) return false;

    collection.bookmarkIds.splice(index, 1);
    collection.updatedAt = new Date().toISOString();
    this.saveCollections();
    return true;
  }

  getCollections(): BookmarkCollection[] {
    return [...this.collections];
  }

  getCollectionBookmarks(collectionId: string): Bookmark[] {
    const collection = this.collections.find(c => c.id === collectionId);
    if (!collection) return [];

    return collection.bookmarkIds
      .map(id => this.getBookmark(id))
      .filter(bookmark => bookmark !== undefined) as Bookmark[];
  }

  // Utility operations
  toggleFavorite(id: string): boolean {
    const bookmark = this.getBookmark(id);
    if (!bookmark) return false;

    return this.updateBookmark(id, { isFavorite: !bookmark.isFavorite });
  }

  toggleArchive(id: string): boolean {
    const bookmark = this.getBookmark(id);
    if (!bookmark) return false;

    return this.updateBookmark(id, { isArchived: !bookmark.isArchived });
  }

  markAsAccessed(id: string): boolean {
    return this.updateBookmark(id, { lastAccessed: new Date().toISOString() });
  }

  // Export/Import operations
  exportBookmarks(): string {
    return JSON.stringify({
      bookmarks: this.bookmarks,
      collections: this.collections,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  }

  importBookmarks(data: string): { success: boolean; message: string; imported: number } {
    try {
      const parsed = JSON.parse(data);
      
      if (!parsed.bookmarks || !Array.isArray(parsed.bookmarks)) {
        return { success: false, message: 'Invalid bookmark data format', imported: 0 };
      }

      let imported = 0;
      parsed.bookmarks.forEach((bookmark: any) => {
        // Validate bookmark structure
        if (bookmark.title && bookmark.type && bookmark.source) {
          // Check for duplicates
          const exists = this.bookmarks.some(b => 
            b.title === bookmark.title && b.url === bookmark.url
          );
          
          if (!exists) {
            this.addBookmark({
              title: bookmark.title,
              url: bookmark.url,
              content: bookmark.content,
              description: bookmark.description,
              type: bookmark.type,
              source: bookmark.source,
              category: bookmark.category || 'General',
              tags: bookmark.tags || [],
              isFavorite: bookmark.isFavorite || false,
              isArchived: bookmark.isArchived || false,
              metadata: bookmark.metadata
            });
            imported++;
          }
        }
      });

      return { 
        success: true, 
        message: `Successfully imported ${imported} bookmarks`, 
        imported 
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Failed to parse bookmark data', 
        imported: 0 
      };
    }
  }

  // Statistics
  getStats() {
    const total = this.bookmarks.length;
    const favorites = this.bookmarks.filter(b => b.isFavorite).length;
    const archived = this.bookmarks.filter(b => b.isArchived).length;
    const byType = this.bookmarks.reduce((acc, bookmark) => {
      acc[bookmark.type] = (acc[bookmark.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const bySource = this.bookmarks.reduce((acc, bookmark) => {
      acc[bookmark.source] = (acc[bookmark.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      favorites,
      archived,
      active: total - archived,
      byType,
      bySource,
      collections: this.collections.length
    };
  }
}

export default BookmarkService;
