import { db } from "@consultoria-financiera/db";
import * as schema from "@consultoria-financiera/db/schema/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { localization } from "better-auth-localization";

export const auth = betterAuth({
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

// Export inferred types from better-auth with admin plugin
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

// Re-export the auth instance type for client-side type inference
export type Auth = typeof auth;
