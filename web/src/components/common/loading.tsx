/**
 * Smart Tourist Safety System - Loading Components
 * Comprehensive loading states, skeleton loaders, and progress indicators
 */

"use client";

import * as React from "react";
import { Loader2, MapPin, Users, AlertTriangle, TrendingUp, Shield, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// LOADING COMPONENT INTERFACES
// ============================================================================

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'white';
  className?: string;
}

interface SkeletonProps {
  className?: string;
  animate?: boolean;
  variant?: 'text' | 'circular' | 'rectangular';
}

interface ProgressBarProps {
  progress: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  label?: string;
}

// ============================================================================
// BASIC LOADING COMPONENTS
// ============================================================================

// Enhanced loading spinner with multiple sizes and colors
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    white: 'text-white'
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )} 
    />
  );
};

// Skeleton component for loading placeholders
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  animate = true,
  variant = 'rectangular'
}) => {
  const baseClasses = 'bg-gray-200';
  const animateClasses = animate ? 'animate-pulse' : '';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded'
  };

  return (
    <div 
      className={cn(
        baseClasses,
        animateClasses,
        variantClasses[variant],
        className
      )}
    />
  );
};

// Progress bar component
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = '',
  size = 'md',
  color = 'primary',
  showLabel = false,
  label
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">{label}</span>
          <span className="text-sm text-gray-600">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn('transition-all duration-300 ease-out rounded-full', colorClasses[color], sizeClasses[size])}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

// ============================================================================
// PAGE LOADING COMPONENTS
// ============================================================================

// Enhanced page loading component
export const PageLoading: React.FC<{
  message?: string;
  submessage?: string;
  icon?: React.ComponentType<{ className?: string }>;
  progress?: number;
  className?: string;
}> = ({ 
  message = 'Loading...', 
  submessage = 'Please wait a moment',
  icon: Icon = Shield,
  progress,
  className = ''
}) => (
  <div className={cn('min-h-screen bg-gray-50 flex items-center justify-center p-4', className)}>
    <div className="text-center max-w-md w-full">
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-blue-600" />
        </div>
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{message}</h2>
      <p className="text-gray-600 mb-4">{submessage}</p>
      
      {typeof progress === 'number' && (
        <ProgressBar 
          progress={progress} 
          showLabel 
          label="Loading progress"
          className="mb-4"
        />
      )}
      
      <div className="text-xs text-gray-400">
        Smart Tourist Safety System
      </div>
    </div>
  </div>
);

// Dashboard loading state
export const DashboardLoading: React.FC = () => (
  <PageLoading
    message="Loading Dashboard"
    submessage="Initializing emergency response system..."
    icon={Activity}
  />
);

// Emergency loading state
export const EmergencyLoading: React.FC<{ message?: string }> = ({ 
  message = "Processing Emergency Alert" 
}) => (
  <PageLoading
    message={message}
    submessage="Connecting to emergency services..."
    icon={AlertTriangle}
    className="bg-red-50"
  />
);

// ============================================================================
// SKELETON LOADERS
// ============================================================================

// Card skeleton loader with enhanced features
export const CardSkeleton: React.FC<{
  className?: string;
  showHeader?: boolean;
  showAvatar?: boolean;
  lines?: number;
  actions?: boolean;
}> = ({ 
  className = '', 
  showHeader = true, 
  showAvatar = false,
  lines = 3,
  actions = false
}) => (
  <div className={cn('bg-white rounded-lg border border-gray-200 p-6 space-y-4', className)}>
    {showHeader && (
      <div className="flex items-center space-x-3">
        {showAvatar && <Skeleton variant="circular" className="h-10 w-10" />}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    )}
    
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i}
          className={cn(
            'h-3',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )} 
        />
      ))}
    </div>
    
    {actions && (
      <div className="flex space-x-2 pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    )}
  </div>
);

// Enhanced table skeleton loader
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
  showActions?: boolean;
  showSearch?: boolean;
}> = ({ 
  rows = 5, 
  columns = 4, 
  showActions = false,
  showSearch = false
}) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    {/* Search bar skeleton */}
    {showSearch && (
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>
    )}

    {/* Table header */}
    <div className="bg-gray-50 border-b border-gray-200 p-4">
      <div className="grid gap-4" style={{ 
        gridTemplateColumns: `repeat(${columns + (showActions ? 1 : 0)}, 1fr)` 
      }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4" />
        ))}
        {showActions && <Skeleton className="h-4 w-16" />}
      </div>
    </div>

    {/* Table rows */}
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4 hover:bg-gray-50">
          <div className="grid gap-4" style={{ 
            gridTemplateColumns: `repeat(${columns + (showActions ? 1 : 0)}, 1fr)` 
          }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton 
                key={colIndex} 
                className={cn(
                  'h-4',
                  colIndex === 0 ? 'bg-gray-300' : 'bg-gray-200'
                )} 
              />
            ))}
            {showActions && (
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-6" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Dashboard statistics card skeleton
export const StatCardSkeleton: React.FC<{
  variant?: 'default' | 'trend' | 'icon';
}> = ({ variant = 'default' }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-5 w-24" />
      {variant === 'icon' && <Skeleton variant="circular" className="h-8 w-8" />}
    </div>
    
    <div className="space-y-2">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-32" />
      
      {variant === 'trend' && (
        <div className="flex items-center space-x-2 mt-3">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-3 w-16" />
        </div>
      )}
    </div>
  </div>
);

// Chart skeleton loader with multiple variants
export const ChartSkeleton: React.FC<{
  height?: string;
  type?: 'line' | 'bar' | 'pie' | 'area';
  className?: string;
}> = ({ 
  height = 'h-64', 
  type = 'line',
  className = '' 
}) => (
  <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
    <div className="flex items-center justify-between mb-4">
      <div>
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
    
    <div className={cn('bg-gray-100 rounded relative overflow-hidden', height)}>
      {/* Chart simulation based on type */}
      {type === 'line' && (
        <div className="absolute inset-4 flex items-end justify-between">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i}
              className="w-1 bg-gray-300 rounded-t animate-pulse"
              style={{ 
                height: `${Math.random() * 80 + 20}%`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}
      
      {type === 'bar' && (
        <div className="absolute inset-4 flex items-end space-x-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={i}
              className="flex-1 bg-gray-300 rounded-t animate-pulse"
              style={{ 
                height: `${Math.random() * 70 + 30}%`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}
      
      {type === 'pie' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 border-8 border-gray-300 border-t-gray-400 rounded-full animate-spin" />
        </div>
      )}
    </div>
  </div>
);

// ============================================================================
// SPECIALIZED LOADING COMPONENTS
// ============================================================================

// Tourist list skeleton with profile images
export const TouristListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" className="h-10 w-10" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-3 w-20" />
            <div className="flex space-x-1">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Alert list skeleton with priority indicators
export const AlertListSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => {
      const colors = ['border-red-400', 'border-yellow-400', 'border-blue-400'];
      const borderColor = colors[i % colors.length];
      
      return (
        <div key={i} className={cn('bg-white rounded-lg border-l-4 p-4', borderColor)}>
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              
              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center space-x-1">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="flex items-center space-x-1">
                  <Skeleton className="h-3 w-3" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

// Map skeleton with loading indicator
export const MapSkeleton: React.FC<{
  height?: string;
  showControls?: boolean;
}> = ({ 
  height = 'h-96',
  showControls = true
}) => (
  <div className={cn('bg-gray-200 rounded-lg relative overflow-hidden', height)}>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-bounce" />
        <p className="text-gray-500 text-sm">Loading map...</p>
        <div className="mt-2">
          <LoadingSpinner size="sm" color="secondary" />
        </div>
      </div>
    </div>
    
    {/* Map controls simulation */}
    {showControls && (
      <>
        <div className="absolute top-4 left-4 space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
        
        <div className="absolute top-4 right-4 space-y-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
        
        <div className="absolute bottom-4 left-4">
          <Skeleton className="h-6 w-32" />
        </div>
        
        <div className="absolute bottom-4 right-4">
          <Skeleton className="h-4 w-24" />
        </div>
      </>
    )}
    
    {/* Simulated map tiles */}
    <div className="absolute inset-0 grid grid-cols-4 gap-px opacity-30">
      {Array.from({ length: 16 }).map((_, i) => (
        <div 
          key={i}
          className="bg-gray-300 animate-pulse"
          style={{ animationDelay: `${i * 0.05}s` }}
        />
      ))}
    </div>
  </div>
);

// ============================================================================
// INTERACTIVE LOADING COMPONENTS
// ============================================================================

// Loading button with states
export const LoadingButton: React.FC<{
  loading?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}> = ({ 
  loading = false, 
  children, 
  disabled = false, 
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button'
}) => {
  const baseClasses = 'relative flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        loading && 'cursor-wait',
        className
      )}
    >
      {loading && <LoadingSpinner size="sm" color="white" />}
      <span className={loading ? 'opacity-70' : ''}>{children}</span>
    </button>
  );
};

// Content loading overlay
export const LoadingOverlay: React.FC<{
  show: boolean;
  message?: string;
  progress?: number;
  blur?: boolean;
  className?: string;
}> = ({ 
  show, 
  message = 'Loading...', 
  progress,
  blur = true,
  className = '' 
}) => {
  if (!show) return null;

  return (
    <div className={cn(
      'absolute inset-0 flex items-center justify-center z-50',
      blur ? 'bg-white/80 backdrop-blur-sm' : 'bg-white/90',
      className
    )}>
      <div className="text-center p-6 max-w-sm">
        <LoadingSpinner size="lg" className="mx-auto mb-3" />
        <p className="text-gray-600 font-medium mb-2">{message}</p>
        
        {typeof progress === 'number' && (
          <ProgressBar 
            progress={progress} 
            showLabel 
            size="sm"
            className="w-48"
          />
        )}
      </div>
    </div>
  );
};

// Inline loading for small components
export const InlineLoading: React.FC<{
  size?: 'xs' | 'sm' | 'md';
  text?: string;
  color?: 'primary' | 'secondary';
}> = ({ 
  size = 'sm', 
  text = 'Loading...',
  color = 'primary'
}) => (
  <div className="flex items-center gap-2 text-gray-600">
    <LoadingSpinner size={size} color={color} />
    <span className="text-sm">{text}</span>
  </div>
);

// Full dashboard loading state
export const DashboardLoadingState: React.FC = () => (
  <div className="space-y-6 p-6">
    {/* Header stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} variant={i % 2 === 0 ? 'icon' : 'trend'} />
      ))}
    </div>

    {/* Main content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart section */}
      <div className="lg:col-span-2 space-y-6">
        <ChartSkeleton type="line" />
        <TableSkeleton showSearch showActions />
      </div>
      
      {/* Side panel */}
      <div className="space-y-6">
        <ChartSkeleton type="pie" height="h-48" />
        <CardSkeleton showAvatar lines={4} actions />
        <AlertListSkeleton count={3} />
      </div>
    </div>
  </div>
);

// ============================================================================
// EXPORTS
// ============================================================================

export {
  type LoadingSpinnerProps,
  type SkeletonProps,
  type ProgressBarProps,
};
