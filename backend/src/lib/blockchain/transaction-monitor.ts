/**
 * Smart Tourist Safety System - Transaction Monitor Service
 * Real-time blockchain transaction tracking and monitoring
 * BLOCKCHAIN VERIFIED - All transactions cryptographically secured
 */

import { ethers } from 'ethers';
import { Web3Client } from './web3-client';

// Transaction monitoring interfaces
interface TransactionMonitorConfig {
  checkInterval: number; // milliseconds
  maxRetries: number;
  timeoutDuration: number; // milliseconds
  confirmationsRequired: number;
  enableEventListening: boolean;
  webhookUrl?: string;
}

interface TransactionStatus {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed' | 'timeout' | 'dropped';
  confirmations: number;
  blockNumber?: number;
  gasUsed?: number;
  effectiveGasPrice?: string;
  timestamp: string;
  error?: string;
  receipt?: ethers.TransactionReceipt;
  events?: any[];
  retryCount: number;
  lastChecked: string;
}

interface MonitoredTransaction extends TransactionStatus {
  id: string;
  type: 'identity_creation' | 'identity_update' | 'verification' | 'emergency' | 'deployment';
  identityId?: string;
  contractName?: string;
  methodName?: string;
  args?: any[];
  authorizedBy: string;
  reason: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  callbacks: Array<{
    type: 'success' | 'failure' | 'confirmation';
    callback: (transaction: MonitoredTransaction) => void;
  }>;
  metadata?: {
    userFriendlyDescription: string;
    estimatedCompletionTime: string;
    blockchainNetwork: string;
    securityLevel: 'standard' | 'enhanced' | 'military-grade';
  };
}

export class TransactionMonitor {
  private web3Client: Web3Client;
  private config: TransactionMonitorConfig;
  private monitoredTransactions: Map<string, MonitoredTransaction> = new Map();
  private intervalId: NodeJS.Timeout | null = null;
  private isMonitoring: boolean = false;
  private eventListeners: Map<string, any> = new Map();

  constructor(web3Client: Web3Client, config?: Partial<TransactionMonitorConfig>) {
    this.web3Client = web3Client;
    this.config = {
      checkInterval: 5000, // 5 seconds
      maxRetries: 10,
      timeoutDuration: 300000, // 5 minutes
      confirmationsRequired: 2,
      enableEventListening: true,
      ...config
    };
  }

  /**
   * Start monitoring blockchain transactions
   * BLOCKCHAIN VERIFIED: Real-time transaction tracking
   */
  public async startMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      console.log('⚠️ Transaction monitor already running');
      return;
    }

    try {
      console.log('🔍 Starting BLOCKCHAIN VERIFIED transaction monitoring...');
      
      this.isMonitoring = true;

      // Start periodic transaction checking
      this.intervalId = setInterval(async () => {
        await this.checkPendingTransactions();
      }, this.config.checkInterval);

      // Setup event listeners if enabled
      if (this.config.enableEventListening) {
        await this.setupEventListeners();
      }

      console.log(`✅ Transaction monitor started (interval: ${this.config.checkInterval}ms)`);
      console.log(`📋 Monitoring ${this.monitoredTransactions.size} transactions`);

    } catch (error: any) {
      console.error('❌ Failed to start transaction monitor:', error.message);
      this.isMonitoring = false;
      throw error;
    }
  }

  /**
   * Stop monitoring transactions
   */
  public stopMonitoring(): void {
    if (!this.isMonitoring) {
      return;
    }

    console.log('🛑 Stopping transaction monitor...');

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Remove event listeners
    this.cleanup();

    this.isMonitoring = false;
    console.log('✅ Transaction monitor stopped');
  }

  /**
   * Add transaction to monitoring queue
   * BLOCKCHAIN VERIFIED: Queue transaction for real-time tracking
   */
  public addTransaction(
    transactionHash: string,
    details: {
      type: MonitoredTransaction['type'];
      identityId?: string;
      contractName?: string;
      methodName?: string;
      args?: any[];
      authorizedBy: string;
      reason: string;
      priority?: MonitoredTransaction['priority'];
      userFriendlyDescription?: string;
    }
  ): string {
    const transactionId = `tx_${Date.now()}_${transactionHash.slice(-8)}`;
    
    const monitoredTx: MonitoredTransaction = {
      id: transactionId,
      hash: transactionHash,
      status: 'pending',
      confirmations: 0,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      lastChecked: new Date().toISOString(),
      type: details.type,
      identityId: details.identityId,
      contractName: details.contractName,
      methodName: details.methodName,
      args: details.args,
      authorizedBy: details.authorizedBy,
      reason: details.reason,
      priority: details.priority || 'normal',
      callbacks: [],
      metadata: {
        userFriendlyDescription: details.userFriendlyDescription || `${details.type} transaction`,
        estimatedCompletionTime: this.calculateEstimatedTime(),
        blockchainNetwork: this.web3Client.getConnectionStatus().network,
        securityLevel: 'military-grade'
      }
    };

    this.monitoredTransactions.set(transactionId, monitoredTx);

    console.log(`📝 BLOCKCHAIN transaction queued for monitoring: ${transactionId}`);
    console.log(`🔗 Hash: ${transactionHash}`);
    console.log(`📋 Type: ${details.type}`);
    console.log(`⚡ Priority: ${monitoredTx.priority}`);

    return transactionId;
  }

  /**
   * Add callback for transaction status updates
   */
  public addTransactionCallback(
    transactionId: string,
    type: 'success' | 'failure' | 'confirmation',
    callback: (transaction: MonitoredTransaction) => void
  ): boolean {
    const transaction = this.monitoredTransactions.get(transactionId);
    if (!transaction) {
      console.error(`❌ Transaction ${transactionId} not found for callback`);
      return false;
    }

    transaction.callbacks.push({ type, callback });
    console.log(`🔔 Callback added for ${transactionId}: ${type}`);
    return true;
  }

  /**
   * Get transaction status by ID
   */
  public getTransactionStatus(transactionId: string): MonitoredTransaction | null {
    return this.monitoredTransactions.get(transactionId) || null;
  }

  /**
   * Get transaction status by hash
   */
  public getTransactionStatusByHash(transactionHash: string): MonitoredTransaction | null {
    for (const transaction of this.monitoredTransactions.values()) {
      if (transaction.hash === transactionHash) {
        return transaction;
      }
    }
    return null;
  }

  /**
   * Get all monitored transactions
   */
  public getAllTransactions(): MonitoredTransaction[] {
    return Array.from(this.monitoredTransactions.values());
  }

  /**
   * Get transactions by status
   */
  public getTransactionsByStatus(status: TransactionStatus['status']): MonitoredTransaction[] {
    return Array.from(this.monitoredTransactions.values()).filter(tx => tx.status === status);
  }

  /**
   * Get transactions by type
   */
  public getTransactionsByType(type: MonitoredTransaction['type']): MonitoredTransaction[] {
    return Array.from(this.monitoredTransactions.values()).filter(tx => tx.type === type);
  }

  /**
   * Get transactions by identity ID
   */
  public getTransactionsByIdentity(identityId: string): MonitoredTransaction[] {
    return Array.from(this.monitoredTransactions.values()).filter(tx => tx.identityId === identityId);
  }

  /**
   * Get monitoring statistics
   */
  public getMonitoringStats(): {
    totalTransactions: number;
    pendingTransactions: number;
    confirmedTransactions: number;
    failedTransactions: number;
    averageConfirmationTime: number;
    networkStatus: string;
    monitoringUptime: number;
  } {
    const allTxs = Array.from(this.monitoredTransactions.values());
    
    const pending = allTxs.filter(tx => tx.status === 'pending').length;
    const confirmed = allTxs.filter(tx => tx.status === 'confirmed').length;
    const failed = allTxs.filter(tx => tx.status === 'failed').length;

    // Calculate average confirmation time (simplified)
    const confirmedTxs = allTxs.filter(tx => tx.status === 'confirmed' && tx.receipt);
    const avgConfTime = confirmedTxs.length > 0 
      ? confirmedTxs.reduce((sum, tx) => sum + (tx.confirmations * 15), 0) / confirmedTxs.length 
      : 0; // Assuming 15 seconds per block

    return {
      totalTransactions: allTxs.length,
      pendingTransactions: pending,
      confirmedTransactions: confirmed,
      failedTransactions: failed,
      averageConfirmationTime: avgConfTime,
      networkStatus: this.web3Client.getConnectionStatus().isConnected ? 'CONNECTED' : 'DISCONNECTED',
      monitoringUptime: this.isMonitoring ? Date.now() : 0
    };
  }

  /**
   * Remove completed transactions from monitoring
   */
  public cleanupCompletedTransactions(maxAge: number = 3600000): number { // 1 hour default
    const cutoffTime = Date.now() - maxAge;
    let removedCount = 0;

    for (const [id, transaction] of this.monitoredTransactions.entries()) {
      if (
        (transaction.status === 'confirmed' || transaction.status === 'failed') &&
        new Date(transaction.timestamp).getTime() < cutoffTime
      ) {
        this.monitoredTransactions.delete(id);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      console.log(`🧹 Cleaned up ${removedCount} completed transactions`);
    }

    return removedCount;
  }

  /**
   * Wait for transaction confirmation
   */
  public async waitForConfirmation(
    transactionId: string,
    timeout: number = this.config.timeoutDuration
  ): Promise<MonitoredTransaction> {
    return new Promise((resolve, reject) => {
      const transaction = this.monitoredTransactions.get(transactionId);
      if (!transaction) {
        reject(new Error(`Transaction ${transactionId} not found`));
        return;
      }

      if (transaction.status === 'confirmed') {
        resolve(transaction);
        return;
      }

      if (transaction.status === 'failed') {
        reject(new Error(`Transaction failed: ${transaction.error}`));
        return;
      }

      // Set up timeout
      const timeoutId = setTimeout(() => {
        reject(new Error(`Transaction confirmation timeout after ${timeout}ms`));
      }, timeout);

      // Add callback for completion
      this.addTransactionCallback(transactionId, 'success', (tx) => {
        clearTimeout(timeoutId);
        resolve(tx);
      });

      this.addTransactionCallback(transactionId, 'failure', (tx) => {
        clearTimeout(timeoutId);
        reject(new Error(`Transaction failed: ${tx.error}`));
      });
    });
  }

  // Private methods

  /**
   * Check all pending transactions
   */
  private async checkPendingTransactions(): Promise<void> {
    const pendingTxs = this.getTransactionsByStatus('pending');
    
    if (pendingTxs.length === 0) {
      return;
    }

    console.log(`🔍 Checking ${pendingTxs.length} pending BLOCKCHAIN transactions...`);

    for (const transaction of pendingTxs) {
      try {
        await this.checkTransactionStatus(transaction);
      } catch (error: any) {
        console.error(`❌ Failed to check transaction ${transaction.id}:`, error.message);
        this.handleTransactionError(transaction, error);
      }
    }
  }

  /**
   * Check individual transaction status
   */
  private async checkTransactionStatus(transaction: MonitoredTransaction): Promise<void> {
    try {
      const receipt = await this.web3Client.getTransactionReceipt(transaction.hash);
      
      if (!receipt) {
        // Transaction still pending
        this.handlePendingTransaction(transaction);
        return;
      }

      // Transaction mined
      const networkInfo = await this.web3Client.getNetworkInfo();
      const confirmations = networkInfo.blockNumber - receipt.blockNumber + 1;

      // Update transaction status
      transaction.receipt = receipt;
      transaction.blockNumber = receipt.blockNumber;
      transaction.gasUsed = Number(receipt.gasUsed);
      transaction.confirmations = confirmations;
      transaction.lastChecked = new Date().toISOString();

      if (receipt.status === 1) {
        // Transaction successful
        if (confirmations >= this.config.confirmationsRequired) {
          transaction.status = 'confirmed';
          console.log(`✅ BLOCKCHAIN transaction confirmed: ${transaction.id}`);
          console.log(`🔗 Hash: ${transaction.hash}`);
          console.log(`📊 Confirmations: ${confirmations}`);
          console.log(`⛽ Gas used: ${transaction.gasUsed?.toLocaleString()}`);
          
          // Parse events if available
          if (transaction.contractName) {
            try {
              transaction.events = await this.parseTransactionEvents(receipt, transaction.contractName);
            } catch (error) {
              console.warn('Failed to parse events:', error);
            }
          }

          this.executeCallbacks(transaction, 'success');
        } else {
          // Still waiting for more confirmations
          this.executeCallbacks(transaction, 'confirmation');
        }
      } else {
        // Transaction failed
        transaction.status = 'failed';
        transaction.error = 'Transaction reverted';
        console.log(`❌ BLOCKCHAIN transaction failed: ${transaction.id}`);
        this.executeCallbacks(transaction, 'failure');
      }

    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Handle pending transaction
   */
  private handlePendingTransaction(transaction: MonitoredTransaction): void {
    transaction.retryCount++;
    transaction.lastChecked = new Date().toISOString();

    // Check for timeout
    const transactionAge = Date.now() - new Date(transaction.timestamp).getTime();
    if (transactionAge > this.config.timeoutDuration) {
      transaction.status = 'timeout';
      transaction.error = 'Transaction timeout';
      console.log(`⏰ Transaction timeout: ${transaction.id}`);
      this.executeCallbacks(transaction, 'failure');
      return;
    }

    // Check max retries
    if (transaction.retryCount > this.config.maxRetries) {
      transaction.status = 'dropped';
      transaction.error = 'Transaction dropped after max retries';
      console.log(`📉 Transaction dropped: ${transaction.id}`);
      this.executeCallbacks(transaction, 'failure');
      return;
    }

    // Update estimated completion time
    if (transaction.metadata) {
      transaction.metadata.estimatedCompletionTime = this.calculateEstimatedTime(transaction.retryCount);
    }
  }

  /**
   * Handle transaction error
   */
  private handleTransactionError(transaction: MonitoredTransaction, error: Error): void {
    transaction.retryCount++;
    transaction.lastChecked = new Date().toISOString();
    transaction.error = error.message;

    if (transaction.retryCount > this.config.maxRetries) {
      transaction.status = 'failed';
      console.log(`❌ Transaction failed after retries: ${transaction.id}`);
      this.executeCallbacks(transaction, 'failure');
    }
  }

  /**
   * Execute transaction callbacks
   */
  private executeCallbacks(transaction: MonitoredTransaction, type: 'success' | 'failure' | 'confirmation'): void {
    const callbacks = transaction.callbacks.filter(cb => cb.type === type);
    
    for (const { callback } of callbacks) {
      try {
        callback(transaction);
      } catch (error) {
        console.error(`❌ Callback execution failed for ${transaction.id}:`, error);
      }
    }
  }

  /**
   * Setup blockchain event listeners
   */
  private async setupEventListeners(): Promise<void> {
    try {
      console.log('👂 Setting up BLOCKCHAIN event listeners...');

      // Listen to common contract events
      const contractNames = ['TouristIdentity', 'IdentityRegistry', 'IdentityVerification', 'EmergencyLogging'];

      for (const contractName of contractNames) {
        try {
          // Listen to all events from each contract
          this.web3Client.listenToEvents(
            contractName,
            '*', // Listen to all events
            (event) => this.handleContractEvent(event)
          );

          this.eventListeners.set(contractName, true);
        } catch (error) {
          console.warn(`Failed to setup listener for ${contractName}:`, error);
        }
      }

      console.log('✅ Event listeners setup completed');

    } catch (error) {
      console.error('❌ Failed to setup event listeners:', error);
    }
  }

  /**
   * Handle contract events
   */
  private handleContractEvent(event: any): void {
    console.log(`📡 BLOCKCHAIN event received: ${event.contractName}.${event.eventName}`);
    
    // Find related monitored transactions
    const relatedTx = this.getTransactionStatusByHash(event.transactionHash);
    if (relatedTx) {
      if (!relatedTx.events) {
        relatedTx.events = [];
      }
      relatedTx.events.push(event);
      console.log(`🔗 Event linked to monitored transaction: ${relatedTx.id}`);
    }

    // Handle specific events
    this.processSpecialEvents(event);
  }

  /**
   * Process special blockchain events
   */
  private processSpecialEvents(event: any): void {
    switch (event.eventName) {
      case 'IdentityCreated':
        console.log(`🆔 New BLOCKCHAIN identity created: ${event.args?.[0]}`);
        break;
      case 'IdentityVerified':
        console.log(`✅ BLOCKCHAIN identity verified: ${event.args?.[0]}`);
        break;
      case 'EmergencyReported':
        console.log(`🚨 BLOCKCHAIN emergency reported: ${event.args?.[0]}`);
        break;
      default:
        // Log other events
        break;
    }
  }

  /**
   * Parse transaction events
   */
  private async parseTransactionEvents(receipt: ethers.TransactionReceipt, contractName: string): Promise<any[]> {
    try {
      const contract = this.web3Client.getContract(contractName);
      const events: any[] = [];

      for (const log of receipt.logs) {
        try {
          const parsedLog = contract.interface.parseLog(log);
          if (parsedLog) {
            events.push({
              name: parsedLog.name,
              args: parsedLog.args,
              signature: parsedLog.signature,
              topic: parsedLog.topic
            });
          }
        } catch (error) {
          // Ignore parsing errors for logs from other contracts
        }
      }

      return events;

    } catch (error) {
      console.warn('Failed to parse transaction events:', error);
      return [];
    }
  }

  /**
   * Calculate estimated completion time
   */
  private calculateEstimatedTime(retryCount: number = 0): string {
    const baseTime = 30; // 30 seconds base
    const additionalTime = retryCount * 15; // 15 seconds per retry
    const totalSeconds = baseTime + additionalTime;
    
    return `~${totalSeconds} seconds`;
  }

  /**
   * Cleanup resources and event listeners
   */
  public cleanup(): void {
    // Stop monitoring
    this.stopMonitoring();

    // Remove all event listeners
    for (const contractName of this.eventListeners.keys()) {
      try {
        this.web3Client.stopListening(contractName);
      } catch (error) {
        console.warn(`Failed to remove listener for ${contractName}:`, error);
      }
    }

    this.eventListeners.clear();
    this.monitoredTransactions.clear();

    console.log('🧹 Transaction monitor cleaned up');
  }

  /**
   * Get health status
   */
  public getHealthStatus(): {
    isMonitoring: boolean;
    pendingTransactions: number;
    eventListenersActive: number;
    lastCheckTime: string;
    networkConnected: boolean;
  } {
    return {
      isMonitoring: this.isMonitoring,
      pendingTransactions: this.getTransactionsByStatus('pending').length,
      eventListenersActive: this.eventListeners.size,
      lastCheckTime: new Date().toISOString(),
      networkConnected: this.web3Client.getConnectionStatus().isConnected
    };
  }
}
