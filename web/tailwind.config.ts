import { Config } from 'tailwindcss'
import { designTokens } from './src/lib/theme/design-tokens'

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
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          ...designTokens.colors.primary,
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          ...designTokens.colors.secondary,
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Neutral colors
        neutral: designTokens.colors.neutral,
        
        // Emergency service colors
        emergency: {
          critical: {
            DEFAULT: "hsl(var(--emergency-critical))",
            ...designTokens.colors.emergency.critical,
          },
          high: {
            DEFAULT: "hsl(var(--emergency-high))",
            ...designTokens.colors.emergency.high,
          },
          medium: {
            DEFAULT: "hsl(var(--emergency-medium))",
            ...designTokens.colors.emergency.medium,
          },
          low: {
            DEFAULT: "hsl(var(--emergency-low))",
            ...designTokens.colors.emergency.low,
          },
          resolved: {
            DEFAULT: "hsl(var(--emergency-resolved))",
            ...designTokens.colors.emergency.resolved,
          },
        },
        
        // Zone risk colors
        zone: {
          safe: {
            DEFAULT: "hsl(var(--zone-safe))",
            ...designTokens.colors.zones.safe,
          },
          lowRisk: {
            DEFAULT: "hsl(var(--zone-low-risk))",
            ...designTokens.colors.zones.lowRisk,
          },
          moderate: {
            DEFAULT: "hsl(var(--zone-moderate))",
            ...designTokens.colors.zones.moderate,
          },
          highRisk: {
            DEFAULT: "hsl(var(--zone-high-risk))",
            ...designTokens.colors.zones.highRisk,
          },
          restricted: {
            DEFAULT: "hsl(var(--zone-restricted))",
            ...designTokens.colors.zones.restricted,
          },
        },
        
        // Status colors
        status: {
          online: "hsl(var(--status-online))",
          offline: "hsl(var(--status-offline))",
          away: "hsl(var(--status-away))",
          busy: "hsl(var(--status-busy))",
          maintenance: "hsl(var(--status-maintenance))",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: designTokens.borderRadius.xs,
        xl: designTokens.borderRadius.xl,
        '2xl': designTokens.borderRadius['2xl'],
        '3xl': designTokens.borderRadius['3xl'],
        full: designTokens.borderRadius.full,
      },
      spacing: {
        ...designTokens.spacing,
      },
      fontSize: {
        ...Object.entries(designTokens.typography.fontSize).reduce((acc, [key, value]) => {
          acc[key] = [value.size, { lineHeight: value.lineHeight }];
          return acc;
        }, {} as Record<string, [string, { lineHeight: string }]>),
      },
      fontFamily: {
        sans: [...designTokens.typography.fontFamily.sans],
        mono: [...designTokens.typography.fontFamily.mono],
        display: [...designTokens.typography.fontFamily.display],
      },
      fontWeight: designTokens.typography.fontWeight,
      letterSpacing: designTokens.typography.letterSpacing,
      boxShadow: {
        xs: designTokens.shadows.xs,
        sm: designTokens.shadows.sm,
        md: designTokens.shadows.md,
        lg: designTokens.shadows.lg,
        xl: designTokens.shadows.xl,
        '2xl': designTokens.shadows['2xl'],
        inner: designTokens.shadows.inner,
        none: designTokens.shadows.none,
        emergency: designTokens.shadows.emergency,
        success: designTokens.shadows.success,
        warning: designTokens.shadows.warning,
        info: designTokens.shadows.info,
        'glow-sm': designTokens.shadows.glow.sm,
        'glow-md': designTokens.shadows.glow.md,
        'glow-lg': designTokens.shadows.glow.lg,
      },
      zIndex: {
        hide: '-1',
        auto: 'auto',
        base: '0',
        docked: '10',
        dropdown: '1000',
        sticky: '1100',
        banner: '1200',
        overlay: '1300',
        modal: '1400',
        popover: '1500',
        skipLink: '1600',
        toast: '1700',
        tooltip: '1800',
        emergency: '9999',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Emergency animations
        "pulse-emergency": {
          "0%, 100%": { 
            transform: "scale(1)",
            boxShadow: "0 0 0 0 hsl(var(--emergency-critical) / 0.7)"
          },
          "70%": { 
            transform: "scale(1.05)",
            boxShadow: "0 0 0 10px hsl(var(--emergency-critical) / 0)"
          },
        },
        "slide-alert": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        // Enhanced loading animations
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-left": {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-right": {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "scale-out": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
        // Shimmer effect
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        // Bounce effects
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        // Glow effects
        "glow": {
          "0%, 100%": { boxShadow: "0 0 5px hsl(var(--primary) / 0.5)" },
          "50%": { boxShadow: "0 0 20px hsl(var(--primary) / 0.8)" },
        },
        // Typewriter effect
        "typewriter": {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        // Gradient animation
        "gradient-x": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        "gradient-y": {
          "0%, 100%": { "background-position": "50% 0%" },
          "50%": { "background-position": "50% 100%" },
        },
        "gradient-xy": {
          "0%, 100%": { "background-position": "0% 0%" },
          "25%": { "background-position": "100% 0%" },
          "50%": { "background-position": "100% 100%" },
          "75%": { "background-position": "0% 100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-emergency": "pulse-emergency 2s infinite",
        "slide-alert": "slide-alert 0.3s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "slide-down": "slide-down 0.4s ease-out",
        "slide-left": "slide-left 0.4s ease-out",
        "slide-right": "slide-right 0.4s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "scale-out": "scale-out 0.3s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "bounce-in": "bounce-in 0.6s ease-out",
        "glow": "glow 2s ease-in-out infinite",
        "typewriter": "typewriter 3s steps(30) forwards",
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-y": "gradient-y 15s ease infinite",
        "gradient-xy": "gradient-xy 15s ease infinite",
      },
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'elastic': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
      },
      backgroundSize: {
        '300%': '300%',
      },
      // Component specific tokens
      height: {
        'button-sm': designTokens.components.button.height.sm,
        'button-md': designTokens.components.button.height.md,
        'button-lg': designTokens.components.button.height.lg,
        'button-xl': designTokens.components.button.height.xl,
        'input-sm': designTokens.components.input.height.sm,
        'input-md': designTokens.components.input.height.md,
        'input-lg': designTokens.components.input.height.lg,
      },
      minHeight: {
        'touch-target': designTokens.accessibility.minimumTouchTarget,
      },
      // Grid templates
      gridTemplateColumns: {
        'auto-fit-250': 'repeat(auto-fit, minmax(250px, 1fr))',
        'auto-fit-300': 'repeat(auto-fit, minmax(300px, 1fr))',
        'auto-fill-250': 'repeat(auto-fill, minmax(250px, 1fr))',
        'auto-fill-300': 'repeat(auto-fill, minmax(300px, 1fr))',
      },
      // Content utilities
      content: {
        'empty-string': '""',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom plugin for emergency styles
    function({ addUtilities, theme }: { addUtilities: any, theme: any }) {
      const emergencyUtilities = {
        '.emergency-border': {
          'border-width': '2px',
          'border-color': 'hsl(var(--emergency-critical))',
          'border-style': 'solid',
        },
        '.emergency-glow': {
          'box-shadow': '0 0 20px hsl(var(--emergency-critical) / 0.5)',
        },
        '.glass-morphism': {
          'backdrop-filter': 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
          'background': 'hsl(var(--background) / 0.8)',
          'border': '1px solid hsl(var(--border) / 0.2)',
        },
        '.smooth-transition': {
          'transition': 'all 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
        },
        '.hover-lift': {
          'transition': 'transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          '&:hover': {
            'transform': 'translateY(-2px)',
          },
        },
      };
      
      addUtilities(emergencyUtilities);
    },
    // Custom plugin for accessibility
    function({ addBase }: { addBase: any }) {
      addBase({
        '@media (prefers-reduced-motion: reduce)': {
          '*': {
            'animation-duration': '0.01ms !important',
            'animation-iteration-count': '1 !important',
            'transition-duration': '0.01ms !important',
          },
        },
      });
    },
  ],
}

export default config