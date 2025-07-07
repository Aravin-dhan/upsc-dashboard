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

  const getDefaultQuestions = (): Question[] => [
    {
      id: '1',
      subject: 'History',
      topic: 'Ancient History',
      year: 2023,
      examType: 'prelims',
      paper: 'GS-1',
      questionType: 'mcq',
      difficulty: 'medium',
      question: 'Which of the following was the capital of the Mauryan Empire?',
      options: ['Pataliputra', 'Taxila', 'Ujjain', 'Kaushambi'],
      correctAnswer: 'Pataliputra',
      explanation: 'Pataliputra (modern-day Patna) was the capital of the Mauryan Empire. It was strategically located at the confluence of rivers and served as the administrative center.',
      source: 'UPSC Prelims 2023',
      tags: ['mauryan-empire', 'capital', 'pataliputra'],
      previousAttempts: 0,
      correctAttempts: 0,
      bookmarked: false,
      timeToSolve: 60
    },
    {
      id: '2',
      subject: 'Geography',
      topic: 'Physical Geography',
      year: 2022,
      examType: 'prelims',
      paper: 'GS-1',
      questionType: 'mcq',
      difficulty: 'easy',
      question: 'Which of the following is the highest mountain peak in India?',
      options: ['K2', 'Kanchenjunga', 'Nanda Devi', 'Mount Everest'],
      correctAnswer: 'Kanchenjunga',
      explanation: 'Kanchenjunga is the highest mountain peak entirely within India. While K2 and Mount Everest are higher, they are not entirely within Indian territory.',
      source: 'UPSC Prelims 2022',
      tags: ['mountains', 'peaks', 'kanchenjunga'],
      previousAttempts: 0,
      correctAttempts: 0,
      bookmarked: false,
      timeToSolve: 45
    },
    {
      id: '3',
      subject: 'Polity',
      topic: 'Constitution',
      year: 2023,
      examType: 'prelims',
      paper: 'GS-1',
      questionType: 'mcq',
      difficulty: 'hard',
      question: 'Which Article of the Indian Constitution deals with the Right to Constitutional Remedies?',
      options: ['Article 32', 'Article 21', 'Article 19', 'Article 14'],
      correctAnswer: 'Article 32',
      explanation: 'Article 32 is known as the "Heart and Soul" of the Constitution as it guarantees the Right to Constitutional Remedies, allowing citizens to directly approach the Supreme Court for enforcement of fundamental rights.',
      source: 'UPSC Prelims 2023',
      tags: ['constitution', 'fundamental-rights', 'article-32'],
      previousAttempts: 0,
      correctAttempts: 0,
      bookmarked: false,
      timeToSolve: 90
    }
  ];

  const saveData = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-practice-stats', JSON.stringify(userStats));
      localStorage.setItem('upsc-question-bank', JSON.stringify(questions));
    }
  };

  const startPracticeSession = (type: string, customQuestions?: Question[]) => {
    let sessionQuestions: Question[] = [];
    let sessionName = '';

    switch (type) {
      case 'daily':
        sessionQuestions = getRandomQuestionsFromBank(userStats?.dailyGoal || 20).map(convertAuthenticQuestion);
        sessionName = 'Daily Practice';
        break;
      case 'mock':
        sessionQuestions = getRandomQuestionsFromBank(100).map(convertAuthenticQuestion);
        sessionName = 'Mock Test (100 Questions)';
        break;
      case 'subject':
        const subjectQuestions = getQuestionsByFilter({ subject: selectedFilters.subject });
        sessionQuestions = (subjectQuestions.length > 0 ? subjectQuestions.slice(0, 25) : getRandomQuestionsFromBank(25)).map(convertAuthenticQuestion);
        sessionName = `${selectedFilters.subject} Practice`;
        break;
      case 'previous_year':
        const yearQuestions = getQuestionsByFilter({ year: 2023 }); // Latest year available
        sessionQuestions = (yearQuestions.length > 0 ? yearQuestions : getRandomQuestionsFromBank(50)).map(convertAuthenticQuestion);
        sessionName = 'Previous Year Questions (2023)';
        break;
      default:
        sessionQuestions = customQuestions || getRandomQuestionsFromBank(10).map(convertAuthenticQuestion);
        sessionName = 'Custom Practice';
    }

    const session: PracticeSession = {
      id: Date.now().toString(),
      type: type as any,
      name: sessionName,
      questions: sessionQuestions,
      currentQuestionIndex: 0,
      startTime: new Date().toISOString(),
      score: 0,
      totalQuestions: sessionQuestions.length,
      timeSpent: 0,
      isCompleted: false
    };

    setCurrentSession(session);
  };

  // Convert authentic question format to practice question format
  const convertAuthenticQuestion = (authQ: any): Question => ({
    id: authQ.id,
    question: authQ.question,
    options: authQ.options,
    correctAnswer: authQ.correctAnswer,
    explanation: authQ.explanation,
    subject: authQ.subject,
    topic: authQ.topic,
    difficulty: authQ.difficulty,
    timeToSolve: authQ.timeToSolve,
    source: authQ.source,
    year: authQ.year,
    examType: authQ.examType || 'prelims',
    paper: authQ.paper || 'General Studies',
    questionType: authQ.questionType || 'mcq',
    tags: authQ.tags || [],
    previousAttempts: 0,
    correctAttempts: 0,
    bookmarked: false
  });

  const getRandomQuestionsFromBank = (count: number) => {
    return getRandomQuestions(count);
  };

  const startSubjectPractice = (subject: string) => {
    setSelectedFilters(prev => ({ ...prev, subject }));
    startPracticeSession('subject');
    setShowSubjectSelection(false);
  };

  const availableSubjects = ['History', 'Polity', 'Economics', 'Science and Technology', 'Geography', 'Environment'];

  const answerQuestion = (selectedAnswer: string) => {
    if (!currentSession || !userStats) return;

    const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    // Update question stats
    const updatedQuestions = questions.map(q => {
      if (q.id === currentQuestion.id) {
        return {
          ...q,
          previousAttempts: q.previousAttempts + 1,
          correctAttempts: q.correctAttempts + (isCorrect ? 1 : 0),
          lastAttempted: new Date().toISOString()
        };
      }
      return q;
    });
    setQuestions(updatedQuestions);

    // Update session
    const updatedSession = {
      ...currentSession,
      score: currentSession.score + (isCorrect ? 1 : 0),
      currentQuestionIndex: currentSession.currentQuestionIndex + 1
    };

    // Update user stats
    const updatedStats = {
      ...userStats,
      totalQuestions: userStats.totalQuestions + 1,
      correctAnswers: userStats.correctAnswers + (isCorrect ? 1 : 0),
      accuracy: ((userStats.correctAnswers + (isCorrect ? 1 : 0)) / (userStats.totalQuestions + 1)) * 100,
      streak: isCorrect ? userStats.streak + 1 : 0,
      longestStreak: Math.max(userStats.longestStreak, isCorrect ? userStats.streak + 1 : userStats.streak),
      dailyProgress: userStats.dailyProgress + 1,
      xp: userStats.xp + (isCorrect ? 10 : 2),
      lastPracticeDate: new Date().toISOString()
    };

    setUserStats(updatedStats);
    setCurrentSession(updatedSession);

    // Check if session is complete
    if (updatedSession.currentQuestionIndex >= updatedSession.totalQuestions) {
      completeSession(updatedSession);
    }

    saveData();
    
    if (isCorrect) {
      toast.success('Correct! +10 XP');
    } else {
      toast.error('Incorrect. +2 XP for attempt');
    }
  };

  const completeSession = (session: PracticeSession) => {
    const completedSession = {
      ...session,
      endTime: new Date().toISOString(),
      isCompleted: true
    };
    setCurrentSession(completedSession);

    const accuracy = (session.score / session.totalQuestions) * 100;
    toast.success(`Session completed! Score: ${session.score}/${session.totalQuestions} (${accuracy.toFixed(1)}%)`);
  };

  const exitSession = () => {
    if (currentSession && !currentSession.isCompleted) {
      const confirmExit = window.confirm('Are you sure you want to exit the current session? Your progress will be lost.');
      if (confirmExit) {
        setCurrentSession(null);
        toast.success('Practice session ended');
      }
    } else {
      setCurrentSession(null);
    }
  };

  const nextQuestion = () => {
    if (currentSession && currentSession.currentQuestionIndex < currentSession.totalQuestions - 1) {
      // This would be handled by answerQuestion, but we can add manual navigation if needed
    }
  };

  const previousQuestion = () => {
    if (currentSession && currentSession.currentQuestionIndex > 0) {
      // For now, we don't allow going back to previous questions
      // This could be implemented if needed
    }
  };

  // Keyboard navigation for practice session
  usePracticeKeyboardNavigation(
    currentSession?.currentQuestionIndex || 0,
    currentSession?.totalQuestions || 0,
    nextQuestion,
    previousQuestion,
    () => {}, // onSubmitAnswer - handled by QuestionCard
    exitSession,
    !!currentSession && !currentSession.isCompleted
  );

  // Keyboard navigation for subject selection modal
  useModalKeyboardNavigation(
    showSubjectSelection,
    () => setShowSubjectSelection(false),
    undefined,
    true
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'History': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Geography': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Polity': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Economics': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Environment': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      'Science': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  if (!isLoaded || !userStats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading practice system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="mb-4 lg:mb-8">
        <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Practice Arena</h1>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1 lg:mt-2">
              Test your knowledge with {questionStats.total} authentic UPSC Prelims questions from verified sources.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">{userStats.streak}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Day Streak</p>
            </div>
            <div className="text-center">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">{userStats.xp}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">XP Points</p>
            </div>
            <div className="text-center">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-purple-500" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">L{userStats.level}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Level</p>
            </div>
          </div>
        </div>

        {/* Question Bank Stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{questionStats.total}</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Questions</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {questionStats.byYear.reduce((acc, y) => Math.max(acc, y.year), 0)}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">Latest Year</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {questionStats.bySubject.length}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Subjects</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">100%</div>
            <div className="text-sm text-orange-700 dark:text-orange-300">Verified</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('practice')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'practice'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Play className="w-4 h-4 mr-2" />
                Practice Arena
              </div>
            </button>
            <button
              onClick={() => setActiveTab('question-bank')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'question-bank'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Question Bank
              </div>
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'search'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Search className="w-4 h-4 mr-2" />
                Search Questions
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'practice' && (
            <div>
                      {/* Practice Session */}
              {currentSession && !currentSession.isCompleted && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentSession.name}</h2>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Question {currentSession.currentQuestionIndex + 1} of {currentSession.totalQuestions}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Score: {currentSession.score}/{currentSession.currentQuestionIndex}
                      </div>
                      <button
                        onClick={exitSession}
                        className="flex items-center px-3 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        title="Exit Session (Esc)"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Exit
                      </button>
                    </div>
                  </div>

                  {currentSession.currentQuestionIndex < currentSession.totalQuestions && (
                    <>
                      <QuestionCard
                        question={currentSession.questions[currentSession.currentQuestionIndex]}
                        onAnswer={answerQuestion}
                        showExplanation={false}
                      />

                      {/* Keyboard Navigation Hints */}
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 flex flex-wrap gap-4">
                          <span>↑↓ Navigate options</span>
                          <span>Enter Select option</span>
                          <span>1-4 Quick select</span>
                          <span>Esc Exit session</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Quick Start Options */}
              {!currentSession && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => startPracticeSession('daily')}
                    className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
                  >
                    <Target className="h-8 w-8 mb-3" />
                    <h3 className="font-bold text-lg mb-2">Daily Practice</h3>
                    <p className="text-sm opacity-90">{userStats.dailyGoal} questions</p>
                    <div className="mt-2 bg-white bg-opacity-20 rounded-full h-2">
                      <div
                        className="bg-white rounded-full h-2 transition-all"
                        style={{ width: `${Math.min(100, (userStats.dailyProgress / userStats.dailyGoal) * 100)}%` }}
                      ></div>
                    </div>
                  </button>

                  <button
                    onClick={() => startPracticeSession('mock')}
                    className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105"
                  >
                    <Clock className="h-8 w-8 mb-3" />
                    <h3 className="font-bold text-lg mb-2">Mock Test</h3>
                    <p className="text-sm opacity-90">100 questions</p>
                    <p className="text-xs opacity-75 mt-1">2 hours</p>
                  </button>

                  <button
                    onClick={() => startPracticeSession('previous_year')}
                    className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
                  >
                    <BookOpen className="h-8 w-8 mb-3" />
                    <h3 className="font-bold text-lg mb-2">Previous Years</h3>
                    <p className="text-sm opacity-90">2020-2024 questions</p>
                    <p className="text-xs opacity-75 mt-1">Real exam questions</p>
                  </button>

                  <button
                    onClick={() => setShowSubjectSelection(true)}
                    className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105"
                  >
                    <Filter className="h-8 w-8 mb-3" />
                    <h3 className="font-bold text-lg mb-2">Subject Wise</h3>
                    <p className="text-sm opacity-90">Focused practice</p>
                    <p className="text-xs opacity-75 mt-1">Choose your subject</p>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Question Bank Tab */}
          {activeTab === 'question-bank' && (
            <QuestionManager tenantId={user?.tenantId} />
          )}

          {/* Search Questions Tab */}
          {activeTab === 'search' && (
            <QuestionSearch
              tenantId={user?.tenantId}
              onQuestionSelect={(question) => {
                // Convert parsed question to practice question format and start custom session
                const practiceQuestion: Question = {
                  id: question.id,
                  subject: question.subject,
                  topic: question.topic,
                  year: question.year,
                  examType: question.examType.toLowerCase() as 'prelims' | 'mains',
                  paper: question.paperType,
                  questionType: question.questionType.toLowerCase() as 'mcq' | 'descriptive',
                  difficulty: question.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard',
                  question: question.questionText,
                  options: question.options?.map(opt => opt.text),
                  correctAnswer: question.options?.find(opt => opt.isCorrect)?.text,
                  explanation: `This question is from ${question.subject} - ${question.topic}. Marks: ${question.marks}`,
                  source: `UPSC ${question.examType} ${question.year}`,
                  tags: question.keywords,
                  previousAttempts: 0,
                  correctAttempts: 0,
                  bookmarked: false,
                  timeToSolve: question.marks * 60 // 1 minute per mark
                };

                setActiveTab('practice');
                startPracticeSession('custom', [practiceQuestion]);
              }}
              showFilters={true}
              maxResults={100}
            />
          )}
        </div>
      </div>

      {/* Subject Selection Modal */}
      {showSubjectSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Choose Subject for Practice
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {availableSubjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => startSubjectPractice(subject)}
                    className="p-4 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{subject}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {getQuestionsByFilter({ subject }).length} questions available
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowSubjectSelection(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Question Card Component
function QuestionCard({
  question,
  onAnswer,
  showExplanation = false
}: {
  question: Question;
  onAnswer: (answer: string) => void;
  showExplanation?: boolean;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(question.timeToSolve);
  const [showResult, setShowResult] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(question.timeToSolve);
    setSelectedOptionIndex(0);
  }, [question.id, question.timeToSolve]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedAnswer !== null) return; // Don't handle keys after answer is selected

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedOptionIndex(prev =>
            Math.min(prev + 1, (question.options?.length || 1) - 1)
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedOptionIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          event.preventDefault();
          if (question.options && selectedOptionIndex < question.options.length) {
            handleAnswerSelect(question.options[selectedOptionIndex]);
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          event.preventDefault();
          const optionIndex = parseInt(event.key) - 1;
          if (question.options && optionIndex < question.options.length) {
            setSelectedOptionIndex(optionIndex);
            handleAnswerSelect(question.options[optionIndex]);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedAnswer, selectedOptionIndex, question.options]);

  useEffect(() => {
    if (selectedAnswer === null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAnswerSelect(''); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [selectedAnswer, timeLeft, question.id]);

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections

    setSelectedAnswer(answer);
    setShowResult(true);

    // Auto-advance to next question after 2 seconds
    setTimeout(() => {
      onAnswer(answer);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty.toUpperCase()}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectColor(question.subject)}`}>
            {question.subject}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {question.year} • {question.source}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className={`text-sm font-medium ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6 shadow-sm">
        <div className="text-lg font-semibold text-gray-900 dark:text-white mb-6 leading-relaxed">
          {question.question.split('\n').map((line, index) => (
            <div key={index} className={index > 0 ? 'mt-3' : ''}>
              {line.trim() && (
                <span className={line.match(/^\d+\./) ? 'block ml-4 text-base' : 'block text-base'}>
                  {line}
                </span>
              )}
            </div>
          ))}
        </div>

        {question.questionType === 'mcq' && question.options && (
          <div className="space-y-4 mt-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Choose the correct answer:</h4>
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-5 rounded-lg border-2 transition-all font-medium ${
                  selectedAnswer === option
                    ? option === question.correctAnswer
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 shadow-md'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 shadow-md'
                    : selectedAnswer && option === question.correctAnswer
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 shadow-md'
                    : index === selectedOptionIndex && selectedAnswer === null
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200 dark:ring-blue-800 shadow-md'
                    : 'border-gray-300 dark:border-gray-500 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-md text-gray-900 dark:text-gray-100'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-500 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-base leading-relaxed flex-1">{option}</span>
                  {selectedAnswer && option === question.correctAnswer && (
                    <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                  )}
                  {selectedAnswer === option && option !== question.correctAnswer && (
                    <XCircle className="h-5 w-5 text-red-500 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Show explanation and next button after answer is selected */}
        {showResult && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Explanation:</h4>
              <p className="text-blue-800 dark:text-blue-300 text-sm">{question.explanation}</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedAnswer === question.correctAnswer ? (
                  <span className="text-green-600 dark:text-green-400 font-medium">✓ Correct!</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400 font-medium">✗ Incorrect</span>
                )}
              </div>

              <button
                onClick={() => onAnswer(selectedAnswer || '')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Next Question →
              </button>
            </div>
          </div>
        )}

        {showExplanation && !showResult && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">Explanation:</h4>
            <p className="text-blue-800 dark:text-blue-300 text-sm">{question.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
}

function getSubjectColor(subject: string) {
  const colors: Record<string, string> = {
    'History': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Geography': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Polity': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'Economics': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Environment': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    'Science': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  };
  return colors[subject] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
}
