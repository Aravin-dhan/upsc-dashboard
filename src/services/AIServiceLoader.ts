/**
 * Dynamic AI Service Loader
 * Implements code splitting for AI services to improve build performance
 */

import { AIAction } from './AIContextService';

// Service interfaces for type safety
export interface IAIActionHandler {
  executeAction(action: AIAction, context?: any): Promise<any>;
  setRouter(router: any): void;
  initializeUIElements(): void;
}

export interface IAICommandParser {
  parseCommand(command: string): Promise<any>;
  addCustomPattern(pattern: any): void;
  generateContextualSuggestions(pathname: string, recentActivity: any[]): string[];
}

export interface IAIContextService {
  updateContext(context: any): void;
  getContext(): any;
  gatherContext(pathname: string): Promise<any>;
  getAICapabilities(context: any): any[];
  generateRecommendations(): Promise<any[]>;
  generateSmartRecommendations(context: any): any[];
}

export interface IExternalAPIService {
  getWeatherData(location?: string): Promise<any>;
  getLatestNews(category?: string): Promise<any>;
  getMotivationalQuote(): Promise<any>;
  getRandomFact(): Promise<any>;
  getExchangeRates(baseCurrency?: string): Promise<any>;
  clearCache(): void;
}

// Service loader class with lazy loading
class AIServiceLoader {
  private static instance: AIServiceLoader;
  private loadedServices: Map<string, any> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();

  private constructor() {}

  public static getInstance(): AIServiceLoader {
    if (!AIServiceLoader.instance) {
      AIServiceLoader.instance = new AIServiceLoader();
    }
    return AIServiceLoader.instance;
  }

  /**
   * Dynamically load AI Action Handler
   */
  public async loadActionHandler(): Promise<IAIActionHandler> {
    const serviceName = 'AIActionHandler';
    
    if (this.loadedServices.has(serviceName)) {
      return this.loadedServices.get(serviceName);
    }

    if (this.loadingPromises.has(serviceName)) {
      return this.loadingPromises.get(serviceName);
    }

    const loadingPromise = this.loadActionHandlerInternal();
    this.loadingPromises.set(serviceName, loadingPromise);

    try {
      const service = await loadingPromise;
      this.loadedServices.set(serviceName, service);
      this.loadingPromises.delete(serviceName);
      return service;
    } catch (error) {
      this.loadingPromises.delete(serviceName);
      throw error;
    }
  }

  private async loadActionHandlerInternal(): Promise<IAIActionHandler> {
    const { default: AIActionHandlerModular } = await import('./AIActionHandlerModular');
    return AIActionHandlerModular.getInstance();
  }

  /**
   * Dynamically load AI Command Parser
   */
  public async loadCommandParser(): Promise<IAICommandParser> {
    const serviceName = 'AICommandParser';
    
    if (this.loadedServices.has(serviceName)) {
      return this.loadedServices.get(serviceName);
    }

    if (this.loadingPromises.has(serviceName)) {
      return this.loadingPromises.get(serviceName);
    }

    const loadingPromise = this.loadCommandParserInternal();
    this.loadingPromises.set(serviceName, loadingPromise);

    try {
      const service = await loadingPromise;
      this.loadedServices.set(serviceName, service);
      this.loadingPromises.delete(serviceName);
      return service;
    } catch (error) {
      this.loadingPromises.delete(serviceName);
      throw error;
    }
  }

  private async loadCommandParserInternal(): Promise<IAICommandParser> {
    const { default: AICommandParser } = await import('./AICommandParser');
    return AICommandParser.getInstance();
  }

  /**
   * Dynamically load AI Context Service
   */
  public async loadContextService(): Promise<IAIContextService> {
    const serviceName = 'AIContextService';
    
    if (this.loadedServices.has(serviceName)) {
      return this.loadedServices.get(serviceName);
    }

    if (this.loadingPromises.has(serviceName)) {
      return this.loadingPromises.get(serviceName);
    }

    const loadingPromise = this.loadContextServiceInternal();
    this.loadingPromises.set(serviceName, loadingPromise);

    try {
      const service = await loadingPromise;
      this.loadedServices.set(serviceName, service);
      this.loadingPromises.delete(serviceName);
      return service;
    } catch (error) {
      this.loadingPromises.delete(serviceName);
      throw error;
    }
  }

  private async loadContextServiceInternal(): Promise<IAIContextService> {
    const { default: AIContextService } = await import('./AIContextService');
    return AIContextService.getInstance();
  }

  /**
   * Dynamically load External API Service
   */
  public async loadExternalAPIService(): Promise<IExternalAPIService> {
    const serviceName = 'ExternalAPIService';
    
    if (this.loadedServices.has(serviceName)) {
      return this.loadedServices.get(serviceName);
    }

    if (this.loadingPromises.has(serviceName)) {
      return this.loadingPromises.get(serviceName);
    }

    const loadingPromise = this.loadExternalAPIServiceInternal();
    this.loadingPromises.set(serviceName, loadingPromise);

    try {
      const service = await loadingPromise;
      this.loadedServices.set(serviceName, service);
      this.loadingPromises.delete(serviceName);
      return service;
    } catch (error) {
      this.loadingPromises.delete(serviceName);
      throw error;
    }
  }

  private async loadExternalAPIServiceInternal(): Promise<IExternalAPIService> {
    const { default: ExternalAPIService } = await import('./ExternalAPIService');
    return ExternalAPIService.getInstance();
  }

  /**
   * Preload critical AI services for better UX
   */
  public async preloadCriticalServices(): Promise<void> {
    try {
      // Load context service first as it's needed by others
      await this.loadContextService();
      
      // Load command parser for immediate command processing
      await this.loadCommandParser();
      
      // Action handler can be loaded on demand
      // External API service can be loaded on demand
    } catch (error) {
      console.warn('Failed to preload critical AI services:', error);
    }
  }

  /**
   * Load all AI services (for full functionality)
   */
  public async loadAllServices(): Promise<{
    actionHandler: IAIActionHandler;
    commandParser: IAICommandParser;
    contextService: IAIContextService;
    externalAPIService: IExternalAPIService;
  }> {
    const [actionHandler, commandParser, contextService, externalAPIService] = await Promise.all([
      this.loadActionHandler(),
      this.loadCommandParser(),
      this.loadContextService(),
      this.loadExternalAPIService(),
    ]);

    return {
      actionHandler,
      commandParser,
      contextService,
      externalAPIService,
    };
  }

  /**
   * Clear loaded services (for memory management)
   */
  public clearServices(): void {
    this.loadedServices.clear();
    this.loadingPromises.clear();
  }

  /**
   * Get service loading status
   */
  public getLoadingStatus(): Record<string, boolean> {
    return {
      AIActionHandler: this.loadedServices.has('AIActionHandler'),
      AICommandParser: this.loadedServices.has('AICommandParser'),
      AIContextService: this.loadedServices.has('AIContextService'),
      ExternalAPIService: this.loadedServices.has('ExternalAPIService'),
    };
  }
}

export default AIServiceLoader;
