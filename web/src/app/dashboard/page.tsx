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
    className={`dashboard-card group transition-all duration-300 ${
      onClick ? 'hover:shadow-lg cursor-pointer hover:-translate-y-1' : ''
    }`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/15 transition-colors">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
      </div>
      {change && (
        <div className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full ${
          trend === 'up' ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' : 
          trend === 'down' ? 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30' : 
          'text-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30'
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
      className="dashboard-card group hover:shadow-lg cursor-pointer hover:-translate-y-1 transition-all duration-300"
      onClick={() => router.push(href)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-5">
          <div className={`p-4 bg-${color}/10 rounded-xl group-hover:bg-${color}/15 transition-colors`}>
            <IconComponent className={`w-6 h-6 text-${color}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
    <div className="dashboard-container component-stack-lg">
      {/* Welcome Section */}
      <div className="dashboard-section">
        <div className="flex items-center gap-4 mb-6">
          <div className={`p-3 rounded-xl shadow-sm ${
            user.role === 'super_admin' ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800' :
            user.role === 'operator' ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' :
            'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
          }`}>
            {user.role === 'super_admin' && <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />}
            {user.role === 'operator' && <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
            {user.role === 'viewer' && <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />}
          </div>
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-2">
              {welcomeMessage.title}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {welcomeMessage.subtitle}
            </p>
          </div>
        </div>
        
        {/* Role Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-secondary/50 text-secondary-foreground shadow-sm border border-border">
          <div className={`w-3 h-3 rounded-full shadow-sm ${
            user.role === 'super_admin' ? 'bg-purple-500' :
            user.role === 'operator' ? 'bg-blue-500' :
            'bg-green-500'
          }`} />
          {user.role.replace('_', ' ').toUpperCase()} ACCESS
        </div>
      </div>

        {/* Stats Grid */}
        <div className="dashboard-section">
          <div className="grid-stats">
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
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Zap className="w-7 h-7 text-primary" />
            Quick Actions
          </h3>
          <div className="grid-cards">
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
        <div className="dashboard-card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <Activity className="w-7 h-7 text-primary" />
                Recent Activity
              </h3>
              <button className="text-primary hover:text-primary/80 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors">
                View All
              </button>
            </div>
          </div>
          
          <div className="card-content">
            <div className="component-stack-md">
              {demoRecentActivities.slice(0, 3).map((activity, index) => (
                <div key={activity.id} className="flex items-center space-x-5 p-4 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                  <div className={`p-3 rounded-xl shadow-sm bg-gradient-to-r ${
                    activity.type === 'emergency_alert' ? 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20' :
                    activity.type === 'tourist_registration' ? 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20' :
                    activity.type === 'zone_monitoring' ? 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20' :
                    activity.type === 'blockchain_verification' ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20' :
                    activity.type === 'ai_detection' ? 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20' :
                    'from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20'
                  }`}>
                    {activity.type === 'emergency_alert' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                    {activity.type === 'tourist_registration' && <Users className="w-5 h-5 text-blue-600" />}
                    {activity.type === 'zone_monitoring' && <MapPin className="w-5 h-5 text-yellow-600" />}
                    {activity.type === 'blockchain_verification' && <Shield className="w-5 h-5 text-green-600" />}
                    {activity.type === 'ai_detection' && <Zap className="w-5 h-5 text-purple-600" />}
                    {activity.type === 'system_health' && <Activity className="w-5 h-5 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-lg mb-1">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {activity.description}
                    </p>
                    {activity.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-2">
                        <Navigation className="w-3 h-3" />
                        {activity.location}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </span>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}
