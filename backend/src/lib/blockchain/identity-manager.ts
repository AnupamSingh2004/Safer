/**
 * Smart Tourist Safety System - Identity Manager Service
 * Digital ID generation, verification, and smart contract interactions
 */

import { Web3Client } from './web3-client';
import { DigitalIdentity } from '../../types/blockchain';
import { ethers } from 'ethers';

export class IdentityManager {
  private web3Client: Web3Client;
  private isInitialized: boolean = false;

  constructor(web3Client: Web3Client) {
    this.web3Client = web3Client;
  }

  /**
   * Initialize the identity manager
   */
  public async initialize(serverPrivateKey: string): Promise<void> {
    try {
      this.web3Client.initializeSigner(serverPrivateKey);
      this.isInitialized = true;
      console.log('✅ Identity Manager initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Identity Manager:', error);
      throw error;
    }
  }

  /**
   * Create a new digital identity on blockchain
   */
  public async createDigitalIdentity(identityData: {
    touristWallet: string;
    touristIdHash: string;
    kycData: {
      documentType: string;
      documentHash: string;
      fullNameHash: string;
      nationalityHash: string;
      expiryTimestamp: number;
    };
    tripData: {
      itineraryHash: string;
      startTimestamp: number;
      endTimestamp: number;
      purpose: string;
      groupSize: number;
      accommodationHash: string;
    };
  }): Promise<{
    success: boolean;
    identityId?: number;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      if (!this.isInitialized) {
        throw new Error('Identity Manager not initialized');
      }

      // Validate input data
      if (!this.web3Client.isValidAddress(identityData.touristWallet)) {
        throw new Error('Invalid tourist wallet address');
      }

      // Prepare KYC data for contract
      const kycData = {
        documentType: identityData.kycData.documentType,
        documentHash: identityData.kycData.documentHash,
        fullNameHash: identityData.kycData.fullNameHash,
        nationalityHash: identityData.kycData.nationalityHash,
        verificationTimestamp: 0, // Will be set during verification
        verifiedBy: ethers.ZeroAddress,
        isVerified: false,
        expiryTimestamp: identityData.kycData.expiryTimestamp
      };

      // Prepare trip data for contract
      const tripData = {
        itineraryHash: identityData.tripData.itineraryHash,
        startTimestamp: identityData.tripData.startTimestamp,
        endTimestamp: identityData.tripData.endTimestamp,
        purpose: identityData.tripData.purpose,
        groupSize: identityData.tripData.groupSize,
        accommodationHash: identityData.tripData.accommodationHash
      };

      // Create identity on TouristIdentity contract
      const response = await this.web3Client.sendTransaction(
        {
          type: 'identity_creation',
          data: { kycData, tripData },
          authorizedBy: 'system'
        },
        'TouristIdentity',
        'createIdentity',
        [
          identityData.touristWallet,
          identityData.touristIdHash,
          kycData,
          tripData
        ]
      );

      if (!response.success) {
        throw new Error(response.error?.message || 'Transaction failed');
      }

      // Parse the transaction receipt to get the identity ID
      const receipt = await this.web3Client.getTransactionReceipt(response.transactionHash);
      let identityId: number | undefined;

      if (receipt && receipt.logs) {
        try {
          const contract = this.web3Client.getContract('TouristIdentity');
          const parsedLogs = receipt.logs.map(log => {
            try {
              return contract.interface.parseLog(log);
            } catch {
              return null;
            }
          }).filter(Boolean);

          const identityCreatedEvent = parsedLogs.find(log => log && log.name === 'IdentityCreated');
          if (identityCreatedEvent && identityCreatedEvent.args) {
            identityId = Number(identityCreatedEvent.args[0]); // First argument is identityId
          }
        } catch (error) {
          console.warn('Could not parse identity ID from logs:', error);
        }
      }

      // Register identity in the central registry
      if (identityId) {
        try {
          await this.registerInCentralRegistry(
            identityData.touristWallet,
            identityId,
            identityData.touristIdHash
          );
        } catch (error) {
          console.warn('Failed to register in central registry:', error);
          // Don't fail the entire operation for registry issues
        }
      }

      return {
        success: true,
        identityId,
        transactionHash: response.transactionHash
      };

    } catch (error: any) {
      console.error('❌ Failed to create digital identity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Register identity in central registry
   */
  private async registerInCentralRegistry(
    touristWallet: string,
    identityId: number,
    touristIdHash: string
  ): Promise<void> {
    const touristIdentityAddress = this.web3Client.getContract('TouristIdentity').target;
    
    await this.web3Client.sendTransaction(
      {
        type: 'identity_creation',
        data: { registryRegistration: true },
        authorizedBy: 'system'
      },
      'IdentityRegistry',
      'registerIdentity',
      [
        touristIdentityAddress,
        identityId,
        touristWallet,
        touristIdHash,
        'System Registration'
      ]
    );
  }

  /**
   * Verify a digital identity
   */
  public async verifyIdentity(identityId: number, verifierAddress: string): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      if (!this.isInitialized) {
        throw new Error('Identity Manager not initialized');
      }

      // Verify on TouristIdentity contract
      const response = await this.web3Client.sendTransaction(
        {
          type: 'verification',
          identityId: identityId.toString(),
          data: { verifierAddress },
          authorizedBy: verifierAddress
        },
        'TouristIdentity',
        'verifyIdentity',
        [identityId]
      );

      if (!response.success) {
        throw new Error(response.error?.message || 'Verification failed');
      }

      // Also verify in central registry
      try {
        await this.web3Client.sendTransaction(
          {
            type: 'verification',
            identityId: identityId.toString(),
            data: { registryVerification: true },
            authorizedBy: verifierAddress
          },
          'IdentityRegistry',
          'verifyIdentity',
          [identityId]
        );
      } catch (error) {
        console.warn('Failed to verify in central registry:', error);
      }

      return {
        success: true,
        transactionHash: response.transactionHash
      };

    } catch (error: any) {
      console.error('❌ Failed to verify identity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get identity information from blockchain
   */
  public async getIdentity(identityId: number): Promise<{
    success: boolean;
    identity?: any;
    error?: string;
  }> {
    try {
      if (!this.isInitialized) {
        throw new Error('Identity Manager not initialized');
      }

      const identity = await this.web3Client.callMethod(
        'TouristIdentity',
        'getIdentity',
        [identityId]
      );

      return {
        success: true,
        identity: this.formatIdentityData(identity)
      };

    } catch (error: any) {
      console.error('❌ Failed to get identity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get identity by wallet address
   */
  public async getIdentityByWallet(walletAddress: string): Promise<{
    success: boolean;
    identity?: any;
    error?: string;
  }> {
    try {
      if (!this.isInitialized) {
        throw new Error('Identity Manager not initialized');
      }

      if (!this.web3Client.isValidAddress(walletAddress)) {
        throw new Error('Invalid wallet address');
      }

      const identity = await this.web3Client.callMethod(
        'TouristIdentity',
        'getIdentityByWallet',
        [walletAddress]
      );

      return {
        success: true,
        identity: this.formatIdentityData(identity)
      };

    } catch (error: any) {
      console.error('❌ Failed to get identity by wallet:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if identity is verified
   */
  public async isIdentityVerified(identityId: number): Promise<boolean> {
    try {
      const isVerified = await this.web3Client.callMethod(
        'TouristIdentity',
        'isIdentityVerified',
        [identityId]
      );

      return Boolean(isVerified);
    } catch (error) {
      console.error('❌ Failed to check verification status:', error);
      return false;
    }
  }

  /**
   * Start a trip
   */
  public async startTrip(identityId: number): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      const response = await this.web3Client.sendTransaction(
        {
          type: 'identity_update',
          identityId: identityId.toString(),
          data: { tripStart: true },
          authorizedBy: 'tourist'
        },
        'TouristIdentity',
        'startTrip',
        [identityId]
      );

      return {
        success: response.success,
        transactionHash: response.transactionHash,
        error: response.error?.message
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * End a trip
   */
  public async endTrip(identityId: number): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      const response = await this.web3Client.sendTransaction(
        {
          type: 'identity_update',
          identityId: identityId.toString(),
          data: { tripEnd: true },
          authorizedBy: 'tourist'
        },
        'TouristIdentity',
        'endTrip',
        [identityId]
      );

      return {
        success: response.success,
        transactionHash: response.transactionHash,
        error: response.error?.message
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Emergency access to identity
   */
  public async emergencyAccess(identityId: number, accessReason: string): Promise<{
    success: boolean;
    identity?: any;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      if (!accessReason || accessReason.trim().length === 0) {
        throw new Error('Access reason is required for emergency access');
      }

      const identity = await this.web3Client.callMethod(
        'TouristIdentity',
        'emergencyAccess',
        [identityId, accessReason]
      );

      // Note: emergencyAccess might return transaction hash if it writes to blockchain
      return {
        success: true,
        identity: this.formatIdentityData(identity)
      };

    } catch (error: any) {
      console.error('❌ Emergency access failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get registry statistics
   */
  public async getRegistryStats(): Promise<{
    success: boolean;
    stats?: any;
    error?: string;
  }> {
    try {
      const stats = await this.web3Client.callMethod(
        'IdentityRegistry',
        'getRegistryStats',
        []
      );

      return {
        success: true,
        stats: {
          totalRegistrations: Number(stats.totalRegistrations),
          activeIdentities: Number(stats.activeIdentities),
          verifiedIdentities: Number(stats.verifiedIdentities),
          pendingVerifications: Number(stats.pendingVerifications),
          revokedIdentities: Number(stats.revokedIdentities),
          totalVerifiers: Number(stats.totalVerifiers),
          activeVerifiers: Number(stats.activeVerifiers)
        }
      };

    } catch (error: any) {
      console.error('❌ Failed to get registry stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Add emergency contact to identity
   */
  public async addEmergencyContact(
    identityId: number,
    contact: {
      nameHash: string;
      relationship: string;
      phoneHash: string;
      emailHash: string;
      isPrimary: boolean;
    }
  ): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      const response = await this.web3Client.sendTransaction(
        {
          type: 'identity_update',
          identityId: identityId.toString(),
          data: { emergencyContact: contact },
          authorizedBy: 'tourist'
        },
        'TouristIdentity',
        'addEmergencyContact',
        [identityId, contact]
      );

      return {
        success: response.success,
        transactionHash: response.transactionHash,
        error: response.error?.message
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate wallet for new tourist
   */
  public generateTouristWallet(): {
    address: string;
    privateKey: string;
    mnemonic: string;
  } {
    return this.web3Client.generateWallet();
  }

  /**
   * Hash sensitive data for blockchain storage
   */
  public hashSensitiveData(data: string): string {
    return ethers.keccak256(ethers.toUtf8Bytes(data));
  }

  /**
   * Format identity data from blockchain
   */
  private formatIdentityData(rawIdentity: any): any {
    if (!rawIdentity) return null;

    return {
      identityId: Number(rawIdentity.identityId),
      touristWallet: rawIdentity.touristWallet,
      touristIdHash: rawIdentity.touristIdHash,
      kycData: {
        documentType: rawIdentity.kycData.documentType,
        documentHash: rawIdentity.kycData.documentHash,
        fullNameHash: rawIdentity.kycData.fullNameHash,
        nationalityHash: rawIdentity.kycData.nationalityHash,
        verificationTimestamp: Number(rawIdentity.kycData.verificationTimestamp),
        verifiedBy: rawIdentity.kycData.verifiedBy,
        isVerified: rawIdentity.kycData.isVerified,
        expiryTimestamp: Number(rawIdentity.kycData.expiryTimestamp)
      },
      tripData: {
        itineraryHash: rawIdentity.tripData.itineraryHash,
        startTimestamp: Number(rawIdentity.tripData.startTimestamp),
        endTimestamp: Number(rawIdentity.tripData.endTimestamp),
        purpose: rawIdentity.tripData.purpose,
        groupSize: Number(rawIdentity.tripData.groupSize),
        accommodationHash: rawIdentity.tripData.accommodationHash
      },
      emergencyContacts: rawIdentity.emergencyContacts || [],
      createdTimestamp: Number(rawIdentity.createdTimestamp),
      lastUpdatedTimestamp: Number(rawIdentity.lastUpdatedTimestamp),
      isActive: rawIdentity.isActive,
      isRevoked: rawIdentity.isRevoked
    };
  }

  /**
   * Get health status
   */
  public async getHealthStatus(): Promise<{
    isHealthy: boolean;
    contractsAccessible: boolean;
    networkConnected: boolean;
    error?: string;
  }> {
    try {
      const connectionStatus = this.web3Client.getConnectionStatus();
      
      if (!connectionStatus.isConnected) {
        return {
          isHealthy: false,
          contractsAccessible: false,
          networkConnected: false,
          error: 'Not connected to blockchain network'
        };
      }

      // Test contract accessibility
      try {
        await this.web3Client.callMethod('TouristIdentity', 'getTotalIdentities', []);
        
        return {
          isHealthy: true,
          contractsAccessible: true,
          networkConnected: true
        };
      } catch (error) {
        return {
          isHealthy: false,
          contractsAccessible: false,
          networkConnected: true,
          error: 'Contracts not accessible'
        };
      }

    } catch (error: any) {
      return {
        isHealthy: false,
        contractsAccessible: false,
        networkConnected: false,
        error: error.message
      };
    }
  }
}
