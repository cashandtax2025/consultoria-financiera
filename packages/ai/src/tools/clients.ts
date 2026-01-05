import { and, asc, db, eq, ilike, or, sql } from "@consultoria-financiera/db";
import {
  clientCompanyTypeLabels,
  clientSectorLabels,
  getLabel,
} from "@consultoria-financiera/db/mappings";
import {
  accountMappings,
  chartOfAccounts,
  unmappedAccounts,
} from "@consultoria-financiera/db/schema/accounting";
import { clients } from "@consultoria-financiera/db/schema/clients";
import { tool } from "ai";
import { z } from "zod";

/**
 * Tool to list all clients with optional filtering
 */
export const listClientsTool = tool({
  description:
    "Lista todos los clientes de la consultoría. Puede filtrar por nombre, CIF, sector o tipo de empresa. Útil para obtener una visión general de la cartera de clientes.",
  inputSchema: z.object({
    search: z
      .string()
      .optional()
      .describe(
        "Término de búsqueda para filtrar por nombre o CIF del cliente",
      ),
    sector: z
      .string()
      .optional()
      .describe(
        "Filtrar por sector (ej: restaurants, hotels, consulting_legal)",
      ),
    companyType: z
      .string()
      .optional()
      .describe(
        "Filtrar por tipo de empresa (trader_no_stock, trader_with_stock, services, producer)",
      ),
    onlyPendingOnboarding: z
      .boolean()
      .optional()
      .describe("Si es true, solo muestra clientes con onboarding pendiente"),
    limit: z
      .number()
      .optional()
      .default(20)
      .describe("Número máximo de clientes a retornar"),
  }),
  execute: async ({
    search,
    sector,
    companyType,
    onlyPendingOnboarding,
    limit,
  }) => {
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(clients.name, `%${search}%`),
          ilike(clients.taxId, `%${search}%`),
        ),
      );
    }

    if (sector) {
      conditions.push(
        eq(clients.sector, sector as typeof clients.$inferSelect.sector),
      );
    }

    if (companyType) {
      conditions.push(
        eq(
          clients.companyType,
          companyType as typeof clients.$inferSelect.companyType,
        ),
      );
    }

    if (onlyPendingOnboarding) {
      conditions.push(eq(clients.onboardingCompleted, false));
    }

    const result = await db
      .select()
      .from(clients)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(clients.name))
      .limit(limit);

    return {
      totalFound: result.length,
      clients: result.map((c) => ({
        id: c.id,
        name: c.name,
        taxId: c.taxId,
        sector: getLabel(clientSectorLabels, c.sector),
        sectorKey: c.sector,
        companyType: getLabel(clientCompanyTypeLabels, c.companyType),
        companyTypeKey: c.companyType,
        email: c.email,
        phone: c.phone,
        onboardingCompleted: c.onboardingCompleted,
        hasGroup: !!c.groupId,
      })),
    };
  },
});

/**
 * Tool to get detailed information about a specific client
 */
export const getClientDetailsTool = tool({
  description:
    "Obtiene información detallada de un cliente específico por su ID, nombre o CIF. Incluye datos de contacto, sector, tipo de empresa, notas y estado del onboarding.",
  inputSchema: z.object({
    identifier: z
      .string()
      .describe(
        "ID (UUID), nombre o CIF del cliente. Si es nombre, busca coincidencia parcial.",
      ),
  }),
  execute: async ({ identifier }) => {
    // Try to find by UUID first
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        identifier,
      );

    let client: typeof clients.$inferSelect | undefined;

    if (isUUID) {
      const result = await db
        .select()
        .from(clients)
        .where(eq(clients.id, identifier))
        .limit(1);
      client = result[0];
    } else {
      // Search by name or taxId
      const result = await db
        .select()
        .from(clients)
        .where(
          or(
            ilike(clients.name, `%${identifier}%`),
            ilike(clients.taxId, `%${identifier}%`),
          ),
        )
        .limit(1);
      client = result[0];
    }

    if (!client) {
      return {
        found: false,
        message: `No se encontró ningún cliente con el identificador: ${identifier}`,
      };
    }

    // Get group info if exists
    let parentGroup = null;
    if (client.groupId) {
      const groupResult = await db
        .select({ name: clients.name, taxId: clients.taxId })
        .from(clients)
        .where(eq(clients.id, client.groupId))
        .limit(1);
      parentGroup = groupResult[0];
    }

    // Get subsidiaries if any
    const subsidiaries = await db
      .select({ id: clients.id, name: clients.name, taxId: clients.taxId })
      .from(clients)
      .where(eq(clients.groupId, client.id));

    return {
      found: true,
      client: {
        id: client.id,
        name: client.name,
        taxId: client.taxId,
        sector: getLabel(clientSectorLabels, client.sector),
        sectorKey: client.sector,
        companyType: getLabel(clientCompanyTypeLabels, client.companyType),
        companyTypeKey: client.companyType,
        email: client.email,
        phone: client.phone,
        address: client.address,
        notes: client.notes,
        onboardingCompleted: client.onboardingCompleted,
        createdAt: client.createdAt.toISOString(),
        updatedAt: client.updatedAt.toISOString(),
        parentGroup: parentGroup
          ? {
              name: parentGroup.name,
              taxId: parentGroup.taxId,
            }
          : null,
        subsidiaries:
          subsidiaries.length > 0
            ? subsidiaries.map((s) => ({ name: s.name, taxId: s.taxId }))
            : null,
      },
    };
  },
});

/**
 * Tool to get accounting mapping status for a client
 */
export const getClientAccountingStatusTool = tool({
  description:
    "Obtiene el estado de mapeo contable de un cliente: cuántas cuentas tiene mapeadas, cuántas pendientes de mapear, y detalles de las cuentas sin mapear.",
  inputSchema: z.object({
    clientIdentifier: z.string().describe("ID, nombre o CIF del cliente"),
  }),
  execute: async ({ clientIdentifier }) => {
    // Find client first
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        clientIdentifier,
      );

    let client: typeof clients.$inferSelect | undefined;

    if (isUUID) {
      const result = await db
        .select()
        .from(clients)
        .where(eq(clients.id, clientIdentifier))
        .limit(1);
      client = result[0];
    } else {
      const result = await db
        .select()
        .from(clients)
        .where(
          or(
            ilike(clients.name, `%${clientIdentifier}%`),
            ilike(clients.taxId, `%${clientIdentifier}%`),
          ),
        )
        .limit(1);
      client = result[0];
    }

    if (!client) {
      return {
        found: false,
        message: `No se encontró el cliente: ${clientIdentifier}`,
      };
    }

    // Get mapped accounts count
    const mappedResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(accountMappings)
      .where(eq(accountMappings.clientId, client.id));

    // Get unmapped accounts
    const unmappedResult = await db
      .select()
      .from(unmappedAccounts)
      .where(
        and(
          eq(unmappedAccounts.clientId, client.id),
          eq(unmappedAccounts.resolved, false),
        ),
      )
      .orderBy(sql`${unmappedAccounts.occurrences} DESC`)
      .limit(10);

    const mappedCount = Number(mappedResult[0]?.count || 0);
    const unmappedCount = unmappedResult.length;

    return {
      found: true,
      clientName: client.name,
      clientId: client.id,
      onboardingCompleted: client.onboardingCompleted,
      accountingStatus: {
        mappedAccountsCount: mappedCount,
        pendingAccountsCount: unmappedCount,
        isFullyMapped: unmappedCount === 0 && mappedCount > 0,
        unmappedAccounts: unmappedResult.map((u) => ({
          code: u.accountCode,
          name: u.accountName,
          occurrences: u.occurrences,
          firstSeen: u.firstSeenAt.toISOString(),
          sourceDocument: u.sourceDocument,
        })),
      },
    };
  },
});

/**
 * Tool to get client statistics and summary
 */
export const getClientsStatsTool = tool({
  description:
    "Obtiene estadísticas generales de los clientes: total de clientes, distribución por sector, por tipo de empresa, clientes con onboarding pendiente, etc.",
  inputSchema: z.object({}),
  execute: async () => {
    // Total clients
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(clients);

    // By sector
    const bySectorResult = await db
      .select({
        sector: clients.sector,
        count: sql<number>`count(*)`,
      })
      .from(clients)
      .groupBy(clients.sector)
      .orderBy(sql`count(*) DESC`);

    // By company type
    const byTypeResult = await db
      .select({
        companyType: clients.companyType,
        count: sql<number>`count(*)`,
      })
      .from(clients)
      .groupBy(clients.companyType)
      .orderBy(sql`count(*) DESC`);

    // Pending onboarding
    const pendingOnboardingResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(clients)
      .where(eq(clients.onboardingCompleted, false));

    // Recent clients (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentClientsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(clients)
      .where(sql`${clients.createdAt} >= ${thirtyDaysAgo.toISOString()}`);

    return {
      totalClients: Number(totalResult[0]?.count || 0),
      pendingOnboarding: Number(pendingOnboardingResult[0]?.count || 0),
      newClientsLast30Days: Number(recentClientsResult[0]?.count || 0),
      bySector: bySectorResult.map((s) => ({
        sector: getLabel(clientSectorLabels, s.sector),
        sectorKey: s.sector,
        count: Number(s.count),
      })),
      byCompanyType: byTypeResult.map((t) => ({
        companyType: getLabel(clientCompanyTypeLabels, t.companyType),
        companyTypeKey: t.companyType,
        count: Number(t.count),
      })),
    };
  },
});

/**
 * Tool to search for a specific account mapping for a client
 */
export const getClientAccountMappingTool = tool({
  description:
    "Busca el mapeo de una cuenta contable específica de un cliente. Útil para saber a qué cuenta interna corresponde una cuenta del cliente.",
  inputSchema: z.object({
    clientIdentifier: z.string().describe("ID, nombre o CIF del cliente"),
    accountCode: z
      .string()
      .describe("Código de cuenta del cliente a buscar (ej: 4300001, 572)"),
  }),
  execute: async ({ clientIdentifier, accountCode }) => {
    // Find client
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        clientIdentifier,
      );

    let client: typeof clients.$inferSelect | undefined;

    if (isUUID) {
      const result = await db
        .select()
        .from(clients)
        .where(eq(clients.id, clientIdentifier))
        .limit(1);
      client = result[0];
    } else {
      const result = await db
        .select()
        .from(clients)
        .where(
          or(
            ilike(clients.name, `%${clientIdentifier}%`),
            ilike(clients.taxId, `%${clientIdentifier}%`),
          ),
        )
        .limit(1);
      client = result[0];
    }

    if (!client) {
      return {
        found: false,
        message: `No se encontró el cliente: ${clientIdentifier}`,
      };
    }

    // Search for the mapping
    const mapping = await db
      .select({
        clientAccountCode: accountMappings.clientAccountCode,
        clientAccountName: accountMappings.clientAccountName,
        internalCode: chartOfAccounts.code,
        internalName: chartOfAccounts.name,
        internalType: chartOfAccounts.type,
        notes: accountMappings.notes,
        autoMapped: accountMappings.autoMapped,
      })
      .from(accountMappings)
      .leftJoin(
        chartOfAccounts,
        eq(accountMappings.internalAccountId, chartOfAccounts.id),
      )
      .where(
        and(
          eq(accountMappings.clientId, client.id),
          ilike(accountMappings.clientAccountCode, `%${accountCode}%`),
        ),
      )
      .limit(5);

    if (mapping.length === 0) {
      return {
        found: true,
        clientName: client.name,
        mappingFound: false,
        message: `No se encontró mapeo para la cuenta ${accountCode} del cliente ${client.name}`,
      };
    }

    return {
      found: true,
      clientName: client.name,
      mappingFound: true,
      mappings: mapping.map((m) => ({
        clientAccount: {
          code: m.clientAccountCode,
          name: m.clientAccountName,
        },
        internalAccount: {
          code: m.internalCode,
          name: m.internalName,
          type: m.internalType,
        },
        notes: m.notes,
        wasAutoMapped: m.autoMapped,
      })),
    };
  },
});

/**
 * Tool to list available sectors and company types
 */
export const getAvailableCategoriesTool = tool({
  description:
    "Lista todos los sectores y tipos de empresa disponibles para clasificar clientes. Útil para entender las categorías disponibles.",
  inputSchema: z.object({}),
  execute: async () => {
    return {
      sectors: Object.entries(clientSectorLabels).map(([key, label]) => ({
        key,
        label,
      })),
      companyTypes: Object.entries(clientCompanyTypeLabels).map(
        ([key, label]) => ({
          key,
          label,
        }),
      ),
    };
  },
});
