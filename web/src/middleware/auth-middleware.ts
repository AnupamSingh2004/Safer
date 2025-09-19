/**
 * Smart Tourist Safety System - Authentication Middleware
 * Route protection and authentication middleware for Next.js
 */

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import type { 
  User, 
  UserRole, 
  Permission, 
  TokenPayload 
} from '@/types/auth';

// ============================================================================
// CONSTANTS
// ============================================================================

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-for-development'
);

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/public',
  '/_next',
  '/favicon.ico',
  '/assets'
];

const ROLE_ROUTES: Record<string, { roles: UserRole[], permissions?: Permission[] }> = {
  '/dashboard': { 
    roles: ['super_admin', 'police_admin', 'tourism_admin', 'operator', 'viewer'], 
    permissions: ['view_dashboard'] 
  },
  '/dashboard/police': { 
    roles: ['super_admin', 'police_admin'], 
    permissions: ['manage_investigations'] 
  },
  '/dashboard/tourism': { 
    roles: ['super_admin', 'tourism_admin'], 
    permissions: ['view_clusters'] 
  },
  '/admin': { 
    roles: ['super_admin'], 
    permissions: ['system_admin'] 
  },
  '/tourists': { 
    roles: ['super_admin', 'police_admin', 'tourism_admin', 'operator'], 
    permissions: ['view_tourists'] 
  },
  '/alerts': { 
    roles: ['super_admin', 'police_admin', 'operator'], 
    permissions: ['view_alerts'] 
  },
  '/zones': { 
    roles: ['super_admin', 'tourism_admin', 'operator'], 
    permissions: ['view_zones'] 
  },
  '/analytics': { 
    roles: ['super_admin', 'police_admin', 'tourism_admin', 'operator'], 
    permissions: ['view_analytics'] 
  },
  '/settings': { 
    roles: ['super_admin'], 
    permissions: ['manage_settings'] 
  },
  '/users': { 
    roles: ['super_admin'], 
    permissions: ['manage_users'] 
  },
  '/blockchain': { 
    roles: ['super_admin', 'police_admin', 'operator'], 
    permissions: ['view_blockchain'] 
  },
  '/emergency': { 
    roles: ['super_admin', 'police_admin', 'operator'], 
    permissions: ['emergency_response'] 
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a route is public (doesn't require authentication)
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => {
    if (route.endsWith('*')) {
      return pathname.startsWith(route.slice(0, -1));
    }
    return pathname === route || pathname.startsWith(route + '/');
  });
}

/**
 * Get the base path for route matching
 */
function getBasePath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  return segments.length > 0 ? `/${segments[0]}` : '/';
}

/**
 * Check if user has required permissions
 */
function hasPermissions(userPermissions: string[], requiredPermissions: Permission[]): boolean {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }
  
  return requiredPermissions.every(permission => 
    userPermissions.includes(permission as string)
  );
}

/**
 * Check if user has required roles
 */
function hasRoles(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }
  
  return requiredRoles.includes(userRole);
}

/**
 * Extract token from request
 */
function extractToken(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check cookies
  const tokenCookie = request.cookies.get('auth-token');
  if (tokenCookie) {
    return tokenCookie.value;
  }
  
  return null;
}

/**
 * Verify JWT token and extract payload
 */
async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Type assertion with proper validation
    const tokenPayload = payload as unknown as TokenPayload;
    
    // Validate required fields
    if (!tokenPayload.sub || !tokenPayload.email || !tokenPayload.role) {
      console.error('Invalid token payload structure');
      return null;
    }
    
    return tokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Create error response
 */
function createErrorResponse(
  message: string, 
  status: number = 401, 
  redirectTo?: string
): NextResponse {
  const response = NextResponse.json(
    { error: message, code: status },
    { status }
  );
  
  if (redirectTo) {
    response.headers.set('Location', redirectTo);
    response.headers.set('X-Redirect-To', redirectTo);
  }
  
  return response;
}

/**
 * Create redirect response
 */
function createRedirectResponse(url: string, permanent: boolean = false): NextResponse {
  return NextResponse.redirect(url, permanent ? 308 : 307);
}

// ============================================================================
// MAIN MIDDLEWARE FUNCTION
// ============================================================================

export async function authMiddleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }
  
  // Extract and verify token
  const token = extractToken(request);
  
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return createRedirectResponse(loginUrl.toString());
  }
  
  const tokenPayload = await verifyToken(token);
  
  if (!tokenPayload) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('error', 'invalid_token');
    return createRedirectResponse(loginUrl.toString());
  }
  
  // Check if token is expired
  const now = Math.floor(Date.now() / 1000);
  if (tokenPayload.exp < now) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('error', 'token_expired');
    return createRedirectResponse(loginUrl.toString());
  }
  
  // Get route requirements
  const basePath = getBasePath(pathname);
  const routeRequirements = ROLE_ROUTES[basePath];
  
  if (routeRequirements) {
    const { roles: requiredRoles, permissions: requiredPermissions } = routeRequirements;
    
    // Check role requirements
    if (requiredRoles && !hasRoles(tokenPayload.role, requiredRoles)) {
      return createErrorResponse(
        'Insufficient role permissions',
        403,
        '/dashboard'
      );
    }
    
    // Check permission requirements
    if (requiredPermissions && !hasPermissions(tokenPayload.permissions, requiredPermissions)) {
      return createErrorResponse(
        'Insufficient permissions',
        403,
        '/dashboard'
      );
    }
  }
  
  // Add user information to request headers for API routes
  const response = NextResponse.next();
  
  if (pathname.startsWith('/api/')) {
    response.headers.set('X-User-ID', tokenPayload.sub);
    response.headers.set('X-User-Role', tokenPayload.role);
    response.headers.set('X-User-Email', tokenPayload.email);
    response.headers.set('X-Session-ID', tokenPayload.sessionId);
    response.headers.set('X-User-Permissions', JSON.stringify(tokenPayload.permissions));
  }
  
  return response;
}

// ============================================================================
// PERMISSION CHECKING UTILITIES
// ============================================================================

/**
 * Check if current user has specific permission
 */
export function checkPermission(
  userPermissions: string[], 
  requiredPermission: Permission
): boolean {
  return userPermissions.includes(requiredPermission as string);
}

/**
 * Check if current user has any of the specified permissions
 */
export function checkAnyPermission(
  userPermissions: string[], 
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.some(permission => 
    userPermissions.includes(permission as string)
  );
}

/**
 * Check if current user has all specified permissions
 */
export function checkAllPermissions(
  userPermissions: string[], 
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.every(permission => 
    userPermissions.includes(permission as string)
  );
}

/**
 * Check if current user has specific role
 */
export function checkRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return userRole === requiredRole;
}

/**
 * Check if current user has any of the specified roles
 */
export function checkAnyRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

// ============================================================================
// ROUTE CONFIGURATION HELPERS
// ============================================================================

/**
 * Add new protected route
 */
export function addProtectedRoute(
  path: string, 
  roles: UserRole[], 
  permissions?: Permission[]
): void {
  ROLE_ROUTES[path] = { roles, permissions };
}

/**
 * Remove protected route
 */
export function removeProtectedRoute(path: string): void {
  delete ROLE_ROUTES[path];
}

/**
 * Update route permissions
 */
export function updateRoutePermissions(
  path: string, 
  roles: UserRole[], 
  permissions?: Permission[]
): void {
  if (ROLE_ROUTES[path]) {
    ROLE_ROUTES[path] = { roles, permissions };
  }
}

/**
 * Get all protected routes
 */
export function getProtectedRoutes(): Record<string, { roles: UserRole[], permissions?: Permission[] }> {
  return { ...ROLE_ROUTES };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default authMiddleware;

export {
  isPublicRoute,
  extractToken,
  verifyToken,
  hasPermissions,
  hasRoles,
  ROLE_ROUTES,
  PUBLIC_ROUTES
};