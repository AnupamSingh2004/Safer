/**
 * Smart Tourist Safety System - Notification Center
 * Real-time notification display with priority sorting and action buttons
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellRing,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
  Eye,
  EyeOff,
  Filter,
  Settings,
  Volume2,
  VolumeX,
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Trash2,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'safety' | 'info' | 'warning' | 'success';
  priority: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'unread' | 'read' | 'archived';
  channel: 'push' | 'sms' | 'email' | 'system';
  timestamp: string;
  location?: {
    name: string;
    coordinates: [number, number];
  };
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
  alertId?: string;
  touristId?: string;
  category: 'alert' | 'system' | 'broadcast' | 'personal';
  expiresAt?: string;
  attachments?: string[];
}

interface NotificationAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  action: 'acknowledge' | 'dismiss' | 'escalate' | 'navigate' | 'contact' | 'view_details';
  icon?: React.ReactNode;
  payload?: Record<string, any>;
}

interface NotificationCenterProps {
  className?: string;
  maxHeight?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  autoRefresh?: boolean;
  onNotificationAction?: (notificationId: string, action: string, payload?: any) => void;
  onNotificationRead?: (notificationId: string) => void;
  onNotificationDelete?: (notificationId: string) => void;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockNotifications: NotificationData[] = [
  {
    id: 'notif_001',
    title: 'EMERGENCY: Tourist Missing',
    message: 'Tourist John Doe (ID: T001) has not checked in for 6 hours. Last known location: Khasi Hills.',
    type: 'emergency',
    priority: 'critical',
    status: 'unread',
    channel: 'system',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    location: {
      name: 'Khasi Hills, Meghalaya',
      coordinates: [25.5788, 91.8933]
    },
    category: 'alert',
    alertId: 'alert_001',
    touristId: 'T001',
    actions: [
      {
        id: 'action_1',
        label: 'Launch Search',
        type: 'primary',
        action: 'escalate',
        icon: <Bell className="w-4 h-4" />,
        payload: { type: 'search_operation' }
      },
      {
        id: 'action_2',
        label: 'Contact Emergency',
        type: 'danger',
        action: 'contact',
        icon: <Phone className="w-4 h-4" />,
        payload: { contact_type: 'emergency' }
      },
      {
        id: 'action_3',
        label: 'View Location',
        type: 'secondary',
        action: 'navigate',
        icon: <MapPin className="w-4 h-4" />,
        payload: { coordinates: [25.5788, 91.8933] }
      }
    ]
  },
  {
    id: 'notif_002',
    title: 'Weather Alert: Heavy Rainfall',
    message: 'Heavy rainfall expected in Cherrapunji area. Tourists advised to avoid outdoor activities.',
    type: 'warning',
    priority: 'high',
    status: 'unread',
    channel: 'system',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    location: {
      name: 'Cherrapunji, Meghalaya',
      coordinates: [25.2697, 91.7337]
    },
    category: 'alert',
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    actions: [
      {
        id: 'action_4',
        label: 'Broadcast Warning',
        type: 'primary',
        action: 'escalate',
        icon: <MessageSquare className="w-4 h-4" />
      },
      {
        id: 'action_5',
        label: 'View Affected Area',
        type: 'secondary',
        action: 'navigate',
        icon: <MapPin className="w-4 h-4" />
      }
    ]
  },
  {
    id: 'notif_003',
    title: 'Tourist Check-in Confirmed',
    message: 'Tourist Sarah Wilson has successfully checked in at Umiam Lake resort.',
    type: 'success',
    priority: 'medium',
    status: 'unread',
    channel: 'system',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    location: {
      name: 'Umiam Lake, Meghalaya',
      coordinates: [25.6647, 91.9059]
    },
    category: 'alert',
    touristId: 'T002',
    actions: [
      {
        id: 'action_6',
        label: 'View Profile',
        type: 'secondary',
        action: 'view_details',
        icon: <Eye className="w-4 h-4" />
      }
    ]
  },
  {
    id: 'notif_004',
    title: 'System Maintenance Notice',
    message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM. Some features may be unavailable.',
    type: 'info',
    priority: 'low',
    status: 'read',
    channel: 'system',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: 'system',
    actions: [
      {
        id: 'action_7',
        label: 'Learn More',
        type: 'secondary',
        action: 'view_details',
        icon: <ExternalLink className="w-4 h-4" />
      }
    ]
  },
  {
    id: 'notif_005',
    title: 'Emergency Broadcast Sent',
    message: 'Emergency broadcast "Flash Flood Warning" successfully sent to 247 tourists in affected areas.',
    type: 'info',
    priority: 'medium',
    status: 'read',
    channel: 'system',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    category: 'broadcast',
    metadata: {
      broadcastId: 'broadcast_001',
      recipientCount: 247,
      deliveryRate: 0.96
    },
    actions: [
      {
        id: 'action_8',
        label: 'View Report',
        type: 'secondary',
        action: 'view_details',
        icon: <Eye className="w-4 h-4" />
      }
    ]
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  className = '',
  maxHeight = '600px',
  showFilters = true,
  showSearch = true,
  autoRefresh = true,
  onNotificationAction,
  onNotificationRead,
  onNotificationDelete
}) => {
  // State management
  const [notifications, setNotifications] = useState<NotificationData[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      const matchesSearch = searchQuery === '' || 
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === 'all' || notification.type === selectedType;
      const matchesPriority = selectedPriority === 'all' || notification.priority === selectedPriority;
      const matchesStatus = selectedStatus === 'all' || notification.status === selectedStatus;

      return matchesSearch && matchesType && matchesPriority && matchesStatus;
    });
  }, [notifications, searchQuery, selectedType, selectedPriority, selectedStatus]);

  // Grouped notifications by priority
  const groupedNotifications = useMemo(() => {
    const groups = {
      critical: filteredNotifications.filter(n => n.priority === 'critical'),
      high: filteredNotifications.filter(n => n.priority === 'high'),
      medium: filteredNotifications.filter(n => n.priority === 'medium'),
      low: filteredNotifications.filter(n => n.priority === 'low'),
      info: filteredNotifications.filter(n => n.priority === 'info')
    };

    return groups;
  }, [filteredNotifications]);

  // Unread count
  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================

  const handleNotificationAction = async (notificationId: string, action: NotificationAction) => {
    try {
      if (onNotificationAction) {
        await onNotificationAction(notificationId, action.action, action.payload);
      }

      // Play sound if enabled
      if (soundEnabled && action.type === 'primary') {
        playNotificationSound();
      }

      // Auto-mark as read for certain actions
      if (['acknowledge', 'escalate', 'view_details'].includes(action.action)) {
        handleMarkAsRead(notificationId);
      }

    } catch (error) {
      console.error('Failed to handle notification action:', error);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, status: 'read' as const }
          : notification
      )
    );

    if (onNotificationRead) {
      onNotificationRead(notificationId);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, status: 'read' as const }))
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    
    if (onNotificationDelete) {
      onNotificationDelete(notificationId);
    }
  };

  const handleToggleExpanded = (notificationId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In real implementation, fetch fresh notifications here
    
    setIsRefreshing(false);
  };

  const playNotificationSound = () => {
    // Simple beep sound simulation
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  // ========================================================================
  // HELPER FUNCTIONS
  // ========================================================================

  const getNotificationIcon = (type: string, priority: string) => {
    if (priority === 'critical') {
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
    
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'info':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // ========================================================================
  // RENDER FUNCTIONS
  // ========================================================================

  const renderNotificationItem = (notification: NotificationData) => {
    const isExpanded = expandedItems.has(notification.id);
    const isUnread = notification.status === 'unread';

    return (
      <motion.div
        key={notification.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className={`
          border rounded-lg bg-white hover:shadow-md transition-all duration-200
          ${isUnread ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : 'border-gray-200'}
        `}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start space-x-3 flex-1">
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type, notification.priority)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className={`text-sm font-medium truncate ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                    {notification.title}
                  </h4>
                  <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                    {notification.priority}
                  </Badge>
                  {isUnread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                  )}
                </div>
                
                <p className={`text-sm ${isUnread ? 'text-gray-600' : 'text-gray-500'} ${!isExpanded ? 'line-clamp-2' : ''}`}>
                  {notification.message}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 ml-4">
              <Button
                variant="ghost"
                size="sm"
                title={formatTimeAgo(notification.timestamp)}
                className="text-xs text-gray-500 hover:text-gray-700 p-1 h-auto"
              >
                <Clock className="w-3 h-3 mr-1" />
                {formatTimeAgo(notification.timestamp)}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleExpanded(notification.id)}
                className="p-1 h-auto"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteNotification(notification.id)}
                className="p-1 h-auto text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Metadata */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-2"
            >
              {notification.location && (
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  {notification.location.name}
                </div>
              )}

              {notification.metadata && (
                <div className="text-xs text-gray-500">
                  {Object.entries(notification.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace('_', ' ')}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Actions */}
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              {notification.actions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.type === 'primary' ? 'default' : action.type === 'danger' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => handleNotificationAction(notification.id, action)}
                  className="text-xs"
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
              
              {isUnread && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Mark Read
                </Button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderNotificationGroup = (title: string, notifications: NotificationData[], priority: string) => {
    if (notifications.length === 0) return null;

    return (
      <div key={priority} className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${priority === 'critical' ? 'bg-red-500' : priority === 'high' ? 'bg-orange-500' : priority === 'medium' ? 'bg-yellow-500' : priority === 'low' ? 'bg-blue-500' : 'bg-gray-500'}`} />
            {title} ({notifications.length})
          </h3>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence>
            {notifications.map(renderNotificationItem)}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  // ========================================================================
  // MAIN RENDER
  // ========================================================================

  return (
    <Card className={`notification-center ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <BellRing className="w-5 h-5 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Disable sounds' : 'Enable sounds'}
              className="p-2"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh notifications"
              className="p-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>

            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        {(showSearch || showFilters) && (
          <div className="space-y-3 mt-4">
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}

            {showFilters && (
              <div className="flex space-x-2">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="text-xs border border-gray-200 rounded px-2 py-1"
                >
                  <option value="all">All Types</option>
                  <option value="emergency">Emergency</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="info">Info</option>
                </select>

                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="text-xs border border-gray-200 rounded px-2 py-1"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="info">Info</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="text-xs border border-gray-200 rounded px-2 py-1"
                >
                  <option value="all">All Status</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div 
          className="overflow-y-auto px-6 pb-6" 
          style={{ maxHeight }}
        >
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm">No notifications found</p>
              {searchQuery && (
                <p className="text-xs mt-1">Try adjusting your search or filters</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {renderNotificationGroup('Critical', groupedNotifications.critical, 'critical')}
              {renderNotificationGroup('High Priority', groupedNotifications.high, 'high')}
              {renderNotificationGroup('Medium Priority', groupedNotifications.medium, 'medium')}
              {renderNotificationGroup('Low Priority', groupedNotifications.low, 'low')}
              {renderNotificationGroup('Information', groupedNotifications.info, 'info')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;