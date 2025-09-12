/**
 * Smart Tourist Safety System - Label Component
 * Essential form label component with accessibility and theme integration
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ============================================================================
// LABEL COMPONENT VARIANTS
// ============================================================================

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors duration-200',
  {
    variants: {
      variant: {
        default: 'text-gray-700 dark:text-gray-300',
        required: 'text-gray-700 dark:text-gray-300',
        optional: 'text-gray-600 dark:text-gray-400',
        error: 'text-red-600 dark:text-red-400',
        success: 'text-green-600 dark:text-green-400',
        warning: 'text-orange-600 dark:text-orange-400',
        emergency: 'text-red-700 dark:text-red-300 font-semibold',
      },
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      weight: 'medium',
    },
  }
);

// ============================================================================
// LABEL COMPONENT INTERFACE
// ============================================================================

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  optional?: boolean;
  requiredIndicator?: string;
  optionalIndicator?: string;
  description?: string;
  tooltip?: string;
  icon?: React.ReactNode;
  helpText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
}

// ============================================================================
// LABEL COMPONENT
// ============================================================================

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      className,
      variant,
      size,
      weight,
      required = false,
      optional = false,
      requiredIndicator = '*',
      optionalIndicator = '(optional)',
      description,
      tooltip,
      icon,
      helpText,
      errorMessage,
      successMessage,
      warningMessage,
      children,
      ...props
    },
    ref
  ) => {
    // Determine variant based on props
    const effectiveVariant = 
      errorMessage ? 'error' :
      successMessage ? 'success' :
      warningMessage ? 'warning' :
      required ? 'required' :
      optional ? 'optional' :
      variant;

    const messageToShow = errorMessage || successMessage || warningMessage || helpText;

    return (
      <div className="space-y-1">
        {/* Main Label */}
        <label
          ref={ref}
          className={cn(
            labelVariants({ variant: effectiveVariant, size, weight }),
            'flex items-center gap-2',
            className
          )}
          {...props}
        >
          {/* Icon */}
          {icon && (
            <span className="inline-flex items-center">
              {icon}
            </span>
          )}
          
          {/* Label Text */}
          <span className="flex items-center gap-1">
            {children}
            
            {/* Required Indicator */}
            {required && (
              <span className="text-red-500 dark:text-red-400 ml-1">
                {requiredIndicator}
              </span>
            )}
            
            {/* Optional Indicator */}
            {optional && !required && (
              <span className="text-gray-500 dark:text-gray-400 text-xs font-normal ml-1">
                {optionalIndicator}
              </span>
            )}
          </span>

          {/* Tooltip */}
          {tooltip && (
            <span className="inline-flex">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                title={tooltip}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
              </button>
            </span>
          )}
        </label>

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}

        {/* Help Text / Error / Success / Warning Message */}
        {messageToShow && (
          <p className={cn(
            'text-xs mt-1',
            errorMessage && 'text-red-600 dark:text-red-400',
            successMessage && 'text-green-600 dark:text-green-400',
            warningMessage && 'text-orange-600 dark:text-orange-400',
            helpText && !errorMessage && !successMessage && !warningMessage && 'text-gray-500 dark:text-gray-400'
          )}>
            {messageToShow}
          </p>
        )}
      </div>
    );
  }
);

Label.displayName = 'Label';

// ============================================================================
// SPECIALIZED LABEL COMPONENTS
// ============================================================================

// Field Label - For form fields with comprehensive labeling
interface FieldLabelProps extends LabelProps {
  fieldId: string;
  label: string;
  required?: boolean;
  description?: string;
  helpText?: string;
  errorMessage?: string;
}

const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  (
    {
      fieldId,
      label,
      required = false,
      description,
      helpText,
      errorMessage,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Label
        ref={ref}
        htmlFor={fieldId}
        required={required}
        description={description}
        helpText={helpText}
        errorMessage={errorMessage}
        className={className}
        {...props}
      >
        {label}
      </Label>
    );
  }
);

FieldLabel.displayName = 'FieldLabel';

// Emergency Label - For critical form fields
interface EmergencyLabelProps extends LabelProps {
  emergencyType?: 'critical' | 'warning' | 'alert';
  blinking?: boolean;
}

const EmergencyLabel = React.forwardRef<HTMLLabelElement, EmergencyLabelProps>(
  (
    {
      emergencyType = 'critical',
      blinking = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const emergencyColors = {
      critical: 'text-red-700 dark:text-red-300',
      warning: 'text-orange-700 dark:text-orange-300',
      alert: 'text-yellow-700 dark:text-yellow-300',
    };

    return (
      <Label
        ref={ref}
        variant="emergency"
        weight="bold"
        className={cn(
          emergencyColors[emergencyType],
          blinking && 'animate-pulse',
          'uppercase tracking-wide',
          className
        )}
        {...props}
      >
        {children}
      </Label>
    );
  }
);

EmergencyLabel.displayName = 'EmergencyLabel';

// Section Label - For grouping related fields
interface SectionLabelProps extends LabelProps {
  section: string;
  subtitle?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}

const SectionLabel = React.forwardRef<HTMLLabelElement, SectionLabelProps>(
  (
    {
      section,
      subtitle,
      collapsible = false,
      collapsed = false,
      onToggle,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            ref={ref}
            size="lg"
            weight="semibold"
            className={cn('text-gray-900 dark:text-gray-100', className)}
            {...props}
          >
            {section}
          </Label>
          
          {collapsible && (
            <button
              type="button"
              onClick={onToggle}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg
                className={cn(
                  'h-5 w-5 transition-transform',
                  collapsed && 'rotate-180'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
        </div>
        
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        )}
        
        {/* Divider */}
        <div className="border-b border-gray-200 dark:border-gray-700" />
      </div>
    );
  }
);

SectionLabel.displayName = 'SectionLabel';

// Status Label - For displaying status information
interface StatusLabelProps extends LabelProps {
  status: 'active' | 'inactive' | 'pending' | 'error' | 'success' | 'warning';
  showIndicator?: boolean;
  indicatorPosition?: 'left' | 'right';
}

const StatusLabel = React.forwardRef<HTMLLabelElement, StatusLabelProps>(
  (
    {
      status,
      showIndicator = true,
      indicatorPosition = 'left',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const statusConfig = {
      active: {
        color: 'text-green-700 dark:text-green-300',
        indicator: 'bg-green-500',
      },
      inactive: {
        color: 'text-gray-700 dark:text-gray-300',
        indicator: 'bg-gray-400',
      },
      pending: {
        color: 'text-yellow-700 dark:text-yellow-300',
        indicator: 'bg-yellow-500',
      },
      error: {
        color: 'text-red-700 dark:text-red-300',
        indicator: 'bg-red-500',
      },
      success: {
        color: 'text-green-700 dark:text-green-300',
        indicator: 'bg-green-500',
      },
      warning: {
        color: 'text-orange-700 dark:text-orange-300',
        indicator: 'bg-orange-500',
      },
    };

    const config = statusConfig[status];

    const indicator = showIndicator && (
      <span
        className={cn(
          'inline-block w-2 h-2 rounded-full',
          config.indicator,
          status === 'pending' && 'animate-pulse'
        )}
      />
    );

    return (
      <Label
        ref={ref}
        className={cn(
          'flex items-center gap-2',
          config.color,
          className
        )}
        {...props}
      >
        {indicatorPosition === 'left' && indicator}
        {children}
        {indicatorPosition === 'right' && indicator}
      </Label>
    );
  }
);

StatusLabel.displayName = 'StatusLabel';

// Badge Label - For displaying badges with labels
interface BadgeLabelProps extends LabelProps {
  badge?: string | number;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  badgePosition?: 'top-right' | 'top-left' | 'inline';
}

const BadgeLabel = React.forwardRef<HTMLLabelElement, BadgeLabelProps>(
  (
    {
      badge,
      badgeVariant = 'default',
      badgePosition = 'inline',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const badgeColors = {
      default: 'bg-gray-100 text-gray-800 border-gray-200',
      primary: 'bg-blue-100 text-blue-800 border-blue-200',
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-orange-100 text-orange-800 border-orange-200',
      error: 'bg-red-100 text-red-800 border-red-200',
    };

    if (badgePosition === 'inline') {
      return (
        <Label
          ref={ref}
          className={cn('flex items-center gap-2', className)}
          {...props}
        >
          {children}
          {badge && (
            <span
              className={cn(
                'px-2 py-0.5 text-xs font-medium rounded-full border',
                badgeColors[badgeVariant]
              )}
            >
              {badge}
            </span>
          )}
        </Label>
      );
    }

    return (
      <div className="relative inline-block">
        <Label
          ref={ref}
          className={className}
          {...props}
        >
          {children}
        </Label>
        {badge && (
          <span
            className={cn(
              'absolute -top-1 px-1.5 py-0.5 text-xs font-medium rounded-full border',
              badgeColors[badgeVariant],
              badgePosition === 'top-right' && '-right-2',
              badgePosition === 'top-left' && '-left-2'
            )}
          >
            {badge}
          </span>
        )}
      </div>
    );
  }
);

BadgeLabel.displayName = 'BadgeLabel';

// ============================================================================
// COMPOUND LABEL COMPONENTS
// ============================================================================

// Form Group Label - Complete labeling solution for form groups
interface FormGroupLabelProps {
  label: string;
  fieldId: string;
  required?: boolean;
  optional?: boolean;
  description?: string;
  helpText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  icon?: React.ReactNode;
  tooltip?: string;
  className?: string;
}

const FormGroupLabel: React.FC<FormGroupLabelProps> = ({
  label,
  fieldId,
  required = false,
  optional = false,
  description,
  helpText,
  errorMessage,
  successMessage,
  warningMessage,
  icon,
  tooltip,
  className,
}) => {
  return (
    <Label
      htmlFor={fieldId}
      required={required}
      optional={optional}
      description={description}
      helpText={helpText}
      errorMessage={errorMessage}
      successMessage={successMessage}
      warningMessage={warningMessage}
      icon={icon}
      tooltip={tooltip}
      className={className}
    >
      {label}
    </Label>
  );
};

FormGroupLabel.displayName = 'FormGroupLabel';

// ============================================================================
// ACCESSIBILITY HOOKS
// ============================================================================

/**
 * Hook for managing label accessibility
 */
function useLabelAccessibility(
  labelId: string,
  fieldId: string,
  hasError?: boolean,
  hasDescription?: boolean
) {
  const labelledBy = labelId;
  const describedBy = React.useMemo(() => {
    const descriptions = [];
    if (hasDescription) descriptions.push(`${fieldId}-description`);
    if (hasError) descriptions.push(`${fieldId}-error`);
    return descriptions.length > 0 ? descriptions.join(' ') : undefined;
  }, [fieldId, hasError, hasDescription]);

  return {
    labelProps: {
      id: labelId,
    },
    fieldProps: {
      'aria-labelledby': labelledBy,
      'aria-describedby': describedBy,
    },
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  Label,
  FieldLabel,
  EmergencyLabel,
  SectionLabel,
  StatusLabel,
  BadgeLabel,
  FormGroupLabel,
  labelVariants,
  useLabelAccessibility,
};

export type {
  FieldLabelProps,
  EmergencyLabelProps,
  SectionLabelProps,
  StatusLabelProps,
  BadgeLabelProps,
  FormGroupLabelProps,
};