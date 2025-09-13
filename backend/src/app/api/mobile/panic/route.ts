import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { z } from 'zod';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const panicRequestSchema = z.object({
  tourist_id: z.string().min(1, 'Tourist ID is required'),
  emergency_type: z.enum(['medical', 'safety', 'theft', 'lost', 'accident', 'harassment', 'natural_disaster', 'other']),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    accuracy: z.number().optional(),
    altitude: z.number().optional(),
    heading: z.number().optional(),
    speed: z.number().optional(),
    timestamp: z.string()
  }),
  device_info: z.object({
    device_id: z.string().min(1, 'Device ID required'),
    platform: z.enum(['android', 'ios']),
    app_version: z.string(),
    battery_level: z.number().min(0).max(100).optional(),
    network_type: z.enum(['wifi', 'cellular', 'offline']).optional()
  }),
  additional_info: z.object({
    description: z.string().optional(),
    severity: z.enum(['low', 'medium', 'high', 'critical']).default('high'),
    is_silent_alarm: z.boolean().default(false),
    has_companions: z.boolean().optional(),
    companion_count: z.number().optional(),
    medical_info: z.string().optional(),
    contact_preferences: z.array(z.enum(['police', 'medical', 'embassy', 'tour_guide', 'family'])).default(['police', 'medical'])
  }).optional()
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Find nearest emergency services
 */
function findNearestEmergencyServices(latitude: number, longitude: number): {
  police_stations: any[];
  hospitals: any[];
  embassies: any[];
  tourist_helplines: any[];
} {
  // Mock emergency services data
  const mockPoliceStations = [
    {
      id: 'PS001',
      name: 'Central Police Station',
      coordinates: { latitude: latitude + 0.01, longitude: longitude + 0.01 },
      distance: calculateDistance(latitude, longitude, latitude + 0.01, longitude + 0.01),
      contact: '+91-9876543210',
      address: 'Central Area, City Center',
      response_time: '5-8 minutes'
    },
    {
      id: 'PS002', 
      name: 'Tourist Police Station',
      coordinates: { latitude: latitude + 0.02, longitude: longitude - 0.01 },
      distance: calculateDistance(latitude, longitude, latitude + 0.02, longitude - 0.01),
      contact: '+91-9876543211',
      address: 'Tourist District',
      response_time: '8-12 minutes'
    }
  ];

  const mockHospitals = [
    {
      id: 'H001',
      name: 'City General Hospital',
      coordinates: { latitude: latitude - 0.01, longitude: longitude + 0.02 },
      distance: calculateDistance(latitude, longitude, latitude - 0.01, longitude + 0.02),
      contact: '+91-9876543220',
      address: 'Medical District',
      emergency_contact: '108',
      has_trauma_center: true
    },
    {
      id: 'H002',
      name: 'Tourist Medical Center',
      coordinates: { latitude: latitude + 0.005, longitude: longitude - 0.015 },
      distance: calculateDistance(latitude, longitude, latitude + 0.005, longitude - 0.015),
      contact: '+91-9876543221',
      address: 'Hotel District',
      emergency_contact: '108',
      has_trauma_center: false
    }
  ];

  // Sort by distance
  mockPoliceStations.sort((a, b) => a.distance - b.distance);
  mockHospitals.sort((a, b) => a.distance - b.distance);

  return {
    police_stations: mockPoliceStations,
    hospitals: mockHospitals,
    embassies: [
      {
        id: 'EMB001',
        name: 'Tourist Embassy Services',
        contact: '+91-9876543230',
        emergency_hotline: '+91-9876543231'
      }
    ],
    tourist_helplines: [
      {
        id: 'TH001',
        name: 'National Tourist Helpline',
        contact: '1363',
        whatsapp: '+91-9711077077'
      }
    ]
  };
}

/**
 * Generate emergency response plan
 */
function generateEmergencyResponse(emergencyType: string, severity: string, location: any): {
  immediate_actions: string[];
  response_timeline: any[];
  contacts_to_notify: string[];
  resources_dispatched: string[];
} {
  const baseActions = [
    'Emergency alert broadcasted',
    'Location shared with nearest police station',
    'Tourist marked as in emergency status'
  ];

  const emergencyActions = {
    medical: [
      ...baseActions,
      'Ambulance requested',
      'Nearest hospital notified',
      'Medical history accessed'
    ],
    safety: [
      ...baseActions,
      'Police dispatch initiated',
      'Safe zones identified',
      'Evacuation routes calculated'
    ],
    theft: [
      ...baseActions,
      'Police FIR process initiated',
      'Financial institutions notified',
      'Documentation support activated'
    ],
    lost: [
      ...baseActions,
      'Search and rescue team alerted',
      'Last known locations analyzed',
      'Guide services contacted'
    ]
  };

  return {
    immediate_actions: emergencyActions[emergencyType as keyof typeof emergencyActions] || baseActions,
    response_timeline: [
      { time: '0-2 minutes', action: 'Alert verification and location confirmation' },
      { time: '2-5 minutes', action: 'Emergency services notification' },
      { time: '5-10 minutes', action: 'First responder dispatch' },
      { time: '10-15 minutes', action: 'On-site emergency response' }
    ],
    contacts_to_notify: ['emergency_contacts', 'police', 'medical', 'tour_guide'],
    resources_dispatched: ['police_patrol', 'medical_team', 'tourist_assistance']
  };
}

/**
 * Broadcast emergency alert
 */
async function broadcastEmergencyAlert(emergencyData: any): Promise<{
  alert_id: string;
  broadcast_channels: string[];
  notification_count: number;
  estimated_response_time: string;
}> {
  const alertId = `ALERT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  
  // Simulate broadcasting to multiple channels
  const broadcastChannels = [
    'police_dispatch',
    'medical_services',
    'tourist_emergency_network',
    'local_authorities',
    'embassy_services'
  ];

  return {
    alert_id: alertId,
    broadcast_channels: broadcastChannels,
    notification_count: Math.floor(Math.random() * 10) + 15, // 15-25 people notified
    estimated_response_time: '5-12 minutes'
  };
}

// ============================================================================
// API ROUTES
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('🚨 EMERGENCY: Panic button activated!');
    
    // Parse and validate request
    const body = await request.json();
    const validatedData = panicRequestSchema.parse(body);

    const { tourist_id, emergency_type, location, device_info, additional_info } = validatedData;

    // Generate unique emergency ID
    const emergencyId = `EMERGENCY-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    
    console.log(`🆔 Emergency ID: ${emergencyId}`);
    console.log(`📍 Location: ${location.latitude}, ${location.longitude}`);
    console.log(`⚠️ Type: ${emergency_type.toUpperCase()}`);

    // 1. Find nearest emergency services
    console.log('🔍 Finding nearest emergency services...');
    const nearestServices = findNearestEmergencyServices(location.latitude, location.longitude);

    // 2. Generate emergency response plan
    console.log('📋 Generating emergency response plan...');
    const responsePlan = generateEmergencyResponse(
      emergency_type, 
      additional_info?.severity || 'high', 
      location
    );

    // 3. Broadcast emergency alert
    console.log('📢 Broadcasting emergency alert...');
    const alertBroadcast = await broadcastEmergencyAlert({
      emergency_id: emergencyId,
      tourist_id,
      emergency_type,
      location,
      severity: additional_info?.severity || 'high'
    });

    // 4. Create emergency record
    const emergencyRecord = {
      id: emergencyId,
      tourist_id,
      emergency_type,
      severity: additional_info?.severity || 'high',
      status: 'active',
      location: {
        ...location,
        address: 'Emergency Location (Coordinates Provided)', // Would be reverse geocoded
        nearest_landmark: 'Near City Center' // Mock landmark
      },
      device_info,
      additional_info,
      response_plan: responsePlan,
      nearest_services: nearestServices,
      alert_broadcast: alertBroadcast,
      timeline: [
        {
          timestamp: new Date().toISOString(),
          event: 'Emergency alert initiated',
          details: `Panic button pressed by tourist ${tourist_id}`
        }
      ],
      created_at: new Date().toISOString(),
      estimated_resolution: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
    };

    // 5. Generate QR code for emergency responders
    const emergencyQRData = {
      emergency_id: emergencyId,
      tourist_id,
      verification_url: `https://emergency.tourist-safety.gov.in/verify/${emergencyId}`,
      location: `${location.latitude},${location.longitude}`,
      type: emergency_type,
      timestamp: new Date().toISOString()
    };

    // 6. Send immediate notifications (mock)
    const notifications = {
      sms_sent: [
        { contact: nearestServices.police_stations[0]?.contact, status: 'sent' },
        { contact: '108', status: 'sent' }, // Emergency services
        { contact: '+91-9711077077', status: 'sent' } // Tourist helpline
      ],
      app_notifications: [
        'Tourist marked as in emergency',
        'Location shared with emergency services',
        'Family contacts notified',
        'Tour guide alerted'
      ],
      dashboard_alerts: [
        'Emergency alert created on police dashboard',
        'Tourist status updated to EMERGENCY',
        'Real-time tracking activated'
      ]
    };

    console.log('✅ Emergency response initiated successfully');

    return NextResponse.json({
      success: true,
      message: 'Emergency alert activated successfully',
      emergency_id: emergencyId,
      data: {
        emergency_details: {
          id: emergencyId,
          type: emergency_type,
          severity: additional_info?.severity || 'high',
          status: 'active',
          estimated_response_time: alertBroadcast.estimated_response_time
        },
        location_info: {
          coordinates: location,
          nearest_police: nearestServices.police_stations[0],
          nearest_hospital: nearestServices.hospitals[0],
          emergency_contacts: nearestServices.tourist_helplines
        },
        immediate_response: {
          alert_broadcast: alertBroadcast,
          notifications_sent: notifications,
          responders_notified: responsePlan.contacts_to_notify,
          actions_taken: responsePlan.immediate_actions
        },
        emergency_qr: emergencyQRData,
        next_steps: [
          'Stay calm and remain at your current location if safe',
          'Keep your phone on and charged',
          'Emergency services have been notified',
          'Help is on the way - estimated arrival: ' + alertBroadcast.estimated_response_time,
          'Share your emergency QR code with any local assistance'
        ],
        emergency_contacts: {
          police: nearestServices.police_stations[0]?.contact,
          medical: '108',
          tourist_helpline: '1363',
          embassy: nearestServices.embassies[0]?.emergency_hotline
        }
      }
    });

  } catch (error) {
    console.error('❌ Panic button error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid emergency data',
        details: error.errors
      }, { status: 400 });
    }

    // Even if there's an error, try to send basic emergency response
    return NextResponse.json({
      success: false,
      error: 'Emergency system error',
      emergency_fallback: {
        police: '100',
        medical: '108',
        fire: '101',
        tourist_helpline: '1363',
        message: 'Call emergency services directly if system is unavailable'
      }
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const touristId = searchParams.get('tourist_id');
    const emergencyId = searchParams.get('emergency_id');

    if (!touristId && !emergencyId) {
      return NextResponse.json({
        success: false,
        error: 'Tourist ID or Emergency ID is required'
      }, { status: 400 });
    }

    // Mock emergency status check
    const emergencyStatus = {
      tourist_id: touristId,
      active_emergencies: [
        {
          id: emergencyId || 'EMERGENCY-123456',
          type: 'safety',
          status: 'active',
          created_at: new Date().toISOString(),
          location: { latitude: 28.6139, longitude: 77.2090 },
          response_time: '8 minutes',
          responders_notified: 12
        }
      ],
      emergency_history: [
        {
          id: 'EMERGENCY-789012',
          type: 'medical',
          status: 'resolved',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          resolved_at: new Date(Date.now() - 86400000 + 1800000).toISOString()
        }
      ],
      emergency_contacts: [
        { name: 'John Doe', phone: '+91-9876543210', relationship: 'father' },
        { name: 'Jane Smith', phone: '+91-9876543211', relationship: 'spouse' }
      ]
    };

    return NextResponse.json({
      success: true,
      data: emergencyStatus
    });

  } catch (error) {
    console.error('❌ Emergency status error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get emergency status'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { emergency_id, status, resolution_notes } = body;

    if (!emergency_id) {
      return NextResponse.json({
        success: false,
        error: 'Emergency ID is required'
      }, { status: 400 });
    }

    // Update emergency status
    const updatedEmergency = {
      emergency_id,
      status,
      resolution_notes,
      updated_at: new Date().toISOString(),
      updated_by: 'system' // Would be actual user/responder ID
    };

    return NextResponse.json({
      success: true,
      message: 'Emergency status updated successfully',
      data: updatedEmergency
    });

  } catch (error) {
    console.error('❌ Emergency update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update emergency status'
    }, { status: 500 });
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
