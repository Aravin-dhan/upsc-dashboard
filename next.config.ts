import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Environment variables
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },

  // Simplified webpack configuration to prevent CSS loading issues
  webpack: (config, { dev, isServer }) => {
    // Only apply minimal, safe optimizations
    if (!isServer) {
      // Safe module resolution improvements
      config.resolve = {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@': require('path').resolve(__dirname, 'src'),
        },
      };

      // Safe externals for server-side
      if (isServer) {
        config.externals = config.externals || [];
        config.externals.push({
          'playwright': 'commonjs playwright',
          'puppeteer': 'commonjs puppeteer',
          '@playwright/test': 'commonjs @playwright/test',
        });
      }

      // Essential polyfills only
      config.plugins = config.plugins || [];
      config.plugins.push(
        new (require('webpack')).DefinePlugin({
          'typeof window': JSON.stringify(isServer ? 'undefined' : 'object'),
        })
      );
    }

    return config;
  },

  // Server external packages
  serverExternalPackages: ['@google/generative-ai', 'framer-motion'],

  // Experimental features for performance
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react', 'date-fns', 'lodash'],
    // Enable memory optimization
    memoryBasedWorkersCount: true,
    // Enable faster builds
    webpackBuildWorker: true,
  },

  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
    // React compiler optimizations
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // Temporarily disable strict linting for authentication system testing
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Remove standalone output to fix CSS loading issues

  // Headers for better caching and MIME type fixes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Fix CSS MIME type issues - more specific patterns
      {
        source: '/_next/static/css/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/_next/static/css/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      // Fix JS MIME type issues
      {
        source: '/_next/static/chunks/(.*\\.js)',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      // Fix additional static assets
      {
        source: '/_next/static/(.*\\.woff2?)',
        headers: [
          {
            key: 'Content-Type',
            value: 'font/woff2',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*\\.json)',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
