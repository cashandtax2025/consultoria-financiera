import { integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enum para Sector_Cliente
export const sectorClienteEnum = pgEnum("sector_cliente", [
  "Restaurantes",
  "Hoteles",
  "Agencias de Viajes y Turismo",
  "Asesorías y Bufetes",
  "Agencias Marketing y Publicidad",
  "Promoción e Intermediación Inmobiliaria",
  "Especialistas de construcción",
  "Agricultura",
  "Ganadería",
  "Pesca",
  "Industria Alimentaria",
  "Industria Manufacturera",
  "Ecommerce",
  "Transporte",
  "Agencia Logística",
  "Consultoría IT",
  "Educación",
  "Clínicas",
  "Gimnasios",
  "Comercio retail",
  "Otros servicios profesionales",
  "Peluquerías y Salones de Belleza",
  "Panaderías",
  "Fruterías",
  "Supermercados",
  "Carnicerías",
  "Pescaderías",
  "Estancos",
  "Farmacias",
  "Talleres",
]);

// Enum para Tipo_Empresa_Cliente
export const tipoEmpresaClienteEnum = pgEnum("tipo_empresa_cliente", [
  "Comercializador sin stock",
  "Comercializador con stock",
  "Servicios",
  "Productor",
]);

// Tabla maestra de clientes
export const clients = pgTable("clients", {
  // ID_Cliente: Identificador único automático
  id: serial("id_cliente").primaryKey(),

  // CIF_Cliente: CIF único, obligatorio, alfanumérico
  cifCliente: text("cif_cliente").notNull().unique(),

  // Nombre_Cliente: Nombre del cliente, obligatorio, alfanumérico
  nombreCliente: text("nombre_cliente").notNull(),

  // Sector_Cliente: Sector del cliente, obligatorio, formato lista
  sectorCliente: sectorClienteEnum("sector_cliente").notNull(),

  // Tipo_Empresa_Cliente: Tipo de empresa, obligatorio, formato lista
  tipoEmpresaCliente: tipoEmpresaClienteEnum("tipo_empresa_cliente").notNull(),

  // ID_Grupo_Cliente: Identificador del grupo (automático al indicar CIF_Grupo_Cliente), opcional
  // Se implementa como referencia opcional a otro cliente o null
  // La foreign key se añadirá en la migración
  idGrupoCliente: integer("id_grupo_cliente"),

  // CIF_Grupo_Cliente: CIF del grupo, único, opcional, alfanumérico
  cifGrupoCliente: text("cif_grupo_cliente").unique(),

  // Email_Cliente: Email único, obligatorio
  emailCliente: text("email_cliente").notNull().unique(),

  // Teléfono_Cliente: Teléfono único, obligatorio
  telefonoCliente: text("telefono_cliente").notNull().unique(),

  // Dirección_Cliente: Dirección postal, opcional
  direccionCliente: text("direccion_cliente"),

  // Campos de auditoría
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relaciones para grupos de empresas (self-reference)
export const clientsRelations = relations(clients, ({ one, many }) => ({
  grupoCliente: one(clients, {
    fields: [clients.idGrupoCliente],
    references: [clients.id],
    relationName: "grupoCliente",
  }),
  clientesDelGrupo: many(clients, {
    relationName: "grupoCliente",
  }),
}));

