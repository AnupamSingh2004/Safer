/**
 * Smart Tourist Safety System - Login API Route
 * Handles user authentication and JWT token generation
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

// Mock user database (replace with actual database)
const mockUsers = [
  {
    id: '1',
    email: 'admin@touristsafety.gov.in',
    password: '$2a$10$4ai6Og8xQIjkbwS/V1nWu.hCyp06qr5t8jyxe8FmMYblt9PTtuRJ6', // 'admin123'
    name: 'System Administrator',
    role: 'super_admin',
    permissions: ['read', 'write', 'delete', 'manage_users', 'view_analytics', 'system_config']
  },
  {
    id: '2',
    email: 'operator@touristsafety.gov.in',
    password: '$2a$10$4ai6Og8xQIjkbwS/V1nWu.hCyp06qr5t8jyxe8FmMYblt9PTtuRJ6', // 'admin123' (same for testing)
    name: 'Safety Operator',
    role: 'operator',
    permissions: ['read', 'write', 'manage_alerts', 'track_tourists']
  },
  {
    id: '3',
    email: 'viewer@touristsafety.gov.in',
    password: '$2a$10$4ai6Og8xQIjkbwS/V1nWu.hCyp06qr5t8jyxe8FmMYblt9PTtuRJ6', // 'admin123' (same for testing)
    name: 'Safety Viewer',
    role: 'viewer',
    permissions: ['read', 'view_reports']
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

// Rate limiting (simple in-memory implementation)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

const checkRateLimit = (email: string): boolean => {
  const now = Date.now();
  const attempts = loginAttempts.get(email);

  if (!attempts) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return true;
  }

  if (now - attempts.lastAttempt > LOCKOUT_TIME) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return true;
  }

  if (attempts.count >= MAX_ATTEMPTS) {
    return false;
  }

  attempts.count += 1;
  attempts.lastAttempt = now;
  return true;
};

const resetRateLimit = (email: string): void => {
  loginAttempts.delete(email);
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

// Main login handler
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
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:8001',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
          }
        }
      );
    }

    const { email, password, role } = body;

    // Check rate limiting
    if (!checkRateLimit(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many login attempts. Please try again in 15 minutes.'
        },
        { 
          status: 429,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:8001',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
          }
        }
      );
    }

    // Find user
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password'
        },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:8001',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
          }
        }
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
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:8001',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
          }
        }
      );
    }

    // Validate role if provided
    if (role && role !== user.role) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid role selected for this account'
        },
        { 
          status: 403,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:8001',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
          }
        }
      );
    }

    // Reset rate limit on successful login
    resetRateLimit(email);

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
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:8001',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
          'Set-Cookie': `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/`
        }
      }
    );

  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:8001',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true'
        }
      }
    );
  }
}

// Handle GET request (not allowed)
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      message: 'Method not allowed'
    },
    { status: 405 }
  );
}

// Options for CORS
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:8001',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    },
  });
}
