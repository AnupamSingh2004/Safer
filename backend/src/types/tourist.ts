/**
 * Smart Tourist Safety System - Backend Tourist Type Definitions
 * Comprehensive type definitions for tourist management (Backend)
 */

// ============================================================================
// BASIC TYPES
// ============================================================================

export type TouristId = string;
export type DeviceId = string;
export type VerificationId = string;
export type DatabaseId = string;

// ============================================================================
// ENUMS
// ============================================================================

export enum TouristStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EMERGENCY = 'emergency',
  CHECKED_OUT = 'checked_out',
  MISSING = 'missing',
  SAFE = 'safe'
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended'
}

export enum DocumentType {
  PASSPORT = 'passport',
  NATIONAL_ID = 'national_id',
  DRIVERS_LICENSE = 'drivers_license',
  VISA = 'visa',
  STUDENT_ID = 'student_id',
  OTHER = 'other'
}

export enum EmergencyContactRelation {
  SPOUSE = 'spouse',
  PARENT = 'parent',
  CHILD = 'child',
  SIBLING = 'sibling',
  FRIEND = 'friend',
  COLLEAGUE = 'colleague',
  OTHER = 'other'
}

export enum AlertLevel {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VERIFY = 'verify',
  ACTIVATE = 'activate',
  DEACTIVATE = 'deactivate',
  LOCATION_UPDATE = 'location_update',
  CHECK_IN = 'check_in',
  EMERGENCY = 'emergency',
  ALERT_CREATE = 'alert_create',
  ALERT_RESOLVE = 'alert_resolve'
}

// ============================================================================
// DATABASE SCHEMA TYPES
// ============================================================================

export interface TouristEntity {
  id: DatabaseId;
  tourist_id: TouristId;
  first_name: string;
  last_name: string;
  full_name: string;
  display_name: string;
  date_of_birth: Date;
  gender: string;
  nationality: string;
  preferred_language: string;
  spoken_languages: string[];
  
  // Contact Information (JSON fields)
  contact_info: {
    phone: string;
    email: string;
    alternate_phone?: string;
    alternate_email?: string;
  };
  
  home_address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Status and Verification
  status: TouristStatus;
  verification_status: VerificationStatus;
  is_active: boolean;
  
  // Current Location
  current_location?: {
    coordinates: {
      latitude: number;
      longitude: number;
      altitude?: number;
      accuracy?: number;
      heading?: number;
      speed?: number;
    };
    address?: string;
    location_name?: string;
    timestamp: string;
    source: string;
  };
  
  last_known_location?: any;
  current_zone_id?: string;
  visited_zones: string[];
  
  // Travel Details (JSON field)
  travel_details: {
    purpose: string;
    arrival_date: string;
    departure_date: string;
    accommodation?: any;
    transportation?: any;
    group_size: number;
    has_local_guide: boolean;
    guide_contact_info?: any;
    planned_destinations: string[];
    special_requirements?: string[];
    insurance_details?: any;
  };
  
  // Health Information (JSON field)
  health_info?: {
    medical_conditions: string[];
    medications: string[];
    allergies: string[];
    blood_type?: string;
    emergency_medical_info?: string;
    vaccination_status?: any[];
    health_insurance?: any;
  };
  
  // Safety Status (JSON field)
  safety_status: {
    level: AlertLevel;
    last_checked_in: string;
    last_location_update: string;
    is_in_safe_zone: boolean;
    current_risk_score: number;
    active_alerts: string[];
    missed_check_ins: number;
    emergency_contacts_notified: boolean;
    last_emergency_alert?: string;
  };
  
  // Tracking Preferences (JSON field)
  tracking_preferences: {
    share_location: boolean;
    share_with_emergency_contacts: boolean;
    share_with_tour_guides: boolean;
    tracking_accuracy: string;
    update_frequency: number;
    allow_offline_tracking: boolean;
    enable_geofencing: boolean;
    emergency_auto_share: boolean;
  };
  
  // Privacy Consent (JSON field)
  privacy_consent: {
    data_collection: boolean;
    location_tracking: boolean;
    emergency_sharing: boolean;
    analytics_usage: boolean;
    third_party_sharing: boolean;
    consent_date: string;
    consent_version: string;
  };
  
  // System fields
  registration_date: Date;
  last_login_date?: Date;
  last_update_date: Date;
  notes?: string[];
  
  // Blockchain Integration
  blockchain_id?: string;
  blockchain_verified: boolean;
  last_blockchain_update?: Date;
  
  // Database metadata
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by: string;
}

export interface EmergencyContactEntity {
  id: DatabaseId;
  tourist_id: TouristId;
  name: string;
  relation: EmergencyContactRelation;
  phone: string;
  email?: string;
  address?: string;
  is_primary: boolean;
  is_local: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IdentityDocumentEntity {
  id: DatabaseId;
  tourist_id: TouristId;
  type: DocumentType;
  document_number: string;
  issuing_country: string;
  issuing_authority?: string;
  issue_date: Date;
  expiry_date: Date;
  is_verified: boolean;
  verification_date?: Date;
  document_image_url?: string;
  document_hash?: string; // For integrity verification
  notes?: string;
  created_at: Date;
  updated_at: Date;
  verified_by?: string;
}

export interface LocationHistoryEntity {
  id: DatabaseId;
  tourist_id: TouristId;
  coordinates: {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy?: number;
    heading?: number;
    speed?: number;
  };
  address?: string;
  location_name?: string;
  zone_id?: string;
  zone_name?: string;
  visit_duration?: number;
  is_current_location: boolean;
  source: string;
  device_id?: DeviceId;
  timestamp: Date;
  created_at: Date;
}

export interface DeviceInfoEntity {
  id: DatabaseId;
  device_id: DeviceId;
  tourist_id: TouristId;
  type: string;
  model?: string;
  os?: string;
  os_version?: string;
  app_version?: string;
  push_token?: string;
  is_active: boolean;
  is_primary: boolean;
  last_seen: Date;
  battery_level?: number;
  connection_status: string;
  created_at: Date;
  updated_at: Date;
}

export interface TouristAlertEntity {
  id: DatabaseId;
  tourist_id: TouristId;
  type: string;
  level: AlertLevel;
  title: string;
  message: string;
  location?: any;
  is_active: boolean;
  is_acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: Date;
  resolved_at?: Date;
  actions: string[];
  metadata: any;
  created_at: Date;
  updated_at: Date;
}

export interface BiometricDataEntity {
  id: DatabaseId;
  tourist_id: TouristId;
  type: string;
  hash: string;
  confidence: number;
  captured_at: Date;
  device_id: DeviceId;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface VerificationRecordEntity {
  id: DatabaseId;
  verification_id: VerificationId;
  tourist_id: TouristId;
  status: VerificationStatus;
  method: string;
  verified_by?: string;
  verification_date: Date;
  expiry_date?: Date;
  details: any;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// AUDIT TRAIL
// ============================================================================

export interface TouristAuditLog {
  id: DatabaseId;
  tourist_id: TouristId;
  action: AuditAction;
  entity_type: string;
  entity_id?: string;
  old_values?: any;
  new_values?: any;
  performed_by: string;
  performed_at: Date;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  reason?: string;
  metadata?: any;
}

// ============================================================================
// SERVICE LAYER TYPES
// ============================================================================

export interface TouristServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
    processingTime: number;
  };
}

export interface TouristQueryOptions {
  include?: {
    emergencyContacts?: boolean;
    documents?: boolean;
    locationHistory?: boolean;
    devices?: boolean;
    alerts?: boolean;
    biometrics?: boolean;
    verificationRecords?: boolean;
    auditLogs?: boolean;
  };
  filters?: {
    status?: TouristStatus[];
    verificationStatus?: VerificationStatus[];
    nationality?: string[];
    alertLevel?: AlertLevel[];
    zoneId?: string[];
    isActive?: boolean;
    hasActiveAlerts?: boolean;
    deviceStatus?: string[];
    dateRange?: {
      field: 'registration_date' | 'last_seen' | 'arrival_date' | 'departure_date';
      start: Date;
      end: Date;
    };
  };
  search?: {
    query: string;
    fields: string[];
  };
  pagination?: {
    page: number;
    limit: number;
    offset?: number;
  };
  sorting?: {
    field: string;
    direction: 'ASC' | 'DESC';
  }[];
}

export interface TouristBatchOperation {
  type: 'create' | 'update' | 'delete' | 'verify' | 'activate' | 'deactivate';
  tourists: any[];
  options?: {
    validateAll?: boolean;
    stopOnError?: boolean;
    dryRun?: boolean;
  };
  performedBy: string;
  reason?: string;
}

export interface TouristBatchResult {
  operation: TouristBatchOperation;
  results: Array<{
    index: number;
    touristId?: TouristId;
    success: boolean;
    error?: string;
    data?: any;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
    duration: number;
  };
  errors: string[];
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface TouristValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface TouristValidationResult {
  isValid: boolean;
  errors: TouristValidationError[];
  warnings: TouristValidationError[];
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface TouristNotification {
  id: string;
  touristId: TouristId;
  type: 'alert' | 'reminder' | 'update' | 'emergency' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  channels: ('push' | 'sms' | 'email' | 'in_app')[];
  scheduledFor?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  metadata?: any;
  createdAt: Date;
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export interface TouristExportOptions {
  format: 'csv' | 'excel' | 'json' | 'pdf';
  fields: string[];
  filters: TouristQueryOptions['filters'];
  includeRelatedData: boolean;
  includePersonalData: boolean;
  anonymize: boolean;
  reason: string;
  requestedBy: string;
}

export interface TouristExportResult {
  exportId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  recordCount?: number;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
  expiresAt: Date;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface TouristAnalytics {
  overview: {
    totalTourists: number;
    activeTourists: number;
    verifiedTourists: number;
    touristsWithAlerts: number;
    averageStayDuration: number;
    checkInCompliance: number;
  };
  
  demographics: {
    byNationality: Record<string, number>;
    byGender: Record<string, number>;
    byAgeGroup: Record<string, number>;
    byLanguage: Record<string, number>;
  };
  
  status: {
    byStatus: Record<TouristStatus, number>;
    byVerificationStatus: Record<VerificationStatus, number>;
    byAlertLevel: Record<AlertLevel, number>;
  };
  
  location: {
    byZone: Record<string, number>;
    popularDestinations: Array<{
      name: string;
      visitCount: number;
      averageDuration: number;
    }>;
    heatmapData: Array<{
      latitude: number;
      longitude: number;
      intensity: number;
    }>;
  };
  
  trends: {
    registrations: Array<{
      date: string;
      count: number;
    }>;
    checkIns: Array<{
      date: string;
      count: number;
    }>;
    alerts: Array<{
      date: string;
      count: number;
      level: AlertLevel;
    }>;
  };
  
  performance: {
    averageResponseTime: number;
    systemUptime: number;
    dataAccuracy: number;
    userSatisfaction: number;
  };
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface TouristServiceConfig {
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    ssl: boolean;
    pool: {
      min: number;
      max: number;
      idle: number;
    };
  };
  
  cache: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
    provider: 'redis' | 'memory';
  };
  
  validation: {
    strictMode: boolean;
    requireDocumentVerification: boolean;
    requireBiometricData: boolean;
    maxEmergencyContacts: number;
    maxDocuments: number;
  };
  
  notifications: {
    enabled: boolean;
    providers: string[];
    maxRetries: number;
    batchSize: number;
  };
  
  tracking: {
    maxLocationHistory: number;
    locationAccuracyThreshold: number;
    batteryLevelThreshold: number;
    offlineTimeout: number;
  };
  
  security: {
    encryptPersonalData: boolean;
    hashBiometricData: boolean;
    auditAllOperations: boolean;
    retentionPeriod: number;
  };
}

export default {
  TouristStatus,
  VerificationStatus,
  DocumentType,
  EmergencyContactRelation,
  AlertLevel,
  AuditAction,
};
