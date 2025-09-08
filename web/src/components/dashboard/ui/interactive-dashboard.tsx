/**
 * Smart Tourist Safety System - Interactive Dashboard Component
 * Main dashboard with widgets, charts, and real-time updates
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  MapPin,
  AlertTriangle,
  Shield,
  Activity,
  Clock,
  Phone,
  Navigation,
  BarChart3,
  PieChart,
  Calendar,
  RefreshCw,
  Bell,
  Settings,
  Maximize2,
  Minimize2,
  Plus,
  Filter,
  Download,
  Share2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'list' | 'map' | 'custom';
  position: { x: number; y: number; w: number; h: number };
  visible: boolean;
  refreshInterval?: number;
  data?: any;
  config?: any;
}

interface MetricData {
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  prefix?: string;
  suffix?: string;
  format?: 'number' | 'currency' | 'percentage';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }>;
}

interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
  value?: string | number;
  status?: 'success' | 'warning' | 'error' | 'info';
  timestamp?: string;
  action?: () => void;
}

interface InteractiveDashboardProps {
  widgets?: DashboardWidget[];
  onWidgetUpdate?: (widgets: DashboardWidget[]) => void;
  enableEdit?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const DEFAULT_WIDGETS: DashboardWidget[] = [
  {
    id: 'total-tourists',
    title: 'Total Tourists',
    type: 'metric',
    position: { x: 0, y: 0, w: 3, h: 2 },
    visible: true,
    data: {
      value: 1247,
      change: 12.5,
      changeType: 'increase',
      format: 'number',
      color: 'blue',
    },
  },
  {
    id: 'active-alerts',
    title: 'Active Alerts',
    type: 'metric',
    position: { x: 3, y: 0, w: 3, h: 2 },
    visible: true,
    data: {
      value: 8,
      change: -2,
      changeType: 'decrease',
      format: 'number',
      color: 'red',
    },
  },
  {
    id: 'safety-score',
    title: 'Safety Score',
    type: 'metric',
    position: { x: 6, y: 0, w: 3, h: 2 },
    visible: true,
    data: {
      value: 92,
      change: 3.2,
      changeType: 'increase',
      suffix: '%',
      format: 'number',
      color: 'green',
    },
  },
  {
    id: 'response-time',
    title: 'Avg Response Time',
    type: 'metric',
    position: { x: 9, y: 0, w: 3, h: 2 },
    visible: true,
    data: {
      value: '4.2',
      change: -0.8,
      changeType: 'decrease',
      suffix: ' min',
      format: 'number',
      color: 'yellow',
    },
  },
  {
    id: 'tourist-trends',
    title: 'Tourist Trends',
    type: 'chart',
    position: { x: 0, y: 2, w: 6, h: 4 },
    visible: true,
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Visitors',
          data: [120, 150, 180, 160, 200, 250, 220],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
        },
      ],
    },
  },
  {
    id: 'location-distribution',
    title: 'Location Distribution',
    type: 'chart',
    position: { x: 6, y: 2, w: 6, h: 4 },
    visible: true,
    data: {
      labels: ['Red Fort', 'India Gate', 'Lotus Temple', 'Qutub Minar', 'Others'],
      datasets: [
        {
          label: 'Visitors',
          data: [30, 25, 20, 15, 10],
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6',
          ],
        },
      ],
    },
  },
  {
    id: 'recent-incidents',
    title: 'Recent Incidents',
    type: 'list',
    position: { x: 0, y: 6, w: 6, h: 4 },
    visible: true,
    data: [
      {
        id: 'inc-001',
        title: 'Medical Emergency',
        subtitle: 'Red Fort - Main Gate',
        status: 'error',
        timestamp: '2 min ago',
      },
      {
        id: 'inc-002',
        title: 'Lost Tourist',
        subtitle: 'India Gate Area',
        status: 'warning',
        timestamp: '15 min ago',
      },
      {
        id: 'inc-003',
        title: 'Crowd Alert',
        subtitle: 'Lotus Temple',
        status: 'info',
        timestamp: '32 min ago',
      },
      {
        id: 'inc-004',
        title: 'Security Check',
        subtitle: 'Qutub Minar',
        status: 'success',
        timestamp: '1 hour ago',
      },
    ],
  },
  {
    id: 'active-officers',
    title: 'Active Officers',
    type: 'list',
    position: { x: 6, y: 6, w: 6, h: 4 },
    visible: true,
    data: [
      {
        id: 'off-001',
        title: 'Officer Sarah Chen',
        subtitle: 'Red Fort Sector',
        value: 'On Duty',
        status: 'success',
      },
      {
        id: 'off-002',
        title: 'Officer Raj Patel',
        subtitle: 'India Gate Sector',
        value: 'On Patrol',
        status: 'info',
      },
      {
        id: 'off-003',
        title: 'Officer Maya Singh',
        subtitle: 'Lotus Temple Sector',
        value: 'Break',
        status: 'warning',
      },
      {
        id: 'off-004',
        title: 'Officer Alex Kumar',
        subtitle: 'Qutub Minar Sector',
        value: 'On Duty',
        status: 'success',
      },
    ],
  },
];

const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  purple: '#8b5cf6',
  gray: '#6b7280',
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatNumber = (value: number, format: string = 'number'): string => {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(value);
    case 'percentage':
      return `${value}%`;
    default:
      return new Intl.NumberFormat('en-IN').format(value);
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'success':
      return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    case 'warning':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    case 'error':
      return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    case 'info':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
  }
};

const getMetricColor = (color?: string) => {
  switch (color) {
    case 'blue':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    case 'green':
      return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    case 'red':
      return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    case 'yellow':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
    case 'purple':
      return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
  }
};

// ============================================================================
// WIDGET COMPONENTS
// ============================================================================

function MetricWidget({ widget }: { widget: DashboardWidget }) {
  const data = widget.data as MetricData;
  const colorClass = getMetricColor(data.color);
  
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          {widget.title}
        </h3>
        <div className={cn('p-2 rounded-lg', colorClass)}>
          <TrendingUp className="h-4 w-4" />
        </div>
      </div>
      
      <div className="mt-4">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {data.prefix}
          {typeof data.value === 'number' 
            ? formatNumber(data.value, data.format) 
            : data.value}
          {data.suffix}
        </div>
        
        {data.change !== undefined && (
          <div className="flex items-center mt-2">
            {data.changeType === 'increase' ? (
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
            ) : data.changeType === 'decrease' ? (
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
            ) : (
              <Activity className="h-4 w-4 text-gray-600 mr-1" />
            )}
            <span className={cn(
              'text-sm font-medium',
              data.changeType === 'increase' && 'text-green-600',
              data.changeType === 'decrease' && 'text-red-600',
              data.changeType === 'neutral' && 'text-gray-600'
            )}>
              {Math.abs(data.change)}% from last week
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ChartWidget({ widget }: { widget: DashboardWidget }) {
  const data = widget.data as ChartData;
  
  // Simple chart representation (you would use a real chart library like Chart.js or Recharts)
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
        {widget.title}
      </h3>
      
      <div className="flex-1 flex items-end justify-between space-x-2 pb-4">
        {data.datasets[0].data.map((value, index) => {
          const maxValue = Math.max(...data.datasets[0].data);
          const height = (value / maxValue) * 100;
          
          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div
                className="w-8 bg-blue-500 rounded-t"
                style={{ height: `${height}%` }}
                title={`${data.labels[index]}: ${value}`}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {data.labels[index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ListWidget({ widget }: { widget: DashboardWidget }) {
  const data = widget.data as ListItem[];
  
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
        {widget.title}
      </h3>
      
      <div className="flex-1 space-y-3 overflow-y-auto">
        {data.map((item) => (
          <div
            key={item.id}
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            onClick={item.action}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {item.title}
                </div>
                {item.subtitle && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {item.subtitle}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {item.value && (
                  <span className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full',
                    getStatusColor(item.status)
                  )}>
                    {item.value}
                  </span>
                )}
                {item.timestamp && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.timestamp}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function InteractiveDashboard({
  widgets: initialWidgets = DEFAULT_WIDGETS,
  onWidgetUpdate,
  enableEdit = true,
  autoRefresh = true,
  refreshInterval = 30000,
  className,
}: InteractiveDashboardProps) {
  const { user, hasPermission } = useAuth();
  const [widgets, setWidgets] = useState<DashboardWidget[]>(initialWidgets);
  const [editMode, setEditMode] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refreshDashboard();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Refresh dashboard data
  const refreshDashboard = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update last refresh time
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  // Toggle widget visibility
  const toggleWidgetVisibility = (widgetId: string) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId 
        ? { ...widget, visible: !widget.visible }
        : widget
    );
    setWidgets(updatedWidgets);
    onWidgetUpdate?.(updatedWidgets);
  };

  // Get widget component
  const renderWidget = (widget: DashboardWidget) => {
    switch (widget.type) {
      case 'metric':
        return <MetricWidget widget={widget} />;
      case 'chart':
        return <ChartWidget widget={widget} />;
      case 'list':
        return <ListWidget widget={widget} />;
      default:
        return (
          <div className="h-full flex items-center justify-center text-gray-500">
            Widget type not supported
          </div>
        );
    }
  };

  // Calculate grid layout
  const getGridStyle = (position: DashboardWidget['position']) => ({
    gridColumn: `span ${position.w}`,
    gridRow: `span ${position.h}`,
  });

  return (
    <div className={cn('space-y-6', className)}>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Safety Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Auto refresh indicator */}
          {autoRefresh && (
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <Activity className="h-3 w-3 mr-1" />
              Auto-refresh: {refreshInterval / 1000}s
            </div>
          )}
          
          {/* Refresh button */}
          <button
            onClick={refreshDashboard}
            disabled={isRefreshing}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
          </button>
          
          {/* Settings */}
          {enableEdit && (
            <button
              onClick={() => setEditMode(!editMode)}
              className={cn(
                'p-2 rounded-md transition-colors',
                editMode
                  ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <Settings className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Edit Mode Controls */}
      {editMode && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Dashboard Edit Mode
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Click the eye icon to show/hide widgets. Drag to reorder (coming soon).
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1.5 text-sm text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                onClick={() => setEditMode(false)}
              >
                Done
              </button>
            </div>
          </div>
          
          {/* Widget Visibility Controls */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {widgets.map((widget) => (
              <button
                key={widget.id}
                onClick={() => toggleWidgetVisibility(widget.id)}
                className={cn(
                  'flex items-center px-3 py-2 text-sm rounded-md border transition-colors',
                  widget.visible
                    ? 'text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800'
                    : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                )}
              >
                {widget.visible ? (
                  <Eye className="h-4 w-4 mr-2" />
                ) : (
                  <EyeOff className="h-4 w-4 mr-2" />
                )}
                {widget.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-12 gap-6 auto-rows-fr">
        {widgets
          .filter(widget => widget.visible)
          .map((widget) => (
            <div
              key={widget.id}
              style={getGridStyle(widget.position)}
              className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Widget Header */}
              {editMode && (
                <div className="absolute top-2 right-2 flex items-center space-x-1">
                  <button
                    onClick={() => toggleWidgetVisibility(widget.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <EyeOff className="h-3 w-3" />
                  </button>
                </div>
              )}
              
              {/* Widget Content */}
              {renderWidget(widget)}
            </div>
          ))}
      </div>

      {/* Empty State */}
      {widgets.filter(w => w.visible).length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No widgets visible
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Enable edit mode to configure your dashboard widgets.
          </p>
          {enableEdit && (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Configure Dashboard
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default InteractiveDashboard;
