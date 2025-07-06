'use client';

import React, { Suspense, lazy } from 'react';

// Lazy load heavy page components
const LazyAnalyticsPage = lazy(() => import('@/app/analytics/page'));
const LazyPracticePage = lazy(() => import('@/app/practice/page'));
const LazyMapsPage = lazy(() => import('@/app/maps/page'));
const LazyDictionaryPage = lazy(() => import('@/app/dictionary/page'));
const LazyCalendarPage = lazy(() => import('@/app/calendar/page'));

// Loading skeleton components
const PageSkeleton = ({ title }: { title: string }) => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
      </div>
      <div className="flex space-x-3">
        <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      ))}
    </div>
    
    <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
  </div>
);

const AnalyticsSkeleton = () => <PageSkeleton title="Analytics" />;
const PracticeSkeleton = () => <PageSkeleton title="Practice" />;
const MapsSkeleton = () => <PageSkeleton title="Maps" />;
const DictionarySkeleton = () => <PageSkeleton title="Dictionary" />;
const CalendarSkeleton = () => <PageSkeleton title="Calendar" />;

// Optimized page components with lazy loading
export const OptimizedAnalyticsPage = () => (
  <Suspense fallback={<AnalyticsSkeleton />}>
    <LazyAnalyticsPage />
  </Suspense>
);

export const OptimizedPracticePage = () => (
  <Suspense fallback={<PracticeSkeleton />}>
    <LazyPracticePage />
  </Suspense>
);

export const OptimizedMapsPage = () => (
  <Suspense fallback={<MapsSkeleton />}>
    <LazyMapsPage />
  </Suspense>
);

export const OptimizedDictionaryPage = () => (
  <Suspense fallback={<DictionarySkeleton />}>
    <LazyDictionaryPage />
  </Suspense>
);

export const OptimizedCalendarPage = () => (
  <Suspense fallback={<CalendarSkeleton />}>
    <LazyCalendarPage />
  </Suspense>
);

// Preload functions for critical pages
export const preloadAnalytics = () => {
  LazyAnalyticsPage.preload?.();
};

export const preloadPractice = () => {
  LazyPracticePage.preload?.();
};

export const preloadMaps = () => {
  LazyMapsPage.preload?.();
};

// Hook for preloading based on user navigation patterns
export const usePagePreloader = () => {
  const preloadCriticalPages = React.useCallback(() => {
    // Preload most commonly accessed pages
    setTimeout(() => {
      preloadAnalytics();
      preloadPractice();
    }, 1000); // Delay to avoid blocking initial render
  }, []);

  const preloadOnHover = React.useCallback((pageName: string) => {
    switch (pageName) {
      case 'analytics':
        preloadAnalytics();
        break;
      case 'practice':
        preloadPractice();
        break;
      case 'maps':
        preloadMaps();
        break;
    }
  }, []);

  return { preloadCriticalPages, preloadOnHover };
};
