/**
 * Smart Tourist Safety System - Blockchain Store
 * Zustand store for blockchain state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  WalletConnection, 
  NetworkStatus, 
  DigitalIdentity, 
  BlockchainRecord,
  SmartContractConfig,
  TransactionResponse 
} from '@/types/blockchain';
import { blockchainService } from '@/services/blockchain';

// ============================================================================
// STORE INTERFACES
// ============================================================================

interface BlockchainState {
  // Wallet State
  wallet: WalletConnection | null;
  isConnecting: boolean;
  connectionError: string | null;
  
  // Network State
  networkStatus: NetworkStatus | null;
  supportedNetworks: string[];
  
  // Contract State
  contractConfig: SmartContractConfig | null;
  contractsLoaded: boolean;
  
  // Identity State
  identities: DigitalIdentity[];
  selectedIdentity: DigitalIdentity | null;
  identitiesLoading: boolean;
  
  // Transaction State
  transactions: TransactionResponse[];
  pendingTransactions: string[];
  
  // Blockchain Records
  blockchainRecords: Record<string, BlockchainRecord[]>;
  recordsLoading: Record<string, boolean>;
}

interface BlockchainActions {
  // Wallet Actions
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<boolean>;
  refreshWalletStatus: () => Promise<void>;
  
  // Network Actions
  updateNetworkStatus: () => Promise<void>;
  setNetworkStatus: (status: NetworkStatus) => void;
  
  // Contract Actions
  loadContractConfig: () => Promise<void>;
  updateContractConfig: (config: SmartContractConfig) => void;
  
  // Identity Actions
  loadIdentities: () => Promise<void>;
  selectIdentity: (identity: DigitalIdentity | null) => void;
  verifyIdentity: (identityId: string) => Promise<boolean>;
  refreshIdentity: (identityId: string) => Promise<void>;
  
  // Transaction Actions
  addTransaction: (transaction: TransactionResponse) => void;
  updateTransaction: (txHash: string, updates: Partial<TransactionResponse>) => void;
  removeTransaction: (txHash: string) => void;
  clearTransactions: () => void;
  
  // Blockchain Records Actions
  loadBlockchainRecords: (identityId: string) => Promise<void>;
  addBlockchainRecord: (identityId: string, record: BlockchainRecord) => void;
  
  // Utility Actions
  clearError: () => void;
  resetState: () => void;
}

type BlockchainStore = BlockchainState & BlockchainActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: BlockchainState = {
  // Wallet State
  wallet: null,
  isConnecting: false,
  connectionError: null,
  
  // Network State
  networkStatus: null,
  supportedNetworks: ['ethereum', 'polygon', 'mumbai'],
  
  // Contract State
  contractConfig: null,
  contractsLoaded: false,
  
  // Identity State
  identities: [],
  selectedIdentity: null,
  identitiesLoading: false,
  
  // Transaction State
  transactions: [],
  pendingTransactions: [],
  
  // Blockchain Records
  blockchainRecords: {},
  recordsLoading: {}
};

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const useBlockchainStore = create<BlockchainStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // ============================================================================
      // WALLET ACTIONS
      // ============================================================================
      
      connectWallet: async (): Promise<boolean> => {
        set({ isConnecting: true, connectionError: null });
        
        try {
          const wallet = await blockchainService.connectWallet();
          
          set({ 
            wallet, 
            isConnecting: false,
            connectionError: null
          });
          
          // Update network status after connection
          get().updateNetworkStatus();
          
          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
          set({ 
            isConnecting: false, 
            connectionError: errorMessage,
            wallet: null
          });
          return false;
        }
      },
      
      disconnectWallet: async (): Promise<void> => {
        try {
          await blockchainService.disconnectWallet();
          set({ 
            wallet: null, 
            connectionError: null,
            networkStatus: null,
            selectedIdentity: null
          });
        } catch (error) {
          console.error('Failed to disconnect wallet:', error);
        }
      },
      
      switchNetwork: async (chainId: number): Promise<boolean> => {
        try {
          const success = await blockchainService.switchNetwork(chainId);
          if (success) {
            await get().refreshWalletStatus();
            await get().updateNetworkStatus();
          }
          return success;
        } catch (error) {
          console.error('Failed to switch network:', error);
          return false;
        }
      },
      
      refreshWalletStatus: async (): Promise<void> => {
        try {
          const wallet = await blockchainService.getWalletStatus();
          set({ wallet });
        } catch (error) {
          console.error('Failed to refresh wallet status:', error);
          set({ wallet: null });
        }
      },
      
      // ============================================================================
      // NETWORK ACTIONS
      // ============================================================================
      
      updateNetworkStatus: async (): Promise<void> => {
        try {
          const networkStatus = await blockchainService.getNetworkStatus();
          set({ networkStatus });
        } catch (error) {
          console.error('Failed to update network status:', error);
          set({ 
            networkStatus: {
              connected: false,
              network: 'unknown',
              blockNumber: 0,
              gasPrice: '0',
              latency: 0,
              throughput: 0,
              healthy: false,
              lastError: error instanceof Error ? error.message : 'Network error',
              lastUpdate: new Date().toISOString()
            }
          });
        }
      },
      
      setNetworkStatus: (status: NetworkStatus): void => {
        set({ networkStatus: status });
      },
      
      // ============================================================================
      // CONTRACT ACTIONS
      // ============================================================================
      
      loadContractConfig: async (): Promise<void> => {
        try {
          // In a real implementation, this would load from API or config
          const mockConfig: SmartContractConfig = {
            addresses: {
              touristIdentity: process.env.NEXT_PUBLIC_TOURIST_IDENTITY_ADDRESS || '0x0000000000000000000000000000000000000000',
              identityRegistry: process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000',
              identityVerification: process.env.NEXT_PUBLIC_IDENTITY_VERIFICATION_ADDRESS || '0x0000000000000000000000000000000000000000',
              emergencyLogging: process.env.NEXT_PUBLIC_EMERGENCY_LOGGING_ADDRESS || '0x0000000000000000000000000000000000000000'
            },
            network: {
              name: process.env.NEXT_PUBLIC_NETWORK_NAME || 'localhost',
              chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '31337'),
              rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545',
              explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL || 'http://localhost:4000',
              nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18
              }
            },
            contracts: {},
            gas: {
              identityCreation: 500000,
              identityUpdate: 200000,
              verification: 150000,
              emergencyLog: 100000,
              defaultGasPrice: '20000000000',
              maxGasPrice: '100000000000'
            },
            features: {
              ipfsStorage: true,
              biometricVerification: false,
              crossChainSupport: false,
              emergencyOverride: true,
              bulkOperations: false
            }
          };
          
          set({ 
            contractConfig: mockConfig, 
            contractsLoaded: true 
          });
        } catch (error) {
          console.error('Failed to load contract config:', error);
        }
      },
      
      updateContractConfig: (config: SmartContractConfig): void => {
        set({ contractConfig: config });
      },
      
      // ============================================================================
      // IDENTITY ACTIONS
      // ============================================================================
      
      loadIdentities: async (): Promise<void> => {
        set({ identitiesLoading: true });
        
        try {
          // In real implementation, this would fetch from API
          const response = await fetch('/api/blockchain/identity-records');
          if (response.ok) {
            const identities = await response.json();
            set({ identities, identitiesLoading: false });
          } else {
            throw new Error('Failed to fetch identities');
          }
        } catch (error) {
          console.error('Failed to load identities:', error);
          set({ identitiesLoading: false });
        }
      },
      
      selectIdentity: (identity: DigitalIdentity | null): void => {
        set({ selectedIdentity: identity });
        
        // Load blockchain records for selected identity
        if (identity) {
          get().loadBlockchainRecords(identity.id);
        }
      },
      
      verifyIdentity: async (identityId: string): Promise<boolean> => {
        try {
          const result = await blockchainService.verifyDigitalIdentity(identityId);
          
          if (result.verified && result.identity) {
            // Update identity in the list
            const { identities } = get();
            const updatedIdentities = identities.map(identity =>
              identity.id === identityId ? result.identity! : identity
            );
            set({ identities: updatedIdentities });
            
            // Update selected identity if it's the one being verified
            const { selectedIdentity } = get();
            if (selectedIdentity?.id === identityId) {
              set({ selectedIdentity: result.identity });
            }
          }
          
          return result.verified;
        } catch (error) {
          console.error('Failed to verify identity:', error);
          return false;
        }
      },
      
      refreshIdentity: async (identityId: string): Promise<void> => {
        try {
          const identity = await blockchainService.getDigitalIdentity(identityId);
          
          if (identity) {
            // Update identity in the list
            const { identities } = get();
            const updatedIdentities = identities.map(existing =>
              existing.id === identityId ? identity : existing
            );
            set({ identities: updatedIdentities });
            
            // Update selected identity if it's the one being refreshed
            const { selectedIdentity } = get();
            if (selectedIdentity?.id === identityId) {
              set({ selectedIdentity: identity });
            }
          }
        } catch (error) {
          console.error('Failed to refresh identity:', error);
        }
      },
      
      // ============================================================================
      // TRANSACTION ACTIONS
      // ============================================================================
      
      addTransaction: (transaction: TransactionResponse): void => {
        const { transactions, pendingTransactions } = get();
        
        set({ 
          transactions: [transaction, ...transactions],
          pendingTransactions: transaction.status === 'pending' 
            ? [...pendingTransactions, transaction.transactionHash]
            : pendingTransactions
        });
      },
      
      updateTransaction: (txHash: string, updates: Partial<TransactionResponse>): void => {
        const { transactions, pendingTransactions } = get();
        
        const updatedTransactions = transactions.map(tx =>
          tx.transactionHash === txHash ? { ...tx, ...updates } : tx
        );
        
        const updatedPending = updates.status === 'confirmed' || updates.status === 'failed'
          ? pendingTransactions.filter(hash => hash !== txHash)
          : pendingTransactions;
        
        set({ 
          transactions: updatedTransactions,
          pendingTransactions: updatedPending
        });
      },
      
      removeTransaction: (txHash: string): void => {
        const { transactions, pendingTransactions } = get();
        
        set({
          transactions: transactions.filter(tx => tx.transactionHash !== txHash),
          pendingTransactions: pendingTransactions.filter(hash => hash !== txHash)
        });
      },
      
      clearTransactions: (): void => {
        set({ 
          transactions: [], 
          pendingTransactions: [] 
        });
      },
      
      // ============================================================================
      // BLOCKCHAIN RECORDS ACTIONS
      // ============================================================================
      
      loadBlockchainRecords: async (identityId: string): Promise<void> => {
        const { recordsLoading } = get();
        
        set({
          recordsLoading: { ...recordsLoading, [identityId]: true }
        });
        
        try {
          const records = await blockchainService.getBlockchainRecords(identityId);
          
          set(state => ({
            blockchainRecords: {
              ...state.blockchainRecords,
              [identityId]: records
            },
            recordsLoading: {
              ...state.recordsLoading,
              [identityId]: false
            }
          }));
        } catch (error) {
          console.error('Failed to load blockchain records:', error);
          
          set(state => ({
            recordsLoading: {
              ...state.recordsLoading,
              [identityId]: false
            }
          }));
        }
      },
      
      addBlockchainRecord: (identityId: string, record: BlockchainRecord): void => {
        const { blockchainRecords } = get();
        const existingRecords = blockchainRecords[identityId] || [];
        
        set({
          blockchainRecords: {
            ...blockchainRecords,
            [identityId]: [record, ...existingRecords]
          }
        });
      },
      
      // ============================================================================
      // UTILITY ACTIONS
      // ============================================================================
      
      clearError: (): void => {
        set({ connectionError: null });
      },
      
      resetState: (): void => {
        set(initialState);
      }
    }),
    {
      name: 'blockchain-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist non-sensitive data
        supportedNetworks: state.supportedNetworks,
        contractConfig: state.contractConfig,
        contractsLoaded: state.contractsLoaded
      })
    }
  )
);

// ============================================================================
// STORE SELECTORS
// ============================================================================

export const useWallet = () => useBlockchainStore(state => state.wallet);
export const useNetworkStatus = () => useBlockchainStore(state => state.networkStatus);
export const useIdentities = () => useBlockchainStore(state => state.identities);
export const useSelectedIdentity = () => useBlockchainStore(state => state.selectedIdentity);
export const useTransactions = () => useBlockchainStore(state => state.transactions);
export const usePendingTransactions = () => useBlockchainStore(state => state.pendingTransactions);
export const useContractConfig = () => useBlockchainStore(state => state.contractConfig);

// ============================================================================
// STORE ACTIONS SELECTORS
// ============================================================================

export const useWalletActions = () => useBlockchainStore(state => ({
  connectWallet: state.connectWallet,
  disconnectWallet: state.disconnectWallet,
  switchNetwork: state.switchNetwork,
  refreshWalletStatus: state.refreshWalletStatus
}));

export const useIdentityActions = () => useBlockchainStore(state => ({
  loadIdentities: state.loadIdentities,
  selectIdentity: state.selectIdentity,
  verifyIdentity: state.verifyIdentity,
  refreshIdentity: state.refreshIdentity
}));

export const useTransactionActions = () => useBlockchainStore(state => ({
  addTransaction: state.addTransaction,
  updateTransaction: state.updateTransaction,
  removeTransaction: state.removeTransaction,
  clearTransactions: state.clearTransactions
}));

export default useBlockchainStore;
