/**
 * Smart Tourist Safety System - Main Dashboard Page
 * This is the main dashboard landing page that users see after login
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield,
  Users, 
  AlertTriangle, 
  Activity,
  MapPin,
  TrendingUp,
  MessageSquare,
  Clock,
  ArrowRight,
  BarChart3,
  Zap,
  PhoneCall,
  Navigation
} from 'lucide-react';
import { useAuth } from '@/stores/auth-store';
import { 
  demoTourists, 
  demoAlerts, 
  demoZones, 
  demoDashboardStats,
  demoRecentActivities 
} from '@/data/demo-seed-data';

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
  icon: IconComponent, 
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
            <IconComponent className={`w-6 h-6 text-${color}`} />
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

  // Use realistic demo data from seed
  const dashboardStats = [
    {
      title: 'Active Tourists',
      value: demoDashboardStats.totalTourists.toLocaleString(),
      change: `+${demoDashboardStats.activeTourists - demoDashboardStats.totalTourists + 15}`,
      icon: Users,
      trend: 'up' as const,
      onClick: () => router.push('/dashboard/analytics')
    },
    {
      title: 'Active Alerts',
      value: demoDashboardStats.activeAlerts.toString(),
      change: `-${demoDashboardStats.totalAlerts - demoDashboardStats.activeAlerts}`,
      icon: AlertTriangle,
      trend: 'down' as const,
      onClick: () => router.push('/dashboard/alerts')
    },
    {
      title: 'Avg Response Time',
      value: `${demoDashboardStats.responseTimeAverage}m`,
      change: '-0.5m',
      icon: Clock,
      trend: 'down' as const
    },
    {
      title: 'Safety Score',
      value: `${demoDashboardStats.safetyScoreAverage}%`,
      change: '+2.1%',
      icon: Shield,
      trend: 'up' as const
    }
  ];

  // Role-based Quick Actions
  const getQuickActionsForRole = (userRole: string) => {
    const baseActions = [
      {
        title: 'Tourist Analytics',
        description: `View statistics for ${demoDashboardStats.activeTourists} tourists`,
        icon: BarChart3,
        href: '/dashboard/analytics',
        color: 'blue'
      }
    ];

    if (userRole === 'super_admin') {
      return [
        {
          title: 'Emergency Management',
          description: `${demoDashboardStats.activeAlerts} critical alerts require admin attention`,
          icon: AlertTriangle,
          href: '/dashboard/alerts',
          color: 'red'
        },
        {
          title: 'System Administration',
          description: 'Manage users, zones, and system settings',
          icon: Shield,
          href: '/dashboard/admin',
          color: 'purple'
        },
        {
          title: 'Blockchain Verification',
          description: `${demoDashboardStats.blockchainVerifications.toLocaleString()} verifications completed`,
          icon: Shield,
          href: '/dashboard/blockchain',
          color: 'green'
        },
        ...baseActions
      ];
    }

    if (userRole === 'operator') {
      return [
        {
          title: 'Active Emergencies',
          description: `${demoDashboardStats.activeAlerts} alerts need operator response`,
          icon: AlertTriangle,
          href: '/dashboard/alerts',
          color: 'red'
        },
        {
          title: 'Tourist Monitoring',
          description: `Track ${demoDashboardStats.activeTourists} active tourists`,
          icon: Users,
          href: '/dashboard/tourists',
          color: 'blue'
        },
        {
          title: 'Zone Management',
          description: `Monitor ${demoDashboardStats.activeZones}/${demoDashboardStats.totalZones} zones`,
          icon: MapPin,
          href: '/dashboard/zones',
          color: 'green'
        },
        ...baseActions
      ];
    }

    // Viewer role - read-only access
    return [
      {
        title: 'View Emergency Reports',
        description: `Browse ${demoDashboardStats.totalAlerts} total safety reports`,
        icon: AlertTriangle,
        href: '/dashboard/reports',
        color: 'orange'
      },
      {
        title: 'Tourism Statistics',
        description: 'View comprehensive tourism analytics',
        icon: BarChart3,
        href: '/dashboard/analytics',
        color: 'blue'
      },
      {
        title: 'Zone Information',
        description: `View status of ${demoDashboardStats.totalZones} monitored zones`,
        icon: MapPin,
        href: '/dashboard/zones',
        color: 'green'
      }
    ];
  };

  const quickActions = getQuickActionsForRole(user.role);

  // Role-specific welcome messages
  const getWelcomeMessage = (userRole: string) => {
    switch (userRole) {
      case 'super_admin':
        return {
          title: `Welcome back, Administrator ${(user as any).name || user.displayName || user.email}!`,
          subtitle: 'You have full system control. Monitor all tourist safety operations and manage system settings.'
        };
      case 'operator':
        return {
          title: `Welcome back, Operator ${(user as any).name || user.displayName || user.email}!`,
          subtitle: 'Monitor tourist activities, respond to emergencies, and coordinate safety operations.'
        };
      case 'viewer':
        return {
          title: `Welcome, ${(user as any).name || user.displayName || user.email}!`,
          subtitle: 'Access tourism analytics and safety reports with read-only permissions.'
        };
      default:
        return {
          title: `Welcome back, ${(user as any).name || user.displayName || user.email}!`,
          subtitle: "Here's what's happening with tourist safety today."
        };
    }
  };

  const welcomeMessage = getWelcomeMessage(user.role);

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${
            user.role === 'super_admin' ? 'bg-purple-100 dark:bg-purple-900' :
            user.role === 'operator' ? 'bg-blue-100 dark:bg-blue-900' :
            'bg-green-100 dark:bg-green-900'
          }`}>
            {user.role === 'super_admin' && <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
            {user.role === 'operator' && <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
            {user.role === 'viewer' && <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {welcomeMessage.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {welcomeMessage.subtitle}
            </p>
          </div>
        </div>
        
        {/* Role Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          <div className={`w-2 h-2 rounded-full ${
            user.role === 'super_admin' ? 'bg-purple-500' :
            user.role === 'operator' ? 'bg-blue-500' :
            'bg-green-500'
          }`} />
          {user.role.replace('_', ' ').toUpperCase()} ACCESS
        </div>
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
            {demoRecentActivities.slice(0, 3).map((activity, index) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-600`}>
                  {activity.type === 'emergency_alert' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                  {activity.type === 'tourist_registration' && <Users className="w-4 h-4 text-blue-600" />}
                  {activity.type === 'zone_monitoring' && <MapPin className="w-4 h-4 text-yellow-600" />}
                  {activity.type === 'blockchain_verification' && <Shield className="w-4 h-4 text-green-600" />}
                  {activity.type === 'ai_detection' && <Zap className="w-4 h-4 text-purple-600" />}
                  {activity.type === 'system_health' && <Activity className="w-4 h-4 text-green-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.description}
                  </p>
                  {activity.location && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Navigation className="w-3 h-3" />
                      {activity.location}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
