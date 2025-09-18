'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  AlertTriangle, 
  Activity,
  TrendingUp,
  Shield,
  Settings,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/stores/auth-store';

const adminStats = {
  totalTourists: 1247,
  activeTourists: 892,
  operators: 45,
  alertsToday: 3,
  safetyScore: 94.2,
  responseTime: 1.8,
  regionsManaged: 8,
  complianceRate: 97.1
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');

  const quickActions = [
    {
      title: 'Manage Operators',
      icon: Users,
      href: '/admin/operators',
      color: 'blue'
    },
    {
      title: 'View All Tourists',
      icon: Activity,
      href: '/admin/tourists',
      color: 'green'
    },
    {
      title: 'Safety Reports',
      icon: Shield,
      href: '/admin/reports',
      color: 'purple'
    },
    {
      title: 'System Settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'gray'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Regional Management  {adminStats.regionsManaged} Regions  {adminStats.operators} Operators
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
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Active</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tourists</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{adminStats.totalTourists.toLocaleString()}</p>
                <p className="text-xs text-green-600">{adminStats.activeTourists} active now</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{adminStats.safetyScore}%</p>
                <p className="text-xs text-green-600">+2.1% from last week</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{adminStats.alertsToday}</p>
                <p className="text-xs text-orange-600">Requires attention</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{adminStats.responseTime}m</p>
                <p className="text-xs text-green-600">Average today</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <action.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{action.title}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Admin Responsibilities Summary
            </h3>
            <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
              <li> Oversee regional tourist safety operations and operator performance</li>
              <li> Assign tourists to operators and manage resource allocation</li>
              <li> Monitor system-wide safety metrics and compliance standards</li>
              <li> Coordinate emergency responses and escalate critical issues</li>
              <li> Generate reports for upper management and stakeholders</li>
              <li> Configure system settings and manage user permissions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
