/**
 * Smart Tourist Safety System - Alert Type Definitions
 * Comprehensive type definitions for alert and notification management
 */

// ============================================================================
// BASIC TYPES
// ============================================================================

export type AlertId = string;
export type NotificationId = string;
export type ChannelId = string;

// ============================================================================
// ENUMS
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

export enum TriggerType {
  MANUAL = 'manual',
  AUTOMATIC = 'automatic',
  SCHEDULED = 'scheduled',
  GEOFENCE = 'geofence',
  SENSOR = 'sensor',
  THRESHOLD = 'threshold',
  PATTERN = 'pattern'
}

// ============================================================================
// COORDINATE & LOCATION TYPES
// ============================================================================

export interface AlertLocation {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address?: string;
  landmark?: string;
  radius?: number; // meters
  zoneId?: string;
  zoneName?: string;
}

export interface GeofenceAlert {
  geofenceId: string;
  geofenceName: string;
  triggerType: 'enter' | 'exit' | 'dwell';
  dwellTime?: number; // minutes
}

// ============================================================================
// TARGET & AUDIENCE
// ============================================================================

export interface AlertTarget {
  type: 'all' | 'tourists' | 'staff' | 'authorities' | 'custom';
  criteria?: {
    zones?: string[];
    nationalities?: string[];
    languages?: string[];
    touristIds?: string[];
    userIds?: string[];
    roles?: string[];
    groups?: string[];
  };
  estimatedReach: number;
}

export interface NotificationPreferences {
  channels: NotificationChannel[];
  quietHours?: {
    start: string; // HH:mm
    end: string;   // HH:mm
  };
  language: string;
  urgencyThreshold: AlertSeverity;
  categories: AlertType[];
}

// ============================================================================
// TRIGGER CONDITIONS
// ============================================================================

export interface TriggerCondition {
  type: TriggerType;
  conditions: Record<string, any>;
  schedule?: {
    startDate?: string;
    endDate?: string;
    recurrence?: 'once' | 'daily' | 'weekly' | 'monthly';
    times?: string[]; // HH:mm format
    daysOfWeek?: number[]; // 0-6, Sunday=0
  };
}

export interface ThresholdCondition {
  metric: string;
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
  value: number;
  duration?: number; // minutes
}

export interface PatternCondition {
  patternType: 'anomaly' | 'trend' | 'sequence';
  parameters: Record<string, any>;
  sensitivity: 'low' | 'medium' | 'high';
}

// ============================================================================
// CONTENT & TEMPLATES
// ============================================================================

export interface AlertContent {
  title: string;
  message: string;
  shortMessage?: string; // for SMS/push
  htmlContent?: string;
  imageUrl?: string;
  actionButtons?: AlertAction[];
  metadata: Record<string, any>;
}

export interface LocalizedContent {
  [languageCode: string]: {
    title: string;
    message: string;
    shortMessage?: string;
    htmlContent?: string;
  };
}

export interface AlertAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  action: 'acknowledge' | 'dismiss' | 'escalate' | 'contact' | 'navigate' | 'custom';
  payload?: Record<string, any>;
}

export interface AlertTemplate {
  id: string;
  name: string;
  type: AlertType;
  severity: AlertSeverity;
  content: AlertContent;
  localizedContent?: LocalizedContent;
  defaultChannels: NotificationChannel[];
  variables: string[]; // placeholders like {{touristName}}
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// MAIN ALERT INTERFACE
// ============================================================================

export interface Alert {
  // Basic Information
  id: AlertId;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  
  // Content
  title: string;
  message: string;
  shortMessage?: string;
  htmlContent?: string;
  imageUrl?: string;
  actions: AlertAction[];
  
  // Targeting & Scope
  target: AlertTarget;
  location?: AlertLocation;
  geofence?: GeofenceAlert;
  affectedZones: string[];
  
  // Triggering & Conditions
  triggerCondition: TriggerCondition;
  triggerData?: Record<string, any>;
  
  // Timing
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  expiresAt?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  
  // Attribution
  createdBy: string;
  acknowledgedBy?: string;
  resolvedBy?: string;
  source: 'manual' | 'automatic' | 'imported' | 'escalated';
  
  // Tracking
  deliveryStats: {
    sent: number;
    delivered: number;
    read: number;
    failed: number;
    acknowledged: number;
  };
  
  // Related Data
  relatedAlerts: AlertId[];
  parentAlertId?: AlertId;
  escalationLevel: number;
  tags: string[];
  
  // Additional metadata
  metadata: Record<string, any>;
}

// ============================================================================
// NOTIFICATION INTERFACE
// ============================================================================

export interface Notification {
  id: NotificationId;
  alertId: AlertId;
  
  // Recipient
  recipientId: string;
  recipientType: 'tourist' | 'staff' | 'authority' | 'external';
  
  // Channel & Delivery
  channel: NotificationChannel;
  channelData: Record<string, any>; // email address, phone number, device token, etc.
  
  // Content (personalized)
  title: string;
  message: string;
  data?: Record<string, any>;
  
  // Status & Tracking
  status: NotificationStatus;
  attempts: number;
  maxAttempts: number;
  
  // Timing
  scheduledAt: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  failedAt?: string;
  
  // Error handling
  lastError?: string;
  retryAfter?: string;
  
  // Response tracking
  response?: {
    action: string;
    timestamp: string;
    data?: Record<string, any>;
  };
}

// ============================================================================
// ESCALATION & WORKFLOW
// ============================================================================

export interface EscalationRule {
  id: string;
  name: string;
  alertTypes: AlertType[];
  severities: AlertSeverity[];
  
  conditions: {
    noAcknowledgment: number; // minutes
    noResolution: number;     // minutes
    failedDeliveries: number;
  };
  
  escalationSteps: EscalationStep[];
  isActive: boolean;
}

export interface EscalationStep {
  order: number;
  delay: number; // minutes from previous step
  targets: AlertTarget;
  channels: NotificationChannel[];
  requiresManualApproval: boolean;
}

export interface AlertWorkflow {
  id: string;
  name: string;
  alertTypes: AlertType[];
  
  steps: WorkflowStep[];
  autoTransitions: WorkflowTransition[];
  
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'notification' | 'approval' | 'action' | 'wait';
  config: Record<string, any>;
  requiredRoles?: string[];
  timeout?: number; // minutes
}

export interface WorkflowTransition {
  from: string; // step id
  to: string;   // step id
  condition: string; // expression
  delay?: number; // minutes
}

// ============================================================================
// ANALYTICS & REPORTING
// ============================================================================

export interface AlertMetrics {
  totalAlerts: number;
  activeAlerts: number;
  resolvedAlerts: number;
  averageResolutionTime: number; // minutes
  
  byType: Record<AlertType, number>;
  bySeverity: Record<AlertSeverity, number>;
  byStatus: Record<AlertStatus, number>;
  
  deliveryRate: number; // percentage
  acknowledgmentRate: number; // percentage
  resolutionRate: number; // percentage
  
  topAlertTypes: Array<{
    type: AlertType;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  
  recentTrends: Array<{
    date: string;
    count: number;
    severity: Record<AlertSeverity, number>;
  }>;
}

export interface NotificationMetrics {
  totalNotifications: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  
  byChannel: Record<NotificationChannel, {
    sent: number;
    delivered: number;
    failed: number;
    deliveryRate: number;
  }>;
  
  responseRate: number; // percentage
  averageResponseTime: number; // minutes
  
  recentActivity: Array<{
    timestamp: string;
    channel: NotificationChannel;
    status: NotificationStatus;
    count: number;
  }>;
}

// ============================================================================
// SEARCH & FILTERING
// ============================================================================

export interface AlertSearchFilters {
  search?: string;
  types?: AlertType[];
  severities?: AlertSeverity[];
  statuses?: AlertStatus[];
  sources?: ('manual' | 'automatic' | 'imported' | 'escalated')[];
  zones?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  createdBy?: string[];
  tags?: string[];
  hasLocation?: boolean;
  isExpired?: boolean;
  escalationLevel?: number[];
  sortBy?: 'createdAt' | 'severity' | 'status' | 'type' | 'resolvedAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface AlertSearchResult {
  alerts: Alert[];
  total: number;
  filters: AlertSearchFilters;
  aggregations: {
    typeCounts: Record<AlertType, number>;
    severityCounts: Record<AlertSeverity, number>;
    statusCounts: Record<AlertStatus, number>;
    zoneCounts: Record<string, number>;
  };
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateAlertRequest {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  shortMessage?: string;
  imageUrl?: string;
  target: AlertTarget;
  location?: AlertLocation;
  expiresAt?: string;
  scheduledAt?: string;
  actions?: AlertAction[];
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateAlertRequest {
  id: AlertId;
  updates: Partial<Alert>;
  reason?: string;
}

export interface BulkAlertOperation {
  type: 'acknowledge' | 'resolve' | 'cancel' | 'escalate' | 'update_status';
  alertIds: AlertId[];
  data?: Record<string, any>;
  reason?: string;
  performedBy: string;
  performedAt: string;
}

export interface BulkAlertResult {
  operation: BulkAlertOperation;
  successful: AlertId[];
  failed: Array<{
    alertId: AlertId;
    error: string;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

export interface AlertSubscription {
  id: string;
  userId: string;
  filters: AlertSearchFilters;
  channels: NotificationChannel[];
  preferences: NotificationPreferences;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyBroadcast {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  target: AlertTarget;
  channels: NotificationChannel[];
  location?: AlertLocation;
  expiresAt: string;
  createdBy: string;
  createdAt: string;
  
  deliveryStats: {
    targeted: number;
    sent: number;
    delivered: number;
    failed: number;
  };
}

// ============================================================================
// INTEGRATION TYPES
// ============================================================================

export interface ExternalAlertSource {
  id: string;
  name: string;
  type: 'weather_api' | 'traffic_api' | 'government' | 'news' | 'custom';
  endpoint: string;
  authentication: Record<string, any>;
  mapping: Record<string, string>; // field mappings
  filters: Record<string, any>;
  isActive: boolean;
  lastSync: string;
  nextSync: string;
}

export interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[]; // alert.created, alert.resolved, etc.
  headers: Record<string, string>;
  authentication?: {
    type: 'bearer' | 'basic' | 'api_key';
    credentials: Record<string, string>;
  };
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
    maxDelay: number;
  };
  isActive: boolean;
}

export interface AlertAutomation {
  id: string;
  name: string;
  trigger: {
    event: string;
    conditions: Record<string, any>;
  };
  actions: Array<{
    type: 'create_alert' | 'send_notification' | 'escalate' | 'webhook' | 'script';
    config: Record<string, any>;
    delay?: number; // minutes
  }>;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}
