/**
 * Smart Tourist Safety System - Backend Alert Types
 * Database entities and service types for alert management
 */

// ============================================================================
// ENUMS (SHARED WITH FRONTEND)
// ============================================================================

export enum AlertType {
  SAFETY = 'safety',
  LOCATION = 'location',
  HEALTH = 'health',
  SECURITY = 'security',
  WEATHER = 'weather',
  TRAFFIC = 'traffic',
  EMERGENCY = 'emergency',
  SYSTEM = 'system',
  MAINTENANCE = 'maintenance',
  INFORMATION = 'information'
}

export enum AlertSeverity {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

export enum NotificationChannel {
  PUSH = 'push',
  SMS = 'sms',
  EMAIL = 'email',
  IN_APP = 'in_app',
  VOICE = 'voice',
  WEBHOOK = 'webhook'
}

// ============================================================================
// DATABASE ENTITIES
// ============================================================================

export interface AlertEntity {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  short_message?: string;
  html_content?: string;
  image_url?: string;
  
  // Targeting
  target_type: 'all' | 'tourists' | 'staff' | 'authorities' | 'custom';
  target_criteria?: Record<string, any>;
  estimated_reach: number;
  
  // Location data
  location_coordinates?: {
    latitude: number;
    longitude: number;
  };
  location_address?: string;
  location_landmark?: string;
  location_radius?: number;
  zone_id?: string;
  zone_name?: string;
  affected_zones: string[];
  
  // Geofence specific
  geofence_id?: string;
  geofence_name?: string;
  geofence_trigger?: 'enter' | 'exit' | 'dwell';
  geofence_dwell_time?: number;
  
  // Trigger information
  trigger_type: 'manual' | 'automatic' | 'scheduled' | 'geofence' | 'sensor' | 'threshold' | 'pattern';
  trigger_conditions?: Record<string, any>;
  trigger_data?: Record<string, any>;
  
  // Timing
  created_at: Date;
  updated_at: Date;
  scheduled_at?: Date;
  expires_at?: Date;
  acknowledged_at?: Date;
  resolved_at?: Date;
  
  // Attribution
  created_by: string;
  acknowledged_by?: string;
  resolved_by?: string;
  source: 'manual' | 'automatic' | 'imported' | 'escalated';
  
  // Tracking
  delivery_stats: {
    sent: number;
    delivered: number;
    read: number;
    failed: number;
    acknowledged: number;
  };
  
  // Relationships
  related_alert_ids: string[];
  parent_alert_id?: string;
  escalation_level: number;
  tags: string[];
  
  // Metadata
  metadata: Record<string, any>;
  
  // Audit fields
  version: number;
  created_by_ip?: string;
  updated_by_ip?: string;
  deleted_at?: Date;
  deleted_by?: string;
}

export interface NotificationEntity {
  id: string;
  alert_id: string;
  
  // Recipient information
  recipient_id: string;
  recipient_type: 'tourist' | 'staff' | 'authority' | 'external';
  recipient_name?: string;
  recipient_email?: string;
  recipient_phone?: string;
  
  // Channel and delivery
  channel: NotificationChannel;
  channel_data: Record<string, any>;
  
  // Content (personalized)
  title: string;
  message: string;
  data?: Record<string, any>;
  
  // Status and tracking
  status: NotificationStatus;
  attempts: number;
  max_attempts: number;
  
  // Timing
  scheduled_at: Date;
  sent_at?: Date;
  delivered_at?: Date;
  read_at?: Date;
  failed_at?: Date;
  
  // Error handling
  last_error?: string;
  retry_after?: Date;
  
  // Response tracking
  response_action?: string;
  response_timestamp?: Date;
  response_data?: Record<string, any>;
  
  // Audit
  created_at: Date;
  updated_at: Date;
}

export interface AlertActionEntity {
  id: string;
  alert_id: string;
  action_id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  action: 'acknowledge' | 'dismiss' | 'escalate' | 'contact' | 'navigate' | 'custom';
  payload?: Record<string, any>;
  order_index: number;
  is_active: boolean;
  created_at: Date;
}

export interface AlertTemplateEntity {
  id: string;
  name: string;
  description?: string;
  type: AlertType;
  severity: AlertSeverity;
  
  // Content
  title_template: string;
  message_template: string;
  short_message_template?: string;
  html_content_template?: string;
  
  // Localization
  localized_content?: Record<string, {
    title: string;
    message: string;
    short_message?: string;
    html_content?: string;
  }>;
  
  // Configuration
  default_channels: NotificationChannel[];
  variables: string[];
  default_target_type: string;
  default_expires_hours?: number;
  
  // Status
  is_active: boolean;
  is_system_template: boolean;
  
  // Attribution
  created_by: string;
  updated_by?: string;
  created_at: Date;
  updated_at: Date;
  
  // Usage tracking
  usage_count: number;
  last_used_at?: Date;
}

export interface EscalationRuleEntity {
  id: string;
  name: string;
  description?: string;
  
  // Conditions
  alert_types: AlertType[];
  severities: AlertSeverity[];
  no_acknowledgment_minutes: number;
  no_resolution_minutes: number;
  failed_deliveries_threshold: number;
  
  // Additional conditions
  conditions: Record<string, any>;
  
  // Configuration
  escalation_steps: Array<{
    order: number;
    delay_minutes: number;
    target_type: string;
    target_criteria?: Record<string, any>;
    channels: NotificationChannel[];
    requires_approval: boolean;
  }>;
  
  // Status
  is_active: boolean;
  priority: number;
  
  // Attribution
  created_by: string;
  updated_by?: string;
  created_at: Date;
  updated_at: Date;
  
  // Tracking
  trigger_count: number;
  last_triggered_at?: Date;
}

export interface AlertSubscriptionEntity {
  id: string;
  user_id: string;
  name?: string;
  
  // Filters
  alert_types?: AlertType[];
  severities?: AlertSeverity[];
  zones?: string[];
  keywords?: string[];
  
  // Preferences
  channels: NotificationChannel[];
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  language: string;
  urgency_threshold: AlertSeverity;
  
  // Status
  is_active: boolean;
  
  // Timing
  created_at: Date;
  updated_at: Date;
  last_notification_at?: Date;
  
  // Statistics
  notifications_sent: number;
  notifications_read: number;
}

export interface EmergencyBroadcastEntity {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  
  // Targeting
  target_type: string;
  target_criteria?: Record<string, any>;
  location_coordinates?: {
    latitude: number;
    longitude: number;
  };
  location_radius?: number;
  
  // Configuration
  channels: NotificationChannel[];
  expires_at: Date;
  
  // Status
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  scheduled_at?: Date;
  sent_at?: Date;
  cancelled_at?: Date;
  
  // Statistics
  targeted_count: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  read_count: number;
  
  // Attribution
  created_by: string;
  cancelled_by?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AlertTimelineEntity {
  id: string;
  alert_id: string;
  event_type: string;
  event_description: string;
  event_data?: Record<string, any>;
  user_id?: string;
  user_name?: string;
  is_system_generated: boolean;
  created_at: Date;
}

export interface AlertAttachmentEntity {
  id: string;
  alert_id: string;
  filename: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  file_path: string;
  url: string;
  thumbnail_url?: string;
  description?: string;
  is_evidence: boolean;
  uploaded_by: string;
  uploaded_at: Date;
  metadata?: Record<string, any>;
}

// ============================================================================
// SERVICE LAYER TYPES
// ============================================================================

export interface AlertServiceConfig {
  maxConcurrentNotifications: number;
  defaultRetryAttempts: number;
  notificationTimeout: number;
  escalationCheckInterval: number;
  cleanupOldAlertsAfterDays: number;
  enableRealTimeUpdates: boolean;
  webhookTimeout: number;
  batchNotificationSize: number;
}

export interface CreateAlertServiceRequest {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  shortMessage?: string;
  htmlContent?: string;
  imageUrl?: string;
  
  // Targeting
  targetType: 'all' | 'tourists' | 'staff' | 'authorities' | 'custom';
  targetCriteria?: Record<string, any>;
  
  // Location
  location?: {
    coordinates?: { latitude: number; longitude: number };
    address?: string;
    landmark?: string;
    radius?: number;
    zoneId?: string;
  };
  
  // Timing
  scheduledAt?: Date;
  expiresAt?: Date;
  
  // Configuration
  actions?: Array<{
    id: string;
    label: string;
    type: 'primary' | 'secondary' | 'danger';
    action: string;
    payload?: Record<string, any>;
  }>;
  
  // Metadata
  tags?: string[];
  metadata?: Record<string, any>;
  
  // Attribution
  createdBy: string;
  source?: 'manual' | 'automatic' | 'imported' | 'escalated';
  
  // Trigger information
  triggerType?: string;
  triggerData?: Record<string, any>;
}

export interface UpdateAlertServiceRequest {
  alertId: string;
  updates: {
    status?: AlertStatus;
    severity?: AlertSeverity;
    title?: string;
    message?: string;
    expiresAt?: Date;
    acknowledgedBy?: string;
    resolvedBy?: string;
    tags?: string[];
    metadata?: Record<string, any>;
  };
  updatedBy: string;
  reason?: string;
}

export interface AlertQueryOptions {
  types?: AlertType[];
  severities?: AlertSeverity[];
  statuses?: AlertStatus[];
  sources?: string[];
  zones?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  createdBy?: string[];
  tags?: string[];
  search?: string;
  hasLocation?: boolean;
  isExpired?: boolean;
  escalationLevel?: number[];
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  includeDeleted?: boolean;
}

export interface AlertStatisticsQuery {
  dateRange?: {
    start: Date;
    end: Date;
  };
  zones?: string[];
  types?: AlertType[];
  groupBy?: 'day' | 'week' | 'month' | 'zone' | 'type';
}

export interface NotificationServiceRequest {
  alertId: string;
  recipientId: string;
  recipientType: 'tourist' | 'staff' | 'authority' | 'external';
  channel: NotificationChannel;
  channelData: Record<string, any>;
  title: string;
  message: string;
  data?: Record<string, any>;
  scheduledAt?: Date;
  maxAttempts?: number;
}

export interface BulkNotificationRequest {
  alertId: string;
  notifications: NotificationServiceRequest[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  batchSize?: number;
  delayBetweenBatches?: number;
}

export interface EscalationCheckResult {
  alertId: string;
  shouldEscalate: boolean;
  reason: string;
  nextLevel: number;
  recommendedActions: string[];
  additionalTargets?: Array<{
    type: string;
    criteria: Record<string, any>;
    channels: NotificationChannel[];
  }>;
}

export interface AlertAnalyticsData {
  alertId: string;
  createdAt: Date;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  responseTime?: number;
  resolutionTime?: number;
  escalationLevel: number;
  notificationsSent: number;
  notificationsDelivered: number;
  notificationsFailed: number;
  acknowledgedCount: number;
  zoneId?: string;
  createdBy: string;
  source: string;
}

export interface AlertPerformanceMetrics {
  totalAlerts: number;
  activeAlerts: number;
  resolvedAlerts: number;
  averageResponseTime: number;
  averageResolutionTime: number;
  escalationRate: number;
  falseAlarmRate: number;
  deliverySuccessRate: number;
  acknowledgmentRate: number;
  
  byType: Record<AlertType, {
    count: number;
    averageResponseTime: number;
    resolutionRate: number;
  }>;
  
  bySeverity: Record<AlertSeverity, {
    count: number;
    averageResponseTime: number;
    escalationRate: number;
  }>;
  
  byZone: Record<string, {
    count: number;
    averageResponseTime: number;
    resolutionRate: number;
  }>;
  
  trends: Array<{
    date: string;
    totalAlerts: number;
    resolvedAlerts: number;
    averageResponseTime: number;
  }>;
}

// ============================================================================
// EXTERNAL INTEGRATION TYPES
// ============================================================================

export interface WebhookPayload {
  event: string;
  timestamp: Date;
  alertId: string;
  alert: AlertEntity;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface ExternalAlertData {
  sourceId: string;
  sourceName: string;
  externalId: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  metadata: Record<string, any>;
  receivedAt: Date;
}

export interface AlertIntegrationConfig {
  id: string;
  name: string;
  type: 'weather_api' | 'traffic_api' | 'government' | 'news' | 'custom';
  endpoint: string;
  authentication: Record<string, any>;
  fieldMapping: Record<string, string>;
  filters: Record<string, any>;
  transformationRules: Array<{
    condition: string;
    action: string;
    parameters: Record<string, any>;
  }>;
  isActive: boolean;
  lastSyncAt?: Date;
  nextSyncAt?: Date;
  syncInterval: number; // minutes
  errorCount: number;
  lastError?: string;
}

// ============================================================================
// VALIDATION AND ERROR TYPES
// ============================================================================

export interface AlertValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface AlertServiceError extends Error {
  code: string;
  details?: Record<string, any>;
  alertId?: string;
  operation?: string;
}

export interface NotificationDeliveryError {
  notificationId: string;
  channel: NotificationChannel;
  error: string;
  errorCode?: string;
  isRetryable: boolean;
  nextRetryAt?: Date;
}

// ============================================================================
// QUEUE AND PROCESSING TYPES
// ============================================================================

export interface AlertProcessingJob {
  id: string;
  type: 'create_alert' | 'send_notification' | 'escalate_alert' | 'cleanup_expired';
  priority: number;
  data: Record<string, any>;
  attempts: number;
  maxAttempts: number;
  scheduledAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  error?: string;
}

export interface NotificationBatch {
  id: string;
  alertId: string;
  notifications: NotificationServiceRequest[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  successCount: number;
  failureCount: number;
  errors: NotificationDeliveryError[];
}

// ============================================================================
// AUDIT AND LOGGING TYPES
// ============================================================================

export interface AlertAuditLog {
  id: string;
  alertId: string;
  action: string;
  userId?: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface AlertSystemLog {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  component: string;
  message: string;
  alertId?: string;
  notificationId?: string;
  error?: string;
  stackTrace?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type AlertEntityWithRelations = AlertEntity & {
  notifications?: NotificationEntity[];
  actions?: AlertActionEntity[];
  timeline?: AlertTimelineEntity[];
  attachments?: AlertAttachmentEntity[];
  parentAlert?: AlertEntity;
  childAlerts?: AlertEntity[];
  relatedAlerts?: AlertEntity[];
};

export type NotificationEntityWithAlert = NotificationEntity & {
  alert?: AlertEntity;
};

export type AlertServiceResult<T = any> = {
  success: boolean;
  data?: T;
  error?: AlertServiceError;
  warnings?: string[];
  metadata?: Record<string, any>;
};

export type BatchOperationResult = {
  totalProcessed: number;
  successful: number;
  failed: number;
  errors: Array<{
    id: string;
    error: string;
  }>;
  processingTime: number;
  metadata?: Record<string, any>;
};
