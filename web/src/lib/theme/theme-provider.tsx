/**
 * Smart Tourist Safety System - Theme Provider
 * Advanced theme provider with smooth transitions and perfect theme switching
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { generateCSSVars } from './color-system';

// ============================================================================
// TYPES
// ============================================================================

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  systemTheme: ResolvedTheme;
  isTransitioning: boolean;
}

// ============================================================================
// CONTEXT
// ============================================================================

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ============================================================================
// THEME PROVIDER
// ============================================================================

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  attribute?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'smart-tourist-theme',
  enableSystem = true,
  disableTransitionOnChange = false,
  attribute = 'class',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get resolved theme (actual theme being used)
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

  // ========================================================================
  // SYSTEM THEME DETECTION
  // ========================================================================

  const updateSystemTheme = useCallback(() => {
    if (!enableSystem) return;

    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';

    setSystemTheme(systemPreference);
  }, [enableSystem]);

  // ========================================================================
  // THEME APPLICATION
  // ========================================================================

  const applyTheme = useCallback((newResolvedTheme: ResolvedTheme) => {
    const root = document.documentElement;
    
    // Add transition class if not disabled
    if (!disableTransitionOnChange) {
      setIsTransitioning(true);
      root.style.setProperty('--theme-transition', 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)');
      root.classList.add('theme-transitioning');
    }

    // Generate and apply CSS custom properties
    const cssVars = generateCSSVars(newResolvedTheme);
    Object.entries(cssVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Apply theme class
    if (attribute === 'class') {
      root.classList.remove('light', 'dark');
      root.classList.add(newResolvedTheme);
    } else {
      root.setAttribute(attribute, newResolvedTheme);
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        newResolvedTheme === 'dark' ? '#0f172a' : '#ffffff'
      );
    }

    // Remove transition after animation completes
    if (!disableTransitionOnChange) {
      setTimeout(() => {
        setIsTransitioning(false);
        root.style.removeProperty('--theme-transition');
        root.classList.remove('theme-transitioning');
      }, 300);
    }
  }, [attribute, disableTransitionOnChange]);

  // ========================================================================
  // THEME SETTING
  // ========================================================================

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }

    // Apply the theme immediately
    const newResolvedTheme = newTheme === 'system' ? systemTheme : newTheme;
    applyTheme(newResolvedTheme);
  }, [storageKey, systemTheme, applyTheme]);

  // ========================================================================
  // THEME TOGGLING
  // ========================================================================

  const toggleTheme = useCallback(() => {
    const currentResolved = theme === 'system' ? systemTheme : theme;
    const newTheme = currentResolved === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [theme, systemTheme, setTheme]);

  // ========================================================================
  // INITIALIZATION
  // ========================================================================

  useEffect(() => {
    // Set up system theme detection
    if (enableSystem) {
      updateSystemTheme();
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateSystemTheme();
      
      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } 
      // Legacy browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, [enableSystem, updateSystemTheme]);

  useEffect(() => {
    // Load saved theme preference
    try {
      const savedTheme = localStorage.getItem(storageKey) as Theme;
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeState(savedTheme);
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }
  }, [storageKey]);

  useEffect(() => {
    // Apply theme when resolved theme changes
    applyTheme(resolvedTheme);
  }, [resolvedTheme, applyTheme]);

  // ========================================================================
  // ACCESSIBILITY & PERFORMANCE
  // ========================================================================

  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      document.documentElement.style.setProperty('--theme-transition', 'none');
    }

    // Preload theme assets
    const linkElement = document.createElement('link');
    linkElement.rel = 'preload';
    linkElement.as = 'style';
    linkElement.href = '/styles/theme-assets.css';
    document.head.appendChild(linkElement);

    return () => {
      if (linkElement.parentNode) {
        linkElement.parentNode.removeChild(linkElement);
      }
    };
  }, []);

  // ========================================================================
  // EMERGENCY MODE SUPPORT
  // ========================================================================

  useEffect(() => {
    // Emergency mode handling
    const handleEmergencyMode = (event: CustomEvent) => {
      const root = document.documentElement;
      
      if (event.detail.enabled) {
        root.classList.add('emergency-mode');
        root.style.setProperty('--emergency-priority', '1');
      } else {
        root.classList.remove('emergency-mode');
        root.style.removeProperty('--emergency-priority');
      }
    };

    window.addEventListener('emergency-mode-toggle', handleEmergencyMode as EventListener);
    
    return () => {
      window.removeEventListener('emergency-mode-toggle', handleEmergencyMode as EventListener);
    };
  }, []);

  // ========================================================================
  // CONTEXT VALUE
  // ========================================================================

  const contextValue: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    systemTheme,
    isTransitioning,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================================================
// THEME HOOK
// ============================================================================

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

// ============================================================================
// THEME UTILITIES
// ============================================================================

/**
 * Check if current theme is dark
 */
export function useIsDarkTheme(): boolean {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark';
}

/**
 * Get theme-aware CSS class
 */
export function useThemeClass(lightClass: string, darkClass: string): string {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark' ? darkClass : lightClass;
}

/**
 * Get theme-aware value
 */
export function useThemeValue<T>(lightValue: T, darkValue: T): T {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark' ? darkValue : lightValue;
}

/**
 * Force emergency mode styles
 */
export function triggerEmergencyMode(enabled: boolean = true): void {
  const event = new CustomEvent('emergency-mode-toggle', {
    detail: { enabled }
  });
  window.dispatchEvent(event);
}

// ============================================================================
// SSR SCRIPT
// ============================================================================

/**
 * Script to prevent flash of incorrect theme on SSR
 * Add this to your document head
 */
export const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('smart-tourist-theme') || 'system';
      var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var resolvedTheme = theme === 'system' ? systemTheme : theme;
      
      document.documentElement.classList.add(resolvedTheme);
      document.documentElement.setAttribute('data-theme', resolvedTheme);
      
      // Set initial CSS variables for immediate rendering
      if (resolvedTheme === 'dark') {
        document.documentElement.style.setProperty('--background', '222 84% 5%');
        document.documentElement.style.setProperty('--foreground', '210 40% 98%');
      } else {
        document.documentElement.style.setProperty('--background', '0 0% 100%');
        document.documentElement.style.setProperty('--foreground', '222.2 84% 4.9%');
      }
    } catch (e) {
      console.warn('Theme initialization error:', e);
    }
  })();
`;

export default ThemeProvider;