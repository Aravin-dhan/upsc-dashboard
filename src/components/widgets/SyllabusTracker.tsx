'use client';

import { BookOpen, CheckCircle, Clock, RotateCcw } from 'lucide-react';

export default function SyllabusTracker() {
  // Sample data - this would come from the database
  const syllabusProgress = [
    { id: 1, name: 'Ancient History', status: 'mastered', progress: 100 },
    { id: 2, name: 'Medieval History', status: 'revised_once', progress: 80 },
    { id: 3, name: 'Modern History', status: 'in_progress', progress: 45 },
    { id: 4, name: 'Art and Culture', status: 'first_reading_done', progress: 60 },
    { id: 5, name: 'Geography', status: 'not_started', progress: 0 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'bg-gray-200 text-gray-600';
      case 'in_progress': return 'bg-yellow-200 text-yellow-800';
      case 'first_reading_done': return 'bg-blue-200 text-blue-800';
      case 'revised_once': return 'bg-purple-200 text-purple-800';
      case 'mastered': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'not_started': return <Clock className="h-3 w-3" />;
      case 'in_progress': return <BookOpen className="h-3 w-3" />;
      case 'first_reading_done': return <CheckCircle className="h-3 w-3" />;
      case 'revised_once': return <RotateCcw className="h-3 w-3" />;
      case 'mastered': return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Syllabus Progress</h2>
        <BookOpen className="h-5 w-5 text-blue-600" />
      </div>

      <div className="space-y-4">
        {syllabusProgress.map((topic) => (
          <div key={topic.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{topic.name}</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(topic.status)}`}>
                {getStatusIcon(topic.status)}
                <span className="ml-1 capitalize">{topic.status.replace('_', ' ')}</span>
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${topic.progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">{topic.progress}%</div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Overall Progress:</span>
            <span className="font-medium text-gray-900 dark:text-white">57%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
