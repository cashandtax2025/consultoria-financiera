import { nextCookies } from 'better-auth/next-js';
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { localization } from "better-auth-localization";
import { db } from "@consultoria-financiera/db";
import * as schema from "@consultoria-financiera/db/schema/auth";

export const auth = betterAuth<BetterAuthOptions>({
	database: drizzleAdapter(db, {
		provider: "pg",

		schema: schema,
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		nextCookies(),
		localization({
			defaultLocale: "es-ES",
			fallbackLocale: "default", // Fallback to English if translation is missing
		}),
	],
});
