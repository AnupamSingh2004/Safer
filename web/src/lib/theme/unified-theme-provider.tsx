/**
 * Smart Tourist Safety System - Unified Theme Provider
 * Complete theme management with emergency modes, accessibility, and seamless transitions
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  type ThemeMode,
  type ResolvedTheme,
  type EmergencySeverity,
  themeConfig,
  getSystemTheme,
  resolveTheme,
  applyThemeToDOM,
  applyEmergencyMode,
  applyAccessibilityPreferences,
  saveThemePreference,
  loadThemePreference,
  getPrefersReducedMotion,
  getPrefersHighContrast,
} from './unified-theme-system';

// ============================================================================
// CONTEXT TYPES
// ============================================================================

interface UnifiedThemeContextType {
  // Theme state
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  systemTheme: 'light' | 'dark';
  isLoaded: boolean;
  isTransitioning: boolean;
  
  // Theme actions
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  cycleLightDark: () => void;
  resetTheme: () => void;
  
  // Emergency mode
  emergencyMode: boolean;
  emergencySeverity: EmergencySeverity;
  setEmergencyMode: (enabled: boolean, severity?: EmergencySeverity) => void;
  toggleEmergencyMode: () => void;
  
  // Accessibility
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  highContrastMode: boolean;
  setHighContrastMode: (enabled: boolean) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  
  // Advanced features
  autoMode: boolean;
  setAutoMode: (enabled: boolean) => void;
  customAccentColor: string;
  setCustomAccentColor: (color: string) => void;
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const UnifiedThemeContext = createContext<UnifiedThemeContextType | undefined>(undefined);

// ============================================================================
// THEME PROVIDER COMPONENT
// ============================================================================

interface UnifiedThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
  enableSystem?: boolean;
  enableTransitions?: boolean;
  enableEmergencyMode?: boolean;
  enableAccessibility?: boolean;
}

export function UnifiedThemeProvider({
  children,
  defaultTheme = themeConfig.defaultTheme,
  storageKey = themeConfig.storageKey,
  enableSystem = themeConfig.enableSystem,
  enableTransitions = themeConfig.enableTransitions,
  enableEmergencyMode = themeConfig.enableEmergencyMode,
  enableAccessibility = themeConfig.enableAccessibility,
}: UnifiedThemeProviderProps) {
  // ========================================================================
  // STATE MANAGEMENT
  // ========================================================================
  
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Emergency mode state
  const [emergencyMode, setEmergencyModeState] = useState(false);
  const [emergencySeverity, setEmergencySeverityState] = useState<EmergencySeverity>('medium');
  
  // Accessibility state
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);
  const [highContrastMode, setHighContrastModeState] = useState(false);
  const [animationsEnabled, setAnimationsEnabledState] = useState(true);
  
  // Advanced features
  const [autoMode, setAutoModeState] = useState(false);
  const [customAccentColor, setCustomAccentColorState] = useState('#3b82f6');
  
  // Refs for cleanup
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();
  const mediaQueryRefs = useRef<MediaQueryList[]>([]);
  
  // ========================================================================
  // COMPUTED VALUES
  // ========================================================================
  
  const resolvedTheme: ResolvedTheme = resolveTheme(
    highContrastMode ? 'high-contrast' : theme,
    systemTheme
  );
  
  // ========================================================================
  // SYSTEM THEME DETECTION
  // ========================================================================
  
  const updateSystemTheme = useCallback(() => {
    if (!enableSystem) return;
    setSystemTheme(getSystemTheme());
  }, [enableSystem]);
  
  // ========================================================================
  // ACCESSIBILITY DETECTION
  // ========================================================================
  
  const updateAccessibilityPreferences = useCallback(() => {
    if (!enableAccessibility) return;
    
    setPrefersReducedMotion(getPrefersReducedMotion());
    setPrefersHighContrast(getPrefersHighContrast());
  }, [enableAccessibility]);
  
  // ========================================================================
  // THEME APPLICATION
  // ========================================================================
  
  const applyTheme = useCallback((newResolvedTheme: ResolvedTheme) => {
    if (enableTransitions) {
      setIsTransitioning(true);
      
      // Clear existing timeout
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      
      // Apply theme with transitions
      applyThemeToDOM(newResolvedTheme, true);
      
      // Reset transitioning state after animation
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, themeConfig.transitionDuration);
    } else {
      applyThemeToDOM(newResolvedTheme, false);
    }
  }, [enableTransitions]);
  
  // ========================================================================
  // THEME ACTIONS
  // ========================================================================
  
  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    saveThemePreference(newTheme);
    
    const newResolvedTheme = resolveTheme(
      highContrastMode ? 'high-contrast' : newTheme,
      systemTheme
    );
    applyTheme(newResolvedTheme);
  }, [systemTheme, highContrastMode, applyTheme]);
  
  const toggleTheme = useCallback(() => {
    const currentResolved = resolveTheme(theme, systemTheme);
    const newTheme = currentResolved === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [theme, systemTheme, setTheme]);
  
  const cycleLightDark = useCallback(() => {
    const themes: ThemeMode[] = ['light', 'dark'];
    const currentIndex = themes.indexOf(theme === 'system' ? systemTheme : theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  }, [theme, systemTheme, setTheme]);
  
  const resetTheme = useCallback(() => {
    setTheme(defaultTheme);
  }, [defaultTheme, setTheme]);
  
  // ========================================================================
  // EMERGENCY MODE ACTIONS
  // ========================================================================
  
  const setEmergencyMode = useCallback((enabled: boolean, severity: EmergencySeverity = 'medium') => {
    if (!enableEmergencyMode) return;
    
    setEmergencyModeState(enabled);
    setEmergencySeverityState(severity);
    
    // Apply emergency mode styles
    applyEmergencyMode(enabled, severity);
    
    // Save emergency state
    try {
      localStorage.setItem(`${storageKey}-emergency`, JSON.stringify({ enabled, severity }));
    } catch (error) {
      console.warn('Failed to save emergency mode state:', error);
    }
    
    // For critical emergencies, force high contrast and light theme
    if (enabled && severity === 'critical') {
      setHighContrastModeState(true);
      setTheme('light');
    }
  }, [enableEmergencyMode, storageKey, setTheme]);
  
  const toggleEmergencyMode = useCallback(() => {
    setEmergencyMode(!emergencyMode, emergencySeverity);
  }, [emergencyMode, emergencySeverity, setEmergencyMode]);
  
  // ========================================================================
  // ACCESSIBILITY ACTIONS
  // ========================================================================
  
  const setHighContrastMode = useCallback((enabled: boolean) => {
    setHighContrastModeState(enabled);
    
    // Save preference
    try {
      localStorage.setItem(`${storageKey}-high-contrast`, enabled.toString());
    } catch (error) {
      console.warn('Failed to save high contrast preference:', error);
    }
    
    // Apply theme with high contrast
    const newResolvedTheme = resolveTheme(
      enabled ? 'high-contrast' : theme,
      systemTheme
    );
    applyTheme(newResolvedTheme);
  }, [theme, systemTheme, storageKey, applyTheme]);
  
  const setAnimationsEnabled = useCallback((enabled: boolean) => {
    setAnimationsEnabledState(enabled);
    
    // Apply to DOM
    const root = document.documentElement;
    if (enabled) {
      root.classList.remove('reduce-motion');
      root.style.removeProperty('--animation-duration');
    } else {
      root.classList.add('reduce-motion');
      root.style.setProperty('--animation-duration', '0.01ms');
    }
    
    // Save preference
    try {
      localStorage.setItem(`${storageKey}-animations`, enabled.toString());
    } catch (error) {
      console.warn('Failed to save animation preference:', error);
    }
  }, [storageKey]);
  
  // ========================================================================
  // ADVANCED FEATURES
  // ========================================================================
  
  const setAutoMode = useCallback((enabled: boolean) => {
    setAutoModeState(enabled);
    
    // Save preference
    try {
      localStorage.setItem(`${storageKey}-auto-mode`, enabled.toString());
    } catch (error) {
      console.warn('Failed to save auto mode preference:', error);
    }
    
    // If enabling auto mode, switch to system theme
    if (enabled) {
      setTheme('system');
    }
  }, [storageKey, setTheme]);
  
  const setCustomAccentColor = useCallback((color: string) => {
    setCustomAccentColorState(color);
    
    // Apply custom accent color to CSS
    const root = document.documentElement;
    root.style.setProperty('--accent-custom', color);
    
    // Save preference
    try {
      localStorage.setItem(`${storageKey}-accent-color`, color);
    } catch (error) {
      console.warn('Failed to save accent color preference:', error);
    }
  }, [storageKey]);
  
  // ========================================================================
  // INITIALIZATION EFFECTS
  // ========================================================================
  
  // Initialize theme and preferences on mount
  useEffect(() => {
    // Load saved preferences
    const savedTheme = loadThemePreference();
    if (savedTheme) {
      setThemeState(savedTheme);
    }
    
    try {
      // Load emergency mode state
      const savedEmergency = localStorage.getItem(`${storageKey}-emergency`);
      if (savedEmergency) {
        const { enabled, severity } = JSON.parse(savedEmergency);
        setEmergencyModeState(enabled);
        setEmergencySeverityState(severity);
        if (enabled) {
          applyEmergencyMode(enabled, severity);
        }
      }
      
      // Load accessibility preferences
      const savedHighContrast = localStorage.getItem(`${storageKey}-high-contrast`);
      if (savedHighContrast === 'true') {
        setHighContrastModeState(true);
      }
      
      const savedAnimations = localStorage.getItem(`${storageKey}-animations`);
      if (savedAnimations === 'false') {
        setAnimationsEnabledState(false);
      }
      
      // Load advanced features
      const savedAutoMode = localStorage.getItem(`${storageKey}-auto-mode`);
      if (savedAutoMode === 'true') {
        setAutoModeState(true);
      }
      
      const savedAccentColor = localStorage.getItem(`${storageKey}-accent-color`);
      if (savedAccentColor) {
        setCustomAccentColorState(savedAccentColor);
        document.documentElement.style.setProperty('--accent-custom', savedAccentColor);
      }
    } catch (error) {
      console.warn('Failed to load theme preferences:', error);
    }
    
    // Detect system preferences
    updateSystemTheme();
    updateAccessibilityPreferences();
    
    // Apply initial accessibility settings
    applyAccessibilityPreferences();
    
    setIsLoaded(true);
  }, [storageKey, updateSystemTheme, updateAccessibilityPreferences]);
  
  // Set up media query listeners
  useEffect(() => {
    const queries = [
      { query: '(prefers-color-scheme: dark)', handler: updateSystemTheme },
      { query: '(prefers-reduced-motion: reduce)', handler: updateAccessibilityPreferences },
      { query: '(prefers-contrast: high)', handler: updateAccessibilityPreferences },
    ];
    
    queries.forEach(({ query, handler }) => {
      const mediaQuery = window.matchMedia(query);
      mediaQueryRefs.current.push(mediaQuery);
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handler);
      } else if (mediaQuery.addListener) {
        // Legacy support
        mediaQuery.addListener(handler);
      }
    });
    
    return () => {
      mediaQueryRefs.current.forEach(mediaQuery => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', updateSystemTheme);
          mediaQuery.removeEventListener('change', updateAccessibilityPreferences);
        } else if (mediaQuery.removeListener) {
          // Legacy support
          mediaQuery.removeListener(updateSystemTheme);
          mediaQuery.removeListener(updateAccessibilityPreferences);
        }
      });
      mediaQueryRefs.current = [];
    };
  }, [updateSystemTheme, updateAccessibilityPreferences]);
  
  // Apply theme when resolved theme changes
  useEffect(() => {
    if (isLoaded) {
      applyTheme(resolvedTheme);
    }
  }, [isLoaded, resolvedTheme, applyTheme]);
  
  // Auto theme switching (time-based)
  useEffect(() => {
    if (!autoMode) return;
    
    const checkTimeForTheme = () => {
      const hour = new Date().getHours();
      const isDayTime = hour >= 6 && hour < 18;
      const autoTheme = isDayTime ? 'light' : 'dark';
      
      if (theme !== autoTheme && theme !== 'system') {
        setTheme(autoTheme);
      }
    };
    
    // Check immediately
    checkTimeForTheme();
    
    // Check every hour
    const interval = setInterval(checkTimeForTheme, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [autoMode, theme, setTheme]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);
  
  // ========================================================================
  // CONTEXT VALUE
  // ========================================================================
  
  const contextValue: UnifiedThemeContextType = {
    // Theme state
    theme,
    resolvedTheme,
    systemTheme,
    isLoaded,
    isTransitioning,
    
    // Theme actions
    setTheme,
    toggleTheme,
    cycleLightDark,
    resetTheme,
    
    // Emergency mode
    emergencyMode,
    emergencySeverity,
    setEmergencyMode,
    toggleEmergencyMode,
    
    // Accessibility
    prefersReducedMotion,
    prefersHighContrast,
    highContrastMode,
    setHighContrastMode,
    animationsEnabled,
    setAnimationsEnabled,
    
    // Advanced features
    autoMode,
    setAutoMode,
    customAccentColor,
    setCustomAccentColor,
  };
  
  return (
    <UnifiedThemeContext.Provider value={contextValue}>
      {children}
    </UnifiedThemeContext.Provider>
  );
}

// ============================================================================
// THEME HOOK
// ============================================================================

export function useUnifiedTheme(): UnifiedThemeContextType {
  const context = useContext(UnifiedThemeContext);
  
  if (context === undefined) {
    throw new Error('useUnifiedTheme must be used within a UnifiedThemeProvider');
  }
  
  return context;
}

// ============================================================================
// CONVENIENCE HOOKS
// ============================================================================

/**
 * Simple hook for basic theme toggling
 */
export function useThemeToggle() {
  const { theme, toggleTheme, isLoaded } = useUnifiedTheme();
  return { theme, toggleTheme, isLoaded };
}

/**
 * Hook for emergency mode management
 */
export function useEmergencyMode() {
  const { emergencyMode, emergencySeverity, setEmergencyMode, toggleEmergencyMode } = useUnifiedTheme();
  return { emergencyMode, emergencySeverity, setEmergencyMode, toggleEmergencyMode };
}

/**
 * Hook for accessibility features
 */
export function useAccessibility() {
  const { 
    prefersReducedMotion, 
    prefersHighContrast, 
    highContrastMode, 
    setHighContrastMode,
    animationsEnabled,
    setAnimationsEnabled 
  } = useUnifiedTheme();
  
  return {
    prefersReducedMotion,
    prefersHighContrast,
    highContrastMode,
    setHighContrastMode,
    animationsEnabled,
    setAnimationsEnabled,
  };
}

/**
 * Hook that returns theme-aware values
 */
export function useThemeValue<T>(lightValue: T, darkValue: T, highContrastValue?: T): T {
  const { resolvedTheme } = useUnifiedTheme();
  
  switch (resolvedTheme) {
    case 'high-contrast':
      return highContrastValue ?? lightValue;
    case 'dark':
      return darkValue;
    default:
      return lightValue;
  }
}

/**
 * Hook that returns theme-aware CSS classes
 */
export function useThemeClasses(lightClass: string, darkClass: string, highContrastClass?: string): string {
  return useThemeValue(lightClass, darkClass, highContrastClass);
}

export default UnifiedThemeProvider;