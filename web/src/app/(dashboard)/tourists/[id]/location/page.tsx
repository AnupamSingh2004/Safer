/**
 * Smart Tourist Safety System - Tourist Location Tracking Page
 * Real-time location monitoring with interactive maps and geofence alerts
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Radio,
  Battery,
  Wifi,
  ArrowLeft,
  RefreshCw,
  Download,
  Share,
  Camera,
  Phone,
  MessageSquare,
  Calendar,
  Route,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface LocationData {
  id: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number;
  altitude: number;
  heading: number;
  address: string;
  status: 'safe' | 'warning' | 'emergency';
  batteryLevel: number;
  signalStrength: number;
  isOnline: boolean;
}

interface GeofenceViolation {
  id: string;
  type: 'exit' | 'enter';
  zoneName: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  resolved: boolean;
}

interface TouristInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  emergencyContact: string;
  checkInTime: string;
  plannedCheckout: string;
  assignedOperator: string;
}

export default function TouristLocationPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const [currentLocation, setCurrentLocation] = useState<LocationData>({
    id: params.id,
    timestamp: new Date().toISOString(),
    latitude: 9.9312328,
    longitude: 76.2673041,
    accuracy: 5.2,
    speed: 0,
    altitude: 14,
    heading: 180,
    address: "Marine Drive, Kochi, Kerala 682031, India",
    status: 'safe',
    batteryLevel: 78,
    signalStrength: 85,
    isOnline: true
  });

  const [locationHistory, setLocationHistory] = useState<LocationData[]>([]);
  const [geofenceViolations, setGeofenceViolations] = useState<GeofenceViolation[]>([
    {
      id: '1',
      type: 'exit',
      zoneName: 'Tourist Safe Zone - Kochi',
      severity: 'medium',
      timestamp: '2024-01-15T14:30:00Z',
      resolved: false
    }
  ]);

  const [touristInfo] = useState<TouristInfo>({
    id: params.id,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1-555-0123",
    nationality: "United States",
    emergencyContact: "+1-555-9876",
    checkInTime: "2024-01-15T09:00:00Z",
    plannedCheckout: "2024-01-18T12:00:00Z",
    assignedOperator: "Rajesh Kumar"
  });

  const [isTracking, setIsTracking] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate real-time location updates
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      setCurrentLocation(prev => ({
        ...prev,
        timestamp: new Date().toISOString(),
        latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
        speed: Math.random() * 10,
        heading: (prev.heading + (Math.random() - 0.5) * 20) % 360,
        batteryLevel: Math.max(20, prev.batteryLevel - Math.random() * 0.1),
        signalStrength: Math.max(30, Math.min(100, prev.signalStrength + (Math.random() - 0.5) * 10))
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [isTracking]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'emergency': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'safe': return 'Safe';
      case 'warning': return 'Warning';
      case 'emergency': return 'Emergency';
      default: return 'Unknown';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/tourists" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Location Tracking</h1>
            <p className="text-muted-foreground">Real-time monitoring for {touristInfo.name}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge 
            variant={currentLocation.status === 'safe' ? 'default' : 'destructive'}
            className="text-sm px-3 py-1"
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(currentLocation.status)}`} />
            {getStatusText(currentLocation.status)}
          </Badge>
          
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Location</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{currentLocation.address.split(',')[0]}</div>
            <p className="text-xs text-muted-foreground">
              Accuracy: {currentLocation.accuracy}m
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Device Status</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {currentLocation.isOnline ? 'Online' : 'Offline'}
            </div>
            <p className="text-xs text-muted-foreground">
              Signal: {currentLocation.signalStrength}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Battery Level</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{Math.round(currentLocation.batteryLevel)}%</div>
            <p className="text-xs text-muted-foreground">
              {currentLocation.batteryLevel > 50 ? 'Good' : currentLocation.batteryLevel > 20 ? 'Low' : 'Critical'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Movement Speed</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{currentLocation.speed.toFixed(1)} km/h</div>
            <p className="text-xs text-muted-foreground">
              {currentLocation.speed < 1 ? 'Stationary' : currentLocation.speed < 5 ? 'Walking' : 'Moving'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tourist Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Tourist Information
          </CardTitle>
          <CardDescription>Personal details and emergency contacts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-sm">{touristInfo.name}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Nationality</label>
              <p className="text-sm">{touristInfo.nationality}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Contact</label>
              <p className="text-sm">{touristInfo.phone}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
              <p className="text-sm">{touristInfo.emergencyContact}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Assigned Operator</label>
              <p className="text-sm">{touristInfo.assignedOperator}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Check-out Date</label>
              <p className="text-sm">{new Date(touristInfo.plannedCheckout).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Location Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Current Location Details
          </CardTitle>
          <CardDescription>Real-time location data and coordinates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Map Placeholder */}
          <div className="relative h-64 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 text-blue-500 mx-auto" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Interactive Map</p>
              <p className="text-sm text-gray-500">Real-time location visualization</p>
              <Badge variant="outline" className="mt-2">
                {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
              </Badge>
            </div>
          </div>

          {/* Location Details Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium text-sm mb-1">Latitude</h4>
              <p className="text-lg font-mono">{currentLocation.latitude.toFixed(6)}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium text-sm mb-1">Longitude</h4>
              <p className="text-lg font-mono">{currentLocation.longitude.toFixed(6)}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium text-sm mb-1">Altitude</h4>
              <p className="text-lg font-mono">{currentLocation.altitude}m</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-medium text-sm mb-1">Heading</h4>
              <p className="text-lg font-mono">{Math.round(currentLocation.heading)}°</p>
            </div>
          </div>

          {/* Address */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-2">Full Address</h4>
            <p className="text-sm">{currentLocation.address}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {new Date(currentLocation.timestamp).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Geofence Violations */}
      {geofenceViolations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Geofence Violations
            </CardTitle>
            <CardDescription>Zone boundary violations and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geofenceViolations.map((violation) => (
                <div key={violation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={violation.resolved ? "secondary" : "destructive"}>
                        {violation.type === 'exit' ? 'Zone Exit' : 'Zone Entry'}
                      </Badge>
                      <span className="font-medium">{violation.zoneName}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(violation.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      violation.severity === 'high' ? 'destructive' : 
                      violation.severity === 'medium' ? 'default' : 'secondary'
                    }>
                      {violation.severity}
                    </Badge>
                    {!violation.resolved && (
                      <Button size="sm" variant="outline">
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Emergency and communication options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Phone className="h-5 w-5" />
              <span className="text-sm">Call Tourist</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm">Send Message</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Download className="h-5 w-5" />
              <span className="text-sm">Export Data</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Share className="h-5 w-5" />
              <span className="text-sm">Share Location</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
