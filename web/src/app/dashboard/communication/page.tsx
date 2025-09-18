/**
 * Smart Tourist Safety System - Communication Page
 * Main page integrating all communication components
 */

'use client';

import React, { useState, useEffect } from 'react';
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
  User,
  MapPin,
  Phone,
  Circle,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { NotificationManagement, BroadcastSystem } from '@/components/dashboard/communication';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// =============================================================================
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

// Mock Real-Time Messaging Data
const MOCK_CONVERSATIONS = [
  {
    id: 1,
    user: 'Sarah Chen',
    location: 'Red Fort, Delhi',
    avatar: 'SC',
    lastMessage: 'Need help finding the exit near parking area',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    isOnline: true,
    unreadCount: 2,
    priority: 'high',
  },
  {
    id: 2,
    user: 'John Smith',
    location: 'India Gate',
    avatar: 'JS',
    lastMessage: 'Thank you for the directions!',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    isOnline: true,
    unreadCount: 0,
    priority: 'normal',
  },
  {
    id: 3,
    user: 'Priya Sharma',
    location: 'Qutub Minar',
    avatar: 'PS',
    lastMessage: 'Is the monument open until 6 PM?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isOnline: false,
    unreadCount: 1,
    priority: 'normal',
  },
];

const MOCK_MESSAGES = [
  { id: 1, sender: 'tourist', text: 'Hi, I need help finding the exit near parking area', timestamp: new Date(Date.now() - 3 * 60 * 1000) },
  { id: 2, sender: 'operator', text: 'Hello Sarah! I can help you with that. Are you currently at the main courtyard?', timestamp: new Date(Date.now() - 2.5 * 60 * 1000) },
  { id: 3, sender: 'tourist', text: 'Yes, I\'m near the central fountain', timestamp: new Date(Date.now() - 2 * 60 * 1000) },
  { id: 4, sender: 'operator', text: 'Perfect! Head towards the east side of the courtyard. You\'ll see signs for "Parking Exit" in about 50 meters.', timestamp: new Date(Date.now() - 1.5 * 60 * 1000) },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function CommunicationPage() {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<CommunicationTab>('messaging');
  const [selectedConversation, setSelectedConversation] = useState(MOCK_CONVERSATIONS[0]);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);

  // Simulate new incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'messaging' && Math.random() < 0.3) { // 30% chance every 5 seconds
        const newIncomingMessage = {
          id: messages.length + 1,
          sender: 'tourist' as const,
          text: [
            'Are there any restaurants nearby?',
            'What time does the monument close?',
            'Can you help me find a taxi?',
            'Is there a first aid station here?',
            'Where is the nearest restroom?'
          ][Math.floor(Math.random() * 5)],
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, newIncomingMessage]);
        
        // Update conversation with new message
        setConversations(prev => prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, lastMessage: newIncomingMessage.text, timestamp: newIncomingMessage.timestamp, unreadCount: conv.unreadCount + 1 }
            : conv
        ));
      }
    }, 8000); // Every 8 seconds

    return () => clearInterval(interval);
  }, [activeTab, messages.length, selectedConversation.id]);

  // Simulate typing indicator
  useEffect(() => {
    if (activeTab === 'messaging') {
      const typingInterval = setInterval(() => {
        if (Math.random() < 0.2) { // 20% chance
          setIsTyping(true);
          setTimeout(() => setIsTyping(false), 3000);
        }
      }, 10000);

      return () => clearInterval(typingInterval);
    }
  }, [activeTab]);

  // Send message function
  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'operator' as const,
        text: newMessage,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Update conversation
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: message.text, timestamp: message.timestamp, unreadCount: 0 }
          : conv
      ));
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Mock Real-Time Messaging Component
  const MockRealTimeMessaging = () => (
    <div className="grid lg:grid-cols-3 gap-6 min-h-[600px]">
      {/* Conversations List */}
      <div className="dashboard-card flex flex-col min-h-[600px]">
        <div className="p-4 border-b border-border">
          <h4 className="font-semibold text-foreground">Active Conversations</h4>
          <p className="text-sm text-muted-foreground">{conversations.filter(c => c.unreadCount > 0).length} unread</p>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[500px]">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={cn(
                'w-full p-4 text-left hover:bg-muted/50 transition-colors border-b border-border/50',
                selectedConversation.id === conv.id ? 'bg-primary/10' : ''
              )}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-semibold text-primary">
                    {conv.avatar}
                  </div>
                  {conv.isOnline && (
                    <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground truncate">{conv.user}</p>
                    {conv.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    {conv.location}
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-1">{conv.lastMessage}</p>
                  <p className="text-xs text-muted-foreground">
                    {conv.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="lg:col-span-2 dashboard-card flex flex-col min-h-[600px]">
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center font-semibold text-primary">
                {selectedConversation.avatar}
              </div>
              {selectedConversation.isOnline && (
                <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground">{selectedConversation.user}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 mr-1" />
                {selectedConversation.location}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-muted rounded-lg">
              <Phone className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.sender === 'operator' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                  message.sender === 'operator'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                )}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={cn(
                    'text-xs mt-1',
                    message.sender === 'operator'
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  )}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className={cn(
                'px-4 py-2 rounded-lg transition-colors',
                newMessage.trim()
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Communication Center
            </h1>
            <p className="text-muted-foreground">
              Manage real-time messaging, notifications, and broadcasts
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Online Now</div>
              <div className="text-base font-semibold text-green-600 dark:text-green-400 flex items-center">
                <Circle className="w-2 h-2 fill-green-500 text-green-500 mr-2 animate-pulse" />
                {MOCK_STATS.activeConversations} conversations
              </div>
            </div>
            
            <div className="h-8 w-px bg-border" />
            
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Messages Today</div>
              <div className="text-base font-semibold text-primary flex items-center">
                <MessageSquare className="w-3 h-3 mr-2" />
                {formatNumber(MOCK_STATS.totalMessages)}
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="dashboard-card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-base font-bold text-foreground">
                {formatNumber(MOCK_STATS.totalMessages)}
              </div>
              <div className="text-xs text-muted-foreground">Total Messages</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-base font-bold text-foreground">
                {MOCK_STATS.activeConversations}
              </div>
              <div className="text-xs text-muted-foreground">Active Chats</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="text-base font-bold text-foreground">
                {MOCK_STATS.pendingNotifications}
              </div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Megaphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-base font-bold text-foreground">
                {MOCK_STATS.broadcastsSent}
              </div>
              <div className="text-xs text-muted-foreground">Broadcasts</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-base font-bold text-foreground">
                {MOCK_STATS.responseRate}%
              </div>
              <div className="text-xs text-muted-foreground">Response Rate</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-base font-bold text-foreground">
                {MOCK_STATS.avgResponseTime}
              </div>
              <div className="text-xs text-muted-foreground">Avg Response</div>
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
              <MockRealTimeMessaging />
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
