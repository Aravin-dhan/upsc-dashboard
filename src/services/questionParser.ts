// UPSC Question Paper Parser Service
import { Question, QuestionPaper, ParsedQuestionData, ParseLogEntry, UPSC_SUBJECTS, TOPIC_KEYWORDS } from '@/types/questions';
import { TenantStorageService } from '@/services/TenantStorageService';

export class UPSCQuestionParser {
  private parseLog: ParseLogEntry[] = [];

  /**
   * Parse all question papers from the New Folder With Items directory
   */
  async parseAllQuestionPapers(): Promise<ParsedQuestionData> {
    const questionPapers: QuestionPaper[] = [];
    const questions: Question[] = [];
    
    // Get list of PDF files
    const pdfFiles = await this.getPDFFiles();
    
    for (const file of pdfFiles) {
      try {
        this.log(file.name, 'success', `Starting to parse ${file.name}`);
        
        const paperInfo = this.extractPaperInfo(file.name);
        const questionPaper = await this.parseSinglePaper(file, paperInfo);
        
        questionPapers.push(questionPaper);
        questions.push(...questionPaper.questions);
        
        this.log(file.name, 'success', `Successfully parsed ${questionPaper.questions.length} questions`);
      } catch (error) {
        this.log(file.name, 'error', `Failed to parse: ${error}`);
      }
    }

    const stats = this.generateStats(questions);
    
    return {
      questionPapers,
      questions,
      stats,
      parseLog: this.parseLog
    };
  }

  /**
   * Get list of PDF files from the question papers directory
   */
  private async getPDFFiles(): Promise<File[]> {
    // This would typically use fs in Node.js or FileReader in browser
    // For now, return mock file list based on the directory structure we saw
    const fileNames = [
      'QP-CSM-22-ESSAY-190922.pdf',
      'QP-CSM-22-GENERAL-STUDIES-PAPER I-190922.pdf',
      'QP-CSM-22-GENERAL-STUDIES-PAPER IV-190922.pdf',
      'QP-CSM-22-GENERAL-STUDIES-PAPER-II-190922.pdf',
      'QP-CSM-22-GENERAL-STUDIES-PAPER-III-190922.pdf',
      'QP-CSM-23-GENERAL-STUDIES-PAPER-I-180923.pdf',
      'QP-CSM-23-GENERAL-STUDIES-PAPER-II-180923.pdf',
      'QP-CSM-23-GENERAL-STUDIES-PAPER-III-180923.pdf',
      'QP-CSM-23-GENERAL-STUDIES-PAPER-IV-180923.pdf',
      'QP-CSP-24-GENERAL-STUDIES-PAPER-I-180624.pdf',
      'QP-CSP-24-GENERAL-STUDIES-PAPER-II-180624.pdf',
      'QP-CSP-25-GENERAL-STUDIES-PAPER-I-26052025.pdf',
      'QP-CSP-25-GENERAL-STUDIES-PAPER-II-26052025.pdf',
      'QP_CSM_2024_ESSAY_03102024.pdf',
      'QP_CSM_2024_GenStud_III_03102024.pdf',
      'QP_CSM_2024_GenStud_II_03102024.pdf',
      'QP_CSM_2024_GenStud_IV_03102024.pdf',
      'QP_CSM_2024_GenStud_I_03102024.pdf',
      'QP_CS_Pre_Exam_2023_280523.pdf',
      'QP_CS_Pre_Exam_2023_GENERAL_STUDIES_PAPER_II_280523.pdf',
      'UPSC-GS-2025-qp-seta.pdf'
    ];

    return fileNames.map(name => ({
      name,
      path: `New Folder With Items/${name}`,
      size: 0,
      type: 'application/pdf'
    } as any));
  }

  /**
   * Extract paper information from filename
   */
  private extractPaperInfo(fileName: string) {
    const info = {
      year: 2023,
      examType: 'Mains' as const,
      paperType: 'GS-I' as const,
      date: new Date()
    };

    // Extract year - look for 20XX pattern (more specific)
    const yearMatch = fileName.match(/(20\d{2})/);
    if (yearMatch) {
      info.year = parseInt(yearMatch[1]);
    } else {
      // Fallback: extract 2-digit year and convert to 20XX
      const shortYearMatch = fileName.match(/[^0-9](\d{2})[^0-9]/);
      if (shortYearMatch) {
        const shortYear = parseInt(shortYearMatch[1]);
        info.year = shortYear > 50 ? 1900 + shortYear : 2000 + shortYear;
      }
    }

    // Extract exam type
    if (fileName.includes('CSM') || fileName.includes('Mains')) {
      info.examType = 'Mains';
    } else if (fileName.includes('CSP') || fileName.includes('Pre')) {
      info.examType = 'Prelims';
    }

    // Extract paper type
    if (fileName.includes('ESSAY')) {
      info.paperType = 'Essay';
    } else if (fileName.includes('PAPER-I') || fileName.includes('PAPER I') || fileName.includes('GenStud_I')) {
      info.paperType = 'GS-I';
    } else if (fileName.includes('PAPER-II') || fileName.includes('PAPER II') || fileName.includes('GenStud_II')) {
      info.paperType = 'GS-II';
    } else if (fileName.includes('PAPER-III') || fileName.includes('PAPER III') || fileName.includes('GenStud_III')) {
      info.paperType = 'GS-III';
    } else if (fileName.includes('PAPER-IV') || fileName.includes('PAPER IV') || fileName.includes('GenStud_IV')) {
      info.paperType = 'GS-IV';
    }

    return info;
  }

  /**
   * Parse a single question paper
   */
  private async parseSinglePaper(file: any, paperInfo: any): Promise<QuestionPaper> {
    // For now, create mock data structure
    // In a real implementation, this would use PDF parsing libraries like pdf-parse or pdf2pic
    
    const questionPaper: QuestionPaper = {
      id: `qp_${paperInfo.year}_${paperInfo.paperType}_${Date.now()}`,
      title: `${paperInfo.examType} ${paperInfo.paperType} ${paperInfo.year}`,
      year: paperInfo.year,
      examType: paperInfo.examType,
      paperType: paperInfo.paperType,
      date: paperInfo.date,
      duration: paperInfo.examType === 'Mains' ? 180 : 120, // 3 hours for mains, 2 hours for prelims
      totalMarks: paperInfo.examType === 'Mains' ? 250 : 200,
      totalQuestions: 0,
      instructions: this.getStandardInstructions(paperInfo.examType),
      questions: [],
      fileName: file.name,
      filePath: file.path,
      parseStatus: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Initialize empty questions array - questions will be parsed from actual content
    questionPaper.questions = [];
    questionPaper.totalQuestions = 0;

    return questionPaper;
  }

  /**
   * Generate mock questions for demonstration (disabled for production)
   */
  private generateMockQuestions(paperInfo: any, count: number): Question[] {
    // Disabled for production - no mock questions generated
    console.warn('Mock question generation is disabled in production');
    return [];

    const questions: Question[] = [];
    const subjects = UPSC_SUBJECTS[paperInfo.paperType] || ['General Studies'];
    
    for (let i = 1; i <= count; i++) {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const topics = Object.keys(TOPIC_KEYWORDS);
      const topic = topics[Math.floor(Math.random() * topics.length)];
      
      const question: Question = {
        id: `q_${paperInfo.year}_${paperInfo.paperType}_${i}`,
        questionText: this.generateQuestionText(subject, topic, i),
        questionNumber: i,
        marks: paperInfo.examType === 'Mains' ? (i <= 10 ? 10 : 15) : 2,
        difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)] as any,
        subject,
        topic,
        keywords: this.extractKeywords(subject, topic),
        year: paperInfo.year,
        examType: paperInfo.examType,
        paperType: paperInfo.paperType,
        questionType: paperInfo.examType === 'Mains' ? 'Descriptive' : 'MCQ',
        tags: [subject.toLowerCase(), topic.toLowerCase()],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (paperInfo.examType === 'Prelims') {
        question.options = this.generateMCQOptions();
        question.correctAnswer = 'A';
      }

      questions.push(question);
    }

    return questions;
  }

  /**
   * Generate question text based on subject and topic
   */
  private generateQuestionText(subject: string, topic: string, number: number): string {
    const templates = {
      'History': [
        `Discuss the significance of ${topic} in Indian history.`,
        `Analyze the impact of ${topic} on Indian society.`,
        `Evaluate the role of ${topic} in shaping modern India.`
      ],
      'Geography': [
        `Explain the geographical features related to ${topic}.`,
        `Discuss the impact of ${topic} on Indian climate.`,
        `Analyze the distribution pattern of ${topic} in India.`
      ],
      'Polity': [
        `Examine the constitutional provisions related to ${topic}.`,
        `Discuss the role of ${topic} in Indian democracy.`,
        `Analyze the challenges in implementing ${topic}.`
      ],
      'Economy': [
        `Evaluate the economic implications of ${topic}.`,
        `Discuss the government policies related to ${topic}.`,
        `Analyze the impact of ${topic} on economic development.`
      ]
    };

    const subjectTemplates = templates[subject as keyof typeof templates] || templates['History'];
    const template = subjectTemplates[Math.floor(Math.random() * subjectTemplates.length)];
    
    return `Q${number}. ${template}`;
  }

  /**
   * Generate MCQ options
   */
  private generateMCQOptions() {
    return [
      { id: 'a', text: 'Option A - First choice', isCorrect: true },
      { id: 'b', text: 'Option B - Second choice', isCorrect: false },
      { id: 'c', text: 'Option C - Third choice', isCorrect: false },
      { id: 'd', text: 'Option D - Fourth choice', isCorrect: false }
    ];
  }

  /**
   * Extract keywords from subject and topic
   */
  private extractKeywords(subject: string, topic: string): string[] {
    const keywords = [subject.toLowerCase(), topic.toLowerCase()];
    
    // Add topic-specific keywords
    const topicKeywords = TOPIC_KEYWORDS[topic as keyof typeof TOPIC_KEYWORDS];
    if (topicKeywords) {
      keywords.push(...topicKeywords);
    }

    return keywords;
  }

  /**
   * Get standard instructions for exam type
   */
  private getStandardInstructions(examType: 'Prelims' | 'Mains'): string[] {
    if (examType === 'Mains') {
      return [
        'Answer ALL questions.',
        'All questions carry equal marks.',
        'Word limit should be strictly adhered to.',
        'Any page or portion of the page left blank in the Question-cum-Answer Booklet must be clearly struck off.'
      ];
    } else {
      return [
        'Mark your answers on the OMR sheet.',
        'Each question has four alternatives.',
        'Choose the most appropriate answer.',
        'There is negative marking for wrong answers.'
      ];
    }
  }

  /**
   * Generate statistics from parsed questions
   */
  private generateStats(questions: Question[]) {
    const stats = {
      totalQuestions: questions.length,
      byYear: {} as Record<number, number>,
      bySubject: {} as Record<string, number>,
      byTopic: {} as Record<string, number>,
      byDifficulty: {} as Record<string, number>,
      byExamType: {} as Record<string, number>,
      byPaperType: {} as Record<string, number>,
      byQuestionType: {} as Record<string, number>
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

    return stats;
  }

  /**
   * Add entry to parse log
   */
  private log(fileName: string, status: 'success' | 'error' | 'warning', message: string, details?: any) {
    this.parseLog.push({
      id: `log_${Date.now()}_${Math.random()}`,
      fileName,
      status,
      message,
      timestamp: new Date(),
      details
    });
  }
}
