/**
 * Smart Tourist Safety System - Button Component
 * Foundational button component with multiple variants and sizes
 */

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// BUTTON VARIANTS (Simple approach without CVA)
// ============================================================================

const buttonBaseClasses = 
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden';

const buttonVariants = {
  default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg active:shadow-sm',
  destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg active:shadow-sm',
  outline: 'border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900 shadow-sm hover:shadow-md',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow-md',
  ghost: 'hover:bg-gray-100 hover:text-gray-900',
  link: 'text-blue-600 underline-offset-4 hover:underline',
  success: 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg active:shadow-sm',
  warning: 'bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg active:shadow-sm',
  emergency: 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl active:shadow-md animate-pulse',
};

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3 text-sm',
  lg: 'h-11 px-8',
  xl: 'h-12 px-10 text-base',
  icon: 'h-10 w-10',
  'icon-sm': 'h-8 w-8',
  'icon-lg': 'h-12 w-12',
};

// ============================================================================
// BUTTON INTERFACE
// ============================================================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          buttonBaseClasses,
          buttonVariants[variant],
          buttonSizes[size],
          fullWidth && 'w-full',
          loading && 'cursor-wait',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        
        {/* Left icon */}
        {!loading && leftIcon && (
          <span className="inline-flex shrink-0">
            {leftIcon}
          </span>
        )}
        
        {/* Button content */}
        <span className={cn(
          'inline-flex items-center justify-center',
          loading && 'opacity-70'
        )}>
          {loading && loadingText ? loadingText : children}
        </span>
        
        {/* Right icon */}
        {!loading && rightIcon && (
          <span className="inline-flex shrink-0">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ============================================================================
// BUTTON GROUP COMPONENT
// ============================================================================

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, children, orientation = 'horizontal', spacing = 'sm', ...props }, ref) => {
    const spacingClasses = {
      none: 'gap-0',
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-4',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          spacingClasses[spacing],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

// ============================================================================
// SPECIALIZED BUTTON COMPONENTS
// ============================================================================

// Emergency Button for panic situations
interface EmergencyButtonProps extends Omit<ButtonProps, 'variant'> {
  emergencyType?: 'panic' | 'medical' | 'security';
}

const EmergencyButton = React.forwardRef<HTMLButtonElement, EmergencyButtonProps>(
  ({ emergencyType = 'panic', children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="emergency"
        size="lg"
        className={cn(
          'font-bold tracking-wide uppercase border-2 border-red-400',
          'hover:border-red-300 focus:border-red-300',
          'shadow-red-200 hover:shadow-red-300',
          className
        )}
        {...props}
      >
        {children || 'EMERGENCY'}
      </Button>
    );
  }
);

EmergencyButton.displayName = 'EmergencyButton';

// Action Button with icon and description
interface ActionButtonProps extends ButtonProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ icon, title, description, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        size="lg"
        className={cn(
          'h-auto p-4 flex-col items-start text-left space-y-1',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3 w-full">
          {icon && (
            <div className="flex-shrink-0 text-blue-600">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <div className="font-semibold text-sm">{title}</div>
            {description && (
              <div className="text-xs text-gray-600 mt-1">
                {description}
              </div>
            )}
          </div>
        </div>
      </Button>
    );
  }
);

ActionButton.displayName = 'ActionButton';

// Icon Button with tooltip
interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactNode;
  tooltip?: string;
  'aria-label': string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, tooltip, className, size = 'icon', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size={size}
        className={cn('relative', className)}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

// ============================================================================
// EXPORTS
// ============================================================================

export { 
  Button, 
  ButtonGroup, 
  EmergencyButton, 
  ActionButton, 
  IconButton 
};

export type { 
  ButtonGroupProps, 
  EmergencyButtonProps, 
  ActionButtonProps, 
  IconButtonProps 
};