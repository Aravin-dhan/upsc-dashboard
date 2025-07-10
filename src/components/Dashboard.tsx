'use client';

import { useState, lazy, Suspense } from 'react';
import { Settings, Sliders, HelpCircle } from 'lucide-react';
import CommandCenter from './widgets/CommandCenter';
import LoadingSpinner from './LoadingSpinner';
import DashboardCustomizer from './dashboard/DashboardCustomizer';
import QuickSettings from './dashboard/QuickSettings';
import CustomizableDashboard from './dashboard/CustomizableDashboard';
import SimplifiedLayoutSystem, { SimplifiedWidget, SimplifiedLayout } from './dashboard/SimplifiedLayoutSystem';
import { OnboardingTour, HelpModal } from './dashboard/UserGuidance';
import { useCalendarSync } from '@/hooks/useCalendarSync';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { useDashboardCustomization } from '@/contexts/DashboardCustomizationContext';
import { useKeyboardShortcuts, useTouchGestures } from '@/hooks/useKeyboardShortcuts';
import toast from 'react-hot-toast';

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

  // Simplified widget configuration
  const simplifiedWidgets: SimplifiedWidget[] = [
    {
      id: 'command-center',
      name: 'Command Center',
      component: CommandCenter,
      size: 'large',
      visible: true,
      order: 0
    },
    {
      id: 'todays-schedule',
      name: "Today's Schedule",
      component: TodaysSchedule,
      size: 'medium',
      visible: true,
      order: 1
    },
    {
      id: 'performance-widget',
      name: 'Performance Overview',
      component: PerformanceWidget,
      size: 'medium',
      visible: true,
      order: 2
    },
    {
      id: 'syllabus-tracker',
      name: 'Syllabus Progress',
      component: SyllabusTracker,
      size: 'medium',
      visible: true,
      order: 3
    },
    {
      id: 'performance-analytics',
      name: 'Performance Analytics',
      component: PerformanceAnalytics,
      size: 'large',
      visible: true,
      order: 4
    },
    {
      id: 'revision-engine',
      name: 'Revision Engine',
      component: RevisionEngine,
      size: 'medium',
      visible: true,
      order: 5
    },
    {
      id: 'current-affairs',
      name: 'Current Affairs',
      component: CurrentAffairsHub,
      size: 'medium',
      visible: true,
      order: 6
    },
    {
      id: 'knowledge-base',
      name: 'Knowledge Base',
      component: KnowledgeBase,
      size: 'medium',
      visible: true,
      order: 7
    },
    {
      id: 'wellness-corner',
      name: 'Wellness Corner',
      component: WellnessCorner,
      size: 'small',
      visible: true,
      order: 8
    },
    {
      id: 'motivational-poster',
      name: 'Daily Motivation',
      component: MotivationalPoster,
      size: 'small',
      visible: true,
      order: 9
    }
  ];

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
      <SimplifiedLayoutSystem
        widgets={simplifiedWidgets}
        onLayoutChange={handleLayoutChange}
      >
        {/* This children prop is not used in the current implementation */}
        <div />
      </SimplifiedLayoutSystem>

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

      {/* Onboarding Tour */}
      <OnboardingTour
        isEditMode={false}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
}
