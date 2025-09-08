/**
 * Smart Tourist Safety System - Analytics Page
 * Main page integrating all analytics components
 */

'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  AlertTriangle,
  Activity,
  FileText,
  TrendingUp,
  Download,
  RefreshCw,
  Settings,
  Eye,
  Calendar,
  Target,
  Shield,
  MapPin,
  Clock,
  Database,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { 
  TouristAnalytics, 
  SafetyIncidentAnalytics, 
  PerformanceAnalytics, 
  CustomReports 
} from '@/components/dashboard/analytics';

// ============================================================================
// TYPES
// ============================================================================

type AnalyticsTab = 'overview' | 'tourists' | 'safety' | 'performance' | 'reports';

interface AnalyticsOverview {
  totalTourists: number;
  activeTourists: number;
  safetyIncidents: number;
  systemUptime: number;
  responseTime: number;
  satisfaction: number;
  reportsGenerated: number;
  dataProcessed: string;
}

interface AnalyticsPageProps {
  className?: string;
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const MOCK_OVERVIEW: AnalyticsOverview = {
  totalTourists: 12847,
  activeTourists: 3456,
  safetyIncidents: 157,
  systemUptime: 99.9,
  responseTime: 245,
  satisfaction: 4.6,
  reportsGenerated: 89,
  dataProcessed: '2.4 TB',
};

const ANALYTICS_TABS = [
  {
    id: 'overview' as AnalyticsTab,
    label: 'Overview',
    icon: BarChart3,
    description: 'Dashboard overview with key metrics',
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
  },
  {
    id: 'tourists' as AnalyticsTab,
    label: 'Tourist Analytics',
    icon: Users,
    description: 'Comprehensive tourist behavior analysis',
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/20',
  },
  {
    id: 'safety' as AnalyticsTab,
    label: 'Safety Incidents',
    icon: AlertTriangle,
    description: 'Safety incident monitoring and analysis',
    color: 'text-red-600',
    bg: 'bg-red-100 dark:bg-red-900/20',
  },
  {
    id: 'performance' as AnalyticsTab,
    label: 'System Performance',
    icon: Activity,
    description: 'System health and performance metrics',
    color: 'text-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
  },
  {
    id: 'reports' as AnalyticsTab,
    label: 'Custom Reports',
    icon: FileText,
    description: 'Create and manage custom reports',
    color: 'text-orange-600',
    bg: 'bg-orange-100 dark:bg-orange-900/20',
  },
];

const OVERVIEW_METRICS = [
  {
    title: 'Total Tourists',
    value: '12,847',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    description: 'Registered tourists',
  },
  {
    title: 'Active Now',
    value: '3,456',
    change: '+8.3%',
    trend: 'up',
    icon: Activity,
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/20',
    description: 'Currently active tourists',
  },
  {
    title: 'Safety Incidents',
    value: '157',
    change: '-23.1%',
    trend: 'down',
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-100 dark:bg-red-900/20',
    description: 'Total incidents this month',
  },
  {
    title: 'System Uptime',
    value: '99.9%',
    change: '+0.1%',
    trend: 'up',
    icon: Shield,
    color: 'text-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    description: 'System availability',
  },
  {
    title: 'Avg Response Time',
    value: '245ms',
    change: '-12.3%',
    trend: 'down',
    icon: Clock,
    color: 'text-orange-600',
    bg: 'bg-orange-100 dark:bg-orange-900/20',
    description: 'API response time',
  },
  {
    title: 'Satisfaction Score',
    value: '4.6/5',
    change: '+2.1%',
    trend: 'up',
    icon: Target,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    description: 'Tourist satisfaction rating',
  },
];

const RECENT_INSIGHTS = [
  {
    id: 'insight-001',
    type: 'trend',
    title: 'Tourist Activity Peak',
    description: 'Tourist activity increased by 15% during weekend hours',
    timestamp: '2 hours ago',
    icon: TrendingUp,
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/20',
  },
  {
    id: 'insight-002',
    type: 'safety',
    title: 'Incident Reduction',
    description: 'Safety incidents decreased by 23% compared to last month',
    timestamp: '4 hours ago',
    icon: Shield,
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
  },
  {
    id: 'insight-003',
    type: 'performance',
    title: 'System Optimization',
    description: 'API response time improved by 12% after recent updates',
    timestamp: '6 hours ago',
    icon: Zap,
    color: 'text-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
  },
  {
    id: 'insight-004',
    type: 'location',
    title: 'Popular Destination',
    description: 'India Gate saw 25% more visitors this week',
    timestamp: '1 day ago',
    icon: MapPin,
    color: 'text-orange-600',
    bg: 'bg-orange-100 dark:bg-orange-900/20',
  },
];

const QUICK_STATS = [
  { label: 'Reports Generated', value: '89', icon: FileText },
  { label: 'Data Processed', value: '2.4 TB', icon: Database },
  { label: 'API Calls', value: '1.2M', icon: Zap },
  { label: 'Success Rate', value: '98.7%', icon: CheckCircle },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AnalyticsPage({ className }: AnalyticsPageProps) {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');
  const [refreshing, setRefreshing] = useState(false);

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-IN');
  };

  // Get trend info
  const getTrendInfo = (trend: 'up' | 'down') => {
    return trend === 'up' 
      ? { icon: TrendingUp, color: 'text-green-600' }
      : { icon: TrendingUp, color: 'text-red-600', rotation: 'rotate-180' };
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Render overview tab content
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {OVERVIEW_METRICS.map((metric) => {
          const Icon = metric.icon;
          const trendInfo = getTrendInfo(metric.trend as 'up' | 'down');
          const TrendIcon = trendInfo.icon;
          
          return (
            <div key={metric.title} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div className={cn('p-3 rounded-full', metric.bg)}>
                  <Icon className={cn('h-6 w-6', metric.color)} />
                </div>
                <div className={cn('flex items-center text-sm font-medium', trendInfo.color)}>
                  <TrendIcon className={cn('h-4 w-4 mr-1', trendInfo.rotation)} />
                  {metric.change}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {metric.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Quick Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Insights */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Recent Insights
        </h3>
        
        <div className="space-y-4">
          {RECENT_INSIGHTS.map((insight) => {
            const Icon = insight.icon;
            
            return (
              <div key={insight.id} className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className={cn('p-2 rounded-full flex-shrink-0', insight.bg)}>
                  <Icon className={cn('h-5 w-5', insight.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {insight.title}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {insight.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {insight.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive analytics and insights for the tourist safety system
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">Last Updated</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date().toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
            
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
            
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
            
            {hasPermission('manage_analytics') && (
              <button className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Analytics tabs">
            {ANALYTICS_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  <Icon className={cn('h-5 w-5 mr-2', isActive ? tab.color : 'text-gray-400')} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Analytics Overview
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Key performance indicators and system insights at a glance
                </p>
              </div>
              {renderOverview()}
            </div>
          )}

          {activeTab === 'tourists' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Tourist Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Detailed analysis of tourist behavior, demographics, and engagement patterns
                </p>
              </div>
              <TouristAnalytics />
            </div>
          )}

          {activeTab === 'safety' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Safety Incident Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Monitor safety incidents, response times, and identify patterns for prevention
                </p>
              </div>
              <SafetyIncidentAnalytics />
            </div>
          )}

          {activeTab === 'performance' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  System Performance Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Monitor system health, performance metrics, and service availability
                </p>
              </div>
              <PerformanceAnalytics />
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Custom Reports
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create, schedule, and manage custom analytics reports for various stakeholders
                </p>
              </div>
              <CustomReports />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
