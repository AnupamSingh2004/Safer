/**
 * Smart Tourist Safety System - Location Tracking Types
 * Comprehensive type definitions for real-time location tracking
 */

// ============================================================================
// BASIC TYPES
// ============================================================================

export type LocationId = string;
export type TrackingSessionId = string;
export type GeofenceId = string;
export type RouteId = string;

// ============================================================================
// ENUMS
// ============================================================================

export enum LocationSource {
  GPS = 'gps',
  NETWORK = 'network',
  PASSIVE = 'passive',
  MANUAL = 'manual',
  BEACON = 'beacon',
  WIFI = 'wifi',
  CELLULAR = 'cellular'
}

export enum TrackingStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  ERROR = 'error',
  PERMISSION_DENIED = 'permission_denied',
  LOW_BATTERY = 'low_battery',
  BACKGROUND = 'background'
}

export enum LocationAccuracy {
  HIGH = 'high',        // <5m accuracy
  MEDIUM = 'medium',    // 5-20m accuracy
  LOW = 'low',         // 20-100m accuracy
  POOR = 'poor'        // >100m accuracy
}

export enum GeofenceEventType {
  ENTER = 'enter',
  EXIT = 'exit',
  DWELL = 'dwell'
}

export enum MovementState {
  STATIONARY = 'stationary',
  WALKING = 'walking',
  RUNNING = 'running',
  CYCLING = 'cycling',
  DRIVING = 'driving',
  UNKNOWN = 'unknown'
}

export enum TrackingMode {
  REAL_TIME = 'real_time',      // Continuous tracking
  PERIODIC = 'periodic',        // Regular intervals
  ON_DEMAND = 'on_demand',      // Manual updates
  GEOFENCE_ONLY = 'geofence_only', // Only on geofence events
  POWER_SAVING = 'power_saving'  // Reduced frequency
}

// ============================================================================
// COORDINATE & MEASUREMENT TYPES
// ============================================================================

export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  altitudeAccuracy?: number;
  heading?: number;      // degrees from North (0-360)
  speed?: number;        // m/s
}

export interface LocationPoint {
  id: LocationId;
  coordinates: Coordinates;
  timestamp: string;
  source: LocationSource;
  accuracy: LocationAccuracy;
  
  // Additional metadata
  batteryLevel?: number;
  networkType?: string;
  isIndoor?: boolean;
  floorLevel?: number;
  
  // Reverse geocoding data
  address?: string;
  locality?: string;
  country?: string;
  postalCode?: string;
  
  // Context data
  zoneId?: string;
  zoneName?: string;
  landmarkId?: string;
  landmarkName?: string;
}

export interface LocationBounds {
  northeast: Coordinates;
  southwest: Coordinates;
}

export interface Distance {
  value: number;    // in meters
  text: string;     // human-readable distance
}

export interface Duration {
  value: number;    // in seconds
  text: string;     // human-readable duration
}

// ============================================================================
// TRACKING SESSION
// ============================================================================

export interface TrackingSession {
  id: TrackingSessionId;
  touristId: string;
  deviceId: string;
  
  // Session details
  startTime: string;
  endTime?: string;
  status: TrackingStatus;
  mode: TrackingMode;
  
  // Configuration
  updateInterval: number;     // seconds
  minDistance: number;        // meters
  maxAge: number;            // seconds
  enableHighAccuracy: boolean;
  
  // Statistics
  totalPoints: number;
  totalDistance: number;      // meters
  totalDuration: number;      // seconds
  averageSpeed: number;       // m/s
  maxSpeed: number;          // m/s
  
  // Battery impact
  batteryStart?: number;
  batteryEnd?: number;
  batteryDrain?: number;      // percentage
  
  // Locations
  startLocation?: LocationPoint;
  endLocation?: LocationPoint;
  lastKnownLocation?: LocationPoint;
  
  // Error tracking
  errorCount: number;
  lastError?: string;
  lastErrorTime?: string;
  
  // Metadata
  metadata: Record<string, any>;
}

// ============================================================================
// GEOFENCING
// ============================================================================

export interface Geofence {
  id: GeofenceId;
  name: string;
  description?: string;
  
  // Geometry
  type: 'circle' | 'polygon';
  center?: Coordinates;
  radius?: number;           // meters
  polygon?: Coordinates[];
  
  // Behavior
  events: GeofenceEventType[];
  dwellTime?: number;        // seconds for dwell events
  
  // Targeting
  touristIds?: string[];     // specific tourists
  groupIds?: string[];       // tourist groups
  isGlobal: boolean;         // applies to all tourists
  
  // Status
  isActive: boolean;
  validFrom?: string;
  validUntil?: string;
  
  // Actions
  actions: GeofenceAction[];
  
  // Statistics
  totalTriggers: number;
  uniqueVisitors: number;
  averageDwellTime?: number;
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  metadata: Record<string, any>;
}

export interface GeofenceAction {
  id: string;
  type: 'alert' | 'notification' | 'webhook' | 'email' | 'sms';
  config: Record<string, any>;
  delay?: number;            // seconds
  isEnabled: boolean;
}

export interface GeofenceEvent {
  id: string;
  geofenceId: GeofenceId;
  touristId: string;
  deviceId: string;
  
  eventType: GeofenceEventType;
  timestamp: string;
  location: LocationPoint;
  
  // Dwell specific
  dwellDuration?: number;    // seconds
  
  // Triggered actions
  triggeredActions: string[];
  
  // Context
  previousLocation?: LocationPoint;
  entryLocation?: LocationPoint;
  exitLocation?: LocationPoint;
  
  metadata: Record<string, any>;
}

// ============================================================================
// ROUTE TRACKING
// ============================================================================

export interface Route {
  id: RouteId;
  name: string;
  description?: string;
  
  // Route data
  waypoints: LocationPoint[];
  distance: Distance;
  duration: Duration;
  
  // Route type
  type: 'walking' | 'driving' | 'cycling' | 'public_transport' | 'mixed';
  
  // Status
  isActive: boolean;
  isRecommended: boolean;
  safetyRating: number;      // 1-5
  difficultyLevel: 'easy' | 'medium' | 'hard';
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  
  // Statistics
  usageCount: number;
  averageRating: number;
  completionRate: number;    // percentage
}

export interface RouteProgress {
  routeId: RouteId;
  touristId: string;
  
  startTime: string;
  currentWaypoint: number;
  completedWaypoints: number[];
  
  distanceCovered: number;   // meters
  timeElapsed: number;       // seconds
  estimatedTimeRemaining: number; // seconds
  
  currentLocation: LocationPoint;
  nextWaypoint?: LocationPoint;
  
  deviations: RouteDeviation[];
  
  isCompleted: boolean;
  completedAt?: string;
}

export interface RouteDeviation {
  id: string;
  timestamp: string;
  location: LocationPoint;
  distanceFromRoute: number; // meters
  severity: 'minor' | 'major' | 'critical';
  reason?: string;
}

// ============================================================================
// ANALYTICS & INSIGHTS
// ============================================================================

export interface LocationAnalytics {
  touristId: string;
  timeRange: {
    start: string;
    end: string;
  };
  
  // Movement statistics
  totalDistance: number;     // meters
  totalDuration: number;     // seconds
  averageSpeed: number;      // m/s
  maxSpeed: number;         // m/s
  
  // Activity breakdown
  movementStates: Record<MovementState, {
    duration: number;        // seconds
    distance: number;        // meters
    percentage: number;      // of total time
  }>;
  
  // Places visited
  visitedZones: Array<{
    zoneId: string;
    zoneName: string;
    visits: number;
    totalDuration: number;   // seconds
    averageDuration: number; // seconds
    lastVisit: string;
  }>;
  
  // Patterns
  patterns: LocationPattern[];
  
  // Heat map data
  heatMapPoints: Array<{
    coordinates: Coordinates;
    weight: number;          // frequency/duration
  }>;
  
  // Safety insights
  safetyScore: number;       // 1-100
  riskEvents: number;
  safeZoneCompliance: number; // percentage
}

export interface LocationPattern {
  type: 'routine' | 'anomaly' | 'trend';
  description: string;
  confidence: number;        // 0-1
  frequency: 'daily' | 'weekly' | 'monthly' | 'irregular';
  
  // Pattern specific data
  locations?: Coordinates[];
  timeWindows?: Array<{
    start: string;          // HH:mm
    end: string;           // HH:mm
    days?: number[];       // 0-6, Sunday=0
  }>;
  
  metadata: Record<string, any>;
}

// ============================================================================
// PRIVACY & PERMISSIONS
// ============================================================================

export interface LocationPrivacySettings {
  touristId: string;
  
  // Sharing preferences
  shareWithEmergencyContacts: boolean;
  shareWithTourGuides: boolean;
  shareWithAuthorities: boolean;
  shareForAnalytics: boolean;
  
  // Accuracy preferences
  allowPreciseLocation: boolean;
  allowBackgroundTracking: boolean;
  allowContinuousTracking: boolean;
  
  // Data retention
  retentionPeriod: number;   // days
  allowHistoricalAnalysis: boolean;
  
  // Zone-based sharing
  restrictedZones: string[]; // zones where sharing is disabled
  publicZones: string[];     // zones where sharing is allowed
  
  // Time-based restrictions
  quietHours?: {
    start: string;          // HH:mm
    end: string;           // HH:mm
  };
  
  // Consent
  consentDate: string;
  consentVersion: string;
  
  updatedAt: string;
}

export interface LocationPermission {
  touristId: string;
  deviceId: string;
  
  // Platform permissions
  hasLocationPermission: boolean;
  hasPreciseLocation: boolean;
  hasBackgroundLocation: boolean;
  
  // Permission status
  status: 'granted' | 'denied' | 'restricted' | 'not_determined';
  lastRequested: string;
  lastGranted?: string;
  lastDenied?: string;
  
  // Platform specific
  platform: 'android' | 'ios' | 'web' | 'other';
  platformVersion?: string;
  
  // App permissions
  canTrackInBackground: boolean;
  canSendNotifications: boolean;
  canAccessPreciseLocation: boolean;
  
  updatedAt: string;
}

// ============================================================================
// SEARCH & FILTERING
// ============================================================================

export interface LocationSearchFilters {
  touristIds?: string[];
  zoneIds?: string[];
  timeRange?: {
    start: string;
    end: string;
  };
  locationBounds?: LocationBounds;
  accuracy?: LocationAccuracy[];
  sources?: LocationSource[];
  hasGeofenceEvents?: boolean;
  minDistance?: number;      // minimum distance between points
  sortBy?: 'timestamp' | 'accuracy' | 'distance';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface LocationSearchResult {
  locations: LocationPoint[];
  total: number;
  filters: LocationSearchFilters;
  
  aggregations: {
    sourceCounts: Record<LocationSource, number>;
    accuracyCounts: Record<LocationAccuracy, number>;
    zoneCounts: Record<string, number>;
    timeDistribution: Array<{
      hour: number;
      count: number;
    }>;
  };
  
  bounds?: LocationBounds;
  center?: Coordinates;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface StartTrackingRequest {
  touristId: string;
  deviceId: string;
  mode: TrackingMode;
  config?: {
    updateInterval?: number;
    minDistance?: number;
    enableHighAccuracy?: boolean;
  };
}

export interface UpdateLocationRequest {
  touristId: string;
  deviceId: string;
  location: Omit<LocationPoint, 'id'>;
  sessionId?: TrackingSessionId;
}

export interface CreateGeofenceRequest {
  name: string;
  description?: string;
  type: 'circle' | 'polygon';
  center?: Coordinates;
  radius?: number;
  polygon?: Coordinates[];
  events: GeofenceEventType[];
  dwellTime?: number;
  touristIds?: string[];
  actions: Omit<GeofenceAction, 'id'>[];
  validFrom?: string;
  validUntil?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface BulkLocationOperation {
  type: 'delete' | 'export' | 'anonymize' | 'archive';
  touristIds?: string[];
  timeRange?: {
    start: string;
    end: string;
  };
  filters?: LocationSearchFilters;
  performedBy: string;
  reason?: string;
}

// ============================================================================
// REAL-TIME EVENTS
// ============================================================================

export interface LocationUpdateEvent {
  type: 'location_update';
  touristId: string;
  deviceId: string;
  location: LocationPoint;
  sessionId: TrackingSessionId;
  timestamp: string;
}

export interface GeofenceEventUpdate {
  type: 'geofence_event';
  touristId: string;
  geofenceId: GeofenceId;
  event: GeofenceEvent;
  timestamp: string;
}

export interface TrackingStatusEvent {
  type: 'tracking_status';
  touristId: string;
  deviceId: string;
  status: TrackingStatus;
  previousStatus: TrackingStatus;
  reason?: string;
  timestamp: string;
}

export interface LocationAlert {
  type: 'location_alert';
  touristId: string;
  alertType: 'offline' | 'low_battery' | 'permission_denied' | 'accuracy_degraded' | 'suspicious_movement';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: LocationPoint;
  metadata: Record<string, any>;
  timestamp: string;
}

// ============================================================================
// INTEGRATION TYPES
// ============================================================================

export interface LocationProvider {
  id: string;
  name: string;
  type: 'gps' | 'network' | 'hybrid' | 'third_party';
  
  // Configuration
  config: Record<string, any>;
  
  // Capabilities
  supportsHighAccuracy: boolean;
  supportsContinuousTracking: boolean;
  supportsGeofencing: boolean;
  
  // Performance metrics
  averageAccuracy: number;   // meters
  averageLatency: number;    // milliseconds
  reliabilityScore: number;  // 0-1
  
  // Status
  isActive: boolean;
  lastHealthCheck: string;
  
  metadata: Record<string, any>;
}

export interface LocationWebhook {
  id: string;
  name: string;
  url: string;
  events: ('location_update' | 'geofence_event' | 'tracking_status' | 'location_alert')[];
  
  // Filtering
  touristIds?: string[];
  zoneIds?: string[];
  eventFilters?: Record<string, any>;
  
  // Authentication
  headers?: Record<string, string>;
  authentication?: {
    type: 'bearer' | 'basic' | 'api_key';
    credentials: Record<string, string>;
  };
  
  // Retry policy
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
    maxDelay: number;
  };
  
  // Status
  isActive: boolean;
  lastTriggered?: string;
  totalDeliveries: number;
  failedDeliveries: number;
  
  createdAt: string;
  updatedAt: string;
}
