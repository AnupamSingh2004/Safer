/**
 * Smart Tourist Safety System - Alert Store
 * Zustand store for alert and notification management
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  Alert,
  AlertId,
  AlertType,
  AlertSeverity,
  AlertStatus,
  Notification,
  NotificationChannel,
  NotificationStatus,
  AlertMetrics,
  NotificationMetrics,
  AlertSearchFilters,
  AlertSearchResult,
  CreateAlertRequest,
  UpdateAlertRequest,
  BulkAlertOperation,
  BulkAlertResult,
  EmergencyBroadcast,
  TriggerType
} from '@/types/alert';

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface AlertStore {
  // State
  alerts: Alert[];
  notifications: Notification[];
  selectedAlert: Alert | null;
  alertMetrics: AlertMetrics | null;
  notificationMetrics: NotificationMetrics | null;
  searchResults: AlertSearchResult | null;
  isLoading: boolean;
  error: string | null;
  
  // Real-time data
  activeAlertsCount: number;
  criticalAlertsCount: number;
  unacknowledgedCount: number;
  recentNotifications: Notification[];
  
  // Computed values
  totalAlerts: number;
  activeAlerts: Alert[];
  criticalAlerts: Alert[];
  recentAlerts: Alert[];
  
  // Basic CRUD operations
  fetchAlerts: (filters?: AlertSearchFilters) => Promise<void>;
  fetchAlertById: (id: AlertId) => Promise<void>;
  createAlert: (request: CreateAlertRequest) => Promise<Alert>;
  updateAlert: (request: UpdateAlertRequest) => Promise<Alert>;
  deleteAlert: (id: AlertId) => Promise<void>;
  
  // Alert management
  acknowledgeAlert: (id: AlertId, acknowledgedBy: string, notes?: string) => Promise<void>;
  resolveAlert: (id: AlertId, resolvedBy: string, resolution?: string) => Promise<void>;
  escalateAlert: (id: AlertId, escalatedBy: string, reason: string) => Promise<void>;
  cancelAlert: (id: AlertId, cancelledBy: string, reason: string) => Promise<void>;
  
  // Search and filtering
  searchAlerts: (filters: AlertSearchFilters) => Promise<void>;
  clearSearchResults: () => void;
  
  // Bulk operations
  performBulkOperation: (operation: Omit<BulkAlertOperation, 'performedAt'>) => Promise<BulkAlertResult>;
  
  // Emergency functions
  createEmergencyBroadcast: (broadcast: Omit<EmergencyBroadcast, 'id' | 'createdAt' | 'deliveryStats'>) => Promise<void>;
  sendTestAlert: (recipientId: string, channel: NotificationChannel) => Promise<void>;
  
  // Notifications
  fetchNotifications: (alertId?: AlertId) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  retryFailedNotification: (notificationId: string) => Promise<void>;
  
  // Analytics
  fetchAlertMetrics: (dateRange?: { start: string; end: string }) => Promise<void>;
  fetchNotificationMetrics: (dateRange?: { start: string; end: string }) => Promise<void>;
  
  // Real-time updates
  subscribeToAlerts: () => void;
  unsubscribeFromAlerts: () => void;
  
  // Utility functions
  selectAlert: (alert: Alert | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    type: AlertType.SAFETY,
    severity: AlertSeverity.HIGH,
    status: AlertStatus.ACTIVE,
    title: 'High Crime Area Alert',
    message: 'Tourists are advised to avoid the Old Delhi Railway Station area due to increased pickpocketing incidents reported in the last 24 hours.',
    shortMessage: 'Avoid Old Delhi Railway Station - High pickpocketing risk',
    actions: [
      {
        id: 'action-1',
        label: 'View Alternative Routes',
        type: 'primary',
        action: 'navigate',
        payload: { destination: 'safe_routes' }
      },
      {
        id: 'action-2',
        label: 'Acknowledge',
        type: 'secondary',
        action: 'acknowledge'
      }
    ],
    target: {
      type: 'custom',
      criteria: {
        zones: ['zone-old-delhi', 'zone-railway-station'],
        nationalities: ['all']
      },
      estimatedReach: 45
    },
    location: {
      coordinates: {
        latitude: 28.6431,
        longitude: 77.2197
      },
      address: 'Old Delhi Railway Station, Delhi',
      landmark: 'Old Delhi Railway Station',
      radius: 500,
      zoneId: 'zone-old-delhi'
    },
    affectedZones: ['zone-old-delhi', 'zone-railway-station'],
    triggerCondition: {
      type: TriggerType.MANUAL,
      conditions: {}
    },
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    expiresAt: new Date(Date.now() + 43200000).toISOString(), // 12 hours from now
    createdBy: 'admin-001',
    source: 'manual',
    deliveryStats: {
      sent: 45,
      delivered: 42,
      read: 28,
      failed: 3,
      acknowledged: 15
    },
    relatedAlerts: [],
    escalationLevel: 0,
    tags: ['safety', 'crime', 'pickpocketing', 'transportation'],
    metadata: {
      incidentReports: 8,
      sourceAuthority: 'Delhi Police',
      verificationStatus: 'confirmed'
    }
  },
  {
    id: 'alert-002',
    type: AlertType.WEATHER,
    severity: AlertSeverity.MEDIUM,
    status: AlertStatus.ACTIVE,
    title: 'Heavy Rain Alert',
    message: 'Heavy rainfall expected in Delhi NCR region for the next 6 hours. Plan indoor activities and avoid low-lying areas prone to waterlogging.',
    shortMessage: 'Heavy rain expected - Plan indoor activities',
    actions: [
      {
        id: 'action-3',
        label: 'View Indoor Attractions',
        type: 'primary',
        action: 'navigate',
        payload: { category: 'indoor_attractions' }
      },
      {
        id: 'action-4',
        label: 'Dismiss',
        type: 'secondary',
        action: 'dismiss'
      }
    ],
    target: {
      type: 'all',
      estimatedReach: 156
    },
    affectedZones: ['zone-central-delhi', 'zone-south-delhi', 'zone-north-delhi'],
    triggerCondition: {
      type: TriggerType.AUTOMATIC,
      conditions: {
        source: 'weather_api',
        threshold: 'heavy_rain'
      }
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 21600000).toISOString(), // 6 hours from now
    createdBy: 'system',
    source: 'automatic',
    deliveryStats: {
      sent: 156,
      delivered: 151,
      read: 89,
      failed: 5,
      acknowledged: 45
    },
    relatedAlerts: [],
    escalationLevel: 0,
    tags: ['weather', 'rain', 'waterlogging', 'indoor'],
    metadata: {
      weatherSource: 'IMD',
      rainfallPrediction: '25-40mm',
      windSpeed: '15-20 kmph'
    }
  },
  {
    id: 'alert-003',
    type: AlertType.EMERGENCY,
    severity: AlertSeverity.CRITICAL,
    status: AlertStatus.ACKNOWLEDGED,
    title: 'Tourist Emergency - Medical Assistance Required',
    message: 'Emergency medical assistance required for tourist Sophie Dubois near Connaught Place. Emergency services have been contacted.',
    shortMessage: 'Medical emergency at Connaught Place',
    actions: [
      {
        id: 'action-5',
        label: 'View Location',
        type: 'danger',
        action: 'navigate',
        payload: { 
          latitude: 28.6129,
          longitude: 77.2295 
        }
      },
      {
        id: 'action-6',
        label: 'Contact Emergency Services',
        type: 'danger',
        action: 'contact',
        payload: { type: 'emergency', number: '102' }
      }
    ],
    target: {
      type: 'staff',
      criteria: {
        roles: ['emergency_responder', 'medical_staff', 'security']
      },
      estimatedReach: 12
    },
    location: {
      coordinates: {
        latitude: 28.6129,
        longitude: 77.2295
      },
      address: 'Connaught Place, New Delhi',
      landmark: 'Connaught Place',
      radius: 100,
      zoneId: 'zone-connaught-place'
    },
    affectedZones: ['zone-connaught-place'],
    triggerCondition: {
      type: TriggerType.AUTOMATIC,
      conditions: {
        source: 'emergency_button',
        touristId: 'tourist-004'
      }
    },
    createdAt: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    updatedAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    acknowledgedAt: new Date(Date.now() - 300000).toISOString(),
    createdBy: 'system',
    acknowledgedBy: 'responder-001',
    source: 'automatic',
    deliveryStats: {
      sent: 12,
      delivered: 12,
      read: 11,
      failed: 0,
      acknowledged: 8
    },
    relatedAlerts: [],
    escalationLevel: 1,
    tags: ['emergency', 'medical', 'tourist-004', 'connaught-place'],
    metadata: {
      touristId: 'tourist-004',
      emergencyType: 'medical',
      responderAssigned: 'responder-001',
      estimatedArrival: '5-7 minutes'
    }
  }
];

const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    alertId: 'alert-001',
    recipientId: 'tourist-001',
    recipientType: 'tourist',
    channel: NotificationChannel.PUSH,
    channelData: {
      deviceToken: 'device-token-001'
    },
    title: 'Safety Alert',
    message: 'Avoid Old Delhi Railway Station - High pickpocketing risk',
    status: NotificationStatus.READ,
    attempts: 1,
    maxAttempts: 3,
    scheduledAt: new Date(Date.now() - 1800000).toISOString(),
    sentAt: new Date(Date.now() - 1799000).toISOString(),
    deliveredAt: new Date(Date.now() - 1798000).toISOString(),
    readAt: new Date(Date.now() - 1200000).toISOString(),
    response: {
      action: 'acknowledge',
      timestamp: new Date(Date.now() - 1200000).toISOString()
    }
  },
  {
    id: 'notif-002',
    alertId: 'alert-002',
    recipientId: 'tourist-002',
    recipientType: 'tourist',
    channel: NotificationChannel.SMS,
    channelData: {
      phoneNumber: '+34-600-123456'
    },
    title: 'Weather Alert',
    message: 'Heavy rain expected - Plan indoor activities',
    status: NotificationStatus.DELIVERED,
    attempts: 1,
    maxAttempts: 3,
    scheduledAt: new Date(Date.now() - 3600000).toISOString(),
    sentAt: new Date(Date.now() - 3599000).toISOString(),
    deliveredAt: new Date(Date.now() - 3598000).toISOString()
  }
];

const mockAlertMetrics: AlertMetrics = {
  totalAlerts: 47,
  activeAlerts: 8,
  resolvedAlerts: 35,
  averageResolutionTime: 185, // minutes
  byType: {
    [AlertType.SAFETY]: 15,
    [AlertType.WEATHER]: 12,
    [AlertType.TRAFFIC]: 8,
    [AlertType.EMERGENCY]: 5,
    [AlertType.HEALTH]: 3,
    [AlertType.SECURITY]: 2,
    [AlertType.LOCATION]: 1,
    [AlertType.SYSTEM]: 1,
    [AlertType.MAINTENANCE]: 0,
    [AlertType.INFORMATION]: 0
  },
  bySeverity: {
    [AlertSeverity.INFO]: 18,
    [AlertSeverity.LOW]: 15,
    [AlertSeverity.MEDIUM]: 9,
    [AlertSeverity.HIGH]: 4,
    [AlertSeverity.CRITICAL]: 1
  },
  byStatus: {
    [AlertStatus.ACTIVE]: 8,
    [AlertStatus.ACKNOWLEDGED]: 3,
    [AlertStatus.RESOLVED]: 35,
    [AlertStatus.EXPIRED]: 1,
    [AlertStatus.CANCELLED]: 0
  },
  deliveryRate: 92.5,
  acknowledgmentRate: 78.3,
  resolutionRate: 89.7,
  topAlertTypes: [
    { type: AlertType.SAFETY, count: 15, trend: 'up' },
    { type: AlertType.WEATHER, count: 12, trend: 'stable' },
    { type: AlertType.TRAFFIC, count: 8, trend: 'down' }
  ],
  recentTrends: [
    {
      date: '2024-01-20',
      count: 5,
      severity: {
        [AlertSeverity.INFO]: 2,
        [AlertSeverity.LOW]: 2,
        [AlertSeverity.MEDIUM]: 1,
        [AlertSeverity.HIGH]: 0,
        [AlertSeverity.CRITICAL]: 0
      }
    }
  ]
};

const mockNotificationMetrics: NotificationMetrics = {
  totalNotifications: 1247,
  successfulDeliveries: 1189,
  failedDeliveries: 58,
  byChannel: {
    [NotificationChannel.PUSH]: {
      sent: 645,
      delivered: 612,
      failed: 33,
      deliveryRate: 94.9
    },
    [NotificationChannel.SMS]: {
      sent: 398,
      delivered: 385,
      failed: 13,
      deliveryRate: 96.7
    },
    [NotificationChannel.EMAIL]: {
      sent: 156,
      delivered: 148,
      failed: 8,
      deliveryRate: 94.9
    },
    [NotificationChannel.IN_APP]: {
      sent: 48,
      delivered: 44,
      failed: 4,
      deliveryRate: 91.7
    },
    [NotificationChannel.VOICE]: {
      sent: 0,
      delivered: 0,
      failed: 0,
      deliveryRate: 0
    },
    [NotificationChannel.WEBHOOK]: {
      sent: 0,
      delivered: 0,
      failed: 0,
      deliveryRate: 0
    }
  },
  responseRate: 67.8,
  averageResponseTime: 143, // minutes
  recentActivity: []
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useAlertStore = create<AlertStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      alerts: mockAlerts,
      notifications: mockNotifications,
      selectedAlert: null,
      alertMetrics: mockAlertMetrics,
      notificationMetrics: mockNotificationMetrics,
      searchResults: null,
      isLoading: false,
      error: null,
      
      // Real-time data
      activeAlertsCount: mockAlerts.filter(a => a.status === AlertStatus.ACTIVE).length,
      criticalAlertsCount: mockAlerts.filter(a => a.severity === AlertSeverity.CRITICAL).length,
      unacknowledgedCount: mockAlerts.filter(a => a.status === AlertStatus.ACTIVE && !a.acknowledgedAt).length,
      recentNotifications: mockNotifications.slice(0, 10),

      // Computed values
      get totalAlerts() {
        return get().alerts.length;
      },

      get activeAlerts() {
        return get().alerts.filter(a => a.status === AlertStatus.ACTIVE);
      },

      get criticalAlerts() {
        return get().alerts.filter(a => a.severity === AlertSeverity.CRITICAL);
      },

      get recentAlerts() {
        return get().alerts
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);
      },

      // Basic CRUD operations
      fetchAlerts: async (filters?: AlertSearchFilters) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          let filteredAlerts = mockAlerts;
          
          if (filters) {
            if (filters.types) {
              filteredAlerts = filteredAlerts.filter(a => filters.types!.includes(a.type));
            }
            if (filters.severities) {
              filteredAlerts = filteredAlerts.filter(a => filters.severities!.includes(a.severity));
            }
            if (filters.statuses) {
              filteredAlerts = filteredAlerts.filter(a => filters.statuses!.includes(a.status));
            }
          }
          
          set({ alerts: filteredAlerts, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch alerts',
            isLoading: false 
          });
        }
      },

      fetchAlertById: async (id: AlertId) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const alert = mockAlerts.find(a => a.id === id);
          if (!alert) {
            throw new Error('Alert not found');
          }
          
          set({ selectedAlert: alert, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch alert',
            isLoading: false 
          });
        }
      },

      createAlert: async (request: CreateAlertRequest) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newAlert: Alert = {
            id: `alert-${Date.now()}`,
            ...request,
            status: AlertStatus.ACTIVE,
            actions: request.actions || [],
            affectedZones: request.location ? [request.location.zoneId || ''] : [],
            triggerCondition: {
              type: TriggerType.MANUAL,
              conditions: {}
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'current-user',
            source: 'manual',
            deliveryStats: {
              sent: 0,
              delivered: 0,
              read: 0,
              failed: 0,
              acknowledged: 0
            },
            relatedAlerts: [],
            escalationLevel: 0,
            tags: request.tags || [],
            metadata: request.metadata || {}
          };
          
          set(state => ({ 
            alerts: [newAlert, ...state.alerts],
            isLoading: false 
          }));
          
          return newAlert;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create alert',
            isLoading: false 
          });
          throw error;
        }
      },

      updateAlert: async (request: UpdateAlertRequest) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            alerts: state.alerts.map(a => 
              a.id === request.id 
                ? { 
                    ...a, 
                    ...request.updates, 
                    updatedAt: new Date().toISOString() 
                  }
                : a
            ),
            selectedAlert: state.selectedAlert?.id === request.id 
              ? { 
                  ...state.selectedAlert, 
                  ...request.updates, 
                  updatedAt: new Date().toISOString() 
                }
              : state.selectedAlert,
            isLoading: false
          }));
          
          const updatedAlert = get().alerts.find(a => a.id === request.id);
          if (!updatedAlert) {
            throw new Error('Alert not found after update');
          }
          
          return updatedAlert;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update alert',
            isLoading: false 
          });
          throw error;
        }
      },

      deleteAlert: async (id: AlertId) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            alerts: state.alerts.filter(a => a.id !== id),
            selectedAlert: state.selectedAlert?.id === id ? null : state.selectedAlert,
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete alert',
            isLoading: false 
          });
        }
      },

      // Alert management
      acknowledgeAlert: async (id: AlertId, acknowledgedBy: string, notes?: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            alerts: state.alerts.map(a => 
              a.id === id 
                ? {
                    ...a,
                    status: AlertStatus.ACKNOWLEDGED,
                    acknowledgedBy,
                    acknowledgedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    metadata: { ...a.metadata, acknowledgmentNotes: notes }
                  }
                : a
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to acknowledge alert',
            isLoading: false 
          });
        }
      },

      resolveAlert: async (id: AlertId, resolvedBy: string, resolution?: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            alerts: state.alerts.map(a => 
              a.id === id 
                ? {
                    ...a,
                    status: AlertStatus.RESOLVED,
                    resolvedBy,
                    resolvedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    metadata: { ...a.metadata, resolution }
                  }
                : a
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to resolve alert',
            isLoading: false 
          });
        }
      },

      escalateAlert: async (id: AlertId, escalatedBy: string, reason: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            alerts: state.alerts.map(a => 
              a.id === id 
                ? {
                    ...a,
                    escalationLevel: a.escalationLevel + 1,
                    severity: a.severity === AlertSeverity.HIGH ? AlertSeverity.CRITICAL : 
                             a.severity === AlertSeverity.MEDIUM ? AlertSeverity.HIGH :
                             a.severity === AlertSeverity.LOW ? AlertSeverity.MEDIUM : a.severity,
                    updatedAt: new Date().toISOString(),
                    metadata: { 
                      ...a.metadata, 
                      escalatedBy, 
                      escalationReason: reason,
                      escalatedAt: new Date().toISOString()
                    }
                  }
                : a
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to escalate alert',
            isLoading: false 
          });
        }
      },

      cancelAlert: async (id: AlertId, cancelledBy: string, reason: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            alerts: state.alerts.map(a => 
              a.id === id 
                ? {
                    ...a,
                    status: AlertStatus.CANCELLED,
                    updatedAt: new Date().toISOString(),
                    metadata: { 
                      ...a.metadata, 
                      cancelledBy, 
                      cancellationReason: reason,
                      cancelledAt: new Date().toISOString()
                    }
                  }
                : a
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to cancel alert',
            isLoading: false 
          });
        }
      },

      // Search and filtering
      searchAlerts: async (filters: AlertSearchFilters) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          let results = mockAlerts;
          
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            results = results.filter(a => 
              a.title.toLowerCase().includes(searchLower) ||
              a.message.toLowerCase().includes(searchLower) ||
              a.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
          }
          
          const searchResult: AlertSearchResult = {
            alerts: results,
            total: results.length,
            filters,
            aggregations: {
              typeCounts: mockAlertMetrics.byType,
              severityCounts: mockAlertMetrics.bySeverity,
              statusCounts: mockAlertMetrics.byStatus,
              zoneCounts: { 'zone-001': 15, 'zone-002': 12, 'zone-003': 8 }
            }
          };
          
          set({ searchResults: searchResult, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to search alerts',
            isLoading: false 
          });
        }
      },

      clearSearchResults: () => {
        set({ searchResults: null });
      },

      // Bulk operations
      performBulkOperation: async (operation: Omit<BulkAlertOperation, 'performedAt'>) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const result: BulkAlertResult = {
            operation: {
              ...operation,
              performedAt: new Date().toISOString()
            },
            successful: operation.alertIds,
            failed: [],
            summary: {
              total: operation.alertIds.length,
              successful: operation.alertIds.length,
              failed: 0
            }
          };
          
          // Apply the operation
          if (operation.type === 'acknowledge') {
            set(state => ({
              alerts: state.alerts.map(a => 
                operation.alertIds.includes(a.id) 
                  ? {
                      ...a,
                      status: AlertStatus.ACKNOWLEDGED,
                      acknowledgedBy: operation.performedBy,
                      acknowledgedAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString()
                    }
                  : a
              )
            }));
          }
          
          set({ isLoading: false });
          return result;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to perform bulk operation',
            isLoading: false 
          });
          throw error;
        }
      },

      // Emergency functions
      createEmergencyBroadcast: async (broadcast: Omit<EmergencyBroadcast, 'id' | 'createdAt' | 'deliveryStats'>) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Create corresponding alert
          const emergencyAlert: Alert = {
            id: `emergency-${Date.now()}`,
            type: AlertType.EMERGENCY,
            severity: broadcast.severity,
            status: AlertStatus.ACTIVE,
            title: broadcast.title,
            message: broadcast.message,
            target: broadcast.target,
            location: broadcast.location,
            affectedZones: broadcast.location ? [broadcast.location.zoneId || ''] : [],
            triggerCondition: {
              type: TriggerType.MANUAL,
              conditions: { broadcast: true }
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            expiresAt: broadcast.expiresAt,
            createdBy: broadcast.createdBy,
            source: 'manual',
            deliveryStats: {
              sent: 0,
              delivered: 0,
              read: 0,
              failed: 0,
              acknowledged: 0
            },
            relatedAlerts: [],
            escalationLevel: 2, // Emergency broadcasts start at higher escalation
            tags: ['emergency', 'broadcast'],
            actions: [{
              id: 'emergency-ack',
              label: 'Acknowledge Emergency',
              type: 'danger',
              action: 'acknowledge'
            }],
            metadata: { 
              isEmergencyBroadcast: true,
              channels: broadcast.channels
            }
          };
          
          set(state => ({ 
            alerts: [emergencyAlert, ...state.alerts],
            isLoading: false 
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create emergency broadcast',
            isLoading: false 
          });
        }
      },

      sendTestAlert: async (recipientId: string, channel: NotificationChannel) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const testNotification: Notification = {
            id: `test-${Date.now()}`,
            alertId: 'test-alert',
            recipientId,
            recipientType: 'tourist',
            channel,
            channelData: {},
            title: 'Test Alert',
            message: 'This is a test notification to verify delivery.',
            status: NotificationStatus.SENT,
            attempts: 1,
            maxAttempts: 1,
            scheduledAt: new Date().toISOString(),
            sentAt: new Date().toISOString()
          };
          
          set(state => ({
            notifications: [testNotification, ...state.notifications],
            recentNotifications: [testNotification, ...state.recentNotifications.slice(0, 9)],
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to send test alert',
            isLoading: false 
          });
        }
      },

      // Notifications
      fetchNotifications: async (alertId?: AlertId) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          let notifications = mockNotifications;
          if (alertId) {
            notifications = notifications.filter(n => n.alertId === alertId);
          }
          
          set({ 
            notifications,
            recentNotifications: notifications.slice(0, 10),
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch notifications',
            isLoading: false 
          });
        }
      },

      markNotificationAsRead: async (notificationId: string) => {
        try {
          set(state => ({
            notifications: state.notifications.map(n => 
              n.id === notificationId 
                ? {
                    ...n,
                    status: NotificationStatus.READ,
                    readAt: new Date().toISOString()
                  }
                : n
            )
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to mark notification as read'
          });
        }
      },

      retryFailedNotification: async (notificationId: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            notifications: state.notifications.map(n => 
              n.id === notificationId 
                ? {
                    ...n,
                    status: NotificationStatus.SENT,
                    attempts: n.attempts + 1,
                    sentAt: new Date().toISOString(),
                    lastError: undefined
                  }
                : n
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to retry notification',
            isLoading: false 
          });
        }
      },

      // Analytics
      fetchAlertMetrics: async (dateRange?: { start: string; end: string }) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ alertMetrics: mockAlertMetrics, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch alert metrics',
            isLoading: false 
          });
        }
      },

      fetchNotificationMetrics: async (dateRange?: { start: string; end: string }) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ notificationMetrics: mockNotificationMetrics, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch notification metrics',
            isLoading: false 
          });
        }
      },

      // Real-time updates (simplified mock)
      subscribeToAlerts: () => {
        // In a real app, this would set up WebSocket or SSE connection
        console.log('Subscribed to real-time alerts');
      },

      unsubscribeFromAlerts: () => {
        // In a real app, this would clean up the connection
        console.log('Unsubscribed from real-time alerts');
      },

      // Utility functions
      selectAlert: (alert: Alert | null) => {
        set({ selectedAlert: alert });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      }
    }),
    { name: 'alert-store' }
  )
);
