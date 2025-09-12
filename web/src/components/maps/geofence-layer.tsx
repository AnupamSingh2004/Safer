/**
 * Smart Tourist Safety System - Geofence Layer
 * Advanced geofence zones with risk-based coloring, boundary visualization, and zone management
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Polygon, Circle, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface GeofenceZone {
  id: string;
  name: string;
  description?: string;
  type: 'polygon' | 'circle';
  coordinates?: [number, number][];
  center?: [number, number];
  radius?: number;
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  category: 'tourist_area' | 'restricted' | 'emergency' | 'hospital' | 'transport' | 'custom';
  active: boolean;
  alertCount: number;
  maxCapacity?: number;
  currentOccupancy?: number;
  emergencyServices?: string[];
  entryRequirements?: string[];
  operatingHours?: {
    open: string;
    close: string;
  };
  contactInfo?: {
    phone?: string;
    emergency?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface GeofenceLayerProps {
  zones: GeofenceZone[];
  showLabels?: boolean;
  showTooltips?: boolean;
  onZoneClick?: (zone: GeofenceZone) => void;
  onZoneEdit?: (zone: GeofenceZone) => void;
  onZoneDelete?: (zoneId: string) => void;
  emergencyMode?: boolean;
  highlightedZoneId?: string;
  filterByRiskLevel?: GeofenceZone['riskLevel'][];
  filterByCategory?: GeofenceZone['category'][];
  opacity?: number;
  showOccupancy?: boolean;
  realTimeUpdates?: boolean;
}

// ============================================================================
// ZONE STYLING CONFIGURATION
// ============================================================================

const getZoneStyle = (
  zone: GeofenceZone, 
  isHighlighted: boolean = false, 
  emergencyMode: boolean = false,
  opacity: number = 0.7
) => {
  const riskLevelColors = {
    safe: '#10b981',      // Green
    low: '#22c55e',       // Light Green
    medium: '#f59e0b',    // Amber
    high: '#ef4444',      // Red
    critical: '#7c3aed'   // Purple
  };

  const categoryPatterns = {
    tourist_area: 'solid',
    restricted: 'dashed',
    emergency: 'solid',
    hospital: 'dotted',
    transport: 'solid',
    custom: 'solid'
  };

  const baseColor = riskLevelColors[zone.riskLevel];
  const strokeWeight = isHighlighted ? 4 : 2;
  const fillOpacity = emergencyMode && zone.riskLevel === 'critical' ? 0.4 : opacity * 0.3;
  const strokeOpacity = emergencyMode && zone.riskLevel === 'critical' ? 1 : opacity;

  return {
    color: baseColor,
    fillColor: baseColor,
    fillOpacity,
    weight: strokeWeight,
    opacity: strokeOpacity,
    dashArray: categoryPatterns[zone.category] === 'dashed' ? '10, 10' : 
               categoryPatterns[zone.category] === 'dotted' ? '2, 8' : undefined,
    className: `geofence-zone ${zone.category} ${zone.riskLevel} ${isHighlighted ? 'highlighted' : ''}`
  };
};

// ============================================================================
// ZONE POPUP COMPONENT
// ============================================================================

interface ZonePopupProps {
  zone: GeofenceZone;
  onEdit?: (zone: GeofenceZone) => void;
  onDelete?: (zoneId: string) => void;
  showOccupancy?: boolean;
}

const ZonePopup: React.FC<ZonePopupProps> = ({ 
  zone, 
  onEdit, 
  onDelete, 
  showOccupancy = false 
}) => {
  const getRiskLevelColor = (level: GeofenceZone['riskLevel']) => {
    switch (level) {
      case 'safe': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: GeofenceZone['category']) => {
    switch (category) {
      case 'tourist_area': return '🏛️';
      case 'restricted': return '🚫';
      case 'emergency': return '🚨';
      case 'hospital': return '🏥';
      case 'transport': return '🚌';
      case 'custom': return '📍';
      default: return '📍';
    }
  };

  const getOccupancyColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="p-4 min-w-80 max-w-96">
      {/* Zone Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getCategoryIcon(zone.category)}</span>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{zone.name}</h3>
            <p className="text-sm text-gray-600 capitalize">{zone.category.replace('_', ' ')}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(zone.riskLevel)}`}>
          {zone.riskLevel.toUpperCase()}
        </span>
      </div>

      {/* Zone Description */}
      {zone.description && (
        <p className="text-sm text-gray-700 mb-3">{zone.description}</p>
      )}

      {/* Zone Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <p className="text-gray-600">Status</p>
          <p className={`font-semibold ${zone.active ? 'text-green-600' : 'text-red-600'}`}>
            {zone.active ? 'Active' : 'Inactive'}
          </p>
        </div>

        <div>
          <p className="text-gray-600">Alert Count</p>
          <p className="font-semibold text-red-600">{zone.alertCount}</p>
        </div>

        {zone.type === 'circle' && zone.radius && (
          <div>
            <p className="text-gray-600">Radius</p>
            <p className="font-semibold">{zone.radius}m</p>
          </div>
        )}

        {zone.coordinates && (
          <div>
            <p className="text-gray-600">Area Points</p>
            <p className="font-semibold">{zone.coordinates.length}</p>
          </div>
        )}
      </div>

      {/* Occupancy Information */}
      {showOccupancy && zone.maxCapacity && zone.currentOccupancy !== undefined && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Current Occupancy</span>
            <span className={`text-sm font-bold ${getOccupancyColor(zone.currentOccupancy, zone.maxCapacity)}`}>
              {zone.currentOccupancy}/{zone.maxCapacity}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                getOccupancyColor(zone.currentOccupancy, zone.maxCapacity).includes('red') ? 'bg-red-500' :
                getOccupancyColor(zone.currentOccupancy, zone.maxCapacity).includes('yellow') ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min((zone.currentOccupancy / zone.maxCapacity) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Operating Hours */}
      {zone.operatingHours && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Operating Hours</p>
          <p className="text-sm font-semibold">
            {zone.operatingHours.open} - {zone.operatingHours.close}
          </p>
        </div>
      )}

      {/* Emergency Services */}
      {zone.emergencyServices && zone.emergencyServices.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Emergency Services</p>
          <div className="flex flex-wrap gap-1">
            {zone.emergencyServices.map((service, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Entry Requirements */}
      {zone.entryRequirements && zone.entryRequirements.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Entry Requirements</p>
          <div className="space-y-1">
            {zone.entryRequirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <span className="text-orange-500">•</span>
                <span>{requirement}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Information */}
      {zone.contactInfo && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">Contact Information</p>
          {zone.contactInfo.phone && (
            <p className="text-sm text-blue-800">📞 {zone.contactInfo.phone}</p>
          )}
          {zone.contactInfo.emergency && (
            <p className="text-sm text-red-600">🚨 {zone.contactInfo.emergency}</p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <motion.button
          onClick={() => onEdit?.(zone)}
          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ✏️ Edit Zone
        </motion.button>
        
        <motion.button
          onClick={() => onDelete?.(zone.id)}
          className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🗑️ Delete
        </motion.button>
      </div>

      {/* Timestamps */}
      <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
        <p>Created: {new Date(zone.createdAt).toLocaleDateString()}</p>
        <p>Updated: {new Date(zone.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

// ============================================================================
// ZONE LABEL COMPONENT
// ============================================================================

interface ZoneLabelProps {
  zone: GeofenceZone;
  position: [number, number];
}

const ZoneLabel: React.FC<ZoneLabelProps> = ({ zone, position }) => {
  return (
    <Tooltip 
      permanent 
      direction="center" 
      className="zone-label"
      opacity={0.9}
    >
      <div className="bg-white px-2 py-1 rounded shadow-lg border text-xs font-medium">
        <div className="flex items-center space-x-1">
          <div 
            className={`w-2 h-2 rounded-full ${
              zone.riskLevel === 'safe' ? 'bg-green-500' :
              zone.riskLevel === 'low' ? 'bg-green-400' :
              zone.riskLevel === 'medium' ? 'bg-yellow-500' :
              zone.riskLevel === 'high' ? 'bg-red-500' :
              'bg-purple-500'
            }`}
          />
          <span>{zone.name}</span>
        </div>
        {zone.alertCount > 0 && (
          <div className="text-red-600 font-bold">
            {zone.alertCount} alerts
          </div>
        )}
      </div>
    </Tooltip>
  );
};

// ============================================================================
// MAIN GEOFENCE LAYER COMPONENT
// ============================================================================

const GeofenceLayer: React.FC<GeofenceLayerProps> = ({
  zones,
  showLabels = true,
  showTooltips = true,
  onZoneClick,
  onZoneEdit,
  onZoneDelete,
  emergencyMode = false,
  highlightedZoneId,
  filterByRiskLevel,
  filterByCategory,
  opacity = 0.7,
  showOccupancy = false,
  realTimeUpdates = true
}) => {
  const [selectedZone, setSelectedZone] = useState<GeofenceZone | null>(null);

  // Filter zones based on criteria
  const filteredZones = useMemo(() => {
    let filtered = zones;

    if (filterByRiskLevel && filterByRiskLevel.length > 0) {
      filtered = filtered.filter(zone => filterByRiskLevel.includes(zone.riskLevel));
    }

    if (filterByCategory && filterByCategory.length > 0) {
      filtered = filtered.filter(zone => filterByCategory.includes(zone.category));
    }

    return filtered.filter(zone => zone.active);
  }, [zones, filterByRiskLevel, filterByCategory]);

  // Calculate zone center for labels
  const getZoneCenter = useCallback((zone: GeofenceZone): [number, number] => {
    if (zone.type === 'circle' && zone.center) {
      return zone.center;
    }

    if (zone.type === 'polygon' && zone.coordinates) {
      const lats = zone.coordinates.map(coord => coord[0]);
      const lngs = zone.coordinates.map(coord => coord[1]);
      return [
        lats.reduce((a, b) => a + b, 0) / lats.length,
        lngs.reduce((a, b) => a + b, 0) / lngs.length
      ];
    }

    return [0, 0];
  }, []);

  const handleZoneClick = useCallback((zone: GeofenceZone) => {
    setSelectedZone(zone);
    onZoneClick?.(zone);
  }, [onZoneClick]);

  const handleZoneEdit = useCallback((zone: GeofenceZone) => {
    onZoneEdit?.(zone);
    setSelectedZone(null);
  }, [onZoneEdit]);

  const handleZoneDelete = useCallback((zoneId: string) => {
    onZoneDelete?.(zoneId);
    setSelectedZone(null);
  }, [onZoneDelete]);

  return (
    <>
      <AnimatePresence>
        {filteredZones.map(zone => {
          const isHighlighted = zone.id === highlightedZoneId;
          const zoneStyle = getZoneStyle(zone, isHighlighted, emergencyMode, opacity);

          if (zone.type === 'polygon' && zone.coordinates) {
            return (
              <Polygon
                key={zone.id}
                positions={zone.coordinates}
                pathOptions={zoneStyle}
                eventHandlers={{
                  click: () => handleZoneClick(zone)
                }}
              >
                <Popup>
                  <ZonePopup
                    zone={zone}
                    onEdit={handleZoneEdit}
                    onDelete={handleZoneDelete}
                    showOccupancy={showOccupancy}
                  />
                </Popup>
                
                {showLabels && (
                  <ZoneLabel zone={zone} position={getZoneCenter(zone)} />
                )}
              </Polygon>
            );
          }

          if (zone.type === 'circle' && zone.center && zone.radius) {
            return (
              <Circle
                key={zone.id}
                center={zone.center}
                radius={zone.radius}
                pathOptions={zoneStyle}
                eventHandlers={{
                  click: () => handleZoneClick(zone)
                }}
              >
                <Popup>
                  <ZonePopup
                    zone={zone}
                    onEdit={handleZoneEdit}
                    onDelete={handleZoneDelete}
                    showOccupancy={showOccupancy}
                  />
                </Popup>
                
                {showLabels && (
                  <ZoneLabel zone={zone} position={zone.center} />
                )}
              </Circle>
            );
          }

          return null;
        })}
      </AnimatePresence>
    </>
  );
};

// ============================================================================
// ZONE STATISTICS COMPONENT
// ============================================================================

interface ZoneStatisticsProps {
  zones: GeofenceZone[];
  className?: string;
}

export const ZoneStatistics: React.FC<ZoneStatisticsProps> = ({ zones, className = '' }) => {
  const stats = useMemo(() => {
    const totalZones = zones.length;
    const activeZones = zones.filter(z => z.active).length;
    const totalAlerts = zones.reduce((sum, z) => sum + z.alertCount, 0);
    
    const riskDistribution = zones.reduce((acc, zone) => {
      acc[zone.riskLevel] = (acc[zone.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryDistribution = zones.reduce((acc, zone) => {
      acc[zone.category] = (acc[zone.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalZones,
      activeZones,
      totalAlerts,
      riskDistribution,
      categoryDistribution
    };
  }, [zones]);

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-4 ${className}`}>
      <h3 className="font-bold text-lg mb-4">Zone Statistics</h3>
      
      {/* Overview */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalZones}</div>
          <div className="text-sm text-gray-600">Total Zones</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.activeZones}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.totalAlerts}</div>
          <div className="text-sm text-gray-600">Total Alerts</div>
        </div>
      </div>

      {/* Risk Level Distribution */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Risk Distribution</h4>
        <div className="space-y-2">
          {Object.entries(stats.riskDistribution).map(([level, count]) => (
            <div key={level} className="flex items-center justify-between">
              <span className="text-sm capitalize">{level}</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Distribution */}
      <div>
        <h4 className="font-semibold mb-2">Category Distribution</h4>
        <div className="space-y-2">
          {Object.entries(stats.categoryDistribution).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm capitalize">{category.replace('_', ' ')}</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default GeofenceLayer;
export { ZonePopup, ZoneLabel };
export type { GeofenceZone, GeofenceLayerProps };