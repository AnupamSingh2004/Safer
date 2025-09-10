/**
 * Smart Tourist Safety System - Real-time Updates Hook
 * React hook for managing real-time WebSocket connections and updates
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { createWebSocketService } from '@/services/websocket';
import type { WebSocketMessage, ConnectionStatus, Subscription } from '@/services/websocket';

// ============================================================================
// REAL-TIME HOOK INTERFACES
// ============================================================================

export interface RealTimeOptions {
  autoConnect?: boolean;
  enableReconnect?: boolean;
  channels?: string[];
  debug?: boolean;
}

export interface RealTimeState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  lastMessage: WebSocketMessage | null;
  messageCount: number;
  latency: number;
  reconnectAttempts: number;
}

export interface RealTimeActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  subscribe: (channel: string, callback: (data: any) => void) => string;
  unsubscribe: (subscriptionId: string) => void;
  unsubscribeFromChannel: (channel: string) => void;
  send: (message: WebSocketMessage) => boolean;
  clearError: () => void;
}

// ============================================================================
// MAIN REAL-TIME HOOK
// ============================================================================

export function useRealTime(options: RealTimeOptions = {}): RealTimeState & RealTimeActions {
  const {
    autoConnect = true,
    enableReconnect = true,
    channels = [],
    debug = false
  } = options;

  // State
  const [state, setState] = useState<RealTimeState>({
    connected: false,
    connecting: false,
    error: null,
    lastMessage: null,
    messageCount: 0,
    latency: 0,
    reconnectAttempts: 0
  });

  // Refs
  const wsServiceRef = useRef(createWebSocketService());
  const subscriptionsRef = useRef<Map<string, string>>(new Map());
  const mountedRef = useRef(true);

  // ============================================================================
  // WEBSOCKET EVENT HANDLERS
  // ============================================================================

  const handleConnected = useCallback(() => {
    if (!mountedRef.current) return;
    
    setState(prev => ({
      ...prev,
      connected: true,
      connecting: false,
      error: null,
      reconnectAttempts: 0
    }));

    if (debug) console.log('[RealTime] Connected to WebSocket');
  }, [debug]);

  const handleDisconnected = useCallback(() => {
    if (!mountedRef.current) return;
    
    setState(prev => ({
      ...prev,
      connected: false,
      connecting: false
    }));

    if (debug) console.log('[RealTime] Disconnected from WebSocket');
  }, [debug]);

  const handleError = useCallback((error: Error) => {
    if (!mountedRef.current) return;
    
    setState(prev => ({
      ...prev,
      error: error.message,
      connecting: false
    }));

    if (debug) console.error('[RealTime] WebSocket error:', error);
  }, [debug]);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    if (!mountedRef.current) return;
    
    setState(prev => ({
      ...prev,
      lastMessage: message,
      messageCount: prev.messageCount + 1
    }));

    if (debug) console.log('[RealTime] Received message:', message.type);
  }, [debug]);

  const handleReconnectFailed = useCallback(() => {
    if (!mountedRef.current) return;
    
    setState(prev => ({
      ...prev,
      error: 'Failed to reconnect after maximum attempts',
      connected: false,
      connecting: false
    }));

    if (debug) console.error('[RealTime] Reconnection failed');
  }, [debug]);

  // ============================================================================
  // SETUP AND CLEANUP
  // ============================================================================

  useEffect(() => {
    const wsService = wsServiceRef.current;

    // Set up event listeners
    wsService.on('connected', handleConnected);
    wsService.on('disconnected', handleDisconnected);
    wsService.on('error', handleError);
    wsService.on('message', handleMessage);
    wsService.on('reconnectFailed', handleReconnectFailed);

    // Auto-connect if enabled
    if (autoConnect) {
      setState(prev => ({ ...prev, connecting: true }));
      wsService.connect().catch((error) => {
        if (mountedRef.current) {
          setState(prev => ({
            ...prev,
            error: error.message,
            connecting: false
          }));
        }
      });
    }

    // Subscribe to initial channels
    channels.forEach(channel => {
      const subscriptionId = wsService.subscribe(channel, () => {});
      subscriptionsRef.current.set(channel, subscriptionId);
    });

    // Cleanup on unmount
    return () => {
      mountedRef.current = false;
      
      // Remove event listeners
      wsService.off('connected', handleConnected);
      wsService.off('disconnected', handleDisconnected);
      wsService.off('error', handleError);
      wsService.off('message', handleMessage);
      wsService.off('reconnectFailed', handleReconnectFailed);

      // Clean up subscriptions
      subscriptionsRef.current.forEach(subscriptionId => {
        wsService.unsubscribe(subscriptionId);
      });
      subscriptionsRef.current.clear();

      // Disconnect if this was the last component using the service
      wsService.disconnect();
    };
  }, [autoConnect, channels, handleConnected, handleDisconnected, handleError, handleMessage, handleReconnectFailed]);

  // Update connection status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (!mountedRef.current) return;
      
      const status = wsServiceRef.current.getConnectionStatus();
      setState(prev => ({
        ...prev,
        latency: status.latency,
        reconnectAttempts: status.reconnectAttempts
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const connect = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, connecting: true, error: null }));
    
    try {
      await wsServiceRef.current.connect();
    } catch (error) {
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Connection failed',
          connecting: false
        }));
      }
      throw error;
    }
  }, []);

  const disconnect = useCallback((): void => {
    wsServiceRef.current.disconnect();
  }, []);

  const subscribe = useCallback((channel: string, callback: (data: any) => void): string => {
    const subscriptionId = wsServiceRef.current.subscribe(channel, callback);
    subscriptionsRef.current.set(`${channel}-${subscriptionId}`, subscriptionId);
    return subscriptionId;
  }, []);

  const unsubscribe = useCallback((subscriptionId: string): void => {
    wsServiceRef.current.unsubscribe(subscriptionId);
    
    // Remove from local tracking
    for (const [key, id] of subscriptionsRef.current) {
      if (id === subscriptionId) {
        subscriptionsRef.current.delete(key);
        break;
      }
    }
  }, []);

  const unsubscribeFromChannel = useCallback((channel: string): void => {
    wsServiceRef.current.unsubscribeFromChannel(channel);
    
    // Remove from local tracking
    const keysToDelete = Array.from(subscriptionsRef.current.keys())
      .filter(key => key.startsWith(channel));
    
    keysToDelete.forEach(key => {
      subscriptionsRef.current.delete(key);
    });
  }, []);

  const send = useCallback((message: WebSocketMessage): boolean => {
    return wsServiceRef.current.send(message);
  }, []);

  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // ============================================================================
  // RETURN HOOK INTERFACE
  // ============================================================================

  return {
    // State
    ...state,
    
    // Actions
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    unsubscribeFromChannel,
    send,
    clearError
  };
}

// ============================================================================
// SPECIALIZED REAL-TIME HOOKS
// ============================================================================

/**
 * Hook for real-time alert updates
 */
export function useRealTimeAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [newAlert, setNewAlert] = useState<any | null>(null);

  const realTime = useRealTime({
    autoConnect: true,
    channels: ['alerts']
  });

  useEffect(() => {
    if (!realTime.connected) return;

    const subscriptionId = realTime.subscribe('alerts', (alertData) => {
      setNewAlert(alertData);
      setAlerts(prev => [alertData, ...prev.slice(0, 49)]); // Keep last 50 alerts
    });

    return () => {
      realTime.unsubscribe(subscriptionId);
    };
  }, [realTime.connected]);

  const markAlertAsRead = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
    setNewAlert(null);
  }, []);

  return {
    alerts,
    newAlert,
    markAlertAsRead,
    connected: realTime.connected,
    error: realTime.error
  };
}

/**
 * Hook for real-time tourist updates
 */
export function useRealTimeTourists() {
  const [touristUpdates, setTouristUpdates] = useState<any[]>([]);
  const [activeTourists, setActiveTourists] = useState<number>(0);

  const realTime = useRealTime({
    autoConnect: true,
    channels: ['tourists']
  });

  useEffect(() => {
    if (!realTime.connected) return;

    const subscriptionId = realTime.subscribe('tourists', (touristData) => {
      setTouristUpdates(prev => [touristData, ...prev.slice(0, 29)]); // Keep last 30 updates
      
      // Update active count based on action
      if (touristData.action === 'checkin') {
        setActiveTourists(prev => prev + 1);
      } else if (touristData.action === 'checkout') {
        setActiveTourists(prev => Math.max(0, prev - 1));
      }
    });

    return () => {
      realTime.unsubscribe(subscriptionId);
    };
  }, [realTime.connected]);

  return {
    touristUpdates,
    activeTourists,
    connected: realTime.connected,
    error: realTime.error
  };
}

/**
 * Hook for real-time incident updates
 */
export function useRealTimeIncidents() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [criticalIncidents, setCriticalIncidents] = useState<any[]>([]);

  const realTime = useRealTime({
    autoConnect: true,
    channels: ['incidents']
  });

  useEffect(() => {
    if (!realTime.connected) return;

    const subscriptionId = realTime.subscribe('incidents', (incidentData) => {
      setIncidents(prev => [incidentData, ...prev.slice(0, 49)]); // Keep last 50 incidents
      
      // Track critical incidents separately
      if (incidentData.severity === 'critical') {
        setCriticalIncidents(prev => [incidentData, ...prev.slice(0, 9)]); // Keep last 10 critical
      }
    });

    return () => {
      realTime.unsubscribe(subscriptionId);
    };
  }, [realTime.connected]);

  return {
    incidents,
    criticalIncidents,
    connected: realTime.connected,
    error: realTime.error
  };
}

/**
 * Hook for real-time system health updates
 */
export function useRealTimeSystemHealth() {
  const [systemHealth, setSystemHealth] = useState<any>({
    overall: 'healthy',
    services: [],
    lastUpdate: null
  });

  const realTime = useRealTime({
    autoConnect: true,
    channels: ['system']
  });

  useEffect(() => {
    if (!realTime.connected) return;

    const subscriptionId = realTime.subscribe('system', (systemData) => {
      setSystemHealth((prev: any) => ({
        ...prev,
        ...systemData,
        lastUpdate: new Date().toISOString()
      }));
    });

    return () => {
      realTime.unsubscribe(subscriptionId);
    };
  }, [realTime.connected]);

  return {
    systemHealth,
    connected: realTime.connected,
    error: realTime.error
  };
}

/**
 * Hook for real-time location tracking
 */
export function useRealTimeLocations() {
  const [locationUpdates, setLocationUpdates] = useState<any[]>([]);
  const [hotspots, setHotspots] = useState<any[]>([]);

  const realTime = useRealTime({
    autoConnect: true,
    channels: ['locations']
  });

  useEffect(() => {
    if (!realTime.connected) return;

    const subscriptionId = realTime.subscribe('locations', (locationData) => {
      setLocationUpdates(prev => [locationData, ...prev.slice(0, 99)]); // Keep last 100 updates
      
      // Process hotspots (areas with high activity)
      // This is a simplified implementation
      if (locationData.touristCount > 50) {
        setHotspots(prev => {
          const existingIndex = prev.findIndex(spot => spot.location === locationData.location);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = locationData;
            return updated;
          } else {
            return [locationData, ...prev.slice(0, 9)]; // Keep top 10 hotspots
          }
        });
      }
    });

    return () => {
      realTime.unsubscribe(subscriptionId);
    };
  }, [realTime.connected]);

  return {
    locationUpdates,
    hotspots,
    connected: realTime.connected,
    error: realTime.error
  };
}

/**
 * Hook that combines multiple real-time data sources
 */
export function useRealTimeDashboard() {
  const alerts = useRealTimeAlerts();
  const tourists = useRealTimeTourists();
  const incidents = useRealTimeIncidents();
  const systemHealth = useRealTimeSystemHealth();
  const locations = useRealTimeLocations();

  const isAnyConnected = alerts.connected || tourists.connected || 
                        incidents.connected || systemHealth.connected || 
                        locations.connected;

  const hasErrors = !!(alerts.error || tourists.error || incidents.error || 
                      systemHealth.error || locations.error);

  return {
    alerts: alerts.alerts,
    newAlert: alerts.newAlert,
    touristUpdates: tourists.touristUpdates,
    activeTourists: tourists.activeTourists,
    incidents: incidents.incidents,
    criticalIncidents: incidents.criticalIncidents,
    systemHealth: systemHealth.systemHealth,
    locationUpdates: locations.locationUpdates,
    hotspots: locations.hotspots,
    connected: isAnyConnected,
    hasErrors,
    markAlertAsRead: alerts.markAlertAsRead
  };
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook for connection status monitoring
 */
export function useConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    connecting: false,
    error: null,
    lastConnected: null,
    reconnectAttempts: 0,
    latency: 0
  });

  const wsService = createWebSocketService();

  useEffect(() => {
    const updateStatus = () => {
      setStatus(wsService.getConnectionStatus());
    };

    // Initial status
    updateStatus();

    // Update on events
    wsService.on('connected', updateStatus);
    wsService.on('disconnected', updateStatus);
    wsService.on('error', updateStatus);

    // Periodic updates
    const interval = setInterval(updateStatus, 1000);

    return () => {
      wsService.off('connected', updateStatus);
      wsService.off('disconnected', updateStatus);
      wsService.off('error', updateStatus);
      clearInterval(interval);
    };
  }, []);

  return status;
}

export default useRealTime;
