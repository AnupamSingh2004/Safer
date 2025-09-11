/**
 * Smart Tourist Safety System - Login Form Component
 * Enhanced professional login form with validation, animations, and security features
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, getSession } from 'next-auth/react';
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Lock,
  Mail,
  User,
  ChevronDown
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
  const { login, isLoading, error, clearError, isLocked, lockoutUntil } = useAuth();

  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
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

  // Get form values for real-time validation feedback
  const emailValue = watch('email');
  const passwordValue = watch('password');
  const roleValue = watch('role');

  // Get redirect URL from search params
  const redirect = searchParams?.get('redirect') || redirectTo || '/dashboard';
  const message = searchParams?.get('message');

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
        
        // Show success state briefly before redirect
        await new Promise(resolve => setTimeout(resolve, 500));
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

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      clearError();

      const result = await signIn('google', {
        callbackUrl: redirect,
        redirect: false,
      });

      if (result?.error) {
        onError?.(result.error);
        setLoginAttempts(prev => prev + 1);
      } else if (result?.ok) {
        // Check if we got a session
        const session = await getSession();
        if (session?.user) {
          onSuccess?.();
          router.push(redirect);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google sign-in failed';
      onError?.(errorMessage);
      setLoginAttempts(prev => prev + 1);
    } finally {
      setIsGoogleLoading(false);
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

  // Role options with better descriptions
  const roleOptions = [
    { 
      value: 'super_admin', 
      label: 'Super Administrator', 
      description: 'Full system access and management',
      icon: Shield
    },
    { 
      value: 'tourism_admin', 
      label: 'Tourism Administrator', 
      description: 'Tourism department management',
      icon: User
    },
    { 
      value: 'police_admin', 
      label: 'Police Administrator', 
      description: 'Law enforcement management',
      icon: Shield
    },
    { 
      value: 'operator', 
      label: 'System Operator', 
      description: 'Day-to-day operations management',
      icon: User
    },
    { 
      value: 'viewer', 
      label: 'Viewer', 
      description: 'Read-only dashboard access',
      icon: Eye
    },
  ];

  return (
    <div className={cn(
      'w-full max-w-lg space-y-6',
      className
    )}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary-600 rounded-2xl shadow-lg">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to Smart Tourist Safety Dashboard
          </p>
        </div>
      </div>

      {/* Success Message */}
      {message === 'registration-success' && (
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-in slide-in-from-top-2 duration-500">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-green-800 dark:text-green-200">
              Registration Successful
            </p>
            <p className="text-green-600 dark:text-green-400">
              Please sign in with your new credentials.
            </p>
          </div>
        </div>
      )}

      {/* Account Lockout Warning */}
      {isLocked && remainingLockoutMinutes && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-in slide-in-from-top-2 duration-500">
          <div className="flex items-center justify-center w-8 h-8 bg-red-100 dark:bg-red-900/40 rounded-full">
            <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-sm flex-1">
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
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-in slide-in-from-top-2 duration-500">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div className="text-sm text-red-600 dark:text-red-400 flex-1">
            {error}
            {loginAttempts >= 3 && (
              <p className="mt-1 text-xs font-medium">
                ⚠️ {5 - loginAttempts} attempts remaining before account lockout.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Role Selection */}
        {showRoleSelection && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <User className="w-4 h-4 inline mr-2" />
              Login As
            </label>
            <div className="relative">
              <select
                {...register('role')}
                className={cn(
                  'w-full px-4 py-3 pl-10 pr-10 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                  'focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
                  'appearance-none cursor-pointer',
                  errors.role 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                )}
                disabled={isSubmitting || isLocked}
              >
                {roleOptions.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label} - {role.description}
                  </option>
                ))}
              </select>
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            {errors.role && (
              <p className="text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">
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
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address
          </label>
          <div className="relative">
            <input
              {...register('email')}
              type="email"
              id="email"
              placeholder="Enter your email address"
              className={cn(
                'w-full px-4 py-3 pl-10 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                'placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
                errors.email 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              )}
              disabled={isSubmitting || isLocked}
              autoComplete="email"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            {emailValue && !errors.email && touchedFields.email && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500 animate-in zoom-in-50 duration-200" />
            )}
          </div>
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">
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
            <Lock className="w-4 h-4 inline mr-2" />
            Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              className={cn(
                'w-full px-4 py-3 pl-10 pr-12 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                'placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
                errors.password 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              )}
              disabled={isSubmitting || isLocked}
              autoComplete="current-password"
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
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
            <p className="text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        {showRememberMe && (
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                {...register('rememberMe')}
                type="checkbox"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 transition-all duration-200"
                disabled={isSubmitting || isLocked}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 select-none">
                Remember me for 30 days
              </span>
            </label>
            <a
              href="/auth/forgot-password"
              className="text-sm text-primary hover:text-primary-600 font-medium transition-colors duration-200 hover:underline"
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
            'w-full flex items-center justify-center px-6 py-3 text-sm font-medium text-white',
            'bg-gradient-to-r from-primary to-primary-600 border border-transparent rounded-xl',
            'hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
            'transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:from-primary disabled:hover:to-primary-600',
            'shadow-lg hover:shadow-xl'
          )}
        >
          {isSubmitting ? (
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

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isSubmitting || isLocked}
          className={cn(
            'w-full flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200',
            'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl',
            'hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
            'transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white dark:disabled:hover:bg-gray-800',
            'shadow-sm hover:shadow-md'
          )}
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in with Google...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="text-center space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Need an account?{' '}
          <a
            href="/auth/register"
            className="text-primary hover:text-primary-600 font-medium transition-colors duration-200 hover:underline"
          >
            Contact Administrator
          </a>
        </p>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-lg">
          <Shield className="w-3 h-3" />
          <span>Secure government system • Unauthorized access prohibited</span>
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
    <div className="w-full max-w-md space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 mx-auto bg-gray-200 dark:bg-gray-700 rounded-3xl" />
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto" />
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="space-y-6">
        {/* Role Selection Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
        
        {/* Email Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
        
        {/* Password Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
        
        {/* Remember Me Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28" />
        </div>
        
        {/* Submit Button Skeleton */}
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>

      {/* Footer Skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}

export default LoginForm;
