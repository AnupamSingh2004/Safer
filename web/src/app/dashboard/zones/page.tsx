/**
 * Smart Tourist Safety System - Zone Management Page
 * North East India Tourism Safety Zone Monitoring and Management
 * Comprehensive zone oversight for 8 states with role-based access control
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Shield, 
  AlertTriangle,
  Users,
  CheckCircle,
  Clock,
  Activity,
  Settings,
  Eye,
  Plus,
  Search,
  Filter,
  Mountain,
  Trees,
  Camera,
  Compass,
  Waves,
  Sun,
  Cloud,
  Navigation,
  Phone,
  Wifi,
  Zap,
  Map,
  Crown,
  Building2,
  UserCheck,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

type UserRole = 'super_admin' | 'state_admin' | 'district_admin' | 'operator' | 'viewer';
type ZoneType = 'trekking' | 'heritage' | 'wildlife' | 'cultural' | 'adventure' | 'spiritual';
type RiskLevel = 'very_low' | 'low' | 'medium' | 'high' | 'critical';
type ZoneStatus = 'active' | 'monitoring' | 'restricted' | 'emergency' | 'maintenance';

interface ZoneAccess {
  canCreateZones: boolean;
  canEditZones: boolean;
  canDeleteZones: boolean;
  canViewAll: boolean;
  canManageOperators: boolean;
  canExportData: boolean;
  dataScope: 'all_states' | 'single_state' | 'district' | 'zone' | 'read_only';
}

interface NEZone {
  id: string;
  name: string;
  state: string;
  district: string;
  type: ZoneType;
  status: ZoneStatus;
  riskLevel: RiskLevel;
  touristCount: number;
  activeOperators: number;
  lastIncident: string;
  coordinates: string;
  area: string;
  altitude: string;
  weather: string;
  connectivity: 'excellent' | 'good' | 'limited' | 'poor';
  emergencyContact: string;
  lastUpdate: string;
  specialFeatures: string[];
  seasonalAccess: string;
  permitRequired: boolean;
}

// ============================================================================
// ROLE-BASED ACCESS CONTROL
// ============================================================================

function getZoneAccess(role: UserRole): ZoneAccess {
  switch (role) {
    case 'super_admin':
      return {
        canCreateZones: true,
        canEditZones: true,
        canDeleteZones: true,
        canViewAll: true,
        canManageOperators: true,
        canExportData: true,
        dataScope: 'all_states'
      };
    case 'state_admin':
      return {
        canCreateZones: true,
        canEditZones: true,
        canDeleteZones: false,
        canViewAll: true,
        canManageOperators: true,
        canExportData: true,
        dataScope: 'single_state'
      };
    case 'district_admin':
      return {
        canCreateZones: true,
        canEditZones: true,
        canDeleteZones: false,
        canViewAll: false,
        canManageOperators: true,
        canExportData: false,
        dataScope: 'district'
      };
    case 'operator':
      return {
        canCreateZones: false,
        canEditZones: false,
        canDeleteZones: false,
        canViewAll: false,
        canManageOperators: false,
        canExportData: false,
        dataScope: 'zone'
      };
    default: // viewer
      return {
        canCreateZones: false,
        canEditZones: false,
        canDeleteZones: false,
        canViewAll: false,
        canManageOperators: false,
        canExportData: false,
        dataScope: 'read_only'
      };
  }
}

// ============================================================================
// MOCK DATA - NORTH EAST INDIA TOURISM ZONES
// ============================================================================

const NE_ZONES: NEZone[] = [
  {
    id: 'zone-001',
    name: 'Tawang Monastery Circuit',
    state: 'Arunachal Pradesh',
    district: 'Tawang',
    type: 'spiritual',
    status: 'active',
    riskLevel: 'medium',
    touristCount: 145,
    activeOperators: 8,
    lastIncident: '3 days ago',
    coordinates: '27.5851° N, 91.8681° E',
    area: '12.5 km²',
    altitude: '3,048m',
    weather: 'Cold, Clear',
    connectivity: 'limited',
    emergencyContact: '+91-9436-XXX-XXX',
    lastUpdate: '2 minutes ago',
    specialFeatures: ['Ancient Monastery', 'Himalayan Views', 'Buddhist Heritage'],
    seasonalAccess: 'May-October (Best)',
    permitRequired: true
  },
  {
    id: 'zone-002',
    name: 'Living Root Bridges Trail',
    state: 'Meghalaya',
    district: 'East Khasi Hills',
    type: 'trekking',
    status: 'active',
    riskLevel: 'low',
    touristCount: 89,
    activeOperators: 12,
    lastIncident: '1 week ago',
    coordinates: '25.2623° N, 91.5888° E',
    area: '8.3 km²',
    altitude: '1,200m',
    weather: 'Humid, Cloudy',
    connectivity: 'good',
    emergencyContact: '+91-9862-XXX-XXX',
    lastUpdate: '5 minutes ago',
    specialFeatures: ['Natural Bridges', 'Dense Forest', 'Unique Engineering'],
    seasonalAccess: 'Year Round',
    permitRequired: false
  },
  {
    id: 'zone-003',
    name: 'Kaziranga Safari Zone',
    state: 'Assam',
    district: 'Golaghat',
    type: 'wildlife',
    status: 'monitoring',
    riskLevel: 'high',
    touristCount: 267,
    activeOperators: 15,
    lastIncident: '1 day ago',
    coordinates: '26.5775° N, 93.1708° E',
    area: '42.8 km²',
    altitude: '65m',
    weather: 'Warm, Humid',
    connectivity: 'excellent',
    emergencyContact: '+91-9435-XXX-XXX',
    lastUpdate: '1 minute ago',
    specialFeatures: ['Rhino Habitat', 'UNESCO Site', 'River Brahmaputra'],
    seasonalAccess: 'November-April',
    permitRequired: true
  },
  {
    id: 'zone-004',
    name: 'Dzukou Valley Trek',
    state: 'Nagaland',
    district: 'Kohima',
    type: 'trekking',
    status: 'active',
    riskLevel: 'medium',
    touristCount: 78,
    activeOperators: 6,
    lastIncident: '5 days ago',
    coordinates: '25.5630° N, 94.0830° E',
    area: '15.7 km²',
    altitude: '2,438m',
    weather: 'Cool, Windy',
    connectivity: 'poor',
    emergencyContact: '+91-9436-XXX-XXX',
    lastUpdate: '3 minutes ago',
    specialFeatures: ['Valley of Flowers', 'Seasonal Blooms', 'Mountain Views'],
    seasonalAccess: 'June-September',
    permitRequired: true
  },
  {
    id: 'zone-005',
    name: 'Loktak Lake Floating Gardens',
    state: 'Manipur',
    district: 'Bishnupur',
    type: 'cultural',
    status: 'active',
    riskLevel: 'low',
    touristCount: 134,
    activeOperators: 10,
    lastIncident: '2 weeks ago',
    coordinates: '24.5208° N, 93.7792° E',
    area: '28.6 km²',
    altitude: '768m',
    weather: 'Pleasant, Sunny',
    connectivity: 'good',
    emergencyContact: '+91-9856-XXX-XXX',
    lastUpdate: '4 minutes ago',
    specialFeatures: ['Floating Islands', 'Unique Ecosystem', 'Local Culture'],
    seasonalAccess: 'Year Round',
    permitRequired: false
  },
  {
    id: 'zone-006',
    name: 'Blue Mountain Peak',
    state: 'Mizoram',
    district: 'Aizawl',
    type: 'adventure',
    status: 'active',
    riskLevel: 'high',
    touristCount: 43,
    activeOperators: 4,
    lastIncident: '2 days ago',
    coordinates: '23.7271° N, 92.7176° E',
    area: '6.2 km²',
    altitude: '2,157m',
    weather: 'Cool, Misty',
    connectivity: 'limited',
    emergencyContact: '+91-9862-XXX-XXX',
    lastUpdate: '6 minutes ago',
    specialFeatures: ['Highest Peak', 'Adventure Sports', 'Panoramic Views'],
    seasonalAccess: 'October-March',
    permitRequired: true
  }
];

// Zone statistics for North East India
const NE_ZONE_STATS = [
  { 
    label: 'Total Zones', 
    value: '24', 
    icon: MapPin, 
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30'
  },
  { 
    label: 'Active Tourists', 
    value: '756', 
    icon: Users, 
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/30'
  },
  { 
    label: 'High Risk Zones', 
    value: '3', 
    icon: AlertTriangle, 
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30'
  },
  { 
    label: 'System Uptime', 
    value: '99.2%', 
    icon: Activity, 
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/30'
  }
];

// Fake user for demonstration
const useAuth = () => ({
  user: { id: '1', name: 'Admin User', role: 'super_admin' as UserRole }
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getZoneTypeIcon = (type: ZoneType) => {
  switch (type) {
    case 'trekking': return Mountain;
    case 'heritage': return Building2;
    case 'wildlife': return Trees;
    case 'cultural': return Camera;
    case 'adventure': return Compass;
    case 'spiritual': return Sun;
    default: return MapPin;
  }
};

const getStatusInfo = (status: ZoneStatus) => {
  switch (status) {
    case 'active': 
      return { 
        color: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30',
        icon: CheckCircle 
      };
    case 'monitoring': 
      return { 
        color: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30',
        icon: Eye 
      };
    case 'restricted': 
      return { 
        color: 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30',
        icon: Shield 
      };
    case 'emergency': 
      return { 
        color: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30',
        icon: AlertTriangle 
      };
    case 'maintenance': 
      return { 
        color: 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/30',
        icon: Settings 
      };
    default: 
      return { 
        color: 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/30',
        icon: Clock 
      };
  }
};

const getRiskInfo = (risk: RiskLevel) => {
  switch (risk) {
    case 'very_low': 
      return { 
        color: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30',
        label: 'Very Low'
      };
    case 'low': 
      return { 
        color: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30',
        label: 'Low'
      };
    case 'medium': 
      return { 
        color: 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30',
        label: 'Medium'
      };
    case 'high': 
      return { 
        color: 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30',
        label: 'High'
      };
    case 'critical': 
      return { 
        color: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30',
        label: 'Critical'
      };
    default: 
      return { 
        color: 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/30',
        label: 'Unknown'
      };
  }
};

const getConnectivityInfo = (connectivity: 'excellent' | 'good' | 'limited' | 'poor') => {
  switch (connectivity) {
    case 'excellent': 
      return { 
        color: 'text-green-600 dark:text-green-400',
        icon: Wifi,
        label: 'Excellent'
      };
    case 'good': 
      return { 
        color: 'text-blue-600 dark:text-blue-400',
        icon: Wifi,
        label: 'Good'
      };
    case 'limited': 
      return { 
        color: 'text-yellow-600 dark:text-yellow-400',
        icon: Wifi,
        label: 'Limited'
      };
    case 'poor': 
      return { 
        color: 'text-red-600 dark:text-red-400',
        icon: Wifi,
        label: 'Poor'
      };
    default: 
      return { 
        color: 'text-gray-600 dark:text-gray-400',
        icon: Wifi,
        label: 'Unknown'
      };
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ZoneManagementPage = () => {
  const { user } = useAuth();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  
  // Get user role and access permissions
  const userRole = (user?.role as UserRole) || 'viewer';
  const access = getZoneAccess(userRole);
  
  // Filter zones based on search and filters
  const filteredZones = NE_ZONES.filter(zone => {
    const matchesSearch = zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         zone.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         zone.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || zone.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || zone.riskLevel === riskFilter;
    const matchesState = stateFilter === 'all' || zone.state === stateFilter;
    
    return matchesSearch && matchesStatus && matchesRisk && matchesState;
  });

  // Get role display info
  const getRoleInfo = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return { icon: Crown, label: 'Super Admin', color: 'text-purple-600 dark:text-purple-400' };
      case 'state_admin': return { icon: Building2, label: 'State Admin', color: 'text-blue-600 dark:text-blue-400' };
      case 'district_admin': return { icon: UserCheck, label: 'District Admin', color: 'text-green-600 dark:text-green-400' };
      case 'operator': return { icon: Users, label: 'Operator', color: 'text-orange-600 dark:text-orange-400' };
      default: return { icon: Eye, label: 'Viewer', color: 'text-gray-600 dark:text-gray-400' };
    }
  };

  const roleInfo = getRoleInfo(userRole);
  const RoleIcon = roleInfo.icon;

  // Get data scope message
  const getDataScopeMessage = () => {
    switch (access.dataScope) {
      case 'all_states': return 'All 8 North East States';
      case 'single_state': return 'State-level Access';
      case 'district': return 'District-level Access';
      case 'zone': return 'Zone-level Access';
      case 'read_only': return 'Read-only Access';
      default: return 'Limited Access';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Enhanced Header with Role Info */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Map className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  North East Zone Management
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-1">
                  Monitor and manage tourist safety zones across the 8 North Eastern states
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <RoleIcon className={cn('w-4 h-4', roleInfo.color)} />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{roleInfo.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{getDataScopeMessage()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {access.canViewAll && (
                <button className="inline-flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </button>
              )}
              {access.canCreateZones && (
                <button className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Zone
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats with NE India Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {NE_ZONE_STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-between">
                  <div className={cn('p-4 rounded-xl shadow-sm group-hover:scale-110 transition-transform', stat.bg)}>
                    <Icon className={cn('h-7 w-7', stat.color)} />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search zones, states, or districts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              />
            </div>
            
            <select 
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All States</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tripura">Tripura</option>
            </select>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="monitoring">Monitoring</option>
              <option value="restricted">Restricted</option>
              <option value="emergency">Emergency</option>
              <option value="maintenance">Maintenance</option>
            </select>
            
            <select 
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              <option value="very_low">Very Low Risk</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Risk</option>
            </select>
          </div>
        </div>

        {/* Enhanced Zones Grid with NE India Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredZones.map((zone) => {
            const TypeIcon = getZoneTypeIcon(zone.type);
            const statusInfo = getStatusInfo(zone.status);
            const riskInfo = getRiskInfo(zone.riskLevel);
            const connectivityInfo = getConnectivityInfo(zone.connectivity);
            const StatusIcon = statusInfo.icon;
            const ConnectivityIcon = connectivityInfo.icon;

            return (
              <div key={zone.id} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                {/* Zone Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                      <TypeIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{zone.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{zone.state}</span>
                        <span>•</span>
                        <span>{zone.district}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{zone.coordinates}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <StatusIcon className="w-4 h-4" />
                      <span className={cn('px-3 py-1 text-xs font-semibold rounded-full', statusInfo.color)}>
                        {zone.status}
                      </span>
                    </div>
                    <span className={cn('px-3 py-1 text-xs font-semibold rounded-full', riskInfo.color)}>
                      {riskInfo.label} Risk
                    </span>
                  </div>
                </div>

                {/* Zone Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{zone.touristCount}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Tourists</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{zone.activeOperators}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Operators</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{zone.area}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Coverage</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{zone.altitude}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Altitude</div>
                  </div>
                </div>

                {/* Zone Features */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Special Features</h4>
                    <div className="flex items-center space-x-2">
                      <ConnectivityIcon className={cn('w-4 h-4', connectivityInfo.color)} />
                      <span className={cn('text-xs font-medium', connectivityInfo.color)}>
                        {connectivityInfo.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {zone.specialFeatures.map((feature, index) => (
                      <span key={index} className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Zone Information */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Weather:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{zone.weather}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Season:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{zone.seasonalAccess}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Last Incident:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{zone.lastIncident}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 dark:text-gray-400">Permit:</span>
                    {zone.permitRequired ? (
                      <CheckCircle className="w-4 h-4 ml-2 text-green-600 dark:text-green-400" />
                    ) : (
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">Not Required</span>
                    )}
                  </div>
                </div>

                {/* Zone Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    Updated {zone.lastUpdate}
                  </div>
                  <div className="flex items-center space-x-3">
                    {access.canViewAll && (
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {access.canEditZones && (
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Zone Map with NE India Context */}
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Navigation className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" />
              North East India Tourism Zone Coverage
            </h3>
            {access.canExportData && (
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                <Map className="w-4 h-4 mr-2" />
                Export Map Data
              </button>
            )}
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-700 dark:to-gray-600 rounded-xl h-80 flex items-center justify-center border-2 border-dashed border-blue-300 dark:border-gray-500">
            <div className="text-center">
              <div className="mb-4">
                <Map className="w-20 h-20 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <Mountain className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto -mt-8 ml-8" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Interactive Tourism Zone Map
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                Comprehensive view of all {filteredZones.length} zones across the 8 North Eastern states with real-time status monitoring
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Active Zones
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  Monitoring
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  High Risk
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ZoneManagementPage;