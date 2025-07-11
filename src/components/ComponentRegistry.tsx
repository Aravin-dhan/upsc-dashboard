'use client';

import React from 'react';
import { Calendar, BookOpen, TrendingUp, Target, Brain, Heart, Star, Users, FileText, Zap, BarChart3, Clock, ArrowRight, ExternalLink, CheckCircle, PlayCircle, AlertCircle, Bookmark, Eye, EyeOff } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useTodaySchedule } from '@/hooks/useTodaySchedule';
import { usePerformanceData } from '@/hooks/usePerformanceData';
import { useSyllabusData } from '@/hooks/useSyllabusData';
import { useRevisionData } from '@/hooks/useRevisionData';
import { useCurrentAffairs } from '@/hooks/useCurrentAffairs';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useWellnessData } from '@/hooks/useWellnessData';
import { useAIInsights } from '@/hooks/useAIInsights';
import { useRouter } from 'next/navigation';

/**
 * REVOLUTIONARY COMPONENT REGISTRY SYSTEM
 * 
 * This completely eliminates lazy loading and dynamic imports by pre-defining
 * all components as simple, reliable React components that ALWAYS work.
 */

// Real data-driven widget components
const CommandCenterWidget = () => {
  const { data, isLoading } = useDashboardData();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <Zap className="h-6 w-6 text-blue-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Command Center</h2>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Study Streak</span>
          <span className="font-semibold text-green-600">{data?.studyStreak || 0} days</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Today's Goal</span>
          <span className="font-semibold text-blue-600">
            {data?.todayGoal.completed || 0}/{data?.todayGoal.total || 8} hours
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
          <span className="font-semibold text-purple-600">{data?.overallProgress || 0}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${data?.overallProgress || 0}%` }}
          ></div>
        </div>
        <button
          onClick={() => router.push('/analytics')}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm transition-colors flex items-center justify-center"
        >
          View Analytics <ArrowRight className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

const TodaysScheduleWidget = () => {
  const { data, isLoading, error, markAsCompleted, markAsInProgress } = useTodaySchedule();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <Calendar className="h-6 w-6 text-red-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Today's Schedule</h2>
        </div>
        <div className="text-center py-4">
          <p className="text-red-600 mb-2">Failed to load schedule</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStatusClick = async (itemId: string, currentStatus: string) => {
    try {
      if (currentStatus === 'pending') {
        await markAsInProgress(itemId);
      } else if (currentStatus === 'in-progress') {
        await markAsCompleted(itemId);
      }
      // If completed, don't change (or could cycle back to pending)
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Calendar className="h-6 w-6 text-green-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Today's Schedule</h2>
        </div>
        {data?.stats && (
          <div className="text-sm text-gray-500">
            {data.stats.completed}/{data.stats.total} completed
          </div>
        )}
      </div>

      <div className="space-y-3">
        {data?.schedule.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center justify-between group">
            <div className="flex items-center flex-1">
              <button
                onClick={() => handleStatusClick(item.id, item.status)}
                className={`w-3 h-3 ${getStatusColor(item.status)} rounded-full mr-3 hover:scale-110 transition-transform cursor-pointer`}
                title={`Click to update status (${item.status})`}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{item.time}</span>
                  <span className="text-xs text-gray-500">{item.duration}min</span>
                </div>
                <div className="text-gray-900 dark:text-white font-medium">{item.subject}</div>
                {item.topics && item.topics.length > 0 && (
                  <p className="text-gray-500 text-xs mt-1">{item.topics.join(', ')}</p>
                )}
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ml-2 ${
              item.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              item.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {item.status.replace('-', ' ')}
            </span>
          </div>
        ))}
      </div>

      {data?.stats && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">{data.stats.completionRate}%</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${data.stats.completionRate}%` }}
            />
          </div>
        </div>
      )}

      <button
        onClick={() => router.push('/calendar')}
        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm transition-colors flex items-center justify-center"
      >
        View Full Schedule <ExternalLink className="h-4 w-4 ml-2" />
      </button>
    </div>
  );
};

const PerformanceOverviewWidget = () => {
  const { data, isLoading, error, refresh } = usePerformanceData();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-6 w-6 text-red-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Performance Overview</h2>
        </div>
        <div className="text-center py-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Failed to load performance data</p>
          <button onClick={refresh} className="text-blue-600 hover:text-blue-700 text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '→';
    }
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <TrendingUp className="h-6 w-6 text-purple-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Performance Overview</h2>
        </div>
        <button onClick={refresh} className="text-purple-600 hover:text-purple-700 text-sm">
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{data?.overall.averageScore}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">#{data?.overall.rank}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Rank</div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject Performance</h3>
          {data?.subjects.slice(0, 3).map((subject) => (
            <div key={subject.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-gray-700 dark:text-gray-300 font-medium">{subject.subject}</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${subject.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">{subject.percentage}%</span>
                <span className={`text-lg ${getTrendColor(subject.trend)}`}>{getTrendIcon(subject.trend)}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push('/analytics')}
          className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm transition-colors flex items-center justify-center"
        >
          View Detailed Analytics <BarChart3 className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

const SyllabusTrackerWidget = () => {
  const { data, isLoading } = useDashboardData();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <Target className="h-6 w-6 text-red-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Syllabus Progress</h2>
      </div>
      <div className="space-y-3">
        {data?.syllabusProgress.slice(0, 3).map((subject, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">{subject.subject}</span>
            <div className="flex items-center">
              <span className={`font-semibold ${getProgressColor(subject.progress)}`}>
                {subject.progress}%
              </span>
              <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 ml-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    subject.progress >= 80 ? 'bg-green-600' :
                    subject.progress >= 60 ? 'bg-blue-600' :
                    subject.progress >= 40 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${subject.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={() => router.push('/syllabus')}
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm transition-colors flex items-center justify-center"
        >
          View Full Syllabus <ExternalLink className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

const PerformanceAnalyticsWidget = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-4">
      <BarChart3 className="h-6 w-6 text-indigo-600 mr-3" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Performance Analytics</h2>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Weekly Progress</span>
        <span className="font-semibold text-green-600">+12%</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Strong Areas</span>
        <span className="font-semibold text-blue-600">History, Polity</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Focus Areas</span>
        <span className="font-semibold text-orange-600">Economics</span>
      </div>
      <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
        Detailed Report
      </button>
    </div>
  </div>
);

const RevisionEngineWidget = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-4">
      <Clock className="h-6 w-6 text-orange-600 mr-3" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Revision Engine</h2>
    </div>
    <div className="space-y-3">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Smart revision scheduling based on forgetting curve
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">Due Today</span>
        <span className="font-semibold text-red-600">5 topics</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 dark:text-gray-400">This Week</span>
        <span className="font-semibold text-blue-600">23 topics</span>
      </div>
      <button className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
        Start Revision
      </button>
    </div>
  </div>
);

const CurrentAffairsWidget = () => {
  const { data, isLoading } = useDashboardData();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <FileText className="h-6 w-6 text-cyan-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Current Affairs</h2>
      </div>
      <div className="space-y-3">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Latest updates from reliable sources
        </div>
        {data?.currentAffairs.slice(0, 3).map((item, index) => (
          <div key={index} className="flex items-start">
            <div className={`w-2 h-2 ${getPriorityColor(item.priority)} rounded-full mr-3 mt-2 flex-shrink-0`}></div>
            <div className="flex-1">
              <div className="text-gray-900 dark:text-white text-sm font-medium">{item.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {item.category} • {new Date(item.date).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={() => router.push('/current-affairs')}
          className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-md text-sm transition-colors flex items-center justify-center"
        >
          Read All Updates <ExternalLink className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

const KnowledgeBaseWidget = () => {
  const { data, isLoading } = useDashboardData();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <BookOpen className="h-6 w-6 text-emerald-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Knowledge Base</h2>
      </div>
      <div className="space-y-3">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Your personal study notes and resources
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Notes</span>
          <span className="font-semibold text-blue-600">{data?.knowledgeBase.notes || 0} items</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Bookmarks</span>
          <span className="font-semibold text-green-600">{data?.knowledgeBase.bookmarks || 0} items</span>
        </div>
        {data?.knowledgeBase.recentActivity && data.knowledgeBase.recentActivity.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Recent Activity:</div>
            {data.knowledgeBase.recentActivity.slice(0, 2).map((activity, index) => (
              <div key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                <span className={`w-1 h-1 rounded-full mr-2 ${activity.type === 'note' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                {activity.title}
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => router.push('/knowledge-base')}
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md text-sm transition-colors flex items-center justify-center"
        >
          Browse Knowledge <BookOpen className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

const WellnessCornerWidget = () => {
  const { data, isLoading } = useDashboardData();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const getStressColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'excellent': return '😊';
      case 'good': return '🙂';
      case 'okay': return '😐';
      case 'poor': return '😔';
      default: return '🙂';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <Heart className="h-6 w-6 text-pink-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Wellness Corner</h2>
      </div>
      <div className="space-y-3">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Take care of your mental and physical health
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Stress Level</span>
          <span className={`font-semibold capitalize ${getStressColor(data?.wellness.stressLevel || 'low')}`}>
            {data?.wellness.stressLevel || 'Low'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Sleep</span>
          <span className="font-semibold text-blue-600">{data?.wellness.sleepHours || 0} hrs</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Mood</span>
          <span className="font-semibold text-purple-600 flex items-center">
            {getMoodEmoji(data?.wellness.mood || 'good')} {data?.wellness.mood || 'Good'}
          </span>
        </div>
        <button
          onClick={() => router.push('/wellness')}
          className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-md text-sm transition-colors flex items-center justify-center"
        >
          Wellness Dashboard <Heart className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

const MotivationalPosterWidget = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center mb-4">
      <Star className="h-6 w-6 text-yellow-600 mr-3" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Daily Motivation</h2>
    </div>
    <div className="space-y-3">
      <div className="text-sm text-gray-700 dark:text-gray-300 italic">
        "Success is not final, failure is not fatal: it is the courage to continue that counts."
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-500">
        - Winston Churchill
      </div>
      <button className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md text-sm transition-colors">
        New Quote
      </button>
    </div>
  </div>
);

const PersonalizationInsightsWidget = () => {
  const { data, isLoading } = useDashboardData();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return '💡';
      case 'warning': return '⚠️';
      case 'achievement': return '🎉';
      default: return '💡';
    }
  };

  const getInsightBg = (type: string) => {
    switch (type) {
      case 'recommendation': return 'bg-blue-50 dark:bg-blue-900/20';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'achievement': return 'bg-green-50 dark:bg-green-900/20';
      default: return 'bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const getInsightText = (type: string) => {
    switch (type) {
      case 'recommendation': return 'text-blue-800 dark:text-blue-200';
      case 'warning': return 'text-yellow-800 dark:text-yellow-200';
      case 'achievement': return 'text-green-800 dark:text-green-200';
      default: return 'text-blue-800 dark:text-blue-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-4">
        <Brain className="h-6 w-6 text-violet-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">AI Insights</h2>
      </div>
      <div className="space-y-3">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Your personal AI study companion
        </div>
        {data?.aiInsights && data.aiInsights.length > 0 ? (
          data.aiInsights.slice(0, 2).map((insight, index) => (
            <div key={index} className={`p-3 rounded-md ${getInsightBg(insight.type)}`}>
              <div className={`text-sm ${getInsightText(insight.type)}`}>
                {getInsightIcon(insight.type)} {insight.message}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
            <div className="text-sm text-blue-800 dark:text-blue-200">
              💡 AI insights will appear here based on your study patterns
            </div>
          </div>
        )}
        <button
          onClick={() => router.push('/ai-assistant')}
          className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded-md text-sm transition-colors flex items-center justify-center"
        >
          Chat with AI Assistant <Brain className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

// COMPONENT REGISTRY - Pre-loaded, guaranteed to work
export const COMPONENT_REGISTRY = {
  'command-center': CommandCenterWidget,
  'todays-schedule': TodaysScheduleWidget,
  'performance-widget': PerformanceOverviewWidget,
  'syllabus-tracker': SyllabusTrackerWidget,
  'performance-analytics': PerformanceAnalyticsWidget,
  'revision-engine': RevisionEngineWidget,
  'current-affairs': CurrentAffairsWidget,
  'knowledge-base': KnowledgeBaseWidget,
  'wellness-corner': WellnessCornerWidget,
  'motivational-poster': MotivationalPosterWidget,
  'personalization-insights': PersonalizationInsightsWidget,
};

export type ComponentId = keyof typeof COMPONENT_REGISTRY;

// Widget metadata
export const WIDGET_METADATA = {
  'command-center': { name: 'Command Center', size: 'large' as const, order: 0 },
  'todays-schedule': { name: "Today's Schedule", size: 'medium' as const, order: 1 },
  'performance-widget': { name: 'Performance Overview', size: 'medium' as const, order: 2 },
  'syllabus-tracker': { name: 'Syllabus Progress', size: 'medium' as const, order: 3 },
  'performance-analytics': { name: 'Performance Analytics', size: 'large' as const, order: 4 },
  'revision-engine': { name: 'Revision Engine', size: 'medium' as const, order: 5 },
  'current-affairs': { name: 'Current Affairs', size: 'medium' as const, order: 6 },
  'knowledge-base': { name: 'Knowledge Base', size: 'medium' as const, order: 7 },
  'wellness-corner': { name: 'Wellness Corner', size: 'small' as const, order: 8 },
  'motivational-poster': { name: 'Daily Motivation', size: 'small' as const, order: 9 },
  'personalization-insights': { name: 'AI Insights', size: 'medium' as const, order: 10 },
};

export default COMPONENT_REGISTRY;
