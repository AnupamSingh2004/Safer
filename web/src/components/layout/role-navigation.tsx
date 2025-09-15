/**
 * Smart Tourist Safety System - Role-Specific Navigation Components
 * Different navigation experiences for different user roles
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
  Bell,
  Clock,
  Zap,
  Lock,
  Unlock,
  TrendingUp,
  Map,
  Phone
} from 'lucide-react';
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROLE_CONFIGS, getNavigationForRole } from "./role-aware-layout";

// ============================================================================
// ADMIN NAVIGATION COMPONENT
// ============================================================================

export function AdminNavigation() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  
  const navigation = getNavigationForRole(user?.role || 'viewer');
  const adminFeatures = [
    {
      name: 'System Health',
      href: '/dashboard/system',
      icon: Activity,
      status: 'online',
      description: 'Monitor system performance'
    },
    {
      name: 'User Management',
      href: '/dashboard/users',
      icon: Users,
      status: 'active',
      description: 'Manage system users'
    },
    {
      name: 'Audit Logs',
      href: '/dashboard/audit',
      icon: Shield,
      status: 'secure',
      description: 'View system audit trail'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="justify-start">
            <Zap className="h-4 w-4 mr-2" />
            Emergency Override
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Bell className="h-4 w-4 mr-2" />
            Broadcast Alert
          </Button>
        </div>
      </div>

      {/* Admin Features */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Administration</h3>
        <nav className="space-y-1">
          {adminFeatures.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <IconComponent className="h-4 w-4" />
                <span className="flex-1 text-left">{item.name}</span>
                <Badge variant={
                  item.status === 'online' ? 'success' : 
                  item.status === 'active' ? 'secondary' : 'default'
                } className="text-xs">
                  {item.status}
                </Badge>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

// ============================================================================
// OPERATOR NAVIGATION COMPONENT
// ============================================================================

export function OperatorNavigation() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  
  const operatorActions = [
    {
      name: 'Active Incidents',
      href: '/dashboard/incidents',
      icon: AlertTriangle,
      count: 3,
      urgent: true,
      description: 'Manage active incidents'
    },
    {
      name: 'Communication Center',
      href: '/dashboard/communication',
      icon: MessageSquare,
      count: 12,
      urgent: false,
      description: 'Send alerts and messages'
    },
    {
      name: 'Live Tracking',
      href: '/dashboard/tracking',
      icon: MapPin,
      count: 156,
      urgent: false,
      description: 'Monitor tourist locations'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Current Shift Info */}
      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Current Shift</span>
        </div>
        <p className="text-xs text-blue-700">Day Shift • 08:00 - 20:00</p>
        <p className="text-xs text-blue-600">Next relief in 4h 23m</p>
      </div>

      {/* Priority Actions */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Priority Actions</h3>
        <nav className="space-y-1">
          {operatorActions.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-primary text-primary-foreground",
                  item.urgent && "ring-2 ring-red-200 bg-red-50"
                )}
              >
                <IconComponent className={cn(
                  "h-4 w-4",
                  item.urgent && "text-red-600"
                )} />
                <span className="flex-1 text-left">{item.name}</span>
                <Badge variant={item.urgent ? 'destructive' : 'secondary'} className="text-xs">
                  {item.count}
                </Badge>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

// ============================================================================
// EMERGENCY RESPONDER NAVIGATION
// ============================================================================

export function EmergencyResponderNavigation() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  
  const emergencyActions = [
    {
      name: 'Emergency Dispatch',
      href: '/dashboard/dispatch',
      icon: Phone,
      priority: 'critical',
      active: true
    },
    {
      name: 'Field Location',
      href: '/dashboard/field-location',
      icon: MapPin,
      priority: 'high',
      active: true
    },
    {
      name: 'Incident Reports',
      href: '/dashboard/incident-reports',
      icon: AlertTriangle,
      priority: 'medium',
      active: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Emergency Status */}
      <div className="p-3 rounded-lg bg-red-50 border border-red-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-medium text-red-900">Emergency Ready</span>
        </div>
        <p className="text-xs text-red-700">Response Team Alpha</p>
        <p className="text-xs text-red-600">Location: Sector 7, Zone A</p>
      </div>

      {/* Emergency Actions */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Emergency Response</h3>
        <nav className="space-y-1">
          {emergencyActions.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-primary text-primary-foreground",
                  item.priority === 'critical' && "ring-2 ring-red-500",
                  !item.active && "opacity-60"
                )}
                disabled={!item.active}
              >
                <IconComponent className={cn(
                  "h-4 w-4",
                  item.priority === 'critical' && "text-red-600",
                  item.priority === 'high' && "text-orange-600"
                )} />
                <span className="flex-1 text-left">{item.name}</span>
                <Badge 
                  variant={
                    item.priority === 'critical' ? 'destructive' : 
                    item.priority === 'high' ? 'warning' : 'secondary'
                  } 
                  className="text-xs"
                >
                  {item.priority}
                </Badge>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

// ============================================================================
// VIEWER NAVIGATION COMPONENT
// ============================================================================

export function ViewerNavigation() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  
  const viewerSections = [
    {
      name: 'Dashboard Overview',
      href: '/dashboard',
      icon: Activity,
      description: 'View system statistics'
    },
    {
      name: 'Analytics Reports',
      href: '/dashboard/analytics',
      icon: BarChart3,
      description: 'View generated reports'
    },
    {
      name: 'Tourist Statistics',
      href: '/dashboard/stats',
      icon: TrendingUp,
      description: 'Tourist data insights'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Access Level Info */}
      <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Read-Only Access</span>
        </div>
        <p className="text-xs text-gray-700">View dashboards and reports only</p>
      </div>

      {/* Available Sections */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Available Sections</h3>
        <nav className="space-y-1">
          {viewerSections.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <IconComponent className="h-4 w-4" />
                <span className="flex-1 text-left">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

// ============================================================================
// ROLE-SPECIFIC NAVIGATION WRAPPER
// ============================================================================

export function RoleSpecificNavigation() {
  const { user } = useAuthStore();
  
  if (!user?.role) return <ViewerNavigation />;
  
  switch (user.role) {
    case 'super_admin':
      return <AdminNavigation />;
    case 'operator':
      return <OperatorNavigation />;
    case 'viewer':
    default:
      return <ViewerNavigation />;
  }
}