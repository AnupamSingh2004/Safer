/**
 * Smart Tourist Safety System - Compact Login Form
 * Optimized login form with reduced spacing for 100vh layout
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  Shield, 
  AlertTriangle, 
  Lock,
  Mail,
  User,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/stores/auth-store';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import type { LoginCredentials } from '@/types/auth';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface LoginFormProps {
  className?: string;
  redirectTo?: string;
  showRememberMe?: boolean;
  showRoleSelection?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function LoginForm({
  className,
  redirectTo,
  showRememberMe = true,
  showRoleSelection = true,
  onSuccess,
  onError,
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error, clearError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
      role: 'super_admin', // Default to super_admin to match backend
    },
  });

  const redirect = searchParams?.get('redirect') || redirectTo || '/dashboard';
  const watchedEmail = watch('email');
  const watchedPassword = watch('password');

  useEffect(() => {
    clearError();
  }, [clearError]);

  // Demo account selection helper - Updated to match backend
  const selectDemoAccount = (accountType: 'admin' | 'operator' | 'viewer' | 'police' | 'tourism') => {
    const demoAccounts = {
      admin: {
        email: 'admin@touristsafety.gov.in',
        password: 'admin123',
        role: 'super_admin' as const,
      },
      operator: {
        email: 'operator@touristsafety.gov.in',
        password: 'operator123',
        role: 'operator' as const,
      },
      viewer: {
        email: 'viewer@touristsafety.gov.in',
        password: 'viewer123',
        role: 'viewer' as const,
      },
      police: {
        email: 'police@touristsafety.gov.in',
        password: 'police123',
        role: 'police_admin' as const,
      },
      tourism: {
        email: 'tourism@touristsafety.gov.in',
        password: 'tourism123',
        role: 'tourism_admin' as const,
      },
    };

    const account = demoAccounts[accountType];
    setValue('email', account.email);
    setValue('password', account.password);
    setValue('role', account.role);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      clearError();

      const response = await login(data);

      if (response.success) {
        setLoginSuccess(true);
        onSuccess?.();
        
        // Determine redirect URL based on user role
        let redirectUrl = redirect;
        if (response.user) {
          switch (response.user.role) {
            case 'police_admin':
              redirectUrl = '/dashboard/police';
              break;
            case 'tourism_admin':
              redirectUrl = '/dashboard/tourism';
              break;
            case 'super_admin':
              redirectUrl = '/dashboard/administration';
              break;
            case 'operator':
              redirectUrl = '/dashboard/operator';
              break;
            case 'viewer':
              redirectUrl = '/dashboard/overview';
              break;
            default:
              redirectUrl = '/dashboard';
          }
        }
        
        // Small delay to show success state
        setTimeout(() => {
          router.push(redirectUrl);
        }, 1000);
      } else {
        onError?.(response.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updated role options to match backend exactly
  const roleOptions = [
    { value: 'super_admin', label: 'Administrator', description: 'Full system access' },
    { value: 'operator', label: 'Operator', description: 'Safety operations' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
    { value: 'police_admin', label: 'Police Admin', description: 'Police dashboard & investigations' },
    { value: 'tourism_admin', label: 'Tourism Admin', description: 'Tourism dashboard & analytics' },
  ];

  return (
    <div className={cn('w-full space-y-3', className)}>
      {/* Demo Account Quick Selection - Compact */}
      <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-sm">
        <p className="text-md font-medium text-gray-900 mb-2">Quick Demo Access:</p>
        <div className="grid grid-cols-3 gap-1 mb-2">
          <button
            type="button"
            onClick={() => selectDemoAccount('admin')}
            className="px-2 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm"
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => selectDemoAccount('operator')}
            className="px-2 py-1.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Operator
          </button>
          <button
            type="button"
            onClick={() => selectDemoAccount('viewer')}
            className="px-2 py-1.5 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors shadow-sm"
          >
            Viewer
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => selectDemoAccount('police')}
            className="px-2 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors shadow-sm"
          >
            Police
          </button>
          <button
            type="button"
            onClick={() => selectDemoAccount('tourism')}
            className="px-2 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors shadow-sm"
          >
            Tourism
          </button>
        </div>
      </div>

      {/* Success Message - Compact */}
      {loginSuccess && (
        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg shadow-sm">
          <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
          <span className="text-xs text-green-700 font-medium">Login successful! Redirecting...</span>
        </div>
      )}

      {/* Error Message - Compact */}
      {error && !loginSuccess && (
        <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg shadow-sm">
          <XCircle className="w-3 h-3 text-red-600 flex-shrink-0" />
          <span className="text-xs text-red-600 font-medium">{error}</span>
        </div>
      )}

      {/* Form - Compact */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Role Selection - Compact */}
        {showRoleSelection && (
          <div>
            <label className="block text-s font-semibold text-gray-900 mb-1">
              Login As
            </label>
            <div className="relative">
              <select
                {...register('role')}
                className="w-full px-2 py-2 pl-8 pr-8 border-2 border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-900 font-medium shadow-sm transition-all text-sm"
                disabled={isSubmitting}
              >
                {roleOptions.map(role => (
                  <option key={role.value} value={role.value} className="text-gray-900">
                    {role.label}
                  </option>
                ))}
              </select>
              <User className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-600" />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {/* Role description - Compact */}
            <p className="text-xs text-gray-700 mt-0.5 font-medium">
              {roleOptions.find(r => r.value === watch('role'))?.description}
            </p>
          </div>
        )}

        {/* Email - Compact */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              className={cn(
                'w-full px-2 py-2 pl-8 border-2 rounded-lg bg-white transition-all shadow-sm text-gray-900 placeholder-gray-500 text-sm',
                'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              )}
              disabled={isSubmitting}
              autoComplete="email"
            />
            <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-600" />
          </div>
          {errors.email && (
            <p className="text-xs text-red-600 mt-0.5 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-2.5 h-2.5" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password - Compact */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className={cn(
                'w-full px-2 py-2 pl-8 pr-8 border-2 rounded-lg bg-white transition-all shadow-sm text-gray-900 placeholder-gray-500 text-sm',
                'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
              )}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-600" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-600 transition-colors"
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 mt-0.5 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-2.5 h-2.5" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button - Compact */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting || loginSuccess}
          className={cn(
            'w-full flex items-center justify-center px-3 py-2 text-white font-medium rounded-lg transition-all text-sm',
            'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            loginSuccess 
              ? 'bg-green-600 cursor-default'
              : isSubmitting
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {loginSuccess ? (
            <>
              <CheckCircle className="w-3 h-3 mr-2" />
              Success
            </>
          ) : isSubmitting ? (
            <>
              <Loader2 className="w-3 h-3 mr-2 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              <Shield className="w-3 h-3 mr-2" />
              Sign In Securely
            </>
          )}
        </button>
      </form>

      {/* Security Notice - Compact */}
      <div className="text-center">
        <div className="text-xs text-gray-700 flex items-center justify-center gap-1 bg-gray-100 px-2 py-1 rounded-full shadow-sm border border-gray-200">
          <Shield className="h-2.5 w-2.5" />
          <span className="font-medium">256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LOADING SKELETON - Compact
// ============================================================================

export function LoginFormSkeleton() {
  return (
    <div className="w-full space-y-3 animate-pulse">
      {/* Demo buttons skeleton */}
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
        <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
        <div className="grid grid-cols-3 gap-1">
          <div className="h-6 bg-gray-200 rounded" />
          <div className="h-6 bg-gray-200 rounded" />
          <div className="h-6 bg-gray-200 rounded" />
        </div>
      </div>
      
      {/* Form fields skeleton */}
      <div className="space-y-1">
        <div className="h-3 bg-gray-200 rounded w-12" />
        <div className="h-8 bg-gray-200 rounded-lg" />
      </div>
      <div className="space-y-1">
        <div className="h-3 bg-gray-200 rounded w-20" />
        <div className="h-8 bg-gray-200 rounded-lg" />
      </div>
      <div className="space-y-1">
        <div className="h-3 bg-gray-200 rounded w-12" />
        <div className="h-8 bg-gray-200 rounded-lg" />
      </div>
      <div className="h-8 bg-gray-200 rounded-lg" />
    </div>
  );
}

export default LoginForm;