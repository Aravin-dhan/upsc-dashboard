'use client';

import { useState } from 'react';
import { Activity, Target, Trophy, TrendingUp } from 'lucide-react';
import WellnessTracking from '@/components/wellness/WellnessTracking';
import WellnessTips from '@/components/wellness/WellnessTips';
import WellnessGamification from '@/components/wellness/WellnessGamification';

export default function WellnessPage() {
  const [activeTab, setActiveTab] = useState<'tracking' | 'tips' | 'achievements'>('tracking');

  const tabs = [
    { id: 'tracking', name: 'Tracking', icon: Activity },
    { id: 'tips', name: 'Tips', icon: Target },
    { id: 'achievements', name: 'Achievements', icon: Trophy }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wellness Corner</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track your physical and mental well-being for optimal UPSC preparation performance.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'tracking' && <WellnessTracking />}
          {activeTab === 'tips' && <WellnessTips />}
          {activeTab === 'achievements' && <WellnessGamification />}
        </div>
      </div>
    </div>
  );
}
