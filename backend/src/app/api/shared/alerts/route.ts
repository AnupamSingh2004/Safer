/**
 * Smart Tourist Safety System - Alert Management API Routes
 * Handles CRUD operations for alerts and emergency notifications
 */

import { NextRequest, NextResponse } from 'next/server';

// Alert interfaces
interface Alert {
  id: string;
  type: 'emergency' | 'geofence' | 'anomaly' | 'manual' | 'system';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  title: string;
  description: string;
  touristId?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  zoneId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  escalatedAt?: string;
  escalationLevel: number;
  metadata?: {
    [key: string]: any;
  };
  responses?: AlertResponse[];
}

interface AlertResponse {
  id: string;
  alertId: string;
  responderId: string;
  responderName: string;
  responseType: 'acknowledgment' | 'status_update' | 'comment' | 'resolution';
  message: string;
  timestamp: string;
  metadata?: {
    [key: string]: any;
  };
}

// Mock alert database
let mockAlerts: Alert[] = [
  {
    id: 'alert_001',
    type: 'emergency',
    priority: 'critical',
    status: 'active',
    title: 'Tourist Emergency Signal',
    description: 'Emergency button pressed by tourist Hiroshi Tanaka at Umiam Lake',
    touristId: 'tourist_3',
    location: {
      latitude: 25.2654,
      longitude: 91.7289,
      address: 'Umiam Lake, Meghalaya'
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    createdBy: 'system',
    assignedTo: 'operator_002',
    escalationLevel: 1,
    metadata: {
      panicButtonPressed: true,
      deviceId: 'device_123',
      batteryLevel: 45
    }
  },
  {
    id: 'alert_002',
    type: 'geofence',
    priority: 'high',
    status: 'acknowledged',
    title: 'Restricted Zone Entry',
    description: 'Tourist Sarah Johnson entered restricted forest area',
    touristId: 'tourist_2',
    location: {
      latitude: 25.2867,
      longitude: 91.7362,
      address: 'Restricted Forest Area, Shillong'
    },
    zoneId: 'zone_restricted_001',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system',
    assignedTo: 'operator_001',
    acknowledgedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    acknowledgedBy: 'operator_001',
    escalationLevel: 0,
    metadata: {
      zoneType: 'restricted',
      entryTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    id: 'alert_003',
    type: 'anomaly',
    priority: 'medium',
    status: 'resolved',
    title: 'Prolonged Inactivity',
    description: 'Tourist Rahul Sharma has been inactive for 12 hours',
    touristId: 'tourist_1',
    location: {
      latitude: 25.2744,
      longitude: 91.7322,
      address: 'Shillong, Meghalaya'
    },
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    createdBy: 'system',
    assignedTo: 'operator_001',
    acknowledgedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
    acknowledgedBy: 'operator_001',
    resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    resolvedBy: 'operator_001',
    escalationLevel: 0,
    metadata: {
      inactivityDuration: 12,
      lastKnownActivity: 'check_in',
      autoResolved: false
    }
  }
];

// Mock responses
let mockResponses: AlertResponse[] = [
  {
    id: 'response_001',
    alertId: 'alert_002',
    responderId: 'operator_001',
    responderName: 'Safety Operator',
    responseType: 'acknowledgment',
    message: 'Alert acknowledged. Dispatching local patrol to the area.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'response_002',
    alertId: 'alert_003',
    responderId: 'operator_001',
    responderName: 'Safety Operator',
    responseType: 'resolution',
    message: 'Tourist contacted via phone. False alarm - tourist was resting at hotel.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  }
];

// Query parameters interface
interface AlertQuery {
  page?: string;
  limit?: string;
  type?: string;
  priority?: string;
  status?: string;
  touristId?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Utility functions
const generateAlertId = (): string => {
  return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateResponseId = (): string => {
  return `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Validation functions
const validateAlertData = (data: any): boolean => {
  return (
    data &&
    typeof data.type === 'string' &&
    typeof data.priority === 'string' &&
    typeof data.title === 'string' &&
    typeof data.description === 'string' &&
    ['emergency', 'geofence', 'anomaly', 'manual', 'system'].includes(data.type) &&
    ['low', 'medium', 'high', 'critical'].includes(data.priority)
  );
};

// Filtering and pagination
const filterAlerts = (alerts: Alert[], query: AlertQuery): Alert[] => {
  let filtered = [...alerts];
  
  if (query.type) {
    filtered = filtered.filter(a => a.type === query.type);
  }
  
  if (query.priority) {
    filtered = filtered.filter(a => a.priority === query.priority);
  }
  
  if (query.status) {
    filtered = filtered.filter(a => a.status === query.status);
  }
  
  if (query.touristId) {
    filtered = filtered.filter(a => a.touristId === query.touristId);
  }
  
  if (query.assignedTo) {
    filtered = filtered.filter(a => a.assignedTo === query.assignedTo);
  }
  
  if (query.dateFrom) {
    const fromDate = new Date(query.dateFrom);
    filtered = filtered.filter(a => new Date(a.createdAt) >= fromDate);
  }
  
  if (query.dateTo) {
    const toDate = new Date(query.dateTo);
    filtered = filtered.filter(a => new Date(a.createdAt) <= toDate);
  }
  
  if (query.search) {
    const searchTerm = query.search.toLowerCase();
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(searchTerm) ||
      a.description.toLowerCase().includes(searchTerm) ||
      a.id.toLowerCase().includes(searchTerm)
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
      
      return (new Date(aVal).getTime() - new Date(bVal).getTime()) * sortOrder;
    });
  } else {
    // Default sort by priority and creation time
    filtered.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder];
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
  
  return filtered;
};

const paginateAlerts = (alerts: Alert[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: alerts.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(alerts.length / limit),
      totalItems: alerts.length,
      itemsPerPage: limit
    }
  };
};

// GET - List alerts with pagination and filtering
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const query: AlertQuery = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      type: searchParams.get('type') || undefined,
      priority: searchParams.get('priority') || undefined,
      status: searchParams.get('status') || undefined,
      touristId: searchParams.get('touristId') || undefined,
      assignedTo: searchParams.get('assignedTo') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
    };

    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '10'), 100);

    // Filter alerts
    const filteredAlerts = filterAlerts(mockAlerts, query);
    
    // Add responses to alerts
    const alertsWithResponses = filteredAlerts.map(alert => ({
      ...alert,
      responses: mockResponses.filter(r => r.alertId === alert.id)
    }));
    
    // Paginate results
    const result = paginateAlerts(alertsWithResponses, page, limit);

    // Calculate statistics
    const statistics = {
      total: mockAlerts.length,
      active: mockAlerts.filter(a => a.status === 'active').length,
      critical: mockAlerts.filter(a => a.priority === 'critical').length,
      acknowledged: mockAlerts.filter(a => a.status === 'acknowledged').length,
      resolved: mockAlerts.filter(a => a.status === 'resolved').length,
      averageResponseTime: '15 minutes' // Mock value
    };

    return NextResponse.json({
      success: true,
      message: 'Alerts retrieved successfully',
      data: result.data,
      pagination: result.pagination,
      statistics,
      filters: {
        types: ['emergency', 'geofence', 'anomaly', 'manual', 'system'],
        priorities: ['low', 'medium', 'high', 'critical'],
        statuses: ['active', 'acknowledged', 'resolved', 'dismissed']
      }
    });

  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching alerts'
      },
      { status: 500 }
    );
  }
}

// POST - Create new alert
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    if (!validateAlertData(body)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid alert data. Required fields: type, priority, title, description'
        },
        { status: 400 }
      );
    }

    const newAlert: Alert = {
      id: generateAlertId(),
      type: body.type,
      priority: body.priority,
      status: body.status || 'active',
      title: body.title,
      description: body.description,
      touristId: body.touristId || undefined,
      location: body.location || undefined,
      zoneId: body.zoneId || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: body.createdBy || 'system',
      assignedTo: body.assignedTo || undefined,
      escalationLevel: 0,
      metadata: body.metadata || {}
    };

    mockAlerts.unshift(newAlert); // Add to beginning for latest first

    // Auto-assignment based on priority
    if (!newAlert.assignedTo && newAlert.priority === 'critical') {
      newAlert.assignedTo = 'operator_emergency';
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Alert created successfully',
        data: newAlert
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error creating alert'
      },
      { status: 500 }
    );
  }
}

// PUT - Bulk operations
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { operation, alertIds, data } = body;

    if (!operation || !alertIds || !Array.isArray(alertIds)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid bulk operation data'
        },
        { status: 400 }
      );
    }

    let updatedCount = 0;

    switch (operation) {
      case 'acknowledge':
        mockAlerts.forEach(alert => {
          if (alertIds.includes(alert.id) && alert.status === 'active') {
            alert.status = 'acknowledged';
            alert.acknowledgedAt = new Date().toISOString();
            alert.acknowledgedBy = data.acknowledgedBy || 'unknown';
            alert.updatedAt = new Date().toISOString();
            
            if (data.assignedTo) {
              alert.assignedTo = data.assignedTo;
            }
            
            updatedCount++;
          }
        });
        break;

      case 'resolve':
        mockAlerts.forEach(alert => {
          if (alertIds.includes(alert.id) && ['active', 'acknowledged'].includes(alert.status)) {
            alert.status = 'resolved';
            alert.resolvedAt = new Date().toISOString();
            alert.resolvedBy = data.resolvedBy || 'unknown';
            alert.updatedAt = new Date().toISOString();
            updatedCount++;
          }
        });
        break;

      case 'dismiss':
        mockAlerts.forEach(alert => {
          if (alertIds.includes(alert.id) && alert.status !== 'resolved') {
            alert.status = 'dismissed';
            alert.updatedAt = new Date().toISOString();
            updatedCount++;
          }
        });
        break;

      case 'assign':
        if (!data.assignedTo) {
          return NextResponse.json(
            {
              success: false,
              message: 'assignedTo is required for assignment operation'
            },
            { status: 400 }
          );
        }

        mockAlerts.forEach(alert => {
          if (alertIds.includes(alert.id)) {
            alert.assignedTo = data.assignedTo;
            alert.updatedAt = new Date().toISOString();
            updatedCount++;
          }
        });
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid operation'
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Bulk ${operation} completed successfully`,
      data: {
        operation,
        updatedCount,
        requestedCount: alertIds.length
      }
    });

  } catch (error) {
    console.error('Error in bulk operation:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error in bulk operation'
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
