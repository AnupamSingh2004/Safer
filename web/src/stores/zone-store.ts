/**
 * Smart Tourist Safety System - Zone Management Store
 * Zustand store for managing zone creation, editing, risk assessment, and geofence monitoring
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  Zone,
  ZoneType,
  RiskLevel,
  ZoneStatus,
  ZoneFilter,
  ZoneSortOptions,
  ZoneOverlap,
  ZoneAnalytics,
  Coordinates,
  CircularZone,
  PolygonZone,
} from '@/types/zone';

// ============================================================================
// STORE STATE INTERFACE
// ============================================================================

interface ZoneStoreState {
  // Zone data
  zones: Zone[];
  selectedZone: Zone | null;
  filteredZones: Zone[];
  
  // Loading and error states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  
  // Filters and sorting
  filters: ZoneFilter;
  sortOptions: ZoneSortOptions;
  
  // Analytics and statistics
  analytics: Record<string, ZoneAnalytics>;
  totalZones: number;
  activeZones: number;
  highRiskZones: number;
  
  // Zone overlaps and conflicts
  overlaps: ZoneOverlap[];
  
  // Real-time monitoring
  geofenceAlerts: Array<{
    zoneId: string;
    touristId: string;
    alertType: 'entry' | 'exit' | 'dwell_time';
    timestamp: string;
  }>;
}

interface ZoneStoreActions {
  // Zone CRUD operations
  fetchZones: () => Promise<void>;
  createZone: (zoneData: Partial<Zone>) => Promise<Zone | null>;
  updateZone: (id: string, updates: Partial<Zone>) => Promise<Zone | null>;
  deleteZone: (id: string) => Promise<boolean>;
  duplicateZone: (id: string) => Promise<Zone | null>;
  
  // Zone selection and viewing
  selectZone: (zone: Zone | null) => void;
  getZoneById: (id: string) => Zone | undefined;
  
  // Zone status management
  activateZone: (id: string) => Promise<boolean>;
  deactivateZone: (id: string) => Promise<boolean>;
  toggleZoneStatus: (id: string) => Promise<boolean>;
  
  // Bulk operations
  bulkUpdateZones: (ids: string[], updates: Partial<Zone>) => Promise<boolean>;
  bulkDeleteZones: (ids: string[]) => Promise<boolean>;
  bulkActivateZones: (ids: string[]) => Promise<boolean>;
  
  // Filtering and sorting
  setFilters: (filters: Partial<ZoneFilter>) => void;
  setSortOptions: (options: ZoneSortOptions) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  
  // Zone creation helpers
  createCircularZone: (center: Coordinates, radius: number, config: Partial<Zone>) => Promise<Zone | null>;
  createPolygonZone: (points: Coordinates[], config: Partial<Zone>) => Promise<Zone | null>;
  
  // Geofence operations
  enableGeofence: (id: string) => Promise<boolean>;
  disableGeofence: (id: string) => Promise<boolean>;
  updateGeofenceSettings: (id: string, settings: any) => Promise<boolean>;
  
  // Risk assessment
  updateRiskLevel: (id: string, riskLevel: RiskLevel) => Promise<boolean>;
  calculateZoneRisk: (id: string) => Promise<number>;
  
  // Zone overlaps and conflicts
  checkOverlaps: (zoneId?: string) => Promise<void>;
  resolveOverlap: (overlapId: string, resolution: any) => Promise<boolean>;
  
  // Analytics
  fetchZoneAnalytics: (zoneId: string, timeRange?: { start: string; end: string }) => Promise<void>;
  getZoneStatistics: () => { total: number; active: number; highRisk: number };
  
  // Real-time monitoring
  addGeofenceAlert: (alert: any) => void;
  clearGeofenceAlerts: () => void;
  getActiveAlerts: () => any[];
  
  // Utility actions
  clearError: () => void;
  reset: () => void;
}

type ZoneStore = ZoneStoreState & ZoneStoreActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: ZoneStoreState = {
  zones: [],
  selectedZone: null,
  filteredZones: [],
  
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  
  filters: {},
  sortOptions: {
    field: 'name',
    direction: 'asc',
  },
  
  analytics: {},
  totalZones: 0,
  activeZones: 0,
  highRiskZones: 0,
  
  overlaps: [],
  geofenceAlerts: [],
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Filters zones based on current filter criteria
 */
const filterZones = (zones: Zone[], filters: ZoneFilter): Zone[] => {
  return zones.filter(zone => {
    // Type filter
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(zone.type)) return false;
    }

    // Risk level filter
    if (filters.riskLevels && filters.riskLevels.length > 0) {
      if (!filters.riskLevels.includes(zone.riskLevel)) return false;
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(zone.status)) return false;
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const nameMatch = zone.name.toLowerCase().includes(searchLower);
      const descMatch = zone.description?.toLowerCase().includes(searchLower);
      if (!nameMatch && !descMatch) return false;
    }

    // Occupancy filters
    if (filters.minOccupancy !== undefined) {
      if (zone.statistics.currentOccupancy < filters.minOccupancy) return false;
    }
    if (filters.maxOccupancy !== undefined) {
      if (zone.statistics.currentOccupancy > filters.maxOccupancy) return false;
    }

    // Alerts filter
    if (filters.hasAlerts !== undefined) {
      const hasAlerts = zone.statistics.alertsTriggeredToday > 0;
      if (filters.hasAlerts !== hasAlerts) return false;
    }

    // Date filters
    if (filters.createdAfter) {
      if (new Date(zone.createdAt) < new Date(filters.createdAfter)) return false;
    }
    if (filters.createdBefore) {
      if (new Date(zone.createdAt) > new Date(filters.createdBefore)) return false;
    }

    return true;
  });
};

/**
 * Sorts zones based on sort options
 */
const sortZones = (zones: Zone[], sortOptions: ZoneSortOptions): Zone[] => {
  return [...zones].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortOptions.field) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      case 'riskLevel':
        // Convert risk level to numeric for sorting
        const riskOrder = { very_low: 1, low: 2, moderate: 3, high: 4, very_high: 5, critical: 6 };
        aValue = riskOrder[a.riskLevel as keyof typeof riskOrder];
        bValue = riskOrder[b.riskLevel as keyof typeof riskOrder];
        break;
      case 'currentOccupancy':
        aValue = a.statistics.currentOccupancy;
        bValue = b.statistics.currentOccupancy;
        break;
      case 'alertsTriggered':
        aValue = a.statistics.alertsTriggeredToday;
        bValue = b.statistics.alertsTriggeredToday;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOptions.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOptions.direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const useZoneStore = create<ZoneStore>()(
  devtools(
    (set: (partial: ZoneStore | Partial<ZoneStore> | ((state: ZoneStore) => ZoneStore | Partial<ZoneStore>), replace?: boolean | undefined) => void, get: () => ZoneStore) => ({
      ...initialState,

      // ========================================================================
      // ZONE CRUD OPERATIONS
      // ========================================================================

      fetchZones: async () => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call - replace with actual API integration
          const mockZones: Zone[] = [
            {
              id: 'zone-1',
              name: 'City Center Tourist Area',
              description: 'Main tourist attraction zone in the city center',
              type: ZoneType.TOURIST_ATTRACTION,
              riskLevel: RiskLevel.LOW,
              status: ZoneStatus.ACTIVE,
              geometry: {
                center: { latitude: 40.7589, longitude: -73.9851 },
                radius: 500
              } as CircularZone,
              alertSettings: {
                enableEntryAlerts: true,
                enableExitAlerts: false,
                enableDwellTimeAlerts: true,
                maxDwellTime: 120,
                alertPriority: 'medium' as any,
                autoEscalate: false
              },
              accessRestrictions: {
                requiresPermission: false,
                maxOccupancy: 1000,
                requiresGuide: false
              },
              statistics: {
                currentOccupancy: 156,
                maxOccupancyToday: 289,
                totalVisitsToday: 450,
                totalVisitsThisWeek: 2100,
                averageDwellTime: 45,
                alertsTriggeredToday: 2
              },
              boundingBox: {
                northeast: { latitude: 40.7634, longitude: -73.9806 },
                southwest: { latitude: 40.7544, longitude: -73.9896 }
              },
              isGeofenceActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: 'admin'
            },
            {
              id: 'zone-2',
              name: 'Mountain Trail - High Risk',
              description: 'Dangerous mountain trail requiring guide supervision',
              type: ZoneType.RISK_ZONE,
              riskLevel: RiskLevel.HIGH,
              status: ZoneStatus.ACTIVE,
              geometry: {
                points: [
                  { latitude: 40.7700, longitude: -73.9600 },
                  { latitude: 40.7750, longitude: -73.9550 },
                  { latitude: 40.7800, longitude: -73.9650 },
                  { latitude: 40.7720, longitude: -73.9700 }
                ]
              } as PolygonZone,
              alertSettings: {
                enableEntryAlerts: true,
                enableExitAlerts: true,
                enableDwellTimeAlerts: true,
                maxDwellTime: 240,
                alertPriority: 'high' as any,
                autoEscalate: true,
                escalationTime: 30
              },
              accessRestrictions: {
                requiresPermission: true,
                requiresGuide: true,
                maxOccupancy: 50
              },
              statistics: {
                currentOccupancy: 12,
                maxOccupancyToday: 28,
                totalVisitsToday: 45,
                totalVisitsThisWeek: 180,
                averageDwellTime: 180,
                alertsTriggeredToday: 8
              },
              boundingBox: {
                northeast: { latitude: 40.7800, longitude: -73.9550 },
                southwest: { latitude: 40.7700, longitude: -73.9700 }
              },
              isGeofenceActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: 'admin'
            }
          ];

          set((state: ZoneStoreState) => {
            const filteredZones = filterZones(mockZones, state.filters);
            const sortedZones = sortZones(filteredZones, state.sortOptions);
            
            return {
              zones: mockZones,
              filteredZones: sortedZones,
              totalZones: mockZones.length,
              activeZones: mockZones.filter(z => z.status === ZoneStatus.ACTIVE).length,
              highRiskZones: mockZones.filter(z => z.riskLevel === RiskLevel.HIGH || z.riskLevel === RiskLevel.VERY_HIGH || z.riskLevel === RiskLevel.CRITICAL).length,
              isLoading: false
            };
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch zones',
            isLoading: false 
          });
        }
      },

      createZone: async (zoneData: Partial<Zone>) => {
        set({ isCreating: true, error: null });
        try {
          const newZone: Zone = {
            id: `zone-${Date.now()}`,
            name: zoneData.name || 'New Zone',
            description: zoneData.description || '',
            type: zoneData.type || ZoneType.SAFE_ZONE,
            riskLevel: zoneData.riskLevel || RiskLevel.LOW,
            status: ZoneStatus.ACTIVE,
            geometry: zoneData.geometry || { center: { latitude: 0, longitude: 0 }, radius: 100 },
            alertSettings: zoneData.alertSettings || {
              enableEntryAlerts: false,
              enableExitAlerts: false,
              enableDwellTimeAlerts: false,
              alertPriority: 'low' as any,
              autoEscalate: false
            },
            accessRestrictions: zoneData.accessRestrictions || {
              requiresPermission: false,
              requiresGuide: false
            },
            statistics: {
              currentOccupancy: 0,
              maxOccupancyToday: 0,
              totalVisitsToday: 0,
              totalVisitsThisWeek: 0,
              averageDwellTime: 0,
              alertsTriggeredToday: 0
            },
            boundingBox: zoneData.boundingBox || {
              northeast: { latitude: 0, longitude: 0 },
              southwest: { latitude: 0, longitude: 0 }
            },
            isGeofenceActive: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'current-user'
          };

          set((state: ZoneStoreState) => {
            const updatedZones = [...state.zones, newZone];
            const filteredZones = filterZones(updatedZones, state.filters);
            const sortedZones = sortZones(filteredZones, state.sortOptions);
            
            return {
              zones: updatedZones,
              filteredZones: sortedZones,
              totalZones: updatedZones.length,
              activeZones: updatedZones.filter(z => z.status === ZoneStatus.ACTIVE).length,
              isCreating: false
            };
          });

          return newZone;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create zone',
            isCreating: false 
          });
          return null;
        }
      },

      updateZone: async (id: string, updates: Partial<Zone>) => {
        set({ isUpdating: true, error: null });
        try {
          set((state: ZoneStoreState) => {
            const updatedZones = state.zones.map(zone =>
              zone.id === id
                ? { ...zone, ...updates, updatedAt: new Date().toISOString() }
                : zone
            );
            
            const filteredZones = filterZones(updatedZones, state.filters);
            const sortedZones = sortZones(filteredZones, state.sortOptions);
            const updatedZone = updatedZones.find(z => z.id === id);
            
            return {
              zones: updatedZones,
              filteredZones: sortedZones,
              selectedZone: state.selectedZone?.id === id ? updatedZone || null : state.selectedZone,
              isUpdating: false
            };
          });

          const { zones } = get();
          return zones.find(z => z.id === id) || null;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update zone',
            isUpdating: false 
          });
          return null;
        }
      },

      deleteZone: async (id: string) => {
        set({ isDeleting: true, error: null });
        try {
          set((state: ZoneStoreState) => {
            const updatedZones = state.zones.filter(zone => zone.id !== id);
            const filteredZones = filterZones(updatedZones, state.filters);
            const sortedZones = sortZones(filteredZones, state.sortOptions);
            
            return {
              zones: updatedZones,
              filteredZones: sortedZones,
              selectedZone: state.selectedZone?.id === id ? null : state.selectedZone,
              totalZones: updatedZones.length,
              activeZones: updatedZones.filter(z => z.status === ZoneStatus.ACTIVE).length,
              isDeleting: false
            };
          });

          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete zone',
            isDeleting: false 
          });
          return false;
        }
      },

      duplicateZone: async (id: string) => {
        const zone = get().zones.find(z => z.id === id);
        if (!zone) return null;

        const duplicatedZone = {
          ...zone,
          name: `${zone.name} (Copy)`,
          id: undefined
        };

        return get().createZone(duplicatedZone);
      },

      // ========================================================================
      // ZONE SELECTION AND VIEWING
      // ========================================================================

      selectZone: (zone: Zone | null) => {
        set({ selectedZone: zone });
      },

      getZoneById: (id: string) => {
        return get().zones.find(zone => zone.id === id);
      },

      // ========================================================================
      // ZONE STATUS MANAGEMENT
      // ========================================================================

      activateZone: async (id: string) => {
        const result = await get().updateZone(id, { status: ZoneStatus.ACTIVE });
        return result !== null;
      },

      deactivateZone: async (id: string) => {
        const result = await get().updateZone(id, { status: ZoneStatus.INACTIVE });
        return result !== null;
      },

      toggleZoneStatus: async (id: string) => {
        const zone = get().zones.find(z => z.id === id);
        if (!zone) return false;

        const newStatus = zone.status === ZoneStatus.ACTIVE ? ZoneStatus.INACTIVE : ZoneStatus.ACTIVE;
        const result = await get().updateZone(id, { status: newStatus });
        return result !== null;
      },

      // ========================================================================
      // BULK OPERATIONS
      // ========================================================================

      bulkUpdateZones: async (ids: string[], updates: Partial<Zone>) => {
        try {
          for (const id of ids) {
            await get().updateZone(id, updates);
          }
          return true;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to bulk update zones' });
          return false;
        }
      },

      bulkDeleteZones: async (ids: string[]) => {
        try {
          for (const id of ids) {
            await get().deleteZone(id);
          }
          return true;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to bulk delete zones' });
          return false;
        }
      },

      bulkActivateZones: async (ids: string[]) => {
        return get().bulkUpdateZones(ids, { status: ZoneStatus.ACTIVE });
      },

      // ========================================================================
      // FILTERING AND SORTING
      // ========================================================================

      setFilters: (filters: Partial<ZoneFilter>) => {
        set((state: ZoneStoreState) => {
          const newFilters = { ...state.filters, ...filters };
          const filteredZones = filterZones(state.zones, newFilters);
          const sortedZones = sortZones(filteredZones, state.sortOptions);
          
          return {
            filters: newFilters,
            filteredZones: sortedZones
          };
        });
      },

      setSortOptions: (options: ZoneSortOptions) => {
        set((state: ZoneStoreState) => {
          const sortedZones = sortZones(state.filteredZones, options);
          return {
            sortOptions: options,
            filteredZones: sortedZones
          };
        });
      },

      resetFilters: () => {
        set((state: ZoneStoreState) => {
          const filteredZones = sortZones(state.zones, state.sortOptions);
          return {
            filters: {},
            filteredZones
          };
        });
      },

      applyFilters: () => {
        set((state: ZoneStoreState) => {
          const filteredZones = filterZones(state.zones, state.filters);
          const sortedZones = sortZones(filteredZones, state.sortOptions);
          return { filteredZones: sortedZones };
        });
      },

      // ========================================================================
      // ZONE CREATION HELPERS
      // ========================================================================

      createCircularZone: async (center: Coordinates, radius: number, config: Partial<Zone>) => {
        const circularGeometry: CircularZone = { center, radius };
        const zoneData = {
          ...config,
          geometry: circularGeometry,
          boundingBox: {
            northeast: {
              latitude: center.latitude + (radius / 111000),
              longitude: center.longitude + (radius / (111000 * Math.cos(center.latitude * Math.PI / 180)))
            },
            southwest: {
              latitude: center.latitude - (radius / 111000),
              longitude: center.longitude - (radius / (111000 * Math.cos(center.latitude * Math.PI / 180)))
            }
          }
        };
        
        return get().createZone(zoneData);
      },

      createPolygonZone: async (points: Coordinates[], config: Partial<Zone>) => {
        const polygonGeometry: PolygonZone = { points };
        
        // Calculate bounding box
        const latitudes = points.map(p => p.latitude);
        const longitudes = points.map(p => p.longitude);
        const boundingBox = {
          northeast: {
            latitude: Math.max(...latitudes),
            longitude: Math.max(...longitudes)
          },
          southwest: {
            latitude: Math.min(...latitudes),
            longitude: Math.min(...longitudes)
          }
        };
        
        const zoneData = {
          ...config,
          geometry: polygonGeometry,
          boundingBox
        };
        
        return get().createZone(zoneData);
      },

      // ========================================================================
      // GEOFENCE OPERATIONS
      // ========================================================================

      enableGeofence: async (id: string) => {
        const result = await get().updateZone(id, { isGeofenceActive: true });
        return result !== null;
      },

      disableGeofence: async (id: string) => {
        const result = await get().updateZone(id, { isGeofenceActive: false });
        return result !== null;
      },

      updateGeofenceSettings: async (id: string, settings: any) => {
        // This would update geofence-specific settings
        return true;
      },

      // ========================================================================
      // RISK ASSESSMENT
      // ========================================================================

      updateRiskLevel: async (id: string, riskLevel: RiskLevel) => {
        const result = await get().updateZone(id, { riskLevel });
        return result !== null;
      },

      calculateZoneRisk: async (id: string) => {
        const zone = get().zones.find(z => z.id === id);
        if (!zone) return 0;

        // Simple risk calculation based on alerts and occupancy
        const alertWeight = zone.statistics.alertsTriggeredToday * 10;
        const occupancyWeight = (zone.statistics.currentOccupancy / (zone.accessRestrictions.maxOccupancy || 100)) * 20;
        
        return Math.min(100, alertWeight + occupancyWeight);
      },

      // ========================================================================
      // ZONE OVERLAPS AND CONFLICTS
      // ========================================================================

      checkOverlaps: async (zoneId?: string) => {
        set({ overlaps: [] });
      },

      resolveOverlap: async (overlapId: string, resolution: any) => {
        set((state: ZoneStoreState) => ({
          overlaps: state.overlaps.filter(o => o.zone1Id + o.zone2Id !== overlapId)
        }));
        return true;
      },

      // ========================================================================
      // ANALYTICS
      // ========================================================================

      fetchZoneAnalytics: async (zoneId: string, timeRange?: { start: string; end: string }) => {
        const mockAnalytics: ZoneAnalytics = {
          zoneId,
          timeRange: timeRange || {
            start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          },
          metrics: {
            totalVisitors: 1250,
            uniqueVisitors: 980,
            averageDwellTime: 65,
            peakOccupancy: 350,
            alertsTriggered: 15,
            incidentsReported: 2,
            safetyScore: 78
          },
          trends: {
            visitorTrend: [],
            occupancyTrend: [],
            alertTrend: [],
            safetyTrend: []
          },
          heatmapData: []
        };

        set((state: ZoneStoreState) => ({
          analytics: {
            ...state.analytics,
            [zoneId]: mockAnalytics
          }
        }));
      },

      getZoneStatistics: () => {
        const { zones } = get();
        return {
          total: zones.length,
          active: zones.filter(z => z.status === ZoneStatus.ACTIVE).length,
          highRisk: zones.filter(z => 
            z.riskLevel === RiskLevel.HIGH || 
            z.riskLevel === RiskLevel.VERY_HIGH || 
            z.riskLevel === RiskLevel.CRITICAL
          ).length
        };
      },

      // ========================================================================
      // REAL-TIME MONITORING
      // ========================================================================

      addGeofenceAlert: (alert: any) => {
        set((state: ZoneStoreState) => ({
          geofenceAlerts: [...state.geofenceAlerts, alert]
        }));
      },

      clearGeofenceAlerts: () => {
        set({ geofenceAlerts: [] });
      },

      getActiveAlerts: () => {
        const { geofenceAlerts } = get();
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return geofenceAlerts.filter(alert => 
          new Date(alert.timestamp) > oneHourAgo
        );
      },

      // ========================================================================
      // UTILITY ACTIONS
      // ========================================================================

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'zone-store',
    }
  )
);
