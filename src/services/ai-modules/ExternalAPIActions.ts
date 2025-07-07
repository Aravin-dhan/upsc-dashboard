/**
 * External API Actions Module
 * Handles all external API-related AI actions
 */

import toast from 'react-hot-toast';
import { AIAction, AIContext } from '../AIContextService';
import ExternalAPIService from '../ExternalAPIService';

export interface ActionResult {
  success: boolean;
  message: string;
  data?: any;
  nextActions?: AIAction[];
}

export class ExternalAPIActions {
  private externalAPIService = ExternalAPIService.getInstance();

  async executeAction(action: AIAction, context?: AIContext): Promise<ActionResult> {
    switch (action.type) {
      case 'get_weather':
        return this.getWeatherData(action.payload, context);
      case 'get_news':
        return this.getLatestNews(action.payload, context);
      case 'get_quote':
        return this.getMotivationalQuote(action.payload, context);
      case 'get_fact':
        return this.getRandomFact(action.payload, context);
      case 'get_exchange_rates':
        return this.getExchangeRates(action.payload, context);
      case 'clear_api_cache':
        return this.clearAPICache(action.payload, context);
      case 'analyze_news':
        return this.analyzeNews(action.payload, context);
      default:
        throw new Error(`Unsupported external API action: ${action.type}`);
    }
  }

  private async getWeatherData(payload: { location?: string; units?: string }, context?: AIContext): Promise<ActionResult> {
    try {
      const location = payload.location || 'Delhi';
      const units = payload.units || 'metric';

      const weatherData = await this.externalAPIService.getWeatherData(location);
      
      if (!weatherData) {
        return {
          success: false,
          message: 'Failed to fetch weather data'
        };
      }

      toast.success(`Weather data fetched for ${location}`);

      return {
        success: true,
        message: `Weather data retrieved for ${location}`,
        data: weatherData,
        nextActions: [
          {
            type: 'show_weather_widget',
            payload: { weatherData },
            description: 'Display weather widget'
          }
        ]
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to get weather data: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async getLatestNews(payload: { category?: string; country?: string; limit?: number }, context?: AIContext): Promise<ActionResult> {
    try {
      const category = payload.category || 'general';
      const country = payload.country || 'in';
      const limit = payload.limit || 10;

      const newsData = await this.externalAPIService.getLatestNews(category);
      
      if (!newsData || !newsData.success || !newsData.data) {
        return {
          success: false,
          message: 'Failed to fetch news data'
        };
      }

      toast.success(`Latest ${category} news fetched`);

      return {
        success: true,
        message: `Latest ${category} news retrieved`,
        data: newsData.data,
        nextActions: [
          {
            type: 'navigate_to_page',
            payload: { page: '/news' },
            description: 'View news page'
          },
          {
            type: 'analyze_news',
            payload: { articles: newsData.data },
            description: 'Analyze news for UPSC relevance'
          }
        ]
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to get news: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async getMotivationalQuote(payload: { category?: string }, context?: AIContext): Promise<ActionResult> {
    try {
      const category = payload.category || 'motivational';
      const quote = await this.externalAPIService.getMotivationalQuote();
      
      if (!quote) {
        return {
          success: false,
          message: 'Failed to fetch motivational quote'
        };
      }

      toast.success('Motivational quote fetched');

      return {
        success: true,
        message: 'Motivational quote retrieved',
        data: quote,
        nextActions: [
          {
            type: 'show_quote_widget',
            payload: { quote },
            description: 'Display quote widget'
          }
        ]
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to get quote: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async getRandomFact(payload: { category?: string }, context?: AIContext): Promise<ActionResult> {
    try {
      const category = payload.category || 'general';
      const fact = await this.externalAPIService.getRandomFact();
      
      if (!fact) {
        return {
          success: false,
          message: 'Failed to fetch random fact'
        };
      }

      toast.success('Random fact fetched');

      return {
        success: true,
        message: 'Random fact retrieved',
        data: fact,
        nextActions: [
          {
            type: 'show_fact_widget',
            payload: { fact },
            description: 'Display fact widget'
          }
        ]
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to get fact: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async getExchangeRates(payload: { baseCurrency?: string; targetCurrencies?: string[] }, context?: AIContext): Promise<ActionResult> {
    try {
      const baseCurrency = payload.baseCurrency || 'USD';
      const targetCurrencies = payload.targetCurrencies || ['INR', 'EUR', 'GBP'];

      const exchangeRates = await this.externalAPIService.getExchangeRates(baseCurrency);
      
      if (!exchangeRates) {
        return {
          success: false,
          message: 'Failed to fetch exchange rates'
        };
      }

      toast.success('Exchange rates fetched');

      return {
        success: true,
        message: 'Exchange rates retrieved',
        data: exchangeRates,
        nextActions: [
          {
            type: 'show_exchange_widget',
            payload: { exchangeRates },
            description: 'Display exchange rates widget'
          }
        ]
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to get exchange rates: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async clearAPICache(payload: { service?: string }, context?: AIContext): Promise<ActionResult> {
    try {
      const service = payload.service || 'all';
      
      // Clear cache for specific service or all services
      if (service === 'all') {
        this.externalAPIService.clearCache();
        toast.success('All API cache cleared');
      } else {
        this.externalAPIService.clearCache();
        toast.success(`${service} cache cleared`);
      }

      return {
        success: true,
        message: `${service === 'all' ? 'All' : service} cache cleared successfully`,
        data: { service, clearedAt: new Date().toISOString() }
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to clear cache: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async analyzeNews(payload: { articles?: any[]; article?: any; type?: string }, context?: AIContext): Promise<ActionResult> {
    try {
      const { articles, article, type } = payload;
      
      if (article) {
        // Analyze single article
        const analysis = {
          title: article.title,
          summary: this.generateSummary(article.description || article.content),
          upscRelevance: this.assessUPSCRelevance(article),
          keyTopics: this.extractKeyTopics(article),
          analyzedAt: new Date().toISOString()
        };

        return {
          success: true,
          message: `Article analyzed successfully`,
          data: { analysis },
          nextActions: [
            {
              type: 'save_analysis',
              payload: { analysis },
              description: 'Save analysis for future reference'
            }
          ]
        };
      }

      if (articles && articles.length > 0) {
        // Analyze multiple articles
        const analyses = articles.map(article => ({
          title: article.title,
          upscRelevance: this.assessUPSCRelevance(article),
          keyTopics: this.extractKeyTopics(article)
        }));

        const summary = {
          totalArticles: articles.length,
          highRelevance: analyses.filter(a => a.upscRelevance === 'High').length,
          mediumRelevance: analyses.filter(a => a.upscRelevance === 'Medium').length,
          lowRelevance: analyses.filter(a => a.upscRelevance === 'Low').length,
          topTopics: this.getTopTopics(analyses),
          analyzedAt: new Date().toISOString()
        };

        return {
          success: true,
          message: `${articles.length} articles analyzed`,
          data: { summary, analyses },
          nextActions: [
            {
              type: 'generate_study_notes',
              payload: { analyses },
              description: 'Generate study notes from analysis'
            }
          ]
        };
      }

      return {
        success: false,
        message: 'No articles provided for analysis'
      };
    } catch (error) {
      return {
        success: false,
        message: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Helper methods
  private generateSummary(content: string): string {
    if (!content) return 'No content available';
    
    // Simple summary generation (first 200 characters)
    return content.length > 200 ? content.substring(0, 200) + '...' : content;
  }

  private assessUPSCRelevance(article: any): string {
    const title = (article.title || '').toLowerCase();
    const description = (article.description || '').toLowerCase();
    const content = title + ' ' + description;

    // Keywords that indicate high UPSC relevance
    const highRelevanceKeywords = [
      'government', 'policy', 'parliament', 'constitution', 'supreme court',
      'election', 'economy', 'gdp', 'inflation', 'budget', 'international',
      'diplomacy', 'environment', 'climate', 'science', 'technology',
      'space', 'defense', 'security', 'education', 'health'
    ];

    // Keywords that indicate medium relevance
    const mediumRelevanceKeywords = [
      'india', 'indian', 'national', 'state', 'minister', 'ministry',
      'development', 'social', 'cultural', 'historical', 'geography'
    ];

    const highMatches = highRelevanceKeywords.filter(keyword => content.includes(keyword)).length;
    const mediumMatches = mediumRelevanceKeywords.filter(keyword => content.includes(keyword)).length;

    if (highMatches >= 2) return 'High';
    if (highMatches >= 1 || mediumMatches >= 2) return 'Medium';
    return 'Low';
  }

  private extractKeyTopics(article: any): string[] {
    const content = ((article.title || '') + ' ' + (article.description || '')).toLowerCase();
    const topics = [];

    // Common UPSC topics
    const topicKeywords = {
      'Polity': ['government', 'parliament', 'constitution', 'election', 'democracy'],
      'Economy': ['economy', 'gdp', 'inflation', 'budget', 'finance', 'trade'],
      'International Relations': ['international', 'diplomacy', 'foreign', 'bilateral', 'multilateral'],
      'Environment': ['environment', 'climate', 'pollution', 'conservation', 'sustainability'],
      'Science & Technology': ['science', 'technology', 'research', 'innovation', 'space'],
      'Geography': ['geography', 'river', 'mountain', 'climate', 'natural'],
      'History': ['history', 'historical', 'ancient', 'medieval', 'modern'],
      'Current Affairs': ['current', 'recent', 'latest', 'today', 'news']
    };

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => content.includes(keyword))) {
        topics.push(topic);
      }
    }

    return topics.length > 0 ? topics : ['General'];
  }

  private getTopTopics(analyses: any[]): string[] {
    const topicCount: Record<string, number> = {};
    
    analyses.forEach(analysis => {
      analysis.keyTopics.forEach((topic: string) => {
        topicCount[topic] = (topicCount[topic] || 0) + 1;
      });
    });

    return Object.entries(topicCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic);
  }
}

export default ExternalAPIActions;
