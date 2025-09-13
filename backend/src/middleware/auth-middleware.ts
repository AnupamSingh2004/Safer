/**
 * Smart Tourist Safety System - Authentication Middleware
 * JWT validation, role-based access control, and request logging
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  permissions: string[];
  isActive: boolean;
  lastLoginAt?: string;
  loginAttempts: number;
  isBlocked: boolean;
  sessionId?: string;
}

enum UserRole {
  SUPER_ADMIN = 'super_admin',
  TOURISM_ADMIN = 'tourism_admin',
  POLICE_ADMIN = 'police_admin',
  MEDICAL_ADMIN = 'medical_admin',
  OPERATOR = 'operator',
  FIELD_AGENT = 'field_agent',
  VIEWER = 'viewer',
  TOURIST = 'tourist'
}

interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  department: string;
  sessionId: string;
  iat: number;
  exp: number;
}

interface AuthRequest extends NextRequest {
  user?: User;
  session?: {
    id: string;
    userId: string;
    isActive: boolean;
    expiresAt: Date;
  };
}

interface RolePermissions {
  [key: string]: string[];
}

interface RateLimitInfo {
  count: number;
  lastRequest: number;
  blocked: boolean;
}

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const SESSION_TIMEOUT = 24 * 60 * 60; // 24 hours in seconds
const MAX_LOGIN_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100;

// Mock user database for prototype
const mockUsers: User[] = [
  {
    id: 'user_001',
    email: 'admin@tourism.gov.in',
    firstName: 'Tourism',
    lastName: 'Administrator',
    role: UserRole.TOURISM_ADMIN,
    department: 'Tourism Department',
    permissions: ['*'],
    isActive: true,
    loginAttempts: 0,
    isBlocked: false,
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'user_002',
    email: 'police@meghalaya.gov.in',
    firstName: 'Police',
    lastName: 'Controller',
    role: UserRole.POLICE_ADMIN,
    department: 'Meghalaya Police',
    permissions: ['alerts:read', 'alerts:write', 'tourists:read', 'zones:read', 'emergency:all'],
    isActive: true,
    loginAttempts: 0,
    isBlocked: false
  },
  {
    id: 'user_003',
    email: 'operator@safety.gov.in',
    firstName: 'Safety',
    lastName: 'Operator',
    role: UserRole.OPERATOR,
    department: 'Safety Operations',
    permissions: ['alerts:read', 'alerts:write', 'tourists:read', 'zones:read'],
    isActive: true,
    loginAttempts: 0,
    isBlocked: false
  },
  {
    id: 'user_004',
    email: 'viewer@tourism.gov.in',
    firstName: 'Data',
    lastName: 'Viewer',
    role: UserRole.VIEWER,
    department: 'Tourism Analytics',
    permissions: ['alerts:read', 'tourists:read', 'zones:read', 'analytics:read'],
    isActive: true,
    loginAttempts: 0,
    isBlocked: false
  }
];

// Role-based permissions mapping
const ROLE_PERMISSIONS: RolePermissions = {
  [UserRole.SUPER_ADMIN]: ['*'],
  [UserRole.TOURISM_ADMIN]: [
    'tourists:*', 'alerts:*', 'zones:*', 'analytics:*', 
    'reports:*', 'users:read', 'users:write', 'settings:*'
  ],
  [UserRole.POLICE_ADMIN]: [
    'alerts:*', 'emergency:*', 'tourists:read', 'tourists:write',
    'zones:read', 'analytics:read', 'reports:read'
  ],
  [UserRole.MEDICAL_ADMIN]: [
    'alerts:read', 'alerts:medical', 'tourists:read', 'tourists:medical',
    'emergency:medical', 'analytics:read'
  ],
  [UserRole.OPERATOR]: [
    'alerts:read', 'alerts:write', 'tourists:read', 'tourists:write',
    'zones:read', 'analytics:read'
  ],
  [UserRole.FIELD_AGENT]: [
    'alerts:read', 'alerts:write', 'tourists:read', 'zones:read',
    'location:update', 'emergency:response'
  ],
  [UserRole.VIEWER]: [
    'alerts:read', 'tourists:read', 'zones:read', 'analytics:read'
  ],
  [UserRole.TOURIST]: [
    'profile:read', 'profile:write', 'location:update', 'emergency:panic'
  ]
};

// Rate limiting storage (in production, use Redis)
const rateLimitStore = new Map<string, RateLimitInfo>();

// Active sessions storage (in production, use Redis)
const activeSessions = new Map<string, {
  userId: string;
  isActive: boolean;
  createdAt: Date;
  lastAccess: Date;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}>();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const getClientIP = (request: NextRequest): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = forwarded?.split(',')[0] || realIP || 'unknown';
  return clientIP;
};

const getUserAgent = (request: NextRequest): string => {
  return request.headers.get('user-agent') || 'unknown';
};

const logSecurityEvent = (event: string, details: any, request?: NextRequest) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    details,
    ip: request ? getClientIP(request) : 'unknown',
    userAgent: request ? getUserAgent(request) : 'unknown'
  };
  
  console.log('[SECURITY]', JSON.stringify(logEntry, null, 2));
  
  // In production, send to security monitoring system
  // securityLogger.log(logEntry);
};

const isRateLimited = (identifier: string): boolean => {
  const now = Date.now();
  const rateLimitInfo = rateLimitStore.get(identifier);
  
  if (!rateLimitInfo) {
    rateLimitStore.set(identifier, {
      count: 1,
      lastRequest: now,
      blocked: false
    });
    return false;
  }
  
  // Reset count if window has passed
  if (now - rateLimitInfo.lastRequest > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(identifier, {
      count: 1,
      lastRequest: now,
      blocked: false
    });
    return false;
  }
  
  // Increment count
  rateLimitInfo.count++;
  rateLimitInfo.lastRequest = now;
  
  // Check if rate limit exceeded
  if (rateLimitInfo.count > RATE_LIMIT_MAX_REQUESTS) {
    rateLimitInfo.blocked = true;
    logSecurityEvent('RATE_LIMIT_EXCEEDED', {
      identifier,
      count: rateLimitInfo.count,
      window: RATE_LIMIT_WINDOW
    });
  }
  
  rateLimitStore.set(identifier, rateLimitInfo);
  return rateLimitInfo.blocked;
};

// ============================================================================
// JWT FUNCTIONS
// ============================================================================

const generateAccessToken = (user: User, sessionId: string): string => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    department: user.department,
    sessionId
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h',
    issuer: 'smart-tourist-safety',
    audience: 'smart-tourist-safety-api'
  });
};

const generateRefreshToken = (userId: string, sessionId: string): string => {
  return jwt.sign(
    { userId, sessionId, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

const verifyAccessToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'smart-tourist-safety',
      audience: 'smart-tourist-safety-api'
    }) as JWTPayload;
    
    return decoded;
  } catch (error) {
    logSecurityEvent('JWT_VERIFICATION_FAILED', {
      error: (error as Error).message,
      token: token.substring(0, 20) + '...'
    });
    return null;
  }
};

const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    logSecurityEvent('REFRESH_TOKEN_VERIFICATION_FAILED', {
      error: (error as Error).message
    });
    return null;
  }
};

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

const createSession = (userId: string, request: NextRequest): string => {
  const sessionId = generateSessionId();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TIMEOUT * 1000);
  
  activeSessions.set(sessionId, {
    userId,
    isActive: true,
    createdAt: now,
    lastAccess: now,
    expiresAt,
    ipAddress: getClientIP(request),
    userAgent: getUserAgent(request)
  });
  
  logSecurityEvent('SESSION_CREATED', {
    sessionId,
    userId,
    expiresAt: expiresAt.toISOString()
  }, request);
  
  return sessionId;
};

const validateSession = (sessionId: string): boolean => {
  const session = activeSessions.get(sessionId);
  
  if (!session) {
    return false;
  }
  
  if (!session.isActive || new Date() > session.expiresAt) {
    activeSessions.delete(sessionId);
    logSecurityEvent('SESSION_EXPIRED', { sessionId });
    return false;
  }
  
  // Update last access time
  session.lastAccess = new Date();
  activeSessions.set(sessionId, session);
  
  return true;
};

const invalidateSession = (sessionId: string): void => {
  const session = activeSessions.get(sessionId);
  if (session) {
    session.isActive = false;
    activeSessions.set(sessionId, session);
    
    logSecurityEvent('SESSION_INVALIDATED', { sessionId });
  }
};

const invalidateUserSessions = (userId: string): void => {
  for (const [sessionId, session] of activeSessions.entries()) {
    if (session.userId === userId) {
      session.isActive = false;
      activeSessions.set(sessionId, session);
    }
  }
  
  logSecurityEvent('USER_SESSIONS_INVALIDATED', { userId });
};

// ============================================================================
// PERMISSION CHECKING
// ============================================================================

const hasPermission = (user: User, requiredPermission: string): boolean => {
  // Super admin has all permissions
  if (user.role === UserRole.SUPER_ADMIN || user.permissions.includes('*')) {
    return true;
  }
  
  // Check exact permission
  if (user.permissions.includes(requiredPermission)) {
    return true;
  }
  
  // Check wildcard permissions
  const [resource, action] = requiredPermission.split(':');
  const wildcardPermission = `${resource}:*`;
  
  if (user.permissions.includes(wildcardPermission)) {
    return true;
  }
  
  // Check role-based permissions
  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  return rolePermissions.includes(requiredPermission) || 
         rolePermissions.includes('*') || 
         rolePermissions.includes(wildcardPermission);
};

const checkRoutePermissions = (path: string, method: string): string | null => {
  const routePermissions: { [key: string]: string } = {
    'GET /api/shared/tourists': 'tourists:read',
    'POST /api/shared/tourists': 'tourists:write',
    'PUT /api/shared/tourists': 'tourists:write',
    'DELETE /api/shared/tourists': 'tourists:delete',
    
    'GET /api/shared/alerts': 'alerts:read',
    'POST /api/shared/alerts': 'alerts:write',
    'PUT /api/shared/alerts': 'alerts:write',
    'DELETE /api/shared/alerts': 'alerts:delete',
    
    'GET /api/shared/zones': 'zones:read',
    'POST /api/shared/zones': 'zones:write',
    'PUT /api/shared/zones': 'zones:write',
    'DELETE /api/shared/zones': 'zones:delete',
    
    'GET /api/analytics': 'analytics:read',
    'POST /api/analytics': 'analytics:write',
    
    'GET /api/dashboard': 'dashboard:read',
    'POST /api/emergency': 'emergency:response',
    
    'GET /api/blockchain': 'blockchain:read',
    'POST /api/blockchain': 'blockchain:write'
  };
  
  const routeKey = `${method} ${path}`;
  return routePermissions[routeKey] || null;
};

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

const authenticateUser = async (email: string, password: string, request: NextRequest): Promise<{
  success: boolean;
  user?: User;
  sessionId?: string;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}> => {
  try {
    // Find user
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      logSecurityEvent('LOGIN_FAILED_USER_NOT_FOUND', { email }, request);
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Check if user is blocked
    if (user.isBlocked) {
      logSecurityEvent('LOGIN_BLOCKED_USER', { userId: user.id, email }, request);
      return { success: false, error: 'Account is blocked. Please contact administrator.' };
    }
    
    // Check if user is active
    if (!user.isActive) {
      logSecurityEvent('LOGIN_INACTIVE_USER', { userId: user.id, email }, request);
      return { success: false, error: 'Account is inactive. Please contact administrator.' };
    }
    
    // For prototype, simple password check (in production, use bcrypt)
    const validPassword = password === 'admin123' || password === 'password123';
    
    if (!validPassword) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.isBlocked = true;
        logSecurityEvent('USER_BLOCKED_MAX_ATTEMPTS', { 
          userId: user.id, 
          email, 
          attempts: user.loginAttempts 
        }, request);
        return { success: false, error: 'Account blocked due to too many failed login attempts.' };
      }
      
      logSecurityEvent('LOGIN_FAILED_INVALID_PASSWORD', { 
        userId: user.id, 
        email, 
        attempts: user.loginAttempts 
      }, request);
      
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lastLoginAt = new Date().toISOString();
    
    // Create session
    const sessionId = createSession(user.id, request);
    
    // Generate tokens
    const accessToken = generateAccessToken(user, sessionId);
    const refreshToken = generateRefreshToken(user.id, sessionId);
    
    logSecurityEvent('LOGIN_SUCCESS', { 
      userId: user.id, 
      email, 
      sessionId 
    }, request);
    
    return {
      success: true,
      user,
      sessionId,
      accessToken,
      refreshToken
    };
    
  } catch (error) {
    logSecurityEvent('LOGIN_ERROR', { 
      email, 
      error: (error as Error).message 
    }, request);
    
    return { success: false, error: 'Authentication failed' };
  }
};

// ============================================================================
// MIDDLEWARE FUNCTIONS
// ============================================================================

export const rateLimitMiddleware = (identifier?: string) => {
  return (request: NextRequest): NextResponse | null => {
    const id = identifier || getClientIP(request);
    
    if (isRateLimited(id)) {
      logSecurityEvent('RATE_LIMIT_BLOCKED', { identifier: id }, request);
      
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again later.',
          error: 'RATE_LIMIT_EXCEEDED'
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil(RATE_LIMIT_WINDOW / 1000).toString(),
            'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': (Date.now() + RATE_LIMIT_WINDOW).toString()
          }
        }
      );
    }
    
    return null;
  };
};

export const authMiddleware = (requiredPermission?: string) => {
  return async (request: AuthRequest): Promise<NextResponse | null> => {
    try {
      // Check rate limiting first
      const rateLimitResponse = rateLimitMiddleware()(request);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
      
      // Get token from Authorization header
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
      
      if (!token) {
        logSecurityEvent('AUTH_MISSING_TOKEN', {
          path: request.nextUrl.pathname,
          method: request.method
        }, request);
        
        return NextResponse.json(
          {
            success: false,
            message: 'Authentication required',
            error: 'MISSING_TOKEN'
          },
          { status: 401 }
        );
      }
      
      // Verify JWT token
      const decoded = verifyAccessToken(token);
      if (!decoded) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid or expired token',
            error: 'INVALID_TOKEN'
          },
          { status: 401 }
        );
      }
      
      // Validate session
      if (!validateSession(decoded.sessionId)) {
        logSecurityEvent('AUTH_INVALID_SESSION', {
          userId: decoded.userId,
          sessionId: decoded.sessionId
        }, request);
        
        return NextResponse.json(
          {
            success: false,
            message: 'Session expired. Please login again.',
            error: 'SESSION_EXPIRED'
          },
          { status: 401 }
        );
      }
      
      // Get user
      const user = mockUsers.find(u => u.id === decoded.userId);
      if (!user || !user.isActive) {
        logSecurityEvent('AUTH_USER_NOT_FOUND', {
          userId: decoded.userId
        }, request);
        
        return NextResponse.json(
          {
            success: false,
            message: 'User not found or inactive',
            error: 'USER_NOT_FOUND'
          },
          { status: 401 }
        );
      }
      
      // Check permissions
      const routePermission = requiredPermission || 
        checkRoutePermissions(request.nextUrl.pathname, request.method);
      
      if (routePermission && !hasPermission(user, routePermission)) {
        logSecurityEvent('AUTH_INSUFFICIENT_PERMISSIONS', {
          userId: user.id,
          requiredPermission: routePermission,
          userRole: user.role,
          userPermissions: user.permissions
        }, request);
        
        return NextResponse.json(
          {
            success: false,
            message: 'Insufficient permissions',
            error: 'ACCESS_DENIED'
          },
          { status: 403 }
        );
      }
      
      // Attach user to request (for Next.js, we'll pass this via headers)
      const response = NextResponse.next();
      response.headers.set('x-user-id', user.id);
      response.headers.set('x-user-role', user.role);
      response.headers.set('x-session-id', decoded.sessionId);
      
      logSecurityEvent('AUTH_SUCCESS', {
        userId: user.id,
        sessionId: decoded.sessionId,
        path: request.nextUrl.pathname,
        method: request.method
      }, request);
      
      return null; // Continue to next middleware/handler
      
    } catch (error) {
      logSecurityEvent('AUTH_ERROR', {
        error: (error as Error).message,
        path: request.nextUrl.pathname
      }, request);
      
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication error',
          error: 'AUTH_ERROR'
        },
        { status: 500 }
      );
    }
  };
};

// ============================================================================
// EXPORTED UTILITY FUNCTIONS
// ============================================================================

export const loginUser = authenticateUser;

export const logoutUser = (sessionId: string): void => {
  invalidateSession(sessionId);
};

export const refreshUserToken = (refreshToken: string): {
  success: boolean;
  accessToken?: string;
  error?: string;
} => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    
    if (!decoded || decoded.type !== 'refresh') {
      return { success: false, error: 'Invalid refresh token' };
    }
    
    // Validate session
    if (!validateSession(decoded.sessionId)) {
      return { success: false, error: 'Session expired' };
    }
    
    // Get user
    const user = mockUsers.find(u => u.id === decoded.userId);
    if (!user || !user.isActive) {
      return { success: false, error: 'User not found or inactive' };
    }
    
    // Generate new access token
    const accessToken = generateAccessToken(user, decoded.sessionId);
    
    logSecurityEvent('TOKEN_REFRESHED', {
      userId: user.id,
      sessionId: decoded.sessionId
    });
    
    return { success: true, accessToken };
    
  } catch (error) {
    logSecurityEvent('TOKEN_REFRESH_ERROR', {
      error: (error as Error).message
    });
    
    return { success: false, error: 'Token refresh failed' };
  }
};

export const getUserFromToken = (token: string): User | null => {
  const decoded = verifyAccessToken(token);
  if (!decoded) return null;
  
  return mockUsers.find(u => u.id === decoded.userId) || null;
};

export const validateUserPermission = (user: User, permission: string): boolean => {
  return hasPermission(user, permission);
};

export const getActiveSessionsCount = (userId: string): number => {
  let count = 0;
  for (const session of activeSessions.values()) {
    if (session.userId === userId && session.isActive) {
      count++;
    }
  }
  return count;
};

export const cleanupExpiredSessions = (): void => {
  const now = new Date();
  for (const [sessionId, session] of activeSessions.entries()) {
    if (now > session.expiresAt) {
      activeSessions.delete(sessionId);
    }
  }
};

// Run cleanup every hour
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  authMiddleware,
  rateLimitMiddleware,
  loginUser,
  logoutUser,
  refreshUserToken,
  getUserFromToken,
  validateUserPermission,
  getActiveSessionsCount,
  UserRole,
  ROLE_PERMISSIONS
};