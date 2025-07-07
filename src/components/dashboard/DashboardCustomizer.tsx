'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings, Grid, Eye, EyeOff, Move, Palette, Layout,
  Save, RotateCcw, Plus, Minus, ChevronDown, ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface WidgetConfig {
  id: string;
  name: string;
  component: string;
  enabled: boolean;
  position: { row: number; col: number };
  size: { width: number; height: number };
  order: number;
  customSettings?: Record<string, any>;
}

export interface DashboardLayout {
  widgets: WidgetConfig[];
  gridColumns: number;
  compactMode: boolean;
  theme: 'default' | 'compact' | 'spacious';
  lastUpdated: string;
}

interface DashboardCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onLayoutChange: (layout: DashboardLayout) => void;
  currentLayout: DashboardLayout;
}

const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: 'command-center',
    name: 'Command Center',
    component: 'CommandCenter',
    enabled: true,
    position: { row: 0, col: 0 },
    size: { width: 8, height: 1 },
    order: 1
  },
  {
    id: 'performance-widget',
    name: 'Performance Overview',
    component: 'PerformanceWidget',
    enabled: true,
    position: { row: 0, col: 8 },
    size: { width: 4, height: 1 },
    order: 2
  },
  {
    id: 'todays-schedule',
    name: "Today's Schedule",
    component: 'TodaysSchedule',
    enabled: true,
    position: { row: 1, col: 0 },
    size: { width: 8, height: 1 },
    order: 3
  },
  {
    id: 'syllabus-tracker',
    name: 'Syllabus Tracker',
    component: 'SyllabusTracker',
    enabled: true,
    position: { row: 1, col: 8 },
    size: { width: 4, height: 1 },
    order: 4
  },
  {
    id: 'performance-analytics',
    name: 'Performance Analytics',
    component: 'PerformanceAnalytics',
    enabled: true,
    position: { row: 2, col: 0 },
    size: { width: 8, height: 1 },
    order: 5
  },
  {
    id: 'revision-engine',
    name: 'Revision Engine',
    component: 'RevisionEngine',
    enabled: true,
    position: { row: 2, col: 8 },
    size: { width: 4, height: 1 },
    order: 6
  },
  {
    id: 'current-affairs',
    name: 'Current Affairs Hub',
    component: 'CurrentAffairsHub',
    enabled: true,
    position: { row: 3, col: 0 },
    size: { width: 6, height: 1 },
    order: 7
  },
  {
    id: 'motivational-poster',
    name: 'Motivational Corner',
    component: 'MotivationalPoster',
    enabled: true,
    position: { row: 3, col: 6 },
    size: { width: 6, height: 1 },
    order: 8
  },
  {
    id: 'knowledge-base',
    name: 'Knowledge Base',
    component: 'KnowledgeBase',
    enabled: false,
    position: { row: 4, col: 0 },
    size: { width: 6, height: 1 },
    order: 9
  },
  {
    id: 'wellness-corner',
    name: 'Wellness Corner',
    component: 'WellnessCorner',
    enabled: false,
    position: { row: 4, col: 6 },
    size: { width: 6, height: 1 },
    order: 10
  }
];

export default function DashboardCustomizer({
  isOpen,
  onClose,
  onLayoutChange,
  currentLayout
}: DashboardCustomizerProps) {
  const [layout, setLayout] = useState<DashboardLayout>(currentLayout);
  const [activeTab, setActiveTab] = useState<'widgets' | 'layout' | 'theme'>('widgets');

  useEffect(() => {
    setLayout(currentLayout);
  }, [currentLayout]);

  const handleWidgetToggle = (widgetId: string) => {
    const updatedWidgets = layout.widgets.map(widget =>
      widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget
    );
    setLayout({ ...layout, widgets: updatedWidgets });
  };

  const handleWidgetReorder = (widgetId: string, direction: 'up' | 'down') => {
    const widgets = [...layout.widgets];
    const currentIndex = widgets.findIndex(w => w.id === widgetId);
    
    if (direction === 'up' && currentIndex > 0) {
      [widgets[currentIndex], widgets[currentIndex - 1]] = [widgets[currentIndex - 1], widgets[currentIndex]];
    } else if (direction === 'down' && currentIndex < widgets.length - 1) {
      [widgets[currentIndex], widgets[currentIndex + 1]] = [widgets[currentIndex + 1], widgets[currentIndex]];
    }
    
    // Update order numbers
    widgets.forEach((widget, index) => {
      widget.order = index + 1;
    });
    
    setLayout({ ...layout, widgets });
  };

  const handleSizeChange = (widgetId: string, dimension: 'width' | 'height', change: number) => {
    const updatedWidgets = layout.widgets.map(widget => {
      if (widget.id === widgetId) {
        const newSize = { ...widget.size };
        newSize[dimension] = Math.max(1, Math.min(12, newSize[dimension] + change));
        return { ...widget, size: newSize };
      }
      return widget;
    });
    setLayout({ ...layout, widgets: updatedWidgets });
  };

  const handleThemeChange = (theme: 'default' | 'compact' | 'spacious') => {
    setLayout({ ...layout, theme });
  };

  const handleGridColumnsChange = (columns: number) => {
    setLayout({ ...layout, gridColumns: Math.max(6, Math.min(12, columns)) });
  };

  const handleSave = () => {
    const updatedLayout = {
      ...layout,
      lastUpdated: new Date().toISOString()
    };
    onLayoutChange(updatedLayout);
    toast.success('Dashboard layout saved successfully!');
    onClose();
  };

  const handleReset = () => {
    const defaultLayout: DashboardLayout = {
      widgets: DEFAULT_WIDGETS,
      gridColumns: 12,
      compactMode: false,
      theme: 'default',
      lastUpdated: new Date().toISOString()
    };
    setLayout(defaultLayout);
    toast.success('Dashboard layout reset to default');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Customize Dashboard
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4">
            {[
              { id: 'widgets', label: 'Widgets', icon: Grid },
              { id: 'layout', label: 'Layout', icon: Layout },
              { id: 'theme', label: 'Theme', icon: Palette }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'widgets' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Widget Configuration
              </h3>
              {layout.widgets.map((widget) => (
                <div
                  key={widget.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleWidgetToggle(widget.id)}
                        className={`p-1 rounded ${
                          widget.enabled
                            ? 'text-green-600 hover:text-green-700'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {widget.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {widget.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleWidgetReorder(widget.id, 'up')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        disabled={widget.order === 1}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleWidgetReorder(widget.id, 'down')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        disabled={widget.order === layout.widgets.length}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {widget.enabled && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 mb-1">Width</label>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSizeChange(widget.id, 'width', -1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center">{widget.size.width}</span>
                          <button
                            onClick={() => handleSizeChange(widget.id, 'width', 1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 mb-1">Order</label>
                        <span className="text-gray-900 dark:text-white">{widget.order}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Layout Settings
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Grid Columns
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="6"
                    max="12"
                    value={layout.gridColumns}
                    onChange={(e) => handleGridColumnsChange(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                    {layout.gridColumns}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Compact Mode
                </label>
                <button
                  onClick={() => setLayout({ ...layout, compactMode: !layout.compactMode })}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    layout.compactMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {layout.compactMode ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Dashboard Theme
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'default', name: 'Default', description: 'Standard spacing and layout' },
                  { id: 'compact', name: 'Compact', description: 'Reduced spacing for more content' },
                  { id: 'spacious', name: 'Spacious', description: 'Increased spacing for better readability' }
                ].map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id as any)}
                    className={`p-4 rounded-lg border-2 transition-colors text-left ${
                      layout.theme === theme.id
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{theme.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {theme.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset to Default</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
