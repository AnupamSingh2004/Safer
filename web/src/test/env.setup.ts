/**
 * Environment Setup for Tests
 * Sets up environment variables for testing
 */

// Mock environment variables for testing
(process.env as any).NODE_ENV = 'test';
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001';
process.env.NEXT_PUBLIC_WS_URL = 'ws://localhost:3001';
process.env.NEXT_PUBLIC_BLOCKCHAIN_NETWORK = 'localhost';
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';

// Supabase test environment
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';

// JWT test configuration
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_EXPIRES_IN = '7d';

// Blockchain test configuration
process.env.PRIVATE_KEY = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
process.env.INFURA_API_KEY = 'test-infura-key';
process.env.ETHERSCAN_API_KEY = 'test-etherscan-key';