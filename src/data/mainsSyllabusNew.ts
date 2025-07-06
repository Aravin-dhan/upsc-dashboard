import { SyllabusSubject, SyllabusItem } from './comprehensiveUPSCSyllabus';

// Complete UPSC Mains Syllabus 2025 - Based on Official UPSC Notification
export const completeMains: SyllabusSubject[] = [
  {
    id: 'mains-essay',
    name: 'Paper I - Essay',
    code: 'ESSAY',
    description: 'Essay writing on multiple topics to test expression, understanding, and critical thinking (250 marks)',
    totalMarks: 250,
    examType: 'mains',
    color: '#8B5CF6',
    totalProgress: 0,
    redditRating: 4.2,
    coachingRating: 4.5,
    papers: [
      {
        id: 'essay-paper',
        name: 'Essay Paper',
        code: 'ESSAY',
        marks: 250,
        duration: 180,
        passingMarks: 87.5,
        averageScore: 110,
        examPattern: {
          totalQuestions: 8,
          negativeMarking: 'No negative marking',
          timePerQuestion: 22.5
        },
        topperStrategy: [
          'Choose topics you can write authentically about',
          'Maintain balance between content and expression',
          'Practice writing within time limits',
          'Read quality newspapers and magazines',
          'Develop your own writing style',
          'Include examples and case studies'
        ],
        sections: [
          {
            id: 'essay-topics',
            name: 'Essay Topics',
            weightage: 100,
            progress: 0,
            redditTips: [
              'Choose topics you are comfortable with',
              'Quality over quantity in content',
              'Practice writing regularly',
              'Read good essays for inspiration'
            ],
            commonMistakes: [
              'Choosing unfamiliar topics',
              'Poor time management',
              'Lack of structure',
              'Insufficient examples'
            ],
            studyApproach: [
              'Regular writing practice',
              'Reading quality content',
              'Developing personal style',
              'Time-bound practice'
            ],
            items: [
              {
                id: 'philosophical-essays',
                title: 'Philosophical and Ethical Essays',
                description: 'Essays on philosophical themes, ethics, and human values',
                importance: 'high',
                difficulty: 'hard',
                estimatedHours: 60,
                completed: false,
                resources: {
                  books: ['Essays for Civil Services by Pulkit Khare'],
                  standardBooks: ['Ethics, Integrity and Aptitude by Lexicon'],
                  onlineResources: ['Insights IAS Essay Archive'],
                  youtubeChannels: ['Study IQ Essay Writing']
                },
                topics: [
                  'Truth and non-violence',
                  'Compassion and empathy',
                  'Integrity in public life',
                  'Role of ethics in governance'
                ],
                subtopics: [
                  'Gandhian philosophy in modern context',
                  'Emotional intelligence in leadership',
                  'Transparency and accountability',
                  'Ethical dilemmas in administration'
                ],
                previousYearQuestions: 25,
                weightage: 30,
                currentAffairsRelevance: 'medium',
                examStrategy: [
                  'Choose topics you can relate to personally',
                  'Use philosophical quotes and examples',
                  'Maintain logical flow of arguments',
                  'Include contemporary relevance'
                ],
                redditRecommendations: [
                  'Read philosophy books for depth',
                  'Practice writing on abstract topics',
                  'Develop your own perspective',
                  'Use real-life examples'
                ],
                coachingInstituteTips: [
                  'Balance idealism with pragmatism',
                  'Use case studies and examples',
                  'Maintain coherent argument structure'
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

// Additional syllabus sections for GS papers
export const gs2Syllabus: SyllabusSubject[] = [];
export const gs3Syllabus: SyllabusSubject[] = [];
export const gs4Syllabus: SyllabusSubject[] = [];

// Main syllabus export
export const mainsSyllabus = completeMains;

export default {
  mainsSyllabus,
  completeMains,
  gs2Syllabus,
  gs3Syllabus,
  gs4Syllabus
};
