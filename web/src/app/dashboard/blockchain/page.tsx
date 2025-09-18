/**
 * Smart Tourist Safety System - Admin Verification Dashboard
 * Manual verification workflow for tourist applications and digital ID generation
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Users,
  Link as LinkIcon,
  Hash,
  Activity,
  Eye,
  Download,
  Search,
  Filter,
  MapPin,
  UserCheck,
  XCircle,
  Edit,
  Upload,
  FileCheck,
  QrCode,
  Send,
  RotateCcw,
  User,
  Calendar,
  MapIcon,
  Phone,
  Mail,
  FileText,
  CheckSquare,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Pending verification applications (main workflow focus)
const initialApplications = [
  {
    id: 'APP-001',
    applicationId: 'NE-APP-2025-001',
    tourist: {
      name: 'Michael Rodriguez',
      nationality: 'Spanish',
      passportNo: 'ESP123456789',
      email: 'michael.rodriguez@email.com',
      phone: '+34-612-345-678',
      photo: '/placeholder-profile.jpg'
    },
    documents: [
      { type: 'passport', status: 'uploaded', verified: false, url: '/docs/passport-esp123.pdf' },
      { type: 'visa', status: 'uploaded', verified: false, url: '/docs/visa-esp123.pdf' },
      { type: 'travel_insurance', status: 'uploaded', verified: false, url: '/docs/insurance-esp123.pdf' },
      { type: 'itinerary', status: 'uploaded', verified: false, url: '/docs/itinerary-esp123.pdf' }
    ],
    travelDetails: {
      entryPoint: 'Guwahati Airport',
      entryDate: '2025-01-20',
      duration: '14 days',
      purpose: 'Heritage Tourism',
      destinations: ['Kaziranga National Park', 'Majuli Island', 'Tawang Monastery'],
      accommodation: 'Hotel Brahmaputra, Guwahati'
    },
    submittedAt: '2025-01-15 14:30:00',
    currentStatus: 'document_review',
    priority: 'normal',
    assignedTo: 'Admin Team',
    verificationHistory: [
      { step: 'application_submitted', timestamp: '2025-01-15 14:30:00', status: 'completed', operator: 'System' },
      { step: 'initial_screening', timestamp: '2025-01-15 14:35:00', status: 'completed', operator: 'Auto-Validator' },
      { step: 'document_review', timestamp: '2025-01-15 14:40:00', status: 'in_progress', operator: 'Admin' },
      { step: 'background_check', timestamp: null, status: 'pending', operator: null },
      { step: 'digital_id_generation', timestamp: null, status: 'pending', operator: null }
    ]
  },
  {
    id: 'APP-002',
    applicationId: 'NE-APP-2025-002',
    tourist: {
      name: 'Yuki Tanaka',
      nationality: 'Japanese',
      passportNo: 'JPN987654321',
      email: 'yuki.tanaka@email.com',
      phone: '+81-90-1234-5678',
      photo: '/placeholder-profile.jpg'
    },
    documents: [
      { type: 'passport', status: 'uploaded', verified: true, url: '/docs/passport-jpn987.pdf' },
      { type: 'visa', status: 'uploaded', verified: true, url: '/docs/visa-jpn987.pdf' },
      { type: 'travel_insurance', status: 'uploaded', verified: false, url: '/docs/insurance-jpn987.pdf' },
      { type: 'health_certificate', status: 'uploaded', verified: false, url: '/docs/health-jpn987.pdf' }
    ],
    travelDetails: {
      entryPoint: 'Imphal Airport',
      entryDate: '2025-01-22',
      duration: '10 days',
      purpose: 'Cultural Exchange',
      destinations: ['Imphal War Cemetery', 'Loktak Lake', 'Kangla Fort'],
      accommodation: 'Hotel Imphal, Imphal'
    },
    submittedAt: '2025-01-15 13:45:00',
    currentStatus: 'background_check',
    priority: 'high',
    assignedTo: 'Senior Admin',
    verificationHistory: [
      { step: 'application_submitted', timestamp: '2025-01-15 13:45:00', status: 'completed', operator: 'System' },
      { step: 'initial_screening', timestamp: '2025-01-15 13:50:00', status: 'completed', operator: 'Auto-Validator' },
      { step: 'document_review', timestamp: '2025-01-15 14:00:00', status: 'completed', operator: 'Admin' },
      { step: 'background_check', timestamp: '2025-01-15 14:15:00', status: 'in_progress', operator: 'Senior Admin' },
      { step: 'digital_id_generation', timestamp: null, status: 'pending', operator: null }
    ]
  },
  {
    id: 'APP-003',
    applicationId: 'NE-APP-2025-003',
    tourist: {
      name: 'Emma Thompson',
      nationality: 'British',
      passportNo: 'GBR456789123',
      email: 'emma.thompson@email.com',
      phone: '+44-7700-123456',
      photo: '/placeholder-profile.jpg'
    },
    documents: [
      { type: 'passport', status: 'uploaded', verified: true, url: '/docs/passport-gbr456.pdf' },
      { type: 'visa', status: 'uploaded', verified: true, url: '/docs/visa-gbr456.pdf' },
      { type: 'travel_insurance', status: 'missing', verified: false, url: null },
      { type: 'accommodation_proof', status: 'uploaded', verified: true, url: '/docs/accommodation-gbr456.pdf' }
    ],
    travelDetails: {
      entryPoint: 'Silchar Airport',
      entryDate: '2025-01-25',
      duration: '7 days',
      purpose: 'Adventure Tourism',
      destinations: ['Dzukou Valley', 'Living Root Bridges', 'Cherrapunji'],
      accommodation: 'Mountain View Resort, Shillong'
    },
    submittedAt: '2025-01-15 12:20:00',
    currentStatus: 'background_cleared',
    priority: 'normal',
    assignedTo: 'Admin Team',
    verificationHistory: [
      { step: 'application_submitted', timestamp: '2025-01-15 12:20:00', status: 'completed', operator: 'System' },
      { step: 'initial_screening', timestamp: '2025-01-15 12:25:00', status: 'completed', operator: 'Auto-Validator' },
      { step: 'document_review', timestamp: '2025-01-15 12:30:00', status: 'completed', operator: 'Admin' },
      { step: 'background_check', timestamp: '2025-01-15 12:45:00', status: 'completed', operator: 'Senior Admin' },
      { step: 'digital_id_generation', timestamp: null, status: 'pending', operator: null }
    ]
  }
];

const verificationStats = {
  totalApplications: 47,
  pendingReview: 3,
  approvedToday: 8,
  digitalIDsGenerated: 23,
  avgProcessingTime: '2.4 hrs'
};

const generatedDigitalIDs = [
  {
    id: 'DID-001',
    digitalId: 'NE-DID-67890',
    touristName: 'Rajesh Sharma',
    nationality: 'Indian (Delhi)',
    passportNo: 'IND123456789',
    generatedAt: '2025-01-15 10:30:00',
    expiresAt: '2025-02-14',
    status: 'active',
    qrCode: 'QR-NE-DID-67890',
    blockchainHash: '0x4f7b2a1c9e8d...'
  },
  {
    id: 'DID-002',
    digitalId: 'NE-DID-54321',
    touristName: 'Sarah Kim',
    nationality: 'South Korean',
    passportNo: 'KOR987654321',
    generatedAt: '2025-01-15 09:45:00',
    expiresAt: '2025-02-10',
    status: 'active',
    qrCode: 'QR-NE-DID-54321',
    blockchainHash: '0x8d2b5e3f1a7c...'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'document_review': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
    case 'background_check': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
    case 'background_cleared': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    case 'approved': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    case 'rejected': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
    case 'completed': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    case 'in_progress': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
    case 'pending': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
    case 'active': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
  }
};

const BlockchainPage = () => {
  const [applications, setApplications] = useState(initialApplications);
  const [selectedApplication, setSelectedApplication] = useState(initialApplications[0]); // Pre-select first application
  const [digitalIDs, setDigitalIDs] = useState(generatedDigitalIDs);
  const [stats, setStats] = useState(verificationStats);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalApplications: prev.totalApplications + Math.floor(Math.random() * 2),
        approvedToday: prev.approvedToday + (Math.random() > 0.9 ? 1 : 0),
        digitalIDsGenerated: prev.digitalIDsGenerated + (Math.random() > 0.95 ? 1 : 0)
      }));
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle verification status update - THIS IS THE KEY FUNCTIONALITY
  const handleStatusUpdate = async (applicationId: string, newStatus: string, step: string) => {
    setProcessingAction(step);
    
    // Simulate processing time
    setTimeout(() => {
      setApplications(prev => prev.map(app => {
        if (app.id === applicationId) {
          const updatedHistory = app.verificationHistory.map(h => {
            if (h.step === step) {
              return {
                ...h,
                status: 'completed',
                timestamp: new Date().toLocaleString(),
                operator: 'Admin User'
              };
            }
            return h;
          });

          // Update current status and next step
          let nextStatus = newStatus;
          if (step === 'document_review' && newStatus === 'documents_verified') {
            nextStatus = 'background_check';
            // Update next step to in_progress
            updatedHistory.forEach(h => {
              if (h.step === 'background_check') {
                h.status = 'in_progress';
                h.timestamp = new Date().toLocaleString();
                h.operator = 'Admin User';
              }
            });
          } else if (step === 'background_check' && newStatus === 'background_cleared') {
            nextStatus = 'background_cleared';
          }

          return {
            ...app,
            currentStatus: nextStatus,
            verificationHistory: updatedHistory
          };
        }
        return app;
      }));

      // Update selected application
      setSelectedApplication(prev => {
        if (prev?.id === applicationId) {
          const updated = applications.find(app => app.id === applicationId);
          return updated || prev;
        }
        return prev;
      });

      setProcessingAction(null);
    }, 2000);
  };

  // Generate Digital ID - FINAL STEP
  const generateDigitalID = async (applicationId: string) => {
    setProcessingAction('digital_id_generation');
    
    setTimeout(() => {
      const application = applications.find(app => app.id === applicationId);
      if (application) {
        // Create new digital ID
        const newDigitalID = {
          id: `DID-${Date.now()}`,
          digitalId: `NE-DID-${Math.floor(Math.random() * 99999)}`,
          touristName: application.tourist.name,
          nationality: application.tourist.nationality,
          passportNo: application.tourist.passportNo,
          generatedAt: new Date().toLocaleString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 30 days
          status: 'active',
          qrCode: `QR-NE-DID-${Math.floor(Math.random() * 99999)}`,
          blockchainHash: `0x${Math.random().toString(16).substr(2, 12)}...`
        };

        setDigitalIDs(prev => [newDigitalID, ...prev]);

        // Update application status
        setApplications(prev => prev.map(app => {
          if (app.id === applicationId) {
            const updatedHistory = app.verificationHistory.map(h => {
              if (h.step === 'digital_id_generation') {
                return {
                  ...h,
                  status: 'completed',
                  timestamp: new Date().toLocaleString(),
                  operator: 'Admin User'
                };
              }
              return h;
            });

            return {
              ...app,
              currentStatus: 'approved',
              verificationHistory: updatedHistory
            };
          }
          return app;
        }));

        // Update stats
        setStats(prev => ({
          ...prev,
          digitalIDsGenerated: prev.digitalIDsGenerated + 1,
          approvedToday: prev.approvedToday + 1
        }));
      }
      
      setProcessingAction(null);
    }, 3000);
  };

  return (
    <div className="dashboard-container">
      {/* Header with Admin Controls */}
      <div className="dashboard-card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              Admin: Tourist Verification & Digital ID Management
              <div className="flex items-center gap-2 ml-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Live</span>
              </div>
            </h1>
            <p className="text-muted-foreground text-base">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mr-3">
                <UserCheck className="w-3 h-3" />
                Admin Dashboard
              </span>
              Manually verify tourist applications and generate digital IDs • Updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">Verification System Online</span>
            </div>
            <button className="btn-secondary px-4 py-2">
              <Download className="w-4 h-4 mr-2" />
              Export Reports
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="dashboard-card p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{stats.pendingReview}</div>
              <div className="text-xs text-muted-foreground">Pending Review</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{stats.approvedToday}</div>
              <div className="text-xs text-muted-foreground">Approved Today</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <QrCode className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{stats.digitalIDsGenerated}</div>
              <div className="text-xs text-muted-foreground">Digital IDs</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{stats.avgProcessingTime}</div>
              <div className="text-xs text-muted-foreground">Avg Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Workflow Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Panel: Pending Applications Queue */}
        <div className="lg:col-span-1">
          <div className="dashboard-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Verification Queue</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {applications.filter(app => app.currentStatus !== 'approved' && app.currentStatus !== 'rejected').length} pending
              </div>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {applications.filter(app => app.currentStatus !== 'approved' && app.currentStatus !== 'rejected').map((app) => (
                <div 
                  key={app.id} 
                  className={cn(
                    "border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                    selectedApplication?.id === app.id 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-border hover:border-primary/30"
                  )}
                  onClick={() => setSelectedApplication(app)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{app.tourist.name}</h4>
                      <p className="text-sm text-muted-foreground">{app.tourist.nationality}</p>
                      <p className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded mt-1">
                        {app.applicationId}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "px-2 py-1 text-xs font-semibold rounded-full",
                        getStatusColor(app.currentStatus)
                      )}>
                        {app.currentStatus.replace('_', ' ')}
                      </span>
                      {app.priority === 'high' && (
                        <div className="text-xs text-red-500 mt-1 font-medium">🔴 Priority</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      Entry: {app.travelDetails.entryPoint}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Selected Application Verification Workflow */}
        <div className="lg:col-span-2">
          {selectedApplication ? (
            <div className="space-y-6">
              
              {/* Application Header with Current Status */}
              <div className="dashboard-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Verifying: {selectedApplication.tourist.name}</h3>
                    <p className="text-muted-foreground">{selectedApplication.applicationId} • {selectedApplication.tourist.nationality}</p>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "px-4 py-2 text-sm font-semibold rounded-full",
                      getStatusColor(selectedApplication.currentStatus)
                    )}>
                      Current Status: {selectedApplication.currentStatus.replace('_', ' ')}
                    </span>
                    <div className="text-sm text-muted-foreground mt-1">
                      Assigned to: {selectedApplication.assignedTo}
                    </div>
                  </div>
                </div>

                {/* Quick Tourist & Travel Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Passport Number</div>
                    <div className="font-medium text-foreground">{selectedApplication.tourist.passportNo}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Entry Point</div>
                    <div className="font-medium text-foreground">{selectedApplication.travelDetails.entryPoint}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Travel Purpose</div>
                    <div className="font-medium text-foreground">{selectedApplication.travelDetails.purpose}</div>
                  </div>
                </div>
              </div>

              {/* Admin Verification Workflow - Main Action Panel */}
              <div className="dashboard-card p-6">
                <h4 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary" />
                  Admin Verification Workflow
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    👆 Click buttons below to manually update verification status
                  </span>
                </h4>
                
                {/* Step-by-step Verification Actions */}
                <div className="space-y-6">
                  
                  {/* Step 1: Document Review */}
                  <div className={cn(
                    "border rounded-xl p-6 transition-all",
                    selectedApplication.currentStatus === 'document_review' 
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg" 
                      : selectedApplication.verificationHistory.find(h => h.step === 'document_review')?.status === 'completed'
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-border bg-muted/20"
                  )}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          selectedApplication.currentStatus === 'document_review' 
                            ? "bg-blue-500 text-white animate-pulse" 
                            : selectedApplication.verificationHistory.find(h => h.step === 'document_review')?.status === 'completed'
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        )}>
                          <span className="text-sm font-bold">1</span>
                        </div>
                        <div>
                          <h5 className="font-semibold text-foreground">Document Review & Verification</h5>
                          <p className="text-sm text-muted-foreground">Verify uploaded documents for authenticity</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedApplication.verificationHistory.find(h => h.step === 'document_review')?.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : selectedApplication.currentStatus === 'document_review' ? (
                          <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                        )}
                      </div>
                    </div>

                    {/* Document List */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {selectedApplication.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                          <div className="flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium capitalize">{doc.type.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.verified ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-500" />
                            )}
                            <button className="btn-secondary px-2 py-1 text-xs">
                              <Eye className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons for Document Review */}
                    {selectedApplication.currentStatus === 'document_review' && (
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleStatusUpdate(selectedApplication.id, 'documents_verified', 'document_review')}
                          disabled={processingAction === 'document_review'}
                          className="btn-primary px-6 py-3 flex-1 flex items-center justify-center gap-2 text-white font-semibold"
                        >
                          <CheckCircle className="w-5 h-5" />
                          {processingAction === 'document_review' ? 'Approving Documents...' : '✅ Approve All Documents'}
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(selectedApplication.id, 'documents_rejected', 'document_review')}
                          disabled={processingAction === 'document_review'}
                          className="btn-destructive px-6 py-3 flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-5 h-5" />
                          ❌ Request More Info
                        </button>
                      </div>
                    )}

                    {selectedApplication.verificationHistory.find(h => h.step === 'document_review')?.status === 'completed' && (
                      <div className="bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg p-3 text-center">
                        <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
                        <div className="text-green-700 dark:text-green-300 font-medium text-sm">✅ Documents Approved!</div>
                      </div>
                    )}
                  </div>

                  {/* Step 2: Background Check */}
                  <div className={cn(
                    "border rounded-xl p-6 transition-all",
                    selectedApplication.currentStatus === 'background_check' 
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg" 
                      : selectedApplication.verificationHistory.find(h => h.step === 'background_check')?.status === 'completed'
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-border bg-muted/20"
                  )}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          selectedApplication.currentStatus === 'background_check' 
                            ? "bg-purple-500 text-white animate-pulse" 
                            : selectedApplication.verificationHistory.find(h => h.step === 'background_check')?.status === 'completed'
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        )}>
                          <span className="text-sm font-bold">2</span>
                        </div>
                        <div>
                          <h5 className="font-semibold text-foreground">Security Background Check</h5>
                          <p className="text-sm text-muted-foreground">Verify against security databases and watchlists</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedApplication.verificationHistory.find(h => h.step === 'background_check')?.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : selectedApplication.currentStatus === 'background_check' ? (
                          <Clock className="w-5 h-5 text-purple-500 animate-pulse" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                        )}
                      </div>
                    </div>

                    {/* Background Check Info */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="p-3 bg-background rounded-lg border text-center">
                        <div className="text-lg font-bold text-green-600">✓</div>
                        <div className="text-xs text-muted-foreground">Criminal Records</div>
                      </div>
                      <div className="p-3 bg-background rounded-lg border text-center">
                        <div className="text-lg font-bold text-green-600">✓</div>
                        <div className="text-xs text-muted-foreground">Watchlist Check</div>
                      </div>
                      <div className="p-3 bg-background rounded-lg border text-center">
                        <div className="text-lg font-bold text-green-600">✓</div>
                        <div className="text-xs text-muted-foreground">Travel History</div>
                      </div>
                    </div>

                    {/* Action Buttons for Background Check */}
                    {selectedApplication.currentStatus === 'background_check' && (
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleStatusUpdate(selectedApplication.id, 'background_cleared', 'background_check')}
                          disabled={processingAction === 'background_check'}
                          className="btn-primary px-6 py-3 flex-1 flex items-center justify-center gap-2 text-white font-semibold"
                        >
                          <Shield className="w-5 h-5" />
                          {processingAction === 'background_check' ? 'Processing Background Check...' : '🛡️ Approve Background Check'}
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(selectedApplication.id, 'background_failed', 'background_check')}
                          disabled={processingAction === 'background_check'}
                          className="btn-destructive px-6 py-3 flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-5 h-5" />
                          🚩 Flag for Review
                        </button>
                      </div>
                    )}

                    {selectedApplication.verificationHistory.find(h => h.step === 'background_check')?.status === 'completed' && (
                      <div className="bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg p-3 text-center">
                        <Shield className="w-6 h-6 text-green-500 mx-auto mb-1" />
                        <div className="text-green-700 dark:text-green-300 font-medium text-sm">🛡️ Background Check Cleared!</div>
                      </div>
                    )}
                  </div>

                  {/* Step 3: Digital ID Generation */}
                  <div className={cn(
                    "border rounded-xl p-6 transition-all",
                    selectedApplication.currentStatus === 'background_cleared' 
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg" 
                      : selectedApplication.verificationHistory.find(h => h.step === 'digital_id_generation')?.status === 'completed'
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-border bg-muted/20"
                  )}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          selectedApplication.currentStatus === 'background_cleared' || 
                          selectedApplication.verificationHistory.find(h => h.step === 'digital_id_generation')?.status === 'completed'
                            ? "bg-green-500 text-white" + (selectedApplication.currentStatus === 'background_cleared' ? " animate-pulse" : "")
                            : "bg-gray-300 text-gray-600"
                        )}>
                          <span className="text-sm font-bold">3</span>
                        </div>
                        <div>
                          <h5 className="font-semibold text-foreground">Generate Digital Tourist ID</h5>
                          <p className="text-sm text-muted-foreground">Create secure blockchain-based digital identity</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedApplication.verificationHistory.find(h => h.step === 'digital_id_generation')?.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : selectedApplication.currentStatus === 'background_cleared' ? (
                          <QrCode className="w-5 h-5 text-green-500 animate-pulse" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                        )}
                      </div>
                    </div>

                    {/* Digital ID Preview */}
                    <div className="p-4 bg-background rounded-lg border mb-4 text-center">
                      <QrCode className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                      <div className="text-sm font-medium text-foreground">Digital Tourist ID</div>
                      <div className="text-xs text-muted-foreground">
                        {selectedApplication.currentStatus === 'background_cleared' 
                          ? '🚀 Ready to generate!' 
                          : 'Will be generated upon approval'
                        }
                      </div>
                    </div>

                    {/* Final Action Button */}
                    {selectedApplication.currentStatus === 'background_cleared' && (
                      <button 
                        onClick={() => generateDigitalID(selectedApplication.id)}
                        disabled={processingAction === 'digital_id_generation'}
                        className="btn-primary px-6 py-4 w-full flex items-center justify-center gap-3 text-lg font-bold text-white bg-green-600 hover:bg-green-700"
                      >
                        <QrCode className="w-6 h-6" />
                        {processingAction === 'digital_id_generation' ? '🔄 Generating Digital ID...' : '🔐 Generate Digital Tourist ID'}
                      </button>
                    )}

                    {selectedApplication.verificationHistory.find(h => h.step === 'digital_id_generation')?.status === 'completed' && (
                      <div className="bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg p-4 text-center">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <div className="text-green-700 dark:text-green-300 font-bold text-lg">🎉 Digital ID Generated Successfully!</div>
                        <div className="text-green-600 dark:text-green-400 text-sm mt-1">Tourist can now use digital ID for travel</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Verification Timeline */}
              <div className="dashboard-card p-6">
                <h4 className="font-semibold text-foreground mb-4">Processing Timeline</h4>
                <div className="space-y-3">
                  {selectedApplication.verificationHistory.map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                        step.status === 'completed' ? "bg-green-500 text-white" :
                        step.status === 'in_progress' ? "bg-blue-500 text-white" :
                        "bg-gray-300 text-gray-600"
                      )}>
                        {step.status === 'completed' ? '✓' : step.status === 'in_progress' ? '●' : '○'}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground capitalize">
                          {step.step.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {step.timestamp && `${step.timestamp} • `}
                          {step.operator && `by ${step.operator}`}
                        </div>
                      </div>
                      <span className={cn(
                        "px-2 py-1 text-xs font-semibold rounded-full",
                        getStatusColor(step.status)
                      )}>
                        {step.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="dashboard-card p-12 text-center">
              <UserCheck className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Select Application to Verify</h3>
              <p className="text-muted-foreground mb-6">
                Choose a pending application from the verification queue to begin the manual verification process.
              </p>
              <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
                <strong>Admin Workflow:</strong> Review documents → Run background check → Generate digital ID
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generated Digital IDs Section */}
      <div className="mt-6">
        <div className="dashboard-card p-6">
          <h3 className="text-lg font-bold text-foreground mb-6">Recently Generated Digital IDs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {digitalIDs.map((id) => (
              <div key={id.id} className="border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{id.touristName}</h4>
                    <p className="text-sm text-muted-foreground">{id.nationality}</p>
                  </div>
                  <span className={cn(
                    "px-2 py-1 text-xs font-semibold rounded-full",
                    getStatusColor(id.status)
                  )}>
                    {id.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Digital ID:</span> 
                    <span className="font-mono font-medium ml-1">{id.digitalId}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Generated:</span> {id.generatedAt}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Expires:</span> {id.expiresAt}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <button className="btn-secondary px-3 py-1 text-xs">
                    <QrCode className="w-3 h-3 mr-1" />
                    View QR
                  </button>
                  <button className="btn-secondary px-3 py-1 text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainPage;