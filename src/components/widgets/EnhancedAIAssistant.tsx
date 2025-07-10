'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff, 
  Brain, 
  History, 
  Bookmark,
  Settings,
  Minimize2,
  Maximize2,
  X,
  User,
  Bot,
  Clock,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AIMemoryService } from '@/services/AIMemoryService';
import { AIContextService } from '@/services/AIContextService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  actions?: any[];
  context?: any;
}

interface AIInsight {
  type: 'pattern' | 'recommendation' | 'reminder';
  title: string;
  description: string;
  action?: string;
  priority: 'low' | 'medium' | 'high';
}

export default function EnhancedAIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [userContext, setUserContext] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiMemoryService = AIMemoryService.getInstance();
  const aiContextService = AIContextService.getInstance();

  useEffect(() => {
    loadConversationHistory();
    loadUserContext();
    generateInsights();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversationHistory = () => {
    const recentConversations = aiMemoryService.getRecentConversations(5);
    const historyMessages: Message[] = recentConversations.map(conv => [
      {
        id: `${conv.id}-user`,
        text: conv.userMessage,
        sender: 'user' as const,
        timestamp: new Date(conv.timestamp)
      },
      {
        id: `${conv.id}-ai`,
        text: conv.aiResponse,
        sender: 'ai' as const,
        timestamp: new Date(conv.timestamp),
        actions: conv.actionsTaken
      }
    ]).flat();

    setMessages(historyMessages);
  };

  const loadUserContext = async () => {
    try {
      const context = await aiContextService.gatherContext(window.location.pathname);
      setUserContext(context);
    } catch (error) {
      console.error('Error loading user context:', error);
    }
  };

  const generateInsights = () => {
    const memoryContext = aiMemoryService.generateContextForAI();
    const dashboardPrefs = aiMemoryService.getDashboardPreferences();
    const bookmarkInsights = aiMemoryService.getBookmarkInsights();

    const newInsights: AIInsight[] = [];

    // Study pattern insights
    if (memoryContext.studyPatterns.length > 0) {
      const recentPattern = memoryContext.studyPatterns[0];
      newInsights.push({
        type: 'pattern',
        title: 'Study Pattern Detected',
        description: `You typically study for ${recentPattern.duration} minutes. Your most productive time appears to be ${recentPattern.timeOfDay}.`,
        priority: 'medium'
      });
    }

    // Dashboard customization insights
    if (dashboardPrefs.preferredLayout) {
      newInsights.push({
        type: 'recommendation',
        title: 'Dashboard Optimization',
        description: 'Based on your usage patterns, I can suggest better widget arrangements for your workflow.',
        action: 'optimize_dashboard',
        priority: 'low'
      });
    }

    // Bookmark insights
    if (bookmarkInsights.favoriteCategories.length > 0) {
      newInsights.push({
        type: 'recommendation',
        title: 'Content Recommendation',
        description: `You frequently bookmark ${bookmarkInsights.favoriteCategories[0]} content. I found new relevant articles.`,
        action: 'show_recommendations',
        priority: 'medium'
      });
    }

    setInsights(newInsights);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputText,
          context: userContext,
          conversationHistory: messages.slice(-5) // Last 5 messages for context
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          text: data.response.message,
          sender: 'ai',
          timestamp: new Date(),
          actions: data.response.actions
        };

        setMessages(prev => [...prev, aiMessage]);

        // Save to memory
        aiMemoryService.addConversation(
          inputText,
          data.response.message,
          userContext,
          data.response.actions
        );

        // Learn from interaction
        aiMemoryService.learnFromBehavior('ai-interaction', {
          query: inputText,
          response: data.response.message,
          actionsProvided: data.response.actions?.length || 0
        });

      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const executeAction = async (action: any) => {
    try {
      if (action.type === 'NAVIGATE') {
        window.location.href = action.payload.url;
      } else if (action.type === 'TOGGLE_DASHBOARD_EDIT_MODE') {
        // Trigger dashboard edit mode
        const event = new CustomEvent('toggleDashboardEditMode');
        window.dispatchEvent(event);
        toast.success('Dashboard edit mode toggled!');
      } else if (action.type === 'RESET_DASHBOARD_LAYOUT') {
        // Reset dashboard layout
        const event = new CustomEvent('resetDashboardLayout');
        window.dispatchEvent(event);
        toast.success('Dashboard layout reset!');
      }
    } catch (error) {
      console.error('Error executing action:', error);
      toast.error('Failed to execute action');
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {insights.length > 0 ? `${insights.length} insights available` : 'Ready to help'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Conversation History"
          >
            <History className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="Minimize"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Insights Panel */}
      {insights.length > 0 && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              AI Insights
            </span>
          </div>
          <div className="space-y-1">
            {insights.slice(0, 2).map((insight, index) => (
              <div key={index} className="text-xs text-blue-700 dark:text-blue-300">
                <strong>{insight.title}:</strong> {insight.description}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">
              Hi! I'm your AI assistant with persistent memory. I remember our conversations and learn from your study patterns.
            </p>
            <p className="text-xs mt-2">
              Try asking me about your dashboard, bookmarks, or study progress!
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === 'ai' && (
                  <Bot className="h-4 w-4 mt-0.5 text-blue-600" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{message.text}</p>
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => executeAction(action)}
                          className="block w-full text-left px-2 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                        >
                          {action.type.replace(/_/g, ' ').toLowerCase()}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your UPSC preparation..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
