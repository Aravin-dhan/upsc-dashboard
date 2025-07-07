'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useAnalytics } from '@/lib/hooks/useAnalytics';

interface AnalyticsContextType {
  trackEvent: (options: {
    eventType: 'click' | 'scroll' | 'form_submit' | 'search' | 'download' | 'ai_query' | 'feature_use';
    eventData?: Record<string, any>;
    page?: string;
  }) => void;
  trackFeatureUse: (feature: string, additionalData?: Record<string, any>) => void;
  trackAIQuery: (query: string, response?: string, responseTime?: number) => void;
  trackSearch: (searchTerm: string, resultsCount?: number, filters?: Record<string, any>) => void;
  trackFormSubmit: (formName: string, formData?: Record<string, any>, success?: boolean) => void;
  trackDownload: (fileName: string, fileType?: string, fileSize?: number) => void;
  sessionId: string | null;
  pageViewId: string | null;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  const {
    trackEvent,
    trackFeatureUse,
    trackAIQuery,
    trackSearch,
    trackFormSubmit,
    trackDownload,
    sessionId,
    pageViewId
  } = useAnalytics({
    trackPageViews: true,
    trackUserEvents: true,
    trackPerformance: true,
    trackScrollDepth: true
  });

  const value: AnalyticsContextType = {
    trackEvent,
    trackFeatureUse,
    trackAIQuery,
    trackSearch,
    trackFormSubmit,
    trackDownload,
    sessionId,
    pageViewId
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
}

// Higher-order component to automatically track feature usage
export function withFeatureTracking<T extends object>(
  Component: React.ComponentType<T>,
  featureName: string,
  additionalData?: Record<string, any>
) {
  return function FeatureTrackingWrapper(props: T) {
    const { trackFeatureUse } = useAnalyticsContext();
    
    useEffect(() => {
      trackFeatureUse(featureName, additionalData);
    }, [trackFeatureUse]);
    
    return <Component {...props} />;
  };
}

// Hook for tracking AI interactions
export function useAITracking() {
  const { trackAIQuery, trackFeatureUse } = useAnalyticsContext();
  
  const trackAIInteraction = (
    type: 'query' | 'response' | 'error',
    data: {
      query?: string;
      response?: string;
      responseTime?: number;
      error?: string;
      feature?: string;
    }
  ) => {
    if (type === 'query' && data.query) {
      trackAIQuery(data.query, data.response, data.responseTime);
    }
    
    trackFeatureUse('ai_assistant', {
      interactionType: type,
      ...data
    });
  };
  
  return { trackAIInteraction };
}

// Hook for tracking form interactions
export function useFormTracking() {
  const { trackFormSubmit, trackEvent } = useAnalyticsContext();
  
  const trackFormInteraction = (
    formName: string,
    action: 'start' | 'submit' | 'error' | 'abandon',
    data?: {
      formData?: Record<string, any>;
      success?: boolean;
      error?: string;
      timeSpent?: number;
    }
  ) => {
    if (action === 'submit') {
      trackFormSubmit(formName, data?.formData, data?.success);
    } else {
      trackEvent({
        eventType: 'form_submit',
        eventData: {
          formName,
          action,
          ...data
        }
      });
    }
  };
  
  return { trackFormInteraction };
}

// Hook for tracking search interactions
export function useSearchTracking() {
  const { trackSearch, trackEvent } = useAnalyticsContext();
  
  const trackSearchInteraction = (
    searchTerm: string,
    action: 'search' | 'filter' | 'sort' | 'result_click',
    data?: {
      resultsCount?: number;
      filters?: Record<string, any>;
      resultPosition?: number;
      resultId?: string;
    }
  ) => {
    if (action === 'search') {
      trackSearch(searchTerm, data?.resultsCount, data?.filters);
    } else {
      trackEvent({
        eventType: 'search',
        eventData: {
          searchTerm,
          action,
          ...data
        }
      });
    }
  };
  
  return { trackSearchInteraction };
}

// Hook for tracking navigation
export function useNavigationTracking() {
  const { trackEvent } = useAnalyticsContext();
  
  const trackNavigation = (
    destination: string,
    source: string,
    method: 'click' | 'keyboard' | 'programmatic' = 'click'
  ) => {
    trackEvent({
      eventType: 'click',
      eventData: {
        action: 'navigation',
        destination,
        source,
        method,
        timestamp: new Date().toISOString()
      }
    });
  };
  
  return { trackNavigation };
}

// Hook for tracking performance metrics
export function usePerformanceTracking() {
  const { trackEvent } = useAnalyticsContext();
  
  const trackPerformanceMetric = (
    metric: 'load_time' | 'interaction_time' | 'error' | 'success',
    value: number,
    context?: Record<string, any>
  ) => {
    trackEvent({
      eventType: 'feature_use',
      eventData: {
        feature: 'performance_tracking',
        metric,
        value,
        context,
        timestamp: new Date().toISOString()
      }
    });
  };
  
  return { trackPerformanceMetric };
}
