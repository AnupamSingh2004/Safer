/**
 * Smart Tourist Safety System - Authentication Error Page
 * Displays authentication errors and provides options to retry
 */

'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, RefreshCw, ArrowLeft, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const errorMessages = {
  Configuration: 'There was a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The sign in link is no longer valid. It may have been used already or it may have expired.',
  Default: 'An unexpected error occurred during authentication.',
  OAuthSignin: 'Error in constructing an authorization URL.',
  OAuthCallback: 'Error in handling the response from an OAuth provider.',
  OAuthCreateAccount: 'Could not create OAuth account in the database.',
  EmailCreateAccount: 'Could not create email account in the database.',
  Callback: 'Error in the OAuth callback handler route.',
  OAuthAccountNotLinked: 'Email on the account is already linked, but not with this OAuth account.',
  EmailSignin: 'Check your email address.',
  CredentialsSignin: 'Sign in was unsuccessful. Check that your credentials are correct.',
  SessionRequired: 'Please sign in to access this page.',
};

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const error = searchParams?.get('error') as keyof typeof errorMessages;
  const errorMessage = errorMessages[error] || errorMessages.Default;

  const handleRetry = () => {
    router.push('/auth/login');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Error Icon */}
        <div className="text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {errorMessage}
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  What happened?
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {errorMessage}
                </p>
              </div>
            </div>

            {error === 'OAuthAccountNotLinked' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Tip:</strong> This email is already associated with an account. 
                  Try signing in with your email and password instead, or contact your administrator.
                </p>
              </div>
            )}

            {error === 'AccessDenied' && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Access Restricted:</strong> Your account may not have the necessary 
                  permissions or may need to be activated by an administrator.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className={cn(
              'w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white',
              'bg-gradient-to-r from-primary to-primary-600 border border-transparent rounded-xl',
              'hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
              'transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]',
              'shadow-lg hover:shadow-xl'
            )}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>

          <button
            onClick={handleGoHome}
            className={cn(
              'w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200',
              'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl',
              'hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
              'transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]',
              'shadow-sm hover:shadow-md'
            )}
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Homepage
          </button>
        </div>

        {/* Support Information */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Need help? Contact support at{' '}
            <a
              href="mailto:support@smarttouristsafety.gov.in"
              className="text-primary hover:text-primary-600 underline"
            >
              support@smarttouristsafety.gov.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
