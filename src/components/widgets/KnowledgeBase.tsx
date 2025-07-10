'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, FileText, ArrowRight, X, Edit3, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ContentRecoveryService from '@/services/ContentRecoveryService';
import toast from 'react-hot-toast';

interface KnowledgeItem {
  id: string;
  title: string;
  topic: string;
  content: string;
  lastModified: string;
  type: 'note' | 'answer' | 'resource';
  tags: string[];
  isDefault?: boolean; // Track if this is a default item
  createdAt: string;
}

export default function KnowledgeBase() {
  const router = useRouter();
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletedItemIds, setDeletedItemIds] = useState<Set<string>>(new Set());
  const recoveryService = ContentRecoveryService.getInstance();
  const [newItem, setNewItem] = useState({
    title: '',
    topic: '',
    content: '',
    type: 'note' as 'note' | 'answer' | 'resource',
    tags: ''
  });

  // Initialize with default items and load user data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load deleted item IDs first
      const deletedIds = localStorage.getItem('upsc-knowledge-base-deleted');
      if (deletedIds) {
        try {
          setDeletedItemIds(new Set(JSON.parse(deletedIds)));
        } catch (error) {
          console.error('Error loading deleted IDs:', error);
        }
      }

      // Load user knowledge items
      const saved = localStorage.getItem('upsc-knowledge-base');
      let userItems: KnowledgeItem[] = [];
      if (saved) {
        try {
          userItems = JSON.parse(saved);
        } catch (error) {
          console.error('Error loading knowledge base:', error);
        }
      }

      // Single starter item to help users get started (only add if not deleted)
      const defaultItems: KnowledgeItem[] = [
        {
          id: 'starter-1',
          title: 'Welcome to Your Knowledge Base',
          topic: 'Getting Started',
          content: 'This is your personal knowledge repository. Add notes, important facts, and study materials here. Click the + button to create your first knowledge item!',
          lastModified: new Date().toLocaleDateString(),
          type: 'note',
          tags: ['Welcome', 'Getting Started'],
          isDefault: true,
          createdAt: new Date().toISOString()
        }
      ];

      // Filter out deleted default items and combine with user items
      const activeDefaultItems = defaultItems.filter(item => !deletedItemIds.has(item.id));
      const allItems = [...activeDefaultItems, ...userItems];

      setKnowledgeItems(allItems);
    }
  }, [deletedItemIds]);

  // Save knowledge items to localStorage (only user items, not defaults)
  const saveKnowledgeItems = (items: KnowledgeItem[]) => {
    if (typeof window !== 'undefined') {
      const userItems = items.filter(item => !item.isDefault);
      localStorage.setItem('upsc-knowledge-base', JSON.stringify(userItems));
    }
  };

  // Save deleted item IDs to localStorage
  const saveDeletedItemIds = (deletedIds: Set<string>) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-knowledge-base-deleted', JSON.stringify(Array.from(deletedIds)));
    }
  };

  // Delete an item (move to recovery system)
  const deleteItem = (item: KnowledgeItem) => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      // Add to recovery system
      recoveryService.addDeletedItem(
        'knowledge-base',
        item.title,
        item,
        'Knowledge Base Widget',
        {
          tags: item.tags,
          category: item.topic,
          originalId: item.id
        }
      );

      // Remove from current items
      const updatedItems = knowledgeItems.filter(i => i.id !== item.id);
      setKnowledgeItems(updatedItems);

      // If it's a default item, add to deleted IDs
      if (item.isDefault) {
        const newDeletedIds = new Set(deletedItemIds);
        newDeletedIds.add(item.id);
        setDeletedItemIds(newDeletedIds);
        saveDeletedItemIds(newDeletedIds);
      } else {
        // If it's a user item, save the updated list
        saveKnowledgeItems(updatedItems);
      }

      toast.success(`"${item.title}" moved to Recently Deleted`);
    }
  };

  // Add new item
  const addItem = () => {
    if (!newItem.title.trim() || !newItem.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const item: KnowledgeItem = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: newItem.title,
      topic: newItem.topic || 'General',
      content: newItem.content,
      lastModified: new Date().toLocaleDateString(),
      type: newItem.type,
      tags: newItem.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      isDefault: false,
      createdAt: new Date().toISOString()
    };

    const updatedItems = [...knowledgeItems, item];
    setKnowledgeItems(updatedItems);
    saveKnowledgeItems(updatedItems);

    setNewItem({
      title: '',
      topic: '',
      content: '',
      type: 'note',
      tags: ''
    });
    setShowAddForm(false);
    toast.success('Knowledge item added successfully!');
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
            <div key={item.id} className="group p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => router.push('/knowledge-base')}>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-600 mb-1 line-clamp-1">{item.content}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded-full mr-2">{item.topic}</span>
                    <span>{item.lastModified}</span>
                    {item.isDefault && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Default</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(item);
                    }}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </div>
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
