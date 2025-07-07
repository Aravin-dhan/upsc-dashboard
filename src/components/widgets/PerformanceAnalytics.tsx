'use client';

import { BarChart3, TrendingUp, Target, Plus } from 'lucide-react';
import { usePerformance } from '@/hooks/usePerformance';

export default function PerformanceAnalytics() {
  const { analytics, loading, error } = usePerformance();

  if (loading) {
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

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>Error loading performance data</p>
        </div>
      </div>
    );
  }

  const { recentSessions = [], subjectProgress = [] } = analytics || {};

  // Get recent practice sessions for mock test display
  const practiceSessions = recentSessions
    .filter(session => session.type === 'practice' || session.type === 'mock_test')
    .slice(0, 4)
    .map(session => ({
      test: session.type === 'mock_test' ? `Mock Test` : `Practice Session`,
      score: Math.round(session.accuracy || 0),
      date: session.date
    }));

  // Convert subject progress to analysis format
  const subjectAnalysis = subjectProgress.map(subject => ({
    subject: subject.subject,
    correct: Math.round((subject.accuracy / 100) * subject.questionsAttempted),
    total: subject.questionsAttempted,
    percentage: Math.round(subject.accuracy)
  }));

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Performance Analytics</h2>
        <BarChart3 className="h-5 w-5 text-blue-600" />
      </div>

      {/* Recent Practice Sessions */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Practice Sessions</h3>
        {practiceSessions.length > 0 ? (
          <div className="space-y-3">
            {practiceSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{session.test}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{session.date}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-blue-600">{session.score}%</span>
                  {index > 0 && (
                    <TrendingUp className={`h-4 w-4 ${session.score > practiceSessions[index - 1].score ? 'text-green-500' : 'text-red-500'}`} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No practice sessions yet</p>
            <p className="text-xs mt-1">Start practicing to see your progress here</p>
          </div>
        )}
      </div>

      {/* Subject-wise Analysis */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Subject-wise Performance</h3>
        {subjectAnalysis.length > 0 ? (
          <div className="space-y-4">
            {subjectAnalysis.map((subject, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{subject.subject}</span>
                  <span className={`text-sm font-bold ${getPerformanceColor(subject.percentage)}`}>
                    {subject.correct}/{subject.total} ({subject.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      subject.percentage >= 80 ? 'bg-green-500' :
                      subject.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${subject.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No subject data available</p>
            <p className="text-xs mt-1">Complete practice sessions to see subject analysis</p>
          </div>
        )}
      </div>

      {subjectAnalysis.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Overall Average:</span>
            <span className="font-bold text-blue-600 flex items-center">
              <Target className="h-4 w-4 mr-1" />
              {Math.round(subjectAnalysis.reduce((sum, subject) => sum + subject.percentage, 0) / subjectAnalysis.length)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
