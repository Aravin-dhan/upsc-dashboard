'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, FileText, ArrowRight, X, Edit3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface KnowledgeItem {
  id: string;
  title: string;
  topic: string;
  content: string;
  lastModified: string;
  type: 'note' | 'answer' | 'resource';
  tags: string[];
}

export default function KnowledgeBase() {
  const router = useRouter();
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    topic: '',
    content: '',
    type: 'note' as 'note' | 'answer' | 'resource',
    tags: ''
  });

  // Load knowledge items from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upsc-knowledge-base');
      if (saved) {
        try {
          setKnowledgeItems(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading knowledge base:', error);
        }
      }
    }
  }, []);

  // Save knowledge items to localStorage
  const saveKnowledgeItems = (items: KnowledgeItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-knowledge-base', JSON.stringify(items));
    }
  };

  // Filter items based on search
  const filteredItems = knowledgeItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Knowledge Items */}
      <div className="space-y-3 mb-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">
              {searchTerm ? 'No items match your search.' : 'No knowledge items yet.'}
            </p>
            <p className="text-xs">
              {searchTerm ? 'Try a different search term.' : 'Start building your knowledge base!'}
            </p>
          </div>
        ) : (
          filteredItems.slice(0, 3).map((item) => (
            <div key={item.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-600 mb-1 line-clamp-1">{item.content}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded-full mr-2">{item.topic}</span>
                    <span>{item.lastModified}</span>
                  </div>
                </div>
                <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
              </div>
            </div>
          ))
        )}
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
