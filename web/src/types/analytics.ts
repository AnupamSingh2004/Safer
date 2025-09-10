/**
 * Smart Tourist Safety System - Analytics Types
 * TypeScript interfaces for analytics and reporting features
 */

// ============================================================================
// CORE ANALYTICS INTERFACES
// ============================================================================

export interface AnalyticsData {
  totalTourists: number;
  activeTourists: number;
  totalAlerts: number;
  activeAlerts: number;
  resolvedAlerts: number;
  averageResponseTime: number;
  touristSatisfactionScore: number;
  safetyIncidents: number;
  emergencyCallbacks: number;
  verifiedIdentities: number;
}

export interface TourismStats {
  totalVisitors: number;
  newVisitors: number;
  returningVisitors: number;
  averageStayDuration: number;
  popularDestinations: PopularDestination[];
  visitorsByCountry: VisitorsByCountry[];
  monthlyGrowth: number;
  seasonalTrends: SeasonalTrend[];
}

export interface SafetyMetrics {
  totalIncidents: number;
  resolvedIncidents: number;
  pendingIncidents: number;
  averageResolutionTime: number;
  incidentsByType: IncidentByType[];
  safetyScore: number;
  riskAreas: RiskArea[];
  emergencyResponseTime: number;
}

export interface AlertStatistics {
  totalAlerts: number;
  emergencyAlerts: number;
  warningAlerts: number;
  infoAlerts: number;
  alertsByLocation: AlertsByLocation[];
  alertsByTime: AlertsByTime[];
  responseRates: ResponseRate[];
  escalationRates: number;
}

// ============================================================================
// DETAILED ANALYTICS INTERFACES
// ============================================================================

export interface PopularDestination {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  visitCount: number;
  averageRating: number;
  safetyScore: number;
  lastVisited: string;
  category: 'attraction' | 'restaurant' | 'hotel' | 'activity' | 'transport';
}

export interface VisitorsByCountry {
  country: string;
  countryCode: string;
  count: number;
  percentage: number;
  averageStayDuration: number;
  safetyIncidents: number;
}

export interface SeasonalTrend {
  month: string;
  year: number;
  visitors: number;
  incidents: number;
  safetyScore: number;
  averageSpending: number;
}

export interface IncidentByType {
  type: 'medical' | 'theft' | 'accident' | 'natural' | 'security' | 'other';
  count: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  averageResolutionTime: number;
  escalationRate: number;
}

export interface RiskArea {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  incidentCount: number;
  lastIncident: string;
  riskFactors: string[];
}

export interface AlertsByLocation {
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  alertCount: number;
  severityBreakdown: {
    emergency: number;
    warning: number;
    info: number;
  };
  averageResponseTime: number;
}

export interface AlertsByTime {
  hour: number;
  day: string;
  alertCount: number;
  emergencyCount: number;
  averageResponseTime: number;
}

export interface ResponseRate {
  alertType: string;
  responseRate: number;
  averageResponseTime: number;
  escalationRate: number;
  resolutionRate: number;
}

// ============================================================================
// TIME SERIES DATA
// ============================================================================

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
  category?: string;
}

export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
  color?: string;
  metadata?: Record<string, any>;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: 'line' | 'bar' | 'area' | 'scatter';
}

// ============================================================================
// ANALYTICS FILTERS AND QUERIES
// ============================================================================

export interface AnalyticsFilter {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  locations?: string[];
  alertTypes?: string[];
  incidentTypes?: string[];
  severityLevels?: string[];
  touristCountries?: string[];
  responseTeams?: string[];
  timeGranularity: 'hour' | 'day' | 'week' | 'month' | 'year';
}

export interface AnalyticsQuery {
  metric: string;
  filters: AnalyticsFilter;
  groupBy?: string[];
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  limit?: number;
  offset?: number;
}

// ============================================================================
// DASHBOARD CONFIGURATION
// ============================================================================

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'map' | 'list';
  title: string;
  description?: string;
  size: 'small' | 'medium' | 'large' | 'full';
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  config: WidgetConfig;
  refreshInterval?: number;
  lastUpdated?: string;
}

export interface WidgetConfig {
  metric?: string;
  chartType?: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter';
  dataSource: string;
  filters?: AnalyticsFilter;
  displayOptions?: {
    showLegend?: boolean;
    showGrid?: boolean;
    showTooltip?: boolean;
    showLabels?: boolean;
    colorScheme?: string[];
    animation?: boolean;
  };
}

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  widgets: DashboardWidget[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// ============================================================================
// REPORTING INTERFACES
// ============================================================================

export interface Report {
  id: string;
  title: string;
  description?: string;
  type: 'safety' | 'tourism' | 'analytics' | 'custom';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  schedule?: ReportSchedule;
  recipients?: string[];
  parameters: ReportParameters;
  lastGenerated?: string;
  status: 'active' | 'inactive' | 'processing' | 'failed';
  createdAt: string;
  createdBy: string;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  time: string; // HH:MM format
  timezone: string;
  startDate: string;
  endDate?: string;
  daysOfWeek?: number[]; // 0-6, Sunday-Saturday
  dayOfMonth?: number; // 1-31
}

export interface ReportParameters {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  includeCharts: boolean;
  includeTables: boolean;
  includeComments: boolean;
  sections: ReportSection[];
  filters?: AnalyticsFilter;
}

export interface ReportSection {
  id: string;
  type: 'summary' | 'metrics' | 'charts' | 'tables' | 'analysis' | 'recommendations';
  title: string;
  enabled: boolean;
  order: number;
  config?: Record<string, any>;
}

// ============================================================================
// REAL-TIME ANALYTICS
// ============================================================================

export interface RealTimeMetrics {
  activeTourists: number;
  activeAlerts: number;
  responseTeamsOnDuty: number;
  currentThreatLevel: 'low' | 'medium' | 'high' | 'critical';
  recentActivities: RecentActivity[];
  systemHealth: SystemHealth;
  lastUpdated: string;
}

export interface RecentActivity {
  id: string;
  type: 'tourist_checkin' | 'alert_created' | 'incident_reported' | 'emergency_call' | 'identity_verified';
  timestamp: string;
  description: string;
  location?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status?: string;
  userId?: string;
}

export interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  services: ServiceHealth[];
  performance: PerformanceMetrics;
  lastHealthCheck: string;
}

export interface ServiceHealth {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  responseTime: number;
  uptime: number;
  lastCheck: string;
  errors?: string[];
}

export interface PerformanceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLatency: number;
  apiResponseTime: number;
  databaseResponseTime: number;
}

// ============================================================================
// ANALYTICS EXPORTS AND UTILITIES
// ============================================================================

export interface AnalyticsExport {
  id: string;
  name: string;
  format: 'csv' | 'excel' | 'json' | 'pdf';
  data: any[];
  metadata: {
    totalRecords: number;
    exportedAt: string;
    exportedBy: string;
    filters?: AnalyticsFilter;
    columns: string[];
  };
}

export interface KPI {
  id: string;
  name: string;
  description: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  status: 'good' | 'warning' | 'critical';
  lastUpdated: string;
}

export interface Benchmark {
  metric: string;
  currentValue: number;
  benchmarkValue: number;
  unit: string;
  variance: number;
  variancePercentage: number;
  status: 'above' | 'below' | 'equal';
  industry: string;
  period: string;
}

// ============================================================================
// GEOGRAPHIC ANALYTICS
// ============================================================================

export interface GeographicData {
  id: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    region: string;
    country: string;
  };
  metrics: {
    touristCount: number;
    incidentCount: number;
    alertCount: number;
    safetyScore: number;
    popularityScore: number;
  };
  heatmapData: HeatmapPoint[];
}

export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  intensity: number;
  type: 'tourist_density' | 'incident_frequency' | 'alert_concentration' | 'safety_score';
  value: number;
  timestamp?: string;
}

// ============================================================================
// PREDICTIVE ANALYTICS
// ============================================================================

export interface Prediction {
  id: string;
  type: 'tourist_flow' | 'incident_risk' | 'resource_demand' | 'seasonal_trend';
  targetDate: string;
  confidence: number;
  value: number;
  unit: string;
  factors: PredictionFactor[];
  algorithm: string;
  createdAt: string;
  accuracy?: number;
}

export interface PredictionFactor {
  name: string;
  weight: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface Forecast {
  metric: string;
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  predictions: Prediction[];
  confidence: number;
  methodology: string;
  updatedAt: string;
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type AnalyticsTimeGranularity = 'hour' | 'day' | 'week' | 'month' | 'year';
export type AnalyticsMetricType = 'count' | 'percentage' | 'average' | 'sum' | 'ratio';
export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter' | 'heatmap';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentType = 'medical' | 'theft' | 'accident' | 'natural' | 'security' | 'other';
export type TouristStatus = 'active' | 'inactive' | 'checked_out' | 'emergency';
