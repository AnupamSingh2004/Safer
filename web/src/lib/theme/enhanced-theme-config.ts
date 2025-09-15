/**
 * Smart Tourist Safety System - Enhanced Theme Configuration
 * Professional emergency services theme with enhanced accessibility and smooth animations
 */

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

// Professional Emergency Service Enhanced Color Palette
export const enhancedEmergencyColors = {
  // Primary Safety Blue (Trust, Security, Professional)
  safePrimary: {
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

  // Emergency Green (Success, Safe Status, All Clear)
  safeSecondary: {
    50: '#f0fdf4',   // Ultra light green - success backgrounds
    100: '#dcfce7',  // Very light green - safe zone indicators
    200: '#bbf7d0',  // Light green - positive status
    300: '#86efac',  // Light green - safe status icons
    400: '#4ade80',  // Medium green - success indicators
    500: '#22c55e',  // Main green (safety confirmed) - success buttons
    600: '#16a34a',  // Dark green - success hover states
    700: '#15803d',  // Darker green - confirmed safe status
    800: '#166534',  // Very dark green - safe zone text
    900: '#14532d',  // Darkest green - important safe status
    950: '#0f2419',  // Ultra dark green - maximum contrast
  },

  // Critical Emergency Red (Danger, Alert, Emergency)
  emergencyDanger: {
    50: '#fef2f2',   // Ultra light red - emergency backgrounds
    100: '#fee2e2',  // Very light red - alert backgrounds
    200: '#fecaca',  // Light red - warning backgrounds
    300: '#fca5a5',  // Light red - moderate alerts
    400: '#f87171',  // Medium red - alert indicators
    500: '#ef4444',  // Main red (emergency) - critical alerts
    600: '#dc2626',  // Dark red - emergency buttons
    700: '#b91c1c',  // Darker red - critical status
    800: '#991b1b',  // Very dark red - emergency text
    900: '#7f1d1d',  // Darkest red - critical emergency
    950: '#450a0a',  // Ultra dark red - maximum contrast
  },

  // Warning Amber (Caution, Advisory, Attention)
  cautionWarning: {
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

  // Professional Neutrals (UI, Text, Backgrounds)
  professionalNeutral: {
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
};

// Theme Mode Configurations
export const enhancedThemeConfig = {
  light: {
    colors: {
      // Primary Emergency Colors
      primary: enhancedEmergencyColors.safePrimary[500],
      primaryHover: enhancedEmergencyColors.safePrimary[600],
      primaryActive: enhancedEmergencyColors.safePrimary[700],
      primaryForeground: '#ffffff',
      
      // Secondary Success Colors
      secondary: enhancedEmergencyColors.safeSecondary[500],
      secondaryHover: enhancedEmergencyColors.safeSecondary[600],
      secondaryActive: enhancedEmergencyColors.safeSecondary[700],
      secondaryForeground: '#ffffff',
      
      // Emergency Alert Colors
      danger: enhancedEmergencyColors.emergencyDanger[500],
      dangerHover: enhancedEmergencyColors.emergencyDanger[600],
      dangerActive: enhancedEmergencyColors.emergencyDanger[700],
      dangerForeground: '#ffffff',
      
      // Warning Colors
      warning: enhancedEmergencyColors.cautionWarning[500],
      warningHover: enhancedEmergencyColors.cautionWarning[600],
      warningActive: enhancedEmergencyColors.cautionWarning[700],
      warningForeground: '#ffffff',
      
      // Background Colors
      background: enhancedEmergencyColors.professionalNeutral[50],
      cardBackground: '#ffffff',
      popoverBackground: '#ffffff',
      
      // Text Colors
      foreground: enhancedEmergencyColors.professionalNeutral[900],
      muted: enhancedEmergencyColors.professionalNeutral[500],
      mutedForeground: enhancedEmergencyColors.professionalNeutral[600],
      
      // Border Colors
      border: enhancedEmergencyColors.professionalNeutral[200],
      input: enhancedEmergencyColors.professionalNeutral[200],
      ring: enhancedEmergencyColors.safePrimary[500],
      
      // Accent Colors
      accent: enhancedEmergencyColors.professionalNeutral[100],
      accentForeground: enhancedEmergencyColors.professionalNeutral[900],
    },
    shadows: {
      small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      large: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      emergency: '0 0 0 3px rgb(239 68 68 / 0.5)', // Red emergency glow
      success: '0 0 0 3px rgb(34 197 94 / 0.5)',   // Green success glow
    }
  },
  
  dark: {
    colors: {
      // Primary Emergency Colors (adjusted for dark mode)
      primary: enhancedEmergencyColors.safePrimary[400],
      primaryHover: enhancedEmergencyColors.safePrimary[300],
      primaryActive: enhancedEmergencyColors.safePrimary[200],
      primaryForeground: enhancedEmergencyColors.professionalNeutral[900],
      
      // Secondary Success Colors
      secondary: enhancedEmergencyColors.safeSecondary[400],
      secondaryHover: enhancedEmergencyColors.safeSecondary[300],
      secondaryActive: enhancedEmergencyColors.safeSecondary[200],
      secondaryForeground: enhancedEmergencyColors.professionalNeutral[900],
      
      // Emergency Alert Colors
      danger: enhancedEmergencyColors.emergencyDanger[400],
      dangerHover: enhancedEmergencyColors.emergencyDanger[300],
      dangerActive: enhancedEmergencyColors.emergencyDanger[200],
      dangerForeground: enhancedEmergencyColors.professionalNeutral[900],
      
      // Warning Colors
      warning: enhancedEmergencyColors.cautionWarning[400],
      warningHover: enhancedEmergencyColors.cautionWarning[300],
      warningActive: enhancedEmergencyColors.cautionWarning[200],
      warningForeground: enhancedEmergencyColors.professionalNeutral[900],
      
      // Background Colors
      background: enhancedEmergencyColors.professionalNeutral[950],
      cardBackground: enhancedEmergencyColors.professionalNeutral[900],
      popoverBackground: enhancedEmergencyColors.professionalNeutral[800],
      
      // Text Colors (enhanced contrast for dark mode)
      foreground: enhancedEmergencyColors.professionalNeutral[50],
      muted: enhancedEmergencyColors.professionalNeutral[400],
      mutedForeground: enhancedEmergencyColors.professionalNeutral[300],
      
      // Border Colors
      border: enhancedEmergencyColors.professionalNeutral[700],
      input: enhancedEmergencyColors.professionalNeutral[700],
      ring: enhancedEmergencyColors.safePrimary[400],
      
      // Accent Colors
      accent: enhancedEmergencyColors.professionalNeutral[800],
      accentForeground: enhancedEmergencyColors.professionalNeutral[50],
    },
    shadows: {
      small: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      medium: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
      large: '0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.5)',
      emergency: '0 0 0 3px rgb(248 113 113 / 0.6)', // Lighter red glow for dark mode
      success: '0 0 0 3px rgb(74 222 128 / 0.6)',   // Lighter green glow for dark mode
    }
  },

  'high-contrast': {
    colors: {
      // High contrast mode for accessibility
      primary: '#0000ff',      // Pure blue
      primaryHover: '#000080', // Dark blue
      primaryActive: '#000040', // Darker blue
      primaryForeground: '#ffffff',
      
      secondary: '#008000',    // Pure green
      secondaryHover: '#006000', // Dark green
      secondaryActive: '#004000', // Darker green
      secondaryForeground: '#ffffff',
      
      danger: '#ff0000',       // Pure red
      dangerHover: '#cc0000',  // Dark red
      dangerActive: '#990000', // Darker red
      dangerForeground: '#ffffff',
      
      warning: '#ff8000',      // Pure orange
      warningHover: '#cc6600', // Dark orange
      warningActive: '#994d00', // Darker orange
      warningForeground: '#000000',
      
      background: '#ffffff',
      cardBackground: '#ffffff',
      popoverBackground: '#ffffff',
      
      foreground: '#000000',
      muted: '#666666',
      mutedForeground: '#333333',
      
      border: '#000000',
      input: '#000000',
      ring: '#0000ff',
      
      accent: '#f0f0f0',
      accentForeground: '#000000',
    },
    shadows: {
      small: '0 1px 2px 0 rgb(0 0 0 / 0.8)',
      medium: '0 4px 6px -1px rgb(0 0 0 / 0.8), 0 2px 4px -2px rgb(0 0 0 / 0.8)',
      large: '0 10px 15px -3px rgb(0 0 0 / 0.8), 0 4px 6px -4px rgb(0 0 0 / 0.8)',
      emergency: '0 0 0 4px rgb(255 0 0 / 0.8)', // Bold red glow
      success: '0 0 0 4px rgb(0 128 0 / 0.8)',   // Bold green glow
    }
  },
} as const;

// Enhanced Semantic Color Mappings
export const semanticColors = {
  status: {
    safe: enhancedEmergencyColors.safeSecondary[500],
    warning: enhancedEmergencyColors.cautionWarning[500],
    danger: enhancedEmergencyColors.emergencyDanger[500],
    info: enhancedEmergencyColors.safePrimary[500],
    offline: enhancedEmergencyColors.professionalNeutral[400],
  },
  emergency: {
    critical: enhancedEmergencyColors.emergencyDanger[600],  // Highest priority
    high: enhancedEmergencyColors.emergencyDanger[500],     // High priority
    medium: enhancedEmergencyColors.cautionWarning[500],    // Medium priority
    low: enhancedEmergencyColors.cautionWarning[400],       // Low priority
    resolved: enhancedEmergencyColors.safeSecondary[500],   // Resolved
  },
  zones: {
    safe: enhancedEmergencyColors.safeSecondary[400],       // Safe zones
    restricted: enhancedEmergencyColors.cautionWarning[400], // Restricted access
    dangerous: enhancedEmergencyColors.emergencyDanger[400], // Dangerous areas
    monitoring: enhancedEmergencyColors.safePrimary[400],   // Under monitoring
  }
};

// Utility functions
export const getThemeColors = (mode: ThemeMode) => {
  return enhancedThemeConfig[mode]?.colors || enhancedThemeConfig.light.colors;
};

export const getThemeShadows = (mode: ThemeMode) => {
  return enhancedThemeConfig[mode]?.shadows || enhancedThemeConfig.light.shadows;
};

export const getSemanticColor = (category: keyof typeof semanticColors, type: string) => {
  return (semanticColors[category] as any)[type] || semanticColors.status.info;
};

// Export enhanced color palette
export { enhancedEmergencyColors as colorPalette };