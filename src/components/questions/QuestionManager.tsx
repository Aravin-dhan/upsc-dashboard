'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Upload,
  BarChart3,
  BookOpen,
  Clock,
  TrendingUp
} from 'lucide-react';
import { QuestionStats, ParseLogEntry } from '@/types/questions';
import { useAuth } from '@/contexts/AuthContext';

interface QuestionManagerProps {
  tenantId?: string;
}

export default function QuestionManager({ tenantId }: QuestionManagerProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [stats, setStats] = useState<QuestionStats | null>(null);
  const [parseLog, setParseLog] = useState<ParseLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'years' | 'difficulty'>('overview');
  const [dataInfo, setDataInfo] = useState({
    questionsCount: 0,
    papersCount: 0,
    storageSize: 0
  });

  useEffect(() => {
    loadDataInfo();
  }, [tenantId]);

  const loadDataInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/questions/parse?tenantId=${tenantId || 'default'}`);
      const result = await response.json();
      
      if (result.success) {
        setDataInfo(result.data);
        setStats(result.data.stats);
      }
    } catch (error) {
      console.error('Error loading data info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleParseQuestions = async () => {
    setIsParsing(true);
    try {
      const response = await fetch('/api/questions/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tenantId: tenantId || 'default' }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data.stats);
        setParseLog(result.data.parseLog);
        setDataInfo({
          questionsCount: result.data.totalQuestions,
          papersCount: result.data.totalPapers,
          storageSize: 0 // Will be updated on next load
        });
        
        // Show success message
        alert(`Successfully parsed ${result.data.totalQuestions} questions from ${result.data.totalPapers} papers!`);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error parsing questions:', error);
      alert('Failed to parse questions. Please try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Question Bank Manager</h2>
          <p className="text-gray-600">Manage UPSC Previous Year Questions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleParseQuestions}
            disabled={isParsing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isParsing ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Parsing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Parse Questions
              </>
            )}
          </button>
          <button
            onClick={loadDataInfo}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dataInfo.questionsCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Question Papers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dataInfo.papersCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatBytes(dataInfo.storageSize)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Years Covered</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats ? Object.keys(stats.byYear).length : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      {stats && (
        <div className="w-full">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('subjects')}
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'subjects' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Subjects
            </button>
            <button
              onClick={() => setActiveTab('years')}
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'years' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Years
            </button>
            <button
              onClick={() => setActiveTab('difficulty')}
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'difficulty' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Difficulty
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exam Type Distribution</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2">
                      {Object.entries(stats.byExamType).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{type}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-blue-500 rounded-full"
                                style={{ width: `${(count / stats.totalQuestions) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Paper Type Distribution</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2">
                      {Object.entries(stats.byPaperType).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{type}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-green-500 rounded-full"
                                style={{ width: `${(count / stats.totalQuestions) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subjects' && (
            <div className="mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Subject-wise Question Distribution</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(stats.bySubject).map(([subject, count]) => (
                      <div key={subject} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="font-medium text-gray-900 dark:text-white">{subject}</span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">{count} questions</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'years' && (
            <div className="mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Year-wise Question Distribution</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(stats.byYear)
                      .sort(([a], [b]) => parseInt(b) - parseInt(a))
                      .map(([year, count]) => (
                      <div key={year} className="text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">{year}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{count} questions</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'difficulty' && (
            <div className="mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Difficulty Level Distribution</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(stats.byDifficulty).map(([difficulty, count]) => {
                      const colors = {
                        Easy: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700',
                        Medium: 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700',
                        Hard: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700'
                      };

                      return (
                        <div key={difficulty} className={`text-center p-6 rounded-lg border ${colors[difficulty as keyof typeof colors]}`}>
                          <div className="text-3xl font-bold">{count}</div>
                          <div className="text-sm font-medium">{difficulty}</div>
                          <div className="text-xs opacity-75">
                            {((count / stats.totalQuestions) * 100).toFixed(1)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Parse Log */}
      {parseLog.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Parse Log</h3>
          </div>
          <div className="p-4">
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {parseLog.map((entry) => (
                <div key={entry.id} className="flex items-center gap-2 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      entry.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      entry.status === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {entry.status}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">{entry.fileName}</span>
                  <span className="text-gray-600 dark:text-gray-400">{entry.message}</span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
