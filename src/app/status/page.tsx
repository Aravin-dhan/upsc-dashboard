'use client';

import { useState } from 'react';
import { 
  CheckCircle, AlertTriangle, XCircle, Clock, Activity,
  Server, Database, Globe, Shield, Zap, Monitor,
  Calendar, TrendingUp, RefreshCw, ExternalLink
} from 'lucide-react';
import PublicNavbar from '@/components/marketing/PublicNavbar';
import Footer from '@/components/marketing/Footer';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  uptime: string;
  responseTime: string;
  lastChecked: string;
  description: string;
  icon: any;
}

interface Incident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  startTime: string;
  resolvedTime?: string;
  description: string;
  updates: {
    time: string;
    message: string;
    status: string;
  }[];
}

export default function StatusPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  const services: ServiceStatus[] = [
    {
      name: 'UPSC Dashboard',
      status: 'operational',
      uptime: '99.98%',
      responseTime: '245ms',
      lastChecked: '2 minutes ago',
      description: 'Main dashboard and user interface',
      icon: Monitor
    },
    {
      name: 'AI Study Assistant',
      status: 'operational',
      uptime: '99.95%',
      responseTime: '1.2s',
      lastChecked: '1 minute ago',
      description: 'AI-powered study recommendations and chat',
      icon: Zap
    },
    {
      name: 'Authentication Service',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '180ms',
      lastChecked: '30 seconds ago',
      description: 'User login and account management',
      icon: Shield
    },
    {
      name: 'Study Materials API',
      status: 'degraded',
      uptime: '98.45%',
      responseTime: '3.1s',
      lastChecked: '1 minute ago',
      description: 'Content delivery and study resources',
      icon: Database
    },
    {
      name: 'Mock Test Engine',
      status: 'operational',
      uptime: '99.92%',
      responseTime: '890ms',
      lastChecked: '2 minutes ago',
      description: 'Test taking and evaluation system',
      icon: Activity
    },
    {
      name: 'CDN & File Storage',
      status: 'operational',
      uptime: '99.97%',
      responseTime: '120ms',
      lastChecked: '1 minute ago',
      description: 'Global content delivery network',
      icon: Globe
    }
  ];

  const incidents: Incident[] = [
    {
      id: '1',
      title: 'Slow response times for Study Materials API',
      status: 'monitoring',
      severity: 'medium',
      startTime: '2024-01-15 14:30 IST',
      description: 'Some users may experience slower loading times when accessing study materials.',
      updates: [
        {
          time: '2024-01-15 15:45 IST',
          message: 'We have implemented a fix and are monitoring the situation. Response times have improved significantly.',
          status: 'monitoring'
        },
        {
          time: '2024-01-15 14:45 IST',
          message: 'We have identified the root cause as increased database load and are implementing optimizations.',
          status: 'identified'
        },
        {
          time: '2024-01-15 14:30 IST',
          message: 'We are investigating reports of slow loading times for study materials.',
          status: 'investigating'
        }
      ]
    },
    {
      id: '2',
      title: 'Scheduled maintenance for AI Assistant',
      status: 'resolved',
      severity: 'low',
      startTime: '2024-01-14 02:00 IST',
      resolvedTime: '2024-01-14 04:00 IST',
      description: 'Planned maintenance to improve AI response accuracy and performance.',
      updates: [
        {
          time: '2024-01-14 04:00 IST',
          message: 'Maintenance completed successfully. AI Assistant is fully operational with improved performance.',
          status: 'resolved'
        },
        {
          time: '2024-01-14 02:00 IST',
          message: 'Scheduled maintenance has begun. AI Assistant may be temporarily unavailable.',
          status: 'maintenance'
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'outage': return 'text-red-600';
      case 'maintenance': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return CheckCircle;
      case 'degraded': return AlertTriangle;
      case 'outage': return XCircle;
      case 'maintenance': return Clock;
      default: return Clock;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 dark:bg-green-900/20';
      case 'degraded': return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'outage': return 'bg-red-100 dark:bg-red-900/20';
      case 'maintenance': return 'bg-blue-100 dark:bg-blue-900/20';
      default: return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const overallStatus = services.every(s => s.status === 'operational') ? 'operational' : 
                      services.some(s => s.status === 'outage') ? 'outage' : 'degraded';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNavbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              System Status
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Real-time status and performance monitoring for all UPSC Dashboard services.
            </p>
            
            {/* Overall Status */}
            <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-lg ${getStatusBg(overallStatus)}`}>
              {(() => {
                const StatusIcon = getStatusIcon(overallStatus);
                return <StatusIcon className={`h-6 w-6 ${getStatusColor(overallStatus)}`} />;
              })()}
              <span className={`text-lg font-semibold ${getStatusColor(overallStatus)}`}>
                {overallStatus === 'operational' ? 'All Systems Operational' :
                 overallStatus === 'degraded' ? 'Some Systems Degraded' : 'System Outage'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Service Status
            </h2>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
          
          <div className="grid gap-6">
            {services.map((service, index) => {
              const StatusIcon = getStatusIcon(service.status);
              const ServiceIcon = service.icon;
              
              return (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <ServiceIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {service.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Uptime</div>
                        <div className="font-semibold text-gray-900 dark:text-white">{service.uptime}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Response Time</div>
                        <div className="font-semibold text-gray-900 dark:text-white">{service.responseTime}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`h-5 w-5 ${getStatusColor(service.status)}`} />
                        <span className={`font-medium capitalize ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    Last checked: {service.lastChecked}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Incidents */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Recent Incidents
          </h2>
          
          {incidents.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Recent Incidents
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                All systems have been running smoothly with no reported incidents.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {incidents.map((incident) => (
                <div key={incident.id} className="bg-white dark:bg-gray-900 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {incident.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(incident.severity)}`}>
                          {incident.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {incident.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Started: {incident.startTime}</span>
                        {incident.resolvedTime && (
                          <span>Resolved: {incident.resolvedTime}</span>
                        )}
                      </div>
                    </div>
                    <div className={`px-3 py-1 text-sm font-medium rounded-full ${
                      incident.status === 'resolved' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' :
                      incident.status === 'monitoring' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' :
                      'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600'
                    }`}>
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </div>
                  </div>
                  
                  {/* Incident Updates */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Updates</h4>
                    <div className="space-y-3">
                      {incident.updates.map((update, updateIndex) => (
                        <div key={updateIndex} className="flex space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {update.time}
                              </span>
                              <span className="text-xs text-gray-500">
                                {update.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {update.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Uptime History */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Uptime History
            </h2>
            <div className="flex space-x-2">
              {['24h', '7d', '30d', '90d'].map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedTimeframe === timeframe
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="grid gap-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <service.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {service.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-1">
                      {Array.from({ length: 30 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-8 rounded-sm ${
                            Math.random() > 0.05 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          title={`Day ${i + 1}: ${Math.random() > 0.05 ? 'Operational' : 'Downtime'}`}
                        ></div>
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white w-16 text-right">
                      {service.uptime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get notified about service updates and maintenance schedules.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-sm text-blue-200 mt-4">
            You can also follow us on <a href="#" className="underline">Twitter</a> for real-time updates.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
