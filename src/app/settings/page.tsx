'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeSync } from '@/hooks/useThemeSync';
import { Save, Moon, Sun, Monitor, Bell, Clock, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { currentTheme: theme, systemTheme, setTheme, mounted: themeMounted } = useThemeSync();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    theme: 'system',
    notifications: true,
    pomodoroMinutes: 25,
    breakMinutes: 5,
    revisionIntervals: [3, 7, 21, 60]
  });

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync theme with next-themes
  useEffect(() => {
    if (mounted && themeMounted && theme) {
      setSettings(prev => ({ ...prev, theme: theme as 'light' | 'dark' | 'system' }));
    }
  }, [theme, mounted, themeMounted]);

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully!');
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setSettings(prev => ({ ...prev, theme: newTheme as 'light' | 'dark' | 'system' }));
    toast.success(`Theme changed to ${newTheme === 'system' ? 'system default' : newTheme} mode!`);
  };

  // Show loading state during hydration
  if (!mounted || !themeMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Customize your UPSC preparation experience
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Appearance */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Appearance
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Theme
                </label>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Light Mode', icon: Sun },
                    { value: 'dark', label: 'Dark Mode', icon: Moon },
                    { value: 'system', label: 'System', icon: Monitor }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => handleThemeChange(value)}
                      className={`flex flex-col items-center justify-center px-4 py-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                        theme === value
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-400'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="h-5 w-5 mb-2" />
                      <span className="text-sm font-semibold">{label}</span>
                      {value === 'system' && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          ({systemTheme === 'dark' ? 'Dark' : 'Light'})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Notifications
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Get reminders for study sessions and revision
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Study Settings */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Study Settings
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="h-4 w-4 mr-2" />
                    Pomodoro Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="60"
                    value={settings.pomodoroMinutes}
                    onChange={(e) => setSettings(prev => ({ ...prev, pomodoroMinutes: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="15"
                    value={settings.breakMinutes}
                    onChange={(e) => setSettings(prev => ({ ...prev, breakMinutes: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Revision Settings */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Revision Settings
            </h2>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Revision Intervals (days)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {settings.revisionIntervals.map((interval, index) => (
                  <input
                    key={index}
                    type="number"
                    min="1"
                    max="365"
                    value={interval}
                    onChange={(e) => {
                      const newIntervals = [...settings.revisionIntervals];
                      newIntervals[index] = parseInt(e.target.value);
                      setSettings(prev => ({ ...prev, revisionIntervals: newIntervals }));
                    }}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Topics will be scheduled for revision after these intervals
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
