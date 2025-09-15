/**
 * Smart Tourist Safety System - Advanced Animations
 * Comprehensive animation utilities with reduced motion support
 */

'use client';

import React from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';

// ============================================================================
// MOTION PREFERENCES
// ============================================================================

export const useMotionConfig = () => {
  const shouldReduceMotion = useReducedMotion();
  
  return {
    shouldReduceMotion,
    duration: shouldReduceMotion ? 0 : 0.3,
    ease: 'easeOut',
  };
};

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

export const slideUp: Variants = {
  initial: { opacity: 0, y: '100%' },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: '100%' }
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const emergencyPulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const shimmer: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// ============================================================================
// HOVER VARIANTS
// ============================================================================

export const hoverLift: Variants = {
  rest: { scale: 1, y: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
  hover: { 
    scale: 1.02, 
    y: -2, 
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.2 }
  }
};

export const hoverGlow: Variants = {
  rest: { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)' },
  hover: { 
    boxShadow: '0 0 20px 2px rgba(59, 130, 246, 0.3)',
    transition: { duration: 0.3 }
  }
};

export const hoverPress: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

// ============================================================================
// GESTURE VARIANTS
// ============================================================================

export const swipeLeft: Variants = {
  enter: { x: 300, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 }
};

export const swipeRight: Variants = {
  enter: { x: -300, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: 300, opacity: 0 }
};

// ============================================================================
// LOADING VARIANTS
// ============================================================================

export const loadingDots: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.2,
      repeat: Infinity,
      repeatDelay: 0.5
    }
  }
};

export const loadingDot: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
};

export const loadingSpinner: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// ============================================================================
// PAGE TRANSITION VARIANTS
// ============================================================================

export const pageTransition: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

export const modalTransition: Variants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

// ============================================================================
// ALERT VARIANTS
// ============================================================================

export const alertSlideIn: Variants = {
  initial: { opacity: 0, x: 300, scale: 0.9 },
  animate: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0, 
    x: 300, 
    scale: 0.9,
    transition: {
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};

export const emergencyAlert: Variants = {
  animate: {
    backgroundColor: ['#ef4444', '#dc2626', '#ef4444'],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// ============================================================================
// ENHANCED MOTION COMPONENTS
// ============================================================================

export interface MotionBoxProps {
  children: React.ReactNode;
  variant?: keyof typeof motionVariants;
  delay?: number;
  duration?: number;
  className?: string;
  onClick?: () => void;
  whileHover?: any;
  whileTap?: any;
}

const motionVariants = {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  slideUp,
  hoverLift,
  hoverGlow,
  hoverPress
};

export const MotionBox: React.FC<MotionBoxProps> = ({
  children,
  variant = 'fadeInUp',
  delay = 0,
  duration,
  className = '',
  onClick,
  whileHover,
  whileTap,
  ...props
}) => {
  const { shouldReduceMotion, duration: motionDuration } = useMotionConfig();
  
  return (
    <motion.div
      variants={motionVariants[variant]}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={whileHover || (variant.includes('hover') ? 'hover' : undefined)}
      whileTap={whileTap || (variant.includes('hover') ? 'tap' : undefined)}
      transition={{
        duration: shouldReduceMotion ? 0 : (duration || motionDuration),
        delay: shouldReduceMotion ? 0 : delay,
        ease: 'easeOut'
      }}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// GESTURE MOTION COMPONENT
// ============================================================================

export interface GestureBoxProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
}

export const GestureBox: React.FC<GestureBoxProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className = ''
}) => {
  const { shouldReduceMotion } = useMotionConfig();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragEnd={(event, info) => {
        const { offset, velocity } = info;
        
        if (Math.abs(offset.x) > 100 || Math.abs(velocity.x) > 500) {
          if (offset.x > 0 && onSwipeRight) onSwipeRight();
          if (offset.x < 0 && onSwipeLeft) onSwipeLeft();
        }
        
        if (Math.abs(offset.y) > 100 || Math.abs(velocity.y) > 500) {
          if (offset.y > 0 && onSwipeDown) onSwipeDown();
          if (offset.y < 0 && onSwipeUp) onSwipeUp();
        }
      }}
      whileDrag={{ scale: 1.05, rotate: 2 }}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// STAGGER ANIMATION COMPONENT
// ============================================================================

export interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay = 0.1
}) => {
  const { shouldReduceMotion } = useMotionConfig();

  return (
    <motion.div
      className={className}
      variants={{
        animate: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
            delayChildren: shouldReduceMotion ? 0 : 0.1
          }
        }
      }}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
};