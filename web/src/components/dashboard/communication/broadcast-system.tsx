/**
 * Smart Tourist Safety System - Broadcast System
 * Component for sending mass notifications and announcements
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Megaphone,
  Send,
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
  Calendar,
  Globe,
  Smartphone,
  Mail,
  MessageSquare,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Copy,
  Settings,
  Volume2,
  Target,
  Radio,
  Zap,
  Bell,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

const broadcastSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  type: z.enum(['emergency', 'alert', 'warning', 'info', 'announcement']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  targetAudience: z.enum(['all_tourists', 'specific_tourists', 'location_based', 'role_based']),
  specificTourists: z.array(z.string()).optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    radius: z.number(),
    address: z.string().optional(),
  }).optional(),
  roles: z.array(z.string()).optional(),
  deliveryChannels: z.object({
    push: z.boolean(),
    email: z.boolean(),
    sms: z.boolean(),
    inApp: z.boolean(),
  }),
  scheduledFor: z.string().optional(),
  expiresAt: z.string().optional(),
  requiresAcknowledgment: z.boolean(),
  attachments: z.array(z.string()).optional(),
});

type BroadcastFormData = z.infer<typeof broadcastSchema>;

interface BroadcastMessage {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'alert' | 'warning' | 'info' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetAudience: string;
  targetCount: number;
  deliveryChannels: {
    push: boolean;
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  createdBy: string;
  createdByName: string;
  createdAt: string;
  scheduledFor?: string;
  sentAt?: string;
  expiresAt?: string;
  deliveryStats: {
    sent: number;
    delivered: number;
    read: number;
    acknowledged: number;
    failed: number;
  };
  requiresAcknowledgment: boolean;
}

interface BroadcastSystemProps {
  onBroadcastSend?: (broadcast: BroadcastFormData) => void;
  onBroadcastEdit?: (broadcastId: string, broadcast: BroadcastFormData) => void;
  onBroadcastDelete?: (broadcastId: string) => void;
  className?: string;
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const BROADCAST_TYPES = [
  { value: 'emergency', label: 'Emergency Alert', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' },
  { value: 'alert', label: 'Safety Alert', icon: Bell, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20' },
  { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
  { value: 'info', label: 'Information', icon: Info, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
  { value: 'announcement', label: 'Announcement', icon: Megaphone, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/20' },
];

const TARGET_AUDIENCES = [
  { value: 'all_tourists', label: 'All Tourists', description: 'Send to all registered tourists' },
  { value: 'specific_tourists', label: 'Specific Tourists', description: 'Select individual tourists' },
  { value: 'location_based', label: 'Location-Based', description: 'Target tourists in specific area' },
  { value: 'role_based', label: 'Role-Based', description: 'Target specific user roles' },
];

const DELIVERY_CHANNELS = [
  { key: 'push', label: 'Push Notifications', icon: Smartphone, description: 'Mobile app notifications' },
  { key: 'email', label: 'Email', icon: Mail, description: 'Email notifications' },
  { key: 'sms', label: 'SMS', icon: MessageSquare, description: 'Text message alerts' },
  { key: 'inApp', label: 'In-App', icon: Bell, description: 'In-application notifications' },
];

const MOCK_BROADCASTS: BroadcastMessage[] = [
  {
    id: 'broadcast-001',
    title: 'Emergency: Heavy Rainfall Alert',
    message: 'Heavy rainfall expected in Delhi NCR region. Tourist activities may be affected. Please stay indoors and follow safety guidelines.',
    type: 'emergency',
    priority: 'critical',
    targetAudience: 'All Tourists',
    targetCount: 245,
    deliveryChannels: { push: true, email: true, sms: true, inApp: true },
    status: 'sent',
    createdBy: 'admin-001',
    createdByName: 'Admin User',
    createdAt: '2024-01-16T14:30:00Z',
    sentAt: '2024-01-16T14:35:00Z',
    expiresAt: '2024-01-17T06:00:00Z',
    deliveryStats: { sent: 245, delivered: 240, read: 198, acknowledged: 156, failed: 5 },
    requiresAcknowledgment: true,
  },
  {
    id: 'broadcast-002',
    title: 'Red Fort Temporary Closure',
    message: 'Red Fort will be temporarily closed for maintenance on January 18th, 2024. Alternative tour arrangements have been made.',
    type: 'info',
    priority: 'medium',
    targetAudience: 'Location-Based (Red Fort Area)',
    targetCount: 67,
    deliveryChannels: { push: true, email: false, sms: false, inApp: true },
    status: 'sent',
    createdBy: 'officer-001',
    createdByName: 'Officer Priya Sharma',
    createdAt: '2024-01-16T10:00:00Z',
    sentAt: '2024-01-16T10:05:00Z',
    deliveryStats: { sent: 67, delivered: 65, read: 52, acknowledged: 0, failed: 2 },
    requiresAcknowledgment: false,
  },
  {
    id: 'broadcast-003',
    title: 'Security Enhanced at Tourist Areas',
    message: 'Security measures have been enhanced at major tourist attractions. Please cooperate with security personnel and carry valid identification.',
    type: 'alert',
    priority: 'high',
    targetAudience: 'All Tourists',
    targetCount: 312,
    deliveryChannels: { push: true, email: true, sms: false, inApp: true },
    status: 'sending',
    createdBy: 'admin-001',
    createdByName: 'Admin User',
    createdAt: '2024-01-16T12:00:00Z',
    sentAt: '2024-01-16T12:02:00Z',
    deliveryStats: { sent: 156, delivered: 148, read: 89, acknowledged: 0, failed: 8 },
    requiresAcknowledgment: false,
  },
  {
    id: 'broadcast-004',
    title: 'Welcome to Delhi Tourism Safety Program',
    message: 'Welcome to the Smart Tourist Safety System! Your safety is our priority. Download the mobile app for real-time assistance.',
    type: 'announcement',
    priority: 'low',
    targetAudience: 'New Tourist Registrations',
    targetCount: 28,
    deliveryChannels: { push: false, email: true, sms: false, inApp: true },
    status: 'scheduled',
    createdBy: 'system',
    createdByName: 'System',
    createdAt: '2024-01-16T08:00:00Z',
    scheduledFor: '2024-01-16T18:00:00Z',
    deliveryStats: { sent: 0, delivered: 0, read: 0, acknowledged: 0, failed: 0 },
    requiresAcknowledgment: false,
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function BroadcastSystem({
  onBroadcastSend,
  onBroadcastEdit,
  onBroadcastDelete,
  className,
}: BroadcastSystemProps) {
  const { user, hasPermission } = useAuth();
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(MOCK_BROADCASTS);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedBroadcast, setSelectedBroadcast] = useState<BroadcastMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<BroadcastFormData>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      type: 'info',
      priority: 'medium',
      targetAudience: 'all_tourists',
      deliveryChannels: {
        push: true,
        email: false,
        sms: false,
        inApp: true,
      },
      requiresAcknowledgment: false,
    },
  });

  const watchedValues = watch();

  // Filter broadcasts
  const filteredBroadcasts = broadcasts.filter(broadcast => {
    const matchesSearch = broadcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         broadcast.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || broadcast.status === filterStatus;
    const matchesType = filterType === 'all' || broadcast.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Handle form submission
  const onSubmit = (data: BroadcastFormData) => {
    const newBroadcast: BroadcastMessage = {
      id: `broadcast-${Date.now()}`,
      title: data.title,
      message: data.message,
      type: data.type,
      priority: data.priority,
      targetAudience: data.targetAudience,
      targetCount: getTargetCount(data.targetAudience),
      deliveryChannels: data.deliveryChannels,
      status: data.scheduledFor ? 'scheduled' : 'sending',
      createdBy: user?.id || 'current-user',
      createdByName: user?.email || 'Current User',
      createdAt: new Date().toISOString(),
      scheduledFor: data.scheduledFor,
      expiresAt: data.expiresAt,
      deliveryStats: { sent: 0, delivered: 0, read: 0, acknowledged: 0, failed: 0 },
      requiresAcknowledgment: data.requiresAcknowledgment,
    };

    setBroadcasts(prev => [newBroadcast, ...prev]);
    onBroadcastSend?.(data);
    setShowCreateForm(false);
    reset();

    // Simulate sending process
    if (!data.scheduledFor) {
      setTimeout(() => {
        setBroadcasts(prev => prev.map(b => 
          b.id === newBroadcast.id 
            ? { ...b, status: 'sent', sentAt: new Date().toISOString() }
            : b
        ));
      }, 3000);
    }
  };

  // Get target count based on audience type
  const getTargetCount = (targetAudience: string) => {
    switch (targetAudience) {
      case 'all_tourists': return 312;
      case 'specific_tourists': return 15;
      case 'location_based': return 89;
      case 'role_based': return 45;
      default: return 0;
    }
  };

  // Get broadcast type info
  const getBroadcastTypeInfo = (type: string) => {
    return BROADCAST_TYPES.find(t => t.value === type) || BROADCAST_TYPES[0];
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'sending': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Calculate delivery rate
  const getDeliveryRate = (stats: BroadcastMessage['deliveryStats']) => {
    if (stats.sent === 0) return 0;
    return Math.round((stats.delivered / stats.sent) * 100);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Broadcast System
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Send mass notifications and announcements to tourists
            </p>
          </div>
          
          {hasPermission('create_broadcast') && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              <Megaphone className="h-4 w-4 mr-2" />
              Create Broadcast
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search broadcasts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="sending">Sending</option>
              <option value="scheduled">Scheduled</option>
              <option value="failed">Failed</option>
              <option value="draft">Draft</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              {BROADCAST_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Broadcasts List */}
      <div className="space-y-4">
        {filteredBroadcasts.map((broadcast) => {
          const typeInfo = getBroadcastTypeInfo(broadcast.type);
          const Icon = typeInfo.icon;
          const deliveryRate = getDeliveryRate(broadcast.deliveryStats);
          
          return (
            <div
              key={broadcast.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={cn('p-3 rounded-full', typeInfo.bg)}>
                    <Icon className={cn('h-6 w-6', typeInfo.color)} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {broadcast.title}
                      </h3>
                      
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(broadcast.status))}>
                        {broadcast.status.charAt(0).toUpperCase() + broadcast.status.slice(1)}
                      </span>
                      
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        broadcast.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        broadcast.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                        broadcast.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      )}>
                        {broadcast.priority}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {broadcast.message}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {broadcast.targetCount} recipients
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {broadcast.sentAt ? formatDate(broadcast.sentAt) : formatDate(broadcast.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        {broadcast.targetAudience}
                      </div>
                      {broadcast.status === 'sent' && (
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {deliveryRate}% delivered
                        </div>
                      )}
                    </div>
                    
                    {/* Delivery Channels */}
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Channels:</span>
                      {broadcast.deliveryChannels.push && (
                        <span className="flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded">
                          <Smartphone className="h-3 w-3 mr-1" />
                          Push
                        </span>
                      )}
                      {broadcast.deliveryChannels.email && (
                        <span className="flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded">
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </span>
                      )}
                      {broadcast.deliveryChannels.sms && (
                        <span className="flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 rounded">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          SMS
                        </span>
                      )}
                      {broadcast.deliveryChannels.inApp && (
                        <span className="flex items-center px-2 py-1 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 rounded">
                          <Bell className="h-3 w-3 mr-1" />
                          In-App
                        </span>
                      )}
                    </div>
                    
                    {/* Delivery Stats for sent broadcasts */}
                    {broadcast.status === 'sent' && (
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                        <div className="grid grid-cols-5 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {broadcast.deliveryStats.sent}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Sent</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-blue-600">
                              {broadcast.deliveryStats.delivered}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Delivered</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-green-600">
                              {broadcast.deliveryStats.read}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Read</div>
                          </div>
                          {broadcast.requiresAcknowledgment && (
                            <div className="text-center">
                              <div className="font-medium text-purple-600">
                                {broadcast.deliveryStats.acknowledged}
                              </div>
                              <div className="text-gray-600 dark:text-gray-400">Acknowledged</div>
                            </div>
                          )}
                          <div className="text-center">
                            <div className="font-medium text-red-600">
                              {broadcast.deliveryStats.failed}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Failed</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedBroadcast(broadcast)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  {hasPermission('edit_broadcast') && broadcast.status === 'draft' && (
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Edit broadcast"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Duplicate broadcast"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  
                  {hasPermission('delete_broadcast') && (
                    <button
                      onClick={() => onBroadcastDelete?.(broadcast.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete broadcast"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredBroadcasts.length === 0 && (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow text-center">
          <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Broadcasts Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || filterStatus !== 'all' || filterType !== 'all'
              ? 'No broadcasts match your current filters.'
              : 'Create your first broadcast to start communicating with tourists.'}
          </p>
        </div>
      )}

      {/* Create Broadcast Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Create Broadcast
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    reset();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Basic Information</h4>
                
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    {...register('title')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter broadcast title"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    {...register('message')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your message"
                  />
                  {errors.message && (
                    <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type *
                    </label>
                    <select
                      id="type"
                      {...register('type')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {BROADCAST_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority *
                    </label>
                    <select
                      id="priority"
                      {...register('priority')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Target Audience */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Target Audience</h4>
                
                <div>
                  <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Audience Type *
                  </label>
                  <div className="space-y-2">
                    {TARGET_AUDIENCES.map((audience) => (
                      <label
                        key={audience.value}
                        className="flex items-start p-3 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <input
                          type="radio"
                          value={audience.value}
                          {...register('targetAudience')}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {audience.label}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {audience.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delivery Channels */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Delivery Channels</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  {DELIVERY_CHANNELS.map((channel) => {
                    const ChannelIcon = channel.icon;
                    return (
                      <label
                        key={channel.key}
                        className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <input
                          type="checkbox"
                          {...register(`deliveryChannels.${channel.key as keyof BroadcastFormData['deliveryChannels']}`)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <ChannelIcon className="h-5 w-5 text-blue-600 ml-3 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {channel.label}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {channel.description}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Scheduling and Options */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Options</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Schedule For (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      id="scheduledFor"
                      {...register('scheduledFor')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expires At (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      id="expiresAt"
                      {...register('expiresAt')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requiresAcknowledgment"
                    {...register('requiresAcknowledgment')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="requiresAcknowledgment" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Require acknowledgment from recipients
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    reset();
                  }}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValid}
                  className={cn(
                    'flex items-center px-6 py-2 text-sm text-white rounded-md',
                    isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                  )}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {watchedValues.scheduledFor ? 'Schedule Broadcast' : 'Send Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BroadcastSystem;
