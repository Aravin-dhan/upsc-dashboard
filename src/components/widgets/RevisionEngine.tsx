'use client';

import { useState, useEffect } from 'react';
import {
  RefreshCw, Calendar, CheckCircle, Plus, X, Edit3,
  Trash2, MoreVertical, Filter, Search, Archive,
  RotateCcw, Settings, Download, Upload
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ContentRecoveryService } from '@/services/ContentRecoveryService';

interface RevisionItem {
  id: string;
  topic: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  createdAt: string;
  subject?: string;
  notes?: string;
  tags?: string[];
  lastModified?: string;
}

export default function RevisionEngine() {
  const [revisionQueue, setRevisionQueue] = useState<RevisionItem[]>([]);
  const [filteredQueue, setFilteredQueue] = useState<RevisionItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTopic, setNewTopic] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newSubject, setNewSubject] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const recoveryService = ContentRecoveryService.getInstance();

  // Load revision items from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upsc-revision-queue');
      if (saved) {
        try {
          setRevisionQueue(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading revision queue:', error);
        }
      }
    }
  }, []);

  // Save revision items to localStorage
  const saveRevisionQueue = (items: RevisionItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-revision-queue', JSON.stringify(items));
    }
  };

  // Filter and search functionality
  useEffect(() => {
    let filtered = revisionQueue;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(item => item.priority === priorityFilter);
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(item => !item.completed);
    } else if (statusFilter === 'completed') {
      filtered = filtered.filter(item => item.completed);
    }

    setFilteredQueue(filtered);
  }, [revisionQueue, searchTerm, priorityFilter, statusFilter]);

  // Add new revision item
  const addRevisionItem = () => {
    if (!newTopic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    const newItem: RevisionItem = {
      id: Date.now().toString(),
      topic: newTopic.trim(),
      dueDate: newDueDate || 'No due date',
      priority: newPriority,
      completed: false,
      createdAt: new Date().toISOString(),
      subject: newSubject.trim() || undefined,
      notes: newNotes.trim() || undefined,
      tags: newNotes.trim() ? newNotes.split(',').map(tag => tag.trim()).filter(tag => tag) : undefined,
      lastModified: new Date().toISOString()
    };

    const updatedQueue = [...revisionQueue, newItem];
    setRevisionQueue(updatedQueue);
    saveRevisionQueue(updatedQueue);

    // Reset form
    setNewTopic('');
    setNewDueDate('');
    setNewPriority('medium');
    setNewSubject('');
    setNewNotes('');
    setShowAddForm(false);
    toast.success('Revision item added!');
  };

  // Enhanced delete with recovery system
  const deleteItem = (item: RevisionItem) => {
    if (!confirm(`Are you sure you want to delete "${item.topic}"?`)) {
      return;
    }

    // Add to recovery system
    recoveryService.addDeletedItem(
      'revision-item',
      item.topic,
      item,
      'Revision Engine Widget',
      {
        tags: item.tags,
        category: item.subject,
        priority: item.priority,
        originalId: item.id
      }
    );

    const updatedQueue = revisionQueue.filter(i => i.id !== item.id);
    setRevisionQueue(updatedQueue);
    saveRevisionQueue(updatedQueue);
    toast.success('Revision item deleted! You can recover it from the recovery system.');
  };

  // Bulk operations
  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredQueue.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredQueue.map(item => item.id));
    }
  };

  const bulkMarkCompleted = () => {
    if (selectedItems.length === 0) return;

    const updatedQueue = revisionQueue.map(item =>
      selectedItems.includes(item.id)
        ? { ...item, completed: true, lastModified: new Date().toISOString() }
        : item
    );

    setRevisionQueue(updatedQueue);
    saveRevisionQueue(updatedQueue);
    setSelectedItems([]);
    toast.success(`${selectedItems.length} items marked as completed!`);
  };

  const bulkDelete = () => {
    if (selectedItems.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedItems.length} revision items?`)) {
      return;
    }

    // Add all selected items to recovery system
    selectedItems.forEach(itemId => {
      const item = revisionQueue.find(i => i.id === itemId);
      if (item) {
        recoveryService.addDeletedItem(
          'revision-item',
          item.topic,
          item,
          'Revision Engine Widget',
          {
            tags: item.tags,
            category: item.subject,
            priority: item.priority,
            originalId: item.id
          }
        );
      }
    });

    const updatedQueue = revisionQueue.filter(item => !selectedItems.includes(item.id));
    setRevisionQueue(updatedQueue);
    saveRevisionQueue(updatedQueue);
    setSelectedItems([]);
    toast.success(`${selectedItems.length} items deleted! You can recover them from the recovery system.`);
  };

  const bulkChangePriority = (priority: 'high' | 'medium' | 'low') => {
    if (selectedItems.length === 0) return;

    const updatedQueue = revisionQueue.map(item =>
      selectedItems.includes(item.id)
        ? { ...item, priority, lastModified: new Date().toISOString() }
        : item
    );

    setRevisionQueue(updatedQueue);
    saveRevisionQueue(updatedQueue);
    setSelectedItems([]);
    toast.success(`Priority updated for ${selectedItems.length} items!`);
  };

  // Mark item as completed
  const markAsRevised = (id: string) => {
    const updatedQueue = revisionQueue.map(item =>
      item.id === id ? { ...item, completed: true } : item
    );
    setRevisionQueue(updatedQueue);
    saveRevisionQueue(updatedQueue);
    toast.success('Topic marked as revised!');
  };

  // Legacy remove item function - now uses enhanced delete
  const removeItem = (id: string) => {
    const item = revisionQueue.find(i => i.id === id);
    if (item) {
      deleteItem(item);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter out completed items for display
  const activeItems = revisionQueue.filter(item => !item.completed);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Smart Revision</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Add revision topic"
          >
            <Plus className="h-5 w-5" />
          </button>
          <RefreshCw className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Add Revision Topic</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter topic (e.g., Ancient History - Mauryan Empire)"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-3">
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={addRevisionItem}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Topic
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Queue */}
      <div className="space-y-4">
        {activeItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No revision topics yet.</p>
            <p className="text-xs">Click the + button to add your first topic!</p>
          </div>
        ) : (
          activeItems.map((item) => (
            <div key={item.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{item.topic}</h4>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    Due: {item.dueDate}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Remove topic"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => markAsRevised(item.id)}
                className="mt-2 w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark as Revised
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600 text-center">
          Next auto-revision in 3 days
        </div>
      </div>
    </div>
  );
}
