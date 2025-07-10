'use client';

import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Clock, RotateCcw, Plus, X, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

interface SyllabusItem {
  id: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'first_reading_done' | 'revised_once' | 'mastered';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export default function SyllabusTracker() {
  const [syllabusProgress, setSyllabusProgress] = useState<SyllabusItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');

  // Load syllabus progress from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('upsc-syllabus-progress');
      if (saved) {
        try {
          setSyllabusProgress(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading syllabus progress:', error);
        }
      }
    }
  }, []);

  // Save syllabus progress to localStorage
  const saveSyllabusProgress = (items: SyllabusItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-syllabus-progress', JSON.stringify(items));
    }
  };

  // Add new syllabus topic
  const addTopic = () => {
    if (!newTopicName.trim()) {
      toast.error('Please enter a topic name');
      return;
    }

    const newTopic: SyllabusItem = {
      id: Date.now().toString(),
      name: newTopicName.trim(),
      status: 'not_started',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedProgress = [...syllabusProgress, newTopic];
    setSyllabusProgress(updatedProgress);
    saveSyllabusProgress(updatedProgress);
    setNewTopicName('');
    setShowAddForm(false);
    toast.success('Topic added successfully!');
  };

  // Update topic status
  const updateTopicStatus = (id: string, newStatus: SyllabusItem['status']) => {
    const statusProgress = {
      'not_started': 0,
      'in_progress': 25,
      'first_reading_done': 50,
      'revised_once': 75,
      'mastered': 100
    };

    const updatedProgress = syllabusProgress.map(topic =>
      topic.id === id 
        ? { 
            ...topic, 
            status: newStatus, 
            progress: statusProgress[newStatus],
            updatedAt: new Date().toISOString()
          }
        : topic
    );

    setSyllabusProgress(updatedProgress);
    saveSyllabusProgress(updatedProgress);
    toast.success(`Topic status updated to ${newStatus.replace('_', ' ')}`);
  };

  // Remove topic
  const removeTopic = (id: string) => {
    const updatedProgress = syllabusProgress.filter(topic => topic.id !== id);
    setSyllabusProgress(updatedProgress);
    saveSyllabusProgress(updatedProgress);
    toast.success('Topic removed');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
      case 'in_progress': return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'first_reading_done': return 'bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'revised_once': return 'bg-purple-200 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'mastered': return 'bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
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
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Add topic"
          >
            <Plus className="h-5 w-5" />
          </button>
          <BookOpen className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      {/* Add Topic Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Add New Topic</h3>
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Enter topic name (e.g., Ancient History)"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              onKeyPress={(e) => e.key === 'Enter' && addTopic()}
            />
            <button
              onClick={addTopic}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {syllabusProgress.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-sm">No syllabus topics yet.</p>
            <p className="text-xs">Click the + button to add your first topic!</p>
          </div>
        ) : (
          syllabusProgress.map((topic) => (
            <div key={topic.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{topic.name}</span>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(topic.status)}`}>
                    {getStatusIcon(topic.status)}
                    <span className="ml-1 capitalize">{topic.status.replace('_', ' ')}</span>
                  </span>
                  <button
                    onClick={() => removeTopic(topic.id)}
                    className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Remove topic"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${topic.progress}%` }}
                ></div>
              </div>

              {/* Status Update Buttons */}
              <div className="flex flex-wrap gap-1 mt-2">
                {['not_started', 'in_progress', 'first_reading_done', 'revised_once', 'mastered'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateTopicStatus(topic.id, status as SyllabusItem['status'])}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      topic.status === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">{topic.progress}%</div>
            </div>
          ))
        )}
      </div>

      {syllabusProgress.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Overall Progress:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {Math.round(syllabusProgress.reduce((acc, topic) => acc + topic.progress, 0) / syllabusProgress.length)}%
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Topics Completed:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {syllabusProgress.filter(topic => topic.status === 'mastered').length} / {syllabusProgress.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
