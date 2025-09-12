/**
 * Smart Tourist Safety System - Login Page
 * Professional security-focused login interface for emergency response dashboard
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Shield, AlertTriangle, MapPin, Users, Clock, Phone } from 'lucide-react';

import { LoginForm, LoginFormSkeleton } from '@/components/auth/login-form';
import { APP_CONFIG } from '@/lib/constants';

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {
  title: 'Login - Smart Tourist Safety Dashboard',
  description: 'Secure access to emergency response and tourist safety management system for authorized personnel',
  keywords: ['login', 'authentication', 'emergency response', 'tourist safety', 'security', 'dashboard'],
  robots: 'noindex, nofollow', // Prevent search engine indexing of auth pages
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl grid lg:grid-cols-5 gap-8 items-center">
        
        {/* Left Section - Branding & Information */}
        <div className="hidden lg:block lg:col-span-3 space-y-8 pr-8">
          {/* System Branding */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                  Smart Tourist Safety
                </h1>
                <p className="text-lg text-gray-600 font-medium">Emergency Response Dashboard</p>
                <p className="text-sm text-gray-500">Real-time Monitoring & Crisis Management</p>
              </div>
            </div>
            
            <div className="space-y-6 text-gray-700">
              <h2 className="text-2xl font-bold text-gray-900">
                Advanced Tourist Protection System
              </h2>
              <p className="text-lg leading-relaxed">
                Comprehensive safety management platform integrating real-time tracking, 
                emergency response coordination, and blockchain-verified digital identities 
                for enhanced tourist security.
              </p>
            </div>
          </div>

          {/* Key Features Grid */}
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-start gap-4 p-6 bg-white/60 rounded-xl backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="h-7 w-7 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Emergency Response</h3>
                <p className="text-gray-600 mb-3">
                  Instant alert processing and coordinated emergency response protocols with 
                  multi-agency communication capabilities.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    &lt;1min Response
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    24/7 Support
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/60 rounded-xl backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-3 bg-green-100 rounded-xl">
                <MapPin className="h-7 w-7 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Real-time Tracking</h3>
                <p className="text-gray-600 mb-3">
                  Advanced geofencing and location monitoring with AI-powered risk assessment 
                  and predictive safety analytics.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>GPS Accuracy: ±3m</span>
                  <span>•</span>
                  <span>Live Updates</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/60 rounded-xl backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-7 w-7 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Multi-Agency Collaboration</h3>
                <p className="text-gray-600 mb-3">
                  Integrated platform connecting tourism departments, police, medical services, 
                  and local authorities for seamless coordination.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>5+ Departments</span>
                  <span>•</span>
                  <span>Role-based Access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Trust Indicators */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-amber-600" />
                <h3 className="font-medium text-amber-800">Government Certified</h3>
              </div>
              <p className="text-sm text-amber-700">
                Certified security protocols and compliance with national data protection standards.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-green-800">Blockchain Secured</h3>
              </div>
              <p className="text-sm text-green-700">
                Digital identity verification with immutable blockchain technology for enhanced security.
              </p>
            </div>
          </div>

          {/* Emergency Contact Banner */}
          <div className="p-4 bg-red-600 text-white rounded-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 animate-pulse" />
              <div>
                <h3 className="font-bold">Emergency Hotline: 112</h3>
                <p className="text-sm text-red-100">
                  For immediate assistance during emergencies, call the national emergency number.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="lg:col-span-2 w-full max-w-lg mx-auto lg:mx-0">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Smart Tourist Safety</h1>
                <p className="text-sm text-gray-600">Emergency Response Dashboard</p>
              </div>
            </div>
          </div>

          {/* Login Form Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 p-8 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-500/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600">
                  Sign in to access your emergency response dashboard
                </p>
              </div>

              {/* Login Form */}
              <Suspense fallback={<LoginFormSkeleton />}>
                <LoginForm 
                  showRoleSelection={true}
                  showRememberMe={true}
                  className="space-y-6"
                />
              </Suspense>

              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center space-y-4">
                  <Link 
                    href="/register" 
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors inline-flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Need access? Request account registration
                  </Link>
                  
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <Link 
                      href="/forgot-password" 
                      className="hover:text-gray-700 transition-colors"
                    >
                      Forgot Password?
                    </Link>
                    <span>•</span>
                    <Link 
                      href="/help" 
                      className="hover:text-gray-700 transition-colors"
                    >
                      Need Help?
                    </Link>
                    <span>•</span>
                    <Link 
                      href="/contact" 
                      className="hover:text-gray-700 transition-colors"
                    >
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 space-y-3">
            <p className="text-sm text-gray-600">
              Smart India Hackathon 2025 • {APP_CONFIG.name}
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Secure
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                24/7 Available
              </span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Emergency Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ERROR BOUNDARY FALLBACK
// ============================================================================

export function ErrorBoundary() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Authentication System Error
        </h1>
        <p className="text-gray-600 mb-6">
          Unable to load the login interface. This may be due to a temporary system issue.
        </p>
        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
          <Link
            href="/contact"
            className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}