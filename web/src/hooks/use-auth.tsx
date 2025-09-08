/**
 * Smart Tourist Safety System - Authentication Hooks
 * Additional hooks for authentication, authorization, and session management
 */

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import type { UserRole, Permission } from '@/types/auth';

// ============================================================================
// PERMISSION MANAGEMENT HOOK
// ============================================================================

export function usePermissions() {
  const { user } = useAuthStore();
  
  const hasPermission = (permission: Permission): boolean => {
    if (!user || user.status !== 'active') return false;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!user || user.status !== 'active') return false;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!user || user.status !== 'active') return false;
    return permissions.every(permission => user.permissions.includes(permission));
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user || user.status !== 'active') return false;
    return user.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user || user.status !== 'active') return false;
    return roles.includes(user.role);
  };

  // Role hierarchy check (higher roles include lower role permissions)
  const hasRoleOrHigher = (role: UserRole): boolean => {
    if (!user || user.status !== 'active') return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      'viewer': 1,
      'operator': 2,
      'police_admin': 3,
      'tourism_admin': 3,
      'super_admin': 4,
    };

    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[role] || 0;
    
    return userRoleLevel >= requiredRoleLevel;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasRoleOrHigher,
    userRole: user?.role,
    userPermissions: user?.permissions || [],
  };
}

// ============================================================================
// ROUTE PROTECTION HOOK
// ============================================================================

interface UseAuthGuardOptions {
  requiredRole?: UserRole;
  requiredRoles?: UserRole[];
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  requireAll?: boolean; // If true, requires ALL permissions, otherwise ANY
  redirectTo?: string;
  redirectIfAuthenticated?: string;
  allowUnauthenticated?: boolean;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, isInitialized, user } = useAuthStore();
  const { hasRole, hasAnyRole, hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();
  
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isInitialized) return;

    setIsChecking(true);

    // If user is not authenticated
    if (!isAuthenticated) {
      if (options.allowUnauthenticated) {
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }
      
      setIsAuthorized(false);
      setIsChecking(false);
      
      // Redirect to login with return URL
      const redirectUrl = options.redirectTo || `/auth/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(redirectUrl);
      return;
    }

    // If user is authenticated but we want to redirect authenticated users
    if (isAuthenticated && options.redirectIfAuthenticated) {
      router.push(options.redirectIfAuthenticated);
      return;
    }

    // Check role requirements
    if (options.requiredRole && !hasRole(options.requiredRole)) {
      setIsAuthorized(false);
      setIsChecking(false);
      router.push(options.redirectTo || '/dashboard');
      return;
    }

    if (options.requiredRoles && !hasAnyRole(options.requiredRoles)) {
      setIsAuthorized(false);
      setIsChecking(false);
      router.push(options.redirectTo || '/dashboard');
      return;
    }

    // Check permission requirements
    if (options.requiredPermission && !hasPermission(options.requiredPermission)) {
      setIsAuthorized(false);
      setIsChecking(false);
      router.push(options.redirectTo || '/dashboard');
      return;
    }

    if (options.requiredPermissions) {
      const hasRequiredPermissions = options.requireAll 
        ? hasAllPermissions(options.requiredPermissions)
        : hasAnyPermission(options.requiredPermissions);
      
      if (!hasRequiredPermissions) {
        setIsAuthorized(false);
        setIsChecking(false);
        router.push(options.redirectTo || '/dashboard');
        return;
      }
    }

    // All checks passed
    setIsAuthorized(true);
    setIsChecking(false);
  }, [
    isAuthenticated, 
    isInitialized, 
    user, 
    options.requiredRole,
    options.requiredRoles,
    options.requiredPermission,
    options.requiredPermissions,
    options.requireAll,
    options.allowUnauthenticated,
    pathname,
    router,
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  ]);

  return {
    isAuthorized,
    isChecking: isLoading || isChecking,
    isAuthenticated,
    user,
  };
}

// ============================================================================
// SESSION MANAGEMENT HOOK
// ============================================================================

export function useSession() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    lastActivity, 
    expiresAt,
    extendSession,
    logout 
  } = useAuthStore();

  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);

  // Calculate session time remaining
  useEffect(() => {
    if (!isAuthenticated || !expiresAt) {
      setTimeRemaining(null);
      setIsExpiringSoon(false);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const remaining = expiry.getTime() - now.getTime();

      if (remaining <= 0) {
        setTimeRemaining(0);
        setIsExpiringSoon(true);
        logout(); // Auto logout when session expires
        return;
      }

      setTimeRemaining(remaining);
      setIsExpiringSoon(remaining <= 5 * 60 * 1000); // 5 minutes warning
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, expiresAt, logout]);

  // Format time remaining
  const formatTimeRemaining = (ms: number): string => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Session extension
  const requestSessionExtension = () => {
    if (isAuthenticated) {
      extendSession();
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    lastActivity: lastActivity ? new Date(lastActivity) : null,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    timeRemaining,
    timeRemainingFormatted: timeRemaining ? formatTimeRemaining(timeRemaining) : null,
    isExpiringSoon,
    extendSession: requestSessionExtension,
    logout,
  };
}

// ============================================================================
// USER ACTIVITY TRACKING HOOK
// ============================================================================

export function useUserActivity() {
  const { isAuthenticated, extendSession } = useAuthStore();
  const [isActive, setIsActive] = useState(true);
  const [lastActivity, setLastActivity] = useState(new Date());

  useEffect(() => {
    if (!isAuthenticated) return;

    let inactivityTimer: NodeJS.Timeout;
    let activityTimer: NodeJS.Timeout | undefined;

    const handleActivity = () => {
      setIsActive(true);
      setLastActivity(new Date());
      extendSession();

      // Clear existing timers
      clearTimeout(inactivityTimer);
      if (activityTimer) clearTimeout(activityTimer);

      // Set new inactivity timer (30 minutes)
      inactivityTimer = setTimeout(() => {
        setIsActive(false);
      }, 30 * 60 * 1000);
    };

    // Activity events to track
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initial activity
    handleActivity();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearTimeout(inactivityTimer);
      if (activityTimer) clearTimeout(activityTimer);
    };
  }, [isAuthenticated, extendSession]);

  return {
    isActive,
    lastActivity,
    markActive: () => {
      setIsActive(true);
      setLastActivity(new Date());
      extendSession();
    },
  };
}

// ============================================================================
// CONDITIONAL RENDERING HOOK
// ============================================================================

interface UseAuthContentOptions {
  role?: UserRole;
  roles?: UserRole[];
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export function useAuthContent(options: UseAuthContentOptions = {}) {
  const { isAuthenticated, user } = useAuthStore();
  const { hasRole, hasAnyRole, hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  const shouldShow = useMemo(() => {
    if (!isAuthenticated || !user) return false;

    // Check role requirements
    if (options.role && !hasRole(options.role)) return false;
    if (options.roles && !hasAnyRole(options.roles)) return false;

    // Check permission requirements
    if (options.permission && !hasPermission(options.permission)) return false;
    if (options.permissions) {
      const hasRequiredPermissions = options.requireAll 
        ? hasAllPermissions(options.permissions)
        : hasAnyPermission(options.permissions);
      if (!hasRequiredPermissions) return false;
    }

    return true;
  }, [
    isAuthenticated,
    user,
    options.role,
    options.roles,
    options.permission,
    options.permissions,
    options.requireAll,
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  ]);

  return {
    shouldShow,
    canShow: shouldShow,
    fallback: options.fallback,
  };
}

// ============================================================================
// AUTHENTICATION STATUS HOOK
// ============================================================================

export function useAuthStatus() {
  const { 
    isAuthenticated, 
    isLoading, 
    isInitialized, 
    error, 
    isLocked, 
    lockoutUntil,
    loginAttempts 
  } = useAuthStore();

  const isReady = isInitialized && !isLoading;
  const canLogin = !isLocked && isReady;
  
  const lockoutTimeRemaining = useMemo(() => {
    if (!isLocked || !lockoutUntil) return 0;
    
    const now = new Date();
    const lockout = new Date(lockoutUntil);
    const remaining = lockout.getTime() - now.getTime();
    
    return Math.max(0, remaining);
  }, [isLocked, lockoutUntil]);

  return {
    isAuthenticated,
    isLoading,
    isInitialized,
    isReady,
    canLogin,
    error,
    isLocked,
    lockoutTimeRemaining,
    lockoutTimeRemainingMinutes: Math.ceil(lockoutTimeRemaining / (1000 * 60)),
    loginAttempts,
    attemptsRemaining: Math.max(0, 5 - loginAttempts),
  };
}

// ============================================================================
// ROLE-BASED COMPONENT WRAPPER
// ============================================================================

interface AuthorizedComponentProps {
  children: React.ReactNode;
  role?: UserRole;
  roles?: UserRole[];
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
}

export function AuthorizedComponent({
  children,
  fallback = null,
  loading = null,
  ...options
}: AuthorizedComponentProps): React.ReactNode {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { shouldShow } = useAuthContent(options);

  if (isLoading) {
    return loading;
  }

  if (!isAuthenticated || !shouldShow) {
    return fallback;
  }

  return children;
}

// ============================================================================
// EXPORT ALL HOOKS
// ============================================================================

export {
  useAuthStore,
  useAuth,
  useAuthUser,
  useAuthActions,
} from '@/stores/auth-store';
