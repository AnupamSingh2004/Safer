/**
 * Smart Tourist Safety System - Simple & Smooth Animation Variants
 * Gentle, professional transitions focused on simplicity and elegance
 */

import type { Variants, Transition } from "framer-motion";

// ============================================================================
// SIMPLE & SMOOTH TRANSITIONS
// ============================================================================

/**
 * Gentle transition settings for smooth, professional animations
 */
export const gentleTransition: Transition = {
  type: "tween",
  ease: [0.4, 0.0, 0.2, 1], // Material Design easing
  duration: 0.4,
};

/**
 * Quick fade for instant feedback
 */
export const quickFade: Transition = {
  type: "tween",
  ease: [0.4, 0.0, 0.2, 1],
  duration: 0.2,
};

/**
 * Slow smooth transition for emphasis
 */
export const smoothTransition: Transition = {
  type: "tween",
  ease: [0.4, 0.0, 0.2, 1],
  duration: 0.6,
};

// ============================================================================
// SIMPLE PAGE TRANSITIONS
// ============================================================================

/**
 * Simple fade in/out - most common transition
 */
export const simpleFadeVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: gentleTransition,
  },
  exit: {
    opacity: 0,
    transition: quickFade,
  },
};

/**
 * Gentle slide from right - for forward navigation
 */
export const gentleSlideVariants: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: gentleTransition,
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: quickFade,
  },
};

/**
 * Gentle slide from left - for back navigation
 */
export const gentleSlideLeftVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: gentleTransition,
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: quickFade,
  },
};

/**
 * Subtle scale for important pages (emergency)
 */
export const subtleScaleVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: gentleTransition,
  },
  exit: {
    opacity: 0,
    scale: 1.01,
    transition: quickFade,
  },
};

// ============================================================================
// PAGE TYPE SPECIFIC VARIANTS (SIMPLIFIED)
// ============================================================================

/**
 * Auth pages - simple fade
 */
export const authPageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      ...gentleTransition,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -5,
    transition: quickFade,
  },
};

/**
 * Dashboard pages - gentle fade in
 */
export const dashboardPageVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      ...gentleTransition,
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: quickFade,
  },
};

/**
 * Public pages - simple and clean
 */
export const publicPageVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: gentleTransition,
  },
  exit: {
    opacity: 0,
    transition: quickFade,
  },
};

/**
 * Emergency pages - subtle emphasis
 */
export const emergencyPageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.99,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      ...gentleTransition,
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.01,
    transition: quickFade,
  },
};

// ============================================================================
// SIDEBAR & LAYOUT TRANSITIONS
// ============================================================================

/**
 * Smooth sidebar slide from left
 */
export const sidebarSlideVariants: Variants = {
  hidden: {
    x: -280,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      ...smoothTransition,
      duration: 0.5,
    },
  },
  exit: {
    x: -280,
    opacity: 0,
    transition: {
      ...gentleTransition,
      duration: 0.3,
    },
  },
};

/**
 * Simple sidebar toggle (collapse/expand)
 */
export const sidebarToggleVariants: Variants = {
  expanded: {
    width: 280,
    transition: smoothTransition,
  },
  collapsed: {
    width: 64,
    transition: smoothTransition,
  },
};

/**
 * Main content area adjustment for sidebar
 */
export const mainContentVariants: Variants = {
  sidebarExpanded: {
    marginLeft: 280,
    transition: smoothTransition,
  },
  sidebarCollapsed: {
    marginLeft: 64,
    transition: smoothTransition,
  },
  noSidebar: {
    marginLeft: 0,
    transition: smoothTransition,
  },
};

// ============================================================================
// CHILD ELEMENT VARIANTS (SIMPLIFIED)
// ============================================================================

/**
 * Simple child fade in
 */
export const childFadeVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: gentleTransition,
  },
  exit: {
    opacity: 0,
    transition: quickFade,
  },
};

/**
 * List items with gentle stagger
 */
export const listItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 5,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: gentleTransition,
  },
  exit: {
    opacity: 0,
    y: -5,
    transition: quickFade,
  },
};

// ============================================================================
// CONTAINER VARIANTS
// ============================================================================

/**
 * Simple container with staggered children
 */
export const containerVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get simple page variants based on page type
 */
export function getPageVariants(pageType: 'auth' | 'dashboard' | 'public' | 'emergency' | 'default' = 'default'): Variants {
  switch (pageType) {
    case 'auth':
      return authPageVariants;
    case 'dashboard':
      return dashboardPageVariants;
    case 'public':
      return publicPageVariants;
    case 'emergency':
      return emergencyPageVariants;
    default:
      return simpleFadeVariants;
  }
}

/**
 * Get simple navigation variants
 */
export function getNavigationVariants(direction: 'forward' | 'backward' = 'forward'): Variants {
  return direction === 'forward' ? gentleSlideVariants : gentleSlideLeftVariants;
}

/**
 * Reduced motion variants (same as regular for simplicity)
 */
export function getReducedMotionVariants(): Variants {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ============================================================================
// SIMPLE ANIMATION PRESETS
// ============================================================================

export const simpleAnimationPresets = {
  // Basic transitions
  fade: simpleFadeVariants,
  slideGentle: gentleSlideVariants,
  slideLeft: gentleSlideLeftVariants,
  scaleSubtle: subtleScaleVariants,
  
  // Page types
  auth: authPageVariants,
  dashboard: dashboardPageVariants,
  public: publicPageVariants,
  emergency: emergencyPageVariants,
  
  // Layout elements
  sidebar: sidebarSlideVariants,
  sidebarToggle: sidebarToggleVariants,
  mainContent: mainContentVariants,
  
  // Child elements
  childFade: childFadeVariants,
  listItem: listItemVariants,
  container: containerVariants,
  
  // Fallback
  reducedMotion: getReducedMotionVariants(),
} as const;

export type SimpleAnimationPreset = keyof typeof simpleAnimationPresets;

// Legacy exports for compatibility
export const slideVariants = gentleSlideVariants;
export const slideLeftVariants = gentleSlideLeftVariants;
export const fadeVariants = simpleFadeVariants;
export const scaleVariants = subtleScaleVariants;
export const childVariants = childFadeVariants;
export const baseTransition = gentleTransition;
export const fastTransition = quickFade;
export const springTransition = smoothTransition;
export const animationPresets = simpleAnimationPresets;

// Grid variants for layout animations
export const gridVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    transition: gentleTransition 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      ...gentleTransition,
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: gentleTransition 
  }
};

/**
 * Default export for convenience
 */
export default simpleAnimationPresets;