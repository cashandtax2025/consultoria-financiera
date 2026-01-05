import {
  accountMappings,
  chartOfAccounts,
  unmappedAccounts,
} from "@consultoria-financiera/db/schema/accounting";
import { clients } from "@consultoria-financiera/db/schema/clients";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
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

  // Obtener todo el plan contable
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
      const conditions = [];

      if (input?.search) {
        conditions.push(
          sql`(${chartOfAccounts.code} ILIKE ${`%${input.search}%`} OR ${chartOfAccounts.name} ILIKE ${`%${input.search}%`})`,
        );
      }

      if (input?.type) {
        conditions.push(eq(chartOfAccounts.type, input.type));
      }

      if (input?.level) {
        conditions.push(eq(chartOfAccounts.level, input.level));
      }

      conditions.push(eq(chartOfAccounts.isActive, true));

      const accounts = await ctx.db
        .select()
        .from(chartOfAccounts)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(asc(chartOfAccounts.code));

      return accounts;
    }),

  // Crear cuenta en el plan contable
  createChartAccount: protectedProcedure
    .input(createChartAccountSchema)
    .mutation(async ({ ctx, input }) => {
      const [account] = await ctx.db
        .insert(chartOfAccounts)
        .values({
          code: input.code,
          name: input.name,
          description: input.description,
          level: input.level,
          parentCode: input.parentCode,
          type: input.type,
        })
        .returning();

      return account;
    }),

  // Crear múltiples cuentas en el plan contable (para seed inicial)
  bulkCreateChartAccounts: protectedProcedure
    .input(z.array(createChartAccountSchema))
    .mutation(async ({ ctx, input }) => {
      if (input.length === 0) return [];

      const accounts = await ctx.db
        .insert(chartOfAccounts)
        .values(
          input.map((acc) => ({
            code: acc.code,
            name: acc.name,
            description: acc.description,
            level: acc.level,
            parentCode: acc.parentCode,
            type: acc.type,
          })),
        )
        .onConflictDoNothing()
        .returning();

      return accounts;
    }),

  // ============ CLIENTES ============

  // Obtener todos los clientes
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
      const conditions = [];

      if (input?.search) {
        conditions.push(
          sql`(${clients.name} ILIKE ${`%${input.search}%`} OR ${clients.taxId} ILIKE ${`%${input.search}%`})`,
        );
      }

      if (input?.onlyPendingOnboarding) {
        conditions.push(eq(clients.onboardingCompleted, false));
      }

      const clientList = await ctx.db
        .select()
        .from(clients)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(asc(clients.name));

      return clientList;
    }),

  // Obtener cliente por ID
  getClientById: protectedProcedure
    .input(z.object({ clientId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [client] = await ctx.db
        .select()
        .from(clients)
        .where(eq(clients.id, input.clientId));

      if (!client) {
        throw new Error("Cliente no encontrado");
      }

      // Obtener estadísticas de mapeo
      const mappingCount = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(accountMappings)
        .where(eq(accountMappings.clientId, input.clientId));

      const unmappedCount = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(unmappedAccounts)
        .where(
          and(
            eq(unmappedAccounts.clientId, input.clientId),
            eq(unmappedAccounts.resolved, false),
          ),
        );

      return {
        ...client,
        mappedAccountsCount: Number(mappingCount[0]?.count || 0),
        unmappedAccountsCount: Number(unmappedCount[0]?.count || 0),
      };
    }),

  // Crear cliente
  createClient: protectedProcedure
    .input(createClientSchema)
    .mutation(async ({ ctx, input }) => {
      const [client] = await ctx.db
        .insert(clients)
        .values({
          taxId: input.taxId,
          name: input.name,
          sector: input.sector,
          companyType: input.companyType,
          email: input.email,
          phone: input.phone,
          address: input.address,
          notes: input.notes,
          createdBy: ctx.session.user.id,
        })
        .returning();

      return client;
    }),

  // Actualizar cliente
  updateClient: protectedProcedure
    .input(
      z.object({
        clientId: z.string().uuid(),
        data: createClientSchema.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [client] = await ctx.db
        .update(clients)
        .set({
          ...input.data,
          updatedAt: new Date(),
        })
        .where(eq(clients.id, input.clientId))
        .returning();

      return client;
    }),

  // Marcar onboarding como completado
  completeOnboarding: protectedProcedure
    .input(z.object({ clientId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [client] = await ctx.db
        .update(clients)
        .set({
          onboardingCompleted: true,
          updatedAt: new Date(),
        })
        .where(eq(clients.id, input.clientId))
        .returning();

      return client;
    }),

  // ============ MAPEOS DE CUENTAS ============

  // Obtener mapeos de un cliente
  getClientMappings: protectedProcedure
    .input(
      z.object({
        clientId: z.string().uuid(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(accountMappings.clientId, input.clientId)];

      if (input.search) {
        conditions.push(
          sql`(${accountMappings.clientAccountCode} ILIKE ${`%${input.search}%`} OR ${accountMappings.clientAccountName} ILIKE ${`%${input.search}%`})`,
        );
      }

      const mappings = await ctx.db
        .select({
          id: accountMappings.id,
          clientAccountCode: accountMappings.clientAccountCode,
          clientAccountName: accountMappings.clientAccountName,
          internalAccountId: accountMappings.internalAccountId,
          notes: accountMappings.notes,
          autoMapped: accountMappings.autoMapped,
          createdAt: accountMappings.createdAt,
          internalAccountCode: chartOfAccounts.code,
          internalAccountName: chartOfAccounts.name,
        })
        .from(accountMappings)
        .leftJoin(
          chartOfAccounts,
          eq(accountMappings.internalAccountId, chartOfAccounts.id),
        )
        .where(and(...conditions))
        .orderBy(asc(accountMappings.clientAccountCode));

      return mappings;
    }),

  // Crear un mapeo individual
  createMapping: protectedProcedure
    .input(createMappingSchema)
    .mutation(async ({ ctx, input }) => {
      // Verificar si ya existe un mapeo para este código
      const existing = await ctx.db
        .select()
        .from(accountMappings)
        .where(
          and(
            eq(accountMappings.clientId, input.clientId),
            eq(accountMappings.clientAccountCode, input.clientAccountCode),
          ),
        );

      if (existing.length > 0 && existing[0]) {
        // Actualizar el existente
        const [mapping] = await ctx.db
          .update(accountMappings)
          .set({
            internalAccountId: input.internalAccountId,
            clientAccountName: input.clientAccountName,
            notes: input.notes,
            updatedAt: new Date(),
          })
          .where(eq(accountMappings.id, existing[0].id))
          .returning();

        return mapping;
      }

      const [mapping] = await ctx.db
        .insert(accountMappings)
        .values({
          clientId: input.clientId,
          clientAccountCode: input.clientAccountCode,
          clientAccountName: input.clientAccountName,
          internalAccountId: input.internalAccountId,
          notes: input.notes,
        })
        .returning();

      // Si había una cuenta sin mapear, marcarla como resuelta
      await ctx.db
        .update(unmappedAccounts)
        .set({
          resolved: true,
          resolvedAt: new Date(),
        })
        .where(
          and(
            eq(unmappedAccounts.clientId, input.clientId),
            eq(unmappedAccounts.accountCode, input.clientAccountCode),
          ),
        );

      return mapping;
    }),

  // Crear múltiples mapeos (para onboarding)
  bulkCreateMappings: protectedProcedure
    .input(bulkCreateMappingsSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.mappings.length === 0) return [];

      const mappings = await ctx.db
        .insert(accountMappings)
        .values(
          input.mappings.map((m) => ({
            clientId: input.clientId,
            clientAccountCode: m.clientAccountCode,
            clientAccountName: m.clientAccountName,
            internalAccountId: m.internalAccountId,
            notes: m.notes,
          })),
        )
        .onConflictDoNothing()
        .returning();

      // Marcar como resueltas las cuentas sin mapear
      const codes = input.mappings.map((m) => m.clientAccountCode);
      await ctx.db
        .update(unmappedAccounts)
        .set({
          resolved: true,
          resolvedAt: new Date(),
        })
        .where(
          and(
            eq(unmappedAccounts.clientId, input.clientId),
            sql`${unmappedAccounts.accountCode} = ANY(${codes})`,
          ),
        );

      return mappings;
    }),

  // Eliminar mapeo
  deleteMapping: protectedProcedure
    .input(z.object({ mappingId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(accountMappings)
        .where(eq(accountMappings.id, input.mappingId));

      return { success: true };
    }),

  // ============ CUENTAS SIN MAPEAR ============

  // Obtener cuentas sin mapear de un cliente
  getUnmappedAccounts: protectedProcedure
    .input(
      z.object({
        clientId: z.string().uuid(),
        includeResolved: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(unmappedAccounts.clientId, input.clientId)];

      if (!input.includeResolved) {
        conditions.push(eq(unmappedAccounts.resolved, false));
      }

      const accounts = await ctx.db
        .select()
        .from(unmappedAccounts)
        .where(and(...conditions))
        .orderBy(desc(unmappedAccounts.occurrences));

      return accounts;
    }),

  // Registrar una cuenta sin mapear (llamado cuando se detecta una nueva)
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
      // Primero verificar si ya existe un mapeo
      const existingMapping = await ctx.db
        .select()
        .from(accountMappings)
        .where(
          and(
            eq(accountMappings.clientId, input.clientId),
            eq(accountMappings.clientAccountCode, input.accountCode),
          ),
        );

      if (existingMapping.length > 0) {
        // Ya está mapeada, devolver el mapeo existente
        return { alreadyMapped: true, mapping: existingMapping[0] };
      }

      // Verificar si ya existe como sin mapear
      const existing = await ctx.db
        .select()
        .from(unmappedAccounts)
        .where(
          and(
            eq(unmappedAccounts.clientId, input.clientId),
            eq(unmappedAccounts.accountCode, input.accountCode),
          ),
        );

      if (existing.length > 0 && existing[0]) {
        // Incrementar ocurrencias
        const [updated] = await ctx.db
          .update(unmappedAccounts)
          .set({
            occurrences: sql`${unmappedAccounts.occurrences} + 1`,
            accountName: input.accountName || existing[0].accountName,
          })
          .where(eq(unmappedAccounts.id, existing[0].id))
          .returning();

        return { alreadyMapped: false, unmapped: updated };
      }

      // Crear nuevo registro
      const [unmapped] = await ctx.db
        .insert(unmappedAccounts)
        .values({
          clientId: input.clientId,
          accountCode: input.accountCode,
          accountName: input.accountName,
          sourceDocument: input.sourceDocument,
        })
        .returning();

      return { alreadyMapped: false, unmapped };
    }),

  // Registrar múltiples cuentas y devolver las que necesitan mapeo
  checkAndRegisterAccounts: protectedProcedure
    .input(
      z.object({
        clientId: z.string().uuid(),
        accounts: z.array(
          z.object({
            code: z.string().min(1),
            name: z.string().optional(),
          }),
        ),
        sourceDocument: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const results = {
        mapped: [] as Array<{
          code: string;
          internalCode: string;
          internalName: string;
        }>,
        needsMapping: [] as Array<{ code: string; name?: string }>,
      };

      for (const account of input.accounts) {
        // Verificar si ya existe mapeo
        const existingMapping = await ctx.db
          .select({
            clientAccountCode: accountMappings.clientAccountCode,
            internalCode: chartOfAccounts.code,
            internalName: chartOfAccounts.name,
          })
          .from(accountMappings)
          .leftJoin(
            chartOfAccounts,
            eq(accountMappings.internalAccountId, chartOfAccounts.id),
          )
          .where(
            and(
              eq(accountMappings.clientId, input.clientId),
              eq(accountMappings.clientAccountCode, account.code),
            ),
          );

        const firstMapping = existingMapping[0];
        if (existingMapping.length > 0 && firstMapping?.internalCode) {
          results.mapped.push({
            code: account.code,
            internalCode: firstMapping.internalCode,
            internalName: firstMapping.internalName || "",
          });
        } else {
          results.needsMapping.push({
            code: account.code,
            name: account.name,
          });

          // Registrar como sin mapear
          const existing = await ctx.db
            .select()
            .from(unmappedAccounts)
            .where(
              and(
                eq(unmappedAccounts.clientId, input.clientId),
                eq(unmappedAccounts.accountCode, account.code),
              ),
            );

          if (existing.length === 0) {
            await ctx.db.insert(unmappedAccounts).values({
              clientId: input.clientId,
              accountCode: account.code,
              accountName: account.name,
              sourceDocument: input.sourceDocument,
            });
          } else if (existing[0]) {
            await ctx.db
              .update(unmappedAccounts)
              .set({
                occurrences: sql`${unmappedAccounts.occurrences} + 1`,
              })
              .where(eq(unmappedAccounts.id, existing[0].id));
          }
        }
      }

      return results;
    }),

  // Resolver cuenta mapeada (buscar el código interno dado un código de cliente)
  resolveAccountCode: protectedProcedure
    .input(
      z.object({
        clientId: z.string().uuid(),
        clientAccountCode: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const mapping = await ctx.db
        .select({
          internalAccountId: accountMappings.internalAccountId,
          internalCode: chartOfAccounts.code,
          internalName: chartOfAccounts.name,
        })
        .from(accountMappings)
        .leftJoin(
          chartOfAccounts,
          eq(accountMappings.internalAccountId, chartOfAccounts.id),
        )
        .where(
          and(
            eq(accountMappings.clientId, input.clientId),
            eq(accountMappings.clientAccountCode, input.clientAccountCode),
          ),
        );

      if (mapping.length === 0) {
        return null;
      }

      return mapping[0];
    }),

  // Sugerir mapeo automático basado en prefijo de código
  suggestMapping: protectedProcedure
    .input(
      z.object({
        clientAccountCode: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Buscar cuentas internas que coincidan por prefijo
      // Por ejemplo, si el cliente tiene 2171, buscar 217
      const code = input.clientAccountCode;

      // Probar con diferentes longitudes de prefijo
      const suggestions = [];

      for (let len = code.length; len >= 2; len--) {
        const prefix = code.substring(0, len);
        const matches = await ctx.db
          .select()
          .from(chartOfAccounts)
          .where(
            and(
              eq(chartOfAccounts.code, prefix),
              eq(chartOfAccounts.isActive, true),
            ),
          );

        if (matches.length > 0) {
          suggestions.push(...matches);
          break; // Encontramos coincidencia, no buscar más cortos
        }
      }

      return suggestions;
    }),
});
