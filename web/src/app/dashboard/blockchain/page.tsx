/**
 * Smart Tourist Safety System - Blockchain Verification Page
 * Blockchain identity verification and transaction monitoring
 */

'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Users,
  Link as LinkIcon,
  Hash,
  Activity,
  Eye,
  Download,
  Search,
  Filter
} from 'lucide-react';

const BlockchainPage = () => {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  // Mock blockchain data
  const blockchainStats = {
    totalVerifications: 15247,
    pendingVerifications: 23,
    successRate: 99.7,
    averageTime: '2.3s',
    lastBlock: '0x1a2b3c...',
    networkStatus: 'healthy'
  };

  const recentTransactions = [
    {
      id: 'TX-001',
      type: 'identity_verification',
      tourist: 'Sarah Chen',
      touristId: 'TID-54321',
      hash: '0x1a2b3c4d5e6f...',
      status: 'confirmed',
      timestamp: '2025-01-15 14:30:22',
      blockNumber: 2847,
      gasUsed: '21000'
    },
    {
      id: 'TX-002',
      type: 'zone_entry',
      tourist: 'Michael Kumar',
      touristId: 'TID-12345',
      hash: '0x2b3c4d5e6f7a...',
      status: 'confirmed',
      timestamp: '2025-01-15 14:28:15',
      blockNumber: 2846,
      gasUsed: '18500'
    },
    {
      id: 'TX-003',
      type: 'emergency_alert',
      tourist: 'Lisa Wong',
      touristId: 'TID-67890',
      hash: '0x3c4d5e6f7a8b...',
      status: 'pending',
      timestamp: '2025-01-15 14:25:33',
      blockNumber: null,
      gasUsed: null
    },
    {
      id: 'TX-004',
      type: 'identity_verification',
      tourist: 'David Smith',
      touristId: 'TID-98765',
      hash: '0x4d5e6f7a8b9c...',
      status: 'confirmed',
      timestamp: '2025-01-15 14:20:44',
      blockNumber: 2845,
      gasUsed: '21000'
    }
  ];

  const verificationQueue = [
    {
      id: 'VER-001',
      tourist: 'Emma Johnson',
      touristId: 'TID-11111',
      documentType: 'passport',
      submittedAt: '2025-01-15 14:35:00',
      status: 'processing',
      estimatedTime: '30s'
    },
    {
      id: 'VER-002',
      tourist: 'Carlos Rodriguez',
      touristId: 'TID-22222',
      documentType: 'visa',
      submittedAt: '2025-01-15 14:33:15',
      status: 'pending',
      estimatedTime: '45s'
    },
    {
      id: 'VER-003',
      tourist: 'Yuki Tanaka',
      touristId: 'TID-33333',
      documentType: 'passport',
      submittedAt: '2025-01-15 14:31:30',
      status: 'validating',
      estimatedTime: '15s'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'failed': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'processing': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'validating': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'identity_verification': return Shield;
      case 'zone_entry': return LinkIcon;
      case 'emergency_alert': return AlertTriangle;
      default: return Activity;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-card p-8 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Blockchain Verification
            </h1>
            <p className="text-muted-foreground text-lg">
              Secure identity verification and transaction monitoring on blockchain
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">Network Healthy</span>
            </div>
            <button className="btn-secondary px-6 py-3">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Blockchain Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="dashboard-card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {blockchainStats.totalVerifications.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Total Verifications</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{blockchainStats.pendingVerifications}</div>
              <div className="text-sm text-muted-foreground mt-1">Pending Queue</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{blockchainStats.successRate}%</div>
              <div className="text-sm text-muted-foreground mt-1">Success Rate</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{blockchainStats.averageTime}</div>
              <div className="text-sm text-muted-foreground mt-1">Avg Processing</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="dashboard-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Recent Transactions</h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="pl-10 pr-4 py-2 w-64 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <select className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option>All Types</option>
                  <option>Identity Verification</option>
                  <option>Zone Entry</option>
                  <option>Emergency Alert</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {recentTransactions.map((tx) => {
                const TypeIcon = getTypeIcon(tx.type);
                return (
                  <div key={tx.id} className="border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                          <TypeIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-foreground">{tx.tourist}</h4>
                          <p className="text-sm text-muted-foreground mt-1">ID: {tx.touristId}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-1 bg-muted/50 px-2 py-1 rounded">
                            {tx.hash}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-2 text-sm font-semibold rounded-full ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-4">
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="text-sm text-muted-foreground mb-1">Type</div>
                        <div className="font-semibold text-foreground capitalize">
                          {tx.type.replace('_', ' ')}
                        </div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="text-sm text-muted-foreground mb-1">Block</div>
                        <div className="font-semibold text-foreground">
                          {tx.blockNumber ? `#${tx.blockNumber}` : 'Pending'}
                        </div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="text-sm text-muted-foreground mb-1">Gas Used</div>
                        <div className="font-semibold text-foreground">
                          {tx.gasUsed ? tx.gasUsed : 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="text-sm text-muted-foreground">{tx.timestamp}</div>
                      <button className="btn-secondary px-4 py-2">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Verification Queue */}
        <div className="space-y-6">
          <div className="dashboard-card p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Verification Queue</h3>
            <div className="space-y-4">
              {verificationQueue.map((verification) => (
                <div key={verification.id} className="border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">{verification.tourist}</h4>
                      <p className="text-sm text-muted-foreground mt-1">ID: {verification.touristId}</p>
                    </div>
                    <span className={`px-3 py-2 text-sm font-semibold rounded-full ${getStatusColor(verification.status)}`}>
                      {verification.status}
                    </span>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 mb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-muted-foreground">Document Type</div>
                        <div className="font-semibold text-foreground capitalize">{verification.documentType}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">ETA</div>
                        <div className="font-semibold text-primary">{verification.estimatedTime}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{verification.submittedAt}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Network Info */}
          <div className="dashboard-card p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Network Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-sm font-medium text-muted-foreground">Latest Block</span>
                <span className="text-sm font-mono font-semibold text-foreground bg-muted/50 px-3 py-1 rounded">
                  {blockchainStats.lastBlock}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-sm font-medium text-muted-foreground">Network Status</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                  {blockchainStats.networkStatus}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-sm font-medium text-muted-foreground">Gas Price</span>
                <span className="text-sm font-semibold text-foreground">20 Gwei</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-muted-foreground">Block Time</span>
                <span className="text-sm font-semibold text-foreground">~2.1s</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center justify-start p-4 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl transition-colors text-foreground font-medium">
                <Shield className="w-5 h-5 mr-3 text-primary" />
                Manual Verification
              </button>
              <button className="flex items-center justify-start p-4 bg-muted/30 hover:bg-muted/50 border border-border rounded-xl transition-colors text-foreground font-medium">
                <Hash className="w-5 h-5 mr-3 text-muted-foreground" />
                View Block Explorer
              </button>
              <button className="flex items-center justify-start p-4 bg-muted/30 hover:bg-muted/50 border border-border rounded-xl transition-colors text-foreground font-medium">
                <Activity className="w-5 h-5 mr-3 text-muted-foreground" />
                Network Statistics
              </button>
              <button className="flex items-center justify-start p-4 bg-muted/30 hover:bg-muted/50 border border-border rounded-xl transition-colors text-foreground font-medium">
                <Download className="w-5 h-5 mr-3 text-muted-foreground" />
                Export Blockchain Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainPage;