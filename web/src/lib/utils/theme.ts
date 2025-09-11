// web/src/lib/utils/theme.ts

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  safetyColors, 
  alertColors, 
  zoneColors, 
  getStatusColor 
} from '@/lib/theme/color-palette';
import { getTextClasses } from '@/lib/theme/typography';
import { animationClasses, animationPresets } from '@/lib/theme/animations';

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Theme utility functions
export const themeUtils = {
  // Get colors by context
  colors: {
    primary: safetyColors.primary,
    secondary: safetyColors.secondary,
    danger: safetyColors.danger,
    warning: safetyColors.warning,
    neutral: safetyColors.neutral,
    alert: alertColors,
    zone: zoneColors,
    getStatus: getStatusColor,
  },

  // Typography helpers
  text: {
    getClasses: getTextClasses,
    variants: {
      h1: 'text-3xl font-bold leading-tight tracking-tight',
      h2: 'text-2xl font-semibold leading-tight tracking-tight',
      h3: 'text-xl font-semibold leading-normal',
      h4: 'text-lg font-medium leading-normal',
      body: 'text-base font-normal leading-normal',
      bodySmall: 'text-sm font-normal leading-normal',
      caption: 'text-xs font-normal leading-normal text-neutral-600',
      label: 'text-sm font-medium leading-normal',
    },
  },

  // Animation helpers
  animations: {
    classes: animationClasses,
    presets: animationPresets,
    // Quick access to common animations
    fadeIn: 'animate-in fade-in duration-200',
    slideIn: 'animate-in slide-in-from-bottom duration-300',
    scaleIn: 'animate-in zoom-in-95 duration-200',
    hover: 'transition-colors duration-150 ease-out',
    interactive: 'transition-all duration-200 ease-out hover:shadow-md',
  },

  // Component variants
  variants: {
    button: {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:bg-primary-700',
      secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:bg-secondary-700',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:bg-red-700',
      outline: 'border border-neutral-300 bg-transparent hover:bg-neutral-50',
      ghost: 'bg-transparent hover:bg-neutral-100',
    },
    card: {
      default: 'bg-white border border-neutral-200 rounded-lg shadow-sm',
      interactive: 'bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200',
      alert: 'bg-red-50 border border-red-200 rounded-lg',
      warning: 'bg-yellow-50 border border-yellow-200 rounded-lg',
      success: 'bg-green-50 border border-green-200 rounded-lg',
    },
    badge: {
      default: 'px-2 py-1 text-xs font-medium rounded-full',
      primary: 'bg-primary-100 text-primary-800',
      secondary: 'bg-secondary-100 text-secondary-800',
      danger: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      success: 'bg-green-100 text-green-800',
    },
  },

  // Status-based styling
  status: {
    getColor: (status: string, mode: 'light' | 'dark' = 'light') => getStatusColor(status, mode),
    getBadgeClasses: (status: string) => {
      const statusMap: Record<string, string> = {
        active: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        inactive: 'bg-gray-100 text-gray-800',
        error: 'bg-red-100 text-red-800',
        warning: 'bg-orange-100 text-orange-800',
      };
      return cn('px-2 py-1 text-xs font-medium rounded-full', statusMap[status] || statusMap.inactive);
    },
  },

  // Alert severity styling
  alert: {
    getSeverityClasses: (severity: keyof typeof alertColors) => {
      const severityMap = {
        emergency: 'bg-red-50 border-red-200 text-red-800',
        missing: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        medical: 'bg-red-50 border-red-200 text-red-800',
        security: 'bg-orange-50 border-orange-200 text-orange-800',
        geofence: 'bg-violet-50 border-violet-200 text-violet-800',
        anomaly: 'bg-cyan-50 border-cyan-200 text-cyan-800',
        panic: 'bg-red-50 border-red-200 text-red-800',
        system: 'bg-gray-50 border-gray-200 text-gray-800',
      };
      return cn('p-3 rounded-lg border', severityMap[severity] || severityMap.system);
    },
  },

  // Zone risk styling
  zone: {
    getRiskClasses: (risk: keyof typeof zoneColors) => {
      const riskMap = {
        safe: 'bg-green-100 text-green-800 border-green-200',
        lowRisk: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        moderateRisk: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        highRisk: 'bg-red-100 text-red-800 border-red-200',
        restricted: 'bg-red-900 text-red-100 border-red-800',
      };
      return cn('px-2 py-1 text-xs font-medium rounded border', riskMap[risk] || riskMap.safe);
    },
  },
};

// Export individual utilities for convenience
export const { colors, text, animations, variants, status, alert, zone } = themeUtils;

// Default export
export default themeUtils;
