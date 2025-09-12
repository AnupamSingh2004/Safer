/**
 * Smart Tourist Safety System - Register Page
 * Enhanced user registration page with comprehensive validation and role management
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';
import { AuthCard } from '@/components/auth/auth-layout';
import { Shield, UserPlus, AlertTriangle, Clock, Users, ArrowLeft, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Register - Smart Tourist Safety Dashboard',
  description: 'Create new user accounts for Smart Tourist Safety dashboard. Administrator access required for account creation.',
  keywords: ['register', 'signup', 'new user', 'tourist safety', 'admin', 'emergency response'],
  robots: 'noindex, nofollow', // Prevent search engine indexing
};

// ============================================================================
// LOADING SKELETON COMPONENT
// ============================================================================

function RegisterFormSkeleton() {
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

      {/* Form Fields Skeleton */}
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
        <div className="flex gap-3">
          <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-lg">
                <UserPlus className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Smart Tourist Safety
              </h1>
              <p className="text-lg text-gray-600 font-medium">User Registration Portal</p>
            </div>
          </div>
          
          {/* Navigation Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
            <Link 
              href="/login" 
              className="flex items-center gap-1 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">New Account Registration</span>
          </div>
        </div>

        {/* Important Notices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Administrator Notice */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">Administrator Required</h3>
                <p className="text-sm text-blue-700">
                  Account creation requires administrator approval. All new users must be 
                  verified and assigned appropriate roles based on their department and responsibilities.
                </p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">Security Requirements</h3>
                <p className="text-sm text-amber-700">
                  This system handles sensitive emergency data. Strong passwords, valid 
                  government credentials, and department verification are mandatory.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Role Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Administrator</h4>
                <p className="text-xs text-gray-600">Full System Access</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Complete dashboard management and user administration capabilities.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Operator</h4>
                <p className="text-xs text-gray-600">Daily Operations</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Tourist management, alert handling, and emergency response coordination.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Field Agent</h4>
                <p className="text-xs text-gray-600">On-ground Support</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Mobile access for real-time updates and emergency response activities.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Viewer</h4>
                <p className="text-xs text-gray-600">Read-only Access</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Dashboard viewing, reports access, and monitoring capabilities only.
            </p>
          </div>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 p-8 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            {/* Registration Form */}
            <Suspense fallback={<RegisterFormSkeleton />}>
              <RegisterForm 
                allowedRoles={['tourism_admin', 'police_admin', 'operator', 'field_agent', 'viewer']}
                defaultRole="operator"
                className="max-w-4xl mx-auto"
              />
            </Suspense>
          </div>
        </div>

        {/* Footer Information */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <Link 
              href="/login" 
              className="hover:text-gray-900 transition-colors"
            >
              Already have an account? Sign in
            </Link>
            <span>•</span>
            <Link 
              href="/help" 
              className="hover:text-gray-900 transition-colors"
            >
              Need Help?
            </Link>
            <span>•</span>
            <Link 
              href="/contact" 
              className="hover:text-gray-900 transition-colors"
            >
              Contact Administrator
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Government Certified
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Secure Registration
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Multi-Agency Access
            </span>
          </div>

          <p className="text-sm text-gray-600">
            Smart India Hackathon 2025 • Emergency Response System
          </p>
        </div>
      </div>
    </div>
  );
}
