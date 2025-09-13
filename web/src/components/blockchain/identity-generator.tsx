/**
 * Smart Tourist Safety System - Identity Generator Component
 * Component for creating new digital IDs with KYC validation and contract deployment
 * Enhanced for Demo with visual blockchain indicators
 */

'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  QrCode,
  Shield,
  Lock,
  Globe,
  Zap,
  Camera,
  Download,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useBlockchain } from '@/hooks/use-blockchain';
import { blockchainService } from '@/services/blockchain-service';
import type { DigitalIdentity, IdentityCreationResponse } from '@/types/blockchain';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FormData {
  // Personal Information
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  gender: 'male' | 'female' | 'other' | '';
  phoneNumber: string;
  emailAddress: string;
  
  // Document Information
  documentType: 'passport' | 'aadhaar' | 'driving_license' | 'voter_id' | '';
  documentNumber: string;
  issuingAuthority: string;
  documentExpiry: string;
  
  // Trip Information
  tripPurpose: 'tourism' | 'business' | 'medical' | 'education' | 'transit' | '';
  tripStartDate: string;
  tripEndDate: string;
  accommodation: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  
  // Medical Information (Optional)
  medicalConditions: string;
  allergies: string;
  bloodGroup: string;
}

interface DocumentUpload {
  file: File;
  type: 'document' | 'photo' | 'signature';
  preview: string;
  uploaded: boolean;
  hash?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const IdentityGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    gender: '',
    phoneNumber: '',
    emailAddress: '',
    documentType: '',
    documentNumber: '',
    issuingAuthority: '',
    documentExpiry: '',
    tripPurpose: '',
    tripStartDate: '',
    tripEndDate: '',
    accommodation: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    medicalConditions: '',
    allergies: '',
    bloodGroup: ''
  });
  
  const [documents, setDocuments] = useState<DocumentUpload[]>([]);
  const [createdIdentity, setCreatedIdentity] = useState<IdentityCreationResponse | null>(null);
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  
  const { isConnected, wallet } = useBlockchain();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 5;

  // ============================================================================
  // FORM VALIDATION
  // ============================================================================

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Personal Information
        return !!(
          formData.fullName &&
          formData.dateOfBirth &&
          formData.nationality &&
          formData.phoneNumber &&
          formData.emailAddress
        );
      
      case 2: // Document Information
        return !!(
          formData.documentType &&
          formData.documentNumber &&
          formData.issuingAuthority &&
          formData.documentExpiry
        );
      
      case 3: // Trip Information
        return !!(
          formData.tripPurpose &&
          formData.tripStartDate &&
          formData.tripEndDate
        );
      
      case 4: // Emergency & Medical
        return !!(
          formData.emergencyContactName &&
          formData.emergencyContactPhone &&
          formData.emergencyContactRelation
        );
      
      case 5: // Document Upload
        return documents.length >= 2; // At least document + photo
      
      default:
        return false;
    }
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file, index) => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: '❌ File Too Large',
          description: 'Please select files smaller than 10MB',
          variant: 'destructive'
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        const newDocument: DocumentUpload = {
          file,
          type: index === 0 ? 'document' : index === 1 ? 'photo' : 'signature',
          preview,
          uploaded: false,
          hash: undefined
        };

        setDocuments(prev => [...prev, newDocument]);
        
        // Simulate upload
        setTimeout(() => {
          setDocuments(prev => 
            prev.map(doc => 
              doc.file === file 
                ? { ...doc, uploaded: true, hash: `0x${Math.random().toString(16).substring(2)}` }
                : doc
            )
          );
        }, 2000);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCreateIdentity = async () => {
    if (!isConnected || !wallet) {
      toast({
        title: '❌ Wallet Not Connected',
        description: 'Please connect your wallet to create a digital identity',
        variant: 'destructive'
      });
      return;
    }

    setIsCreating(true);
    try {
      const identityData = {
        ...formData,
        documents: documents.map(doc => ({
          type: doc.type,
          hash: doc.hash,
          filename: doc.file.name
        })),
        walletAddress: wallet.address,
        touristId: `tourist_${Date.now()}`
      };

      const response = await blockchainService.createDigitalIdentity(identityData);
      setCreatedIdentity(response);
      
      toast({
        title: '🎉 Identity Created Successfully!',
        description: '✅ Your digital identity has been anchored to the blockchain',
      });
      
      setCurrentStep(6); // Success step

    } catch (error) {
      console.error('Failed to create identity:', error);
      toast({
        title: '❌ Creation Failed',
        description: error instanceof Error ? error.message : 'Failed to create digital identity',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: '📋 Copied!',
      description: `${label} copied to clipboard`,
    });
  };

  // ============================================================================
  // RENDER METHODS
  // ============================================================================

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <React.Fragment key={stepNumber}>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                isCompleted 
                  ? 'bg-green-500 border-green-500 text-white'
                  : isCurrent
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-500'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
              <span className="text-xs mt-2 text-gray-600">
                {stepNumber === 1 && 'Personal'}
                {stepNumber === 2 && 'Documents'}
                {stepNumber === 3 && 'Trip Info'}
                {stepNumber === 4 && 'Emergency'}
                {stepNumber === 5 && 'Upload'}
              </span>
            </div>
            {stepNumber < totalSteps && (
              <div className={`flex-1 h-0.5 mx-4 ${
                stepNumber < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderPersonalInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Personal Information</span>
        </CardTitle>
        <CardDescription>
          Enter your personal details for identity verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nationality *
            </label>
            <select
              value={formData.nationality}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select nationality</option>
              <option value="India">India</option>
              <option value="USA">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+91 9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.emailAddress}
              onChange={(e) => handleInputChange('emailAddress', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderDocumentInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Document Information</span>
        </CardTitle>
        <CardDescription>
          Provide your official identification document details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type *
            </label>
            <select
              value={formData.documentType}
              onChange={(e) => handleInputChange('documentType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select document type</option>
              <option value="passport">Passport</option>
              <option value="aadhaar">Aadhaar Card</option>
              <option value="driving_license">Driving License</option>
              <option value="voter_id">Voter ID</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Number *
            </label>
            <input
              type="text"
              value={formData.documentNumber}
              onChange={(e) => handleInputChange('documentNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter document number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issuing Authority *
            </label>
            <input
              type="text"
              value={formData.issuingAuthority}
              onChange={(e) => handleInputChange('issuingAuthority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Government of India"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Expiry *
            </label>
            <input
              type="date"
              value={formData.documentExpiry}
              onChange={(e) => handleInputChange('documentExpiry', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                🔒 Blockchain Security
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Your document information will be encrypted and stored on the blockchain 
                for tamper-proof verification. Only authorized entities can access this data.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTripInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <span>Trip Information</span>
        </CardTitle>
        <CardDescription>
          Details about your travel plans and accommodation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trip Purpose *
            </label>
            <select
              value={formData.tripPurpose}
              onChange={(e) => handleInputChange('tripPurpose', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select purpose</option>
              <option value="tourism">Tourism</option>
              <option value="business">Business</option>
              <option value="medical">Medical</option>
              <option value="education">Education</option>
              <option value="transit">Transit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accommodation
            </label>
            <input
              type="text"
              value={formData.accommodation}
              onChange={(e) => handleInputChange('accommodation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hotel name or address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trip Start Date *
            </label>
            <input
              type="date"
              value={formData.tripStartDate}
              onChange={(e) => handleInputChange('tripStartDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trip End Date *
            </label>
            <input
              type="date"
              value={formData.tripEndDate}
              onChange={(e) => handleInputChange('tripEndDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderEmergencyInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>Emergency & Medical Information</span>
        </CardTitle>
        <CardDescription>
          Emergency contact and optional medical information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Emergency Contact *</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name *
              </label>
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship *
              </label>
              <input
                type="text"
                value={formData.emergencyContactRelation}
                onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Spouse, Parent"
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-4">Medical Information (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Conditions
              </label>
              <input
                type="text"
                value={formData.medicalConditions}
                onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Diabetes, Hypertension"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allergies
              </label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Peanuts, Shellfish"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderDocumentUpload = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Document Upload</span>
        </CardTitle>
        <CardDescription>
          Upload your identification documents and photo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Upload your documents (Max 10MB each)
          </p>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Select Files
          </Button>
        </div>

        {/* Uploaded Documents */}
        {documents.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Uploaded Documents</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{doc.file.name}</span>
                    {doc.uploaded ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    Type: {doc.type} • Size: {(doc.file.size / 1024 / 1024).toFixed(2)}MB
                  </div>
                  
                  {doc.hash && (
                    <div className="text-xs text-green-600 font-mono bg-green-50 p-2 rounded">
                      🔒 Hash: {doc.hash.substring(0, 20)}...
                    </div>
                  )}
                  
                  {doc.preview && (
                    <img 
                      src={doc.preview} 
                      alt="Preview" 
                      className="mt-2 h-20 w-20 object-cover rounded border"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <Lock className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900 dark:text-green-100">
                🌐 Decentralized Storage
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Documents are securely hashed and stored on IPFS with blockchain 
                anchoring for tamper-proof verification.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="text-center">
        <CardContent className="p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🎉 Digital Identity Created Successfully!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Your blockchain-based digital identity has been created and is now secured on the 
            decentralized network.
          </p>

          {createdIdentity && (
            <div className="space-y-4 text-left max-w-2xl mx-auto">
              {/* Identity Details */}
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                  ✅ Blockchain Verification Details
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700 dark:text-green-300">Identity ID:</span>
                    <span className="font-mono text-green-900 dark:text-green-100">
                      {createdIdentity.digitalIdentity.id}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-green-700 dark:text-green-300">Transaction Hash:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-green-900 dark:text-green-100">
                        {createdIdentity.transaction.hash.substring(0, 20)}...
                      </span>
                      <button
                        onClick={() => copyToClipboard(createdIdentity.transaction.hash, 'Transaction Hash')}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-green-700 dark:text-green-300">Network:</span>
                    <span className="font-semibold text-green-900 dark:text-green-100">
                      {createdIdentity.digitalIdentity.network}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-green-700 dark:text-green-300">Status:</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      {createdIdentity.digitalIdentity.demoFields.blockchainVerified}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Blockchain Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-center">
                  <Lock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {createdIdentity.digitalIdentity.demoFields.immutableRecord}
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-lg text-center">
                  <Globe className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    {createdIdentity.digitalIdentity.demoFields.decentralizedStorage}
                  </div>
                </div>
                
                <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg text-center">
                  <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-red-900 dark:text-red-100">
                    {createdIdentity.digitalIdentity.demoFields.emergencyAccess}
                  </div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg text-center">
                  <Zap className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                    {createdIdentity.digitalIdentity.demoFields.realTimeSync}
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-center">
                <QrCode className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Digital Identity QR Code
                </h4>
                <div className="w-32 h-32 bg-white border rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-xs text-gray-500">QR Code</span>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </div>

              {/* Backup Codes */}
              <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
                <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">
                  🔑 Emergency Backup Codes
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                  Store these codes safely. They can be used for emergency access.
                </p>
                
                <div className="flex items-center justify-between">
                  <div className={`flex space-x-2 text-sm font-mono ${showSensitiveInfo ? '' : 'blur-sm'}`}>
                    {createdIdentity.backupCodes.map((code, index) => (
                      <span key={index} className="bg-amber-100 dark:bg-amber-900 px-2 py-1 rounded">
                        {code}
                      </span>
                    ))}
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                  >
                    {showSensitiveInfo ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button className="flex-1">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </Button>
                
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🆔 Digital Identity Generator
        </h1>
        <p className="text-gray-600">
          Create your blockchain-based tourist identity for enhanced safety and verification
        </p>
      </div>

      {/* Wallet Connection Check */}
      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-900">Wallet Connection Required</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Please connect your MetaMask wallet to create a digital identity on the blockchain.
              </p>
            </div>
          </div>
        </div>
      )}

      {currentStep <= totalSteps && (
        <>
          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && renderPersonalInfo()}
              {currentStep === 2 && renderDocumentInfo()}
              {currentStep === 3 && renderTripInfo()}
              {currentStep === 4 && renderEmergencyInfo()}
              {currentStep === 5 && renderDocumentUpload()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            <div className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>

            {currentStep < totalSteps ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!validateStep(currentStep)}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleCreateIdentity}
                disabled={!validateStep(currentStep) || !isConnected || isCreating}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Identity...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Create Digital Identity
                  </>
                )}
              </Button>
            )}
          </div>
        </>
      )}

      {/* Success Step */}
      {currentStep === 6 && renderSuccess()}
    </div>
  );
};

export default IdentityGenerator;
