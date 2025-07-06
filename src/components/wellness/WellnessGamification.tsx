'use client';

import { useState, useEffect } from 'react';
import {
  Trophy, Star, Target, Flame, Award, Crown,
  Calendar, TrendingUp, Zap, Heart, Brain, Activity,
  CheckCircle, Lock, Gift, Medal, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  category: 'streak' | 'milestone' | 'consistency' | 'challenge' | 'special';
  requirement: {
    type: 'streak' | 'total' | 'daily_target' | 'weekly_target' | 'perfect_week';
    metric: string;
    value: number;
  };
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedDate?: string;
}

interface Challenge {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  duration: number; // days
  requirements: {
    metric: string;
    target: number;
    frequency: 'daily' | 'total';
  }[];
  points: number;
  active: boolean;
  progress: number;
  startDate?: string;
  endDate?: string;
}

interface UserStats {
  totalPoints: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  achievementsUnlocked: number;
  challengesCompleted: number;
  weeklyScore: number;
  rank: string;
}

const achievements: Achievement[] = [
  {
    id: 'first_day',
    name: 'Getting Started',
    description: 'Complete your first day of wellness tracking',
    icon: Star,
    color: 'yellow',
    category: 'milestone',
    requirement: { type: 'daily_target', metric: 'overall_score', value: 50 },
    points: 10,
    rarity: 'common',
    unlocked: false
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day wellness streak',
    icon: Flame,
    color: 'orange',
    category: 'streak',
    requirement: { type: 'streak', metric: 'daily_tracking', value: 7 },
    points: 50,
    rarity: 'rare',
    unlocked: false
  },
  {
    id: 'hydration_hero',
    name: 'Hydration Hero',
    description: 'Drink 8 glasses of water for 5 consecutive days',
    icon: Heart,
    color: 'blue',
    category: 'consistency',
    requirement: { type: 'streak', metric: 'water_target', value: 5 },
    points: 30,
    rarity: 'common',
    unlocked: false
  },
  {
    id: 'meditation_master',
    name: 'Meditation Master',
    description: 'Complete 100 minutes of meditation total',
    icon: Brain,
    color: 'purple',
    category: 'milestone',
    requirement: { type: 'total', metric: 'meditation', value: 100 },
    points: 75,
    rarity: 'epic',
    unlocked: false
  },
  {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Achieve 90%+ wellness score for an entire week',
    icon: Crown,
    color: 'gold',
    category: 'challenge',
    requirement: { type: 'perfect_week', metric: 'weekly_score', value: 90 },
    points: 100,
    rarity: 'legendary',
    unlocked: false
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Get 8+ hours of sleep for 10 consecutive days',
    icon: Award,
    color: 'green',
    category: 'consistency',
    requirement: { type: 'streak', metric: 'sleep_target', value: 10 },
    points: 60,
    rarity: 'rare',
    unlocked: false
  },
  {
    id: 'fitness_fanatic',
    name: 'Fitness Fanatic',
    description: 'Exercise for 30+ days total',
    icon: Activity,
    color: 'red',
    category: 'milestone',
    requirement: { type: 'total', metric: 'exercise_days', value: 30 },
    points: 80,
    rarity: 'epic',
    unlocked: false
  }
];

const challenges: Challenge[] = [
  {
    id: 'hydration_challenge',
    name: '7-Day Hydration Challenge',
    description: 'Drink 8 glasses of water every day for a week',
    icon: Heart,
    color: 'blue',
    duration: 7,
    requirements: [
      { metric: 'waterIntake', target: 8, frequency: 'daily' }
    ],
    points: 50,
    active: false,
    progress: 0
  },
  {
    id: 'meditation_challenge',
    name: '21-Day Meditation Challenge',
    description: 'Meditate for at least 10 minutes every day for 21 days',
    icon: Brain,
    color: 'purple',
    duration: 21,
    requirements: [
      { metric: 'meditation', target: 10, frequency: 'daily' }
    ],
    points: 100,
    active: false,
    progress: 0
  },
  {
    id: 'wellness_warrior',
    name: 'Wellness Warrior',
    description: 'Achieve 80%+ daily wellness score for 14 days',
    icon: Shield,
    color: 'gold',
    duration: 14,
    requirements: [
      { metric: 'overall_score', target: 80, frequency: 'daily' }
    ],
    points: 150,
    active: false,
    progress: 0
  }
];

export default function WellnessGamification() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    achievementsUnlocked: 0,
    challengesCompleted: 0,
    weeklyScore: 0,
    rank: 'Beginner'
  });

  const [userAchievements, setUserAchievements] = useState<Achievement[]>(achievements);
  const [userChallenges, setUserChallenges] = useState<Challenge[]>(challenges);
  const [selectedTab, setSelectedTab] = useState<'achievements' | 'challenges' | 'leaderboard'>('achievements');

  useEffect(() => {
    loadUserData();
    checkAchievements();
    updateChallengeProgress();
  }, []);

  const loadUserData = () => {
    if (typeof window !== 'undefined') {
      const savedStats = localStorage.getItem('upsc-wellness-stats');
      if (savedStats) {
        setUserStats(JSON.parse(savedStats));
      }

      const savedAchievements = localStorage.getItem('upsc-wellness-achievements');
      if (savedAchievements) {
        setUserAchievements(JSON.parse(savedAchievements));
      }

      const savedChallenges = localStorage.getItem('upsc-wellness-challenges');
      if (savedChallenges) {
        setUserChallenges(JSON.parse(savedChallenges));
      }
    }
  };

  const saveUserData = () => {
    localStorage.setItem('upsc-wellness-stats', JSON.stringify(userStats));
    localStorage.setItem('upsc-wellness-achievements', JSON.stringify(userAchievements));
    localStorage.setItem('upsc-wellness-challenges', JSON.stringify(userChallenges));
  };

  const checkAchievements = () => {
    // This would check against actual wellness data
    // For now, we'll simulate some achievements
    const wellnessData = localStorage.getItem('upsc-wellness-tracking');
    if (wellnessData) {
      const data = JSON.parse(wellnessData);
      // Check achievements based on actual data
      // Implementation would go here
    }
  };

  const updateChallengeProgress = () => {
    // Update challenge progress based on wellness data
    // Implementation would go here
  };

  const startChallenge = (challengeId: string) => {
    const updatedChallenges = userChallenges.map(challenge => {
      if (challenge.id === challengeId) {
        return {
          ...challenge,
          active: true,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + challenge.duration * 24 * 60 * 60 * 1000).toISOString(),
          progress: 0
        };
      }
      return challenge;
    });
    
    setUserChallenges(updatedChallenges);
    toast.success(`Started ${userChallenges.find(c => c.id === challengeId)?.name}!`);
    saveUserData();
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelInfo = (level: number) => {
    const levels = [
      { name: 'Beginner', min: 0, max: 100, color: 'gray' },
      { name: 'Novice', min: 100, max: 250, color: 'green' },
      { name: 'Intermediate', min: 250, max: 500, color: 'blue' },
      { name: 'Advanced', min: 500, max: 1000, color: 'purple' },
      { name: 'Expert', min: 1000, max: 2000, color: 'orange' },
      { name: 'Master', min: 2000, max: 5000, color: 'red' },
      { name: 'Grandmaster', min: 5000, max: Infinity, color: 'gold' }
    ];
    
    return levels.find(l => userStats.totalPoints >= l.min && userStats.totalPoints < l.max) || levels[0];
  };

  const currentLevel = getLevelInfo(userStats.level);
  const nextLevel = getLevelInfo(userStats.level + 1);
  const progressToNext = nextLevel ? ((userStats.totalPoints - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  return (
    <div className="space-y-6">
      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userStats.totalPoints}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Total Points</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Star className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">Level {userStats.level}</div>
              <div className="text-sm text-green-700 dark:text-green-300">{currentLevel.name}</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Flame className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{userStats.currentStreak}</div>
              <div className="text-sm text-orange-700 dark:text-orange-300">Day Streak</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{userStats.achievementsUnlocked}</div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Achievements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900 dark:text-white">Level Progress</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {userStats.totalPoints} / {nextLevel?.min || 'Max'} points
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full bg-gradient-to-r from-${currentLevel.color}-400 to-${currentLevel.color}-600 transition-all duration-300`}
            style={{ width: `${Math.min(100, progressToNext)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{currentLevel.name}</span>
          <span>{nextLevel?.name || 'Max Level'}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {(['achievements', 'challenges', 'leaderboard'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Achievements Tab */}
      {selectedTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userAchievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all ${
                  achievement.unlocked ? 'ring-2 ring-green-200 dark:ring-green-800' : 'opacity-75'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg ${achievement.unlocked ? `bg-${achievement.color}-100 dark:bg-${achievement.color}-900/30` : 'bg-gray-100 dark:bg-gray-700'}`}>
                    {achievement.unlocked ? (
                      <Icon className={`h-6 w-6 text-${achievement.color}-600 dark:text-${achievement.color}-400`} />
                    ) : (
                      <Lock className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {achievement.points} pts
                    </span>
                  </div>
                </div>

                <h4 className="font-medium text-gray-900 dark:text-white mb-1">{achievement.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{achievement.description}</p>

                {achievement.unlocked && achievement.unlockedDate && (
                  <div className="text-xs text-green-600 dark:text-green-400">
                    Unlocked on {new Date(achievement.unlockedDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Challenges Tab */}
      {selectedTab === 'challenges' && (
        <div className="space-y-4">
          {userChallenges.map((challenge) => {
            const Icon = challenge.icon;
            return (
              <div
                key={challenge.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 bg-${challenge.color}-100 dark:bg-${challenge.color}-900/30 rounded-lg`}>
                      <Icon className={`h-6 w-6 text-${challenge.color}-600 dark:text-${challenge.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{challenge.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{challenge.description}</p>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Duration: {challenge.duration} days • Reward: {challenge.points} points
                      </div>
                      
                      {challenge.active && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{challenge.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full bg-${challenge.color}-500 transition-all duration-300`}
                              style={{ width: `${challenge.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {!challenge.active ? (
                      <button
                        onClick={() => startChallenge(challenge.id)}
                        className={`px-4 py-2 bg-${challenge.color}-600 text-white rounded-lg hover:bg-${challenge.color}-700 transition-colors`}
                      >
                        Start Challenge
                      </button>
                    ) : (
                      <span className="px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-lg text-sm font-medium">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leaderboard Tab */}
      {selectedTab === 'leaderboard' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Weekly Leaderboard</h3>
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Leaderboard feature coming soon! Compete with other UPSC aspirants.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
