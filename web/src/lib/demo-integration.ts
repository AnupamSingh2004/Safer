/**
 * Real-time demo integration between mobile app and web dashboard
 * This simulates the real-time connection for demo purposes
 */

'use client';

import React from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface EmergencyAlert {
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
  tourist: {
    name: string;
    nationality: string;
    digitalId: string;
    phone?: string;
  };
  status: 'active' | 'acknowledged' | 'responding' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  responseTeam?: string;
  estimatedArrival?: string;
}

export interface DemoState {
  // Real-time alerts
  liveAlerts: EmergencyAlert[];
  
  // Mobile app status
  connectedTourists: number;
  activeSessions: number;
  
  // Dashboard notifications
  newAlertCount: number;
  lastUpdate: string;
  
  // Demo controls
  isDemoMode: boolean;
  autoResponse: boolean;
  
  // Actions
  addAlert: (alert: Omit<EmergencyAlert, 'id' | 'timestamp'>) => void;
  updateAlertStatus: (alertId: string, status: EmergencyAlert['status'], responseTeam?: string) => void;
  resolveAlert: (alertId: string) => void;
  clearAllAlerts: () => void;
  setDemoMode: (enabled: boolean) => void;
  simulateRandomAlert: () => void;
  incrementTouristCount: () => void;
  decrementTouristCount: () => void;
}

// Sample tourist data for demo
const demoTourists = [
  { name: 'Sarah Johnson', nationality: 'United States', digitalId: 'DID:INDIA:1736956800:abc123' },
  { name: 'James Wilson', nationality: 'United Kingdom', digitalId: 'DID:INDIA:1736956801:def456' },
  { name: 'Emma Brown', nationality: 'Australia', digitalId: 'DID:INDIA:1736956802:ghi789' },
  { name: 'Lucas Schmidt', nationality: 'Germany', digitalId: 'DID:INDIA:1736956803:jkl012' },
  { name: 'Maria Garcia', nationality: 'Spain', digitalId: 'DID:INDIA:1736956804:mno345' }
];

const demoLocations = [
  { latitude: 28.6139, longitude: 77.2090, address: 'India Gate, New Delhi' },
  { latitude: 26.9124, longitude: 75.7873, address: 'City Palace, Jaipur' },
  { latitude: 27.1750, longitude: 78.0422, address: 'Taj Mahal, Agra' },
  { latitude: 19.0760, longitude: 72.8777, address: 'Gateway of India, Mumbai' },
  { latitude: 12.9716, longitude: 77.5946, address: 'Bangalore Palace, Bangalore' }
];

const emergencyTemplates = [
  { type: 'panic' as const, title: 'Panic Button Activated', priority: 'high' as const },
  { type: 'medical' as const, title: 'Medical Emergency', priority: 'high' as const },
  { type: 'security' as const, title: 'Security Incident', priority: 'medium' as const },
  { type: 'weather' as const, title: 'Weather Alert', priority: 'low' as const }
];

export const useDemoStore = create<DemoState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    liveAlerts: [],
    connectedTourists: 0,
    activeSessions: 0,
    newAlertCount: 0,
    lastUpdate: new Date().toISOString(),
    isDemoMode: true,
    autoResponse: false,

    // Actions
    addAlert: (alertData) => {
      const alert: EmergencyAlert = {
        ...alertData,
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        status: 'active'
      };

      set((state) => ({
        liveAlerts: [alert, ...state.liveAlerts],
        newAlertCount: state.newAlertCount + 1,
        lastUpdate: new Date().toISOString()
      }));

      // Auto-response simulation for demo
      if (get().autoResponse) {
        setTimeout(() => {
          get().updateAlertStatus(alert.id, 'acknowledged', 'Emergency Response Team Alpha');
        }, 2000);

        setTimeout(() => {
          get().updateAlertStatus(alert.id, 'responding', 'Emergency Response Team Alpha');
        }, 5000);
      }
    },

    updateAlertStatus: (alertId, status, responseTeam) => {
      set((state) => ({
        liveAlerts: state.liveAlerts.map(alert =>
          alert.id === alertId
            ? {
                ...alert,
                status,
                responseTeam: responseTeam || alert.responseTeam,
                estimatedArrival: status === 'responding' ? '5-8 minutes' : alert.estimatedArrival
              }
            : alert
        ),
        lastUpdate: new Date().toISOString()
      }));
    },

    resolveAlert: (alertId) => {
      set((state) => ({
        liveAlerts: state.liveAlerts.map(alert =>
          alert.id === alertId
            ? { ...alert, status: 'resolved' as const }
            : alert
        ),
        lastUpdate: new Date().toISOString()
      }));
    },

    clearAllAlerts: () => {
      set({
        liveAlerts: [],
        newAlertCount: 0,
        lastUpdate: new Date().toISOString()
      });
    },

    setDemoMode: (enabled) => {
      set({ isDemoMode: enabled });
    },

    simulateRandomAlert: () => {
      const template = emergencyTemplates[Math.floor(Math.random() * emergencyTemplates.length)];
      const tourist = demoTourists[Math.floor(Math.random() * demoTourists.length)];
      const location = demoLocations[Math.floor(Math.random() * demoLocations.length)];

      const alert = {
        type: template.type,
        title: template.title,
        description: `${template.title} reported by ${tourist.name}`,
        location,
        tourist,
        priority: template.priority,
        status: 'active' as const
      };

      get().addAlert(alert);
    },

    incrementTouristCount: () => {
      set((state) => ({
        connectedTourists: state.connectedTourists + 1,
        activeSessions: state.activeSessions + 1
      }));
    },

    decrementTouristCount: () => {
      set((state) => ({
        connectedTourists: Math.max(0, state.connectedTourists - 1),
        activeSessions: Math.max(0, state.activeSessions - 1)
      }));
    }
  }))
);

// Demo notification system
export class DemoNotificationManager {
  private static instance: DemoNotificationManager;
  private listeners: Set<(alert: EmergencyAlert) => void> = new Set();
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new DemoNotificationManager();
    }
    return this.instance;
  }

  subscribe(callback: (alert: EmergencyAlert) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(alert: EmergencyAlert) {
    this.listeners.forEach(callback => callback(alert));
    
    // Browser notification for demo
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Emergency Alert: ${alert.title}`, {
        body: alert.description,
        icon: '/favicon.ico',
        tag: alert.id
      });
    }
  }
}

// Hook for real-time updates
export function useRealTimeUpdates() {
  const store = useDemoStore();
  
  React.useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Subscribe to alert additions
    const unsubscribe = useDemoStore.subscribe(
      (state) => state.liveAlerts,
      (alerts, prevAlerts) => {
        const newAlerts = alerts.filter(alert => 
          !prevAlerts.some(prev => prev.id === alert.id)
        );
        
        newAlerts.forEach(alert => {
          DemoNotificationManager.getInstance().notify(alert);
        });
      }
    );

    return unsubscribe;
  }, []);

  return store;
}

// Export for easy access in components
export { useDemoStore as useDemoIntegration };