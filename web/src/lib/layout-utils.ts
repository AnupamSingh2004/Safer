/**
 * Layout Utilities for Smart Tourist Safety Dashboard
 * Modern design system with 8pt grid spacing and responsive layout constants
 */

// Base spacing unit (8px grid system)
export const SPACING_UNIT = 8;

// Spacing scale based on 8pt grid
export const spacing = {
  xs: SPACING_UNIT * 0.5,    // 4px
  sm: SPACING_UNIT,          // 8px
  md: SPACING_UNIT * 2,      // 16px
  lg: SPACING_UNIT * 3,      // 24px
  xl: SPACING_UNIT * 4,      // 32px
  '2xl': SPACING_UNIT * 6,   // 48px
  '3xl': SPACING_UNIT * 8,   // 64px
  '4xl': SPACING_UNIT * 12,  // 96px
  '5xl': SPACING_UNIT * 16,  // 128px
  '6xl': SPACING_UNIT * 20,  // 160px
} as const;

// Dashboard-specific layout constants
export const dashboardLayout = {
  sidebar: {
    width: 320,              // 20rem
    collapsedWidth: 64,      // 4rem
    mobileBreakpoint: 768,   // When to hide sidebar on mobile
  },
  header: {
    height: 64,              // 4rem
    mobileHeight: 56,        // 3.5rem
  },
  content: {
    padding: spacing.lg,     // 24px
    maxWidth: 1600,          // Maximum content width
    minHeight: 'calc(100vh - 64px)', // Full height minus header
  },
  cards: {
    spacing: spacing.md,     // 16px between cards
    padding: spacing.lg,     // 24px inside cards
    borderRadius: 12,        // 0.75rem
    minWidth: 280,           // Minimum card width
    maxWidth: 400,           // Maximum card width for grid
  },
  sections: {
    spacing: spacing['2xl'], // 48px between major sections
    headerSpacing: spacing.xl, // 32px after section headers
  },
} as const;

// Container spacing for different screen sizes
export const containerSpacing = {
  mobile: spacing.md,        // 16px
  tablet: spacing.lg,        // 24px
  desktop: spacing.xl,       // 32px
  wide: spacing['2xl'],      // 48px
} as const;

// Responsive breakpoints (matching Tailwind defaults)
export const breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
} as const;

// Component spacing patterns
export const componentSpacing = {
  // Form elements
  form: {
    fieldGap: spacing.md,      // 16px between form fields
    sectionGap: spacing.lg,    // 24px between form sections
    labelGap: spacing.sm,      // 8px between label and input
    helpTextGap: spacing.xs,   // 4px between input and help text
  },
  
  // Button groups
  buttons: {
    gap: spacing.sm,           // 8px between buttons
    stackGap: spacing.xs,      // 4px in stacked button groups
  },
  
  // Navigation
  nav: {
    itemGap: spacing.sm,       // 8px between nav items
    sectionGap: spacing.lg,    // 24px between nav sections
    indent: spacing.md,        // 16px for nested items
  },
  
  // Lists and content
  list: {
    itemGap: spacing.xs,       // 4px between list items
    sectionGap: spacing.md,    // 16px between list sections
  },
  
  // Notifications and alerts
  alerts: {
    stackGap: spacing.sm,      // 8px between stacked alerts
    contentGap: spacing.xs,    // 4px between alert content elements
  },
} as const;

// Grid system configurations
export const gridLayouts = {
  dashboard: {
    columns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: dashboardLayout.cards.spacing,
  },
  cards: {
    columns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: spacing.md,
  },
  stats: {
    columns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: spacing.md,
  },
  emergency: {
    columns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: spacing.sm,
  },
} as const;

// Z-index scale for layering
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

// Utility functions for responsive design
export const utils = {
  /**
   * Get responsive padding based on screen size
   */
  getResponsivePadding: (size: 'mobile' | 'tablet' | 'desktop' | 'wide' = 'mobile') => {
    return containerSpacing[size];
  },
  
  /**
   * Get spacing value from spacing scale
   */
  getSpacing: (size: keyof typeof spacing) => {
    return spacing[size];
  },
  
  /**
   * Get grid configuration for specific layout
   */
  getGridConfig: (layout: keyof typeof gridLayouts) => {
    return gridLayouts[layout];
  },
  
  /**
   * Calculate spacing with multiplier
   */
  spacingMultiple: (multiplier: number) => {
    return SPACING_UNIT * multiplier;
  },
  
  /**
   * Get dashboard-specific layout value
   */
  getDashboardValue: (category: keyof typeof dashboardLayout, property?: string) => {
    const categoryValue = dashboardLayout[category];
    if (property && typeof categoryValue === 'object') {
      return categoryValue[property as keyof typeof categoryValue];
    }
    return categoryValue;
  },
} as const;

// CSS custom property generators
export const cssVariables = {
  spacing: Object.entries(spacing).reduce((acc, [key, value]) => {
    acc[`--spacing-${key}`] = `${value}px`;
    return acc;
  }, {} as Record<string, string>),
  
  dashboard: {
    '--dashboard-sidebar-width': `${dashboardLayout.sidebar.width}px`,
    '--dashboard-header-height': `${dashboardLayout.header.height}px`,
    '--dashboard-content-padding': `${dashboardLayout.content.padding}px`,
    '--dashboard-card-spacing': `${dashboardLayout.cards.spacing}px`,
    '--dashboard-section-spacing': `${dashboardLayout.sections.spacing}px`,
  },
  
  container: Object.entries(containerSpacing).reduce((acc, [key, value]) => {
    acc[`--container-padding-${key}`] = `${value}px`;
    return acc;
  }, {} as Record<string, string>),
} as const;

// Animation and transition utilities
export const animations = {
  durations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '750ms',
  },
  
  easings: {
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    bouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
  
  transitions: {
    default: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

export default {
  spacing,
  dashboardLayout,
  containerSpacing,
  breakpoints,
  componentSpacing,
  gridLayouts,
  zIndex,
  utils,
  cssVariables,
  animations,
};