/**
 * Smart Tourist Safety System - useWebSocket Hook
 * Comprehensive React hook for real-time WebSocket integration
 * 
 * 🚀 REAL-TIME INTEGRATION - Complete WebSocket React integration
 * 🔄 AUTO-RECONNECTION - Intelligent connection management
 * 🚨 ALERT NOTIFICATIONS - Real-time emergency alert handling
 * 📊 STATUS MONITORING - Connection status and health tracking
 * 🎯 EVENT HANDLING - Streamlined event subscription system
 * 🔒 SECURE AUTHENTICATION - JWT-based authentication flow
 */

import { useEffect, useCallback, useRef, useState, useMemo } from 'react';
import { webSocketService, WebSocketService } from '@/services/websocket-service';
import type {
  Alert,
  AlertType,
  AlertSeverity,
  EmergencyBroadcast,
} from '@/types/alert';
import type {
  Tourist,
  TouristLocationUpdate,
  EmergencyRequest,
} from '@/types/tourist';
import type {
  RealTimeMetrics,
  TimeSeriesData,
} from '@/types/analytics';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface WebSocketHookState {
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  isAuthenticated: boolean;
  connectionError: string | null;
  latency: number;
  reconnectAttempts: number;
  lastConnected: Date | null;
  lastDisconnected: Date | null;
}

export interface WebSocketConnectionConfig {
  autoConnect?: boolean;
  enableHeartbeat?: boolean;
  enableNotifications?: boolean;
  enableLocationTracking?: boolean;
  enableAnalytics?: boolean;
  reconnectOnVisibilityChange?: boolean;
}

export interface NotificationConfig {
  showEmergencyAlerts?: boolean;
  showGeneralAlerts?: boolean;
  showLocationUpdates?: boolean;
  showSystemNotifications?: boolean;
  playAlertSounds?: boolean;
  vibrationEnabled?: boolean;
}

export interface LocationTrackingConfig {
  enableGPS?: boolean;
  enableGeofencing?: boolean;
  trackingInterval?: number; // milliseconds
  highAccuracy?: boolean;
  enableBackground?: boolean;
}

export interface WebSocketEvents {
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onReconnect?: (attemptNumber: number) => void;
  onAuthenticated?: (data: { userId: string; userType: string }) => void;
  onAuthenticationError?: (error: string) => void;
  onAlert?: (alert: Alert) => void;
  onEmergencyAlert?: (emergency: EmergencyRequest) => void;
  onEmergencyBroadcast?: (broadcast: EmergencyBroadcast) => void;
  onLocationUpdate?: (location: TouristLocationUpdate) => void;
  onAnalyticsUpdate?: (metrics: RealTimeMetrics) => void;
  onSystemNotification?: (notification: any) => void;
  onError?: (error: Error) => void;
}

export interface WebSocketActions {
  connect: (authToken: string, userId: string, userType: 'tourist' | 'authority' | 'admin') => Promise<void>;
  disconnect: () => void;
  sendLocationUpdate: (location: TouristLocationUpdate) => void;
  sendEmergencyAlert: (emergency: EmergencyRequest) => void;
  sendCheckIn: (checkIn: any) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string, resolution: string) => void;
  broadcastEmergency: (broadcast: Omit<EmergencyBroadcast, 'id' | 'createdAt' | 'deliveryStats'>) => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  ping: () => Promise<number>;
}

export interface UseWebSocketReturn {
  state: WebSocketHookState;
  actions: WebSocketActions;
  events: {
    subscribe: <T>(event: string, handler: (data: T) => void) => () => void;
    subscribeToAlerts: (handler: (alert: Alert) => void) => () => void;
    subscribeToEmergencies: (handler: (emergency: EmergencyRequest) => void) => () => void;
    subscribeToLocationUpdates: (handler: (location: TouristLocationUpdate) => void) => () => void;
    subscribeToAnalytics: (handler: (metrics: RealTimeMetrics) => void) => () => void;
  };
  status: {
    getConnectionStats: () => any;
    isHealthy: () => boolean;
    getQueueSize: () => number;
  };
}

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Comprehensive WebSocket hook for real-time communication
 */
export function useWebSocket(
  config: WebSocketConnectionConfig = {},
  events: WebSocketEvents = {},
  notificationConfig: NotificationConfig = {},
  locationConfig: LocationTrackingConfig = {}
): UseWebSocketReturn {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [state, setState] = useState<WebSocketHookState>({
    isConnected: false,
    isConnecting: false,
    isReconnecting: false,
    isAuthenticated: false,
    connectionError: null,
    latency: 0,
    reconnectAttempts: 0,
    lastConnected: null,
    lastDisconnected: null,
  });

  const [locationTracking, setLocationTracking] = useState(false);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    title: string;
    body: string;
    type: 'info' | 'warning' | 'error';
    timestamp: Date;
  }>>([]);
  
  // Refs for cleanup and persistence
  const eventHandlersRef = useRef<Map<string, Function>>(new Map());
  const locationWatchRef = useRef<number | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // CONFIGURATION DEFAULTS
  // ============================================================================
  
  const connectionConfig = useMemo(() => ({
    autoConnect: true,
    enableHeartbeat: true,
    enableNotifications: true,
    enableLocationTracking: false,
    enableAnalytics: true,
    reconnectOnVisibilityChange: true,
    ...config,
  }), [config]);

  const notifConfig = useMemo(() => ({
    showEmergencyAlerts: true,
    showGeneralAlerts: true,
    showLocationUpdates: false,
    showSystemNotifications: true,
    playAlertSounds: true,
    vibrationEnabled: true,
    ...notificationConfig,
  }), [notificationConfig]);

  const locationTrackingConfig = useMemo(() => ({
    enableGPS: true,
    enableGeofencing: true,
    trackingInterval: 30000, // 30 seconds
    highAccuracy: true,
    enableBackground: false,
    ...locationConfig,
  }), [locationConfig]);

  // ============================================================================
  // CONNECTION MANAGEMENT
  // ============================================================================

  const connect = useCallback(async (
    authToken: string, 
    userId: string, 
    userType: 'tourist' | 'authority' | 'admin'
  ): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isConnecting: true, connectionError: null }));
      
      await webSocketService.connect(authToken, userId, userType);
      
      setState(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        isAuthenticated: true,
        lastConnected: new Date(),
        reconnectAttempts: 0,
      }));

      // Start location tracking if enabled
      if (connectionConfig.enableLocationTracking && userType === 'tourist') {
        startLocationTracking();
      }

      // Start heartbeat monitoring
      if (connectionConfig.enableHeartbeat) {
        startHeartbeat();
      }

      events.onConnect?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      setState(prev => ({
        ...prev,
        isConnecting: false,
        connectionError: errorMessage,
      }));
      
      events.onAuthenticationError?.(errorMessage);
      throw error;
    }
  }, [connectionConfig, events, locationTrackingConfig]);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    stopLocationTracking();
    stopHeartbeat();
    
    setState(prev => ({
      ...prev,
      isConnected: false,
      isAuthenticated: false,
      lastDisconnected: new Date(),
    }));

    events.onDisconnect?.('manual');
  }, [events]);

  // ============================================================================
  // EVENT SUBSCRIPTION SYSTEM
  // ============================================================================

  const subscribe = useCallback(<T>(event: string, handler: (data: T) => void) => {
    webSocketService.on(event as any, handler as any);
    eventHandlersRef.current.set(event, handler);
    
    return () => {
      webSocketService.off(event as any, handler as any);
      eventHandlersRef.current.delete(event);
    };
  }, []);

  const subscribeToAlerts = useCallback((handler: (alert: Alert) => void) => {
    const unsubscribeCreated = subscribe('alert_created', (alert: Alert) => {
      handler(alert);
      if (notifConfig.showGeneralAlerts) {
        showNotification('New Alert', alert.title, 'info');
      }
    });

    const unsubscribeUpdated = subscribe('alert_updated', handler);
    
    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
    };
  }, [subscribe, notifConfig]);

  const subscribeToEmergencies = useCallback((handler: (emergency: EmergencyRequest) => void) => {
    const unsubscribeAlert = subscribe('emergency_alert', (emergency: EmergencyRequest) => {
      handler(emergency);
      if (notifConfig.showEmergencyAlerts) {
        showNotification('🚨 EMERGENCY ALERT', emergency.description || 'Emergency situation detected', 'error');
        if (notifConfig.playAlertSounds) {
          playAlertSound();
        }
        if (notifConfig.vibrationEnabled) {
          vibrate([200, 100, 200]);
        }
      }
    });

    const unsubscribeBroadcast = subscribe('emergency_broadcast', (broadcast: EmergencyBroadcast) => {
      if (notifConfig.showEmergencyAlerts) {
        showNotification('📢 EMERGENCY BROADCAST', broadcast.message, 'error');
        if (notifConfig.playAlertSounds) {
          playAlertSound();
        }
      }
    });
    
    return () => {
      unsubscribeAlert();
      unsubscribeBroadcast();
    };
  }, [subscribe, notifConfig]);

  const subscribeToLocationUpdates = useCallback((handler: (location: TouristLocationUpdate) => void) => {
    return subscribe('tourist_location_update', (location: TouristLocationUpdate) => {
      handler(location);
      if (notifConfig.showLocationUpdates) {
        console.log('📍 Location update received:', location);
      }
    });
  }, [subscribe, notifConfig]);

  const subscribeToAnalytics = useCallback((handler: (metrics: RealTimeMetrics) => void) => {
    return subscribe('analytics_update', handler);
  }, [subscribe]);

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const sendLocationUpdate = useCallback((location: TouristLocationUpdate) => {
    webSocketService.sendLocationUpdate(location);
  }, []);

  const sendEmergencyAlert = useCallback((emergency: EmergencyRequest) => {
    webSocketService.sendEmergencyAlert(emergency);
    if (notifConfig.showEmergencyAlerts) {
      showNotification('🆘 Emergency Alert Sent', 'Your emergency alert has been sent to authorities', 'warning');
    }
  }, [notifConfig]);

  const sendCheckIn = useCallback((checkIn: any) => {
    webSocketService.sendTouristCheckIn(checkIn);
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    webSocketService.acknowledgeAlert(alertId);
  }, []);

  const resolveAlert = useCallback((alertId: string, resolution: string) => {
    webSocketService.resolveAlert(alertId, resolution);
  }, []);

  const broadcastEmergency = useCallback((broadcast: Omit<EmergencyBroadcast, 'id' | 'createdAt' | 'deliveryStats'>) => {
    webSocketService.broadcastEmergency(broadcast);
  }, []);

  const joinRoom = useCallback((room: string) => {
    webSocketService.joinRoom(room);
  }, []);

  const leaveRoom = useCallback((room: string) => {
    webSocketService.leaveRoom(room);
  }, []);

  const ping = useCallback(() => {
    return webSocketService.ping();
  }, []);

  // ============================================================================
  // LOCATION TRACKING
  // ============================================================================

  const startLocationTracking = useCallback(() => {
    if (!navigator.geolocation || locationTracking) return;

    const options: PositionOptions = {
      enableHighAccuracy: locationTrackingConfig.highAccuracy,
      timeout: 10000,
      maximumAge: 5000,
    };

    const successCallback = (position: GeolocationPosition) => {
      const locationUpdate: TouristLocationUpdate = {
        touristId: webSocketService.getConnectionStats().userId || '',
        location: {
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined,
          },
          timestamp: new Date().toISOString(),
          source: 'gps',
        },
        deviceId: 'browser-device', // This should come from device registration
      };

      sendLocationUpdate(locationUpdate);
    };

    const errorCallback = (error: GeolocationPositionError) => {
      console.error('Location tracking error:', error);
      showNotification('Location Error', 'Failed to get current location', 'warning');
    };

    locationWatchRef.current = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      options
    );

    setLocationTracking(true);
    console.log('📍 Location tracking started');
  }, [locationTracking, locationTrackingConfig, sendLocationUpdate]);

  const stopLocationTracking = useCallback(() => {
    if (locationWatchRef.current) {
      navigator.geolocation.clearWatch(locationWatchRef.current);
      locationWatchRef.current = null;
    }
    setLocationTracking(false);
    console.log('📍 Location tracking stopped');
  }, []);

  // ============================================================================
  // HEARTBEAT & HEALTH MONITORING
  // ============================================================================

  const startHeartbeat = useCallback(() => {
    if (heartbeatRef.current) return;

    heartbeatRef.current = setInterval(async () => {
      try {
        const latency = await ping();
        setState(prev => ({ ...prev, latency }));
      } catch (error) {
        console.warn('Heartbeat failed:', error);
      }
    }, 30000); // Every 30 seconds

    console.log('💓 Heartbeat monitoring started');
  }, [ping]);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================

  const showNotification = useCallback((title: string, body: string, type: 'info' | 'warning' | 'error' = 'info') => {
    if (!connectionConfig.enableNotifications) return;

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `sts-${type}`,
        requireInteraction: type === 'error',
      });
    }

    // Add to internal notifications
    const notification = {
      id: Date.now().toString(),
      title,
      body,
      type,
      timestamp: new Date(),
    };

    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
  }, [connectionConfig]);

  const playAlertSound = useCallback(() => {
    if (!notifConfig.playAlertSounds) return;

    try {
      const audio = new Audio('/sounds/alert.mp3');
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Failed to play alert sound:', error);
    }
  }, [notifConfig]);

  const vibrate = useCallback((pattern: number[]) => {
    if (!notifConfig.vibrationEnabled || !navigator.vibrate) return;

    navigator.vibrate(pattern);
  }, [notifConfig]);

  // ============================================================================
  // STATUS & HEALTH
  // ============================================================================

  const getConnectionStats = useCallback(() => {
    return webSocketService.getConnectionStats();
  }, []);

  const isHealthy = useCallback(() => {
    return state.isConnected && state.isAuthenticated && !state.connectionError;
  }, [state]);

  const getQueueSize = useCallback(() => {
    // This would need to be implemented in the WebSocketService
    return 0;
  }, []);

  // ============================================================================
  // EFFECT HOOKS
  // ============================================================================

  // Setup WebSocket event handlers
  useEffect(() => {
    const handleConnect = () => {
      setState(prev => ({ 
        ...prev, 
        isConnected: true, 
        isConnecting: false,
        lastConnected: new Date(),
        connectionError: null,
      }));
      events.onConnect?.();
    };

    const handleDisconnect = (reason: string) => {
      setState(prev => ({ 
        ...prev, 
        isConnected: false,
        isAuthenticated: false,
        lastDisconnected: new Date(),
      }));
      events.onDisconnect?.(reason);
    };

    const handleReconnect = (attemptNumber: number) => {
      setState(prev => ({ 
        ...prev, 
        isReconnecting: false,
        reconnectAttempts: attemptNumber,
      }));
      events.onReconnect?.(attemptNumber);
    };

    const handleAuthenticated = (data: { userId: string; userType: string }) => {
      setState(prev => ({ ...prev, isAuthenticated: true }));
      events.onAuthenticated?.(data);
    };

    const handleAuthError = (error: string) => {
      setState(prev => ({ 
        ...prev, 
        isAuthenticated: false,
        connectionError: error,
      }));
      events.onAuthenticationError?.(error);
    };

    // Subscribe to WebSocket events
    webSocketService.on('connect', handleConnect);
    webSocketService.on('disconnect', handleDisconnect);
    webSocketService.on('reconnect', handleReconnect);
    webSocketService.on('authenticated', handleAuthenticated);
    webSocketService.on('authentication_error', handleAuthError);

    return () => {
      webSocketService.off('connect', handleConnect);
      webSocketService.off('disconnect', handleDisconnect);
      webSocketService.off('reconnect', handleReconnect);
      webSocketService.off('authenticated', handleAuthenticated);
      webSocketService.off('authentication_error', handleAuthError);
    };
  }, [events]);

  // Handle page visibility changes
  useEffect(() => {
    if (!connectionConfig.reconnectOnVisibilityChange) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !state.isConnected) {
        console.log('Page became visible - checking connection');
        // Could trigger reconnection logic here
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [connectionConfig, state.isConnected]);

  // Request notification permission
  useEffect(() => {
    if (connectionConfig.enableNotifications && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [connectionConfig]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLocationTracking();
      stopHeartbeat();
      eventHandlersRef.current.clear();
    };
  }, [stopLocationTracking, stopHeartbeat]);

  // ============================================================================
  // RETURN HOOK API
  // ============================================================================

  return {
    state,
    actions: {
      connect,
      disconnect,
      sendLocationUpdate,
      sendEmergencyAlert,
      sendCheckIn,
      acknowledgeAlert,
      resolveAlert,
      broadcastEmergency,
      joinRoom,
      leaveRoom,
      ping,
    },
    events: {
      subscribe,
      subscribeToAlerts,
      subscribeToEmergencies,
      subscribeToLocationUpdates,
      subscribeToAnalytics,
    },
    status: {
      getConnectionStats,
      isHealthy,
      getQueueSize,
    },
  };
}

// ============================================================================
// SPECIALIZED HOOKS
// ============================================================================

/**
 * Hook specifically for tourist real-time features
 */
export function useTouristWebSocket(
  authToken: string,
  userId: string,
  config: WebSocketConnectionConfig & LocationTrackingConfig = {}
) {
  const webSocket = useWebSocket(
    { ...config, enableLocationTracking: true },
    {},
    { showEmergencyAlerts: true, playAlertSounds: true },
    config
  );

  // Auto-connect for tourists
  useEffect(() => {
    if (authToken && userId && !webSocket.state.isConnected) {
      webSocket.actions.connect(authToken, userId, 'tourist');
    }
  }, [authToken, userId, webSocket.state.isConnected, webSocket.actions]);

  return webSocket;
}

/**
 * Hook specifically for authority dashboard features
 */
export function useAuthorityWebSocket(
  authToken: string,
  userId: string,
  config: WebSocketConnectionConfig = {}
) {
  const webSocket = useWebSocket(
    { ...config, enableAnalytics: true },
    {},
    { showEmergencyAlerts: true, showSystemNotifications: true }
  );

  // Auto-connect for authorities
  useEffect(() => {
    if (authToken && userId && !webSocket.state.isConnected) {
      webSocket.actions.connect(authToken, userId, 'authority');
    }
  }, [authToken, userId, webSocket.state.isConnected, webSocket.actions]);

  return webSocket;
}

/**
 * Hook for emergency alerts only
 */
export function useEmergencyAlerts(onEmergency?: (emergency: EmergencyRequest) => void) {
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>([]);

  const handleEmergency = useCallback((emergency: EmergencyRequest) => {
    setEmergencies(prev => [emergency, ...prev]);
    onEmergency?.(emergency);
  }, [onEmergency]);

  useEffect(() => {
    return webSocketService.on('emergency_alert', handleEmergency);
  }, [handleEmergency]);

  return {
    emergencies,
    clearEmergencies: () => setEmergencies([]),
  };
}

/**
 * Hook for connection status monitoring
 */
export function useWebSocketStatus() {
  const [status, setStatus] = useState<WebSocketHookState>({
    isConnected: false,
    isConnecting: false,
    isReconnecting: false,
    isAuthenticated: false,
    connectionError: null,
    latency: 0,
    reconnectAttempts: 0,
    lastConnected: null,
    lastDisconnected: null,
  });

  useEffect(() => {
    const updateStatus = () => {
      const stats = webSocketService.getConnectionStats();
      setStatus({
        isConnected: stats.isConnected,
        isConnecting: false,
        isReconnecting: false,
        isAuthenticated: stats.isConnected,
        connectionError: null,
        latency: 0,
        reconnectAttempts: stats.reconnectAttempts,
        lastConnected: stats.isConnected ? new Date() : null,
        lastDisconnected: !stats.isConnected ? new Date() : null,
      });
    };

    const interval = setInterval(updateStatus, 1000);
    updateStatus();

    return () => clearInterval(interval);
  }, []);

  return status;
}

// ============================================================================
// EXPORT
// ============================================================================

export default useWebSocket;
