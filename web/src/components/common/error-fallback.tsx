'use client';

import React from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  ArrowLeft,
  Bug,
  Shield,
  Wifi,
  Server,
  Database,
  MapPin,
  Users,
  Clock,
  Info,
  ExternalLink,
  Copy,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Base Error Fallback Props
interface BaseErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  className?: string;
}

// Simple Error Fallback
export const SimpleErrorFallback: React.FC<BaseErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  className
}) => (
  <div className={cn('text-center py-8', className)}>
    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Something went wrong
    </h3>
    <p className="text-gray-600 mb-4">
      {error?.message || 'An unexpected error occurred. Please try again.'}
    </p>
    {resetErrorBoundary && (
      <button
        onClick={resetErrorBoundary}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    )}
  </div>
);

// Detailed Error Fallback with Error Info
interface DetailedErrorFallbackProps extends BaseErrorFallbackProps {
  showDetails?: boolean;
  onGoHome?: () => void;
  onGoBack?: () => void;
  supportEmail?: string;
}

export const DetailedErrorFallback: React.FC<DetailedErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  showDetails = false,
  onGoHome,
  onGoBack,
  supportEmail,
  className
}) => {
  const [showErrorDetails, setShowErrorDetails] = React.useState(showDetails);
  const [copied, setCopied] = React.useState(false);

  const copyErrorDetails = async () => {
    const errorDetails = `
Error: ${error?.message || 'Unknown error'}
Stack: ${error?.stack || 'No stack trace available'}
Time: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  return (
    <div className={cn('max-w-2xl mx-auto text-center py-12 px-6', className)}>
      <div className="bg-red-50 border border-red-200 rounded-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Oops! Something went wrong
        </h2>

        <p className="text-gray-600 mb-6">
          We're sorry, but an unexpected error has occurred. Our team has been notified and is working to fix this issue.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          )}
          
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          )}
          
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              Go Home
            </button>
          )}
        </div>

        {/* Error Details Toggle */}
        <div className="border-t border-red-200 pt-6">
          <button
            onClick={() => setShowErrorDetails(!showErrorDetails)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            {showErrorDetails ? 'Hide' : 'Show'} Technical Details
          </button>

          {showErrorDetails && (
            <div className="mt-4 p-4 bg-red-100 rounded-lg text-left">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-red-900">Error Details</h4>
                <button
                  onClick={copyErrorDetails}
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="text-xs text-red-800 bg-red-50 p-3 rounded border overflow-auto">
                {error?.message || 'Unknown error'}
                {error?.stack && (
                  <>
                    {'\n\nStack Trace:\n'}
                    {error.stack}
                  </>
                )}
              </pre>
            </div>
          )}
        </div>

        {/* Support Contact */}
        {supportEmail && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Need help? Contact our support team at{' '}
              <a 
                href={`mailto:${supportEmail}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {supportEmail}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Network Error Fallback
interface NetworkErrorFallbackProps extends BaseErrorFallbackProps {
  onRetry?: () => void;
}

export const NetworkErrorFallback: React.FC<NetworkErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  onRetry,
  className
}) => (
  <div className={cn('text-center py-12', className)}>
    <div className="max-w-md mx-auto">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
        <Wifi className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Connection Problem
        </h3>
        <p className="text-gray-600 mb-6">
          Unable to connect to our servers. Please check your internet connection and try again.
        </p>
        <div className="space-y-3">
          <button
            onClick={onRetry || resetErrorBoundary}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </button>
          <p className="text-xs text-gray-500">
            If the problem persists, please check your network settings or contact support.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Server Error Fallback
export const ServerErrorFallback: React.FC<BaseErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  className
}) => (
  <div className={cn('text-center py-12', className)}>
    <div className="max-w-md mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8">
        <Server className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Server Error
        </h3>
        <p className="text-gray-600 mb-6">
          Our servers are experiencing issues. We're working to resolve this as quickly as possible.
        </p>
        <div className="space-y-3">
          <button
            onClick={resetErrorBoundary}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <p className="text-xs text-gray-500">
            Error ID: {Date.now().toString(36)} | Time: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Data Error Fallback
interface DataErrorFallbackProps extends BaseErrorFallbackProps {
  dataType?: string;
  onRefresh?: () => void;
}

export const DataErrorFallback: React.FC<DataErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  dataType = 'data',
  onRefresh,
  className
}) => (
  <div className={cn('text-center py-8', className)}>
    <Database className="h-10 w-10 text-orange-500 mx-auto mb-3" />
    <h4 className="text-base font-medium text-gray-900 mb-2">
      Failed to Load {dataType}
    </h4>
    <p className="text-sm text-gray-600 mb-4">
      {error?.message || `There was a problem loading the ${dataType.toLowerCase()}.`}
    </p>
    <button
      onClick={onRefresh || resetErrorBoundary}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
    >
      <RefreshCw className="h-3 w-3" />
      Reload {dataType}
    </button>
  </div>
);

// Authentication Error Fallback
interface AuthErrorFallbackProps extends BaseErrorFallbackProps {
  onLogin?: () => void;
}

export const AuthErrorFallback: React.FC<AuthErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  onLogin,
  className
}) => (
  <div className={cn('text-center py-12', className)}>
    <div className="max-w-md mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
        <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Authentication Required
        </h3>
        <p className="text-gray-600 mb-6">
          Your session has expired or you don't have permission to access this resource.
        </p>
        <div className="space-y-3">
          <button
            onClick={onLogin}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Shield className="h-4 w-4" />
            Sign In
          </button>
          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Context-Specific Error Fallbacks
export const TouristErrorFallback: React.FC<BaseErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  className
}) => (
  <div className={cn('text-center py-8', className)}>
    <Users className="h-10 w-10 text-blue-500 mx-auto mb-3" />
    <h4 className="text-base font-medium text-gray-900 mb-2">
      Tourist Data Error
    </h4>
    <p className="text-sm text-gray-600 mb-4">
      Unable to load tourist information. This might be a temporary issue.
    </p>
    <button
      onClick={resetErrorBoundary}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      <RefreshCw className="h-3 w-3" />
      Reload Data
    </button>
  </div>
);

export const MapErrorFallback: React.FC<BaseErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  className
}) => (
  <div className={cn('text-center py-12 bg-gray-100 rounded-lg', className)}>
    <MapPin className="h-12 w-12 text-green-500 mx-auto mb-4" />
    <h4 className="text-lg font-medium text-gray-900 mb-2">
      Map Loading Error
    </h4>
    <p className="text-sm text-gray-600 mb-4">
      The map failed to load. This could be due to network issues or map service unavailability.
    </p>
    <button
      onClick={resetErrorBoundary}
      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
    >
      <RefreshCw className="h-4 w-4" />
      Reload Map
    </button>
  </div>
);

export const AlertErrorFallback: React.FC<BaseErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  className
}) => (
  <div className={cn('text-center py-8 bg-red-50 border border-red-200 rounded-lg', className)}>
    <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
    <h4 className="text-base font-medium text-gray-900 mb-2">
      Alert System Error
    </h4>
    <p className="text-sm text-gray-600 mb-4">
      There was an issue with the alert system. Please try refreshing or contact support.
    </p>
    <button
      onClick={resetErrorBoundary}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
    >
      <RefreshCw className="h-3 w-3" />
      Retry
    </button>
  </div>
);

// Form Error Fallback
interface FormErrorFallbackProps extends BaseErrorFallbackProps {
  formName?: string;
  onClearForm?: () => void;
}

export const FormErrorFallback: React.FC<FormErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  formName = 'form',
  onClearForm,
  className
}) => (
  <div className={cn('text-center py-8 bg-yellow-50 border border-yellow-200 rounded-lg', className)}>
    <Bug className="h-10 w-10 text-yellow-600 mx-auto mb-3" />
    <h4 className="text-base font-medium text-gray-900 mb-2">
      Form Error
    </h4>
    <p className="text-sm text-gray-600 mb-4">
      There was an issue processing the {formName}. Your data may not have been saved.
    </p>
    <div className="flex justify-center gap-3">
      <button
        onClick={resetErrorBoundary}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
      >
        <RefreshCw className="h-3 w-3" />
        Try Again
      </button>
      {onClearForm && (
        <button
          onClick={onClearForm}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-yellow-600 text-yellow-600 rounded hover:bg-yellow-50 transition-colors"
        >
          <XCircle className="h-3 w-3" />
          Clear Form
        </button>
      )}
    </div>
  </div>
);

// Timeout Error Fallback
export const TimeoutErrorFallback: React.FC<BaseErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  className
}) => (
  <div className={cn('text-center py-8', className)}>
    <Clock className="h-10 w-10 text-purple-500 mx-auto mb-3" />
    <h4 className="text-base font-medium text-gray-900 mb-2">
      Request Timeout
    </h4>
    <p className="text-sm text-gray-600 mb-4">
      The request took too long to complete. This might be due to slow internet or server issues.
    </p>
    <button
      onClick={resetErrorBoundary}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
    >
      <RefreshCw className="h-3 w-3" />
      Try Again
    </button>
  </div>
);

// Generic Error Boundary Wrapper
interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<BaseErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({
  children,
  fallback: Fallback = SimpleErrorFallback,
  onError
}) => {
  return (
    <ErrorBoundary
      FallbackComponent={Fallback}
      onError={onError}
    >
      {children}
    </ErrorBoundary>
  );
};

// Error Boundary Component (needs to be a class component)
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    FallbackComponent: React.ComponentType<BaseErrorFallbackProps>;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <this.props.FallbackComponent
          error={this.state.error}
          resetErrorBoundary={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

// Export all error fallback components
export default {
  SimpleErrorFallback,
  DetailedErrorFallback,
  NetworkErrorFallback,
  ServerErrorFallback,
  DataErrorFallback,
  AuthErrorFallback,
  TouristErrorFallback,
  MapErrorFallback,
  AlertErrorFallback,
  FormErrorFallback,
  TimeoutErrorFallback,
  ErrorBoundaryWrapper,
};