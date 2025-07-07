'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, Send, Phone, Video, MoreVertical,
  Paperclip, Smile, Clock, CheckCheck, User,
  Minimize2, Maximize2, X, Bot, Users
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support' | 'bot';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to UPSC Dashboard support. How can I help you today?',
      sender: 'support',
      timestamp: new Date(Date.now() - 300000),
      status: 'read'
    },
    {
      id: '2',
      text: 'I can help you with account issues, technical problems, study guidance, or any questions about our platform.',
      sender: 'support',
      timestamp: new Date(Date.now() - 290000),
      status: 'read'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatMode, setChatMode] = useState<'support' | 'ai' | 'community'>('support');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate support response
    setTimeout(() => {
      setIsTyping(false);
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutoResponse(newMessage),
        sender: chatMode === 'ai' ? 'bot' : 'support',
        timestamp: new Date(),
        status: 'delivered'
      };
      setMessages(prev => [...prev, supportMessage]);
    }, 2000);
  };

  const getAutoResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('login') || lowerMessage.includes('password')) {
      return "I can help you with login issues. Please try resetting your password using the 'Forgot Password' link on the login page. If you continue to have problems, I can escalate this to our technical team.";
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('billing')) {
      return "For billing and payment related queries, I'll connect you with our billing specialist. They can help you with subscription issues, refunds, and payment methods.";
    } else if (lowerMessage.includes('study') || lowerMessage.includes('preparation')) {
      return "Great question about UPSC preparation! Our platform offers comprehensive study materials, AI-powered assistance, and practice tests. Would you like me to guide you through our key features?";
    } else {
      return "Thank you for your message. I understand your concern and I'm here to help. Could you please provide more details so I can assist you better?";
    }
  };

  const quickReplies = [
    'I need help with login',
    'How do I upgrade my plan?',
    'Technical issue',
    'Study guidance needed',
    'Billing question'
  ];

  const supportTeam = [
    { name: 'Priya Sharma', role: 'Study Mentor', status: 'online', avatar: '👩‍🏫' },
    { name: 'Rajesh Kumar', role: 'Technical Support', status: 'online', avatar: '👨‍💻' },
    { name: 'Sneha Patel', role: 'Billing Specialist', status: 'away', avatar: '👩‍💼' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-8 bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Live Chat Support
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get instant help from our support team, AI assistant, or connect with the community.
            </p>
          </div>
        </div>
      </section>

      {/* Chat Interface */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Chat Mode Selector */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Chat Options</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setChatMode('support')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      chatMode === 'support' 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Live Support</div>
                        <div className="text-sm text-gray-500">Chat with our team</div>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setChatMode('ai')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      chatMode === 'ai' 
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Bot className="h-5 w-5" />
                      <div>
                        <div className="font-medium">AI Assistant</div>
                        <div className="text-sm text-gray-500">Instant AI help</div>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setChatMode('community')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      chatMode === 'community' 
                        ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Community</div>
                        <div className="text-sm text-gray-500">Ask the community</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Support Team */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Support Team</h3>
                <div className="space-y-3">
                  {supportTeam.map((member, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="text-2xl">{member.avatar}</div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          member.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {member.name}
                        </div>
                        <div className="text-xs text-gray-500">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    📞 Request Phone Call
                  </button>
                  <button className="w-full text-left p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    📧 Send Email
                  </button>
                  <button className="w-full text-left p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    📋 Check FAQ
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-3">
              <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300 ${
                isMinimized ? 'h-16' : 'h-[600px]'
              }`}>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      {chatMode === 'support' && <MessageCircle className="h-5 w-5 text-green-600" />}
                      {chatMode === 'ai' && <Bot className="h-5 w-5 text-blue-600" />}
                      {chatMode === 'community' && <Users className="h-5 w-5 text-purple-600" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {chatMode === 'support' && 'Live Support Chat'}
                        {chatMode === 'ai' && 'AI Assistant'}
                        {chatMode === 'community' && 'Community Chat'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {chatMode === 'support' && 'Typically replies in a few minutes'}
                        {chatMode === 'ai' && 'Instant AI-powered responses'}
                        {chatMode === 'community' && 'Connect with fellow aspirants'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Video className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {isMinimized ? <Maximize2 className="h-5 w-5" /> : <Minimize2 className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {!isMinimized && (
                  <>
                    {/* Messages */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto h-[400px]">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-green-600 text-white'
                              : message.sender === 'bot'
                              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          }`}>
                            <p className="text-sm">{message.text}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs opacity-70">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {message.sender === 'user' && (
                                <CheckCheck className={`h-3 w-3 ${
                                  message.status === 'read' ? 'text-green-200' : 'text-gray-300'
                                }`} />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Replies */}
                    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-wrap gap-2">
                        {quickReplies.map((reply, index) => (
                          <button
                            key={index}
                            onClick={() => setNewMessage(reply)}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Paperclip className="h-5 w-5" />
                        </button>
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type your message..."
                            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                          />
                          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <Smile className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Why Choose Our Live Chat?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Instant Response
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Get immediate help from our AI assistant or connect with live support agents within minutes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Expert Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Our team includes UPSC mentors, technical experts, and study advisors ready to help.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                24/7 Availability
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                AI assistant available round the clock, with live agents during business hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
