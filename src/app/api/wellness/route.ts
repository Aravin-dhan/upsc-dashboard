import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// In-memory storage for demo
let wellnessStorage: { [key: string]: any } = {};

export async function GET(request: NextRequest) {
  try {
    let userId = 'default';
    try {
      const session = await getSession(request);
      userId = session?.user?.id || 'default';
    } catch (authError) {
      console.log('Auth not available, using default user');
    }

    const storageKey = `wellness-${userId}`;
    let wellnessData = wellnessStorage[storageKey];

    if (!wellnessData) {
      const today = new Date().toISOString().split('T')[0];
      wellnessData = {
        todayEntry: {
          id: 'wellness-today',
          date: today,
          mood: 'good',
          energy: 7,
          stress: 4,
          sleep: 7.5,
          exercise: 30,
          studyHours: 6,
          notes: 'Feeling productive and focused today. Good balance between study and rest.',
          activities: ['meditation', 'reading', 'exercise', 'healthy-eating']
        },
        weeklyData: [
          {
            id: 'wellness-1',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            mood: 'excellent',
            energy: 8,
            stress: 3,
            sleep: 8,
            exercise: 45,
            studyHours: 7,
            notes: 'Great day with high productivity',
            activities: ['meditation', 'exercise', 'social-time']
          },
          {
            id: 'wellness-2',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            mood: 'neutral',
            energy: 6,
            stress: 6,
            sleep: 6.5,
            exercise: 20,
            studyHours: 5,
            notes: 'Average day, felt a bit stressed',
            activities: ['reading', 'music']
          }
        ],
        stats: {
          averageMood: 3.8,
          averageEnergy: 7.2,
          averageStress: 4.1,
          averageSleep: 7.3,
          totalExercise: 180,
          wellnessScore: 78
        },
        recommendations: [
          'Try to maintain consistent sleep schedule of 7-8 hours',
          'Consider adding more physical activity to reduce stress',
          'Practice mindfulness or meditation for better focus',
          'Take regular breaks during study sessions',
          'Maintain social connections for emotional well-being'
        ]
      };
      wellnessStorage[storageKey] = wellnessData;
    }

    return NextResponse.json({ success: true, data: wellnessData });
  } catch (error) {
    console.error('❌ Error fetching wellness data:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch wellness data' }, { status: 500 });
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
    const { action, entryId, updates } = body;
    const storageKey = `wellness-${userId}`;
    let wellnessData = wellnessStorage[storageKey] || { todayEntry: null, weeklyData: [], stats: {}, recommendations: [] };

    if (action === 'update' && entryId && updates) {
      if (entryId === 'wellness-today' && wellnessData.todayEntry) {
        wellnessData.todayEntry = { ...wellnessData.todayEntry, ...updates };
        
        // Recalculate stats if needed
        const allEntries = [wellnessData.todayEntry, ...wellnessData.weeklyData];
        const avgMood = allEntries.reduce((sum: number, entry: any) => {
          const moodValue = { terrible: 1, poor: 2, neutral: 3, good: 4, excellent: 5 }[entry.mood] || 3;
          return sum + moodValue;
        }, 0) / allEntries.length;
        
        wellnessData.stats.averageMood = Math.round(avgMood * 10) / 10;
        
        wellnessStorage[storageKey] = wellnessData;
        return NextResponse.json({ success: true, message: 'Wellness entry updated successfully' });
      }
    }

    return NextResponse.json({ success: false, error: 'Invalid action or missing parameters' }, { status: 400 });
  } catch (error) {
    console.error('❌ Error updating wellness data:', error);
    return NextResponse.json({ success: false, error: 'Failed to update wellness data' }, { status: 500 });
  }
}
