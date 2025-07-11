'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Grid, Columns, LayoutGrid, Maximize2, Minimize2, Square } from 'lucide-react';
import { COMPONENT_REGISTRY, WIDGET_METADATA, ComponentId } from './ComponentRegistry';

/**
 * REVOLUTIONARY DASHBOARD - BULLETPROOF ARCHITECTURE
 * 
 * This completely abandons lazy loading and uses a pre-loaded component registry.
 * It's designed to ALWAYS work, no matter what.
 */

type WidgetSize = 'small' | 'medium' | 'large';
type LayoutMode = 'one-column' | 'two-column' | 'three-column';

interface Widget {
  id: ComponentId;
  name: string;
  size: WidgetSize;
  visible: boolean;
  order: number;
}

const WIDGET_SIZES = {
  small: 'col-span-1',
  medium: 'col-span-1 md:col-span-1',
  large: 'col-span-1 md:col-span-2 lg:col-span-2'
};

const LAYOUT_CONFIGS = {
  'one-column': 'grid-cols-1',
  'two-column': 'grid-cols-1 md:grid-cols-2',
  'three-column': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
};

const RevolutionaryDashboard = () => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('three-column');
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; widgetId: ComponentId } | null>(null);
  const [hoveredWidget, setHoveredWidget] = useState<ComponentId | null>(null);

  // Initialize widgets from registry
  useEffect(() => {
    const initialWidgets: Widget[] = Object.entries(WIDGET_METADATA).map(([id, metadata]) => ({
      id: id as ComponentId,
      name: metadata.name,
      size: metadata.size,
      visible: true,
      order: metadata.order
    }));
    
    setWidgets(initialWidgets.sort((a, b) => a.order - b.order));
  }, []);

  const toggleWidgetSize = (widgetId: ComponentId) => {
    setWidgets(prev => prev.map(widget => {
      if (widget.id === widgetId) {
        const sizes: WidgetSize[] = ['small', 'medium', 'large'];
        const currentIndex = sizes.indexOf(widget.size);
        const nextIndex = (currentIndex + 1) % sizes.length;
        return { ...widget, size: sizes[nextIndex] };
      }
      return widget;
    }));
  };

  const setWidgetSize = (widgetId: ComponentId, size: WidgetSize) => {
    setWidgets(prev => prev.map(widget =>
      widget.id === widgetId ? { ...widget, size } : widget
    ));
    setContextMenu(null);
  };

  const handleRightClick = (e: React.MouseEvent, widgetId: ComponentId) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      widgetId
    });
  };

  const handleDoubleClick = (widgetId: ComponentId) => {
    toggleWidgetSize(widgetId);
  };

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const toggleWidgetVisibility = (widgetId: ComponentId) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
    ));
  };

  const visibleWidgets = widgets.filter(widget => widget.visible);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                UPSC Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your comprehensive preparation platform
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Layout Selector */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setLayoutMode('one-column')}
                  className={`p-2 rounded-md ${layoutMode === 'one-column' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title="One Column"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setLayoutMode('two-column')}
                  className={`p-2 rounded-md ${layoutMode === 'two-column' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Two Columns"
                >
                  <Columns className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setLayoutMode('three-column')}
                  className={`p-2 rounded-md ${layoutMode === 'three-column' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Three Columns"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>

              {/* Customize Button */}
              <button
                onClick={() => setIsCustomizing(!isCustomizing)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  isCustomizing 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>{isCustomizing ? 'Done' : 'Customize'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customization Panel */}
      {isCustomizing && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-2">
              {widgets.map(widget => (
                <div key={widget.id} className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-md border">
                  <span className="text-sm font-medium">{widget.name}</span>
                  <button
                    onClick={() => toggleWidgetSize(widget.id)}
                    className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                  >
                    {widget.size}
                  </button>
                  <button
                    onClick={() => toggleWidgetVisibility(widget.id)}
                    className={`text-xs px-2 py-1 rounded ${
                      widget.visible 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {widget.visible ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-6 ${LAYOUT_CONFIGS[layoutMode]}`}>
          {visibleWidgets.map(widget => {
            const WidgetComponent = COMPONENT_REGISTRY[widget.id];
            
            // This is the revolutionary part - no lazy loading, no validation, just direct rendering
            if (!WidgetComponent) {
              return (
                <div key={widget.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-red-600 text-sm">
                    Component not found: {widget.name}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={widget.id}
                className={`${WIDGET_SIZES[widget.size]} relative group ${
                  isCustomizing ? 'ring-2 ring-blue-300 ring-opacity-50' : ''
                }`}
                onContextMenu={(e) => handleRightClick(e, widget.id)}
                onDoubleClick={() => handleDoubleClick(widget.id)}
                onMouseEnter={() => setHoveredWidget(widget.id)}
                onMouseLeave={() => setHoveredWidget(null)}
              >
                <div className="relative">
                  <WidgetComponent />

                  {/* Enhanced Resize Controls */}
                  {(isCustomizing || hoveredWidget === widget.id) && (
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setWidgetSize(widget.id, 'small')}
                        className={`p-1 rounded text-xs ${
                          widget.size === 'small'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                        title="Small size"
                      >
                        <Minimize2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setWidgetSize(widget.id, 'medium')}
                        className={`p-1 rounded text-xs ${
                          widget.size === 'medium'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                        title="Medium size"
                      >
                        <Square className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setWidgetSize(widget.id, 'large')}
                        className={`p-1 rounded text-xs ${
                          widget.size === 'large'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                        title="Large size"
                      >
                        <Maximize2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {/* Resize Hint */}
                  {isCustomizing && (
                    <div className="absolute bottom-2 left-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      Right-click or double-click to resize
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {visibleWidgets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              No widgets visible. Enable some widgets in customize mode.
            </div>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 min-w-[160px]"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <div className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 mb-1">
            Resize Widget
          </div>
          <button
            onClick={() => setWidgetSize(contextMenu.widgetId, 'small')}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <Minimize2 className="h-4 w-4 mr-2" />
            Small
          </button>
          <button
            onClick={() => setWidgetSize(contextMenu.widgetId, 'medium')}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <Square className="h-4 w-4 mr-2" />
            Medium
          </button>
          <button
            onClick={() => setWidgetSize(contextMenu.widgetId, 'large')}
            className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            Large
          </button>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
            <button
              onClick={() => toggleWidgetVisibility(contextMenu.widgetId)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Hide Widget
            </button>
          </div>
        </div>
      )}

      {/* Status Footer */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8 rounded-b-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <div>
              UPSC Dashboard - {visibleWidgets.length} widgets active
            </div>
            <div>
              Layout: {layoutMode.replace('-', ' ')} | {isCustomizing ? 'Customizing' : 'Ready'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevolutionaryDashboard;
