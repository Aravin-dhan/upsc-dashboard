// Types for UPSC Previous Year Questions System

export interface Question {
  id: string;
  questionText: string;
  questionNumber: number;
  marks: number;
  timeAllotted?: number; // in minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  subject: string;
  topic: string;
  subtopic?: string;
  keywords: string[];
  year: number;
  examType: 'Prelims' | 'Mains';
  paperType: 'GS-I' | 'GS-II' | 'GS-III' | 'GS-IV' | 'Essay' | 'CSAT';
  questionType: 'MCQ' | 'Descriptive' | 'Essay';
  options?: QuestionOption[]; // For MCQs
  correctAnswer?: string; // For MCQs
  sampleAnswer?: string; // For descriptive questions
  explanation?: string;
  references?: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionPaper {
  id: string;
  title: string;
  year: number;
  examType: 'Prelims' | 'Mains';
  paperType: 'GS-I' | 'GS-II' | 'GS-III' | 'GS-IV' | 'Essay' | 'CSAT';
  date: Date;
  duration: number; // in minutes
  totalMarks: number;
  totalQuestions: number;
  instructions: string[];
  questions: Question[];
  fileName: string;
  filePath: string;
  parseStatus: 'pending' | 'processing' | 'completed' | 'failed';
  parseErrors?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionStats {
  totalQuestions: number;
  byYear: Record<number, number>;
  bySubject: Record<string, number>;
  byTopic: Record<string, number>;
  byDifficulty: Record<string, number>;
  byExamType: Record<string, number>;
  byPaperType: Record<string, number>;
  byQuestionType: Record<string, number>;
}

export interface ParsedQuestionData {
  questionPapers: QuestionPaper[];
  questions: Question[];
  stats: QuestionStats;
  parseLog: ParseLogEntry[];
}

export interface ParseLogEntry {
  id: string;
  fileName: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  timestamp: Date;
  details?: any;
}

export interface QuestionFilter {
  year?: number[];
  examType?: ('Prelims' | 'Mains')[];
  paperType?: ('GS-I' | 'GS-II' | 'GS-III' | 'GS-IV' | 'Essay' | 'CSAT')[];
  subject?: string[];
  topic?: string[];
  difficulty?: ('Easy' | 'Medium' | 'Hard')[];
  questionType?: ('MCQ' | 'Descriptive' | 'Essay')[];
  keywords?: string[];
  tags?: string[];
}

export interface QuestionSearchResult {
  questions: Question[];
  totalCount: number;
  filters: QuestionFilter;
  searchQuery?: string;
  sortBy?: 'year' | 'difficulty' | 'marks' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

// Subject mapping for UPSC papers
export const UPSC_SUBJECTS = {
  'GS-I': [
    'History',
    'Geography', 
    'Art & Culture',
    'Society',
    'Indian Heritage'
  ],
  'GS-II': [
    'Governance',
    'Constitution',
    'Polity',
    'Social Justice',
    'International Relations'
  ],
  'GS-III': [
    'Technology',
    'Economic Development',
    'Environment',
    'Security',
    'Disaster Management'
  ],
  'GS-IV': [
    'Ethics',
    'Integrity',
    'Aptitude',
    'Case Studies'
  ],
  'Essay': [
    'Philosophy',
    'Social Issues',
    'Economic Issues',
    'Political Issues',
    'Environmental Issues'
  ],
  'CSAT': [
    'Comprehension',
    'Logical Reasoning',
    'Analytical Ability',
    'Decision Making',
    'Problem Solving'
  ]
} as const;

// Topic keywords for automatic categorization
export const TOPIC_KEYWORDS = {
  // History
  'Ancient History': ['mauryan', 'gupta', 'harappan', 'vedic', 'buddhism', 'jainism'],
  'Medieval History': ['mughal', 'delhi sultanate', 'vijayanagara', 'maratha'],
  'Modern History': ['british', 'freedom struggle', 'independence', 'gandhi', 'nehru'],
  
  // Geography
  'Physical Geography': ['climate', 'monsoon', 'rivers', 'mountains', 'plateaus'],
  'Human Geography': ['population', 'migration', 'urbanization', 'agriculture'],
  'Economic Geography': ['industries', 'transport', 'trade', 'resources'],
  
  // Polity
  'Constitution': ['fundamental rights', 'directive principles', 'amendment'],
  'Parliament': ['lok sabha', 'rajya sabha', 'speaker', 'bills'],
  'Judiciary': ['supreme court', 'high court', 'judicial review'],
  
  // Economy
  'Economic Development': ['gdp', 'inflation', 'fiscal policy', 'monetary policy'],
  'Agriculture': ['green revolution', 'food security', 'msp', 'farming'],
  'Industry': ['manufacturing', 'services', 'fdi', 'industrial policy'],
  
  // Environment
  'Climate Change': ['global warming', 'carbon emissions', 'renewable energy'],
  'Biodiversity': ['wildlife', 'forests', 'conservation', 'endangered species'],
  'Pollution': ['air pollution', 'water pollution', 'waste management']
} as const;
