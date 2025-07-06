import toast from 'react-hot-toast';

// External API Integration Service for Enhanced AI Functionality
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: {
    date: string;
    high: number;
    low: number;
    condition: string;
  }[];
}

export interface NewsData {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  upscRelevance: 'high' | 'medium' | 'low';
  tags: string[];
}

export interface QuoteData {
  text: string;
  author: string;
  category: 'motivation' | 'wisdom' | 'success' | 'education';
}

export interface FactData {
  fact: string;
  category: string;
  source: string;
  verified: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
}

class ExternalAPIService {
  private static instance: ExternalAPIService;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private readonly CACHE_TTL = {
    weather: 10 * 60 * 1000, // 10 minutes
    news: 30 * 60 * 1000,    // 30 minutes
    quotes: 24 * 60 * 60 * 1000, // 24 hours
    facts: 60 * 60 * 1000,   // 1 hour
  };

  private constructor() {}

  static getInstance(): ExternalAPIService {
    if (!ExternalAPIService.instance) {
      ExternalAPIService.instance = new ExternalAPIService();
    }
    return ExternalAPIService.instance;
  }

  // Cache management
  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Weather API Integration
  async getWeatherData(location: string = 'Delhi'): Promise<APIResponse<WeatherData>> {
    const cacheKey = `weather-${location}`;
    const cached = this.getCachedData<WeatherData>(cacheKey);
    
    if (cached) {
      return { success: true, data: cached, cached: true };
    }

    try {
      // Using OpenWeatherMap API (free tier)
      const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      
      if (!API_KEY) {
        // Return mock data if no API key
        const mockWeather: WeatherData = {
          location,
          temperature: 28,
          condition: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 12,
          forecast: [
            { date: new Date().toISOString().split('T')[0], high: 32, low: 24, condition: 'Sunny' },
            { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], high: 30, low: 22, condition: 'Cloudy' },
          ]
        };
        
        this.setCachedData(cacheKey, mockWeather, this.CACHE_TTL.weather);
        return { success: true, data: mockWeather };
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      const weatherData: WeatherData = {
        location: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        forecast: [] // Would need additional API call for forecast
      };

      this.setCachedData(cacheKey, weatherData, this.CACHE_TTL.weather);
      return { success: true, data: weatherData };

    } catch (error) {
      console.error('Weather API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch weather data'
      };
    }
  }

  // Enhanced News Integration (using existing APIs)
  async getLatestNews(category?: string): Promise<APIResponse<NewsData[]>> {
    const cacheKey = `news-${category || 'general'}`;
    const cached = this.getCachedData<NewsData[]>(cacheKey);
    
    if (cached) {
      return { success: true, data: cached, cached: true };
    }

    try {
      // Use existing Hindu RSS API
      const response = await fetch('/api/news/hindu-rss');
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch news');
      }

      const newsData: NewsData[] = result.articles.map((article: any) => ({
        id: article.id,
        title: article.title,
        summary: article.summary || article.title,
        url: article.url,
        source: 'The Hindu',
        publishedAt: article.publishedAt,
        category: article.category || 'general',
        upscRelevance: article.upscRelevance || 'medium',
        tags: article.tags || []
      }));

      this.setCachedData(cacheKey, newsData, this.CACHE_TTL.news);
      return { success: true, data: newsData };

    } catch (error) {
      console.error('News API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch news data'
      };
    }
  }

  // Motivational Quotes API
  async getMotivationalQuote(): Promise<APIResponse<QuoteData>> {
    const cacheKey = 'quote-daily';
    const cached = this.getCachedData<QuoteData>(cacheKey);
    
    if (cached) {
      return { success: true, data: cached, cached: true };
    }

    try {
      // Using quotable.io API (free)
      const response = await fetch('https://api.quotable.io/random?tags=motivational,success,wisdom');
      
      if (!response.ok) {
        // Fallback to local quotes
        const fallbackQuotes: QuoteData[] = [
          { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "motivation" },
          { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "success" },
          { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela", category: "education" },
        ];
        
        const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        this.setCachedData(cacheKey, randomQuote, this.CACHE_TTL.quotes);
        return { success: true, data: randomQuote };
      }

      const data = await response.json();
      
      const quoteData: QuoteData = {
        text: data.content,
        author: data.author,
        category: 'motivation'
      };

      this.setCachedData(cacheKey, quoteData, this.CACHE_TTL.quotes);
      return { success: true, data: quoteData };

    } catch (error) {
      console.error('Quote API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch quote'
      };
    }
  }

  // Random Facts API
  async getRandomFact(): Promise<APIResponse<FactData>> {
    const cacheKey = 'fact-random';
    
    try {
      // Using uselessfacts.jsph.pl API (free)
      const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
      
      if (!response.ok) {
        // Fallback to local facts
        const fallbackFacts: FactData[] = [
          { fact: "India has the world's largest postal network with over 1,55,000 post offices.", category: "geography", source: "India Post", verified: true },
          { fact: "The Indian Constitution is the longest written constitution in the world.", category: "polity", source: "Constitution of India", verified: true },
          { fact: "India is home to 70% of the world's tigers.", category: "environment", source: "WWF", verified: true },
        ];
        
        const randomFact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];
        return { success: true, data: randomFact };
      }

      const data = await response.json();
      
      const factData: FactData = {
        fact: data.text,
        category: 'general',
        source: 'uselessfacts.jsph.pl',
        verified: false
      };

      return { success: true, data: factData };

    } catch (error) {
      console.error('Facts API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch fact'
      };
    }
  }

  // Currency Exchange Rates (useful for economics)
  async getExchangeRates(baseCurrency: string = 'USD'): Promise<APIResponse<any>> {
    const cacheKey = `exchange-${baseCurrency}`;
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return { success: true, data: cached, cached: true };
    }

    try {
      // Using exchangerate-api.com (free tier)
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
      
      if (!response.ok) {
        throw new Error(`Exchange rate API error: ${response.status}`);
      }

      const data = await response.json();
      
      this.setCachedData(cacheKey, data, this.CACHE_TTL.facts);
      return { success: true, data };

    } catch (error) {
      console.error('Exchange rate API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch exchange rates'
      };
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    toast.success('API cache cleared');
  }

  // Get cache status
  getCacheStatus(): { key: string; size: number; age: number }[] {
    const status: { key: string; size: number; age: number }[] = [];
    
    this.cache.forEach((value, key) => {
      status.push({
        key,
        size: JSON.stringify(value.data).length,
        age: Date.now() - value.timestamp
      });
    });
    
    return status;
  }
}

export default ExternalAPIService;
