import { db } from "@consultoria-financiera/db";
import { clients } from "@consultoria-financiera/db/schema/clients";
import { eq } from "drizzle-orm";
import z from "zod";
import { adminProcedure, router } from "../trpc";

// Validation schemas
const clientSectorSchema = z.enum([
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

const clientCompanyTypeSchema = z.enum([
  "Comercializador sin stock",
  "Comercializador con stock",
  "Servicios",
  "Productor",
]);

const createClientSchema = z.object({
  taxId: z.string().min(1, "Tax ID is required"),
  name: z.string().min(1, "Name is required"),
  sector: clientSectorSchema,
  companyType: clientCompanyTypeSchema,
  groupId: z.string().uuid().nullable().optional(),
  groupTaxId: z.string().nullable().optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().nullable().optional(),
});

const updateClientSchema = createClientSchema.partial().extend({
  id: z.string().uuid(),
});

export const clientsRouter = router({
  getAll: adminProcedure.query(async () => {
    return await db.select().from(clients).orderBy(clients.id);
  }),

  getById: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
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
      // If groupTaxId is provided, find the group ID
      let groupId: string | undefined = input.groupId ?? undefined;

      if (input.groupTaxId && !groupId) {
        const groupResult = await db
          .select({ id: clients.id })
          .from(clients)
          .where(eq(clients.taxId, input.groupTaxId))
          .limit(1);

        if (groupResult.length > 0 && groupResult[0]) {
          groupId = groupResult[0].id;
        }
      }

      const result = await db
        .insert(clients)
        .values({
          taxId: input.taxId,
          name: input.name,
          sector: input.sector,
          companyType: input.companyType,
          groupId: groupId ?? undefined,
          groupTaxId: input.groupTaxId ?? undefined,
          email: input.email,
          phone: input.phone,
          address: input.address ?? undefined,
        })
        .returning();

      return result[0];
    }),

  update: adminProcedure
    .input(updateClientSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      // If groupTaxId is being updated, find the group ID
      let groupId: string | undefined = data.groupId ?? undefined;

      if (data.groupTaxId !== undefined && groupId === undefined) {
        if (data.groupTaxId) {
          const groupResult = await db
            .select({ id: clients.id })
            .from(clients)
            .where(eq(clients.taxId, data.groupTaxId))
            .limit(1);

          if (groupResult.length > 0 && groupResult[0]) {
            groupId = groupResult[0].id;
          } else {
            groupId = undefined;
          }
        } else {
          groupId = undefined;
        }
      }

      const updateData: typeof data = { ...data };
      if (groupId !== undefined) {
        updateData.groupId = groupId;
      } else if (data.groupTaxId === null || data.groupTaxId === "") {
        updateData.groupId = undefined;
      }

      const result = await db
        .update(clients)
        .set(updateData)
        .where(eq(clients.id, id))
        .returning();

      return result[0] || null;
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await db.delete(clients).where(eq(clients.id, input.id));
      return { success: true };
    }),
});
