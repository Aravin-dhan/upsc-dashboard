/**
 * Performance Monitoring Utilities
 * Tracks build performance, bundle sizes, and optimization metrics
 */

interface PerformanceMetrics {
  buildTime: number;
  bundleSize: number;
  chunkCount: number;
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

interface BuildMetrics {
  compilationTime: number;
  moduleCount: number;
  chunkSizes: Record<string, number>;
  optimizationLevel: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private buildMetrics: BuildMetrics[] = [];

  // Track page load performance
  trackPageLoad(pageName: string): void {
    if (typeof window === 'undefined') return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    const metrics: PerformanceMetrics = {
      buildTime: 0, // Will be set by build process
      bundleSize: 0, // Will be calculated
      chunkCount: 0, // Will be calculated
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      largestContentfulPaint: 0, // Will be measured by LCP observer
      cumulativeLayoutShift: 0, // Will be measured by CLS observer
      firstInputDelay: 0, // Will be measured by FID observer
    };

    this.metrics.push(metrics);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance metrics for ${pageName}:`, {
        loadTime: `${metrics.loadTime.toFixed(2)}ms`,
        firstContentfulPaint: `${metrics.firstContentfulPaint.toFixed(2)}ms`,
      });
    }

  // Track build performance
  trackBuildMetrics(compilationTime: number, moduleCount: number): void {
    const buildMetric: BuildMetrics = {
      compilationTime,
      moduleCount,
      chunkSizes: {},
      optimizationLevel: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    };

    this.buildMetrics.push(buildMetric);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Build metrics:`, {
        compilationTime: `${compilationTime}ms`,
        moduleCount,
        optimizationLevel: buildMetric.optimizationLevel,
      });
    }
  }

  // Measure Core Web Vitals
  measureCoreWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (process.env.NODE_ENV === 'development') {
        console.log('LCP:', lastEntry.startTime);
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    new PerformanceObserver((entryList) => {
      let clsValue = 0;
      entryList.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      if (process.env.NODE_ENV === 'development') {
        console.log('CLS:', clsValue);
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Analyze bundle performance
  analyzeBundlePerformance(): void {
    if (typeof window === 'undefined') return;

    const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsResources = resourceEntries.filter(entry => 
      entry.name.includes('.js') && !entry.name.includes('hot-update')
    );

    const bundleAnalysis = {
      totalJSSize: jsResources.reduce((total, resource) => total + (resource.transferSize || 0), 0),
      chunkCount: jsResources.length,
      largestChunk: Math.max(...jsResources.map(r => r.transferSize || 0)),
      averageLoadTime: jsResources.reduce((total, resource) => total + resource.duration, 0) / jsResources.length,
    };

    console.log('Bundle Analysis:', {
      totalJSSize: `${(bundleAnalysis.totalJSSize / 1024).toFixed(2)} KB`,
      chunkCount: bundleAnalysis.chunkCount,
      largestChunk: `${(bundleAnalysis.largestChunk / 1024).toFixed(2)} KB`,
      averageLoadTime: `${bundleAnalysis.averageLoadTime.toFixed(2)}ms`,
    });
  }

  // Track optimization impact
  trackOptimizationImpact(before: PerformanceMetrics, after: PerformanceMetrics): void {
    const improvement = {
      loadTimeImprovement: ((before.loadTime - after.loadTime) / before.loadTime) * 100,
      fcpImprovement: ((before.firstContentfulPaint - after.firstContentfulPaint) / before.firstContentfulPaint) * 100,
    };

    console.log('Optimization Impact:', {
      loadTimeImprovement: `${improvement.loadTimeImprovement.toFixed(2)}%`,
      fcpImprovement: `${improvement.fcpImprovement.toFixed(2)}%`,
    });
  }

  // Get performance summary
  getPerformanceSummary(): {
    averageLoadTime: number;
    averageFCP: number;
    totalBuilds: number;
    averageCompilationTime: number;
  } {
    const avgLoadTime = this.metrics.reduce((sum, m) => sum + m.loadTime, 0) / this.metrics.length;
    const avgFCP = this.metrics.reduce((sum, m) => sum + m.firstContentfulPaint, 0) / this.metrics.length;
    const avgCompilation = this.buildMetrics.reduce((sum, m) => sum + m.compilationTime, 0) / this.buildMetrics.length;

    return {
      averageLoadTime: avgLoadTime || 0,
      averageFCP: avgFCP || 0,
      totalBuilds: this.buildMetrics.length,
      averageCompilationTime: avgCompilation || 0,
    };
  }

  // Check if performance targets are met
  checkPerformanceTargets(): {
    loadTimeTarget: boolean;
    fcpTarget: boolean;
    compilationTarget: boolean;
  } {
    const summary = this.getPerformanceSummary();
    
    return {
      loadTimeTarget: summary.averageLoadTime < 3000, // Sub-3-second target
      fcpTarget: summary.averageFCP < 1500, // Sub-1.5-second FCP target
      compilationTarget: summary.averageCompilationTime < 3000, // Sub-3-second compilation target
    };
  }

  // Export metrics for analysis
  exportMetrics(): string {
    return JSON.stringify({
      performanceMetrics: this.metrics,
      buildMetrics: this.buildMetrics,
      summary: this.getPerformanceSummary(),
      targets: this.checkPerformanceTargets(),
      timestamp: new Date().toISOString(),
    }, null, 2);
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-initialize performance monitoring
if (typeof window !== 'undefined') {
  // Start measuring Core Web Vitals
  performanceMonitor.measureCoreWebVitals();
  
  // Track page load performance
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.trackPageLoad(window.location.pathname);
      performanceMonitor.analyzeBundlePerformance();
    }, 100);
  });
}

// Utility functions for manual tracking
export const trackPagePerformance = (pageName: string) => {
  performanceMonitor.trackPageLoad(pageName);
};

export const trackBuildPerformance = (compilationTime: number, moduleCount: number) => {
  performanceMonitor.trackBuildMetrics(compilationTime, moduleCount);
};

export const getPerformanceSummary = () => {
  return performanceMonitor.getPerformanceSummary();
};

export const checkTargets = () => {
  return performanceMonitor.checkPerformanceTargets();
};

export default performanceMonitor;
