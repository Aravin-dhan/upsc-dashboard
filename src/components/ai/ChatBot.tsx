'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Send, Bot, User, Loader2, Trash2, Play, Calendar,
  FileText, BarChart3, ExternalLink, Settings,
  BookOpen, Target, TrendingUp, Sparkles, Brain, Clock,
  RefreshCw, Download, Mic, MicOff, Copy, ThumbsUp,
  ThumbsDown, Maximize2, Minimize2, Volume2, VolumeX,
  Zap, Filter, Search, Star, ChevronDown, ChevronUp, Moon, Sun
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';
// Temporarily disabled AI services for debugging
// import AIContextService, { AIContext } from '@/services/AIContextService';
// import AIActionHandlerModular from '@/services/AIActionHandlerModular';
// import AIActionHandler from '@/services/AIActionHandler';
// import AICommandParser from '@/services/AICommandParser';

// Import standalone navigation handler
import { NavigationCommandHandler } from '@/services/NavigationCommandHandler';
import { enhancedAICommandParser } from '@/services/EnhancedAICommandParser';

interface AIContext {
  currentPage: string;
  userPreferences: any;
  recentActivity: any[];
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  actions?: {
    type: string;
    payload: any;
    label?: string;
    icon?: string;
    priority?: 'high' | 'medium' | 'low';
  }[];
  suggestions?: string[];
  metadata?: {
    confidence?: number;
    processingTime?: number;
    tokens?: number;
    model?: string;
  };
  reactions?: {
    type: 'like' | 'dislike' | 'helpful' | 'not_helpful';
    count: number;
  }[];
  isEditing?: boolean;
  isCollapsed?: boolean;
  attachments?: {
    type: 'image' | 'file' | 'link';
    url: string;
    name: string;
  }[];
  quickActions?: {
    label: string;
    action: string;
    icon: string;
  }[];
}



export default function ChatBot() {
  const router = useRouter();
  const pathname = usePathname();

  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upsc-chat-messages');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
            actions: msg.actions || [],
            suggestions: msg.suggestions || []
          }));
        } catch (error) {
          console.error('Error loading chat messages:', error);
        }
      }
    }
    return [
      {
        id: '1',
        content: 'Hello! I\'m your advanced UPSC preparation assistant. I can help you with:\n\n• **Navigation Commands** - "open calendar", "go to practice", "show analytics"\n• Study strategies and planning\n• Subject-specific guidance\n• Current affairs analysis\n• Mock test preparation\n• Answer writing techniques\n• Motivation and stress management\n• **Website control and automation**\n• Data analysis and insights\n\n**Try these navigation commands:**\n• "open my calendar" - Go to schedule page\n• "go to practice" - Open mock tests\n• "show analytics" - View progress\n• "open study materials" - Access knowledge base\n• "show current affairs" - Latest news\n\nHow can I assist you today?',
        role: 'assistant',
        timestamp: new Date(),
        suggestions: [
          'open calendar',
          'go to practice',
          'show analytics',
          'open study materials',
          'show current affairs'
        ]
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState<AIContext | null>(null);
  const [capabilities, setCapabilities] = useState<any[]>([]);
  const [contextualSuggestions, setContextualSuggestions] = useState<string[]>([]);
  const [showCapabilities, setShowCapabilities] = useState(false);
  const [smartRecommendations, setSmartRecommendations] = useState<any[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [aiSystemReady, setAiSystemReady] = useState(false);

  // Enhanced interface state
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [messageFilter, setMessageFilter] = useState<'all' | 'actions' | 'suggestions'>('all');
  const [selectedTheme] = useState<'auto' | 'light' | 'dark'>('auto');
  const [typingIndicator] = useState(false);
  const [collapsedMessages, setCollapsedMessages] = useState<Set<string>>(new Set());
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [showConversationHistory, setShowConversationHistory] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const speechRecognition = useRef<any>(null);

  // AI service instances - temporarily disabled for debugging
  // const contextService = useMemo(() => AIContextService.getInstance(), []);
  // const actionHandler = useMemo(() => AIActionHandler.getInstance(), []);
  // const commandParser = useMemo(() => AICommandParser.getInstance(), []);

  // Initialize standalone navigation handler
  const navigationHandler = useMemo(() => new NavigationCommandHandler(router), [router]);

  const saveMessages = (newMessages: Message[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-chat-messages', JSON.stringify(newMessages));
    }
  };

  // Save conversation to database
  const saveConversation = async (messages: Message[], title?: string) => {
    try {
      const response = await fetch('/api/ai/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: currentConversationId,
          messages: messages.map(msg => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp.toISOString(),
            metadata: msg.metadata
          })),
          title: title || `Conversation ${new Date().toLocaleDateString()}`
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (!currentConversationId) {
          setCurrentConversationId(result.conversation.id);
        }
      }
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  };

  // Load conversations
  const loadConversations = async () => {
    try {
      const response = await fetch('/api/ai/conversations');
      if (response.ok) {
        const result = await response.json();
        setConversations(result.conversations || []);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  // Enhanced helper functions
  const toggleMessageCollapse = (messageId: string) => {
    setCollapsedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const copyMessageContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Message copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  const reactToMessage = (messageId: string, reactionType: 'like' | 'dislike' | 'helpful' | 'not_helpful') => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existingReaction = reactions.find(r => r.type === reactionType);

        if (existingReaction) {
          existingReaction.count += 1;
        } else {
          reactions.push({ type: reactionType, count: 1 });
        }

        return { ...msg, reactions };
      }
      return msg;
    }));
    toast.success('Reaction added');
  };

  const speakMessage = (content: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    } else {
      toast.error('Speech synthesis not supported');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      speechRecognition.current = new SpeechRecognition();
      speechRecognition.current.continuous = false;
      speechRecognition.current.interimResults = false;
      speechRecognition.current.lang = 'en-US';

      speechRecognition.current.onstart = () => {
        setIsListening(true);
        toast.success('Listening...');
      };

      speechRecognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      speechRecognition.current.onerror = () => {
        setIsListening(false);
        toast.error('Voice recognition failed');
      };

      speechRecognition.current.onend = () => {
        setIsListening(false);
      };

      speechRecognition.current.start();
    } else {
      toast.error('Speech recognition not supported');
    }
  };

  const stopVoiceInput = () => {
    if (speechRecognition.current) {
      speechRecognition.current.stop();
      setIsListening(false);
    }
  };

  const exportChat = () => {
    const chatData = {
      messages,
      timestamp: new Date().toISOString(),
      context: pathname
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `upsc-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Chat exported');
  };

  // Load context data and capabilities
  useEffect(() => {
    // Temporarily disabled AI context loading for debugging
    console.log('🔍 AI system temporarily disabled for debugging');
    setAiSystemReady(false);

    // Set basic context without AI services
    setContext({
      currentPage: pathname,
      userPreferences: {},
      recentActivity: []
    });

    setCapabilities([]);
    setContextualSuggestions([]);
    setSmartRecommendations([]);
  }, [pathname, router]);

  const executeAction = async (action: { type: string; payload: any; description?: string }) => {
    console.log('Executing action:', action);

    // Handle navigation actions with standalone navigation handler
    if (action.type === 'navigate_to_page' || action.type === 'NAVIGATE') {
      const targetPage = action.payload.page || action.payload.url;
      if (targetPage) {
        const result = navigationHandler.handleNavigationCommand(`go to ${targetPage}`);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
        return;
      }
    }

    // For other actions, show temporary message
    toast.error('AI actions temporarily disabled for debugging (except navigation)');
    console.log('Action would be executed:', action);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadConversations();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    const currentInput = input;

    // Check for quick responses first
    const quickResponse = enhancedAICommandParser.getQuickResponse(currentInput);
    if (quickResponse) {
      const quickResponseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: quickResponse,
        role: 'assistant',
        timestamp: new Date(),
        suggestions: ['Open calendar', 'Show analytics', 'Go to practice', 'Current affairs']
      };

      const finalMessages = [...updatedMessages, quickResponseMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
      await saveConversation(finalMessages);
      setInput('');
      return;
    }

    // Check for navigation commands
    if (navigationHandler.isNavigationCommand(currentInput)) {
      const result = navigationHandler.handleNavigationCommand(currentInput);

      const navigationResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: result.success
          ? `✅ ${result.message}`
          : `❌ ${result.message}\n\nAvailable pages:\n${navigationHandler.getAvailablePages().map(page => `• ${page}`).join('\n')}`,
        role: 'assistant',
        timestamp: new Date(),
        actions: result.success ? [] : [],
        suggestions: result.success ? navigationHandler.getNavigationSuggestions(pathname) : []
      };

      const finalMessages = [...updatedMessages, navigationResponse];
      setMessages(finalMessages);
      saveMessages(finalMessages);
      await saveConversation(finalMessages);
      setInput('');
      return;
    }

    // Try enhanced command parsing
    try {
      const enhancedCommand = await enhancedAICommandParser.parseEnhancedCommand(currentInput, context);

      if (enhancedCommand.confidence > 0.7 && enhancedCommand.response) {
        const commandResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: enhancedCommand.response,
          role: 'assistant',
          timestamp: new Date(),
          suggestions: enhancedCommand.suggestions || []
        };

        const finalMessages = [...updatedMessages, commandResponse];
        setMessages(finalMessages);
        saveMessages(finalMessages);
        await saveConversation(finalMessages);
        setInput('');
        return;
      }
    } catch (error) {
      console.error('Enhanced command parsing failed:', error);
    }

    setInput('');
    setIsLoading(true);

    try {
      const requestBody = {
        history: updatedMessages.map(msg => ({ role: msg.role, content: msg.content })),
        context: context,
      };
      console.log('DEBUG: Sending request body:', requestBody);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      const aiResponse = data.response;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        actions: [], // AI response from backend should not directly suggest actions
        suggestions: [] // AI response from backend should not directly suggest suggestions
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
      await saveConversation(finalMessages);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        role: 'assistant',
        timestamp: new Date()
      };
      const errorMessages = [...updatedMessages, errorMessage];
      setMessages(errorMessages);
      saveMessages(errorMessages);
      await saveConversation(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'start_practice_session': return <Play className="h-3 w-3" />;
      case 'create_note': return <FileText className="h-3 w-3" />;
      case 'create_event':
      case 'schedule_event': return <Calendar className="h-3 w-3" />;
      case 'navigate_to_page': return <ExternalLink className="h-3 w-3" />;
      case 'analyze_performance':
      case 'show_progress': return <BarChart3 className="h-3 w-3" />;
      case 'create_study_plan': return <Target className="h-3 w-3" />;
      case 'start_revision': return <RefreshCw className="h-3 w-3" />;
      case 'search_content': return <BookOpen className="h-3 w-3" />;
      case 'bookmark_article': return <BookOpen className="h-3 w-3" />;
      case 'set_reminder': return <Clock className="h-3 w-3" />;
      case 'generate_insights': return <Brain className="h-3 w-3" />;
      case 'analyze_news': return <TrendingUp className="h-3 w-3" />;
      case 'update_preferences': return <Settings className="h-3 w-3" />;
      case 'generate_notes_pdf':
      case 'generate_practice_report_pdf':
      case 'generate_current_affairs_pdf':
      case 'generate_study_plan_pdf': return <Download className="h-3 w-3" />;
      default: return <Sparkles className="h-3 w-3" />;
    }
  };

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'start_practice_session': return 'Start Practice';
      case 'create_note': return 'Create Note';
      case 'create_event':
      case 'schedule_event': return 'Schedule Event';
      case 'navigate_to_page': return 'Go to Page';
      case 'analyze_performance': return 'View Performance';
      case 'show_progress': return 'Show Progress';
      case 'create_study_plan': return 'Create Plan';
      case 'start_revision': return 'Start Revision';
      case 'search_content': return 'Search Content';
      case 'bookmark_article': return 'Bookmark';
      case 'set_reminder': return 'Set Reminder';
      case 'generate_insights': return 'Get Insights';
      case 'analyze_news': return 'Analyze News';
      case 'update_preferences': return 'Update Settings';
      case 'generate_notes_pdf': return 'Export Notes PDF';
      case 'generate_practice_report_pdf': return 'Export Practice Report';
      case 'generate_current_affairs_pdf': return 'Export News PDF';
      case 'generate_study_plan_pdf': return 'Export Study Plan';
      default: return 'Execute';
    }
  };

  const clearChat = () => {
    const defaultMessage = {
      id: '1',
      content: 'Hello! I\'m your advanced UPSC preparation assistant. I can help you with comprehensive study planning, performance analysis, content management, and much much more. How can I assist you today?',
      role: 'assistant' as const,
      timestamp: new Date(),
      suggestions: contextualSuggestions.length > 0 ? contextualSuggestions : [
        'Show my study progress',
        'Start a practice session',
        'Create a study plan',
        'Analyze current affairs',
        'Help with revision'
      ]
    };
    setMessages([defaultMessage]);
    saveMessages([defaultMessage]);
  };



  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Bot className="h-6 w-6 text-blue-600 mr-3" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              UPSC AI Assistant
            </h2>
            {context && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {capabilities.length} capabilities • {smartRecommendations.length} recommendations • {context.currentPage}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {/* Voice Controls */}
          <button
            onClick={isListening ? stopVoiceInput : startVoiceInput}
            className={`p-2 rounded-md transition-colors ${
              isListening
                ? 'text-red-600 bg-red-50 dark:bg-red-900/20 animate-pulse'
                : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          {/* Speech Controls */}
          <button
            onClick={isSpeaking ? stopSpeaking : () => {}}
            className={`p-2 rounded-md transition-colors ${
              isSpeaking
                ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            title={isSpeaking ? 'Stop speaking' : 'Text-to-speech'}
            disabled={!isSpeaking}
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* Quick Actions Toggle */}
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className={`p-2 rounded-md transition-colors ${
              showQuickActions
                ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
                : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
            }`}
            title="Toggle quick actions"
          >
            <Zap className="h-4 w-4" />
          </button>

          {/* Message Filter */}
          <button
            onClick={() => {
              const filters = ['all', 'actions', 'suggestions'] as const;
              const currentIndex = filters.indexOf(messageFilter);
              const nextFilter = filters[(currentIndex + 1) % filters.length];
              setMessageFilter(nextFilter);
            }}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors"
            title={`Filter: ${messageFilter}`}
          >
            <Filter className="h-4 w-4" />
          </button>

          {/* Expand/Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
            title={isExpanded ? 'Minimize chat' : 'Expand chat'}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          {/* Recommendations */}
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className={`p-2 rounded-md transition-colors ${
              showRecommendations
                ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                : 'text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
            }`}
            title="Show smart recommendations"
          >
            <Sparkles className="h-4 w-4" />
          </button>

          {/* Capabilities */}
          <button
            onClick={() => setShowCapabilities(!showCapabilities)}
            className={`p-2 rounded-md transition-colors ${
              showCapabilities
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }`}
            title="Show AI capabilities"
          >
            <Brain className="h-4 w-4" />
          </button>

          {/* Export Chat */}
          <button
            onClick={exportChat}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
            title="Export conversation"
          >
            <Download className="h-4 w-4" />
          </button>

          {/* Clear Chat */}
          <button
            onClick={clearChat}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Actions Panel */}
      {showQuickActions && (
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <Zap className="h-4 w-4 mr-2 text-purple-600" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { label: 'Open Calendar', action: 'open calendar', icon: Calendar, color: 'blue' },
                { label: 'Go to Practice', action: 'go to practice', icon: Target, color: 'green' },
                { label: 'Show Analytics', action: 'show analytics', icon: BarChart3, color: 'purple' },
                { label: 'Study Materials', action: 'open study materials', icon: BookOpen, color: 'orange' },
                { label: 'Current Affairs', action: 'show current affairs', icon: TrendingUp, color: 'teal' },
                { label: 'AI Assistant', action: 'go to ai assistant', icon: Bot, color: 'indigo' },
                { label: 'Dashboard', action: 'go to dashboard', icon: BarChart3, color: 'gray' },
                { label: 'Settings', action: 'open settings', icon: Settings, color: 'red' }
              ].map((quickAction, index) => (
                <button
                  key={index}
                  onClick={() => setInput(quickAction.action)}
                  className={`p-3 rounded-lg border border-${quickAction.color}-200 dark:border-${quickAction.color}-700 bg-white dark:bg-gray-800 hover:bg-${quickAction.color}-50 dark:hover:bg-${quickAction.color}-900/20 transition-colors group`}
                >
                  <quickAction.icon className={`h-4 w-4 text-${quickAction.color}-600 mx-auto mb-1`} />
                  <span className="text-xs text-gray-700 dark:text-gray-300 block text-center">
                    {quickAction.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Capabilities Panel */}
      {showCapabilities && capabilities.length > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              AI Capabilities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {capabilities.map((capability, index) => (
                <div
                  key={index}
                  className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {capability.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {capability.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {capability.examples.slice(0, 2).map((example: string, exIndex: number) => (
                      <button
                        key={exIndex}
                        onClick={() => setInput(example)}
                        className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Smart Recommendations Panel */}
      {showRecommendations && smartRecommendations.length > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-green-600" />
              Smart Recommendations
            </h3>
            <div className="space-y-3">
              {smartRecommendations.slice(0, 4).map((recommendation, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    recommendation.priority === 'high'
                      ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                      : recommendation.priority === 'medium'
                      ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-green-400 bg-green-50 dark:bg-green-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {recommendation.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {recommendation.description}
                      </p>
                      {recommendation.estimatedTime && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ⏱️ {recommendation.estimatedTime} min
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1 ml-3">
                      {recommendation.actions?.map((action: any, actionIndex: number) => (
                        <button
                          key={actionIndex}
                          onClick={() => executeAction(action)}
                          className="text-xs px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${isExpanded ? 'h-96' : ''}`}>
        {messages
          .filter(message => {
            if (messageFilter === 'actions') return message.actions && message.actions.length > 0;
            if (messageFilter === 'suggestions') return message.suggestions && message.suggestions.length > 0;
            return true;
          })
          .map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} group`}
          >
            <div className={`flex max-w-3xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                {/* Message Header with Controls */}
                <div className={`flex items-center justify-between mb-1 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Copy Button */}
                    <button
                      onClick={() => copyMessageContent(message.content)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                      title="Copy message"
                    >
                      <Copy className="h-3 w-3" />
                    </button>

                    {/* Collapse Button */}
                    <button
                      onClick={() => toggleMessageCollapse(message.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                      title={collapsedMessages.has(message.id) ? 'Expand message' : 'Collapse message'}
                    >
                      {collapsedMessages.has(message.id) ?
                        <ChevronDown className="h-3 w-3" /> :
                        <ChevronUp className="h-3 w-3" />
                      }
                    </button>

                    {/* Speak Button (for assistant messages) */}
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => speakMessage(message.content)}
                        className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded"
                        title="Read aloud"
                      >
                        <Volume2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {/* Message Metadata */}
                  {message.metadata && (
                    <div className="text-xs text-gray-400 flex items-center space-x-2">
                      {message.metadata.confidence && (
                        <span>Confidence: {Math.round(message.metadata.confidence * 100)}%</span>
                      )}
                      {message.metadata.processingTime && (
                        <span>⏱️ {message.metadata.processingTime}ms</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div className={`px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                } ${collapsedMessages.has(message.id) ? 'opacity-50' : ''}`}>
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}

                {/* Action Buttons */}
                {message.role === 'assistant' && message.actions && message.actions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => executeAction(action)}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
                      >
                        {getActionIcon(action.type)}
                        <span className="ml-1">{getActionLabel(action.type)}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggestion Chips */}
                {message.role === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(suggestion)}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Message Reactions */}
                {message.role === 'assistant' && (
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => reactToMessage(message.id, 'like')}
                        className="flex items-center space-x-1 text-xs text-gray-500 hover:text-green-600 transition-colors"
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>{message.reactions?.find(r => r.type === 'like')?.count || 0}</span>
                      </button>
                      <button
                        onClick={() => reactToMessage(message.id, 'dislike')}
                        className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <ThumbsDown className="h-3 w-3" />
                        <span>{message.reactions?.find(r => r.type === 'dislike')?.count || 0}</span>
                      </button>
                      <button
                        onClick={() => reactToMessage(message.id, 'helpful')}
                        className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Star className="h-3 w-3" />
                        <span>{message.reactions?.find(r => r.type === 'helpful')?.count || 0}</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                )}

                {message.role === 'user' && (
                  <p className="text-xs mt-1 text-blue-100">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex">
              <div className="mr-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </div>
              </div>
              <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                <Loader2 className="h-4 w-4 animate-spin text-gray-600 dark:text-gray-300" />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        {/* Contextual Suggestions Bar */}
        {contextualSuggestions.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {contextualSuggestions.slice(0, 4).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInput(suggestion)}
                  className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Controls */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={isListening ? "Listening..." : "Ask me anything about UPSC preparation..."}
              className={`w-full resize-none border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-12 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                isListening ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600' : ''
              }`}
              rows={input.split('\n').length > 2 ? 4 : 2}
              disabled={isLoading || isListening}
            />

            {/* Voice Input Button */}
            <button
              onClick={isListening ? stopVoiceInput : startVoiceInput}
              className={`absolute right-2 top-2 p-1 rounded transition-colors ${
                isListening
                  ? 'text-red-600 bg-red-100 dark:bg-red-900/30 animate-pulse'
                  : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30'
              }`}
              title={isListening ? 'Stop listening' : 'Voice input'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          </div>

          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading || isListening}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

        {/* Input Status */}
        {(isLoading || typingIndicator) && (
          <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>{isLoading ? 'AI is thinking...' : 'AI is typing...'}</span>
          </div>
        )}
      </div>
    </div>
  );
}