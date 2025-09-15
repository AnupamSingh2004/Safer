"use client";

import React, { ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface FadeInProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  threshold?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 20,
  once = true,
  className,
  threshold = 0.1
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once,
    margin: "0px 0px -100px 0px",
    amount: threshold
  });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
      default:
        return { y: distance };
    }
  };

  const variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition()
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smooth animation
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface FadeInStaggerProps {
  children: ReactNode[];
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
}

export const FadeInStagger: React.FC<FadeInStaggerProps> = ({
  children,
  staggerDelay = 0.1,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 20,
  once = true,
  className
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once,
    margin: "0px 0px -50px 0px"
  });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
      default:
        return { y: distance };
    }
  };

  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition()
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

interface FadeInScrollProps {
  children: ReactNode;
  offset?: number;
  duration?: number;
  className?: string;
}

export const FadeInScroll: React.FC<FadeInScrollProps> = ({
  children,
  offset = 100,
  duration = 0.8,
  className
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    margin: `0px 0px -${offset}px 0px` as any
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 50
      }}
      transition={{
        duration,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface FadeInTextProps {
  text: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
  className?: string;
  wordClassName?: string;
}

export const FadeInText: React.FC<FadeInTextProps> = ({
  text,
  delay = 0,
  duration = 0.6,
  staggerDelay = 0.03,
  className,
  wordClassName
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: staggerDelay
      }
    }
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          className={`inline-block ${wordClassName || ''}`}
          style={{ marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

interface FadeInImageProps {
  src: string;
  alt: string;
  delay?: number;
  duration?: number;
  className?: string;
  imageClassName?: string;
  blurAmount?: number;
}

export const FadeInImage: React.FC<FadeInImageProps> = ({
  src,
  alt,
  delay = 0,
  duration = 0.8,
  className,
  imageClassName,
  blurAmount = 10
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{
        opacity: isInView ? 1 : 0
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      <motion.img
        src={src}
        alt={alt}
        initial={{
          filter: `blur(${blurAmount}px)`,
          scale: 1.1
        }}
        animate={{
          filter: isInView ? 'blur(0px)' : `blur(${blurAmount}px)`,
          scale: isInView ? 1 : 1.1
        }}
        transition={{
          duration: duration * 1.2,
          delay,
          ease: "easeOut"
        }}
        className={imageClassName}
      />
    </motion.div>
  );
};

// Utility hook for creating custom fade-in animations
export const useFadeInAnimation = (
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  distance: number = 20,
  duration: number = 0.6,
  delay: number = 0
) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
      default:
        return { y: distance };
    }
  };

  const animation = {
    initial: {
      opacity: 0,
      ...getInitialPosition()
    },
    animate: {
      opacity: isInView ? 1 : 0,
      x: isInView ? 0 : getInitialPosition().x || 0,
      y: isInView ? 0 : getInitialPosition().y || 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return { ref, animation, isInView };
};

// Emergency-themed fade-in variants
export const EmergencyFadeIn: React.FC<FadeInProps & { 
  emergencyMode?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}> = ({
  children,
  emergencyMode = false,
  priority = 'medium',
  ...props
}) => {
  const emergencyDuration = emergencyMode ? 0.3 : props.duration || 0.6;
  const emergencyDistance = emergencyMode ? 10 : props.distance || 20;
  
  const priorityColors = {
    low: 'filter-none',
    medium: 'filter-none',
    high: emergencyMode ? 'drop-shadow-md drop-shadow-orange-500/50' : 'filter-none',
    critical: emergencyMode ? 'drop-shadow-lg drop-shadow-red-500/70' : 'filter-none'
  };

  return (
    <FadeIn
      {...props}
      duration={emergencyDuration}
      distance={emergencyDistance}
      className={`${props.className || ''} ${emergencyMode ? priorityColors[priority] : ''}`}
    >
      {children}
    </FadeIn>
  );
};

export default FadeIn;
