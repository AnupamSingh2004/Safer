/**
 * Smart Tourist Safety System - Complete Demo Integration
 * Shows mobile app and web dashboard working together in real-time
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Monitor, 
  ArrowRightLeft, 
  Play, 
  Pause, 
  RotateCcw,
  AlertTriangle,
  Activity,
  Zap,
  Eye,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemoIntegration, EmergencyAlert } from '@/lib/demo-integration';

// Import our components
import MobileAppSimulator from '../mobile-simulator/page';

export default function DemoIntegrationPage() {
  const { 
    liveAlerts, 
    newAlertCount, 
    clearAllAlerts,
    simulateRandomAlert,
    updateAlertStatus,
    resolveAlert,
    isDemoMode
  } = useDemoIntegration();

  const [demoStep, setDemoStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'mobile' | 'dashboard'>('split');

  // Demo script steps
  const demoSteps = [
    {
      title: 'Tourist Using Mobile App',
      description: 'Tourist Sarah Johnson is exploring Delhi with the mobile app',
      action: () => {
        // No specific action, just highlighting the mobile interface
      }
    },
    {
      title: 'Emergency Situation',
      description: 'Tourist feels unsafe and activates panic button',
      action: () => {
        // This will be triggered by mobile app
      }
    },
    {
      title: 'Real-time Alert Generation',
      description: 'Alert appears instantly on government dashboard',
      action: () => {
        simulateRandomAlert();
      }
    },
    {
      title: 'Operator Acknowledgment',
      description: 'Government operator acknowledges the emergency',
      action: () => {
        if (liveAlerts.length > 0) {
          const activeAlert = liveAlerts.find(a => a.status === 'active');
          if (activeAlert) {
            updateAlertStatus(activeAlert.id, 'acknowledged', 'Emergency Response Team');
          }
        }
      }
    },
    {
      title: 'Emergency Response Dispatch',
      description: 'Response team is dispatched to tourist location',
      action: () => {
        if (liveAlerts.length > 0) {
          const acknowledgedAlert = liveAlerts.find(a => a.status === 'acknowledged');
          if (acknowledgedAlert) {
            updateAlertStatus(acknowledgedAlert.id, 'responding', 'Emergency Response Team Alpha');
          }
        }
      }
    },
    {
      title: 'Situation Resolved',
      description: 'Tourist is helped and situation is marked as resolved',
      action: () => {
        if (liveAlerts.length > 0) {
          const respondingAlert = liveAlerts.find(a => a.status === 'responding');
          if (respondingAlert) {
            resolveAlert(respondingAlert.id);
          }
        }
      }
    }
  ];

  // Auto-play demo
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (demoStep < demoSteps.length - 1) {
        setDemoStep(prev => prev + 1);
        demoSteps[demoStep + 1]?.action();
      } else {
        setIsPlaying(false);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [isPlaying, demoStep, demoSteps, liveAlerts]);

  const executeStep = (stepIndex: number) => {
    setDemoStep(stepIndex);
    demoSteps[stepIndex]?.action();
  };

  const resetDemo = () => {
    setDemoStep(0);
    setIsPlaying(false);
    clearAllAlerts();
  };

  const renderDashboardPreview = () => (
    <div className="h-full bg-gray-50 rounded-lg overflow-hidden">
      {/* Dashboard Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Government Dashboard</h2>
            <p className="text-blue-100 text-sm">Emergency Alert Management</p>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <span className="text-sm">Live Monitoring</span>
          </div>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Active', value: liveAlerts.filter(a => a.status === 'active').length, color: 'text-red-600' },
            { label: 'Responding', value: liveAlerts.filter(a => a.status === 'responding').length, color: 'text-blue-600' },
            { label: 'Resolved', value: liveAlerts.filter(a => a.status === 'resolved').length, color: 'text-green-600' },
            { label: 'Total', value: liveAlerts.length, color: 'text-gray-600' }
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className={cn('text-2xl font-bold', stat.color)}>{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="p-4 space-y-3 h-96 overflow-y-auto">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          Live Emergency Alerts
        </h3>
        
        {liveAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No active alerts</p>
            <p className="text-xs">System monitoring 24/7</p>
          </div>
        ) : (
          liveAlerts.slice(0, 4).map(alert => (
            <div key={alert.id} className={cn(
              'border rounded-lg p-3 space-y-2',
              alert.priority === 'high' ? 'border-red-200 bg-red-50' :
              alert.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
              'border-blue-200 bg-blue-50'
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={cn(
                    'w-4 h-4',
                    alert.priority === 'high' ? 'text-red-600' :
                    alert.priority === 'medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  )} />
                  <span className="font-medium text-sm">{alert.title}</span>
                </div>
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  alert.status === 'active' ? 'bg-red-100 text-red-800' :
                  alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                  alert.status === 'responding' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                )}>
                  {alert.status.toUpperCase()}
                </span>
              </div>
              
              <div className="text-xs text-gray-600">
                <div>Tourist: {alert.tourist.name}</div>
                <div>Location: {alert.location.address}</div>
                <div>Time: {new Date(alert.timestamp).toLocaleTimeString()}</div>
              </div>

              {alert.responseTeam && (
                <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Assigned: {alert.responseTeam}
                  {alert.estimatedArrival && ` • ETA: ${alert.estimatedArrival}`}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Demo Controls */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Smart Tourist Safety System - Live Demo
              </h1>
              <p className="text-gray-600">
                Real-time integration between mobile app and government dashboard
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'split', icon: ArrowRightLeft, label: 'Split View' },
                  { id: 'mobile', icon: Smartphone, label: 'Mobile' },
                  { id: 'dashboard', icon: Monitor, label: 'Dashboard' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id as any)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                      viewMode === mode.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    <mode.icon className="w-4 h-4" />
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Demo Controls */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors',
                  isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                )}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause Demo' : 'Play Demo'}
              </button>

              <button
                onClick={resetDemo}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>

          {/* Demo Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Demo Progress</span>
              <span className="text-sm text-gray-500">
                Step {demoStep + 1} of {demoSteps.length}
              </span>
            </div>
            
            <div className="grid grid-cols-6 gap-2">
              {demoSteps.map((step, index) => (
                <div key={index} className="space-y-2">
                  <button
                    onClick={() => executeStep(index)}
                    className={cn(
                      'w-full h-2 rounded-full transition-colors',
                      index <= demoStep ? 'bg-blue-600' : 'bg-gray-200'
                    )}
                  />
                  <div className="text-xs text-center">
                    <div className={cn(
                      'font-medium',
                      index === demoStep ? 'text-blue-600' : 'text-gray-500'
                    )}>
                      {step.title}
                    </div>
                    {index === demoStep && (
                      <div className="text-gray-600 mt-1">
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Demo Interface */}
      <div className="max-w-7xl mx-auto">
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[800px]">
            {/* Mobile Simulator */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Mobile App Simulator</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Smartphone className="w-4 h-4" />
                  Tourist Interface
                </div>
              </div>
              <div className="flex justify-center">
                <MobileAppSimulator />
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Government Dashboard</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Monitor className="w-4 h-4" />
                  Operator Interface
                </div>
              </div>
              {renderDashboardPreview()}
            </div>
          </div>
        )}

        {viewMode === 'mobile' && (
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Mobile App Simulator</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Smartphone className="w-4 h-4" />
                Tourist Interface
              </div>
            </div>
            <div className="flex justify-center">
              <MobileAppSimulator />
            </div>
          </div>
        )}

        {viewMode === 'dashboard' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Government Dashboard</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Monitor className="w-4 h-4" />
                Operator Interface
              </div>
            </div>
            <div className="h-[700px]">
              {renderDashboardPreview()}
            </div>
          </div>
        )}
      </div>

      {/* Demo Status */}
      {isDemoMode && (
        <div className="fixed bottom-4 left-4 bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">Live Demo Active</span>
          </div>
        </div>
      )}

      {/* New Alerts Notification */}
      {newAlertCount > 0 && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {newAlertCount} New Emergency Alert{newAlertCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}