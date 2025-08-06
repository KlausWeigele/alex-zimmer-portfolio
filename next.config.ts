import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Container-ready für Docker deployment (ChatGPT's recommendation)
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Performance optimizations (Klaus Standards)
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Experimental features für better performance
  experimental: {
    optimizeCss: true,
    gzipSize: true,
  },
  
  // Security headers (ChatGPT's approach + business optimizations)
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        // Basic security headers
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        
        // HSTS for production security
        { 
          key: 'Strict-Transport-Security', 
          value: 'max-age=63072000; includeSubDomains; preload' 
        },
        
        // Business-optimized CSP für Alex Zimmer Portfolio
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://plausible.io https://storage.googleapis.com", // TensorFlow.js + Analytics
            "style-src 'self' 'unsafe-inline'", // Tailwind + Framer Motion
            "img-src 'self' data: https:", // Portfolio images + demo assets
            "font-src 'self'",
            "connect-src 'self' https://plausible.io https://storage.googleapis.com https://tfhub.dev", // Analytics + AI models
            "frame-src 'none'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests"
          ].join('; ')
        },
        
        // Performance headers
        { key: 'X-XSS-Protection', value: '1; mode=block' }
      ],
    },
  ],
  
  // Redirects für legacy demo URLs (maintains SEO)
  redirects: async () => [
    {
      source: '/demo.html',
      destination: '/',
      permanent: true,
    },
  ],
};

export default nextConfig;
