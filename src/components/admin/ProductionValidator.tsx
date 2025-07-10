'use client';

import { useState } from 'react';
import {
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Shield,
  Activity,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ProductionValidator, ValidationSuite, ValidationResult } from '@/utils/productionValidation';

export default function ProductionValidatorComponent() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ValidationSuite[]>([]);
  const [showDetails, setShowDetails] = useState<string[]>([]);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runValidation = async () => {
    setIsRunning(true);
    setResults([]);
    
    try {
      const validator = new ProductionValidator();
      const validationResults = await validator.runAllValidations();
      setResults(validationResults);
      setLastRun(new Date());
      
      const totalTests = validationResults.reduce((sum, suite) => sum + suite.results.length, 0);
      const totalPassed = validationResults.reduce((sum, suite) => sum + suite.passed, 0);
      const totalFailed = validationResults.reduce((sum, suite) => sum + suite.failed, 0);
      
      if (totalFailed === 0) {
        toast.success(`All ${totalTests} tests passed! 🎉`);
      } else {
        toast.error(`${totalFailed} tests failed out of ${totalTests}`);
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Validation failed to run');
    } finally {
      setIsRunning(false);
    }
  };

  const downloadReport = () => {
    if (results.length === 0) {
      toast.error('No validation results to download');
      return;
    }

    const validator = new ProductionValidator();
    // Set results to generate report
    (validator as any).results = results;
    const report = validator.generateReport();
    
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `upsc-dashboard-validation-${new Date().toISOString().split('T')[0]}.md`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Validation report downloaded!');
  };

  const toggleDetails = (suiteId: string) => {
    setShowDetails(prev => 
      prev.includes(suiteId) 
        ? prev.filter(id => id !== suiteId)
        : [...prev, suiteId]
    );
  };

  const getStatusIcon = (status: ValidationResult['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: ValidationResult['status']) => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'fail': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    }
  };

  const getSuiteStatusColor = (suite: ValidationSuite) => {
    if (suite.failed > 0) return 'border-red-300 bg-red-50 dark:bg-red-900/10';
    if (suite.warnings > 0) return 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10';
    return 'border-green-300 bg-green-50 dark:bg-green-900/10';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Shield className="h-6 w-6 mr-2 text-blue-600" />
            Production Validator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive testing suite for UPSC Dashboard production readiness
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {results.length > 0 && (
            <button
              onClick={downloadReport}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </button>
          )}
          <button
            onClick={runValidation}
            disabled={isRunning}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isRunning ? 'Running Tests...' : 'Run Validation'}
          </button>
        </div>
      </div>

      {/* Last Run Info */}
      {lastRun && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              Last validation run: {lastRun.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Overall Results */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(() => {
            const totalTests = results.reduce((sum, suite) => sum + suite.results.length, 0);
            const totalPassed = results.reduce((sum, suite) => sum + suite.passed, 0);
            const totalFailed = results.reduce((sum, suite) => sum + suite.failed, 0);
            const totalWarnings = results.reduce((sum, suite) => sum + suite.warnings, 0);

            return (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Tests</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTests}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Passed</p>
                      <p className="text-2xl font-bold text-green-600">{totalPassed}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Failed</p>
                      <p className="text-2xl font-bold text-red-600">{totalFailed}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Warnings</p>
                      <p className="text-2xl font-bold text-yellow-600">{totalWarnings}</p>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Validation Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Validation Results</h2>
          
          {results.map((suite, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 ${getSuiteStatusColor(suite)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {suite.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-full">
                      {suite.passed} passed
                    </span>
                    {suite.failed > 0 && (
                      <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-full">
                        {suite.failed} failed
                      </span>
                    )}
                    {suite.warnings > 0 && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-full">
                        {suite.warnings} warnings
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleDetails(suite.name)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showDetails.includes(suite.name) ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {showDetails.includes(suite.name) && (
                <div className="mt-4 space-y-2">
                  {suite.results.map((result, resultIndex) => (
                    <div
                      key={resultIndex}
                      className="flex items-start space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {result.component}
                          </h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(result.status)}`}>
                            {result.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {result.message}
                        </p>
                        {result.details && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {result.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isRunning && (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Running comprehensive validation tests...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            This may take a few moments to complete
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isRunning && results.length === 0 && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ready to validate your UPSC Dashboard for production
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Click "Run Validation" to test all implemented features and ensure production readiness
          </p>
        </div>
      )}
    </div>
  );
}
