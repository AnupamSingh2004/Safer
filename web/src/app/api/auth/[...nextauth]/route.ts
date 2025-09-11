/**
 * Smart Tourist Safety System - NextAuth API Route
 * Handles all authentication requests through NextAuth
 */

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
