/**
 * Smart Tourist Safety System - Unified Theme System
 * Complete theme management solution with emergency modes, accessibility, and transitions
 */

export type ThemeMode = 'light' | 'dark' | 'system' | 'high-contrast';
export type ResolvedTheme = 'light' | 'dark' | 'high-contrast';
export type EmergencySeverity = 'low' | 'medium' | 'high' | 'critical';

// ============================================================================
// THEME CONFIGURATION
// ============================================================================

export const themeConfig = {
  defaultTheme: 'system' as ThemeMode,
  storageKey: 'sts-unified-theme',
  enableSystem: true,
  enableTransitions: true,
  transitionDuration: 300,
  enableEmergencyMode: true,
  enableAccessibility: true,
} as const;

// ============================================================================
// COLOR SYSTEM
// ============================================================================

export const colorTokens = {
  light: {
    // Base colors
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(222.2 84% 4.9%)',
    
    // UI colors
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(222.2 84% 4.9%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(222.2 84% 4.9%)',
    
    // Primary colors
    primary: 'hsl(221.2 83.2% 53.3%)',
    primaryForeground: 'hsl(210 40% 98%)',
    
    // Secondary colors
    secondary: 'hsl(210 40% 96%)',
    secondaryForeground: 'hsl(222.2 84% 4.9%)',
    
    // Muted colors
    muted: 'hsl(210 40% 96%)',
    mutedForeground: 'hsl(215.4 16.3% 46.9%)',
    
    // Accent colors
    accent: 'hsl(210 40% 96%)',
    accentForeground: 'hsl(222.2 84% 4.9%)',
    
    // Destructive colors
    destructive: 'hsl(0 84.2% 60.2%)',
    destructiveForeground: 'hsl(210 40% 98%)',
    
    // Border colors
    border: 'hsl(214.3 31.8% 91.4%)',
    input: 'hsl(214.3 31.8% 91.4%)',
    ring: 'hsl(221.2 83.2% 53.3%)',
    
    // Emergency colors
    emergency: 'hsl(0 84.2% 60.2%)',
    emergencyForeground: 'hsl(0 0% 100%)',
    warning: 'hsl(38 92% 50%)',
    warningForeground: 'hsl(0 0% 100%)',
    success: 'hsl(142 76% 36%)',
    successForeground: 'hsl(0 0% 100%)',
    info: 'hsl(204 94% 58%)',
    infoForeground: 'hsl(0 0% 100%)',
  },
  
  dark: {
    // Base colors
    background: 'hsl(222.2 84% 4.9%)',
    foreground: 'hsl(210 40% 98%)',
    
    // UI colors
    card: 'hsl(222.2 84% 4.9%)',
    cardForeground: 'hsl(210 40% 98%)',
    popover: 'hsl(222.2 84% 4.9%)',
    popoverForeground: 'hsl(210 40% 98%)',
    
    // Primary colors
    primary: 'hsl(217.2 91.2% 59.8%)',
    primaryForeground: 'hsl(222.2 84% 4.9%)',
    
    // Secondary colors
    secondary: 'hsl(217.2 32.6% 17.5%)',
    secondaryForeground: 'hsl(210 40% 98%)',
    
    // Muted colors
    muted: 'hsl(217.2 32.6% 17.5%)',
    mutedForeground: 'hsl(215 20.2% 65.1%)',
    
    // Accent colors
    accent: 'hsl(217.2 32.6% 17.5%)',
    accentForeground: 'hsl(210 40% 98%)',
    
    // Destructive colors
    destructive: 'hsl(0 62.8% 30.6%)',
    destructiveForeground: 'hsl(210 40% 98%)',
    
    // Border colors
    border: 'hsl(217.2 32.6% 17.5%)',
    input: 'hsl(217.2 32.6% 17.5%)',
    ring: 'hsl(224.3 76.3% 94.1%)',
    
    // Emergency colors
    emergency: 'hsl(0 84.2% 60.2%)',
    emergencyForeground: 'hsl(0 0% 100%)',
    warning: 'hsl(38 92% 50%)',
    warningForeground: 'hsl(0 0% 100%)',
    success: 'hsl(142 76% 36%)',
    successForeground: 'hsl(0 0% 100%)',
    info: 'hsl(204 94% 58%)',
    infoForeground: 'hsl(0 0% 100%)',
  },
  
  'high-contrast': {
    // Base colors
    background: 'hsl(0 0% 0%)',
    foreground: 'hsl(0 0% 100%)',
    
    // UI colors
    card: 'hsl(0 0% 0%)',
    cardForeground: 'hsl(0 0% 100%)',
    popover: 'hsl(0 0% 0%)',
    popoverForeground: 'hsl(0 0% 100%)',
    
    // Primary colors
    primary: 'hsl(0 0% 100%)',
    primaryForeground: 'hsl(0 0% 0%)',
    
    // Secondary colors
    secondary: 'hsl(0 0% 20%)',
    secondaryForeground: 'hsl(0 0% 100%)',
    
    // Muted colors
    muted: 'hsl(0 0% 20%)',
    mutedForeground: 'hsl(0 0% 80%)',
    
    // Accent colors
    accent: 'hsl(0 0% 100%)',
    accentForeground: 'hsl(0 0% 0%)',
    
    // Destructive colors
    destructive: 'hsl(0 100% 50%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    
    // Border colors
    border: 'hsl(0 0% 100%)',
    input: 'hsl(0 0% 100%)',
    ring: 'hsl(0 0% 100%)',
    
    // Emergency colors
    emergency: 'hsl(0 100% 50%)',
    emergencyForeground: 'hsl(0 0% 100%)',
    warning: 'hsl(45 100% 50%)',
    warningForeground: 'hsl(0 0% 0%)',
    success: 'hsl(120 100% 50%)',
    successForeground: 'hsl(0 0% 0%)',
    info: 'hsl(240 100% 50%)',
    infoForeground: 'hsl(0 0% 100%)',
  },
} as const;

// ============================================================================
// UTILITIES
// ============================================================================

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function resolveTheme(theme: ThemeMode, systemTheme: 'light' | 'dark'): ResolvedTheme {
  switch (theme) {
    case 'system':
      return systemTheme;
    case 'high-contrast':
      return 'high-contrast';
    default:
      return theme as ResolvedTheme;
  }
}

export function getCSSVariables(theme: ResolvedTheme): Record<string, string> {
  const tokens = colorTokens[theme];
  const cssVars: Record<string, string> = {};
  
  Object.entries(tokens).forEach(([key, value]) => {
    // Convert camelCase to kebab-case for CSS variables
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssVars[`--${cssKey}`] = value;
  });
  
  return cssVars;
}

export function applyThemeToDOM(theme: ResolvedTheme, enableTransitions = true): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  const body = document.body;
  
  // Apply CSS variables
  const cssVars = getCSSVariables(theme);
  Object.entries(cssVars).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  
  // Apply theme classes
  root.classList.remove('light', 'dark', 'high-contrast');
  body.classList.remove('light', 'dark', 'high-contrast');
  root.classList.add(theme);
  body.classList.add(theme);
  
  // Set data attributes for advanced selectors
  root.setAttribute('data-theme', theme);
  body.setAttribute('data-theme', theme);
  
  // Update theme-color meta tag
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    const themeColors = {
      light: '#ffffff',
      dark: '#0f172a',
      'high-contrast': '#000000',
    };
    metaThemeColor.setAttribute('content', themeColors[theme]);
  }
  
  // Dispatch theme change event
  window.dispatchEvent(new CustomEvent('themechange', {
    detail: { theme, timestamp: Date.now() }
  }));
}

// ============================================================================
// EMERGENCY MODE UTILITIES
// ============================================================================

export function getEmergencyStyles(severity: EmergencySeverity): Record<string, string> {
  const baseStyles = {
    '--emergency-bg': 'hsl(0 84.2% 60.2%)',
    '--emergency-fg': 'hsl(0 0% 100%)',
    '--emergency-border': 'hsl(0 84.2% 50.2%)',
  };
  
  const severityStyles = {
    low: {
      '--emergency-opacity': '0.8',
      '--emergency-pulse': '2s',
    },
    medium: {
      '--emergency-opacity': '0.9',
      '--emergency-pulse': '1.5s',
    },
    high: {
      '--emergency-opacity': '1',
      '--emergency-pulse': '1s',
    },
    critical: {
      '--emergency-opacity': '1',
      '--emergency-pulse': '0.5s',
      '--emergency-bg': 'hsl(0 100% 50%)',
    },
  };
  
  return { ...baseStyles, ...severityStyles[severity] };
}

export function applyEmergencyMode(enabled: boolean, severity: EmergencySeverity = 'medium'): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  const body = document.body;
  
  if (enabled) {
    const emergencyStyles = getEmergencyStyles(severity);
    Object.entries(emergencyStyles).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    root.classList.add('emergency-mode');
    body.classList.add('emergency-mode');
    root.setAttribute('data-emergency', severity);
    
    // Force high contrast for critical emergencies
    if (severity === 'critical') {
      applyThemeToDOM('high-contrast', false);
    }
  } else {
    root.classList.remove('emergency-mode');
    body.classList.remove('emergency-mode');
    root.removeAttribute('data-emergency');
    
    // Remove emergency CSS variables
    const emergencyProps = [
      '--emergency-bg', '--emergency-fg', '--emergency-border',
      '--emergency-opacity', '--emergency-pulse'
    ];
    emergencyProps.forEach(prop => root.style.removeProperty(prop));
  }
  
  // Dispatch emergency mode event
  window.dispatchEvent(new CustomEvent('emergencymode', {
    detail: { enabled, severity, timestamp: Date.now() }
  }));
}

// ============================================================================
// ACCESSIBILITY UTILITIES
// ============================================================================

export function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getPrefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
}

export function applyAccessibilityPreferences(): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Apply reduced motion
  if (getPrefersReducedMotion()) {
    root.classList.add('reduce-motion');
    root.style.setProperty('--animation-duration', '0.01ms');
  } else {
    root.classList.remove('reduce-motion');
    root.style.removeProperty('--animation-duration');
  }
  
  // Apply high contrast if system prefers it
  if (getPrefersHighContrast()) {
    root.classList.add('system-high-contrast');
  } else {
    root.classList.remove('system-high-contrast');
  }
}

// ============================================================================
// THEME PERSISTENCE
// ============================================================================

export function saveThemePreference(theme: ThemeMode): void {
  if (typeof localStorage === 'undefined') return;
  
  try {
    localStorage.setItem(themeConfig.storageKey, theme);
  } catch (error) {
    console.warn('Failed to save theme preference:', error);
  }
}

export function loadThemePreference(): ThemeMode | null {
  if (typeof localStorage === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem(themeConfig.storageKey);
    return ['light', 'dark', 'system', 'high-contrast'].includes(saved as string) 
      ? (saved as ThemeMode) 
      : null;
  } catch (error) {
    console.warn('Failed to load theme preference:', error);
    return null;
  }
}

// ============================================================================
// THEME SCRIPT FOR SSR
// ============================================================================

export function getThemeScript(): string {
  return `
    (function() {
      try {
        var config = ${JSON.stringify(themeConfig)};
        var colorTokens = ${JSON.stringify(colorTokens)};
        
        function getSystemTheme() {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        function resolveTheme(theme, systemTheme) {
          return theme === 'system' ? systemTheme : theme;
        }
        
        function getCSSVariables(theme) {
          var tokens = colorTokens[theme] || colorTokens.light;
          var cssVars = {};
          
          Object.keys(tokens).forEach(function(key) {
            var cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            cssVars['--' + cssKey] = tokens[key];
          });
          
          return cssVars;
        }
        
        // Get initial theme
        var savedTheme = localStorage.getItem(config.storageKey);
        var systemTheme = getSystemTheme();
        var theme = savedTheme || config.defaultTheme;
        var resolvedTheme = resolveTheme(theme, systemTheme);
        
        // Apply theme immediately
        var root = document.documentElement;
        var body = document.body;
        
        // Apply CSS variables
        var cssVars = getCSSVariables(resolvedTheme);
        Object.keys(cssVars).forEach(function(property) {
          root.style.setProperty(property, cssVars[property]);
        });
        
        // Apply classes
        root.classList.add(resolvedTheme);
        body.classList.add(resolvedTheme);
        root.setAttribute('data-theme', resolvedTheme);
        body.setAttribute('data-theme', resolvedTheme);
        
        // Set theme-color
        var metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          var themeColors = {
            light: '#ffffff',
            dark: '#0f172a',
            'high-contrast': '#000000'
          };
          metaThemeColor.setAttribute('content', themeColors[resolvedTheme] || '#ffffff');
        }
        
        // Store for hydration
        window.__THEME_STATE__ = {
          theme: theme,
          resolvedTheme: resolvedTheme,
          systemTheme: systemTheme
        };
        
      } catch (error) {
        console.warn('Theme initialization failed:', error);
        // Fallback
        document.documentElement.classList.add('light');
        document.body.classList.add('light');
      }
    })();
  `;
}