/**
 * Accounting domain errors
 */
import { AppError } from "./base";

export class AccountNotFoundError extends AppError {
  readonly _tag = "AccountNotFoundError";
  readonly accountId: string;

  constructor(accountId: string) {
    super(`Account (${accountId}) not found`);
    this.accountId = accountId;
  }
}

export class AccountCodeAlreadyExistsError extends AppError {
  readonly _tag = "AccountCodeAlreadyExistsError";
  readonly code: string;

  constructor(code: string) {
    super(`Account with code "${code}" already exists`);
    this.code = code;
  }
}

export class MappingNotFoundError extends AppError {
  readonly _tag = "MappingNotFoundError";
  readonly mappingId: string;

  constructor(mappingId: string) {
    super(`Account mapping (${mappingId}) not found`);
    this.mappingId = mappingId;
  }
}

export class MappingAlreadyExistsError extends AppError {
  readonly _tag = "MappingAlreadyExistsError";
  readonly clientId: string;
  readonly clientAccountCode: string;

  constructor(clientId: string, clientAccountCode: string) {
    super(
      `Mapping for client account "${clientAccountCode}" already exists for client ${clientId}`,
    );
    this.clientId = clientId;
    this.clientAccountCode = clientAccountCode;
  }
}

export class InvalidAccountDataError extends AppError {
  readonly _tag = "InvalidAccountDataError";
  readonly field: string;
  readonly reason: string;

  constructor(field: string, reason: string) {
    super(`Invalid account data: ${field} - ${reason}`);
    this.field = field;
    this.reason = reason;
  }
}

export class UnmappedAccountNotFoundError extends AppError {
  readonly _tag = "UnmappedAccountNotFoundError";
  readonly clientId: string;
  readonly accountCode: string;

  constructor(clientId: string, accountCode: string) {
    super(`Unmapped account "${accountCode}" not found for client ${clientId}`);
    this.clientId = clientId;
    this.accountCode = accountCode;
  }
}
