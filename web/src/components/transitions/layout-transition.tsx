/**
 * Smart Tourist Safety System - Layout Transition Component
 * Layout-based transitions for seamless navigation experience
 */

"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, LayoutGroup } from "framer-motion";
import { usePathname } from "next/navigation";
import { 
  containerVariants, 
  gridVariants,
  childVariants,
  baseTransition,
  fastTransition,
  springTransition
} from "@/lib/animations";

// ============================================================================
// INTERFACES
// ============================================================================

interface LayoutTransitionProps {
  children: React.ReactNode;
  className?: string;
  layoutId?: string;
  preserveAspectRatio?: boolean;
  enableSharedElements?: boolean;
  animateHeight?: boolean;
  animateWidth?: boolean;
  onLayoutComplete?: () => void;
}

interface SharedElementTransitionProps {
  children: React.ReactNode;
  layoutId: string;
  className?: string;
  transition?: typeof baseTransition;
}

interface NavigationLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  widgets?: React.ReactNode[];
  className?: string;
  gridColumns?: number;
  gridGap?: number;
}

// ============================================================================
// SHARED ELEMENT TRANSITION
// ============================================================================

export function SharedElementTransition({
  children,
  layoutId,
  className = "",
  transition = springTransition,
}: SharedElementTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      layoutId={layoutId}
      className={className}
      transition={shouldReduceMotion ? { duration: 0 } : transition}
      style={{
        originX: 0.5,
        originY: 0.5,
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// LAYOUT TRANSITION COMPONENT
// ============================================================================

export function LayoutTransition({
  children,
  className = "",
  layoutId,
  preserveAspectRatio = false,
  enableSharedElements = true,
  animateHeight = false,
  animateWidth = false,
  onLayoutComplete,
}: LayoutTransitionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mark layout as ready after initial render
    const timer = setTimeout(() => setIsLayoutReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const layoutProps = {
    layout: !shouldReduceMotion && isLayoutReady,
    layoutId: enableSharedElements ? layoutId : undefined,
    transition: shouldReduceMotion ? { duration: 0 } : springTransition,
    onLayoutAnimationComplete: onLayoutComplete,
    style: {
      ...(preserveAspectRatio && { aspectRatio: 'auto' }),
      ...(animateHeight && { height: 'auto' }),
      ...(animateWidth && { width: 'auto' }),
    },
  };

  if (enableSharedElements && layoutId) {
    return (
      <LayoutGroup>
        <motion.div
          ref={containerRef}
          className={`layout-transition-wrapper ${className}`}
          {...layoutProps}
        >
          {children}
        </motion.div>
      </LayoutGroup>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className={`layout-transition-wrapper ${className}`}
      {...layoutProps}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// NAVIGATION LAYOUT TRANSITION
// ============================================================================

export function NavigationLayoutTransition({
  children,
  sidebar,
  header,
  footer,
  className = "",
  sidebarCollapsed = false,
  onSidebarToggle,
}: NavigationLayoutProps) {
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();

  // Animate sidebar collapse/expand
  const sidebarVariants = {
    expanded: {
      width: 280,
      opacity: 1,
      x: 0,
      transition: shouldReduceMotion ? { duration: 0 } : springTransition,
    },
    collapsed: {
      width: 64,
      opacity: 0.8,
      x: 0,
      transition: shouldReduceMotion ? { duration: 0 } : springTransition,
    },
  };

  // Main content area animation
  const contentVariants = {
    sidebarExpanded: {
      marginLeft: 280,
      transition: shouldReduceMotion ? { duration: 0 } : springTransition,
    },
    sidebarCollapsed: {
      marginLeft: 64,
      transition: shouldReduceMotion ? { duration: 0 } : springTransition,
    },
  };

  return (
    <div className={`navigation-layout ${className}`}>
      {/* Header */}
      {header && (
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : fastTransition}
          className="header-transition"
          layoutId="main-header"
        >
          {header}
        </motion.header>
      )}

      <div className="flex flex-1">
        {/* Sidebar */}
        {sidebar && (
          <motion.aside
            variants={sidebarVariants}
            animate={sidebarCollapsed ? "collapsed" : "expanded"}
            className="sidebar-transition fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40"
            layoutId="main-sidebar"
          >
            <div className="p-4">
              {/* Sidebar toggle button */}
              <motion.button
                onClick={onSidebarToggle}
                className="mb-4 p-2 rounded-md hover:bg-gray-100 transition-colors"
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: sidebarCollapsed ? 180 : 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : baseTransition}
                >
                  ☰
                </motion.div>
              </motion.button>
              
              {/* Sidebar content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={sidebarCollapsed ? 'collapsed' : 'expanded'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : fastTransition}
                >
                  {sidebar}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.aside>
        )}

        {/* Main content */}
        <motion.main
          variants={contentVariants}
          animate={sidebarCollapsed ? "sidebarCollapsed" : "sidebarExpanded"}
          className="flex-1 main-content-transition"
          layoutId="main-content"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-screen"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>

      {/* Footer */}
      {footer && (
        <motion.footer
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={shouldReduceMotion ? { duration: 0 } : fastTransition}
          className="footer-transition"
          layoutId="main-footer"
        >
          {footer}
        </motion.footer>
      )}
    </div>
  );
}

// ============================================================================
// DASHBOARD LAYOUT TRANSITION
// ============================================================================

export function DashboardLayoutTransition({
  children,
  widgets = [],
  className = "",
  gridColumns = 3,
  gridGap = 24,
}: DashboardLayoutProps) {
  const shouldReduceMotion = useReducedMotion();
  const [widgetLayout, setWidgetLayout] = useState<string[]>([]);

  // Generate layout IDs for widgets
  useEffect(() => {
    const layout = widgets.map((_, index) => `widget-${index}`);
    setWidgetLayout(layout);
  }, [widgets]);

  return (
    <div className={`dashboard-layout ${className}`}>
      <LayoutGroup>
        {/* Main content area */}
        <motion.div
          layout={!shouldReduceMotion}
          className="dashboard-main"
          layoutId="dashboard-main"
        >
          {children}
        </motion.div>

        {/* Widgets grid */}
        {widgets.length > 0 && (
          <motion.div
            layout={!shouldReduceMotion}
            variants={gridVariants}
            initial="initial"
            animate="animate"
            className="widgets-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
              gap: gridGap,
            }}
            layoutId="widgets-container"
          >
            {widgets.map((widget, index) => (
              <motion.div
                key={widgetLayout[index]}
                layout={!shouldReduceMotion}
                variants={childVariants}
                className="widget-container"
                layoutId={widgetLayout[index]}
                whileHover={shouldReduceMotion ? {} : { 
                  scale: 1.02, 
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)" 
                }}
                transition={shouldReduceMotion ? { duration: 0 } : springTransition}
              >
                {widget}
              </motion.div>
            ))}
          </motion.div>
        )}
      </LayoutGroup>
    </div>
  );
}

// ============================================================================
// RESPONSIVE LAYOUT TRANSITION
// ============================================================================

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl';
  mobileLayout?: React.ReactNode;
  tabletLayout?: React.ReactNode;
  desktopLayout?: React.ReactNode;
}

export function ResponsiveLayoutTransition({
  children,
  className = "",
  breakpoint = 'md',
  mobileLayout,
  tabletLayout,
  desktopLayout,
}: ResponsiveLayoutProps) {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getLayoutContent = () => {
    switch (screenSize) {
      case 'mobile':
        return mobileLayout || children;
      case 'tablet':
        return tabletLayout || children;
      case 'desktop':
        return desktopLayout || children;
      default:
        return children;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenSize}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={shouldReduceMotion ? { duration: 0 } : baseTransition}
        className={`responsive-layout responsive-layout-${screenSize} ${className}`}
        layoutId="responsive-container"
      >
        {getLayoutContent()}
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================================
// MODAL LAYOUT TRANSITION
// ============================================================================

interface ModalLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
}

export function ModalLayoutTransition({
  isOpen,
  onClose,
  children,
  title,
  className = "",
  size = 'md',
  closeOnBackdropClick = true,
  showCloseButton = true,
}: ModalLayoutProps) {
  const shouldReduceMotion = useReducedMotion();

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'max-w-md';
      case 'md': return 'max-w-lg';
      case 'lg': return 'max-w-2xl';
      case 'xl': return 'max-w-4xl';
      case 'full': return 'max-w-7xl mx-4';
      default: return 'max-w-lg';
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            transition={shouldReduceMotion ? { duration: 0 } : fastTransition}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={closeOnBackdropClick ? onClose : undefined}
            layoutId="modal-backdrop"
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            transition={shouldReduceMotion ? { duration: 0 } : springTransition}
            className={`relative bg-white rounded-lg shadow-xl w-full ${getSizeClasses()} ${className}`}
            layoutId="modal-content"
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.1, ...fastTransition }}
                className="flex items-center justify-between p-6 border-b border-gray-200"
              >
                {title && (
                  <h2 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <motion.button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.15, ...fastTransition }}
              className="p-6"
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook for managing layout transitions state
 */
export function useLayoutTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeLayoutId, setActiveLayoutId] = useState<string | null>(null);

  const startTransition = (layoutId?: string) => {
    setIsTransitioning(true);
    setActiveLayoutId(layoutId || null);
  };

  const endTransition = () => {
    setIsTransitioning(false);
    setActiveLayoutId(null);
  };

  return {
    isTransitioning,
    activeLayoutId,
    startTransition,
    endTransition,
  };
}

/**
 * Hook for coordinating multiple layout animations
 */
export function useCoordinatedLayout() {
  const [layouts, setLayouts] = useState<Map<string, boolean>>(new Map());

  const registerLayout = (id: string) => {
    setLayouts(prev => new Map(prev).set(id, false));
  };

  const markLayoutComplete = (id: string) => {
    setLayouts(prev => new Map(prev).set(id, true));
  };

  const allLayoutsComplete = Array.from(layouts.values()).every(Boolean);

  return {
    registerLayout,
    markLayoutComplete,
    allLayoutsComplete,
    layoutCount: layouts.size,
  };
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default LayoutTransition;