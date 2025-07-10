'use client';

export interface DeletedItem {
  id: string;
  type: 'knowledge-base' | 'bookmark' | 'revision-item' | 'rss-feed' | 'wellness-log' | 'calendar-event' | 'schedule-block' | 'note' | 'other';
  title: string;
  content: any; // Original content object
  deletedAt: string;
  deletedBy?: string;
  source: string; // Which page/component it was deleted from
  metadata?: {
    tags?: string[];
    category?: string;
    priority?: string;
    originalId?: string;
    parentId?: string;
  };
  expiresAt: string; // 30 days from deletion
}

export interface RecoveryStats {
  totalDeleted: number;
  byType: Record<string, number>;
  recentDeletions: number; // Last 7 days
  expiringSoon: number; // Expiring in next 7 days
}

export class ContentRecoveryService {
  private static instance: ContentRecoveryService;
  private deletedItems: DeletedItem[] = [];
  private readonly RECOVERY_PERIOD_DAYS = 30;
  private readonly STORAGE_KEY = 'upsc-deleted-content';

  private constructor() {
    this.loadDeletedItems();
    this.setupCleanupInterval();
  }

  static getInstance(): ContentRecoveryService {
    if (!ContentRecoveryService.instance) {
      ContentRecoveryService.instance = new ContentRecoveryService();
    }
    return ContentRecoveryService.instance;
  }

  // Load deleted items from localStorage
  private loadDeletedItems(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.deletedItems = JSON.parse(stored);
        // Clean up expired items on load
        this.cleanupExpiredItems();
      }
    } catch (error) {
      console.error('Error loading deleted items:', error);
      this.deletedItems = [];
    }
  }

  // Save deleted items to localStorage
  private saveDeletedItems(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.deletedItems));
    } catch (error) {
      console.error('Error saving deleted items:', error);
    }
  }

  // Setup automatic cleanup of expired items
  private setupCleanupInterval(): void {
    if (typeof window === 'undefined') return;

    // Clean up expired items every hour
    setInterval(() => {
      this.cleanupExpiredItems();
    }, 60 * 60 * 1000);
  }

  // Remove items that have exceeded the recovery period
  private cleanupExpiredItems(): void {
    const now = new Date();
    const initialCount = this.deletedItems.length;
    
    this.deletedItems = this.deletedItems.filter(item => {
      const expiresAt = new Date(item.expiresAt);
      return expiresAt > now;
    });

    if (this.deletedItems.length !== initialCount) {
      this.saveDeletedItems();
      console.log(`Cleaned up ${initialCount - this.deletedItems.length} expired deleted items`);
    }
  }

  // Add an item to the deleted items list
  addDeletedItem(
    type: DeletedItem['type'],
    title: string,
    content: any,
    source: string,
    metadata?: DeletedItem['metadata'],
    deletedBy?: string
  ): string {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (this.RECOVERY_PERIOD_DAYS * 24 * 60 * 60 * 1000));

    const deletedItem: DeletedItem = {
      id: `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      content,
      deletedAt: now.toISOString(),
      deletedBy,
      source,
      metadata,
      expiresAt: expiresAt.toISOString()
    };

    this.deletedItems.unshift(deletedItem); // Add to beginning for recent-first order
    this.saveDeletedItems();

    return deletedItem.id;
  }

  // Get all deleted items with optional filtering
  getDeletedItems(filters?: {
    type?: DeletedItem['type'];
    source?: string;
    searchTerm?: string;
    dateRange?: { start: Date; end: Date };
  }): DeletedItem[] {
    let items = [...this.deletedItems];

    if (filters) {
      if (filters.type) {
        items = items.filter(item => item.type === filters.type);
      }

      if (filters.source) {
        items = items.filter(item => item.source === filters.source);
      }

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        items = items.filter(item => 
          item.title.toLowerCase().includes(searchLower) ||
          JSON.stringify(item.content).toLowerCase().includes(searchLower) ||
          item.metadata?.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      if (filters.dateRange) {
        items = items.filter(item => {
          const deletedAt = new Date(item.deletedAt);
          return deletedAt >= filters.dateRange!.start && deletedAt <= filters.dateRange!.end;
        });
      }
    }

    return items;
  }

  // Get a specific deleted item by ID
  getDeletedItem(id: string): DeletedItem | null {
    return this.deletedItems.find(item => item.id === id) || null;
  }

  // Restore a deleted item
  restoreItem(id: string): DeletedItem | null {
    const itemIndex = this.deletedItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return null;
    }

    const [restoredItem] = this.deletedItems.splice(itemIndex, 1);
    this.saveDeletedItems();

    return restoredItem;
  }

  // Permanently delete an item (remove from recovery)
  permanentlyDelete(id: string): boolean {
    const itemIndex = this.deletedItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return false;
    }

    this.deletedItems.splice(itemIndex, 1);
    this.saveDeletedItems();

    return true;
  }

  // Bulk restore multiple items
  bulkRestore(ids: string[]): DeletedItem[] {
    const restoredItems: DeletedItem[] = [];
    
    ids.forEach(id => {
      const restored = this.restoreItem(id);
      if (restored) {
        restoredItems.push(restored);
      }
    });

    return restoredItems;
  }

  // Bulk permanently delete multiple items
  bulkPermanentlyDelete(ids: string[]): number {
    let deletedCount = 0;
    
    ids.forEach(id => {
      if (this.permanentlyDelete(id)) {
        deletedCount++;
      }
    });

    return deletedCount;
  }

  // Get recovery statistics
  getRecoveryStats(): RecoveryStats {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));

    const byType: Record<string, number> = {};
    let recentDeletions = 0;
    let expiringSoon = 0;

    this.deletedItems.forEach(item => {
      // Count by type
      byType[item.type] = (byType[item.type] || 0) + 1;

      // Count recent deletions
      const deletedAt = new Date(item.deletedAt);
      if (deletedAt >= sevenDaysAgo) {
        recentDeletions++;
      }

      // Count expiring soon
      const expiresAt = new Date(item.expiresAt);
      if (expiresAt <= sevenDaysFromNow) {
        expiringSoon++;
      }
    });

    return {
      totalDeleted: this.deletedItems.length,
      byType,
      recentDeletions,
      expiringSoon
    };
  }

  // Clear all deleted items (admin function)
  clearAllDeletedItems(): number {
    const count = this.deletedItems.length;
    this.deletedItems = [];
    this.saveDeletedItems();
    return count;
  }

  // Export deleted items for backup
  exportDeletedItems(): string {
    return JSON.stringify(this.deletedItems, null, 2);
  }

  // Import deleted items from backup
  importDeletedItems(jsonData: string): number {
    try {
      const importedItems: DeletedItem[] = JSON.parse(jsonData);
      
      // Validate imported data
      const validItems = importedItems.filter(item => 
        item.id && item.type && item.title && item.content && item.deletedAt && item.expiresAt
      );

      // Merge with existing items (avoid duplicates)
      const existingIds = new Set(this.deletedItems.map(item => item.id));
      const newItems = validItems.filter(item => !existingIds.has(item.id));

      this.deletedItems = [...this.deletedItems, ...newItems];
      this.saveDeletedItems();

      return newItems.length;
    } catch (error) {
      console.error('Error importing deleted items:', error);
      return 0;
    }
  }

  // Get items expiring soon (for notifications)
  getItemsExpiringSoon(days: number = 7): DeletedItem[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    return this.deletedItems.filter(item => {
      const expiresAt = new Date(item.expiresAt);
      return expiresAt <= cutoffDate;
    });
  }

  // Search deleted items with advanced options
  searchDeletedItems(query: string, options?: {
    includeContent?: boolean;
    includeMetadata?: boolean;
    fuzzyMatch?: boolean;
  }): DeletedItem[] {
    const searchLower = query.toLowerCase();
    const { includeContent = true, includeMetadata = true, fuzzyMatch = false } = options || {};

    return this.deletedItems.filter(item => {
      // Search in title
      if (item.title.toLowerCase().includes(searchLower)) {
        return true;
      }

      // Search in content if enabled
      if (includeContent) {
        const contentStr = JSON.stringify(item.content).toLowerCase();
        if (contentStr.includes(searchLower)) {
          return true;
        }
      }

      // Search in metadata if enabled
      if (includeMetadata && item.metadata) {
        const metadataStr = JSON.stringify(item.metadata).toLowerCase();
        if (metadataStr.includes(searchLower)) {
          return true;
        }
      }

      // Fuzzy matching (simple implementation)
      if (fuzzyMatch) {
        const titleWords = item.title.toLowerCase().split(' ');
        const queryWords = query.toLowerCase().split(' ');
        
        return queryWords.some(queryWord => 
          titleWords.some(titleWord => 
            titleWord.includes(queryWord) || queryWord.includes(titleWord)
          )
        );
      }

      return false;
    });
  }
}

export default ContentRecoveryService;
