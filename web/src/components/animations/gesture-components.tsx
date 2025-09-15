/**
 * Smart Tourist Safety System - Gesture Components
 * Enhanced touch and gesture interactions for mobile-first design
 */

'use client';

import React from 'react';
import { motion, useReducedMotion, PanInfo, useDragControls } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// SWIPEABLE CARD COMPONENT
// ============================================================================

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
  disabled?: boolean;
  threshold?: number;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className = '',
  disabled = false,
  threshold = 100
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isDragging, setIsDragging] = React.useState(false);

  if (shouldReduceMotion || disabled) {
    return <div className={className}>{children}</div>;
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    const { offset, velocity } = info;
    setIsDragging(false);

    // Horizontal swipes
    if (Math.abs(offset.x) > threshold || Math.abs(velocity.x) > 500) {
      if (offset.x > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (offset.x < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    // Vertical swipes
    if (Math.abs(offset.y) > threshold || Math.abs(velocity.y) > 500) {
      if (offset.y > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (offset.y < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }
  };

  return (
    <motion.div
      className={cn(
        'touch-pan-x cursor-grab active:cursor-grabbing',
        isDragging && 'z-10',
        className
      )}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      whileDrag={{
        scale: 1.05,
        rotate: 2,
        zIndex: 10,
        transition: { duration: 0.2 }
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
      
      {/* Drag indicator */}
      {isDragging && (
        <motion.div
          className="absolute inset-0 bg-blue-500/10 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
};

// ============================================================================
// PULL TO REFRESH COMPONENT
// ============================================================================

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void> | void;
  refreshThreshold?: number;
  className?: string;
  disabled?: boolean;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  refreshThreshold = 80,
  className = '',
  disabled = false
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [pullDistance, setPullDistance] = React.useState(0);

  if (shouldReduceMotion || disabled) {
    return <div className={className}>{children}</div>;
  }

  const handleDrag = (event: any, info: PanInfo) => {
    const { offset } = info;
    if (offset.y > 0) {
      setPullDistance(Math.min(offset.y, refreshThreshold * 1.5));
    }
  };

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const { offset } = info;
    
    if (offset.y > refreshThreshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(0);
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    } else {
      setPullDistance(0);
    }
  };

  const refreshProgress = Math.min(pullDistance / refreshThreshold, 1);

  return (
    <motion.div
      className={cn('relative overflow-hidden', className)}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      {/* Pull to refresh indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-blue-50"
        style={{
          y: -60 + (pullDistance * 0.5),
          opacity: refreshProgress
        }}
      >
        <motion.div
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
          animate={isRefreshing ? { rotate: 360 } : { rotate: refreshProgress * 360 }}
          transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
        />
        <span className="ml-2 text-blue-600 font-medium">
          {isRefreshing ? 'Refreshing...' : pullDistance > refreshThreshold ? 'Release to refresh' : 'Pull to refresh'}
        </span>
      </motion.div>

      <motion.div
        style={{ y: Math.min(pullDistance * 0.3, 20) }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// LONG PRESS COMPONENT
// ============================================================================

interface LongPressProps {
  children: React.ReactNode;
  onLongPress: () => void;
  onShortPress?: () => void;
  duration?: number;
  className?: string;
  disabled?: boolean;
}

export const LongPress: React.FC<LongPressProps> = ({
  children,
  onLongPress,
  onShortPress,
  duration = 500,
  className = '',
  disabled = false
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isPressed, setIsPressed] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const timerRef = React.useRef<NodeJS.Timeout>();
  const progressRef = React.useRef<NodeJS.Timeout>();

  const startPress = () => {
    if (disabled) return;
    
    setIsPressed(true);
    setProgress(0);

    // Progress animation
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressRef.current);
          return 100;
        }
        return prev + (100 / (duration / 50));
      });
    }, 50);

    // Long press timer
    timerRef.current = setTimeout(() => {
      onLongPress();
      setIsPressed(false);
      setProgress(0);
    }, duration);
  };

  const endPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
    }

    if (isPressed && progress < 100 && onShortPress) {
      onShortPress();
    }

    setIsPressed(false);
    setProgress(0);
  };

  if (shouldReduceMotion || disabled) {
    return (
      <div className={className} onClick={onShortPress}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={cn('relative touch-manipulation select-none', className)}
      onPointerDown={startPress}
      onPointerUp={endPress}
      onPointerLeave={endPress}
      whilePressed={{ scale: 0.95 }}
      animate={{ scale: isPressed ? 0.95 : 1 }}
      transition={{ duration: 0.1 }}
    >
      {children}
      
      {/* Progress indicator */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-blue-500/20"
            style={{
              background: `conic-gradient(from 0deg, rgba(59, 130, 246, 0.3) ${progress}%, transparent ${progress}%)`
            }}
          />
          <div className="absolute inset-2 bg-white/90 rounded-md" />
        </motion.div>
      )}
    </motion.div>
  );
};

// ============================================================================
// PINCH TO ZOOM COMPONENT
// ============================================================================

interface PinchToZoomProps {
  children: React.ReactNode;
  minZoom?: number;
  maxZoom?: number;
  className?: string;
  disabled?: boolean;
}

export const PinchToZoom: React.FC<PinchToZoomProps> = ({
  children,
  minZoom = 0.5,
  maxZoom = 3,
  className = '',
  disabled = false
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [scale, setScale] = React.useState(1);

  if (shouldReduceMotion || disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn('relative overflow-hidden touch-pan-x touch-pan-y', className)}
      style={{ scale }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      onWheel={(e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        const newScale = Math.min(Math.max(scale + delta, minZoom), maxZoom);
        setScale(newScale);
      }}
      whileDrag={{ cursor: 'grabbing' }}
    >
      {children}
      
      {/* Zoom indicator */}
      {scale !== 1 && (
        <motion.div
          className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Math.round(scale * 100)}%
        </motion.div>
      )}
    </motion.div>
  );
};

// ============================================================================
// DRAG AND DROP COMPONENT
// ============================================================================

interface DragDropProps {
  children: React.ReactNode;
  onDrop?: (data: any) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  dragData?: any;
  className?: string;
  disabled?: boolean;
  dropZone?: boolean;
}

export const DragDrop: React.FC<DragDropProps> = ({
  children,
  onDrop,
  onDragStart,
  onDragEnd,
  dragData,
  className = '',
  disabled = false,
  dropZone = false
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isDragging, setIsDragging] = React.useState(false);
  const [isOver, setIsOver] = React.useState(false);
  const dragControls = useDragControls();

  if (shouldReduceMotion || disabled) {
    return <div className={className}>{children}</div>;
  }

  const handleDragStart = () => {
    setIsDragging(true);
    onDragStart?.();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd?.();
  };

  return (
    <motion.div
      className={cn(
        'relative',
        dropZone && 'border-2 border-dashed border-gray-300 rounded-lg p-4',
        isOver && 'border-blue-500 bg-blue-50',
        className
      )}
      drag={!dropZone}
      dragControls={!dropZone ? dragControls : undefined}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragEnter={() => dropZone && setIsOver(true)}
      onDragLeave={() => dropZone && setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        if (dropZone && onDrop) {
          const data = e.dataTransfer.getData('application/json');
          onDrop(data ? JSON.parse(data) : dragData);
        }
      }}
      onDragOver={(e) => dropZone && e.preventDefault()}
      whileDrag={!dropZone ? {
        scale: 1.1,
        rotate: 5,
        zIndex: 10,
        transition: { duration: 0.2 }
      } : {}}
      animate={{
        scale: isOver ? 1.02 : 1,
        transition: { duration: 0.2 }
      }}
    >
      {children}
      
      {/* Drag overlay */}
      {isDragging && !dropZone && (
        <motion.div
          className="absolute inset-0 bg-blue-500/20 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      
      {/* Drop zone indicator */}
      {dropZone && isOver && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-blue-600 font-medium"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          Drop here
        </motion.div>
      )}
    </motion.div>
  );
};