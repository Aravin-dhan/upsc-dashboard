'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen, Search, Plus, FileText, Edit, Trash2, Save, X,
  Filter, Tag, Calendar, Clock, Star, Download, Upload,
  PenTool, Eye, Copy, Archive, Bookmark, EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useKnowledgeBaseKeyboardNavigation, useModalKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

interface Note {
  id: string;
  title: string;
  content: string;
  topic: string;
  tags: string[];
  type: 'note' | 'answer' | 'bookmark';
  createdAt: string;
  lastModified: string;
  isFavorite: boolean;
  isArchived: boolean;
  wordCount: number;
}

interface AnswerPractice {
  id: string;
  question: string;
  answer: string;
  topic: string;
  examType: 'prelims' | 'mains';
  timeSpent: number; // in minutes
  wordCount: number;
  createdAt: string;
  lastModified: string;
  feedback?: string;
  score?: number;
}

export default function KnowledgeBasePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [answerPractices, setAnswerPractices] = useState<AnswerPractice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAnswerPractice, setShowAnswerPractice] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Load data on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedNotes = localStorage.getItem('upsc-knowledge-base-notes');
      const savedAnswers = localStorage.getItem('upsc-knowledge-base-answers');

      if (savedNotes) {
        try {
          setNotes(JSON.parse(savedNotes));
        } catch (error) {
          console.error('Error loading notes:', error);
          setNotes(getDefaultNotes());
        }
      } else {
        setNotes(getDefaultNotes());
      }

      if (savedAnswers) {
        try {
          setAnswerPractices(JSON.parse(savedAnswers));
        } catch (error) {
          console.error('Error loading answer practices:', error);
          setAnswerPractices(getDefaultAnswers());
        }
      } else {
        setAnswerPractices(getDefaultAnswers());
      }

      setIsLoaded(true);
    }
  }, []);

  const getDefaultNotes = (): Note[] => [
    {
      id: '1',
      title: 'Mauryan Administration System',
      content: 'The Mauryan Empire had a highly centralized administrative system...',
      topic: 'Ancient History',
      tags: ['mauryan', 'administration', 'ancient-india'],
      type: 'note',
      createdAt: '2025-01-10T10:00:00Z',
      lastModified: '2025-01-10T10:00:00Z',
      isFavorite: true,
      isArchived: false,
      wordCount: 245
    },
    {
      id: '2',
      title: 'Monsoon System in India',
      content: 'The Indian monsoon system is characterized by seasonal wind patterns...',
      topic: 'Geography',
      tags: ['monsoon', 'climate', 'geography'],
      type: 'note',
      createdAt: '2025-01-09T14:30:00Z',
      lastModified: '2025-01-09T14:30:00Z',
      isFavorite: false,
      isArchived: false,
      wordCount: 189
    }
  ];

  const getDefaultAnswers = (): AnswerPractice[] => [];

  const saveNotes = (notesToSave: Note[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-knowledge-base-notes', JSON.stringify(notesToSave));
    }
  };

  const saveAnswers = (answersToSave: AnswerPractice[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-knowledge-base-answers', JSON.stringify(answersToSave));
    }
  };

  const topics = Array.from(new Set([
    ...notes.map(note => note.topic),
    ...answerPractices.map(answer => answer.topic)
  ]));

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'favorites' && note.isFavorite) ||
                         (selectedFilter === 'archived' && note.isArchived) ||
                         (selectedFilter === note.type);

    const matchesTopic = selectedTopic === 'all' || note.topic === selectedTopic;

    return matchesSearch && matchesFilter && matchesTopic && !note.isArchived;
  });

  // Keyboard navigation
  useKnowledgeBaseKeyboardNavigation(
    filteredNotes,
    selectedNoteIndex,
    !!editingNote,
    setSelectedNoteIndex,
    (note) => setEditingNote(note),
    () => {
      setEditingNote(null);
      setViewingNote(null);
      setShowAddNote(false);
    },
    () => {
      if (editingNote) {
        updateNote(editingNote.id, editingNote);
      }
    },
    true
  );

  // Modal keyboard navigation
  useModalKeyboardNavigation(
    !!(viewingNote || showAddNote),
    () => {
      setViewingNote(null);
      setShowAddNote(false);
    },
    undefined,
    true
  );

  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'lastModified' | 'wordCount'>) => {
    const now = new Date().toISOString();
    const wordCount = noteData.content.split(/\s+/).filter(word => word.length > 0).length;

    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: now,
      lastModified: now,
      wordCount
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setShowAddNote(false);
    toast.success('Note added successfully!');
  };

  const updateNote = (updatedNote: Note) => {
    const wordCount = updatedNote.content.split(/\s+/).filter(word => word.length > 0).length;
    const noteWithUpdatedData = {
      ...updatedNote,
      lastModified: new Date().toISOString(),
      wordCount
    };

    const updatedNotes = notes.map(note =>
      note.id === updatedNote.id ? noteWithUpdatedData : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setEditingNote(null);
    toast.success('Note updated successfully!');
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    toast.success('Note deleted successfully!');
  };

  const copyNoteContent = async (note: Note) => {
    try {
      await navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
      toast.success('Note content copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy content');
    }
  };

  const toggleFavorite = (id: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const addAnswerPractice = (answerData: Omit<AnswerPractice, 'id' | 'createdAt' | 'lastModified' | 'wordCount'>) => {
    const now = new Date().toISOString();
    const wordCount = answerData.answer.split(/\s+/).filter(word => word.length > 0).length;

    const newAnswer: AnswerPractice = {
      ...answerData,
      id: Date.now().toString(),
      createdAt: now,
      lastModified: now,
      wordCount
    };

    const updatedAnswers = [...answerPractices, newAnswer];
    setAnswerPractices(updatedAnswers);
    saveAnswers(updatedAnswers);
    setShowAnswerPractice(false);
    toast.success('Answer practice saved successfully!');
  };

  const NoteForm = ({
    note,
    onSave,
    onCancel
  }: {
    note?: Note;
    onSave: (note: Omit<Note, 'id' | 'createdAt' | 'lastModified' | 'wordCount'> | Note) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      title: note?.title || '',
      content: note?.content || '',
      topic: note?.topic || '',
      tags: note?.tags.join(', ') || '',
      type: note?.type || 'note' as 'note' | 'answer' | 'bookmark',
      isFavorite: note?.isFavorite || false,
      isArchived: note?.isArchived || false
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.title || !formData.content) {
        toast.error('Please fill in title and content');
        return;
      }

      const noteData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };

      if (note) {
        onSave({ ...note, ...noteData });
      } else {
        onSave(noteData);
      }
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {note ? 'Edit Note' : 'Add New Note'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter note title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Topic
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Ancient History"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="e.g., mauryan, administration, ancient-india"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={8}
              placeholder="Write your note content here..."
              required
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isFavorite}
                onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Mark as favorite</span>
            </label>
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {note ? 'Update' : 'Save'} Note
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const AnswerPracticeForm = ({
    onSave,
    onCancel
  }: {
    onSave: (answer: Omit<AnswerPractice, 'id' | 'createdAt' | 'lastModified' | 'wordCount'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      question: '',
      answer: '',
      topic: '',
      examType: 'mains' as 'prelims' | 'mains',
      timeSpent: 0
    });
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [isWriting, setIsWriting] = useState(false);

    const startTimer = () => {
      setStartTime(new Date());
      setIsWriting(true);
    };

    const stopTimer = () => {
      if (startTime) {
        const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60));
        setFormData({ ...formData, timeSpent });
      }
      setIsWriting(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.question || !formData.answer) {
        toast.error('Please fill in question and answer');
        return;
      }

      if (isWriting) {
        stopTimer();
      }

      onSave(formData);
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Answer Writing Practice
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Topic
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Polity"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Exam Type
              </label>
              <select
                value={formData.examType}
                onChange={(e) => setFormData({ ...formData, examType: e.target.value as 'prelims' | 'mains' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="prelims">Prelims</option>
                <option value="mains">Mains</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Question *
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder="Enter the question you want to practice..."
              required
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Answer *
              </label>
              <div className="flex items-center space-x-2">
                {!isWriting ? (
                  <button
                    type="button"
                    onClick={startTimer}
                    className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Start Timer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopTimer}
                    className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Stop Timer
                  </button>
                )}
                {isWriting && startTime && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60))} min
                  </span>
                )}
              </div>
            </div>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={12}
              placeholder="Write your answer here..."
              required
            />
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Word count: {formData.answer.split(/\s+/).filter(word => word.length > 0).length}
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Answer
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Show loading state until data is loaded
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading knowledge base...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Knowledge Base</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your personal digital library for notes, answer practice, and study materials.
        </p>

        {/* Keyboard Shortcuts Info */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-xs text-blue-700 dark:text-blue-300 flex flex-wrap gap-4">
            <span>↑↓ Navigate notes</span>
            <span>Enter Edit selected</span>
            <span>Esc Cancel/Close</span>
            <span>👁️ View read-only</span>
            <span>✏️ Edit note</span>
            <span>🗑️ Delete note</span>
          </div>
        </div>
      </div>

      {/* Search, Filter, and Action Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes, answers, and bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                showPreview
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={showPreview ? 'Hide content preview' : 'Show content preview'}
            >
              {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
              Preview
            </button>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Items</option>
              <option value="note">Notes</option>
              <option value="answer">Answers</option>
              <option value="bookmark">Bookmarks</option>
              <option value="favorites">Favorites</option>
            </select>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Topics</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
            <button
              onClick={() => setShowAddNote(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </button>
            <button
              onClick={() => setShowAnswerPractice(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <PenTool className="h-4 w-4 mr-2" />
              Practice Answer
            </button>
          </div>
        </div>
      </div>

      {/* Forms */}
      {showAddNote && (
        <NoteForm
          onSave={addNote}
          onCancel={() => setShowAddNote(false)}
        />
      )}

      {editingNote && (
        <NoteForm
          note={editingNote}
          onSave={updateNote}
          onCancel={() => setEditingNote(null)}
        />
      )}

      {showAnswerPractice && (
        <AnswerPracticeForm
          onSave={addAnswerPractice}
          onCancel={() => setShowAnswerPractice(false)}
        />
      )}

      {/* View Note Modal */}
      {viewingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{viewingNote.title}</h2>
                <button
                  onClick={() => setViewingNote(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  {viewingNote.topic}
                </span>
                <span>{new Date(viewingNote.lastModified).toLocaleDateString()}</span>
                <span>{viewingNote.wordCount} words</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {viewingNote.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-gray-900 dark:text-white">
                  {viewingNote.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotes.map((note) => (
              <div key={note.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {note.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                        {note.topic}
                      </span>
                      <span>{new Date(note.lastModified).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleFavorite(note.id)}
                      className={`p-1 rounded transition-colors ${
                        note.isFavorite
                          ? 'text-yellow-500'
                          : 'text-gray-400 hover:text-yellow-500'
                      }`}
                      title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`h-4 w-4 ${note.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => setViewingNote(note)}
                      className="p-1 rounded transition-colors text-gray-400 hover:text-blue-500"
                      title="View note in read-only mode"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => copyNoteContent(note)}
                      className="p-1 rounded transition-colors text-gray-400 hover:text-purple-500"
                      title="Copy note content to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingNote(note)}
                      className="p-1 rounded transition-colors text-gray-400 hover:text-green-500"
                      title="Edit this note"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="p-1 rounded transition-colors text-gray-400 hover:text-red-500"
                      title="Delete this note"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3">
                  {note.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{note.tags.length - 3} more
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {note.wordCount} words
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No items found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first note or practicing answer writing'}
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowAddNote(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </button>
                <button
                  onClick={() => setShowAnswerPractice(true)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <PenTool className="h-4 w-4 mr-2" />
                  Practice Answer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Notes</span>
                <span className="font-medium text-gray-900 dark:text-white">{notes.filter(n => n.type === 'note').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Answer Practice</span>
                <span className="font-medium text-blue-600">{answerPractices.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Favorites</span>
                <span className="font-medium text-yellow-600">{notes.filter(n => n.isFavorite).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Words</span>
                <span className="font-medium text-green-600">{notes.reduce((sum, note) => sum + note.wordCount, 0)}</span>
              </div>
            </div>
          </div>

          {/* Recent Answer Practices */}
          {answerPractices.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Answer Practice</h3>
              <div className="space-y-3">
                {answerPractices.slice(0, 3).map((answer) => (
                  <div key={answer.id} className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                      {answer.question}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                        {answer.topic}
                      </span>
                      <span>{answer.timeSpent}min</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Tags */}
          {notes.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(notes.flatMap(note => note.tags)))
                  .slice(0, 10)
                  .map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSearchTerm(tag)}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
