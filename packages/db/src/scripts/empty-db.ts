import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars (script runs from packages/db/, __dirname is packages/db/src/scripts/)
dotenv.config({
  path: join(__dirname, "../../../../apps/web/.env.local"),
});
dotenv.config({
  path: join(__dirname, "../../../../apps/web/.env"),
});

const neonSql = neon(process.env.DATABASE_URL || "");
const db = drizzle(neonSql);

async function emptyDatabase() {
  console.log("🗑️  Dropping all tables and types...\n");

  // Drop all tables with CASCADE
  await db.execute(
    sql.raw(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
        RAISE NOTICE 'Dropped table: %', r.tablename;
      END LOOP;
    END $$;
  `),
  );
  console.log("✓ All tables dropped");

  // Drop all custom types/enums
  await db.execute(
    sql.raw(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT typname FROM pg_type WHERE typtype = 'e' AND typnamespace = 'public'::regnamespace) LOOP
        EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
        RAISE NOTICE 'Dropped type: %', r.typname;
      END LOOP;
    END $$;
  `),
  );
  console.log("✓ All custom types dropped");

  console.log("\n✅ Database emptied successfully!");
}

emptyDatabase().catch((error) => {
  console.error("❌ Error emptying database:", error.message);
  console.error(error);
  process.exit(1);
});
