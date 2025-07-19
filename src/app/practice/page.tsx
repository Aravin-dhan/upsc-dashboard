'use client';

import { useState, useEffect } from 'react';
import {
  Play, Trophy, Target, Clock, BookOpen, Star,
  TrendingUp, Award, Flame, CheckCircle, XCircle,
  RotateCcw, Bookmark, Filter, Search, Calendar,
  BarChart3, PieChart, Users, Medal, Zap, ArrowLeft,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { usePracticeKeyboardNavigation, useModalKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { authenticQuestions, getQuestionsByFilter, getRandomQuestions, questionStats } from '@/data/authenticQuestions';
import QuestionManager from '@/components/questions/QuestionManager';
import QuestionSearch from '@/components/questions/QuestionSearch';
import { useAuth } from '@/contexts/AuthContext';
import { Question as ParsedQuestion } from '@/types/questions';

interface Question {
  id: string;
  subject: string;
  topic: string;
  year: number;
  examType: 'prelims' | 'mains';
  paper: string;
  questionType: 'mcq' | 'descriptive';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation: string;
  source: string;
  tags: string[];
  previousAttempts: number;
  correctAttempts: number;
  lastAttempted?: string;
  bookmarked: boolean;
  timeToSolve: number; // in seconds
}

interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  streak: number;
  longestStreak: number;
  totalTimeSpent: number;
  averageTimePerQuestion: number;
  subjectWiseStats: Record<string, {
    attempted: number;
    correct: number;
    accuracy: number;
  }>;
  difficultyStats: Record<string, {
    attempted: number;
    correct: number;
    accuracy: number;
  }>;
  dailyGoal: number;
  dailyProgress: number;
  weeklyGoal: number;
  weeklyProgress: number;
  level: number;
  xp: number;
  badges: string[];
  lastPracticeDate: string;
}

interface PracticeSession {
  id: string;
  type: 'daily' | 'subject' | 'mock' | 'previous_year' | 'custom';
  name: string;
  questions: Question[];
  currentQuestionIndex: number;
  startTime: string;
  endTime?: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  isCompleted: boolean;
}

export default function PracticePage() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [selectedFilters, setSelectedFilters] = useState({
    subject: 'all',
    difficulty: 'all',
    year: 'all',
    examType: 'all',
    source: 'all'
  });
  const [showSubjectSelection, setShowSubjectSelection] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'practice' | 'question-bank' | 'search'>('practice');

  // Load data on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadUserData();
      loadQuestions();
      setIsLoaded(true);
    }
  }, []);

  const loadUserData = () => {
    const savedStats = localStorage.getItem('upsc-practice-stats');
    if (savedStats) {
      try {
        setUserStats(JSON.parse(savedStats));
      } catch (error) {
        console.error('Error loading user stats:', error);
        setUserStats(getDefaultStats());
      }
    } else {
      setUserStats(getDefaultStats());
    }
  };

  const loadQuestions = async () => {
    try {
      // First try to load real parsed questions from API
      const realQuestions = await fetchRealQuestions();
      if (realQuestions && realQuestions.length > 0) {
        const convertedQuestions = convertParsedQuestions(realQuestions);
        setQuestions(convertedQuestions);
        setFilteredQuestions(convertedQuestions);
        return;
      }
    } catch (error) {
      console.error('Error loading real questions:', error);
    }

    // Fallback to localStorage or default questions
    const savedQuestions = localStorage.getItem('upsc-question-bank');
    if (savedQuestions) {
      try {
        const parsed = JSON.parse(savedQuestions);
        setQuestions(parsed);
        setFilteredQuestions(parsed);
      } catch (error) {
        console.error('Error loading saved questions:', error);
        const defaultQuestions = getDefaultQuestions();
        setQuestions(defaultQuestions);
        setFilteredQuestions(defaultQuestions);
      }
    } else {
      const defaultQuestions = getDefaultQuestions();
      setQuestions(defaultQuestions);
      setFilteredQuestions(defaultQuestions);
    }
  };

  // Fetch real questions from the API
  const fetchRealQuestions = async (): Promise<ParsedQuestion[]> => {
    const response = await fetch('/api/questions/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantId: user?.tenantId || 'default',
        limit: 100 // Get a good sample for practice
      })
    });

    if (!response.ok) throw new Error('Failed to fetch questions');

    const data = await response.json();
    return data.success ? data.data.questions : [];
  };

  // Convert parsed questions to practice format
  const convertParsedQuestions = (parsedQuestions: ParsedQuestion[]): Question[] => {
    return parsedQuestions.map(pq => ({
      id: pq.id,
      subject: pq.subject,
      topic: pq.topic,
      year: pq.year,
      examType: pq.examType.toLowerCase() as 'prelims' | 'mains',
      paper: pq.paperType,
      questionType: pq.questionType.toLowerCase() as 'mcq' | 'descriptive',
      difficulty: pq.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard',
      question: pq.questionText,
      options: pq.options?.map(opt => opt.text),
      correctAnswer: pq.correctAnswer,
      explanation: `This question tests knowledge of ${pq.topic} in ${pq.subject}.`,
      source: `UPSC ${pq.examType} ${pq.year} - ${pq.paperType}`,
      tags: pq.tags || [pq.subject.toLowerCase(), pq.topic.toLowerCase()],
      previousAttempts: 0,
      correctAttempts: 0,
      bookmarked: false,
      timeToSolve: pq.questionType === 'MCQ' ? 90 : 300 // 1.5 min for MCQ, 5 min for descriptive
    }));
  };

  const getDefaultStats = (): UserStats => ({
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    streak: 0,
    longestStreak: 0,
    totalTimeSpent: 0,
    averageTimePerQuestion: 0,
    subjectWiseStats: {},
    difficultyStats: {
      easy: { attempted: 0, correct: 0, accuracy: 0 },
      medium: { attempted: 0, correct: 0, accuracy: 0 },
      hard: { attempted: 0, correct: 0, accuracy: 0 }
    },
    dailyGoal: 20,
    dailyProgress: 0,
    weeklyGoal: 140,
    weeklyProgress: 0,
    level: 1,
    xp: 0,
    badges: [],
    lastPracticeDate: ''
  });

  const getDefaultQuestions = (): Question[] => {
    // Production: Load questions from authentic UPSC question bank
    // For now, return empty array to remove mock data
    return [];
  };

  // Initialize with empty data for production
  useEffect(() => {
    setQuestions(getDefaultQuestions());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Practice Tests
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Practice with authentic UPSC questions and track your progress.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-blue-800 dark:text-blue-200">
              Coming Soon: Access thousands of previous year questions, take mock tests, and get detailed performance analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
