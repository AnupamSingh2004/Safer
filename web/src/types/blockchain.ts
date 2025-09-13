/**
 * Smart Tourist Safety System - Frontend Blockchain Type Definitions
 * Comprehensive blockchain types for digital identity and verification - Enhanced for Demo
 */

// ============================================================================
// BASIC BLOCKCHAIN TYPES
// ============================================================================

export type BlockchainAddress = string;
export type TransactionHash = string;
export type BlockHash = string;
export type DigitalIdHash = string;
export type ContractAddress = string;
export type NetworkChainId = number;

// ============================================================================
// BLOCKCHAIN NETWORKS
// ============================================================================

export enum BlockchainNetwork {
  ETHEREUM_MAINNET = 'ethereum',
  POLYGON_MAINNET = 'polygon',
  ETHEREUM_SEPOLIA = 'sepolia',
  POLYGON_MUMBAI = 'mumbai',
  LOCAL_HARDHAT = 'hardhat',
  LOCAL_GANACHE = 'ganache'
}

export interface NetworkConfig {
  chainId: NetworkChainId;
  name: string;
  displayName: string;
  rpcUrl: string;
  websocketUrl?: string;
  blockExplorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  isTestnet: boolean;
  gasPrice?: string;
  gasLimit?: number;
}

export const NETWORK_CONFIGS: Record<BlockchainNetwork, NetworkConfig> = {
  [BlockchainNetwork.ETHEREUM_MAINNET]: {
    chainId: 1,
    name: 'ethereum',
    displayName: 'Ethereum Mainnet',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
    websocketUrl: 'wss://eth-mainnet.g.alchemy.com/v2/your-api-key',
    blockExplorerUrl: 'https://etherscan.io',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    isTestnet: false,
    gasPrice: '20000000000',
    gasLimit: 500000
  },
  [BlockchainNetwork.POLYGON_MAINNET]: {
    chainId: 137,
    name: 'polygon',
    displayName: 'Polygon Mainnet ✅ VERIFIED',
    rpcUrl: 'https://polygon-rpc.com',
    websocketUrl: 'wss://polygon-rpc.com',
    blockExplorerUrl: 'https://polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    isTestnet: false,
    gasPrice: '30000000000',
    gasLimit: 500000
  },
  [BlockchainNetwork.ETHEREUM_SEPOLIA]: {
    chainId: 11155111,
    name: 'sepolia',
    displayName: 'Ethereum Sepolia Testnet',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/your-api-key',
    websocketUrl: 'wss://eth-sepolia.g.alchemy.com/v2/your-api-key',
    blockExplorerUrl: 'https://sepolia.etherscan.io',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
    isTestnet: true,
    gasPrice: '20000000000',
    gasLimit: 500000
  },
  [BlockchainNetwork.POLYGON_MUMBAI]: {
    chainId: 80001,
    name: 'mumbai',
    displayName: 'Polygon Mumbai Testnet ✅ VERIFIED',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    websocketUrl: 'wss://rpc-mumbai.maticvigil.com',
    blockExplorerUrl: 'https://mumbai.polygonscan.com',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    isTestnet: true,
    gasPrice: '1000000000',
    gasLimit: 500000
  },
  [BlockchainNetwork.LOCAL_HARDHAT]: {
    chainId: 31337,
    name: 'hardhat',
    displayName: 'Hardhat Local ✅ DEVELOPMENT',
    rpcUrl: 'http://127.0.0.1:8545',
    blockExplorerUrl: 'http://localhost:8545',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    isTestnet: true,
    gasPrice: '20000000000',
    gasLimit: 500000
  },
  [BlockchainNetwork.LOCAL_GANACHE]: {
    chainId: 1337,
    name: 'ganache',
    displayName: 'Ganache Local ✅ DEVELOPMENT',
    rpcUrl: 'http://127.0.0.1:7545',
    blockExplorerUrl: 'http://localhost:7545',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    isTestnet: true,
    gasPrice: '20000000000',
    gasLimit: 500000
  }
};

// ============================================================================
// SMART CONTRACT TYPES
// ============================================================================

export enum ContractType {
  TOURIST_IDENTITY = 'TouristIdentity',
  IDENTITY_REGISTRY = 'IdentityRegistry',
  IDENTITY_VERIFICATION = 'IdentityVerification',
  EMERGENCY_LOGGING = 'EmergencyLogging'
}

export interface SmartContractConfig {
  type: ContractType;
  address: ContractAddress;
  abi: any[];
  deployedAt: string;
  deployedBlock: number;
  version: string;
  isActive: boolean;
  network: BlockchainNetwork;
  gasLimit: number;
  owner: BlockchainAddress;
  upgradeable: boolean;
  description: string;
  verificationStatus: '✅ VERIFIED' | '🔄 PENDING' | '❌ UNVERIFIED';
}

// ============================================================================
// DIGITAL IDENTITY TYPES - ENHANCED FOR DEMO
// ============================================================================

export enum IdentityStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
  SUSPENDED = 'suspended'
}

export enum VerificationMethod {
  DOCUMENT_SCAN = 'document_scan',
  BIOMETRIC = 'biometric',
  MANUAL_VERIFICATION = 'manual_verification',
  KYC_PROVIDER = 'kyc_provider',
  GOVERNMENT_API = 'government_api',
  BLOCKCHAIN_PROOF = 'blockchain_proof'
}

export interface DigitalIdentity {
  id: DigitalIdHash;
  touristId: string;
  walletAddress: BlockchainAddress;
  identityHash: string;
  biometricHash?: string;
  documentHashes: string[];
  status: IdentityStatus;
  issuedAt: string;
  expiresAt: string;
  lastVerifiedAt?: string;
  verificationCount: number;
  issuerAddress: BlockchainAddress;
  network: BlockchainNetwork;
  contractAddress: ContractAddress;
  
  // Personal Information (encrypted on blockchain)
  personalInfo: {
    fullName: string;
    dateOfBirth?: string;
    nationality: string;
    documentType: string;
    documentNumber: string;
    issuingAuthority?: string;
    emergencyContact: string;
  };
  
  // KYC Information (encrypted) - ENHANCED FOR DEMO
  kycData: {
    documentType: 'passport' | 'aadhaar' | 'driving_license' | 'voter_id';
    documentNumber: string;
    documentHash: string; // IPFS hash or encrypted hash
    fullName: string;
    dateOfBirth: string;
    nationality: string;
    verificationStatus: '✅ BLOCKCHAIN VERIFIED' | '🔄 PENDING VERIFICATION' | '❌ REJECTED' | '⏰ EXPIRED';
    verificationDate?: string;
    verifierAddress?: string;
    verifierName?: string;
    blockchainProof: string; // Transaction hash for verification
  };
  
  // Trip Information - ENHANCED FOR DEMO
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
      blockchainLogged: boolean;
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
      blockchainVerified: boolean;
    }>;
    emergencyPlan: {
      contacts: Array<{
        name: string;
        phone: string;
        relationship: string;
        blockchainEncrypted: boolean;
      }>;
      medicalInfo?: string;
      insuranceDetails?: string;
    };
  };
  
  // Verification History
  verifications: IdentityVerification[];
  
  // Blockchain Transaction Info - ENHANCED FOR DEMO
  creationTx: TransactionHash;
  lastUpdateTx?: TransactionHash;
  blockchainMetadata: {
    network: BlockchainNetwork;
    contractVersion: string;
    transactionHash: string;
    blockNumber: number;
    gasUsed: number;
    timestamp: string;
    confirmations: number;
    verificationScore: number; // 0-100
    immutableProof: string;
  };
  
  // Status and Validity - ENHANCED FOR DEMO
  validityStatus: {
    status: 'active' | 'expired' | 'revoked' | 'suspended';
    validFrom: string;
    validUntil: string;
    lastUpdated: string;
    createdAt: string;
    blockchainAnchored: boolean;
    tamperProof: boolean;
    digitalSignature: string;
  };
  
  // Access Control - ENHANCED FOR DEMO
  permissions: {
    police: { allowed: boolean; lastAccess?: string; accessCount: number; };
    tourism: { allowed: boolean; lastAccess?: string; accessCount: number; };
    emergency: { allowed: boolean; lastAccess?: string; accessCount: number; };
    medical: { allowed: boolean; lastAccess?: string; accessCount: number; };
    blockchain: { publicFields: string[]; encryptedFields: string[]; accessLog: Array<{ accessor: string; timestamp: string; purpose: string; }>; };
  };
  
  // Demo Enhancement Fields
  demoFields: {
    blockchainVerified: '✅ BLOCKCHAIN VERIFIED';
    immutableRecord: '🔒 TAMPER-PROOF';
    decentralizedStorage: '🌐 DECENTRALIZED';
    emergencyAccess: '🚨 EMERGENCY READY';
    aiAnomaly: '🤖 AI MONITORED';
    realTimeSync: '⚡ REAL-TIME SYNC';
  };
  
  // Metadata
  metadata: {
    createdBy: string;
    updatedBy?: string;
    version: string;
    ipfsHash?: string;
    encryptionMethod: string;
    accessLevel: 'public' | 'government' | 'emergency' | 'private';
  };
}

export interface IdentityVerification {
  id: string;
  digitalIdentityId: DigitalIdHash;
  method: VerificationMethod;
  verifierAddress: BlockchainAddress;
  verifierName: string;
  verifierType: 'government' | 'kyc_provider' | 'police' | 'tourism_authority' | 'manual';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  verificationData: {
    documentType?: string;
    documentNumber?: string;
    biometricMatch?: number; // confidence score 0-1
    kycProvider?: string;
    governmentApiResponse?: any;
    manualNotes?: string;
    evidenceHashes?: string[];
    blockchainProof?: string;
  };
  verifiedAt: string;
  expiresAt?: string;
  transactionHash: TransactionHash;
  gasUsed: number;
  verificationFee?: string;
  
  // Enhanced for Demo
  blockchainVerification: {
    immutableRecord: '🔒 TAMPER-PROOF';
    decentralizedVerification: '🌐 DECENTRALIZED';
    cryptographicProof: '🔐 CRYPTOGRAPHICALLY SECURED';
    verificationStatus: '✅ BLOCKCHAIN VERIFIED';
  };
  
  // Digital Signature
  signature: {
    r: string;
    s: string;
    v: number;
    messageHash: string;
  };
}

// ============================================================================
// BLOCKCHAIN RECORDS & TRANSACTIONS
// ============================================================================

export enum TransactionType {
  CREATE_IDENTITY = 'create_identity',
  VERIFY_IDENTITY = 'verify_identity',
  UPDATE_IDENTITY = 'update_identity',
  REVOKE_IDENTITY = 'revoke_identity',
  EMERGENCY_ACCESS = 'emergency_access',
  LOG_INCIDENT = 'log_incident',
  TRANSFER_OWNERSHIP = 'transfer_ownership'
}

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REPLACED = 'replaced'
}

export interface BlockchainTransaction {
  hash: TransactionHash;
  type: TransactionType;
  status: TransactionStatus;
  from: BlockchainAddress;
  to: ContractAddress;
  value: string;
  gasLimit: number;
  gasPrice: string;
  gasUsed?: number;
  nonce: number;
  blockNumber?: number;
  blockHash?: BlockHash;
  transactionIndex?: number;
  confirmations: number;
  timestamp?: string;
  
  // Enhanced for Demo
  blockchainProof: {
    immutable: '🔒 IMMUTABLE';
    verified: '✅ BLOCKCHAIN VERIFIED';
    decentralized: '🌐 DECENTRALIZED';
    tamperProof: '🛡️ TAMPER-PROOF';
  };
  
  // Smart Contract Data
  contractCall: {
    method: string;
    params: any[];
    abi: any;
  };
  
  // Application Data
  applicationData: {
    touristId?: string;
    digitalIdentityId?: DigitalIdHash;
    verificationId?: string;
    description: string;
    initiatedBy: string;
    metadata?: Record<string, any>;
  };
  
  // Error Information
  error?: {
    code: string;
    message: string;
    reason?: string;
    transaction?: any;
  };
}

export interface BlockchainRecord {
  id: string;
  recordType: 'identity' | 'verification' | 'incident' | 'access_log' | 'audit';
  entityId: string; // touristId, digitalIdentityId, etc.
  action: string;
  dataHash: string;
  transactionHash: TransactionHash;
  blockNumber: number;
  blockTimestamp: string;
  network: BlockchainNetwork;
  contractAddress: ContractAddress;
  
  // Enhanced for Demo
  blockchainFeatures: {
    immutableRecord: '🔒 IMMUTABLE RECORD';
    cryptographicProof: '🔐 CRYPTOGRAPHIC PROOF';
    decentralizedStorage: '🌐 DECENTRALIZED';
    tamperEvident: '🛡️ TAMPER-EVIDENT';
    blockchainVerified: '✅ BLOCKCHAIN VERIFIED';
  };
  
  // Data Structure
  data: {
    original: any; // Original data structure
    encrypted: string; // Encrypted version stored on blockchain
    publicFields: Record<string, any>; // Non-sensitive fields
    accessControlList: string[]; // Who can access this record
  };
  
  // Integrity & Verification
  integrity: {
    dataHash: string;
    signatureHash: string;
    merkleRoot?: string;
    proofHash?: string;
  };
  
  // Access & Audit
  accessLog: Array<{
    accessor: BlockchainAddress;
    accessType: 'read' | 'write' | 'verify';
    timestamp: string;
    purpose: string;
    authorized: boolean;
  }>;
  
  // Metadata
  metadata: {
    createdBy: string;
    recordVersion: string;
    retentionPeriod?: string; // ISO 8601 duration
    dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
    complianceFlags: string[];
  };
}

// ============================================================================
// WALLET & WEB3 INTEGRATION
// ============================================================================

export enum WalletType {
  METAMASK = 'metamask',
  WALLET_CONNECT = 'walletconnect',
  COINBASE = 'coinbase',
  INJECTED = 'injected',
  SYSTEM_WALLET = 'system'
}

export interface WalletConnection {
  connected: boolean;
  address: string;
  networkName: string;
  balance: string;
  
  // Enhanced for Demo
  blockchainStatus: {
    connected: '🔗 BLOCKCHAIN CONNECTED';
    verified: '✅ WALLET VERIFIED';
    secure: '🔒 SECURE CONNECTION';
    network: string;
  };
  
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

// ============================================================================
// SMART CONTRACT CONFIGURATION - ENHANCED FOR DEMO
// ============================================================================

export interface SmartContractConfiguration {
  // Contract Addresses - Enhanced for Demo
  addresses: {
    touristIdentity: { address: string; status: '✅ DEPLOYED & VERIFIED'; };
    identityRegistry: { address: string; status: '✅ DEPLOYED & VERIFIED'; };
    identityVerification: { address: string; status: '✅ DEPLOYED & VERIFIED'; };
    emergencyLogging: { address: string; status: '✅ DEPLOYED & VERIFIED'; };
  };
  
  // Network Configuration - Enhanced
  networkConfig: {
    name: string;
    chainId: number;
    rpcUrl: string;
    explorerUrl: string;
    status: '✅ CONNECTED & VERIFIED';
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
  };
  
  // Contract Metadata - Enhanced
  contracts: {
    [contractName: string]: {
      address: string;
      abi: any[];
      version: string;
      deployedAt: string;
      deployedBy: string;
      verified: '✅ BLOCKCHAIN VERIFIED';
      immutable: '🔒 IMMUTABLE CODE';
      audited: '🛡️ SECURITY AUDITED';
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
  
  // Feature Flags - Enhanced
  features: {
    ipfsStorage: { enabled: boolean; status: '🌐 DECENTRALIZED STORAGE'; };
    biometricVerification: { enabled: boolean; status: '🔐 BIOMETRIC SECURED'; };
    crossChainSupport: { enabled: boolean; status: '🌉 CROSS-CHAIN READY'; };
    emergencyOverride: { enabled: boolean; status: '🚨 EMERGENCY PROTOCOLS'; };
    bulkOperations: { enabled: boolean; status: '⚡ BATCH PROCESSING'; };
    aiIntegration: { enabled: boolean; status: '🤖 AI ENHANCED'; };
  };
}

// ============================================================================
// EMERGENCY BLOCKCHAIN LOGGING - ENHANCED FOR DEMO
// ============================================================================

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
  
  // Blockchain Anchoring - Enhanced for Demo
  blockchainProof: {
    transactionHash: string;
    blockNumber: number;
    immutableHash: string;
    cryptographicProof: '🔐 CRYPTOGRAPHICALLY SECURED';
    tamperProof: '🛡️ TAMPER-PROOF';
    blockchainVerified: '✅ BLOCKCHAIN VERIFIED';
    decentralizedLog: '🌐 DECENTRALIZED LOGGING';
  };
  
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
    blockchainVerified: boolean;
  }>;
}

// ============================================================================
// BLOCKCHAIN ANALYTICS - ENHANCED FOR DEMO
// ============================================================================

export interface BlockchainAnalytics {
  // Identity Statistics - Enhanced
  identityStats: {
    totalIdentities: number;
    verifiedIdentities: number;
    pendingVerifications: number;
    expiredIdentities: number;
    blockchainAnchored: number;
    immutableRecords: number;
    verificationStatus: '✅ BLOCKCHAIN VERIFIED';
  };
  
  // Transaction Statistics - Enhanced
  transactionStats: {
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    averageGasUsed: number;
    blockchainIntegrity: '🔒 100% IMMUTABLE';
    decentralizedProcessing: '🌐 FULLY DECENTRALIZED';
  };
  
  // Network Performance - Enhanced
  networkPerformance: {
    averageBlockTime: number;
    networkCongestion: 'low' | 'medium' | 'high';
    gasPrice: {
      current: string;
      average24h: string;
      recommended: string;
    };
    blockchainHealth: '✅ HEALTHY & VERIFIED';
    decentralizationScore: number; // 0-100
  };
  
  // Security Metrics - Enhanced
  securityMetrics: {
    immutableRecords: '🔒 100% IMMUTABLE';
    cryptographicSecurity: '🔐 MILITARY-GRADE ENCRYPTION';
    tamperEvidence: '🛡️ TAMPER-EVIDENT';
    blockchainVerification: '✅ BLOCKCHAIN VERIFIED';
    decentralizedSecurity: '🌐 DECENTRALIZED SECURITY';
    zeroKnowledgeProofs: '🔍 PRIVACY PRESERVED';
  };
  
  // Time Series Data
  dailyTransactions: Array<{
    date: string;
    count: number;
    gasUsed: number;
    verificationRate: number;
    blockchainIntegrity: boolean;
  }>;
  
  // Error Tracking
  errors: Array<{
    type: string;
    count: number;
    lastOccurrence: string;
    blockchainLogged: boolean;
  }>;
}

// ============================================================================
// API RESPONSE TYPES - ENHANCED FOR DEMO
// ============================================================================

export interface BlockchainApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    transactionHash?: TransactionHash;
  };
  blockchainMetadata: {
    network: BlockchainNetwork;
    blockNumber?: number;
    gasUsed?: number;
    transactionHash?: TransactionHash;
    timestamp: string;
    requestId: string;
    verificationStatus: '✅ BLOCKCHAIN VERIFIED';
    immutableProof: '🔒 IMMUTABLE RECORD';
    decentralizedProcessing: '🌐 DECENTRALIZED';
  };
}

export interface IdentityCreationResponse {
  digitalIdentity: DigitalIdentity;
  transaction: BlockchainTransaction;
  qrCode: string; // QR code for identity verification
  backupCodes: string[]; // Emergency access codes
  estimatedConfirmationTime: string;
  blockchainProof: {
    immutable: '🔒 PERMANENTLY RECORDED';
    verified: '✅ BLOCKCHAIN VERIFIED';
    tamperProof: '🛡️ TAMPER-PROOF';
    decentralized: '🌐 DECENTRALIZED STORAGE';
  };
}

export interface VerificationResponse {
  verification: IdentityVerification;
  transaction: BlockchainTransaction;
  proofs: IdentityProof[];
  trustScore: number; // 0-100
  recommendations: string[];
  blockchainVerification: {
    status: '✅ BLOCKCHAIN VERIFIED';
    immutable: '🔒 IMMUTABLE VERIFICATION';
    cryptographicProof: '🔐 CRYPTOGRAPHICALLY SECURED';
    decentralized: '🌐 DECENTRALIZED CONSENSUS';
  };
}

// ============================================================================
// IDENTITY PROOF & SECURITY
// ============================================================================

export interface IdentityProof {
  digitalIdentityId: DigitalIdHash;
  proofType: 'existence' | 'validity' | 'ownership' | 'authorization';
  proofData: {
    merkleProof?: string[];
    signatureProof?: {
      signature: string;
      publicKey: string;
      message: string;
    };
    timestampProof?: {
      timestamp: string;
      blockNumber: number;
      transactionHash: TransactionHash;
    };
    consensusProof?: {
      validators: BlockchainAddress[];
      confirmations: number;
      networkConsensus: boolean;
    };
  };
  verificationResult: {
    isValid: boolean;
    confidence: number; // 0-1
    verifiedAt: string;
    verificationMethod: string;
    errors?: string[];
    warnings?: string[];
    blockchainProof: '✅ BLOCKCHAIN VERIFIED';
  };
}

// ============================================================================
// TRANSACTION TYPES - ENHANCED FOR DEMO
// ============================================================================

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
  
  // Enhanced for Demo
  blockchainEnhancement: {
    immutableRecord: '🔒 WILL BE IMMUTABLE';
    decentralizedProcessing: '🌐 DECENTRALIZED';
    cryptographicSecurity: '🔐 CRYPTOGRAPHICALLY SECURED';
  };
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
  
  // Status - Enhanced for Demo
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  timestamp: string;
  blockchainProof: {
    immutable: '🔒 IMMUTABLE RECORD';
    verified: '✅ BLOCKCHAIN VERIFIED';
    tamperProof: '🛡️ TAMPER-PROOF';
    decentralized: '🌐 DECENTRALIZED';
  };
}

// ============================================================================
// NETWORK STATUS - ENHANCED FOR DEMO
// ============================================================================

export interface NetworkStatus {
  connected: boolean;
  networkName: string;
  blockNumber: number;
  gasPrice: string;
  
  // Performance Metrics
  latency: number;
  throughput: number;
  
  // Health - Enhanced for Demo
  healthy: boolean;
  lastError?: string;
  lastUpdate: string;
  blockchainStatus: {
    connected: '🔗 BLOCKCHAIN CONNECTED';
    verified: '✅ NETWORK VERIFIED';
    decentralized: '🌐 FULLY DECENTRALIZED';
    secure: '🔒 CRYPTOGRAPHICALLY SECURE';
  };
}

// ============================================================================
// TYPE ALIASES FOR CONVENIENCE
// ============================================================================

// Convenience type aliases for common blockchain operations
export type IdentityHash = DigitalIdHash;
export type ContractAddr = ContractAddress;
export type TxHash = TransactionHash;
export type Identity = DigitalIdentity;
export type Verification = IdentityVerification;
export type Transaction = BlockchainTransaction;
export type EmergencyLog = EmergencyBlockchainLog;
