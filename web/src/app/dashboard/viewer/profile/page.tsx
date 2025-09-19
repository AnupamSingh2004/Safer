/**
 * Smart Tourist Safety System - Viewer Profile Page
 * Profile management for viewer users (read-only access)
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Eye,
  Settings,
  Edit,
  Save,
  X,
  Monitor,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Badge,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Shield,
  FileText,
  Lock
} from 'lucide-react';
import { useAuth } from '@/stores/auth-store';

// Viewer Stats Component
const ViewerStat = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color 
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  color: string;
}) => (
  <div className="dashboard-card">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  </div>
);

// Access Level Card Component
const AccessLevelCard = ({ 
  module, 
  accessLevel, 
  description 
}: { 
  module: string; 
  accessLevel: string; 
  description: string; 
}) => {
  const getAccessColor = (level: string) => {
    switch (level) {
      case 'Read Only': return 'text-blue-600 bg-blue-100';
      case 'No Access': return 'text-red-600 bg-red-100';
      case 'Limited View': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAccessIcon = (level: string) => {
    switch (level) {
      case 'Read Only': return Eye;
      case 'No Access': return Lock;
      case 'Limited View': return Monitor;
      default: return FileText;
    }
  };

  const AccessIcon = getAccessIcon(accessLevel);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
          <AccessIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </div>
        <div>
          <h4 className="font-medium text-foreground">{module}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getAccessColor(accessLevel)}`}>
        {accessLevel}
      </span>
    </div>
  );
};

export default function ViewerProfile() {
  const { user } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'Viewer',
    lastName: user?.lastName || 'User',
    email: user?.email || 'viewer@touristsafety.gov.in',
    phone: '+91-9876543210',
    viewerId: 'TSA-VW-0025',
    joiningDate: '2023-08-15',
    department: 'Tourism Analytics Department',
    accessLevel: 'Read-Only Monitoring',
    clearanceLevel: 'Level 2 - Analytics',
    reportingTo: 'Regional Director - North India',
    bio: 'Analytics specialist focused on tourism safety monitoring and trend analysis.'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  const viewerStats = [
    {
      title: 'Reports Generated',
      value: '47',
      subtitle: 'This month',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Data Points Analyzed',
      value: '12.4K',
      subtitle: 'Last 30 days',
      icon: BarChart3,
      color: 'green'
    },
    {
      title: 'Dashboard Views',
      value: '186',
      subtitle: 'This week',
      icon: Monitor,
      color: 'purple'
    },
    {
      title: 'Access Level',
      value: 'L2',
      subtitle: 'Analytics clearance',
      icon: Shield,
      color: 'orange'
    }
  ];

  const accessLevels = [
    {
      module: 'Tourist Monitoring',
      accessLevel: 'Read Only',
      description: 'View tourist locations and status updates'
    },
    {
      module: 'Emergency Alerts',
      accessLevel: 'Read Only',
      description: 'View active and resolved emergency situations'
    },
    {
      module: 'Analytics Dashboard',
      accessLevel: 'Read Only',
      description: 'Access to comprehensive analytics and reports'
    },
    {
      module: 'Operator Management',
      accessLevel: 'Limited View',
      description: 'View operator assignments and basic info'
    },
    {
      module: 'System Administration',
      accessLevel: 'No Access',
      description: 'System configuration and user management'
    },
    {
      module: 'Data Export',
      accessLevel: 'Limited View',
      description: 'Export reports and analytics data'
    }
  ];

  const recentViews = [
    {
      id: 1,
      activity: 'Viewed Tourism Analytics Report',
      timestamp: '2 hours ago',
      details: 'Monthly tourism safety trends - North India region',
      status: 'viewed'
    },
    {
      id: 2,
      activity: 'Accessed Emergency Response Dashboard',
      timestamp: '4 hours ago',
      details: 'Reviewed response times for Red Fort incidents',
      status: 'viewed'
    },
    {
      id: 3,
      activity: 'Generated Safety Statistics Report',
      timestamp: '6 hours ago',
      details: 'Weekly safety metrics for heritage sites',
      status: 'generated'
    },
    {
      id: 4,
      activity: 'Viewed Tourist Movement Patterns',
      timestamp: '1 day ago',
      details: 'Heat map analysis for popular tourist destinations',
      status: 'analyzed'
    }
  ];

  return (
    <div className="dashboard-container component-stack-lg">
      {/* Header Section */}
      <div className="dashboard-section">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
              <Eye className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Viewer Profile</h1>
              <p className="text-muted-foreground">Read-only monitoring account</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              isEditing
                ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300'
            }`}
          >
            {isEditing ? (
              <>
                <X className="w-5 h-5 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="w-5 h-5 mr-2" />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Role Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 shadow-sm border border-purple-200 dark:border-purple-800">
          <div className="w-3 h-3 rounded-full bg-purple-500 shadow-sm" />
          READ-ONLY VIEWER
        </div>
      </div>

      {/* Viewer Activity Stats */}
      <div className="dashboard-section">
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-primary" />
          Activity Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {viewerStats.map((stat, index) => (
            <ViewerStat
              key={index}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>
      </div>

      {/* Profile Information & Access Levels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
              <User className="w-6 h-6 text-purple-600" />
              Personal Information
            </h3>
          </div>
          <div className="card-content">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">
                      {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground">
                      {formData.firstName} {formData.lastName}
                    </h4>
                    <p className="text-muted-foreground">Analytics Viewer</p>
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-1">
                      <Eye className="w-3 h-3 mr-1" />
                      Read-Only Access
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-foreground">{formData.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-foreground">{formData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="w-5 h-5 text-gray-400" />
                    <span className="text-foreground">ID: {formData.viewerId}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-foreground">Joined {formData.joiningDate}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-foreground">{formData.department}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h5 className="font-semibold text-foreground mb-3">Access Information</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <span className="text-sm font-medium">Access Level</span>
                      <span className="text-purple-600 font-bold">{formData.accessLevel}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <span className="text-sm font-medium">Clearance Level</span>
                      <span className="text-blue-600 font-medium">{formData.clearanceLevel}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm font-medium">Reporting To</span>
                      <span className="text-gray-600 font-medium">{formData.reportingTo}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Access Permissions */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-600" />
              Access Permissions
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              {accessLevels.map((access, index) => (
                <AccessLevelCard
                  key={index}
                  module={access.module}
                  accessLevel={access.accessLevel}
                  description={access.description}
                />
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-foreground">Permission Summary</h4>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div className="text-xs text-green-600">Read Access</div>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">2</div>
                  <div className="text-xs text-yellow-600">Limited View</div>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">1</div>
                  <div className="text-xs text-red-600">No Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section">
        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Activity className="w-6 h-6 text-orange-600" />
          Recent Activity
        </h3>
        
        <div className="dashboard-card">
          <div className="card-content">
            <div className="space-y-4">
              {recentViews.map(activity => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{activity.activity}</h4>
                    <p className="text-sm text-muted-foreground mb-1">{activity.details}</p>
                    <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="dashboard-section">
        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
          <Monitor className="w-6 h-6 text-primary" />
          Quick Access
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            className="dashboard-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-left"
            onClick={() => router.push('/dashboard/analytics')}
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Analytics Dashboard</span>
            </div>
          </button>
          
          <button 
            className="dashboard-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-left"
            onClick={() => router.push('/dashboard/reports')}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="font-medium">View Reports</span>
            </div>
          </button>
          
          <button 
            className="dashboard-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-left"
            onClick={() => router.push('/dashboard/tourists')}
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Tourist Overview</span>
            </div>
          </button>
          
          <button 
            className="dashboard-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-left"
            onClick={() => router.push('/dashboard/trends')}
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="font-medium">Safety Trends</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}