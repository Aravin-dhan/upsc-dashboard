import { useState, useEffect, useCallback } from 'react';
import { DictionaryService } from '@/services/DictionaryService';

export interface WordDefinition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface WordMeaning {
  partOfSpeech: string;
  definitions: WordDefinition[];
}

export interface Word {
  word: string;
  phonetic?: string;
  meanings: WordMeaning[];
  etymology?: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  frequency: number; // 1-10 scale
  upscRelevance: number; // 1-10 scale for UPSC exam relevance
  categories: string[]; // e.g., ['academic', 'formal', 'technical']
}

export interface LearningProgress {
  wordsLearned: number;
  wordsReviewed: number;
  quizzesTaken: number;
  averageScore: number;
  weakAreas: string[];
  strongAreas: string[];
  lastStudyDate: string;
}

export interface DailyGoal {
  wordsPerDay: number;
  studyTimeMinutes: number;
  quizzesPerWeek: number;
}

export interface QuizQuestion {
  id: string;
  type: 'definition' | 'synonym' | 'antonym' | 'usage' | 'spelling';
  word: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface StudySession {
  id: string;
  date: string;
  wordsStudied: string[];
  timeSpent: number;
  mode: 'flashcard' | 'definition' | 'quiz' | 'reading';
  score?: number;
}

export const useDictionary = () => {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [searchResults, setSearchResults] = useState<Word[]>([]);
  const [wordHistory, setWordHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgress>({
    wordsLearned: 0,
    wordsReviewed: 0,
    quizzesTaken: 0,
    averageScore: 0,
    weakAreas: [],
    strongAreas: [],
    lastStudyDate: ''
  });
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>({
    wordsPerDay: 10,
    studyTimeMinutes: 30,
    quizzesPerWeek: 3
  });
  const [streakCount, setStreakCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);

  const dictionaryService = new DictionaryService();

  // Load saved data on component mount
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = () => {
    try {
      const savedFavorites = localStorage.getItem('dictionary_favorites');
      const savedProgress = localStorage.getItem('dictionary_progress');
      const savedGoals = localStorage.getItem('dictionary_goals');
      const savedHistory = localStorage.getItem('dictionary_history');
      const savedStreak = localStorage.getItem('dictionary_streak');
      const savedSessions = localStorage.getItem('dictionary_sessions');

      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedProgress) setLearningProgress(JSON.parse(savedProgress));
      if (savedGoals) setDailyGoal(JSON.parse(savedGoals));
      if (savedHistory) setWordHistory(JSON.parse(savedHistory));
      if (savedStreak) setStreakCount(parseInt(savedStreak));
      if (savedSessions) setStudySessions(JSON.parse(savedSessions));
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const saveData = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const searchWord = useCallback(async (word: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await dictionaryService.searchWord(word);
      setCurrentWord(result);
      
      // Add to history
      const newHistory = [word, ...wordHistory.filter(w => w !== word)].slice(0, 50);
      setWordHistory(newHistory);
      saveData('dictionary_history', newHistory);
      
      // Get suggestions for similar words
      const suggestions = await dictionaryService.getSuggestions(word);
      setSuggestions(suggestions);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search word');
    } finally {
      setLoading(false);
    }
  }, [wordHistory]);

  const getRandomWord = useCallback(async () => {
    setLoading(true);
    try {
      const randomWord = await dictionaryService.getRandomWord();
      await searchWord(randomWord);
    } catch (err) {
      setError('Failed to get random word');
    } finally {
      setLoading(false);
    }
  }, [searchWord]);

  const getWordOfTheDay = useCallback(async () => {
    setLoading(true);
    try {
      const wordOfDay = await dictionaryService.getWordOfTheDay();
      await searchWord(wordOfDay);
    } catch (err) {
      setError('Failed to get word of the day');
    } finally {
      setLoading(false);
    }
  }, [searchWord]);

  const addToFavorites = useCallback((word: string) => {
    const newFavorites = [...favorites, word];
    setFavorites(newFavorites);
    saveData('dictionary_favorites', newFavorites);
  }, [favorites]);

  const removeFromFavorites = useCallback((word: string) => {
    const newFavorites = favorites.filter(w => w !== word);
    setFavorites(newFavorites);
    saveData('dictionary_favorites', newFavorites);
  }, [favorites]);

  const markAsLearned = useCallback((word: string) => {
    // Update streak
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastStudy = learningProgress.lastStudyDate;

    if (lastStudy === today) {
      // Already studied today, streak remains
      saveData('dictionary_streak', streakCount.toString());
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];

      if (lastStudy === yesterdayString) {
        // Studied yesterday, increment streak
        const newStreak = streakCount + 1;
        setStreakCount(newStreak);
        saveData('dictionary_streak', newStreak.toString());
      } else {
        // Streak broken or first study day, reset to 1
        setStreakCount(1);
        saveData('dictionary_streak', '1');
      }
    }

    // Always update lastStudyDate to today
    const newProgress = {
      ...learningProgress,
      wordsLearned: learningProgress.wordsLearned + 1,
      lastStudyDate: today
    };
    setLearningProgress(newProgress);
    saveData('dictionary_progress', newProgress);
  }, [learningProgress, streakCount]);

  const startQuiz = useCallback(async () => {
    setLoading(true);
    try {
      const quiz = await dictionaryService.generateQuiz(favorites.slice(0, 10));
      setCurrentQuiz(quiz);
    } catch (err) {
      setError('Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  }, [favorites]);

  const updateSettings = useCallback((newGoals: Partial<DailyGoal>) => {
    const updatedGoals = { ...dailyGoal, ...newGoals };
    setDailyGoal(updatedGoals);
    saveData('dictionary_goals', updatedGoals);
  }, [dailyGoal]);

  const getUpscRelevantWords = useCallback(async () => {
    setLoading(true);
    try {
      const upscWords = await dictionaryService.getUpscRelevantWords();
      setSearchResults(upscWords);
    } catch (err) {
      setError('Failed to get UPSC relevant words');
    } finally {
      setLoading(false);
    }
  }, []);

  const startFlashcardSession = useCallback(async (words: string[]) => {
    const sessionId = Date.now().toString();
    const session: StudySession = {
      id: sessionId,
      date: new Date().toISOString(),
      wordsStudied: words,
      timeSpent: 0,
      mode: 'flashcard'
    };
    
    const newSessions = [session, ...studySessions].slice(0, 100);
    setStudySessions(newSessions);
    saveData('dictionary_sessions', newSessions);
    
    return sessionId;
  }, [studySessions]);

  const getWordAnalytics = useCallback(() => {
    const totalWords = learningProgress.wordsLearned;
    const recentSessions = studySessions.slice(0, 7);
    const totalStudyTime = recentSessions.reduce((sum, session) => sum + session.timeSpent, 0);
    const averageWordsPerSession = recentSessions.length > 0 
      ? recentSessions.reduce((sum, session) => sum + session.wordsStudied.length, 0) / recentSessions.length 
      : 0;

    return {
      totalWords,
      weeklyStudyTime: totalStudyTime,
      averageWordsPerSession: Math.round(averageWordsPerSession),
      streakCount,
      favoriteCount: favorites.length,
      progressToGoal: Math.min((totalWords / (dailyGoal.wordsPerDay * 30)) * 100, 100)
    };
  }, [learningProgress, studySessions, streakCount, favorites, dailyGoal]);

  return {
    // State
    currentWord,
    searchResults,
    wordHistory,
    favorites,
    learningProgress,
    dailyGoal,
    streakCount,
    loading,
    error,
    suggestions,
    currentQuiz,
    studySessions,
    
    // Actions
    searchWord,
    getRandomWord,
    getWordOfTheDay,
    addToFavorites,
    removeFromFavorites,
    markAsLearned,
    startQuiz,
    updateSettings,
    getUpscRelevantWords,
    startFlashcardSession,
    getWordAnalytics
  };
}
