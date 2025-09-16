/**
 * Smart Tourist Safety System - Tourist Detail Page
 * Comprehensive view of tourist information with real-time status
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Edit,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
  Heart,
  AlertTriangle,
  Clock,
  Users,
  FileText,
  Navigation,
  Activity,
} from 'lucide-react';

// ============================================================================
// TOURIST DETAIL PAGE COMPONENT
// ============================================================================

export default function TouristDetailPage() {
  const router = useRouter();
  const params = useParams();
  const touristId = params.id as string;
  
  const [touristData, setTouristData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading tourist data
    const loadTouristData = async () => {
      try {
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
            profileImage: null,
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
            arrivalDate: '2024-01-15',
            departureDate: '2024-01-22',
          },
          safetyInfo: {
            medicalConditions: ['Diabetes'],
            allergies: ['Peanuts'],
            medications: ['Metformin'],
            specialRequirements: 'Wheelchair accessible accommodation required',
          },
          currentLocation: {
            latitude: 18.9220,
            longitude: 72.8347,
            address: 'Gateway of India, Mumbai',
            lastUpdated: '2024-01-20T15:30:00Z',
          },
          status: 'active',
          riskLevel: 'low',
          assignedOperator: {
            id: 'OP001',
            name: 'Arjun Sharma',
            phone: '+91-9876543222',
          },
          recentActivity: [
            {
              id: 1,
              type: 'location_update',
              message: 'Location updated: Gateway of India',
              timestamp: '2024-01-20T15:30:00Z',
            },
            {
              id: 2,
              type: 'check_in',
              message: 'Check-in completed at hotel',
              timestamp: '2024-01-20T10:15:00Z',
            },
            {
              id: 3,
              type: 'alert_resolved',
              message: 'Safety alert resolved',
              timestamp: '2024-01-19T18:45:00Z',
            },
          ],
          createdAt: '2024-01-15T10:30:00Z',
          lastUpdated: '2024-01-20T15:30:00Z',
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading tourist details...</p>
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
              Tourist Profile
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Complete tourist information and safety status
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => router.push(`/dashboard/tourists/${touristId}/edit`)}
            className="flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </div>

      {/* Tourist Header Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
              {touristData.personalInfo.firstName[0]}{touristData.personalInfo.lastName[0]}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {touristData.personalInfo.firstName} {touristData.personalInfo.lastName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tourist ID: {touristId} • {touristData.personalInfo.nationality}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {touristData.personalInfo.email}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {touristData.personalInfo.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant={touristData.status === 'active' ? 'default' : 'secondary'}>
                {touristData.status}
              </Badge>
              <Badge variant={touristData.riskLevel === 'low' ? 'secondary' : 'destructive'}>
                {touristData.riskLevel} risk
              </Badge>
            </div>
            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Last seen: {new Date(touristData.currentLocation.lastUpdated).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="travel">Travel Info</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Location */}
            <Card className="p-4">
              <h3 className="font-medium mb-3 flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Current Location</span>
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {touristData.currentLocation.address}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Lat: {touristData.currentLocation.latitude}, Lng: {touristData.currentLocation.longitude}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Updated: {new Date(touristData.currentLocation.lastUpdated).toLocaleString()}
                </p>
              </div>
            </Card>

            {/* Assigned Operator */}
            <Card className="p-4">
              <h3 className="font-medium mb-3 flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Assigned Operator</span>
              </h3>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {touristData.assignedOperator.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  ID: {touristData.assignedOperator.id}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {touristData.assignedOperator.phone}
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="personal" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</label>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {new Date(touristData.personalInfo.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</label>
                <p className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                  {touristData.personalInfo.gender}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Passport Number</label>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {touristData.personalInfo.passportNumber}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nationality</label>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {touristData.personalInfo.nationality}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-4">Address</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {touristData.address.street}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {touristData.address.city}, {touristData.address.state} {touristData.address.zipCode}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {touristData.address.country}
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="travel" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Travel Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Visit Purpose</label>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {touristData.travelInfo.visitPurpose}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Group Size</label>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {touristData.travelInfo.groupSize} people
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Stay Duration</label>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {touristData.travelInfo.stayDuration} days
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Accommodation</label>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {touristData.travelInfo.accommodationType}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Accommodation Details</label>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {touristData.travelInfo.accommodationDetails}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-medium mb-4 flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Safety Information</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Medical Conditions</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {touristData.safetyInfo.medicalConditions.length > 0 ? (
                    touristData.safetyInfo.medicalConditions.map((condition: string, index: number) => (
                      <Badge key={index} variant="outline">{condition}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">None reported</span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Allergies</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {touristData.safetyInfo.allergies.length > 0 ? (
                    touristData.safetyInfo.allergies.map((allergy: string, index: number) => (
                      <Badge key={index} variant="destructive">{allergy}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">None reported</span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Medications</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {touristData.safetyInfo.medications.length > 0 ? (
                    touristData.safetyInfo.medications.map((medication: string, index: number) => (
                      <Badge key={index} variant="secondary">{medication}</Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">None reported</span>
                  )}
                </div>
              </div>
              
              {touristData.safetyInfo.specialRequirements && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Special Requirements</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                    {touristData.safetyInfo.specialRequirements}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-4">Emergency Contacts</h3>
            <div className="space-y-3">
              {touristData.emergencyContacts.map((contact: any, index: number) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{contact.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{contact.relationship}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-gray-600 dark:text-gray-300">{contact.phone}</p>
                      <p className="text-gray-500 dark:text-gray-400">{contact.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-medium mb-4 flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Recent Activity</span>
            </h3>
            <div className="space-y-3">
              {touristData.recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-gray-100">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}