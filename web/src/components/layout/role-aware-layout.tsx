/**
 * Smart Tourist Safety System - Role-Aware Layout Component
 * Enhanced layout with role-specific navigation, permission-based rendering, and custom dashboard experiences
 */

"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  Activity,
  MapPin,
  MessageSquare,
  BarChart3,
  Settings,
  UserCheck,
  Database,
  Eye,
  Lock,
  Crown,
  Car,
  Radio,
  HeadphonesIcon,
  Phone,
  MonitorSpeaker,
  Siren
} from 'lucide-react';
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
  roles: string[];
  permissions: string[];
  priority?: 'high' | 'medium' | 'low';
  category?: 'emergency' | 'monitoring' | 'management' | 'administration';
  isNew?: boolean;
  badgeText?: string;
  badgeVariant?: 'destructive' | 'warning' | 'success' | 'secondary';
}

export interface RoleConfig {
  name: string;
  displayName: string;
  description: string;
  color: string;
  icon: React.ElementType;
  permissions: string[];
  dashboardLayout: 'admin' | 'operator' | 'viewer' | 'emergency';
  emergencyAccess: boolean;
  maxAlerts?: number;
  features: string[];
}

export interface RoleAwareLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showSidebar?: boolean;
  showFooter?: boolean;
  emergencyMode?: boolean;
}

// ============================================================================
// ROLE CONFIGURATIONS
// ============================================================================

const ROLE_CONFIGS: Record<string, RoleConfig> = {
  super_admin: {
    name: 'super_admin',
    displayName: 'System Administrator',
    description: 'Full system access and management',
    color: 'from-purple-600 to-purple-800',
    icon: Crown,
    permissions: ['all', 'system_config', 'user_management', 'emergency_override'],
    dashboardLayout: 'admin',
    emergencyAccess: true,
    features: ['blockchain', 'analytics', 'user_management', 'system_config', 'audit_logs']
  },
  police_admin: {
    name: 'police_admin',
    displayName: 'Police Administrator',
    description: 'Police department administrative access',
    color: 'from-blue-600 to-blue-800',
    icon: Shield,
    permissions: ['read', 'write', 'alert_management', 'emergency_response'],
    dashboardLayout: 'operator',
    emergencyAccess: true,
    maxAlerts: 50,
    features: ['emergency_response', 'alerts', 'location_tracking', 'communication']
  },
  tourism_admin: {
    name: 'tourism_admin',
    displayName: 'Tourism Administrator',
    description: 'Tourism department administrative access',
    color: 'from-green-600 to-green-800',
    icon: Users,
    permissions: ['read', 'write', 'tourist_management', 'zone_management'],
    dashboardLayout: 'operator',
    emergencyAccess: true,
    maxAlerts: 30,
    features: ['tourist_management', 'analytics', 'zone_management', 'reports']
  },
  operator: {
    name: 'operator',
    displayName: 'Control Room Operator',
    description: 'Monitor and respond to incidents',
    color: 'from-orange-600 to-orange-800',
    icon: MonitorSpeaker,
    permissions: ['read', 'write', 'alert_response', 'communication'],
    dashboardLayout: 'operator',
    emergencyAccess: true,
    maxAlerts: 20,
    features: ['alerts', 'communication', 'location_tracking', 'emergency_response']
  },
  emergency_responder: {
    name: 'emergency_responder',
    displayName: 'Emergency Responder',
    description: 'Field emergency response team',
    color: 'from-red-600 to-red-800',
    icon: Siren,
    permissions: ['read', 'emergency_response', 'location_access'],
    dashboardLayout: 'emergency',
    emergencyAccess: true,
    maxAlerts: 15,
    features: ['emergency_response', 'location_tracking', 'communication']
  },
  viewer: {
    name: 'viewer',
    displayName: 'Read-Only Viewer',
    description: 'View-only access to dashboards',
    color: 'from-gray-600 to-gray-800',
    icon: Eye,
    permissions: ['read'],
    dashboardLayout: 'viewer',
    emergencyAccess: false,
    features: ['analytics', 'reports']
  }
};

// ============================================================================
// NAVIGATION CONFIGURATIONS BY ROLE
// ============================================================================

const getNavigationForRole = (userRole: string): NavigationItem[] => {
  const baseNavigation: NavigationItem[] = [
    {
      name: 'Dashboard Overview',
      href: '/dashboard',
      icon: Activity,
      description: 'Main dashboard with real-time statistics',
      roles: ['super_admin', 'police_admin', 'tourism_admin', 'operator', 'emergency_responder', 'viewer'],
      permissions: ['read'],
      category: 'monitoring',
      priority: 'high'
    },
    {
      name: 'Active Alerts',
      href: '/dashboard/alerts',
      icon: AlertTriangle,
      description: 'Monitor and manage active safety alerts',
      roles: ['super_admin', 'police_admin', 'tourism_admin', 'operator', 'emergency_responder'],
      permissions: ['read', 'alert_management'],
      category: 'emergency',
      priority: 'high',
      badgeText: 'LIVE',
      badgeVariant: 'destructive'
    },
    {
      name: 'Tourist Management',
      href: '/dashboard/tourists',
      icon: Users,
      description: 'Manage tourist profiles and digital IDs',
      roles: ['super_admin', 'tourism_admin', 'operator'],
      permissions: ['read', 'tourist_management'],
      category: 'management',
      priority: 'high'
    },
    {
      name: 'Location Tracking',
      href: '/dashboard/location',
      icon: MapPin,
      description: 'Real-time location monitoring and geofencing',
      roles: ['super_admin', 'police_admin', 'operator', 'emergency_responder'],
      permissions: ['read', 'location_access'],
      category: 'monitoring',
      priority: 'high'
    },
    {
      name: 'Analytics & Reports',
      href: '/dashboard/analytics',
      icon: BarChart3,
      description: 'Statistics, trends, and comprehensive reports',
      roles: ['super_admin', 'police_admin', 'tourism_admin', 'operator', 'viewer'],
      permissions: ['read'],
      category: 'monitoring',
      priority: 'medium'
    },
    {
      name: 'Communication Hub',
      href: '/dashboard/communication',
      icon: MessageSquare,
      description: 'Send alerts, notifications, and broadcasts',
      roles: ['super_admin', 'police_admin', 'tourism_admin', 'operator'],
      permissions: ['write', 'communication'],
      category: 'management',
      priority: 'medium'
    },
    {
      name: 'Zone Management',
      href: '/dashboard/zones',
      icon: MapPin,
      description: 'Configure geofences and risk zones',
      roles: ['super_admin', 'tourism_admin', 'operator'],
      permissions: ['write', 'zone_management'],
      category: 'management',
      priority: 'medium'
    },
    {
      name: 'Blockchain Identity',
      href: '/dashboard/blockchain',
      icon: Database,
      description: 'Digital ID generation and verification',
      roles: ['super_admin', 'tourism_admin'],
      permissions: ['blockchain'],
      category: 'administration',
      priority: 'medium',
      isNew: true,
      badgeText: 'BLOCKCHAIN',
      badgeVariant: 'success'
    },
    {
      name: 'Emergency Response',
      href: '/dashboard/emergency',
      icon: Phone,
      description: 'Emergency incident management',
      roles: ['super_admin', 'police_admin', 'emergency_responder'],
      permissions: ['emergency_response'],
      category: 'emergency',
      priority: 'high',
      badgeText: '24/7',
      badgeVariant: 'destructive'
    },
    {
      name: 'System Settings',
      href: '/dashboard/settings',
      icon: Settings,
      description: 'System configuration and preferences',
      roles: ['super_admin'],
      permissions: ['system_config'],
      category: 'administration',
      priority: 'low'
    }
  ];

  // Filter navigation based on user role and permissions
  return baseNavigation.filter(item => {
    if (!userRole || !ROLE_CONFIGS[userRole]) return false;
    
    const roleConfig = ROLE_CONFIGS[userRole];
    const hasRole = item.roles.includes(userRole);
    const hasPermissions = item.permissions.every(permission => 
      roleConfig.permissions.includes('all') || 
      roleConfig.permissions.includes(permission)
    );
    
    return hasRole && hasPermissions;
  });
};

// ============================================================================
// ROLE BADGE COMPONENT
// ============================================================================

interface RoleBadgeProps {
  userRole: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showDescription?: boolean;
}

export function RoleBadge({ userRole, size = 'md', showIcon = true, showDescription = false }: RoleBadgeProps) {
  const roleConfig = ROLE_CONFIGS[userRole];
  
  if (!roleConfig) return null;
  
  const IconComponent = roleConfig.icon;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r text-white font-medium",
            roleConfig.color,
            size === 'sm' && "px-2 py-0.5 text-xs",
            size === 'md' && "px-3 py-1 text-sm",
            size === 'lg' && "px-4 py-2 text-base"
          )}>
            {showIcon && <IconComponent className={cn(
              size === 'sm' && "h-3 w-3",
              size === 'md' && "h-4 w-4",
              size === 'lg' && "h-5 w-5"
            )} />}
            <span>{roleConfig.displayName}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">{roleConfig.displayName}</p>
            <p className="text-sm text-muted-foreground">{roleConfig.description}</p>
            {showDescription && (
              <div className="text-xs text-muted-foreground">
                <p>Features: {roleConfig.features.join(', ')}</p>
                <p>Emergency Access: {roleConfig.emergencyAccess ? 'Yes' : 'No'}</p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ============================================================================
// PERMISSION GUARD COMPONENT
// ============================================================================

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredRole?: string[];
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
  showError?: boolean;
}

export function PermissionGuard({ 
  children, 
  requiredRole = [], 
  requiredPermissions = [], 
  fallback = null,
  showError = false 
}: PermissionGuardProps) {
  const { user } = useAuthStore();
  
  if (!user) {
    return fallback || (showError ? (
      <div className="p-4 text-center text-muted-foreground">
        <Lock className="h-8 w-8 mx-auto mb-2" />
        <p>Authentication required</p>
      </div>
    ) : null);
  }
  
  const userRole = user.role;
  const roleConfig = ROLE_CONFIGS[userRole];
  
  if (!roleConfig) return fallback;
  
  // Check role requirement
  const hasRole = requiredRole.length === 0 || requiredRole.includes(userRole);
  
  // Check permission requirement
  const hasPermissions = requiredPermissions.length === 0 || 
    requiredPermissions.every(permission => 
      roleConfig.permissions.includes('all') || 
      roleConfig.permissions.includes(permission)
    );
  
  if (!hasRole || !hasPermissions) {
    return fallback || (showError ? (
      <div className="p-4 text-center text-muted-foreground">
        <Lock className="h-8 w-8 mx-auto mb-2" />
        <p>Insufficient permissions</p>
        <p className="text-sm">Required: {requiredRole.join(', ')} with {requiredPermissions.join(', ')}</p>
      </div>
    ) : null);
  }
  
  return <>{children}</>;
}

// ============================================================================
// ROLE-AWARE LAYOUT COMPONENT
// ============================================================================

export function RoleAwareLayout({ 
  children, 
  showHeader = true, 
  showSidebar = true, 
  showFooter = true,
  emergencyMode = false 
}: RoleAwareLayoutProps) {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  
  const userRole = user?.role || 'viewer';
  const roleConfig = ROLE_CONFIGS[userRole];
  const navigation = getNavigationForRole(userRole);
  
  // Emergency mode styling
  const emergencyClasses = emergencyMode ? 'emergency-layout bg-red-50 border-red-200' : '';
  
  return (
    <div className={cn("min-h-screen bg-background", emergencyClasses)}>
      {/* Role-specific header */}
      {showHeader && (
        <header className={cn(
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          emergencyMode && "bg-red-50/95 border-red-200"
        )}>
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-semibold">Tourist Safety</span>
              </div>
              <RoleBadge userRole={userRole} size="sm" />
            </div>
            
            <div className="flex items-center gap-4">
              {emergencyMode && (
                <Badge variant="destructive" className="animate-pulse">
                  EMERGENCY MODE
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                {user?.name || 'Dashboard User'}
              </span>
            </div>
          </div>
        </header>
      )}
      
      <div className="flex">
        {/* Role-specific sidebar */}
        {showSidebar && (
          <aside className={cn(
            "w-64 min-h-screen border-r bg-card",
            emergencyMode && "bg-red-50 border-red-200"
          )}>
            <div className="p-4 space-y-4">
              {/* Role information */}
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-2 mb-2">
                  {React.createElement(roleConfig?.icon || Eye, { className: "h-5 w-5" })}
                  <span className="font-medium">{roleConfig?.displayName}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {roleConfig?.description}
                </p>
              </div>
              
              {/* Navigation by category */}
              {['emergency', 'monitoring', 'management', 'administration'].map(category => {
                const categoryItems = navigation.filter(item => item.category === category);
                if (categoryItems.length === 0) return null;
                
                return (
                  <div key={category} className="space-y-2">
                    <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {category}
                    </h3>
                    <nav className="space-y-1">
                      {categoryItems.map((item) => {
                        const isActive = pathname === item.href;
                        const IconComponent = item.icon;
                        
                        return (
                          <TooltipProvider key={item.href}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => router.push(item.href)}
                                  className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all",
                                    "hover:bg-accent hover:text-accent-foreground",
                                    isActive && "bg-primary text-primary-foreground",
                                    item.priority === 'high' && "font-medium",
                                    emergencyMode && item.category === 'emergency' && "ring-2 ring-red-500"
                                  )}
                                >
                                  <IconComponent className="h-4 w-4" />
                                  <span className="flex-1 text-left">{item.name}</span>
                                  {item.badgeText && (
                                    <Badge 
                                      variant={item.badgeVariant || 'secondary'} 
                                      className="text-xs px-1.5 py-0"
                                    >
                                      {item.badgeText}
                                    </Badge>
                                  )}
                                  {item.isNew && (
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p>{item.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </nav>
                  </div>
                );
              })}
            </div>
          </aside>
        )}
        
        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
      
      {/* Role-specific footer */}
      {showFooter && (
        <footer className={cn(
          "border-t bg-background px-4 py-3",
          emergencyMode && "bg-red-50 border-red-200"
        )}>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>© 2025 Tourist Safety System</span>
              <span>Emergency: 112</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "h-2 w-2 rounded-full",
                emergencyMode ? "bg-red-500 animate-pulse" : "bg-green-500"
              )} />
              <span>{emergencyMode ? "Emergency Mode" : "Normal Operations"}</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

// Export role configurations for use in other components
export { ROLE_CONFIGS, getNavigationForRole };