/**
 * Smart Tourist Safety System - Mobile App Simulator
 * Simulates the mobile app interface for demo purposes
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield,
  MapPin,
  Camera,
  Phone,
  MessageCircle,
  AlertTriangle,
  Heart,
  Navigation,
  Wifi,
  Battery,
  Signal,
  Clock,
  User,
  QrCode,
  Settings,
  Bell,
  Menu,
  ScanLine,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoIntegration } from '@/lib/demo-integration';

interface Alert {
  id: string;
  type: 'panic' | 'medical' | 'security' | 'weather';
  title: string;
  description: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'sending' | 'sent' | 'acknowledged' | 'responding';
}

const demoTourist = {
  name: 'Sarah Johnson',
  nationality: 'United States',
  digitalId: 'DID:INDIA:1736956800:abc123',
  qrCode: 'QR_SARAH_2025_001',
  safetyScore: 92,
  location: {
    latitude: 28.6139,
    longitude: 77.2090,
    address: 'India Gate, New Delhi'
  }
};

export default function MobileAppSimulator() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isConnected, setIsConnected] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(87);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeScreen, setActiveScreen] = useState<'home' | 'emergency' | 'profile' | 'qr' | 'alerts'>('home');
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [emergencyCountdown, setEmergencyCountdown] = useState(0);
  
  // Get demo integration functions
  const { addAlert } = useDemoIntegration();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Emergency countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (emergencyCountdown > 0) {
      timer = setTimeout(() => {
        setEmergencyCountdown(emergencyCountdown - 1);
      }, 1000);
    } else if (emergencyCountdown === 0 && emergencyActive) {
      triggerEmergencyAlert();
      setEmergencyActive(false);
    }
    return () => clearTimeout(timer);
  }, [emergencyCountdown, emergencyActive]);

  const triggerEmergencyAlert = () => {
    const newAlert = {
      type: 'panic' as const,
      title: 'EMERGENCY: Panic Button Activated',
      description: `Tourist ${demoTourist.name} has activated emergency panic button`,
      location: demoTourist.location,
      tourist: {
        name: demoTourist.name,
        nationality: demoTourist.nationality,
        digitalId: demoTourist.digitalId
      },
      priority: 'high' as const,
      status: 'active' as const
    };

    // Add to demo integration system to show on dashboard
    addAlert(newAlert);

    // Also add to local state for mobile display
    const localAlert: Alert = {
      id: `alert_${Date.now()}`,
      type: 'panic',
      title: 'EMERGENCY: Panic Button Activated',
      description: `Tourist ${demoTourist.name} has activated emergency panic button`,
      timestamp: new Date().toISOString(),
      location: demoTourist.location,
      status: 'sending'
    };

    setAlerts(prev => [localAlert, ...prev]);

    // Simulate alert progression
    setTimeout(() => {
      setAlerts(prev => prev.map(alert => 
        alert.id === localAlert.id ? { ...alert, status: 'sent' } : alert
      ));
    }, 1000);

    setTimeout(() => {
      setAlerts(prev => prev.map(alert => 
        alert.id === localAlert.id ? { ...alert, status: 'acknowledged' } : alert
      ));
    }, 3000);

    setTimeout(() => {
      setAlerts(prev => prev.map(alert => 
        alert.id === localAlert.id ? { ...alert, status: 'responding' } : alert
      ));
    }, 8000);
  };

  const startEmergency = () => {
    setEmergencyActive(true);
    setEmergencyCountdown(5);
  };

  const cancelEmergency = () => {
    setEmergencyActive(false);
    setEmergencyCountdown(0);
  };

  const renderStatusBar = () => (
    <div className="flex items-center justify-between px-4 py-2 bg-black text-white text-sm">
      <div className="flex items-center gap-1">
        <span className="font-medium">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div className="flex items-center gap-2">
        <Signal className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <div className="flex items-center gap-1">
          <Battery className="w-4 h-4" />
          <span className="text-xs">{batteryLevel}%</span>
        </div>
      </div>
    </div>
  );

  const renderHomeScreen = () => (
    <div className="flex-1 p-4 space-y-6">
      {/* Welcome Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Welcome, {demoTourist.name}
        </h2>
        <p className="text-gray-600">
          Stay safe during your journey in India
        </p>
      </div>

      {/* Safety Score */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-green-900">Safety Score</h3>
            <p className="text-sm text-green-700">All systems normal</p>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {demoTourist.safetyScore}%
          </div>
        </div>
      </div>

      {/* Current Location */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-900">Current Location</h3>
            <p className="text-sm text-blue-700">{demoTourist.location.address}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setActiveScreen('emergency')}
          className="p-4 bg-red-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="font-semibold">Emergency</span>
        </button>
        
        <button 
          onClick={() => setActiveScreen('qr')}
          className="p-4 bg-purple-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
        >
          <QrCode className="w-5 h-5" />
          <span className="font-semibold">My QR</span>
        </button>

        <button className="p-4 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
          <Camera className="w-5 h-5" />
          <span className="font-semibold">Report</span>
        </button>

        <button className="p-4 bg-green-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="font-semibold">Chat</span>
        </button>
      </div>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Recent Alerts</h3>
          {alerts.slice(0, 2).map(alert => (
            <div key={alert.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">{alert.title}</span>
                </div>
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  alert.status === 'sending' && 'bg-yellow-100 text-yellow-800',
                  alert.status === 'sent' && 'bg-blue-100 text-blue-800',
                  alert.status === 'acknowledged' && 'bg-orange-100 text-orange-800',
                  alert.status === 'responding' && 'bg-green-100 text-green-800'
                )}>
                  {alert.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">{alert.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderEmergencyScreen = () => (
    <div className="flex-1 p-4 flex flex-col items-center justify-center bg-red-50">
      {!emergencyActive ? (
        <div className="text-center space-y-6">
          <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <AlertTriangle className="w-16 h-16 text-white" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-red-900 mb-2">
              Emergency Services
            </h2>
            <p className="text-red-700">
              Press and hold the button below for 3 seconds to trigger emergency alert
            </p>
          </div>

          <button
            onMouseDown={startEmergency}
            onMouseUp={cancelEmergency}
            onMouseLeave={cancelEmergency}
            className="w-40 h-40 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform transform hover:scale-105 active:scale-95"
          >
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
              <span className="text-lg font-bold">PANIC</span>
            </div>
          </button>

          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Phone className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm">Call Police</span>
            </button>
            <button className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Heart className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm">Medical</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
            <span className="text-4xl font-bold text-white">{emergencyCountdown}</span>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-red-900 mb-2">
              Emergency Alert Activating
            </h2>
            <p className="text-red-700">
              Release button to cancel
            </p>
          </div>

          <button
            onClick={cancelEmergency}
            className="px-8 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel Emergency
          </button>
        </div>
      )}
    </div>
  );

  const renderQRScreen = () => (
    <div className="flex-1 p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Digital Tourist ID
        </h2>
        <p className="text-gray-600">
          Show this QR code at checkpoints and tourist sites
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
        <div className="text-center space-y-4">
          <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
            <QrCode className="w-32 h-32 text-gray-400" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">{demoTourist.name}</h3>
            <p className="text-sm text-gray-600">{demoTourist.nationality}</p>
            <p className="text-xs text-gray-500 font-mono">{demoTourist.digitalId}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          <ScanLine className="w-5 h-5" />
          Scan Zone QR
        </button>
        
        <button className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
          <Shield className="w-5 h-5" />
          Verify Identity
        </button>
      </div>
    </div>
  );

  const renderBottomNav = () => (
    <div className="bg-white border-t border-gray-200 px-4 py-2">
      <div className="grid grid-cols-4 gap-2">
        {[
          { id: 'home', icon: Shield, label: 'Home' },
          { id: 'emergency', icon: AlertTriangle, label: 'Emergency' },
          { id: 'qr', icon: QrCode, label: 'ID' },
          { id: 'profile', icon: User, label: 'Profile' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id as any)}
            className={cn(
              'p-3 rounded-lg flex flex-col items-center gap-1 transition-colors',
              activeScreen === item.id
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-2xl">
      {/* Status Bar */}
      {renderStatusBar()}

      {/* App Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <div>
              <h1 className="font-bold">Tourist Safety</h1>
              <p className="text-xs text-blue-100">Government of India</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <Settings className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-96 overflow-y-auto">
        {activeScreen === 'home' && renderHomeScreen()}
        {activeScreen === 'emergency' && renderEmergencyScreen()}
        {activeScreen === 'qr' && renderQRScreen()}
        {activeScreen === 'profile' && (
          <div className="flex-1 p-4 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">User Profile</h2>
            <p className="text-gray-600">Profile management will be implemented in the full version.</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      {renderBottomNav()}

      {/* Emergency Overlay */}
      {alerts.some(alert => alert.status === 'responding') && (
        <div className="absolute inset-0 bg-red-600 bg-opacity-95 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <Zap className="w-16 h-16 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold mb-2">Emergency Response Active</h2>
            <p className="text-red-100">Help is on the way!</p>
            <p className="text-sm text-red-200 mt-2">Emergency services have been notified</p>
          </div>
        </div>
      )}
    </div>
  );
}