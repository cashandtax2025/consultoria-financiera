import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

// Plan contable interno (nuestro plan contable estándar)
export const chartOfAccounts = pgTable("chart_of_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(), // e.g., "217", "430", "572"
  name: text("name").notNull(), // e.g., "Equipos para Proceso de Información"
  description: text("description"),
  level: integer("level").notNull(), // 1, 2, 3 (nivel de agrupación)
  parentCode: text("parent_code"), // código padre para jerarquía
  type: text("type").notNull(), // asset, liability, equity, income, expense
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Clientes (para asociar mapeos)
export const clients = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  taxId: text("tax_id"), // CIF/NIF
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  notes: text("notes"),
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Mapeo de cuentas del cliente a nuestro plan contable
export const accountMappings = pgTable(
  "account_mappings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    clientAccountCode: text("client_account_code").notNull(), // e.g., "2171", "21710001"
    clientAccountName: text("client_account_name"), // nombre original del cliente
    internalAccountId: uuid("internal_account_id")
      .notNull()
      .references(() => chartOfAccounts.id),
    notes: text("notes"), // notas sobre el mapeo
    autoMapped: boolean("auto_mapped").notNull().default(false), // si fue mapeado automáticamente
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("account_mappings_client_idx").on(table.clientId),
    index("account_mappings_client_code_idx").on(
      table.clientId,
      table.clientAccountCode,
    ),
  ],
);

// Cuentas pendientes de mapear (cuando aparecen nuevas en importaciones)
export const unmappedAccounts = pgTable(
  "unmapped_accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    accountCode: text("account_code").notNull(),
    accountName: text("account_name"),
    firstSeenAt: timestamp("first_seen_at").notNull().defaultNow(),
    occurrences: integer("occurrences").notNull().default(1), // cuántas veces ha aparecido
    sourceDocument: text("source_document"), // de qué documento vino
    resolved: boolean("resolved").notNull().default(false),
    resolvedAt: timestamp("resolved_at"),
  },
  (table) => [
    index("unmapped_accounts_client_idx").on(table.clientId),
    index("unmapped_accounts_pending_idx").on(table.clientId, table.resolved),
  ],
);
