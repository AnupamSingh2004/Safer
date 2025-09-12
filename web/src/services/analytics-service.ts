/**
 * Smart Tourist Safety System - Analytics Service
 * Service for analytics data aggregation, processing, and API interactions
 */

import type {
  AnalyticsData,
  TourismStats,
  SafetyMetrics,
  AlertStatistics,
  RealTimeMetrics,
  AnalyticsFilter,
  AnalyticsQuery,
  AnalyticsExport,
  KPI,
  Benchmark,
  GeographicData,
  HeatmapPoint,
  Forecast,
  Prediction,
  Report,
  ReportParameters,
  ChartSeries,
  TimeSeriesData,
  DashboardWidget,
  WidgetConfig
} from '@/types/analytics';
import type { Tourist } from '@/types/tourist';
import type { Alert } from '@/types/alert';

// ============================================================================
// API CLIENT CONFIGURATION
// ============================================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
const ANALYTICS_ENDPOINT = `${API_BASE}/analytics`;
const DASHBOARD_ENDPOINT = `${API_BASE}/dashboard`;

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// ANALYTICS SERVICE CLASS
// ============================================================================

export class AnalyticsService {
  private static instance: AnalyticsService;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes default

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // ============================================================================
  // CACHE MANAGEMENT
  // ============================================================================

  private getCacheKey(endpoint: string, params?: Record<string, any>): string {
    const paramStr = params ? JSON.stringify(params) : '';
    return `${endpoint}:${paramStr}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now > cached.timestamp + cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }

  private setCache<T>(key: string, data: T, ttl: number = this.CACHE_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // ============================================================================
  // HTTP CLIENT METHODS
  // ============================================================================

  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache: boolean = true,
    cacheTtl: number = this.CACHE_TTL
  ): Promise<ApiResponse<T>> {
    const cacheKey = this.getCacheKey(endpoint, options.body ? JSON.parse(options.body as string) : undefined);
    
    // Check cache for GET requests
    if (useCache && (!options.method || options.method === 'GET')) {
      const cached = this.getFromCache<ApiResponse<T>>(cacheKey);
      if (cached) return cached;
    }

    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Analytics API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as ApiResponse<T>;
    
    // Cache successful GET responses
    if (useCache && (!options.method || options.method === 'GET') && data.success) {
      this.setCache(cacheKey, data, cacheTtl);
    }

    return data;
  }

  // ============================================================================
  // CORE ANALYTICS DATA
  // ============================================================================

  async getAnalyticsOverview(filters?: AnalyticsFilter): Promise<AnalyticsData> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }

    const response = await this.fetchApi<AnalyticsData>(
      `${ANALYTICS_ENDPOINT}/overview?${params}`,
      {},
      true,
      2 * 60 * 1000 // 2 minutes cache
    );

    return response.data;
  }

  async getTourismStatistics(filters?: AnalyticsFilter): Promise<TourismStats> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }

    const response = await this.fetchApi<TourismStats>(
      `${ANALYTICS_ENDPOINT}/tourism?${params}`
    );

    return response.data;
  }

  async getSafetyMetrics(filters?: AnalyticsFilter): Promise<SafetyMetrics> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }

    const response = await this.fetchApi<SafetyMetrics>(
      `${ANALYTICS_ENDPOINT}/safety?${params}`
    );

    return response.data;
  }

  async getAlertStatistics(filters?: AnalyticsFilter): Promise<AlertStatistics> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }

    const response = await this.fetchApi<AlertStatistics>(
      `${ANALYTICS_ENDPOINT}/alerts?${params}`
    );

    return response.data;
  }

  async getRealTimeMetrics(): Promise<RealTimeMetrics> {
    const response = await this.fetchApi<RealTimeMetrics>(
      `${ANALYTICS_ENDPOINT}/realtime`,
      {},
      false // Don't cache real-time data
    );

    return response.data;
  }

  // ============================================================================
  // CHART DATA
  // ============================================================================

  async getChartData(
    chartType: string,
    metric: string,
    filters?: AnalyticsFilter
  ): Promise<ChartSeries[]> {
    const params = new URLSearchParams({
      chartType,
      metric,
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }

    const response = await this.fetchApi<ChartSeries[]>(
      `${ANALYTICS_ENDPOINT}/charts?${params}`
    );

    return response.data;
  }

  async getTimeSeriesData(
    metric: string,
    granularity: 'hour' | 'day' | 'week' | 'month' = 'hour',
    filters?: AnalyticsFilter
  ): Promise<TimeSeriesData[]> {
    const params = new URLSearchParams({
      metric,
      granularity,
    });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }

    const response = await this.fetchApi<TimeSeriesData[]>(
      `${ANALYTICS_ENDPOINT}/timeseries?${params}`
    );

    return response.data;
  }

  async getHeatmapData(
    type: 'tourist_density' | 'incident_frequency' | 'alert_concentration' | 'safety_score',
    filters?: AnalyticsFilter
  ): Promise<HeatmapPoint[]> {
    const params = new URLSearchParams({ type });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }

    const response = await this.fetchApi<HeatmapPoint[]>(
      `${ANALYTICS_ENDPOINT}/heatmap?${params}`
    );

    return response.data;
  }

  // ============================================================================
  // KPI AND BENCHMARKS
  // ============================================================================

  async getKPIs(category?: string): Promise<KPI[]> {
    const params = new URLSearchParams();
    if (category) {
      params.append('category', category);
    }

    const response = await this.fetchApi<KPI[]>(
      `${ANALYTICS_ENDPOINT}/kpis?${params}`
    );

    return response.data;
  }

  async updateKPI(kpiId: string, updates: Partial<KPI>): Promise<KPI> {
    const response = await this.fetchApi<KPI>(
      `${ANALYTICS_ENDPOINT}/kpis/${kpiId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updates),
      },
      false
    );

    // Clear KPI cache
    this.clearCache('kpis');

    return response.data;
  }

  async getBenchmarks(industry?: string): Promise<Benchmark[]> {
    const params = new URLSearchParams();
    if (industry) {
      params.append('industry', industry);
    }

    const response = await this.fetchApi<Benchmark[]>(
      `${ANALYTICS_ENDPOINT}/benchmarks?${params}`
    );

    return response.data;
  }

  // ============================================================================
  // GEOGRAPHIC DATA
  // ============================================================================

  async getGeographicData(filters?: AnalyticsFilter): Promise<GeographicData[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        }
      });
    }

    const response = await this.fetchApi<GeographicData[]>(
      `${ANALYTICS_ENDPOINT}/geographic?${params}`
    );

    return response.data;
  }

  async getLocationAnalytics(locationId: string): Promise<GeographicData> {
    const response = await this.fetchApi<GeographicData>(
      `${ANALYTICS_ENDPOINT}/geographic/${locationId}`
    );

    return response.data;
  }

  // ============================================================================
  // PREDICTIVE ANALYTICS
  // ============================================================================

  async getForecasts(metric?: string): Promise<Forecast[]> {
    const params = new URLSearchParams();
    if (metric) {
      params.append('metric', metric);
    }

    const response = await this.fetchApi<Forecast[]>(
      `${ANALYTICS_ENDPOINT}/forecasts?${params}`,
      {},
      true,
      15 * 60 * 1000 // 15 minutes cache for forecasts
    );

    return response.data;
  }

  async generatePrediction(
    type: 'tourist_flow' | 'incident_risk' | 'resource_demand' | 'seasonal_trend',
    targetDate: string,
    parameters?: Record<string, any>
  ): Promise<Prediction> {
    const response = await this.fetchApi<Prediction>(
      `${ANALYTICS_ENDPOINT}/predictions`,
      {
        method: 'POST',
        body: JSON.stringify({
          type,
          targetDate,
          parameters: parameters || {}
        }),
      },
      false
    );

    return response.data;
  }

  // ============================================================================
  // DASHBOARD WIDGETS
  // ============================================================================

  async getWidgetData(widgetId: string, config: WidgetConfig): Promise<any> {
    const response = await this.fetchApi<any>(
      `${DASHBOARD_ENDPOINT}/widgets/${widgetId}/data`,
      {
        method: 'POST',
        body: JSON.stringify(config),
      },
      true,
      1 * 60 * 1000 // 1 minute cache for widget data
    );

    return response.data;
  }

  async saveWidget(widget: DashboardWidget): Promise<DashboardWidget> {
    const response = await this.fetchApi<DashboardWidget>(
      `${DASHBOARD_ENDPOINT}/widgets`,
      {
        method: 'POST',
        body: JSON.stringify(widget),
      },
      false
    );

    // Clear dashboard cache
    this.clearCache('dashboard');

    return response.data;
  }

  async updateWidget(widgetId: string, updates: Partial<DashboardWidget>): Promise<DashboardWidget> {
    const response = await this.fetchApi<DashboardWidget>(
      `${DASHBOARD_ENDPOINT}/widgets/${widgetId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updates),
      },
      false
    );

    // Clear dashboard cache
    this.clearCache('dashboard');

    return response.data;
  }

  async deleteWidget(widgetId: string): Promise<void> {
    await this.fetchApi<void>(
      `${DASHBOARD_ENDPOINT}/widgets/${widgetId}`,
      {
        method: 'DELETE',
      },
      false
    );

    // Clear dashboard cache
    this.clearCache('dashboard');
  }

  // ============================================================================
  // REPORTING
  // ============================================================================

  async generateReport(parameters: ReportParameters): Promise<Report> {
    const response = await this.fetchApi<Report>(
      `${ANALYTICS_ENDPOINT}/reports`,
      {
        method: 'POST',
        body: JSON.stringify(parameters),
      },
      false
    );

    return response.data;
  }

  async getReports(limit: number = 50, offset: number = 0): Promise<PaginatedResponse<Report>> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const response = await this.fetchApi<Report[]>(
      `${ANALYTICS_ENDPOINT}/reports?${params}`
    );

    return response as PaginatedResponse<Report>;
  }

  async downloadReport(reportId: string, format: 'pdf' | 'excel' | 'csv'): Promise<Blob> {
    const response = await fetch(
      `${ANALYTICS_ENDPOINT}/reports/${reportId}/download?format=${format}`,
      {
        headers: {
          'Accept': format === 'pdf' ? 'application/pdf' : 
                   format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                   'text/csv',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to download report: ${response.status} ${response.statusText}`);
    }

    return response.blob();
  }

  // ============================================================================
  // DATA EXPORT
  // ============================================================================

  async exportAnalyticsData(
    type: 'overview' | 'tourism' | 'safety' | 'alerts' | 'geographic',
    format: 'csv' | 'excel' | 'json',
    filters?: AnalyticsFilter
  ): Promise<AnalyticsExport> {
    const response = await this.fetchApi<AnalyticsExport>(
      `${ANALYTICS_ENDPOINT}/export`,
      {
        method: 'POST',
        body: JSON.stringify({
          type,
          format,
          filters: filters || {}
        }),
      },
      false
    );

    return response.data;
  }

  async downloadExport(exportId: string): Promise<Blob> {
    const response = await fetch(`${ANALYTICS_ENDPOINT}/export/${exportId}/download`);

    if (!response.ok) {
      throw new Error(`Failed to download export: ${response.status} ${response.statusText}`);
    }

    return response.blob();
  }

  // ============================================================================
  // SEARCH AND QUERIES
  // ============================================================================

  async executeQuery(query: AnalyticsQuery): Promise<any> {
    const response = await this.fetchApi<any>(
      `${ANALYTICS_ENDPOINT}/query`,
      {
        method: 'POST',
        body: JSON.stringify(query),
      },
      true,
      30 * 1000 // 30 seconds cache for queries
    );

    return response.data;
  }

  async saveQuery(name: string, query: AnalyticsQuery): Promise<{ id: string; name: string; query: AnalyticsQuery }> {
    const response = await this.fetchApi<{ id: string; name: string; query: AnalyticsQuery }>(
      `${ANALYTICS_ENDPOINT}/queries`,
      {
        method: 'POST',
        body: JSON.stringify({ name, query }),
      },
      false
    );

    return response.data;
  }

  async getSavedQueries(): Promise<Array<{ id: string; name: string; query: AnalyticsQuery }>> {
    const response = await this.fetchApi<Array<{ id: string; name: string; query: AnalyticsQuery }>>(
      `${ANALYTICS_ENDPOINT}/queries`
    );

    return response.data;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  async validateConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${ANALYTICS_ENDPOINT}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  clearAllCache(): void {
    this.cache.clear();
  }

  // ============================================================================
  // DATA PROCESSING UTILITIES
  // ============================================================================

  processTimeSeriesData(
    data: TimeSeriesData[],
    aggregation: 'sum' | 'average' | 'max' | 'min' = 'sum'
  ): TimeSeriesData[] {
    const grouped = new Map<string, TimeSeriesData[]>();

    // Group by timestamp (hour/day depending on granularity)
    data.forEach(point => {
      const key = new Date(point.timestamp).toISOString().split('T')[0]; // Group by day
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(point);
    });

    // Aggregate grouped data
    return Array.from(grouped.entries()).map(([timestamp, points]) => {
      let value: number;
      
      switch (aggregation) {
        case 'sum':
          value = points.reduce((sum, p) => sum + p.value, 0);
          break;
        case 'average':
          value = points.reduce((sum, p) => sum + p.value, 0) / points.length;
          break;
        case 'max':
          value = Math.max(...points.map(p => p.value));
          break;
        case 'min':
          value = Math.min(...points.map(p => p.value));
          break;
        default:
          value = points.reduce((sum, p) => sum + p.value, 0);
      }

      return {
        timestamp: `${timestamp}T00:00:00.000Z`,
        value: Math.round(value * 100) / 100, // Round to 2 decimal places
        label: points[0]?.label,
        category: points[0]?.category,
      };
    }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  calculateTrendPercentage(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100 * 100) / 100;
  }

  formatMetricValue(value: number, unit: string): string {
    if (unit === 'percentage') {
      return `${value.toFixed(1)}%`;
    }
    
    if (unit === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    }
    
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    
    return value.toString();
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const analyticsService = AnalyticsService.getInstance();

// ============================================================================
// CONVENIENCE HOOKS
// ============================================================================

export const useAnalyticsService = () => analyticsService;

// ============================================================================
// MOCK DATA GENERATORS (For Development)
// ============================================================================

export const generateMockAnalyticsData = (): AnalyticsData => ({
  totalTourists: 1247,
  activeTourists: 892,
  totalAlerts: 23,
  activeAlerts: 5,
  resolvedAlerts: 18,
  averageResponseTime: 4.5,
  touristSatisfactionScore: 87.3,
  safetyIncidents: 2,
  emergencyCallbacks: 1,
  verifiedIdentities: 1189,
});

export const generateMockTimeSeriesData = (metric: string, points: number = 24): TimeSeriesData[] => {
  const now = new Date();
  const data: TimeSeriesData[] = [];
  
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
    const value = Math.floor(Math.random() * 100) + Math.sin(i * 0.5) * 20;
    
    data.push({
      timestamp,
      value: Math.max(0, value),
      label: metric,
      category: 'mock',
    });
  }
  
  return data;
};

export const generateMockChartSeries = (seriesCount: number = 3, pointsPerSeries: number = 10): ChartSeries[] => {
  const series: ChartSeries[] = [];
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
  
  for (let s = 0; s < seriesCount; s++) {
    const data = [];
    for (let p = 0; p < pointsPerSeries; p++) {
      data.push({
        x: p,
        y: Math.floor(Math.random() * 100),
        label: `Point ${p + 1}`,
      });
    }
    
    series.push({
      name: `Series ${s + 1}`,
      data,
      color: colors[s % colors.length],
      type: 'line',
    });
  }
  
  return series;
};