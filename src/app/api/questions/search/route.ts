// API endpoint for searching UPSC questions
import { NextRequest, NextResponse } from 'next/server';
import { QuestionStorageService } from '@/services/questionStorage';
import { QuestionFilter } from '@/types/questions';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      tenantId,
      filters = {},
      searchQuery,
      sortBy = 'year',
      sortOrder = 'desc',
      limit = 50,
      offset = 0
    } = body;

    // Validate tenant access
    if (tenantId && tenantId !== session.user.tenantId) {
      return NextResponse.json(
        { error: 'Access denied to this tenant data' },
        { status: 403 }
      );
    }

    // Use user's tenant if not specified
    const validTenantId = tenantId || session.user.tenantId;
    const storage = new QuestionStorageService(validTenantId);
    
    const searchResult = await storage.searchQuestions(
      filters as QuestionFilter,
      searchQuery,
      sortBy,
      sortOrder,
      limit,
      offset
    );
    
    return NextResponse.json({
      success: true,
      data: searchResult
    });
    
  } catch (error) {
    console.error('Error searching questions:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to search questions',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const year = searchParams.get('year');
    const subject = searchParams.get('subject');
    const paperType = searchParams.get('paperType');
    const random = searchParams.get('random');
    const count = parseInt(searchParams.get('count') || '10');
    
    const storage = new QuestionStorageService(tenantId || undefined);
    
    let questions;
    
    if (random === 'true') {
      // Get random questions
      const filters: QuestionFilter = {};
      if (year) filters.year = [parseInt(year)];
      if (subject) filters.subject = [subject];
      if (paperType) filters.paperType = [paperType as any];
      
      questions = await storage.getRandomQuestions(count, filters);
    } else if (year) {
      questions = await storage.getQuestionsByYear(parseInt(year));
    } else if (subject) {
      questions = await storage.getQuestionsBySubject(subject);
    } else if (paperType) {
      questions = await storage.getQuestionsByPaperType(paperType);
    } else {
      // Get all questions with pagination
      const result = await storage.searchQuestions({}, undefined, 'year', 'desc', count, 0);
      questions = result.questions;
    }
    
    return NextResponse.json({
      success: true,
      data: {
        questions,
        count: questions.length
      }
    });
    
  } catch (error) {
    console.error('Error getting questions:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to get questions',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
