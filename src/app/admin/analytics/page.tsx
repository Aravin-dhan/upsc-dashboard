'use client';

import { useState, useEffect } from 'react';
import { useAuth, withAuth } from '@/contexts/AuthContext';
import { RealTimeAnalytics } from '@/components/admin/RealTimeAnalytics';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    pageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
  };
  traffic: {
    sources: Array<{ name: string; visitors: number; percentage: number }>;
    devices: Array<{ name: string; visitors: number; percentage: number }>;
    topPages: Array<{ path: string; views: number; uniqueViews: number }>;
  };
  engagement: {
    dailyActiveUsers: Array<{ date: string; users: number }>;
    sessionDuration: Array<{ date: string; duration: number }>;
    featureUsage: Array<{ feature: string; usage: number; growth: number }>;
  };
  performance: {
    loadTimes: Array<{ page: string; avgTime: number; p95Time: number }>;
    errorRates: Array<{ page: string; errors: number; rate: number }>;
  };
}

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'realtime' | 'historical'>('realtime');
  const { user } = useAuth();

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      } else {
        setError('Failed to fetch analytics data');
      }
    } catch (error) {
      setError('Network error while fetching analytics');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const exportData = () => {
    // Implementation for exporting analytics data
    if (process.env.NODE_ENV === 'development') {
      console.log('Exporting analytics data...');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor user engagement, performance metrics, and platform insights
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {activeTab === 'historical' && (
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="1d">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            )}
            {activeTab === 'historical' && (
              <button
                onClick={fetchAnalytics}
                disabled={refreshing}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            )}
            <button
              onClick={exportData}
              className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('realtime')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'realtime'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Real-Time Analytics
            </button>
            <button
              onClick={() => setActiveTab('historical')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'historical'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Historical Data
            </button>
          </nav>
        </div>
      </div>

      {error && activeTab === 'historical' && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Real-Time Analytics Tab */}
      {activeTab === 'realtime' && (
        <RealTimeAnalytics />
      )}

      {/* Historical Analytics Tab */}
      {activeTab === 'historical' && analytics && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.overview.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.overview.activeUsers.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Page Views</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.overview.pageViews.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Session</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatDuration(analytics.overview.avgSessionDuration)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Globe className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bounce Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPercentage(analytics.overview.bounceRate)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPercentage(analytics.overview.conversionRate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Sources and Devices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Traffic Sources</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {analytics.traffic.sources.map((source, index) => (
                    <div key={source.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-600 mr-3"></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{source.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{source.visitors.toLocaleString()}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{formatPercentage(source.percentage)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Device Types</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {analytics.traffic.devices.map((device, index) => (
                    <div key={device.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {device.name === 'Desktop' ? (
                          <Monitor className="w-4 h-4 text-gray-600 mr-3" />
                        ) : (
                          <Smartphone className="w-4 h-4 text-gray-600 mr-3" />
                        )}
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{device.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{device.visitors.toLocaleString()}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{formatPercentage(device.percentage)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Pages</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Unique Views
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {analytics.traffic.topPages.map((page, index) => (
                    <tr key={page.path}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {index + 1}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{page.path}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{page.views.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{page.uniqueViews.toLocaleString()}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feature Usage */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Feature Usage</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analytics.engagement.featureUsage.map((feature) => (
                  <div key={feature.feature} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{feature.feature}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-900 dark:text-white">{feature.usage.toLocaleString()} uses</div>
                      <div className={`text-sm ${feature.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {feature.growth >= 0 ? '+' : ''}{feature.growth.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Page Load Times</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {analytics.performance.loadTimes.map((page) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{page.page}</div>
                      <div className="text-right">
                        <div className="text-sm text-gray-900 dark:text-white">Avg: {page.avgTime}ms</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">P95: {page.p95Time}ms</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Error Rates</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {analytics.performance.errorRates.map((page) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{page.page}</div>
                      <div className="text-right">
                        <div className="text-sm text-gray-900 dark:text-white">{page.errors} errors</div>
                        <div className={`text-xs ${page.rate > 5 ? 'text-red-500' : 'text-green-500'}`}>
                          {page.rate.toFixed(2)}% rate
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Loading state for historical data */}
      {activeTab === 'historical' && isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading analytics data...</span>
        </div>
      )}
    </div>
  );
}

export default withAuth(AnalyticsPage, 'admin');
