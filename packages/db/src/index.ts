import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { type NeonHttpDatabase, drizzle } from "drizzle-orm/neon-http";

let _db: NeonHttpDatabase | null = null;
let _sql: NeonQueryFunction<false, false> | null = null;

function getDb(): NeonHttpDatabase {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    _sql = neon(process.env.DATABASE_URL);
    _db = drizzle(_sql);
  }
  return _db;
}

export const db = new Proxy({} as NeonHttpDatabase, {
  get(_, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export * from "./schema/auth";
export * from "./schema/clients";
export * from "./schema/templates";
export * from "./schema/todo";
export * from "./schema/upload";
export * from "./schema/accounting";
export * from "./mappings";
