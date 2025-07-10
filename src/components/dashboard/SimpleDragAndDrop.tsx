'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Move, GripVertical, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface DraggableItem {
  id: string;
  content: React.ReactNode;
  order: number;
}

interface SimpleDragAndDropProps {
  items: DraggableItem[];
  onReorder: (newOrder: DraggableItem[]) => void;
  className?: string;
  disabled?: boolean;
}

export default function SimpleDragAndDrop({
  items,
  onReorder,
  className = '',
  disabled = false
}: SimpleDragAndDropProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    if (disabled) return;
    
    setDraggedItem(itemId);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', itemId);
    
    // Add visual feedback
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
    setIsDragging(false);
    dragCounter.current = 0;
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, itemId: string) => {
    if (disabled) return;
    e.preventDefault();
    dragCounter.current++;
    setDragOverItem(itemId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (disabled) return;
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverItem(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetItemId: string) => {
    if (disabled) return;
    e.preventDefault();
    
    const draggedItemId = e.dataTransfer.getData('text/html');
    
    if (draggedItemId && draggedItemId !== targetItemId) {
      const newItems = [...items];
      const draggedIndex = newItems.findIndex(item => item.id === draggedItemId);
      const targetIndex = newItems.findIndex(item => item.id === targetItemId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Remove dragged item and insert at target position
        const [draggedItem] = newItems.splice(draggedIndex, 1);
        newItems.splice(targetIndex, 0, draggedItem);
        
        // Update order property
        const reorderedItems = newItems.map((item, index) => ({
          ...item,
          order: index
        }));
        
        onReorder(reorderedItems);
        toast.success('Widget order updated!');
      }
    }
    
    handleDragEnd();
  };

  const moveItem = (itemId: string, direction: 'up' | 'down') => {
    const currentIndex = items.findIndex(item => item.id === itemId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(items.length - 1, currentIndex + 1);
    
    if (newIndex === currentIndex) return;
    
    const newItems = [...items];
    [newItems[currentIndex], newItems[newIndex]] = [newItems[newIndex], newItems[currentIndex]];
    
    // Update order property
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      order: index
    }));
    
    onReorder(reorderedItems);
    toast.success(`Item moved ${direction}!`);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items
        .sort((a, b) => a.order - b.order)
        .map((item, index) => (
          <div
            key={item.id}
            draggable={!disabled}
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, item.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, item.id)}
            className={`
              relative group transition-all duration-200 ease-in-out
              ${!disabled ? 'cursor-move' : 'cursor-default'}
              ${draggedItem === item.id ? 'opacity-50 scale-95 rotate-2' : ''}
              ${dragOverItem === item.id && draggedItem !== item.id ? 'transform scale-105' : ''}
              ${isDragging && draggedItem !== item.id ? 'transition-transform duration-300' : ''}
            `}
          >
            {/* Drop indicator */}
            {dragOverItem === item.id && draggedItem !== item.id && (
              <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full z-10" />
            )}
            
            <div className={`
              relative bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200
              ${dragOverItem === item.id && draggedItem !== item.id 
                ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                : 'border-gray-200 dark:border-gray-700'
              }
              ${!disabled ? 'hover:border-gray-300 dark:hover:border-gray-600' : ''}
            `}>
              {/* Drag handle and controls */}
              {!disabled && (
                <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  {/* Move buttons for keyboard/touch users */}
                  <button
                    onClick={() => moveItem(item.id, 'up')}
                    disabled={index === 0}
                    className="p-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <Move className="h-3 w-3 rotate-180" />
                  </button>
                  
                  <button
                    onClick={() => moveItem(item.id, 'down')}
                    disabled={index === items.length - 1}
                    className="p-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <Move className="h-3 w-3" />
                  </button>
                  
                  {/* Drag handle */}
                  <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded cursor-move">
                    <GripVertical className="h-3 w-3 text-gray-500" />
                  </div>
                </div>
              )}
              
              {/* Drag status indicator */}
              {draggedItem === item.id && (
                <div className="absolute top-2 left-2 flex items-center space-x-1 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                  <Move className="h-3 w-3" />
                  <span>Moving...</span>
                </div>
              )}
              
              {/* Content */}
              <div className={`
                transition-all duration-200
                ${draggedItem === item.id ? 'pointer-events-none' : ''}
              `}>
                {item.content}
              </div>
            </div>
          </div>
        ))}
      
      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Move className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No items to display</p>
        </div>
      )}
      
      {/* Drag instructions */}
      {!disabled && items.length > 1 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          💡 Drag items to reorder, or use the arrow buttons
        </div>
      )}
    </div>
  );
}

// Simple feedback component for successful operations
export function DragDropFeedback({ 
  show, 
  message, 
  type = 'success' 
}: { 
  show: boolean; 
  message: string; 
  type?: 'success' | 'error' 
}) {
  if (!show) return null;
  
  return (
    <div className={`
      fixed top-4 right-4 z-50 flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300
      ${type === 'success' 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
      }
    `}>
      {type === 'success' ? (
        <Check className="h-4 w-4" />
      ) : (
        <X className="h-4 w-4" />
      )}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

// Hook for managing drag and drop state
export function useDragAndDrop<T extends { id: string; order: number }>(
  initialItems: T[]
) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [feedback, setFeedback] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  const reorderItems = (newItems: T[]) => {
    setItems(newItems);
    showFeedback('Items reordered successfully!', 'success');
  };

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => {
      setFeedback(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const moveItem = (itemId: string, direction: 'up' | 'down') => {
    const currentIndex = items.findIndex(item => item.id === itemId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(items.length - 1, currentIndex + 1);
    
    if (newIndex === currentIndex) return;
    
    const newItems = [...items];
    [newItems[currentIndex], newItems[newIndex]] = [newItems[newIndex], newItems[currentIndex]];
    
    // Update order property
    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      order: index
    })) as T[];
    
    setItems(reorderedItems);
    showFeedback(`Item moved ${direction}!`, 'success');
  };

  return {
    items,
    setItems,
    reorderItems,
    moveItem,
    feedback,
    showFeedback
  };
}
