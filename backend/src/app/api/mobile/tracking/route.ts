import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { z } from 'zod';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const locationUpdateSchema = z.object({
  tourist_id: z.string().min(1, 'Tourist ID is required'),
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
    battery_level: z.number().min(0).max(100).optional(),
    network_type: z.enum(['wifi', 'cellular', 'offline']).optional(),
    gps_enabled: z.boolean().default(true),
    location_permission: z.enum(['granted', 'denied', 'restricted']).default('granted')
  }),
  tracking_context: z.object({
    activity_type: z.enum(['walking', 'driving', 'stationary', 'cycling', 'transit', 'unknown']).optional(),
    movement_confidence: z.number().min(0).max(1).optional(),
    is_background_update: z.boolean().default(false),
    update_frequency: z.enum(['high', 'medium', 'low', 'emergency']).default('medium'),
    battery_optimization: z.boolean().default(true)
  }).optional()
});

const trackingQuerySchema = z.object({
  tourist_id: z.string().min(1),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  include_geofences: z.boolean().default(true),
  include_analytics: z.boolean().default(false)
});

// ============================================================================
// GEOFENCE DEFINITIONS
// ============================================================================

const mockGeofences = [
  {
    id: 'SAFE_ZONE_001',
    name: 'Tourist District',
    type: 'safe_zone',
    center: { latitude: 28.6139, longitude: 77.2090 },
    radius: 2000, // meters
    risk_level: 'low',
    entry_message: 'Welcome to the safe tourist district',
    exit_message: 'You are leaving the safe tourist zone'
  },
  {
    id: 'RESTRICTED_001',
    name: 'Military Area',
    type: 'restricted',
    center: { latitude: 28.6200, longitude: 77.2200 },
    radius: 500,
    risk_level: 'high',
    entry_message: 'WARNING: You are entering a restricted area',
    exit_message: 'You have left the restricted area'
  },
  {
    id: 'MEDICAL_001',
    name: 'Hospital District',
    type: 'medical',
    center: { latitude: 28.6100, longitude: 77.2050 },
    radius: 1000,
    risk_level: 'low',
    entry_message: 'Medical facilities are nearby',
    exit_message: 'You have left the medical district'
  },
  {
    id: 'RISK_ZONE_001',
    name: 'High Crime Area',
    type: 'risk_zone',
    center: { latitude: 28.6300, longitude: 77.1900 },
    radius: 1500,
    risk_level: 'high',
    entry_message: 'CAUTION: You are entering a high-risk area. Stay alert!',
    exit_message: 'You have left the high-risk area'
  },
  {
    id: 'TRANSPORT_001',
    name: 'Metro Station Area',
    type: 'transport',
    center: { latitude: 28.6150, longitude: 77.2100 },
    radius: 300,
    risk_level: 'medium',
    entry_message: 'Metro station nearby - safe transportation available',
    exit_message: 'You have left the metro station area'
  }
];

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
  return R * c * 1000; // Return in meters
}

/**
 * Check geofence violations
 */
function checkGeofences(latitude: number, longitude: number): {
  inside_geofences: any[];
  violations: any[];
  alerts: any[];
  safe_zones: any[];
} {
  const inside = [];
  const violations = [];
  const alerts = [];
  const safeZones = [];

  for (const geofence of mockGeofences) {
    const distance = calculateDistance(
      latitude, longitude,
      geofence.center.latitude, geofence.center.longitude
    );

    if (distance <= geofence.radius) {
      inside.push({
        ...geofence,
        distance_from_center: Math.round(distance),
        entered_at: new Date().toISOString()
      });

      if (geofence.type === 'safe_zone') {
        safeZones.push(geofence);
      }

      if (geofence.type === 'restricted' || geofence.risk_level === 'high') {
        violations.push({
          geofence_id: geofence.id,
          geofence_name: geofence.name,
          violation_type: geofence.type,
          risk_level: geofence.risk_level,
          message: geofence.entry_message,
          action_required: true,
          severity: 'high'
        });

        alerts.push({
          id: `ALERT-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          type: 'geofence_violation',
          message: geofence.entry_message,
          geofence_id: geofence.id,
          timestamp: new Date().toISOString(),
          requires_action: true
        });
      }
    }
  }

  return { inside_geofences: inside, violations, alerts, safe_zones: safeZones };
}

/**
 * Detect movement anomalies
 */
function detectAnomalies(currentLocation: any, previousLocations: any[]): {
  anomalies: any[];
  risk_score: number;
  movement_pattern: string;
} {
  const anomalies = [];
  let riskScore = 0;
  let movementPattern = 'normal';

  if (previousLocations.length > 0) {
    const lastLocation = previousLocations[previousLocations.length - 1];
    const timeDiff = new Date(currentLocation.timestamp).getTime() - new Date(lastLocation.timestamp).getTime();
    const distance = calculateDistance(
      currentLocation.latitude, currentLocation.longitude,
      lastLocation.latitude, lastLocation.longitude
    );

    // Check for sudden location jumps
    if (distance > 5000 && timeDiff < 300000) { // 5km in less than 5 minutes
      anomalies.push({
        type: 'sudden_location_jump',
        description: 'Unusual rapid movement detected',
        distance_moved: Math.round(distance),
        time_elapsed: Math.round(timeDiff / 1000),
        severity: 'medium'
      });
      riskScore += 30;
      movementPattern = 'anomalous';
    }

    // Check for stationary period (no movement for extended time)
    if (distance < 50 && timeDiff > 7200000) { // Less than 50m movement in 2+ hours
      anomalies.push({
        type: 'prolonged_inactivity',
        description: 'No significant movement for extended period',
        duration_hours: Math.round(timeDiff / 3600000),
        severity: 'low'
      });
      riskScore += 15;
      movementPattern = 'stationary';
    }

    // Check for erratic movement pattern
    if (previousLocations.length >= 3) {
      const recentMovements = previousLocations.slice(-3).map((loc, index) => {
        if (index === 0) return 0;
        return calculateDistance(
          loc.latitude, loc.longitude,
          previousLocations[previousLocations.length - 3 + index - 1].latitude,
          previousLocations[previousLocations.length - 3 + index - 1].longitude
        );
      }).filter(d => d > 0);

      const avgMovement = recentMovements.reduce((a, b) => a + b, 0) / recentMovements.length;
      const variance = recentMovements.reduce((acc, mov) => acc + Math.pow(mov - avgMovement, 2), 0) / recentMovements.length;
      
      if (variance > 10000000) { // High variance in movement
        anomalies.push({
          type: 'erratic_movement',
          description: 'Irregular movement pattern detected',
          variance: Math.round(variance),
          severity: 'medium'
        });
        riskScore += 20;
        movementPattern = 'erratic';
      }
    }
  }

  return {
    anomalies,
    risk_score: Math.min(riskScore, 100),
    movement_pattern: movementPattern
  };
}

/**
 * Calculate safety score based on location and movement
 */
function calculateLocationSafetyScore(location: any, geofenceData: any, anomalies: any): number {
  let score = 80; // Base score

  // Adjust for geofences
  if (geofenceData.safe_zones.length > 0) {
    score += 15;
  }

  if (geofenceData.violations.length > 0) {
    score -= geofenceData.violations.length * 20;
  }

  // Adjust for anomalies
  score -= anomalies.risk_score * 0.3;

  // Time of day adjustment
  const hour = new Date().getHours();
  if (hour >= 22 || hour <= 6) { // Night time
    score -= 10;
  }

  // GPS accuracy bonus
  if (location.accuracy && location.accuracy < 10) {
    score += 5;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Generate location insights
 */
function generateLocationInsights(location: any, geofenceData: any, anomalies: any): string[] {
  const insights = [];

  if (geofenceData.safe_zones.length > 0) {
    insights.push(`You are in a safe zone: ${geofenceData.safe_zones[0].name}`);
  }

  if (geofenceData.violations.length > 0) {
    insights.push(`⚠️ Alert: You are in ${geofenceData.violations[0].geofence_name}`);
  }

  if (anomalies.movement_pattern === 'stationary') {
    insights.push('You have been stationary for a while. Consider checking in with emergency contacts.');
  }

  if (anomalies.movement_pattern === 'erratic') {
    insights.push('Irregular movement detected. Are you okay?');
  }

  const hour = new Date().getHours();
  if (hour >= 22 || hour <= 6) {
    insights.push('It\'s nighttime. Consider staying in well-lit areas.');
  }

  if (location.accuracy && location.accuracy > 100) {
    insights.push('GPS accuracy is low. Move to an open area for better location tracking.');
  }

  return insights;
}

// ============================================================================
// API ROUTES
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('📍 Processing location update...');
    
    // Parse and validate request
    const body = await request.json();
    const validatedData = locationUpdateSchema.parse(body);

    const { tourist_id, location, device_info, tracking_context } = validatedData;

    // 1. Check geofences
    console.log('🏛️ Checking geofences...');
    const geofenceData = checkGeofences(location.latitude, location.longitude);

    // 2. Mock previous locations for anomaly detection
    const mockPreviousLocations = [
      {
        latitude: location.latitude + 0.001,
        longitude: location.longitude + 0.001,
        timestamp: new Date(Date.now() - 600000).toISOString() // 10 minutes ago
      },
      {
        latitude: location.latitude + 0.002,
        longitude: location.longitude + 0.002,
        timestamp: new Date(Date.now() - 1200000).toISOString() // 20 minutes ago
      }
    ];

    // 3. Detect anomalies
    console.log('🔍 Detecting movement anomalies...');
    const anomalies = detectAnomalies(location, mockPreviousLocations);

    // 4. Calculate safety score
    const safetyScore = calculateLocationSafetyScore(location, geofenceData, anomalies);

    // 5. Generate insights
    const insights = generateLocationInsights(location, geofenceData, anomalies);

    // 6. Create location record
    const locationRecord = {
      id: `LOC-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
      tourist_id,
      coordinates: location,
      device_info,
      tracking_context,
      geofence_status: geofenceData,
      anomaly_detection: anomalies,
      safety_score: safetyScore,
      insights,
      address: 'Location address would be reverse geocoded', // Mock address
      nearby_landmarks: [
        'Tourist Information Center (500m)',
        'Police Station (1.2km)',
        'Hospital (800m)'
      ],
      timestamp: new Date().toISOString(),
      processed_at: new Date().toISOString()
    };

    // 7. Determine if immediate alerts are needed
    const immediateAlerts = [];
    
    if (geofenceData.violations.length > 0) {
      immediateAlerts.push({
        type: 'geofence_violation',
        severity: 'high',
        message: geofenceData.violations[0].message,
        action_required: true
      });
    }

    if (anomalies.risk_score > 50) {
      immediateAlerts.push({
        type: 'movement_anomaly',
        severity: 'medium',
        message: 'Unusual movement pattern detected',
        action_required: false
      });
    }

    if (safetyScore < 40) {
      immediateAlerts.push({
        type: 'low_safety_score',
        severity: 'medium',
        message: 'You are in a potentially unsafe area',
        action_required: true
      });
    }

    // 8. Update tourist status (mock)
    const touristStatusUpdate = {
      tourist_id,
      current_location: location,
      last_update: new Date().toISOString(),
      safety_score: safetyScore,
      status: immediateAlerts.length > 0 ? 'alert' : 'active',
      in_safe_zone: geofenceData.safe_zones.length > 0,
      tracking_enabled: true
    };

    console.log(`✅ Location update processed for tourist ${tourist_id}`);
    console.log(`📊 Safety score: ${safetyScore}/100`);
    console.log(`🚨 Alerts: ${immediateAlerts.length}`);

    return NextResponse.json({
      success: true,
      message: 'Location updated successfully',
      data: {
        location_record: {
          id: locationRecord.id,
          coordinates: location,
          safety_score: safetyScore,
          timestamp: locationRecord.timestamp
        },
        geofence_status: {
          inside_zones: geofenceData.inside_geofences.map(zone => ({
            id: zone.id,
            name: zone.name,
            type: zone.type,
            risk_level: zone.risk_level
          })),
          violations: geofenceData.violations,
          safe_zones_count: geofenceData.safe_zones.length
        },
        safety_analysis: {
          score: safetyScore,
          risk_level: safetyScore >= 70 ? 'low' : safetyScore >= 40 ? 'medium' : 'high',
          movement_pattern: anomalies.movement_pattern,
          anomalies_detected: anomalies.anomalies.length,
          insights
        },
        alerts: {
          immediate_alerts: immediateAlerts,
          geofence_alerts: geofenceData.alerts,
          total_alerts: immediateAlerts.length + geofenceData.alerts.length
        },
        nearby_services: {
          emergency_contacts: ['100 (Police)', '108 (Medical)', '1363 (Tourist Helpline)'],
          safe_locations: ['Tourist Information Center', 'Police Station', 'Embassy'],
          transport_options: ['Metro Station', 'Taxi Stand', 'Bus Stop']
        },
        tracking_status: {
          frequency: tracking_context?.update_frequency || 'medium',
          battery_optimized: tracking_context?.battery_optimization || true,
          next_update: new Date(Date.now() + 300000).toISOString(), // 5 minutes
          background_tracking: tracking_context?.is_background_update || false
        }
      }
    });

  } catch (error) {
    console.error('❌ Location tracking error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid location data',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to process location update',
      message: 'Location tracking service unavailable'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const touristId = searchParams.get('tourist_id');
    const startTime = searchParams.get('start_time');
    const endTime = searchParams.get('end_time');
    const includeGeofences = searchParams.get('include_geofences') === 'true';
    const includeAnalytics = searchParams.get('include_analytics') === 'true';

    if (!touristId) {
      return NextResponse.json({
        success: false,
        error: 'Tourist ID is required'
      }, { status: 400 });
    }

    // Mock location history
    const locationHistory = Array.from({ length: 10 }, (_, index) => ({
      id: `LOC-${Date.now() - index * 300000}`,
      coordinates: {
        latitude: 28.6139 + (Math.random() - 0.5) * 0.01,
        longitude: 77.2090 + (Math.random() - 0.5) * 0.01,
        accuracy: Math.floor(Math.random() * 20) + 5,
        timestamp: new Date(Date.now() - index * 300000).toISOString()
      },
      safety_score: Math.floor(Math.random() * 40) + 60,
      geofences: Math.random() > 0.7 ? ['SAFE_ZONE_001'] : [],
      anomalies: Math.random() > 0.8 ? ['movement_anomaly'] : []
    })).reverse();

    const response: any = {
      success: true,
      data: {
        tourist_id: touristId,
        location_history: locationHistory,
        summary: {
          total_updates: locationHistory.length,
          time_range: {
            start: locationHistory[0]?.coordinates.timestamp,
            end: locationHistory[locationHistory.length - 1]?.coordinates.timestamp
          },
          current_location: locationHistory[locationHistory.length - 1]?.coordinates,
          average_safety_score: Math.round(locationHistory.reduce((sum, loc) => sum + loc.safety_score, 0) / locationHistory.length)
        }
      }
    };

    if (includeGeofences) {
      response.data.geofences = mockGeofences;
    }

    if (includeAnalytics) {
      response.data.analytics = {
        movement_patterns: {
          total_distance: Math.round(Math.random() * 10000) + 1000,
          average_speed: Math.round(Math.random() * 50) + 10,
          stationary_time: Math.round(Math.random() * 120) + 30,
          active_time: Math.round(Math.random() * 600) + 200
        },
        safety_trends: {
          high_risk_periods: 2,
          safe_zone_time: 85,
          alerts_triggered: 3,
          anomalies_detected: 1
        }
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Location history error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve location history'
    }, { status: 500 });
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
