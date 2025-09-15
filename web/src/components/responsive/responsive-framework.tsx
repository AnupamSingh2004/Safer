/**
 * Smart Tourist Safety System - Responsive Framework & Breakpoint System
 * Mobile-first responsive design with adaptive components and touch optimization
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';

// ============================================================================
// BREAKPOINT CONFIGURATION
// ============================================================================

export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export type BreakpointKey = keyof typeof breakpoints;

export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`,
  'max-sm': `(max-width: ${parseInt(breakpoints.sm) - 1}px)`,
  'max-md': `(max-width: ${parseInt(breakpoints.md) - 1}px)`,
  'max-lg': `(max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  'touch': '(hover: none) and (pointer: coarse)',
  'hover': '(hover: hover) and (pointer: fine)',
  'reduced-motion': '(prefers-reduced-motion: reduce)',
  'high-contrast': '(prefers-contrast: high)',
  'dark': '(prefers-color-scheme: dark)',
  'landscape': '(orientation: landscape)',
  'portrait': '(orientation: portrait)',
} as const;

export type MediaQueryKey = keyof typeof mediaQueries;

// ============================================================================
// DEVICE DETECTION
// ============================================================================

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  hasNotch: boolean;
  screenSize: BreakpointKey;
  orientation: 'landscape' | 'portrait';
  pixelRatio: number;
}

export const getDeviceInfo = (): DeviceInfo => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouchDevice: false,
      isIOS: false,
      isAndroid: false,
      hasNotch: false,
      screenSize: 'lg',
      orientation: 'landscape',
      pixelRatio: 1,
    };
  }

  const userAgent = navigator.userAgent;
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // Device detection
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  
  // Screen size detection
  let screenSize: BreakpointKey = 'xs';
  if (width >= parseInt(breakpoints['2xl'])) screenSize = '2xl';
  else if (width >= parseInt(breakpoints.xl)) screenSize = 'xl';
  else if (width >= parseInt(breakpoints.lg)) screenSize = 'lg';
  else if (width >= parseInt(breakpoints.md)) screenSize = 'md';
  else if (width >= parseInt(breakpoints.sm)) screenSize = 'sm';

  // Notch detection (approximation)
  const hasNotch = isIOS && (
    (width === 375 && height === 812) || // iPhone X, XS, 11 Pro
    (width === 414 && height === 896) || // iPhone XR, XS Max, 11, 11 Pro Max
    (width === 390 && height === 844) || // iPhone 12, 12 Pro
    (width === 428 && height === 926) || // iPhone 12 Pro Max
    (width === 393 && height === 852) || // iPhone 14, 14 Pro
    (width === 430 && height === 932)    // iPhone 14 Pro Max
  );

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    isIOS,
    isAndroid,
    hasNotch,
    screenSize,
    orientation: width > height ? 'landscape' : 'portrait',
    pixelRatio: window.devicePixelRatio || 1,
  };
};

// ============================================================================
// RESPONSIVE CONTEXT
// ============================================================================

interface ResponsiveContextType {
  deviceInfo: DeviceInfo;
  breakpoint: BreakpointKey;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  orientation: 'landscape' | 'portrait';
  refreshDeviceInfo: () => void;
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

export const useResponsive = () => {
  const context = useContext(ResponsiveContext);
  if (context === undefined) {
    throw new Error('useResponsive must be used within a ResponsiveProvider');
  }
  return context;
};

// ============================================================================
// RESPONSIVE PROVIDER
// ============================================================================

interface ResponsiveProviderProps {
  children: React.ReactNode;
}

export function ResponsiveProvider({ children }: ResponsiveProviderProps) {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => getDeviceInfo());

  const refreshDeviceInfo = useCallback(() => {
    setDeviceInfo(getDeviceInfo());
  }, []);

  useEffect(() => {
    refreshDeviceInfo();
    
    const handleResize = () => {
      refreshDeviceInfo();
    };

    const handleOrientationChange = () => {
      // Delay to allow for viewport changes
      setTimeout(refreshDeviceInfo, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [refreshDeviceInfo]);

  const contextValue: ResponsiveContextType = {
    deviceInfo,
    breakpoint: deviceInfo.screenSize,
    isMobile: deviceInfo.isMobile,
    isTablet: deviceInfo.isTablet,
    isDesktop: deviceInfo.isDesktop,
    isTouchDevice: deviceInfo.isTouchDevice,
    orientation: deviceInfo.orientation,
    refreshDeviceInfo,
  };

  return (
    <ResponsiveContext.Provider value={contextValue}>
      {children}
    </ResponsiveContext.Provider>
  );
}

// ============================================================================
// RESPONSIVE HOOKS
// ============================================================================

/**
 * Hook for using media queries with TypeScript support
 */
export function useMediaQueryTyped(query: MediaQueryKey): boolean {
  return useMediaQuery(mediaQueries[query]);
}

/**
 * Hook for breakpoint-based logic
 */
export function useBreakpoint() {
  const { breakpoint } = useResponsive();
  
  const isAtLeast = useCallback((bp: BreakpointKey): boolean => {
    const bpValues = Object.keys(breakpoints) as BreakpointKey[];
    const currentIndex = bpValues.indexOf(breakpoint);
    const targetIndex = bpValues.indexOf(bp);
    return currentIndex >= targetIndex;
  }, [breakpoint]);

  const isBelow = useCallback((bp: BreakpointKey): boolean => {
    const bpValues = Object.keys(breakpoints) as BreakpointKey[];
    const currentIndex = bpValues.indexOf(breakpoint);
    const targetIndex = bpValues.indexOf(bp);
    return currentIndex < targetIndex;
  }, [breakpoint]);

  return {
    current: breakpoint,
    isAtLeast,
    isBelow,
    isMobile: isBelow('md'),
    isTablet: isAtLeast('md') && isBelow('lg'),
    isDesktop: isAtLeast('lg'),
  };
}

/**
 * Hook for safe area insets (iOS notch support)
 */
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    const updateSafeArea = () => {
      if (typeof window !== 'undefined' && CSS.supports('padding: env(safe-area-inset-top)')) {
        const computedStyle = getComputedStyle(document.documentElement);
        setSafeArea({
          top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0', 10),
          bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0', 10),
          left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0', 10),
          right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0', 10),
        });
      }
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);

    return () => {
      window.removeEventListener('resize', updateSafeArea);
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);

  return safeArea;
}

// ============================================================================
// RESPONSIVE COMPONENTS
// ============================================================================

/**
 * Responsive container with adaptive padding and max-width
 */
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: BreakpointKey | 'none';
  padding?: boolean;
  centerContent?: boolean;
}

export function ResponsiveContainer({
  children,
  className = '',
  maxWidth = '2xl',
  padding = true,
  centerContent = true,
}: ResponsiveContainerProps) {
  const { isMobile } = useBreakpoint();

  const getMaxWidthClass = () => {
    if (maxWidth === 'none') return '';
    return `max-w-${maxWidth}`;
  };

  return (
    <div
      className={`
        ${getMaxWidthClass()}
        ${centerContent ? 'mx-auto' : ''}
        ${padding ? (isMobile ? 'px-4' : 'px-6 lg:px-8') : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * Responsive grid with adaptive columns
 */
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: number | string;
}

export function ResponsiveGrid({
  children,
  className = '',
  cols = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
}: ResponsiveGridProps) {
  const getGridClasses = () => {
    const colClasses = Object.entries(cols)
      .map(([bp, col]) => `${bp === 'xs' ? '' : `${bp}:`}grid-cols-${col}`)
      .join(' ');
    
    return `grid ${colClasses} gap-${gap}`;
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Show/hide components based on breakpoints
 */
interface ShowHideProps {
  children: React.ReactNode;
  above?: BreakpointKey;
  below?: BreakpointKey;
  only?: BreakpointKey | BreakpointKey[];
}

export function Show({ children, above, below, only }: ShowHideProps) {
  const { isAtLeast, isBelow, current } = useBreakpoint();

  const shouldShow = () => {
    if (only) {
      const targets = Array.isArray(only) ? only : [only];
      return targets.includes(current);
    }

    if (above && below) {
      return isAtLeast(above) && isBelow(below);
    }

    if (above) return isAtLeast(above);
    if (below) return isBelow(below);

    return true;
  };

  return shouldShow() ? <>{children}</> : null;
}

export function Hide({ children, above, below, only }: ShowHideProps) {
  const { isAtLeast, isBelow, current } = useBreakpoint();

  const shouldHide = () => {
    if (only) {
      const targets = Array.isArray(only) ? only : [only];
      return targets.includes(current);
    }

    if (above && below) {
      return isAtLeast(above) && isBelow(below);
    }

    if (above) return isAtLeast(above);
    if (below) return isBelow(below);

    return false;
  };

  return shouldHide() ? null : <>{children}</>;
}

// ============================================================================
// TOUCH-OPTIMIZED COMPONENTS
// ============================================================================

/**
 * Touch-friendly button with proper tap targets
 */
interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'emergency';
}

export function TouchButton({
  children,
  size = 'md',
  variant = 'primary',
  className = '',
  ...props
}: TouchButtonProps) {
  const { isTouchDevice } = useResponsive();

  const getSizeClasses = () => {
    const touchSizes = {
      sm: 'min-h-[44px] px-4 py-2 text-sm',
      md: 'min-h-[48px] px-6 py-3 text-base',
      lg: 'min-h-[52px] px-8 py-4 text-lg',
    };

    const mouseSizes = {
      sm: 'h-8 px-3 py-1 text-sm',
      md: 'h-10 px-4 py-2 text-base',
      lg: 'h-12 px-6 py-3 text-lg',
    };

    return isTouchDevice ? touchSizes[size] : mouseSizes[size];
  };

  const getVariantClasses = () => {
    const variants = {
      primary: 'bg-primary-500 hover:bg-primary-600 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
      emergency: 'bg-emergency-500 hover:bg-emergency-600 text-white',
    };

    return variants[variant];
  };

  return (
    <button
      className={`
        ${getSizeClasses()}
        ${getVariantClasses()}
        rounded-lg font-medium transition-colors duration-200
        ${isTouchDevice ? 'active:scale-95' : 'hover:scale-105'}
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default ResponsiveProvider;