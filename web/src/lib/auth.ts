/**
 * Smart Tourist Safety System - NextAuth Configuration
 * Handles authentication with Google OAuth and custom credentials
 */

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { Session, User } from 'next-auth';

// ============================================================================
// NEXTAUTH CONFIGURATION
// ============================================================================

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

    // Custom Credentials Provider (for existing email/password login)
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' }
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Call your existing login API
          const response = await fetch(`${process.env.API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              role: credentials.role || 'operator',
            }),
          });

          const data = await response.json();

          if (response.ok && data.success && data.user) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name || `${data.user.firstName} ${data.user.lastName}`,
              image: data.user.avatar,
              role: data.user.role,
              permissions: data.user.permissions,
              department: data.user.department,
              token: data.token,
              refreshToken: data.refreshToken,
            };
          }

          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists in your system or create a new one
          const response = await fetch(`${process.env.API_BASE_URL}/api/auth/google-signin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              googleId: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              provider: 'google',
            }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            // Attach additional user data to the user object
            user.role = data.user.role;
            user.permissions = data.user.permissions;
            user.department = data.user.department;
            user.token = data.token;
            user.refreshToken = data.refreshToken;
            return true;
          } else {
            // If user doesn't exist in your system, you might want to redirect to registration
            // or auto-create a basic user account
            console.warn('Google user not found in system:', data.message);
            return false;
          }
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token || user.refreshToken,
          role: user.role,
          permissions: user.permissions,
          department: user.department,
          customToken: user.token,
        };
      }

      // Return previous token if the access token has not expired yet
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
          permissions: token.permissions,
          department: token.department,
        },
        accessToken: token.accessToken,
        customToken: token.customToken,
      };
    },
  },

  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',
};
