'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  RefreshCw, 
  AlertTriangle, 
  Eye, 
  Lock,
  Activity,
  Users,
  Globe,
  Download,
  Filter
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'failed_login' | 'password_change' | 'admin_action';
  user: string;
  ip: string;
  userAgent: string;
  timestamp: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
}

interface SecurityStats {
  totalEvents: number;
  failedLogins: number;
  suspiciousActivity: number;
  activeUsers: number;
  blockedIPs: number;
}

export default function AdminSecurityPage() {
  const { user, loading } = useAuth();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    totalEvents: 0,
    failedLogins: 0,
    suspiciousActivity: 0,
    activeUsers: 0,
    blockedIPs: 0
  });
  const [loadingData, setLoadingData] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      window.location.href = '/dashboard';
    }
  }, [user, loading]);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadSecurityData();
    }
  }, [user]);

  const loadSecurityData = async () => {
    setLoadingData(true);
    try {
      // Mock data for now - replace with actual API call
      const mockEvents: SecurityEvent[] = [
        {
          id: '1',
          type: 'login',
          user: 'admin@upsc.local',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          timestamp: new Date().toISOString(),
          details: 'Successful admin login',
          severity: 'low'
        },
        {
          id: '2',
          type: 'failed_login',
          user: 'unknown@example.com',
          ip: '203.0.113.45',
          userAgent: 'curl/7.68.0',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          details: 'Failed login attempt with invalid credentials',
          severity: 'medium'
        },
        {
          id: '3',
          type: 'admin_action',
          user: 'admin@upsc.local',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          details: 'User management action performed',
          severity: 'low'
        },
        {
          id: '4',
          type: 'failed_login',
          user: 'test@example.com',
          ip: '198.51.100.23',
          userAgent: 'Python-requests/2.25.1',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          details: 'Multiple failed login attempts detected',
          severity: 'high'
        }
      ];

      const mockStats: SecurityStats = {
        totalEvents: mockEvents.length,
        failedLogins: mockEvents.filter(e => e.type === 'failed_login').length,
        suspiciousActivity: mockEvents.filter(e => e.severity === 'high').length,
        activeUsers: 15,
        blockedIPs: 3
      };

      setSecurityEvents(mockEvents);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const exportSecurityLog = async () => {
    try {
      const headers = ['Timestamp', 'Type', 'User', 'IP Address', 'User Agent', 'Details', 'Severity'];
      const csvContent = [
        headers.join(','),
        ...filteredEvents.map(event => [
          event.timestamp,
          event.type,
          event.user,
          event.ip,
          `"${event.userAgent}"`,
          `"${event.details}"`,
          event.severity
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-log-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export security log:', error);
    }
  };

  const filteredEvents = securityEvents.filter(event => {
    return filterType === 'all' || event.type === filterType;
  });

  const getEventTypeBadge = (type: string) => {
    const variants = {
      login: 'default',
      logout: 'secondary',
      failed_login: 'destructive',
      password_change: 'outline',
      admin_action: 'default'
    } as const;
    return <Badge variant={variants[type as keyof typeof variants]}>{type.replace('_', ' ').toUpperCase()}</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: 'secondary',
      medium: 'outline',
      high: 'destructive'
    } as const;
    return <Badge variant={variants[severity as keyof typeof variants]}>{severity.toUpperCase()}</Badge>;
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
          <h1 className="text-3xl font-bold">Security Center</h1>
          <p className="text-muted-foreground">Monitor security events and system access</p>
        </div>
        <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          Admin Only
        </Badge>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failedLogins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspicious Activity</CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.suspiciousActivity}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
            <Lock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blockedIPs}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Security Event Log</CardTitle>
                  <CardDescription>Monitor all security-related events and activities</CardDescription>
                </div>
                <Button onClick={exportSecurityLog} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Log
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Events</option>
                  <option value="login">Logins</option>
                  <option value="failed_login">Failed Logins</option>
                  <option value="admin_action">Admin Actions</option>
                  <option value="password_change">Password Changes</option>
                </select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-mono text-sm">
                        {new Date(event.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{getEventTypeBadge(event.type)}</TableCell>
                      <TableCell className="font-medium">{event.user}</TableCell>
                      <TableCell className="font-mono">{event.ip}</TableCell>
                      <TableCell>{event.details}</TableCell>
                      <TableCell>{getSeverityBadge(event.severity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <CardDescription>Configure security policies and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Security settings configuration coming soon. This will include password policies, 
                  session management, IP blocking rules, and two-factor authentication settings.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
