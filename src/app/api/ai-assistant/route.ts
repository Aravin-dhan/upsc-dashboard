import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// Enhanced AI Configuration with Gemini 2.5 Flash
const AI_CONFIG = {
  model: 'gemini-2.5-flash',
  apiKey: process.env.GEMINI_API_KEY, // Removed hardcoded key for security
  maxTokens: 4096,
  temperature: 0.7,
  timeout: 10000, // 10 seconds timeout
};

interface AIAssistantRequest {
  message: string;
  context?: {
    currentPage?: string;
    userProfile?: any;
    userStats?: any;
    recentActivity?: any;
    availableData?: any;
    preferences?: any;
  };
}

interface AIAssistantResponse {
  message: string;
  actions?: Array<{
    type: string;
    payload?: any;
    description?: string;
  }>;
  suggestions?: string[];
  dataRequests?: string[];
}

async function processAIRequest(request: AIAssistantRequest): Promise<AIAssistantResponse> {
  const message = request.message.toLowerCase();

  // Dashboard management commands
  if (message.includes('dashboard') || message.includes('customize') || message.includes('widget')) {
    if (message.includes('customize') || message.includes('edit') || message.includes('change layout')) {
      return {
        message: "I can help you customize your dashboard! You can drag widgets to reorder them, resize them, or hide/show widgets. Would you like me to enable edit mode?",
        actions: [
          { type: 'TOGGLE_DASHBOARD_EDIT_MODE', payload: {} },
          { type: 'NAVIGATE', payload: { url: '/' } }
        ],
        suggestions: ["Enable edit mode", "Show widget options", "Reset to default layout"]
      };
    }

    if (message.includes('reset') || message.includes('default')) {
      return {
        message: "I can reset your dashboard to the default layout. This will restore all widgets to their original positions and sizes. Should I proceed?",
        actions: [{ type: 'RESET_DASHBOARD_LAYOUT', payload: {} }],
        suggestions: ["Reset dashboard", "Keep current layout", "Show layout options"]
      };
    }

    return {
      message: "Your dashboard is fully customizable! You can rearrange widgets, change their sizes, and personalize your study experience. What would you like to do?",
      actions: [{ type: 'NAVIGATE', payload: { url: '/' } }],
      suggestions: ["Customize dashboard", "Reset layout", "Show widget options"]
    };
  }

  // Bookmark management
  if (message.includes('bookmark') || message.includes('save') || message.includes('favorite')) {
    return {
      message: "I can help you manage your bookmarks! Save important articles, notes, or resources for quick access later.",
      actions: [{ type: 'NAVIGATE', payload: { url: '/bookmarks' } }],
      suggestions: ["View bookmarks", "Add current page", "Organize bookmarks"]
    };
  }

  // Memory and context commands
  if (message.includes('remember') || message.includes('recall') || message.includes('history')) {
    return {
      message: "I remember our conversations and your study patterns! I can recall previous discussions, track your progress, and provide personalized recommendations based on your learning history.",
      suggestions: ["Show conversation history", "View study patterns", "Get personalized tips"]
    };
  }
  
  // Simple pattern matching for common requests
  if (message.includes('dictionary') || message.includes('vocabulary') || message.includes('word')) {
    return {
      message: "I can help you with vocabulary! The Dictionary section has advanced filtering, word of the day, and UPSC-relevant terms. Would you like me to open it?",
      actions: [{ type: 'NAVIGATE', payload: { url: '/dictionary' } }],
      suggestions: ["Open Dictionary", "Search for a specific word", "Show word of the day"]
    };
  }
  
  if (message.includes('map') || message.includes('geography') || message.includes('location')) {
    return {
      message: "Check out the Interactive Maps section for UPSC geography! It has important locations like Kashmir Valley, Western Ghats, and more with exam relevance.",
      actions: [{ type: 'NAVIGATE', payload: { url: '/maps' } }],
      suggestions: ["Open Maps", "Show important locations", "Geography quiz"]
    };
  }
  
  if (message.includes('current affairs') || message.includes('news') || message.includes('editorial')) {
    return {
      message: "Stay updated with Current Affairs! I can show you latest news from The Hindu and DrishtiIAS editorials.",
      actions: [{ type: 'NAVIGATE', payload: { url: '/current-affairs' } }],
      suggestions: ["Open Current Affairs", "Show latest editorials", "News analysis"]
    };
  }
  
  if (message.includes('schedule') || message.includes('calendar') || message.includes('plan')) {
    return {
      message: "Let me help you organize your study schedule! The Schedule section has time blocking and goal tracking.",
      actions: [{ type: 'NAVIGATE', payload: { url: '/schedule' } }],
      suggestions: ["Open Schedule", "Create study plan", "Set study goals"]
    };
  }
  
  if (message.includes('analytics') || message.includes('progress') || message.includes('performance')) {
    return {
      message: "Track your UPSC preparation progress with detailed analytics! See your study time, accuracy, and improvement trends.",
      actions: [{ type: 'NAVIGATE', payload: { url: '/analytics' } }],
      suggestions: ["Open Analytics", "View progress report", "Check study streak"]
    };
  }
  
  if (message.includes('syllabus') || message.includes('curriculum') || message.includes('topics')) {
    return {
      message: "Access the comprehensive UPSC syllabus with progress tracking and detailed topic breakdown.",
      actions: [{ type: 'NAVIGATE', payload: { url: '/syllabus' } }],
      suggestions: ["Open Syllabus", "Track topic progress", "Show important topics"]
    };
  }
  
  if (message.includes('practice') || message.includes('test') || message.includes('quiz') || message.includes('questions')) {
    return {
      message: "Practice makes perfect! Try the practice section for mock tests and question analysis.",
      actions: [{ type: 'NAVIGATE', payload: { url: '/practice' } }],
      suggestions: ["Start Practice", "Take mock test", "Review answers"]
    };
  }
  
  if (message.includes('help') || message.includes('how') || message.includes('guide')) {
    return {
      message: "I'm here to help with your UPSC preparation! I can navigate to different sections, explain features, or provide study guidance. What would you like to know?",
      suggestions: [
        "Show me the dictionary",
        "Open current affairs", 
        "Check my progress",
        "Plan my study schedule"
      ]
    };
  }
  
  // Default response
  return {
    message: "I'm your UPSC preparation assistant! I can help you navigate the dashboard, track progress, and optimize your study plan. What would you like to do?",
    suggestions: [
      "Open Dictionary for vocabulary building",
      "Check Current Affairs for latest news",
      "View Analytics for progress tracking",
      "Access Interactive Maps for geography"
    ]
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body: AIAssistantRequest = await request.json();

    if (!body.message) {
      return NextResponse.json(
        {
          success: false,
          error: "Message is required"
        },
        { status: 400 }
      );
    }

    // Check if AI service is available
    if (!AI_CONFIG.apiKey) {
      return NextResponse.json({
        success: true,
        response: {
          message: "I'm currently unavailable as the AI service is being configured. However, I can still help you navigate the platform and provide basic assistance. Please try again later for advanced AI features.",
          actions: [
            { type: 'NAVIGATE', payload: { url: '/dashboard' }, description: 'Go to Dashboard' },
            { type: 'NAVIGATE', payload: { url: '/practice' }, description: 'Start Practice Tests' }
          ],
          suggestions: ['Go to Dashboard', 'Practice Tests', 'Study Materials', 'Contact Support']
        }
      });
    }

    const aiResponse = await processAIRequest(body);
    
    return NextResponse.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        response: {
          message: "I'm sorry, I encountered an error. Please try again or use the navigation menu.",
          suggestions: [
            "Try rephrasing your question",
            "Use the navigation menu",
            "Check the help section"
          ]
        }
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "AI Assistant API is running",
    timestamp: new Date().toISOString()
  });
}
