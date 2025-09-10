/**
 * Smart Tourist Safety System - Main Blockchain Dashboard Page
 * Overview of blockchain network status, contracts, and recent transactions
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  Network, 
  Shield, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  FileText,
  ExternalLink
} from 'lucide-react';
import { blockchainService } from '@/services/blockchain';
import type { NetworkStatus, BlockchainAnalytics } from '@/types/blockchain';

// Simple Card component for prototype
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
// INTERFACES
// ============================================================================

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

interface NetworkStatusCardProps {
  networkStatus: NetworkStatus | null;
  loading: boolean;
}

interface ContractInfoProps {
  contracts: Array<{
    name: string;
    address: string;
    status: 'active' | 'inactive';
    version: string;
    deployedAt: string;
  }>;
}

interface RecentTransactionsProps {
  transactions: Array<{
    hash: string;
    type: string;
    status: 'confirmed' | 'pending' | 'failed';
    timestamp: string;
    gasUsed: number;
  }>;
  loading: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function BlockchainPage() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);
  const [analytics, setAnalytics] = useState<BlockchainAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for prototype
  const [contracts] = useState([
    {
      name: 'Tourist Identity',
      address: '0x1234567890123456789012345678901234567890',
      status: 'active' as const,
      version: '1.0.0',
      deployedAt: '2024-01-15'
    },
    {
      name: 'Identity Registry',
      address: '0x2345678901234567890123456789012345678901',
      status: 'active' as const,
      version: '1.0.0',
      deployedAt: '2024-01-15'
    },
    {
      name: 'Emergency Logging',
      address: '0x3456789012345678901234567890123456789012',
      status: 'active' as const,
      version: '1.0.0',
      deployedAt: '2024-01-15'
    }
  ]);

  const [recentTransactions] = useState([
    {
      hash: '0xabcd1234567890abcd1234567890abcd1234567890abcd1234567890abcd123456',
      type: 'Identity Creation',
      status: 'confirmed' as const,
      timestamp: new Date().toISOString(),
      gasUsed: 124500
    },
    {
      hash: '0xefgh1234567890efgh1234567890efgh1234567890efgh1234567890efgh123456',
      type: 'Identity Verification',
      status: 'pending' as const,
      timestamp: new Date(Date.now() - 300000).toISOString(),
      gasUsed: 89200
    },
    {
      hash: '0xijkl1234567890ijkl1234567890ijkl1234567890ijkl1234567890ijkl123456',
      type: 'Emergency Log',
      status: 'confirmed' as const,
      timestamp: new Date(Date.now() - 600000).toISOString(),
      gasUsed: 67800
    }
  ]);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  useEffect(() => {
    const fetchBlockchainData = async () => {
      try {
        setLoading(true);
        
        // Get network status
        const status = await blockchainService.getNetworkStatus();
        setNetworkStatus(status);

        // Mock analytics data for prototype
        setAnalytics({
          totalIdentities: 1247,
          verifiedIdentities: 1189,
          pendingVerifications: 58,
          expiredIdentities: 23,
          totalTransactions: 3456,
          successfulTransactions: 3398,
          failedTransactions: 58,
          averageGasUsed: 125000,
          averageBlockTime: 2.1,
          networkCongestion: 'low',
          gasPrice: {
            current: '25.5',
            average24h: '27.8',
            recommended: '30.0'
          },
          dailyTransactions: [
            { date: '2024-01-10', count: 45, gasUsed: 5625000 },
            { date: '2024-01-11', count: 52, gasUsed: 6500000 },
            { date: '2024-01-12', count: 38, gasUsed: 4750000 },
          ],
          errors: [
            { type: 'Gas Limit Exceeded', count: 12, lastOccurrence: '2024-01-12T10:30:00Z' },
            { type: 'Invalid Signature', count: 8, lastOccurrence: '2024-01-12T14:15:00Z' }
          ]
        });

      } catch (error) {
        console.error('Failed to fetch blockchain data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockchainData();
  }, []);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const status = await blockchainService.getNetworkStatus();
      setNetworkStatus(status);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await blockchainService.connectWallet();
      handleRefresh();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Blockchain Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor digital identity blockchain network and smart contracts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={refreshing}
          >
            <Activity className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button onClick={handleConnectWallet}>
            <Shield className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Identities"
            value={analytics.totalIdentities.toLocaleString()}
            icon={Users}
            trend={{ value: 12.5, isPositive: true }}
            color="blue"
          />
          <StatCard
            title="Verified Identities"
            value={analytics.verifiedIdentities.toLocaleString()}
            icon={CheckCircle}
            trend={{ value: 8.2, isPositive: true }}
            color="green"
          />
          <StatCard
            title="Pending Verifications"
            value={analytics.pendingVerifications}
            icon={Clock}
            trend={{ value: 5.1, isPositive: false }}
            color="yellow"
          />
          <StatCard
            title="Total Transactions"
            value={analytics.totalTransactions.toLocaleString()}
            icon={FileText}
            trend={{ value: 15.3, isPositive: true }}
            color="blue"
          />
        </div>
      )}

      {/* Network Status and Contract Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NetworkStatusCard networkStatus={networkStatus} loading={loading} />
        <ContractInfo contracts={contracts} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={recentTransactions} loading={false} />
    </div>
  );
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

function StatCard({ title, value, icon: Icon, trend, color = 'blue' }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${
                trend.isPositive ? '' : 'rotate-180'
              }`} />
              {Math.abs(trend.value)}% from last month
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  );
}

// ============================================================================
// NETWORK STATUS CARD COMPONENT
// ============================================================================

function NetworkStatusCard({ networkStatus, loading }: NetworkStatusCardProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Network Status</h3>
        <div className={`flex items-center ${
          networkStatus?.healthy ? 'text-green-600' : 'text-red-600'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            networkStatus?.healthy ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          {networkStatus?.healthy ? 'Healthy' : 'Unhealthy'}
        </div>
      </div>

      {networkStatus ? (
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Network:</span>
            <span className="font-medium">{networkStatus.network}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Block Number:</span>
            <span className="font-medium">{networkStatus.blockNumber.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Gas Price:</span>
            <span className="font-medium">{networkStatus.gasPrice} Gwei</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last Update:</span>
            <span className="font-medium">
              {new Date(networkStatus.lastUpdate).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
          <p className="text-gray-600">Network status unavailable</p>
        </div>
      )}
    </Card>
  );
}

// ============================================================================
// CONTRACT INFO COMPONENT
// ============================================================================

function ContractInfo({ contracts }: ContractInfoProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Smart Contracts
      </h3>
      
      <div className="space-y-4">
        {contracts.map((contract, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{contract.name}</p>
              <p className="text-sm text-gray-600">
                v{contract.version} • Deployed {new Date(contract.deployedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                contract.status === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {contract.status}
              </span>
              <Button
                onClick={() => window.open(
                  `https://polygonscan.com/address/${contract.address}`,
                  '_blank'
                )}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================================
// RECENT TRANSACTIONS COMPONENT
// ============================================================================

function RecentTransactions({ transactions, loading }: RecentTransactionsProps) {
  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Transactions
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Transactions
        </h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {transactions.map((tx, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{tx.type}</p>
              <p className="text-sm text-gray-600">
                {new Date(tx.timestamp).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                {tx.hash.slice(0, 20)}...{tx.hash.slice(-8)}
              </p>
            </div>
            
            <div className="text-right">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                tx.status === 'confirmed' 
                  ? 'bg-green-100 text-green-800'
                  : tx.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {tx.status}
              </span>
              <p className="text-sm text-gray-600 mt-1">
                {tx.gasUsed.toLocaleString()} gas
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
