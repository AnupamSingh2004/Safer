/**
 * Smart Tourist Safety System - Logout Page
 * Handles user logout and cleanup
 */

'use client';

import React, { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/stores/auth-store';
import { Loader2, LogOut, CheckCircle } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();
  const { logout, clearAuth } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(true);
  const [isComplete, setIsComplete] = React.useState(false);

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Sign out from NextAuth
        await signOut({ redirect: false });
        
        // Clear custom auth store
        await logout();
        clearAuth();

        setIsComplete(true);
        setIsLoggingOut(false);

        // Redirect to login page after a brief delay
        setTimeout(() => {
          router.push('/auth/login?message=logged-out');
        }, 2000);
      } catch (error) {
        console.error('Logout error:', error);
        setIsLoggingOut(false);
        // Still redirect even if there's an error
        setTimeout(() => {
          router.push('/auth/login');
        }, 1000);
      }
    };

    performLogout();
  }, [logout, clearAuth, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {isLoggingOut ? (
            <>
              <div className="flex items-center justify-center w-20 h-20 mx-auto bg-primary/10 rounded-full">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                Signing Out
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Please wait while we securely sign you out...
              </p>
            </>
          ) : isComplete ? (
            <>
              <div className="flex items-center justify-center w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                Signed Out Successfully
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                You have been securely signed out. Redirecting to login...
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full">
                <LogOut className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                Logout Error
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                There was an issue signing out. Redirecting...
              </p>
            </>
          )}
        </div>

        {/* Progress indicator */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`bg-primary h-2 rounded-full transition-all duration-1000 ${
              isComplete ? 'w-full' : isLoggingOut ? 'w-3/4' : 'w-1/2'
            }`}
          />
        </div>

        {/* Security notice */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <LogOut className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium">Secure Logout</p>
              <p>Your session has been terminated and all local data cleared.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
