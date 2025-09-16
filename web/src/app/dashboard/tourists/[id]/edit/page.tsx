/**
 * Smart Tourist Safety System - Edit Tourist Page
 * Form for editing existing tourist information with pre-populated data
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, User, FileText, AlertTriangle, Clock } from 'lucide-react';
import TouristRegistrationForm from '@/components/dashboard/tourists/tourist-registration-form';

// ============================================================================
// EDIT TOURIST PAGE COMPONENT
// ============================================================================

export default function EditTouristPage() {
  const router = useRouter();
  const params = useParams();
  const touristId = params.id as string;
  
  // Mock tourist data - replace with actual API call
  const [touristData, setTouristData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading tourist data
    const loadTouristData = async () => {
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData = {
          id: touristId,
          personalInfo: {
            firstName: 'Rajesh',
            lastName: 'Kumar',
            email: 'rajesh.kumar@email.com',
            phone: '+91-9876543210',
            dateOfBirth: '1985-03-15',
            nationality: 'Indian',
            passportNumber: 'A1234567',
            gender: 'male',
          },
          address: {
            street: '123 MG Road',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            zipCode: '400001',
          },
          emergencyContacts: [
            {
              name: 'Priya Kumar',
              relationship: 'Spouse',
              phone: '+91-9876543211',
              email: 'priya.kumar@email.com',
            },
          ],
          travelInfo: {
            visitPurpose: 'Tourism',
            groupSize: 2,
            stayDuration: 7,
            accommodationType: 'Hotel',
            accommodationDetails: 'The Taj Mahal Palace',
          },
          safetyInfo: {
            medicalConditions: [],
            allergies: ['Peanuts'],
            medications: [],
            specialRequirements: '',
          },
          status: 'active',
          createdAt: '2024-01-15T10:30:00Z',
          lastUpdated: '2024-01-20T14:45:00Z',
        };
        
        setTouristData(mockData);
      } catch (error) {
        console.error('Failed to load tourist data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTouristData();
  }, [touristId]);

  const handleSubmit = async (updatedData: any) => {
    try {
      console.log('Updating tourist:', { id: touristId, ...updatedData });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to tourists list on success
      router.push('/dashboard/tourists');
    } catch (error) {
      console.error('Failed to update tourist:', error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading tourist data...</p>
        </div>
      </div>
    );
  }

  if (!touristData) {
    return (
      <div className="text-center space-y-4 py-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Tourist Not Found</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          The requested tourist profile could not be found.
        </p>
        <Button onClick={() => router.push('/dashboard/tourists')}>
          Back to Tourists
        </Button>
      </div>
    );
  }

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
              Edit Tourist Profile
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Update tourist information and safety details
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant={touristData.status === 'active' ? 'default' : 'secondary'}>
            {touristData.status}
          </Badge>
          <User className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Tourist Summary */}
      <Card className="p-4 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold">
              {touristData.personalInfo.firstName[0]}{touristData.personalInfo.lastName[0]}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {touristData.personalInfo.firstName} {touristData.personalInfo.lastName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tourist ID: {touristId} • {touristData.personalInfo.nationality}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date(touristData.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Form Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b pb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Update Tourist Information</h2>
          </div>
          
          <TouristRegistrationForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={touristData}
            isEditing={true}
          />
        </div>
      </Card>

      {/* Important Notice */}
      <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-yellow-900 dark:text-yellow-100">Update Guidelines</h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-200">
              <ul className="list-disc list-inside space-y-1">
                <li>Changes to critical safety information will trigger notifications</li>
                <li>Updated emergency contacts will be verified via SMS/email</li>
                <li>Blockchain identity records will be updated automatically</li>
                <li>Tourist will receive confirmation of profile updates</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}