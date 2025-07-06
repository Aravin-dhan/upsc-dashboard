'use client';

import { useState, useEffect } from 'react';
import {
  Calendar, Clock, Plus, Edit3, Trash2, Play, CheckCircle,
  ChevronLeft, ChevronRight, Save, X, Grid3X3, List,
  Download, Upload, Settings, Filter, Search, MapPin, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  type: 'study' | 'revision' | 'answer_writing' | 'mock_test' | 'current_affairs' | 'break' | 'exercise' | 'exam' | 'personal';
  subject?: string;
  startTime: string;
  endTime: string;
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'completed' | 'in-progress';
  notes?: string;
  tags?: string[];
  reminders?: {
    enabled: boolean;
    minutes: number;
  };
  recurring?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  progress?: number; // 0-100
  createdAt: string;
  updatedAt: string;
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'calendar'>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleEvent[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<ScheduleEvent>({
    id: '',
    title: '',
    description: '',
    type: 'study',
    subject: '',
    startTime: '',
    endTime: '',
    priority: 'medium',
    status: 'scheduled',
    notes: '',
    tags: [],
    reminders: { enabled: true, minutes: 15 },
    recurring: { enabled: false, frequency: 'daily' },
    createdAt: '',
    updatedAt: '',
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSchedule = localStorage.getItem('upsc-schedule');
      if (savedSchedule) {
        setScheduleBlocks(JSON.parse(savedSchedule));
      } else {
        setScheduleBlocks(getDefaultSchedule());
      }
    }
  }, []);

  // Save data to localStorage whenever scheduleBlocks changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-schedule', JSON.stringify(scheduleBlocks));
    }
  }, [scheduleBlocks]);

  const getDefaultSchedule = (): ScheduleEvent[] => [
    { id: '1', title: 'Morning Exercise', type: 'exercise', startTime: '06:00', endTime: '07:00', duration: 60, difficulty: 'easy', status: 'scheduled', progress: 0, date: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', title: 'Modern History - Freedom Struggle', type: 'study', subject: 'History', startTime: '08:00', endTime: '10:00', duration: 120, difficulty: 'medium', status: 'scheduled', progress: 0, date: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', title: 'Break', type: 'break', startTime: '10:00', endTime: '10:15', duration: 15, difficulty: 'easy', status: 'scheduled', progress: 0, date: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '4', title: 'Current Affairs Analysis', type: 'current_affairs', startTime: '10:15', endTime: '11:45', duration: 90, difficulty: 'medium', status: 'scheduled', progress: 0, date: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '5', title: 'Answer Writing - Ethics', type: 'answer_writing', subject: 'Ethics', startTime: '14:00', endTime: '16:00', duration: 120, difficulty: 'hard', status: 'scheduled', progress: 0, date: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '6', title: 'Geography Revision - Climate', type: 'revision', subject: 'Geography', startTime: '16:30', endTime: '18:00', duration: 90, difficulty: 'medium', status: 'scheduled', progress: 0, date: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ].map(block => ({ ...block, id: Math.random().toString(36).substr(2, 9) })); // Generate unique IDs

  // Get events for the selected date
  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return scheduleBlocks.filter(event => event.date === dateString);
  };

  const selectedDateEvents = getEventsForDate(new Date(selectedDate));

  // Study templates for quick creation
  const studyTemplates = {
    'History Reading': { type: 'study', subject: 'History', difficulty: 'medium', estimatedDuration: 120 },
    'Geography Revision': { type: 'revision', subject: 'Geography', difficulty: 'medium', estimatedDuration: 90 },
    'Polity Notes': { type: 'study', subject: 'Polity', difficulty: 'hard', estimatedDuration: 90 },
    'Economics Analysis': { type: 'study', subject: 'Economics', difficulty: 'hard', estimatedDuration: 120 },
    'Current Affairs Review': { type: 'current_affairs', subject: 'Current Affairs', difficulty: 'medium', estimatedDuration: 60 },
    'Answer Writing Practice': { type: 'answer_writing', subject: 'General', difficulty: 'hard', estimatedDuration: 120 },
    'Mock Test Analysis': { type: 'mock_test', subject: 'General', difficulty: 'hard', estimatedDuration: 180 },
    'Science & Technology': { type: 'study', subject: 'Science', difficulty: 'medium', estimatedDuration: 90 },
    'Environment Study': { type: 'study', subject: 'Environment', difficulty: 'easy', estimatedDuration: 75 },
    'Ethics Case Studies': { type: 'study', subject: 'Ethics', difficulty: 'hard', estimatedDuration: 90 }
  };

  // Time slot options (15-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 5; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Check for time conflicts
  const checkTimeConflict = (startTime: string, endTime: string, excludeId?: string) => {
    const newStart = new Date(`2000-01-01T${startTime}`);
    const newEnd = new Date(`2000-01-01T${endTime}`);

    return scheduleBlocks.some(block => {
      if (block.id === excludeId || block.date !== selectedDate) return false;

      const blockStart = new Date(`2000-01-01T${block.startTime}`);
      const blockEnd = new Date(`2000-01-01T${block.endTime}`);

      return (newStart < blockEnd && newEnd > blockStart);
    });
  };

  // Calculate recommended break time
  const getRecommendedBreakTime = (difficulty: string, duration: number) => {
    const baseBreak = Math.max(15, Math.floor(duration * 0.1)); // 10% of duration, minimum 15 min
    const difficultyMultiplier = difficulty === 'hard' ? 1.5 : difficulty === 'medium' ? 1.2 : 1;
    return Math.round(baseBreak * difficultyMultiplier);
  };

  // Validate daily study limits
  const validateDailyLimits = (newDuration: number) => {
    const todayStudyBlocks = scheduleBlocks.filter(block =>
      block.date === selectedDate &&
      ['study', 'revision', 'answer_writing', 'current_affairs', 'mock_test'].includes(block.type)
    );

    const totalStudyTime = todayStudyBlocks.reduce((sum, block) => sum + block.duration, 0) + newDuration;
    const maxDailyStudy = 12 * 60; // 12 hours in minutes

    return totalStudyTime <= maxDailyStudy;
  };

  const addScheduleBlock = () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      toast.error('Please fill all required fields');
      return;
    }

    // Create full datetime strings for the selected date
    const startDateTime = new Date(`${selectedDate}T${newEvent.startTime}`);
    const endDateTime = new Date(`${selectedDate}T${newEvent.endTime}`);

    if (endDateTime <= startDateTime) {
      toast.error('End time must be after start time');
      return;
    }

    const duration = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);

    // Check for time conflicts
    if (checkTimeConflict(newEvent.startTime, newEvent.endTime)) {
      toast.error('Time conflict detected! Please choose a different time slot.');
      return;
    }

    // Validate daily study limits
    if (!validateDailyLimits(duration)) {
      toast.error('Daily study limit exceeded! Maximum 12 hours of study per day recommended.');
      return;
    }

    const newBlock: ScheduleEvent = {
      id: Date.now().toString(), // Simple unique ID
      title: newEvent.title,
      description: newEvent.description,
      type: newEvent.type,
      subject: newEvent.subject,
      startTime: startDateTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      endTime: endDateTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      duration: duration,
      difficulty: (newEvent as any).difficulty || 'medium',
      priority: newEvent.priority,
      status: 'scheduled',
      notes: newEvent.notes,
      tags: newEvent.tags,
      reminders: newEvent.reminders,
      recurring: newEvent.recurring,
      progress: 0,
      date: selectedDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setScheduleBlocks(prev => [...prev, newBlock]);

    // Suggest break time for intensive sessions
    if (duration >= 90 && newEvent.priority === 'high') {
      const breakTime = getRecommendedBreakTime('hard', duration);
      toast.success(`Schedule event added! Consider a ${breakTime}-minute break after this session.`);
    }

    // Reset form
    setNewEvent({
      id: '',
      title: '',
      description: '',
      type: 'study',
      subject: '',
      startTime: '',
      endTime: '',
      priority: 'medium',
      status: 'scheduled',
      notes: '',
      tags: [],
      reminders: { enabled: true, minutes: 15 },
      recurring: { enabled: false, frequency: 'daily' },
      createdAt: '',
      updatedAt: '',
    });

    setShowAddForm(false);
  };

  const toggleCompletion = (id: string) => {
    setScheduleBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === id
          ? { ...block, status: block.status === 'completed' ? 'scheduled' : 'completed', progress: block.status === 'completed' ? 0 : 100, updatedAt: new Date().toISOString() }
          : block
      )
    );
    const block = scheduleBlocks.find(b => b.id === id);
    if (block) {
      toast.success(block.status === 'completed' ? 'Block marked as incomplete' : 'Block completed!');
    }
  };

  const updateProgress = (id: string, progress: number) => {
    setScheduleBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === id
          ? { ...block, progress: progress, status: progress === 100 ? 'completed' : 'in-progress', updatedAt: new Date().toISOString() }
          : block
      )
    );
    toast.success('Progress updated!');
  };

  const startEdit = (event: ScheduleEvent) => {
    setEditingEvent(event.id);
    setNewEvent({
      id: event.id,
      title: event.title,
      description: event.description || '',
      type: event.type,
      subject: event.subject || '',
      startTime: event.startTime,
      endTime: event.endTime,
      priority: event.priority,
      status: event.status,
      notes: event.notes || '',
      tags: event.tags || [],
      reminders: event.reminders || { enabled: true, minutes: 15 },
      recurring: event.recurring || { enabled: false, frequency: 'daily' },
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      // Add difficulty and location if they are part of ScheduleEvent
      difficulty: (event as any).difficulty || 'medium',
      location: (event as any).location || '',
    });
    setShowAddForm(true);
  };

  const saveEdit = () => {
    if (!editingEvent) return;

    const startDateTime = new Date(`${selectedDate}T${newEvent.startTime}`);
    const endDateTime = new Date(`${selectedDate}T${newEvent.endTime}`);

    if (endDateTime <= startDateTime) {
      toast.error('End time must be after start time');
      return;
    }

    const duration = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);

    // Check for time conflicts (excluding current event)
    if (checkTimeConflict(newEvent.startTime, newEvent.endTime, editingEvent)) {
      toast.error('Time conflict detected! Please choose a different time slot.');
      return;
    }

    setScheduleBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === editingEvent
          ? {
              ...block,
              title: newEvent.title,
              description: newEvent.description,
              type: newEvent.type,
              subject: newEvent.subject,
              startTime: newEvent.startTime,
              endTime: newEvent.endTime,
              duration: duration,
              difficulty: (newEvent as any).difficulty || 'medium',
              priority: newEvent.priority,
              status: newEvent.status,
              notes: newEvent.notes,
              tags: newEvent.tags,
              reminders: newEvent.reminders,
              recurring: newEvent.recurring,
              updatedAt: new Date().toISOString(),
              location: (newEvent as any).location || '',
            }
          : block
      )
    );

    toast.success('Schedule event updated successfully!');

    setEditingEvent(null);
    setNewEvent({
      id: '',
      title: '',
      description: '',
      type: 'study',
      subject: '',
      startTime: '',
      endTime: '',
      priority: 'medium',
      status: 'scheduled',
      notes: '',
      tags: [],
      reminders: { enabled: true, minutes: 15 },
      recurring: { enabled: false, frequency: 'daily' },
      createdAt: '',
      updatedAt: '',
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setNewEvent({
      id: '',
      title: '',
      description: '',
      type: 'study',
      subject: '',
      startTime: '',
      endTime: '',
      priority: 'medium',
      status: 'scheduled',
      notes: '',
      tags: [],
      reminders: { enabled: true, minutes: 15 },
      recurring: { enabled: false, frequency: 'daily' },
      createdAt: '',
      updatedAt: '',
    });
    setShowAddForm(false);
  };

  const deleteBlock = (id: string) => {
    setScheduleBlocks(prevBlocks => prevBlocks.filter(block => block.id !== id));
    toast.success('Schedule event deleted');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'study': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800';
      case 'revision': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-200 dark:border-purple-800';
      case 'answer_writing': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800';
      case 'current_affairs': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-200 dark:border-orange-800';
      case 'break': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
      case 'exercise': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800';
      case 'mock_test': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const todayBlocks = scheduleBlocks
    .filter(block => block.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const totalStudyTime = todayBlocks
    .filter(block => ['study', 'revision', 'answer_writing', 'current_affairs'].includes(block.type))
    .reduce((sum, block) => sum + block.duration, 0);

  const completedTime = todayBlocks
    .filter(block => block.isCompleted && ['study', 'revision', 'answer_writing', 'current_affairs'].includes(block.type))
    .reduce((sum, block) => sum + block.duration, 0);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Schedule</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Plan and track your daily study schedule with time blocks and progress monitoring.
        </p>
      </div>

      {/* Date Selector and Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-blue-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex space-x-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-blue-600">{Math.round(totalStudyTime / 60 * 10) / 10}h</div>
              <div className="text-gray-500 dark:text-gray-400">Planned</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600">{Math.round(completedTime / 60 * 10) / 10}h</div>
              <div className="text-gray-500 dark:text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-purple-600">{totalStudyTime > 0 ? Math.round((completedTime / totalStudyTime) * 100) : 0}%</div>
              <div className="text-gray-500 dark:text-gray-400">Progress</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Blocks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Today's Schedule</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Block
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingEvent ? 'Edit Schedule Block' : 'Add Schedule Block'}
              </h3>

              {/* Study Templates */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quick Templates
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.keys(studyTemplates).map(template => (
                    <button
                      key={template}
                      onClick={() => {
                        const templateData = studyTemplates[template as keyof typeof studyTemplates];
                        setNewEvent({
                          ...newEvent,
                          title: template,
                          type: templateData.type as ScheduleEvent['type'],
                          subject: templateData.subject,
                          difficulty: templateData.difficulty as 'easy' | 'medium' | 'hard',
                        });
                      }}
                      className="px-3 py-2 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as ScheduleEvent['type'] })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="study">Study</option>
                  <option value="revision">Revision</option>
                  <option value="practice">Practice</option>
                  <option value="break">Break</option>
                  <option value="exam">Exam</option>
                  <option value="other">Other</option>
                </select>

                <input
                  type="text"
                  placeholder="Subject (optional)"
                  value={newEvent.subject}
                  onChange={(e) => setNewEvent({ ...newEvent, subject: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />

                <select
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Start Time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>

                <select
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">End Time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>

                <select
                  value={newEvent.difficulty}
                  onChange={(e) => setNewEvent({ ...newEvent, difficulty: e.target.value as ScheduleEvent['difficulty'] })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                <select
                  value={newEvent.priority}
                  onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value as ScheduleEvent['priority'] })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>

                <input
                  type="text"
                  placeholder="Location (optional)"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />

                <div className="md:col-span-2">
                  <textarea
                    placeholder="Notes (optional)"
                    value={newEvent.notes}
                    onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Time conflict warning */}
              {newEvent.startTime && newEvent.endTime && checkTimeConflict(newEvent.startTime, newEvent.endTime) && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    ⚠️ Time conflict detected! This overlaps with an existing schedule event.
                  </p>
                </div>
              )}

              <div className="mt-4 flex space-x-2">
                <button
                  onClick={editingEvent ? saveEdit : addScheduleBlock}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={newEvent.startTime && newEvent.endTime && checkTimeConflict(newEvent.startTime, newEvent.endTime, editingEvent || undefined)}
                >
                  <Save className="h-4 w-4 mr-2 inline" />
                  {editingEvent ? 'Save Changes' : 'Add Event'}
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4 mr-2 inline" />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Schedule List */}
          <div className="space-y-3">
            {todayBlocks.map((block) => (
              <div key={block.id} className={`p-4 rounded-lg border transition-all ${
                block.isCompleted
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : block.hasConflict
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-4 flex-1">
                    <button
                      onClick={() => toggleCompletion(block.id)}
                      className={`p-1 rounded-full transition-colors mt-1 ${
                        block.isCompleted ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
                      }`}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium ${block.isCompleted ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {block.title}
                        </h3>
                        {block.subject && (
                          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded dark:bg-gray-700 dark:text-gray-400">
                            {block.subject}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{block.startTime} - {block.endTime}</span>
                        </div>
                        <span>({block.duration} min)</span>
                        {/* {block.estimatedDuration && block.estimatedDuration !== block.duration && (
                          <span className="text-orange-600 dark:text-orange-400">
                            (Est: {block.estimatedDuration} min)
                          </span>
                        )} */}
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{block.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${block.progress}%` }}
                          ></div>
                        </div>

                        {/* Progress buttons */}
                        <div className="flex space-x-1 mt-2">
                          {[25, 50, 75, 100].map(progress => (
                            <button
                              key={progress}
                              onClick={() => updateProgress(block.id, progress)}
                              className={`px-2 py-1 text-xs rounded transition-colors ${
                                block.progress >= progress
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                              }`}
                            >
                              {progress}%
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(block.type)}`}>
                      {block.type.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(block.difficulty)}`}>
                      {block.difficulty}
                    </span>
                    <button
                      onClick={() => startEdit(block)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit block"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteBlock(block.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete block"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {todayBlocks.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No schedule blocks for this date. Click "Add Block" to get started.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => {
                setNewEvent({ ...newEvent, type: 'study', title: 'Study Session' });
                setShowAddForm(true);
              }}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              📚 Add Study Block
            </button>
            <button
              onClick={() => {
                setNewEvent({ ...newEvent, type: 'revision', title: 'Revision Session' });
                setShowAddForm(true);
              }}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              🔄 Add Revision Block
            </button>
            <button
              onClick={() => {
                setNewEvent({ ...newEvent, type: 'answer_writing', title: 'Answer Writing Practice' });
                setShowAddForm(true);
              }}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              ✍️ Add Answer Writing
            </button>
            <button
              onClick={() => {
                setNewEvent({ ...newEvent, type: 'mock_test', title: 'Mock Test' });
                setShowAddForm(true);
              }}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              📝 Add Mock Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
