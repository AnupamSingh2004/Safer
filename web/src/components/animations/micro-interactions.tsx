/**
 * Smart Tourist Safety System - Micro Interactions
 * Subtle animations and feedback for enhanced user experience
 */

'use client';

import React from 'react';
import { motion, useReducedMotion, useAnimation, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// RIPPLE EFFECT COMPONENT
// ============================================================================

interface RippleProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  color?: string;
}

export const Ripple: React.FC<RippleProps> = ({
  children,
  className = '',
  disabled = false,
  color = 'rgba(255, 255, 255, 0.6)'
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);

  const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || shouldReduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { id, x, y }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onMouseDown={createRipple}
    >
      {children}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            backgroundColor: color
          }}
          initial={{ width: 20, height: 20, opacity: 0.8 }}
          animate={{ 
            width: 200, 
            height: 200, 
            opacity: 0,
            x: -90,
            y: -90
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// FLOATING ACTION BUTTON WITH MICRO INTERACTIONS
// ============================================================================

interface FloatingActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'emergency';
  size?: 'sm' | 'md' | 'lg';
  badge?: string | number;
  disabled?: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  badge,
  disabled = false
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl',
    emergency: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl animate-pulse hover:animate-none'
  };

  const sizes = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-14 h-14 text-base',
    lg: 'w-16 h-16 text-lg'
  };

  return (
    <motion.button
      className={cn(
        'fixed bottom-6 right-6 rounded-full flex items-center justify-center transition-all duration-300 z-50',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      whileHover={shouldReduceMotion ? {} : {
        scale: 1.1,
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={shouldReduceMotion ? {} : {
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      animate={{
        boxShadow: isHovered 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
    >
      <motion.div
        animate={{ 
          scale: isPressed ? 0.9 : 1,
          rotate: isHovered ? 10 : 0
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
      
      {/* Badge */}
      {badge && (
        <motion.div
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 500, damping: 30 }}
        >
          {badge}
        </motion.div>
      )}
      
      {/* Pulse effect for emergency */}
      {variant === 'emergency' && (
        <motion.div
          className="absolute inset-0 rounded-full bg-red-500"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </motion.button>
  );
};

// ============================================================================
// PROGRESS INDICATOR WITH SMOOTH ANIMATIONS
// ============================================================================

interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  color?: 'blue' | 'green' | 'red' | 'orange';
  variant?: 'line' | 'circle' | 'semicircle';
  size?: 'sm' | 'md' | 'lg';
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  max = 100,
  className = '',
  showLabel = true,
  color = 'blue',
  variant = 'line',
  size = 'md'
}) => {
  const shouldReduceMotion = useReducedMotion();
  const percentage = Math.min((value / max) * 100, 100);
  
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    orange: 'from-orange-500 to-orange-600'
  };

  const sizes = {
    sm: variant === 'line' ? 'h-2' : 'w-16 h-16',
    md: variant === 'line' ? 'h-3' : 'w-24 h-24',
    lg: variant === 'line' ? 'h-4' : 'w-32 h-32'
  };

  if (variant === 'line') {
    return (
      <div className={cn('w-full', className)}>
        <div className={cn('bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
          <motion.div
            className={cn('h-full bg-gradient-to-r rounded-full', colors[color])}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: shouldReduceMotion ? 0 : 1, ease: 'easeOut' }}
          />
        </div>
        {showLabel && (
          <motion.div
            className="mt-2 text-sm text-gray-600 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(percentage)}%
          </motion.div>
        )}
      </div>
    );
  }

  // Circle variant
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', sizes[size], className)}>
      <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-gray-200"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: shouldReduceMotion ? 0 : 1, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className={`text-${color}-500`} stopColor="currentColor" />
            <stop offset="100%" className={`text-${color}-600`} stopColor="currentColor" />
          </linearGradient>
        </defs>
      </svg>
      {showLabel && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-lg font-semibold"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 500, damping: 30 }}
        >
          {Math.round(percentage)}%
        </motion.div>
      )}
    </div>
  );
};

// ============================================================================
// MAGNETIC BUTTON COMPONENT
// ============================================================================

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  disabled?: boolean;
  onClick?: () => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 20,
  disabled = false,
  onClick
}) => {
  const shouldReduceMotion = useReducedMotion();
  const ref = React.useRef<HTMLButtonElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || shouldReduceMotion) return;

    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = Math.max(rect.width, rect.height) / 2;

    if (distance < maxDistance) {
      const factor = (maxDistance - distance) / maxDistance;
      setPosition({
        x: x * factor * (strength / 100),
        y: y * factor * (strength / 100)
      });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      className={cn('relative transition-all duration-300', className)}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// ============================================================================
// SCROLL REVEAL COMPONENT
// ============================================================================

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  threshold = 0.1
}) => {
  const shouldReduceMotion = useReducedMotion();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const controls = useAnimation();

  const directions = {
    up: { initial: { y: 50, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    down: { initial: { y: -50, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    left: { initial: { x: 50, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    right: { initial: { x: -50, opacity: 0 }, animate: { x: 0, opacity: 1 } }
  };

  React.useEffect(() => {
    if (isInView) {
      controls.start('animate');
    }
  }, [isInView, controls]);

  if (shouldReduceMotion) {
    return <div className={className} ref={ref}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="initial"
      animate={controls}
      variants={directions[direction]}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// TYPEWRITER EFFECT COMPONENT
// ============================================================================

interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  cursor?: boolean;
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  delay = 0,
  speed = 50,
  className = '',
  cursor = true,
  onComplete
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [displayText, setDisplayText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showCursor, setShowCursor] = React.useState(true);

  React.useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayText(text);
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      } else {
        onComplete?.();
      }
    }, currentIndex === 0 ? delay : speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, delay, speed, shouldReduceMotion, onComplete]);

  // Cursor blink effect
  React.useEffect(() => {
    if (!cursor) return;

    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, [cursor]);

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <motion.span
          className="inline-block w-0.5 h-5 bg-current ml-1"
          animate={{ opacity: showCursor ? 1 : 0 }}
          transition={{ duration: 0 }}
        />
      )}
    </span>
  );
};