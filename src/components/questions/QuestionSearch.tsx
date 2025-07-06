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
            <Input
              placeholder="Search questions by text, subject, topic, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
          {showFilters && (
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {showAdvancedFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </Button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year">Year</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="marks">Marks</SelectItem>
              <SelectItem value="relevance">Relevance</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </Button>

          {Object.keys(filters).length > 0 && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && showAdvancedFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Year Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Years</label>
                <div className="space-y-2">
                  {years.map(year => (
                    <div key={year} className="flex items-center space-x-2">
                      <Checkbox
                        id={`year-${year}`}
                        checked={filters.year?.includes(year) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilter('year', [...(filters.year || []), year]);
                          } else {
                            updateFilter('year', filters.year?.filter(y => y !== year) || []);
                          }
                        }}
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
                      <Checkbox
                        id={`exam-${type}`}
                        checked={filters.examType?.includes(type as any) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilter('examType', [...(filters.examType || []), type]);
                          } else {
                            updateFilter('examType', filters.examType?.filter(t => t !== type) || []);
                          }
                        }}
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
                      <Checkbox
                        id={`paper-${type}`}
                        checked={filters.paperType?.includes(type as any) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilter('paperType', [...(filters.paperType || []), type]);
                          } else {
                            updateFilter('paperType', filters.paperType?.filter(t => t !== type) || []);
                          }
                        }}
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
                      <Checkbox
                        id={`diff-${diff}`}
                        checked={filters.difficulty?.includes(diff as any) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilter('difficulty', [...(filters.difficulty || []), diff]);
                          } else {
                            updateFilter('difficulty', filters.difficulty?.filter(d => d !== diff) || []);
                          }
                        }}
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
                      <Checkbox
                        id={`qtype-${type}`}
                        checked={filters.questionType?.includes(type as any) || false}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilter('questionType', [...(filters.questionType || []), type]);
                          } else {
                            updateFilter('questionType', filters.questionType?.filter(t => t !== type) || []);
                          }
                        }}
                      />
                      <label htmlFor={`qtype-${type}`} className="text-sm">{type}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSearch}>Apply Filters</Button>
              <Button variant="outline" onClick={clearFilters}>Clear All</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Search Results ({searchResults.totalCount} questions found)
              </CardTitle>
              <div className="text-sm text-gray-600">
                Showing {searchResults.questions.length} of {searchResults.totalCount}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {searchResults.questions.map((question) => (
                <div
                  key={question.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onQuestionSelect?.(question)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                      <Badge className={getExamTypeColor(question.examType)}>
                        {question.examType}
                      </Badge>
                      <Badge variant="outline">{question.paperType}</Badge>
                      <Badge variant="outline">{question.year}</Badge>
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
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {question.keywords.length > 5 && (
                        <Badge variant="secondary" className="text-xs">
                          +{question.keywords.length - 5} more
                        </Badge>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
