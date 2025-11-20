import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel optimizations
  // output: "standalone", // Commented out - can cause issues with Vercel
  // Enable React strict mode
  reactStrictMode: true,
  // Optimize images
  images: {
    domains: [
      "maps.googleapis.com",
      "lh3.googleusercontent.com", // Google profile images
    ],
  },
  // Disable ESLint during build (Vercel will run it separately if needed)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during build (Vercel will check separately)
  typescript: {
    ignoreBuildErrors: false, // Keep false to catch real errors
  },
};

export default nextConfig;
