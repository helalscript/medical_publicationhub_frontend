import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "ibraheemaltamim.thesyndicates.team",
      },
      {
        protocol: "https",
        hostname: "dashboard.hooray-entertainment.online",
      },
      {
        protocol: "https",
        hostname: "dashboard.publicationhub.co",
      },
      {
        protocol: "https",
        hostname: "*.ngrok-free.app",
      },
      {
        protocol: "http",
        hostname: "*.ngrok-free.app",
      },
    ],
  },
};

export default nextConfig;
