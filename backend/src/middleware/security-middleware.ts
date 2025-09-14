/**
 * Smart Tourist Safety System - Security Middleware
 * Comprehensive security middleware with rate limiting, CORS, input sanitization, and security headers
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface SecurityConfig {
  rateLimit: {
    windowMs: number;
    max: number;
    message: string;
  };
  slowDown: {
    windowMs: number;
    delayAfter: number;
    delayMs: number;
  };
  cors: {
    origin: string | string[];
    methods: string[];
    allowedHeaders: string[];
    credentials: boolean;
  };
}

export interface SecurityMetrics {
  rateLimitHits: number;
  blockedRequests: number;
  suspiciousActivity: number;
  lastUpdate: Date;
}

// ============================================================================
// SECURITY CONFIGURATION
// ============================================================================

const SECURITY_CONFIG: SecurityConfig = {
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP
    message: 'Too many requests from this IP, please try again later.'
  },
  slowDown: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // allow 50 requests per window without delay
    delayMs: 500 // add 500ms delay per request after delayAfter
  },
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [
          'https://smart-tourist-safety.gov.in',
          'https://www.smart-tourist-safety.gov.in',
          'https://admin.smart-tourist-safety.gov.in'
        ]
      : ['http://localhost:3000', 'http://localhost:8001', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-API-Key',
      'X-Tourist-ID',
      'X-Emergency-Token'
    ],
    credentials: true
  }
};

// ============================================================================
// INPUT SANITIZATION & VALIDATION
// ============================================================================

export class InputSanitizer {
  /**
   * Sanitize HTML content to prevent XSS
   */
  static sanitizeHtml(input: string): string {
    // Basic HTML sanitization without external dependency
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  /**
   * Sanitize and validate email
   */
  static sanitizeEmail(email: string): string | null {
    const sanitized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(sanitized) ? sanitized : null;
  }

  /**
   * Sanitize phone number
   */
  static sanitizePhone(phone: string): string | null {
    const cleaned = phone.replace(/[^\d+\-\s()]/g, '');
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(cleaned.replace(/[\s\-()]/g, '')) ? cleaned : null;
  }

  /**
   * Sanitize coordinate data
   */
  static sanitizeCoordinates(lat: number, lng: number): { lat: number; lng: number } | null {
    if (typeof lat !== 'number' || typeof lng !== 'number') return null;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
    return { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
  }

  /**
   * Sanitize SQL-like inputs to prevent injection
   */
  static sanitizeSqlInput(input: string): string {
    return input
      .replace(/[';\\]/g, '') // Remove semicolons and backslashes
      .replace(/--/g, '') // Remove SQL comments
      .replace(/\/\*.*?\*\//g, '') // Remove block comments
      .trim();
  }

  /**
   * Validate and sanitize tourist ID
   */
  static sanitizeTouristId(id: string): string | null {
    const sanitized = id.trim().toUpperCase();
    const pattern = /^TST[0-9]{10}$/; // Tourist ID format
    return pattern.test(sanitized) ? sanitized : null;
  }
}

// ============================================================================
// SECURITY VALIDATION SCHEMAS
// ============================================================================

const validationSchemas = {
  // Login validation
  login: z.object({
    email: z.string().email('Invalid email format').min(1, 'Email is required'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
        'Password must contain uppercase, lowercase, number and special character'),
    rememberMe: z.boolean().optional()
  }),

  // Emergency alert validation
  emergencyAlert: z.object({
    touristId: z.string().regex(/^TST[0-9]{10}$/, 'Invalid tourist ID format'),
    location: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      accuracy: z.number().positive().optional()
    }),
    alertType: z.enum(['medical', 'security', 'natural_disaster', 'accident', 'lost']),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
    description: z.string().max(500, 'Description too long').optional(),
    timestamp: z.string().datetime()
  }),

  // KYC document validation
  kycDocument: z.object({
    type: z.enum(['passport', 'aadhaar', 'driving_license', 'voter_id']),
    number: z.string().min(5).max(20),
    expiryDate: z.string().datetime().optional(),
    issueDate: z.string().datetime().optional(),
    issuingAuthority: z.string().max(100).optional()
  })
};

// ============================================================================
// SECURITY MIDDLEWARE FUNCTIONS
// ============================================================================

/**
 * Main security middleware
 */
async function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  
  try {
    // Add security headers
    addSecurityHeaders(response);
    
    // Validate request origin
    if (!isValidOrigin(request)) {
      return new Response('Forbidden: Invalid origin', { status: 403 });
    }
    
    // Check for suspicious patterns
    if (isSuspiciousRequest(request)) {
      console.warn(`Suspicious request detected: ${request.url} from ${request.ip}`);
      return new Response('Forbidden: Suspicious activity detected', { status: 403 });
    }
    
    // Rate limiting check
    if (await isRateLimited(request)) {
      return new Response('Too Many Requests', { status: 429 });
    }
    
    return response;
    
  } catch (error) {
    console.error('Security middleware error:', error);
    return new Response('Internal Security Error', { status: 500 });
  }
}

/**
 * Add comprehensive security headers
 */
function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  response.headers.set('X-API-Version', '1.0');
  response.headers.set('X-Powered-By', 'Smart Tourist Safety System');
}

/**
 * Validate request origin
 */
function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  if (!origin && !referer) return true;
  
  const allowedOrigins = SECURITY_CONFIG.cors.origin;
  const checkOrigin = origin || referer;
  
  if (Array.isArray(allowedOrigins)) {
    return allowedOrigins.some(allowed => checkOrigin?.startsWith(allowed));
  }
  
  return checkOrigin?.startsWith(allowedOrigins) || false;
}

/**
 * Detect suspicious request patterns
 */
function isSuspiciousRequest(request: NextRequest): boolean {
  const url = request.url.toLowerCase();
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  
  const suspiciousPatterns = [
    /\.\.\//,
    /<script/i,
    /union.*select/i,
    /javascript:/i,
    /vbscript:/i,
    /data:text\/html/i,
  ];
  
  const suspiciousUserAgents = [
    /sqlmap/i,
    /nikto/i,
    /burpsuite/i,
    /nessus/i,
    /openvas/i,
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(url)) ||
         suspiciousUserAgents.some(pattern => pattern.test(userAgent));
}

/**
 * Simple rate limiting check
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

async function isRateLimited(request: NextRequest): Promise<boolean> {
  const ip = request.ip || 'unknown';
  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 100;
  
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  if (current.count >= maxRequests) {
    return true;
  }
  
  current.count++;
  return false;
}

// ============================================================================
// SECURITY MONITORING
// ============================================================================

class SecurityMonitorClass {
  private static metrics: SecurityMetrics = {
    rateLimitHits: 0,
    blockedRequests: 0,
    suspiciousActivity: 0,
    lastUpdate: new Date()
  };

  static recordRateLimitHit() {
    this.metrics.rateLimitHits++;
    this.metrics.lastUpdate = new Date();
  }

  static recordBlockedRequest() {
    this.metrics.blockedRequests++;
    this.metrics.lastUpdate = new Date();
  }

  static recordSuspiciousActivity() {
    this.metrics.suspiciousActivity++;
    this.metrics.lastUpdate = new Date();
  }

  static getMetrics(): SecurityMetrics {
    return { ...this.metrics };
  }

  static resetMetrics() {
    this.metrics = {
      rateLimitHits: 0,
      blockedRequests: 0,
      suspiciousActivity: 0,
      lastUpdate: new Date()
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default securityMiddleware;
export { SECURITY_CONFIG, validationSchemas, SecurityMonitorClass as SecurityMonitor };