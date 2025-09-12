'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Camera, 
  Shield, 
  Heart,
  Plane,
  Users,
  Save,
  Plus,
  X,
  Upload,
  Globe,
  CheckCircle,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { LoadingButton } from '@/components/common/loading';

interface TouristFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  nationality: string;
  preferredLanguage: string;
  
  // Identity Documents
  identityType: 'passport' | 'national_id' | 'drivers_license' | 'aadhar';
  identityNumber: string;
  issuingCountry: string;
  issueDate: string;
  expiryDate: string;
  documentImage?: File;
  
  // Travel Information
  visitorType: 'domestic' | 'international';
  arrivalDate: string;
  departureDate: string;
  accommodation: {
    name: string;
    address: string;
    phone: string;
    checkInDate: string;
    checkOutDate: string;
  };
  purposeOfVisit: 'tourism' | 'business' | 'education' | 'medical' | 'other';
  groupSize: number;
  hasLocalGuide: boolean;
  guideInfo?: {
    name: string;
    phone: string;
    email: string;
  };
  
  // Emergency Contacts
  emergencyContacts: Array<{
    id: string;
    name: string;
    relationship: string;
    phone: string;
    email: string;
    isPrimary: boolean;
  }>;
  
  // Health Information
  healthInfo: {
    medicalConditions: string[];
    medications: string[];
    allergies: string[];
    bloodGroup?: string;
    hasInsurance: boolean;
    insuranceProvider?: string;
    policyNumber?: string;
  };
  
  // Preferences & Consent
  trackingConsent: boolean;
  dataSharing: boolean;
  emergencySharing: boolean;
  specialRequirements: string;
}

interface TouristFormProps {
  initialData?: Partial<TouristFormData>;
  mode: 'create' | 'edit';
  onSubmit: (data: TouristFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

const defaultFormData: TouristFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: 'prefer_not_to_say',
  nationality: '',
  preferredLanguage: 'en',
  identityType: 'passport',
  identityNumber: '',
  issuingCountry: '',
  issueDate: '',
  expiryDate: '',
  visitorType: 'domestic',
  arrivalDate: '',
  departureDate: '',
  accommodation: {
    name: '',
    address: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
  },
  purposeOfVisit: 'tourism',
  groupSize: 1,
  hasLocalGuide: false,
  emergencyContacts: [{
    id: '1',
    name: '',
    relationship: '',
    phone: '',
    email: '',
    isPrimary: true,
  }],
  healthInfo: {
    medicalConditions: [],
    medications: [],
    allergies: [],
    hasInsurance: false,
  },
  trackingConsent: false,
  dataSharing: false,
  emergencySharing: true,
  specialRequirements: '',
};

export const TouristForm: React.FC<TouristFormProps> = ({
  initialData,
  mode,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<TouristFormData>({
    ...defaultFormData,
    ...initialData,
  });
  
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 'personal', title: 'Personal Information', icon: User },
    { id: 'identity', title: 'Identity Documents', icon: FileText },
    { id: 'travel', title: 'Travel Details', icon: Plane },
    { id: 'emergency', title: 'Emergency Contacts', icon: Users },
    { id: 'health', title: 'Health Information', icon: Heart },
    { id: 'consent', title: 'Consent & Preferences', icon: Shield },
  ];

  const updateFormData = (updates: Partial<TouristFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const addEmergencyContact = () => {
    const newContact = {
      id: Date.now().toString(),
      name: '',
      relationship: '',
      phone: '',
      email: '',
      isPrimary: false,
    };
    updateFormData({
      emergencyContacts: [...formData.emergencyContacts, newContact],
    });
  };

  const removeEmergencyContact = (id: string) => {
    updateFormData({
      emergencyContacts: formData.emergencyContacts.filter(contact => contact.id !== id),
    });
  };

  const updateEmergencyContact = (id: string, updates: Partial<typeof formData.emergencyContacts[0]>) => {
    updateFormData({
      emergencyContacts: formData.emergencyContacts.map(contact =>
        contact.id === id ? { ...contact, ...updates } : contact
      ),
    });
  };

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (stepIndex) {
      case 0: // Personal Information
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
        break;
      
      case 1: // Identity Documents
        if (!formData.identityNumber.trim()) newErrors.identityNumber = 'Identity number is required';
        if (!formData.issuingCountry.trim()) newErrors.issuingCountry = 'Issuing country is required';
        if (!formData.issueDate) newErrors.issueDate = 'Issue date is required';
        if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
        break;
      
      case 2: // Travel Details
        if (!formData.arrivalDate) newErrors.arrivalDate = 'Arrival date is required';
        if (!formData.departureDate) newErrors.departureDate = 'Departure date is required';
        if (!formData.accommodation.name.trim()) newErrors.accommodationName = 'Accommodation name is required';
        if (!formData.accommodation.address.trim()) newErrors.accommodationAddress = 'Accommodation address is required';
        break;
      
      case 3: // Emergency Contacts
        if (formData.emergencyContacts.length === 0) {
          newErrors.emergencyContacts = 'At least one emergency contact is required';
        } else {
          formData.emergencyContacts.forEach((contact, index) => {
            if (!contact.name.trim()) newErrors[`contact_${index}_name`] = 'Contact name is required';
            if (!contact.phone.trim()) newErrors[`contact_${index}_phone`] = 'Contact phone is required';
            if (!contact.relationship.trim()) newErrors[`contact_${index}_relationship`] = 'Relationship is required';
          });
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (validateStep(activeStep)) {
      await onSubmit(formData);
    }
  };

  // Personal Information Step
  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline h-4 w-4 mr-1" />
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => updateFormData({ firstName: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter first name"
          />
          {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline h-4 w-4 mr-1" />
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => updateFormData({ lastName: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter last name"
          />
          {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline h-4 w-4 mr-1" />
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="email@example.com"
          />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline h-4 w-4 mr-1" />
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="+91 98765 43210"
          />
          {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Date of Birth *
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.dateOfBirth && <p className="text-red-600 text-xs mt-1">{errors.dateOfBirth}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) => updateFormData({ gender: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="inline h-4 w-4 mr-1" />
            Nationality *
          </label>
          <input
            type="text"
            value={formData.nationality}
            onChange={(e) => updateFormData({ nationality: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.nationality ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="e.g., Indian, American"
          />
          {errors.nationality && <p className="text-red-600 text-xs mt-1">{errors.nationality}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Language
        </label>
        <select
          value={formData.preferredLanguage}
          onChange={(e) => updateFormData({ preferredLanguage: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="bn">Bengali</option>
          <option value="te">Telugu</option>
          <option value="mr">Marathi</option>
          <option value="ta">Tamil</option>
          <option value="ur">Urdu</option>
          <option value="gu">Gujarati</option>
          <option value="kn">Kannada</option>
          <option value="ml">Malayalam</option>
        </select>
      </div>
    </div>
  );

  // Identity Documents Step
  const renderIdentityDocuments = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline h-4 w-4 mr-1" />
            Identity Document Type *
          </label>
          <select
            value={formData.identityType}
            onChange={(e) => updateFormData({ identityType: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="passport">Passport</option>
            <option value="aadhar">Aadhar Card</option>
            <option value="national_id">National ID</option>
            <option value="drivers_license">Driver's License</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Number *
          </label>
          <input
            type="text"
            value={formData.identityNumber}
            onChange={(e) => updateFormData({ identityNumber: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.identityNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter document number"
          />
          {errors.identityNumber && <p className="text-red-600 text-xs mt-1">{errors.identityNumber}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issuing Country *
          </label>
          <input
            type="text"
            value={formData.issuingCountry}
            onChange={(e) => updateFormData({ issuingCountry: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.issuingCountry ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="e.g., India"
          />
          {errors.issuingCountry && <p className="text-red-600 text-xs mt-1">{errors.issuingCountry}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issue Date *
          </label>
          <input
            type="date"
            value={formData.issueDate}
            onChange={(e) => updateFormData({ issueDate: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.issueDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.issueDate && <p className="text-red-600 text-xs mt-1">{errors.issueDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date *
          </label>
          <input
            type="date"
            value={formData.expiryDate}
            onChange={(e) => updateFormData({ expiryDate: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.expiryDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.expiryDate && <p className="text-red-600 text-xs mt-1">{errors.expiryDate}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Camera className="inline h-4 w-4 mr-1" />
          Document Image
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, PDF up to 5MB
          </p>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) updateFormData({ documentImage: file });
            }}
            className="hidden"
            id="document-upload"
          />
          <label
            htmlFor="document-upload"
            className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Choose File
          </label>
        </div>
        {formData.documentImage && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">{formData.documentImage.name}</span>
          </div>
        )}
      </div>
    </div>
  );

  // Travel Details Step
  const renderTravelDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visitor Type
          </label>
          <select
            value={formData.visitorType}
            onChange={(e) => updateFormData({ visitorType: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Arrival Date *
          </label>
          <input
            type="date"
            value={formData.arrivalDate}
            onChange={(e) => updateFormData({ arrivalDate: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.arrivalDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.arrivalDate && <p className="text-red-600 text-xs mt-1">{errors.arrivalDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Departure Date *
          </label>
          <input
            type="date"
            value={formData.departureDate}
            onChange={(e) => updateFormData({ departureDate: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.departureDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.departureDate && <p className="text-red-600 text-xs mt-1">{errors.departureDate}</p>}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Accommodation Details
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hotel/Accommodation Name *
            </label>
            <input
              type="text"
              value={formData.accommodation.name}
              onChange={(e) => updateFormData({
                accommodation: { ...formData.accommodation, name: e.target.value }
              })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.accommodationName ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter hotel/accommodation name"
            />
            {errors.accommodationName && <p className="text-red-600 text-xs mt-1">{errors.accommodationName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.accommodation.phone}
              onChange={(e) => updateFormData({
                accommodation: { ...formData.accommodation, phone: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Hotel contact number"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <textarea
            value={formData.accommodation.address}
            onChange={(e) => updateFormData({
              accommodation: { ...formData.accommodation, address: e.target.value }
            })}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.accommodationAddress ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter complete address"
          />
          {errors.accommodationAddress && <p className="text-red-600 text-xs mt-1">{errors.accommodationAddress}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purpose of Visit
          </label>
          <select
            value={formData.purposeOfVisit}
            onChange={(e) => updateFormData({ purposeOfVisit: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="tourism">Tourism</option>
            <option value="business">Business</option>
            <option value="education">Education</option>
            <option value="medical">Medical</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group Size
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={formData.groupSize}
            onChange={(e) => updateFormData({ groupSize: parseInt(e.target.value) || 1 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center space-x-3 mt-6">
          <input
            type="checkbox"
            id="hasLocalGuide"
            checked={formData.hasLocalGuide}
            onChange={(e) => updateFormData({ hasLocalGuide: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="hasLocalGuide" className="text-sm font-medium text-gray-700">
            Has Local Guide
          </label>
        </div>
      </div>

      {formData.hasLocalGuide && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-3">Guide Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Guide Name
              </label>
              <input
                type="text"
                value={formData.guideInfo?.name || ''}
                onChange={(e) => updateFormData({
                  guideInfo: { ...formData.guideInfo, name: e.target.value } as any
                })}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Guide's name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.guideInfo?.phone || ''}
                onChange={(e) => updateFormData({
                  guideInfo: { ...formData.guideInfo, phone: e.target.value } as any
                })}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Guide's phone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.guideInfo?.email || ''}
                onChange={(e) => updateFormData({
                  guideInfo: { ...formData.guideInfo, email: e.target.value } as any
                })}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Guide's email"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Emergency Contacts Step
  const renderEmergencyContacts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Emergency Contacts
        </h4>
        <button
          type="button"
          onClick={addEmergencyContact}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Contact
        </button>
      </div>

      {errors.emergencyContacts && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{errors.emergencyContacts}</p>
        </div>
      )}

      <div className="space-y-4">
        {formData.emergencyContacts.map((contact, index) => (
          <div key={contact.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h5 className="font-medium text-gray-900">
                  Contact {index + 1}
                </h5>
                {contact.isPrimary && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Primary
                  </span>
                )}
              </div>
              {formData.emergencyContacts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmergencyContact(contact.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => updateEmergencyContact(contact.id, { name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors[`contact_${index}_name`] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Contact name"
                />
                {errors[`contact_${index}_name`] && (
                  <p className="text-red-600 text-xs mt-1">{errors[`contact_${index}_name`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship *
                </label>
                <select
                  value={contact.relationship}
                  onChange={(e) => updateEmergencyContact(contact.id, { relationship: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors[`contact_${index}_relationship`] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select relationship</option>
                  <option value="spouse">Spouse</option>
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                  <option value="sibling">Sibling</option>
                  <option value="friend">Friend</option>
                  <option value="colleague">Colleague</option>
                  <option value="other">Other</option>
                </select>
                {errors[`contact_${index}_relationship`] && (
                  <p className="text-red-600 text-xs mt-1">{errors[`contact_${index}_relationship`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => updateEmergencyContact(contact.id, { phone: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors[`contact_${index}_phone`] ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="+91 98765 43210"
                />
                {errors[`contact_${index}_phone`] && (
                  <p className="text-red-600 text-xs mt-1">{errors[`contact_${index}_phone`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => updateEmergencyContact(contact.id, { email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="mt-3 flex items-center">
              <input
                type="checkbox"
                id={`primary-${contact.id}`}
                checked={contact.isPrimary}
                onChange={(e) => {
                  if (e.target.checked) {
                    // Set this as primary and unset others
                    updateFormData({
                      emergencyContacts: formData.emergencyContacts.map(c => ({
                        ...c,
                        isPrimary: c.id === contact.id
                      }))
                    });
                  }
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`primary-${contact.id}`} className="ml-2 text-sm text-gray-700">
                Primary emergency contact
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Health Information Step
  const renderHealthInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Heart className="inline h-4 w-4 mr-1" />
            Medical Conditions
          </label>
          <textarea
            value={formData.healthInfo.medicalConditions.join('\n')}
            onChange={(e) => updateFormData({
              healthInfo: {
                ...formData.healthInfo,
                medicalConditions: e.target.value.split('\n').filter(Boolean)
              }
            })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="List any medical conditions (one per line)..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Medications
          </label>
          <textarea
            value={formData.healthInfo.medications.join('\n')}
            onChange={(e) => updateFormData({
              healthInfo: {
                ...formData.healthInfo,
                medications: e.target.value.split('\n').filter(Boolean)
              }
            })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="List current medications (one per line)..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allergies
          </label>
          <textarea
            value={formData.healthInfo.allergies.join('\n')}
            onChange={(e) => updateFormData({
              healthInfo: {
                ...formData.healthInfo,
                allergies: e.target.value.split('\n').filter(Boolean)
              }
            })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="List any allergies (one per line)..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blood Group
          </label>
          <select
            value={formData.healthInfo.bloodGroup || ''}
            onChange={(e) => updateFormData({
              healthInfo: {
                ...formData.healthInfo,
                bloodGroup: e.target.value || undefined
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Select blood group</option>
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
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h5 className="font-medium text-gray-900 mb-3">Health Insurance</h5>
        
        <div className="flex items-center space-x-3 mb-4">
          <input
            type="checkbox"
            id="hasInsurance"
            checked={formData.healthInfo.hasInsurance}
            onChange={(e) => updateFormData({
              healthInfo: {
                ...formData.healthInfo,
                hasInsurance: e.target.checked,
                insuranceProvider: e.target.checked ? formData.healthInfo.insuranceProvider : undefined,
                policyNumber: e.target.checked ? formData.healthInfo.policyNumber : undefined,
              }
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="hasInsurance" className="text-sm font-medium text-gray-700">
            I have health insurance coverage
          </label>
        </div>

        {formData.healthInfo.hasInsurance && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insurance Provider
              </label>
              <input
                type="text"
                value={formData.healthInfo.insuranceProvider || ''}
                onChange={(e) => updateFormData({
                  healthInfo: {
                    ...formData.healthInfo,
                    insuranceProvider: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Insurance company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Policy Number
              </label>
              <input
                type="text"
                value={formData.healthInfo.policyNumber || ''}
                onChange={(e) => updateFormData({
                  healthInfo: {
                    ...formData.healthInfo,
                    policyNumber: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Policy number"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Consent & Preferences Step
  const renderConsent = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Privacy & Consent</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your privacy and data security are our top priorities. Please review and provide consent for the following data usage.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            id="trackingConsent"
            checked={formData.trackingConsent}
            onChange={(e) => updateFormData({ trackingConsent: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
          />
          <div className="flex-1">
            <label htmlFor="trackingConsent" className="font-medium text-gray-900">
              Location Tracking Consent *
            </label>
            <p className="text-sm text-gray-600 mt-1">
              I consent to location tracking for safety monitoring and emergency response purposes. 
              This helps authorities provide timely assistance if needed.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
          <input
            type="checkbox"
            id="dataSharing"
            checked={formData.dataSharing}
            onChange={(e) => updateFormData({ dataSharing: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
          />
          <div className="flex-1">
            <label htmlFor="dataSharing" className="font-medium text-gray-900">
              Data Sharing with Tourism Partners
            </label>
            <p className="text-sm text-gray-600 mt-1">
              I agree to share my travel information with authorized tourism partners to enhance my travel experience 
              and receive relevant recommendations.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 border border-green-200 rounded-lg bg-green-50">
          <input
            type="checkbox"
            id="emergencySharing"
            checked={formData.emergencySharing}
            onChange={(e) => updateFormData({ emergencySharing: e.target.checked })}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
          />
          <div className="flex-1">
            <label htmlFor="emergencySharing" className="font-medium text-green-900">
              Emergency Information Sharing *
            </label>
            <p className="text-sm text-green-700 mt-1">
              I consent to sharing my information with emergency services, medical facilities, and my emergency contacts 
              in case of any safety incidents. This is required for emergency response.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requirements or Accessibility Needs
        </label>
        <textarea
          value={formData.specialRequirements}
          onChange={(e) => updateFormData({ specialRequirements: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Please describe any special requirements, accessibility needs, or other preferences..."
        />
      </div>

      {(!formData.trackingConsent || !formData.emergencySharing) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-red-900">Required Consent</h5>
              <p className="text-sm text-red-700 mt-1">
                Location tracking and emergency information sharing consent are required for your safety and security. 
                Without these permissions, we cannot provide adequate safety monitoring services.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: return renderPersonalInfo();
      case 1: return renderIdentityDocuments();
      case 2: return renderTravelDetails();
      case 3: return renderEmergencyContacts();
      case 4: return renderHealthInfo();
      case 5: return renderConsent();
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <UserCheck className="h-6 w-6" />
          {mode === 'create' ? 'Tourist Registration' : 'Edit Tourist Information'}
        </h2>
        <p className="text-blue-100 mt-1">
          Complete the registration form to ensure your safety and security during your visit
        </p>
      </div>

      {/* Progress Steps */}
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
                  ${isActive 
                    ? 'border-blue-600 bg-blue-600 text-white' 
                    : isCompleted 
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                  }
                `}>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`ml-4 w-12 h-0.5 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {steps[activeStep].title}
          </h3>
          {activeStep === 0 && (
            <p className="text-sm text-gray-600">
              Please provide your basic personal information for identification purposes.
            </p>
          )}
          {activeStep === 1 && (
            <p className="text-sm text-gray-600">
              Upload your identity documents for verification and security.
            </p>
          )}
          {activeStep === 2 && (
            <p className="text-sm text-gray-600">
              Provide your travel plans and accommodation details for better assistance.
            </p>
          )}
          {activeStep === 3 && (
            <p className="text-sm text-gray-600">
              Add emergency contact information for safety and communication purposes.
            </p>
          )}
          {activeStep === 4 && (
            <p className="text-sm text-gray-600">
              Share relevant health information to ensure appropriate care if needed.
            </p>
          )}
          {activeStep === 5 && (
            <p className="text-sm text-gray-600">
              Review and provide consent for data usage and safety monitoring.
            </p>
          )}
        </div>

        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {activeStep > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}
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
            Step {activeStep + 1} of {steps.length}
          </span>
          
          {activeStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <LoadingButton
              loading={loading}
              onClick={handleSubmit}
              disabled={!formData.trackingConsent || !formData.emergencySharing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="h-4 w-4" />
              {mode === 'create' ? 'Complete Registration' : 'Save Changes'}
            </LoadingButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default TouristForm;
