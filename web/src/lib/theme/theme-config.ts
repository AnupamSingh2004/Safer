/**
 * Smart Tourist Safety System - Enhanced Theme Configuration
 * Professional emergency services theme with enhanced accessibility and performance
 */

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

// Professional Emergency Service Color Palette
export const emergencyColorPalette = {
  // Primary Safety Blue (Trust, Security, Professional)
  primary: {
    50: '#eff6ff',   // Ultra light blue - subtle backgrounds
    100: '#dbeafe',  // Very light blue - hover backgrounds
    200: '#bfdbfe',  // Light blue - disabled states
    300: '#93c5fd',  // Light blue - secondary elements
    400: '#60a5fa',  // Medium blue - interactive elements
    500: '#3b82f6',  // Main blue (primary brand) - primary buttons
    600: '#2563eb',  // Dark blue - primary hover states
    700: '#1d4ed8',  // Darker blue - pressed states
    800: '#1e40af',  // Very dark blue - important text
    900: '#1e3a8a',  // Darkest blue - headings, critical text
    950: '#172554',  // Ultra dark blue - maximum contrast
  },

  // Secondary Safety Green (Success, Safe Status, Go)
  secondary: {
    50: '#f0fdf4',   // Ultra light green - success backgrounds
    100: '#dcfce7',  // Very light green - safe zone indicators
    200: '#bbf7d0',  // Light green - positive status
    300: '#86efac',  // Light green - safe status icons
    400: '#4ade80',  // Medium green - safe indicators
    500: '#22c55e',  // Main green (success) - safe status
    600: '#16a34a',  // Dark green - safe hover states
    700: '#15803d',  // Darker green - confirmed safe
    800: '#166534',  // Very dark green - success text
    900: '#14532d',  // Darkest green - important success
    950: '#052e16',  // Ultra dark green - maximum contrast
  },

  // Emergency Red (Danger, Alert, Stop)
  emergency: {
    50: '#fef2f2',   // Ultra light red - emergency backgrounds
    100: '#fee2e2',  // Very light red - alert areas
    200: '#fecaca',  // Light red - warning notices
    300: '#fca5a5',  // Light red - alert elements
    400: '#f87171',  // Medium red - warning indicators
    500: '#ef4444',  // Main red (emergency) - emergency buttons
    600: '#dc2626',  // Dark red - emergency hover states
    700: '#b91c1c',  // Darker red - critical status
    800: '#991b1b',  // Very dark red - emergency text
    900: '#7f1d1d',  // Darkest red - critical emergency
    950: '#450a0a',  // Ultra dark red - maximum contrast
  },

  // Warning Amber (Caution, Advisory, Attention)
  warning: {
    50: '#fffbeb',   // Ultra light amber - warning backgrounds
    100: '#fef3c7',  // Very light amber - caution areas
    200: '#fde68a',  // Light amber - advisory notices
    300: '#fcd34d',  // Light amber - attention elements
    400: '#fbbf24',  // Medium amber - warning indicators
    500: '#f59e0b',  // Main amber (warning) - warning buttons
    600: '#d97706',  // Dark amber - warning hover states
    700: '#b45309',  // Darker amber - caution status
    800: '#92400e',  // Very dark amber - warning text
    900: '#78350f',  // Darkest amber - important warnings
    950: '#451a03',  // Ultra dark amber - maximum contrast
  },

  // Information Cyan (Informational, Guidance)
  info: {
    50: '#ecfeff',   // Ultra light cyan - info backgrounds
    100: '#cffafe',  // Very light cyan - info areas
    200: '#a5f3fc',  // Light cyan - informational notices
    300: '#67e8f9',  // Light cyan - info elements
    400: '#22d3ee',  // Medium cyan - info indicators
    500: '#06b6d4',  // Main cyan (info) - info buttons
    600: '#0891b2',  // Dark cyan - info hover states
    700: '#0e7490',  // Darker cyan - guidance status
    800: '#155e75',  // Very dark cyan - info text
    900: '#164e63',  // Darkest cyan - important info
    950: '#083344',  // Ultra dark cyan - maximum contrast
  },

  // Neutral Grays (UI, Text, Backgrounds)
  neutral: {
    50: '#f8fafc',   // Ultra light gray - page backgrounds
    100: '#f1f5f9',  // Very light gray - card backgrounds
    200: '#e2e8f0',  // Light gray - borders, dividers
    300: '#cbd5e1',  // Medium light gray - disabled text
    400: '#94a3b8',  // Medium gray - placeholder text
    500: '#64748b',  // Main gray - secondary text
    600: '#475569',  // Dark gray - primary text
    700: '#334155',  // Darker gray - headings
    800: '#1e293b',  // Very dark gray - important text
    900: '#0f172a',  // Darkest gray - maximum contrast text
    950: '#020617',  // Ultra dark gray - deep backgrounds
  },
} as const;

// Emergency Alert Specific Colors
export const alertTypeColors = {
  critical: '#dc2626',      // Red-600 - Life threatening
  emergency: '#ef4444',     // Red-500 - Immediate response needed
  missing: '#f59e0b',       // Yellow-500 - Missing person
  medical: '#ec4899',       // Pink-500 - Medical emergency
  security: '#f97316',      // Orange-500 - Security threat
  geofence: '#8b5cf6',      // Violet-500 - Zone violation
  anomaly: '#06b6d4',       // Cyan-500 - Unusual behavior
  panic: '#dc2626',         // Red-600 - Panic button activated
  system: '#64748b',        // Slate-500 - System alert
  resolved: '#22c55e',      // Green-500 - Issue resolved
} as const;

// Zone Risk Level Colors
export const zoneRiskColors = {
  safe: '#22c55e',          // Green-500 - Safe for tourism
  lowRisk: '#0891b2',       // Cyan-600 - Low risk area
  moderateRisk: '#f59e0b',  // Yellow-500 - Moderate caution needed
  highRisk: '#ef4444',      // Red-500 - High risk, avoid if possible
  restricted: '#7c2d12',    // Red-900 - Restricted/forbidden area
  unknown: '#64748b',       // Slate-500 - Risk level unknown
} as const;

// ============================================================================
// THEME CONFIGURATIONS
// ============================================================================

// Light Theme Configuration
const lightTheme = {
  colors: {
    // Core theme colors
    primary: emergencyColorPalette.primary[500],
    primaryHover: emergencyColorPalette.primary[600],
    primaryActive: emergencyColorPalette.primary[700],
    primaryForeground: '#ffffff',
    
    secondary: emergencyColorPalette.secondary[500],
    secondaryHover: emergencyColorPalette.secondary[600],
    secondaryForeground: '#ffffff',
    
    // Emergency system colors
    emergency: emergencyColorPalette.emergency[500],
    emergencyHover: emergencyColorPalette.emergency[600],
    emergencyForeground: '#ffffff',
    
    warning: emergencyColorPalette.warning[500],
    warningHover: emergencyColorPalette.warning[600],
    warningForeground: '#ffffff',
    
    info: emergencyColorPalette.info[500],
    infoHover: emergencyColorPalette.info[600],
    infoForeground: '#ffffff',
    
    // Surface colors
    background: '#ffffff',
    backgroundSecondary: emergencyColorPalette.neutral[50],
    foreground: emergencyColorPalette.neutral[900],
    foregroundSecondary: emergencyColorPalette.neutral[600],
    
    // Component colors
    card: '#ffffff',
    cardForeground: emergencyColorPalette.neutral[900],
    border: emergencyColorPalette.neutral[200],
    borderHover: emergencyColorPalette.neutral[300],
    
    // Input colors
    input: '#ffffff',
    inputBorder: emergencyColorPalette.neutral[300],
    inputForeground: emergencyColorPalette.neutral[900],
    
    // State colors
    muted: emergencyColorPalette.neutral[100],
    mutedForeground: emergencyColorPalette.neutral[500],
    accent: emergencyColorPalette.neutral[100],
    accentForeground: emergencyColorPalette.neutral[900],
    
    // Focus and selection
    ring: emergencyColorPalette.primary[500],
    ringOffset: '#ffffff',
  },
} as const;

// Dark Theme Configuration
const darkTheme = {
  colors: {
    // Core theme colors
    primary: emergencyColorPalette.primary[400],
    primaryHover: emergencyColorPalette.primary[300],
    primaryActive: emergencyColorPalette.primary[200],
    primaryForeground: emergencyColorPalette.neutral[900],
    
    secondary: emergencyColorPalette.secondary[400],
    secondaryHover: emergencyColorPalette.secondary[300],
    secondaryForeground: emergencyColorPalette.neutral[900],
    
    // Emergency system colors
    emergency: emergencyColorPalette.emergency[500],
    emergencyHover: emergencyColorPalette.emergency[400],
    emergencyForeground: '#ffffff',
    
    warning: emergencyColorPalette.warning[400],
    warningHover: emergencyColorPalette.warning[300],
    warningForeground: emergencyColorPalette.neutral[900],
    
    info: emergencyColorPalette.info[400],
    infoHover: emergencyColorPalette.info[300],
    infoForeground: emergencyColorPalette.neutral[900],
    
    // Surface colors
    background: emergencyColorPalette.neutral[900],
    backgroundSecondary: emergencyColorPalette.neutral[800],
    foreground: emergencyColorPalette.neutral[50],
    foregroundSecondary: emergencyColorPalette.neutral[400],
    
    // Component colors
    card: emergencyColorPalette.neutral[800],
    cardForeground: emergencyColorPalette.neutral[50],
    border: emergencyColorPalette.neutral[700],
    borderHover: emergencyColorPalette.neutral[600],
    
    // Input colors
    input: emergencyColorPalette.neutral[800],
    inputBorder: emergencyColorPalette.neutral[600],
    inputForeground: emergencyColorPalette.neutral[50],
    
    // State colors
    muted: emergencyColorPalette.neutral[800],
    mutedForeground: emergencyColorPalette.neutral[400],
    accent: emergencyColorPalette.neutral[800],
    accentForeground: emergencyColorPalette.neutral[50],
    
    // Focus and selection
    ring: emergencyColorPalette.primary[400],
    ringOffset: emergencyColorPalette.neutral[900],
  },
} as const;

// High Contrast Theme Configuration
const highContrastTheme = {
  colors: {
    // Core theme colors
    primary: '#0000ff',
    primaryHover: '#0000cc',
    primaryActive: '#000099',
    primaryForeground: '#ffffff',
    
    secondary: '#008000',
    secondaryHover: '#006600',
    secondaryForeground: '#ffffff',
    
    // Emergency system colors
    emergency: '#ff0000',
    emergencyHover: '#cc0000',
    emergencyForeground: '#ffffff',
    
    warning: '#ff8000',
    warningHover: '#cc6600',
    warningForeground: '#ffffff',
    
    info: '#008080',
    infoHover: '#006666',
    infoForeground: '#ffffff',
    
    // Surface colors
    background: '#ffffff',
    backgroundSecondary: '#f0f0f0',
    foreground: '#000000',
    foregroundSecondary: '#333333',
    
    // Component colors
    card: '#ffffff',
    cardForeground: '#000000',
    border: '#000000',
    borderHover: '#000000',
    
    // Input colors
    input: '#ffffff',
    inputBorder: '#000000',
    inputForeground: '#000000',
    
    // State colors
    muted: '#f0f0f0',
    mutedForeground: '#666666',
    accent: '#f0f0f0',
    accentForeground: '#000000',
    
    // Focus and selection
    ring: '#0000ff',
    ringOffset: '#ffffff',
  },
} as const;

// ============================================================================
// THEME CONFIGURATION OBJECT
// ============================================================================

export const themeConfig = {
  light: lightTheme,
  dark: darkTheme,
  'high-contrast': highContrastTheme,
  
  // Animation settings
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    },
  },
  
  // Spacing scale
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },
  
  // Emergency-specific configurations
  emergency: {
    alerts: alertTypeColors,
    zones: zoneRiskColors,
    priorities: {
      low: emergencyColorPalette.info[500],
      medium: emergencyColorPalette.warning[500],
      high: emergencyColorPalette.emergency[500],
      critical: emergencyColorPalette.emergency[700],
    },
  },
  
  // Color palette for external access
  palette: emergencyColorPalette,
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get theme colors for a specific mode
 */
export const getThemeColors = (mode: ThemeMode) => {
  return themeConfig[mode].colors;
};

/**
 * Get emergency-specific colors
 */
export const getEmergencyColors = () => {
  return themeConfig.emergency;
};

/**
 * Get color palette
 */
export const getColorPalette = () => {
  return themeConfig.palette;
};

/**
 * Create CSS variables from theme colors
 */
export const createCSSVariables = (mode: ThemeMode) => {
  const colors = getThemeColors(mode);
  const variables: Record<string, string> = {};
  
  Object.entries(colors).forEach(([key, value]) => {
    const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    variables[`--${cssVar}`] = value;
  });
  
  return variables;
};

/**
 * Check if theme mode is valid
 */
export const isValidThemeMode = (mode: string): mode is ThemeMode => {
  return ['light', 'dark', 'high-contrast'].includes(mode);
};

/**
 * Get default theme based on system preference
 */
export const getDefaultTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      return 'high-contrast';
    }
  }
  return 'light';
};

/**
 * Generate script for FOIT prevention
 * This script runs immediately to set theme before page render
 */
export const getThemeScript = () => {
  return `
    (function() {
      try {
        var theme = localStorage.getItem('theme') || 'light';
        var validThemes = ['light', 'dark', 'high-contrast'];
        
        if (!validThemes.includes(theme)) {
          theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        document.documentElement.classList.remove('light', 'dark', 'high-contrast');
        document.documentElement.classList.add(theme);
        document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
        
        // Disable transitions temporarily to prevent FOIT
        document.documentElement.style.setProperty('--theme-transition-disabled', '1');
        
        // Re-enable transitions after a brief delay
        setTimeout(function() {
          document.documentElement.style.removeProperty('--theme-transition-disabled');
        }, 50);
      } catch (e) {
        console.warn('Theme initialization error:', e);
      }
    })();
  `;
};

// Export theme modes for external use
export const THEME_MODES: ThemeMode[] = ['light', 'dark', 'high-contrast'];

// Default export
export default themeConfig;