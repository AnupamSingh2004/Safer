/**
 * Smart Tourist Safety System - Generate Identity API Route
 * Creates new digital IDs with KYC validation and smart contract deployment
 */

import { NextRequest, NextResponse } from 'next/server';
import { IdentityManager } from '../../../../lib/blockchain/identity-manager';
import { Web3Client } from '../../../../lib/blockchain/web3-client';
import { SmartContractConfig } from '../../../../types/blockchain';
import { ethers } from 'ethers';

// Mock blockchain configuration for prototype
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
    touristIdentity: [], // Would contain actual ABI in production
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
    defaultGasPrice: '20000000000', // 20 gwei
    maxGasPrice: '100000000000', // 100 gwei
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
    identityCreation: 10, // per hour
    verification: 50, // per hour
    emergencyLogs: 100 // per minute
  }
};

// Initialize services
let web3Client: Web3Client | null = null;
let identityManager: IdentityManager | null = null;

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Validation schemas
interface GenerateIdentityRequest {
  touristData: {
    walletAddress?: string; // Optional, will generate if not provided
    personalInfo: {
      fullName: string;
      dateOfBirth: string;
      nationality: string;
      passportNumber?: string;
      aadhaarNumber?: string;
    };
    tripInfo: {
      purpose: 'tourism' | 'business' | 'transit' | 'medical' | 'education';
      startDate: string;
      endDate: string;
      groupSize: number;
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
      accommodations: Array<{
        name: string;
        address: string;
        checkIn: string;
        checkOut: string;
      }>;
    };
    emergencyContacts: Array<{
      name: string;
      relationship: string;
      phone: string;
      email: string;
      isPrimary: boolean;
    }>;
  };
  kycDocuments: {
    documentType: 'passport' | 'aadhaar' | 'driving_license' | 'voter_id';
    documentImages: string[]; // Base64 encoded images or IPFS hashes
    biometricData?: string; // Optional biometric data
  };
  registrationLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

// Utility functions
const initializeBlockchainServices = async (): Promise<void> => {
  if (!web3Client) {
    web3Client = new Web3Client(mockBlockchainConfig);
    identityManager = new IdentityManager(web3Client);
    
    // In prototype mode, we'll simulate blockchain operations
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Running in development mode - simulating blockchain operations');
    } else {
      await identityManager.initialize(mockBlockchainConfig.server.privateKey);
    }
  }
};

const validateRequest = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate tourist data
  if (!data.touristData) {
    errors.push('Tourist data is required');
    return { valid: false, errors };
  }

  const { personalInfo, tripInfo, emergencyContacts } = data.touristData;

  // Validate personal info
  if (!personalInfo?.fullName || personalInfo.fullName.length < 2) {
    errors.push('Valid full name is required');
  }
  if (!personalInfo?.dateOfBirth || !isValidDate(personalInfo.dateOfBirth)) {
    errors.push('Valid date of birth is required');
  }
  if (!personalInfo?.nationality || personalInfo.nationality.length < 2) {
    errors.push('Valid nationality is required');
  }

  // Validate trip info
  if (!tripInfo?.purpose || !['tourism', 'business', 'transit', 'medical', 'education'].includes(tripInfo.purpose)) {
    errors.push('Valid trip purpose is required');
  }
  if (!tripInfo?.startDate || !isValidDate(tripInfo.startDate)) {
    errors.push('Valid start date is required');
  }
  if (!tripInfo?.endDate || !isValidDate(tripInfo.endDate)) {
    errors.push('Valid end date is required');
  }
  if (new Date(tripInfo?.startDate) >= new Date(tripInfo?.endDate)) {
    errors.push('End date must be after start date');
  }
  if (!tripInfo?.groupSize || tripInfo.groupSize < 1 || tripInfo.groupSize > 50) {
    errors.push('Group size must be between 1 and 50');
  }

  // Validate emergency contacts
  if (!emergencyContacts || !Array.isArray(emergencyContacts) || emergencyContacts.length === 0) {
    errors.push('At least one emergency contact is required');
  } else {
    const primaryContacts = emergencyContacts.filter(contact => contact.isPrimary);
    if (primaryContacts.length !== 1) {
      errors.push('Exactly one primary emergency contact is required');
    }
  }

  // Validate KYC documents
  if (!data.kycDocuments?.documentType) {
    errors.push('Document type is required');
  }
  if (!data.kycDocuments?.documentImages || data.kycDocuments.documentImages.length === 0) {
    errors.push('At least one document image is required');
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

const hashSensitiveData = (data: string): string => {
  return ethers.keccak256(ethers.toUtf8Bytes(data));
};

const simulateIPFSUpload = (data: any): string => {
  // In production, this would upload to IPFS and return the hash
  return `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
};

const generateMockBlockchainResponse = (touristData: any) => {
  return {
    success: true,
    identityId: Math.floor(Math.random() * 10000) + 1,
    transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
    blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
    gasUsed: Math.floor(Math.random() * 100000) + 200000,
    contractAddress: mockBlockchainConfig.networks.polygon.contracts.touristIdentity,
    walletGenerated: !touristData.walletAddress
  };
};

// POST - Generate new digital identity
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await initializeBlockchainServices();

    const body = await request.json();
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';

    // Rate limiting check
    if (!checkRateLimit(`identity_creation_${clientIp}`, mockBlockchainConfig.rateLimits.identityCreation, 60 * 60 * 1000)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Rate limit exceeded for identity creation',
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many identity creation requests from this IP'
          }
        },
        { status: 429 }
      );
    }

    // Validate request
    const validation = validateRequest(body);
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

    const { touristData, kycDocuments, registrationLocation } = body as GenerateIdentityRequest;

    // Generate wallet if not provided
    let walletAddress = touristData.walletAddress;
    let generatedWallet = null;

    if (!walletAddress) {
      if (process.env.NODE_ENV === 'development') {
        // Simulate wallet generation
        generatedWallet = {
          address: `0x${Math.random().toString(16).substring(2, 42)}`,
          privateKey: `0x${Math.random().toString(16).substring(2, 66)}`,
          mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
        };
        walletAddress = generatedWallet.address;
      } else {
        generatedWallet = identityManager!.generateTouristWallet();
        walletAddress = generatedWallet.address;
      }
    }

    // Hash sensitive data for blockchain storage
    const hashedData = {
      fullNameHash: hashSensitiveData(touristData.personalInfo.fullName),
      nationalityHash: hashSensitiveData(touristData.personalInfo.nationality),
      documentHash: simulateIPFSUpload(kycDocuments),
      itineraryHash: simulateIPFSUpload(touristData.tripInfo.itinerary),
      accommodationHash: simulateIPFSUpload(touristData.tripInfo.accommodations)
    };

    // Create tourist ID hash
    const touristIdHash = hashSensitiveData(`${touristData.personalInfo.fullName}_${touristData.personalInfo.dateOfBirth}_${Date.now()}`);

    if (process.env.NODE_ENV === 'development') {
      // Simulate blockchain identity creation
      const mockResponse = generateMockBlockchainResponse(touristData);
      
      return NextResponse.json({
        success: true,
        message: 'Digital identity created successfully (simulated)',
        data: {
          identityId: mockResponse.identityId,
          touristIdHash,
          walletAddress,
          blockchain: {
            transactionHash: mockResponse.transactionHash,
            blockNumber: mockResponse.blockNumber,
            gasUsed: mockResponse.gasUsed,
            contractAddress: mockResponse.contractAddress,
            network: 'polygon',
            confirmations: 12
          },
          generatedWallet: generatedWallet ? {
            address: generatedWallet.address,
            // Don't send private key in response for security
            mnemonic: generatedWallet.mnemonic
          } : null,
          verification: {
            status: 'pending',
            requiredDocuments: ['identity_verification', 'address_proof'],
            estimatedTime: '24-48 hours'
          },
          digitalId: {
            qrCode: `data:image/png;base64,${Buffer.from(touristIdHash).toString('base64')}`,
            validFrom: touristData.tripInfo.startDate,
            validUntil: touristData.tripInfo.endDate,
            issuer: 'Smart Tourist Safety System',
            version: '1.0'
          }
        },
        metadata: {
          requestId: `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          timestamp: new Date().toISOString(),
          registrationLocation: registrationLocation.address,
          processingTime: Math.floor(Math.random() * 1000) + 500 // Mock processing time
        }
      });

    } else {
      // Production blockchain operations
      const identityCreationData = {
        touristWallet: walletAddress,
        touristIdHash,
        kycData: {
          documentType: kycDocuments.documentType,
          documentHash: hashedData.documentHash,
          fullNameHash: hashedData.fullNameHash,
          nationalityHash: hashedData.nationalityHash,
          expiryTimestamp: Math.floor(new Date(touristData.tripInfo.endDate).getTime() / 1000)
        },
        tripData: {
          itineraryHash: hashedData.itineraryHash,
          startTimestamp: Math.floor(new Date(touristData.tripInfo.startDate).getTime() / 1000),
          endTimestamp: Math.floor(new Date(touristData.tripInfo.endDate).getTime() / 1000),
          purpose: touristData.tripInfo.purpose,
          groupSize: touristData.tripInfo.groupSize,
          accommodationHash: hashedData.accommodationHash
        }
      };

      const result = await identityManager!.createDigitalIdentity(identityCreationData);

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to create digital identity',
            error: {
              code: 'BLOCKCHAIN_ERROR',
              message: result.error || 'Unknown blockchain error'
            }
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Digital identity created successfully',
        data: {
          identityId: result.identityId,
          touristIdHash,
          walletAddress,
          blockchain: {
            transactionHash: result.transactionHash,
            network: 'polygon',
            contractAddress: mockBlockchainConfig.networks.polygon.contracts.touristIdentity
          },
          generatedWallet: generatedWallet ? {
            address: generatedWallet.address,
            mnemonic: generatedWallet.mnemonic
          } : null,
          verification: {
            status: 'pending',
            requiredDocuments: ['identity_verification', 'address_proof']
          }
        }
      });
    }

  } catch (error) {
    console.error('Error generating digital identity:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error generating digital identity',
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred'
        }
      },
      { status: 500 }
    );
  }
}

// GET - Get identity generation status and requirements
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'requirements') {
      return NextResponse.json({
        success: true,
        message: 'Identity generation requirements',
        data: {
          requiredDocuments: [
            {
              type: 'passport',
              description: 'Valid passport with minimum 6 months validity',
              formats: ['jpg', 'png', 'pdf'],
              maxSize: '10MB'
            },
            {
              type: 'aadhaar',
              description: 'Aadhaar card (front and back)',
              formats: ['jpg', 'png', 'pdf'],
              maxSize: '5MB'
            }
          ],
          supportedPurposes: ['tourism', 'business', 'transit', 'medical', 'education'],
          processingTime: '24-48 hours',
          validityPeriod: 'Duration of trip (max 6 months)',
          fees: {
            generation: 'Free',
            verification: 'Free',
            expedited: '$10 USD equivalent'
          },
          networks: ['polygon'],
          features: {
            emergencyAccess: true,
            realTimeTracking: true,
            geofenceAlerts: true,
            familyNotifications: true
          }
        }
      });
    }

    if (action === 'status') {
      const network = searchParams.get('network') || 'polygon';
      
      return NextResponse.json({
        success: true,
        message: 'Blockchain network status',
        data: {
          network,
          status: 'operational',
          blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
          gasPrice: '20 gwei',
          averageConfirmationTime: '2 minutes',
          contractsDeployed: true,
          healthCheck: {
            rpcEndpoint: 'healthy',
            contractsAccessible: true,
            lastUpdate: new Date().toISOString()
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Digital Identity Generation Service',
      data: {
        version: '1.0.0',
        endpoints: {
          generate: 'POST /',
          verify: 'POST /verify-identity',
          requirements: 'GET /?action=requirements',
          status: 'GET /?action=status'
        },
        rateLimits: {
          identityCreation: `${mockBlockchainConfig.rateLimits.identityCreation} per hour`,
          verification: `${mockBlockchainConfig.rateLimits.verification} per hour`
        },
        supportedNetworks: Object.keys(mockBlockchainConfig.networks)
      }
    });

  } catch (error) {
    console.error('Error in identity generation service:', error);
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
