/**
 * Smart Tourist Safety System - Digital IDs Management Page
 * Page for managing tourist identities, verification status, and blockchain records
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Shield, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  Download,
  RefreshCw,
  Users,
  FileText
} from 'lucide-react';
import type { DigitalIdentity } from '@/types/blockchain';
import DigitalIdViewer from '@/components/blockchain/digital-id-viewer';

// Simple UI components for prototype
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const Button = ({ 
  children, 
  onClick, 
  variant = "default", 
  size = "md", 
  disabled = false,
  className = ""
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-blue-500"
  };
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ 
  placeholder, 
  value, 
  onChange, 
  className = "",
  type = "text"
}: {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
  />
);

const Select = ({ 
  children, 
  value, 
  onChange, 
  className = ""
}: {
  children: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}) => (
  <select
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
  >
    {children}
  </select>
);

// ============================================================================
// INTERFACES
// ============================================================================

interface IdentityListProps {
  identities: DigitalIdentity[];
  loading: boolean;
  onSelectIdentity: (identity: DigitalIdentity) => void;
  selectedIdentity: DigitalIdentity | null;
}

interface IdentityStatsProps {
  stats: {
    total: number;
    verified: number;
    pending: number;
    expired: number;
  };
}

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DigitalIdsPage() {
  const [identities, setIdentities] = useState<DigitalIdentity[]>([]);
  const [filteredIdentities, setFilteredIdentities] = useState<DigitalIdentity[]>([]);
  const [selectedIdentity, setSelectedIdentity] = useState<DigitalIdentity | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for prototype
  const mockIdentities: DigitalIdentity[] = [
    {
      id: 'id-001',
      contractAddress: '0x1234567890123456789012345678901234567890',
      touristId: 'tourist-001',
      blockchainId: 'blockchain-001',
      walletAddress: '0xabcd1234567890abcd1234567890abcd12345678',
      kycData: {
        documentType: 'passport',
        documentNumber: 'P1234567',
        documentHash: 'QmXoYpUhZDhw4j7tA9RwQzYzk3PEeZLa5cWs8Yd9FgH2',
        fullName: 'John Doe',
        dateOfBirth: '1990-05-15',
        nationality: 'USA',
        verificationStatus: 'verified',
        verificationDate: '2024-01-10T10:00:00Z',
        verifierAddress: '0xverifier123456789012345678901234567890'
      },
      tripData: {
        itinerary: [
          {
            location: 'Guwahati, Assam',
            coordinates: { latitude: 26.1445, longitude: 91.7362 },
            plannedArrival: '2024-02-01T09:00:00Z',
            plannedDeparture: '2024-02-03T18:00:00Z',
            purpose: 'Tourism'
          }
        ],
        startDate: '2024-02-01',
        endDate: '2024-02-15',
        purpose: 'tourism',
        groupSize: 2,
        accommodations: [
          {
            name: 'Hotel Brahmaputra',
            address: 'MG Road, Guwahati',
            checkIn: '2024-02-01',
            checkOut: '2024-02-03'
          }
        ]
      },
      emergencyContacts: [
        {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+1-555-0123',
          email: 'jane.doe@email.com',
          isPrimary: true
        }
      ],
      blockchain: {
        network: 'polygon',
        contractVersion: '1.0.0',
        transactionHash: '0xhash123456789012345678901234567890123456789012345678901234567890',
        blockNumber: 12345678,
        gasUsed: 124500,
        timestamp: '2024-01-10T10:00:00Z'
      },
      status: 'active',
      validFrom: '2024-01-10T10:00:00Z',
      validUntil: '2024-02-28T23:59:59Z',
      lastUpdated: '2024-01-10T10:00:00Z',
      createdAt: '2024-01-10T10:00:00Z',
      permissions: {
        police: true,
        tourism: true,
        emergency: true,
        medical: false
      }
    },
    {
      id: 'id-002',
      contractAddress: '0x2345678901234567890123456789012345678901',
      touristId: 'tourist-002',
      blockchainId: 'blockchain-002',
      walletAddress: '0xefgh1234567890efgh1234567890efgh12345678',
      kycData: {
        documentType: 'aadhaar',
        documentNumber: 'XXXX-XXXX-1234',
        documentHash: 'QmYzXwVuTsRqPnOmLkJhGfDsAzYxCvBnMaQsWe4RtYhGv',
        fullName: 'Priya Sharma',
        dateOfBirth: '1985-03-22',
        nationality: 'India',
        verificationStatus: 'pending',
        verificationDate: undefined,
        verifierAddress: undefined
      },
      tripData: {
        itinerary: [
          {
            location: 'Shillong, Meghalaya',
            coordinates: { latitude: 25.5788, longitude: 91.8933 },
            plannedArrival: '2024-02-05T12:00:00Z',
            plannedDeparture: '2024-02-10T15:00:00Z',
            purpose: 'Tourism'
          }
        ],
        startDate: '2024-02-05',
        endDate: '2024-02-20',
        purpose: 'tourism',
        groupSize: 4,
        accommodations: [
          {
            name: 'Pine Hill Resort',
            address: 'Police Bazar, Shillong',
            checkIn: '2024-02-05',
            checkOut: '2024-02-10'
          }
        ]
      },
      emergencyContacts: [
        {
          name: 'Raj Sharma',
          relationship: 'Father',
          phone: '+91-9876543210',
          email: 'raj.sharma@email.com',
          isPrimary: true
        }
      ],
      blockchain: {
        network: 'polygon',
        contractVersion: '1.0.0',
        transactionHash: '0xhash234567890123456789012345678901234567890123456789012345678901',
        blockNumber: 12345679,
        gasUsed: 98750,
        timestamp: '2024-01-11T14:30:00Z'
      },
      status: 'active',
      validFrom: '2024-01-11T14:30:00Z',
      validUntil: '2024-03-11T23:59:59Z',
      lastUpdated: '2024-01-11T14:30:00Z',
      createdAt: '2024-01-11T14:30:00Z',
      permissions: {
        police: true,
        tourism: true,
        emergency: true,
        medical: true
      }
    }
  ];

  // ============================================================================
  // DATA FETCHING AND FILTERING
  // ============================================================================

  useEffect(() => {
    const fetchIdentities = async () => {
      try {
        setLoading(true);
        // In real implementation, this would fetch from API
        // const response = await fetch('/api/blockchain/identity-records');
        // const data = await response.json();
        setIdentities(mockIdentities);
      } catch (error) {
        console.error('Failed to fetch identities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdentities();
  }, []);

  useEffect(() => {
    let filtered = identities;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(identity =>
        identity.kycData.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        identity.touristId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        identity.kycData.documentNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(identity => 
        identity.kycData.verificationStatus === statusFilter
      );
    }

    setFilteredIdentities(filtered);
  }, [identities, searchTerm, statusFilter]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, refetch data
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleExportAll = () => {
    const exportData = {
      identities: filteredIdentities,
      exportedAt: new Date().toISOString(),
      totalCount: filteredIdentities.length
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digital-identities-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const stats = {
    total: identities.length,
    verified: identities.filter(i => i.kycData.verificationStatus === 'verified').length,
    pending: identities.filter(i => i.kycData.verificationStatus === 'pending').length,
    expired: identities.filter(i => i.kycData.verificationStatus === 'expired').length
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Digital Identity Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage tourist blockchain identities and verification status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleExportAll}
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Generate New ID
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <IdentityStats stats={stats} />

      {/* Filter Bar */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Identity List */}
        <div className="lg:col-span-1">
          <IdentityList
            identities={filteredIdentities}
            loading={loading}
            onSelectIdentity={setSelectedIdentity}
            selectedIdentity={selectedIdentity}
          />
        </div>

        {/* Identity Details */}
        <div className="lg:col-span-2">
          {selectedIdentity ? (
            <DigitalIdViewer
              identityId={selectedIdentity.id}
              showSensitiveData={false}
            />
          ) : (
            <Card className="p-12 text-center">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select an Identity
              </h3>
              <p className="text-gray-600">
                Choose a digital identity from the list to view details and blockchain information
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// IDENTITY STATS COMPONENT
// ============================================================================

function IdentityStats({ stats }: IdentityStatsProps) {
  const statItems = [
    {
      label: 'Total Identities',
      value: stats.total,
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Verified',
      value: stats.verified,
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'yellow'
    },
    {
      label: 'Expired',
      value: stats.expired,
      icon: XCircle,
      color: 'red'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
            </div>
            <div className={`p-2 rounded-full ${colorClasses[item.color as keyof typeof colorClasses]}`}>
              <item.icon className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// FILTER BAR COMPONENT
// ============================================================================

function FilterBar({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange, 
  onRefresh, 
  refreshing 
}: FilterBarProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, ID, or document number..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-48"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </Select>
          
          <Button
            onClick={onRefresh}
            variant="outline"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// IDENTITY LIST COMPONENT
// ============================================================================

function IdentityList({ identities, loading, onSelectIdentity, selectedIdentity }: IdentityListProps) {
  if (loading) {
    return (
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Digital Identities
        </h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Digital Identities ({identities.length})
      </h3>
      
      {identities.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">No identities found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {identities.map((identity) => (
            <div
              key={identity.id}
              onClick={() => onSelectIdentity(identity)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedIdentity?.id === identity.id
                  ? 'bg-blue-50 border-blue-200 border'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {identity.kycData.fullName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {identity.touristId}
                  </p>
                </div>
                <VerificationBadge status={identity.kycData.verificationStatus} />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {identity.tripData.purpose} • {identity.kycData.nationality}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ============================================================================
// VERIFICATION BADGE COMPONENT
// ============================================================================

function VerificationBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800',
          label: 'Verified'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800',
          label: 'Pending'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'bg-red-100 text-red-800',
          label: 'Rejected'
        };
      case 'expired':
        return {
          icon: AlertTriangle,
          color: 'bg-gray-100 text-gray-800',
          label: 'Expired'
        };
      default:
        return {
          icon: AlertTriangle,
          color: 'bg-gray-100 text-gray-800',
          label: 'Unknown'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </span>
  );
}
