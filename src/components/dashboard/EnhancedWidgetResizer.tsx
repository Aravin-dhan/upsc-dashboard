'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Maximize2, Minimize2, Square, Move, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export type WidgetSize = 'small' | 'medium' | 'large' | 'extra-large';

export interface ResizableWidgetProps {
  id: string;
  children: React.ReactNode;
  initialSize?: WidgetSize;
  onSizeChange?: (id: string, size: WidgetSize) => void;
  onPositionChange?: (id: string, position: { x: number; y: number }) => void;
  isResizable?: boolean;
  isDraggable?: boolean;
  className?: string;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

const WIDGET_SIZES: Record<WidgetSize, { width: string; height: string; gridSpan: string }> = {
  small: { width: '300px', height: '200px', gridSpan: 'col-span-1 row-span-1' },
  medium: { width: '400px', height: '300px', gridSpan: 'col-span-1 lg:col-span-2 row-span-1' },
  large: { width: '600px', height: '400px', gridSpan: 'col-span-1 lg:col-span-2 xl:col-span-3 row-span-2' },
  'extra-large': { width: '800px', height: '500px', gridSpan: 'col-span-1 lg:col-span-3 xl:col-span-4 row-span-3' }
};

export default function EnhancedWidgetResizer({
  id,
  children,
  initialSize = 'medium',
  onSizeChange,
  onPositionChange,
  isResizable = true,
  isDraggable = true,
  className = '',
  minWidth = 250,
  minHeight = 150,
  maxWidth = 1000,
  maxHeight = 800
}: ResizableWidgetProps) {
  const [currentSize, setCurrentSize] = useState<WidgetSize>(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const widgetRef = useRef<HTMLDivElement>(null);
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);

  // Initialize dimensions based on current size
  useEffect(() => {
    const sizeConfig = WIDGET_SIZES[currentSize];
    setDimensions({
      width: parseInt(sizeConfig.width),
      height: parseInt(sizeConfig.height)
    });
  }, [currentSize]);

  const handleSizePresetChange = (newSize: WidgetSize) => {
    setCurrentSize(newSize);
    const sizeConfig = WIDGET_SIZES[newSize];
    setDimensions({
      width: parseInt(sizeConfig.width),
      height: parseInt(sizeConfig.height)
    });
    onSizeChange?.(id, newSize);
    toast.success(`Widget resized to ${newSize}`);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, type: 'resize' | 'drag') => {
    e.preventDefault();
    e.stopPropagation();

    if (type === 'resize' && isResizable) {
      setIsResizing(true);
      resizeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: dimensions.width,
        height: dimensions.height
      };
    } else if (type === 'drag' && isDraggable) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        startX: position.x,
        startY: position.y
      };
    }
  }, [dimensions, position, isResizable, isDraggable]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing && resizeStartRef.current) {
      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;
      
      const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartRef.current.width + deltaX));
      const newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartRef.current.height + deltaY));
      
      setDimensions({ width: newWidth, height: newHeight });
    } else if (isDragging && dragStartRef.current) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      const newPosition = {
        x: dragStartRef.current.startX + deltaX,
        y: dragStartRef.current.startY + deltaY
      };
      
      setPosition(newPosition);
    }
  }, [isResizing, isDragging, minWidth, maxWidth, minHeight, maxHeight]);

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      resizeStartRef.current = null;
      toast.success('Widget resized successfully!');
    }
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
      onPositionChange?.(id, position);
      toast.success('Widget moved successfully!');
    }
  }, [isResizing, isDragging, id, position, onPositionChange]);

  // Global mouse event listeners
  useEffect(() => {
    if (isResizing || isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isResizing ? 'nw-resize' : 'move';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, isDragging, handleMouseMove, handleMouseUp]);

  const resetSize = () => {
    handleSizePresetChange('medium');
    setPosition({ x: 0, y: 0 });
    toast.success('Widget reset to default size and position');
  };

  return (
    <div
      ref={widgetRef}
      className={`
        relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 
        shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden
        ${isResizing ? 'shadow-lg shadow-blue-500/20 border-blue-500' : ''}
        ${isDragging ? 'shadow-lg shadow-green-500/20 border-green-500 rotate-1' : ''}
        ${className}
      `}
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: isResizing || isDragging ? 1000 : 1
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isResizing && !isDragging && setShowControls(false)}
    >
      {/* Resize Handle */}
      {isResizable && (
        <div
          className={`
            absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize z-10
            bg-blue-500 hover:bg-blue-600 transition-colors duration-200
            ${showControls || isResizing ? 'opacity-100' : 'opacity-0'}
          `}
          onMouseDown={(e) => handleMouseDown(e, 'resize')}
          style={{
            clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
          }}
        />
      )}

      {/* Drag Handle */}
      {isDraggable && (
        <div
          className={`
            absolute top-2 left-2 p-1 cursor-move z-10 rounded
            bg-green-500 hover:bg-green-600 text-white transition-all duration-200
            ${showControls || isDragging ? 'opacity-100' : 'opacity-0'}
          `}
          onMouseDown={(e) => handleMouseDown(e, 'drag')}
          title="Drag to move"
        >
          <Move className="h-3 w-3" />
        </div>
      )}

      {/* Size Control Panel */}
      {(showControls || isResizing) && (
        <div className="absolute top-2 right-2 flex items-center space-x-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 shadow-lg z-10">
          <button
            onClick={() => handleSizePresetChange('small')}
            className={`p-1 rounded transition-colors ${
              currentSize === 'small' 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
            title="Small"
          >
            <Minimize2 className="h-3 w-3" />
          </button>
          <button
            onClick={() => handleSizePresetChange('medium')}
            className={`p-1 rounded transition-colors ${
              currentSize === 'medium' 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
            title="Medium"
          >
            <Square className="h-3 w-3" />
          </button>
          <button
            onClick={() => handleSizePresetChange('large')}
            className={`p-1 rounded transition-colors ${
              currentSize === 'large' 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
            title="Large"
          >
            <Maximize2 className="h-3 w-3" />
          </button>
          <button
            onClick={resetSize}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Resize Indicators */}
      {isResizing && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-500 pointer-events-none">
          <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            {dimensions.width} × {dimensions.height}
          </div>
        </div>
      )}

      {/* Drag Indicators */}
      {isDragging && (
        <div className="absolute inset-0 border-2 border-dashed border-green-500 pointer-events-none">
          <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
            Moving...
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`h-full w-full ${isResizing || isDragging ? 'pointer-events-none' : ''}`}>
        {children}
      </div>
    </div>
  );
}
