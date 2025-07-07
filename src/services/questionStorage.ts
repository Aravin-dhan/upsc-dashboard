// Question Storage Service for UPSC Previous Year Questions
import { Question, QuestionPaper, QuestionFilter, QuestionSearchResult, QuestionStats } from '@/types/questions';
import { TenantStorageService } from '@/services/TenantStorageService';
import fs from 'fs';
import path from 'path';

export class QuestionStorageService {
  private storage: TenantStorageService;
  private readonly QUESTIONS_KEY = 'upsc_questions';
  private readonly QUESTION_PAPERS_KEY = 'upsc_question_papers';
  private readonly QUESTION_STATS_KEY = 'upsc_question_stats';
  private readonly tenantId: string;
  private readonly userId: string;

  constructor(tenantId?: string, userId?: string) {
    this.tenantId = tenantId || 'default';
    this.userId = userId || 'default';
    this.storage = TenantStorageService.getInstance({
      tenantId: this.tenantId,
      userId: this.userId,
      useAPI: false
    });
  }

  /**
   * Get the storage directory path for server-side storage
   */
  private getStorageDir(): string {
    const storageDir = path.join(process.cwd(), 'data', 'questions', this.tenantId);
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    return storageDir;
  }

  /**
   * Server-side file storage methods
   */
  private setServerData<T>(key: string, data: T): void {
    if (typeof window !== 'undefined') return; // Only use on server

    try {
      const storageDir = this.getStorageDir();
      const filePath = path.join(storageDir, `${key}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving server data:', error);
    }
  }

  private getServerData<T>(key: string, defaultValue?: T): T | null {
    if (typeof window !== 'undefined') return defaultValue || null; // Only use on server

    try {
      const storageDir = this.getStorageDir();
      const filePath = path.join(storageDir, `${key}.json`);

      if (!fs.existsSync(filePath)) {
        return defaultValue || null;
      }

      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading server data:', error);
      return defaultValue || null;
    }
  }

  /**
   * Universal storage methods that work on both client and server
   */
  private setData<T>(key: string, data: T): void {
    if (typeof window === 'undefined') {
      // Server-side: use file storage
      this.setServerData(key, data);
    } else {
      // Client-side: use localStorage via TenantStorageService
      this.storage.setLocalData(key, data);
    }
  }

  private getData<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') {
      // Server-side: use file storage
      return this.getServerData(key, defaultValue);
    } else {
      // Client-side: use localStorage via TenantStorageService
      return this.storage.getLocalData(key, defaultValue);
    }
  }

  /**
   * Save parsed questions to storage
   */
  async saveQuestions(questions: Question[]): Promise<void> {
    this.setData(this.QUESTIONS_KEY, questions);
    await this.updateStats(questions);
  }

  /**
   * Save question papers to storage
   */
  async saveQuestionPapers(papers: QuestionPaper[]): Promise<void> {
    this.setData(this.QUESTION_PAPERS_KEY, papers);
  }

  /**
   * Get all questions
   */
  async getAllQuestions(): Promise<Question[]> {
    return this.getData<Question[]>(this.QUESTIONS_KEY, []) || [];
  }

  /**
   * Get all question papers
   */
  async getAllQuestionPapers(): Promise<QuestionPaper[]> {
    return this.getData<QuestionPaper[]>(this.QUESTION_PAPERS_KEY, []) || [];
  }

  /**
   * Get question statistics
   */
  async getQuestionStats(): Promise<QuestionStats | null> {
    return this.getData<QuestionStats>(this.QUESTION_STATS_KEY, undefined);
  }

  /**
   * Search questions with filters
   */
  async searchQuestions(
    filters: QuestionFilter = {},
    searchQuery?: string,
    sortBy: 'year' | 'difficulty' | 'marks' | 'relevance' = 'year',
    sortOrder: 'asc' | 'desc' = 'desc',
    limit: number = 50,
    offset: number = 0
  ): Promise<QuestionSearchResult> {
    const allQuestions = await this.getAllQuestions();
    
    // Apply filters
    let filteredQuestions = this.applyFilters(allQuestions, filters);
    
    // Apply search query
    if (searchQuery) {
      filteredQuestions = this.applySearchQuery(filteredQuestions, searchQuery);
    }
    
    // Sort questions
    filteredQuestions = this.sortQuestions(filteredQuestions, sortBy, sortOrder);
    
    // Apply pagination
    const totalCount = filteredQuestions.length;
    const paginatedQuestions = filteredQuestions.slice(offset, offset + limit);
    
    return {
      questions: paginatedQuestions,
      totalCount,
      filters,
      searchQuery,
      sortBy,
      sortOrder
    };
  }

  /**
   * Get questions by year
   */
  async getQuestionsByYear(year: number): Promise<Question[]> {
    const allQuestions = await this.getAllQuestions();
    return allQuestions.filter(q => q.year === year);
  }

  /**
   * Get questions by subject
   */
  async getQuestionsBySubject(subject: string): Promise<Question[]> {
    const allQuestions = await this.getAllQuestions();
    return allQuestions.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
  }

  /**
   * Get questions by paper type
   */
  async getQuestionsByPaperType(paperType: string): Promise<Question[]> {
    const allQuestions = await this.getAllQuestions();
    return allQuestions.filter(q => q.paperType === paperType);
  }

  /**
   * Get random questions for practice
   */
  async getRandomQuestions(count: number = 10, filters?: QuestionFilter): Promise<Question[]> {
    const allQuestions = await this.getAllQuestions();
    let filteredQuestions = filters ? this.applyFilters(allQuestions, filters) : allQuestions;
    
    // Shuffle array and take first 'count' items
    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Apply filters to questions
   */
  private applyFilters(questions: Question[], filters: QuestionFilter): Question[] {
    return questions.filter(question => {
      // Year filter
      if (filters.year && filters.year.length > 0) {
        if (!filters.year.includes(question.year)) return false;
      }
      
      // Exam type filter
      if (filters.examType && filters.examType.length > 0) {
        if (!filters.examType.includes(question.examType)) return false;
      }
      
      // Paper type filter
      if (filters.paperType && filters.paperType.length > 0) {
        if (!filters.paperType.includes(question.paperType)) return false;
      }
      
      // Subject filter
      if (filters.subject && Array.isArray(filters.subject) && filters.subject.length > 0) {
        if (!filters.subject.some(s => question.subject.toLowerCase().includes(s.toLowerCase()))) return false;
      }

      // Topic filter
      if (filters.topic && Array.isArray(filters.topic) && filters.topic.length > 0) {
        if (!filters.topic.some(t => question.topic.toLowerCase().includes(t.toLowerCase()))) return false;
      }
      
      // Difficulty filter
      if (filters.difficulty && filters.difficulty.length > 0) {
        if (!filters.difficulty.includes(question.difficulty)) return false;
      }
      
      // Question type filter
      if (filters.questionType && filters.questionType.length > 0) {
        if (!filters.questionType.includes(question.questionType)) return false;
      }
      
      // Keywords filter
      if (filters.keywords && filters.keywords.length > 0) {
        const hasKeyword = filters.keywords.some(keyword =>
          question.keywords.some(qKeyword => 
            qKeyword.toLowerCase().includes(keyword.toLowerCase())
          )
        );
        if (!hasKeyword) return false;
      }
      
      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const hasTag = filters.tags.some(tag =>
          question.tags.some(qTag => 
            qTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasTag) return false;
      }
      
      return true;
    });
  }

  /**
   * Apply search query to questions
   */
  private applySearchQuery(questions: Question[], searchQuery: string): Question[] {
    const query = searchQuery.toLowerCase();
    
    return questions.filter(question => {
      // Search in question text
      if (question.questionText.toLowerCase().includes(query)) return true;
      
      // Search in subject
      if (question.subject.toLowerCase().includes(query)) return true;
      
      // Search in topic
      if (question.topic.toLowerCase().includes(query)) return true;
      
      // Search in keywords
      if (question.keywords.some(keyword => keyword.toLowerCase().includes(query))) return true;
      
      // Search in tags
      if (question.tags.some(tag => tag.toLowerCase().includes(query))) return true;
      
      return false;
    });
  }

  /**
   * Sort questions
   */
  private sortQuestions(
    questions: Question[], 
    sortBy: 'year' | 'difficulty' | 'marks' | 'relevance', 
    sortOrder: 'asc' | 'desc'
  ): Question[] {
    const sorted = [...questions].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'year':
          comparison = a.year - b.year;
          break;
        case 'marks':
          comparison = a.marks - b.marks;
          break;
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          break;
        case 'relevance':
          // For relevance, we could implement a scoring system
          // For now, sort by year (most recent first)
          comparison = a.year - b.year;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }

  /**
   * Update question statistics
   */
  private async updateStats(questions: Question[]): Promise<void> {
    const stats: QuestionStats = {
      totalQuestions: questions.length,
      byYear: {},
      bySubject: {},
      byTopic: {},
      byDifficulty: {},
      byExamType: {},
      byPaperType: {},
      byQuestionType: {}
    };

    questions.forEach(q => {
      // Count by year
      stats.byYear[q.year] = (stats.byYear[q.year] || 0) + 1;
      
      // Count by subject
      stats.bySubject[q.subject] = (stats.bySubject[q.subject] || 0) + 1;
      
      // Count by topic
      stats.byTopic[q.topic] = (stats.byTopic[q.topic] || 0) + 1;
      
      // Count by difficulty
      stats.byDifficulty[q.difficulty] = (stats.byDifficulty[q.difficulty] || 0) + 1;
      
      // Count by exam type
      stats.byExamType[q.examType] = (stats.byExamType[q.examType] || 0) + 1;
      
      // Count by paper type
      stats.byPaperType[q.paperType] = (stats.byPaperType[q.paperType] || 0) + 1;
      
      // Count by question type
      stats.byQuestionType[q.questionType] = (stats.byQuestionType[q.questionType] || 0) + 1;
    });

    this.setData(this.QUESTION_STATS_KEY, stats);
  }

  /**
   * Clear all question data
   */
  async clearAllData(): Promise<void> {
    this.storage.removeLocalData(this.QUESTIONS_KEY);
    this.storage.removeLocalData(this.QUESTION_PAPERS_KEY);
    this.storage.removeLocalData(this.QUESTION_STATS_KEY);
  }

  /**
   * Get data size information
   */
  async getDataInfo(): Promise<{
    questionsCount: number;
    papersCount: number;
    storageSize: number;
  }> {
    const questions = await this.getAllQuestions();
    const papers = await this.getAllQuestionPapers();
    
    // Estimate storage size (rough calculation)
    const questionsSize = JSON.stringify(questions).length;
    const papersSize = JSON.stringify(papers).length;
    
    return {
      questionsCount: questions.length,
      papersCount: papers.length,
      storageSize: questionsSize + papersSize
    };
  }
}
