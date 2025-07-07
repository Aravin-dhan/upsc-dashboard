'use client';

import React, { useState } from 'react';
import { Mail, Check, AlertCircle, Loader2 } from 'lucide-react';

interface EmailSubscriptionFormProps {
  subscriptionType: 'newsletter' | 'updates' | 'current-affairs' | 'press' | 'status';
  source: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
  showName?: boolean;
  showPreferences?: boolean;
  onSuccess?: (subscriber: any) => void;
  onError?: (error: string) => void;
}

interface FormData {
  email: string;
  name: string;
  preferences: {
    frequency: 'daily' | 'weekly' | 'monthly';
    topics: string[];
    format: 'html' | 'text';
  };
}

const EmailSubscriptionForm: React.FC<EmailSubscriptionFormProps> = ({
  subscriptionType,
  source,
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  className = "",
  showName = false,
  showPreferences = false,
  onSuccess,
  onError
}) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    preferences: {
      frequency: 'weekly',
      topics: [],
      format: 'html'
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTopicChange = (topic: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        topics: checked 
          ? [...prev.preferences.topics, topic]
          : prev.preferences.topics.filter(t => t !== topic)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate email
      if (!formData.email || !formData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Prepare subscription data
      const subscriptionData = {
        email: formData.email,
        subscriptionType,
        source,
        ...(showName && formData.name && { name: formData.name }),
        ...(showPreferences && { preferences: formData.preferences }),
        metadata: {
          utmSource: new URLSearchParams(window.location.search).get('utm_source'),
          utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
          utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
          referrer: document.referrer,
          timestamp: new Date().toISOString()
        }
      };

      const response = await fetch('/api/email-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to subscribe');
      }

      setIsSubscribed(true);
      setFormData({ email: '', name: '', preferences: { frequency: 'weekly', topics: [], format: 'html' } });
      
      if (onSuccess) {
        onSuccess(result.subscriber);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className={`flex items-center justify-center p-6 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <div className="text-center">
          <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-green-800 mb-1">Successfully Subscribed!</h3>
          <p className="text-green-600">
            Thank you for subscribing. You'll receive updates at {formData.email}.
          </p>
        </div>
      </div>
    );
  }

  const availableTopics = {
    newsletter: ['General Updates', 'Study Tips', 'Success Stories', 'New Features'],
    'current-affairs': ['Daily News', 'Weekly Summary', 'Analysis', 'Important Events'],
    updates: ['Product Updates', 'Maintenance', 'New Features', 'Security'],
    press: ['Press Releases', 'Media Coverage', 'Company News', 'Announcements'],
    status: ['Service Status', 'Maintenance Alerts', 'Incident Reports', 'Updates']
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {showName && (
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your name (optional)"
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}
        
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={placeholder}
            required
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !formData.email}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Subscribing...</span>
            </>
          ) : (
            <span>{buttonText}</span>
          )}
        </button>
      </div>

      {showPreferences && (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white">Subscription Preferences</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frequency
              </label>
              <select
                name="preferences.frequency"
                value={formData.preferences.frequency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Format
              </label>
              <select
                name="preferences.format"
                value={formData.preferences.format}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="html">HTML (Rich Text)</option>
                <option value="text">Plain Text</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Topics of Interest
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableTopics[subscriptionType]?.map((topic) => (
                <label key={topic} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.preferences.topics.includes(topic)}
                    onChange={(e) => handleTopicChange(topic, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{topic}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        By subscribing, you agree to receive emails from us. You can unsubscribe at any time.
      </p>
    </form>
  );
};

export default EmailSubscriptionForm;
