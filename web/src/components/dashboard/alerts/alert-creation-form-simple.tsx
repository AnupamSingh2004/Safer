/**
 * Smart Tourist Safety System - Alert Creation Form (Simplified)
 * Form for creating emergency alerts that matches the validation schema
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertTriangle,
  MapPin,
  Send,
  Save,
  ArrowLeft,
  Target,
  Shield,
  Heart,
  Cloud,
  Car,
  Bell,
  Eye,
  EyeOff,
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
  touristId?: string;
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
  { value: 'transport', label: 'Transport Disruption', icon: Car, color: 'text-gray-600' },
  { value: 'general', label: 'General Alert', icon: Bell, color: 'text-blue-600' },
] as const;

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
] as const;

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
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
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

  // Handle form submission
  const handleFormSubmit = async (data: AlertCreateData) => {
    setIsSubmitting(true);
    try {
      const alertData = {
        ...data,
        touristId: data.touristId || touristId || '',
      };

      if (onSubmit) {
        await onSubmit(alertData);
      } else {
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
          setValue('location.latitude', position.coords.latitude);
          setValue('location.longitude', position.coords.longitude);
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
                
                {watchedValues.location?.address && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-1" />
                    {watchedValues.location.address}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Form Mode
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tourist ID *
                </label>
                <input
                  {...register('touristId')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter tourist ID"
                />
                {errors.touristId && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.touristId)}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              Location Information (Optional)
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
                    {...register('location.latitude', { valueAsNumber: true })}
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
                  {...register('location.longitude', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.000000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <input
                  {...register('location.address')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter location address"
                />
              </div>
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
