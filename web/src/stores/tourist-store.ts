/**
 * Smart Tourist Safety System - Tourist Store
 * Zustand store for tourist management and state
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  Tourist, 
  TouristId, 
  TouristStatus, 
  VerificationStatus,
  TouristSearchFilters,
  TouristSearchResult,
  TouristStatistics,
  TouristAlert,
  LocationData,
  CreateTouristRequest,
  UpdateTouristRequest,
  TouristLocationUpdate,
  CheckInRequest,
  EmergencyRequest,
  AlertLevel,
  BulkTouristOperation,
  BulkOperationResult,
  EmergencyContactRelation,
  DocumentType
} from '@/types/tourist';

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface TouristStore {
  // State
  tourists: Tourist[];
  selectedTourist: Tourist | null;
  searchResults: TouristSearchResult | null;
  statistics: TouristStatistics | null;
  isLoading: boolean;
  error: string | null;
  
  // Computed values
  totalTourists: number;
  activeTourists: number;
  verifiedTourists: number;
  touristsWithAlerts: number;
  onlineTourists: number;
  
  // Basic CRUD operations
  fetchTourists: (filters?: TouristSearchFilters) => Promise<void>;
  fetchTouristById: (id: TouristId) => Promise<void>;
  createTourist: (tourist: CreateTouristRequest) => Promise<Tourist>;
  updateTourist: (request: UpdateTouristRequest) => Promise<Tourist>;
  deleteTourist: (id: TouristId) => Promise<void>;
  
  // Search and filtering
  searchTourists: (filters: TouristSearchFilters) => Promise<void>;
  clearSearchResults: () => void;
  
  // Tourist management
  verifyTourist: (id: TouristId, method: string, details: Record<string, any>) => Promise<void>;
  updateTouristStatus: (id: TouristId, status: TouristStatus, reason?: string) => Promise<void>;
  
  // Location and tracking
  updateTouristLocation: (update: TouristLocationUpdate) => Promise<void>;
  checkInTourist: (request: CheckInRequest) => Promise<void>;
  getLocationHistory: (id: TouristId, limit?: number) => Promise<void>;
  
  // Alerts and emergency
  createAlert: (touristId: TouristId, alert: Omit<TouristAlert, 'id' | 'timestamp'>) => Promise<void>;
  acknowledgeAlert: (touristId: TouristId, alertId: string, acknowledgedBy: string) => Promise<void>;
  resolveAlert: (touristId: TouristId, alertId: string) => Promise<void>;
  createEmergencyRequest: (request: EmergencyRequest) => Promise<void>;
  
  // Statistics and analytics
  fetchStatistics: () => Promise<void>;
  
  // Bulk operations
  performBulkOperation: (operation: Omit<BulkTouristOperation, 'performedAt'>) => Promise<BulkOperationResult>;
  
  // Utility functions
  selectTourist: (tourist: Tourist | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockTourists: Tourist[] = [
  {
    id: 'tourist-001',
    firstName: 'John',
    lastName: 'Smith',
    fullName: 'John Smith',
    displayName: 'John Smith',
    dateOfBirth: '1985-06-15',
    gender: 'male',
    nationality: 'United States',
    preferredLanguage: 'English',
    spokenLanguages: ['English', 'Spanish'],
    contactInfo: {
      phone: '+1-555-0123',
      email: 'john.smith@email.com',
      alternatePhone: '+1-555-0124'
    },
    homeAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      postalCode: '10001'
    },
    emergencyContacts: [
      {
        id: 'ec-001',
        name: 'Jane Smith',
        relation: EmergencyContactRelation.SPOUSE,
        phone: '+1-555-0125',
        email: 'jane.smith@email.com',
        isPrimary: true,
        isLocal: false
      }
    ],
    documents: [
      {
        id: 'doc-001',
        type: DocumentType.PASSPORT,
        documentNumber: 'US123456789',
        issuingCountry: 'United States',
        issueDate: '2020-01-15',
        expiryDate: '2030-01-15',
        isVerified: true,
        verificationDate: '2024-01-15T10:00:00Z'
      }
    ],
    biometrics: [],
    verificationRecords: [
      {
        id: 'ver-001',
        touristId: 'tourist-001',
        status: VerificationStatus.VERIFIED,
        method: 'document',
        verificationDate: '2024-01-15T10:00:00Z',
        details: { documentType: 'passport', verifiedBy: 'system' }
      }
    ],
    verificationStatus: VerificationStatus.VERIFIED,
    devices: [
      {
        id: 'device-001',
        type: 'smartphone',
        model: 'iPhone 14',
        os: 'iOS',
        osVersion: '17.0',
        isActive: true,
        lastSeen: new Date().toISOString(),
        batteryLevel: 85,
        connectionStatus: 'online'
      }
    ],
    primaryDeviceId: 'device-001',
    trackingPreferences: {
      shareLocation: true,
      shareWithEmergencyContacts: true,
      shareWithTourGuides: false,
      trackingAccuracy: 'high',
      updateFrequency: 5,
      allowOfflineTracking: true,
      enableGeofencing: true,
      emergencyAutoShare: true
    },
    currentLocation: {
      coordinates: {
        latitude: 28.6139,
        longitude: 77.2090
      },
      address: 'India Gate, New Delhi, India',
      locationName: 'India Gate',
      timestamp: new Date().toISOString(),
      source: 'gps'
    },
    locationHistory: [],
    currentZoneId: 'zone-001',
    visitedZones: ['zone-001', 'zone-002'],
    travelDetails: {
      purpose: 'tourism',
      arrivalDate: '2024-01-15',
      departureDate: '2024-01-25',
      groupSize: 2,
      hasLocalGuide: false,
      plannedDestinations: ['New Delhi', 'Mumbai', 'Goa'],
      specialRequirements: []
    },
    status: TouristStatus.ACTIVE,
    safetyStatus: {
      level: AlertLevel.INFO,
      lastCheckedIn: new Date().toISOString(),
      lastLocationUpdate: new Date().toISOString(),
      isInSafeZone: true,
      currentRiskScore: 15,
      activeAlerts: [],
      missedCheckIns: 0,
      emergencyContactsNotified: false
    },
    alerts: [],
    registrationDate: '2024-01-15T08:00:00Z',
    lastUpdateDate: new Date().toISOString(),
    isActive: true,
    privacyConsent: {
      dataCollection: true,
      locationTracking: true,
      emergencySharing: true,
      analyticsUsage: true,
      thirdPartySharing: false,
      consentDate: '2024-01-15T08:00:00Z',
      consentVersion: '1.0'
    },
    blockchainVerified: false
  },
  {
    id: 'tourist-002',
    firstName: 'Maria',
    lastName: 'Garcia',
    fullName: 'Maria Garcia',
    displayName: 'Maria Garcia',
    dateOfBirth: '1990-03-22',
    gender: 'female',
    nationality: 'Spain',
    preferredLanguage: 'Spanish',
    spokenLanguages: ['Spanish', 'English', 'French'],
    contactInfo: {
      phone: '+34-600-123456',
      email: 'maria.garcia@email.com'
    },
    homeAddress: {
      street: 'Calle Mayor 25',
      city: 'Madrid',
      state: 'Madrid',
      country: 'Spain',
      postalCode: '28013'
    },
    emergencyContacts: [
      {
        id: 'ec-002',
        name: 'Carlos Garcia',
        relation: EmergencyContactRelation.PARENT,
        phone: '+34-600-123457',
        isPrimary: true,
        isLocal: false
      }
    ],
    documents: [
      {
        id: 'doc-002',
        type: DocumentType.PASSPORT,
        documentNumber: 'ES987654321',
        issuingCountry: 'Spain',
        issueDate: '2021-05-10',
        expiryDate: '2031-05-10',
        isVerified: true,
        verificationDate: '2024-01-16T14:30:00Z'
      }
    ],
    biometrics: [],
    verificationRecords: [
      {
        id: 'ver-002',
        touristId: 'tourist-002',
        status: VerificationStatus.VERIFIED,
        method: 'document',
        verificationDate: '2024-01-16T14:30:00Z',
        details: { documentType: 'passport', verifiedBy: 'admin-001' }
      }
    ],
    verificationStatus: VerificationStatus.VERIFIED,
    devices: [
      {
        id: 'device-002',
        type: 'smartphone',
        model: 'Samsung Galaxy S23',
        os: 'Android',
        osVersion: '14.0',
        isActive: true,
        lastSeen: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        batteryLevel: 65,
        connectionStatus: 'online'
      }
    ],
    primaryDeviceId: 'device-002',
    trackingPreferences: {
      shareLocation: true,
      shareWithEmergencyContacts: true,
      shareWithTourGuides: true,
      trackingAccuracy: 'medium',
      updateFrequency: 10,
      allowOfflineTracking: true,
      enableGeofencing: true,
      emergencyAutoShare: true
    },
    currentLocation: {
      coordinates: {
        latitude: 28.5355,
        longitude: 77.3910
      },
      address: 'Akshardham Temple, New Delhi, India',
      locationName: 'Akshardham Temple',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      source: 'gps'
    },
    locationHistory: [],
    currentZoneId: 'zone-003',
    visitedZones: ['zone-003', 'zone-004'],
    travelDetails: {
      purpose: 'tourism',
      arrivalDate: '2024-01-16',
      departureDate: '2024-01-30',
      groupSize: 1,
      hasLocalGuide: true,
      guideContactInfo: {
        phone: '+91-98765-43210',
        email: 'guide@localtours.com'
      },
      plannedDestinations: ['New Delhi', 'Agra', 'Jaipur'],
      specialRequirements: ['Vegetarian food']
    },
    status: TouristStatus.ACTIVE,
    safetyStatus: {
      level: AlertLevel.LOW,
      lastCheckedIn: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      lastLocationUpdate: new Date(Date.now() - 300000).toISOString(),
      isInSafeZone: true,
      currentRiskScore: 25,
      activeAlerts: ['alert-001'],
      missedCheckIns: 1,
      emergencyContactsNotified: false
    },
    alerts: [
      {
        id: 'alert-001',
        touristId: 'tourist-002',
        type: 'safety',
        level: AlertLevel.LOW,
        title: 'Missed Check-in',
        message: 'Tourist has not checked in for over 1 hour',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        isActive: true,
        isAcknowledged: false,
        actions: ['Send reminder', 'Contact tourist', 'Notify emergency contacts'],
        metadata: { expectedCheckIn: new Date(Date.now() - 3600000).toISOString() }
      }
    ],
    registrationDate: '2024-01-16T12:30:00Z',
    lastUpdateDate: new Date().toISOString(),
    isActive: true,
    privacyConsent: {
      dataCollection: true,
      locationTracking: true,
      emergencySharing: true,
      analyticsUsage: false,
      thirdPartySharing: false,
      consentDate: '2024-01-16T12:30:00Z',
      consentVersion: '1.0'
    },
    blockchainVerified: false
  }
];

const mockStatistics: TouristStatistics = {
  total: 156,
  active: 142,
  verified: 138,
  withActiveAlerts: 12,
  byStatus: {
    [TouristStatus.ACTIVE]: 142,
    [TouristStatus.INACTIVE]: 8,
    [TouristStatus.EMERGENCY]: 2,
    [TouristStatus.CHECKED_OUT]: 3,
    [TouristStatus.MISSING]: 1,
    [TouristStatus.SAFE]: 0
  },
  byVerificationStatus: {
    [VerificationStatus.PENDING]: 8,
    [VerificationStatus.VERIFIED]: 138,
    [VerificationStatus.REJECTED]: 2,
    [VerificationStatus.EXPIRED]: 6,
    [VerificationStatus.SUSPENDED]: 2
  },
  byNationality: {
    'United States': 45,
    'United Kingdom': 32,
    'Germany': 28,
    'France': 22,
    'Spain': 15,
    'Other': 14
  },
  byAlertLevel: {
    [AlertLevel.INFO]: 120,
    [AlertLevel.LOW]: 24,
    [AlertLevel.MEDIUM]: 8,
    [AlertLevel.HIGH]: 3,
    [AlertLevel.CRITICAL]: 1
  },
  averageStayDuration: 8.5,
  averageSafetyScore: 18.7,
  checkInCompliance: 87.5,
  recentRegistrations: 8,
  recentCheckIns: 125
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useTouristStore = create<TouristStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      tourists: mockTourists,
      selectedTourist: null,
      searchResults: null,
      statistics: mockStatistics,
      isLoading: false,
      error: null,

      // Computed values
      get totalTourists() {
        return get().tourists.length;
      },

      get activeTourists() {
        return get().tourists.filter(t => t.status === TouristStatus.ACTIVE).length;
      },

      get verifiedTourists() {
        return get().tourists.filter(t => t.verificationStatus === VerificationStatus.VERIFIED).length;
      },

      get touristsWithAlerts() {
        return get().tourists.filter(t => t.alerts.some(a => a.isActive)).length;
      },

      get onlineTourists() {
        return get().tourists.filter(t => 
          t.devices.some(d => d.isActive && d.connectionStatus === 'online')
        ).length;
      },

      // Basic CRUD operations
      fetchTourists: async (filters?: TouristSearchFilters) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          let filteredTourists = mockTourists;
          
          if (filters) {
            if (filters.status) {
              filteredTourists = filteredTourists.filter(t => 
                filters.status!.includes(t.status)
              );
            }
            
            if (filters.verificationStatus) {
              filteredTourists = filteredTourists.filter(t => 
                filters.verificationStatus!.includes(t.verificationStatus)
              );
            }
            
            if (filters.search) {
              const searchLower = filters.search.toLowerCase();
              filteredTourists = filteredTourists.filter(t => 
                t.fullName.toLowerCase().includes(searchLower) ||
                t.contactInfo.email.toLowerCase().includes(searchLower) ||
                t.contactInfo.phone.includes(filters.search!) ||
                t.documents.some(d => d.documentNumber.includes(filters.search!))
              );
            }
          }
          
          set({ tourists: filteredTourists, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch tourists',
            isLoading: false 
          });
        }
      },

      fetchTouristById: async (id: TouristId) => {
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

      createTourist: async (request: CreateTouristRequest) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newTourist: Tourist = {
            ...request,
            id: `tourist-${Date.now()}`,
            fullName: `${request.firstName} ${request.lastName}`,
            displayName: `${request.firstName} ${request.lastName}`,
            spokenLanguages: [request.preferredLanguage],
            documents: request.documents.map((doc, index) => ({
              ...doc,
              id: `doc-${Date.now()}-${index}`,
              isVerified: false
            })),
            biometrics: [],
            verificationRecords: [],
            verificationStatus: VerificationStatus.PENDING,
            devices: [],
            locationHistory: [],
            visitedZones: [],
            status: TouristStatus.ACTIVE,
            safetyStatus: {
              level: AlertLevel.INFO,
              lastCheckedIn: new Date().toISOString(),
              lastLocationUpdate: new Date().toISOString(),
              isInSafeZone: true,
              currentRiskScore: 0,
              activeAlerts: [],
              missedCheckIns: 0,
              emergencyContactsNotified: false
            },
            alerts: [],
            registrationDate: new Date().toISOString(),
            lastUpdateDate: new Date().toISOString(),
            isActive: true,
            blockchainVerified: false
          };
          
          set(state => ({ 
            tourists: [...state.tourists, newTourist],
            isLoading: false 
          }));
          
          return newTourist;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create tourist',
            isLoading: false 
          });
          throw error;
        }
      },

      updateTourist: async (request: UpdateTouristRequest) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            tourists: state.tourists.map(t => 
              t.id === request.id 
                ? { 
                    ...t, 
                    ...request.updates, 
                    lastUpdateDate: new Date().toISOString() 
                  }
                : t
            ),
            selectedTourist: state.selectedTourist?.id === request.id 
              ? { 
                  ...state.selectedTourist, 
                  ...request.updates, 
                  lastUpdateDate: new Date().toISOString() 
                }
              : state.selectedTourist,
            isLoading: false
          }));
          
          const updatedTourist = get().tourists.find(t => t.id === request.id);
          if (!updatedTourist) {
            throw new Error('Tourist not found after update');
          }
          
          return updatedTourist;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update tourist',
            isLoading: false 
          });
          throw error;
        }
      },

      deleteTourist: async (id: TouristId) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            tourists: state.tourists.filter(t => t.id !== id),
            selectedTourist: state.selectedTourist?.id === id ? null : state.selectedTourist,
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete tourist',
            isLoading: false 
          });
        }
      },

      // Search and filtering
      searchTourists: async (filters: TouristSearchFilters) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Simulate search logic
          let results = mockTourists;
          
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            results = results.filter(t => 
              t.fullName.toLowerCase().includes(searchLower) ||
              t.contactInfo.email.toLowerCase().includes(searchLower)
            );
          }
          
          const searchResult: TouristSearchResult = {
            tourists: results,
            total: results.length,
            filters,
            aggregations: {
              statusCounts: mockStatistics.byStatus,
              verificationStatusCounts: mockStatistics.byVerificationStatus,
              alertLevelCounts: mockStatistics.byAlertLevel,
              nationalityCounts: mockStatistics.byNationality,
              zoneCounts: { 'zone-001': 45, 'zone-002': 32, 'zone-003': 28 }
            }
          };
          
          set({ searchResults: searchResult, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to search tourists',
            isLoading: false 
          });
        }
      },

      clearSearchResults: () => {
        set({ searchResults: null });
      },

      // Tourist management
      verifyTourist: async (id: TouristId, method: 'document' | 'biometric' | 'manual' | 'blockchain', details: Record<string, any>) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const verificationRecord = {
            id: `ver-${Date.now()}`,
            touristId: id,
            status: VerificationStatus.VERIFIED,
            method,
            verificationDate: new Date().toISOString(),
            details
          };
          
          set(state => ({
            tourists: state.tourists.map(t => 
              t.id === id 
                ? {
                    ...t,
                    verificationStatus: VerificationStatus.VERIFIED,
                    verificationRecords: [...t.verificationRecords, verificationRecord],
                    lastUpdateDate: new Date().toISOString()
                  }
                : t
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to verify tourist',
            isLoading: false 
          });
        }
      },

      updateTouristStatus: async (id: TouristId, status: TouristStatus, reason?: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            tourists: state.tourists.map(t => 
              t.id === id 
                ? {
                    ...t,
                    status,
                    lastUpdateDate: new Date().toISOString(),
                    notes: reason ? [...(t.notes || []), `Status changed to ${status}: ${reason}`] : t.notes
                  }
                : t
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update tourist status',
            isLoading: false 
          });
        }
      },

      // Location and tracking
      updateTouristLocation: async (update: TouristLocationUpdate) => {
        try {
          set(state => ({
            tourists: state.tourists.map(t => 
              t.id === update.touristId 
                ? {
                    ...t,
                    currentLocation: update.location,
                    lastKnownLocation: t.currentLocation,
                    safetyStatus: {
                      ...t.safetyStatus,
                      lastLocationUpdate: update.location.timestamp
                    },
                    devices: t.devices.map(d => 
                      d.id === update.deviceId 
                        ? {
                            ...d,
                            lastSeen: update.location.timestamp,
                            batteryLevel: update.batteryLevel || d.batteryLevel,
                            connectionStatus: update.connectionStatus || d.connectionStatus
                          }
                        : d
                    ),
                    lastUpdateDate: new Date().toISOString()
                  }
                : t
            )
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update location'
          });
        }
      },

      checkInTourist: async (request: CheckInRequest) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            tourists: state.tourists.map(t => 
              t.id === request.touristId 
                ? {
                    ...t,
                    currentLocation: request.location,
                    currentZoneId: request.zoneId,
                    safetyStatus: {
                      ...t.safetyStatus,
                      lastCheckedIn: request.location.timestamp,
                      lastLocationUpdate: request.location.timestamp,
                      missedCheckIns: 0
                    },
                    lastUpdateDate: new Date().toISOString()
                  }
                : t
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to check in tourist',
            isLoading: false 
          });
        }
      },

      getLocationHistory: async (id: TouristId, limit?: number) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          // In a real app, this would fetch from API
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch location history',
            isLoading: false 
          });
        }
      },

      // Alerts and emergency
      createAlert: async (touristId: TouristId, alert: Omit<TouristAlert, 'id' | 'timestamp'>) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const newAlert: TouristAlert = {
            ...alert,
            id: `alert-${Date.now()}`,
            timestamp: new Date().toISOString()
          };
          
          set(state => ({
            tourists: state.tourists.map(t => 
              t.id === touristId 
                ? {
                    ...t,
                    alerts: [...t.alerts, newAlert],
                    safetyStatus: {
                      ...t.safetyStatus,
                      activeAlerts: [...t.safetyStatus.activeAlerts, newAlert.id],
                      level: alert.level
                    },
                    lastUpdateDate: new Date().toISOString()
                  }
                : t
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create alert',
            isLoading: false 
          });
        }
      },

      acknowledgeAlert: async (touristId: TouristId, alertId: string, acknowledgedBy: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            tourists: state.tourists.map(t => 
              t.id === touristId 
                ? {
                    ...t,
                    alerts: t.alerts.map(a => 
                      a.id === alertId 
                        ? {
                            ...a,
                            isAcknowledged: true,
                            acknowledgedBy,
                            acknowledgedAt: new Date().toISOString()
                          }
                        : a
                    ),
                    lastUpdateDate: new Date().toISOString()
                  }
                : t
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to acknowledge alert',
            isLoading: false 
          });
        }
      },

      resolveAlert: async (touristId: TouristId, alertId: string) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => ({
            tourists: state.tourists.map(t => 
              t.id === touristId 
                ? {
                    ...t,
                    alerts: t.alerts.map(a => 
                      a.id === alertId 
                        ? {
                            ...a,
                            isActive: false,
                            resolvedAt: new Date().toISOString()
                          }
                        : a
                    ),
                    safetyStatus: {
                      ...t.safetyStatus,
                      activeAlerts: t.safetyStatus.activeAlerts.filter(id => id !== alertId)
                    },
                    lastUpdateDate: new Date().toISOString()
                  }
                : t
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to resolve alert',
            isLoading: false 
          });
        }
      },

      createEmergencyRequest: async (request: EmergencyRequest) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const emergencyAlert: TouristAlert = {
            id: `emergency-${Date.now()}`,
            touristId: request.touristId,
            type: 'safety',
            level: request.severity,
            title: `Emergency: ${request.emergencyType.toUpperCase()}`,
            message: request.description,
            location: request.location,
            timestamp: new Date().toISOString(),
            isActive: true,
            isAcknowledged: false,
            actions: [
              'Contact emergency services',
              'Notify emergency contacts',
              'Dispatch local response team'
            ],
            metadata: {
              emergencyType: request.emergencyType,
              contactEmergencyServices: request.contactEmergencyServices,
              notifyEmergencyContacts: request.notifyEmergencyContacts
            }
          };
          
          set(state => ({
            tourists: state.tourists.map(t => 
              t.id === request.touristId 
                ? {
                    ...t,
                    status: TouristStatus.EMERGENCY,
                    alerts: [...t.alerts, emergencyAlert],
                    safetyStatus: {
                      ...t.safetyStatus,
                      level: request.severity,
                      activeAlerts: [...t.safetyStatus.activeAlerts, emergencyAlert.id],
                      emergencyContactsNotified: request.notifyEmergencyContacts,
                      lastEmergencyAlert: emergencyAlert.timestamp
                    },
                    currentLocation: request.location,
                    lastUpdateDate: new Date().toISOString()
                  }
                : t
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create emergency request',
            isLoading: false 
          });
        }
      },

      // Statistics and analytics
      fetchStatistics: async () => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ statistics: mockStatistics, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch statistics',
            isLoading: false 
          });
        }
      },

      // Bulk operations
      performBulkOperation: async (operation: Omit<BulkTouristOperation, 'performedAt'>) => {
        set({ isLoading: true, error: null });
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const result: BulkOperationResult = {
            operation: {
              ...operation,
              performedAt: new Date().toISOString()
            },
            successful: operation.touristIds,
            failed: [],
            summary: {
              total: operation.touristIds.length,
              successful: operation.touristIds.length,
              failed: 0
            }
          };
          
          // Apply the operation
          if (operation.type === 'update_status' && operation.data?.status) {
            set(state => ({
              tourists: state.tourists.map(t => 
                operation.touristIds.includes(t.id) 
                  ? {
                      ...t,
                      status: operation.data!.status,
                      lastUpdateDate: new Date().toISOString()
                    }
                  : t
              )
            }));
          }
          
          set({ isLoading: false });
          return result;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to perform bulk operation',
            isLoading: false 
          });
          throw error;
        }
      },

      // Utility functions
      selectTourist: (tourist: Tourist | null) => {
        set({ selectedTourist: tourist });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      }
    }),
    { name: 'tourist-store' }
  )
);
