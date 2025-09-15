/**
 * Smart Tourist Safety System - Root Layout
 * Main application layout with providers, metadata, and global configurations
 */

import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { PageTransition } from "@/components/transitions/page-transition";
import { APP_CONFIG } from "@/lib/constants";
import { getThemeScript } from "@/lib/theme/unified-theme-system";

// Font configurations
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// Application metadata
export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.name,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
  keywords: [
    "tourist safety",
    "emergency response", 
    "location tracking",
    "blockchain identity",
    "incident management",
    "real-time monitoring",
    "safety zones",
    "geofencing",
    "emergency alerts",
    "tourism security",
    "Smart India Hackathon",
    "SIH 2025"
  ],
  authors: [
    { 
      name: APP_CONFIG.author,
      url: "https://www.incredibleindia.org"
    }
  ],
  creator: APP_CONFIG.author,
  publisher: "Ministry of Tourism, Government of India",
  category: "Emergency Response System",
  classification: "Government Safety Application",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: APP_CONFIG.name,
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Smart Tourist Safety System Dashboard",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    images: ["/images/twitter-image.jpg"],
    creator: "@IncredibleIndia",
  },
  robots: {
    index: false, // Government internal application
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#3b82f6",
      },
    ],
  },
  manifest: "/manifest.json",
  other: {
    "msapplication-TileColor": "#3b82f6",
    "theme-color": "#ffffff",
  },
};

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  colorScheme: "light dark",
};

// Root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Emergency contact information for browser */}
        <meta name="emergency-contact" content={APP_CONFIG.emergencyNumber} />
        <meta name="helpline-tourist" content={APP_CONFIG.touristHelpline} />
        
        {/* Application information */}
        <meta name="application-name" content={APP_CONFIG.name} />
        <meta name="version" content={APP_CONFIG.version} />
        <meta name="build-time" content={new Date().toISOString()} />
        
        {/* Performance hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//api.openweathermap.org" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Theme script for FOIT prevention */}
        <script dangerouslySetInnerHTML={{ __html: getThemeScript() }} />
      </head>
      
      <body
        className={`
          font-sans antialiased min-h-screen bg-background text-foreground
          selection:bg-blue-100 selection:text-blue-900
          scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300
          focus-within:scrollbar-thumb-blue-500
        `}
        suppressHydrationWarning
      >
        {/* Skip navigation for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Skip to main content
        </a>
        
        {/* Emergency alert banner (hidden by default, shown during emergencies) */}
        <div 
          id="emergency-banner" 
          className="hidden bg-red-600 text-white px-4 py-2 text-center text-sm font-medium"
          role="alert"
          aria-live="assertive"
        >
          <span id="emergency-message">Emergency alert will appear here</span>
        </div>
        
        {/* Main application providers and content */}
        <Providers>
          <div id="portal-root" />
          
          <main id="main-content">
            <PageTransition 
              transitionType="auto"
              className="min-h-screen"
            >
              {children}
            </PageTransition>
          </main>
        </Providers>
        
        {/* Accessibility improvements */}
        <div aria-live="polite" aria-atomic="true" className="sr-only" id="announcements" />
        <div aria-live="assertive" aria-atomic="true" className="sr-only" id="emergency-announcements" />
        
        {/* Performance monitoring */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Basic performance monitoring
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  const loadTime = performance.now();
                  // Performance tracking for development
                  
                  // Report to analytics if available
                  if (window.gtag) {
                    window.gtag('event', 'page_load_time', {
                      value: Math.round(loadTime),
                      custom_parameter: 'load_time_ms'
                    });
                  }
                });
                
                // Monitor Core Web Vitals
                const observer = new PerformanceObserver((list) => {
                  for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                      // FCP tracking for development
                    }
                  }
                });
                
                try {
                  observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
                } catch (e) {
                  // Ignore if not supported
                }
              }
            `,
          }}
        />
      </body>
    </html>
  );
}