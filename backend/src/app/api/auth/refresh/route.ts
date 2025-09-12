/**
 * Smart Tourist Safety System - Token Refresh API Route
 * Handles JWT access token renewal using refresh tokens
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Types for refresh request/response
interface RefreshRequest {
  refresh_token: string;
  device_info?: {
    type: string;
    os: string;
    browser: string;
    user_agent: string;
  };
}

interface RefreshResponse {
  success: boolean;
  message: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
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
    name: 'System Administrator',
    role: 'super_admin',
    permissions: ['read', 'write', 'delete', 'manage_users', 'view_analytics', 'system_config'],
    is_active: true
  },
  {
    id: '2',
    email: 'operator@touristsafety.gov.in',
    name: 'Safety Operator',
    role: 'operator',
    permissions: ['read', 'write', 'manage_alerts', 'track_tourists'],
    is_active: true
  },
  {
    id: '3',
    email: 'viewer@touristsafety.gov.in',
    name: 'Safety Viewer',
    role: 'viewer',
    permissions: ['read', 'view_reports'],
    is_active: true
  }
];

// Mock active sessions (replace with database/Redis)
const activeSessions = new Map<string, {
  user_id: string;
  refresh_token: string;
  access_token?: string;
  created_at: number;
  last_activity: number;
  device_info?: any;
  is_active: boolean;
}>();

// JWT secrets
const JWT_SECRET = process.env.JWT_SECRET || 'tourist-safety-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'tourist-safety-refresh-secret';

// Input validation
const validateRefreshInput = (data: any): data is RefreshRequest => {
  return (
    data &&
    typeof data.refresh_token === 'string' &&
    data.refresh_token.length > 0
  );
};

// Generate new access token
const generateAccessToken = (user: any, sessionId: string): string => {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    permissions: user.permissions,
    session_id: sessionId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
    iss: 'smart-tourist-safety',
    aud: 'sts-web-app'
  };

  return jwt.sign(payload, JWT_SECRET);
};

// Generate new refresh token
const generateRefreshToken = (userId: string, sessionId: string): string => {
  const payload = {
    sub: userId,
    session_id: sessionId,
    type: 'refresh',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
    iss: 'smart-tourist-safety',
    aud: 'sts-web-app',
    jti: crypto.randomUUID()
  };

  return jwt.sign(payload, JWT_REFRESH_SECRET);
};

// Verify refresh token
const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'smart-tourist-safety',
      audience: 'sts-web-app'
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('REFRESH_TOKEN_EXPIRED');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('INVALID_REFRESH_TOKEN');
    }
    throw new Error('REFRESH_TOKEN_VERIFICATION_FAILED');
  }
};

// Rate limiting for refresh attempts
const refreshAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_REFRESH_ATTEMPTS = 10;
const REFRESH_WINDOW = 60 * 1000; // 1 minute

const checkRefreshRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const attempts = refreshAttempts.get(userId);

  if (!attempts) {
    refreshAttempts.set(userId, { count: 1, lastAttempt: now });
    return true;
  }

  if (now - attempts.lastAttempt > REFRESH_WINDOW) {
    refreshAttempts.set(userId, { count: 1, lastAttempt: now });
    return true;
  }

  if (attempts.count >= MAX_REFRESH_ATTEMPTS) {
    return false;
  }

  attempts.count += 1;
  attempts.lastAttempt = now;
  return true;
};

// Main refresh handler
export async function POST(request: NextRequest): Promise<NextResponse<RefreshResponse>> {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    if (!validateRefreshInput(body)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid refresh token format'
        },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
          }
        }
      );
    }

    const { refresh_token, device_info } = body;

    // Verify and decode refresh token
    let tokenPayload;
    try {
      tokenPayload = verifyRefreshToken(refresh_token);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown token error';
      
      let statusCode = 401;
      let message = 'Invalid refresh token';

      if (errorMessage === 'REFRESH_TOKEN_EXPIRED') {
        message = 'Refresh token has expired. Please login again.';
      } else if (errorMessage === 'INVALID_REFRESH_TOKEN') {
        message = 'Invalid refresh token format';
      }

      return NextResponse.json(
        {
          success: false,
          message
        },
        { 
          status: statusCode,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
          }
        }
      );
    }

    const { sub: userId, session_id } = tokenPayload;

    // Check rate limiting
    if (!checkRefreshRateLimit(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many refresh attempts. Please try again later.'
        },
        { 
          status: 429,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
          }
        }
      );
    }

    // Find user
    const user = mockUsers.find(u => u.id === userId);
    if (!user || !user.is_active) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found or inactive'
        },
        { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
          }
        }
      );
    }

    // Check if session exists and is valid
    const session = activeSessions.get(session_id);
    if (!session || !session.is_active || session.refresh_token !== refresh_token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired session'
        },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
          }
        }
      );
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user, session_id);
    const newRefreshToken = generateRefreshToken(userId, session_id);

    // Update session
    activeSessions.set(session_id, {
      ...session,
      refresh_token: newRefreshToken,
      access_token: newAccessToken,
      last_activity: Date.now(),
      device_info: device_info || session.device_info
    });

    // Prepare user data for response
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: user.permissions
    };

    // Calculate expiry time
    const expiresAt = new Date(Date.now() + (15 * 60 * 1000)).toISOString(); // 15 minutes

    // Reset rate limit on successful refresh
    refreshAttempts.delete(userId);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Token refreshed successfully',
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_at: expiresAt,
        user: userData
      },
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
          'Set-Cookie': `auth_token=${newAccessToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=900; Path=/`
        }
      }
    );

  } catch (error) {
    console.error('Token refresh error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error during token refresh'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true'
        }
      }
    );
  }
}

// Handle GET request to get refresh endpoint info
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: true,
      message: 'Token refresh endpoint',
      data: {
        endpoint: '/api/auth/refresh',
        method: 'POST',
        required_fields: ['refresh_token'],
        optional_fields: ['device_info'],
        rate_limit: {
          max_attempts: MAX_REFRESH_ATTEMPTS,
          window_minutes: 1
        },
        token_lifetime: {
          access_token: '15 minutes',
          refresh_token: '7 days'
        }
      }
    },
    { 
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
      }
    }
  );
}

// Options for CORS
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true'
    },
  });
}
