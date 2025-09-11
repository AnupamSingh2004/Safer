'use client';

import React from 'react';
import { Shield, MapPin, Users, AlertTriangle } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Simple test to verify Tailwind is working */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Tourist Safety System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered monitoring and incident response system for tourist safety
          </p>
        </div>

        {/* Test cards with Tailwind styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Digital Identity</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Blockchain-based secure tourist IDs with KYC verification
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Geo-Fencing</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Smart zone monitoring with real-time location tracking
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-red-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Emergency Response</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Instant alerts and automated emergency dispatch system
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Tourist Management</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Comprehensive monitoring and management dashboard
            </p>
          </div>
        </div>

        {/* Test buttons */}
        <div className="text-center space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            View Dashboard
          </button>
          <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors">
            Learn More
          </button>
        </div>

        {/* Status indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            Tailwind CSS is working properly
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
