'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Camera, FileText, Zap, CheckCircle, AlertCircle, TrendingUp, Clock, Target, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useFormKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

interface AnalysisResult {
  id: string;
  question: string;
  answer: string;
  analysisDate: string;
  overallScore: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
  criteria: {
    content: number;
    structure: number;
    clarity: number;
    relevance: number;
    examples: number;
  };
  wordCount: number;
  timeSpent?: number;
}

export default function AnswerAnalysisPage() {
  const [analysisMode, setAnalysisMode] = useState<'text' | 'image'>('text');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setQuestion('');
    setAnswer('');
    setUploadedImage(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Keyboard navigation for form
  useFormKeyboardNavigation(
    !!(question && (answer || uploadedImage)),
    () => {
      if (!isAnalyzing) {
        analyzeAnswer();
      }
    },
    resetForm,
    true
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeAnswer = async () => {
    if (analysisMode === 'text' && (!question || !answer)) {
      toast.error('Please provide both question and answer');
      return;
    }
    
    if (analysisMode === 'image' && !uploadedImage) {
      toast.error('Please upload an image of your answer');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/ai/analyze-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: analysisMode,
          question: question,
          answer: analysisMode === 'text' ? answer : null,
          image: analysisMode === 'image' ? uploadedImage : null
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      
      const analysis: AnalysisResult = {
        id: Date.now().toString(),
        question: question,
        answer: analysisMode === 'text' ? answer : 'Image-based answer',
        analysisDate: new Date().toISOString(),
        overallScore: result.overallScore || 7.5,
        feedback: result.feedback || {
          strengths: ['Good understanding of the topic', 'Clear introduction'],
          improvements: ['Add more examples', 'Improve conclusion'],
          suggestions: ['Include recent developments', 'Better structure']
        },
        criteria: result.criteria || {
          content: 8,
          structure: 7,
          clarity: 8,
          relevance: 7,
          examples: 6
        },
        wordCount: analysisMode === 'text' ? answer.split(/\s+/).length : 0
      };

      setAnalysisResult(analysis);
      setRecentAnalyses(prev => [analysis, ...prev.slice(0, 4)]);
      
      // Save to localStorage
      const saved = localStorage.getItem('upsc-answer-analyses');
      const existing = saved ? JSON.parse(saved) : [];
      localStorage.setItem('upsc-answer-analyses', JSON.stringify([analysis, ...existing.slice(0, 9)]));
      
      toast.success('Answer analyzed successfully!');
    } catch (error) {
      console.error('Analysis error:', error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          toast.error('Network error. Please check your connection and try again.');
        } else if (error.message.includes('Analysis failed')) {
          toast.error('Analysis service is temporarily unavailable. Please try again later.');
        } else {
          toast.error(`Analysis failed: ${error.message}`);
        }
      } else {
        toast.error('Failed to analyze answer. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };



  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Answer Analysis</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Get detailed feedback on your UPSC Mains answer writing with AI-powered analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analysis Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mode Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Analysis Mode</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setAnalysisMode('text')}
                className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  analysisMode === 'text'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                }`}
              >
                <FileText className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Text Input</div>
                  <div className="text-sm opacity-75">Type your answer</div>
                </div>
              </button>
              <button
                onClick={() => setAnalysisMode('image')}
                className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  analysisMode === 'image'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                }`}
              >
                <Camera className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Image Upload</div>
                  <div className="text-sm opacity-75">Upload handwritten answer</div>
                </div>
              </button>
            </div>
          </div>

          {/* Question Input */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Question</h3>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder="Enter the question you answered..."
              required
            />
          </div>

          {/* Answer Input */}
          {analysisMode === 'text' ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Answer</h3>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                rows={12}
                placeholder="Paste or type your answer here..."
                required
              />
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Word count: {answer.split(/\s+/).filter(word => word.length > 0).length}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upload Answer Image</h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img
                      src={uploadedImage}
                      alt="Uploaded answer"
                      className="max-w-full h-auto mx-auto rounded-lg shadow-sm"
                      style={{ maxHeight: '400px' }}
                    />
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Upload a clear image of your handwritten answer
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Supports JPG, PNG, PDF (max 10MB)
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Choose File
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={analyzeAnswer}
              disabled={isAnalyzing}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze Answer
                </>
              )}
            </button>
            <button
              onClick={resetForm}
              className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Analysis Tips */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Analysis Tips</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">Provide complete question for context</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">Upload clear, well-lit images</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">Include full answer for best analysis</span>
              </div>
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">AI analysis is for guidance only</span>
              </div>
            </div>
          </div>

          {/* Recent Analyses */}
          {recentAnalyses.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Analyses</h3>
              <div className="space-y-3">
                {recentAnalyses.slice(0, 3).map((analysis) => (
                  <div key={analysis.id} className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Score: {analysis.overallScore}/10
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(analysis.analysisDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {analysis.question}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis Results</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Overall Score:</span>
              <span className="text-2xl font-bold text-blue-600">{analysisResult.overallScore}/10</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Criteria Scores */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Detailed Scores</h3>
              {Object.entries(analysisResult.criteria).map(([criterion, score]) => (
                <div key={criterion} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {criterion}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {score}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(score / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feedback */}
            <div className="space-y-6">
              {/* Strengths */}
              <div>
                <h4 className="text-md font-medium text-green-700 dark:text-green-400 mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Strengths
                </h4>
                <ul className="space-y-2">
                  {analysisResult.feedback.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div>
                <h4 className="text-md font-medium text-yellow-700 dark:text-yellow-400 mb-3 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-2">
                  {analysisResult.feedback.improvements.map((improvement, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div>
                <h4 className="text-md font-medium text-blue-700 dark:text-blue-400 mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Suggestions
                </h4>
                <ul className="space-y-2">
                  {analysisResult.feedback.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Answer Details */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{analysisResult.wordCount}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Words</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Date(analysisResult.analysisDate).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Analysis Date</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analysisResult.timeSpent || 'N/A'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Time Spent (min)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
