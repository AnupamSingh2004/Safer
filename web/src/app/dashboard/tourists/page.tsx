'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Shield,
  Globe,
  Heart,
  Camera
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Tourist {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  status: 'active' | 'inactive' | 'emergency' | 'completed';
  currentLocation?: string;
  assignedOperator?: string;
  operatorId?: string;
  registrationDate: string;
  lastActivity: string;
  plannedDuration: number;
  emergencyContact: string;
  interests: string[];
  visitedPlaces: string[];
  safetyRating: number;
  completedAssignments: number;
}

export default function TouristsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [nationalityFilter, setNationalityFilter] = useState<string>('all');
  
  const [tourists] = useState<Tourist[]>([
    {
      id: 'T001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      nationality: 'United States',
      status: 'active',
      currentLocation: 'Red Fort',
      assignedOperator: 'Rajesh Kumar',
      operatorId: 'OP001',
      registrationDate: '2024-01-14T10:00:00Z',
      lastActivity: '2024-01-15T14:30:00Z',
      plannedDuration: 7,
      emergencyContact: '+1-555-0124',
      interests: ['History', 'Architecture', 'Photography'],
      visitedPlaces: ['Red Fort', 'India Gate'],
      safetyRating: 5,
      completedAssignments: 3
    },
    {
      id: 'T002',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+34-666-123-456',
      nationality: 'Spain',
      status: 'emergency',
      currentLocation: 'India Gate Lawns',
      assignedOperator: 'Priya Sharma',
      operatorId: 'OP002',
      registrationDate: '2024-01-13T09:30:00Z',
      lastActivity: '2024-01-15T11:30:00Z',
      plannedDuration: 5,
      emergencyContact: '+34-666-123-457',
      interests: ['Culture', 'Food', 'Shopping'],
      visitedPlaces: ['Lotus Temple', 'India Gate'],
      safetyRating: 3,
      completedAssignments: 2
    },
    {
      id: 'T003',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+44-777-999-888',
      nationality: 'United Kingdom',
      status: 'active',
      currentLocation: 'Lotus Temple',
      assignedOperator: 'Mohammed Ali',
      operatorId: 'OP003',
      registrationDate: '2024-01-15T08:00:00Z',
      lastActivity: '2024-01-15T14:25:00Z',
      plannedDuration: 3,
      emergencyContact: '+44-777-999-889',
      interests: ['Religion', 'Meditation', 'Nature'],
      visitedPlaces: ['Lotus Temple'],
      safetyRating: 5,
      completedAssignments: 1
    },
    {
      id: 'T004',
      name: 'Sophie Martin',
      email: 'sophie.martin@email.com',
      phone: '+33-678-901-234',
      nationality: 'France',
      status: 'active',
      currentLocation: 'Qutub Minar Metro Station',
      assignedOperator: 'Rajesh Kumar',
      operatorId: 'OP001',
      registrationDate: '2024-01-14T15:20:00Z',
      lastActivity: '2024-01-15T14:20:00Z',
      plannedDuration: 4,
      emergencyContact: '+33-678-901-235',
      interests: ['Architecture', 'Art', 'Museums'],
      visitedPlaces: ['Red Fort', 'Humayun\'s Tomb'],
      safetyRating: 4,
      completedAssignments: 2
    },
    {
      id: 'T005',
      name: 'Hiroshi Tanaka',
      email: 'hiroshi.tanaka@email.com',
      phone: '+81-90-1234-5678',
      nationality: 'Japan',
      status: 'active',
      currentLocation: 'Humayun\'s Tomb',
      assignedOperator: 'Suresh Reddy',
      operatorId: 'OP005',
      registrationDate: '2024-01-13T12:45:00Z',
      lastActivity: '2024-01-15T14:15:00Z',
      plannedDuration: 10,
      emergencyContact: '+81-90-1234-5679',
      interests: ['Gardens', 'History', 'Photography'],
      visitedPlaces: ['Lotus Temple', 'Humayun\'s Tomb', 'Qutub Minar'],
      safetyRating: 5,
      completedAssignments: 4
    },
    {
      id: 'T006',
      name: 'Anna Kowalski',
      email: 'anna.kowalski@email.com',
      phone: '+48-123-456-789',
      nationality: 'Poland',
      status: 'completed',
      currentLocation: 'Hotel',
      registrationDate: '2024-01-12T14:00:00Z',
      lastActivity: '2024-01-14T20:00:00Z',
      plannedDuration: 3,
      emergencyContact: '+48-123-456-790',
      interests: ['Culture', 'Food', 'Local Life'],
      visitedPlaces: ['Red Fort', 'India Gate', 'Lotus Temple', 'Qutub Minar'],
      safetyRating: 5,
      completedAssignments: 5
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'emergency': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'emergency': return 'destructive';
      case 'completed': return 'default';
      default: return 'outline';
    }
  };

  const getSafetyIcon = (rating: number) => {
    if (rating >= 4) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (rating >= 3) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  };

  const filteredTourists = tourists.filter(tourist => {
    const matchesSearch = tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.nationality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tourist.status === statusFilter;
    const matchesNationality = nationalityFilter === 'all' || tourist.nationality === nationalityFilter;
    
    return matchesSearch && matchesStatus && matchesNationality;
  });

  const handleCreateTourist = () => {
    router.push('/dashboard/tourists/create');
  };

  const handleViewTourist = (touristId: string) => {
    router.push(`/dashboard/tourists/${touristId}`);
  };

  const handleEditTourist = (touristId: string) => {
    router.push(`/dashboard/tourists/${touristId}/edit`);
  };

  const handleDeleteTourist = (touristId: string) => {
    if (confirm('Are you sure you want to delete this tourist record?')) {
      console.log('Deleting tourist:', touristId);
      alert('Tourist deletion initiated.');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLastActivity = (timestamp: string) => {
    const now = new Date();
    const lastActivity = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  const uniqueNationalities = Array.from(new Set(tourists.map(t => t.nationality))).sort();

  const stats = {
    total: tourists.length,
    active: tourists.filter(t => t.status === 'active').length,
    emergency: tourists.filter(t => t.status === 'emergency').length,
    completed: tourists.filter(t => t.status === 'completed').length
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tourist Management</h1>
          <p className="text-muted-foreground">
            Manage tourist registrations, safety tracking, and assistance
          </p>
        </div>
        <Button onClick={handleCreateTourist}>
          <Plus className="w-4 h-4 mr-2" />
          Register Tourist
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Tourists</p>
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
              <p className="text-sm font-medium text-muted-foreground">Emergency</p>
              <p className="text-2xl font-bold text-red-600">{stats.emergency}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tourists by name, email, ID, or nationality..."
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
              <option value="emergency">Emergency</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={nationalityFilter}
              onChange={(e) => setNationalityFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Nationalities</option>
              {uniqueNationalities.map(nationality => (
                <option key={nationality} value={nationality}>{nationality}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tourists List */}
      <Card>
        <CardHeader>
          <CardTitle>Tourists ({filteredTourists.length})</CardTitle>
          <CardDescription>
            Registered tourists and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTourists.map((tourist) => (
              <div key={tourist.id} className="border rounded-lg p-4 space-y-4">
                {/* Tourist Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{tourist.name}</h3>
                        <Badge variant={getStatusVariant(tourist.status)}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(tourist.status)}`} />
                          {tourist.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Globe className="w-3 h-3 mr-1" />
                          {tourist.nationality}
                        </Badge>
                        {getSafetyIcon(tourist.safetyRating)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-1">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {tourist.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {tourist.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          ID: {tourist.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {tourist.currentLocation && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {tourist.currentLocation}
                          </span>
                        )}
                        {tourist.assignedOperator && (
                          <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Operator: {tourist.assignedOperator}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last active: {formatLastActivity(tourist.lastActivity)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewTourist(tourist.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditTourist(tourist.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteTourist(tourist.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Tourist Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold">{tourist.plannedDuration}</div>
                    <div className="text-xs text-muted-foreground">Days Planned</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold">{tourist.visitedPlaces.length}</div>
                    <div className="text-xs text-muted-foreground">Places Visited</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold">{tourist.completedAssignments}</div>
                    <div className="text-xs text-muted-foreground">Assignments</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {tourist.safetyRating}
                    </div>
                    <div className="text-xs text-muted-foreground">Safety Rating</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold">{formatTimestamp(tourist.registrationDate).split(',')[0]}</div>
                    <div className="text-xs text-muted-foreground">Registered</div>
                  </div>
                </div>

                {/* Tourist Details */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Interests:</h4>
                    <div className="flex flex-wrap gap-1">
                      {tourist.interests.map((interest, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Heart className="w-3 h-3 mr-1" />
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Visited Places:</h4>
                    <div className="flex flex-wrap gap-1">
                      {tourist.visitedPlaces.map((place, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Camera className="w-3 h-3 mr-1" />
                          {place}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Emergency Contact:</span>
                    <span className="text-sm text-blue-700">{tourist.emergencyContact}</span>
                  </div>
                </div>
              </div>
            ))}
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
              onClick={() => router.push('/dashboard/operators')}
            >
              View Operators
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
              Admin Panel
            </Button>
            <Button 
              variant="default"
              onClick={() => router.push('/geo-map.html')}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Geo-Fencing Demo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}