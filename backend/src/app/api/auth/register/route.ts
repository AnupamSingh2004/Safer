/**
 * Smart Tourist Safety System - Registration API Route
 * Handles new user registration with proper validation
 */

import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Types for registration request/response
interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
  department?: string;
  phoneNumber?: string;
  inviteCode?: string;
}

interface RegisterResponse {
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

// Mock user storage (replace with actual database)
const mockUsers: any[] = [];

// Role-based permissions
const rolePermissions = {
  admin: ['read', 'write', 'delete', 'manage_users', 'view_analytics', 'system_config'],
  operator: ['read', 'write', 'manage_alerts', 'track_tourists', 'emergency_response'],
  viewer: ['read', 'view_reports', 'view_analytics']
};

// Valid invite codes for different roles
const inviteCodes = {
  admin: 'ADMIN_SAFETY_2024',
  operator: 'OPERATOR_SAFE_2024',
  viewer: 'VIEWER_REPORTS_2024'
};

// Input validation
const validateRegisterInput = (data: any): data is RegisterRequest => {
  return (
    data &&
    typeof data.email === 'string' &&
    typeof data.password === 'string' &&
    typeof data.confirmPassword === 'string' &&
    typeof data.name === 'string' &&
    typeof data.role === 'string' &&
    data.email.includes('@') &&
    data.password.length >= 8 &&
    data.password === data.confirmPassword &&
    data.name.trim().length >= 2 &&
    ['admin', 'operator', 'viewer'].includes(data.role)
  );
};

// Email validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
const validatePasswordStrength = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  return { isValid: true };
};

// Check if user already exists
const userExists = (email: string): boolean => {
  return mockUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
};

// Generate unique user ID
const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

// Main registration handler
export async function POST(request: NextRequest): Promise<NextResponse<RegisterResponse>> {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input format
    if (!validateRegisterInput(body)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input format. Please check all required fields.'
        },
        { status: 400 }
      );
    }

    const { email, password, name, role, department, phoneNumber, inviteCode } = body;

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email format'
        },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: passwordValidation.message || 'Invalid password'
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (userExists(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'User with this email already exists'
        },
        { status: 409 }
      );
    }

    // Validate invite code for role
    if (inviteCode !== inviteCodes[role as keyof typeof inviteCodes]) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid invite code for the selected role'
        },
        { status: 403 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcryptjs.hash(password, saltRounds);

    // Create new user
    const newUser = {
      id: generateUserId(),
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name.trim(),
      role,
      permissions: rolePermissions[role as keyof typeof rolePermissions],
      department: department?.trim() || null,
      phoneNumber: phoneNumber?.trim() || null,
      createdAt: new Date().toISOString(),
      isActive: true,
      lastLogin: null
    };

    // Save user (in real app, save to database)
    mockUsers.push(newUser);

    // Generate JWT token
    const token = generateToken(newUser);

    // Prepare user data for response (exclude password)
    const userData = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      permissions: newUser.permissions
    };

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        token,
        user: userData
      },
      { 
        status: 201,
        headers: {
          'Set-Cookie': `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/`
        }
      }
    );

  } catch (error) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error during registration'
      },
      { status: 500 }
    );
  }
}

// Handle GET request to get registration requirements
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: true,
      message: 'Registration requirements',
      data: {
        roles: ['admin', 'operator', 'viewer'],
        passwordRequirements: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumber: true,
          requireSpecialChar: false
        },
        requiredFields: ['email', 'password', 'confirmPassword', 'name', 'role', 'inviteCode'],
        optionalFields: ['department', 'phoneNumber']
      }
    },
    { status: 200 }
  );
}

// Options for CORS
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
