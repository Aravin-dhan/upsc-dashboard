import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

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

    const { history, context } = await request.json();

    // Basic validation for incoming data
    if (!history || !Array.isArray(history) || history.length === 0) {
      return NextResponse.json(
        { error: 'Message history is required and must be an array' },
        { status: 400 }
      );
    }

    const lastMessage = history[history.length - 1];
    if (!lastMessage || typeof lastMessage.content !== 'string' || lastMessage.content.trim() === '') {
      return NextResponse.json(
        { error: 'Last message in history must have valid content' },
        { status: 400 }
      );
    }

    // Check if API key is available and initialize genAI here
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables.');
      return NextResponse.json(
        { error: 'AI service is not configured. Please set GEMINI_API_KEY.' },
        { status: 500 }
      );
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Prepare history for Gemini API, ensuring it starts with a user message
    const geminiHistory = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model', // Map roles to Gemini's expected format
      parts: [{ text: msg.content }],
    })).filter((msg: any, index: number, arr: any[]) => {
      // If it's the first message and it's a model message, filter it out
      if (index === 0 && msg.role === 'model') {
        return false;
      }
      return true;
    });

    const chat = model.startChat({
      history: geminiHistory.slice(0, -1), // All but the last message form the history
      generationConfig: {
        maxOutputTokens: 2000,
      },
    });

    const userMessage = lastMessage.content;

    const fullPrompt = `You are a helpful UPSC (Union Public Service Commission) preparation assistant. You specialize in helping Indian civil services aspirants with their preparation. Your knowledge includes:\n\n- UPSC exam pattern, syllabus, and strategy\n- Current affairs and their relevance to UPSC\n- Subject-specific guidance (History, Geography, Polity, Economics, etc.)\n- Answer writing techniques for Mains\n- Interview preparation tips\n- Study planning and time management\n- Motivation and stress management\n\n${context ? `Here is some additional context for the current conversation: ${JSON.stringify(context)}` : ''}\n\nPlease provide helpful, accurate, and encouraging responses. Keep your answers concise but comprehensive. Use bullet points and structured formatting when appropriate. Be open-ended and provide detailed explanations when asked.\n\nUser question: ${userMessage}`;

    // Add timeout and retry logic
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000);
    });

    const chatPromise = (async () => {
      const result = await chat.sendMessage(fullPrompt);
      const response = await result.response;
      return response.text();
    })();

    const text = await Promise.race([chatPromise, timeoutPromise]) as string;

    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error('Error in chat API route:', error);

    let errorMessage = 'Failed to generate response due to an unexpected error.';
    if (error.message) {
      if (error.message.includes('API key')) {
        errorMessage = 'Invalid or missing GEMINI_API_KEY. Please check your environment variables.';
      } else if (error.message.includes('quota')) {
        errorMessage = 'AI API quota exceeded. Please try again later or check your Google Cloud project.';
      } else if (error.message.includes('model')) {
        errorMessage = 'AI model is temporarily unavailable or invalid. Please try again later.';
      } else if (error.message.includes('JSON') || error.message.includes('Unexpected token')) {
        errorMessage = 'Invalid request format sent to AI. Please try again.';
      } else if (error.message.includes('fetch failed') || error.message.includes('timeout')) {
        // Provide fallback response for network issues
        return NextResponse.json({
          response: `I apologize, but I'm currently experiencing connectivity issues with the AI service. However, I can still help you with UPSC preparation!

**For UPSC Preparation:**
• **Daily Current Affairs**: Read newspapers like The Hindu, Indian Express
• **Standard Books**: Refer to NCERT books for basics
• **Practice**: Solve previous year questions regularly
• **Time Management**: Create a structured study schedule
• **Mock Tests**: Take regular mock tests for both Prelims and Mains

**Study Strategy:**
• Focus on understanding concepts rather than rote learning
• Make concise notes for quick revision
• Practice answer writing for Mains preparation
• Stay updated with government schemes and policies

Please try your question again in a few moments, or feel free to ask about specific UPSC topics!`,
          fallback: true
        });
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}