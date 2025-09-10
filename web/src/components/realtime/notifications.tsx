/**
 * Smart Tourist Safety System - Real-time Notifications Component
 * Live notification system for alerts, updates, and system events
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  Users,
  MapPin,
  Activity,
  Clock
} from 'lucide-react';
import { useRealTimeDashboard } from '@/hooks/use-realtime';

// ============================================================================
// NOTIFICATION INTERFACES
// ============================================================================

interface Notification {
  id: string;
  type: 'alert' | 'tourist' | 'incident' | 'system' | 'info';
  title: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================================================
// SIMPLE UI COMPONENTS
// ============================================================================

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>
);

const Button = ({ 
  children, 
  onClick, 
  variant = 'default',
  size = 'sm',
  className = ''
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default';
  className?: string;
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
    ghost: 'hover:bg-gray-100'
  };
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    default: 'h-10 px-4 py-2'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// ============================================================================
// NOTIFICATION ITEM COMPONENT
// ============================================================================

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem = ({ notification, onDismiss, onMarkAsRead }: NotificationItemProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5" />;
      case 'tourist':
        return <Users className="h-5 w-5" />;
      case 'incident':
        return <XCircle className="h-5 w-5" />;
      case 'system':
        return <Activity className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getIconColor = () => {
    switch (notification.severity) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getBadgeVariant = () => {
    switch (notification.severity) {
      case 'critical':
        return 'danger';
      case 'high':
        return 'warning';
      case 'medium':
        return 'warning';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className={`p-4 border-l-4 ${
      notification.severity === 'critical' ? 'border-red-500 bg-red-50' :
      notification.severity === 'high' ? 'border-orange-500 bg-orange-50' :
      notification.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
      'border-blue-500 bg-blue-50'
    } ${!notification.read ? 'ring-2 ring-blue-200' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${getIconColor()}`}>
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
              <Badge variant={getBadgeVariant()}>
                {notification.severity}
              </Badge>
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
            <div className="flex items-center text-xs text-gray-500 space-x-4">
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(notification.timestamp).toLocaleTimeString()}
              </span>
              <span className="capitalize">{notification.type}</span>
            </div>
            {notification.action && (
              <div className="mt-3">
                <Button
                  onClick={notification.action.onClick}
                  variant="outline"
                  size="sm"
                >
                  {notification.action.label}
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-4">
          {!notification.read && (
            <Button
              onClick={() => onMarkAsRead(notification.id)}
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
            >
              Mark as read
            </Button>
          )}
          <Button
            onClick={() => onDismiss(notification.id)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// NOTIFICATION PANEL COMPONENT
// ============================================================================

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

const NotificationPanel = ({ 
  isOpen, 
  onClose, 
  notifications, 
  onDismiss, 
  onMarkAsRead, 
  onClearAll 
}: NotificationPanelProps) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute top-full right-0 mt-2 w-96 max-h-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 text-sm text-blue-600">({unreadCount} unread)</span>
            )}
          </h3>
          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <Button onClick={onClearAll} variant="ghost" size="sm">
                Clear All
              </Button>
            )}
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onDismiss={onDismiss}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN NOTIFICATIONS COMPONENT
// ============================================================================

export default function RealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Real-time data
  const {
    newAlert,
    touristUpdates,
    incidents,
    criticalIncidents,
    systemHealth,
    connected,
    markAlertAsRead
  } = useRealTimeDashboard();

  // ============================================================================
  // NOTIFICATION PROCESSING
  // ============================================================================

  // Process new alerts
  useEffect(() => {
    if (!newAlert) return;

    const notification: Notification = {
      id: `alert-${newAlert.id}-${Date.now()}`,
      type: 'alert',
      title: 'New Safety Alert',
      message: newAlert.message || newAlert.title,
      timestamp: newAlert.timestamp,
      severity: newAlert.severity || 'medium',
      read: false,
      action: {
        label: 'View Alert',
        onClick: () => {
          markAlertAsRead(newAlert.id);
          // Navigate to alerts page or show alert details
          console.log('Navigate to alert:', newAlert.id);
        }
      }
    };

    addNotification(notification);
  }, [newAlert, markAlertAsRead]);

  // Process tourist updates
  useEffect(() => {
    if (!touristUpdates.length) return;

    const latestUpdate = touristUpdates[0];
    if (latestUpdate.action === 'emergency') {
      const notification: Notification = {
        id: `tourist-emergency-${latestUpdate.id}-${Date.now()}`,
        type: 'tourist',
        title: 'Tourist Emergency',
        message: `Emergency reported by tourist ${latestUpdate.touristId} at ${latestUpdate.location}`,
        timestamp: latestUpdate.timestamp,
        severity: 'critical',
        read: false,
        action: {
          label: 'Respond',
          onClick: () => {
            // Navigate to emergency response
            console.log('Respond to emergency:', latestUpdate.id);
          }
        }
      };

      addNotification(notification);
    }
  }, [touristUpdates]);

  // Process critical incidents
  useEffect(() => {
    if (!criticalIncidents.length) return;

    const latestIncident = criticalIncidents[0];
    const notification: Notification = {
      id: `incident-${latestIncident.id}-${Date.now()}`,
      type: 'incident',
      title: 'Critical Incident Reported',
      message: `${latestIncident.type} incident at ${latestIncident.location}`,
      timestamp: latestIncident.timestamp,
      severity: 'critical',
      read: false,
      action: {
        label: 'View Incident',
        onClick: () => {
          // Navigate to incident details
          console.log('View incident:', latestIncident.id);
        }
      }
    };

    addNotification(notification);
  }, [criticalIncidents]);

  // Process system health updates
  useEffect(() => {
    if (!systemHealth.lastUpdate) return;

    // Only notify on warnings or errors
    if (systemHealth.overall !== 'healthy') {
      const notification: Notification = {
        id: `system-${Date.now()}`,
        type: 'system',
        title: 'System Health Alert',
        message: `System status: ${systemHealth.overall}`,
        timestamp: systemHealth.lastUpdate,
        severity: systemHealth.overall === 'critical' ? 'critical' : 'medium',
        read: false
      };

      addNotification(notification);
    }
  }, [systemHealth]);

  // ============================================================================
  // NOTIFICATION MANAGEMENT
  // ============================================================================

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep last 50

    // Play sound for high/critical notifications
    if (soundEnabled && (notification.severity === 'high' || notification.severity === 'critical')) {
      playNotificationSound();
    }

    // Auto-open panel for critical notifications
    if (notification.severity === 'critical') {
      setIsOpen(true);
    }
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const playNotificationSound = () => {
    // Simple audio notification (you could replace with actual sound file)
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio notification not supported');
    }
  };

  // ============================================================================
  // RENDER COMPONENT
  // ============================================================================

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        className="relative p-2"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Connection Status Indicator */}
      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
        connected ? 'bg-green-400' : 'bg-red-400'
      }`} title={connected ? 'Connected' : 'Disconnected'} />

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        onDismiss={dismissNotification}
        onMarkAsRead={markAsRead}
        onClearAll={clearAllNotifications}
      />

      {/* Sound Toggle (could be moved to settings) */}
      <div className="absolute top-full right-0 mt-1">
        <Button
          onClick={() => setSoundEnabled(!soundEnabled)}
          variant="ghost"
          size="sm"
          className="text-xs"
        >
          🔊 {soundEnabled ? 'ON' : 'OFF'}
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// TOAST NOTIFICATIONS COMPONENT
// ============================================================================

export function ToastNotifications() {
  const [toasts, setToasts] = useState<Notification[]>([]);
  const { newAlert, criticalIncidents } = useRealTimeDashboard();

  // Add critical notifications as toasts
  useEffect(() => {
    if (newAlert && newAlert.severity === 'critical') {
      const toast: Notification = {
        id: `toast-${newAlert.id}-${Date.now()}`,
        type: 'alert',
        title: 'Critical Alert',
        message: newAlert.message,
        timestamp: newAlert.timestamp,
        severity: 'critical',
        read: false
      };

      setToasts(prev => [toast, ...prev.slice(0, 2)]); // Max 3 toasts

      // Auto-remove after 10 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 10000);
    }
  }, [newAlert]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Card key={toast.id} className="p-4 bg-red-50 border-red-200 shadow-lg max-w-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-900">{toast.title}</h4>
                <p className="text-sm text-red-700 mt-1">{toast.message}</p>
              </div>
            </div>
            <Button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
