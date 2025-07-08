import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// Fallback response generator when AI service is unavailable
function generateFallbackResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();

  if (message.includes('syllabus') || message.includes('curriculum')) {
    return `**UPSC Syllabus Overview:**

**Preliminary Examination:**
• General Studies Paper I: Current events, History, Geography, Polity, Economics, Environment
• General Studies Paper II (CSAT): Comprehension, reasoning, mental ability, decision making

**Main Examination:**
• Essay Paper
• General Studies Papers I-IV covering History, Geography, Polity, Economics, Ethics, etc.
• Optional Subject Papers
• Language Papers

**Key Study Tips:**
• Start with NCERT books for basics
• Read newspapers daily for current affairs
• Practice previous year questions
• Take regular mock tests

For detailed syllabus, visit the official UPSC website or check our syllabus section.`;
  }

  if (message.includes('strategy') || message.includes('preparation') || message.includes('plan')) {
    return `**UPSC Preparation Strategy:**

**Phase 1: Foundation (3-4 months)**
• Complete NCERT books (6th-12th)
• Basic understanding of all subjects
• Start newspaper reading habit

**Phase 2: Detailed Study (6-8 months)**
• Standard reference books for each subject
• Current affairs compilation
• Answer writing practice

**Phase 3: Revision & Tests (2-3 months)**
• Multiple revisions of notes
• Mock test series
• Previous year papers

**Daily Schedule:**
• 8-10 hours of focused study
• 2 hours for current affairs
• 1 hour for answer writing
• Regular breaks and physical activity

Remember: Consistency is key to UPSC success!`;
  }

  if (message.includes('current affairs') || message.includes('news')) {
    return `**Current Affairs for UPSC:**

**Daily Sources:**
• The Hindu (Editorial and main news)
• Indian Express (Explained section)
• PIB (Press Information Bureau)
• Rajya Sabha TV discussions

**Monthly Compilation:**
• Vision IAS Monthly Magazine
• Insights on India Monthly
• Government reports and surveys

**Important Areas:**
• Government schemes and policies
• International relations
• Economic developments
• Science and technology
• Environment and ecology

**Tips:**
• Make concise notes
• Link with static portions
• Practice answer writing
• Regular revision

Stay updated with our Current Affairs section for latest news and analysis!`;
  }

  return `**UPSC Preparation Guidance:**

I'm here to help with your UPSC journey! Here are some key areas I can assist with:

**📚 Study Materials:**
• NCERT books for foundation
• Standard reference books
• Current affairs sources
• Previous year papers

**📝 Preparation Strategy:**
• Subject-wise study plan
• Time management tips
• Answer writing techniques
• Revision strategies

**📊 Progress Tracking:**
• Mock test analysis
• Performance evaluation
• Weak area identification
• Improvement suggestions

**🎯 Exam-Specific Tips:**
• Prelims strategy
• Mains preparation
• Interview guidance
• Optional subject selection

Feel free to ask specific questions about any UPSC topic, and I'll provide detailed guidance to help you succeed!

*Note: AI service is temporarily unavailable, but I'm still here to help with your UPSC preparation!*`;
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

    const body = await request.json();
    const { history, context, message } = body;

    let processedHistory: any[] = [];
    let userMessage = '';

    // Handle both formats: direct message or history array
    if (message && typeof message === 'string') {
      // Simple message format - convert to history format
      userMessage = message.trim();
      if (!userMessage) {
        return NextResponse.json(
          { error: 'Message cannot be empty' },
          { status: 400 }
        );
      }
      processedHistory = [{ role: 'user', content: userMessage }];
    } else if (history && Array.isArray(history) && history.length > 0) {
      // History format validation
      const lastMessage = history[history.length - 1];
      if (!lastMessage || typeof lastMessage.content !== 'string' || lastMessage.content.trim() === '') {
        return NextResponse.json(
          { error: 'Last message in history must have valid content' },
          { status: 400 }
        );
      }
      processedHistory = history;
      userMessage = lastMessage.content;
    } else {
      return NextResponse.json(
        { error: 'Either message or history array is required' },
        { status: 400 }
      );
    }

    // Check if API key is available and provide fallback if not
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not set in environment variables. Providing fallback response.');

      // Provide a helpful fallback response based on the user's question
      const fallbackResponse = generateFallbackResponse(userMessage);

      return NextResponse.json({
        response: fallbackResponse,
        fallback: true,
        note: "This is a fallback response. AI service is currently unavailable."
      });
    }

    let genAI, model;
    try {
      genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } catch (initError) {
      console.warn('Failed to initialize Gemini AI. Providing fallback response.');
      const fallbackResponse = generateFallbackResponse(userMessage);

      return NextResponse.json({
        response: fallbackResponse,
        fallback: true,
        note: "This is a fallback response. AI service is currently unavailable."
      });
    }

    // Prepare history for Gemini API, ensuring it starts with a user message
    const geminiHistory = processedHistory.map((msg: any) => ({
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
        // Provide fallback response for API key issues
        const fallbackResponse = generateFallbackResponse(userMessage || 'general help');
        return NextResponse.json({
          response: fallbackResponse,
          fallback: true,
          note: "AI service is currently unavailable, but here's some helpful information!"
        });
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