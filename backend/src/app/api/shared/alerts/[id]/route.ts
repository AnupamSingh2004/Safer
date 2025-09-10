/**
 * Smart Tourist Safety System - Individual Alert API Routes
 * Handles operations for specific alert by ID
 */

import { NextRequest, NextResponse } from 'next/server';

// Alert interfaces (matching main route)
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

// Mock alert database (shared with main route)
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
  }
];

// Utility functions
const generateResponseId = (): string => {
  return `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// GET - Get specific alert by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Alert ID is required'
        },
        { status: 400 }
      );
    }

    const alert = mockAlerts.find(a => a.id === id);

    if (!alert) {
      return NextResponse.json(
        {
          success: false,
          message: 'Alert not found'
        },
        { status: 404 }
      );
    }

    // Include responses
    const alertWithResponses = {
      ...alert,
      responses: mockResponses.filter(r => r.alertId === alert.id)
    };

    return NextResponse.json({
      success: true,
      message: 'Alert details retrieved successfully',
      data: alertWithResponses
    });

  } catch (error) {
    console.error('Error fetching alert:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching alert details'
      },
      { status: 500 }
    );
  }
}

// PUT - Update alert status and add responses
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Alert ID is required'
        },
        { status: 400 }
      );
    }

    const alertIndex = mockAlerts.findIndex(a => a.id === id);

    if (alertIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Alert not found'
        },
        { status: 404 }
      );
    }

    const alert = mockAlerts[alertIndex];
    const actionType = body.action || 'update';

    switch (actionType) {
      case 'acknowledge':
        if (alert.status !== 'active') {
          return NextResponse.json(
            {
              success: false,
              message: 'Only active alerts can be acknowledged'
            },
            { status: 400 }
          );
        }

        alert.status = 'acknowledged';
        alert.acknowledgedAt = new Date().toISOString();
        alert.acknowledgedBy = body.acknowledgedBy || 'unknown';
        alert.updatedAt = new Date().toISOString();

        if (body.assignedTo) {
          alert.assignedTo = body.assignedTo;
        }

        // Add response
        if (body.message) {
          const response: AlertResponse = {
            id: generateResponseId(),
            alertId: alert.id,
            responderId: body.acknowledgedBy || 'unknown',
            responderName: body.responderName || 'Unknown Operator',
            responseType: 'acknowledgment',
            message: body.message,
            timestamp: new Date().toISOString()
          };
          mockResponses.push(response);
        }
        break;

      case 'resolve':
        if (!['active', 'acknowledged'].includes(alert.status)) {
          return NextResponse.json(
            {
              success: false,
              message: 'Only active or acknowledged alerts can be resolved'
            },
            { status: 400 }
          );
        }

        alert.status = 'resolved';
        alert.resolvedAt = new Date().toISOString();
        alert.resolvedBy = body.resolvedBy || 'unknown';
        alert.updatedAt = new Date().toISOString();

        // Add response
        if (body.message) {
          const response: AlertResponse = {
            id: generateResponseId(),
            alertId: alert.id,
            responderId: body.resolvedBy || 'unknown',
            responderName: body.responderName || 'Unknown Operator',
            responseType: 'resolution',
            message: body.message,
            timestamp: new Date().toISOString()
          };
          mockResponses.push(response);
        }
        break;

      case 'escalate':
        alert.escalationLevel += 1;
        alert.escalatedAt = new Date().toISOString();
        alert.updatedAt = new Date().toISOString();

        // Increase priority if possible
        const priorityLevels = ['low', 'medium', 'high', 'critical'];
        const currentIndex = priorityLevels.indexOf(alert.priority);
        if (currentIndex < priorityLevels.length - 1) {
          alert.priority = priorityLevels[currentIndex + 1] as any;
        }

        // Add response
        const escalationResponse: AlertResponse = {
          id: generateResponseId(),
          alertId: alert.id,
          responderId: body.escalatedBy || 'system',
          responderName: body.responderName || 'System',
          responseType: 'status_update',
          message: body.message || `Alert escalated to level ${alert.escalationLevel}`,
          timestamp: new Date().toISOString(),
          metadata: {
            escalationLevel: alert.escalationLevel,
            oldPriority: priorityLevels[currentIndex],
            newPriority: alert.priority
          }
        };
        mockResponses.push(escalationResponse);
        break;

      case 'assign':
        if (!body.assignedTo) {
          return NextResponse.json(
            {
              success: false,
              message: 'assignedTo is required for assignment'
            },
            { status: 400 }
          );
        }

        const previousAssignee = alert.assignedTo;
        alert.assignedTo = body.assignedTo;
        alert.updatedAt = new Date().toISOString();

        // Add response
        const assignmentResponse: AlertResponse = {
          id: generateResponseId(),
          alertId: alert.id,
          responderId: body.assignedBy || 'system',
          responderName: body.responderName || 'System',
          responseType: 'status_update',
          message: body.message || `Alert assigned from ${previousAssignee || 'unassigned'} to ${body.assignedTo}`,
          timestamp: new Date().toISOString(),
          metadata: {
            previousAssignee,
            newAssignee: body.assignedTo
          }
        };
        mockResponses.push(assignmentResponse);
        break;

      case 'add_comment':
        if (!body.message) {
          return NextResponse.json(
            {
              success: false,
              message: 'Message is required for comments'
            },
            { status: 400 }
          );
        }

        alert.updatedAt = new Date().toISOString();

        // Add comment response
        const commentResponse: AlertResponse = {
          id: generateResponseId(),
          alertId: alert.id,
          responderId: body.commentBy || 'unknown',
          responderName: body.responderName || 'Unknown User',
          responseType: 'comment',
          message: body.message,
          timestamp: new Date().toISOString()
        };
        mockResponses.push(commentResponse);
        break;

      case 'update':
      default:
        // General update
        if (body.status && ['active', 'acknowledged', 'resolved', 'dismissed'].includes(body.status)) {
          alert.status = body.status;
        }
        if (body.priority && ['low', 'medium', 'high', 'critical'].includes(body.priority)) {
          alert.priority = body.priority;
        }
        if (body.assignedTo) {
          alert.assignedTo = body.assignedTo;
        }
        if (body.title) {
          alert.title = body.title;
        }
        if (body.description) {
          alert.description = body.description;
        }
        if (body.metadata) {
          alert.metadata = { ...alert.metadata, ...body.metadata };
        }

        alert.updatedAt = new Date().toISOString();
        break;
    }

    mockAlerts[alertIndex] = alert;

    // Return alert with responses
    const alertWithResponses = {
      ...alert,
      responses: mockResponses.filter(r => r.alertId === alert.id)
    };

    return NextResponse.json({
      success: true,
      message: `Alert ${actionType} completed successfully`,
      data: alertWithResponses
    });

  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error updating alert'
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove alert
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Alert ID is required'
        },
        { status: 400 }
      );
    }

    const alertIndex = mockAlerts.findIndex(a => a.id === id);

    if (alertIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Alert not found'
        },
        { status: 404 }
      );
    }

    const deletedAlert = mockAlerts.splice(alertIndex, 1)[0];

    // Also remove associated responses
    mockResponses = mockResponses.filter(r => r.alertId !== id);

    return NextResponse.json({
      success: true,
      message: 'Alert deleted successfully',
      data: {
        id: deletedAlert.id,
        title: deletedAlert.title,
        type: deletedAlert.type
      }
    });

  } catch (error) {
    console.error('Error deleting alert:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting alert'
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
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
