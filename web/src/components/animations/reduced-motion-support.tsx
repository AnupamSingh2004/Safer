/**
 * Smart Tourist Safety System - Reduced Motion Support
 * Accessibility-first animation system with comprehensive reduced motion support
 */

'use client';

import React from 'react';
import { motion, useReducedMotion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// REDUCED MOTION WRAPPER
// ============================================================================

interface ReducedMotionWrapperProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  fallbackComponent?: 'div' | 'span' | 'section' | 'article';
  enabledAnimation?: any;
  disabledStyle?: React.CSSProperties;
}

export const ReducedMotionWrapper: React.FC<ReducedMotionWrapperProps> = ({
  children,
  className = '',
  fallbackComponent = 'div',
  enabledAnimation = {},
  disabledStyle = {},
  ...motionProps
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const FallbackComponent = fallbackComponent;
    return (
      <FallbackComponent className={className} style={disabledStyle}>
        {children}
      </FallbackComponent>
    );
  }

  return (
    <motion.div
      className={className}
      {...enabledAnimation}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// ACCESSIBILITY-FIRST ANIMATIONS
// ============================================================================

export const a11yFadeIn = (shouldReduceMotion: boolean) => ({
  initial: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: shouldReduceMotion ? 0 : 0.3 }
});

export const a11ySlideIn = (shouldReduceMotion: boolean, direction: 'left' | 'right' | 'up' | 'down' = 'up') => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 }
  };

  return {
    initial: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, ...directions[direction] },
    animate: { opacity: 1, y: 0, x: 0 },
    transition: { duration: shouldReduceMotion ? 0 : 0.3 }
  };
};

export const a11yScale = (shouldReduceMotion: boolean) => ({
  initial: shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: shouldReduceMotion ? 0 : 0.3 }
});

export const a11yHover = (shouldReduceMotion: boolean) => ({
  whileHover: shouldReduceMotion ? {} : {
    scale: 1.02,
    transition: { duration: 0.2 }
  }
});

export const a11yTap = (shouldReduceMotion: boolean) => ({
  whileTap: shouldReduceMotion ? {} : {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
});

// ============================================================================
// MOTION PREFERENCE PROVIDER
// ============================================================================

interface MotionPreferencesContextType {
  shouldReduceMotion: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  enableHoverEffects: boolean;
  enableFocusEffects: boolean;
  enableAutoplay: boolean;
}

const MotionPreferencesContext = React.createContext<MotionPreferencesContextType>({
  shouldReduceMotion: false,
  animationSpeed: 'normal',
  enableHoverEffects: true,
  enableFocusEffects: true,
  enableAutoplay: true
});

export const useMotionPreferences = () => {
  const context = React.useContext(MotionPreferencesContext);
  if (!context) {
    throw new Error('useMotionPreferences must be used within MotionPreferencesProvider');
  }
  return context;
};

interface MotionPreferencesProviderProps {
  children: React.ReactNode;
  overrides?: Partial<MotionPreferencesContextType>;
}

export const MotionPreferencesProvider: React.FC<MotionPreferencesProviderProps> = ({
  children,
  overrides = {}
}) => {
  const systemReducedMotion = useReducedMotion() ?? false;
  const [preferences, setPreferences] = React.useState<MotionPreferencesContextType>({
    shouldReduceMotion: systemReducedMotion,
    animationSpeed: 'normal',
    enableHoverEffects: true,
    enableFocusEffects: true,
    enableAutoplay: !systemReducedMotion,
    ...overrides
  });

  // Update when system preference changes
  React.useEffect(() => {
    const reducedMotion = systemReducedMotion ?? false;
    setPreferences(prev => ({
      ...prev,
      shouldReduceMotion: reducedMotion,
      enableAutoplay: !reducedMotion,
      ...overrides
    }));
  }, [systemReducedMotion, overrides]);

  return (
    <MotionPreferencesContext.Provider value={preferences}>
      {children}
    </MotionPreferencesContext.Provider>
  );
};

// ============================================================================
// ENHANCED ACCESSIBILITY COMPONENTS
// ============================================================================

interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  ...props
}) => {
  const { shouldReduceMotion, enableHoverEffects, enableFocusEffects } = useMotionPreferences();

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || loading}
      whileHover={shouldReduceMotion || !enableHoverEffects ? {} : {
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={shouldReduceMotion ? {} : {
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      whileFocus={shouldReduceMotion || !enableFocusEffects ? {} : {
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      {...a11yFadeIn(shouldReduceMotion)}
      {...props}
    >
      {loading ? (
        <motion.div
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={shouldReduceMotion ? {} : { duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      ) : null}
      {children}
    </motion.button>
  );
};

// ============================================================================
// ACCESSIBLE CARD COMPONENT
// ============================================================================

interface AccessibleCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  role?: string;
}

export const AccessibleCard: React.FC<AccessibleCardProps> = ({
  children,
  className = '',
  hoverable = false,
  clickable = false,
  onClick,
  ariaLabel,
  role,
  ...props
}) => {
  const { shouldReduceMotion, enableHoverEffects } = useMotionPreferences();

  return (
    <motion.div
      className={cn(
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm',
        hoverable && 'transition-shadow duration-200 hover:shadow-md',
        clickable && 'cursor-pointer',
        className
      )}
      onClick={clickable ? onClick : undefined}
      aria-label={ariaLabel}
      role={role || (clickable ? 'button' : 'region')}
      tabIndex={clickable ? 0 : undefined}
      whileHover={shouldReduceMotion || !enableHoverEffects || !hoverable ? {} : {
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={shouldReduceMotion || !clickable ? {} : {
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      {...a11yFadeIn(shouldReduceMotion)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// SKIP ANIMATION BANNER
// ============================================================================

export const SkipAnimationBanner: React.FC = () => {
  const { shouldReduceMotion } = useMotionPreferences();
  const [dismissed, setDismissed] = React.useState(false);

  if (shouldReduceMotion || dismissed) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 bg-blue-600 text-white px-4 py-2 text-sm z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <span>
          This site uses animations. You can disable them in your system settings or{' '}
          <button
            className="underline hover:no-underline"
            onClick={() => {
              // In a real app, this would update user preferences
              setDismissed(true);
            }}
          >
            click here to reduce motion
          </button>
        </span>
        <button
          className="ml-4 text-blue-200 hover:text-white"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss animation notice"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
};

// ============================================================================
// FOCUS MANAGEMENT
// ============================================================================

export const useFocusManagement = () => {
  const focusRingRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      if (!focusRingRef.current) return;
      
      const target = e.target as HTMLElement;
      if (target && target.matches(':focus-visible')) {
        const rect = target.getBoundingClientRect();
        focusRingRef.current.style.left = `${rect.left}px`;
        focusRingRef.current.style.top = `${rect.top}px`;
        focusRingRef.current.style.width = `${rect.width}px`;
        focusRingRef.current.style.height = `${rect.height}px`;
        focusRingRef.current.style.opacity = '1';
      }
    };

    const handleBlur = () => {
      if (focusRingRef.current) {
        focusRingRef.current.style.opacity = '0';
      }
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  return focusRingRef;
};

export const FocusRing: React.FC = () => {
  const focusRingRef = useFocusManagement();

  return (
    <div
      ref={focusRingRef}
      className="fixed pointer-events-none z-50 border-2 border-blue-500 rounded transition-all duration-200 opacity-0"
      style={{ transform: 'translate(-2px, -2px)' }}
    />
  );
};