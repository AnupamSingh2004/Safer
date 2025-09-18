'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  UserPlus, 
  ArrowLeft, 
  Save,
  Phone,
  Mail,
  MapPin,
  Shield,
  Clock,
  Star
} from 'lucide-react';

interface CreateOperatorForm {
  name: string;
  email: string;
  phone: string;
  role: 'senior_operator' | 'operator' | 'trainee';
  shift: 'morning' | 'afternoon' | 'evening' | 'night';
  location: string;
  maxCapacity: number;
  specializations: string[];
  emergencyResponse: boolean;
}

export default function CreateOperatorPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateOperatorForm>({
    name: '',
    email: '',
    phone: '',
    role: 'operator',
    shift: 'morning',
    location: '',
    maxCapacity: 8,
    specializations: [],
    emergencyResponse: false
  });

  const neStates = [
    'Arunachal Pradesh',
    'Assam',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Sikkim',
    'Tripura'
  ];

  const popularLocations = [
    'Tawang Monastery, Arunachal Pradesh',
    'Kaziranga National Park, Assam',
    'Loktak Lake, Manipur',
    'Living Root Bridges, Meghalaya',
    'Aizawl Hills, Mizoram',
    'Kohima War Cemetery, Nagaland',
    'Gangtok, Sikkim',
    'Agartala, Tripura'
  ];

  const availableSpecializations = [
    'High Altitude Trekking',
    'Wildlife Tourism',
    'Cultural Heritage',
    'Adventure Sports',
    'Eco-Tourism',
    'Emergency Response',
    'River Navigation',
    'Night Security',
    'Medical Assistance',
    'Language: Hindi',
    'Language: English',
    'Language: Assamese',
    'Language: Manipuri',
    'Language: Khasi',
    'Language: Mizo',
    'Language: Naga',
    'Language: Monpa'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate new operator ID
    const newOperatorId = `OP${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    console.log('Creating new operator:', { id: newOperatorId, ...formData });
    
    setIsSubmitting(false);
    router.push('/dashboard/operators');
  };

  const handleSpecializationToggle = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <UserPlus className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              Add New Tourism Operator
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
              Create a new field guide for North East India tourism safety
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <UserPlus className="w-5 h-5" />
                Basic Information
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter operator's full name"
                    required
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="operator@netourism.gov.in"
                    required
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91-9436XXXXXX"
                    required
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Primary Location
                  </Label>
                  <select
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select primary location</option>
                    {popularLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role and Schedule */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Shield className="w-5 h-5" />
                Role and Schedule
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Define operator role, shift timing, and capacity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Role</Label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="trainee">Trainee</option>
                    <option value="operator">Operator</option>
                    <option value="senior_operator">Senior Operator</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Shift
                  </Label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData(prev => ({ ...prev, shift: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="morning">Morning (6 AM - 2 PM)</option>
                    <option value="afternoon">Afternoon (2 PM - 10 PM)</option>
                    <option value="evening">Evening (10 PM - 6 AM)</option>
                    <option value="night">Night (10 PM - 6 AM)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-gray-300">Max Tourist Capacity</Label>
                  <Input
                    type="number"
                    min="1"
                    max="15"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) }))}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emergency"
                  checked={formData.emergencyResponse}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyResponse: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="emergency" className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Shield className="w-4 h-4 text-red-500" />
                  Emergency Response Certified
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Specializations */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Star className="w-5 h-5" />
                Specializations
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Select areas of expertise and language skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-3">
                {availableSpecializations.map(specialization => (
                  <label key={specialization} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.specializations.includes(specialization)}
                      onChange={() => handleSpecializationToggle(specialization)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{specialization}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Operator
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}