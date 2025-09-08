/**
 * Smart Tourist Safety System - Safety Incident Analytics
 * Component for analyzing safety incidents and patterns
 */

'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Shield,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Eye,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Target,
  Zap,
  UserCheck,
  Navigation,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface IncidentMetrics {
  totalIncidents: number;
  resolvedIncidents: number;
  pendingIncidents: number;
  averageResponseTime: number;
  criticalIncidents: number;
  preventedIncidents: number;
  safetyScore: number;
  resolutionRate: number;
}

interface IncidentData {
  id: string;
  type: 'medical' | 'theft' | 'harassment' | 'lost' | 'accident' | 'weather' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'responding' | 'resolved' | 'closed';
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  reportedAt: string;
  resolvedAt?: string;
  responseTime?: number;
  touristId: string;
  touristName: string;
  description: string;
}

interface IncidentTrend {
  period: string;
  total: number;
  resolved: number;
  pending: number;
  avgResponseTime: number;
}

interface LocationHotspot {
  location: string;
  incidentCount: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  commonTypes: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface SafetyIncidentAnalyticsProps {
  className?: string;
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const MOCK_METRICS: IncidentMetrics = {
  totalIncidents: 157,
  resolvedIncidents: 142,
  pendingIncidents: 15,
  averageResponseTime: 8.5,
  criticalIncidents: 3,
  preventedIncidents: 23,
  safetyScore: 94.2,
  resolutionRate: 90.4,
};

const INCIDENT_TYPES = [
  { value: 'medical', label: 'Medical Emergency', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' },
  { value: 'theft', label: 'Theft/Robbery', icon: Shield, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20' },
  { value: 'harassment', label: 'Harassment', icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/20' },
  { value: 'lost', label: 'Lost Tourist', icon: Navigation, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
  { value: 'accident', label: 'Accident', icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
  { value: 'weather', label: 'Weather Related', icon: Activity, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' },
  { value: 'other', label: 'Other', icon: Info, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/20' },
];

const SEVERITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
  { value: 'high', label: 'High', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20' },
  { value: 'critical', label: 'Critical', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' },
];

const MOCK_TRENDS: IncidentTrend[] = [
  { period: 'Jan', total: 23, resolved: 21, pending: 2, avgResponseTime: 9.2 },
  { period: 'Feb', total: 18, resolved: 17, pending: 1, avgResponseTime: 8.8 },
  { period: 'Mar', total: 25, resolved: 23, pending: 2, avgResponseTime: 8.1 },
  { period: 'Apr', total: 31, resolved: 28, pending: 3, avgResponseTime: 7.9 },
  { period: 'May', total: 28, resolved: 26, pending: 2, avgResponseTime: 8.3 },
  { period: 'Jun', total: 32, resolved: 27, pending: 5, avgResponseTime: 8.5 },
];

const MOCK_INCIDENTS: IncidentData[] = [
  {
    id: 'inc-001',
    type: 'medical',
    severity: 'high',
    status: 'resolved',
    location: 'Red Fort',
    coordinates: { lat: 28.6562, lng: 77.2410 },
    reportedAt: '2024-01-16T14:30:00Z',
    resolvedAt: '2024-01-16T14:45:00Z',
    responseTime: 15,
    touristId: 'tourist-001',
    touristName: 'Sarah Chen',
    description: 'Tourist feeling dizzy and nauseous during fort visit',
  },
  {
    id: 'inc-002',
    type: 'theft',
    severity: 'medium',
    status: 'investigating',
    location: 'India Gate',
    coordinates: { lat: 28.6129, lng: 77.2295 },
    reportedAt: '2024-01-16T16:20:00Z',
    touristId: 'tourist-002',
    touristName: 'John Miller',
    description: 'Wallet stolen from backpack while taking photos',
  },
  {
    id: 'inc-003',
    type: 'lost',
    severity: 'medium',
    status: 'resolved',
    location: 'Lotus Temple',
    coordinates: { lat: 28.5535, lng: 77.2588 },
    reportedAt: '2024-01-16T11:15:00Z',
    resolvedAt: '2024-01-16T11:35:00Z',
    responseTime: 20,
    touristId: 'tourist-003',
    touristName: 'Emma Rodriguez',
    description: 'Tourist separated from group and unable to find way back',
  },
  {
    id: 'inc-004',
    type: 'harassment',
    severity: 'high',
    status: 'responding',
    location: 'Qutub Minar',
    coordinates: { lat: 28.5244, lng: 77.1855 },
    reportedAt: '2024-01-16T13:45:00Z',
    touristId: 'tourist-004',
    touristName: 'Lisa Wang',
    description: 'Inappropriate behavior from local vendors',
  },
  {
    id: 'inc-005',
    type: 'accident',
    severity: 'low',
    status: 'resolved',
    location: "Humayun's Tomb",
    coordinates: { lat: 28.5933, lng: 77.2507 },
    reportedAt: '2024-01-16T10:30:00Z',
    resolvedAt: '2024-01-16T10:45:00Z',
    responseTime: 15,
    touristId: 'tourist-005',
    touristName: 'David Kim',
    description: 'Minor slip and fall on wet steps',
  },
];

const MOCK_HOTSPOTS: LocationHotspot[] = [
  {
    location: 'Red Fort Area',
    incidentCount: 24,
    severity: 'medium',
    commonTypes: ['medical', 'theft'],
    coordinates: { lat: 28.6562, lng: 77.2410 },
  },
  {
    location: 'India Gate',
    incidentCount: 31,
    severity: 'medium',
    commonTypes: ['theft', 'harassment'],
    coordinates: { lat: 28.6129, lng: 77.2295 },
  },
  {
    location: 'Chandni Chowk',
    incidentCount: 18,
    severity: 'high',
    commonTypes: ['theft', 'lost', 'harassment'],
    coordinates: { lat: 28.6506, lng: 77.2334 },
  },
  {
    location: 'Connaught Place',
    incidentCount: 15,
    severity: 'low',
    commonTypes: ['theft', 'harassment'],
    coordinates: { lat: 28.6315, lng: 77.2167 },
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function SafetyIncidentAnalytics({ className }: SafetyIncidentAnalyticsProps) {
  const { user, hasPermission } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-IN');
  };

  // Get incident type info
  const getIncidentTypeInfo = (type: string) => {
    return INCIDENT_TYPES.find(t => t.value === type) || INCIDENT_TYPES[0];
  };

  // Get severity info
  const getSeverityInfo = (severity: string) => {
    return SEVERITY_LEVELS.find(s => s.value === severity) || SEVERITY_LEVELS[0];
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'responding': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'investigating': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'reported': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Filter incidents
  const filteredIncidents = MOCK_INCIDENTS.filter(incident => {
    const matchesType = selectedType === 'all' || incident.type === selectedType;
    const matchesSeverity = selectedSeverity === 'all' || incident.severity === selectedSeverity;
    return matchesType && matchesSeverity;
  });

  // Calculate trend direction
  const calculateTrend = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      direction: change >= 0 ? 'up' : 'down',
      percentage: Math.abs(change).toFixed(1),
    };
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Safety Incident Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor and analyze safety incidents to improve tourist security
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 3 Months</option>
              <option value="1y">Last Year</option>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex items-center text-sm font-medium text-red-600">
              <TrendingDown className="h-4 w-4 mr-1" />
              -12.3%
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(MOCK_METRICS.totalIncidents)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Incidents
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex items-center text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +5.7%
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {MOCK_METRICS.resolutionRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Resolution Rate
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex items-center text-sm font-medium text-green-600">
              <TrendingDown className="h-4 w-4 mr-1" />
              -8.2%
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {MOCK_METRICS.averageResponseTime}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg Response (min)
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex items-center text-sm font-medium text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +2.1%
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {MOCK_METRICS.safetyScore}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Safety Score
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Trends */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Incident Trends
            </h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {MOCK_TRENDS.map((trend, index) => {
              const maxIncidents = Math.max(...MOCK_TRENDS.map(t => t.total));
              const percentage = (trend.total / maxIncidents) * 100;
              const resolvedPercentage = (trend.resolved / trend.total) * 100;
              
              return (
                <div key={trend.period} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{trend.period}</span>
                    <div className="space-x-4">
                      <span className="text-red-600">Total: {trend.total}</span>
                      <span className="text-green-600">Resolved: {trend.resolved}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className="h-3 rounded-full bg-gradient-to-r from-red-500 to-green-500 relative">
                      <div 
                        className="absolute left-0 top-0 h-3 bg-red-500 rounded-l-full"
                        style={{ width: `${percentage}%` }}
                      />
                      <div 
                        className="absolute right-0 top-0 h-3 bg-green-500 rounded-r-full"
                        style={{ width: `${resolvedPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Incident Types */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Incident Types
            </h3>
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {INCIDENT_TYPES.map((type) => {
              const count = MOCK_INCIDENTS.filter(inc => inc.type === type.value).length;
              const percentage = (count / MOCK_INCIDENTS.length) * 100;
              const Icon = type.icon;
              
              return (
                <div key={type.value} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={cn('p-2 rounded mr-3', type.bg)}>
                      <Icon className={cn('h-4 w-4', type.color)} />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {type.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {count}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Safety Hotspots */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Safety Hotspots
          </h3>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <MapPin className="h-4 w-4 mr-1" />
              View Map
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_HOTSPOTS.map((hotspot) => {
            const severityInfo = getSeverityInfo(hotspot.severity);
            
            return (
              <div key={hotspot.location} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {hotspot.location}
                  </h4>
                  <span className={cn('px-2 py-1 rounded-full text-xs font-medium', severityInfo.bg, severityInfo.color)}>
                    {severityInfo.label}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Incidents</span>
                    <span className="font-medium text-red-600">{hotspot.incidentCount}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Common Types:</span>
                    <div className="flex flex-wrap gap-1">
                      {hotspot.commonTypes.map((type) => {
                        const typeInfo = getIncidentTypeInfo(type);
                        return (
                          <span
                            key={type}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                          >
                            {typeInfo.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Incidents
          </h3>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Types</option>
              {INCIDENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Severities</option>
              {SEVERITY_LEVELS.map(severity => (
                <option key={severity.value} value={severity.value}>
                  {severity.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Incident
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Location
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Tourist
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Response Time
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map((incident) => {
                const typeInfo = getIncidentTypeInfo(incident.type);
                const severityInfo = getSeverityInfo(incident.severity);
                const TypeIcon = typeInfo.icon;
                
                return (
                  <tr key={incident.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className={cn('p-2 rounded mr-3', typeInfo.bg)}>
                          <TypeIcon className={cn('h-4 w-4', typeInfo.color)} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {typeInfo.label}
                          </div>
                          <div className={cn('text-xs px-2 py-1 rounded-full inline-block', severityInfo.bg, severityInfo.color)}>
                            {severityInfo.label}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {incident.location}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {incident.touristName}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        ID: {incident.touristId}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(incident.status))}>
                        {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {incident.responseTime ? (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {incident.responseTime} min
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SafetyIncidentAnalytics;
