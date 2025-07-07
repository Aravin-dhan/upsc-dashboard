import { BookOpen, TrendingUp, Map, MessageSquare, Brain, Calendar } from 'lucide-react';

export default function FeatureShowcase() {
  const coreFeatures = [
    {
      icon: BookOpen,
      title: 'Practice Tests & Mock Series',
      description: 'Comprehensive question bank with 420+ parsed questions, previous year papers, and detailed solutions.',
      highlight: 'Primary Feature'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Advanced analytics to monitor your preparation with performance insights and weak area identification.',
      highlight: 'Core Feature'
    },
    {
      icon: MessageSquare,
      title: 'Current Affairs Hub',
      description: 'Daily curated current affairs with UPSC relevance scoring from trusted sources.',
      highlight: 'Essential Feature'
    },
    {
      icon: Map,
      title: 'Interactive Maps',
      description: 'Master geography with detailed interactive maps covering all UPSC-relevant locations.',
      highlight: 'Study Tool'
    },
    {
      icon: Calendar,
      title: 'Study Planning',
      description: 'Smart scheduling and goal tracking to optimize your preparation timeline.',
      highlight: 'Organization Tool'
    },
    {
      icon: Brain,
      title: 'AI Assistant',
      description: 'Get quick answers and navigation help - a helpful supplementary tool.',
      highlight: 'Support Feature'
    }
  ];

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Complete UPSC Preparation Platform
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need for UPSC success - from practice tests to progress tracking,
            with an AI assistant to help you navigate.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    feature.highlight === 'Primary Feature' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    feature.highlight === 'Core Feature' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    feature.highlight === 'Essential Feature' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                    feature.highlight === 'Support Feature' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                  }`}>
                    {feature.highlight}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
