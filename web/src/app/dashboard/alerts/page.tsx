/**
 * Smart Tourist Safety System - Enhanced Alerts Management Page
 * Real-time emergency alerts with mobile app integration for demos
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  Shield,
  Eye,
  Edit3,
  Siren,
  Bell,
  Activity,
  Navigation,
  Zap,
  Filter
} from 'lucide-react';
import { useAuth } from '@/stores/auth-store';
import { useDemoIntegration, EmergencyAlert } from '@/lib/demo-integration';
import { cn } from '@/lib/utils';

// Alert severity color mapping
const getSeverityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
    case 'low':
      return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
  }
};

// Alert status color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    case 'acknowledged':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    case 'responding':
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
    case 'resolved':
      return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
  }
};

export default function AlertsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { 
    liveAlerts, 
    newAlertCount, 
    lastUpdate,
    updateAlertStatus, 
    resolveAlert,
    clearAllAlerts,
    simulateRandomAlert,
    isDemoMode
  } = useDemoIntegration();

  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'high'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Auto-refresh simulation for demo
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Simulate random alerts for demo (less frequent than other simulation)
      if (Math.random() < 0.05 && liveAlerts.length < 8) {
        simulateRandomAlert();
      }
    }, 45000); // Every 45 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, liveAlerts.length, simulateRandomAlert]);

  // Check if user has permission to manage alerts
  const canManageAlerts = user?.role === 'super_admin' || user?.role === 'operator';

  // Filter alerts based on selected filter
  const filteredAlerts = liveAlerts.filter(alert => {
    if (filter === 'active') return alert.status === 'active';
    if (filter === 'high') return alert.priority === 'high';
    return true;
  });

  // Simulate refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Handle alert status update (only for authorized users)
  const handleStatusUpdate = (alertId: string, newStatus: EmergencyAlert['status'], responseTeam?: string) => {
    if (!canManageAlerts) return;
    updateAlertStatus(alertId, newStatus, responseTeam);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Activity className="w-8 h-8 text-red-600" />
              Live Emergency Alerts
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {canManageAlerts 
                ? 'Real-time monitoring and emergency response management' 
                : 'View live tourist safety alerts and reports'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* New Alerts Badge */}
            {newAlertCount > 0 && (
              <div className="bg-red-100 border border-red-200 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 text-red-800">
                  <Bell className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {newAlertCount} new alert{newAlertCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}

            {/* Auto-refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors',
                autoRefresh 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-gray-50 border-gray-200 text-gray-800'
              )}
            >
              <RefreshCw className={cn('w-4 h-4', autoRefresh && 'animate-spin')} />
              <span className="text-sm">Live Updates</span>
            </button>

            {/* Manual Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            {/* Demo Controls */}
            <button
              onClick={simulateRandomAlert}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm">Simulate Alert</span>
            </button>

            {/* Emergency Response Button (for operators/admins) */}
            {canManageAlerts && (
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Siren className="w-4 h-4" />
                Emergency Response
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-6">
          {[
            { label: 'Active Alerts', value: liveAlerts.filter(a => a.status === 'active').length, color: 'red' },
            { label: 'Responding', value: liveAlerts.filter(a => a.status === 'responding').length, color: 'blue' },
            { label: 'Resolved Today', value: liveAlerts.filter(a => a.status === 'resolved').length, color: 'green' },
            { label: 'Total Alerts', value: liveAlerts.length, color: 'gray' }
          ].map(stat => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              <div className={cn(
                'text-2xl font-bold',
                stat.color === 'red' && 'text-red-600',
                stat.color === 'blue' && 'text-blue-600',
                stat.color === 'green' && 'text-green-600',
                stat.color === 'gray' && 'text-gray-600'
              )}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All Alerts', count: liveAlerts.length },
              { key: 'active', label: 'Active', count: liveAlerts.filter(a => a.status === 'active').length },
              { key: 'high', label: 'High Priority', count: liveAlerts.filter(a => a.priority === 'high').length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  filter === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Clear All Button */}
          {liveAlerts.length > 0 && canManageAlerts && (
            <button
              onClick={clearAllAlerts}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <XCircle className="w-4 h-4" />
              Clear All
            </button>
          )}

          {/* Last Update */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {new Date(lastUpdate).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAlerts.map((alert) => {
          return (
            <div
              key={alert.id}
              className={cn(
                'bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 p-6 transition-all duration-200 hover:shadow-md cursor-pointer',
                getSeverityColor(alert.priority)
              )}
              onClick={() => setSelectedAlert(selectedAlert === alert.id ? null : alert.id)}
            >
              {/* Alert Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-2 rounded-lg',
                    alert.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30' :
                    alert.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    'bg-blue-100 dark:bg-blue-900/30'
                  )}>
                    <AlertTriangle className={cn(
                      'w-5 h-5',
                      alert.priority === 'high' ? 'text-red-600' :
                      alert.priority === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    )} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {alert.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {alert.priority.toUpperCase()} PRIORITY
                    </p>
                  </div>
                </div>
                
                {/* Status Badge */}
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getStatusColor(alert.status)
                )}>
                  {alert.status.toUpperCase()}
                </span>
              </div>

              {/* Alert Details */}
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {alert.description}
                </p>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {alert.location.address}
                </div>

                {/* Tourist Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4" />
                  {alert.tourist.name} ({alert.tourist.nationality})
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                  <Clock className="w-4 h-4" />
                  {new Date(alert.timestamp).toLocaleString()}
                </div>

                {/* Response Team Info */}
                {alert.responseTeam && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                        Assigned to: {alert.responseTeam}
                      </span>
                    </div>
                    {alert.estimatedArrival && (
                      <div className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                        ETA: {alert.estimatedArrival}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Expanded Actions */}
              {selectedAlert === alert.id && canManageAlerts && alert.status !== 'resolved' && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    {alert.status === 'active' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(alert.id, 'acknowledged', 'Emergency Response Team');
                        }}
                        className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4 inline mr-2" />
                        Acknowledge
                      </button>
                    )}
                    
                    {(alert.status === 'acknowledged' || alert.status === 'active') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(alert.id, 'responding', 'Emergency Response Team Alpha');
                        }}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Navigation className="w-4 h-4 inline mr-2" />
                        Dispatch Team
                      </button>
                    )}

                    {alert.status !== 'active' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resolveAlert(alert.id);
                        }}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        Resolve
                      </button>
                    )}
                  </div>
                  
                  {/* Contact Actions */}
                  <div className="flex gap-2 mt-2">
                    <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Call Tourist
                    </button>
                    <button className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Send Message
                    </button>
                  </div>
                </div>
              )}

              {/* View-only message for viewers */}
              {selectedAlert === alert.id && !canManageAlerts && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Eye className="w-4 h-4" />
                    Read-only access - Contact operator for emergency response
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No alerts found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {filter === 'all' 
              ? 'No emergency alerts at the moment. System is monitoring 24/7.'
              : `No ${filter} alerts at this time.`
            }
          </p>
          <button
            onClick={simulateRandomAlert}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <Zap className="w-4 h-4" />
            Create Demo Alert
          </button>
        </div>
      )}

      {/* Demo Mode Indicator */}
      {isDemoMode && (
        <div className="fixed bottom-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">Demo Mode Active</span>
          </div>
        </div>
      )}
    </div>
  );
}
