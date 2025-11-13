import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  transpilePackages: [
    "shiki",
    "@consultoria-financiera/auth",
    "@consultoria-financiera/db",
    "@consultoria-financiera/api",
  ],
  // Turbopack configuration for Next.js 16
  turbopack: {
    // pdf-parse will be handled via dynamic import in the route handler
  },
};

export default nextConfig;
