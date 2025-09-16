/**
 * Smart Tourist Safety System - Communication Page
 * Main page integrating all communication components
 */

'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Bell,
  Megaphone,
  Users,
  Send,
  Settings,
  Activity,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  TrendingUp,
  Smartphone,
  Mail,
  Radio,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { RealTimeMessaging, NotificationManagement, BroadcastSystem } from '@/components/dashboard/communication';

// ============================================================================
// TYPES
// ============================================================================

type CommunicationTab = 'messaging' | 'notifications' | 'broadcast' | 'analytics';

interface CommunicationStats {
  totalMessages: number;
  activeConversations: number;
  pendingNotifications: number;
  broadcastsSent: number;
  responseRate: number;
  avgResponseTime: string;
}

interface CommunicationPageProps {
  // Page components in app directory don't accept custom props
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const MOCK_STATS: CommunicationStats = {
  totalMessages: 1247,
  activeConversations: 89,
  pendingNotifications: 23,
  broadcastsSent: 156,
  responseRate: 94.2,
  avgResponseTime: '3.2 min',
};

const COMMUNICATION_TABS = [
  {
    id: 'messaging' as CommunicationTab,
    label: 'Real-Time Messaging',
    icon: MessageSquare,
    description: 'Chat with tourists and manage conversations',
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
  },
  {
    id: 'notifications' as CommunicationTab,
    label: 'Notification Management',
    icon: Bell,
    description: 'Manage and send notifications to users',
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/20',
  },
  {
    id: 'broadcast' as CommunicationTab,
    label: 'Broadcast System',
    icon: Megaphone,
    description: 'Send mass announcements and alerts',
    color: 'text-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
  },
  {
    id: 'analytics' as CommunicationTab,
    label: 'Communication Analytics',
    icon: BarChart3,
    description: 'View communication metrics and insights',
    color: 'text-orange-600',
    bg: 'bg-orange-100 dark:bg-orange-900/20',
  },
];

const RECENT_ACTIVITIES = [
  {
    id: 'activity-001',
    type: 'message',
    title: 'New message from Tourist Sarah Chen',
    description: 'Requesting assistance at Red Fort',
    timestamp: '2 minutes ago',
    icon: MessageSquare,
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
  },
  {
    id: 'activity-002',
    type: 'broadcast',
    title: 'Emergency broadcast sent',
    description: 'Heavy rainfall alert sent to 245 tourists',
    timestamp: '15 minutes ago',
    icon: Megaphone,
    color: 'text-red-600',
    bg: 'bg-red-100 dark:bg-red-900/20',
  },
  {
    id: 'activity-003',
    type: 'notification',
    title: 'System notification delivered',
    description: 'Welcome message sent to new registrations',
    timestamp: '1 hour ago',
    icon: Bell,
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/20',
  },
  {
    id: 'activity-004',
    type: 'message',
    title: 'Conversation resolved',
    description: 'Tourist assistance completed at India Gate',
    timestamp: '2 hours ago',
    icon: CheckCircle,
    color: 'text-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
  },
];

const COMMUNICATION_METRICS = [
  {
    title: 'Active Conversations',
    value: '89',
    change: '+12.5%',
    trend: 'up' as const,
    icon: MessageSquare,
    color: 'text-blue-600',
    bg: 'bg-blue-100 dark:bg-blue-900/20',
  },
  {
    title: 'Messages Today',
    value: '347',
    change: '+8.3%',
    trend: 'up' as const,
    icon: Send,
    color: 'text-green-600',
    bg: 'bg-green-100 dark:bg-green-900/20',
  },
  {
    title: 'Response Rate',
    value: '94.2%',
    change: '+2.1%',
    trend: 'up' as const,
    icon: Target,
    color: 'text-purple-600',
    bg: 'bg-purple-100 dark:bg-purple-900/20',
  },
  {
    title: 'Avg Response Time',
    value: '3.2 min',
    change: '-15.2%',
    trend: 'down' as const,
    icon: Clock,
    color: 'text-orange-600',
    bg: 'bg-orange-100 dark:bg-orange-900/20',
  },
];

const DELIVERY_STATS = [
  {
    channel: 'Push Notifications',
    sent: 1247,
    delivered: 1189,
    opened: 956,
    rate: 95.3,
    icon: Smartphone,
    color: 'text-blue-600',
  },
  {
    channel: 'Email',
    sent: 892,
    delivered: 867,
    opened: 623,
    rate: 97.2,
    icon: Mail,
    color: 'text-green-600',
  },
  {
    channel: 'SMS',
    sent: 156,
    delivered: 152,
    opened: 148,
    rate: 97.4,
    icon: Radio,
    color: 'text-purple-600',
  },
  {
    channel: 'In-App',
    sent: 2134,
    delivered: 2089,
    opened: 1876,
    rate: 97.9,
    icon: Bell,
    color: 'text-orange-600',
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function CommunicationPage() {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<CommunicationTab>('messaging');

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-IN');
  };

  // Get trend icon and color
  const getTrendInfo = (trend: 'up' | 'down') => {
    return trend === 'up' 
      ? { icon: TrendingUp, color: 'text-green-600' }
      : { icon: TrendingUp, color: 'text-red-600', rotation: 'rotate-180' };
  };

  // Render analytics tab content
  const renderAnalytics = () => (
    <div className="component-stack-8">
      {/* Metrics Grid */}
      <div className="grid-responsive gap-6">
        {COMMUNICATION_METRICS.map((metric) => {
          const Icon = metric.icon;
          const trendInfo = getTrendInfo(metric.trend);
          const TrendIcon = trendInfo.icon;
          
          return (
            <div key={metric.title} className="dashboard-card p-6">
              <div className="flex items-center justify-between">
                <div className={cn('p-3 rounded-xl', metric.bg)}>
                  <Icon className={cn('w-6 h-6', metric.color)} />
                </div>
                <div className={cn('flex items-center text-sm font-semibold', trendInfo.color)}>
                  <TrendIcon className={cn('w-4 h-4 mr-1', trendInfo.rotation)} />
                  {metric.change}
                </div>
              </div>
              <div className="component-stack-4">
                <div className="text-3xl font-bold text-foreground">
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delivery Channel Performance */}
      <div className="dashboard-card p-8">
        <h3 className="text-xl font-bold text-foreground mb-8">
          Delivery Channel Performance
        </h3>
        
        <div className="component-stack-6">
          {DELIVERY_STATS.map((stat) => {
            const Icon = stat.icon;
            const deliveryRate = Math.round((stat.delivered / stat.sent) * 100);
            const openRate = Math.round((stat.opened / stat.delivered) * 100);
            
            return (
              <div key={stat.channel} className="border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className={cn('p-2 rounded-lg mr-4', stat.color.replace('text-', 'bg-').replace('-600', '-500/20'))}>
                      <Icon className={cn('w-5 h-5', stat.color)} />
                    </div>
                    <span className="font-semibold text-foreground text-lg">
                      {stat.channel}
                    </span>
                  </div>
                  <span className={cn('text-sm font-semibold px-3 py-1 rounded-full', 
                    stat.color.replace('text-', 'bg-').replace('-600', '-100 dark:bg-'),
                    stat.color.replace('-600', '-600')
                  )}>
                    {stat.rate}% delivery rate
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-xl font-bold text-foreground">
                      {formatNumber(stat.sent)}
                    </div>
                    <div className="text-muted-foreground">Sent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">
                      {formatNumber(stat.delivered)}
                    </div>
                    <div className="text-muted-foreground">
                      Delivered ({deliveryRate}%)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatNumber(stat.opened)}
                    </div>
                    <div className="text-muted-foreground">
                      Opened ({openRate}%)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-600 dark:text-red-400">
                      {formatNumber(stat.sent - stat.delivered)}
                    </div>
                    <div className="text-muted-foreground">Failed</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="component-stack-3">
                  <div className="flex text-sm text-muted-foreground justify-between">
                    <span>Delivery Progress</span>
                    <span className="font-semibold">{deliveryRate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className={cn('h-3 rounded-full transition-all duration-300', 
                        stat.color.replace('text-', 'bg-').replace('-600', '-500')
                      )}
                      style={{ width: `${deliveryRate}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="dashboard-card p-8">
        <h3 className="text-xl font-bold text-foreground mb-8">
          Recent Communication Activities
        </h3>
        
        <div className="component-stack-6">
          {RECENT_ACTIVITIES.map((activity) => {
            const Icon = activity.icon;
            
            return (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={cn('p-3 rounded-xl flex-shrink-0', activity.bg)}>
                  <Icon className={cn('w-5 h-5', activity.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">
                    {activity.title}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </div>
                  <div className="text-xs text-muted-foreground/75 mt-2">
                    {activity.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="dashboard-card p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Communication Center
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage real-time messaging, notifications, and broadcasts
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Online Now</div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {MOCK_STATS.activeConversations} conversations
              </div>
            </div>
            
            <div className="h-8 w-px bg-border" />
            
            {hasPermission('manage_settings') && (
              <button className="btn-primary">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid-responsive gap-6">
        <div className="dashboard-card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {formatNumber(MOCK_STATS.totalMessages)}
              </div>
              <div className="text-sm text-muted-foreground">Total Messages</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {MOCK_STATS.activeConversations}
              </div>
              <div className="text-sm text-muted-foreground">Active Chats</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <Bell className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {MOCK_STATS.pendingNotifications}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Megaphone className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {MOCK_STATS.broadcastsSent}
              </div>
              <div className="text-sm text-muted-foreground">Broadcasts</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {MOCK_STATS.responseRate}%
              </div>
              <div className="text-sm text-muted-foreground">Response Rate</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {MOCK_STATS.avgResponseTime}
              </div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-card overflow-hidden">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-8" aria-label="Communication tabs">
            {COMMUNICATION_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center py-6 px-2 border-b-2 font-semibold text-sm whitespace-nowrap transition-all duration-200',
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  )}
                >
                  <Icon className={cn('w-5 h-5 mr-3', isActive ? 'text-primary' : 'text-muted-foreground')} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'messaging' && (
            <div>
              <div className="component-stack-6">
                <h3 className="text-xl font-bold text-foreground">
                  Real-Time Messaging
                </h3>
                <p className="text-muted-foreground">
                  Communicate directly with tourists and provide real-time assistance
                </p>
              </div>
              <RealTimeMessaging />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <div className="component-stack-6">
                <h3 className="text-xl font-bold text-foreground">
                  Notification Management
                </h3>
                <p className="text-muted-foreground">
                  Manage and send targeted notifications to users
                </p>
              </div>
              <NotificationManagement />
            </div>
          )}

          {activeTab === 'broadcast' && (
            <div>
              <div className="component-stack-6">
                <h3 className="text-xl font-bold text-foreground">
                  Broadcast System
                </h3>
                <p className="text-muted-foreground">
                  Send mass announcements and emergency alerts to multiple users
                </p>
              </div>
              <BroadcastSystem />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <div className="component-stack-6">
                <h3 className="text-xl font-bold text-foreground">
                  Communication Analytics
                </h3>
                <p className="text-muted-foreground">
                  Monitor communication metrics and performance insights
                </p>
              </div>
              {renderAnalytics()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunicationPage;
