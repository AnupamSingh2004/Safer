/**
 * Smart Tourist Safety System - Tourist Details Component
 * Detailed view modal for individual tourist information
 */

'use client';

import React, { useState } from 'react';
import { 
  X,
  User,
  Shield,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  Clock,
  Edit,
  FileText,
  Users,
  Activity,
  CheckCircle,
  XCircle,
  Eye,
  Download
} from 'lucide-react';
import type { Tourist } from '@/types/tourist';

// ============================================================================
// INTERFACES
// ============================================================================

interface TouristDetailsProps {
  tourist: Tourist;
  isOpen: boolean;
  onClose: () => void;
}

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// ============================================================================
// MOCK DATA HELPERS
// ============================================================================

const generateMockAlerts = (touristId: string) => [
  {
    id: 'alert-001',
    type: 'zone_breach',
    severity: 'medium',
    title: 'Zone Boundary Violation',
    description: 'Tourist exceeded time limit in restricted area',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'resolved'
  },
  {
    id: 'alert-002',
    type: 'safety',
    severity: 'low',
    title: 'Safety Equipment Check',
    description: 'Reminder to verify safety equipment before hiking',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: 'acknowledged'
  }
];

const generateMockLocationHistory = (touristId: string) => [
  {
    id: 'loc-001',
    address: 'City Center Tourist Information',
    coordinates: { latitude: 26.9124, longitude: 75.7873 },
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    activity: 'check-in'
  },
  {
    id: 'loc-002',
    address: 'Heritage Palace Museum',
    coordinates: { latitude: 26.9260, longitude: 75.8235 },
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    activity: 'visit'
  },
  {
    id: 'loc-003',
    address: 'Local Market Area',
    coordinates: { latitude: 26.9195, longitude: 75.7895 },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    activity: 'shopping'
  }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    case 'inactive':
      return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
    case 'emergency':
      return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    case 'checked_out':
      return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
    default:
      return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low':
      return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    case 'high':
      return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    case 'critical':
      return 'text-red-800 bg-red-100 dark:bg-red-900/30';
    default:
      return 'text-gray-600 bg-gray-50 dark:bg-gray-800';
  }
};

// ============================================================================
// TABS COMPONENT
// ============================================================================

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'location', label: 'Location History', icon: <MapPin className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alerts', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TouristDetails: React.FC<TouristDetailsProps> = ({ tourist, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const mockAlerts = generateMockAlerts(tourist.id);
  const mockLocationHistory = generateMockLocationHistory(tourist.id);

  if (!isOpen) return null;

  // ========================================================================
  // TAB CONTENT RENDERERS
  // ========================================================================

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Personal Information
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{tourist.fullName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{formatDate(tourist.dateOfBirth)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Nationality</p>
                <p className="font-medium">{tourist.nationality}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium capitalize">{tourist.gender}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Contact Information
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{tourist.contactInfo?.phone || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium">{tourist.contactInfo?.email || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Current Location</p>
                <p className="font-medium">
                  {tourist.currentLocation?.address || 'Location not available'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status and Verification */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Status</span>
          </div>
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tourist.status)}`}>
            {tourist.status.charAt(0).toUpperCase() + tourist.status.slice(1)}
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Verification</span>
          </div>
          <div className="flex items-center gap-2">
            {tourist.verificationStatus === 'verified' ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <span className="text-sm font-medium capitalize">
              {tourist.verificationStatus}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Last Updated</span>
          </div>
          <span className="text-sm font-medium">
            {formatDateTime(tourist.lastUpdateDate)}
          </span>
        </div>
      </div>

      {/* Emergency Contacts */}
      {tourist.emergencyContacts && tourist.emergencyContacts.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Emergency Contacts
          </h4>
          <div className="space-y-3">
            {tourist.emergencyContacts.map((contact, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{contact.relation}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{contact.phone}</p>
                  {contact.email && (
                    <p className="text-sm text-gray-500">{contact.email}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderLocationTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Location History
        </h4>
        <button className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
          <Eye className="w-4 h-4" />
          View on Map
        </button>
      </div>
      
      <div className="space-y-3">
        {mockLocationHistory.map((location, index) => (
          <div 
            key={location.id}
            className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{location.address}</p>
              <p className="text-sm text-gray-500 capitalize">{location.activity}</p>
              <p className="text-xs text-gray-400">{formatDateTime(location.timestamp)}</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>{location.coordinates.latitude.toFixed(4)}</p>
              <p>{location.coordinates.longitude.toFixed(4)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAlertsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Alert History
        </h4>
        <button className="flex items-center gap-2 px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
          <AlertTriangle className="w-4 h-4" />
          Create Alert
        </button>
      </div>
      
      <div className="space-y-3">
        {mockAlerts.map((alert) => (
          <div 
            key={alert.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">{alert.type.replace('_', ' ')}</span>
                </div>
                <h5 className="font-medium mb-1">{alert.title}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{alert.description}</p>
                <p className="text-xs text-gray-500">{formatDateTime(alert.timestamp)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  alert.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {alert.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Identity Documents
        </h4>
        <button className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="w-4 h-4" />
          Download All
        </button>
      </div>
      
      <div className="space-y-3">
        {tourist.documents?.map((doc, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium capitalize">{doc.type.replace('_', ' ')}</p>
                <p className="text-sm text-gray-500">Number: {doc.documentNumber}</p>
                <p className="text-xs text-gray-400">
                  Expires: {formatDate(doc.expiryDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {doc.isVerified ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <button className="p-1 text-gray-400 hover:text-blue-600">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-green-600">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        )) || (
          <p className="text-center text-gray-500 py-8">
            No documents uploaded
          </p>
        )}
      </div>
    </div>
  );

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">
                    {tourist.firstName?.charAt(0) || '?'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {tourist.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Tourist ID: {tourist.id}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 py-2">
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-96 overflow-y-auto">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'location' && renderLocationTab()}
            {activeTab === 'alerts' && renderAlertsTab()}
            {activeTab === 'documents' && renderDocumentsTab()}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristDetails;
