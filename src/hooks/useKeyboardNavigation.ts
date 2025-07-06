import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface KeyboardNavigationContext {
  currentIndex: number;
  totalItems: number;
  onNext: () => void;
  onPrevious: () => void;
  onSelect: () => void;
  onCancel: () => void;
  onEscape: () => void;
  isModalOpen?: boolean;
  isFormActive?: boolean;
  canNavigate?: boolean;
}

interface UseKeyboardNavigationProps {
  context: KeyboardNavigationContext;
  enabled?: boolean;
  preventDefault?: boolean;
}

export function useKeyboardNavigation({
  context,
  enabled = true,
  preventDefault = true
}: UseKeyboardNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled || !context.canNavigate) return;

    // Don't interfere with form inputs unless specifically handling them
    const target = event.target as HTMLElement;
    const isInputElement = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true';

    switch (event.key) {
      case 'Enter':
        if (preventDefault) event.preventDefault();
        
        if (context.isFormActive && isInputElement) {
          // Let form handle Enter in input fields
          return;
        }
        
        // Navigate to next item or select current item
        if (event.shiftKey) {
          context.onPrevious();
        } else {
          if (context.currentIndex >= 0 && context.currentIndex < context.totalItems) {
            context.onSelect();
          } else {
            context.onNext();
          }
        }
        break;

      case 'Escape':
        if (preventDefault) event.preventDefault();
        
        if (context.isModalOpen) {
          context.onCancel();
        } else if (context.isFormActive) {
          context.onCancel();
        } else {
          context.onEscape();
        }
        break;

      case 'ArrowDown':
        if (!isInputElement) {
          if (preventDefault) event.preventDefault();
          context.onNext();
        }
        break;

      case 'ArrowUp':
        if (!isInputElement) {
          if (preventDefault) event.preventDefault();
          context.onPrevious();
        }
        break;

      case 'Tab':
        // Let default tab behavior work, but track navigation
        if (event.shiftKey) {
          context.onPrevious();
        } else {
          context.onNext();
        }
        break;

      default:
        break;
    }
  }, [context, enabled, preventDefault]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, enabled]);

  return {
    handleKeyDown
  };
}

// Hook for practice questions navigation
export function usePracticeKeyboardNavigation(
  currentQuestionIndex: number,
  totalQuestions: number,
  onNextQuestion: () => void,
  onPreviousQuestion: () => void,
  onSubmitAnswer: () => void,
  onExitPractice: () => void,
  enabled: boolean = true
) {
  const context: KeyboardNavigationContext = {
    currentIndex: currentQuestionIndex,
    totalItems: totalQuestions,
    onNext: onNextQuestion,
    onPrevious: onPreviousQuestion,
    onSelect: onSubmitAnswer,
    onCancel: onExitPractice,
    onEscape: onExitPractice,
    canNavigate: enabled
  };

  return useKeyboardNavigation({ context, enabled });
}

// Hook for modal navigation
export function useModalKeyboardNavigation(
  isOpen: boolean,
  onClose: () => void,
  onConfirm?: () => void,
  enabled: boolean = true
) {
  const context: KeyboardNavigationContext = {
    currentIndex: 0,
    totalItems: 1,
    onNext: () => {},
    onPrevious: () => {},
    onSelect: onConfirm || onClose,
    onCancel: onClose,
    onEscape: onClose,
    isModalOpen: isOpen,
    canNavigate: enabled && isOpen
  };

  return useKeyboardNavigation({ context, enabled: enabled && isOpen });
}

// Hook for form navigation
export function useFormKeyboardNavigation(
  isFormActive: boolean,
  onSubmit: () => void,
  onCancel: () => void,
  enabled: boolean = true
) {
  const context: KeyboardNavigationContext = {
    currentIndex: 0,
    totalItems: 1,
    onNext: () => {},
    onPrevious: () => {},
    onSelect: onSubmit,
    onCancel: onCancel,
    onEscape: onCancel,
    isFormActive: isFormActive,
    canNavigate: enabled && isFormActive
  };

  return useKeyboardNavigation({ context, enabled: enabled && isFormActive });
}

// Hook for list navigation (like revision items, notes, etc.)
export function useListKeyboardNavigation(
  items: any[],
  selectedIndex: number,
  onSelectItem: (index: number) => void,
  onItemAction: (item: any, index: number) => void,
  onEscape: () => void,
  enabled: boolean = true
) {
  const context: KeyboardNavigationContext = {
    currentIndex: selectedIndex,
    totalItems: items.length,
    onNext: () => {
      const nextIndex = Math.min(selectedIndex + 1, items.length - 1);
      onSelectItem(nextIndex);
    },
    onPrevious: () => {
      const prevIndex = Math.max(selectedIndex - 1, 0);
      onSelectItem(prevIndex);
    },
    onSelect: () => {
      if (selectedIndex >= 0 && selectedIndex < items.length) {
        onItemAction(items[selectedIndex], selectedIndex);
      }
    },
    onCancel: onEscape,
    onEscape: onEscape,
    canNavigate: enabled
  };

  return useKeyboardNavigation({ context, enabled });
}

// Hook for knowledge base navigation
export function useKnowledgeBaseKeyboardNavigation(
  notes: any[],
  selectedNoteIndex: number,
  isEditing: boolean,
  onSelectNote: (index: number) => void,
  onEditNote: (note: any) => void,
  onCancelEdit: () => void,
  onSaveNote: () => void,
  enabled: boolean = true
) {
  const context: KeyboardNavigationContext = {
    currentIndex: selectedNoteIndex,
    totalItems: notes.length,
    onNext: () => {
      if (!isEditing) {
        const nextIndex = Math.min(selectedNoteIndex + 1, notes.length - 1);
        onSelectNote(nextIndex);
      }
    },
    onPrevious: () => {
      if (!isEditing) {
        const prevIndex = Math.max(selectedNoteIndex - 1, 0);
        onSelectNote(prevIndex);
      }
    },
    onSelect: () => {
      if (isEditing) {
        onSaveNote();
      } else if (selectedNoteIndex >= 0 && selectedNoteIndex < notes.length) {
        onEditNote(notes[selectedNoteIndex]);
      }
    },
    onCancel: () => {
      if (isEditing) {
        onCancelEdit();
      }
    },
    onEscape: () => {
      if (isEditing) {
        onCancelEdit();
      }
    },
    isFormActive: isEditing,
    canNavigate: enabled
  };

  return useKeyboardNavigation({ context, enabled });
}

// Hook for revision item navigation
export function useRevisionKeyboardNavigation(
  revisionItems: any[],
  currentItemIndex: number,
  isAddingItem: boolean,
  onSelectItem: (index: number) => void,
  onStartRevision: (item: any) => void,
  onCancelAdd: () => void,
  onSaveItem: () => void,
  enabled: boolean = true
) {
  const context: KeyboardNavigationContext = {
    currentIndex: currentItemIndex,
    totalItems: revisionItems.length,
    onNext: () => {
      if (!isAddingItem) {
        const nextIndex = Math.min(currentItemIndex + 1, revisionItems.length - 1);
        onSelectItem(nextIndex);
      }
    },
    onPrevious: () => {
      if (!isAddingItem) {
        const prevIndex = Math.max(currentItemIndex - 1, 0);
        onSelectItem(prevIndex);
      }
    },
    onSelect: () => {
      if (isAddingItem) {
        onSaveItem();
      } else if (currentItemIndex >= 0 && currentItemIndex < revisionItems.length) {
        onStartRevision(revisionItems[currentItemIndex]);
      }
    },
    onCancel: () => {
      if (isAddingItem) {
        onCancelAdd();
      }
    },
    onEscape: () => {
      if (isAddingItem) {
        onCancelAdd();
      }
    },
    isFormActive: isAddingItem,
    canNavigate: enabled
  };

  return useKeyboardNavigation({ context, enabled });
}

// Global keyboard shortcuts for the entire app
export function useGlobalKeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      // Only handle global shortcuts when not in input fields
      const target = event.target as HTMLElement;
      const isInputElement = target.tagName === 'INPUT' || 
                            target.tagName === 'TEXTAREA' || 
                            target.contentEditable === 'true';

      if (isInputElement) return;

      // Global shortcuts with Ctrl/Cmd key
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'k':
            event.preventDefault();
            // Open search/command palette
            break;
          case '/':
            event.preventDefault();
            // Focus search
            break;
          case 'h':
            event.preventDefault();
            router.push('/');
            break;
          case 'p':
            event.preventDefault();
            router.push('/practice');
            break;
          case 'r':
            event.preventDefault();
            router.push('/revision');
            break;
          case 'n':
            event.preventDefault();
            router.push('/current-affairs');
            break;
          default:
            break;
        }
      }

      // Global shortcuts without modifier keys
      switch (event.key) {
        case '?':
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            // Show help/shortcuts modal
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [router, pathname]);
}

export default useKeyboardNavigation;
