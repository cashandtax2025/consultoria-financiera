import { db } from "@consultoria-financiera/db";
import { clients } from "@consultoria-financiera/db/schema/clients";
import { eq } from "drizzle-orm";
import z from "zod";
import { adminProcedure, router } from "../trpc";

// Esquemas de validación
const sectorClienteSchema = z.enum([
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

const tipoEmpresaClienteSchema = z.enum([
  "Comercializador sin stock",
  "Comercializador con stock",
  "Servicios",
  "Productor",
]);

const createClientSchema = z.object({
  cifCliente: z.string().min(1, "El CIF es obligatorio"),
  nombreCliente: z.string().min(1, "El nombre es obligatorio"),
  sectorCliente: sectorClienteSchema,
  tipoEmpresaCliente: tipoEmpresaClienteSchema,
  idGrupoCliente: z.number().int().positive().nullable().optional(),
  cifGrupoCliente: z.string().nullable().optional(),
  emailCliente: z.string().email("Email inválido"),
  telefonoCliente: z.string().min(1, "El teléfono es obligatorio"),
  direccionCliente: z.string().nullable().optional(),
});

const updateClientSchema = createClientSchema.partial().extend({
  id: z.number().int().positive(),
});

export const clientsRouter = router({
  getAll: adminProcedure.query(async () => {
    return await db.select().from(clients).orderBy(clients.id);
  }),

  getById: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(clients)
        .where(eq(clients.id, input.id))
        .limit(1);
      return result[0] || null;
    }),

  create: adminProcedure
    .input(createClientSchema)
    .mutation(async ({ input }) => {
      // Si se proporciona CIF_Grupo_Cliente, buscar el ID del grupo
      let idGrupoCliente: number | undefined = input.idGrupoCliente ?? undefined;
      
      if (input.cifGrupoCliente && !idGrupoCliente) {
        const grupoResult = await db
          .select({ id: clients.id })
          .from(clients)
          .where(eq(clients.cifCliente, input.cifGrupoCliente))
          .limit(1);
        
        if (grupoResult.length > 0) {
          idGrupoCliente = grupoResult[0].id;
        }
      }

      const result = await db
        .insert(clients)
        .values({
          cifCliente: input.cifCliente,
          nombreCliente: input.nombreCliente,
          sectorCliente: input.sectorCliente,
          tipoEmpresaCliente: input.tipoEmpresaCliente,
          idGrupoCliente: idGrupoCliente ?? undefined,
          cifGrupoCliente: input.cifGrupoCliente ?? undefined,
          emailCliente: input.emailCliente,
          telefonoCliente: input.telefonoCliente,
          direccionCliente: input.direccionCliente ?? undefined,
        })
        .returning();

      return result[0];
    }),

  update: adminProcedure
    .input(updateClientSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      // Si se actualiza CIF_Grupo_Cliente, buscar el ID del grupo
      let idGrupoCliente: number | undefined = data.idGrupoCliente ?? undefined;
      
      if (data.cifGrupoCliente !== undefined && idGrupoCliente === undefined) {
        if (data.cifGrupoCliente) {
          const grupoResult = await db
            .select({ id: clients.id })
            .from(clients)
            .where(eq(clients.cifCliente, data.cifGrupoCliente))
            .limit(1);
          
          if (grupoResult.length > 0) {
            idGrupoCliente = grupoResult[0].id;
          } else {
            idGrupoCliente = undefined;
          }
        } else {
          idGrupoCliente = undefined;
        }
      }

      const updateData: typeof data = { ...data };
      if (idGrupoCliente !== undefined) {
        updateData.idGrupoCliente = idGrupoCliente;
      } else if (data.cifGrupoCliente === null || data.cifGrupoCliente === "") {
        updateData.idGrupoCliente = undefined;
      }

      const result = await db
        .update(clients)
        .set(updateData)
        .where(eq(clients.id, id))
        .returning();

      return result[0] || null;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await db.delete(clients).where(eq(clients.id, input.id));
      return { success: true };
    }),
});

