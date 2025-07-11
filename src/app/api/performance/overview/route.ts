import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

/**
 * PERFORMANCE OVERVIEW API
 * Provides performance analytics and metrics data
 */

// In-memory storage for demo (in production, use database)
let performanceStorage: { [key: string]: any } = {};

export async function GET(request: NextRequest) {
  try {
    // Get user session
    let session;
    let userId = 'default';
    try {
      session = await getSession(request);
      userId = session?.user?.id || 'default';
    } catch (authError) {
      console.log('Auth not available, using default user');
    }

    const storageKey = `performance-${userId}`;

    // Check if we have stored data
    let performanceData = performanceStorage[storageKey];

    if (!performanceData) {
      // Generate initial performance data
      performanceData = {
        overall: {
          averageScore: 75.5,
          totalTests: 24,
          improvement: 12.3,
          rank: 156
        },
        subjects: [
          {
            id: 'history',
            subject: 'History',
            score: 78,
            maxScore: 100,
            percentage: 78,
            trend: 'up',
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'polity',
            subject: 'Polity',
            score: 82,
            maxScore: 100,
            percentage: 82,
            trend: 'up',
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'geography',
            subject: 'Geography',
            score: 71,
            maxScore: 100,
            percentage: 71,
            trend: 'stable',
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'economics',
            subject: 'Economics',
            score: 68,
            maxScore: 100,
            percentage: 68,
            trend: 'down',
            lastUpdated: new Date().toISOString()
          },
          {
            id: 'current-affairs',
            subject: 'Current Affairs',
            score: 85,
            maxScore: 100,
            percentage: 85,
            trend: 'up',
            lastUpdated: new Date().toISOString()
          }
        ],
        recentTests: [
          {
            id: 'test-1',
            name: 'Mock Test 25',
            score: 89,
            maxScore: 100,
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            subject: 'General Studies'
          },
          {
            id: 'test-2',
            name: 'Sectional Test - Polity',
            score: 82,
            maxScore: 100,
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            subject: 'Polity'
          },
          {
            id: 'test-3',
            name: 'Current Affairs Quiz',
            score: 91,
            maxScore: 100,
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            subject: 'Current Affairs'
          },
          {
            id: 'test-4',
            name: 'History Mock Test',
            score: 76,
            maxScore: 100,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            subject: 'History'
          }
        ],
        weeklyProgress: [
          { week: 'Week 1', score: 68 },
          { week: 'Week 2', score: 72 },
          { week: 'Week 3', score: 75 },
          { week: 'Week 4', score: 78 },
          { week: 'Week 5', score: 76 },
          { week: 'Week 6', score: 82 },
          { week: 'Week 7', score: 85 },
          { week: 'Week 8', score: 89 }
        ]
      };

      // Store the initial data
      performanceStorage[storageKey] = performanceData;
    }

    return NextResponse.json({
      success: true,
      data: performanceData
    });

  } catch (error) {
    console.error('❌ Error fetching performance data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch performance data' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user session
    let session;
    let userId = 'default';
    try {
      session = await getSession(request);
      userId = session?.user?.id || 'default';
    } catch (authError) {
      console.log('Auth not available, using default user');
    }

    const body = await request.json();
    const { action, metricId, updates, testData } = body;

    const storageKey = `performance-${userId}`;

    // Get current performance data
    let performanceData = performanceStorage[storageKey] || {};

    if (action === 'update' && metricId && updates) {
      // Update existing metric
      const subjectIndex = performanceData.subjects?.findIndex((subject: any) => subject.id === metricId);
      if (subjectIndex !== -1) {
        performanceData.subjects[subjectIndex] = { 
          ...performanceData.subjects[subjectIndex], 
          ...updates,
          lastUpdated: new Date().toISOString()
        };
        performanceStorage[storageKey] = performanceData;
        
        console.log('✅ Performance metric updated:', metricId, updates);
        
        return NextResponse.json({
          success: true,
          message: 'Performance metric updated successfully',
          data: performanceData.subjects[subjectIndex]
        });
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Performance metric not found' 
          },
          { status: 404 }
        );
      }
    } else if (action === 'add-test' && testData) {
      // Add new test result
      if (!performanceData.recentTests) {
        performanceData.recentTests = [];
      }
      
      const newTest = {
        id: `test-${Date.now()}`,
        ...testData,
        date: new Date().toISOString()
      };
      
      performanceData.recentTests.unshift(newTest);
      
      // Keep only last 10 tests
      if (performanceData.recentTests.length > 10) {
        performanceData.recentTests = performanceData.recentTests.slice(0, 10);
      }
      
      performanceStorage[storageKey] = performanceData;
      
      console.log('✅ Test result added:', newTest);
      
      return NextResponse.json({
        success: true,
        message: 'Test result added successfully',
        data: newTest
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid action or missing parameters' 
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('❌ Error updating performance data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update performance data' 
      },
      { status: 500 }
    );
  }
}
