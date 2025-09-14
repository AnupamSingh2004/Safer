/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================================================
  // PRODUCTION OPTIMIZATION
  // ============================================================================
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  
  // Performance optimizations
  swcMinify: true,
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
  
  // Bundle analysis
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    // Add performance monitoring
    config.plugins.push(
      new webpack.DefinePlugin({
        __BUILD_ID__: JSON.stringify(buildId),
        __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      })
    );
    
    return config;
  },

  // ============================================================================
  // SECURITY CONFIGURATION
  // ============================================================================
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'production' 
              ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https: wss: ws:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
              : "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: http:; connect-src 'self' http://localhost:* https: wss: ws: data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
          },
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), payment=()'
          }
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? process.env.NEXT_PUBLIC_APP_URL || 'https://smart-tourist-safety.gov.in' 
              : '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'X-API-Version',
            value: '1.0',
          }
        ],
      },
    ];
  },

  // ============================================================================
  // API ROUTING & REWRITES
  // ============================================================================
  async rewrites() {
    return [
      {
        source: '/api/mobile/:path*',
        destination: '/api/mobile/:path*',
      },
      {
        source: '/api/dashboard/:path*', 
        destination: '/api/dashboard/:path*',
      },
      {
        source: '/api/blockchain/:path*',
        destination: '/api/blockchain/:path*',
      }
    ];
  },

  // ============================================================================
  // PERFORMANCE & CACHING
  // ============================================================================
  images: {
    domains: [
      'localhost', 
      'smart-tourist-safety.gov.in',
      'supabase.co',
      'githubusercontent.com'
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Enable experimental features
  experimental: {
    serverComponentsExternalPackages: ['prisma', '@supabase/supabase-js'],
    optimizePackageImports: ['lucide-react', 'recharts'],
  },

  // Environment variables
  env: {
    BUILD_TIME: new Date().toISOString(),
    APP_VERSION: process.env.npm_package_version || '1.0.0',
  },
};

export default nextConfig;
