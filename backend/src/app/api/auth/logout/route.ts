/**
 * Smart Tourist Safety System - Logout API Route
 * Handles user logout and token invalidation
 */

import { NextRequest, NextResponse } from 'next/server';

// Main logout handler
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Clear the auth token cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully'
      },
      { status: 200 }
    );

    // Clear the auth token cookie
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error during logout'
      },
      { status: 500 }
    );
  }
}

// Options for CORS
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}