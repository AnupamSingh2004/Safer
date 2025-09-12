/**
 * Smart Tourist Safety System - Layout System Demo
 * Comprehensive demonstration of the layout system components
 */

"use client";

import * as React from "react";
import { useState } from "react";
import { 
  Header, 
  Sidebar, 
  Breadcrumbs, 
  EmergencyBreadcrumbs,
  TouristBreadcrumbs,
  AnalyticsBreadcrumbs,
  ThemeSwitcher, 
  AdvancedThemeSwitcher,
  EmergencyThemeController,
  LAYOUT_CONFIG,
  layoutUtils,
  useResponsiveLayout,
} from "./index";

// ============================================================================
// LAYOUT DEMO COMPONENT
// ============================================================================

export function LayoutSystemDemo() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { isMobile, isTablet, isDesktop } = useResponsiveLayout();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleEmergencyModeChange = (enabled: boolean) => {
    setEmergencyMode(enabled);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Layout System Demo */}
      <div className="space-y-8 p-8">
        {/* Demo Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Smart Tourist Safety - Layout System
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive layout foundation for emergency response dashboard
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>Device: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}</span>
            <span>•</span>
            <span>Sidebar: {sidebarOpen ? 'Open' : 'Closed'}</span>
            <span>•</span>
            <span>Emergency: {emergencyMode ? 'Active' : 'Normal'}</span>
          </div>
        </div>

        {/* Layout Controls */}
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="text-xl font-semibold">Layout Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sidebar Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sidebar State</label>
              <button
                onClick={handleSidebarToggle}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
              </button>
            </div>

            {/* Emergency Mode */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Emergency Mode</label>
              <EmergencyThemeController
                isEmergency={emergencyMode}
                severity="high"
                onEmergencyModeChange={handleEmergencyModeChange}
                className="w-full"
              />
            </div>

            {/* Theme Switcher */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme Control</label>
              <div className="flex space-x-2">
                <ThemeSwitcher variant="compact" showLabel />
                <ThemeSwitcher variant="icon" emergencyMode={emergencyMode} />
              </div>
            </div>
          </div>
        </div>

        {/* Header Component Demo */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold">Header Component</h3>
            <p className="text-sm text-gray-600">Navigation, user profile, notifications, and theme switcher</p>
          </div>
          <div className="relative">
            <Header onMenuToggle={handleSidebarToggle} />
          </div>
        </div>

        {/* Breadcrumbs Demo */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold">Breadcrumbs Components</h3>
            <p className="text-sm text-gray-600">Navigation hierarchy with emergency context detection</p>
          </div>
          <div className="space-y-0">
            {/* Standard Breadcrumbs */}
            <div className="border-b">
              <Breadcrumbs />
            </div>
            
            {/* Emergency Breadcrumbs */}
            <div className="border-b">
              <EmergencyBreadcrumbs 
                alertId="ALT-2024-001" 
                alertType="Medical Emergency"
              />
            </div>
            
            {/* Tourist Breadcrumbs */}
            <div className="border-b">
              <TouristBreadcrumbs 
                touristId="TRF-2024-001" 
                touristName="John Doe" 
                section="safety-score"
              />
            </div>
            
            {/* Analytics Breadcrumbs */}
            <div>
              <AnalyticsBreadcrumbs 
                reportType="incidents" 
                reportId="RPT-2024-001"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Demo */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold">Sidebar Component</h3>
            <p className="text-sm text-gray-600">Role-based navigation with emergency indicators</p>
          </div>
          <div className="h-96 relative overflow-hidden">
            <Sidebar 
              isOpen={sidebarOpen} 
              onClose={() => setSidebarOpen(false)}
              className="relative"
            />
            {!sidebarOpen && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">Sidebar is closed</p>
              </div>
            )}
          </div>
        </div>

        {/* Theme Switcher Variants */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Theme Switcher Variants</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Variants */}
            <div className="space-y-4">
              <h4 className="font-medium">Basic Variants</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-sm w-16">Default:</span>
                  <ThemeSwitcher variant="default" />
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm w-16">Icon:</span>
                  <ThemeSwitcher variant="icon" />
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm w-16">Compact:</span>
                  <ThemeSwitcher variant="compact" showLabel />
                </div>
              </div>
            </div>

            {/* Advanced Theme Switcher */}
            <div className="space-y-4">
              <h4 className="font-medium">Advanced Controls</h4>
              <AdvancedThemeSwitcher 
                showPreview
                showScheduler
                allowCustomColors
                className="border-0"
              />
            </div>
          </div>
        </div>

        {/* Layout Configuration */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Layout Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Layout Constants */}
            <div>
              <h4 className="font-medium mb-2">Layout Constants</h4>
              <div className="space-y-1 text-sm">
                <div>Header Height: {LAYOUT_CONFIG.header.height}px</div>
                <div>Sidebar Width: {LAYOUT_CONFIG.sidebar.width}px</div>
                <div>Breadcrumb Height: {LAYOUT_CONFIG.breadcrumbs.height}px</div>
                <div>Mobile Breakpoint: {LAYOUT_CONFIG.breakpoints.mobile}px</div>
              </div>
            </div>

            {/* Layout Utilities */}
            <div>
              <h4 className="font-medium mb-2">Responsive Classes</h4>
              <div className="space-y-1 text-xs font-mono bg-gray-50 p-3 rounded">
                <div>Content Height: {layoutUtils.getContentHeight()}</div>
                <div>Header Classes: sticky top-0 z-50...</div>
                <div>Sidebar Classes: fixed inset-y-0...</div>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Features Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            ✅ Step 8: Layout System Foundation - COMPLETED
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Core Components</h4>
              <ul className="space-y-1 text-blue-700">
                <li>✓ Header with navigation & notifications</li>
                <li>✓ Sidebar with role-based menu</li>
                <li>✓ Breadcrumbs with emergency context</li>
                <li>✓ Theme switcher with emergency modes</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Features</h4>
              <ul className="space-y-1 text-blue-700">
                <li>✓ Responsive design (mobile/tablet/desktop)</li>
                <li>✓ Emergency alert indicators</li>
                <li>✓ Real-time status indicators</li>
                <li>✓ Dark/light mode with auto-switching</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LayoutSystemDemo;