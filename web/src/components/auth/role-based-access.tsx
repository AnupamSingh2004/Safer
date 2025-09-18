/**
 * Smart Tourist Safety System - Role-Based Access Control Component
 * Provides role-based access control for dashboard routes and components
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Shield, AlertTriangle, Lock } from 'lucide-react';
import { useAuth } from '@/stores/auth-store';

// ============================================================================
// INTERFACES
// ============================================================================

interface RoleBasedAccessProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallbackPath?: string;
  showFallback?: boolean;
  className?: string;
}

interface PermissionBasedAccessProps {
  requiredPermissions: string[];
  children: React.ReactNode;
  requireAll?: boolean; // If true, requires ALL permissions; if false, requires ANY
  fallbackPath?: string;
  showFallback?: boolean;
  className?: string;
}

// ============================================================================
// ROLE-BASED ACCESS COMPONENT
// ============================================================================

export function RoleBasedAccess({ 
  allowedRoles, 
  children, 
  fallbackPath = '/dashboard',
  showFallback = true,
  className 
}: RoleBasedAccessProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Checking access...</span>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }

  // Check if user has required role
  const hasRequiredRole = allowedRoles.includes(user.role);

  if (!hasRequiredRole) {
    if (showFallback) {
      return (
        <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
          <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <Lock className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Access Denied</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            You don't have permission to access this page. Your current role is: 
            <span className="font-medium capitalize"> {user.role.replace('_', ' ')}</span>
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Required roles: {allowedRoles.map(role => role.replace('_', ' ')).join(', ')}
          </p>
          <button
            onClick={() => router.push(fallbackPath)}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Shield className="w-4 h-4 mr-2" />
            Go to Dashboard
          </button>
        </div>
      );
    } else {
      // Silent redirect
      if (typeof window !== 'undefined') {
        router.push(fallbackPath);
      }
      return null;
    }
  }

  return <>{children}</>;
}

// ============================================================================
// PERMISSION-BASED ACCESS COMPONENT
// ============================================================================

export function PermissionBasedAccess({ 
  requiredPermissions, 
  children, 
  requireAll = true,
  fallbackPath = '/dashboard',
  showFallback = true,
  className 
}: PermissionBasedAccessProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Checking permissions...</span>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }

  // Check permissions
  const userPermissions = user.permissions || [];
  let hasRequiredPermissions = false;

  if (requireAll) {
    // User must have ALL required permissions
    hasRequiredPermissions = requiredPermissions.every(permission => 
      userPermissions.includes(permission as any)
    );
  } else {
    // User must have at least ONE required permission
    hasRequiredPermissions = requiredPermissions.some(permission => 
      userPermissions.includes(permission as any)
    );
  }

  if (!hasRequiredPermissions) {
    if (showFallback) {
      return (
        <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
          <div className="p-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Insufficient Permissions</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            You don't have the required permissions to access this feature.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Required permissions: {requiredPermissions.join(', ')}
          </p>
          <button
            onClick={() => router.push(fallbackPath)}
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Shield className="w-4 h-4 mr-2" />
            Go to Dashboard
          </button>
        </div>
      );
    } else {
      // Silent redirect
      if (typeof window !== 'undefined') {
        router.push(fallbackPath);
      }
      return null;
    }
  }

  return <>{children}</>;
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

export function useRoleCheck(allowedRoles: string[]) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return false;
  }
  
  return allowedRoles.includes(user.role);
}

export function usePermissionCheck(requiredPermissions: string[], requireAll = true) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return false;
  }
  
  const userPermissions = user.permissions || [];
  
  if (requireAll) {
    return requiredPermissions.every(permission => 
      userPermissions.includes(permission as any)
    );
  } else {
    return requiredPermissions.some(permission => 
      userPermissions.includes(permission as any)
    );
  }
}

// ============================================================================
// ROLE-SPECIFIC COMPONENTS
// ============================================================================

export function AdminOnly({ children, showFallback = true }: { children: React.ReactNode; showFallback?: boolean }) {
  return (
    <RoleBasedAccess 
      allowedRoles={['admin', 'super_admin']} 
      showFallback={showFallback}
    >
      {children}
    </RoleBasedAccess>
  );
}

export function SuperAdminOnly({ children, showFallback = true }: { children: React.ReactNode; showFallback?: boolean }) {
  return (
    <RoleBasedAccess 
      allowedRoles={['super_admin']} 
      showFallback={showFallback}
    >
      {children}
    </RoleBasedAccess>
  );
}

export function OperatorOnly({ children, showFallback = true }: { children: React.ReactNode; showFallback?: boolean }) {
  return (
    <RoleBasedAccess 
      allowedRoles={['operator']} 
      showFallback={showFallback}
    >
      {children}
    </RoleBasedAccess>
  );
}

export function ViewerOnly({ children, showFallback = true }: { children: React.ReactNode; showFallback?: boolean }) {
  return (
    <RoleBasedAccess 
      allowedRoles={['viewer']} 
      showFallback={showFallback}
    >
      {children}
    </RoleBasedAccess>
  );
}

export function TouristOnly({ children, showFallback = true }: { children: React.ReactNode; showFallback?: boolean }) {
  return (
    <RoleBasedAccess 
      allowedRoles={['tourist']} 
      showFallback={showFallback}
    >
      {children}
    </RoleBasedAccess>
  );
}

// ============================================================================
// CONDITIONAL RENDERING COMPONENT
// ============================================================================

export function ShowForRoles({ 
  allowedRoles, 
  children 
}: { 
  allowedRoles: string[]; 
  children: React.ReactNode; 
}) {
  const hasAccess = useRoleCheck(allowedRoles);
  
  if (!hasAccess) {
    return null;
  }
  
  return <>{children}</>;
}

export function ShowForPermissions({ 
  requiredPermissions, 
  children,
  requireAll = true 
}: { 
  requiredPermissions: string[]; 
  children: React.ReactNode;
  requireAll?: boolean;
}) {
  const hasAccess = usePermissionCheck(requiredPermissions, requireAll);
  
  if (!hasAccess) {
    return null;
  }
  
  return <>{children}</>;
}