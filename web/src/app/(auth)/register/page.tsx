'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth-store';
import { RegisterForm } from '@/components/auth/register-form';
import { AuthCard } from '@/components/auth/auth-layout';
import { Shield, UserPlus, ArrowLeft, Lock } from 'lucide-react';

export default function RegisterPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/auth/register');
      return;
    }

    if (user && !['admin', 'super_admin'].includes(user.role)) {
      router.push('/dashboard?error=insufficient_permissions');
      return;
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user || !['admin', 'super_admin'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <AuthCard>
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-red-100 rounded-full">
                <Lock className="w-12 h-12 text-red-600" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Access Restricted</h2>
              <p className="text-gray-600 mt-2">
                User registration requires administrator privileges.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <AuthCard>
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-green-100 rounded-full">
                <UserPlus className="w-12 h-12 text-green-600" />
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New User</h1>
              <p className="text-gray-600 text-lg">
                Register a new user for the Smart Tourist Safety System
              </p>
            </div>

            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              <span>Administrator Access</span>
            </div>
          </div>

          <RegisterForm />
          
          <div className="pt-6 border-t border-gray-200">
            <Link 
              href="/dashboard/administration/users" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to User Management</span>
            </Link>
          </div>
        </div>
      </AuthCard>
    </div>
  );
}