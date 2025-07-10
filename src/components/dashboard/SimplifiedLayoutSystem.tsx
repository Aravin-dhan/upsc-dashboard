'use client';

import React, { useState, useEffect } from 'react';
import { 
  Grid3X3, 
  Columns2, 
  Columns3, 
  Maximize2, 
  Minimize2, 
  Square,
  RotateCcw,
  Save,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';

export type LayoutPreset = '1-column' | '2-column' | '3-column';
export type WidgetSize = 'small' | 'medium' | 'large';

export interface SimplifiedWidget {
  id: string;
  name: string;
  component: React.ComponentType<any>;
  size: WidgetSize;
  visible: boolean;
  order: number;
}

export interface SimplifiedLayout {
  preset: LayoutPreset;
  widgets: SimplifiedWidget[];
  customizations: {
    [widgetId: string]: {
      size: WidgetSize;
      visible: boolean;
      order: number;
    };
  };
}

interface SimplifiedLayoutSystemProps {
  widgets: SimplifiedWidget[];
  onLayoutChange: (layout: SimplifiedLayout) => void;
  children: React.ReactNode;
}

const LAYOUT_PRESETS = {
  '1-column': {
    name: '1 Column',
    icon: <Columns2 className="h-4 w-4 rotate-90" />,
    description: 'Single column layout - perfect for mobile',
    gridClass: 'grid-cols-1'
  },
  '2-column': {
    name: '2 Columns',
    icon: <Columns2 className="h-4 w-4" />,
    description: 'Two column layout - balanced view',
    gridClass: 'grid-cols-1 lg:grid-cols-2'
  },
  '3-column': {
    name: '3 Columns',
    icon: <Columns3 className="h-4 w-4" />,
    description: 'Three column layout - maximum density',
    gridClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }
} as const;

const WIDGET_SIZES = {
  small: {
    name: 'Small',
    icon: <Minimize2 className="h-3 w-3" />,
    class: 'col-span-1 row-span-1'
  },
  medium: {
    name: 'Medium',
    icon: <Square className="h-3 w-3" />,
    class: 'col-span-1 lg:col-span-2 row-span-1'
  },
  large: {
    name: 'Large',
    icon: <Maximize2 className="h-3 w-3" />,
    class: 'col-span-1 lg:col-span-2 xl:col-span-3 row-span-2'
  }
} as const;

export default function SimplifiedLayoutSystem({ 
  widgets, 
  onLayoutChange, 
  children 
}: SimplifiedLayoutSystemProps) {
  const [currentLayout, setCurrentLayout] = useState<SimplifiedLayout>(() => {
    // Load saved layout from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upsc-simplified-layout');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error('Error loading saved layout:', error);
        }
      }
    }
    
    // Default layout
    return {
      preset: '2-column' as LayoutPreset,
      widgets: widgets.map((widget, index) => ({
        ...widget,
        order: index
      })),
      customizations: {}
    };
  });

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showPresetSelector, setShowPresetSelector] = useState(false);

  // Save layout to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-simplified-layout', JSON.stringify(currentLayout));
      onLayoutChange(currentLayout);
    }
  }, [currentLayout, onLayoutChange]);

  const changePreset = (preset: LayoutPreset) => {
    setCurrentLayout(prev => ({
      ...prev,
      preset
    }));
    setShowPresetSelector(false);
    toast.success(`Layout changed to ${LAYOUT_PRESETS[preset].name}`);
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    setCurrentLayout(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === widgetId
          ? { ...widget, visible: !widget.visible }
          : widget
      ),
      customizations: {
        ...prev.customizations,
        [widgetId]: {
          ...prev.customizations[widgetId],
          visible: !prev.widgets.find(w => w.id === widgetId)?.visible
        }
      }
    }));
    
    const widget = currentLayout.widgets.find(w => w.id === widgetId);
    toast.success(`${widget?.name} ${widget?.visible ? 'hidden' : 'shown'}`);
  };

  const changeWidgetSize = (widgetId: string, size: WidgetSize) => {
    setCurrentLayout(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === widgetId
          ? { ...widget, size }
          : widget
      ),
      customizations: {
        ...prev.customizations,
        [widgetId]: {
          ...prev.customizations[widgetId],
          size
        }
      }
    }));
    
    const widget = currentLayout.widgets.find(w => w.id === widgetId);
    toast.success(`${widget?.name} resized to ${size}`);
  };

  const moveWidget = (widgetId: string, direction: 'up' | 'down') => {
    setCurrentLayout(prev => {
      const widgets = [...prev.widgets];
      const currentIndex = widgets.findIndex(w => w.id === widgetId);
      
      if (currentIndex === -1) return prev;
      
      const newIndex = direction === 'up' 
        ? Math.max(0, currentIndex - 1)
        : Math.min(widgets.length - 1, currentIndex + 1);
      
      if (newIndex === currentIndex) return prev;
      
      // Swap widgets
      [widgets[currentIndex], widgets[newIndex]] = [widgets[newIndex], widgets[currentIndex]];
      
      // Update order
      widgets.forEach((widget, index) => {
        widget.order = index;
      });
      
      return {
        ...prev,
        widgets
      };
    });
    
    const widget = currentLayout.widgets.find(w => w.id === widgetId);
    toast.success(`${widget?.name} moved ${direction}`);
  };

  const resetLayout = () => {
    if (confirm('Are you sure you want to reset the layout to default?')) {
      setCurrentLayout({
        preset: '2-column',
        widgets: widgets.map((widget, index) => ({
          ...widget,
          size: 'medium',
          visible: true,
          order: index
        })),
        customizations: {}
      });
      toast.success('Layout reset to default');
    }
  };

  const saveLayout = () => {
    // Layout is automatically saved, but provide user feedback
    toast.success('Layout saved successfully!');
  };

  const visibleWidgets = currentLayout.widgets
    .filter(widget => widget.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {/* Layout Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Dashboard Layout
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {LAYOUT_PRESETS[currentLayout.preset].name}
            </span>
            <div className="text-gray-400">
              {LAYOUT_PRESETS[currentLayout.preset].icon}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Preset Selector */}
          <div className="relative">
            <button
              onClick={() => setShowPresetSelector(!showPresetSelector)}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline">Layout</span>
            </button>

            {showPresetSelector && (
              <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-64">
                <div className="p-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Choose Layout
                  </h4>
                  {Object.entries(LAYOUT_PRESETS).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => changePreset(key as LayoutPreset)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        currentLayout.preset === key
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {preset.icon}
                      <div>
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {preset.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Customize Toggle */}
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isCustomizing
                ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isCustomizing ? 'Done' : 'Customize'}
            </span>
          </button>

          {/* Reset Button */}
          <button
            onClick={resetLayout}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            title="Reset Layout"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Widget Customization Panel */}
      {isCustomizing && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            Customize Widgets
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentLayout.widgets.map((widget) => (
              <div
                key={widget.id}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {widget.name}
                  </span>
                  <button
                    onClick={() => toggleWidgetVisibility(widget.id)}
                    className={`p-1 rounded ${
                      widget.visible
                        ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                        : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {widget.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>

                {/* Size Controls */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-600 dark:text-gray-400">Size</label>
                  <div className="flex space-x-1">
                    {Object.entries(WIDGET_SIZES).map(([size, config]) => (
                      <button
                        key={size}
                        onClick={() => changeWidgetSize(widget.id, size as WidgetSize)}
                        className={`flex items-center justify-center p-2 rounded border transition-colors ${
                          widget.size === size
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        title={config.name}
                      >
                        {config.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Move Controls */}
                <div className="flex space-x-1 mt-3">
                  <button
                    onClick={() => moveWidget(widget.id, 'up')}
                    className="flex-1 px-2 py-1 text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    Move Up
                  </button>
                  <button
                    onClick={() => moveWidget(widget.id, 'down')}
                    className="flex-1 px-2 py-1 text-xs bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    Move Down
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className={`grid gap-4 lg:gap-6 ${LAYOUT_PRESETS[currentLayout.preset].gridClass}`}>
        {visibleWidgets.map((widget) => {
          const WidgetComponent = widget.component;
          const sizeClass = WIDGET_SIZES[widget.size].class;
          
          return (
            <div
              key={widget.id}
              className={`${sizeClass} transition-all duration-300 ease-in-out`}
            >
              <WidgetComponent />
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {visibleWidgets.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="text-gray-500 dark:text-gray-400">
            <Grid3X3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No widgets visible</h3>
            <p className="text-sm">
              Click "Customize" to show widgets and arrange your dashboard.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
