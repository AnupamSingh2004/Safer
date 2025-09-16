/**
 * Smart Tourist Safety System - Centralized Routes Configuration
 * Type-safe route definitions with role-based access control
 * Complete localhost routing structure for the SIH 2025 project
 */

// ============================================================================
// BASE URLS
// ============================================================================

export const BASE_URLS = {
  WEB_DASHBOARD: 'http://localhost:8001',
  BACKEND_API: 'http://localhost:3001',      // Backend Next.js server with API routes
  MOBILE_APP: 'http://localhost:8080',       // Flutter web
  DEV_SERVER: 'http://localhost:3001',       // Same as backend - combined service
} as const;

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
  // ============================================================================
  // PUBLIC ROUTES
  // ============================================================================
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  HELP: '/help',
  SUPPORT: '/support',
  PROFILE: '/profile',
  EMERGENCY: '/emergency',
  
  // ============================================================================
  // AUTHENTICATION ROUTES
  // ============================================================================
  AUTH: {
    // Group Authentication Routes (Next.js route groups - not in URL)
    LOGIN: '/login',
    REGISTER: '/register',
    
    // Direct Authentication Routes
    LOGOUT: '/auth/logout',
    ERROR: '/auth/error',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // ============================================================================
  // DASHBOARD ROUTES - Role-Based Access
  // ============================================================================
  DASHBOARD: {
    ROOT: '/dashboard/overview',
    
    // ============================================================================
    // Overview Dashboard
    // ============================================================================
    OVERVIEW: '/dashboard/overview',
    
    // ============================================================================
    // Tourist Management Routes
    // ============================================================================
    TOURISTS: {
      ROOT: '/dashboard/tourists',
      ALL: '/dashboard/tourists',
      DETAILS: (id: string) => `/dashboard/tourists/${id}`,
      LOCATION: (id: string) => `/dashboard/tourists/${id}/location`,
      DIGITAL_ID: (id: string) => `/dashboard/tourists/${id}/digital-id`,
      CREATE: '/dashboard/tourists/create',
      EDIT: (id: string) => `/dashboard/tourists/${id}/edit`,
    },

    // ============================================================================
    // Alert Management Routes
    // ============================================================================
    ALERTS: {
      ROOT: '/dashboard/alerts',
      ALL: '/dashboard/alerts',
      ACTIVE: '/dashboard/alerts/active',
      HISTORY: '/dashboard/alerts/history',
      DETAILS: (id: string) => `/dashboard/alerts/${id}`,
      CREATE: '/dashboard/alerts/create',
      EMERGENCY: '/dashboard/alerts/emergency',
    },

    // ============================================================================
    // Zone Management Routes
    // ============================================================================
    ZONES: {
      ROOT: '/dashboard/zones',
      ALL: '/dashboard/zones',
      DETAILS: (id: string) => `/dashboard/zones/${id}`,
      EDIT: (id: string) => `/dashboard/zones/${id}/edit`,
      CREATE: '/dashboard/zones/create',
    },

    // ============================================================================
    // Analytics Routes
    // ============================================================================
    ANALYTICS: {
      ROOT: '/dashboard/analytics',
      OVERVIEW: '/dashboard/analytics',
      HEATMAP: '/dashboard/analytics/heatmap',
      REPORTS: '/dashboard/analytics/reports',
    },

    // ============================================================================
    // Blockchain & Digital Identity Routes
    // ============================================================================
    BLOCKCHAIN: {
      ROOT: '/dashboard/blockchain',
      OVERVIEW: '/dashboard/blockchain',
      DIGITAL_IDS: '/dashboard/blockchain/digital-ids',
      GENERATE: '/dashboard/blockchain/digital-ids/generate',
      VERIFY: '/dashboard/blockchain/digital-ids/verify',
      RECORDS: '/dashboard/blockchain/records',
    },

    // ============================================================================
    // Settings Routes
    // ============================================================================
    SETTINGS: {
      ROOT: '/dashboard/settings',
      PROFILE: '/dashboard/settings/profile',
      PREFERENCES: '/dashboard/settings/preferences',
      SYSTEM: '/dashboard/settings/system',
      USERS: '/dashboard/settings/users',
      NOTIFICATIONS: '/dashboard/settings/notifications',
    },

    // ============================================================================
    // Administration Routes (Super Admin/Admin Only)
    // ============================================================================
    ADMINISTRATION: {
      ROOT: '/dashboard/administration',
      USERS: '/dashboard/administration/users',
      CREATE_USER: '/dashboard/administration/users/create',
      EDIT_USER: (id: string) => `/dashboard/administration/users/${id}/edit`,
      USER_ROLES: '/dashboard/administration/users/roles',
      OPERATORS: '/dashboard/administration/operators',
      OPERATOR_ASSIGNMENTS: '/dashboard/administration/operators/assignments',
      SYSTEM_LOGS: '/dashboard/administration/logs',
      PERMISSIONS: '/dashboard/administration/permissions',
    },

    // ============================================================================
    // Operator-Specific Routes
    // ============================================================================
    OPERATOR: {
      ROOT: '/dashboard/operator',
      PROFILE: '/dashboard/operator/profile',
      ASSIGNED_TOURISTS: '/dashboard/operator/assigned-tourists',
      MY_ASSIGNMENTS: '/dashboard/operator/assignments',
      WORKLOAD: '/dashboard/operator/workload',
      REPORTS: '/dashboard/operator/reports',
    },
  },

  // ============================================================================
  // STANDALONE DASHBOARD ROUTES (Alternative URLs)
  // ============================================================================
  DASHBOARD_ALT: {
    ROOT: '/dashboard',
    ADVANCED_UI: '/dashboard/advanced-ui',
    ALERTS: '/dashboard/alerts',
    ANALYTICS: '/dashboard/analytics',
    COMMUNICATION: '/dashboard/communication',
    LOCATION: '/dashboard/location',
    REGISTER_TOURIST: '/dashboard/register-tourist',
  },

  // ============================================================================
  // DEMO AND TESTING ROUTES
  // ============================================================================
  DEMO: {
    ROOT: '/demo',
    INTEGRATION: '/demo/integration',
    MOBILE_SIMULATOR: '/demo/mobile-simulator',
    TRANSITIONS: '/demo/transitions',
  },

  // ============================================================================
  // ADMIN ROUTES (Separate Admin Section)
  // ============================================================================
  ADMIN: {
    ROOT: '/admin',
    USERS: '/admin/users',
    CREATE_USER: '/admin/users/create',
    EDIT_USER: (id: string) => `/admin/users/${id}/edit`,
    SYSTEM_LOGS: '/admin/logs',
    BACKUP: '/admin/backup',
    PERMISSIONS: '/admin/permissions',
  },

  // ============================================================================
  // API ROUTES - Complete Backend Integration
  // ============================================================================
  API: {
    // ============================================================================
    // Authentication API
    // ============================================================================
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      REGISTER: '/api/auth/register',
      REFRESH: '/api/auth/refresh',
      PROFILE: '/api/auth/profile',
      CHANGE_PASSWORD: '/api/auth/change-password',
      NEXTAUTH: '/api/auth/[...nextauth]',
      GOOGLE_SIGNIN: '/api/auth/google-signin',
      VERIFY: '/api/auth/verify',
    },

    // ============================================================================
    // Tourist Management API
    // ============================================================================
    TOURISTS: {
      BASE: '/api/tourists',
      SEARCH: '/api/tourists/search',
      STATISTICS: '/api/tourists/statistics',
      BY_ID: (id: string) => `/api/tourists/${id}`,
      DIGITAL_ID: (id: string) => `/api/tourists/${id}/digital-id`,
      LOCATION: (id: string) => `/api/tourists/${id}/location`,
    },

    // ============================================================================
    // Alert Management API
    // ============================================================================
    ALERTS: {
      BASE: '/api/alerts',
      ACTIVE: '/api/alerts/active',
      EMERGENCY: '/api/alerts/emergency',
      STATISTICS: '/api/alerts/statistics',
      BY_ID: (id: string) => `/api/alerts/${id}`,
      RESOLVE: (id: string) => `/api/alerts/${id}/resolve`,
      BULK_UPDATE: '/api/alerts/bulk-update',
    },

    // ============================================================================
    // Zone Management API
    // ============================================================================
    ZONES: {
      BASE: '/api/zones',
      RISK: '/api/zones/risk-assessment',
      BY_ID: (id: string) => `/api/zones/${id}`,
    },

    // ============================================================================
    // Blockchain API
    // ============================================================================
    BLOCKCHAIN: {
      GENERATE_ID: '/api/blockchain/generate-id',
      GENERATE_IDENTITY: '/api/blockchain/generate-identity',
      VERIFY_ID: '/api/blockchain/verify-id',
      VERIFY_IDENTITY: '/api/blockchain/verify-identity',
      TRANSACTIONS: '/api/blockchain/transactions',
      RECORDS: '/api/blockchain/identity-records',
      TRANSACTION_STATUS: '/api/blockchain/transaction-status',
      CONTRACT_DEPLOY: '/api/blockchain/contract-deploy',
      CONTRACT_STATUS: '/api/blockchain/contract-status',
    },

    // ============================================================================
    // Analytics API
    // ============================================================================
    ANALYTICS: {
      OVERVIEW: '/api/analytics/overview',
      DASHBOARD: '/api/analytics/dashboard',
      HEATMAP: '/api/analytics/heatmap',
      REPORTS: '/api/analytics/reports',
      TOURISTS: '/api/analytics/tourists',
      ALERTS: '/api/analytics/alerts',
      ZONES: '/api/analytics/zones',
    },

    // ============================================================================
    // Dashboard API
    // ============================================================================
    DASHBOARD: {
      ANALYTICS: '/api/dashboard/analytics',
      OVERVIEW: '/api/dashboard/overview',
      REPORTS: '/api/dashboard/reports',
      TOURISTS: '/api/dashboard/tourists',
    },

    // ============================================================================
    // Mobile API
    // ============================================================================
    MOBILE: {
      TRACKING: '/api/mobile/tracking',
      PANIC: '/api/mobile/panic',
      SAFETY_SCORE: '/api/mobile/safety-score',
      KYC_UPLOAD: '/api/mobile/kyc-upload',
      PROFILE: '/api/mobile/profile',
    },

    // ============================================================================
    // Shared API (Cross-platform)
    // ============================================================================
    SHARED: {
      ALERTS: '/api/shared/alerts',
      ZONES: '/api/shared/zones',
      NOTIFICATIONS: '/api/shared/notifications',
      TOURISTS: '/api/shared/tourists',
      TOURIST_BY_ID: (id: string) => `/api/shared/tourists/${id}`,
      TOURIST_ALERTS: (id: string) => `/api/shared/tourists/${id}/alerts`,
      TOURIST_LOCATION: (id: string) => `/api/shared/tourists/${id}/location`,
      ZONE_BY_ID: (id: string) => `/api/shared/zones/${id}`,
      ALERT_BY_ID: (id: string) => `/api/shared/alerts/${id}`,
    },

    // ============================================================================
    // WebSocket & Real-time API
    // ============================================================================
    WEBSOCKET: '/api/websocket',

    // ============================================================================
    // Webhooks API
    // ============================================================================
    WEBHOOKS: {
      BLOCKCHAIN: '/api/webhooks/blockchain',
      PAYMENT: '/api/webhooks/payment',
    },
  },

  // ============================================================================
  // DEVELOPMENT & TESTING ROUTES
  // ============================================================================
  DEV: {
    SITEMAP: '/sitemap',
    CSS_DEBUG: '/css-debug',
    TEST_COMPONENTS: '/test-components',
    MINIMAL_TEST: '/minimal-test',
    SIMPLE_TEST: '/simple-test',
    THEME_TEST: '/theme-test-simple',
  },

  // ============================================================================
  // LOCALHOST DEVELOPMENT URLS (Complete Structure)
  // ============================================================================
  LOCALHOST: {
    // ============================================================================
    // Web Dashboard (Port 8001)
    // ============================================================================
    WEB: {
      BASE: BASE_URLS.WEB_DASHBOARD,
      HOME: `${BASE_URLS.WEB_DASHBOARD}/`,
      ABOUT: `${BASE_URLS.WEB_DASHBOARD}/about`,
      CONTACT: `${BASE_URLS.WEB_DASHBOARD}/contact`,
      HELP: `${BASE_URLS.WEB_DASHBOARD}/help`,
      SUPPORT: `${BASE_URLS.WEB_DASHBOARD}/support`,
      PROFILE: `${BASE_URLS.WEB_DASHBOARD}/profile`,
      EMERGENCY: `${BASE_URLS.WEB_DASHBOARD}/emergency`,
      
      // Authentication
      LOGIN: `${BASE_URLS.WEB_DASHBOARD}/login`,
      REGISTER: `${BASE_URLS.WEB_DASHBOARD}/register`,
      AUTH_ERROR: `${BASE_URLS.WEB_DASHBOARD}/auth/error`,
      AUTH_LOGOUT: `${BASE_URLS.WEB_DASHBOARD}/auth/logout`,
      
      // Dashboard Routes
      DASHBOARD_OVERVIEW: `${BASE_URLS.WEB_DASHBOARD}/dashboard/overview`,
      DASHBOARD_TOURISTS: `${BASE_URLS.WEB_DASHBOARD}/dashboard/tourists`,
      DASHBOARD_ALERTS: `${BASE_URLS.WEB_DASHBOARD}/dashboard/alerts`,
      DASHBOARD_ALERTS_ACTIVE: `${BASE_URLS.WEB_DASHBOARD}/dashboard/alerts/active`,
      DASHBOARD_ALERTS_HISTORY: `${BASE_URLS.WEB_DASHBOARD}/dashboard/alerts/history`,
      DASHBOARD_ZONES: `${BASE_URLS.WEB_DASHBOARD}/dashboard/zones`,
      DASHBOARD_ZONES_CREATE: `${BASE_URLS.WEB_DASHBOARD}/dashboard/zones/create`,
      DASHBOARD_ANALYTICS: `${BASE_URLS.WEB_DASHBOARD}/dashboard/analytics`,
      DASHBOARD_ANALYTICS_HEATMAP: `${BASE_URLS.WEB_DASHBOARD}/dashboard/analytics/heatmap`,
      DASHBOARD_ANALYTICS_REPORTS: `${BASE_URLS.WEB_DASHBOARD}/dashboard/analytics/reports`,
      DASHBOARD_BLOCKCHAIN: `${BASE_URLS.WEB_DASHBOARD}/dashboard/blockchain`,
      DASHBOARD_BLOCKCHAIN_DIGITAL_IDS: `${BASE_URLS.WEB_DASHBOARD}/dashboard/blockchain/digital-ids`,
      DASHBOARD_BLOCKCHAIN_GENERATE: `${BASE_URLS.WEB_DASHBOARD}/dashboard/blockchain/digital-ids/generate`,
      DASHBOARD_BLOCKCHAIN_VERIFY: `${BASE_URLS.WEB_DASHBOARD}/dashboard/blockchain/digital-ids/verify`,
      DASHBOARD_BLOCKCHAIN_RECORDS: `${BASE_URLS.WEB_DASHBOARD}/dashboard/blockchain/records`,
      DASHBOARD_SETTINGS: `${BASE_URLS.WEB_DASHBOARD}/dashboard/settings`,
      DASHBOARD_ADMINISTRATION: `${BASE_URLS.WEB_DASHBOARD}/dashboard/administration`,
      DASHBOARD_ADMINISTRATION_USERS: `${BASE_URLS.WEB_DASHBOARD}/dashboard/administration/users`,
      DASHBOARD_ADMINISTRATION_USERS_CREATE: `${BASE_URLS.WEB_DASHBOARD}/dashboard/administration/users/create`,
      DASHBOARD_OPERATOR: `${BASE_URLS.WEB_DASHBOARD}/dashboard/operator`,
      DASHBOARD_OPERATOR_ASSIGNMENTS: `${BASE_URLS.WEB_DASHBOARD}/dashboard/operator/assignments`,
      
      // Alternative Dashboard Routes
      DASHBOARD_ALT: `${BASE_URLS.WEB_DASHBOARD}/dashboard`,
      DASHBOARD_ALT_ADVANCED_UI: `${BASE_URLS.WEB_DASHBOARD}/dashboard/advanced-ui`,
      DASHBOARD_ALT_ALERTS: `${BASE_URLS.WEB_DASHBOARD}/dashboard/alerts`,
      DASHBOARD_ALT_ANALYTICS: `${BASE_URLS.WEB_DASHBOARD}/dashboard/analytics`,
      DASHBOARD_ALT_COMMUNICATION: `${BASE_URLS.WEB_DASHBOARD}/dashboard/communication`,
      DASHBOARD_ALT_LOCATION: `${BASE_URLS.WEB_DASHBOARD}/dashboard/location`,
      DASHBOARD_ALT_REGISTER_TOURIST: `${BASE_URLS.WEB_DASHBOARD}/dashboard/register-tourist`,
      
      // Demo Routes
      DEMO_INTEGRATION: `${BASE_URLS.WEB_DASHBOARD}/demo/integration`,
      DEMO_MOBILE_SIMULATOR: `${BASE_URLS.WEB_DASHBOARD}/demo/mobile-simulator`,
      DEMO_TRANSITIONS: `${BASE_URLS.WEB_DASHBOARD}/demo/transitions`,
      
      // Admin Routes
      ADMIN: `${BASE_URLS.WEB_DASHBOARD}/admin`,
      ADMIN_USERS: `${BASE_URLS.WEB_DASHBOARD}/admin/users`,
      ADMIN_USERS_CREATE: `${BASE_URLS.WEB_DASHBOARD}/admin/users/create`,
      
      // Testing Routes
      THEME_TEST: `${BASE_URLS.WEB_DASHBOARD}/theme-test-simple`,
    },

    // ============================================================================
    // Backend API (Port 3000)
    // ============================================================================
    API: {
      BASE: BASE_URLS.BACKEND_API,
      
      // Authentication
      AUTH_LOGIN: `${BASE_URLS.BACKEND_API}/api/auth/login`,
      AUTH_REGISTER: `${BASE_URLS.BACKEND_API}/api/auth/register`,
      AUTH_LOGOUT: `${BASE_URLS.BACKEND_API}/api/auth/logout`,
      AUTH_REFRESH: `${BASE_URLS.BACKEND_API}/api/auth/refresh`,
      AUTH_VERIFY: `${BASE_URLS.BACKEND_API}/api/auth/verify`,
      
      // Tourists
      TOURISTS: `${BASE_URLS.BACKEND_API}/api/tourists`,
      TOURISTS_SEARCH: `${BASE_URLS.BACKEND_API}/api/tourists/search`,
      
      // Alerts
      ALERTS: `${BASE_URLS.BACKEND_API}/api/alerts`,
      ALERTS_ACTIVE: `${BASE_URLS.BACKEND_API}/api/alerts/active`,
      ALERTS_EMERGENCY: `${BASE_URLS.BACKEND_API}/api/alerts/emergency`,
      
      // Zones
      ZONES: `${BASE_URLS.BACKEND_API}/api/zones`,
      
      // Blockchain
      BLOCKCHAIN_GENERATE_ID: `${BASE_URLS.BACKEND_API}/api/blockchain/generate-id`,
      BLOCKCHAIN_VERIFY_ID: `${BASE_URLS.BACKEND_API}/api/blockchain/verify-id`,
      BLOCKCHAIN_TRANSACTION_STATUS: `${BASE_URLS.BACKEND_API}/api/blockchain/transaction-status`,
      
      // Analytics
      ANALYTICS_DASHBOARD: `${BASE_URLS.BACKEND_API}/api/analytics/dashboard`,
      ANALYTICS_HEATMAP: `${BASE_URLS.BACKEND_API}/api/analytics/heatmap`,
      ANALYTICS_REPORTS: `${BASE_URLS.BACKEND_API}/api/analytics/reports`,
      
      // Mobile
      MOBILE_TRACKING: `${BASE_URLS.BACKEND_API}/api/mobile/tracking`,
      MOBILE_PANIC: `${BASE_URLS.BACKEND_API}/api/mobile/panic`,
      MOBILE_SAFETY_SCORE: `${BASE_URLS.BACKEND_API}/api/mobile/safety-score`,
      MOBILE_KYC_UPLOAD: `${BASE_URLS.BACKEND_API}/api/mobile/kyc-upload`,
      
      // Shared
      SHARED_ALERTS: `${BASE_URLS.BACKEND_API}/api/shared/alerts`,
      SHARED_ZONES: `${BASE_URLS.BACKEND_API}/api/shared/zones`,
      SHARED_TOURISTS: `${BASE_URLS.BACKEND_API}/api/shared/tourists`,
      SHARED_NOTIFICATIONS: `${BASE_URLS.BACKEND_API}/api/shared/notifications`,
      
      // WebSocket
      WEBSOCKET: `${BASE_URLS.BACKEND_API}/api/websocket`,
      
      // Webhooks
      WEBHOOKS_BLOCKCHAIN: `${BASE_URLS.BACKEND_API}/api/webhooks/blockchain`,
      WEBHOOKS_PAYMENT: `${BASE_URLS.BACKEND_API}/api/webhooks/payment`,
    },

    // ============================================================================
    // Mobile App Development (Port 8080)
    // ============================================================================
    MOBILE: {
      BASE: BASE_URLS.MOBILE_APP,
      HOME: `${BASE_URLS.MOBILE_APP}/`,
      WEB_VERSION: `${BASE_URLS.MOBILE_APP}/#/`,
    },

    // ============================================================================
    // Development Server (Port 3001)
    // ============================================================================
    DEV_SERVER: {
      BASE: BASE_URLS.DEV_SERVER,
      HOME: `${BASE_URLS.DEV_SERVER}/`,
    },
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
      ROUTES.DASHBOARD.ADMINISTRATION.ROOT,
      ROUTES.DASHBOARD.OPERATOR.ROOT,
      '/admin',
    ] as string[],
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
      ROUTES.DASHBOARD.ADMINISTRATION.ROOT,
      ROUTES.DASHBOARD.OPERATOR.ROOT,
    ] as string[],
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
      ROUTES.DASHBOARD.OPERATOR.ROOT,
      ROUTES.DASHBOARD.SETTINGS.PROFILE,
      ROUTES.DASHBOARD.SETTINGS.PREFERENCES,
      ROUTES.DASHBOARD.SETTINGS.NOTIFICATIONS,
    ] as string[],
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
    ] as string[],
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

  // Add operator-specific navigation
  if (permissions.canAccess.includes(ROUTES.DASHBOARD.OPERATOR.ROOT)) {
    baseNavigation.push({
      name: 'My Assignments',
      href: ROUTES.DASHBOARD.OPERATOR.ROOT as any,
      icon: 'Briefcase',
      description: 'Operator assignments and workload'
    });
  }

  // Add settings for users with settings access
  if (permissions.canAccess.includes(ROUTES.DASHBOARD.SETTINGS.ROOT) || 
      permissions.canAccess.includes(ROUTES.DASHBOARD.SETTINGS.PROFILE)) {
    baseNavigation.push({
      name: 'Settings',
      href: ROUTES.DASHBOARD.SETTINGS.ROOT as any,
      icon: 'User',
      description: 'Personal settings and preferences'
    });
  }

  // Add administration if user has permission
  if (permissions.canAccess.includes(ROUTES.DASHBOARD.ADMINISTRATION.ROOT)) {
    baseNavigation.push({
      name: 'Administration',
      href: ROUTES.DASHBOARD.ADMINISTRATION.ROOT as any,
      icon: 'Settings',
      description: 'User management and administration'
    });
  }

  // Add admin navigation if user has permission
  if (permissions.canAccessAdmin) {
    baseNavigation.push({
      name: 'System Admin',
      href: '/admin' as any, // Admin routes are separate
      icon: 'Shield',
      description: 'System administration and configuration'
    });
  }

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
// ROUTE UTILITIES AND HELPERS
// ============================================================================

/**
 * Get complete localhost URL for any route
 */
export function getLocalhostUrl(route: string, port: number = 8001): string {
  const baseUrl = port === 8001 ? BASE_URLS.WEB_DASHBOARD : 
                  port === 3001 ? BASE_URLS.BACKEND_API :      // Backend runs on 3001
                  port === 8080 ? BASE_URLS.MOBILE_APP :
                  `http://localhost:${port}`;
  
  return `${baseUrl}${route}`;
}

/**
 * Get all available routes for a specific role
 */
export function getAllRoutesForRole(userRole: UserRole): string[] {
  const permissions = ROLE_PERMISSIONS[userRole];
  return permissions.canAccess;
}

/**
 * Get all API endpoints as localhost URLs
 */
export function getAllApiEndpoints(): Record<string, string> {
  const endpoints: Record<string, string> = {};
  
  // Authentication endpoints
  Object.entries(ROUTES.API.AUTH).forEach(([key, value]) => {
    endpoints[`AUTH_${key}`] = `${BASE_URLS.BACKEND_API}${value}`;
  });
  
  // Tourist endpoints
  endpoints['TOURISTS_BASE'] = `${BASE_URLS.BACKEND_API}${ROUTES.API.TOURISTS.BASE}`;
  endpoints['TOURISTS_SEARCH'] = `${BASE_URLS.BACKEND_API}${ROUTES.API.TOURISTS.SEARCH}`;
  
  // Alert endpoints
  Object.entries(ROUTES.API.ALERTS).forEach(([key, value]) => {
    if (typeof value === 'string') {
      endpoints[`ALERTS_${key}`] = `${BASE_URLS.BACKEND_API}${value}`;
    }
  });
  
  // Blockchain endpoints
  Object.entries(ROUTES.API.BLOCKCHAIN).forEach(([key, value]) => {
    if (typeof value === 'string') {
      endpoints[`BLOCKCHAIN_${key}`] = `${BASE_URLS.BACKEND_API}${value}`;
    }
  });
  
  return endpoints;
}

/**
 * Get all dashboard routes as localhost URLs
 */
export function getAllDashboardRoutes(): Record<string, string> {
  const routes: Record<string, string> = {};
  
  // Main dashboard routes
  routes['OVERVIEW'] = `${BASE_URLS.WEB_DASHBOARD}${ROUTES.DASHBOARD.OVERVIEW}`;
  routes['TOURISTS'] = `${BASE_URLS.WEB_DASHBOARD}${ROUTES.DASHBOARD.TOURISTS.ROOT}`;
  routes['ALERTS'] = `${BASE_URLS.WEB_DASHBOARD}${ROUTES.DASHBOARD.ALERTS.ROOT}`;
  routes['ZONES'] = `${BASE_URLS.WEB_DASHBOARD}${ROUTES.DASHBOARD.ZONES.ROOT}`;
  routes['ANALYTICS'] = `${BASE_URLS.WEB_DASHBOARD}${ROUTES.DASHBOARD.ANALYTICS.ROOT}`;
  routes['BLOCKCHAIN'] = `${BASE_URLS.WEB_DASHBOARD}${ROUTES.DASHBOARD.BLOCKCHAIN.ROOT}`;
  routes['SETTINGS'] = `${BASE_URLS.WEB_DASHBOARD}${ROUTES.DASHBOARD.SETTINGS.ROOT}`;
  
  // Sub-routes
  routes['ALERTS_ACTIVE'] = `${BASE_URLS.WEB_DASHBOARD}${ROUTES.DASHBOARD.ALERTS.ACTIVE}`;
  routes['ALERTS_HISTORY'] = `${BASE_URLS.WEB_DASHBOARD}${ROUTES.DASHBOARD.ALERTS.HISTORY}`;
  routes['ANALYTICS_HEATMAP'] = `${BASE_URLS.WEB_DASHBOARD}${ROUTES.DASHBOARD.ANALYTICS.HEATMAP}`;
  routes['ANALYTICS_REPORTS'] = `${BASE_URLS.WEB_DASHBOARD}${ROUTES.DASHBOARD.ANALYTICS.REPORTS}`;
  routes['BLOCKCHAIN_GENERATE'] = `${BASE_URLS.WEB_DASHBOARD}${ROUTES.DASHBOARD.BLOCKCHAIN.GENERATE}`;
  routes['BLOCKCHAIN_VERIFY'] = `${BASE_URLS.WEB_DASHBOARD}${ROUTES.DASHBOARD.BLOCKCHAIN.VERIFY}`;
  
  return routes;
}

/**
 * Generate a complete sitemap of all routes
 */
export function generateSitemap(): Record<string, any> {
  return {
    meta: {
      projectName: 'Smart Tourist Safety System - SIH 2025',
      totalRoutes: Object.keys(ROUTES).length,
      baseUrls: BASE_URLS,
      generatedAt: new Date().toISOString(),
    },
    routes: {
      public: {
        HOME: getLocalhostUrl(ROUTES.HOME),
        ABOUT: getLocalhostUrl(ROUTES.ABOUT),
        CONTACT: getLocalhostUrl(ROUTES.CONTACT),
        HELP: getLocalhostUrl(ROUTES.HELP),
        SUPPORT: getLocalhostUrl(ROUTES.SUPPORT),
        PROFILE: getLocalhostUrl(ROUTES.PROFILE),
        EMERGENCY: getLocalhostUrl(ROUTES.EMERGENCY),
      },
      auth: {
        LOGIN: getLocalhostUrl(ROUTES.AUTH.LOGIN),
        REGISTER: getLocalhostUrl(ROUTES.AUTH.REGISTER),
        LOGOUT: getLocalhostUrl(ROUTES.AUTH.LOGOUT),
        ERROR: getLocalhostUrl(ROUTES.AUTH.ERROR),
      },
      dashboard: getAllDashboardRoutes(),
      api: getAllApiEndpoints(),
      demo: {
        INTEGRATION: getLocalhostUrl(ROUTES.DEMO.INTEGRATION),
        MOBILE_SIMULATOR: getLocalhostUrl(ROUTES.DEMO.MOBILE_SIMULATOR),
        TRANSITIONS: getLocalhostUrl(ROUTES.DEMO.TRANSITIONS),
      },
      admin: {
        ROOT: getLocalhostUrl(ROUTES.ADMIN.ROOT),
        USERS: getLocalhostUrl(ROUTES.ADMIN.USERS),
        CREATE_USER: getLocalhostUrl(ROUTES.ADMIN.CREATE_USER),
      },
      testing: {
        THEME_TEST: getLocalhostUrl(ROUTES.DEV.THEME_TEST),
        CSS_DEBUG: getLocalhostUrl(ROUTES.DEV.CSS_DEBUG),
        TEST_COMPONENTS: getLocalhostUrl(ROUTES.DEV.TEST_COMPONENTS),
      }
    },
    permissions: ROLE_PERMISSIONS,
  };
}

/**
 * Quick access to commonly used localhost URLs
 */
export const QUICK_ACCESS = {
  // Primary Dashboard
  DASHBOARD: `${BASE_URLS.WEB_DASHBOARD}/dashboard/overview`,
  
  // Authentication
  LOGIN: `${BASE_URLS.WEB_DASHBOARD}/login`,
  
  // Main Features
  TOURISTS: `${BASE_URLS.WEB_DASHBOARD}/dashboard/tourists`,
  ALERTS: `${BASE_URLS.WEB_DASHBOARD}/dashboard/alerts`,
  ANALYTICS: `${BASE_URLS.WEB_DASHBOARD}/dashboard/analytics`,
  BLOCKCHAIN: `${BASE_URLS.WEB_DASHBOARD}/dashboard/blockchain`,
  
  // Demo & Testing
  DEMO_INTEGRATION: `${BASE_URLS.WEB_DASHBOARD}/demo/integration`,
  MOBILE_SIMULATOR: `${BASE_URLS.WEB_DASHBOARD}/demo/mobile-simulator`,
  
  // API Base
  API_BASE: BASE_URLS.BACKEND_API,
  
  // Mobile App
  MOBILE_APP: BASE_URLS.MOBILE_APP,
} as const;

/**
 * Development environment URLs for different services
 */
export const DEV_SERVICES = {
  WEB_DASHBOARD: {
    name: 'Web Dashboard',
    url: BASE_URLS.WEB_DASHBOARD,
    port: 8001,
    status: 'Active',
    description: 'Main government dashboard interface (Next.js frontend)'
  },
  BACKEND_API: {
    name: 'Backend API Server',
    url: BASE_URLS.BACKEND_API,
    port: 3001,
    status: 'Active',
    description: 'Backend Next.js server with API routes and blockchain services'
  },
  MOBILE_APP: {
    name: 'Mobile App (Web)',
    url: BASE_URLS.MOBILE_APP,
    port: 8080,
    status: 'Development',
    description: 'Flutter mobile app web version'
  },
  DEV_SERVER: {
    name: 'Development Server',
    url: BASE_URLS.DEV_SERVER,
    port: 3001,
    status: 'Same as Backend',
    description: 'Combined with Backend API Server (same Next.js instance)'
  },
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

export default ROUTES;

// Type exports for TypeScript
export type RouteKeys = keyof typeof ROUTES;
export type DashboardRouteKeys = keyof typeof ROUTES.DASHBOARD;
export type ApiRouteKeys = keyof typeof ROUTES.API;
export type LocalhostRouteKeys = keyof typeof ROUTES.LOCALHOST;

// ============================================================================
// CONSOLE HELPER FOR DEVELOPMENT
// ============================================================================

/**
 * Development helper: Log all available routes to console
 * Usage: logAllRoutes() in browser console
 */
export function logAllRoutes(): void {
  console.group('🚀 Smart Tourist Safety System - All Routes');
  
  console.group('📊 Quick Access URLs');
  Object.entries(QUICK_ACCESS).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
  console.groupEnd();
  
  console.group('🌐 Development Services');
  Object.entries(DEV_SERVICES).forEach(([key, service]) => {
    console.log(`${service.name} (${service.status}): ${service.url}`);
  });
  console.groupEnd();
  
  console.group('🛠️ API Endpoints');
  const apiEndpoints = getAllApiEndpoints();
  Object.entries(apiEndpoints).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
  console.groupEnd();
  
  console.group('📱 Dashboard Routes');
  const dashboardRoutes = getAllDashboardRoutes();
  Object.entries(dashboardRoutes).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
  console.groupEnd();
  
  console.groupEnd();
}

// Make it available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).logAllRoutes = logAllRoutes;
  (window as any).ROUTES = ROUTES;
  (window as any).QUICK_ACCESS = QUICK_ACCESS;
  console.log('🚀 Routes helper loaded! Use logAllRoutes() to see all available routes.');
}
