'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText,
  Download,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  MapPin,
  Timer,
  Star,
  Activity
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DailyReport {
  date: string;
  touristsAssigned: number;
  assignmentsCompleted: number;
  averageResponseTime: number;
  incidentsHandled: number;
  rating: number;
  totalHours: number;
  status: 'excellent' | 'good' | 'average' | 'needs_improvement';
}

interface ActivityLog {
  time: string;
  activity: string;
  touristId?: string;
  touristName?: string;
  type: 'assignment_start' | 'assignment_complete' | 'incident_response' | 'check_in' | 'emergency';
  duration?: number;
  notes?: string;
}

export default function OperatorReports() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [weeklyReports] = useState<DailyReport[]>([
    {
      date: '2024-01-15',
      touristsAssigned: 15,
      assignmentsCompleted: 12,
      averageResponseTime: 8,
      incidentsHandled: 2,
      rating: 4.8,
      totalHours: 8.5,
      status: 'excellent'
    },
    {
      date: '2024-01-14',
      touristsAssigned: 18,
      assignmentsCompleted: 16,
      averageResponseTime: 12,
      incidentsHandled: 1,
      rating: 4.6,
      totalHours: 9.0,
      status: 'good'
    },
    {
      date: '2024-01-13',
      touristsAssigned: 20,
      assignmentsCompleted: 17,
      averageResponseTime: 15,
      incidentsHandled: 3,
      rating: 4.2,
      totalHours: 9.5,
      status: 'good'
    },
    {
      date: '2024-01-12',
      touristsAssigned: 16,
      assignmentsCompleted: 14,
      averageResponseTime: 10,
      incidentsHandled: 1,
      rating: 4.7,
      totalHours: 8.0,
      status: 'excellent'
    },
    {
      date: '2024-01-11',
      touristsAssigned: 22,
      assignmentsCompleted: 18,
      averageResponseTime: 18,
      incidentsHandled: 4,
      rating: 3.9,
      totalHours: 10.0,
      status: 'average'
    }
  ]);

  const [todayActivities] = useState<ActivityLog[]>([
    {
      time: '09:15',
      activity: 'Started guidance assignment',
      touristId: 'T001',
      touristName: 'John Smith',
      type: 'assignment_start',
      notes: 'Tourist needed help with navigation at Red Fort'
    },
    {
      time: '09:45',
      activity: 'Completed safety check',
      touristId: 'T003',
      touristName: 'David Wilson',
      type: 'assignment_complete',
      duration: 15,
      notes: 'Tourist confirmed safe at Lotus Temple'
    },
    {
      time: '11:30',
      activity: 'Emergency response initiated',
      touristId: 'T002',
      touristName: 'Maria Garcia',
      type: 'emergency',
      notes: 'Tourist reported lost at India Gate - immediate response required'
    },
    {
      time: '12:00',
      activity: 'Emergency resolved',
      touristId: 'T002',
      touristName: 'Maria Garcia',
      type: 'assignment_complete',
      duration: 30,
      notes: 'Tourist found and safely escorted to meeting point'
    },
    {
      time: '14:20',
      activity: 'Regular check-in',
      touristId: 'T004',
      touristName: 'Sophie Martin',
      type: 'check_in',
      notes: 'Phone battery died, tourist confirmed safe'
    },
    {
      time: '15:45',
      activity: 'Location tracking assistance',
      touristId: 'T005',
      touristName: 'Hiroshi Tanaka',
      type: 'assignment_start',
      notes: 'Tourist missing for 2 hours, initiating search protocol'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'average': return 'bg-yellow-500';
      case 'needs_improvement': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'excellent': return 'default';
      case 'good': return 'default';
      case 'average': return 'secondary';
      case 'needs_improvement': return 'destructive';
      default: return 'outline';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assignment_start': return <Activity className="h-4 w-4 text-blue-500" />;
      case 'assignment_complete': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'incident_response': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'check_in': return <Clock className="h-4 w-4 text-gray-500" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const calculateAverages = () => {
    const avgTourists = Math.round(weeklyReports.reduce((sum, report) => sum + report.touristsAssigned, 0) / weeklyReports.length);
    const avgCompleted = Math.round(weeklyReports.reduce((sum, report) => sum + report.assignmentsCompleted, 0) / weeklyReports.length);
    const avgResponseTime = Math.round(weeklyReports.reduce((sum, report) => sum + report.averageResponseTime, 0) / weeklyReports.length);
    const avgRating = Math.round((weeklyReports.reduce((sum, report) => sum + report.rating, 0) / weeklyReports.length) * 10) / 10;
    const avgHours = Math.round((weeklyReports.reduce((sum, report) => sum + report.totalHours, 0) / weeklyReports.length) * 10) / 10;
    
    return { avgTourists, avgCompleted, avgResponseTime, avgRating, avgHours };
  };

  const averages = calculateAverages();

  const handleDownloadReport = (type: 'daily' | 'weekly' | 'monthly') => {
    // In real app, this would generate and download actual reports
    console.log(`Downloading ${type} report...`);
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} report download initiated!`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Reports</h1>
          <p className="text-muted-foreground">
            Track your performance and generate detailed reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleDownloadReport('daily')}>
            <Download className="w-4 h-4 mr-1" />
            Daily Report
          </Button>
          <Button variant="outline" onClick={() => handleDownloadReport('weekly')}>
            <Download className="w-4 h-4 mr-1" />
            Weekly Report
          </Button>
          <Button onClick={() => handleDownloadReport('monthly')}>
            <Download className="w-4 h-4 mr-1" />
            Monthly Report
          </Button>
        </div>
      </div>

      {/* Weekly Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Weekly Performance Summary
          </CardTitle>
          <CardDescription>
            Your performance metrics for the past 5 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
            <div className="text-center p-4 border rounded-lg">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{averages.avgTourists}</div>
              <div className="text-sm text-muted-foreground">Avg. Tourists/Day</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{averages.avgCompleted}</div>
              <div className="text-sm text-muted-foreground">Avg. Completed/Day</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Timer className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{averages.avgResponseTime}min</div>
              <div className="text-sm text-muted-foreground">Avg. Response Time</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{averages.avgRating}</div>
              <div className="text-sm text-muted-foreground">Avg. Rating</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{averages.avgHours}h</div>
              <div className="text-sm text-muted-foreground">Avg. Hours/Day</div>
            </div>
          </div>

          <div className="space-y-3">
            {weeklyReports.map((report, index) => (
              <div key={report.date} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium w-24">
                    {new Date(report.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <Badge variant={getStatusVariant(report.status)}>
                    <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(report.status)}`} />
                    {report.status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{report.touristsAssigned}</div>
                    <div className="text-muted-foreground">Tourists</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{report.assignmentsCompleted}</div>
                    <div className="text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{report.averageResponseTime}min</div>
                    <div className="text-muted-foreground">Response</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{report.incidentsHandled}</div>
                    <div className="text-muted-foreground">Incidents</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      {report.rating}
                    </div>
                    <div className="text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{report.totalHours}h</div>
                    <div className="text-muted-foreground">Hours</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Today's Activity Log
          </CardTitle>
          <CardDescription>
            Detailed log of all activities performed today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex items-center gap-2 min-w-0">
                  {getActivityIcon(activity.type)}
                  <span className="font-mono text-sm w-12">{activity.time}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{activity.activity}</h4>
                    {activity.duration && (
                      <Badge variant="outline" className="text-xs">
                        {activity.duration}min
                      </Badge>
                    )}
                  </div>
                  
                  {activity.touristName && (
                    <p className="text-sm text-muted-foreground mb-1">
                      Tourist: {activity.touristName} (ID: {activity.touristId})
                    </p>
                  )}
                  
                  {activity.notes && (
                    <p className="text-sm">{activity.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Custom Report
          </CardTitle>
          <CardDescription>
            Create detailed reports for specific date ranges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Date</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleDownloadReport('daily')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Daily Activity Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleDownloadReport('weekly')}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Weekly Performance Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleDownloadReport('monthly')}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Monthly Summary Report
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Report Contents Include:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Tourist assignment details</li>
                  <li>• Response times and efficiency metrics</li>
                  <li>• Incident handling records</li>
                  <li>• Performance ratings and feedback</li>
                  <li>• Time tracking and workload analysis</li>
                  <li>• Location-based activity summary</li>
                </ul>
              </div>
            </div>
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
              onClick={() => router.push('/dashboard/operator/assignments')}
            >
              Check Assignments
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/dashboard/analytics')}
            >
              System Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}