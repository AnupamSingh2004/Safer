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
      name: 'Tenzin Norbu',
      email: 'tenzin.norbu@netourism.gov.in',
      phone: '+91-9436123456',
      status: 'active',
      role: 'senior_operator',
      shift: 'morning',
      currentLoad: 6,
      maxCapacity: 10,
      rating: 4.9,
      totalAssignments: 1450,
      joinDate: '2023-01-15',
      lastActive: '2024-01-15T14:30:00Z',
      currentLocation: 'Tawang Monastery, Arunachal Pradesh',
      specializations: ['High Altitude Trekking', 'Buddhist Heritage', 'Language: Hindi, English, Monpa'],
      emergencyResponse: true,
      currentTourists: ['T001', 'T004'],
      responseTime: 6,
      completionRate: 97
    },
    {
      id: 'OP002',
      name: 'Bhupen Hazarika',
      email: 'bhupen.hazarika@netourism.gov.in',
      phone: '+91-9435987654',
      status: 'active',
      role: 'operator',
      shift: 'afternoon',
      currentLoad: 8,
      maxCapacity: 12,
      rating: 4.7,
      totalAssignments: 980,
      joinDate: '2023-03-20',
      lastActive: '2024-01-15T14:25:00Z',
      currentLocation: 'Kaziranga National Park, Assam',
      specializations: ['Wildlife Tourism', 'River Navigation', 'Language: Hindi, English, Assamese'],
      emergencyResponse: true,
      currentTourists: ['T002', 'T007'],
      responseTime: 8,
      completionRate: 94
    },
    {
      id: 'OP003',
      name: 'Ningombam Biren',
      email: 'ningombam.biren@netourism.gov.in',
      phone: '+91-9612345678',
      status: 'on_break',
      role: 'operator',
      shift: 'evening',
      currentLoad: 0,
      maxCapacity: 8,
      rating: 4.5,
      totalAssignments: 720,
      joinDate: '2023-06-10',
      lastActive: '2024-01-15T13:00:00Z',
      currentLocation: 'Loktak Lake, Manipur',
      specializations: ['Water Sports', 'Cultural Tours', 'Language: Hindi, English, Manipuri'],
      emergencyResponse: false,
      currentTourists: [],
      responseTime: 12,
      completionRate: 89
    },
    {
      id: 'OP004',
      name: 'Daisy Blah',
      email: 'daisy.blah@netourism.gov.in',
      phone: '+91-9436876543',
      status: 'active',
      role: 'senior_operator',
      shift: 'morning',
      currentLoad: 5,
      maxCapacity: 10,
      rating: 4.8,
      totalAssignments: 1200,
      joinDate: '2022-11-05',
      lastActive: '2024-01-15T14:35:00Z',
      currentLocation: 'Living Root Bridges, Meghalaya',
      specializations: ['Adventure Trekking', 'Eco-Tourism', 'Language: Hindi, English, Khasi'],
      emergencyResponse: true,
      currentTourists: ['T003', 'T006'],
      responseTime: 7,
      completionRate: 96
    },
    {
      id: 'OP005',
      name: 'Lalbiakzuala Khiangte',
      email: 'lalbiakzuala.k@netourism.gov.in',
      phone: '+91-9436234567',
      status: 'active',
      role: 'operator',
      shift: 'night',
      currentLoad: 3,
      maxCapacity: 6,
      rating: 4.6,
      totalAssignments: 650,
      joinDate: '2023-08-12',
      lastActive: '2024-01-15T14:20:00Z',
      currentLocation: 'Aizawl Hills, Mizoram',
      specializations: ['Night Security', 'Hill Station Tours', 'Language: Hindi, English, Mizo'],
      emergencyResponse: true,
      currentTourists: ['T005'],
      responseTime: 10,
      completionRate: 92
    },
    {
      id: 'OP006',
      name: 'Khriezo Yhome',
      email: 'khriezo.yhome@netourism.gov.in',
      phone: '+91-9436345678',
      status: 'suspended',
      role: 'trainee',
      shift: 'afternoon',
      currentLoad: 0,
      maxCapacity: 4,
      rating: 3.9,
      totalAssignments: 180,
      joinDate: '2023-12-01',
      lastActive: '2024-01-14T16:00:00Z',
      currentLocation: 'Kohima War Cemetery, Nagaland',
      specializations: ['Historical Tours', 'Cultural Heritage'],
      emergencyResponse: false,
      currentTourists: [],
      responseTime: 18,
      completionRate: 82
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
      case 'senior_operator': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800';
      case 'operator': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
      case 'trainee': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              North East India Tourism Operators
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
              Monitor field guide performance, availability, and tourist assignments
            </p>
          </div>
          <Button 
            onClick={handleCreateOperator}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Operator
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-750 border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="flex items-center justify-between p-4 md:p-6">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/60 rounded-xl shadow-md">
                <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-750 border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="flex items-center justify-between p-4 md:p-6">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/60 rounded-xl shadow-md">
                <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-gray-750 border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="flex items-center justify-between p-4 md:p-6">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">On Break</p>
                <p className="text-xl md:text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.onBreak}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/60 rounded-xl shadow-md">
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-gray-750 border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="flex items-center justify-between p-4 md:p-6">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Suspended</p>
                <p className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400">{stats.suspended}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/60 rounded-xl shadow-md">
                <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-red-600 dark:text-red-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-750 border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardContent className="flex items-center justify-between p-4 md:p-6">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Emergency</p>
                <p className="text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.emergencyCapable}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/60 rounded-xl shadow-md">
                <Shield className="h-6 w-6 md:h-8 md:w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search operators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Operators ({filteredOperators.length})</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Current operator status and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOperators.map((operator) => {
              const loadPercentage = getLoadPercentage(operator.currentLoad, operator.maxCapacity);
              
              return (
                <div key={operator.id} className="border border-gray-200 dark:border-gray-600 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-750 dark:to-gray-700 rounded-xl p-5 space-y-5 hover:shadow-lg dark:hover:shadow-2xl hover:shadow-blue-100 dark:hover:shadow-black/50 transition-all duration-300 hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-600">
                  {/* Operator Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/60 rounded-xl flex items-center justify-center shadow-md dark:shadow-lg">
                        <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{operator.name}</h3>
                          <Badge variant={getStatusVariant(operator.status)}>
                            <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(operator.status)}`} />
                            {operator.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getRoleColor(operator.role)}>
                            {operator.role.replace('_', ' ')}
                          </Badge>
                          {operator.emergencyResponse && (
                            <Badge variant="outline" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                              <Shield className="w-3 h-3 mr-1" />
                              Emergency
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-1">
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

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
                    
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" onClick={() => handleViewOperator(operator.id)} className="bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 shadow-sm hover:shadow-md">
                        <Eye className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditOperator(operator.id)} className="bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-300 dark:hover:border-green-600 transition-all duration-200 shadow-sm hover:shadow-md">
                        <Edit className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </Button>
                    </div>
                  </div>

                  {/* Operator Metrics */}
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
                    <div className="text-center p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-600 dark:to-gray-650 border border-gray-200 dark:border-gray-500 rounded-xl shadow-sm dark:shadow-md hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:scale-105">
                      <div className={`text-lg font-bold ${getLoadColor(loadPercentage)}`}>
                        {operator.currentLoad}/{operator.maxCapacity}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">Current Load</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-600 dark:to-gray-650 border border-gray-200 dark:border-gray-500 rounded-xl shadow-sm dark:shadow-md hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:scale-105">
                      <div className="text-lg font-bold flex items-center justify-center gap-1 text-gray-900 dark:text-white">
                        <Star className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                        {operator.rating}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">Rating</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-600 dark:to-gray-650 border border-gray-200 dark:border-gray-500 rounded-xl shadow-sm dark:shadow-md hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:scale-105">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{operator.totalAssignments}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">Total Assignments</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-600 dark:to-gray-650 border border-gray-200 dark:border-gray-500 rounded-xl shadow-sm dark:shadow-md hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:scale-105">
                      <div className={`text-lg font-bold ${getPerformanceColor(operator.responseTime, 'responseTime')}`}>
                        {operator.responseTime}min
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">Avg Response</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-600 dark:to-gray-650 border border-gray-200 dark:border-gray-500 rounded-xl shadow-sm dark:shadow-md hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:scale-105">
                      <div className={`text-lg font-bold ${getPerformanceColor(operator.completionRate, 'completionRate')}`}>
                        {operator.completionRate}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">Completion Rate</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-600 dark:to-gray-650 border border-gray-200 dark:border-gray-500 rounded-xl shadow-sm dark:shadow-md hover:shadow-md dark:hover:shadow-lg transition-all duration-200 hover:scale-105">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{operator.currentTourists.length}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">Active Tourists</div>
                    </div>
                  </div>

                  {/* Current Assignments */}
                  {operator.currentTourists.length > 0 && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700 rounded-xl shadow-sm dark:shadow-md">
                      <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                        <Navigation className="w-4 h-4" />
                        Current Tourists ({operator.currentTourists.length}):
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {operator.currentTourists.map((touristId) => (
                          <Badge key={touristId} variant="outline" className="text-xs font-medium text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600 bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors duration-200 px-3 py-1">
                            <Navigation className="w-3 h-3 mr-1" />
                            {touristId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Specializations */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      Specializations:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {operator.specializations.map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-650 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-650 dark:hover:to-gray-600 transition-all duration-200 px-3 py-1">
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
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 dark:text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={() => router.push('/dashboard')} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white">
              Back to Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/dashboard/tourists')}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              View Tourists
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/dashboard/analytics')}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Analytics
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/admin/operators')}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Admin Management
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}