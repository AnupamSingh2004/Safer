"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================================================
// BADGE VARIANTS & STYLING
// ============================================================================

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        emergency:
          "border-transparent bg-red-600 text-white hover:bg-red-700 animate-pulse",
        info:
          "border-transparent bg-blue-500 text-white hover:bg-blue-600",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// ============================================================================
// BASE BADGE COMPONENT
// ============================================================================

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children?: React.ReactNode;
}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

// ============================================================================
// RISK LEVEL BADGE
// ============================================================================

interface RiskLevelBadgeProps {
  level: 'low' | 'medium' | 'high' | 'critical';
  showIcon?: boolean;
  className?: string;
}

const RiskLevelBadge: React.FC<RiskLevelBadgeProps> = ({
  level,
  showIcon = true,
  className,
}) => {
  const variants = {
    low: { variant: 'success' as const, text: 'Low Risk' },
    medium: { variant: 'warning' as const, text: 'Medium Risk' },
    high: { variant: 'destructive' as const, text: 'High Risk' },
    critical: { variant: 'emergency' as const, text: 'CRITICAL' },
  };

  const config = variants[level];

  return (
    <Badge
      variant={config.variant}
      className={cn('font-bold', className)}
    >
      {showIcon && (
        <span className="mr-1">
          {level === 'low' && '🟢'}
          {level === 'medium' && '🟡'}
          {level === 'high' && '🔴'}
          {level === 'critical' && '⚠️'}
        </span>
      )}
      {config.text}
    </Badge>
  );
};

// ============================================================================
// TOURIST STATUS BADGE
// ============================================================================

interface TouristStatusBadgeProps {
  status: 'safe' | 'alert' | 'emergency' | 'offline' | 'unknown';
  showPulse?: boolean;
  className?: string;
}

const TouristStatusBadge: React.FC<TouristStatusBadgeProps> = ({
  status,
  showPulse = true,
  className,
}) => {
  const configs = {
    safe: {
      variant: 'success' as const,
      text: 'Safe',
      icon: '✓',
      pulse: false,
    },
    alert: {
      variant: 'warning' as const,
      text: 'Alert',
      icon: '⚠',
      pulse: true,
    },
    emergency: {
      variant: 'emergency' as const,
      text: 'EMERGENCY',
      icon: '🚨',
      pulse: true,
    },
    offline: {
      variant: 'secondary' as const,
      text: 'Offline',
      icon: '📴',
      pulse: false,
    },
    unknown: {
      variant: 'outline' as const,
      text: 'Unknown',
      icon: '?',
      pulse: false,
    },
  };

  const config = configs[status];

  return (
    <Badge
      variant={config.variant}
      className={cn(
        'font-semibold',
        showPulse && config.pulse && 'animate-pulse',
        className
      )}
    >
      <span className="mr-1">{config.icon}</span>
      {config.text}
    </Badge>
  );
};

// ============================================================================
// EMERGENCY PRIORITY BADGE
// ============================================================================

interface EmergencyPriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  showTimer?: boolean;
  elapsedTime?: string;
  className?: string;
}

const EmergencyPriorityBadge: React.FC<EmergencyPriorityBadgeProps> = ({
  priority,
  showTimer = false,
  elapsedTime,
  className,
}) => {
  const configs = {
    low: {
      variant: 'info' as const,
      text: 'Low Priority',
      bgColor: 'bg-blue-100 text-blue-800',
    },
    medium: {
      variant: 'warning' as const,
      text: 'Medium Priority',
      bgColor: 'bg-yellow-100 text-yellow-800',
    },
    high: {
      variant: 'destructive' as const,
      text: 'High Priority',
      bgColor: 'bg-red-100 text-red-800',
    },
    urgent: {
      variant: 'emergency' as const,
      text: 'URGENT',
      bgColor: 'bg-red-200 text-red-900',
    },
  };

  const config = configs[priority];

  return (
    <div className="flex items-center gap-1">
      <Badge
        variant={config.variant}
        className={cn('font-bold', className)}
      >
        {config.text}
      </Badge>
      {showTimer && elapsedTime && (
        <Badge variant="outline" size="sm">
          {elapsedTime}
        </Badge>
      )}
    </div>
  );
};

// ============================================================================
// LOCATION ZONE BADGE
// ============================================================================

interface LocationZoneBadgeProps {
  zone: 'safe' | 'caution' | 'restricted' | 'danger' | 'emergency';
  className?: string;
}

const LocationZoneBadge: React.FC<LocationZoneBadgeProps> = ({
  zone,
  className,
}) => {
  const configs = {
    safe: {
      variant: 'success' as const,
      text: 'Safe Zone',
      icon: '🟢',
    },
    caution: {
      variant: 'warning' as const,
      text: 'Caution Zone',
      icon: '🟡',
    },
    restricted: {
      variant: 'secondary' as const,
      text: 'Restricted',
      icon: '🔒',
    },
    danger: {
      variant: 'destructive' as const,
      text: 'Danger Zone',
      icon: '🔴',
    },
    emergency: {
      variant: 'emergency' as const,
      text: 'EMERGENCY ZONE',
      icon: '🚨',
    },
  };

  const config = configs[zone];

  return (
    <Badge
      variant={config.variant}
      className={cn('font-semibold', className)}
    >
      <span className="mr-1">{config.icon}</span>
      {config.text}
    </Badge>
  );
};

// ============================================================================
// NOTIFICATION COUNT BADGE
// ============================================================================

interface NotificationCountBadgeProps {
  count: number;
  maxDisplay?: number;
  variant?: 'default' | 'emergency';
  className?: string;
}

const NotificationCountBadge: React.FC<NotificationCountBadgeProps> = ({
  count,
  maxDisplay = 99,
  variant = 'default',
  className,
}) => {
  if (count <= 0) return null;

  const displayCount = count > maxDisplay ? `${maxDisplay}+` : count.toString();
  const badgeVariant = variant === 'emergency' ? 'emergency' : 'destructive';

  return (
    <Badge
      variant={badgeVariant}
      size="sm"
      className={cn(
        'min-w-[1.5rem] h-6 flex items-center justify-center rounded-full p-0 text-xs font-bold',
        variant === 'emergency' && 'animate-pulse',
        className
      )}
    >
      {displayCount}
    </Badge>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export {
  Badge,
  badgeVariants,
  RiskLevelBadge,
  TouristStatusBadge,
  EmergencyPriorityBadge,
  LocationZoneBadge,
  NotificationCountBadge,
};

export type {
  BadgeProps,
  RiskLevelBadgeProps,
  TouristStatusBadgeProps,
  EmergencyPriorityBadgeProps,
  LocationZoneBadgeProps,
  NotificationCountBadgeProps,
};