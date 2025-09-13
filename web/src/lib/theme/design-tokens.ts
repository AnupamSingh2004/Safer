/**
 * Smart Tourist Safety System - Design Tokens
 * Comprehensive design system with semantic tokens and theme support
 */

// ============================================================================
// COLOR PALETTES
// ============================================================================

export const colorPalettes = {
  // Primary Colors - Emergency Blue Spectrum
  primary: {
    50: '#eff6ff',    // Very light blue
    100: '#dbeafe',   // Light blue
    200: '#bfdbfe',   // Lighter blue
    300: '#93c5fd',   // Light medium blue
    400: '#60a5fa',   // Medium blue
    500: '#3b82f6',   // Base blue (primary)
    600: '#2563eb',   // Darker blue
    700: '#1d4ed8',   // Dark blue
    800: '#1e40af',   // Very dark blue
    900: '#1e3a8a',   // Darkest blue
    950: '#172554',   // Ultra dark blue
  },

  // Secondary Colors - Safety Green Spectrum
  secondary: {
    50: '#ecfdf5',    // Very light green
    100: '#d1fae5',   // Light green
    200: '#a7f3d0',   // Lighter green
    300: '#6ee7b7',   // Light medium green
    400: '#34d399',   // Medium green
    500: '#10b981',   // Base green (secondary)
    600: '#059669',   // Darker green
    700: '#047857',   // Dark green
    800: '#065f46',   // Very dark green
    900: '#064e3b',   // Darkest green
    950: '#022c22',   // Ultra dark green
  },

  // Neutral Colors - Professional Gray Spectrum
  neutral: {
    50: '#f8fafc',    // Very light gray
    100: '#f1f5f9',   // Light gray
    200: '#e2e8f0',   // Lighter gray
    300: '#cbd5e1',   // Light medium gray
    400: '#94a3b8',   // Medium gray
    500: '#64748b',   // Base gray
    600: '#475569',   // Darker gray
    700: '#334155',   // Dark gray
    800: '#1e293b',   // Very dark gray
    900: '#0f172a',   // Darkest gray
    950: '#020617',   // Ultra dark gray
  },

  // Emergency Status Colors
  emergency: {
    critical: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',  // Base critical red
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
    high: {
      50: '#fef7ec',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',  // Base high orange
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    medium: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',  // Base medium yellow
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    low: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',  // Base low green
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    resolved: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',  // Base resolved gray
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
  },

  // Zone Risk Colors
  zones: {
    safe: {
      50: '#f0fdf4',
      500: '#22c55e',  // Safe green
      600: '#16a34a',
      700: '#15803d',
    },
    lowRisk: {
      50: '#ecfeff',
      500: '#06b6d4',  // Low risk cyan
      600: '#0891b2',
      700: '#0e7490',
    },
    moderate: {
      50: '#fffbeb',
      500: '#f59e0b',  // Moderate yellow
      600: '#d97706',
      700: '#b45309',
    },
    highRisk: {
      50: '#fef2f2',
      500: '#ef4444',  // High risk red
      600: '#dc2626',
      700: '#b91c1c',
    },
    restricted: {
      50: '#450a0a',
      500: '#7f1d1d',  // Restricted dark red
      600: '#991b1b',
      700: '#b91c1c',
    },
  },

  // Status Colors
  status: {
    online: '#22c55e',     // Green
    offline: '#64748b',    // Gray
    away: '#f59e0b',       // Yellow
    busy: '#ef4444',       // Red
    maintenance: '#8b5cf6', // Purple
  },
} as const;

// ============================================================================
// SEMANTIC COLOR TOKENS
// ============================================================================

export const semanticColors = {
  light: {
    // Base colors
    background: colorPalettes.neutral[50],
    foreground: colorPalettes.neutral[900],
    
    // Card colors
    card: '#ffffff',
    cardForeground: colorPalettes.neutral[900],
    
    // Border colors
    border: colorPalettes.neutral[200],
    input: colorPalettes.neutral[200],
    
    // Primary colors
    primary: colorPalettes.primary[600],
    primaryForeground: '#ffffff',
    
    // Secondary colors
    secondary: colorPalettes.neutral[100],
    secondaryForeground: colorPalettes.neutral[900],
    
    // Accent colors
    accent: colorPalettes.neutral[100],
    accentForeground: colorPalettes.neutral[900],
    
    // Destructive colors
    destructive: colorPalettes.emergency.critical[500],
    destructiveForeground: '#ffffff',
    
    // Muted colors
    muted: colorPalettes.neutral[100],
    mutedForeground: colorPalettes.neutral[500],
    
    // Popover colors
    popover: '#ffffff',
    popoverForeground: colorPalettes.neutral[900],
    
    // Ring color for focus states
    ring: colorPalettes.primary[600],
  },
  
  dark: {
    // Base colors
    background: colorPalettes.neutral[950],
    foreground: colorPalettes.neutral[50],
    
    // Card colors
    card: colorPalettes.neutral[900],
    cardForeground: colorPalettes.neutral[50],
    
    // Border colors
    border: colorPalettes.neutral[800],
    input: colorPalettes.neutral[800],
    
    // Primary colors
    primary: colorPalettes.primary[500],
    primaryForeground: colorPalettes.neutral[900],
    
    // Secondary colors
    secondary: colorPalettes.neutral[800],
    secondaryForeground: colorPalettes.neutral[50],
    
    // Accent colors
    accent: colorPalettes.neutral[800],
    accentForeground: colorPalettes.neutral[50],
    
    // Destructive colors
    destructive: colorPalettes.emergency.critical[400],
    destructiveForeground: colorPalettes.neutral[50],
    
    // Muted colors
    muted: colorPalettes.neutral[800],
    mutedForeground: colorPalettes.neutral[400],
    
    // Popover colors
    popover: colorPalettes.neutral[900],
    popoverForeground: colorPalettes.neutral[50],
    
    // Ring color for focus states
    ring: colorPalettes.primary[400],
  },
} as const;

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

export const typography = {
  // Font families
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
    display: ['Inter', 'system-ui', 'sans-serif'],
  },

  // Font sizes with line heights
  fontSize: {
    xs: { size: '0.75rem', lineHeight: '1rem' },      // 12px
    sm: { size: '0.875rem', lineHeight: '1.25rem' },  // 14px
    base: { size: '1rem', lineHeight: '1.5rem' },     // 16px
    lg: { size: '1.125rem', lineHeight: '1.75rem' },  // 18px
    xl: { size: '1.25rem', lineHeight: '1.75rem' },   // 20px
    '2xl': { size: '1.5rem', lineHeight: '2rem' },    // 24px
    '3xl': { size: '1.875rem', lineHeight: '2.25rem' }, // 30px
    '4xl': { size: '2.25rem', lineHeight: '2.5rem' }, // 36px
    '5xl': { size: '3rem', lineHeight: '1' },         // 48px
    '6xl': { size: '3.75rem', lineHeight: '1' },      // 60px
    '7xl': { size: '4.5rem', lineHeight: '1' },       // 72px
    '8xl': { size: '6rem', lineHeight: '1' },         // 96px
    '9xl': { size: '8rem', lineHeight: '1' },         // 128px
  },

  // Font weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ============================================================================
// SPACING SYSTEM
// ============================================================================

export const spacing = {
  0: '0px',
  px: '1px',
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
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  18: '4.5rem',     // 72px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  88: '22rem',      // 352px
  96: '24rem',      // 384px
  128: '32rem',     // 512px
} as const;

// ============================================================================
// SHADOW SYSTEM
// ============================================================================

export const shadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000',
  
  // Emergency shadows
  emergency: '0 0 0 3px rgb(239 68 68 / 0.3)',
  success: '0 0 0 3px rgb(34 197 94 / 0.3)',
  warning: '0 0 0 3px rgb(245 158 11 / 0.3)',
  info: '0 0 0 3px rgb(59 130 246 / 0.3)',
  
  // Glow effects
  glow: {
    sm: '0 0 10px rgb(59 130 246 / 0.3)',
    md: '0 0 20px rgb(59 130 246 / 0.4)',
    lg: '0 0 30px rgb(59 130 246 / 0.5)',
  },
} as const;

// ============================================================================
// BORDER RADIUS SYSTEM
// ============================================================================

export const borderRadius = {
  none: '0px',
  xs: '0.125rem',   // 2px
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ============================================================================
// ANIMATION SYSTEM
// ============================================================================

export const animations = {
  // Durations
  duration: {
    instant: '0ms',
    fastest: '100ms',
    faster: '150ms',
    fast: '200ms',
    normal: '300ms',
    slow: '400ms',
    slower: '500ms',
    slowest: '700ms',
  },

  // Easing curves
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Custom easing for smooth interactions
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    bouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Spring configurations
  spring: {
    gentle: { type: 'spring', stiffness: 300, damping: 30 },
    bouncy: { type: 'spring', stiffness: 400, damping: 17 },
    snappy: { type: 'spring', stiffness: 500, damping: 25 },
    stiff: { type: 'spring', stiffness: 1000, damping: 100 },
  },
} as const;

// ============================================================================
// BREAKPOINT SYSTEM
// ============================================================================

export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
} as const;

// ============================================================================
// Z-INDEX SYSTEM
// ============================================================================

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
  emergency: 9999,
} as const;

// ============================================================================
// COMPONENT TOKENS
// ============================================================================

export const components = {
  button: {
    height: {
      sm: spacing[8],     // 32px
      md: spacing[10],    // 40px
      lg: spacing[12],    // 48px
      xl: spacing[14],    // 56px
    },
    padding: {
      sm: `${spacing[2]} ${spacing[3]}`,      // 8px 12px
      md: `${spacing[2.5]} ${spacing[4]}`,    // 10px 16px
      lg: `${spacing[3]} ${spacing[6]}`,      // 12px 24px
      xl: `${spacing[4]} ${spacing[8]}`,      // 16px 32px
    },
    fontSize: {
      sm: typography.fontSize.sm.size,
      md: typography.fontSize.base.size,
      lg: typography.fontSize.lg.size,
      xl: typography.fontSize.xl.size,
    },
  },

  input: {
    height: {
      sm: spacing[8],     // 32px
      md: spacing[10],    // 40px
      lg: spacing[12],    // 48px
    },
    padding: {
      sm: `${spacing[2]} ${spacing[3]}`,
      md: `${spacing[2.5]} ${spacing[4]}`,
      lg: `${spacing[3]} ${spacing[4]}`,
    },
  },

  card: {
    padding: {
      sm: spacing[4],     // 16px
      md: spacing[6],     // 24px
      lg: spacing[8],     // 32px
    },
    borderRadius: borderRadius.lg,
    shadow: shadows.sm,
  },
} as const;

// ============================================================================
// ACCESSIBILITY TOKENS
// ============================================================================

export const accessibility = {
  focusRing: {
    width: '2px',
    style: 'solid',
    offset: '2px',
  },
  
  minimumTouchTarget: '44px',
  
  colorContrast: {
    normal: '4.5:1',
    large: '3:1',
    aa: '4.5:1',
    aaa: '7:1',
  },
  
  reducedMotion: {
    duration: '0.01ms',
    easing: 'linear',
  },
} as const;

// ============================================================================
// EXPORT ALL TOKENS
// ============================================================================

export const designTokens = {
  colors: colorPalettes,
  semantic: semanticColors,
  typography,
  spacing,
  shadows,
  borderRadius,
  animations,
  breakpoints,
  zIndex,
  components,
  accessibility,
} as const;

export default designTokens;