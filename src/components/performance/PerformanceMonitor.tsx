'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Activity, Clock, Zap, Database } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  bundleSize: number;
  memoryUsage: number;
  fps: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
}

interface PerformanceMonitorProps {
  componentName?: string;
  showDetails?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export default function PerformanceMonitor({ 
  componentName = 'Component',
  showDetails = false,
  onMetricsUpdate 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    bundleSize: 0,
    memoryUsage: 0,
    fps: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(Date.now());

  // Measure performance metrics
  useEffect(() => {
    const measurePerformance = () => {
      const now = Date.now();
      const loadTime = now - startTimeRef.current;

      // Get Web Vitals if available
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
      const lcp = paint.find(entry => entry.name === 'largest-contentful-paint')?.startTime || 0;

      // Memory usage (if available)
      const memoryInfo = (performance as any).memory;
      const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / 1024 / 1024 : 0;

      // Bundle size estimation
      const bundleSize = navigation ? navigation.transferSize / 1024 : 0;

      const newMetrics: PerformanceMetrics = {
        loadTime,
        renderTime: now - startTimeRef.current,
        bundleSize,
        memoryUsage,
        fps: frameCountRef.current,
        firstContentfulPaint: fcp,
        largestContentfulPaint: lcp,
        cumulativeLayoutShift: 0 // Would need additional measurement
      };

      setMetrics(newMetrics);
      onMetricsUpdate?.(newMetrics);
    };

    // Measure FPS
    const measureFPS = () => {
      frameCountRef.current++;
      const now = Date.now();
      
      if (now - lastTimeRef.current >= 1000) {
        const fps = frameCountRef.current;
        frameCountRef.current = 0;
        lastTimeRef.current = now;
        
        setMetrics(prev => ({ ...prev, fps }));
      }
      
      requestAnimationFrame(measureFPS);
    };

    // Initial measurement
    measurePerformance();
    
    // Start FPS measurement
    requestAnimationFrame(measureFPS);

    // Periodic updates
    const interval = setInterval(measurePerformance, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [onMetricsUpdate]);

  // Performance status indicator
  const getPerformanceStatus = () => {
    if (metrics.loadTime < 1000) return { status: 'excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (metrics.loadTime < 3000) return { status: 'good', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'needs improvement', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const performanceStatus = getPerformanceStatus();

  if (!showDetails && process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999]">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${performanceStatus.bg} ${performanceStatus.color} hover:shadow-md`}
      >
        <Activity className="h-4 w-4 mr-2" />
        {metrics.loadTime}ms
      </button>

      {/* Detailed Metrics Panel */}
      {isVisible && (
        <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 min-w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Performance Monitor - {componentName}
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {/* Load Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Load Time</span>
              </div>
              <span className={`text-sm font-medium ${performanceStatus.color}`}>
                {metrics.loadTime.toFixed(0)}ms
              </span>
            </div>

            {/* FPS */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">FPS</span>
              </div>
              <span className={`text-sm font-medium ${
                metrics.fps >= 50 ? 'text-green-600' : 
                metrics.fps >= 30 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metrics.fps}
              </span>
            </div>

            {/* Memory Usage */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Database className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Memory</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {metrics.memoryUsage.toFixed(1)}MB
              </span>
            </div>

            {/* Bundle Size */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-4 w-4 text-orange-500 mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Bundle</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {metrics.bundleSize.toFixed(1)}KB
              </span>
            </div>

            {/* Web Vitals */}
            {metrics.firstContentfulPaint > 0 && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Web Vitals</div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">FCP</span>
                  <span className={`font-medium ${
                    metrics.firstContentfulPaint < 1800 ? 'text-green-600' : 
                    metrics.firstContentfulPaint < 3000 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {metrics.firstContentfulPaint.toFixed(0)}ms
                  </span>
                </div>

                {metrics.largestContentfulPaint > 0 && (
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-gray-600 dark:text-gray-400">LCP</span>
                    <span className={`font-medium ${
                      metrics.largestContentfulPaint < 2500 ? 'text-green-600' : 
                      metrics.largestContentfulPaint < 4000 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {metrics.largestContentfulPaint.toFixed(0)}ms
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Performance Score */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
                <span className={`text-sm font-medium capitalize ${performanceStatus.color}`}>
                  {performanceStatus.status}
                </span>
              </div>
              
              {/* Performance Tips */}
              {metrics.loadTime > 3000 && (
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs text-yellow-700 dark:text-yellow-300">
                  ⚠️ Load time exceeds 3s target. Consider optimizing bundle size or implementing lazy loading.
                </div>
              )}
              
              {metrics.fps < 30 && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-700 dark:text-red-300">
                  🐌 Low FPS detected. Check for performance bottlenecks in rendering.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleMetricsUpdate = (newMetrics: PerformanceMetrics) => {
    setMetrics(newMetrics);
  };

  return {
    metrics,
    isLoading,
    PerformanceMonitor: () => (
      <PerformanceMonitor
        componentName={componentName}
        showDetails={process.env.NODE_ENV === 'development'}
        onMetricsUpdate={handleMetricsUpdate}
      />
    )
  };
};
