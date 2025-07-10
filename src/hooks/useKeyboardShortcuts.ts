'use client';

import { useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  category: string;
}

interface UseKeyboardShortcutsProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onSaveLayout: () => void;
  onResetLayout: () => void;
  onShowHelp: () => void;
  selectedWidgetId?: string;
  onMoveWidget?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onResizeWidget?: (size: 'small' | 'medium' | 'large') => void;
  onRemoveWidget?: () => void;
}

export function useKeyboardShortcuts({
  isEditMode,
  onToggleEditMode,
  onSaveLayout,
  onResetLayout,
  onShowHelp,
  selectedWidgetId,
  onMoveWidget,
  onResizeWidget,
  onRemoveWidget
}: UseKeyboardShortcutsProps) {
  const shortcutsRef = useRef<KeyboardShortcut[]>([]);

  // Define all keyboard shortcuts
  const shortcuts: KeyboardShortcut[] = [
    // Global shortcuts
    {
      key: 'e',
      ctrlKey: true,
      action: onToggleEditMode,
      description: 'Toggle edit mode',
      category: 'Global'
    },
    {
      key: 's',
      ctrlKey: true,
      action: (e) => {
        e?.preventDefault();
        onSaveLayout();
      },
      description: 'Save layout',
      category: 'Global'
    },
    {
      key: 'r',
      ctrlKey: true,
      shiftKey: true,
      action: (e) => {
        e?.preventDefault();
        onResetLayout();
      },
      description: 'Reset layout',
      category: 'Global'
    },
    {
      key: '?',
      shiftKey: true,
      action: onShowHelp,
      description: 'Show keyboard shortcuts',
      category: 'Global'
    },
    {
      key: 'h',
      ctrlKey: true,
      action: onShowHelp,
      description: 'Show help',
      category: 'Global'
    },
    
    // Edit mode shortcuts
    {
      key: 'Escape',
      action: () => {
        if (isEditMode) {
          onToggleEditMode();
        }
      },
      description: 'Exit edit mode',
      category: 'Edit Mode'
    },
    
    // Widget manipulation shortcuts (only when a widget is selected)
    {
      key: 'ArrowUp',
      action: () => onMoveWidget?.('up'),
      description: 'Move widget up',
      category: 'Widget Control'
    },
    {
      key: 'ArrowDown',
      action: () => onMoveWidget?.('down'),
      description: 'Move widget down',
      category: 'Widget Control'
    },
    {
      key: 'ArrowLeft',
      action: () => onMoveWidget?.('left'),
      description: 'Move widget left',
      category: 'Widget Control'
    },
    {
      key: 'ArrowRight',
      action: () => onMoveWidget?.('right'),
      description: 'Move widget right',
      category: 'Widget Control'
    },
    {
      key: '1',
      action: () => onResizeWidget?.('small'),
      description: 'Resize to small',
      category: 'Widget Control'
    },
    {
      key: '2',
      action: () => onResizeWidget?.('medium'),
      description: 'Resize to medium',
      category: 'Widget Control'
    },
    {
      key: '3',
      action: () => onResizeWidget?.('large'),
      description: 'Resize to large',
      category: 'Widget Control'
    },
    {
      key: 'Delete',
      action: onRemoveWidget,
      description: 'Remove selected widget',
      category: 'Widget Control'
    },
    {
      key: 'Backspace',
      action: onRemoveWidget,
      description: 'Remove selected widget',
      category: 'Widget Control'
    }
  ];

  shortcutsRef.current = shortcuts;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement ||
      (event.target as HTMLElement)?.contentEditable === 'true'
    ) {
      return;
    }

    const matchingShortcut = shortcutsRef.current.find(shortcut => {
      const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatch = !!shortcut.ctrlKey === event.ctrlKey;
      const shiftMatch = !!shortcut.shiftKey === event.shiftKey;
      const altMatch = !!shortcut.altKey === event.altKey;
      const metaMatch = !!shortcut.metaKey === event.metaKey;

      return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch;
    });

    if (matchingShortcut) {
      // Check if widget-specific shortcuts require a selected widget
      if (
        matchingShortcut.category === 'Widget Control' && 
        !selectedWidgetId && 
        isEditMode
      ) {
        toast.error('Please select a widget first by clicking on it');
        return;
      }

      event.preventDefault();
      matchingShortcut.action(event);
      
      // Show feedback for the action
      if (matchingShortcut.description) {
        toast.success(matchingShortcut.description);
      }
    }
  }, [selectedWidgetId, isEditMode]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Return shortcuts for help display
  const getShortcutsByCategory = useCallback(() => {
    const categories: Record<string, KeyboardShortcut[]> = {};
    
    shortcuts.forEach(shortcut => {
      if (!categories[shortcut.category]) {
        categories[shortcut.category] = [];
      }
      categories[shortcut.category].push(shortcut);
    });
    
    return categories;
  }, []);

  const formatShortcut = useCallback((shortcut: KeyboardShortcut) => {
    const parts = [];
    
    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.shiftKey) parts.push('Shift');
    if (shortcut.altKey) parts.push('Alt');
    if (shortcut.metaKey) parts.push('Cmd');
    
    parts.push(shortcut.key === ' ' ? 'Space' : shortcut.key);
    
    return parts.join(' + ');
  }, []);

  return {
    shortcuts,
    getShortcutsByCategory,
    formatShortcut
  };
}

// Touch gesture hook for mobile devices
export function useTouchGestures({
  isEditMode,
  onToggleEditMode,
  onMoveWidget,
  onResizeWidget,
  selectedWidgetId
}: {
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onMoveWidget?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onResizeWidget?: (size: 'small' | 'medium' | 'large') => void;
  selectedWidgetId?: string;
}) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }, []);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = event.changedTouches[0];
    touchEndRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = touchEndRef.current.y - touchStartRef.current.y;
    const deltaTime = touchEndRef.current.time - touchStartRef.current.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Detect swipe gestures
    if (distance > 50 && deltaTime < 300 && isEditMode && selectedWidgetId) {
      const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
      
      if (angle > -45 && angle <= 45) {
        // Swipe right
        onMoveWidget?.('right');
        toast.success('Widget moved right');
      } else if (angle > 45 && angle <= 135) {
        // Swipe down
        onMoveWidget?.('down');
        toast.success('Widget moved down');
      } else if (angle > 135 || angle <= -135) {
        // Swipe left
        onMoveWidget?.('left');
        toast.success('Widget moved left');
      } else if (angle > -135 && angle <= -45) {
        // Swipe up
        onMoveWidget?.('up');
        toast.success('Widget moved up');
      }
    }

    // Detect double tap for edit mode toggle
    if (distance < 10 && deltaTime < 300) {
      // This is a tap, check for double tap
      const now = Date.now();
      const lastTap = localStorage.getItem('lastTapTime');
      
      if (lastTap && now - parseInt(lastTap) < 300) {
        onToggleEditMode();
        localStorage.removeItem('lastTapTime');
      } else {
        localStorage.setItem('lastTapTime', now.toString());
      }
    }

    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [isEditMode, selectedWidgetId, onMoveWidget, onToggleEditMode]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    // Prevent scrolling when in edit mode and dragging
    if (isEditMode && touchStartRef.current) {
      event.preventDefault();
    }
  }, [isEditMode]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleTouchStart, handleTouchEnd, handleTouchMove]);

  return {
    touchStartRef,
    touchEndRef
  };
}
