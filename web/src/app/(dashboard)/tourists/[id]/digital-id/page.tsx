/**
 * Smart Tourist Safety System - Tourist Digital ID Page
 * Blockchain-based digital identity management with QR codes and verification
 */

'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  User,
  FileText,
  QrCode,
  Download,
  Share,
  Copy,
  RefreshCw,
  Fingerprint,
  Eye,
  Lock,
  Globe,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  ExternalLink,
  Camera,
  Upload,
  History,
  Settings,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface DigitalIdentity {
  id: string;
  blockchainAddress: string;
  verificationStatus: 'verified' | 'pending' | 'expired' | 'rejected';
  qrCode: string;
  documents: IdentityDocument[];
  permissions: string[];
  createdAt: string;
  lastUpdated: string;
  expiryDate: string;
  verificationHistory: VerificationRecord[];
}

interface IdentityDocument {
  id: string;
  type: 'passport' | 'visa' | 'permit' | 'license' | 'medical';
  name: string;
  status: 'verified' | 'pending' | 'rejected';
  uploadDate: string;
  verifiedBy?: string;
  expiryDate?: string;
  documentNumber: string;
}

interface VerificationRecord {
  id: string;
  action: string;
  timestamp: string;
  verifier: string;
  blockchainTx: string;
  status: 'success' | 'failed';
}

interface TouristProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth: string;
  passportNumber: string;
  emergencyContact: string;
  profileImage: string;
  registrationDate: string;
}

export default function TouristDigitalIdPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const [digitalId] = useState<DigitalIdentity>({
    id: params.id,
    blockchainAddress: '0x742d35Cc6634C0532925a3b8D97CF1ACBA',
    verificationStatus: 'verified',
    qrCode: `https://app.smarttouristsafety.gov.in/verify/${params.id}`,
    documents: [
      {
        id: '1',
        type: 'passport',
        name: 'US Passport',
        status: 'verified',
        uploadDate: '2024-01-10T10:00:00Z',
        verifiedBy: 'Immigration Officer',
        expiryDate: '2029-01-10',
        documentNumber: 'US123456789'
      },
      {
        id: '2',
        type: 'visa',
        name: 'Tourist Visa',
        status: 'verified',
        uploadDate: '2024-01-12T14:30:00Z',
        verifiedBy: 'Consular Officer',
        expiryDate: '2024-07-10',
        documentNumber: 'VISA987654321'
      },
      {
        id: '3',
        type: 'medical',
        name: 'Medical Certificate',
        status: 'pending',
        uploadDate: '2024-01-14T09:15:00Z',
        documentNumber: 'MED456789123'
      }
    ],
    permissions: ['location_tracking', 'emergency_services', 'identity_verification', 'data_sharing'],
    createdAt: '2024-01-10T08:00:00Z',
    lastUpdated: '2024-01-15T16:45:00Z',
    expiryDate: '2024-07-10T23:59:59Z',
    verificationHistory: [
      {
        id: '1',
        action: 'Identity Verified',
        timestamp: '2024-01-10T10:30:00Z',
        verifier: 'Immigration System',
        blockchainTx: '0x1a2b3c4d5e6f7890...',
        status: 'success'
      },
      {
        id: '2',
        action: 'Document Uploaded',
        timestamp: '2024-01-12T14:30:00Z',
        verifier: 'Document Service',
        blockchainTx: '0x9876543210abcdef...',
        status: 'success'
      }
    ]
  });

  const [touristProfile] = useState<TouristProfile>({
    id: params.id,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0123",
    nationality: "United States",
    dateOfBirth: "1985-03-15",
    passportNumber: "US123456789",
    emergencyContact: "+1-555-9876",
    profileImage: "/api/placeholder/150/150",
    registrationDate: "2024-01-10T08:00:00Z"
  });

  const [refreshing, setRefreshing] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      case 'expired': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'passport': return <Globe className="h-4 w-4" />;
      case 'visa': return <FileText className="h-4 w-4" />;
      case 'permit': return <Shield className="h-4 w-4" />;
      case 'license': return <User className="h-4 w-4" />;
      case 'medical': return <Fingerprint className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/tourists" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Digital Identity</h1>
            <p className="text-muted-foreground">Blockchain-verified digital ID for {touristProfile.name}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge 
            variant={digitalId.verificationStatus === 'verified' ? 'default' : 'destructive'}
            className="text-sm px-3 py-1"
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(digitalId.verificationStatus)}`} />
            {getStatusText(digitalId.verificationStatus)}
          </Badge>
          
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Identity Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Digital Identity Card
              </CardTitle>
              <CardDescription>Verified digital identity with QR code access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Information */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {touristProfile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{touristProfile.name}</h3>
                      <p className="text-muted-foreground">{touristProfile.nationality}</p>
                      <Badge variant="outline" className="mt-1">
                        ID: {touristProfile.id}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{touristProfile.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{touristProfile.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Born: {new Date(touristProfile.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Passport: {touristProfile.passportNumber}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center space-y-4">
                  <div ref={qrRef} className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">QR Code</p>
                      <p className="text-xs text-gray-400">Scan to verify</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(digitalId.qrCode)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download QR
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Identity Verified</span>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Blockchain Recorded</span>
                    </div>
                    <Badge variant="secondary">Confirmed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Documents Verified</span>
                    </div>
                    <Badge variant="secondary">{digitalId.documents.filter(d => d.status === 'verified').length}/{digitalId.documents.length}</Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Verification Details</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Created: {new Date(digitalId.createdAt).toLocaleDateString()}</p>
                      <p>Last Updated: {new Date(digitalId.lastUpdated).toLocaleDateString()}</p>
                      <p>Expires: {new Date(digitalId.expiryDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Identity Documents
              </CardTitle>
              <CardDescription>Uploaded and verified documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {digitalId.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getDocumentIcon(doc.type)}
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {doc.documentNumber} • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                        {doc.verifiedBy && (
                          <p className="text-xs text-muted-foreground">
                            Verified by {doc.verifiedBy}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        doc.status === 'verified' ? 'default' : 
                        doc.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {getStatusText(doc.status)}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-center pt-4">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Document
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blockchain Tab */}
        <TabsContent value="blockchain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Blockchain Information
              </CardTitle>
              <CardDescription>Immutable record on the blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Blockchain Address</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm bg-muted px-2 py-1 rounded flex-1 truncate">
                        {digitalId.blockchainAddress}
                      </code>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(digitalId.blockchainAddress)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Network</label>
                    <p className="text-sm mt-1">Ethereum Mainnet</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Smart Contract</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm bg-muted px-2 py-1 rounded flex-1 truncate">
                        0xa1b2c3d4e5f6789012345678901234567890abcd
                      </code>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm mb-3">Blockchain Features</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Immutable Record</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Cryptographic Security</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Decentralized Verification</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Audit Trail</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Verification History
              </CardTitle>
              <CardDescription>Complete audit trail of identity actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {digitalId.verificationHistory.map((record, index) => (
                  <div key={record.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full mt-2 ${record.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{record.action}</h4>
                        <Badge variant={record.status === 'success' ? 'default' : 'destructive'}>
                          {record.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(record.timestamp).toLocaleString()} • by {record.verifier}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {record.blockchainTx}
                        </code>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
