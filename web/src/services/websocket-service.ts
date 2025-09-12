/**
 * Smart Tourist Safety System - WebSocket Service
 * Real-time communication service using Socket.IO
 */

import io from 'socket.io-client';
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
// WEBSOCKET EVENTS
// ============================================================================

export interface WebSocketEvents {
  // Connection Events
  connect: () => void;
  disconnect: (reason: string) => void;
  reconnect: (attemptNumber: number) => void;
  reconnect_error: (error: Error) => void;
  
  // Authentication Events
  authenticated: (data: { userId: string; userType: string }) => void;
  authentication_error: (error: string) => void;
  
  // Tourist Events
  tourist_location_update: (data: TouristLocationUpdate) => void;
  tourist_status_change: (data: { touristId: string; status: string; timestamp: string }) => void;
  tourist_check_in: (data: { touristId: string; location: any; timestamp: string }) => void;
  
  // Alert Events
  alert_created: (alert: Alert) => void;
  alert_updated: (alert: Alert) => void;
  alert_resolved: (data: { alertId: string; resolvedBy: string; timestamp: string }) => void;
  emergency_alert: (data: EmergencyRequest) => void;
  emergency_broadcast: (broadcast: EmergencyBroadcast) => void;
  
  // Analytics Events
  analytics_update: (metrics: RealTimeMetrics) => void;
  metrics_update: (data: TimeSeriesData[]) => void;
  dashboard_update: (data: any) => void;
  
  // Zone Events
  geofence_breach: (data: { touristId: string; zoneId: string; type: 'enter' | 'exit'; timestamp: string }) => void;
  zone_alert: (data: { zoneId: string; alertType: AlertType; severity: AlertSeverity; message: string }) => void;
  
  // System Events
  system_notification: (data: { type: string; message: string; timestamp: string }) => void;
  maintenance_mode: (data: { enabled: boolean; message?: string }) => void;
}

// ============================================================================
// WEBSOCKET SERVICE CLASS
// ============================================================================

export class WebSocketService {
  private static instance: WebSocketService;
  private socket: any = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = parseInt(process.env.WEBSOCKET_RECONNECT_ATTEMPTS || '5');
  private reconnectDelay = parseInt(process.env.WEBSOCKET_RECONNECT_DELAY || '1000');
  private authToken: string | null = null;
  private userId: string | null = null;
  private userType: 'tourist' | 'authority' | 'admin' | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  // ============================================================================
  // CONNECTION MANAGEMENT
  // ============================================================================

  connect(authToken: string, userId: string, userType: 'tourist' | 'authority' | 'admin'): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.authToken = authToken;
        this.userId = userId;
        this.userType = userType;

        const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:8001';
        const wsPath = process.env.WEBSOCKET_PATH || '/socket.io';

        this.socket = io(wsUrl, {
          path: wsPath,
          transports: ['websocket', 'polling'],
          auth: {
            token: authToken,
            userId: userId,
            userType: userType,
          },
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectDelay,
          timeout: parseInt(process.env.WEBSOCKET_AUTH_TIMEOUT || '30000'),
        });

        this.setupEventHandlers();

        this.socket.on('connect', () => {
          console.log('🔗 WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.joinUserRooms();
          resolve();
        });

        this.socket.on('authenticated', (data: { userId: string; userType: string }) => {
          console.log('✅ WebSocket authenticated:', data);
          this.emit('authenticated', data);
        });

        this.socket.on('authentication_error', (error: string) => {
          console.error('❌ WebSocket authentication failed:', error);
          this.emit('authentication_error', error);
          reject(new Error(error));
        });

        this.socket.on('connect_error', (error: Error) => {
          console.error('❌ WebSocket connection error:', error);
          reject(error);
        });

      } catch (error) {
        console.error('❌ WebSocket connection failed:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.authToken = null;
      this.userId = null;
      this.userType = null;
    }
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // ============================================================================
  // EVENT HANDLING
  // ============================================================================

  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection Events
    this.socket.on('disconnect', (reason: string) => {
      console.log('🔌 WebSocket disconnected:', reason);
      this.isConnected = false;
      this.emit('disconnect', reason);
    });

    this.socket.on('reconnect', (attemptNumber: number) => {
      console.log('🔄 WebSocket reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.joinUserRooms();
      this.emit('reconnect', attemptNumber);
    });

    this.socket.on('reconnect_error', (error: Error) => {
      this.reconnectAttempts++;
      console.error(`❌ WebSocket reconnect failed (${this.reconnectAttempts}/${this.maxReconnectAttempts}):`, error);
      this.emit('reconnect_error', error);
    });

    // Tourist Events
    this.socket.on('tourist_location_update', (data: TouristLocationUpdate) => {
      this.emit('tourist_location_update', data);
    });

    this.socket.on('tourist_status_change', (data: { touristId: string; status: string; timestamp: string }) => {
      this.emit('tourist_status_change', data);
    });

    this.socket.on('tourist_check_in', (data: { touristId: string; location: any; timestamp: string }) => {
      this.emit('tourist_check_in', data);
    });

    // Alert Events
    this.socket.on('alert_created', (alert: Alert) => {
      console.log('🚨 New alert received:', alert.title);
      this.emit('alert_created', alert);
    });

    this.socket.on('alert_updated', (alert: Alert) => {
      this.emit('alert_updated', alert);
    });

    this.socket.on('alert_resolved', (data: any) => {
      this.emit('alert_resolved', data);
    });

    this.socket.on('emergency_alert', (data: EmergencyRequest) => {
      console.log('🆘 Emergency alert received:', data);
      this.emit('emergency_alert', data);
    });

    this.socket.on('emergency_broadcast', (broadcast: EmergencyBroadcast) => {
      console.log('📢 Emergency broadcast received:', broadcast);
      this.emit('emergency_broadcast', broadcast);
    });

    // Analytics Events
    this.socket.on('analytics_update', (metrics: RealTimeMetrics) => {
      this.emit('analytics_update', metrics);
    });

    this.socket.on('metrics_update', (data: TimeSeriesData[]) => {
      this.emit('metrics_update', data);
    });

    this.socket.on('dashboard_update', (data: { type: string; payload: any; timestamp: string }) => {
      this.emit('dashboard_update', data);
    });

    // Zone Events
    this.socket.on('geofence_breach', (data: any) => {
      console.log('🚧 Geofence breach:', data);
      this.emit('geofence_breach', data);
    });

    this.socket.on('zone_alert', (data: any) => {
      this.emit('zone_alert', data);
    });

    // System Events
    this.socket.on('system_notification', (data: any) => {
      this.emit('system_notification', data);
    });

    this.socket.on('maintenance_mode', (data: any) => {
      this.emit('maintenance_mode', data);
    });
  }

  private joinUserRooms(): void {
    if (!this.socket || !this.userId || !this.userType) return;

    const rooms = [];

    // Join user-specific room
    switch (this.userType) {
      case 'tourist':
        rooms.push(`${process.env.WEBSOCKET_TOURIST_ROOM_PREFIX || 'tourist_'}${this.userId}`);
        rooms.push('tourists');
        break;
      case 'authority':
      case 'admin':
        rooms.push(`${process.env.WEBSOCKET_AUTHORITY_ROOM_PREFIX || 'authority_'}${this.userId}`);
        rooms.push('authorities');
        rooms.push(process.env.WEBSOCKET_EMERGENCY_ROOM || 'emergency_broadcast');
        rooms.push(process.env.WEBSOCKET_ANALYTICS_ROOM || 'analytics_updates');
        break;
    }

    rooms.forEach(room => {
      this.socket?.emit('join_room', room);
      console.log(`🏠 Joined room: ${room}`);
    });
  }

  // ============================================================================
  // EVENT LISTENERS
  // ============================================================================

  on<K extends keyof WebSocketEvents>(event: K, listener: WebSocketEvents[K]): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener as Function);
  }

  off<K extends keyof WebSocketEvents>(event: K, listener: WebSocketEvents[K]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener as Function);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit<K extends keyof WebSocketEvents>(event: K, ...args: Parameters<WebSocketEvents[K]>): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(...args);
        } catch (error) {
          console.error(`Error in WebSocket event listener for ${event}:`, error);
        }
      });
    }
  }

  // ============================================================================
  // MESSAGE SENDING
  // ============================================================================

  sendLocationUpdate(locationData: TouristLocationUpdate): void {
    if (!this.isSocketConnected()) {
      console.warn('⚠️ Cannot send location update: WebSocket not connected');
      return;
    }

    this.socket?.emit('location_update', locationData);
  }

  sendEmergencyAlert(emergencyData: EmergencyRequest): void {
    if (!this.isSocketConnected()) {
      console.warn('⚠️ Cannot send emergency alert: WebSocket not connected');
      return;
    }

    console.log('🆘 Sending emergency alert:', emergencyData);
    this.socket?.emit('emergency_alert', emergencyData);
  }

  sendTouristCheckIn(checkInData: { touristId: string; location: any; notes?: string }): void {
    if (!this.isSocketConnected()) {
      console.warn('⚠️ Cannot send check-in: WebSocket not connected');
      return;
    }

    this.socket?.emit('tourist_check_in', {
      ...checkInData,
      timestamp: new Date().toISOString(),
    });
  }

  broadcastEmergency(broadcast: Omit<EmergencyBroadcast, 'id' | 'createdAt' | 'deliveryStats'>): void {
    if (!this.isSocketConnected()) {
      console.warn('⚠️ Cannot broadcast emergency: WebSocket not connected');
      return;
    }

    console.log('📢 Broadcasting emergency:', broadcast);
    this.socket?.emit('emergency_broadcast', broadcast);
  }

  acknowledgeAlert(alertId: string): void {
    if (!this.isSocketConnected()) {
      console.warn('⚠️ Cannot acknowledge alert: WebSocket not connected');
      return;
    }

    this.socket?.emit('acknowledge_alert', { 
      alertId, 
      acknowledgedBy: this.userId,
      timestamp: new Date().toISOString(),
    });
  }

  resolveAlert(alertId: string, resolution: string): void {
    if (!this.isSocketConnected()) {
      console.warn('⚠️ Cannot resolve alert: WebSocket not connected');
      return;
    }

    this.socket?.emit('resolve_alert', { 
      alertId, 
      resolution,
      resolvedBy: this.userId,
      timestamp: new Date().toISOString(),
    });
  }

  // ============================================================================
  // ROOM MANAGEMENT
  // ============================================================================

  joinRoom(room: string): void {
    if (!this.isSocketConnected()) {
      console.warn('⚠️ Cannot join room: WebSocket not connected');
      return;
    }

    this.socket?.emit('join_room', room);
    console.log(`🏠 Joining room: ${room}`);
  }

  leaveRoom(room: string): void {
    if (!this.isSocketConnected()) {
      console.warn('⚠️ Cannot leave room: WebSocket not connected');
      return;
    }

    this.socket?.emit('leave_room', room);
    console.log(`🚪 Leaving room: ${room}`);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  getConnectionStats(): {
    isConnected: boolean;
    reconnectAttempts: number;
    maxReconnectAttempts: number;
    userId: string | null;
    userType: string | null;
  } {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
      userId: this.userId,
      userType: this.userType,
    };
  }

  ping(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.isSocketConnected()) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      const startTime = Date.now();
      
      this.socket?.emit('ping', startTime, (response: number) => {
        const latency = Date.now() - response;
        resolve(latency);
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        reject(new Error('Ping timeout'));
      }, 5000);
    });
  }
}

// ============================================================================
// SINGLETON INSTANCE & HOOKS
// ============================================================================

export const webSocketService = WebSocketService.getInstance();

export const useWebSocket = () => webSocketService;

// ============================================================================
// REACT HOOKS FOR WEBSOCKET EVENTS
// ============================================================================

export const useWebSocketEvent = <K extends keyof WebSocketEvents>(
  event: K,
  handler: WebSocketEvents[K],
  deps: React.DependencyList = []
) => {
  React.useEffect(() => {
    webSocketService.on(event, handler);
    
    return () => {
      webSocketService.off(event, handler);
    };
  }, deps);
};

export const useWebSocketConnection = () => {
  const [connectionState, setConnectionState] = React.useState({
    isConnected: false,
    isConnecting: false,
    error: null as string | null,
  });

  React.useEffect(() => {
    const handleConnect = () => {
      setConnectionState({ isConnected: true, isConnecting: false, error: null });
    };

    const handleDisconnect = (reason: string) => {
      setConnectionState({ isConnected: false, isConnecting: false, error: reason });
    };

    const handleReconnectError = (error: Error) => {
      setConnectionState({ isConnected: false, isConnecting: true, error: error.message });
    };

    webSocketService.on('connect', handleConnect);
    webSocketService.on('disconnect', handleDisconnect);
    webSocketService.on('reconnect_error', handleReconnectError);

    // Initial state
    setConnectionState({
      isConnected: webSocketService.isSocketConnected(),
      isConnecting: false,
      error: null,
    });

    return () => {
      webSocketService.off('connect', handleConnect);
      webSocketService.off('disconnect', handleDisconnect);
      webSocketService.off('reconnect_error', handleReconnectError);
    };
  }, []);

  return connectionState;
};

// Add React import for hooks
import React from 'react';