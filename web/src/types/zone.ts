/**
 * Smart Tourist Safety System - Zone Management Types
 * Type definitions for geofencing, risk zones, and zone management
 */

// ============================================================================
// COORDINATE & GEOMETRY TYPES
// ============================================================================

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface BoundingBox {
  northeast: Coordinates;
  southwest: Coordinates;
}

export interface CircularZone {
  center: Coordinates;
  radius: number; // in meters
}

export interface PolygonZone {
  points: Coordinates[];
}

export type ZoneGeometry = CircularZone | PolygonZone;

// ============================================================================
// ZONE CONFIGURATION TYPES
// ============================================================================

export interface ZoneConfiguration {
  id: string;
  name: string;
  description?: string;
  type: ZoneType;
  riskLevel: RiskLevel;
  alertSettings: AlertSettings;
  accessRestrictions: AccessRestrictions;
  activeHours?: TimeRange[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface AlertSettings {
  enableEntryAlerts: boolean;
  enableExitAlerts: boolean;
  enableDwellTimeAlerts: boolean;
  maxDwellTime?: number; // in minutes
  alertPriority: AlertPriority;
  autoEscalate: boolean;
  escalationTime?: number; // in minutes
}

export interface AccessRestrictions {
  requiresPermission: boolean;
  allowedUserTypes?: UserType[];
  bannedUserTypes?: UserType[];
  maxOccupancy?: number;
  requiresGuide: boolean;
}

export interface TimeRange {
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  days: DayOfWeek[];
}

// ============================================================================
// ZONE TYPES & ENUMS
// ============================================================================

export enum ZoneType {
  SAFE_ZONE = 'safe_zone',
  RISK_ZONE = 'risk_zone',
  RESTRICTED_ZONE = 'restricted_zone',
  EMERGENCY_ZONE = 'emergency_zone',
  TOURIST_ATTRACTION = 'tourist_attraction',
  ACCOMMODATION = 'accommodation',
  TRANSPORT_HUB = 'transport_hub',
  MEDICAL_FACILITY = 'medical_facility',
  POLICE_STATION = 'police_station',
  BORDER_CHECKPOINT = 'border_checkpoint'
}

export enum RiskLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
  CRITICAL = 'critical'
}

export enum AlertPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum UserType {
  TOURIST = 'tourist',
  LOCAL_GUIDE = 'local_guide',
  OFFICIAL = 'official',
  EMERGENCY_RESPONDER = 'emergency_responder',
  VIP = 'vip'
}

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday'
}

export enum ZoneStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  EMERGENCY_LOCKDOWN = 'emergency_lockdown'
}

// ============================================================================
// MAIN ZONE INTERFACE
// ============================================================================

export interface Zone extends ZoneConfiguration {
  geometry: ZoneGeometry;
  status: ZoneStatus;
  statistics: ZoneStatistics;
  boundingBox: BoundingBox;
  isGeofenceActive: boolean;
  lastActivity?: string;
}

export interface ZoneStatistics {
  currentOccupancy: number;
  maxOccupancyToday: number;
  totalVisitsToday: number;
  totalVisitsThisWeek: number;
  averageDwellTime: number; // in minutes
  alertsTriggeredToday: number;
  lastEntryTime?: string;
  lastExitTime?: string;
}

// ============================================================================
// GEOFENCE SPECIFIC TYPES
// ============================================================================

export interface GeofenceZone extends Zone {
  geofenceSettings: GeofenceSettings;
  triggers: GeofenceTrigger[];
}

export interface GeofenceSettings {
  bufferDistance: number; // buffer zone in meters
  entryDelay: number;     // delay before entry alert (seconds)
  exitDelay: number;      // delay before exit alert (seconds)
  enableLocationAccuracy: boolean;
  minAccuracy: number;    // minimum GPS accuracy required (meters)
}

export interface GeofenceTrigger {
  id: string;
  type: TriggerType;
  condition: TriggerCondition;
  action: TriggerAction;
  isActive: boolean;
  lastTriggered?: string;
}

export enum TriggerType {
  ENTRY = 'entry',
  EXIT = 'exit',
  DWELL_TIME = 'dwell_time',
  SPEED_LIMIT = 'speed_limit',
  TIME_BASED = 'time_based'
}

export interface TriggerCondition {
  operator: 'greater_than' | 'less_than' | 'equals' | 'between';
  value: number;
  secondValue?: number; // for 'between' operator
  unit: 'seconds' | 'minutes' | 'hours' | 'meters' | 'kilometers';
}

export interface TriggerAction {
  type: 'alert' | 'notification' | 'auto_response' | 'log_only';
  severity: AlertPriority;
  message: string;
  recipients?: string[]; // user IDs or roles
  autoResponse?: AutoResponse;
}

export interface AutoResponse {
  type: 'emergency_call' | 'send_help' | 'evacuate' | 'lockdown';
  parameters?: Record<string, any>;
}

// ============================================================================
// RISK ZONE SPECIFIC TYPES
// ============================================================================

export interface RiskZone extends Zone {
  riskFactors: RiskFactor[];
  safetyMeasures: SafetyMeasure[];
  emergencyContacts: EmergencyContact[];
  evacuationPlan?: EvacuationPlan;
}

export interface RiskFactor {
  id: string;
  type: RiskFactorType;
  severity: RiskLevel;
  description: string;
  likelihood: number; // 0-100 percentage
  impact: number;     // 0-100 percentage
  mitigation?: string;
  lastAssessed: string;
}

export enum RiskFactorType {
  NATURAL_DISASTER = 'natural_disaster',
  CRIME_HOTSPOT = 'crime_hotspot',
  POLITICAL_UNREST = 'political_unrest',
  HEALTH_HAZARD = 'health_hazard',
  INFRASTRUCTURE_RISK = 'infrastructure_risk',
  WILDLIFE_DANGER = 'wildlife_danger',
  ENVIRONMENTAL_HAZARD = 'environmental_hazard',
  TRAFFIC_ACCIDENT = 'traffic_accident'
}

export interface SafetyMeasure {
  id: string;
  description: string;
  isRequired: boolean;
  effectivenessRating: number; // 0-100
  implementationCost: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phoneNumber: string;
  email?: string;
  availability: TimeRange[];
  priority: number; // 1 is highest priority
}

export interface EvacuationPlan {
  id: string;
  description: string;
  routes: EvacuationRoute[];
  assemblyPoints: Coordinates[];
  estimatedTime: number; // in minutes
  capacity: number;
  lastDrillDate?: string;
}

export interface EvacuationRoute {
  id: string;
  name: string;
  path: Coordinates[];
  capacity: number;
  isAccessible: boolean; // wheelchair/disabled accessible
  alternativeRoutes?: string[]; // IDs of alternative routes
}

// ============================================================================
// ZONE MANAGEMENT TYPES
// ============================================================================

export interface ZoneFilter {
  types?: ZoneType[];
  riskLevels?: RiskLevel[];
  status?: ZoneStatus[];
  searchTerm?: string;
  boundingBox?: BoundingBox;
  hasAlerts?: boolean;
  minOccupancy?: number;
  maxOccupancy?: number;
  createdAfter?: string;
  createdBefore?: string;
}

export interface ZoneSortOptions {
  field: 'name' | 'type' | 'riskLevel' | 'currentOccupancy' | 'alertsTriggered' | 'createdAt';
  direction: 'asc' | 'desc';
}

export interface ZoneListResponse {
  zones: Zone[];
  totalCount: number;
  hasMore: boolean;
  filters: ZoneFilter;
  sortOptions: ZoneSortOptions;
}

export interface ZoneOperations {
  create: (zone: Partial<Zone>) => Promise<Zone>;
  update: (id: string, updates: Partial<Zone>) => Promise<Zone>;
  delete: (id: string) => Promise<boolean>;
  activate: (id: string) => Promise<Zone>;
  deactivate: (id: string) => Promise<Zone>;
  bulkUpdate: (ids: string[], updates: Partial<Zone>) => Promise<Zone[]>;
}

// ============================================================================
// ZONE OVERLAP & HIERARCHY TYPES
// ============================================================================

export interface ZoneOverlap {
  zone1Id: string;
  zone2Id: string;
  overlapType: OverlapType;
  overlapArea: number; // in square meters
  conflictSeverity: 'none' | 'low' | 'medium' | 'high';
  resolution?: OverlapResolution;
}

export enum OverlapType {
  CONTAINED = 'contained',     // one zone completely inside another
  PARTIAL = 'partial',         // zones partially overlap
  ADJACENT = 'adjacent',       // zones touch but don't overlap
  SEPARATE = 'separate'        // zones don't touch
}

export interface OverlapResolution {
  strategy: 'priority_based' | 'merge_zones' | 'split_zones' | 'manual_review';
  primaryZoneId?: string;
  notes?: string;
  resolvedAt: string;
  resolvedBy: string;
}

export interface ZoneHierarchy {
  parentZoneId?: string;
  childZoneIds: string[];
  inheritSettings: boolean;
  overrideSettings?: Partial<ZoneConfiguration>;
}

// ============================================================================
// ZONE ANALYTICS TYPES
// ============================================================================

export interface ZoneAnalytics {
  zoneId: string;
  timeRange: {
    start: string;
    end: string;
  };
  metrics: ZoneMetrics;
  trends: ZoneTrends;
  heatmapData: HeatmapPoint[];
}

export interface ZoneMetrics {
  totalVisitors: number;
  uniqueVisitors: number;
  averageDwellTime: number;
  peakOccupancy: number;
  alertsTriggered: number;
  incidentsReported: number;
  safetyScore: number;
  visitorSatisfaction?: number;
}

export interface ZoneTrends {
  visitorTrend: TrendData[];
  occupancyTrend: TrendData[];
  alertTrend: TrendData[];
  safetyTrend: TrendData[];
}

export interface TrendData {
  timestamp: string;
  value: number;
  change: number; // percentage change from previous period
}

export interface HeatmapPoint {
  coordinates: Coordinates;
  intensity: number; // 0-100
  timestamp: string;
}

// All types and enums are exported inline above
