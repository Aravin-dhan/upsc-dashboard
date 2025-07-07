// API endpoint for parsing UPSC question papers
import { NextRequest, NextResponse } from 'next/server';
import { UPSCQuestionParser } from '@/services/questionParser';
import { QuestionStorageService } from '@/services/questionStorage';
import { getSession, hasPermission } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin permissions
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!hasPermission(session.user.role, 'admin')) {
      return NextResponse.json(
        { error: 'Admin access required for question parsing' },
        { status: 403 }
      );
    }

    const { tenantId } = await request.json();

    // Validate tenant access
    if (tenantId && tenantId !== session.user.tenantId) {
      return NextResponse.json(
        { error: 'Access denied to this tenant data' },
        { status: 403 }
      );
    }

    // Use user's tenant if not specified
    const validTenantId = tenantId || session.user.tenantId;
    
    // Initialize services
    const parser = new UPSCQuestionParser();
    const storage = new QuestionStorageService(validTenantId);
    
    // Parse all question papers
    const parsedData = await parser.parseAllQuestionPapers();
    
    // Save to storage
    await storage.saveQuestions(parsedData.questions);
    await storage.saveQuestionPapers(parsedData.questionPapers);
    
    return NextResponse.json({
      success: true,
      message: 'Question papers parsed successfully',
      data: {
        totalQuestions: parsedData.questions.length,
        totalPapers: parsedData.questionPapers.length,
        stats: parsedData.stats,
        parseLog: parsedData.parseLog
      }
    });
    
  } catch (error) {
    console.error('Error parsing question papers:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to parse question papers',
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
    
    const storage = new QuestionStorageService(tenantId || undefined);
    const dataInfo = await storage.getDataInfo();
    const stats = await storage.getQuestionStats();
    
    return NextResponse.json({
      success: true,
      data: {
        ...dataInfo,
        stats
      }
    });
    
  } catch (error) {
    console.error('Error getting parse status:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to get parse status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
