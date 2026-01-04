import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL || "");
export const db = drizzle(sql);

export * from "./schema/auth";
export * from "./schema/templates";
export * from "./schema/todo";
export * from "./schema/upload";
