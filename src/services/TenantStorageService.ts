/**
 * Tenant-aware storage service that provides data isolation between tenants
 * Handles both localStorage and API-based storage with automatic tenant scoping
 */

export interface TenantStorageConfig {
  tenantId: string;
  userId: string;
  useAPI?: boolean; // Whether to use API storage instead of localStorage
}

export class TenantStorageService {
  private config: TenantStorageConfig;
  private static instance: TenantStorageService | null = null;

  constructor(config: TenantStorageConfig) {
    this.config = config;
  }

  static getInstance(config?: TenantStorageConfig): TenantStorageService {
    if (!TenantStorageService.instance && config) {
      TenantStorageService.instance = new TenantStorageService(config);
    } else if (config) {
      // Update config if provided
      TenantStorageService.instance!.config = config;
    }
    
    if (!TenantStorageService.instance) {
      throw new Error('TenantStorageService must be initialized with config first');
    }
    
    return TenantStorageService.instance;
  }

  /**
   * Generate tenant-scoped key for localStorage
   */
  private getTenantScopedKey(key: string): string {
    return `${this.config.tenantId}:${this.config.userId}:${key}`;
  }

  /**
   * Store data in tenant-scoped localStorage
   */
  setLocalData<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      const scopedKey = this.getTenantScopedKey(key);
      localStorage.setItem(scopedKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to tenant storage:', error);
    }
  }

  /**
   * Retrieve data from tenant-scoped localStorage
   */
  getLocalData<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') return defaultValue || null;
    
    try {
      const scopedKey = this.getTenantScopedKey(key);
      const stored = localStorage.getItem(scopedKey);
      return stored ? JSON.parse(stored) : (defaultValue || null);
    } catch (error) {
      console.error('Error loading from tenant storage:', error);
      return defaultValue || null;
    }
  }

  /**
   * Remove data from tenant-scoped localStorage
   */
  removeLocalData(key: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const scopedKey = this.getTenantScopedKey(key);
      localStorage.removeItem(scopedKey);
    } catch (error) {
      console.error('Error removing from tenant storage:', error);
    }
  }

  /**
   * Store data via API (tenant-scoped on server)
   */
  async setAPIData<T>(dataType: string, data: T[]): Promise<boolean> {
    try {
      const response = await fetch(`/api/tenant-data/${dataType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          tenantId: this.config.tenantId
        }),
        credentials: 'include'
      });

      return response.ok;
    } catch (error) {
      console.error('Error saving to API storage:', error);
      return false;
    }
  }

  /**
   * Retrieve data via API (tenant-scoped on server)
   */
  async getAPIData<T>(dataType: string): Promise<T[]> {
    try {
      const response = await fetch(
        `/api/tenant-data/${dataType}?tenantId=${this.config.tenantId}`,
        {
          credentials: 'include'
        }
      );

      if (response.ok) {
        const result = await response.json();
        return result.data || [];
      }
      
      return [];
    } catch (error) {
      console.error('Error loading from API storage:', error);
      return [];
    }
  }

  /**
   * Add single item via API
   */
  async addAPIItem<T>(dataType: string, item: T): Promise<T | null> {
    try {
      const response = await fetch(`/api/tenant-data/${dataType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...item,
          tenantId: this.config.tenantId
        }),
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        return result.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error adding item to API storage:', error);
      return null;
    }
  }

  /**
   * Update item via API
   */
  async updateAPIItem<T>(dataType: string, id: string, updates: Partial<T>): Promise<T | null> {
    try {
      const response = await fetch(`/api/tenant-data/${dataType}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          ...updates,
          tenantId: this.config.tenantId
        }),
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        return result.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error updating item in API storage:', error);
      return null;
    }
  }

  /**
   * Delete item via API
   */
  async deleteAPIItem(dataType: string, id: string): Promise<boolean> {
    try {
      const response = await fetch(
        `/api/tenant-data/${dataType}?id=${id}&tenantId=${this.config.tenantId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error deleting item from API storage:', error);
      return false;
    }
  }

  /**
   * Migrate legacy localStorage data to tenant-scoped storage
   */
  migrateLegacyData(legacyKeys: string[]): void {
    if (typeof window === 'undefined') return;

    legacyKeys.forEach(key => {
      try {
        const legacyData = localStorage.getItem(key);
        if (legacyData) {
          // Move to tenant-scoped key
          const scopedKey = this.getTenantScopedKey(key);
          localStorage.setItem(scopedKey, legacyData);
          
          // Remove legacy key
          localStorage.removeItem(key);
          
          console.log(`Migrated ${key} to tenant-scoped storage`);
        }
      } catch (error) {
        console.error(`Error migrating ${key}:`, error);
      }
    });
  }

  /**
   * Clear all tenant data (for logout or tenant switching)
   */
  clearTenantData(): void {
    if (typeof window === 'undefined') return;

    const prefix = `${this.config.tenantId}:${this.config.userId}:`;
    const keysToRemove: string[] = [];

    // Find all keys with this tenant/user prefix
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }

    // Remove all tenant-scoped keys
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Get all tenant-scoped keys for debugging
   */
  getTenantKeys(): string[] {
    if (typeof window === 'undefined') return [];

    const prefix = `${this.config.tenantId}:${this.config.userId}:`;
    const tenantKeys: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        tenantKeys.push(key);
      }
    }

    return tenantKeys;
  }

  /**
   * Update tenant configuration (for tenant switching)
   */
  updateConfig(newConfig: TenantStorageConfig): void {
    this.config = newConfig;
  }
}

// Legacy localStorage keys that need migration
export const LEGACY_STORAGE_KEYS = [
  'upsc-user-profile',
  'upsc-daily-goals',
  'upsc-pomodoro-minutes',
  'upsc-pomodoro-seconds',
  'upsc-pomodoro-isbreak',
  'upsc-theme',
  'upsc-user-stats',
  'upsc-current-affairs-news',
  'upsc-current-affairs-editorials',
  'upsc-knowledge-base-notes',
  'upsc-calendar-events',
  'upsc-revision-items',
  'upsc-practice-history',
  'upsc-schedule-blocks',
  'upsc-recent-activity',
  'upsc-user-preferences',
  'upsc-learning-items',
  'upsc-study-sessions',
  'upsc-learning-analytics',
  'upsc-dictionary-favorites',
  'upsc-dictionary-progress',
  'upsc-dictionary-goals',
  'upsc-dictionary-history',
  'upsc-dictionary-streak',
  'upsc-dictionary-sessions'
];
