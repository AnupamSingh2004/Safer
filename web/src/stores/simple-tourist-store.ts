/**
 * Smart Tourist Safety System - Tourist Store (Simplified)
 * Basic Zustand store for tourist management and state
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// ============================================================================
// SIMPLIFIED TYPES
// ============================================================================

export interface SimpleTourist {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  status: 'active' | 'inactive' | 'emergency' | 'checked_out';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  currentLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
    timestamp: string;
  };
  safetyScore: number;
  lastCheckIn: string;
  activeAlerts: number;
  registrationDate: string;
}

export interface TouristStats {
  total: number;
  active: number;
  verified: number;
  withAlerts: number;
  online: number;
}

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface SimpleTouristStore {
  // State
  tourists: SimpleTourist[];
  selectedTourist: SimpleTourist | null;
  statistics: TouristStats;
  isLoading: boolean;
  error: string | null;
  
  // Computed values
  totalTourists: number;
  activeTourists: number;
  verifiedTourists: number;
  touristsWithAlerts: number;
  
  // Actions
  fetchTourists: () => Promise<void>;
  fetchTouristById: (id: string) => Promise<void>;
  updateTouristStatus: (id: string, status: SimpleTourist['status']) => Promise<void>;
  updateTouristLocation: (id: string, location: SimpleTourist['currentLocation']) => Promise<void>;
  selectTourist: (tourist: SimpleTourist | null) => void;
  clearError: () => void;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockTourists: SimpleTourist[] = [
  {
    id: 'tourist-001',
    firstName: 'John',
    lastName: 'Smith',
    fullName: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    nationality: 'United States',
    status: 'active',
    verificationStatus: 'verified',
    currentLocation: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'India Gate, New Delhi, India',
      timestamp: new Date().toISOString()
    },
    safetyScore: 15,
    lastCheckIn: new Date().toISOString(),
    activeAlerts: 0,
    registrationDate: '2024-01-15T08:00:00Z'
  },
  {
    id: 'tourist-002',
    firstName: 'Maria',
    lastName: 'Garcia',
    fullName: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+34-600-123456',
    nationality: 'Spain',
    status: 'active',
    verificationStatus: 'verified',
    currentLocation: {
      latitude: 28.5355,
      longitude: 77.3910,
      address: 'Akshardham Temple, New Delhi, India',
      timestamp: new Date(Date.now() - 300000).toISOString()
    },
    safetyScore: 25,
    lastCheckIn: new Date(Date.now() - 3600000).toISOString(),
    activeAlerts: 1,
    registrationDate: '2024-01-16T12:30:00Z'
  },
  {
    id: 'tourist-003',
    firstName: 'David',
    lastName: 'Johnson',
    fullName: 'David Johnson',
    email: 'david.johnson@email.com',
    phone: '+44-20-7946-0958',
    nationality: 'United Kingdom',
    status: 'active',
    verificationStatus: 'pending',
    currentLocation: {
      latitude: 28.6562,
      longitude: 77.2410,
      address: 'Red Fort, New Delhi, India',
      timestamp: new Date(Date.now() - 1800000).toISOString()
    },
    safetyScore: 10,
    lastCheckIn: new Date(Date.now() - 7200000).toISOString(),
    activeAlerts: 0,
    registrationDate: '2024-01-17T14:15:00Z'
  },
  {
    id: 'tourist-004',
    firstName: 'Sophie',
    lastName: 'Dubois',
    fullName: 'Sophie Dubois',
    email: 'sophie.dubois@email.com',
    phone: '+33-1-42-97-48-14',
    nationality: 'France',
    status: 'emergency',
    verificationStatus: 'verified',
    currentLocation: {
      latitude: 28.6129,
      longitude: 77.2295,
      address: 'Connaught Place, New Delhi, India',
      timestamp: new Date(Date.now() - 600000).toISOString()
    },
    safetyScore: 85,
    lastCheckIn: new Date(Date.now() - 10800000).toISOString(),
    activeAlerts: 3,
    registrationDate: '2024-01-18T09:20:00Z'
  },
  {
    id: 'tourist-005',
    firstName: 'Hans',
    lastName: 'Mueller',
    fullName: 'Hans Mueller',
    email: 'hans.mueller@email.com',
    phone: '+49-30-123456789',
    nationality: 'Germany',
    status: 'checked_out',
    verificationStatus: 'verified',
    safetyScore: 5,
    lastCheckIn: new Date(Date.now() - 86400000).toISOString(),
    activeAlerts: 0,
    registrationDate: '2024-01-10T11:45:00Z'
  }
];

const mockStatistics: TouristStats = {
  total: 156,
  active: 142,
  verified: 138,
  withAlerts: 12,
  online: 125
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useTouristStore = create<SimpleTouristStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      tourists: mockTourists,
      selectedTourist: null,
      statistics: mockStatistics,
      isLoading: false,
      error: null,

      // Computed values
      get totalTourists() {
        return get().tourists.length;
      },

      get activeTourists() {
        return get().tourists.filter(t => t.status === 'active').length;
      },

      get verifiedTourists() {
        return get().tourists.filter(t => t.verificationStatus === 'verified').length;
      },

      get touristsWithAlerts() {
        return get().tourists.filter(t => t.activeAlerts > 0).length;
      },

      // Actions
      fetchTourists: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ tourists: mockTourists, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch tourists',
            isLoading: false 
          });
        }
      },

      fetchTouristById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const tourist = mockTourists.find(t => t.id === id);
          if (!tourist) {
            throw new Error('Tourist not found');
          }
          
          set({ selectedTourist: tourist, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch tourist',
            isLoading: false 
          });
        }
      },

      updateTouristStatus: async (id: string, status: SimpleTourist['status']) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            tourists: state.tourists.map(t => 
              t.id === id ? { ...t, status } : t
            ),
            selectedTourist: state.selectedTourist?.id === id 
              ? { ...state.selectedTourist, status }
              : state.selectedTourist,
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update tourist status',
            isLoading: false 
          });
        }
      },

      updateTouristLocation: async (id: string, location: SimpleTourist['currentLocation']) => {
        try {
          set(state => ({
            tourists: state.tourists.map(t => 
              t.id === id 
                ? {
                    ...t,
                    currentLocation: location,
                    lastCheckIn: location?.timestamp || t.lastCheckIn
                  }
                : t
            ),
            selectedTourist: state.selectedTourist?.id === id 
              ? {
                  ...state.selectedTourist,
                  currentLocation: location,
                  lastCheckIn: location?.timestamp || state.selectedTourist.lastCheckIn
                }
              : state.selectedTourist
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update location'
          });
        }
      },

      selectTourist: (tourist: SimpleTourist | null) => {
        set({ selectedTourist: tourist });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    { name: 'simple-tourist-store' }
  )
);
