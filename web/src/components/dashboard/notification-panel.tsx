/**
 * Smart Tourist Safety System - Notification Panel
 * Real-time notifications and alerts panel
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  Settings,
  Users,
  MapPin,
  Clock,
  Filter,
  MoreVertical,
  Trash2,
  Archive,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';
import { useAuth, usePermissions } from '@/hooks/use-auth';

// ============================================================================
// TYPES
// ============================================================================

export interface Notification {
  id: string;
  type: 'emergency' | 'alert' | 'system' | 'info';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  href?: string;
  userId?: string;
  metadata?: {
    touristId?: string;
    zoneId?: string;
    alertId?: string;
    location?: string;
    [key: string]: any;
  };
}

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'emergency',
    severity: 'critical',
    title: 'Emergency Alert',
    message: 'Tourist reported missing in Connaught Place area. Immediate response required.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
    href: '/dashboard/alerts/emergency/EMG001',
    metadata: {
      touristId: 'TST001',
      location: 'Connaught Place',
      alertId: 'EMG001',
    },
  },
  {
    id: '2',
    type: 'alert',
    severity: 'high',
    title: 'Safety Warning',
    message: 'Heavy traffic and crowds reported in Red Fort area. Tourists advised to avoid.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    read: false,
    href: '/dashboard/alerts/ALT002',
    metadata: {
      zoneId: 'RF001',
      location: 'Red Fort',
      alertId: 'ALT002',
    },
  },
  {
    id: '3',
    type: 'info',
    severity: 'medium',
    title: 'Tourist Check-in',
    message: 'New tourist registered: John Smith from USA checked into India Gate zone.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false,
    href: '/dashboard/tourists/TST002',
    metadata: {
      touristId: 'TST002',
      zoneId: 'IG001',
      location: 'India Gate',
    },
  },
  {
    id: '4',
    type: 'system',
    severity: 'low',
    title: 'System Update',
    message: 'New features available in mobile app v2.1.0. Enhanced location tracking enabled.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
    metadata: {
      version: '2.1.0',
    },
  },
  {
    id: '5',
    type: 'alert',
    severity: 'medium',
    title: 'Zone Capacity Warning',
    message: 'Lotus Temple zone approaching capacity limit (85%). Consider redirecting tourists.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    read: true,
    href: '/dashboard/zones/LT001',
    metadata: {
      zoneId: 'LT001',
      capacity: 85,
      location: 'Lotus Temple',
    },
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  
  // State
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'emergency' | 'alerts'>('all');
  const [showActions, setShowActions] = useState<string | null>(null);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'emergency':
        return notification.type === 'emergency';
      case 'alerts':
        return notification.type === 'alert' || notification.type === 'emergency';
      default:
        return true;
    }
  });

  // Get notification icon
  const getNotificationIcon = (type: Notification['type'], severity: Notification['severity']) => {
    switch (type) {
      case 'emergency':
        return AlertTriangle;
      case 'alert':
        return Bell;
      case 'system':
        return Settings;
      case 'info':
        return Info;
      default:
        return Bell;
    }
  };

  // Get notification colors
  const getNotificationColors = (type: Notification['type'], severity: Notification['severity']) => {
    if (type === 'emergency' || severity === 'critical') {
      return {
        icon: 'text-red-500',
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
      };
    }
    
    if (type === 'alert' || severity === 'high') {
      return {
        icon: 'text-orange-500',
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-800',
      };
    }
    
    if (severity === 'medium') {
      return {
        icon: 'text-yellow-500',
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
      };
    }
    
    return {
      icon: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
    };
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    setShowActions(null);
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.href) {
      window.location.href = notification.href;
    }
    
    onClose();
  };

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out z-50',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2 p-4 border-b border-gray-200 dark:border-gray-700">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="emergency">Emergency</option>
              <option value="alerts">Alerts</option>
            </select>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications list */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No notifications to display
                </p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {filteredNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type, notification.severity);
                  const colors = getNotificationColors(notification.type, notification.severity);
                  
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        'relative p-4 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50',
                        notification.read
                          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                          : colors.bg + ' ' + colors.border
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start">
                        <div className={cn('flex-shrink-0 mr-3 mt-0.5', colors.icon)}>
                          <Icon className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h3 className={cn(
                              'text-sm font-medium truncate',
                              notification.read 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-900 dark:text-white'
                            )}>
                              {notification.title}
                            </h3>
                            
                            <div className="flex items-center ml-2">
                              {!notification.read && (
                                <div className="h-2 w-2 bg-primary rounded-full mr-2" />
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowActions(
                                    showActions === notification.id ? null : notification.id
                                  );
                                }}
                                className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          <p className={cn(
                            'mt-1 text-sm',
                            notification.read 
                              ? 'text-gray-600 dark:text-gray-400' 
                              : 'text-gray-700 dark:text-gray-300'
                          )}>
                            {notification.message}
                          </p>
                          
                          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatRelativeTime(notification.timestamp)}
                            {notification.metadata?.location && (
                              <>
                                <MapPin className="h-3 w-3 ml-3 mr-1" />
                                {notification.metadata.location}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions dropdown */}
                      {showActions === notification.id && (
                        <div className="absolute top-12 right-4 w-32 bg-white dark:bg-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                  setShowActions(null);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Mark read
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <a
              href="/dashboard/notifications"
              className="block w-full text-center text-sm text-primary hover:text-primary/80 font-medium"
              onClick={onClose}
            >
              View all notifications
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotificationPanel;
