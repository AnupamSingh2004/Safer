// web/src/lib/theme/typography.ts

// Typography scale for the Smart Tourist Safety dashboard
export const fontSizes = {
  xs: '0.75rem',      // 12px - Small labels, captions
  sm: '0.875rem',     // 14px - Secondary text, form labels
  base: '1rem',       // 16px - Body text, default
  lg: '1.125rem',     // 18px - Large body text
  xl: '1.25rem',      // 20px - Section headers
  '2xl': '1.5rem',    // 24px - Page titles
  '3xl': '1.875rem',  // 30px - Dashboard titles
  '4xl': '2.25rem',   // 36px - Hero text
} as const;

export const fontWeights = {
  normal: 400,        // Regular text
  medium: 500,        // Emphasis
  semibold: 600,      // Headings
  bold: 700,          // Strong emphasis
} as const;

export const lineHeights = {
  tight: 1.25,        // Compact layouts
  normal: 1.5,        // Body text
  relaxed: 1.75,      // Readable paragraphs
} as const;

// Typography variants for consistent text styling
export const textVariants = {
  h1: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: '-0.025em',
  },
  h2: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.tight,
    letterSpacing: '-0.025em',
  },
  h3: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
  },
  h4: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
  },
  body: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  },
  bodySmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  },
  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    color: 'text-neutral-600',
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
  },
} as const;

// Utility function to get text classes
export const getTextClasses = (variant: keyof typeof textVariants) => {
  const config = textVariants[variant];
  const sizeMap: Record<string, string> = {
    [fontSizes.xs]: 'text-xs',
    [fontSizes.sm]: 'text-sm',
    [fontSizes.base]: 'text-base',
    [fontSizes.lg]: 'text-lg',
    [fontSizes.xl]: 'text-xl',
    [fontSizes['2xl']]: 'text-2xl',
    [fontSizes['3xl']]: 'text-3xl',
    [fontSizes['4xl']]: 'text-4xl',
  };
  
  const weightMap: Record<number, string> = {
    400: 'font-normal',
    500: 'font-medium',
    600: 'font-semibold',
    700: 'font-bold',
  };
  
  const lineHeightMap: Record<number, string> = {
    1.25: 'leading-tight',
    1.5: 'leading-normal',
    1.75: 'leading-relaxed',
  };
  
  return [
    sizeMap[config.fontSize] || 'text-base',
    weightMap[config.fontWeight] || 'font-normal',
    lineHeightMap[config.lineHeight] || 'leading-normal',
    ('letterSpacing' in config && config.letterSpacing) ? 'tracking-tight' : '',
  ].filter(Boolean).join(' ');
};