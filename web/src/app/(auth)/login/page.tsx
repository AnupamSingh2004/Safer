/**
 * Smart Tourist Safety System - Login Page (Fixed Layout - Clean Right Section)
 * Professional security-focused login interface with proper vh fitting and no overflow
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
    <div className="h-screen w-full overflow-hidden relative">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-cyan-400/20" />
      
      {/* Animated Background Elements */}
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

      <div className="relative z-10 h-full flex flex-col lg:flex-row">
        
      

        {/* Right Section - Clean Login Area (Fixed) */}
        <div className="flex-1 lg:w-3/5 xl:w-2/3 flex items-center justify-center h-full p-4">
          {/* Clean Login Card - Only the white container */}
          <div className="w-full max-w-md">
            <div className="relative">
              {/* Background blur effect */}
              <div className="absolute -inset-1 bg-white/5 rounded-xl blur-lg" />
              
              {/* Main card container */}
              <div className="relative bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/40 overflow-hidden">
                {/* Header Accent */}
                <div className="h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                
                {/* Card Content */}
                <div className="p-6">
                  {/* Form Header */}
                  <div className="text-center mb-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-950 mb-1">
                      Secure Access
                    </h2>
                    <p className="text-sm text-gray-600">
                      Emergency Response Dashboard
                    </p>
                  </div>

                  {/* Login Form */}
                  <div className="space-y-4">
                    <Suspense fallback={<LoginFormSkeleton />}>
                      <LoginForm 
                        showRoleSelection={true}
                        showRememberMe={false}
                        className="space-y-4"
                      />
                    </Suspense>
                  </div>

                  {/* Footer Links */}
                  <div className="mt-5 pt-4 border-t border-gray-200">
                    <div className="text-center space-y-3">
                      <div className="flex justify-center gap-4 text-xs">
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
                      
                      {/* Security badge */}
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
                        <Shield className="h-3 w-3 text-green-600" />
                        <span className="text-green-700 text-xs font-medium">Government Secured</span>
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
// ERROR BOUNDARY FALLBACK - Enhanced (Should be in error.tsx for app router)
// ============================================================================

function LoginErrorFallback() {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4 overflow-hidden">
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