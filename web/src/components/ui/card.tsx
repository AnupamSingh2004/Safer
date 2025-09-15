/**
 * Smart Tourist Safety System - Card Component
 * Enhanced card component with smooth animations and hover effects
 */

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// CARD COMPONENT WITH MOTION
// ============================================================================

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hoverable?: boolean;
    loading?: boolean;
  }
>(({ className, hoverable = false, loading = false, ...props }, ref) => {
  const shouldReduceMotion = useReducedMotion();
  
  const MotionDiv = motion.div;
  
  return (
    <MotionDiv
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200",
        hoverable && "hover:shadow-md hover:shadow-blue-100/50 cursor-pointer",
        loading && "opacity-70",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { duration: shouldReduceMotion ? 0 : 0.3 }
      }}
      whileHover={shouldReduceMotion || !hoverable ? {} : {
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={shouldReduceMotion || !hoverable ? {} : {
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      {...props}
    >
      {/* Loading shimmer effect */}
      {loading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-lg"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
      {props.children}
    </MotionDiv>
  );
});
Card.displayName = "Card";

// ============================================================================
// CARD HEADER
// ============================================================================

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// ============================================================================
// CARD TITLE
// ============================================================================

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// ============================================================================
// CARD DESCRIPTION
// ============================================================================

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// ============================================================================
// CARD CONTENT
// ============================================================================

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// ============================================================================
// CARD FOOTER
// ============================================================================

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// ============================================================================
// SPECIALIZED CARD COMPONENTS
// ============================================================================

// Tourist Card for displaying tourist information
interface TouristCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tourist: {
    id: string;
    name: string;
    nationality: string;
    status: 'safe' | 'alert' | 'emergency';
    lastLocation: string;
    lastSeen: string;
    avatar?: string;
  };
  onViewDetails?: (id: string) => void;
  onTrack?: (id: string) => void;
}

const TouristCard = React.forwardRef<HTMLDivElement, TouristCardProps>(
  ({ className, tourist, onViewDetails, onTrack, ...props }, ref) => {
    const statusColors = {
      safe: 'bg-green-100 text-green-800 border-green-200',
      alert: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      emergency: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <Card ref={ref} className={cn('hover:shadow-md transition-shadow', className)} {...props}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {tourist.avatar ? (
                <img
                  src={tourist.avatar}
                  alt={tourist.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {tourist.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
              <div>
                <CardTitle className="text-lg">{tourist.name}</CardTitle>
                <CardDescription>{tourist.nationality}</CardDescription>
              </div>
            </div>
            <span
              className={cn(
                'px-2 py-1 rounded-full text-xs font-medium border',
                statusColors[tourist.status]
              )}
            >
              {tourist.status.toUpperCase()}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">{tourist.lastLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Seen:</span>
              <span className="font-medium">{tourist.lastSeen}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex space-x-2 w-full">
            <button
              onClick={() => onViewDetails?.(tourist.id)}
              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              View Details
            </button>
            <button
              onClick={() => onTrack?.(tourist.id)}
              className="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Track
            </button>
          </div>
        </CardFooter>
      </Card>
    );
  }
);
TouristCard.displayName = "TouristCard";

// Alert Card for displaying alert information
interface AlertCardProps extends React.HTMLAttributes<HTMLDivElement> {
  alert: {
    id: string;
    type: 'emergency' | 'security' | 'medical' | 'general';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    location: string;
    timestamp: string;
    status: 'open' | 'acknowledged' | 'resolved';
    touristName?: string;
  };
  onViewDetails?: (id: string) => void;
  onResolve?: (id: string) => void;
}

const AlertCard = React.forwardRef<HTMLDivElement, AlertCardProps>(
  ({ className, alert, onViewDetails, onResolve, ...props }, ref) => {
    const severityColors = {
      low: 'bg-blue-100 text-blue-800 border-blue-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      critical: 'bg-red-100 text-red-800 border-red-200',
    };

    const typeIcons = {
      emergency: '🚨',
      security: '🛡️',
      medical: '🏥',
      general: 'ℹ️',
    };

    return (
      <Card ref={ref} className={cn('hover:shadow-md transition-shadow', className)} {...props}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{typeIcons[alert.type]}</span>
              <div>
                <CardTitle className="text-lg">{alert.title}</CardTitle>
                <CardDescription>{alert.touristName || 'System Alert'}</CardDescription>
              </div>
            </div>
            <span
              className={cn(
                'px-2 py-1 rounded-full text-xs font-medium border',
                severityColors[alert.severity]
              )}
            >
              {alert.severity.toUpperCase()}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-700">{alert.description}</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{alert.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{alert.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium capitalize">{alert.status}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex space-x-2 w-full">
            <button
              onClick={() => onViewDetails?.(alert.id)}
              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              View Details
            </button>
            {alert.status !== 'resolved' && (
              <button
                onClick={() => onResolve?.(alert.id)}
                className="flex-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Resolve
              </button>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  }
);
AlertCard.displayName = "AlertCard";

// Stats Card for displaying metrics
interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ className, title, value, change, icon, color = 'blue', ...props }, ref) => {
    const colorClasses = {
      blue: 'border-blue-200 bg-blue-50',
      green: 'border-green-200 bg-green-50',
      yellow: 'border-yellow-200 bg-yellow-50',
      red: 'border-red-200 bg-red-50',
      gray: 'border-gray-200 bg-gray-50',
    };

    return (
      <Card ref={ref} className={cn('', className)} {...props}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {change && (
                  <span
                    className={cn(
                      'text-sm font-medium',
                      change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
                  </span>
                )}
              </div>
              {change && (
                <p className="text-xs text-gray-500">vs {change.period}</p>
              )}
            </div>
            {icon && (
              <div className={cn('p-3 rounded-lg', colorClasses[color])}>
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);
StatsCard.displayName = "StatsCard";

// ============================================================================
// EXPORTS
// ============================================================================

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  TouristCard,
  AlertCard,
  StatsCard,
};

export type {
  TouristCardProps,
  AlertCardProps,
  StatsCardProps,
};