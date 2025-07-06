'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Plus, Download, Upload, 
  ChevronLeft, ChevronRight, Clock, MapPin, Users,
  Edit, Trash2, Save, X, FileText, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createEvent, EventAttributes } from 'ics';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number; // in minutes
  location?: string;
  category: 'study' | 'exam' | 'revision' | 'personal' | 'other';
  priority: 'low' | 'medium' | 'high';
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  subject?: string;
  topic?: string;
  studyGoal?: string;
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
  attachments?: string[];
  reminderMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

interface StudySchedule {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  events: CalendarEvent[];
  totalHours: number;
  completedHours: number;
  subjects: string[];
  createdAt: string;
  updatedAt: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [schedules, setSchedules] = useState<StudySchedule[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<StudySchedule | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'schedule'>('month');
  const [activeSchedule, setActiveSchedule] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load events from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEvents = localStorage.getItem('upsc-calendar-events');
      if (savedEvents) {
        try {
          setEvents(JSON.parse(savedEvents));
        } catch (error) {
          console.error('Error loading events:', error);
          setEvents(getDefaultEvents());
        }
      } else {
        setEvents(getDefaultEvents());
      }
      setIsLoaded(true);
    }
  }, []);

  const getDefaultEvents = (): CalendarEvent[] => [
    {
      id: '1',
      title: 'UPSC Prelims 2025',
      description: 'UPSC Civil Services Preliminary Examination',
      date: '2025-06-08',
      time: '09:30',
      duration: 240,
      location: 'Examination Center',
      category: 'exam',
      priority: 'high',
      isRecurring: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Daily Current Affairs',
      description: 'Read and analyze current affairs from multiple sources',
      date: new Date().toISOString().split('T')[0],
      time: '07:00',
      duration: 60,
      category: 'study',
      priority: 'high',
      isRecurring: true,
      recurringPattern: 'daily',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const saveEvents = (eventsToSave: CalendarEvent[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('upsc-calendar-events', JSON.stringify(eventsToSave));
    }
  };

  const addEvent = (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    setShowAddForm(false);
    toast.success('Event added successfully!');
  };

  const updateEvent = (updatedEvent: CalendarEvent) => {
    const updatedEvents = events.map(event => 
      event.id === updatedEvent.id 
        ? { ...updatedEvent, updatedAt: new Date().toISOString() }
        : event
    );
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    setEditingEvent(null);
    toast.success('Event updated successfully!');
  };

  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    toast.success('Event deleted successfully!');
  };

  const exportToICS = () => {
    const icsEvents = events.map(event => {
      const startDate = new Date(`${event.date}T${event.time}`);
      const endDate = new Date(startDate.getTime() + event.duration * 60000);
      
      const icsEvent: EventAttributes = {
        start: [
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          startDate.getDate(),
          startDate.getHours(),
          startDate.getMinutes()
        ],
        end: [
          endDate.getFullYear(),
          endDate.getMonth() + 1,
          endDate.getDate(),
          endDate.getHours(),
          endDate.getMinutes()
        ],
        title: event.title,
        description: event.description,
        location: event.location || '',
        categories: [event.category],
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
        organizer: { name: 'UPSC Dashboard', email: 'noreply@upscdashboard.com' }
      };
      
      return icsEvent;
    });

    createEvent(icsEvents, (error, value) => {
      if (error) {
        toast.error('Failed to export calendar');
        return;
      }
      
      const blob = new Blob([value], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'upsc-calendar.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Calendar exported successfully!');
    });
  };

  const importFromICS = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      // Basic ICS parsing (simplified)
      const lines = content.split('\n');
      const importedEvents: CalendarEvent[] = [];
      
      let currentEvent: Partial<CalendarEvent> = {};
      
      lines.forEach(line => {
        const [key, value] = line.split(':');
        
        switch (key) {
          case 'BEGIN':
            if (value === 'VEVENT') {
              currentEvent = {};
            }
            break;
          case 'SUMMARY':
            currentEvent.title = value;
            break;
          case 'DESCRIPTION':
            currentEvent.description = value;
            break;
          case 'DTSTART':
            // Parse date/time from ICS format
            const startDate = new Date(value);
            currentEvent.date = startDate.toISOString().split('T')[0];
            currentEvent.time = startDate.toTimeString().slice(0, 5);
            break;
          case 'LOCATION':
            currentEvent.location = value;
            break;
          case 'END':
            if (value === 'VEVENT' && currentEvent.title) {
              const newEvent: CalendarEvent = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                title: currentEvent.title || 'Imported Event',
                description: currentEvent.description || '',
                date: currentEvent.date || new Date().toISOString().split('T')[0],
                time: currentEvent.time || '09:00',
                duration: 60,
                location: currentEvent.location,
                category: 'other',
                priority: 'medium',
                isRecurring: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              importedEvents.push(newEvent);
            }
            break;
        }
      });
      
      if (importedEvents.length > 0) {
        const updatedEvents = [...events, ...importedEvents];
        setEvents(updatedEvents);
        saveEvents(updatedEvents);
        toast.success(`Imported ${importedEvents.length} events successfully!`);
      } else {
        toast.error('No valid events found in the file');
      }
    };
    
    reader.readAsText(file);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exam': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'study': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'revision': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'personal': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-green-500';
      default: return 'border-l-4 border-gray-500';
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your study schedule, exams, and important dates with ICS support.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="file"
              accept=".ics"
              onChange={importFromICS}
              className="hidden"
              id="ics-import"
            />
            <label
              htmlFor="ics-import"
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import ICS
            </label>
            <button
              onClick={exportToICS}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export ICS
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Today
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {getDaysInMonth(currentDate).map((day, index) => {
            if (!day) {
              return <div key={index} className="p-2 h-24"></div>;
            }

            const dayEvents = getEventsForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = selectedDate?.toDateString() === day.toDateString();

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`p-2 h-24 border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                  {day.getDate()}
                </div>
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs px-1 py-0.5 rounded truncate ${getCategoryColor(event.category)}`}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Events for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>

          {getEventsForDate(selectedDate).length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No events scheduled for this date</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mx-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {getEventsForDate(selectedDate).map(event => (
                <div key={event.id} className={`p-4 rounded-lg border ${getPriorityColor(event.priority)} bg-gray-50 dark:bg-gray-700`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(event.category)}`}>
                          {event.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{event.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {event.time} ({event.duration} min)
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location}
                          </div>
                        )}
                        {event.isRecurring && (
                          <div className="flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Recurring {event.recurringPattern}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingEvent(event)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Event Form Modal */}
      {(showAddForm || editingEvent) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingEvent(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <EventForm
                event={editingEvent}
                onSave={editingEvent ? updateEvent : addEvent}
                onCancel={() => {
                  setShowAddForm(false);
                  setEditingEvent(null);
                }}
                selectedDate={selectedDate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Event Form Component
function EventForm({
  event,
  onSave,
  onCancel,
  selectedDate
}: {
  event?: CalendarEvent | null;
  onSave: (event: any) => void;
  onCancel: () => void;
  selectedDate?: Date | null;
}) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
    time: event?.time || '09:00',
    duration: event?.duration || 60,
    location: event?.location || '',
    category: event?.category || 'study' as 'study' | 'exam' | 'revision' | 'personal' | 'other',
    priority: event?.priority || 'medium' as 'low' | 'medium' | 'high',
    isRecurring: event?.isRecurring || false,
    recurringPattern: event?.recurringPattern || 'weekly' as 'daily' | 'weekly' | 'monthly'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (event) {
      onSave({ ...event, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter event title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Time *
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            min="15"
            step="15"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="study">Study</option>
            <option value="exam">Exam</option>
            <option value="revision">Revision</option>
            <option value="personal">Personal</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter location (optional)"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            rows={3}
            placeholder="Enter event description"
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Recurring event</span>
            </label>

            {formData.isRecurring && (
              <select
                value={formData.recurringPattern}
                onChange={(e) => setFormData({ ...formData, recurringPattern: e.target.value as any })}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            )}
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          {event ? 'Update' : 'Add'} Event
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
  );
}
