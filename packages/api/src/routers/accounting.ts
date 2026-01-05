import {
  type AccountType,
  bulkCreateChartAccounts,
  bulkCreateMappings,
  createChartAccount,
  createMapping,
  deleteMapping,
  getChartOfAccounts,
  getClientMappings,
  getClientWithMappingStats,
  getUnmappedAccounts,
  registerUnmappedAccount,
  resolveAccountCode,
  suggestMapping,
} from "@consultoria-financiera/core/accounting";
import {
  completeOnboarding,
  searchClients,
} from "@consultoria-financiera/core/clients";
import { z } from "zod";
import { unwrapResultAsync } from "../lib/error-mapper";
import { protectedProcedure, router } from "../trpc";

// Schemas de validación
const accountTypeEnum = z.enum([
  "asset",
  "liability",
  "equity",
  "income",
  "expense",
]);

const createChartAccountSchema = z.object({
  code: z.string().min(1).max(10),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  level: z.number().int().min(1).max(5),
  parentCode: z.string().optional(),
  type: accountTypeEnum,
});

const createClientSchema = z.object({
  taxId: z.string().min(1).max(20),
  name: z.string().min(1).max(200),
  sector: z.enum([
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
  ]),
  companyType: z.enum([
    "Comercializador sin stock",
    "Comercializador con stock",
    "Servicios",
    "Productor",
  ]),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().optional(),
  notes: z.string().optional(),
});

const createMappingSchema = z.object({
  clientId: z.string().uuid(),
  clientAccountCode: z.string().min(1),
  clientAccountName: z.string().optional(),
  internalAccountId: z.string().uuid(),
  notes: z.string().optional(),
});

const bulkCreateMappingsSchema = z.object({
  clientId: z.string().uuid(),
  mappings: z.array(
    z.object({
      clientAccountCode: z.string().min(1),
      clientAccountName: z.string().optional(),
      internalAccountId: z.string().uuid(),
      notes: z.string().optional(),
    }),
  ),
});

export const accountingRouter = router({
  // ============ PLAN CONTABLE INTERNO ============

  getChartOfAccounts: protectedProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          type: accountTypeEnum.optional(),
          level: z.number().int().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return unwrapResultAsync(
        getChartOfAccounts(ctx.db, {
          search: input?.search,
          type: input?.type as AccountType | undefined,
          level: input?.level,
        }),
      );
    }),

  createChartAccount: protectedProcedure
    .input(createChartAccountSchema)
    .mutation(async ({ ctx, input }) => {
      return unwrapResultAsync(
        createChartAccount(ctx.db, {
          code: input.code,
          name: input.name,
          description: input.description,
          level: input.level,
          parentCode: input.parentCode,
          type: input.type as AccountType,
        }),
      );
    }),

  bulkCreateChartAccounts: protectedProcedure
    .input(z.array(createChartAccountSchema))
    .mutation(async ({ ctx, input }) => {
      return unwrapResultAsync(
        bulkCreateChartAccounts(
          ctx.db,
          input.map((acc) => ({
            code: acc.code,
            name: acc.name,
            description: acc.description,
            level: acc.level,
            parentCode: acc.parentCode,
            type: acc.type as AccountType,
          })),
        ),
      );
    }),

  // ============ CLIENTES ============

  getClients: protectedProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          onlyPendingOnboarding: z.boolean().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return unwrapResultAsync(
        searchClients(ctx.db, {
          search: input?.search,
          onlyPendingOnboarding: input?.onlyPendingOnboarding,
        }),
      );
    }),

  getClientById: protectedProcedure
    .input(z.object({ clientId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return unwrapResultAsync(
        getClientWithMappingStats(ctx.db, input.clientId),
      );
    }),

  completeOnboarding: protectedProcedure
    .input(z.object({ clientId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return unwrapResultAsync(completeOnboarding(ctx.db, input.clientId));
    }),

  // ============ MAPEOS DE CUENTAS ============

  getClientMappings: protectedProcedure
    .input(
      z.object({
        clientId: z.string().uuid(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return unwrapResultAsync(
        getClientMappings(ctx.db, input.clientId, input.search),
      );
    }),

  createMapping: protectedProcedure
    .input(createMappingSchema)
    .mutation(async ({ ctx, input }) => {
      return unwrapResultAsync(
        createMapping(ctx.db, {
          clientId: input.clientId,
          clientAccountCode: input.clientAccountCode,
          clientAccountName: input.clientAccountName,
          internalAccountId: input.internalAccountId,
          notes: input.notes,
        }),
      );
    }),

  bulkCreateMappings: protectedProcedure
    .input(bulkCreateMappingsSchema)
    .mutation(async ({ ctx, input }) => {
      return unwrapResultAsync(
        bulkCreateMappings(ctx.db, input.clientId, input.mappings),
      );
    }),

  deleteMapping: protectedProcedure
    .input(z.object({ mappingId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await unwrapResultAsync(deleteMapping(ctx.db, input.mappingId));
      return { success: true };
    }),

  // ============ CUENTAS SIN MAPEAR ============

  getUnmappedAccounts: protectedProcedure
    .input(
      z.object({
        clientId: z.string().uuid(),
        includeResolved: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return unwrapResultAsync(
        getUnmappedAccounts(ctx.db, input.clientId, input.includeResolved),
      );
    }),

  registerUnmappedAccount: protectedProcedure
    .input(
      z.object({
        clientId: z.string().uuid(),
        accountCode: z.string().min(1),
        accountName: z.string().optional(),
        sourceDocument: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return unwrapResultAsync(
        registerUnmappedAccount(ctx.db, {
          clientId: input.clientId,
          accountCode: input.accountCode,
          accountName: input.accountName,
          sourceDocument: input.sourceDocument,
        }),
      );
    }),

  resolveAccountCode: protectedProcedure
    .input(
      z.object({
        clientId: z.string().uuid(),
        clientAccountCode: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return unwrapResultAsync(
        resolveAccountCode(ctx.db, input.clientId, input.clientAccountCode),
      );
    }),

  suggestMapping: protectedProcedure
    .input(
      z.object({
        clientAccountCode: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return unwrapResultAsync(suggestMapping(ctx.db, input.clientAccountCode));
    }),
});
