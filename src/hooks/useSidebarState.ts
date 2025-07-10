'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  lastError: string | null;
  errorCount: number;
  isEmergencyMode: boolean;
  preferences: {
    autoCollapse: boolean;
    rememberState: boolean;
    showTooltips: boolean;
  };
}

interface SidebarActions {
  toggleCollapse: () => void;
  toggleMobile: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  resetErrors: () => void;
  enterEmergencyMode: () => void;
  exitEmergencyMode: () => void;
  updatePreferences: (preferences: Partial<SidebarState['preferences']>) => void;
  recoverFromError: () => Promise<boolean>;
}

const STORAGE_KEY = 'upsc-sidebar-state';
const ERROR_THRESHOLD = 3;
const RECOVERY_DELAY = 1000;

const DEFAULT_STATE: SidebarState = {
  isCollapsed: false,
  isMobileOpen: false,
  lastError: null,
  errorCount: 0,
  isEmergencyMode: false,
  preferences: {
    autoCollapse: false,
    rememberState: true,
    showTooltips: true,
  },
};

export function useSidebarState(): SidebarState & SidebarActions {
  const [state, setState] = useState<SidebarState>(DEFAULT_STATE);
  const [mounted, setMounted] = useState(false);
  const recoveryTimeoutRef = useRef<NodeJS.Timeout>();
  const errorLogRef = useRef<string[]>([]);

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          setState(prevState => ({
            ...prevState,
            ...parsedState,
            // Reset runtime-only states
            isMobileOpen: false,
            lastError: null,
            isEmergencyMode: false,
          }));
        }
      } catch (error) {
        console.error('Error loading sidebar state:', error);
        logError('Failed to load sidebar state from localStorage');
      } finally {
        setMounted(true);
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (mounted && state.preferences.rememberState) {
      try {
        const stateToSave = {
          ...state,
          // Don't persist runtime-only states
          isMobileOpen: false,
          lastError: null,
          isEmergencyMode: false,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (error) {
        console.error('Error saving sidebar state:', error);
        logError('Failed to save sidebar state to localStorage');
      }
    }
  }, [state, mounted]);

  // Auto-collapse on mobile when screen size changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        if (window.innerWidth >= 1024 && state.isMobileOpen) {
          setState(prev => ({ ...prev, isMobileOpen: false }));
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [state.isMobileOpen]);

  // Error logging function
  const logError = useCallback((error: string) => {
    const timestamp = new Date().toISOString();
    const errorEntry = `${timestamp}: ${error}`;
    
    errorLogRef.current.push(errorEntry);
    
    // Keep only last 10 errors
    if (errorLogRef.current.length > 10) {
      errorLogRef.current = errorLogRef.current.slice(-10);
    }

    setState(prev => ({
      ...prev,
      lastError: error,
      errorCount: prev.errorCount + 1,
    }));

    // Enter emergency mode if too many errors
    if (state.errorCount >= ERROR_THRESHOLD) {
      enterEmergencyMode();
    }
  }, [state.errorCount]);

  // Recovery mechanism
  const recoverFromError = useCallback(async (): Promise<boolean> => {
    try {
      // Clear any existing recovery timeout
      if (recoveryTimeoutRef.current) {
        clearTimeout(recoveryTimeoutRef.current);
      }

      // Wait for recovery delay
      await new Promise(resolve => {
        recoveryTimeoutRef.current = setTimeout(resolve, RECOVERY_DELAY);
      });

      // Reset error state
      setState(prev => ({
        ...prev,
        lastError: null,
        isEmergencyMode: false,
      }));

      // Test if sidebar can function normally
      const testElement = document.querySelector('[data-sidebar-test]');
      if (testElement || state.errorCount < ERROR_THRESHOLD) {
        toast.success('Sidebar recovered successfully!', {
          icon: '✅',
          duration: 3000,
        });
        return true;
      }

      throw new Error('Sidebar test failed');
    } catch (error) {
      logError(`Recovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error('Sidebar recovery failed. Emergency mode remains active.', {
        icon: '❌',
        duration: 5000,
      });
      return false;
    }
  }, [state.errorCount, logError]);

  // Action functions
  const toggleCollapse = useCallback(() => {
    setState(prev => ({ ...prev, isCollapsed: !prev.isCollapsed }));
  }, []);

  const toggleMobile = useCallback(() => {
    setState(prev => ({ ...prev, isMobileOpen: !prev.isMobileOpen }));
  }, []);

  const setCollapsed = useCallback((collapsed: boolean) => {
    setState(prev => ({ ...prev, isCollapsed: collapsed }));
  }, []);

  const setMobileOpen = useCallback((open: boolean) => {
    setState(prev => ({ ...prev, isMobileOpen: open }));
  }, []);

  const resetErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      lastError: null,
      errorCount: 0,
      isEmergencyMode: false,
    }));
    errorLogRef.current = [];
    toast.success('Sidebar errors cleared', {
      icon: '🔄',
      duration: 2000,
    });
  }, []);

  const enterEmergencyMode = useCallback(() => {
    setState(prev => ({ ...prev, isEmergencyMode: true }));
    toast.error('Sidebar entered emergency mode due to repeated errors', {
      icon: '🚨',
      duration: 8000,
    });
  }, []);

  const exitEmergencyMode = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isEmergencyMode: false,
      errorCount: 0,
      lastError: null,
    }));
    toast.success('Emergency mode disabled', {
      icon: '✅',
      duration: 3000,
    });
  }, []);

  const updatePreferences = useCallback((newPreferences: Partial<SidebarState['preferences']>) => {
    setState(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...newPreferences },
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recoveryTimeoutRef.current) {
        clearTimeout(recoveryTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    toggleCollapse,
    toggleMobile,
    setCollapsed,
    setMobileOpen,
    resetErrors,
    enterEmergencyMode,
    exitEmergencyMode,
    updatePreferences,
    recoverFromError,
  };
}

// Hook for sidebar error handling
export function useSidebarErrorHandler() {
  const { lastError, errorCount, isEmergencyMode, recoverFromError, resetErrors } = useSidebarState();

  const handleSidebarError = useCallback((error: Error) => {
    console.error('Sidebar error:', error);
    
    // Log error details
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Store error in session storage for debugging
    try {
      const existingErrors = JSON.parse(sessionStorage.getItem('sidebar-errors') || '[]');
      existingErrors.push(errorDetails);
      sessionStorage.setItem('sidebar-errors', JSON.stringify(existingErrors.slice(-5)));
    } catch (e) {
      console.warn('Failed to store error in session storage:', e);
    }

    // Attempt automatic recovery for certain error types
    if (error.message.includes('hydration') || error.message.includes('render')) {
      setTimeout(() => {
        recoverFromError();
      }, 2000);
    }
  }, [recoverFromError]);

  return {
    lastError,
    errorCount,
    isEmergencyMode,
    handleSidebarError,
    recoverFromError,
    resetErrors,
  };
}
