import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDhuFGySigse5Yk8K2dMcQ8Jxv8_Je1bRA');

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    tokens?: number;
    model?: string;
    processingTime?: number;
  };
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    totalTokens?: number;
    messageCount?: number;
    lastActivity?: Date;
  };
}

export interface AIResponse {
  content: string;
  success: boolean;
  error?: string;
  metadata?: {
    tokens?: number;
    model?: string;
    processingTime?: number;
    cached?: boolean;
  };
}

export class GeminiAIService {
  private model: any;
  private cache: Map<string, { response: string; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  private getCacheKey(prompt: string, context?: string): string {
    return `${prompt}_${context || ''}`.replace(/\s+/g, '_').toLowerCase();
  }

  private isValidCacheEntry(entry: { response: string; timestamp: number }): boolean {
    return Date.now() - entry.timestamp < this.CACHE_DURATION;
  }

  async generateResponse(
    prompt: string,
    context?: string,
    options?: {
      maxTokens?: number;
      temperature?: number;
      useCache?: boolean;
    }
  ): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      // Check cache first
      if (options?.useCache !== false) {
        const cacheKey = this.getCacheKey(prompt, context);
        const cached = this.cache.get(cacheKey);
        
        if (cached && this.isValidCacheEntry(cached)) {
          return {
            content: cached.response,
            success: true,
            metadata: {
              cached: true,
              processingTime: Date.now() - startTime,
              model: 'gemini-pro'
            }
          };
        }
      }

      // Prepare the full prompt with UPSC context
      const fullPrompt = this.buildUPSCPrompt(prompt, context);
      
      // Generate response
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      // Cache the response
      if (options?.useCache !== false) {
        const cacheKey = this.getCacheKey(prompt, context);
        this.cache.set(cacheKey, {
          response: text,
          timestamp: Date.now()
        });
      }

      return {
        content: text,
        success: true,
        metadata: {
          processingTime: Date.now() - startTime,
          model: 'gemini-pro',
          cached: false
        }
      };

    } catch (error) {
      console.error('Gemini AI Error:', error);
      return {
        content: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown AI error',
        metadata: {
          processingTime: Date.now() - startTime,
          model: 'gemini-pro'
        }
      };
    }
  }

  private buildUPSCPrompt(userPrompt: string, context?: string): string {
    const systemContext = `You are an expert UPSC (Union Public Service Commission) preparation assistant. You have comprehensive knowledge of:

1. UPSC Civil Services Examination pattern, syllabus, and requirements
2. Indian polity, governance, constitution, and public administration
3. Indian and world geography, environment, and ecology
4. Indian history, art, and culture
5. Economic and social development
6. General studies, current affairs, and contemporary issues
7. Ethics, integrity, and aptitude
8. Optional subjects and their preparation strategies

Your responses should be:
- Accurate and factual
- Tailored for UPSC preparation
- Structured and easy to understand
- Motivational and encouraging
- Include practical study tips when relevant
- Reference official sources when possible

${context ? `Additional context: ${context}` : ''}

User query: ${userPrompt}

Please provide a comprehensive and helpful response:`;

    return systemContext;
  }

  async analyzeAnswer(
    question: string,
    userAnswer: string,
    subject?: string
  ): Promise<AIResponse> {
    const analysisPrompt = `Analyze this UPSC answer and provide detailed feedback:

Question: ${question}
${subject ? `Subject: ${subject}` : ''}

Student's Answer:
${userAnswer}

Please provide analysis in this format:
1. CONTENT ACCURACY (Score: X/10)
   - Factual correctness
   - Completeness of coverage
   - Relevance to question

2. PRESENTATION & STRUCTURE (Score: X/10)
   - Introduction and conclusion
   - Logical flow and organization
   - Use of headings and bullet points

3. KEYWORD USAGE (Score: X/10)
   - Technical terminology
   - Subject-specific vocabulary
   - UPSC-relevant keywords

4. IMPROVEMENT SUGGESTIONS
   - Specific areas to enhance
   - Missing key points
   - Better structuring tips

5. OVERALL SCORE: X/30
6. GRADE: [Excellent/Good/Average/Needs Improvement]

Provide constructive feedback that helps improve UPSC answer writing skills.`;

    return this.generateResponse(analysisPrompt, undefined, { useCache: false });
  }

  async generateStudyPlan(
    examDate: string,
    currentLevel: string,
    weakAreas: string[],
    availableHours: number
  ): Promise<AIResponse> {
    const planPrompt = `Create a personalized UPSC study plan with these details:

Exam Date: ${examDate}
Current Preparation Level: ${currentLevel}
Weak Areas: ${weakAreas.join(', ')}
Daily Study Hours Available: ${availableHours}

Please provide a structured study plan including:
1. Phase-wise preparation timeline
2. Subject-wise time allocation
3. Daily/weekly study schedule
4. Revision strategy
5. Mock test schedule
6. Current affairs integration
7. Specific focus on weak areas

Make it practical and achievable.`;

    return this.generateResponse(planPrompt);
  }

  async getPersonalizedRecommendations(
    userActivity: any,
    studyHistory: any,
    preferences: any
  ): Promise<AIResponse> {
    const recommendationPrompt = `Based on this user's UPSC preparation data, provide personalized recommendations:

Recent Activity: ${JSON.stringify(userActivity)}
Study History: ${JSON.stringify(studyHistory)}
Preferences: ${JSON.stringify(preferences)}

Provide recommendations for:
1. Next topics to study
2. Practice questions to attempt
3. Current affairs articles to read
4. Revision schedule adjustments
5. Study method improvements

Keep recommendations specific and actionable.`;

    return this.generateResponse(recommendationPrompt);
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

// Singleton instance
export const geminiAI = new GeminiAIService();
