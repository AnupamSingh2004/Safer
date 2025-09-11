/**
 * Smart Tourist Safety System - NextAuth Type Extensions
 * Extends NextAuth types to include custom user properties
 */

import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string;
      permissions?: string[];
      department?: string;
    } & DefaultSession['user'];
    accessToken?: string;
    customToken?: string;
  }

  interface User extends DefaultUser {
    role?: string;
    permissions?: string[];
    department?: string;
    token?: string;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    permissions?: string[];
    department?: string;
    customToken?: string;
  }
}

export {};
