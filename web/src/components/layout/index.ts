/**
 * Smart Tourist Safety System - Layout Components Index
 * Centralized exports for all layout system components
 */

// Core Layout Components
export { Header } from './header';
export { Sidebar } from './sidebar';
export { Breadcrumbs, EmergencyBreadcrumbs, TouristBreadcrumbs, AnalyticsBreadcrumbs } from './breadcrumbs';
export { ThemeSwitcher, AdvancedThemeSwitcher, EmergencyThemeController } from './theme-switcher';

// Layout Component Types
export type {
  BreadcrumbItem,
  BreadcrumbsProps,
  EmergencyBreadcrumbsProps,
  TouristBreadcrumbsProps,
  AnalyticsBreadcrumbsProps,
} from './breadcrumbs';

export type {
  ThemeSwitcherProps,
  AdvancedThemeSwitcherProps,
  EmergencyThemeControllerProps,
} from './theme-switcher';

// Layout System Constants
export const LAYOUT_CONFIG = {
  header: {
    height: 64, // 16 * 4 = 64px
    zIndex: 50,
  },
  sidebar: {
    width: 256, // 64 * 4 = 256px
    collapsedWidth: 64,
    zIndex: 40,
  },
  breadcrumbs: {
    height: 40,
    maxItems: 5,
  },
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  },
} as const;

// Layout Utilities
export const layoutUtils = {
  /**
   * Get responsive sidebar classes
   */
  getSidebarClasses: (isOpen: boolean, isMobile: boolean) => {
    const baseClasses = 'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out';
    const desktopClasses = 'lg:translate-x-0 lg:static lg:inset-0';
    const mobileClasses = isOpen ? 'translate-x-0' : '-translate-x-full';
    
    return `${baseClasses} ${desktopClasses} ${isMobile ? mobileClasses : ''}`;
  },

  /**
   * Get main content classes with sidebar consideration
   */
  getMainContentClasses: (sidebarOpen: boolean) => {
    return `flex-1 transition-all duration-300 ease-in-out ${
      sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
    }`;
  },

  /**
   * Get header classes for sticky positioning
   */
  getHeaderClasses: () => {
    return 'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60';
  },

  /**
   * Calculate content height excluding header and breadcrumbs
   */
  getContentHeight: (includeHeader = true, includeBreadcrumbs = true) => {
    let height = 'h-screen';
    
    if (includeHeader && includeBreadcrumbs) {
      height = 'h-[calc(100vh-104px)]'; // 64px header + 40px breadcrumbs
    } else if (includeHeader) {
      height = 'h-[calc(100vh-64px)]'; // 64px header only
    } else if (includeBreadcrumbs) {
      height = 'h-[calc(100vh-40px)]'; // 40px breadcrumbs only
    }
    
    return height;
  },
};

// Emergency Layout Modes
export const EMERGENCY_LAYOUT_CONFIG = {
  themes: {
    normal: 'system',
    emergency: 'light', // High contrast for better visibility
    critical: 'light',
  },
  colors: {
    emergency: {
      primary: '#dc2626', // red-600
      secondary: '#fca5a5', // red-300
      background: '#fef2f2', // red-50
      border: '#fecaca', // red-200
    },
    critical: {
      primary: '#991b1b', // red-800
      secondary: '#f87171', // red-400
      background: '#fee2e2', // red-100
      border: '#fca5a5', // red-300
    },
  },
  animations: {
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
    emergency: 'animate-pulse',
  },
} as const;

// Responsive Layout Hooks
export const useResponsiveLayout = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < LAYOUT_CONFIG.breakpoints.mobile);
      setIsTablet(
        window.innerWidth >= LAYOUT_CONFIG.breakpoints.mobile &&
        window.innerWidth < LAYOUT_CONFIG.breakpoints.desktop
      );
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
};

// Layout Context for Emergency States
export const LayoutContext = React.createContext<{
  isEmergencyMode: boolean;
  emergencySeverity: 'low' | 'medium' | 'high' | 'critical';
  setEmergencyMode: (mode: boolean, severity?: 'low' | 'medium' | 'high' | 'critical') => void;
}>({
  isEmergencyMode: false,
  emergencySeverity: 'medium',
  setEmergencyMode: () => {},
});

export const useLayoutContext = () => {
  const context = React.useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayoutContext must be used within a LayoutProvider');
  }
  return context;
};

// Import React for hooks
import * as React from 'react';