import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Vercel optimizations
  output: "standalone", // Optimize for Vercel
  // Enable React strict mode
  reactStrictMode: true,
  // Optimize images
  images: {
    domains: [
      "maps.googleapis.com",
      "lh3.googleusercontent.com", // Google profile images
    ],
  },
};

export default nextConfig;
