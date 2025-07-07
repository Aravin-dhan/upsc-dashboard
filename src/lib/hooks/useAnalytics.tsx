'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

interface AnalyticsConfig {
  trackPageViews?: boolean;
  trackUserEvents?: boolean;
  trackPerformance?: boolean;
  trackScrollDepth?: boolean;
}

interface TrackEventOptions {
  eventType: 'click' | 'scroll' | 'form_submit' | 'search' | 'download' | 'ai_query' | 'feature_use';
  eventData?: Record<string, any>;
  page?: string;
}

export function useAnalytics(config: AnalyticsConfig = {}) {
  const { user } = useAuth();
  const pathname = usePathname();
  const sessionIdRef = useRef<string | null>(null);
  const pageViewIdRef = useRef<string | null>(null);
  const pageStartTimeRef = useRef<number>(Date.now());
  const interactionsRef = useRef<number>(0);
  const maxScrollDepthRef = useRef<number>(0);

  const {
    trackPageViews = true,
    trackUserEvents = true,
    trackPerformance = true,
    trackScrollDepth = true
  } = config;

  // Initialize session
  useEffect(() => {
    if (!user || sessionIdRef.current) return;

    const initSession = async () => {
      try {
        const response = await fetch('/api/analytics/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            userAgent: navigator.userAgent,
            referrer: document.referrer
          })
        });

        if (response.ok) {
          const data = await response.json();
          sessionIdRef.current = data.sessionId;
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to initialize analytics session:', error);
        }
      }
    };

    initSession();

    // End session on page unload
    const handleBeforeUnload = () => {
      if (sessionIdRef.current) {
        navigator.sendBeacon('/api/analytics/session/end', JSON.stringify({
          sessionId: sessionIdRef.current,
          exitPage: pathname
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user, pathname]);

  // Track page views
  useEffect(() => {
    if (!trackPageViews || !user || !sessionIdRef.current) return;

    const trackPageView = async () => {
      // End previous page view if exists
      if (pageViewIdRef.current) {
        const timeOnPage = Math.floor((Date.now() - pageStartTimeRef.current) / 1000);
        await updatePageView({
          timeOnPage,
          interactions: interactionsRef.current,
          scrollDepth: maxScrollDepthRef.current
        });
      }

      // Start new page view
      pageStartTimeRef.current = Date.now();
      interactionsRef.current = 0;
      maxScrollDepthRef.current = 0;

      try {
        const loadTime = performance.getEntriesByType('navigation')[0]?.loadEventEnd || 0;
        
        const response = await fetch('/api/analytics/pageview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            userId: user.id,
            path: pathname,
            title: document.title,
            loadTime: Math.round(loadTime)
          })
        });

        if (response.ok) {
          const data = await response.json();
          pageViewIdRef.current = data.pageViewId;
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to track page view:', error);
        }
      }
    };

    trackPageView();
  }, [pathname, user, trackPageViews]);

  // Track scroll depth
  useEffect(() => {
    if (!trackScrollDepth) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = Math.round((scrollTop / documentHeight) * 100);
      
      if (scrollDepth > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = Math.min(scrollDepth, 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScrollDepth]);

  // Track user interactions
  useEffect(() => {
    if (!trackUserEvents) return;

    const handleClick = () => {
      interactionsRef.current += 1;
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [trackUserEvents]);

  const updatePageView = useCallback(async (updates: {
    timeOnPage?: number;
    interactions?: number;
    scrollDepth?: number;
  }) => {
    if (!pageViewIdRef.current) return;

    try {
      await fetch('/api/analytics/pageview/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageViewId: pageViewIdRef.current,
          ...updates
        })
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to update page view:', error);
      }
    }
  }, []);

  const trackEvent = useCallback(async (options: TrackEventOptions) => {
    if (!trackUserEvents || !user || !sessionIdRef.current) return;

    try {
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          sessionId: sessionIdRef.current,
          eventType: options.eventType,
          eventData: options.eventData || {},
          page: options.page || pathname
        })
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to track event:', error);
      }
    }
  }, [user, pathname, trackUserEvents]);

  const trackFeatureUse = useCallback((feature: string, additionalData?: Record<string, any>) => {
    trackEvent({
      eventType: 'feature_use',
      eventData: {
        feature,
        ...additionalData
      }
    });
  }, [trackEvent]);

  const trackAIQuery = useCallback((query: string, response?: string, responseTime?: number) => {
    trackEvent({
      eventType: 'ai_query',
      eventData: {
        query,
        response,
        responseTime,
        timestamp: new Date().toISOString()
      }
    });
  }, [trackEvent]);

  const trackSearch = useCallback((searchTerm: string, resultsCount?: number, filters?: Record<string, any>) => {
    trackEvent({
      eventType: 'search',
      eventData: {
        searchTerm,
        resultsCount,
        filters,
        timestamp: new Date().toISOString()
      }
    });
  }, [trackEvent]);

  const trackFormSubmit = useCallback((formName: string, formData?: Record<string, any>, success?: boolean) => {
    trackEvent({
      eventType: 'form_submit',
      eventData: {
        formName,
        formData,
        success,
        timestamp: new Date().toISOString()
      }
    });
  }, [trackEvent]);

  const trackDownload = useCallback((fileName: string, fileType?: string, fileSize?: number) => {
    trackEvent({
      eventType: 'download',
      eventData: {
        fileName,
        fileType,
        fileSize,
        timestamp: new Date().toISOString()
      }
    });
  }, [trackEvent]);

  // Performance tracking
  useEffect(() => {
    if (!trackPerformance) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          trackEvent({
            eventType: 'feature_use',
            eventData: {
              feature: 'performance_metric',
              metric: 'lcp',
              value: entry.startTime,
              page: pathname
            }
          });
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      // Performance Observer not supported
    }

    return () => observer.disconnect();
  }, [trackPerformance, trackEvent, pathname]);

  return {
    trackEvent,
    trackFeatureUse,
    trackAIQuery,
    trackSearch,
    trackFormSubmit,
    trackDownload,
    sessionId: sessionIdRef.current,
    pageViewId: pageViewIdRef.current
  };
}

// Higher-order component for automatic analytics tracking
export function withAnalytics<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  config?: AnalyticsConfig
) {
  return function AnalyticsWrapper(props: T) {
    useAnalytics(config);
    return <Component {...props} />;
  };
}
