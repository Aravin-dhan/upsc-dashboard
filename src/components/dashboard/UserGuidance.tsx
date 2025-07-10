'use client';

import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Lightbulb,
  Mouse,
  Keyboard,
  Smartphone,
  Eye,
  Move,
  Maximize2,
  Trash2,
  Save,
  RotateCcw
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  target?: string;
  action?: string;
}

interface UserGuidanceProps {
  isEditMode: boolean;
  onClose?: () => void;
}

export function OnboardingTour({ isEditMode, onClose }: UserGuidanceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Dashboard Customization!',
      description: 'Learn how to personalize your UPSC Dashboard to match your study preferences.',
      icon: <Lightbulb className="h-6 w-6" />,
    },
    {
      id: 'edit-mode',
      title: 'Enter Edit Mode',
      description: 'Click the "Customize" button or press Ctrl+E to enter edit mode and start customizing your dashboard.',
      icon: <Eye className="h-6 w-6" />,
      action: 'Press Ctrl+E or click Customize button'
    },
    {
      id: 'drag-drop',
      title: 'Drag & Drop Widgets',
      description: 'In edit mode, drag widgets to reorder them. Widgets will show dotted borders and drag handles.',
      icon: <Move className="h-6 w-6" />,
      action: 'Drag widgets to reorder'
    },
    {
      id: 'right-click',
      title: 'Right-Click for Options',
      description: 'Right-click on any widget to access quick options like resize, move, and remove.',
      icon: <Mouse className="h-6 w-6" />,
      action: 'Right-click on widgets'
    },
    {
      id: 'resize',
      title: 'Resize Widgets',
      description: 'Use corner handles or right-click menu to resize widgets to small, medium, or large sizes.',
      icon: <Maximize2 className="h-6 w-6" />,
      action: 'Use corner handles or right-click'
    },
    {
      id: 'keyboard',
      title: 'Keyboard Shortcuts',
      description: 'Use keyboard shortcuts for quick actions: Arrow keys to move, 1/2/3 to resize, Delete to remove.',
      icon: <Keyboard className="h-6 w-6" />,
      action: 'Press ? to see all shortcuts'
    },
    {
      id: 'mobile',
      title: 'Mobile Gestures',
      description: 'On mobile: Double-tap to toggle edit mode, swipe to move widgets, long-press for options.',
      icon: <Smartphone className="h-6 w-6" />,
      action: 'Double-tap or swipe gestures'
    },
    {
      id: 'save',
      title: 'Save Your Changes',
      description: 'Your changes are saved automatically, or press Ctrl+S to save manually.',
      icon: <Save className="h-6 w-6" />,
      action: 'Changes save automatically'
    }
  ];

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('dashboard-onboarding-seen');
    if (!hasSeenOnboarding) {
      setIsVisible(true);
    } else {
      setHasSeenTour(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('dashboard-onboarding-seen', 'true');
    setIsVisible(false);
    setHasSeenTour(true);
    onClose?.();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  const currentStepData = onboardingSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              {currentStepData.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentStepData.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Step {currentStep + 1} of {onboardingSteps.length}
              </p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {currentStepData.description}
          </p>
          
          {currentStepData.action && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                Try it: {currentStepData.action}
              </p>
            </div>
          )}

          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex space-x-2">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Skip Tour
            </button>
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>{currentStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}</span>
              {currentStep < onboardingSteps.length - 1 && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface HelpModalProps {
  isVisible: boolean;
  onClose: () => void;
  shortcuts: any[];
  formatShortcut: (shortcut: any) => string;
}

export function HelpModal({ isVisible, onClose, shortcuts, formatShortcut }: HelpModalProps) {
  if (!isVisible) return null;

  const shortcutCategories = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Dashboard Customization Help
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Quick Tips */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Quick Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Mouse className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800 dark:text-blue-300">Mouse</span>
                </div>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Drag widgets to reorder</li>
                  <li>• Right-click for quick options</li>
                  <li>• Use corner handles to resize</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-300">Touch</span>
                </div>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Double-tap to toggle edit mode</li>
                  <li>• Swipe to move widgets</li>
                  <li>• Long-press for options</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Keyboard Shortcuts
            </h3>
            <div className="space-y-4">
              {Object.entries(shortcutCategories).map(([category, categoryShortcuts]) => (
                <div key={category}>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {categoryShortcuts.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {shortcut.description}
                        </span>
                        <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs rounded font-mono">
                          {formatShortcut(shortcut)}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({ content, children, position = 'top', delay = 500 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900 border-t-4 border-x-transparent border-x-4',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900 border-b-4 border-x-transparent border-x-4',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900 border-l-4 border-y-transparent border-y-4',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900 border-r-4 border-y-transparent border-y-4'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-50 ${positionClasses[position]}`}>
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            {content}
          </div>
          <div className={`absolute ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
}

export default { OnboardingTour, HelpModal, Tooltip };
