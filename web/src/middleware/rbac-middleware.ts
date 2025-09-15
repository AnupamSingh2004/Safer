/**
 * Smart Tourist Safety System - RBAC Middleware
 * Backend middleware for API endpoint protection with role and permission validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import type { UserRole, Permission } from '@/types/auth';

// ============================================================================
// CONFIGURATION
// ============================================================================

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

// ============================================================================
// TYPES
// ============================================================================

interface JWTPayload {
  sub: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  iat: number;
  exp: number;
}

interface RBACOptions {
  requiredRole?: UserRole;
  requiredPermissions?: Permission[];
  allowedRoles?: UserRole[];
  requireAll?: boolean; // For permissions: true = AND, false = OR
}

// API endpoint configurations
const API_PROTECTION_RULES: Record<string, RBACOptions> = {
  // Authentication endpoints (public)
  '/api/auth/login': {},
  '/api/auth/register': {},
  '/api/auth/forgot-password': {},
  
  // Protected authentication endpoints
  '/api/auth/verify': { requiredRole: 'viewer' },
  '/api/auth/refresh': { requiredRole: 'viewer' },
  '/api/auth/logout': { requiredRole: 'viewer' },
  '/api/auth/profile': { requiredRole: 'viewer' },
  
  // User management
  '/api/users': { 
    requiredPermissions: ['manage_users'],
    allowedRoles: ['super_admin', 'operator']
  },
  '/api/users/create': { 
    requiredPermissions: ['manage_users'],
    requiredRole: 'super_admin'
  },
  '/api/users/update': { 
    requiredPermissions: ['manage_users'],
    allowedRoles: ['super_admin', 'operator']
  },
  '/api/users/delete': { 
    requiredPermissions: ['manage_users'],
    requiredRole: 'super_admin'
  },
  
  // Tourist management
  '/api/tourists': { 
    requiredPermissions: ['view_tourists'],
    allowedRoles: ['super_admin', 'operator', 'viewer']
  },
  '/api/tourists/create': { 
    requiredPermissions: ['create_tourist'],
    allowedRoles: ['super_admin', 'operator']
  },
  '/api/tourists/update': { 
    requiredPermissions: ['update_tourist'],
    allowedRoles: ['super_admin', 'operator']
  },
  '/api/tourists/delete': { 
    requiredPermissions: ['delete_tourist'],
    requiredRole: 'super_admin'
  },
  '/api/tourists/track': { 
    requiredPermissions: ['track_tourist'],
    allowedRoles: ['super_admin', 'operator']
  },
  
  // Alert management
  '/api/alerts': { 
    requiredPermissions: ['view_alerts'],
    allowedRoles: ['super_admin', 'operator', 'viewer']
  },
  '/api/alerts/create': { 
    requiredPermissions: ['create_alert'],
    allowedRoles: ['super_admin', 'operator']
  },
  '/api/alerts/update': { 
    requiredPermissions: ['update_alert'],
    allowedRoles: ['super_admin', 'operator']
  },
  '/api/alerts/delete': { 
    requiredPermissions: ['delete_alert'],
    requiredRole: 'super_admin'
  },
  '/api/alerts/resolve': { 
    requiredPermissions: ['resolve_alert'],
    allowedRoles: ['super_admin', 'operator']
  },
  '/api/alerts/escalate': { 
    requiredPermissions: ['escalate_alert'],
    allowedRoles: ['super_admin', 'operator']
  },
  
  // Emergency management
  '/api/emergency/response': { 
    requiredPermissions: ['emergency_response'],
    allowedRoles: ['super_admin', 'operator']
  },
  
  // Zone management
  '/api/zones': { 
    requiredPermissions: ['view_zones'],
    allowedRoles: ['super_admin', 'operator', 'viewer']
  },
  '/api/zones/create': { 
    requiredPermissions: ['create_zone'],
    allowedRoles: ['super_admin', 'operator']
  },
  '/api/zones/update': { 
    requiredPermissions: ['update_zone'],
    allowedRoles: ['super_admin', 'operator']
  },
  '/api/zones/delete': { 
    requiredPermissions: ['delete_zone'],
    requiredRole: 'super_admin'
  },
  '/api/zones/geofencing': { 
    requiredPermissions: ['manage_geofencing'],
    allowedRoles: ['super_admin', 'operator']
  },
  
  // Analytics and reports
  '/api/analytics': { 
    requiredPermissions: ['view_analytics'],
    allowedRoles: ['super_admin', 'operator']
  },
  '/api/reports': { 
    requiredPermissions: ['export_data'],
    allowedRoles: ['super_admin', 'operator']
  },
  
  // System settings
  '/api/settings': { 
    requiredPermissions: ['manage_settings'],
    allowedRoles: ['super_admin', 'operator']
  },
  '/api/settings/update': { 
    requiredPermissions: ['manage_settings'],
    requiredRole: 'super_admin'
  },
  
  // Blockchain operations
  '/api/blockchain/deploy': { 
    requiredPermissions: ['manage_blockchain'],
    requiredRole: 'super_admin'
  },
  '/api/blockchain/verify': { 
    requiredPermissions: ['view_blockchain'],
    allowedRoles: ['super_admin', 'operator']
  },
  '/api/blockchain/generate-id': { 
    requiredPermissions: ['generate_digital_id'],
    allowedRoles: ['super_admin', 'operator']
  },
  '/api/blockchain/verify-id': { 
    requiredPermissions: ['verify_digital_id'],
    allowedRoles: ['super_admin', 'operator', 'viewer']
  },
  
  // System administration
  '/api/logs': { 
    requiredPermissions: ['view_logs'],
    allowedRoles: ['super_admin']
  },
  '/api/system': { 
    requiredPermissions: ['system_admin'],
    requiredRole: 'super_admin'
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Extract JWT token from Authorization header
 */
function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Verify and decode JWT token
 */
async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Check if user has required role
 */
function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    'viewer': 1,
    'operator': 2,
    'super_admin': 3
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Check if user role is in allowed roles list
 */
function isRoleAllowed(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Check if user has required permissions
 */
function hasRequiredPermissions(
  userPermissions: Permission[], 
  requiredPermissions: Permission[], 
  requireAll: boolean = false
): boolean {
  if (requireAll) {
    // AND logic: user must have ALL required permissions
    return requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );
  } else {
    // OR logic: user must have at least ONE required permission
    return requiredPermissions.some(permission => 
      userPermissions.includes(permission)
    );
  }
}

/**
 * Get protection rules for API endpoint
 */
function getProtectionRules(pathname: string): RBACOptions {
  // Check exact match first
  if (API_PROTECTION_RULES[pathname]) {
    return API_PROTECTION_RULES[pathname];
  }
  
  // Check for dynamic routes (e.g., /api/users/[id])
  for (const route in API_PROTECTION_RULES) {
    if (route.includes('[') || route.includes(':')) {
      const routePattern = route
        .replace(/\[([^\]]+)\]/g, '([^/]+)')
        .replace(/:([^/]+)/g, '([^/]+)');
      const regex = new RegExp(`^${routePattern}$`);
      
      if (regex.test(pathname)) {
        return API_PROTECTION_RULES[route];
      }
    }
  }
  
  // Default: require authentication
  return { requiredRole: 'viewer' };
}

// ============================================================================
// MAIN RBAC MIDDLEWARE FUNCTION
// ============================================================================

/**
 * RBAC middleware for API route protection
 */
export async function rbacMiddleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  
  // Skip non-API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Get protection rules for this endpoint
  const rules = getProtectionRules(pathname);
  
  // If no rules specified, allow access (public endpoint)
  if (Object.keys(rules).length === 0) {
    return NextResponse.next();
  }
  
  // Extract and verify token
  const token = extractToken(request);
  if (!token) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Authentication required',
        code: 'UNAUTHORIZED'
      },
      { status: 401 }
    );
  }
  
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      },
      { status: 401 }
    );
  }
  
  // Check role requirements
  if (rules.requiredRole && !hasRequiredRole(payload.role, rules.requiredRole)) {
    return NextResponse.json(
      { 
        success: false,
        error: `Insufficient privileges. Required role: ${rules.requiredRole}`,
        code: 'INSUFFICIENT_ROLE'
      },
      { status: 403 }
    );
  }
  
  // Check allowed roles
  if (rules.allowedRoles && !isRoleAllowed(payload.role, rules.allowedRoles)) {
    return NextResponse.json(
      { 
        success: false,
        error: `Access denied. Allowed roles: ${rules.allowedRoles.join(', ')}`,
        code: 'ROLE_NOT_ALLOWED'
      },
      { status: 403 }
    );
  }
  
  // Check permission requirements
  if (rules.requiredPermissions && rules.requiredPermissions.length > 0) {
    const hasPermissions = hasRequiredPermissions(
      payload.permissions,
      rules.requiredPermissions,
      rules.requireAll
    );
    
    if (!hasPermissions) {
      return NextResponse.json(
        { 
          success: false,
          error: `Missing required permissions: ${rules.requiredPermissions.join(', ')}`,
          code: 'INSUFFICIENT_PERMISSIONS'
        },
        { status: 403 }
      );
    }
  }
  
  // Add user info to request headers for API handlers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.sub);
  requestHeaders.set('x-user-email', payload.email);
  requestHeaders.set('x-user-role', payload.role);
  requestHeaders.set('x-user-permissions', JSON.stringify(payload.permissions));
  
  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

// ============================================================================
// HELPER FUNCTIONS FOR API HANDLERS
// ============================================================================

/**
 * Extract user info from request headers (set by middleware)
 */
export function getUserFromRequest(request: NextRequest) {
  return {
    id: request.headers.get('x-user-id'),
    email: request.headers.get('x-user-email'),
    role: request.headers.get('x-user-role') as UserRole,
    permissions: JSON.parse(request.headers.get('x-user-permissions') || '[]') as Permission[]
  };
}

/**
 * Check permissions in API handler
 */
export function checkPermissions(
  userPermissions: Permission[],
  requiredPermissions: Permission[],
  requireAll: boolean = false
): boolean {
  return hasRequiredPermissions(userPermissions, requiredPermissions, requireAll);
}

/**
 * Check role in API handler
 */
export function checkRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return hasRequiredRole(userRole, requiredRole);
}

// ============================================================================
// RATE LIMITING (BONUS)
// ============================================================================

const rateLimitMap = new Map();

/**
 * Simple rate limiting for API endpoints
 */
export function rateLimitMiddleware(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Get existing requests for this identifier
  const requests = rateLimitMap.get(identifier) || [];
  
  // Remove old requests outside the window
  const validRequests = requests.filter((time: number) => time > windowStart);
  
  // Check if limit exceeded
  if (validRequests.length >= maxRequests) {
    return false;
  }
  
  // Add current request
  validRequests.push(now);
  rateLimitMap.set(identifier, validRequests);
  
  return true;
}

// ============================================================================
// AUDIT LOGGING
// ============================================================================

/**
 * Log API access for security auditing
 */
export function logApiAccess(
  request: NextRequest,
  userId: string | null,
  action: string,
  success: boolean
) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: request.method,
    path: request.nextUrl.pathname,
    userId,
    userAgent: request.headers.get('user-agent'),
    ip: request.ip || request.headers.get('x-forwarded-for'),
    action,
    success,
    query: Object.fromEntries(request.nextUrl.searchParams)
  };
  
  // In production, send to logging service
  console.log('API Access:', JSON.stringify(logEntry));
}