/**
 * Smart Tourist Safety System - Login API Route (Direct Implementation)
 * Handles user authentication and JWT token generation directly in the web app
 */

import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Types for login request/response
interface LoginRequest {
  email: string;
  password: string;
  role?: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions: string[];
  };
}

// Mock user database (same as backend)
const mockUsers = [
  {
    id: '1',
    email: 'admin@touristsafety.gov.in',
    password: '$2a$10$qusBRmuohLT2ohAq1G44Cuk48qq5z4nhK35.v89cBZKAkytnIwTN6', // 'admin123'
    name: 'System Administrator',
    role: 'super_admin',
    permissions: ['read', 'write', 'delete', 'manage_users', 'view_analytics', 'system_config']
  },
  {
    id: '2',
    email: 'operator@touristsafety.gov.in',
    password: '$2a$10$qusBRmuohLT2ohAq1G44Cuk48qq5z4nhK35.v89cBZKAkytnIwTN6', // 'operator123' (using admin123)
    name: 'Safety Operator',
    role: 'operator',
    permissions: ['read', 'write', 'manage_alerts', 'track_tourists']
  },
  {
    id: '3',
    email: 'viewer@touristsafety.gov.in',
    password: '$2a$10$qusBRmuohLT2ohAq1G44Cuk48qq5z4nhK35.v89cBZKAkytnIwTN6', // 'viewer123' (using admin123)
    name: 'Safety Viewer',
    role: 'viewer',
    permissions: ['read', 'view_reports']
  },
  {
    id: '4',
    email: 'police@touristsafety.gov.in',
    password: '$2a$10$sJvJcHbHq.ze2NDASzqimeJeJO6EyHk06XfXfzGQUekZl7cs9wljS', // 'police123'
    name: 'Police Administrator',
    role: 'police_admin',
    permissions: ['read', 'write', 'manage_investigations', 'access_digital_ids', 'generate_efir', 'manage_cases', 'track_missing_persons']
  },
  {
    id: '5',
    email: 'tourism@touristsafety.gov.in',
    password: '$2a$10$Rzfna/hWtc2DHEZDYQ3aFeVzZSvy7AX0ixQH/PepEXyNkztieYLRu', // 'tourism123'
    name: 'Tourism Administrator',
    role: 'tourism_admin',
    permissions: ['read', 'write', 'view_clusters', 'manage_zones', 'view_heatmaps', 'tourist_analytics', 'manage_flows']
  }
];

// Input validation
const validateLoginInput = (data: any): data is LoginRequest => {
  return (
    data &&
    typeof data.email === 'string' &&
    typeof data.password === 'string' &&
    data.email.includes('@') &&
    data.password.length >= 6
  );
};

// Generate JWT token
const generateToken = (user: any): string => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'tourist-safety-secret-key',
    { 
      expiresIn: '24h',
      issuer: 'smart-tourist-safety'
    }
  );
};

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    if (!validateLoginInput(body)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password format'
        },
        { status: 400 }
      );
    }

    const { email, password, role } = body;

    // Find user
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password'
        },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password'
        },
        { status: 401 }
      );
    }

    // Validate role if provided
    if (role && role !== user.role) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid role selected for this account'
        },
        { status: 403 }
      );
    }

    // Generate JWT token
    const token = generateToken(user);

    // Prepare user data (exclude password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions
    };

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        token,
        user: userData
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
