/**
 * Smart Tourist Safety System - Transaction History Component
 * Component for monitoring blockchain transactions with real-time status updates
 * Enhanced for Demo with comprehensive error handling and visual indicators
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye, 
  ExternalLink, 
  Loader2, 
  Filter, 
  Search, 
  RefreshCw, 
  Calendar,
  ArrowUp,
  ArrowDown,
  Hash,
  Coins,
  Users,
  Shield,
  Zap,
  Database,
  Network,
  TrendingUp,
  Download,
  Copy,
  FileText,
  Globe,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useBlockchain } from '@/hooks/use-blockchain';
import { blockchainService } from '@/services/blockchain-service';
import type { TransactionResponse, BlockchainRecord } from '@/types/blockchain';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface TransactionDetail {
  hash: string;
  type: 'identity_creation' | 'identity_update' | 'verification' | 'emergency' | 'system';
  from: string;
  to: string;
  value: string;
  gasUsed: number;
  gasPrice: string;
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  timestamp: string;
  blockNumber?: number;
  confirmations: number;
  description: string;
  fee: string;
  network: string;
  contractAddress?: string;
  functionName?: string;
  logs?: TransactionLog[];
  metadata?: {
    touristId?: string;
    identityId?: string;
    emergencyLevel?: string;
    verificationResult?: boolean;
  };
  demoFields: {
    blockchainVerified: string;
    immutableRecord: string;
    decentralizedProof: string;
    realTimeSync: string;
  };
}

interface TransactionLog {
  address: string;
  topics: string[];
  data: string;
  decoded?: {
    event: string;
    args: Record<string, any>;
  };
}

interface TransactionStats {
  total: number;
  pending: number;
  confirmed: number;
  failed: number;
  totalValue: string;
  avgGasFee: string;
  successRate: number;
}

interface FilterOptions {
  status: string;
  type: string;
  network: string;
  dateRange: string;
  search: string;
}

// ============================================================================
// MOCK DATA GENERATOR
// ============================================================================

const generateMockTransactions = (): TransactionDetail[] => {
  const types: TransactionDetail['type'][] = ['identity_creation', 'verification', 'emergency', 'identity_update', 'system'];
  const statuses: TransactionDetail['status'][] = ['confirmed', 'pending', 'failed'];
  const networks = ['ethereum', 'polygon', 'hardhat'];
  
  return Array.from({ length: 25 }, (_, index) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = index < 2 ? 'pending' : statuses[Math.floor(Math.random() * statuses.length)];
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
    const network = networks[Math.floor(Math.random() * networks.length)];
    
    return {
      hash: `0x${Math.random().toString(16).substring(2).padStart(64, '0')}`,
      type,
      from: `0x${Math.random().toString(16).substring(2).padStart(40, '0')}`,
      to: `0x${Math.random().toString(16).substring(2).padStart(40, '0')}`,
      value: (Math.random() * 0.5).toFixed(6),
      gasUsed: Math.floor(150000 + Math.random() * 350000),
      gasPrice: (20 + Math.random() * 100).toFixed(2),
      status,
      timestamp,
      blockNumber: status === 'confirmed' ? Math.floor(18000000 + Math.random() * 1000000) : undefined,
      confirmations: status === 'confirmed' ? Math.floor(1 + Math.random() * 50) : 0,
      fee: (0.001 + Math.random() * 0.01).toFixed(6),
      network,
      contractAddress: `0x${Math.random().toString(16).substring(2).padStart(40, '0')}`,
      functionName: type === 'identity_creation' ? 'createIdentity' : 
                   type === 'verification' ? 'verifyIdentity' : 
                   type === 'emergency' ? 'emergencyLog' : 'updateIdentity',
      description: type === 'identity_creation' ? 'Digital Identity Created' :
                  type === 'verification' ? 'Identity Verification' :
                  type === 'emergency' ? 'Emergency Alert Logged' :
                  type === 'identity_update' ? 'Identity Updated' : 'System Operation',
      metadata: {
        touristId: `tourist_${Math.random().toString(36).substring(7)}`,
        identityId: `identity_${Math.random().toString(36).substring(7)}`,
        emergencyLevel: type === 'emergency' ? ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] : undefined,
        verificationResult: type === 'verification' ? Math.random() > 0.1 : undefined
      },
      demoFields: {
        blockchainVerified: '✅ Blockchain Verified',
        immutableRecord: '🔒 Immutable Record',
        decentralizedProof: '🌐 Decentralized Proof',
        realTimeSync: '⚡ Real-time Sync'
      }
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionDetail[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    type: 'all',
    network: 'all',
    dateRange: 'all',
    search: ''
  });

  const { isConnected, wallet } = useBlockchain();
  const { toast } = useToast();

  // ============================================================================
  // DATA LOADING & MANAGEMENT
  // ============================================================================

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from blockchain service
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate loading
      
      const mockTransactions = generateMockTransactions();
      setTransactions(mockTransactions);
      
      // Calculate stats
      const stats: TransactionStats = {
        total: mockTransactions.length,
        pending: mockTransactions.filter(tx => tx.status === 'pending').length,
        confirmed: mockTransactions.filter(tx => tx.status === 'confirmed').length,
        failed: mockTransactions.filter(tx => tx.status === 'failed').length,
        totalValue: mockTransactions.reduce((sum, tx) => sum + parseFloat(tx.value), 0).toFixed(6),
        avgGasFee: (mockTransactions.reduce((sum, tx) => sum + parseFloat(tx.fee), 0) / mockTransactions.length).toFixed(6),
        successRate: (mockTransactions.filter(tx => tx.status === 'confirmed').length / mockTransactions.length * 100)
      };
      setStats(stats);
      
    } catch (error) {
      console.error('Failed to load transactions:', error);
      toast({
        title: '❌ Loading Failed',
        description: 'Failed to load transaction history',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const refreshTransactions = async () => {
    setIsRefreshing(true);
    await loadTransactions();
    setIsRefreshing(false);
    toast({
      title: '🔄 Refreshed',
      description: 'Transaction history updated successfully'
    });
  };

  // ============================================================================
  // FILTERING & SEARCH
  // ============================================================================

  const applyFilters = useCallback(() => {
    let filtered = [...transactions];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(tx => tx.status === filters.status);
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(tx => tx.type === filters.type);
    }

    // Network filter
    if (filters.network !== 'all') {
      filtered = filtered.filter(tx => tx.network === filters.network);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const ranges = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      };
      
      const range = ranges[filters.dateRange as keyof typeof ranges];
      if (range) {
        const cutoff = new Date(now.getTime() - range);
        filtered = filtered.filter(tx => new Date(tx.timestamp) >= cutoff);
      }
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.hash.toLowerCase().includes(searchLower) ||
        tx.description.toLowerCase().includes(searchLower) ||
        tx.type.toLowerCase().includes(searchLower) ||
        tx.metadata?.touristId?.toLowerCase().includes(searchLower) ||
        tx.metadata?.identityId?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, filters]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Real-time updates simulation
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setTransactions(prev => prev.map(tx => {
        if (tx.status === 'pending' && Math.random() > 0.7) {
          return { ...tx, status: 'confirmed', confirmations: 1, blockNumber: Math.floor(18000000 + Math.random() * 1000000) };
        }
        if (tx.status === 'confirmed' && tx.confirmations < 50) {
          return { ...tx, confirmations: tx.confirmations + 1 };
        }
        return tx;
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [isConnected]);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const getStatusIcon = (status: TransactionDetail['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: TransactionDetail['type']) => {
    switch (type) {
      case 'identity_creation':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'verification':
        return <Shield className="h-4 w-4 text-green-500" />;
      case 'emergency':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'identity_update':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'system':
        return <Database className="h-4 w-4 text-gray-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: '📋 Copied!',
      description: `${label} copied to clipboard`
    });
  };

  // ============================================================================
  // RENDER METHODS
  // ============================================================================

  const renderStatsCards = () => {
    if (!stats) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-blue-600">🔗 Blockchain Recorded</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">{stats.successRate.toFixed(1)}%</p>
                <p className="text-xs text-green-600">✅ Verified On-Chain</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-xs text-yellow-600">⏳ Mining in Progress</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Gas Fee</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgGasFee} ETH</p>
                <p className="text-xs text-purple-600">⛽ Network Optimized</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderFilters = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Transaction Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Hash, ID, or description..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="identity_creation">Identity Creation</option>
              <option value="verification">Verification</option>
              <option value="emergency">Emergency</option>
              <option value="identity_update">Identity Update</option>
              <option value="system">System</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Network</label>
            <select
              value={filters.network}
              onChange={(e) => setFilters(prev => ({ ...prev, network: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Networks</option>
              <option value="ethereum">Ethereum</option>
              <option value="polygon">Polygon</option>
              <option value="hardhat">Hardhat</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTransactionsList = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Hash className="h-5 w-5" />
              <span>Transaction History</span>
            </CardTitle>
            <CardDescription>
              Real-time blockchain transaction monitoring with detailed status tracking
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshTransactions}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-600">Loading blockchain transactions...</span>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No transactions found matching the filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx) => (
              <motion.div
                key={tx.hash}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedTransaction(tx)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(tx.type)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{tx.description}</span>
                        <Badge 
                          variant="outline"
                          className={
                            tx.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                            tx.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }
                        >
                          {getStatusIcon(tx.status)}
                          <span className="ml-1">{tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}</span>
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="font-mono">{formatAddress(tx.hash)}</span>
                        <span className="mx-2">•</span>
                        <span>{formatTime(tx.timestamp)}</span>
                        <span className="mx-2">•</span>
                        <span className="text-blue-600">⛽ {tx.fee} ETH</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {tx.value} ETH
                    </div>
                    <div className="text-xs text-gray-500">
                      {tx.network}
                    </div>
                  </div>
                </div>

                {/* Demo Blockchain Indicators */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {tx.demoFields.blockchainVerified}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {tx.demoFields.immutableRecord}
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    {tx.demoFields.decentralizedProof}
                  </span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    {tx.demoFields.realTimeSync}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderTransactionDetails = () => {
    if (!selectedTransaction) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={() => setSelectedTransaction(null)}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTransaction(null)}>
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              {/* Status and Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Status</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedTransaction.status)}
                    <span className="font-medium capitalize">{selectedTransaction.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedTransaction.confirmations} confirmations
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Type</h3>
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(selectedTransaction.type)}
                    <span className="font-medium">{selectedTransaction.description}</span>
                  </div>
                </div>
              </div>

              {/* Transaction Hash */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Transaction Hash</h3>
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-blue-800 break-all">
                    {selectedTransaction.hash}
                  </code>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(selectedTransaction.hash, 'Transaction hash')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">From</h3>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <code className="text-sm font-mono">{formatAddress(selectedTransaction.from)}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(selectedTransaction.from, 'From address')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">To</h3>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <code className="text-sm font-mono">{formatAddress(selectedTransaction.to)}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(selectedTransaction.to, 'To address')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Value and Fees */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <h3 className="font-medium text-green-900 mb-1">Value</h3>
                  <p className="text-lg font-bold text-green-700">{selectedTransaction.value} ETH</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <h3 className="font-medium text-purple-900 mb-1">Gas Fee</h3>
                  <p className="text-lg font-bold text-purple-700">{selectedTransaction.fee} ETH</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <h3 className="font-medium text-blue-900 mb-1">Gas Used</h3>
                  <p className="text-lg font-bold text-blue-700">{selectedTransaction.gasUsed.toLocaleString()}</p>
                </div>
              </div>

              {/* Network Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Network Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Network:</span>
                    <span className="ml-2 font-medium capitalize">{selectedTransaction.network}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Block Number:</span>
                    <span className="ml-2 font-mono">{selectedTransaction.blockNumber || 'Pending'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Timestamp:</span>
                    <span className="ml-2">{new Date(selectedTransaction.timestamp).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Function:</span>
                    <span className="ml-2 font-mono">{selectedTransaction.functionName}</span>
                  </div>
                </div>
              </div>

              {/* Demo Blockchain Features */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">🔗 Blockchain Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{selectedTransaction.demoFields.immutableRecord}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{selectedTransaction.demoFields.decentralizedProof}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{selectedTransaction.demoFields.blockchainVerified}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">{selectedTransaction.demoFields.realTimeSync}</span>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              {selectedTransaction.metadata && (
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-medium text-amber-900 mb-3">Metadata</h3>
                  <div className="space-y-2 text-sm">
                    {selectedTransaction.metadata.touristId && (
                      <div>
                        <span className="text-amber-700">Tourist ID:</span>
                        <span className="ml-2 font-mono">{selectedTransaction.metadata.touristId}</span>
                      </div>
                    )}
                    {selectedTransaction.metadata.identityId && (
                      <div>
                        <span className="text-amber-700">Identity ID:</span>
                        <span className="ml-2 font-mono">{selectedTransaction.metadata.identityId}</span>
                      </div>
                    )}
                    {selectedTransaction.metadata.emergencyLevel && (
                      <div>
                        <span className="text-amber-700">Emergency Level:</span>
                        <Badge className="ml-2" variant={
                          selectedTransaction.metadata.emergencyLevel === 'high' ? 'destructive' :
                          selectedTransaction.metadata.emergencyLevel === 'medium' ? 'default' : 'secondary'
                        }>
                          {selectedTransaction.metadata.emergencyLevel}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📊 Transaction History
        </h1>
        <p className="text-gray-600">
          Real-time blockchain transaction monitoring with comprehensive status tracking
        </p>
      </div>

      {/* Wallet Connection Check */}
      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-900">Wallet Connection Required</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Connect your wallet to view your blockchain transaction history.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {renderStatsCards()}

      {/* Filters */}
      {renderFilters()}

      {/* Transactions List */}
      {renderTransactionsList()}

      {/* Transaction Details Modal */}
      <AnimatePresence>
        {selectedTransaction && renderTransactionDetails()}
      </AnimatePresence>
    </div>
  );
};

export default TransactionHistory;
