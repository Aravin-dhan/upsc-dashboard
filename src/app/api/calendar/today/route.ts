import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

/**
 * TODAY'S SCHEDULE API
 * Provides today's study schedule and activities with real-time synchronization
 */

// In-memory storage for demo (in production, use database)
let scheduleStorage: { [key: string]: any } = {};

export async function GET(request: NextRequest) {
  try {
    // Get user session for personalized schedule
    let session;
    let userId = 'default';
    try {
      session = await getSession(request);
      userId = session?.user?.id || 'default';
    } catch (authError) {
      console.log('Auth not available, using default user');
    }

    const today = new Date().toISOString().split('T')[0];
    const storageKey = `${userId}-${today}`;

    // Check if we have stored data for today
    let scheduleItems = scheduleStorage[storageKey];

    if (!scheduleItems) {
      // Generate initial realistic schedule data
      const currentHour = new Date().getHours();

      scheduleItems = [
        {
          id: 'schedule-1',
          time: '9:00 AM',
          subject: 'History - Ancient India',
          status: currentHour > 10 ? 'completed' : currentHour === 9 ? 'in-progress' : 'pending',
          color: 'green',
          duration: 120, // minutes
          topics: ['Indus Valley Civilization', 'Vedic Period']
        },
        {
          id: 'schedule-2',
          time: '11:00 AM',
          subject: 'Polity - Constitutional Law',
          status: currentHour > 12 ? 'completed' : currentHour === 11 ? 'in-progress' : 'pending',
          color: 'blue',
          duration: 90,
          topics: ['Fundamental Rights', 'Directive Principles']
        },
        {
          id: 'schedule-3',
          time: '2:00 PM',
          subject: 'Current Affairs Review',
          status: currentHour > 15 ? 'completed' : currentHour === 14 ? 'in-progress' : 'pending',
          color: 'yellow',
          duration: 60,
          topics: ['Economic Survey 2024', 'Policy Updates']
        },
        {
          id: 'schedule-4',
          time: '4:00 PM',
          subject: 'Mock Test - Prelims',
          status: currentHour > 17 ? 'completed' : currentHour === 16 ? 'in-progress' : 'pending',
          color: 'purple',
          duration: 120,
          topics: ['General Studies Paper 1', 'CSAT']
        },
        {
          id: 'schedule-5',
          time: '7:00 PM',
          subject: 'Geography - Physical Geography',
          status: currentHour > 20 ? 'completed' : currentHour === 19 ? 'in-progress' : 'pending',
          color: 'orange',
          duration: 90,
          topics: ['Climate', 'Monsoons']
        }
      ];

      // Store the initial data
      scheduleStorage[storageKey] = scheduleItems;
    }

    // Calculate completion stats
    const completedItems = scheduleItems.filter((item: any) => item.status === 'completed').length;
    const totalItems = scheduleItems.length;
    const completionRate = Math.round((completedItems / totalItems) * 100);

    return NextResponse.json({
      success: true,
      data: {
        date: today,
        schedule: scheduleItems,
        stats: {
          total: totalItems,
          completed: completedItems,
          pending: scheduleItems.filter((item: any) => item.status === 'pending').length,
          inProgress: scheduleItems.filter((item: any) => item.status === 'in-progress').length,
          completionRate
        },
        totalStudyTime: scheduleItems.reduce((total: number, item: any) => total + item.duration, 0),
        completedStudyTime: scheduleItems
          .filter((item: any) => item.status === 'completed')
          .reduce((total: number, item: any) => total + item.duration, 0)
      }
    });

  } catch (error) {
    console.error('Error fetching today\'s schedule:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch today\'s schedule',
        data: null
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
    const { action, itemId, updates, item } = body;

    const today = new Date().toISOString().split('T')[0];
    const storageKey = `${userId}-${today}`;

    // Get current schedule data
    let scheduleItems = scheduleStorage[storageKey] || [];

    if (action === 'update' && itemId && updates) {
      // Update existing item
      const itemIndex = scheduleItems.findIndex((item: any) => item.id === itemId);
      if (itemIndex !== -1) {
        scheduleItems[itemIndex] = { ...scheduleItems[itemIndex], ...updates };
        scheduleStorage[storageKey] = scheduleItems;

        console.log('✅ Schedule item updated:', itemId, updates);

        return NextResponse.json({
          success: true,
          message: 'Schedule item updated successfully',
          data: scheduleItems[itemIndex]
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            error: 'Schedule item not found'
          },
          { status: 404 }
        );
      }
    } else if (action === 'add' && item) {
      // Add new item
      const newItem = {
        id: `schedule-${Date.now()}`,
        ...item,
        date: today
      };
      scheduleItems.push(newItem);
      scheduleStorage[storageKey] = scheduleItems;

      console.log('✅ Schedule item added:', newItem);

      return NextResponse.json({
        success: true,
        message: 'Schedule item added successfully',
        data: newItem
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
    console.error('❌ Error updating schedule:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update schedule'
      },
      { status: 500 }
    );
  }
}
