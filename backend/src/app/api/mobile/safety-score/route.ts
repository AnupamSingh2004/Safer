import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { z } from 'zod';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const safetyScoreUpdateSchema = z.object({
  tourist_id: z.string().min(1, 'Tourist ID is required'),
  location_data: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    accuracy: z.number().optional(),
    timestamp: z.string()
  }).optional(),
  behavior_data: z.object({
    check_in_frequency: z.number().min(0).max(100).optional(), // Percentage of expected check-ins completed
    route_adherence: z.number().min(0).max(100).optional(), // How closely following planned route
    emergency_contact_updates: z.number().min(0).optional(), // Number of emergency contact updates
    safety_feature_usage: z.number().min(0).max(100).optional(), // Usage of safety features
    response_time: z.number().min(0).optional(), // Average response time to safety notifications (minutes)
    panic_button_false_alarms: z.number().min(0).default(0)
  }).optional(),
  risk_factors: z.object({
    time_of_day: z.enum(['day', 'evening', 'night', 'dawn']).optional(),
    weather_conditions: z.enum(['clear', 'rain', 'storm', 'fog', 'extreme']).optional(),
    area_crime_rate: z.enum(['very_low', 'low', 'medium', 'high', 'very_high']).optional(),
    tourist_density: z.enum(['very_low', 'low', 'medium', 'high', 'very_high']).optional(),
    transportation_mode: z.enum(['walking', 'taxi', 'public_transport', 'private_vehicle', 'bike']).optional(),
    group_size: z.number().min(0).optional(),
    local_guide_present: z.boolean().optional()
  }).optional(),
  incident_history: z.object({
    minor_incidents: z.number().min(0).default(0), // Lost items, minor injuries, etc.
    major_incidents: z.number().min(0).default(0), // Theft, assault, serious medical
    false_alarms: z.number().min(0).default(0),
    resolved_incidents: z.number().min(0).default(0),
    days_since_last_incident: z.number().min(0).optional()
  }).optional()
});

// ============================================================================
// SAFETY SCORE CALCULATION ALGORITHMS
// ============================================================================

/**
 * Calculate base safety score from location data
 */
function calculateLocationScore(locationData: any): {
  score: number;
  factors: any;
} {
  let score = 70; // Base location score
  const factors: any = {};

  if (locationData) {
    // GPS accuracy bonus
    if (locationData.accuracy && locationData.accuracy < 10) {
      score += 10;
      factors.gps_accuracy = 10;
    } else if (locationData.accuracy && locationData.accuracy > 100) {
      score -= 5;
      factors.gps_accuracy = -5;
    }

    // Time-based location scoring
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 18) {
      score += 15; // Daytime bonus
      factors.time_of_day = 15;
    } else if (hour >= 19 && hour <= 21) {
      score += 5; // Evening slight bonus
      factors.time_of_day = 5;
    } else {
      score -= 10; // Night penalty
      factors.time_of_day = -10;
    }

    // Mock geofence-based scoring
    const isInSafeZone = Math.random() > 0.3; // 70% chance in safe zone
    if (isInSafeZone) {
      score += 20;
      factors.safe_zone = 20;
    } else {
      score -= 10;
      factors.risk_area = -10;
    }
  }

  return { score: Math.max(0, Math.min(100, score)), factors };
}

/**
 * Calculate behavior-based safety score
 */
function calculateBehaviorScore(behaviorData: any): {
  score: number;
  factors: any;
} {
  let score = 80; // Base behavior score
  const factors: any = {};

  if (behaviorData) {
    // Check-in frequency (very important)
    if (behaviorData.check_in_frequency !== undefined) {
      const checkInScore = (behaviorData.check_in_frequency / 100) * 25;
      score += checkInScore - 12.5; // Center around 50% frequency
      factors.check_in_frequency = Math.round(checkInScore - 12.5);
    }

    // Route adherence
    if (behaviorData.route_adherence !== undefined) {
      const routeScore = (behaviorData.route_adherence / 100) * 15;
      score += routeScore - 7.5;
      factors.route_adherence = Math.round(routeScore - 7.5);
    }

    // Safety feature usage
    if (behaviorData.safety_feature_usage !== undefined) {
      const featureScore = (behaviorData.safety_feature_usage / 100) * 10;
      score += featureScore - 5;
      factors.safety_feature_usage = Math.round(featureScore - 5);
    }

    // Response time penalty (higher is worse)
    if (behaviorData.response_time !== undefined) {
      if (behaviorData.response_time <= 5) {
        score += 10; // Quick response bonus
        factors.response_time = 10;
      } else if (behaviorData.response_time <= 15) {
        score += 5; // Moderate response
        factors.response_time = 5;
      } else {
        score -= 10; // Slow response penalty
        factors.response_time = -10;
      }
    }

    // False alarm penalty
    if (behaviorData.panic_button_false_alarms > 0) {
      const penalty = behaviorData.panic_button_false_alarms * 5;
      score -= penalty;
      factors.false_alarms = -penalty;
    }

    // Emergency contact updates bonus
    if (behaviorData.emergency_contact_updates && behaviorData.emergency_contact_updates > 0) {
      score += Math.min(10, behaviorData.emergency_contact_updates * 2);
      factors.emergency_contact_updates = Math.min(10, behaviorData.emergency_contact_updates * 2);
    }
  }

  return { score: Math.max(0, Math.min(100, score)), factors };
}

/**
 * Calculate risk-based safety score adjustments
 */
function calculateRiskScore(riskFactors: any): {
  score: number;
  factors: any;
} {
  let score = 80; // Base risk score
  const factors: any = {};

  if (riskFactors) {
    // Time of day adjustment
    switch (riskFactors.time_of_day) {
      case 'day':
        score += 15;
        factors.time_of_day = 15;
        break;
      case 'evening':
        score += 5;
        factors.time_of_day = 5;
        break;
      case 'night':
        score -= 15;
        factors.time_of_day = -15;
        break;
      case 'dawn':
        score -= 5;
        factors.time_of_day = -5;
        break;
    }

    // Weather conditions
    switch (riskFactors.weather_conditions) {
      case 'clear':
        score += 10;
        factors.weather = 10;
        break;
      case 'rain':
        score -= 5;
        factors.weather = -5;
        break;
      case 'storm':
        score -= 20;
        factors.weather = -20;
        break;
      case 'fog':
        score -= 10;
        factors.weather = -10;
        break;
      case 'extreme':
        score -= 25;
        factors.weather = -25;
        break;
    }

    // Area crime rate
    switch (riskFactors.area_crime_rate) {
      case 'very_low':
        score += 20;
        factors.crime_rate = 20;
        break;
      case 'low':
        score += 10;
        factors.crime_rate = 10;
        break;
      case 'medium':
        // No change
        break;
      case 'high':
        score -= 15;
        factors.crime_rate = -15;
        break;
      case 'very_high':
        score -= 30;
        factors.crime_rate = -30;
        break;
    }

    // Tourist density (more tourists = safer)
    switch (riskFactors.tourist_density) {
      case 'very_high':
        score += 15;
        factors.tourist_density = 15;
        break;
      case 'high':
        score += 10;
        factors.tourist_density = 10;
        break;
      case 'medium':
        score += 5;
        factors.tourist_density = 5;
        break;
      case 'low':
        score -= 5;
        factors.tourist_density = -5;
        break;
      case 'very_low':
        score -= 15;
        factors.tourist_density = -15;
        break;
    }

    // Group size (traveling in groups is safer)
    if (riskFactors.group_size !== undefined) {
      if (riskFactors.group_size === 0) {
        score -= 15; // Solo travel penalty
        factors.group_size = -15;
      } else if (riskFactors.group_size >= 2 && riskFactors.group_size <= 4) {
        score += 10; // Optimal group size bonus
        factors.group_size = 10;
      } else if (riskFactors.group_size > 4) {
        score += 5; // Large group moderate bonus
        factors.group_size = 5;
      }
    }

    // Local guide presence
    if (riskFactors.local_guide_present === true) {
      score += 15;
      factors.local_guide = 15;
    }

    // Transportation mode
    switch (riskFactors.transportation_mode) {
      case 'private_vehicle':
        score += 10;
        factors.transportation = 10;
        break;
      case 'taxi':
        score += 8;
        factors.transportation = 8;
        break;
      case 'public_transport':
        score += 5;
        factors.transportation = 5;
        break;
      case 'bike':
        score -= 5;
        factors.transportation = -5;
        break;
      case 'walking':
        score -= 10;
        factors.transportation = -10;
        break;
    }
  }

  return { score: Math.max(0, Math.min(100, score)), factors };
}

/**
 * Calculate incident history impact on safety score
 */
function calculateIncidentScore(incidentHistory: any): {
  score: number;
  factors: any;
} {
  let score = 85; // Base incident score (starts high, reduced by incidents)
  const factors: any = {};

  if (incidentHistory) {
    // Major incident penalty
    if (incidentHistory.major_incidents > 0) {
      const penalty = incidentHistory.major_incidents * 25;
      score -= penalty;
      factors.major_incidents = -penalty;
    }

    // Minor incident penalty
    if (incidentHistory.minor_incidents > 0) {
      const penalty = Math.min(incidentHistory.minor_incidents * 10, 30); // Cap at 30 points
      score -= penalty;
      factors.minor_incidents = -penalty;
    }

    // False alarm penalty
    if (incidentHistory.false_alarms > 0) {
      const penalty = Math.min(incidentHistory.false_alarms * 5, 20); // Cap at 20 points
      score -= penalty;
      factors.false_alarms = -penalty;
    }

    // Resolution bonus (shows good recovery/learning)
    if (incidentHistory.resolved_incidents > 0) {
      const bonus = Math.min(incidentHistory.resolved_incidents * 5, 15);
      score += bonus;
      factors.resolved_incidents = bonus;
    }

    // Time since last incident bonus
    if (incidentHistory.days_since_last_incident !== undefined) {
      if (incidentHistory.days_since_last_incident >= 30) {
        score += 15; // 30+ days incident-free
        factors.incident_free_period = 15;
      } else if (incidentHistory.days_since_last_incident >= 7) {
        score += 8; // 7+ days incident-free
        factors.incident_free_period = 8;
      } else if (incidentHistory.days_since_last_incident >= 1) {
        score += 3; // 1+ days incident-free
        factors.incident_free_period = 3;
      }
    }
  }

  return { score: Math.max(0, Math.min(100, score)), factors };
}

/**
 * Calculate composite safety score
 */
function calculateCompositeSafetyScore(
  locationScore: any,
  behaviorScore: any,
  riskScore: any,
  incidentScore: any
): {
  composite_score: number;
  weighted_scores: any;
  risk_level: string;
  recommendations: string[];
} {
  // Weighted composite calculation
  const weights = {
    location: 0.25,
    behavior: 0.35,
    risk: 0.25,
    incident: 0.15
  };

  const compositeScore = Math.round(
    locationScore.score * weights.location +
    behaviorScore.score * weights.behavior +
    riskScore.score * weights.risk +
    incidentScore.score * weights.incident
  );

  // Determine risk level
  let riskLevel = 'low';
  if (compositeScore < 40) {
    riskLevel = 'high';
  } else if (compositeScore < 70) {
    riskLevel = 'medium';
  }

  // Generate recommendations
  const recommendations = [];
  
  if (compositeScore < 50) {
    recommendations.push('⚠️ Consider moving to a safer area');
    recommendations.push('📞 Stay in contact with emergency contacts');
    recommendations.push('🏨 Consider returning to accommodation');
  } else if (compositeScore < 70) {
    recommendations.push('📱 Enable more frequent check-ins');
    recommendations.push('👥 Consider traveling in groups');
    recommendations.push('📍 Share location with trusted contacts');
  } else {
    recommendations.push('✅ Continue following safety protocols');
    recommendations.push('📱 Maintain regular check-ins');
    recommendations.push('🗺️ Keep exploring safely');
  }

  // Specific factor recommendations
  if (locationScore.score < 60) {
    recommendations.push('📍 Move to a well-lit, populated area');
  }
  if (behaviorScore.score < 60) {
    recommendations.push('📋 Improve check-in frequency');
  }
  if (riskScore.score < 60) {
    recommendations.push('🚨 Be extra cautious due to current conditions');
  }
  if (incidentScore.score < 60) {
    recommendations.push('📚 Review safety guidelines after recent incidents');
  }

  return {
    composite_score: compositeScore,
    weighted_scores: {
      location: Math.round(locationScore.score * weights.location),
      behavior: Math.round(behaviorScore.score * weights.behavior),
      risk: Math.round(riskScore.score * weights.risk),
      incident: Math.round(incidentScore.score * weights.incident)
    },
    risk_level: riskLevel,
    recommendations: recommendations.slice(0, 5) // Limit to 5 recommendations
  };
}

// ============================================================================
// API ROUTES
// ============================================================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const touristId = searchParams.get('tourist_id');
    const includeHistory = searchParams.get('include_history') === 'true';
    const includeFactors = searchParams.get('include_factors') === 'true';

    if (!touristId) {
      return NextResponse.json({
        success: false,
        error: 'Tourist ID is required'
      }, { status: 400 });
    }

    console.log(`📊 Retrieving safety score for tourist ${touristId}`);

    // Mock current safety score data
    const currentScore = {
      tourist_id: touristId,
      composite_score: Math.floor(Math.random() * 40) + 60, // 60-100 range
      risk_level: 'low',
      last_calculated: new Date().toISOString(),
      components: {
        location_score: Math.floor(Math.random() * 30) + 70,
        behavior_score: Math.floor(Math.random() * 30) + 70,
        risk_score: Math.floor(Math.random() * 30) + 70,
        incident_score: Math.floor(Math.random() * 20) + 80
      },
      recommendations: [
        '✅ Continue following safety protocols',
        '📱 Maintain regular check-ins',
        '🗺️ Keep exploring safely'
      ]
    };

    const response: any = {
      success: true,
      data: {
        current_score: currentScore,
        score_trend: 'stable', // 'improving', 'declining', 'stable'
        percentile: Math.floor(Math.random() * 30) + 70, // Top 70-100 percentile
        last_updated: new Date().toISOString()
      }
    };

    if (includeHistory) {
      response.data.score_history = Array.from({ length: 7 }, (_, index) => ({
        date: new Date(Date.now() - index * 86400000).toISOString().split('T')[0],
        score: Math.floor(Math.random() * 30) + 60 + (7 - index) * 2, // Slightly improving trend
        risk_level: Math.random() > 0.8 ? 'medium' : 'low'
      })).reverse();
    }

    if (includeFactors) {
      response.data.detailed_factors = {
        location_factors: {
          gps_accuracy: 10,
          time_of_day: 5,
          safe_zone: 20
        },
        behavior_factors: {
          check_in_frequency: 8,
          route_adherence: 5,
          safety_feature_usage: 7
        },
        risk_factors: {
          weather: 0,
          crime_rate: 10,
          tourist_density: 5,
          group_size: 10
        },
        incident_factors: {
          incident_free_period: 15,
          resolved_incidents: 5
        }
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Safety score retrieval error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve safety score'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('📊 Calculating updated safety score...');
    
    // Parse and validate request
    const body = await request.json();
    const validatedData = safetyScoreUpdateSchema.parse(body);

    const { tourist_id, location_data, behavior_data, risk_factors, incident_history } = validatedData;

    // Calculate component scores
    console.log('🧮 Calculating component scores...');
    
    const locationScore = calculateLocationScore(location_data);
    const behaviorScore = calculateBehaviorScore(behavior_data);
    const riskScore = calculateRiskScore(risk_factors);
    const incidentScore = calculateIncidentScore(incident_history);

    // Calculate composite score
    const compositeResult = calculateCompositeSafetyScore(
      locationScore,
      behaviorScore,
      riskScore,
      incidentScore
    );

    // Create safety score record
    const safetyScoreRecord = {
      id: `SCORE-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
      tourist_id,
      calculation_timestamp: new Date().toISOString(),
      composite_score: compositeResult.composite_score,
      risk_level: compositeResult.risk_level,
      component_scores: {
        location: {
          score: locationScore.score,
          factors: locationScore.factors,
          weight: 25
        },
        behavior: {
          score: behaviorScore.score,
          factors: behaviorScore.factors,
          weight: 35
        },
        risk: {
          score: riskScore.score,
          factors: riskScore.factors,
          weight: 25
        },
        incident: {
          score: incidentScore.score,
          factors: incidentScore.factors,
          weight: 15
        }
      },
      weighted_scores: compositeResult.weighted_scores,
      recommendations: compositeResult.recommendations,
      input_data: {
        location_data,
        behavior_data,
        risk_factors,
        incident_history
      },
      calculation_method: 'weighted_composite_v1.0'
    };

    // Determine if alerts are needed
    const alerts = [];
    
    if (compositeResult.composite_score < 40) {
      alerts.push({
        type: 'critical_safety_score',
        severity: 'high',
        message: 'Safety score is critically low. Immediate action recommended.',
        actions: ['Contact emergency services', 'Move to safe location', 'Notify emergency contacts']
      });
    } else if (compositeResult.composite_score < 60) {
      alerts.push({
        type: 'low_safety_score',
        severity: 'medium',
        message: 'Safety score indicates elevated risk. Take precautions.',
        actions: ['Increase check-in frequency', 'Consider safer routes', 'Stay in groups']
      });
    }

    // Check for specific component alerts
    if (locationScore.score < 40) {
      alerts.push({
        type: 'location_risk',
        severity: 'medium',
        message: 'Current location has elevated risk factors',
        actions: ['Move to safer area', 'Share location with contacts']
      });
    }

    if (behaviorScore.score < 50) {
      alerts.push({
        type: 'behavior_alert',
        severity: 'low',
        message: 'Consider improving safety behaviors',
        actions: ['Increase check-ins', 'Use safety features more', 'Follow planned routes']
      });
    }

    // Generate insights
    const insights = [
      `Your safety score is ${compositeResult.composite_score}/100 (${compositeResult.risk_level} risk)`,
      `Strongest factor: ${Object.entries(compositeResult.weighted_scores).sort(([,a], [,b]) => (b as number) - (a as number))[0][0]}`,
      `${compositeResult.composite_score >= 70 ? 'You\'re following good safety practices!' : 'Consider following the recommendations to improve safety'}`
    ];

    console.log(`✅ Safety score calculated: ${compositeResult.composite_score}/100 (${compositeResult.risk_level} risk)`);

    return NextResponse.json({
      success: true,
      message: 'Safety score calculated successfully',
      data: {
        safety_score: {
          composite_score: compositeResult.composite_score,
          risk_level: compositeResult.risk_level,
          calculation_id: safetyScoreRecord.id,
          timestamp: safetyScoreRecord.calculation_timestamp
        },
        detailed_analysis: {
          component_scores: safetyScoreRecord.component_scores,
          weighted_contribution: compositeResult.weighted_scores,
          score_breakdown: {
            location: `${locationScore.score}/100`,
            behavior: `${behaviorScore.score}/100`,
            risk_factors: `${riskScore.score}/100`,
            incident_history: `${incidentScore.score}/100`
          }
        },
        recommendations: compositeResult.recommendations,
        alerts: alerts,
        insights: insights,
        score_changes: {
          compared_to_baseline: compositeResult.composite_score - 70, // Assuming 70 is baseline
          trend: compositeResult.composite_score >= 70 ? 'positive' : 'needs_improvement',
          percentile: Math.min(99, Math.max(1, Math.round((compositeResult.composite_score / 100) * 100)))
        },
        next_calculation: {
          recommended_interval: '30 minutes',
          next_update: new Date(Date.now() + 1800000).toISOString(), // 30 minutes
          factors_to_monitor: ['location_changes', 'check_in_status', 'time_of_day']
        }
      }
    });

  } catch (error) {
    console.error('❌ Safety score calculation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid safety score data',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to calculate safety score',
      message: 'Safety score calculation service unavailable'
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
