/**
 * Smart Tourist Safety System - Page Transition Component
 * Smooth page transitions with Framer Motion for enhanced UX
 */

'use client';

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEnhancedTheme } from '@/components/providers/enhanced-theme-provider';
import { LoadingSpinner } from '@/components/animations/loading-spinner';

// ============================================================================
// TRANSITION VARIANTS
// ============================================================================

const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: 20,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    y: -20,
    filter: 'blur(4px)',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.6, 1],
    },
  },
};

const slideTransitionVariants: Variants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.6, 1],
    },
  }),
};

const emergencyTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    rotateX: -10,
  },
  animate: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.5,
      ease: [0.68, -0.55, 0.265, 1.55],
      type: "spring",
      bounce: 0.4,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.1,
    rotateX: 10,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.6, 1],
    },
  },
};

const mobileTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 1.05,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 0.6, 1],
    },
  },
};

// ============================================================================
// PAGE TRANSITION COMPONENT
// ============================================================================

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'slide' | 'emergency' | 'mobile';
  direction?: number;
  loading?: boolean;
  preserveAspectRatio?: boolean;
}

export function PageTransition({
  children,
  className = '',
  variant = 'default',
  direction = 1,
  loading = false,
  preserveAspectRatio = false,
}: PageTransitionProps) {
  const pathname = usePathname();
  const { animationsEnabled, emergencyMode } = useEnhancedTheme();

  // Select appropriate transition variant
  const getVariants = () => {
    if (!animationsEnabled) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 }
      };
    }

    if (emergencyMode) return emergencyTransitionVariants;
    
    switch (variant) {
      case 'slide':
        return slideTransitionVariants;
      case 'emergency':
        return emergencyTransitionVariants;
      case 'mobile':
        return mobileTransitionVariants;
      default:
        return pageTransitionVariants;
    }
  };

  // Loading state
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`flex items-center justify-center min-h-screen ${className}`}
      >
        <LoadingSpinner size="lg" />
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        custom={direction}
        variants={getVariants()}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`${className} ${preserveAspectRatio ? 'min-h-screen' : ''}`}
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================================
// ROUTE TRANSITION WRAPPER
// ============================================================================

interface RouteTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function RouteTransition({ children, className }: RouteTransitionProps) {
  const pathname = usePathname();
  const { emergencyMode } = useEnhancedTheme();

  // Determine transition type based on route
  const getTransitionVariant = (path: string) => {
    if (emergencyMode) return 'emergency';
    if (path.includes('/mobile') || path.includes('/app')) return 'mobile';
    if (path.includes('/dashboard')) return 'slide';
    return 'default';
  };

  return (
    <PageTransition
      variant={getTransitionVariant(pathname)}
      className={className}
      preserveAspectRatio
    >
      {children}
    </PageTransition>
  );
}

// ============================================================================
// STAGGER ANIMATION CONTAINER
// ============================================================================

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  initialDelay = 0,
}: StaggerContainerProps) {
  const { animationsEnabled } = useEnhancedTheme();

  const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: animationsEnabled ? staggerDelay : 0,
        delayChildren: animationsEnabled ? initialDelay : 0,
      },
    },
  };

  const itemVariants: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  if (!animationsEnabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ============================================================================
// MODAL TRANSITION
// ============================================================================

interface ModalTransitionProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function ModalTransition({
  children,
  isOpen,
  onClose,
  className = '',
}: ModalTransitionProps) {
  const { animationsEnabled } = useEnhancedTheme();

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 60,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.5,
        bounce: 0.3,
      },
    },
  };

  if (!animationsEnabled) {
    return isOpen ? (
      <div className="fixed inset-0 z-modal bg-black/50 flex items-center justify-center p-4">
        <div className={className}>{children}</div>
      </div>
    ) : null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-modal bg-black/50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={className}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// DRAWER TRANSITION (MOBILE)
// ============================================================================

interface DrawerTransitionProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
}

export function DrawerTransition({
  children,
  isOpen,
  onClose,
  direction = 'left',
  className = '',
}: DrawerTransitionProps) {
  const { animationsEnabled } = useEnhancedTheme();

  const getDrawerVariants = (dir: string): Variants => {
    const directions = {
      left: { x: '-100%' },
      right: { x: '100%' },
      top: { y: '-100%' },
      bottom: { y: '100%' },
    };

    return {
      hidden: directions[dir as keyof typeof directions],
      visible: { x: 0, y: 0 },
    };
  };

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  if (!animationsEnabled) {
    return isOpen ? (
      <div className="fixed inset-0 z-modal">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className={className}>{children}</div>
      </div>
    ) : null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-modal">
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            variants={getDrawerVariants(direction)}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            className={className}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// EMERGENCY ALERT TRANSITION
// ============================================================================

interface EmergencyAlertTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
}

export function EmergencyAlertTransition({
  children,
  isVisible,
  severity = 'medium',
  className = '',
}: EmergencyAlertTransitionProps) {
  const { animationsEnabled } = useEnhancedTheme();

  const alertVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -50,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        duration: 0.6,
        bounce: 0.4,
      },
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const getSeverityAnimation = (sev: string) => {
    const animations = {
      low: 'visible',
      medium: 'visible',
      high: 'pulse',
      critical: 'pulse',
    };
    return animations[sev as keyof typeof animations] || 'visible';
  };

  if (!animationsEnabled) {
    return isVisible ? <div className={className}>{children}</div> : null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={alertVariants}
          initial="hidden"
          animate={getSeverityAnimation(severity)}
          exit="hidden"
          className={className}
          style={{ transformOrigin: 'center top' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PageTransition;