/**
 * Smart Tourist Safety System - Emergency Services Layer Component
 * Interactive layer for displaying hospitals, police stations, fire departments, and emergency response units
 */

'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { 
  Shield, 
  Heart, 
  Flame, 
  Phone,
  MapPin,
  Navigation,
  Clock,
  Star,
  Filter,
  Eye,
  EyeOff,
  Settings,
  Search,
  Info,
  ExternalLink,
  Zap,
  Car,
  Bed,
  Users,
  AlertTriangle
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface EmergencyService {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'fire' | 'emergency_response' | 'ambulance' | 'rescue';
  position: [number, number];
  address: string;
  phone: string;
  emergencyPhone?: string;
  availability: 'available' | 'busy' | 'offline' | 'emergency_only';
  distance?: number; // from current location in meters
  estimatedResponse?: number; // in minutes
  capacity?: {
    current: number;
    maximum: number;
  };
  services: string[];
  rating: number;
  lastUpdated: string;
  metadata?: {
    beds?: number;
    ambulances?: number;
    helicopters?: number;
    specialties?: string[];
    equipment?: string[];
  };
}

interface EmergencyServicesLayerProps {
  services?: EmergencyService[];
  userLocation?: [number, number];
  emergencyMode?: boolean;
  showDistance?: boolean;
  showCapacity?: boolean;
  autoUpdate?: boolean;
  onServiceSelect?: (service: EmergencyService) => void;
  onEmergencyCall?: (service: EmergencyService) => void;
  className?: string;
}

interface ServiceFilterOptions {
  types: ('police' | 'hospital' | 'fire' | 'emergency_response' | 'ambulance' | 'rescue')[];
  availability: ('available' | 'busy' | 'offline' | 'emergency_only')[];
  maxDistance: number; // in km
  minRating: number;
  showOnlyNearby: boolean;
}

// ============================================================================
// SERVICE ICONS & STYLES
// ============================================================================

const SERVICE_CONFIGS = {
  police: {
    icon: Shield,
    color: '#1e40af',
    bgColor: '#dbeafe',
    emergencyColor: '#1d4ed8',
    label: 'Police Station',
    emoji: '🚔'
  },
  hospital: {
    icon: Heart,
    color: '#dc2626',
    bgColor: '#fee2e2',
    emergencyColor: '#991b1b',
    label: 'Hospital',
    emoji: '🏥'
  },
  fire: {
    icon: Flame,
    color: '#ea580c',
    bgColor: '#fed7aa',
    emergencyColor: '#c2410c',
    label: 'Fire Station',
    emoji: '🚒'
  },
  emergency_response: {
    icon: Zap,
    color: '#7c3aed',
    bgColor: '#ede9fe',
    emergencyColor: '#6d28d9',
    label: 'Emergency Response',
    emoji: '🚨'
  },
  ambulance: {
    icon: Car,
    color: '#059669',
    bgColor: '#d1fae5',
    emergencyColor: '#047857',
    label: 'Ambulance Service',
    emoji: '🚑'
  },
  rescue: {
    icon: Users,
    color: '#b45309',
    bgColor: '#fef3c7',
    emergencyColor: '#92400e',
    label: 'Rescue Team',
    emoji: '⛑️'
  }
};

const AVAILABILITY_STYLES = {
  available: {
    indicator: '#22c55e',
    pulse: true,
    label: 'Available'
  },
  busy: {
    indicator: '#f59e0b',
    pulse: false,
    label: 'Busy'
  },
  offline: {
    indicator: '#6b7280',
    pulse: false,
    label: 'Offline'
  },
  emergency_only: {
    indicator: '#ef4444',
    pulse: true,
    label: 'Emergency Only'
  }
};

// ============================================================================
// MOCK DATA GENERATOR
// ============================================================================

const generateMockServices = (userLocation?: [number, number]): EmergencyService[] => {
  const baseLocation = userLocation || [28.6139, 77.2090]; // Delhi
  
  const services: EmergencyService[] = [
    {
      id: 'police-001',
      name: 'Central Police Station',
      type: 'police',
      position: [baseLocation[0] + 0.005, baseLocation[1] + 0.008],
      address: '123 Main Street, Central District',
      phone: '+91-11-23456789',
      emergencyPhone: '100',
      availability: 'available',
      services: ['Emergency Response', 'Traffic Control', 'Tourist Help'],
      rating: 4.2,
      lastUpdated: new Date().toISOString(),
      metadata: {
        specialties: ['Tourist Safety', 'Emergency Response']
      }
    },
    {
      id: 'hospital-001',
      name: 'City General Hospital',
      type: 'hospital',
      position: [baseLocation[0] - 0.003, baseLocation[1] + 0.012],
      address: '456 Health Avenue, Medical District',
      phone: '+91-11-23456790',
      emergencyPhone: '108',
      availability: 'available',
      services: ['Emergency Medicine', 'Surgery', 'ICU', 'Trauma Care'],
      rating: 4.5,
      lastUpdated: new Date().toISOString(),
      capacity: { current: 145, maximum: 200 },
      metadata: {
        beds: 200,
        ambulances: 8,
        specialties: ['Emergency Medicine', 'Trauma Surgery', 'Cardiology']
      }
    },
    {
      id: 'fire-001',
      name: 'District Fire Station',
      type: 'fire',
      position: [baseLocation[0] + 0.008, baseLocation[1] - 0.005],
      address: '789 Safety Road, Emergency District',
      phone: '+91-11-23456791',
      emergencyPhone: '101',
      availability: 'available',
      services: ['Fire Fighting', 'Rescue Operations', 'Emergency Medical'],
      rating: 4.3,
      lastUpdated: new Date().toISOString(),
      metadata: {
        equipment: ['Fire Trucks', 'Rescue Equipment', 'Medical Kits']
      }
    },
    {
      id: 'ambulance-001',
      name: 'Emergency Ambulance Service',
      type: 'ambulance',
      position: [baseLocation[0] - 0.007, baseLocation[1] - 0.010],
      address: 'Mobile Service - Central Area',
      phone: '+91-11-23456792',
      emergencyPhone: '108',
      availability: 'busy',
      services: ['Emergency Transport', 'Basic Life Support', 'Advanced Life Support'],
      rating: 4.1,
      lastUpdated: new Date().toISOString(),
      metadata: {
        ambulances: 12,
        equipment: ['ALS Equipment', 'BLS Equipment', 'Emergency Medications']
      }
    },
    {
      id: 'rescue-001',
      name: 'Mountain Rescue Team',
      type: 'rescue',
      position: [baseLocation[0] + 0.015, baseLocation[1] + 0.018],
      address: 'Base Camp, Mountain District',
      phone: '+91-11-23456793',
      availability: 'available',
      services: ['Mountain Rescue', 'Search & Rescue', 'Emergency Evacuation'],
      rating: 4.7,
      lastUpdated: new Date().toISOString(),
      metadata: {
        helicopters: 2,
        specialties: ['High Altitude Rescue', 'Cave Rescue', 'Water Rescue']
      }
    }
  ];

  // Calculate distances if user location is provided
  if (userLocation) {
    services.forEach(service => {
      service.distance = calculateDistance(userLocation, service.position);
      service.estimatedResponse = Math.ceil(service.distance / 1000 * 2 + Math.random() * 5); // Rough estimate
    });
  }

  return services;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = point1[0] * Math.PI/180;
  const φ2 = point2[0] * Math.PI/180;
  const Δφ = (point2[0]-point1[0]) * Math.PI/180;
  const Δλ = (point2[1]-point1[1]) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

const formatDistance = (meters: number): string => {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
};

// ============================================================================
// SERVICE FILTER CONTROLS
// ============================================================================

interface ServiceFilterControlsProps {
  filters: ServiceFilterOptions;
  onFiltersChange: (filters: ServiceFilterOptions) => void;
  totalServices: number;
  visibleServices: number;
}

const ServiceFilterControls: React.FC<ServiceFilterControlsProps> = ({
  filters,
  onFiltersChange,
  totalServices,
  visibleServices
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const serviceTypes = Object.entries(SERVICE_CONFIGS).map(([key, config]) => ({
    key: key as keyof typeof SERVICE_CONFIGS,
    ...config
  }));

  return (
    <motion.div
      className="absolute top-4 right-4 z-[1000] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Emergency Services</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {visibleServices} of {totalServices} services
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 transition-colors"
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Service Type Toggle */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {serviceTypes.map((service) => {
            const IconComponent = service.icon;
            const isActive = filters.types.includes(service.key);
            
            return (
              <button
                key={service.key}
                onClick={() => {
                  const newTypes = isActive
                    ? filters.types.filter(t => t !== service.key)
                    : [...filters.types, service.key];
                  onFiltersChange({ ...filters, types: newTypes });
                }}
                className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                  isActive
                    ? `border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300`
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ backgroundColor: service.bgColor, color: service.color }}
                >
                  {service.emoji}
                </div>
                <span className="text-sm font-medium truncate">{service.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4"
          >
            {/* Distance Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Max Distance: {filters.maxDistance}km
              </label>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={filters.maxDistance}
                onChange={(e) => onFiltersChange({ ...filters, maxDistance: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Min Rating: {filters.minRating}⭐
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={filters.minRating}
                onChange={(e) => onFiltersChange({ ...filters, minRating: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            {/* Availability Filters */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Availability</label>
              <div className="space-y-1">
                {Object.entries(AVAILABILITY_STYLES).map(([key, style]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.availability.includes(key as any)}
                      onChange={(e) => {
                        const newAvailability = e.target.checked
                          ? [...filters.availability, key as any]
                          : filters.availability.filter(a => a !== key);
                        onFiltersChange({ ...filters, availability: newAvailability });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-1">
                      <div 
                        className={`w-2 h-2 rounded-full ${style.pulse ? 'animate-pulse' : ''}`}
                        style={{ backgroundColor: style.indicator }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{style.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Nearby Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showOnlyNearby}
                onChange={(e) => onFiltersChange({ ...filters, showOnlyNearby: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Show only nearby services</span>
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================================
// SERVICE INFO PANEL
// ============================================================================

interface ServiceInfoPanelProps {
  service: EmergencyService | null;
  visible: boolean;
  onClose: () => void;
  onCall: () => void;
  onGetDirections: () => void;
}

const ServiceInfoPanel: React.FC<ServiceInfoPanelProps> = ({
  service,
  visible,
  onClose,
  onCall,
  onGetDirections
}) => {
  if (!visible || !service) return null;

  const config = SERVICE_CONFIGS[service.type];
  const availabilityStyle = AVAILABILITY_STYLES[service.availability];
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 300 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 300 }}
      className="absolute bottom-4 left-4 z-[1000] w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: config.bgColor, color: config.color }}
          >
            <IconComponent className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{config.label}</p>
            <div className="flex items-center gap-2 mt-1">
              <div 
                className={`w-2 h-2 rounded-full ${availabilityStyle.pulse ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: availabilityStyle.indicator }}
              />
              <span className="text-xs text-gray-500">{availabilityStyle.label}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 transition-colors"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Basic Info */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{service.address}</span>
          </div>
          
          {service.distance && (
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formatDistance(service.distance)} away
              </span>
              {service.estimatedResponse && (
                <span className="text-sm text-gray-500">
                  • ~{service.estimatedResponse}min response
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {service.rating.toFixed(1)} rating
            </span>
          </div>
        </div>

        {/* Capacity Info */}
        {service.capacity && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Capacity</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {service.capacity.current}/{service.capacity.maximum}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(service.capacity.current / service.capacity.maximum) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Services */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Services</span>
          <div className="flex flex-wrap gap-1">
            {service.services.map((svc, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs"
              >
                {svc}
              </span>
            ))}
          </div>
        </div>

        {/* Metadata */}
        {service.metadata && (
          <div className="space-y-2">
            {service.metadata.beds && (
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {service.metadata.beds} beds available
                </span>
              </div>
            )}
            
            {service.metadata.ambulances && (
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {service.metadata.ambulances} ambulances
                </span>
              </div>
            )}

            {service.metadata.specialties && (
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Specialties</span>
                <div className="flex flex-wrap gap-1">
                  {service.metadata.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={onCall}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm font-medium">
              Call {service.emergencyPhone || service.phone}
            </span>
          </button>
          
          <button
            onClick={onGetDirections}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-gray-500 dark:text-gray-500">
          Last updated: {new Date(service.lastUpdated).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN EMERGENCY SERVICES LAYER COMPONENT
// ============================================================================

export const EmergencyServicesLayer: React.FC<EmergencyServicesLayerProps> = ({
  services: propServices,
  userLocation,
  emergencyMode = false,
  showDistance = true,
  showCapacity = true,
  autoUpdate = true,
  onServiceSelect,
  onEmergencyCall,
  className = ''
}) => {
  const map = useMap();
  const [services, setServices] = useState<EmergencyService[]>(
    propServices || generateMockServices(userLocation)
  );
  const [selectedService, setSelectedService] = useState<EmergencyService | null>(null);
  const [showServiceInfo, setShowServiceInfo] = useState(false);
  const [markersLayer, setMarkersLayer] = useState<L.LayerGroup | null>(null);
  
  const [filters, setFilters] = useState<ServiceFilterOptions>({
    types: ['police', 'hospital', 'fire', 'emergency_response', 'ambulance', 'rescue'],
    availability: ['available', 'busy', 'emergency_only'],
    maxDistance: 20,
    minRating: 1,
    showOnlyNearby: false
  });

  // Filter services based on current filters
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Type filter
      if (!filters.types.includes(service.type)) return false;
      
      // Availability filter
      if (!filters.availability.includes(service.availability)) return false;
      
      // Distance filter
      if (service.distance && service.distance > filters.maxDistance * 1000) return false;
      
      // Rating filter
      if (service.rating < filters.minRating) return false;
      
      // Nearby filter
      if (filters.showOnlyNearby && (!service.distance || service.distance > 5000)) return false;
      
      return true;
    });
  }, [services, filters]);

  // Create custom markers for services
  const createServiceMarker = useCallback((service: EmergencyService): L.Marker => {
    const config = SERVICE_CONFIGS[service.type];
    const availabilityStyle = AVAILABILITY_STYLES[service.availability];
    
    const markerHtml = `
      <div class="emergency-service-marker ${emergencyMode ? 'emergency-mode' : ''}" 
           data-service-type="${service.type}"
           data-availability="${service.availability}">
        <div class="marker-background" style="background-color: ${config.color};">
          <div class="service-emoji">${config.emoji}</div>
          <div class="availability-indicator ${availabilityStyle.pulse ? 'pulse' : ''}"
               style="background-color: ${availabilityStyle.indicator};"></div>
        </div>
        ${service.distance ? `<div class="distance-badge">${formatDistance(service.distance)}</div>` : ''}
      </div>
    `;

    const marker = L.marker([service.position[0], service.position[1]], {
      icon: L.divIcon({
        html: markerHtml,
        className: 'custom-emergency-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
      })
    });

    // Add click handler
    marker.on('click', () => {
      setSelectedService(service);
      setShowServiceInfo(true);
      
      if (onServiceSelect) {
        onServiceSelect(service);
      }
    });

    // Add popup with basic info
    marker.bindPopup(`
      <div class="service-popup">
        <h4>${service.name}</h4>
        <p>${config.label}</p>
        <div class="popup-details">
          <div>📍 ${service.distance ? formatDistance(service.distance) : 'Distance unknown'}</div>
          <div>⭐ ${service.rating.toFixed(1)} rating</div>
          <div>📞 ${service.emergencyPhone || service.phone}</div>
          ${service.estimatedResponse ? `<div>⏱️ ~${service.estimatedResponse}min response</div>` : ''}
        </div>
      </div>
    `);

    return marker;
  }, [emergencyMode, onServiceSelect]);

  // Update markers on map
  useEffect(() => {
    if (markersLayer) {
      map.removeLayer(markersLayer);
    }

    const newMarkersLayer = L.layerGroup();
    
    filteredServices.forEach(service => {
      const marker = createServiceMarker(service);
      newMarkersLayer.addLayer(marker);
    });

    newMarkersLayer.addTo(map);
    setMarkersLayer(newMarkersLayer);

    return () => {
      if (newMarkersLayer) {
        map.removeLayer(newMarkersLayer);
      }
    };
  }, [map, filteredServices, createServiceMarker, markersLayer]);

  // Auto-update services if enabled
  useEffect(() => {
    if (!autoUpdate) return;

    const interval = setInterval(() => {
      // Simulate real-time updates
      setServices(prev => prev.map(service => ({
        ...service,
        availability: Math.random() > 0.8 ? 
          (['available', 'busy', 'emergency_only'] as const)[Math.floor(Math.random() * 3)] : 
          service.availability,
        lastUpdated: new Date().toISOString()
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [autoUpdate]);

  const handleServiceCall = useCallback(() => {
    if (selectedService) {
      const phoneNumber = selectedService.emergencyPhone || selectedService.phone;
      
      if (onEmergencyCall) {
        onEmergencyCall(selectedService);
      }
      
      // In a real app, this would initiate a call
      window.open(`tel:${phoneNumber}`);
    }
  }, [selectedService, onEmergencyCall]);

  const handleGetDirections = useCallback(() => {
    if (selectedService && userLocation) {
      // In a real app, this would open navigation app
      const url = `https://www.google.com/maps/dir/${userLocation[0]},${userLocation[1]}/${selectedService.position[0]},${selectedService.position[1]}`;
      window.open(url, '_blank');
    }
  }, [selectedService, userLocation]);

  return (
    <>
      <ServiceFilterControls
        filters={filters}
        onFiltersChange={setFilters}
        totalServices={services.length}
        visibleServices={filteredServices.length}
      />
      
      <AnimatePresence>
        <ServiceInfoPanel
          service={selectedService}
          visible={showServiceInfo}
          onClose={() => setShowServiceInfo(false)}
          onCall={handleServiceCall}
          onGetDirections={handleGetDirections}
        />
      </AnimatePresence>

      {/* Add custom styles */}
      <style jsx global>{`
        .emergency-service-marker {
          position: relative;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        
        .emergency-service-marker:hover {
          transform: scale(1.1);
        }
        
        .emergency-service-marker.emergency-mode {
          animation: emergency-pulse 1s infinite;
        }
        
        .marker-background {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 3px solid white;
        }
        
        .service-emoji {
          font-size: 18px;
          z-index: 2;
        }
        
        .availability-indicator {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          z-index: 3;
        }
        
        .availability-indicator.pulse {
          animation: pulse-availability 2s infinite;
        }
        
        .distance-badge {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.8);
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 10px;
          white-space: nowrap;
          font-weight: 500;
        }
        
        .service-popup {
          font-family: system-ui, -apple-system, sans-serif;
          min-width: 200px;
        }
        
        .service-popup h4 {
          margin: 0 0 4px 0;
          font-weight: 600;
          color: #374151;
          font-size: 16px;
        }
        
        .service-popup p {
          margin: 0 0 8px 0;
          color: #6b7280;
          font-size: 14px;
        }
        
        .popup-details {
          space-y: 4px;
        }
        
        .popup-details div {
          font-size: 12px;
          color: #6b7280;
          margin: 2px 0;
        }
        
        @keyframes emergency-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes pulse-availability {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default EmergencyServicesLayer;
export type { EmergencyService, EmergencyServicesLayerProps, ServiceFilterOptions };