/**
 * Smart Tourist Safety System - Register Page
 * Enhanced user registration page with comprehensive validation
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/register-form';
import { AuthCard } from '@/components/auth/auth-layout';

export const metadata: Metadata = {
  title: 'Register | Smart Tourist Safety',
  description: 'Create new user accounts for Smart Tourist Safety dashboard. Administrator access required.',
  keywords: ['register', 'signup', 'new user', 'tourist safety', 'admin'],
};

// Loading skeleton component
function RegisterFormSkeleton() {
  return (
    <div className="w-full max-w-2xl space-y-6 animate-pulse">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto" />
      </div>
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
        <div className="flex gap-3">
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <AuthCard className="max-w-4xl">
      <Suspense fallback={<RegisterFormSkeleton />}>
        <RegisterForm 
          allowedRoles={['tourism_admin', 'police_admin', 'operator', 'viewer']}
          defaultRole="operator"
        />
      </Suspense>
    </AuthCard>
  );
}
