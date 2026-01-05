/**
 * Accounting domain business logic
 */
import {
  and,
  asc,
  type db as dbInstance,
  desc,
  eq,
  sql,
} from "@consultoria-financiera/db";
import {
  accountMappings,
  chartOfAccounts,
  unmappedAccounts,
} from "@consultoria-financiera/db/schema/accounting";
import { clients } from "@consultoria-financiera/db/schema/clients";
import { err, ok, ResultAsync } from "neverthrow";
import {
  AccountCodeAlreadyExistsError,
  AccountNotFoundError,
  DatabaseError,
  MappingNotFoundError,
} from "../errors";
import { ClientNotFoundError } from "../errors/clients";

// Types
export type ChartAccount = typeof chartOfAccounts.$inferSelect;
export type AccountMapping = typeof accountMappings.$inferSelect;
export type UnmappedAccount = typeof unmappedAccounts.$inferSelect;
type Database = typeof dbInstance;

export type AccountType =
  | "asset"
  | "liability"
  | "equity"
  | "income"
  | "expense";

export interface NewChartAccountInput {
  code: string;
  name: string;
  description?: string;
  level: number;
  parentCode?: string;
  type: AccountType;
}

export interface NewMappingInput {
  clientId: string;
  clientAccountCode: string;
  clientAccountName?: string;
  internalAccountId: string;
  notes?: string;
}

// Chart of Accounts operations
export function getChartOfAccounts(
  db: Database,
  options?: {
    search?: string;
    type?: AccountType;
    level?: number;
  },
): ResultAsync<ChartAccount[], DatabaseError> {
  return ResultAsync.fromPromise(
    (async () => {
      const conditions = [eq(chartOfAccounts.isActive, true)];

      if (options?.search) {
        conditions.push(
          sql`(${chartOfAccounts.code} ILIKE ${`%${options.search}%`} OR ${chartOfAccounts.name} ILIKE ${`%${options.search}%`})`,
        );
      }

      if (options?.type) {
        conditions.push(eq(chartOfAccounts.type, options.type));
      }

      if (options?.level) {
        conditions.push(eq(chartOfAccounts.level, options.level));
      }

      return db
        .select()
        .from(chartOfAccounts)
        .where(and(...conditions))
        .orderBy(asc(chartOfAccounts.code));
    })(),
    (e) => new DatabaseError("getChartOfAccounts", e),
  );
}

export function createChartAccount(
  db: Database,
  data: NewChartAccountInput,
): ResultAsync<ChartAccount, AccountCodeAlreadyExistsError | DatabaseError> {
  return ResultAsync.fromPromise(
    db
      .insert(chartOfAccounts)
      .values({
        code: data.code,
        name: data.name,
        description: data.description,
        level: data.level,
        parentCode: data.parentCode,
        type: data.type,
      })
      .returning()
      .then((r) => r[0]!),
    (e) => {
      const errorMsg = String(e);
      if (errorMsg.includes("code")) {
        return new AccountCodeAlreadyExistsError(data.code);
      }
      return new DatabaseError("createChartAccount", e);
    },
  );
}

export function bulkCreateChartAccounts(
  db: Database,
  accounts: NewChartAccountInput[],
): ResultAsync<ChartAccount[], DatabaseError> {
  if (accounts.length === 0) {
    return ResultAsync.fromSafePromise(Promise.resolve([]));
  }

  return ResultAsync.fromPromise(
    db
      .insert(chartOfAccounts)
      .values(
        accounts.map((acc) => ({
          code: acc.code,
          name: acc.name,
          description: acc.description,
          level: acc.level,
          parentCode: acc.parentCode,
          type: acc.type,
        })),
      )
      .onConflictDoNothing()
      .returning(),
    (e) => new DatabaseError("bulkCreateChartAccounts", e),
  );
}

// Account Mappings operations
export function getClientMappings(
  db: Database,
  clientId: string,
  search?: string,
): ResultAsync<
  (AccountMapping & {
    internalAccountCode: string | null;
    internalAccountName: string | null;
  })[],
  DatabaseError
> {
  return ResultAsync.fromPromise(
    (async () => {
      const conditions = [eq(accountMappings.clientId, clientId)];

      if (search) {
        conditions.push(
          sql`(${accountMappings.clientAccountCode} ILIKE ${`%${search}%`} OR ${accountMappings.clientAccountName} ILIKE ${`%${search}%`})`,
        );
      }

      return db
        .select({
          id: accountMappings.id,
          clientId: accountMappings.clientId,
          clientAccountCode: accountMappings.clientAccountCode,
          clientAccountName: accountMappings.clientAccountName,
          internalAccountId: accountMappings.internalAccountId,
          notes: accountMappings.notes,
          autoMapped: accountMappings.autoMapped,
          createdAt: accountMappings.createdAt,
          updatedAt: accountMappings.updatedAt,
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
    })(),
    (e) => new DatabaseError("getClientMappings", e),
  );
}

export function createMapping(
  db: Database,
  data: NewMappingInput,
): ResultAsync<AccountMapping, DatabaseError> {
  return ResultAsync.fromPromise(
    (async () => {
      // Check if mapping already exists
      const existing = await db
        .select()
        .from(accountMappings)
        .where(
          and(
            eq(accountMappings.clientId, data.clientId),
            eq(accountMappings.clientAccountCode, data.clientAccountCode),
          ),
        );

      if (existing.length > 0 && existing[0]) {
        // Update existing mapping
        const [mapping] = await db
          .update(accountMappings)
          .set({
            internalAccountId: data.internalAccountId,
            clientAccountName: data.clientAccountName,
            notes: data.notes,
            updatedAt: new Date(),
          })
          .where(eq(accountMappings.id, existing[0].id))
          .returning();

        return mapping!;
      }

      // Create new mapping
      const [mapping] = await db
        .insert(accountMappings)
        .values({
          clientId: data.clientId,
          clientAccountCode: data.clientAccountCode,
          clientAccountName: data.clientAccountName,
          internalAccountId: data.internalAccountId,
          notes: data.notes,
        })
        .returning();

      // Mark unmapped account as resolved if it exists
      await db
        .update(unmappedAccounts)
        .set({
          resolved: true,
          resolvedAt: new Date(),
        })
        .where(
          and(
            eq(unmappedAccounts.clientId, data.clientId),
            eq(unmappedAccounts.accountCode, data.clientAccountCode),
          ),
        );

      return mapping!;
    })(),
    (e) => new DatabaseError("createMapping", e),
  );
}

export function bulkCreateMappings(
  db: Database,
  clientId: string,
  mappings: Omit<NewMappingInput, "clientId">[],
): ResultAsync<AccountMapping[], DatabaseError> {
  if (mappings.length === 0) {
    return ResultAsync.fromSafePromise(Promise.resolve([]));
  }

  return ResultAsync.fromPromise(
    (async () => {
      const result = await db
        .insert(accountMappings)
        .values(
          mappings.map((m) => ({
            clientId,
            clientAccountCode: m.clientAccountCode,
            clientAccountName: m.clientAccountName,
            internalAccountId: m.internalAccountId,
            notes: m.notes,
          })),
        )
        .onConflictDoNothing()
        .returning();

      // Mark unmapped accounts as resolved
      const codes = mappings.map((m) => m.clientAccountCode);
      await db
        .update(unmappedAccounts)
        .set({
          resolved: true,
          resolvedAt: new Date(),
        })
        .where(
          and(
            eq(unmappedAccounts.clientId, clientId),
            sql`${unmappedAccounts.accountCode} = ANY(${codes})`,
          ),
        );

      return result;
    })(),
    (e) => new DatabaseError("bulkCreateMappings", e),
  );
}

export function deleteMapping(
  db: Database,
  mappingId: string,
): ResultAsync<void, MappingNotFoundError | DatabaseError> {
  return ResultAsync.fromPromise(
    (async () => {
      const result = await db
        .delete(accountMappings)
        .where(eq(accountMappings.id, mappingId))
        .returning();

      if (result.length === 0) {
        throw new MappingNotFoundError(mappingId);
      }
    })(),
    (e) => {
      if (e instanceof MappingNotFoundError) return e;
      return new DatabaseError("deleteMapping", e);
    },
  );
}

// Unmapped Accounts operations
export function getUnmappedAccounts(
  db: Database,
  clientId: string,
  includeResolved = false,
): ResultAsync<UnmappedAccount[], DatabaseError> {
  return ResultAsync.fromPromise(
    (async () => {
      const conditions = [eq(unmappedAccounts.clientId, clientId)];

      if (!includeResolved) {
        conditions.push(eq(unmappedAccounts.resolved, false));
      }

      return db
        .select()
        .from(unmappedAccounts)
        .where(and(...conditions))
        .orderBy(desc(unmappedAccounts.occurrences));
    })(),
    (e) => new DatabaseError("getUnmappedAccounts", e),
  );
}

export function registerUnmappedAccount(
  db: Database,
  data: {
    clientId: string;
    accountCode: string;
    accountName?: string;
    sourceDocument?: string;
  },
): ResultAsync<
  {
    alreadyMapped: boolean;
    mapping?: AccountMapping;
    unmapped?: UnmappedAccount;
  },
  DatabaseError
> {
  return ResultAsync.fromPromise(
    (async () => {
      // Check if already mapped
      const existingMapping = await db
        .select()
        .from(accountMappings)
        .where(
          and(
            eq(accountMappings.clientId, data.clientId),
            eq(accountMappings.clientAccountCode, data.accountCode),
          ),
        );

      if (existingMapping.length > 0) {
        return { alreadyMapped: true, mapping: existingMapping[0] };
      }

      // Check if already in unmapped list
      const existing = await db
        .select()
        .from(unmappedAccounts)
        .where(
          and(
            eq(unmappedAccounts.clientId, data.clientId),
            eq(unmappedAccounts.accountCode, data.accountCode),
          ),
        );

      if (existing.length > 0 && existing[0]) {
        // Increment occurrences
        const [updated] = await db
          .update(unmappedAccounts)
          .set({
            occurrences: sql`${unmappedAccounts.occurrences} + 1`,
            accountName: data.accountName || existing[0].accountName,
          })
          .where(eq(unmappedAccounts.id, existing[0].id))
          .returning();

        return { alreadyMapped: false, unmapped: updated };
      }

      // Create new unmapped record
      const [unmapped] = await db
        .insert(unmappedAccounts)
        .values({
          clientId: data.clientId,
          accountCode: data.accountCode,
          accountName: data.accountName,
          sourceDocument: data.sourceDocument,
        })
        .returning();

      return { alreadyMapped: false, unmapped };
    })(),
    (e) => new DatabaseError("registerUnmappedAccount", e),
  );
}

// Resolve account code (find internal account for client account)
export function resolveAccountCode(
  db: Database,
  clientId: string,
  clientAccountCode: string,
): ResultAsync<
  {
    internalAccountId: string;
    internalCode: string;
    internalName: string;
  } | null,
  DatabaseError
> {
  return ResultAsync.fromPromise(
    (async () => {
      const mapping = await db
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
            eq(accountMappings.clientId, clientId),
            eq(accountMappings.clientAccountCode, clientAccountCode),
          ),
        );

      if (mapping.length === 0 || !mapping[0]?.internalCode) {
        return null;
      }

      return {
        internalAccountId: mapping[0].internalAccountId,
        internalCode: mapping[0].internalCode,
        internalName: mapping[0].internalName || "",
      };
    })(),
    (e) => new DatabaseError("resolveAccountCode", e),
  );
}

// Suggest mapping based on account code prefix
export function suggestMapping(
  db: Database,
  clientAccountCode: string,
): ResultAsync<ChartAccount[], DatabaseError> {
  return ResultAsync.fromPromise(
    (async () => {
      const suggestions: ChartAccount[] = [];

      // Try different prefix lengths
      for (let len = clientAccountCode.length; len >= 2; len--) {
        const prefix = clientAccountCode.substring(0, len);
        const matches = await db
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
          break;
        }
      }

      return suggestions;
    })(),
    (e) => new DatabaseError("suggestMapping", e),
  );
}

// Get client with mapping statistics
export function getClientWithMappingStats(
  db: Database,
  clientId: string,
): ResultAsync<
  {
    client: typeof clients.$inferSelect;
    mappedAccountsCount: number;
    unmappedAccountsCount: number;
  },
  ClientNotFoundError | DatabaseError
> {
  return ResultAsync.fromPromise(
    (async () => {
      const [client] = await db
        .select()
        .from(clients)
        .where(eq(clients.id, clientId));

      if (!client) {
        throw new ClientNotFoundError(clientId);
      }

      const mappingCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(accountMappings)
        .where(eq(accountMappings.clientId, clientId));

      const unmappedCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(unmappedAccounts)
        .where(
          and(
            eq(unmappedAccounts.clientId, clientId),
            eq(unmappedAccounts.resolved, false),
          ),
        );

      return {
        client,
        mappedAccountsCount: Number(mappingCount[0]?.count || 0),
        unmappedAccountsCount: Number(unmappedCount[0]?.count || 0),
      };
    })(),
    (e) => {
      if (e instanceof ClientNotFoundError) return e;
      return new DatabaseError("getClientWithMappingStats", e);
    },
  );
}
