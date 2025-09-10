/**
 * Smart Tourist Safety System - Blockchain Hook
 * Custom React hook for blockchain interactions and state management
 */

import { useEffect, useCallback, useState } from 'react';
import { useBlockchainStore } from '@/stores/blockchain-store';
import { blockchainService } from '@/services/blockchain';
import type { 
  TransactionRequest, 
  TransactionResponse, 
  DigitalIdentity,
  NetworkStatus 
} from '@/types/blockchain';

// ============================================================================
// MAIN BLOCKCHAIN HOOK
// ============================================================================

export function useBlockchain() {
  const {
    // State
    wallet,
    networkStatus,
    identities,
    selectedIdentity,
    transactions,
    pendingTransactions,
    contractConfig,
    isConnecting,
    connectionError,
    identitiesLoading,
    
    // Actions
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshWalletStatus,
    updateNetworkStatus,
    loadIdentities,
    selectIdentity,
    verifyIdentity,
    loadContractConfig,
    addTransaction,
    updateTransaction,
    clearError
  } = useBlockchainStore();

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    // Initialize blockchain on mount
    const initialize = async () => {
      try {
        // Load contract configuration
        await loadContractConfig();
        
        // Check for existing wallet connection
        await refreshWalletStatus();
        
        // Update network status if wallet is connected
        if (wallet) {
          await updateNetworkStatus();
        }
      } catch (error) {
        console.error('Failed to initialize blockchain:', error);
      }
    };

    initialize();
  }, []);

  // ============================================================================
  // AUTOMATIC REFRESH
  // ============================================================================

  useEffect(() => {
    if (!wallet) return;

    // Set up periodic refresh for network status
    const networkRefreshInterval = setInterval(async () => {
      await updateNetworkStatus();
    }, 30000); // Every 30 seconds

    // Set up periodic refresh for wallet status
    const walletRefreshInterval = setInterval(async () => {
      await refreshWalletStatus();
    }, 60000); // Every minute

    return () => {
      clearInterval(networkRefreshInterval);
      clearInterval(walletRefreshInterval);
    };
  }, [wallet, updateNetworkStatus, refreshWalletStatus]);

  // ============================================================================
  // TRANSACTION MONITORING
  // ============================================================================

  useEffect(() => {
    if (pendingTransactions.length === 0) return;

    // Monitor pending transactions
    const monitorTransactions = async () => {
      for (const txHash of pendingTransactions) {
        try {
          const result = await blockchainService.waitForTransaction(txHash, 1);
          updateTransaction(txHash, result);
        } catch (error) {
          console.error(`Failed to monitor transaction ${txHash}:`, error);
          updateTransaction(txHash, {
            status: 'failed',
            error: {
              code: 'MONITORING_FAILED',
              message: 'Failed to monitor transaction'
            }
          });
        }
      }
    };

    // Check pending transactions every 10 seconds
    const monitoringInterval = setInterval(monitorTransactions, 10000);

    return () => clearInterval(monitoringInterval);
  }, [pendingTransactions, updateTransaction]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const isConnected = Boolean(wallet?.connected);
  const isNetworkHealthy = Boolean(networkStatus?.healthy);
  const hasContractConfig = Boolean(contractConfig);
  const pendingTransactionCount = pendingTransactions.length;

  // ============================================================================
  // WALLET FUNCTIONS
  // ============================================================================

  const handleConnectWallet = useCallback(async (): Promise<boolean> => {
    const success = await connectWallet();
    if (success) {
      // Load identities after successful connection
      await loadIdentities();
    }
    return success;
  }, [connectWallet, loadIdentities]);

  const handleDisconnectWallet = useCallback(async (): Promise<void> => {
    await disconnectWallet();
  }, [disconnectWallet]);

  const handleSwitchNetwork = useCallback(async (chainId: number): Promise<boolean> => {
    return await switchNetwork(chainId);
  }, [switchNetwork]);

  // ============================================================================
  // TRANSACTION FUNCTIONS
  // ============================================================================

  const sendTransaction = useCallback(async (
    request: TransactionRequest
  ): Promise<TransactionResponse> => {
    if (!wallet?.connected) {
      throw new Error('Wallet not connected');
    }

    try {
      const response = await blockchainService.sendTransaction(request);
      
      // Add transaction to store
      addTransaction(response);
      
      return response;
    } catch (error) {
      const errorResponse: TransactionResponse = {
        success: false,
        transactionHash: '',
        status: 'failed',
        confirmations: 0,
        timestamp: new Date().toISOString(),
        error: {
          code: 'TRANSACTION_FAILED',
          message: error instanceof Error ? error.message : 'Transaction failed'
        }
      };
      
      addTransaction(errorResponse);
      throw error;
    }
  }, [wallet, addTransaction]);

  const waitForTransactionConfirmation = useCallback(async (
    txHash: string,
    confirmations: number = 1
  ): Promise<TransactionResponse> => {
    try {
      const result = await blockchainService.waitForTransaction(txHash, confirmations);
      updateTransaction(txHash, result);
      return result;
    } catch (error) {
      const errorUpdate = {
        status: 'failed' as const,
        error: {
          code: 'CONFIRMATION_FAILED',
          message: error instanceof Error ? error.message : 'Confirmation failed'
        }
      };
      updateTransaction(txHash, errorUpdate);
      throw error;
    }
  }, [updateTransaction]);

  // ============================================================================
  // IDENTITY FUNCTIONS
  // ============================================================================

  const handleVerifyIdentity = useCallback(async (identityId: string): Promise<boolean> => {
    return await verifyIdentity(identityId);
  }, [verifyIdentity]);

  const handleSelectIdentity = useCallback((identity: DigitalIdentity | null): void => {
    selectIdentity(identity);
  }, [selectIdentity]);

  const refreshIdentities = useCallback(async (): Promise<void> => {
    await loadIdentities();
  }, [loadIdentities]);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const clearConnectionError = useCallback((): void => {
    clearError();
  }, [clearError]);

  const getNetworkExplorerUrl = useCallback((txHash?: string, address?: string): string => {
    if (!networkStatus) return '';
    
    const baseUrls: Record<string, string> = {
      ethereum: 'https://etherscan.io',
      polygon: 'https://polygonscan.com',
      mumbai: 'https://mumbai.polygonscan.com',
      localhost: 'http://localhost:4000'
    };

    const baseUrl = baseUrls[networkStatus.network] || baseUrls.localhost;
    
    if (txHash) {
      return `${baseUrl}/tx/${txHash}`;
    } else if (address) {
      return `${baseUrl}/address/${address}`;
    }
    
    return baseUrl;
  }, [networkStatus]);

  const formatAddress = useCallback((address: string, length: number = 6): string => {
    if (!address) return '';
    if (address.length <= length * 2) return address;
    return `${address.slice(0, length)}...${address.slice(-length)}`;
  }, []);

  const formatTransactionHash = useCallback((hash: string, length: number = 6): string => {
    return formatAddress(hash, length);
  }, [formatAddress]);

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  const handleError = useCallback((error: unknown, context: string): void => {
    console.error(`Blockchain error in ${context}:`, error);
    
    // You could add toast notifications here
    // toast.error(`${context}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }, []);

  // ============================================================================
  // RETURN HOOK INTERFACE
  // ============================================================================

  return {
    // State
    wallet,
    networkStatus,
    identities,
    selectedIdentity,
    transactions,
    pendingTransactions,
    contractConfig,
    isConnecting,
    connectionError,
    identitiesLoading,
    
    // Computed values
    isConnected,
    isNetworkHealthy,
    hasContractConfig,
    pendingTransactionCount,
    
    // Wallet functions
    connectWallet: handleConnectWallet,
    disconnectWallet: handleDisconnectWallet,
    switchNetwork: handleSwitchNetwork,
    
    // Transaction functions
    sendTransaction,
    waitForTransactionConfirmation,
    
    // Identity functions
    verifyIdentity: handleVerifyIdentity,
    selectIdentity: handleSelectIdentity,
    refreshIdentities,
    
    // Utility functions
    clearConnectionError,
    getNetworkExplorerUrl,
    formatAddress,
    formatTransactionHash,
    handleError
  };
}

// ============================================================================
// SPECIALIZED HOOKS
// ============================================================================

/**
 * Hook for wallet connection only
 */
export function useWallet() {
  const { 
    wallet, 
    isConnecting, 
    connectionError,
    connectWallet, 
    disconnectWallet,
    clearConnectionError 
  } = useBlockchain();

  return {
    wallet,
    isConnecting,
    connectionError,
    isConnected: Boolean(wallet?.connected),
    connectWallet,
    disconnectWallet,
    clearConnectionError
  };
}

/**
 * Hook for network status only
 */
export function useNetwork() {
  const { 
    networkStatus, 
    switchNetwork,
    getNetworkExplorerUrl 
  } = useBlockchain();

  return {
    networkStatus,
    isNetworkHealthy: Boolean(networkStatus?.healthy),
    switchNetwork,
    getNetworkExplorerUrl
  };
}

/**
 * Hook for identity management only
 */
export function useIdentities() {
  const {
    identities,
    selectedIdentity,
    identitiesLoading,
    selectIdentity,
    verifyIdentity,
    refreshIdentities
  } = useBlockchain();

  return {
    identities,
    selectedIdentity,
    identitiesLoading,
    selectIdentity,
    verifyIdentity,
    refreshIdentities
  };
}

/**
 * Hook for transaction management only
 */
export function useTransactions() {
  const {
    transactions,
    pendingTransactions,
    pendingTransactionCount,
    sendTransaction,
    waitForTransactionConfirmation,
    formatTransactionHash,
    getNetworkExplorerUrl
  } = useBlockchain();

  return {
    transactions,
    pendingTransactions,
    pendingTransactionCount,
    sendTransaction,
    waitForTransactionConfirmation,
    formatTransactionHash,
    getNetworkExplorerUrl
  };
}

/**
 * Hook for contract interactions
 */
export function useContracts() {
  const {
    contractConfig,
    hasContractConfig,
    isConnected,
    sendTransaction
  } = useBlockchain();

  const isReady = isConnected && hasContractConfig;

  return {
    contractConfig,
    hasContractConfig,
    isReady,
    sendTransaction
  };
}

// ============================================================================
// HOOK WITH AUTOMATIC CONNECTION
// ============================================================================

/**
 * Hook that automatically connects wallet on mount if previously connected
 */
export function useAutoConnectBlockchain() {
  const [hasAttemptedConnection, setHasAttemptedConnection] = useState(false);
  const blockchain = useBlockchain();

  useEffect(() => {
    const attemptAutoConnection = async () => {
      if (hasAttemptedConnection) return;
      
      try {
        // Check if user was previously connected
        const wasConnected = localStorage.getItem('wallet-connected') === 'true';
        
        if (wasConnected && !blockchain.isConnected) {
          await blockchain.connectWallet();
        }
      } catch (error) {
        console.error('Auto-connection failed:', error);
      } finally {
        setHasAttemptedConnection(true);
      }
    };

    attemptAutoConnection();
  }, [hasAttemptedConnection, blockchain]);

  // Save connection status to localStorage
  useEffect(() => {
    if (blockchain.isConnected) {
      localStorage.setItem('wallet-connected', 'true');
    } else {
      localStorage.removeItem('wallet-connected');
    }
  }, [blockchain.isConnected]);

  return {
    ...blockchain,
    hasAttemptedConnection
  };
}

export default useBlockchain;
