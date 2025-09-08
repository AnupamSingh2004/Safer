/**
 * Smart Tourist Safety System - Login Form Component
 * Professional login form with validation and security features
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
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
  showRoleSelection = false,
  onSuccess,
  onError,
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error, clearError, isLocked, lockoutUntil } = useAuth();

  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
      role: 'operator',
    },
  });

  // Get redirect URL from search params
  const redirect = searchParams?.get('redirect') || redirectTo || '/dashboard';

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Handle account lockout
  useEffect(() => {
    if (isLocked && lockoutUntil) {
      const lockoutTime = new Date(lockoutUntil);
      const now = new Date();
      const remainingTime = lockoutTime.getTime() - now.getTime();

      if (remainingTime > 0) {
        const timer = setTimeout(() => {
          window.location.reload();
        }, remainingTime);

        return () => clearTimeout(timer);
      }
    }
  }, [isLocked, lockoutUntil]);

  // Form submission handler
  const onSubmit = async (data: LoginCredentials) => {
    try {
      setIsSubmitting(true);
      clearError();

      const response = await login(data);

      if (response.success) {
        setLoginAttempts(0);
        onSuccess?.();
        
        // Redirect to intended page
        router.push(redirect);
      } else {
        setLoginAttempts(prev => prev + 1);
        onError?.(response.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setLoginAttempts(prev => prev + 1);
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate remaining lockout time
  const getRemainingLockoutTime = () => {
    if (!isLocked || !lockoutUntil) return null;
    
    const lockoutTime = new Date(lockoutUntil);
    const now = new Date();
    const remainingMs = lockoutTime.getTime() - now.getTime();
    
    if (remainingMs <= 0) return null;
    
    const minutes = Math.ceil(remainingMs / (1000 * 60));
    return minutes;
  };

  const remainingLockoutMinutes = getRemainingLockoutTime();

  return (
    <div className={cn('w-full max-w-md space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-2xl">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Sign in to Smart Tourist Safety Dashboard
        </p>
      </div>

      {/* Account Lockout Warning */}
      {isLocked && remainingLockoutMinutes && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-red-800 dark:text-red-200">
              Account Temporarily Locked
            </p>
            <p className="text-red-600 dark:text-red-400">
              Too many failed attempts. Try again in {remainingLockoutMinutes} minute{remainingLockoutMinutes !== 1 ? 's' : ''}.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && !isLocked && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div className="text-sm text-red-600 dark:text-red-400">
            {error}
            {loginAttempts >= 3 && (
              <p className="mt-1 text-xs">
                {5 - loginAttempts} attempts remaining before account lockout.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role Selection */}
        {showRoleSelection && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Login As
            </label>
            <select
              {...register('role')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isSubmitting || isLocked}
            >
              <option value="admin">Administrator</option>
              <option value="operator">Operator</option>
              <option value="viewer">Viewer</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.role.message}
              </p>
            )}
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email Address
          </label>
          <div className="relative">
            <input
              {...register('email')}
              type="email"
              id="email"
              placeholder="Enter your email"
              className={cn(
                'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
                errors.email 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-300 dark:border-gray-600'
              )}
              disabled={isSubmitting || isLocked}
              autoComplete="email"
            />
            {watch('email') && !errors.email && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
          </div>
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              className={cn(
                'w-full px-3 py-2 pr-10 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
                errors.password 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-300 dark:border-gray-600'
              )}
              disabled={isSubmitting || isLocked}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              disabled={isSubmitting || isLocked}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        {showRememberMe && (
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                {...register('rememberMe')}
                type="checkbox"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                disabled={isSubmitting || isLocked}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Remember me
              </span>
            </label>
            <a
              href="/auth/forgot-password"
              className="text-sm text-primary hover:text-primary-600 font-medium"
            >
              Forgot password?
            </a>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting || isLocked}
          className={cn(
            'w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-lg transition-colors',
            'hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary'
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Need an account?{' '}
          <a
            href="/auth/register"
            className="text-primary hover:text-primary-600 font-medium"
          >
            Contact Administrator
          </a>
        </p>
      </div>

      {/* Security Notice */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400">
        <p>
          This is a secure government system. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// LOADING SKELETON
// ============================================================================

export function LoginFormSkeleton() {
  return (
    <div className="w-full max-w-md space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto" />
      </div>

      {/* Form Skeleton */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      {/* Footer Skeleton */}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto" />
    </div>
  );
}

export default LoginForm;
