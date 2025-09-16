'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Timer,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Award
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface WorkloadData {
  currentTourists: number;
  maxCapacity: number;
  todayAssignments: number;
  completedToday: number;
  avgResponseTime: number; // in minutes
  performanceScore: number;
  weeklyTrend: 'up' | 'down' | 'stable';
  monthlyStats: {
    totalAssignments: number;
    completedAssignments: number;
    avgRating: number;
    totalHours: number;
  };
}

interface TimeSlot {
  hour: string;
  tourists: number;
  status: 'light' | 'moderate' | 'heavy' | 'overloaded';
}

export default function OperatorWorkload() {
  const router = useRouter();
  
  const [workloadData] = useState<WorkloadData>({
    currentTourists: 15,
    maxCapacity: 20,
    todayAssignments: 8,
    completedToday: 5,
    avgResponseTime: 12,
    performanceScore: 87,
    weeklyTrend: 'up',
    monthlyStats: {
      totalAssignments: 156,
      completedAssignments: 142,
      avgRating: 4.6,
      totalHours: 178
    }
  });

  const [todaySchedule] = useState<TimeSlot[]>([
    { hour: '09:00', tourists: 3, status: 'light' },
    { hour: '10:00', tourists: 7, status: 'moderate' },
    { hour: '11:00', tourists: 12, status: 'heavy' },
    { hour: '12:00', tourists: 15, status: 'heavy' },
    { hour: '13:00', tourists: 18, status: 'heavy' },
    { hour: '14:00', tourists: 20, status: 'overloaded' },
    { hour: '15:00', tourists: 16, status: 'heavy' },
    { hour: '16:00', tourists: 12, status: 'heavy' },
    { hour: '17:00', tourists: 8, status: 'moderate' },
    { hour: '18:00', tourists: 4, status: 'light' }
  ]);

  const currentCapacityPercentage = (workloadData.currentTourists / workloadData.maxCapacity) * 100;
  const completionRate = (workloadData.completedToday / workloadData.todayAssignments) * 100;
  const monthlyCompletionRate = (workloadData.monthlyStats.completedAssignments / workloadData.monthlyStats.totalAssignments) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'light': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'heavy': return 'bg-orange-500';
      case 'overloaded': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'light': return 'Light Load';
      case 'moderate': return 'Moderate Load';
      case 'heavy': return 'Heavy Load';
      case 'overloaded': return 'Overloaded';
      default: return 'Unknown';
    }
  };

  const getCapacityStatus = () => {
    if (currentCapacityPercentage >= 90) return { color: 'text-red-600', status: 'Critical' };
    if (currentCapacityPercentage >= 75) return { color: 'text-orange-600', status: 'High' };
    if (currentCapacityPercentage >= 50) return { color: 'text-yellow-600', status: 'Moderate' };
    return { color: 'text-green-600', status: 'Light' };
  };

  const capacityStatus = getCapacityStatus();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workload Management</h1>
          <p className="text-muted-foreground">
            Monitor your capacity, performance, and schedule optimization
          </p>
        </div>
        <Badge className={`text-sm px-3 py-1 ${capacityStatus.color}`}>
          <Activity className="w-4 h-4 mr-1" />
          {capacityStatus.status} Load
        </Badge>
      </div>

      {/* Current Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Capacity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workloadData.currentTourists}/{workloadData.maxCapacity}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentCapacityPercentage >= 90 ? 'bg-red-500' :
                  currentCapacityPercentage >= 75 ? 'bg-orange-500' :
                  currentCapacityPercentage >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${currentCapacityPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(currentCapacityPercentage)}% capacity utilized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workloadData.completedToday}/{workloadData.todayAssignments}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(completionRate)}% assignments completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workloadData.avgResponseTime}min</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {workloadData.weeklyTrend === 'up' ? (
                <TrendingDown className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingUp className="h-3 w-3 text-red-600" />
              )}
              Average response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workloadData.performanceScore}%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {workloadData.weeklyTrend === 'up' ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  Improving this week
                </>
              ) : workloadData.weeklyTrend === 'down' ? (
                <>
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  Declining this week
                </>
              ) : (
                <>
                  <Activity className="h-3 w-3 text-blue-600" />
                  Stable performance
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Workload Schedule
          </CardTitle>
          <CardDescription>
            Hourly tourist assignment distribution for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todaySchedule.map((slot, index) => (
              <div key={slot.hour} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm w-16">{slot.hour}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(slot.status)}`} />
                    <span className="text-sm">{getStatusText(slot.status)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-lg font-semibold">{slot.tourists}</span>
                    <span className="text-sm text-muted-foreground ml-1">tourists</span>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(slot.status)}`}
                      style={{ width: `${(slot.tourists / workloadData.maxCapacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Monthly Performance Summary
          </CardTitle>
          <CardDescription>
            Your performance metrics for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Assignment Completion Rate</span>
                <span className="text-sm text-muted-foreground">{Math.round(monthlyCompletionRate)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${monthlyCompletionRate}%` }}
                />
              </div>
              
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Assignments:</span>
                  <span className="font-medium">{workloadData.monthlyStats.totalAssignments}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="font-medium text-green-600">{workloadData.monthlyStats.completedAssignments}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Hours Worked:</span>
                  <span className="font-medium">{workloadData.monthlyStats.totalHours}h</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {workloadData.monthlyStats.avgRating}
                </div>
                <div className="text-sm text-muted-foreground">
                  Average Rating
                </div>
                <div className="flex justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${
                        star <= Math.round(workloadData.monthlyStats.avgRating)
                          ? 'text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Avg. Hours/Day:</span>
                  <span className="font-medium">{Math.round(workloadData.monthlyStats.totalHours / 30 * 10) / 10}h</span>
                </div>
                <div className="flex justify-between">
                  <span>Assignments/Day:</span>
                  <span className="font-medium">{Math.round(workloadData.monthlyStats.totalAssignments / 30 * 10) / 10}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workload Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Workload Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentCapacityPercentage >= 90 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">Critical Capacity Alert</h4>
                    <p className="text-sm text-red-700 mt-1">
                      You are operating at {Math.round(currentCapacityPercentage)}% capacity. Consider requesting backup or redistributing assignments.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {workloadData.avgResponseTime > 15 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Response Time Warning</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your average response time is {workloadData.avgResponseTime} minutes. Target is under 15 minutes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {workloadData.performanceScore >= 85 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Excellent Performance</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Great job! Your performance score is {workloadData.performanceScore}%. Keep up the excellent work.
                    </p>
                  </div>
                </div>
              </div>
            )}
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
              onClick={() => router.push('/dashboard/operator/assigned-tourists')}
            >
              View Assigned Tourists
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/dashboard/operator/assignments')}
            >
              Check Assignments
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