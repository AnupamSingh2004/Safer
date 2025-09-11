import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  // TODO: Implement mobile profile data retrieval logic
  return NextResponse.json({ message: 'Profile endpoint not implemented yet' }, { status: 501 });
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  // TODO: Implement mobile profile update logic
  return NextResponse.json({ message: 'Profile update endpoint not implemented yet' }, { status: 501 });
}

export async function OPTIONS(): Promise<NextResponse> {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
