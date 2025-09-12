/**
 * Smart Tourist Safety System - Token Verification & User Verification API Route
 * Handles JWT token validation and user account verification (email/phone)
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Types for verification request/response
interface TokenVerificationRequest {
  token: string;
  verify_type: 'access_token' | 'email_verification' | 'phone_verification' | 'password_reset';
}

interface UserVerificationRequest {
  verification_code: string;
  verification_type: 'email' | 'phone';
  user_id?: string;
  email?: string;
  phone?: string;
}

interface VerificationResponse {
  success: boolean;
  message: string;
  valid?: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions: string[];
    is_verified?: boolean;
  };
  token_info?: {
    sub: string;
    email: string;
    role: string;
    permissions: string[];
    session_id: string;
    issued_at: string;
    expires_at: string;
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
    is_active: true,
    is_verified: true,
    email_verified: true,
    phone_verified: false
  },
  {
    id: '2',
    email: 'operator@touristsafety.gov.in',
    name: 'Safety Operator',
    role: 'operator',
    permissions: ['read', 'write', 'manage_alerts', 'track_tourists'],
    is_active: true,
    is_verified: true,
    email_verified: true,
    phone_verified: true
  },
  {
    id: '3',
    email: 'viewer@touristsafety.gov.in',
    name: 'Safety Viewer',
    role: 'viewer',
    permissions: ['read', 'view_reports'],
    is_active: true,
    is_verified: true,
    email_verified: true,
    phone_verified: false
  }
];

// Mock verification codes (replace with database/Redis with TTL)
const verificationCodes = new Map<string, {
  code: string;
  type: 'email' | 'phone' | 'password_reset';
  user_id: string;
  email?: string;
  phone?: string;
  created_at: number;
  expires_at: number;
  used: boolean;
}>();

// JWT secrets
const JWT_SECRET = process.env.JWT_SECRET || 'tourist-safety-secret-key';

// Input validation
const validateTokenVerificationInput = (data: any): data is TokenVerificationRequest => {
  return (
    data &&
    typeof data.token === 'string' &&
    typeof data.verify_type === 'string' &&
    ['access_token', 'email_verification', 'phone_verification', 'password_reset'].includes(data.verify_type)
  );
};

const validateUserVerificationInput = (data: any): data is UserVerificationRequest => {
  return (
    data &&
    typeof data.verification_code === 'string' &&
    typeof data.verification_type === 'string' &&
    ['email', 'phone'].includes(data.verification_type) &&
    data.verification_code.length >= 4
  );
};

// Verify JWT access token
const verifyAccessToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'smart-tourist-safety',
      audience: 'sts-web-app'
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('TOKEN_EXPIRED');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('INVALID_TOKEN');
    }
    throw new Error('TOKEN_VERIFICATION_FAILED');
  }
};

// Generate verification code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

// Store verification code
const storeVerificationCode = (
  userId: string,
  type: 'email' | 'phone' | 'password_reset',
  email?: string,
  phone?: string
): string => {
  const code = generateVerificationCode();
  const verificationId = crypto.randomUUID();
  
  verificationCodes.set(verificationId, {
    code,
    type,
    user_id: userId,
    email,
    phone,
    created_at: Date.now(),
    expires_at: Date.now() + (15 * 60 * 1000), // 15 minutes
    used: false
  });

  return code;
};

// Verify verification code
const verifyVerificationCode = (
  code: string,
  type: 'email' | 'phone',
  userId?: string,
  email?: string,
  phone?: string
): { valid: boolean; user_id?: string } => {
  for (const [id, verification] of verificationCodes.entries()) {
    if (
      verification.code === code &&
      verification.type === type &&
      !verification.used &&
      verification.expires_at > Date.now()
    ) {
      // Match by user ID or email/phone
      if (
        (userId && verification.user_id === userId) ||
        (email && verification.email === email) ||
        (phone && verification.phone === phone)
      ) {
        // Mark as used
        verification.used = true;
        verificationCodes.set(id, verification);
        
        return { valid: true, user_id: verification.user_id };
      }
    }
  }
  
  return { valid: false };
};

// Rate limiting for verification attempts
const verificationAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_VERIFICATION_ATTEMPTS = 5;
const VERIFICATION_WINDOW = 15 * 60 * 1000; // 15 minutes

const checkVerificationRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const attempts = verificationAttempts.get(identifier);

  if (!attempts) {
    verificationAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }

  if (now - attempts.lastAttempt > VERIFICATION_WINDOW) {
    verificationAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }

  if (attempts.count >= MAX_VERIFICATION_ATTEMPTS) {
    return false;
  }

  attempts.count += 1;
  attempts.lastAttempt = now;
  return true;
};

// Main verification handler
export async function POST(request: NextRequest): Promise<NextResponse<VerificationResponse>> {
  try {
    // Parse request body
    const body = await request.json();
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || request.ip || 'unknown';

    // Determine if this is token verification or user verification
    if (body.token && body.verify_type) {
      // TOKEN VERIFICATION
      if (!validateTokenVerificationInput(body)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid token verification request'
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

      const { token, verify_type } = body;

      // For access token verification
      if (verify_type === 'access_token') {
        try {
          const payload = verifyAccessToken(token);
          
          // Find user to get current info
          const user = mockUsers.find(u => u.id === payload.sub);
          if (!user || !user.is_active) {
            return NextResponse.json(
              {
                success: false,
                message: 'User not found or inactive',
                valid: false
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

          return NextResponse.json(
            {
              success: true,
              message: 'Token is valid',
              valid: true,
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                permissions: user.permissions,
                is_verified: user.is_verified
              },
              token_info: {
                sub: payload.sub,
                email: payload.email,
                role: payload.role,
                permissions: payload.permissions,
                session_id: payload.session_id,
                issued_at: new Date(payload.iat * 1000).toISOString(),
                expires_at: new Date(payload.exp * 1000).toISOString()
              }
            },
            { 
              status: 200,
              headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true'
              }
            }
          );

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown token error';
          
          let message = 'Invalid token';
          if (errorMessage === 'TOKEN_EXPIRED') {
            message = 'Token has expired';
          } else if (errorMessage === 'INVALID_TOKEN') {
            message = 'Invalid token format';
          }

          return NextResponse.json(
            {
              success: false,
              message,
              valid: false
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
      }

      // For other verification types (email_verification, phone_verification, password_reset)
      return NextResponse.json(
        {
          success: false,
          message: `${verify_type} verification not yet implemented`
        },
        { 
          status: 501,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
          }
        }
      );

    } else if (body.verification_code && body.verification_type) {
      // USER VERIFICATION (email/phone)
      if (!validateUserVerificationInput(body)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid user verification request'
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

      const { verification_code, verification_type, user_id, email, phone } = body;

      // Rate limiting
      const rateLimitKey = user_id || email || phone || ipAddress;
      if (!checkVerificationRateLimit(rateLimitKey)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Too many verification attempts. Please try again later.'
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

      // Verify the code
      const verificationResult = verifyVerificationCode(
        verification_code,
        verification_type,
        user_id,
        email,
        phone
      );

      if (!verificationResult.valid) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid or expired verification code'
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

      // Find and update user
      const user = mockUsers.find(u => u.id === verificationResult.user_id);
      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: 'User not found'
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

      // Update verification status
      if (verification_type === 'email') {
        user.email_verified = true;
      } else if (verification_type === 'phone') {
        user.phone_verified = true;
      }

      // Check if user is fully verified
      user.is_verified = user.email_verified && (user.phone_verified || !user.phone);

      // Reset rate limit on successful verification
      verificationAttempts.delete(rateLimitKey);

      return NextResponse.json(
        {
          success: true,
          message: `${verification_type} verification successful`,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: user.permissions,
            is_verified: user.is_verified
          }
        },
        { 
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true'
          }
        }
      );

    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request format. Expected token verification or user verification.'
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

  } catch (error) {
    console.error('Verification error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error during verification'
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

// Handle GET request to get verification endpoint info
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: true,
      message: 'Token and user verification endpoint',
      data: {
        endpoint: '/api/auth/verify',
        method: 'POST',
        supported_operations: [
          {
            operation: 'token_verification',
            required_fields: ['token', 'verify_type'],
            verify_types: ['access_token', 'email_verification', 'phone_verification', 'password_reset']
          },
          {
            operation: 'user_verification',
            required_fields: ['verification_code', 'verification_type'],
            verification_types: ['email', 'phone'],
            optional_fields: ['user_id', 'email', 'phone']
          }
        ],
        rate_limit: {
          max_attempts: MAX_VERIFICATION_ATTEMPTS,
          window_minutes: 15
        },
        code_validity: '15 minutes'
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
