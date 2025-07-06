'use client';

import { Newspaper, Bookmark, ExternalLink, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CurrentAffairsHub() {
  const router = useRouter();
  const newsItems = [
    {
      id: 1,
      title: 'New Education Policy Implementation Update',
      source: 'The Hindu',
      date: '2025-01-10',
      tags: ['Education', 'Policy'],
      isBookmarked: false
    },
    {
      id: 2,
      title: 'Climate Change Summit Outcomes',
      source: 'Indian Express',
      date: '2025-01-09',
      tags: ['Environment', 'International Relations'],
      isBookmarked: true
    },
    {
      id: 3,
      title: 'Digital India Progress Report',
      source: 'PIB',
      date: '2025-01-08',
      tags: ['Technology', 'Governance'],
      isBookmarked: false
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Current Affairs</h2>
        <Newspaper className="h-5 w-5 text-blue-600" />
      </div>

      <div className="space-y-4">
        {newsItems.map((item) => (
          <div key={item.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900 flex-1 pr-2">{item.title}</h4>
              <button className="flex-shrink-0 text-gray-400 hover:text-yellow-500 transition-colors">
                <Bookmark className={`h-4 w-4 ${item.isBookmarked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>{item.source}</span>
              <span>{item.date}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="text-blue-600 hover:text-blue-800 transition-colors">
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => router.push('/current-affairs')}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          View All News
          <ArrowRight className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
