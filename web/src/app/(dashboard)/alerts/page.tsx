/**
 * Smart Tourist Safety System - Alerts Dashboard Page
 * Comprehensive alert management interface for emergency operations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle,
  Bell,
  Clock,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Users
} from 'lucide-react';

import { useAlertStore } from '@/stores/alert-store';
import { AlertType, AlertSeverity, AlertStatus, NotificationChannel } from '@/types/alert';
import AlertPanel from '@/components/dashboard/alerts/alert-panel';
import AlertDetails from '@/components/dashboard/alerts/alert-details';
import EmergencyResponse from '@/components/dashboard/alerts/emergency-response';

// ============================================================================
// INTERFACES
// ============================================================================

interface AlertFilters {
  types: AlertType[];
  severities: AlertSeverity[];
  statuses: AlertStatus[];
  search: string;
  dateRange: {
    start: string;
    end: string;
  } | null;
}

interface ViewMode {
  current: 'overview' | 'details' | 'emergency';
  selectedAlertId: string | null;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AlertsPage: React.FC = () => {
  const {
    alerts,
    alertMetrics,
    selectedAlert,
    isLoading,
    error,
    activeAlertsCount,
    criticalAlertsCount,
    unacknowledgedCount,
    fetchAlerts,
    fetchAlertMetrics,
    selectAlert,
    acknowledgeAlert,
    resolveAlert,
    escalateAlert,
    createEmergencyBroadcast,
    subscribeToAlerts,
    unsubscribeFromAlerts,
    clearError
  } = useAlertStore();

  const [viewMode, setViewMode] = useState<ViewMode>({
    current: 'overview',
    selectedAlertId: null
  });

  const [filters, setFilters] = useState<AlertFilters>({
    types: [],
    severities: [],
    statuses: [],
    search: '',
    dateRange: null
  });

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // ========================================================================
  // EFFECTS
  // ========================================================================

  useEffect(() => {
    fetchAlerts();
    fetchAlertMetrics();
    subscribeToAlerts();

    return () => {
      unsubscribeFromAlerts();
    };
  }, [fetchAlerts, fetchAlertMetrics, subscribeToAlerts, unsubscribeFromAlerts]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchAlerts();
        fetchAlertMetrics();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchAlerts, fetchAlertMetrics]);

  // Clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleAlertSelect = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      selectAlert(alert);
      setViewMode({
        current: 'details',
        selectedAlertId: alertId
      });
    }
  };

  const handleBackToOverview = () => {
    setViewMode({
      current: 'overview',
      selectedAlertId: null
    });
    selectAlert(null);
  };

  const handleCreateEmergency = () => {
    setViewMode({
      current: 'emergency',
      selectedAlertId: null
    });
  };

  const handleQuickAction = async (action: string, alertId: string) => {
    try {
      switch (action) {
        case 'acknowledge':
          await acknowledgeAlert(alertId, 'current-user', 'Acknowledged from dashboard');
          break;
        case 'resolve':
          await resolveAlert(alertId, 'current-user', 'Resolved from dashboard');
          break;
        case 'escalate':
          await escalateAlert(alertId, 'current-user', 'Escalated from dashboard');
          break;
      }
      fetchAlerts();
    } catch (error) {
      console.error('Failed to perform action:', error);
    }
  };

  const handleRefresh = () => {
    fetchAlerts();
    fetchAlertMetrics();
  };

  const handleExport = () => {
    // Simulate export functionality
    const exportData = alerts.map(alert => ({
      id: alert.id,
      type: alert.type,
      severity: alert.severity,
      status: alert.status,
      title: alert.title,
      createdAt: alert.createdAt,
      acknowledgedAt: alert.acknowledgedAt || '',
      resolvedAt: alert.resolvedAt || ''
    }));

    const csv = [
      ['ID', 'Type', 'Severity', 'Status', 'Title', 'Created', 'Acknowledged', 'Resolved'],
      ...exportData.map(row => [
        row.id,
        row.type,
        row.severity,
        row.status,
        row.title,
        row.createdAt,
        row.acknowledgedAt,
        row.resolvedAt
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alerts-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ========================================================================
  // RENDER FUNCTIONS
  // ========================================================================

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
            <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Alerts
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {alertMetrics?.totalAlerts || alerts.length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
            <AlertCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Alerts
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {activeAlertsCount}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Critical Alerts
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {criticalAlertsCount}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900">
            <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Unacknowledged
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {unacknowledgedCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderToolbar = () => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Alert Management
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Monitor and manage all system alerts and emergency notifications
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
          />
        </div>
        
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
        
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
        
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
        
        <button
          onClick={handleCreateEmergency}
          className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          <AlertTriangle className="w-4 h-4" />
          Emergency Broadcast
        </button>
      </div>
    </div>
  );

  const renderAutoRefreshToggle = () => (
    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-6">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Real-time Updates {autoRefresh ? 'Enabled' : 'Disabled'}
        </span>
      </div>
      
      <button
        onClick={() => setAutoRefresh(!autoRefresh)}
        className={`px-3 py-1 text-xs rounded-full transition-colors ${
          autoRefresh
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        {autoRefresh ? 'Disable' : 'Enable'}
      </button>
    </div>
  );

  // ========================================================================
  // MAIN RENDER
  // ========================================================================

  if (viewMode.current === 'details' && selectedAlert) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToOverview}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back to Overview
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Alert Details
          </h1>
        </div>
        
        <AlertDetails
          alert={selectedAlert}
          onBack={handleBackToOverview}
          onAction={handleQuickAction}
        />
      </div>
    );
  }

  if (viewMode.current === 'emergency') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToOverview}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back to Overview
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Emergency Response
          </h1>
        </div>
        
        <EmergencyResponse
          onBack={handleBackToOverview}
          onBroadcastCreated={() => {
            handleBackToOverview();
            fetchAlerts();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 dark:text-red-400">{error}</span>
          </div>
        </div>
      )}

      {/* Page Header & Toolbar */}
      {renderToolbar()}

      {/* Auto-refresh Status */}
      {renderAutoRefreshToggle()}

      {/* Stats Cards */}
      {renderStatsCards()}

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Active Alerts
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          <AlertPanel
            alerts={alerts}
            filters={filters}
            isLoading={isLoading}
            onAlertSelect={handleAlertSelect}
            onQuickAction={handleQuickAction}
            onFiltersChange={setFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
