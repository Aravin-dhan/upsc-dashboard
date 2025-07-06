export interface SyllabusNode {
  id: string;
  name: string;
  level: 'paper' | 'section' | 'topic' | 'subtopic';
  parent?: string;
  children: string[];
  description?: string;
  upscRelevance: 'high' | 'medium' | 'low';
  examFrequency: number; // 1-10 scale
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedStudyHours: number;
  keyTopics: string[];
  recommendedSources: string[];
  previousYearQuestions: number;
  tags: string[];
}

export interface QuestionBank {
  [syllabusId: string]: {
    questions: EnhancedQuestion[];
    totalQuestions: number;
    difficultyDistribution: {
      easy: number;
      medium: number;
      hard: number;
    };
    yearWiseDistribution: { [year: number]: number };
    topicCoverage: number; // percentage
  };
}

export interface EnhancedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  syllabusIds: string[]; // Multiple syllabus topics
  tags: string[];
  source: string;
  year?: number;
  paper?: string;
  upscRelevance: 'high' | 'medium' | 'low';
  conceptsCovered: string[];
  relatedTopics: string[];
  timeToSolve: number; // in seconds
  commonMistakes: string[];
  hints: string[];
  detailedSolution?: string;
  references: string[];
}

// Complete UPSC Syllabus Structure
export const syllabusStructure: { [id: string]: SyllabusNode } = {
  // PRELIMS
  'prelims': {
    id: 'prelims',
    name: 'UPSC Prelims',
    level: 'paper',
    children: ['gs-paper-1', 'csat'],
    upscRelevance: 'high',
    examFrequency: 10,
    difficulty: 'medium',
    estimatedStudyHours: 1200,
    keyTopics: ['General Studies', 'Current Affairs', 'Aptitude'],
    recommendedSources: ['NCERT', 'The Hindu', 'PIB'],
    previousYearQuestions: 200,
    tags: ['prelims', 'objective', 'screening']
  },

  // GS PAPER 1
  'gs-paper-1': {
    id: 'gs-paper-1',
    name: 'General Studies Paper 1',
    level: 'paper',
    parent: 'prelims',
    children: ['indian-history', 'world-history', 'indian-geography', 'world-geography', 'indian-polity', 'economics', 'environment', 'science-tech'],
    upscRelevance: 'high',
    examFrequency: 10,
    difficulty: 'medium',
    estimatedStudyHours: 800,
    keyTopics: ['History', 'Geography', 'Polity', 'Economics', 'Environment', 'Science'],
    recommendedSources: ['NCERT 6-12', 'Laxmikanth', 'Spectrum'],
    previousYearQuestions: 100,
    tags: ['gs1', 'prelims', 'general-studies']
  },

  // INDIAN HISTORY
  'indian-history': {
    id: 'indian-history',
    name: 'Indian History',
    level: 'section',
    parent: 'gs-paper-1',
    children: ['ancient-history', 'medieval-history', 'modern-history', 'freedom-struggle'],
    upscRelevance: 'high',
    examFrequency: 9,
    difficulty: 'medium',
    estimatedStudyHours: 200,
    keyTopics: ['Ancient India', 'Medieval India', 'Modern India', 'Freedom Movement'],
    recommendedSources: ['NCERT', 'Spectrum', 'Bipin Chandra'],
    previousYearQuestions: 25,
    tags: ['history', 'indian-history', 'culture']
  },

  'ancient-history': {
    id: 'ancient-history',
    name: 'Ancient Indian History',
    level: 'topic',
    parent: 'indian-history',
    children: ['indus-valley', 'vedic-period', 'mauryan-empire', 'gupta-empire', 'south-indian-kingdoms'],
    upscRelevance: 'high',
    examFrequency: 8,
    difficulty: 'medium',
    estimatedStudyHours: 60,
    keyTopics: ['Indus Valley Civilization', 'Vedic Period', 'Mauryan Empire', 'Gupta Empire'],
    recommendedSources: ['NCERT Class 11', 'RS Sharma'],
    previousYearQuestions: 8,
    tags: ['ancient', 'civilization', 'empires']
  },

  'indus-valley': {
    id: 'indus-valley',
    name: 'Indus Valley Civilization',
    level: 'subtopic',
    parent: 'ancient-history',
    children: [],
    upscRelevance: 'high',
    examFrequency: 7,
    difficulty: 'medium',
    estimatedStudyHours: 15,
    keyTopics: ['Harappan Culture', 'Town Planning', 'Trade', 'Decline'],
    recommendedSources: ['NCERT Class 11 Chapter 2'],
    previousYearQuestions: 3,
    tags: ['harappan', 'bronze-age', 'urban-planning']
  },

  'mauryan-empire': {
    id: 'mauryan-empire',
    name: 'Mauryan Empire',
    level: 'subtopic',
    parent: 'ancient-history',
    children: [],
    upscRelevance: 'high',
    examFrequency: 8,
    difficulty: 'medium',
    estimatedStudyHours: 20,
    keyTopics: ['Chandragupta Maurya', 'Ashoka', 'Administration', 'Buddhism'],
    recommendedSources: ['NCERT Class 11 Chapter 4'],
    previousYearQuestions: 4,
    tags: ['mauryan', 'ashoka', 'administration', 'buddhism']
  },

  // INDIAN GEOGRAPHY
  'indian-geography': {
    id: 'indian-geography',
    name: 'Indian Geography',
    level: 'section',
    parent: 'gs-paper-1',
    children: ['physical-geography-india', 'climate-india', 'drainage-systems', 'natural-resources', 'agriculture-india'],
    upscRelevance: 'high',
    examFrequency: 9,
    difficulty: 'medium',
    estimatedStudyHours: 150,
    keyTopics: ['Physical Features', 'Climate', 'Rivers', 'Resources', 'Agriculture'],
    recommendedSources: ['NCERT Class 11 Geography', 'Certificate Physical Geography'],
    previousYearQuestions: 20,
    tags: ['geography', 'india', 'physical', 'climate']
  },

  'physical-geography-india': {
    id: 'physical-geography-india',
    name: 'Physical Geography of India',
    level: 'topic',
    parent: 'indian-geography',
    children: ['himalayas', 'northern-plains', 'peninsular-plateau', 'coastal-plains', 'islands'],
    upscRelevance: 'high',
    examFrequency: 9,
    difficulty: 'medium',
    estimatedStudyHours: 40,
    keyTopics: ['Himalayas', 'Northern Plains', 'Peninsular Plateau', 'Coastal Plains'],
    recommendedSources: ['NCERT Class 11 Geography Chapter 2'],
    previousYearQuestions: 6,
    tags: ['physical', 'landforms', 'physiography']
  },

  'himalayas': {
    id: 'himalayas',
    name: 'Himalayan Mountain System',
    level: 'subtopic',
    parent: 'physical-geography-india',
    children: [],
    upscRelevance: 'high',
    examFrequency: 8,
    difficulty: 'medium',
    estimatedStudyHours: 12,
    keyTopics: ['Formation', 'Divisions', 'Passes', 'Rivers', 'Glaciers'],
    recommendedSources: ['NCERT Class 11 Geography'],
    previousYearQuestions: 3,
    tags: ['himalayas', 'mountains', 'glaciers', 'passes']
  },

  // INDIAN POLITY
  'indian-polity': {
    id: 'indian-polity',
    name: 'Indian Polity',
    level: 'section',
    parent: 'gs-paper-1',
    children: ['constitution', 'fundamental-rights', 'dpsp', 'union-government', 'state-government', 'local-government', 'judiciary'],
    upscRelevance: 'high',
    examFrequency: 10,
    difficulty: 'medium',
    estimatedStudyHours: 180,
    keyTopics: ['Constitution', 'Rights', 'Government Structure', 'Judiciary'],
    recommendedSources: ['Laxmikanth', 'NCERT Class 11 Political Science'],
    previousYearQuestions: 25,
    tags: ['polity', 'constitution', 'government', 'rights']
  },

  'constitution': {
    id: 'constitution',
    name: 'Indian Constitution',
    level: 'topic',
    parent: 'indian-polity',
    children: ['making-of-constitution', 'features', 'preamble', 'amendments'],
    upscRelevance: 'high',
    examFrequency: 10,
    difficulty: 'medium',
    estimatedStudyHours: 50,
    keyTopics: ['Making', 'Features', 'Preamble', 'Amendments'],
    recommendedSources: ['Laxmikanth Chapter 1-5'],
    previousYearQuestions: 8,
    tags: ['constitution', 'preamble', 'features', 'amendments']
  },

  // ECONOMICS
  'economics': {
    id: 'economics',
    name: 'Indian Economy',
    level: 'section',
    parent: 'gs-paper-1',
    children: ['economic-planning', 'agriculture-economy', 'industry', 'services', 'banking', 'fiscal-policy', 'monetary-policy'],
    upscRelevance: 'high',
    examFrequency: 9,
    difficulty: 'hard',
    estimatedStudyHours: 200,
    keyTopics: ['Planning', 'Agriculture', 'Industry', 'Banking', 'Policies'],
    recommendedSources: ['NCERT Class 11-12 Economics', 'Economic Survey'],
    previousYearQuestions: 20,
    tags: ['economics', 'planning', 'agriculture', 'industry']
  },

  // ENVIRONMENT
  'environment': {
    id: 'environment',
    name: 'Environment and Ecology',
    level: 'section',
    parent: 'gs-paper-1',
    children: ['ecology-basics', 'biodiversity', 'climate-change', 'pollution', 'conservation'],
    upscRelevance: 'high',
    examFrequency: 8,
    difficulty: 'medium',
    estimatedStudyHours: 100,
    keyTopics: ['Ecology', 'Biodiversity', 'Climate Change', 'Conservation'],
    recommendedSources: ['NCERT Class 11-12 Biology', 'Shankar IAS Environment'],
    previousYearQuestions: 15,
    tags: ['environment', 'ecology', 'biodiversity', 'climate']
  },

  // SCIENCE & TECHNOLOGY
  'science-tech': {
    id: 'science-tech',
    name: 'Science and Technology',
    level: 'section',
    parent: 'gs-paper-1',
    children: ['physics-applications', 'chemistry-applications', 'biology-applications', 'space-technology', 'defense-technology', 'biotechnology'],
    upscRelevance: 'high',
    examFrequency: 8,
    difficulty: 'medium',
    estimatedStudyHours: 120,
    keyTopics: ['Applied Science', 'Space', 'Defense', 'Biotechnology'],
    recommendedSources: ['NCERT Class 6-10 Science', 'Current Affairs'],
    previousYearQuestions: 12,
    tags: ['science', 'technology', 'space', 'defense']
  }
};

// Helper functions
export const getSyllabusNode = (id: string): SyllabusNode | undefined => {
  return syllabusStructure[id];
};

export const getChildNodes = (parentId: string): SyllabusNode[] => {
  const parent = syllabusStructure[parentId];
  if (!parent) return [];
  
  return parent.children.map(childId => syllabusStructure[childId]).filter(Boolean);
};

export const getParentChain = (nodeId: string): SyllabusNode[] => {
  const chain: SyllabusNode[] = [];
  let current = syllabusStructure[nodeId];
  
  while (current) {
    chain.unshift(current);
    current = current.parent ? syllabusStructure[current.parent] : undefined;
  }
  
  return chain;
};

export const getAllSubtopics = (parentId: string): SyllabusNode[] => {
  const subtopics: SyllabusNode[] = [];
  
  const collectSubtopics = (nodeId: string) => {
    const node = syllabusStructure[nodeId];
    if (!node) return;
    
    if (node.level === 'subtopic') {
      subtopics.push(node);
    } else {
      node.children.forEach(collectSubtopics);
    }
  };
  
  collectSubtopics(parentId);
  return subtopics;
};

export const searchSyllabus = (query: string): SyllabusNode[] => {
  const results: SyllabusNode[] = [];
  const lowerQuery = query.toLowerCase();
  
  Object.values(syllabusStructure).forEach(node => {
    if (
      node.name.toLowerCase().includes(lowerQuery) ||
      node.keyTopics.some(topic => topic.toLowerCase().includes(lowerQuery)) ||
      node.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    ) {
      results.push(node);
    }
  });
  
  return results.sort((a, b) => b.upscRelevance === 'high' ? 1 : -1);
};

export const getRecommendedStudyOrder = (nodeIds: string[]): SyllabusNode[] => {
  const nodes = nodeIds.map(id => syllabusStructure[id]).filter(Boolean);
  
  return nodes.sort((a, b) => {
    // Sort by difficulty (easy first), then by exam frequency (high first)
    const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
    const difficultyDiff = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    
    if (difficultyDiff !== 0) return difficultyDiff;
    
    return b.examFrequency - a.examFrequency;
  });
};
