'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show minimal loading state during hydration to prevent flash
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900" suppressHydrationWarning>
        {children}
      </div>
    );
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
