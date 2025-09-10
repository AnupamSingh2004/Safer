/**
 * Smart Tourist Safety System - Verify Identity API Route
 * Handles identity verification and validation with blockchain attestation
 */

import { NextRequest, NextResponse } from 'next/server';
import { IdentityManager } from '../../../../lib/blockchain/identity-manager';
import { Web3Client } from '../../../../lib/blockchain/web3-client';
import { SmartContractConfig } from '../../../../types/blockchain';
import { ethers } from 'ethers';

// Mock blockchain configuration (same as generate-identity)
const mockBlockchainConfig: SmartContractConfig = {
  environment: 'development',
  networks: {
    polygon: {
      chainId: 137,
      rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
      rpcBackupUrls: ['https://rpc-mainnet.maticvigil.com'],
      explorerUrl: 'https://polygonscan.com',
      contracts: {
        touristIdentity: '0x1234567890123456789012345678901234567890',
        identityRegistry: '0x2345678901234567890123456789012345678901',
        identityVerification: '0x3456789012345678901234567890123456789012',
        emergencyLogging: '0x4567890123456789012345678901234567890123'
      }
    }
  },
  defaultNetwork: 'polygon',
  contractABIs: {
    touristIdentity: [],
    identityRegistry: [],
    identityVerification: [],
    emergencyLogging: []
  },
  server: {
    privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY || '',
    masterAddress: process.env.BLOCKCHAIN_MASTER_ADDRESS || '',
    backupPrivateKeys: [],
    encryptionKey: process.env.BLOCKCHAIN_ENCRYPTION_KEY || ''
  },
  services: {
    infura: {
      projectId: process.env.INFURA_PROJECT_ID || '',
      projectSecret: process.env.INFURA_PROJECT_SECRET || ''
    }
  },
  gas: {
    identityCreation: 500000,
    identityUpdate: 200000,
    verification: 100000,
    emergencyLog: 150000,
    defaultGasPrice: '20000000000',
    maxGasPrice: '100000000000',
    gasMultiplier: 1.2
  },
  features: {
    ipfsStorage: true,
    biometricVerification: false,
    crossChainSupport: false,
    emergencyOverride: true,
    bulkOperations: true,
    autoRetry: true
  },
  rateLimits: {
    identityCreation: 10,
    verification: 50,
    emergencyLogs: 100
  }
};

// Initialize services
let web3Client: Web3Client | null = null;
let identityManager: IdentityManager | null = null;

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Verification status types
type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'expired' | 'suspended';
type VerifierRole = 'government' | 'police' | 'tourism' | 'emergency' | 'system';

// Request/Response interfaces
interface VerifyIdentityRequest {
  identityId?: number;
  touristIdHash?: string;
  walletAddress?: string;
  qrCode?: string;
  verificationData: {
    documentImages: string[]; // Additional verification documents
    biometricData?: string;
    locationData: {
      latitude: number;
      longitude: number;
      address: string;
      timestamp: string;
    };
    verifierInfo: {
      role: VerifierRole;
      badgeNumber?: string;
      department?: string;
      location?: string;
    };
  };
  emergencyOverride?: boolean;
}

interface BulkVerifyRequest {
  identities: Array<{
    identityId: number;
    status: VerificationStatus;
    notes?: string;
  }>;
  verifierInfo: {
    role: VerifierRole;
    badgeNumber?: string;
    department?: string;
  };
}

// Utility functions
const initializeBlockchainServices = async (): Promise<void> => {
  if (!web3Client) {
    web3Client = new Web3Client(mockBlockchainConfig);
    identityManager = new IdentityManager(web3Client);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Running in development mode - simulating blockchain operations');
    } else {
      await identityManager.initialize(mockBlockchainConfig.server.privateKey);
    }
  }
};

const validateVerificationRequest = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // At least one identity identifier required
  if (!data.identityId && !data.touristIdHash && !data.walletAddress && !data.qrCode) {
    errors.push('At least one identity identifier (identityId, touristIdHash, walletAddress, or qrCode) is required');
  }

  // Validate verification data
  if (!data.verificationData) {
    errors.push('Verification data is required');
    return { valid: false, errors };
  }

  const { locationData, verifierInfo } = data.verificationData;

  // Validate location data
  if (!locationData?.latitude || !locationData?.longitude) {
    errors.push('Valid location coordinates are required');
  }
  if (!locationData?.timestamp || !isValidDate(locationData.timestamp)) {
    errors.push('Valid timestamp is required');
  }

  // Validate verifier info
  if (!verifierInfo?.role || !['government', 'police', 'tourism', 'emergency', 'system'].includes(verifierInfo.role)) {
    errors.push('Valid verifier role is required');
  }

  return { valid: errors.length === 0, errors };
};

const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

const checkRateLimit = (key: string, limit: number, windowMs: number): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
};

const generateMockVerificationResponse = (request: VerifyIdentityRequest) => {
  const statuses: VerificationStatus[] = ['verified', 'pending', 'rejected'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    success: true,
    verificationId: Math.floor(Math.random() * 10000) + 1,
    status: randomStatus,
    transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
    blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
    gasUsed: Math.floor(Math.random() * 50000) + 50000,
    verifiedAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString() // 6 months
  };
};

// POST - Verify identity
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await initializeBlockchainServices();

    const body = await request.json();
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const action = body.action || 'verify';

    // Handle bulk verification
    if (action === 'bulk-verify') {
      return handleBulkVerification(body as BulkVerifyRequest, clientIp);
    }

    // Rate limiting check for individual verification
    if (!checkRateLimit(`verification_${clientIp}`, mockBlockchainConfig.rateLimits.verification, 60 * 60 * 1000)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Rate limit exceeded for identity verification',
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many verification requests from this IP'
          }
        },
        { status: 429 }
      );
    }

    // Validate request
    const validation = validateVerificationRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Request validation failed',
            details: validation.errors
          }
        },
        { status: 400 }
      );
    }

    const verificationRequest = body as VerifyIdentityRequest;

    if (process.env.NODE_ENV === 'development') {
      // Simulate verification process
      const mockResponse = generateMockVerificationResponse(verificationRequest);
      
      return NextResponse.json({
        success: true,
        message: 'Identity verification completed (simulated)',
        data: {
          verificationId: mockResponse.verificationId,
          status: mockResponse.status,
          identityDetails: {
            identityId: verificationRequest.identityId || Math.floor(Math.random() * 10000) + 1,
            isValid: mockResponse.status === 'verified',
            verifiedAt: mockResponse.verifiedAt,
            validUntil: mockResponse.validUntil,
            verifierRole: verificationRequest.verificationData.verifierInfo.role,
            lastActivity: new Date().toISOString()
          },
          blockchain: {
            transactionHash: mockResponse.transactionHash,
            blockNumber: mockResponse.blockNumber,
            gasUsed: mockResponse.gasUsed,
            network: 'polygon'
          },
          verification: {
            confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
            documentScore: Math.floor(Math.random() * 20) + 80, // 80-100%
            biometricScore: verificationRequest.verificationData.biometricData ? 
              Math.floor(Math.random() * 15) + 85 : null, // 85-100% if provided
            locationVerified: true,
            riskLevel: mockResponse.status === 'verified' ? 'low' : 'medium'
          },
          attestations: [
            {
              type: 'document_verification',
              issuer: 'Government Document Validator',
              status: mockResponse.status,
              timestamp: mockResponse.verifiedAt
            },
            {
              type: 'location_verification',
              issuer: 'GPS Location Service',
              status: 'verified',
              timestamp: verificationRequest.verificationData.locationData.timestamp
            }
          ]
        },
        metadata: {
          requestId: `verify_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          processingTime: Math.floor(Math.random() * 2000) + 500,
          verificationLocation: verificationRequest.verificationData.locationData.address
        }
      });

    } else {
      // Production blockchain verification
      const result = await identityManager!.verifyIdentity(
        verificationRequest.identityId!, 
        mockBlockchainConfig.server.masterAddress
      );

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            message: 'Identity verification failed',
            error: {
              code: 'VERIFICATION_FAILED',
              message: result.error || 'Unknown verification error'
            }
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Identity verification completed',
        data: {
          identityId: verificationRequest.identityId,
          status: 'verified',
          blockchain: {
            transactionHash: result.transactionHash,
            network: 'polygon'
          },
          verifiedAt: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error('Error verifying identity:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error verifying identity',
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred'
        }
      },
      { status: 500 }
    );
  }
}

// Handle bulk verification
async function handleBulkVerification(request: BulkVerifyRequest, clientIp: string): Promise<NextResponse> {
  // Rate limiting for bulk operations
  if (!checkRateLimit(`bulk_verification_${clientIp}`, 5, 60 * 60 * 1000)) { // 5 per hour
    return NextResponse.json(
      {
        success: false,
        message: 'Rate limit exceeded for bulk verification',
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many bulk verification requests from this IP'
        }
      },
      { status: 429 }
    );
  }

  if (!request.identities || request.identities.length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: 'No identities provided for bulk verification',
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Identities array is required and cannot be empty'
        }
      },
      { status: 400 }
    );
  }

  if (request.identities.length > 100) {
    return NextResponse.json(
      {
        success: false,
        message: 'Bulk verification limit exceeded',
        error: {
          code: 'BULK_LIMIT_EXCEEDED',
          message: 'Maximum 100 identities can be verified in a single request'
        }
      },
      { status: 400 }
    );
  }

  // Simulate bulk verification
  const results = request.identities.map(identity => ({
    identityId: identity.identityId,
    status: identity.status,
    processed: true,
    transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
    gasUsed: Math.floor(Math.random() * 30000) + 20000,
    timestamp: new Date().toISOString()
  }));

  return NextResponse.json({
    success: true,
    message: `Bulk verification completed for ${results.length} identities`,
    data: {
      totalProcessed: results.length,
      successful: results.filter(r => r.processed).length,
      failed: results.filter(r => !r.processed).length,
      results,
      blockchain: {
        batchTransactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        totalGasUsed: results.reduce((sum, r) => sum + r.gasUsed, 0),
        network: 'polygon'
      },
      verifier: {
        role: request.verifierInfo.role,
        badgeNumber: request.verifierInfo.badgeNumber,
        department: request.verifierInfo.department
      }
    },
    metadata: {
      requestId: `bulk_verify_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      processingTime: Math.floor(Math.random() * 5000) + 2000
    }
  });
}

// GET - Get verification status and check identity
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const identityId = searchParams.get('identityId');
    const walletAddress = searchParams.get('walletAddress');
    const touristIdHash = searchParams.get('touristIdHash');

    if (action === 'check') {
      if (!identityId && !walletAddress && !touristIdHash) {
        return NextResponse.json(
          {
            success: false,
            message: 'Identity identifier required',
            error: {
              code: 'MISSING_IDENTIFIER',
              message: 'Provide identityId, walletAddress, or touristIdHash'
            }
          },
          { status: 400 }
        );
      }

      // Simulate identity check
      const mockIdentityData = {
        identityId: identityId ? parseInt(identityId) : Math.floor(Math.random() * 10000) + 1,
        status: Math.random() > 0.3 ? 'verified' : 'pending',
        walletAddress: walletAddress || `0x${Math.random().toString(16).substring(2, 42)}`,
        touristIdHash: touristIdHash || `0x${Math.random().toString(16).substring(2, 66)}`,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        verifiedAt: Math.random() > 0.5 ? new Date().toISOString() : null,
        validUntil: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        tripStatus: Math.random() > 0.5 ? 'active' : 'inactive',
        emergencyContactsCount: Math.floor(Math.random() * 3) + 1,
        lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
      };

      return NextResponse.json({
        success: true,
        message: 'Identity found',
        data: {
          identity: mockIdentityData,
          verification: {
            documentStatus: mockIdentityData.status,
            biometricStatus: Math.random() > 0.7 ? 'verified' : 'not_provided',
            locationStatus: 'verified',
            riskAssessment: mockIdentityData.status === 'verified' ? 'low' : 'medium'
          },
          permissions: {
            canTravel: mockIdentityData.status === 'verified',
            requiresEscort: false,
            emergencyAccessLevel: 'standard',
            geofenceEnabled: true
          },
          blockchain: {
            network: 'polygon',
            contractAddress: mockBlockchainConfig.networks.polygon.contracts.touristIdentity,
            lastBlockUpdate: Math.floor(Math.random() * 1000000) + 15000000
          }
        }
      });
    }

    if (action === 'stats') {
      // Return verification statistics
      return NextResponse.json({
        success: true,
        message: 'Verification statistics',
        data: {
          totalIdentities: Math.floor(Math.random() * 10000) + 5000,
          verifiedIdentities: Math.floor(Math.random() * 8000) + 4000,
          pendingVerifications: Math.floor(Math.random() * 500) + 100,
          rejectedIdentities: Math.floor(Math.random() * 200) + 50,
          activeTrips: Math.floor(Math.random() * 1000) + 500,
          averageVerificationTime: '24 hours',
          verificationsByRole: {
            government: Math.floor(Math.random() * 3000) + 2000,
            police: Math.floor(Math.random() * 1000) + 500,
            tourism: Math.floor(Math.random() * 2000) + 1000,
            emergency: Math.floor(Math.random() * 100) + 50
          },
          last24Hours: {
            newIdentities: Math.floor(Math.random() * 100) + 50,
            verifications: Math.floor(Math.random() * 150) + 75,
            emergencyAccess: Math.floor(Math.random() * 10) + 5
          }
        }
      });
    }

    // Default: service information
    return NextResponse.json({
      success: true,
      message: 'Identity Verification Service',
      data: {
        version: '1.0.0',
        endpoints: {
          verify: 'POST /',
          bulkVerify: 'POST / (with action: bulk-verify)',
          check: 'GET /?action=check&identityId=X',
          stats: 'GET /?action=stats'
        },
        supportedVerifiers: ['government', 'police', 'tourism', 'emergency', 'system'],
        verificationTypes: ['document', 'biometric', 'location', 'emergency'],
        rateLimits: {
          verification: `${mockBlockchainConfig.rateLimits.verification} per hour`,
          bulkVerification: '5 per hour'
        }
      }
    });

  } catch (error) {
    console.error('Error in verification service:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Service error',
        error: {
          code: 'SERVICE_ERROR',
          message: 'Unable to process request'
        }
      },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
