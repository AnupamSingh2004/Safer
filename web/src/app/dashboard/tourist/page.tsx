/**
 * Tourist Dashboard - Personal Safety & Travel Information
 * For tourists to manage their safety profile and view travel information
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  AlertTriangle, 
  Shield,
  Phone,
  RefreshCw,
  CheckCircle,
  Clock,
  User,
  Heart,
  Camera
} from 'lucide-react';
import { useAuth } from '@/stores/auth-store';

// Mock data for Tourist dashboard
const touristStats = {
  currentLocation: "Kochi, Kerala",
  assignedOperator: "Rajesh Kumar",
  safetyStatus: "safe",
  lastCheckIn: "30 minutes ago",
  emergencyContacts: 2,
  visitedPlaces: 5,
  nextCheckIn: "2 hours",
  travelDays: 3
};

const emergencyContacts = [
  {
    name: "Tourist Helpline",
    number: "1363",
    type: "primary"
  },
  {
    name: "Local Police",
    number: "100", 
    type: "emergency"
  },
  {
    name: "Assigned Operator",
    number: "+91 98765 43210",
    type: "operator"
  }
];

export default function TouristDashboard() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleCheckIn = () => {
    // Handle check-in logic
    alert('Check-in successful! Your location has been updated.');
  };

  const handleEmergency = () => {
    // Handle emergency alert
    alert('Emergency alert sent! Help is on the way.');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome to Kerala!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Your Safety Dashboard • {touristStats.currentLocation}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>You're Safe</span>
            </div>
          </div>
        </div>

        {/* Safety Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Safety Status</p>
                <p className="text-2xl font-bold text-green-600 capitalize">{touristStats.safetyStatus}</p>
                <p className="text-xs text-green-600">All systems normal</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Check-in</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{touristStats.lastCheckIn}</p>
                <p className="text-xs text-blue-600">Next in {touristStats.nextCheckIn}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Places Visited</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{touristStats.visitedPlaces}</p>
                <p className="text-xs text-purple-600">Day {touristStats.travelDays} of trip</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned Guide</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{touristStats.assignedOperator}</p>
                <p className="text-xs text-green-600">Available 24/7</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <User className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Safety Actions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Safety Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={handleCheckIn}
                className="w-full p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 dark:text-white">Quick Check-in</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Update your current location and status</p>
                  </div>
                </div>
              </button>

              <button
                onClick={handleEmergency}
                className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 dark:text-white">Emergency Alert</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Send immediate help request</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Emergency Contacts
            </h2>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {contact.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {contact.type}
                    </p>
                  </div>
                  <a 
                    href={`tel:${contact.number}`}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tourist Information */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Welcome to God's Own Country - Kerala!
          </h3>
          <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
            <li>• Your safety is monitored 24/7 by trained local operators</li>
            <li>• Check in regularly to let us know you're safe and enjoying your trip</li>
            <li>• Use emergency contacts immediately if you need any assistance</li>
            <li>• Explore responsibly and respect local customs and environment</li>
            <li>• Download offline maps and keep emergency numbers saved</li>
          </ul>
        </div>
      </div>
    </div>
  );
}