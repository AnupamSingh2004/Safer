/**
 * Smart Tourist Safety System - Permissions Hook
 * Custom React hook for permission checking and role validation
 */

'use client';

import { useMemo, useCallback } from 'react';
import type { User, UserRole, Permission } from '@/types/auth';

// ============================================================================
// INTERFACES
// ============================================================================

interface PermissionContext {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface PermissionHookReturn {
  // Role checking
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasAllRoles: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
  isStaff: () => boolean;
  isViewer: () => boolean;
  
  // Permission checking
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  
  // Feature access
  canViewDashboard: () => boolean;
  canManageUsers: () => boolean;
  canManageTourists: () => boolean;
  canManageAlerts: () => boolean;
  canManageZones: () => boolean;
  canViewAnalytics: () => boolean;
  canAccessSettings: () => boolean;
  canEmergencyResponse: () => boolean;
  canManageBlockchain: () => boolean;
  
  // Utility functions
  getUserRoles: () => UserRole[];
  getUserPermissions: () => Permission[];
  canAccessRoute: (route: string) => boolean;
  getAccessLevel: () => 'admin' | 'staff' | 'viewer' | 'guest';
}

// ============================================================================
// PERMISSION DEFINITIONS
// ============================================================================

const ROUTE_PERMISSIONS: Record<string, { roles?: UserRole[], permissions?: Permission[] }> = {
  '/dashboard': { permissions: ['view_dashboard'] },
  '/admin': { roles: ['super_admin'], permissions: ['system_admin'] },
  '/users': { roles: ['super_admin'], permissions: ['manage_users'] },
  '/tourists': { roles: ['super_admin', 'operator'], permissions: ['view_tourists'] },
  '/alerts': { roles: ['super_admin', 'operator'], permissions: ['view_alerts'] },
  '/zones': { roles: ['super_admin', 'operator'], permissions: ['view_zones'] },
  '/analytics': { roles: ['super_admin', 'operator'], permissions: ['view_analytics'] },
  '/settings': { roles: ['super_admin'], permissions: ['manage_settings'] },
  '/blockchain': { roles: ['super_admin', 'operator'], permissions: ['view_blockchain'] },
  '/emergency': { roles: ['super_admin', 'operator'], permissions: ['emergency_response'] }
};

const FEATURE_PERMISSIONS: Record<string, Permission[]> = {
  dashboard: ['view_dashboard'],
  userManagement: ['manage_users'],
  touristManagement: ['view_tourists', 'create_tourist', 'update_tourist'],
  alertManagement: ['view_alerts', 'create_alert', 'update_alert'],
  zoneManagement: ['view_zones', 'create_zone', 'update_zone'],
  analytics: ['view_analytics'],
  settings: ['manage_settings'],
  emergencyResponse: ['emergency_response'],
  blockchain: ['view_blockchain', 'manage_blockchain']
};

// ============================================================================
// ROLE HIERARCHY
// ============================================================================

const ROLE_HIERARCHY: Record<UserRole, number> = {
  'super_admin': 100,
  'operator': 50,
  'viewer': 10
};

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  'super_admin': [
    'view_dashboard', 'manage_dashboard', 'view_analytics', 'export_data',
    'view_tourists', 'create_tourist', 'update_tourist', 'delete_tourist', 'view_tourist_details', 'track_tourist',
    'view_alerts', 'create_alert', 'update_alert', 'delete_alert', 'resolve_alert', 'escalate_alert', 'emergency_response',
    'view_zones', 'create_zone', 'update_zone', 'delete_zone', 'manage_geofencing',
    'view_blockchain', 'manage_blockchain', 'generate_digital_id', 'verify_digital_id',
    'manage_users', 'manage_settings', 'view_logs', 'system_admin'
  ],
  'operator': [
    'view_dashboard', 'view_analytics',
    'view_tourists', 'create_tourist', 'update_tourist', 'view_tourist_details', 'track_tourist',
    'view_alerts', 'create_alert', 'update_alert', 'resolve_alert', 'emergency_response',
    'view_zones', 'create_zone', 'update_zone', 'manage_geofencing',
    'view_blockchain', 'generate_digital_id', 'verify_digital_id'
  ],
  'viewer': [
    'view_dashboard',
    'view_tourists', 'view_tourist_details',
    'view_alerts',
    'view_zones',
    'view_blockchain'
  ]
};

// ============================================================================
// MAIN HOOK
// ============================================================================

export const usePermissions = (context: PermissionContext): PermissionHookReturn => {
  const { user, isAuthenticated, isLoading } = context;
  
  // Memoized user data
  const userRoles = useMemo(() => {
    if (!user || !isAuthenticated) return [];
    return user.role ? [user.role] : [];
  }, [user, isAuthenticated]);
  
  const userPermissions = useMemo(() => {
    if (!user || !isAuthenticated) return [];
    
    // Get permissions from user object
    const directPermissions = user.permissions || [];
    
    // Get permissions from roles
    const rolePermissions = userRoles.flatMap(role => ROLE_PERMISSIONS[role] || []);
    
    // Combine and deduplicate
    return Array.from(new Set([...directPermissions, ...rolePermissions]));
  }, [user, isAuthenticated, userRoles]);
  
  // Role checking functions
  const hasRole = useCallback((role: UserRole): boolean => {
    if (!isAuthenticated || isLoading) return false;
    return userRoles.includes(role);
  }, [userRoles, isAuthenticated, isLoading]);
  
  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    if (!isAuthenticated || isLoading) return false;
    return roles.some(role => userRoles.includes(role));
  }, [userRoles, isAuthenticated, isLoading]);
  
  const hasAllRoles = useCallback((roles: UserRole[]): boolean => {
    if (!isAuthenticated || isLoading) return false;
    return roles.every(role => userRoles.includes(role));
  }, [userRoles, isAuthenticated, isLoading]);
  
  // Permission checking functions
  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!isAuthenticated || isLoading) return false;
    return userPermissions.includes(permission);
  }, [userPermissions, isAuthenticated, isLoading]);
  
  const hasAnyPermission = useCallback((permissions: Permission[]): boolean => {
    if (!isAuthenticated || isLoading) return false;
    return permissions.some(permission => userPermissions.includes(permission));
  }, [userPermissions, isAuthenticated, isLoading]);
  
  const hasAllPermissions = useCallback((permissions: Permission[]): boolean => {
    if (!isAuthenticated || isLoading) return false;
    return permissions.every(permission => userPermissions.includes(permission));
  }, [userPermissions, isAuthenticated, isLoading]);
  
  // Role shortcuts
  const isAdmin = useCallback(() => hasRole('super_admin'), [hasRole]);
  const isStaff = useCallback(() => hasAnyRole(['super_admin', 'operator']), [hasAnyRole]);
  const isViewer = useCallback(() => hasRole('viewer'), [hasRole]);
  
  // Feature access functions
  const canViewDashboard = useCallback(() => hasPermission('view_dashboard'), [hasPermission]);
  const canManageUsers = useCallback(() => hasPermission('manage_users'), [hasPermission]);
  const canManageTourists = useCallback(() => hasAnyPermission(['create_tourist', 'update_tourist', 'delete_tourist']), [hasAnyPermission]);
  const canManageAlerts = useCallback(() => hasAnyPermission(['create_alert', 'update_alert', 'delete_alert']), [hasAnyPermission]);
  const canManageZones = useCallback(() => hasAnyPermission(['create_zone', 'update_zone', 'delete_zone']), [hasAnyPermission]);
  const canViewAnalytics = useCallback(() => hasPermission('view_analytics'), [hasPermission]);
  const canAccessSettings = useCallback(() => hasPermission('manage_settings'), [hasPermission]);
  const canEmergencyResponse = useCallback(() => hasPermission('emergency_response'), [hasPermission]);
  const canManageBlockchain = useCallback(() => hasPermission('manage_blockchain'), [hasPermission]);
  
  // Route access checking
  const canAccessRoute = useCallback((route: string): boolean => {
    if (!isAuthenticated || isLoading) return false;
    
    const routeConfig = ROUTE_PERMISSIONS[route];
    if (!routeConfig) return true; // No restrictions
    
    // Check roles
    if (routeConfig.roles && !hasAnyRole(routeConfig.roles)) {
      return false;
    }
    
    // Check permissions
    if (routeConfig.permissions && !hasAnyPermission(routeConfig.permissions)) {
      return false;
    }
    
    return true;
  }, [isAuthenticated, isLoading, hasAnyRole, hasAnyPermission]);
  
  // Access level
  const getAccessLevel = useCallback((): 'admin' | 'staff' | 'viewer' | 'guest' => {
    if (!isAuthenticated) return 'guest';
    if (isAdmin()) return 'admin';
    if (isStaff()) return 'staff';
    if (isViewer()) return 'viewer';
    return 'guest';
  }, [isAuthenticated, isAdmin, isStaff, isViewer]);
  
  // Utility functions
  const getUserRoles = useCallback(() => userRoles, [userRoles]);
  const getUserPermissions = useCallback(() => userPermissions, [userPermissions]);
  
  return {
    // Role checking
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isStaff,
    isViewer,
    
    // Permission checking
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    
    // Feature access
    canViewDashboard,
    canManageUsers,
    canManageTourists,
    canManageAlerts,
    canManageZones,
    canViewAnalytics,
    canAccessSettings,
    canEmergencyResponse,
    canManageBlockchain,
    
    // Utility functions
    getUserRoles,
    getUserPermissions,
    canAccessRoute,
    getAccessLevel
  };
};

// ============================================================================
// PERMISSION CHECKER UTILITY
// ============================================================================

export class PermissionChecker {
  private user: User | null;
  private isAuthenticated: boolean;
  
  constructor(user: User | null, isAuthenticated: boolean) {
    this.user = user;
    this.isAuthenticated = isAuthenticated;
  }
  
  hasRole(role: UserRole): boolean {
    if (!this.isAuthenticated || !this.user) return false;
    return this.user.role === role;
  }
  
  hasAnyRole(roles: UserRole[]): boolean {
    if (!this.isAuthenticated || !this.user) return false;
    return roles.includes(this.user.role);
  }
  
  hasPermission(permission: Permission): boolean {
    if (!this.isAuthenticated || !this.user) return false;
    
    const userPermissions = this.user.permissions || [];
    const rolePermissions = ROLE_PERMISSIONS[this.user.role] || [];
    
    return userPermissions.includes(permission) || rolePermissions.includes(permission);
  }
  
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }
  
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }
  
  canAccessRoute(route: string): boolean {
    if (!this.isAuthenticated) return false;
    
    const routeConfig = ROUTE_PERMISSIONS[route];
    if (!routeConfig) return true;
    
    if (routeConfig.roles && !this.hasAnyRole(routeConfig.roles)) {
      return false;
    }
    
    if (routeConfig.permissions && !this.hasAnyPermission(routeConfig.permissions)) {
      return false;
    }
    
    return true;
  }
}

// ============================================================================
// PERMISSION VALIDATION HELPERS
// ============================================================================

export const validatePermissions = {
  /**
   * Check if user can perform CRUD operations on tourists
   */
  tourists: {
    canView: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('view_tourists'),
    canCreate: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('create_tourist'),
    canUpdate: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('update_tourist'),
    canDelete: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('delete_tourist'),
    canTrack: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('track_tourist')
  },
  
  /**
   * Check if user can perform CRUD operations on alerts
   */
  alerts: {
    canView: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('view_alerts'),
    canCreate: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('create_alert'),
    canUpdate: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('update_alert'),
    canDelete: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('delete_alert'),
    canResolve: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('resolve_alert'),
    canEscalate: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('escalate_alert')
  },
  
  /**
   * Check if user can perform operations on zones
   */
  zones: {
    canView: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('view_zones'),
    canCreate: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('create_zone'),
    canUpdate: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('update_zone'),
    canDelete: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('delete_zone'),
    canManageGeofencing: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('manage_geofencing')
  },
  
  /**
   * Check system-level permissions
   */
  system: {
    canManageUsers: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('manage_users'),
    canManageSettings: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('manage_settings'),
    canViewLogs: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('view_logs'),
    canSystemAdmin: (user: User | null) => new PermissionChecker(user, !!user).hasPermission('system_admin')
  }
};

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default usePermissions;