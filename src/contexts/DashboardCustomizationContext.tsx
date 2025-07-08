'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  size: 'small' | 'medium' | 'large';
  visible: boolean;
  position: number;
  column?: number;
}

export interface DashboardLayout {
  columns: 1 | 2 | 3;
  widgets: DashboardWidget[];
}

interface DashboardCustomizationContextType {
  layout: DashboardLayout;
  updateLayout: (layout: DashboardLayout) => void;
  updateWidget: (widgetId: string, updates: Partial<DashboardWidget>) => void;
  toggleWidgetVisibility: (widgetId: string) => void;
  reorderWidgets: (widgets: DashboardWidget[]) => void;
  resetToDefault: () => void;
  isLoading: boolean;
}

const DashboardCustomizationContext = createContext<DashboardCustomizationContextType | undefined>(undefined);

const defaultWidgets: DashboardWidget[] = [
  {
    id: 'progress-overview',
    type: 'progress',
    title: 'Progress Overview',
    size: 'large',
    visible: true,
    position: 0,
    column: 0
  },
  {
    id: 'current-affairs',
    type: 'current-affairs',
    title: 'Current Affairs',
    size: 'medium',
    visible: true,
    position: 1,
    column: 0
  },
  {
    id: 'study-schedule',
    type: 'schedule',
    title: 'Study Schedule',
    size: 'medium',
    visible: true,
    position: 2,
    column: 1
  },
  {
    id: 'analytics',
    type: 'analytics',
    title: 'Performance Analytics',
    size: 'medium',
    visible: true,
    position: 3,
    column: 1
  },
  {
    id: 'quick-actions',
    type: 'quick-actions',
    title: 'Quick Actions',
    size: 'small',
    visible: true,
    position: 4,
    column: 2
  },
  {
    id: 'bookmarks',
    type: 'bookmarks',
    title: 'Recent Bookmarks',
    size: 'small',
    visible: true,
    position: 5,
    column: 2
  },
  {
    id: 'ai-assistant',
    type: 'ai-assistant',
    title: 'AI Assistant',
    size: 'medium',
    visible: true,
    position: 6,
    column: 0
  },
  {
    id: 'practice-tests',
    type: 'practice-tests',
    title: 'Practice Tests',
    size: 'small',
    visible: true,
    position: 7,
    column: 2
  }
];

const defaultLayout: DashboardLayout = {
  columns: 3,
  widgets: defaultWidgets
};

export function DashboardCustomizationProvider({ children }: { children: React.ReactNode }) {
  const [layout, setLayout] = useState<DashboardLayout>(defaultLayout);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load user preferences from database
  useEffect(() => {
    if (user) {
      loadUserPreferences();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    try {
      const response = await fetch('/api/user/preferences', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.preferences?.dashboardLayout) {
          setLayout(data.preferences.dashboardLayout);
        }
      } else {
        console.error('Failed to load user preferences:', response.status);
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save preferences to database
  const saveLayout = async (newLayout: DashboardLayout) => {
    if (user) {
      try {
        const response = await fetch('/api/user/preferences/dashboard', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ dashboardLayout: newLayout })
        });

        if (!response.ok) {
          console.error('Failed to save dashboard layout:', response.status);
          // Fallback to localStorage if API fails
          localStorage.setItem(`dashboard-layout-${user.id}`, JSON.stringify(newLayout));
        }
      } catch (error) {
        console.error('Error saving dashboard layout:', error);
        // Fallback to localStorage if API fails
        localStorage.setItem(`dashboard-layout-${user.id}`, JSON.stringify(newLayout));
      }
    }
  };

  const updateLayout = (newLayout: DashboardLayout) => {
    setLayout(newLayout);
    saveLayout(newLayout);
  };

  const updateWidget = (widgetId: string, updates: Partial<DashboardWidget>) => {
    const newLayout = {
      ...layout,
      widgets: layout.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, ...updates } : widget
      )
    };
    updateLayout(newLayout);
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    const widget = layout.widgets.find(w => w.id === widgetId);
    if (widget) {
      updateWidget(widgetId, { visible: !widget.visible });
    }
  };

  const reorderWidgets = (widgets: DashboardWidget[]) => {
    const newLayout = {
      ...layout,
      widgets: widgets.map((widget, index) => ({ ...widget, position: index }))
    };
    updateLayout(newLayout);
  };

  const resetToDefault = () => {
    updateLayout(defaultLayout);
  };

  const value = {
    layout,
    updateLayout,
    updateWidget,
    toggleWidgetVisibility,
    reorderWidgets,
    resetToDefault,
    isLoading
  };

  return (
    <DashboardCustomizationContext.Provider value={value}>
      {children}
    </DashboardCustomizationContext.Provider>
  );
}

export function useDashboardCustomization() {
  const context = useContext(DashboardCustomizationContext);
  if (context === undefined) {
    throw new Error('useDashboardCustomization must be used within a DashboardCustomizationProvider');
  }
  return context;
}
