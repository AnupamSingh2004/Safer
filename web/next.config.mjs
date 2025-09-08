/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Optimize for production
  poweredByHeader: false,
  compress: true,
  
  // API configuration
  async rewrites() {
    return [
      {
        source: '/api/mobile/:path*',
        destination: '/api/mobile/:path*',
      },
      {
        source: '/api/dashboard/:path*', 
        destination: '/api/dashboard/:path*',
      }
    ];
  },
  
  // Headers for security and CORS
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  
  // Image optimization
  images: {
    domains: ['localhost', 'yourdomain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Experimental features
  experimental: {
    serverComponentsExternalPackages: ['prisma'],
  },
};

export default nextConfig;
