/**
 * Smart Tourist Safety System - Backend WebSocket Service
 * Comprehensive real-time communication system for emergency alerts and location tracking
 * 
 * 🔴 REAL-TIME EMERGENCY SYSTEM - Instant alert broadcasting
 * 📡 WEBSOCKET INFRASTRUCTURE - Socket.IO powered real-time updates
 * 🌐 ROOM-BASED COMMUNICATION - Zone and role-based message targeting
 * 🚨 EMERGENCY BROADCASTING - Critical alert distribution system
 * 📍 LOCATION TRACKING - Real-time tourist position monitoring
 * 🔒 SECURE CONNECTIONS - JWT-based authentication for WebSocket
 */

import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import {
  AlertEntity,
  AlertType,
  AlertSeverity,
  NotificationChannel,
  EmergencyBroadcastEntity
} from '@/types/alert';
import {
  TouristEntity,
  TouristStatus as TouristStatusEnum,
  AlertLevel
} from '@/types/tourist';

// Simple logger since the lib/logger.ts is empty
const logger = {
  info: (message: string, ...args: any[]) => console.log(`[INFO] ${message}`, ...args),
  error: (message: string, ...args: any[]) => console.error(`[ERROR] ${message}`, ...args),
  warn: (message: string, ...args: any[]) => console.warn(`[WARN] ${message}`, ...args),
  debug: (message: string, ...args: any[]) => console.debug(`[DEBUG] ${message}`, ...args),
};

// ============================================================================
// ADDITIONAL TYPE DEFINITIONS
// ============================================================================

interface Alert extends AlertEntity {}

interface Tourist extends TouristEntity {}

interface TouristLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
  address?: string;
  zoneId?: string;
}

interface EmergencyBroadcast extends EmergencyBroadcastEntity {}

interface TouristStatus {
  touristId: string;
  status: 'safe' | 'check_required' | 'emergency' | 'offline';
  lastSeen: string;
  batteryLevel?: number;
}

// ============================================================================
// WEBSOCKET EVENT TYPES
// ============================================================================

export interface ServerToClientEvents {
  // Alert events
  'alert:new': (alert: Alert) => void;
  'alert:updated': (alert: Alert) => void;
  'alert:resolved': (alertId: string) => void;
  'alert:emergency': (alert: Alert) => void;
  
  // Location events
  'location:update': (location: TouristLocation) => void;
  'location:geofence': (event: GeofenceEvent) => void;
  'location:sos': (event: SOSEvent) => void;
  
  // Tourist events
  'tourist:connected': (tourist: Tourist) => void;
  'tourist:disconnected': (touristId: string) => void;
  'tourist:status_change': (event: TouristStatusEvent) => void;
  
  // Dashboard events
  'dashboard:stats_update': (stats: DashboardStats) => void;
  'dashboard:heatmap_update': (data: HeatmapData) => void;
  'dashboard:notification': (notification: DashboardNotification) => void;
  
  // System events
  'system:status': (status: SystemStatus) => void;
  'system:maintenance': (message: string) => void;
  'connection:status': (status: ConnectionStatus) => void;
  
  // Emergency response events
  'emergency:response_required': (event: EmergencyResponseEvent) => void;
  'emergency:responder_assigned': (event: ResponderAssignedEvent) => void;
  'emergency:status_update': (event: EmergencyStatusUpdate) => void;
}

export interface ClientToServerEvents {
  // Authentication
  'auth:authenticate': (token: string, callback: (success: boolean, error?: string) => void) => void;
  'auth:join_rooms': (rooms: string[]) => void;
  
  // Location tracking
  'location:update': (location: LocationUpdate) => void;
  'location:sos': (location: LocationUpdate) => void;
  'location:checkin': (checkpoint: CheckinData) => void;
  
  // Alert management
  'alert:acknowledge': (alertId: string, userId: string) => void;
  'alert:dismiss': (alertId: string, userId: string) => void;
  
  // Tourist actions
  'tourist:status_update': (status: TouristStatus) => void;
  'tourist:emergency': (emergency: EmergencyData) => void;
  
  // Dashboard actions
  'dashboard:subscribe': (filters: DashboardFilters) => void;
  'dashboard:unsubscribe': () => void;
  
  // System actions
  'system:heartbeat': () => void;
  'system:get_status': (callback: (status: SystemStatus) => void) => void;
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface GeofenceEvent {
  touristId: string;
  zoneId: string;
  zoneName: string;
  eventType: 'enter' | 'exit' | 'violation';
  location: TouristLocation;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

interface SOSEvent {
  touristId: string;
  touristName: string;
  location: TouristLocation;
  emergency_type: 'medical' | 'safety' | 'security' | 'general';
  message?: string;
  timestamp: string;
  responders?: string[];
}

interface TouristStatusEvent {
  touristId: string;
  previousStatus: string;
  newStatus: string;
  location?: TouristLocation;
  timestamp: string;
}

interface DashboardStats {
  totalTourists: number;
  activeTourists: number;
  alertsCount: number;
  emergencyCount: number;
  riskZones: number;
  lastUpdated: string;
}

interface HeatmapData {
  zones: Array<{
    zoneId: string;
    touristCount: number;
    riskLevel: string;
    coordinates: [number, number][];
  }>;
  timestamp: string;
}

interface DashboardNotification {
  id: string;
  type: 'alert' | 'emergency' | 'system' | 'update';
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  actionRequired: boolean;
}

interface SystemStatus {
  status: 'operational' | 'degraded' | 'maintenance' | 'outage';
  services: {
    websocket: boolean;
    database: boolean;
    blockchain: boolean;
    notifications: boolean;
  };
  connectedClients: number;
  uptime: number;
  lastCheck: string;
}

interface ConnectionStatus {
  connected: boolean;
  clientId: string;
  reconnectAttempts: number;
  latency: number;
}

interface EmergencyResponseEvent {
  emergencyId: string;
  touristId: string;
  location: TouristLocation;
  emergencyType: string;
  severity: AlertSeverity;
  estimatedResponse: string;
  assignedResponders: string[];
}

interface ResponderAssignedEvent {
  emergencyId: string;
  responderId: string;
  responderName: string;
  eta: string;
  contactInfo: string;
}

interface EmergencyStatusUpdate {
  emergencyId: string;
  status: 'responding' | 'on_scene' | 'resolved' | 'cancelled';
  updateBy: string;
  timestamp: string;
  notes?: string;
}

interface LocationUpdate {
  touristId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  batteryLevel?: number;
  speed?: number;
  heading?: number;
}

interface CheckinData {
  touristId: string;
  checkpointId: string;
  checkpointName: string;
  location: TouristLocation;
  timestamp: string;
}

interface TouristStatus {
  touristId: string;
  status: 'safe' | 'check_required' | 'emergency' | 'offline';
  lastSeen: string;
  batteryLevel?: number;
}

interface EmergencyData {
  touristId: string;
  emergencyType: 'medical' | 'safety' | 'security' | 'general';
  location: TouristLocation;
  message?: string;
  contacts?: string[];
}

interface DashboardFilters {
  zones?: string[];
  alertTypes?: AlertType[];
  severities?: AlertSeverity[];
  timeRange?: string;
}

// ============================================================================
// WEBSOCKET SERVICE CLASS
// ============================================================================

export class WebSocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, UserConnection> = new Map();
  private roomSubscriptions: Map<string, Set<string>> = new Map();
  private emergencyResponders: Map<string, ResponderInfo> = new Map();
  private systemStats: SystemStatus;

  constructor(httpServer: HTTPServer) {
    // Initialize Socket.IO server with comprehensive configuration
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      pingTimeout: 60000,
      pingInterval: 25000,
      maxHttpBufferSize: 1e6, // 1MB
      allowEIO3: true,
      transports: ['websocket', 'polling']
    });

    this.systemStats = {
      status: 'operational',
      services: {
        websocket: true,
        database: true,
        blockchain: true,
        notifications: true
      },
      connectedClients: 0,
      uptime: Date.now(),
      lastCheck: new Date().toISOString()
    };

    this.setupSocketHandlers();
    this.startSystemMonitoring();
    
    logger.info('🔴 WebSocket Service initialized - Real-time emergency system active');
  }

  /**
   * Setup Socket.IO event handlers
   */
  private setupSocketHandlers(): void {
    this.io.on('connection', (socket) => {
      logger.info(`🔌 New WebSocket connection: ${socket.id}`);
      
      // Authentication handler
      socket.on('auth:authenticate', async (token: string, callback) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
          const userConnection: UserConnection = {
            socketId: socket.id,
            userId: decoded.userId,
            userType: decoded.userType,
            connectedAt: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            rooms: new Set()
          };

          this.connectedUsers.set(socket.id, userConnection);
          socket.data = userConnection;
          
          logger.info(`✅ User authenticated: ${decoded.userId} (${decoded.userType})`);
          callback(true);
          
          // Auto-join default rooms based on user type
          await this.autoJoinRooms(socket, userConnection);
          
          // Send connection status
          socket.emit('connection:status', {
            connected: true,
            clientId: socket.id,
            reconnectAttempts: 0,
            latency: 0
          });

          // Update system stats
          this.updateSystemStats();
          
        } catch (error) {
          logger.error('❌ WebSocket authentication failed:', error);
          callback(false, 'Authentication failed');
          socket.disconnect();
        }
      });

      // Room management
      socket.on('auth:join_rooms', (rooms: string[]) => {
        this.joinRooms(socket, rooms);
      });

      // Location tracking handlers
      socket.on('location:update', (location: LocationUpdate) => {
        this.handleLocationUpdate(socket, location);
      });

      socket.on('location:sos', (location: LocationUpdate) => {
        this.handleSOSAlert(socket, location);
      });

      socket.on('location:checkin', (checkin: CheckinData) => {
        this.handleCheckin(socket, checkin);
      });

      // Alert management handlers
      socket.on('alert:acknowledge', (alertId: string, userId: string) => {
        this.handleAlertAcknowledgment(socket, alertId, userId);
      });

      socket.on('alert:dismiss', (alertId: string, userId: string) => {
        this.handleAlertDismissal(socket, alertId, userId);
      });

      // Tourist status handlers
      socket.on('tourist:status_update', (status: TouristStatus) => {
        this.handleTouristStatusUpdate(socket, status);
      });

      socket.on('tourist:emergency', (emergency: EmergencyData) => {
        this.handleEmergencyRequest(socket, emergency);
      });

      // Dashboard handlers
      socket.on('dashboard:subscribe', (filters: DashboardFilters) => {
        this.handleDashboardSubscription(socket, filters);
      });

      socket.on('dashboard:unsubscribe', () => {
        this.handleDashboardUnsubscription(socket);
      });

      // System handlers
      socket.on('system:heartbeat', () => {
        this.updateUserActivity(socket.id);
        socket.emit('system:status', this.systemStats);
      });

      socket.on('system:get_status', (callback) => {
        callback(this.systemStats);
      });

      // Disconnection handler
      socket.on('disconnect', (reason) => {
        this.handleDisconnection(socket, reason);
      });

      // Error handler
      socket.on('error', (error) => {
        logger.error(`❌ Socket error for ${socket.id}:`, error);
      });
    });
  }

  /**
   * Auto-join rooms based on user type
   */
  private async autoJoinRooms(socket: any, userConnection: UserConnection): Promise<void> {
    const rooms: string[] = [];

    switch (userConnection.userType) {
      case 'tourist':
        rooms.push('tourists', `tourist:${userConnection.userId}`);
        break;
      case 'staff':
      case 'admin':
        rooms.push('staff', 'alerts', 'dashboard');
        break;
      case 'emergency_responder':
        rooms.push('emergency', 'responders', 'alerts');
        break;
      case 'tourism_dept':
        rooms.push('tourism', 'dashboard', 'analytics');
        break;
    }

    this.joinRooms(socket, rooms);
  }

  /**
   * Join socket to specified rooms
   */
  private joinRooms(socket: any, rooms: string[]): void {
    const userConnection = this.connectedUsers.get(socket.id);
    if (!userConnection) return;

    rooms.forEach(room => {
      socket.join(room);
      userConnection.rooms.add(room);
      
      // Track room subscriptions
      if (!this.roomSubscriptions.has(room)) {
        this.roomSubscriptions.set(room, new Set());
      }
      this.roomSubscriptions.get(room)!.add(socket.id);
    });

    logger.info(`📢 User ${userConnection.userId} joined rooms: ${rooms.join(', ')}`);
  }

  /**
   * Handle location updates from tourists
   */
  private handleLocationUpdate(socket: any, location: LocationUpdate): void {
    const userConnection = this.connectedUsers.get(socket.id);
    if (!userConnection || userConnection.userType !== 'tourist') return;

    // Broadcast to relevant rooms
    this.io.to('staff').to('emergency').emit('location:update', {
      touristId: location.touristId,
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
      timestamp: location.timestamp,
      batteryLevel: location.batteryLevel,
      lastUpdate: new Date().toISOString()
    });

    // Check for geofence violations
    this.checkGeofenceViolations(location);
    
    this.updateUserActivity(socket.id);
    logger.debug(`📍 Location update from tourist ${location.touristId}`);
  }

  /**
   * Handle SOS emergency alerts
   */
  private handleSOSAlert(socket: any, location: LocationUpdate): void {
    const userConnection = this.connectedUsers.get(socket.id);
    if (!userConnection) return;

    const sosEvent: SOSEvent = {
      touristId: location.touristId,
      touristName: `Tourist ${location.touristId}`,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        timestamp: location.timestamp
      },
      emergency_type: 'general',
      timestamp: new Date().toISOString(),
      responders: []
    };

    // Broadcast emergency to all emergency responders
    this.io.to('emergency').to('staff').emit('location:sos', sosEvent);
    
    // Create emergency response event
    const emergencyResponse: EmergencyResponseEvent = {
      emergencyId: `sos-${Date.now()}`,
      touristId: location.touristId,
      location: sosEvent.location,
      emergencyType: 'sos_button',
      severity: AlertSeverity.CRITICAL,
      estimatedResponse: '5-10 minutes',
      assignedResponders: []
    };

    this.io.to('emergency').emit('emergency:response_required', emergencyResponse);

    logger.error(`🚨 SOS ALERT from tourist ${location.touristId} at ${location.latitude}, ${location.longitude}`);
  }

  /**
   * Handle tourist check-ins at checkpoints
   */
  private handleCheckin(socket: any, checkin: CheckinData): void {
    const userConnection = this.connectedUsers.get(socket.id);
    if (!userConnection) return;

    // Broadcast check-in to monitoring systems
    this.io.to('staff').to('tourism').emit('tourist:checkin', checkin);
    
    logger.info(`✅ Tourist ${checkin.touristId} checked in at ${checkin.checkpointName}`);
  }

  /**
   * Handle alert acknowledgments
   */
  private handleAlertAcknowledgment(socket: any, alertId: string, userId: string): void {
    // Broadcast acknowledgment to relevant rooms
    this.io.to('staff').to('dashboard').emit('alert:acknowledged', {
      alertId,
      acknowledgedBy: userId,
      timestamp: new Date().toISOString()
    });

    logger.info(`✅ Alert ${alertId} acknowledged by ${userId}`);
  }

  /**
   * Handle alert dismissals
   */
  private handleAlertDismissal(socket: any, alertId: string, userId: string): void {
    // Broadcast dismissal to relevant rooms
    this.io.to('staff').to('dashboard').emit('alert:dismissed', {
      alertId,
      dismissedBy: userId,
      timestamp: new Date().toISOString()
    });

    logger.info(`✅ Alert ${alertId} dismissed by ${userId}`);
  }

  /**
   * Handle tourist status updates
   */
  private handleTouristStatusUpdate(socket: any, status: TouristStatus): void {
    const statusEvent: TouristStatusEvent = {
      touristId: status.touristId,
      previousStatus: 'unknown',
      newStatus: status.status,
      timestamp: new Date().toISOString()
    };

    this.io.to('staff').to('tourism').emit('tourist:status_change', statusEvent);
    
    logger.info(`📊 Tourist ${status.touristId} status changed to ${status.status}`);
  }

  /**
   * Handle emergency requests
   */
  private handleEmergencyRequest(socket: any, emergency: EmergencyData): void {
    const emergencyId = `emergency-${Date.now()}`;
    
    const emergencyResponse: EmergencyResponseEvent = {
      emergencyId,
      touristId: emergency.touristId,
      location: emergency.location,
      emergencyType: emergency.emergencyType,
      severity: AlertSeverity.CRITICAL,
      estimatedResponse: '5-10 minutes',
      assignedResponders: []
    };

    // Broadcast to emergency responders
    this.io.to('emergency').to('staff').emit('emergency:response_required', emergencyResponse);
    
    logger.error(`🚨 EMERGENCY REQUEST: ${emergency.emergencyType} from tourist ${emergency.touristId}`);
  }

  /**
   * Handle dashboard subscriptions
   */
  private handleDashboardSubscription(socket: any, filters: DashboardFilters): void {
    socket.join('dashboard_live');
    
    // Send initial dashboard data
    this.sendDashboardUpdate(socket.id);
    
    logger.info(`📊 Dashboard subscription activated for ${socket.id}`);
  }

  /**
   * Handle dashboard unsubscriptions
   */
  private handleDashboardUnsubscription(socket: any): void {
    socket.leave('dashboard_live');
    logger.info(`📊 Dashboard subscription deactivated for ${socket.id}`);
  }

  /**
   * Handle user disconnection
   */
  private handleDisconnection(socket: any, reason: string): void {
    const userConnection = this.connectedUsers.get(socket.id);
    
    if (userConnection) {
      // Clean up room subscriptions
      userConnection.rooms.forEach(room => {
        const roomSubs = this.roomSubscriptions.get(room);
        if (roomSubs) {
          roomSubs.delete(socket.id);
          if (roomSubs.size === 0) {
            this.roomSubscriptions.delete(room);
          }
        }
      });

      // Broadcast disconnection if tourist
      if (userConnection.userType === 'tourist') {
        this.io.to('staff').emit('tourist:disconnected', userConnection.userId);
      }

      this.connectedUsers.delete(socket.id);
      logger.info(`🔌 User ${userConnection.userId} disconnected: ${reason}`);
    }

    this.updateSystemStats();
  }

  // ============================================================================
  // PUBLIC METHODS FOR EXTERNAL USE
  // ============================================================================

  /**
   * Broadcast new alert to relevant users
   */
  public broadcastAlert(alert: Alert): void {
    // Determine target rooms based on alert type and target
    const targetRooms = this.getTargetRooms(alert);
    
    targetRooms.forEach(room => {
      this.io.to(room).emit('alert:new', alert);
    });

    logger.info(`📢 Alert broadcast: ${alert.title} to rooms: ${targetRooms.join(', ')}`);
  }

  /**
   * Broadcast emergency alert with highest priority
   */
  public broadcastEmergencyAlert(alert: Alert): void {
    // Emergency alerts go to all relevant channels
    this.io.to('emergency').to('staff').to('tourists').emit('alert:emergency', alert);
    
    logger.error(`🚨 EMERGENCY ALERT BROADCAST: ${alert.title}`);
  }

  /**
   * Send emergency broadcast
   */
  public sendEmergencyBroadcast(broadcast: EmergencyBroadcast): void {
    const targetRooms = ['emergency', 'staff'];
    
    // Check if broadcast has target_type 'all'
    if (broadcast.target_type === 'all') {
      targetRooms.push('tourists');
    }

    targetRooms.forEach(room => {
      this.io.to(room).emit('emergency:broadcast', broadcast);
    });

    logger.error(`🚨 EMERGENCY BROADCAST: ${broadcast.title}`);
  }

  /**
   * Update alert status
   */
  public updateAlert(alert: Alert): void {
    const targetRooms = this.getTargetRooms(alert);
    
    targetRooms.forEach(room => {
      this.io.to(room).emit('alert:updated', alert);
    });

    logger.info(`🔄 Alert updated: ${alert.id}`);
  }

  /**
   * Notify alert resolution
   */
  public notifyAlertResolution(alertId: string): void {
    this.io.to('staff').to('dashboard').emit('alert:resolved', alertId);
    logger.info(`✅ Alert resolved: ${alertId}`);
  }

  /**
   * Send system status update
   */
  public updateSystemStatus(status: Partial<SystemStatus>): void {
    this.systemStats = { ...this.systemStats, ...status, lastCheck: new Date().toISOString() };
    this.io.emit('system:status', this.systemStats);
  }

  /**
   * Get connection statistics
   */
  public getConnectionStats(): ConnectionStats {
    return {
      totalConnections: this.connectedUsers.size,
      userTypes: this.getUserTypeBreakdown(),
      rooms: Array.from(this.roomSubscriptions.keys()),
      uptime: Date.now() - this.systemStats.uptime
    };
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private getTargetRooms(alert: Alert): string[] {
    const rooms: string[] = ['staff', 'dashboard'];

    // Add rooms based on alert type
    switch (alert.type) {
      case AlertType.EMERGENCY:
        rooms.push('emergency', 'tourists');
        break;
      case AlertType.SAFETY:
      case AlertType.SECURITY:
        rooms.push('tourists');
        break;
      case AlertType.WEATHER:
      case AlertType.TRAFFIC:
        rooms.push('tourists', 'tourism');
        break;
    }

    // Add zone-specific rooms
    if (alert.affected_zones && alert.affected_zones.length > 0) {
      alert.affected_zones.forEach((zone: string) => {
        rooms.push(`zone:${zone}`);
      });
    }

    return [...new Set(rooms)]; // Remove duplicates
  }

  private checkGeofenceViolations(location: LocationUpdate): void {
    // Mock geofence check - in real implementation, this would check against actual zones
    const isInRestrictedZone = Math.random() < 0.1; // 10% chance for demo
    
    if (isInRestrictedZone) {
      const geofenceEvent: GeofenceEvent = {
        touristId: location.touristId,
        zoneId: 'restricted-zone-001',
        zoneName: 'High Risk Area',
        eventType: 'violation',
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          timestamp: location.timestamp
        },
        riskLevel: 'high',
        timestamp: new Date().toISOString()
      };

      this.io.to('staff').to('emergency').emit('location:geofence', geofenceEvent);
      logger.warn(`⚠️ Geofence violation: Tourist ${location.touristId} in restricted zone`);
    }
  }

  private updateUserActivity(socketId: string): void {
    const userConnection = this.connectedUsers.get(socketId);
    if (userConnection) {
      userConnection.lastActivity = new Date().toISOString();
    }
  }

  private updateSystemStats(): void {
    this.systemStats.connectedClients = this.connectedUsers.size;
    this.systemStats.lastCheck = new Date().toISOString();
  }

  private getUserTypeBreakdown(): Record<string, number> {
    const breakdown: Record<string, number> = {};
    
    this.connectedUsers.forEach(connection => {
      breakdown[connection.userType] = (breakdown[connection.userType] || 0) + 1;
    });

    return breakdown;
  }

  private sendDashboardUpdate(socketId?: string): void {
    const dashboardStats: DashboardStats = {
      totalTourists: 156,
      activeTourists: 89,
      alertsCount: 12,
      emergencyCount: 2,
      riskZones: 3,
      lastUpdated: new Date().toISOString()
    };

    const target = socketId ? this.io.to(socketId) : this.io.to('dashboard_live');
    target.emit('dashboard:stats_update', dashboardStats);
  }

  private startSystemMonitoring(): void {
    // Send periodic dashboard updates
    setInterval(() => {
      this.sendDashboardUpdate();
    }, 30000); // Every 30 seconds

    // System health check
    setInterval(() => {
      this.updateSystemStats();
      this.io.to('staff').emit('system:status', this.systemStats);
    }, 60000); // Every minute

    logger.info('📊 System monitoring started');
  }
}

// ============================================================================
// ADDITIONAL TYPES
// ============================================================================

interface UserConnection {
  socketId: string;
  userId: string;
  userType: 'tourist' | 'staff' | 'admin' | 'emergency_responder' | 'tourism_dept';
  connectedAt: string;
  lastActivity: string;
  rooms: Set<string>;
}

interface ResponderInfo {
  responderId: string;
  name: string;
  type: 'medical' | 'police' | 'fire' | 'security';
  location: TouristLocation;
  status: 'available' | 'responding' | 'busy';
  assignedEmergencies: string[];
}

interface ConnectionStats {
  totalConnections: number;
  userTypes: Record<string, number>;
  rooms: string[];
  uptime: number;
}

// ============================================================================
// EXPORT
// ============================================================================

export default WebSocketService;
