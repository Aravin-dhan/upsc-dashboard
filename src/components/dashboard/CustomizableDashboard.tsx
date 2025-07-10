'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDashboardCustomization, DashboardWidget } from '@/contexts/DashboardCustomizationContext';
import { cn } from '@/lib/utils';
import {
  Settings,
  Eye,
  EyeOff,
  RotateCcw,
  Grid3X3,
  Columns2,
  Columns3,
  GripVertical,
  Maximize2,
  Minimize2,
  Square,
  X
} from 'lucide-react';

interface SortableWidgetProps {
  widget: DashboardWidget;
  children: React.ReactNode;
  isCustomizing: boolean;
}

function SortableWidget({ widget, children, isCustomizing }: SortableWidgetProps) {
  const { updateWidget, toggleWidgetVisibility } = useDashboardCustomization();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'h-48';
      case 'medium':
        return 'h-64';
      case 'large':
        return 'h-80';
      default:
        return 'h-64';
    }
  };

  const cycleSizeUp = () => {
    const sizes = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(widget.size);
    const nextIndex = (currentIndex + 1) % sizes.length;
    updateWidget(widget.id, { size: sizes[nextIndex] as 'small' | 'medium' | 'large' });
  };

  const cycleSizeDown = () => {
    const sizes = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(widget.size);
    const nextIndex = currentIndex === 0 ? sizes.length - 1 : currentIndex - 1;
    updateWidget(widget.id, { size: sizes[nextIndex] as 'small' | 'medium' | 'large' });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200',
        getSizeClasses(widget.size),
        isDragging && 'opacity-50 z-50',
        isCustomizing && 'ring-2 ring-blue-500 ring-opacity-50',
        !widget.visible && 'opacity-50'
      )}
    >
      {isCustomizing && (
        <div className="absolute top-2 right-2 z-10 flex space-x-1">
          {/* Size controls */}
          <button
            onClick={cycleSizeUp}
            className="p-1 bg-white dark:bg-gray-700 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
            title="Increase size"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
          <button
            onClick={cycleSizeDown}
            className="p-1 bg-white dark:bg-gray-700 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
            title="Decrease size"
          >
            <Minimize2 className="w-3 h-3" />
          </button>

          {/* Remove widget button */}
          <button
            onClick={() => toggleWidgetVisibility(widget.id)}
            className="p-1 bg-white dark:bg-gray-700 rounded shadow-sm hover:bg-red-50 dark:hover:bg-red-900 text-red-500"
            title="Remove widget"
          >
            <X className="w-3 h-3" />
          </button>

          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="p-1 bg-white dark:bg-gray-700 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical className="w-3 h-3" />
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
}

interface CustomizableDashboardProps {
  children: React.ReactNode;
}

export default function CustomizableDashboard({ children }: CustomizableDashboardProps) {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const { layout, updateLayout, toggleWidgetVisibility, reorderWidgets, resetToDefault } = useDashboardCustomization();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const visibleWidgets = layout.widgets.filter(widget => widget.visible);
  const hiddenWidgets = layout.widgets.filter(widget => !widget.visible);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = visibleWidgets.findIndex(widget => widget.id === active.id);
      const newIndex = visibleWidgets.findIndex(widget => widget.id === over?.id);
      
      const newOrder = arrayMove(visibleWidgets, oldIndex, newIndex);
      reorderWidgets([...newOrder, ...hiddenWidgets]);
    }
  };

  const setColumns = (columns: 1 | 2 | 3) => {
    updateLayout({ ...layout, columns });
  };

  const getColumnClasses = () => {
    switch (layout.columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 lg:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div className="space-y-6">
      {/* Customization Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className={cn(
              'flex items-center space-x-2 px-3 py-2 rounded-md transition-colors',
              isCustomizing
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
          >
            <Settings className="w-4 h-4" />
            <span>{isCustomizing ? 'Done Customizing' : 'Customize Dashboard'}</span>
          </button>

          {isCustomizing && (
            <>
              {/* Column Layout Controls */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Layout:</span>
                <button
                  onClick={() => setColumns(1)}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    layout.columns === 1
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                  title="1 Column"
                >
                  <Square className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setColumns(2)}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    layout.columns === 2
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                  title="2 Columns"
                >
                  <Columns2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setColumns(3)}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    layout.columns === 3
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                  title="3 Columns"
                >
                  <Columns3 className="w-4 h-4" />
                </button>
              </div>

              {/* Reset Button */}
              <button
                onClick={resetToDefault}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Default</span>
              </button>
            </>
          )}
        </div>

        {/* Widget Visibility Controls */}
        {isCustomizing && hiddenWidgets.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Hidden widgets:</span>
            {hiddenWidgets.map(widget => (
              <button
                key={widget.id}
                onClick={() => toggleWidgetVisibility(widget.id)}
                className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <EyeOff className="w-3 h-3" />
                <span>{widget.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dashboard Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleWidgets.map(w => w.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={cn('grid gap-6', getColumnClasses())}>
            {visibleWidgets.map((widget) => (
              <SortableWidget
                key={widget.id}
                widget={widget}
                isCustomizing={isCustomizing}
              >
                <div className="p-4 h-full">
                  {isCustomizing && (
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {widget.title}
                      </h3>
                      <button
                        onClick={() => toggleWidgetVisibility(widget.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Hide widget"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {/* Widget content would be rendered here based on widget.type */}
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    {widget.title} Content
                  </div>
                </div>
              </SortableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
