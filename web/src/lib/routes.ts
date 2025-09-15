/**
 * Smart Tourist Safety System - Centralized Routes Configuration
 * Type-safe route definitions with role-based access control
 */

// ============================================================================
// USER ROLES
// ============================================================================

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  OPERATOR = 'operator',
  VIEWER = 'viewer'
}

// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================

export const ROUTES = {
  // Public Routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  HELP: '/help',
  
  // Authentication Routes
  AUTH: {
    LOGIN: '/(auth)/login',
    REGISTER: '/(auth)/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    ERROR: '/auth/error',
  },

  // Dashboard Routes - Role-Based Access
  DASHBOARD: {
    ROOT: '/(dashboard)/overview',
    
    // Overview (All Roles)
    OVERVIEW: '/(dashboard)/overview',
    
    // Tourist Management (Admin, Operator, Viewer)
    TOURISTS: {
      ROOT: '/(dashboard)/tourists',
      ALL: '/(dashboard)/tourists',
      DETAILS: (id: string) => `/(dashboard)/tourists/${id}`,
      LOCATION: (id: string) => `/(dashboard)/tourists/${id}/location`,
      DIGITAL_ID: (id: string) => `/(dashboard)/tourists/${id}/digital-id`,
      CREATE: '/(dashboard)/tourists/create', // Admin, Operator only
      EDIT: (id: string) => `/(dashboard)/tourists/${id}/edit`, // Admin, Operator only
    },

    // Alert Management (All Roles - different permissions)
    ALERTS: {
      ROOT: '/(dashboard)/alerts',
      ALL: '/(dashboard)/alerts',
      ACTIVE: '/(dashboard)/alerts/active',
      HISTORY: '/(dashboard)/alerts/history',
      DETAILS: (id: string) => `/(dashboard)/alerts/${id}`,
      CREATE: '/(dashboard)/alerts/create', // Admin, Operator only
      EMERGENCY: '/(dashboard)/alerts/emergency', // All roles
    },

    // Zone Management (Admin, Operator, Viewer)
    ZONES: {
      ROOT: '/(dashboard)/zones',
      ALL: '/(dashboard)/zones',
      DETAILS: (id: string) => `/(dashboard)/zones/${id}`,
      EDIT: (id: string) => `/(dashboard)/zones/${id}/edit`, // Admin, Operator only
      CREATE: '/(dashboard)/zones/create', // Admin, Operator only
    },

    // Analytics (All Roles)
    ANALYTICS: {
      ROOT: '/(dashboard)/analytics',
      OVERVIEW: '/(dashboard)/analytics',
      HEATMAP: '/(dashboard)/analytics/heatmap',
      REPORTS: '/(dashboard)/analytics/reports',
    },

    // Blockchain & Digital Identity (All Roles - different permissions)
    BLOCKCHAIN: {
      ROOT: '/(dashboard)/blockchain',
      OVERVIEW: '/(dashboard)/blockchain',
      DIGITAL_IDS: '/(dashboard)/blockchain/digital-ids',
      GENERATE: '/(dashboard)/blockchain/digital-ids/generate', // Admin, Operator only
      VERIFY: '/(dashboard)/blockchain/digital-ids/verify',
      RECORDS: '/(dashboard)/blockchain/records',
    },

    // Settings (Role-Based)
    SETTINGS: {
      ROOT: '/(dashboard)/settings',
      PROFILE: '/(dashboard)/settings/profile', // All roles
      PREFERENCES: '/(dashboard)/settings/preferences', // All roles
      SYSTEM: '/(dashboard)/settings/system', // Admin only
      USERS: '/(dashboard)/settings/users', // Admin only
      NOTIFICATIONS: '/(dashboard)/settings/notifications', // All roles
    },

    // Admin Only Routes
    ADMIN: {
      ROOT: '/admin',
      USERS: '/admin/users',
      CREATE_USER: '/admin/users/create',
      EDIT_USER: (id: string) => `/admin/users/${id}/edit`,
      SYSTEM_LOGS: '/admin/logs',
      BACKUP: '/admin/backup',
      PERMISSIONS: '/admin/permissions',
    },
  },

  // API Routes
  API: {
    // Authentication
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      REGISTER: '/api/auth/register',
      REFRESH: '/api/auth/refresh',
      PROFILE: '/api/auth/profile',
      CHANGE_PASSWORD: '/api/auth/change-password',
    },

    // Tourists
    TOURISTS: {
      BASE: '/api/tourists',
      SEARCH: '/api/tourists/search',
      STATISTICS: '/api/tourists/statistics',
      BY_ID: (id: string) => `/api/tourists/${id}`,
    },

    // Alerts
    ALERTS: {
      BASE: '/api/alerts',
      ACTIVE: '/api/alerts/active',
      EMERGENCY: '/api/alerts/emergency',
      STATISTICS: '/api/alerts/statistics',
      BY_ID: (id: string) => `/api/alerts/${id}`,
      RESOLVE: (id: string) => `/api/alerts/${id}/resolve`,
      BULK_UPDATE: '/api/alerts/bulk-update',
    },

    // Zones
    ZONES: {
      BASE: '/api/zones',
      RISK: '/api/zones/risk-assessment',
      BY_ID: (id: string) => `/api/zones/${id}`,
    },

    // Blockchain
    BLOCKCHAIN: {
      GENERATE_ID: '/api/blockchain/generate-id',
      VERIFY_ID: '/api/blockchain/verify-identity',
      TRANSACTIONS: '/api/blockchain/transactions',
      RECORDS: '/api/blockchain/identity-records',
    },

    // Analytics
    ANALYTICS: {
      OVERVIEW: '/api/analytics/overview',
      TOURISTS: '/api/analytics/tourists',
      ALERTS: '/api/analytics/alerts',
      ZONES: '/api/analytics/zones',
      REPORTS: '/api/analytics/reports',
    },

    // Mobile API
    MOBILE: {
      TRACKING: '/api/mobile/tracking',
      PANIC: '/api/mobile/panic',
      SAFETY_SCORE: '/api/mobile/safety-score',
      KYC_UPLOAD: '/api/mobile/kyc-upload',
    },

    // Shared
    SHARED: {
      ALERTS: '/api/shared/alerts',
      ZONES: '/api/shared/zones',
      NOTIFICATIONS: '/api/shared/notifications',
    },

    // WebSocket
    WEBSOCKET: '/api/websocket',

    // Webhooks
    WEBHOOKS: {
      BLOCKCHAIN: '/api/webhooks/blockchain',
      PAYMENT: '/api/webhooks/payment',
    },
  },

  // Development/Testing Routes
  DEV: {
    SITEMAP: '/sitemap',
    CSS_DEBUG: '/css-debug',
    TEST_COMPONENTS: '/test-components',
    MINIMAL_TEST: '/minimal-test',
    SIMPLE_TEST: '/simple-test',
  },
} as const;

// ============================================================================
// ROLE-BASED ACCESS CONTROL
// ============================================================================

export const ROLE_PERMISSIONS = {
  [UserRole.SUPER_ADMIN]: {
    canAccess: [
      ROUTES.DASHBOARD.OVERVIEW,
      ROUTES.DASHBOARD.TOURISTS.ROOT,
      ROUTES.DASHBOARD.ALERTS.ROOT,
      ROUTES.DASHBOARD.ZONES.ROOT,
      ROUTES.DASHBOARD.ANALYTICS.ROOT,
      ROUTES.DASHBOARD.BLOCKCHAIN.ROOT,
      ROUTES.DASHBOARD.SETTINGS.ROOT,
      '/admin',
    ],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canManageUsers: true,
    canAccessAdmin: true,
    canViewLogs: true,
    canManageSystem: true,
  },
  [UserRole.ADMIN]: {
    canAccess: [
      ROUTES.DASHBOARD.OVERVIEW,
      ROUTES.DASHBOARD.TOURISTS.ROOT,
      ROUTES.DASHBOARD.ALERTS.ROOT,
      ROUTES.DASHBOARD.ZONES.ROOT,
      ROUTES.DASHBOARD.ANALYTICS.ROOT,
      ROUTES.DASHBOARD.BLOCKCHAIN.ROOT,
      ROUTES.DASHBOARD.SETTINGS.ROOT,
    ],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canManageUsers: true,
    canAccessAdmin: false,
    canViewLogs: true,
    canManageSystem: false,
  },
  [UserRole.OPERATOR]: {
    canAccess: [
      ROUTES.DASHBOARD.OVERVIEW,
      ROUTES.DASHBOARD.TOURISTS.ROOT,
      ROUTES.DASHBOARD.ALERTS.ROOT,
      ROUTES.DASHBOARD.ZONES.ROOT,
      ROUTES.DASHBOARD.ANALYTICS.ROOT,
      ROUTES.DASHBOARD.BLOCKCHAIN.ROOT,
      ROUTES.DASHBOARD.SETTINGS.PROFILE,
      ROUTES.DASHBOARD.SETTINGS.PREFERENCES,
      ROUTES.DASHBOARD.SETTINGS.NOTIFICATIONS,
    ],
    canCreate: true,
    canEdit: true,
    canDelete: false,
    canManageUsers: false,
    canAccessAdmin: false,
    canViewLogs: false,
    canManageSystem: false,
  },
  [UserRole.VIEWER]: {
    canAccess: [
      ROUTES.DASHBOARD.OVERVIEW,
      ROUTES.DASHBOARD.TOURISTS.ROOT,
      ROUTES.DASHBOARD.ALERTS.ROOT,
      ROUTES.DASHBOARD.ZONES.ROOT,
      ROUTES.DASHBOARD.ANALYTICS.ROOT,
      ROUTES.DASHBOARD.BLOCKCHAIN.ROOT,
      ROUTES.DASHBOARD.SETTINGS.PROFILE,
      ROUTES.DASHBOARD.SETTINGS.PREFERENCES,
      ROUTES.DASHBOARD.SETTINGS.NOTIFICATIONS,
    ],
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canManageUsers: false,
    canAccessAdmin: false,
    canViewLogs: false,
    canManageSystem: false,
  },
} as const;

// ============================================================================
// ROUTE HELPERS
// ============================================================================

/**
 * Type-safe navigation helper
 */
export class AppRouter {
  /**
   * Navigate to dashboard with optional sub-route
   */
  static dashboard(subRoute?: string): string {
    return subRoute ? `${ROUTES.DASHBOARD.ROOT}${subRoute}` : ROUTES.DASHBOARD.ROOT;
  }

  /**
   * Navigate to tourist details
   */
  static touristDetails(id: string): string {
    return ROUTES.DASHBOARD.TOURISTS.DETAILS(id);
  }

  /**
   * Navigate to tourist location
   */
  static touristLocation(id: string): string {
    return ROUTES.DASHBOARD.TOURISTS.LOCATION(id);
  }

  /**
   * Navigate to tourist digital ID
   */
  static touristDigitalId(id: string): string {
    return ROUTES.DASHBOARD.TOURISTS.DIGITAL_ID(id);
  }

  /**
   * Navigate to alert details
   */
  static alertDetails(id: string): string {
    return ROUTES.DASHBOARD.ALERTS.DETAILS(id);
  }

  /**
   * Navigate to zone details
   */
  static zoneDetails(id: string): string {
    return ROUTES.DASHBOARD.ZONES.DETAILS(id);
  }

  /**
   * Get API endpoint for tourist
   */
  static apiTourist(id: string): string {
    return ROUTES.API.TOURISTS.BY_ID(id);
  }

  /**
   * Get API endpoint for alert
   */
  static apiAlert(id: string): string {
    return ROUTES.API.ALERTS.BY_ID(id);
  }

  /**
   * Get API endpoint for zone
   */
  static apiZone(id: string): string {
    return ROUTES.API.ZONES.BY_ID(id);
  }
}

// ============================================================================
// ROLE-BASED ACCESS FUNCTIONS
// ============================================================================

/**
 * Check if user role can access a specific route
 */
export function canAccessRoute(userRole: UserRole, pathname: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  
  // Check exact matches first
  for (const allowedRoute of permissions.canAccess) {
    if (allowedRoute === pathname) {
      return true;
    }
    
    // Check if pathname starts with allowed route (for nested routes)
    if (pathname.startsWith(allowedRoute)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if user role can perform create operations
 */
export function canCreate(userRole: UserRole): boolean {
  return ROLE_PERMISSIONS[userRole].canCreate;
}

/**
 * Check if user role can perform edit operations
 */
export function canEdit(userRole: UserRole): boolean {
  return ROLE_PERMISSIONS[userRole].canEdit;
}

/**
 * Check if user role can perform delete operations
 */
export function canDelete(userRole: UserRole): boolean {
  return ROLE_PERMISSIONS[userRole].canDelete;
}

/**
 * Check if user role can manage other users
 */
export function canManageUsers(userRole: UserRole): boolean {
  return ROLE_PERMISSIONS[userRole].canManageUsers;
}

/**
 * Check if user role can access admin features
 */
export function canAccessAdmin(userRole: UserRole): boolean {
  return ROLE_PERMISSIONS[userRole].canAccessAdmin;
}

/**
 * Get navigation items based on user role
 */
export function getNavigationForRole(userRole: UserRole) {
  const permissions = ROLE_PERMISSIONS[userRole];
  
  const baseNavigation = [
    {
      name: 'Overview',
      href: ROUTES.DASHBOARD.OVERVIEW,
      icon: 'LayoutDashboard',
      description: 'System overview and statistics'
    },
    {
      name: 'Tourists',
      href: ROUTES.DASHBOARD.TOURISTS.ROOT,
      icon: 'Users',
      description: 'Manage tourist information and tracking'
    },
    {
      name: 'Alerts',
      href: ROUTES.DASHBOARD.ALERTS.ROOT,
      icon: 'AlertTriangle',
      description: 'Monitor and manage safety alerts'
    },
    {
      name: 'Zones',
      href: ROUTES.DASHBOARD.ZONES.ROOT,
      icon: 'MapPin',
      description: 'Manage geofence zones and risk areas'
    },
    {
      name: 'Analytics',
      href: ROUTES.DASHBOARD.ANALYTICS.ROOT,
      icon: 'BarChart3',
      description: 'View analytics and reports'
    },
    {
      name: 'Blockchain',
      href: ROUTES.DASHBOARD.BLOCKCHAIN.ROOT,
      icon: 'Shield',
      description: 'Digital identity and blockchain verification'
    },
  ];

  // Add admin navigation if user has permission
  if (permissions.canAccessAdmin) {
    baseNavigation.push({
      name: 'Administration',
      href: '/admin' as any, // Admin routes are separate
      icon: 'Settings',
      description: 'System administration and user management'
    });
  }

  // Add settings for all users
  baseNavigation.push({
    name: 'Settings',
    href: ROUTES.DASHBOARD.SETTINGS.ROOT,
    icon: 'User',
    description: 'Personal settings and preferences'
  });

  return baseNavigation;
}

// ============================================================================
// ROUTE VALIDATION
// ============================================================================

/**
 * Check if a route requires authentication
 */
export function requiresAuth(pathname: string): boolean {
  return pathname.startsWith('/dashboard') || pathname.startsWith('/api') && !isPublicApiRoute(pathname);
}

/**
 * Check if an API route is public (doesn't require authentication)
 */
export function isPublicApiRoute(pathname: string): boolean {
  const publicRoutes: string[] = [
    ROUTES.API.AUTH.LOGIN,
    ROUTES.API.AUTH.REGISTER,
    ROUTES.API.WEBHOOKS.BLOCKCHAIN,
    ROUTES.API.WEBHOOKS.PAYMENT,
  ];
  return publicRoutes.includes(pathname);
}

/**
 * Check if a route is a dashboard route
 */
export function isDashboardRoute(pathname: string): boolean {
  return pathname.startsWith('/dashboard');
}

/**
 * Check if a route is an API route
 */
export function isApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api');
}

/**
 * Get the dashboard section from pathname
 */
export function getDashboardSection(pathname: string): string | null {
  if (!isDashboardRoute(pathname)) return null;
  
  const parts = pathname.split('/');
  return parts[2] || null; // /dashboard/[section]/...
}

// ============================================================================
// BREADCRUMB HELPERS
// ============================================================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Generate breadcrumbs for a given pathname
 */
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];
  
  if (pathname === '/') {
    return [{ label: 'Home' }];
  }

  if (pathname.startsWith('/dashboard')) {
    breadcrumbs.push({ label: 'Dashboard', href: ROUTES.DASHBOARD.ROOT });
    
    const parts = pathname.split('/').filter(Boolean);
    
    for (let i = 2; i < parts.length; i++) {
      const part = parts[i];
      const href = '/' + parts.slice(0, i + 1).join('/');
      
      // Convert route segment to readable label
      const label = part
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({ 
        label, 
        href: i === parts.length - 1 ? undefined : href 
      });
    }
  }

  return breadcrumbs;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ROUTES;

// Type exports for TypeScript
export type RouteKeys = keyof typeof ROUTES;
export type DashboardRouteKeys = keyof typeof ROUTES.DASHBOARD;
export type ApiRouteKeys = keyof typeof ROUTES.API;
