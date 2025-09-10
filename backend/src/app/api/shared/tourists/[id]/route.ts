/**
 * Smart Tourist Safety System - Individual Tourist API Routes
 * Handles operations for specific tourist by ID
 */

import { NextRequest, NextResponse } from 'next/server';

// Tourist interface (matching the main route)
interface Tourist {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  status: 'active' | 'inactive' | 'emergency' | 'checked_out';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  currentLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
    timestamp: string;
  };
  safetyScore: number;
  lastCheckIn: string;
  activeAlerts: number;
  registrationDate: string;
  documentId?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Mock tourist database (shared with main route)
let mockTourists: Tourist[] = [
  {
    id: 'tourist_1',
    firstName: 'Rahul',
    lastName: 'Sharma',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91-9876543210',
    nationality: 'Indian',
    status: 'active',
    verificationStatus: 'verified',
    currentLocation: {
      latitude: 25.2744,
      longitude: 91.7322,
      address: 'Shillong, Meghalaya',
      timestamp: new Date().toISOString()
    },
    safetyScore: 85,
    lastCheckIn: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    activeAlerts: 0,
    registrationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    documentId: 'DOC123456789',
    emergencyContact: {
      name: 'Priya Sharma',
      phone: '+91-9876543211',
      relationship: 'Spouse'
    }
  },
  {
    id: 'tourist_2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-123-4567',
    nationality: 'American',
    status: 'inactive',
    verificationStatus: 'pending',
    currentLocation: {
      latitude: 25.2867,
      longitude: 91.7362,
      address: 'Police Bazar, Shillong',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    safetyScore: 65,
    lastCheckIn: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    activeAlerts: 1,
    registrationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'tourist_3',
    firstName: 'Hiroshi',
    lastName: 'Tanaka',
    fullName: 'Hiroshi Tanaka',
    email: 'hiroshi.tanaka@email.com',
    phone: '+81-90-1234-5678',
    nationality: 'Japanese',
    status: 'emergency',
    verificationStatus: 'verified',
    currentLocation: {
      latitude: 25.2654,
      longitude: 91.7289,
      address: 'Umiam Lake, Meghalaya',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    safetyScore: 25,
    lastCheckIn: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    activeAlerts: 3,
    registrationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    emergencyContact: {
      name: 'Yuki Tanaka',
      phone: '+81-90-8765-4321',
      relationship: 'Spouse'
    }
  }
];

// Utility functions
const calculateSafetyScore = (tourist: Tourist): number => {
  let score = 100;
  
  if (tourist.activeAlerts > 0) score -= tourist.activeAlerts * 20;
  if (tourist.status === 'emergency') score -= 50;
  if (tourist.status === 'inactive') score -= 20;
  if (tourist.verificationStatus !== 'verified') score -= 30;
  
  const lastCheckIn = new Date(tourist.lastCheckIn);
  const hoursSinceLastCheckIn = (Date.now() - lastCheckIn.getTime()) / (1000 * 60 * 60);
  if (hoursSinceLastCheckIn > 24) score -= 30;
  else if (hoursSinceLastCheckIn > 12) score -= 15;
  else if (hoursSinceLastCheckIn > 6) score -= 5;
  
  return Math.max(0, Math.min(100, score));
};

const validateLocationUpdate = (data: any): boolean => {
  return (
    data &&
    typeof data.latitude === 'number' &&
    typeof data.longitude === 'number' &&
    data.latitude >= -90 && data.latitude <= 90 &&
    data.longitude >= -180 && data.longitude <= 180
  );
};

// GET - Get specific tourist by ID
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
          message: 'Tourist ID is required'
        },
        { status: 400 }
      );
    }

    const tourist = mockTourists.find(t => t.id === id);

    if (!tourist) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tourist not found'
        },
        { status: 404 }
      );
    }

    // Include additional details for individual view
    const touristDetails = {
      ...tourist,
      locationHistory: [
        {
          latitude: tourist.currentLocation?.latitude || 0,
          longitude: tourist.currentLocation?.longitude || 0,
          timestamp: tourist.currentLocation?.timestamp || new Date().toISOString(),
          address: tourist.currentLocation?.address || 'Unknown'
        }
      ],
      checkInHistory: [
        {
          timestamp: tourist.lastCheckIn,
          location: tourist.currentLocation?.address || 'Unknown',
          type: 'automatic'
        }
      ],
      alerts: [] // Would be populated from alerts API
    };

    return NextResponse.json({
      success: true,
      message: 'Tourist details retrieved successfully',
      data: touristDetails
    });

  } catch (error) {
    console.error('Error fetching tourist:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching tourist details'
      },
      { status: 500 }
    );
  }
}

// PUT - Update tourist information
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
          message: 'Tourist ID is required'
        },
        { status: 400 }
      );
    }

    const touristIndex = mockTourists.findIndex(t => t.id === id);

    if (touristIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tourist not found'
        },
        { status: 404 }
      );
    }

    const tourist = mockTourists[touristIndex];
    const updateType = body.updateType || 'general';

    switch (updateType) {
      case 'location':
        if (!validateLocationUpdate(body.location)) {
          return NextResponse.json(
            {
              success: false,
              message: 'Invalid location data'
            },
            { status: 400 }
          );
        }

        tourist.currentLocation = {
          latitude: body.location.latitude,
          longitude: body.location.longitude,
          address: body.location.address || 'Unknown',
          timestamp: new Date().toISOString()
        };
        tourist.lastCheckIn = new Date().toISOString();
        tourist.safetyScore = calculateSafetyScore(tourist);
        break;

      case 'status':
        if (!body.status || !['active', 'inactive', 'emergency', 'checked_out'].includes(body.status)) {
          return NextResponse.json(
            {
              success: false,
              message: 'Invalid status value'
            },
            { status: 400 }
          );
        }

        tourist.status = body.status;
        tourist.safetyScore = calculateSafetyScore(tourist);
        break;

      case 'verification':
        if (!body.verificationStatus || !['pending', 'verified', 'rejected'].includes(body.verificationStatus)) {
          return NextResponse.json(
            {
              success: false,
              message: 'Invalid verification status'
            },
            { status: 400 }
          );
        }

        tourist.verificationStatus = body.verificationStatus;
        tourist.safetyScore = calculateSafetyScore(tourist);
        break;

      case 'checkin':
        tourist.lastCheckIn = new Date().toISOString();
        if (body.location && validateLocationUpdate(body.location)) {
          tourist.currentLocation = {
            latitude: body.location.latitude,
            longitude: body.location.longitude,
            address: body.location.address || tourist.currentLocation?.address || 'Unknown',
            timestamp: new Date().toISOString()
          };
        }
        tourist.safetyScore = calculateSafetyScore(tourist);
        break;

      case 'general':
      default:
        // Update basic information
        if (body.firstName) tourist.firstName = body.firstName;
        if (body.lastName) tourist.lastName = body.lastName;
        if (body.firstName || body.lastName) {
          tourist.fullName = `${tourist.firstName} ${tourist.lastName}`;
        }
        if (body.email) tourist.email = body.email;
        if (body.phone) tourist.phone = body.phone;
        if (body.nationality) tourist.nationality = body.nationality;
        if (body.emergencyContact) tourist.emergencyContact = body.emergencyContact;
        if (body.documentId) tourist.documentId = body.documentId;
        break;
    }

    mockTourists[touristIndex] = tourist;

    return NextResponse.json({
      success: true,
      message: `Tourist ${updateType} updated successfully`,
      data: tourist
    });

  } catch (error) {
    console.error('Error updating tourist:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error updating tourist'
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove tourist
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
          message: 'Tourist ID is required'
        },
        { status: 400 }
      );
    }

    const touristIndex = mockTourists.findIndex(t => t.id === id);

    if (touristIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tourist not found'
        },
        { status: 404 }
      );
    }

    const deletedTourist = mockTourists.splice(touristIndex, 1)[0];

    return NextResponse.json({
      success: true,
      message: 'Tourist deleted successfully',
      data: {
        id: deletedTourist.id,
        name: deletedTourist.fullName,
        email: deletedTourist.email
      }
    });

  } catch (error) {
    console.error('Error deleting tourist:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting tourist'
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
