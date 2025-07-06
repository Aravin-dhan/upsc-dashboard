'use client';

import React from 'react';
import { Clock, CheckCircle, Circle, Plus, Calendar, ArrowRight, AlertCircle, RefreshCw, Play, Pause } from 'lucide-react';
import Link from 'next/link';
import { useSchedule } from '@/hooks/useSchedule';
import toast from 'react-hot-toast';

export default function TodaysSchedule() {
  const {
    todayEvents,
    loading,
    error,
    markComplete,
    markInProgress,
    refreshData
  } = useSchedule();

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getTypeColor = (type: string) => {
    const colors = {
      study: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      revision: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      practice: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      break: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
      exam: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      other: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'border-l-red-500',
      medium: 'border-l-yellow-500',
      low: 'border-l-green-500'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Play className="h-5 w-5 text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const handleQuickAction = async (eventId: string, action: 'complete' | 'start') => {
    try {
      if (action === 'complete') {
        await markComplete(eventId);
      } else {
        await markInProgress(eventId);
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Schedule</h3>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Schedule</h3>
          <button
            onClick={refreshData}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400 mb-2">Error loading schedule</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Schedule</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshData}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <Link
            href="/schedule"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
          >
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>

      {todayEvents.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No events scheduled for today</p>
          <Link
            href="/schedule"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {todayEvents.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className={`p-4 border-l-4 bg-gray-50 dark:bg-gray-700/50 rounded-r-lg ${getPriorityColor(event.priority)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <button
                    onClick={() => handleQuickAction(event.id, event.status === 'completed' ? 'start' : event.status === 'scheduled' ? 'start' : 'complete')}
                    className="flex-shrink-0"
                  >
                    {getStatusIcon(event.status)}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`font-medium text-sm ${
                        event.status === 'completed' 
                          ? 'text-gray-500 dark:text-gray-400 line-through' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {event.title}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                      </div>
                      {event.subject && (
                        <span className="text-blue-600 dark:text-blue-400">{event.subject}</span>
                      )}
                    </div>
                    
                    {event.notes && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 truncate">
                        {event.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {event.status === 'scheduled' && (
                    <button
                      onClick={() => handleQuickAction(event.id, 'start')}
                      className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                      title="Start event"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                  {event.status === 'in-progress' && (
                    <button
                      onClick={() => handleQuickAction(event.id, 'complete')}
                      className="p-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                      title="Mark complete"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {todayEvents.length > 5 && (
            <div className="text-center pt-2">
              <Link
                href="/schedule"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                View {todayEvents.length - 5} more events
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {todayEvents.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {todayEvents.filter(e => e.status === 'completed').length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {todayEvents.filter(e => e.status === 'scheduled' && new Date(e.startTime) > new Date()).length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Upcoming</div>
          </div>
        </div>
      </div>
    </div>
  );
}
