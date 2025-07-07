'use client';

import { useState, useEffect } from 'react';
import { Clock, Target, CheckCircle, Play, Pause, RotateCcw, Save, Plus, Edit3, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useDailyGoals, useDashboardData } from '@/hooks/useDataSync';

interface CountdownTimerProps {
  targetDate: Date;
  label: string;
}

function CountdownTimer({ targetDate, label }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    // Update immediately
    updateTimer();

    // Update every 30 seconds instead of every second
    const timer = setInterval(updateTimer, 30000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">{label}</h3>
        <div className="animate-pulse">
          <div className="h-8 bg-blue-200 dark:bg-blue-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
      <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">{label}</h3>
      <div className="flex space-x-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{timeLeft.days}</div>
          <div className="text-xs text-blue-700 dark:text-blue-300">Days</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{timeLeft.hours}</div>
          <div className="text-xs text-blue-700 dark:text-blue-300">Hours</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{timeLeft.minutes}</div>
          <div className="text-xs text-blue-700 dark:text-blue-300">Minutes</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{timeLeft.seconds}</div>
          <div className="text-xs text-blue-700 dark:text-blue-300">Seconds</div>
        </div>
      </div>
    </div>
  );
}

function PomodoroTimer() {
  // Load timer state from localStorage with defaults
  const [minutes, setMinutes] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upsc-pomodoro-minutes');
      return saved ? parseInt(saved) : 25;
    }
    return 25;
  });
  const [seconds, setSeconds] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upsc-pomodoro-seconds');
      return saved ? parseInt(saved) : 0;
    }
    return 0;
  });
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upsc-pomodoro-isbreak');
      return saved === 'true';
    }
    return false;
  });

  // Save timer state to localStorage
  const saveTimerState = (mins: number, secs: number, breakState: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-pomodoro-minutes', mins.toString());
      localStorage.setItem('upsc-pomodoro-seconds', secs.toString());
      localStorage.setItem('upsc-pomodoro-isbreak', breakState.toString());
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          const newSeconds = seconds - 1;
          setSeconds(newSeconds);
          saveTimerState(minutes, newSeconds, isBreak);
        } else if (minutes > 0) {
          const newMinutes = minutes - 1;
          setMinutes(newMinutes);
          setSeconds(59);
          saveTimerState(newMinutes, 59, isBreak);
        } else {
          // Timer finished
          setIsActive(false);
          if (isBreak) {
            const focusMinutes = 25;
            setMinutes(focusMinutes);
            setIsBreak(false);
            setSeconds(0);
            saveTimerState(focusMinutes, 0, false);
            toast.success('🎯 Break finished! Time to focus!', { duration: 3000 });
          } else {
            const breakMinutes = 5;
            setMinutes(breakMinutes);
            setIsBreak(true);
            setSeconds(0);
            saveTimerState(breakMinutes, 0, true);
            toast.success('🎉 Focus session complete! Take a break!', { duration: 3000 });
          }
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, isBreak]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    const newMinutes = isBreak ? 5 : 25;
    setMinutes(newMinutes);
    setSeconds(0);
    saveTimerState(newMinutes, 0, isBreak);
    toast.success('⏰ Timer reset', { duration: 1000 });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {isBreak ? 'Break Time' : 'Focus Time'}
        </h3>
        <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </div>

      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      <div className="flex justify-center space-x-2">
        <button
          onClick={toggleTimer}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button
          onClick={resetTimer}
          className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function CommandCenterContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Use data sync for goals
  const dailyGoalsData = useDailyGoals();
  const { goals, updateGoal, addGoal } = dailyGoalsData;
  const dashboardData = useDashboardData();

  // Goals are now managed by the data sync service

  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [newGoalText, setNewGoalText] = useState('');
  const [showAddGoal, setShowAddGoal] = useState(false);

  // Goals are now managed by the data sync service

  const toggleGoal = (id: string) => {
    const goal: any = (goals || []).find((g: any) => g.id === id);
    if (goal) {
      updateGoal(id, !goal.completed);
      toast.success(
        !goal.completed
          ? `✅ Goal completed: "${goal.text}"`
          : `🔄 Goal reopened: "${goal.text}"`,
        { duration: 2000 }
      );
    }
  };

  const handleAddGoal = () => {
    if (newGoalText.trim()) {
      addGoal(newGoalText.trim());
      setNewGoalText('');
      setShowAddGoal(false);
      toast.success(`📝 New goal added: "${newGoalText.trim()}"`, { duration: 2000 });
    }
  };

  const editGoal = (id: string, newText: string) => {
    if (newText.trim()) {
      // For now, we'll just show a message since the data sync service doesn't have an edit function
      // In a full implementation, you'd add an editGoal function to the data sync service
      setEditingGoal(null);
      toast.success(`📝 Goal editing coming soon: "${newText.trim()}"`, { duration: 2000 });
    }
  };

  // Get exam dates with fallback
  const prelimsDate = new Date('2027-06-06');
  const mainsDate = new Date('2027-09-18');

  // Show loading state if profile is loading
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Command Center</h2>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-xs text-green-600 dark:text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
            Auto-saving
          </div>
          <Target className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      {/* Countdown Timers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <CountdownTimer targetDate={prelimsDate} label="Prelims 2027" />
        <CountdownTimer targetDate={mainsDate} label="Mains 2027" />
      </div>

      {/* Today's Goals */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Goals</h3>
          <button
            onClick={() => setShowAddGoal(true)}
            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Goal
          </button>
        </div>

        <div className="space-y-3">
          {(goals || []).map((goal: any) => (
            <div key={goal.id} className="flex items-center space-x-3 group">
              <button
                onClick={() => toggleGoal(goal.id)}
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95 ${
                  goal.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 hover:border-green-400 dark:border-gray-600 dark:hover:border-green-400'
                }`}
              >
                {goal.completed && <CheckCircle className="h-3 w-3" />}
              </button>

              {editingGoal === goal.id ? (
                <div className="flex-1 flex space-x-2">
                  <input
                    type="text"
                    defaultValue={goal.text}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        editGoal(goal.id, e.currentTarget.value);
                      } else if (e.key === 'Escape') {
                        setEditingGoal(null);
                      }
                    }}
                    onBlur={(e) => editGoal(goal.id, e.target.value)}
                    autoFocus
                  />
                </div>
              ) : (
                <>
                  <span className={`flex-1 ${goal.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                    {goal.text}
                  </span>
                  <button
                    onClick={() => setEditingGoal(goal.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 transition-all"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                </>
              )}
            </div>
          ))}

          {/* Add new goal input */}
          {showAddGoal && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="Enter your new goal..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddGoal();
                  } else if (e.key === 'Escape') {
                    setShowAddGoal(false);
                    setNewGoalText('');
                  }
                }}
                autoFocus
              />
              <button
                onClick={handleAddGoal}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setShowAddGoal(false);
                  setNewGoalText('');
                }}
                className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => router.push('/practice')}
            className="flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Target className="h-4 w-4 mr-2" />
            Practice
          </button>
          <button
            onClick={() => router.push('/current-affairs')}
            className="flex items-center justify-center p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <Clock className="h-4 w-4 mr-2" />
            News
          </button>
          <button
            onClick={() => router.push('/knowledge-base')}
            className="flex items-center justify-center p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Notes
          </button>
          <button
            onClick={() => router.push('/revision')}
            className="flex items-center justify-center p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Revision
          </button>
        </div>
      </div>

      {/* Pomodoro Timer */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Focus Timer</h3>
        <PomodoroTimer />
      </div>
    </div>
  );
}

export default function CommandCenter() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return <CommandCenterContent />;
}
