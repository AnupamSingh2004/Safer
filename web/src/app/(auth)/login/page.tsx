/**
 * Smart Tourist Safety System - Login Page (Fixed Layout & Spacing)
 * Professional security-focused login interface with improved spacing and alignment
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle, MapPin, Users, Clock, Phone } from 'lucide-react';

import { LoginForm, LoginFormSkeleton } from '@/components/auth/login-form';
import { APP_CONFIG } from '@/lib/constants';

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:8001'),
  title: 'Login - Smart Tourist Safety Dashboard',
  description: 'Secure access to emergency response and tourist safety management system for authorized personnel',
  keywords: ['login', 'authentication', 'emergency response', 'tourist safety', 'security', 'dashboard'],
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Login - Smart Tourist Safety Dashboard',
    description: 'Secure access to emergency response system',
    type: 'website',
  },
};

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-cyan-400/20" />
      
      {/* Animated Background Elements - Fixed positioning */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse" />
        <div 
          className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-indigo-400/30 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: '1000ms' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-cyan-400/30 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: '500ms' }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        
        {/* Left Section - Enhanced Branding */}
        <div className="hidden lg:flex lg:w-2/5 xl:w-1/3 flex-col justify-between p-6 xl:p-12">
          {/* Hero Section */}
          <div className="space-y-8">
  

          </div>

        </div>

        {/* Right Section - Compact & Neat Login Area */}
        <div className="flex-1 lg:w-3/5 xl:w-2/3 flex flex-col justify-center min-h-screen p-4 lg:p-6">
            
          {/* Compact Content Wrapper - Fits in Viewport */}
          <div className="w-full max-w-md mx-auto space-y-4">
            
            {/* Compact Branding */}
            <div className="text-center mb-2">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="relative flex-shrink-0">
                  <div className="p-2.5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-xl">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border border-white animate-pulse shadow-sm" />
                </div>
                <div className="text-left">
                  <h1 className="text-lg lg:text-xl font-bold text-white leading-tight">
                    Smart Tourist Safety
                  </h1>
                  <p className="text-blue-200 text-sm font-medium">Emergency Response Dashboard</p>
                </div>
              </div>
            </div>

            {/* Compact Login Card */}
            <div className="w-full">
              <div className="relative">
                {/* Background blur effect */}
                <div className="absolute -inset-2 bg-white/5 rounded-2xl blur-lg" />
                
                {/* Main card container */}
                <div className="relative bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/40">
                  {/* Header Accent */}
                  <div className="h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-t-xl" />
                  
                  {/* Compact Card Content */}
                  <div className="p-8">
                    {/* Minimal Form Header */}
                    <div className="text-center mb-5">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mx-auto mb-3 flex items-center justify-center shadow-md">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 mb-1">
                        Secure Login
                      </h2>
                      <p className="text-sm text-gray-600">
                        Emergency Response Dashboard
                      </p>
                    </div>

                    {/* Compact Login Form */}
                    <div className="space-y-4">
                      <Suspense fallback={<LoginFormSkeleton />}>
                        <LoginForm 
                          showRoleSelection={true}
                          showRememberMe={false}
                          className="space-y-4"
                        />
                      </Suspense>
                    </div>

                    {/* Minimal Footer Links */}
                    <div className="mt-5 pt-4 border-t border-gray-200 text-center space-y-2">
                      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 text-xs">
                        <Link 
                          href="/forgot-password" 
                          className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                        >
                          Reset Password
                        </Link>
                        <Link 
                          href="/help" 
                          className="text-gray-600 hover:text-gray-700 hover:underline transition-colors"
                        >
                          Help & Support
                        </Link>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center justify-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full">
                        <Shield className="h-3 w-3" />
                        <span>Government Secured System</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ERROR BOUNDARY FALLBACK - Enhanced
// ============================================================================

export function ErrorBoundary() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="text-xl font-semibold text-white mb-2">
          Authentication System Error
        </h1>
        <p className="text-gray-300 mb-6 text-sm leading-relaxed">
          Unable to load the login interface. This may be due to a temporary system issue or network connectivity problem.
        </p>
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Reload Page
          </button>
          <Link
            href="/contact"
            className="block w-full px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Contact System Administrator
          </Link>
        </div>
        <div className="mt-6 text-xs text-gray-500 flex items-center justify-center gap-1">
          <Shield className="h-3 w-3" />
          <span>Smart Tourist Safety System</span>
        </div>
      </div>
    </div>
  );
}