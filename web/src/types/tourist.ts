/**
 * Smart Tourist Safety System - Tourist Type Definitions
 * Comprehensive type definitions for tourist management
 */

// ============================================================================
// BASIC TYPES
// ============================================================================

export type TouristId = string;
export type DeviceId = string;
export type VerificationId = string;

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

// ============================================================================
// COORDINATE & LOCATION TYPES
// ============================================================================

export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
}

export interface LocationData {
  coordinates: Coordinates;
  address?: string;
  locationName?: string;
  timestamp: string;
  source: 'gps' | 'network' | 'manual' | 'check_in';
}

export interface LocationHistory {
  id: string;
  touristId: TouristId;
  location: LocationData;
  zoneId?: string;
  zoneName?: string;
  visitDuration?: number; // minutes
  isCurrentLocation: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// CONTACT INFORMATION
// ============================================================================

export interface ContactInfo {
  phone: string;
  email: string;
  alternatePhone?: string;
  alternateEmail?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: EmergencyContactRelation;
  phone: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
  isLocal: boolean; // if contact is in the destination country
}

export interface HomeAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: Coordinates;
}

// ============================================================================
// IDENTIFICATION & VERIFICATION
// ============================================================================

export interface IdentityDocument {
  id: string;
  type: DocumentType;
  documentNumber: string;
  issuingCountry: string;
  issuingAuthority?: string;
  issueDate: string;
  expiryDate: string;
  isVerified: boolean;
  verificationDate?: string;
  documentImageUrl?: string;
  notes?: string;
}

export interface BiometricData {
  id: string;
  type: 'fingerprint' | 'face' | 'iris';
  hash: string; // Encrypted biometric hash
  confidence: number; // 0-1
  capturedAt: string;
  deviceId: string;
  isActive: boolean;
}

export interface VerificationRecord {
  id: VerificationId;
  touristId: TouristId;
  status: VerificationStatus;
  method: 'document' | 'biometric' | 'manual' | 'blockchain';
  verifiedBy?: string; // User ID or system
  verificationDate: string;
  expiryDate?: string;
  details: Record<string, any>;
  notes?: string;
}

// ============================================================================
// DEVICE & TRACKING
// ============================================================================

export interface DeviceInfo {
  id: DeviceId;
  type: 'smartphone' | 'wearable' | 'tracker' | 'other';
  model?: string;
  os?: string;
  osVersion?: string;
  appVersion?: string;
  pushToken?: string;
  isActive: boolean;
  lastSeen: string;
  batteryLevel?: number;
  connectionStatus: 'online' | 'offline' | 'poor_connection';
}

export interface TrackingPreferences {
  shareLocation: boolean;
  shareWithEmergencyContacts: boolean;
  shareWithTourGuides: boolean;
  trackingAccuracy: 'high' | 'medium' | 'low';
  updateFrequency: number; // minutes
  allowOfflineTracking: boolean;
  enableGeofencing: boolean;
  emergencyAutoShare: boolean;
}

// ============================================================================
// TRAVEL INFORMATION
// ============================================================================

export interface TravelDetails {
  purpose: 'tourism' | 'business' | 'education' | 'medical' | 'transit' | 'other';
  arrivalDate: string;
  departureDate: string;
  accommodation?: {
    name: string;
    address: string;
    phone?: string;
    coordinates?: Coordinates;
    checkInDate: string;
    checkOutDate: string;
  };
  transportation?: {
    arrivalMode: 'flight' | 'train' | 'bus' | 'car' | 'ship' | 'other';
    arrivalDetails?: string; // flight number, train number, etc.
    departureMode?: 'flight' | 'train' | 'bus' | 'car' | 'ship' | 'other';
    departureDetails?: string;
  };
  groupSize: number;
  hasLocalGuide: boolean;
  guideContactInfo?: ContactInfo;
  plannedDestinations: string[];
  specialRequirements?: string[];
  insuranceDetails?: {
    provider: string;
    policyNumber: string;
    coverage: string[];
    expiryDate: string;
  };
}

// ============================================================================
// HEALTH & MEDICAL
// ============================================================================

export interface HealthInfo {
  medicalConditions: string[];
  medications: string[];
  allergies: string[];
  bloodType?: string;
  emergencyMedicalInfo?: string;
  vaccinationStatus?: {
    vaccine: string;
    date: string;
    validUntil?: string;
  }[];
  healthInsurance?: {
    provider: string;
    policyNumber: string;
    validUntil: string;
    coverageArea: string[];
  };
}

// ============================================================================
// SAFETY & ALERTS
// ============================================================================

export interface SafetyStatus {
  level: AlertLevel;
  lastCheckedIn: string;
  lastLocationUpdate: string;
  isInSafeZone: boolean;
  currentRiskScore: number; // 0-100
  activeAlerts: string[];
  missedCheckIns: number;
  emergencyContactsNotified: boolean;
  lastEmergencyAlert?: string;
}

export interface TouristAlert {
  id: string;
  touristId: TouristId;
  type: 'safety' | 'location' | 'health' | 'document' | 'system';
  level: AlertLevel;
  title: string;
  message: string;
  location?: LocationData;
  timestamp: string;
  isActive: boolean;
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  actions: string[];
  metadata: Record<string, any>;
}

// ============================================================================
// MAIN TOURIST INTERFACE
// ============================================================================

export interface Tourist {
  // Basic Information
  id: TouristId;
  firstName: string;
  lastName: string;
  fullName: string;
  displayName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  nationality: string;
  preferredLanguage: string;
  spokenLanguages: string[];
  
  // Contact Information
  contactInfo: ContactInfo;
  homeAddress: HomeAddress;
  emergencyContacts: EmergencyContact[];
  
  // Identification & Verification
  documents: IdentityDocument[];
  biometrics: BiometricData[];
  verificationRecords: VerificationRecord[];
  verificationStatus: VerificationStatus;
  
  // Device & Tracking
  devices: DeviceInfo[];
  primaryDeviceId?: DeviceId;
  trackingPreferences: TrackingPreferences;
  
  // Location & Movement
  currentLocation?: LocationData;
  lastKnownLocation?: LocationData;
  locationHistory: LocationHistory[];
  currentZoneId?: string;
  visitedZones: string[];
  
  // Travel Information
  travelDetails: TravelDetails;
  
  // Health & Medical
  healthInfo?: HealthInfo;
  
  // Safety & Status
  status: TouristStatus;
  safetyStatus: SafetyStatus;
  alerts: TouristAlert[];
  
  // System Information
  registrationDate: string;
  lastLoginDate?: string;
  lastUpdateDate: string;
  isActive: boolean;
  notes?: string[];
  
  // Privacy & Consent
  privacyConsent: {
    dataCollection: boolean;
    locationTracking: boolean;
    emergencySharing: boolean;
    analyticsUsage: boolean;
    thirdPartySharing: boolean;
    consentDate: string;
    consentVersion: string;
  };
  
  // Blockchain Integration
  blockchainId?: string;
  blockchainVerified: boolean;
  lastBlockchainUpdate?: string;
}

// ============================================================================
// SEARCH & FILTERING
// ============================================================================

export interface TouristSearchFilters {
  search?: string; // Name, phone, email, document number
  status?: TouristStatus[];
  verificationStatus?: VerificationStatus[];
  nationality?: string[];
  alertLevel?: AlertLevel[];
  zoneId?: string[];
  arrivalDateRange?: {
    start: string;
    end: string;
  };
  lastSeenRange?: {
    start: string;
    end: string;
  };
  hasActiveAlerts?: boolean;
  deviceStatus?: ('online' | 'offline' | 'poor_connection')[];
  sortBy?: 'name' | 'registrationDate' | 'lastSeen' | 'alertLevel' | 'verificationStatus';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface TouristSearchResult {
  tourists: Tourist[];
  total: number;
  filters: TouristSearchFilters;
  aggregations: {
    statusCounts: Record<TouristStatus, number>;
    verificationStatusCounts: Record<VerificationStatus, number>;
    alertLevelCounts: Record<AlertLevel, number>;
    nationalityCounts: Record<string, number>;
    zoneCounts: Record<string, number>;
  };
}

// ============================================================================
// STATISTICS & ANALYTICS
// ============================================================================

export interface TouristStatistics {
  total: number;
  active: number;
  verified: number;
  withActiveAlerts: number;
  byStatus: Record<TouristStatus, number>;
  byVerificationStatus: Record<VerificationStatus, number>;
  byNationality: Record<string, number>;
  byAlertLevel: Record<AlertLevel, number>;
  averageStayDuration: number; // days
  averageSafetyScore: number; // 0-100
  checkInCompliance: number; // percentage
  recentRegistrations: number; // last 24h
  recentCheckIns: number; // last 24h
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

export interface BulkTouristOperation {
  type: 'update_status' | 'send_alert' | 'verify' | 'export' | 'delete';
  touristIds: TouristId[];
  data?: Record<string, any>;
  reason?: string;
  performedBy: string;
  performedAt: string;
}

export interface BulkOperationResult {
  operation: BulkTouristOperation;
  successful: TouristId[];
  failed: Array<{
    touristId: TouristId;
    error: string;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface CreateTouristRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  nationality: string;
  preferredLanguage: string;
  contactInfo: ContactInfo;
  homeAddress: HomeAddress;
  emergencyContacts: EmergencyContact[];
  documents: Omit<IdentityDocument, 'id' | 'isVerified' | 'verificationDate'>[];
  travelDetails: TravelDetails;
  healthInfo?: HealthInfo;
  trackingPreferences: TrackingPreferences;
  privacyConsent: Tourist['privacyConsent'];
}

export interface UpdateTouristRequest {
  id: TouristId;
  updates: Partial<Tourist>;
  reason?: string;
}

export interface TouristLocationUpdate {
  touristId: TouristId;
  location: LocationData;
  deviceId: DeviceId;
  batteryLevel?: number;
  connectionStatus?: DeviceInfo['connectionStatus'];
}

export interface CheckInRequest {
  touristId: TouristId;
  location: LocationData;
  zoneId?: string;
  notes?: string;
  deviceId: DeviceId;
}

export interface EmergencyRequest {
  touristId: TouristId;
  location: LocationData;
  emergencyType: 'medical' | 'safety' | 'security' | 'lost' | 'accident' | 'other';
  description: string;
  severity: AlertLevel;
  contactEmergencyServices: boolean;
  notifyEmergencyContacts: boolean;
  deviceId: DeviceId;
}
