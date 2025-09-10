/**
 * Smart Tourist Safety System - Tourist Management API Routes
 * Handles CRUD operations for tourist data and location tracking
 */

import { NextRequest, NextResponse } from 'next/server';

// Tourist interface (simplified for prototype)
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

// Mock tourist database
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

// Query parameters interface
interface TouristQuery {
  page?: string;
  limit?: string;
  status?: string;
  verificationStatus?: string;
  nationality?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Validation functions
const validateTouristData = (data: any): data is Partial<Tourist> => {
  if (!data || typeof data !== 'object') return false;
  
  // Validate required fields for creation
  if (data.firstName && typeof data.firstName !== 'string') return false;
  if (data.lastName && typeof data.lastName !== 'string') return false;
  if (data.email && typeof data.email !== 'string') return false;
  if (data.phone && typeof data.phone !== 'string') return false;
  if (data.nationality && typeof data.nationality !== 'string') return false;
  
  return true;
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

// Utility functions
const generateTouristId = (): string => {
  return `tourist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const calculateSafetyScore = (tourist: Tourist): number => {
  let score = 100;
  
  // Deduct points based on various factors
  if (tourist.activeAlerts > 0) score -= tourist.activeAlerts * 20;
  if (tourist.status === 'emergency') score -= 50;
  if (tourist.status === 'inactive') score -= 20;
  if (tourist.verificationStatus !== 'verified') score -= 30;
  
  // Check last activity
  const lastCheckIn = new Date(tourist.lastCheckIn);
  const hoursSinceLastCheckIn = (Date.now() - lastCheckIn.getTime()) / (1000 * 60 * 60);
  if (hoursSinceLastCheckIn > 24) score -= 30;
  else if (hoursSinceLastCheckIn > 12) score -= 15;
  else if (hoursSinceLastCheckIn > 6) score -= 5;
  
  return Math.max(0, Math.min(100, score));
};

// Filtering and pagination
const filterTourists = (tourists: Tourist[], query: TouristQuery): Tourist[] => {
  let filtered = [...tourists];
  
  // Status filter
  if (query.status) {
    filtered = filtered.filter(t => t.status === query.status);
  }
  
  // Verification status filter
  if (query.verificationStatus) {
    filtered = filtered.filter(t => t.verificationStatus === query.verificationStatus);
  }
  
  // Nationality filter
  if (query.nationality) {
    filtered = filtered.filter(t => 
      t.nationality.toLowerCase().includes(query.nationality!.toLowerCase())
    );
  }
  
  // Search filter
  if (query.search) {
    const searchTerm = query.search.toLowerCase();
    filtered = filtered.filter(t =>
      t.fullName.toLowerCase().includes(searchTerm) ||
      t.email.toLowerCase().includes(searchTerm) ||
      t.phone.includes(searchTerm) ||
      t.id.toLowerCase().includes(searchTerm)
    );
  }
  
  // Sorting
  if (query.sortBy) {
    const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
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

const paginateTourists = (tourists: Tourist[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: tourists.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(tourists.length / limit),
      totalItems: tourists.length,
      itemsPerPage: limit
    }
  };
};

// GET - List tourists with pagination and filtering
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const query: TouristQuery = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      status: searchParams.get('status') || undefined,
      verificationStatus: searchParams.get('verificationStatus') || undefined,
      nationality: searchParams.get('nationality') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') || 'lastCheckIn',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
    };

    const page = parseInt(query.page || '1');
    const limit = Math.min(parseInt(query.limit || '10'), 100); // Max 100 items per page

    // Filter tourists
    const filteredTourists = filterTourists(mockTourists, query);
    
    // Paginate results
    const result = paginateTourists(filteredTourists, page, limit);

    // Calculate statistics
    const statistics = {
      total: mockTourists.length,
      active: mockTourists.filter(t => t.status === 'active').length,
      verified: mockTourists.filter(t => t.verificationStatus === 'verified').length,
      withAlerts: mockTourists.filter(t => t.activeAlerts > 0).length,
      averageSafetyScore: Math.round(
        mockTourists.reduce((sum, t) => sum + t.safetyScore, 0) / mockTourists.length
      )
    };

    return NextResponse.json({
      success: true,
      message: 'Tourists retrieved successfully',
      data: result.data,
      pagination: result.pagination,
      statistics,
      filters: {
        statuses: ['active', 'inactive', 'emergency', 'checked_out'],
        verificationStatuses: ['pending', 'verified', 'rejected'],
        nationalities: [...new Set(mockTourists.map(t => t.nationality))]
      }
    });

  } catch (error) {
    console.error('Error fetching tourists:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching tourists'
      },
      { status: 500 }
    );
  }
}

// POST - Create new tourist
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Enhanced validation for required fields
    if (!body.firstName || !body.lastName || !body.email || !body.phone || !body.nationality) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: firstName, lastName, email, phone, nationality'
        },
        { status: 400 }
      );
    }

    if (!validateTouristData(body)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid tourist data format'
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingTourist = mockTourists.find(t => t.email === body.email);
    if (existingTourist) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tourist with this email already exists'
        },
        { status: 409 }
      );
    }

    const newTourist: Tourist = {
      id: generateTouristId(),
      firstName: body.firstName,
      lastName: body.lastName,
      fullName: `${body.firstName} ${body.lastName}`,
      email: body.email,
      phone: body.phone,
      nationality: body.nationality,
      status: body.status || 'inactive',
      verificationStatus: body.verificationStatus || 'pending',
      currentLocation: body.currentLocation || undefined,
      safetyScore: 0,
      lastCheckIn: new Date().toISOString(),
      activeAlerts: 0,
      registrationDate: new Date().toISOString(),
      documentId: body.documentId || undefined,
      emergencyContact: body.emergencyContact || undefined
    };

    // Calculate initial safety score
    newTourist.safetyScore = calculateSafetyScore(newTourist);

    mockTourists.push(newTourist);

    return NextResponse.json(
      {
        success: true,
        message: 'Tourist created successfully',
        data: newTourist
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating tourist:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error creating tourist'
      },
      { status: 500 }
    );
  }
}

// PUT - Bulk operations
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { operation, touristIds, data } = body;

    if (!operation || !touristIds || !Array.isArray(touristIds)) {
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
      case 'updateStatus':
        if (!data.status) {
          return NextResponse.json(
            {
              success: false,
              message: 'Status is required for bulk status update'
            },
            { status: 400 }
          );
        }

        mockTourists.forEach(tourist => {
          if (touristIds.includes(tourist.id)) {
            tourist.status = data.status;
            tourist.safetyScore = calculateSafetyScore(tourist);
            updatedCount++;
          }
        });
        break;

      case 'updateVerification':
        if (!data.verificationStatus) {
          return NextResponse.json(
            {
              success: false,
              message: 'Verification status is required'
            },
            { status: 400 }
          );
        }

        mockTourists.forEach(tourist => {
          if (touristIds.includes(tourist.id)) {
            tourist.verificationStatus = data.verificationStatus;
            tourist.safetyScore = calculateSafetyScore(tourist);
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
        requestedCount: touristIds.length
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
