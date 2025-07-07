'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc,
  BookOpen,
  Clock,
  Target,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Question, QuestionFilter, QuestionSearchResult } from '@/types/questions';
import { useAuth } from '@/contexts/AuthContext';

interface QuestionSearchProps {
  tenantId?: string;
  onQuestionSelect?: (question: Question) => void;
  showFilters?: boolean;
  maxResults?: number;
}

export default function QuestionSearch({ 
  tenantId, 
  onQuestionSelect, 
  showFilters = true,
  maxResults = 50 
}: QuestionSearchProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<QuestionFilter>({});
  const [sortBy, setSortBy] = useState<'year' | 'difficulty' | 'marks' | 'relevance'>('year');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchResults, setSearchResults] = useState<QuestionSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Available filter options
  const years = [2025, 2024, 2023, 2022, 2021, 2020];
  const examTypes = ['Prelims', 'Mains'];
  const paperTypes = ['GS-I', 'GS-II', 'GS-III', 'GS-IV', 'Essay', 'CSAT'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const questionTypes = ['MCQ', 'Descriptive', 'Essay'];

  useEffect(() => {
    // Perform initial search
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/questions/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId: tenantId || user?.tenantId || 'default',
          filters,
          searchQuery: searchQuery.trim() || undefined,
          sortBy,
          sortOrder,
          limit: maxResults,
          offset: 0
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSearchResults(result.data);
      } else {
        console.error('Search failed:', result.message);
      }
    } catch (error) {
      console.error('Error searching questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilter = (key: keyof QuestionFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExamTypeColor = (examType: string) => {
    return examType === 'Prelims' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search questions by text, subject, topic, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
          {showFilters && (
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {showAdvancedFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "year" | "difficulty" | "marks" | "relevance")}
            className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="year">Year</option>
            <option value="difficulty">Difficulty</option>
            <option value="marks">Marks</option>
            <option value="relevance">Relevance</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </button>

          {Object.keys(filters).length > 0 && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && showAdvancedFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold">Advanced Filters</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Year Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Years</label>
                <div className="space-y-2">
                  {years.map(year => (
                    <div key={year} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`year-${year}`}
                        checked={filters.year?.includes(year) || false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFilter('year', [...(filters.year || []), year]);
                          } else {
                            updateFilter('year', filters.year?.filter(y => y !== year) || []);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`year-${year}`} className="text-sm">{year}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exam Type Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Exam Type</label>
                <div className="space-y-2">
                  {examTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`exam-${type}`}
                        checked={filters.examType?.includes(type as any) || false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFilter('examType', [...(filters.examType || []), type]);
                          } else {
                            updateFilter('examType', filters.examType?.filter(t => t !== type) || []);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`exam-${type}`} className="text-sm">{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paper Type Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Paper Type</label>
                <div className="space-y-2">
                  {paperTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`paper-${type}`}
                        checked={filters.paperType?.includes(type as any) || false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFilter('paperType', [...(filters.paperType || []), type]);
                          } else {
                            updateFilter('paperType', filters.paperType?.filter(t => t !== type) || []);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`paper-${type}`} className="text-sm">{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <div className="space-y-2">
                  {difficulties.map(diff => (
                    <div key={diff} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`diff-${diff}`}
                        checked={filters.difficulty?.includes(diff as any) || false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFilter('difficulty', [...(filters.difficulty || []), diff]);
                          } else {
                            updateFilter('difficulty', filters.difficulty?.filter(d => d !== diff) || []);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`diff-${diff}`} className="text-sm">{diff}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question Type Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Question Type</label>
                <div className="space-y-2">
                  {questionTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`qtype-${type}`}
                        checked={filters.questionType?.includes(type as any) || false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFilter('questionType', [...(filters.questionType || []), type]);
                          } else {
                            updateFilter('questionType', filters.questionType?.filter(t => t !== type) || []);
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`qtype-${type}`} className="text-sm">{type}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Search Results ({searchResults.totalCount} questions found)
              </h3>
              <div className="text-sm text-gray-600">
                Showing {searchResults.questions.length} of {searchResults.totalCount}
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {searchResults.questions.map((question) => (
                <div
                  key={question.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onQuestionSelect?.(question)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getExamTypeColor(question.examType)}`}>
                        {question.examType}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full border border-gray-300 text-gray-700">{question.paperType}</span>
                      <span className="px-2 py-1 text-xs rounded-full border border-gray-300 text-gray-700">{question.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Target className="w-4 h-4" />
                      {question.marks} marks
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-2">
                    Q{question.questionNumber}. {question.questionText}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span><BookOpen className="w-4 h-4 inline mr-1" />{question.subject}</span>
                    <span>{question.topic}</span>
                    <span>{question.questionType}</span>
                  </div>
                  
                  {question.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {question.keywords.slice(0, 5).map((keyword, index) => (
                        <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                          {keyword}
                        </span>
                      ))}
                      {question.keywords.length > 5 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                          +{question.keywords.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {searchResults.questions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No questions found matching your criteria.</p>
                  <p className="text-sm">Try adjusting your search terms or filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
