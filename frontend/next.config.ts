import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Nécessaire pour le Dockerfile production (image légère)
  output: "standalone",

  // Variables d'environnement exposées côté client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080",
  },
};

export default nextConfig;
