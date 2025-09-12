'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Loader2, 
  AlertTriangle, 
  Shield, 
  MapPin, 
  Users, 
  Zap,
  RefreshCw,
  Clock,
  Upload,
  Download,
  CheckCircle,
  Circle
} from 'lucide-react';

// Base Spinner Component
interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray' | 'white';
  className?: string;
}

const sizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const colorClasses = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  red: 'text-red-600',
  yellow: 'text-yellow-600',
  purple: 'text-purple-600',
  gray: 'text-gray-600',
  white: 'text-white',
};

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  color = 'blue', 
  className 
}) => (
  <Loader2 
    className={cn(
      'animate-spin',
      sizeClasses[size],
      colorClasses[color],
      className
    )} 
  />
);

// Loading Button with Spinner
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingText,
  children,
  disabled,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600',
    success: 'bg-green-600 hover:bg-green-700 text-white border-green-600',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      disabled={loading || disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading && <Spinner size="sm" color="white" />}
      {loading ? (loadingText || 'Loading...') : children}
    </button>
  );
};

// Page Loading Overlay
interface PageLoadingProps {
  message?: string;
  submessage?: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  message = 'Loading...',
  submessage,
  icon: Icon = Loader2,
  color = 'blue',
}) => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className={`mx-auto ${colorClasses[color]}`}>
        <Icon className="h-12 w-12 animate-spin mx-auto" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{message}</h3>
        {submessage && (
          <p className="text-sm text-gray-600 mt-1">{submessage}</p>
        )}
      </div>
    </div>
  </div>
);

// Card Loading Skeleton
interface LoadingCardProps {
  count?: number;
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ 
  count = 1, 
  className 
}) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={cn(
          'bg-white rounded-lg border border-gray-200 p-6 animate-pulse',
          className
        )}
      >
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    ))}
  </>
);

// Table Loading Skeleton
interface LoadingTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const LoadingTable: React.FC<LoadingTableProps> = ({
  rows = 5,
  columns = 4,
  className
}) => (
  <div className={cn('bg-white rounded-lg border border-gray-200 overflow-hidden', className)}>
    <div className="animate-pulse">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Form Loading Skeleton
export const LoadingForm: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-white rounded-lg border border-gray-200 p-6 animate-pulse space-y-6', className)}>
    {/* Form Fields */}
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    ))}
    
    {/* Buttons */}
    <div className="flex justify-end space-x-3 pt-4">
      <div className="h-10 bg-gray-200 rounded w-20"></div>
      <div className="h-10 bg-gray-200 rounded w-24"></div>
    </div>
  </div>
);

// Contextual Loading Spinners for Different Scenarios
export const TouristLoadingSpinner: React.FC<{ message?: string }> = ({ 
  message = 'Loading tourist data...' 
}) => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center space-y-3">
      <Users className="h-8 w-8 text-blue-600 animate-pulse mx-auto" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

export const AlertLoadingSpinner: React.FC<{ message?: string }> = ({ 
  message = 'Processing alert...' 
}) => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center space-y-3">
      <AlertTriangle className="h-8 w-8 text-red-600 animate-pulse mx-auto" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

export const MapLoadingSpinner: React.FC<{ message?: string }> = ({ 
  message = 'Loading map data...' 
}) => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center space-y-3">
      <MapPin className="h-8 w-8 text-green-600 animate-pulse mx-auto" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

export const SafetyLoadingSpinner: React.FC<{ message?: string }> = ({ 
  message = 'Checking safety status...' 
}) => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center space-y-3">
      <Shield className="h-8 w-8 text-blue-600 animate-pulse mx-auto" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

export const EmergencyLoadingSpinner: React.FC<{ message?: string }> = ({ 
  message = 'Activating emergency protocols...' 
}) => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center space-y-3">
      <Zap className="h-8 w-8 text-red-600 animate-bounce mx-auto" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  </div>
);

// Upload Progress Spinner
interface UploadProgressProps {
  progress?: number;
  message?: string;
  fileName?: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  progress = 0,
  message = 'Uploading...',
  fileName
}) => (
  <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <Upload className="h-5 w-5 text-blue-600 animate-pulse" />
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-blue-900">
          {fileName || message}
        </span>
        <span className="text-xs text-blue-700">{progress}%</span>
      </div>
      <div className="w-full bg-blue-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  </div>
);

// Refresh Indicator
interface RefreshIndicatorProps {
  message?: string;
  onRetry?: () => void;
}

export const RefreshIndicator: React.FC<RefreshIndicatorProps> = ({
  message = 'Refreshing data...',
  onRetry
}) => (
  <div className="flex items-center justify-center py-6">
    <div className="text-center space-y-3">
      <RefreshCw className="h-6 w-6 text-blue-600 animate-spin mx-auto" />
      <p className="text-gray-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Retry
        </button>
      )}
    </div>
  </div>
);

// Inline Loading States
export const InlineLoading: React.FC<{ 
  size?: 'xs' | 'sm' | 'md';
  message?: string;
  className?: string;
}> = ({ 
  size = 'sm', 
  message,
  className 
}) => (
  <span className={cn('inline-flex items-center gap-2', className)}>
    <Spinner size={size} />
    {message && <span className="text-gray-600">{message}</span>}
  </span>
);

// Loading States for Different Data Types
export const LoadingStates = {
  // Data Loading
  dataLoading: (message = 'Loading data...') => (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4">
        <Spinner size="lg" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  ),

  // Saving State
  saving: (message = 'Saving changes...') => (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-yellow-600 animate-pulse" />
      <span className="text-yellow-700">{message}</span>
    </div>
  ),

  // Success State
  success: (message = 'Saved successfully!') => (
    <div className="flex items-center gap-2">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <span className="text-green-700">{message}</span>
    </div>
  ),

  // Processing State
  processing: (message = 'Processing...') => (
    <div className="flex items-center gap-2">
      <Spinner size="sm" color="purple" />
      <span className="text-purple-700">{message}</span>
    </div>
  ),

  // Connecting State
  connecting: (message = 'Connecting...') => (
    <div className="flex items-center gap-2">
      <Circle className="h-4 w-4 text-blue-600 animate-ping" />
      <span className="text-blue-700">{message}</span>
    </div>
  ),
};

// Full Page Loading with Backdrop
interface FullPageLoadingProps {
  message?: string;
  submessage?: string;
  variant?: 'default' | 'emergency' | 'processing';
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({
  message = 'Loading...',
  submessage,
  variant = 'default'
}) => {
  const variants = {
    default: {
      bgColor: 'bg-white/90',
      iconColor: 'text-blue-600',
      icon: Loader2,
    },
    emergency: {
      bgColor: 'bg-red-50/95',
      iconColor: 'text-red-600',
      icon: AlertTriangle,
    },
    processing: {
      bgColor: 'bg-purple-50/95',
      iconColor: 'text-purple-600',
      icon: RefreshCw,
    },
  };

  const { bgColor, iconColor, icon: Icon } = variants[variant];

  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm', bgColor)}>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full mx-4">
        <div className="text-center space-y-4">
          <Icon className={cn('h-12 w-12 mx-auto animate-spin', iconColor)} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{message}</h3>
            {submessage && (
              <p className="text-sm text-gray-600 mt-2">{submessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  Spinner,
  LoadingButton,
  PageLoading,
  LoadingCard,
  LoadingTable,
  LoadingForm,
  TouristLoadingSpinner,
  AlertLoadingSpinner,
  MapLoadingSpinner,
  SafetyLoadingSpinner,
  EmergencyLoadingSpinner,
  UploadProgress,
  RefreshIndicator,
  InlineLoading,
  LoadingStates,
  FullPageLoading,
};