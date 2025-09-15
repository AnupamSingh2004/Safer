import { Config } from 'tailwindcss'
import { enhancedEmergencyColors } from './src/lib/theme/enhanced-theme-config'
import { animationDurations } from './src/lib/theme/enhanced-animations'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        md: '2rem',
        lg: '3rem',
        xl: '4rem',
        '2xl': '5rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    screens: {
      xs: '475px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      // ========================================================================
      // ENHANCED COLOR SYSTEM
      // ========================================================================
      colors: {
        // CSS Custom Property Colors (for theme switching)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          ...enhancedEmergencyColors.safePrimary,
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          ...enhancedEmergencyColors.safeSecondary,
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          ...enhancedEmergencyColors.emergencyDanger,
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          ...enhancedEmergencyColors.cautionWarning,
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        
        // Emergency Service Specific Colors
        emergency: enhancedEmergencyColors.emergencyDanger,
        safety: enhancedEmergencyColors.safeSecondary,
        caution: enhancedEmergencyColors.cautionWarning,
        neutral: enhancedEmergencyColors.professionalNeutral,
        
        // Status Colors for Emergency Services
        status: {
          safe: enhancedEmergencyColors.safeSecondary[500],
          warning: enhancedEmergencyColors.cautionWarning[500],
          danger: enhancedEmergencyColors.emergencyDanger[500],
          info: enhancedEmergencyColors.safePrimary[500],
          offline: enhancedEmergencyColors.professionalNeutral[400],
        },
        
        // Zone Colors
        zone: {
          safe: enhancedEmergencyColors.safeSecondary[100],
          'safe-border': enhancedEmergencyColors.safeSecondary[300],
          restricted: enhancedEmergencyColors.cautionWarning[100],
          'restricted-border': enhancedEmergencyColors.cautionWarning[300],
          dangerous: enhancedEmergencyColors.emergencyDanger[100],
          'dangerous-border': enhancedEmergencyColors.emergencyDanger[300],
          monitoring: enhancedEmergencyColors.safePrimary[100],
          'monitoring-border': enhancedEmergencyColors.safePrimary[300],
        },
      },

      // ========================================================================
      // ENHANCED TYPOGRAPHY
      // ========================================================================
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
        emergency: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'], // Clear emergency text
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        // Emergency-specific sizes
        'emergency-title': ['2rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        'emergency-text': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '500' }],
        'status-text': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }],
      },

      // ========================================================================
      // ENHANCED SPACING & SIZING
      // ========================================================================
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '92': '23rem',
        '96': '24rem',
        '128': '32rem',
        // Emergency-specific spacing
        'emergency-padding': '1.5rem',
        'status-margin': '0.75rem',
        'alert-spacing': '1.25rem',
      },

      // ========================================================================
      // ENHANCED ANIMATIONS & TRANSITIONS
      // ========================================================================
      transitionDuration: {
        '50': '50ms',
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
        // Emergency-specific durations
        'emergency': '600ms',
        'urgent': '200ms',
        'smooth': '350ms',
      },
      
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'snappy': 'cubic-bezier(0.4, 0, 0.6, 1)',
        'gentle': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'energetic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'urgent': 'cubic-bezier(0.87, 0, 0.13, 1)',
        'critical': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },

      animation: {
        // Enhanced Tailwind animations
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-left': 'slideInLeft 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-up': 'slideInUp 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-down': 'slideInDown 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-out': 'scaleOut 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        
        // Emergency-specific animations
        'emergency-pulse': 'emergencyPulse 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
        'emergency-bounce': 'emergencyBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'status-fade': 'statusFade 0.4s ease-out',
        'alert-slide': 'alertSlide 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        
        // Loading animations
        'skeleton': 'skeleton 2s ease-in-out infinite',
        'skeleton-pulse': 'skeletonPulse 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
      },

      keyframes: {
        // Basic animations
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.8)', opacity: '0' },
        },
        
        // Emergency animations
        emergencyPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        emergencyBounce: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        statusFade: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        alertSlide: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        
        // Loading animations
        skeleton: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        skeletonPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },

      // ========================================================================
      // ENHANCED SHADOWS & EFFECTS
      // ========================================================================
      boxShadow: {
        // Standard shadows
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        
        // Emergency-specific shadows
        'emergency': '0 0 0 3px rgb(239 68 68 / 0.5), 0 4px 6px -1px rgb(239 68 68 / 0.1)',
        'success': '0 0 0 3px rgb(34 197 94 / 0.5), 0 4px 6px -1px rgb(34 197 94 / 0.1)',
        'warning': '0 0 0 3px rgb(245 158 11 / 0.5), 0 4px 6px -1px rgb(245 158 11 / 0.1)',
        'info': '0 0 0 3px rgb(59 130 246 / 0.5), 0 4px 6px -1px rgb(59 130 246 / 0.1)',
        
        // Interactive shadows
        'hover': '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
        'active': '0 2px 4px -1px rgb(0 0 0 / 0.2), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        
        // Glass morphism effect
        'glass': '0 8px 32px 0 rgb(31 38 135 / 0.37)',
      },

      // ========================================================================
      // ENHANCED BORDER RADIUS
      // ========================================================================
      borderRadius: {
        'xs': '0.125rem',
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        // Emergency-specific radius
        'emergency': '0.5rem',
        'status': '0.375rem',
        'button': '0.5rem',
      },

      // ========================================================================
      // ENHANCED BACKDROP BLUR
      // ========================================================================
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
      },

      // ========================================================================
      // Z-INDEX SCALE
      // ========================================================================
      zIndex: {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        // Emergency-specific z-index
        'emergency': '9999',
        'modal': '1000',
        'popover': '800',
        'dropdown': '600',
        'header': '400',
        'sidebar': '300',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom plugin for emergency utilities
    function({ addUtilities }: any) {
      const newUtilities = {
        // Emergency state utilities
        '.emergency-pulse': {
          animation: 'emergencyPulse 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
        },
        '.emergency-glow': {
          boxShadow: '0 0 20px rgb(239 68 68 / 0.5)',
        },
        '.success-glow': {
          boxShadow: '0 0 20px rgb(34 197 94 / 0.5)',
        },
        '.warning-glow': {
          boxShadow: '0 0 20px rgb(245 158 11 / 0.5)',
        },
        
        // Glass morphism utilities
        '.glass': {
          backdropFilter: 'blur(16px) saturate(180%)',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          border: '1px solid rgba(209, 213, 219, 0.3)',
        },
        '.glass-dark': {
          backdropFilter: 'blur(16px) saturate(180%)',
          backgroundColor: 'rgba(17, 24, 39, 0.75)',
          border: '1px solid rgba(75, 85, 99, 0.3)',
        },
        
        // Smooth transitions
        '.transition-smooth': {
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.transition-snappy': {
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.6, 1)',
        },
        
        // Accessibility utilities
        '.focus-visible-ring': {
          '&:focus-visible': {
            outline: '2px solid transparent',
            outlineOffset: '2px',
            boxShadow: '0 0 0 2px var(--ring)',
          },
        },
        
        // Emergency text utilities
        '.text-emergency': {
          color: 'rgb(239 68 68)',
          fontWeight: '600',
        },
        '.text-success': {
          color: 'rgb(34 197 94)',
          fontWeight: '600',
        },
        '.text-warning': {
          color: 'rgb(245 158 11)',
          fontWeight: '600',
        },
      };
      
      addUtilities(newUtilities);
    },
  ],
}

export default config;