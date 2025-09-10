'use client';

import React from 'react';
import { Loader2, MapPin, Users, AlertTriangle, TrendingUp } from 'lucide-react';

// Basic loading spinner
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 
      className={`animate-spin text-blue-600 ${sizeClasses[size]} ${className}`} 
    />
  );
};

// Page loading component
export const PageLoading: React.FC<{
  message?: string;
}> = ({ message = 'Loading...' }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="lg" className="mx-auto mb-4" />
      <p className="text-gray-600 font-medium">{message}</p>
      <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
    </div>
  </div>
);

// Card skeleton loader
export const CardSkeleton: React.FC<{
  className?: string;
  showHeader?: boolean;
  lines?: number;
}> = ({ className = '', showHeader = true, lines = 3 }) => (
  <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
    {showHeader && (
      <div className="mb-4">
        <div className="h-5 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
      </div>
    )}
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          className={`h-3 bg-gray-200 rounded animate-pulse ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`} 
        />
      ))}
    </div>
  </div>
);

// Table skeleton loader
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
}> = ({ rows = 5, columns = 4 }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    {/* Table header */}
    <div className="bg-gray-50 border-b border-gray-200 p-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>

    {/* Table rows */}
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div 
                key={colIndex} 
                className={`h-4 bg-gray-200 rounded animate-pulse ${
                  colIndex === 0 ? 'bg-gray-300' : ''
                }`} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Dashboard stat card skeleton
export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="h-5 bg-gray-200 rounded animate-pulse w-24" />
      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
    </div>
    <div className="space-y-2">
      <div className="h-8 bg-gray-300 rounded animate-pulse w-20" />
      <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
    </div>
  </div>
);

// Chart skeleton loader
export const ChartSkeleton: React.FC<{
  height?: string;
  className?: string;
}> = ({ height = 'h-64', className = '' }) => (
  <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
    <div className="mb-4">
      <div className="h-5 bg-gray-200 rounded animate-pulse w-32 mb-2" />
      <div className="h-3 bg-gray-100 rounded animate-pulse w-48" />
    </div>
    <div className={`bg-gray-100 rounded animate-pulse ${height}`} />
  </div>
);

// Loading button
export const LoadingButton: React.FC<{
  loading?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}> = ({ 
  loading = false, 
  children, 
  disabled = false, 
  className = '',
  onClick,
  type = 'button'
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className={`
      relative flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium
      transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
      ${loading ? 'cursor-wait' : ''}
      ${className}
    `}
  >
    {loading && <LoadingSpinner size="sm" />}
    <span className={loading ? 'opacity-70' : ''}>{children}</span>
  </button>
);

// Content loading overlay
export const LoadingOverlay: React.FC<{
  show: boolean;
  message?: string;
  className?: string;
}> = ({ show, message = 'Loading...', className = '' }) => {
  if (!show) return null;

  return (
    <div className={`
      absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50
      ${className}
    `}>
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-3" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

// Specific skeleton components for different data types
export const TouristListSkeleton: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
            <div>
              <div className="h-4 bg-gray-300 rounded animate-pulse w-32 mb-1" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const AlertListSkeleton: React.FC = () => (
  <div className="space-y-3">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="bg-white rounded-lg border-l-4 border-orange-400 p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-300 rounded animate-pulse w-40" />
            </div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-full mb-1" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
          </div>
          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
        </div>
      </div>
    ))}
  </div>
);

export const MapSkeleton: React.FC<{
  height?: string;
}> = ({ height = 'h-96' }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${height} relative overflow-hidden`}>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Loading map...</p>
      </div>
    </div>
    {/* Simulate map tiles loading */}
    <div className="absolute top-4 left-4 h-8 w-24 bg-gray-300 rounded animate-pulse" />
    <div className="absolute top-4 right-4 h-8 w-8 bg-gray-300 rounded animate-pulse" />
    <div className="absolute bottom-4 left-4 h-6 w-32 bg-gray-300 rounded animate-pulse" />
  </div>
);

// Loading states for specific dashboard sections
export const DashboardLoadingState: React.FC = () => (
  <div className="space-y-6">
    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>

    {/* Charts section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>

    {/* Recent activity */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <CardSkeleton lines={5} />
      </div>
      <CardSkeleton lines={4} />
    </div>
  </div>
);

// Inline loading for small components
export const InlineLoading: React.FC<{
  size?: 'sm' | 'md';
  text?: string;
}> = ({ size = 'sm', text = 'Loading...' }) => (
  <div className="flex items-center gap-2 text-gray-600">
    <LoadingSpinner size={size} />
    <span className="text-sm">{text}</span>
  </div>
);
