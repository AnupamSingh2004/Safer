/**
 * Smart Tourist Safety System - Simple & Smooth Page Transitions
 * Gentle, professional transitions focused on simplicity and elegance
 */

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { 
  simpleFadeVariants,
  gentleSlideVariants,
  gentleSlideLeftVariants,
  dashboardPageVariants,
  sidebarSlideVariants,
  prefersReducedMotion
} from '@/lib/animations';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PageTransitionProps {
  children: React.ReactNode;
  transitionType?: 'auto' | 'fade' | 'slide' | 'slide-left' | 'none';
  className?: string;
  preserveScroll?: boolean;
  layoutId?: string;
}

type PageType = 'auth' | 'dashboard' | 'public' | 'emergency' | 'default';
type NavigationDirection = 'forward' | 'backward';

// ============================================================================
// SIMPLE PAGE TYPE DETECTION
// ============================================================================

/**
 * Simple page type detection based on URL patterns
 */
function detectPageType(pathname: string): PageType {
  if (pathname.includes('/auth') || pathname.includes('/login') || pathname.includes('/register')) {
    return 'auth';
  }
  if (pathname.includes('/dashboard') || pathname.includes('/admin') || pathname.includes('/profile')) {
    return 'dashboard';
  }
  if (pathname.includes('/emergency') || pathname.includes('/alert') || pathname.includes('/sos')) {
    return 'emergency';
  }
  return 'public';
}

/**
 * Simple navigation direction detection
 */
function detectNavigationDirection(currentPath: string, previousPath: string | null): NavigationDirection {
  if (!previousPath) return 'forward';
  
  // Simple heuristic: if going to a "deeper" path, it's forward
  const currentDepth = currentPath.split('/').length;
  const previousDepth = previousPath.split('/').length;
  
  return currentDepth >= previousDepth ? 'forward' : 'backward';
}

// ============================================================================
// SIMPLE TRANSITION COMPONENTS
// ============================================================================

/**
 * Simple fade transition - most common
 */
const SimpleFadeTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = "",
  layoutId 
}) => (
  <motion.div
    key={layoutId || "fade-transition"}
    variants={simpleFadeVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className={`w-full ${className}`}
  >
    {children}
  </motion.div>
);

/**
 * Gentle slide transition for forward navigation
 */
const GentleSlideTransition: React.FC<PageTransitionProps & { direction?: NavigationDirection }> = ({ 
  children, 
  direction = 'forward',
  className = "",
  layoutId 
}) => {
  const variants = direction === 'forward' ? gentleSlideVariants : gentleSlideLeftVariants;
  
  return (
    <motion.div
      key={layoutId || `slide-${direction}`}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

/**
 * Dashboard transition with sidebar consideration
 */
const DashboardTransition: React.FC<PageTransitionProps & { hasSidebar?: boolean }> = ({ 
  children, 
  hasSidebar = false,
  className = "",
  layoutId 
}) => (
  <motion.div
    key={layoutId || "dashboard-transition"}
    variants={dashboardPageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className={`w-full ${hasSidebar ? 'pl-0' : ''} ${className}`}
  >
    {children}
  </motion.div>
);

// ============================================================================
// SIMPLE SIDEBAR COMPONENT
// ============================================================================

interface SimpleSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const SimpleSidebar: React.FC<SimpleSidebarProps> = ({
  isOpen,
  onClose,
  children,
  className = ""
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        variants={sidebarSlideVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 shadow-lg z-50 ${className}`}
        style={{ width: '280px' }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

// ============================================================================
// MAIN PAGE TRANSITION COMPONENT
// ============================================================================

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  transitionType = 'auto',
  className = "",
  preserveScroll = true,
  layoutId,
}) => {
  const pathname = usePathname();
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);

  // Track navigation history for simple direction detection
  useEffect(() => {
    if (pathname !== previousPath) {
      setIsTransitioning(true);
      setPreviousPath(pathname);
      
      // End transition after animation completes
      const timer = setTimeout(() => setIsTransitioning(false), 500);
      return () => clearTimeout(timer);
    }
  }, [pathname, previousPath]);

  // Simple transition selection
  const getTransitionComponent = useMemo(() => {
    if (reducedMotion || transitionType === 'none') {
      return SimpleFadeTransition;
    }

    if (transitionType !== 'auto') {
      switch (transitionType) {
        case 'fade':
          return SimpleFadeTransition;
        case 'slide':
          return (props: PageTransitionProps) => (
            <GentleSlideTransition {...props} direction="forward" />
          );
        case 'slide-left':
          return (props: PageTransitionProps) => (
            <GentleSlideTransition {...props} direction="backward" />
          );
        default:
          return SimpleFadeTransition;
      }
    }

    // Auto-detect based on page type
    const pageType = detectPageType(pathname);
    const direction = detectNavigationDirection(pathname, previousPath);

    switch (pageType) {
      case 'dashboard':
        return (props: PageTransitionProps) => (
          <DashboardTransition {...props} hasSidebar={true} />
        );
      case 'auth':
      case 'emergency':
      case 'public':
      default:
        return (props: PageTransitionProps) => (
          <GentleSlideTransition {...props} direction={direction} />
        );
    }
  }, [transitionType, pathname, previousPath, reducedMotion]);

  const TransitionComponent = getTransitionComponent;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <TransitionComponent
        key={pathname}
        className={className}
        preserveScroll={preserveScroll}
        layoutId={layoutId || pathname}
      >
        {children}
      </TransitionComponent>
    </AnimatePresence>
  );
};

// ============================================================================
// LAYOUT TRANSITION WRAPPER
// ============================================================================

interface LayoutTransitionProps {
  children: React.ReactNode;
  className?: string;
  sidebarOpen?: boolean;
}

export const LayoutTransition: React.FC<LayoutTransitionProps> = ({
  children,
  className = "",
  sidebarOpen = false,
}) => {
  return (
    <motion.div
      className={`min-h-screen transition-all duration-500 ease-in-out ${
        sidebarOpen ? 'ml-70' : 'ml-0'
      } ${className}`}
      animate={{
        marginLeft: sidebarOpen ? '280px' : '0px',
      }}
      transition={{
        type: "tween",
        ease: [0.4, 0.0, 0.2, 1],
        duration: 0.5,
      }}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// SIMPLE ANIMATION HOOK
// ============================================================================

export function useSimplePageTransition() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 400);
    return () => clearTimeout(timer);
  }, [pathname]);

  return {
    isTransitioning,
    pathname,
    pageType: detectPageType(pathname),
  };
}

// Additional hooks for compatibility
export function useManualTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const startTransition = () => setIsTransitioning(true);
  const endTransition = () => setIsTransitioning(false);
  
  return {
    isTransitioning,
    startTransition,
    endTransition
  };
}

export function useTransitionState() {
  const pathname = usePathname();
  const [transitionState, setTransitionState] = useState('idle');
  
  useEffect(() => {
    setTransitionState('transitioning');
    const timer = setTimeout(() => setTransitionState('completed'), 300);
    return () => clearTimeout(timer);
  }, [pathname]);
  
  return { transitionState, pathname };
}

// Loading transition component
export const LoadingTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default PageTransition;

// Legacy exports for compatibility
export {
  SimpleFadeTransition as FadeTransition,
  GentleSlideTransition as SlideTransition,
  DashboardTransition,
  SimpleSidebar as Sidebar,
};