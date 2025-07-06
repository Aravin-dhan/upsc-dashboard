'use client';

import { useState, useEffect } from 'react';
import {
  Heart, Zap, Moon, Smile, TrendingUp, Play, Pause,
  RotateCcw, Plus, Minus, Clock, Brain, Activity,
  Coffee, Target, AlertCircle, CheckCircle, Timer,
  BarChart3, Calendar, Settings, BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';

interface WellnessData {
  sleep: number;
  exercise: number;
  meditation: number;
  mood: number;
  stress: number;
  waterIntake: number;
  studyBreaks: number;
  pomodoroSessions: number;
  date: string;
}

interface PomodoroState {
  isRunning: boolean;
  timeLeft: number;
  currentSession: 'work' | 'break';
  sessionsCompleted: number;
}

export default function WellnessCorner() {
  const [wellnessData, setWellnessData] = useState<WellnessData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upsc-wellness-data');
      if (saved) {
        const data = JSON.parse(saved);
        const today = new Date().toISOString().split('T')[0];
        if (data.date === today) {
          return data;
        }
      }
    }
    return {
      sleep: 0,
      exercise: 0,
      meditation: 0,
      mood: 3,
      stress: 3,
      waterIntake: 0,
      studyBreaks: 0,
      pomodoroSessions: 0,
      date: new Date().toISOString().split('T')[0]
    };
  });

  const [pomodoroState, setPomodoroState] = useState<PomodoroState>({
    isRunning: false,
    timeLeft: 25 * 60, // 25 minutes in seconds
    currentSession: 'work',
    sessionsCompleted: 0
  });

  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'pomodoro' | 'tracking' | 'tips'>('overview');

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('upsc-wellness-data', JSON.stringify(wellnessData));
  }, [wellnessData]);

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (pomodoroState.isRunning && pomodoroState.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoroState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (pomodoroState.timeLeft === 0) {
      // Session completed
      if (pomodoroState.currentSession === 'work') {
        toast.success('Work session completed! Time for a break.');
        setPomodoroState(prev => ({
          ...prev,
          timeLeft: 5 * 60, // 5 minute break
          currentSession: 'break',
          sessionsCompleted: prev.sessionsCompleted + 1,
          isRunning: false
        }));

        // Update wellness data
        setWellnessData(prev => ({
          ...prev,
          pomodoroSessions: prev.pomodoroSessions + 1
        }));
      } else {
        toast.success('Break completed! Ready for another work session?');
        setPomodoroState(prev => ({
          ...prev,
          timeLeft: 25 * 60, // 25 minute work session
          currentSession: 'work',
          isRunning: false
        }));

        setWellnessData(prev => ({
          ...prev,
          studyBreaks: prev.studyBreaks + 1
        }));
      }
    }

    return () => clearInterval(interval);
  }, [pomodoroState.isRunning, pomodoroState.timeLeft, pomodoroState.currentSession]);

  const updateWellnessData = (field: keyof WellnessData, value: number) => {
    setWellnessData(prev => ({
      ...prev,
      [field]: Math.max(0, value)
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMoodEmoji = (rating: number) => {
    if (rating >= 4) return '😊';
    if (rating >= 3) return '😐';
    return '😔';
  };

  const getStressColor = (level: number) => {
    if (level <= 2) return 'text-green-600 bg-green-50';
    if (level <= 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { key: 'overview', label: 'Overview', icon: Heart },
            { key: 'pomodoro', label: 'Pomodoro', icon: Timer },
            { key: 'tracking', label: 'Tracking', icon: BarChart3 },
            { key: 'tips', label: 'Tips', icon: BookOpen }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Sleep */}
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Moon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">{wellnessData.sleep}h</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">Sleep</div>
                  <div className="flex items-center justify-center mt-2 space-x-1">
                    <button
                      onClick={() => updateWellnessData('sleep', wellnessData.sleep - 0.5)}
                      className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800 rounded"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => updateWellnessData('sleep', wellnessData.sleep + 0.5)}
                      className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800 rounded"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Exercise */}
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Zap className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900 dark:text-green-200">{wellnessData.exercise}m</div>
                  <div className="text-xs text-green-600 dark:text-green-400">Exercise</div>
                  <div className="flex items-center justify-center mt-2 space-x-1">
                    <button
                      onClick={() => updateWellnessData('exercise', wellnessData.exercise - 15)}
                      className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-800 rounded"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => updateWellnessData('exercise', wellnessData.exercise + 15)}
                      className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-800 rounded"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Water Intake */}
                <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                  <div className="text-2xl mb-2">💧</div>
                  <div className="text-2xl font-bold text-cyan-900 dark:text-cyan-200">{wellnessData.waterIntake}</div>
                  <div className="text-xs text-cyan-600 dark:text-cyan-400">Glasses</div>
                  <div className="flex items-center justify-center mt-2 space-x-1">
                    <button
                      onClick={() => updateWellnessData('waterIntake', wellnessData.waterIntake - 1)}
                      className="p-1 text-cyan-600 hover:bg-cyan-100 dark:hover:bg-cyan-800 rounded"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => updateWellnessData('waterIntake', wellnessData.waterIntake + 1)}
                      className="p-1 text-cyan-600 hover:bg-cyan-100 dark:hover:bg-cyan-800 rounded"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Pomodoro Sessions */}
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Timer className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">{wellnessData.pomodoroSessions}</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">Pomodoros</div>
                </div>
              </div>

              {/* Mood and Stress Tracking */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-900 dark:text-yellow-200 mb-3 flex items-center">
                    <Smile className="h-4 w-4 mr-2" />
                    Mood Level
                  </h3>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => updateWellnessData('mood', level)}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          wellnessData.mood >= level
                            ? 'bg-yellow-400 border-yellow-500'
                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {level <= wellnessData.mood && '😊'}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                    Current: {getMoodEmoji(wellnessData.mood)} ({wellnessData.mood}/5)
                  </p>
                </div>

                <div className={`rounded-lg p-4 ${getStressColor(wellnessData.stress)}`}>
                  <h3 className="font-medium mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Stress Level
                  </h3>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => updateWellnessData('stress', level)}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          wellnessData.stress >= level
                            ? 'bg-red-400 border-red-500'
                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {level <= wellnessData.stress && '😰'}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm mt-2">
                    Current: {wellnessData.stress}/5 {wellnessData.stress <= 2 ? '(Low)' : wellnessData.stress <= 3 ? '(Moderate)' : '(High)'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pomodoro Tab */}
          {activeTab === 'pomodoro' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-full w-48 h-48 mx-auto flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-mono font-bold">
                      {formatTime(pomodoroState.timeLeft)}
                    </div>
                    <div className="text-sm opacity-90 mt-2">
                      {pomodoroState.currentSession === 'work' ? 'Work Session' : 'Break Time'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4 mb-6">
                  <button
                    onClick={() => setPomodoroState(prev => ({ ...prev, isRunning: !prev.isRunning }))}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                      pomodoroState.isRunning
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {pomodoroState.isRunning ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setPomodoroState(prev => ({
                      ...prev,
                      isRunning: false,
                      timeLeft: prev.currentSession === 'work' ? 25 * 60 : 5 * 60
                    }))}
                    className="flex items-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{pomodoroState.sessionsCompleted}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Sessions Today</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{wellnessData.studyBreaks}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Breaks Taken</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
