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
  className?: string;
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

export function CommunicationPage({ className }: CommunicationPageProps) {
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
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {COMMUNICATION_METRICS.map((metric) => {
          const Icon = metric.icon;
          const trendInfo = getTrendInfo(metric.trend);
          const TrendIcon = trendInfo.icon;
          
          return (
            <div key={metric.title} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div className={cn('p-3 rounded-full', metric.bg)}>
                  <Icon className={cn('h-6 w-6', metric.color)} />
                </div>
                <div className={cn('flex items-center text-sm font-medium', trendInfo.color)}>
                  <TrendIcon className={cn('h-4 w-4 mr-1', trendInfo.rotation)} />
                  {metric.change}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delivery Channel Performance */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Delivery Channel Performance
        </h3>
        
        <div className="space-y-4">
          {DELIVERY_STATS.map((stat) => {
            const Icon = stat.icon;
            const deliveryRate = Math.round((stat.delivered / stat.sent) * 100);
            const openRate = Math.round((stat.opened / stat.delivered) * 100);
            
            return (
              <div key={stat.channel} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Icon className={cn('h-5 w-5 mr-3', stat.color)} />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {stat.channel}
                    </span>
                  </div>
                  <span className={cn('text-sm font-medium', stat.color)}>
                    {stat.rate}% delivery rate
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatNumber(stat.sent)}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Sent</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-blue-600">
                      {formatNumber(stat.delivered)}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Delivered ({deliveryRate}%)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-600">
                      {formatNumber(stat.opened)}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Opened ({openRate}%)
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-purple-600">
                      {formatNumber(stat.sent - stat.delivered)}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Failed</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Delivery Progress</span>
                    <span className="ml-auto">{deliveryRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={cn('h-2 rounded-full', 
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
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Recent Communication Activities
        </h3>
        
        <div className="space-y-4">
          {RECENT_ACTIVITIES.map((activity) => {
            const Icon = activity.icon;
            
            return (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={cn('p-2 rounded-full flex-shrink-0', activity.bg)}>
                  <Icon className={cn('h-4 w-4', activity.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.description}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
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
    <div className={cn('space-y-6', className)}>
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Communication Center
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage real-time messaging, notifications, and broadcasts
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">Online Now</div>
              <div className="text-lg font-semibold text-green-600">
                {MOCK_STATS.activeConversations} conversations
              </div>
            </div>
            
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600" />
            
            {hasPermission('manage_communication') && (
              <button className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatNumber(MOCK_STATS.totalMessages)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Messages</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {MOCK_STATS.activeConversations}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Active Chats</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Bell className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {MOCK_STATS.pendingNotifications}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Megaphone className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {MOCK_STATS.broadcastsSent}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Broadcasts</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {MOCK_STATS.responseRate}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Response Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {MOCK_STATS.avgResponseTime}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Avg Response</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Communication tabs">
            {COMMUNICATION_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  <Icon className={cn('h-5 w-5 mr-2', isActive ? tab.color : 'text-gray-400')} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'messaging' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Real-Time Messaging
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Communicate directly with tourists and provide real-time assistance
                </p>
              </div>
              <RealTimeMessaging />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Notification Management
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage and send targeted notifications to users
                </p>
              </div>
              <NotificationManagement />
            </div>
          )}

          {activeTab === 'broadcast' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Broadcast System
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Send mass announcements and emergency alerts to multiple users
                </p>
              </div>
              <BroadcastSystem />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Communication Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
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
