'use client';

import { useState } from 'react';
import { 
  Play, Pause, RotateCcw, Monitor, Smartphone, Tablet,
  Brain, Map, Calendar, TrendingUp, BookOpen, MessageSquare,
  ChevronRight, ExternalLink, Download, Share2
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState('ai-assistant');
  const [isPlaying, setIsPlaying] = useState(false);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const demos = [
    {
      id: 'ai-assistant',
      title: 'AI-Powered Study Assistant',
      description: 'Experience intelligent doubt resolution and personalized study guidance',
      icon: Brain,
      duration: '3:45',
      features: ['Natural language queries', 'UPSC-specific knowledge', 'Instant responses', 'Study recommendations'],
      videoUrl: '/demos/ai-assistant.mp4',
      thumbnail: '/images/demo-ai-assistant.jpg'
    },
    // {
    //   id: 'interactive-maps',
    //   title: 'Interactive Geography Maps',
    //   description: 'Explore detailed maps with educational content and current affairs integration',
    //   icon: Map,
    //   duration: '2:30',
    //   features: ['20+ locations', 'Historical significance', 'Current affairs', 'Visual learning'],
    //   videoUrl: '/demos/interactive-maps.mp4',
    //   thumbnail: '/images/demo-maps.jpg'
    // }, // Removed for SSR compatibility
    {
      id: 'smart-calendar',
      title: 'Smart Study Calendar',
      description: 'AI-optimized scheduling that adapts to your learning pace and goals',
      icon: Calendar,
      duration: '4:15',
      features: ['Adaptive scheduling', 'Goal tracking', 'Progress monitoring', 'Revision reminders'],
      videoUrl: '/demos/smart-calendar.mp4',
      thumbnail: '/images/demo-calendar.jpg'
    },
    {
      id: 'analytics',
      title: 'Performance Analytics',
      description: 'Comprehensive insights into your preparation with actionable recommendations',
      icon: TrendingUp,
      duration: '3:20',
      features: ['Subject-wise analysis', 'Weakness identification', 'Progress visualization', 'Improvement suggestions'],
      videoUrl: '/demos/analytics.mp4',
      thumbnail: '/images/demo-analytics.jpg'
    },
    {
      id: 'question-bank',
      title: 'Question Bank & Practice',
      description: 'Access 420+ parsed questions with detailed solutions and explanations',
      icon: BookOpen,
      duration: '5:10',
      features: ['Previous year questions', 'Detailed solutions', 'Topic categorization', 'Difficulty levels'],
      videoUrl: '/demos/question-bank.mp4',
      thumbnail: '/images/demo-questions.jpg'
    },
    {
      id: 'current-affairs',
      title: 'Current Affairs Hub',
      description: 'Stay updated with curated news and analysis relevant to UPSC preparation',
      icon: MessageSquare,
      duration: '2:45',
      features: ['Daily updates', 'UPSC relevance', 'Source verification', 'Topic filtering'],
      videoUrl: '/demos/current-affairs.mp4',
      thumbnail: '/images/demo-current-affairs.jpg'
    }
  ];

  const currentDemo = demos.find(demo => demo.id === activeDemo) || demos[0];

  const deviceSizes = {
    desktop: 'w-full max-w-4xl',
    tablet: 'w-full max-w-2xl',
    mobile: 'w-full max-w-sm'
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control video playback
  };

  const handleRestart = () => {
    setIsPlaying(false);
    // In a real implementation, this would restart the video
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            See It in
            <span className="text-blue-600 dark:text-blue-400"> Action</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Watch interactive demos of our key features and see how they can transform 
            your UPSC preparation experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Free Trial
              <ChevronRight className="ml-2 h-5 w-5" />
            </a>
            <a 
              href="/features" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              View All Features
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Demo Selection */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Choose a Feature to Demo
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Click on any feature below to see it in action
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {demos.map((demo) => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`p-6 rounded-lg text-left transition-all ${
                  activeDemo === demo.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700'
                    : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    activeDemo === demo.id ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                    <demo.icon className={`h-5 w-5 ${
                      activeDemo === demo.id ? 'text-white' : 'text-gray-600 dark:text-gray-300'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {demo.title}
                    </h3>
                    <span className="text-sm text-gray-500">{demo.duration}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {demo.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {demo.features.slice(0, 2).map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                  {demo.features.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{demo.features.length - 2} more
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Player */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {currentDemo.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {currentDemo.description}
            </p>
          </div>

          {/* Device View Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-1 flex space-x-1">
              <button
                onClick={() => setDeviceView('desktop')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  deviceView === 'desktop'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <Monitor className="h-4 w-4" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setDeviceView('tablet')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  deviceView === 'tablet'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <Tablet className="h-4 w-4" />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => setDeviceView('mobile')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  deviceView === 'mobile'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <Smartphone className="h-4 w-4" />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* Demo Player */}
          <div className="flex justify-center">
            <div className={`${deviceSizes[deviceView]} mx-auto`}>
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl overflow-hidden">
                {/* Video Player */}
                <div className="relative bg-gray-900 aspect-video">
                  {/* Placeholder for video */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <currentDemo.icon className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-white text-xl font-semibold mb-2">
                        {currentDemo.title} Demo
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">
                        Interactive demo coming soon!
                      </p>
                      <button
                        onClick={handlePlayPause}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        <span>{isPlaying ? 'Pause' : 'Play'} Demo</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="p-4 bg-white dark:bg-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handlePlayPause}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={handleRestart}
                        className="p-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Duration: {currentDemo.duration}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Feature List */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Key Features Demonstrated:
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {currentDemo.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Experience the Full Platform?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            These demos show just a glimpse of what's possible. Start your free trial to explore everything.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </a>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Schedule Live Demo
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
