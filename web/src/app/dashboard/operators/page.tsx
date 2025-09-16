'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Filter,
  Users,
  Eye,
  Edit,
  UserPlus,
  Shield,
  Clock,
  MapPin,
  Activity,
  AlertCircle,
  CheckCircle,
  Star,
  Phone,
  Mail,
  Calendar,
  Navigation,
  Timer
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Operator {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended' | 'on_break';
  role: 'senior_operator' | 'operator' | 'trainee';
  shift: 'morning' | 'afternoon' | 'evening' | 'night';
  currentLoad: number;
  maxCapacity: number;
  rating: number;
  totalAssignments: number;
  joinDate: string;
  lastActive: string;
  currentLocation: string;
  specializations: string[];
  emergencyResponse: boolean;
  currentTourists: string[];
  responseTime: number;
  completionRate: number;
}

export default function OperatorsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [shiftFilter, setShiftFilter] = useState<string>('all');
  
  const [operators] = useState<Operator[]>([
    {
      id: 'OP001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@safetourism.gov.in',
      phone: '+91-9876543210',
      status: 'active',
      role: 'senior_operator',
      shift: 'morning',
      currentLoad: 8,
      maxCapacity: 12,
      rating: 4.8,
      totalAssignments: 1250,
      joinDate: '2023-01-15',
      lastActive: '2024-01-15T14:30:00Z',
      currentLocation: 'Red Fort Area',
      specializations: ['Emergency Response', 'Heritage Sites', 'Language: Hindi, English'],
      emergencyResponse: true,
      currentTourists: ['T001', 'T004'],
      responseTime: 8,
      completionRate: 96
    },
    {
      id: 'OP002',
      name: 'Priya Sharma',
      email: 'priya.sharma@safetourism.gov.in',
      phone: '+91-9876543211',
      status: 'active',
      role: 'operator',
      shift: 'afternoon',
      currentLoad: 6,
      maxCapacity: 10,
      rating: 4.6,
      totalAssignments: 890,
      joinDate: '2023-03-20',
      lastActive: '2024-01-15T14:25:00Z',
      currentLocation: 'India Gate Complex',
      specializations: ['Family Tourism', 'Medical Assistance', 'Language: Hindi, English, Punjabi'],
      emergencyResponse: false,
      currentTourists: ['T002'],
      responseTime: 12,
      completionRate: 92
    },
    {
      id: 'OP003',
      name: 'Mohammed Ali',
      email: 'mohammed.ali@safetourism.gov.in',
      phone: '+91-9876543212',
      status: 'on_break',
      role: 'operator',
      shift: 'evening',
      currentLoad: 0,
      maxCapacity: 10,
      rating: 4.4,
      totalAssignments: 654,
      joinDate: '2023-06-10',
      lastActive: '2024-01-15T13:00:00Z',
      currentLocation: 'Lotus Temple Area',
      specializations: ['Adventure Tourism', 'Navigation', 'Language: Hindi, English, Urdu'],
      emergencyResponse: true,
      currentTourists: [],
      responseTime: 15,
      completionRate: 88
    },
    {
      id: 'OP004',
      name: 'Anita Patel',
      email: 'anita.patel@safetourism.gov.in',
      phone: '+91-9876543213',
      status: 'suspended',
      role: 'trainee',
      shift: 'morning',
      currentLoad: 0,
      maxCapacity: 5,
      rating: 3.8,
      totalAssignments: 156,
      joinDate: '2023-11-05',
      lastActive: '2024-01-14T18:00:00Z',
      currentLocation: 'Training Center',
      specializations: ['Student Groups', 'Basic Navigation'],
      emergencyResponse: false,
      currentTourists: [],
      responseTime: 25,
      completionRate: 78
    },
    {
      id: 'OP005',
      name: 'Suresh Reddy',
      email: 'suresh.reddy@safetourism.gov.in',
      phone: '+91-9876543214',
      status: 'active',
      role: 'senior_operator',
      shift: 'night',
      currentLoad: 4,
      maxCapacity: 8,
      rating: 4.9,
      totalAssignments: 2100,
      joinDate: '2022-08-12',
      lastActive: '2024-01-15T14:35:00Z',
      currentLocation: 'Qutub Minar Area',
      specializations: ['Night Security', 'Emergency Response', 'Crisis Management'],
      emergencyResponse: true,
      currentTourists: ['T005'],
      responseTime: 6,
      completionRate: 98
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'suspended': return 'bg-red-500';
      case 'on_break': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'suspended': return 'destructive';
      case 'on_break': return 'outline';
      default: return 'outline';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'senior_operator': return 'text-purple-600 bg-purple-50';
      case 'operator': return 'text-blue-600 bg-blue-50';
      case 'trainee': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getLoadPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const getLoadColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getPerformanceColor = (value: number, type: 'responseTime' | 'completionRate') => {
    if (type === 'responseTime') {
      if (value <= 10) return 'text-green-600';
      if (value <= 20) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (value >= 95) return 'text-green-600';
      if (value >= 85) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const filteredOperators = operators.filter(operator => {
    const matchesSearch = operator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operator.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || operator.status === statusFilter;
    const matchesRole = roleFilter === 'all' || operator.role === roleFilter;
    const matchesShift = shiftFilter === 'all' || operator.shift === shiftFilter;
    
    return matchesSearch && matchesStatus && matchesRole && matchesShift;
  });

  const handleViewOperator = (operatorId: string) => {
    router.push(`/dashboard/operators/${operatorId}`);
  };

  const handleEditOperator = (operatorId: string) => {
    router.push(`/dashboard/operators/${operatorId}/edit`);
  };

  const handleCreateOperator = () => {
    router.push('/dashboard/operators/create');
  };

  const formatLastActive = (timestamp: string) => {
    const now = new Date();
    const lastActive = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  const stats = {
    total: operators.length,
    active: operators.filter(op => op.status === 'active').length,
    onBreak: operators.filter(op => op.status === 'on_break').length,
    suspended: operators.filter(op => op.status === 'suspended').length,
    emergencyCapable: operators.filter(op => op.emergencyResponse).length
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operators Overview</h1>
          <p className="text-muted-foreground">
            Monitor operator performance, availability, and assignments
          </p>
        </div>
        <Button onClick={handleCreateOperator}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Operator
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">On Break</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.onBreak}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Suspended</p>
              <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Emergency</p>
              <p className="text-2xl font-bold text-purple-600">{stats.emergencyCapable}</p>
            </div>
            <Shield className="h-8 w-8 text-purple-500" />
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search operators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_break">On Break</option>
              <option value="suspended">Suspended</option>
            </select>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Roles</option>
              <option value="senior_operator">Senior Operator</option>
              <option value="operator">Operator</option>
              <option value="trainee">Trainee</option>
            </select>

            <select
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Shifts</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Operators List */}
      <Card>
        <CardHeader>
          <CardTitle>Operators ({filteredOperators.length})</CardTitle>
          <CardDescription>
            Current operator status and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOperators.map((operator) => {
              const loadPercentage = getLoadPercentage(operator.currentLoad, operator.maxCapacity);
              
              return (
                <div key={operator.id} className="border rounded-lg p-4 space-y-4">
                  {/* Operator Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{operator.name}</h3>
                          <Badge variant={getStatusVariant(operator.status)}>
                            <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(operator.status)}`} />
                            {operator.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getRoleColor(operator.role)}>
                            {operator.role.replace('_', ' ')}
                          </Badge>
                          {operator.emergencyResponse && (
                            <Badge variant="outline" className="text-red-600 border-red-200">
                              <Shield className="w-3 h-3 mr-1" />
                              Emergency
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-1">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {operator.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {operator.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            ID: {operator.id}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {operator.currentLocation}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {operator.shift} shift
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            Last active: {formatLastActive(operator.lastActive)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewOperator(operator.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditOperator(operator.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Operator Metrics */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className={`text-lg font-bold ${getLoadColor(loadPercentage)}`}>
                        {operator.currentLoad}/{operator.maxCapacity}
                      </div>
                      <div className="text-xs text-muted-foreground">Current Load</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {operator.rating}
                      </div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold">{operator.totalAssignments}</div>
                      <div className="text-xs text-muted-foreground">Total Assignments</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className={`text-lg font-bold ${getPerformanceColor(operator.responseTime, 'responseTime')}`}>
                        {operator.responseTime}min
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Response</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className={`text-lg font-bold ${getPerformanceColor(operator.completionRate, 'completionRate')}`}>
                        {operator.completionRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">Completion Rate</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold">{operator.currentTourists.length}</div>
                      <div className="text-xs text-muted-foreground">Active Tourists</div>
                    </div>
                  </div>

                  {/* Current Assignments */}
                  {operator.currentTourists.length > 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">
                        Current Tourists ({operator.currentTourists.length}):
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {operator.currentTourists.map((touristId) => (
                          <Badge key={touristId} variant="outline" className="text-xs text-blue-700">
                            <Navigation className="w-3 h-3 mr-1" />
                            {touristId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Specializations */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Specializations:</h4>
                    <div className="flex flex-wrap gap-1">
                      {operator.specializations.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/dashboard/tourists')}
            >
              View Tourists
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/dashboard/analytics')}
            >
              Analytics
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/admin/operators')}
            >
              Admin Management
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}