/**
 * Smart Tourist Safety System - Main Dashboard Page
 * This is the main dashboard landing page that users see after login
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  Activity,
  MapPin,
  TrendingUp,
  Eye,
  MessageSquare,
  Calendar,
  Clock,
  ArrowRight,
  Bell,
  Settings,
  BarChart3,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/stores/auth-store';

// Dashboard Stats Card Component
const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend = 'up',
  onClick 
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}) => (
  <div 
    className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
      onClick ? 'hover:shadow-md cursor-pointer transform hover:scale-105' : ''
    }`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
      {change && (
        <div className={`flex items-center space-x-1 text-sm ${
          trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
        }`}>
          <span>{change}</span>
          <TrendingUp className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
        </div>
      )}
    </div>
  </div>
);

// Quick Action Card Component
const QuickActionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  href,
  color = 'primary' 
}: {
  title: string;
  description: string;
  icon: any;
  href: string;
  color?: string;
}) => {
  const router = useRouter();
  
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105"
      onClick={() => router.push(href)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 bg-${color}/10 rounded-lg`}>
            <Icon className={`w-6 h-6 text-${color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

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

  // Mock data - replace with real API calls
  const dashboardStats = [
    {
      title: 'Active Tourists',
      value: '2,347',
      change: '+12.5%',
      icon: Users,
      trend: 'up' as const,
      onClick: () => router.push('/dashboard/analytics')
    },
    {
      title: 'Active Alerts',
      value: '8',
      change: '-2',
      icon: AlertTriangle,
      trend: 'down' as const,
      onClick: () => router.push('/dashboard/alerts')
    },
    {
      title: 'Response Time',
      value: '4.2m',
      change: '+0.3m',
      icon: Clock,
      trend: 'up' as const
    },
    {
      title: 'Safety Score',
      value: '94.2%',
      change: '+1.8%',
      icon: Shield,
      trend: 'up' as const
    }
  ];

  const quickActions = [
    {
      title: 'View Alerts',
      description: 'Monitor and manage safety alerts',
      icon: AlertTriangle,
      href: '/dashboard/alerts',
      color: 'red'
    },
    {
      title: 'Tourist Analytics',
      description: 'View tourist movement and statistics',
      icon: BarChart3,
      href: '/dashboard/analytics',
      color: 'blue'
    },
    {
      title: 'Location Tracking',
      description: 'Real-time location monitoring',
      icon: MapPin,
      href: '/dashboard/location',
      color: 'green'
    },
    {
      title: 'Communication',
      description: 'Send alerts and notifications',
      icon: MessageSquare,
      href: '/dashboard/communication',
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-primary" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Smart Tourist Safety
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {currentTime.toLocaleString()}
              </div>
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {(user as any).name || user.displayName || `${user.firstName} ${user.lastName}`.trim() || user.email}
                </span>
                <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                  {user.role.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {(user as any).name || user.displayName || `${user.firstName} ${user.lastName}`.trim() || user.email}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with tourist safety today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              trend={stat.trend}
              onClick={stat.onClick}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={index}
                title={action.title}
                description={action.description}
                icon={action.icon}
                href={action.href}
                color={action.color}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <button className="text-primary hover:text-primary-600 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              {
                icon: AlertTriangle,
                title: 'New safety alert created',
                description: 'High crowd density detected at Marina Bay',
                time: '5 minutes ago',
                color: 'text-red-600'
              },
              {
                icon: Users,
                title: 'Tourist group checked in',
                description: '25 tourists from Singapore registered',
                time: '12 minutes ago',
                color: 'text-blue-600'
              },
              {
                icon: Activity,
                title: 'System health check completed',
                description: 'All monitoring systems operational',
                time: '1 hour ago',
                color: 'text-green-600'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-600`}>
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
