/**
 * Smart Tourist Safety System - Application Providers
 * Comprehensive provider setup for theme, auth, store, and global state management
 */

"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as EnhancedThemeProvider } from "@/lib/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ENV } from "@/lib/constants";

// ============================================================================
// PROVIDERS INTERFACES
// ============================================================================

interface ProvidersProps {
  children: React.ReactNode;
}

// ============================================================================
// ERROR FALLBACK COMPONENT
// ============================================================================

function AppErrorFallback({ error, resetErrorBoundary }: {
  error: Error;
  resetErrorBoundary?: () => void;
}) {
  React.useEffect(() => {
    // Log error to monitoring service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Application Error
        </h2>
        
        <p className="text-gray-600 mb-6">
          Something went wrong while loading the Smart Tourist Safety System. 
          Please try refreshing the page or contact technical support.
        </p>
        
        {ENV.isDevelopment && (
          <details className="mb-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 mb-2">
              Error Details (Development Only)
            </summary>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-32">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
        
        <div className="space-y-3">
          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Refresh Page
          </button>
          
          <div className="text-xs text-gray-500 pt-2 border-t">
            Emergency Contact: 112 | Tourist Helpline: 1363
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ERROR BOUNDARY
// ============================================================================

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <AppErrorFallback 
          error={this.state.error!} 
          resetErrorBoundary={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// THEME PROVIDER WRAPPER
// ============================================================================

function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <EnhancedThemeProvider
      defaultTheme="system"
      storageKey="smart-tourist-theme"
      enableSystem
      disableTransitionOnChange={false}
      attribute="class"
    >
      {children}
    </EnhancedThemeProvider>
  );
}

// ============================================================================
// AUTH PROVIDER WRAPPER
// ============================================================================

function AppAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={15 * 60} // 15 minutes
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
}

// ============================================================================
// TOAST PROVIDER WRAPPER
// ============================================================================

function AppToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}

// ============================================================================
// ACCESSIBILITY PROVIDER
// ============================================================================

function AppAccessibilityProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Announce page changes for screen readers
    const announcePageChange = () => {
      const announcement = document.getElementById('announcements');
      if (announcement) {
        announcement.textContent = `Page loaded: ${document.title}`;
        setTimeout(() => {
          announcement.textContent = '';
        }, 1000);
      }
    };

    // Listen for route changes
    announcePageChange();

    // Keyboard navigation improvements
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + M: Focus main content
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
        }
      }

      // Alt + N: Focus navigation
      if (event.altKey && event.key === 'n') {
        event.preventDefault();
        const navigation = document.querySelector('[role="navigation"]') as HTMLElement;
        if (navigation) {
          navigation.focus();
        }
      }

      // Alt + S: Focus search
      if (event.altKey && event.key === 's') {
        event.preventDefault();
        const search = document.querySelector('input[type="search"]') as HTMLElement;
        if (search) {
          search.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return <>{children}</>;
}

// ============================================================================
// MAIN PROVIDERS COMPONENT
// ============================================================================

export function Providers({ children }: ProvidersProps) {
  // Development mode indicators
  React.useEffect(() => {
    if (ENV.isDevelopment) {
      console.log('🏗️ Smart Tourist Safety System - Development Mode');
      console.log('🎨 Theme switching enabled');
      console.log('🔐 Authentication provider active');
    }
  }, []);

  return (
    <ErrorBoundary>
      <AppAccessibilityProvider>
        <AppThemeProvider>
          <AppAuthProvider>
            <AppToastProvider>
              {children}
            </AppToastProvider>
          </AppAuthProvider>
        </AppThemeProvider>
      </AppAccessibilityProvider>
    </ErrorBoundary>
  );
}

// ============================================================================
// PROVIDER UTILITIES
// ============================================================================

// Hook to check if providers are properly initialized
export function useProvidersStatus() {
  const [status, setStatus] = React.useState({
    theme: false,
    auth: false,
    ready: false,
  });

  React.useEffect(() => {
    // Check if all providers are ready
    const checkProviders = () => {
      const theme = document.documentElement.hasAttribute('data-theme') || 
                   document.documentElement.classList.contains('light') ||
                   document.documentElement.classList.contains('dark');
      
      setStatus({
        theme,
        auth: true, // Always true for now
        ready: theme,
      });
    };

    checkProviders();
    
    // Recheck after a short delay
    const timer = setTimeout(checkProviders, 100);
    return () => clearTimeout(timer);
  }, []);

  return status;
}

// Hook for emergency announcements
export function useEmergencyAnnouncements() {
  const announce = React.useCallback((message: string, priority: 'polite' | 'assertive' = 'assertive') => {
    const element = document.getElementById(priority === 'assertive' ? 'emergency-announcements' : 'announcements');
    if (element) {
      element.textContent = message;
      setTimeout(() => {
        element.textContent = '';
      }, 5000);
    }
  }, []);

  return { announce };
}

export default Providers;
