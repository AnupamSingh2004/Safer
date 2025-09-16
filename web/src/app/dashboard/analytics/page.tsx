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
  // Page components in app directory don't accept custom props
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

function AnalyticsPage() {
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
    <div className="component-stack-lg">
      {/* Key Metrics Grid */}
      <div className="grid-dashboard">
        {OVERVIEW_METRICS.map((metric) => {
          const Icon = metric.icon;
          const trendInfo = getTrendInfo(metric.trend as 'up' | 'down');
          const TrendIcon = trendInfo.icon;
          
          return (
            <div key={metric.title} className="dashboard-card hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={cn('p-4 rounded-xl shadow-sm group-hover:scale-110 transition-transform', metric.bg)}>
                  <Icon className={cn('h-7 w-7', metric.color)} />
                </div>
                <div className={cn('flex items-center text-sm font-semibold px-3 py-2 rounded-full', trendInfo.color.replace('text-', 'bg-').replace('-600', '-100'), trendInfo.color.replace('-600', '-700'))}>
                  <TrendIcon className={cn('h-4 w-4 mr-2', trendInfo.rotation)} />
                  {metric.change}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {metric.value}
                </div>
                <div className="text-lg font-semibold text-muted-foreground mb-1">
                  {metric.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="dashboard-card">
        <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Activity className="w-7 h-7 text-primary" />
          Quick Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {QUICK_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Insights */}
      <div className="dashboard-card">
        <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
          <Zap className="w-7 h-7 text-primary" />
          Recent Insights
        </h3>
        
        <div className="component-stack-md">
          {RECENT_INSIGHTS.map((insight) => {
            const Icon = insight.icon;
            
            return (
              <div key={insight.id} className="flex items-start space-x-5 p-6 border-2 border-border rounded-xl hover:border-primary/30 hover:bg-muted/30 transition-all duration-300 group">
                <div className={cn('p-3 rounded-xl shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform', insight.bg)}>
                  <Icon className={cn('h-6 w-6', insight.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-foreground">
                      {insight.title}
                    </h4>
                    <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                      {insight.timestamp}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
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
    <div className="dashboard-container component-stack-lg">
      {/* Page Header */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-primary" />
              Analytics Dashboard
            </h1>
            <p className="text-base text-muted-foreground">
              Comprehensive analytics and insights for the tourist safety system
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
              <div className="text-base font-semibold text-foreground">
                {new Date().toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
            
            <div className="h-12 w-px bg-border" />
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl border border-border transition-colors disabled:opacity-50"
            >
              <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
              Refresh
            </button>
            
            {hasPermission('export_analytics') && (
              <button className="flex items-center gap-2 px-6 py-3 text-sm text-white bg-primary hover:bg-primary/90 rounded-xl shadow-sm transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
            
            {hasPermission('manage_analytics') && (
              <button className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl border border-border transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-card">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-2" aria-label="Analytics tabs">
            {ANALYTICS_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center py-4 px-3 border-b-3 font-semibold text-sm whitespace-nowrap transition-all',
                    isActive
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  )}
                >
                  <div className={cn('p-2 rounded-lg mr-3', isActive ? tab.bg : 'bg-muted/50')}>
                    <Icon className={cn('w-5 h-5', isActive ? tab.color : 'text-muted-foreground')} />
                  </div>
                  <div className="text-left">
                    <div>{tab.label}</div>
                    <div className="text-xs opacity-75 font-normal">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Analytics Overview
                </h3>
                <p className="text-lg text-muted-foreground">
                  Key performance indicators and system insights at a glance
                </p>
              </div>
              {renderOverview()}
            </div>
          )}

          {activeTab === 'tourists' && (
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Tourist Analytics
                </h3>
                <p className="text-lg text-muted-foreground">
                  Detailed analysis of tourist behavior, demographics, and engagement patterns
                </p>
              </div>
              <TouristAnalytics />
            </div>
          )}

          {activeTab === 'safety' && (
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Safety Incident Analytics
                </h3>
                <p className="text-lg text-muted-foreground">
                  Monitor safety incidents, response times, and identify patterns for prevention
                </p>
              </div>
              <SafetyIncidentAnalytics />
            </div>
          )}

          {activeTab === 'performance' && (
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  System Performance Analytics
                </h3>
                <p className="text-lg text-muted-foreground">
                  Monitor system health, performance metrics, and service availability
                </p>
              </div>
              <PerformanceAnalytics />
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Custom Reports
                </h3>
                <p className="text-lg text-muted-foreground">
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
