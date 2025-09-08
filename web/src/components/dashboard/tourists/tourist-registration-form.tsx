/**
 * Smart Tourist Safety System - Tourist Registration Form
 * Comprehensive form for registering new tourists with all required information
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Plus,
  Trash2,
  Upload,
  FileText,
  Shield,
  Heart,
  Users,
  Save,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { touristRegistrationSchema, type TouristRegistrationData } from '@/lib/validations';

// ============================================================================
// TYPES
// ============================================================================

interface TouristRegistrationFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  initialData?: any;
  isEditing?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TouristRegistrationForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: TouristRegistrationFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(touristRegistrationSchema),
    defaultValues: {
      emergencyContacts: [{ name: '', relationship: '', phone: '', email: '' }],
      medicalConditions: [],
      medications: [],
      allergies: [],
      itinerary: [],
      preferredLanguage: 'en',
      consentTracking: false,
      consentDataSharing: false,
      consentEmergency: false,
      ...initialData,
    },
    mode: 'onChange',
  });

  const { fields: emergencyContactFields, append: appendEmergencyContact, remove: removeEmergencyContact } =
    useFieldArray({
      control,
      name: 'emergencyContacts',
    });

  const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary } =
    useFieldArray({
      control,
      name: 'itinerary',
    });

  // Form steps
  const steps = [
    { id: 1, title: 'Personal Information', icon: User },
    { id: 2, title: 'Travel Details', icon: MapPin },
    { id: 3, title: 'Emergency Contacts', icon: Phone },
    { id: 4, title: 'Medical Information', icon: Heart },
    { id: 5, title: 'Preferences & Consent', icon: Shield },
  ];

  // Helper function to get error message
  const getErrorMessage = (error: any): string => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return '';
  };

  // Handle form submission
  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Default submission logic
        console.log('Tourist registration data:', data);
        router.push('/dashboard/tourists');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle step navigation
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Check if current step is valid
  const isStepValid = (step: number) => {
    const values = getValues();
    switch (step) {
      case 1:
        return values.firstName && values.lastName && values.email && values.phone && values.dateOfBirth;
      case 2:
        return values.checkInDate && values.checkOutDate && values.accommodation;
      case 3:
        return values.emergencyContacts.length > 0 && values.emergencyContacts[0].name;
      case 4:
        return true; // Medical info is optional
      case 5:
        return values.consentTracking && values.consentDataSharing && values.consentEmergency;
      default:
        return false;
    }
  };

  // Render form step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  {...register('firstName')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.firstName)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  {...register('lastName')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.lastName)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.email)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.phone)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  {...register('dateOfBirth')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.dateOfBirth)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender *
                </label>
                <select
                  {...register('gender')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.gender)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nationality *
                </label>
                <input
                  {...register('nationality')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.nationality && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.nationality)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Identity Type *
                </label>
                <select
                  {...register('identityType')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Identity Document</option>
                  <option value="aadhar">Aadhar Card</option>
                  <option value="passport">Passport</option>
                  <option value="voter_id">Voter ID</option>
                  <option value="driving_license">Driving License</option>
                </select>
                {errors.identityType && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.identityType)}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Identity Number *
                </label>
                <input
                  {...register('identityNumber')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.identityNumber && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.identityNumber)}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Travel Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Visitor Type *
                </label>
                <select
                  {...register('visitorType')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Visitor Type</option>
                  <option value="domestic">Domestic</option>
                  <option value="international">International</option>
                </select>
                {errors.visitorType && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.visitorType)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Purpose of Visit *
                </label>
                <select
                  {...register('purposeOfVisit')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Purpose</option>
                  <option value="tourism">Tourism</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                  <option value="medical">Medical</option>
                  <option value="other">Other</option>
                </select>
                {errors.purposeOfVisit && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.purposeOfVisit)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Check-in Date *
                </label>
                <input
                  type="date"
                  {...register('checkInDate')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.checkInDate && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.checkInDate)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Check-out Date *
                </label>
                <input
                  type="date"
                  {...register('checkOutDate')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.checkOutDate && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.checkOutDate)}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Accommodation Details *
                </label>
                <textarea
                  {...register('accommodation')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Hotel name, address, booking reference, etc."
                />
                {errors.accommodation && (
                  <p className="mt-1 text-sm text-red-600">{getErrorMessage(errors.accommodation)}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Emergency Contacts
              </h3>
              <button
                type="button"
                onClick={() => appendEmergencyContact({ name: '', relationship: '', phone: '', email: '' })}
                className="flex items-center px-3 py-2 text-sm text-primary hover:text-primary/80"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Contact
              </button>
            </div>

            <div className="space-y-4">
              {emergencyContactFields.map((field, index) => (
                <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Contact {index + 1}
                    </h4>
                    {emergencyContactFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEmergencyContact(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        {...register(`emergencyContacts.${index}.name`)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Relationship *
                      </label>
                      <input
                        {...register(`emergencyContacts.${index}.relationship`)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g., Spouse, Parent, Friend"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...register(`emergencyContacts.${index}.phone`)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        {...register(`emergencyContacts.${index}.email`)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Medical Information (Optional)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Blood Group
                </label>
                <select
                  {...register('bloodGroup')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Language
                </label>
                <select
                  {...register('preferredLanguage')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Medical Conditions
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="List any medical conditions, one per line"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Medications
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="List current medications, one per line"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Allergies
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="List any allergies, one per line"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Special Requirements
                </label>
                <textarea
                  {...register('specialRequirements')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Any special requirements or accessibility needs"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Preferences & Consent
            </h3>

            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Important: Required Consents
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      The following consents are required for tourist safety monitoring and emergency response.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    {...register('consentTracking')}
                    className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Location Tracking Consent *
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      I consent to location tracking for safety monitoring and emergency response purposes.
                    </p>
                  </div>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    {...register('consentDataSharing')}
                    className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Data Sharing Consent *
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      I consent to sharing my information with relevant authorities for safety and security purposes.
                    </p>
                  </div>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    {...register('consentEmergency')}
                    className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Emergency Response Consent *
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      I consent to emergency services being contacted on my behalf if necessary.
                    </p>
                  </div>
                </label>
              </div>

              {(errors.consentTracking || errors.consentDataSharing || errors.consentEmergency) && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    All consent checkboxes must be checked to complete registration.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
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
              {isEditing ? 'Edit Tourist Information' : 'Register New Tourist'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Step {currentStep} of {steps.length}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isValid = isStepValid(step.id);

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors',
                    isActive
                      ? 'border-primary bg-primary text-white'
                      : isCompleted
                      ? 'border-green-500 bg-green-500 text-white'
                      : isValid
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-400'
                  )}
                >
                  <StepIcon className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      isActive || isCompleted
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    )}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block mx-4 w-16 h-0.5 bg-gray-300 dark:bg-gray-600" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow min-h-[500px]">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={cn(
              'flex items-center px-4 py-2 text-sm rounded-md transition-colors',
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>

          <div className="flex space-x-3">
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className={cn(
                  'flex items-center px-6 py-2 text-sm text-white rounded-md transition-colors',
                  isStepValid(currentStep)
                    ? 'bg-primary hover:bg-primary/90'
                    : 'bg-gray-400 cursor-not-allowed'
                )}
              >
                Next
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={cn(
                  'flex items-center px-6 py-2 text-sm text-white rounded-md transition-colors',
                  isValid && !isSubmitting
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {isEditing ? 'Updating...' : 'Registering...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? 'Update Tourist' : 'Register Tourist'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default TouristRegistrationForm;
