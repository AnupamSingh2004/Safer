/**
 * Smart Tourist Safety System - Input Component
 * Essential form input component with variants, validation states and icons
 */

import * as React from 'react';
import { Eye, EyeOff, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// INPUT COMPONENT INTERFACE
// ============================================================================

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'outline' | 'filled';
  inputSize?: 'sm' | 'default' | 'lg';
  state?: 'default' | 'error' | 'success' | 'warning';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  showPasswordToggle?: boolean;
  isLoading?: boolean;
}

// ============================================================================
// INPUT COMPONENT STYLES
// ============================================================================

const inputBaseClasses = 
  'flex w-full border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200';

const inputVariants = {
  default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  outline: 'border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-transparent',
  filled: 'border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500',
};

const inputSizes = {
  sm: 'h-8 px-3 py-1 text-sm rounded-md',
  default: 'h-10 px-3 py-2 rounded-md',
  lg: 'h-12 px-4 py-3 text-base rounded-lg',
};

const inputStates = {
  default: '',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50',
  success: 'border-green-500 focus:border-green-500 focus:ring-green-500 bg-green-50',
  warning: 'border-orange-500 focus:border-orange-500 focus:ring-orange-500 bg-orange-50',
};

// ============================================================================
// INPUT COMPONENT
// ============================================================================

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      variant = 'default',
      inputSize = 'default',
      state = 'default',
      leftIcon,
      rightIcon,
      label,
      helperText,
      errorMessage,
      showPasswordToggle = false,
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    
    const inputType = type === 'password' && showPassword ? 'text' : type;
    const hasError = state === 'error' || !!errorMessage;
    const hasSuccess = state === 'success';
    const hasWarning = state === 'warning';
    
    const finalState = hasError ? 'error' : hasSuccess ? 'success' : hasWarning ? 'warning' : 'default';
    
    const handlePasswordToggle = () => {
      setShowPassword(!showPassword);
    };

    const getStateIcon = () => {
      if (isLoading) {
        return <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full" />;
      }
      if (hasError) {
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      }
      if (hasSuccess) {
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      }
      return null;
    };

    const renderInput = () => (
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        {/* Input Field */}
        <input
          type={inputType}
          className={cn(
            inputBaseClasses,
            inputVariants[variant],
            inputSizes[inputSize],
            inputStates[finalState],
            leftIcon && 'pl-10',
            (rightIcon || showPasswordToggle || getStateIcon()) && 'pr-10',
            isFocused && 'ring-2',
            className
          )}
          ref={ref}
          disabled={disabled || isLoading}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        
        {/* Right Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
          {/* State Icon */}
          {getStateIcon()}
          
          {/* Password Toggle */}
          {type === 'password' && showPasswordToggle && (
            <button
              type="button"
              onClick={handlePasswordToggle}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
          
          {/* Custom Right Icon */}
          {rightIcon && !getStateIcon() && (
            <div className="text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
      </div>
    );

    if (label || helperText || errorMessage) {
      return (
        <div className="space-y-1">
          {/* Label */}
          {label && (
            <label className="text-sm font-medium text-gray-700">
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          
          {/* Input */}
          {renderInput()}
          
          {/* Helper Text / Error Message */}
          {(helperText || errorMessage) && (
            <p className={cn(
              'text-xs',
              hasError ? 'text-red-600' : hasWarning ? 'text-orange-600' : 'text-gray-500'
            )}>
              {errorMessage || helperText}
            </p>
          )}
        </div>
      );
    }

    return renderInput();
  }
);

Input.displayName = 'Input';

// ============================================================================
// SPECIALIZED INPUT COMPONENTS
// ============================================================================

// Search Input
interface SearchInputProps extends Omit<InputProps, 'type' | 'leftIcon'> {
  onSearch?: (value: string) => void;
  searchDelay?: number;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, searchDelay = 300, placeholder = 'Search...', ...props }, ref) => {
    const [searchValue, setSearchValue] = React.useState('');
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    React.useEffect(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        onSearch?.(searchValue);
      }, searchDelay);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [searchValue, onSearch, searchDelay]);

    return (
      <Input
        ref={ref}
        type="text"
        leftIcon={<Search className="h-4 w-4" />}
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

// Email Input with validation
interface EmailInputProps extends Omit<InputProps, 'type'> {
  validateOnBlur?: boolean;
}

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  ({ validateOnBlur = true, onBlur, ...props }, ref) => {
    const [isValid, setIsValid] = React.useState<boolean | null>(null);

    const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (validateOnBlur && e.target.value) {
        const valid = validateEmail(e.target.value);
        setIsValid(valid);
      }
      onBlur?.(e);
    };

    const getState = () => {
      if (isValid === null) return props.state || 'default';
      return isValid ? 'success' : 'error';
    };

    const getErrorMessage = () => {
      if (isValid === false) return 'Please enter a valid email address';
      return props.errorMessage;
    };

    return (
      <Input
        ref={ref}
        type="email"
        state={getState()}
        errorMessage={getErrorMessage()}
        onBlur={handleBlur}
        {...props}
      />
    );
  }
);

EmailInput.displayName = 'EmailInput';

// Password Input with strength indicator
interface PasswordInputProps extends Omit<InputProps, 'type' | 'showPasswordToggle'> {
  showStrength?: boolean;
  minLength?: number;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrength = false, minLength = 8, onChange, ...props }, ref) => {
    const [password, setPassword] = React.useState('');
    const [strength, setStrength] = React.useState(0);

    const calculateStrength = (pwd: string) => {
      let score = 0;
      if (pwd.length >= minLength) score += 1;
      if (/[a-z]/.test(pwd)) score += 1;
      if (/[A-Z]/.test(pwd)) score += 1;
      if (/[0-9]/.test(pwd)) score += 1;
      if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
      return score;
    };

    const getStrengthLabel = (score: number) => {
      if (score === 0) return '';
      if (score <= 2) return 'Weak';
      if (score <= 3) return 'Fair';
      if (score <= 4) return 'Good';
      return 'Strong';
    };

    const getStrengthColor = (score: number) => {
      if (score <= 2) return 'bg-red-500';
      if (score <= 3) return 'bg-orange-500';
      if (score <= 4) return 'bg-yellow-500';
      return 'bg-green-500';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setPassword(value);
      setStrength(calculateStrength(value));
      onChange?.(e);
    };

    return (
      <div className="space-y-2">
        <Input
          ref={ref}
          type="password"
          showPasswordToggle
          value={password}
          onChange={handleChange}
          {...props}
        />
        
        {showStrength && password && (
          <div className="space-y-1">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors',
                    strength >= level ? getStrengthColor(strength) : 'bg-gray-200'
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-gray-600">
              Password strength: {getStrengthLabel(strength)}
            </p>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

// Phone Input with formatting
interface PhoneInputProps extends Omit<InputProps, 'type'> {
  countryCode?: string;
  format?: 'us' | 'international';
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ countryCode = '+1', format = 'us', onChange, ...props }, ref) => {
    const [formattedValue, setFormattedValue] = React.useState('');

    const formatPhone = (value: string, fmt: string) => {
      const numbers = value.replace(/\D/g, '');
      
      if (fmt === 'us') {
        if (numbers.length >= 6) {
          return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
        } else if (numbers.length >= 3) {
          return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
        }
        return numbers;
      }
      
      return numbers;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhone(e.target.value, format);
      setFormattedValue(formatted);
      
      // Create a new event with formatted value
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: formatted,
        },
      };
      
      onChange?.(newEvent as React.ChangeEvent<HTMLInputElement>);
    };

    return (
      <div className="flex">
        {countryCode && (
          <div className="flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md text-sm text-gray-600">
            {countryCode}
          </div>
        )}
        <Input
          ref={ref}
          type="tel"
          className={cn(countryCode && 'rounded-l-none border-l-0')}
          value={formattedValue}
          onChange={handleChange}
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

// ============================================================================
// EXPORTS
// ============================================================================

export {
  Input,
  SearchInput,
  EmailInput,
  PasswordInput,
  PhoneInput,
};

export type {
  SearchInputProps,
  EmailInputProps,
  PasswordInputProps,
  PhoneInputProps,
};