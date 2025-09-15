/**
 * Smart Tourist Safety System - Demo Seed Data
 * Comprehensive demo data for presentation and testing
 */

// ============================================================================
// DEMO USERS (for login)
// ============================================================================

export const demoUsers = [
  {
    id: 'user_admin_1',
    email: 'admin@touristsafety.gov.in',
    password: 'admin123',
    role: 'super_admin',
    name: 'Rajesh Kumar',
    displayName: 'Administrator',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    permissions: ['read', 'write', 'delete', 'admin', 'system_config'],
    department: 'Tourism Authority',
    location: 'New Delhi'
  },
  {
    id: 'user_operator_1',
    email: 'operator@touristsafety.gov.in',
    password: 'operator123',
    role: 'operator',
    name: 'Priya Sharma',
    displayName: 'Safety Operator',
    firstName: 'Priya',
    lastName: 'Sharma',
    permissions: ['read', 'write', 'respond'],
    department: 'Emergency Response',
    location: 'Mumbai'
  },
  {
    id: 'user_viewer_1',
    email: 'viewer@touristsafety.gov.in',
    password: 'viewer123',
    role: 'viewer',
    name: 'Amit Patel',
    displayName: 'Analytics Viewer',
    firstName: 'Amit',
    lastName: 'Patel',
    permissions: ['read'],
    department: 'Tourism Analytics',
    location: 'Bangalore'
  }
];

// ============================================================================
// DEMO TOURISTS
// ============================================================================

export const demoTourists = [
  {
    id: 'tourist_1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0123',
    nationality: 'United States',
    age: 28,
    gender: 'female',
    profilePicture: '/images/tourists/sarah.jpg',
    digitalId: 'DID:INDIA:1736956800:abc123',
    qrCode: 'QR_SARAH_2025_001',
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'India Gate, New Delhi',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    status: 'active',
    safetyScore: 92,
    emergencyContact: {
      name: 'John Johnson',
      phone: '+1-555-0124',
      relation: 'Spouse'
    },
    travelInfo: {
      arrivalDate: '2025-01-10',
      departureDate: '2025-01-20',
      visa: 'Tourist Visa',
      purpose: 'Tourism'
    },
    lastSeen: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 'tourist_2',
    name: 'Hans Mueller',
    email: 'hans.mueller@email.de',
    phone: '+49-30-12345678',
    nationality: 'Germany',
    age: 45,
    gender: 'male',
    profilePicture: '/images/tourists/hans.jpg',
    digitalId: 'DID:INDIA:1736956801:def456',
    qrCode: 'QR_HANS_2025_002',
    location: {
      latitude: 27.1751,
      longitude: 78.0421,
      address: 'Taj Mahal, Agra',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
    },
    status: 'active',
    safetyScore: 87,
    emergencyContact: {
      name: 'Anna Mueller',
      phone: '+49-30-12345679',
      relation: 'Wife'
    },
    travelInfo: {
      arrivalDate: '2025-01-08',
      departureDate: '2025-01-22',
      visa: 'Tourist Visa',
      purpose: 'Cultural Tourism'
    },
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tourist_3',
    name: 'Yuki Tanaka',
    email: 'yuki.tanaka@email.jp',
    phone: '+81-3-1234-5678',
    nationality: 'Japan',
    age: 32,
    gender: 'female',
    profilePicture: '/images/tourists/yuki.jpg',
    digitalId: 'DID:INDIA:1736956802:ghi789',
    qrCode: 'QR_YUKI_2025_003',
    location: {
      latitude: 26.9124,
      longitude: 75.7873,
      address: 'Amber Fort, Jaipur',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
    },
    status: 'alert',
    safetyScore: 75,
    emergencyContact: {
      name: 'Hiroshi Tanaka',
      phone: '+81-3-1234-5679',
      relation: 'Brother'
    },
    travelInfo: {
      arrivalDate: '2025-01-12',
      departureDate: '2025-01-18',
      visa: 'Tourist Visa',
      purpose: 'Photography'
    },
    lastSeen: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  }
];

// ============================================================================
// DEMO ALERTS
// ============================================================================

export const demoAlerts = [
  {
    id: 'alert_1',
    type: 'medical_emergency',
    title: 'Tourist Medical Emergency',
    description: 'Female tourist collapsed at Amber Fort. Ambulance dispatched.',
    priority: 'critical',
    status: 'active',
    touristId: 'tourist_3',
    touristName: 'Yuki Tanaka',
    location: {
      latitude: 26.9124,
      longitude: 75.7873,
      address: 'Amber Fort, Jaipur'
    },
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    assignedTo: 'Emergency Team Alpha',
    estimatedResponseTime: '15 minutes'
  },
  {
    id: 'alert_2',
    type: 'weather',
    title: 'Heavy Rain Warning',
    description: 'Heavy rainfall expected in Delhi region. Tourists advised to stay indoors.',
    priority: 'medium',
    status: 'active',
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'Delhi NCR'
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    affectedTourists: 156
  },
  {
    id: 'alert_3',
    type: 'security',
    title: 'Security Checkpoint Alert',
    description: 'Increased security measures at Red Fort due to VIP visit.',
    priority: 'low',
    status: 'resolved',
    location: {
      latitude: 28.6562,
      longitude: 77.2410,
      address: 'Red Fort, Delhi'
    },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  }
];

// ============================================================================
// DEMO ZONES
// ============================================================================

export const demoZones = [
  {
    id: 'zone_1',
    name: 'Taj Mahal Complex',
    type: 'heritage_site',
    status: 'active',
    capacity: 1000,
    currentCount: 847,
    coordinates: {
      latitude: 27.1751,
      longitude: 78.0421,
      radius: 500
    },
    safetyLevel: 'high',
    amenities: ['first_aid', 'security', 'wifi', 'restrooms'],
    lastUpdated: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'zone_2',
    name: 'India Gate Area',
    type: 'monument',
    status: 'active',
    capacity: 2000,
    currentCount: 1234,
    coordinates: {
      latitude: 28.6129,
      longitude: 77.2295,
      radius: 300
    },
    safetyLevel: 'medium',
    amenities: ['security', 'lighting', 'parking'],
    lastUpdated: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: 'zone_3',
    name: 'Amber Fort',
    type: 'fort',
    status: 'alert',
    capacity: 800,
    currentCount: 756,
    coordinates: {
      latitude: 26.9855,
      longitude: 75.8513,
      radius: 400
    },
    safetyLevel: 'low',
    amenities: ['first_aid', 'security', 'emergency_exit'],
    lastUpdated: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    alertReason: 'Medical emergency in progress'
  }
];

// ============================================================================
// RECENT ACTIVITIES
// ============================================================================

export const demoRecentActivities = [
  {
    id: 'activity_1',
    type: 'emergency_alert',
    title: 'Emergency Alert Created',
    description: 'Medical emergency reported at Amber Fort for tourist Yuki Tanaka',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    severity: 'high',
    location: 'Amber Fort, Jaipur',
    user: 'Emergency System'
  },
  {
    id: 'activity_2',
    type: 'tourist_registration',
    title: 'New Tourist Registered',
    description: 'Sarah Johnson from United States completed digital ID verification',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    severity: 'low',
    location: 'Delhi Airport',
    user: 'Registration System'
  },
  {
    id: 'activity_3',
    type: 'zone_monitoring',
    title: 'Zone Capacity Alert',
    description: 'Taj Mahal zone approaching 80% capacity (800/1000)',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    severity: 'medium',
    location: 'Taj Mahal, Agra',
    user: 'Automated Monitoring'
  },
  {
    id: 'activity_4',
    type: 'blockchain_verification',
    title: 'Digital ID Verified',
    description: 'Hans Mueller\'s blockchain identity verified at heritage site',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    severity: 'low',
    location: 'Taj Mahal, Agra',
    user: 'QR Scanner System'
  },
  {
    id: 'activity_5',
    type: 'ai_detection',
    title: 'AI Anomaly Detected',
    description: 'Unusual movement pattern detected for tourist group',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    severity: 'medium',
    location: 'Red Fort, Delhi',
    user: 'AI Monitoring System'
  }
];

// ============================================================================
// DASHBOARD STATISTICS
// ============================================================================

export const demoDashboardStats = {
  totalTourists: 1247,
  activeTourists: 892,
  totalAlerts: 23,
  activeAlerts: 8,
  criticalAlerts: 2,
  safetyScoreAverage: 87.3,
  riskZones: 12,
  emergencyIncidents: 1,
  totalZones: 45,
  activeZones: 42,
  highRiskZones: 3,
  blockchainVerifications: 8432,
  responseTimeAverage: 4.2, // minutes
  systemHealth: 'optimal',
  lastUpdated: new Date().toISOString()
};