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
};

export default nextConfig;
