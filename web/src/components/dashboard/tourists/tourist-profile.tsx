/**
 * Smart Tourist Safety System - Tourist Profile Component
 * Displays comprehensive tourist information with edit capabilities
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  FileText,
  Shield,
  Heart,
  Users,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Clock,
  Navigation,
  Camera,
  Download,
  Share2,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface TouristData {
  id: string;
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  profilePhoto?: string;
  
  // Identity Documents
  identityType: 'aadhar' | 'passport' | 'voter_id' | 'driving_license';
  identityNumber: string;
  identityDocument?: string;
  
  // Travel Information
  visitorType: 'domestic' | 'international';
  checkInDate: string;
  checkOutDate: string;
  accommodation: string;
  purposeOfVisit: 'tourism' | 'business' | 'education' | 'medical' | 'other';
  
  // Emergency Contacts
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  }>;
  
  // Medical Information
  medicalConditions?: string[];
  medications?: string[];
  allergies?: string[];
  bloodGroup?: string;
  
  // Status
  status: 'active' | 'checked_out' | 'emergency' | 'inactive';
  riskLevel: 'low' | 'medium' | 'high';
  lastLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
    address?: string;
  };
  
  // System
  registrationDate: string;
  lastUpdated: string;
  digitalId?: string;
  qrCode?: string;
}

interface TouristProfileProps {
  touristId: string;
  initialData?: TouristData;
  onEdit?: (touristId: string) => void;
  onDelete?: (touristId: string) => void;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockTouristData: TouristData = {
  id: 'T001',
  firstName: 'Raj',
  lastName: 'Kumar',
  email: 'raj.kumar@email.com',
  phone: '+91-9876543210',
  dateOfBirth: '1990-05-15',
  gender: 'male',
  nationality: 'Indian',
  profilePhoto: '/api/placeholder/150/150',
  identityType: 'aadhar',
  identityNumber: '1234-5678-9012',
  identityDocument: '/documents/aadhar-raj-kumar.pdf',
  visitorType: 'domestic',
  checkInDate: '2024-01-15',
  checkOutDate: '2024-01-20',
  accommodation: 'Hotel Paradise, MG Road, Bangalore - Booking Ref: #HP12345',
  purposeOfVisit: 'tourism',
  emergencyContacts: [
    {
      name: 'Priya Kumar',
      relationship: 'Spouse',
      phone: '+91-9876543211',
      email: 'priya.kumar@email.com',
    },
    {
      name: 'Vikram Kumar',
      relationship: 'Brother',
      phone: '+91-9876543212',
      email: 'vikram.kumar@email.com',
    },
  ],
  medicalConditions: ['Diabetes Type 2'],
  medications: ['Metformin 500mg'],
  allergies: ['Peanuts', 'Shellfish'],
  bloodGroup: 'B+',
  status: 'active',
  riskLevel: 'low',
  lastLocation: {
    latitude: 12.9716,
    longitude: 77.5946,
    timestamp: '2024-01-16T10:30:00Z',
    address: 'MG Road, Bangalore, Karnataka',
  },
  registrationDate: '2024-01-15T09:00:00Z',
  lastUpdated: '2024-01-16T10:30:00Z',
  digitalId: 'DID:TOURIST:001:2024',
  qrCode: '/api/qr-codes/tourist-T001.png',
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TouristProfile({
  touristId,
  initialData,
  onEdit,
  onDelete,
}: TouristProfileProps) {
  const router = useRouter();
  const [touristData, setTouristData] = useState<TouristData>(
    initialData || mockTouristData
  );
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'checked_out':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'emergency':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getRiskStyle = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Tabs
  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'travel', label: 'Travel Details', icon: MapPin },
    { id: 'emergency', label: 'Emergency Contacts', icon: Phone },
    { id: 'medical', label: 'Medical Info', icon: Heart },
    { id: 'location', label: 'Location', icon: Navigation },
  ];

  // Handle actions
  const handleEdit = () => {
    if (onEdit) {
      onEdit(touristId);
    } else {
      router.push(`/dashboard/tourists/${touristId}/edit`);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(touristId);
    }
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Personal Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-20">Name:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {touristData.firstName} {touristData.lastName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-20">Email:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {touristData.email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-20">Phone:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {touristData.phone}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-20">DOB:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(touristData.dateOfBirth)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Status & Risk
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-20">Status:</span>
                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusStyle(touristData.status))}>
                      {touristData.status.charAt(0).toUpperCase() + touristData.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-20">Risk:</span>
                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getRiskStyle(touristData.riskLevel))}>
                      {touristData.riskLevel.charAt(0).toUpperCase() + touristData.riskLevel.slice(1)}
                    </span>
                  </div>
                  {touristData.digitalId && (
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-20">Digital ID:</span>
                      <span className="text-sm text-gray-900 dark:text-white font-mono">
                        {touristData.digitalId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                Identity Document
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {touristData.identityType.charAt(0).toUpperCase() + touristData.identityType.slice(1)} Card
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {touristData.identityNumber}
                    </p>
                  </div>
                  {touristData.identityDocument && (
                    <button className="flex items-center px-3 py-2 text-sm text-primary hover:text-primary/80">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'travel':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Travel Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24">Type:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {touristData.visitorType.charAt(0).toUpperCase() + touristData.visitorType.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24">Purpose:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {touristData.purposeOfVisit.charAt(0).toUpperCase() + touristData.purposeOfVisit.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24">Check-in:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(touristData.checkInDate)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-24">Check-out:</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(touristData.checkOutDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Duration
                </h4>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-lg font-semibold text-blue-900 dark:text-blue-400">
                    {Math.ceil((new Date(touristData.checkOutDate).getTime() - new Date(touristData.checkInDate).getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Total stay duration</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                Accommodation Details
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-900 dark:text-white">
                  {touristData.accommodation}
                </p>
              </div>
            </div>
          </div>
        );

      case 'emergency':
        return (
          <div className="space-y-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Emergency Contacts
            </h4>
            <div className="space-y-4">
              {touristData.emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {contact.name}
                        </span>
                        <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded-full">
                          {contact.relationship}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {contact.phone}
                        </span>
                      </div>
                      {contact.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {contact.email}
                          </span>
                        </div>
                      )}
                    </div>
                    <button className="p-2 text-green-600 hover:text-green-700">
                      <Phone className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'medical':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Basic Information
                </h4>
                {touristData.bloodGroup && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 text-red-600 mr-2" />
                      <span className="font-medium text-red-900 dark:text-red-400">
                        Blood Group: {touristData.bloodGroup}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {touristData.medicalConditions && touristData.medicalConditions.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Medical Conditions
                </h4>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <ul className="space-y-1">
                    {touristData.medicalConditions.map((condition, index) => (
                      <li key={index} className="text-sm text-yellow-800 dark:text-yellow-300">
                        • {condition}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {touristData.medications && touristData.medications.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Current Medications
                </h4>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <ul className="space-y-1">
                    {touristData.medications.map((medication, index) => (
                      <li key={index} className="text-sm text-blue-800 dark:text-blue-300">
                        • {medication}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {touristData.allergies && touristData.allergies.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Allergies
                </h4>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <ul className="space-y-1">
                    {touristData.allergies.map((allergy, index) => (
                      <li key={index} className="text-sm text-red-800 dark:text-red-300">
                        • {allergy}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );

      case 'location':
        return (
          <div className="space-y-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Current Location
            </h4>
            {touristData.lastLocation ? (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Navigation className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium text-green-900 dark:text-green-400">
                        Last Known Location
                      </span>
                    </div>
                    <p className="text-sm text-green-800 dark:text-green-300">
                      {touristData.lastLocation.address}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {formatDateTime(touristData.lastLocation.timestamp)}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-mono">
                      {touristData.lastLocation.latitude.toFixed(6)}, {touristData.lastLocation.longitude.toFixed(6)}
                    </p>
                  </div>
                  <button className="p-2 text-green-600 hover:text-green-700">
                    <MapPin className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No location data available
                </p>
              </div>
            )}
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
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tourist Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              ID: {touristData.id}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={touristData.profilePhoto || '/api/placeholder/100/100'}
              alt={`${touristData.firstName} ${touristData.lastName}`}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className={cn(
              'absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white dark:border-gray-800',
              touristData.status === 'active' ? 'bg-green-500' :
              touristData.status === 'emergency' ? 'bg-red-500' :
              'bg-gray-400'
            )} />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {touristData.firstName} {touristData.lastName}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {touristData.nationality} • {touristData.gender}
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusStyle(touristData.status))}>
                {touristData.status.replace('_', ' ').charAt(0).toUpperCase() + touristData.status.slice(1)}
              </span>
              <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getRiskStyle(touristData.riskLevel))}>
                {touristData.riskLevel} Risk
              </span>
            </div>
          </div>

          {touristData.qrCode && (
            <div className="text-center">
              <img
                src={touristData.qrCode}
                alt="Tourist QR Code"
                className="w-20 h-20 border rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">QR Code</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  <TabIcon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
          System Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Registered:</span>
            <span className="text-sm text-gray-900 dark:text-white ml-2">
              {formatDateTime(touristData.registrationDate)}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated:</span>
            <span className="text-sm text-gray-900 dark:text-white ml-2">
              {formatDateTime(touristData.lastUpdated)}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Delete Tourist
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete {touristData.firstName} {touristData.lastName}? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TouristProfile;
