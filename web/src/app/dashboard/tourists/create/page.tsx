/**
 * Smart Tourist Safety System - Create Tourist Page
 * Form for registering new tourists with comprehensive data validation
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, User, FileText } from 'lucide-react';
import TouristRegistrationForm from '@/components/dashboard/tourists/tourist-registration-form';

// ============================================================================
// CREATE TOURIST PAGE COMPONENT
// ============================================================================

export default function CreateTouristPage() {
  const router = useRouter();

  const handleSubmit = async (touristData: any) => {
    try {
      // Here you would typically make an API call to create the tourist
      console.log('Creating tourist:', touristData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to tourists list on success
      router.push('/dashboard/tourists');
    } catch (error) {
      console.error('Failed to create tourist:', error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Register New Tourist
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create a new tourist profile with safety tracking capabilities
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <User className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Registration Form Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b pb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Tourist Information</h2>
          </div>
          
          <TouristRegistrationForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEditing={false}
          />
        </div>
      </Card>

      {/* Help Text */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-100">Registration Guidelines</h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure all required fields are completed accurately</li>
                <li>Emergency contact information is mandatory for safety tracking</li>
                <li>Digital identity will be created on the blockchain after registration</li>
                <li>Tourist will receive SMS/email confirmation with tracking details</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}