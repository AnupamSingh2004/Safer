/**
 * Smart Tourist Safety System - Admin Management Page
 * System administration and user management interface
 */

'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Shield,
  Database,
  Activity,
  Lock,
  Globe,
  Bell,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');

  // Mock admin data
  const users = [
    {
      id: 'USR-001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@gov.in',
      role: 'super_admin',
      status: 'active',
      lastLogin: '2 hours ago',
      zones: ['Red Fort', 'India Gate']
    },
    {
      id: 'USR-002',
      name: 'Priya Sharma',
      email: 'priya.sharma@delhi.gov.in',
      role: 'operator',
      status: 'active',
      lastLogin: '30 minutes ago',
      zones: ['Connaught Place', 'Lotus Temple']
    },
    {
      id: 'USR-003',
      name: 'Amit Singh',
      email: 'amit.singh@police.gov.in',
      role: 'emergency_responder',
      status: 'active',
      lastLogin: '1 hour ago',
      zones: ['All Zones']
    },
    {
      id: 'USR-004',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@tourism.gov.in',
      role: 'viewer',
      status: 'inactive',
      lastLogin: '2 days ago',
      zones: ['Central Delhi']
    }
  ];

  const systemStats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'blue',
      change: '+2 this week'
    },
    {
      title: 'Active Sessions',
      value: users.filter(u => u.status === 'active').length,
      icon: Activity,
      color: 'green',
      change: '87% uptime'
    },
    {
      title: 'Security Events',
      value: 12,
      icon: Shield,
      color: 'yellow',
      change: '3 resolved today'
    },
    {
      title: 'System Health',
      value: '99.2%',
      icon: CheckCircle,
      color: 'green',
      change: 'All services online'
    }
  ];

  const securityLogs = [
    {
      id: 'LOG-001',
      type: 'login',
      user: 'Rajesh Kumar',
      action: 'Successful login',
      timestamp: '2025-01-15 14:30:22',
      ip: '192.168.1.100',
      status: 'success'
    },
    {
      id: 'LOG-002',
      type: 'permission',
      user: 'System',
      action: 'Permission changed for user Priya Sharma',
      timestamp: '2025-01-15 13:45:18',
      ip: '192.168.1.101',
      status: 'warning'
    },
    {
      id: 'LOG-003',
      type: 'failed_login',
      user: 'Unknown',
      action: 'Failed login attempt',
      timestamp: '2025-01-15 12:15:44',
      ip: '203.0.113.45',
      status: 'error'
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'operator': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'emergency_responder': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      case 'viewer': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'inactive': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
      case 'suspended': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getLogStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'error': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const tabs = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System Settings', icon: Settings },
    { id: 'logs', label: 'Activity Logs', icon: Activity }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              System Administration
            </h1>
            <p className="text-muted-foreground">
              Manage users, security, and system configuration
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="btn-secondary">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </button>
            <button className="btn-primary">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {systemStats.map((stat, index) => (
          <div key={index} className="dashboard-card p-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.title}</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-card p-0">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 inline mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">User Management</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <select className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option>All Roles</option>
                    <option>Super Admin</option>
                    <option>Operator</option>
                    <option>Emergency Responder</option>
                    <option>Viewer</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">Last login: {user.lastLogin}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          {user.role.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Zones: {user.zones.join(', ')}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:text-red-700 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-6">Security Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Authentication</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" checked className="rounded border-border" />
                        <span className="text-sm text-foreground">Two-factor authentication required</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" checked className="rounded border-border" />
                        <span className="text-sm text-foreground">Password complexity requirements</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded border-border" />
                        <span className="text-sm text-foreground">Automatic session timeout</span>
                      </label>
                    </div>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-2">Access Control</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" checked className="rounded border-border" />
                        <span className="text-sm text-foreground">IP address whitelisting</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" checked className="rounded border-border" />
                        <span className="text-sm text-foreground">Role-based permissions</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Recent Security Events</h4>
                  <div className="space-y-3">
                    {securityLogs.slice(0, 3).map((log) => (
                      <div key={log.id} className="border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">{log.action}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLogStatusColor(log.status)}`}>
                            {log.status}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {log.user} • {log.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Settings Tab */}
          {activeTab === 'system' && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-6">System Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-3">General Settings</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">System Name</label>
                        <input 
                          type="text" 
                          value="Smart Tourist Safety System"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Timezone</label>
                        <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                          <option>Asia/Kolkata (IST)</option>
                          <option>UTC</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-3">Database Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Main Database</span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30">
                          Online
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Backup Database</span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30">
                          Synced
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Last Backup</span>
                        <span className="text-sm text-muted-foreground">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Logs Tab */}
          {activeTab === 'logs' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Activity Logs</h3>
                <div className="flex items-center space-x-3">
                  <select className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                    <option>All Events</option>
                    <option>Login Events</option>
                    <option>Security Events</option>
                    <option>System Events</option>
                  </select>
                  <button className="btn-secondary">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {securityLogs.map((log) => (
                  <div key={log.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <Activity className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{log.action}</div>
                          <div className="text-sm text-muted-foreground">
                            User: {log.user} • IP: {log.ip}
                          </div>
                          <div className="text-xs text-muted-foreground">{log.timestamp}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLogStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;