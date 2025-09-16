import { Config } from 'tailwindcss'

// Enhanced design tokens with modern, accessible color system
const simpleTokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#0066ff', // Enhanced vibrant blue
      600: '#0052cc',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    emergency: {
      critical: {
        50: '#fef2f2',
        500: '#dc2626', // Enhanced critical red
        900: '#7f1d1d',
      },
      high: {
        50: '#fef3c7',
        500: '#d97706', // Enhanced warning orange
        900: '#78350f',
      },
      medium: {
        50: '#fef7cd',
        500: '#ca8a04', // Enhanced medium yellow
        900: '#713f12',
      },
      low: {
        50: '#f0f9ff',
        500: '#0284c7', // Enhanced info blue
        900: '#0c4a6e',
      },
      resolved: {
        50: '#f0fdf4',
        500: '#16a34a', // Enhanced success green
        900: '#14532d',
      },
    },
    zones: {
      safe: { 50: '#f0fdf4', 500: '#16a34a', 900: '#14532d' },
      lowRisk: { 50: '#f0f9ff', 500: '#0284c7', 900: '#0c4a6e' },
      moderate: { 50: '#fef3c7', 500: '#d97706', 900: '#78350f' },
      highRisk: { 50: '#fef2f2', 500: '#dc2626', 900: '#7f1d1d' },
      restricted: { 50: '#faf5ff', 500: '#9333ea', 900: '#581c87' },
    },
  },
  borderRadius: {
    xs: '0.125rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  spacing: {
    // Enhanced 8pt grid system
    '1.5': '0.375rem', // 6px
    '2.5': '0.625rem', // 10px
    '3.5': '0.875rem', // 14px
    '4.5': '1.125rem', // 18px
    '5.5': '1.375rem', // 22px
    '6.5': '1.625rem', // 26px
    '7.5': '1.875rem', // 30px
    '8.5': '2.125rem', // 34px
    '9.5': '2.375rem', // 38px
    '10.5': '2.625rem', // 42px
    '11.5': '2.875rem', // 46px
    '12.5': '3.125rem', // 50px
    '13': '3.25rem',   // 52px
    '15': '3.75rem',   // 60px
    '17': '4.25rem',   // 68px
    '18': '4.5rem',    // 72px
    '19': '4.75rem',   // 76px
    '21': '5.25rem',   // 84px
    '22': '5.5rem',    // 88px
    '25': '6.25rem',   // 100px
    '26': '6.5rem',    // 104px
    '30': '7.5rem',    // 120px
    '34': '8.5rem',    // 136px
    '88': '22rem',     // 352px - Dashboard widths
    '100': '25rem',    // 400px
    '112': '28rem',    // 448px
    '128': '32rem',    // 512px
    '144': '36rem',    // 576px
  },
  typography: {
    fontSize: {
      xs: { size: '0.75rem', lineHeight: '1rem' },
      sm: { size: '0.875rem', lineHeight: '1.25rem' },
      base: { size: '1rem', lineHeight: '1.5rem' },
      lg: { size: '1.125rem', lineHeight: '1.75rem' },
      xl: { size: '1.25rem', lineHeight: '1.75rem' },
      '2xl': { size: '1.5rem', lineHeight: '2rem' },
      '3xl': { size: '1.875rem', lineHeight: '2.25rem' },
      '4xl': { size: '2.25rem', lineHeight: '2.5rem' },
      '5xl': { size: '3rem', lineHeight: '1' },
      '6xl': { size: '3.75rem', lineHeight: '1' },
    },
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    fontWeight: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '900',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: '0 0 #0000',
    emergency: '0 0 0 1px rgb(239 68 68 / 0.5)',
    success: '0 0 0 1px rgb(34 197 94 / 0.5)',
    warning: '0 0 0 1px rgb(245 158 11 / 0.5)',
    info: '0 0 0 1px rgb(14 165 233 / 0.5)',
    glow: {
      sm: '0 0 10px rgb(59 130 246 / 0.5)',
      md: '0 0 20px rgb(59 130 246 / 0.5)',
      lg: '0 0 30px rgb(59 130 246 / 0.5)',
    },
  },
  components: {
    button: {
      height: {
        sm: '2rem',
        md: '2.5rem',
        lg: '3rem',
        xl: '3.5rem',
      },
    },
    input: {
      height: {
        sm: '2rem',
        md: '2.5rem',
        lg: '3rem',
      },
    },
  },
  accessibility: {
    minimumTouchTarget: '44px',
  },
};

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
          ...simpleTokens.colors.primary,
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          ...simpleTokens.colors.secondary,
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
        neutral: simpleTokens.colors.neutral,
        
        // Emergency service colors
        emergency: {
          critical: {
            DEFAULT: "hsl(var(--emergency-critical))",
            ...simpleTokens.colors.emergency.critical,
          },
          high: {
            DEFAULT: "hsl(var(--emergency-high))",
            ...simpleTokens.colors.emergency.high,
          },
          medium: {
            DEFAULT: "hsl(var(--emergency-medium))",
            ...simpleTokens.colors.emergency.medium,
          },
          low: {
            DEFAULT: "hsl(var(--emergency-low))",
            ...simpleTokens.colors.emergency.low,
          },
          resolved: {
            DEFAULT: "hsl(var(--emergency-resolved))",
            ...simpleTokens.colors.emergency.resolved,
          },
        },
        
        // Zone risk colors
        zone: {
          safe: {
            DEFAULT: "hsl(var(--zone-safe))",
            ...simpleTokens.colors.zones.safe,
          },
          lowRisk: {
            DEFAULT: "hsl(var(--zone-low-risk))",
            ...simpleTokens.colors.zones.lowRisk,
          },
          moderate: {
            DEFAULT: "hsl(var(--zone-moderate))",
            ...simpleTokens.colors.zones.moderate,
          },
          highRisk: {
            DEFAULT: "hsl(var(--zone-high-risk))",
            ...simpleTokens.colors.zones.highRisk,
          },
          restricted: {
            DEFAULT: "hsl(var(--zone-restricted))",
            ...simpleTokens.colors.zones.restricted,
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
        xs: simpleTokens.borderRadius.xs,
        xl: simpleTokens.borderRadius.xl,
        '2xl': simpleTokens.borderRadius['2xl'],
        '3xl': simpleTokens.borderRadius['3xl'],
        full: simpleTokens.borderRadius.full,
      },
      spacing: {
        ...simpleTokens.spacing,
        // Dashboard-specific spacing
        'sidebar': '20rem',
        'sidebar-collapsed': '4rem', 
        'header': '4rem',
        'content-padding': '1.5rem',
        // Card and component spacing
        'card-padding': '1.5rem',
        'card-gap': '1rem',
        'section-gap': '3rem',
        // Form spacing
        'form-gap': '1rem',
        'field-gap': '0.5rem',
      },
      fontSize: {
        ...Object.entries(simpleTokens.typography.fontSize).reduce((acc, [key, value]) => {
          acc[key] = [value.size, { lineHeight: value.lineHeight }];
          return acc;
        }, {} as Record<string, [string, { lineHeight: string }]>),
      },
      fontFamily: {
        sans: [...simpleTokens.typography.fontFamily.sans],
        mono: [...simpleTokens.typography.fontFamily.mono],
        display: [...simpleTokens.typography.fontFamily.display],
      },
      fontWeight: simpleTokens.typography.fontWeight,
      letterSpacing: simpleTokens.typography.letterSpacing,
      boxShadow: {
        xs: simpleTokens.shadows.xs,
        sm: simpleTokens.shadows.sm,
        md: simpleTokens.shadows.md,
        lg: simpleTokens.shadows.lg,
        xl: simpleTokens.shadows.xl,
        '2xl': simpleTokens.shadows['2xl'],
        inner: simpleTokens.shadows.inner,
        none: simpleTokens.shadows.none,
        emergency: simpleTokens.shadows.emergency,
        success: simpleTokens.shadows.success,
        warning: simpleTokens.shadows.warning,
        info: simpleTokens.shadows.info,
        'glow-sm': simpleTokens.shadows.glow.sm,
        'glow-md': simpleTokens.shadows.glow.md,
        'glow-lg': simpleTokens.shadows.glow.lg,
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
        'button-sm': simpleTokens.components.button.height.sm,
        'button-md': simpleTokens.components.button.height.md,
        'button-lg': simpleTokens.components.button.height.lg,
        'button-xl': simpleTokens.components.button.height.xl,
        'input-sm': simpleTokens.components.input.height.sm,
        'input-md': simpleTokens.components.input.height.md,
        'input-lg': simpleTokens.components.input.height.lg,
      },
      minHeight: {
        'touch-target': simpleTokens.accessibility.minimumTouchTarget,
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