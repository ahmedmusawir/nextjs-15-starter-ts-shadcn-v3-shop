import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Allows all paths from Cloudinary
      },
      {
        protocol: "https",
        hostname: "wordpress-1366765-5035928.cloudwaysapps.com", // Your headless WP backend
        pathname: "/**", // Allows all paths from this backend
      },
    ],
  },
};

export default nextConfig;
