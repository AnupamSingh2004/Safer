/**
 * Smart Tourist Safety System - Tourist Analytics Dashboard
 * Component for displaying tourist-related analytics and metrics
 */

'use client';

import React, { useState } from 'react';
import {
  Users,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  UserCheck,
  AlertTriangle,
  Clock,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Map,
  Smartphone,
  Star,
  Navigation,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface TouristMetrics {
  totalTourists: number;
  activeTourists: number;
  newRegistrations: number;
  completedTrips: number;
  averageStayDuration: number;
  safetyIncidents: number;
  satisfactionScore: number;
  appDownloads: number;
}

interface LocationData {
  id: string;
  name: string;
  touristCount: number;
  averageStay: number;
  safetyRating: number;
  popularityTrend: 'up' | 'down' | 'stable';
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface TrendData {
  period: string;
  tourists: number;
  incidents: number;
  satisfaction: number;
}

interface DemographicData {
  ageGroup: string;
  count: number;
  percentage: number;
  color: string;
}

interface TouristAnalyticsProps {
  className?: string;
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const MOCK_METRICS: TouristMetrics = {
  totalTourists: 12847,
  activeTourists: 3456,
  newRegistrations: 234,
  completedTrips: 8965,
  averageStayDuration: 4.2,
  safetyIncidents: 12,
  satisfactionScore: 4.6,
  appDownloads: 15623,
};

const MOCK_TREND_DATA: TrendData[] = [
  { period: 'Jan', tourists: 8500, incidents: 15, satisfaction: 4.2 },
  { period: 'Feb', tourists: 9200, incidents: 12, satisfaction: 4.3 },
  { period: 'Mar', tourists: 10100, incidents: 8, satisfaction: 4.4 },
  { period: 'Apr', tourists: 11500, incidents: 10, satisfaction: 4.5 },
  { period: 'May', tourists: 12000, incidents: 6, satisfaction: 4.6 },
  { period: 'Jun', tourists: 12847, incidents: 12, satisfaction: 4.6 },
];

const MOCK_LOCATION_DATA: LocationData[] = [
  {
    id: 'red-fort',
    name: 'Red Fort',
    touristCount: 2456,
    averageStay: 3.2,
    safetyRating: 4.8,
    popularityTrend: 'up',
    coordinates: { lat: 28.6562, lng: 77.2410 },
  },
  {
    id: 'india-gate',
    name: 'India Gate',
    touristCount: 3124,
    averageStay: 2.1,
    safetyRating: 4.9,
    popularityTrend: 'up',
    coordinates: { lat: 28.6129, lng: 77.2295 },
  },
  {
    id: 'lotus-temple',
    name: 'Lotus Temple',
    touristCount: 1897,
    averageStay: 2.8,
    safetyRating: 4.7,
    popularityTrend: 'stable',
    coordinates: { lat: 28.5535, lng: 77.2588 },
  },
  {
    id: 'qutub-minar',
    name: 'Qutub Minar',
    touristCount: 1654,
    averageStay: 3.5,
    safetyRating: 4.6,
    popularityTrend: 'down',
    coordinates: { lat: 28.5244, lng: 77.1855 },
  },
  {
    id: 'humayuns-tomb',
    name: "Humayun's Tomb",
    touristCount: 1234,
    averageStay: 2.9,
    safetyRating: 4.5,
    popularityTrend: 'up',
    coordinates: { lat: 28.5933, lng: 77.2507 },
  },
];

const MOCK_DEMOGRAPHIC_DATA: DemographicData[] = [
  { ageGroup: '18-25', count: 3456, percentage: 26.9, color: 'bg-blue-500' },
  { ageGroup: '26-35', count: 4123, percentage: 32.1, color: 'bg-green-500' },
  { ageGroup: '36-45', count: 2847, percentage: 22.2, color: 'bg-purple-500' },
  { ageGroup: '46-55', count: 1698, percentage: 13.2, color: 'bg-orange-500' },
  { ageGroup: '55+', count: 723, percentage: 5.6, color: 'bg-red-500' },
];

const TIME_PERIODS = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 3 Months' },
  { value: '1y', label: 'Last Year' },
];

const METRIC_CARDS = [
  {
    title: 'Total Tourists',
    key: 'totalTourists' as keyof TouristMetrics,
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    trend: '+12.5%',
    trendDirection: 'up' as const,
  },
  {
    title: 'Active Now',
    key: 'activeTourists' as keyof TouristMetrics,
    icon: Activity,
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/20',
    trend: '+8.3%',
    trendDirection: 'up' as const,
  },
  {
    title: 'New Registrations',
    key: 'newRegistrations' as keyof TouristMetrics,
    icon: UserCheck,
    color: 'text-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    trend: '+15.7%',
    trendDirection: 'up' as const,
  },
  {
    title: 'Safety Incidents',
    key: 'safetyIncidents' as keyof TouristMetrics,
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-100 dark:bg-red-900/20',
    trend: '-23.1%',
    trendDirection: 'down' as const,
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TouristAnalytics({ className }: TouristAnalyticsProps) {
  const { user, hasPermission } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-IN');
  };

  // Get trend icon and color
  const getTrendInfo = (direction: 'up' | 'down') => {
    return direction === 'up' 
      ? { icon: TrendingUp, color: 'text-green-600' }
      : { icon: TrendingDown, color: 'text-red-600' };
  };

  // Get popularity trend icon
  const getPopularityTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return { icon: TrendingUp, color: 'text-green-600' };
      case 'down': return { icon: TrendingDown, color: 'text-red-600' };
      case 'stable': return { icon: Activity, color: 'text-gray-600' };
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Handle export
  const handleExport = () => {
    // Simulate export functionality
    const data = {
      metrics: MOCK_METRICS,
      trends: MOCK_TREND_DATA,
      locations: MOCK_LOCATION_DATA,
      demographics: MOCK_DEMOGRAPHIC_DATA,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tourist-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Tourist Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive insights into tourist patterns and behavior
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              {TIME_PERIODS.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
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
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRIC_CARDS.map((card) => {
          const Icon = card.icon;
          const value = MOCK_METRICS[card.key];
          const trendInfo = getTrendInfo(card.trendDirection);
          const TrendIcon = trendInfo.icon;
          
          return (
            <div key={card.title} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div className={cn('p-3 rounded-full', card.bg)}>
                  <Icon className={cn('h-6 w-6', card.color)} />
                </div>
                <div className={cn('flex items-center text-sm font-medium', trendInfo.color)}>
                  <TrendIcon className="h-4 w-4 mr-1" />
                  {card.trend}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {typeof value === 'number' ? (
                    card.key === 'satisfactionScore' ? value.toFixed(1) : formatNumber(value)
                  ) : value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {card.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tourist Trends Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Tourist Trends
            </h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {MOCK_TREND_DATA.map((data, index) => {
              const maxTourists = Math.max(...MOCK_TREND_DATA.map(d => d.tourists));
              const percentage = (data.tourists / maxTourists) * 100;
              
              return (
                <div key={data.period} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{data.period}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatNumber(data.tourists)}
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

        {/* Demographics Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Age Demographics
            </h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {MOCK_DEMOGRAPHIC_DATA.map((data) => (
              <div key={data.ageGroup} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={cn('w-4 h-4 rounded mr-3', data.color)} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {data.ageGroup}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatNumber(data.count)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {data.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Locations */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Popular Tourist Locations
          </h3>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Map className="h-4 w-4 mr-1" />
              View Map
            </button>
            <button className="flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Eye className="h-4 w-4 mr-1" />
              Details
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Location
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Visitors
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Avg Stay
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Safety Rating
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LOCATION_DATA.map((location, index) => {
                const trendInfo = getPopularityTrendIcon(location.popularityTrend);
                const TrendIcon = trendInfo.icon;
                
                return (
                  <tr key={location.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {location.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {formatNumber(location.touristCount)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {location.averageStay}h
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {location.safetyRating}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <TrendIcon className={cn('h-4 w-4 mr-2', trendInfo.color)} />
                        <span className={cn('text-sm font-medium', trendInfo.color)}>
                          {location.popularityTrend.charAt(0).toUpperCase() + location.popularityTrend.slice(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              App Engagement
            </h4>
            <Smartphone className="h-5 w-5 text-blue-600" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Downloads</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatNumber(MOCK_METRICS.appDownloads)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Active Users</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatNumber(MOCK_METRICS.activeTourists)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Retention Rate</span>
              <span className="font-medium text-green-600">
                87.3%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Safety Metrics
            </h4>
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Incidents</span>
              <span className="font-medium text-red-600">
                {MOCK_METRICS.safetyIncidents}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Response Time</span>
              <span className="font-medium text-gray-900 dark:text-white">
                2.3 min
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Safety Score</span>
              <span className="font-medium text-green-600">
                {MOCK_METRICS.satisfactionScore}/5.0
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Trip Statistics
            </h4>
            <Navigation className="h-5 w-5 text-purple-600" />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Completed Trips</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatNumber(MOCK_METRICS.completedTrips)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Avg Duration</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {MOCK_METRICS.averageStayDuration} days
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Satisfaction</span>
              <span className="font-medium text-yellow-600">
                {MOCK_METRICS.satisfactionScore}/5.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TouristAnalytics;
