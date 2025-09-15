/**
 * Smart Tourist Safety System - Tourist Registration Demo
 * Simulates blockchain digital identity creation with KYC verification
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield,
  User,
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  QrCode,
  Fingerprint,
  CreditCard,
  MapPin,
  Clock,
  Link,
  Download,
  Eye,
  Copy
} from 'lucide-react';
import { useAuth } from '@/stores/auth-store';
import { cn } from '@/lib/utils';

interface RegistrationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'current' | 'completed';
  isRequired: boolean;
}

interface TouristFormData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  
  // Travel Information
  arrivalDate: string;
  departureDate: string;
  purpose: string;
  accommodation: string;
  
  // Emergency Contact
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  
  // Documents
  profilePhoto: File | null;
  passportScan: File | null;
  visaScan: File | null;
}

const registrationSteps: RegistrationStep[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Basic details and identification',
    status: 'current',
    isRequired: true
  },
  {
    id: 'travel',
    title: 'Travel Details',
    description: 'Trip information and accommodation',
    status: 'pending',
    isRequired: true
  },
  {
    id: 'emergency',
    title: 'Emergency Contact',
    description: 'Emergency contact information',
    status: 'pending',
    isRequired: true
  },
  {
    id: 'documents',
    title: 'Document Upload',
    description: 'Photo and document verification',
    status: 'pending',
    isRequired: true
  },
  {
    id: 'verification',
    title: 'KYC Verification',
    description: 'Identity verification process',
    status: 'pending',
    isRequired: true
  },
  {
    id: 'blockchain',
    title: 'Digital ID Creation',
    description: 'Blockchain identity generation',
    status: 'pending',
    isRequired: true
  },
  {
    id: 'completion',
    title: 'Registration Complete',
    description: 'Download credentials and QR code',
    status: 'pending',
    isRequired: false
  }
];

export default function TouristRegistrationPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<TouristFormData>({
    fullName: '',
    email: '',
    phone: '',
    nationality: '',
    passportNumber: '',
    dateOfBirth: '',
    gender: 'male',
    arrivalDate: '',
    departureDate: '',
    purpose: 'tourism',
    accommodation: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    profilePhoto: null,
    passportScan: null,
    visaScan: null
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [blockchainHash, setBlockchainHash] = useState<string | null>(null);
  
  // Demo data for quick testing
  const fillDemoData = () => {
    setFormData({
      fullName: 'Emma Thompson',
      email: 'emma.thompson@email.com',
      phone: '+44-7700-900123',
      nationality: 'United Kingdom',
      passportNumber: 'GBR123456789',
      dateOfBirth: '1985-03-15',
      gender: 'female',
      arrivalDate: '2025-01-15',
      departureDate: '2025-01-25',
      purpose: 'tourism',
      accommodation: 'Hotel Taj Palace, New Delhi',
      emergencyName: 'James Thompson',
      emergencyPhone: '+44-7700-900456',
      emergencyRelation: 'Spouse',
      profilePhoto: null,
      passportScan: null,
      visaScan: null
    });
  };

  // Simulate blockchain ID generation
  const generateDigitalId = async () => {
    setIsProcessing(true);
    
    // Simulate API calls
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const digitalId = `DID:INDIA:${Date.now()}:${Math.random().toString(36).substring(7)}`;
    const blockchainTx = `0x${Math.random().toString(16).substring(2, 66)}`;
    
    setGeneratedId(digitalId);
    setBlockchainHash(blockchainTx);
    setIsProcessing(false);
    
    // Auto advance to completion
    setCurrentStep(6);
  };

  const handleNext = () => {
    if (currentStep < registrationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    const step = registrationSteps[currentStep];
    
    switch (step.id) {
      case 'personal':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Personal Information
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Please provide your basic personal details
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nationality *
                </label>
                <select
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Select nationality</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                  <option value="Singapore">Singapore</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Passport Number *
                </label>
                <input
                  type="text"
                  value={formData.passportNumber}
                  onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter passport number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={fillDemoData}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Fill Demo Data
              </button>
            </div>
          </div>
        );

      case 'verification':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Fingerprint className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                KYC Verification
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Automated identity verification in progress
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                { step: 'Document Analysis', status: 'completed', time: '2.3s' },
                { step: 'Facial Recognition', status: 'completed', time: '1.8s' },
                { step: 'Passport Validation', status: 'completed', time: '3.1s' },
                { step: 'Background Check', status: 'processing', time: '5.2s' },
                { step: 'Risk Assessment', status: 'pending', time: '--' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    {item.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {item.status === 'processing' && <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
                    {item.status === 'pending' && <Clock className="w-5 h-5 text-gray-400" />}
                    <span className="font-medium text-gray-900 dark:text-white">{item.step}</span>
                  </div>
                  <span className="text-sm text-gray-500">{item.time}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-300">
                  Verification Successful
                </span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                All identity checks passed. Ready for blockchain registration.
              </p>
            </div>
          </div>
        );

      case 'blockchain':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Blockchain Digital ID
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Creating your secure digital identity on the blockchain
              </p>
            </div>
            
            {!generatedId ? (
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <div className="p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
                      Smart Contract Deployment
                    </h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Your identity will be stored on India's National Blockchain Network using the TouristIdentity.sol smart contract.
                    </p>
                  </div>
                  
                  <button
                    onClick={generateDigitalId}
                    disabled={isProcessing}
                    className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Digital ID...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Generate Blockchain ID
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h4 className="font-semibold text-green-900 dark:text-green-200">
                      Digital ID Successfully Created!
                    </h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Digital Identity (DID)
                      </label>
                      <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
                        <code className="flex-1 text-sm text-gray-900 dark:text-white font-mono">
                          {generatedId}
                        </code>
                        <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Blockchain Transaction
                      </label>
                      <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
                        <code className="flex-1 text-sm text-gray-900 dark:text-white font-mono">
                          {blockchainHash}
                        </code>
                        <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <Link className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'completion':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Registration Complete!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your digital tourist identity has been successfully created
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="text-center">
                  <QrCode className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Tourist QR Code
                  </h4>
                  <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    <Download className="w-4 h-4 inline mr-2" />
                    Download QR
                  </button>
                </div>
              </div>
              
              <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="text-center">
                  <CreditCard className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Digital Tourist Card
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <p><strong>Name:</strong> {formData.fullName}</p>
                    <p><strong>ID:</strong> {generatedId?.slice(-8)}</p>
                    <p><strong>Valid Until:</strong> {formData.departureDate}</p>
                  </div>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                    <Download className="w-4 h-4 inline mr-2" />
                    Download Card
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Next Steps
              </h4>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li>• Download and install the Smart Tourist Safety mobile app</li>
                <li>• Keep your QR code accessible for zone check-ins</li>
                <li>• Emergency services can identify you using your digital ID</li>
                <li>• Your location will be monitored for safety purposes</li>
              </ul>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Return to Dashboard
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Register Another Tourist
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {step.description}
            </p>
            <p className="text-sm text-gray-500">
              This step will be implemented in the full version.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Tourist Registration System
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create your secure digital identity for safe travel in India
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {registrationSteps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  'flex items-center gap-2',
                  index < registrationSteps.length - 1 && 'flex-1'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  index === currentStep
                    ? 'bg-blue-600 text-white'
                    : index < currentStep
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                )}>
                  {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                <span className={cn(
                  'text-sm font-medium hidden sm:block',
                  index === currentStep
                    ? 'text-blue-600'
                    : index < currentStep
                    ? 'text-green-600'
                    : 'text-gray-500'
                )}>
                  {step.title}
                </span>
                {index < registrationSteps.length - 1 && (
                  <div className={cn(
                    'flex-1 h-px mx-4',
                    index < currentStep ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentStep < registrationSteps.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next Step
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}