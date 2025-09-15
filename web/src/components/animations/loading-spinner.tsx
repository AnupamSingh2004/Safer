/**
 * Smart Tourist Safety System - Loading Spinner Component
 * Animated loading spinner for page transitions and async operations
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useUnifiedTheme } from '@/lib/theme/unified-theme-provider';

// ============================================================================
// LOADING SPINNER VARIANTS
// ============================================================================

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const dotsVariants = {
  animate: {
    transition: {
      staggerChildren: 0.2,
      repeat: Infinity,
    },
  },
};

const dotVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ============================================================================
// LOADING SPINNER COMPONENT
// ============================================================================

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'pulse' | 'dots' | 'emergency';
  color?: 'primary' | 'emergency' | 'warning' | 'info' | 'success';
  className?: string;
  message?: string;
}

export function LoadingSpinner({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  className = '',
  message,
}: LoadingSpinnerProps) {
  const { resolvedTheme, emergencyMode } = useUnifiedTheme();
  
  // Check if animations should be reduced (simple check for reduced motion)
  const [animationsEnabled, setAnimationsEnabled] = React.useState(true);
  
  React.useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setAnimationsEnabled(!prefersReducedMotion);
  }, []);

  const getSizeClasses = () => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    };
    return sizes[size];
  };

  const getColorClasses = () => {
    const colors = {
      primary: emergencyMode ? 'text-red-500' : 'text-blue-500',
      emergency: 'text-red-500',
      warning: 'text-yellow-500',
      info: 'text-blue-500',
      success: 'text-green-500',
    };
    return colors[color];
  };

  const getMessageSizeClasses = () => {
    const sizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    };
    return sizes[size];
  };

  // Static fallback for reduced motion
  if (!animationsEnabled) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className={`${getSizeClasses()} ${getColorClasses()} border-2 border-current border-t-transparent rounded-full`} />
        {message && (
          <p className={`mt-2 ${getMessageSizeClasses()} text-gray-600 text-center`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  // Render different variants
  const renderSpinner = () => {
    switch (variant) {
      case 'pulse':
        return (
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className={`${getSizeClasses()} ${getColorClasses()} rounded-full border-2 border-current`}
          />
        );

      case 'dots':
        return (
          <motion.div
            variants={dotsVariants}
            animate="animate"
            className="flex space-x-1"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                variants={dotVariants}
                className={`w-2 h-2 ${getColorClasses()} bg-current rounded-full`}
              />
            ))}
          </motion.div>
        );

      case 'emergency':
        return (
          <motion.div
            variants={spinnerVariants}
            animate="animate"
            className={`${getSizeClasses()} text-red-500 relative`}
          >
            <div className="absolute inset-0 border-2 border-red-200 rounded-full" />
            <div className="absolute inset-0 border-2 border-red-500 border-t-transparent rounded-full" />
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 border border-red-300 rounded-full"
            />
          </motion.div>
        );

      default:
        return (
          <motion.div
            variants={spinnerVariants}
            animate="animate"
            className={`${getSizeClasses()} ${getColorClasses()} border-2 border-current border-t-transparent rounded-full`}
          />
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {renderSpinner()}
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`mt-3 ${getMessageSizeClasses()} text-foreground/70 text-center font-medium`}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}

export default LoadingSpinner;
