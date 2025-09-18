/**
 * Role-Based Dashboard Router
 * Routes users to their specific dashboard based on role
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/stores/auth-store';
import { LoadingSpinner } from '@/components/animations/loading-spinner';

export default function DashboardRouter() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Route users to their specific dashboard based on role
      const userRole = user.role?.toLowerCase();
      
      switch (userRole) {
        case 'super_admin':
          router.replace('/dashboard/super-admin');
          break;
        case 'admin':
        case 'tourism_admin':
        case 'police_admin':
          router.replace('/dashboard/admin');
          break;
        case 'operator':
          router.replace('/dashboard/operators');
          break;
        case 'viewer':
          router.replace('/dashboard/viewer');
          break;
        case 'tourist':
          router.replace('/dashboard/tourist');
          break;
        default:
          // Show a generic dashboard with basic info
          console.log('Unknown role, showing basic dashboard');
          break;
      }
    } else if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [user, isAuthenticated, isLoading, router]);

  // If we have a role but haven't redirected, show basic info
  if (isAuthenticated && user && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Smart Tourist Safety System
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Role: {user.role} | Loading your personalized dashboard...
            </p>
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  // Show loading while determining authentication status
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-white/80">Loading dashboard...</p>
      </div>
    </div>
  );
}