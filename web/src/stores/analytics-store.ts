/**
 * Smart Tourist Safety System - Analytics Store
 * Zustand store for managing analytics data and state
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  AnalyticsData,
  TourismStats,
  SafetyMetrics,
  AlertStatistics,
  RealTimeMetrics,
  DashboardWidget,
  DashboardLayout,
  AnalyticsFilter,
  KPI,
  GeographicData,
  Forecast,
  ChartSeries,
  TimeSeriesData
} from '@/types/analytics';

// ============================================================================
// STORE INTERFACES
// ============================================================================

interface AnalyticsState {
  // Core Analytics Data
  analyticsData: AnalyticsData | null;
  tourismStats: TourismStats | null;
  safetyMetrics: SafetyMetrics | null;
  alertStatistics: AlertStatistics | null;
  realTimeMetrics: RealTimeMetrics | null;
  
  // Dashboard Configuration
  dashboardLayouts: DashboardLayout[];
  activeDashboard: string | null;
  widgets: DashboardWidget[];
  
  // Filters and Queries
  activeFilters: AnalyticsFilter;
  savedFilters: Array<{ id: string; name: string; filters: AnalyticsFilter }>;
  
  // Chart Data
  chartData: Record<string, ChartSeries[]>;
  timeSeriesData: Record<string, TimeSeriesData[]>;
  
  // KPIs and Metrics
  kpis: KPI[];
  forecasts: Forecast[];
  geographicData: GeographicData[];
  
  // UI State
  isLoading: boolean;
  isRefreshing: boolean;
  lastUpdated: string | null;
  selectedTimeRange: '1h' | '24h' | '7d' | '30d' | '90d' | 'custom';
  autoRefresh: boolean;
  refreshInterval: number; // seconds
  
  // Error Handling
  error: string | null;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
}

interface AnalyticsActions {
  // Data Actions
  setAnalyticsData: (data: AnalyticsData) => void;
  setTourismStats: (stats: TourismStats) => void;
  setSafetyMetrics: (metrics: SafetyMetrics) => void;
  setAlertStatistics: (stats: AlertStatistics) => void;
  setRealTimeMetrics: (metrics: RealTimeMetrics) => void;
  updateRealTimeMetrics: (updates: Partial<RealTimeMetrics>) => void;
  
  // Chart Data Actions
  setChartData: (chartId: string, data: ChartSeries[]) => void;
  updateChartData: (chartId: string, data: Partial<ChartSeries>[]) => void;
  setTimeSeriesData: (seriesId: string, data: TimeSeriesData[]) => void;
  addTimeSeriesPoint: (seriesId: string, point: TimeSeriesData) => void;
  
  // KPI Actions
  setKPIs: (kpis: KPI[]) => void;
  updateKPI: (kpiId: string, updates: Partial<KPI>) => void;
  
  // Dashboard Actions
  setDashboardLayouts: (layouts: DashboardLayout[]) => void;
  setActiveDashboard: (dashboardId: string | null) => void;
  addWidget: (widget: DashboardWidget) => void;
  updateWidget: (widgetId: string, updates: Partial<DashboardWidget>) => void;
  removeWidget: (widgetId: string) => void;
  reorderWidgets: (widgets: DashboardWidget[]) => void;
  
  // Filter Actions
  setActiveFilters: (filters: AnalyticsFilter) => void;
  updateFilters: (updates: Partial<AnalyticsFilter>) => void;
  saveFilter: (name: string, filters: AnalyticsFilter) => void;
  loadSavedFilter: (filterId: string) => void;
  deleteSavedFilter: (filterId: string) => void;
  clearFilters: () => void;
  
  // Geographic Data Actions
  setGeographicData: (data: GeographicData[]) => void;
  updateGeographicData: (locationId: string, updates: Partial<GeographicData>) => void;
  
  // Forecast Actions
  setForecasts: (forecasts: Forecast[]) => void;
  updateForecast: (forecastId: string, updates: Partial<Forecast>) => void;
  
  // UI Actions
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setSelectedTimeRange: (range: AnalyticsState['selectedTimeRange']) => void;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (seconds: number) => void;
  setError: (error: string | null) => void;
  setConnectionStatus: (status: AnalyticsState['connectionStatus']) => void;
  
  // Utility Actions
  refreshAllData: () => Promise<void>;
  exportData: (format: 'csv' | 'excel' | 'json') => Promise<void>;
  resetStore: () => void;
}

type AnalyticsStore = AnalyticsState & AnalyticsActions;

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const getDefaultTimeRange = (): { startDate: string; endDate: string } => {
  const now = new Date();
  const endDate = now.toISOString();
  const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(); // 24h ago
  return { startDate, endDate };
};

const defaultFilters: AnalyticsFilter = {
  dateRange: getDefaultTimeRange(),
  timeGranularity: 'hour',
};

const initialState: AnalyticsState = {
  // Core Analytics Data
  analyticsData: null,
  tourismStats: null,
  safetyMetrics: null,
  alertStatistics: null,
  realTimeMetrics: null,
  
  // Dashboard Configuration
  dashboardLayouts: [],
  activeDashboard: null,
  widgets: [],
  
  // Filters and Queries
  activeFilters: defaultFilters,
  savedFilters: [],
  
  // Chart Data
  chartData: {},
  timeSeriesData: {},
  
  // KPIs and Metrics
  kpis: [],
  forecasts: [],
  geographicData: [],
  
  // UI State
  isLoading: false,
  isRefreshing: false,
  lastUpdated: null,
  selectedTimeRange: '24h',
  autoRefresh: true,
  refreshInterval: 30, // 30 seconds
  
  // Error Handling
  error: null,
  connectionStatus: 'connected',
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useAnalyticsStore = create<AnalyticsStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Data Actions
        setAnalyticsData: (data) => {
          set({ 
            analyticsData: data, 
            lastUpdated: new Date().toISOString() 
          }, false, 'setAnalyticsData');
        },
        
        setTourismStats: (stats) => {
          set({ 
            tourismStats: stats, 
            lastUpdated: new Date().toISOString() 
          }, false, 'setTourismStats');
        },
        
        setSafetyMetrics: (metrics) => {
          set({ 
            safetyMetrics: metrics, 
            lastUpdated: new Date().toISOString() 
          }, false, 'setSafetyMetrics');
        },
        
        setAlertStatistics: (stats) => {
          set({ 
            alertStatistics: stats, 
            lastUpdated: new Date().toISOString() 
          }, false, 'setAlertStatistics');
        },
        
        setRealTimeMetrics: (metrics) => {
          set({ 
            realTimeMetrics: metrics, 
            lastUpdated: new Date().toISOString() 
          }, false, 'setRealTimeMetrics');
        },
        
        updateRealTimeMetrics: (updates) => {
          const current = get().realTimeMetrics;
          if (current) {
            set({ 
              realTimeMetrics: { ...current, ...updates },
              lastUpdated: new Date().toISOString()
            }, false, 'updateRealTimeMetrics');
          }
        },
        
        // Chart Data Actions
        setChartData: (chartId, data) => {
          set((state) => ({
            chartData: {
              ...state.chartData,
              [chartId]: data
            },
            lastUpdated: new Date().toISOString()
          }), false, 'setChartData');
        },
        
        updateChartData: (chartId, data) => {
          const current = get().chartData[chartId] || [];
          const updated = current.map(series => {
            const update = data.find(u => u.name === series.name);
            return update ? { ...series, ...update } : series;
          });
          
          set((state) => ({
            chartData: {
              ...state.chartData,
              [chartId]: updated
            },
            lastUpdated: new Date().toISOString()
          }), false, 'updateChartData');
        },
        
        setTimeSeriesData: (seriesId, data) => {
          set((state) => ({
            timeSeriesData: {
              ...state.timeSeriesData,
              [seriesId]: data
            },
            lastUpdated: new Date().toISOString()
          }), false, 'setTimeSeriesData');
        },
        
        addTimeSeriesPoint: (seriesId, point) => {
          const current = get().timeSeriesData[seriesId] || [];
          const updated = [...current, point].slice(-1000); // Keep last 1000 points
          
          set((state) => ({
            timeSeriesData: {
              ...state.timeSeriesData,
              [seriesId]: updated
            },
            lastUpdated: new Date().toISOString()
          }), false, 'addTimeSeriesPoint');
        },
        
        // KPI Actions
        setKPIs: (kpis) => {
          set({ 
            kpis, 
            lastUpdated: new Date().toISOString() 
          }, false, 'setKPIs');
        },
        
        updateKPI: (kpiId, updates) => {
          set((state) => ({
            kpis: state.kpis.map(kpi => 
              kpi.id === kpiId ? { ...kpi, ...updates } : kpi
            ),
            lastUpdated: new Date().toISOString()
          }), false, 'updateKPI');
        },
        
        // Dashboard Actions
        setDashboardLayouts: (layouts) => {
          set({ dashboardLayouts: layouts }, false, 'setDashboardLayouts');
        },
        
        setActiveDashboard: (dashboardId) => {
          set({ activeDashboard: dashboardId }, false, 'setActiveDashboard');
        },
        
        addWidget: (widget) => {
          set((state) => ({
            widgets: [...state.widgets, widget]
          }), false, 'addWidget');
        },
        
        updateWidget: (widgetId, updates) => {
          set((state) => ({
            widgets: state.widgets.map(widget =>
              widget.id === widgetId ? { ...widget, ...updates } : widget
            )
          }), false, 'updateWidget');
        },
        
        removeWidget: (widgetId) => {
          set((state) => ({
            widgets: state.widgets.filter(widget => widget.id !== widgetId)
          }), false, 'removeWidget');
        },
        
        reorderWidgets: (widgets) => {
          set({ widgets }, false, 'reorderWidgets');
        },
        
        // Filter Actions
        setActiveFilters: (filters) => {
          set({ activeFilters: filters }, false, 'setActiveFilters');
        },
        
        updateFilters: (updates) => {
          set((state) => ({
            activeFilters: { ...state.activeFilters, ...updates }
          }), false, 'updateFilters');
        },
        
        saveFilter: (name, filters) => {
          const id = Date.now().toString();
          set((state) => ({
            savedFilters: [...state.savedFilters, { id, name, filters }]
          }), false, 'saveFilter');
        },
        
        loadSavedFilter: (filterId) => {
          const savedFilter = get().savedFilters.find(f => f.id === filterId);
          if (savedFilter) {
            set({ activeFilters: savedFilter.filters }, false, 'loadSavedFilter');
          }
        },
        
        deleteSavedFilter: (filterId) => {
          set((state) => ({
            savedFilters: state.savedFilters.filter(f => f.id !== filterId)
          }), false, 'deleteSavedFilter');
        },
        
        clearFilters: () => {
          set({ activeFilters: defaultFilters }, false, 'clearFilters');
        },
        
        // Geographic Data Actions
        setGeographicData: (data) => {
          set({ 
            geographicData: data, 
            lastUpdated: new Date().toISOString() 
          }, false, 'setGeographicData');
        },
        
        updateGeographicData: (locationId, updates) => {
          set((state) => ({
            geographicData: state.geographicData.map(item =>
              item.id === locationId ? { ...item, ...updates } : item
            ),
            lastUpdated: new Date().toISOString()
          }), false, 'updateGeographicData');
        },
        
        // Forecast Actions
        setForecasts: (forecasts) => {
          set({ 
            forecasts, 
            lastUpdated: new Date().toISOString() 
          }, false, 'setForecasts');
        },
        
        updateForecast: (forecastId, updates) => {
          set((state) => ({
            forecasts: state.forecasts.map(forecast =>
              forecast.metric === forecastId ? { ...forecast, ...updates } : forecast
            ),
            lastUpdated: new Date().toISOString()
          }), false, 'updateForecast');
        },
        
        // UI Actions
        setLoading: (loading) => {
          set({ isLoading: loading }, false, 'setLoading');
        },
        
        setRefreshing: (refreshing) => {
          set({ isRefreshing: refreshing }, false, 'setRefreshing');
        },
        
        setSelectedTimeRange: (range) => {
          // Update filters based on time range selection
          const now = new Date();
          let startDate: Date;
          
          switch (range) {
            case '1h':
              startDate = new Date(now.getTime() - 60 * 60 * 1000);
              break;
            case '24h':
              startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
              break;
            case '7d':
              startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              break;
            case '30d':
              startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              break;
            case '90d':
              startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
              break;
            default:
              return; // For 'custom', don't auto-update filters
          }
          
          set((state) => ({
            selectedTimeRange: range,
            activeFilters: {
              ...state.activeFilters,
              dateRange: {
                startDate: startDate.toISOString(),
                endDate: now.toISOString()
              }
            }
          }), false, 'setSelectedTimeRange');
        },
        
        setAutoRefresh: (enabled) => {
          set({ autoRefresh: enabled }, false, 'setAutoRefresh');
        },
        
        setRefreshInterval: (seconds) => {
          set({ refreshInterval: seconds }, false, 'setRefreshInterval');
        },
        
        setError: (error) => {
          set({ error }, false, 'setError');
        },
        
        setConnectionStatus: (status) => {
          set({ connectionStatus: status }, false, 'setConnectionStatus');
        },
        
        // Utility Actions
        refreshAllData: async () => {
          set({ isRefreshing: true, error: null }, false, 'refreshAllData:start');
          
          try {
            // This would typically call analytics service methods
            // For now, we'll just simulate a refresh
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            set({ 
              isRefreshing: false, 
              lastUpdated: new Date().toISOString() 
            }, false, 'refreshAllData:success');
          } catch (error) {
            set({ 
              isRefreshing: false, 
              error: error instanceof Error ? error.message : 'Failed to refresh data' 
            }, false, 'refreshAllData:error');
          }
        },
        
        exportData: async (format) => {
          set({ isLoading: true }, false, 'exportData:start');
          
          try {
            // This would typically call analytics service export method
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            set({ isLoading: false }, false, 'exportData:success');
          } catch (error) {
            set({ 
              isLoading: false, 
              error: error instanceof Error ? error.message : 'Failed to export data' 
            }, false, 'exportData:error');
          }
        },
        
        resetStore: () => {
          set(initialState, false, 'resetStore');
        },
      }),
      {
        name: 'analytics-store',
        partialize: (state) => ({
          // Persist only configuration and saved filters
          dashboardLayouts: state.dashboardLayouts,
          activeDashboard: state.activeDashboard,
          widgets: state.widgets,
          savedFilters: state.savedFilters,
          selectedTimeRange: state.selectedTimeRange,
          autoRefresh: state.autoRefresh,
          refreshInterval: state.refreshInterval,
        }),
      }
    ),
    {
      name: 'analytics-store',
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const useAnalyticsData = () => useAnalyticsStore((state) => state.analyticsData);
export const useTourismStats = () => useAnalyticsStore((state) => state.tourismStats);
export const useSafetyMetrics = () => useAnalyticsStore((state) => state.safetyMetrics);
export const useAlertStatistics = () => useAnalyticsStore((state) => state.alertStatistics);
export const useRealTimeMetrics = () => useAnalyticsStore((state) => state.realTimeMetrics);

export const useChartData = (chartId: string) => 
  useAnalyticsStore((state) => state.chartData[chartId] || []);

export const useTimeSeriesData = (seriesId: string) => 
  useAnalyticsStore((state) => state.timeSeriesData[seriesId] || []);

export const useActiveFilters = () => useAnalyticsStore((state) => state.activeFilters);
export const useKPIs = () => useAnalyticsStore((state) => state.kpis);
export const useForecasts = () => useAnalyticsStore((state) => state.forecasts);
export const useGeographicData = () => useAnalyticsStore((state) => state.geographicData);

export const useDashboardConfig = () => useAnalyticsStore((state) => ({
  layouts: state.dashboardLayouts,
  activeDashboard: state.activeDashboard,
  widgets: state.widgets,
}));

export const useAnalyticsUI = () => useAnalyticsStore((state) => ({
  isLoading: state.isLoading,
  isRefreshing: state.isRefreshing,
  lastUpdated: state.lastUpdated,
  selectedTimeRange: state.selectedTimeRange,
  autoRefresh: state.autoRefresh,
  refreshInterval: state.refreshInterval,
  error: state.error,
  connectionStatus: state.connectionStatus,
}));

// ============================================================================
// HOOKS
// ============================================================================

export const useAnalyticsActions = () => {
  const store = useAnalyticsStore();
  
  return {
    // Data actions
    setAnalyticsData: store.setAnalyticsData,
    setTourismStats: store.setTourismStats,
    setSafetyMetrics: store.setSafetyMetrics,
    setAlertStatistics: store.setAlertStatistics,
    setRealTimeMetrics: store.setRealTimeMetrics,
    updateRealTimeMetrics: store.updateRealTimeMetrics,
    
    // Chart actions
    setChartData: store.setChartData,
    updateChartData: store.updateChartData,
    setTimeSeriesData: store.setTimeSeriesData,
    addTimeSeriesPoint: store.addTimeSeriesPoint,
    
    // Filter actions
    setActiveFilters: store.setActiveFilters,
    updateFilters: store.updateFilters,
    saveFilter: store.saveFilter,
    loadSavedFilter: store.loadSavedFilter,
    clearFilters: store.clearFilters,
    
    // UI actions
    setSelectedTimeRange: store.setSelectedTimeRange,
    setAutoRefresh: store.setAutoRefresh,
    refreshAllData: store.refreshAllData,
    exportData: store.exportData,
  };
};