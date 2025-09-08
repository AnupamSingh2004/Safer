/**
 * Smart Tourist Safety System - Nearby Services
 * Component for displaying and managing nearby emergency services and facilities
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  Star,
  Filter,
  RefreshCw,
  Search,
  ExternalLink,
  Shield,
  Heart,
  Car,
  Home,
  Coffee,
  ShoppingBag,
  Camera,
  Utensils,
  Fuel,
  Building,
  AlertTriangle,
  CheckCircle,
  Info,
  Route,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface NearbyService {
  id: string;
  name: string;
  type: 'emergency' | 'medical' | 'police' | 'hotel' | 'restaurant' | 'attraction' | 'transport' | 'fuel' | 'shopping' | 'bank';
  category: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  distance: number; // in meters
  rating?: number;
  reviewCount?: number;
  phone?: string;
  website?: string;
  hours?: {
    open: string;
    close: string;
    isOpen: boolean;
  };
  description?: string;
  amenities?: string[];
  emergencyService?: boolean;
  verified?: boolean;
  lastUpdated: string;
}

interface NearbyServicesProps {
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  searchRadius?: number; // in meters
  onServiceSelect?: (service: NearbyService) => void;
  onGetDirections?: (service: NearbyService) => void;
  className?: string;
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const SERVICE_TYPES = [
  { value: 'all', label: 'All Services', icon: MapPin, color: 'text-gray-600' },
  { value: 'emergency', label: 'Emergency', icon: AlertTriangle, color: 'text-red-600' },
  { value: 'medical', label: 'Medical', icon: Heart, color: 'text-red-600' },
  { value: 'police', label: 'Police', icon: Shield, color: 'text-blue-600' },
  { value: 'hotel', label: 'Hotels', icon: Home, color: 'text-purple-600' },
  { value: 'restaurant', label: 'Restaurants', icon: Utensils, color: 'text-orange-600' },
  { value: 'attraction', label: 'Attractions', icon: Camera, color: 'text-green-600' },
  { value: 'transport', label: 'Transport', icon: Car, color: 'text-blue-600' },
  { value: 'fuel', label: 'Fuel Stations', icon: Fuel, color: 'text-yellow-600' },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'text-pink-600' },
  { value: 'bank', label: 'Banks/ATMs', icon: Building, color: 'text-gray-600' },
];

const MOCK_NEARBY_SERVICES: NearbyService[] = [
  {
    id: 'service-001',
    name: 'All India Institute of Medical Sciences (AIIMS)',
    type: 'medical',
    category: 'Government Hospital',
    location: {
      latitude: 28.5672,
      longitude: 77.2100,
      address: 'Ansari Nagar, New Delhi, Delhi 110029',
    },
    distance: 1200,
    rating: 4.2,
    reviewCount: 8234,
    phone: '+91-11-26588500',
    website: 'https://www.aiims.edu',
    hours: {
      open: '24 hours',
      close: '24 hours',
      isOpen: true,
    },
    description: 'Premier medical institute with emergency services',
    amenities: ['24/7 Emergency', 'Trauma Center', 'ICU', 'Pharmacy'],
    emergencyService: true,
    verified: true,
    lastUpdated: '2024-01-16T10:00:00Z',
  },
  {
    id: 'service-002',
    name: 'Parliament Street Police Station',
    type: 'police',
    category: 'Police Station',
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'Parliament Street, New Delhi, Delhi 110001',
    },
    distance: 800,
    phone: '+91-11-23366100',
    hours: {
      open: '24 hours',
      close: '24 hours',
      isOpen: true,
    },
    description: 'Central Delhi police station with tourist helpdesk',
    amenities: ['Tourist Helpdesk', '24/7 Service', 'Women Cell'],
    emergencyService: true,
    verified: true,
    lastUpdated: '2024-01-16T10:00:00Z',
  },
  {
    id: 'service-003',
    name: 'The Imperial New Delhi',
    type: 'hotel',
    category: '5-Star Hotel',
    location: {
      latitude: 28.6304,
      longitude: 77.2177,
      address: 'Janpath, Connaught Place, New Delhi, Delhi 110001',
    },
    distance: 600,
    rating: 4.6,
    reviewCount: 3421,
    phone: '+91-11-23342255',
    website: 'https://www.imperialhotels.in',
    hours: {
      open: '24 hours',
      close: '24 hours',
      isOpen: true,
    },
    description: 'Luxury heritage hotel in the heart of Delhi',
    amenities: ['Concierge', 'Restaurant', 'Spa', 'Business Center'],
    verified: true,
    lastUpdated: '2024-01-16T09:30:00Z',
  },
  {
    id: 'service-004',
    name: 'India Gate Fire Station',
    type: 'emergency',
    category: 'Fire Department',
    location: {
      latitude: 28.6129,
      longitude: 77.2295,
      address: 'India Gate, New Delhi, Delhi 110003',
    },
    distance: 200,
    phone: '+91-11-101',
    hours: {
      open: '24 hours',
      close: '24 hours',
      isOpen: true,
    },
    description: 'Emergency fire and rescue services',
    amenities: ['Fire Rescue', 'Emergency Medical', 'Disaster Response'],
    emergencyService: true,
    verified: true,
    lastUpdated: '2024-01-16T10:00:00Z',
  },
  {
    id: 'service-005',
    name: 'Karim\'s Restaurant',
    type: 'restaurant',
    category: 'Mughlai Cuisine',
    location: {
      latitude: 28.6562,
      longitude: 77.2410,
      address: 'Gali Kababian, Jama Masjid, New Delhi, Delhi 110006',
    },
    distance: 2800,
    rating: 4.1,
    reviewCount: 12456,
    phone: '+91-11-23264981',
    hours: {
      open: '07:00',
      close: '23:00',
      isOpen: true,
    },
    description: 'Historic restaurant serving authentic Mughlai cuisine since 1913',
    amenities: ['AC Dining', 'Takeaway', 'Traditional Food'],
    verified: true,
    lastUpdated: '2024-01-16T08:00:00Z',
  },
  {
    id: 'service-006',
    name: 'Red Fort',
    type: 'attraction',
    category: 'Historical Monument',
    location: {
      latitude: 28.6562,
      longitude: 77.2410,
      address: 'Netaji Subhash Marg, Lal Qila, New Delhi, Delhi 110006',
    },
    distance: 2800,
    rating: 4.3,
    reviewCount: 45673,
    phone: '+91-11-23277705',
    website: 'https://www.asi.nic.in',
    hours: {
      open: '09:30',
      close: '16:30',
      isOpen: false,
    },
    description: 'UNESCO World Heritage Site and iconic Mughal fortress',
    amenities: ['Guided Tours', 'Museum', 'Audio Guide', 'Souvenir Shop'],
    verified: true,
    lastUpdated: '2024-01-16T07:00:00Z',
  },
  {
    id: 'service-007',
    name: 'Rajiv Chowk Metro Station',
    type: 'transport',
    category: 'Metro Station',
    location: {
      latitude: 28.6328,
      longitude: 77.2197,
      address: 'Connaught Place, New Delhi, Delhi 110001',
    },
    distance: 900,
    rating: 4.0,
    reviewCount: 8901,
    hours: {
      open: '05:00',
      close: '23:00',
      isOpen: true,
    },
    description: 'Major metro interchange station serving multiple lines',
    amenities: ['Blue Line', 'Yellow Line', 'Escalators', 'Lift Access'],
    verified: true,
    lastUpdated: '2024-01-16T06:00:00Z',
  },
  {
    id: 'service-008',
    name: 'State Bank ATM - Connaught Place',
    type: 'bank',
    category: 'ATM',
    location: {
      latitude: 28.6315,
      longitude: 77.2167,
      address: 'A Block, Connaught Place, New Delhi, Delhi 110001',
    },
    distance: 750,
    hours: {
      open: '24 hours',
      close: '24 hours',
      isOpen: true,
    },
    description: 'State Bank of India ATM with multi-currency support',
    amenities: ['24/7 Access', 'Multi-currency', 'Cash Deposit'],
    verified: true,
    lastUpdated: '2024-01-16T05:00:00Z',
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function NearbyServices({
  userLocation = { latitude: 28.6129, longitude: 77.2295 }, // Default to India Gate
  searchRadius = 5000, // 5km default
  onServiceSelect,
  onGetDirections,
  className,
}: NearbyServicesProps) {
  const { hasPermission } = useAuth();
  const [services, setServices] = useState<NearbyService[]>(MOCK_NEARBY_SERVICES);
  const [filteredServices, setFilteredServices] = useState<NearbyService[]>(MOCK_NEARBY_SERVICES);
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<NearbyService | null>(null);

  // Filter and sort services
  useEffect(() => {
    let filtered = services.filter(service => {
      const matchesType = selectedType === 'all' || service.type === selectedType;
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEmergency = !showEmergencyOnly || service.emergencyService;
      const withinRadius = service.distance <= searchRadius;
      
      return matchesType && matchesSearch && matchesEmergency && withinRadius;
    });

    // Sort services
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredServices(filtered);
  }, [services, selectedType, searchTerm, sortBy, showEmergencyOnly, searchRadius]);

  // Format distance
  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  // Format hours
  const formatHours = (hours: NearbyService['hours']) => {
    if (!hours) return 'Hours not available';
    if (hours.open === '24 hours') return '24 hours';
    return `${hours.open} - ${hours.close}`;
  };

  // Get service type info
  const getServiceTypeInfo = (type: string) => {
    return SERVICE_TYPES.find(t => t.value === type) || SERVICE_TYPES[0];
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  // Handle service selection
  const handleServiceClick = (service: NearbyService) => {
    setSelectedService(service);
    onServiceSelect?.(service);
  };

  // Handle get directions
  const handleGetDirections = (service: NearbyService) => {
    onGetDirections?.(service);
    // In a real app, this would open maps app or navigation
    console.log('Getting directions to:', service.name);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Nearby Services
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Emergency services and facilities within {formatDistance(searchRadius)}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', isLoading && 'animate-spin')} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating' | 'name')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="distance">Sort by Distance</option>
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort by Name</option>
              </select>
              
              <button
                onClick={() => setShowEmergencyOnly(!showEmergencyOnly)}
                className={cn(
                  'flex items-center px-3 py-2 text-sm rounded-md',
                  showEmergencyOnly
                    ? 'text-white bg-red-600 hover:bg-red-700'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Emergency Only
              </button>
            </div>
          </div>

          {/* Service Type Filters */}
          <div className="flex flex-wrap gap-2">
            {SERVICE_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.value;
              
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm rounded-full transition-colors',
                    isSelected
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  )}
                >
                  <Icon className={cn('h-4 w-4 mr-1', isSelected ? 'text-blue-600' : type.color)} />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {filteredServices.map((service) => {
          const typeInfo = getServiceTypeInfo(service.type);
          const Icon = typeInfo.icon;
          
          return (
            <div
              key={service.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleServiceClick(service)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={cn(
                    'p-3 rounded-full',
                    service.emergencyService ? 'bg-red-100 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-gray-700'
                  )}>
                    <Icon className={cn(
                      'h-6 w-6',
                      service.emergencyService ? 'text-red-600' : typeInfo.color
                    )} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {service.name}
                      </h3>
                      {service.verified && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {service.emergencyService && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-full">
                          Emergency
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {formatDistance(service.distance)}
                      </div>
                      
                      {service.rating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          {service.rating.toFixed(1)} ({service.reviewCount?.toLocaleString()})
                        </div>
                      )}
                      
                      {service.hours && (
                        <div className={cn(
                          'flex items-center',
                          service.hours.isOpen ? 'text-green-600' : 'text-red-600'
                        )}>
                          <Clock className="h-4 w-4 mr-1" />
                          {service.hours.isOpen ? 'Open' : 'Closed'} • {formatHours(service.hours)}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {service.description}
                    </p>
                    
                    <div className="text-sm text-gray-500 mb-2">
                      <span className="font-medium">{service.category}</span> • {service.location.address}
                    </div>
                    
                    {service.amenities && service.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {service.amenities.slice(0, 4).map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded"
                          >
                            {amenity}
                          </span>
                        ))}
                        {service.amenities.length > 4 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded">
                            +{service.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  {service.phone && (
                    <a
                      href={`tel:${service.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 hover:border-blue-400 rounded-md"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </a>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGetDirections(service);
                    }}
                    className="flex items-center px-3 py-2 text-sm text-green-600 hover:text-green-700 border border-green-300 hover:border-green-400 rounded-md"
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Directions
                  </button>
                  
                  {service.website && (
                    <a
                      href={service.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-700 border border-gray-300 hover:border-gray-400 rounded-md"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Services Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || selectedType !== 'all' || showEmergencyOnly
              ? 'No services match your current filters.'
              : 'No services found in your area.'}
          </p>
        </div>
      )}

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedService.name}
                </h3>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Eye className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Type:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{selectedService.category}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Distance:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{formatDistance(selectedService.distance)}</span>
                  </div>
                  {selectedService.rating && (
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Rating:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {selectedService.rating.toFixed(1)}/5 ({selectedService.reviewCount} reviews)
                      </span>
                    </div>
                  )}
                  {selectedService.hours && (
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Hours:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{formatHours(selectedService.hours)}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Address:</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedService.location.address}</p>
                </div>
                
                {selectedService.description && (
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Description:</span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedService.description}</p>
                  </div>
                )}
                
                {selectedService.amenities && selectedService.amenities.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Amenities:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedService.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {selectedService.phone && (
                    <a
                      href={`tel:${selectedService.phone}`}
                      className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </a>
                  )}
                  
                  <button
                    onClick={() => handleGetDirections(selectedService)}
                    className="flex items-center px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded-md"
                  >
                    <Route className="h-4 w-4 mr-2" />
                    Get Directions
                  </button>
                  
                  {selectedService.website && (
                    <a
                      href={selectedService.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NearbyServices;
