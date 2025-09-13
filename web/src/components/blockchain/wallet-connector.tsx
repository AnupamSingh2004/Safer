/**
 * Smart Tourist Safety System - Wallet Connector Component
 * Beautiful MetaMask integration with connection status, network switching, and enhanced UI
 * Enhanced for Demo with visual indicators and smooth animations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Shield,
  Globe,
  Zap,
  ChevronDown,
  RefreshCw,
  User,
  Settings,
  LogOut,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useWallet, useNetwork } from '@/hooks/use-blockchain';
import { NETWORK_CONFIGS, BlockchainNetwork } from '@/types/blockchain';
import { cn } from '@/lib/utils';

// ============================================================================
// SIMPLE DROPDOWN COMPONENT
// ============================================================================

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'end';
}

const SimpleDropdown: React.FC<DropdownProps> = ({ trigger, children, align = 'end' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div 
          className={cn(
            'absolute top-full mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50',
            align === 'end' ? 'right-0' : 'left-0'
          )}
          onMouseLeave={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SIMPLE ALERT COMPONENT
// ============================================================================

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
}

const Alert: React.FC<AlertProps> = ({ children, variant = 'default' }) => (
  <div className={cn(
    'rounded-lg border p-4',
    variant === 'destructive' 
      ? 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100'
      : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100'
  )}>
    {children}
  </div>
);

const AlertDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('text-sm', className)}>
    {children}
  </div>
);

// ============================================================================
// SIMPLE PROGRESS COMPONENT
// ============================================================================

interface ProgressProps {
  value: number;
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({ value, className }) => (
  <div className={cn('w-full bg-gray-200 rounded-full h-2', className)}>
    <div 
      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);

// ============================================================================
// SIMPLE SKELETON COMPONENT
// ============================================================================

const Skeleton: React.FC<{ className: string }> = ({ className }) => (
  <div className={cn('animate-pulse bg-gray-200 dark:bg-gray-700 rounded', className)} />
);

// ============================================================================
// NETWORK SELECTOR COMPONENT
// ============================================================================

interface NetworkSelectorProps {
  currentNetwork?: string;
  onNetworkSwitch: (chainId: number) => Promise<boolean>;
  isLoading?: boolean;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  currentNetwork,
  onNetworkSwitch,
  isLoading = false
}) => {
  const [isSwitching, setIsSwitching] = useState<number | null>(null);
  const { toast } = useToast();

  const handleNetworkSwitch = async (chainId: number) => {
    try {
      setIsSwitching(chainId);
      const success = await onNetworkSwitch(chainId);
      
      if (success) {
        toast({
          title: '✅ Network Switched',
          description: 'Successfully switched to the selected network',
        });
      } else {
        toast({
          title: '❌ Switch Failed',
          description: 'Failed to switch network. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: '❌ Network Error',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSwitching(null);
    }
  };

  const supportedNetworks = [
    BlockchainNetwork.POLYGON_MAINNET,
    BlockchainNetwork.POLYGON_MUMBAI,
    BlockchainNetwork.LOCAL_HARDHAT,
    BlockchainNetwork.ETHEREUM_MAINNET
  ];

  return (
    <SimpleDropdown
      trigger={
        <Button variant="outline" size="sm" disabled={isLoading}>
          <Globe className="h-4 w-4 mr-2" />
          {currentNetwork || 'Select Network'}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      }
    >
      <div className="p-2">
        <div className="text-sm font-semibold p-2 border-b mb-2">Select Blockchain Network</div>
        {supportedNetworks.map((networkKey) => {
          const network = NETWORK_CONFIGS[networkKey];
          const isActive = currentNetwork === network.displayName;
          const isSwitchingThis = isSwitching === network.chainId;
          
          return (
            <button
              key={networkKey}
              onClick={() => handleNetworkSwitch(network.chainId)}
              disabled={isSwitchingThis}
              className={cn(
                'w-full flex items-center justify-between p-3 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-left',
                isActive && 'bg-green-50 dark:bg-green-950'
              )}
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  'w-3 h-3 rounded-full',
                  isActive ? 'bg-green-500' : 'bg-gray-300',
                  network.isTestnet && 'border-2 border-orange-400'
                )} />
                <div>
                  <div className="font-medium text-sm">{network.displayName}</div>
                  <div className="text-xs text-muted-foreground">
                    {network.nativeCurrency.symbol} • Chain ID: {network.chainId}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {network.isTestnet && (
                  <Badge variant="secondary" className="text-xs">
                    Testnet
                  </Badge>
                )}
                {isActive && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {isSwitchingThis && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </SimpleDropdown>
  );
};

// ============================================================================
// WALLET STATUS COMPONENT
// ============================================================================

interface WalletStatusProps {
  wallet?: any;
  networkStatus?: any;
  isLoading?: boolean;
}

const WalletStatus: React.FC<WalletStatusProps> = ({
  wallet,
  networkStatus,
  isLoading
}) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (wallet?.address) {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num < 0.01) return '< 0.01';
    return num.toFixed(4);
  };

  if (isLoading) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!wallet?.connected) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No Wallet Connected</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your MetaMask wallet to access blockchain features
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center justify-center space-x-2 p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>Secure Connection</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-2 bg-green-50 dark:bg-green-950 rounded-lg">
              <Globe className="h-4 w-4 text-green-600" />
              <span>Multi-Network</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
      <CardContent className="p-6">
        {/* Wallet Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 border-2 border-green-500 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-green-800 dark:text-green-200">
                {wallet.blockchainStatus?.connected || '🔗 Connected'}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                {wallet.providerInfo?.name || 'MetaMask Wallet'}
              </div>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        </div>

        {/* Address & Balance */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Wallet Address
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAddress}
              className="h-auto p-2 justify-start font-mono text-xs"
            >
              {formatAddress(wallet.address)}
              {copied ? (
                <CheckCircle className="h-3 w-3 ml-2 text-green-500" />
              ) : (
                <Copy className="h-3 w-3 ml-2" />
              )}
            </Button>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Balance
            </label>
            <div className="text-lg font-bold">
              {formatBalance(wallet.balance)} ETH
            </div>
          </div>
        </div>

        {/* Network Status */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Network Status
          </label>
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border">
            <div className="flex items-center space-x-2">
              <div className={cn(
                'w-2 h-2 rounded-full',
                networkStatus?.healthy ? 'bg-green-500' : 'bg-red-500'
              )} />
              <span className="text-sm font-medium">
                {wallet.networkName || 'Unknown Network'}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Block #{networkStatus?.blockNumber?.toLocaleString() || '---'}
            </div>
          </div>
        </div>

        {/* Blockchain Features */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-xs">
              {wallet.blockchainStatus?.secure || '🔒 Secure'}
            </span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-950 rounded-lg">
            <Globe className="h-4 w-4 text-green-600" />
            <span className="text-xs">
              {wallet.blockchainStatus?.verified || '✅ Verified'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// MAIN WALLET CONNECTOR COMPONENT
// ============================================================================

interface WalletConnectorProps {
  className?: string;
  variant?: 'default' | 'compact' | 'minimal';
  showNetworkSelector?: boolean;
  showStatus?: boolean;
  onConnectionChange?: (connected: boolean) => void;
}

const WalletConnector: React.FC<WalletConnectorProps> = ({
  className,
  variant = 'default',
  showNetworkSelector = true,
  showStatus = true,
  onConnectionChange
}) => {
  const { 
    wallet, 
    isConnecting, 
    connectionError, 
    isConnected,
    connectWallet, 
    disconnectWallet,
    clearConnectionError 
  } = useWallet();
  
  const { 
    networkStatus, 
    switchNetwork,
    getNetworkExplorerUrl 
  } = useNetwork();

  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);

  // Effect to handle connection changes
  useEffect(() => {
    onConnectionChange?.(isConnected);
  }, [isConnected, onConnectionChange]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (connectionError) {
      const timer = setTimeout(() => {
        clearConnectionError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [connectionError, clearConnectionError]);

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      const success = await connectWallet();
      if (success) {
        toast({
          title: '🎉 Wallet Connected',
          description: 'Your MetaMask wallet has been successfully connected',
        });
      }
    } catch (error) {
      toast({
        title: '❌ Connection Failed',
        description: error instanceof Error ? error.message : 'Failed to connect wallet',
        variant: 'destructive',
      });
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      toast({
        title: '👋 Wallet Disconnected',
        description: 'Your wallet has been safely disconnected',
      });
    } catch (error) {
      toast({
        title: '❌ Disconnection Error',
        description: error instanceof Error ? error.message : 'Failed to disconnect wallet',
        variant: 'destructive',
      });
    }
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        {isConnected ? (
          <SimpleDropdown
            trigger={
              <Button variant="outline" size="sm">
                <Wallet className="h-4 w-4 mr-2" />
                {wallet?.address?.slice(0, 6)}...{wallet?.address?.slice(-4)}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            }
          >
            <div className="p-2">
              <div className="text-sm font-semibold p-2 border-b mb-2">Wallet Menu</div>
              <button className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-left">
                <User className="h-4 w-4 mr-2" />
                View Profile
              </button>
              <button className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-left">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </button>
              <div className="border-t my-2" />
              <button onClick={handleDisconnect} className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-left text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </button>
            </div>
          </SimpleDropdown>
        ) : (
          <Button onClick={handleConnect} disabled={isConnecting} size="sm">
            {isConnecting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wallet className="h-4 w-4 mr-2" />
            )}
            Connect Wallet
          </Button>
        )}
        {showNetworkSelector && (
          <NetworkSelector
            currentNetwork={wallet?.networkName}
            onNetworkSwitch={switchNetwork}
            isLoading={isConnecting}
          />
        )}
      </div>
    );
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={className}>
        {isConnected ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        ) : (
          <Button onClick={handleConnect} disabled={isConnecting} size="sm" variant="outline">
            {isConnecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    );
  }

  // Default variant - Full featured
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('space-y-6', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Wallet className="h-6 w-6" />
            <span>Blockchain Wallet</span>
          </h2>
          <p className="text-muted-foreground">
            Connect your MetaMask wallet to access digital identity features
          </p>
        </div>
        {showNetworkSelector && isConnected && (
          <NetworkSelector
            currentNetwork={wallet?.networkName}
            onNetworkSwitch={switchNetwork}
            isLoading={isConnecting}
          />
        )}
      </div>

      {/* Connection Error Alert */}
      <AnimatePresence>
        {connectionError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{connectionError}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearConnectionError}
                  className="text-destructive hover:text-destructive-foreground"
                >
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Connection Interface */}
      <div className="grid gap-6">
        {/* Connection Status */}
        {showStatus && (
          <WalletStatus
            wallet={wallet}
            networkStatus={networkStatus}
            isLoading={isConnecting}
          />
        )}

        {/* Connection Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>
              Manage your blockchain wallet connection and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isConnected ? (
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  size="lg"
                  className="w-full h-12"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Connecting to MetaMask...
                    </>
                  ) : (
                    <>
                      <Wallet className="h-5 w-5 mr-2" />
                      Connect MetaMask Wallet
                    </>
                  )}
                </Button>
                
                {/* Instructions */}
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    🦊 New to MetaMask?
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    MetaMask is a crypto wallet that lets you interact with blockchain applications.
                  </p>
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Install MetaMask
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDetails(!showDetails)}
                    className="h-10"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const explorerUrl = getNetworkExplorerUrl(undefined, wallet?.address);
                      if (explorerUrl !== '/') {
                        window.open(explorerUrl, '_blank');
                      }
                    }}
                    className="h-10"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Explorer
                  </Button>
                </div>
                <Button
                  onClick={handleDisconnect}
                  variant="destructive"
                  className="w-full h-10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect Wallet
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Network Health Status */}
        {isConnected && networkStatus && (
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5" />
                      <span>Network Health</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Latency</label>
                        <div className="flex items-center space-x-2">
                          <Progress value={Math.max(100 - (networkStatus.latency / 50), 0)} className="flex-1" />
                          <span className="text-sm font-mono">{networkStatus.latency}ms</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Gas Price</label>
                        <div className="text-lg font-mono">
                          {parseFloat(networkStatus.gasPrice).toFixed(2)} Gwei
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">Last Update</span>
                      <span className="text-sm font-mono">
                        {new Date(networkStatus.lastUpdate).toLocaleTimeString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default WalletConnector;