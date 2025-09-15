/**
 * Smart Tourist Safety System - Animation Components Index
 * Centralized export for all animation components and utilities
 */

// Core animation components
export {
  useMotionConfig,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  slideUp,
  staggerContainer,
  emergencyPulse,
  shimmer,
  hoverLift,
  hoverGlow,
  hoverPress,
  swipeLeft,
  swipeRight,
  loadingDots,
  loadingDot,
  loadingSpinner,
  pageTransition,
  modalTransition,
  alertSlideIn,
  emergencyAlert,
  MotionBox,
  GestureBox,
  StaggerContainer
} from './advanced-animations';

export {
  SwipeableCard,
  PullToRefresh,
  LongPress,
  PinchToZoom,
  DragDrop
} from './gesture-components';

export {
  Ripple,
  FloatingActionButton,
  AnimatedProgress,
  MagneticButton,
  ScrollReveal,
  Typewriter
} from './micro-interactions';

export {
  ReducedMotionWrapper,
  a11yFadeIn,
  a11ySlideIn,
  a11yScale,
  a11yHover,
  a11yTap,
  useMotionPreferences,
  MotionPreferencesProvider,
  AccessibleButton,
  AccessibleCard,
  SkipAnimationBanner,
  useFocusManagement,
  FocusRing
} from './reduced-motion-support';

// Re-export framer-motion for convenience
export { motion, AnimatePresence, useReducedMotion, useAnimation, useInView } from 'framer-motion';

// Animation presets for common use cases
export const animationPresets = {
  // Page transitions
  pageEnter: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  },
  
  // Modal animations
  modalEnter: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  
  // Card hover effects
  cardHover: {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  },
  
  // Button interactions
  buttonPress: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.1 }
  },
  
  // List item animations
  listItemStagger: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  },
  
  // Emergency alert animations
  emergencyPulse: {
    animate: {
      scale: [1, 1.05, 1],
      backgroundColor: ['#ef4444', '#dc2626', '#ef4444']
    },
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Common animation durations
export const animationDurations = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8
};

// Common easing curves
export const easingCurves = {
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  backOut: [0.34, 1.56, 0.64, 1],
  anticipate: [0.0, 0.0, 0.2, 1]
};

// Stagger configurations
export const staggerConfigs = {
  fast: { staggerChildren: 0.05, delayChildren: 0.1 },
  normal: { staggerChildren: 0.1, delayChildren: 0.2 },
  slow: { staggerChildren: 0.2, delayChildren: 0.3 }
};