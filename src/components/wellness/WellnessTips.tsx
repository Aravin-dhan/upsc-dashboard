'use client';

import React, { useState, useEffect } from 'react';
import {
  Lightbulb, Clock, Eye, Heart, Brain, Activity,
  Moon, Droplets, Coffee, Target, AlertTriangle,
  CheckCircle, RefreshCw, Timer, Zap, Shield, Calendar
} from 'lucide-react';

interface WellnessTip {
  id: string;
  category: 'study' | 'physical' | 'mental' | 'nutrition' | 'sleep' | 'posture';
  title: string;
  description: string;
  icon: any;
  color: string;
  actionable: boolean;
  frequency: 'daily' | 'hourly' | 'weekly' | 'as_needed';
  duration?: string;
  benefits: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const wellnessTips: WellnessTip[] = [
  {
    id: 'pomodoro',
    category: 'study',
    title: '25-Minute Pomodoro Sessions',
    description: 'Study for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer 15-30 minute break.',
    icon: Timer,
    color: 'blue',
    actionable: true,
    frequency: 'hourly',
    duration: '25 min study + 5 min break',
    benefits: ['Improved focus', 'Reduced mental fatigue', 'Better time management'],
    difficulty: 'easy'
  },
  {
    id: 'eye_care',
    category: 'physical',
    title: '20-20-20 Rule for Eye Care',
    description: 'Every 20 minutes, look at something 20 feet away for at least 20 seconds to reduce eye strain.',
    icon: Eye,
    color: 'green',
    actionable: true,
    frequency: 'hourly',
    duration: '20 seconds',
    benefits: ['Reduced eye strain', 'Prevention of dry eyes', 'Better long-term vision health'],
    difficulty: 'easy'
  },
  {
    id: 'hydration',
    category: 'nutrition',
    title: 'Regular Hydration',
    description: 'Drink a glass of water every hour. Keep a water bottle nearby and set reminders if needed.',
    icon: Droplets,
    color: 'cyan',
    actionable: true,
    frequency: 'hourly',
    duration: '1 minute',
    benefits: ['Better cognitive function', 'Reduced fatigue', 'Improved concentration'],
    difficulty: 'easy'
  },
  {
    id: 'deep_breathing',
    category: 'mental',
    title: 'Deep Breathing Exercise',
    description: 'Practice 4-7-8 breathing: Inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times.',
    icon: Heart,
    color: 'pink',
    actionable: true,
    frequency: 'as_needed',
    duration: '2-3 minutes',
    benefits: ['Reduced stress', 'Better focus', 'Improved emotional regulation'],
    difficulty: 'easy'
  },
  {
    id: 'posture_check',
    category: 'posture',
    title: 'Posture Awareness',
    description: 'Set hourly reminders to check your posture. Ensure your back is straight, feet flat on floor, screen at eye level.',
    icon: Target,
    color: 'purple',
    actionable: true,
    frequency: 'hourly',
    duration: '30 seconds',
    benefits: ['Reduced back pain', 'Better breathing', 'Improved confidence'],
    difficulty: 'easy'
  },
  {
    id: 'active_breaks',
    category: 'physical',
    title: 'Active Study Breaks',
    description: 'Do light stretching, walk around, or do jumping jacks during breaks to boost circulation.',
    icon: Activity,
    color: 'orange',
    actionable: true,
    frequency: 'hourly',
    duration: '5-10 minutes',
    benefits: ['Increased energy', 'Better circulation', 'Reduced muscle tension'],
    difficulty: 'easy'
  },
  {
    id: 'sleep_hygiene',
    category: 'sleep',
    title: 'Consistent Sleep Schedule',
    description: 'Go to bed and wake up at the same time daily. Avoid screens 1 hour before bedtime.',
    icon: Moon,
    color: 'indigo',
    actionable: true,
    frequency: 'daily',
    duration: '7-8 hours',
    benefits: ['Better memory consolidation', 'Improved focus', 'Enhanced mood'],
    difficulty: 'medium'
  },
  {
    id: 'meditation',
    category: 'mental',
    title: 'Daily Meditation',
    description: 'Start with 5-10 minutes of mindfulness meditation. Focus on your breath and observe thoughts without judgment.',
    icon: Brain,
    color: 'teal',
    actionable: true,
    frequency: 'daily',
    duration: '5-20 minutes',
    benefits: ['Reduced anxiety', 'Better concentration', 'Improved emotional stability'],
    difficulty: 'medium'
  },
  {
    id: 'nutrition_timing',
    category: 'nutrition',
    title: 'Smart Eating Schedule',
    description: 'Eat brain-boosting foods like nuts, berries, and fish. Avoid heavy meals before study sessions.',
    icon: Coffee,
    color: 'yellow',
    actionable: true,
    frequency: 'daily',
    duration: 'Throughout day',
    benefits: ['Sustained energy', 'Better cognitive function', 'Improved mood'],
    difficulty: 'medium'
  },
  {
    id: 'stress_management',
    category: 'mental',
    title: 'Stress Recognition',
    description: 'Learn to identify early signs of stress and overwhelm. Take immediate action when you notice them.',
    icon: AlertTriangle,
    color: 'red',
    actionable: true,
    frequency: 'as_needed',
    duration: 'Ongoing',
    benefits: ['Better emotional control', 'Prevented burnout', 'Improved performance'],
    difficulty: 'hard'
  }
];

export default function WellnessTips() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dailyTip, setDailyTip] = useState<WellnessTip | null>(null);
  const [completedTips, setCompletedTips] = useState<Set<string>>(new Set());
  const [showReminders, setShowReminders] = useState(false);

  useEffect(() => {
    // Set daily tip
    const today = new Date().toDateString();
    const savedDailyTip = localStorage.getItem('upsc-daily-wellness-tip');
    const savedDate = localStorage.getItem('upsc-daily-tip-date');
    
    if (savedDate !== today) {
      const randomTip = wellnessTips[Math.floor(Math.random() * wellnessTips.length)];
      setDailyTip(randomTip);
      localStorage.setItem('upsc-daily-wellness-tip', JSON.stringify(randomTip));
      localStorage.setItem('upsc-daily-tip-date', today);
    } else if (savedDailyTip) {
      setDailyTip(JSON.parse(savedDailyTip));
    }

    // Load completed tips
    const saved = localStorage.getItem('upsc-completed-wellness-tips');
    if (saved) {
      setCompletedTips(new Set(JSON.parse(saved)));
    }
  }, []);

  const categories = [
    { id: 'all', name: 'All Tips', icon: Lightbulb },
    { id: 'study', name: 'Study', icon: Brain },
    { id: 'physical', name: 'Physical', icon: Activity },
    { id: 'mental', name: 'Mental', icon: Heart },
    { id: 'nutrition', name: 'Nutrition', icon: Coffee },
    { id: 'sleep', name: 'Sleep', icon: Moon },
    { id: 'posture', name: 'Posture', icon: Target }
  ];

  const getFilteredTips = () => {
    if (selectedCategory === 'all') return wellnessTips;
    return wellnessTips.filter(tip => tip.category === selectedCategory);
  };

  const markTipCompleted = (tipId: string) => {
    const newCompleted = new Set(completedTips);
    if (newCompleted.has(tipId)) {
      newCompleted.delete(tipId);
    } else {
      newCompleted.add(tipId);
    }
    setCompletedTips(newCompleted);
    localStorage.setItem('upsc-completed-wellness-tips', JSON.stringify([...newCompleted]));
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      study: 'blue',
      physical: 'green',
      mental: 'purple',
      nutrition: 'yellow',
      sleep: 'indigo',
      posture: 'pink'
    };
    return colors[category as keyof typeof colors] || 'gray';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'hourly': return <Clock className="h-3 w-3" />;
      case 'daily': return <RefreshCw className="h-3 w-3" />;
      case 'weekly': return <Calendar className="h-3 w-3" />;
      case 'as_needed': return <Zap className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Daily Tip Highlight */}
      {dailyTip && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              {React.createElement(dailyTip.icon, { className: "h-6 w-6 text-blue-600 dark:text-blue-400" })}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Today's Wellness Tip</h3>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                  Daily
                </span>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">{dailyTip.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-3">{dailyTip.description}</p>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Duration: {dailyTip.duration}
                </span>
                <button
                  onClick={() => markTipCompleted(dailyTip.id)}
                  className={`flex items-center px-3 py-1 rounded-lg text-sm transition-colors ${
                    completedTips.has(dailyTip.id)
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {completedTips.has(dailyTip.id) ? 'Completed' : 'Mark Done'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {getFilteredTips().map((tip) => {
          const Icon = tip.icon;
          const isCompleted = completedTips.has(tip.id);
          
          return (
            <div
              key={tip.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all ${
                isCompleted ? 'ring-2 ring-green-200 dark:ring-green-800' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-${tip.color}-100 dark:bg-${tip.color}-900/30 rounded-lg`}>
                    <Icon className={`h-5 w-5 text-${tip.color}-600 dark:text-${tip.color}-400`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{tip.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}>
                        {tip.difficulty}
                      </span>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        {getFrequencyIcon(tip.frequency)}
                        <span className="ml-1">{tip.frequency.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => markTipCompleted(tip.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    isCompleted
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-3">{tip.description}</p>

              {tip.duration && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Duration: {tip.duration}
                </div>
              )}

              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-900 dark:text-white">Benefits:</h5>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {tip.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Your Progress</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTips.size}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Tips Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round((completedTips.size / wellnessTips.length) * 100)}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {wellnessTips.filter(tip => tip.difficulty === 'easy' && completedTips.has(tip.id)).length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Easy Tips Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {wellnessTips.filter(tip => tip.difficulty === 'hard' && completedTips.has(tip.id)).length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Hard Tips Done</div>
          </div>
        </div>
      </div>
    </div>
  );
}
