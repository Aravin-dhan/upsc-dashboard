'use client';

import React, { useState } from 'react';
import { 
  Sliders, Grid, Palette, Monitor, Smartphone, Tablet,
  ToggleLeft, ToggleRight, Download, Upload, RotateCcw
} from 'lucide-react';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import toast from 'react-hot-toast';

interface QuickSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickSettings({ isOpen, onClose }: QuickSettingsProps) {
  const {
    layout,
    updateTheme,
    updateGridColumns,
    toggleCompactMode,
    resetLayout,
    exportLayout,
    importLayout
  } = useDashboardLayout();

  const [fileInputKey, setFileInputKey] = useState(0);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importLayout(file);
      setFileInputKey(prev => prev + 1); // Reset file input
    }
  };

  const handleExport = () => {
    exportLayout();
    toast.success('Layout exported successfully!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the dashboard to default layout? This cannot be undone.')) {
      resetLayout();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Quick Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Dashboard Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'default', name: 'Default', icon: Monitor },
                { id: 'compact', name: 'Compact', icon: Smartphone },
                { id: 'spacious', name: 'Spacious', icon: Tablet }
              ].map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => updateTheme(id as any)}
                  className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center space-y-1 ${
                    layout.theme === id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid Columns */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Grid Columns: {layout.gridColumns}
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">6</span>
              <input
                type="range"
                min="6"
                max="12"
                value={layout.gridColumns}
                onChange={(e) => updateGridColumns(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="text-sm text-gray-500">12</span>
            </div>
            <div className="flex justify-center mt-2">
              <Grid className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Compact Mode */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Compact Mode
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Reduce spacing between widgets
                </p>
              </div>
              <button
                onClick={toggleCompactMode}
                className={`p-1 rounded-full transition-colors ${
                  layout.compactMode
                    ? 'text-blue-600 hover:text-blue-700'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {layout.compactMode ? (
                  <ToggleRight className="h-6 w-6" />
                ) : (
                  <ToggleLeft className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Layout Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Layout Management
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              
              <label className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>Import</span>
                <input
                  key={fileInputKey}
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
            
            <button
              onClick={handleReset}
              className="w-full mt-3 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset to Default</span>
            </button>
          </div>

          {/* Layout Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div>Enabled Widgets: {layout.widgets.filter(w => w.enabled).length}</div>
              <div>Last Updated: {new Date(layout.lastUpdated).toLocaleDateString()}</div>
              <div>Theme: {layout.theme}</div>
              <div>Grid: {layout.gridColumns} columns</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
