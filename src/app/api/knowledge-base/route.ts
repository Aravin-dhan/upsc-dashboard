import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// In-memory storage for demo
let knowledgeStorage: { [key: string]: any } = {};

export async function GET(request: NextRequest) {
  try {
    let userId = 'default';
    try {
      const session = await getSession(request);
      userId = session?.user?.id || 'default';
    } catch (authError) {
      console.log('Auth not available, using default user');
    }

    const storageKey = `knowledge-${userId}`;
    let knowledgeData = knowledgeStorage[storageKey];

    if (!knowledgeData) {
      knowledgeData = {
        items: [
          {
            id: 'kb-1',
            title: 'Constitutional Framework of India',
            content: 'Comprehensive notes on the Indian Constitution including Preamble, Fundamental Rights, DPSP, and Fundamental Duties. Covers historical background, constituent assembly debates, and key amendments.',
            category: 'Polity',
            tags: ['constitution', 'fundamental-rights', 'dpsp', 'amendments'],
            difficulty: 'intermediate',
            lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            accessCount: 25,
            isFavorite: true,
            relatedItems: ['kb-2', 'kb-5'],
            attachments: []
          },
          {
            id: 'kb-2',
            title: 'Ancient Indian History Timeline',
            content: 'Detailed timeline of Ancient Indian history from Indus Valley Civilization to the end of Gupta period. Includes major dynasties, cultural developments, and archaeological evidence.',
            category: 'History',
            tags: ['ancient-history', 'timeline', 'dynasties', 'culture'],
            difficulty: 'beginner',
            lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            accessCount: 18,
            isFavorite: false,
            relatedItems: ['kb-3', 'kb-4'],
            attachments: []
          },
          {
            id: 'kb-3',
            title: 'Indian Monsoon System',
            content: 'Comprehensive study of the Indian monsoon system including mechanism, types, seasonal variations, and impact on agriculture and economy.',
            category: 'Geography',
            tags: ['monsoon', 'climate', 'agriculture', 'weather'],
            difficulty: 'advanced',
            lastAccessed: new Date().toISOString(),
            accessCount: 32,
            isFavorite: true,
            relatedItems: ['kb-6'],
            attachments: []
          }
        ],
        categories: [
          { name: 'Polity', count: 45, recentlyAdded: 3 },
          { name: 'History', count: 38, recentlyAdded: 2 },
          { name: 'Geography', count: 32, recentlyAdded: 1 },
          { name: 'Economics', count: 28, recentlyAdded: 4 },
          { name: 'Current Affairs', count: 25, recentlyAdded: 8 }
        ],
        stats: {
          totalItems: 168,
          favoriteItems: 23,
          recentlyAccessed: 12,
          totalAccesses: 1456
        },
        recentlyAccessed: []
      };
      knowledgeStorage[storageKey] = knowledgeData;
    }

    return NextResponse.json({ success: true, data: knowledgeData });
  } catch (error) {
    console.error('❌ Error fetching knowledge data:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch knowledge data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    let userId = 'default';
    try {
      const session = await getSession(request);
      userId = session?.user?.id || 'default';
    } catch (authError) {
      console.log('Auth not available, using default user');
    }

    const body = await request.json();
    const { action, itemId, updates } = body;
    const storageKey = `knowledge-${userId}`;
    let knowledgeData = knowledgeStorage[storageKey] || { items: [], categories: [], stats: {} };

    if (action === 'update' && itemId && updates) {
      const itemIndex = knowledgeData.items.findIndex((item: any) => item.id === itemId);
      if (itemIndex !== -1) {
        knowledgeData.items[itemIndex] = { ...knowledgeData.items[itemIndex], ...updates };
        knowledgeStorage[storageKey] = knowledgeData;
        return NextResponse.json({ success: true, message: 'Knowledge item updated successfully' });
      } else {
        return NextResponse.json({ success: false, error: 'Knowledge item not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid action or missing parameters' }, { status: 400 });
  } catch (error) {
    console.error('❌ Error updating knowledge data:', error);
    return NextResponse.json({ success: false, error: 'Failed to update knowledge data' }, { status: 500 });
  }
}
