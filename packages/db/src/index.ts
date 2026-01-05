import { type NeonQueryFunction, neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

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

export type { SQL } from "drizzle-orm";
// Re-export drizzle-orm utilities for consumers
export {
  and,
  asc,
  avg,
  between,
  count,
  desc,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  like,
  lt,
  lte,
  max,
  min,
  ne,
  notInArray,
  or,
  sql,
  sum,
} from "drizzle-orm";
export type { NeonHttpDatabase } from "drizzle-orm/neon-http";
export * from "./mappings";
export * from "./schema/accounting";
export * from "./schema/auth";
export * from "./schema/clients";
export * from "./schema/templates";
export * from "./schema/upload";
