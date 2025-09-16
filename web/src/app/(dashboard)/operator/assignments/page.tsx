'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle,
  PlayCircle,
  PauseCircle,
  MoreHorizontal,
  Timer,
  Target
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Assignment {
  id: string;
  touristId: string;
  touristName: string;
  type: 'guidance' | 'safety_check' | 'emergency_response' | 'location_tracking';
  status: 'pending' | 'in_progress' | 'completed' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedAt: string;
  startedAt?: string;
  completedAt?: string;
  estimatedDuration: number; // in minutes
  actualDuration?: number; // in minutes
  location: string;
  description: string;
  notes?: string;
  deadline?: string;
}

export default function MyAssignments() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const [assignments] = useState<Assignment[]>([
    {
      id: 'ASG001',
      touristId: 'T001',
      touristName: 'John Smith',
      type: 'guidance',
      status: 'in_progress',
      priority: 'medium',
      assignedAt: '2024-01-15T10:00:00Z',
      startedAt: '2024-01-15T10:15:00Z',
      estimatedDuration: 45,
      location: 'Red Fort, Delhi',
      description: 'Provide guidance and assistance for first-time visitor',
      notes: 'Tourist needs help with navigation and local customs',
      deadline: '2024-01-15T16:00:00Z'
    },
    {
      id: 'ASG002',
      touristId: 'T002',
      touristName: 'Maria Garcia',
      type: 'emergency_response',
      status: 'pending',
      priority: 'urgent',
      assignedAt: '2024-01-15T14:30:00Z',
      estimatedDuration: 30,
      location: 'India Gate, Delhi',
      description: 'Tourist reported lost and needs immediate assistance',
      deadline: '2024-01-15T15:00:00Z'
    },
    {
      id: 'ASG003',
      touristId: 'T003',
      touristName: 'David Wilson',
      type: 'safety_check',
      status: 'completed',
      priority: 'low',
      assignedAt: '2024-01-15T09:00:00Z',
      startedAt: '2024-01-15T09:10:00Z',
      completedAt: '2024-01-15T09:25:00Z',
      estimatedDuration: 15,
      actualDuration: 15,
      location: 'Lotus Temple, Delhi',
      description: 'Regular safety check and status update',
      notes: 'Tourist confirmed safe and enjoying visit'
    },
    {
      id: 'ASG004',
      touristId: 'T004',
      touristName: 'Sophie Martin',
      type: 'location_tracking',
      status: 'paused',
      priority: 'medium',
      assignedAt: '2024-01-15T12:00:00Z',
      startedAt: '2024-01-15T12:15:00Z',
      estimatedDuration: 60,
      location: 'Qutub Minar, Delhi',
      description: 'Monitor tourist location and provide assistance if needed',
      notes: 'Tourist phone battery died, temporarily paused'
    },
    {
      id: 'ASG005',
      touristId: 'T005',
      touristName: 'Hiroshi Tanaka',
      type: 'emergency_response',
      status: 'pending',
      priority: 'high',
      assignedAt: '2024-01-15T13:45:00Z',
      estimatedDuration: 120,
      location: 'Humayun Tomb, Delhi',
      description: 'Tourist missing for 4 hours, coordinate search and rescue',
      deadline: '2024-01-15T16:00:00Z'
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guidance': return <User className="h-4 w-4" />;
      case 'safety_check': return <CheckCircle className="h-4 w-4" />;
      case 'emergency_response': return <AlertTriangle className="h-4 w-4" />;
      case 'location_tracking': return <MapPin className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guidance': return 'bg-blue-100 text-blue-800';
      case 'safety_check': return 'bg-green-100 text-green-800';
      case 'emergency_response': return 'bg-red-100 text-red-800';
      case 'location_tracking': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in_progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'paused': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'in_progress': return 'default';
      case 'completed': return 'default';
      case 'paused': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const calculateProgress = (assignment: Assignment) => {
    if (assignment.status === 'completed') return 100;
    if (assignment.status === 'pending') return 0;
    
    const now = new Date().getTime();
    const started = assignment.startedAt ? new Date(assignment.startedAt).getTime() : now;
    const estimated = assignment.estimatedDuration * 60 * 1000; // convert to milliseconds
    const elapsed = now - started;
    
    return Math.min(Math.round((elapsed / estimated) * 100), 95);
  };

  const isOverdue = (assignment: Assignment) => {
    if (!assignment.deadline) return false;
    return new Date() > new Date(assignment.deadline) && assignment.status !== 'completed';
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (selectedStatus === 'all') return true;
    return assignment.status === selectedStatus;
  });

  const statusCounts = {
    all: assignments.length,
    pending: assignments.filter(a => a.status === 'pending').length,
    in_progress: assignments.filter(a => a.status === 'in_progress').length,
    completed: assignments.filter(a => a.status === 'completed').length,
    paused: assignments.filter(a => a.status === 'paused').length,
  };

  const handleStartAssignment = (assignmentId: string) => {
    // In real app, this would make API call
    console.log('Starting assignment:', assignmentId);
  };

  const handlePauseAssignment = (assignmentId: string) => {
    // In real app, this would make API call
    console.log('Pausing assignment:', assignmentId);
  };

  const handleCompleteAssignment = (assignmentId: string) => {
    // In real app, this would make API call
    console.log('Completing assignment:', assignmentId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Assignments</h1>
          <p className="text-muted-foreground">
            Track and manage your current and upcoming assignments
          </p>
        </div>
        <Badge className="text-sm px-3 py-1">
          <Timer className="w-4 h-4 mr-1" />
          {assignments.filter(a => a.status === 'in_progress').length} Active
        </Badge>
      </div>

      {/* Status Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('all')}
            >
              All ({statusCounts.all})
            </Button>
            <Button
              variant={selectedStatus === 'pending' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('pending')}
            >
              Pending ({statusCounts.pending})
            </Button>
            <Button
              variant={selectedStatus === 'in_progress' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('in_progress')}
            >
              In Progress ({statusCounts.in_progress})
            </Button>
            <Button
              variant={selectedStatus === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('completed')}
            >
              Completed ({statusCounts.completed})
            </Button>
            <Button
              variant={selectedStatus === 'paused' ? 'outline' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('paused')}
            >
              Paused ({statusCounts.paused})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <Card 
            key={assignment.id} 
            className={`hover:shadow-md transition-shadow ${
              isOverdue(assignment) ? 'border-red-200 bg-red-50' : ''
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-start gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{assignment.touristName}</h3>
                        <Badge variant={getStatusVariant(assignment.status)}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(assignment.status)}`} />
                          {assignment.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant={getPriorityColor(assignment.priority)} className="text-xs">
                          {assignment.priority}
                        </Badge>
                        {isOverdue(assignment) && (
                          <Badge variant="destructive" className="text-xs">
                            OVERDUE
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-full text-xs ${getTypeColor(assignment.type)} flex items-center gap-1`}>
                          {getTypeIcon(assignment.type)}
                          {assignment.type.replace('_', ' ')}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ID: {assignment.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm">{assignment.description}</p>

                  {assignment.notes && (
                    <div className="p-2 bg-blue-50 rounded text-sm">
                      <strong>Notes:</strong> {assignment.notes}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{assignment.location}</span>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Assigned: {new Date(assignment.assignedAt).toLocaleString()}
                    </div>
                    {assignment.startedAt && (
                      <div className="flex items-center gap-1">
                        <PlayCircle className="h-3 w-3" />
                        Started: {new Date(assignment.startedAt).toLocaleString()}
                      </div>
                    )}
                    {assignment.completedAt && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Completed: {new Date(assignment.completedAt).toLocaleString()}
                      </div>
                    )}
                    {assignment.deadline && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Deadline: {new Date(assignment.deadline).toLocaleString()}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      Est. Duration: {assignment.estimatedDuration}min
                    </div>
                    {assignment.actualDuration && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Actual: {assignment.actualDuration}min
                      </div>
                    )}
                  </div>

                  {/* Progress Bar for In Progress assignments */}
                  {assignment.status === 'in_progress' && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{calculateProgress(assignment)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${calculateProgress(assignment)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {assignment.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleStartAssignment(assignment.id)}
                    >
                      <PlayCircle className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  )}
                  
                  {assignment.status === 'in_progress' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePauseAssignment(assignment.id)}
                      >
                        <PauseCircle className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleCompleteAssignment(assignment.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    </>
                  )}

                  {assignment.status === 'paused' && (
                    <Button
                      size="sm"
                      onClick={() => handleStartAssignment(assignment.id)}
                    >
                      <PlayCircle className="h-4 w-4 mr-1" />
                      Resume
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/tourists/${assignment.touristId}`)}
                  >
                    View Tourist
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No assignments found</h3>
            <p className="text-muted-foreground">
              {selectedStatus === 'all' 
                ? 'No assignments have been given to you yet.' 
                : `No ${selectedStatus.replace('_', ' ')} assignments found.`
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={() => router.push('/dashboard/operator')}>
              Back to Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/dashboard/operator/assigned-tourists')}
            >
              View Assigned Tourists
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/dashboard/operator/workload')}
            >
              Check Workload
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}