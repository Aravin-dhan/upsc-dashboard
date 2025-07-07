'use client';

import React from 'react';
import { Crown, Lock, Zap, Users, ArrowRight, X } from 'lucide-react';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { PlanFeatures } from '@/lib/types/coupon';

interface FeatureRestrictionProps {
  feature: keyof PlanFeatures;
  requiredValue?: number | boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  customMessage?: string;
  className?: string;
}

export function FeatureRestriction({
  feature,
  requiredValue,
  children,
  fallback,
  showUpgradePrompt = true,
  customMessage,
  className = ''
}: FeatureRestrictionProps) {
  const { canAccess, subscription, isLoading, upgradeRequired } = useSubscription();

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  const hasAccess = canAccess(feature, requiredValue);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  return (
    <UpgradePrompt
      feature={feature}
      customMessage={customMessage}
      currentPlan={subscription?.planType || 'free'}
      className={className}
    />
  );
}

interface UpgradePromptProps {
  feature: keyof PlanFeatures;
  customMessage?: string;
  currentPlan: string;
  className?: string;
}

function UpgradePrompt({ feature, customMessage, currentPlan, className }: UpgradePromptProps) {
  const getFeatureDisplayName = (feature: keyof PlanFeatures): string => {
    const featureNames: Record<keyof PlanFeatures, string> = {
      aiQueriesPerDay: 'AI Assistant Queries',
      questionBankAccess: 'Question Bank Access',
      practiceTestsPerDay: 'Practice Tests',
      studyMaterialsAccess: 'Study Materials',
      progressAnalytics: 'Progress Analytics',
      customStudyPlans: 'Custom Study Plans',
      offlineAccess: 'Offline Access',
      prioritySupport: 'Priority Support',
      advancedAnalytics: 'Advanced Analytics',
      mockTestSeries: 'Mock Test Series',
      personalizedRecommendations: 'Personalized Recommendations',
      exportProgress: 'Export Progress',
      multiDeviceSync: 'Multi-Device Sync',
      communityAccess: 'Community Access',
      liveClasses: 'Live Classes',
      oneOnOneMentoring: 'One-on-One Mentoring'
    };
    return featureNames[feature] || feature.toString();
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'free':
        return <Users className="h-5 w-5" />;
      case 'trial':
        return <Zap className="h-5 w-5" />;
      case 'pro':
        return <Crown className="h-5 w-5" />;
      default:
        return <Lock className="h-5 w-5" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'trial':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'pro':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
            <Crown className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Upgrade Required
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {customMessage || `Access to ${getFeatureDisplayName(feature)} requires a Pro subscription.`}
          </p>

          <div className="flex items-center space-x-3 mb-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPlanColor(currentPlan)}`}>
              {getPlanIcon(currentPlan)}
              <span className="ml-1 capitalize">{currentPlan} Plan</span>
            </div>
            
            <ArrowRight className="h-4 w-4 text-gray-400" />
            
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border text-yellow-600 bg-yellow-100 border-yellow-200">
              <Crown className="h-4 w-4" />
              <span className="ml-1">Pro Plan</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.location.href = '/pricing'}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Pro
            </button>
            
            <button
              onClick={() => window.location.href = '/features'}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Usage tracking component for AI features
interface AIUsageIndicatorProps {
  className?: string;
}

export function AIUsageIndicator({ className }: AIUsageIndicatorProps) {
  const { subscription, planFeatures } = useSubscription();
  const [dailyUsage, setDailyUsage] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await fetch('/api/ai-assistant/usage');
        if (response.ok) {
          const data = await response.json();
          setDailyUsage(data.dailyUsage || 0);
        }
      } catch (error) {
        console.error('Failed to fetch AI usage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (subscription) {
      fetchUsage();
    } else {
      setIsLoading(false);
    }
  }, [subscription]);

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-32 ${className}`} />
    );
  }

  const maxQueries = planFeatures.aiQueriesPerDay || 0;
  const usagePercentage = maxQueries > 0 ? (dailyUsage / maxQueries) * 100 : 0;
  const isNearLimit = usagePercentage >= 80;
  const isAtLimit = dailyUsage >= maxQueries;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex-1">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>AI Queries Today</span>
          <span>{dailyUsage}/{maxQueries}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isAtLimit
                ? 'bg-red-500'
                : isNearLimit
                ? 'bg-yellow-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
      </div>
      
      {isAtLimit && (
        <button
          onClick={() => window.location.href = '/pricing'}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          Upgrade
        </button>
      )}
    </div>
  );
}
