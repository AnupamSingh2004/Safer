/**
 * Smart Tourist Safety System - Route Planner Component
 * Advanced route planning with safety optimization, emergency evacuation, and risk avoidance
 */

'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { 
  Navigation, 
  Route, 
  Shield, 
  AlertTriangle, 
  Clock,
  MapPin,
  Target,
  Play,
  Square,
  RotateCcw,
  Share,
  Download,
  Settings,
  Zap,
  Heart,
  Phone,
  Map,
  Layers
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface RoutePoint {
  lat: number;
  lng: number;
  name?: string;
  type: 'start' | 'waypoint' | 'end' | 'emergency_exit' | 'safe_point';
  metadata?: Record<string, any>;
}

interface RouteSegment {
  start: RoutePoint;
  end: RoutePoint;
  distance: number; // in meters
  duration: number; // in seconds
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  safetyScore: number; // 0-100
  coordinates: [number, number][];
  hazards: string[];
  emergencyServices: string[];
}

interface RouteOptions {
  mode: 'safest' | 'fastest' | 'shortest' | 'emergency';
  avoidHighRisk: boolean;
  avoidCrowds: boolean;
  preferLighting: boolean;
  includeEmergencyExits: boolean;
  maxDetourPercent: number;
  emergencyServices: boolean;
}

interface CalculatedRoute {
  id: string;
  segments: RouteSegment[];
  totalDistance: number;
  totalDuration: number;
  overallSafetyScore: number;
  riskAssessment: {
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    recommendations: string[];
  };
  emergencyContacts: {
    police: string[];
    medical: string[];
    fire: string[];
  };
  waypoints: RoutePoint[];
  alternativeRoutes?: CalculatedRoute[];
}

interface RoutePlannerProps {
  onRouteCalculated?: (route: CalculatedRoute) => void;
  onWaypointAdd?: (point: RoutePoint) => void;
  onEmergencyRoute?: (route: CalculatedRoute) => void;
  emergencyMode?: boolean;
  currentLocation?: [number, number];
  dangerZones?: Array<{
    center: [number, number];
    radius: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  }>;
  className?: string;
}

// ============================================================================
// ROUTE VISUALIZATION STYLES
// ============================================================================

const ROUTE_STYLES = {
  safest: {
    color: '#22c55e',
    weight: 6,
    opacity: 0.8,
    dashArray: '0',
    className: 'route-safest'
  },
  fastest: {
    color: '#3b82f6',
    weight: 5,
    opacity: 0.7,
    dashArray: '0',
    className: 'route-fastest'
  },
  shortest: {
    color: '#f59e0b',
    weight: 4,
    opacity: 0.7,
    dashArray: '5, 10',
    className: 'route-shortest'
  },
  emergency: {
    color: '#ef4444',
    weight: 8,
    opacity: 0.9,
    dashArray: '10, 5',
    className: 'route-emergency pulse-animation'
  },
  alternative: {
    color: '#6b7280',
    weight: 3,
    opacity: 0.5,
    dashArray: '2, 8',
    className: 'route-alternative'
  }
};

const WAYPOINT_ICONS = {
  start: {
    icon: '🏁',
    color: '#22c55e',
    size: 'large'
  },
  waypoint: {
    icon: '📍',
    color: '#3b82f6',
    size: 'medium'
  },
  end: {
    icon: '🎯',
    color: '#ef4444',
    size: 'large'
  },
  emergency_exit: {
    icon: '🚨',
    color: '#f59e0b',
    size: 'medium'
  },
  safe_point: {
    icon: '🛡️',
    color: '#22c55e',
    size: 'small'
  }
};

// ============================================================================
// ROUTE CALCULATION ENGINE
// ============================================================================

class RouteCalculator {
  private dangerZones: Array<{ center: [number, number]; radius: number; riskLevel: string }>;

  constructor(dangerZones: Array<{ center: [number, number]; radius: number; riskLevel: string }> = []) {
    this.dangerZones = dangerZones;
  }

  public calculateRoute(
    start: RoutePoint,
    end: RoutePoint,
    waypoints: RoutePoint[] = [],
    options: RouteOptions
  ): CalculatedRoute {
    // Mock implementation - in real app, use routing service like Mapbox/OSRM
    const allPoints = [start, ...waypoints, end];
    const segments: RouteSegment[] = [];

    for (let i = 0; i < allPoints.length - 1; i++) {
      const segment = this.calculateSegment(allPoints[i], allPoints[i + 1], options);
      segments.push(segment);
    }

    const totalDistance = segments.reduce((sum, seg) => sum + seg.distance, 0);
    const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0);
    const overallSafetyScore = this.calculateOverallSafety(segments);
    
    return {
      id: `route_${Date.now()}`,
      segments,
      totalDistance,
      totalDuration,
      overallSafetyScore,
      riskAssessment: this.assessRisk(segments),
      emergencyContacts: this.getEmergencyContacts(),
      waypoints: allPoints,
      alternativeRoutes: options.mode !== 'emergency' ? this.generateAlternatives(start, end, options) : undefined
    };
  }

  private calculateSegment(start: RoutePoint, end: RoutePoint, options: RouteOptions): RouteSegment {
    // Simple straight-line calculation (in real app, use proper routing)
    const distance = this.calculateDistance(start, end);
    const duration = this.estimateDuration(distance, options.mode);
    const coordinates = this.generatePath(start, end);
    const riskLevel = this.assessSegmentRisk(coordinates, options);
    const safetyScore = this.calculateSafetyScore(riskLevel, options);

    return {
      start,
      end,
      distance,
      duration,
      riskLevel,
      safetyScore,
      coordinates,
      hazards: this.identifyHazards(coordinates),
      emergencyServices: this.findNearbyServices(coordinates)
    };
  }

  private calculateDistance(point1: RoutePoint, point2: RoutePoint): number {
    // Haversine formula
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.lat * Math.PI/180;
    const φ2 = point2.lat * Math.PI/180;
    const Δφ = (point2.lat-point1.lat) * Math.PI/180;
    const Δλ = (point2.lng-point1.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  private estimateDuration(distance: number, mode: string): number {
    const speeds = {
      safest: 3.5, // 3.5 m/s (walking speed)
      fastest: 5.0, // 5 m/s (brisk walk)
      shortest: 4.0, // 4 m/s (normal walk)
      emergency: 6.0 // 6 m/s (urgent pace)
    };
    
    return distance / (speeds[mode as keyof typeof speeds] || 4.0);
  }

  private generatePath(start: RoutePoint, end: RoutePoint): [number, number][] {
    // Simple interpolation (in real app, use proper routing API)
    const steps = 10;
    const path: [number, number][] = [];
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = start.lat + (end.lat - start.lat) * t;
      const lng = start.lng + (end.lng - start.lng) * t;
      path.push([lat, lng]);
    }
    
    return path;
  }

  private assessSegmentRisk(coordinates: [number, number][], options: RouteOptions): 'low' | 'medium' | 'high' | 'critical' {
    let riskScore = 0;

    // Check intersection with danger zones
    coordinates.forEach(coord => {
      this.dangerZones.forEach(zone => {
        const distance = this.calculateDistance(
          { lat: coord[0], lng: coord[1], type: 'waypoint' },
          { lat: zone.center[0], lng: zone.center[1], type: 'waypoint' }
        );
        
        if (distance <= zone.radius) {
          const riskValues = { low: 1, medium: 2, high: 3, critical: 4 };
          riskScore += riskValues[zone.riskLevel as keyof typeof riskValues] || 1;
        }
      });
    });

    if (riskScore >= 8) return 'critical';
    if (riskScore >= 5) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  }

  private calculateSafetyScore(riskLevel: string, options: RouteOptions): number {
    const baseScores = { low: 90, medium: 70, high: 40, critical: 10 };
    let score = baseScores[riskLevel as keyof typeof baseScores] || 50;

    // Apply option bonuses
    if (options.preferLighting) score += 5;
    if (options.includeEmergencyExits) score += 10;
    if (options.emergencyServices) score += 8;

    return Math.min(Math.max(score, 0), 100);
  }

  private identifyHazards(coordinates: [number, number][]): string[] {
    // Mock hazard identification
    const hazards = ['Low visibility area', 'Construction zone', 'Steep terrain'];
    return hazards.slice(0, Math.floor(Math.random() * 3));
  }

  private findNearbyServices(coordinates: [number, number][]): string[] {
    // Mock service identification
    const services = ['Police Station (500m)', 'Hospital (1.2km)', 'Fire Station (800m)'];
    return services.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  private calculateOverallSafety(segments: RouteSegment[]): number {
    if (segments.length === 0) return 0;
    return segments.reduce((sum, seg) => sum + seg.safetyScore, 0) / segments.length;
  }

  private assessRisk(segments: RouteSegment[]): {
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    recommendations: string[];
  } {
    const avgSafety = this.calculateOverallSafety(segments);
    const allHazards = segments.flatMap(seg => seg.hazards);
    
    let level: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (avgSafety < 30) level = 'critical';
    else if (avgSafety < 50) level = 'high';
    else if (avgSafety < 70) level = 'medium';

    const recommendations = [
      'Stay on designated paths',
      'Travel in groups when possible',
      'Keep emergency contacts ready',
      'Check weather conditions'
    ];

    return {
      level,
      factors: allHazards,
      recommendations: recommendations.slice(0, 3)
    };
  }

  private getEmergencyContacts(): { police: string[]; medical: string[]; fire: string[] } {
    return {
      police: ['100', 'Local Police: +91-XXXXXXXXXX'],
      medical: ['108', 'Emergency Medical: +91-XXXXXXXXXX'],
      fire: ['101', 'Fire Department: +91-XXXXXXXXXX']
    };
  }

  private generateAlternatives(start: RoutePoint, end: RoutePoint, options: RouteOptions): CalculatedRoute[] {
    // Generate 1-2 alternative routes with different strategies
    const alternatives: CalculatedRoute[] = [];
    
    if (options.mode !== 'safest') {
      const safestOptions = { ...options, mode: 'safest' as const };
      alternatives.push(this.calculateRoute(start, end, [], safestOptions));
    }
    
    if (options.mode !== 'fastest') {
      const fastestOptions = { ...options, mode: 'fastest' as const };
      alternatives.push(this.calculateRoute(start, end, [], fastestOptions));
    }

    return alternatives.slice(0, 2);
  }
}

// ============================================================================
// ROUTE CONTROLS COMPONENT
// ============================================================================

interface RouteControlsProps {
  options: RouteOptions;
  onOptionsChange: (options: RouteOptions) => void;
  onStartPlanning: () => void;
  onClearRoute: () => void;
  onEmergencyRoute: () => void;
  isPlanning: boolean;
  hasRoute: boolean;
  emergencyMode: boolean;
}

const RouteControls: React.FC<RouteControlsProps> = ({
  options,
  onOptionsChange,
  onStartPlanning,
  onClearRoute,
  onEmergencyRoute,
  isPlanning,
  hasRoute,
  emergencyMode
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const routeModes = [
    { value: 'safest', label: 'Safest Route', icon: Shield, color: 'green' },
    { value: 'fastest', label: 'Fastest Route', icon: Zap, color: 'blue' },
    { value: 'shortest', label: 'Shortest Route', icon: Target, color: 'orange' },
    { value: 'emergency', label: 'Emergency Route', icon: AlertTriangle, color: 'red' }
  ];

  return (
    <motion.div
      className="absolute top-4 left-4 z-[1000] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Route Planner</h3>
        </div>
        <div className="flex items-center gap-2">
          {emergencyMode && (
            <motion.button
              onClick={onEmergencyRoute}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Emergency
            </motion.button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Route Mode Selection */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 gap-2">
          {routeModes.map((mode) => {
            const IconComponent = mode.icon;
            return (
              <button
                key={mode.value}
                onClick={() => onOptionsChange({ ...options, mode: mode.value as any })}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  options.mode === mode.value
                    ? `border-${mode.color}-500 bg-${mode.color}-50 text-${mode.color}-700 dark:bg-${mode.color}-900 dark:text-${mode.color}-300`
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3"
          >
            {/* Safety Options */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Safety Preferences</h4>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.avoidHighRisk}
                  onChange={(e) => onOptionsChange({ ...options, avoidHighRisk: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Avoid high-risk areas</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.preferLighting}
                  onChange={(e) => onOptionsChange({ ...options, preferLighting: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Prefer well-lit paths</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeEmergencyExits}
                  onChange={(e) => onOptionsChange({ ...options, includeEmergencyExits: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Include emergency exits</span>
              </label>
            </div>

            {/* Max Detour */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Max Detour: {options.maxDetourPercent}%
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={options.maxDetourPercent}
                onChange={(e) => onOptionsChange({ ...options, maxDetourPercent: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
        <button
          onClick={onStartPlanning}
          disabled={isPlanning}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPlanning ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RotateCcw className="w-4 h-4" />
              </motion.div>
              <span className="text-sm">Planning...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span className="text-sm">Plan Route</span>
            </>
          )}
        </button>

        {hasRoute && (
          <button
            onClick={onClearRoute}
            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Square className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// ROUTE INFO PANEL COMPONENT
// ============================================================================

interface RouteInfoPanelProps {
  route: CalculatedRoute | null;
  visible: boolean;
  onClose: () => void;
}

const RouteInfoPanel: React.FC<RouteInfoPanelProps> = ({ route, visible, onClose }) => {
  if (!visible || !route) return null;

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getRiskColor = (level: string) => {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-orange-600 bg-orange-100',
      critical: 'text-red-600 bg-red-100'
    };
    return colors[level as keyof typeof colors] || colors.low;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      className="absolute bottom-4 left-4 z-[1000] w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Route className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Route Details</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 transition-colors"
        >
          ×
        </button>
      </div>

      {/* Route Summary */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {formatDistance(route.totalDistance)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Distance</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {formatDuration(route.totalDuration)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
          </div>
        </div>

        {/* Safety Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Safety Score</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {Math.round(route.overallSafetyScore)}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${route.overallSafetyScore}%` }}
            />
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Risk Level</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(route.riskAssessment.level)}`}>
              {route.riskAssessment.level.toUpperCase()}
            </span>
          </div>
          
          {route.riskAssessment.factors.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Risk Factors:</div>
              {route.riskAssessment.factors.slice(0, 3).map((factor, index) => (
                <div key={index} className="text-xs text-gray-500 dark:text-gray-500">• {factor}</div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        {route.riskAssessment.recommendations.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Recommendations</div>
            {route.riskAssessment.recommendations.map((rec, index) => (
              <div key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                <span className="text-blue-600">•</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        )}

        {/* Emergency Contacts */}
        <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Contacts</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <Phone className="w-4 h-4 mx-auto mb-1 text-red-600" />
              <div className="font-medium">Police</div>
              <div className="text-gray-500">100</div>
            </div>
            <div className="text-center">
              <Heart className="w-4 h-4 mx-auto mb-1 text-red-600" />
              <div className="font-medium">Medical</div>
              <div className="text-gray-500">108</div>
            </div>
            <div className="text-center">
              <Zap className="w-4 h-4 mx-auto mb-1 text-red-600" />
              <div className="font-medium">Fire</div>
              <div className="text-gray-500">101</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <Share className="w-4 h-4" />
            Share
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN ROUTE PLANNER COMPONENT
// ============================================================================

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  onRouteCalculated,
  onWaypointAdd,
  onEmergencyRoute,
  emergencyMode = false,
  currentLocation,
  dangerZones = [],
  className = ''
}) => {
  const map = useMap();
  const [options, setOptions] = useState<RouteOptions>({
    mode: 'safest',
    avoidHighRisk: true,
    avoidCrowds: false,
    preferLighting: true,
    includeEmergencyExits: true,
    maxDetourPercent: 20,
    emergencyServices: true
  });

  const [waypoints, setWaypoints] = useState<RoutePoint[]>([]);
  const [currentRoute, setCurrentRoute] = useState<CalculatedRoute | null>(null);
  const [isPlanning, setIsPlanning] = useState(false);
  const [showRouteInfo, setShowRouteInfo] = useState(false);
  const [routeLayer, setRouteLayer] = useState<L.LayerGroup | null>(null);

  const routeCalculator = useMemo(() => new RouteCalculator(dangerZones), [dangerZones]);

  // Handle map clicks for waypoint placement
  useEffect(() => {
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (waypoints.length < 10) { // Limit waypoints
        const newWaypoint: RoutePoint = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          type: waypoints.length === 0 ? 'start' : 'waypoint',
          name: `Point ${waypoints.length + 1}`
        };

        setWaypoints(prev => [...prev, newWaypoint]);
        
        if (onWaypointAdd) {
          onWaypointAdd(newWaypoint);
        }
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, waypoints.length, onWaypointAdd]);

  const handleStartPlanning = useCallback(async () => {
    if (waypoints.length < 2) return;

    setIsPlanning(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const start = waypoints[0];
      const end = waypoints[waypoints.length - 1];
      const intermediateWaypoints = waypoints.slice(1, -1);
      
      // Mark end point correctly
      end.type = 'end';
      
      const route = routeCalculator.calculateRoute(start, end, intermediateWaypoints, options);
      
      setCurrentRoute(route);
      setShowRouteInfo(true);
      
      // Draw route on map
      drawRouteOnMap(route);
      
      if (onRouteCalculated) {
        onRouteCalculated(route);
      }
    } catch (error) {
      console.error('Route planning failed:', error);
    } finally {
      setIsPlanning(false);
    }
  }, [waypoints, options, routeCalculator, onRouteCalculated]);

  const handleEmergencyRoute = useCallback(async () => {
    if (!currentLocation || waypoints.length === 0) return;

    const emergencyOptions: RouteOptions = {
      ...options,
      mode: 'emergency',
      avoidHighRisk: true,
      includeEmergencyExits: true,
      emergencyServices: true
    };

    setIsPlanning(true);
    
    try {
      const start: RoutePoint = {
        lat: currentLocation[0],
        lng: currentLocation[1],
        type: 'start',
        name: 'Current Location'
      };
      
      const nearestExit = findNearestEmergencyExit(currentLocation);
      const route = routeCalculator.calculateRoute(start, nearestExit, [], emergencyOptions);
      
      setCurrentRoute(route);
      setShowRouteInfo(true);
      drawRouteOnMap(route);
      
      if (onEmergencyRoute) {
        onEmergencyRoute(route);
      }
    } catch (error) {
      console.error('Emergency route planning failed:', error);
    } finally {
      setIsPlanning(false);
    }
  }, [currentLocation, waypoints, options, routeCalculator, onEmergencyRoute]);

  const findNearestEmergencyExit = (location: [number, number]): RoutePoint => {
    // Mock emergency exit - in real app, find actual emergency exits
    return {
      lat: location[0] + 0.01,
      lng: location[1] + 0.01,
      type: 'emergency_exit',
      name: 'Emergency Exit'
    };
  };

  const drawRouteOnMap = useCallback((route: CalculatedRoute) => {
    if (routeLayer) {
      map.removeLayer(routeLayer);
    }

    const newRouteLayer = L.layerGroup();
    
    // Draw main route
    route.segments.forEach(segment => {
      const polyline = L.polyline(segment.coordinates, {
        ...ROUTE_STYLES[options.mode],
        className: `${ROUTE_STYLES[options.mode].className} ${emergencyMode ? 'emergency-pulse' : ''}`
      });
      
      polyline.bindPopup(`
        <div class="route-popup">
          <h4>Route Segment</h4>
          <p>Distance: ${(segment.distance / 1000).toFixed(1)}km</p>
          <p>Duration: ${Math.floor(segment.duration / 60)}min</p>
          <p>Safety Score: ${segment.safetyScore}/100</p>
          <p>Risk Level: ${segment.riskLevel}</p>
        </div>
      `);
      
      newRouteLayer.addLayer(polyline);
    });

    // Draw waypoint markers
    route.waypoints.forEach((waypoint, index) => {
      const iconInfo = WAYPOINT_ICONS[waypoint.type];
      
      const marker = L.marker([waypoint.lat, waypoint.lng], {
        icon: L.divIcon({
          html: `
            <div class="waypoint-marker ${waypoint.type}" style="background-color: ${iconInfo.color}">
              <span class="waypoint-icon">${iconInfo.icon}</span>
              <span class="waypoint-index">${index + 1}</span>
            </div>
          `,
          className: 'custom-waypoint-marker',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        })
      });
      
      marker.bindPopup(`
        <div class="waypoint-popup">
          <h4>${waypoint.name || `${waypoint.type} Point`}</h4>
          <p>Type: ${waypoint.type}</p>
          <p>Coordinates: ${waypoint.lat.toFixed(4)}, ${waypoint.lng.toFixed(4)}</p>
        </div>
      `);
      
      newRouteLayer.addLayer(marker);
    });

    // Draw alternative routes
    if (route.alternativeRoutes) {
      route.alternativeRoutes.forEach(altRoute => {
        altRoute.segments.forEach(segment => {
          const polyline = L.polyline(segment.coordinates, ROUTE_STYLES.alternative);
          newRouteLayer.addLayer(polyline);
        });
      });
    }

    newRouteLayer.addTo(map);
    setRouteLayer(newRouteLayer);

    // Fit map to route bounds
    const allCoords = route.segments.flatMap(seg => seg.coordinates);
    if (allCoords.length > 0) {
      const bounds = L.latLngBounds(allCoords);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, routeLayer, options.mode, emergencyMode]);

  const handleClearRoute = useCallback(() => {
    setWaypoints([]);
    setCurrentRoute(null);
    setShowRouteInfo(false);
    
    if (routeLayer) {
      map.removeLayer(routeLayer);
      setRouteLayer(null);
    }
  }, [map, routeLayer]);

  return (
    <>
      <RouteControls
        options={options}
        onOptionsChange={setOptions}
        onStartPlanning={handleStartPlanning}
        onClearRoute={handleClearRoute}
        onEmergencyRoute={handleEmergencyRoute}
        isPlanning={isPlanning}
        hasRoute={!!currentRoute}
        emergencyMode={emergencyMode}
      />
      
      <AnimatePresence>
        <RouteInfoPanel
          route={currentRoute}
          visible={showRouteInfo}
          onClose={() => setShowRouteInfo(false)}
        />
      </AnimatePresence>

      {/* Add custom styles */}
      <style jsx global>{`
        .route-popup {
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
        }
        
        .route-popup h4 {
          margin: 0 0 8px 0;
          font-weight: 600;
          color: #374151;
        }
        
        .route-popup p {
          margin: 4px 0;
          color: #6b7280;
        }
        
        .waypoint-marker {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 2px solid white;
          position: relative;
        }
        
        .waypoint-icon {
          font-size: 16px;
        }
        
        .waypoint-index {
          position: absolute;
          bottom: -8px;
          right: -8px;
          background: #374151;
          color: white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
        }
        
        .emergency-pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
        
        .route-safest {
          filter: drop-shadow(0 0 3px rgba(34, 197, 94, 0.5));
        }
        
        .route-emergency {
          filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.8));
        }
      `}</style>
    </>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default RoutePlanner;
export type { RoutePoint, RouteSegment, RouteOptions, CalculatedRoute, RoutePlannerProps };