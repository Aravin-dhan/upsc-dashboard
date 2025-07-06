/**
 * Navigation Actions Module
 * Handles all navigation-related AI actions
 */

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import toast from 'react-hot-toast';
import { AIAction, AIContext } from '../AIContextService';

export interface ActionResult {
  success: boolean;
  message: string;
  data?: any;
  nextActions?: AIAction[];
}

export class NavigationActions {
  private router: AppRouterInstance | null = null;

  setRouter(router: AppRouterInstance) {
    this.router = router;
  }

  async executeAction(action: AIAction, context?: AIContext): Promise<ActionResult> {
    switch (action.type) {
      case 'navigate_to_page':
      case 'NAVIGATE':
        return this.navigateToPage(action.payload);
      case 'navigate_to_section':
        return this.navigateToSection(action.payload, context);
      default:
        throw new Error(`Unsupported navigation action: ${action.type}`);
    }
  }

  private navigateToPage(payload: { page?: string; url?: string; params?: any }): ActionResult {
    if (!this.router) {
      return { success: false, message: 'Navigation not available - router not initialized' };
    }

    const targetUrl = payload.url || payload.page;
    if (!targetUrl) {
      return { success: false, message: 'No URL provided for navigation' };
    }

    // Map page URLs to user-friendly names
    const pageNames: Record<string, string> = {
      '/': 'Dashboard',
      '/schedule': 'Calendar & Schedule',
      '/syllabus': 'Syllabus Tracker',
      '/analytics': 'Performance Analytics',
      '/practice': 'Mock Tests & Practice',
      '/current-affairs': 'Current Affairs',
      '/knowledge-base': 'Study Materials',
      '/revision': 'Revision Engine',
      '/wellness': 'Wellness Corner',
      '/ai-assistant': 'AI Assistant',
      '/dictionary': 'Dictionary',
      '/maps': 'Interactive Maps',
      '/learning': 'Learning Center',
      '/bookmarks': 'Bookmarks',
      '/profile': 'Profile',
      '/settings': 'Settings',
      '/quick-links': 'Quick Links'
    };

    const pageName = pageNames[targetUrl] || targetUrl;

    try {
      this.router.push(targetUrl);
      toast.success(`✅ Navigated to ${pageName}`);

      return {
        success: true,
        message: `Successfully navigated to ${pageName}`,
        data: {
          targetUrl,
          pageName,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to navigate to ${pageName}: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async navigateToSection(payload: { section: string; subsection?: string }, context?: AIContext): Promise<ActionResult> {
    try {
      const validSections = [
        'dashboard', 'practice', 'learning', 'current-affairs', 
        'answer-analysis', 'maps', 'bookmarks', 'wellness', 'ai-assistant',
        'syllabus', 'analytics', 'calendar', 'dictionary', 'news',
        'study-plan', 'progress', 'resources', 'mock-tests'
      ];

      if (!validSections.includes(payload.section)) {
        return {
          success: false,
          message: `Invalid section: ${payload.section}. Valid sections are: ${validSections.join(', ')}`
        };
      }

      if (this.router) {
        const url = payload.subsection 
          ? `/${payload.section}/${payload.subsection}`
          : `/${payload.section}`;
        
        this.router.push(url);
        toast.success(`Navigated to ${payload.section}${payload.subsection ? ` - ${payload.subsection}` : ''}`);
      }

      return {
        success: true,
        message: `Successfully navigated to ${payload.section}`,
        data: { section: payload.section, subsection: payload.subsection }
      };
    } catch (error) {
      return {
        success: false,
        message: `Navigation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Quick navigation helpers
  navigateToHome(): ActionResult {
    return this.navigateToPage({ page: '/', url: '/' });
  }

  navigateToLearning(): ActionResult {
    return this.navigateToPage({ page: '/learning', url: '/learning' });
  }

  navigateToAIAssistant(): ActionResult {
    return this.navigateToPage({ page: '/ai-assistant', url: '/ai-assistant' });
  }

  navigateToPractice(): ActionResult {
    return this.navigateToPage({ page: '/practice', url: '/practice' });
  }

  navigateToAnalytics(): ActionResult {
    return this.navigateToPage({ page: '/analytics', url: '/analytics' });
  }

  navigateToCurrentAffairs(): ActionResult {
    return this.navigateToPage({ page: '/current-affairs', url: '/current-affairs' });
  }

  navigateToMaps(): ActionResult {
    return this.navigateToPage({ page: '/maps', url: '/maps' });
  }

  navigateToNews(): ActionResult {
    return this.navigateToPage({ page: '/news', url: '/news' });
  }

  navigateToCalendar(): ActionResult {
    return this.navigateToPage({ page: '/calendar', url: '/calendar' });
  }

  navigateToDictionary(): ActionResult {
    return this.navigateToPage({ page: '/dictionary', url: '/dictionary' });
  }

  navigateToSyllabus(): ActionResult {
    return this.navigateToPage({ page: '/syllabus', url: '/syllabus' });
  }

  navigateToStudyPlan(): ActionResult {
    return this.navigateToPage({ page: '/study-plan', url: '/study-plan' });
  }

  navigateToProgress(): ActionResult {
    return this.navigateToPage({ page: '/progress', url: '/progress' });
  }

  navigateToResources(): ActionResult {
    return this.navigateToPage({ page: '/resources', url: '/resources' });
  }

  navigateToMockTests(): ActionResult {
    return this.navigateToPage({ page: '/mock-tests', url: '/mock-tests' });
  }

  navigateToTest(): ActionResult {
    return this.navigateToPage({ page: '/test', url: '/test' });
  }

  // Navigation with parameters
  navigateWithParams(page: string, params: Record<string, string>): ActionResult {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${page}?${queryString}` : page;
    
    return this.navigateToPage({ page, url });
  }

  // Back navigation
  navigateBack(): ActionResult {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
      toast.success('Navigated back');
      return {
        success: true,
        message: 'Navigated back to previous page'
      };
    }
    
    return {
      success: false,
      message: 'Cannot navigate back - no previous page'
    };
  }

  // Forward navigation
  navigateForward(): ActionResult {
    if (typeof window !== 'undefined') {
      window.history.forward();
      toast.success('Navigated forward');
      return {
        success: true,
        message: 'Navigated forward'
      };
    }
    
    return {
      success: false,
      message: 'Cannot navigate forward'
    };
  }

  // Refresh current page
  refreshPage(): ActionResult {
    if (typeof window !== 'undefined') {
      window.location.reload();
      return {
        success: true,
        message: 'Page refreshed'
      };
    }
    
    return {
      success: false,
      message: 'Cannot refresh page'
    };
  }

  // Open in new tab
  openInNewTab(url: string): ActionResult {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
      toast.success(`Opened ${url} in new tab`);
      return {
        success: true,
        message: `Opened ${url} in new tab`
      };
    }

    return {
      success: false,
      message: 'Cannot open new tab'
    };
  }

  // Smart navigation based on intent - handles natural language navigation commands
  navigateByIntent(intent: string): ActionResult {
    const intentMap: Record<string, string> = {
      'calendar': '/schedule',
      'schedule': '/schedule',
      'timetable': '/schedule',
      'planner': '/schedule',
      'study materials': '/knowledge-base',
      'notes': '/knowledge-base',
      'knowledge': '/knowledge-base',
      'resources': '/knowledge-base',
      'learning': '/learning',
      'progress': '/analytics',
      'analytics': '/analytics',
      'performance': '/analytics',
      'stats': '/analytics',
      'tracking': '/analytics',
      'mock tests': '/practice',
      'practice': '/practice',
      'quiz': '/practice',
      'questions': '/practice',
      'exam': '/practice',
      'news': '/current-affairs',
      'current affairs': '/current-affairs',
      'articles': '/current-affairs',
      'updates': '/current-affairs',
      'revision': '/revision',
      'review': '/revision',
      'syllabus': '/syllabus',
      'curriculum': '/syllabus',
      'topics': '/syllabus',
      'wellness': '/wellness',
      'health': '/wellness',
      'motivation': '/wellness',
      'ai': '/ai-assistant',
      'assistant': '/ai-assistant',
      'chat': '/ai-assistant',
      'dictionary': '/dictionary',
      'vocabulary': '/dictionary',
      'words': '/dictionary',
      'maps': '/maps',
      'geography': '/maps',
      'locations': '/maps',
      'bookmarks': '/bookmarks',
      'saved': '/bookmarks',
      'favorites': '/bookmarks',
      'profile': '/profile',
      'settings': '/settings',
      'preferences': '/settings',
      'config': '/settings',
      'home': '/',
      'dashboard': '/',
      'main': '/'
    };

    const targetPage = intentMap[intent.toLowerCase()];
    if (targetPage) {
      return this.navigateToPage({ page: targetPage, url: targetPage });
    }

    return {
      success: false,
      message: `Could not find page for intent: ${intent}. Available options: ${Object.keys(intentMap).join(', ')}`
    };
  }

  // Get available navigation options
  getAvailablePages(): string[] {
    return [
      'Dashboard (/)',
      'Calendar & Schedule (/schedule)',
      'Syllabus Tracker (/syllabus)',
      'Performance Analytics (/analytics)',
      'Mock Tests & Practice (/practice)',
      'Current Affairs (/current-affairs)',
      'Study Materials (/knowledge-base)',
      'Revision Engine (/revision)',
      'Wellness Corner (/wellness)',
      'AI Assistant (/ai-assistant)',
      'Dictionary (/dictionary)',
      'Interactive Maps (/maps)',
      'Learning Center (/learning)',
      'Bookmarks (/bookmarks)',
      'Profile (/profile)',
      'Settings (/settings)'
    ];
  }
}

export default NavigationActions;
