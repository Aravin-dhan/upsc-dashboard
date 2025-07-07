'use client';

import { useState } from 'react';
import { 
  Cookie, Settings, Shield, BarChart3, Target, 
  CheckCircle, X, Calendar, Info, Toggle
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

export default function CookiesPage() {
  const [cookieSettings, setCookieSettings] = useState({
    essential: true, // Always enabled
    analytics: true,
    marketing: false,
    preferences: true
  });

  const lastUpdated = '2024-01-15';

  const cookieTypes = [
    {
      id: 'essential',
      name: 'Essential Cookies',
      icon: Shield,
      description: 'Required for basic website functionality and security. These cannot be disabled.',
      required: true,
      examples: [
        'Authentication and login status',
        'Security tokens and CSRF protection',
        'Session management',
        'Load balancing and performance'
      ],
      retention: 'Session or up to 1 year',
      color: 'green'
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      icon: BarChart3,
      description: 'Help us understand how visitors interact with our website to improve user experience.',
      required: false,
      examples: [
        'Page views and user journeys',
        'Feature usage statistics',
        'Performance metrics',
        'Error tracking and debugging'
      ],
      retention: 'Up to 2 years',
      color: 'blue'
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      icon: Target,
      description: 'Used to deliver relevant advertisements and track marketing campaign effectiveness.',
      required: false,
      examples: [
        'Ad personalization',
        'Campaign tracking',
        'Social media integration',
        'Retargeting pixels'
      ],
      retention: 'Up to 1 year',
      color: 'purple'
    },
    {
      id: 'preferences',
      name: 'Preference Cookies',
      icon: Settings,
      description: 'Remember your settings and preferences for a personalized experience.',
      required: false,
      examples: [
        'Language and region settings',
        'Theme preferences (dark/light mode)',
        'Dashboard layout customization',
        'Notification preferences'
      ],
      retention: 'Up to 1 year',
      color: 'orange'
    }
  ];

  const thirdPartyServices = [
    {
      name: 'Google Analytics',
      purpose: 'Website analytics and user behavior tracking',
      cookies: ['_ga', '_ga_*', '_gid', '_gat'],
      privacy: 'https://policies.google.com/privacy',
      optOut: 'https://tools.google.com/dlpage/gaoptout'
    },
    {
      name: 'Razorpay',
      purpose: 'Payment processing and fraud prevention',
      cookies: ['rzp_*', 'payment_session'],
      privacy: 'https://razorpay.com/privacy/',
      optOut: 'Contact support'
    },
    {
      name: 'Cloudflare',
      purpose: 'Security, performance, and content delivery',
      cookies: ['__cf_bm', '__cflb', 'cf_clearance'],
      privacy: 'https://www.cloudflare.com/privacy/',
      optOut: 'Essential service'
    }
  ];

  const handleCookieToggle = (type: string) => {
    if (type === 'essential') return; // Cannot disable essential cookies
    
    setCookieSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const savePreferences = () => {
    // In a real implementation, this would save to localStorage and update actual cookie settings
    localStorage.setItem('cookiePreferences', JSON.stringify(cookieSettings));
    alert('Cookie preferences saved successfully!');
  };

  const acceptAll = () => {
    const allEnabled = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    setCookieSettings(allEnabled);
    localStorage.setItem('cookiePreferences', JSON.stringify(allEnabled));
    alert('All cookies accepted!');
  };

  const rejectOptional = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    setCookieSettings(essentialOnly);
    localStorage.setItem('cookiePreferences', JSON.stringify(essentialOnly));
    alert('Optional cookies rejected. Only essential cookies will be used.');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Cookie className="h-8 w-8 text-orange-600" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Learn about how we use cookies and similar technologies to improve 
              your experience on UPSC Dashboard.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>
      </section>

      {/* What Are Cookies */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-8">
            <div className="flex items-start space-x-4">
              <Info className="h-8 w-8 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  What Are Cookies?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Cookies are small text files that are stored on your device when you visit a website. 
                  They help websites remember information about your visit, such as your preferred language 
                  and other settings, which can make your next visit easier and the site more useful to you.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  We use cookies and similar technologies to provide, protect, and improve our services, 
                  such as by personalizing content, offering and measuring advertisements, understanding 
                  user behavior, and providing a safer experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Types and Settings */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Cookie Categories & Your Choices
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your cookie preferences below. You can change these settings at any time.
            </p>
          </div>

          <div className="space-y-6">
            {cookieTypes.map((type) => (
              <div key={type.id} className="bg-white dark:bg-gray-900 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-12 h-12 bg-${type.color}-100 dark:bg-${type.color}-900/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <type.icon className={`h-6 w-6 text-${type.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {type.name}
                        </h3>
                        {type.required && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs font-medium rounded">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {type.description}
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Examples:</h4>
                          <ul className="space-y-1">
                            {type.examples.map((example, index) => (
                              <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start space-x-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{example}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Retention:</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{type.retention}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handleCookieToggle(type.id)}
                      disabled={type.required}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        cookieSettings[type.id as keyof typeof cookieSettings]
                          ? 'bg-green-600'
                          : 'bg-gray-300 dark:bg-gray-600'
                      } ${type.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          cookieSettings[type.id as keyof typeof cookieSettings] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={acceptAll}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Accept All Cookies
            </button>
            <button
              onClick={savePreferences}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save My Preferences
            </button>
            <button
              onClick={rejectOptional}
              className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Reject Optional Cookies
            </button>
          </div>
        </div>
      </section>

      {/* Third-Party Services */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Third-Party Services
          </h2>
          <div className="space-y-6">
            {thirdPartyServices.map((service, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {service.purpose}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Cookies Used:</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.cookies.map((cookie, cookieIndex) => (
                            <span key={cookieIndex} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                              {cookie}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Opt-out:</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{service.optOut}</p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <a
                      href={service.privacy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Privacy Policy
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Managing Cookies */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Managing Cookies in Your Browser
          </h2>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You can also manage cookies directly through your browser settings. Here's how to do it in popular browsers:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Desktop Browsers</h3>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-300">Chrome: Settings → Privacy and security → Cookies</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-300">Firefox: Settings → Privacy & Security → Cookies</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-300">Safari: Preferences → Privacy → Cookies</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-300">Edge: Settings → Cookies and site permissions</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Mobile Browsers</h3>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-300">Chrome Mobile: Settings → Site settings → Cookies</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-300">Safari iOS: Settings → Safari → Privacy & Security</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-300">Firefox Mobile: Settings → Data Management → Cookies</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> Disabling certain cookies may affect the functionality of our website. 
                Essential cookies cannot be disabled as they are necessary for basic website operation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Questions About Cookies?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            If you have any questions about our use of cookies, please contact us:
          </p>
          <a 
            href="mailto:privacy@upscdashboard.com"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
          >
            Contact Privacy Team
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
