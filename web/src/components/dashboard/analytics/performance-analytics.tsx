/**
 * Smart Tourist Safety System - Performance Analytics Dashboard
 * Component for monitoring system performance and health metrics
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Database,
  Wifi,
  Clock,
  Zap,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Settings,
  Monitor,
  Smartphone,
  Globe,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  uptime: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
}

interface ServiceHealth {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical' | 'down';
  responseTime: number;
  uptime: number;
  lastCheck: string;
  endpoint: string;
  dependencies: string[];
}

interface PerformanceData {
  timestamp: string;
  responseTime: number;
  throughput: number;
  errorRate: number;
  activeUsers: number;
}

interface DatabaseMetrics {
  connections: number;
  maxConnections: number;
  queryTime: number;
  slowQueries: number;
  cacheHitRate: number;
  diskUsage: number;
}

interface PerformanceAnalyticsProps {
  className?: string;
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const MOCK_SYSTEM_METRICS: SystemMetrics = {
  cpuUsage: 68.5,
  memoryUsage: 74.2,
  diskUsage: 45.8,
  networkLatency: 12.3,
  uptime: 99.9,
  responseTime: 245,
  throughput: 1247,
  errorRate: 0.12,
};

const MOCK_SERVICES: ServiceHealth[] = [
  {
    id: 'api-gateway',
    name: 'API Gateway',
    status: 'healthy',
    responseTime: 89,
    uptime: 99.98,
    lastCheck: '2024-01-16T15:30:00Z',
    endpoint: '/api/health',
    dependencies: ['auth-service', 'database'],
  },
  {
    id: 'auth-service',
    name: 'Authentication Service',
    status: 'healthy',
    responseTime: 156,
    uptime: 99.95,
    lastCheck: '2024-01-16T15:30:00Z',
    endpoint: '/auth/health',
    dependencies: ['database', 'redis'],
  },
  {
    id: 'location-service',
    name: 'Location Service',
    status: 'warning',
    responseTime: 423,
    uptime: 99.87,
    lastCheck: '2024-01-16T15:30:00Z',
    endpoint: '/location/health',
    dependencies: ['maps-api', 'database'],
  },
  {
    id: 'notification-service',
    name: 'Notification Service',
    status: 'healthy',
    responseTime: 234,
    uptime: 99.92,
    lastCheck: '2024-01-16T15:30:00Z',
    endpoint: '/notification/health',
    dependencies: ['email-gateway', 'sms-gateway'],
  },
  {
    id: 'emergency-service',
    name: 'Emergency Response',
    status: 'critical',
    responseTime: 789,
    uptime: 98.76,
    lastCheck: '2024-01-16T15:30:00Z',
    endpoint: '/emergency/health',
    dependencies: ['location-service', 'notification-service'],
  },
  {
    id: 'analytics-service',
    name: 'Analytics Service',
    status: 'healthy',
    responseTime: 312,
    uptime: 99.89,
    lastCheck: '2024-01-16T15:30:00Z',
    endpoint: '/analytics/health',
    dependencies: ['database', 'data-warehouse'],
  },
];

const MOCK_PERFORMANCE_DATA: PerformanceData[] = [
  { timestamp: '00:00', responseTime: 234, throughput: 1156, errorRate: 0.08, activeUsers: 892 },
  { timestamp: '04:00', responseTime: 198, throughput: 967, errorRate: 0.05, activeUsers: 634 },
  { timestamp: '08:00', responseTime: 287, throughput: 1423, errorRate: 0.12, activeUsers: 1247 },
  { timestamp: '12:00', responseTime: 312, throughput: 1698, errorRate: 0.15, activeUsers: 1456 },
  { timestamp: '16:00', responseTime: 245, throughput: 1247, errorRate: 0.09, activeUsers: 1123 },
  { timestamp: '20:00', responseTime: 267, throughput: 1089, errorRate: 0.07, activeUsers: 987 },
];

const MOCK_DATABASE_METRICS: DatabaseMetrics = {
  connections: 47,
  maxConnections: 100,
  queryTime: 23.4,
  slowQueries: 3,
  cacheHitRate: 94.7,
  diskUsage: 67.8,
};

const SYSTEM_COMPONENTS = [
  {
    name: 'API Server',
    status: 'healthy' as const,
    usage: 68.5,
    icon: Server,
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/20',
  },
  {
    name: 'Database',
    status: 'healthy' as const,
    usage: 74.2,
    icon: Database,
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
  },
  {
    name: 'Cache',
    status: 'warning' as const,
    usage: 89.1,
    icon: Zap,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
  },
  {
    name: 'Load Balancer',
    status: 'healthy' as const,
    usage: 45.8,
    icon: Network,
    color: 'text-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PerformanceAnalytics({ className }: PerformanceAnalyticsProps) {
  const { user, hasPermission } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  // Auto refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate data refresh
      console.log('Refreshing performance data...');
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Format numbers
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-IN');
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'critical': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'down': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      case 'down': return XCircle;
      default: return AlertTriangle;
    }
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Calculate usage color
  const getUsageColor = (usage: number) => {
    if (usage < 50) return 'text-green-600';
    if (usage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Performance Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor system health, performance metrics, and service status
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              Auto-refresh
            </label>
            
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md disabled:opacity-50"
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', refreshing && 'animate-spin')} />
              Refresh
            </button>
            
            {hasPermission('export_analytics') && (
              <button className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            )}
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
              <Cpu className="h-6 w-6 text-blue-600" />
            </div>
            <div className={cn('text-2xl font-bold', getUsageColor(MOCK_SYSTEM_METRICS.cpuUsage))}>
              {MOCK_SYSTEM_METRICS.cpuUsage}%
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">CPU Usage</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={cn('h-2 rounded-full transition-all duration-500',
                  MOCK_SYSTEM_METRICS.cpuUsage < 50 ? 'bg-green-500' :
                  MOCK_SYSTEM_METRICS.cpuUsage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                )}
                style={{ width: `${MOCK_SYSTEM_METRICS.cpuUsage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
              <MemoryStick className="h-6 w-6 text-green-600" />
            </div>
            <div className={cn('text-2xl font-bold', getUsageColor(MOCK_SYSTEM_METRICS.memoryUsage))}>
              {MOCK_SYSTEM_METRICS.memoryUsage}%
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Memory Usage</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={cn('h-2 rounded-full transition-all duration-500',
                  MOCK_SYSTEM_METRICS.memoryUsage < 50 ? 'bg-green-500' :
                  MOCK_SYSTEM_METRICS.memoryUsage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                )}
                style={{ width: `${MOCK_SYSTEM_METRICS.memoryUsage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {MOCK_SYSTEM_METRICS.responseTime}ms
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Response Time</div>
            <div className="flex items-center mt-1">
              <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">-12.3%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/20">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {MOCK_SYSTEM_METRICS.uptime}%
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">System Uptime</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm text-green-600">+0.1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Health */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Service Health Status
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
            {hasPermission('manage_services') && (
              <button className="flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <Settings className="h-4 w-4 mr-1" />
                Configure
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_SERVICES.map((service) => {
            const StatusIcon = getStatusIcon(service.status);
            
            return (
              <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {service.name}
                  </h4>
                  <div className="flex items-center">
                    <StatusIcon className={cn('h-4 w-4 mr-2',
                      service.status === 'healthy' ? 'text-green-600' :
                      service.status === 'warning' ? 'text-yellow-600' :
                      service.status === 'critical' ? 'text-orange-600' : 'text-red-600'
                    )} />
                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(service.status))}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {service.responseTime}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {service.uptime}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Endpoint</span>
                    <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                      {service.endpoint}
                    </span>
                  </div>
                </div>
                
                {service.dependencies.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Dependencies:</div>
                    <div className="flex flex-wrap gap-1">
                      {service.dependencies.map((dep) => (
                        <span key={dep} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Response Time Trends
            </h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {MOCK_PERFORMANCE_DATA.map((data, index) => {
              const maxResponseTime = Math.max(...MOCK_PERFORMANCE_DATA.map(d => d.responseTime));
              const percentage = (data.responseTime / maxResponseTime) * 100;
              
              return (
                <div key={data.timestamp} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{data.timestamp}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {data.responseTime}ms
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Throughput Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Throughput & Active Users
            </h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {MOCK_PERFORMANCE_DATA.map((data, index) => {
              const maxThroughput = Math.max(...MOCK_PERFORMANCE_DATA.map(d => d.throughput));
              const maxUsers = Math.max(...MOCK_PERFORMANCE_DATA.map(d => d.activeUsers));
              const throughputPercentage = (data.throughput / maxThroughput) * 100;
              const usersPercentage = (data.activeUsers / maxUsers) * 100;
              
              return (
                <div key={data.timestamp} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{data.timestamp}</span>
                    <div className="space-x-4">
                      <span className="text-green-600">{formatNumber(data.throughput)} req/s</span>
                      <span className="text-blue-600">{formatNumber(data.activeUsers)} users</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-green-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${throughputPercentage}%` }}
                      />
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${usersPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Database Metrics */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Database Performance
          </h3>
          <Database className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Connections</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {MOCK_DATABASE_METRICS.connections}/{MOCK_DATABASE_METRICS.maxConnections}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(MOCK_DATABASE_METRICS.connections / MOCK_DATABASE_METRICS.maxConnections) * 100}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Cache Hit Rate</span>
                <span className="font-medium text-green-600">
                  {MOCK_DATABASE_METRICS.cacheHitRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${MOCK_DATABASE_METRICS.cacheHitRate}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Avg Query Time</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {MOCK_DATABASE_METRICS.queryTime}ms
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Slow Queries</span>
              <span className="font-medium text-yellow-600">
                {MOCK_DATABASE_METRICS.slowQueries}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Disk Usage</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {MOCK_DATABASE_METRICS.diskUsage}%
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Recent Operations
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">SELECT queries</span>
                <span className="text-green-600">1,247/min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">INSERT operations</span>
                <span className="text-blue-600">89/min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">UPDATE operations</span>
                <span className="text-yellow-600">34/min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">DELETE operations</span>
                <span className="text-red-600">12/min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Components */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            System Components Status
          </h3>
          <Monitor className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SYSTEM_COMPONENTS.map((component) => {
            const Icon = component.icon;
            
            return (
              <div key={component.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className={cn('p-2 rounded mr-3', component.bg)}>
                      <Icon className={cn('h-4 w-4', component.color)} />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {component.name}
                    </span>
                  </div>
                  <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(component.status))}>
                    {component.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Usage</span>
                    <span className={cn('font-medium', getUsageColor(component.usage))}>
                      {component.usage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={cn('h-2 rounded-full transition-all duration-500',
                        component.usage < 50 ? 'bg-green-500' :
                        component.usage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                      )}
                      style={{ width: `${component.usage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PerformanceAnalytics;
