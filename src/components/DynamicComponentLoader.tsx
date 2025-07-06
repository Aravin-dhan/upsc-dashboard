'use client';

import React, { Suspense, lazy, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

// Loading component
const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center p-8">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  </div>
);

// Error boundary for dynamic components
class DynamicComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dynamic component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <p className="text-red-600 dark:text-red-400">
            Failed to load component. Please refresh the page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Dynamic component definitions with lazy loading
const DynamicComponents = {
  // AI Components
  ChatBot: lazy(() => import('./ai/ChatBot')),
  AICapabilitiesTest: lazy(() => import('./test/AICapabilitiesTest')),
  ExternalAPITest: lazy(() => import('./test/ExternalAPITest')),

  // Dashboard Components (split by feature)
  Analytics: lazy(() => import('./analytics/Analytics')),
  Calendar: lazy(() => import('./calendar/Calendar')),
  Dictionary: lazy(() => import('./dictionary/Dictionary')),
  Maps: lazy(() => import('./maps/Maps')),
  News: lazy(() => import('./news/News')),
  Practice: lazy(() => import('./practice/Practice')),
  
  // Heavy components that can be loaded on demand
  PDFViewer: lazy(() => import('./pdf/PDFViewer')),
  ChartComponents: lazy(() => import('./charts/ChartComponents')),
  
  // Form components
  StudyPlanForm: lazy(() => import('./forms/StudyPlanForm')),
  ProgressTracker: lazy(() => import('./progress/ProgressTracker')),
} as const;

type ComponentName = keyof typeof DynamicComponents;

interface DynamicComponentLoaderProps {
  component: ComponentName;
  loadingMessage?: string;
  fallback?: React.ReactNode;
  props?: Record<string, any>;
}

/**
 * Dynamic Component Loader with code splitting
 */
const DynamicComponentLoader: React.FC<DynamicComponentLoaderProps> = ({
  component,
  loadingMessage,
  fallback,
  props = {},
}) => {
  const Component = DynamicComponents[component];

  if (!Component) {
    console.error(`Component "${component}" not found in DynamicComponents`);
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 dark:text-red-400">
          Component "{component}" not found
        </p>
      </div>
    );
  }

  return (
    <DynamicComponentErrorBoundary fallback={fallback}>
      <Suspense fallback={<LoadingSpinner message={loadingMessage} />}>
        <Component {...props} />
      </Suspense>
    </DynamicComponentErrorBoundary>
  );
};

/**
 * Hook for preloading components
 */
export const usePreloadComponent = () => {
  const preloadComponent = React.useCallback((componentName: ComponentName) => {
    const Component = DynamicComponents[componentName];
    if (Component) {
      // Trigger the dynamic import to preload the component
      Component.preload?.();
    }
  }, []);

  const preloadMultipleComponents = React.useCallback((componentNames: ComponentName[]) => {
    componentNames.forEach(preloadComponent);
  }, [preloadComponent]);

  return { preloadComponent, preloadMultipleComponents };
};

/**
 * Higher-order component for dynamic loading
 */
export const withDynamicLoading = <P extends object>(
  componentName: ComponentName,
  loadingMessage?: string
) => {
  return (props: P) => (
    <DynamicComponentLoader
      component={componentName}
      loadingMessage={loadingMessage}
      props={props}
    />
  );
};

/**
 * Preload critical components on app initialization
 */
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be used immediately
  const criticalComponents: ComponentName[] = [
    'ChatBot',
    'Analytics',
    'Calendar',
  ];

  criticalComponents.forEach(componentName => {
    const Component = DynamicComponents[componentName];
    if (Component && Component.preload) {
      Component.preload();
    }
  });
};

/**
 * Utility to check if a component is available
 */
export const isComponentAvailable = (componentName: string): componentName is ComponentName => {
  return componentName in DynamicComponents;
};

export default DynamicComponentLoader;
export { DynamicComponents, type ComponentName };
