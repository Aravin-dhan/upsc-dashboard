import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

/**
 * TODAY'S SCHEDULE API
 * Provides today's study schedule and activities
 */

export async function GET(request: NextRequest) {
  try {
    // Get user session for personalized schedule
    let session;
    try {
      session = await getSession(request);
    } catch (authError) {
      console.log('Auth not available, returning sample schedule');
    }

    // Generate realistic schedule data
    const today = new Date();
    const currentHour = today.getHours();
    
    const scheduleItems = [
      {
        time: '9:00 AM',
        subject: 'History - Ancient India',
        status: currentHour > 10 ? 'completed' : currentHour === 9 ? 'in-progress' : 'pending',
        color: 'green',
        duration: 120, // minutes
        topics: ['Indus Valley Civilization', 'Vedic Period']
      },
      {
        time: '11:00 AM',
        subject: 'Polity - Constitutional Law',
        status: currentHour > 12 ? 'completed' : currentHour === 11 ? 'in-progress' : 'pending',
        color: 'blue',
        duration: 90,
        topics: ['Fundamental Rights', 'Directive Principles']
      },
      {
        time: '2:00 PM',
        subject: 'Current Affairs Review',
        status: currentHour > 15 ? 'completed' : currentHour === 14 ? 'in-progress' : 'pending',
        color: 'yellow',
        duration: 60,
        topics: ['Economic Survey 2024', 'Policy Updates']
      },
      {
        time: '4:00 PM',
        subject: 'Mock Test - Prelims',
        status: currentHour > 17 ? 'completed' : currentHour === 16 ? 'in-progress' : 'pending',
        color: 'purple',
        duration: 120,
        topics: ['General Studies Paper 1', 'CSAT']
      },
      {
        time: '7:00 PM',
        subject: 'Geography - Physical Geography',
        status: currentHour > 20 ? 'completed' : currentHour === 19 ? 'in-progress' : 'pending',
        color: 'orange',
        duration: 90,
        topics: ['Climate', 'Monsoons']
      }
    ];

    // Calculate completion stats
    const completedItems = scheduleItems.filter(item => item.status === 'completed').length;
    const totalItems = scheduleItems.length;
    const completionRate = Math.round((completedItems / totalItems) * 100);

    return NextResponse.json({
      success: true,
      data: {
        date: today.toISOString().split('T')[0],
        schedule: scheduleItems,
        stats: {
          total: totalItems,
          completed: completedItems,
          pending: scheduleItems.filter(item => item.status === 'pending').length,
          inProgress: scheduleItems.filter(item => item.status === 'in-progress').length,
          completionRate
        },
        totalStudyTime: scheduleItems.reduce((total, item) => total + item.duration, 0),
        completedStudyTime: scheduleItems
          .filter(item => item.status === 'completed')
          .reduce((total, item) => total + item.duration, 0)
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
    const session = await getSession(request);
    const body = await request.json();

    // In production, this would update the schedule in database
    console.log('Updating schedule item:', body);

    return NextResponse.json({
      success: true,
      message: 'Schedule updated successfully'
    });

  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update schedule' 
      },
      { status: 500 }
    );
  }
}
