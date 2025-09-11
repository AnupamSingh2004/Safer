// web/src/lib/theme/animations.ts

// Animation durations for consistent timing
export const animationDurations = {
  fast: '150ms',        // Quick interactions (hover, focus)
  normal: '200ms',      // Standard transitions
  slow: '300ms',        // Complex animations
  slower: '500ms',      // Page transitions
} as const;

// Easing curves for smooth animations
export const easingCurves = {
  easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',      // Natural deceleration
  easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',         // Natural acceleration
  easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',    // Smooth both ways
  sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',        // Quick and responsive
} as const;

// Pre-defined animation classes for Tailwind
export const animationClasses = {
  // Fade animations
  fadeIn: 'animate-in fade-in duration-200',
  fadeOut: 'animate-out fade-out duration-200',
  
  // Slide animations
  slideInRight: 'animate-in slide-in-from-right duration-300',
  slideInLeft: 'animate-in slide-in-from-left duration-300',
  slideInUp: 'animate-in slide-in-from-bottom duration-300',
  slideInDown: 'animate-in slide-in-from-top duration-300',
  
  // Scale animations
  scaleIn: 'animate-in zoom-in-95 duration-200',
  scaleOut: 'animate-out zoom-out-95 duration-200',
  
  // Spin for loading states
  spin: 'animate-spin',
  
  // Pulse for attention
  pulse: 'animate-pulse',
  
  // Bounce for alerts
  bounce: 'animate-bounce',
} as const;

// Animation utilities for JavaScript/CSS-in-JS
export const keyframes = {
  fadeIn: {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },
  fadeOut: {
    from: { opacity: '1' },
    to: { opacity: '0' },
  },
  slideUp: {
    from: { transform: 'translateY(100%)', opacity: '0' },
    to: { transform: 'translateY(0)', opacity: '1' },
  },
  slideDown: {
    from: { transform: 'translateY(-100%)', opacity: '0' },
    to: { transform: 'translateY(0)', opacity: '1' },
  },
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: '0' },
    to: { transform: 'scale(1)', opacity: '1' },
  },
  alertPulse: {
    '0%': { transform: 'scale(1)', opacity: '1' },
    '50%': { transform: 'scale(1.05)', opacity: '0.8' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
  shimmer: {
    '0%': { backgroundPosition: '-200px 0' },
    '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
  },
} as const;

// Transition utilities
export const transitions = {
  all: `all ${animationDurations.normal} ${easingCurves.easeOut}`,
  colors: `background-color ${animationDurations.fast} ${easingCurves.easeOut}, border-color ${animationDurations.fast} ${easingCurves.easeOut}, color ${animationDurations.fast} ${easingCurves.easeOut}`,
  opacity: `opacity ${animationDurations.fast} ${easingCurves.easeOut}`,
  transform: `transform ${animationDurations.normal} ${easingCurves.easeOut}`,
  shadow: `box-shadow ${animationDurations.fast} ${easingCurves.easeOut}`,
} as const;

// Animation preset configurations
export const animationPresets = {
  button: {
    hover: 'transition-colors duration-150 ease-out',
    click: 'transition-transform duration-75 ease-out active:scale-95',
  },
  card: {
    hover: 'transition-all duration-200 ease-out hover:shadow-lg hover:-translate-y-1',
    interactive: 'transition-all duration-200 ease-out hover:shadow-md hover:bg-neutral-50 dark:hover:bg-neutral-800',
  },
  modal: {
    backdrop: 'transition-opacity duration-300 ease-out',
    content: 'transition-all duration-300 ease-out',
  },
  drawer: {
    overlay: 'transition-opacity duration-200 ease-out',
    panel: 'transition-transform duration-300 ease-out',
  },
  alert: {
    enter: 'animate-in slide-in-from-top duration-300 ease-out',
    exit: 'animate-out slide-out-to-top duration-200 ease-out',
  },
  notification: {
    enter: 'animate-in slide-in-from-right duration-300 ease-out',
    exit: 'animate-out slide-out-to-right duration-200 ease-out',
  },
} as const;

// Loading animation configurations
export const loadingAnimations = {
  spinner: 'animate-spin duration-1000 linear infinite',
  pulse: 'animate-pulse duration-2000 ease-in-out infinite',
  bounce: 'animate-bounce duration-1000 ease-in-out infinite',
  skeleton: `
    bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 
    bg-[length:200px_100%] 
    animate-[shimmer_1.5s_ease-in-out_infinite]
  `,
} as const;