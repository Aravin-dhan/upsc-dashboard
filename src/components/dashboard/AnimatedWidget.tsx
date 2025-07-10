'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { useDashboardCustomization } from '@/contexts/DashboardCustomizationContext';
import WidgetContextMenu from './WidgetContextMenu';
import { EditModeOverlay, EditModeTooltip } from './EditModeIndicators';
import { Tooltip } from './UserGuidance';

interface AnimatedWidgetProps {
  widgetId: string;
  children: React.ReactNode;
  isEditMode: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export default function AnimatedWidget({
  widgetId,
  children,
  isEditMode,
  isSelected = false,
  onSelect,
  className = ''
}: AnimatedWidgetProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const dragControls = useDragControls();
  const widgetRef = useRef<HTMLDivElement>(null);
  const { layout, updateWidget, moveWidget } = useDashboardCustomization();

  const currentWidget = layout.widgets.find(w => w.id === widgetId);

  // Animation variants
  const widgetVariants = {
    idle: {
      scale: 1,
      rotate: 0,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    hover: {
      scale: isEditMode ? 1.02 : 1,
      boxShadow: isEditMode 
        ? '0 8px 25px rgba(59, 130, 246, 0.15)' 
        : '0 4px 12px rgba(0, 0, 0, 0.15)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    },
    dragging: {
      scale: 1.05,
      rotate: 2,
      boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
      zIndex: 1000,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    },
    selected: {
      scale: 1.01,
      boxShadow: '0 0 0 2px #3b82f6, 0 8px 25px rgba(59, 130, 246, 0.2)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    },
    resizing: {
      scale: 1.03,
      boxShadow: '0 12px 30px rgba(147, 51, 234, 0.2)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  const getAnimationState = () => {
    if (isDragging) return 'dragging';
    if (isResizing) return 'resizing';
    if (isSelected) return 'selected';
    return 'idle';
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setTooltipMessage('Drag to reorder widget');
    setShowTooltip(true);
    onSelect?.();
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    setShowTooltip(false);
    
    // Calculate drop position and reorder widgets
    const draggedElement = widgetRef.current;
    if (!draggedElement) return;

    const allWidgets = document.querySelectorAll('[data-widget-id]');
    const draggedRect = draggedElement.getBoundingClientRect();
    const draggedCenter = {
      x: draggedRect.left + draggedRect.width / 2,
      y: draggedRect.top + draggedRect.height / 2
    };

    let closestWidget: Element | null = null;
    let closestDistance = Infinity;

    allWidgets.forEach(widget => {
      if (widget === draggedElement) return;
      
      const rect = widget.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      
      const distance = Math.sqrt(
        Math.pow(draggedCenter.x - center.x, 2) + 
        Math.pow(draggedCenter.y - center.y, 2)
      );
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestWidget = widget;
      }
    });

    if (closestWidget) {
      const targetWidgetId = closestWidget.getAttribute('data-widget-id');
      if (targetWidgetId) {
        const targetIndex = layout.widgets.findIndex(w => w.id === targetWidgetId);
        if (targetIndex !== -1) {
          moveWidget(widgetId, targetIndex);
        }
      }
    }
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      visible: true
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleResize = (direction: string) => {
    setIsResizing(true);
    setTooltipMessage(`Resizing widget ${direction}`);
    setShowTooltip(true);
    
    // Simulate resize animation
    setTimeout(() => {
      setIsResizing(false);
      setShowTooltip(false);
    }, 500);
  };

  const handleWidgetClick = () => {
    if (isEditMode) {
      onSelect?.();
    }
  };

  return (
    <>
      <motion.div
        ref={widgetRef}
        data-widget-id={widgetId}
        className={`relative ${className}`}
        variants={widgetVariants}
        initial="idle"
        animate={getAnimationState()}
        whileHover="hover"
        drag={isEditMode}
        dragControls={dragControls}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onContextMenu={handleContextMenu}
        onMouseMove={handleMouseMove}
        onClick={handleWidgetClick}
        layout
        transition={{
          layout: {
            type: 'spring',
            stiffness: 300,
            damping: 30
          }
        }}
      >
        <EditModeOverlay
          isEditMode={isEditMode}
          isDragging={isDragging}
          isResizing={isResizing}
          onContextMenu={handleContextMenu}
        >
          <motion.div
            className="h-full w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              delay: 0.1
            }}
          >
            {children}
          </motion.div>
        </EditModeOverlay>

        {/* Selection indicator */}
        <AnimatePresence>
          {isSelected && isEditMode && (
            <motion.div
              className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25
              }}
            />
          )}
        </AnimatePresence>

        {/* Drag indicator */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25
              }}
            >
              Moving...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resize indicator */}
        <AnimatePresence>
          {isResizing && (
            <motion.div
              className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-medium shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25
              }}
            >
              Resizing...
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu.visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25
            }}
          >
            <WidgetContextMenu
              widgetId={widgetId}
              x={contextMenu.x}
              y={contextMenu.y}
              isVisible={contextMenu.visible}
              isEditMode={isEditMode}
              onClose={() => setContextMenu(prev => ({ ...prev, visible: false }))}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <EditModeTooltip
        isVisible={showTooltip}
        message={tooltipMessage}
        position={mousePosition}
      />
    </>
  );
}

// Enhanced grid container with animations
interface AnimatedGridProps {
  children: React.ReactNode;
  isEditMode: boolean;
  className?: string;
}

export function AnimatedGrid({ children, isEditMode, className = '' }: AnimatedGridProps) {
  return (
    <motion.div
      className={`grid gap-4 lg:gap-6 ${className}`}
      layout
      transition={{
        layout: {
          type: 'spring',
          stiffness: 300,
          damping: 30
        }
      }}
    >
      <AnimatePresence mode="popLayout">
        {children}
      </AnimatePresence>
    </motion.div>
  );
}

// Stagger animation for multiple widgets
export function StaggeredWidgets({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

// Widget entrance animation
export const widgetEntranceVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.9,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30
    }
  }
};
