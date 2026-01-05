import {
  clientService,
  searchClients,
} from "@consultoria-financiera/core/clients";
import z from "zod";
import { unwrapResultAsync } from "../lib/error-mapper";
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
  getAll: adminProcedure.query(async ({ ctx }) => {
    return unwrapResultAsync(clientService.getAll(ctx.db));
  }),

  getById: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return unwrapResultAsync(clientService.getById(ctx.db, input.id));
    }),

  create: adminProcedure
    .input(createClientSchema)
    .mutation(async ({ ctx, input }) => {
      return unwrapResultAsync(
        clientService.create(ctx.db, {
          taxId: input.taxId,
          name: input.name,
          sector: input.sector,
          companyType: input.companyType,
          email: input.email,
          phone: input.phone,
          address: input.address ?? undefined,
          groupId: input.groupId ?? undefined,
          groupTaxId: input.groupTaxId ?? undefined,
        }),
      );
    }),

  update: adminProcedure
    .input(updateClientSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return unwrapResultAsync(
        clientService.update(ctx.db, id, {
          taxId: data.taxId,
          name: data.name,
          sector: data.sector,
          companyType: data.companyType,
          email: data.email,
          phone: data.phone,
          address: data.address ?? undefined,
          groupId: data.groupId ?? undefined,
          groupTaxId: data.groupTaxId ?? undefined,
        }),
      );
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await unwrapResultAsync(clientService.delete(ctx.db, input.id));
      return { success: true };
    }),
});
