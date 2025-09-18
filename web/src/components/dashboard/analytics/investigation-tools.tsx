/**
 * Smart Tourist Safety System - Investigation and Case Management Tools
 * Comprehensive tools for missing person investigations and case management
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  User,
  Clock,
  Phone,
  FileText,
  Camera,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Eye,
  Download,
  Share,
  Star,
  Navigation,
  Shield,
  Zap,
  Activity,
  Calendar,
  MessageSquare,
  Paperclip,
  Target,
  Crosshair,
  Radio,
  Headphones,
  Wifi,
  Database,
  RefreshCw,
  Filter,
  Archive,
  Flag,
  UserCheck,
  AlertCircle,
  Info,
  ExternalLink,
  Settings,
  Bell,
  Heart,
  Lock,
  Unlock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface InvestigationCase {
  id: string;
  caseNumber: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'pending' | 'closed' | 'cold';
  createdAt: string;
  updatedAt: string;
  assignedOfficer: string;
  leadInvestigator: string;
  
  missingPerson: {
    name: string;
    age: number;
    nationality: string;
    lastSeen: string;
    description: string;
    photo?: string;
  };

  timeline: {
    timestamp: string;
    event: string;
    description: string;
    addedBy: string;
    type: 'info' | 'action' | 'evidence' | 'witness' | 'breakthrough' | 'setback';
  }[];

  evidence: {
    id: string;
    type: 'digital' | 'physical' | 'witness' | 'document' | 'media';
    title: string;
    description: string;
    collectedBy: string;
    collectedAt: string;
    location?: string;
    verified: boolean;
    importance: 'low' | 'medium' | 'high' | 'critical';
  }[];

  searchOperations: {
    id: string;
    area: string;
    coordinates: [number, number];
    radius: number;
    searchType: 'ground' | 'aerial' | 'digital' | 'canine' | 'marine';
    status: 'planned' | 'active' | 'completed' | 'suspended';
    teamLead: string;
    startTime: string;
    endTime?: string;
    result: string;
    resourcesUsed: string[];
  }[];

  contacts: {
    id: string;
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    address: string;
    contactedAt?: string;
    notes?: string;
    reliability: 'high' | 'medium' | 'low';
  }[];

  digitalFootprint: {
    phoneRecords: {
      lastActivity: string;
      location?: [number, number];
      callHistory: string[];
      textMessages: string[];
    };
    socialMedia: {
      platform: string;
      lastActivity: string;
      recentPosts: string[];
    }[];
    financialActivity: {
      lastTransaction: string;
      location?: string;
      amount?: number;
    };
  };

  notes: string;
  tags: string[];
}

interface SearchResource {
  id: string;
  type: 'personnel' | 'vehicle' | 'equipment' | 'k9' | 'technology';
  name: string;
  status: 'available' | 'deployed' | 'maintenance' | 'unavailable';
  location: string;
  contact: string;
  capabilities: string[];
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockInvestigationCases: InvestigationCase[] = [
  {
    id: 'CASE-001',
    caseNumber: 'MP-2024-001',
    title: 'Missing Tourist - Maria Garcia',
    priority: 'high',
    status: 'investigating',
    createdAt: '2024-01-20T16:30:00Z',
    updatedAt: '2024-01-20T18:15:00Z',
    assignedOfficer: 'Inspector Raj Kumar',
    leadInvestigator: 'Inspector Priya Singh',
    
    missingPerson: {
      name: 'Maria Garcia',
      age: 28,
      nationality: 'Spanish',
      lastSeen: 'India Gate, New Delhi',
      description: 'Female, 5\'6", brown hair, wearing blue jeans and white t-shirt with red backpack'
    },

    timeline: [
      {
        timestamp: '2024-01-20T16:30:00Z',
        event: 'Case Opened',
        description: 'Missing person report filed by tour operator',
        addedBy: 'Inspector Raj Kumar',
        type: 'info'
      },
      {
        timestamp: '2024-01-20T16:45:00Z',
        event: 'Initial Search',
        description: 'Ground team dispatched to India Gate area',
        addedBy: 'Inspector Raj Kumar',
        type: 'action'
      },
      {
        timestamp: '2024-01-20T17:30:00Z',
        event: 'Digital Evidence',
        description: 'GPS tracking data recovered from mobile device',
        addedBy: 'Technical Team',
        type: 'evidence'
      },
      {
        timestamp: '2024-01-20T18:00:00Z',
        event: 'Witness Statement',
        description: 'Tour guide provided detailed statement',
        addedBy: 'Inspector Priya Singh',
        type: 'witness'
      }
    ],

    evidence: [
      {
        id: 'EVD-001',
        type: 'digital',
        title: 'GPS Tracking Data',
        description: 'Last known location coordinates from mobile device',
        collectedBy: 'Technical Team',
        collectedAt: '2024-01-20T17:00:00Z',
        verified: true,
        importance: 'high'
      },
      {
        id: 'EVD-002',
        type: 'witness',
        title: 'Tour Guide Statement',
        description: 'Detailed account of last seen behavior and time',
        collectedBy: 'Inspector Priya Singh',
        collectedAt: '2024-01-20T18:00:00Z',
        verified: true,
        importance: 'medium'
      },
      {
        id: 'EVD-003',
        type: 'media',
        title: 'Security Camera Footage',
        description: 'CCTV footage from India Gate security cameras',
        collectedBy: 'Technical Team',
        collectedAt: '2024-01-20T17:45:00Z',
        verified: false,
        importance: 'high'
      }
    ],

    searchOperations: [
      {
        id: 'OP-001',
        area: 'India Gate Complex',
        coordinates: [77.2295, 28.6129],
        radius: 500,
        searchType: 'ground',
        status: 'completed',
        teamLead: 'Sergeant Mohan',
        startTime: '2024-01-20T16:45:00Z',
        endTime: '2024-01-20T18:30:00Z',
        result: 'No trace found. Area thoroughly searched.',
        resourcesUsed: ['Police Team Alpha', 'Local Security', 'K9 Unit']
      },
      {
        id: 'OP-002',
        area: 'Rajpath Area',
        coordinates: [77.2276, 28.6147],
        radius: 1000,
        searchType: 'aerial',
        status: 'planned',
        teamLead: 'Inspector Vikram',
        startTime: '2024-01-21T09:00:00Z',
        result: 'Scheduled for tomorrow morning',
        resourcesUsed: ['Drone Unit', 'Helicopter Support']
      }
    ],

    contacts: [
      {
        id: 'CNT-001',
        name: 'Carlos Garcia',
        relationship: 'Brother',
        phone: '+34-600123456',
        email: 'carlos.garcia@email.com',
        address: '123 Madrid Street, Madrid, Spain',
        contactedAt: '2024-01-20T17:00:00Z',
        notes: 'Cooperative. Provided additional personal details and recent photos.',
        reliability: 'high'
      },
      {
        id: 'CNT-002',
        name: 'Tour Operator - Delhi Travels',
        relationship: 'Service Provider',
        phone: '+91-11-23456789',
        address: 'Connaught Place, New Delhi',
        contactedAt: '2024-01-20T16:30:00Z',
        notes: 'Provided tour itinerary and group details.',
        reliability: 'high'
      }
    ],

    digitalFootprint: {
      phoneRecords: {
        lastActivity: '2024-01-20T13:20:00Z',
        location: [77.2295, 28.6129],
        callHistory: ['Emergency contact attempted', 'Tour operator call'],
        textMessages: ['Last message to brother at 13:15']
      },
      socialMedia: [
        {
          platform: 'Instagram',
          lastActivity: '2024-01-20T13:10:00Z',
          recentPosts: ['Photo at India Gate with friends']
        }
      ],
      financialActivity: {
        lastTransaction: '2024-01-20T12:45:00Z',
        location: 'India Gate Souvenir Shop',
        amount: 500
      }
    },

    notes: 'High priority case. Tourist safety concerns. International coordination required. Family has been notified. Media attention expected.',
    tags: ['international', 'high-priority', 'tourist-safety', 'india-gate']
  }
];

const mockSearchResources: SearchResource[] = [
  {
    id: 'RES-001',
    type: 'personnel',
    name: 'Police Team Alpha',
    status: 'available',
    location: 'Central Delhi Station',
    contact: 'Sergeant Mohan',
    capabilities: ['Ground Search', 'Crowd Control', 'Traffic Management']
  },
  {
    id: 'RES-002',
    type: 'k9',
    name: 'K9 Unit - Max',
    status: 'deployed',
    location: 'India Gate Area',
    contact: 'Handler Sharma',
    capabilities: ['Scent Tracking', 'Search & Rescue', 'Evidence Detection']
  },
  {
    id: 'RES-003',
    type: 'technology',
    name: 'Drone Unit Delta',
    status: 'available',
    location: 'Technical Support Base',
    contact: 'Pilot Officer Reddy',
    capabilities: ['Aerial Photography', 'Thermal Imaging', 'Live Surveillance']
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function InvestigationTools() {
  const [cases, setCases] = useState<InvestigationCase[]>(mockInvestigationCases);
  const [selectedCase, setSelectedCase] = useState<InvestigationCase | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'details' | 'evidence' | 'timeline' | 'search' | 'resources'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          caseItem.missingPerson.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || caseItem.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || caseItem.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-green-100 text-green-800';
      case 'cold': return 'bg-gray-100 text-gray-800';
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'action': return <Activity className="h-4 w-4 text-green-500" />;
      case 'evidence': return <Shield className="h-4 w-4 text-purple-500" />;
      case 'witness': return <Users className="h-4 w-4 text-orange-500" />;
      case 'breakthrough': return <Target className="h-4 w-4 text-green-600" />;
      case 'setback': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Investigation & Case Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive tools for missing person investigations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Case
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'list', label: 'Cases', icon: FileText },
          { id: 'details', label: 'Case Details', icon: Eye },
          { id: 'evidence', label: 'Evidence', icon: Shield },
          { id: 'timeline', label: 'Timeline', icon: Clock },
          { id: 'search', label: 'Search Ops', icon: Target },
          { id: 'resources', label: 'Resources', icon: Database }
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id as any)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeView === view.id
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <view.icon className="h-4 w-4 mr-2" />
            {view.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeView === 'list' && (
            <CasesListView 
              cases={filteredCases}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterPriority={filterPriority}
              setFilterPriority={setFilterPriority}
              onSelectCase={setSelectedCase}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
            />
          )}
          {activeView === 'details' && (
            <CaseDetailsView 
              selectedCase={selectedCase}
              onSelectCase={setSelectedCase}
            />
          )}
          {activeView === 'evidence' && (
            <EvidenceView selectedCase={selectedCase} />
          )}
          {activeView === 'timeline' && (
            <TimelineView 
              selectedCase={selectedCase}
              getTypeIcon={getTypeIcon}
            />
          )}
          {activeView === 'search' && (
            <SearchOperationsView selectedCase={selectedCase} />
          )}
          {activeView === 'resources' && (
            <ResourcesView resources={mockSearchResources} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// VIEW COMPONENTS
// ============================================================================

const CasesListView: React.FC<{
  cases: InvestigationCase[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
  onSelectCase: (caseItem: InvestigationCase) => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}> = ({
  cases, searchTerm, setSearchTerm, filterStatus, setFilterStatus,
  filterPriority, setFilterPriority, onSelectCase, getStatusColor, getPriorityColor
}) => (
  <div className="space-y-6">
    {/* Filters */}
    <Card className="p-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search cases, names, or case numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
        
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="pending">Pending</option>
          <option value="closed">Closed</option>
          <option value="cold">Cold</option>
        </select>

        <select 
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="all">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </Card>

    {/* Cases Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cases.map((caseItem) => (
        <Card 
          key={caseItem.id} 
          className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-transparent hover:border-l-indigo-500"
          onClick={() => onSelectCase(caseItem)}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {caseItem.caseNumber}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {caseItem.title}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className={getPriorityColor(caseItem.priority)}>
                {caseItem.priority}
              </Badge>
              <Badge className={getStatusColor(caseItem.status)}>
                {caseItem.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span>{caseItem.missingPerson.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{caseItem.missingPerson.lastSeen}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{new Date(caseItem.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <span>{caseItem.assignedOfficer}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{caseItem.evidence.length} Evidence Items</span>
              <span>{caseItem.timeline.length} Timeline Events</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const CaseDetailsView: React.FC<{
  selectedCase: InvestigationCase | null;
  onSelectCase: (caseItem: InvestigationCase) => void;
}> = ({ selectedCase, onSelectCase }) => {
  if (!selectedCase) {
    return (
      <Card className="p-8 text-center">
        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Case Selected
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Select a case from the list to view detailed information.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">{selectedCase.title}</h3>
            <p className="text-gray-600">Case Number: {selectedCase.caseNumber}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Missing Person</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {selectedCase.missingPerson.name}</p>
              <p><span className="font-medium">Age:</span> {selectedCase.missingPerson.age}</p>
              <p><span className="font-medium">Nationality:</span> {selectedCase.missingPerson.nationality}</p>
              <p><span className="font-medium">Last Seen:</span> {selectedCase.missingPerson.lastSeen}</p>
              <p><span className="font-medium">Description:</span> {selectedCase.missingPerson.description}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Case Information</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Assigned Officer:</span> {selectedCase.assignedOfficer}</p>
              <p><span className="font-medium">Lead Investigator:</span> {selectedCase.leadInvestigator}</p>
              <p><span className="font-medium">Created:</span> {new Date(selectedCase.createdAt).toLocaleString()}</p>
              <p><span className="font-medium">Last Updated:</span> {new Date(selectedCase.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {selectedCase.notes && (
          <div className="mt-6">
            <h4 className="font-semibold mb-3">Case Notes</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              {selectedCase.notes}
            </p>
          </div>
        )}

        <div className="mt-6">
          <h4 className="font-semibold mb-3">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCase.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

const EvidenceView: React.FC<{ selectedCase: InvestigationCase | null }> = ({ selectedCase }) => {
  if (!selectedCase) {
    return (
      <Card className="p-8 text-center">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Case Selected
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Select a case to view evidence items.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Evidence Items ({selectedCase.evidence.length})</h3>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Evidence
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedCase.evidence.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {item.type === 'digital' && <Database className="h-5 w-5 text-blue-500" />}
                {item.type === 'physical' && <Shield className="h-5 w-5 text-green-500" />}
                {item.type === 'witness' && <Users className="h-5 w-5 text-orange-500" />}
                {item.type === 'document' && <FileText className="h-5 w-5 text-purple-500" />}
                {item.type === 'media' && <Camera className="h-5 w-5 text-red-500" />}
                <span className="font-medium text-sm">{item.title}</span>
              </div>
              <div className="flex items-center gap-1">
                {item.verified ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <Badge variant={
                  item.importance === 'critical' ? 'destructive' :
                  item.importance === 'high' ? 'warning' :
                  'secondary'
                }>
                  {item.importance}
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{item.description}</p>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>Collected by: {item.collectedBy}</p>
              <p>Date: {new Date(item.collectedAt).toLocaleString()}</p>
              {item.location && <p>Location: {item.location}</p>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const TimelineView: React.FC<{
  selectedCase: InvestigationCase | null;
  getTypeIcon: (type: string) => React.ReactNode;
}> = ({ selectedCase, getTypeIcon }) => {
  if (!selectedCase) {
    return (
      <Card className="p-8 text-center">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Case Selected
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Select a case to view timeline events.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Case Timeline ({selectedCase.timeline.length} events)</h3>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      <div className="space-y-4">
        {selectedCase.timeline.map((event, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                {getTypeIcon(event.type)}
              </div>
              {index < selectedCase.timeline.length - 1 && (
                <div className="w-0.5 h-8 bg-gray-300 mx-auto mt-2"></div>
              )}
            </div>
            <Card className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium">{event.event}</h4>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500">Added by: {event.addedBy}</p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

const SearchOperationsView: React.FC<{ selectedCase: InvestigationCase | null }> = ({ selectedCase }) => {
  if (!selectedCase) {
    return (
      <Card className="p-8 text-center">
        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Case Selected
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Select a case to view search operations.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Search Operations ({selectedCase.searchOperations.length})</h3>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Plan Operation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedCase.searchOperations.map((operation) => (
          <Card key={operation.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold">{operation.area}</h4>
                <p className="text-sm text-gray-600">{operation.searchType.toUpperCase()} Search</p>
              </div>
              <Badge className={
                operation.status === 'completed' ? 'bg-green-100 text-green-800' :
                operation.status === 'active' ? 'bg-blue-100 text-blue-800' :
                operation.status === 'planned' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }>
                {operation.status}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Team Lead:</span> {operation.teamLead}</p>
              <p><span className="font-medium">Radius:</span> {operation.radius}m</p>
              <p><span className="font-medium">Start Time:</span> {new Date(operation.startTime).toLocaleString()}</p>
              {operation.endTime && (
                <p><span className="font-medium">End Time:</span> {new Date(operation.endTime).toLocaleString()}</p>
              )}
              <p><span className="font-medium">Result:</span> {operation.result}</p>
            </div>

            <div className="mt-4">
              <h5 className="font-medium text-sm mb-2">Resources Used</h5>
              <div className="flex flex-wrap gap-1">
                {operation.resourcesUsed.map((resource, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {resource}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ResourcesView: React.FC<{ resources: SearchResource[] }> = ({ resources }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">Available Resources ({resources.length})</h3>
      <Button className="gap-2">
        <Plus className="h-4 w-4" />
        Add Resource
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <Card key={resource.id} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {resource.type === 'personnel' && <Users className="h-5 w-5 text-blue-500" />}
              {resource.type === 'vehicle' && <Navigation className="h-5 w-5 text-green-500" />}
              {resource.type === 'equipment' && <Shield className="h-5 w-5 text-purple-500" />}
              {resource.type === 'k9' && <Heart className="h-5 w-5 text-orange-500" />}
              {resource.type === 'technology' && <Zap className="h-5 w-5 text-red-500" />}
              <span className="font-medium">{resource.name}</span>
            </div>
            <Badge className={
              resource.status === 'available' ? 'bg-green-100 text-green-800' :
              resource.status === 'deployed' ? 'bg-blue-100 text-blue-800' :
              resource.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }>
              {resource.status}
            </Badge>
          </div>

          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Location:</span> {resource.location}</p>
            <p><span className="font-medium">Contact:</span> {resource.contact}</p>
          </div>

          <div className="mt-3">
            <h5 className="font-medium text-sm mb-2">Capabilities</h5>
            <div className="flex flex-wrap gap-1">
              {resource.capabilities.map((capability, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {capability}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default InvestigationTools;