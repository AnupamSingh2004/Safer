/**
 * Smart Tourist Safety System - Site Directory
 * Development helper page showing all available routes
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  LogIn, 
  UserPlus, 
  LayoutDashboard, 
  AlertTriangle, 
  BarChart3, 
  MessageSquare, 
  MapPin,
  Palette,
  ExternalLink,
  Shield
} from 'lucide-react';

interface Route {
  path: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'development' | 'planned';
  group: string;
}

const routes: Route[] = [
  // Public Routes
  {
    path: '/',
    name: 'Homepage',
    description: 'Landing page with system overview and statistics',
    icon: <Home className="w-5 h-5" />,
    status: 'active',
    group: 'Public'
  },

  // Authentication Routes
  {
    path: '/login',
    name: 'Login',
    description: 'User authentication with role selection',
    icon: <LogIn className="w-5 h-5" />,
    status: 'active',
    group: 'Authentication'
  },
  {
    path: '/register',
    name: 'Register',
    description: 'New user registration with KYC verification',
    icon: <UserPlus className="w-5 h-5" />,
    status: 'active',
    group: 'Authentication'
  },

  // Dashboard Routes
  {
    path: '/dashboard',
    name: 'Main Dashboard',
    description: 'Central control panel for tourist safety monitoring',
    icon: <LayoutDashboard className="w-5 h-5" />,
    status: 'development',
    group: 'Dashboard'
  },
  {
    path: '/dashboard/alerts',
    name: 'Alert Management',
    description: 'Emergency alerts and incident response',
    icon: <AlertTriangle className="w-5 h-5" />,
    status: 'development',
    group: 'Dashboard'
  },
  {
    path: '/dashboard/analytics',
    name: 'Analytics',
    description: 'Safety metrics and performance reports',
    icon: <BarChart3 className="w-5 h-5" />,
    status: 'development',
    group: 'Dashboard'
  },
  {
    path: '/dashboard/communication',
    name: 'Communication',
    description: 'Tourist communication and support tools',
    icon: <MessageSquare className="w-5 h-5" />,
    status: 'development',
    group: 'Dashboard'
  },
  {
    path: '/dashboard/location',
    name: 'Location Services',
    description: 'GPS tracking and geofencing management',
    icon: <MapPin className="w-5 h-5" />,
    status: 'development',
    group: 'Dashboard'
  },
  {
    path: '/dashboard/advanced-ui',
    name: 'Advanced UI Components',
    description: 'Development UI component showcase',
    icon: <Palette className="w-5 h-5" />,
    status: 'development',
    group: 'Dashboard'
  },

  // API Routes (for reference)
  {
    path: '/api/auth',
    name: 'Authentication API',
    description: 'Login, register, and session management',
    icon: <Shield className="w-5 h-5" />,
    status: 'development',
    group: 'API'
  },
];

const getStatusColor = (status: Route['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'development':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'planned':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status: Route['status']) => {
  switch (status) {
    case 'active':
      return 'Ready';
    case 'development':
      return 'In Dev';
    case 'planned':
      return 'Planned';
    default:
      return 'Unknown';
  }
};

export default function SiteDirectoryPage() {
  const groupedRoutes = routes.reduce((acc, route) => {
    if (!acc[route.group]) {
      acc[route.group] = [];
    }
    acc[route.group].push(route);
    return acc;
  }, {} as Record<string, Route[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Smart Tourist Safety
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Site Directory & Navigation
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Complete overview of all available routes and pages in the Smart Tourist Safety system.
            This page helps developers navigate the application structure.
          </p>
        </div>

        {/* Route Groups */}
        <div className="space-y-8">
          {Object.entries(groupedRoutes).map(([group, groupRoutes]) => (
            <div key={group} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {group} Routes
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {groupRoutes.length} route{groupRoutes.length !== 1 ? 's' : ''} available
                </p>
              </div>
              
              <div className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {groupRoutes.map((route) => (
                    <div
                      key={route.path}
                      className="group relative bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                            {route.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {route.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                              {route.path}
                            </p>
                          </div>
                        </div>
                        
                        <span className={`
                          px-2 py-1 text-xs font-medium rounded-full border
                          ${getStatusColor(route.status)}
                        `}>
                          {getStatusLabel(route.status)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {route.description}
                      </p>
                      
                      {route.status === 'active' && !route.path.startsWith('/api') ? (
                        <Link
                          href={route.path}
                          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          Visit Page
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                          {route.path.startsWith('/api') ? 'API Endpoint' : 'In Development'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Development Info */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Development Information
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p>• <strong>Framework:</strong> Next.js 14 with App Router</p>
            <p>• <strong>Styling:</strong> Tailwind CSS with custom theme system</p>
            <p>• <strong>Routing:</strong> File-based routing (automatic route generation)</p>
            <p>• <strong>Current Port:</strong> http://localhost:3001</p>
            <p>• <strong>Route Groups:</strong> (auth) and (dashboard) for organized layouts</p>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
