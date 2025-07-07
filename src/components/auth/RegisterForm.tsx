'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Shield } from 'lucide-react';

interface RegisterFormProps {
  onSuccess?: (user?: any) => void;
  redirectTo?: string;
  allowRoleSelection?: boolean;
}

export default function RegisterForm({ 
  onSuccess, 
  redirectTo = '/', 
  allowRoleSelection = false 
}: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'admin' | 'teacher' | 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{
    error: string;
    code?: string;
    details?: string;
  } | null>(null);
  const [networkError, setNetworkError] = useState(false);
  
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setNetworkError(false);

    // Client-side validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError({
        error: 'Please fill in all required fields.',
        code: 'MISSING_FIELDS'
      });
      setIsLoading(false);
      return;
    }

    // Name validation
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(formData.name.trim())) {
      setError({
        error: 'Please enter a valid name (2-50 characters, letters and spaces only).',
        code: 'INVALID_NAME'
      });
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError({
        error: 'Please enter a valid email address.',
        code: 'INVALID_EMAIL'
      });
      setIsLoading(false);
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError({
        error: 'Password must be at least 6 characters long.',
        code: 'WEAK_PASSWORD'
      });
      setIsLoading(false);
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    if (!hasLetter || !hasNumber) {
      setError({
        error: 'Password must contain both letters and numbers.',
        code: 'WEAK_PASSWORD'
      });
      setIsLoading(false);
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError({
        error: 'Passwords do not match. Please check and try again.',
        code: 'PASSWORD_MISMATCH'
      });
      setIsLoading(false);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok) {
        if (onSuccess) {
          onSuccess(data.user);
        } else {
          // Fallback role-based redirect if no success callback
          const destination = data.user?.role === 'admin' ? '/admin' : '/dashboard';
          router.push(destination);
          router.refresh();
        }
      } else {
        setError({
          error: data.error || 'Registration failed. Please try again.',
          code: data.code,
          details: data.details
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);

      if (error.name === 'AbortError') {
        setError({
          error: 'Registration request timed out. Please check your internet connection and try again.',
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            Create Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Join the UPSC Dashboard
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your full name"
              />
            </div>
          </div>
          
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
          
          {allowRoleSelection && (
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
          )}
          
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
                minLength={6}
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
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
