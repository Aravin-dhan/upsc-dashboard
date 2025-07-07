'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  RefreshCw, 
  Search, 
  Users, 
  TrendingUp, 
  Calendar,
  Mail,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Subscription {
  id: string;
  email: string;
  plan: 'free' | 'trial' | 'pro';
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate?: string;
  paymentMethod?: string;
  amount?: number;
}

interface SubscriptionStats {
  total: number;
  active: number;
  trial: number;
  pro: number;
  revenue: number;
  growth: number;
}

export default function AdminSubscriptionsPage() {
  const { user, loading } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats>({
    total: 0,
    active: 0,
    trial: 0,
    pro: 0,
    revenue: 0,
    growth: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [loadingData, setLoadingData] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      window.location.href = '/dashboard';
    }
  }, [user, loading]);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadSubscriptions();
    }
  }, [user]);

  const loadSubscriptions = async () => {
    setLoadingData(true);
    try {
      // Mock data for now - replace with actual API call
      const mockSubscriptions: Subscription[] = [
        {
          id: '1',
          email: 'user1@example.com',
          plan: 'pro',
          status: 'active',
          startDate: '2024-01-15',
          endDate: '2024-12-15',
          paymentMethod: 'Credit Card',
          amount: 200
        },
        {
          id: '2',
          email: 'user2@example.com',
          plan: 'trial',
          status: 'active',
          startDate: '2024-06-01',
          endDate: '2024-07-01',
          amount: 0
        },
        {
          id: '3',
          email: 'user3@example.com',
          plan: 'free',
          status: 'active',
          startDate: '2024-05-20',
          amount: 0
        },
        {
          id: '4',
          email: 'user4@example.com',
          plan: 'pro',
          status: 'expired',
          startDate: '2023-12-01',
          endDate: '2024-06-01',
          paymentMethod: 'UPI',
          amount: 200
        }
      ];

      const mockStats: SubscriptionStats = {
        total: mockSubscriptions.length,
        active: mockSubscriptions.filter(s => s.status === 'active').length,
        trial: mockSubscriptions.filter(s => s.plan === 'trial').length,
        pro: mockSubscriptions.filter(s => s.plan === 'pro').length,
        revenue: mockSubscriptions.reduce((sum, s) => sum + (s.amount || 0), 0),
        growth: 15.2
      };

      setSubscriptions(mockSubscriptions);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const exportSubscriptions = async () => {
    setExporting(true);
    try {
      // Create CSV content
      const headers = ['Email', 'Plan', 'Status', 'Start Date', 'End Date', 'Payment Method', 'Amount'];
      const csvContent = [
        headers.join(','),
        ...filteredSubscriptions.map(sub => [
          sub.email,
          sub.plan,
          sub.status,
          sub.startDate,
          sub.endDate || '',
          sub.paymentMethod || '',
          sub.amount || 0
        ].join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export subscriptions:', error);
    } finally {
      setExporting(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPlan === 'all' || sub.plan === filterPlan;
    return matchesSearch && matchesFilter;
  });

  const getPlanBadge = (plan: string) => {
    const variants = {
      free: 'secondary',
      trial: 'outline',
      pro: 'default'
    } as const;
    return <Badge variant={variants[plan as keyof typeof variants]}>{plan.toUpperCase()}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      expired: 'destructive',
      cancelled: 'secondary'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status.toUpperCase()}</Badge>;
  };

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground">Manage user subscriptions and billing</p>
        </div>
        <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          Admin Only
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">+{stats.growth}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pro Subscribers</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pro}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscriptions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="subscriptions">All Subscriptions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Subscription List</CardTitle>
                  <CardDescription>Manage and monitor user subscriptions</CardDescription>
                </div>
                <Button onClick={exportSubscriptions} disabled={exporting} variant="outline">
                  {exporting ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Plans</option>
                  <option value="free">Free</option>
                  <option value="trial">Trial</option>
                  <option value="pro">Pro</option>
                </select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">{subscription.email}</TableCell>
                      <TableCell>{getPlanBadge(subscription.plan)}</TableCell>
                      <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                      <TableCell>{new Date(subscription.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>₹{subscription.amount || 0}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Send Email</DropdownMenuItem>
                            <DropdownMenuItem>Extend Subscription</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Cancel Subscription</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Analytics</CardTitle>
              <CardDescription>Detailed analytics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  Analytics dashboard coming soon. This will include subscription trends, revenue analytics, and user behavior insights.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
