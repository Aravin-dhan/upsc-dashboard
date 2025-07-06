'use client';

import React, { useState, useEffect } from 'react';
import {
  Search, BookOpen, Volume2, Star, Clock, TrendingUp, 
  Brain, Target, Bookmark, RotateCcw, Shuffle, Play,
  ChevronRight, ChevronLeft, Eye, EyeOff, Award, Zap,
  Filter, SortAsc, Download, Share2, Settings, Plus
} from 'lucide-react';
import { useDictionary } from '@/hooks/useDictionary';
import toast from 'react-hot-toast';

export default function DictionaryPage() {
  const {
    searchWord,
    currentWord,
    wordHistory,
    favorites,
    learningProgress,
    dailyGoal,
    streakCount,
    loading,
    error,
    searchResults,
    suggestions,
    addToFavorites,
    removeFromFavorites,
    markAsLearned,
    getRandomWord,
    getWordOfTheDay,
    startQuiz,
    updateSettings
  } = useDictionary();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'learn' | 'quiz' | 'progress'>('search');
  const [showDefinition, setShowDefinition] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'basic' | 'intermediate' | 'advanced'>('all');
  const [studyMode, setStudyMode] = useState<'flashcard' | 'definition' | 'usage'>('flashcard');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'upsc' | 'academic' | 'formal' | 'general'>('all');
  const [sortBy, setSortBy] = useState<'alphabetical' | 'difficulty' | 'frequency' | 'upsc-relevance'>('alphabetical');
  const [wordTypeFilter, setWordTypeFilter] = useState<'all' | 'noun' | 'verb' | 'adjective' | 'adverb'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      await searchWord(query.trim());
      setSearchQuery(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  const playPronunciation = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    } else {
      toast.error('Speech synthesis not supported in this browser');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getPartOfSpeechColor = (pos: string) => {
    const colors = {
      noun: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      verb: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      adjective: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      adverb: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
      preposition: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
      conjunction: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
      interjection: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
    };
    return colors[pos as keyof typeof colors] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">English Dictionary & Vocabulary Builder</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Master English vocabulary with AI-powered learning and comprehensive word analysis
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              {streakCount} day streak
            </span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {learningProgress.wordsLearned}/{dailyGoal.wordsPerDay} today
            </span>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search Input */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for any English word..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <button
              onClick={() => getRandomWord()}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Shuffle className="h-4 w-4" />
              <span>Random Word</span>
            </button>
            <button
              onClick={() => getWordOfTheDay()}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Star className="h-4 w-4" />
              <span>Word of Day</span>
            </button>
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion)}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Advanced Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Difficulty Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Levels</option>
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="upsc">UPSC Relevant</option>
                  <option value="academic">Academic</option>
                  <option value="formal">Formal</option>
                  <option value="general">General</option>
                </select>
              </div>

              {/* Word Type Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Word Type</label>
                <select
                  value={wordTypeFilter}
                  onChange={(e) => setWordTypeFilter(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Types</option>
                  <option value="noun">Nouns</option>
                  <option value="verb">Verbs</option>
                  <option value="adjective">Adjectives</option>
                  <option value="adverb">Adverbs</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="alphabetical">Alphabetical</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="frequency">Frequency</option>
                  <option value="upsc-relevance">UPSC Relevance</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-600">
          {[
            { id: 'search', label: 'Search & Learn', icon: Search },
            { id: 'learn', label: 'Study Mode', icon: Brain },
            { id: 'quiz', label: 'Quiz & Test', icon: Award },
            { id: 'progress', label: 'Progress', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'search' && (
            <div className="space-y-6">
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Searching...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {currentWord && !loading && (
                <div className="space-y-6">
                  {/* Word Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                          {currentWord.word}
                        </h2>
                        <button
                          onClick={() => playPronunciation(currentWord.word)}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Play pronunciation"
                        >
                          <Volume2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => 
                            favorites.includes(currentWord.word) 
                              ? removeFromFavorites(currentWord.word)
                              : addToFavorites(currentWord.word)
                          }
                          className={`p-2 transition-colors ${
                            favorites.includes(currentWord.word)
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-400 hover:text-yellow-500'
                          }`}
                          title={favorites.includes(currentWord.word) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star className={`h-5 w-5 ${favorites.includes(currentWord.word) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      
                      {currentWord.phonetic && (
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                          /{currentWord.phonetic}/
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(currentWord.difficulty)}`}>
                          {currentWord.difficulty}
                        </span>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                          Frequency: {currentWord.frequency}/10
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => markAsLearned(currentWord.word)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Mark as Learned
                    </button>
                  </div>

                  {/* Definitions */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Definitions</h3>
                    {currentWord.meanings.map((meaning, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${getPartOfSpeechColor(meaning.partOfSpeech)}`}>
                            {meaning.partOfSpeech}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          {meaning.definitions.map((def, defIndex) => (
                            <div key={defIndex} className="space-y-2">
                              <p className="text-gray-900 dark:text-white">{def.definition}</p>
                              {def.example && (
                                <p className="text-gray-600 dark:text-gray-400 italic pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                                  "{def.example}"
                                </p>
                              )}
                              {def.synonyms && def.synonyms.length > 0 && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Synonyms:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {def.synonyms.slice(0, 5).map((synonym, synIndex) => (
                                      <button
                                        key={synIndex}
                                        onClick={() => handleSearch(synonym)}
                                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                      >
                                        {synonym}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Etymology */}
                  {currentWord.etymology && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Etymology</h4>
                      <p className="text-amber-700 dark:text-amber-300">{currentWord.etymology}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'learn' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Study Mode</h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={studyMode}
                    onChange={(e) => setStudyMode(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="flashcard">Flashcards</option>
                    <option value="definition">Definition Match</option>
                    <option value="usage">Usage Practice</option>
                  </select>
                </div>
              </div>
              
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Study Mode</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Interactive learning modes to master vocabulary effectively
                </p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Start Learning Session
                </button>
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Vocabulary Quiz</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Test your knowledge with adaptive quizzes
                </p>
                <button 
                  onClick={() => startQuiz()}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {learningProgress.wordsLearned}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Words Learned</p>
                </div>
                
                <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Zap className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {streakCount}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
                </div>
                
                <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Star className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {favorites.length}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
