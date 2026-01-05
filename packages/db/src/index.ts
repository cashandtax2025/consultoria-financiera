// For development, we'll use a simple in-memory setup or local fallback
// In a real project, you'd want proper environment variables

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  // Production: Use PostgreSQL with Neon
  const { neon } = require("@neondatabase/serverless");
  const { drizzle } = require("drizzle-orm/neon-http");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required in production");
  }

  const sql = neon(process.env.DATABASE_URL);
  export const db = drizzle(sql);
} else {
  // Development: Use a mock setup that doesn't require external database
  // This will allow the app to start without database connection errors
  console.warn("⚠️  Using development mode without database. Authentication will not work.");

  // Create a mock db object that throws helpful errors
  export const db = {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: () => []
        })
      })
    }),
    insert: () => ({
      values: () => ({
        returning: () => {
          throw new Error("Database not configured. Please set DATABASE_URL environment variable.");
        }
      })
    }),
    update: () => ({
      set: () => ({
        where: () => ({
          returning: () => {
            throw new Error("Database not configured. Please set DATABASE_URL environment variable.");
          }
        })
      })
    }),
    delete: () => ({
      where: () => {
        throw new Error("Database not configured. Please set DATABASE_URL environment variable.");
      }
    })
  };
}

export * from "./schema/auth";
export * from "./schema/templates";
export * from "./schema/todo";
export * from "./schema/upload";
