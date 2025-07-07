'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout, WidgetConfig } from '@/components/dashboard/DashboardCustomizer';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'upsc-dashboard-layout';

const DEFAULT_LAYOUT: DashboardLayout = {
  widgets: [
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
  ],
  gridColumns: 12,
  compactMode: false,
  theme: 'default',
  lastUpdated: new Date().toISOString()
};

export function useDashboardLayout() {
  const [layout, setLayout] = useState<DashboardLayout>(DEFAULT_LAYOUT);
  const [isLoading, setIsLoading] = useState(true);

  // Load layout from localStorage on mount
  useEffect(() => {
    try {
      const savedLayout = localStorage.getItem(STORAGE_KEY);
      if (savedLayout) {
        const parsedLayout = JSON.parse(savedLayout);
        // Merge with default layout to ensure all required fields exist
        const mergedLayout = {
          ...DEFAULT_LAYOUT,
          ...parsedLayout,
          widgets: mergeWidgets(DEFAULT_LAYOUT.widgets, parsedLayout.widgets || [])
        };
        setLayout(mergedLayout);
      }
    } catch (error) {
      console.error('Error loading dashboard layout:', error);
      toast.error('Failed to load dashboard layout, using default');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Merge default widgets with saved widgets to handle new widgets
  const mergeWidgets = (defaultWidgets: WidgetConfig[], savedWidgets: WidgetConfig[]): WidgetConfig[] => {
    const savedWidgetMap = new Map(savedWidgets.map(w => [w.id, w]));
    
    return defaultWidgets.map(defaultWidget => {
      const savedWidget = savedWidgetMap.get(defaultWidget.id);
      return savedWidget ? { ...defaultWidget, ...savedWidget } : defaultWidget;
    });
  };

  // Save layout to localStorage
  const saveLayout = useCallback((newLayout: DashboardLayout) => {
    try {
      const layoutToSave = {
        ...newLayout,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layoutToSave));
      setLayout(layoutToSave);
      return true;
    } catch (error) {
      console.error('Error saving dashboard layout:', error);
      toast.error('Failed to save dashboard layout');
      return false;
    }
  }, []);

  // Update specific widget
  const updateWidget = useCallback((widgetId: string, updates: Partial<WidgetConfig>) => {
    setLayout(prevLayout => {
      const updatedWidgets = prevLayout.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, ...updates } : widget
      );
      const newLayout = { ...prevLayout, widgets: updatedWidgets };
      saveLayout(newLayout);
      return newLayout;
    });
  }, [saveLayout]);

  // Toggle widget visibility
  const toggleWidget = useCallback((widgetId: string) => {
    updateWidget(widgetId, { enabled: !layout.widgets.find(w => w.id === widgetId)?.enabled });
  }, [layout.widgets, updateWidget]);

  // Reorder widgets
  const reorderWidget = useCallback((widgetId: string, direction: 'up' | 'down') => {
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
    
    const newLayout = { ...layout, widgets };
    saveLayout(newLayout);
  }, [layout, saveLayout]);

  // Reset to default layout
  const resetLayout = useCallback(() => {
    const defaultLayout = {
      ...DEFAULT_LAYOUT,
      lastUpdated: new Date().toISOString()
    };
    saveLayout(defaultLayout);
    toast.success('Dashboard layout reset to default');
  }, [saveLayout]);

  // Get enabled widgets sorted by order
  const getEnabledWidgets = useCallback(() => {
    return layout.widgets
      .filter(widget => widget.enabled)
      .sort((a, b) => a.order - b.order);
  }, [layout.widgets]);

  // Get widget by ID
  const getWidget = useCallback((widgetId: string) => {
    return layout.widgets.find(widget => widget.id === widgetId);
  }, [layout.widgets]);

  // Update layout theme
  const updateTheme = useCallback((theme: 'default' | 'compact' | 'spacious') => {
    const newLayout = { ...layout, theme };
    saveLayout(newLayout);
  }, [layout, saveLayout]);

  // Update grid columns
  const updateGridColumns = useCallback((columns: number) => {
    const newLayout = { ...layout, gridColumns: Math.max(6, Math.min(12, columns)) };
    saveLayout(newLayout);
  }, [layout, saveLayout]);

  // Toggle compact mode
  const toggleCompactMode = useCallback(() => {
    const newLayout = { ...layout, compactMode: !layout.compactMode };
    saveLayout(newLayout);
  }, [layout, saveLayout]);

  // Get CSS classes based on theme
  const getThemeClasses = useCallback(() => {
    const baseClasses = 'grid gap-4 lg:gap-6';
    const themeClasses = {
      default: 'space-y-4 lg:space-y-6',
      compact: 'space-y-2 lg:space-y-3',
      spacious: 'space-y-6 lg:space-y-8'
    };
    
    const compactClasses = layout.compactMode ? 'gap-2 lg:gap-3' : 'gap-4 lg:gap-6';
    
    return `${baseClasses} ${themeClasses[layout.theme]} ${compactClasses}`;
  }, [layout.theme, layout.compactMode]);

  // Get grid column classes
  const getGridClasses = useCallback(() => {
    return `grid-cols-1 lg:grid-cols-${layout.gridColumns}`;
  }, [layout.gridColumns]);

  // Export layout for backup
  const exportLayout = useCallback(() => {
    try {
      const dataStr = JSON.stringify(layout, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `upsc-dashboard-layout-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast.success('Dashboard layout exported successfully');
    } catch (error) {
      console.error('Error exporting layout:', error);
      toast.error('Failed to export dashboard layout');
    }
  }, [layout]);

  // Import layout from file
  const importLayout = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedLayout = JSON.parse(e.target?.result as string);
        const mergedLayout = {
          ...DEFAULT_LAYOUT,
          ...importedLayout,
          widgets: mergeWidgets(DEFAULT_LAYOUT.widgets, importedLayout.widgets || [])
        };
        saveLayout(mergedLayout);
        toast.success('Dashboard layout imported successfully');
      } catch (error) {
        console.error('Error importing layout:', error);
        toast.error('Failed to import dashboard layout');
      }
    };
    reader.readAsText(file);
  }, [saveLayout]);

  return {
    layout,
    isLoading,
    saveLayout,
    updateWidget,
    toggleWidget,
    reorderWidget,
    resetLayout,
    getEnabledWidgets,
    getWidget,
    updateTheme,
    updateGridColumns,
    toggleCompactMode,
    getThemeClasses,
    getGridClasses,
    exportLayout,
    importLayout
  };
}
