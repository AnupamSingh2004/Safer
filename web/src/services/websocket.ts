/**
 * Smart Tourist Safety System - WebSocket Service
 * Real-time updates and live data synchronization
 */

import { EventEmitter } from 'events';

// ============================================================================
// WEBSOCKET TYPES
// ============================================================================

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
  id?: string;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string[];
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  debug: boolean;
}

export interface ConnectionStatus {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  lastConnected: string | null;
  reconnectAttempts: number;
  latency: number;
}

export interface Subscription {
  id: string;
  channel: string;
  callback: (data: any) => void;
  filter?: (data: any) => boolean;
  active: boolean;
}

// ============================================================================
// WEBSOCKET SERVICE CLASS
// ============================================================================

class WebSocketService extends EventEmitter {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private subscriptions = new Map<string, Subscription>();
  private connectionStatus: ConnectionStatus;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private lastHeartbeat: number = 0;

  constructor(config?: Partial<WebSocketConfig>) {
    super();
    
    this.config = {
      url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws',
      protocols: [],
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      debug: process.env.NODE_ENV === 'development',
      ...config
    };

    this.connectionStatus = {
      connected: false,
      connecting: false,
      error: null,
      lastConnected: null,
      reconnectAttempts: 0,
      latency: 0
    };

    // Initialize connection on instantiation
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  // ============================================================================
  // CONNECTION MANAGEMENT
  // ============================================================================

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connectionStatus.connected || this.connectionStatus.connecting) {
        resolve();
        return;
      }

      this.connectionStatus.connecting = true;
      this.connectionStatus.error = null;

      try {
        this.log('Connecting to WebSocket:', this.config.url);
        
        this.ws = new WebSocket(this.config.url, this.config.protocols);

        this.ws.onopen = () => {
          this.log('WebSocket connected');
          this.connectionStatus.connected = true;
          this.connectionStatus.connecting = false;
          this.connectionStatus.lastConnected = new Date().toISOString();
          this.connectionStatus.reconnectAttempts = 0;
          
          this.startHeartbeat();
          this.emit('connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event);
        };

        this.ws.onclose = (event) => {
          this.log('WebSocket closed:', event.code, event.reason);
          this.handleDisconnection();
        };

        this.ws.onerror = (event) => {
          this.log('WebSocket error:', event);
          this.connectionStatus.error = 'Connection error';
          this.connectionStatus.connecting = false;
          this.emit('error', new Error('WebSocket connection failed'));
          reject(new Error('WebSocket connection failed'));
        };

      } catch (error) {
        this.connectionStatus.connecting = false;
        this.connectionStatus.error = error instanceof Error ? error.message : 'Unknown error';
        this.emit('error', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.log('Disconnecting WebSocket');
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }

    this.connectionStatus.connected = false;
    this.connectionStatus.connecting = false;
    this.emit('disconnected');
  }

  private handleDisconnection(): void {
    this.connectionStatus.connected = false;
    this.connectionStatus.connecting = false;
    this.stopHeartbeat();

    this.emit('disconnected');

    // Attempt reconnection if within limits
    if (this.connectionStatus.reconnectAttempts < this.config.maxReconnectAttempts) {
      this.connectionStatus.reconnectAttempts++;
      this.log(`Attempting reconnection ${this.connectionStatus.reconnectAttempts}/${this.config.maxReconnectAttempts}`);
      
      this.reconnectTimer = setTimeout(() => {
        this.connect().catch(error => {
          this.log('Reconnection failed:', error);
        });
      }, this.config.reconnectInterval);
    } else {
      this.log('Max reconnection attempts reached');
      this.connectionStatus.error = 'Max reconnection attempts reached';
      this.emit('reconnectFailed');
    }
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      this.log('Received message:', message.type);

      // Handle system messages
      if (message.type === 'heartbeat') {
        this.handleHeartbeat(message);
        return;
      }

      // Calculate latency for heartbeat responses
      if (message.type === 'heartbeat_response') {
        this.connectionStatus.latency = Date.now() - this.lastHeartbeat;
        return;
      }

      // Emit to all listeners
      this.emit('message', message);

      // Notify specific subscriptions
      this.notifySubscriptions(message);

    } catch (error) {
      this.log('Error parsing message:', error);
      this.emit('error', new Error('Invalid message format'));
    }
  }

  // ============================================================================
  // HEARTBEAT MANAGEMENT
  // ============================================================================

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private sendHeartbeat(): void {
    if (this.isConnected()) {
      this.lastHeartbeat = Date.now();
      this.send({
        type: 'heartbeat',
        data: { timestamp: this.lastHeartbeat },
        timestamp: new Date().toISOString()
      });
    }
  }

  private handleHeartbeat(message: WebSocketMessage): void {
    // Respond to server heartbeat
    this.send({
      type: 'heartbeat_response',
      data: message.data,
      timestamp: new Date().toISOString()
    });
  }

  // ============================================================================
  // MESSAGE SENDING
  // ============================================================================

  send(message: WebSocketMessage): boolean {
    if (!this.isConnected()) {
      this.log('Cannot send message: not connected');
      return false;
    }

    try {
      const messageStr = JSON.stringify(message);
      this.ws!.send(messageStr);
      this.log('Sent message:', message.type);
      return true;
    } catch (error) {
      this.log('Error sending message:', error);
      this.emit('error', error);
      return false;
    }
  }

  // ============================================================================
  // SUBSCRIPTION MANAGEMENT
  // ============================================================================

  subscribe(channel: string, callback: (data: any) => void, filter?: (data: any) => boolean): string {
    const subscriptionId = `${channel}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const subscription: Subscription = {
      id: subscriptionId,
      channel,
      callback,
      filter,
      active: true
    };

    this.subscriptions.set(subscriptionId, subscription);

    // Send subscription message to server
    this.send({
      type: 'subscribe',
      data: { channel, subscriptionId },
      timestamp: new Date().toISOString()
    });

    this.log(`Subscribed to channel: ${channel} (${subscriptionId})`);
    return subscriptionId;
  }

  unsubscribe(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      return false;
    }

    subscription.active = false;
    this.subscriptions.delete(subscriptionId);

    // Send unsubscription message to server
    this.send({
      type: 'unsubscribe',
      data: { channel: subscription.channel, subscriptionId },
      timestamp: new Date().toISOString()
    });

    this.log(`Unsubscribed from channel: ${subscription.channel} (${subscriptionId})`);
    return true;
  }

  unsubscribeFromChannel(channel: string): number {
    let count = 0;
    
    for (const [id, subscription] of this.subscriptions) {
      if (subscription.channel === channel) {
        this.unsubscribe(id);
        count++;
      }
    }

    return count;
  }

  private notifySubscriptions(message: WebSocketMessage): void {
    for (const [id, subscription] of this.subscriptions) {
      if (!subscription.active) {
        continue;
      }

      // Check if message matches subscription channel
      if (message.type === subscription.channel || 
          message.type.startsWith(`${subscription.channel}.`) ||
          (message.data && message.data.channel === subscription.channel)) {
        
        // Apply filter if provided
        if (subscription.filter && !subscription.filter(message.data)) {
          continue;
        }

        try {
          subscription.callback(message.data);
        } catch (error) {
          this.log(`Error in subscription callback (${id}):`, error);
        }
      }
    }
  }

  // ============================================================================
  // CHANNEL SPECIFIC METHODS
  // ============================================================================

  subscribeToAlerts(callback: (alert: any) => void): string {
    return this.subscribe('alerts', callback);
  }

  subscribeToTouristUpdates(callback: (tourist: any) => void): string {
    return this.subscribe('tourists', callback);
  }

  subscribeToIncidents(callback: (incident: any) => void): string {
    return this.subscribe('incidents', callback);
  }

  subscribeToSystemUpdates(callback: (update: any) => void): string {
    return this.subscribe('system', callback);
  }

  subscribeToLocationUpdates(callback: (location: any) => void): string {
    return this.subscribe('locations', callback);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  isConnected(): boolean {
    return this.connectionStatus.connected && this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }

  getActiveSubscriptions(): Subscription[] {
    return Array.from(this.subscriptions.values()).filter(sub => sub.active);
  }

  getConfig(): WebSocketConfig {
    return { ...this.config };
  }

  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[WebSocket]', ...args);
    }
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================

  destroy(): void {
    this.log('Destroying WebSocket service');
    this.removeAllListeners();
    this.subscriptions.clear();
    this.disconnect();
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let webSocketService: WebSocketService | null = null;

export function getWebSocketService(config?: Partial<WebSocketConfig>): WebSocketService {
  if (!webSocketService) {
    webSocketService = new WebSocketService(config);
  }
  return webSocketService;
}

// ============================================================================
// REAL-TIME HOOKS AND UTILITIES
// ============================================================================

/**
 * Mock WebSocket implementation for prototype/development
 */
class MockWebSocketService extends EventEmitter {
  private subscriptions = new Map<string, Subscription>();
  private mockDataTimers = new Map<string, NodeJS.Timeout>();
  
  connect(): Promise<void> {
    console.log('[MockWebSocket] Connected');
    setTimeout(() => this.emit('connected'), 100);
    return Promise.resolve();
  }

  disconnect(): void {
    console.log('[MockWebSocket] Disconnected');
    this.mockDataTimers.forEach(timer => clearInterval(timer));
    this.mockDataTimers.clear();
    this.emit('disconnected');
  }

  send(message: WebSocketMessage): boolean {
    console.log('[MockWebSocket] Sent:', message.type);
    return true;
  }

  subscribe(channel: string, callback: (data: any) => void): string {
    const id = `mock-${channel}-${Date.now()}`;
    this.subscriptions.set(id, { 
      id, 
      channel, 
      callback, 
      active: true 
    });

    // Start sending mock data for this channel
    this.startMockData(channel, callback);
    
    return id;
  }

  unsubscribe(id: string): boolean {
    const subscription = this.subscriptions.get(id);
    if (subscription) {
      this.subscriptions.delete(id);
      const timer = this.mockDataTimers.get(subscription.channel);
      if (timer) {
        clearInterval(timer);
        this.mockDataTimers.delete(subscription.channel);
      }
      return true;
    }
    return false;
  }

  isConnected(): boolean {
    return true;
  }

  getConnectionStatus(): ConnectionStatus {
    return {
      connected: true,
      connecting: false,
      error: null,
      lastConnected: new Date().toISOString(),
      reconnectAttempts: 0,
      latency: 10
    };
  }

  private startMockData(channel: string, callback: (data: any) => void): void {
    const interval = setInterval(() => {
      const mockData = this.generateMockData(channel);
      callback(mockData);
    }, 5000 + Math.random() * 10000); // Random interval between 5-15 seconds

    this.mockDataTimers.set(channel, interval);
  }

  private generateMockData(channel: string): any {
    const timestamp = new Date().toISOString();
    
    switch (channel) {
      case 'alerts':
        return {
          id: `alert-${Date.now()}`,
          type: ['emergency', 'warning', 'info'][Math.floor(Math.random() * 3)],
          title: 'New safety alert issued',
          message: 'A safety alert has been issued for your area',
          location: 'Red Fort Area, Delhi',
          timestamp,
          severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
        };

      case 'tourists':
        return {
          id: `tourist-${Date.now()}`,
          action: ['checkin', 'checkout', 'emergency', 'verification'][Math.floor(Math.random() * 4)],
          touristId: `T${Math.floor(Math.random() * 10000)}`,
          location: 'India Gate, Delhi',
          timestamp,
          status: 'active'
        };

      case 'incidents':
        return {
          id: `incident-${Date.now()}`,
          type: ['medical', 'theft', 'accident', 'security'][Math.floor(Math.random() * 4)],
          severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
          location: 'Connaught Place, Delhi',
          timestamp,
          status: 'reported'
        };

      case 'system':
        return {
          component: ['api', 'database', 'blockchain', 'alerts'][Math.floor(Math.random() * 4)],
          status: ['healthy', 'warning', 'error'][Math.floor(Math.random() * 3)],
          message: 'System component status update',
          timestamp,
          metrics: {
            cpu: Math.floor(Math.random() * 100),
            memory: Math.floor(Math.random() * 100),
            responseTime: Math.floor(Math.random() * 1000)
          }
        };

      default:
        return {
          message: `Mock data for ${channel}`,
          timestamp
        };
    }
  }

  // Mock methods to match WebSocketService interface
  subscribeToAlerts = (callback: (alert: any) => void) => this.subscribe('alerts', callback);
  subscribeToTouristUpdates = (callback: (tourist: any) => void) => this.subscribe('tourists', callback);
  subscribeToIncidents = (callback: (incident: any) => void) => this.subscribe('incidents', callback);
  subscribeToSystemUpdates = (callback: (update: any) => void) => this.subscribe('system', callback);
  subscribeToLocationUpdates = (callback: (location: any) => void) => this.subscribe('locations', callback);
  unsubscribeFromChannel = (channel: string) => 0;
  getActiveSubscriptions = () => Array.from(this.subscriptions.values());
  getConfig = () => ({} as WebSocketConfig);
  destroy = () => this.disconnect();
}

// ============================================================================
// EXPORT FACTORY FUNCTION
// ============================================================================

export function createWebSocketService(): WebSocketService | MockWebSocketService {
  // Use mock service in development or when WebSocket URL is not configured
  const shouldUseMock = process.env.NODE_ENV === 'development' || 
                        !process.env.NEXT_PUBLIC_WS_URL;

  if (shouldUseMock) {
    console.log('[WebSocket] Using mock WebSocket service for development');
    return new MockWebSocketService() as any;
  }

  return getWebSocketService();
}

// Default export
export default getWebSocketService;
