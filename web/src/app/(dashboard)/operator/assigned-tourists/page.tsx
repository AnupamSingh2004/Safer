'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search,
  MapPin, 
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Filter,
  Eye,
  Navigation
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Tourist {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  location: string;
  lastSeen: string;
  status: 'safe' | 'missing' | 'emergency' | 'offline';
  priority: 'low' | 'medium' | 'high';
  digitalId: string;
  assignedAt: string;
  notes: string;
}

export default function AssignedTourists() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [assignedTourists] = useState<Tourist[]>([
    {
      id: 'T001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      nationality: 'USA',
      location: 'Red Fort, Delhi',
      lastSeen: '2024-01-15T14:30:00Z',
      status: 'safe',
      priority: 'medium',
      digitalId: 'DID-001-2024',
      assignedAt: '2024-01-15T10:00:00Z',
      notes: 'First time visitor, needs guidance'
    },
    {
      id: 'T002',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+34-666-789-012',
      nationality: 'Spain',
      location: 'India Gate, Delhi',
      lastSeen: '2024-01-15T15:45:00Z',
      status: 'emergency',
      priority: 'high',
      digitalId: 'DID-002-2024',
      assignedAt: '2024-01-15T11:00:00Z',
      notes: 'Reported lost, last seen near India Gate'
    },
    {
      id: 'T003',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+44-7700-900-123',
      nationality: 'UK',
      location: 'Lotus Temple, Delhi',
      lastSeen: '2024-01-15T16:00:00Z',
      status: 'safe',
      priority: 'low',
      digitalId: 'DID-003-2024',
      assignedAt: '2024-01-15T09:30:00Z',
      notes: 'Regular visitor, experienced traveler'
    },
    {
      id: 'T004',
      name: 'Sophie Martin',
      email: 'sophie.martin@email.com',
      phone: '+33-6-12-34-56-78',
      nationality: 'France',
      location: 'Qutub Minar, Delhi',
      lastSeen: '2024-01-15T13:20:00Z',
      status: 'offline',
      priority: 'medium',
      digitalId: 'DID-004-2024',
      assignedAt: '2024-01-15T08:45:00Z',
      notes: 'Phone battery died, expected to check in soon'
    },
    {
      id: 'T005',
      name: 'Hiroshi Tanaka',
      email: 'hiroshi.tanaka@email.com',
      phone: '+81-90-1234-5678',
      nationality: 'Japan',
      location: 'Humayun Tomb, Delhi',
      lastSeen: '2024-01-15T12:15:00Z',
      status: 'missing',
      priority: 'high',
      digitalId: 'DID-005-2024',
      assignedAt: '2024-01-15T07:30:00Z',
      notes: 'Missing for 4 hours, last seen at Humayun Tomb'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-500';
      case 'missing': return 'bg-yellow-500';
      case 'emergency': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'safe': return 'default';
      case 'missing': return 'secondary';
      case 'emergency': return 'destructive';
      case 'offline': return 'outline';
      default: return 'outline';
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

  const filteredTourists = assignedTourists.filter(tourist => {
    const matchesSearch = tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tourist.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    safe: assignedTourists.filter(t => t.status === 'safe').length,
    missing: assignedTourists.filter(t => t.status === 'missing').length,
    emergency: assignedTourists.filter(t => t.status === 'emergency').length,
    offline: assignedTourists.filter(t => t.status === 'offline').length,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Assigned Tourists</h1>
          <p className="text-muted-foreground">
            Manage and monitor tourists assigned to you
          </p>
        </div>
        <Badge className="text-sm px-3 py-1">
          <Users className="w-4 h-4 mr-1" />
          {assignedTourists.length} Total Assigned
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:bg-green-50" onClick={() => setStatusFilter('safe')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safe</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.safe}</div>
            <p className="text-xs text-muted-foreground">Currently safe</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-yellow-50" onClick={() => setStatusFilter('missing')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.missing}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-red-50" onClick={() => setStatusFilter('emergency')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statusCounts.emergency}</div>
            <p className="text-xs text-muted-foreground">Urgent cases</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setStatusFilter('offline')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
            <Clock className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{statusCounts.offline}</div>
            <p className="text-xs text-muted-foreground">Not responding</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, ID, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                All ({assignedTourists.length})
              </Button>
              <Button
                variant={statusFilter === 'safe' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('safe')}
              >
                Safe ({statusCounts.safe})
              </Button>
              <Button
                variant={statusFilter === 'emergency' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('emergency')}
              >
                Emergency ({statusCounts.emergency})
              </Button>
              <Button
                variant={statusFilter === 'missing' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('missing')}
              >
                Missing ({statusCounts.missing})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tourist List */}
      <div className="space-y-4">
        {filteredTourists.map((tourist) => (
          <Card key={tourist.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{tourist.name}</h3>
                        <Badge variant={getStatusVariant(tourist.status)}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(tourist.status)}`} />
                          {tourist.status}
                        </Badge>
                        <Badge variant={getPriorityColor(tourist.priority)} className="text-xs">
                          {tourist.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ID: {tourist.id} • Digital ID: {tourist.digitalId}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{tourist.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{tourist.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Nationality:</span>
                      <span>{tourist.nationality}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{tourist.location}</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Last seen: {new Date(tourist.lastSeen).toLocaleString()}</span>
                    <span>Assigned: {new Date(tourist.assignedAt).toLocaleDateString()}</span>
                  </div>

                  {tourist.notes && (
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      <strong>Notes:</strong> {tourist.notes}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/tourists/${tourist.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/tourists/${tourist.id}/location`)}
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Track Location
                  </Button>
                  {tourist.status === 'emergency' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => router.push(`/dashboard/alerts/create?touristId=${tourist.id}`)}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Create Alert
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTourists.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tourists found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No tourists have been assigned to you yet.'
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
              onClick={() => router.push('/dashboard/operator/workload')}
            >
              View Workload
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/dashboard/alerts/create')}
            >
              Create New Alert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}