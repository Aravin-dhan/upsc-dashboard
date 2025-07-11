import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

/**
 * SYLLABUS PROGRESS API
 * Provides syllabus tracking and progress data
 */

// In-memory storage for demo (in production, use database)
let syllabusStorage: { [key: string]: any } = {};

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

    const storageKey = `syllabus-${userId}`;

    // Check if we have stored data
    let syllabusData = syllabusStorage[storageKey];

    if (!syllabusData) {
      // Generate initial syllabus data based on UPSC syllabus structure
      syllabusData = {
        subjects: [
          {
            name: 'History',
            totalTopics: 28,
            completedTopics: 18,
            inProgressTopics: 6,
            completionPercentage: 64,
            items: [
              {
                id: 'history-1',
                subject: 'History',
                topic: 'Ancient India',
                subtopics: ['Indus Valley Civilization', 'Vedic Period', 'Mauryan Empire', 'Gupta Period'],
                status: 'completed',
                priority: 'high',
                difficulty: 'medium',
                estimatedHours: 12,
                completedHours: 12,
                lastStudied: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                notes: 'Completed with comprehensive notes and practice questions',
                resources: ['NCERT Class 11', 'Spectrum Ancient History', 'Old NCERT by R.S. Sharma']
              },
              {
                id: 'history-2',
                subject: 'History',
                topic: 'Medieval India',
                subtopics: ['Delhi Sultanate', 'Mughal Empire', 'Vijayanagara Empire', 'Maratha Empire'],
                status: 'in-progress',
                priority: 'high',
                difficulty: 'medium',
                estimatedHours: 14,
                completedHours: 8,
                lastStudied: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                notes: 'Currently studying Mughal administration and culture',
                resources: ['NCERT Class 11', 'Spectrum Medieval History', 'Satish Chandra']
              },
              {
                id: 'history-3',
                subject: 'History',
                topic: 'Modern India',
                subtopics: ['British Colonial Rule', 'Freedom Struggle', 'Socio-Religious Reforms', 'Partition'],
                status: 'not-started',
                priority: 'high',
                difficulty: 'hard',
                estimatedHours: 16,
                completedHours: 0,
                lastStudied: '',
                notes: '',
                resources: ['NCERT Class 11-12', 'Spectrum Modern History', 'Bipan Chandra']
              }
            ]
          },
          {
            name: 'Polity',
            totalTopics: 22,
            completedTopics: 15,
            inProgressTopics: 4,
            completionPercentage: 68,
            items: [
              {
                id: 'polity-1',
                subject: 'Polity',
                topic: 'Constitutional Framework',
                subtopics: ['Preamble', 'Fundamental Rights', 'DPSP', 'Fundamental Duties'],
                status: 'completed',
                priority: 'high',
                difficulty: 'medium',
                estimatedHours: 10,
                completedHours: 10,
                lastStudied: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                notes: 'Strong foundation in constitutional basics',
                resources: ['Laxmikanth', 'NCERT Class 11', 'DD Basu']
              },
              {
                id: 'polity-2',
                subject: 'Polity',
                topic: 'Union Executive',
                subtopics: ['President', 'Prime Minister', 'Council of Ministers', 'Cabinet'],
                status: 'in-progress',
                priority: 'high',
                difficulty: 'medium',
                estimatedHours: 8,
                completedHours: 5,
                lastStudied: new Date().toISOString(),
                notes: 'Currently studying powers and functions of PM',
                resources: ['Laxmikanth', 'Polity by Laxmikanth']
              }
            ]
          },
          {
            name: 'Geography',
            totalTopics: 25,
            completedTopics: 12,
            inProgressTopics: 8,
            completionPercentage: 48,
            items: [
              {
                id: 'geography-1',
                subject: 'Geography',
                topic: 'Physical Geography',
                subtopics: ['Geomorphology', 'Climatology', 'Oceanography', 'Biogeography'],
                status: 'completed',
                priority: 'high',
                difficulty: 'hard',
                estimatedHours: 15,
                completedHours: 15,
                lastStudied: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                notes: 'Comprehensive understanding of physical processes',
                resources: ['NCERT Class 11', 'Savindra Singh', 'GC Leong']
              },
              {
                id: 'geography-2',
                subject: 'Geography',
                topic: 'Indian Geography',
                subtopics: ['Physiography', 'Climate', 'Drainage', 'Natural Vegetation', 'Soils'],
                status: 'in-progress',
                priority: 'high',
                difficulty: 'medium',
                estimatedHours: 12,
                completedHours: 7,
                lastStudied: new Date().toISOString(),
                notes: 'Working on drainage systems and river projects',
                resources: ['NCERT Class 11', 'Certificate Physical and Human Geography']
              }
            ]
          },
          {
            name: 'Economics',
            totalTopics: 20,
            completedTopics: 8,
            inProgressTopics: 6,
            completionPercentage: 40,
            items: [
              {
                id: 'economics-1',
                subject: 'Economics',
                topic: 'Microeconomics',
                subtopics: ['Demand and Supply', 'Market Structures', 'Factor Pricing', 'Welfare Economics'],
                status: 'completed',
                priority: 'medium',
                difficulty: 'hard',
                estimatedHours: 14,
                completedHours: 14,
                lastStudied: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                notes: 'Good grasp of microeconomic concepts',
                resources: ['NCERT Class 11-12', 'Sandeep Garg', 'TR Jain']
              }
            ]
          },
          {
            name: 'Current Affairs',
            totalTopics: 15,
            completedTopics: 10,
            inProgressTopics: 3,
            completionPercentage: 67,
            items: [
              {
                id: 'current-affairs-1',
                subject: 'Current Affairs',
                topic: 'Economic Developments',
                subtopics: ['Budget 2024', 'Economic Survey', 'Policy Changes', 'International Trade'],
                status: 'in-progress',
                priority: 'high',
                difficulty: 'medium',
                estimatedHours: 8,
                completedHours: 5,
                lastStudied: new Date().toISOString(),
                notes: 'Tracking recent economic policy changes',
                resources: ['PIB', 'Economic Times', 'Yojana Magazine']
              }
            ]
          }
        ],
        overall: {
          totalTopics: 110,
          completedTopics: 63,
          completionPercentage: 57,
          totalHours: 450,
          completedHours: 258
        }
      };

      // Store the initial data
      syllabusStorage[storageKey] = syllabusData;
    }

    return NextResponse.json({
      success: true,
      data: syllabusData
    });

  } catch (error) {
    console.error('❌ Error fetching syllabus data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch syllabus data' 
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
    const { action, itemId, updates } = body;

    const storageKey = `syllabus-${userId}`;

    // Get current syllabus data
    let syllabusData = syllabusStorage[storageKey] || { subjects: [] };

    if (action === 'update' && itemId && updates) {
      // Find and update the item across all subjects
      let itemFound = false;
      
      for (const subject of syllabusData.subjects) {
        const itemIndex = subject.items.findIndex((item: any) => item.id === itemId);
        if (itemIndex !== -1) {
          subject.items[itemIndex] = { 
            ...subject.items[itemIndex], 
            ...updates,
            lastStudied: new Date().toISOString()
          };
          
          // Recalculate subject statistics
          const totalItems = subject.items.length;
          const completedItems = subject.items.filter((item: any) => item.status === 'completed').length;
          const inProgressItems = subject.items.filter((item: any) => item.status === 'in-progress').length;
          
          subject.completedTopics = completedItems;
          subject.inProgressTopics = inProgressItems;
          subject.completionPercentage = Math.round((completedItems / totalItems) * 100);
          
          itemFound = true;
          break;
        }
      }
      
      if (itemFound) {
        // Recalculate overall statistics
        const totalTopics = syllabusData.subjects.reduce((sum: number, subject: any) => sum + subject.items.length, 0);
        const completedTopics = syllabusData.subjects.reduce((sum: number, subject: any) => 
          sum + subject.items.filter((item: any) => item.status === 'completed').length, 0);
        
        syllabusData.overall = {
          ...syllabusData.overall,
          totalTopics,
          completedTopics,
          completionPercentage: Math.round((completedTopics / totalTopics) * 100)
        };
        
        syllabusStorage[storageKey] = syllabusData;
        
        console.log('✅ Syllabus item updated:', itemId, updates);
        
        return NextResponse.json({
          success: true,
          message: 'Syllabus item updated successfully'
        });
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Syllabus item not found' 
          },
          { status: 404 }
        );
      }
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
    console.error('❌ Error updating syllabus data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update syllabus data' 
      },
      { status: 500 }
    );
  }
}
