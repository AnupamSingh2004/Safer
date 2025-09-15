/**
 * Smart Tourist Safety System - Enhanced Animation System
 * Professional smooth animations optimized for emergency services UI
 */

import { Variants } from 'framer-motion';

// ============================================================================
// ANIMATION DURATIONS - Optimized for emergency response UI
// ============================================================================
export const animationDurations = {
  instant: 0,           // Immediate changes (emergency states)
  micro: 100,           // Micro-interactions (button hover)
  fast: 150,            // Quick feedback (clicks, focus)
  normal: 250,          // Standard transitions (page elements)
  smooth: 350,          // Smooth interactions (modal open/close)
  slow: 500,            // Complex animations (page transitions)
  emergency: 600,       // Emergency alert animations
} as const;

// ============================================================================
// EASING CURVES - Professional motion design
// ============================================================================
export const easingCurves = {
  // Standard easing
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
  
  // Custom professional easing
  smooth: [0.4, 0, 0.2, 1],          // Smooth natural motion
  snappy: [0.4, 0, 0.6, 1],          // Quick responsive feel
  gentle: [0.25, 0.46, 0.45, 0.94],  // Gentle organic motion
  energetic: [0.68, -0.55, 0.265, 1.55], // Bouncy energetic feel
  
  // Emergency-specific easing
  urgent: [0.87, 0, 0.13, 1],        // Fast urgent motion
  alert: [0.25, 0.46, 0.45, 0.94],   // Attention-grabbing but smooth
  critical: [0.68, -0.55, 0.265, 1.55], // Emergency bounce
} as const;

// ============================================================================
// FRAMER MOTION VARIANTS - Reusable animation patterns
// ============================================================================

// Fade animations
export const fadeVariants: Variants = {
  hidden: { 
    opacity: 0,
    transition: { duration: animationDurations.fast / 1000, ease: easingCurves.easeOut }
  },
  visible: { 
    opacity: 1,
    transition: { duration: animationDurations.normal / 1000, ease: easingCurves.easeOut }
  },
  exit: { 
    opacity: 0,
    transition: { duration: animationDurations.fast / 1000, ease: easingCurves.easeIn }
  }
};

// Slide animations (for drawers, sidebars, modals)
export const slideVariants: Variants = {
  hidden: { 
    x: -300, 
    opacity: 0,
    transition: { duration: animationDurations.smooth / 1000, ease: easingCurves.smooth }
  },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: animationDurations.smooth / 1000, ease: easingCurves.smooth }
  },
  exit: { 
    x: -300, 
    opacity: 0,
    transition: { duration: animationDurations.normal / 1000, ease: easingCurves.easeIn }
  }
};

// Scale animations (for buttons, cards, interactive elements)
export const scaleVariants: Variants = {
  hidden: { 
    scale: 0.8, 
    opacity: 0,
    transition: { duration: animationDurations.fast / 1000, ease: easingCurves.easeOut }
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: animationDurations.normal / 1000, ease: easingCurves.smooth }
  },
  exit: { 
    scale: 0.8, 
    opacity: 0,
    transition: { duration: animationDurations.fast / 1000, ease: easingCurves.easeIn }
  },
  hover: { 
    scale: 1.02,
    transition: { duration: animationDurations.micro / 1000, ease: easingCurves.snappy }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: animationDurations.micro / 1000, ease: easingCurves.snappy }
  }
};

// Emergency alert animations
export const emergencyVariants: Variants = {
  hidden: { 
    scale: 0.5, 
    opacity: 0, 
    y: -50,
    transition: { duration: animationDurations.fast / 1000, ease: easingCurves.easeOut }
  },
  visible: { 
    scale: 1, 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: animationDurations.emergency / 1000, 
      ease: easingCurves.critical,
      type: "spring",
      bounce: 0.4
    }
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: { 
      duration: 1.5, 
      ease: easingCurves.gentle,
      repeat: Infinity,
      repeatType: "loop"
    }
  },
  exit: { 
    scale: 0.5, 
    opacity: 0, 
    y: -50,
    transition: { duration: animationDurations.normal / 1000, ease: easingCurves.easeIn }
  }
};

// Stagger container animations (for lists, grids)
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
      duration: animationDurations.normal / 1000,
      ease: easingCurves.smooth
    }
  }
};

// Stagger item animations
export const staggerItemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: animationDurations.normal / 1000,
      ease: easingCurves.smooth
    }
  }
};

// Page transition animations
export const pageVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 20,
    transition: { duration: animationDurations.normal / 1000, ease: easingCurves.easeOut }
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: animationDurations.smooth / 1000, ease: easingCurves.smooth }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: animationDurations.fast / 1000, ease: easingCurves.easeIn }
  }
};

// Modal animations
export const modalVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9, 
    y: 50,
    transition: { duration: animationDurations.normal / 1000, ease: easingCurves.easeOut }
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: animationDurations.smooth / 1000, 
      ease: easingCurves.smooth,
      type: "spring",
      bounce: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 50,
    transition: { duration: animationDurations.normal / 1000, ease: easingCurves.easeIn }
  }
};

// Backdrop animations
export const backdropVariants: Variants = {
  hidden: { 
    opacity: 0,
    transition: { duration: animationDurations.fast / 1000, ease: easingCurves.easeOut }
  },
  visible: { 
    opacity: 1,
    transition: { duration: animationDurations.normal / 1000, ease: easingCurves.easeOut }
  },
  exit: { 
    opacity: 0,
    transition: { duration: animationDurations.fast / 1000, ease: easingCurves.easeIn }
  }
};

// ============================================================================
// MICRO-INTERACTION ANIMATIONS
// ============================================================================

// Button hover and tap animations
export const buttonAnimations = {
  whileHover: { 
    scale: 1.02,
    transition: { duration: animationDurations.micro / 1000, ease: easingCurves.snappy }
  },
  whileTap: { 
    scale: 0.98,
    transition: { duration: animationDurations.micro / 1000, ease: easingCurves.snappy }
  }
};

// Card hover animations
export const cardAnimations = {
  whileHover: { 
    y: -4,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: { duration: animationDurations.normal / 1000, ease: easingCurves.smooth }
  }
};

// Icon animations
export const iconAnimations = {
  whileHover: { 
    rotate: 5,
    scale: 1.1,
    transition: { duration: animationDurations.micro / 1000, ease: easingCurves.energetic }
  },
  whileTap: { 
    rotate: -5,
    scale: 0.9,
    transition: { duration: animationDurations.micro / 1000, ease: easingCurves.snappy }
  }
};

// ============================================================================
// LOADING ANIMATIONS
// ============================================================================

// Spinner animation
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// Pulse animation for loading states
export const pulseVariants: Variants = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 2,
      ease: easingCurves.gentle,
      repeat: Infinity
    }
  }
};

// Skeleton loading animation
export const skeletonVariants: Variants = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      ease: "linear",
      repeat: Infinity
    }
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Create stagger animation
export const createStaggerAnimation = (staggerDelay = 0.1, initialDelay = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: initialDelay,
    }
  }
});

// Create spring animation
export const createSpringAnimation = (stiffness = 100, damping = 10) => ({
  type: "spring",
  stiffness,
  damping,
});

// Create slide animation from direction
export const createSlideAnimation = (direction: 'left' | 'right' | 'up' | 'down', distance = 50) => {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
  const value = direction === 'left' || direction === 'up' ? -distance : distance;
  
  return {
    hidden: { [axis]: value, opacity: 0 },
    visible: { [axis]: 0, opacity: 1 },
    exit: { [axis]: value, opacity: 0 }
  };
};

// Animation presets for common use cases
export const animationPresets = {
  // Quick feedback animations
  quickButton: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: animationDurations.micro / 1000 }
  },
  
  // Smooth card animations
  smoothCard: {
    whileHover: { 
      y: -8, 
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" 
    },
    transition: { duration: animationDurations.normal / 1000, ease: easingCurves.smooth }
  },
  
  // Emergency alert animation
  emergencyAlert: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        bounce: 0.4, 
        duration: animationDurations.emergency / 1000 
      }
    }
  }
};

export default {
  durations: animationDurations,
  easing: easingCurves,
  variants: {
    fade: fadeVariants,
    slide: slideVariants,
    scale: scaleVariants,
    emergency: emergencyVariants,
    staggerContainer: staggerContainerVariants,
    staggerItem: staggerItemVariants,
    page: pageVariants,
    modal: modalVariants,
    backdrop: backdropVariants,
    spinner: spinnerVariants,
    pulse: pulseVariants,
    skeleton: skeletonVariants,
  },
  interactions: {
    button: buttonAnimations,
    card: cardAnimations,
    icon: iconAnimations,
  },
  presets: animationPresets,
  utils: {
    createStagger: createStaggerAnimation,
    createSpring: createSpringAnimation,
    createSlide: createSlideAnimation,
  }
};