/**
 * Smart Tourist Safety System - Enhanced Login Form
 * Professional login form with backend integration and security features
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
import { loginSchema } from '@/lib/validations';
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
  } = useForm<LoginCredentials>({
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
  const selectDemoAccount = (accountType: 'admin' | 'operator' | 'viewer') => {
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
    };

    const account = demoAccounts[accountType];
    setValue('email', account.email);
    setValue('password', account.password);
    setValue('role', account.role);
  };

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setIsSubmitting(true);
      clearError();

      const response = await login(data);

      if (response.success) {
        setLoginSuccess(true);
        onSuccess?.();
        
        // Small delay to show success state
        setTimeout(() => {
          router.push(redirect);
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
    { value: 'super_admin', label: 'Super Administrator', description: 'Full system access with all permissions' },
    { value: 'operator', label: 'System Operator', description: 'Safety operations and alert management' },
    { value: 'viewer', label: 'Safety Viewer', description: 'Read-only access to reports and dashboards' },
  ];

  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Demo Account Quick Selection */}
      <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-lg">
        <p className="text-sm font-medium text-gray-900 mb-3">Quick Demo Access:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => selectDemoAccount('admin')}
            className="px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm"
          >
            Admin Login
          </button>
          <button
            type="button"
            onClick={() => selectDemoAccount('operator')}
            className="px-3 py-2 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Operator Login
          </button>
          <button
            type="button"
            onClick={() => selectDemoAccount('viewer')}
            className="px-3 py-2 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors shadow-sm"
          >
            Viewer Login
          </button>
        </div>
      </div>

      {/* Success Message */}
      {loginSuccess && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg shadow-sm">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700 font-medium">Login successful! Redirecting...</span>
        </div>
      )}

      {/* Error Message */}
      {error && !loginSuccess && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg shadow-sm">
          <XCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-600 font-medium">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role Selection */}
        {showRoleSelection && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Login As
            </label>
            <div className="relative">
              <select
                {...register('role')}
                className="w-full px-3 py-3 pl-10 border-2 border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-900 font-medium shadow-sm transition-all"
                disabled={isSubmitting}
              >
                {roleOptions.map(role => (
                  <option key={role.value} value={role.value} className="text-gray-900">
                    {role.label}
                  </option>
                ))}
              </select>
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {/* Role description */}
            <p className="text-xs text-gray-700 mt-1 font-medium">
              {roleOptions.find(r => r.value === watch('role'))?.description}
            </p>
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              className={cn(
                'w-full px-3 py-3 pl-10 border-2 rounded-lg bg-white transition-all shadow-sm text-gray-900 placeholder-gray-500',
                'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              )}
              disabled={isSubmitting}
              autoComplete="email"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
          </div>
          {errors.email && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3 h-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className={cn(
                'w-full px-3 py-3 pl-10 pr-10 border-2 rounded-lg bg-white transition-all shadow-sm text-gray-900 placeholder-gray-500',
                'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
              )}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-600 transition-colors"
              disabled={isSubmitting}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
              <AlertTriangle className="w-3 h-3" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        {showRememberMe && (
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                {...register('rememberMe')}
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <span className="text-sm text-gray-800 font-medium">Remember me for 30 days</span>
            </label>
            <a 
              href="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
            >
              Forgot password?
            </a>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting || loginSuccess}
          className={cn(
            'w-full flex items-center justify-center px-4 py-3 text-white font-medium rounded-lg transition-all',
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
              <CheckCircle className="w-4 h-4 mr-2" />
              Login Successful
            </>
          ) : isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Sign In Securely
            </>
          )}
        </button>
      </form>

      {/* Security Notice */}
      <div className="text-center">
        <div className="text-xs text-gray-700 flex items-center justify-center gap-1 bg-gray-100 px-3 py-2 rounded-full shadow-sm border border-gray-200">
          <Shield className="h-3 w-3" />
          <span className="font-medium">Secured by 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LOADING SKELETON
// ============================================================================

export function LoginFormSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {/* Demo buttons skeleton */}
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
        <div className="h-4 bg-gray-200 rounded w-32 mb-3" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-8 bg-gray-200 rounded" />
          <div className="h-8 bg-gray-200 rounded" />
          <div className="h-8 bg-gray-200 rounded" />
        </div>
      </div>
      
      {/* Form fields skeleton */}
      <div className="space-y-1">
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-12 bg-gray-200 rounded-lg" />
      </div>
      <div className="space-y-1">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-12 bg-gray-200 rounded-lg" />
      </div>
      <div className="space-y-1">
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-12 bg-gray-200 rounded-lg" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
      <div className="h-12 bg-gray-200 rounded-lg" />
    </div>
  );
}

export default LoginForm;