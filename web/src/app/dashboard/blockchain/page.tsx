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
      <div className="dashboard-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Blockchain Verification
            </h1>
            <p className="text-muted-foreground">
              Secure identity verification and transaction monitoring on blockchain
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Network Healthy</span>
            </div>
            <button className="btn-secondary">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Blockchain Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="dashboard-card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">
                {blockchainStats.totalVerifications.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Verifications</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{blockchainStats.pendingVerifications}</div>
              <div className="text-sm text-muted-foreground">Pending Queue</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{blockchainStats.successRate}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{blockchainStats.averageTime}</div>
              <div className="text-sm text-muted-foreground">Avg Processing</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="dashboard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <select className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option>All Types</option>
                  <option>Identity Verification</option>
                  <option>Zone Entry</option>
                  <option>Emergency Alert</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {recentTransactions.map((tx) => {
                const TypeIcon = getTypeIcon(tx.type);
                return (
                  <div key={tx.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <TypeIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{tx.tourist}</h4>
                          <p className="text-sm text-muted-foreground">ID: {tx.touristId}</p>
                          <p className="text-xs text-muted-foreground font-mono">{tx.hash}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                      <div>
                        <div className="text-muted-foreground">Type</div>
                        <div className="font-medium text-foreground">{tx.type.replace('_', ' ')}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Block</div>
                        <div className="font-medium text-foreground">
                          {tx.blockNumber ? `#${tx.blockNumber}` : 'Pending'}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Gas Used</div>
                        <div className="font-medium text-foreground">
                          {tx.gasUsed ? tx.gasUsed : 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="text-xs text-muted-foreground">{tx.timestamp}</div>
                      <button className="btn-secondary btn-sm">
                        <Eye className="w-4 h-4 mr-1" />
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
        <div>
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Verification Queue</h3>
            <div className="space-y-4">
              {verificationQueue.map((verification) => (
                <div key={verification.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground">{verification.tourist}</h4>
                      <p className="text-sm text-muted-foreground">ID: {verification.touristId}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(verification.status)}`}>
                      {verification.status}
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="text-sm text-muted-foreground">Document: {verification.documentType}</div>
                    <div className="text-xs text-muted-foreground">ETA: {verification.estimatedTime}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{verification.submittedAt}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Network Info */}
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Network Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Latest Block</span>
                <span className="text-sm font-mono text-foreground">{blockchainStats.lastBlock}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Network Status</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {blockchainStats.networkStatus}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Gas Price</span>
                <span className="text-sm text-foreground">20 Gwei</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Block Time</span>
                <span className="text-sm text-foreground">~2.1s</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full btn-secondary justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Manual Verification
              </button>
              <button className="w-full btn-secondary justify-start">
                <Hash className="w-4 h-4 mr-2" />
                View Block Explorer
              </button>
              <button className="w-full btn-secondary justify-start">
                <Activity className="w-4 h-4 mr-2" />
                Network Statistics
              </button>
              <button className="w-full btn-secondary justify-start">
                <Download className="w-4 h-4 mr-2" />
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