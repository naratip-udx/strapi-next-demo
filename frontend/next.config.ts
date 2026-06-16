import type { NextConfig } from "next";

const backendURL = process.env.STRAPI_BASE_URL || "http://localhost:1337";
const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    qualities: [25, 50, 75, 100],
    dangerouslyAllowLocalIP: isDev,
    remotePatterns: [
      {
        protocol: isDev ? "http" : "https",
        hostname: new URL(backendURL).hostname,
        port: new URL(backendURL).port || (isDev ? '1337' : ''),
        pathname: '/uploads/**',
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
