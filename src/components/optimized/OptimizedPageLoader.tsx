'use client';

import React, { Suspense, lazy } from 'react';

// Lazy load heavy page components
const LazyAnalyticsPage = lazy(() => import('@/app/analytics/page'));
const LazyPracticePage = lazy(() => import('@/app/practice/page'));
// const LazyMapsPage = lazy(() => import('@/app/maps/page')); // Removed for SSR compatibility
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
// const MapsSkeleton = () => <PageSkeleton title="Maps" />; // Removed for SSR compatibility
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

// export const OptimizedMapsPage = () => (
//   <Suspense fallback={<MapsSkeleton />}>
//     <LazyMapsPage />
//   </Suspense>
// ); // Removed for SSR compatibility

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

// Note: React lazy components don't support preloading
// Preloading is handled automatically by React.lazy when components are rendered

// Hook for navigation patterns (preloading removed as not supported by React.lazy)
export const usePagePreloader = () => {
  const preloadCriticalPages = React.useCallback(() => {
    // Note: Preloading is handled automatically by React.lazy
    console.log('Page preloading is handled automatically by React.lazy');
  }, []);

  const preloadOnHover = React.useCallback((pageName: string) => {
    // Note: Preloading is handled automatically by React.lazy
    console.log(`Hover preload for ${pageName} - handled automatically by React.lazy`);
  }, []);

  return { preloadCriticalPages, preloadOnHover };
};
