/**
 * Smart Tourist Safety System - Blockchain Type Definitions (Web)
 * Comprehensive blockchain interfaces for digital identity and smart contracts
 */

// Digital Identity Interfaces
export interface DigitalIdentity {
  id: string;
  contractAddress: string;
  touristId: string;
  blockchainId: string;
  walletAddress: string;
  
  // KYC Information (encrypted)
  kycData: {
    documentType: 'passport' | 'aadhaar' | 'driving_license' | 'voter_id';
    documentNumber: string;
    documentHash: string; // IPFS hash or encrypted hash
    fullName: string;
    dateOfBirth: string;
    nationality: string;
    verificationStatus: 'pending' | 'verified' | 'rejected' | 'expired';
    verificationDate?: string;
    verifierAddress?: string;
  };
  
  // Trip Information
  tripData: {
    itinerary: Array<{
      location: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
      plannedArrival: string;
      plannedDeparture: string;
      purpose: string;
    }>;
    startDate: string;
    endDate: string;
    purpose: 'tourism' | 'business' | 'transit' | 'medical' | 'education';
    groupSize: number;
    accommodations: Array<{
      name: string;
      address: string;
      checkIn: string;
      checkOut: string;
    }>;
  };
  
  // Emergency Contacts
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
    email: string;
    isPrimary: boolean;
  }>;
  
  // Blockchain Metadata
  blockchain: {
    network: 'ethereum' | 'polygon' | 'bsc' | 'avalanche';
    contractVersion: string;
    transactionHash: string;
    blockNumber: number;
    gasUsed: number;
    timestamp: string;
  };
  
  // Status and Validity
  status: 'active' | 'expired' | 'revoked' | 'suspended';
  validFrom: string;
  validUntil: string;
  lastUpdated: string;
  createdAt: string;
  
  // Access Control
  permissions: {
    police: boolean;
    tourism: boolean;
    emergency: boolean;
    medical: boolean;
  };
}

// Blockchain Transaction Records
export interface BlockchainRecord {
  id: string;
  type: 'identity_creation' | 'identity_update' | 'verification' | 'access_log' | 'emergency_log';
  identityId: string;
  transactionHash: string;
  blockNumber: number;
  
  // Transaction Details
  from: string;
  to: string;
  gasUsed: number;
  gasPrice: string;
  value: string;
  
  // Record Data
  data: {
    action: string;
    previousHash?: string;
    newHash: string;
    changes?: Record<string, any>;
    authorizedBy: string;
    reason?: string;
  };
  
  // Network Information
  network: string;
  confirmations: number;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  
  // Verification
  verified: boolean;
  verificationDate?: string;
  verifierAddress?: string;
}

// Identity Verification Process
export interface IdentityVerification {
  id: string;
  identityId: string;
  verifier: {
    address: string;
    role: 'government' | 'police' | 'embassy' | 'tourism_board';
    name: string;
    authority: string;
  };
  
  // Verification Details
  verificationType: 'initial' | 'periodic' | 'emergency' | 'update';
  documentsChecked: string[];
  biometricChecked: boolean;
  
  // Results
  status: 'pending' | 'in_progress' | 'verified' | 'rejected' | 'requires_review';
  score: number; // 0-100 verification confidence
  
  // Verification Data
  checks: {
    documentValidity: boolean;
    biometricMatch: boolean;
    crossReference: boolean;
    sanctionsList: boolean;
    criminalRecord: boolean;
  };
  
  // Timeline
  submittedAt: string;
  reviewedAt?: string;
  completedAt?: string;
  expiresAt: string;
  
  // Notes and Evidence
  notes?: string;
  evidenceHashes: string[];
  
  // Blockchain Anchoring
  transactionHash?: string;
  blockNumber?: number;
}

// Smart Contract Configuration
export interface SmartContractConfig {
  // Contract Addresses
  addresses: {
    touristIdentity: string;
    identityRegistry: string;
    identityVerification: string;
    emergencyLogging: string;
  };
  
  // Network Configuration
  network: {
    name: string;
    chainId: number;
    rpcUrl: string;
    explorerUrl: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
  };
  
  // Contract Metadata
  contracts: {
    [contractName: string]: {
      address: string;
      abi: any[];
      version: string;
      deployedAt: string;
      deployedBy: string;
      verified: boolean;
    };
  };
  
  // Gas Configuration
  gas: {
    identityCreation: number;
    identityUpdate: number;
    verification: number;
    emergencyLog: number;
    defaultGasPrice: string;
    maxGasPrice: string;
  };
  
  // Feature Flags
  features: {
    ipfsStorage: boolean;
    biometricVerification: boolean;
    crossChainSupport: boolean;
    emergencyOverride: boolean;
    bulkOperations: boolean;
  };
}

// Wallet Integration
export interface WalletConnection {
  connected: boolean;
  address: string;
  network: string;
  balance: string;
  
  // Wallet Provider
  provider: 'metamask' | 'walletconnect' | 'coinbase' | 'trust' | 'other';
  providerInfo: {
    name: string;
    version: string;
    icon: string;
  };
  
  // Connection Status
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastConnected: string;
  
  // Permissions
  permissions: string[];
}

// Transaction Request/Response
export interface TransactionRequest {
  type: 'identity_creation' | 'identity_update' | 'verification' | 'emergency';
  identityId?: string;
  data: Record<string, any>;
  
  // Transaction Options
  gasLimit?: number;
  gasPrice?: string;
  value?: string;
  
  // Authorization
  authorizedBy: string;
  signature?: string;
  reason?: string;
}

export interface TransactionResponse {
  success: boolean;
  transactionHash: string;
  blockNumber?: number;
  gasUsed?: number;
  
  // Response Data
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  
  // Status
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  timestamp: string;
}

// Emergency Blockchain Logging
export interface EmergencyBlockchainLog {
  id: string;
  emergencyId: string;
  identityId: string;
  
  // Emergency Details
  type: 'panic_button' | 'geofence_breach' | 'inactivity' | 'medical' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  // Location Data
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: string;
  };
  
  // Blockchain Anchoring
  transactionHash: string;
  blockNumber: number;
  immutableHash: string;
  
  // Verification
  verified: boolean;
  verificationHash: string;
  timestamp: string;
  
  // Access Log
  accessedBy: Array<{
    address: string;
    role: string;
    timestamp: string;
    purpose: string;
  }>;
}

// IPFS Integration
export interface IPFSHash {
  hash: string;
  size: number;
  type: 'document' | 'image' | 'metadata' | 'encrypted';
  
  // Encryption
  encrypted: boolean;
  encryptionKey?: string;
  
  // Metadata
  filename?: string;
  mimeType?: string;
  uploadedAt: string;
  uploadedBy: string;
  
  // Access Control
  accessList: string[];
  publicRead: boolean;
}

// Network Status
export interface NetworkStatus {
  connected: boolean;
  network: string;
  blockNumber: number;
  gasPrice: string;
  
  // Performance Metrics
  latency: number;
  throughput: number;
  
  // Health
  healthy: boolean;
  lastError?: string;
  lastUpdate: string;
}

// Contract Events
export interface ContractEvent {
  id: string;
  contract: string;
  event: string;
  
  // Event Data
  blockNumber: number;
  transactionHash: string;
  logIndex: number;
  
  // Decoded Data
  args: Record<string, any>;
  timestamp: string;
  
  // Processing
  processed: boolean;
  processedAt?: string;
}

// Blockchain Analytics
export interface BlockchainAnalytics {
  // Identity Statistics
  totalIdentities: number;
  verifiedIdentities: number;
  pendingVerifications: number;
  expiredIdentities: number;
  
  // Transaction Statistics
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  averageGasUsed: number;
  
  // Network Performance
  averageBlockTime: number;
  networkCongestion: 'low' | 'medium' | 'high';
  gasPrice: {
    current: string;
    average24h: string;
    recommended: string;
  };
  
  // Time Series Data
  dailyTransactions: Array<{
    date: string;
    count: number;
    gasUsed: number;
  }>;
  
  // Error Tracking
  errors: Array<{
    type: string;
    count: number;
    lastOccurrence: string;
  }>;
}
