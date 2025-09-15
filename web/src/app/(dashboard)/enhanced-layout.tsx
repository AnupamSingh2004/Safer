/**
 * Smart Tourist Safety System - Enhanced Dashboard Layout with Role-Based Features
 * Updated layout.tsx with role-specific dashboard customization
 */

"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { LoadingOverlay, PageLoading } from "@/components/common/loading";
import { RoleAwareLayout, PermissionGuard } from "@/components/layout/role-aware-layout";
import { RoleSpecificNavigation } from "@/components/layout/role-navigation";
import { DashboardCustomization } from "@/components/layout/permission-renderer";
import { cn } from "@/lib/utils";

// ============================================================================
// DASHBOARD LAYOUT INTERFACES
// ============================================================================

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface EmergencyModeState {
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  triggeredBy?: string;
  timestamp?: Date;
}

// ============================================================================
// ENHANCED DASHBOARD LAYOUT COMPONENT
// ============================================================================

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading, user } = useAuthStore();
  
  // Layout state management
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [emergencyMode, setEmergencyMode] = React.useState<EmergencyModeState>({
    enabled: false,
    severity: 'medium'
  });
  
  // Responsive behavior
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      
      // Auto-close sidebar on mobile
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [sidebarOpen]);

  // Handle emergency mode toggle
  const handleEmergencyMode = React.useCallback((
    enabled: boolean, 
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) => {
    setEmergencyMode({
      enabled,
      severity,
      triggeredBy: user?.name || 'System',
      timestamp: new Date()
    });
    
    // Update document classes for emergency styling
    if (enabled) {
      document.documentElement.classList.add('emergency-mode', `emergency-${severity}`);
    } else {
      document.documentElement.classList.remove(
        'emergency-mode', 
        'emergency-low', 
        'emergency-medium', 
        'emergency-high', 
        'emergency-critical'
      );
    }
  }, [user?.name]);

  // Monitor for emergency alerts (mock implementation for demo)
  React.useEffect(() => {
    // Simulate emergency alert monitoring
    const checkEmergencyAlerts = () => {
      // In a real implementation, this would connect to WebSocket or poll API
      // For demo purposes, we'll randomly trigger emergency mode
      if (Math.random() < 0.1 && !emergencyMode.enabled) {
        console.log('Demo: Emergency alert detected!');
        // handleEmergencyMode(true, 'high');
      }
    };

    const interval = setInterval(checkEmergencyAlerts, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [emergencyMode.enabled, handleEmergencyMode]);

  // Show loading state during authentication
  if (authLoading || !isAuthenticated) {
    return (
      <PageLoading message="Initializing dashboard..." />
    );
  }

  // Role-based access check
  if (!user?.role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">Your account doesn't have the required permissions.</p>
        </div>
      </div>
    );
  }

  // Main layout render with role-based customization
  return (
    <DashboardCustomization userRole={user.role}>
      <div className={cn(
        "min-h-screen bg-gray-50 flex",
        emergencyMode.enabled && "emergency-layout",
        emergencyMode.enabled && `emergency-${emergencyMode.severity}`
      )}>
        {/* Role-Aware Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          isMobile ? "lg:translate-x-0" : "",
          emergencyMode.enabled && "border-red-200 bg-red-50"
        )}>
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <span className="font-semibold text-gray-900">Tourist Safety</span>
            </div>
            
            {emergencyMode.enabled && (
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-red-600 font-medium">EMERGENCY</span>
              </div>
            )}
          </div>

          {/* Role-Specific Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <RoleSpecificNavigation />
          </div>

          {/* User Info Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name || 'Dashboard User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.role?.replace('_', ' ').toUpperCase() || 'USER'}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
          sidebarOpen && !isMobile ? "lg:ml-64" : "ml-0"
        )}>
          {/* Header */}
          <header className={cn(
            "sticky top-0 z-30 flex h-16 items-center justify-between bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8",
            emergencyMode.enabled && "bg-red-50 border-red-200"
          )}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 hover:text-gray-700 lg:hidden"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-gray-900">
                  {getPageTitle(pathname)}
                </h1>
                {emergencyMode.enabled && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Emergency Mode Active
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Emergency Mode Toggle (Admin Only) */}
              <PermissionGuard requiredRole={['super_admin']} requiredPermissions={['emergency_override']}>
                <button
                  onClick={() => handleEmergencyMode(!emergencyMode.enabled)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-lg transition-colors",
                    emergencyMode.enabled
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {emergencyMode.enabled ? 'Disable Emergency' : 'Emergency Mode'}
                </button>
              </PermissionGuard>

              {/* Current Time */}
              <div className="text-sm text-gray-500">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </header>

          {/* Emergency Banner */}
          {emergencyMode.enabled && (
            <div className={cn(
              "bg-red-600 text-white px-4 py-2 text-center text-sm font-medium",
              emergencyMode.severity === 'critical' && "bg-red-700 animate-pulse"
            )}>
              🚨 EMERGENCY MODE ACTIVE - {emergencyMode.severity.toUpperCase()} PRIORITY 
              {emergencyMode.timestamp && (
                <span className="ml-2 opacity-90">
                  (Since {emergencyMode.timestamp.toLocaleTimeString()})
                </span>
              )}
            </div>
          )}

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className={cn(
            "border-t border-gray-200 bg-white px-4 py-3",
            emergencyMode.enabled && "bg-red-50 border-red-200"
          )}>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <span>© 2025 Tourist Safety System</span>
                <span>Emergency Helpline: 112</span>
                <span>Tourist Helpline: 1363</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-2 w-2 rounded-full",
                  emergencyMode.enabled ? "bg-red-500 animate-pulse" : "bg-green-500"
                )} />
                <span>
                  {emergencyMode.enabled 
                    ? `Emergency Mode (${emergencyMode.severity})` 
                    : "Normal Operations"
                  }
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </DashboardCustomization>
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getPageTitle(pathname: string): string {
  const pathSegments = pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];
  
  const titleMap: Record<string, string> = {
    'dashboard': 'Overview',
    'alerts': 'Alert Management',
    'analytics': 'Analytics & Reports',
    'tourists': 'Tourist Management',
    'zones': 'Zone Management',
    'blockchain': 'Blockchain Identity',
    'communication': 'Communication Hub',
    'location': 'Location Tracking',
    'settings': 'System Settings',
    'emergency': 'Emergency Response'
  };
  
  return titleMap[lastSegment] || 'Dashboard';
}