/**
 * Smart Tourist Safety System - Geospatial Calculations Library
 * Advanced geospatial utilities for distance calculations, route optimization, geofencing, and spatial analysis
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface Circle {
  center: Coordinates;
  radius: number; // in meters
}

export interface Polygon {
  coordinates: Coordinates[];
}

export interface GeofenceZone {
  id: string;
  name: string;
  type: 'circle' | 'polygon';
  geometry: Circle | Polygon;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  alertOnEntry?: boolean;
  alertOnExit?: boolean;
  dwellTimeLimit?: number; // in seconds
}

export interface RouteSegment {
  start: Coordinates;
  end: Coordinates;
  distance: number;
  bearing: number;
  waypoints?: Coordinates[];
}

export interface SpatialIndex {
  bounds: Bounds;
  points: Array<{
    id: string;
    coordinates: Coordinates;
    data?: any;
  }>;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const EARTH_RADIUS_KM = 6371;
export const EARTH_RADIUS_M = 6371000;
export const DEGREES_TO_RADIANS = Math.PI / 180;
export const RADIANS_TO_DEGREES = 180 / Math.PI;

// Coordinate system constants
export const WGS84_SEMI_MAJOR_AXIS = 6378137; // meters
export const WGS84_FLATTENING = 1 / 298.257223563;

// ============================================================================
// BASIC DISTANCE CALCULATIONS
// ============================================================================

/**
 * Calculate the great circle distance between two points using the Haversine formula
 * @param point1 - First coordinate point
 * @param point2 - Second coordinate point
 * @param unit - Return unit: 'km', 'm', 'mi', 'ft'
 * @returns Distance in specified unit
 */
export function haversineDistance(
  point1: Coordinates,
  point2: Coordinates,
  unit: 'km' | 'm' | 'mi' | 'ft' = 'm'
): number {
  const φ1 = point1.lat * DEGREES_TO_RADIANS;
  const φ2 = point2.lat * DEGREES_TO_RADIANS;
  const Δφ = (point2.lat - point1.lat) * DEGREES_TO_RADIANS;
  const Δλ = (point2.lng - point1.lng) * DEGREES_TO_RADIANS;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceKm = EARTH_RADIUS_KM * c;

  switch (unit) {
    case 'km': return distanceKm;
    case 'm': return distanceKm * 1000;
    case 'mi': return distanceKm * 0.621371;
    case 'ft': return distanceKm * 3280.84;
    default: return distanceKm * 1000;
  }
}

/**
 * Calculate distance using Vincenty's formula (more accurate for long distances)
 * @param point1 - First coordinate point
 * @param point2 - Second coordinate point
 * @returns Distance in meters
 */
export function vincentyDistance(point1: Coordinates, point2: Coordinates): number {
  const a = WGS84_SEMI_MAJOR_AXIS;
  const b = a * (1 - WGS84_FLATTENING);
  const f = WGS84_FLATTENING;

  const φ1 = point1.lat * DEGREES_TO_RADIANS;
  const φ2 = point2.lat * DEGREES_TO_RADIANS;
  const ΔL = (point2.lng - point1.lng) * DEGREES_TO_RADIANS;

  const U1 = Math.atan((1 - f) * Math.tan(φ1));
  const U2 = Math.atan((1 - f) * Math.tan(φ2));
  const sinU1 = Math.sin(U1);
  const cosU1 = Math.cos(U1);
  const sinU2 = Math.sin(U2);
  const cosU2 = Math.cos(U2);

  let λ = ΔL;
  let iterLimit = 100;
  let cosSqα, sinσ, cos2σM, cosσ, σ, λp;

  do {
    const sinλ = Math.sin(λ);
    const cosλ = Math.cos(λ);
    sinσ = Math.sqrt((cosU2 * sinλ) * (cosU2 * sinλ) + 
                     (cosU1 * sinU2 - sinU1 * cosU2 * cosλ) * (cosU1 * sinU2 - sinU1 * cosU2 * cosλ));
    
    if (sinσ === 0) return 0; // coincident points
    
    cosσ = sinU1 * sinU2 + cosU1 * cosU2 * cosλ;
    σ = Math.atan2(sinσ, cosσ);
    const sinα = cosU1 * cosU2 * sinλ / sinσ;
    cosSqα = 1 - sinα * sinα;
    cos2σM = cosσ - 2 * sinU1 * sinU2 / cosSqα;
    
    if (isNaN(cos2σM)) cos2σM = 0; // equatorial line
    
    const C = f / 16 * cosSqα * (4 + f * (4 - 3 * cosSqα));
    λp = λ;
    λ = ΔL + (1 - C) * f * sinα * (σ + C * sinσ * (cos2σM + C * cosσ * (-1 + 2 * cos2σM * cos2σM)));
  } while (Math.abs(λ - λp) > 1e-12 && --iterLimit > 0);

  if (iterLimit === 0) {
    throw new Error('Vincenty formula failed to converge');
  }

  const uSq = cosSqα * (a * a - b * b) / (b * b);
  const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
  const Δσ = B * sinσ * (cos2σM + B / 4 * (cosσ * (-1 + 2 * cos2σM * cos2σM) -
                                           B / 6 * cos2σM * (-3 + 4 * sinσ * sinσ) * (-3 + 4 * cos2σM * cos2σM)));

  return b * A * (σ - Δσ);
}

/**
 * Calculate the initial bearing from point1 to point2
 * @param point1 - Starting point
 * @param point2 - End point
 * @returns Bearing in degrees (0-360)
 */
export function calculateBearing(point1: Coordinates, point2: Coordinates): number {
  const φ1 = point1.lat * DEGREES_TO_RADIANS;
  const φ2 = point2.lat * DEGREES_TO_RADIANS;
  const Δλ = (point2.lng - point1.lng) * DEGREES_TO_RADIANS;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const bearing = Math.atan2(y, x) * RADIANS_TO_DEGREES;
  return (bearing + 360) % 360;
}

/**
 * Calculate the final bearing when arriving at point2 from point1
 * @param point1 - Starting point
 * @param point2 - End point
 * @returns Final bearing in degrees (0-360)
 */
export function calculateFinalBearing(point1: Coordinates, point2: Coordinates): number {
  return (calculateBearing(point2, point1) + 180) % 360;
}

// ============================================================================
// DESTINATION AND INTERPOLATION CALCULATIONS
// ============================================================================

/**
 * Calculate a destination point given distance and bearing from a start point
 * @param start - Starting coordinates
 * @param distance - Distance in meters
 * @param bearing - Bearing in degrees
 * @returns Destination coordinates
 */
export function calculateDestination(start: Coordinates, distance: number, bearing: number): Coordinates {
  const φ1 = start.lat * DEGREES_TO_RADIANS;
  const λ1 = start.lng * DEGREES_TO_RADIANS;
  const bearingRad = bearing * DEGREES_TO_RADIANS;
  const angular = distance / EARTH_RADIUS_M;

  const φ2 = Math.asin(Math.sin(φ1) * Math.cos(angular) + 
                       Math.cos(φ1) * Math.sin(angular) * Math.cos(bearingRad));
  
  const λ2 = λ1 + Math.atan2(Math.sin(bearingRad) * Math.sin(angular) * Math.cos(φ1),
                             Math.cos(angular) - Math.sin(φ1) * Math.sin(φ2));

  return {
    lat: φ2 * RADIANS_TO_DEGREES,
    lng: ((λ2 * RADIANS_TO_DEGREES + 540) % 360) - 180 // normalize to ±180°
  };
}

/**
 * Interpolate points along a great circle path
 * @param start - Starting coordinates
 * @param end - Ending coordinates
 * @param numPoints - Number of interpolation points (excluding start and end)
 * @returns Array of interpolated coordinates
 */
export function interpolateGreatCircle(start: Coordinates, end: Coordinates, numPoints: number): Coordinates[] {
  const points: Coordinates[] = [start];
  
  const distance = haversineDistance(start, end);
  const bearing = calculateBearing(start, end);
  
  for (let i = 1; i <= numPoints; i++) {
    const fraction = i / (numPoints + 1);
    const segmentDistance = distance * fraction;
    const point = calculateDestination(start, segmentDistance, bearing);
    points.push(point);
  }
  
  points.push(end);
  return points;
}

/**
 * Calculate the midpoint between two coordinates
 * @param point1 - First coordinate
 * @param point2 - Second coordinate
 * @returns Midpoint coordinates
 */
export function calculateMidpoint(point1: Coordinates, point2: Coordinates): Coordinates {
  const φ1 = point1.lat * DEGREES_TO_RADIANS;
  const φ2 = point2.lat * DEGREES_TO_RADIANS;
  const Δλ = (point2.lng - point1.lng) * DEGREES_TO_RADIANS;
  const λ1 = point1.lng * DEGREES_TO_RADIANS;

  const Bx = Math.cos(φ2) * Math.cos(Δλ);
  const By = Math.cos(φ2) * Math.sin(Δλ);
  const φ3 = Math.atan2(Math.sin(φ1) + Math.sin(φ2),
                        Math.sqrt((Math.cos(φ1) + Bx) * (Math.cos(φ1) + Bx) + By * By));
  const λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);

  return {
    lat: φ3 * RADIANS_TO_DEGREES,
    lng: ((λ3 * RADIANS_TO_DEGREES + 540) % 360) - 180
  };
}

// ============================================================================
// GEOFENCING AND CONTAINMENT
// ============================================================================

/**
 * Check if a point is inside a circular geofence
 * @param point - Point to check
 * @param circle - Circular geofence
 * @returns True if point is inside the circle
 */
export function isPointInCircle(point: Coordinates, circle: Circle): boolean {
  const distance = haversineDistance(point, circle.center);
  return distance <= circle.radius;
}

/**
 * Check if a point is inside a polygon using the ray casting algorithm
 * @param point - Point to check
 * @param polygon - Polygon vertices
 * @returns True if point is inside the polygon
 */
export function isPointInPolygon(point: Coordinates, polygon: Coordinates[]): boolean {
  const x = point.lng;
  const y = point.lat;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Check if a point is inside any geofence zone
 * @param point - Point to check
 * @param zones - Array of geofence zones
 * @returns Array of zones containing the point
 */
export function getContainingZones(point: Coordinates, zones: GeofenceZone[]): GeofenceZone[] {
  return zones.filter(zone => {
    if (zone.type === 'circle') {
      return isPointInCircle(point, zone.geometry as Circle);
    } else if (zone.type === 'polygon') {
      return isPointInPolygon(point, (zone.geometry as Polygon).coordinates);
    }
    return false;
  });
}

/**
 * Calculate the minimum distance from a point to a polygon edge
 * @param point - Point to check
 * @param polygon - Polygon vertices
 * @returns Minimum distance in meters
 */
export function distanceToPolygon(point: Coordinates, polygon: Coordinates[]): number {
  let minDistance = Infinity;

  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    const distance = distanceToLineSegment(point, polygon[i], polygon[j]);
    minDistance = Math.min(minDistance, distance);
  }

  return minDistance;
}

/**
 * Calculate the distance from a point to a line segment
 * @param point - Point to check
 * @param lineStart - Start of line segment
 * @param lineEnd - End of line segment
 * @returns Distance in meters
 */
export function distanceToLineSegment(point: Coordinates, lineStart: Coordinates, lineEnd: Coordinates): number {
  const A = point.lng - lineStart.lng;
  const B = point.lat - lineStart.lat;
  const C = lineEnd.lng - lineStart.lng;
  const D = lineEnd.lat - lineStart.lat;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  if (lenSq === 0) {
    // Line segment is actually a point
    return haversineDistance(point, lineStart);
  }

  let param = dot / lenSq;

  let xx: number, yy: number;

  if (param < 0) {
    xx = lineStart.lng;
    yy = lineStart.lat;
  } else if (param > 1) {
    xx = lineEnd.lng;
    yy = lineEnd.lat;
  } else {
    xx = lineStart.lng + param * C;
    yy = lineStart.lat + param * D;
  }

  return haversineDistance(point, { lat: yy, lng: xx });
}

// ============================================================================
// BOUNDS AND AREA CALCULATIONS
// ============================================================================

/**
 * Calculate bounding box for an array of coordinates
 * @param coordinates - Array of coordinates
 * @returns Bounding box
 */
export function calculateBounds(coordinates: Coordinates[]): Bounds {
  if (coordinates.length === 0) {
    throw new Error('Cannot calculate bounds for empty coordinates array');
  }

  let north = coordinates[0].lat;
  let south = coordinates[0].lat;
  let east = coordinates[0].lng;
  let west = coordinates[0].lng;

  coordinates.forEach(coord => {
    north = Math.max(north, coord.lat);
    south = Math.min(south, coord.lat);
    east = Math.max(east, coord.lng);
    west = Math.min(west, coord.lng);
  });

  return { north, south, east, west };
}

/**
 * Calculate the area of a polygon in square meters
 * @param polygon - Polygon vertices
 * @returns Area in square meters
 */
export function calculatePolygonArea(polygon: Coordinates[]): number {
  if (polygon.length < 3) return 0;

  let area = 0;
  const radiusSquared = EARTH_RADIUS_M * EARTH_RADIUS_M;

  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    const lat1 = polygon[i].lat * DEGREES_TO_RADIANS;
    const lat2 = polygon[j].lat * DEGREES_TO_RADIANS;
    const lng1 = polygon[i].lng * DEGREES_TO_RADIANS;
    const lng2 = polygon[j].lng * DEGREES_TO_RADIANS;

    area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  area = Math.abs(area * radiusSquared / 2);
  return area;
}

/**
 * Calculate the centroid of a polygon
 * @param polygon - Polygon vertices
 * @returns Centroid coordinates
 */
export function calculatePolygonCentroid(polygon: Coordinates[]): Coordinates {
  if (polygon.length === 0) {
    throw new Error('Cannot calculate centroid for empty polygon');
  }

  let lat = 0;
  let lng = 0;

  polygon.forEach(coord => {
    lat += coord.lat;
    lng += coord.lng;
  });

  return {
    lat: lat / polygon.length,
    lng: lng / polygon.length
  };
}

// ============================================================================
// ROUTE OPTIMIZATION AND ANALYSIS
// ============================================================================

/**
 * Calculate the total distance of a route through multiple waypoints
 * @param waypoints - Array of coordinates representing the route
 * @returns Total distance in meters
 */
export function calculateRouteDistance(waypoints: Coordinates[]): number {
  if (waypoints.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalDistance += haversineDistance(waypoints[i], waypoints[i + 1]);
  }

  return totalDistance;
}

/**
 * Optimize a route using a simple nearest neighbor heuristic for TSP
 * @param waypoints - Array of waypoints to visit
 * @param startIndex - Index of starting waypoint (default: 0)
 * @returns Optimized route order
 */
export function optimizeRoute(waypoints: Coordinates[], startIndex: number = 0): number[] {
  if (waypoints.length <= 2) return waypoints.map((_, i) => i);

  const unvisited = new Set(waypoints.map((_, i) => i));
  const route = [startIndex];
  unvisited.delete(startIndex);

  let currentIndex = startIndex;

  while (unvisited.size > 0) {
    let nearestIndex = -1;
    let nearestDistance = Infinity;

    unvisited.forEach(index => {
      const distance = haversineDistance(waypoints[currentIndex], waypoints[index]);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    route.push(nearestIndex);
    unvisited.delete(nearestIndex);
    currentIndex = nearestIndex;
  }

  return route;
}

/**
 * Find the closest point to a target from an array of candidates
 * @param target - Target coordinates
 * @param candidates - Array of candidate coordinates
 * @returns Index of closest point and distance
 */
export function findClosestPoint(target: Coordinates, candidates: Coordinates[]): { index: number; distance: number } {
  if (candidates.length === 0) {
    throw new Error('No candidates provided');
  }

  let closestIndex = 0;
  let closestDistance = haversineDistance(target, candidates[0]);

  for (let i = 1; i < candidates.length; i++) {
    const distance = haversineDistance(target, candidates[i]);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }

  return { index: closestIndex, distance: closestDistance };
}

/**
 * Find all points within a specified radius
 * @param center - Center coordinates
 * @param radius - Search radius in meters
 * @param candidates - Array of candidate coordinates
 * @returns Array of indices and distances for points within radius
 */
export function findPointsWithinRadius(
  center: Coordinates,
  radius: number,
  candidates: Coordinates[]
): Array<{ index: number; distance: number; point: Coordinates }> {
  const results: Array<{ index: number; distance: number; point: Coordinates }> = [];

  candidates.forEach((point, index) => {
    const distance = haversineDistance(center, point);
    if (distance <= radius) {
      results.push({ index, distance, point });
    }
  });

  return results.sort((a, b) => a.distance - b.distance);
}

// ============================================================================
// SPATIAL INDEXING
// ============================================================================

/**
 * Create a simple spatial index for efficient point queries
 * @param points - Array of points with ids and coordinates
 * @param cellSize - Size of grid cells in degrees (default: 0.01)
 * @returns Spatial index object
 */
export function createSpatialIndex(
  points: Array<{ id: string; coordinates: Coordinates; data?: any }>,
  cellSize: number = 0.01
): Map<string, Array<{ id: string; coordinates: Coordinates; data?: any }>> {
  const index = new Map<string, Array<{ id: string; coordinates: Coordinates; data?: any }>>();

  points.forEach(point => {
    const cellX = Math.floor(point.coordinates.lng / cellSize);
    const cellY = Math.floor(point.coordinates.lat / cellSize);
    const cellKey = `${cellX},${cellY}`;

    if (!index.has(cellKey)) {
      index.set(cellKey, []);
    }
    index.get(cellKey)!.push(point);
  });

  return index;
}

/**
 * Query points from spatial index within a radius
 * @param index - Spatial index
 * @param center - Center coordinates
 * @param radius - Search radius in meters
 * @param cellSize - Cell size used in index creation
 * @returns Array of points within radius
 */
export function queryPointsInRadius(
  index: Map<string, Array<{ id: string; coordinates: Coordinates; data?: any }>>,
  center: Coordinates,
  radius: number,
  cellSize: number = 0.01
): Array<{ id: string; coordinates: Coordinates; data?: any; distance: number }> {
  const results: Array<{ id: string; coordinates: Coordinates; data?: any; distance: number }> = [];
  
  // Calculate grid bounds to search
  const radiusInDegrees = radius / (EARTH_RADIUS_M * DEGREES_TO_RADIANS);
  const minX = Math.floor((center.lng - radiusInDegrees) / cellSize);
  const maxX = Math.floor((center.lng + radiusInDegrees) / cellSize);
  const minY = Math.floor((center.lat - radiusInDegrees) / cellSize);
  const maxY = Math.floor((center.lat + radiusInDegrees) / cellSize);

  // Search cells in the bounding area
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const cellKey = `${x},${y}`;
      const cellPoints = index.get(cellKey);
      
      if (cellPoints) {
        cellPoints.forEach(point => {
          const distance = haversineDistance(center, point.coordinates);
          if (distance <= radius) {
            results.push({ ...point, distance });
          }
        });
      }
    }
  }

  return results.sort((a, b) => a.distance - b.distance);
}

// ============================================================================
// COORDINATE SYSTEM CONVERSIONS
// ============================================================================

/**
 * Convert degrees to degrees, minutes, seconds format
 * @param decimal - Decimal degrees
 * @returns DMS object
 */
export function degreesToDMS(decimal: number): { degrees: number; minutes: number; seconds: number; direction: string } {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;
  
  return {
    degrees,
    minutes,
    seconds: Math.round(seconds * 1000) / 1000,
    direction: decimal >= 0 ? 'N' : 'S'
  };
}

/**
 * Format coordinates as human-readable string
 * @param coordinates - Coordinates to format
 * @param format - Format type: 'decimal', 'dms', 'utm'
 * @param precision - Decimal places for decimal format
 * @returns Formatted coordinate string
 */
export function formatCoordinates(
  coordinates: Coordinates,
  format: 'decimal' | 'dms' = 'decimal',
  precision: number = 6
): string {
  if (format === 'decimal') {
    return `${coordinates.lat.toFixed(precision)}, ${coordinates.lng.toFixed(precision)}`;
  } else if (format === 'dms') {
    const lat = degreesToDMS(coordinates.lat);
    const lng = degreesToDMS(coordinates.lng);
    lng.direction = coordinates.lng >= 0 ? 'E' : 'W';
    
    return `${lat.degrees}°${lat.minutes}'${lat.seconds}"${lat.direction}, ${lng.degrees}°${lng.minutes}'${lng.seconds}"${lng.direction}`;
  }
  
  return formatCoordinates(coordinates, 'decimal', precision);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Normalize longitude to range [-180, 180]
 * @param lng - Longitude value
 * @returns Normalized longitude
 */
export function normalizeLongitude(lng: number): number {
  while (lng > 180) lng -= 360;
  while (lng < -180) lng += 360;
  return lng;
}

/**
 * Clamp latitude to valid range [-90, 90]
 * @param lat - Latitude value
 * @returns Clamped latitude
 */
export function clampLatitude(lat: number): number {
  return Math.max(-90, Math.min(90, lat));
}

/**
 * Validate if coordinates are within valid ranges
 * @param coordinates - Coordinates to validate
 * @returns True if coordinates are valid
 */
export function isValidCoordinates(coordinates: Coordinates): boolean {
  return (
    typeof coordinates.lat === 'number' &&
    typeof coordinates.lng === 'number' &&
    coordinates.lat >= -90 && coordinates.lat <= 90 &&
    coordinates.lng >= -180 && coordinates.lng <= 180 &&
    !isNaN(coordinates.lat) &&
    !isNaN(coordinates.lng)
  );
}

/**
 * Generate random coordinates within a bounding box
 * @param bounds - Bounding box
 * @param count - Number of random points to generate
 * @returns Array of random coordinates
 */
export function generateRandomPoints(bounds: Bounds, count: number): Coordinates[] {
  const points: Coordinates[] = [];
  
  for (let i = 0; i < count; i++) {
    const lat = bounds.south + Math.random() * (bounds.north - bounds.south);
    const lng = bounds.west + Math.random() * (bounds.east - bounds.west);
    points.push({ lat, lng });
  }
  
  return points;
}

/**
 * Calculate grid points within bounds
 * @param bounds - Bounding box
 * @param spacing - Grid spacing in degrees
 * @returns Array of grid point coordinates
 */
export function generateGridPoints(bounds: Bounds, spacing: number): Coordinates[] {
  const points: Coordinates[] = [];
  
  for (let lat = bounds.south; lat <= bounds.north; lat += spacing) {
    for (let lng = bounds.west; lng <= bounds.east; lng += spacing) {
      points.push({ lat, lng });
    }
  }
  
  return points;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Distance calculations
  haversineDistance,
  vincentyDistance,
  calculateBearing,
  calculateFinalBearing,
  
  // Destination and interpolation
  calculateDestination,
  interpolateGreatCircle,
  calculateMidpoint,
  
  // Geofencing
  isPointInCircle,
  isPointInPolygon,
  getContainingZones,
  distanceToPolygon,
  distanceToLineSegment,
  
  // Bounds and area
  calculateBounds,
  calculatePolygonArea,
  calculatePolygonCentroid,
  
  // Route optimization
  calculateRouteDistance,
  optimizeRoute,
  findClosestPoint,
  findPointsWithinRadius,
  
  // Spatial indexing
  createSpatialIndex,
  queryPointsInRadius,
  
  // Coordinate utilities
  degreesToDMS,
  formatCoordinates,
  normalizeLongitude,
  clampLatitude,
  isValidCoordinates,
  generateRandomPoints,
  generateGridPoints,
  
  // Constants
  EARTH_RADIUS_KM,
  EARTH_RADIUS_M,
  DEGREES_TO_RADIANS,
  RADIANS_TO_DEGREES
};