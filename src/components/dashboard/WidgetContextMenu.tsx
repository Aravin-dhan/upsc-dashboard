'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Edit3, 
  Move, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  Square,
  RotateCcw,
  Settings,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useDashboardCustomization } from '@/contexts/DashboardCustomizationContext';
import toast from 'react-hot-toast';

interface ContextMenuProps {
  widgetId: string;
  x: number;
  y: number;
  isVisible: boolean;
  onClose: () => void;
  onEnterEditMode?: () => void;
  onExitEditMode?: () => void;
  isEditMode?: boolean;
}

interface MenuAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  disabled?: boolean;
  destructive?: boolean;
  submenu?: MenuAction[];
}

export default function WidgetContextMenu({
  widgetId,
  x,
  y,
  isVisible,
  onClose,
  onEnterEditMode,
  onExitEditMode,
  isEditMode = false
}: ContextMenuProps) {
  const [showSubmenu, setShowSubmenu] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  
  const { 
    updateWidget, 
    toggleWidgetVisibility, 
    moveWidget,
    resetLayout,
    layout 
  } = useDashboardCustomization();

  // Find the current widget
  const currentWidget = layout.widgets.find(w => w.id === widgetId);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible, onClose]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isVisible) return;
      
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onClose]);

  const handleResize = (size: 'small' | 'medium' | 'large') => {
    if (!currentWidget) return;
    
    const sizeMap = {
      small: { width: 1, height: 1 },
      medium: { width: 2, height: 1 },
      large: { width: 3, height: 2 }
    };
    
    updateWidget(widgetId, { size: sizeMap[size] });
    toast.success(`Widget resized to ${size}`);
    onClose();
  };

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!currentWidget) return;
    
    const currentIndex = layout.widgets.findIndex(w => w.id === widgetId);
    let newIndex = currentIndex;
    
    switch (direction) {
      case 'up':
        newIndex = Math.max(0, currentIndex - 1);
        break;
      case 'down':
        newIndex = Math.min(layout.widgets.length - 1, currentIndex + 1);
        break;
      case 'left':
        newIndex = Math.max(0, currentIndex - 3); // Assuming 3-column grid
        break;
      case 'right':
        newIndex = Math.min(layout.widgets.length - 1, currentIndex + 3);
        break;
    }
    
    if (newIndex !== currentIndex) {
      moveWidget(widgetId, newIndex);
      toast.success(`Widget moved ${direction}`);
    }
    onClose();
  };

  const handleRemove = () => {
    if (confirm('Are you sure you want to remove this widget from your dashboard?')) {
      toggleWidgetVisibility(widgetId);
      toast.success('Widget removed from dashboard');
      onClose();
    }
  };

  const handleShowSubmenu = (submenuId: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setSubmenuPosition({
      x: rect.right + 5,
      y: rect.top
    });
    setShowSubmenu(submenuId);
  };

  const menuActions: MenuAction[] = [
    {
      id: 'edit-mode',
      label: isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode',
      icon: isEditMode ? <EyeOff className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />,
      action: () => {
        if (isEditMode) {
          onExitEditMode?.();
          toast.success('Edit mode disabled');
        } else {
          onEnterEditMode?.();
          toast.success('Edit mode enabled - drag widgets to reorder');
        }
        onClose();
      }
    },
    {
      id: 'resize',
      label: 'Resize Widget',
      icon: <Maximize2 className="h-4 w-4" />,
      action: () => {},
      submenu: [
        {
          id: 'resize-small',
          label: 'Small (1x1)',
          icon: <Minimize2 className="h-3 w-3" />,
          action: () => handleResize('small'),
          disabled: currentWidget?.size.width === 1 && currentWidget?.size.height === 1
        },
        {
          id: 'resize-medium',
          label: 'Medium (2x1)',
          icon: <Square className="h-3 w-3" />,
          action: () => handleResize('medium'),
          disabled: currentWidget?.size.width === 2 && currentWidget?.size.height === 1
        },
        {
          id: 'resize-large',
          label: 'Large (3x2)',
          icon: <Maximize2 className="h-3 w-3" />,
          action: () => handleResize('large'),
          disabled: currentWidget?.size.width === 3 && currentWidget?.size.height === 2
        }
      ]
    },
    {
      id: 'move',
      label: 'Move Widget',
      icon: <Move className="h-4 w-4" />,
      action: () => {},
      submenu: [
        {
          id: 'move-up',
          label: 'Move Up',
          icon: <ArrowUp className="h-3 w-3" />,
          action: () => handleMove('up')
        },
        {
          id: 'move-down',
          label: 'Move Down',
          icon: <ArrowDown className="h-3 w-3" />,
          action: () => handleMove('down')
        },
        {
          id: 'move-left',
          label: 'Move Left',
          icon: <ArrowLeft className="h-3 w-3" />,
          action: () => handleMove('left')
        },
        {
          id: 'move-right',
          label: 'Move Right',
          icon: <ArrowRight className="h-3 w-3" />,
          action: () => handleMove('right')
        }
      ]
    },
    {
      id: 'settings',
      label: 'Widget Settings',
      icon: <Settings className="h-4 w-4" />,
      action: () => {
        toast.info('Widget settings coming soon!');
        onClose();
      }
    },
    {
      id: 'divider',
      label: '',
      icon: null,
      action: () => {}
    },
    {
      id: 'remove',
      label: 'Remove Widget',
      icon: <Trash2 className="h-4 w-4" />,
      action: handleRemove,
      destructive: true
    },
    {
      id: 'reset',
      label: 'Reset Layout',
      icon: <RotateCcw className="h-4 w-4" />,
      action: () => {
        if (confirm('Are you sure you want to reset the entire dashboard layout?')) {
          resetLayout();
          toast.success('Dashboard layout reset to default');
          onClose();
        }
      },
      destructive: true
    }
  ];

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={menuRef}
        className="fixed z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 min-w-48"
        style={{ left: x, top: y }}
      >
        {menuActions.map((action, index) => {
          if (action.id === 'divider') {
            return <div key={index} className="border-t border-gray-200 dark:border-gray-700 my-1" />;
          }

          return (
            <div key={action.id} className="relative">
              <button
                className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  action.destructive 
                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' 
                    : 'text-gray-700 dark:text-gray-300'
                } ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={(e) => {
                  if (action.disabled) return;
                  if (action.submenu) {
                    handleShowSubmenu(action.id, e);
                  } else {
                    action.action();
                  }
                }}
                disabled={action.disabled}
                onMouseEnter={(e) => {
                  if (action.submenu && !action.disabled) {
                    handleShowSubmenu(action.id, e);
                  }
                }}
              >
                {action.icon}
                <span className="flex-1">{action.label}</span>
                {action.submenu && (
                  <ArrowRight className="h-3 w-3 text-gray-400" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Submenu */}
      {showSubmenu && (
        <div
          ref={submenuRef}
          className="fixed z-51 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 min-w-40"
          style={{ left: submenuPosition.x, top: submenuPosition.y }}
          onMouseLeave={() => setShowSubmenu(null)}
        >
          {menuActions
            .find(action => action.id === showSubmenu)
            ?.submenu?.map((subAction) => (
              <button
                key={subAction.id}
                className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  subAction.disabled 
                    ? 'opacity-50 cursor-not-allowed text-gray-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => {
                  if (!subAction.disabled) {
                    subAction.action();
                    setShowSubmenu(null);
                  }
                }}
                disabled={subAction.disabled}
              >
                {subAction.icon}
                <span>{subAction.label}</span>
              </button>
            ))}
        </div>
      )}
    </>
  );
}
