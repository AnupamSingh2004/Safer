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
    <div className="dashboard-container component-stack-lg">
      {/* Header */}
      <div className="dashboard-section">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-3 flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl shadow-sm">
                <Activity className="w-10 h-10 text-red-600" />
              </div>
              Live Emergency Alerts
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {canManageAlerts 
                ? 'Real-time monitoring and emergency response management' 
                : 'View live tourist safety alerts and reports'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* New Alerts Badge */}
            {newAlertCount > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3 text-red-800 dark:text-red-400">
                  <Bell className="w-5 h-5" />
                  <span className="text-sm font-semibold">
                    {newAlertCount} new alert{newAlertCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}

            {/* Auto-refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all font-medium',
                autoRefresh 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400' 
                  : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground'
              )}
            >
              <RefreshCw className={cn('w-4 h-4', autoRefresh && 'animate-spin')} />
              <span className="text-sm">Live Updates</span>
            </button>

            {/* Manual Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-3 px-4 py-3 bg-card border-2 border-border rounded-xl hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            {/* Demo Controls */}
            <button
              onClick={simulateRandomAlert}
              className="flex items-center gap-3 px-4 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors shadow-sm font-medium"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm">Simulate Alert</span>
            </button>

            {/* Emergency Response Button (for operators/admins) */}
            {canManageAlerts && (
              <button className="flex items-center gap-3 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-sm font-medium">
                <Siren className="w-4 h-4" />
                Emergency Response
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid-stats mt-8">
          {[
            { label: 'Active Alerts', value: liveAlerts.filter(a => a.status === 'active').length, color: 'red', icon: AlertTriangle },
            { label: 'Responding', value: liveAlerts.filter(a => a.status === 'responding').length, color: 'blue', icon: Activity },
            { label: 'Resolved Today', value: liveAlerts.filter(a => a.status === 'resolved').length, color: 'green', icon: CheckCircle },
            { label: 'Total Alerts', value: liveAlerts.length, color: 'gray', icon: Shield }
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="dashboard-card group hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className={cn('p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform',
                    stat.color === 'red' && 'bg-red-100 dark:bg-red-900/30',
                    stat.color === 'blue' && 'bg-blue-100 dark:bg-blue-900/30',
                    stat.color === 'green' && 'bg-green-100 dark:bg-green-900/30',
                    stat.color === 'gray' && 'bg-gray-100 dark:bg-gray-900/30'
                  )}>
                    <Icon className={cn('w-6 h-6',
                      stat.color === 'red' && 'text-red-600',
                      stat.color === 'blue' && 'text-blue-600',
                      stat.color === 'green' && 'text-green-600',
                      stat.color === 'gray' && 'text-gray-600'
                    )} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                    <div className={cn('text-3xl font-bold',
                      stat.color === 'red' && 'text-red-600',
                      stat.color === 'blue' && 'text-blue-600',
                      stat.color === 'green' && 'text-green-600',
                      stat.color === 'gray' && 'text-foreground'
                    )}>
                      {stat.value}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex gap-3">
            {[
              { key: 'all', label: 'All Alerts', count: liveAlerts.length },
              { key: 'active', label: 'Active', count: liveAlerts.filter(a => a.status === 'active').length },
              { key: 'high', label: 'High Priority', count: liveAlerts.filter(a => a.priority === 'high').length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={cn(
                  'px-6 py-3 rounded-xl text-sm font-semibold transition-all border-2',
                  filter === tab.key
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted/50'
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
              className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium shadow-sm"
            >
              <XCircle className="w-4 h-4" />
              Clear All
            </button>
          )}

          {/* Last Update */}
          <div className="text-sm font-medium text-muted-foreground bg-muted/50 px-4 py-3 rounded-xl">
            Last updated: {new Date(lastUpdate).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid-dashboard">
        {filteredAlerts.map((alert) => {
          return (
            <div
              key={alert.id}
              className={cn(
                'dashboard-card cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-l-4',
                alert.priority === 'high' ? 'border-l-red-500 hover:border-red-400' :
                alert.priority === 'medium' ? 'border-l-yellow-500 hover:border-yellow-400' :
                'border-l-blue-500 hover:border-blue-400'
              )}
              onClick={() => setSelectedAlert(selectedAlert === alert.id ? null : alert.id)}
            >
              {/* Alert Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'p-3 rounded-xl shadow-sm',
                    alert.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30' :
                    alert.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    'bg-blue-100 dark:bg-blue-900/30'
                  )}>
                    <AlertTriangle className={cn(
                      'w-6 h-6',
                      alert.priority === 'high' ? 'text-red-600' :
                      alert.priority === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    )} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">
                      {alert.title}
                    </h3>
                    <p className="text-sm font-semibold text-muted-foreground">
                      {alert.priority.toUpperCase()} PRIORITY
                    </p>
                  </div>
                </div>
                
                {/* Status Badge */}
                <span className={cn(
                  'px-3 py-2 rounded-xl text-xs font-bold shadow-sm',
                  getStatusColor(alert.status)
                )}>
                  {alert.status.toUpperCase()}
                </span>
              </div>

              {/* Alert Details */}
              <div className="component-stack-sm">
                <p className="text-muted-foreground leading-relaxed">
                  {alert.description}
                </p>

                {/* Location */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="font-medium">{alert.location.address}</span>
                </div>

                {/* Tourist Info */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                  <span className="font-medium">{alert.tourist.name} ({alert.tourist.nationality})</span>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-medium">{new Date(alert.timestamp).toLocaleString()}</span>
                </div>

                {/* Response Team Info */}
                {alert.responseTeam && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-bold text-blue-900 dark:text-blue-300">
                        Assigned to: {alert.responseTeam}
                      </span>
                    </div>
                    {alert.estimatedArrival && (
                      <div className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                        ETA: {alert.estimatedArrival}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Expanded Actions */}
              {selectedAlert === alert.id && canManageAlerts && alert.status !== 'resolved' && (
                <div className="mt-6 pt-6 border-t-2 border-border">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {alert.status === 'active' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(alert.id, 'acknowledged', 'Emergency Response Team');
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors text-sm font-medium shadow-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Acknowledge
                      </button>
                    )}
                    
                    {(alert.status === 'acknowledged' || alert.status === 'active') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(alert.id, 'responding', 'Emergency Response Team Alpha');
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
                      >
                        <Navigation className="w-4 h-4" />
                        Dispatch Team
                      </button>
                    )}

                    {alert.status !== 'active' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resolveAlert(alert.id);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium shadow-sm col-span-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Resolve
                      </button>
                    )}
                  </div>
                  
                  {/* Contact Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm font-medium shadow-sm">
                      <Phone className="w-4 h-4" />
                      Call Tourist
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
                      <MessageSquare className="w-4 h-4" />
                      Send Message
                    </button>
                  </div>
                </div>
              )}

              {/* View-only message for viewers */}
              {selectedAlert === alert.id && !canManageAlerts && (
                <div className="mt-6 pt-6 border-t-2 border-border">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 p-4 rounded-xl">
                    <Eye className="w-5 h-5" />
                    <span className="font-medium">Read-only access - Contact operator for emergency response</span>
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
