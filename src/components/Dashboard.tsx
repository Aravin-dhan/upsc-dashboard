'use client';

import { useState, lazy, Suspense } from 'react';
import { Settings, Sliders, HelpCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import DashboardCustomizer from './dashboard/DashboardCustomizer';
import QuickSettings from './dashboard/QuickSettings';
import CustomizableDashboard from './dashboard/CustomizableDashboard';
import SimplifiedLayoutSystem, { SimplifiedWidget, SimplifiedLayout } from './dashboard/SimplifiedLayoutSystem';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { useDashboardCustomization } from '@/contexts/DashboardCustomizationContext';
import ErrorBoundary, { ComponentErrorBoundary } from './ErrorBoundary';
import toast from 'react-hot-toast';

// All components will be loaded as lazy components for consistency

// Enhanced lazy loading with comprehensive error handling and debugging
const createLazyComponent = (name: string, importPath: string) => {
  return lazy(() =>
    import(importPath)
      .then((module) => {
        console.log(`✅ Successfully loaded ${name}:`, module);
        if (!module.default) {
          console.error(`❌ ${name} has no default export`);
          throw new Error(`${name} has no default export`);
        }
        // Validate that the default export is a valid React component
        if (typeof module.default !== 'function' && typeof module.default !== 'object') {
          console.error(`❌ ${name} default export is not a valid React component:`, typeof module.default);
          throw new Error(`${name} default export is not a valid React component`);
        }
        return module;
      })
      .catch((error) => {
        console.error(`❌ Failed to load ${name}:`, error);
        // Create a proper React component function, not just an object
        const ErrorComponent = () => (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="text-red-600 dark:text-red-400 text-sm">
              <div className="font-medium">Failed to load {name}</div>
              <div className="text-xs mt-1">{error.message}</div>
            </div>
          </div>
        );
        // Ensure we return a proper module structure
        return { default: ErrorComponent };
      })
  );
};

// Load all components as lazy components for consistency
const CommandCenter = createLazyComponent('CommandCenter', './widgets/CommandCenter');
const TodaysSchedule = createLazyComponent('TodaysSchedule', './dashboard/TodaysSchedule');
const PerformanceWidget = createLazyComponent('PerformanceWidget', './dashboard/PerformanceWidget');
const SyllabusTracker = createLazyComponent('SyllabusTracker', './widgets/SyllabusTracker');
const PerformanceAnalytics = createLazyComponent('PerformanceAnalytics', './widgets/PerformanceAnalytics');
const RevisionEngine = createLazyComponent('RevisionEngine', './widgets/RevisionEngine');
const CurrentAffairsHub = createLazyComponent('CurrentAffairsHub', './widgets/CurrentAffairsHub');
const KnowledgeBase = createLazyComponent('KnowledgeBase', './widgets/KnowledgeBase');
const WellnessCorner = createLazyComponent('WellnessCorner', './widgets/WellnessCorner');
const MotivationalPoster = createLazyComponent('MotivationalPoster', './widgets/MotivationalPoster');
const PersonalizationInsights = createLazyComponent('PersonalizationInsights', './widgets/PersonalizationInsights');

export default function Dashboard() {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [useSimplifiedLayout, setUseSimplifiedLayout] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const {
    layout,
    isLoading,
    saveLayout,
    getEnabledWidgets,
    getThemeClasses,
    getGridClasses
  } = useDashboardLayout();

  const {
    layout: customLayout,
    isLoading: customLoading,
    updateWidget,
    moveWidget,
    toggleWidgetVisibility,
    resetLayout
  } = useDashboardCustomization();

  // Enhanced widget configuration with comprehensive validation
  const createSafeWidget = (id: string, name: string, component: any, size: 'small' | 'medium' | 'large', order: number): SimplifiedWidget | null => {
    // Basic validation to prevent React Error #130
    if (!component) {
      console.error(`❌ Component for widget ${id} is undefined or null`);
      return null;
    }

    // Accept both functions (regular components) and objects (lazy components)
    if (typeof component !== 'function' && typeof component !== 'object') {
      console.error(`❌ Component for widget ${id} is not a valid React component:`, typeof component, component);
      return null;
    }

    // Additional validation for objects to ensure they're valid React components
    if (typeof component === 'object') {
      // Check if it's a lazy component or has valid React symbols
      const hasValidReactType = component.$$typeof === Symbol.for('react.lazy') ||
                               component.$$typeof === Symbol.for('react.element') ||
                               component.$$typeof === Symbol.for('react.forward_ref') ||
                               component.$$typeof === Symbol.for('react.memo');

      if (!hasValidReactType) {
        console.error(`❌ Component for widget ${id} is an invalid object (missing React $$typeof):`, component);
        return null;
      }
    }

    // Log successful widget creation
    console.log(`✅ Created widget ${id}:`, typeof component, component.$$typeof || 'no $$typeof');

    return {
      id,
      name,
      component,
      size,
      visible: true,
      order
    };
  };

  // Create widgets with enhanced debugging
  const widgetConfigs = [
    { id: 'command-center', name: 'Command Center', component: CommandCenter, size: 'large' as const, order: 0 },
    { id: 'todays-schedule', name: "Today's Schedule", component: TodaysSchedule, size: 'medium' as const, order: 1 },
    { id: 'performance-widget', name: 'Performance Overview', component: PerformanceWidget, size: 'medium' as const, order: 2 },
    { id: 'syllabus-tracker', name: 'Syllabus Progress', component: SyllabusTracker, size: 'medium' as const, order: 3 },
    { id: 'performance-analytics', name: 'Performance Analytics', component: PerformanceAnalytics, size: 'large' as const, order: 4 },
    { id: 'revision-engine', name: 'Revision Engine', component: RevisionEngine, size: 'medium' as const, order: 5 },
    { id: 'current-affairs', name: 'Current Affairs', component: CurrentAffairsHub, size: 'medium' as const, order: 6 },
    { id: 'knowledge-base', name: 'Knowledge Base', component: KnowledgeBase, size: 'medium' as const, order: 7 },
    { id: 'wellness-corner', name: 'Wellness Corner', component: WellnessCorner, size: 'small' as const, order: 8 },
    { id: 'motivational-poster', name: 'Daily Motivation', component: MotivationalPoster, size: 'small' as const, order: 9 },
    { id: 'personalization-insights', name: 'AI Personalization', component: PersonalizationInsights, size: 'medium' as const, order: 10 }
  ];

  const simplifiedWidgets: SimplifiedWidget[] = widgetConfigs
    .map(config => {
      console.log(`🔧 Creating widget ${config.id}:`, config.component);
      return createSafeWidget(config.id, config.name, config.component, config.size, config.order);
    })
    .filter(Boolean) as SimplifiedWidget[];

  console.log(`📊 Dashboard widgets created: ${simplifiedWidgets.length}/${widgetConfigs.length}`);

  // Simplified layout change handler
  const handleLayoutChange = (newLayout: SimplifiedLayout) => {
    // Save the layout automatically
    toast.success('Layout updated!');
  };

  if (isLoading || customLoading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  const enabledWidgets = getEnabledWidgets();

  return (
    <ErrorBoundary>
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
            onClick={() => setShowHelpModal(true)}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Help"
          >
            <HelpCircle className="h-5 w-5" />
            <span className="hidden sm:inline">Help</span>
          </button>
          <button
            onClick={() => setIsQuickSettingsOpen(true)}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Settings"
          >
            <Sliders className="h-5 w-5" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* Simplified Dashboard Layout */}
      <ComponentErrorBoundary componentName="Dashboard Layout">
        <SimplifiedLayoutSystem
          widgets={simplifiedWidgets}
          onLayoutChange={handleLayoutChange}
        >
          {/* This children prop is not used in the current implementation */}
          <div />
        </SimplifiedLayoutSystem>
      </ComponentErrorBoundary>

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

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Dashboard Help
              </h2>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Layout Options</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Choose between 1, 2, or 3 column layouts</li>
                    <li>• Resize widgets to small, medium, or large</li>
                    <li>• Show or hide widgets as needed</li>
                    <li>• Reorder widgets by moving them up or down</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Customization</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Click "Customize" to modify widget settings</li>
                    <li>• Changes are saved automatically</li>
                    <li>• Use "Reset" to restore default layout</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Tour - Disabled for production stability */}
      {/* <OnboardingTour
        isEditMode={false}
        onClose={() => setShowOnboarding(false)}
      /> */}
      </div>
    </ErrorBoundary>
  );
}
