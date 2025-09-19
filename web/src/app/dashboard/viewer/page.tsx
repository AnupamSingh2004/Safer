'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  AlertTriangle, 
  Activity,
  BarChart3,
  Shield,
  RefreshCw,
  Eye,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import { useAuth } from '@/stores/auth-store';

const viewerStats = {
  totalTourists: 1247,
  activeTourists: 892,
  totalOperators: 45,
  activeAlerts: 3,
  safetyScore: 94.8,
  responseTimeAvg: 3.2,
  incidentsToday: 2,
  systemUptime: 99.9,
  regionsMonitored: 8,
  complianceRate: 97.1
};

const regionalStats = [
  {
    region: "Kochi",
    tourists: 312,
    operators: 12,
    alerts: 1,
    safetyScore: 96.2
  },
  {
    region: "Munnar", 
    tourists: 187,
    operators: 8,
    alerts: 0,
    safetyScore: 98.1
  },
  {
    region: "Alleppey",
    tourists: 203,
    operators: 9,
    alerts: 2,
    safetyScore: 92.5
  }
];

export default function ViewerDashboard() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Viewer Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Read-Only Access • System Transparency • {viewerStats.regionsMonitored} Regions
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Eye className="w-4 h-4" />
              <span>View Only</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tourists</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{viewerStats.totalTourists.toLocaleString()}</p>
                <p className="text-xs text-blue-600">{viewerStats.activeTourists} active</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Safety Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{viewerStats.safetyScore}%</p>
                <p className="text-xs text-green-600">System wide</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{viewerStats.activeAlerts}</p>
                <p className="text-xs text-orange-600">Monitoring</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Compliance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{viewerStats.complianceRate}%</p>
                <p className="text-xs text-green-600">Excellent</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Regional Overview
            </h2>
            <Link 
              href="/dashboard/analytics/regional"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Detailed Analytics →
            </Link>
          </div>
          <div className="space-y-3">
            {regionalStats.map((region, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {region.region} Region
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {region.tourists} tourists • {region.operators} operators
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {region.safetyScore}% Safety
                    </span>
                    {region.alerts > 0 ? (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                        {region.alerts} alert{region.alerts > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                        All Clear
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Analytics & Reports Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/dashboard/analytics/overview"
              className="group relative p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    System Overview
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    View system-wide analytics
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/analytics/trends"
              className="group relative p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Trend Analysis
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Historical data trends
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/analytics/incidents"
              className="group relative p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Incident Reports
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    View-only incident history
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Viewer Access Summary
          </h3>
          <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
            <li>• View system-wide tourist safety statistics and analytics</li>
            <li>• Monitor compliance metrics and safety performance indicators</li>
            <li>• Access read-only reports for transparency and oversight</li>
            <li>• Review historical data and trends for audit purposes</li>
            <li>• Limited to viewing permissions without modification capabilities</li>
          </ul>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-300 mb-2">
            Viewer Access Level - Read-Only
          </h3>
          <ul className="text-xs text-gray-800 dark:text-gray-400 space-y-1">
            <li>• View system performance metrics and analytics in real-time</li>
            <li>• Access historical data and trend analysis for transparency</li>
            <li>• Monitor regional safety statistics and incident reports</li>
            <li>• Generate read-only reports for oversight and compliance</li>
            <li>• No modification capabilities - observation and audit purposes only</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
