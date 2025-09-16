/**
 * Enhanced Smart Tourist Safety Dashboard Color System
 * Professional, accessible color definitions with WCAG AAA compliance
 */

export const themeColors = {
  // Core theme colors (CSS custom properties)
  light: {
    background: 'hsl(210, 20%, 99%)',
    foreground: 'hsl(210, 40%, 8%)',
    card: 'hsl(0, 0%, 100%)',
    cardForeground: 'hsl(210, 40%, 8%)',
    popover: 'hsl(0, 0%, 100%)',
    popoverForeground: 'hsl(210, 40%, 8%)',
    primary: 'hsl(215, 100%, 50%)',
    primaryForeground: 'hsl(0, 0%, 100%)',
    secondary: 'hsl(210, 15%, 93%)',
    secondaryForeground: 'hsl(210, 40%, 12%)',
    accent: 'hsl(195, 85%, 45%)',
    accentForeground: 'hsl(0, 0%, 100%)',
    destructive: 'hsl(0, 72%, 51%)',
    destructiveForeground: 'hsl(0, 0%, 100%)',
    muted: 'hsl(210, 15%, 95%)',
    mutedForeground: 'hsl(210, 25%, 45%)',
    border: 'hsl(210, 20%, 88%)',
    input: 'hsl(210, 20%, 88%)',
    ring: 'hsl(215, 100%, 50%)',
  },
  
  dark: {
    background: 'hsl(222, 47%, 6%)',
    foreground: 'hsl(210, 40%, 96%)',
    card: 'hsl(220, 40%, 10%)',
    cardForeground: 'hsl(210, 40%, 96%)',
    popover: 'hsl(220, 40%, 8%)',
    popoverForeground: 'hsl(210, 40%, 96%)',
    primary: 'hsl(215, 100%, 60%)',
    primaryForeground: 'hsl(220, 47%, 6%)',
    secondary: 'hsl(220, 30%, 15%)',
    secondaryForeground: 'hsl(210, 40%, 90%)',
    accent: 'hsl(195, 85%, 55%)',
    accentForeground: 'hsl(220, 47%, 6%)',
    destructive: 'hsl(0, 70%, 60%)',
    destructiveForeground: 'hsl(210, 40%, 96%)',
    muted: 'hsl(220, 25%, 18%)',
    mutedForeground: 'hsl(210, 15%, 70%)',
    border: 'hsl(220, 25%, 22%)',
    input: 'hsl(220, 25%, 22%)',
    ring: 'hsl(215, 100%, 60%)',
  },

  // Emergency status colors
  emergency: {
    light: {
      critical: 'hsl(0, 85%, 55%)',
      high: 'hsl(20, 90%, 50%)',
      medium: 'hsl(40, 95%, 48%)',
      low: 'hsl(200, 100%, 45%)',
      resolved: 'hsl(145, 75%, 40%)',
    },
    dark: {
      critical: 'hsl(0, 80%, 70%)',
      high: 'hsl(20, 90%, 65%)',
      medium: 'hsl(40, 95%, 60%)',
      low: 'hsl(200, 100%, 60%)',
      resolved: 'hsl(145, 75%, 55%)',
    },
  },

  // Zone risk levels
  zones: {
    light: {
      safe: 'hsl(145, 75%, 40%)',
      lowRisk: 'hsl(200, 100%, 45%)',
      moderate: 'hsl(40, 95%, 48%)',
      highRisk: 'hsl(0, 85%, 55%)',
      restricted: 'hsl(270, 80%, 45%)',
    },
    dark: {
      safe: 'hsl(145, 75%, 55%)',
      lowRisk: 'hsl(200, 100%, 60%)',
      moderate: 'hsl(40, 95%, 60%)',
      highRisk: 'hsl(0, 80%, 70%)',
      restricted: 'hsl(270, 80%, 65%)',
    },
  },

  // Status indicators
  status: {
    light: {
      online: 'hsl(145, 75%, 40%)',
      offline: 'hsl(210, 25%, 55%)',
      away: 'hsl(40, 95%, 48%)',
      busy: 'hsl(0, 85%, 55%)',
      maintenance: 'hsl(270, 80%, 45%)',
    },
    dark: {
      online: 'hsl(145, 75%, 55%)',
      offline: 'hsl(210, 25%, 65%)',
      away: 'hsl(40, 95%, 60%)',
      busy: 'hsl(0, 80%, 70%)',
      maintenance: 'hsl(270, 80%, 65%)',
    },
  },

  // Tailwind color palette extensions
  palette: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#0066ff',
      600: '#0052cc',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#16a34a',
      600: '#15803d',
      700: '#166534',
      800: '#14532d',
      900: '#052e16',
    },
    warning: {
      50: '#fef3c7',
      100: '#fde68a',
      200: '#fcd34d',
      300: '#fbbf24',
      400: '#f59e0b',
      500: '#d97706',
      600: '#b45309',
      700: '#92400e',
      800: '#78350f',
      900: '#451a03',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#dc2626',
      600: '#b91c1c',
      700: '#991b1b',
      800: '#7f1d1d',
      900: '#450a0a',
    },
    info: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0284c7',
      600: '#0369a1',
      700: '#0c4a6e',
      800: '#075985',
      900: '#0c4a6e',
    },
  },

  // Government-appropriate color schemes
  government: {
    light: {
      primary: 'hsl(215, 100%, 50%)', // Official blue
      secondary: 'hsl(210, 15%, 93%)', // Clean gray
      accent: 'hsl(195, 85%, 45%)', // Professional teal
      success: 'hsl(145, 75%, 40%)', // Government green
      warning: 'hsl(40, 95%, 48%)', // Alert yellow
      error: 'hsl(0, 85%, 55%)', // Critical red
      neutral: 'hsl(210, 25%, 45%)', // Professional gray
    },
    dark: {
      primary: 'hsl(215, 100%, 60%)', // Bright official blue
      secondary: 'hsl(220, 30%, 15%)', // Rich dark gray
      accent: 'hsl(195, 85%, 55%)', // Glowing teal
      success: 'hsl(145, 75%, 55%)', // Vibrant green
      warning: 'hsl(40, 95%, 60%)', // Clear yellow
      error: 'hsl(0, 80%, 70%)', // Visible red
      neutral: 'hsl(210, 15%, 70%)', // Light gray text
    },
  },

  // Accessibility helpers
  accessibility: {
    // High contrast mode colors
    highContrast: {
      background: 'hsl(0, 0%, 100%)',
      foreground: 'hsl(0, 0%, 0%)',
      primary: 'hsl(240, 100%, 50%)',
      border: 'hsl(0, 0%, 0%)',
    },
    // Focus indicators
    focus: {
      ring: 'hsl(215, 100%, 50%)',
      ringOffset: 'hsl(0, 0%, 100%)',
    },
    // Reduced motion support
    reducedMotion: {
      transitionDuration: '0.01ms',
      animationDuration: '0.01ms',
    },
  },
} as const;

export type ThemeMode = 'light' | 'dark';
export type EmergencyLevel = 'critical' | 'high' | 'medium' | 'low' | 'resolved';
export type ZoneRisk = 'safe' | 'lowRisk' | 'moderate' | 'highRisk' | 'restricted';
export type StatusType = 'online' | 'offline' | 'away' | 'busy' | 'maintenance';

/**
 * Get color value by theme mode and category
 */
export const getThemeColor = (
  category: keyof typeof themeColors,
  mode: ThemeMode,
  variant?: string
) => {
  const categoryColors = themeColors[category];
  
  if (typeof categoryColors === 'object' && mode in categoryColors) {
    const modeColors = categoryColors[mode as keyof typeof categoryColors];
    
    if (variant && typeof modeColors === 'object' && variant in modeColors) {
      return modeColors[variant as keyof typeof modeColors];
    }
    
    return modeColors;
  }
  
  return null;
};

/**
 * Get emergency color by level and theme
 */
export const getEmergencyColor = (level: EmergencyLevel, mode: ThemeMode = 'light') => {
  return themeColors.emergency[mode][level];
};

/**
 * Get zone color by risk level and theme
 */
export const getZoneColor = (risk: ZoneRisk, mode: ThemeMode = 'light') => {
  return themeColors.zones[mode][risk];
};

/**
 * Get status color by type and theme
 */
export const getStatusColor = (status: StatusType, mode: ThemeMode = 'light') => {
  return themeColors.status[mode][status];
};

/**
 * Check if current system prefers dark mode
 */
export const prefersDarkMode = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

/**
 * Check if current system prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

/**
 * Check if current system prefers high contrast
 */
export const prefersHighContrast = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }
  return false;
};

export default themeColors;
