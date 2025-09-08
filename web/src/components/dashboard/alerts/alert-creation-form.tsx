/**
 * Smart Tourist Safety System - Emergency Alert Creation Component
 * Comprehensive form for creating and managing emergency alerts
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertTriangle,
  Clock,
  MapPin,
  Users,
  Send,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Siren,
  Radio,
  Phone,
  Mail,
  MessageSquare,
  Target,
  Shield,
  Zap,
  Cloud,
  Heart,
  Car,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { alertCreateSchema, type AlertCreateData } from '@/lib/validations';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// TYPES
// ============================================================================

interface AlertCreationFormProps {
  onSubmit?: (data: AlertCreateData) => void;
  onCancel?: () => void;
  initialData?: Partial<AlertCreateData>;
  isEditing?: boolean;
  touristId?: string; // For tourist-specific alerts
}

interface AlertTemplate {
  id: string;
  name: string;
  type: string;
  priority: string;
  title: string;
  description: string;
  actions: string[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ALERT_TYPES = [
  { value: 'emergency', label: 'Emergency', icon: AlertTriangle, color: 'text-red-600' },
  { value: 'safety', label: 'Safety Warning', icon: Shield, color: 'text-yellow-600' },
  { value: 'weather', label: 'Weather Alert', icon: Cloud, color: 'text-blue-600' },
  { value: 'security', label: 'Security Alert', icon: Shield, color: 'text-orange-600' },
  { value: 'medical', label: 'Medical Emergency', icon: Heart, color: 'text-red-600' },
  { value: 'natural_disaster', label: 'Natural Disaster', icon: Zap, color: 'text-purple-600' },
  { value: 'transport', label: 'Transport Disruption', icon: Car, color: 'text-gray-600' },
  { value: 'general', label: 'General Alert', icon: Bell, color: 'text-blue-600' },
] as const;

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
] as const;

const NOTIFICATION_CHANNELS = [
  { value: 'sms', label: 'SMS', icon: MessageSquare },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'push', label: 'Push Notification', icon: Phone },
  { value: 'voice', label: 'Voice Call', icon: Phone },
  { value: 'emergency_broadcast', label: 'Emergency Broadcast', icon: Radio },
] as const;

const ALERT_TEMPLATES: AlertTemplate[] = [
  {
    id: 'medical_emergency',
    name: 'Medical Emergency',
    type: 'medical',
    priority: 'critical',
    title: 'Medical Emergency Alert',
    description: 'A medical emergency has been reported in the area. Please seek immediate assistance if needed.',
    actions: ['Call emergency services', 'Avoid the area', 'Follow official instructions'],
  },
  {
    id: 'weather_warning',
    name: 'Severe Weather Warning',
    type: 'weather',
    priority: 'high',
    title: 'Severe Weather Alert',
    description: 'Severe weather conditions expected. Take necessary precautions and stay indoors.',
    actions: ['Stay indoors', 'Avoid travel', 'Monitor weather updates'],
  },
  {
    id: 'security_threat',
    name: 'Security Threat',
    type: 'security',
    priority: 'high',
    title: 'Security Alert',
    description: 'Security threat reported in the area. Please remain vigilant and follow safety protocols.',
    actions: ['Stay alert', 'Report suspicious activity', 'Follow security guidelines'],
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AlertCreationForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
  touristId,
}: AlertCreationFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<AlertCreateData>({
    resolver: zodResolver(alertCreateSchema),
    defaultValues: {
      type: '',
      priority: '',
      title: '',
      description: '',
      touristId: touristId || '',
      location: {
        latitude: 0,
        longitude: 0,
        address: '',
      },
      metadata: {},
      attachments: [],
      ...initialData,
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  // Helper function to get error message
  const getErrorMessage = (error: any): string => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return '';
  };

  // Apply template
  const applyTemplate = (templateId: string) => {
    const template = ALERT_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setValue('type', template.type as any);
      setValue('priority', template.priority as any);
      setValue('title', template.title);
      setValue('description', template.description);
      setValue('actions', template.actions);
      setSelectedTemplate(templateId);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data: AlertCreateData) => {
    setIsSubmitting(true);
    try {
      const alertData = {
        ...data,
        createdBy: user?.id || 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending',
        touristId: touristId || undefined,
      };

      if (onSubmit) {
        await onSubmit(alertData);
      } else {
        // Default submission logic
        console.log('Alert creation data:', alertData);
        router.push('/dashboard/alerts');
      }
    } catch (error) {
      console.error('Alert creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('coordinates.latitude', position.coords.latitude);
          setValue('coordinates.longitude', position.coords.longitude);
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onCancel ? onCancel() : router.back()}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Alert' : 'Create Emergency Alert'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {touristId ? `Creating alert for tourist ${touristId}` : 'Create a new emergency alert'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={cn(
              'flex items-center px-4 py-2 text-sm rounded-md transition-colors',
              previewMode
                ? 'bg-primary text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
          >
            {previewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {previewMode ? 'Edit Mode' : 'Preview'}
          </button>
        </div>
      </div>

      {previewMode ? (
        // Preview Mode
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Alert Preview
          </h3>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className={cn(
                'p-3 rounded-full',
                watchedValues.priority === 'critical' ? 'bg-red-100 dark:bg-red-900/20' :
                watchedValues.priority === 'high' ? 'bg-orange-100 dark:bg-orange-900/20' :
                watchedValues.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                'bg-green-100 dark:bg-green-900/20'
              )}>
                <AlertTriangle className={cn(
                  'h-6 w-6',
                  watchedValues.priority === 'critical' ? 'text-red-600' :
                  watchedValues.priority === 'high' ? 'text-orange-600' :
                  watchedValues.priority === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                )} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {watchedValues.title || 'Alert Title'}
                  </h4>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    PRIORITY_LEVELS.find(p => p.value === watchedValues.priority)?.color
                  )}>
                    {PRIORITY_LEVELS.find(p => p.value === watchedValues.priority)?.label || 'Priority'}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {watchedValues.description || 'Alert description will appear here...'}
                </p>
                
                {watchedValues.actions && watchedValues.actions.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                      Recommended Actions:
                    </h5>
                    <ul className="space-y-1">
                      {watchedValues.actions.filter(Boolean).map((action, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                          • {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Form Mode
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Alert Templates */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Quick Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ALERT_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => applyTemplate(template.id)}
                  className={cn(
                    'p-4 border rounded-lg text-left transition-colors',
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {template.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {template.description.substring(0, 60)}...
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Alert Details */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              Alert Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alert Type *
                </label>
                <select
                  {...register('type')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Alert Type</option>
                  {ALERT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.type)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority Level *
                </label>
                <select
                  {...register('priority')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Priority</option>
                  {PRIORITY_LEVELS.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
                {errors.priority && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.priority)}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alert Title *
                </label>
                <input
                  {...register('title')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter a clear, concise alert title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.title)}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alert Description *
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Provide detailed information about the alert"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.description)}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location and Targeting */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              Location & Targeting
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Latitude
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="any"
                    {...register('coordinates.latitude', { valueAsNumber: true })}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.000000"
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="p-2 text-primary hover:text-primary/80"
                    title="Get current location"
                  >
                    <Target className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  {...register('coordinates.longitude', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alert Radius (meters)
                </label>
                <input
                  type="number"
                  {...register('radius', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Zone (Optional)
                </label>
                <input
                  {...register('zoneId')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Zone ID or name"
                />
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Recommended Actions
              </h3>
              <button
                type="button"
                onClick={() => appendAction('')}
                className="flex items-center px-3 py-2 text-sm text-primary hover:text-primary/80"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Action
              </button>
            </div>

            <div className="space-y-4">
              {actionFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-3">
                  <input
                    {...register(`actions.${index}`)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter recommended action"
                  />
                  {actionFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAction(index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notification Channels */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              Notification Channels
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {NOTIFICATION_CHANNELS.map((channel) => {
                const ChannelIcon = channel.icon;
                return (
                  <label key={channel.value} className="flex items-center">
                    <input
                      type="checkbox"
                      value={channel.value}
                      {...register('channels')}
                      className="rounded border-gray-300 text-primary focus:ring-primary mr-3"
                    />
                    <ChannelIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {channel.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <button
              type="button"
              onClick={() => onCancel ? onCancel() : router.back()}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {/* Save as draft */}}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </button>
              
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={cn(
                  'flex items-center px-6 py-2 text-sm text-white rounded-md transition-colors',
                  isValid && !isSubmitting
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gray-400 cursor-not-allowed'
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {isEditing ? 'Update Alert' : 'Create Alert'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default AlertCreationForm;
