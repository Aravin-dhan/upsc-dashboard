/**
 * Bundle Optimization Utilities
 * Provides tools for analyzing and optimizing bundle sizes
 */

// Heavy dependencies that should be code-split
export const HEAVY_DEPENDENCIES = {
  // Chart libraries
  'recharts': { size: '~400KB', usage: 'analytics', strategy: 'lazy-load' },
  'chart.js': { size: '~200KB', usage: 'analytics', strategy: 'lazy-load' },
  
  // Icon libraries
  'lucide-react': { size: '~150KB', usage: 'all-pages', strategy: 'tree-shake' },
  'react-icons': { size: '~300KB', usage: 'all-pages', strategy: 'tree-shake' },
  
  // Form libraries
  'react-hook-form': { size: '~50KB', usage: 'forms', strategy: 'lazy-load' },
  'formik': { size: '~80KB', usage: 'forms', strategy: 'lazy-load' },
  
  // Date libraries
  'date-fns': { size: '~200KB', usage: 'calendar', strategy: 'specific-imports' },
  'moment': { size: '~300KB', usage: 'calendar', strategy: 'replace-with-date-fns' },
  
  // Markdown libraries
  'react-markdown': { size: '~100KB', usage: 'content', strategy: 'lazy-load' },
  'remark-gfm': { size: '~50KB', usage: 'content', strategy: 'lazy-load' },
  
  // AI/ML libraries
  '@google/generative-ai': { size: '~150KB', usage: 'ai-features', strategy: 'lazy-load' },
  
  // Testing libraries (should be dev-only)
  'playwright': { size: '~50MB', usage: 'testing', strategy: 'dev-dependencies' },
  'puppeteer': { size: '~300MB', usage: 'testing', strategy: 'dev-dependencies' },
};

// Components that should be lazy-loaded
export const LAZY_LOAD_CANDIDATES = [
  // Heavy dashboard pages
  'AnalyticsPage',
  'PracticePage',
  'MapsPage',
  'CalendarPage',
  'DictionaryPage',
  
  // Chart components
  'ChartComponents',
  'PerformanceCharts',
  'ProgressCharts',
  
  // AI components
  'ChatBot',
  'AIAssistant',
  'AnswerAnalyzer',
  
  // Form components
  'StudyPlanForm',
  'ProfileForm',
  'SettingsForm',
  
  // Content components
  'PDFViewer',
  'MarkdownRenderer',
  'NewsReader',
];

// Code splitting strategies
export const CODE_SPLITTING_STRATEGIES = {
  // Route-based splitting (already implemented by Next.js)
  'route-based': {
    description: 'Automatic splitting by page routes',
    implementation: 'Next.js automatic',
    benefit: 'Reduces initial bundle size',
  },
  
  // Component-based splitting
  'component-based': {
    description: 'Lazy load heavy components',
    implementation: 'React.lazy() + Suspense',
    benefit: 'Loads components only when needed',
  },
  
  // Feature-based splitting
  'feature-based': {
    description: 'Split by feature modules',
    implementation: 'Dynamic imports',
    benefit: 'Modular loading based on user actions',
  },
  
  // Vendor splitting
  'vendor-splitting': {
    description: 'Separate vendor libraries',
    implementation: 'Webpack splitChunks',
    benefit: 'Better caching for third-party code',
  },
};

// Bundle analysis utilities
export const analyzeBundleSize = () => {
  if (typeof window === 'undefined') return null;
  
  const performanceEntries = performance.getEntriesByType('navigation');
  const navigationEntry = performanceEntries[0] as PerformanceNavigationTiming;
  
  return {
    loadTime: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
    domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
    firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
    firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
  };
};

// Preloading strategies
export const PRELOAD_STRATEGIES = {
  // Critical resources
  'critical': {
    resources: ['main.js', 'main.css', 'fonts'],
    timing: 'immediate',
    priority: 'high',
  },
  
  // Above-the-fold content
  'above-fold': {
    resources: ['hero-images', 'critical-components'],
    timing: 'immediate',
    priority: 'high',
  },
  
  // User-likely interactions
  'likely-interactions': {
    resources: ['analytics-page', 'practice-page'],
    timing: 'on-hover',
    priority: 'medium',
  },
  
  // Background preloading
  'background': {
    resources: ['secondary-pages', 'images'],
    timing: 'idle',
    priority: 'low',
  },
};

// Performance monitoring
export const trackBundlePerformance = () => {
  if (typeof window === 'undefined') return;
  
  // Track bundle loading times
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure') {
        console.log(`Bundle metric: ${entry.name} took ${entry.duration}ms`);
      }
    }
  });
  
  observer.observe({ entryTypes: ['measure'] });
  
  // Track resource loading
  const resourceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name.includes('.js') || entry.name.includes('.css')) {
        const resourceEntry = entry as PerformanceResourceTiming;
        console.log(`Resource: ${entry.name} loaded in ${resourceEntry.duration}ms`);
      }
    }
  });
  
  resourceObserver.observe({ entryTypes: ['resource'] });
};

// Optimization recommendations
export const getOptimizationRecommendations = () => {
  const analysis = analyzeBundleSize();
  const recommendations = [];
  
  if (analysis) {
    if (analysis.loadTime > 3000) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: 'Page load time exceeds 3 seconds. Consider aggressive code splitting.',
        actions: ['Implement lazy loading', 'Optimize images', 'Reduce bundle size'],
      });
    }
    
    if (analysis.firstContentfulPaint > 1500) {
      recommendations.push({
        type: 'performance',
        priority: 'medium',
        message: 'First Contentful Paint is slow. Optimize critical rendering path.',
        actions: ['Inline critical CSS', 'Preload key resources', 'Optimize fonts'],
      });
    }
  }
  
  return recommendations;
};
