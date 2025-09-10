/**
 * Smart Tourist Safety System - Web3 Client Service
 * Ethereum/Polygon connection and transaction handling
 */

import { ethers } from 'ethers';
import { SmartContractConfig } from '../../types/blockchain';

// Local interfaces for this service
interface TransactionRequest {
  type: 'identity_creation' | 'identity_update' | 'verification' | 'emergency';
  identityId?: string;
  data: Record<string, any>;
  gasLimit?: number;
  gasPrice?: string;
  value?: string;
  authorizedBy: string;
  signature?: string;
  reason?: string;
}

interface TransactionResponse {
  success: boolean;
  transactionHash: string;
  blockNumber?: number;
  gasUsed?: number;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  timestamp: string;
}

export class Web3Client {
  private provider: ethers.JsonRpcProvider | null = null;
  private signer: ethers.Wallet | null = null;
  private config: SmartContractConfig;
  private isConnected: boolean = false;
  private currentNetwork: string = '';
  private retryCount: number = 3;
  private retryDelay: number = 1000; // 1 second

  constructor(config: SmartContractConfig) {
    this.config = config;
    this.initializeProvider();
  }

  /**
   * Initialize Web3 provider with fallback support
   */
  private async initializeProvider(): Promise<void> {
    const networkConfig = this.config.networks[this.config.defaultNetwork];
    
    try {
      // Try primary RPC
      this.provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
      await this.testConnection();
      
      this.currentNetwork = this.config.defaultNetwork;
      this.isConnected = true;
      
      console.log(`✅ Connected to ${this.currentNetwork} network`);
    } catch (error) {
      console.error('Primary RPC failed, trying backup URLs...');
      await this.tryBackupProviders(networkConfig);
    }
  }

  /**
   * Try backup RPC providers
   */
  private async tryBackupProviders(networkConfig: any): Promise<void> {
    for (const backupUrl of networkConfig.rpcBackupUrls || []) {
      try {
        this.provider = new ethers.JsonRpcProvider(backupUrl);
        await this.testConnection();
        
        this.currentNetwork = this.config.defaultNetwork;
        this.isConnected = true;
        
        console.log(`✅ Connected to ${this.currentNetwork} via backup RPC`);
        return;
      } catch (error) {
        console.error(`Backup RPC ${backupUrl} failed:`, error);
      }
    }
    
    throw new Error('All RPC providers failed');
  }

  /**
   * Test provider connection
   */
  private async testConnection(): Promise<void> {
    if (!this.provider) throw new Error('No provider available');
    
    const network = await this.provider.getNetwork();
    const blockNumber = await this.provider.getBlockNumber();
    
    if (!network || !blockNumber) {
      throw new Error('Invalid network response');
    }
  }

  /**
   * Initialize server signer from private key
   */
  public initializeSigner(privateKey: string): void {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    
    try {
      this.signer = new ethers.Wallet(privateKey, this.provider);
      console.log(`✅ Signer initialized: ${this.signer.address}`);
    } catch (error) {
      throw new Error('Invalid private key');
    }
  }

  /**
   * Get contract instance
   */
  public getContract(contractName: string, address?: string): ethers.Contract {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const networkConfig = this.config.networks[this.currentNetwork];
    const contractAddress = address || (networkConfig.contracts as any)[contractName];
    const abi = this.config.contractABIs[contractName];

    if (!contractAddress || !abi) {
      throw new Error(`Contract ${contractName} not found in configuration`);
    }

    const signerOrProvider = this.signer || this.provider;
    return new ethers.Contract(contractAddress, abi, signerOrProvider);
  }

  /**
   * Send transaction with retry logic
   */
  public async sendTransaction(
    request: TransactionRequest,
    contractName: string,
    methodName: string,
    args: any[] = []
  ): Promise<TransactionResponse> {
    if (!this.signer) {
      throw new Error('Signer not initialized');
    }

    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.retryCount; attempt++) {
      try {
        const contract = this.getContract(contractName);
        
        // Estimate gas
        const gasEstimate = await contract[methodName].estimateGas(...args);
        const gasLimit = Math.floor(Number(gasEstimate) * this.config.gas.gasMultiplier);
        
        // Get current gas price
        const gasPrice = request.gasPrice || await this.getCurrentGasPrice();
        
        // Send transaction
        const tx = await contract[methodName](...args, {
          gasLimit,
          gasPrice,
          value: request.value || '0'
        });

        console.log(`📤 Transaction sent (attempt ${attempt}): ${tx.hash}`);
        
        // Wait for confirmation
        const receipt = await tx.wait();
        
        return {
          success: true,
          transactionHash: tx.hash,
          blockNumber: receipt.blockNumber,
          gasUsed: Number(receipt.gasUsed),
          status: 'confirmed',
          confirmations: receipt.confirmations,
          timestamp: new Date().toISOString()
        };

      } catch (error: any) {
        lastError = error;
        console.error(`❌ Transaction failed (attempt ${attempt}):`, error.message);
        
        if (attempt < this.retryCount) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    return {
      success: false,
      transactionHash: '',
      error: {
        code: 'TRANSACTION_FAILED',
        message: lastError?.message || 'Transaction failed after retries',
        details: lastError
      },
      status: 'failed',
      confirmations: 0,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Call contract method (view function)
   */
  public async callMethod(
    contractName: string,
    methodName: string,
    args: any[] = []
  ): Promise<any> {
    try {
      const contract = this.getContract(contractName);
      const result = await contract[methodName](...args);
      
      return result;
    } catch (error: any) {
      console.error(`❌ Contract call failed:`, error.message);
      throw error;
    }
  }

  /**
   * Get current gas price with optimization
   */
  public async getCurrentGasPrice(): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      const feeData = await this.provider.getFeeData();
      const gasPrice = feeData.gasPrice;
      
      if (!gasPrice) {
        return this.config.gas.defaultGasPrice;
      }
      
      // Add 10% buffer for faster confirmation
      const bufferedGasPrice = gasPrice * BigInt(110) / BigInt(100);
      
      // Ensure it doesn't exceed max gas price
      const maxGasPrice = BigInt(this.config.gas.maxGasPrice);
      
      return (bufferedGasPrice > maxGasPrice ? maxGasPrice : bufferedGasPrice).toString();
    } catch (error) {
      console.error('Failed to get gas price, using default:', error);
      return this.config.gas.defaultGasPrice;
    }
  }

  /**
   * Get network information
   */
  public async getNetworkInfo(): Promise<{
    name: string;
    chainId: number;
    blockNumber: number;
    gasPrice: string;
  }> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const network = await this.provider.getNetwork();
    const blockNumber = await this.provider.getBlockNumber();
    const gasPrice = await this.getCurrentGasPrice();

    return {
      name: this.currentNetwork,
      chainId: Number(network.chainId),
      blockNumber,
      gasPrice
    };
  }

  /**
   * Get transaction receipt
   */
  public async getTransactionReceipt(txHash: string): Promise<ethers.TransactionReceipt | null> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    return await this.provider.getTransactionReceipt(txHash);
  }

  /**
   * Get wallet balance
   */
  public async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  /**
   * Check if address is valid
   */
  public isValidAddress(address: string): boolean {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  }

  /**
   * Generate random wallet
   */
  public generateWallet(): { address: string; privateKey: string; mnemonic: string } {
    const wallet = ethers.Wallet.createRandom();
    
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase || ''
    };
  }

  /**
   * Switch network
   */
  public async switchNetwork(networkName: string): Promise<void> {
    if (!this.config.networks[networkName]) {
      throw new Error(`Network ${networkName} not configured`);
    }

    const networkConfig = this.config.networks[networkName];
    
    try {
      this.provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
      await this.testConnection();
      
      this.currentNetwork = networkName;
      this.isConnected = true;
      
      // Re-initialize signer if exists
      if (this.signer) {
        const privateKey = this.signer.privateKey;
        this.signer = new ethers.Wallet(privateKey, this.provider);
      }
      
      console.log(`✅ Switched to ${networkName} network`);
    } catch (error) {
      throw new Error(`Failed to switch to ${networkName}: ${error}`);
    }
  }

  /**
   * Listen to contract events
   */
  public listenToEvents(
    contractName: string,
    eventName: string,
    callback: (event: any) => void,
    fromBlock: number = 'latest' as any
  ): void {
    try {
      const contract = this.getContract(contractName);
      
      contract.on(eventName, (...args) => {
        const event = args[args.length - 1]; // Last argument is the event object
        callback({
          ...event,
          args: args.slice(0, -1),
          contractName,
          eventName
        });
      });
      
      console.log(`👂 Listening to ${contractName}.${eventName} events`);
    } catch (error) {
      console.error(`Failed to listen to events:`, error);
      throw error;
    }
  }

  /**
   * Stop listening to events
   */
  public stopListening(contractName: string, eventName?: string): void {
    try {
      const contract = this.getContract(contractName);
      
      if (eventName) {
        contract.off(eventName);
      } else {
        contract.removeAllListeners();
      }
      
      console.log(`🔇 Stopped listening to ${contractName} events`);
    } catch (error) {
      console.error(`Failed to stop listening:`, error);
    }
  }

  /**
   * Get past events
   */
  public async getPastEvents(
    contractName: string,
    eventName: string,
    fromBlock: number = 0,
    toBlock: number | string = 'latest'
  ): Promise<any[]> {
    try {
      const contract = this.getContract(contractName);
      const filter = contract.filters[eventName]();
      
      const events = await contract.queryFilter(filter, fromBlock, toBlock);
      
      return events.map(event => ({
        contractName,
        eventName,
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
        logIndex: event.index,
        // Only include args if it's an EventLog (not a regular Log)
        ...(('args' in event) ? { args: event.args } : {})
      }));
    } catch (error) {
      console.error(`Failed to get past events:`, error);
      throw error;
    }
  }

  /**
   * Health check
   */
  public async healthCheck(): Promise<{
    isConnected: boolean;
    network: string;
    blockNumber: number;
    latency: number;
  }> {
    const startTime = Date.now();
    
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }
      
      const blockNumber = await this.provider.getBlockNumber();
      const latency = Date.now() - startTime;
      
      return {
        isConnected: true,
        network: this.currentNetwork,
        blockNumber,
        latency
      };
    } catch (error) {
      return {
        isConnected: false,
        network: this.currentNetwork,
        blockNumber: 0,
        latency: Date.now() - startTime
      };
    }
  }

  /**
   * Utility: Delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): {
    isConnected: boolean;
    network: string;
    providerUrl: string;
    signerAddress: string | null;
  } {
    return {
      isConnected: this.isConnected,
      network: this.currentNetwork,
      providerUrl: this.currentNetwork ? this.config.networks[this.currentNetwork]?.rpcUrl || '' : '',
      signerAddress: this.signer?.address || null
    };
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    if (this.provider) {
      this.provider.removeAllListeners();
    }
    
    this.provider = null;
    this.signer = null;
    this.isConnected = false;
    
    console.log('🧹 Web3Client cleaned up');
  }
}
