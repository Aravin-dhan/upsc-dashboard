'use client';

import { Clock, ArrowLeft, Bell, Star } from 'lucide-react';
import Link from 'next/link';

interface ComingSoonProps {
  title: string;
  description?: string;
  expectedDate?: string;
  features?: string[];
  backLink?: string;
  backLinkText?: string;
}

export default function ComingSoon({
  title,
  description = "We're working hard to bring you this feature. Stay tuned for updates!",
  expectedDate,
  features = [],
  backLink = '/dashboard',
  backLinkText = 'Back to Dashboard'
}: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
            <Clock className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {description}
          </p>

          {/* Expected Date */}
          {expectedDate && (
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6">
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                Expected Launch: {expectedDate}
              </p>
            </div>
          )}

          {/* Features Preview */}
          {features.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What to Expect:
              </h3>
              <div className="grid gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-center text-gray-600 dark:text-gray-300">
                    <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notification Signup */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center mb-3">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Get notified when this feature launches
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We'll send you an email as soon as this feature is available.
            </p>
          </div>

          {/* Back Button */}
          <Link
            href={backLink}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backLinkText}
          </Link>

          {/* Alternative Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              In the meantime, explore these available features:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/practice"
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Practice Tests
              </Link>
              <Link
                href="/learning"
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Study Materials
              </Link>
              <Link
                href="/current-affairs"
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Current Affairs
              </Link>
              <Link
                href="/ai-assistant"
                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
