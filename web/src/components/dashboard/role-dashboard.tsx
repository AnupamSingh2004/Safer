/**
 * Smart Tourist Safety System - Role-Specific Dashboard Layouts
 * Different dashboard layouts and views based on user roles
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { UserRole } from '@/types/auth';
import { useAuth } from '@/hooks/use-auth';
import { RoleGuard } from '@/components/auth/role-guard';

// ============================================================================
// DASHBOARD COMPONENTS
// ============================================================================

/**
 * Super Admin Dashboard Layout
 * Full system overview with all management capabilities
 */
const SuperAdminDashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">System Administrator Dashboard</h1>
        <p className="text-red-100">Complete system oversight and management</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value="1,234"
          icon="👥"
          change="+12"
          color="blue"
        />
        <StatCard
          title="Active Tourists"
          value="892"
          icon="🧳"
          change="+45"
          color="green"
        />
        <StatCard
          title="Open Alerts"
          value="23"
          icon="🚨"
          change="-5"
          color="yellow"
        />
        <StatCard
          title="System Health"
          value="98.5%"
          icon="💚"
          change="+0.2%"
          color="emerald"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Management */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Management Panel */}
          <DashboardPanel
            title="User Management"
            icon="👥"
            color="blue"
          >
            <div className="space-y-3">
              <QuickAction
                label="Create New User"
                href="/admin/users/create"
                icon="➕"
                color="blue"
              />
              <QuickAction
                label="Manage Roles"
                href="/admin/roles"
                icon="🔑"
                color="purple"
              />
              <QuickAction
                label="User Activity Logs"
                href="/admin/logs/users"
                icon="📊"
                color="gray"
              />
            </div>
          </DashboardPanel>

          {/* System Management Panel */}
          <DashboardPanel
            title="System Management"
            icon="⚙️"
            color="gray"
          >
            <div className="space-y-3">
              <QuickAction
                label="System Settings"
                href="/admin/settings"
                icon="🔧"
                color="gray"
              />
              <QuickAction
                label="Database Backup"
                href="/admin/backup"
                icon="💾"
                color="blue"
              />
              <QuickAction
                label="Security Audit"
                href="/admin/security"
                icon="🛡️"
                color="red"
              />
            </div>
          </DashboardPanel>

          {/* Blockchain Management */}
          <DashboardPanel
            title="Blockchain Operations"
            icon="⛓️"
            color="purple"
          >
            <div className="space-y-3">
              <QuickAction
                label="Deploy Contracts"
                href="/admin/blockchain/deploy"
                icon="🚀"
                color="purple"
              />
              <QuickAction
                label="Verify Identities"
                href="/admin/blockchain/verify"
                icon="✅"
                color="green"
              />
              <QuickAction
                label="Network Status"
                href="/admin/blockchain/status"
                icon="📡"
                color="blue"
              />
            </div>
          </DashboardPanel>
        </div>

        {/* Right Column - Monitoring */}
        <div className="space-y-6">
          {/* Real-time Alerts */}
          <DashboardPanel
            title="Real-time Alerts"
            icon="🚨"
            color="red"
          >
            <div className="space-y-2">
              <AlertItem
                type="high"
                message="Tourist reported missing in Zone A"
                time="2 min ago"
              />
              <AlertItem
                type="medium"
                message="Unusual crowd density in Zone B"
                time="15 min ago"
              />
              <AlertItem
                type="low"
                message="System maintenance scheduled"
                time="1 hour ago"
              />
            </div>
          </DashboardPanel>

          {/* System Metrics */}
          <DashboardPanel
            title="System Metrics"
            icon="📈"
            color="green"
          >
            <div className="space-y-3">
              <MetricItem label="API Response Time" value="120ms" />
              <MetricItem label="Database Queries/sec" value="1,234" />
              <MetricItem label="Active Sessions" value="892" />
              <MetricItem label="Memory Usage" value="67%" />
            </div>
          </DashboardPanel>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Operator Dashboard Layout
 * Operational view focused on tourist management and alerts
 */
const OperatorDashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Operations Dashboard</h1>
        <p className="text-blue-100">Monitor and manage tourist safety operations</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Active Tourists"
          value="892"
          icon="🧳"
          change="+45"
          color="blue"
        />
        <StatCard
          title="Open Incidents"
          value="12"
          icon="⚠️"
          change="-3"
          color="yellow"
        />
        <StatCard
          title="Zone Alerts"
          value="8"
          icon="📍"
          change="+2"
          color="red"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Tourist Management */}
        <div className="space-y-6">
          {/* Tourist Operations */}
          <DashboardPanel
            title="Tourist Management"
            icon="🧳"
            color="blue"
          >
            <div className="space-y-3">
              <QuickAction
                label="Register Tourist"
                href="/tourists/register"
                icon="➕"
                color="blue"
              />
              <QuickAction
                label="Track Tourists"
                href="/tourists/tracking"
                icon="📍"
                color="green"
              />
              <QuickAction
                label="Send Notifications"
                href="/tourists/notify"
                icon="📧"
                color="purple"
              />
            </div>
          </DashboardPanel>

          {/* Incident Management */}
          <DashboardPanel
            title="Incident Response"
            icon="🚨"
            color="red"
          >
            <div className="space-y-3">
              <QuickAction
                label="Create Incident"
                href="/incidents/create"
                icon="➕"
                color="red"
              />
              <QuickAction
                label="View All Incidents"
                href="/incidents"
                icon="📋"
                color="gray"
              />
              <QuickAction
                label="Emergency Response"
                href="/emergency"
                icon="🚑"
                color="red"
              />
            </div>
          </DashboardPanel>

          {/* Zone Management */}
          <DashboardPanel
            title="Zone Management"
            icon="🗺️"
            color="green"
          >
            <div className="space-y-3">
              <QuickAction
                label="Create Zone"
                href="/zones/create"
                icon="➕"
                color="green"
              />
              <QuickAction
                label="Update Restrictions"
                href="/zones/restrictions"
                icon="🚫"
                color="yellow"
              />
              <QuickAction
                label="Geofence Settings"
                href="/zones/geofencing"
                icon="📐"
                color="blue"
              />
            </div>
          </DashboardPanel>
        </div>

        {/* Right Column - Monitoring */}
        <div className="space-y-6">
          {/* Active Incidents */}
          <DashboardPanel
            title="Active Incidents"
            icon="⚠️"
            color="yellow"
          >
            <div className="space-y-2">
              <IncidentItem
                id="INC-001"
                type="missing"
                location="Zone A - Beach Area"
                priority="high"
                time="30 min ago"
              />
              <IncidentItem
                id="INC-002"
                type="medical"
                location="Zone C - Hills"
                priority="medium"
                time="1 hour ago"
              />
            </div>
          </DashboardPanel>

          {/* Tourist Status */}
          <DashboardPanel
            title="Tourist Status"
            icon="👥"
            color="blue"
          >
            <div className="space-y-3">
              <StatusItem label="Safe" count={845} color="green" />
              <StatusItem label="In Transit" count={32} color="blue" />
              <StatusItem label="Attention Needed" count={12} color="yellow" />
              <StatusItem label="Emergency" count={3} color="red" />
            </div>
          </DashboardPanel>

          {/* Recent Activities */}
          <DashboardPanel
            title="Recent Activities"
            icon="📋"
            color="gray"
          >
            <div className="space-y-2">
              <ActivityItem
                action="Tourist registered"
                details="John Doe - Zone B"
                time="5 min ago"
              />
              <ActivityItem
                action="Alert resolved"
                details="Crowd control - Zone A"
                time="12 min ago"
              />
              <ActivityItem
                action="Zone updated"
                details="Safety restrictions - Zone C"
                time="25 min ago"
              />
            </div>
          </DashboardPanel>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Viewer Dashboard Layout
 * Read-only view for monitoring and reporting
 */
const ViewerDashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Monitoring Dashboard</h1>
        <p className="text-green-100">Real-time overview of tourist safety status</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Tourists"
          value="892"
          icon="👥"
          change="+45"
          color="green"
        />
        <StatCard
          title="Active Alerts"
          value="5"
          icon="🔔"
          change="-2"
          color="blue"
        />
        <StatCard
          title="Safe Zones"
          value="18/20"
          icon="✅"
          change="0"
          color="emerald"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Overview */}
        <div className="space-y-6">
          {/* Tourist Overview */}
          <DashboardPanel
            title="Tourist Overview"
            icon="👥"
            color="blue"
          >
            <div className="space-y-3">
              <ViewOnlyMetric label="Checked In Today" value="156" />
              <ViewOnlyMetric label="Currently Active" value="892" />
              <ViewOnlyMetric label="In Safe Zones" value="845" />
              <ViewOnlyMetric label="Require Attention" value="12" />
            </div>
          </DashboardPanel>

          {/* Zone Status */}
          <DashboardPanel
            title="Zone Status"
            icon="🗺️"
            color="green"
          >
            <div className="space-y-3">
              <ZoneStatusItem name="Beach Area (Zone A)" status="safe" tourists={234} />
              <ZoneStatusItem name="City Center (Zone B)" status="crowded" tourists={456} />
              <ZoneStatusItem name="Hills (Zone C)" status="caution" tourists={89} />
              <ZoneStatusItem name="Forest Trail (Zone D)" status="safe" tourists={67} />
            </div>
          </DashboardPanel>
        </div>

        {/* Right Column - Alerts & Reports */}
        <div className="space-y-6">
          {/* Current Alerts */}
          <DashboardPanel
            title="Current Alerts"
            icon="🔔"
            color="yellow"
          >
            <div className="space-y-2">
              <AlertItem
                type="medium"
                message="High crowd density in Zone B"
                time="10 min ago"
              />
              <AlertItem
                type="low"
                message="Weather advisory for Zone C"
                time="1 hour ago"
              />
              <AlertItem
                type="low"
                message="Maintenance scheduled Zone D"
                time="2 hours ago"
              />
            </div>
          </DashboardPanel>

          {/* Analytics Access */}
          <DashboardPanel
            title="Reports & Analytics"
            icon="📊"
            color="purple"
          >
            <div className="space-y-3">
              <QuickAction
                label="View Daily Report"
                href="/reports/daily"
                icon="📋"
                color="blue"
              />
              <QuickAction
                label="Tourist Analytics"
                href="/analytics/tourists"
                icon="📈"
                color="green"
              />
              <QuickAction
                label="Zone Statistics"
                href="/analytics/zones"
                icon="📊"
                color="purple"
              />
            </div>
          </DashboardPanel>

          {/* System Status */}
          <DashboardPanel
            title="System Status"
            icon="💚"
            color="emerald"
          >
            <div className="space-y-3">
              <StatusIndicator label="Tourist Tracking" status="online" />
              <StatusIndicator label="Alert System" status="online" />
              <StatusIndicator label="Blockchain Network" status="online" />
              <StatusIndicator label="Communication" status="online" />
            </div>
          </DashboardPanel>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// ROLE-BASED DASHBOARD ROUTER
// ============================================================================

/**
 * Main dashboard component that renders appropriate layout based on user role
 */
export const RoleDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please log in to access the dashboard.</p>
      </div>
    );
  }

  // Render dashboard based on user role
  const renderDashboard = () => {
    switch (user.role) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'operator':
        return <OperatorDashboard />;
      case 'viewer':
        return <ViewerDashboard />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Invalid user role. Please contact administrator.</p>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {renderDashboard()}
    </div>
  );
};

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  change: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'emerald' | 'gray';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    gray: 'bg-gray-50 border-gray-200 text-gray-800'
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-70">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs opacity-70">{change} from yesterday</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
};

interface DashboardPanelProps {
  title: string;
  icon: string;
  color: string;
  children: React.ReactNode;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{icon}</span>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
};

interface QuickActionProps {
  label: string;
  href: string;
  icon: string;
  color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ label, href, icon }) => {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
    >
      <span>{icon}</span>
      <span className="font-medium text-gray-700">{label}</span>
    </a>
  );
};

interface AlertItemProps {
  type: 'high' | 'medium' | 'low';
  message: string;
  time: string;
}

const AlertItem: React.FC<AlertItemProps> = ({ type, message, time }) => {
  const typeColors = {
    high: 'border-red-200 bg-red-50 text-red-800',
    medium: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    low: 'border-blue-200 bg-blue-50 text-blue-800'
  };

  return (
    <div className={`p-3 rounded-md border ${typeColors[type]}`}>
      <p className="text-sm font-medium">{message}</p>
      <p className="text-xs opacity-70">{time}</p>
    </div>
  );
};

interface MetricItemProps {
  label: string;
  value: string;
}

const MetricItem: React.FC<MetricItemProps> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

interface IncidentItemProps {
  id: string;
  type: string;
  location: string;
  priority: string;
  time: string;
}

const IncidentItem: React.FC<IncidentItemProps> = ({ id, type, location, priority, time }) => (
  <div className="p-3 border border-gray-200 rounded-md">
    <div className="flex justify-between items-start">
      <div>
        <p className="font-medium text-sm">{id} - {type}</p>
        <p className="text-xs text-gray-600">{location}</p>
      </div>
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {priority}
      </span>
    </div>
    <p className="text-xs text-gray-500 mt-1">{time}</p>
  </div>
);

interface StatusItemProps {
  label: string;
  count: number;
  color: string;
}

const StatusItem: React.FC<StatusItemProps> = ({ label, count, color }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}</span>
    <span className={`px-2 py-1 rounded text-sm font-medium bg-${color}-100 text-${color}-800`}>
      {count}
    </span>
  </div>
);

interface ActivityItemProps {
  action: string;
  details: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ action, details, time }) => (
  <div className="text-sm">
    <p className="font-medium text-gray-900">{action}</p>
    <p className="text-gray-600">{details}</p>
    <p className="text-xs text-gray-500">{time}</p>
  </div>
);

interface ViewOnlyMetricProps {
  label: string;
  value: string;
}

const ViewOnlyMetric: React.FC<ViewOnlyMetricProps> = ({ label, value }) => (
  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="font-semibold text-gray-900">{value}</span>
  </div>
);

interface ZoneStatusItemProps {
  name: string;
  status: 'safe' | 'crowded' | 'caution';
  tourists: number;
}

const ZoneStatusItem: React.FC<ZoneStatusItemProps> = ({ name, status, tourists }) => {
  const statusColors = {
    safe: 'bg-green-100 text-green-800',
    crowded: 'bg-yellow-100 text-yellow-800',
    caution: 'bg-red-100 text-red-800'
  };

  return (
    <div className="flex justify-between items-center p-2">
      <div>
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-gray-600">{tourists} tourists</p>
      </div>
      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status]}`}>
        {status}
      </span>
    </div>
  );
};

interface StatusIndicatorProps {
  label: string;
  status: 'online' | 'offline' | 'warning';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ label, status }) => {
  const statusColors = {
    online: 'bg-green-100 text-green-800',
    offline: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800'
  };

  const statusIcons = {
    online: '🟢',
    offline: '🔴',
    warning: '🟡'
  };

  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span>{statusIcons[status]}</span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default RoleDashboard;