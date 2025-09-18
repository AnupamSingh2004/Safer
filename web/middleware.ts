/**
 * Smart Tourist Safety System - Next.js Middleware
 * Root middleware file that Next.js automatically recognizes
 */

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from './src/middleware/auth-middleware';

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes we want to be public
  const { pathname } = request.nextUrl;
  
  // Skip for static files, favicon, and _next resources
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/register') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return NextResponse.next();
  }

  // Apply authentication middleware
  return authMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};