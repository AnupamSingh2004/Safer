/**
 * Smart Tourist Safety System - Registration Form Component
 * Professional registration form for new users (admin only)
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, UserPlus, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { useAuth } from '@/stores/auth-store';
import { registerSchema } from '@/lib/validations';
import type { UserRole } from '@/types/auth';

// Infer the type from the validation schema
type RegisterFormData = z.infer<typeof registerSchema>;

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface RegisterFormProps {
  className?: string;
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
  allowedRoles?: UserRole[];
  defaultRole?: UserRole;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function RegisterForm({
  className,
  onSuccess,
  onError,
  allowedRoles = ['operator', 'viewer'],
  defaultRole = 'operator',
}: RegisterFormProps) {
  const router = useRouter();
  const { register: registerUser, isLoading, error, clearError } = useAuth();

  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      role: defaultRole as any,
      department: '',
      acceptTerms: false,
    },
  });

  // Watch password for confirmation validation
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  // Form submission handler
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      clearError();

      const response = await registerUser(data);

      if (response.success) {
        onSuccess?.(response.user);
        router.push('/auth/login?message=registration-success');
      } else {
        onError?.(response.message || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Role options
  const roleOptions = [
    { value: 'super_admin', label: 'Super Administrator', description: 'Full system access' },
    { value: 'tourism_admin', label: 'Tourism Administrator', description: 'Tourism department management' },
    { value: 'police_admin', label: 'Police Administrator', description: 'Police department management' },
    { value: 'operator', label: 'Operator', description: 'Manage tourists and alerts' },
    { value: 'viewer', label: 'Viewer', description: 'View-only access' },
  ].filter(role => allowedRoles.includes(role.value as UserRole));

  // Department options
  const departmentOptions = [
    'Tourism Department',
    'Police Department',
    'Emergency Services',
    'Safety & Security',
    'Government Administration',
    'Local Authority',
    'Other',
  ];

  return (
    <div className={cn('w-full max-w-2xl space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-2xl">
          <UserPlus className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create New Account
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Register a new user for Smart Tourist Safety Dashboard
        </p>
      </div>

      {/* Info Notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-blue-800 dark:text-blue-200">
            Administrator Registration
          </p>
          <p className="text-blue-600 dark:text-blue-400">
            Only administrators can create new user accounts. All registrations require approval.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name *
              </label>
              <input
                {...register('firstName')}
                type="text"
                id="firstName"
                placeholder="Enter first name"
                className={cn(
                  'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
                  errors.firstName 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                )}
                disabled={isSubmitting}
                autoComplete="given-name"
              />
              {errors.firstName && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name *
              </label>
              <input
                {...register('lastName')}
                type="text"
                id="lastName"
                placeholder="Enter last name"
                className={cn(
                  'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
                  errors.lastName 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                )}
                disabled={isSubmitting}
                autoComplete="family-name"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address *
            </label>
            <div className="relative">
              <input
                {...register('email')}
                type="email"
                id="email"
                placeholder="Enter email address"
                className={cn(
                  'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
                  errors.email 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                )}
                disabled={isSubmitting}
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

          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number *
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              placeholder="Enter phone number"
              className={cn(
                'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
                errors.phone 
                  ? 'border-red-300 dark:border-red-600' 
                  : 'border-gray-300 dark:border-gray-600'
              )}
              disabled={isSubmitting}
              autoComplete="tel"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Professional Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Role */}
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                User Role *
              </label>
              <select
                {...register('role')}
                id="role"
                className={cn(
                  'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
                  errors.role 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                )}
                disabled={isSubmitting}
              >
                {roleOptions.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label} - {role.description}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Department *
              </label>
              <select
                {...register('department')}
                id="department"
                className={cn(
                  'w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
                  errors.department 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                )}
                disabled={isSubmitting}
              >
                <option value="">Select Department</option>
                {departmentOptions.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.department.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Security Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
            Security Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password *
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Create a password"
                  className={cn(
                    'w-full px-3 py-2 pr-10 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
                    errors.password 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  )}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  placeholder="Confirm password"
                  className={cn(
                    'w-full px-3 py-2 pr-10 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
                    errors.confirmPassword 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  )}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
              {password && confirmPassword && password === confirmPassword && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Passwords match</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              {...register('acceptTerms')}
              type="checkbox"
              id="acceptTerms"
              className="mt-0.5 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
              disabled={isSubmitting}
            />
            <label htmlFor="acceptTerms" className="text-sm text-gray-700 dark:text-gray-300">
              I agree to the{' '}
              <a href="/legal/terms" className="text-primary hover:text-primary-600 font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/legal/privacy" className="text-primary hover:text-primary-600 font-medium">
                Privacy Policy
              </a>
              {' '}*
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={cn(
              'flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-lg transition-colors',
              'hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary'
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
