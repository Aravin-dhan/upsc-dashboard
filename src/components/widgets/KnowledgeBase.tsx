'use client';

import { BookOpen, Search, Plus, FileText, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function KnowledgeBase() {
  const router = useRouter();
  const recentNotes = [
    {
      id: 1,
      title: 'Mauryan Administration System',
      topic: 'Ancient History',
      lastModified: '2025-01-10',
      type: 'note'
    },
    {
      id: 2,
      title: 'Monsoon System in India',
      topic: 'Geography',
      lastModified: '2025-01-09',
      type: 'note'
    },
    {
      id: 3,
      title: 'Judicial Review Answer Practice',
      topic: 'Polity',
      lastModified: '2025-01-08',
      type: 'answer'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Knowledge Base</h2>
        <BookOpen className="h-5 w-5 text-blue-600" />
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search notes and answers..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Recent Notes */}
      <div className="space-y-3 mb-4">
        {recentNotes.map((note) => (
          <div key={note.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-1">{note.title}</h4>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded-full mr-2">{note.topic}</span>
                  <span>{note.lastModified}</span>
                </div>
              </div>
              <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={() => router.push('/knowledge-base')}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New Note
        </button>
        <button
          onClick={() => router.push('/answer-analysis')}
          className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
        >
          <FileText className="h-4 w-4 mr-1" />
          Answer Analysis
        </button>
        <button
          onClick={() => router.push('/knowledge-base')}
          className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
        >
          View All Notes
          <ArrowRight className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
