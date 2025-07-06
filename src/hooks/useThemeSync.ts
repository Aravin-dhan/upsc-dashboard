'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTheme } from 'next-themes';

/**
 * Hook to provide theme functionality with hydration safety
 * Simplified version that relies on next-themes for persistence
 */
export function useThemeSync() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSetTheme = useCallback((newTheme: string) => {
    try {
      setTheme(newTheme);
    } catch (error) {
      console.error('Failed to change theme:', error);
    }
  }, [setTheme]);

  return {
    currentTheme: mounted ? theme : undefined,
    systemTheme: mounted ? systemTheme : undefined,
    resolvedTheme: mounted ? resolvedTheme : undefined,
    mounted,
    setTheme: handleSetTheme
  };
}
