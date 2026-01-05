import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load .env.local first (takes precedence), then .env as fallback
dotenv.config({
  path: "../../apps/web/.env.local",
});
dotenv.config({
  path: "../../apps/web/.env",
});

export default defineConfig({
  schema: "./src/schema",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});
