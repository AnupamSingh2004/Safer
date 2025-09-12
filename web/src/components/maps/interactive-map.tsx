/**
 * Smart Tourist Safety System - Interactive Map
 * Real-time map with React Leaflet integration, tourist tracking, and geofencing
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import React Leaflet components directly without dynamic imports for hooks
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, useMapEvents } from 'react-leaflet';

// Fix for Leaflet default markers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface MapPosition {
  lat: number;
  lng: number;
  zoom: number;
}

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface GeofenceZone {
  id: string;
  name: string;
  coordinates: [number, number][];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  active: boolean;
  alertCount: number;
}

interface TouristMarker {
  id: string;
  name: string;
  position: [number, number];
  status: 'safe' | 'warning' | 'emergency' | 'offline';
  lastSeen: string;
  safetyScore: number;
  digitalId?: string;
}

interface InteractiveMapProps {
  center?: MapPosition;
  height?: string;
  width?: string;
  onMapClick?: (lat: number, lng: number) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
  children?: React.ReactNode;
  className?: string;
  showTourists?: boolean;
  showGeofences?: boolean;
  showHeatmap?: boolean;
  enableClustering?: boolean;
  realTimeUpdates?: boolean;
  emergencyMode?: boolean;
  tourists?: TouristMarker[];
  geofences?: GeofenceZone[];
}

// ============================================================================
// MAP EVENT HANDLER COMPONENT
// ============================================================================

interface MapEventsProps {
  onMapClick?: (lat: number, lng: number) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
}

const MapEvents: React.FC<MapEventsProps> = ({ onMapClick, onBoundsChange }) => {
  const map = useMapEvents({
    click: (e: L.LeafletMouseEvent) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
    moveend: () => {
      if (onBoundsChange) {
        const bounds = map.getBounds();
        onBoundsChange({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest()
        });
      }
    },
    zoomend: () => {
      if (onBoundsChange) {
        const bounds = map.getBounds();
        onBoundsChange({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest()
        });
      }
    }
  });

  return null;
};

// ============================================================================
// MAIN INTERACTIVE MAP COMPONENT
// ============================================================================

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  center = { lat: 25.2744, lng: 91.7322, zoom: 12 }, // Shillong, Meghalaya
  height = '500px',
  width = '100%',
  onMapClick,
  onBoundsChange,
  children,
  className = '',
  showTourists = true,
  showGeofences = true,
  showHeatmap = false,
  enableClustering = true,
  realTimeUpdates = true,
  emergencyMode = false,
  tourists = [],
  geofences = []
}) => {
  const [isClient, setIsClient] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(center);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTourist, setSelectedTourist] = useState<TouristMarker | null>(null);
  const [emergencyAlerts, setEmergencyAlerts] = useState<TouristMarker[]>([]);

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock tourists data for demonstration
  const mockTourists: TouristMarker[] = [
    {
      id: '1',
      name: 'John Doe',
      position: [25.2744, 91.7322],
      status: 'safe',
      lastSeen: new Date().toISOString(),
      safetyScore: 95,
      digitalId: 'TD001'
    },
    {
      id: '2',
      name: 'Jane Smith',
      position: [25.2800, 91.7400],
      status: 'warning',
      lastSeen: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      safetyScore: 72,
      digitalId: 'TD002'
    },
    {
      id: '3',
      name: 'Bob Wilson',
      position: [25.2600, 91.7200],
      status: 'emergency',
      lastSeen: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      safetyScore: 35,
      digitalId: 'TD003'
    }
  ];

  // Mock geofence zones
  const mockGeofences: GeofenceZone[] = [
    {
      id: 'zone1',
      name: 'City Center Safe Zone',
      coordinates: [
        [25.2700, 91.7300],
        [25.2800, 91.7300],
        [25.2800, 91.7400],
        [25.2700, 91.7400]
      ],
      riskLevel: 'low',
      active: true,
      alertCount: 0
    },
    {
      id: 'zone2',
      name: 'Mountain Trail - High Risk',
      coordinates: [
        [25.2500, 91.7100],
        [25.2600, 91.7100],
        [25.2600, 91.7200],
        [25.2500, 91.7200]
      ],
      riskLevel: 'high',
      active: true,
      alertCount: 3
    }
  ];

  // Get marker icon based on tourist status
  const getTouristIcon = (status: TouristMarker['status']) => {
    const colors = {
      safe: '#10b981',
      warning: '#f59e0b',
      emergency: '#ef4444',
      offline: '#6b7280'
    };

    return new L.DivIcon({
      className: 'tourist-marker',
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background-color: ${colors[status]};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">
          ${status === 'safe' ? '✓' : status === 'warning' ? '⚠' : status === 'emergency' ? '🚨' : '●'}
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  // Get zone color based on risk level
  const getZoneColor = (riskLevel: GeofenceZone['riskLevel']) => {
    switch (riskLevel) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#7c3aed';
      default: return '#6b7280';
    }
  };

  // Real-time updates simulation
  useEffect(() => {
    if (!realTimeUpdates) return;

    const interval = setInterval(() => {
      // Update emergency alerts
      const combinedTourists = [...mockTourists, ...tourists];
      const emergencies = combinedTourists.filter(t => t.status === 'emergency');
      setEmergencyAlerts(emergencies);
    }, 5000);

    return () => clearInterval(interval);
  }, [realTimeUpdates, tourists]);

  // Combined data for rendering
  const combinedTourists = [...mockTourists, ...tourists];
  const combinedGeofences = [...mockGeofences, ...geofences];

  // Don't render on server
  if (!isClient) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ height, width }}
      >
        <div className="text-gray-600">Loading map...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <motion.div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ height, width }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <div className="text-gray-600">Loading interactive map...</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`relative rounded-lg overflow-hidden border border-gray-200 ${className}`}
      style={{ height, width }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Emergency Mode Overlay */}
      {emergencyMode && (
        <div className="absolute top-0 left-0 right-0 z-[1000] bg-red-600 text-white px-4 py-2 text-center font-semibold">
          🚨 EMERGENCY MODE ACTIVE - {emergencyAlerts.length} Active Alerts
        </div>
      )}

      <MapContainer
        center={[currentPosition.lat, currentPosition.lng]}
        zoom={currentPosition.zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Map Events Handler */}
        <MapEvents onMapClick={onMapClick} onBoundsChange={onBoundsChange} />

        {/* Geofence Zones */}
        {showGeofences && combinedGeofences.map(zone => (
          <Polygon
            key={zone.id}
            positions={zone.coordinates}
            pathOptions={{
              color: getZoneColor(zone.riskLevel),
              fillColor: getZoneColor(zone.riskLevel),
              fillOpacity: 0.2,
              weight: 2,
              dashArray: zone.active ? undefined : '5, 5'
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">{zone.name}</h3>
                <p className="text-sm text-gray-600">Risk Level: {zone.riskLevel}</p>
                <p className="text-sm text-gray-600">Status: {zone.active ? 'Active' : 'Inactive'}</p>
                <p className="text-sm text-gray-600">Alerts: {zone.alertCount}</p>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Tourist Markers */}
        {showTourists && combinedTourists.map(tourist => (
          <Marker
            key={tourist.id}
            position={tourist.position}
            icon={getTouristIcon(tourist.status)}
            eventHandlers={{
              click: () => setSelectedTourist(tourist)
            }}
          >
            <Popup>
              <div className="p-2 min-w-48">
                <h3 className="font-semibold flex items-center">
                  {tourist.name}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    tourist.status === 'safe' ? 'bg-green-100 text-green-800' :
                    tourist.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    tourist.status === 'emergency' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {tourist.status}
                  </span>
                </h3>
                <div className="mt-2 space-y-1 text-sm">
                  <p><strong>Digital ID:</strong> {tourist.digitalId}</p>
                  <p><strong>Safety Score:</strong> {tourist.safetyScore}%</p>
                  <p><strong>Last Seen:</strong> {new Date(tourist.lastSeen).toLocaleTimeString()}</p>
                  <p><strong>Location:</strong> {tourist.position[0].toFixed(4)}, {tourist.position[1].toFixed(4)}</p>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                    Track
                  </button>
                  <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                    Contact
                  </button>
                  {tourist.status === 'emergency' && (
                    <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                      Respond
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Emergency Circles for urgent alerts */}
        {emergencyMode && emergencyAlerts.map(alert => (
          <Circle
            key={`emergency-${alert.id}`}
            center={alert.position}
            radius={500}
            pathOptions={{
              color: '#ef4444',
              fillColor: '#ef4444',
              fillOpacity: 0.1,
              weight: 2,
              dashArray: '10, 10'
            }}
          />
        ))}

        {children}
      </MapContainer>

      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        {/* Zoom Controls */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <button 
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 border-b border-gray-200"
            onClick={() => setCurrentPosition(prev => ({ ...prev, zoom: Math.min(prev.zoom + 1, 18) }))}
          >
            +
          </button>
          <button 
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
            onClick={() => setCurrentPosition(prev => ({ ...prev, zoom: Math.max(prev.zoom - 1, 1) }))}
          >
            −
          </button>
        </div>

        {/* Layer Toggle */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          <div className="space-y-1">
            <label className="flex items-center text-xs">
              <input 
                type="checkbox" 
                checked={showTourists} 
                onChange={(e) => {}} 
                className="mr-1" 
              />
              Tourists
            </label>
            <label className="flex items-center text-xs">
              <input 
                type="checkbox" 
                checked={showGeofences} 
                onChange={(e) => {}} 
                className="mr-1" 
              />
              Zones
            </label>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2">
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            <span>Safe: {combinedTourists.filter(t => t.status === 'safe').length}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
            <span>Warning: {combinedTourists.filter(t => t.status === 'warning').length}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
            <span>Emergency: {combinedTourists.filter(t => t.status === 'emergency').length}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default InteractiveMap;
export { MapEvents };
export type { 
  InteractiveMapProps, 
  MapPosition, 
  MapBounds, 
  TouristMarker, 
  GeofenceZone 
};
