'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function WorkflowPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Government Workflow
            </h1>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Role-Based Workflow System
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Comprehensive workflow management for government tourist safety operations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center mb-3">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-300">Super Admin</h3>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-400">
                Ministry-level system oversight and policy management
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <h3 className="font-semibold text-green-900 dark:text-green-300">Admin</h3>
              </div>
              <p className="text-sm text-green-800 dark:text-green-400">
                Regional management and resource allocation
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center mb-3">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
                <h3 className="font-semibold text-orange-900 dark:text-orange-300">Operator</h3>
              </div>
              <p className="text-sm text-orange-800 dark:text-orange-400">
                Field operations and direct tourist monitoring
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center mb-3">
                <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="font-semibold text-purple-900 dark:text-purple-300">Viewer</h3>
              </div>
              <p className="text-sm text-purple-800 dark:text-purple-400">
                Transparency and audit access
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Workflow Documentation
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                For complete workflow documentation including daily responsibilities, emergency protocols, 
                and system usage guidelines, please refer to the 
                <Link href="/docs/workflow" className="text-blue-600 dark:text-blue-400 hover:underline ml-1">
                  Government Workflow Documentation
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
