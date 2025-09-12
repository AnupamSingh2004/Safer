'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Save, 
  Plus, 
  X, 
  AlertTriangle,
  Shield,
  Eye,
  EyeOff,
  Navigation,
  Clock,
  Users,
  Settings,
  Info,
  Zap,
  Camera,
  Upload,
  CheckCircle,
  Circle
} from 'lucide-react';
import { LoadingButton } from '@/components/common/loading';

interface ZoneFormData {
  // Basic Information
  name: string;
  description: string;
  type: 'geofence' | 'poi' | 'restricted' | 'safe' | 'tourist_spot' | 'emergency' | 'monitoring';
  category: string;
  subcategory?: string;
  
  // Risk Assessment
  riskLevel: 1 | 2 | 3 | 4 | 5;
  riskFactors: string[];
  safetyMeasures: string[];
  
  // Geographic Information
  geometry: {
    type: 'Point' | 'Polygon' | 'Circle';
    coordinates: number[][];
    radius?: number; // For circles, in meters
    area?: number; // Calculated area for polygons
  };
  address?: string;
  landmarks: string[];
  
  // Visual Properties
  properties: {
    strokeColor: string;
    fillColor: string;
    strokeWidth: number;
    opacity: number;
    fillOpacity: number;
    zIndex: number;
  };
  
  // Zone Rules & Triggers
  rules: Array<{
    id: string;
    type: 'entry_alert' | 'exit_alert' | 'time_limit' | 'group_size_limit' | 'custom';
    condition: string;
    action: string;
    severity: 'info' | 'warning' | 'alert' | 'emergency';
    isActive: boolean;
    schedule?: {
      enabled: boolean;
      startTime: string;
      endTime: string;
      days: string[];
    };
  }>;
  
  // Capacity & Limits
  capacity: {
    maxOccupancy?: number;
    recommendedGroupSize?: number;
    timeLimit?: number; // minutes
    ageRestrictions?: {
      minAge?: number;
      maxAge?: number;
      requiresGuardian: boolean;
    };
  };
  
  // Zone Information
  facilities: string[];
  services: string[];
  emergencyServices: {
    nearest: Array<{
      type: 'police' | 'medical' | 'fire' | 'rescue';
      name: string;
      contact: string;
      distance: number; // meters
      responseTime: number; // minutes
    }>;
  };
  
  // Operating Information
  operatingHours: {
    enabled: boolean;
    schedule: Array<{
      day: string;
      open: string;
      close: string;
      is24Hours: boolean;
    }>;
    seasonalChanges?: {
      summer?: { open: string; close: string };
      winter?: { open: string; close: string };
    };
  };
  
  // Contact Information
  contactInfo: {
    manager?: string;
    phone?: string;
    email?: string;
    emergencyContact?: string;
    website?: string;
  };
  
  // Media & Documentation
  images: Array<{
    id: string;
    file?: File;
    url?: string;
    caption?: string;
    type: 'overview' | 'safety' | 'facility' | 'warning';
  }>;
  documents: Array<{
    id: string;
    file?: File;
    url?: string;
    name: string;
    type: 'safety_protocol' | 'emergency_plan' | 'regulations' | 'map';
  }>;
  
  // System Settings
  isActive: boolean;
  isPublic: boolean;
  requiresPermission: boolean;
  monitoringEnabled: boolean;
  alertsEnabled: boolean;
  
  // Metadata
  tags: string[];
  notes: string;
  lastUpdated?: string;
  updatedBy?: string;
}

interface ZoneFormProps {
  initialData?: Partial<ZoneFormData>;
  mode: 'create' | 'edit';
  onSubmit: (data: ZoneFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

const zoneTypeOptions = [
  { value: 'safe', label: 'Safe Zone', color: 'green', icon: Shield, description: 'Designated safe area for tourists' },
  { value: 'tourist_spot', label: 'Tourist Attraction', color: 'blue', icon: Camera, description: 'Popular tourist destination' },
  { value: 'restricted', label: 'Restricted Area', color: 'red', icon: AlertTriangle, description: 'Access limited or prohibited' },
  { value: 'monitoring', label: 'Monitoring Zone', color: 'purple', icon: Eye, description: 'Area under surveillance' },
  { value: 'emergency', label: 'Emergency Zone', color: 'orange', icon: Zap, description: 'Emergency assembly point' },
  { value: 'poi', label: 'Point of Interest', color: 'yellow', icon: MapPin, description: 'Notable location or landmark' },
  { value: 'geofence', label: 'Geofence', color: 'gray', icon: Circle, description: 'Virtual boundary for alerts' },
];

const riskLevelOptions = [
  { value: 1, label: 'Very Low Risk', color: 'green', description: 'Minimal safety concerns' },
  { value: 2, label: 'Low Risk', color: 'blue', description: 'Basic precautions needed' },
  { value: 3, label: 'Moderate Risk', color: 'yellow', description: 'Caution and awareness required' },
  { value: 4, label: 'High Risk', color: 'orange', description: 'Significant safety measures needed' },
  { value: 5, label: 'Very High Risk', color: 'red', description: 'Extreme caution or restricted access' },
];

const defaultFormData: ZoneFormData = {
  name: '',
  description: '',
  type: 'tourist_spot',
  category: '',
  riskLevel: 2,
  riskFactors: [],
  safetyMeasures: [],
  geometry: {
    type: 'Circle',
    coordinates: [[0, 0]],
    radius: 100,
  },
  landmarks: [],
  properties: {
    strokeColor: '#3B82F6',
    fillColor: '#3B82F6',
    strokeWidth: 2,
    opacity: 1,
    fillOpacity: 0.2,
    zIndex: 1,
  },
  rules: [],
  capacity: {},
  facilities: [],
  services: [],
  emergencyServices: { nearest: [] },
  operatingHours: {
    enabled: false,
    schedule: [],
  },
  contactInfo: {},
  images: [],
  documents: [],
  isActive: true,
  isPublic: true,
  requiresPermission: false,
  monitoringEnabled: true,
  alertsEnabled: true,
  tags: [],
  notes: '',
};

export const ZoneForm: React.FC<ZoneFormProps> = ({
  initialData,
  mode,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<ZoneFormData>({
    ...defaultFormData,
    ...initialData,
  });
  
  const [activeTab, setActiveTab] = useState<'basic' | 'geography' | 'rules' | 'settings' | 'media'>('basic');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDrawing, setIsDrawing] = useState(false);

  const updateFormData = (updates: Partial<ZoneFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Get current location for geometry
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateFormData({
            geometry: {
              ...formData.geometry,
              coordinates: [[position.coords.longitude, position.coords.latitude]]
            }
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // Add rule
  const addRule = () => {
    const newRule = {
      id: Date.now().toString(),
      type: 'entry_alert' as const,
      condition: '',
      action: '',
      severity: 'warning' as const,
      isActive: true,
    };
    updateFormData({
      rules: [...formData.rules, newRule],
    });
  };

  // Remove rule
  const removeRule = (id: string) => {
    updateFormData({
      rules: formData.rules.filter(rule => rule.id !== id),
    });
  };

  // Update rule
  const updateRule = (id: string, updates: Partial<ZoneFormData['rules'][0]>) => {
    updateFormData({
      rules: formData.rules.map(rule =>
        rule.id === id ? { ...rule, ...updates } : rule
      ),
    });
  };

  // Add image
  const addImage = () => {
    const newImage = {
      id: Date.now().toString(),
      type: 'overview' as const,
      caption: '',
    };
    updateFormData({
      images: [...formData.images, newImage],
    });
  };

  // Remove image
  const removeImage = (id: string) => {
    updateFormData({
      images: formData.images.filter(img => img.id !== id),
    });
  };

  // Add tag
  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      updateFormData({
        tags: [...formData.tags, tag.trim()],
      });
    }
  };

  // Remove tag
  const removeTag = (tag: string) => {
    updateFormData({
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Zone name is required';
    if (!formData.description.trim()) newErrors.description = 'Zone description is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    
    if (formData.geometry.coordinates.length === 0) {
      newErrors.geometry = 'Zone location/boundary is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  const selectedZoneType = zoneTypeOptions.find(option => option.value === formData.type);
  const selectedRiskLevel = riskLevelOptions.find(option => option.value === formData.riskLevel);

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Info },
    { id: 'geography', label: 'Geography', icon: MapPin },
    { id: 'rules', label: 'Rules & Alerts', icon: AlertTriangle },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'media', label: 'Media', icon: Camera },
  ];

  // Basic Information Tab
  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zone Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter zone name"
          />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => updateFormData({ category: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="e.g., Historical Site, Beach, Mall"
          />
          {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Provide detailed description of the zone, its purpose, and key features..."
        />
        {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* Zone Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Zone Type *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {zoneTypeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.type === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFormData({ type: option.value as any })}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? `border-${option.color}-500 bg-${option.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className={`h-5 w-5 ${
                    isSelected ? `text-${option.color}-600` : 'text-gray-500'
                  }`} />
                  <span className={`font-medium ${
                    isSelected ? `text-${option.color}-800` : 'text-gray-700'
                  }`}>
                    {option.label}
                  </span>
                </div>
                <p className={`text-xs ${
                  isSelected ? `text-${option.color}-600` : 'text-gray-500'
                }`}>
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Risk Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Risk Level Assessment *
        </label>
        <div className="space-y-2">
          {riskLevelOptions.map((option) => {
            const isSelected = formData.riskLevel === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFormData({ riskLevel: option.value as any })}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? `border-${option.color}-500 bg-${option.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`font-medium ${
                      isSelected ? `text-${option.color}-800` : 'text-gray-700'
                    }`}>
                      Level {option.value}: {option.label}
                    </span>
                    <p className={`text-xs mt-1 ${
                      isSelected ? `text-${option.color}-600` : 'text-gray-500'
                    }`}>
                      {option.description}
                    </p>
                  </div>
                  {isSelected && (
                    <CheckCircle className={`h-5 w-5 text-${option.color}-600`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Manager/Contact Person
          </label>
          <input
            type="text"
            value={formData.contactInfo.manager || ''}
            onChange={(e) => updateFormData({
              contactInfo: { ...formData.contactInfo, manager: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Zone manager or contact person"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Phone
          </label>
          <input
            type="tel"
            value={formData.contactInfo.phone || ''}
            onChange={(e) => updateFormData({
              contactInfo: { ...formData.contactInfo, phone: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="+91 98765 43210"
          />
        </div>
      </div>
    </div>
  );

  // Geography Tab
  const renderGeography = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <h4 className="font-medium text-blue-900">Zone Boundary Definition</h4>
        </div>
        <p className="text-sm text-blue-700">
          Define the geographic boundary of this zone. You can create a point, circle, or polygon boundary.
        </p>
      </div>

      {/* Geometry Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Boundary Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'Point', label: 'Point Location', description: 'Single coordinate point' },
            { value: 'Circle', label: 'Circular Area', description: 'Point with radius' },
            { value: 'Polygon', label: 'Custom Boundary', description: 'Multiple coordinates' },
          ].map((option) => {
            const isSelected = formData.geometry.type === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFormData({
                  geometry: { ...formData.geometry, type: option.value as any }
                })}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`font-medium ${
                  isSelected ? 'text-blue-800' : 'text-gray-700'
                }`}>
                  {option.label}
                </div>
                <div className={`text-xs mt-1 ${
                  isSelected ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {option.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Coordinates */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Coordinates
          </label>
          <button
            type="button"
            onClick={getCurrentLocation}
            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
          >
            <Navigation className="h-4 w-4" />
            Use Current Location
          </button>
        </div>

        {formData.geometry.coordinates.map((coord, index) => (
          <div key={index} className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={coord[0] || ''}
                onChange={(e) => {
                  const newCoords = [...formData.geometry.coordinates];
                  newCoords[index] = [parseFloat(e.target.value) || 0, coord[1] || 0];
                  updateFormData({
                    geometry: { ...formData.geometry, coordinates: newCoords }
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                placeholder="Longitude"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={coord[1] || ''}
                onChange={(e) => {
                  const newCoords = [...formData.geometry.coordinates];
                  newCoords[index] = [coord[0] || 0, parseFloat(e.target.value) || 0];
                  updateFormData({
                    geometry: { ...formData.geometry, coordinates: newCoords }
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                placeholder="Latitude"
              />
            </div>
          </div>
        ))}

        {formData.geometry.type === 'Circle' && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Radius (meters)
            </label>
            <input
              type="number"
              value={formData.geometry.radius || ''}
              onChange={(e) => updateFormData({
                geometry: { ...formData.geometry, radius: parseInt(e.target.value) || undefined }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter radius in meters"
            />
          </div>
        )}
      </div>

      {/* Address & Landmarks */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address / Location Description
        </label>
        <textarea
          value={formData.address || ''}
          onChange={(e) => updateFormData({ address: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Provide address and location description..."
        />
      </div>

      {/* Visual Properties */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Visual Appearance</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stroke Color
            </label>
            <input
              type="color"
              value={formData.properties.strokeColor}
              onChange={(e) => updateFormData({
                properties: { ...formData.properties, strokeColor: e.target.value }
              })}
              className="w-full h-10 border border-gray-300 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fill Color
            </label>
            <input
              type="color"
              value={formData.properties.fillColor}
              onChange={(e) => updateFormData({
                properties: { ...formData.properties, fillColor: e.target.value }
              })}
              className="w-full h-10 border border-gray-300 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stroke Width
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.properties.strokeWidth}
              onChange={(e) => updateFormData({
                properties: { ...formData.properties, strokeWidth: parseInt(e.target.value) || 1 }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opacity
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={formData.properties.opacity}
              onChange={(e) => updateFormData({
                properties: { ...formData.properties, opacity: parseFloat(e.target.value) }
              })}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Rules & Alerts Tab
  const renderRules = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Zone Rules & Alert Triggers</h4>
        <button
          type="button"
          onClick={addRule}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Rule
        </button>
      </div>

      {formData.rules.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No rules configured yet.</p>
          <p className="text-sm">Add rules to define when alerts should be triggered for this zone.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.rules.map((rule, index) => (
            <div key={rule.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-medium text-gray-900">Rule {index + 1}</h5>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateRule(rule.id, { isActive: !rule.isActive })}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      rule.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRule(rule.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rule Type
                  </label>
                  <select
                    value={rule.type}
                    onChange={(e) => updateRule(rule.id, { type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="entry_alert">Entry Alert</option>
                    <option value="exit_alert">Exit Alert</option>
                    <option value="time_limit">Time Limit</option>
                    <option value="group_size_limit">Group Size Limit</option>
                    <option value="custom">Custom Rule</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity
                  </label>
                  <select
                    value={rule.severity}
                    onChange={(e) => updateRule(rule.id, { severity: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="alert">Alert</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <input
                    type="text"
                    value={rule.condition}
                    onChange={(e) => updateRule(rule.id, { condition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="When to trigger..."
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action to Take
                </label>
                <textarea
                  value={rule.action}
                  onChange={(e) => updateRule(rule.id, { action: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="What action should be taken when this rule is triggered..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Settings Tab
  const renderSettings = () => (
    <div className="space-y-6">
      {/* System Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">System Settings</h4>
          
          {[
            { key: 'isActive', label: 'Zone Active', description: 'Enable this zone for monitoring' },
            { key: 'isPublic', label: 'Public Visibility', description: 'Show zone to all users' },
            { key: 'requiresPermission', label: 'Requires Permission', description: 'Entry requires authorization' },
            { key: 'monitoringEnabled', label: 'Monitoring Enabled', description: 'Track tourist activity in this zone' },
            { key: 'alertsEnabled', label: 'Alerts Enabled', description: 'Send alerts for zone events' },
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{setting.label}</div>
                <div className="text-sm text-gray-600">{setting.description}</div>
              </div>
              <button
                type="button"
                onClick={() => updateFormData({ [setting.key]: !formData[setting.key as keyof ZoneFormData] })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData[setting.key as keyof ZoneFormData] ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData[setting.key as keyof ZoneFormData] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Capacity Limits</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Occupancy
            </label>
            <input
              type="number"
              min="1"
              value={formData.capacity.maxOccupancy || ''}
              onChange={(e) => updateFormData({
                capacity: {
                  ...formData.capacity,
                  maxOccupancy: parseInt(e.target.value) || undefined
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              placeholder="Max number of people"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recommended Group Size
            </label>
            <input
              type="number"
              min="1"
              value={formData.capacity.recommendedGroupSize || ''}
              onChange={(e) => updateFormData({
                capacity: {
                  ...formData.capacity,
                  recommendedGroupSize: parseInt(e.target.value) || undefined
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              placeholder="Recommended group size"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Limit (minutes)
            </label>
            <input
              type="number"
              min="1"
              value={formData.capacity.timeLimit || ''}
              onChange={(e) => updateFormData({
                capacity: {
                  ...formData.capacity,
                  timeLimit: parseInt(e.target.value) || undefined
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              placeholder="Max visit duration"
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add tag and press Enter"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Internal Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => updateFormData({ notes: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Add internal notes, maintenance reminders, or other information..."
        />
      </div>
    </div>
  );

  // Media Tab
  const renderMedia = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Zone Images</h4>
        <button
          type="button"
          onClick={addImage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Image
        </button>
      </div>

      {formData.images.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Camera className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 mb-2">No images uploaded yet</p>
          <p className="text-sm text-gray-500">Add images to help users identify and understand this zone</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.images.map((image) => (
            <div key={image.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <select
                  value={image.type}
                  onChange={(e) => {
                    const updatedImages = formData.images.map(img =>
                      img.id === image.id ? { ...img, type: e.target.value as any } : img
                    );
                    updateFormData({ images: updatedImages });
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="overview">Overview</option>
                  <option value="safety">Safety</option>
                  <option value="facility">Facility</option>
                  <option value="warning">Warning</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const updatedImages = formData.images.map(img =>
                      img.id === image.id ? { ...img, file } : img
                    );
                    updateFormData({ images: updatedImages });
                  }
                }}
                className="w-full mb-3 text-sm"
              />

              <input
                type="text"
                value={image.caption || ''}
                onChange={(e) => {
                  const updatedImages = formData.images.map(img =>
                    img.id === image.id ? { ...img, caption: e.target.value } : img
                  );
                  updateFormData({ images: updatedImages });
                }}
                placeholder="Image caption..."
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`${
        selectedZoneType?.color === 'red' ? 'bg-red-600' :
        selectedZoneType?.color === 'orange' ? 'bg-orange-600' :
        selectedZoneType?.color === 'yellow' ? 'bg-yellow-600' :
        selectedZoneType?.color === 'green' ? 'bg-green-600' :
        selectedZoneType?.color === 'purple' ? 'bg-purple-600' :
        'bg-blue-600'
      } text-white p-6`}>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          {mode === 'create' ? 'Create New Zone' : 'Edit Zone'}
        </h2>
        <p className="text-opacity-90 mt-1">
          {mode === 'create' 
            ? 'Define a new geographic zone for monitoring and alerts'
            : 'Update zone information and settings'
          }
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-50 px-6 py-3">
        <div className="flex items-center space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'basic' && renderBasicInfo()}
        {activeTab === 'geography' && renderGeography()}
        {activeTab === 'rules' && renderRules()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'media' && renderMedia()}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {selectedZoneType?.label} • Risk Level {formData.riskLevel}
          </span>
          
          <LoadingButton
            loading={loading}
            onClick={handleSubmit}
            className={`${
              selectedZoneType?.color === 'red' ? 'bg-red-600 hover:bg-red-700' :
              selectedZoneType?.color === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
              selectedZoneType?.color === 'yellow' ? 'bg-yellow-600 hover:bg-yellow-700' :
              selectedZoneType?.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
              selectedZoneType?.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
              'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            <Save className="h-4 w-4" />
            {mode === 'create' ? 'Create Zone' : 'Update Zone'}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default ZoneForm;
