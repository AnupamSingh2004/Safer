// web/src/lib/theme/theme-config.ts
export type ThemeMode = 'light' | 'dark';

export const colorPalette = {
  // Primary Brand Colors (Safety Blue-Green)
  primary: {
    50: '#ecfeff',   // Very light cyan
    100: '#cffafe',  // Light cyan
    200: '#a5f3fc',  // Light blue
    300: '#67e8f9',  // Cyan
    400: '#22d3ee',  // Bright cyan
    500: '#0891b2',  // Primary blue (main brand)
    600: '#0e7490',  // Dark cyan
    700: '#155e75',  // Darker cyan
    800: '#164e63',  // Very dark cyan
    900: '#083344',  // Darkest cyan
  },

  // Secondary Safety Colors
  secondary: {
    50: '#f0fdf4',   // Very light green
    100: '#dcfce7',  // Light green
    200: '#bbf7d0',  // Light green
    300: '#86efac',  // Green
    400: '#4ade80',  // Bright green
    500: '#22c55e',  // Main green (safety)
    600: '#16a34a',  // Dark green
    700: '#15803d',  // Darker green
    800: '#166534',  // Very dark green
    900: '#14532d',  // Darkest green
  },

  // Alert & Status Colors
  danger: {
    50: '#fef2f2',   // Very light red
    100: '#fee2e2',  // Light red
    200: '#fecaca',  // Light red
    300: '#fca5a5',  // Red
    400: '#f87171',  // Bright red
    500: '#ef4444',  // Main red (danger)
    600: '#dc2626',  // Dark red
    700: '#b91c1c',  // Darker red
    800: '#991b1b',  // Very dark red
    900: '#7f1d1d',  // Darkest red
  },

  warning: {
    50: '#fffbeb',   // Very light yellow
    100: '#fef3c7',  // Light yellow
    200: '#fde68a',  // Light yellow
    300: '#fcd34d',  // Yellow
    400: '#fbbf24',  // Bright yellow
    500: '#f59e0b',  // Main yellow (warning)
    600: '#d97706',  // Dark yellow
    700: '#b45309',  // Darker yellow
    800: '#92400e',  // Very dark yellow
    900: '#78350f',  // Darkest yellow
  },

  success: {
    50: '#f0fdf4',   // Very light green
    100: '#dcfce7',  // Light green
    200: '#bbf7d0',  // Light green
    300: '#86efac',  // Green
    400: '#4ade80',  // Bright green
    500: '#10b981',  // Main green (success)
    600: '#059669',  // Dark green
    700: '#047857',  // Darker green
    800: '#065f46',  // Very dark green
    900: '#064e3b',  // Darkest green
  },

  // Neutral Colors
  neutral: {
    50: '#f8fafc',   // Very light gray
    100: '#f1f5f9',  // Light gray
    200: '#e2e8f0',  // Light gray
    300: '#cbd5e1',  // Gray
    400: '#94a3b8',  // Medium gray
    500: '#64748b',  // Main gray
    600: '#475569',  // Dark gray
    700: '#334155',  // Darker gray
    800: '#1e293b',  // Very dark gray
    900: '#0f172a',  // Darkest gray
  },

  // Background Colors
  background: {
    light: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
    },
    dark: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
    }
  }
};

export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
  }
};

export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
  '5xl': '8rem',   // 128px
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};

export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  keyframes: {
    fadeIn: {
      '0%': { opacity: '0', transform: 'translateY(10px)' },
      '100%': { opacity: '1', transform: 'translateY(0)' },
    },
    slideIn: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(0)' },
    },
    bounce: {
      '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
      '50%': { transform: 'none', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
    },
    pulse: {
      '50%': { opacity: '.5' },
    },
  }
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Theme configuration object
export const themeConfig = {
  light: {
    colors: {
      primary: colorPalette.primary[500],
      primaryHover: colorPalette.primary[600],
      secondary: colorPalette.secondary[500],
      secondaryHover: colorPalette.secondary[600],
      background: colorPalette.background.light.primary,
      backgroundSecondary: colorPalette.background.light.secondary,
      backgroundTertiary: colorPalette.background.light.tertiary,
      foreground: colorPalette.neutral[900],
      foregroundSecondary: colorPalette.neutral[600],
      foregroundMuted: colorPalette.neutral[400],
      border: colorPalette.neutral[200],
      borderHover: colorPalette.neutral[300],
      danger: colorPalette.danger[500],
      dangerHover: colorPalette.danger[600],
      warning: colorPalette.warning[500],
      warningHover: colorPalette.warning[600],
      success: colorPalette.success[500],
      successHover: colorPalette.success[600],
    }
  },
  dark: {
    colors: {
      primary: colorPalette.primary[400],
      primaryHover: colorPalette.primary[300],
      secondary: colorPalette.secondary[400],
      secondaryHover: colorPalette.secondary[300],
      background: colorPalette.background.dark.primary,
      backgroundSecondary: colorPalette.background.dark.secondary,
      backgroundTertiary: colorPalette.background.dark.tertiary,
      foreground: colorPalette.neutral[50],
      foregroundSecondary: colorPalette.neutral[300],
      foregroundMuted: colorPalette.neutral[500],
      border: colorPalette.neutral[700],
      borderHover: colorPalette.neutral[600],
      danger: colorPalette.danger[400],
      dangerHover: colorPalette.danger[300],
      warning: colorPalette.warning[400],
      warningHover: colorPalette.warning[300],
      success: colorPalette.success[400],
      successHover: colorPalette.success[300],
    }
  }
};

// Utility functions
export const getThemeColors = (mode: ThemeMode) => themeConfig[mode].colors;

export const createCSSVariables = (mode: ThemeMode) => {
  const colors = getThemeColors(mode);
  return Object.entries(colors).reduce((acc, [key, value]) => ({
    ...acc,
    [`--color-${key}`]: value,
  }), {});
};

// Component size variants
export const sizeVariants = {
  button: {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-8 text-base',
    xl: 'h-12 px-10 text-lg',
  },
  input: {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-3 text-sm',
    lg: 'h-11 px-4 text-base',
    xl: 'h-12 px-4 text-lg',
  }
};

// Export default theme configuration
export default themeConfig;