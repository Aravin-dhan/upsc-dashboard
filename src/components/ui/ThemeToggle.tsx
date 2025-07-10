'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor, Heart } from 'lucide-react';
import { useThemeSync } from '@/hooks/useThemeSync';

export default function ThemeToggle() {
  const { currentTheme: theme, systemTheme, setTheme, mounted } = useThemeSync();
  const [prideMode, setPrideMode] = useState(false);

  // Load pride mode setting
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPrideMode = localStorage.getItem('upsc-pride-mode');
      if (savedPrideMode === 'true') {
        setPrideMode(true);
        document.documentElement.classList.add('pride-theme');
      }
    }
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
    );
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getNextTheme = () => {
    switch (theme) {
      case 'light':
        return 'dark';
      case 'dark':
        return 'system';
      case 'system':
        return 'light';
      default:
        return 'dark';
    }
  };

  const getTooltipText = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to system theme';
      case 'system':
        return `System theme (${systemTheme === 'dark' ? 'Dark' : 'Light'}) - Switch to light mode`;
      default:
        return 'Toggle theme';
    }
  };

  const togglePrideMode = () => {
    const newPrideMode = !prideMode;
    setPrideMode(newPrideMode);

    if (newPrideMode) {
      document.documentElement.classList.add('pride-theme');
      localStorage.setItem('upsc-pride-mode', 'true');
    } else {
      document.documentElement.classList.remove('pride-theme');
      localStorage.setItem('upsc-pride-mode', 'false');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Pride Theme Toggle */}
      <button
        onClick={togglePrideMode}
        className={`relative inline-flex items-center justify-center w-9 h-9 rounded-md border transition-all duration-200 transform hover:scale-105 active:scale-95 ${
          prideMode
            ? 'border-pink-300 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 text-white'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
        title={prideMode ? 'Disable Pride Theme' : 'Enable Pride Theme'}
        aria-label={prideMode ? 'Disable Pride Theme' : 'Enable Pride Theme'}
      >
        <Heart className={`h-4 w-4 ${prideMode ? 'text-white' : ''}`} />
        {prideMode && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        )}
      </button>

      {/* Regular Theme Toggle */}
      <button
        onClick={() => setTheme(getNextTheme())}
        className="relative inline-flex items-center justify-center w-9 h-9 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
        title={getTooltipText()}
        aria-label={getTooltipText()}
      >
        {getIcon()}
        {theme === 'system' && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        )}
      </button>
    </div>
  );
}
