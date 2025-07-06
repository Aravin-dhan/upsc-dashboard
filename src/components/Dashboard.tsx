'use client';

import { useState, lazy, Suspense } from 'react';
import CommandCenter from './widgets/CommandCenter';
import LoadingSpinner from './LoadingSpinner';

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
  const [activeWidgets, setActiveWidgets] = useState([
    'command-center',
    'syllabus-tracker',
    'timetable',
    'performance-analytics'
  ]);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Page Header - Mobile Optimized */}
      <div className="mb-4 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1 lg:mt-2">
          Welcome back! Here's your UPSC preparation overview.
        </p>
      </div>

      {/* Main Dashboard Grid - Mobile First */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Command Center - Full width on mobile, 8 cols on desktop */}
          <div className="lg:col-span-8 order-1">
            <CommandCenter />
          </div>

          {/* Performance Widget - Priority on mobile, 4 cols on desktop */}
          <div className="lg:col-span-4 order-2">
            <PerformanceWidget />
          </div>

          {/* Today's Schedule - Full width on mobile, 8 cols on desktop */}
          <div className="lg:col-span-8 order-3">
            <TodaysSchedule />
          </div>

          {/* Syllabus Tracker - Lower priority on mobile, 4 cols on desktop */}
          <div className="lg:col-span-4 order-4">
            <Suspense fallback={<LoadingSpinner text="Loading syllabus..." />}>
              <SyllabusTracker />
            </Suspense>
          </div>

          {/* Detailed Performance Analytics - 8 cols */}
          <div className="lg:col-span-8">
            <Suspense fallback={<LoadingSpinner text="Loading analytics..." />}>
              <PerformanceAnalytics />
            </Suspense>
          </div>

          {/* Revision Engine - 4 cols */}
          <div className="lg:col-span-4">
            <Suspense fallback={<LoadingSpinner text="Loading revision..." />}>
              <RevisionEngine />
            </Suspense>
          </div>

          {/* Current Affairs Hub - 6 cols */}
          <div className="lg:col-span-6">
            <Suspense fallback={<LoadingSpinner text="Loading current affairs..." />}>
              <CurrentAffairsHub />
            </Suspense>
          </div>

          {/* Motivational Poster - 6 cols */}
          <div className="lg:col-span-6">
            <Suspense fallback={<LoadingSpinner text="Loading motivation..." />}>
              <MotivationalPoster />
            </Suspense>
          </div>

          {/* Knowledge Base - 6 cols */}
          <div className="lg:col-span-6">
            <Suspense fallback={<LoadingSpinner text="Loading knowledge base..." />}>
              <KnowledgeBase />
            </Suspense>
          </div>

          {/* Wellness Corner - Full width */}
          <div className="lg:col-span-12">
            <Suspense fallback={<LoadingSpinner text="Loading wellness..." />}>
              <WellnessCorner />
            </Suspense>
          </div>
        </div>
    </div>
  );
}
