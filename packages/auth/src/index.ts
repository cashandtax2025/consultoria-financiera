import { db } from "@consultoria-financiera/db";
import * as schema from "@consultoria-financiera/db/schema/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { localization } from "better-auth-localization";

// Check if we have a valid database URL
const hasDatabaseUrl = process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "";

// Create auth instance - handle database connection gracefully
let authInstance: any;

try {
  if (hasDatabaseUrl) {
    authInstance = betterAuth({
      database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema,
      }),
      trustedOrigins: [process.env.CORS_ORIGIN || ""],
      emailAndPassword: {
        enabled: true,
      },
      session: {
        cookieCache: {
          enabled: true,
          maxAge: 5 * 60, // Cache for 5 minutes to reduce DB calls
        },
      },
      plugins: [
        localization({
          defaultLocale: "es-ES",
          fallbackLocale: "default", // Fallback to English if translation is missing
        }),
        admin(),
        nextCookies(),
      ],
    });
  } else {
    // Fallback configuration for builds without database
    authInstance = {
      handler: async () => new Response(JSON.stringify({ error: "Database not configured" }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }),
      api: {
        getSession: async () => null,
      },
      $Infer: {
        Session: {
          user: {
            id: "",
            name: "",
            email: "",
            role: "user",
          },
        },
      },
    };
  }
} catch (error) {
  // Fallback if database connection fails during build
  console.warn("Database connection failed, using fallback auth:", error);
  authInstance = {
    handler: async () => new Response(JSON.stringify({ error: "Database connection failed" }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    }),
    api: {
      getSession: async () => null,
    },
    $Infer: {
      Session: {
        user: {
          id: "",
          name: "",
          email: "",
          role: "user",
        },
      },
    },
  };
}

export const auth = authInstance;

// Export inferred types from better-auth with admin plugin
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

// Re-export the auth instance type for client-side type inference
export type Auth = typeof auth;
