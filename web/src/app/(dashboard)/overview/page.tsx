/**
 * Smart Tourist Safety System - Dashboard Overview Page
 * Main dashboard overview screen with real-time statistics and quick actions
 */

'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  Shield, 
  MapPin, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  Eye,
  RefreshCw,
  UserCheck,
  CheckCircle,
  Bell
} from 'lucide-react';
import StatsCards from '@/components/dashboard/overview/stats-cards';
import { useZoneStore } from '@/stores/zone-store';

// ============================================================================
// MOCK DATA INTERFACES
// ============================================================================

interface DashboardStats {
  totalTourists: number;
  activeTourists: number;
  totalAlerts: number;
  activeAlerts: number;
  criticalAlerts: number;
  safetyScoreAverage: number;
  riskZones: number;
  emergencyIncidents: number;
}

interface RecentActivity {
  id: string;
  type: 'tourist_entry' | 'alert_created' | 'zone_breach' | 'emergency_response';
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockDashboardStats: DashboardStats = {
  totalTourists: 1247,
  activeTourists: 892,
  totalAlerts: 23,
  activeAlerts: 8,
  criticalAlerts: 2,
  safetyScoreAverage: 78.5,
  riskZones: 12,
  emergencyIncidents: 1
};

const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'alert_created',
    description: 'Tourist entered high-risk mountain trail without guide',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    severity: 'high',
    location: 'Mountain Trail Zone'
  },
  {
    id: '2',
    type: 'tourist_entry',
    description: 'New tourist registered at City Center checkpoint',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    severity: 'low',
    location: 'City Center'
  },
  {
    id: '3',
    type: 'emergency_response',
    description: 'Emergency response team dispatched to Zone 7',
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    severity: 'critical',
    location: 'Forest Trail Zone'
  },
  {
    id: '4',
    type: 'zone_breach',
    description: 'Tourist exceeded maximum dwell time in restricted area',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    severity: 'medium',
    location: 'Border Checkpoint'
  },
  {
    id: '5',
    type: 'tourist_entry',
    description: 'Group of 15 tourists registered at hotel',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    severity: 'low',
    location: 'Hotel District'
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getActivityIcon = (type: RecentActivity['type']) => {
  switch (type) {
    case 'tourist_entry':
      return <Users className="w-4 h-4" />;
    case 'alert_created':
      return <AlertTriangle className="w-4 h-4" />;
    case 'zone_breach':
      return <MapPin className="w-4 h-4" />;
    case 'emergency_response':
      return <Shield className="w-4 h-4" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
};

const getSeverityColor = (severity: RecentActivity['severity']) => {
  switch (severity) {
    case 'low':
      return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    case 'high':
      return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
    case 'critical':
      return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    default:
      return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
  }
};

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<DashboardStats>(mockDashboardStats);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>(mockRecentActivity);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const { totalZones, activeZones, highRiskZones } = useZoneStore();

  // ========================================================================
  // EFFECTS
  // ========================================================================

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeTourists: prev.activeTourists + Math.floor(Math.random() * 5) - 2,
        activeAlerts: Math.max(0, prev.activeAlerts + Math.floor(Math.random() * 3) - 1),
        safetyScoreAverage: Math.max(0, Math.min(100, prev.safetyScoreAverage + (Math.random() - 0.5) * 2))
      }));
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate data refresh
    setStats({
      ...mockDashboardStats,
      activeTourists: mockDashboardStats.activeTourists + Math.floor(Math.random() * 50) - 25,
      activeAlerts: Math.max(0, mockDashboardStats.activeAlerts + Math.floor(Math.random() * 5) - 2),
    });
    
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time tourist safety monitoring and incident response system
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {formatTimeAgo(lastUpdated.toISOString())}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <button className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                <Eye className="w-4 h-4" />
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className={`p-2 rounded-full ${getSeverityColor(activity.severity)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {activity.location && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          📍 {activity.location}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(activity.severity)}`}>
                    {activity.severity.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & System Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-start gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                <Users className="w-4 h-4" />
                Register New Tourist
              </button>
              <button className="w-full flex items-center justify-start gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                <AlertTriangle className="w-4 h-4" />
                Create Manual Alert
              </button>
              <button className="w-full flex items-center justify-start gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                <MapPin className="w-4 h-4" />
                Add New Zone
              </button>
              <button className="w-full flex items-center justify-start gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                <Shield className="w-4 h-4" />
                Emergency Response
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Zones
                </span>
                <span className="text-sm font-medium">
                  {totalZones}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Active Zones
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">
                    {activeZones}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  High Risk Zones
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium">
                    {highRiskZones}
                  </span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    System Health
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-green-600">
                      Operational
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Trend */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Safety Trend (24h)
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Current Score
                </span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">
                    {stats.safetyScoreAverage.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Alerts Today
                </span>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">
                    {stats.totalAlerts}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Avg. Response Time
                </span>
                <span className="text-sm font-medium">
                  4.2 min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
