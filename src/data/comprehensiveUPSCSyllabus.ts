// Comprehensive UPSC Syllabus 2025 - Based on Official UPSC Notification and Expert Analysis

export interface SyllabusItem {
  id: string;
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedHours: number;
  actualHours?: number;
  completed: boolean;
  prerequisites?: string[];
  resources: {
    books: string[];
    onlineResources: string[];
    coachingNotes?: string[];
    youtubeChannels?: string[];
    testSeries?: string[];
    ncertBooks?: string[];
    standardBooks?: string[];
  };
  topics: string[];
  subtopics: string[];
  previousYearQuestions: number;
  weightage: number;
  notes?: string;
  lastStudied?: string;
  redditRecommendations?: string[];
  coachingInstituteTips?: string[];
  currentAffairsRelevance: 'high' | 'medium' | 'low';
  examStrategy: string[];
}

export interface SyllabusSubject {
  id: string;
  name: string;
  code: string;
  description: string;
  totalMarks: number;
  examType: 'prelims' | 'mains' | 'both';
  papers: SyllabusPaper[];
  color: string;
  totalProgress: number;
  redditRating: number;
  coachingRating: number;
}

export interface SyllabusPaper {
  id: string;
  name: string;
  code: string;
  marks: number;
  duration: number;
  sections: SyllabusSection[];
  passingMarks: number;
  averageScore?: number;
  topperStrategy?: string[];
  examPattern: {
    totalQuestions: number;
    negativeMarking: string;
    timePerQuestion: number;
  };
}

export interface SyllabusSection {
  id: string;
  name: string;
  weightage: number;
  items: SyllabusItem[];
  progress: number;
  redditTips: string[];
  commonMistakes: string[];
  studyApproach: string[];
}

// PRELIMS SYLLABUS - Comprehensive based on UPSC Official Syllabus 2025
export const prelimsSyllabus: SyllabusSubject[] = [
  {
    id: 'prelims-gs1',
    name: 'General Studies Paper I',
    code: 'GS-1',
    description: 'History, Geography, Polity, Economics, Environment, Science & Current Affairs (200 Marks)',
    totalMarks: 200,
    examType: 'prelims',
    color: '#3B82F6',
    totalProgress: 0,
    redditRating: 5,
    coachingRating: 5,
    papers: [
      {
        id: 'prelims-gs1-paper',
        name: 'General Studies Paper I',
        code: 'GS-1',
        marks: 200,
        duration: 120,
        passingMarks: 87,
        averageScore: 95,
        examPattern: {
          totalQuestions: 100,
          negativeMarking: '1/3rd deduction for wrong answers',
          timePerQuestion: 1.2
        },
        topperStrategy: [
          'Start with NCERT foundation (Class 6-12)',
          'Focus on current affairs integration',
          'Practice previous year questions extensively',
          'Take regular mock tests',
          'Maintain current affairs diary',
          'Revise multiple times - minimum 3 revisions'
        ],
        sections: [
          {
            id: 'current-affairs',
            name: 'Current Events of National and International Importance',
            weightage: 15,
            progress: 0,
            redditTips: [
              'Read The Hindu daily - most recommended',
              'Follow PIB releases for government schemes',
              'Use monthly compilations like Vision PT 365',
              'Focus on UPSC-relevant issues, not just news'
            ],
            commonMistakes: [
              'Reading too many sources',
              'Not connecting with static syllabus',
              'Ignoring international affairs',
              'Poor note-making'
            ],
            studyApproach: [
              'Daily newspaper reading',
              'Monthly compilation study',
              'Government reports analysis',
              'Static-current affairs integration'
            ],
            items: [
              {
                id: 'national-current-affairs',
                title: 'National Current Affairs',
                description: 'Government policies, domestic developments, and national events',
                importance: 'high',
                difficulty: 'medium',
                estimatedHours: 120,
                completed: false,
                resources: {
                  books: ['The Hindu', 'Indian Express'],
                  ncertBooks: [],
                  standardBooks: ['Vision PT 365', 'Insights Current Affairs'],
                  onlineResources: ['PIB Website', 'PRS Legislative Research'],
                  youtubeChannels: ['Study IQ Current Affairs', 'Unacademy Current Affairs']
                },
                topics: [
                  'Government Policies and Schemes',
                  'Economic Developments',
                  'Social Issues and Welfare',
                  'Infrastructure Projects',
                  'Environmental Issues',
                  'Science and Technology',
                  'Awards and Honors',
                  'Committee Reports'
                ],
                subtopics: [
                  'PM-KISAN, Ayushman Bharat, Digital India',
                  'Budget highlights, Economic Survey',
                  'Education policies, Women empowerment',
                  'Smart Cities, Bharatmala projects',
                  'Climate initiatives, Renewable energy',
                  'Space missions, Defense technology',
                  'Padma Awards, International recognitions',
                  'NITI Aayog reports, Parliamentary committees'
                ],
                previousYearQuestions: 15,
                weightage: 8,
                currentAffairsRelevance: 'high',
                examStrategy: [
                  'Daily reading and note-making',
                  'Weekly revision',
                  'Static syllabus connection',
                  'Regular MCQ practice'
                ],
                redditRecommendations: [
                  'The Hindu is sufficient for newspaper',
                  'Vision PT 365 excellent for monthly compilation',
                  'PIB releases crucial for schemes',
                  'Connect current affairs with static topics'
                ],
                coachingInstituteTips: [
                  'Focus on long-term relevant issues',
                  'Understand policy rationale',
                  'Track international commitments'
                ]
              }
            ]
          },
          {
            id: 'history',
            name: 'History of India and Indian National Movement',
            weightage: 20,
            progress: 0,
            redditTips: [
              'NCERT is sufficient for Ancient and Medieval',
              'Focus more on Modern History for Prelims',
              'Bipin Chandra is gold standard for Freedom Struggle',
              'Make timeline charts for better retention'
            ],
            commonMistakes: [
              'Ignoring art and culture aspects',
              'Not connecting events chronologically',
              'Overlooking regional movements',
              'Too much focus on dates rather than significance'
            ],
            studyApproach: [
              'Start with NCERT Class 6-12 History',
              'Use standard books for detailed study',
              'Create timeline charts and maps',
              'Connect with current archaeological discoveries'
            ],
            items: [
              {
                id: 'ancient-history',
                title: 'Ancient History',
                description: 'Indus Valley Civilization to Gupta Period - Foundation of Indian Civilization',
                importance: 'high',
                difficulty: 'medium',
                estimatedHours: 80,
                completed: false,
                resources: {
                  books: ['Ancient India by R.S. Sharma', 'India\'s Ancient Past by R.S. Sharma'],
                  ncertBooks: ['Class 6 Our Pasts-I', 'Class 11 Themes in World History', 'Class 12 Themes in Indian History'],
                  standardBooks: ['Ancient India by R.S. Sharma', 'India\'s Ancient Past by R.S. Sharma'],
                  onlineResources: ['ClearIAS Ancient History', 'InsightsIAS Ancient History'],
                  youtubeChannels: ['Unacademy UPSC', 'Study IQ Education']
                },
                topics: [
                  'Indus Valley Civilization',
                  'Vedic Period',
                  'Mahajanapadas',
                  'Mauryan Empire',
                  'Post-Mauryan Period',
                  'Gupta Empire',
                  'Post-Gupta Period',
                  'South Indian Kingdoms'
                ],
                subtopics: [
                  'Urban planning, Trade networks, Decline theories',
                  'Early and Later Vedic society, Literature',
                  '16 Kingdoms, Rise of Magadha',
                  'Chandragupta, Ashoka, Administration',
                  'Sungas, Kanvas, Kushans, Satavahanas',
                  'Golden Age, Art, Literature, Science',
                  'Harsha, Regional kingdoms',
                  'Cholas, Cheras, Pandyas, Administration'
                ],
                previousYearQuestions: 45,
                weightage: 8,
                currentAffairsRelevance: 'medium',
                examStrategy: [
                  'Focus on administrative systems',
                  'Emphasize art and architecture',
                  'Connect with geography for trade routes',
                  'Link with current archaeological discoveries'
                ],
                redditRecommendations: [
                  'Start with NCERT Class 6 Our Pasts',
                  'R.S. Sharma books are excellent',
                  'Don\'t go too deep for Prelims',
                  'Focus on UPSC-relevant aspects'
                ],
                coachingInstituteTips: [
                  'Emphasize on administrative systems',
                  'Connect with geography for trade routes',
                  'Link with current archaeological discoveries'
                ]
              },
              {
                id: 'medieval-history',
                title: 'Medieval History',
                description: 'Delhi Sultanate to Mughal Empire - Islamic Rule and Cultural Synthesis',
                importance: 'high',
                difficulty: 'medium',
                estimatedHours: 70,
                completed: false,
                resources: {
                  books: ['Medieval India by Satish Chandra', 'History of Medieval India by J.L. Mehta'],
                  ncertBooks: ['Class 7 Our Pasts-II', 'Class 11-12 History'],
                  standardBooks: ['Medieval India by Satish Chandra', 'History of Medieval India by J.L. Mehta'],
                  onlineResources: ['Medieval History Notes by ClearIAS'],
                  youtubeChannels: ['Unacademy Medieval History', 'Study IQ Medieval History']
                },
                topics: [
                  'Delhi Sultanate',
                  'Mughal Empire',
                  'Regional Kingdoms',
                  'Bhakti and Sufi Movements',
                  'Art and Architecture',
                  'Administrative Systems'
                ],
                subtopics: [
                  'Slave dynasty, Khiljis, Tughlaqs, Lodis',
                  'Babur to Aurangzeb, Administration, Decline',
                  'Vijayanagara, Bahmani, Rajput kingdoms',
                  'Saints and reformers, Cultural synthesis',
                  'Indo-Islamic architecture, Paintings',
                  'Iqta system, Mansabdari system'
                ],
                previousYearQuestions: 35,
                weightage: 6,
                currentAffairsRelevance: 'medium',
                examStrategy: [
                  'Focus on administrative innovations',
                  'Emphasize cultural synthesis',
                  'Connect with art and architecture',
                  'Understand economic policies'
                ],
                redditRecommendations: [
                  'Satish Chandra is the best book',
                  'Focus on administrative systems',
                  'Don\'t ignore regional kingdoms',
                  'Art and architecture is important'
                ],
                coachingInstituteTips: [
                  'Understand the synthesis of cultures',
                  'Focus on administrative innovations',
                  'Connect with contemporary developments'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'prelims-csat',
    name: 'General Studies Paper II (CSAT)',
    code: 'CSAT',
    description: 'Civil Services Aptitude Test - Qualifying Paper (33% required)',
    totalMarks: 200,
    examType: 'prelims',
    color: '#10B981',
    totalProgress: 0,
    redditRating: 4,
    coachingRating: 4,
    papers: [
      {
        id: 'csat-paper',
        name: 'Civil Services Aptitude Test',
        code: 'CSAT',
        marks: 200,
        duration: 120,
        passingMarks: 66,
        averageScore: 75,
        examPattern: {
          totalQuestions: 80,
          negativeMarking: '1/3rd deduction for wrong answers',
          timePerQuestion: 1.5
        },
        topperStrategy: [
          'Focus on qualifying marks (33%)',
          'Strengthen basic mathematics',
          'Practice reading comprehension daily',
          'Time management is crucial',
          'Don\'t ignore this paper completely'
        ],
        sections: [
          {
            id: 'comprehension',
            name: 'Comprehension',
            weightage: 25,
            progress: 0,
            redditTips: [
              'Read newspapers daily to improve comprehension',
              'Practice passages from various sources',
              'Focus on understanding, not speed initially',
              'Learn to identify main ideas quickly'
            ],
            commonMistakes: [
              'Not reading the passage carefully',
              'Bringing external knowledge',
              'Poor time management',
              'Not practicing enough'
            ],
            studyApproach: [
              'Daily reading practice',
              'Solve previous year questions',
              'Time-bound practice',
              'Analyze mistakes regularly'
            ],
            items: [
              {
                id: 'reading-comprehension',
                title: 'Reading Comprehension',
                description: 'Understanding and analyzing given passages',
                importance: 'high',
                difficulty: 'medium',
                estimatedHours: 60,
                completed: false,
                resources: {
                  books: ['CSAT Manual by TMH', 'CSAT Paper 2 by Arihant'],
                  standardBooks: ['Verbal and Non-Verbal Reasoning by R.S. Aggarwal'],
                  onlineResources: ['CSAT practice tests online'],
                  youtubeChannels: ['Unacademy CSAT', 'Study IQ CSAT']
                },
                topics: [
                  'Passage comprehension',
                  'Critical analysis',
                  'Inference drawing',
                  'Author\'s viewpoint understanding'
                ],
                subtopics: [
                  'Main idea identification',
                  'Supporting details analysis',
                  'Tone and mood understanding',
                  'Logical conclusions'
                ],
                previousYearQuestions: 20,
                weightage: 15,
                currentAffairsRelevance: 'low',
                examStrategy: [
                  'Read passage twice if needed',
                  'Identify keywords',
                  'Eliminate wrong options',
                  'Manage time effectively'
                ],
                redditRecommendations: [
                  'Daily newspaper reading helps',
                  'Practice from various sources',
                  'Don\'t bring external knowledge',
                  'Focus on passage content only'
                ],
                coachingInstituteTips: [
                  'Develop reading speed gradually',
                  'Practice different types of passages',
                  'Learn to identify question types'
                ]
              }
            ]
          },
          {
            id: 'logical-reasoning',
            name: 'Logical Reasoning and Analytical Ability',
            weightage: 30,
            progress: 0,
            redditTips: [
              'Practice regularly - consistency is key',
              'Learn shortcuts and techniques',
              'R.S. Aggarwal is sufficient for most topics',
              'Focus on accuracy over speed initially'
            ],
            commonMistakes: [
              'Not practicing enough',
              'Ignoring basic concepts',
              'Poor time management',
              'Not learning from mistakes'
            ],
            studyApproach: [
              'Topic-wise practice',
              'Regular mock tests',
              'Error analysis',
              'Speed building exercises'
            ],
            items: [
              {
                id: 'logical-reasoning-topics',
                title: 'Logical Reasoning',
                description: 'Logical sequences, analogies, and problem-solving',
                importance: 'high',
                difficulty: 'medium',
                estimatedHours: 80,
                completed: false,
                resources: {
                  books: ['Verbal and Non-Verbal Reasoning by R.S. Aggarwal'],
                  standardBooks: ['Analytical Reasoning by M.K. Pandey'],
                  onlineResources: ['IndiaBIX Logical Reasoning'],
                  youtubeChannels: ['Unacademy Reasoning', 'Study IQ Reasoning']
                },
                topics: [
                  'Logical sequences',
                  'Analogies and classifications',
                  'Syllogisms',
                  'Blood relations',
                  'Directions and arrangements',
                  'Coding and decoding'
                ],
                subtopics: [
                  'Number series, Letter series',
                  'Odd one out, Similarities',
                  'Categorical syllogisms',
                  'Family tree problems',
                  'Seating arrangements, Puzzles',
                  'Letter and number coding'
                ],
                previousYearQuestions: 25,
                weightage: 18,
                currentAffairsRelevance: 'low',
                examStrategy: [
                  'Learn basic concepts first',
                  'Practice regularly',
                  'Use elimination method',
                  'Manage time per question'
                ],
                redditRecommendations: [
                  'R.S. Aggarwal is the best book',
                  'Practice daily for consistency',
                  'Learn shortcuts and tricks',
                  'Don\'t spend too much time on one question'
                ],
                coachingInstituteTips: [
                  'Master basic concepts thoroughly',
                  'Practice different question types',
                  'Develop pattern recognition skills'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'prelims-csat',
    name: 'General Studies Paper II (CSAT)',
    code: 'CSAT',
    description: 'Civil Services Aptitude Test - Qualifying Paper (33% required)',
    totalMarks: 200,
    examType: 'prelims',
    color: '#10B981',
    totalProgress: 0,
    redditRating: 4,
    coachingRating: 4,
    papers: [
      {
        id: 'csat-paper',
        name: 'Civil Services Aptitude Test',
        code: 'CSAT',
        marks: 200,
        duration: 120,
        passingMarks: 66,
        averageScore: 75,
        examPattern: {
          totalQuestions: 80,
          negativeMarking: '1/3rd deduction for wrong answers',
          timePerQuestion: 1.5
        },
        topperStrategy: [
          'Focus on qualifying marks (33%)',
          'Strengthen basic mathematics',
          'Practice reading comprehension daily',
          'Time management is crucial',
          'Don\'t ignore this paper completely'
        ],
        sections: [
          {
            id: 'comprehension',
            name: 'Comprehension',
            weightage: 25,
            progress: 0,
            redditTips: [
              'Read newspapers daily to improve comprehension',
              'Practice passages from various sources',
              'Focus on understanding, not speed initially'
            ],
            commonMistakes: [
              'Not reading the passage carefully',
              'Bringing external knowledge',
              'Poor time management'
            ],
            studyApproach: [
              'Daily reading practice',
              'Solve previous year questions',
              'Time-bound practice'
            ],
            items: [
              {
                id: 'reading-comprehension-csat',
                title: 'Reading Comprehension',
                description: 'Understanding and analyzing given passages',
                importance: 'high',
                difficulty: 'medium',
                estimatedHours: 60,
                completed: false,
                resources: {
                  books: ['CSAT Manual by TMH', 'CSAT Paper 2 by Arihant'],
                  standardBooks: ['Verbal Reasoning by R.S. Aggarwal'],
                  onlineResources: ['CSAT practice tests online'],
                  youtubeChannels: ['Unacademy CSAT', 'Study IQ CSAT']
                },
                topics: [
                  'Passage comprehension',
                  'Critical analysis',
                  'Inference drawing',
                  'Author viewpoint understanding'
                ],
                subtopics: [
                  'Main idea identification',
                  'Supporting details analysis',
                  'Tone and mood understanding',
                  'Logical conclusions'
                ],
                previousYearQuestions: 20,
                weightage: 15,
                currentAffairsRelevance: 'low',
                examStrategy: [
                  'Read passage twice if needed',
                  'Identify keywords',
                  'Eliminate wrong options',
                  'Manage time effectively'
                ],
                redditRecommendations: [
                  'Daily newspaper reading helps',
                  'Practice from various sources',
                  'Don\'t bring external knowledge'
                ],
                coachingInstituteTips: [
                  'Develop reading speed gradually',
                  'Practice different types of passages',
                  'Learn to identify question types'
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];
