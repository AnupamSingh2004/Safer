/**
 * Smart Tourist Safety System - Tourist Registration Form
 * Example implementation of enhanced form components with validation
 */

'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Camera, Shield } from 'lucide-react';
import {
  useForm,
  Input,
  Select,
  Textarea,
  Checkbox,
  FileUpload,
  DatePicker,
  Form,
  FormButtons,
  ValidationRule
} from '@/components/forms/enhanced-forms';
import { Dialog, toast } from '@/components/ui/advanced';

// ============================================================================
// FORM DATA INTERFACES
// ============================================================================

interface TouristRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  emergencyContact: string;
  emergencyPhone: string;
  allergies: string;
  medicalConditions: string;
  accommodationAddress: string;
  visitPurpose: string;
  estimatedDuration: string;
  profilePhoto: File | null;
  idDocument: File | null;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  emergencyNotifications: boolean;
}

// ============================================================================
// VALIDATION RULES
// ============================================================================

const validationRules: Record<string, ValidationRule[]> = {
  firstName: [
    { required: true, message: 'First name is required' },
    { minLength: 2, message: 'First name must be at least 2 characters' },
    { maxLength: 50, message: 'First name must be less than 50 characters' }
  ],
  lastName: [
    { required: true, message: 'Last name is required' },
    { minLength: 2, message: 'Last name must be at least 2 characters' },
    { maxLength: 50, message: 'Last name must be less than 50 characters' }
  ],
  email: [
    { required: true, message: 'Email is required' },
    { 
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
      message: 'Please enter a valid email address' 
    }
  ],
  phone: [
    { required: true, message: 'Phone number is required' },
    { 
      pattern: /^\+?[\d\s\-\(\)]{10,}$/, 
      message: 'Please enter a valid phone number' 
    }
  ],
  dateOfBirth: [
    { required: true, message: 'Date of birth is required' },
    {
      custom: (value: string) => {
        if (!value) return null;
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 18) return 'You must be at least 18 years old';
        if (age > 120) return 'Please enter a valid date of birth';
        return null;
      }
    }
  ],
  nationality: [
    { required: true, message: 'Nationality is required' }
  ],
  passportNumber: [
    { required: true, message: 'Passport number is required' },
    { minLength: 6, message: 'Passport number must be at least 6 characters' },
    { maxLength: 20, message: 'Passport number must be less than 20 characters' }
  ],
  emergencyContact: [
    { required: true, message: 'Emergency contact name is required' }
  ],
  emergencyPhone: [
    { required: true, message: 'Emergency contact phone is required' },
    { 
      pattern: /^\+?[\d\s\-\(\)]{10,}$/, 
      message: 'Please enter a valid phone number' 
    }
  ],
  accommodationAddress: [
    { required: true, message: 'Accommodation address is required' },
    { minLength: 10, message: 'Please provide a detailed address' }
  ],
  visitPurpose: [
    { required: true, message: 'Purpose of visit is required' }
  ],
  estimatedDuration: [
    { required: true, message: 'Estimated duration is required' }
  ],
  profilePhoto: [
    { 
      custom: (value: File | null) => {
        if (!value) return 'Profile photo is required';
        if (value.size > 5 * 1024 * 1024) return 'File size must be less than 5MB';
        if (!value.type.startsWith('image/')) return 'File must be an image';
        return null;
      }
    }
  ],
  idDocument: [
    { 
      custom: (value: File | null) => {
        if (!value) return 'ID document is required';
        if (value.size > 10 * 1024 * 1024) return 'File size must be less than 10MB';
        return null;
      }
    }
  ],
  termsAccepted: [
    { 
      custom: (value: boolean) => {
        if (!value) return 'You must accept the terms and conditions';
        return null;
      }
    }
  ],
  privacyAccepted: [
    { 
      custom: (value: boolean) => {
        if (!value) return 'You must accept the privacy policy';
        return null;
      }
    }
  ]
};

// ============================================================================
// NATIONALITY OPTIONS
// ============================================================================

const nationalityOptions = [
  { value: 'US', label: 'United States' },
  { value: 'IN', label: 'India' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'CN', label: 'China' },
  { value: 'BR', label: 'Brazil' },
  { value: 'OTHER', label: 'Other' }
];

const visitPurposeOptions = [
  { value: 'tourism', label: 'Tourism' },
  { value: 'business', label: 'Business' },
  { value: 'education', label: 'Education' },
  { value: 'medical', label: 'Medical' },
  { value: 'family', label: 'Family Visit' },
  { value: 'conference', label: 'Conference/Event' },
  { value: 'other', label: 'Other' }
];

const durationOptions = [
  { value: '1-3', label: '1-3 days' },
  { value: '4-7', label: '4-7 days' },
  { value: '1-2weeks', label: '1-2 weeks' },
  { value: '3-4weeks', label: '3-4 weeks' },
  { value: '1-3months', label: '1-3 months' },
  { value: 'longer', label: 'Longer than 3 months' }
];

// ============================================================================
// TOURIST REGISTRATION FORM COMPONENT
// ============================================================================

interface TouristRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: TouristRegistrationData) => void;
}

export default function TouristRegistrationForm({ 
  isOpen, 
  onClose, 
  onSuccess 
}: TouristRegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const initialValues: Partial<TouristRegistrationData> = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    emergencyContact: '',
    emergencyPhone: '',
    allergies: '',
    medicalConditions: '',
    accommodationAddress: '',
    visitPurpose: '',
    estimatedDuration: '',
    profilePhoto: null,
    idDocument: null,
    termsAccepted: false,
    privacyAccepted: false,
    emergencyNotifications: true
  };

  const form = useForm({
    initialValues,
    validationRules,
    onSubmit: async (values) => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Registration data:', values);
        toast.success('Tourist registration completed successfully!');
        
        onSuccess?.(values as TouristRegistrationData);
        onClose();
        form.reset();
        setCurrentStep(1);
      } catch (error) {
        throw new Error('Registration failed. Please try again.');
      }
    }
  });

  const handleNext = () => {
    const stepFields = getStepFields(currentStep);
    let hasErrors = false;

    // Validate current step fields
    stepFields.forEach(fieldName => {
      const field = form.formState[fieldName];
      if (field && field.error) {
        hasErrors = true;
        form.setTouched(fieldName, true);
      }
    });

    if (!hasErrors) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast.error('Please fix the errors before proceeding');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getStepFields = (step: number): string[] => {
    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth'];
      case 2:
        return ['nationality', 'passportNumber', 'emergencyContact', 'emergencyPhone'];
      case 3:
        return ['accommodationAddress', 'visitPurpose', 'estimatedDuration', 'allergies', 'medicalConditions'];
      case 4:
        return ['profilePhoto', 'idDocument', 'termsAccepted', 'privacyAccepted'];
      default:
        return [];
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                icon={<User className="h-4 w-4" />}
                required
                autoComplete="given-name"
                {...form.getFieldProps('firstName')}
              />
              
              <Input
                label="Last Name"
                icon={<User className="h-4 w-4" />}
                required
                autoComplete="family-name"
                {...form.getFieldProps('lastName')}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              icon={<Mail className="h-4 w-4" />}
              required
              autoComplete="email"
              {...form.getFieldProps('email')}
            />

            <Input
              label="Phone Number"
              type="tel"
              icon={<Phone className="h-4 w-4" />}
              required
              placeholder="+1 (555) 123-4567"
              autoComplete="tel"
              {...form.getFieldProps('phone')}
            />

            <DatePicker
              label="Date of Birth"
              required
              max={new Date().toISOString().split('T')[0]}
              {...form.getFieldProps('dateOfBirth')}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Travel Documents & Emergency Contact</h3>
            
            <Select
              label="Nationality"
              required
              options={nationalityOptions}
              {...form.getFieldProps('nationality')}
            />

            <Input
              label="Passport Number"
              required
              placeholder="123456789"
              autoComplete="off"
              {...form.getFieldProps('passportNumber')}
            />

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Emergency Contact</h4>
              
              <Input
                label="Emergency Contact Name"
                icon={<User className="h-4 w-4" />}
                required
                {...form.getFieldProps('emergencyContact')}
              />

              <Input
                label="Emergency Contact Phone"
                type="tel"
                icon={<Phone className="h-4 w-4" />}
                required
                placeholder="+1 (555) 123-4567"
                {...form.getFieldProps('emergencyPhone')}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Visit Details & Health Information</h3>
            
            <Textarea
              label="Accommodation Address"
              required
              rows={3}
              placeholder="Enter your full accommodation address including city and postal code"
              {...form.getFieldProps('accommodationAddress')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Purpose of Visit"
                required
                options={visitPurposeOptions}
                {...form.getFieldProps('visitPurpose')}
              />

              <Select
                label="Estimated Duration of Stay"
                required
                options={durationOptions}
                {...form.getFieldProps('estimatedDuration')}
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Health Information (Optional)</h4>
              
              <Textarea
                label="Allergies"
                rows={2}
                placeholder="List any allergies or leave blank if none"
                helpText="This information helps emergency responders provide appropriate care"
                {...form.getFieldProps('allergies')}
              />

              <Textarea
                label="Medical Conditions"
                rows={2}
                placeholder="List any medical conditions or leave blank if none"
                helpText="Include any conditions that might require special attention"
                {...form.getFieldProps('medicalConditions')}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Documents & Agreements</h3>
            
            <FileUpload
              label="Profile Photo"
              accept="image/*"
              maxSize={5}
              required
              helpText="Upload a clear photo for your tourist profile"
              {...form.getFieldProps('profilePhoto')}
            />

            <FileUpload
              label="ID Document"
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={10}
              required
              helpText="Upload a scan of your passport or government-issued ID"
              {...form.getFieldProps('idDocument')}
            />

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Agreements & Preferences</h4>
              
              <div className="space-y-4">
                <Checkbox
                  label="I accept the Terms and Conditions"
                  required
                  checked={!!form.getFieldProps('termsAccepted').value}
                  onChange={(checked) => form.setValue('termsAccepted', checked)}
                  error={form.getFieldProps('termsAccepted').error}
                />

                <Checkbox
                  label="I accept the Privacy Policy"
                  required
                  checked={!!form.getFieldProps('privacyAccepted').value}
                  onChange={(checked) => form.setValue('privacyAccepted', checked)}
                  error={form.getFieldProps('privacyAccepted').error}
                />

                <Checkbox
                  label="I want to receive emergency notifications and safety alerts"
                  helpText="Recommended for your safety and security"
                  checked={!!form.getFieldProps('emergencyNotifications').value}
                  onChange={(checked) => form.setValue('emergencyNotifications', checked)}
                  error={form.getFieldProps('emergencyNotifications').error}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Tourist Registration"
      size="lg"
      closeOnOverlayClick={false}
    >
      <div className="p-6">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${step <= currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {step < currentStep ? (
                    <Shield className="h-4 w-4" />
                  ) : (
                    step
                  )}
                </div>
                {step < totalSteps && (
                  <div
                    className={`
                      w-16 h-1 mx-2
                      ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Form Content */}
        <Form onSubmit={form.handleSubmit}>
          {renderStepContent()}

          {/* Form Navigation */}
          <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <FormButtons
                submitText="Complete Registration"
                isSubmitting={form.isSubmitting}
                disabled={!form.isValid}
              />
            )}
          </div>
        </Form>
      </div>
    </Dialog>
  );
}
