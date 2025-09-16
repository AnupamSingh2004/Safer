'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus,
  Search,
  Filter,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Calendar,
  Phone,
  Star,
  Navigation,
  Activity,
  RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Assignment {
  id: string;
  operatorId: string;
  operatorName: string;
  touristId: string;
  touristName: string;
  touristPhone: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'guidance' | 'emergency' | 'safety_check' | 'assistance' | 'escort';
  location: string;
  startTime: string;
  estimatedDuration: number;
  actualDuration?: number;
  notes: string;
  touristRating?: number;
  operatorNotes?: string;
  emergencyDetails?: string;
}

export default function OperatorAssignments() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  const [assignments] = useState<Assignment[]>([
    {
      id: 'A001',
      operatorId: 'OP001',
      operatorName: 'Rajesh Kumar',
      touristId: 'T001',
      touristName: 'John Smith',
      touristPhone: '+1-555-0123',
      status: 'active',
      priority: 'high',
      type: 'guidance',
      location: 'Red Fort Main Gate',
      startTime: '2024-01-15T09:00:00Z',
      estimatedDuration: 120,
      notes: 'Tourist needs comprehensive guidance tour of Red Fort complex. Special interest in Mughal history.',
      operatorNotes: 'Tourist is very interested in architecture details'
    },
    {
      id: 'A002',
      operatorId: 'OP002',
      operatorName: 'Priya Sharma',
      touristId: 'T002',
      touristName: 'Maria Garcia',
      touristPhone: '+34-666-123-456',
      status: 'emergency',
      priority: 'critical',
      type: 'emergency',
      location: 'India Gate Lawns',
      startTime: '2024-01-15T11:30:00Z',
      estimatedDuration: 60,
      notes: 'Tourist reported lost and phone battery died. Last seen near India Gate.',
      emergencyDetails: 'Tourist has been missing for 2 hours. Family is concerned. Immediate location assistance required.',
      operatorNotes: 'Initiating search protocol. Tourist found safe.'
    },
    {
      id: 'A003',
      operatorId: 'OP003',
      operatorName: 'Mohammed Ali',
      touristId: 'T003',
      touristName: 'David Wilson',
      touristPhone: '+44-777-999-888',
      status: 'completed',
      priority: 'medium',
      type: 'safety_check',
      location: 'Lotus Temple',
      startTime: '2024-01-15T08:00:00Z',
      estimatedDuration: 30,
      actualDuration: 25,
      notes: 'Regular safety check-in for solo traveler.',
      touristRating: 5,
      operatorNotes: 'Tourist confirmed safe and enjoying the visit'
    },
    {
      id: 'A004',
      operatorId: 'OP001',
      operatorName: 'Rajesh Kumar',
      touristId: 'T004',
      touristName: 'Sophie Martin',
      touristPhone: '+33-678-901-234',
      status: 'pending',
      priority: 'medium',
      type: 'assistance',
      location: 'Qutub Minar Metro Station',
      startTime: '2024-01-15T15:00:00Z',
      estimatedDuration: 45,
      notes: 'Tourist needs help with metro navigation to reach Qutub Minar complex.'
    },
    {
      id: 'A005',
      operatorId: 'OP005',
      operatorName: 'Suresh Reddy',
      touristId: 'T005',
      touristName: 'Hiroshi Tanaka',
      touristPhone: '+81-90-1234-5678',
      status: 'active',
      priority: 'high',
      type: 'escort',
      location: 'Humayun\'s Tomb',
      startTime: '2024-01-15T13:00:00Z',
      estimatedDuration: 180,
      notes: 'Elderly tourist needs assistance walking through the complex. Family member requested escort service.',
      operatorNotes: 'Tourist is doing well, taking frequent rest breaks'
    },
    {
      id: 'A006',
      operatorId: 'OP002',
      operatorName: 'Priya Sharma',
      touristId: 'T006',
      touristName: 'Anna Kowalski',
      touristPhone: '+48-123-456-789',
      status: 'cancelled',
      priority: 'low',
      type: 'guidance',
      location: 'Jantar Mantar',
      startTime: '2024-01-15T10:00:00Z',
      estimatedDuration: 90,
      notes: 'Tourist cancelled the guided tour due to weather concerns.',
      operatorNotes: 'Tourist rescheduled for tomorrow due to rain'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'active': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-gray-500';
      case 'emergency': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'active': return 'default';
      case 'completed': return 'default';
      case 'cancelled': return 'outline';
      case 'emergency': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guidance': return <Navigation className="h-4 w-4" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      case 'safety_check': return <CheckCircle className="h-4 w-4" />;
      case 'assistance': return <UserCheck className="h-4 w-4" />;
      case 'escort': return <Users className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.touristName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || assignment.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateAssignment = () => {
    router.push('/admin/operator-assignments/create');
  };

  const handleViewAssignment = (assignmentId: string) => {
    router.push(`/admin/operator-assignments/${assignmentId}`);
  };

  const handleEditAssignment = (assignmentId: string) => {
    router.push(`/admin/operator-assignments/${assignmentId}/edit`);
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      console.log('Deleting assignment:', assignmentId);
      alert('Assignment deletion initiated.');
    }
  };

  const handleReassignOperator = (assignmentId: string) => {
    router.push(`/admin/operator-assignments/${assignmentId}/reassign`);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    active: assignments.filter(a => a.status === 'active').length,
    emergency: assignments.filter(a => a.status === 'emergency').length,
    completed: assignments.filter(a => a.status === 'completed').length
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operator Assignments</h1>
          <p className="text-muted-foreground">
            Manage and monitor operator-tourist assignments
          </p>
        </div>
        <Button onClick={handleCreateAssignment}>
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
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
            <Activity className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
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
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
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
                placeholder="Search assignments by tourist, operator, ID, or location..."
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
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="emergency">Emergency</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle>Assignments ({filteredAssignments.length})</CardTitle>
          <CardDescription>
            Active and historical operator-tourist assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="border rounded-lg p-4 space-y-4">
                {/* Assignment Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {getTypeIcon(assignment.type)}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">Assignment #{assignment.id}</h3>
                        <Badge variant={getStatusVariant(assignment.status)}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(assignment.status)}`} />
                          {assignment.status}
                        </Badge>
                        <Badge className={getPriorityColor(assignment.priority)}>
                          {assignment.priority}
                        </Badge>
                        <Badge variant="outline">
                          {assignment.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Operator: {assignment.operatorName} ({assignment.operatorId})
                          </span>
                          <span className="flex items-center gap-1">
                            <UserCheck className="h-3 w-3" />
                            Tourist: {assignment.touristName} ({assignment.touristId})
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {assignment.touristPhone}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {assignment.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(assignment.startTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewAssignment(assignment.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditAssignment(assignment.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleReassignOperator(assignment.id)}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteAssignment(assignment.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Assignment Details */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium">Duration</div>
                    <div className="text-lg">
                      {assignment.actualDuration 
                        ? formatDuration(assignment.actualDuration)
                        : `Est. ${formatDuration(assignment.estimatedDuration)}`
                      }
                    </div>
                  </div>
                  
                  {assignment.touristRating && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium">Tourist Rating</div>
                      <div className="text-lg flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {assignment.touristRating}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium">Start Time</div>
                    <div className="text-lg">{formatTime(assignment.startTime)}</div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium">Type</div>
                    <div className="text-lg capitalize">{assignment.type.replace('_', ' ')}</div>
                  </div>
                </div>

                {/* Assignment Notes */}
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium">Request Notes:</h4>
                    <p className="text-sm text-muted-foreground">{assignment.notes}</p>
                  </div>
                  
                  {assignment.operatorNotes && (
                    <div>
                      <h4 className="text-sm font-medium">Operator Notes:</h4>
                      <p className="text-sm text-muted-foreground">{assignment.operatorNotes}</p>
                    </div>
                  )}
                  
                  {assignment.emergencyDetails && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="text-sm font-medium text-red-800">Emergency Details:</h4>
                      <p className="text-sm text-red-700">{assignment.emergencyDetails}</p>
                    </div>
                  )}
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
            <Button onClick={() => router.push('/admin/dashboard')}>
              Back to Admin Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/admin/operators')}
            >
              Manage Operators
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/admin/logs')}
            >
              View System Logs
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/dashboard/analytics')}
            >
              Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}