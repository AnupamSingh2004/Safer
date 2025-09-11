/**
 * Smart Tourist Safety System - Theme Configuration
 * Comprehensive theme system with emergency service focused design
 */

export type ThemeMode = 'light' | 'dark';

// Emergency Service Color Palette - Professional blue-green-red scheme
export const emergencyColorPalette = {
  // Primary Safety Blue (Trust, Security, Professional)
  primary: {
    50: '#ecfeff',   // Very light cyan - background highlights
    100: '#cffafe',  // Light cyan - subtle backgrounds
    200: '#a5f3fc',  // Light blue - hover states
    300: '#67e8f9',  // Cyan - interactive elements
    400: '#22d3ee',  // Bright cyan - accent elements
    500: '#0891b2',  // Primary blue (main brand) - primary buttons
    600: '#0e7490',  // Dark cyan - primary hover states
    700: '#155e75',  // Darker cyan - pressed states
    800: '#164e63',  // Very dark cyan - text on light backgrounds
    900: '#083344',  // Darkest cyan - headings, important text
  },

  // Secondary Safety Green (Success, Safe Status, Go)
  secondary: {
    50: '#f0fdf4',   // Very light green - success backgrounds
    100: '#dcfce7',  // Light green - safe zone indicators
    200: '#bbf7d0',  // Light green - positive status
    300: '#86efac',  // Green - safe status icons
    400: '#4ade80',  // Bright green - success indicators
    500: '#22c55e',  // Main green (safety confirmed) - success buttons
    600: '#16a34a',  // Dark green - success hover states
    700: '#15803d',  // Darker green - confirmed safe status
    800: '#166534',  // Very dark green - safe zone text
    900: '#14532d',  // Darkest green - important safe status
  },

  // Emergency Alert Red (Danger, Critical, Emergency)
  danger: {
    50: '#fef2f2',   // Very light red - emergency backgrounds
    100: '#fee2e2',  // Light red - alert backgrounds
    200: '#fecaca',  // Light red - warning backgrounds
    300: '#fca5a5',  // Red - moderate alerts
    400: '#f87171',  // Bright red - alert indicators
    500: '#ef4444',  // Main red (emergency) - critical alerts
    600: '#dc2626',  // Dark red - emergency buttons
    700: '#b91c1c',  // Darker red - critical status
    800: '#991b1b',  // Very dark red - emergency text
    900: '#7f1d1d',  // Darkest red - critical emergency
  },

  // Warning Yellow-Orange (Caution, Moderate Risk)
  warning: {
    50: '#fffbeb',   // Very light yellow - caution backgrounds
    100: '#fef3c7',  // Light yellow - warning backgrounds
    200: '#fde68a',  // Light yellow - minor alerts
    300: '#fcd34d',  // Yellow - caution indicators
    400: '#fbbf24',  // Bright yellow - warning icons
    500: '#f59e0b',  // Main yellow (warning) - caution alerts
    600: '#d97706',  // Dark yellow - warning buttons
    700: '#b45309',  // Darker yellow - important warnings
    800: '#92400e',  // Very dark yellow - warning text
    900: '#78350f',  // Darkest yellow - critical warnings
  },

  // Information Blue (Informational, Neutral)
  info: {
    50: '#eff6ff',   // Very light blue - info backgrounds
    100: '#dbeafe',  // Light blue - info panels
    200: '#bfdbfe',  // Light blue - info borders
    300: '#93c5fd',  // Blue - info icons
    400: '#60a5fa',  // Bright blue - info buttons
    500: '#3b82f6',  // Main blue (information)
    600: '#2563eb',  // Dark blue - info hover
    700: '#1d4ed8',  // Darker blue - info pressed
    800: '#1e40af',  // Very dark blue - info text
    900: '#1e3a8a',  // Darkest blue - important info
  },

  // Neutral Grays (Text, Backgrounds, Borders)
  neutral: {
    50: '#f8fafc',   // Very light gray - page backgrounds
    100: '#f1f5f9',  // Light gray - card backgrounds
    200: '#e2e8f0',  // Light gray - borders, dividers
    300: '#cbd5e1',  // Gray - placeholder text
    400: '#94a3b8',  // Medium gray - secondary text
    500: '#64748b',  // Main gray - body text
    600: '#475569',  // Dark gray - headings
    700: '#334155',  // Darker gray - important text
    800: '#1e293b',  // Very dark gray - primary text
    900: '#0f172a',  // Darkest gray - critical text, dark backgrounds
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

// Typography Configuration
export const typographyConfig = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
    display: ['Inter', 'system-ui', 'sans-serif'], // For large headings
  },
  
  fontSize: {
    // Text sizes
    '2xs': ['0.625rem', { lineHeight: '1rem' }],     // 10px - Tiny labels
    xs: ['0.75rem', { lineHeight: '1rem' }],         // 12px - Small labels, captions
    sm: ['0.875rem', { lineHeight: '1.25rem' }],     // 14px - Secondary text, form labels
    base: ['1rem', { lineHeight: '1.5rem' }],        // 16px - Body text, default
    lg: ['1.125rem', { lineHeight: '1.75rem' }],     // 18px - Large body text
    xl: ['1.25rem', { lineHeight: '1.75rem' }],      // 20px - Section headers
    '2xl': ['1.5rem', { lineHeight: '2rem' }],       // 24px - Page titles
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px - Dashboard titles
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px - Hero text
    '5xl': ['3rem', { lineHeight: '1' }],           // 48px - Large displays
  },
  
  fontWeight: {
    light: '300',     // Light text
    normal: '400',    // Regular text
    medium: '500',    // Emphasis
    semibold: '600',  // Headings, important text
    bold: '700',      // Strong emphasis, titles
    extrabold: '800', // Extra emphasis
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
  },
} as const;

// Spacing and Layout Configuration
export const spacingConfig = {
  // Base spacing scale
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    32: '8rem',       // 128px
  },
  
  // Component specific spacing
  components: {
    button: {
      padding: {
        sm: '0.5rem 0.75rem',    // 8px 12px
        md: '0.625rem 1rem',     // 10px 16px
        lg: '0.75rem 1.5rem',    // 12px 24px
        xl: '1rem 2rem',         // 16px 32px
      },
      gap: '0.5rem', // 8px between icon and text
    },
    input: {
      padding: {
        sm: '0.5rem 0.75rem',    // 8px 12px
        md: '0.625rem 0.75rem',  // 10px 12px
        lg: '0.75rem 1rem',      // 12px 16px
      },
    },
    card: {
      padding: '1.5rem',         // 24px
      gap: '1rem',              // 16px between elements
    },
  },
} as const;

// Border Radius Configuration
export const borderRadiusConfig = {
  none: '0',
  sm: '0.125rem',     // 2px
  base: '0.25rem',    // 4px
  md: '0.375rem',     // 6px
  lg: '0.5rem',       // 8px
  xl: '0.75rem',      // 12px
  '2xl': '1rem',      // 16px
  '3xl': '1.5rem',    // 24px
  full: '9999px',     // Fully rounded
} as const;

// Shadow Configuration
export const shadowConfig = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  // Emergency specific shadows
  emergency: '0 0 0 3px rgba(239, 68, 68, 0.3)',
  success: '0 0 0 3px rgba(34, 197, 94, 0.3)',
  warning: '0 0 0 3px rgba(245, 158, 11, 0.3)',
} as const;

// Animation Configuration
export const animationConfig = {
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '750ms',
    slowest: '1000ms',
  },
  
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Emergency specific animations
  emergency: {
    pulse: 'pulse-emergency 2s infinite',
    slideAlert: 'slide-alert 0.3s ease-out',
    fadeIn: 'fade-in 0.5s ease-out',
    slideUp: 'slide-up 0.4s ease-out',
  },
} as const;

// Breakpoint Configuration
export const breakpointConfig = {
  xs: '475px',      // Extra small devices
  sm: '640px',      // Small devices
  md: '768px',      // Medium devices
  lg: '1024px',     // Large devices
  xl: '1280px',     // Extra large devices
  '2xl': '1536px',  // 2X extra large devices
} as const;

// Theme Mode Configurations
export const lightTheme = {
  colors: {
    // Primary colors
    primary: emergencyColorPalette.primary[500],
    primaryHover: emergencyColorPalette.primary[600],
    primaryActive: emergencyColorPalette.primary[700],
    primaryForeground: '#ffffff',
    
    // Secondary colors
    secondary: emergencyColorPalette.secondary[500],
    secondaryHover: emergencyColorPalette.secondary[600],
    secondaryActive: emergencyColorPalette.secondary[700],
    secondaryForeground: '#ffffff',
    
    // Background colors
    background: '#ffffff',
    backgroundSecondary: emergencyColorPalette.neutral[50],
    backgroundTertiary: emergencyColorPalette.neutral[100],
    
    // Foreground colors
    foreground: emergencyColorPalette.neutral[900],
    foregroundSecondary: emergencyColorPalette.neutral[600],
    foregroundMuted: emergencyColorPalette.neutral[400],
    
    // Border colors
    border: emergencyColorPalette.neutral[200],
    borderHover: emergencyColorPalette.neutral[300],
    
    // Status colors
    danger: emergencyColorPalette.danger[500],
    dangerHover: emergencyColorPalette.danger[600],
    warning: emergencyColorPalette.warning[500],
    warningHover: emergencyColorPalette.warning[600],
    success: emergencyColorPalette.secondary[500],
    successHover: emergencyColorPalette.secondary[600],
    info: emergencyColorPalette.info[500],
    infoHover: emergencyColorPalette.info[600],
  },
} as const;

export const darkTheme = {
  colors: {
    // Primary colors
    primary: emergencyColorPalette.primary[400],
    primaryHover: emergencyColorPalette.primary[300],
    primaryActive: emergencyColorPalette.primary[200],
    primaryForeground: emergencyColorPalette.neutral[900],
    
    // Secondary colors
    secondary: emergencyColorPalette.secondary[400],
    secondaryHover: emergencyColorPalette.secondary[300],
    secondaryActive: emergencyColorPalette.secondary[200],
    secondaryForeground: emergencyColorPalette.neutral[900],
    
    // Background colors
    background: emergencyColorPalette.neutral[900],
    backgroundSecondary: emergencyColorPalette.neutral[800],
    backgroundTertiary: emergencyColorPalette.neutral[700],
    
    // Foreground colors
    foreground: emergencyColorPalette.neutral[50],
    foregroundSecondary: emergencyColorPalette.neutral[300],
    foregroundMuted: emergencyColorPalette.neutral[500],
    
    // Border colors
    border: emergencyColorPalette.neutral[700],
    borderHover: emergencyColorPalette.neutral[600],
    
    // Status colors
    danger: emergencyColorPalette.danger[400],
    dangerHover: emergencyColorPalette.danger[300],
    warning: emergencyColorPalette.warning[400],
    warningHover: emergencyColorPalette.warning[300],
    success: emergencyColorPalette.secondary[400],
    successHover: emergencyColorPalette.secondary[300],
    info: emergencyColorPalette.info[400],
    infoHover: emergencyColorPalette.info[300],
  },
} as const;

// Main Theme Configuration Object
export const themeConfig = {
  light: lightTheme,
  dark: darkTheme,
  
  // Shared configuration
  typography: typographyConfig,
  spacing: spacingConfig,
  borderRadius: borderRadiusConfig,
  shadows: shadowConfig,
  animations: animationConfig,
  breakpoints: breakpointConfig,
  
  // Emergency specific
  alertColors: alertTypeColors,
  zoneColors: zoneRiskColors,
  palette: emergencyColorPalette,
} as const;

// Utility Functions
export const getThemeColors = (mode: ThemeMode) => themeConfig[mode].colors;

export const getAlertColor = (alertType: keyof typeof alertTypeColors) => 
  alertTypeColors[alertType];

export const getZoneColor = (riskLevel: keyof typeof zoneRiskColors) => 
  zoneRiskColors[riskLevel];

export const createCSSVariables = (mode: ThemeMode) => {
  const colors = getThemeColors(mode);
  return Object.entries(colors).reduce((acc, [key, value]) => ({
    ...acc,
    [`--color-${key}`]: value,
  }), {});
};

// Component Size Variants
export const componentSizes = {
  button: {
    xs: 'h-6 px-2 text-2xs font-medium',
    sm: 'h-8 px-3 text-xs font-medium',
    md: 'h-10 px-4 text-sm font-medium',
    lg: 'h-11 px-6 text-base font-medium',
    xl: 'h-12 px-8 text-lg font-medium',
  },
  
  input: {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-3 text-sm',
    lg: 'h-11 px-4 text-base',
    xl: 'h-12 px-4 text-lg',
  },
  
  avatar: {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
    '2xl': 'h-16 w-16',
  },
  
  icon: {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  },
} as const;

export default themeConfig;