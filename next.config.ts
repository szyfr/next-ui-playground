import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is now the default bundler in Next.js 16
  // No need to explicitly enable it

  // Image optimization configuration
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Experimental features (optional)
  experimental: {
    // Enable if you want to use Partial Prerendering
    // ppr: true,

    // Enable React Compiler for automatic memoization
    // Note: This may increase initial compile times
    // reactCompiler: true,

    // Optimize package imports
    optimizePackageImports: ["lucide-react", "@radix-ui/react-avatar"],
  },

  // Production optimizations
  compress: true,
  poweredByHeader: false,

  // TypeScript configuration
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors. Not recommended for production.
    // ignoreBuildErrors: false,
  },
};

export default nextConfig;
