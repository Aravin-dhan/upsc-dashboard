'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Mail, 
  Users, 
  TrendingUp, 
  Download, 
  Search, 
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Trash2,
  UserX,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EmailSubscriber {
  id: string;
  email: string;
  name?: string;
  subscriptionType: string;
  status: string;
  source: string;
  subscribedAt: string;
  preferences: {
    frequency: string;
    topics: string[];
    format: string;
  };
}

interface SubscriptionAnalytics {
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribedCount: number;
  bouncedCount: number;
  subscriptionsByType: Record<string, number>;
  growthRate: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  engagementMetrics: {
    averageOpenRate: number;
    averageClickRate: number;
    unsubscribeRate: number;
  };
  recentSubscribers: EmailSubscriber[];
  topSources: Array<{ source: string; count: number }>;
}

const EmailSubscriptionsPage: React.FC = () => {
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [analytics, setAnalytics] = useState<SubscriptionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // UI state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchSubscribers();
      fetchAnalytics();
    }
  }, [user, currentPage, statusFilter, typeFilter, sourceFilter, searchTerm]);

  const fetchSubscribers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(statusFilter && { status: statusFilter }),
        ...(typeFilter && { subscriptionType: typeFilter }),
        ...(sourceFilter && { source: sourceFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/admin/email-subscriptions?${params}`);
      const data = await response.json();

      if (data.success) {
        setSubscribers(data.subscribers);
        setTotalPages(data.pagination.totalPages);
      } else {
        setError(data.error || 'Failed to fetch subscribers');
      }
    } catch (err) {
      setError('Failed to fetch subscribers');
      console.error('Fetch subscribers error:', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/email-subscriptions/analytics');
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        console.error('Failed to fetch analytics:', data.error);
      }
    } catch (err) {
      console.error('Fetch analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/admin/email-subscriptions/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `email-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const handleBulkUnsubscribe = async () => {
    if (selectedSubscribers.length === 0) return;

    try {
      const emails = subscribers
        .filter(s => selectedSubscribers.includes(s.id))
        .map(s => s.email);

      const response = await fetch('/api/admin/email-subscriptions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails })
      });

      const data = await response.json();

      if (data.success) {
        setSelectedSubscribers([]);
        fetchSubscribers();
        fetchAnalytics();
      } else {
        setError(data.error || 'Failed to unsubscribe emails');
      }
    } catch (err) {
      setError('Failed to unsubscribe emails');
      console.error('Bulk unsubscribe error:', err);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'unsubscribed': return 'secondary';
      case 'bounced': return 'destructive';
      default: return 'outline';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'newsletter': return 'default';
      case 'current-affairs': return 'secondary';
      case 'updates': return 'outline';
      default: return 'outline';
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Subscriptions</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage email subscribers and newsletter campaigns
              </p>
            </div>
            <div className="flex space-x-4">
              <Button onClick={handleExportCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Subscriber
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalSubscribers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.activeSubscribers} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{analytics.growthRate.monthly}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.growthRate.weekly} this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.engagementMetrics.averageOpenRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.engagementMetrics.averageClickRate.toFixed(1)}% click rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unsubscribe Rate</CardTitle>
                <UserX className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.engagementMetrics.unsubscribeRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.unsubscribedCount} total unsubscribed
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800"
                />
              </div>
              
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="unsubscribed">Unsubscribed</option>
                  <option value="bounced">Bounced</option>
                </select>
                
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                >
                  <option value="">All Types</option>
                  <option value="newsletter">Newsletter</option>
                  <option value="current-affairs">Current Affairs</option>
                  <option value="updates">Updates</option>
                  <option value="press">Press</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
            
            {selectedSubscribers.length > 0 && (
              <div className="mt-4 flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  {selectedSubscribers.length} subscriber(s) selected
                </span>
                <Button onClick={handleBulkUnsubscribe} variant="destructive" size="sm">
                  <UserX className="h-4 w-4 mr-2" />
                  Unsubscribe Selected
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscribers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Subscribers</CardTitle>
            <CardDescription>
              Manage your email subscribers and their preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.length === subscribers.length && subscribers.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubscribers(subscribers.map(s => s.id));
                          } else {
                            setSelectedSubscribers([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Source</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Subscribed</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr key={subscriber.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedSubscribers.includes(subscriber.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSubscribers([...selectedSubscribers, subscriber.id]);
                            } else {
                              setSelectedSubscribers(selectedSubscribers.filter(id => id !== subscriber.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{subscriber.email}</div>
                          {subscriber.name && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">{subscriber.name}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getTypeBadgeColor(subscriber.subscriptionType)}>
                          {subscriber.subscriptionType}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusBadgeColor(subscriber.status)}>
                          {subscriber.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {subscriber.source}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(subscriber.subscribedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailSubscriptionsPage;
