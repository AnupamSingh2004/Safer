'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Briefcase,
  Shield,
  Phone,
  Mail
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OperatorProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  operatorId: string;
  zone: string;
  shift: string;
  status: 'active' | 'inactive' | 'break';
  assignedTourists: number;
  maxCapacity: number;
  joiningDate: string;
  totalResolved: number;
  rating: number;
}

interface Assignment {
  id: string;
  touristName: string;
  touristId: string;
  location: string;
  status: 'active' | 'completed' | 'emergency';
  assignedAt: string;
  priority: 'low' | 'medium' | 'high';
}

export default function OperatorDashboard() {
  const router = useRouter();
  
  const [operatorProfile] = useState<OperatorProfile>({
    id: 'OP001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@tourism.gov.in',
    phone: '+91 98765 43210',
    operatorId: 'OP-DEL-001',
    zone: 'Delhi - Red Fort Area',
    shift: '09:00 AM - 06:00 PM',
    status: 'active',
    assignedTourists: 15,
    maxCapacity: 20,
    joiningDate: '2024-01-15',
    totalResolved: 127,
    rating: 4.8
  });

  const [assignments] = useState<Assignment[]>([
    {
      id: 'A001',
      touristName: 'John Smith',
      touristId: 'T001',
      location: 'Red Fort',
      status: 'active',
      assignedAt: '2024-01-15T10:30:00Z',
      priority: 'medium'
    },
    {
      id: 'A002',
      touristName: 'Maria Garcia',
      touristId: 'T002',
      location: 'India Gate',
      status: 'emergency',
      assignedAt: '2024-01-15T11:15:00Z',
      priority: 'high'
    },
    {
      id: 'A003',
      touristName: 'David Wilson',
      touristId: 'T003',
      location: 'Lotus Temple',
      status: 'completed',
      assignedAt: '2024-01-15T09:00:00Z',
      priority: 'low'
    }
  ]);

  const workloadPercentage = (operatorProfile.assignedTourists / operatorProfile.maxCapacity) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'emergency': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operator Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your assignments and track your performance
          </p>
        </div>
        <Badge 
          variant={operatorProfile.status === 'active' ? 'default' : 'secondary'}
          className="text-sm px-3 py-1"
        >
          <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(operatorProfile.status)}`} />
          {operatorProfile.status.charAt(0).toUpperCase() + operatorProfile.status.slice(1)}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Tourists</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operatorProfile.assignedTourists}</div>
            <p className="text-xs text-muted-foreground">
              of {operatorProfile.maxCapacity} max capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignments.filter(a => a.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently managing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operatorProfile.totalResolved}</div>
            <p className="text-xs text-muted-foreground">
              All time cases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Rating</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operatorProfile.rating}/5.0</div>
            <p className="text-xs text-muted-foreground">
              Current rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Operator Profile
          </CardTitle>
          <CardDescription>
            Your operator details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg">
                {operatorProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{operatorProfile.name}</h3>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono text-sm">{operatorProfile.operatorId}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {operatorProfile.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-sm flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {operatorProfile.phone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Joining Date</label>
                <p className="text-sm">{new Date(operatorProfile.joiningDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Assigned Zone</label>
                <p className="text-sm flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {operatorProfile.zone}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Shift Timing</label>
                <p className="text-sm flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {operatorProfile.shift}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Capacity</label>
                <p className="text-sm">{operatorProfile.maxCapacity} tourists max</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Current Assignments
          </CardTitle>
          <CardDescription>
            Tourists currently assigned to you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{assignment.touristName}</h4>
                    <Badge variant={getPriorityColor(assignment.priority)} className="text-xs">
                      {assignment.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">ID: {assignment.touristId}</p>
                  <p className="text-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {assignment.location}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Assigned: {new Date(assignment.assignedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={assignment.status === 'emergency' ? 'destructive' : 'default'}
                    className={`${getStatusColor(assignment.status)} text-white`}
                  >
                    {assignment.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => router.push(`/dashboard/tourists/${assignment.touristId}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workload Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Workload Management
          </CardTitle>
          <CardDescription>
            Your current workload and capacity management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Current Capacity</span>
              <span>{operatorProfile.assignedTourists}/{operatorProfile.maxCapacity}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${workloadPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(workloadPercentage)}% of maximum capacity
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium text-sm">Active</h4>
              <p className="text-2xl font-bold text-green-600">
                {assignments.filter(a => a.status === 'active').length}
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium text-sm">Emergency</h4>
              <p className="text-2xl font-bold text-red-600">
                {assignments.filter(a => a.status === 'emergency').length}
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium text-sm">Completed Today</h4>
              <p className="text-2xl font-bold text-blue-600">
                {assignments.filter(a => a.status === 'completed').length}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => router.push('/dashboard/operator/assigned-tourists')}>
              View All Assigned Tourists
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard/operator/reports')}
            >
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}