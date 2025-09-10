/**
 * Smart Tourist Safety System - Digital ID Viewer Component
 * Component for displaying tourist blockchain identities with verification status
 */

'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Shield, Clock, CheckCircle, XCircle, AlertTriangle, ExternalLink, Copy, Download } from 'lucide-react';
import type { DigitalIdentity, BlockchainRecord, IdentityVerification } from '@/types/blockchain';
import { blockchainService, formatAddress, formatTxHash, getTxExplorerUrl } from '@/services/blockchain';

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

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface DigitalIdViewerProps {
  identityId: string;
  className?: string;
  showSensitiveData?: boolean;
  compact?: boolean;
}

interface IdentityCardProps {
  identity: DigitalIdentity;
  showSensitive: boolean;
  onToggleSensitive: () => void;
}

interface VerificationBadgeProps {
  status: DigitalIdentity['kycData']['verificationStatus'];
  size?: 'sm' | 'md' | 'lg';
}

interface BlockchainInfoProps {
  identity: DigitalIdentity;
}

interface TransactionHistoryProps {
  records: BlockchainRecord[];
  loading: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DigitalIdViewer({
  identityId,
  className = '',
  showSensitiveData = false,
  compact = false
}: DigitalIdViewerProps) {
  const [identity, setIdentity] = useState<DigitalIdentity | null>(null);
  const [records, setRecords] = useState<BlockchainRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSensitive, setShowSensitive] = useState(showSensitiveData);
  const [verifying, setVerifying] = useState(false);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  useEffect(() => {
    const fetchIdentityData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch identity details
        const identityData = await blockchainService.getDigitalIdentity(identityId);
        if (!identityData) {
          throw new Error('Identity not found');
        }
        setIdentity(identityData);

        // Fetch blockchain records
        const recordsData = await blockchainService.getBlockchainRecords(identityId);
        setRecords(recordsData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load identity');
      } finally {
        setLoading(false);
      }
    };

    if (identityId) {
      fetchIdentityData();
    }
  }, [identityId]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleVerifyIdentity = async () => {
    if (!identity) return;

    try {
      setVerifying(true);
      const result = await blockchainService.verifyDigitalIdentity(identity.id);
      
      if (result.verified && result.identity) {
        setIdentity(result.identity);
      } else {
        setError(result.error || 'Verification failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const handleExportIdentity = () => {
    if (!identity) return;

    const exportData = {
      ...identity,
      exportedAt: new Date().toISOString(),
      exportedBy: 'dashboard-user' // You could get this from auth context
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digital-identity-${identity.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ============================================================================
  // RENDER STATES
  // ============================================================================

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (error || !identity) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center space-y-4">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-900">
            Failed to Load Identity
          </h3>
          <p className="text-gray-600">{error || 'Identity not found'}</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Digital Identity
        </h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowSensitive(!showSensitive)}
            variant="outline"
            size="sm"
          >
            {showSensitive ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Sensitive
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show Sensitive
              </>
            )}
          </Button>
          <Button
            onClick={handleVerifyIdentity}
            variant="outline"
            size="sm"
            disabled={verifying}
          >
            <Shield className="h-4 w-4 mr-2" />
            {verifying ? 'Verifying...' : 'Verify'}
          </Button>
          <Button
            onClick={handleExportIdentity}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Identity Card */}
      <IdentityCard
        identity={identity}
        showSensitive={showSensitive}
        onToggleSensitive={() => setShowSensitive(!showSensitive)}
      />

      {/* Blockchain Information */}
      <BlockchainInfo identity={identity} />

      {/* Transaction History */}
      <TransactionHistory records={records} loading={false} />
    </div>
  );
}

// ============================================================================
// IDENTITY CARD COMPONENT
// ============================================================================

function IdentityCard({ identity, showSensitive, onToggleSensitive }: IdentityCardProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {showSensitive ? identity.kycData.fullName : '******* *******'}
            </h3>
            <p className="text-gray-600">
              {identity.tripData.purpose.replace('_', ' ').toUpperCase()} • {identity.kycData.nationality}
            </p>
          </div>
          <VerificationBadge status={identity.kycData.verificationStatus} />
        </div>

        {/* KYC Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Identity Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Document Type:</span>
                <span className="font-medium">
                  {identity.kycData.documentType.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Document Number:</span>
                <span className="font-medium">
                  {showSensitive ? identity.kycData.documentNumber : '***********'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date of Birth:</span>
                <span className="font-medium">
                  {showSensitive ? identity.kycData.dateOfBirth : '**/**/****'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  identity.status === 'active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {identity.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Trip Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Trip Start:</span>
                <span className="font-medium">
                  {new Date(identity.tripData.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trip End:</span>
                <span className="font-medium">
                  {new Date(identity.tripData.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Group Size:</span>
                <span className="font-medium">{identity.tripData.groupSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Destinations:</span>
                <span className="font-medium">
                  {identity.tripData.itinerary.length} locations
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        {showSensitive && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Emergency Contacts</h4>
            <div className="space-y-2">
              {identity.emergencyContacts.map((contact, index) => (
                <div key={index} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.relationship}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{contact.phone}</p>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// ============================================================================
// VERIFICATION BADGE COMPONENT
// ============================================================================

function VerificationBadge({ status, size = 'md' }: VerificationBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

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
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${config.color}`}>
      <Icon className={`mr-1 ${iconSize[size]}`} />
      {config.label}
    </span>
  );
}

// ============================================================================
// BLOCKCHAIN INFO COMPONENT
// ============================================================================

function BlockchainInfo({ identity }: BlockchainInfoProps) {
  const chainId = 137; // Polygon mainnet for example

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Blockchain Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Contract Address:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">
                {formatAddress(identity.contractAddress)}
              </span>
              <Button
                onClick={() => navigator.clipboard.writeText(identity.contractAddress)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                onClick={() => window.open(
                  `https://polygonscan.com/address/${identity.contractAddress}`,
                  '_blank'
                )}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Network:</span>
            <span className="font-medium">{identity.blockchain.network}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Block Number:</span>
            <span className="font-medium">{identity.blockchain.blockNumber.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Transaction Hash:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">
                {formatTxHash(identity.blockchain.transactionHash)}
              </span>
              <Button
                onClick={() => window.open(
                  getTxExplorerUrl(identity.blockchain.transactionHash, chainId),
                  '_blank'
                )}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Gas Used:</span>
            <span className="font-medium">{identity.blockchain.gasUsed.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Created:</span>
            <span className="font-medium">
              {new Date(identity.blockchain.timestamp).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// TRANSACTION HISTORY COMPONENT
// ============================================================================

function TransactionHistory({ records, loading }: TransactionHistoryProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Transaction History
        </h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Transaction History
      </h3>
      
      {records.length === 0 ? (
        <p className="text-gray-600 text-center py-8">
          No transaction records found
        </p>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {record.type.replace('_', ' ').toUpperCase()}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(record.timestamp).toLocaleString()}
                </p>
              </div>
              
              <div className="text-right">
                <p className="font-mono text-sm">
                  {formatTxHash(record.transactionHash)}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    record.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800'
                      : record.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {record.status}
                  </span>
                  <Button
                    onClick={() => window.open(
                      getTxExplorerUrl(record.transactionHash, 137),
                      '_blank'
                    )}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
