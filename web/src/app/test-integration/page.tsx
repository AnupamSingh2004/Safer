/**
 * Test page for Map Integration - Steps 19-20 completion
 * Demonstrates analytics dashboard and map integration components
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Import our completed components
import DashboardCharts from '@/components/charts/dashboard-charts';
import ReportGenerator from '@/components/dashboard/analytics/report-generator';
import HeatmapVisualization from '@/components/dashboard/analytics/heatmap-visualization';
import InteractiveMap from '@/components/maps/interactive-map';
import TouristMarkers from '@/components/maps/tourist-markers';

const TestMapIntegrationPage = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'map'>('analytics');
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Mock data for testing
  const mockTourists = [
    {
      id: '1',
      name: 'John Doe',
      position: [25.2744, 91.7322] as [number, number],
      status: 'safe' as const,
      lastSeen: new Date().toISOString(),
      safetyScore: 95,
      digitalId: 'TD001'
    },
    {
      id: '2',
      name: 'Jane Smith',
      position: [25.2800, 91.7400] as [number, number],
      status: 'warning' as const,
      lastSeen: new Date(Date.now() - 1800000).toISOString(),
      safetyScore: 72,
      digitalId: 'TD002'
    },
    {
      id: '3',
      name: 'Bob Wilson',
      position: [25.2600, 91.7200] as [number, number],
      status: 'emergency' as const,
      lastSeen: new Date(Date.now() - 300000).toISOString(),
      safetyScore: 35,
      digitalId: 'TD003'
    }
  ];

  const mockGeofences = [
    {
      id: 'zone1',
      name: 'City Center Safe Zone',
      coordinates: [
        [25.2700, 91.7300],
        [25.2800, 91.7300],
        [25.2800, 91.7400],
        [25.2700, 91.7400]
      ] as [number, number][],
      riskLevel: 'low' as const,
      active: true,
      alertCount: 0
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Steps 19-20 Completed!
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Analytics Dashboard & Map Integration System
          </p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              📊 Analytics Dashboard
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'map'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🗺️ Map Integration
            </button>
          </div>

          {/* Emergency Mode Toggle */}
          <div className="flex justify-center items-center space-x-3 mb-6">
            <span className="text-gray-700">Emergency Mode:</span>
            <button
              onClick={() => setEmergencyMode(!emergencyMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                emergencyMode
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {emergencyMode ? '🚨 ACTIVE' : '⭕ INACTIVE'}
            </button>
          </div>
        </motion.div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Dashboard Charts */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📈 Dashboard Charts
              </h2>
              <DashboardCharts />
            </div>

            {/* Report Generator */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📝 Report Generator
              </h2>
              <ReportGenerator />
            </div>

            {/* Heatmap Visualization */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🔥 Heatmap Visualization
              </h2>
              <HeatmapVisualization />
            </div>
          </motion.div>
        )}

        {/* Map Tab */}
        {activeTab === 'map' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Interactive Map */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  🗺️ Interactive Map with React Leaflet
                </h2>
                <p className="text-gray-600 mt-2">
                  Real-time tourist tracking, geofence zones, and emergency management
                </p>
              </div>
              
              <div className="h-96">
                <InteractiveMap
                  height="100%"
                  emergencyMode={emergencyMode}
                  tourists={mockTourists}
                  geofences={mockGeofences}
                  showTourists={true}
                  showGeofences={true}
                  realTimeUpdates={true}
                  onMapClick={(lat, lng) => {
                    console.log('Map clicked:', lat, lng);
                  }}
                />
              </div>
            </div>

            {/* Tourist Markers Component */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                👥 Tourist Markers System
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Status Distribution</h3>
                  <div className="space-y-2">
                    {['safe', 'warning', 'emergency', 'offline'].map(status => {
                      const count = mockTourists.filter(t => t.status === status).length;
                      const color = status === 'safe' ? 'green' : 
                                  status === 'warning' ? 'yellow' : 
                                  status === 'emergency' ? 'red' : 'gray';
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 bg-${color}-500 rounded-full`}></div>
                            <span className="capitalize">{status}</span>
                          </div>
                          <span className="font-semibold">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Features</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✅ Status-based marker icons</li>
                    <li>✅ Interactive popups with tourist details</li>
                    <li>✅ Real-time position updates</li>
                    <li>✅ Emergency alert integration</li>
                    <li>✅ Clustering for performance</li>
                    <li>✅ Battery level warnings</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Completion Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8"
        >
          <h2 className="text-2xl font-bold text-green-900 mb-4">
            ✅ Development Complete!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-900 mb-2">STEP 19: Analytics Dashboard</h3>
              <ul className="space-y-1 text-green-800">
                <li>✅ Dashboard charts with Recharts</li>
                <li>✅ Report generator with templates</li>
                <li>✅ Heatmap visualization</li>
                <li>✅ Interactive data analysis</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-green-900 mb-2">STEP 20: Map Integration</h3>
              <ul className="space-y-1 text-green-800">
                <li>✅ React Leaflet integration</li>
                <li>✅ Tourist marker system</li>
                <li>✅ Geofence zone overlays</li>
                <li>✅ Map controls & search</li>
                <li>✅ Emergency mode support</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
            <p className="text-green-800">
              <strong>Ready for hackathon presentation!</strong> 
              Both analytics dashboard and map integration systems are fully functional 
              with modern UI/UX, real-time capabilities, and comprehensive features.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TestMapIntegrationPage;