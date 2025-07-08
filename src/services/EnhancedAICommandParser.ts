import AICommandParser from './AICommandParser';

export interface EnhancedCommand {
  intent: string;
  action: string;
  entities: any;
  confidence: number;
  category: string;
  response?: string;
  suggestions?: string[];
}

export class EnhancedAICommandParser extends AICommandParser {
  private upscKnowledgeBase: Map<string, any> = new Map();
  private quickResponses: Map<string, string> = new Map();

  constructor() {
    super();
    this.initializeUPSCKnowledge();
    this.initializeQuickResponses();
  }

  private initializeUPSCKnowledge() {
    // UPSC Syllabus Quick Reference
    this.upscKnowledgeBase.set('prelims_syllabus', {
      papers: ['General Studies Paper I', 'General Studies Paper II (CSAT)'],
      gs1_topics: ['History', 'Geography', 'Polity', 'Economics', 'Environment', 'Science & Technology'],
      gs2_topics: ['Comprehension', 'Logical Reasoning', 'Analytical Ability', 'Decision Making', 'Problem Solving', 'Interpersonal Skills', 'Communication Skills', 'Basic Numeracy']
    });

    this.upscKnowledgeBase.set('mains_syllabus', {
      papers: ['Essay', 'General Studies I', 'General Studies II', 'General Studies III', 'General Studies IV', 'Optional Subject I', 'Optional Subject II'],
      gs1: 'Indian Heritage, History, Geography',
      gs2: 'Governance, Constitution, Polity, Social Justice, International Relations',
      gs3: 'Technology, Economic Development, Bio-diversity, Environment, Security, Disaster Management',
      gs4: 'Ethics, Integrity, Aptitude'
    });

    this.upscKnowledgeBase.set('exam_pattern', {
      prelims: { papers: 2, marks: 400, duration: '2 hours each', qualifying: true },
      mains: { papers: 9, marks: 1750, duration: '3 hours each', qualifying: false },
      interview: { marks: 275, duration: '45 minutes to 1 hour' },
      total_marks: 2025
    });

    this.upscKnowledgeBase.set('preparation_tips', [
      'Start with NCERT books for basic understanding',
      'Read newspapers daily for current affairs',
      'Practice answer writing regularly',
      'Take mock tests consistently',
      'Revise multiple times',
      'Stay updated with government schemes',
      'Focus on understanding concepts rather than memorizing',
      'Maintain a study schedule and stick to it'
    ]);

    this.upscKnowledgeBase.set('important_sources', {
      newspapers: ['The Hindu', 'Indian Express', 'PIB'],
      magazines: ['Yojana', 'Kurukshetra', 'Economic Survey'],
      websites: ['PIB', 'PRS India', 'NITI Aayog'],
      books: ['Laxmikanth for Polity', 'Spectrum for History', 'Certificate Physical and Human Geography']
    });
  }

  private initializeQuickResponses() {
    // Navigation Commands
    this.quickResponses.set('open_calendar', 'Opening your study calendar. You can schedule study sessions, set reminders, and track your progress here.');
    this.quickResponses.set('show_analytics', 'Displaying your performance analytics. Here you can see your study time, accuracy rates, and improvement trends.');
    this.quickResponses.set('go_to_practice', 'Taking you to the practice section. You can attempt mock tests, solve previous year questions, and practice topic-wise questions.');
    this.quickResponses.set('open_current_affairs', 'Opening current affairs section. Stay updated with the latest news, editorials, and important developments.');
    this.quickResponses.set('show_syllabus', 'Displaying the complete UPSC syllabus. You can track your progress and mark completed topics.');

    // Study Guidance
    this.quickResponses.set('study_plan', 'Creating a personalized study plan based on your current level and exam timeline. Focus on weak areas while maintaining strong subjects.');
    this.quickResponses.set('revision_strategy', 'For effective revision: 1) Review notes weekly 2) Practice previous year questions 3) Take mock tests 4) Focus on weak areas 5) Quick revision before exam.');
    this.quickResponses.set('time_management', 'Effective time management: 1) Create a realistic timetable 2) Prioritize important topics 3) Take regular breaks 4) Avoid burnout 5) Stay consistent.');

    // Motivational Responses
    this.quickResponses.set('motivation', 'Remember, UPSC is a marathon, not a sprint. Stay consistent, believe in yourself, and keep pushing forward. Every small step counts towards your goal!');
    this.quickResponses.set('stress_management', 'Feeling stressed is normal during UPSC preparation. Take breaks, exercise regularly, meditate, and maintain a healthy work-life balance. You\'ve got this!');

    // Quick Facts
    this.quickResponses.set('exam_dates', 'UPSC Prelims is usually held in June, Mains in October, and Interviews from February to May. Check the official UPSC website for exact dates.');
    this.quickResponses.set('eligibility', 'Age limit: 21-32 years (general category). Educational qualification: Bachelor\'s degree from a recognized university. Number of attempts: 6 for general category.');
  }

  async parseEnhancedCommand(input: string, context?: any): Promise<EnhancedCommand> {
    // First try the existing command parser
    const baseResult = await this.parseCommand(input, context);
    
    // Enhance with UPSC-specific knowledge
    const enhancedResult = await this.enhanceWithUPSCKnowledge(input, baseResult);
    
    return enhancedResult;
  }

  private async enhanceWithUPSCKnowledge(input: string, baseResult: any): Promise<EnhancedCommand> {
    const lowerInput = input.toLowerCase();

    // UPSC-specific command patterns
    if (lowerInput.includes('syllabus')) {
      if (lowerInput.includes('prelims')) {
        return {
          intent: 'show_prelims_syllabus',
          action: 'show_information',
          entities: { type: 'prelims_syllabus' },
          confidence: 0.9,
          category: 'upsc_knowledge',
          response: this.formatSyllabusResponse('prelims'),
          suggestions: ['Show Mains syllabus', 'Open syllabus tracker', 'Study plan for Prelims']
        };
      } else if (lowerInput.includes('mains')) {
        return {
          intent: 'show_mains_syllabus',
          action: 'show_information',
          entities: { type: 'mains_syllabus' },
          confidence: 0.9,
          category: 'upsc_knowledge',
          response: this.formatSyllabusResponse('mains'),
          suggestions: ['Show Prelims syllabus', 'Open syllabus tracker', 'Study plan for Mains']
        };
      } else {
        return {
          intent: 'show_syllabus',
          action: 'navigate',
          entities: { page: '/syllabus' },
          confidence: 0.9,
          category: 'navigation',
          response: this.quickResponses.get('show_syllabus'),
          suggestions: ['Track progress', 'Show important topics', 'Create study plan']
        };
      }
    }

    if (lowerInput.includes('exam pattern') || lowerInput.includes('exam structure')) {
      return {
        intent: 'show_exam_pattern',
        action: 'show_information',
        entities: { type: 'exam_pattern' },
        confidence: 0.9,
        category: 'upsc_knowledge',
        response: this.formatExamPatternResponse(),
        suggestions: ['Show syllabus', 'Preparation strategy', 'Mock test schedule']
      };
    }

    if (lowerInput.includes('preparation tips') || lowerInput.includes('study tips')) {
      return {
        intent: 'show_preparation_tips',
        action: 'show_information',
        entities: { type: 'preparation_tips' },
        confidence: 0.9,
        category: 'upsc_knowledge',
        response: this.formatPreparationTipsResponse(),
        suggestions: ['Create study plan', 'Show important books', 'Time management tips']
      };
    }

    if (lowerInput.includes('important books') || lowerInput.includes('study material')) {
      return {
        intent: 'show_study_sources',
        action: 'show_information',
        entities: { type: 'important_sources' },
        confidence: 0.9,
        category: 'upsc_knowledge',
        response: this.formatStudySourcesResponse(),
        suggestions: ['Open knowledge base', 'Show preparation tips', 'Create reading list']
      };
    }

    if (lowerInput.includes('motivate') || lowerInput.includes('motivation') || lowerInput.includes('inspire')) {
      return {
        intent: 'provide_motivation',
        action: 'show_information',
        entities: { type: 'motivation' },
        confidence: 0.8,
        category: 'support',
        response: this.quickResponses.get('motivation'),
        suggestions: ['Stress management tips', 'Study plan', 'Track progress']
      };
    }

    if (lowerInput.includes('stress') || lowerInput.includes('overwhelmed') || lowerInput.includes('burnout')) {
      return {
        intent: 'stress_management',
        action: 'show_information',
        entities: { type: 'stress_management' },
        confidence: 0.8,
        category: 'support',
        response: this.quickResponses.get('stress_management'),
        suggestions: ['Wellness section', 'Study schedule', 'Motivation']
      };
    }

    // If no UPSC-specific match, return enhanced base result
    return {
      intent: baseResult.intent || 'general_query',
      action: baseResult.actionType || 'general_response',
      entities: baseResult.entities || {},
      confidence: baseResult.confidence || 0.5,
      category: baseResult.category || 'general',
      response: this.generateFallbackResponse(input),
      suggestions: ['Open calendar', 'Show analytics', 'Go to practice', 'Current affairs']
    };
  }

  private formatSyllabusResponse(type: 'prelims' | 'mains'): string {
    const syllabus = this.upscKnowledgeBase.get(`${type}_syllabus`);
    
    if (type === 'prelims') {
      return `**UPSC Prelims Syllabus:**

**Paper I - General Studies (200 marks):**
• ${syllabus.gs1_topics.join('\n• ')}

**Paper II - CSAT (200 marks):**
• ${syllabus.gs2_topics.join('\n• ')}

*Note: Paper II is qualifying in nature (minimum 33% required)*`;
    } else {
      return `**UPSC Mains Syllabus:**

**Paper A:** Essay (250 marks)
**Paper I:** ${syllabus.gs1} (250 marks)
**Paper II:** ${syllabus.gs2} (250 marks)
**Paper III:** ${syllabus.gs3} (250 marks)
**Paper IV:** ${syllabus.gs4} (250 marks)
**Paper V & VI:** Optional Subject (250 marks each)

**Total:** 1750 marks + 275 marks (Interview) = 2025 marks`;
    }
  }

  private formatExamPatternResponse(): string {
    const pattern = this.upscKnowledgeBase.get('exam_pattern');
    
    return `**UPSC Exam Pattern:**

**Prelims:**
• Papers: ${pattern.prelims.papers}
• Total Marks: ${pattern.prelims.marks}
• Duration: ${pattern.prelims.duration}
• Nature: Qualifying

**Mains:**
• Papers: ${pattern.mains.papers}
• Total Marks: ${pattern.mains.marks}
• Duration: ${pattern.mains.duration}

**Interview:**
• Marks: ${pattern.interview.marks}
• Duration: ${pattern.interview.duration}

**Final Selection:** Based on Mains + Interview (${pattern.total_marks} marks total)`;
  }

  private formatPreparationTipsResponse(): string {
    const tips = this.upscKnowledgeBase.get('preparation_tips');
    
    return `**UPSC Preparation Tips:**

${tips.map((tip: string, index: number) => `${index + 1}. ${tip}`).join('\n')}

**Remember:** Consistency and smart work are key to success in UPSC!`;
  }

  private formatStudySourcesResponse(): string {
    const sources = this.upscKnowledgeBase.get('important_sources');
    
    return `**Important Study Sources:**

**Newspapers:**
• ${sources.newspapers.join('\n• ')}

**Magazines:**
• ${sources.magazines.join('\n• ')}

**Websites:**
• ${sources.websites.join('\n• ')}

**Important Books:**
• ${sources.books.join('\n• ')}

*Tip: Focus on understanding concepts rather than just reading multiple sources.*`;
  }

  private generateFallbackResponse(input: string): string {
    const responses = [
      "I'm here to help with your UPSC preparation! I can provide information about syllabus, exam pattern, study tips, and help you navigate the dashboard.",
      "Let me assist you with your UPSC journey. I can help with study planning, current affairs, practice tests, and much more!",
      "I'm your UPSC preparation companion. Ask me about syllabus, preparation strategies, or use commands like 'open calendar' or 'show analytics'.",
      "Ready to help with your civil services preparation! I can guide you through the syllabus, suggest study materials, or help you navigate the platform."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Quick command recognition for instant responses
  getQuickResponse(command: string): string | null {
    const lowerCommand = command.toLowerCase().trim();
    
    // Direct command mapping
    const commandMap: Record<string, string> = {
      'help': 'I can help you with UPSC preparation, navigation commands, study tips, and more. Try asking about syllabus, exam pattern, or use commands like "open calendar".',
      'hello': 'Hello! I\'m your UPSC preparation assistant. How can I help you today?',
      'hi': 'Hi there! Ready to ace the UPSC exam? What would you like to know or do?',
      'thanks': 'You\'re welcome! Keep up the great work with your UPSC preparation!',
      'thank you': 'Happy to help! Best of luck with your civil services preparation!',
    };

    return commandMap[lowerCommand] || null;
  }
}

// Singleton instance
export const enhancedAICommandParser = new EnhancedAICommandParser();
