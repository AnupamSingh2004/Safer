/**
 * Smart Tourist Safety System - Alert Details Component
 * Individual alert management with response timeline and detailed information
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  MapPin,
  MoreHorizontal,
  Phone,
  RefreshCw,
  User,
  Users,
  XCircle,
  Zap,
  MessageSquare,
  FileText,
  Send,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Bell,
  Settings,
  ExternalLink,
  Download,
  Share2
} from 'lucide-react';

import type { Alert, Notification, NotificationChannel } from '@/types/alert';
import { useAlertStore } from '@/stores/alert-store';

// ============================================================================
// INTERFACES
// ============================================================================

interface AlertDetailsProps {
  alert: Alert;
  onBack: () => void;
  onAction: (action: string, alertId: string) => void;
}

interface TimelineEvent {
  id: string;
  type: 'created' | 'acknowledged' | 'escalated' | 'resolved' | 'updated' | 'notification';
  timestamp: string;
  user?: string;
  description: string;
  metadata?: Record<string, any>;
}

interface CommentData {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SEVERITY_COLORS = {
  critical: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  info: 'bg-gray-100 text-gray-800 border-gray-200'
};

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800 border-green-200',
  acknowledged: 'bg-blue-100 text-blue-800 border-blue-200',
  resolved: 'bg-gray-100 text-gray-800 border-gray-200',
  expired: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200'
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

const formatRelativeTime = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AlertDetails: React.FC<AlertDetailsProps> = ({
  alert,
  onBack,
  onAction
}) => {
  const { notifications, fetchNotifications } = useAlertStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'notifications' | 'comments'>('overview');
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [mockComments, setMockComments] = useState<CommentData[]>([
    {
      id: 'comment-1',
      userId: 'user-001',
      userName: 'Sarah Johnson',
      message: 'Investigating the situation. Emergency responders are en route.',
      timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    },
    {
      id: 'comment-2',
      userId: 'user-002',
      userName: 'Mike Chen',
      message: 'Tourist has been contacted and is safe. Updating location tracking.',
      timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    }
  ]);

  // ========================================================================
  // EFFECTS
  // ========================================================================

  useEffect(() => {
    fetchNotifications(alert.id);
  }, [alert.id, fetchNotifications]);

  // ========================================================================
  // MOCK DATA GENERATION
  // ========================================================================

  const generateTimeline = (): TimelineEvent[] => {
    const events: TimelineEvent[] = [
      {
        id: 'created',
        type: 'created',
        timestamp: alert.createdAt,
        user: alert.createdBy,
        description: `Alert created: ${alert.title}`
      }
    ];

    if (alert.acknowledgedAt && alert.acknowledgedBy) {
      events.push({
        id: 'acknowledged',
        type: 'acknowledged',
        timestamp: alert.acknowledgedAt,
        user: alert.acknowledgedBy,
        description: 'Alert acknowledged by response team'
      });
    }

    if (alert.escalationLevel > 0) {
      events.push({
        id: 'escalated',
        type: 'escalated',
        timestamp: alert.metadata?.escalatedAt || alert.updatedAt,
        user: alert.metadata?.escalatedBy || 'system',
        description: `Alert escalated to level ${alert.escalationLevel}`
      });
    }

    if (alert.resolvedAt && alert.resolvedBy) {
      events.push({
        id: 'resolved',
        type: 'resolved',
        timestamp: alert.resolvedAt,
        user: alert.resolvedBy,
        description: 'Alert resolved and closed'
      });
    }

    // Add notification events
    notifications.forEach(notif => {
      if (notif.alertId === alert.id) {
        events.push({
          id: `notif-${notif.id}`,
          type: 'notification',
          timestamp: notif.sentAt || notif.scheduledAt,
          description: `Notification sent via ${notif.channel}`,
          metadata: { notificationId: notif.id, channel: notif.channel }
        });
      }
    });

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const comment: CommentData = {
      id: `comment-${Date.now()}`,
      userId: 'current-user',
      userName: 'Current User',
      message: newComment.trim(),
      timestamp: new Date().toISOString()
    };

    setMockComments(prev => [comment, ...prev]);
    setNewComment('');
    setIsSubmittingComment(false);
  };

  const handleDownloadReport = () => {
    // Generate a simple report
    const reportData = {
      alert: {
        id: alert.id,
        title: alert.title,
        type: alert.type,
        severity: alert.severity,
        status: alert.status,
        createdAt: alert.createdAt,
        acknowledgedAt: alert.acknowledgedAt,
        resolvedAt: alert.resolvedAt
      },
      timeline: generateTimeline(),
      notifications: notifications.filter(n => n.alertId === alert.id),
      comments: mockComments
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alert-${alert.id}-report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ========================================================================
  // RENDER FUNCTIONS
  // ========================================================================

  const renderHeader = () => (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${SEVERITY_COLORS[alert.severity]}`}>
              {alert.severity.toUpperCase()}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${STATUS_COLORS[alert.status]}`}>
              {alert.status.replace('_', ' ').toUpperCase()}
            </span>
            {alert.escalationLevel > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                Escalation Level {alert.escalationLevel}
              </span>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {alert.title}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {alert.message}
          </p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Created {formatRelativeTime(alert.createdAt)}
            </div>
            {alert.acknowledgedAt && (
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Acknowledged {formatRelativeTime(alert.acknowledgedAt)}
              </div>
            )}
            {alert.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {alert.location.landmark || alert.location.address}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-6">
          {alert.status === 'active' && (
            <button
              onClick={() => onAction('acknowledge', alert.id)}
              className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4" />
              Acknowledge
            </button>
          )}
          
          {alert.status === 'acknowledged' && (
            <button
              onClick={() => onAction('resolve', alert.id)}
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <XCircle className="w-4 h-4" />
              Resolve
            </button>
          )}
          
          <button
            onClick={() => onAction('escalate', alert.id)}
            className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            <ArrowUp className="w-4 h-4" />
            Escalate
          </button>
          
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Report
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <nav className="flex space-x-8 px-6">
        {[
          { id: 'overview', label: 'Overview', icon: Eye },
          { id: 'timeline', label: 'Timeline', icon: Clock },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'comments', label: 'Comments', icon: MessageSquare }
        ].map(tab => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
              {tab.id === 'comments' && mockComments.length > 0 && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                  {mockComments.length}
                </span>
              )}
              {tab.id === 'notifications' && notifications.filter(n => n.alertId === alert.id).length > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {notifications.filter(n => n.alertId === alert.id).length}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Alert Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Alert Information
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Alert ID</span>
              <p className="font-medium text-gray-900 dark:text-white">{alert.id}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
              <p className="font-medium text-gray-900 dark:text-white capitalize">{alert.type.replace('_', ' ')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Source</span>
              <p className="font-medium text-gray-900 dark:text-white capitalize">{alert.source}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Created By</span>
              <p className="font-medium text-gray-900 dark:text-white">{alert.createdBy}</p>
            </div>
          </div>
          
          {alert.expiresAt && (
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Expires At</span>
              <p className="font-medium text-gray-900 dark:text-white">{formatDateTime(alert.expiresAt)}</p>
            </div>
          )}
          
          {alert.tags.length > 0 && (
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Tags</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {alert.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location Information */}
      {alert.location && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Location Details
          </h3>
          
          <div className="space-y-4">
            {alert.location.coordinates && (
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Coordinates</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {alert.location.coordinates.latitude.toFixed(6)}, {alert.location.coordinates.longitude.toFixed(6)}
                </p>
              </div>
            )}
            
            {alert.location.address && (
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Address</span>
                <p className="font-medium text-gray-900 dark:text-white">{alert.location.address}</p>
              </div>
            )}
            
            {alert.location.landmark && (
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Landmark</span>
                <p className="font-medium text-gray-900 dark:text-white">{alert.location.landmark}</p>
              </div>
            )}
            
            {alert.location.radius && (
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Affected Radius</span>
                <p className="font-medium text-gray-900 dark:text-white">{alert.location.radius} meters</p>
              </div>
            )}
            
            <button className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
              <ExternalLink className="w-4 h-4" />
              View on Map
            </button>
          </div>
        </div>
      )}

      {/* Delivery Statistics */}
      {alert.deliveryStats && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Delivery Statistics
          </h3>
          
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{alert.deliveryStats.sent}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sent</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{alert.deliveryStats.delivered}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Delivered</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{alert.deliveryStats.read}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Read</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{alert.deliveryStats.acknowledged}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Acknowledged</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{alert.deliveryStats.failed}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Delivery Rate</span>
              <span className="font-medium">
                {((alert.deliveryStats.delivered / alert.deliveryStats.sent) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Acknowledgment Rate</span>
              <span className="font-medium">
                {((alert.deliveryStats.acknowledged / alert.deliveryStats.delivered) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTimelineTab = () => {
    const timeline = generateTimeline();
    
    return (
      <div className="space-y-4">
        {timeline.map((event, index) => (
          <div key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                event.type === 'created' ? 'bg-blue-100 text-blue-600' :
                event.type === 'acknowledged' ? 'bg-green-100 text-green-600' :
                event.type === 'escalated' ? 'bg-red-100 text-red-600' :
                event.type === 'resolved' ? 'bg-gray-100 text-gray-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                {event.type === 'created' && <Bell className="w-4 h-4" />}
                {event.type === 'acknowledged' && <CheckCircle className="w-4 h-4" />}
                {event.type === 'escalated' && <ArrowUp className="w-4 h-4" />}
                {event.type === 'resolved' && <XCircle className="w-4 h-4" />}
                {event.type === 'notification' && <Send className="w-4 h-4" />}
                {event.type === 'updated' && <Edit className="w-4 h-4" />}
              </div>
              {index < timeline.length - 1 && (
                <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700 mt-2"></div>
              )}
            </div>
            
            <div className="flex-1 pb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {event.description}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(event.timestamp)}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <span>{formatDateTime(event.timestamp)}</span>
                    {event.user && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {event.user}
                      </span>
                    )}
                  </div>
                </div>
                
                {event.metadata && (
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
                    <pre className="text-gray-600 dark:text-gray-400">
                      {JSON.stringify(event.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderNotificationsTab = () => {
    const alertNotifications = notifications.filter(n => n.alertId === alert.id);
    
    return (
      <div className="space-y-4">
        {alertNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No notifications sent for this alert</p>
          </div>
        ) : (
          alertNotifications.map(notification => (
            <div key={notification.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {notification.channel.toUpperCase()} Notification
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    notification.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    notification.status === 'read' ? 'bg-blue-100 text-blue-800' :
                    notification.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {notification.status.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatRelativeTime(notification.sentAt || notification.scheduledAt)}
                </span>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {notification.message}
              </p>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <div>Recipient: {notification.recipientId} ({notification.recipientType})</div>
                <div>Attempts: {notification.attempts} / {notification.maxAttempts}</div>
                {notification.deliveredAt && (
                  <div>Delivered: {formatDateTime(notification.deliveredAt)}</div>
                )}
                {notification.readAt && (
                  <div>Read: {formatDateTime(notification.readAt)}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const renderCommentsTab = () => (
    <div className="space-y-6">
      {/* Add Comment Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Add Comment</h4>
        <div className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment about this alert..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
          <div className="flex justify-end">
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim() || isSubmittingComment}
              className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingComment ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Post Comment
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {mockComments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No comments yet</p>
          </div>
        ) : (
          mockComments.map(comment => (
            <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {comment.userName}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatRelativeTime(comment.timestamp)}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 ml-10">
                {comment.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // ========================================================================
  // MAIN RENDER
  // ========================================================================

  return (
    <div className="space-y-0">
      {renderHeader()}
      {renderTabs()}
      
      <div className="p-6">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'timeline' && renderTimelineTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
        {activeTab === 'comments' && renderCommentsTab()}
      </div>
    </div>
  );
};

export default AlertDetails;
