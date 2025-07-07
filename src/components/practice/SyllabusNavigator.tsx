'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronRight, ChevronDown, BookOpen, Target, Clock, BarChart3,
  Filter, Search, Star, TrendingUp, Award, Brain, CheckCircle,
  Circle, Play, Shuffle, Settings, Info, ArrowRight
} from 'lucide-react';
import { 
  syllabusStructure, 
  getSyllabusNode, 
  getChildNodes, 
  getAllSubtopics,
  searchSyllabus,
  getRecommendedStudyOrder
} from '@/data/syllabusStructure';
import type { SyllabusNode, EnhancedQuestion } from '@/data/syllabusStructure';

interface SyllabusNavigatorProps {
  onTopicSelect: (topicId: string, questions: EnhancedQuestion[]) => void;
  selectedTopic?: string;
  completedTopics: string[];
  topicProgress: { [topicId: string]: { attempted: number; correct: number; total: number } };
  showQuestionCount?: boolean;
  enableFiltering?: boolean;
}

export default function SyllabusNavigator({
  onTopicSelect,
  selectedTopic,
  completedTopics = [],
  topicProgress = {},
  showQuestionCount = true,
  enableFiltering = true
}: SyllabusNavigatorProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['prelims', 'gs-paper-1']));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<{
    difficulty?: 'easy' | 'medium' | 'hard';
    relevance?: 'high' | 'medium' | 'low';
    level?: 'paper' | 'section' | 'topic' | 'subtopic';
    completed?: boolean;
  }>({});
  const [viewMode, setViewMode] = useState<'tree' | 'list' | 'recommended'>('tree');
  const [searchResults, setSearchResults] = useState<SyllabusNode[]>([]);

  // Search functionality
  useEffect(() => {
    if (searchTerm.length > 2) {
      const results = searchSyllabus(searchTerm);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 dark:text-green-400';
    if (progress >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (progress >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressBg = (progress: number) => {
    if (progress >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (progress >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30';
    if (progress >= 40) return 'bg-orange-100 dark:bg-orange-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Circle className="h-3 w-3 text-green-500" />;
      case 'medium': return <Target className="h-3 w-3 text-yellow-500" />;
      case 'hard': return <Star className="h-3 w-3 text-red-500" />;
      default: return <Circle className="h-3 w-3 text-gray-400" />;
    }
  };

  const getRelevanceIndicator = (relevance: string) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return <div className={`w-2 h-2 rounded-full ${colors[relevance as keyof typeof colors] || 'bg-gray-400'}`} />;
  };

  const handleTopicClick = (node: SyllabusNode) => {
    if (node.level === 'subtopic' || node.children.length === 0) {
      // Generate mock questions for the topic
      const mockQuestions: EnhancedQuestion[] = generateMockQuestions(node);
      onTopicSelect(node.id, mockQuestions);
    } else {
      toggleNode(node.id);
    }
  };

  const generateMockQuestions = (node: SyllabusNode): EnhancedQuestion[] => {
    // Disabled for production - no mock questions generated
    console.warn('Mock question generation is disabled in production');
    return [];

    // This would normally fetch from a question bank
    // For now, generating mock questions based on the topic
    const questionCount = Math.min(node.previousYearQuestions || 5, 10);
    const questions: EnhancedQuestion[] = [];

    for (let i = 0; i < questionCount; i++) {
      questions.push({
        id: `${node.id}-q${i + 1}`,
        question: `Sample question ${i + 1} for ${node.name}. This question tests your understanding of ${node.keyTopics[0] || 'the topic'}.`,
        options: [
          'Option A - First possible answer',
          'Option B - Second possible answer', 
          'Option C - Third possible answer',
          'Option D - Fourth possible answer'
        ],
        correctAnswer: Math.floor(Math.random() * 4),
        explanation: `This question relates to ${node.name} and specifically tests knowledge of ${node.keyTopics.join(', ')}. The correct answer demonstrates understanding of key concepts.`,
        difficulty: node.difficulty,
        syllabusIds: [node.id],
        tags: node.tags,
        source: 'UPSC Previous Year',
        year: 2020 + Math.floor(Math.random() * 4),
        upscRelevance: node.upscRelevance,
        conceptsCovered: node.keyTopics,
        relatedTopics: [],
        timeToSolve: 90,
        commonMistakes: ['Misunderstanding the concept', 'Confusing with related topics'],
        hints: ['Focus on the key concept', 'Eliminate obviously wrong options'],
        references: node.recommendedSources
      });
    }

    return questions;
  };

  const renderTreeNode = (node: SyllabusNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children.length > 0;
    const isSelected = selectedTopic === node.id;
    const isCompleted = completedTopics.includes(node.id);
    const progress = topicProgress[node.id];
    const progressPercentage = progress ? Math.round((progress.correct / progress.total) * 100) : 0;

    // Apply filters
    if (selectedFilters.difficulty && node.difficulty !== selectedFilters.difficulty) return null;
    if (selectedFilters.relevance && node.upscRelevance !== selectedFilters.relevance) return null;
    if (selectedFilters.level && node.level !== selectedFilters.level) return null;
    if (selectedFilters.completed !== undefined && isCompleted !== selectedFilters.completed) return null;

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center py-2 px-3 rounded-lg cursor-pointer transition-colors ${
            isSelected 
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
          onClick={() => handleTopicClick(node)}
        >
          {/* Expand/Collapse Icon */}
          <div className="w-4 h-4 mr-2 flex items-center justify-center">
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-3 w-3 text-gray-400" />
              ) : (
                <ChevronRight className="h-3 w-3 text-gray-400" />
              )
            ) : (
              <div className="w-3 h-3" />
            )}
          </div>

          {/* Completion Status */}
          <div className="mr-2">
            {isCompleted ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : progress ? (
              <div className={`w-4 h-4 rounded-full border-2 border-current ${getProgressColor(progressPercentage)}`}>
                <div 
                  className={`w-full h-full rounded-full ${getProgressBg(progressPercentage)}`}
                  style={{ 
                    background: `conic-gradient(currentColor ${progressPercentage * 3.6}deg, transparent 0deg)` 
                  }}
                />
              </div>
            ) : (
              <Circle className="h-4 w-4 text-gray-400" />
            )}
          </div>

          {/* Topic Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className={`font-medium text-sm ${
                node.level === 'paper' ? 'text-blue-600 dark:text-blue-400' :
                node.level === 'section' ? 'text-purple-600 dark:text-purple-400' :
                node.level === 'topic' ? 'text-green-600 dark:text-green-400' :
                'text-gray-700 dark:text-gray-300'
              }`}>
                {node.name}
              </span>
              {getRelevanceIndicator(node.upscRelevance)}
              {getDifficultyIcon(node.difficulty)}
            </div>
            
            {/* Progress and Stats */}
            {progress && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {progress.correct}/{progress.total} correct ({progressPercentage}%)
              </div>
            )}
          </div>

          {/* Question Count and Study Time */}
          {showQuestionCount && (
            <div className="text-xs text-gray-500 dark:text-gray-400 ml-2 text-right">
              <div>{node.previousYearQuestions} Qs</div>
              <div>{node.estimatedStudyHours}h</div>
            </div>
          )}

          {/* Exam Frequency Indicator */}
          <div className="ml-2">
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={`w-1 h-3 rounded ${
                    i < Math.ceil(node.examFrequency / 2) 
                      ? 'bg-blue-500' 
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Render Children */}
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {node.children.map(childId => {
              const childNode = getSyllabusNode(childId);
              return childNode ? renderTreeNode(childNode, depth + 1) : null;
            })}
          </div>
        )}
      </div>
    );
  };

  const renderListView = () => {
    const allSubtopics = getAllSubtopics('prelims');
    const filteredSubtopics = allSubtopics.filter(node => {
      if (selectedFilters.difficulty && node.difficulty !== selectedFilters.difficulty) return false;
      if (selectedFilters.relevance && node.upscRelevance !== selectedFilters.relevance) return false;
      if (selectedFilters.completed !== undefined && completedTopics.includes(node.id) !== selectedFilters.completed) return false;
      return true;
    });

    return (
      <div className="space-y-2">
        {filteredSubtopics.map(node => (
          <div
            key={node.id}
            className={`p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer transition-colors ${
              selectedTopic === node.id 
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleTopicClick(node)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  {completedTopics.includes(node.id) ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{node.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    {getRelevanceIndicator(node.upscRelevance)}
                    {getDifficultyIcon(node.difficulty)}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {node.previousYearQuestions} questions • {node.estimatedStudyHours}h
                    </span>
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRecommendedView = () => {
    const allSubtopics = getAllSubtopics('prelims');
    const incompleteTopics = allSubtopics.filter(node => !completedTopics.includes(node.id));
    const recommended = getRecommendedStudyOrder(incompleteTopics.map(n => n.id))
      .slice(0, 10);

    return (
      <div className="space-y-3">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Recommended study order based on difficulty and exam frequency
        </div>
        {recommended.map((node, index) => (
          <div
            key={node.id}
            className={`p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer transition-colors ${
              selectedTopic === node.id 
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleTopicClick(node)}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{node.name}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  {getRelevanceIndicator(node.upscRelevance)}
                  {getDifficultyIcon(node.difficulty)}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {node.previousYearQuestions} questions • {node.estimatedStudyHours}h
                  </span>
                </div>
              </div>
              <Play className="h-4 w-4 text-blue-500" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">UPSC Syllabus</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('tree')}
              className={`p-1 rounded ${viewMode === 'tree' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}
            >
              <BookOpen className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('recommended')}
              className={`p-1 rounded ${viewMode === 'recommended' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}
            >
              <TrendingUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>

        {/* Filters */}
        {enableFiltering && (
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedFilters.difficulty || ''}
              onChange={(e) => setSelectedFilters(prev => ({ 
                ...prev, 
                difficulty: e.target.value as any || undefined 
              }))}
              className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              value={selectedFilters.relevance || ''}
              onChange={(e) => setSelectedFilters(prev => ({ 
                ...prev, 
                relevance: e.target.value as any || undefined 
              }))}
              className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Relevance</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {searchResults.length > 0 ? (
          <div className="space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Search results for "{searchTerm}"
            </div>
            {searchResults.map(node => renderTreeNode(node, 0))}
          </div>
        ) : viewMode === 'tree' ? (
          <div>
            {Object.values(syllabusStructure)
              .filter(node => node.level === 'paper')
              .map(node => renderTreeNode(node, 0))}
          </div>
        ) : viewMode === 'list' ? (
          renderListView()
        ) : (
          renderRecommendedView()
        )}
      </div>
    </div>
  );
}
