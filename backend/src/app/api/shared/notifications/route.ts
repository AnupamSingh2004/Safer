import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  // TODO: Implement shared notifications retrieval logic
  return NextResponse.json({ message: 'Notifications endpoint not implemented yet' }, { status: 501 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // TODO: Implement shared notifications creation logic
  return NextResponse.json({ message: 'Notification creation endpoint not implemented yet' }, { status: 501 });
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
