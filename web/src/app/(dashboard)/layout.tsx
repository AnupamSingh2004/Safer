/**
 * Smart Tourist Safety System - Dashboard Layout
 * Main layout for dashboard pages with header, sidebar, breadcrumbs, and responsive behavior
 */

"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { useAuthStore } from "@/stores/auth-store";
import { LoadingOverlay, PageLoading } from "@/components/common/loading";
import { cn } from "@/lib/utils";

// ============================================================================
// DASHBOARD LAYOUT INTERFACES
// ============================================================================

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface LayoutState {
  sidebarOpen: boolean;
  isLoading: boolean;
  emergencyMode: boolean;
  emergencySeverity: 'low' | 'medium' | 'high' | 'critical';
}

// ============================================================================
// DASHBOARD LAYOUT COMPONENT
// ============================================================================

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading, user } = useAuthStore();
  
  // Layout state management
  const [layoutState, setLayoutState] = React.useState<LayoutState>({
    sidebarOpen: true,
    isLoading: false,
    emergencyMode: false,
    emergencySeverity: 'medium',
  });

  // Responsive behavior
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      
      // Auto-close sidebar on mobile
      if (mobile && layoutState.sidebarOpen) {
        setLayoutState(prev => ({ ...prev, sidebarOpen: false }));
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [layoutState.sidebarOpen]);

  // Handle sidebar toggle
  const handleSidebarToggle = React.useCallback(() => {
    setLayoutState(prev => ({ 
      ...prev, 
      sidebarOpen: !prev.sidebarOpen 
    }));
  }, []);

  // Handle sidebar close (mobile overlay click)
  const handleSidebarClose = React.useCallback(() => {
    setLayoutState(prev => ({ 
      ...prev, 
      sidebarOpen: false 
    }));
  }, []);

  // Handle emergency mode
  const handleEmergencyMode = React.useCallback((
    enabled: boolean, 
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) => {
    setLayoutState(prev => ({
      ...prev,
      emergencyMode: enabled,
      emergencySeverity: severity,
    }));
    
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
  }, []);

  // Emergency alert detection from pathname
  React.useEffect(() => {
    const isEmergencyPath = pathname.includes('/alerts/emergency') || 
                           pathname.includes('/alerts/active');
    
    if (isEmergencyPath && !layoutState.emergencyMode) {
      handleEmergencyMode(true, 'high');
    } else if (!isEmergencyPath && layoutState.emergencyMode) {
      handleEmergencyMode(false);
    }
  }, [pathname, layoutState.emergencyMode, handleEmergencyMode]);

  // Loading state management
  React.useEffect(() => {
    setLayoutState(prev => ({ ...prev, isLoading: authLoading }));
  }, [authLoading]);

  // Auto-save layout preferences
  React.useEffect(() => {
    const preferences = {
      sidebarOpen: layoutState.sidebarOpen,
    };
    
    localStorage.setItem('dashboard-layout-preferences', JSON.stringify(preferences));
  }, [layoutState.sidebarOpen]);

  // Restore layout preferences
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('dashboard-layout-preferences');
      if (saved) {
        const preferences = JSON.parse(saved);
        setLayoutState(prev => ({
          ...prev,
          sidebarOpen: isMobile ? false : preferences.sidebarOpen ?? true,
        }));
      }
    } catch (error) {
      console.warn('Failed to restore layout preferences:', error);
    }
  }, [isMobile]);

  // Show loading state during authentication
  if (authLoading || !isAuthenticated) {
    return (
      <PageLoading message="Initializing dashboard..." />
    );
  }

  // Main layout render
  return (
    <div className={cn(
      "min-h-screen bg-gray-50 flex",
      layoutState.emergencyMode && "emergency-layout",
      layoutState.emergencyMode && `emergency-${layoutState.emergencySeverity}`
    )}>
      {/* Sidebar */}
      <Sidebar
        isOpen={layoutState.sidebarOpen}
        onClose={handleSidebarClose}
        className={cn(
          "transition-all duration-300 ease-in-out",
          layoutState.emergencyMode && "border-red-200"
        )}
      />

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out",
        layoutState.sidebarOpen && !isMobile ? "lg:ml-64" : "ml-0"
      )}>
        {/* Header */}
        <Header
          onMenuToggle={handleSidebarToggle}
          className={cn(
            "sticky top-0 z-40 transition-colors duration-300",
            layoutState.emergencyMode && "bg-red-50 border-red-200"
          )}
        />

        {/* Breadcrumbs */}
        <Breadcrumbs
          className={cn(
            "transition-colors duration-300",
            layoutState.emergencyMode && "bg-red-50 border-red-200"
          )}
        />

        {/* Page Content */}
        <main className={cn(
          "flex-1 relative overflow-x-hidden",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
        )}>
          {/* Loading overlay */}
          <LoadingOverlay
            show={layoutState.isLoading}
            message="Loading dashboard content..."
            className="rounded-none"
          />

          {/* Emergency mode indicator */}
          {layoutState.emergencyMode && (
            <div className={cn(
              "sticky top-0 z-30 px-4 py-2 text-center text-sm font-medium",
              "bg-red-600 text-white shadow-sm",
              "animate-pulse"
            )}>
              🚨 EMERGENCY MODE ACTIVE - {layoutState.emergencySeverity.toUpperCase()} PRIORITY
            </div>
          )}

          {/* Content Container */}
          <div className={cn(
            "container-fluid p-4 space-y-6",
            "min-h-[calc(100vh-8rem)]", // Account for header and breadcrumbs
            layoutState.emergencyMode && "emergency-content"
          )}>
            {/* Error Boundary wrapper would go here in production */}
            <React.Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
                    <p className="text-gray-600">Loading page content...</p>
                  </div>
                </div>
              }
            >
              {children}
            </React.Suspense>
          </div>

          {/* Scroll to top button */}
          <ScrollToTopButton />
        </main>

        {/* Footer (if needed) */}
        <footer className={cn(
          "border-t bg-white px-4 py-3 text-center text-sm text-gray-500",
          layoutState.emergencyMode && "border-red-200 bg-red-50"
        )}>
          <div className="flex items-center justify-between">
            <span>
              © 2025 {user?.department || "Tourism Department"} • 
              Emergency Helpline: 112
            </span>
            <span className="flex items-center space-x-2">
              <div className={cn(
                "h-2 w-2 rounded-full",
                layoutState.emergencyMode ? "bg-red-500 animate-pulse" : "bg-green-500"
              )} />
              <span>{layoutState.emergencyMode ? "Emergency Mode" : "Normal Operations"}</span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ============================================================================
// SCROLL TO TOP COMPONENT
// ============================================================================

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-8 right-8 z-50",
        "p-3 bg-blue-600 text-white rounded-full shadow-lg",
        "hover:bg-blue-700 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      )}
      title="Scroll to top"
      aria-label="Scroll to top"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}
