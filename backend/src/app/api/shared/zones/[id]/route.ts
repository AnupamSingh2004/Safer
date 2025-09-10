/**
 * Smart Tourist Safety System - Individual Zone Management API
 * Handles operations for specific zones
 */

import { NextRequest, NextResponse } from 'next/server';

// Zone interface (same as main route)
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
    radius?: number;
  };
  properties: {
    address?: string;
    capacity?: number;
    maxDuration?: number;
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

// Zone activity log interface
interface ZoneActivity {
  id: string;
  zoneId: string;
  type: 'entry' | 'exit' | 'overstay' | 'alert' | 'status_change' | 'capacity_update';
  touristId?: string;
  touristName?: string;
  description: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  metadata?: {
    [key: string]: any;
  };
}

// Mock zone database (same as main route)
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

// Mock activity log
let mockZoneActivities: ZoneActivity[] = [
  {
    id: 'activity_001',
    zoneId: 'zone_001',
    type: 'entry',
    touristId: 'tourist_001',
    touristName: 'John Smith',
    description: 'Tourist entered Shillong City Center',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    location: {
      latitude: 25.2744,
      longitude: 91.7322
    }
  },
  {
    id: 'activity_002',
    zoneId: 'zone_002',
    type: 'alert',
    touristId: 'tourist_002',
    touristName: 'Sarah Johnson',
    description: 'Tourist approaching maximum stay duration',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    location: {
      latitude: 25.2667,
      longitude: 91.7305
    }
  },
  {
    id: 'activity_003',
    zoneId: 'zone_003',
    type: 'entry',
    touristId: 'tourist_003',
    touristName: 'Mike Chen',
    description: 'Unauthorized entry detected in restricted zone',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    location: {
      latitude: 25.2883,
      longitude: 91.7381
    }
  }
];

// Validation functions
const validateZoneUpdate = (data: any): boolean => {
  const allowedFields = ['name', 'type', 'status', 'riskLevel', 'description', 'geometry', 'properties'];
  const providedFields = Object.keys(data);
  
  return providedFields.every(field => allowedFields.includes(field));
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

// GET - Get specific zone with details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const zoneId = params.id;
    
    if (!zoneId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Zone ID is required'
        },
        { status: 400 }
      );
    }

    const zone = mockZones.find(z => z.id === zoneId);
    
    if (!zone) {
      return NextResponse.json(
        {
          success: false,
          message: 'Zone not found'
        },
        { status: 404 }
      );
    }

    // Get recent activity for this zone
    const recentActivity = mockZoneActivities
      .filter(activity => activity.zoneId === zoneId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    // Calculate zone statistics
    const zoneStats = {
      occupancyRate: zone.properties.capacity ? 
        Math.round((zone.touristCount / zone.properties.capacity) * 100) : 0,
      averageStayDuration: 3.2, // Mock value in hours
      totalVisitsToday: 23,
      alertsLast24h: recentActivity.filter(a => 
        a.type === 'alert' && 
        new Date(a.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
      ).length,
      lastIncident: recentActivity.find(a => a.type === 'alert')?.timestamp || null
    };

    return NextResponse.json({
      success: true,
      message: 'Zone details retrieved successfully',
      data: {
        zone,
        statistics: zoneStats,
        recentActivity,
        tourists: [] // Would contain current tourists in zone
      }
    });

  } catch (error) {
    console.error('Error fetching zone details:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching zone details'
      },
      { status: 500 }
    );
  }
}

// PUT - Update zone
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const zoneId = params.id;
    const body = await request.json();

    if (!zoneId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Zone ID is required'
        },
        { status: 400 }
      );
    }

    const zoneIndex = mockZones.findIndex(z => z.id === zoneId);
    
    if (zoneIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Zone not found'
        },
        { status: 404 }
      );
    }

    if (!validateZoneUpdate(body)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid update data'
        },
        { status: 400 }
      );
    }

    // Validate geometry if provided
    if (body.geometry && !validateGeometry(body.geometry)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid geometry data'
        },
        { status: 400 }
      );
    }

    // Check for name conflicts if name is being updated
    if (body.name && body.name !== mockZones[zoneIndex].name) {
      const existingZone = mockZones.find(z => 
        z.name.toLowerCase() === body.name.toLowerCase() && z.id !== zoneId
      );
      if (existingZone) {
        return NextResponse.json(
          {
            success: false,
            message: 'Zone with this name already exists'
          },
          { status: 409 }
        );
      }
    }

    // Update zone
    const updatedZone = {
      ...mockZones[zoneIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    mockZones[zoneIndex] = updatedZone;

    // Log the update activity
    const updateActivity: ZoneActivity = {
      id: `activity_${Date.now()}`,
      zoneId: zoneId,
      type: 'status_change',
      description: `Zone updated: ${Object.keys(body).join(', ')}`,
      timestamp: new Date().toISOString()
    };
    mockZoneActivities.push(updateActivity);

    return NextResponse.json({
      success: true,
      message: 'Zone updated successfully',
      data: updatedZone
    });

  } catch (error) {
    console.error('Error updating zone:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error updating zone'
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete zone
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const zoneId = params.id;

    if (!zoneId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Zone ID is required'
        },
        { status: 400 }
      );
    }

    const zoneIndex = mockZones.findIndex(z => z.id === zoneId);
    
    if (zoneIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Zone not found'
        },
        { status: 404 }
      );
    }

    const zone = mockZones[zoneIndex];

    // Check if zone has active tourists
    if (zone.touristCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cannot delete zone with active tourists. Please evacuate or reassign tourists first.'
        },
        { status: 409 }
      );
    }

    // Remove zone
    mockZones.splice(zoneIndex, 1);

    // Remove related activities
    mockZoneActivities = mockZoneActivities.filter(activity => activity.zoneId !== zoneId);

    return NextResponse.json({
      success: true,
      message: 'Zone deleted successfully',
      data: {
        deletedZone: zone,
        deletedActivities: mockZoneActivities.length
      }
    });

  } catch (error) {
    console.error('Error deleting zone:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting zone'
      },
      { status: 500 }
    );
  }
}

// PATCH - Specific zone operations
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const zoneId = params.id;
    const body = await request.json();
    const { operation, data } = body;

    if (!zoneId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Zone ID is required'
        },
        { status: 400 }
      );
    }

    if (!operation) {
      return NextResponse.json(
        {
          success: false,
          message: 'Operation type is required'
        },
        { status: 400 }
      );
    }

    const zoneIndex = mockZones.findIndex(z => z.id === zoneId);
    
    if (zoneIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Zone not found'
        },
        { status: 404 }
      );
    }

    const zone = mockZones[zoneIndex];

    switch (operation) {
      case 'update_capacity':
        if (!data.capacity || typeof data.capacity !== 'number' || data.capacity < 0) {
          return NextResponse.json(
            {
              success: false,
              message: 'Valid capacity number is required'
            },
            { status: 400 }
          );
        }

        const oldCapacity = zone.properties.capacity;
        zone.properties.capacity = data.capacity;
        zone.updatedAt = new Date().toISOString();

        // Log capacity update
        const capacityActivity: ZoneActivity = {
          id: `activity_${Date.now()}`,
          zoneId: zoneId,
          type: 'capacity_update',
          description: `Capacity updated from ${oldCapacity} to ${data.capacity}`,
          timestamp: new Date().toISOString()
        };
        mockZoneActivities.push(capacityActivity);

        return NextResponse.json({
          success: true,
          message: 'Zone capacity updated successfully',
          data: {
            zone,
            oldCapacity,
            newCapacity: data.capacity
          }
        });

      case 'toggle_alerts':
        if (!data.alertType || !['entry', 'exit', 'overstay'].includes(data.alertType)) {
          return NextResponse.json(
            {
              success: false,
              message: 'Valid alert type is required (entry, exit, overstay)'
            },
            { status: 400 }
          );
        }

        if (!zone.properties.alerts) {
          zone.properties.alerts = { entry: false, exit: false, overstay: false };
        }

        const currentAlertState = zone.properties.alerts[data.alertType as keyof typeof zone.properties.alerts];
        zone.properties.alerts[data.alertType as keyof typeof zone.properties.alerts] = data.enabled !== undefined ? data.enabled : !currentAlertState;
        zone.updatedAt = new Date().toISOString();

        return NextResponse.json({
          success: true,
          message: `${data.alertType} alerts ${zone.properties.alerts[data.alertType as keyof typeof zone.properties.alerts] ? 'enabled' : 'disabled'}`,
          data: {
            zone,
            alertType: data.alertType,
            enabled: zone.properties.alerts[data.alertType as keyof typeof zone.properties.alerts]
          }
        });

      case 'emergency_evacuation':
        // Simulate emergency evacuation
        const evacuatedTourists = zone.touristCount;
        zone.touristCount = 0;
        zone.status = 'emergency' as any; // This would need to be added to the type
        zone.updatedAt = new Date().toISOString();

        // Log evacuation
        const evacuationActivity: ZoneActivity = {
          id: `activity_${Date.now()}`,
          zoneId: zoneId,
          type: 'alert',
          description: `Emergency evacuation initiated - ${evacuatedTourists} tourists evacuated`,
          timestamp: new Date().toISOString()
        };
        mockZoneActivities.push(evacuationActivity);

        return NextResponse.json({
          success: true,
          message: 'Emergency evacuation initiated',
          data: {
            zone,
            evacuatedTourists,
            evacuationTime: new Date().toISOString()
          }
        });

      case 'get_analytics':
        // Get zone analytics
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const todayActivities = mockZoneActivities.filter(activity => 
          activity.zoneId === zoneId && new Date(activity.timestamp) >= todayStart
        );

        const analytics = {
          totalVisitsToday: todayActivities.filter(a => a.type === 'entry').length,
          currentOccupancy: zone.touristCount,
          occupancyRate: zone.properties.capacity ? 
            Math.round((zone.touristCount / zone.properties.capacity) * 100) : 0,
          averageVisitDuration: 2.5, // Mock value in hours
          peakHours: ['10:00-12:00', '14:00-16:00'], // Mock data
          alertsToday: todayActivities.filter(a => a.type === 'alert').length,
          safetyScore: Math.max(0, 100 - (zone.riskLevel === 'critical' ? 50 : 
            zone.riskLevel === 'high' ? 30 : zone.riskLevel === 'medium' ? 15 : 5)),
          recommendations: [
            zone.touristCount > (zone.properties.capacity || 0) * 0.8 ? 'Consider capacity management' : null,
            zone.riskLevel === 'critical' ? 'Enhanced monitoring required' : null,
            zone.properties.alerts?.entry === false ? 'Enable entry alerts for better tracking' : null
          ].filter(Boolean)
        };

        return NextResponse.json({
          success: true,
          message: 'Zone analytics retrieved successfully',
          data: analytics
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
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
