/**
 * Smart Tourist Safety System - Notification Management
 * Component for managing system notifications, alerts, and announcements
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellOff,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
  Settings,
  Filter,
  Search,
  MoreHorizontal,
  Clock,
  MapPin,
  User,
  Shield,
  Heart,
  Trash2,
  Archive,
  Star,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  MessageSquare,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Notification {
  id: string;
  type: 'emergency' | 'alert' | 'info' | 'warning' | 'success' | 'system';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  category: 'safety' | 'location' | 'communication' | 'system' | 'tourist' | 'emergency';
  sourceId?: string;
  sourceName?: string;
  targetUsers?: string[];
  isRead: boolean;
  isArchived: boolean;
  isPinned: boolean;
  requiresAction: boolean;
  actionUrl?: string;
  actionLabel?: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  metadata?: Record<string, any>;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
}

interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  soundEnabled: boolean;
  emergencyAlerts: boolean;
  locationAlerts: boolean;
  systemUpdates: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  categories: {
    [key: string]: boolean;
  };
}

interface NotificationManagementProps {
  onNotificationAction?: (notification: Notification, action: string) => void;
  onPreferencesUpdate?: (preferences: NotificationPreferences) => void;
  className?: string;
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const NOTIFICATION_TYPES = [
  { value: 'emergency', label: 'Emergency', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' },
  { value: 'alert', label: 'Alert', icon: Bell, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20' },
  { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
  { value: 'info', label: 'Information', icon: Info, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
  { value: 'success', label: 'Success', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' },
  { value: 'system', label: 'System', icon: Settings, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-700' },
];

const NOTIFICATION_CATEGORIES = [
  { value: 'all', label: 'All Notifications', icon: Bell },
  { value: 'emergency', label: 'Emergency', icon: Heart },
  { value: 'safety', label: 'Safety', icon: Shield },
  { value: 'location', label: 'Location', icon: MapPin },
  { value: 'communication', label: 'Communication', icon: MessageSquare },
  { value: 'tourist', label: 'Tourist Services', icon: User },
  { value: 'system', label: 'System', icon: Settings },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    type: 'emergency',
    priority: 'critical',
    title: 'Emergency Alert: Tourist in Distress',
    message: 'Tourist Raj Kumar has triggered an emergency alert near Red Fort. Immediate assistance required.',
    category: 'emergency',
    sourceId: 'tourist-001',
    sourceName: 'Raj Kumar',
    targetUsers: ['officer-001', 'emergency-001'],
    isRead: false,
    isArchived: false,
    isPinned: true,
    requiresAction: true,
    actionUrl: '/dashboard/alerts/emergency-001',
    actionLabel: 'Respond to Emergency',
    location: {
      latitude: 28.6562,
      longitude: 77.2410,
      address: 'Red Fort, New Delhi, Delhi 110006',
    },
    createdAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'notif-002',
    type: 'alert',
    priority: 'high',
    title: 'Geofence Violation Alert',
    message: 'Tourist Alex Johnson has entered a restricted area near Parliament House.',
    category: 'safety',
    sourceId: 'geofence-003',
    sourceName: 'Parliament Restricted Zone',
    isRead: false,
    isArchived: false,
    isPinned: false,
    requiresAction: true,
    actionUrl: '/dashboard/location/geofences',
    actionLabel: 'View Location',
    location: {
      latitude: 28.6170,
      longitude: 77.2090,
      address: 'Parliament House, New Delhi, Delhi 110001',
    },
    createdAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'notif-003',
    type: 'info',
    priority: 'medium',
    title: 'New Tourist Registration',
    message: 'Sarah Wilson has successfully registered for tourist safety services.',
    category: 'tourist',
    sourceId: 'tourist-004',
    sourceName: 'Sarah Wilson',
    isRead: true,
    isArchived: false,
    isPinned: false,
    requiresAction: false,
    createdAt: new Date(Date.now() - 1200000).toISOString(),
    readAt: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: 'notif-004',
    type: 'warning',
    priority: 'medium',
    title: 'Weather Alert: Heavy Rain Expected',
    message: 'Heavy rainfall predicted in Delhi NCR region. Tourist activities may be affected.',
    category: 'safety',
    isRead: true,
    isArchived: false,
    isPinned: false,
    requiresAction: false,
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    readAt: new Date(Date.now() - 1500000).toISOString(),
  },
  {
    id: 'notif-005',
    type: 'success',
    priority: 'low',
    title: 'Alert Resolved Successfully',
    message: 'Medical emergency alert for Priya Sharma has been resolved. Tourist is safe.',
    category: 'emergency',
    sourceId: 'alert-002',
    sourceName: 'Medical Emergency Response',
    isRead: true,
    isArchived: false,
    isPinned: false,
    requiresAction: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    readAt: new Date(Date.now() - 3300000).toISOString(),
  },
  {
    id: 'notif-006',
    type: 'system',
    priority: 'low',
    title: 'System Maintenance Scheduled',
    message: 'Scheduled maintenance will occur on Sunday 2:00 AM - 4:00 AM. Services may be temporarily unavailable.',
    category: 'system',
    isRead: false,
    isArchived: false,
    isPinned: false,
    requiresAction: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

const MOCK_PREFERENCES: NotificationPreferences = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
  soundEnabled: true,
  emergencyAlerts: true,
  locationAlerts: true,
  systemUpdates: false,
  quietHours: {
    enabled: true,
    startTime: '22:00',
    endTime: '06:00',
  },
  categories: {
    emergency: true,
    safety: true,
    location: true,
    communication: true,
    tourist: false,
    system: false,
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function NotificationManagement({
  onNotificationAction,
  onPreferencesUpdate,
  className,
}: NotificationManagementProps) {
  const { hasPermission } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [preferences, setPreferences] = useState<NotificationPreferences>(MOCK_PREFERENCES);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesCategory = selectedCategory === 'all' || notification.category === selectedCategory;
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUnread = !showUnreadOnly || !notification.isRead;
    const notArchived = !notification.isArchived;
    
    return matchesCategory && matchesType && matchesSearch && matchesUnread && notArchived;
  });

  // Sort notifications (pinned first, then by created date)
  const sortedNotifications = filteredNotifications.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Get unread count
  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;

  // Handle notification action
  const handleNotificationAction = (notification: Notification, action: string) => {
    switch (action) {
      case 'mark_read':
        setNotifications(prev => prev.map(n => 
          n.id === notification.id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
        ));
        break;
      case 'mark_unread':
        setNotifications(prev => prev.map(n => 
          n.id === notification.id ? { ...n, isRead: false, readAt: undefined } : n
        ));
        break;
      case 'pin':
        setNotifications(prev => prev.map(n => 
          n.id === notification.id ? { ...n, isPinned: true } : n
        ));
        break;
      case 'unpin':
        setNotifications(prev => prev.map(n => 
          n.id === notification.id ? { ...n, isPinned: false } : n
        ));
        break;
      case 'archive':
        setNotifications(prev => prev.map(n => 
          n.id === notification.id ? { ...n, isArchived: true } : n
        ));
        break;
      case 'delete':
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
        break;
    }
    
    onNotificationAction?.(notification, action);
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    selectedNotifications.forEach(notificationId => {
      const notification = notifications.find(n => n.id === notificationId);
      if (notification) {
        handleNotificationAction(notification, action);
      }
    });
    setSelectedNotifications([]);
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ 
      ...n, 
      isRead: true, 
      readAt: n.readAt || new Date().toISOString() 
    })));
  };

  // Update preferences
  const updatePreferences = (newPreferences: NotificationPreferences) => {
    setPreferences(newPreferences);
    onPreferencesUpdate?.(newPreferences);
  };

  // Get notification type info
  const getTypeInfo = (type: string) => {
    return NOTIFICATION_TYPES.find(t => t.value === type) || NOTIFICATION_TYPES[0];
  };

  // Format time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500 bg-red-50 dark:bg-red-900/10';
      case 'high': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/10';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
      case 'low': return 'border-l-green-500 bg-green-50 dark:bg-green-900/10';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/10';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-600 text-white text-sm px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage system notifications, alerts, and announcements
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </button>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {NOTIFICATION_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.value;
              
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm rounded-full transition-colors',
                    isSelected
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  )}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* Additional Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                {NOTIFICATION_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                className={cn(
                  'flex items-center px-3 py-2 text-sm rounded-md',
                  showUnreadOnly
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                {showUnreadOnly ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                Unread Only
              </button>
            </div>

            {selectedNotifications.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedNotifications.length} selected
                </span>
                <button
                  onClick={() => handleBulkAction('mark_read')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Mark Read
                </button>
                <button
                  onClick={() => handleBulkAction('archive')}
                  className="text-sm text-gray-600 hover:text-gray-700"
                >
                  Archive
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {sortedNotifications.map((notification) => {
          const typeInfo = getTypeInfo(notification.type);
          const Icon = typeInfo.icon;
          const isSelected = selectedNotifications.includes(notification.id);
          
          return (
            <div
              key={notification.id}
              className={cn(
                'bg-white dark:bg-gray-800 rounded-lg shadow border-l-4 transition-all',
                getPriorityColor(notification.priority),
                !notification.isRead && 'ring-1 ring-blue-200 dark:ring-blue-800',
                isSelected && 'ring-2 ring-blue-500'
              )}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedNotifications(prev => [...prev, notification.id]);
                        } else {
                          setSelectedNotifications(prev => prev.filter(id => id !== notification.id));
                        }
                      }}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    
                    <div className={cn('p-2 rounded-full', typeInfo.bg)}>
                      <Icon className={cn('h-5 w-5', typeInfo.color)} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className={cn(
                          'text-lg font-medium',
                          notification.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'
                        )}>
                          {notification.title}
                        </h3>
                        
                        {notification.isPinned && (
                          <Star className="h-4 w-4 text-yellow-500" />
                        )}
                        
                        <span className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          notification.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                          notification.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                          notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        )}>
                          {notification.priority}
                        </span>
                      </div>
                      
                      <p className={cn(
                        'text-sm mb-3',
                        notification.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'
                      )}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTime(notification.createdAt)}
                        </div>
                        
                        {notification.sourceName && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {notification.sourceName}
                          </div>
                        )}
                        
                        {notification.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            Location shared
                          </div>
                        )}
                        
                        {notification.expiresAt && (
                          <div className="flex items-center text-orange-600">
                            <Clock className="h-4 w-4 mr-1" />
                            Expires {formatTime(notification.expiresAt)}
                          </div>
                        )}
                      </div>
                      
                      {notification.requiresAction && notification.actionLabel && (
                        <div className="mt-3">
                          <button className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                            {notification.actionLabel}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-4">
                    <button
                      onClick={() => handleNotificationAction(notification, notification.isRead ? 'mark_unread' : 'mark_read')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title={notification.isRead ? 'Mark as unread' : 'Mark as read'}
                    >
                      {notification.isRead ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                    </button>
                    
                    <button
                      onClick={() => handleNotificationAction(notification, notification.isPinned ? 'unpin' : 'pin')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title={notification.isPinned ? 'Unpin' : 'Pin'}
                    >
                      <Star className={cn('h-4 w-4', notification.isPinned ? 'text-yellow-500' : '')} />
                    </button>
                    
                    <button
                      onClick={() => handleNotificationAction(notification, 'archive')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Archive"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleNotificationAction(notification, 'delete')}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {sortedNotifications.length === 0 && (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow text-center">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Notifications Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || selectedCategory !== 'all' || showUnreadOnly
              ? 'No notifications match your current filters.'
              : 'You\'re all caught up! No new notifications.'}
          </p>
        </div>
      )}

      {/* Notification Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Notification Preferences
                </h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Delivery Methods */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Delivery Methods
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-blue-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Push Notifications
                        </span>
                      </div>
                      <button
                        onClick={() => updatePreferences({
                          ...preferences,
                          pushNotifications: !preferences.pushNotifications
                        })}
                        className={cn(
                          'relative inline-flex h-5 w-9 rounded-full transition-colors',
                          preferences.pushNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            preferences.pushNotifications ? 'translate-x-4' : 'translate-x-0.5'
                          )}
                          style={{ marginTop: '2px' }}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Email Notifications
                        </span>
                      </div>
                      <button
                        onClick={() => updatePreferences({
                          ...preferences,
                          emailNotifications: !preferences.emailNotifications
                        })}
                        className={cn(
                          'relative inline-flex h-5 w-9 rounded-full transition-colors',
                          preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            preferences.emailNotifications ? 'translate-x-4' : 'translate-x-0.5'
                          )}
                          style={{ marginTop: '2px' }}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {preferences.soundEnabled ? (
                          <Volume2 className="h-5 w-5 text-purple-600" />
                        ) : (
                          <VolumeX className="h-5 w-5 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Sound Alerts
                        </span>
                      </div>
                      <button
                        onClick={() => updatePreferences({
                          ...preferences,
                          soundEnabled: !preferences.soundEnabled
                        })}
                        className={cn(
                          'relative inline-flex h-5 w-9 rounded-full transition-colors',
                          preferences.soundEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            preferences.soundEnabled ? 'translate-x-4' : 'translate-x-0.5'
                          )}
                          style={{ marginTop: '2px' }}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notification Categories */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Notification Categories
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(preferences.categories).map(([category, enabled]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {category.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => updatePreferences({
                            ...preferences,
                            categories: {
                              ...preferences.categories,
                              [category]: !enabled
                            }
                          })}
                          className={cn(
                            'relative inline-flex h-5 w-9 rounded-full transition-colors',
                            enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          )}
                        >
                          <span
                            className={cn(
                              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                              enabled ? 'translate-x-4' : 'translate-x-0.5'
                            )}
                            style={{ marginTop: '2px' }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quiet Hours */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Quiet Hours
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Enable Quiet Hours
                      </span>
                      <button
                        onClick={() => updatePreferences({
                          ...preferences,
                          quietHours: {
                            ...preferences.quietHours,
                            enabled: !preferences.quietHours.enabled
                          }
                        })}
                        className={cn(
                          'relative inline-flex h-5 w-9 rounded-full transition-colors',
                          preferences.quietHours.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            preferences.quietHours.enabled ? 'translate-x-4' : 'translate-x-0.5'
                          )}
                          style={{ marginTop: '2px' }}
                        />
                      </button>
                    </div>

                    {preferences.quietHours.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-700 dark:text-gray-300">Start Time</label>
                          <input
                            type="time"
                            value={preferences.quietHours.startTime}
                            onChange={(e) => updatePreferences({
                              ...preferences,
                              quietHours: {
                                ...preferences.quietHours,
                                startTime: e.target.value
                              }
                            })}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-700 dark:text-gray-300">End Time</label>
                          <input
                            type="time"
                            value={preferences.quietHours.endTime}
                            onChange={(e) => updatePreferences({
                              ...preferences,
                              quietHours: {
                                ...preferences.quietHours,
                                endTime: e.target.value
                              }
                            })}
                            className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationManagement;
