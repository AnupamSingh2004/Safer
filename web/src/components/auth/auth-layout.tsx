/**
 * Smart Tourist Safety System - Authentication Layout
 * Layout component for login, register, and other auth pages
 */

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, MapPin, Users, AlertTriangle, TrendingUp, Globe, Moon, Sun, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_CONFIG } from '@/lib/constants';
import { ThemeToggle } from '@/components/theme/unified-theme-components';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showStats?: boolean;
  showFeatures?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AuthLayout({
  children,
  title = APP_CONFIG.name,
  subtitle = APP_CONFIG.tagline,
  showStats: enableStats = true,
  showFeatures: enableFeatures = true,
}: AuthLayoutProps) {
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(false);
  const [areStatsVisible, setAreStatsVisible] = useState(false);
  const [areFeaturesVisible, setAreFeaturesVisible] = useState(false);

  useEffect(() => {
    // Trigger the left animation first
    const leftTimer = setTimeout(() => {
      setIsLeftVisible(true);
    }, 100);

    // Trigger the right animation slightly after
    const rightTimer = setTimeout(() => {
      setIsRightVisible(true);
    }, 300);

    // Animate stats section
    const statsTimer = setTimeout(() => {
      setAreStatsVisible(true);
    }, 500);

    // Animate features section
    const featuresTimer = setTimeout(() => {
      setAreFeaturesVisible(true);
    }, 700);

    return () => {
      clearTimeout(leftTimer);
      clearTimeout(rightTimer);
      clearTimeout(statsTimer);
      clearTimeout(featuresTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative">
      {/* Theme Toggle and Home Button */}
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <Link 
            href="/"
            className="flex items-center justify-center p-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            title="Go to Home"
          >
            <Home className="w-5 h-5" />
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
          <ThemeToggle variant="icon" size="sm" className="!p-3" />
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Left Side - Branding & Information */}
        <div className={cn(
          "hidden lg:flex lg:w-2/5 lg:flex-col lg:justify-center lg:px-6 xl:px-8 transition-all duration-700 ease-out transform",
          isLeftVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
        )}>
          <div className="mx-auto w-full max-w-md">
            {/* Logo & Title */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {subtitle}
                  </p>
                </div>
              </div>
              
              <div className="text-gray-700 dark:text-gray-300">
                <p className="text-base mb-3">
                  Ensuring tourist safety through intelligent monitoring and rapid response systems.
                </p>
                <p className="text-sm">
                  Advanced AI-powered platform for tourism departments and emergency services to protect and assist visitors.
                </p>
              </div>
            </div>

            {/* Stats */}
            {enableStats && (
              <div className={cn(
                "mb-8 transition-all duration-500 ease-out transform",
                areStatsVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              )}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Platform Impact
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Tourists Protected
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      50K+
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Incidents Resolved
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      2.3K+
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Safe Zones
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      150+
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Response Time
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      &lt;5min
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Key Features */}
            {enableFeatures && (
              <div className={cn(
                "transition-all duration-500 ease-out transform",
                areFeaturesVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              )}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Key Features
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full flex-shrink-0 mt-0.5">
                      <Shield className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Blockchain Digital Identity
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Secure, tamper-proof tourist identification system
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full flex-shrink-0 mt-0.5">
                      <AlertTriangle className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Real-time Alert System
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Instant emergency notifications and response coordination
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full flex-shrink-0 mt-0.5">
                      <MapPin className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Smart Zone Management
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Risk assessment and safety zone monitoring
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full flex-shrink-0 mt-0.5">
                      <Globe className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Multi-language Support
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Support for international tourists in multiple languages
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Authentication Form */}
        <div className={cn(
          "flex flex-1 lg:w-3/5 flex-col justify-center px-4 py-12 sm:px-6 lg:px-12 xl:px-16 transition-all duration-700 ease-out transform",
          isRightVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
        )}>
          <div className="mx-auto w-full max-w-md lg:max-w-lg">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8">
              <div className="flex items-center justify-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Authentication Form */}
            {children}
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 dark:stroke-gray-800 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]">
          <defs>
            <pattern
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50 dark:fill-gray-900/20">
            <path
              d="m-100 0 200 200v-200H100Z"
              strokeWidth={0}
            />
          </svg>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// AUTH CARD WRAPPER
// ============================================================================

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div className={cn(
      'bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 px-6 py-8',
      className
    )}>
      {children}
    </div>
  );
}

// ============================================================================
// LOADING SKELETON
// ============================================================================

export function AuthLayoutSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="flex min-h-screen">
        {/* Left Side Skeleton */}
        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8 xl:px-12">
          <div className="mx-auto w-full max-w-sm animate-pulse">
            {/* Logo Skeleton */}
            <div className="mb-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>

            {/* Stats Skeleton */}
            <div className="mb-10">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Skeleton */}
            <div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0 mt-0.5"></div>
                    <div className="space-y-1 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Skeleton */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96 animate-pulse">
            <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 px-6 py-8">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto"></div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
