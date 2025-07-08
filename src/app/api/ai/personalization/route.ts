import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { UserDatabase } from '@/lib/database';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';

interface UserActivity {
  page: string;
  action: string;
  timestamp: string;
  duration?: number;
  metadata?: any;
}

interface StudyPattern {
  preferredStudyTime: string;
  averageSessionDuration: number;
  mostActivePages: string[];
  weakAreas: string[];
  strongAreas: string[];
  studyStreak: number;
}

interface PersonalizationData {
  studyPatterns: StudyPattern;
  recommendations: {
    nextTopics: string[];
    studySchedule: any;
    practiceTests: string[];
    currentAffairs: string[];
    motivationalTips: string[];
  };
  adaptiveLearningPath: {
    currentLevel: string;
    nextMilestones: string[];
    estimatedTimeToGoal: string;
  };
}

// GET /api/ai/personalization - Get personalized recommendations
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await UserDatabase.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user activity and preferences
    const userActivity = user.preferences?.userActivity || [];
    const studyHistory = user.preferences?.studyHistory || {};
    const dashboardLayout = user.preferences?.dashboardLayout || {};

    // Analyze patterns and generate recommendations
    const personalizationData = await generatePersonalizedRecommendations(
      userActivity,
      studyHistory,
      dashboardLayout,
      user
    );

    return NextResponse.json({
      success: true,
      personalization: personalizationData,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get personalization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/ai/personalization/activity - Track user activity
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { page, action, duration, metadata } = body;

    if (!page || !action) {
      return NextResponse.json(
        { error: 'Page and action are required' },
        { status: 400 }
      );
    }

    const user = await UserDatabase.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userActivity = user.preferences?.userActivity || [];
    const newActivity: UserActivity = {
      page,
      action,
      timestamp: new Date().toISOString(),
      duration,
      metadata
    };

    // Keep only the latest 1000 activities to prevent database bloat
    const updatedActivity = [newActivity, ...userActivity].slice(0, 1000);

    // Update user preferences
    const updatedUser = await UserDatabase.updateUser(session.user.id, {
      preferences: {
        ...user.preferences,
        userActivity: updatedActivity,
        updatedAt: new Date().toISOString()
      }
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to track activity' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Activity tracked successfully'
    });

  } catch (error) {
    console.error('Track activity error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generatePersonalizedRecommendations(
  userActivity: UserActivity[],
  studyHistory: any,
  dashboardLayout: any,
  user: any
): Promise<PersonalizationData> {
  try {
    // Analyze study patterns
    const studyPatterns = analyzeStudyPatterns(userActivity);
    
    // Generate AI-powered recommendations
    const aiRecommendations = await generateAIRecommendations(userActivity, studyHistory, user);
    
    // Create adaptive learning path
    const adaptiveLearningPath = createAdaptiveLearningPath(studyPatterns, studyHistory);

    return {
      studyPatterns,
      recommendations: aiRecommendations,
      adaptiveLearningPath
    };

  } catch (error) {
    console.error('Error generating personalized recommendations:', error);
    
    // Fallback recommendations
    return {
      studyPatterns: {
        preferredStudyTime: 'morning',
        averageSessionDuration: 60,
        mostActivePages: ['/learning', '/practice', '/current-affairs'],
        weakAreas: ['Essay Writing', 'Current Affairs'],
        strongAreas: ['General Studies', 'History'],
        studyStreak: 5
      },
      recommendations: {
        nextTopics: ['Constitutional Law', 'Indian Economy', 'Environmental Issues'],
        studySchedule: {
          morning: 'General Studies',
          afternoon: 'Current Affairs',
          evening: 'Practice Tests'
        },
        practiceTests: ['Polity Mock Test', 'Geography Quiz', 'History MCQs'],
        currentAffairs: ['Economic Survey 2024', 'Climate Change Updates', 'Government Schemes'],
        motivationalTips: [
          'Consistency is key to UPSC success',
          'Focus on understanding concepts rather than memorizing',
          'Regular revision is crucial for retention'
        ]
      },
      adaptiveLearningPath: {
        currentLevel: 'Intermediate',
        nextMilestones: ['Complete Polity Syllabus', 'Improve Answer Writing', 'Current Affairs Mastery'],
        estimatedTimeToGoal: '8 months'
      }
    };
  }
}

function analyzeStudyPatterns(userActivity: UserActivity[]): StudyPattern {
  if (!userActivity.length) {
    return {
      preferredStudyTime: 'morning',
      averageSessionDuration: 60,
      mostActivePages: [],
      weakAreas: [],
      strongAreas: [],
      studyStreak: 0
    };
  }

  // Analyze preferred study time
  const timeDistribution = userActivity.reduce((acc, activity) => {
    const hour = new Date(activity.timestamp).getHours();
    const timeSlot = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    acc[timeSlot] = (acc[timeSlot] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const preferredStudyTime = Object.entries(timeDistribution)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'morning';

  // Calculate average session duration
  const sessionsWithDuration = userActivity.filter(a => a.duration);
  const averageSessionDuration = sessionsWithDuration.length > 0
    ? sessionsWithDuration.reduce((sum, a) => sum + (a.duration || 0), 0) / sessionsWithDuration.length
    : 60;

  // Find most active pages
  const pageActivity = userActivity.reduce((acc, activity) => {
    acc[activity.page] = (acc[activity.page] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostActivePages = Object.entries(pageActivity)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([page]) => page);

  // Calculate study streak (simplified)
  const studyStreak = calculateStudyStreak(userActivity);

  return {
    preferredStudyTime,
    averageSessionDuration: Math.round(averageSessionDuration),
    mostActivePages,
    weakAreas: ['Essay Writing', 'Current Affairs'], // This would be calculated based on performance data
    strongAreas: ['General Studies', 'History'], // This would be calculated based on performance data
    studyStreak
  };
}

function calculateStudyStreak(userActivity: UserActivity[]): number {
  if (!userActivity.length) return 0;

  const today = new Date();
  let streak = 0;
  
  for (let i = 0; i < 30; i++) { // Check last 30 days
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    
    const hasActivity = userActivity.some(activity => {
      const activityDate = new Date(activity.timestamp);
      return activityDate.toDateString() === checkDate.toDateString();
    });
    
    if (hasActivity) {
      streak++;
    } else if (i === 0) {
      // If no activity today, streak is 0
      return 0;
    } else {
      // Break in streak found
      break;
    }
  }
  
  return streak;
}

async function generateAIRecommendations(userActivity: UserActivity[], studyHistory: any, user: any) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDhuFGySigse5Yk8K2dMcQ8Jxv8_Je1bRA';
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Based on this UPSC aspirant's activity data, provide personalized study recommendations:

User Activity: ${JSON.stringify(userActivity.slice(0, 20))}
Study History: ${JSON.stringify(studyHistory)}
User Role: ${user.role}

Provide recommendations in JSON format:
{
  "nextTopics": ["topic1", "topic2", "topic3"],
  "studySchedule": {
    "morning": "subject",
    "afternoon": "subject", 
    "evening": "activity"
  },
  "practiceTests": ["test1", "test2", "test3"],
  "currentAffairs": ["topic1", "topic2", "topic3"],
  "motivationalTips": ["tip1", "tip2", "tip3"]
}

Focus on UPSC-specific recommendations based on the user's activity patterns.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      return JSON.parse(text);
    } catch {
      // Fallback if AI response is not valid JSON
      throw new Error('Invalid AI response format');
    }

  } catch (error) {
    console.error('AI recommendation generation failed:', error);
    throw error;
  }
}

function createAdaptiveLearningPath(studyPatterns: StudyPattern, studyHistory: any) {
  // This would be more sophisticated in a real implementation
  const totalStudyTime = studyPatterns.averageSessionDuration * studyPatterns.studyStreak;
  
  let currentLevel = 'Beginner';
  if (totalStudyTime > 100) currentLevel = 'Intermediate';
  if (totalStudyTime > 500) currentLevel = 'Advanced';

  return {
    currentLevel,
    nextMilestones: [
      'Complete Current Syllabus Section',
      'Improve Weak Areas',
      'Master Answer Writing',
      'Current Affairs Proficiency'
    ],
    estimatedTimeToGoal: totalStudyTime > 300 ? '6 months' : '12 months'
  };
}
