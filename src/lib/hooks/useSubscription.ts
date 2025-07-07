'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserSubscription, PlanFeatures, DEFAULT_PLAN_FEATURES } from '@/lib/types/coupon';

interface SubscriptionHookReturn {
  subscription: UserSubscription | null;
  planFeatures: PlanFeatures;
  isLoading: boolean;
  error: string | null;
  hasFeature: (feature: keyof PlanFeatures) => boolean;
  canAccess: (feature: keyof PlanFeatures, requiredValue?: number | boolean) => boolean;
  refreshSubscription: () => Promise<void>;
  upgradeRequired: boolean;
}

export function useSubscription(): SubscriptionHookReturn {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [planFeatures, setPlanFeatures] = useState<PlanFeatures>(DEFAULT_PLAN_FEATURES.free);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    if (!isAuthenticated || !user) {
      setSubscription(null);
      setPlanFeatures(DEFAULT_PLAN_FEATURES.free);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/subscriptions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
        
        // Get plan features
        const featuresResponse = await fetch(`/api/subscriptions/features?plan=${data.subscription?.planType || 'free'}`);
        if (featuresResponse.ok) {
          const featuresData = await featuresResponse.json();
          setPlanFeatures(featuresData.features);
        } else {
          // Fallback to default features
          const planType = data.subscription?.planType || 'free';
          setPlanFeatures(DEFAULT_PLAN_FEATURES[planType as keyof typeof DEFAULT_PLAN_FEATURES] || DEFAULT_PLAN_FEATURES.free);
        }
      } else if (response.status === 404) {
        // No subscription found, user is on free plan
        setSubscription(null);
        setPlanFeatures(DEFAULT_PLAN_FEATURES.free);
      } else {
        throw new Error('Failed to fetch subscription');
      }
    } catch (err) {
      console.error('Subscription fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load subscription');
      // Fallback to free plan
      setSubscription(null);
      setPlanFeatures(DEFAULT_PLAN_FEATURES.free);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [isAuthenticated, user]);

  const hasFeature = (feature: keyof PlanFeatures): boolean => {
    const featureValue = planFeatures[feature];
    if (typeof featureValue === 'boolean') {
      return featureValue;
    }
    if (typeof featureValue === 'number') {
      return featureValue > 0;
    }
    return false;
  };

  const canAccess = (feature: keyof PlanFeatures, requiredValue?: number | boolean): boolean => {
    const featureValue = planFeatures[feature];
    
    if (requiredValue === undefined) {
      return hasFeature(feature);
    }

    if (typeof featureValue === 'boolean' && typeof requiredValue === 'boolean') {
      return featureValue === requiredValue;
    }

    if (typeof featureValue === 'number' && typeof requiredValue === 'number') {
      return featureValue >= requiredValue;
    }

    return false;
  };

  const upgradeRequired = subscription?.planType === 'free' || 
                         subscription?.planType === 'trial' ||
                         !subscription;

  return {
    subscription,
    planFeatures,
    isLoading,
    error,
    hasFeature,
    canAccess,
    refreshSubscription: fetchSubscription,
    upgradeRequired
  };
}

// Hook for checking specific feature access
export function useFeatureAccess(feature: keyof PlanFeatures, requiredValue?: number | boolean) {
  const { canAccess, isLoading, upgradeRequired } = useSubscription();
  
  return {
    hasAccess: canAccess(feature, requiredValue),
    isLoading,
    upgradeRequired
  };
}

// Hook for AI Assistant usage tracking
export function useAIUsage() {
  const { subscription, planFeatures, refreshSubscription } = useSubscription();
  const [dailyUsage, setDailyUsage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const checkUsage = async () => {
    if (!subscription) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/ai-assistant/usage');
      if (response.ok) {
        const data = await response.json();
        setDailyUsage(data.dailyUsage || 0);
      }
    } catch (error) {
      console.error('Failed to check AI usage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUsage();
  }, [subscription]);

  const canUseAI = dailyUsage < (planFeatures.aiQueriesPerDay || 0);
  const usagePercentage = planFeatures.aiQueriesPerDay ? 
    (dailyUsage / planFeatures.aiQueriesPerDay) * 100 : 0;

  return {
    dailyUsage,
    maxDailyUsage: planFeatures.aiQueriesPerDay || 0,
    canUseAI,
    usagePercentage,
    isLoading,
    refreshUsage: checkUsage
  };
}
