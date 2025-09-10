/**
 * Smart Tourist Safety System - Zone Management API Routes
 * Handles CRUD operations for geofencing zones and risk areas
 */

import { NextRequest, NextResponse } from 'next/server';

// Zone interfaces
interface Zone {
  id: string;
  name: string;
  type: 'safe' | 'caution' | 'restricted' | 'emergency' | 'poi';
  status: 'active' | 'inactive' | 'maintenance';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  geometry: {
    type: 'circle' | 'polygon';
    coordinates: number[][];
    center?: {
      latitude: number;
      longitude: number;
    };
    radius?: number; // in meters for circle type
  };
  properties: {
    address?: string;
    capacity?: number;
    maxDuration?: number; // max stay duration in hours
    entryRestrictions?: string[];
    emergencyContacts?: Array<{
      name: string;
      phone: string;
      role: string;
    }>;
    alerts?: {
      entry: boolean;
      exit: boolean;
      overstay: boolean;
    };
  };
  touristCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastActivity?: string;
  metadata?: {
    [key: string]: any;
  };
}

// Zone statistics interface
interface ZoneStats {
  totalZones: number;
  activeZones: number;
  restrictedZones: number;
  touristsInZones: number;
  alertsLast24h: number;
  averageOccupancy: number;
}

// Mock zone database
let mockZones: Zone[] = [
  {
    id: 'zone_001',
    name: 'Shillong City Center',
    type: 'safe',
    status: 'active',
    riskLevel: 'low',
    description: 'Main city area with high security presence and tourist facilities',
    geometry: {
      type: 'circle',
      coordinates: [[91.7322, 25.2744]],
      center: {
        latitude: 25.2744,
        longitude: 91.7322
      },
      radius: 2000
    },
    properties: {
      address: 'Shillong, Meghalaya',
      capacity: 500,
      alerts: {
        entry: false,
        exit: false,
        overstay: false
      }
    },
    touristCount: 45,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    createdBy: 'admin_001',
    lastActivity: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'zone_002',
    name: 'Umiam Lake Recreation Area',
    type: 'caution',
    status: 'active',
    riskLevel: 'medium',
    description: 'Popular tourist destination with water activities - requires supervision',
    geometry: {
      type: 'polygon',
      coordinates: [
        [91.7289, 25.2654],
        [91.7320, 25.2654],
        [91.7320, 25.2680],
        [91.7289, 25.2680],
        [91.7289, 25.2654]
      ]
    },
    properties: {
      address: 'Umiam Lake, Meghalaya',
      capacity: 200,
      maxDuration: 8,
      emergencyContacts: [
        {
          name: 'Lake Patrol Unit',
          phone: '+91-364-2500100',
          role: 'Emergency Response'
        }
      ],
      alerts: {
        entry: true,
        exit: true,
        overstay: true
      }
    },
    touristCount: 23,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdBy: 'admin_001',
    lastActivity: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: 'zone_003',
    name: 'Restricted Forest Area',
    type: 'restricted',
    status: 'active',
    riskLevel: 'critical',
    description: 'Protected wildlife sanctuary - entry prohibited without special permits',
    geometry: {
      type: 'polygon',
      coordinates: [
        [91.7362, 25.2867],
        [91.7400, 25.2867],
        [91.7400, 25.2900],
        [91.7362, 25.2900],
        [91.7362, 25.2867]
      ]
    },
    properties: {
      address: 'Protected Forest, East Khasi Hills',
      capacity: 0,
      entryRestrictions: ['permit_required', 'guide_mandatory', 'daylight_only'],
      emergencyContacts: [
        {
          name: 'Forest Department Emergency',
          phone: '+91-364-2500200',
          role: 'Forest Protection'
        }
      ],
      alerts: {
        entry: true,
        exit: true,
        overstay: true
      }
    },
    touristCount: 1,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    createdBy: 'admin_002',
    lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'zone_004',
    name: 'Elephant Falls Viewpoint',
    type: 'poi',
    status: 'active',
    riskLevel: 'medium',
    description: 'Popular waterfall viewpoint with steep terrain',
    geometry: {
      type: 'circle',
      coordinates: [[91.7550, 25.2900]],
      center: {
        latitude: 25.2900,
        longitude: 91.7550
      },
      radius: 500
    },
    properties: {
      address: 'Elephant Falls, Shillong',
      capacity: 100,
      maxDuration: 4,
      alerts: {
        entry: true,
        exit: false,
        overstay: true
      }
    },
    touristCount: 12,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    createdBy: 'operator_001',
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
];

// Query parameters interface
interface ZoneQuery {
  page?: string;
  limit?: string;
  type?: string;
  status?: string;
  riskLevel?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  includeInactive?: string;
}

// Utility functions
const generateZoneId = (): string => {
  return `zone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Validation functions
const validateZoneData = (data: any): boolean => {
  return (
    data &&
    typeof data.name === 'string' &&
    typeof data.type === 'string' &&
    typeof data.description === 'string' &&
    data.geometry &&
    data.geometry.type &&
    data.geometry.coordinates &&
    ['safe', 'caution', 'restricted', 'emergency', 'poi'].includes(data.type) &&
    ['circle', 'polygon'].includes(data.geometry.type) &&
    Array.isArray(data.geometry.coordinates)
  );
};

const validateGeometry = (geometry: any): boolean => {
  if (geometry.type === 'circle') {
    return (
      geometry.center &&
      typeof geometry.center.latitude === 'number' &&
      typeof geometry.center.longitude === 'number' &&
      typeof geometry.radius === 'number' &&
      geometry.radius > 0
    );
  } else if (geometry.type === 'polygon') {
    return (
      Array.isArray(geometry.coordinates) &&
      geometry.coordinates.length >= 3 &&
      geometry.coordinates.every((coord: any) => 
        Array.isArray(coord) && coord.length === 2 &&
        typeof coord[0] === 'number' && typeof coord[1] === 'number'
      )
    );
  }
  return false;
};

// Point-in-polygon check (simplified)
const isPointInZone = (lat: number, lng: number, zone: Zone): boolean => {
  if (zone.geometry.type === 'circle' && zone.geometry.center && zone.geometry.radius) {
    const distance = calculateDistance(
      lat, lng,
      zone.geometry.center.latitude,
      zone.geometry.center.longitude
    );
    return distance <= zone.geometry.radius;
  } else if (zone.geometry.type === 'polygon') {
    return isPointInPolygon(lat, lng, zone.geometry.coordinates);
  }
  return false;
};

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const isPointInPolygon = (lat: number, lng: number, polygon: number[][]): boolean => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    if (((polygon[i][1] > lat) !== (polygon[j][1] > lat)) &&
        (lng < (polygon[j][0] - polygon[i][0]) * (lat - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0])) {
      inside = !inside;
    }
  }
  return inside;
};

// Filtering and pagination
const filterZones = (zones: Zone[], query: ZoneQuery): Zone[] => {
  let filtered = [...zones];
  
  if (query.type) {
    filtered = filtered.filter(z => z.type === query.type);
  }
  
  if (query.status) {
    filtered = filtered.filter(z => z.status === query.status);
  } else if (query.includeInactive !== 'true') {
    filtered = filtered.filter(z => z.status === 'active');
  }
  
  if (query.riskLevel) {
    filtered = filtered.filter(z => z.riskLevel === query.riskLevel);
  }
  
  if (query.search) {
    const searchTerm = query.search.toLowerCase();
    filtered = filtered.filter(z =>
      z.name.toLowerCase().includes(searchTerm) ||
      z.description.toLowerCase().includes(searchTerm) ||
      z.properties.address?.toLowerCase().includes(searchTerm)
    );
  }
  
  // Sorting
  if (query.sortBy) {
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
    filtered.sort((a, b) => {
      const aVal = (a as any)[query.sortBy!];
      const bVal = (b as any)[query.sortBy!];
      
      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal) * sortOrder;
      }
      
      return (aVal - bVal) * sortOrder;
    });
  }
  
  return filtered;
};

const paginateZones = (zones: Zone[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: zones.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(zones.length / limit),
      totalItems: zones.length,
      itemsPerPage: limit
    }
  };
};

// GET - List zones with pagination and filtering
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const query: ZoneQuery = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      type: searchParams.get('type') || undefined,
      status: searchParams.get('status') || undefined,
      riskLevel: searchParams.get('riskLevel') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || 'name',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
      includeInactive: searchParams.get('includeInactive') || 'false'
    };

    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '10'), 100);

    // Filter zones
    const filteredZones = filterZones(mockZones, query);
    
    // Paginate results
    const result = paginateZones(filteredZones, page, limit);

    // Calculate statistics
    const statistics: ZoneStats = {
      totalZones: mockZones.length,
      activeZones: mockZones.filter(z => z.status === 'active').length,
      restrictedZones: mockZones.filter(z => z.type === 'restricted').length,
      touristsInZones: mockZones.reduce((sum, z) => sum + z.touristCount, 0),
      alertsLast24h: 12, // Mock value
      averageOccupancy: Math.round(
        mockZones.reduce((sum, z) => sum + (z.touristCount / (z.properties.capacity || 1)), 0) / mockZones.length * 100
      )
    };

    return NextResponse.json({
      success: true,
      message: 'Zones retrieved successfully',
      data: result.data,
      pagination: result.pagination,
      statistics,
      filters: {
        types: ['safe', 'caution', 'restricted', 'emergency', 'poi'],
        statuses: ['active', 'inactive', 'maintenance'],
        riskLevels: ['low', 'medium', 'high', 'critical']
      }
    });

  } catch (error) {
    console.error('Error fetching zones:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching zones'
      },
      { status: 500 }
    );
  }
}

// POST - Create new zone
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    if (!validateZoneData(body)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid zone data. Required fields: name, type, description, geometry'
        },
        { status: 400 }
      );
    }

    if (!validateGeometry(body.geometry)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid geometry data'
        },
        { status: 400 }
      );
    }

    // Check for zone name conflicts
    const existingZone = mockZones.find(z => z.name.toLowerCase() === body.name.toLowerCase());
    if (existingZone) {
      return NextResponse.json(
        {
          success: false,
          message: 'Zone with this name already exists'
        },
        { status: 409 }
      );
    }

    const newZone: Zone = {
      id: generateZoneId(),
      name: body.name,
      type: body.type,
      status: body.status || 'active',
      riskLevel: body.riskLevel || 'low',
      description: body.description,
      geometry: body.geometry,
      properties: {
        address: body.properties?.address || '',
        capacity: body.properties?.capacity || 100,
        maxDuration: body.properties?.maxDuration || undefined,
        entryRestrictions: body.properties?.entryRestrictions || [],
        emergencyContacts: body.properties?.emergencyContacts || [],
        alerts: body.properties?.alerts || {
          entry: false,
          exit: false,
          overstay: false
        }
      },
      touristCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: body.createdBy || 'system',
      metadata: body.metadata || {}
    };

    mockZones.push(newZone);

    return NextResponse.json(
      {
        success: true,
        message: 'Zone created successfully',
        data: newZone
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating zone:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error creating zone'
      },
      { status: 500 }
    );
  }
}

// PUT - Bulk operations or zone analysis
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { operation, data } = body;

    if (!operation) {
      return NextResponse.json(
        {
          success: false,
          message: 'Operation type is required'
        },
        { status: 400 }
      );
    }

    switch (operation) {
      case 'check_location':
        // Check which zones contain a specific location
        if (!data.latitude || !data.longitude) {
          return NextResponse.json(
            {
              success: false,
              message: 'Latitude and longitude are required'
            },
            { status: 400 }
          );
        }

        const containingZones = mockZones.filter(zone => 
          zone.status === 'active' && 
          isPointInZone(data.latitude, data.longitude, zone)
        );

        return NextResponse.json({
          success: true,
          message: 'Location check completed',
          data: {
            location: {
              latitude: data.latitude,
              longitude: data.longitude
            },
            zones: containingZones,
            riskAssessment: {
              overallRisk: containingZones.length > 0 
                ? Math.max(...containingZones.map(z => {
                    const riskLevels = { low: 1, medium: 2, high: 3, critical: 4 };
                    return riskLevels[z.riskLevel];
                  }))
                : 0,
              recommendations: containingZones.filter(z => z.type === 'restricted').length > 0
                ? ['Area requires special permits', 'Contact authorities before entry']
                : ['Safe to proceed']
            }
          }
        });

      case 'bulk_status_update':
        // Update status for multiple zones
        if (!body.zoneIds || !Array.isArray(body.zoneIds) || !data.status) {
          return NextResponse.json(
            {
              success: false,
              message: 'Zone IDs array and status are required'
            },
            { status: 400 }
          );
        }

        let updatedCount = 0;
        mockZones.forEach(zone => {
          if (body.zoneIds.includes(zone.id)) {
            zone.status = data.status;
            zone.updatedAt = new Date().toISOString();
            updatedCount++;
          }
        });

        return NextResponse.json({
          success: true,
          message: `Bulk status update completed`,
          data: {
            updatedCount,
            requestedCount: body.zoneIds.length,
            newStatus: data.status
          }
        });

      default:
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid operation'
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in zone operation:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error in zone operation'
      },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
