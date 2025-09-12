/**
 * Smart Tourist Safety System - Emergency Status Component
 * System-wide emergency indicators and status monitoring
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  Activity,
  Clock,
  Phone,
  MapPin,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Radio,
  Eye
} from 'lucide-react';

// ============================================================================
// INTERFACES
// ============================================================================

export interface SystemStatus {
  overall: 'operational' | 'warning' | 'critical' | 'maintenance';
  services: ServiceStatus[];
  emergencyLevel: 'green' | 'yellow' | 'orange' | 'red';
  activeIncidents: number;
  responseTeamsAvailable: number;
  totalResponseTeams: number;
  lastStatusCheck: string;
}

export interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  responseTime: number;
  uptime: number;
  lastCheck: string;
  description: string;
}

export interface EmergencyMetrics {
  activeEmergencies: number;
  totalToday: number;
  averageResponseTime: number;
  criticalAlerts: number;
  responseTeamsDeployed: number;
  zonesUnderWatch: number;
}

interface EmergencyStatusProps {
  className?: string;
  showDetailedMetrics?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockSystemStatus: SystemStatus = {
  overall: 'operational',
  services: [
    {
      name: 'Location Tracking',
      status: 'online',
      responseTime: 125,
      uptime: 99.8,
      lastCheck: new Date().toISOString(),
      description: 'GPS and location services'
    },
    {
      name: 'Alert System',
      status: 'online',
      responseTime: 89,
      uptime: 99.9,
      lastCheck: new Date().toISOString(),
      description: 'Alert creation and notification'
    },
    {
      name: 'Communication Hub',
      status: 'degraded',
      responseTime: 245,
      uptime: 97.5,
      lastCheck: new Date().toISOString(),
      description: 'Emergency communication channels'
    },
    {
      name: 'Blockchain Verification',
      status: 'online',
      responseTime: 156,
      uptime: 99.2,
      lastCheck: new Date().toISOString(),
      description: 'Digital ID verification system'
    },
    {
      name: 'Database Services',
      status: 'online',
      responseTime: 67,
      uptime: 99.7,
      lastCheck: new Date().toISOString(),
      description: 'Core data storage and retrieval'
    }
  ],
  emergencyLevel: 'yellow',
  activeIncidents: 2,
  responseTeamsAvailable: 12,
  totalResponseTeams: 15,
  lastStatusCheck: new Date().toISOString()
};

const mockEmergencyMetrics: EmergencyMetrics = {
  activeEmergencies: 2,
  totalToday: 7,
  averageResponseTime: 4.2,
  criticalAlerts: 3,
  responseTeamsDeployed: 3,
  zonesUnderWatch: 8
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getOverallStatusColor = (status: SystemStatus['overall']) => {
  switch (status) {
    case 'operational':
      return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200';
    case 'warning':
      return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200';
    case 'critical':
      return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200';
    case 'maintenance':
      return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200';
    default:
      return 'text-gray-600 bg-gray-50 dark:bg-gray-800 border-gray-200';
  }
};

const getEmergencyLevelColor = (level: SystemStatus['emergencyLevel']) => {
  switch (level) {
    case 'green':
      return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    case 'yellow':
      return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    case 'orange':
      return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
    case 'red':
      return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    default:
      return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
  }
};

const getServiceIcon = (serviceName: string) => {
  switch (serviceName.toLowerCase()) {
    case 'location tracking':
      return <MapPin className="w-4 h-4" />;
    case 'alert system':
      return <AlertTriangle className="w-4 h-4" />;
    case 'communication hub':
      return <Radio className="w-4 h-4" />;
    case 'blockchain verification':
      return <Shield className="w-4 h-4" />;
    case 'database services':
      return <Activity className="w-4 h-4" />;
    default:
      return <Zap className="w-4 h-4" />;
  }
};

const getServiceStatusIcon = (status: ServiceStatus['status']) => {
  switch (status) {
    case 'online':
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'offline':
      return <XCircle className="w-4 h-4 text-red-600" />;
    case 'degraded':
      return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    case 'maintenance':
      return <Clock className="w-4 h-4 text-blue-600" />;
    default:
      return <Activity className="w-4 h-4 text-gray-600" />;
  }
};

const formatUptime = (uptime: number): string => {
  return `${uptime.toFixed(1)}%`;
};

const formatResponseTime = (time: number): string => {
  return `${time}ms`;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const EmergencyStatus: React.FC<EmergencyStatusProps> = ({
  className = '',
  showDetailedMetrics = true,
  autoRefresh = true,
  refreshInterval = 10000
}) => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(mockSystemStatus);
  const [emergencyMetrics, setEmergencyMetrics] = useState<EmergencyMetrics>(mockEmergencyMetrics);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // ========================================================================
  // EFFECTS
  // ========================================================================

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate status updates
        setSystemStatus(prev => ({
          ...prev,
          services: prev.services.map(service => ({
            ...service,
            responseTime: service.responseTime + Math.floor(Math.random() * 20) - 10,
            uptime: Math.max(95, Math.min(100, service.uptime + (Math.random() - 0.5) * 0.1)),
            lastCheck: new Date().toISOString()
          })),
          lastStatusCheck: new Date().toISOString()
        }));

        setEmergencyMetrics(prev => ({
          ...prev,
          averageResponseTime: Math.max(2, prev.averageResponseTime + (Math.random() - 0.5) * 0.5)
        }));

        setLastUpdated(new Date());
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // ========================================================================
  // CALCULATED VALUES
  // ========================================================================

  const onlineServices = systemStatus.services.filter(s => s.status === 'online').length;
  const totalServices = systemStatus.services.length;
  const avgResponseTime = systemStatus.services.reduce((sum, s) => sum + s.responseTime, 0) / totalServices;

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Emergency Status Overview */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Emergency Status
          </h3>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>

        {/* Emergency Level Indicator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-lg border-2 ${getEmergencyLevelColor(systemStatus.emergencyLevel)}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white dark:bg-gray-800">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium">Emergency Level</p>
                <p className="text-xl font-bold uppercase">
                  {systemStatus.emergencyLevel}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 ${getOverallStatusColor(systemStatus.overall)}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white dark:bg-gray-800">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium">System Status</p>
                <p className="text-xl font-bold capitalize">
                  {systemStatus.overall}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {emergencyMetrics.activeEmergencies}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Active Emergencies
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {systemStatus.responseTeamsAvailable}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Teams Available
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {emergencyMetrics.averageResponseTime.toFixed(1)}m
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg Response
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {onlineServices}/{totalServices}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Services Online
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      {showDetailedMetrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Status */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
              Service Status
            </h4>
            <div className="space-y-3">
              {systemStatus.services.map((service, index) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gray-50 dark:bg-gray-700">
                      {getServiceIcon(service.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {service.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatUptime(service.uptime)} uptime
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatResponseTime(service.responseTime)}
                      </div>
                    </div>
                    {getServiceStatusIcon(service.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Metrics */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
              Emergency Metrics (Today)
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Incidents
                </span>
                <span className="text-sm font-medium">
                  {emergencyMetrics.totalToday}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Critical Alerts
                </span>
                <span className="text-sm font-medium text-red-600">
                  {emergencyMetrics.criticalAlerts}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Teams Deployed
                </span>
                <span className="text-sm font-medium">
                  {emergencyMetrics.responseTeamsDeployed}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Zones Under Watch
                </span>
                <span className="text-sm font-medium text-yellow-600">
                  {emergencyMetrics.zonesUnderWatch}
                </span>
              </div>
              
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Response Capacity
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ 
                          width: `${(systemStatus.responseTeamsAvailable / systemStatus.totalResponseTeams) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round((systemStatus.responseTeamsAvailable / systemStatus.totalResponseTeams) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
          Emergency Actions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <Phone className="w-4 h-4" />
            Emergency Broadcast
          </button>
          
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <Users className="w-4 h-4" />
            Deploy Response Team
          </button>
          
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Eye className="w-4 h-4" />
            View Emergency Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyStatus;