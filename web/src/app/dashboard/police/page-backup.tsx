/**
 * Smart Tourist Safety System - Police Dashboard with Specialized Layout
 * Comprehensive police dashboard with investigations, alerts, digital ID verification, and case management
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  Users,
  MapPin,
  FileText,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Phone,
  MessageSquare,
  Navigation,
  UserCheck,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Activity,
  Database,
  Fingerprint,
  Camera,
  Brain,
  Badge as BadgeIcon,
  Briefcase,
  Bell,
  ChevronRight,
  TrendingUp,
  Target,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PoliceSidebar } from '@/components/layout/police-sidebar';
import { EnhancedAnomalyDetection } from '@/components/dashboard/analytics/enhanced-anomaly-detection';
import { EFIRGeneration } from '@/components/dashboard/analytics/efir-generation';
import { InvestigationTools } from '@/components/dashboard/analytics/investigation-tools';

// ============================================================================
// POLICE DASHBOARD COMPONENT
// ============================================================================

export default function PoliceDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // ============================================================================
  // MOCK DATA
  // ============================================================================

  const emergencyAlerts = [
    {
      id: 'ALT-001',
      type: 'Panic Button',
      tourist: 'John Smith',
      location: 'Red Fort, Delhi',
      time: '2 min ago',
      severity: 'Critical',
      status: 'Active',
      digitalId: 'DID-UK-001'
    },
    {
      id: 'ALT-002',
      type: 'Missing Person',
      tourist: 'Sarah Wilson',
      location: 'India Gate Area',
      time: '15 min ago',
      severity: 'High',
      status: 'Investigating',
      digitalId: 'DID-US-002'
    },
    {
      id: 'ALT-003',
      type: 'Medical Emergency',
      tourist: 'Mike Johnson',
      location: 'Lotus Temple',
      time: '32 min ago',
      severity: 'High',
      status: 'Responded',
      digitalId: 'DID-CA-003'
    },
    {
      id: 'ALT-004',
      type: 'Theft Report',
      tourist: 'Emma Davis',
      location: 'Connaught Place',
      time: '1 hour ago',
      severity: 'Medium',
      status: 'Under Investigation',
      digitalId: 'DID-AU-004'
    },
    {
      id: 'ALT-005',
      type: 'Suspicious Activity',
      tourist: 'Carlos Rodriguez',
      location: 'Chandni Chowk',
      time: '2 hours ago',
      severity: 'Medium',
      status: 'Monitoring',
      digitalId: 'DID-ES-005'
    }
  ];

  const activeCases = [
    {
      id: 'CASE-2025-001',
      title: 'Tourist Harassment Complaint',
      officer: 'Inspector Sharma',
      location: 'Connaught Place',
      priority: 'High',
      progress: 75,
      suspects: 2,
      evidence: 8
    },
    {
      id: 'CASE-2025-002',
      title: 'Theft at Tourist Spot',
      officer: 'Sub-Inspector Patel',
      location: 'Chandni Chowk',
      priority: 'Medium',
      progress: 45,
      suspects: 1,
      evidence: 12
    },
    {
      id: 'CASE-2025-003',
      title: 'Digital ID Verification Issue',
      officer: 'Constable Kumar',
      location: 'Metro Station',
      priority: 'Low',
      progress: 20,
      suspects: 0,
      evidence: 3
    }
  ];

  const recentVerifications = [
    {
      id: 'VER-001',
      tourist: 'Alice Brown',
      passport: 'UK89234567',
      status: 'Verified',
      time: '5 min ago',
      location: 'Red Fort Entry',
      riskLevel: 'Low'
    },
    {
      id: 'VER-002',
      tourist: 'David Lee',
      passport: 'SG12345678',
      status: 'Flagged',
      time: '12 min ago',
      location: 'India Gate',
      riskLevel: 'High'
    },
    {
      id: 'VER-003',
      tourist: 'Emma Davis',
      passport: 'US87654321',
      status: 'Verified',
      time: '18 min ago',
      location: 'Lotus Temple',
      riskLevel: 'Low'
    }
  ];

  const stats = {
    activeAlerts: 12,
    activeCases: 28,
    idVerifications: 156,
    responseTime: 4.2,
    resolvedToday: 23,
    flaggedIds: 3,
    onlineOfficers: 45,
    patrolUnits: 12
  };

  // ============================================================================
  // TAB CONTENT COMPONENTS
  // ============================================================================

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Active Alerts</p>
                <p className="text-3xl font-bold">{stats.activeAlerts}</p>
                <p className="text-red-100 text-xs">+3 in last hour</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Active Cases</p>
                <p className="text-3xl font-bold">{stats.activeCases}</p>
                <p className="text-blue-100 text-xs">5 resolved today</p>
              </div>
              <Briefcase className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">ID Verifications</p>
                <p className="text-3xl font-bold">{stats.idVerifications}</p>
                <p className="text-green-100 text-xs">Today</p>
              </div>
              <UserCheck className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Response Time</p>
                <p className="text-3xl font-bold">{stats.responseTime}</p>
                <p className="text-purple-100 text-xs">Minutes avg</p>
              </div>
              <Clock className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Emergency Response</h3>
            <p className="text-gray-600 text-sm mb-4">Handle active emergency alerts</p>
            <Button className="w-full bg-red-500 hover:bg-red-600">
              View Active Alerts
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Camera className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">ID Verification</h3>
            <p className="text-gray-600 text-sm mb-4">Scan and verify tourist IDs</p>
            <Button className="w-full bg-blue-500 hover:bg-blue-600">
              Scan Digital ID
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Generate e-FIR</h3>
            <p className="text-gray-600 text-sm mb-4">Create electronic FIR</p>
            <Button className="w-full bg-green-500 hover:bg-green-600">
              Create e-FIR
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Emergency Alerts
              <Badge variant="destructive" className="ml-2">{stats.activeAlerts} Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emergencyAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "p-2 rounded-full",
                      alert.severity === 'Critical' ? 'bg-red-100' : 'bg-orange-100'
                    )}>
                      <AlertTriangle className={cn(
                        "h-4 w-4",
                        alert.severity === 'Critical' ? 'text-red-600' : 'text-orange-600'
                      )} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{alert.type}</p>
                      <p className="text-xs text-gray-600">{alert.tourist}</p>
                      <p className="text-xs text-gray-500">{alert.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={alert.severity === 'Critical' ? 'destructive' : 'secondary'} className="text-xs">
                      {alert.severity}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Verifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="h-5 w-5 mr-2 text-green-500" />
              Recent ID Verifications
              <Badge variant="secondary" className="ml-2">{stats.idVerifications} Today</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVerifications.map((verification) => (
                <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <UserCheck className={cn(
                      "h-6 w-6",
                      verification.status === 'Verified' ? 'text-green-600' : 'text-red-600'
                    )} />
                    <div>
                      <p className="font-semibold text-sm">{verification.tourist}</p>
                      <p className="text-xs text-gray-600">{verification.passport}</p>
                      <p className="text-xs text-gray-500">{verification.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={verification.status === 'Verified' ? 'secondary' : 'destructive'} className="text-xs">
                      {verification.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{verification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const AlertsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Alert Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Bell className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">5</div>
            <p className="text-sm text-gray-600">Requires immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">7</div>
            <p className="text-sm text-gray-600">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Resolved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.resolvedToday}</div>
            <p className="text-sm text-gray-600">Successfully handled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Average Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.responseTime}m</div>
            <p className="text-sm text-gray-600">Response time</p>
          </CardContent>
        </Card>
      </div>

      {/* Full Alert List */}
      <Card>
        <CardHeader>
          <CardTitle>All Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emergencyAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "p-2 rounded-full",
                    alert.severity === 'Critical' ? 'bg-red-100' : 
                    alert.severity === 'High' ? 'bg-orange-100' : 'bg-yellow-100'
                  )}>
                    <AlertTriangle className={cn(
                      "h-4 w-4",
                      alert.severity === 'Critical' ? 'text-red-600' : 
                      alert.severity === 'High' ? 'text-orange-600' : 'text-yellow-600'
                    )} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold">{alert.type}</p>
                      <Badge variant="outline" className="text-xs">{alert.id}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Tourist: {alert.tourist}</p>
                    <p className="text-sm text-gray-600">Location: {alert.location}</p>
                    <p className="text-sm text-gray-500">Digital ID: {alert.digitalId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={
                    alert.severity === 'Critical' ? 'destructive' : 
                    alert.severity === 'High' ? 'secondary' : 'outline'
                  }>
                    {alert.severity}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">{alert.time}</p>
                  <p className="text-xs text-gray-400">{alert.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const InvestigationsTab = () => (
    <div className="space-y-6">
      <InvestigationTools />
    </div>
  );

  const VerificationTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Digital ID Verification</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Database className="h-4 w-4 mr-2" />
            ID Database
          </Button>
          <Button>
            <Camera className="h-4 w-4 mr-2" />
            Scan ID
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Verified Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.idVerifications}</div>
            <p className="text-sm text-gray-600">Successful verifications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Flagged IDs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.flaggedIds}</div>
            <p className="text-sm text-gray-600">Requires investigation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">8</div>
            <p className="text-sm text-gray-600">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-purple-600">AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">95%</div>
            <p className="text-sm text-gray-600">Accuracy rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentVerifications.map((verification) => (
              <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "p-2 rounded-full",
                    verification.status === 'Verified' ? 'bg-green-100' : 'bg-red-100'
                  )}>
                    <UserCheck className={cn(
                      "h-6 w-6",
                      verification.status === 'Verified' ? 'text-green-600' : 'text-red-600'
                    )} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold">{verification.tourist}</p>
                      <Badge variant="outline" className="text-xs">{verification.id}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Passport: {verification.passport}</p>
                    <p className="text-sm text-gray-600">Location: {verification.location}</p>
                    <p className="text-sm text-gray-500">Risk Level: {verification.riskLevel}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={verification.status === 'Verified' ? 'secondary' : 'destructive'}>
                    {verification.status}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">{verification.time}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Eye className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AnomalyTab = () => (
    <div className="space-y-6">
      <EnhancedAnomalyDetection />
    </div>
  );

  const EFIRTab = () => (
    <div className="space-y-6">
      <EFIRGeneration />
    </div>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <PoliceSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-80">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Police Command Center</h1>
                <p className="text-sm text-gray-600">Emergency Response & Investigation Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                {currentTime.toLocaleString()}
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">System Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6">
            <nav className="flex space-x-8 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
                { id: 'investigations', label: 'Investigations', icon: Search },
                { id: 'verification', label: 'ID Verification', icon: UserCheck },
                { id: 'anomaly', label: 'AI Anomaly', icon: Brain },
                { id: 'efir', label: 'e-FIR', icon: FileText },
                { id: 'tracking', label: 'Tracking', icon: MapPin },
                { id: 'communication', label: 'Communication', icon: Phone }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center space-x-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap',
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'alerts' && <AlertsTab />}
          {activeTab === 'investigations' && <InvestigationsTab />}
          {activeTab === 'verification' && <VerificationTab />}
          {activeTab === 'anomaly' && <AnomalyTab />}
          {activeTab === 'efir' && <EFIRTab />}
          {activeTab === 'tracking' && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">Tourist Tracking</h3>
              <p className="text-gray-500">Real-time location monitoring coming soon</p>
            </div>
          )}
          {activeTab === 'communication' && (
            <div className="text-center py-12">
              <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">Communication Center</h3>
              <p className="text-gray-500">Emergency communication tools coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}