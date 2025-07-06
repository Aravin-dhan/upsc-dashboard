'use client';

import { BarChart3, TrendingUp, Target } from 'lucide-react';

export default function PerformanceAnalytics() {
  // Sample mock test data - Updated for 2027 preparation
  const mockTestScores = [
    { test: 'Mock Test 1', score: 85, date: '2025-01-15' },
    { test: 'Mock Test 2', score: 92, date: '2025-01-22' },
    { test: 'Mock Test 3', score: 88, date: '2025-01-29' },
    { test: 'Mock Test 4', score: 95, date: '2025-02-05' },
  ];

  const subjectAnalysis = [
    { subject: 'History', correct: 18, total: 25, percentage: 72 },
    { subject: 'Geography', correct: 22, total: 25, percentage: 88 },
    { subject: 'Polity', correct: 15, total: 25, percentage: 60 },
    { subject: 'Economics', correct: 20, total: 25, percentage: 80 },
    { subject: 'Environment', correct: 23, total: 25, percentage: 92 },
  ];

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

      {/* Mock Test Trend */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Mock Test Progress</h3>
        <div className="space-y-3">
          {mockTestScores.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-900">{test.test}</div>
                <div className="text-xs text-gray-500">{test.date}</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-blue-600">{test.score}%</span>
                {index > 0 && (
                  <TrendingUp className={`h-4 w-4 ${test.score > mockTestScores[index - 1].score ? 'text-green-500' : 'text-red-500'}`} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject-wise Analysis */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Subject-wise Performance</h3>
        <div className="space-y-4">
          {subjectAnalysis.map((subject, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{subject.subject}</span>
                <span className={`text-sm font-bold ${getPerformanceColor(subject.percentage)}`}>
                  {subject.correct}/{subject.total} ({subject.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
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
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Overall Average:</span>
          <span className="font-bold text-blue-600 flex items-center">
            <Target className="h-4 w-4 mr-1" />
            78.4%
          </span>
        </div>
      </div>
    </div>
  );
}
