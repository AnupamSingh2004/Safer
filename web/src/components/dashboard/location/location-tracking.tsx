/**
 * Smart Tourist Safety System - Location Services Components
 * Real-time location tracking and geofencing for tourist safety
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  AlertTriangle,
  Shield,
  Clock,
  Battery,
  Signal,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Play,
  Pause,
  Square,
  Smartphone,
  Satellite,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

interface GeofenceZone {
  id: string;
  name: string;
  type: 'safe' | 'restricted' | 'emergency' | 'tourist_area';
  coordinates: Array<{ lat: number; lng: number }>;
  radius?: number; // for circular zones
  isActive: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface LocationUpdate {
  touristId: string;
  touristName: string;
  location: LocationData;
  batteryLevel?: number;
  connectionStatus: 'online' | 'offline' | 'poor';
  lastSeen: string;
  insideZones: string[];
  alerts?: Array<{
    type: string;
    message: string;
    timestamp: string;
  }>;
}

interface LocationTrackingProps {
  touristId?: string;
  autoStart?: boolean;
  updateInterval?: number;
  onLocationUpdate?: (location: LocationData) => void;
  onGeofenceViolation?: (zoneId: string, location: LocationData) => void;
  className?: string;
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const GEOFENCE_ZONES: GeofenceZone[] = [
  {
    id: 'zone-001',
    name: 'India Gate Safe Zone',
    type: 'safe',
    coordinates: [
      { lat: 28.6129, lng: 77.2295 },
      { lat: 28.6135, lng: 77.2305 },
      { lat: 28.6125, lng: 77.2315 },
      { lat: 28.6115, lng: 77.2300 },
    ],
    isActive: true,
    priority: 'medium',
    description: 'Main tourist area around India Gate',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T08:30:00Z',
  },
  {
    id: 'zone-002',
    name: 'Red Fort Tourist Area',
    type: 'tourist_area',
    coordinates: [
      { lat: 28.6562, lng: 77.2410 },
      { lat: 28.6572, lng: 77.2420 },
      { lat: 28.6552, lng: 77.2430 },
      { lat: 28.6542, lng: 77.2415 },
    ],
    isActive: true,
    priority: 'high',
    description: 'Historical Red Fort area with guided tours',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T08:30:00Z',
  },
  {
    id: 'zone-003',
    name: 'Restricted Military Area',
    type: 'restricted',
    coordinates: [
      { lat: 28.6100, lng: 77.2200 },
      { lat: 28.6110, lng: 77.2210 },
      { lat: 28.6090, lng: 77.2220 },
      { lat: 28.6080, lng: 77.2205 },
    ],
    isActive: true,
    priority: 'critical',
    description: 'Military restricted area - no tourist access',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T08:30:00Z',
  },
];

const MOCK_LOCATION_UPDATES: LocationUpdate[] = [
  {
    touristId: 'T001',
    touristName: 'Raj Kumar',
    location: {
      latitude: 28.6129,
      longitude: 77.2295,
      accuracy: 5,
      altitude: 216,
      heading: 45,
      speed: 1.2,
      timestamp: Date.now() - 60000,
    },
    batteryLevel: 75,
    connectionStatus: 'online',
    lastSeen: new Date(Date.now() - 60000).toISOString(),
    insideZones: ['zone-001'],
  },
  {
    touristId: 'T002',
    touristName: 'Priya Sharma',
    location: {
      latitude: 28.6562,
      longitude: 77.2410,
      accuracy: 8,
      altitude: 220,
      heading: 180,
      speed: 0.5,
      timestamp: Date.now() - 120000,
    },
    batteryLevel: 45,
    connectionStatus: 'online',
    lastSeen: new Date(Date.now() - 120000).toISOString(),
    insideZones: ['zone-002'],
  },
  {
    touristId: 'T003',
    touristName: 'Alex Johnson',
    location: {
      latitude: 28.6095,
      longitude: 77.2205,
      accuracy: 12,
      timestamp: Date.now() - 300000,
    },
    batteryLevel: 20,
    connectionStatus: 'poor',
    lastSeen: new Date(Date.now() - 300000).toISOString(),
    insideZones: ['zone-003'],
    alerts: [
      {
        type: 'geofence_violation',
        message: 'Tourist entered restricted area',
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
    ],
  },
];

// ============================================================================
// LOCATION TRACKING COMPONENT
// ============================================================================

export function LocationTracking({
  touristId,
  autoStart = false,
  updateInterval = 10000, // 10 seconds
  onLocationUpdate,
  onGeofenceViolation,
  className,
}: LocationTrackingProps) {
  const { user, hasPermission } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([]);
  const [trackingAccuracy, setTrackingAccuracy] = useState<'high' | 'medium' | 'low'>('medium');
  const [geofenceAlerts, setGeofenceAlerts] = useState<Array<{
    zoneId: string;
    zoneName: string;
    type: string;
    timestamp: string;
  }>>([]);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'poor'>('offline');
  const [batteryOptimized, setBatteryOptimized] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  // Simulated location tracking
  const startTracking = useCallback(() => {
    if (!hasPermission('track_location')) {
      console.warn('No permission to track location');
      return;
    }

    setIsTracking(true);
    setConnectionStatus('online');

    // Simulate getting location every updateInterval
    const interval = setInterval(() => {
      // Simulate location data
      const mockLocation: LocationData = {
        latitude: 28.6129 + (Math.random() - 0.5) * 0.01,
        longitude: 77.2295 + (Math.random() - 0.5) * 0.01,
        accuracy: Math.random() * 10 + 3,
        altitude: 216 + Math.random() * 10,
        heading: Math.random() * 360,
        speed: Math.random() * 2,
        timestamp: Date.now(),
      };

      setCurrentLocation(mockLocation);
      setLocationHistory(prev => [...prev.slice(-99), mockLocation]);

      // Check geofence violations
      GEOFENCE_ZONES.forEach(zone => {
        if (zone.isActive && isPointInPolygon(mockLocation, zone.coordinates)) {
          if (zone.type === 'restricted') {
            const alert = {
              zoneId: zone.id,
              zoneName: zone.name,
              type: 'geofence_violation',
              timestamp: new Date().toISOString(),
            };
            setGeofenceAlerts(prev => [alert, ...prev.slice(0, 9)]);
            onGeofenceViolation?.(zone.id, mockLocation);
          }
        }
      });

      onLocationUpdate?.(mockLocation);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval, onLocationUpdate, onGeofenceViolation, hasPermission]);

  const stopTracking = () => {
    setIsTracking(false);
    setConnectionStatus('offline');
  };

  // Utility function to check if point is in polygon
  const isPointInPolygon = (point: LocationData, polygon: Array<{ lat: number; lng: number }>) => {
    // Simplified point-in-polygon check
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lat;
      const yi = polygon[i].lng;
      const xj = polygon[j].lat;
      const yj = polygon[j].lng;

      if (((yi > point.longitude) !== (yj > point.longitude)) &&
          (point.latitude < (xj - xi) * (point.longitude - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    return inside;
  };

  // Auto-start tracking if enabled
  useEffect(() => {
    if (autoStart) {
      const cleanup = startTracking();
      return cleanup;
    }
  }, [autoStart, startTracking]);

  // Format coordinates
  const formatCoordinate = (coord: number, precision = 6) => {
    return coord.toFixed(precision);
  };

  // Format distance
  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  // Format time
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-IN');
  };

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg shadow', className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'p-2 rounded-full',
              isTracking ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-700'
            )}>
              <MapPin className={cn(
                'h-5 w-5',
                isTracking ? 'text-green-600' : 'text-gray-400'
              )} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Location Tracking
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isTracking ? 'Active tracking' : 'Tracking disabled'}
                {touristId && ` • Tourist ${touristId}`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className={cn(
              'flex items-center px-2 py-1 rounded-full text-xs font-medium',
              connectionStatus === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
              connectionStatus === 'poor' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
              'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
            )}>
              {connectionStatus === 'online' ? (
                <Signal className="h-3 w-3 mr-1" />
              ) : connectionStatus === 'poor' ? (
                <Wifi className="h-3 w-3 mr-1" />
              ) : (
                <WifiOff className="h-3 w-3 mr-1" />
              )}
              {connectionStatus}
            </div>

            {hasPermission('manage_tracking') && (
              <div className="flex items-center space-x-1">
                {!isTracking ? (
                  <button
                    onClick={startTracking}
                    className="flex items-center px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={stopTracking}
                    className="flex items-center px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
                  >
                    <Square className="h-3 w-3 mr-1" />
                    Stop
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Location Info */}
      {currentLocation && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <Navigation className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Coordinates
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatCoordinate(currentLocation.latitude)}, {formatCoordinate(currentLocation.longitude)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Compass className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Accuracy
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ±{formatDistance(currentLocation.accuracy)}
                </p>
              </div>
            </div>

            {currentLocation.altitude && (
              <div className="flex items-center space-x-3">
                <Satellite className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Altitude
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round(currentLocation.altitude)}m
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Last Update
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatTime(currentLocation.timestamp)}
                </p>
              </div>
            </div>
          </div>

          {(currentLocation.heading !== undefined || currentLocation.speed !== undefined) && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentLocation.heading !== undefined && (
                  <div className="flex items-center space-x-3">
                    <Compass className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Heading: {Math.round(currentLocation.heading)}°
                      </p>
                    </div>
                  </div>
                )}

                {currentLocation.speed !== undefined && (
                  <div className="flex items-center space-x-3">
                    <Navigation className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Speed: {(currentLocation.speed * 3.6).toFixed(1)} km/h
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Geofence Alerts */}
      {geofenceAlerts.length > 0 && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Recent Geofence Alerts
          </h4>
          <div className="space-y-2">
            {geofenceAlerts.slice(0, 3).map((alert, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {alert.zoneName}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(alert.timestamp).toLocaleTimeString('en-IN')}
                    </p>
                  </div>
                </div>
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tracking Settings */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Tracking Settings
          </h4>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-700"
          >
            {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {showDetails && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Battery className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Battery Optimization
                </span>
              </div>
              <button
                onClick={() => setBatteryOptimized(!batteryOptimized)}
                className={cn(
                  'relative inline-flex h-5 w-9 rounded-full transition-colors',
                  batteryOptimized ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    batteryOptimized ? 'translate-x-4' : 'translate-x-0.5'
                  )}
                  style={{ marginTop: '2px' }}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Tracking Accuracy
                </span>
              </div>
              <select
                value={trackingAccuracy}
                onChange={(e) => setTrackingAccuracy(e.target.value as 'high' | 'medium' | 'low')}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>• Location updates every {updateInterval / 1000} seconds</p>
                <p>• History: {locationHistory.length} points stored</p>
                <p>• Geofences: {GEOFENCE_ZONES.filter(z => z.isActive).length} active zones</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationTracking;
