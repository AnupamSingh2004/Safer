/**
 * Smart Tourist Safety System - Alert Resolution Interface
 * Component for resolving alerts with detailed resolution tracking
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  MessageSquare,
  FileText,
  Upload,
  Calendar,
  MapPin,
  Save,
  Send,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

const resolutionSchema = z.object({
  resolutionType: z.enum(['resolved', 'dismissed', 'escalated', 'transferred']),
  resolutionDetails: z.string().min(10, 'Resolution details must be at least 10 characters'),
  actionsTaken: z.string().optional(),
  outcome: z.string().optional(),
  followUpRequired: z.boolean(),
  followUpDate: z.string().optional(),
  followUpResponsible: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  notifyTourist: z.boolean(),
  notifyEmergencyServices: z.boolean(),
  publicUpdate: z.boolean(),
});

type ResolutionFormData = z.infer<typeof resolutionSchema>;

interface AlertSummary {
  id: string;
  type: string;
  priority: string;
  title: string;
  description: string;
  createdAt: string;
  touristName?: string;
  location?: {
    address?: string;
  };
}

interface AlertResolutionProps {
  alertId: string;
  alertSummary?: AlertSummary;
  onResolve?: (alertId: string, resolutionData: ResolutionFormData) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const RESOLUTION_TYPES = [
  {
    value: 'resolved',
    label: 'Resolved',
    description: 'Alert has been successfully resolved',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  {
    value: 'dismissed',
    label: 'Dismissed',
    description: 'Alert was false alarm or no action required',
    icon: XCircle,
    color: 'text-gray-600',
  },
  {
    value: 'escalated',
    label: 'Escalated',
    description: 'Alert requires higher authority intervention',
    icon: AlertTriangle,
    color: 'text-orange-600',
  },
  {
    value: 'transferred',
    label: 'Transferred',
    description: 'Alert transferred to another department/team',
    icon: Send,
    color: 'text-blue-600',
  },
];

const MOCK_ALERT_SUMMARY: AlertSummary = {
  id: 'A001',
  type: 'medical',
  priority: 'critical',
  title: 'Medical Emergency - Tourist Collapse',
  description: 'Tourist collapsed at India Gate while on tour. Emergency services have been notified.',
  createdAt: '2024-01-16T14:30:00Z',
  touristName: 'Raj Kumar',
  location: {
    address: 'India Gate, New Delhi, Delhi 110001',
  },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AlertResolution({
  alertId,
  alertSummary = MOCK_ALERT_SUMMARY,
  onResolve,
  onCancel,
  className,
}: AlertResolutionProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ResolutionFormData>({
    resolver: zodResolver(resolutionSchema),
    defaultValues: {
      resolutionType: 'resolved',
      followUpRequired: false,
      notifyTourist: true,
      notifyEmergencyServices: false,
      publicUpdate: false,
    },
  });

  const watchedValues = watch();
  const selectedResolutionType = RESOLUTION_TYPES.find(
    type => type.value === watchedValues.resolutionType
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle form submission
  const onSubmit = async (data: ResolutionFormData) => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (onResolve) {
        await onResolve(alertId, { ...data, attachments: uploadedFiles });
      } else {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Resolution data:', { alertId, ...data, attachments: uploadedFiles });
      }
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file upload simulation
  const handleFileUpload = () => {
    // Mock file upload
    const mockFile = `resolution_evidence_${Date.now()}.pdf`;
    setUploadedFiles(prev => [...prev, mockFile]);
  };

  // Remove uploaded file
  const removeFile = (filename: string) => {
    setUploadedFiles(prev => prev.filter(file => file !== filename));
  };

  return (
    <div className={cn('max-w-4xl mx-auto space-y-6', className)}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Resolve Alert
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Provide resolution details for Alert {alertSummary.id}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alert Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow sticky top-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Alert Summary
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {alertSummary.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {alertSummary.description}
                </p>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(alertSummary.createdAt)}
              </div>
              
              {alertSummary.touristName && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <User className="h-4 w-4 mr-2" />
                  {alertSummary.touristName}
                </div>
              )}
              
              {alertSummary.location?.address && (
                <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                  <span>{alertSummary.location.address}</span>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    alertSummary.priority === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                    alertSummary.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                    alertSummary.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  )}>
                    {alertSummary.priority.charAt(0).toUpperCase() + alertSummary.priority.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resolution Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Resolution Details
              </h3>

              {/* Resolution Type */}
              <div className="space-y-3 mb-6">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Resolution Type *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {RESOLUTION_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <label
                        key={type.value}
                        className={cn(
                          'relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors',
                          watchedValues.resolutionType === type.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        )}
                      >
                        <input
                          type="radio"
                          value={type.value}
                          {...register('resolutionType')}
                          className="sr-only"
                        />
                        <Icon className={cn('h-5 w-5 mr-3', type.color)} />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {type.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {type.description}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors.resolutionType && (
                  <p className="text-sm text-red-600">{errors.resolutionType.message}</p>
                )}
              </div>

              {/* Resolution Details */}
              <div className="space-y-2 mb-6">
                <label htmlFor="resolutionDetails" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Resolution Details *
                </label>
                <textarea
                  id="resolutionDetails"
                  rows={4}
                  placeholder="Describe how the alert was resolved, what actions were taken, and the final outcome..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  {...register('resolutionDetails')}
                />
                {errors.resolutionDetails && (
                  <p className="text-sm text-red-600">{errors.resolutionDetails.message}</p>
                )}
              </div>

              {/* Actions Taken */}
              <div className="space-y-2 mb-6">
                <label htmlFor="actionsTaken" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Actions Taken
                </label>
                <textarea
                  id="actionsTaken"
                  rows={3}
                  placeholder="List specific actions taken to address the alert..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  {...register('actionsTaken')}
                />
              </div>

              {/* Outcome */}
              <div className="space-y-2 mb-6">
                <label htmlFor="outcome" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Final Outcome
                </label>
                <textarea
                  id="outcome"
                  rows={3}
                  placeholder="Describe the final outcome and current status..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  {...register('outcome')}
                />
              </div>
            </div>

            {/* Follow-up Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Follow-up Requirements
              </h3>

              <div className="space-y-4">
                {/* Follow-up Required */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="followUpRequired"
                    {...register('followUpRequired')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="followUpRequired" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Follow-up action required
                  </label>
                </div>

                {watchedValues.followUpRequired && (
                  <>
                    {/* Follow-up Date */}
                    <div className="space-y-2">
                      <label htmlFor="followUpDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Follow-up Date
                      </label>
                      <input
                        type="datetime-local"
                        id="followUpDate"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                        {...register('followUpDate')}
                      />
                    </div>

                    {/* Follow-up Responsible */}
                    <div className="space-y-2">
                      <label htmlFor="followUpResponsible" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Responsible Person/Department
                      </label>
                      <input
                        type="text"
                        id="followUpResponsible"
                        placeholder="Enter name or department responsible for follow-up"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                        {...register('followUpResponsible')}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Attachments
              </h3>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleFileUpload}
                  className="flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 hover:border-blue-400 rounded-md"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Evidence/Documentation
                </button>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles.map((filename, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900 dark:text-white">{filename}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(filename)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Notifications
              </h3>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyTourist"
                    {...register('notifyTourist')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifyTourist" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Notify tourist about resolution
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyEmergencyServices"
                    {...register('notifyEmergencyServices')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifyEmergencyServices" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Notify emergency services
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="publicUpdate"
                    {...register('publicUpdate')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="publicUpdate" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Send public update/advisory
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Cancel
                </button>
              )}
              
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={cn(
                  'flex items-center px-6 py-2 text-sm text-white rounded-md',
                  isValid && !isSubmitting
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Resolving...
                  </>
                ) : (
                  <>
                    {selectedResolutionType?.icon && (
                      <selectedResolutionType.icon className="h-4 w-4 mr-2" />
                    )}
                    {selectedResolutionType?.label} Alert
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AlertResolution;
