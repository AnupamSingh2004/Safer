/**
 * Smart Tourist Safety System - Centralized Routes Configuration
 * Type-safe route definitions for the entire application
 */

// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================

export const ROUTES = {
  // Public Routes
  HOME: '/',
  
  // Authentication Routes
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // Dashboard Routes
  DASHBOARD: {
    ROOT: '/dashboard',
    
    // Tourist Management
    TOURISTS: {
      ROOT: '/dashboard/tourists',
      ALL: '/dashboard/tourists',
      REGISTER: '/dashboard/tourists/register',
      CHECKINS: '/dashboard/tourists/checkins',
      PROFILE: (id: string) => `/dashboard/tourists/${id}`,
      EDIT: (id: string) => `/dashboard/tourists/${id}/edit`,
      HISTORY: '/dashboard/tourists/history',
      REPORTS: '/dashboard/tourists/reports',
      SEARCH: '/dashboard/tourists/search',
    },

    // Safety Alerts
    ALERTS: {
      ROOT: '/dashboard/alerts',
      ALL: '/dashboard/alerts',
      EMERGENCY: '/dashboard/alerts/emergency',
      HISTORY: '/dashboard/alerts/history',
      DETAILS: (id: string) => `/dashboard/alerts/${id}`,
      CREATE: '/dashboard/alerts/create',
      EDIT: (id: string) => `/dashboard/alerts/${id}/edit`,
    },

    // Zone Management
    ZONES: {
      ROOT: '/dashboard/zones',
      ALL: '/dashboard/zones',
      RISK: '/dashboard/zones/risk',
      GEOFENCES: '/dashboard/zones/geofences',
      HOTSPOTS: '/dashboard/zones/hotspots',
      CREATE: '/dashboard/zones/create',
      DETAILS: (id: string) => `/dashboard/zones/${id}`,
      EDIT: (id: string) => `/dashboard/zones/${id}/edit`,
    },

    // Digital Identity & Blockchain
    BLOCKCHAIN: {
      ROOT: '/dashboard/blockchain',
      IDENTITIES: '/dashboard/blockchain/identities',
      GENERATE: '/dashboard/blockchain/generate',
      VERIFY: '/dashboard/blockchain/verify',
      TRANSACTIONS: '/dashboard/blockchain/transactions',
      RECORDS: '/dashboard/blockchain/records',
    },

    // Analytics & Reports
    ANALYTICS: {
      ROOT: '/dashboard/analytics',
      OVERVIEW: '/dashboard/analytics/overview',
      TOURISTS: '/dashboard/analytics/tourists',
      ALERTS: '/dashboard/analytics/alerts',
      ZONES: '/dashboard/analytics/zones',
      REPORTS: '/dashboard/analytics/reports',
      REAL_TIME: '/dashboard/analytics/real-time',
    },

    // Communication
    COMMUNICATION: {
      ROOT: '/dashboard/communication',
      MESSAGING: '/dashboard/communication/messaging',
      NOTIFICATIONS: '/dashboard/communication/notifications',
      BROADCASTS: '/dashboard/communication/broadcasts',
      TEMPLATES: '/dashboard/communication/templates',
    },

    // Mobile Integration
    MOBILE: {
      ROOT: '/dashboard/mobile',
      ANALYTICS: '/dashboard/mobile/analytics',
      NOTIFICATIONS: '/dashboard/mobile/notifications',
      QR_CODES: '/dashboard/mobile/qr-codes',
      API_KEYS: '/dashboard/mobile/api-keys',
    },

    // System Administration
    ADMIN: {
      ROOT: '/dashboard/admin',
      USERS: '/dashboard/admin/users',
      SETTINGS: '/dashboard/admin/settings',
      LOGS: '/dashboard/admin/logs',
      PERMISSIONS: '/dashboard/admin/permissions',
      BACKUP: '/dashboard/admin/backup',
    },

    // Reports
    REPORTS: {
      ROOT: '/dashboard/reports',
      GENERATE: '/dashboard/reports/generate',
      SCHEDULED: '/dashboard/reports/scheduled',
      TEMPLATES: '/dashboard/reports/templates',
      HISTORY: '/dashboard/reports/history',
    },

    // Settings
    SETTINGS: {
      ROOT: '/dashboard/settings',
      PROFILE: '/dashboard/settings/profile',
      PREFERENCES: '/dashboard/settings/preferences',
      SECURITY: '/dashboard/settings/security',
      NOTIFICATIONS: '/dashboard/settings/notifications',
      API: '/dashboard/settings/api',
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
   * Navigate to tourist profile
   */
  static touristProfile(id: string): string {
    return ROUTES.DASHBOARD.TOURISTS.PROFILE(id);
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
