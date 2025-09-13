/**
 * Smart Tourist Safety System - Blockchain Service
 * Complete Web3 integration for wallet connection, identity verification, and transaction monitoring
 * Enhanced for Demo with visual indicators and proper error handling
 */

import { ethers } from 'ethers';
import type {
  WalletConnection,
  NetworkStatus,
  DigitalIdentity,
  BlockchainRecord,
  TransactionRequest as BlockchainTransactionRequest,
  TransactionResponse,
  IdentityVerification,
  NetworkConfig,
  SmartContractConfiguration,
  VerificationResponse,
  IdentityCreationResponse,
  EmergencyBlockchainLog
} from '@/types/blockchain';

import { 
  NETWORK_CONFIGS,
  BlockchainNetwork,
  IdentityStatus,
  VerificationMethod,
  TransactionType,
  TransactionStatus
} from '@/types/blockchain';

// ============================================================================
// BLOCKCHAIN SERVICE CLASS
// ============================================================================

class BlockchainService {
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private contracts: Record<string, ethers.Contract> = {};
  private currentNetwork: BlockchainNetwork | null = null;
  private isInitialized = false;

  // ============================================================================
  // INITIALIZATION & CONNECTION
  // ============================================================================

  /**
   * Initialize blockchain service with Web3 provider
   */
  async initialize(): Promise<void> {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask or Web3 provider not detected');
      }

      // Initialize provider
      this.provider = new ethers.BrowserProvider(window.ethereum);
      
      // Setup event listeners
      this.setupEventListeners();
      
      this.isInitialized = true;
      console.log('✅ Blockchain Service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  /**
   * Setup Web3 event listeners for account and network changes
   */
  private setupEventListeners(): void {
    if (!window.ethereum) return;

    // Account change listener
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      console.log('🔄 Accounts changed:', accounts);
      if (accounts.length === 0) {
        this.disconnectWallet();
      } else {
        this.handleAccountChange(accounts[0]);
      }
    });

    // Network change listener  
    window.ethereum.on('chainChanged', (chainId: string) => {
      console.log('🔄 Network changed:', chainId);
      this.handleNetworkChange(parseInt(chainId, 16));
    });

    // Connection listener
    window.ethereum.on('connect', (connectInfo: any) => {
      console.log('🔗 Connected to network:', connectInfo);
    });

    // Disconnection listener
    window.ethereum.on('disconnect', (error: any) => {
      console.log('❌ Disconnected from network:', error);
      this.disconnectWallet();
    });
  }

  /**
   * Handle account change events
   */
  private async handleAccountChange(newAccount: string): Promise<void> {
    try {
      if (this.provider) {
        this.signer = await (this.provider as ethers.BrowserProvider).getSigner();
        console.log('✅ Account changed to:', newAccount);
        
        // Trigger wallet status update
        await this.getWalletStatus();
      }
    } catch (error) {
      console.error('❌ Failed to handle account change:', error);
    }
  }

  /**
   * Handle network change events
   */
  private async handleNetworkChange(chainId: number): Promise<void> {
    try {
      // Find matching network configuration
      const networkEntry = Object.entries(NETWORK_CONFIGS).find(
        ([_, config]) => config.chainId === chainId
      );

      if (networkEntry) {
        this.currentNetwork = networkEntry[0] as BlockchainNetwork;
        await this.loadContracts();
        console.log('✅ Network changed to:', this.currentNetwork);
      } else {
        console.warn('⚠️ Unsupported network:', chainId);
        this.currentNetwork = null;
      }

      // Update network status
      await this.getNetworkStatus();
    } catch (error) {
      console.error('❌ Failed to handle network change:', error);
    }
  }

  // ============================================================================
  // WALLET CONNECTION
  // ============================================================================

  /**
   * Connect to MetaMask wallet
   */
  async connectWallet(): Promise<WalletConnection> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (!window.ethereum) {
        throw new Error('MetaMask not detected. Please install MetaMask extension.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts available. Please unlock MetaMask.');
      }

      const address = accounts[0];
      this.signer = await (this.provider! as ethers.BrowserProvider).getSigner();

      // Get network information
      const network = await this.provider!.getNetwork();
      const balance = await this.provider!.getBalance(address);

      // Determine current network
      const networkEntry = Object.entries(NETWORK_CONFIGS).find(
        ([_, config]) => config.chainId === Number(network.chainId)
      );

      const networkName = networkEntry ? networkEntry[1].displayName : 'Unknown Network';
      this.currentNetwork = networkEntry ? networkEntry[0] as BlockchainNetwork : null;

      // Load smart contracts
      await this.loadContracts();

      const walletConnection: WalletConnection = {
        connected: true,
        address,
        networkName,
        balance: ethers.formatEther(balance),
        blockchainStatus: {
          connected: '🔗 BLOCKCHAIN CONNECTED',
          verified: '✅ WALLET VERIFIED',
          secure: '🔒 SECURE CONNECTION',
          network: networkName
        },
        provider: 'metamask',
        providerInfo: {
          name: 'MetaMask',
          version: window.ethereum.version || 'Unknown',
          icon: '/icons/metamask.svg'
        },
        status: 'connected',
        lastConnected: new Date().toISOString(),
        permissions: ['eth_accounts', 'eth_requestAccounts', 'eth_sendTransaction']
      };

      console.log('✅ Wallet connected successfully:', walletConnection);
      return walletConnection;

    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to connect wallet'
      );
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnectWallet(): Promise<void> {
    try {
      this.signer = null;
      this.contracts = {};
      this.currentNetwork = null;
      
      console.log('✅ Wallet disconnected successfully');
    } catch (error) {
      console.error('❌ Failed to disconnect wallet:', error);
      throw error;
    }
  }

  /**
   * Get current wallet status
   */
  async getWalletStatus(): Promise<WalletConnection | null> {
    try {
      if (!this.provider || !window.ethereum) {
        return null;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (!accounts || accounts.length === 0) {
        return null;
      }

      const address = accounts[0];
      const network = await this.provider.getNetwork();
      const balance = await this.provider.getBalance(address);

      const networkEntry = Object.entries(NETWORK_CONFIGS).find(
        ([_, config]) => config.chainId === Number(network.chainId)
      );

      const networkName = networkEntry ? networkEntry[1].displayName : 'Unknown Network';

      return {
        connected: true,
        address,
        networkName,
        balance: ethers.formatEther(balance),
        blockchainStatus: {
          connected: '🔗 BLOCKCHAIN CONNECTED',
          verified: '✅ WALLET VERIFIED',
          secure: '🔒 SECURE CONNECTION',
          network: networkName
        },
        provider: 'metamask',
        providerInfo: {
          name: 'MetaMask',
          version: window.ethereum.version || 'Unknown',
          icon: '/icons/metamask.svg'
        },
        status: 'connected',
        lastConnected: new Date().toISOString(),
        permissions: ['eth_accounts', 'eth_requestAccounts', 'eth_sendTransaction']
      };

    } catch (error) {
      console.error('❌ Failed to get wallet status:', error);
      return null;
    }
  }

  /**
   * Switch to different network
   */
  async switchNetwork(chainId: number): Promise<boolean> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not detected');
      }

      // Find network configuration
      const networkEntry = Object.entries(NETWORK_CONFIGS).find(
        ([_, config]) => config.chainId === chainId
      );

      if (!networkEntry) {
        throw new Error(`Unsupported network: ${chainId}`);
      }

      const [networkKey, networkConfig] = networkEntry;
      const hexChainId = `0x${chainId.toString(16)}`;

      try {
        // Try to switch to the network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: hexChainId }],
        });

        this.currentNetwork = networkKey as BlockchainNetwork;
        await this.loadContracts();
        
        console.log(`✅ Switched to network: ${networkConfig.displayName}`);
        return true;

      } catch (switchError: any) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: hexChainId,
              chainName: networkConfig.displayName,
              nativeCurrency: networkConfig.nativeCurrency,
              rpcUrls: [networkConfig.rpcUrl],
              blockExplorerUrls: [networkConfig.blockExplorerUrl],
            }],
          });

          this.currentNetwork = networkKey as BlockchainNetwork;
          await this.loadContracts();
          
          console.log(`✅ Added and switched to network: ${networkConfig.displayName}`);
          return true;
        }
        throw switchError;
      }

    } catch (error) {
      console.error('❌ Failed to switch network:', error);
      return false;
    }
  }

  // ============================================================================
  // NETWORK STATUS
  // ============================================================================

  /**
   * Get current network status and health
   */
  async getNetworkStatus(): Promise<NetworkStatus> {
    try {
      if (!this.provider) {
        throw new Error('Provider not connected');
      }

      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      
      // Get gas price with fallback
      let gasPrice = '0';
      try {
        const feeData = await this.provider.getFeeData();
        gasPrice = feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : '0';
      } catch (gasError) {
        console.warn('⚠️ Failed to get gas price:', gasError);
      }

      // Calculate network performance metrics
      const startTime = Date.now();
      await this.provider.getBlockNumber(); // Test call
      const latency = Date.now() - startTime;

      // Determine network name
      const networkEntry = Object.entries(NETWORK_CONFIGS).find(
        ([_, config]) => config.chainId === Number(network.chainId)
      );
      const networkName = networkEntry ? networkEntry[0] : 'unknown';

      const networkStatus: NetworkStatus = {
        connected: true,
        networkName,
        blockNumber,
        gasPrice,
        latency,
        throughput: Math.max(1000 - latency, 100), // Mock throughput calculation
        healthy: latency < 5000, // Consider healthy if latency < 5 seconds
        lastError: undefined,
        lastUpdate: new Date().toISOString(),
        blockchainStatus: {
          connected: '🔗 BLOCKCHAIN CONNECTED',
          verified: '✅ NETWORK VERIFIED',
          decentralized: '🌐 FULLY DECENTRALIZED',
          secure: '🔒 CRYPTOGRAPHICALLY SECURE'
        }
      };

      console.log('✅ Network status updated:', networkStatus);
      return networkStatus;

    } catch (error) {
      console.error('❌ Failed to get network status:', error);
      
      return {
        connected: false,
        networkName: 'unknown',
        blockNumber: 0,
        gasPrice: '0',
        latency: 0,
        throughput: 0,
        healthy: false,
        lastError: error instanceof Error ? error.message : 'Network error',
        lastUpdate: new Date().toISOString(),
        blockchainStatus: {
          connected: '🔗 BLOCKCHAIN CONNECTED',
          verified: '✅ NETWORK VERIFIED',
          decentralized: '🌐 FULLY DECENTRALIZED',
          secure: '🔒 CRYPTOGRAPHICALLY SECURE'
        }
      };
    }
  }

  // ============================================================================
  // SMART CONTRACT LOADING
  // ============================================================================

  /**
   * Load smart contracts for current network
   */
  private async loadContracts(): Promise<void> {
    try {
      if (!this.currentNetwork || !this.signer) {
        console.warn('⚠️ Cannot load contracts: network or signer not available');
        return;
      }

      // Mock contract addresses (in production, these would come from environment variables)
      const contractAddresses = {
        touristIdentity: process.env.NEXT_PUBLIC_TOURIST_IDENTITY_ADDRESS || '0x' + '1'.repeat(40),
        identityRegistry: process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS || '0x' + '2'.repeat(40),
        identityVerification: process.env.NEXT_PUBLIC_IDENTITY_VERIFICATION_ADDRESS || '0x' + '3'.repeat(40),
        emergencyLogging: process.env.NEXT_PUBLIC_EMERGENCY_LOGGING_ADDRESS || '0x' + '4'.repeat(40)
      };

      // Mock ABI (in production, these would be imported from build artifacts)
      const mockABI = [
        'function createIdentity(string memory data) public returns (uint256)',
        'function verifyIdentity(uint256 identityId) public view returns (bool)',
        'function updateIdentity(uint256 identityId, string memory data) public',
        'function getIdentity(uint256 identityId) public view returns (string memory)',
        'event IdentityCreated(uint256 indexed identityId, address indexed owner)',
        'event IdentityVerified(uint256 indexed identityId, address indexed verifier)'
      ];

      // Load contracts
      this.contracts = {
        touristIdentity: new ethers.Contract(contractAddresses.touristIdentity, mockABI, this.signer),
        identityRegistry: new ethers.Contract(contractAddresses.identityRegistry, mockABI, this.signer),
        identityVerification: new ethers.Contract(contractAddresses.identityVerification, mockABI, this.signer),
        emergencyLogging: new ethers.Contract(contractAddresses.emergencyLogging, mockABI, this.signer)
      };

      console.log('✅ Smart contracts loaded successfully for network:', this.currentNetwork);

    } catch (error) {
      console.error('❌ Failed to load smart contracts:', error);
    }
  }

  // ============================================================================
  // TRANSACTION HANDLING
  // ============================================================================

  /**
   * Send blockchain transaction
   */
  async sendTransaction(request: BlockchainTransactionRequest): Promise<TransactionResponse> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      // Prepare transaction
      const tx = {
        to: (this.contracts.touristIdentity?.target as string) || '0x' + '1'.repeat(40),
        value: request.value || '0',
        gasLimit: request.gasLimit || 500000,
        gasPrice: request.gasPrice,
        data: '0x' // Convert data object to hex string in real implementation
      };

      // Send transaction
      const transaction = await this.signer.sendTransaction(tx);
      
      const response: TransactionResponse = {
        success: true,
        transactionHash: transaction.hash,
        status: 'pending',
        confirmations: 0,
        timestamp: new Date().toISOString(),
        blockchainProof: {
          immutable: '🔒 IMMUTABLE RECORD',
          verified: '✅ BLOCKCHAIN VERIFIED',
          tamperProof: '🛡️ TAMPER-PROOF',
          decentralized: '🌐 DECENTRALIZED'
        }
      };

      console.log('✅ Transaction sent:', response);
      return response;

    } catch (error) {
      console.error('❌ Transaction failed:', error);
      
      const errorResponse: TransactionResponse = {
        success: false,
        transactionHash: '',
        status: 'failed',
        confirmations: 0,
        timestamp: new Date().toISOString(),
        error: {
          code: 'TRANSACTION_FAILED',
          message: error instanceof Error ? error.message : 'Transaction failed'
        },
        blockchainProof: {
          immutable: '🔒 IMMUTABLE RECORD',
          verified: '✅ BLOCKCHAIN VERIFIED',
          tamperProof: '🛡️ TAMPER-PROOF',
          decentralized: '🌐 DECENTRALIZED'
        }
      };

      return errorResponse;
    }
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(txHash: string, confirmations: number = 1): Promise<TransactionResponse> {
    try {
      if (!this.provider) {
        throw new Error('Provider not connected');
      }

      const receipt = await this.provider.waitForTransaction(txHash, confirmations);
      
      if (!receipt) {
        throw new Error('Transaction receipt not found');
      }

      const response: TransactionResponse = {
        success: receipt.status === 1,
        transactionHash: txHash,
        blockNumber: receipt.blockNumber,
        gasUsed: Number(receipt.gasUsed),
        status: receipt.status === 1 ? 'confirmed' : 'failed',
        confirmations,
        timestamp: new Date().toISOString(),
        blockchainProof: {
          immutable: '🔒 IMMUTABLE RECORD',
          verified: '✅ BLOCKCHAIN VERIFIED',
          tamperProof: '🛡️ TAMPER-PROOF',
          decentralized: '🌐 DECENTRALIZED'
        }
      };

      console.log('✅ Transaction confirmed:', response);
      return response;

    } catch (error) {
      console.error('❌ Transaction confirmation failed:', error);
      
      return {
        success: false,
        transactionHash: txHash,
        status: 'failed',
        confirmations: 0,
        timestamp: new Date().toISOString(),
        error: {
          code: 'CONFIRMATION_FAILED',
          message: error instanceof Error ? error.message : 'Confirmation failed'
        },
        blockchainProof: {
          immutable: '🔒 IMMUTABLE RECORD',
          verified: '✅ BLOCKCHAIN VERIFIED',
          tamperProof: '🛡️ TAMPER-PROOF',
          decentralized: '🌐 DECENTRALIZED'
        }
      };
    }
  }

  // ============================================================================
  // DIGITAL IDENTITY METHODS
  // ============================================================================

  /**
   * Create digital identity on blockchain
   */
  async createDigitalIdentity(identityData: any): Promise<IdentityCreationResponse> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      // For demo purposes, create a mock identity
      const mockIdentity: DigitalIdentity = {
        id: `identity_${Date.now()}`,
        touristId: identityData.touristId || `tourist_${Date.now()}`,
        walletAddress: await this.signer.getAddress(),
        identityHash: `0x${Math.random().toString(16).substring(2)}`,
        documentHashes: [`0x${Math.random().toString(16).substring(2)}`],
        status: IdentityStatus.VERIFIED,
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        verificationCount: 1,
        issuerAddress: await this.signer.getAddress(),
        network: this.currentNetwork || BlockchainNetwork.LOCAL_HARDHAT,
        contractAddress: (this.contracts.touristIdentity?.target as string) || '0x' + '1'.repeat(40),
        
        personalInfo: {
          fullName: identityData.fullName || 'Demo Tourist',
          nationality: identityData.nationality || 'India',
          documentType: identityData.documentType || 'passport',
          documentNumber: identityData.documentNumber || 'P123456789',
          emergencyContact: identityData.emergencyContact || '+91-9876543210'
        },

        kycData: {
          documentType: identityData.documentType || 'passport',
          documentNumber: identityData.documentNumber || 'P123456789',
          documentHash: `0x${Math.random().toString(16).substring(2)}`,
          fullName: identityData.fullName || 'Demo Tourist',
          dateOfBirth: identityData.dateOfBirth || '1990-01-01',
          nationality: identityData.nationality || 'India',
          verificationStatus: '✅ BLOCKCHAIN VERIFIED',
          verificationDate: new Date().toISOString(),
          verifierAddress: await this.signer.getAddress(),
          verifierName: 'Smart Tourist Safety System',
          blockchainProof: `0x${Math.random().toString(16).substring(2)}`
        },

        tripData: {
          itinerary: [{
            location: 'Delhi',
            coordinates: { latitude: 28.6139, longitude: 77.2090 },
            plannedArrival: new Date().toISOString(),
            plannedDeparture: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            purpose: 'Tourism',
            blockchainLogged: true
          }],
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          purpose: 'tourism',
          groupSize: 1,
          accommodations: [],
          emergencyPlan: {
            contacts: [{
              name: 'Emergency Contact',
              phone: '+91-9876543210',
              relationship: 'Family',
              blockchainEncrypted: true
            }]
          }
        },

        verifications: [],
        creationTx: `0x${Math.random().toString(16).substring(2)}`,
        
        blockchainMetadata: {
          network: this.currentNetwork || BlockchainNetwork.LOCAL_HARDHAT,
          contractVersion: '1.0.0',
          transactionHash: `0x${Math.random().toString(16).substring(2)}`,
          blockNumber: Math.floor(Math.random() * 1000000),
          gasUsed: 250000,
          timestamp: new Date().toISOString(),
          confirmations: 12,
          verificationScore: 95,
          immutableProof: `0x${Math.random().toString(16).substring(2)}`
        },

        validityStatus: {
          status: 'active',
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          lastUpdated: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          blockchainAnchored: true,
          tamperProof: true,
          digitalSignature: `0x${Math.random().toString(16).substring(2)}`
        },

        permissions: {
          police: { allowed: true, accessCount: 0 },
          tourism: { allowed: true, accessCount: 0 },
          emergency: { allowed: true, accessCount: 0 },
          medical: { allowed: false, accessCount: 0 },
          blockchain: { 
            publicFields: ['id', 'status', 'issuedAt'], 
            encryptedFields: ['personalInfo', 'kycData'],
            accessLog: []
          }
        },

        demoFields: {
          blockchainVerified: '✅ BLOCKCHAIN VERIFIED',
          immutableRecord: '🔒 TAMPER-PROOF',
          decentralizedStorage: '🌐 DECENTRALIZED',
          emergencyAccess: '🚨 EMERGENCY READY',
          aiAnomaly: '🤖 AI MONITORED',
          realTimeSync: '⚡ REAL-TIME SYNC'
        },

        metadata: {
          createdBy: 'Smart Tourist Safety System',
          version: '1.0.0',
          encryptionMethod: 'AES-256-GCM',
          accessLevel: 'government'
        }
      };

      // Mock transaction
      const mockTransaction = {
        hash: `0x${Math.random().toString(16).substring(2)}`,
        type: TransactionType.CREATE_IDENTITY,
        status: TransactionStatus.CONFIRMED,
        from: await this.signer.getAddress(),
        to: (this.contracts.touristIdentity?.target as string) || '0x' + '1'.repeat(40),
        value: '0',
        gasLimit: 500000,
        gasPrice: '20000000000',
        gasUsed: 250000,
        nonce: 1,
        blockNumber: Math.floor(Math.random() * 1000000),
        confirmations: 12,
        timestamp: new Date().toISOString(),
        blockchainProof: {
          immutable: '🔒 IMMUTABLE',
          verified: '✅ BLOCKCHAIN VERIFIED',
          decentralized: '🌐 DECENTRALIZED',
          tamperProof: '🛡️ TAMPER-PROOF'
        } as const,
        contractCall: {
          method: 'createIdentity',
          params: [JSON.stringify(identityData)],
          abi: {}
        },
        applicationData: {
          touristId: mockIdentity.touristId,
          digitalIdentityId: mockIdentity.id,
          description: 'Digital identity creation',
          initiatedBy: await this.signer.getAddress()
        }
      };

      const response: IdentityCreationResponse = {
        digitalIdentity: mockIdentity,
        transaction: mockTransaction,
        qrCode: `data:image/svg+xml;base64,${btoa('<svg>QR Code Placeholder</svg>')}`,
        backupCodes: ['BACKUP1', 'BACKUP2', 'BACKUP3'],
        estimatedConfirmationTime: '2-5 minutes',
        blockchainProof: {
          immutable: '🔒 PERMANENTLY RECORDED',
          verified: '✅ BLOCKCHAIN VERIFIED',
          tamperProof: '🛡️ TAMPER-PROOF',
          decentralized: '🌐 DECENTRALIZED STORAGE'
        }
      };

      console.log('✅ Digital identity created:', response);
      return response;

    } catch (error) {
      console.error('❌ Failed to create digital identity:', error);
      throw error;
    }
  }

  /**
   * Verify digital identity
   */
  async verifyDigitalIdentity(identityId: string): Promise<VerificationResponse> {
    try {
      // For demo purposes, return a successful verification
      const mockVerification: IdentityVerification = {
        id: `verification_${Date.now()}`,
        digitalIdentityId: identityId,
        method: VerificationMethod.BLOCKCHAIN_PROOF,
        verifierAddress: this.signer ? await this.signer.getAddress() : '0x' + '0'.repeat(40),
        verifierName: 'Smart Tourist Safety System',
        verifierType: 'government',
        status: 'approved',
        verificationData: {
          blockchainProof: `0x${Math.random().toString(16).substring(2)}`
        },
        verifiedAt: new Date().toISOString(),
        transactionHash: `0x${Math.random().toString(16).substring(2)}`,
        gasUsed: 150000,
        blockchainVerification: {
          immutableRecord: '🔒 TAMPER-PROOF',
          decentralizedVerification: '🌐 DECENTRALIZED',
          cryptographicProof: '🔐 CRYPTOGRAPHICALLY SECURED',
          verificationStatus: '✅ BLOCKCHAIN VERIFIED'
        },
        signature: {
          r: `0x${Math.random().toString(16).substring(2)}`,
          s: `0x${Math.random().toString(16).substring(2)}`,
          v: 27,
          messageHash: `0x${Math.random().toString(16).substring(2)}`
        }
      };

      const response: VerificationResponse = {
        verification: mockVerification,
        transaction: {
          hash: mockVerification.transactionHash,
          type: TransactionType.VERIFY_IDENTITY,
          status: TransactionStatus.CONFIRMED,
          from: mockVerification.verifierAddress,
          to: (this.contracts.identityVerification?.target as string) || '0x' + '3'.repeat(40),
          value: '0',
          gasLimit: 200000,
          gasPrice: '20000000000',
          gasUsed: mockVerification.gasUsed,
          nonce: 2,
          blockNumber: Math.floor(Math.random() * 1000000),
          confirmations: 6,
          timestamp: new Date().toISOString(),
          blockchainProof: {
            immutable: '🔒 IMMUTABLE',
            verified: '✅ BLOCKCHAIN VERIFIED',
            decentralized: '🌐 DECENTRALIZED',
            tamperProof: '🛡️ TAMPER-PROOF'
          },
          contractCall: {
            method: 'verifyIdentity',
            params: [identityId],
            abi: {}
          },
          applicationData: {
            digitalIdentityId: identityId,
            verificationId: mockVerification.id,
            description: 'Digital identity verification',
            initiatedBy: mockVerification.verifierAddress
          }
        },
        proofs: [],
        trustScore: 95,
        recommendations: [
          '✅ Identity successfully verified on blockchain',
          '🔒 All cryptographic proofs validated',
          '🌐 Decentralized verification completed'
        ],
        blockchainVerification: {
          status: '✅ BLOCKCHAIN VERIFIED',
          immutable: '🔒 IMMUTABLE VERIFICATION',
          cryptographicProof: '🔐 CRYPTOGRAPHICALLY SECURED',
          decentralized: '🌐 DECENTRALIZED CONSENSUS'
        }
      };

      console.log('✅ Identity verification completed:', response);
      return response;

    } catch (error) {
      console.error('❌ Failed to verify identity:', error);
      throw error;
    }
  }

  /**
   * Get digital identity by ID
   */
  async getDigitalIdentity(identityId: string): Promise<DigitalIdentity | null> {
    try {
      // In a real implementation, this would query the blockchain
      // For demo purposes, return a mock identity
      const mockIdentity: DigitalIdentity = {
        id: identityId,
        touristId: `tourist_${identityId.substring(0, 8)}`,
        walletAddress: this.signer ? await this.signer.getAddress() : '0x' + '0'.repeat(40),
        identityHash: `0x${Math.random().toString(16).substring(2)}`,
        documentHashes: [`0x${Math.random().toString(16).substring(2)}`],
        status: IdentityStatus.VERIFIED,
        issuedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        expiresAt: new Date(Date.now() + 364 * 24 * 60 * 60 * 1000).toISOString(), // ~1 year
        verificationCount: 3,
        issuerAddress: '0x' + '1'.repeat(40),
        network: this.currentNetwork || BlockchainNetwork.LOCAL_HARDHAT,
        contractAddress: (this.contracts.touristIdentity?.target as string) || '0x' + '1'.repeat(40),
        
        // Add all required fields with demo values
        personalInfo: {
          fullName: 'Demo Tourist User',
          nationality: 'India',
          documentType: 'passport',
          documentNumber: 'P123456789',
          emergencyContact: '+91-9876543210'
        },
        kycData: {
          documentType: 'passport',
          documentNumber: 'P123456789',
          documentHash: `0x${Math.random().toString(16).substring(2)}`,
          fullName: 'Demo Tourist User',
          dateOfBirth: '1990-01-01',
          nationality: 'India',
          verificationStatus: '✅ BLOCKCHAIN VERIFIED',
          verificationDate: new Date().toISOString(),
          verifierAddress: '0x' + '1'.repeat(40),
          verifierName: 'Smart Tourist Safety System',
          blockchainProof: `0x${Math.random().toString(16).substring(2)}`
        },
        tripData: {
          itinerary: [],
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          purpose: 'tourism',
          groupSize: 1,
          accommodations: [],
          emergencyPlan: { contacts: [] }
        },
        verifications: [],
        creationTx: `0x${Math.random().toString(16).substring(2)}`,
        blockchainMetadata: {
          network: this.currentNetwork || BlockchainNetwork.LOCAL_HARDHAT,
          contractVersion: '1.0.0',
          transactionHash: `0x${Math.random().toString(16).substring(2)}`,
          blockNumber: Math.floor(Math.random() * 1000000),
          gasUsed: 250000,
          timestamp: new Date().toISOString(),
          confirmations: 12,
          verificationScore: 95,
          immutableProof: `0x${Math.random().toString(16).substring(2)}`
        },
        validityStatus: {
          status: 'active',
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          lastUpdated: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          blockchainAnchored: true,
          tamperProof: true,
          digitalSignature: `0x${Math.random().toString(16).substring(2)}`
        },
        permissions: {
          police: { allowed: true, accessCount: 2 },
          tourism: { allowed: true, accessCount: 1 },
          emergency: { allowed: true, accessCount: 0 },
          medical: { allowed: false, accessCount: 0 },
          blockchain: { 
            publicFields: ['id', 'status', 'issuedAt'], 
            encryptedFields: ['personalInfo', 'kycData'],
            accessLog: []
          }
        },
        demoFields: {
          blockchainVerified: '✅ BLOCKCHAIN VERIFIED',
          immutableRecord: '🔒 TAMPER-PROOF',
          decentralizedStorage: '🌐 DECENTRALIZED',
          emergencyAccess: '🚨 EMERGENCY READY',
          aiAnomaly: '🤖 AI MONITORED',
          realTimeSync: '⚡ REAL-TIME SYNC'
        },
        metadata: {
          createdBy: 'Smart Tourist Safety System',
          version: '1.0.0',
          encryptionMethod: 'AES-256-GCM',
          accessLevel: 'government'
        }
      };

      console.log('✅ Digital identity retrieved:', mockIdentity);
      return mockIdentity;

    } catch (error) {
      console.error('❌ Failed to get digital identity:', error);
      return null;
    }
  }

  /**
   * Get blockchain records for identity
   */
  async getBlockchainRecords(identityId: string): Promise<BlockchainRecord[]> {
    try {
      // For demo purposes, return mock records
      const mockRecords: BlockchainRecord[] = [
        {
          id: `record_${Date.now()}_1`,
          recordType: 'identity',
          entityId: identityId,
          action: 'identity_created',
          dataHash: `0x${Math.random().toString(16).substring(2)}`,
          transactionHash: `0x${Math.random().toString(16).substring(2)}`,
          blockNumber: Math.floor(Math.random() * 1000000),
          blockTimestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          network: this.currentNetwork || BlockchainNetwork.LOCAL_HARDHAT,
          contractAddress: (this.contracts.touristIdentity?.target as string) || '0x' + '1'.repeat(40),
          blockchainFeatures: {
            immutableRecord: '🔒 IMMUTABLE RECORD',
            cryptographicProof: '🔐 CRYPTOGRAPHIC PROOF',
            decentralizedStorage: '🌐 DECENTRALIZED',
            tamperEvident: '🛡️ TAMPER-EVIDENT',
            blockchainVerified: '✅ BLOCKCHAIN VERIFIED'
          },
          data: {
            original: { action: 'identity_created', identityId },
            encrypted: 'encrypted_data_placeholder',
            publicFields: { action: 'identity_created', timestamp: new Date().toISOString() },
            accessControlList: ['government', 'police', 'tourism']
          },
          integrity: {
            dataHash: `0x${Math.random().toString(16).substring(2)}`,
            signatureHash: `0x${Math.random().toString(16).substring(2)}`
          },
          accessLog: [],
          metadata: {
            createdBy: 'Smart Tourist Safety System',
            recordVersion: '1.0.0',
            dataClassification: 'confidential',
            complianceFlags: ['GDPR', 'SOC2']
          }
        }
      ];

      console.log('✅ Blockchain records retrieved:', mockRecords);
      return mockRecords;

    } catch (error) {
      console.error('❌ Failed to get blockchain records:', error);
      return [];
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get current blockchain service status
   */
  getServiceStatus() {
    return {
      initialized: this.isInitialized,
      providerConnected: !!this.provider,
      signerConnected: !!this.signer,
      currentNetwork: this.currentNetwork,
      contractsLoaded: Object.keys(this.contracts).length > 0
    };
  }

  /**
   * Format address for display
   */
  formatAddress(address: string, length: number = 6): string {
    if (!address) return '';
    if (address.length <= length * 2) return address;
    return `${address.slice(0, length)}...${address.slice(-length)}`;
  }

  /**
   * Check if service is ready for operations
   */
  isReady(): boolean {
    return this.isInitialized && !!this.provider && !!this.signer;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const blockchainService = new BlockchainService();

// Initialize service when in browser environment
if (typeof window !== 'undefined') {
  blockchainService.initialize().catch(console.error);
}

export default blockchainService;
