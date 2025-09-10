/**
 * Smart Tourist Safety System - Blockchain Type Definitions (Backend)
 * Server-side blockchain interfaces for digital identity and smart contracts
 */

// Digital Identity Interfaces (Backend)
export interface DigitalIdentity {
  id: string;
  contractAddress: string;
  touristId: string;
  blockchainId: string;
  walletAddress: string;
  
  // KYC Information (server-side with encryption)
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
    encryptedData?: string; // Server-side encrypted storage
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
      confirmationNumber?: string;
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
    confirmations: number;
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
  
  // Server-side metadata
  serverMetadata: {
    ipAddress: string;
    userAgent: string;
    registrationLocation: {
      latitude: number;
      longitude: number;
    };
    kycDocuments: string[]; // IPFS hashes
  };
}

// Blockchain Transaction Records (Backend)
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
    serverSignature: string; // Server-side verification
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
  
  // Server-side tracking
  processedAt: string;
  processingNode: string;
  retryCount: number;
  lastError?: string;
}

// Server-side Contract Configuration
export interface SmartContractConfig {
  // Environment Configuration
  environment: 'development' | 'staging' | 'production';
  
  // Contract Addresses by Network
  networks: {
    [networkName: string]: {
      chainId: number;
      rpcUrl: string;
      rpcBackupUrls: string[];
      explorerUrl: string;
      contracts: {
        touristIdentity: string;
        identityRegistry: string;
        identityVerification: string;
        emergencyLogging: string;
      };
    };
  };
  
  // Default Network
  defaultNetwork: string;
  
  // Contract ABIs
  contractABIs: {
    [contractName: string]: any[];
  };
  
  // Gas Configuration
  gas: {
    identityCreation: number;
    identityUpdate: number;
    verification: number;
    emergencyLog: number;
    defaultGasPrice: string;
    maxGasPrice: string;
    gasMultiplier: number; // For gas estimation
  };
  
  // Server Configuration
  server: {
    privateKey: string; // Server wallet private key
    masterAddress: string; // Server master address
    backupPrivateKeys: string[]; // Backup keys
    encryptionKey: string; // Data encryption key
  };
  
  // API Keys and External Services
  services: {
    infura?: {
      projectId: string;
      projectSecret: string;
    };
    alchemy?: {
      apiKey: string;
    };
    ipfs?: {
      gateway: string;
      pinataApiKey?: string;
      pinataSecretKey?: string;
    };
  };
  
  // Feature Flags
  features: {
    ipfsStorage: boolean;
    biometricVerification: boolean;
    crossChainSupport: boolean;
    emergencyOverride: boolean;
    bulkOperations: boolean;
    autoRetry: boolean;
  };
  
  // Rate Limiting
  rateLimits: {
    identityCreation: number; // per hour
    verification: number; // per hour
    emergencyLogs: number; // per minute
  };
}

// Server-side Transaction Processing
export interface TransactionProcessor {
  id: string;
  type: 'identity_creation' | 'identity_update' | 'verification' | 'emergency';
  status: 'queued' | 'processing' | 'confirmed' | 'failed' | 'retrying';
  
  // Transaction Data
  transactionData: {
    to: string;
    data: string;
    gasLimit: number;
    gasPrice: string;
    value: string;
  };
  
  // Processing Metadata
  queuedAt: string;
  startedAt?: string;
  completedAt?: string;
  retryCount: number;
  maxRetries: number;
  
  // Results
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: number;
  error?: {
    code: string;
    message: string;
    stack?: string;
  };
  
  // Priority and Dependencies
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies: string[]; // Other transaction IDs that must complete first
}

// Identity Verification Service
export interface IdentityVerificationService {
  id: string;
  identityId: string;
  
  // Verification Request
  request: {
    documentType: string;
    documentImages: string[]; // IPFS hashes
    biometricData?: string; // IPFS hash
    submittedBy: string;
    submittedAt: string;
  };
  
  // AI/ML Processing
  aiVerification: {
    documentAnalysis: {
      documentValid: boolean;
      confidence: number;
      extractedData: Record<string, any>;
      anomaliesDetected: string[];
    };
    biometricAnalysis?: {
      faceMatch: boolean;
      livenessCheck: boolean;
      confidence: number;
    };
    crossReference: {
      sanctionsList: boolean;
      criminalDatabase: boolean;
      globalDatabase: boolean;
    };
  };
  
  // Human Review
  humanReview?: {
    reviewerId: string;
    reviewerRole: string;
    decision: 'approve' | 'reject' | 'request_more_info';
    notes: string;
    reviewedAt: string;
  };
  
  // Final Status
  finalStatus: 'verified' | 'rejected' | 'pending' | 'expired';
  verificationScore: number; // 0-100
  expiresAt: string;
  
  // Blockchain Anchoring
  blockchainRecord?: {
    transactionHash: string;
    blockNumber: number;
    timestamp: string;
  };
}

// Emergency Logging Service
export interface EmergencyLoggingService {
  id: string;
  emergencyId: string;
  identityId: string;
  
  // Emergency Data
  emergencyData: {
    type: 'panic_button' | 'geofence_breach' | 'inactivity' | 'medical' | 'security';
    severity: 'low' | 'medium' | 'high' | 'critical';
    location: {
      latitude: number;
      longitude: number;
      accuracy: number;
      timestamp: string;
    };
    deviceInfo: {
      deviceId: string;
      platform: string;
      appVersion: string;
      batteryLevel?: number;
    };
  };
  
  // Processing Pipeline
  processing: {
    received: string;
    validated: string;
    processed: string;
    blockchainLogged?: string;
    responseDispatched?: string;
  };
  
  // Response Tracking
  response: {
    alertsSent: string[];
    responderIds: string[];
    estimatedArrival?: string;
    actualArrival?: string;
    resolved?: string;
  };
  
  // Blockchain Immutable Log
  blockchainLog: {
    transactionHash: string;
    blockNumber: number;
    immutableHash: string;
    timestamp: string;
    gasUsed: number;
  };
  
  // Access Audit
  accessLog: Array<{
    accessedBy: string;
    role: string;
    timestamp: string;
    purpose: string;
    ipAddress: string;
  }>;
}

// Blockchain Service Configuration
export interface BlockchainServiceConfig {
  // Service Settings
  maxConcurrentTransactions: number;
  transactionTimeout: number; // in seconds
  retryDelay: number; // in seconds
  maxRetries: number;
  
  // Monitoring
  healthCheck: {
    interval: number; // in seconds
    endpoints: string[];
    alertThreshold: number; // failure percentage
  };
  
  // Backup and Recovery
  backup: {
    enabled: boolean;
    interval: number; // in minutes
    retentionDays: number;
    storageLocation: string;
  };
  
  // Security
  security: {
    encryptionAlgorithm: string;
    keyRotationDays: number;
    auditLogRetentionDays: number;
    allowedIpRanges: string[];
  };
  
  // Performance
  performance: {
    cacheEnabled: boolean;
    cacheTtl: number; // in seconds
    batchSize: number;
    connectionPoolSize: number;
  };
}

// API Response Types
export interface BlockchainAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  
  // Blockchain specific metadata
  blockchain?: {
    transactionHash?: string;
    blockNumber?: number;
    gasUsed?: number;
    confirmations?: number;
  };
  
  // Server metadata
  server: {
    timestamp: string;
    requestId: string;
    processingTime: number; // in ms
    node: string;
  };
}

// Contract Event Listener
export interface ContractEventListener {
  id: string;
  contract: string;
  event: string;
  
  // Listener Configuration
  fromBlock: number;
  toBlock: 'latest' | number;
  active: boolean;
  
  // Processing
  lastProcessedBlock: number;
  eventsProcessed: number;
  errorsEncountered: number;
  
  // Callback Configuration
  callback: {
    endpoint: string;
    retries: number;
    timeout: number;
  };
  
  // Health
  lastHealthCheck: string;
  healthy: boolean;
  lastError?: string;
}

// Blockchain Analytics (Server-side)
export interface BlockchainAnalyticsService {
  // Real-time Metrics
  currentMetrics: {
    activeConnections: number;
    pendingTransactions: number;
    successRate: number; // last 24h
    averageConfirmationTime: number; // in seconds
    currentGasPrice: string;
  };
  
  // Historical Data
  historicalData: {
    daily: Array<{
      date: string;
      transactions: number;
      gasUsed: string;
      averageGasPrice: string;
      successRate: number;
    }>;
    weekly: Array<{
      week: string;
      identitiesCreated: number;
      verificationsCompleted: number;
      emergencyLogs: number;
    }>;
  };
  
  // Performance Metrics
  performance: {
    nodeLatency: Record<string, number>;
    rpcEndpointHealth: Record<string, boolean>;
    contractResponseTimes: Record<string, number>;
  };
  
  // Error Analysis
  errorAnalysis: {
    frequentErrors: Array<{
      error: string;
      count: number;
      lastOccurrence: string;
    }>;
    failurePatterns: Array<{
      pattern: string;
      frequency: number;
    }>;
  };
}
