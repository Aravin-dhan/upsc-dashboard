'use client';

import { useState, useEffect } from 'react';
import {
  Brain,
  TrendingUp,
  Lightbulb,
  Target,
  Clock,
  Layout,
  Zap,
  CheckCircle,
  X,
  RefreshCw,
  Settings,
  BarChart3,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardPersonalizationService, PersonalizationInsight, DashboardRecommendation } from '@/services/DashboardPersonalizationService';

export default function PersonalizationInsights() {
  const [insights, setInsights] = useState<PersonalizationInsight[]>([]);
  const [recommendations, setRecommendations] = useState<DashboardRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState<'insights' | 'recommendations' | 'patterns'>('insights');
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [personalizationService, setPersonalizationService] = useState<DashboardPersonalizationService | null>(null);

  // Initialize service safely
  useEffect(() => {
    try {
      const service = DashboardPersonalizationService.getInstance();
      setPersonalizationService(service);
    } catch (error) {
      console.error('Failed to initialize personalization service:', error);
      setError('Failed to load personalization features');
    }
  }, []);

  useEffect(() => {
    if (personalizationService) {
      loadPersonalizationData();

      // Listen for dashboard events to track behavior
      const handleDashboardEvent = (event: any) => {
        personalizationService.trackBehavior('dashboard-interaction', {
          type: event.type,
          timestamp: new Date().toISOString()
        });
      };

      window.addEventListener('click', handleDashboardEvent);
      window.addEventListener('dashboardRecommendationApplied', loadPersonalizationData);

      return () => {
        window.removeEventListener('click', handleDashboardEvent);
        window.removeEventListener('dashboardRecommendationApplied', loadPersonalizationData);
      };
    }
  }, [personalizationService]);

  const loadPersonalizationData = () => {
    if (!personalizationService) return;

    try {
      setInsights(personalizationService.getPersonalizationInsights());
      setRecommendations(personalizationService.getDashboardRecommendations());
      setError(null);
    } catch (error) {
      console.error('Failed to load personalization data:', error);
      setError('Failed to load personalization data');
    }
  };

  const refreshInsights = async () => {
    if (!personalizationService) return;

    setIsLoading(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    loadPersonalizationData();
    setIsLoading(false);
    toast.success('Insights refreshed!');
  };

  const applyRecommendation = (recommendationId: string) => {
    if (!personalizationService) return;

    try {
      const success = personalizationService.applyRecommendation(recommendationId);
      if (success) {
        toast.success('Recommendation applied!');
        loadPersonalizationData();
      } else {
        toast.error('Failed to apply recommendation');
      }
    } catch (error) {
      console.error('Failed to apply recommendation:', error);
      toast.error('Failed to apply recommendation');
    }
  };

  const dismissInsight = (insightId: string) => {
    if (!personalizationService) return;

    try {
      personalizationService.dismissInsight(insightId);
      loadPersonalizationData();
      toast.success('Insight dismissed');
    } catch (error) {
      console.error('Failed to dismiss insight:', error);
      toast.error('Failed to dismiss insight');
    }
  };

  const dismissRecommendation = (recommendationId: string) => {
    if (!personalizationService) return;

    try {
      personalizationService.dismissRecommendation(recommendationId);
      loadPersonalizationData();
      toast.success('Recommendation dismissed');
    } catch (error) {
      console.error('Failed to dismiss recommendation:', error);
      toast.error('Failed to dismiss recommendation');
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'layout': return <Layout className="h-4 w-4" />;
      case 'widget': return <Target className="h-4 w-4" />;
      case 'content': return <Lightbulb className="h-4 w-4" />;
      case 'timing': return <Clock className="h-4 w-4" />;
      case 'priority': return <TrendingUp className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'layout_change': return <Layout className="h-4 w-4" />;
      case 'widget_addition': return <Target className="h-4 w-4" />;
      case 'widget_removal': return <X className="h-4 w-4" />;
      case 'widget_resize': return <Settings className="h-4 w-4" />;
      case 'content_update': return <RefreshCw className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    return 'text-red-600 bg-red-100 dark:bg-red-900/20';
  };

  // Show error state if service failed to initialize
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Personalization Unavailable
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state if service is not yet initialized
  if (!personalizationService) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-blue-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">
              Loading personalization features...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Personalization</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Smart insights for your dashboard
            </p>
          </div>
        </div>
        <button
          onClick={refreshInsights}
          disabled={isLoading}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          title="Refresh insights"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {[
          { id: 'insights', label: 'Insights', count: insights.length },
          { id: 'recommendations', label: 'Tips', count: recommendations.length },
          { id: 'patterns', label: 'Patterns', count: personalizationService.getBehaviorPatterns().length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activeTab === 'insights' && (
          <>
            {insights.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No insights yet</p>
                <p className="text-xs">Use your dashboard more to get personalized insights!</p>
              </div>
            ) : (
              insights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {insight.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {insight.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getConfidenceColor(insight.confidence)}`}>
                            {Math.round(insight.confidence * 100)}% confident
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {insight.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => dismissInsight(insight.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Dismiss insight"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {showDetails === insight.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        <strong>Reasoning:</strong> {insight.reasoning}
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => setShowDetails(showDetails === insight.id ? null : insight.id)}
                    className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {showDetails === insight.id ? 'Hide details' : 'Show details'}
                  </button>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'recommendations' && (
          <>
            {recommendations.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No recommendations yet</p>
                <p className="text-xs">Keep using your dashboard to get smart suggestions!</p>
              </div>
            ) : (
              recommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        {getRecommendationIcon(recommendation.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {recommendation.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {recommendation.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(recommendation.impact)}`}>
                            {recommendation.impact} impact
                          </span>
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                            {recommendation.effort} effort
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => applyRecommendation(recommendation.id)}
                        className="p-1 text-green-600 hover:text-green-700 transition-colors"
                        title="Apply recommendation"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => dismissRecommendation(recommendation.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Dismiss recommendation"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    <strong>Why:</strong> {recommendation.reasoning}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'patterns' && (
          <>
            {personalizationService.getBehaviorPatterns().map((pattern, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {pattern.pattern.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {pattern.frequency} times • {Math.round(pattern.confidence * 100)}% confidence
                    </p>
                  </div>
                  <div className="text-right">
                    {pattern.timeOfDay !== undefined && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Usually at {pattern.timeOfDay}:00
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
