'use client';

import { RefreshCw, Calendar, CheckCircle } from 'lucide-react';

export default function RevisionEngine() {
  const revisionQueue = [
    { id: 1, topic: 'Ancient History - Mauryan Empire', dueDate: 'Today', priority: 'high' },
    { id: 2, topic: 'Geography - Monsoons', dueDate: 'Tomorrow', priority: 'medium' },
    { id: 3, topic: 'Polity - Fundamental Rights', dueDate: 'Feb 15', priority: 'low' },
    { id: 4, topic: 'Economics - Inflation', dueDate: 'Feb 16', priority: 'medium' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Smart Revision</h2>
        <RefreshCw className="h-5 w-5 text-blue-600" />
      </div>

      <div className="space-y-4">
        {revisionQueue.map((item) => (
          <div key={item.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-1">{item.topic}</h4>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  Due: {item.dueDate}
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                {item.priority}
              </div>
            </div>
            <button className="mt-2 w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark as Revised
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600 text-center">
          Next auto-revision in 3 days
        </div>
      </div>
    </div>
  );
}
