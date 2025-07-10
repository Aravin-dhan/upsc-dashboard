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
import { DashboardPersonalizationService } from '@/services/DashboardPersonalizationService';

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
  const [resizingWidget, setResizingWidget] = useState<string | null>(null);
  const [resizeStartPos, setResizeStartPos] = useState<{ x: number; y: number } | null>(null);
  const [resizeStartSize, setResizeStartSize] = useState<string | null>(null);

  const personalizationService = DashboardPersonalizationService.getInstance();

  // Save layout to localStorage and sync with API whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-simplified-layout', JSON.stringify(currentLayout));
      onLayoutChange(currentLayout);

      // Debounced API sync to avoid too many requests
      const timeoutId = setTimeout(async () => {
        try {
          await fetch('/api/user/preferences', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              preferences: {
                dashboardLayout: currentLayout
              }
            }),
          });
        } catch (error) {
          console.warn('Failed to sync layout to server:', error);
          // Continue with local storage - don't block user experience
        }
      }, 1000); // 1 second debounce

      return () => clearTimeout(timeoutId);
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
    const newVisibility = !widget?.visible;

    // Track behavior
    personalizationService.trackBehavior('widget-visibility-toggled', {
      widgetId,
      widgetName: widget?.name,
      newVisibility,
      timestamp: new Date().toISOString()
    });

    toast.success(`${widget?.name} ${newVisibility ? 'shown' : 'hidden'}`);
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

  // Enhanced drag and drop functionality
  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    if (!isCustomizing) return;

    e.dataTransfer.setData('text/plain', widgetId);
    e.dataTransfer.effectAllowed = 'move';

    // Add visual feedback
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isCustomizing) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetWidgetId: string) => {
    if (!isCustomizing) return;
    e.preventDefault();

    const draggedWidgetId = e.dataTransfer.getData('text/plain');
    if (draggedWidgetId === targetWidgetId) return;

    setCurrentLayout(prev => {
      const widgets = [...prev.widgets];
      const draggedIndex = widgets.findIndex(w => w.id === draggedWidgetId);
      const targetIndex = widgets.findIndex(w => w.id === targetWidgetId);

      if (draggedIndex === -1 || targetIndex === -1) return prev;

      // Remove dragged widget and insert at target position
      const [draggedWidget] = widgets.splice(draggedIndex, 1);
      widgets.splice(targetIndex, 0, draggedWidget);

      // Update order
      widgets.forEach((widget, index) => {
        widget.order = index;
      });

      return {
        ...prev,
        widgets
      };
    });

    toast.success('Widget reordered!');
  };

  // Resize functionality
  const handleResizeStart = (e: React.MouseEvent, widgetId: string) => {
    if (!isCustomizing) return;

    e.preventDefault();
    e.stopPropagation();

    const widget = currentLayout.widgets.find(w => w.id === widgetId);
    if (!widget) return;

    setResizingWidget(widgetId);
    setResizeStartPos({ x: e.clientX, y: e.clientY });
    setResizeStartSize(widget.size);

    // Add global mouse event listeners
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!resizingWidget || !resizeStartPos || !resizeStartSize) return;

    const deltaX = e.clientX - resizeStartPos.x;
    const deltaY = e.clientY - resizeStartPos.y;

    // Determine new size based on movement
    let newSize = resizeStartSize;

    // Simple resize logic - increase size if moving right/down, decrease if moving left/up
    const threshold = 50; // pixels

    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      const sizeOrder = ['small', 'medium', 'large'];
      const currentIndex = sizeOrder.indexOf(resizeStartSize);

      if ((deltaX > threshold || deltaY > threshold) && currentIndex < sizeOrder.length - 1) {
        newSize = sizeOrder[currentIndex + 1];
      } else if ((deltaX < -threshold || deltaY < -threshold) && currentIndex > 0) {
        newSize = sizeOrder[currentIndex - 1];
      }
    }

    // Update widget size if it changed
    if (newSize !== resizeStartSize) {
      setCurrentLayout(prev => ({
        ...prev,
        widgets: prev.widgets.map(widget =>
          widget.id === resizingWidget
            ? { ...widget, size: newSize as 'small' | 'medium' | 'large' }
            : widget
        )
      }));

      setResizeStartSize(newSize);
      setResizeStartPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleResizeEnd = () => {
    if (resizingWidget) {
      toast.success('Widget resized!');
    }

    setResizingWidget(null);
    setResizeStartPos(null);
    setResizeStartSize(null);

    // Remove global mouse event listeners
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  // Cleanup resize listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, []);

  // Cycle widget size (alternative to drag resize)
  const cycleWidgetSize = (widgetId: string) => {
    if (!isCustomizing) return;

    const sizeOrder: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
    const widget = currentLayout.widgets.find(w => w.id === widgetId);
    const currentIndex = sizeOrder.indexOf(widget?.size || 'medium');
    const nextIndex = (currentIndex + 1) % sizeOrder.length;
    const newSize = sizeOrder[nextIndex];

    setCurrentLayout(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget => {
        if (widget.id === widgetId) {
          return { ...widget, size: newSize };
        }
        return widget;
      })
    }));

    // Track behavior
    personalizationService.trackBehavior('widget-resized', {
      widgetId,
      widgetName: widget?.name,
      oldSize: widget?.size,
      newSize,
      timestamp: new Date().toISOString()
    });

    toast.success(`Widget resized to ${newSize}!`);
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

                {/* Resize Controls */}
                <div className="flex space-x-1 mt-2">
                  <button
                    onClick={() => cycleWidgetSize(widget.id)}
                    className="flex-1 px-2 py-1 text-xs bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-800/30 text-purple-700 dark:text-purple-300 rounded transition-colors"
                  >
                    Resize ({widget.size})
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

          // Critical fix for React Error #130: Check if component is valid
          if (!WidgetComponent || typeof WidgetComponent !== 'function') {
            console.error(`Invalid component for widget ${widget.id}:`, WidgetComponent);
            return (
              <div
                key={widget.id}
                className={`${sizeClass} bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4`}
              >
                <div className="text-center text-red-600 dark:text-red-400">
                  <div className="text-sm font-medium">Widget Error</div>
                  <div className="text-xs mt-1">Failed to load {widget.name}</div>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={widget.id}
              draggable={isCustomizing}
              onDragStart={(e) => handleDragStart(e, widget.id)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, widget.id)}
              className={`
                ${sizeClass}
                transition-all duration-300 ease-in-out relative
                ${isCustomizing ? 'cursor-move border-2 border-dashed border-blue-300 dark:border-blue-600 hover:border-blue-500 dark:hover:border-blue-400' : ''}
                ${isCustomizing ? 'hover:shadow-lg hover:scale-105' : ''}
                ${resizingWidget === widget.id ? 'ring-2 ring-purple-500 ring-opacity-50' : ''}
              `}
              title={isCustomizing ? `Drag to reorder ${widget.name}` : undefined}
            >
              {isCustomizing && (
                <>
                  <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white text-xs px-2 py-1 rounded-full opacity-75">
                    Drag me
                  </div>

                  {/* Resize Handle */}
                  <div
                    className="absolute bottom-2 right-2 z-10 w-4 h-4 bg-purple-500 hover:bg-purple-600 cursor-se-resize rounded-tl-lg opacity-75 hover:opacity-100 transition-all"
                    onMouseDown={(e) => handleResizeStart(e, widget.id)}
                    title="Drag to resize"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 border-r border-b border-white transform rotate-45"></div>
                    </div>
                  </div>

                  {/* Size indicator */}
                  <div className="absolute top-2 left-2 z-10 bg-purple-500 text-white text-xs px-2 py-1 rounded-full opacity-75">
                    {widget.size}
                  </div>
                </>
              )}

              {/* Safe component rendering with error boundary */}
              <React.Suspense fallback={
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              }>
                <WidgetComponent />
              </React.Suspense>
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
