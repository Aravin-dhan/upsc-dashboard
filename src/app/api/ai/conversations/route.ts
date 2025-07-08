import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { UserDatabase } from '@/lib/database';

export const runtime = 'nodejs';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    tokens?: number;
    model?: string;
    processingTime?: number;
  };
}

interface AIConversation {
  id: string;
  userId: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
  metadata?: {
    totalTokens?: number;
    messageCount?: number;
    lastActivity?: string;
  };
}

// GET /api/ai/conversations - Get user's conversations
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

    // Get conversations from user preferences
    const conversations = user.preferences?.aiConversations || [];

    return NextResponse.json({
      success: true,
      conversations: conversations.sort((a: any, b: any) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/ai/conversations - Create or update conversation
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
    const { conversationId, messages, title } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages data' },
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

    const conversations = user.preferences?.aiConversations || [];
    const now = new Date().toISOString();

    let conversation: AIConversation;

    if (conversationId) {
      // Update existing conversation
      const existingIndex = conversations.findIndex((c: any) => c.id === conversationId);
      
      if (existingIndex >= 0) {
        conversation = {
          ...conversations[existingIndex],
          messages,
          title: title || conversations[existingIndex].title,
          updatedAt: now,
          metadata: {
            totalTokens: messages.reduce((sum: number, msg: any) => sum + (msg.metadata?.tokens || 0), 0),
            messageCount: messages.length,
            lastActivity: now
          }
        };
        conversations[existingIndex] = conversation;
      } else {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }
    } else {
      // Create new conversation
      conversation = {
        id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: session.user.id,
        title: title || `Conversation ${new Date().toLocaleDateString()}`,
        messages,
        createdAt: now,
        updatedAt: now,
        metadata: {
          totalTokens: messages.reduce((sum: number, msg: any) => sum + (msg.metadata?.tokens || 0), 0),
          messageCount: messages.length,
          lastActivity: now
        }
      };
      conversations.push(conversation);
    }

    // Keep only the latest 50 conversations to prevent database bloat
    const sortedConversations = conversations
      .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 50);

    // Update user preferences
    const updatedUser = await UserDatabase.updateUser(session.user.id, {
      preferences: {
        ...user.preferences,
        aiConversations: sortedConversations,
        updatedAt: now
      }
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to save conversation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      conversation,
      message: conversationId ? 'Conversation updated successfully' : 'Conversation created successfully'
    });

  } catch (error) {
    console.error('Save conversation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/ai/conversations - Delete conversation
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession(request);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('id');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
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

    const conversations = user.preferences?.aiConversations || [];
    const filteredConversations = conversations.filter((c: any) => c.id !== conversationId);

    if (filteredConversations.length === conversations.length) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Update user preferences
    const updatedUser = await UserDatabase.updateUser(session.user.id, {
      preferences: {
        ...user.preferences,
        aiConversations: filteredConversations,
        updatedAt: new Date().toISOString()
      }
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to delete conversation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Conversation deleted successfully'
    });

  } catch (error) {
    console.error('Delete conversation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
