import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

/**
 * CURRENT AFFAIRS API
 * Provides current affairs content and reading status tracking
 */

// In-memory storage for demo (in production, use database)
let currentAffairsStorage: { [key: string]: any } = {};

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

    const storageKey = `current-affairs-${userId}`;

    // Check if we have stored data
    let currentAffairsData = currentAffairsStorage[storageKey];

    if (!currentAffairsData) {
      const today = new Date().toISOString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
      
      currentAffairsData = {
        recent: [
          {
            id: 'ca-1',
            title: 'Union Budget 2024-25: Key Highlights and Analysis',
            category: 'Economy',
            date: today,
            content: 'The Union Budget 2024-25 presented by Finance Minister focuses on fiscal consolidation, infrastructure development, and digital transformation. Key allocations include increased spending on railways, healthcare, and education sectors.',
            importance: 'high',
            readStatus: 'unread',
            bookmarked: false,
            tags: ['budget', 'economy', 'finance', 'policy'],
            source: 'PIB',
            relatedTopics: ['Economic Survey', 'Fiscal Policy', 'Public Finance']
          },
          {
            id: 'ca-2',
            title: 'India-Japan Strategic Partnership: New Defense Cooperation Agreement',
            category: 'International Relations',
            date: yesterday,
            content: 'India and Japan have signed a comprehensive defense cooperation agreement focusing on technology transfer, joint military exercises, and maritime security in the Indo-Pacific region.',
            importance: 'high',
            readStatus: 'reading',
            bookmarked: true,
            tags: ['india-japan', 'defense', 'international-relations', 'indo-pacific'],
            source: 'MEA',
            relatedTopics: ['Quad', 'Indo-Pacific Strategy', 'Defense Cooperation']
          },
          {
            id: 'ca-3',
            title: 'Supreme Court Verdict on Electoral Bonds Scheme',
            category: 'Polity',
            date: twoDaysAgo,
            content: 'The Supreme Court has struck down the Electoral Bonds Scheme, calling it unconstitutional and violative of the right to information. The court has directed disclosure of all electoral bond details.',
            importance: 'high',
            readStatus: 'read',
            bookmarked: true,
            tags: ['supreme-court', 'electoral-bonds', 'transparency', 'democracy'],
            source: 'Supreme Court',
            relatedTopics: ['Election Commission', 'Political Funding', 'Right to Information']
          },
          {
            id: 'ca-4',
            title: 'Climate Change: India\'s Updated Nationally Determined Contributions',
            category: 'Environment',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            content: 'India has submitted its updated NDCs to the UNFCCC, committing to achieve net-zero emissions by 2070 and increase renewable energy capacity to 500 GW by 2030.',
            importance: 'medium',
            readStatus: 'unread',
            bookmarked: false,
            tags: ['climate-change', 'environment', 'renewable-energy', 'ndc'],
            source: 'Ministry of Environment',
            relatedTopics: ['Paris Agreement', 'Renewable Energy', 'Sustainable Development']
          },
          {
            id: 'ca-5',
            title: 'Digital India Initiative: New Cybersecurity Framework',
            category: 'Science & Technology',
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            content: 'The government has launched a comprehensive cybersecurity framework under Digital India, focusing on critical infrastructure protection and data privacy.',
            importance: 'medium',
            readStatus: 'read',
            bookmarked: false,
            tags: ['digital-india', 'cybersecurity', 'technology', 'data-protection'],
            source: 'Ministry of Electronics and IT',
            relatedTopics: ['Data Protection Bill', 'Digital Infrastructure', 'Cyber Threats']
          }
        ],
        categories: [
          { name: 'Economy', count: 45, unreadCount: 12 },
          { name: 'Polity', count: 38, unreadCount: 8 },
          { name: 'International Relations', count: 32, unreadCount: 15 },
          { name: 'Environment', count: 28, unreadCount: 10 },
          { name: 'Science & Technology', count: 25, unreadCount: 7 },
          { name: 'Social Issues', count: 22, unreadCount: 9 },
          { name: 'Defense & Security', count: 18, unreadCount: 5 }
        ],
        stats: {
          totalItems: 208,
          readItems: 142,
          unreadItems: 66,
          bookmarkedItems: 28,
          readingProgress: 68
        }
      };

      // Store the initial data
      currentAffairsStorage[storageKey] = currentAffairsData;
    }

    return NextResponse.json({
      success: true,
      data: currentAffairsData
    });

  } catch (error) {
    console.error('❌ Error fetching current affairs data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch current affairs data' 
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

    const storageKey = `current-affairs-${userId}`;

    // Get current data
    let currentAffairsData = currentAffairsStorage[storageKey] || { recent: [], categories: [], stats: {} };

    if (action === 'update' && itemId && updates) {
      // Find and update the item
      const itemIndex = currentAffairsData.recent.findIndex((item: any) => item.id === itemId);
      if (itemIndex !== -1) {
        const oldStatus = currentAffairsData.recent[itemIndex].readStatus;
        currentAffairsData.recent[itemIndex] = { 
          ...currentAffairsData.recent[itemIndex], 
          ...updates
        };
        
        // Update stats if read status changed
        if (oldStatus !== updates.readStatus) {
          if (oldStatus === 'unread' && updates.readStatus === 'read') {
            currentAffairsData.stats.readItems += 1;
            currentAffairsData.stats.unreadItems -= 1;
          } else if (oldStatus === 'read' && updates.readStatus === 'unread') {
            currentAffairsData.stats.readItems -= 1;
            currentAffairsData.stats.unreadItems += 1;
          }
          
          // Recalculate reading progress
          currentAffairsData.stats.readingProgress = Math.round(
            (currentAffairsData.stats.readItems / currentAffairsData.stats.totalItems) * 100
          );
        }
        
        // Update bookmark count
        if (updates.bookmarked !== undefined) {
          const bookmarkedItems = currentAffairsData.recent.filter((item: any) => item.bookmarked).length;
          currentAffairsData.stats.bookmarkedItems = bookmarkedItems;
        }
        
        currentAffairsStorage[storageKey] = currentAffairsData;
        
        console.log('✅ Current affairs item updated:', itemId, updates);
        
        return NextResponse.json({
          success: true,
          message: 'Current affairs item updated successfully'
        });
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Current affairs item not found' 
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
    console.error('❌ Error updating current affairs data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update current affairs data' 
      },
      { status: 500 }
    );
  }
}
