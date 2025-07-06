'use client';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import toast from 'react-hot-toast';

export interface NavigationResult {
  success: boolean;
  message: string;
  targetPage?: string;
  pageName?: string;
}

/**
 * Standalone Navigation Command Handler
 * Handles navigation commands independently of the main AI system
 * Can be easily integrated when AI services are restored
 */
export class NavigationCommandHandler {
  private router: AppRouterInstance | null = null;

  // Page mapping for user-friendly names and URL normalization
  private readonly pageMap: Record<string, { url: string; name: string; aliases: string[] }> = {
    'dashboard': { url: '/', name: 'Dashboard', aliases: ['home', 'main', 'overview'] },
    'calendar': { url: '/schedule', name: 'Calendar & Schedule', aliases: ['schedule', 'timetable', 'planner', 'calendar'] },
    'syllabus': { url: '/syllabus', name: 'Syllabus Tracker', aliases: ['curriculum', 'topics', 'syllabus'] },
    'analytics': { url: '/analytics', name: 'Performance Analytics', aliases: ['progress', 'performance', 'stats', 'tracking', 'analytics'] },
    'practice': { url: '/practice', name: 'Mock Tests & Practice', aliases: ['mock tests', 'practice', 'quiz', 'questions', 'exam', 'test'] },
    'current-affairs': { url: '/current-affairs', name: 'Current Affairs', aliases: ['news', 'current affairs', 'articles', 'updates'] },
    'knowledge-base': { url: '/knowledge-base', name: 'Study Materials', aliases: ['study materials', 'notes', 'knowledge', 'resources', 'materials'] },
    'revision': { url: '/revision', name: 'Revision Engine', aliases: ['revision', 'review', 'revise'] },
    'wellness': { url: '/wellness', name: 'Wellness Corner', aliases: ['wellness', 'health', 'motivation'] },
    'ai-assistant': { url: '/ai-assistant', name: 'AI Assistant', aliases: ['ai', 'assistant', 'chat', 'ai assistant'] },
    'dictionary': { url: '/dictionary', name: 'Dictionary', aliases: ['dictionary', 'vocabulary', 'words'] },
    'maps': { url: '/maps', name: 'Interactive Maps', aliases: ['maps', 'geography', 'locations'] },
    'learning': { url: '/learning', name: 'Learning Center', aliases: ['learning', 'learn', 'study'] },
    'bookmarks': { url: '/bookmarks', name: 'Bookmarks', aliases: ['bookmarks', 'saved', 'favorites'] },
    'profile': { url: '/profile', name: 'Profile', aliases: ['profile', 'account'] },
    'settings': { url: '/settings', name: 'Settings', aliases: ['settings', 'preferences', 'config'] }
  };

  // Navigation command patterns
  private readonly navigationPatterns = [
    // Direct navigation commands
    /^(?:go to|open|navigate to|show me|take me to|visit|display|load|switch to)\s+(.+)$/i,
    // Calendar specific
    /^(?:open|show)\s+(?:my\s+)?(?:calendar|schedule)$/i,
    // Study materials
    /^(?:open|show)\s+(?:study\s+)?(?:materials|notes)$/i,
    // Progress/analytics
    /^(?:show|check)\s+(?:my\s+)?(?:progress|performance|analytics)$/i,
    // Practice/tests
    /^(?:start|open)\s+(?:mock\s+)?(?:test|practice|quiz)$/i,
    // News
    /^(?:show|open)\s+(?:latest\s+)?(?:news|current affairs)$/i,
    // Simple page names
    /^(dashboard|home|calendar|syllabus|analytics|practice|news|materials|revision|wellness|ai|dictionary|maps|learning|bookmarks|profile|settings)$/i
  ];

  constructor(router?: AppRouterInstance) {
    if (router) {
      this.setRouter(router);
    }
  }

  setRouter(router: AppRouterInstance): void {
    this.router = router;
  }

  /**
   * Parse and execute navigation command
   */
  handleNavigationCommand(command: string): NavigationResult {
    if (!this.router) {
      return {
        success: false,
        message: 'Navigation not available - router not initialized'
      };
    }

    const normalizedCommand = command.trim().toLowerCase();
    
    // Try to match navigation patterns
    for (const pattern of this.navigationPatterns) {
      const match = normalizedCommand.match(pattern);
      if (match) {
        const targetPage = this.extractPageFromMatch(match, normalizedCommand);
        if (targetPage) {
          return this.navigateToPage(targetPage);
        }
      }
    }

    // Try direct page matching
    const directMatch = this.findPageByAlias(normalizedCommand);
    if (directMatch) {
      return this.navigateToPage(directMatch);
    }

    return {
      success: false,
      message: `Could not understand navigation command: "${command}". Try commands like "open calendar", "go to practice", or "show analytics".`
    };
  }

  /**
   * Extract page identifier from regex match
   */
  private extractPageFromMatch(match: RegExpMatchArray, command: string): string | null {
    // Handle calendar-specific patterns
    if (command.includes('calendar') || command.includes('schedule')) {
      return 'calendar';
    }
    
    // Handle study materials patterns
    if (command.includes('materials') || command.includes('notes')) {
      return 'knowledge-base';
    }
    
    // Handle progress/analytics patterns
    if (command.includes('progress') || command.includes('performance') || command.includes('analytics')) {
      return 'analytics';
    }
    
    // Handle practice/test patterns
    if (command.includes('practice') || command.includes('test') || command.includes('quiz') || command.includes('mock')) {
      return 'practice';
    }
    
    // Handle news patterns
    if (command.includes('news') || command.includes('current affairs')) {
      return 'current-affairs';
    }

    // Extract from capture group
    if (match[1]) {
      return this.findPageByAlias(match[1].trim());
    }

    return null;
  }

  /**
   * Find page by alias or direct name
   */
  private findPageByAlias(input: string): string | null {
    const normalizedInput = input.toLowerCase().trim();
    
    // Direct key match
    if (this.pageMap[normalizedInput]) {
      return normalizedInput;
    }

    // Search through aliases
    for (const [key, page] of Object.entries(this.pageMap)) {
      if (page.aliases.some(alias => alias.toLowerCase() === normalizedInput)) {
        return key;
      }
    }

    // Partial matching for flexibility
    for (const [key, page] of Object.entries(this.pageMap)) {
      if (page.aliases.some(alias => alias.toLowerCase().includes(normalizedInput) || normalizedInput.includes(alias.toLowerCase()))) {
        return key;
      }
    }

    return null;
  }

  /**
   * Navigate to a specific page
   */
  private navigateToPage(pageKey: string): NavigationResult {
    const page = this.pageMap[pageKey];
    if (!page) {
      return {
        success: false,
        message: `Unknown page: ${pageKey}`
      };
    }

    try {
      this.router!.push(page.url);
      toast.success(`✅ Navigated to ${page.name}`);
      
      return {
        success: true,
        message: `Successfully navigated to ${page.name}`,
        targetPage: page.url,
        pageName: page.name
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to navigate to ${page.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Check if a command is a navigation command
   */
  isNavigationCommand(command: string): boolean {
    const normalizedCommand = command.trim().toLowerCase();
    
    // Check against patterns
    for (const pattern of this.navigationPatterns) {
      if (pattern.test(normalizedCommand)) {
        return true;
      }
    }

    // Check direct page names
    return this.findPageByAlias(normalizedCommand) !== null;
  }

  /**
   * Get available pages for help/suggestions
   */
  getAvailablePages(): string[] {
    return Object.values(this.pageMap).map(page => `${page.name} (${page.url})`);
  }

  /**
   * Get navigation suggestions based on current page
   */
  getNavigationSuggestions(currentPath: string): string[] {
    const suggestions = [
      'open calendar',
      'go to practice',
      'show analytics',
      'open study materials',
      'check current affairs'
    ];

    // Filter out current page
    return suggestions.filter(suggestion => {
      const pageKey = this.findPageByAlias(suggestion.split(' ').pop() || '');
      return pageKey && this.pageMap[pageKey]?.url !== currentPath;
    });
  }
}

// Export singleton instance
export const navigationHandler = new NavigationCommandHandler();
export default NavigationCommandHandler;
