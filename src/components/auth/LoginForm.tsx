'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: (user?: any) => void;
  redirectTo?: string;
}

interface AuthError {
  error: string;
  code?: string;
  details?: string;
  requiresLogin?: boolean;
}

export default function LoginForm({ onSuccess, redirectTo = '/' }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [networkError, setNetworkError] = useState(false);

  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setNetworkError(false);

    // Client-side validation
    if (!formData.email.trim() || !formData.password) {
      setError({
        error: 'Please enter both email and password.',
        code: 'MISSING_FIELDS'
      });
      setIsLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError({
        error: 'Please enter a valid email address.',
        code: 'INVALID_EMAIL_FORMAT'
      });
      setIsLoading(false);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok) {
        // Success - redirect or call success callback with user data
        if (onSuccess) {
          onSuccess(data.user);
        } else {
          // Fallback role-based redirect if no success callback
          const destination = data.user?.role === 'admin' ? '/admin' : '/dashboard';
          router.push(destination);
          router.refresh();
        }
      } else {
        // Handle API errors with enhanced error information
        setError({
          error: data.error || 'Login failed. Please try again.',
          code: data.code,
          details: data.details,
          requiresLogin: data.requiresLogin
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.name === 'AbortError') {
        setError({
          error: 'Login request timed out. Please check your internet connection and try again.',
          code: 'TIMEOUT_ERROR'
        });
        setNetworkError(true);
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        setError({
          error: 'Unable to connect to the server. Please check your internet connection.',
          code: 'NETWORK_ERROR'
        });
        setNetworkError(true);
      } else {
        setError({
          error: 'An unexpected error occurred. Please try again.',
          code: 'UNKNOWN_ERROR'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear errors when user starts typing
    if (error) {
      setError(null);
      setNetworkError(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign In
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Access your UPSC Dashboard
          </p>
        </div>
        
        {error && (
          <div className={`mb-4 p-4 rounded-lg border ${
            networkError
              ? 'bg-orange-50 border-orange-200 text-orange-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {networkError ? (
                  <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">
                  {error.error}
                </p>
                {error.code && process.env.NODE_ENV === 'development' && (
                  <p className="mt-1 text-xs opacity-75">
                    Error Code: {error.code}
                  </p>
                )}
                {networkError && (
                  <button
                    type="button"
                    onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                    className="mt-2 text-sm underline hover:no-underline focus:outline-none"
                  >
                    Try again
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your email"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account? <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
