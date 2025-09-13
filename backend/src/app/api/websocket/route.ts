/**
 * Smart Tourist Safety System - WebSocket API Route
 * Next.js API route for WebSocket server initialization and management
 * 
 * 🔌 WEBSOCKET SERVER - Socket.IO server initialization
 * 🚀 NEXT.JS INTEGRATION - Seamless Next.js API route integration
 * 🔒 SECURE CONNECTIONS - JWT authentication and CORS handling
 * 📡 REAL-TIME GATEWAY - Central WebSocket connection endpoint
 * 🌐 CONNECTION MANAGEMENT - Client connection handling and routing
 */

import { NextRequest, NextResponse } from 'next/server';
import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';

// Global WebSocket server instance
let io: SocketIOServer | null = null;
let httpServer: HTTPServer | null = null;

// ============================================================================
// WEBSOCKET SERVER CONFIGURATION
// ============================================================================

const WEBSOCKET_PORT = parseInt(process.env.WEBSOCKET_PORT || '8001');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const CORS_ORIGIN = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Initialize WebSocket server
 */
function initializeWebSocketServer(): SocketIOServer {
  if (io) {
    console.log('🔌 WebSocket server already initialized');
    return io;
  }

  // Create HTTP server for WebSocket
  httpServer = createServer();
  
  // Initialize Socket.IO server
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: [CORS_ORIGIN, 'http://localhost:3000', 'http://localhost:3001'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    allowEIO3: true,
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e6, // 1MB
    cleanupEmptyChildNamespaces: true,
  });

  // ============================================================================
  // AUTHENTICATION MIDDLEWARE
  // ============================================================================

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
      
      if (!token) {
        console.log('❌ WebSocket connection rejected: No authentication token');
        return next(new Error('Authentication token required'));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      if (!decoded.userId || !decoded.userType) {
        console.log('❌ WebSocket connection rejected: Invalid token payload');
        return next(new Error('Invalid token payload'));
      }

      // Attach user info to socket
      socket.data.userId = decoded.userId;
      socket.data.userType = decoded.userType;
      socket.data.email = decoded.email;
      socket.data.isAuthenticated = true;

      console.log(`✅ WebSocket client authenticated: ${decoded.email} (${decoded.userType})`);
      next();
    } catch (error) {
      console.log('❌ WebSocket authentication failed:', error instanceof Error ? error.message : 'Unknown error');
      next(new Error('Authentication failed'));
    }
  });

  // ============================================================================
  // CONNECTION HANDLING
  // ============================================================================

  io.on('connection', (socket) => {
    const { userId, userType, email } = socket.data;
    
    console.log(`🔗 WebSocket client connected: ${email} (${userType}) - Socket ID: ${socket.id}`);

    // Join user-specific rooms
    const userRoom = `user_${userId}`;
    const typeRoom = `${userType}s`; // tourists, authorities, admins
    
    socket.join([userRoom, typeRoom]);

    // Join specialized rooms based on user type
    if (userType === 'authority' || userType === 'admin') {
      socket.join(['emergency_broadcast', 'analytics_updates', 'system_alerts']);
      console.log(`🏠 Authority/Admin joined specialized rooms`);
    }

    if (userType === 'tourist') {
      socket.join(['tourist_updates', 'general_alerts']);
      console.log(`🏠 Tourist joined tourist-specific rooms`);
    }

    // Send authentication success
    socket.emit('authenticated', {
      userId,
      userType,
      socketId: socket.id,
      timestamp: new Date().toISOString(),
    });

    // ============================================================================
    // TOURIST EVENTS
    // ============================================================================

    // Location updates from tourists
    socket.on('location_update', (locationData) => {
      console.log(`📍 Location update from ${email}:`, locationData);
      
      // Broadcast to authorities and admins
      socket.to(['authorities', 'admins']).emit('tourist_location_update', {
        ...locationData,
        touristId: userId,
        timestamp: new Date().toISOString(),
      });

      // Store location update (this would typically go to a database)
      // await locationService.updateTouristLocation(userId, locationData);
    });

    // Tourist check-ins
    socket.on('tourist_check_in', (checkInData) => {
      console.log(`✅ Check-in from ${email}:`, checkInData);
      
      socket.to(['authorities', 'admins']).emit('tourist_check_in', {
        ...checkInData,
        touristId: userId,
        timestamp: new Date().toISOString(),
      });
    });

    // Emergency alerts from tourists
    socket.on('emergency_alert', (emergencyData) => {
      console.error(`🆘 EMERGENCY ALERT from ${email}:`, emergencyData);
      
      // Broadcast emergency to all authorities and admins immediately
      if (io) {
        io.to(['authorities', 'admins', 'emergency_broadcast']).emit('emergency_alert', {
          ...emergencyData,
          touristId: userId,
          touristEmail: email,
          timestamp: new Date().toISOString(),
          priority: 'urgent',
        });
      }

      // Log emergency alert
      console.error(`🚨 EMERGENCY BROADCAST SENT - Tourist: ${email}, Type: ${emergencyData.emergencyType}`);
    });

    // ============================================================================
    // AUTHORITY EVENTS
    // ============================================================================

    // Alert creation/updates from authorities
    socket.on('create_alert', (alertData) => {
      if (userType !== 'authority' && userType !== 'admin') {
        socket.emit('error', { message: 'Unauthorized: Only authorities can create alerts' });
        return;
      }

      console.log(`🚨 Alert created by ${email}:`, alertData);
      
      // Broadcast to all connected clients
      if (io) {
        io.emit('alert_created', {
          ...alertData,
          createdBy: userId,
          createdByEmail: email,
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Emergency broadcasts from authorities
    socket.on('emergency_broadcast', (broadcastData) => {
      if (userType !== 'authority' && userType !== 'admin') {
        socket.emit('error', { message: 'Unauthorized: Only authorities can send broadcasts' });
        return;
      }

      console.log(`📢 Emergency broadcast by ${email}:`, broadcastData);
      
      // Broadcast to all connected clients
      if (io) {
        io.emit('emergency_broadcast', {
          ...broadcastData,
          broadcastBy: userId,
          broadcastByEmail: email,
          timestamp: new Date().toISOString(),
        });
      }
    });

    // ============================================================================
    // ADMIN EVENTS
    // ============================================================================

    // System notifications from admins
    socket.on('system_notification', (notificationData) => {
      if (userType !== 'admin') {
        socket.emit('error', { message: 'Unauthorized: Only admins can send system notifications' });
        return;
      }

      console.log(`📢 System notification by ${email}:`, notificationData);
      
      if (io) {
        io.emit('system_notification', {
          ...notificationData,
          sentBy: userId,
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Analytics updates
    socket.on('analytics_update', (analyticsData) => {
      if (userType !== 'admin') {
        socket.emit('error', { message: 'Unauthorized: Only admins can send analytics updates' });
        return;
      }

      socket.to(['authorities', 'admins']).emit('analytics_update', analyticsData);
    });

    // ============================================================================
    // GENERAL EVENTS
    // ============================================================================

    // Room management
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`🏠 ${email} joined room: ${room}`);
      socket.emit('room_joined', { room, timestamp: new Date().toISOString() });
    });

    socket.on('leave_room', (room) => {
      socket.leave(room);
      console.log(`🚪 ${email} left room: ${room}`);
      socket.emit('room_left', { room, timestamp: new Date().toISOString() });
    });

    // Alert acknowledgment
    socket.on('acknowledge_alert', (data) => {
      console.log(`✅ Alert acknowledged by ${email}:`, data);
      
      if (io) {
        io.emit('alert_acknowledged', {
          ...data,
          acknowledgedBy: userId,
          acknowledgedByEmail: email,
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Alert resolution
    socket.on('resolve_alert', (data) => {
      console.log(`✅ Alert resolved by ${email}:`, data);
      
      if (io) {
        io.emit('alert_resolved', {
          ...data,
          resolvedBy: userId,
          resolvedByEmail: email,
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Ping/Pong for connection health
    socket.on('ping', (timestamp) => {
      socket.emit('pong', timestamp);
    });

    // ============================================================================
    // DISCONNECTION HANDLING
    // ============================================================================

    socket.on('disconnect', (reason) => {
      console.log(`🔌 WebSocket client disconnected: ${email} - Reason: ${reason}`);
      
      // Notify other clients about disconnection if necessary
      if (userType === 'tourist') {
        socket.to(['authorities', 'admins']).emit('tourist_disconnected', {
          touristId: userId,
          touristEmail: email,
          reason,
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Error handling
    socket.on('error', (error) => {
      console.error(`❌ WebSocket error for ${email}:`, error);
    });

    // Initial connection success log
    console.log(`✅ WebSocket client fully initialized: ${email} (${userType})`);
  });

  // ============================================================================
  // SERVER STARTUP
  // ============================================================================

  httpServer.listen(WEBSOCKET_PORT, () => {
    console.log(`🚀 WebSocket server running on port ${WEBSOCKET_PORT}`);
    console.log(`🔗 WebSocket endpoint: ws://localhost:${WEBSOCKET_PORT}`);
    console.log(`🌐 CORS origin: ${CORS_ORIGIN}`);
  });

  // Error handling
  httpServer.on('error', (error) => {
    console.error('❌ WebSocket server error:', error);
  });

  io.on('error', (error) => {
    console.error('❌ Socket.IO error:', error);
  });

  console.log('✅ WebSocket server initialized successfully');
  return io;
}

/**
 * Get WebSocket server instance
 */
function getWebSocketServer(): SocketIOServer | null {
  return io;
}

/**
 * Shutdown WebSocket server
 */
function shutdownWebSocketServer(): void {
  if (io) {
    console.log('🔌 Shutting down WebSocket server...');
    io.close();
    io = null;
  }
  
  if (httpServer) {
    httpServer.close();
    httpServer = null;
  }
  
  console.log('✅ WebSocket server shutdown complete');
}

// ============================================================================
// API ROUTE HANDLERS
// ============================================================================

/**
 * GET /api/websocket - WebSocket server status and connection info
 */
export async function GET(request: NextRequest) {
  try {
    const server = getWebSocketServer();
    
    if (!server) {
      // Initialize server if not running
      initializeWebSocketServer();
      
      return NextResponse.json({
        status: 'initializing',
        message: 'WebSocket server is starting up',
        port: WEBSOCKET_PORT,
        endpoint: `ws://localhost:${WEBSOCKET_PORT}`,
        timestamp: new Date().toISOString(),
      });
    }

    // Get server statistics
    const sockets = await server.fetchSockets();
    const roomCounts: Record<string, number> = {};
    
    for (const socket of sockets) {
      for (const room of socket.rooms) {
        if (room !== socket.id) { // Exclude the socket's own room
          roomCounts[room] = (roomCounts[room] || 0) + 1;
        }
      }
    }

    return NextResponse.json({
      status: 'running',
      message: 'WebSocket server is operational',
      port: WEBSOCKET_PORT,
      endpoint: `ws://localhost:${WEBSOCKET_PORT}`,
      statistics: {
        connectedClients: sockets.length,
        activeRooms: Object.keys(roomCounts).length,
        roomCounts,
        uptime: process.uptime(),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error getting WebSocket status:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to get WebSocket server status',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

/**
 * POST /api/websocket - WebSocket server management
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'start':
      case 'restart':
        if (getWebSocketServer()) {
          shutdownWebSocketServer();
          // Wait a moment before restarting
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        initializeWebSocketServer();
        
        return NextResponse.json({
          status: 'success',
          message: 'WebSocket server started/restarted successfully',
          port: WEBSOCKET_PORT,
          endpoint: `ws://localhost:${WEBSOCKET_PORT}`,
          timestamp: new Date().toISOString(),
        });

      case 'stop':
        shutdownWebSocketServer();
        
        return NextResponse.json({
          status: 'success',
          message: 'WebSocket server stopped successfully',
          timestamp: new Date().toISOString(),
        });

      case 'broadcast':
        const server = getWebSocketServer();
        if (!server) {
          return NextResponse.json({
            status: 'error',
            message: 'WebSocket server not running',
            timestamp: new Date().toISOString(),
          }, { status: 503 });
        }

        const { event, data, room } = body;
        if (room) {
          server.to(room).emit(event, data);
        } else {
          server.emit(event, data);
        }

        return NextResponse.json({
          status: 'success',
          message: `Broadcast sent to ${room || 'all clients'}`,
          event,
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json({
          status: 'error',
          message: 'Invalid action. Supported actions: start, stop, restart, broadcast',
          timestamp: new Date().toISOString(),
        }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ Error handling WebSocket API request:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to process WebSocket API request',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

/**
 * DELETE /api/websocket - Shutdown WebSocket server
 */
export async function DELETE(request: NextRequest) {
  try {
    shutdownWebSocketServer();
    
    return NextResponse.json({
      status: 'success',
      message: 'WebSocket server shutdown initiated',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error shutting down WebSocket server:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Failed to shutdown WebSocket server',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

// Auto-start WebSocket server in development
if (process.env.NODE_ENV === 'development' && process.env.AUTO_START_WEBSOCKET !== 'false') {
  console.log('🚀 Auto-starting WebSocket server in development mode...');
  setTimeout(() => {
    initializeWebSocketServer();
  }, 1000);
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📛 SIGTERM received, shutting down WebSocket server...');
  shutdownWebSocketServer();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📛 SIGINT received, shutting down WebSocket server...');
  shutdownWebSocketServer();
  process.exit(0);
});

// ============================================================================
// EXPORTS
// ============================================================================

export {
  initializeWebSocketServer,
  getWebSocketServer,
  shutdownWebSocketServer,
};