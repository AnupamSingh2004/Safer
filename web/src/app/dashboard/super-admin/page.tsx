/**
 * Super Admin Dashboard - System-Wide Administration
 * For super administrators with full system access
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  AlertTriangle, 
  Activity,
  Shield,
  Settings,
  RefreshCw,
  Crown,
  Database,
  TrendingUp,
  Globe
} from 'lucide-react';
import { useAuth } from '@/stores/auth-store';

// North East India Tourism Safety Dashboard - Super Admin Stats
const superAdminStats = {
  totalUsers: 842,
  activeAdmins: 28,
  totalOperators: 89,
  totalViewers: 156,
  systemUptime: 99.7,
  totalTourists: 3247,
  criticalAlerts: 1,
  systemHealth: 97.8,
  northEastStates: 8,
  activeTrekRoutes: 145,
  emergencyResponseTeams: 12,
  culturalSites: 89
};

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Crown className="w-7 h-7 md:w-8 md:h-8 text-yellow-500" />
              North East India Tourism Safety
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1">
              Super Admin Dashboard • System-Wide Monitoring & Administration
            </p>
          </div>
          <div className="flex items-center space-x-3 md:space-x-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-3 py-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>
            <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{superAdminStats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">8 NE States</p>
              </div>
              <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Active Routes</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{superAdminStats.activeTrekRoutes}</p>
                <p className="text-xs text-green-600 dark:text-green-400">Trekking & Tourism</p>
              </div>
              <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Activity className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Critical Alerts</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{superAdminStats.criticalAlerts}</p>
                <p className="text-xs text-red-600 dark:text-red-400">Weather Advisory</p>
              </div>
              <div className="p-2 md:p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Emergency Teams</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{superAdminStats.emergencyResponseTeams}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Standby Ready</p>
              </div>
              <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* System Administration */}
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            System Administration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Link
              href="/dashboard/analytics"
              className="group relative p-3 md:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    System Analytics
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    NE India tourism insights
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/operators"
              className="group relative p-3 md:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">
                    Manage Operators
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Field guide management
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/zones"
              className="group relative p-3 md:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <Globe className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    Regional Zones
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    State & district zones
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/blockchain"
              className="group relative p-3 md:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <Database className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400">
                    Blockchain Admin
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Digital identity system
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* North East India Tourism Notice */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 md:p-6 rounded-xl border border-yellow-200 dark:border-yellow-800 shadow-sm">
          <h3 className="text-sm md:text-base font-semibold text-yellow-900 dark:text-yellow-300 mb-3 flex items-center gap-2">
            <Crown className="w-4 h-4 md:w-5 md:h-5" />
            Super Administrator - North East India Tourism Safety System
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-2">System Coverage</h4>
              <ul className="text-xs md:text-sm text-yellow-800 dark:text-yellow-400 space-y-1">
                <li>• Arunachal Pradesh - Tawang, Bomdila, Itanagar</li>
                <li>• Assam - Guwahati, Kaziranga, Majuli Island</li>
                <li>• Manipur - Imphal, Loktak Lake, Kangla Fort</li>
                <li>• Meghalaya - Shillong, Cherrapunji, Living Root Bridges</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-2">Administrative Privileges</h4>
              <ul className="text-xs md:text-sm text-yellow-800 dark:text-yellow-400 space-y-1">
                <li>• Emergency response coordination across 8 states</li>
                <li>• Real-time monitoring of {superAdminStats.activeTrekRoutes} active routes</li>
                <li>• Cultural heritage site security management</li>
                <li>• Cross-border tourism safety protocols</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}