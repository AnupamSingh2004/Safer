/**
 * Smart Tourist Safety System - Tourism Department Dashboard
 * Specialized dashboard for tourism operations with real-time visualizations,
 * tourist clusters, heat maps, and visitor flow management
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  MapPin,
  TrendingUp,
  BarChart3,
  Globe,
  Star,
  Camera,
  Mountain,
  TreePine,
  Compass,
  Activity,
  Clock,
  Eye,
  Download,
  Filter,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Heart,
  Smartphone,
  Calendar
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoleGuard } from '@/components/auth/role-guard';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface TouristCluster {
  id: string;
  name: string;
  center: [number, number];
  touristCount: number;
  radius: number;
  density: 'low' | 'medium' | 'high' | 'very_high';
  popularityScore: number;
  averageStayDuration: number;
  safetyRating: number;
  amenities: string[];
  lastUpdated: string;
  trends: {
    hourlyChange: number;
    dailyChange: number;
    weeklyChange: number;
  };
}

interface HeatMapZone {
  id: string;
  name: string;
  coordinates: [number, number];
  riskLevel: 'safe' | 'moderate' | 'high' | 'critical';
  touristDensity: number;
  incidentFrequency: number;
  responseTime: number;
  safetyScore: number;
  facilities: {
    medical: boolean;
    police: boolean;
    emergency: boolean;
    food: boolean;
    transport: boolean;
  };
  weatherConditions: {
    current: string;
    forecast: string;
    visibility: string;
    alerts: string[];
  };
}

interface VisitorFlow {
  sourceLocation: string;
  destinationLocation: string;
  touristCount: number;
  averageTime: number;
  popularHours: number[];
  transportModes: {
    walking: number;
    vehicle: number;
    public: number;
  };
  demographics: {
    domestic: number;
    international: number;
    groups: number;
    solo: number;
  };
}

interface TourismStatistics {
  totalVisitors: number;
  activeVisitors: number;
  newRegistrations: number;
  completedVisits: number;
  averageSatisfaction: number;
  topDestinations: Array<{
    name: string;
    visitors: number;
    rating: number;
    category: string;
  }>;
  nationalityBreakdown: Array<{
    country: string;
    count: number;
    percentage: number;
  }>;
  revenueImpact: {
    estimated: number;
    direct: number;
    indirect: number;
  };
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockTouristClusters: TouristCluster[] = [
  {
    id: 'cluster-1',
    name: 'Red Fort Complex',
    center: [77.2411, 28.6562],
    touristCount: 456,
    radius: 500,
    density: 'very_high',
    popularityScore: 95,
    averageStayDuration: 120,
    safetyRating: 4.8,
    amenities: ['Guide Services', 'Cafeteria', 'Restrooms', 'Security', 'Wi-Fi'],
    lastUpdated: '2024-01-20T16:30:00Z',
    trends: {
      hourlyChange: 12,
      dailyChange: 8,
      weeklyChange: 15
    }
  },
  {
    id: 'cluster-2',
    name: 'India Gate Area',
    center: [77.2295, 28.6129],
    touristCount: 234,
    radius: 800,
    density: 'high',
    popularityScore: 88,
    averageStayDuration: 90,
    safetyRating: 4.6,
    amenities: ['Food Stalls', 'Photography', 'Parking', 'Police Booth'],
    lastUpdated: '2024-01-20T16:30:00Z',
    trends: {
      hourlyChange: -5,
      dailyChange: 3,
      weeklyChange: 10
    }
  },
  {
    id: 'cluster-3',
    name: 'Lotus Temple Vicinity',
    center: [77.2500, 28.5525],
    touristCount: 189,
    radius: 600,
    density: 'medium',
    popularityScore: 82,
    averageStayDuration: 75,
    safetyRating: 4.9,
    amenities: ['Meditation Hall', 'Gardens', 'Information Center'],
    lastUpdated: '2024-01-20T16:30:00Z',
    trends: {
      hourlyChange: 18,
      dailyChange: 12,
      weeklyChange: 20
    }
  }
];

const mockHeatMapZones: HeatMapZone[] = [
  {
    id: 'zone-1',
    name: 'Central Delhi Heritage Circuit',
    coordinates: [77.2411, 28.6562],
    riskLevel: 'safe',
    touristDensity: 89,
    incidentFrequency: 2,
    responseTime: 4.5,
    safetyScore: 92,
    facilities: {
      medical: true,
      police: true,
      emergency: true,
      food: true,
      transport: true
    },
    weatherConditions: {
      current: 'Clear',
      forecast: 'Partly Cloudy',
      visibility: 'Good',
      alerts: []
    }
  },
  {
    id: 'zone-2',
    name: 'South Delhi Cultural Zone',
    coordinates: [77.2500, 28.5525],
    riskLevel: 'moderate',
    touristDensity: 67,
    incidentFrequency: 1,
    responseTime: 6.2,
    safetyScore: 85,
    facilities: {
      medical: true,
      police: true,
      emergency: true,
      food: false,
      transport: true
    },
    weatherConditions: {
      current: 'Partly Cloudy',
      forecast: 'Clear',
      visibility: 'Good',
      alerts: ['Heat Advisory']
    }
  }
];

const mockVisitorFlows: VisitorFlow[] = [
  {
    sourceLocation: 'Red Fort',
    destinationLocation: 'Jama Masjid',
    touristCount: 156,
    averageTime: 25,
    popularHours: [10, 11, 15, 16],
    transportModes: {
      walking: 78,
      vehicle: 12,
      public: 10
    },
    demographics: {
      domestic: 89,
      international: 67,
      groups: 112,
      solo: 44
    }
  },
  {
    sourceLocation: 'India Gate',
    destinationLocation: 'Rashtrapati Bhavan',
    touristCount: 234,
    averageTime: 35,
    popularHours: [9, 10, 14, 17],
    transportModes: {
      walking: 45,
      vehicle: 134,
      public: 55
    },
    demographics: {
      domestic: 167,
      international: 67,
      groups: 189,
      solo: 45
    }
  }
];

const mockTourismStats: TourismStatistics = {
  totalVisitors: 18647,
  activeVisitors: 4321,
  newRegistrations: 234,
  completedVisits: 1567,
  averageSatisfaction: 4.7,
  topDestinations: [
    { name: 'Red Fort', visitors: 4561, rating: 4.8, category: 'Heritage' },
    { name: 'India Gate', visitors: 3892, rating: 4.6, category: 'Monument' },
    { name: 'Lotus Temple', visitors: 3245, rating: 4.9, category: 'Religious' },
    { name: 'Qutub Minar', visitors: 2891, rating: 4.7, category: 'Heritage' },
    { name: 'Humayun\'s Tomb', visitors: 2234, rating: 4.5, category: 'Heritage' }
  ],
  nationalityBreakdown: [
    { country: 'India', count: 12456, percentage: 66.8 },
    { country: 'United States', count: 1567, percentage: 8.4 },
    { country: 'United Kingdom', count: 1234, percentage: 6.6 },
    { country: 'Germany', count: 891, percentage: 4.8 },
    { country: 'France', count: 756, percentage: 4.1 },
    { country: 'Others', count: 1743, percentage: 9.3 }
  ],
  revenueImpact: {
    estimated: 156789000,
    direct: 89456000,
    indirect: 67333000
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TourismDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'clusters' | 'heatmap' | 'flows' | 'analytics'>('overview');
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  return (
    <RoleGuard requiredRoles={['super_admin', 'tourism_admin', 'operator']}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Globe className="h-8 w-8 mr-3" />
                Tourism Department Dashboard
              </h1>
              <p className="text-green-100 dark:text-green-200">
                Real-time visitor management, destination analytics, and tourism insights
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-200 dark:text-green-300">Live Monitoring</div>
              <div className="flex items-center text-2xl font-bold">
                <Activity className="h-6 w-6 mr-2" />
                {isRealTimeEnabled ? 'Active' : 'Paused'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard
            title="Total Visitors"
            value={mockTourismStats.totalVisitors.toLocaleString()}
            icon={<Users className="h-6 w-6" />}
            subtitle="This month"
            color="blue"
            trend="+12.5%"
          />
          <StatCard
            title="Active Now"
            value={mockTourismStats.activeVisitors.toLocaleString()}
            icon={<Activity className="h-6 w-6" />}
            subtitle="Currently exploring"
            color="green"
            trend="+8.2%"
          />
          <StatCard
            title="Satisfaction"
            value={mockTourismStats.averageSatisfaction.toString()}
            icon={<Star className="h-6 w-6" />}
            subtitle="Average rating"
            color="yellow"
            trend="-0.3"
          />
          <StatCard
            title="Revenue Impact"
            value={`₹${(mockTourismStats.revenueImpact.estimated / 10000000).toFixed(1)}Cr`}
            icon={<TrendingUp className="h-6 w-6" />}
            subtitle="Estimated monthly"
            color="purple"
            trend="+15.7%"
          />
          <StatCard
            title="Safety Score"
            value="94.2%"
            icon={<CheckCircle className="h-6 w-6" />}
            subtitle="Overall safety"
            color="emerald"
            trend="+2.1%"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'clusters', label: 'Tourist Clusters', icon: Users },
              { id: 'heatmap', label: 'Heat Maps', icon: MapPin },
              { id: 'flows', label: 'Visitor Flows', icon: Navigation },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-green-500 bg-background"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
              className={isRealTimeEnabled ? 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800' : ''}
            >
              <Activity className="h-4 w-4 mr-2" />
              {isRealTimeEnabled ? 'Live' : 'Paused'}
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'clusters' && <TouristClustersTab />}
          {activeTab === 'heatmap' && <HeatMapTab />}
          {activeTab === 'flows' && <VisitorFlowsTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
        </div>
      </div>
    </RoleGuard>
  );
}

// ============================================================================
// TAB COMPONENTS
// ============================================================================

const OverviewTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Top Destinations */}
      <Card className="p-6 bg-card dark:bg-card border-border dark:border-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          <Mountain className="h-5 w-5 mr-2 text-green-500 dark:text-green-400" />
          Top Destinations
        </h3>
        <div className="space-y-3">
          {mockTourismStats.topDestinations.map((dest, index) => (
            <div key={dest.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-sm font-bold text-green-600 dark:text-green-400">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-foreground">{dest.name}</div>
                  <div className="text-xs text-muted-foreground">{dest.category}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-foreground">{dest.visitors.toLocaleString()}</div>
                <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-400">
                  <Star className="h-3 w-3 mr-1" />
                  {dest.rating}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Nationality Breakdown */}
      <Card className="p-6 bg-card dark:bg-card border-border dark:border-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          <Globe className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
          Visitor Origins
        </h3>
        <div className="space-y-3">
          {mockTourismStats.nationalityBreakdown.map((country) => (
            <div key={country.country} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-4 bg-gray-200 dark:bg-gray-700 rounded-sm flex items-center justify-center text-xs">
                  🏳️
                </div>
                <span className="text-sm font-medium text-foreground">{country.country}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">{country.count.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">{country.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Live Activity Feed */}
      <Card className="p-6 bg-card dark:bg-card border-border dark:border-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          <Activity className="h-5 w-5 mr-2 text-purple-500 dark:text-purple-400" />
          Live Activity
        </h3>
        <div className="space-y-3">
          {[
            { action: 'New group registered', location: 'Red Fort', time: '2 min ago', type: 'registration' },
            { action: 'Safety alert resolved', location: 'India Gate', time: '5 min ago', type: 'safety' },
            { action: 'High visitor density', location: 'Lotus Temple', time: '8 min ago', type: 'alert' },
            { action: 'Guided tour started', location: 'Qutub Minar', time: '12 min ago', type: 'activity' },
            { action: 'Weather advisory issued', location: 'Humayun\'s Tomb', time: '15 min ago', type: 'weather' }
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.type === 'registration' ? 'bg-green-400' :
                activity.type === 'safety' ? 'bg-blue-400' :
                activity.type === 'alert' ? 'bg-yellow-400' :
                activity.type === 'activity' ? 'bg-purple-400' :
                'bg-orange-400'
              }`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{activity.action}</div>
                <div className="text-xs text-muted-foreground">{activity.location}</div>
                <div className="text-xs text-muted-foreground">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const TouristClustersTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Real-time Tourist Clusters</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <MapPin className="h-4 w-4 mr-2" />
            View on Map
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockTouristClusters.map((cluster) => (
          <Card key={cluster.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  cluster.density === 'very_high' ? 'bg-red-100' :
                  cluster.density === 'high' ? 'bg-orange-100' :
                  cluster.density === 'medium' ? 'bg-yellow-100' :
                  'bg-green-100'
                }`}>
                  <Users className={`h-6 w-6 ${
                    cluster.density === 'very_high' ? 'text-red-600' :
                    cluster.density === 'high' ? 'text-orange-600' :
                    cluster.density === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{cluster.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {cluster.center[1].toFixed(4)}, {cluster.center[0].toFixed(4)}
                  </p>
                </div>
              </div>
              <Badge variant={
                cluster.density === 'very_high' ? 'destructive' :
                cluster.density === 'high' ? 'secondary' :
                'secondary'
              }>
                {cluster.density.replace('_', ' ')}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Tourists:</span>
                  <div className="font-medium">{cluster.touristCount}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg Stay:</span>
                  <div className="font-medium">{cluster.averageStayDuration}min</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Safety:</span>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 mr-1" />
                    <span className="font-medium">{cluster.safetyRating}</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Popularity:</span>
                  <div className="font-medium">{cluster.popularityScore}%</div>
                </div>
              </div>

              {/* Trends */}
              <div className="pt-3 border-t border-gray-200">
                <div className="text-sm text-muted-foreground mb-2">Trends</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className={`font-medium ${cluster.trends.hourlyChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {cluster.trends.hourlyChange > 0 ? '+' : ''}{cluster.trends.hourlyChange}%
                    </div>
                    <div className="text-gray-500">1h</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${cluster.trends.dailyChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {cluster.trends.dailyChange > 0 ? '+' : ''}{cluster.trends.dailyChange}%
                    </div>
                    <div className="text-gray-500">24h</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${cluster.trends.weeklyChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {cluster.trends.weeklyChange > 0 ? '+' : ''}{cluster.trends.weeklyChange}%
                    </div>
                    <div className="text-gray-500">7d</div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="pt-3 border-t border-gray-200">
                <div className="text-sm text-muted-foreground mb-2">Amenities</div>
                <div className="flex flex-wrap gap-1">
                  {cluster.amenities.map((amenity) => (
                    <span key={amenity} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                Details
              </Button>
              <Button size="sm" variant="outline">
                <MapPin className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Activity className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const HeatMapTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Safety & Risk Heat Maps</h3>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
            <option value="safety">Safety Zones</option>
            <option value="density">Tourist Density</option>
            <option value="incidents">Incident Frequency</option>
            <option value="response">Response Times</option>
          </select>
          <Button variant="outline" size="sm">
            <Navigation className="h-4 w-4 mr-2" />
            Full Map
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockHeatMapZones.map((zone) => (
          <Card key={zone.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  zone.riskLevel === 'safe' ? 'bg-green-100' :
                  zone.riskLevel === 'moderate' ? 'bg-yellow-100' :
                  zone.riskLevel === 'high' ? 'bg-orange-100' :
                  'bg-red-100'
                }`}>
                  <MapPin className={`h-6 w-6 ${
                    zone.riskLevel === 'safe' ? 'text-green-600' :
                    zone.riskLevel === 'moderate' ? 'text-yellow-600' :
                    zone.riskLevel === 'high' ? 'text-orange-600' :
                    'text-red-600'
                  }`} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{zone.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Safety Score: {zone.safetyScore}%
                  </p>
                </div>
              </div>
              <Badge variant={
                zone.riskLevel === 'safe' ? 'default' :
                zone.riskLevel === 'moderate' ? 'secondary' :
                'destructive'
              }>
                {zone.riskLevel}
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Tourist Density:</span>
                  <div className="font-medium">{zone.touristDensity}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Response Time:</span>
                  <div className="font-medium">{zone.responseTime}min</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Incidents:</span>
                  <div className="font-medium">{zone.incidentFrequency}/month</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Capacity:</span>
                  <div className={`font-medium ${zone.touristDensity > 80 ? 'text-red-600' : 'text-green-600'}`}>
                    {zone.touristDensity > 80 ? 'High' : 'Normal'}
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div>
                <div className="text-sm text-muted-foreground mb-2">Available Facilities</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    {zone.facilities.medical ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    )}
                    <span>Medical</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {zone.facilities.police ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    )}
                    <span>Police</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {zone.facilities.emergency ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    )}
                    <span>Emergency</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {zone.facilities.food ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    )}
                    <span>Food</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {zone.facilities.transport ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    )}
                    <span>Transport</span>
                  </div>
                </div>
              </div>

              {/* Weather Conditions */}
              <div>
                <div className="text-sm text-muted-foreground mb-2">Weather Conditions</div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Current:</span>
                      <div className="font-medium">{zone.weatherConditions.current}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Forecast:</span>
                      <div className="font-medium">{zone.weatherConditions.forecast}</div>
                    </div>
                  </div>
                  {zone.weatherConditions.alerts.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="text-xs text-orange-600 font-medium">Weather Alerts:</div>
                      {zone.weatherConditions.alerts.map((alert, index) => (
                        <div key={index} className="text-xs text-orange-700">{alert}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button size="sm" variant="outline">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const VisitorFlowsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Visitor Flow Patterns</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Navigation className="h-4 w-4 mr-2" />
            Flow Map
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {mockVisitorFlows.map((flow, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Navigation className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {flow.sourceLocation} → {flow.destinationLocation}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {flow.touristCount} visitors • {flow.averageTime} min average
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{flow.touristCount}</div>
                <div className="text-xs text-gray-500">daily visitors</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Transport Modes */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Transport Modes</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Walking:</span>
                    <span className="font-medium">{flow.transportModes.walking}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-medium">{flow.transportModes.vehicle}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Public Transport:</span>
                    <span className="font-medium">{flow.transportModes.public}</span>
                  </div>
                </div>
              </div>

              {/* Demographics */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Demographics</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Domestic:</span>
                    <span className="font-medium">{flow.demographics.domestic}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">International:</span>
                    <span className="font-medium">{flow.demographics.international}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Groups:</span>
                    <span className="font-medium">{flow.demographics.groups}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Solo:</span>
                    <span className="font-medium">{flow.demographics.solo}</span>
                  </div>
                </div>
              </div>

              {/* Popular Hours */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Popular Hours</div>
                <div className="flex space-x-1">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-8 rounded-sm ${
                        flow.popularHours.includes(i) ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                      title={`${i}:00`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>12</span>
                  <span>24</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tourism Analytics & Insights</h3>
        <div className="flex space-x-2">
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Impact Analysis */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Economic Impact</h4>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <div className="text-sm text-green-600 font-medium">Total Economic Impact</div>
              <div className="text-2xl font-bold text-green-700">
                ₹{(mockTourismStats.revenueImpact.estimated / 10000000).toFixed(1)} Crores
              </div>
              <div className="text-sm text-green-600">Monthly estimate</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-blue-600">Direct Revenue</div>
                <div className="text-lg font-bold text-blue-700">
                  ₹{(mockTourismStats.revenueImpact.direct / 10000000).toFixed(1)}Cr
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-xs text-purple-600">Indirect Revenue</div>
                <div className="text-lg font-bold text-purple-700">
                  ₹{(mockTourismStats.revenueImpact.indirect / 10000000).toFixed(1)}Cr
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Visitor Satisfaction Trends */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Visitor Satisfaction</h4>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Star className="h-6 w-6 text-yellow-500" />
                <div className="text-3xl font-bold text-yellow-700">
                  {mockTourismStats.averageSatisfaction}
                </div>
              </div>
              <div className="text-sm text-yellow-600">Average Rating</div>
            </div>
            <div className="space-y-2">
              {[
                { rating: 5, count: 1234, percentage: 68 },
                { rating: 4, count: 456, percentage: 25 },
                { rating: 3, count: 89, percentage: 5 },
                { rating: 2, count: 23, percentage: 1 },
                { rating: 1, count: 12, percentage: 1 }
              ].map((item) => (
                <div key={item.rating} className="flex items-center space-x-3">
                  <div className="w-8 text-xs text-gray-600">{item.rating}★</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-xs text-gray-600">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Peak Hours Analysis */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Peak Hours Analysis</h4>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-24 gap-1">
                {Array.from({ length: 24 }, (_, i) => {
                  const height = Math.random() * 40 + 10; // Mock data
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div 
                        className="w-2 bg-blue-500 rounded-t-sm"
                        style={{ height: `${height}px` }}
                      />
                      {i % 6 === 0 && (
                        <div className="text-xs text-gray-500 mt-1">{i}</div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="text-center text-xs text-gray-500 mt-2">Hours (0-24)</div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-blue-600">10:00 AM</div>
                <div className="text-gray-600">Morning Peak</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-600">3:00 PM</div>
                <div className="text-gray-600">Afternoon Peak</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-600">6:00 PM</div>
                <div className="text-gray-600">Evening Peak</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Seasonal Trends */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Seasonal Trends</h4>
          <div className="space-y-4">
            {[
              { season: 'Winter', months: 'Dec-Feb', visitors: 45678, trend: '+15%', color: 'blue' },
              { season: 'Spring', months: 'Mar-May', visitors: 38234, trend: '+8%', color: 'green' },
              { season: 'Summer', months: 'Jun-Aug', visitors: 29156, trend: '-12%', color: 'red' },
              { season: 'Monsoon', months: 'Sep-Nov', visitors: 34567, trend: '+5%', color: 'gray' }
            ].map((season) => (
              <div key={season.season} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{season.season}</div>
                  <div className="text-sm text-gray-600">{season.months}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{season.visitors.toLocaleString()}</div>
                  <div className={`text-sm ${season.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {season.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'emerald';
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, subtitle, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400',
    red: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400',
    purple: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
  };

  return (
    <Card className={`p-4 border-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-70">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs opacity-70">{subtitle}</p>
          {trend && (
            <p className={`text-xs font-medium mt-1 ${
              trend.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {trend}
            </p>
          )}
        </div>
        <div className="opacity-60">
          {icon}
        </div>
      </div>
    </Card>
  );
};