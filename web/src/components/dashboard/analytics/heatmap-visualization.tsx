/**
 * Smart Tourist Safety System - Heatmap Visualization
 * Advanced geographical data visualization with tourist density and incident mapping
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, 
  Users, 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  TrendingDown,
  Filter,
  Layers,
  Settings,
  RefreshCw,
  Download,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Move,
  Activity,
  Clock,
  Target
} from 'lucide-react';
import { useAnalyticsStore } from '@/stores/analytics-store';

// ============================================================================
// UI COMPONENTS
// ============================================================================

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({ 
  children, 
  onClick, 
  variant = 'default',
  size = 'default',
  disabled = false,
  className = '',
  icon
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700',
    ghost: 'hover:bg-gray-100 text-gray-700'
  };
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    default: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'default' 
}: { 
  children: React.ReactNode; 
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'default';
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-0.5 text-sm'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface HeatmapData {
  id: string;
  name: string;
  coordinates: [number, number];
  touristCount: number;
  incidentCount: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  safetyScore: number;
  popularityScore: number;
  responseTime: number;
  lastUpdated: string;
  trends: {
    touristChange: number;
    incidentChange: number;
    riskChange: number;
  };
}

interface HeatmapLayer {
  id: string;
  name: string;
  type: 'tourist-density' | 'incident-frequency' | 'risk-assessment' | 'response-coverage';
  visible: boolean;
  opacity: number;
  color: string;
}

interface HeatmapFilters {
  timeRange: '1h' | '6h' | '24h' | '7d' | '30d';
  layers: string[];
  riskLevels: string[];
  minTouristCount: number;
  showTrends: boolean;
  showLabels: boolean;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockHeatmapData: HeatmapData[] = [
  {
    id: 'zone-1',
    name: 'Downtown District',
    coordinates: [77.2090, 28.6139], // Delhi coordinates
    touristCount: 450,
    incidentCount: 2,
    riskLevel: 'low',
    safetyScore: 92,
    popularityScore: 85,
    responseTime: 6.5,
    lastUpdated: new Date().toISOString(),
    trends: { touristChange: 12, incidentChange: -25, riskChange: -5 }
  },
  {
    id: 'zone-2',
    name: 'Beach Area',
    coordinates: [77.2500, 28.6200],
    touristCount: 680,
    incidentCount: 1,
    riskLevel: 'low',
    safetyScore: 95,
    popularityScore: 95,
    responseTime: 8.2,
    lastUpdated: new Date().toISOString(),
    trends: { touristChange: 25, incidentChange: -50, riskChange: 0 }
  },
  {
    id: 'zone-3',
    name: 'Mountain Trail',
    coordinates: [77.1800, 28.5800],
    touristCount: 120,
    incidentCount: 4,
    riskLevel: 'high',
    safetyScore: 68,
    popularityScore: 60,
    responseTime: 15.3,
    lastUpdated: new Date().toISOString(),
    trends: { touristChange: -8, incidentChange: 33, riskChange: 15 }
  },
  {
    id: 'zone-4',
    name: 'Historic Quarter',
    coordinates: [77.2300, 28.6300],
    touristCount: 340,
    incidentCount: 0,
    riskLevel: 'low',
    safetyScore: 98,
    popularityScore: 78,
    responseTime: 5.1,
    lastUpdated: new Date().toISOString(),
    trends: { touristChange: 8, incidentChange: -100, riskChange: -10 }
  },
  {
    id: 'zone-5',
    name: 'Shopping Center',
    coordinates: [77.2700, 28.6100],
    touristCount: 290,
    incidentCount: 1,
    riskLevel: 'medium',
    safetyScore: 82,
    popularityScore: 70,
    responseTime: 7.8,
    lastUpdated: new Date().toISOString(),
    trends: { touristChange: 15, incidentChange: 0, riskChange: 5 }
  },
  {
    id: 'zone-6',
    name: 'Nature Reserve',
    coordinates: [77.1500, 28.5500],
    touristCount: 85,
    incidentCount: 3,
    riskLevel: 'critical',
    safetyScore: 45,
    popularityScore: 40,
    responseTime: 22.5,
    lastUpdated: new Date().toISOString(),
    trends: { touristChange: -15, incidentChange: 50, riskChange: 25 }
  }
];

const heatmapLayers: HeatmapLayer[] = [
  {
    id: 'tourist-density',
    name: 'Tourist Density',
    type: 'tourist-density',
    visible: true,
    opacity: 0.7,
    color: '#3b82f6'
  },
  {
    id: 'incident-frequency',
    name: 'Incident Frequency',
    type: 'incident-frequency',
    visible: true,
    opacity: 0.6,
    color: '#ef4444'
  },
  {
    id: 'risk-assessment',
    name: 'Risk Assessment',
    type: 'risk-assessment',
    visible: false,
    opacity: 0.5,
    color: '#f59e0b'
  },
  {
    id: 'response-coverage',
    name: 'Response Coverage',
    type: 'response-coverage',
    visible: false,
    opacity: 0.4,
    color: '#10b981'
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getRiskColor = (riskLevel: string, opacity: number = 1) => {
  const colors = {
    low: `rgba(34, 197, 94, ${opacity})`,      // green
    medium: `rgba(245, 158, 11, ${opacity})`,  // amber
    high: `rgba(239, 68, 68, ${opacity})`,     // red
    critical: `rgba(147, 51, 234, ${opacity})` // purple
  };
  return colors[riskLevel as keyof typeof colors] || colors.low;
};

const getIntensityForTourists = (count: number, max: number) => {
  return Math.min(count / max, 1);
};

const formatTrend = (value: number) => {
  if (value > 0) return `+${value}%`;
  if (value < 0) return `${value}%`;
  return '0%';
};

// ============================================================================
// HEATMAP VISUALIZATION COMPONENT
// ============================================================================

interface HeatmapCellProps {
  data: HeatmapData;
  maxTourists: number;
  isSelected: boolean;
  onSelect: (data: HeatmapData) => void;
  filters: HeatmapFilters;
}

const HeatmapCell: React.FC<HeatmapCellProps> = ({ 
  data, 
  maxTourists, 
  isSelected, 
  onSelect, 
  filters 
}) => {
  const intensity = getIntensityForTourists(data.touristCount, maxTourists);
  const riskColor = getRiskColor(data.riskLevel, 0.8);
  
  const cellStyle = {
    background: filters.layers.includes('tourist-density') 
      ? `linear-gradient(45deg, rgba(59, 130, 246, ${intensity * 0.7}), ${riskColor})`
      : riskColor,
    borderWidth: isSelected ? '3px' : '1px',
    borderColor: isSelected ? '#1d4ed8' : '#e5e7eb'
  };

  return (
    <div
      className="relative cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg rounded-lg p-3 border"
      style={cellStyle}
      onClick={() => onSelect(data)}
    >
      {/* Zone Label */}
      {filters.showLabels && (
        <div className="absolute top-1 left-1 text-xs font-medium text-white bg-black bg-opacity-50 px-1 rounded">
          {data.name}
        </div>
      )}
      
      {/* Main Stats */}
      <div className="text-center text-white">
        <div className="text-lg font-bold">{data.touristCount}</div>
        <div className="text-xs opacity-90">tourists</div>
      </div>
      
      {/* Incident Count */}
      {data.incidentCount > 0 && (
        <div className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {data.incidentCount}
        </div>
      )}
      
      {/* Trend Indicator */}
      {filters.showTrends && (
        <div className="absolute bottom-1 right-1 text-white">
          {data.trends.touristChange > 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : data.trends.touristChange < 0 ? (
            <TrendingDown className="h-3 w-3" />
          ) : null}
        </div>
      )}
      
      {/* Risk Level Indicator */}
      <div className="absolute bottom-1 left-1">
        <div className={`w-2 h-2 rounded-full ${
          data.riskLevel === 'critical' ? 'bg-purple-400' :
          data.riskLevel === 'high' ? 'bg-red-400' :
          data.riskLevel === 'medium' ? 'bg-yellow-400' :
          'bg-green-400'
        }`} />
      </div>
    </div>
  );
};

// ============================================================================
// MAIN HEATMAP COMPONENT
// ============================================================================

export const HeatmapVisualization: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<HeatmapData | null>(null);
  const [layers, setLayers] = useState<HeatmapLayer[]>(heatmapLayers);
  const [filters, setFilters] = useState<HeatmapFilters>({
    timeRange: '24h',
    layers: ['tourist-density', 'incident-frequency'],
    riskLevels: ['low', 'medium', 'high', 'critical'],
    minTouristCount: 0,
    showTrends: true,
    showLabels: true
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { geographicData, isRefreshing } = useAnalyticsStore();

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const filteredData = useMemo(() => {
    return mockHeatmapData.filter(zone => 
      zone.touristCount >= filters.minTouristCount &&
      filters.riskLevels.includes(zone.riskLevel)
    );
  }, [filters]);

  const maxTourists = useMemo(() => 
    Math.max(...filteredData.map(d => d.touristCount))
  , [filteredData]);

  const aggregateStats = useMemo(() => ({
    totalTourists: filteredData.reduce((sum, zone) => sum + zone.touristCount, 0),
    totalIncidents: filteredData.reduce((sum, zone) => sum + zone.incidentCount, 0),
    averageSafety: Math.round(filteredData.reduce((sum, zone) => sum + zone.safetyScore, 0) / filteredData.length),
    criticalZones: filteredData.filter(zone => zone.riskLevel === 'critical').length
  }), [filteredData]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleLayerToggle = (layerId: string) => {
    setLayers(prev => 
      prev.map(layer => 
        layer.id === layerId 
          ? { ...layer, visible: !layer.visible }
          : layer
      )
    );
    
    setFilters(prev => ({
      ...prev,
      layers: prev.layers.includes(layerId)
        ? prev.layers.filter(id => id !== layerId)
        : [...prev.layers, layerId]
    }));
  };

  const handleZoneSelect = (zone: HeatmapData) => {
    setSelectedZone(selectedZone?.id === zone.id ? null : zone);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      filters,
      data: filteredData,
      stats: aggregateStats
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heatmap-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <MapPin className="h-6 w-6 mr-3 text-blue-600" />
            Geographic Heatmap
          </h2>
          <p className="text-gray-600 mt-1">Real-time visualization of tourist density and incident patterns</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isLoading}
            icon={isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          >
            Refresh
          </Button>
          <Button 
            variant="outline" 
            onClick={handleExport}
            icon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsFullscreen(!isFullscreen)}
            icon={<Maximize2 className="h-4 w-4" />}
          >
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tourists</p>
              <p className="text-2xl font-bold text-gray-900">{aggregateStats.totalTourists.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Incidents</p>
              <p className="text-2xl font-bold text-red-600">{aggregateStats.totalIncidents}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Safety Score</p>
              <p className="text-2xl font-bold text-green-600">{aggregateStats.averageSafety}%</p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Zones</p>
              <p className="text-2xl font-bold text-purple-600">{aggregateStats.criticalZones}</p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </h3>
            
            <div className="space-y-4">
              {/* Time Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
                <select 
                  value={filters.timeRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="1h">Last Hour</option>
                  <option value="6h">Last 6 Hours</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
              
              {/* Min Tourist Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Tourists: {filters.minTouristCount}
                </label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={filters.minTouristCount}
                  onChange={(e) => setFilters(prev => ({ ...prev, minTouristCount: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
              
              {/* Display Options */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.showTrends}
                    onChange={(e) => setFilters(prev => ({ ...prev, showTrends: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Show Trends</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.showLabels}
                    onChange={(e) => setFilters(prev => ({ ...prev, showLabels: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Show Labels</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Layers Control */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Layers className="h-5 w-5 mr-2" />
              Layers
            </h3>
            
            <div className="space-y-3">
              {layers.map(layer => (
                <div key={layer.id} className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={layer.visible}
                      onChange={() => handleLayerToggle(layer.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{layer.name}</span>
                  </label>
                  <div 
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: layer.color }}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Legend */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Risk Levels</h3>
            <div className="space-y-2">
              {['low', 'medium', 'high', 'critical'].map(risk => (
                <div key={risk} className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getRiskColor(risk) }}
                  />
                  <span className="text-sm capitalize">{risk}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Heatmap Grid */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <div className="grid grid-cols-3 gap-4" style={{ transform: `scale(${zoomLevel})` }}>
              {filteredData.map(zone => (
                <HeatmapCell
                  key={zone.id}
                  data={zone}
                  maxTourists={maxTourists}
                  isSelected={selectedZone?.id === zone.id}
                  onSelect={handleZoneSelect}
                  filters={filters}
                />
              ))}
            </div>
            
            {/* Zoom Controls */}
            <div className="flex items-center justify-center space-x-2 mt-4 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
                icon={<ZoomOut className="h-4 w-4" />}
              >
                Zoom Out
              </Button>
              <span className="text-sm text-gray-600">{Math.round(zoomLevel * 100)}%</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}
                icon={<ZoomIn className="h-4 w-4" />}
              >
                Zoom In
              </Button>
            </div>
          </Card>
        </div>

        {/* Zone Details */}
        <div className="space-y-6">
          {selectedZone ? (
            <Card>
              <h3 className="text-lg font-semibold mb-4">{selectedZone.name}</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tourists:</span>
                  <span className="font-medium">{selectedZone.touristCount}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Incidents:</span>
                  <span className="font-medium text-red-600">{selectedZone.incidentCount}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Safety Score:</span>
                  <span className="font-medium text-green-600">{selectedZone.safetyScore}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Level:</span>
                  <Badge variant={
                    selectedZone.riskLevel === 'critical' ? 'danger' :
                    selectedZone.riskLevel === 'high' ? 'warning' :
                    selectedZone.riskLevel === 'medium' ? 'info' : 'success'
                  }>
                    {selectedZone.riskLevel}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="font-medium">{selectedZone.responseTime}m</span>
                </div>
                
                {/* Trends */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium mb-2">Trends</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tourist Change:</span>
                      <span className={selectedZone.trends.touristChange > 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatTrend(selectedZone.trends.touristChange)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Incident Change:</span>
                      <span className={selectedZone.trends.incidentChange > 0 ? 'text-red-600' : 'text-green-600'}>
                        {formatTrend(selectedZone.trends.incidentChange)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <Button className="w-full" size="sm">
                    View Detailed Analytics
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a zone to view details</p>
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full" size="sm">
                Generate Zone Report
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                Set Alert Threshold
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                Emergency Response
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeatmapVisualization;
