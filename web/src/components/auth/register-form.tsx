/**
 * Smart Tourist Safety System - Registration Form Component
 * Enhanced professional registration form with comprehensive validation and animations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  UserPlus, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  User,
  Mail,
  Phone,
  Lock,
  Building,
  Shield,
  Check,
  X,
  ArrowLeft
} from 'lucide-react';
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
// PASSWORD STRENGTH CHECKER
// ============================================================================

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
  label: string;
}

const checkPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('At least 8 characters');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('One uppercase letter');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('One lowercase letter');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('One number');
  }

  if (/[@$!%*?&]/.test(password)) {
    score += 1;
  } else {
    feedback.push('One special character');
  }

  const strengthMap = {
    0: { color: 'bg-gray-300', label: 'No password' },
    1: { color: 'bg-red-500', label: 'Very weak' },
    2: { color: 'bg-red-400', label: 'Weak' },
    3: { color: 'bg-yellow-400', label: 'Fair' },
    4: { color: 'bg-blue-500', label: 'Good' },
    5: { color: 'bg-green-500', label: 'Strong' },
  };

  return {
    score,
    feedback,
    color: strengthMap[score as keyof typeof strengthMap].color,
    label: strengthMap[score as keyof typeof strengthMap].label,
  };
};

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
  const [currentStep, setCurrentStep] = useState(1);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
    setValue,
    trigger,
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
      badge: '',
      acceptTerms: false,
    },
  });

  // Watch form values for real-time feedback
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');
  const emailValue = watch('email');
  const phoneValue = watch('phone');
  const firstName = watch('firstName');
  const lastName = watch('lastName');

  // Password strength analysis
  const passwordStrength = password ? checkPasswordStrength(password) : null;

  // Animate form entrance
  useEffect(() => {
    const timer = setTimeout(() => setIsFormVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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

  // Handle step navigation
  const goToNextStep = async () => {
    const fieldsToValidate = currentStep === 1 
      ? ['firstName', 'lastName', 'email', 'phone'] 
      : ['role', 'department'];
    
    const isStepValid = await trigger(fieldsToValidate as any);
    if (isStepValid) {
      setCurrentStep(2);
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep(1);
  };

  // Role options with enhanced descriptions and icons
  const roleOptions = [
    { 
      value: 'super_admin', 
      label: 'Super Administrator', 
      description: 'Complete system access and emergency coordination oversight',
      icon: Shield,
      restricted: true,
      badge: 'Restricted'
    },
    { 
      value: 'tourism_admin', 
      label: 'Tourism Administrator', 
      description: 'Tourism department oversight and visitor safety management',
      icon: Building,
      restricted: false,
      badge: 'Tourism Dept'
    },
    { 
      value: 'police_admin', 
      label: 'Police Administrator', 
      description: 'Law enforcement coordination and emergency response management',
      icon: Shield,
      restricted: false,
      badge: 'Police Dept'
    },
    { 
      value: 'operator', 
      label: 'System Operator', 
      description: 'Daily operations, tourist management, and emergency alert handling',
      icon: User,
      restricted: false,
      badge: 'Operations'
    },
    { 
      value: 'field_agent', 
      label: 'Field Agent', 
      description: 'On-ground emergency response and real-time assistance coordination',
      icon: User,
      restricted: false,
      badge: 'Field Ops'
    },
    { 
      value: 'viewer', 
      label: 'Viewer', 
      description: 'Read-only access to dashboard, reports, and monitoring systems',
      icon: Eye,
      restricted: false,
      badge: 'View Only'
    },
  ].filter(role => allowedRoles.includes(role.value as UserRole));

  // Department options with enhanced details
  const departmentOptions = [
    { 
      value: 'Tourism Department', 
      icon: Building,
      description: 'Tourist promotion, safety, and visitor services'
    },
    { 
      value: 'Police Department', 
      icon: Shield,
      description: 'Law enforcement and public safety'
    },
    { 
      value: 'Emergency Services', 
      icon: AlertTriangle,
      description: 'Fire, medical, and disaster response services'
    },
    { 
      value: 'Safety & Security', 
      icon: Shield,
      description: 'General safety oversight and security coordination'
    },
    { 
      value: 'Government Administration', 
      icon: Building,
      description: 'Local and state government administration'
    },
    { 
      value: 'Local Authority', 
      icon: Building,
      description: 'Municipal corporations and local governance'
    },
    { 
      value: 'Medical Services', 
      icon: AlertTriangle,
      description: 'Healthcare and medical emergency response'
    },
    { 
      value: 'Transport Authority', 
      icon: User,
      description: 'Transportation safety and coordination'
    },
    { 
      value: 'Other', 
      icon: User,
      description: 'Other government agencies and departments'
    },
  ];

  return (
    <div className={cn(
      'w-full max-w-4xl space-y-8 transition-all duration-700 ease-out transform',
      isFormVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      className
    )}>
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary-600 rounded-3xl shadow-lg">
          <UserPlus className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Register a new user for Smart Tourist Safety Dashboard
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4">
        <div className="flex items-center">
          <div className={cn(
            'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300',
            currentStep >= 1 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          )}>
            {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Personal Info
          </span>
        </div>
        <div className={cn(
          'w-16 h-1 rounded-full transition-all duration-300',
          currentStep >= 2 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
        )} />
        <div className="flex items-center">
          <div className={cn(
            'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300',
            currentStep >= 2 
              ? 'bg-primary text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          )}>
            2
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Professional Details
          </span>
        </div>
      </div>

      {/* Info Notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-blue-800 dark:text-blue-200">
            Administrator Registration Required
          </p>
          <p className="text-blue-600 dark:text-blue-400">
            Only system administrators can create new user accounts. All registrations require approval and verification.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-in slide-in-from-top-2 duration-500">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <User className="w-4 h-4 inline mr-2" />
                    First Name *
                  </label>
                  <div className="relative">
                    <input
                      {...register('firstName')}
                      type="text"
                      id="firstName"
                      placeholder="Enter first name"
                      className={cn(
                        'w-full px-4 py-3 pl-10 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                        'placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
                        errors.firstName 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      )}
                      disabled={isSubmitting}
                      autoComplete="given-name"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    {firstName && !errors.firstName && touchedFields.firstName && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                    )}
                  </div>
                  {errors.firstName && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <User className="w-4 h-4 inline mr-2" />
                    Last Name *
                  </label>
                  <div className="relative">
                    <input
                      {...register('lastName')}
                      type="text"
                      id="lastName"
                      placeholder="Enter last name"
                      className={cn(
                        'w-full px-4 py-3 pl-10 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                        'placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
                        errors.lastName 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      )}
                      disabled={isSubmitting}
                      autoComplete="family-name"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    {lastName && !errors.lastName && touchedFields.lastName && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                    )}
                  </div>
                  {errors.lastName && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    placeholder="Enter email address"
                    className={cn(
                      'w-full px-4 py-3 pl-10 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                      'placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
                      errors.email 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    )}
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  {emailValue && !errors.email && touchedFields.email && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                <div className="relative">
                  <input
                    {...register('phone')}
                    type="tel"
                    id="phone"
                    placeholder="Enter phone number"
                    className={cn(
                      'w-full px-4 py-3 pl-10 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                      'placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
                      errors.phone 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    )}
                    disabled={isSubmitting}
                    autoComplete="tel"
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  {phoneValue && !errors.phone && touchedFields.phone && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={goToNextStep}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
              >
                Continue
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Professional & Security Information */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
                Professional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Role */}
                <div className="space-y-2">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Shield className="w-4 h-4 inline mr-2" />
                    User Role *
                  </label>
                  <select
                    {...register('role')}
                    id="role"
                    className={cn(
                      'w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                      'focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
                      errors.role 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    )}
                    disabled={isSubmitting}
                  >
                    {roleOptions.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label} - {role.description}
                        {role.restricted ? ' (Restricted)' : ''}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Building className="w-4 h-4 inline mr-2" />
                    Department *
                  </label>
                  <select
                    {...register('department')}
                    id="department"
                    className={cn(
                      'w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                      'focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
                      errors.department 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    )}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Department</option>
                    {departmentOptions.map(dept => (
                      <option key={dept.value} value={dept.value}>
                        {dept.value} - {dept.description}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">
                      {errors.department.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Badge Number (Optional) */}
              <div className="space-y-2">
                <label htmlFor="badge" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Badge/Employee ID (Optional)
                </label>
                <input
                  {...register('badge')}
                  type="text"
                  id="badge"
                  placeholder="Enter badge or employee ID"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Security Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
                Security Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      placeholder="Create a strong password"
                      className={cn(
                        'w-full px-4 py-3 pl-10 pr-12 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                        'placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
                        errors.password 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      )}
                      disabled={isSubmitting}
                      autoComplete="new-password"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Password Strength:</span>
                        <span className={cn(
                          'text-xs font-medium',
                          passwordStrength?.score === 5 ? 'text-green-600' :
                          passwordStrength?.score === 4 ? 'text-blue-600' :
                          passwordStrength?.score === 3 ? 'text-yellow-600' :
                          'text-red-600'
                        )}>
                          {passwordStrength?.label}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              'h-1 flex-1 rounded-full transition-all duration-300',
                              i < (passwordStrength?.score || 0) 
                                ? passwordStrength?.color 
                                : 'bg-gray-200 dark:bg-gray-700'
                            )}
                          />
                        ))}
                      </div>
                      {passwordStrength && passwordStrength.feedback.length > 0 && (
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Missing: {passwordStrength.feedback.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      className={cn(
                        'w-full px-4 py-3 pl-10 pr-12 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                        'placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200',
                        errors.confirmPassword 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      )}
                      disabled={isSubmitting}
                      autoComplete="new-password"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                      disabled={isSubmitting}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                  {password && confirmPassword && password === confirmPassword && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 animate-in slide-in-from-top-1 duration-200">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Passwords match</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <input
                  {...register('acceptTerms')}
                  type="checkbox"
                  id="acceptTerms"
                  className="mt-0.5 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                  disabled={isSubmitting}
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-700 dark:text-gray-300">
                  I acknowledge that I have read and agree to the{' '}
                  <a href="/legal/terms" className="text-primary hover:text-primary-600 font-medium transition-colors duration-200 hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/legal/privacy" className="text-primary hover:text-primary-600 font-medium transition-colors duration-200 hover:underline">
                    Privacy Policy
                  </a>
                  . I understand that this system is for authorized personnel only and misuse may result in legal action. *
                </label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-200">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="flex items-center gap-2 px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white',
                  'bg-gradient-to-r from-primary to-primary-600 border border-transparent rounded-xl',
                  'hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  'transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                  'shadow-lg hover:shadow-xl'
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

// ============================================================================
// LOADING SKELETON
// ============================================================================

export function RegisterFormSkeleton() {
  return (
    <div className="w-full max-w-4xl space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 mx-auto bg-gray-200 dark:bg-gray-700 rounded-3xl" />
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto" />
        </div>
      </div>

      {/* Progress Skeleton */}
      <div className="flex items-center justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        </div>
        <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-24" />
          <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
