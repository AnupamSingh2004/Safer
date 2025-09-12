'use client';

import React, { useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar,
  Globe,
  Camera,
  Edit3,
  Save,
  X,
  Upload,
  Check,
  AlertTriangle,
  Shield,
  Flag,
  Users,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserData {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string;
  organization?: string;
  department?: string;
  position?: string;
  location?: {
    country?: string;
    state?: string;
    city?: string;
    address?: string;
    coordinates?: [number, number];
  };
  bio?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  nationality?: string;
  languages?: string[];
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
  };
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
  };
  preferences?: {
    timezone?: string;
    dateFormat?: string;
    language?: string;
    currency?: string;
  };
  verificationStatus?: {
    email: boolean;
    phone: boolean;
    identity: boolean;
  };
  createdAt?: string;
  lastLoginAt?: string;
  isActive?: boolean;
}

interface UserSettingsProps {
  user: UserData | null;
  onChange: (changes: Partial<UserData>) => void;
  pendingChanges: Partial<UserData>;
}

export const UserSettings: React.FC<UserSettingsProps> = ({
  user,
  onChange,
  pendingChanges,
}) => {
  const [editingSections, setEditingSections] = useState<Set<string>>(new Set());
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Merge user data with pending changes
  const currentData = { ...user, ...pendingChanges };

  const toggleEditSection = (section: string) => {
    setEditingSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const updateField = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  const updateNestedField = (parentField: string, childField: string, value: any) => {
    const currentParent = currentData[parentField as keyof UserData] as any || {};
    onChange({
      [parentField]: {
        ...currentParent,
        [childField]: value,
      },
    });
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageUploading(true);
      // Simulate upload - in real app, this would upload to a service
      const reader = new FileReader();
      reader.onload = (e) => {
        updateField('avatar', e.target?.result as string);
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const countries = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 
    'Germany', 'France', 'Japan', 'Singapore', 'UAE'
  ];

  const languages = [
    'English', 'Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati',
    'Urdu', 'Kannada', 'Odia', 'Malayalam', 'Punjabi', 'Spanish', 'French'
  ];

  const timezones = [
    'Asia/Kolkata', 'UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo',
    'Australia/Sydney', 'America/Los_Angeles', 'Europe/Berlin'
  ];

  const currencies = [
    'INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'SGD'
  ];

  const renderSection = (
    title: string,
    sectionKey: string,
    icon: React.ComponentType<{ className?: string }>,
    content: React.ReactNode,
    editable = true
  ) => {
    const Icon = icon;
    const isEditing = editingSections.has(sectionKey);

    return (
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <Icon className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900">{title}</h3>
          </div>
          {editable && (
            <button
              onClick={() => toggleEditSection(sectionKey)}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isEditing ? (
                <X className="h-4 w-4" />
              ) : (
                <Edit3 className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        <div className="p-4">{content}</div>
      </div>
    );
  };

  const renderField = (
    label: string,
    value: string | undefined,
    field: string,
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'date' = 'text',
    options?: string[],
    isEditing = false,
    placeholder = ''
  ) => {
    if (isEditing) {
      if (type === 'textarea') {
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <textarea
              value={value || ''}
              onChange={(e) => updateField(field, e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={placeholder}
            />
          </div>
        );
      }

      if (type === 'select' && options) {
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <select
              value={value || ''}
              onChange={(e) => updateField(field, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select {label.toLowerCase()}...</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      }

      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <input
            type={type}
            value={value || ''}
            onChange={(e) => updateField(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={placeholder}
          />
        </div>
      );
    }

    return (
      <div>
        <div className="text-sm font-medium text-gray-700">{label}</div>
        <div className="text-gray-900 mt-1">
          {value || (
            <span className="text-gray-400 italic">Not provided</span>
          )}
        </div>
      </div>
    );
  };

  const renderNestedField = (
    label: string,
    value: string | undefined,
    parentField: string,
    childField: string,
    type: 'text' | 'email' | 'tel' | 'select' = 'text',
    options?: string[],
    isEditing = false,
    placeholder = ''
  ) => {
    if (isEditing) {
      if (type === 'select' && options) {
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <select
              value={value || ''}
              onChange={(e) => updateNestedField(parentField, childField, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select {label.toLowerCase()}...</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      }

      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <input
            type={type}
            value={value || ''}
            onChange={(e) => updateNestedField(parentField, childField, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={placeholder}
          />
        </div>
      );
    }

    return (
      <div>
        <div className="text-sm font-medium text-gray-700">{label}</div>
        <div className="text-gray-900 mt-1">
          {value || (
            <span className="text-gray-400 italic">Not provided</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture & Basic Info */}
      {renderSection(
        'Profile Information',
        'basic',
        User,
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-gray-200 overflow-hidden">
                {currentData.avatar ? (
                  <img
                    src={currentData.avatar}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              {editingSections.has('basic') && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1.5 hover:bg-blue-700 transition-colors"
                  disabled={imageUploading}
                >
                  {imageUploading ? (
                    <div className="h-3 w-3 border border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="h-3 w-3" />
                  )}
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Profile Picture</h4>
              <p className="text-sm text-gray-600">
                Upload a photo to help others recognize you
              </p>
            </div>
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField(
              'Full Name',
              currentData.name,
              'name',
              'text',
              undefined,
              editingSections.has('basic'),
              'Enter your full name'
            )}
            {renderField(
              'Email Address',
              currentData.email,
              'email',
              'email',
              undefined,
              editingSections.has('basic'),
              'Enter your email address'
            )}
            {renderField(
              'Phone Number',
              currentData.phone,
              'phone',
              'tel',
              undefined,
              editingSections.has('basic'),
              'Enter your phone number'
            )}
            {renderField(
              'Position/Title',
              currentData.position,
              'position',
              'text',
              undefined,
              editingSections.has('basic'),
              'Your job title or position'
            )}
          </div>

          {renderField(
            'Bio',
            currentData.bio,
            'bio',
            'textarea',
            undefined,
            editingSections.has('basic'),
            'Tell us about yourself...'
          )}
        </div>
      )}

      {/* Personal Details */}
      {renderSection(
        'Personal Details',
        'personal',
        Calendar,
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField(
            'Date of Birth',
            currentData.dateOfBirth,
            'dateOfBirth',
            'date',
            undefined,
            editingSections.has('personal')
          )}
          {renderField(
            'Gender',
            currentData.gender,
            'gender',
            'select',
            ['male', 'female', 'other', 'prefer_not_to_say'],
            editingSections.has('personal')
          )}
          {renderField(
            'Nationality',
            currentData.nationality,
            'nationality',
            'select',
            countries,
            editingSections.has('personal')
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Languages
            </label>
            {editingSections.has('personal') ? (
              <select
                multiple
                value={currentData.languages || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  updateField('languages', selected);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                size={4}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-gray-900 mt-1">
                {currentData.languages && currentData.languages.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {currentData.languages.map((lang) => (
                      <span
                        key={lang}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">No languages specified</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Organization */}
      {renderSection(
        'Organization',
        'organization',
        Building,
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField(
            'Organization',
            currentData.organization,
            'organization',
            'text',
            undefined,
            editingSections.has('organization'),
            'Your organization or company'
          )}
          {renderField(
            'Department',
            currentData.department,
            'department',
            'text',
            undefined,
            editingSections.has('organization'),
            'Your department or division'
          )}
          <div className="md:col-span-2">
            <div className="text-sm font-medium text-gray-700">Role</div>
            <div className="text-gray-900 mt-1 flex items-center gap-2">
              <span className={cn(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                currentData.role === 'super_admin' && 'bg-purple-100 text-purple-800',
                currentData.role === 'admin' && 'bg-blue-100 text-blue-800',
                currentData.role === 'operator' && 'bg-green-100 text-green-800',
                currentData.role === 'tourist' && 'bg-yellow-100 text-yellow-800',
                !currentData.role && 'bg-gray-100 text-gray-800'
              )}>
                <Shield className="h-3 w-3 mr-1" />
                {currentData.role || 'No role assigned'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Location */}
      {renderSection(
        'Location',
        'location',
        MapPin,
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderNestedField(
            'Country',
            currentData.location?.country,
            'location',
            'country',
            'select',
            countries,
            editingSections.has('location')
          )}
          {renderNestedField(
            'State/Province',
            currentData.location?.state,
            'location',
            'state',
            'text',
            undefined,
            editingSections.has('location'),
            'Enter your state or province'
          )}
          {renderNestedField(
            'City',
            currentData.location?.city,
            'location',
            'city',
            'text',
            undefined,
            editingSections.has('location'),
            'Enter your city'
          )}
          <div className="md:col-span-2">
            {renderNestedField(
              'Address',
              currentData.location?.address,
              'location',
              'address',
              'text',
              undefined,
              editingSections.has('location'),
              'Enter your full address'
            )}
          </div>
        </div>
      )}

      {/* Emergency Contact */}
      {renderSection(
        'Emergency Contact',
        'emergency',
        Users,
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderNestedField(
            'Name',
            currentData.emergencyContact?.name,
            'emergencyContact',
            'name',
            'text',
            undefined,
            editingSections.has('emergency'),
            'Emergency contact name'
          )}
          {renderNestedField(
            'Relationship',
            currentData.emergencyContact?.relationship,
            'emergencyContact',
            'relationship',
            'text',
            undefined,
            editingSections.has('emergency'),
            'Relationship to you'
          )}
          {renderNestedField(
            'Phone',
            currentData.emergencyContact?.phone,
            'emergencyContact',
            'phone',
            'tel',
            undefined,
            editingSections.has('emergency'),
            'Emergency contact phone'
          )}
          {renderNestedField(
            'Email',
            currentData.emergencyContact?.email,
            'emergencyContact',
            'email',
            'email',
            undefined,
            editingSections.has('emergency'),
            'Emergency contact email'
          )}
        </div>
      )}

      {/* Preferences */}
      {renderSection(
        'Preferences',
        'preferences',
        Globe,
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderNestedField(
            'Timezone',
            currentData.preferences?.timezone,
            'preferences',
            'timezone',
            'select',
            timezones,
            editingSections.has('preferences')
          )}
          {renderNestedField(
            'Language',
            currentData.preferences?.language,
            'preferences',
            'language',
            'select',
            languages,
            editingSections.has('preferences')
          )}
          {renderNestedField(
            'Currency',
            currentData.preferences?.currency,
            'preferences',
            'currency',
            'select',
            currencies,
            editingSections.has('preferences')
          )}
          {renderNestedField(
            'Date Format',
            currentData.preferences?.dateFormat,
            'preferences',
            'dateFormat',
            'select',
            ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
            editingSections.has('preferences')
          )}
        </div>
      )}

      {/* Verification Status */}
      {renderSection(
        'Verification Status',
        'verification',
        Shield,
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Email Verification</span>
            <div className="flex items-center gap-2">
              {currentData.verificationStatus?.email ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Verified</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-600">Pending</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Phone Verification</span>
            <div className="flex items-center gap-2">
              {currentData.verificationStatus?.phone ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Verified</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-600">Pending</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Identity Verification</span>
            <div className="flex items-center gap-2">
              {currentData.verificationStatus?.identity ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Verified</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-600">Pending</span>
                </>
              )}
            </div>
          </div>
        </div>,
        false
      )}

      {/* Account Status */}
      {currentData.createdAt && renderSection(
        'Account Information',
        'account',
        Calendar,
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-700">Member Since</div>
            <div className="text-gray-900 mt-1">
              {new Date(currentData.createdAt).toLocaleDateString()}
            </div>
          </div>
          {currentData.lastLoginAt && (
            <div>
              <div className="text-sm font-medium text-gray-700">Last Login</div>
              <div className="text-gray-900 mt-1">
                {new Date(currentData.lastLoginAt).toLocaleString()}
              </div>
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-700">Account Status</div>
            <div className="text-gray-900 mt-1 flex items-center gap-2">
              <div className={cn(
                'h-2 w-2 rounded-full',
                currentData.isActive ? 'bg-green-400' : 'bg-red-400'
              )} />
              <span>{currentData.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>,
        false
      )}
    </div>
  );
};