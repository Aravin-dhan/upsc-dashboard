import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

/**
 * REVISION ENGINE API
 * Provides revision scheduling and tracking data
 */

// In-memory storage for demo (in production, use database)
let revisionStorage: { [key: string]: any } = {};

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

    const storageKey = `revision-${userId}`;

    // Check if we have stored data
    let revisionData = revisionStorage[storageKey];

    if (!revisionData) {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const dayAfter = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      revisionData = {
        todayRevisions: [
          {
            id: 'rev-1',
            topic: 'Constitutional Amendments',
            subject: 'Polity',
            priority: 'high',
            difficulty: 'medium',
            lastRevised: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            nextRevision: today,
            revisionCount: 3,
            confidence: 7,
            notes: 'Focus on recent amendments and their implications',
            tags: ['constitution', 'amendments', 'polity'],
            status: 'pending'
          },
          {
            id: 'rev-2',
            topic: 'Mughal Administration',
            subject: 'History',
            priority: 'medium',
            difficulty: 'medium',
            lastRevised: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            nextRevision: today,
            revisionCount: 2,
            confidence: 6,
            notes: 'Review administrative structure and revenue system',
            tags: ['mughal', 'administration', 'history'],
            status: 'pending'
          },
          {
            id: 'rev-3',
            topic: 'Monsoon System',
            subject: 'Geography',
            priority: 'high',
            difficulty: 'hard',
            lastRevised: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            nextRevision: today,
            revisionCount: 4,
            confidence: 8,
            notes: 'Mechanism, types, and impact on agriculture',
            tags: ['monsoon', 'climate', 'geography'],
            status: 'completed'
          }
        ],
        upcomingRevisions: [
          {
            id: 'rev-4',
            topic: 'Fundamental Rights',
            subject: 'Polity',
            priority: 'high',
            difficulty: 'medium',
            lastRevised: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            nextRevision: tomorrow,
            revisionCount: 5,
            confidence: 9,
            notes: 'Articles 12-35, exceptions and limitations',
            tags: ['fundamental-rights', 'constitution', 'polity'],
            status: 'pending'
          },
          {
            id: 'rev-5',
            topic: 'Economic Planning in India',
            subject: 'Economics',
            priority: 'medium',
            difficulty: 'hard',
            lastRevised: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            nextRevision: dayAfter,
            revisionCount: 2,
            confidence: 5,
            notes: 'Five-year plans, NITI Aayog, and recent changes',
            tags: ['planning', 'economics', 'policy'],
            status: 'pending'
          }
        ],
        overdueRevisions: [
          {
            id: 'rev-6',
            topic: 'Indus Valley Civilization',
            subject: 'History',
            priority: 'medium',
            difficulty: 'easy',
            lastRevised: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            nextRevision: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            revisionCount: 6,
            confidence: 9,
            notes: 'Well understood, quick revision needed',
            tags: ['ancient-history', 'civilization', 'archaeology'],
            status: 'pending'
          }
        ],
        stats: {
          totalItems: 45,
          completedToday: 1,
          pendingToday: 2,
          overdueCount: 1,
          averageConfidence: 7.2
        }
      };

      // Store the initial data
      revisionStorage[storageKey] = revisionData;
    }

    return NextResponse.json({
      success: true,
      data: revisionData
    });

  } catch (error) {
    console.error('❌ Error fetching revision data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch revision data' 
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

    const storageKey = `revision-${userId}`;

    // Get current revision data
    let revisionData = revisionStorage[storageKey] || { 
      todayRevisions: [], 
      upcomingRevisions: [], 
      overdueRevisions: [],
      stats: { totalItems: 0, completedToday: 0, pendingToday: 0, overdueCount: 0, averageConfidence: 0 }
    };

    if (action === 'update' && itemId && updates) {
      // Find and update the item across all revision lists
      let itemFound = false;
      const allLists = ['todayRevisions', 'upcomingRevisions', 'overdueRevisions'];
      
      for (const listName of allLists) {
        const itemIndex = revisionData[listName].findIndex((item: any) => item.id === itemId);
        if (itemIndex !== -1) {
          revisionData[listName][itemIndex] = { 
            ...revisionData[listName][itemIndex], 
            ...updates
          };
          
          // If status changed to completed, update next revision date
          if (updates.status === 'completed') {
            const item = revisionData[listName][itemIndex];
            const nextRevisionDate = new Date();
            
            // Calculate next revision based on confidence level
            const daysToAdd = item.confidence >= 8 ? 14 : item.confidence >= 6 ? 7 : 3;
            nextRevisionDate.setDate(nextRevisionDate.getDate() + daysToAdd);
            
            revisionData[listName][itemIndex].nextRevision = nextRevisionDate.toISOString().split('T')[0];
            revisionData[listName][itemIndex].revisionCount += 1;
            revisionData[listName][itemIndex].lastRevised = new Date().toISOString();
          }
          
          itemFound = true;
          break;
        }
      }
      
      if (itemFound) {
        // Recalculate stats
        const completedToday = revisionData.todayRevisions.filter((item: any) => item.status === 'completed').length;
        const pendingToday = revisionData.todayRevisions.filter((item: any) => item.status === 'pending').length;
        const totalItems = revisionData.todayRevisions.length + revisionData.upcomingRevisions.length + revisionData.overdueRevisions.length;
        
        const allItems = [...revisionData.todayRevisions, ...revisionData.upcomingRevisions, ...revisionData.overdueRevisions];
        const averageConfidence = allItems.length > 0 ? 
          allItems.reduce((sum: number, item: any) => sum + item.confidence, 0) / allItems.length : 0;
        
        revisionData.stats = {
          totalItems,
          completedToday,
          pendingToday,
          overdueCount: revisionData.overdueRevisions.length,
          averageConfidence: Math.round(averageConfidence * 10) / 10
        };
        
        revisionStorage[storageKey] = revisionData;
        
        console.log('✅ Revision item updated:', itemId, updates);
        
        return NextResponse.json({
          success: true,
          message: 'Revision item updated successfully'
        });
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Revision item not found' 
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
    console.error('❌ Error updating revision data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update revision data' 
      },
      { status: 500 }
    );
  }
}
