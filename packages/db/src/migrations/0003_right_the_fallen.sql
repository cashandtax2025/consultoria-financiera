-- Eliminar tabla clients antigua y sus dependencias
DROP TABLE IF EXISTS "unmapped_accounts" CASCADE;
DROP TABLE IF EXISTS "account_mappings" CASCADE;
DROP TABLE IF EXISTS "clients" CASCADE;
--> statement-breakpoint
CREATE TYPE "public"."sector_cliente" AS ENUM('Restaurantes', 'Hoteles', 'Agencias de Viajes y Turismo', 'Asesorías y Bufetes', 'Agencias Marketing y Publicidad', 'Promoción e Intermediación Inmobiliaria', 'Especialistas de construcción', 'Agricultura', 'Ganadería', 'Pesca', 'Industria Alimentaria', 'Industria Manufacturera', 'Ecommerce', 'Transporte', 'Agencia Logística', 'Consultoría IT', 'Educación', 'Clínicas', 'Gimnasios', 'Comercio retail', 'Otros servicios profesionales', 'Peluquerías y Salones de Belleza', 'Panaderías', 'Fruterías', 'Supermercados', 'Carnicerías', 'Pescaderías', 'Estancos', 'Farmacias', 'Talleres');--> statement-breakpoint
CREATE TYPE "public"."tipo_empresa_cliente" AS ENUM('Comercializador sin stock', 'Comercializador con stock', 'Servicios', 'Productor');--> statement-breakpoint
CREATE TABLE "clients" (
	"id_cliente" serial PRIMARY KEY NOT NULL,
	"cif_cliente" text NOT NULL,
	"nombre_cliente" text NOT NULL,
	"sector_cliente" "sector_cliente" NOT NULL,
	"tipo_empresa_cliente" "tipo_empresa_cliente" NOT NULL,
	"id_grupo_cliente" integer,
	"cif_grupo_cliente" text,
	"email_cliente" text NOT NULL,
	"telefono_cliente" text NOT NULL,
	"direccion_cliente" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_cif_cliente_unique" UNIQUE("cif_cliente"),
	CONSTRAINT "clients_cif_grupo_cliente_unique" UNIQUE("cif_grupo_cliente"),
	CONSTRAINT "clients_email_cliente_unique" UNIQUE("email_cliente"),
	CONSTRAINT "clients_telefono_cliente_unique" UNIQUE("telefono_cliente")
);
--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_id_grupo_cliente_clients_id_cliente_fk" FOREIGN KEY ("id_grupo_cliente") REFERENCES "public"."clients"("id_cliente") ON DELETE no action ON UPDATE no action;
