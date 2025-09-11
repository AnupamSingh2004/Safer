import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  // TODO: Implement mobile tracking data retrieval logic
  return NextResponse.json({ message: 'Tracking endpoint not implemented yet' }, { status: 501 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // TODO: Implement mobile tracking data submission logic
  return NextResponse.json({ message: 'Tracking data submission endpoint not implemented yet' }, { status: 501 });
}

export async function OPTIONS(): Promise<NextResponse> {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
