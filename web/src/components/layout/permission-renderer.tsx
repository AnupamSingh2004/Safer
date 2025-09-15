/**
 * Smart Tourist Safety System - Permission-Based Component Renderer
 * Conditional rendering based on user roles and permissions
 */

"use client";

import * as React from "react";
import { useAuthStore } from "@/stores/auth-store";
import { Lock, Shield, Eye, AlertTriangle, Users } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PermissionRequirement {
  roles?: string[];
  permissions?: string[];
  exactRole?: string;
  minLevel?: 'viewer' | 'operator' | 'admin' | 'super_admin';
  emergencyAccess?: boolean;
}

export interface ConditionalRenderProps {
  children: React.ReactNode;
  requirements: PermissionRequirement;
  fallback?: React.ReactNode;
  showAccessDenied?: boolean;
  loadingComponent?: React.ReactNode;
}

export interface RoleBasedComponentProps {
  adminComponent?: React.ReactNode;
  operatorComponent?: React.ReactNode;
  viewerComponent?: React.ReactNode;
  fallbackComponent?: React.ReactNode;
  currentUserRole?: string;
}

export interface FeatureGuardProps {
  children: React.ReactNode;
  feature: string;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

// ============================================================================
// ROLE HIERARCHY CONFIGURATION
// ============================================================================

const ROLE_HIERARCHY = {
  'super_admin': 4,
  'operator': 2,
  'viewer': 1
} as const;

const ROLE_PERMISSIONS = {
  'super_admin': [
    'read', 'write', 'delete', 'system_config', 'user_management', 
    'emergency_override', 'blockchain', 'audit_logs', 'backup_restore'
  ],
  'operator': [
    'read', 'write', 'alert_management', 'emergency_response', 
    'communication', 'location_access', 'tourist_management'
  ],
  'viewer': ['read']
} as const;

// ============================================================================
// PERMISSION CHECKING UTILITIES
// ============================================================================

function checkPermissions(
  userRole: string | undefined,
  requirements: PermissionRequirement
): boolean {
  if (!userRole) return false;

  // Check exact role match
  if (requirements.exactRole) {
    return userRole === requirements.exactRole;
  }

  // Check role list
  if (requirements.roles && requirements.roles.length > 0) {
    if (!requirements.roles.includes(userRole)) return false;
  }

  // Check minimum level
  if (requirements.minLevel) {
    const userLevel = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0;
    const requiredLevel = ROLE_HIERARCHY[requirements.minLevel as keyof typeof ROLE_HIERARCHY] || 0;
    if (userLevel < requiredLevel) return false;
  }

  // Check specific permissions
  if (requirements.permissions && requirements.permissions.length > 0) {
    const userPermissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS] || [];
    const hasAllPermissions = requirements.permissions.every(
      permission => userRole === 'super_admin' || userPermissions.includes(permission as any)
    );
    if (!hasAllPermissions) return false;
  }

  return true;
}

// ============================================================================
// ACCESS DENIED COMPONENT
// ============================================================================

interface AccessDeniedProps {
  requirements: PermissionRequirement;
  userRole?: string;
  message?: string;
  showDetails?: boolean;
  showContactAdmin?: boolean;
}

function AccessDenied({ 
  requirements, 
  userRole, 
  message,
  showDetails = true,
  showContactAdmin = true 
}: AccessDeniedProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="rounded-full bg-red-100 p-3">
        <Lock className="h-8 w-8 text-red-600" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Access Denied</h3>
        <p className="text-gray-600 max-w-md">
          {message || "You don't have the required permissions to access this feature."}
        </p>
      </div>

      {showDetails && (
        <div className="bg-gray-50 rounded-lg p-4 max-w-md space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Your Role:</span>
            <Badge variant="secondary">{userRole || 'Unknown'}</Badge>
          </div>
          
          {requirements.roles && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Required Roles:</span>
              <div className="flex gap-1">
                {requirements.roles.map(role => (
                  <Badge key={role} variant="outline" className="text-xs">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {requirements.permissions && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Required Permissions:</span>
              <div className="flex gap-1">
                {requirements.permissions.map(permission => (
                  <Badge key={permission} variant="outline" className="text-xs">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showContactAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <p className="text-sm text-yellow-800">
              Contact your system administrator to request access to this feature.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CONDITIONAL RENDER COMPONENT
// ============================================================================

export function ConditionalRender({
  children,
  requirements,
  fallback,
  showAccessDenied = true,
  loadingComponent
}: ConditionalRenderProps) {
  const { user, isLoading } = useAuthStore();

  // Show loading state
  if (isLoading) {
    return loadingComponent || (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check permissions
  const hasAccess = checkPermissions(user?.role, requirements);

  if (!hasAccess) {
    if (fallback) return <>{fallback}</>;
    if (showAccessDenied) {
      return (
        <AccessDenied 
          requirements={requirements} 
          userRole={user?.role}
          showContactAdmin={true}
        />
      );
    }
    return null;
  }

  return <>{children}</>;
}

// ============================================================================
// ROLE-BASED COMPONENT RENDERER
// ============================================================================

export function RoleBasedComponent({
  adminComponent,
  operatorComponent,
  viewerComponent,
  fallbackComponent,
  currentUserRole
}: RoleBasedComponentProps) {
  const { user } = useAuthStore();
  const userRole = currentUserRole || user?.role;

  switch (userRole) {
    case 'super_admin':
      return adminComponent || fallbackComponent || null;
    case 'operator':
      return operatorComponent || fallbackComponent || null;
    case 'viewer':
      return viewerComponent || fallbackComponent || null;
    default:
      return fallbackComponent || null;
  }
}

// ============================================================================
// FEATURE GUARD COMPONENT
// ============================================================================

export function FeatureGuard({
  children,
  feature,
  fallback,
  showUpgrade = false
}: FeatureGuardProps) {
  const { user } = useAuthStore();
  
  // Define feature-role mapping
  const featureAccess: Record<string, string[]> = {
    'blockchain': ['super_admin'],
    'user_management': ['super_admin'],
    'system_config': ['super_admin'],
    'emergency_response': ['super_admin', 'operator'],
    'analytics': ['super_admin', 'operator', 'viewer'],
    'basic_dashboard': ['super_admin', 'operator', 'viewer']
  };

  const allowedRoles = featureAccess[feature] || [];
  const hasAccess = user?.role && allowedRoles.includes(user.role);

  if (!hasAccess) {
    if (fallback) return <>{fallback}</>;
    
    if (showUpgrade) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Shield className="h-12 w-12 text-gray-400" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Feature Locked</h3>
            <p className="text-gray-600">
              The "{feature}" feature requires higher access level.
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            Available for: {allowedRoles.join(', ')}
          </Badge>
        </div>
      );
    }
    
    return null;
  }

  return <>{children}</>;
}

// ============================================================================
// DASHBOARD CUSTOMIZATION COMPONENT
// ============================================================================

interface DashboardCustomizationProps {
  userRole: string;
  children: React.ReactNode;
}

export function DashboardCustomization({ userRole, children }: DashboardCustomizationProps) {
  // Apply role-specific styling and layout
  const dashboardClasses = React.useMemo(() => {
    const baseClasses = "min-h-screen bg-background";
    
    switch (userRole) {
      case 'super_admin':
        return cn(baseClasses, "admin-dashboard");
      case 'operator':
        return cn(baseClasses, "operator-dashboard");
      case 'viewer':
        return cn(baseClasses, "viewer-dashboard");
      default:
        return baseClasses;
    }
  }, [userRole]);

  // Role-specific CSS variables
  React.useEffect(() => {
    const root = document.documentElement;
    
    switch (userRole) {
      case 'super_admin':
        root.style.setProperty('--dashboard-primary', '147 51 234'); // Purple
        root.style.setProperty('--dashboard-accent', '236 72 153'); // Pink
        break;
      case 'operator':
        root.style.setProperty('--dashboard-primary', '37 99 235'); // Blue
        root.style.setProperty('--dashboard-accent', '34 197 94'); // Green
        break;
      case 'viewer':
        root.style.setProperty('--dashboard-primary', '107 114 128'); // Gray
        root.style.setProperty('--dashboard-accent', '156 163 175'); // Light Gray
        break;
      default:
        root.style.setProperty('--dashboard-primary', '59 130 246'); // Default Blue
        root.style.setProperty('--dashboard-accent', '34 197 94'); // Default Green
    }
  }, [userRole]);

  return (
    <div className={dashboardClasses} data-role={userRole}>
      {children}
    </div>
  );
}

// ============================================================================
// PERMISSION HOOKS
// ============================================================================

export function usePermissions() {
  const { user } = useAuthStore();
  
  const hasPermission = React.useCallback((permission: string) => {
    if (!user?.role) return false;
    if (user.role === 'super_admin') return true; // Super admin has all permissions
    const userPermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];
    return userPermissions.includes(permission as any);
  }, [user?.role]);
  
  const hasRole = React.useCallback((role: string) => {
    return user?.role === role;
  }, [user?.role]);
  
  const hasMinLevel = React.useCallback((minLevel: keyof typeof ROLE_HIERARCHY) => {
    if (!user?.role) return false;
    const userLevel = ROLE_HIERARCHY[user.role as keyof typeof ROLE_HIERARCHY] || 0;
    const requiredLevel = ROLE_HIERARCHY[minLevel] || 0;
    return userLevel >= requiredLevel;
  }, [user?.role]);

  return {
    hasPermission,
    hasRole,
    hasMinLevel,
    userRole: user?.role,
    permissions: user?.role ? ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] : []
  };
}

// Export utilities
export { checkPermissions, ROLE_HIERARCHY, ROLE_PERMISSIONS };