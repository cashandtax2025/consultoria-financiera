/**
 * Client domain business logic
 */
import {
  and,
  asc,
  eq,
  type NeonHttpDatabase,
  sql,
} from "@consultoria-financiera/db";
import { clients } from "@consultoria-financiera/db/schema/clients";
import { err, ok, ResultAsync } from "neverthrow";
import {
  ClientAlreadyExistsError,
  ClientNotFoundError,
  DatabaseError,
  GroupNotFoundError,
} from "../errors";

// Types
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

export interface ClientService {
  getAll(db: NeonHttpDatabase): ResultAsync<Client[], DatabaseError>;
  getById(
    db: NeonHttpDatabase,
    id: string,
  ): ResultAsync<Client, ClientNotFoundError | DatabaseError>;
  create(
    db: NeonHttpDatabase,
    data: NewClientInput,
  ): ResultAsync<
    Client,
    ClientAlreadyExistsError | GroupNotFoundError | DatabaseError
  >;
  update(
    db: NeonHttpDatabase,
    id: string,
    data: Partial<NewClientInput>,
  ): ResultAsync<
    Client,
    ClientNotFoundError | GroupNotFoundError | DatabaseError
  >;
  delete(
    db: NeonHttpDatabase,
    id: string,
  ): ResultAsync<void, ClientNotFoundError | DatabaseError>;
}

export interface NewClientInput {
  taxId: string;
  name: string;
  sector: string;
  companyType: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  groupId?: string;
  groupTaxId?: string;
  createdBy?: string;
}

// Service implementation
export const clientService: ClientService = {
  getAll(db) {
    return ResultAsync.fromPromise(
      db.select().from(clients).orderBy(asc(clients.name)),
      (e) => new DatabaseError("getAll clients", e),
    );
  },

  getById(db, id) {
    return ResultAsync.fromPromise(
      db.select().from(clients).where(eq(clients.id, id)).limit(1),
      (e) => new DatabaseError("getById client", e),
    ).andThen((result) => {
      if (result.length === 0 || !result[0]) {
        return err(new ClientNotFoundError(id));
      }
      return ok(result[0]);
    });
  },

  create(db, data) {
    return ResultAsync.fromPromise(
      (async () => {
        // Resolve group ID from group tax ID if provided
        let groupId = data.groupId;
        if (data.groupTaxId && !groupId) {
          const groupResult = await db
            .select({ id: clients.id })
            .from(clients)
            .where(eq(clients.taxId, data.groupTaxId))
            .limit(1);

          if (groupResult.length > 0 && groupResult[0]) {
            groupId = groupResult[0].id;
          } else {
            throw new GroupNotFoundError(data.groupTaxId);
          }
        }

        const result = await db
          .insert(clients)
          .values({
            taxId: data.taxId,
            name: data.name,
            sector: data.sector as typeof clients.$inferInsert.sector,
            companyType:
              data.companyType as typeof clients.$inferInsert.companyType,
            email: data.email,
            phone: data.phone,
            address: data.address,
            notes: data.notes,
            groupId,
            groupTaxId: data.groupTaxId,
            createdBy: data.createdBy,
          })
          .returning();

        if (!result[0]) {
          throw new DatabaseError(
            "create client",
            new Error("Insert returned no rows"),
          );
        }
        return result[0];
      })(),
      (e) => {
        if (e instanceof GroupNotFoundError) return e;
        // Check for unique constraint violations
        const errorMsg = String(e);
        if (errorMsg.includes("tax_id")) {
          return new ClientAlreadyExistsError("taxId", data.taxId);
        }
        if (errorMsg.includes("email")) {
          return new ClientAlreadyExistsError("email", data.email);
        }
        if (errorMsg.includes("phone")) {
          return new ClientAlreadyExistsError("phone", data.phone);
        }
        return new DatabaseError("create client", e);
      },
    );
  },

  update(db, id, data) {
    return ResultAsync.fromPromise(
      (async () => {
        // Resolve group ID from group tax ID if provided
        let groupId = data.groupId;
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
              throw new GroupNotFoundError(data.groupTaxId);
            }
          }
        }

        const updateData: Partial<typeof clients.$inferInsert> = {};
        if (data.taxId !== undefined) updateData.taxId = data.taxId;
        if (data.name !== undefined) updateData.name = data.name;
        if (data.sector !== undefined)
          updateData.sector = data.sector as typeof clients.$inferInsert.sector;
        if (data.companyType !== undefined)
          updateData.companyType =
            data.companyType as typeof clients.$inferInsert.companyType;
        if (data.email !== undefined) updateData.email = data.email;
        if (data.phone !== undefined) updateData.phone = data.phone;
        if (data.address !== undefined) updateData.address = data.address;
        if (data.notes !== undefined) updateData.notes = data.notes;
        if (groupId !== undefined) updateData.groupId = groupId;
        if (data.groupTaxId !== undefined)
          updateData.groupTaxId = data.groupTaxId;
        updateData.updatedAt = new Date();

        const [client] = await db
          .update(clients)
          .set(updateData)
          .where(eq(clients.id, id))
          .returning();

        if (!client) {
          throw new ClientNotFoundError(id);
        }

        return client;
      })(),
      (e) => {
        if (e instanceof ClientNotFoundError) return e;
        if (e instanceof GroupNotFoundError) return e;
        return new DatabaseError("update client", e);
      },
    );
  },

  delete(db, id) {
    return ResultAsync.fromPromise(
      (async () => {
        const result = await db
          .delete(clients)
          .where(eq(clients.id, id))
          .returning();
        if (result.length === 0) {
          throw new ClientNotFoundError(id);
        }
      })(),
      (e) => {
        if (e instanceof ClientNotFoundError) return e;
        return new DatabaseError("delete client", e);
      },
    );
  },
};

// Search clients with filters
export function searchClients(
  db: NeonHttpDatabase,
  options: {
    search?: string;
    onlyPendingOnboarding?: boolean;
  },
): ResultAsync<Client[], DatabaseError> {
  return ResultAsync.fromPromise(
    (async () => {
      const conditions = [];

      if (options.search) {
        conditions.push(
          sql`(${clients.name} ILIKE ${`%${options.search}%`} OR ${clients.taxId} ILIKE ${`%${options.search}%`})`,
        );
      }

      if (options.onlyPendingOnboarding) {
        conditions.push(eq(clients.onboardingCompleted, false));
      }

      return db
        .select()
        .from(clients)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(asc(clients.name));
    })(),
    (e) => new DatabaseError("searchClients", e),
  );
}

// Complete client onboarding
export function completeOnboarding(
  db: NeonHttpDatabase,
  clientId: string,
): ResultAsync<Client, ClientNotFoundError | DatabaseError> {
  return ResultAsync.fromPromise(
    (async () => {
      const [client] = await db
        .update(clients)
        .set({
          onboardingCompleted: true,
          updatedAt: new Date(),
        })
        .where(eq(clients.id, clientId))
        .returning();

      if (!client) {
        throw new ClientNotFoundError(clientId);
      }

      return client;
    })(),
    (e) => {
      if (e instanceof ClientNotFoundError) return e;
      return new DatabaseError("completeOnboarding", e);
    },
  );
}
