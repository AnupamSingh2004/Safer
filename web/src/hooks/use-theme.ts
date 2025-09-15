/**
 * Smart Tourist Safety System - Advanced Theme Hook
 * Enhanced theme persistence with FOIT prevention and system detection
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import { getThemeColors, createCSSVariables, type ThemeMode } from '@/lib/theme/theme-config';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

// ============================================================================
// THEME TYPES & CONSTANTS
// ============================================================================

export type ResolvedTheme = 'light' | 'dark' | 'high-contrast';

interface ThemeConfig {
  defaultTheme: ThemeMode;
  storageKey: string;
  enableSystem: boolean;
  enableTransitions: boolean;
  transitionDuration: number;
}

interface UseThemeOptions extends Partial<ThemeConfig> {
  onThemeChange?: (theme: ResolvedTheme) => void;
}

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  systemTheme: 'light' | 'dark';
  isLoaded: boolean;
  isChanging: boolean;
  colors: ReturnType<typeof getThemeColors>;
}

const DEFAULT_CONFIG: ThemeConfig = {
  defaultTheme: 'light' as ThemeMode,
  storageKey: 'sts-theme',
  enableSystem: true,
  enableTransitions: true,
  transitionDuration: 300,
};

// ============================================================================
// THEME UTILITIES
// ============================================================================

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getStoredTheme = (storageKey: string): ThemeMode | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(storageKey) as ThemeMode;
  } catch {
    return null;
  }
};

const setStoredTheme = (storageKey: string, theme: ThemeMode): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // Ignore storage errors
  }
};

const resolveTheme = (theme: ThemeMode | 'system', systemTheme: 'light' | 'dark'): ResolvedTheme => {
  switch (theme) {
    case 'system':
      return systemTheme;
    case 'high-contrast':
      return 'high-contrast';
    default:
      return theme as ResolvedTheme;
  }
};

// ============================================================================
// THEME APPLICATION
// ============================================================================

const applyTheme = (
  resolvedTheme: ResolvedTheme,
  enableTransitions: boolean,
  transitionDuration: number
): void => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const body = document.body;

  // Temporarily disable transitions to prevent flash
  if (enableTransitions && !root.style.getPropertyValue('--theme-transition-disabled')) {
    root.style.setProperty('--theme-transition-duration', `${transitionDuration}ms`);
    root.style.setProperty('--theme-transition-disabled', '1');
    
    // Re-enable transitions after a frame
    requestAnimationFrame(() => {
      root.style.removeProperty('--theme-transition-disabled');
    });
  }

  // Remove existing theme classes
  root.classList.remove('light', 'dark', 'high-contrast');
  body.classList.remove('light', 'dark', 'high-contrast');

  // Apply new theme
  root.classList.add(resolvedTheme);
  body.classList.add(resolvedTheme);

  // Apply CSS variables
  const cssVars = createCSSVariables(resolvedTheme as ThemeMode);
  Object.entries(cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value as string);
  });

  // Set theme-color meta tag
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    const colors = {
      light: '#ffffff',
      dark: '#0f172a',
      'high-contrast': '#000000',
    };
    themeColorMeta.setAttribute('content', colors[resolvedTheme]);
  }

  // Update CSS custom properties
  root.style.setProperty('--theme-mode', resolvedTheme);
  
  // Dispatch theme change event
  window.dispatchEvent(new CustomEvent('themechange', {
    detail: { theme: resolvedTheme }
  }));
};

// ============================================================================
// FOIT PREVENTION SCRIPT
// ============================================================================

export const getThemeScript = (config: Partial<ThemeConfig> = {}) => {
  const { defaultTheme, storageKey, enableSystem } = { ...DEFAULT_CONFIG, ...config };
  
  return `
    (function() {
      try {
        var storageKey = '${storageKey}';
        var defaultTheme = '${defaultTheme}';
        var enableSystem = ${enableSystem};
        
        var getSystemTheme = function() {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        };
        
        var resolveTheme = function(theme, systemTheme) {
          if (theme === 'system') return systemTheme;
          if (theme === 'high-contrast') return 'high-contrast';
          return theme;
        };
        
        var storedTheme = localStorage.getItem(storageKey);
        var systemTheme = enableSystem ? getSystemTheme() : 'light';
        var theme = storedTheme || defaultTheme;
        var resolvedTheme = resolveTheme(theme, systemTheme);
        
        // Apply theme immediately to prevent FOIT
        document.documentElement.classList.add(resolvedTheme);
        document.body.classList.add(resolvedTheme);
        document.documentElement.style.setProperty('--theme-mode', resolvedTheme);
        
        // Set initial theme-color
        var themeColors = {
          light: '#ffffff',
          dark: '#0f172a',
          'high-contrast': '#000000'
        };
        
        var themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
          themeColorMeta.setAttribute('content', themeColors[resolvedTheme] || themeColors.light);
        }
        
        // Store the resolved theme for hydration
        window.__INITIAL_THEME__ = {
          theme: theme,
          resolvedTheme: resolvedTheme,
          systemTheme: systemTheme
        };
      } catch (e) {
        // Fallback to light theme
        document.documentElement.classList.add('light');
        document.body.classList.add('light');
      }
    })();
  `;
};

// ============================================================================
// MAIN THEME HOOK
// ============================================================================

export function useTheme(options: UseThemeOptions = {}): ThemeState & {
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  cycleLightDark: () => void;
  resetTheme: () => void;
} {
  const config = { ...DEFAULT_CONFIG, ...options };
  const {
    defaultTheme,
    storageKey,
    enableSystem,
    enableTransitions,
    transitionDuration,
    onThemeChange,
  } = config;

  const { theme: nextTheme, setTheme: setNextTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const changeTimeoutRef = useRef<NodeJS.Timeout>();

  // Ensure we only access theme after component mounts (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get the actual theme (resolve 'system' to actual theme)
  const resolvedTheme = (nextTheme === 'system' ? systemTheme : nextTheme) as ResolvedTheme;
  const currentSystemTheme = getSystemTheme();
  
  // Get theme colors for current theme
  const colors = mounted ? getThemeColors(resolvedTheme || 'light') : getThemeColors('light');

  // Apply CSS variables when theme changes
  useEffect(() => {
    if (!mounted || !resolvedTheme) return;
    
    const cssVars = createCSSVariables(resolvedTheme as ThemeMode);
    const root = document.documentElement;
    
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Apply theme classes and transitions
    applyTheme(resolvedTheme, enableTransitions, transitionDuration);
    onThemeChange?.(resolvedTheme);
  }, [mounted, resolvedTheme, enableTransitions, transitionDuration, onThemeChange]);

  // Theme change function with loading state
  const setTheme = useCallback((newTheme: ThemeMode) => {
    setIsChanging(true);
    setNextTheme(newTheme);
    
    // Reset changing state after transition
    if (changeTimeoutRef.current) {
      clearTimeout(changeTimeoutRef.current);
    }
    
    changeTimeoutRef.current = setTimeout(() => {
      setIsChanging(false);
    }, transitionDuration);
  }, [setNextTheme, transitionDuration]);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  // Cycle through light/dark only
  const cycleLightDark = useCallback(() => {
    const themes: ThemeMode[] = ['light', 'dark'];
    const currentIndex = themes.indexOf(nextTheme as ThemeMode);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  }, [nextTheme, setTheme]);

  // Reset to default theme
  const resetTheme = useCallback(() => {
    setTheme(defaultTheme);
  }, [defaultTheme, setTheme]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
      }
    };
  }, []);

  return {
    theme: (nextTheme as ThemeMode) || defaultTheme,
    resolvedTheme: resolvedTheme || 'light',
    systemTheme: currentSystemTheme,
    isLoaded: mounted,
    isChanging,
    colors,
    setTheme,
    toggleTheme,
    cycleLightDark,
    resetTheme,
  };
}

// ============================================================================
// ADDITIONAL HOOKS
// ============================================================================

/**
 * Hook to detect if the user prefers dark mode
 */
export function usePrefersDark(): boolean {
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setPrefersDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersDark;
}

/**
 * Hook to detect if the user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to detect if the user prefers high contrast
 */
export function usePrefersHighContrast(): boolean {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
}

export default useTheme;