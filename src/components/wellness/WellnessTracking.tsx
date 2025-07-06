'use client';

import { useState, useEffect } from 'react';
import {
  Heart, Moon, Activity, Brain, Droplets, Coffee, 
  Clock, Plus, Minus, TrendingUp, Calendar, Eye,
  Target, CheckCircle, AlertCircle, BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

interface WellnessMetric {
  id: string;
  name: string;
  icon: any;
  value: number;
  target: number;
  unit: string;
  color: string;
  description: string;
}

interface DailyWellnessData {
  date: string;
  sleep: number;
  exercise: number;
  meditation: number;
  waterIntake: number;
  studyHours: number;
  breaks: number;
  mood: number;
  stress: number;
  eyeRest: number;
  posture: number;
}

export default function WellnessTracking() {
  const [todayData, setTodayData] = useState<DailyWellnessData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upsc-wellness-tracking');
      if (saved) {
        const data = JSON.parse(saved);
        const today = new Date().toISOString().split('T')[0];
        if (data.date === today) {
          return data;
        }
      }
    }
    return {
      date: new Date().toISOString().split('T')[0],
      sleep: 0,
      exercise: 0,
      meditation: 0,
      waterIntake: 0,
      studyHours: 0,
      breaks: 0,
      mood: 5,
      stress: 5,
      eyeRest: 0,
      posture: 5
    };
  });

  const [weeklyData, setWeeklyData] = useState<DailyWellnessData[]>([]);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    // Load weekly data
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upsc-wellness-weekly');
      if (saved) {
        setWeeklyData(JSON.parse(saved));
      }
    }
  }, []);

  const saveData = (newData: DailyWellnessData) => {
    setTodayData(newData);
    localStorage.setItem('upsc-wellness-tracking', JSON.stringify(newData));
    
    // Update weekly data
    const updatedWeekly = [...weeklyData];
    const existingIndex = updatedWeekly.findIndex(d => d.date === newData.date);
    
    if (existingIndex >= 0) {
      updatedWeekly[existingIndex] = newData;
    } else {
      updatedWeekly.push(newData);
    }
    
    // Keep only last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const filteredData = updatedWeekly.filter(d => new Date(d.date) >= thirtyDaysAgo);
    
    setWeeklyData(filteredData);
    localStorage.setItem('upsc-wellness-weekly', JSON.stringify(filteredData));
    
    toast.success('Wellness data updated!');
  };

  const updateMetric = (key: keyof DailyWellnessData, value: number) => {
    const newData = { ...todayData, [key]: Math.max(0, value) };
    saveData(newData);
  };

  const wellnessMetrics: WellnessMetric[] = [
    {
      id: 'sleep',
      name: 'Sleep',
      icon: Moon,
      value: todayData.sleep,
      target: 8,
      unit: 'hours',
      color: 'blue',
      description: 'Quality sleep is crucial for memory consolidation and cognitive performance'
    },
    {
      id: 'exercise',
      name: 'Exercise',
      icon: Activity,
      value: todayData.exercise,
      target: 60,
      unit: 'minutes',
      color: 'green',
      description: 'Regular exercise improves focus, reduces stress, and boosts energy levels'
    },
    {
      id: 'meditation',
      name: 'Meditation',
      icon: Brain,
      value: todayData.meditation,
      target: 20,
      unit: 'minutes',
      color: 'purple',
      description: 'Meditation enhances concentration and reduces anxiety during preparation'
    },
    {
      id: 'waterIntake',
      name: 'Water Intake',
      icon: Droplets,
      value: todayData.waterIntake,
      target: 8,
      unit: 'glasses',
      color: 'cyan',
      description: 'Proper hydration maintains cognitive function and prevents fatigue'
    },
    {
      id: 'studyHours',
      name: 'Study Hours',
      icon: Clock,
      value: todayData.studyHours,
      target: 8,
      unit: 'hours',
      color: 'orange',
      description: 'Track your daily study time for consistent preparation'
    },
    {
      id: 'breaks',
      name: 'Study Breaks',
      icon: Coffee,
      value: todayData.breaks,
      target: 6,
      unit: 'breaks',
      color: 'yellow',
      description: 'Regular breaks prevent burnout and maintain productivity'
    },
    {
      id: 'eyeRest',
      name: 'Eye Rest',
      icon: Eye,
      value: todayData.eyeRest,
      target: 12,
      unit: 'times',
      color: 'indigo',
      description: 'Follow 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds'
    }
  ];

  const moodStressMetrics = [
    {
      id: 'mood',
      name: 'Mood',
      value: todayData.mood,
      icon: Heart,
      color: 'pink',
      description: 'Rate your overall mood today (1-10)'
    },
    {
      id: 'stress',
      name: 'Stress Level',
      value: todayData.stress,
      icon: AlertCircle,
      color: 'red',
      description: 'Rate your stress level today (1-10, lower is better)'
    },
    {
      id: 'posture',
      name: 'Posture Awareness',
      value: todayData.posture,
      icon: Target,
      color: 'teal',
      description: 'Rate how well you maintained good posture today (1-10)'
    }
  ];

  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getOverallScore = () => {
    const scores = wellnessMetrics.map(metric => Math.min(100, (metric.value / metric.target) * 100));
    const moodScore = (todayData.mood / 10) * 100;
    const stressScore = ((10 - todayData.stress) / 10) * 100; // Inverted for stress
    const postureScore = (todayData.posture / 10) * 100;
    
    const allScores = [...scores, moodScore, stressScore, postureScore];
    return Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length);
  };

  const getWeeklyAverage = (metric: string) => {
    if (weeklyData.length === 0) return 0;
    const sum = weeklyData.reduce((acc, day) => acc + (day[metric as keyof DailyWellnessData] as number), 0);
    return Math.round((sum / weeklyData.length) * 10) / 10;
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Today's Wellness Score</h3>
            <p className="text-gray-600 dark:text-gray-400">Overall health and well-being rating</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{getOverallScore()}%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {getOverallScore() >= 80 ? 'Excellent' : getOverallScore() >= 60 ? 'Good' : 'Needs Improvement'}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Toggle */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Daily Tracking</h3>
        <button
          onClick={() => setShowProgress(!showProgress)}
          className="flex items-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          {showProgress ? 'Hide' : 'Show'} Progress
        </button>
      </div>

      {/* Wellness Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wellnessMetrics.map((metric) => {
          const Icon = metric.icon;
          const progress = Math.min(100, (metric.value / metric.target) * 100);
          
          return (
            <div key={metric.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon className={`h-5 w-5 text-${metric.color}-600`} />
                  <span className="font-medium text-gray-900 dark:text-white">{metric.name}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {metric.value}/{metric.target} {metric.unit}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <button
                  onClick={() => updateMetric(metric.id as keyof DailyWellnessData, metric.value - (metric.id === 'waterIntake' ? 1 : metric.id === 'eyeRest' ? 1 : 0.5))}
                  className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(metric.value, metric.target)}`}
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
                <button
                  onClick={() => updateMetric(metric.id as keyof DailyWellnessData, metric.value + (metric.id === 'waterIntake' ? 1 : metric.id === 'eyeRest' ? 1 : 0.5))}
                  className="p-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-400">{metric.description}</p>
              
              {showProgress && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Weekly avg: {getWeeklyAverage(metric.id)} {metric.unit}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mood and Stress Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {moodStressMetrics.map((metric) => {
          const Icon = metric.icon;
          
          return (
            <div key={metric.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Icon className={`h-5 w-5 text-${metric.color}-600`} />
                <span className="font-medium text-gray-900 dark:text-white">{metric.name}</span>
              </div>
              
              <div className="flex items-center space-x-1 mb-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => updateMetric(metric.id as keyof DailyWellnessData, rating)}
                    className={`w-6 h-6 rounded-full text-xs font-medium transition-colors ${
                      rating <= metric.value
                        ? `bg-${metric.color}-500 text-white`
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-400">{metric.description}</p>
              
              {showProgress && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Weekly avg: {getWeeklyAverage(metric.id)}/10
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Quick Actions</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => updateMetric('waterIntake', todayData.waterIntake + 1)}
            className="flex items-center justify-center px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            <Droplets className="h-4 w-4 mr-1" />
            Drink Water
          </button>
          <button
            onClick={() => updateMetric('breaks', todayData.breaks + 1)}
            className="flex items-center justify-center px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
          >
            <Coffee className="h-4 w-4 mr-1" />
            Take Break
          </button>
          <button
            onClick={() => updateMetric('eyeRest', todayData.eyeRest + 1)}
            className="flex items-center justify-center px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
          >
            <Eye className="h-4 w-4 mr-1" />
            Eye Rest
          </button>
          <button
            onClick={() => updateMetric('meditation', todayData.meditation + 5)}
            className="flex items-center justify-center px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
          >
            <Brain className="h-4 w-4 mr-1" />
            Meditate 5min
          </button>
        </div>
      </div>
    </div>
  );
}
