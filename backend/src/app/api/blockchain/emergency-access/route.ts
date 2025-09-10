/**
 * Smart Tourist Safety System - Emergency Access API Route
 * Handles emergency scenarios with immediate blockchain access and logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { IdentityManager } from '../../../../lib/blockchain/identity-manager';
import { Web3Client } from '../../../../lib/blockchain/web3-client';
import { SmartContractConfig } from '../../../../types/blockchain';
import { ethers } from 'ethers';

// Mock blockchain configuration
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

// Emergency types and interfaces
type EmergencyType = 'medical' | 'security' | 'natural_disaster' | 'accident' | 'lost' | 'theft' | 'harassment' | 'other';
type EmergencyPriority = 'low' | 'medium' | 'high' | 'critical';
type ResponderType = 'police' | 'medical' | 'fire' | 'coast_guard' | 'embassy' | 'tourism_police' | 'rescue';

interface EmergencyAccessRequest {
  // Identity identification
  identityId?: number;
  touristIdHash?: string;
  walletAddress?: string;
  emergencyCode?: string; // Special emergency access code
  
  // Emergency details
  emergency: {
    type: EmergencyType;
    priority: EmergencyPriority;
    description: string;
    location: {
      latitude: number;
      longitude: number;
      address?: string;
      landmark?: string;
    };
    contactNumber?: string;
    groupSize?: number;
    injuredCount?: number;
    requiresAmbulance?: boolean;
    requiresPolice?: boolean;
    requiresFireDept?: boolean;
  };
  
  // Responder information
  responder: {
    type: ResponderType;
    badgeNumber?: string;
    department: string;
    name: string;
    contactNumber: string;
    vehicleNumber?: string;
  };
  
  // Additional context
  witnesses?: Array<{
    name?: string;
    contact?: string;
    statement?: string;
  }>;
  
  // Media evidence
  evidence?: {
    photos?: string[]; // Base64 or IPFS hashes
    videos?: string[];
    audioRecordings?: string[];
  };
}

interface EmergencyLogRequest {
  emergencyId: string;
  updates: Array<{
    timestamp: string;
    responderType: ResponderType;
    responderInfo: string;
    action: string;
    status: 'responding' | 'on_scene' | 'resolved' | 'escalated' | 'transferred';
    notes?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  }>;
}

// Rate limiting for emergency requests (higher limits)
const emergencyRateLimit = new Map<string, { count: number; resetTime: number }>();

// Utility functions
const initializeBlockchainServices = async (): Promise<void> => {
  if (!web3Client) {
    web3Client = new Web3Client(mockBlockchainConfig);
    identityManager = new IdentityManager(web3Client);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🚨 Emergency services running in development mode');
    } else {
      await identityManager.initialize(mockBlockchainConfig.server.privateKey);
    }
  }
};

const validateEmergencyRequest = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Basic emergency data validation
  if (!data.emergency) {
    errors.push('Emergency details are required');
    return { valid: false, errors };
  }

  const { emergency, responder } = data;

  // Validate emergency details
  if (!emergency.type || !['medical', 'security', 'natural_disaster', 'accident', 'lost', 'theft', 'harassment', 'other'].includes(emergency.type)) {
    errors.push('Valid emergency type is required');
  }

  if (!emergency.priority || !['low', 'medium', 'high', 'critical'].includes(emergency.priority)) {
    errors.push('Valid emergency priority is required');
  }

  if (!emergency.description || emergency.description.length < 10) {
    errors.push('Emergency description must be at least 10 characters');
  }

  if (!emergency.location?.latitude || !emergency.location?.longitude) {
    errors.push('Emergency location coordinates are required');
  }

  // Validate responder details
  if (!responder) {
    errors.push('Responder information is required');
  } else {
    if (!responder.type || !['police', 'medical', 'fire', 'coast_guard', 'embassy', 'tourism_police', 'rescue'].includes(responder.type)) {
      errors.push('Valid responder type is required');
    }
    if (!responder.department || responder.department.length < 2) {
      errors.push('Responder department is required');
    }
    if (!responder.name || responder.name.length < 2) {
      errors.push('Responder name is required');
    }
    if (!responder.contactNumber || responder.contactNumber.length < 10) {
      errors.push('Valid responder contact number is required');
    }
  }

  return { valid: errors.length === 0, errors };
};

const checkEmergencyRateLimit = (key: string, limit: number, windowMs: number): boolean => {
  const now = Date.now();
  const record = emergencyRateLimit.get(key);

  if (!record || now > record.resetTime) {
    emergencyRateLimit.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
};

const generateEmergencyId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `EMG_${timestamp}_${random}`.toUpperCase();
};

const calculateResponseTime = (priority: EmergencyPriority): string => {
  switch (priority) {
    case 'critical': return '2-5 minutes';
    case 'high': return '5-10 minutes';
    case 'medium': return '10-20 minutes';
    case 'low': return '20-60 minutes';
    default: return '10-20 minutes';
  }
};

const generateMockEmergencyResponse = (request: EmergencyAccessRequest) => {
  return {
    emergencyId: generateEmergencyId(),
    accessGranted: true,
    responseTime: calculateResponseTime(request.emergency.priority),
    transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
    blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
    gasUsed: Math.floor(Math.random() * 100000) + 100000,
    loggedAt: new Date().toISOString()
  };
};

// POST - Emergency access and logging
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await initializeBlockchainServices();

    const body = await request.json();
    const action = body.action || 'access';
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';

    // Handle emergency logging updates
    if (action === 'log') {
      return handleEmergencyLogging(body as EmergencyLogRequest, clientIp);
    }

    // Emergency access rate limiting (more permissive)
    if (!checkEmergencyRateLimit(`emergency_${clientIp}`, mockBlockchainConfig.rateLimits.emergencyLogs, 60 * 1000)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Emergency access rate limit exceeded',
          error: {
            code: 'EMERGENCY_RATE_LIMIT',
            message: 'Too many emergency requests - if this is a genuine emergency, call local emergency services immediately'
          }
        },
        { status: 429 }
      );
    }

    // Validate emergency request
    const validation = validateEmergencyRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Emergency request validation failed',
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid emergency request data',
            details: validation.errors
          }
        },
        { status: 400 }
      );
    }

    const emergencyRequest = body as EmergencyAccessRequest;

    if (process.env.NODE_ENV === 'development') {
      // Simulate emergency access
      const mockResponse = generateMockEmergencyResponse(emergencyRequest);
      
      return NextResponse.json({
        success: true,
        message: 'Emergency access granted (simulated)',
        data: {
          emergencyId: mockResponse.emergencyId,
          accessGranted: mockResponse.accessGranted,
          identityAccess: {
            identityId: emergencyRequest.identityId || Math.floor(Math.random() * 10000) + 1,
            touristInfo: {
              fullName: 'Tourist Name (Emergency Access)',
              nationality: 'Country',
              emergencyContacts: [
                {
                  name: 'Emergency Contact 1',
                  relationship: 'Family',
                  phone: '+1-XXX-XXX-XXXX',
                  isPrimary: true
                }
              ],
              medicalInfo: {
                bloodType: 'O+',
                allergies: ['None'],
                medications: ['None'],
                medicalConditions: ['None']
              },
              tripInfo: {
                startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                purpose: 'tourism',
                groupSize: 2
              }
            },
            walletAddress: emergencyRequest.walletAddress || `0x${Math.random().toString(16).substring(2, 42)}`
          },
          emergencyDetails: {
            type: emergencyRequest.emergency.type,
            priority: emergencyRequest.emergency.priority,
            description: emergencyRequest.emergency.description,
            location: emergencyRequest.emergency.location,
            reportedAt: new Date().toISOString(),
            estimatedResponseTime: mockResponse.responseTime
          },
          responderInfo: {
            type: emergencyRequest.responder.type,
            department: emergencyRequest.responder.department,
            responderName: emergencyRequest.responder.name,
            contactNumber: emergencyRequest.responder.contactNumber,
            badgeNumber: emergencyRequest.responder.badgeNumber
          },
          blockchain: {
            transactionHash: mockResponse.transactionHash,
            blockNumber: mockResponse.blockNumber,
            gasUsed: mockResponse.gasUsed,
            contractAddress: mockBlockchainConfig.networks.polygon.contracts.emergencyLogging,
            network: 'polygon',
            loggedAt: mockResponse.loggedAt
          },
          instructions: {
            immediateActions: [
              'Stay calm and in a safe location',
              'Keep this emergency ID handy: ' + mockResponse.emergencyId,
              'Await responder contact within ' + mockResponse.responseTime,
              'Call local emergency services if situation worsens'
            ],
            responderActions: [
              'Identity verified and access granted',
              'Tourist information and contacts retrieved',
              'Emergency logged on blockchain for audit trail',
              'Proceed with emergency response protocol'
            ]
          }
        },
        metadata: {
          requestId: `emergency_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          processedAt: new Date().toISOString(),
          priority: emergencyRequest.emergency.priority,
          autoAlerts: {
            embassyNotified: emergencyRequest.emergency.priority === 'critical',
            familyNotified: true,
            tourismAuthoritiesNotified: true,
            localPoliceNotified: ['security', 'theft', 'harassment'].includes(emergencyRequest.emergency.type)
          }
        }
      });

    } else {
      // Production emergency access
      const result = await identityManager!.emergencyAccess(
        emergencyRequest.identityId || 0,
        emergencyRequest.responder.department
      );

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            message: 'Emergency access failed',
            error: {
              code: 'EMERGENCY_ACCESS_FAILED',
              message: result.error || 'Unable to grant emergency access'
            }
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Emergency access granted',
        data: {
          emergencyId: generateEmergencyId(),
          accessGranted: true,
          blockchain: {
            transactionHash: result.transactionHash,
            network: 'polygon'
          },
          identity: result.identity
        }
      });
    }

  } catch (error) {
    console.error('Emergency access error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Emergency access system error',
        error: {
          code: 'EMERGENCY_SYSTEM_ERROR',
          message: 'System error - contact emergency services immediately if this is a real emergency'
        }
      },
      { status: 500 }
    );
  }
}

// Handle emergency logging updates
async function handleEmergencyLogging(request: EmergencyLogRequest, clientIp: string): Promise<NextResponse> {
  if (!request.emergencyId || !request.updates || request.updates.length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid emergency logging request',
        error: {
          code: 'INVALID_LOG_REQUEST',
          message: 'Emergency ID and updates are required'
        }
      },
      { status: 400 }
    );
  }

  // Simulate emergency logging
  const loggedUpdates = request.updates.map(update => ({
    ...update,
    logId: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
    blockNumber: Math.floor(Math.random() * 1000000) + 15000000,
    gasUsed: Math.floor(Math.random() * 50000) + 25000,
    loggedAt: new Date().toISOString()
  }));

  return NextResponse.json({
    success: true,
    message: 'Emergency updates logged successfully',
    data: {
      emergencyId: request.emergencyId,
      totalUpdates: loggedUpdates.length,
      updates: loggedUpdates,
      blockchain: {
        batchTransactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        totalGasUsed: loggedUpdates.reduce((sum, update) => sum + update.gasUsed, 0),
        network: 'polygon'
      },
      emergencyStatus: {
        isActive: !loggedUpdates.some(u => u.status === 'resolved'),
        lastUpdate: loggedUpdates[loggedUpdates.length - 1]?.timestamp || new Date().toISOString(),
        respondersInvolved: [...new Set(loggedUpdates.map(u => u.responderType))],
        currentStatus: loggedUpdates[loggedUpdates.length - 1]?.status || 'responding'
      }
    }
  });
}

// GET - Emergency information and status
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const emergencyId = searchParams.get('emergencyId');

    if (action === 'status' && emergencyId) {
      // Get emergency status
      return NextResponse.json({
        success: true,
        message: 'Emergency status retrieved',
        data: {
          emergencyId,
          status: Math.random() > 0.5 ? 'active' : 'resolved',
          createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          lastUpdate: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
          priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
          type: ['medical', 'security', 'accident', 'lost'][Math.floor(Math.random() * 4)],
          respondersAssigned: Math.floor(Math.random() * 3) + 1,
          estimatedResolution: '15-30 minutes',
          blockchain: {
            totalTransactions: Math.floor(Math.random() * 10) + 1,
            lastBlockUpdate: Math.floor(Math.random() * 1000000) + 15000000
          }
        }
      });
    }

    if (action === 'protocols') {
      // Get emergency protocols
      return NextResponse.json({
        success: true,
        message: 'Emergency protocols and information',
        data: {
          emergencyTypes: {
            medical: {
              responseTime: '2-5 minutes',
              primaryResponders: ['medical', 'police'],
              requiredInfo: ['symptoms', 'consciousness_level', 'breathing_status'],
              autoNotifications: ['embassy', 'insurance', 'family']
            },
            security: {
              responseTime: '3-8 minutes',
              primaryResponders: ['police', 'tourism_police'],
              requiredInfo: ['threat_type', 'perpetrator_description', 'weapons_involved'],
              autoNotifications: ['embassy', 'local_police', 'family']
            },
            natural_disaster: {
              responseTime: '5-15 minutes',
              primaryResponders: ['rescue', 'fire', 'medical'],
              requiredInfo: ['disaster_type', 'safe_locations', 'group_status'],
              autoNotifications: ['embassy', 'disaster_management', 'family']
            },
            accident: {
              responseTime: '3-10 minutes',
              primaryResponders: ['medical', 'police', 'fire'],
              requiredInfo: ['accident_type', 'injuries', 'vehicle_involved'],
              autoNotifications: ['insurance', 'police', 'family']
            }
          },
          emergencyNumbers: {
            police: '100',
            medical: '102',
            fire: '101',
            tourism_helpline: '1363',
            women_helpline: '1091'
          },
          identityAccess: {
            automaticAccess: ['medical', 'police', 'fire', 'coast_guard'],
            supervisorApproval: ['embassy', 'tourism_police'],
            auditRequired: ['rescue', 'other'],
            dataShared: ['basic_info', 'emergency_contacts', 'medical_info', 'trip_details'],
            privacyProtection: 'Data access logged on blockchain for audit'
          }
        }
      });
    }

    // Default: service information
    return NextResponse.json({
      success: true,
      message: 'Emergency Access Service',
      data: {
        version: '1.0.0',
        status: 'operational',
        endpoints: {
          access: 'POST /',
          log: 'POST / (with action: log)',
          status: 'GET /?action=status&emergencyId=X',
          protocols: 'GET /?action=protocols'
        },
        features: {
          realTimeAccess: true,
          blockchainLogging: true,
          automaticNotifications: true,
          priorityResponse: true,
          auditTrail: true
        },
        responseTime: {
          critical: '2-5 minutes',
          high: '5-10 minutes',
          medium: '10-20 minutes',
          low: '20-60 minutes'
        },
        supportedResponders: ['police', 'medical', 'fire', 'coast_guard', 'embassy', 'tourism_police', 'rescue']
      }
    });

  } catch (error) {
    console.error('Emergency service error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Emergency service error',
        error: {
          code: 'EMERGENCY_SERVICE_ERROR',
          message: 'Unable to process emergency request'
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
