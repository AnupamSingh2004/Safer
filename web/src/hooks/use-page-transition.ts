/**
 * Smart Tourist Safety System - Page Transition Hook
 * Smooth page transitions and route change handling
 */

'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useEnhancedTheme } from '@/components/providers/enhanced-theme-provider';

// ============================================================================
// TRANSITION TYPES
// ============================================================================

export type TransitionDirection = 'forward' | 'backward' | 'none';
export type TransitionState = 'idle' | 'loading' | 'transitioning' | 'complete';

interface TransitionConfig {
  duration: number;
  direction: TransitionDirection;
  preserveScroll: boolean;
  enablePredictiveLoading: boolean;
}

interface PageTransitionState {
  isTransitioning: boolean;
  direction: TransitionDirection;
  fromPath: string | null;
  toPath: string | null;
  progress: number;
  state: TransitionState;
}

// ============================================================================
// PAGE TRANSITION HOOK
// ============================================================================

interface UsePageTransitionOptions {
  duration?: number;
  enablePredictiveLoading?: boolean;
  preserveScroll?: boolean;
  onTransitionStart?: (fromPath: string, toPath: string) => void;
  onTransitionComplete?: (path: string) => void;
  onTransitionError?: (error: Error) => void;
}

export function usePageTransition({
  duration = 400,
  enablePredictiveLoading = true,
  preserveScroll = false,
  onTransitionStart,
  onTransitionComplete,
  onTransitionError,
}: UsePageTransitionOptions = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const { animationsEnabled } = useEnhancedTheme();

  const [transitionState, setTransitionState] = useState<PageTransitionState>({
    isTransitioning: false,
    direction: 'none',
    fromPath: null,
    toPath: null,
    progress: 0,
    state: 'idle',
  });

  const [routeHistory, setRouteHistory] = useState<string[]>([]);

  // Update route history
  useEffect(() => {
    setRouteHistory((prev) => {
      const newHistory = [...prev];
      if (newHistory[newHistory.length - 1] !== pathname) {
        newHistory.push(pathname);
        // Keep only last 10 routes for performance
        if (newHistory.length > 10) {
          newHistory.shift();
        }
      }
      return newHistory;
    });
  }, [pathname]);

  // Determine transition direction
  const getTransitionDirection = (fromPath: string, toPath: string): TransitionDirection => {
    const currentIndex = routeHistory.indexOf(fromPath);
    const targetIndex = routeHistory.indexOf(toPath);
    
    if (currentIndex === -1 || targetIndex === -1) {
      return 'forward';
    }
    
    return targetIndex > currentIndex ? 'forward' : 'backward';
  };

  // Navigate with transition
  const navigateWithTransition = async (
    path: string,
    options: { 
      replace?: boolean; 
      scroll?: boolean;
      direction?: TransitionDirection;
    } = {}
  ) => {
    const { replace = false, scroll = !preserveScroll, direction } = options;

    try {
      const fromPath = pathname;
      const toPath = path;
      const transitionDirection = direction || getTransitionDirection(fromPath, toPath);

      // Start transition
      setTransitionState({
        isTransitioning: true,
        direction: transitionDirection,
        fromPath,
        toPath,
        progress: 0,
        state: 'loading',
      });

      onTransitionStart?.(fromPath, toPath);

      // Simulate loading progress if animations are enabled
      if (animationsEnabled) {
        const progressInterval = setInterval(() => {
          setTransitionState((prev) => ({
            ...prev,
            progress: Math.min(prev.progress + 10, 90),
          }));
        }, duration / 10);

        setTimeout(() => {
          clearInterval(progressInterval);
        }, duration * 0.8);
      }

      // Perform navigation
      if (replace) {
        router.replace(path, { scroll });
      } else {
        router.push(path, { scroll });
      }

      // Complete transition after duration
      setTimeout(() => {
        setTransitionState({
          isTransitioning: false,
          direction: 'none',
          fromPath: null,
          toPath: null,
          progress: 100,
          state: 'complete',
        });

        onTransitionComplete?.(path);

        // Reset to idle after a brief delay
        setTimeout(() => {
          setTransitionState((prev) => ({
            ...prev,
            state: 'idle',
            progress: 0,
          }));
        }, 100);
      }, animationsEnabled ? duration : 0);

    } catch (error) {
      setTransitionState({
        isTransitioning: false,
        direction: 'none',
        fromPath: null,
        toPath: null,
        progress: 0,
        state: 'idle',
      });

      onTransitionError?.(error as Error);
    }
  };

  // Back navigation with transition
  const goBackWithTransition = () => {
    if (routeHistory.length > 1) {
      const previousPath = routeHistory[routeHistory.length - 2];
      navigateWithTransition(previousPath, { direction: 'backward' });
    } else {
      router.back();
    }
  };

  // Predictive loading for smooth transitions
  useEffect(() => {
    if (!enablePredictiveLoading || typeof window === 'undefined') return;

    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        router.prefetch(link.href);
      }
    };

    // Add listeners to all links
    document.addEventListener('mouseenter', handleMouseEnter, true);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
    };
  }, [enablePredictiveLoading, router]);

  return {
    transitionState,
    navigate: navigateWithTransition,
    goBack: goBackWithTransition,
    isTransitioning: transitionState.isTransitioning,
    transitionProgress: transitionState.progress,
    routeHistory: [...routeHistory],
  };
}

// ============================================================================
// ROUTE TRANSITION HOOK
// ============================================================================

interface UseRouteTransitionOptions {
  enableTransitions?: boolean;
  transitionDuration?: number;
  onRouteChangeStart?: (url: string) => void;
  onRouteChangeComplete?: (url: string) => void;
  onRouteChangeError?: (error: Error) => void;
}

export function useRouteTransition({
  enableTransitions = true,
  transitionDuration = 300,
  onRouteChangeStart,
  onRouteChangeComplete,
  onRouteChangeError,
}: UseRouteTransitionOptions = {}) {
  const pathname = usePathname();
  const [isRouteChanging, setIsRouteChanging] = useState(false);
  const [previousRoute, setPreviousRoute] = useState<string | null>(null);

  useEffect(() => {
    if (!enableTransitions) return;

    setIsRouteChanging(true);
    setPreviousRoute(pathname);
    onRouteChangeStart?.(pathname);

    const timer = setTimeout(() => {
      setIsRouteChanging(false);
      onRouteChangeComplete?.(pathname);
    }, transitionDuration);

    return () => clearTimeout(timer);
  }, [pathname, enableTransitions, transitionDuration, onRouteChangeStart, onRouteChangeComplete]);

  return {
    isRouteChanging,
    currentRoute: pathname,
    previousRoute,
    transitionDuration,
  };
}

// ============================================================================
// SCROLL RESTORATION HOOK
// ============================================================================

interface ScrollPosition {
  x: number;
  y: number;
}

export function useScrollRestoration(key?: string) {
  const pathname = usePathname();
  const [scrollPositions, setScrollPositions] = useState<Map<string, ScrollPosition>>(new Map());

  const saveScrollPosition = (path?: string) => {
    if (typeof window === 'undefined') return;
    
    const currentPath = path || pathname;
    const position = {
      x: window.scrollX,
      y: window.scrollY,
    };

    setScrollPositions((prev) => {
      const newMap = new Map(prev);
      newMap.set(currentPath, position);
      return newMap;
    });
  };

  const restoreScrollPosition = (path?: string) => {
    if (typeof window === 'undefined') return;
    
    const targetPath = path || pathname;
    const position = scrollPositions.get(targetPath);

    if (position) {
      window.scrollTo(position.x, position.y);
    } else {
      window.scrollTo(0, 0);
    }
  };

  const clearScrollPositions = () => {
    setScrollPositions(new Map());
  };

  // Auto-save scroll position on route change
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pathname]);

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPositions,
    scrollPositions: Object.fromEntries(scrollPositions),
  };
}

export default usePageTransition;