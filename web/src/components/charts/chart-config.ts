/**
 * Smart Tourist Safety System - Chart Configuration
 * Recharts configuration and utilities for analytics charts
 */

import type {
  ChartSeries,
  ChartDataPoint,
  TimeSeriesData,
  ChartType,
  AnalyticsTimeGranularity,
} from '@/types/analytics';

// ============================================================================
// COLOR PALETTES
// ============================================================================

export const CHART_COLORS = {
  primary: [
    '#3b82f6', // blue-500
    '#ef4444', // red-500
    '#10b981', // green-500
    '#f59e0b', // amber-500
    '#8b5cf6', // violet-500
    '#06b6d4', // cyan-500
    '#ec4899', // pink-500
    '#84cc16', // lime-500
  ],
  safety: [
    '#10b981', // green (safe)
    '#f59e0b', // amber (warning)
    '#ef4444', // red (danger)
    '#6b7280', // gray (unknown)
  ],
  severity: [
    '#22c55e', // green (low)
    '#eab308', // yellow (medium)
    '#f97316', // orange (high)
    '#dc2626', // red (critical)
  ],
  gradient: {
    blue: ['#3b82f6', '#1d4ed8'],
    green: ['#10b981', '#047857'],
    red: ['#ef4444', '#dc2626'],
    purple: ['#8b5cf6', '#7c3aed'],
    amber: ['#f59e0b', '#d97706'],
  },
};

export const EMERGENCY_COLORS = {
  safe: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  critical: '#dc2626',
  unknown: '#6b7280',
};

// ============================================================================
// CHART THEMES
// ============================================================================

export const CHART_THEMES = {
  light: {
    background: '#ffffff',
    text: '#1f2937',
    grid: '#e5e7eb',
    axis: '#6b7280',
    tooltip: {
      background: '#ffffff',
      border: '#e5e7eb',
      text: '#1f2937',
    },
  },
  dark: {
    background: '#1f2937',
    text: '#f9fafb',
    grid: '#374151',
    axis: '#9ca3af',
    tooltip: {
      background: '#374151',
      border: '#4b5563',
      text: '#f9fafb',
    },
  },
};

// ============================================================================
// RESPONSIVE BREAKPOINTS
// ============================================================================

export const CHART_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

export const DEFAULT_CHART_CONFIG = {
  margin: { top: 20, right: 30, left: 20, bottom: 5 },
  responsiveContainer: {
    width: '100%',
    height: 300,
  },
  animation: {
    animationBegin: 0,
    animationDuration: 800,
    animationEasing: 'ease-out',
  },
  grid: {
    strokeDasharray: '3 3',
    opacity: 0.3,
  },
  axis: {
    fontSize: 12,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  tooltip: {
    contentStyle: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      fontSize: '14px',
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    cursor: {
      stroke: '#3b82f6',
      strokeWidth: 1,
      strokeDasharray: '5 5',
    },
  },
  legend: {
    fontSize: 12,
    fontFamily: 'Inter, system-ui, sans-serif',
    iconType: 'rect' as const,
  },
};

// ============================================================================
// CHART TYPE CONFIGURATIONS
// ============================================================================

export const CHART_TYPE_CONFIGS = {
  line: {
    strokeWidth: 2,
    dot: {
      r: 4,
      strokeWidth: 2,
    },
    activeDot: {
      r: 6,
      strokeWidth: 0,
    },
  },
  area: {
    strokeWidth: 2,
    fillOpacity: 0.3,
    dot: false,
    activeDot: {
      r: 4,
      strokeWidth: 2,
    },
  },
  bar: {
    radius: [4, 4, 0, 0] as [number, number, number, number],
    maxBarSize: 60,
  },
  pie: {
    cx: '50%',
    cy: '50%',
    innerRadius: 0,
    outerRadius: 80,
    paddingAngle: 2,
    dataKey: 'value',
  },
  doughnut: {
    cx: '50%',
    cy: '50%',
    innerRadius: 40,
    outerRadius: 80,
    paddingAngle: 2,
    dataKey: 'value',
  },
  scatter: {
    fill: '#3b82f6',
    fillOpacity: 0.6,
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const formatChartData = (
  data: TimeSeriesData[] | ChartDataPoint[],
  granularity: AnalyticsTimeGranularity = 'hour'
): any[] => {
  return data.map((point) => {
    if ('timestamp' in point) {
      // TimeSeriesData
      const date = new Date(point.timestamp);
      let formattedTime: string;

      switch (granularity) {
        case 'hour':
          formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          });
          break;
        case 'day':
          formattedTime = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          break;
        case 'week':
          formattedTime = `Week ${Math.ceil(date.getDate() / 7)}`;
          break;
        case 'month':
          formattedTime = date.toLocaleDateString('en-US', {
            month: 'short',
            year: '2-digit',
          });
          break;
        case 'year':
          formattedTime = date.getFullYear().toString();
          break;
        default:
          formattedTime = date.toLocaleDateString();
      }

      return {
        time: formattedTime,
        timestamp: point.timestamp,
        value: point.value,
        label: point.label,
        category: point.category,
      };
    } else {
      // ChartDataPoint
      return {
        x: point.x,
        y: point.y,
        label: point.label,
        ...point.metadata,
      };
    }
  });
};

export const formatTickValue = (value: any, type: 'number' | 'percentage' | 'currency' | 'time' = 'number'): string => {
  if (typeof value !== 'number') return value?.toString() || '';

  switch (type) {
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case 'number':
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toString();
    case 'time':
      const date = new Date(value);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    default:
      return value.toString();
  }
};

export const getColorByIndex = (index: number, palette: string[] = CHART_COLORS.primary): string => {
  return palette[index % palette.length];
};

export const getColorByValue = (
  value: number,
  thresholds: { low: number; medium: number; high: number },
  colors: string[] = CHART_COLORS.safety
): string => {
  if (value <= thresholds.low) return colors[0]; // green
  if (value <= thresholds.medium) return colors[1]; // amber
  if (value <= thresholds.high) return colors[2]; // red
  return colors[3] || colors[2]; // critical or red
};

export const getSeverityColor = (severity: 'low' | 'medium' | 'high' | 'critical'): string => {
  const colorMap = {
    low: CHART_COLORS.severity[0],
    medium: CHART_COLORS.severity[1],
    high: CHART_COLORS.severity[2],
    critical: CHART_COLORS.severity[3],
  };
  return colorMap[severity];
};

// ============================================================================
// CHART CONFIGURATION INTERFACES
// ============================================================================

export interface LineChartConfig {
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showBrush?: boolean;
  smooth?: boolean;
  formatter?: (value: any) => string;
}

export interface BarChartConfig {
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  horizontal?: boolean;
  formatter?: (value: any) => string;
}

export interface AreaChartConfig {
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  stacked?: boolean;
  gradient?: boolean;
  formatter?: (value: any) => string;
}

export interface PieChartConfig {
  height?: number;
  innerRadius?: number;
  showLegend?: boolean;
  showLabels?: boolean;
  formatter?: (value: any) => string;
}

// ============================================================================
// CHART CONFIGURATION GENERATORS
// ============================================================================

export const createLineChartConfig = (
  series: ChartSeries[],
  options: LineChartConfig = {}
) => ({
  ...DEFAULT_CHART_CONFIG,
  responsiveContainer: {
    ...DEFAULT_CHART_CONFIG.responsiveContainer,
    height: options.height || 300,
  },
  series: series.map((s, index) => ({
    ...s,
    color: s.color || getColorByIndex(index),
    strokeWidth: CHART_TYPE_CONFIGS.line.strokeWidth,
    dot: CHART_TYPE_CONFIGS.line.dot,
    activeDot: CHART_TYPE_CONFIGS.line.activeDot,
    smooth: options.smooth || false,
  })),
  showGrid: options.showGrid !== false,
  showLegend: options.showLegend !== false,
  showBrush: options.showBrush || false,
  formatter: options.formatter,
});

export const createBarChartConfig = (
  series: ChartSeries[],
  options: BarChartConfig = {}
) => ({
  ...DEFAULT_CHART_CONFIG,
  responsiveContainer: {
    ...DEFAULT_CHART_CONFIG.responsiveContainer,
    height: options.height || 300,
  },
  series: series.map((s, index) => ({
    ...s,
    color: s.color || getColorByIndex(index),
    radius: CHART_TYPE_CONFIGS.bar.radius,
    maxBarSize: CHART_TYPE_CONFIGS.bar.maxBarSize,
  })),
  showGrid: options.showGrid !== false,
  showLegend: options.showLegend !== false,
  stacked: options.stacked || false,
  horizontal: options.horizontal || false,
  formatter: options.formatter,
});

export const createAreaChartConfig = (
  series: ChartSeries[],
  options: AreaChartConfig = {}
) => ({
  ...DEFAULT_CHART_CONFIG,
  responsiveContainer: {
    ...DEFAULT_CHART_CONFIG.responsiveContainer,
    height: options.height || 300,
  },
  series: series.map((s, index) => ({
    ...s,
    color: s.color || getColorByIndex(index),
    strokeWidth: CHART_TYPE_CONFIGS.area.strokeWidth,
    fillOpacity: CHART_TYPE_CONFIGS.area.fillOpacity,
    activeDot: CHART_TYPE_CONFIGS.area.activeDot,
  })),
  showGrid: options.showGrid !== false,
  showLegend: options.showLegend !== false,
  stacked: options.stacked || false,
  gradient: options.gradient || false,
  formatter: options.formatter,
});

export const createPieChartConfig = (
  data: Array<{ name: string; value: number; color?: string }>,
  options: PieChartConfig = {}
) => ({
  ...DEFAULT_CHART_CONFIG,
  responsiveContainer: {
    ...DEFAULT_CHART_CONFIG.responsiveContainer,
    height: options.height || 300,
  },
  data: data.map((item, index) => ({
    ...item,
    color: item.color || getColorByIndex(index),
  })),
  innerRadius: options.innerRadius || 0,
  outerRadius: 80,
  showLegend: options.showLegend !== false,
  showLabels: options.showLabels !== false,
  formatter: options.formatter,
});

// ============================================================================
// TOOLTIP CONFIGURATION
// ============================================================================

export const TOOLTIP_STYLES = {
  default: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    fontSize: '14px',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  dark: {
    backgroundColor: '#374151',
    border: '1px solid #4b5563',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    fontSize: '14px',
    fontFamily: 'Inter, system-ui, sans-serif',
    color: '#f9fafb',
  },
  emergency: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    fontSize: '14px',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
};

export const createTooltipConfig = (
  type: 'default' | 'dark' | 'emergency' = 'default',
  formatter?: (value: any, name: string, props: any) => string
) => ({
  contentStyle: TOOLTIP_STYLES[type] || TOOLTIP_STYLES.default,
  cursor: {
    stroke: '#3b82f6',
    strokeWidth: 1,
    strokeDasharray: '5 5',
  },
  formatter,
  labelFormatter: (label: string) => label,
  separator: ': ',
});

// ============================================================================
// ANIMATION PRESETS
// ============================================================================

export const ANIMATION_PRESETS = {
  fast: {
    animationBegin: 0,
    animationDuration: 400,
    animationEasing: 'ease-out',
  },
  normal: {
    animationBegin: 0,
    animationDuration: 800,
    animationEasing: 'ease-out',
  },
  slow: {
    animationBegin: 0,
    animationDuration: 1200,
    animationEasing: 'ease-out',
  },
  none: {
    animationBegin: 0,
    animationDuration: 0,
  },
};

// ============================================================================
// GRADIENT DEFINITIONS (for use in SVG)
// ============================================================================

export const GRADIENT_DEFINITIONS = {
  blue: {
    id: 'blueGradient',
    stops: [
      { offset: '5%', stopColor: '#3b82f6', stopOpacity: 0.8 },
      { offset: '95%', stopColor: '#3b82f6', stopOpacity: 0.1 },
    ],
  },
  green: {
    id: 'greenGradient',
    stops: [
      { offset: '5%', stopColor: '#10b981', stopOpacity: 0.8 },
      { offset: '95%', stopColor: '#10b981', stopOpacity: 0.1 },
    ],
  },
  red: {
    id: 'redGradient',
    stops: [
      { offset: '5%', stopColor: '#ef4444', stopOpacity: 0.8 },
      { offset: '95%', stopColor: '#ef4444', stopOpacity: 0.1 },
    ],
  },
  amber: {
    id: 'amberGradient',
    stops: [
      { offset: '5%', stopColor: '#f59e0b', stopOpacity: 0.8 },
      { offset: '95%', stopColor: '#f59e0b', stopOpacity: 0.1 },
    ],
  },
};

// ============================================================================
// CHART DATA PROCESSING UTILITIES
// ============================================================================

export const processChartData = (
  data: any[],
  options: {
    aggregation?: 'sum' | 'average' | 'max' | 'min';
    groupBy?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
  } = {}
): any[] => {
  let processed = [...data];

  // Group by field if specified
  if (options.groupBy) {
    const grouped = new Map();
    processed.forEach(item => {
      const key = item[options.groupBy!];
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key).push(item);
    });

    processed = Array.from(grouped.entries()).map(([key, values]) => {
      const aggregated = values.reduce((acc: any, curr: any) => {
        Object.keys(curr).forEach(field => {
          if (typeof curr[field] === 'number') {
            if (!acc[field]) acc[field] = 0;
            switch (options.aggregation) {
              case 'sum':
                acc[field] += curr[field];
                break;
              case 'average':
                acc[field] = (acc[field] + curr[field]) / 2;
                break;
              case 'max':
                acc[field] = Math.max(acc[field], curr[field]);
                break;
              case 'min':
                acc[field] = Math.min(acc[field] || Infinity, curr[field]);
                break;
              default:
                acc[field] += curr[field];
            }
          } else {
            acc[field] = curr[field];
          }
        });
        return acc;
      }, {});

      return {
        ...aggregated,
        [options.groupBy!]: key,
      };
    });
  }

  // Sort if specified
  if (options.sortBy) {
    processed.sort((a, b) => {
      const aVal = a[options.sortBy!];
      const bVal = b[options.sortBy!];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return options.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (options.sortOrder === 'desc') {
        return bStr.localeCompare(aStr);
      }
      return aStr.localeCompare(bStr);
    });
  }

  // Limit results if specified
  if (options.limit && options.limit > 0) {
    processed = processed.slice(0, options.limit);
  }

  return processed;
};

// ============================================================================
// RESPONSIVE UTILITIES
// ============================================================================

export const getResponsiveChartHeight = (screenWidth: number): number => {
  if (screenWidth < CHART_BREAKPOINTS.sm) return 200;
  if (screenWidth < CHART_BREAKPOINTS.md) return 250;
  if (screenWidth < CHART_BREAKPOINTS.lg) return 300;
  return 350;
};

export const getResponsiveMargin = (screenWidth: number) => {
  if (screenWidth < CHART_BREAKPOINTS.sm) {
    return { top: 10, right: 15, left: 10, bottom: 5 };
  }
  if (screenWidth < CHART_BREAKPOINTS.md) {
    return { top: 15, right: 20, left: 15, bottom: 5 };
  }
  return DEFAULT_CHART_CONFIG.margin;
};

// ============================================================================
// ACCESSIBILITY UTILITIES
// ============================================================================

export const createAccessibleChartProps = (title: string, description?: string) => ({
  role: 'img',
  'aria-label': title,
  'aria-describedby': description ? `chart-desc-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined,
});

export const ACCESSIBILITY_COLORS = {
  // Color-blind friendly palette
  colorBlindSafe: [
    '#1f77b4', // blue
    '#ff7f0e', // orange
    '#2ca02c', // green
    '#d62728', // red
    '#9467bd', // purple
    '#8c564b', // brown
    '#e377c2', // pink
    '#7f7f7f', // gray
  ],
  // High contrast palette
  highContrast: [
    '#000000', // black
    '#ffffff', // white
    '#ff0000', // red
    '#00ff00', // green
    '#0000ff', // blue
    '#ffff00', // yellow
    '#ff00ff', // magenta
    '#00ffff', // cyan
  ],
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  CHART_COLORS,
  EMERGENCY_COLORS,
  CHART_THEMES,
  DEFAULT_CHART_CONFIG,
  CHART_TYPE_CONFIGS,
  formatChartData,
  formatTickValue,
  getColorByIndex,
  getColorByValue,
  getSeverityColor,
  createLineChartConfig,
  createBarChartConfig,
  createAreaChartConfig,
  createPieChartConfig,
  createTooltipConfig,
  ANIMATION_PRESETS,
  GRADIENT_DEFINITIONS,
  processChartData,
  getResponsiveChartHeight,
  getResponsiveMargin,
  createAccessibleChartProps,
  ACCESSIBILITY_COLORS,
};