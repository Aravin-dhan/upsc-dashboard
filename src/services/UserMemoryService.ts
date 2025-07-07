export interface UserMemory {
  id: string;
  userId: string;
  type: 'preference' | 'goal' | 'weakness' | 'strength' | 'habit' | 'context';
  content: string;
  metadata: {
    subject?: string;
    importance: 'low' | 'medium' | 'high';
    lastUpdated: string;
    frequency: number; // How often this memory is referenced
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  preferences: {
    studyStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
    studyTime: 'morning' | 'afternoon' | 'evening' | 'night';
    responseStyle: 'concise' | 'detailed' | 'mentor' | 'tool';
  };
  goals: {
    examDate?: string;
    targetScore?: number;
    weakSubjects: string[];
    strongSubjects: string[];
  };
  context: {
    currentFocus?: string;
    recentTopics: string[];
    frequentQuestions: string[];
  };
}

export class UserMemoryService {
  private memories: Map<string, UserMemory> = new Map();
  private userProfile: UserProfile | null = null;
  private readonly STORAGE_KEY = 'upsc_user_memory';
  private readonly PROFILE_KEY = 'upsc_user_profile';

  constructor() {
    this.loadMemories();
    this.loadProfile();
  }

  private loadMemories(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const memoriesArray: UserMemory[] = JSON.parse(stored);
        memoriesArray.forEach(memory => {
          this.memories.set(memory.id, memory);
        });
      }
    } catch (error) {
      console.error('Error loading user memories:', error);
    }
  }

  private saveMemories(): void {
    try {
      const memoriesArray = Array.from(this.memories.values());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(memoriesArray));
    } catch (error) {
      console.error('Error saving user memories:', error);
    }
  }

  private loadProfile(): void {
    try {
      const stored = localStorage.getItem(this.PROFILE_KEY);
      if (stored) {
        this.userProfile = JSON.parse(stored);
      } else {
        this.userProfile = this.getDefaultProfile();
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.userProfile = this.getDefaultProfile();
    }
  }

  private saveProfile(): void {
    try {
      localStorage.setItem(this.PROFILE_KEY, JSON.stringify(this.userProfile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  private getDefaultProfile(): UserProfile {
    return {
      preferences: {
        studyStyle: 'mixed',
        difficultyLevel: 'intermediate',
        studyTime: 'morning',
        responseStyle: 'concise'
      },
      goals: {
        weakSubjects: [],
        strongSubjects: []
      },
      context: {
        recentTopics: [],
        frequentQuestions: []
      }
    };
  }

  addMemory(content: string, type: UserMemory['type'], metadata: Partial<UserMemory['metadata']> = {}, tags: string[] = []): string {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const memory: UserMemory = {
      id,
      userId: 'default', // In a real app, this would be the actual user ID
      type,
      content,
      metadata: {
        importance: 'medium',
        lastUpdated: new Date().toISOString(),
        frequency: 0,
        ...metadata
      },
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.memories.set(id, memory);
    this.saveMemories();
    return id;
  }

  getMemory(id: string): UserMemory | undefined {
    const memory = this.memories.get(id);
    if (memory) {
      // Increment frequency when memory is accessed
      memory.metadata.frequency++;
      memory.metadata.lastUpdated = new Date().toISOString();
      this.saveMemories();
    }
    return memory;
  }

  getMemoriesByType(type: UserMemory['type']): UserMemory[] {
    return Array.from(this.memories.values())
      .filter(memory => memory.type === type)
      .sort((a, b) => b.metadata.frequency - a.metadata.frequency);
  }

  getMemoriesByTags(tags: string[]): UserMemory[] {
    return Array.from(this.memories.values())
      .filter(memory => tags.some(tag => memory.tags.includes(tag)))
      .sort((a, b) => b.metadata.frequency - a.metadata.frequency);
  }

  getRelevantMemories(query: string, limit: number = 5): UserMemory[] {
    const queryLower = query.toLowerCase();
    const relevantMemories = Array.from(this.memories.values())
      .filter(memory => 
        memory.content.toLowerCase().includes(queryLower) ||
        memory.tags.some(tag => tag.toLowerCase().includes(queryLower))
      )
      .sort((a, b) => {
        // Sort by relevance score (frequency + importance + recency)
        const scoreA = a.metadata.frequency + 
          (a.metadata.importance === 'high' ? 3 : a.metadata.importance === 'medium' ? 2 : 1) +
          (Date.now() - new Date(a.updatedAt).getTime()) / (1000 * 60 * 60 * 24); // Days ago
        const scoreB = b.metadata.frequency + 
          (b.metadata.importance === 'high' ? 3 : b.metadata.importance === 'medium' ? 2 : 1) +
          (Date.now() - new Date(b.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
        return scoreB - scoreA;
      })
      .slice(0, limit);

    // Update frequency for accessed memories
    relevantMemories.forEach(memory => {
      memory.metadata.frequency++;
      memory.metadata.lastUpdated = new Date().toISOString();
    });
    this.saveMemories();

    return relevantMemories;
  }

  updateMemory(id: string, updates: Partial<UserMemory>): boolean {
    const memory = this.memories.get(id);
    if (!memory) return false;

    const updatedMemory = {
      ...memory,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.memories.set(id, updatedMemory);
    this.saveMemories();
    return true;
  }

  deleteMemory(id: string): boolean {
    const deleted = this.memories.delete(id);
    if (deleted) {
      this.saveMemories();
    }
    return deleted;
  }

  updateProfile(updates: Partial<UserProfile>): void {
    if (!this.userProfile) {
      this.userProfile = this.getDefaultProfile();
    }
    this.userProfile = {
      ...this.userProfile!,
      ...updates,
      preferences: {
        ...this.userProfile!.preferences,
        ...updates.preferences
      },
      goals: {
        ...this.userProfile!.goals,
        ...updates.goals
      },
      context: {
        ...this.userProfile!.context,
        ...updates.context
      }
    };
    this.saveProfile();
  }

  getProfile(): UserProfile {
    if (!this.userProfile) {
      this.userProfile = this.getDefaultProfile();
    }
    return { ...this.userProfile };
  }

  addToContext(topic: string): void {
    if (!this.userProfile) {
      this.userProfile = this.getDefaultProfile();
    }
    const recentTopics = this.userProfile.context.recentTopics || [];
    const updatedTopics = [topic, ...recentTopics.filter(t => t !== topic)].slice(0, 10);
    
    this.updateProfile({
      context: {
        ...this.userProfile.context,
        recentTopics: updatedTopics
      }
    });
  }

  addFrequentQuestion(question: string): void {
    if (!this.userProfile) {
      this.userProfile = this.getDefaultProfile();
    }
    const frequentQuestions = this.userProfile.context.frequentQuestions || [];
    const updatedQuestions = [question, ...frequentQuestions.filter(q => q !== question)].slice(0, 5);
    
    this.updateProfile({
      context: {
        ...this.userProfile.context,
        frequentQuestions: updatedQuestions
      }
    });
  }

  getContextSummary(): string {
    const profile = this.getProfile();
    const recentMemories = Array.from(this.memories.values())
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);

    return `User Profile:
- Study Style: ${profile.preferences.studyStyle}
- Difficulty Level: ${profile.preferences.difficultyLevel}
- Preferred Response: ${profile.preferences.responseStyle}
- Weak Subjects: ${profile.goals.weakSubjects.join(', ') || 'None specified'}
- Strong Subjects: ${profile.goals.strongSubjects.join(', ') || 'None specified'}
- Recent Topics: ${profile.context.recentTopics.slice(0, 3).join(', ') || 'None'}
- Recent Memories: ${recentMemories.map(m => m.content).join('; ') || 'None'}`;
  }

  clearOldMemories(daysOld: number = 30): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    let deletedCount = 0;
    for (const [id, memory] of this.memories.entries()) {
      if (new Date(memory.updatedAt) < cutoffDate && memory.metadata.frequency < 2) {
        this.memories.delete(id);
        deletedCount++;
      }
    }
    
    if (deletedCount > 0) {
      this.saveMemories();
    }
    
    return deletedCount;
  }
}

export const userMemoryService = new UserMemoryService();
