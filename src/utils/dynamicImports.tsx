/**
 * Dynamic Import Utilities for Code Splitting
 * Provides optimized dynamic imports for heavy components and libraries
 */

import React, { lazy } from 'react';

// Heavy component imports with error boundaries
export const createLazyComponent = (importFn: () => Promise<any>, fallback?: React.ComponentType) => {
  const LazyComponent = lazy(importFn);
  
  return (props: any) => (
    <React.Suspense
      fallback={fallback || <div className="animate-pulse bg-gray-200 h-32 rounded" />}
    >
      <LazyComponent {...props} />
    </React.Suspense>
  );
};

// AI Service dynamic imports
export const loadAIServices = {
  actionHandler: () => import('@/services/AIActionHandlerModular'),
  commandParser: () => import('@/services/AICommandParser'),
  navigationHandler: () => import('@/services/NavigationCommandHandler'),
  chatBot: () => import('@/components/ai/ChatBot'),
};

// Chart library dynamic imports
export const loadChartLibraries = {
  recharts: () => import('recharts'),
  chartjs: () => import('chart.js'),
  performanceCharts: () => import('@/components/charts/PerformanceCharts'),
};

// Form library dynamic imports
export const loadFormLibraries = {
  reactHookForm: () => import('react-hook-form'),
  formik: () => import('formik'),
  studyPlanForm: () => import('@/components/forms/StudyPlanForm'),
};

// Icon library dynamic imports with tree shaking
export const loadIcons = {
  lucideReact: (iconNames: string[]) => 
    Promise.all(iconNames.map(name => 
      import('lucide-react').then(module => ({ [name]: module[name] }))
    )),
  analyticsIcons: () => import('@/components/icons/AnalyticsIcons'),
  practiceIcons: () => import('@/components/icons/PracticeIcons'),
};

// Date utility dynamic imports
export const loadDateUtils = {
  dateFns: () => import('date-fns'),
  format: () => import('date-fns/format'),
  parseISO: () => import('date-fns/parseISO'),
  addDays: () => import('date-fns/addDays'),
};

// Content library dynamic imports
export const loadContentLibraries = {
  reactMarkdown: () => import('react-markdown'),
  remarkGfm: () => import('remark-gfm'),
  pdfViewer: () => import('@/components/pdf/PDFViewer'),
};

// Page component dynamic imports
export const loadPageComponents = {
  analytics: () => import('@/app/analytics/page'),
  practice: () => import('@/app/practice/page'),
  maps: () => import('@/app/maps/page'),
  dictionary: () => import('@/app/dictionary/page'),
  calendar: () => import('@/app/calendar/page'),
};

// Utility for preloading critical components
export const preloadCriticalComponents = () => {
  // Preload most commonly used components
  const criticalImports = [
    loadAIServices.navigationHandler,
    loadIcons.analyticsIcons,
    loadPageComponents.analytics,
  ];

  criticalImports.forEach(importFn => {
    // Preload after a short delay to avoid blocking initial render
    setTimeout(() => {
      importFn().catch(err => 
        console.warn('Failed to preload component:', err)
      );
    }, 1000);
  });
};

// Utility for conditional loading based on user interaction
export const loadOnInteraction = {
  onHover: (importFn: () => Promise<any>) => {
    let loaded = false;
    return () => {
      if (!loaded) {
        loaded = true;
        importFn().catch(err => 
          console.warn('Failed to load on hover:', err)
        );
      }
    };
  },

  onFocus: (importFn: () => Promise<any>) => {
    let loaded = false;
    return () => {
      if (!loaded) {
        loaded = true;
        importFn().catch(err => 
          console.warn('Failed to load on focus:', err)
        );
      }
    };
  },

  onVisible: (importFn: () => Promise<any>) => {
    let loaded = false;
    return (element: Element) => {
      if (!loaded && element) {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            loaded = true;
            importFn().catch(err => 
              console.warn('Failed to load on visible:', err)
            );
            observer.disconnect();
          }
        });
        observer.observe(element);
      }
    };
  },
};

// Bundle size tracking
export const trackBundleLoading = (componentName: string, startTime: number) => {
  const endTime = performance.now();
  const loadTime = endTime - startTime;
  
  console.log(`Component "${componentName}" loaded in ${loadTime.toFixed(2)}ms`);
  
  // Track in performance API if available
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(`${componentName}-loaded`);
    performance.measure(`${componentName}-load-time`, `${componentName}-start`, `${componentName}-loaded`);
  }
};

// Error boundary for dynamic imports
export const withDynamicImportErrorBoundary = (Component: React.ComponentType) => {
  return class DynamicImportErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error('Dynamic import error:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return (
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <h3 className="text-red-800 font-medium">Failed to load component</h3>
            <p className="text-red-600 text-sm mt-1">
              Please refresh the page or try again later.
            </p>
          </div>
        );
      }

      return <Component {...this.props} />;
    }
  };
};
