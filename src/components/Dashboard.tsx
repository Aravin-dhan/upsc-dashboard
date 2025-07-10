'use client';

import { useState, lazy, Suspense } from 'react';
import { Settings, Sliders } from 'lucide-react';
import CommandCenter from './widgets/CommandCenter';
import LoadingSpinner from './LoadingSpinner';
import DashboardCustomizer from './dashboard/DashboardCustomizer';
import QuickSettings from './dashboard/QuickSettings';
import CustomizableDashboard from './dashboard/CustomizableDashboard';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { useDashboardCustomization } from '@/contexts/DashboardCustomizationContext';

// Import synchronized components
import TodaysSchedule from './dashboard/TodaysSchedule';
import PerformanceWidget from './dashboard/PerformanceWidget';

// Lazy load heavy components
const SyllabusTracker = lazy(() => import('./widgets/SyllabusTracker'));
const PerformanceAnalytics = lazy(() => import('./widgets/PerformanceAnalytics'));
const RevisionEngine = lazy(() => import('./widgets/RevisionEngine'));
const CurrentAffairsHub = lazy(() => import('./widgets/CurrentAffairsHub'));
const KnowledgeBase = lazy(() => import('./widgets/KnowledgeBase'));
const WellnessCorner = lazy(() => import('./widgets/WellnessCorner'));
const MotivationalPoster = lazy(() => import('./widgets/MotivationalPoster'));

export default function Dashboard() {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [useAdvancedCustomization, setUseAdvancedCustomization] = useState(false);
  const {
    layout,
    isLoading,
    saveLayout,
    getEnabledWidgets,
    getThemeClasses,
    getGridClasses
  } = useDashboardLayout();

  const { layout: customLayout, isLoading: customLoading } = useDashboardCustomization();

  // Component mapping for dynamic rendering
  const componentMap = {
    CommandCenter,
    TodaysSchedule,
    PerformanceWidget,
    SyllabusTracker,
    PerformanceAnalytics,
    RevisionEngine,
    CurrentAffairsHub,
    KnowledgeBase,
    WellnessCorner,
    MotivationalPoster
  };

  if (isLoading || customLoading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  const enabledWidgets = getEnabledWidgets();

  return (
    <div className={getThemeClasses()}>
      {/* Page Header - Mobile Optimized */}
      <div className="mb-4 lg:mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1 lg:mt-2">
            Welcome back! Here's your UPSC preparation overview.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setUseAdvancedCustomization(!useAdvancedCustomization)}
            className={`flex items-center space-x-2 px-3 py-2 transition-colors rounded-lg ${
              useAdvancedCustomization
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Toggle Advanced Customization"
          >
            <Settings className="h-5 w-5" />
            <span className="hidden sm:inline">
              {useAdvancedCustomization ? 'Exit Customize' : 'Customize'}
            </span>
          </button>
          <button
            onClick={() => setIsQuickSettingsOpen(true)}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Quick Settings"
          >
            <Sliders className="h-5 w-5" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* Conditional Dashboard Rendering */}
      {useAdvancedCustomization ? (
        <CustomizableDashboard>
          {/* Widget content will be rendered by CustomizableDashboard */}
          <div className="text-center py-8 text-gray-500">
            <Settings className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Advanced customization mode enabled</p>
            <p className="text-xs">Drag widgets to reorder, resize, or remove them</p>
          </div>
        </CustomizableDashboard>
      ) : (
        /* Standard Dashboard Grid */
        <div className={`grid ${getGridClasses()} gap-4 lg:gap-6`}>
          {enabledWidgets.map((widget) => {
            const Component = componentMap[widget.component as keyof typeof componentMap];

            if (!Component) {
              console.warn(`Component ${widget.component} not found for widget ${widget.id}`);
              return null;
            }

            const colSpanClass = `lg:col-span-${widget.size.width}`;
            const isLazyLoaded = !['CommandCenter', 'TodaysSchedule', 'PerformanceWidget'].includes(widget.component);

            return (
              <div
                key={widget.id}
                className={`${colSpanClass} order-${widget.order}`}
                style={{ order: widget.order }}
              >
                {isLazyLoaded ? (
                  <Suspense fallback={<LoadingSpinner text={`Loading ${widget.name.toLowerCase()}...`} />}>
                    <Component />
                  </Suspense>
                ) : (
                  <Component />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Dashboard Customizer Modal */}
      <DashboardCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onLayoutChange={saveLayout}
        currentLayout={layout}
      />

      {/* Quick Settings Modal */}
      <QuickSettings
        isOpen={isQuickSettingsOpen}
        onClose={() => setIsQuickSettingsOpen(false)}
      />
    </div>
  );
}
