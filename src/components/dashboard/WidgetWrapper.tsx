'use client';

import React, { useState, ReactNode } from 'react';
import { MoreVertical, Settings, Eye, EyeOff, Move, Maximize2, Minimize2 } from 'lucide-react';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';

interface WidgetWrapperProps {
  widgetId: string;
  children: ReactNode;
  className?: string;
  showControls?: boolean;
}

export default function WidgetWrapper({
  widgetId,
  children,
  className = '',
  showControls = true
}: WidgetWrapperProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { getWidget, updateWidget, toggleWidget } = useDashboardLayout();
  
  const widget = getWidget(widgetId);
  
  if (!widget) {
    return <div className={className}>{children}</div>;
  }

  const handleSizeChange = (dimension: 'width' | 'height', change: number) => {
    const newSize = { ...widget.size };
    newSize[dimension] = Math.max(1, Math.min(12, newSize[dimension] + change));
    updateWidget(widgetId, { size: newSize });
  };

  const handleToggleExpand = () => {
    if (isExpanded) {
      // Restore original size
      setIsExpanded(false);
    } else {
      // Expand to full width
      setIsExpanded(true);
    }
  };

  const menuItems = [
    {
      icon: widget.enabled ? EyeOff : Eye,
      label: widget.enabled ? 'Hide Widget' : 'Show Widget',
      action: () => toggleWidget(widgetId)
    },
    {
      icon: isExpanded ? Minimize2 : Maximize2,
      label: isExpanded ? 'Minimize' : 'Expand',
      action: handleToggleExpand
    },
    {
      icon: Settings,
      label: 'Widget Settings',
      action: () => {
        // This could open a widget-specific settings panel
        console.log(`Opening settings for ${widget.name}`);
      }
    }
  ];

  return (
    <div 
      className={`relative group ${className} ${isExpanded ? 'lg:col-span-12 z-10' : ''}`}
      style={isExpanded ? { gridColumn: '1 / -1' } : undefined}
    >
      {/* Widget Controls */}
      {showControls && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-md bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Widget Options"
            >
              <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-30">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                
                {/* Size Controls */}
                <div className="px-3 py-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Widget Size</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Width:</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleSizeChange('width', -1)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        disabled={widget.size.width <= 1}
                      >
                        -
                      </button>
                      <span className="text-xs w-6 text-center">{widget.size.width}</span>
                      <button
                        onClick={() => handleSizeChange('width', 1)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        disabled={widget.size.width >= 12}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* Widget Content */}
      <div className={isExpanded ? 'transform scale-105 transition-transform duration-300' : ''}>
        {children}
      </div>

      {/* Widget Info Overlay (for debugging/development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {widget.name} ({widget.size.width}x{widget.size.height})
          </div>
        </div>
      )}
    </div>
  );
}

// Higher-order component to wrap widgets automatically
export function withWidgetWrapper<P extends object>(
  Component: React.ComponentType<P>,
  widgetId: string,
  options: { showControls?: boolean; className?: string } = {}
) {
  const WrappedComponent = (props: P) => (
    <WidgetWrapper
      widgetId={widgetId}
      showControls={options.showControls}
      className={options.className}
    >
      <Component {...props} />
    </WidgetWrapper>
  );

  WrappedComponent.displayName = `withWidgetWrapper(${Component.displayName || Component.name})`;
  return WrappedComponent;
}
