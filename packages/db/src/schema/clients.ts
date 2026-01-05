import { relations } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { clientCompanyTypeValues, clientSectorValues } from "../mappings";
import { user } from "./auth";

// Enum for client sector (Sector_Cliente)
export const clientSectorEnum = pgEnum(
  "client_sector",
  clientSectorValues as [string, ...string[]],
);

// Enum for client company type (Tipo_Empresa_Cliente)
export const clientCompanyTypeEnum = pgEnum(
  "client_company_type",
  clientCompanyTypeValues as [string, ...string[]],
);

// Clients master table (Tabla maestra de clientes)
export const clients = pgTable("clients", {
  // ID_Cliente: Unique auto-generated identifier (UUID)
  id: uuid("id").defaultRandom().primaryKey(),

  // CIF_Cliente: Tax ID (CIF in Spain), unique, required, alphanumeric
  taxId: text("tax_id").notNull().unique(),

  // Nombre_Cliente: Client name, required, alphanumeric
  name: text("name").notNull(),

  // Sector_Cliente: Client sector, required, list format
  sector: clientSectorEnum("sector").notNull(),

  // Tipo_Empresa_Cliente: Company type, required, list format
  companyType: clientCompanyTypeEnum("company_type").notNull(),

  // ID_Grupo_Cliente: Group identifier, optional (reference to parent client)
  groupId: uuid("group_id"),

  // CIF_Grupo_Cliente: Group Tax ID, unique, optional, alphanumeric
  groupTaxId: text("group_tax_id").unique(),

  // Email_Cliente: Email, unique, required
  email: text("email").notNull().unique(),

  // Teléfono_Cliente: Phone, unique, required
  phone: text("phone").notNull().unique(),

  // Dirección_Cliente: Postal address, optional
  address: text("address"),

  // Notas: Additional notes
  notes: text("notes"),

  // Estado del onboarding contable: Accounting onboarding status
  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),

  // Usuario que creó el cliente: User who created the client
  createdBy: text("created_by").references(() => user.id),

  // Campos de auditoría: Audit fields
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations for corporate groups (Relaciones para grupos de empresas - self-reference)
export const clientsRelations = relations(clients, ({ one, many }) => ({
  // grupoCliente: Parent group reference
  parentGroup: one(clients, {
    fields: [clients.groupId],
    references: [clients.id],
    relationName: "clientGroup",
  }),
  // clientesDelGrupo: Subsidiaries in the group
  subsidiaries: many(clients, {
    relationName: "clientGroup",
  }),
}));
