/**
 * Smart Tourist Safety System - Blockchain Service (Web Frontend)
 * Frontend blockchain integration for wallet connection and identity verification
 */

import { ethers } from 'ethers';
import type { 
  DigitalIdentity, 
  WalletConnection, 
  TransactionRequest, 
  TransactionResponse,
  NetworkStatus,
  SmartContractConfig,
  BlockchainRecord
} from '@/types/blockchain';

// ============================================================================
// BLOCKCHAIN SERVICE CLASS
// ============================================================================

export class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contracts: Map<string, ethers.Contract> = new Map();
  private networkConfig: SmartContractConfig['network'] | null = null;

  // ============================================================================
  // WALLET CONNECTION MANAGEMENT
  // ============================================================================

  /**
   * Connect to user's Web3 wallet
   */
  async connectWallet(): Promise<WalletConnection> {
    try {
      if (!window.ethereum) {
        throw new Error('Web3 wallet not found. Please install MetaMask.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your wallet.');
      }

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      // Get network information
      const network = await this.provider.getNetwork();
      const balance = await this.provider.getBalance(accounts[0]);

      // Get provider info
      const providerInfo = {
        name: window.ethereum.isMetaMask ? 'MetaMask' : 'Unknown',
        version: window.ethereum.version || '1.0.0',
        icon: '/icons/metamask.png'
      };

      const connection: WalletConnection = {
        connected: true,
        address: accounts[0],
        network: network.name,
        balance: ethers.formatEther(balance),
        provider: window.ethereum.isMetaMask ? 'metamask' : 'other',
        providerInfo,
        status: 'connected',
        lastConnected: new Date().toISOString(),
        permissions: ['eth_accounts', 'eth_sendTransaction']
      };

      // Set up network configuration
      this.networkConfig = {
        name: network.name,
        chainId: Number(network.chainId),
        rpcUrl: 'auto', // Browser provider handles this
        explorerUrl: this.getExplorerUrl(Number(network.chainId)),
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18
        }
      };

      // Listen for account changes
      this.setupEventListeners();

      return connection;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw new Error(`Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnectWallet(): Promise<void> {
    this.provider = null;
    this.signer = null;
    this.contracts.clear();
    this.networkConfig = null;
    
    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeAllListeners();
    }
  }

  /**
   * Get current wallet connection status
   */
  async getWalletStatus(): Promise<WalletConnection | null> {
    try {
      if (!this.provider || !window.ethereum) {
        return null;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });

      if (!accounts || accounts.length === 0) {
        return null;
      }

      const network = await this.provider.getNetwork();
      const balance = await this.provider.getBalance(accounts[0]);

      return {
        connected: true,
        address: accounts[0],
        network: network.name,
        balance: ethers.formatEther(balance),
        provider: window.ethereum.isMetaMask ? 'metamask' : 'other',
        providerInfo: {
          name: window.ethereum.isMetaMask ? 'MetaMask' : 'Unknown',
          version: window.ethereum.version || '1.0.0',
          icon: '/icons/metamask.png'
        },
        status: 'connected',
        lastConnected: new Date().toISOString(),
        permissions: ['eth_accounts', 'eth_sendTransaction']
      };
    } catch (error) {
      console.error('Failed to get wallet status:', error);
      return null;
    }
  }

  // ============================================================================
  // NETWORK MANAGEMENT
  // ============================================================================

  /**
   * Switch to specific network
   */
  async switchNetwork(chainId: number): Promise<boolean> {
    try {
      if (!window.ethereum) {
        throw new Error('Web3 wallet not found');
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });

      return true;
    } catch (error: any) {
      // If network doesn't exist, try to add it
      if (error.code === 4902) {
        return this.addNetwork(chainId);
      }
      console.error('Failed to switch network:', error);
      return false;
    }
  }

  /**
   * Add new network to wallet
   */
  private async addNetwork(chainId: number): Promise<boolean> {
    try {
      if (!window.ethereum) {
        return false;
      }

      const networkConfig = this.getNetworkConfig(chainId);
      
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkConfig]
      });

      return true;
    } catch (error) {
      console.error('Failed to add network:', error);
      return false;
    }
  }

  /**
   * Get network status
   */
  async getNetworkStatus(): Promise<NetworkStatus> {
    try {
      if (!this.provider) {
        throw new Error('Provider not connected');
      }

      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      const feeData = await this.provider.getFeeData();

      return {
        connected: true,
        network: network.name,
        blockNumber,
        gasPrice: ethers.formatUnits(feeData.gasPrice || 0, 'gwei'),
        latency: 0, // Could implement ping test
        throughput: 0, // Could implement throughput test
        healthy: true,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get network status:', error);
      return {
        connected: false,
        network: 'unknown',
        blockNumber: 0,
        gasPrice: '0',
        latency: 0,
        throughput: 0,
        healthy: false,
        lastError: error instanceof Error ? error.message : 'Unknown error',
        lastUpdate: new Date().toISOString()
      };
    }
  }

  // ============================================================================
  // DIGITAL IDENTITY OPERATIONS
  // ============================================================================

  /**
   * Verify digital identity on blockchain
   */
  async verifyDigitalIdentity(identityId: string): Promise<{
    verified: boolean;
    identity?: DigitalIdentity;
    error?: string;
  }> {
    try {
      // This would interact with smart contracts
      // For prototype, we'll simulate the verification
      
      const response = await fetch(`/api/blockchain/verify-identity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identityId }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify identity');
      }

      const result = await response.json();
      return {
        verified: result.verified,
        identity: result.identity,
      };
    } catch (error) {
      console.error('Identity verification failed:', error);
      return {
        verified: false,
        error: error instanceof Error ? error.message : 'Verification failed'
      };
    }
  }

  /**
   * Get digital identity details
   */
  async getDigitalIdentity(identityId: string): Promise<DigitalIdentity | null> {
    try {
      const response = await fetch(`/api/blockchain/identity-records/${identityId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch identity');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get digital identity:', error);
      return null;
    }
  }

  /**
   * Get blockchain records for identity
   */
  async getBlockchainRecords(identityId: string): Promise<BlockchainRecord[]> {
    try {
      const response = await fetch(`/api/blockchain/identity-records/${identityId}/history`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get blockchain records:', error);
      return [];
    }
  }

  // ============================================================================
  // TRANSACTION MANAGEMENT
  // ============================================================================

  /**
   * Send blockchain transaction
   */
  async sendTransaction(request: TransactionRequest): Promise<TransactionResponse> {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      // Estimate gas
      const gasEstimate = await this.estimateGas(request);
      
      // Prepare transaction
      const tx = {
        to: request.data.contractAddress,
        data: request.data.encodedData,
        gasLimit: request.gasLimit || gasEstimate,
        gasPrice: request.gasPrice,
        value: request.value || '0'
      };

      // Send transaction
      const txResponse = await this.signer.sendTransaction(tx);
      
      return {
        success: true,
        transactionHash: txResponse.hash,
        status: 'pending',
        confirmations: 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Transaction failed:', error);
      return {
        success: false,
        transactionHash: '',
        status: 'failed',
        confirmations: 0,
        timestamp: new Date().toISOString(),
        error: {
          code: 'TRANSACTION_FAILED',
          message: error instanceof Error ? error.message : 'Transaction failed',
          details: error
        }
      };
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

      return {
        success: receipt.status === 1,
        transactionHash: txHash,
        blockNumber: receipt.blockNumber,
        gasUsed: Number(receipt.gasUsed),
        status: receipt.status === 1 ? 'confirmed' : 'failed',
        confirmations,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Transaction confirmation failed:', error);
      return {
        success: false,
        transactionHash: txHash,
        status: 'failed',
        confirmations: 0,
        timestamp: new Date().toISOString(),
        error: {
          code: 'CONFIRMATION_FAILED',
          message: error instanceof Error ? error.message : 'Confirmation failed'
        }
      };
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Estimate gas for transaction
   */
  private async estimateGas(request: TransactionRequest): Promise<number> {
    try {
      if (!this.provider) {
        throw new Error('Provider not connected');
      }

      // Default gas limits for different operations
      const gasLimits = {
        identity_creation: 500000,
        identity_update: 200000,
        verification: 150000,
        emergency: 100000
      };

      return gasLimits[request.type] || 21000;
    } catch (error) {
      console.error('Gas estimation failed:', error);
      return 21000; // Default gas limit
    }
  }

  /**
   * Get explorer URL for network
   */
  private getExplorerUrl(chainId: number): string {
    const explorers: Record<number, string> = {
      1: 'https://etherscan.io',
      137: 'https://polygonscan.com',
      80001: 'https://mumbai.polygonscan.com',
      56: 'https://bscscan.com',
      97: 'https://testnet.bscscan.com'
    };

    return explorers[chainId] || 'https://etherscan.io';
  }

  /**
   * Get network configuration
   */
  private getNetworkConfig(chainId: number) {
    const networks: Record<number, any> = {
      137: { // Polygon Mainnet
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        rpcUrls: ['https://polygon-rpc.com'],
        blockExplorerUrls: ['https://polygonscan.com']
      },
      80001: { // Polygon Mumbai Testnet
        chainId: '0x13881',
        chainName: 'Polygon Mumbai',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com']
      }
    };

    return networks[chainId];
  }

  /**
   * Setup event listeners for wallet events
   */
  private setupEventListeners(): void {
    if (!window.ethereum) return;

    // Account changed
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnectWallet();
      } else {
        // Handle account change
        console.log('Account changed:', accounts[0]);
      }
    });

    // Network changed
    window.ethereum.on('chainChanged', (chainId: string) => {
      console.log('Network changed:', chainId);
      // Reload the page to reset state
      window.location.reload();
    });

    // Connection
    window.ethereum.on('connect', (connectInfo: any) => {
      console.log('Wallet connected:', connectInfo);
    });

    // Disconnection
    window.ethereum.on('disconnect', (error: any) => {
      console.log('Wallet disconnected:', error);
      this.disconnectWallet();
    });
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const blockchainService = new BlockchainService();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format blockchain address for display
 */
export function formatAddress(address: string, length: number = 6): string {
  if (!address) return '';
  if (address.length <= length * 2) return address;
  
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Format transaction hash for display
 */
export function formatTxHash(hash: string, length: number = 6): string {
  return formatAddress(hash, length);
}

/**
 * Convert Wei to Ether
 */
export function weiToEther(wei: string | number): string {
  try {
    return ethers.formatEther(wei);
  } catch {
    return '0';
  }
}

/**
 * Convert Ether to Wei
 */
export function etherToWei(ether: string | number): string {
  try {
    return ethers.parseEther(ether.toString()).toString();
  } catch {
    return '0';
  }
}

/**
 * Get transaction explorer URL
 */
export function getTxExplorerUrl(txHash: string, chainId: number): string {
  const baseUrls: Record<number, string> = {
    1: 'https://etherscan.io/tx',
    137: 'https://polygonscan.com/tx',
    80001: 'https://mumbai.polygonscan.com/tx',
    56: 'https://bscscan.com/tx',
    97: 'https://testnet.bscscan.com/tx'
  };

  const baseUrl = baseUrls[chainId] || 'https://etherscan.io/tx';
  return `${baseUrl}/${txHash}`;
}

/**
 * Get address explorer URL
 */
export function getAddressExplorerUrl(address: string, chainId: number): string {
  const baseUrls: Record<number, string> = {
    1: 'https://etherscan.io/address',
    137: 'https://polygonscan.com/address',
    80001: 'https://mumbai.polygonscan.com/address',
    56: 'https://bscscan.com/address',
    97: 'https://testnet.bscscan.com/address'
  };

  const baseUrl = baseUrls[chainId] || 'https://etherscan.io/address';
  return `${baseUrl}/${address}`;
}

// ============================================================================
// TYPE EXTENSIONS FOR WINDOW
// ============================================================================

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      version?: string;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeAllListeners: () => void;
    };
  }
}

export default blockchainService;
