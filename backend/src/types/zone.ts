// Backend Zone Types for Smart Tourist Safety System
// Using PostgreSQL/Supabase database schema

// ===== Core Coordinates & Geometry =====

export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  timestamp?: Date;
}

export interface BoundingBox {
  northeast: Coordinates;
  southwest: Coordinates;
}

export interface Circle {
  center: Coordinates;
  radius: number; // in meters
}

export interface Polygon {
  coordinates: Coordinates[];
  holes?: Coordinates[][]; // For complex polygons with holes
}

export interface GeoJsonPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface GeoJsonPolygon {
  type: 'Polygon';
  coordinates: number[][][]; // [[[lng, lat], [lng, lat], ...]]
}

export interface GeoJsonCircle {
  type: 'Circle';
  coordinates: [number, number]; // center [longitude, latitude]
  radius: number; // in meters
}

export type GeometryType = GeoJsonPoint | GeoJsonPolygon | GeoJsonCircle;

// ===== Zone Categories & Types =====

export enum ZoneType {
  SAFE = 'safe',
  RISK = 'risk',
  RESTRICTED = 'restricted',
  GEOFENCE = 'geofence',
  EMERGENCY = 'emergency',
  TOURIST_ATTRACTION = 'tourist_attraction',
  ACCOMMODATION = 'accommodation',
  TRANSPORT_HUB = 'transport_hub',
  MEDICAL_FACILITY = 'medical_facility',
  POLICE_STATION = 'police_station',
  CUSTOMS = 'customs',
  BORDER = 'border',
  WEATHER_ZONE = 'weather_zone',
  CULTURAL_SITE = 'cultural_site',
  SHOPPING_AREA = 'shopping_area',
  FOOD_COURT = 'food_court',
  PARKING = 'parking'
}

export enum ZoneStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  EMERGENCY_LOCKDOWN = 'emergency_lockdown',
  TEMPORARY_CLOSURE = 'temporary_closure',
  UNDER_REVIEW = 'under_review',
  PENDING_APPROVAL = 'pending_approval'
}

export enum RiskLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high',
  CRITICAL = 'critical',
  EXTREME = 'extreme'
}

export enum ZonePriority {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
  URGENT = 4,
  CRITICAL = 5,
  EMERGENCY = 6
}

// ===== Alert & Notification Settings =====

export interface AlertTrigger {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: AlertCondition[];
  actions: AlertAction[];
  cooldownPeriod?: number; // seconds
  maxAlerts?: number; // per time period
  escalationRules?: EscalationRule[];
}

export interface AlertCondition {
  type: 'entry' | 'exit' | 'dwell_time' | 'capacity' | 'risk_change' | 'emergency' | 'weather' | 'time_based';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: any;
  duration?: number; // for time-based conditions
  touristFilters?: TouristFilter[];
}

export interface TouristFilter {
  field: 'nationality' | 'age_group' | 'travel_purpose' | 'group_size' | 'risk_profile' | 'verification_status';
  operator: 'equals' | 'in' | 'not_in' | 'greater_than' | 'less_than';
  value: any;
}

export interface AlertAction {
  type: 'notification' | 'sms' | 'email' | 'push' | 'emergency_services' | 'zone_lockdown' | 'redirect' | 'escalate';
  target: 'tourist' | 'authorities' | 'emergency_services' | 'admin' | 'zone_managers' | 'all';
  template: string;
  priority: ZonePriority;
  delay?: number; // seconds before action
  conditions?: AlertCondition[];
}

export interface EscalationRule {
  level: number;
  timeThreshold: number; // seconds
  actions: AlertAction[];
  autoResolve?: boolean;
}

// ===== Zone Settings & Configuration =====

export interface ZoneSettings {
  monitoring: MonitoringSettings;
  access: AccessSettings;
  capacity: CapacitySettings;
  alerts: AlertSettings;
  automation: AutomationSettings;
  display: DisplaySettings;
  integration: IntegrationSettings;
}

export interface MonitoringSettings {
  enabled: boolean;
  realTimeTracking: boolean;
  locationUpdateInterval: number; // seconds
  gpsAccuracyThreshold: number; // meters
  dwellTimeThreshold: number; // seconds
  entryExitLogging: boolean;
  heatmapGeneration: boolean;
  pathAnalysis: boolean;
  anomalyDetection: boolean;
  crowdDensityTracking: boolean;
}

export interface AccessSettings {
  publicAccess: boolean;
  restrictedGroups: string[];
  requiredPermissions: string[];
  timeRestrictions: TimeRestriction[];
  entryRequirements: EntryRequirement[];
  blacklistedTourists: string[];
  whitelistedTourists: string[];
  verificationRequired: boolean;
  groupSizeLimit?: number;
}

export interface TimeRestriction {
  dayOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  timezone: string;
  seasonal?: {
    startDate: string; // MM-DD format
    endDate: string; // MM-DD format
  };
}

export interface EntryRequirement {
  type: 'document' | 'vaccination' | 'insurance' | 'permit' | 'guide' | 'payment';
  required: boolean;
  description: string;
  validityPeriod?: number; // days
  verificationMethod: 'manual' | 'digital' | 'qr_code' | 'nfc';
}

export interface CapacitySettings {
  maxOccupancy?: number;
  normalCapacity?: number;
  warningThreshold: number; // percentage
  criticalThreshold: number; // percentage
  overflowZones?: string[]; // zone IDs for overflow
  loadBalancing: boolean;
  capacityPrediction: boolean;
  dynamicPricing?: boolean;
}

export interface AlertSettings {
  globalEnabled: boolean;
  triggers: AlertTrigger[];
  notificationChannels: NotificationChannel[];
  escalationMatrix: EscalationMatrix;
  alertThrottling: AlertThrottling;
  customTemplates: AlertTemplate[];
}

export interface NotificationChannel {
  id: string;
  type: 'email' | 'sms' | 'push' | 'webhook' | 'websocket' | 'slack' | 'teams';
  enabled: boolean;
  config: Record<string, any>;
  targetGroups: string[];
  priority: ZonePriority;
  retrySettings: RetrySettings;
}

export interface EscalationMatrix {
  levels: EscalationLevel[];
  autoEscalationEnabled: boolean;
  maxEscalationLevel: number;
  resetConditions: AlertCondition[];
}

export interface EscalationLevel {
  level: number;
  name: string;
  threshold: number; // seconds or count
  recipients: string[];
  actions: AlertAction[];
  autoApproval?: boolean;
}

export interface AlertThrottling {
  enabled: boolean;
  maxAlertsPerMinute: number;
  maxAlertsPerHour: number;
  duplicateSuppressionWindow: number; // seconds
  priorityOverride: boolean;
}

export interface AlertTemplate {
  id: string;
  name: string;
  type: 'entry' | 'exit' | 'emergency' | 'capacity' | 'risk' | 'general';
  subject: string;
  body: string;
  variables: string[];
  channels: string[];
}

export interface RetrySettings {
  maxRetries: number;
  backoffStrategy: 'linear' | 'exponential';
  initialDelay: number; // seconds
  maxDelay: number; // seconds
}

export interface AutomationSettings {
  enabled: boolean;
  autoZoneAdjustment: boolean;
  dynamicRiskAssessment: boolean;
  predictiveAlerts: boolean;
  autoIncidentResponse: boolean;
  machineLearningSuggestions: boolean;
  weatherIntegration: boolean;
  trafficIntegration: boolean;
  eventIntegration: boolean;
}

export interface DisplaySettings {
  showOnMap: boolean;
  color: string;
  opacity: number;
  strokeColor: string;
  strokeWidth: number;
  fillPattern?: string;
  labelSettings: LabelSettings;
  layerOrder: number;
  visibilityZoomLevels: {
    min: number;
    max: number;
  };
  iconSettings?: IconSettings;
}

export interface LabelSettings {
  show: boolean;
  text: string;
  fontSize: number;
  fontColor: string;
  backgroundColor?: string;
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
  offset: { x: number; y: number };
}

export interface IconSettings {
  iconUrl: string;
  iconSize: [number, number];
  iconAnchor: [number, number];
  popupAnchor: [number, number];
}

export interface IntegrationSettings {
  enabled: boolean;
  externalSystems: ExternalSystemConfig[];
  webhooks: WebhookConfig[];
  apiEndpoints: ApiEndpointConfig[];
  dataSyncSettings: DataSyncSettings;
}

export interface ExternalSystemConfig {
  id: string;
  name: string;
  type: 'weather' | 'traffic' | 'emergency' | 'tourism' | 'government' | 'security';
  enabled: boolean;
  apiConfig: {
    baseUrl: string;
    apiKey?: string;
    headers?: Record<string, string>;
    timeout: number;
  };
  syncInterval: number; // seconds
  dataMapping: Record<string, string>;
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  headers?: Record<string, string>;
  retrySettings: RetrySettings;
  security: {
    secret?: string;
    signatureHeader?: string;
  };
}

export interface ApiEndpointConfig {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  authentication?: {
    type: 'bearer' | 'basic' | 'api_key';
    config: Record<string, any>;
  };
}

export interface DataSyncSettings {
  enabled: boolean;
  syncInterval: number; // seconds
  conflictResolution: 'local_wins' | 'remote_wins' | 'manual' | 'timestamp';
  batchSize: number;
  compressionEnabled: boolean;
}

// ===== Analytics & Metrics =====

export interface ZoneAnalytics {
  daily: DailyAnalytics;
  weekly: WeeklyAnalytics;
  monthly: MonthlyAnalytics;
  realTime: RealTimeAnalytics;
  historical: HistoricalAnalytics;
  predictions: PredictionAnalytics;
}

export interface DailyAnalytics {
  date: Date;
  totalVisitors: number;
  peakOccupancy: number;
  averageOccupancy: number;
  avgDwellTime: number;
  entryCount: number;
  exitCount: number;
  alertsTriggered: number;
  incidentCount: number;
  satisfaction: number;
  revenue?: number;
  demographics: DemographicBreakdown;
  heatmapData: HeatmapPoint[];
  popularTimeSlots: TimeSlot[];
}

export interface WeeklyAnalytics {
  weekStartDate: Date;
  totalVisitors: number;
  dailyAverages: DailyAnalytics[];
  trendsComparison: TrendComparison;
  weatherCorrelation: WeatherCorrelation;
  eventImpact: EventImpact[];
}

export interface MonthlyAnalytics {
  month: number;
  year: number;
  totalVisitors: number;
  weeklyAverages: WeeklyAnalytics[];
  seasonalTrends: SeasonalTrend[];
  performanceMetrics: PerformanceMetrics;
  revenueAnalysis?: RevenueAnalysis;
}

export interface RealTimeAnalytics {
  currentOccupancy: number;
  capacityUtilization: number;
  avgEntryRate: number; // per hour
  avgExitRate: number; // per hour
  currentRiskLevel: RiskLevel;
  activeAlerts: number;
  estimatedWaitTime: number; // minutes
  crowdDensity: CrowdDensityMap;
  flowAnalysis: FlowAnalysis;
}

export interface HistoricalAnalytics {
  dataPoints: HistoricalDataPoint[];
  trends: TrendAnalysis[];
  correlations: CorrelationAnalysis[];
  seasonality: SeasonalityAnalysis;
  anomalies: AnomalyReport[];
}

export interface PredictionAnalytics {
  occupancyForecast: OccupancyForecast[];
  riskAssessment: RiskForecast[];
  demandPrediction: DemandForecast[];
  resourceRequirements: ResourceForecast[];
  alertProbability: AlertProbability[];
}

export interface DemographicBreakdown {
  ageGroups: Record<string, number>;
  nationalities: Record<string, number>;
  travelPurpose: Record<string, number>;
  groupSizes: Record<string, number>;
  languages: Record<string, number>;
}

export interface HeatmapPoint {
  coordinates: Coordinates;
  intensity: number;
  timestamp: Date;
  duration: number; // seconds
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  visitorCount: number;
  averageOccupancy: number;
  dayOfWeek?: number;
}

export interface TrendComparison {
  metric: string;
  currentValue: number;
  previousValue: number;
  changePercentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface WeatherCorrelation {
  temperature: CorrelationCoefficient;
  precipitation: CorrelationCoefficient;
  windSpeed: CorrelationCoefficient;
  humidity: CorrelationCoefficient;
  visibility: CorrelationCoefficient;
}

export interface CorrelationCoefficient {
  value: number;
  significance: 'high' | 'medium' | 'low' | 'none';
  direction: 'positive' | 'negative';
}

export interface EventImpact {
  eventId: string;
  eventName: string;
  eventType: string;
  startDate: Date;
  endDate: Date;
  impactScore: number;
  visitorIncrease: number;
  revenueImpact?: number;
}

export interface SeasonalTrend {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  avgVisitors: number;
  peakMonths: string[];
  characteristicPattern: string;
}

export interface PerformanceMetrics {
  efficiency: number;
  utilization: number;
  satisfaction: number;
  safety: number;
  revenue?: number;
  operationalCost?: number;
  roi?: number;
}

export interface RevenueAnalysis {
  totalRevenue: number;
  revenuePerVisitor: number;
  revenueBySource: Record<string, number>;
  projectedRevenue: number;
  costAnalysis: CostBreakdown;
}

export interface CostBreakdown {
  operational: number;
  maintenance: number;
  security: number;
  marketing: number;
  technology: number;
  other: number;
}

export interface CrowdDensityMap {
  gridSize: number; // meters
  densityGrid: DensityCell[][];
  hotspots: Hotspot[];
  congestionAreas: CongestionArea[];
}

export interface DensityCell {
  x: number;
  y: number;
  density: number;
  capacity: number;
  riskLevel: RiskLevel;
}

export interface Hotspot {
  center: Coordinates;
  radius: number;
  density: number;
  touristCount: number;
  riskLevel: RiskLevel;
}

export interface CongestionArea {
  boundary: Coordinates[];
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  estimatedClearTime: number; // minutes
  recommendedActions: string[];
}

export interface FlowAnalysis {
  entryPoints: FlowPoint[];
  exitPoints: FlowPoint[];
  pathways: FlowPath[];
  bottlenecks: Bottleneck[];
  circulation: CirculationMetrics;
}

export interface FlowPoint {
  location: Coordinates;
  flowRate: number; // people per minute
  direction: number; // degrees
  efficiency: number; // 0-1
}

export interface FlowPath {
  start: Coordinates;
  end: Coordinates;
  waypoints: Coordinates[];
  usage: number; // frequency
  avgTravelTime: number; // minutes
  congestionLevel: number; // 0-1
}

export interface Bottleneck {
  location: Coordinates;
  severity: number; // 0-1
  cause: string;
  impact: number; // affected people count
  suggestions: string[];
}

export interface CirculationMetrics {
  efficiency: number;
  balance: number;
  accessibility: number;
  safety: number;
}

export interface HistoricalDataPoint {
  timestamp: Date;
  metrics: Record<string, number>;
  events: string[];
  weather?: WeatherData;
}

export interface TrendAnalysis {
  metric: string;
  trendDirection: 'up' | 'down' | 'stable' | 'cyclical';
  slope: number;
  confidence: number;
  seasonality: boolean;
  changePoints: Date[];
}

export interface CorrelationAnalysis {
  variables: [string, string];
  coefficient: number;
  pValue: number;
  significance: 'high' | 'medium' | 'low' | 'none';
  relationship: string;
}

export interface SeasonalityAnalysis {
  hasSeasonality: boolean;
  period: number; // days
  amplitude: number;
  phase: number;
  confidence: number;
}

export interface AnomalyReport {
  timestamp: Date;
  metric: string;
  value: number;
  expectedValue: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  possibleCauses: string[];
}

export interface OccupancyForecast {
  timestamp: Date;
  predictedOccupancy: number;
  confidence: number;
  lowerBound: number;
  upperBound: number;
  factors: ForecastFactor[];
}

export interface RiskForecast {
  timestamp: Date;
  predictedRisk: RiskLevel;
  confidence: number;
  factors: RiskFactor[];
  mitigationSuggestions: string[];
}

export interface DemandForecast {
  timestamp: Date;
  predictedDemand: number;
  confidence: number;
  peakTimes: TimeSlot[];
  influencingEvents: EventImpact[];
}

export interface ResourceForecast {
  timestamp: Date;
  staffingNeeds: StaffingRequirement[];
  equipmentNeeds: EquipmentRequirement[];
  budgetEstimate: number;
}

export interface AlertProbability {
  alertType: string;
  probability: number;
  timeWindow: number; // hours
  confidence: number;
  triggerFactors: string[];
}

export interface ForecastFactor {
  name: string;
  impact: number; // -1 to 1
  confidence: number;
}

export interface RiskFactor {
  name: string;
  weight: number;
  currentValue: number;
  threshold: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface StaffingRequirement {
  role: string;
  requiredCount: number;
  skillLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  timeSlots: TimeSlot[];
}

export interface EquipmentRequirement {
  type: string;
  quantity: number;
  specifications?: Record<string, any>;
  priorityLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  visibility: number;
  conditions: string;
  uvIndex?: number;
  pressure?: number;
}

// ===== Zone Entities & Database Models =====

export interface ZoneDocument {
  id: string; // UUID primary key
  name: string;
  description: string;
  type: ZoneType;
  status: ZoneStatus;
  riskLevel: RiskLevel;
  priority: ZonePriority;
  
  // Geometry and Location
  geometry: GeometryType;
  boundingBox: BoundingBox;
  area: number; // square meters
  perimeter: number; // meters
  centerPoint: Coordinates;
  
  // Relationships
  parentZone?: string; // UUID reference
  childZones: string[]; // UUID array
  adjacentZones: string[]; // UUID array
  overlappingZones: string[]; // UUID array
  
  // Configuration
  settings: ZoneSettings;
  
  // Analytics
  analytics: ZoneAnalytics;
  
  // Metadata
  createdBy: string; // UUID reference to user
  updatedBy: string; // UUID reference to user
  createdAt: Date;
  updatedAt: Date;
  version: number;
  
  // Tags and Categories
  tags: string[];
  category: string;
  subcategory?: string;
  
  // Operational Data
  isActive: boolean;
  lastActivity: Date;
  maintenanceSchedule?: MaintenanceSchedule;
  
  // External References
  externalIds: Record<string, string>;
  sourceSystem?: string;
  lastSyncAt?: Date;
}

export interface MaintenanceSchedule {
  type: 'regular' | 'emergency' | 'preventive';
  frequency: string; // cron expression
  nextMaintenance: Date;
  estimatedDuration: number; // minutes
  responsible: string[];
  checklist: MaintenanceItem[];
}

export interface MaintenanceItem {
  id: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: number; // minutes
  required: boolean;
}

// ===== Service Types & DTOs =====

export interface CreateZoneRequest {
  name: string;
  description: string;
  type: ZoneType;
  geometry: GeometryType;
  settings?: Partial<ZoneSettings>;
  parentZone?: string;
  tags?: string[];
  category?: string;
  subcategory?: string;
}

export interface UpdateZoneRequest {
  name?: string;
  description?: string;
  type?: ZoneType;
  status?: ZoneStatus;
  riskLevel?: RiskLevel;
  priority?: ZonePriority;
  geometry?: GeometryType;
  settings?: Partial<ZoneSettings>;
  tags?: string[];
  category?: string;
  subcategory?: string;
}

export interface ZoneQuery {
  type?: ZoneType | ZoneType[];
  status?: ZoneStatus | ZoneStatus[];
  riskLevel?: RiskLevel | RiskLevel[];
  priority?: ZonePriority | ZonePriority[];
  category?: string | string[];
  tags?: string | string[];
  parentZone?: string;
  bounds?: BoundingBox;
  center?: {
    coordinates: Coordinates;
    radius: number;
  };
  intersects?: GeometryType;
  contains?: Coordinates;
  occupancyRange?: {
    min?: number;
    max?: number;
  };
  createdAfter?: Date;
  createdBefore?: Date;
  updatedAfter?: Date;
  updatedBefore?: Date;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  includeAnalytics?: boolean;
  includeSettings?: boolean;
}

export interface ZoneResponse {
  id: string;
  name: string;
  description: string;
  type: ZoneType;
  status: ZoneStatus;
  riskLevel: RiskLevel;
  priority: ZonePriority;
  geometry: GeometryType;
  boundingBox: BoundingBox;
  area: number;
  perimeter: number;
  centerPoint: Coordinates;
  parentZone?: ZoneResponse;
  childZones: ZoneResponse[];
  currentOccupancy: number;
  maxCapacity: number;
  utilizationRate: number;
  activeAlerts: number;
  tags: string[];
  category: string;
  subcategory?: string;
  isActive: boolean;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
  settings?: ZoneSettings;
  analytics?: ZoneAnalytics;
}

export interface ZoneListResponse {
  zones: ZoneResponse[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  aggregations?: ZoneAggregations;
}

export interface ZoneAggregations {
  byType: Record<ZoneType, number>;
  byStatus: Record<ZoneStatus, number>;
  byRiskLevel: Record<RiskLevel, number>;
  byCategory: Record<string, number>;
  totalArea: number;
  avgOccupancy: number;
  totalCapacity: number;
}

// ===== Geofencing & Monitoring =====

export interface GeofenceEvent {
  id: string;
  type: 'entry' | 'exit' | 'dwell' | 'breach';
  touristId: string;
  zoneId: string;
  timestamp: Date;
  location: Coordinates;
  accuracy: number;
  speed?: number;
  heading?: number;
  dwellTime?: number;
  previousLocation?: Coordinates;
  triggeredAlerts: string[];
  metadata: Record<string, any>;
}

export interface GeofenceRule {
  id: string;
  name: string;
  zoneId: string;
  enabled: boolean;
  conditions: GeofenceCondition[];
  actions: GeofenceAction[];
  schedule?: TimeRestriction[];
  touristFilters: TouristFilter[];
  cooldownPeriod: number;
  priority: ZonePriority;
}

export interface GeofenceCondition {
  type: 'entry' | 'exit' | 'dwell_time' | 'speed' | 'direction' | 'time_of_day' | 'day_of_week';
  operator: 'equals' | 'greater_than' | 'less_than' | 'between';
  value: any;
  duration?: number;
}

export interface GeofenceAction {
  type: 'notification' | 'alert' | 'redirect' | 'log' | 'webhook' | 'emergency';
  target: string[];
  message: string;
  priority: ZonePriority;
  delay?: number;
  retries?: number;
}

export interface ZoneMonitoring {
  zoneId: string;
  enabled: boolean;
  lastUpdate: Date;
  activeTourists: ActiveTourist[];
  recentEvents: GeofenceEvent[];
  currentMetrics: ZoneMetrics;
  alerts: ZoneAlert[];
  recommendations: ZoneRecommendation[];
}

export interface ActiveTourist {
  touristId: string;
  entryTime: Date;
  currentLocation: Coordinates;
  dwellTime: number;
  movementPattern: MovementPattern;
  riskScore: number;
  alerts: string[];
}

export interface MovementPattern {
  path: Coordinates[];
  speed: number;
  direction: number;
  stops: StopPoint[];
  predictedRoute: Coordinates[];
  behaviour: 'normal' | 'wandering' | 'stationary' | 'rapid' | 'erratic';
}

export interface StopPoint {
  location: Coordinates;
  arrivalTime: Date;
  departureTime?: Date;
  duration: number;
  activity: string;
}

export interface ZoneMetrics {
  timestamp: Date;
  occupancy: number;
  capacity: number;
  utilizationRate: number;
  avgDwellTime: number;
  entryRate: number;
  exitRate: number;
  crowdDensity: number;
  riskScore: number;
  alertCount: number;
  satisfaction: number;
}

export interface ZoneAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  zoneId: string;
  touristId?: string;
  status: 'active' | 'acknowledged' | 'resolved';
  assignedTo?: string[];
  resolutionTime?: Date;
  escalationLevel: number;
}

export interface ZoneRecommendation {
  id: string;
  type: 'capacity' | 'safety' | 'efficiency' | 'experience';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  suggestedActions: string[];
  expectedImpact: string;
  implementationEffort: 'low' | 'medium' | 'high';
  aiConfidence: number;
}

// ===== Bulk Operations =====

export interface BulkZoneOperation {
  operation: 'create' | 'update' | 'delete' | 'import';
  zones: any[];
  options: BulkOperationOptions;
}

export interface BulkOperationOptions {
  validateOnly?: boolean;
  skipDuplicates?: boolean;
  updateExisting?: boolean;
  batchSize?: number;
  continueOnError?: boolean;
  notifyOnCompletion?: boolean;
  generateReport?: boolean;
}

export interface BulkOperationResult {
  success: boolean;
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  skippedCount: number;
  results: OperationResult[];
  errors: OperationError[];
  report?: OperationReport;
  executionTime: number;
}

export interface OperationResult {
  index: number;
  success: boolean;
  zoneId?: string;
  action: string;
  message?: string;
}

export interface OperationError {
  index: number;
  error: string;
  details?: any;
  recoverable: boolean;
}

export interface OperationReport {
  summary: Record<string, number>;
  details: any[];
  recommendations: string[];
  nextSteps: string[];
}

// ===== Export Types =====

export interface ZoneExportRequest {
  format: 'json' | 'csv' | 'geojson' | 'kml' | 'shapefile';
  filters: ZoneQuery;
  includeAnalytics: boolean;
  includeSettings: boolean;
  includeRelationships: boolean;
  compression?: 'zip' | 'gzip';
}

export interface ZoneImportRequest {
  format: 'json' | 'csv' | 'geojson' | 'kml' | 'shapefile';
  data: any;
  options: ImportOptions;
}

export interface ImportOptions {
  validateGeometry: boolean;
  createMissing: boolean;
  updateExisting: boolean;
  preserveIds: boolean;
  defaultSettings?: Partial<ZoneSettings>;
  fieldMapping?: Record<string, string>;
}

// ===== Cache & Performance =====

export interface ZoneCacheKey {
  operation: string;
  parameters: Record<string, any>;
  version?: string;
}

export interface ZoneCacheEntry {
  key: ZoneCacheKey;
  data: any;
  createdAt: Date;
  expiresAt: Date;
  accessCount: number;
  lastAccessed: Date;
  tags: string[];
}

export interface ZoneIndexes {
  spatial: SpatialIndex[];
  text: TextIndex[];
  compound: CompoundIndex[];
}

export interface SpatialIndex {
  field: string;
  type: '2dsphere' | '2d';
  background: boolean;
}

export interface TextIndex {
  fields: Record<string, number>;
  language: string;
  background: boolean;
}

export interface CompoundIndex {
  fields: Record<string, 1 | -1>;
  unique?: boolean;
  sparse?: boolean;
  background: boolean;
}

// ===== WebSocket & Real-time =====

export interface ZoneSubscription {
  subscriptionId: string;
  userId: string;
  zoneIds: string[];
  eventTypes: string[];
  filters: SubscriptionFilter[];
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
}

export interface SubscriptionFilter {
  field: string;
  operator: string;
  value: any;
}

export interface ZoneEvent {
  id: string;
  type: string;
  zoneId: string;
  timestamp: Date;
  data: any;
  source: string;
  userId?: string;
  sessionId?: string;
}

export interface ZoneUpdate {
  zoneId: string;
  changes: Record<string, any>;
  timestamp: Date;
  version: number;
  userId: string;
  reason: string;
}

// ===== Security & Permissions =====

export interface ZonePermission {
  userId: string;
  zoneId: string;
  permissions: Permission[];
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
  conditions?: PermissionCondition[];
}

export interface Permission {
  action: 'read' | 'write' | 'delete' | 'manage' | 'monitor' | 'alert';
  resource: 'zone' | 'settings' | 'analytics' | 'alerts' | 'tourists';
  granted: boolean;
}

export interface PermissionCondition {
  type: 'time' | 'location' | 'role' | 'department';
  value: any;
}

export interface ZoneAuditLog {
  id: string;
  zoneId: string;
  action: string;
  userId: string;
  timestamp: Date;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  result: 'success' | 'failure';
  errorMessage?: string;
}
