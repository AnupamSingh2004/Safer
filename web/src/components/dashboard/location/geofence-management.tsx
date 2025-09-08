/**
 * Smart Tourist Safety System - Geofence Management
 * Component for creating, editing, and managing geofence zones
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Map,
  Plus,
  Edit,
  Trash2,
  Shield,
  AlertTriangle,
  MapPin,
  Navigation,
  Eye,
  EyeOff,
  Settings,
  Save,
  RefreshCw,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MoreHorizontal,
  Users,
  Clock,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

const geofenceSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  type: z.enum(['safe', 'restricted', 'emergency', 'tourist_area']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().optional(),
  coordinates: z.array(z.object({
    lat: z.number(),
    lng: z.number(),
  })).min(3, 'At least 3 coordinates required for polygon'),
  radius: z.number().optional(),
  isActive: z.boolean(),
  alertOnEntry: z.boolean(),
  alertOnExit: z.boolean(),
  notificationMessage: z.string().optional(),
});

type GeofenceFormData = z.infer<typeof geofenceSchema>;

interface GeofenceZone {
  id: string;
  name: string;
  type: 'safe' | 'restricted' | 'emergency' | 'tourist_area';
  coordinates: Array<{ lat: number; lng: number }>;
  radius?: number;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  alertOnEntry: boolean;
  alertOnExit: boolean;
  notificationMessage?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName?: string;
  touristsInside: number;
  recentAlerts: number;
}

interface GeofenceManagementProps {
  onZoneCreate?: (zone: GeofenceFormData) => void;
  onZoneUpdate?: (zoneId: string, zone: GeofenceFormData) => void;
  onZoneDelete?: (zoneId: string) => void;
  onZoneToggle?: (zoneId: string, isActive: boolean) => void;
  className?: string;
}

// ============================================================================
// CONSTANTS & MOCK DATA
// ============================================================================

const ZONE_TYPES = [
  {
    value: 'safe',
    label: 'Safe Zone',
    description: 'Designated safe area for tourists',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
  },
  {
    value: 'tourist_area',
    label: 'Tourist Area',
    description: 'Popular tourist destination',
    icon: MapPin,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
  },
  {
    value: 'restricted',
    label: 'Restricted Zone',
    description: 'Area with access restrictions',
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
  },
  {
    value: 'emergency',
    label: 'Emergency Zone',
    description: 'Emergency services area',
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
  },
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
];

const MOCK_GEOFENCE_ZONES: GeofenceZone[] = [
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
    description: 'Main tourist area around India Gate with high security presence',
    alertOnEntry: false,
    alertOnExit: true,
    notificationMessage: 'You are leaving the India Gate safe zone',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T08:30:00Z',
    createdBy: 'admin001',
    createdByName: 'Admin User',
    touristsInside: 45,
    recentAlerts: 2,
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
    description: 'Historical Red Fort area with guided tours and enhanced security',
    alertOnEntry: true,
    alertOnExit: false,
    notificationMessage: 'Welcome to Red Fort! Please follow safety guidelines.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T08:30:00Z',
    createdBy: 'admin001',
    createdByName: 'Admin User',
    touristsInside: 23,
    recentAlerts: 0,
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
    description: 'Military restricted area - unauthorized access prohibited',
    alertOnEntry: true,
    alertOnExit: true,
    notificationMessage: 'RESTRICTED AREA: Immediate exit required',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T08:30:00Z',
    createdBy: 'admin001',
    createdByName: 'Admin User',
    touristsInside: 0,
    recentAlerts: 5,
  },
  {
    id: 'zone-004',
    name: 'Connaught Place Market',
    type: 'tourist_area',
    coordinates: [
      { lat: 28.6304, lng: 77.2177 },
      { lat: 28.6314, lng: 77.2187 },
      { lat: 28.6294, lng: 77.2197 },
      { lat: 28.6284, lng: 77.2182 },
    ],
    isActive: false,
    priority: 'medium',
    description: 'Popular shopping and dining area',
    alertOnEntry: false,
    alertOnExit: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T08:30:00Z',
    createdBy: 'admin001',
    createdByName: 'Admin User',
    touristsInside: 0,
    recentAlerts: 0,
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function GeofenceManagement({
  onZoneCreate,
  onZoneUpdate,
  onZoneDelete,
  onZoneToggle,
  className,
}: GeofenceManagementProps) {
  const { user, hasPermission } = useAuth();
  const [zones, setZones] = useState<GeofenceZone[]>(MOCK_GEOFENCE_ZONES);
  const [selectedZone, setSelectedZone] = useState<GeofenceZone | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<GeofenceFormData>({
    resolver: zodResolver(geofenceSchema),
    defaultValues: {
      isActive: true,
      alertOnEntry: false,
      alertOnExit: false,
      priority: 'medium',
    },
  });

  // Get zone type info
  const getZoneTypeInfo = (type: string) => {
    return ZONE_TYPES.find(t => t.value === type) || ZONE_TYPES[0];
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    const priorityInfo = PRIORITY_LEVELS.find(p => p.value === priority);
    return priorityInfo?.color || PRIORITY_LEVELS[0].color;
  };

  // Filter zones
  const filteredZones = zones.filter(zone => {
    const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zone.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || zone.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && zone.isActive) ||
                         (filterStatus === 'inactive' && !zone.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Handle form submission
  const onSubmit = (data: GeofenceFormData) => {
    if (showEditForm && selectedZone) {
      // Update existing zone
      const updatedZones = zones.map(zone =>
        zone.id === selectedZone.id
          ? { ...zone, ...data, updatedAt: new Date().toISOString() }
          : zone
      );
      setZones(updatedZones);
      onZoneUpdate?.(selectedZone.id, data);
      setShowEditForm(false);
      setSelectedZone(null);
    } else {
      // Create new zone
      const newZone: GeofenceZone = {
        ...data,
        id: `zone-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user?.id || 'unknown',
        createdByName: user?.email || 'Unknown User',
        touristsInside: 0,
        recentAlerts: 0,
      };
      setZones(prev => [newZone, ...prev]);
      onZoneCreate?.(data);
      setShowCreateForm(false);
    }
    reset();
  };

  // Handle zone toggle
  const handleToggleZone = (zoneId: string, isActive: boolean) => {
    const updatedZones = zones.map(zone =>
      zone.id === zoneId ? { ...zone, isActive, updatedAt: new Date().toISOString() } : zone
    );
    setZones(updatedZones);
    onZoneToggle?.(zoneId, isActive);
  };

  // Handle zone deletion
  const handleDeleteZone = (zoneId: string) => {
    if (window.confirm('Are you sure you want to delete this geofence zone?')) {
      setZones(prev => prev.filter(zone => zone.id !== zoneId));
      onZoneDelete?.(zoneId);
    }
  };

  // Handle edit zone
  const handleEditZone = (zone: GeofenceZone) => {
    setSelectedZone(zone);
    reset({
      name: zone.name,
      type: zone.type,
      priority: zone.priority,
      description: zone.description,
      coordinates: zone.coordinates,
      radius: zone.radius,
      isActive: zone.isActive,
      alertOnEntry: zone.alertOnEntry,
      alertOnExit: zone.alertOnExit,
      notificationMessage: zone.notificationMessage,
    });
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Geofence Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage geofence zones for tourist safety monitoring
            </p>
          </div>
          
          {hasPermission('create_geofence') && (
            <button
              onClick={() => {
                setShowCreateForm(true);
                setShowEditForm(false);
                setSelectedZone(null);
                reset();
              }}
              className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Zone
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search zones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              {ZONE_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredZones.map((zone) => {
          const typeInfo = getZoneTypeInfo(zone.type);
          const TypeIcon = typeInfo.icon;
          
          return (
            <div
              key={zone.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              {/* Zone Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={cn('p-2 rounded-full', typeInfo.bgColor)}>
                      <TypeIcon className={cn('h-5 w-5', typeInfo.color)} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {zone.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityColor(zone.priority))}>
                          {zone.priority}
                        </span>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          zone.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        )}>
                          {zone.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {hasPermission('edit_geofence') && (
                      <button
                        onClick={() => handleEditZone(zone)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    
                    {hasPermission('delete_geofence') && (
                      <button
                        onClick={() => handleDeleteZone(zone.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                {zone.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {zone.description}
                  </p>
                )}
                
                {/* Zone Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {zone.touristsInside}
                      </p>
                      <p className="text-xs text-gray-500">Tourists Inside</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {zone.recentAlerts}
                      </p>
                      <p className="text-xs text-gray-500">Recent Alerts</p>
                    </div>
                  </div>
                </div>
                
                {/* Zone Info */}
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center justify-between">
                    <span>Entry Alert:</span>
                    <span>{zone.alertOnEntry ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Exit Alert:</span>
                    <span>{zone.alertOnExit ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Created:</span>
                    <span>{formatDate(zone.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              {/* Zone Actions */}
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 rounded-b-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleZone(zone.id, !zone.isActive)}
                      className={cn(
                        'flex items-center px-3 py-1 text-xs rounded-full font-medium',
                        zone.isActive
                          ? 'text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                          : 'text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                      )}
                      disabled={!hasPermission('toggle_geofence')}
                    >
                      {zone.isActive ? (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Activate
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    ID: {zone.id}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredZones.length === 0 && (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow text-center">
          <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Geofence Zones Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'No zones match your current filters.'
              : 'Create your first geofence zone to start monitoring tourist locations.'}
          </p>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {(showCreateForm || showEditForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {showEditForm ? 'Edit Geofence Zone' : 'Create Geofence Zone'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setShowEditForm(false);
                    setSelectedZone(null);
                    reset();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Zone Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter zone name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Zone Type *
                    </label>
                    <select
                      id="type"
                      {...register('type')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {ZONE_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority *
                    </label>
                    <select
                      id="priority"
                      {...register('priority')}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {PRIORITY_LEVELS.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    {...register('description')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Describe the zone purpose and restrictions"
                  />
                </div>
              </div>

              {/* Alert Settings */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Alert Settings</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="alertOnEntry"
                      {...register('alertOnEntry')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="alertOnEntry" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Alert on Entry
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="alertOnExit"
                      {...register('alertOnExit')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="alertOnExit" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Alert on Exit
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="notificationMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notification Message
                  </label>
                  <input
                    type="text"
                    id="notificationMessage"
                    {...register('notificationMessage')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Message to show when alert is triggered"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    {...register('isActive')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Activate zone immediately
                  </label>
                </div>
              </div>

              {/* Coordinates Placeholder */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Zone Coordinates</h4>
                <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                  <Map className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Interactive map for coordinate selection will be implemented
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    For now, zones use predefined coordinates
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setShowEditForm(false);
                    setSelectedZone(null);
                    reset();
                  }}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValid}
                  className={cn(
                    'flex items-center px-4 py-2 text-sm text-white rounded-md',
                    isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                  )}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {showEditForm ? 'Update Zone' : 'Create Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GeofenceManagement;
