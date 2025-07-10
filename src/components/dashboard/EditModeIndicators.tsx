'use client';

import React from 'react';
import { 
  Edit3, 
  Move, 
  Maximize2, 
  RotateCcw,
  Save,
  X,
  Info
} from 'lucide-react';

interface EditModeHeaderProps {
  isEditMode: boolean;
  onExitEditMode: () => void;
  onSaveLayout: () => void;
  onResetLayout: () => void;
}

export function EditModeHeader({ 
  isEditMode, 
  onExitEditMode, 
  onSaveLayout, 
  onResetLayout 
}: EditModeHeaderProps) {
  if (!isEditMode) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Edit3 className="h-5 w-5 animate-pulse" />
            <span className="font-semibold">Edit Mode Active</span>
          </div>
          <div className="hidden md:flex items-center space-x-1 text-sm opacity-90">
            <Info className="h-4 w-4" />
            <span>Drag widgets to reorder • Right-click for options • Resize with corner handles</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onSaveLayout}
            className="flex items-center space-x-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md transition-colors text-sm"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save</span>
          </button>
          
          <button
            onClick={onResetLayout}
            className="flex items-center space-x-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md transition-colors text-sm"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          
          <button
            onClick={onExitEditMode}
            className="flex items-center space-x-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded-md transition-colors text-sm"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface ResizeHandlesProps {
  isEditMode: boolean;
  onResize?: (direction: string) => void;
}

export function ResizeHandles({ isEditMode, onResize }: ResizeHandlesProps) {
  if (!isEditMode) return null;

  const handlePositions = [
    { position: 'top-left', cursor: 'nw-resize', classes: '-top-1 -left-1' },
    { position: 'top-right', cursor: 'ne-resize', classes: '-top-1 -right-1' },
    { position: 'bottom-left', cursor: 'sw-resize', classes: '-bottom-1 -left-1' },
    { position: 'bottom-right', cursor: 'se-resize', classes: '-bottom-1 -right-1' },
    { position: 'top', cursor: 'n-resize', classes: '-top-1 left-1/2 transform -translate-x-1/2' },
    { position: 'bottom', cursor: 's-resize', classes: '-bottom-1 left-1/2 transform -translate-x-1/2' },
    { position: 'left', cursor: 'w-resize', classes: '-left-1 top-1/2 transform -translate-y-1/2' },
    { position: 'right', cursor: 'e-resize', classes: '-right-1 top-1/2 transform -translate-y-1/2' }
  ];

  return (
    <>
      {handlePositions.map((handle) => (
        <div
          key={handle.position}
          className={`absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${handle.classes}`}
          style={{ cursor: handle.cursor }}
          onClick={(e) => {
            e.stopPropagation();
            onResize?.(handle.position);
          }}
        />
      ))}
    </>
  );
}

interface DragIndicatorProps {
  isEditMode: boolean;
  isDragging?: boolean;
}

export function DragIndicator({ isEditMode, isDragging }: DragIndicatorProps) {
  if (!isEditMode) return null;

  return (
    <div className={`absolute top-2 right-2 z-10 transition-all duration-200 ${
      isDragging ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'
    }`}>
      <div className="flex items-center space-x-1 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-medium shadow-lg">
        <Move className="h-3 w-3" />
        <span>Drag</span>
      </div>
    </div>
  );
}

interface EditModeOverlayProps {
  isEditMode: boolean;
  children: React.ReactNode;
  className?: string;
  onContextMenu?: (e: React.MouseEvent) => void;
  isDragging?: boolean;
  isResizing?: boolean;
}

export function EditModeOverlay({ 
  isEditMode, 
  children, 
  className = '',
  onContextMenu,
  isDragging = false,
  isResizing = false
}: EditModeOverlayProps) {
  const editModeClasses = isEditMode ? `
    relative group cursor-move
    border-2 border-dashed border-blue-300 dark:border-blue-500
    hover:border-blue-500 dark:hover:border-blue-400
    hover:shadow-lg hover:shadow-blue-500/20
    transition-all duration-200
    ${isDragging ? 'border-blue-500 shadow-lg shadow-blue-500/30 scale-105' : ''}
    ${isResizing ? 'border-purple-500 shadow-lg shadow-purple-500/30' : ''}
  ` : '';

  return (
    <div 
      className={`${editModeClasses} ${className}`}
      onContextMenu={onContextMenu}
      style={{
        cursor: isEditMode ? (isDragging ? 'grabbing' : 'grab') : 'default'
      }}
    >
      {children}
      
      {isEditMode && (
        <>
          <ResizeHandles isEditMode={isEditMode} />
          <DragIndicator isEditMode={isEditMode} isDragging={isDragging} />
          
          {/* Edit mode overlay */}
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
          
          {/* Corner indicators */}
          <div className="absolute top-1 left-1 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="absolute bottom-1 left-1 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </>
      )}
    </div>
  );
}

interface EditModeTooltipProps {
  isVisible: boolean;
  message: string;
  position?: { x: number; y: number };
}

export function EditModeTooltip({ isVisible, message, position }: EditModeTooltipProps) {
  if (!isVisible) return null;

  return (
    <div
      className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg pointer-events-none"
      style={{
        left: position?.x || 0,
        top: (position?.y || 0) - 40,
        transform: 'translateX(-50%)'
      }}
    >
      {message}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
    </div>
  );
}

// CSS animations for edit mode
export const editModeStyles = `
  @keyframes editModePulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  
  @keyframes editModeGlow {
    0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
    50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
  }
  
  .edit-mode-pulse {
    animation: editModePulse 2s infinite;
  }
  
  .edit-mode-glow {
    animation: editModeGlow 2s infinite;
  }
  
  .edit-mode-widget {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .edit-mode-widget:hover {
    transform: translateY(-2px);
  }
  
  .edit-mode-dragging {
    transform: rotate(2deg) scale(1.05);
    z-index: 1000;
  }
  
  .edit-mode-drop-zone {
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.1) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(59, 130, 246, 0.1) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, rgba(59, 130, 246, 0.1) 75%),
                linear-gradient(-45deg, transparent 75%, rgba(59, 130, 246, 0.1) 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    border: 2px dashed #3b82f6;
    animation: editModePulse 1s infinite;
  }
`;

export default EditModeOverlay;
