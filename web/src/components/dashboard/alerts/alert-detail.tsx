/**
 * Smart Tourist Safety System - Alert Detail Viewer
 * Comprehensive alert viewing and management interface
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  User,
  Calendar,
  Bell,
  Shield,
  Heart,
  Cloud,
  Car,
  Phone,
  Mail,
  MessageSquare,
  Share2,
  Download,
  MoreHorizontal,
  Navigation,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// TYPES
// ============================================================================

interface AlertDetailData {
  id: string;
  type: 'emergency' | 'safety' | 'weather' | 'security' | 'medical' | 'transport' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'active' | 'resolved' | 'dismissed';
  title: string;
  description: string;
  touristId?: string;
  touristName?: string;
  touristPhone?: string;
  touristEmail?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolvedByName?: string;
  dismissedAt?: string;
  dismissedBy?: string;
  metadata?: Record<string, any>;
  timeline?: Array<{
    id: string;
    action: string;
    timestamp: string;
    user: string;
    userName?: string;
    description?: string;
  }>;
}

interface AlertDetailProps {
  alertId: string;
  alertData?: AlertDetailData;
  onEdit?: (alertId: string) => void;
  onDelete?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  onBack?: () => void;
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const ALERT_TYPES = [
  { value: 'emergency', label: 'Emergency', icon: AlertTriangle, color: 'text-red-600' },
  { value: 'safety', label: 'Safety Warning', icon: Shield, color: 'text-yellow-600' },
  { value: 'weather', label: 'Weather Alert', icon: Cloud, color: 'text-blue-600' },
  { value: 'security', label: 'Security Alert', icon: Shield, color: 'text-orange-600' },
  { value: 'medical', label: 'Medical Emergency', icon: Heart, color: 'text-red-600' },
  { value: 'transport', label: 'Transport Disruption', icon: Car, color: 'text-gray-600' },
  { value: 'general', label: 'General Alert', icon: Bell, color: 'text-blue-600' },
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
];

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
  { value: 'active', label: 'Active', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
  { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  { value: 'dismissed', label: 'Dismissed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
];

const MOCK_ALERT_DETAIL: AlertDetailData = {
  id: 'A001',
  type: 'medical',
  priority: 'critical',
  status: 'active',
  title: 'Medical Emergency - Tourist Collapse',
  description: 'Tourist collapsed at India Gate while on tour. Emergency services have been notified and are en route. Tourist was conscious when last checked but requires immediate medical attention.',
  touristId: 'T001',
  touristName: 'Raj Kumar',
  touristPhone: '+91-9876543210',
  touristEmail: 'raj.kumar@email.com',
  location: {
    latitude: 28.6129,
    longitude: 77.2295,
    address: 'India Gate, New Delhi, Delhi 110001',
  },
  createdAt: '2024-01-16T14:30:00Z',
  updatedAt: '2024-01-16T14:35:00Z',
  createdBy: 'officer001',
  createdByName: 'Officer Priya Sharma',
  timeline: [
    {
      id: 'T001',
      action: 'created',
      timestamp: '2024-01-16T14:30:00Z',
      user: 'officer001',
      userName: 'Officer Priya Sharma',
      description: 'Alert created for medical emergency',
    },
    {
      id: 'T002',
      action: 'emergency_services_notified',
      timestamp: '2024-01-16T14:31:00Z',
      user: 'system',
      description: 'Emergency services automatically notified',
    },
    {
      id: 'T003',
      action: 'status_updated',
      timestamp: '2024-01-16T14:35:00Z',
      user: 'officer001',
      userName: 'Officer Priya Sharma',
      description: 'Tourist status checked - conscious and responsive',
    },
  ],
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AlertDetail({
  alertId,
  alertData = MOCK_ALERT_DETAIL,
  onEdit,
  onDelete,
  onResolve,
  onDismiss,
  onBack,
}: AlertDetailProps) {
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get type info
  const getTypeInfo = (type: string) => {
    const typeInfo = ALERT_TYPES.find(t => t.value === type);
    return typeInfo || ALERT_TYPES[0];
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    const priorityInfo = PRIORITY_LEVELS.find(p => p.value === priority);
    return priorityInfo?.color || PRIORITY_LEVELS[0].color;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const statusInfo = STATUS_OPTIONS.find(s => s.value === status);
    return statusInfo?.color || STATUS_OPTIONS[0].color;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle actions
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(alertId);
    } else {
      router.push(`/dashboard/alerts/${alertId}/edit`);
    }
  };

  const handleResolve = () => {
    if (onResolve) {
      onResolve(alertId);
    }
    // Add optimistic update here
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss(alertId);
    }
    // Add optimistic update here
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(alertId);
    }
    setShowDeleteConfirm(false);
  };

  const typeInfo = getTypeInfo(alertData.type);
  const TypeIcon = typeInfo.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Alert Details
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Alert ID: {alertData.id}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {alertData.status === 'active' && hasPermission('resolve_alert') && (
            <button
              onClick={handleResolve}
              className="flex items-center px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolve
            </button>
          )}

          {alertData.status === 'active' && hasPermission('dismiss_alert') && (
            <button
              onClick={handleDismiss}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Dismiss
            </button>
          )}

          {hasPermission('edit_alert') && (
            <button
              onClick={handleEdit}
              className="flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
          )}

          {hasPermission('delete_alert') && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Alert Summary */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-start space-x-6">
          <div className={cn(
            'p-4 rounded-full',
            alertData.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/20' :
            alertData.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/20' :
            alertData.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
            'bg-green-100 dark:bg-green-900/20'
          )}>
            <TypeIcon className={cn(
              'h-8 w-8',
              alertData.priority === 'critical' ? 'text-red-600' :
              alertData.priority === 'high' ? 'text-orange-600' :
              alertData.priority === 'medium' ? 'text-yellow-600' :
              'text-green-600'
            )} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {alertData.title}
              </h2>
              <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(alertData.priority))}>
                {alertData.priority.charAt(0).toUpperCase() + alertData.priority.slice(1)} Priority
              </span>
              <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(alertData.status))}>
                {alertData.status.charAt(0).toUpperCase() + alertData.status.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center">
                <TypeIcon className={cn('h-4 w-4 mr-1', typeInfo.color)} />
                {typeInfo.label}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(alertData.createdAt)}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {alertData.createdByName || alertData.createdBy}
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300">
              {alertData.description}
            </p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tourist Information */}
        {alertData.touristId && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Tourist Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {alertData.touristName || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Tourist ID: {alertData.touristId}
                  </p>
                </div>
              </div>
              
              {alertData.touristPhone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {alertData.touristPhone}
                    </p>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Call Tourist
                    </button>
                  </div>
                </div>
              )}
              
              {alertData.touristEmail && (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {alertData.touristEmail}
                    </p>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Send Email
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Location Information */}
        {alertData.location && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Location Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {alertData.location.address || 'Unknown Location'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {alertData.location.latitude.toFixed(6)}, {alertData.location.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700">
                  <Navigation className="h-4 w-4 mr-1" />
                  View on Map
                </button>
                <button className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share Location
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      {alertData.timeline && alertData.timeline.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Alert Timeline
          </h3>
          
          <div className="space-y-4">
            {alertData.timeline.map((event, index) => (
              <div key={event.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    index === 0 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  )}>
                    <Clock className={cn(
                      'h-4 w-4',
                      index === 0 ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                    )} />
                  </div>
                  {index < (alertData.timeline?.length ?? 0) - 1 && (
                    <div className="w-0.5 h-6 bg-gray-300 dark:bg-gray-600 ml-3.5 mt-2" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <span className="text-sm text-gray-500">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.description}
                  </p>
                  {event.userName && (
                    <p className="text-sm text-gray-500">
                      by {event.userName}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Delete Alert
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this alert? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlertDetail;
