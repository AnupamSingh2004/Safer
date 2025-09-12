'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Users, 
  Phone, 
  Save, 
  Plus, 
  X,
  Camera,
  Mic,
  FileText,
  Zap,
  Shield,
  CheckCircle,
  Navigation,
  AlertCircle
} from 'lucide-react';
import { LoadingButton } from '@/components/common/loading';

interface AlertFormData {
  // Basic Alert Information
  type: 'emergency' | 'missing' | 'medical' | 'security' | 'geofence' | 'anomaly' | 'panic' | 'custom';
  priority: 'low' | 'medium' | 'high' | 'critical';
  severity: 'info' | 'warning' | 'alert' | 'emergency';
  title: string;
  description: string;
  
  // Tourist Information
  touristId: string;
  touristName?: string;
  
  // Location Information
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    accuracy?: number;
    timestamp?: string;
  };
  useCurrentLocation: boolean;
  
  // Assignment & Response
  assignedTo?: string;
  responseTeam: string[];
  estimatedResponseTime?: number; // minutes
  
  // Affected Areas & People
  affectedZones: string[];
  affectedTourists: string[];
  estimatedAffectedCount?: number;
  
  // Media & Evidence
  attachments: Array<{
    id: string;
    type: 'photo' | 'video' | 'audio' | 'document';
    file?: File;
    url?: string;
    description?: string;
  }>;
  
  // Additional Information
  instructions: string;
  resources: string[];
  escalationTrigger?: {
    condition: string;
    timeThreshold: number; // minutes
    autoEscalate: boolean;
  };
  
  // Notification Settings
  notifications: {
    sms: boolean;
    email: boolean;
    push: boolean;
    publicAnnouncement: boolean;
    mediaAlert: boolean;
  };
  
  // Timeline & Scheduling
  scheduleAlert?: boolean;
  scheduledTime?: string;
  expiryTime?: string;
  
  // Internal Notes
  internalNotes: string;
  tags: string[];
}

interface AlertFormProps {
  initialData?: Partial<AlertFormData>;
  mode: 'create' | 'edit';
  touristId?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  onSubmit: (data: AlertFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

const alertTypeOptions = [
  { value: 'emergency', label: 'Emergency Situation', color: 'red', icon: AlertTriangle },
  { value: 'missing', label: 'Missing Person', color: 'orange', icon: Users },
  { value: 'medical', label: 'Medical Emergency', color: 'pink', icon: Plus },
  { value: 'security', label: 'Security Threat', color: 'yellow', icon: Shield },
  { value: 'geofence', label: 'Zone Violation', color: 'purple', icon: MapPin },
  { value: 'anomaly', label: 'Unusual Behavior', color: 'blue', icon: AlertCircle },
  { value: 'panic', label: 'Panic Button', color: 'red', icon: Zap },
  { value: 'custom', label: 'Custom Alert', color: 'gray', icon: FileText },
];

const priorityOptions = [
  { value: 'low', label: 'Low Priority', color: 'green', description: 'Non-urgent, can be handled later' },
  { value: 'medium', label: 'Medium Priority', color: 'yellow', description: 'Moderate urgency, needs attention' },
  { value: 'high', label: 'High Priority', color: 'orange', description: 'Urgent, requires immediate attention' },
  { value: 'critical', label: 'Critical Priority', color: 'red', description: 'Life-threatening, immediate response needed' },
];

const defaultFormData: AlertFormData = {
  type: 'emergency',
  priority: 'medium',
  severity: 'warning',
  title: '',
  description: '',
  touristId: '',
  useCurrentLocation: true,
  responseTeam: [],
  affectedZones: [],
  affectedTourists: [],
  attachments: [],
  instructions: '',
  resources: [],
  notifications: {
    sms: true,
    email: true,
    push: true,
    publicAnnouncement: false,
    mediaAlert: false,
  },
  scheduleAlert: false,
  internalNotes: '',
  tags: [],
};

export const AlertForm: React.FC<AlertFormProps> = ({
  initialData,
  mode,
  touristId,
  currentLocation,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<AlertFormData>({
    ...defaultFormData,
    touristId: touristId || '',
    location: currentLocation,
    ...initialData,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);

  const updateFormData = (updates: Partial<AlertFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateFormData({
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date().toISOString(),
            }
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  useEffect(() => {
    if (formData.useCurrentLocation && !formData.location) {
      getCurrentLocation();
    }
  }, [formData.useCurrentLocation]);

  // Add attachment
  const addAttachment = (type: AlertFormData['attachments'][0]['type']) => {
    const newAttachment = {
      id: Date.now().toString(),
      type,
      description: '',
    };
    updateFormData({
      attachments: [...formData.attachments, newAttachment],
    });
  };

  // Remove attachment
  const removeAttachment = (id: string) => {
    updateFormData({
      attachments: formData.attachments.filter(att => att.id !== id),
    });
  };

  // Update attachment
  const updateAttachment = (id: string, updates: Partial<AlertFormData['attachments'][0]>) => {
    updateFormData({
      attachments: formData.attachments.map(att =>
        att.id === id ? { ...att, ...updates } : att
      ),
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
    
    if (!formData.title.trim()) newErrors.title = 'Alert title is required';
    if (!formData.description.trim()) newErrors.description = 'Alert description is required';
    if (!formData.touristId.trim()) newErrors.touristId = 'Tourist ID is required';
    
    if (formData.scheduleAlert && !formData.scheduledTime) {
      newErrors.scheduledTime = 'Scheduled time is required when scheduling alerts';
    }
    
    if (formData.priority === 'critical' && formData.responseTeam.length === 0) {
      newErrors.responseTeam = 'Response team assignment is required for critical alerts';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  const selectedAlertType = alertTypeOptions.find(option => option.value === formData.type);
  const selectedPriority = priorityOptions.find(option => option.value === formData.priority);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`${
        formData.priority === 'critical' ? 'bg-red-600' :
        formData.priority === 'high' ? 'bg-orange-600' :
        formData.priority === 'medium' ? 'bg-yellow-600' :
        'bg-blue-600'
      } text-white p-6`}>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          {mode === 'create' ? 'Create New Alert' : 'Edit Alert'}
        </h2>
        <p className="text-opacity-90 mt-1">
          {mode === 'create' 
            ? 'Create a new safety alert to notify relevant authorities and response teams'
            : 'Update alert information and response details'
          }
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Alert Type & Priority */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Alert Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {alertTypeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.type === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateFormData({ type: option.value as any })}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? `border-${option.color}-500 bg-${option.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${
                        isSelected ? `text-${option.color}-600` : 'text-gray-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        isSelected ? `text-${option.color}-800` : 'text-gray-700'
                      }`}>
                        {option.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Priority Level *
            </label>
            <div className="space-y-2">
              {priorityOptions.map((option) => {
                const isSelected = formData.priority === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateFormData({ priority: option.value as any })}
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
                          {option.label}
                        </span>
                        <p className={`text-xs ${
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
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Alert Information
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Brief, descriptive title for the alert"
            />
            {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Provide detailed information about the situation, current status, and any immediate concerns..."
            />
            {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tourist ID *
              </label>
              <input
                type="text"
                value={formData.touristId}
                onChange={(e) => updateFormData({ touristId: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.touristId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter tourist ID or search"
                disabled={!!touristId}
              />
              {errors.touristId && <p className="text-red-600 text-xs mt-1">{errors.touristId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tourist Name
              </label>
              <input
                type="text"
                value={formData.touristName || ''}
                onChange={(e) => updateFormData({ touristName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Tourist name (auto-filled from ID)"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Location Information
          </h3>
          
          <div className="flex items-center space-x-3 mb-4">
            <input
              type="checkbox"
              id="useCurrentLocation"
              checked={formData.useCurrentLocation}
              onChange={(e) => {
                updateFormData({ useCurrentLocation: e.target.checked });
                if (e.target.checked) {
                  getCurrentLocation();
                }
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="useCurrentLocation" className="text-sm font-medium text-gray-700">
              Use current location
            </label>
            <button
              type="button"
              onClick={getCurrentLocation}
              className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              <Navigation className="h-4 w-4" />
              <span className="text-sm">Refresh location</span>
            </button>
          </div>

          {formData.location && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.location.latitude}
                    onChange={(e) => updateFormData({
                      location: { ...formData.location!, latitude: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.location.longitude}
                    onChange={(e) => updateFormData({
                      location: { ...formData.location!, longitude: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accuracy (meters)
                  </label>
                  <input
                    type="number"
                    value={formData.location.accuracy || ''}
                    onChange={(e) => updateFormData({
                      location: { ...formData.location!, accuracy: parseFloat(e.target.value) || undefined }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="GPS accuracy"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address / Landmark
                </label>
                <input
                  type="text"
                  value={formData.location.address || ''}
                  onChange={(e) => updateFormData({
                    location: { ...formData.location!, address: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Street address, landmark, or location description"
                />
              </div>
            </div>
          )}
        </div>

        {/* Response & Assignment */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Response & Assignment
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Team Member
              </label>
              <select
                value={formData.assignedTo || ''}
                onChange={(e) => updateFormData({ assignedTo: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select team member</option>
                <option value="emergency-response-1">Emergency Response Team 1</option>
                <option value="police-unit-2">Police Unit 2</option>
                <option value="medical-team-3">Medical Team 3</option>
                <option value="security-patrol-4">Security Patrol 4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Response Time (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={formData.estimatedResponseTime || ''}
                onChange={(e) => updateFormData({ 
                  estimatedResponseTime: parseInt(e.target.value) || undefined 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Expected response time"
              />
            </div>
          </div>

          {formData.priority === 'critical' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">Critical Alert Requirements</h4>
              <p className="text-sm text-red-700 mb-3">
                Critical alerts require immediate response team assignment and notification.
              </p>
              {errors.responseTeam && (
                <p className="text-red-600 text-sm">{errors.responseTeam}</p>
              )}
            </div>
          )}
        </div>

        {/* Media & Attachments */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Media & Evidence
          </h3>
          
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => addAttachment('photo')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Camera className="h-4 w-4" />
              Add Photo
            </button>
            <button
              type="button"
              onClick={() => addAttachment('video')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Camera className="h-4 w-4" />
              Add Video
            </button>
            <button
              type="button"
              onClick={() => addAttachment('audio')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isRecording 
                  ? 'bg-red-600 text-white' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <Mic className="h-4 w-4" />
              {isRecording ? 'Recording...' : 'Record Audio'}
            </button>
            <button
              type="button"
              onClick={() => addAttachment('document')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Add Document
            </button>
          </div>

          {formData.attachments.length > 0 && (
            <div className="space-y-3">
              {formData.attachments.map((attachment) => (
                <div key={attachment.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {attachment.type.charAt(0).toUpperCase() + attachment.type.slice(1)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(attachment.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    type="file"
                    accept={
                      attachment.type === 'photo' ? 'image/*' :
                      attachment.type === 'video' ? 'video/*' :
                      attachment.type === 'audio' ? 'audio/*' :
                      '*/*'
                    }
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        updateAttachment(attachment.id, { file });
                      }
                    }}
                    className="w-full mb-2"
                  />
                  <input
                    type="text"
                    value={attachment.description || ''}
                    onChange={(e) => updateAttachment(attachment.id, { description: e.target.value })}
                    placeholder="Add description..."
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions & Resources */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Response Instructions
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => updateFormData({ instructions: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Provide specific instructions for response teams, safety protocols, or immediate actions to be taken..."
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Notification Settings
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(formData.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  id={`notification-${key}`}
                  checked={value}
                  onChange={(e) => updateFormData({
                    notifications: {
                      ...formData.notifications,
                      [key]: e.target.checked,
                    }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`notification-${key}`} className="text-sm font-medium text-gray-700">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Internal Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Internal Notes
          </label>
          <textarea
            value={formData.internalNotes}
            onChange={(e) => updateFormData({ internalNotes: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add internal notes, context, or additional information for team reference..."
          />
        </div>
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
            {selectedAlertType?.label} • {selectedPriority?.label}
          </span>
          
          <LoadingButton
            loading={loading}
            onClick={handleSubmit}
            className={`${
              formData.priority === 'critical' ? 'bg-red-600 hover:bg-red-700' :
              formData.priority === 'high' ? 'bg-orange-600 hover:bg-orange-700' :
              formData.priority === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700' :
              'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            <Save className="h-4 w-4" />
            {mode === 'create' ? 'Create Alert' : 'Update Alert'}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default AlertForm;
