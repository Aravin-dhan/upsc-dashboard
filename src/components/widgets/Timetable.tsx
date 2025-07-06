'use client';

import { Calendar, Clock } from 'lucide-react';

export default function Timetable() {
  // Sample schedule data
  const todaySchedule = [
    { id: 1, time: '06:00', title: 'Morning Exercise', type: 'exercise', duration: 60 },
    { id: 2, time: '08:00', title: 'Modern History', type: 'study', duration: 120 },
    { id: 3, time: '10:30', title: 'Break', type: 'break', duration: 30 },
    { id: 4, time: '11:00', title: 'Current Affairs', type: 'current_affairs', duration: 90 },
    { id: 5, time: '14:00', title: 'Answer Writing Practice', type: 'answer_writing', duration: 120 },
    { id: 6, time: '16:30', title: 'Geography Revision', type: 'revision', duration: 90 },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'study': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'revision': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'answer_writing': return 'bg-green-100 text-green-800 border-green-200';
      case 'current_affairs': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'break': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'exercise': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Today's Schedule</h2>
        <Calendar className="h-5 w-5 text-blue-600" />
      </div>

      <div className="space-y-3">
        {todaySchedule.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            <div className="flex-shrink-0">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{item.time}</div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</div>
              <div className="flex items-center mt-1 space-x-2">
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.duration} minutes</span>
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.type)}`}>
              {item.type.replace('_', ' ')}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Total Study Time:</span>
          <span className="font-medium text-gray-900 dark:text-white">7.5 hours</span>
        </div>
      </div>
    </div>
  );
}
