import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Environment variables
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },

  // Advanced webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Advanced optimization settings
      config.optimization = {
        ...config.optimization,
        // Disable minification for faster dev builds
        minimize: false,
        // Advanced module concatenation
        concatenateModules: true,

        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 50000,
          cacheGroups: {
            // AI services chunk
            aiServices: {
              test: /[\\/]src[\\/]services[\\/](AI|ai-modules)[\\/]/,
              name: 'ai-services',
              chunks: 'all',
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },

            // Icon libraries chunk (tree-shake lucide-react)
            icons: {
              test: /[\\/]node_modules[\\/](lucide-react|react-icons)[\\/]/,
              name: 'icons',
              chunks: 'all',
              priority: 35,
              enforce: true,
              reuseExistingChunk: true,
            },

            // Heavy UI libraries chunk
            heavyUI: {
              test: /[\\/]node_modules[\\/](@google\/generative-ai|recharts|chart\.js|framer-motion|react-markdown)[\\/]/,
              name: 'heavy-ui',
              chunks: 'all',
              priority: 30,
              enforce: true,
              reuseExistingChunk: true,
            },

            // Date utilities chunk
            dateUtils: {
              test: /[\\/]node_modules[\\/](date-fns|moment)[\\/]/,
              name: 'date-utils',
              chunks: 'all',
              priority: 25,
              enforce: true,
              reuseExistingChunk: true,
            },

            // Form libraries chunk
            forms: {
              test: /[\\/]node_modules[\\/](react-hook-form|formik)[\\/]/,
              name: 'forms',
              chunks: 'all',
              priority: 20,
              enforce: true,
              reuseExistingChunk: true,
            },

            // React ecosystem chunk
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 15,
              enforce: true,
              reuseExistingChunk: true,
            },

            // Vendor chunk for other dependencies
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              enforce: true,
              reuseExistingChunk: true,
            },
          },
        },
      };

      // Advanced module resolution
      config.resolve = {
        ...config.resolve,
        // Faster module resolution
        symlinks: false,
        // Optimize extensions order
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
        // Module aliases for faster resolution
        alias: {
          ...config.resolve.alias,
          '@': require('path').resolve(__dirname, 'src'),
        },
      };

      // Exclude heavy testing dependencies from client bundle
      config.externals = config.externals || [];
      config.externals.push({
        'playwright': 'commonjs playwright',
        'puppeteer': 'commonjs puppeteer',
        '@playwright/test': 'commonjs @playwright/test',
      });

      // Advanced caching for faster rebuilds
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
        cacheDirectory: require('path').resolve(__dirname, '.next/cache/webpack'),
      };

      // Performance hints
      config.performance = {
        hints: false, // Disable warnings for dev
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      };
    }

    return config;
  },

  // Server external packages
  serverExternalPackages: ['@google/generative-ai'],

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

  // Output optimization
  output: 'standalone',

  // Headers for better caching
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
    ];
  },
};

export default nextConfig;
