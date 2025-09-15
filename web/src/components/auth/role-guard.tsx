/**
 * Smart Tourist Safety System - Role Guard Component
 * Component-level protection based on roles and permissions
 */

'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { UserRole, Permission } from '@/types/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Lock, ShieldOff } from 'lucide-react';

// ============================================================================
// INTERFACES
// ============================================================================

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: Permission[];
  requireAll?: boolean; // require all permissions vs any
  fallback?: React.ReactNode;
  fallbackComponent?: React.ComponentType<{ reason: string }>;
  hideIfUnauthorized?: boolean;
  showLoading?: boolean;
  onUnauthorized?: (reason: string) => void;
  className?: string;
}

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: Permission;
  fallback?: React.ReactNode;
  hideIfUnauthorized?: boolean;
}

interface RoleOnlyProps {
  children: React.ReactNode;
  role: UserRole;
  fallback?: React.ReactNode;
  hideIfUnauthorized?: boolean;
}

// ============================================================================
// DEFAULT FALLBACK COMPONENTS
// ============================================================================

const DefaultUnauthorizedComponent: React.FC<{ reason: string }> = ({ reason }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
  >
    <ShieldOff className="w-12 h-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      Access Denied
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
      {reason}
    </p>
  </motion.div>
);

const MinimalUnauthorizedComponent: React.FC = () => (
  <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
    <Lock className="w-4 h-4 text-yellow-600" />
    <span className="text-sm text-yellow-800 dark:text-yellow-400">
      Restricted Access
    </span>
  </div>
);

const LoadingComponent: React.FC = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
      Checking permissions...
    </span>
  </div>
);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if user has required roles
 */
function hasRequiredRoles(userRoles: UserRole[], requiredRoles: UserRole[]): boolean {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }
  
  return requiredRoles.some(role => userRoles.includes(role));
}

/**
 * Check if user has required permissions
 */
function hasRequiredPermissions(
  userPermissions: Permission[], 
  requiredPermissions: Permission[], 
  requireAll: boolean = false
): boolean {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }
  
  if (requireAll) {
    return requiredPermissions.every(permission => userPermissions.includes(permission));
  } else {
    return requiredPermissions.some(permission => userPermissions.includes(permission));
  }
}

/**
 * Generate reason message for unauthorized access
 */
function getUnauthorizedReason(
  userRoles: UserRole[],
  userPermissions: Permission[],
  requiredRoles?: UserRole[],
  requiredPermissions?: Permission[],
  requireAll?: boolean
): string {
  const reasons: string[] = [];
  
  if (requiredRoles && !hasRequiredRoles(userRoles, requiredRoles)) {
    reasons.push(`Required role${requiredRoles.length > 1 ? 's' : ''}: ${requiredRoles.join(', ')}`);
  }
  
  if (requiredPermissions && !hasRequiredPermissions(userPermissions, requiredPermissions, requireAll)) {
    const permissionText = requireAll ? 'all of the following permissions' : 'one of the following permissions';
    reasons.push(`Required ${permissionText}: ${requiredPermissions.join(', ')}`);
  }
  
  if (reasons.length === 0) {
    return 'You do not have sufficient privileges to access this content.';
  }
  
  return `Access requires: ${reasons.join(' and ')}.`;
}

// ============================================================================
// MAIN ROLE GUARD COMPONENT
// ============================================================================

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRoles,
  requiredPermissions,
  requireAll = false,
  fallback,
  fallbackComponent: FallbackComponent = DefaultUnauthorizedComponent,
  hideIfUnauthorized = false,
  showLoading = true,
  onUnauthorized,
  className
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  // Show loading state
  if (isLoading && showLoading) {
    return <LoadingComponent />;
  }
  
  // Not authenticated
  if (!isAuthenticated || !user) {
    const reason = 'You must be logged in to access this content.';
    
    if (onUnauthorized) {
      onUnauthorized(reason);
    }
    
    if (hideIfUnauthorized) {
      return null;
    }
    
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return <FallbackComponent reason={reason} />;
  }
  
  // Check role requirements
  const userRoles = user.role ? [user.role] : [];
  const hasRoles = hasRequiredRoles(userRoles, requiredRoles || []);
  
  // Check permission requirements
  const userPermissions = user.permissions || [];
  const hasPermissions = hasRequiredPermissions(
    userPermissions, 
    requiredPermissions || [], 
    requireAll
  );
  
  // Check if user meets requirements
  const isAuthorized = hasRoles && hasPermissions;
  
  if (!isAuthorized) {
    const reason = getUnauthorizedReason(
      userRoles,
      userPermissions,
      requiredRoles,
      requiredPermissions,
      requireAll
    );
    
    if (onUnauthorized) {
      onUnauthorized(reason);
    }
    
    if (hideIfUnauthorized) {
      return null;
    }
    
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return <FallbackComponent reason={reason} />;
  }
  
  // User is authorized, render children
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key="authorized-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// SPECIALIZED GUARD COMPONENTS
// ============================================================================

/**
 * Simple permission guard for single permission check
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  fallback,
  hideIfUnauthorized = false
}) => {
  return (
    <RoleGuard
      requiredPermissions={[permission]}
      fallback={fallback}
      hideIfUnauthorized={hideIfUnauthorized}
      fallbackComponent={MinimalUnauthorizedComponent}
    >
      {children}
    </RoleGuard>
  );
};

/**
 * Simple role guard for single role check
 */
export const RoleOnly: React.FC<RoleOnlyProps> = ({
  children,
  role,
  fallback,
  hideIfUnauthorized = false
}) => {
  return (
    <RoleGuard
      requiredRoles={[role]}
      fallback={fallback}
      hideIfUnauthorized={hideIfUnauthorized}
      fallbackComponent={MinimalUnauthorizedComponent}
    >
      {children}
    </RoleGuard>
  );
};

/**
 * Admin only component
 */
export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback
}) => {
  return (
    <RoleOnly role="super_admin" fallback={fallback}>
      {children}
    </RoleOnly>
  );
};

/**
 * Staff and above component
 */
export const StaffOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({
  children,
  fallback
}) => {
  return (
    <RoleGuard requiredRoles={['super_admin', 'operator']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
};

// ============================================================================
// HOOK FOR CONDITIONAL RENDERING
// ============================================================================

export const useRoleGuard = () => {
  const { user, isAuthenticated } = useAuth();
  
  const checkRole = (requiredRole: UserRole): boolean => {
    if (!isAuthenticated || !user) return false;
    return user.role === requiredRole;
  };
  
  const checkRoles = (requiredRoles: UserRole[]): boolean => {
    if (!isAuthenticated || !user) return false;
    return requiredRoles.includes(user.role);
  };
  
  const checkPermission = (requiredPermission: Permission): boolean => {
    if (!isAuthenticated || !user) return false;
    return user.permissions?.includes(requiredPermission) || false;
  };
  
  const checkPermissions = (requiredPermissions: Permission[], requireAll: boolean = false): boolean => {
    if (!isAuthenticated || !user || !user.permissions) return false;
    
    if (requireAll) {
      return requiredPermissions.every(permission => user.permissions!.includes(permission));
    } else {
      return requiredPermissions.some(permission => user.permissions!.includes(permission));
    }
  };
  
  const isAdmin = (): boolean => checkRole('super_admin');
  const isStaff = (): boolean => checkRoles(['super_admin', 'operator']);
  const isViewer = (): boolean => checkRole('viewer');
  
  return {
    checkRole,
    checkRoles,
    checkPermission,
    checkPermissions,
    isAdmin,
    isStaff,
    isViewer,
    isAuthenticated,
    user
  };
};

// ============================================================================
// HOC FOR COMPONENT PROTECTION
// ============================================================================

export function withRoleGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  guardProps: Omit<RoleGuardProps, 'children'>
) {
  const ComponentWithRoleGuard = (props: P) => {
    return (
      <RoleGuard {...guardProps}>
        <WrappedComponent {...props} />
      </RoleGuard>
    );
  };
  
  ComponentWithRoleGuard.displayName = `withRoleGuard(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return ComponentWithRoleGuard;
}

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

/**
 * Show content only when user is authenticated
 */
export const AuthenticatedOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
};

/**
 * Show content only when user is not authenticated
 */
export const UnauthenticatedOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default RoleGuard;