/**
 * Modular AI Action Handler
 * Optimized for faster compilation with code splitting
 */

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { AIAction, AIContext } from './AIContextService';

// Lazy-loaded action modules
let NavigationActions: any = null;
let StudyActions: any = null;
let UIControlActions: any = null;
let ExternalAPIActions: any = null;

export interface ActionResult {
  success: boolean;
  message: string;
  data?: any;
  nextActions?: AIAction[];
}

class AIActionHandlerModular {
  private static instance: AIActionHandlerModular;
  private router: AppRouterInstance | null = null;
  
  // Action module instances (lazy-loaded)
  private navigationActions: any = null;
  private studyActions: any = null;
  private uiControlActions: any = null;
  private externalAPIActions: any = null;

  private constructor() {
    // Initialize with lazy loading
  }

  static getInstance(): AIActionHandlerModular {
    if (!AIActionHandlerModular.instance) {
      AIActionHandlerModular.instance = new AIActionHandlerModular();
    }
    return AIActionHandlerModular.instance;
  }

  setRouter(router: AppRouterInstance) {
    this.router = router;
    // Set router for navigation actions if already loaded
    if (this.navigationActions) {
      this.navigationActions.setRouter(router);
    }
  }

  async executeAction(action: AIAction, context?: AIContext): Promise<ActionResult> {
    try {
      // Determine which module to use based on action type
      const actionModule = this.getActionModule(action.type);
      
      if (!actionModule) {
        console.warn(`Unknown action type: ${action.type}`);
        return {
          success: false,
          message: `Unknown action type: ${action.type}`
        };
      }

      // Load the appropriate module and execute the action
      const moduleInstance = await this.loadActionModule(actionModule);
      return await moduleInstance.executeAction(action, context);

    } catch (error) {
      console.error('Error executing action:', error);
      return {
        success: false,
        message: `Failed to execute action: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private getActionModule(actionType: string): string | null {
    // Navigation actions
    if (['navigate_to_page', 'NAVIGATE', 'navigate_to_section'].includes(actionType)) {
      return 'navigation';
    }

    // Study actions
    if ([
      'create_study_plan', 'schedule_event', 'set_reminder', 'start_practice_session',
      'analyze_performance', 'generate_custom_quiz', 'track_progress', 
      'set_study_reminder', 'spaced_repetition'
    ].includes(actionType)) {
      return 'study';
    }

    // UI control actions
    if ([
      'ui_control', 'form_control', 'ui_action', 'toggle_theme',
      'customize_interface', 'update_dashboard_layout'
    ].includes(actionType)) {
      return 'ui_control';
    }

    // External API actions
    if ([
      'get_weather', 'get_news', 'get_quote', 'get_fact',
      'get_exchange_rates', 'clear_api_cache', 'analyze_news'
    ].includes(actionType)) {
      return 'external_api';
    }

    // Legacy actions that need to be handled by the main handler
    if ([
      'search_content', 'manage_bookmarks', 'generate_pdf', 'automation',
      'smart_recommendation', 'show_statistics', 'generate_report',
      'bulk_operations', 'search_location', 'add_location_note'
    ].includes(actionType)) {
      return 'legacy';
    }

    return null;
  }

  private async loadActionModule(moduleName: string): Promise<any> {
    switch (moduleName) {
      case 'navigation':
        if (!this.navigationActions) {
          if (!NavigationActions) {
            const module = await import('./ai-modules/NavigationActions');
            NavigationActions = module.default;
          }
          this.navigationActions = new NavigationActions();
          if (this.router) {
            this.navigationActions.setRouter(this.router);
          }
        }
        return this.navigationActions;

      case 'study':
        if (!this.studyActions) {
          if (!StudyActions) {
            const module = await import('./ai-modules/StudyActions');
            StudyActions = module.default;
          }
          this.studyActions = new StudyActions();
        }
        return this.studyActions;

      case 'ui_control':
        if (!this.uiControlActions) {
          if (!UIControlActions) {
            const module = await import('./ai-modules/UIControlActions');
            UIControlActions = module.default;
          }
          this.uiControlActions = new UIControlActions();
        }
        return this.uiControlActions;

      case 'external_api':
        if (!this.externalAPIActions) {
          if (!ExternalAPIActions) {
            const module = await import('./ai-modules/ExternalAPIActions');
            ExternalAPIActions = module.default;
          }
          this.externalAPIActions = new ExternalAPIActions();
        }
        return this.externalAPIActions;

      case 'legacy':
        // For legacy actions, fall back to the original handler
        return this.getLegacyHandler();

      default:
        throw new Error(`Unknown action module: ${moduleName}`);
    }
  }

  private async getLegacyHandler(): Promise<any> {
    // Lazy load the original AIActionHandler for legacy actions
    const { default: AIActionHandler } = await import('./AIActionHandler');
    return AIActionHandler.getInstance();
  }

  // Preload commonly used modules for better performance
  async preloadModules(modules: string[] = ['navigation', 'study']): Promise<void> {
    const preloadPromises = modules.map(async (moduleName) => {
      try {
        await this.loadActionModule(moduleName);
      } catch (error) {
        console.warn(`Failed to preload module ${moduleName}:`, error);
      }
    });

    await Promise.all(preloadPromises);
  }

  // Get available actions for current context
  getAvailableActions(context?: AIContext): string[] {
    const actions = [
      // Navigation actions
      'navigate_to_page', 'navigate_to_section',
      
      // Study actions
      'create_study_plan', 'schedule_event', 'set_reminder',
      'start_practice_session', 'analyze_performance', 'generate_custom_quiz',
      
      // UI control actions
      'ui_control', 'form_control', 'toggle_theme', 'customize_interface',
      
      // External API actions
      'get_weather', 'get_news', 'get_quote', 'get_fact', 'get_exchange_rates'
    ];

    return actions;
  }

  // Health check for all modules
  async healthCheck(): Promise<{ [key: string]: boolean }> {
    const modules = ['navigation', 'study', 'ui_control', 'external_api'];
    const health: { [key: string]: boolean } = {};

    for (const moduleName of modules) {
      try {
        await this.loadActionModule(moduleName);
        health[moduleName] = true;
      } catch (error) {
        console.error(`Health check failed for ${moduleName}:`, error);
        health[moduleName] = false;
      }
    }

    return health;
  }

  // Clear module cache (useful for development)
  clearModuleCache(): void {
    this.navigationActions = null;
    this.studyActions = null;
    this.uiControlActions = null;
    this.externalAPIActions = null;
    
    // Clear dynamic imports cache
    NavigationActions = null;
    StudyActions = null;
    UIControlActions = null;
    ExternalAPIActions = null;
  }

  // Get module loading status
  getModuleStatus(): { [key: string]: boolean } {
    return {
      navigation: !!this.navigationActions,
      study: !!this.studyActions,
      ui_control: !!this.uiControlActions,
      external_api: !!this.externalAPIActions
    };
  }

  // Performance metrics
  async measureModuleLoadTime(moduleName: string): Promise<number> {
    const startTime = performance.now();
    
    try {
      await this.loadActionModule(moduleName);
      const endTime = performance.now();
      return endTime - startTime;
    } catch (error) {
      console.error(`Failed to measure load time for ${moduleName}:`, error);
      return -1;
    }
  }

  // Batch action execution
  async executeActions(actions: AIAction[], context?: AIContext): Promise<ActionResult[]> {
    const results: ActionResult[] = [];
    
    for (const action of actions) {
      try {
        const result = await this.executeAction(action, context);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          message: `Failed to execute action ${action.type}: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }
    
    return results;
  }
}

export default AIActionHandlerModular;
