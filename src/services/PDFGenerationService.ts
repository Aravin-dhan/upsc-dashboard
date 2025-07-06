export interface PDFExportOptions {
  title: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  includeHeader?: boolean;
  includeFooter?: boolean;
  includeTimestamp?: boolean;
  format?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
}

export interface PDFContent {
  type: 'text' | 'heading' | 'list' | 'table' | 'image' | 'divider';
  content: any;
  style?: {
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
    color?: string;
    alignment?: 'left' | 'center' | 'right';
    margin?: { top?: number; bottom?: number; left?: number; right?: number };
  };
}

class PDFGenerationService {
  private static instance: PDFGenerationService;

  private constructor() {}

  static getInstance(): PDFGenerationService {
    if (!PDFGenerationService.instance) {
      PDFGenerationService.instance = new PDFGenerationService();
    }
    return PDFGenerationService.instance;
  }

  // Generate PDF for study notes
  async generateNotesPDF(notes: any[], options: PDFExportOptions): Promise<void> {
    const content: PDFContent[] = [
      {
        type: 'heading',
        content: options.title || 'Study Notes',
        style: { fontSize: 24, fontWeight: 'bold', alignment: 'center', margin: { bottom: 20 } }
      }
    ];

    notes.forEach((note, index) => {
      content.push(
        {
          type: 'heading',
          content: `${index + 1}. ${note.title}`,
          style: { fontSize: 18, fontWeight: 'bold', margin: { top: 15, bottom: 10 } }
        },
        {
          type: 'text',
          content: `Subject: ${note.subject || 'General'}`,
          style: { fontSize: 12, color: '#666', margin: { bottom: 5 } }
        },
        {
          type: 'text',
          content: `Created: ${new Date(note.createdAt).toLocaleDateString()}`,
          style: { fontSize: 12, color: '#666', margin: { bottom: 10 } }
        }
      );

      if (note.tags && note.tags.length > 0) {
        content.push({
          type: 'text',
          content: `Tags: ${note.tags.join(', ')}`,
          style: { fontSize: 12, color: '#0066cc', margin: { bottom: 10 } }
        });
      }

      content.push(
        {
          type: 'text',
          content: note.content || 'No content available',
          style: { fontSize: 14, margin: { bottom: 20 } }
        },
        {
          type: 'divider',
          content: null
        }
      );
    });

    await this.generatePDF(content, options);
  }

  // Generate PDF for practice session reports
  async generatePracticeReportPDF(sessionData: any, options: PDFExportOptions): Promise<void> {
    const content: PDFContent[] = [
      {
        type: 'heading',
        content: 'Practice Session Report',
        style: { fontSize: 24, fontWeight: 'bold', alignment: 'center', margin: { bottom: 20 } }
      },
      {
        type: 'text',
        content: `Session Date: ${new Date(sessionData.date).toLocaleDateString()}`,
        style: { fontSize: 14, margin: { bottom: 10 } }
      },
      {
        type: 'text',
        content: `Subject: ${sessionData.subject || 'Mixed'}`,
        style: { fontSize: 14, margin: { bottom: 10 } }
      },
      {
        type: 'text',
        content: `Duration: ${sessionData.duration || 'N/A'} minutes`,
        style: { fontSize: 14, margin: { bottom: 10 } }
      },
      {
        type: 'text',
        content: `Score: ${sessionData.score || 0}/${sessionData.totalQuestions || 0} (${Math.round((sessionData.score || 0) / (sessionData.totalQuestions || 1) * 100)}%)`,
        style: { fontSize: 16, fontWeight: 'bold', color: '#0066cc', margin: { bottom: 20 } }
      }
    ];

    // Add performance breakdown
    if (sessionData.subjectWisePerformance) {
      content.push({
        type: 'heading',
        content: 'Subject-wise Performance',
        style: { fontSize: 18, fontWeight: 'bold', margin: { top: 15, bottom: 10 } }
      });

      Object.entries(sessionData.subjectWisePerformance).forEach(([subject, data]: [string, any]) => {
        content.push({
          type: 'text',
          content: `${subject}: ${data.correct}/${data.total} (${Math.round(data.correct / data.total * 100)}%)`,
          style: { fontSize: 14, margin: { bottom: 5 } }
        });
      });
    }

    // Add incorrect questions analysis
    if (sessionData.incorrectQuestions && sessionData.incorrectQuestions.length > 0) {
      content.push(
        {
          type: 'heading',
          content: 'Questions for Review',
          style: { fontSize: 18, fontWeight: 'bold', margin: { top: 20, bottom: 10 } }
        }
      );

      sessionData.incorrectQuestions.forEach((question: any, index: number) => {
        content.push(
          {
            type: 'text',
            content: `${index + 1}. ${question.question}`,
            style: { fontSize: 14, fontWeight: 'bold', margin: { top: 10, bottom: 5 } }
          },
          {
            type: 'text',
            content: `Your Answer: ${question.userAnswer || 'Not answered'}`,
            style: { fontSize: 12, color: '#cc0000', margin: { bottom: 3 } }
          },
          {
            type: 'text',
            content: `Correct Answer: ${question.correctAnswer}`,
            style: { fontSize: 12, color: '#006600', margin: { bottom: 5 } }
          }
        );

        if (question.explanation) {
          content.push({
            type: 'text',
            content: `Explanation: ${question.explanation}`,
            style: { fontSize: 12, margin: { bottom: 10 } }
          });
        }
      });
    }

    await this.generatePDF(content, options);
  }

  // Generate PDF for current affairs summary
  async generateCurrentAffairsPDF(articles: any[], options: PDFExportOptions): Promise<void> {
    const content: PDFContent[] = [
      {
        type: 'heading',
        content: 'Current Affairs Summary',
        style: { fontSize: 24, fontWeight: 'bold', alignment: 'center', margin: { bottom: 20 } }
      },
      {
        type: 'text',
        content: `Generated on: ${new Date().toLocaleDateString()}`,
        style: { fontSize: 12, color: '#666', alignment: 'center', margin: { bottom: 20 } }
      }
    ];

    // Group articles by category
    const categorizedArticles = articles.reduce((acc, article) => {
      const category = article.category || 'General';
      if (!acc[category]) acc[category] = [];
      acc[category].push(article);
      return acc;
    }, {} as Record<string, any[]>);

    Object.entries(categorizedArticles).forEach(([category, categoryArticles]) => {
      content.push({
        type: 'heading',
        content: category,
        style: { fontSize: 18, fontWeight: 'bold', margin: { top: 20, bottom: 10 } }
      });

      categoryArticles.forEach((article, index) => {
        content.push(
          {
            type: 'text',
            content: `${index + 1}. ${article.title}`,
            style: { fontSize: 14, fontWeight: 'bold', margin: { top: 10, bottom: 5 } }
          },
          {
            type: 'text',
            content: `Source: ${article.source || 'Unknown'} | Date: ${new Date(article.publishedAt).toLocaleDateString()}`,
            style: { fontSize: 11, color: '#666', margin: { bottom: 5 } }
          }
        );

        if (article.summary) {
          content.push({
            type: 'text',
            content: article.summary,
            style: { fontSize: 12, margin: { bottom: 10 } }
          });
        }

        if (article.syllabusRelevance) {
          content.push({
            type: 'text',
            content: `UPSC Relevance: ${article.syllabusRelevance}`,
            style: { fontSize: 11, color: '#0066cc', margin: { bottom: 10 } }
          });
        }
      });
    });

    await this.generatePDF(content, options);
  }

  // Generate PDF for study plans
  async generateStudyPlanPDF(studyPlan: any, options: PDFExportOptions): Promise<void> {
    const content: PDFContent[] = [
      {
        type: 'heading',
        content: `Study Plan: ${studyPlan.subject || 'General Studies'}`,
        style: { fontSize: 24, fontWeight: 'bold', alignment: 'center', margin: { bottom: 20 } }
      },
      {
        type: 'text',
        content: `Duration: ${studyPlan.duration || 30} days`,
        style: { fontSize: 14, margin: { bottom: 10 } }
      },
      {
        type: 'text',
        content: `Difficulty Level: ${studyPlan.difficulty || 'Intermediate'}`,
        style: { fontSize: 14, margin: { bottom: 10 } }
      },
      {
        type: 'text',
        content: `Created: ${new Date(studyPlan.createdAt).toLocaleDateString()}`,
        style: { fontSize: 14, margin: { bottom: 20 } }
      }
    ];

    if (studyPlan.tasks && studyPlan.tasks.length > 0) {
      content.push({
        type: 'heading',
        content: 'Daily Schedule',
        style: { fontSize: 18, fontWeight: 'bold', margin: { top: 15, bottom: 10 } }
      });

      // Group tasks by week
      const weeklyTasks = studyPlan.tasks.reduce((acc: any, task: any) => {
        const week = task.week || Math.ceil(task.day / 7);
        if (!acc[week]) acc[week] = [];
        acc[week].push(task);
        return acc;
      }, {});

      Object.entries(weeklyTasks).forEach(([week, tasks]: [string, any]) => {
        content.push({
          type: 'heading',
          content: `Week ${week}`,
          style: { fontSize: 16, fontWeight: 'bold', margin: { top: 15, bottom: 8 } }
        });

        (tasks as any[]).forEach((task: any) => {
          content.push({
            type: 'text',
            content: `Day ${task.day}: ${task.topics?.join(', ') || 'Study session'} (${task.duration || 120} min)`,
            style: { fontSize: 12, margin: { bottom: 5 } }
          });
        });
      });
    }

    await this.generatePDF(content, options);
  }

  // Core PDF generation method using browser's print functionality
  private async generatePDF(content: PDFContent[], options: PDFExportOptions): Promise<void> {
    // Create a temporary HTML document
    const htmlContent = this.generateHTML(content, options);
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window. Please allow popups for this site.');
    }

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load
    await new Promise(resolve => {
      printWindow.onload = resolve;
      setTimeout(resolve, 1000); // Fallback timeout
    });

    // Trigger print dialog
    printWindow.print();
    
    // Close the window after a delay
    setTimeout(() => {
      printWindow.close();
    }, 1000);
  }

  private generateHTML(content: PDFContent[], options: PDFExportOptions): string {
    const styles = `
      <style>
        @media print {
          body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
          .page-break { page-break-before: always; }
          .no-print { display: none; }
        }
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .footer { text-align: center; border-top: 1px solid #ccc; padding-top: 10px; margin-top: 20px; font-size: 12px; color: #666; }
        .divider { border-top: 1px solid #ccc; margin: 15px 0; }
        h1 { font-size: 24px; margin: 20px 0 10px 0; }
        h2 { font-size: 18px; margin: 15px 0 8px 0; }
        h3 { font-size: 16px; margin: 12px 0 6px 0; }
        p { margin: 8px 0; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .text-red { color: #cc0000; }
        .text-green { color: #006600; }
        .text-blue { color: #0066cc; }
        .text-gray { color: #666; }
      </style>
    `;

    let bodyContent = '';

    if (options.includeHeader) {
      bodyContent += `
        <div class="header">
          <h1>${options.title}</h1>
          ${options.author ? `<p>By: ${options.author}</p>` : ''}
          ${options.includeTimestamp ? `<p>Generated: ${new Date().toLocaleString()}</p>` : ''}
        </div>
      `;
    }

    content.forEach(item => {
      switch (item.type) {
        case 'heading':
          const level = item.style?.fontSize && item.style.fontSize >= 20 ? 'h1' : 
                       item.style?.fontSize && item.style.fontSize >= 16 ? 'h2' : 'h3';
          bodyContent += `<${level} class="${this.getStyleClasses(item.style)}">${item.content}</${level}>`;
          break;
        case 'text':
          bodyContent += `<p class="${this.getStyleClasses(item.style)}">${item.content}</p>`;
          break;
        case 'list':
          bodyContent += `<ul>${item.content.map((li: string) => `<li>${li}</li>`).join('')}</ul>`;
          break;
        case 'divider':
          bodyContent += '<div class="divider"></div>';
          break;
        default:
          bodyContent += `<p>${item.content}</p>`;
      }
    });

    if (options.includeFooter) {
      bodyContent += `
        <div class="footer">
          <p>Generated by UPSC Dashboard | ${new Date().toLocaleDateString()}</p>
          ${options.keywords ? `<p>Keywords: ${options.keywords.join(', ')}</p>` : ''}
        </div>
      `;
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${options.title}</title>
          ${styles}
        </head>
        <body>
          ${bodyContent}
        </body>
      </html>
    `;
  }

  private getStyleClasses(style?: PDFContent['style']): string {
    const classes = [];
    
    if (style?.alignment === 'center') classes.push('text-center');
    if (style?.alignment === 'right') classes.push('text-right');
    if (style?.fontWeight === 'bold') classes.push('font-bold');
    if (style?.color === '#cc0000') classes.push('text-red');
    if (style?.color === '#006600') classes.push('text-green');
    if (style?.color === '#0066cc') classes.push('text-blue');
    if (style?.color === '#666') classes.push('text-gray');
    
    return classes.join(' ');
  }
}

export default PDFGenerationService;
