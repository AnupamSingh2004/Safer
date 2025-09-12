/**
 * Smart Tourist Safety System - Dashboard Charts
 * Comprehensive chart components using Recharts for interactive data visualization
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon,
  Activity,
  Calendar,
  Users,
  AlertTriangle,
  Shield,
  MapPin,
  Clock,
  Zap
} from 'lucide-react';
import { useAnalyticsStore } from '@/stores/analytics-store';
import type { ChartSeries, TimeSeriesData } from '@/types/analytics';

// ============================================================================
// THEME AND COLORS
// ============================================================================

const chartTheme = {
  colors: {
    primary: '#3b82f6', // blue-500
    secondary: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    danger: '#ef4444', // red-500
    success: '#22c55e', // green-500
    info: '#06b6d4', // cyan-500
    purple: '#8b5cf6', // violet-500
    pink: '#ec4899', // pink-500
  },
  gradients: {
    primary: ['#3b82f6', '#1d4ed8'],
    secondary: ['#10b981', '#047857'],
    warning: ['#f59e0b', '#d97706'],
    danger: ['#ef4444', '#dc2626'],
  }
};

const pieColors = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'
];

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
    {children}
  </div>
);

const ChartHeader = ({ 
  title, 
  subtitle, 
  icon, 
  trend,
  value 
}: { 
  title: string; 
  subtitle?: string; 
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  value?: string;
}) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center space-x-3">
      {icon && (
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
    </div>
    <div className="text-right">
      {value && (
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      )}
      {trend && (
        <div className={`flex items-center text-sm ${
          trend.value > 0 ? 'text-green-600' : trend.value < 0 ? 'text-red-600' : 'text-gray-600'
        }`}>
          {trend.value > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : 
           trend.value < 0 ? <TrendingDown className="h-4 w-4 mr-1" /> : null}
          {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
        </div>
      )}
    </div>
  </div>
);

// ============================================================================
// CUSTOM TOOLTIP COMPONENTS
// ============================================================================

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900">{data.name}</p>
        <p style={{ color: data.color }} className="text-sm">
          Value: {data.value.toLocaleString()}
        </p>
        <p className="text-xs text-gray-600">
          {((data.value / data.payload.total) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

// ============================================================================
// CHART COMPONENTS
// ============================================================================

interface TouristFlowChartProps {
  data?: TimeSeriesData[];
  height?: number;
}

const TouristFlowChart: React.FC<TouristFlowChartProps> = ({ 
  data = [], 
  height = 300 
}) => {
  const mockData = data.length > 0 ? data : [
    { timestamp: '00:00', value: 120, tourists: 120, checkins: 25, checkouts: 15 },
    { timestamp: '04:00', value: 85, tourists: 85, checkins: 12, checkouts: 47 },
    { timestamp: '08:00', value: 200, tourists: 200, checkins: 78, checkouts: 23 },
    { timestamp: '12:00', value: 350, tourists: 350, checkins: 120, checkouts: 45 },
    { timestamp: '16:00', value: 280, tourists: 280, checkins: 65, checkouts: 85 },
    { timestamp: '20:00', value: 420, tourists: 420, checkins: 180, checkouts: 40 },
    { timestamp: '23:00', value: 180, tourists: 180, checkins: 45, checkouts: 105 },
  ];

  return (
    <Card>
      <ChartHeader
        title="Tourist Flow"
        subtitle="Real-time visitor distribution"
        icon={<Users className="h-5 w-5" />}
        value="2,847"
        trend={{ value: 12.5, label: 'vs yesterday' }}
      />
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="timestamp" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="tourists"
            fill="url(#touristGradient)"
            stroke={chartTheme.colors.primary}
            strokeWidth={2}
            name="Active Tourists"
          />
          <Bar dataKey="checkins" fill={chartTheme.colors.success} name="Check-ins" />
          <Bar dataKey="checkouts" fill={chartTheme.colors.warning} name="Check-outs" />
          <defs>
            <linearGradient id="touristGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartTheme.colors.primary} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={chartTheme.colors.primary} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
};

interface SafetyScoreChartProps {
  data?: any[];
  height?: number;
}

const SafetyScoreChart: React.FC<SafetyScoreChartProps> = ({ 
  data = [], 
  height = 300 
}) => {
  const mockData = data.length > 0 ? data : [
    { date: 'Mon', safety_score: 85, incidents: 3, resolved: 3 },
    { date: 'Tue', safety_score: 92, incidents: 1, resolved: 1 },
    { date: 'Wed', safety_score: 88, incidents: 2, resolved: 2 },
    { date: 'Thu', safety_score: 95, incidents: 1, resolved: 1 },
    { date: 'Fri', safety_score: 78, incidents: 5, resolved: 4 },
    { date: 'Sat', safety_score: 82, incidents: 4, resolved: 4 },
    { date: 'Sun', safety_score: 90, incidents: 2, resolved: 2 },
  ];

  return (
    <Card>
      <ChartHeader
        title="Safety Score Trends"
        subtitle="Weekly safety performance"
        icon={<Shield className="h-5 w-5" />}
        value="87%"
        trend={{ value: 3.2, label: 'this week' }}
      />
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
          <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
          <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="safety_score"
            stroke={chartTheme.colors.success}
            strokeWidth={3}
            dot={{ fill: chartTheme.colors.success, strokeWidth: 2, r: 4 }}
            name="Safety Score (%)"
          />
          <Bar yAxisId="right" dataKey="incidents" fill={chartTheme.colors.danger} name="Incidents" />
          <Bar yAxisId="right" dataKey="resolved" fill={chartTheme.colors.secondary} name="Resolved" />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
};

interface AlertDistributionChartProps {
  data?: any[];
}

const AlertDistributionChart: React.FC<AlertDistributionChartProps> = ({ 
  data = [] 
}) => {
  const mockData = data.length > 0 ? data : [
    { name: 'Emergency', value: 8, color: chartTheme.colors.danger },
    { name: 'Warning', value: 24, color: chartTheme.colors.warning },
    { name: 'Info', value: 45, color: chartTheme.colors.info },
    { name: 'Resolved', value: 156, color: chartTheme.colors.success },
  ];

  const total = mockData.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = mockData.map(item => ({ ...item, total }));

  return (
    <Card>
      <ChartHeader
        title="Alert Distribution"
        subtitle="Current alert status breakdown"
        icon={<AlertTriangle className="h-5 w-5" />}
        value={total.toString()}
      />
      <div className="flex items-center justify-between">
        <ResponsiveContainer width="60%" height={250}>
          <PieChart>
            <Pie
              data={dataWithTotal}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {dataWithTotal.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="w-40 space-y-3">
          {mockData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <span className="font-semibold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

interface GeographicHeatmapProps {
  data?: any[];
  height?: number;
}

const GeographicHeatmap: React.FC<GeographicHeatmapProps> = ({ 
  data = [], 
  height = 300 
}) => {
  const mockData = data.length > 0 ? data : [
    { zone: 'Downtown', tourists: 450, incidents: 2, risk_level: 'Low' },
    { zone: 'Beach Area', tourists: 680, incidents: 1, risk_level: 'Low' },
    { zone: 'Mountains', tourists: 120, incidents: 4, risk_level: 'High' },
    { zone: 'Historic District', tourists: 340, incidents: 0, risk_level: 'Low' },
    { zone: 'Shopping Center', tourists: 290, incidents: 1, risk_level: 'Medium' },
    { zone: 'Nature Reserve', tourists: 85, incidents: 3, risk_level: 'High' },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return chartTheme.colors.danger;
      case 'Medium': return chartTheme.colors.warning;
      case 'Low': return chartTheme.colors.success;
      default: return chartTheme.colors.info;
    }
  };

  return (
    <Card>
      <ChartHeader
        title="Zone Risk Analysis"
        subtitle="Tourist distribution and risk levels"
        icon={<MapPin className="h-5 w-5" />}
      />
      <ResponsiveContainer width="100%" height={height}>
        <ScatterChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            type="number" 
            dataKey="tourists" 
            name="Tourists"
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            type="number" 
            dataKey="incidents" 
            name="Incidents"
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip
            content={({ active, payload }: { active?: boolean; payload?: any[] }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-900">{data.zone}</p>
                    <p className="text-sm">Tourists: {data.tourists}</p>
                    <p className="text-sm">Incidents: {data.incidents}</p>
                    <p className={`text-sm font-semibold ${
                      data.risk_level === 'High' ? 'text-red-600' :
                      data.risk_level === 'Medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      Risk: {data.risk_level}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter 
            name="Zones" 
            data={mockData} 
          >
            {mockData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={getRiskColor(entry.risk_level)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  );
};

interface ResponseTimeChartProps {
  data?: any[];
  height?: number;
}

const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ 
  data = [], 
  height = 300 
}) => {
  const mockData = data.length > 0 ? data : [
    { hour: '00:00', avg_response: 8.5, target: 10, alerts: 5 },
    { hour: '03:00', avg_response: 7.2, target: 10, alerts: 3 },
    { hour: '06:00', avg_response: 6.8, target: 10, alerts: 8 },
    { hour: '09:00', avg_response: 9.1, target: 10, alerts: 12 },
    { hour: '12:00', avg_response: 11.3, target: 10, alerts: 18 },
    { hour: '15:00', avg_response: 12.8, target: 10, alerts: 22 },
    { hour: '18:00', avg_response: 10.5, target: 10, alerts: 15 },
    { hour: '21:00', avg_response: 8.9, target: 10, alerts: 9 },
  ];

  return (
    <Card>
      <ChartHeader
        title="Response Time Analysis"
        subtitle="Average emergency response times"
        icon={<Clock className="h-5 w-5" />}
        value="9.4m"
        trend={{ value: -15.2, label: 'improvement' }}
      />
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
          <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
          <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="avg_response"
            fill="url(#responseGradient)"
            stroke={chartTheme.colors.primary}
            strokeWidth={2}
            name="Avg Response Time (min)"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="target"
            stroke={chartTheme.colors.warning}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Target (10 min)"
          />
          <Bar yAxisId="right" dataKey="alerts" fill={chartTheme.colors.secondary} name="Alert Count" />
          <defs>
            <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartTheme.colors.primary} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={chartTheme.colors.primary} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
};

interface ThreatLevelRadarProps {
  data?: any[];
}

const ThreatLevelRadar: React.FC<ThreatLevelRadarProps> = ({ 
  data = [] 
}) => {
  const mockData = data.length > 0 ? data : [
    { category: 'Physical Safety', current: 85, target: 90 },
    { category: 'Health Risks', current: 92, target: 95 },
    { category: 'Natural Hazards', current: 78, target: 85 },
    { category: 'Crime Rate', current: 88, target: 90 },
    { category: 'Infrastructure', current: 94, target: 95 },
    { category: 'Emergency Response', current: 87, target: 90 },
  ];

  return (
    <Card>
      <ChartHeader
        title="Safety Assessment"
        subtitle="Multi-dimensional threat analysis"
        icon={<Zap className="h-5 w-5" />}
      />
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fill: '#6b7280' }} />
          <PolarRadiusAxis 
            domain={[0, 100]} 
            tick={{ fontSize: 10, fill: '#6b7280' }}
            tickCount={5}
          />
          <Radar
            name="Current"
            dataKey="current"
            stroke={chartTheme.colors.primary}
            fill={chartTheme.colors.primary}
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Target"
            dataKey="target"
            stroke={chartTheme.colors.success}
            fill="transparent"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </Card>
  );
};

// ============================================================================
// DASHBOARD GRID COMPONENT
// ============================================================================

interface DashboardChartsProps {
  layout?: 'grid' | 'stacked';
  showControls?: boolean;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ 
  layout = 'grid',
  showControls = true 
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [chartHeight, setChartHeight] = useState(300);

  const chartConfigs = [
    { id: 'tourist-flow', component: TouristFlowChart, title: 'Tourist Flow' },
    { id: 'safety-score', component: SafetyScoreChart, title: 'Safety Score' },
    { id: 'alert-distribution', component: AlertDistributionChart, title: 'Alert Distribution' },
    { id: 'geographic-heatmap', component: GeographicHeatmap, title: 'Geographic Analysis' },
    { id: 'response-time', component: ResponseTimeChart, title: 'Response Time' },
    { id: 'threat-radar', component: ThreatLevelRadar, title: 'Threat Assessment' },
  ];

  const gridClass = layout === 'grid' 
    ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' 
    : 'space-y-6';

  return (
    <div className="space-y-6">
      {showControls && (
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Analytics Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Time Range:</label>
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Layout:</label>
              <select 
                value={layout}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="grid">Grid</option>
                <option value="stacked">Stacked</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className={gridClass}>
        <TouristFlowChart height={chartHeight} />
        <SafetyScoreChart height={chartHeight} />
        <AlertDistributionChart />
        <GeographicHeatmap height={chartHeight} />
        <ResponseTimeChart height={chartHeight} />
        <ThreatLevelRadar />
      </div>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default DashboardCharts;

export {
  TouristFlowChart,
  SafetyScoreChart,
  AlertDistributionChart,
  GeographicHeatmap,
  ResponseTimeChart,
  ThreatLevelRadar,
};