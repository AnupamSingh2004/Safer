/**
 * Smart Tourist Safety System - Analytics Dashboard Page
 * Main analytics and reporting interface with comprehensive data visualization
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle, 
  Shield, 
  Clock,
  MapPin,
  Activity,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  Globe
} from 'lucide-react';
import { analyticsService } from '@/services/analytics';
import type { 
  AnalyticsData, 
  TourismStats, 
  SafetyMetrics, 
  AlertStatistics,
  KPI,
  RealTimeMetrics
} from '@/types/analytics';

// ============================================================================
// SIMPLE UI COMPONENTS (Inline for prototype)
// ============================================================================

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ 
  children, 
  onClick, 
  variant = 'default',
  size = 'default',
  disabled = false,
  className = ''
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  className?: string;
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
    ghost: 'hover:bg-gray-100'
  };
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    default: 'h-10 px-4 py-2',
    lg: 'h-11 px-8'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// ============================================================================
// METRICS CARD COMPONENT
// ============================================================================

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const MetricCard = ({ title, value, change, changeLabel, icon, trend, color = 'blue' }: MetricCardProps) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    red: 'text-red-600 bg-red-50',
    purple: 'text-purple-600 bg-purple-50'
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-1">
              {getTrendIcon()}
              <span className={`text-sm ml-1 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                {change > 0 ? '+' : ''}{change}% {changeLabel}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// CHART COMPONENT (Simple visualization)
// ============================================================================

const SimpleChart = ({ data, title, height = 200 }: { data: any[]; title: string; height?: number }) => (
  <Card>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="flex items-end justify-between space-x-2" style={{ height }}>
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div 
            className="w-full bg-blue-500 rounded-t"
            style={{ height: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%` }}
          ></div>
          <span className="text-xs text-gray-600 mt-2">{item.label}</span>
        </div>
      ))}
    </div>
  </Card>
);

// ============================================================================
// MAIN ANALYTICS DASHBOARD COMPONENT
// ============================================================================

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [tourismStats, setTourismStats] = useState<TourismStats | null>(null);
  const [safetyMetrics, setSafetyMetrics] = useState<SafetyMetrics | null>(null);
  const [alertStats, setAlertStats] = useState<AlertStatistics | null>(null);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  useEffect(() => {
    loadAllData();
  }, [selectedTimeRange]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadRealTimeData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [analytics, tourism, safety, alerts, kpiData, realTime] = await Promise.all([
        analyticsService.getAnalyticsOverview(),
        analyticsService.getTourismStats(),
        analyticsService.getSafetyMetrics(),
        analyticsService.getAlertStatistics(),
        analyticsService.getKPIs(),
        analyticsService.getRealTimeMetrics()
      ]);

      setAnalyticsData(analytics);
      setTourismStats(tourism);
      setSafetyMetrics(safety);
      setAlertStats(alerts);
      setKpis(kpiData);
      setRealTimeMetrics(realTime);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeData = async () => {
    try {
      const realTime = await analyticsService.getRealTimeMetrics();
      setRealTimeMetrics(realTime);
    } catch (err) {
      console.error('Failed to refresh real-time data:', err);
    }
  };

  const handleRefresh = () => {
    loadAllData();
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting analytics data...');
  };

  // ============================================================================
  // LOADING AND ERROR STATES
  // ============================================================================

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">Error loading analytics: {error}</span>
          </div>
          <Button onClick={handleRefresh} className="mt-4" variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER DASHBOARD
  // ============================================================================

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive overview of tourist safety and system performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select 
              value={selectedTimeRange} 
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Real-time Status Bar */}
      {realTimeMetrics && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">System Status: </span>
                <Badge variant="success">Healthy</Badge>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm">{realTimeMetrics.activeTourists.toLocaleString()} Active Tourists</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-sm">{realTimeMetrics.activeAlerts} Active Alerts</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm">Threat Level: </span>
                <Badge variant="success">{realTimeMetrics.currentThreatLevel}</Badge>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date(realTimeMetrics.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Tourists"
            value={analyticsData.totalTourists.toLocaleString()}
            change={12.5}
            changeLabel="vs last month"
            icon={<Users className="h-6 w-6" />}
            trend="up"
            color="blue"
          />
          <MetricCard
            title="Active Alerts"
            value={analyticsData.activeAlerts}
            change={-8.3}
            changeLabel="vs yesterday"
            icon={<AlertTriangle className="h-6 w-6" />}
            trend="down"
            color="yellow"
          />
          <MetricCard
            title="Safety Score"
            value={`${Math.round((analyticsData.resolvedAlerts / analyticsData.totalAlerts) * 100)}%`}
            change={2.1}
            changeLabel="improvement"
            icon={<Shield className="h-6 w-6" />}
            trend="up"
            color="green"
          />
          <MetricCard
            title="Response Time"
            value={`${analyticsData.averageResponseTime}m`}
            change={-15.2}
            changeLabel="faster"
            icon={<Clock className="h-6 w-6" />}
            trend="down"
            color="purple"
          />
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tourist Activity Chart */}
        {tourismStats && (
          <SimpleChart
            title="Visitor Distribution by Country"
            data={tourismStats.visitorsByCountry.slice(0, 7).map(country => ({
              label: country.countryCode,
              value: country.count
            }))}
          />
        )}

        {/* Incident Types Chart */}
        {safetyMetrics && (
          <SimpleChart
            title="Safety Incidents by Type"
            data={safetyMetrics.incidentsByType.map(incident => ({
              label: incident.type,
              value: incident.count
            }))}
          />
        )}
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tourism Statistics */}
        {tourismStats && (
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Tourism Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">New Visitors</span>
                <span className="font-medium">{tourismStats.newVisitors.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Returning Visitors</span>
                <span className="font-medium">{tourismStats.returningVisitors.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Stay Duration</span>
                <span className="font-medium">{tourismStats.averageStayDuration} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Growth</span>
                <span className="font-medium text-green-600">+{tourismStats.monthlyGrowth}%</span>
              </div>
            </div>
          </Card>
        )}

        {/* Safety Metrics */}
        {safetyMetrics && (
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Safety Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Incidents</span>
                <span className="font-medium">{safetyMetrics.totalIncidents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Resolved</span>
                <span className="font-medium text-green-600">{safetyMetrics.resolvedIncidents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-medium text-yellow-600">{safetyMetrics.pendingIncidents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Resolution Time</span>
                <span className="font-medium">{safetyMetrics.averageResolutionTime}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Safety Score</span>
                <span className="font-medium text-green-600">{safetyMetrics.safetyScore}%</span>
              </div>
            </div>
          </Card>
        )}

        {/* Alert Statistics */}
        {alertStats && (
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Alert Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Emergency Alerts</span>
                <span className="font-medium text-red-600">{alertStats.emergencyAlerts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Warning Alerts</span>
                <span className="font-medium text-yellow-600">{alertStats.warningAlerts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Info Alerts</span>
                <span className="font-medium text-blue-600">{alertStats.infoAlerts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Escalation Rate</span>
                <span className="font-medium">{alertStats.escalationRates}%</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* KPI Dashboard */}
      {kpis.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Key Performance Indicators
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">{kpi.name}</span>
                  <Badge variant={kpi.status === 'good' ? 'success' : kpi.status === 'warning' ? 'warning' : 'danger'}>
                    {kpi.status}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {kpi.value}{kpi.unit}
                </div>
                <div className="text-sm text-gray-500">
                  Target: {kpi.target}{kpi.unit}
                </div>
                <div className={`text-sm flex items-center mt-1 ${
                  kpi.trend === 'up' ? 'text-green-600' : 
                  kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {kpi.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                  {kpi.trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                  {kpi.trendPercentage > 0 ? '+' : ''}{kpi.trendPercentage}%
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Activities */}
      {realTimeMetrics && realTimeMetrics.recentActivities.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Recent Activities
          </h3>
          <div className="space-y-3">
            {realTimeMetrics.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'emergency_call' ? 'bg-red-100 text-red-600' :
                    activity.type === 'alert_created' ? 'bg-yellow-100 text-yellow-600' :
                    activity.type === 'identity_verified' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {activity.type === 'tourist_checkin' && <Users className="h-4 w-4" />}
                    {activity.type === 'alert_created' && <AlertTriangle className="h-4 w-4" />}
                    {activity.type === 'identity_verified' && <Shield className="h-4 w-4" />}
                    {activity.type === 'emergency_call' && <AlertTriangle className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    {activity.location && (
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {activity.location}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
