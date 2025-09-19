/**
 * Smart Tourist Safety System - Police Department Dashboard
 * Specialized dashboard for police operations with digital ID records, alert history, 
 * last known locations, and automated E-FIR generation
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  Users,
  MapPin,
  FileText,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Phone,
  MessageSquare,
  Navigation,
  UserCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Activity,
  Database,
  Fingerprint,
  Camera,
  Brain,
  BadgeCheck,
  Siren
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoleGuard } from '@/components/auth/role-guard';
import { EnhancedAnomalyDetection } from '@/components/dashboard/analytics/enhanced-anomaly-detection';
import { EFIRGeneration } from '@/components/dashboard/analytics/efir-generation';
import { InvestigationTools } from '@/components/dashboard/analytics/investigation-tools';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface DigitalIDRecord {
  id: string;
  touristId: string;
  touristName: string;
  nationality: string;
  passportNumber: string;
  digitalIdHash: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  issueDate: string;
  expiryDate: string;
  lastAccessed: string;
  biometricData: {
    fingerprint: boolean;
    faceId: boolean;
    signature: boolean;
  };
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
  }>;
}

interface AlertHistory {
  id: string;
  touristId: string;
  touristName: string;
  alertType: 'missing' | 'emergency' | 'suspicious' | 'medical' | 'safety';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: {
    coordinates: [number, number];
    address: string;
    zone: string;
  };
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved' | 'closed';
  assignedOfficer?: string;
  responseTime?: number;
  resolution?: string;
}

interface LastKnownLocation {
  touristId: string;
  touristName: string;
  location: {
    coordinates: [number, number];
    address: string;
    zone: string;
  };
  timestamp: string;
  accuracy: number;
  source: 'gps' | 'wifi' | 'cellular' | 'manual';
  batteryLevel?: number;
  isEmergency: boolean;
}

interface MissingPersonCase {
  id: string;
  firNumber?: string;
  touristId: string;
  touristName: string;
  age: number;
  nationality: string;
  lastSeenLocation: string;
  lastSeenTime: string;
  reportedBy: string;
  reportedTime: string;
  status: 'missing' | 'investigating' | 'found' | 'closed';
  assignedOfficer: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  evidenceFiles: string[];
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockDigitalIDs: DigitalIDRecord[] = [
  {
    id: 'DID-001',
    touristId: 'T001',
    touristName: 'John Smith',
    nationality: 'United States',
    passportNumber: 'US123456789',
    digitalIdHash: '0x1234...abcd',
    verificationStatus: 'verified',
    issueDate: '2024-01-15T10:00:00Z',
    expiryDate: '2024-07-15T10:00:00Z',
    lastAccessed: '2024-01-20T14:30:00Z',
    biometricData: {
      fingerprint: true,
      faceId: true,
      signature: true
    },
    emergencyContacts: [
      { name: 'Jane Smith', relationship: 'Spouse', phone: '+1-555-0124' }
    ]
  },
  {
    id: 'DID-002',
    touristId: 'T002',
    touristName: 'Maria Garcia',
    nationality: 'Spain',
    passportNumber: 'ES987654321',
    digitalIdHash: '0x5678...efgh',
    verificationStatus: 'pending',
    issueDate: '2024-01-20T09:00:00Z',
    expiryDate: '2024-07-20T09:00:00Z',
    lastAccessed: '2024-01-20T15:45:00Z',
    biometricData: {
      fingerprint: true,
      faceId: false,
      signature: true
    },
    emergencyContacts: [
      { name: 'Carlos Garcia', relationship: 'Brother', phone: '+34-666-789-012' }
    ]
  }
];

const mockAlertHistory: AlertHistory[] = [
  {
    id: 'ALT-001',
    touristId: 'T002',
    touristName: 'Maria Garcia',
    alertType: 'missing',
    severity: 'high',
    description: 'Tourist reported missing near India Gate',
    location: {
      coordinates: [77.2295, 28.6129],
      address: 'India Gate, Rajpath, New Delhi',
      zone: 'Zone A - Central Delhi'
    },
    timestamp: '2024-01-20T16:30:00Z',
    status: 'investigating',
    assignedOfficer: 'Inspector Raj Kumar',
    responseTime: 15
  },
  {
    id: 'ALT-002',
    touristId: 'T003',
    touristName: 'David Wilson',
    alertType: 'emergency',
    severity: 'critical',
    description: 'Emergency SOS button activated',
    location: {
      coordinates: [77.2500, 28.5525],
      address: 'Lotus Temple, Bahapur, New Delhi',
      zone: 'Zone B - South Delhi'
    },
    timestamp: '2024-01-20T14:15:00Z',
    status: 'resolved',
    assignedOfficer: 'Inspector Priya Singh',
    responseTime: 8,
    resolution: 'False alarm - accidental activation'
  }
];

const mockLastKnownLocations: LastKnownLocation[] = [
  {
    touristId: 'T001',
    touristName: 'John Smith',
    location: {
      coordinates: [77.2411, 28.6562],
      address: 'Red Fort, Netaji Subhash Marg, New Delhi',
      zone: 'Zone A - Central Delhi'
    },
    timestamp: '2024-01-20T15:30:00Z',
    accuracy: 5,
    source: 'gps',
    batteryLevel: 78,
    isEmergency: false
  },
  {
    touristId: 'T002',
    touristName: 'Maria Garcia',
    location: {
      coordinates: [77.2295, 28.6129],
      address: 'India Gate, Rajpath, New Delhi',
      zone: 'Zone A - Central Delhi'
    },
    timestamp: '2024-01-20T16:15:00Z',
    accuracy: 3,
    source: 'gps',
    batteryLevel: 23,
    isEmergency: true
  }
];

const mockMissingPersons: MissingPersonCase[] = [
  {
    id: 'MP-001',
    firNumber: 'FIR-2024-001',
    touristId: 'T002',
    touristName: 'Maria Garcia',
    age: 28,
    nationality: 'Spain',
    lastSeenLocation: 'India Gate, New Delhi',
    lastSeenTime: '2024-01-20T16:15:00Z',
    reportedBy: 'Tour Guide - Carlos Mendez',
    reportedTime: '2024-01-20T18:00:00Z',
    status: 'investigating',
    assignedOfficer: 'Inspector Raj Kumar',
    priority: 'high',
    description: 'Tourist separated from group during India Gate visit. Last seen taking photos near the monument.',
    evidenceFiles: ['photo1.jpg', 'witness_statement.pdf']
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PoliceDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'investigations' | 'digital-ids' | 'locations' | 'missing-persons' | 'efir-generation' | 'anomaly-detection'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Stats calculations
  const stats = {
    totalDigitalIDs: mockDigitalIDs.length,
    verifiedIDs: mockDigitalIDs.filter(id => id.verificationStatus === 'verified').length,
    activeAlerts: mockAlertHistory.filter(alert => alert.status === 'active' || alert.status === 'investigating').length,
    missingPersons: mockMissingPersons.filter(mp => mp.status === 'missing' || mp.status === 'investigating').length,
    averageResponseTime: 12
  };

  return (
    <RoleGuard requiredRoles={['super_admin', 'police_admin', 'operator']}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Shield className="h-8 w-8 mr-3" />
                Police Command Center
              </h1>
              <p className="text-blue-100 dark:text-blue-200">
                Emergency Response & Investigation Portal
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-200 dark:text-blue-300">Status</div>
              <div className="text-2xl font-bold flex items-center">
                <Activity className="h-6 w-6 mr-2" />
                Active
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatCard
            title="Active Alerts"
            value={stats.activeAlerts.toString()}
            icon={<AlertTriangle className="h-6 w-6" />}
            subtitle="+3 in last hour"
            color="red"
          />
          <StatCard
            title="Active Cases"
            value="28"
            icon={<FileText className="h-6 w-6" />}
            subtitle="5 resolved today"
            color="blue"
          />
          <StatCard
            title="ID Verifications"
            value={stats.verifiedIDs.toString()}
            icon={<BadgeCheck className="h-6 w-6" />}
            subtitle="Today"
            color="green"
          />
          <StatCard
            title="Missing Persons"
            value={stats.missingPersons.toString()}
            icon={<Users className="h-6 w-6" />}
            subtitle="Under investigation"
            color="yellow"
          />
          <StatCard
            title="Response Time"
            value={`${stats.averageResponseTime}m`}
            icon={<Clock className="h-6 w-6" />}
            subtitle="Average"
            color="purple"
          />
          <StatCard
            title="Missing Persons"
            value={stats.missingPersons.toString()}
            icon={<Users className="h-6 w-6" />}
            subtitle="Active cases"
            color="red"
          />
          <StatCard
            title="Avg Response"
            value={`${stats.averageResponseTime}min`}
            icon={<Clock className="h-6 w-6" />}
            subtitle="Emergency response"
            color="green"
          />
          <StatCard
            title="Locations Tracked"
            value={mockLastKnownLocations.length.toString()}
            icon={<MapPin className="h-6 w-6" />}
            subtitle="Real-time tracking"
            color="purple"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
              { id: 'investigations', label: 'Investigations', icon: Search },
              { id: 'digital-ids', label: 'ID Verification', icon: BadgeCheck },
              { id: 'locations', label: 'Locations', icon: MapPin },
              { id: 'missing-persons', label: 'Missing Persons', icon: Users },
              { id: 'efir-generation', label: 'E-FIR', icon: FileText },
              { id: 'anomaly-detection', label: 'AI Anomaly', icon: Brain }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'alerts' && <AlertHistoryTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
          {activeTab === 'investigations' && <InvestigationTools />}
          {activeTab === 'digital-ids' && <DigitalIDsTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
          {activeTab === 'locations' && <LocationsTab />}
          {activeTab === 'missing-persons' && <MissingPersonsTab />}
          {activeTab === 'efir-generation' && <EFIRGeneration />}
          {activeTab === 'anomaly-detection' && <EnhancedAnomalyDetection />}
        </div>
      </div>
    </RoleGuard>
  );
}

// ============================================================================
// TAB COMPONENTS
// ============================================================================

const OverviewTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Critical Alerts */}
      <Card className="p-6 bg-card dark:bg-card border-border dark:border-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500 dark:text-red-400" />
          Critical Alerts (Last 24h)
        </h3>
        <div className="space-y-3">
          {mockAlertHistory.filter(alert => alert.severity === 'critical' || alert.severity === 'high').map((alert) => (
            <div key={alert.id} className="flex items-start justify-between p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex-1">
                <div className="font-medium text-foreground">{alert.touristName}</div>
                <div className="text-sm text-muted-foreground">{alert.description}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </div>
              </div>
              <Badge variant={alert.status === 'active' ? 'destructive' : 'secondary'}>
                {alert.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Missing Persons Summary */}
      <Card className="p-6 bg-card dark:bg-card border-border dark:border-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          <Users className="h-5 w-5 mr-2 text-orange-500 dark:text-orange-400" />
          Missing Persons Cases
        </h3>
        <div className="space-y-3">
          {mockMissingPersons.map((mp) => (
            <div key={mp.id} className="flex items-start justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex-1">
                <div className="font-medium text-foreground">{mp.touristName}</div>
                <div className="text-sm text-muted-foreground">
                  {mp.nationality} • Age {mp.age}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Last seen: {mp.lastSeenLocation}
                </div>
              </div>
              <div className="text-right">
                <Badge variant={mp.priority === 'high' ? 'destructive' : 'secondary'}>
                  {mp.priority}
                </Badge>
                {mp.firNumber && (
                  <div className="text-xs text-muted-foreground mt-1">{mp.firNumber}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-card dark:bg-card border-border dark:border-border">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
            <FileText className="h-6 w-6 mb-2" />
            <span className="text-sm">Generate E-FIR</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
            <Search className="h-6 w-6 mb-2" />
            <span className="text-sm">Search Tourist</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
            <MapPin className="h-6 w-6 mb-2" />
            <span className="text-sm">Track Location</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
            <Phone className="h-6 w-6 mb-2" />
            <span className="text-sm">Emergency Call</span>
          </Button>
        </div>
      </Card>

      {/* Real-time Tracking Status */}
      <Card className="p-6 bg-card dark:bg-card border-border dark:border-border">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
          <Activity className="h-5 w-5 mr-2 text-green-500 dark:text-green-400" />
          Real-time Tracking Status
        </h3>
        <div className="space-y-3">
          {mockLastKnownLocations.map((location) => (
            <div key={location.touristId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div>
                <div className="font-medium text-foreground">{location.touristName}</div>
                <div className="text-sm text-muted-foreground">{location.location.zone}</div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                  location.isEmergency 
                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' 
                    : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                }`}>
                  {location.isEmergency ? 'Emergency' : 'Safe'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(location.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const DigitalIDsTab: React.FC<{ searchTerm: string; setSearchTerm: (term: string) => void }> = ({ 
  searchTerm, 
  setSearchTerm 
}) => {
  const filteredIDs = mockDigitalIDs.filter(id => 
    id.touristName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    id.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
    id.passportNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, nationality, or passport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Digital IDs List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredIDs.map((id) => (
          <Card key={id.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Fingerprint className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{id.touristName}</h4>
                  <p className="text-sm text-gray-600">{id.nationality}</p>
                </div>
              </div>
              <Badge 
                variant={
                  id.verificationStatus === 'verified' ? 'default' : 
                  id.verificationStatus === 'pending' ? 'secondary' : 'destructive'
                }
              >
                {id.verificationStatus}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Passport:</span>
                <span className="font-medium">{id.passportNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Digital ID:</span>
                <span className="font-mono text-xs">{id.digitalIdHash}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Issued:</span>
                <span>{new Date(id.issueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Access:</span>
                <span>{new Date(id.lastAccessed).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Biometric Status */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-600 mb-2">Biometric Verification</div>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-1">
                  {id.biometricData.fingerprint ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-xs">Fingerprint</span>
                </div>
                <div className="flex items-center space-x-1">
                  {id.biometricData.faceId ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-xs">Face ID</span>
                </div>
                <div className="flex items-center space-x-1">
                  {id.biometricData.signature ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-xs">Signature</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button size="sm" variant="outline">
                <Phone className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AlertHistoryTab: React.FC<{ searchTerm: string; setSearchTerm: (term: string) => void }> = ({ 
  searchTerm, 
  setSearchTerm 
}) => {
  const filteredAlerts = mockAlertHistory.filter(alert => 
    alert.touristName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="all">All Alerts</option>
            <option value="active">Active</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.severity === 'critical' ? 'text-red-500' :
                    alert.severity === 'high' ? 'text-orange-500' :
                    alert.severity === 'medium' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`} />
                  <h4 className="font-semibold text-gray-900">{alert.touristName}</h4>
                  <Badge variant={
                    alert.alertType === 'missing' ? 'destructive' :
                    alert.alertType === 'emergency' ? 'destructive' :
                    'secondary'
                  }>
                    {alert.alertType}
                  </Badge>
                  <Badge variant={
                    alert.severity === 'critical' ? 'destructive' :
                    alert.severity === 'high' ? 'secondary' :
                    'secondary'
                  }>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-2">{alert.description}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{alert.location.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                  {alert.assignedOfficer && (
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-4 w-4" />
                      <span>{alert.assignedOfficer}</span>
                    </div>
                  )}
                  {alert.responseTime && (
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4" />
                      <span>Response time: {alert.responseTime} minutes</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Badge variant={
                  alert.status === 'active' ? 'destructive' :
                  alert.status === 'investigating' ? 'secondary' :
                  alert.status === 'resolved' ? 'default' :
                  'secondary'
                }>
                  {alert.status}
                </Badge>
                <div className="mt-2 space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MapPin className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            {alert.resolution && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-800">Resolution:</div>
                <div className="text-sm text-green-700">{alert.resolution}</div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

const LocationsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Real-time Location Tracking</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Navigation className="h-4 w-4 mr-2" />
            Show on Map
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Locations
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockLastKnownLocations.map((location) => (
          <Card key={location.touristId} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  location.isEmergency ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  <MapPin className={`h-6 w-6 ${
                    location.isEmergency ? 'text-red-600' : 'text-green-600'
                  }`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{location.touristName}</h4>
                  <p className="text-sm text-gray-600">{location.location.zone}</p>
                </div>
              </div>
              <Badge variant={location.isEmergency ? 'destructive' : 'default'}>
                {location.isEmergency ? 'Emergency' : 'Safe'}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium text-right">{location.location.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Coordinates:</span>
                <span className="font-mono text-xs">
                  {location.location.coordinates[1].toFixed(4)}, {location.location.coordinates[0].toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Update:</span>
                <span>{new Date(location.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Accuracy:</span>
                <span>{location.accuracy}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Source:</span>
                <span className="capitalize">{location.source}</span>
              </div>
              {location.batteryLevel && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Battery:</span>
                  <span className={location.batteryLevel < 20 ? 'text-red-600 font-medium' : ''}>
                    {location.batteryLevel}%
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 flex space-x-2">
              <Button size="sm" variant="outline" className="flex-1">
                <MapPin className="h-4 w-4 mr-2" />
                View on Map
              </Button>
              <Button size="sm" variant="outline">
                <Phone className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const MissingPersonsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Missing Persons Cases</h3>
        <div className="flex space-x-2">
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate E-FIR
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {mockMissingPersons.map((mp) => (
          <Card key={mp.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{mp.touristName}</h4>
                  <p className="text-sm text-gray-600">{mp.nationality} • Age {mp.age}</p>
                  {mp.firNumber && (
                    <p className="text-xs text-blue-600 font-medium">{mp.firNumber}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Badge variant={
                  mp.priority === 'urgent' ? 'destructive' :
                  mp.priority === 'high' ? 'secondary' :
                  'secondary'
                }>
                  {mp.priority}
                </Badge>
                <Badge variant={
                  mp.status === 'missing' ? 'destructive' :
                  mp.status === 'investigating' ? 'secondary' :
                  mp.status === 'found' ? 'default' :
                  'secondary'
                } className="ml-2">
                  {mp.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-gray-700">{mp.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Last Seen:</span>
                  <div className="font-medium">{mp.lastSeenLocation}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(mp.lastSeenTime).toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Reported By:</span>
                  <div className="font-medium">{mp.reportedBy}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(mp.reportedTime).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Assigned Officer:</span>
                <div className="font-medium">{mp.assignedOfficer}</div>
              </div>

              {mp.evidenceFiles.length > 0 && (
                <div>
                  <span className="text-gray-600 text-sm">Evidence Files:</span>
                  <div className="flex space-x-2 mt-1">
                    {mp.evidenceFiles.map((file, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-xs rounded">
                        <Camera className="h-3 w-3 mr-1" />
                        {file}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex space-x-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View Case
              </Button>
              <Button size="sm" variant="outline">
                <MapPin className="h-4 w-4 mr-2" />
                Last Location
              </Button>
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Update FIR
              </Button>
              <Button size="sm" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Contact
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, subtitle, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400',
    red: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400',
    purple: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400'
  };

  return (
    <Card className={`p-4 border-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-70">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs opacity-70">{subtitle}</p>
        </div>
        <div className="opacity-60">
          {icon}
        </div>
      </div>
    </Card>
  );
};