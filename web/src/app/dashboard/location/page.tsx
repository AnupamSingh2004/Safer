/**
 * Smart Tourist Safety System - Location Services Page
 * Main page for location-based services, tracking, and geofencing
 */

'use client';

import React, { useState } from 'react';
import { LocationTracking, GeofenceManagement, NearbyServices } from '@/components/dashboard/location';
import { MapPin, Shield, Navigation, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// ============================================================================
// TYPES
// ============================================================================

type LocationView = 'tracking' | 'geofences' | 'services' | 'overview';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function LocationServicesPage() {
  const { hasPermission } = useAuth();
  const [activeView, setActiveView] = useState<LocationView>('overview');
  const [userLocation, setUserLocation] = useState({
    latitude: 28.6129,
    longitude: 77.2295,
  });

  // Navigation items
  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: MapPin,
      description: 'Location services overview',
    },
    {
      id: 'tracking',
      label: 'Live Tracking',
      icon: Navigation,
      description: 'Real-time tourist location tracking',
    },
    {
      id: 'geofences',
      label: 'Geofences',
      icon: Shield,
      description: 'Manage geofence zones',
    },
    {
      id: 'services',
      label: 'Nearby Services',
      icon: Settings,
      description: 'Emergency and tourist services',
    },
  ];

  // Handle location update
  const handleLocationUpdate = (location: any) => {
    setUserLocation({
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };

  // Render overview
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Location Services Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive location-based safety and monitoring services for tourists
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Navigation className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Active Tracking
              </h3>
              <p className="text-2xl font-bold text-blue-600">127</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tourists being tracked
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Geofence Zones
              </h3>
              <p className="text-2xl font-bold text-green-600">12</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Active safety zones
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
              <MapPin className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Nearby Services
              </h3>
              <p className="text-2xl font-bold text-orange-600">45</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Emergency services available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Navigation className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Real-time Tracking
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Monitor tourist locations in real-time with GPS tracking, battery optimization, 
            and automatic alert generation for safety violations.
          </p>
          <button
            onClick={() => setActiveView('tracking')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View Tracking Dashboard →
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Geofence Management
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create and manage safety zones, restricted areas, and tourist attractions 
            with automatic entry/exit alerts and violation detection.
          </p>
          <button
            onClick={() => setActiveView('geofences')}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Manage Geofences →
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <MapPin className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Emergency Services
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Locate nearby hospitals, police stations, fire departments, and other 
            emergency services with contact information and directions.
          </p>
          <button
            onClick={() => setActiveView('services')}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Find Services →
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Settings className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Tourist Facilities
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Discover hotels, restaurants, attractions, and other tourist facilities 
            with ratings, reviews, and real-time availability information.
          </p>
          <button
            onClick={() => setActiveView('services')}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Explore Facilities →
          </button>
        </div>
      </div>
    </div>
  );

  // Render active view content
  const renderContent = () => {
    switch (activeView) {
      case 'tracking':
        return (
          <LocationTracking
            autoStart={false}
            updateInterval={10000}
            onLocationUpdate={handleLocationUpdate}
          />
        );
      
      case 'geofences':
        return <GeofenceManagement />;
      
      case 'services':
        return (
          <NearbyServices
            userLocation={userLocation}
            searchRadius={5000}
          />
        );
      
      case 'overview':
      default:
        return renderOverview();
    }
  };

  return (
    <div className="dashboard-container">
      {/* Page Header */}
      <div className="dashboard-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Location Services
            </h1>
            <p className="text-muted-foreground">
              Real-time tracking, geofencing, and location-based safety services
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-card p-4">
        <nav className="flex space-x-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as LocationView)}
                className={cn(
                  'flex items-center px-6 py-4 text-sm font-semibold rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Current Location Display */}
      {userLocation && (
        <div className="dashboard-card p-6 bg-primary/5 border border-primary/20">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Current Reference Location
              </p>
              <p className="text-sm text-muted-foreground">
                {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                <span className="ml-2 text-primary font-medium">
                  (India Gate, New Delhi)
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-[600px]">
        {renderContent()}
      </div>
    </div>
  );
}

export default LocationServicesPage;
