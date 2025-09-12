/**
 * Smart Tourist Safety System - Zone Service
 * Comprehensive zone operations, coordinate calculations, overlap detection, and real-time monitoring
 */

import { 
  Zone,
  ZoneType,
  RiskLevel,
  ZoneStatus,
  Coordinates,
  CircularZone,
  PolygonZone,
  BoundingBox,
  ZoneAnalytics,
  ZoneFilter,
  ZoneOverlap,
  OverlapType,
  AccessRestrictions,
  AlertSettings
} from '@/types/zone';

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const EARTH_RADIUS = 6371000; // Earth's radius in meters
const OVERLAP_THRESHOLD = 0.1; // 10% overlap threshold
const RISK_CALCULATION_WEIGHTS = {
  ALERT_FREQUENCY: 0.3,
  OCCUPANCY_RATE: 0.25,
  INCIDENT_HISTORY: 0.2,
  ENVIRONMENTAL_FACTORS: 0.15,
  ACCESS_COMPLEXITY: 0.1
};

// WebSocket connection for real-time updates
let wsConnection: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class ZoneCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  invalidatePattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

const zoneCache = new ZoneCache();

// ============================================================================
// QUEUE MANAGEMENT
// ============================================================================

interface QueueItem {
  id: string;
  type: 'zone_update' | 'geofence_check' | 'risk_calculation' | 'analytics_update';
  data: any;
  priority: number;
  timestamp: number;
  retries: number;
}

class ZoneQueue {
  private queue: QueueItem[] = [];
  private processing = false;
  private maxRetries = 3;

  add(item: Omit<QueueItem, 'id' | 'timestamp' | 'retries'>): void {
    const queueItem: QueueItem = {
      ...item,
      id: `${item.type}_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      retries: 0
    };

    this.queue.push(queueItem);
    this.queue.sort((a, b) => b.priority - a.priority);
    
    if (!this.processing) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const item = this.queue.shift()!;

    try {
      await this.processItem(item);
    } catch (error) {
      console.error(`Queue item processing failed:`, error);
      
      if (item.retries < this.maxRetries) {
        item.retries++;
        this.queue.unshift(item);
      }
    }

    // Continue processing
    setTimeout(() => this.processQueue(), 100);
  }

  private async processItem(item: QueueItem): Promise<void> {
    switch (item.type) {
      case 'zone_update':
        await this.processZoneUpdate(item.data);
        break;
      case 'geofence_check':
        await this.processGeofenceCheck(item.data);
        break;
      case 'risk_calculation':
        await this.processRiskCalculation(item.data);
        break;
      case 'analytics_update':
        await this.processAnalyticsUpdate(item.data);
        break;
    }
  }

  private async processZoneUpdate(data: any): Promise<void> {
    // Update zone data and notify subscribers
    zoneCache.invalidatePattern(new RegExp(`zone_${data.zoneId}`));
    if (wsConnection?.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify({
        type: 'zone_updated',
        data
      }));
    }
  }

  private async processGeofenceCheck(data: any): Promise<void> {
    // Process geofence entry/exit events
    const { touristId, location, zones } = data;
    
    for (const zone of zones) {
      const isInside = await ZoneService.isPointInZone(location, zone);
      const wasInside = data.previousStates?.[zone.id] || false;

      if (isInside && !wasInside) {
        // Entry event
        await ZoneService.handleZoneEntry(touristId, zone, location);
      } else if (!isInside && wasInside) {
        // Exit event
        await ZoneService.handleZoneExit(touristId, zone, location);
      }
    }
  }

  private async processRiskCalculation(data: any): Promise<void> {
    // Calculate and update zone risk levels
    const { zoneId } = data;
    const riskScore = await ZoneService.calculateZoneRisk(zoneId);
    
    // Update zone if risk level changed significantly
    if (Math.abs(riskScore - data.currentRisk) > 10) {
      const newRiskLevel = ZoneService.getRiskLevelFromScore(riskScore);
      await ZoneService.updateZoneRiskLevel(zoneId, newRiskLevel);
    }
  }

  private async processAnalyticsUpdate(data: any): Promise<void> {
    // Update zone analytics
    await ZoneService.updateZoneAnalytics(data.zoneId, data.metrics);
  }
}

const zoneQueue = new ZoneQueue();

// ============================================================================
// COORDINATE & GEOMETRY UTILITIES
// ============================================================================

class GeometryUtils {
  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  static calculateDistance(point1: Coordinates, point2: Coordinates): number {
    const lat1Rad = (point1.latitude * Math.PI) / 180;
    const lat2Rad = (point2.latitude * Math.PI) / 180;
    const deltaLatRad = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const deltaLngRad = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS * c;
  }

  /**
   * Calculate bearing between two coordinates
   */
  static calculateBearing(point1: Coordinates, point2: Coordinates): number {
    const lat1Rad = (point1.latitude * Math.PI) / 180;
    const lat2Rad = (point2.latitude * Math.PI) / 180;
    const deltaLngRad = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const y = Math.sin(deltaLngRad) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLngRad);

    const bearingRad = Math.atan2(y, x);
    return ((bearingRad * 180) / Math.PI + 360) % 360;
  }

  /**
   * Check if point is inside circular zone
   */
  static isPointInCircle(point: Coordinates, circle: CircularZone): boolean {
    const distance = this.calculateDistance(point, circle.center);
    return distance <= circle.radius;
  }

  /**
   * Check if point is inside polygon using ray casting algorithm
   */
  static isPointInPolygon(point: Coordinates, polygon: PolygonZone): boolean {
    const { latitude: x, longitude: y } = point;
    const vertices = polygon.points;
    let inside = false;

    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const xi = vertices[i].latitude;
      const yi = vertices[i].longitude;
      const xj = vertices[j].latitude;
      const yj = vertices[j].longitude;

      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }

    return inside;
  }

  /**
   * Calculate polygon area using shoelace formula
   */
  static calculatePolygonArea(polygon: PolygonZone): number {
    const vertices = polygon.points;
    let area = 0;

    for (let i = 0; i < vertices.length; i++) {
      const j = (i + 1) % vertices.length;
      area += vertices[i].latitude * vertices[j].longitude;
      area -= vertices[j].latitude * vertices[i].longitude;
    }

    return Math.abs(area / 2) * (EARTH_RADIUS * EARTH_RADIUS);
  }

  /**
   * Calculate polygon perimeter
   */
  static calculatePolygonPerimeter(polygon: PolygonZone): number {
    const vertices = polygon.points;
    let perimeter = 0;

    for (let i = 0; i < vertices.length; i++) {
      const j = (i + 1) % vertices.length;
      perimeter += this.calculateDistance(vertices[i], vertices[j]);
    }

    return perimeter;
  }

  /**
   * Get polygon centroid
   */
  static getPolygonCentroid(polygon: PolygonZone): Coordinates {
    const vertices = polygon.points;
    let totalArea = 0;
    let centroidLat = 0;
    let centroidLng = 0;

    for (let i = 0; i < vertices.length; i++) {
      const j = (i + 1) % vertices.length;
      const cross = vertices[i].latitude * vertices[j].longitude - vertices[j].latitude * vertices[i].longitude;
      totalArea += cross;
      centroidLat += (vertices[i].latitude + vertices[j].latitude) * cross;
      centroidLng += (vertices[i].longitude + vertices[j].longitude) * cross;
    }

    totalArea /= 2;
    centroidLat /= (6 * totalArea);
    centroidLng /= (6 * totalArea);

    return { latitude: centroidLat, longitude: centroidLng };
  }

  /**
   * Calculate bounding box for coordinates array
   */
  static calculateBoundingBox(coordinates: Coordinates[]): BoundingBox {
    const latitudes = coordinates.map(c => c.latitude);
    const longitudes = coordinates.map(c => c.longitude);

    return {
      northeast: {
        latitude: Math.max(...latitudes),
        longitude: Math.max(...longitudes)
      },
      southwest: {
        latitude: Math.min(...latitudes),
        longitude: Math.min(...longitudes)
      }
    };
  }

  /**
   * Check if two bounding boxes intersect
   */
  static boundingBoxesIntersect(box1: BoundingBox, box2: BoundingBox): boolean {
    return !(box1.northeast.latitude < box2.southwest.latitude ||
             box1.southwest.latitude > box2.northeast.latitude ||
             box1.northeast.longitude < box2.southwest.longitude ||
             box1.southwest.longitude > box2.northeast.longitude);
  }

  /**
   * Calculate intersection area of two polygons (simplified)
   */
  static calculatePolygonIntersectionArea(poly1: PolygonZone, poly2: PolygonZone): number {
    // This is a simplified implementation
    // For production, consider using a robust geometry library like Turf.js
    
    const box1 = this.calculateBoundingBox(poly1.points);
    const box2 = this.calculateBoundingBox(poly2.points);
    
    if (!this.boundingBoxesIntersect(box1, box2)) {
      return 0;
    }

    // Count polygon vertices inside the other polygon
    let intersectionPoints = 0;
    const totalPoints = poly1.points.length + poly2.points.length;

    for (const point of poly1.points) {
      if (this.isPointInPolygon(point, poly2)) {
        intersectionPoints++;
      }
    }

    for (const point of poly2.points) {
      if (this.isPointInPolygon(point, poly1)) {
        intersectionPoints++;
      }
    }

    // Estimate intersection area based on point overlap ratio
    const overlapRatio = intersectionPoints / totalPoints;
    const area1 = this.calculatePolygonArea(poly1);
    const area2 = this.calculatePolygonArea(poly2);
    
    return Math.min(area1, area2) * overlapRatio;
  }
}

// ============================================================================
// RISK ASSESSMENT ENGINE
// ============================================================================

class RiskAssessment {
  /**
   * Calculate zone risk score based on multiple factors
   */
  static async calculateZoneRisk(zone: Zone, historicalData?: any): Promise<number> {
    const factors = {
      alertFrequency: await this.calculateAlertFrequencyScore(zone),
      occupancyRate: this.calculateOccupancyScore(zone),
      incidentHistory: await this.calculateIncidentScore(zone, historicalData),
      environmentalFactors: await this.calculateEnvironmentalScore(zone),
      accessComplexity: this.calculateAccessComplexityScore(zone)
    };

    let totalScore = 0;
    totalScore += factors.alertFrequency * RISK_CALCULATION_WEIGHTS.ALERT_FREQUENCY;
    totalScore += factors.occupancyRate * RISK_CALCULATION_WEIGHTS.OCCUPANCY_RATE;
    totalScore += factors.incidentHistory * RISK_CALCULATION_WEIGHTS.INCIDENT_HISTORY;
    totalScore += factors.environmentalFactors * RISK_CALCULATION_WEIGHTS.ENVIRONMENTAL_FACTORS;
    totalScore += factors.accessComplexity * RISK_CALCULATION_WEIGHTS.ACCESS_COMPLEXITY;

    return Math.min(100, Math.max(0, totalScore));
  }

  private static async calculateAlertFrequencyScore(zone: Zone): Promise<number> {
    const alertsToday = zone.statistics.alertsTriggeredToday;
    const alertsThisWeek = await this.getWeeklyAlerts(zone.id);
    
    // Normalize based on zone capacity and time
    const capacityFactor = zone.accessRestrictions.maxOccupancy || 100;
    const dailyScore = (alertsToday / capacityFactor) * 100;
    const weeklyScore = (alertsThisWeek / (capacityFactor * 7)) * 100;
    
    return Math.min(100, (dailyScore * 0.7 + weeklyScore * 0.3));
  }

  private static calculateOccupancyScore(zone: Zone): number {
    const maxCapacity = zone.accessRestrictions.maxOccupancy || 100;
    const currentOccupancy = zone.statistics.currentOccupancy;
    const utilizationRate = currentOccupancy / maxCapacity;
    
    // Risk increases exponentially after 80% capacity
    if (utilizationRate <= 0.8) {
      return utilizationRate * 50;
    } else {
      return 40 + ((utilizationRate - 0.8) / 0.2) * 60;
    }
  }

  private static async calculateIncidentScore(zone: Zone, historicalData?: any): Promise<number> {
    // This would typically fetch from a database
    const mockIncidentCount = await this.getHistoricalIncidents(zone.id);
    
    // Normalize based on zone type and time period
    const baselineIncidents = this.getBaselineIncidents(zone.type);
    const incidentRatio = mockIncidentCount / Math.max(1, baselineIncidents);
    
    return Math.min(100, incidentRatio * 30);
  }

  private static async calculateEnvironmentalScore(zone: Zone): Promise<number> {
    // This would integrate with weather APIs and other environmental data
    const weatherConditions = await this.getWeatherConditions(zone);
    const terrainComplexity = this.getTerrainComplexity(zone);
    
    let score = 0;
    
    // Weather factors
    if (weatherConditions.isStorm) score += 40;
    if (weatherConditions.visibility < 100) score += 20;
    if (weatherConditions.temperature < -10 || weatherConditions.temperature > 40) score += 15;
    
    // Terrain factors
    if (terrainComplexity === 'high') score += 25;
    else if (terrainComplexity === 'medium') score += 10;
    
    return Math.min(100, score);
  }

  private static calculateAccessComplexityScore(zone: Zone): number {
    let score = 0;
    
    if (zone.accessRestrictions.requiresPermission) score += 20;
    if (zone.accessRestrictions.requiresGuide) score += 30;
    if (zone.type === ZoneType.RISK_ZONE) score += 25;
    if (zone.type === ZoneType.RESTRICTED_ZONE) score += 35;
    
    return Math.min(100, score);
  }

  // Helper methods (these would connect to actual data sources)
  private static async getWeeklyAlerts(zoneId: string): Promise<number> {
    return Math.floor(Math.random() * 20); // Mock data
  }

  private static async getHistoricalIncidents(zoneId: string): Promise<number> {
    return Math.floor(Math.random() * 5); // Mock data
  }

  private static getBaselineIncidents(zoneType: ZoneType): number {
    const baselines: Record<ZoneType, number> = {
      [ZoneType.SAFE_ZONE]: 0.1,
      [ZoneType.TOURIST_ATTRACTION]: 0.5,
      [ZoneType.RISK_ZONE]: 2.0,
      [ZoneType.RESTRICTED_ZONE]: 1.0,
      [ZoneType.EMERGENCY_ZONE]: 1.5,
      [ZoneType.ACCOMMODATION]: 0.3,
      [ZoneType.TRANSPORT_HUB]: 0.7,
      [ZoneType.MEDICAL_FACILITY]: 0.2,
      [ZoneType.POLICE_STATION]: 0.1,
      [ZoneType.BORDER_CHECKPOINT]: 1.0
    };
    return baselines[zoneType] || 0.5;
  }

  private static async getWeatherConditions(zone: Zone): Promise<any> {
    // Mock weather data - integrate with actual weather API
    return {
      isStorm: Math.random() < 0.1,
      visibility: Math.random() * 1000,
      temperature: Math.random() * 60 - 20
    };
  }

  private static getTerrainComplexity(zone: Zone): 'low' | 'medium' | 'high' {
    // This would analyze terrain data
    return ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any;
  }
}

// ============================================================================
// ZONE SERVICE CLASS
// ============================================================================

export class ZoneService {
  // ========================================================================
  // WEBSOCKET CONNECTION MANAGEMENT
  // ========================================================================

  static initializeWebSocket(url: string = 'ws://localhost:3001/zones'): void {
    if (wsConnection?.readyState === WebSocket.OPEN) {
      return;
    }

    wsConnection = new WebSocket(url);

    wsConnection.onopen = () => {
      console.log('Zone WebSocket connected');
      reconnectAttempts = 0;
    };

    wsConnection.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleWebSocketMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    wsConnection.onclose = () => {
      console.log('Zone WebSocket disconnected');
      this.handleWebSocketReconnection();
    };

    wsConnection.onerror = (error) => {
      console.error('Zone WebSocket error:', error);
    };
  }

  private static handleWebSocketMessage(message: any): void {
    switch (message.type) {
      case 'zone_updated':
        zoneCache.invalidatePattern(new RegExp(`zone_${message.data.zoneId}`));
        break;
      case 'geofence_alert':
        this.handleGeofenceAlert(message.data);
        break;
      case 'risk_level_changed':
        this.handleRiskLevelChange(message.data);
        break;
    }
  }

  private static handleWebSocketReconnection(): void {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      const delay = Math.pow(2, reconnectAttempts) * 1000;
      
      setTimeout(() => {
        this.initializeWebSocket();
      }, delay);
    }
  }

  // ========================================================================
  // ZONE CRUD OPERATIONS
  // ========================================================================

  /**
   * Fetch zones with filtering and caching
   */
  static async fetchZones(filters?: ZoneFilter): Promise<Zone[]> {
    const cacheKey = `zones_${JSON.stringify(filters || {})}`;
    let zones = zoneCache.get<Zone[]>(cacheKey);

    if (!zones) {
      try {
        // Mock API call - replace with actual implementation
        zones = await this.fetchZonesFromAPI(filters);
        zoneCache.set(cacheKey, zones, 2 * 60 * 1000); // 2 minute cache
      } catch (error) {
        console.error('Failed to fetch zones:', error);
        throw error;
      }
    }

    return zones;
  }

  /**
   * Create a new zone with validation
   */
  static async createZone(zoneData: Partial<Zone>): Promise<Zone> {
    // Validate geometry
    if (zoneData.geometry) {
      await this.validateZoneGeometry(zoneData.geometry);
    }

    // Check for overlaps
    const overlaps = await this.checkZoneOverlaps(zoneData as Zone);
    if (overlaps.length > 0) {
      console.warn('Zone creation will create overlaps:', overlaps);
    }

    try {
      const newZone = await this.createZoneInAPI(zoneData);
      
      // Queue analytics update
      zoneQueue.add({
        type: 'analytics_update',
        data: { zoneId: newZone.id, action: 'created' },
        priority: 3
      });

      // Clear relevant caches
      zoneCache.invalidatePattern(/^zones_/);

      return newZone;
    } catch (error) {
      console.error('Failed to create zone:', error);
      throw error;
    }
  }

  /**
   * Update zone with change tracking
   */
  static async updateZone(zoneId: string, updates: Partial<Zone>): Promise<Zone> {
    const currentZone = await this.getZoneById(zoneId);
    if (!currentZone) {
      throw new Error(`Zone ${zoneId} not found`);
    }

    // Validate geometry changes
    if (updates.geometry) {
      await this.validateZoneGeometry(updates.geometry);
    }

    try {
      const updatedZone = await this.updateZoneInAPI(zoneId, updates);
      
      // Queue background updates
      zoneQueue.add({
        type: 'zone_update',
        data: { zoneId, changes: updates },
        priority: 4
      });

      // Clear caches
      zoneCache.delete(`zone_${zoneId}`);
      zoneCache.invalidatePattern(/^zones_/);

      return updatedZone;
    } catch (error) {
      console.error('Failed to update zone:', error);
      throw error;
    }
  }

  /**
   * Delete zone with cleanup
   */
  static async deleteZone(zoneId: string): Promise<boolean> {
    try {
      await this.deleteZoneFromAPI(zoneId);
      
      // Cleanup caches
      zoneCache.delete(`zone_${zoneId}`);
      zoneCache.invalidatePattern(/^zones_/);
      zoneCache.invalidatePattern(new RegExp(`analytics_${zoneId}`));

      return true;
    } catch (error) {
      console.error('Failed to delete zone:', error);
      throw error;
    }
  }

  /**
   * Get zone by ID with caching
   */
  static async getZoneById(zoneId: string): Promise<Zone | null> {
    const cacheKey = `zone_${zoneId}`;
    let zone = zoneCache.get<Zone>(cacheKey);

    if (!zone) {
      try {
        zone = await this.fetchZoneFromAPI(zoneId);
        if (zone) {
          zoneCache.set(cacheKey, zone);
        }
      } catch (error) {
        console.error('Failed to fetch zone:', error);
        return null;
      }
    }

    return zone;
  }

  // ========================================================================
  // GEOMETRY OPERATIONS
  // ========================================================================

  /**
   * Check if a point is inside a zone
   */
  static async isPointInZone(point: Coordinates, zone: Zone): Promise<boolean> {
    const geometry = zone.geometry;

    if ('center' in geometry && 'radius' in geometry) {
      return GeometryUtils.isPointInCircle(point, geometry);
    } else if ('points' in geometry) {
      return GeometryUtils.isPointInPolygon(point, geometry);
    }

    return false;
  }

  /**
   * Find zones containing a point
   */
  static async findZonesContainingPoint(point: Coordinates, filters?: ZoneFilter): Promise<Zone[]> {
    const zones = await this.fetchZones(filters);
    const containingZones: Zone[] = [];

    for (const zone of zones) {
      if (await this.isPointInZone(point, zone)) {
        containingZones.push(zone);
      }
    }

    return containingZones;
  }

  /**
   * Calculate zone area
   */
  static calculateZoneArea(zone: Zone): number {
    const geometry = zone.geometry;

    if ('center' in geometry && 'radius' in geometry) {
      return Math.PI * Math.pow(geometry.radius, 2);
    } else if ('points' in geometry) {
      return GeometryUtils.calculatePolygonArea(geometry);
    }

    return 0;
  }

  /**
   * Calculate zone perimeter
   */
  static calculateZonePerimeter(zone: Zone): number {
    const geometry = zone.geometry;

    if ('center' in geometry && 'radius' in geometry) {
      return 2 * Math.PI * geometry.radius;
    } else if ('points' in geometry) {
      return GeometryUtils.calculatePolygonPerimeter(geometry);
    }

    return 0;
  }

  // ========================================================================
  // OVERLAP DETECTION
  // ========================================================================

  /**
   * Check for zone overlaps
   */
  static async checkZoneOverlaps(targetZone: Zone): Promise<ZoneOverlap[]> {
    const allZones = await this.fetchZones();
    const overlaps: ZoneOverlap[] = [];

    for (const zone of allZones) {
      if (zone.id === targetZone.id) continue;

      const overlapArea = await this.calculateOverlapArea(targetZone, zone);
      if (overlapArea > 0) {
        const overlapPercentage = this.calculateOverlapPercentage(overlapArea, targetZone, zone);
        
        if (overlapPercentage > OVERLAP_THRESHOLD) {
          overlaps.push({
            zone1Id: targetZone.id,
            zone2Id: zone.id,
            overlapType: this.determineOverlapType(overlapPercentage),
            overlapArea,
            conflictSeverity: this.mapOverlapSeverity(overlapPercentage)
          });
        }
      }
    }

    return overlaps;
  }

  /**
   * Calculate overlap area between two zones
   */
  static async calculateOverlapArea(zone1: Zone, zone2: Zone): Promise<number> {
    // First check bounding box intersection for quick filtering
    if (!GeometryUtils.boundingBoxesIntersect(zone1.boundingBox, zone2.boundingBox)) {
      return 0;
    }

    const geom1 = zone1.geometry;
    const geom2 = zone2.geometry;

    // Circle-Circle intersection
    if ('center' in geom1 && 'radius' in geom1 && 'center' in geom2 && 'radius' in geom2) {
      return this.calculateCircleCircleIntersection(geom1, geom2);
    }

    // Circle-Polygon intersection
    if ('center' in geom1 && 'radius' in geom1 && 'points' in geom2) {
      return this.calculateCirclePolygonIntersection(geom1, geom2);
    }
    if ('points' in geom1 && 'center' in geom2 && 'radius' in geom2) {
      return this.calculateCirclePolygonIntersection(geom2, geom1);
    }

    // Polygon-Polygon intersection
    if ('points' in geom1 && 'points' in geom2) {
      return GeometryUtils.calculatePolygonIntersectionArea(geom1, geom2);
    }

    return 0;
  }

  private static calculateCircleCircleIntersection(circle1: CircularZone, circle2: CircularZone): number {
    const distance = GeometryUtils.calculateDistance(circle1.center, circle2.center);
    const r1 = circle1.radius;
    const r2 = circle2.radius;

    // No intersection
    if (distance >= r1 + r2) return 0;

    // One circle completely inside the other
    if (distance <= Math.abs(r1 - r2)) {
      const smallerRadius = Math.min(r1, r2);
      return Math.PI * smallerRadius * smallerRadius;
    }

    // Partial intersection using lens formula
    const a = r1 * r1;
    const b = r2 * r2;
    const d = distance;

    const area1 = a * Math.acos((d * d + a - b) / (2 * d * Math.sqrt(a)));
    const area2 = b * Math.acos((d * d + b - a) / (2 * d * Math.sqrt(b)));
    const area3 = 0.5 * Math.sqrt((-d + r1 + r2) * (d + r1 - r2) * (d - r1 + r2) * (d + r1 + r2));

    return area1 + area2 - area3;
  }

  private static calculateCirclePolygonIntersection(circle: CircularZone, polygon: PolygonZone): number {
    // Simplified calculation - count polygon vertices inside circle
    let insideCount = 0;
    for (const point of polygon.points) {
      if (GeometryUtils.isPointInCircle(point, circle)) {
        insideCount++;
      }
    }

    const polygonArea = GeometryUtils.calculatePolygonArea(polygon);
    const circleArea = Math.PI * circle.radius * circle.radius;
    const overlapRatio = insideCount / polygon.points.length;

    return Math.min(polygonArea, circleArea) * overlapRatio;
  }

  private static calculateOverlapPercentage(overlapArea: number, zone1: Zone, zone2: Zone): number {
    const area1 = this.calculateZoneArea(zone1);
    const area2 = this.calculateZoneArea(zone2);
    const smallerArea = Math.min(area1, area2);
    
    return smallerArea > 0 ? (overlapArea / smallerArea) * 100 : 0;
  }

  private static getOverlapSeverity(percentage: number): 'none' | 'low' | 'medium' | 'high' {
    if (percentage > 75) return 'high';
    if (percentage > 50) return 'high';
    if (percentage > 25) return 'medium';
    return 'low';
  }

  private static determineOverlapType(percentage: number): OverlapType {
    if (percentage > 90) return OverlapType.CONTAINED;
    if (percentage > 5) return OverlapType.PARTIAL;
    return OverlapType.ADJACENT;
  }

  private static mapOverlapSeverity(percentage: number): 'none' | 'low' | 'medium' | 'high' {
    return this.getOverlapSeverity(percentage);
  }

  private static getConflictType(zone1: Zone, zone2: Zone): string {
    if (zone1.type === zone2.type) return 'duplicate';
    if ((zone1.type === ZoneType.SAFE_ZONE && zone2.type === ZoneType.RISK_ZONE) ||
        (zone1.type === ZoneType.RISK_ZONE && zone2.type === ZoneType.SAFE_ZONE)) {
      return 'conflicting_risk';
    }
    return 'overlapping';
  }

  // ========================================================================
  // RISK MANAGEMENT
  // ========================================================================

  /**
   * Calculate zone risk score
   */
  static async calculateZoneRisk(zoneId: string): Promise<number> {
    const zone = await this.getZoneById(zoneId);
    if (!zone) return 0;

    return RiskAssessment.calculateZoneRisk(zone);
  }

  /**
   * Update zone risk level
   */
  static async updateZoneRiskLevel(zoneId: string, riskLevel: RiskLevel): Promise<void> {
    await this.updateZone(zoneId, { riskLevel });
    
    // Notify subscribers of risk level change
    if (wsConnection?.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify({
        type: 'risk_level_changed',
        data: { zoneId, riskLevel }
      }));
    }
  }

  /**
   * Get risk level from numerical score
   */
  static getRiskLevelFromScore(score: number): RiskLevel {
    if (score >= 90) return RiskLevel.CRITICAL;
    if (score >= 75) return RiskLevel.VERY_HIGH;
    if (score >= 60) return RiskLevel.HIGH;
    if (score >= 40) return RiskLevel.MODERATE;
    if (score >= 20) return RiskLevel.LOW;
    return RiskLevel.VERY_LOW;
  }

  // ========================================================================
  // GEOFENCE EVENTS
  // ========================================================================

  /**
   * Handle zone entry event
   */
  static async handleZoneEntry(touristId: string, zone: Zone, location: Coordinates): Promise<void> {
    const event = {
      type: 'entry',
      touristId,
      zoneId: zone.id,
      zoneName: zone.name,
      location,
      timestamp: new Date().toISOString(),
      riskLevel: zone.riskLevel
    };

    // Check alert settings
    if (zone.alertSettings.enableEntryAlerts) {
      await this.triggerZoneAlert(event);
    }

    // Update zone statistics
    await this.updateZoneOccupancy(zone.id, 1);

    // Log event
    console.log(`Tourist ${touristId} entered zone ${zone.name}`);
  }

  /**
   * Handle zone exit event
   */
  static async handleZoneExit(touristId: string, zone: Zone, location: Coordinates): Promise<void> {
    const event = {
      type: 'exit',
      touristId,
      zoneId: zone.id,
      zoneName: zone.name,
      location,
      timestamp: new Date().toISOString(),
      riskLevel: zone.riskLevel
    };

    // Check alert settings
    if (zone.alertSettings.enableExitAlerts) {
      await this.triggerZoneAlert(event);
    }

    // Update zone statistics
    await this.updateZoneOccupancy(zone.id, -1);

    // Log event
    console.log(`Tourist ${touristId} exited zone ${zone.name}`);
  }

  /**
   * Trigger zone alert
   */
  private static async triggerZoneAlert(event: any): Promise<void> {
    // This would integrate with the alert service
    if (wsConnection?.readyState === WebSocket.OPEN) {
      wsConnection.send(JSON.stringify({
        type: 'geofence_alert',
        data: event
      }));
    }
  }

  /**
   * Update zone occupancy
   */
  private static async updateZoneOccupancy(zoneId: string, change: number): Promise<void> {
    const zone = await this.getZoneById(zoneId);
    if (!zone) return;

    const newOccupancy = Math.max(0, zone.statistics.currentOccupancy + change);
    await this.updateZone(zoneId, {
      statistics: {
        ...zone.statistics,
        currentOccupancy: newOccupancy
      }
    });
  }

  // ========================================================================
  // ANALYTICS
  // ========================================================================

  /**
   * Update zone analytics
   */
  static async updateZoneAnalytics(zoneId: string, metrics: any): Promise<void> {
    const cacheKey = `analytics_${zoneId}`;
    zoneCache.set(cacheKey, metrics, 10 * 60 * 1000); // 10 minute cache
  }

  /**
   * Get zone analytics
   */
  static async getZoneAnalytics(zoneId: string, timeRange?: { start: string; end: string }): Promise<ZoneAnalytics | null> {
    const cacheKey = `analytics_${zoneId}_${JSON.stringify(timeRange)}`;
    let analytics = zoneCache.get<ZoneAnalytics>(cacheKey);

    if (!analytics) {
      try {
        analytics = await this.fetchAnalyticsFromAPI(zoneId, timeRange);
        if (analytics) {
          zoneCache.set(cacheKey, analytics, 5 * 60 * 1000); // 5 minute cache
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        return null;
      }
    }

    return analytics;
  }

  // ========================================================================
  // VALIDATION
  // ========================================================================

  /**
   * Validate zone geometry
   */
  private static async validateZoneGeometry(geometry: any): Promise<void> {
    if ('center' in geometry && 'radius' in geometry) {
      if (geometry.radius <= 0) {
        throw new Error('Circle radius must be positive');
      }
      if (geometry.radius > 50000) { // 50km max
        throw new Error('Circle radius too large');
      }
    } else if ('points' in geometry) {
      if (geometry.points.length < 3) {
        throw new Error('Polygon must have at least 3 points');
      }
      if (geometry.points.length > 1000) {
        throw new Error('Polygon has too many points');
      }
    } else {
      throw new Error('Invalid geometry type');
    }
  }

  // ========================================================================
  // API INTEGRATION (Mock implementations)
  // ========================================================================

  private static async fetchZonesFromAPI(filters?: ZoneFilter): Promise<Zone[]> {
    // Mock implementation - replace with actual API calls
    await new Promise(resolve => setTimeout(resolve, 100));
    return [];
  }

  private static async createZoneInAPI(zoneData: Partial<Zone>): Promise<Zone> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 200));
    return { ...zoneData, id: `zone_${Date.now()}` } as Zone;
  }

  private static async updateZoneInAPI(zoneId: string, updates: Partial<Zone>): Promise<Zone> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 150));
    return { ...updates, id: zoneId } as Zone;
  }

  private static async deleteZoneFromAPI(zoneId: string): Promise<void> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private static async fetchZoneFromAPI(zoneId: string): Promise<Zone | null> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 100));
    return null;
  }

  private static async fetchAnalyticsFromAPI(zoneId: string, timeRange?: { start: string; end: string }): Promise<ZoneAnalytics | null> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 150));
    return null;
  }

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================

  private static handleGeofenceAlert(data: any): void {
    console.log('Geofence alert received:', data);
    // Integrate with UI notifications
  }

  private static handleRiskLevelChange(data: any): void {
    console.log('Risk level changed:', data);
    // Update UI indicators
  }

  // ========================================================================
  // CLEANUP
  // ========================================================================

  /**
   * Cleanup resources
   */
  static cleanup(): void {
    if (wsConnection) {
      wsConnection.close();
      wsConnection = null;
    }
    zoneCache.clear();
  }
}

// Initialize WebSocket connection
if (typeof window !== 'undefined') {
  ZoneService.initializeWebSocket();
}

export default ZoneService;
