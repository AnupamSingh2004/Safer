/**
 * Smart Tourist Safety System - E-FIR Generation System
 * Automated Electronic First Information Report generation for missing person cases
 */

'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  User,
  MapPin,
  Calendar,
  Clock,
  Phone,
  AlertTriangle,
  Download,
  Printer,
  Send,
  Save,
  Camera,
  Paperclip,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  Edit,
  Eye,
  Shield,
  Info,
  Users,
  Building,
  Star,
  Search,
  Upload,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface EFIRData {
  id: string;
  firNumber: string;
  generatedAt: string;
  status: 'draft' | 'submitted' | 'acknowledged' | 'under_investigation' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Missing Person Details
  missingPerson: {
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    nationality: string;
    passportNumber?: string;
    visaNumber?: string;
    localContactNumber?: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
      email?: string;
      address: string;
    };
    physicalDescription: {
      height: string;
      weight: string;
      complexion: string;
      hairColor: string;
      clothing: string;
      distinctiveMarks?: string;
    };
    medicalConditions?: string;
    languages: string[];
  };

  // Incident Details
  incident: {
    reportedBy: string;
    reporterDesignation: string;
    dateOfOccurrence: string;
    timeOfOccurrence: string;
    lastSeenLocation: {
      address: string;
      coordinates: [number, number];
      landmark?: string;
    };
    circumstancesOfDisappearance: string;
    suspiciousActivity?: string;
    possibleReasons: string[];
  };

  // Investigation Details
  investigation: {
    assignedOfficer: string;
    initialActions: string[];
    evidenceCollected: {
      type: string;
      description: string;
      collectedBy: string;
      timestamp: string;
    }[];
    witnessStatements: {
      name: string;
      contact: string;
      statement: string;
      recordedBy: string;
      timestamp: string;
    }[];
    searchAreas: {
      location: string;
      searchedBy: string;
      result: string;
      timestamp: string;
    }[];
  };

  // Digital Evidence
  digitalEvidence: {
    lastKnownLocation: {
      coordinates: [number, number];
      timestamp: string;
      accuracy: number;
      source: string;
    };
    deviceInformation: {
      phoneNumber?: string;
      lastActivity: string;
      batteryStatus?: string;
      networkStatus: string;
    };
    digitalFootprint: {
      socialMediaActivity?: string;
      onlineTransactions?: string;
      appUsage?: string;
    };
  };

  // Attachments
  attachments: {
    id: string;
    name: string;
    type: 'photo' | 'document' | 'video' | 'audio';
    description: string;
    uploadedBy: string;
    timestamp: string;
  }[];

  // Administrative
  stationDetails: {
    name: string;
    address: string;
    officerInCharge: string;
    contactNumber: string;
  };
  legalSections: string[];
  remarks?: string;
  updatedAt: string;
}

interface EFIRFormData {
  step: number;
  data: Partial<EFIRData>;
  isValid: boolean;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockEFIRData: EFIRData = {
  id: 'EFIR-2024-001',
  firNumber: 'FIR/2024/001/TSD',
  generatedAt: '2024-01-20T17:00:00Z',
  status: 'draft',
  priority: 'high',
  
  missingPerson: {
    name: 'Maria Garcia',
    age: 28,
    gender: 'female',
    nationality: 'Spanish',
    passportNumber: 'ESP123456789',
    visaNumber: 'VISA2024001',
    localContactNumber: '+91-9876543210',
    emergencyContact: {
      name: 'Carlos Garcia',
      relationship: 'Brother',
      phone: '+34-600123456',
      email: 'carlos.garcia@email.com',
      address: '123 Madrid Street, Madrid, Spain'
    },
    physicalDescription: {
      height: '5\'6"',
      weight: '60 kg',
      complexion: 'Fair',
      hairColor: 'Brown',
      clothing: 'Blue jeans, white t-shirt, red backpack',
      distinctiveMarks: 'Small scar on left hand'
    },
    medicalConditions: 'Diabetic - requires insulin',
    languages: ['Spanish', 'English', 'French']
  },

  incident: {
    reportedBy: 'Inspector Raj Kumar',
    reporterDesignation: 'Tourism Police Inspector',
    dateOfOccurrence: '2024-01-20',
    timeOfOccurrence: '13:15',
    lastSeenLocation: {
      address: 'India Gate, Rajpath, New Delhi',
      coordinates: [77.2295, 28.6129],
      landmark: 'Near the central lawns'
    },
    circumstancesOfDisappearance: 'Tourist was part of a guided tour group. Last seen at India Gate during lunch break. Failed to return to the bus at the designated time. Phone calls going unanswered.',
    suspiciousActivity: 'None reported by tour group members',
    possibleReasons: ['Lost/disoriented', 'Medical emergency', 'Voluntary separation', 'Unknown']
  },

  investigation: {
    assignedOfficer: 'Inspector Raj Kumar (Badge: TSD-001)',
    initialActions: [
      'Contacted emergency contact person',
      'Checked with local hospitals',
      'Reviewed CCTV footage from India Gate area',
      'Coordinated with tour operator'
    ],
    evidenceCollected: [
      {
        type: 'Digital',
        description: 'GPS tracking data from mobile device',
        collectedBy: 'Technical Team',
        timestamp: '2024-01-20T16:30:00Z'
      }
    ],
    witnessStatements: [
      {
        name: 'Tour Guide - Rajesh Sharma',
        contact: '+91-9876543211',
        statement: 'Maria was with the group until lunch time. She mentioned feeling tired and wanted to rest.',
        recordedBy: 'Inspector Raj Kumar',
        timestamp: '2024-01-20T15:30:00Z'
      }
    ],
    searchAreas: [
      {
        location: 'India Gate complex and surrounding areas',
        searchedBy: 'Police Team Alpha',
        result: 'No trace found',
        timestamp: '2024-01-20T16:45:00Z'
      }
    ]
  },

  digitalEvidence: {
    lastKnownLocation: {
      coordinates: [77.2295, 28.6129],
      timestamp: '2024-01-20T13:15:00Z',
      accuracy: 5,
      source: 'Mobile GPS'
    },
    deviceInformation: {
      phoneNumber: '+91-9876543210',
      lastActivity: '2024-01-20T13:20:00Z',
      batteryStatus: '23%',
      networkStatus: 'Offline since 16:45'
    },
    digitalFootprint: {
      socialMediaActivity: 'Last post on Instagram at 13:10 - photo at India Gate',
      appUsage: 'Tourist app last opened at 13:15'
    }
  },

  attachments: [
    {
      id: 'ATT-001',
      name: 'passport_copy.pdf',
      type: 'document',
      description: 'Copy of passport provided by tour operator',
      uploadedBy: 'Inspector Raj Kumar',
      timestamp: '2024-01-20T16:00:00Z'
    },
    {
      id: 'ATT-002',
      name: 'last_photo_india_gate.jpg',
      type: 'photo',
      description: 'Last known photo from social media',
      uploadedBy: 'Technical Team',
      timestamp: '2024-01-20T16:15:00Z'
    }
  ],

  stationDetails: {
    name: 'Tourism Security Division - Central Delhi',
    address: 'Connaught Place, New Delhi - 110001',
    officerInCharge: 'Superintendent K.S. Sharma',
    contactNumber: '+91-11-23456789'
  },
  legalSections: ['Section 346 IPC (Wrongful confinement)', 'Section 365 IPC (Kidnapping)'],
  remarks: 'High priority case due to tourist safety concerns. International coordination required.',
  updatedAt: '2024-01-20T17:00:00Z'
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function EFIRGeneration() {
  const [efirData, setEfirData] = useState<EFIRData>(mockEFIRData);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FileText className="h-4 w-4" /> },
    { id: 'person', label: 'Missing Person', icon: <User className="h-4 w-4" /> },
    { id: 'incident', label: 'Incident Details', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'investigation', label: 'Investigation', icon: <Search className="h-4 w-4" /> },
    { id: 'evidence', label: 'Digital Evidence', icon: <Shield className="h-4 w-4" /> },
    { id: 'attachments', label: 'Attachments', icon: <Paperclip className="h-4 w-4" /> }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800';
      case 'under_investigation': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setEfirData(prev => ({ ...prev, status: 'submitted' }));
    setIsSubmitting(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Handle file upload logic
      console.log('Files to upload:', files);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              E-FIR Generation System
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Electronic First Information Report for Missing Person Cases
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getPriorityColor(efirData.priority)}>
            {efirData.priority.toUpperCase()} PRIORITY
          </Badge>
          <Badge className={getStatusColor(efirData.status)}>
            {efirData.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* FIR Header Info */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">FIR Number</div>
            <div className="text-lg font-bold text-blue-800 dark:text-blue-400">{efirData.firNumber}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Generated At</div>
            <div className="text-lg font-bold text-blue-800 dark:text-blue-400">
              {new Date(efirData.generatedAt).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Missing Person</div>
            <div className="text-lg font-bold text-blue-800 dark:text-blue-400">{efirData.missingPerson.name}</div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" className="gap-2" onClick={() => setIsEditing(!isEditing)}>
          <Edit className="h-4 w-4" />
          {isEditing ? 'View Mode' : 'Edit Mode'}
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => setShowPreview(!showPreview)}>
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
        <Button variant="outline" className="gap-2">
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button variant="outline" className="gap-2">
          <Save className="h-4 w-4" />
          Save Draft
        </Button>
        {efirData.status === 'draft' && (
          <Button 
            className="gap-2" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {isSubmitting ? 'Submitting...' : 'Submit FIR'}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && <OverviewTab efirData={efirData} />}
          {activeTab === 'person' && <MissingPersonTab efirData={efirData} isEditing={isEditing} />}
          {activeTab === 'incident' && <IncidentTab efirData={efirData} isEditing={isEditing} />}
          {activeTab === 'investigation' && <InvestigationTab efirData={efirData} isEditing={isEditing} />}
          {activeTab === 'evidence' && <DigitalEvidenceTab efirData={efirData} isEditing={isEditing} />}
          {activeTab === 'attachments' && (
            <AttachmentsTab 
              efirData={efirData} 
              isEditing={isEditing}
              onFileUpload={handleFileUpload}
              fileInputRef={fileInputRef}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto p-6"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">E-FIR Preview</h3>
                <Button variant="ghost" onClick={() => setShowPreview(false)}>
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
              <EFIRPreview efirData={efirData} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// TAB COMPONENTS
// ============================================================================

const OverviewTab: React.FC<{ efirData: EFIRData }> = ({ efirData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <User className="h-5 w-5 text-blue-500" />
        Missing Person Summary
      </h3>
      <div className="space-y-3">
        <div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Name:</span>
          <span className="ml-2 font-medium">{efirData.missingPerson.name}</span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Age:</span>
          <span className="ml-2">{efirData.missingPerson.age}</span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Nationality:</span>
          <span className="ml-2">{efirData.missingPerson.nationality}</span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Seen:</span>
          <span className="ml-2">{efirData.incident.lastSeenLocation.address}</span>
        </div>
      </div>
    </Card>

    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
        Case Status
      </h3>
      <div className="space-y-3">
        <div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned Officer:</span>
          <span className="ml-2">{efirData.investigation.assignedOfficer}</span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Date Reported:</span>
          <span className="ml-2">{efirData.incident.dateOfOccurrence}</span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Time:</span>
          <span className="ml-2">{efirData.incident.timeOfOccurrence}</span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Priority:</span>
          <Badge className={`ml-2 ${efirData.priority === 'high' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {efirData.priority.toUpperCase()}
          </Badge>
        </div>
      </div>
    </Card>

    <Card className="p-6 md:col-span-2">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Info className="h-5 w-5 text-green-500" />
        Initial Actions Taken
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {efirData.investigation.initialActions.map((action, index) => (
          <div key={index} className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-sm">{action}</span>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const MissingPersonTab: React.FC<{ efirData: EFIRData; isEditing: boolean }> = ({ efirData, isEditing }) => (
  <div className="space-y-6">
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</label>
          {isEditing ? (
            <input type="text" defaultValue={efirData.missingPerson.name} className="w-full mt-1 p-2 border rounded-md" />
          ) : (
            <p className="mt-1 font-medium">{efirData.missingPerson.name}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Age</label>
          {isEditing ? (
            <input type="number" defaultValue={efirData.missingPerson.age} className="w-full mt-1 p-2 border rounded-md" />
          ) : (
            <p className="mt-1">{efirData.missingPerson.age}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Gender</label>
          {isEditing ? (
            <select defaultValue={efirData.missingPerson.gender} className="w-full mt-1 p-2 border rounded-md">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          ) : (
            <p className="mt-1 capitalize">{efirData.missingPerson.gender}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Nationality</label>
          {isEditing ? (
            <input type="text" defaultValue={efirData.missingPerson.nationality} className="w-full mt-1 p-2 border rounded-md" />
          ) : (
            <p className="mt-1">{efirData.missingPerson.nationality}</p>
          )}
        </div>
      </div>
    </Card>

    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Physical Description</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(efirData.missingPerson.physicalDescription).map(([key, value]) => (
          <div key={key}>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
              {key.replace(/([A-Z])/g, ' $1')}
            </label>
            {isEditing ? (
              <input type="text" defaultValue={value} className="w-full mt-1 p-2 border rounded-md" />
            ) : (
              <p className="mt-1">{value}</p>
            )}
          </div>
        ))}
      </div>
    </Card>

    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(efirData.missingPerson.emergencyContact).map(([key, value]) => (
          <div key={key}>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
              {key.replace(/([A-Z])/g, ' $1')}
            </label>
            {isEditing ? (
              <input type="text" defaultValue={value} className="w-full mt-1 p-2 border rounded-md" />
            ) : (
              <p className="mt-1">{value}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const IncidentTab: React.FC<{ efirData: EFIRData; isEditing: boolean }> = ({ efirData, isEditing }) => (
  <div className="space-y-6">
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Incident Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Date of Occurrence</label>
          {isEditing ? (
            <input type="date" defaultValue={efirData.incident.dateOfOccurrence} className="w-full mt-1 p-2 border rounded-md" />
          ) : (
            <p className="mt-1">{efirData.incident.dateOfOccurrence}</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Time of Occurrence</label>
          {isEditing ? (
            <input type="time" defaultValue={efirData.incident.timeOfOccurrence} className="w-full mt-1 p-2 border rounded-md" />
          ) : (
            <p className="mt-1">{efirData.incident.timeOfOccurrence}</p>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Seen Location</label>
        {isEditing ? (
          <textarea 
            defaultValue={efirData.incident.lastSeenLocation.address} 
            className="w-full mt-1 p-2 border rounded-md" 
            rows={2}
          />
        ) : (
          <p className="mt-1">{efirData.incident.lastSeenLocation.address}</p>
        )}
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Circumstances of Disappearance</label>
        {isEditing ? (
          <textarea 
            defaultValue={efirData.incident.circumstancesOfDisappearance} 
            className="w-full mt-1 p-2 border rounded-md" 
            rows={4}
          />
        ) : (
          <p className="mt-1">{efirData.incident.circumstancesOfDisappearance}</p>
        )}
      </div>
    </Card>
  </div>
);

const InvestigationTab: React.FC<{ efirData: EFIRData; isEditing: boolean }> = ({ efirData, isEditing }) => (
  <div className="space-y-6">
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Investigation Progress</h3>
      
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned Officer</label>
        <p className="mt-1 font-medium">{efirData.investigation.assignedOfficer}</p>
      </div>

      <div>
        <h4 className="font-medium mb-3">Initial Actions Taken</h4>
        <div className="space-y-2">
          {efirData.investigation.initialActions.map((action, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>

    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Witness Statements</h3>
      {efirData.investigation.witnessStatements.map((witness, index) => (
        <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">{witness.name}</h4>
              <p className="text-sm text-gray-600">{witness.contact}</p>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(witness.timestamp).toLocaleString()}
            </span>
          </div>
          <p className="text-sm">{witness.statement}</p>
          <p className="text-xs text-gray-500 mt-2">Recorded by: {witness.recordedBy}</p>
        </div>
      ))}
    </Card>
  </div>
);

const DigitalEvidenceTab: React.FC<{ efirData: EFIRData; isEditing: boolean }> = ({ efirData, isEditing }) => (
  <div className="space-y-6">
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Last Known Location</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Coordinates</label>
          <p className="mt-1">{efirData.digitalEvidence.lastKnownLocation.coordinates.join(', ')}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Accuracy</label>
          <p className="mt-1">{efirData.digitalEvidence.lastKnownLocation.accuracy}m</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Source</label>
          <p className="mt-1">{efirData.digitalEvidence.lastKnownLocation.source}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Timestamp</label>
          <p className="mt-1">{new Date(efirData.digitalEvidence.lastKnownLocation.timestamp).toLocaleString()}</p>
        </div>
      </div>
    </Card>

    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Device Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(efirData.digitalEvidence.deviceInformation).map(([key, value]) => (
          <div key={key}>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
              {key.replace(/([A-Z])/g, ' $1')}
            </label>
            <p className="mt-1">{value}</p>
          </div>
        ))}
      </div>
    </Card>

    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Digital Footprint</h3>
      <div className="space-y-3">
        {Object.entries(efirData.digitalEvidence.digitalFootprint).map(([key, value]) => (
          <div key={key}>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
              {key.replace(/([A-Z])/g, ' $1')}
            </label>
            <p className="mt-1">{value}</p>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const AttachmentsTab: React.FC<{ 
  efirData: EFIRData; 
  isEditing: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}> = ({ efirData, isEditing, onFileUpload, fileInputRef }) => (
  <div className="space-y-6">
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Attachments</h3>
        {isEditing && (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileUpload}
              multiple
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.mp4,.mp3"
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Add Files
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {efirData.attachments.map((attachment) => (
          <div key={attachment.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {attachment.type === 'photo' && <Camera className="h-4 w-4 text-blue-500" />}
                {attachment.type === 'document' && <FileText className="h-4 w-4 text-green-500" />}
                {attachment.type === 'video' && <Camera className="h-4 w-4 text-purple-500" />}
                {attachment.type === 'audio' && <Phone className="h-4 w-4 text-orange-500" />}
                <span className="font-medium text-sm">{attachment.name}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {attachment.type}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{attachment.description}</p>
            <div className="text-xs text-gray-500">
              <p>Uploaded by: {attachment.uploadedBy}</p>
              <p>{new Date(attachment.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const EFIRPreview: React.FC<{ efirData: EFIRData }> = ({ efirData }) => (
  <div className="space-y-6 max-w-4xl">
    <div className="text-center border-b pb-4">
      <h1 className="text-2xl font-bold">ELECTRONIC FIRST INFORMATION REPORT (E-FIR)</h1>
      <p className="text-lg font-semibold text-blue-600">Missing Person Case</p>
      <p className="text-sm text-gray-600">FIR No: {efirData.firNumber}</p>
    </div>
    
    {/* Rest of the preview content would go here */}
    <div className="space-y-4">
      <div>
        <h3 className="font-bold">1. Missing Person Details</h3>
        <p>Name: {efirData.missingPerson.name}</p>
        <p>Age: {efirData.missingPerson.age}</p>
        <p>Nationality: {efirData.missingPerson.nationality}</p>
      </div>
      
      <div>
        <h3 className="font-bold">2. Incident Details</h3>
        <p>Date: {efirData.incident.dateOfOccurrence}</p>
        <p>Time: {efirData.incident.timeOfOccurrence}</p>
        <p>Location: {efirData.incident.lastSeenLocation.address}</p>
      </div>
      
      {/* Add more preview sections as needed */}
    </div>
  </div>
);

export default EFIRGeneration;